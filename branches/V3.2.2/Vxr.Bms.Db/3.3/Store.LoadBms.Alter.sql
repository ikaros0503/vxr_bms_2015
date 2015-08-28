/****** Object: SqlProcedure [dbo].[LoadBms] Script Date: 04/08/2015 10:38:15 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[LoadBms] @compId int = 0, @tripId int = 0, @trDate date = null, @trTime time = null
As
---------------------------
	DECLARE @EndTime datetime
	DECLARE @StartTime datetime 
	SELECT @StartTime=GETDATE() 
---------------------------
	declare @cId int
	declare @tId int
	declare @date date
	declare @tD date
	declare @time time
	declare @tT nvarchar (5)
	declare @datetime datetime
	declare @info nvarchar (max)
	declare @pos int
	declare @t time
	declare @tripTime time
	declare @ftt time = null
	declare @rlt int = 0
	declare @tcTable table 
	(
		Id int,
		Time time
	)
	set @time = convert(nvarchar(5), GETDATE(), 114)
	set @datetime = CAST(@date AS DATETIME) + CAST(@time AS DATETIME)
	set @cId= @compId
	set @tId = @tripId
	set @tD = @trDate
	
	if (@trDate is not null)
	begin
		set @date = convert(nvarchar(10), @trDate, 120)
	end
	else 
	begin
		set @date = convert(nvarchar(10), GETDATE(), 120)
	end

	if (@tId is null or @tId = 0) 
	begin
		select top 1 @tId = Id from zgcl_Trip04 where CompId = @cId and IsPrgStatus != 3 and Type=1 order by type, DisplayOrder,name asc;
	end

	-- 1) Trip
	select Id, Name, Info, SeatTemplateInfo, FareInfo, StatusInfo, BaseId, Type, Time, Alias, TeamInfo, VehicleInfo, FromArea, ToArea, Note, RouteInfo, SeatSummaryInfo, TotalSeats, ClosedStatus, PassengerMoney, ProductMoney, FeeMoney, BranchReceiveProduct, RealDepartureTime, PickedPointsInfo, TransferPointsInfo, NewFare, DisplayOrder, Description
		from zgcl_Trip04 where CompId=@cId and  (IsPrgStatus is null or IsPrgStatus != 3) and Info is not null and len(Info)>0 and (Type=1 or (Type=2 and Date = @date)) order by type, DisplayOrder, name asc;

	insert into @tcTable (Id, Time) 
		(select Id, Time from zgcl_Trip04 where CompId=@cId and BaseId=@tId and (IsPrgStatus is null or IsPrgStatus != 3) and (Type=2 and Date = @date) and StatusInfo=2)

	-- 2) Bus_ticket_Status
	select Id,XTypeId,XAgentId,XBranchId,XOperatorId,XCompanyId,XRouteId,XTripId,XDate,XTime,XStatus,Info,TimeLimit
		from Bus_Tickets_Status_View04 where XCompanyId=@cId and IsPrgStatus != 3 and XStatus=1 and XTypeId in (2,5) and XTripId=@tId and XDate=@date

	-- 3) TripTotalSeatInfo
	select TripId, cast(TripDate as date) as TripDate, CONVERT(VARCHAR(5),TripDate,108) AS OnHour, COUNT(*) AS Totals                                      
		from zgcl_Ticket03 where convert(nvarchar(10), TripDate, 120) = @date AND TripId = @tId AND Status IN (1,2,5,8)  GROUP BY TripId, CAST(TripDate as date), CONVERT(VARCHAR(5),TripDate,108)
	
	-- 4) Ticket
	select @info = Info from zgcl_Trip04 where Id=@tId
	if (@trTime is null) 
	begin
		set @rlt = 1
	end
	else 
	begin
		set @tT = convert(nvarchar(5), @trTime, 114)
		if (@info like @tT + N'%' or @info like N'%' + @tT + N'%' or @info like N'%' + @tT) --check input time is exist or not
		begin 
			set @rlt = 0
		end
		else 
		begin -- check chuyến tăng cường
			select top 1 @ftt = Time from @tcTable where Time = @tT
			if (@ftt is null) 
			begin
				set @rlt = 1
			end
			else 
			begin
				set @rlt = 0
			end
		end
	end
	if (@rlt = 1)  -- load lại time
	begin
		if (LEN(@info) < 6)
		begin 
			SELECT @tripTime = @info      
			SELECT @info = ''
		end
		else
		begin 
			select @pos = CHARINDEX('~', @info)
			SELECT @tripTime = SUBSTRING(@info, 1, @pos - 1)
			SELECT @info = SUBSTRING(@info, @pos + 1, len(@info) - @pos) + N'~'
		end 

		while len(@info) > 3
		begin
			set @pos = CHARINDEX('~', @info)
			SET @t = SUBSTRING(@info, 1, @pos - 1)
			if (@t > @time)
			begin
				if (@tripTime >= @time) 
				begin
					if (@t < @tripTime) 
					begin
						set @tripTime = @t;
					end
				end
				else
				begin 
					set @tripTime = @t
				end
			end		
			SET @info = SUBSTRING(@info, @pos + 1, len(@info) - @pos)
		end

		set @ftt = null
		if (@tripTime <= @time) --trường hợp không có chuyến nào gần nhất so với thời gian hiện tại
		begin
			select top 1 @ftt = Time from @tcTable where Time < @tripTime order by Time asc
		end
		else begin
			select top 1 @ftt = Time from @tcTable where Time < @tripTime and Time >= @time order by Time asc
		end

		if (@ftt is not null)
		begin
			set @tripTime = @ftt
		end
	end
	else
	begin
		set @tripTime = @tT
	end

	update Ticket
	set Status = 3, CanceledDate = GETDATE(), CancelInfo = N'Vé hết hạn', CanceledUser = 'server',
	IsPrgHistoryInfo = (IsPrgHistoryInfo + N'~00##00##00##server##' + CONVERT(VARCHAR(19),GETDATE(), 120) + N'##UpdateBookTicket##{"TripAlias":0,"Status":3,"CanceledUser":"server","CanceledAgentId":0,"CancelInfo":"Vé hết hạn"}')
	where CompId = @cId and TripId = @tId and (TripDate >= (cast(@date as datetime) + cast('00:00' as datetime))) and (TripDate < (cast(@date as datetime) + cast('23:59' as datetime))) 
	and Status = 1 and Type = 1 and ExpiredTime is not null and ExpiredTime < GETDATE()

	select Id,TripId,AgentId,TripDate,SeatCode,IssueDate,PickupDate,CustomerInfo,Status,Fare,Note,PickupInfo,Serial,PaymentInfo,IsPrgHistoryInfo,Code,PassCode,FromValid,ToValid,IsPrgUpdatedDate,AgentInfo,Surcharge,TripAlias,CreatedUser,UserCharge,StageCode,Deposit,Discount,FromArea,ToArea,SeatType,Debt,CanceledDate,CancelInfo,Type,ChargeDate,SNote,ResponsibilityUser,PickOrReturnDate,StaffName,CancelType,NumOfSend,FirstUserUpdated,ExpiredTime,PrintStatus,IssuedUser,NumOfPrint,FromStop,ToStop
			from zgcl_Ticket05 where Status in (1,2,3,4,5,8) and TripDate = cast(@date as datetime) + cast(@tripTime as datetime) and TripId = @tId 
			and (Type != 2 OR (Type = 2 AND (Status = 2 OR (Status = 1 and ExpiredTime >= GETDATE()))))

	-- 5) Company
	select Id, Type, Code, Name, AddressInfo, PhoneInfo from zgcl_Company00 where BaseId = @cId and IsPrgStatus = 1 and Type in (2,3)

	-- 6) Phoi Templates
	select * from Phoi_SeatTemplate where CompId=@cId and IsPrgStatus=1

-------------------------------
	SELECT @EndTime=GETDATE()
	SELECT DATEDIFF(ms,@StartTime,@EndTime) AS [Duration in millisecs] 
-------------------------------
