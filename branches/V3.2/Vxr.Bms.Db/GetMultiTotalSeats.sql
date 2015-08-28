alter procedure BGetMultiTotalSeats @cId int, @tripId int, @tripDate varchar(max)
as
	
	DECLARE @startTime DATETIME = GETDATE() 
	DECLARE @endTime DATETIME

	DECLARE @paInfo varchar(max)
	DECLARE @time table (Time varchar(max))
	set @paInfo = (select Info from Trip where Id = @tripId and Type = 1)
	-- Parent Trip 
	insert into @time
	select Value from dbo.SplitTime(@paInfo, '~')
	-- Extended Trip
	insert into @time
	select Time from Trip where CompId = @cId and BaseId = @tripId and Date = @tripDate and Type = 2 and StatusInfo = 2

	DECLARE @re table (Time varchar(max), TotalBookedSeats int, TotalExpiredSeats int)
	DECLARE @condTime varchar(max)

	DECLARE @tick table (Id int, Status int, ExpiredTime DATETIME)

	DECLARE time_cursor CURSOR FOR 
	SELECT Time	FROM @time order by Time
	OPEN time_cursor

	FETCH NEXT FROM time_cursor INTO @condTime

	WHILE @@FETCH_STATUS = 0
	BEGIN
		DECLARE @totalBookedSeats int = 0
		DECLARE @totalExpiredSeats int = 0
		delete from @tick

		insert into @tick
		select Id,Status,ExpiredTime from Ticket where CompId = @cId and TripId = @tripId and TripDate = (@tripDate + ' ' + @condTime + ':00') 

		set @totalBookedSeats = (select count(Id) from @tick where Status != 3 and (Status <> 1 or (Status = 1 and (ExpiredTime is null or ExpiredTime > GETDATE()))))
		set @totalExpiredSeats = (select count(Id) from @tick where Status = 1 and ExpiredTime < GETDATE())	

		insert into @re(Time,TotalBookedSeats,TotalExpiredSeats) values(@condTime,@totalBookedSeats,@totalExpiredSeats)
		FETCH NEXT FROM time_cursor INTO @condTime		
	END 
	CLOSE time_cursor;
	DEALLOCATE time_cursor;

	select * from @re

	SELECT @endTime = GETDATE()
	SELECT DATEDIFF(ms, @startTime, @endTime) AS [Durations in millisecs]
GO

--update Ticket set ExpiredTime = '2015-07-30 23:00:00:000' where Code = '5T8Q1N'

execute BGetMultiTotalSeats 80, 1115, '2015-07-31'

--select Id,Status,TripDate,ExpiredTime from Ticket where CompId = 80 and TripId = 1115 and TripDate = '2015-07-31 21:00:00' 