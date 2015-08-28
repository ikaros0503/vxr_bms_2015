USE [VXR_BMS_003]
GO

/****** Object:  StoredProcedure [dbo].[LoadTrips]    Script Date: 16/06/2015 5:15:59 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





ALTER procedure [dbo].[LoadTrips] 
	@compId int = 0, 
	@compIds varchar (max),
	@routeId int = 0, 
	@routeIds varchar (max),
	@xDate date = null,
	@yDate date = null,  
	@zDate date = null,
	@fromAreaId int,
	@fromAreaTxt nvarchar (max),
	@toAreaId int,
	@toAreaTxt nvarchar (max),
	@isSearchSubArea bit,
	@isSearchRevertArea bit,
	@vBookingConfig int = null,
	@vPaymentConfig int = null,
	@compType int = null,
	@isGetRoute bit,
	@qFields varchar (max) ,
	@sFields varchar (max) ,
	@isGetNo bit
As

declare @endTime datetime
	declare @startTime datetime 
	select @startTime=GETDATE() 
--------------------------- Declares ---------------------------

	declare @coId int -- Company Id
	declare @coIds varchar (max)
	declare @roId int -- Route Id
	declare @roIds varchar (max)

	declare @xtrDate date -- From Departure Date
	declare @ytrDate date -- Trip Departure Date
	declare @ztrDate date -- To Departure Date

	declare @frAId int -- From Area Id
	declare @toAId int -- To Area Id
	declare @frArea nvarchar(128) -- FromArea search value in FromArea
	declare @frAreaKw nvarchar(max)
	declare @toArea nvarchar(128) -- ToArea search value in ToArea
	declare @toAreaKw nvarchar(max)
	declare @frAreaInfo nvarchar(128) -- FromArea search value in RouteInfo
	declare @toAreaInfo nvarchar(128) -- ToArea search value in RouteInfo
	declare @frAreaInfoVal nvarchar(128) -- FromArea search CHARINDEX value in RouteInfo
	declare @toAreaInfoVal nvarchar(128) -- ToArea search CHARINDEX value in RouteInfo
	declare @isSSubArea bit -- Is Search Sub Area
	declare @isSRevertArea bit -- Is Search Sub Area
	declare @hasOfflineContract bit -- Has Offline Contract
	declare @hasOnlineContract bit -- Has Online Contract
	declare @hasBmsContract bit -- Has Bms Contract

	declare @vBookingCfg int = null
	declare @vPaymentCfg int = null
	

	declare @vBookingWeb bit = null
	declare @vBookingDly bit = null
	declare @vBookingWid bit = null
	declare @vBookingAff bit = null

	declare @vPaymentOli bit = null
	declare @vPaymentCod bit = null
	declare @vPaymentDly bit = null

	declare @coType int -- Company Type
	declare @isGetRou bit = null
	declare @fields nvarchar (max)  = 'Id, Type, Code, Name, Note, Alias, Date, Time, FromArea, ToArea, Info, RouteInfo, MasterFare, FareInfo, VxrFareInfo, VBookingConfig, VPaymentConfig, HasOfflineContract, HasOnlineContract, CompId, CompIdName, IsPrgStatus, BaseId'
	declare @sortFields varchar (max) = 'SortCode, Type, BaseId, Time'

	declare @isGetRowNum bit

	declare @tripTable VTrips
	declare @cTripId bigint
	declare @cTripType int
	declare @cTripCode nvarchar(512) 
	declare @cTripName nvarchar(256) 
	declare @cTripNote nvarchar(max) 
	declare @cTripAlias int
	declare @cTripDate datetime
	declare @cTripTime nvarchar(32) 
	declare @cTripFromId bigint 
	declare @cTripToId bigint
	declare @cTripFromArea nvarchar(128) 

	declare @cTripToArea nvarchar(128) 
	declare @cTripInfo nvarchar(max) 
	declare @cTripRouteInfo nvarchar(max) 
	declare @cTripVxrDiscount int
	declare @cTripVxrMasterFare int
	declare @cTripFareInfo nvarchar(max) 
	declare @cTripVxrFareInfo nvarchar(max) 

	declare @cTripVBookingConfig int
	declare @cTripBVBookingConfig int
	declare @cTripVBookingText nvarchar(max) 

	declare @cTripVPaymentConfig int
	declare @cTripBVPaymentConfig int
	declare @cTripVPaymentText nvarchar(max)

	declare @cTripVAppConfig int
	declare @cTripBVAppConfig int
	declare @cTripVAppText nvarchar(max)

	declare @cTripHasOfflineContract bit
	declare @cTripHasOnlineContract bit
	declare @cTripHasBmsContract bit
	declare @cTripCompId bigint  
	declare @cTripCompIdName nvarchar(128) 
	declare @cTripBaseId bigint 
	declare @cTripSortCode bigint
	declare @cTripMasterFare decimal
	declare @cTripIsPrgStatus int

	declare @oTripId bigint = 0
	declare @oTripType int = 2
    declare @oTripDate datetime
	declare @oTripAlias int = 0

	declare @cTime varchar(32)
	declare @cTimeId int

	declare @isMultiComp bit
	--BEGIN TRY
   

---------------------------  Set parameter values ---------------------------

	set @coId = @compId
	set @coIds = @compIds
	if(@coIds is null) set @coIds = @coId

	set @roId = @routeId
	set @roIds = @routeIds
	if(@roIds is null) set @roIds = @roId

	set @xtrDate = @xDate
	set @ytrDate = @yDate
	set @ztrDate = @zDate

	set @frAId = @fromAreaId
	set @toAId = @toAreaId

	set @frAreaKw = @fromAreaTxt
	set @toAreaKw = @toAreaTxt

	if(@frAreaKw is not null) set @frAreaKw = N'%' + @frAreaKw + '%'
	if(@toAreaKw is not null) set @toAreaKw = N'%' + @toAreaKw + '%'

	set @frArea = N'%~'+ CAST(@frAId AS varchar(32)) + '%'
	set @toArea = N'%~'+ CAST(@toAId AS varchar(32)) + '%'
	set @frAreaInfo = N'%~'+ CAST(@frAId AS varchar(32)) + '%'
	set @toAreaInfo = N'%~'+ CAST(@toAId AS varchar(32)) + '%'
	set @frAreaInfoVal = N'~'+ CAST(@frAId AS varchar(32))
	set @toAreaInfoVal = N'~'+ CAST(@toAId AS varchar(32))
	set @isSSubArea = @isSearchSubArea
	if (@isSSubArea = 0) set @isSSubArea = null
	set @isSRevertArea = @isSearchRevertArea
	if (@isSRevertArea = 0) set @isSRevertArea = null

	set @coType = @compType
	if(@coType is not null) set @hasOfflineContract = dbo.CheckValueInBase2(@coType, 1)
	if(@coType is not null) set @hasOnlineContract = dbo.CheckValueInBase2(@coType, 2)
	if(@coType is not null) set @hasBmsContract = dbo.CheckValueInBase2(@coType, 3)

	--select @hasOfflineContract, @hasOnlineContract, @hasBmsContract

	set @vBookingCfg = @vBookingConfig
	if(@vBookingCfg is not null) set @vBookingWeb = dbo.CheckValueInBase2(@vBookingCfg, 1)
	if(@vBookingCfg is not null) set @vBookingDly = dbo.CheckValueInBase2(@vBookingCfg, 2)
	if(@vBookingCfg is not null) set @vBookingWid = dbo.CheckValueInBase2(@vBookingCfg, 3)
	if(@vBookingCfg is not null) set @vBookingAff = dbo.CheckValueInBase2(@vBookingCfg, 4)
	
	set @vPaymentCfg = @vPaymentConfig
	if(@vPaymentCfg is not null) set @vPaymentOli = dbo.CheckValueInBase2(@vPaymentCfg, 1)
	if(@vPaymentCfg is not null) set @vPaymentCod = dbo.CheckValueInBase2(@vPaymentCfg, 2)
	if(@vPaymentCfg is not null) set @vPaymentDly = dbo.CheckValueInBase2(@vPaymentCfg, 3)


	if(@isGetRoute is not null) set @isGetRou = @isGetRoute
	if(@qFields is not null) set @fields = @qFields
	if(@sfields is not null) set @sortFields = @sfields
	if(@isGetNo is not null) set @isGetRowNum = @isGetNo

--------------------------- Insert Trips ---------------------------
	
	INSERT @tripTable
	select Id, Type, Code, Name, Note, Alias, Date, Time, FromId, ToId, FromArea, ToArea, Info, RouteInfo, 
	0 as MasterFare, FareInfo, VxrDiscount, 0 as VxrMasterFare, VxrFareInfo, 
	VBookingConfig, BVBookingConfig, '' as VBookingText, VPaymentConfig, BVPaymentConfig, '' as VPaymentText, VAppConfig, BVAppConfig, '' as VAppText,
	HasOfflineContract, HasOnlineContract, HasBmsContract, CompId, CompIdName, IsPrgStatus, BaseId, BaseId as SortCode
		from zgcl_Trip07
		where (Type = 2 and Time is not null) 
		and (@coId is null or @coId = CompId) 
		and ((@coIds is null) or (CompId in(select value from dbo.SplitIds(@coIds, ','))))
		and (@roId is null or @roId = BaseId)
		and ((@roIds is null) or (BaseId in(select value from dbo.SplitIds(@roIds, ','))))
		and (@ytrDate is null or @ytrDate = Date)
		and (@xtrDate is null or @xtrDate <= Date)
		and (@ztrDate is null or @ztrDate >= Date)
		and (
				((@frAId is null or FromArea like @frArea) and (@toAId is null or ToArea like @toArea)) or 
				(@isSRevertArea = 1 and (@frAId is null or ToArea like @frArea) and (@toAId is null or FromArea like @toArea)) or 
				(@isSSubArea = 1 and ((@frAId is null or RouteInfo like @frAreaInfo) and (@toAId is null or RouteInfo like @toAreaInfo)) and ((@isSRevertArea = 1) or CHARINDEX(@frAreaInfoVal, RouteInfo) < CHARINDEX(@toAreaInfoVal, RouteInfo)))
			)
		and (
			(@coType is null) or 
			(@hasOfflineContract = 1 and HasOfflineContract = 1) or 
			--(@hasOfflineContract = 1 or dbo.HasOfflineConfig(BaseId, Id) = 1) or
			(@hasOnlineContract = 1 and HasOnlineContract = 1)  or 
			--(@hasOnlineContract = 1 or dbo.HasOnlineConfig(BaseId, Id) = 1) or
			(@hasBmsContract = 1 and HasBmsContract = 1 and (dbo.CheckValueInBase2(VAppConfig, 1) = 1 or dbo.CheckValueInBase2(BVAppConfig, 1) = 1))
		)
		and (
			(@vBookingCfg is null) or
			(@vBookingWeb = 1 and dbo.CheckValueInBase2(VBookingConfig, 1) = 1) or 
			(@vBookingDly = 1 and dbo.CheckValueInBase2(VBookingConfig, 2) = 1) or
			(@vBookingWid = 1 and dbo.CheckValueInBase2(VBookingConfig, 3) = 1) or
			(@vBookingAff = 1 and dbo.CheckValueInBase2(VBookingConfig, 4) = 1)
		)
		and (
			(@vPaymentCfg is null) or
			(@vPaymentOli = 1 and dbo.CheckValueInBase2(VPaymentConfig, 1) = 1) or 
			(@vPaymentCod = 1 and dbo.CheckValueInBase2(VPaymentConfig, 2) = 1) or
			(@vPaymentDly = 1 and dbo.CheckValueInBase2(VPaymentConfig, 3) = 1)
		) and (
			(@frAreaKw is null) or 
			(FromArea like @frAreaKw) or 
			(Keywords like @frAreaKw) or (IsPrgUnsignKeywords like @frAreaKw)
		)
		and (
			(@toAreaKw is null) or 
			(ToArea like @toAreaKw) or
			(Keywords like @toAreaKw) or (IsPrgUnsignKeywords like @toAreaKw)
		)
--------------------------- Update Trips ---------------------------
		DECLARE tripCursor CURSOR FOR 
			select * from @tripTable

		OPEN tripCursor

		FETCH NEXT FROM tripCursor INTO @cTripId, @cTripType, @cTripCode, @cTripName, @cTripNote, @cTripAlias, @cTripDate, @cTripTime, @cTripFromId, @cTripToId, @cTripFromArea, @cTripToArea, @cTripInfo, @cTripRouteInfo, 
		@cTripMasterFare, @cTripFareInfo, @cTripVxrDiscount, @cTripVxrMasterFare, @cTripVxrFareInfo, 
		@cTripVBookingConfig, @cTripBVBookingConfig, @cTripVBookingText, @cTripVPaymentConfig, @cTripBVPaymentConfig, @cTripVPaymentText, @cTripVAppConfig, @cTripBVAppConfig, @cTripVAppText,
		@cTripHasOfflineContract, @cTripHasOnlineContract, @cTripHasBmsContract, 
		@cTripCompId, @cTripCompIdName, @cTripIsPrgStatus, @cTripBaseId, @cTripSortCode

	WHILE @@FETCH_STATUS = 0
	BEGIN
	print '---------- Route Id: ' + CAST(@cTripBaseId as nvarchar(max))
		if(@cTripFromId is null) 
		begin 
			set @cTripFromId = dbo.GetAreaIdFromInfo(@cTripFromArea)
			Update @tripTable set FromId = @cTripFromId
			Update Trip set FromId = @cTripFromId where Id = @cTripId
		end

		if(@cTripToId is null) 
		begin 
			set @cTripToId = dbo.GetAreaIdFromInfo(@cTripToArea)
			Update @tripTable set ToId = @cTripToId
			Update Trip set ToId = @cTripToId where Id = @cTripId
		end

		begin
			set @cTripMasterFare = dbo.GetFareFromInfo(@cTripFareInfo, @cTripFromId, @cTripToId)
			Update @tripTable set MasterFare = @cTripMasterFare where Id = @cTripId
		end
		begin
			set @cTripVxrMasterFare = dbo.GetFareFromInfo(@cTripVxrFareInfo, @cTripFromId, @cTripToId)
			Update @tripTable set VxrMasterFare = @cTripVxrMasterFare where Id = @cTripId
		end

		if(@cTripVBookingConfig is null) 
		begin
			set @cTripVBookingConfig = @cTripBVBookingConfig
			Update @tripTable set VBookingConfig = @cTripVBookingConfig where Id = @cTripId
		end
		begin
			set @cTripVBookingText = dbo.GetVBookingText(@cTripVBookingConfig)
			Update @tripTable set VBookingText = @cTripVBookingText where Id = @cTripId
		end

		if(@cTripVPaymentConfig is null) 
		begin
			set @cTripVPaymentConfig = @cTripBVPaymentConfig
			Update @tripTable set VPaymentConfig = @cTripVPaymentConfig where Id = @cTripId
		end
		begin
			set @cTripVPaymentText = dbo.GetVPaymentText(@cTripVPaymentConfig)
			Update @tripTable set VPaymentText = @cTripVPaymentText where Id = @cTripId
		end

		if(@cTripVAppConfig is null) 
		begin
			set @cTripVAppConfig = @cTripBVAppConfig
			Update @tripTable set VAppConfig = @cTripVAppConfig where Id = @cTripId
		end
		begin
			set @cTripVAppText = dbo.GetVAppText(@cTripHasBmsContract, @cTripHasOfflineContract, @cTripHasOnlineContract, @cTripVAppConfig)
			Update @tripTable set VAppText = @cTripVAppText where Id = @cTripId
		end

		-- [dbo].[GetVPaymentText]
		FETCH NEXT FROM tripCursor INTO @cTripId, @cTripType, @cTripCode, @cTripName, @cTripNote, @cTripAlias, @cTripDate, @cTripTime, @cTripFromId, @cTripToId, @cTripFromArea, @cTripToArea, @cTripInfo, @cTripRouteInfo, 
		@cTripMasterFare, @cTripFareInfo, @cTripVxrDiscount, @cTripVxrMasterFare, @cTripVxrFareInfo, 
		@cTripVBookingConfig, @cTripBVBookingConfig, @cTripVBookingText, @cTripVPaymentConfig, @cTripBVPaymentConfig, @cTripVPaymentText, @cTripVAppConfig, @cTripBVAppConfig, @cTripVAppText,
		@cTripHasOfflineContract, @cTripHasOnlineContract, @cTripHasBmsContract,
		@cTripCompId, @cTripCompIdName, @cTripIsPrgStatus, @cTripBaseId, @cTripSortCode
	END
   CLOSE tripCursor;
  DEALLOCATE tripCursor;
--------------------------- Reset variables ---------------------------
  --set @cTripBVPaymentConfig = null
--------------------------- Get Routes ---------------------------
	DECLARE routeCursor CURSOR FOR 
		select Id, Type, Code, Name, Note, Alias, Date, Time, FromId, ToId, FromArea, ToArea, Info, RouteInfo, 
		0 as MasterFare, FareInfo, VxrDiscount, 0 as VxrMasterFare, VxrFareInfo, 
		VBookingConfig, BVBookingConfig, '' as VBookingText ,VPaymentConfig, BVPaymentConfig, '' as VPaymentText, VAppConfig, BVAppConfig, '' as VAppText,
		HasOfflineContract, HasOnlineContract, HasBmsContract, 
		CompId, CompIdName, IsPrgStatus, BaseId, Id as SortCode
			from zgcl_Trip07 
			where (Type = 1 and IsPrgStatus != 3) 
			and (@coId is null or CompId = @coId)
			and (@coIds is null or CompId in(select value from dbo.SplitIds(@coIds, ',')))
			and (@roId is null or @roId = Id)
			and ((@roIds is null) or (Id in(select value from dbo.SplitIds(@roIds, ','))))
			and (
				((@frAId is null or FromArea like @frArea) and (@toAId is null or ToArea like @toArea)) or 
				(@isSRevertArea = 1 and (@frAId is null or ToArea like @frArea) and (@toAId is null or FromArea like @toArea)) or 
				(@isSSubArea = 1 and ((@frAId is null or RouteInfo like @frAreaInfo) and (@toAId is null or RouteInfo like @toAreaInfo)) and ((@isSRevertArea = 1) or CHARINDEX(@frAreaInfoVal, RouteInfo) < CHARINDEX(@toAreaInfoVal, RouteInfo)))
			)
			and (
				(@coType is null) or
				(@hasOfflineContract = 1 and HasOfflineContract = 1) or 
				--(@hasOfflineContract = 1 or dbo.HasOfflineConfig(Id, null) = 1) or
				(@hasOnlineContract = 1 and HasOnlineContract = 1) or
				--(@hasOnlineContract = 1 or dbo.HasOnlineConfig(Id, null) = 1) or
				(@hasBmsContract = 1 and HasBmsContract = 1 and (dbo.CheckValueInBase2(VAppConfig, 1) = 1 or dbo.CheckValueInBase2(BVAppConfig, 1) = 1))
			)
			and (
				(@vBookingCfg is null) or
				(@vBookingWeb = 1 and dbo.CheckValueInBase2(VBookingConfig, 1) = 1) or 
				(@vBookingDly = 1 and dbo.CheckValueInBase2(VBookingConfig, 2) = 1) or
				(@vBookingWid = 1 and dbo.CheckValueInBase2(VBookingConfig, 3) = 1) or
				(@vBookingAff = 1 and dbo.CheckValueInBase2(VBookingConfig, 4) = 1)
			)
			and (
				(@vPaymentCfg is null) or
				(@vPaymentOli = 1 and dbo.CheckValueInBase2(VPaymentConfig, 1) = 1) or 
				(@vPaymentCod = 1 and dbo.CheckValueInBase2(VPaymentConfig, 2) = 1) or
				(@vPaymentDly = 1 and dbo.CheckValueInBase2(VPaymentConfig, 3) = 1)
			)	and (
				(@frAreaKw is null) or 
				(FromArea like @frAreaKw)  or 
				(Keywords like @frAreaKw) or (IsPrgUnsignKeywords like @frAreaKw)
			)
			and (
				(@toAreaKw is null) or 
				(ToArea like @toAreaKw) or 
				(Keywords like @toAreaKw) or (IsPrgUnsignKeywords like @toAreaKw)
			)
	OPEN routeCursor

	FETCH NEXT FROM routeCursor INTO @cTripId, @cTripType, @cTripCode, @cTripName, @cTripNote, @cTripAlias,
	@cTripDate, @cTripTime, @cTripFromId, @cTripToId, @cTripFromArea, @cTripToArea, @cTripInfo, @cTripRouteInfo, 
	@cTripMasterFare, @cTripFareInfo, @cTripVxrDiscount, @cTripVxrMasterFare, @cTripVxrFareInfo, 
	@cTripVBookingConfig, @cTripBVBookingConfig, @cTripVBookingText, @cTripVPaymentConfig, @cTripBVPaymentConfig, @cTripVPaymentText, @cTripVAppConfig, @cTripBVAppConfig, @cTripVAppText,
	@cTripHasOfflineContract, @cTripHasOnlineContract, @cTripHasBmsContract,
	@cTripCompId, @cTripCompIdName, @cTripIsPrgStatus, @cTripBaseId, @cTripSortCode

	WHILE @@FETCH_STATUS = 0
	BEGIN
		print '---------- Route Id: ' + CAST(@cTripId as nvarchar(max))
		if(@cTripFromId is null) 
		begin 
			set @cTripFromId = dbo.GetAreaIdFromInfo(@cTripFromArea)
			Update @tripTable set FromId = @cTripFromId
			Update Trip set FromId = @cTripFromId where Id = @cTripId
		end
		if(@cTripToId is null) 
		begin 
			set @cTripToId = dbo.GetAreaIdFromInfo(@cTripToArea)
			if(@cTripToId != 0)
			begin
				Update @tripTable set ToId = @cTripToId
				Update Trip set ToId = @cTripToId where Id = @cTripId
			end
			
		end

		begin
			set @cTripMasterFare = dbo.GetFareFromInfo(@cTripFareInfo, @cTripFromId, @cTripToId)
			--Update @tripTable set MasterFare = @cTripMasterFare where Id = @cTripId
		end
		begin
			set @cTripVxrMasterFare = dbo.GetFareFromInfo(@cTripVxrFareInfo, @cTripFromId, @cTripToId)
			--Update @tripTable set VxrMasterFare = @cTripVxrMasterFare where Id = @cTripId
		end
		begin
			set @cTripVBookingText = dbo.GetVBookingText(@cTripVBookingConfig)
			--Update @tripTable set VBookingText = @cTripVBookingText where Id = @cTripId
		end
		begin
			set @cTripVPaymentText = [dbo].[GetVPaymentText](@cTripVPaymentConfig)
			--Update @tripTable set VPaymentText = @cTripVPaymentText where Id = @cTripId
		end
		begin
			set @cTripVAppText = dbo.GetVAppText(@cTripHasBmsContract, @cTripHasOfflineContract, @cTripHasOnlineContract, @cTripVAppConfig)
			--Update @tripTable set VPaymentText = @cTripVPaymentText where Id = @cTripId
		end

		--------------------------- Insert Routes ---------------------------
		if(@isGetRou is not null)
		BEGIN
			INSERT @tripTable
				select @cTripId, @cTripType, @cTripCode, @cTripName, @cTripNote, @cTripAlias,
						@cTripDate, @cTime, @cTripFromId, @cTripToId, @cTripFromArea, @cTripToArea, @cTripInfo, @cTripRouteInfo, 
						@cTripMasterFare, @cTripFareInfo, @cTripVxrDiscount, @cTripVxrMasterFare, @cTripVxrFareInfo, 
						@cTripVBookingConfig, @cTripBVBookingConfig, @cTripVBookingText, @cTripVPaymentConfig, @cTripBVPaymentConfig, @cTripVPaymentText, @cTripVAppConfig, @cTripBVAppConfig, @cTripVAppText,
						@cTripHasOfflineContract, @cTripHasOnlineContract, @cTripHasBmsContract,
						@cTripCompId, @cTripCompIdName, @cTripIsPrgStatus, @cTripBaseId, @cTripSortCode
		END

		--------------------------- Add Trip by Times in Info of Routes ---------------------------
		DECLARE timeCursor CURSOR FOR 
			select * from dbo.Split(@cTripInfo, '~')

		OPEN timeCursor
		FETCH NEXT FROM timeCursor INTO @cTimeId, @cTime

		WHILE @@FETCH_STATUS = 0
		BEGIN
			if((select count(Id) from @tripTable where Type = 2 and BaseId = @cTripId and Date = @ytrDate and Time = @cTime) = 0)
			begin
				--INSERT @tripTable
				--select Id, Type, Code, Name, Note, Alias, Date, Time, FromArea, ToArea, Info, RouteInfo, FareInfo, VxrFareInfo, VBookingConfig, VPaymentConfig, HasOfflineContract, HasOnlineContract, CompId, CompIdName, IsPrgStatus, BaseId from zgcl_Trip06 
				--where Type = 2 and BaseId = @cTripId and Date = @ytrDate and Time = @cTime
				set @oTripId = 0
				set @oTripType = 2
				set @oTripDate = @ytrDate
				set @oTripAlias = 0
				
				INSERT @tripTable
					select @oTripId, @oTripType, @cTripCode, @cTripName, @cTripNote, @oTripAlias, @oTripDate, @cTime, @cTripFromId, @cTripToId, @cTripFromArea, @cTripToArea, @cTripInfo, @cTripRouteInfo, 
						@cTripMasterFare, @cTripFareInfo, @cTripVxrDiscount, @cTripVxrMasterFare, @cTripVxrFareInfo, 
						@cTripVBookingConfig, @cTripBVBookingConfig, @cTripVBookingText, @cTripVPaymentConfig, @cTripBVPaymentConfig, @cTripVPaymentText, @cTripVAppConfig, @cTripBVAppConfig, @cTripVAppText,
						@cTripHasOfflineContract, @cTripHasOnlineContract, @cTripHasBmsContract,
						@cTripCompId, @cTripCompIdName, @cTripIsPrgStatus, @cTripId, @cTripSortCode

			end

			
			FETCH NEXT FROM timeCursor INTO @cTimeId, @cTime
		END
		CLOSE timeCursor
		DEALLOCATE timeCursor

		

		FETCH NEXT FROM routeCursor INTO @cTripId, @cTripType, @cTripCode, @cTripName, @cTripNote, @cTripAlias,
		@cTripDate, @cTripTime, @cTripFromId, @cTripToId, @cTripFromArea, @cTripToArea, @cTripInfo, @cTripRouteInfo, 
		@cTripMasterFare, @cTripFareInfo, @cTripVxrDiscount, @cTripVxrMasterFare, @cTripVxrFareInfo, 
		@cTripVBookingConfig, @cTripBVBookingConfig, @cTripVBookingText, @cTripVPaymentConfig, @cTripBVPaymentConfig, @cTripVPaymentText, @cTripVAppConfig, @cTripBVAppConfig, @cTripVAppText,
		@cTripHasOfflineContract, @cTripHasOnlineContract, @cTripHasBmsContract,
		@cTripCompId, @cTripCompIdName, @cTripIsPrgStatus, @cTripBaseId, @cTripSortCode
	END 
	CLOSE routeCursor;
	DEALLOCATE routeCursor;

	declare @where varchar(max) = 'where'
	--if(@hasOfflineContract = 1) set @where = @where + ' (dbo.HasOfflineConfig(null, Id) = 1)'
	--if(@hasOnlineContract = 1) set @where = @where + ' (dbo.HasOnlineConfig(null, Id) = 1)'

	if(@where ='where') set @where = ''
	
	--set tripTable = 'tripTable';
	--select (select Data from [dbo].Split(@fields, ',')) from  @tripTable order by BaseId, Time 
	declare @sql nvarchar(max) = N'SELECT '+ @fields + ' FROM @table ' + @where + ' order by ' + @sortFields
	if(@isGetRowNum is not null) set @sql =  N'SELECT ROW_NUMBER() OVER(ORDER BY '+@sortFields+') AS No, '+ @fields + ' FROM @table ' + @where

	EXECUTE sp_executesql @sql, N'@table VTrips READONLY', @tripTable

	declare @comps int
	declare @routes int
	declare @trips int
	select @comps = count(CompId) from (Select distinct CompId from @tripTable) as dt
	select @routes = count(BaseId) from (Select distinct BaseId from @tripTable where Type = 2 and BaseId is not null) as dt
	select @trips = (Select count(*) from @tripTable where Type = 2)
	select @comps as Comps, @routes as Routes, @trips as Trips

	if(@isGetRou = 1) 
	begin
		set @where =  'where Type = 1'
		set @sql = N'SELECT '+ @fields + ' FROM @table ' + @where + ' order by ' + @sortFields
		if(@isGetRowNum is not null) set @sql =  N'SELECT ROW_NUMBER() OVER(ORDER BY '+@sortFields+') AS No, '+ @fields + ' FROM @table ' + @where
		--select @sql
		EXECUTE sp_executesql @sql, N'@table VTrips READONLY', @tripTable
	end

	-- EXECUTE('select * from  @tripTable order by BaseId, Time')	
	--EXEC sp_executesql 
--------------------------- Get Trips ---------------------------
--where HasOnlineContract = 1 or HasOfflineContract =1
	
--------------------------- Get Durations ---------------------------

	SELECT @endTime=GETDATE()
	SELECT DATEDIFF(ms, @startTime, @endTime) AS [Durations in millisecs] 

---------------------------


	--END TRY
	--BEGIN CATCH
		 --print @cTripId
		--EXECUTE usp_GetErrorInfo;
	--END CATCH; 

	




GO


--select id, time from zgcl_Trip07 where compid = 1063