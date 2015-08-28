USE [VXR_BMS_003]
GO

DECLARE @RC int
DECLARE @compId int
DECLARE @compIds varchar(max)
DECLARE @routeId int
DECLARE @routeIds varchar(max)
DECLARE @xDate date
DECLARE @yDate date
DECLARE @zDate date
DECLARE @fromAreaId int
DECLARE @fromAreaTxt nvarchar (max)
DECLARE @toAreaId int
DECLARE @toAreaTxt nvarchar (max)
DECLARE @isSearchSubArea bit
DECLARE @isSearchRevertArea bit
DECLARE @vBookingConfig int
DECLARE @vPaymentConfig int
DECLARE @compType int
DECLARE @isGetRoute bit
DECLARE @qFields varchar(max)
DECLARE @sFields varchar(max)
DECLARE @isGetNo bit

---------------------------  Set parameter values ---------------------------
-- set @compId = 1063
-- set @routeId = 23019
 set @yDate ='2015-06-16T00:00:00.000'
-- set @yDate ='2015-06-13'
-- set @xDate ='2015-06-13'
--set @zDate ='2015-06-15'
-- set @fromAreaId = 767
-- set @toAreaId = 1027

-- set @fromAreaId = 767
--set @toAreaId = 918
-- set @isSearchSubArea = 0
-- set @isSearchRevertArea = 0
-- set @compType = 2
--set @vPaymentConfig = 4
set @isGetRoute = 1
--set @qFields = 'Id, Type, Code, Name, Note, Alias, Date, Time, FromArea, ToArea, Info, RouteInfo, MasterFare, FareInfo, VxrFareInfo, VBookingConfig, VPaymentConfig, HasOfflineContract, HasOnlineContract, CompId, CompIdName, IsPrgStatus, BaseId, SortCode'
--set @qFields = 'Id, CompIdName, Name, Date, Time, MasterFare, VxrDiscount, VxrMasterFare, VBookingConfig, BVBookingConfig, VBookingText, VPaymentConfig, BVPaymentConfig, VPaymentText, VAppConfig, BVAppConfig, VAppText, HasBmsContract, Type, Code, Note, Alias, FromArea, ToArea, Info, RouteInfo, FareInfo, VxrFareInfo, HasOfflineContract, HasOnlineContract, CompId, IsPrgStatus, BaseId, SortCode'
set @qFields = 'Id,Name,Date,Time,CompIdName,MasterFare,VxrMasterFare,VBookingText,VPaymentText,VAppText,HasBmsContract,HasOfflineContract, HasOnlineContract, CompId'
set @sFields = 'SortCode, Type, BaseId, Time'
--set @isGetNo = 1
--set @compType = 2
-- set @compIds = '2, 6'
-- set @routeIds = '1, 2'

set @fromAreaTxt = N'Đà'
set @toAreaTxt = N'Thái'

EXECUTE @RC = [dbo].[LoadTrips] 
   @compId
  ,@compIds
  ,@routeId
  ,@routeIds
  ,@xDate
  ,@yDate
  ,@zDate
  ,@fromAreaId
  ,@fromAreaTxt
  ,@toAreaId
  ,@toAreaTxt
  ,@isSearchSubArea
  ,@isSearchRevertArea
  ,@vBookingConfig
  ,@vPaymentConfig
  ,@compType
  ,@isGetRoute
  ,@qFields
  ,@sFields
  ,@isGetNo
GO

--select Id, Type, Code, Name, FromId, ToId from trip where Id = 87830

--Update Trip set VPaymentConfig = 7 where Id = 10
 -- select * from Trip where VxrDiscount is not null and CompId = 2
-- select * from Trip where FareInfo is null and type = 2

--
--select *from trip where id in (21276,20248,21524,21528,21531,21540,21540,22922,22922,22922,22922,85547,85547,85547,24328,24328)
--select * from Trip where FareInfo is null and type = 2 

--select *from trip where id in(21276,20248,21524,21528,21531,21540,21540,22922,22922,22922,22922,85547,85547,85547,24328,24328)

--select Id, CompId from trip where id = 24328
--select Id, FareInfo from Trip where id in (21276,20248,21524,21528,21531,21540,21540,22922,22922,22922,22922,85547,85547,85547,24328,24328) and FareInfo is not null
--select Id, FareInfo, BaseId from Trip where FareInfo is null and type = 2 and baseid in (21276,20248,21524,21528,21531,21540,21540,22922,22922,22922,22922,85547,85547,85547,24328,24328)

--select * from company where id = 1441

-- update trip set FareInfo = '1~1730|1894|0|đ||~1730|1731|200000|đ||~1730|1895|210000|đ||~1894|1731|0|đ||~1894|1895|0|đ||~1731|1895|0|đ||' where id = 1
-- update trip set FareInfo = '1~1895|1731|0|đ||~1895|1894|0|đ||~1895|1730|220000|đ||~1731|1894|0|đ||~1731|1730|200000|đ||~1894|1730|0|đ||' where id = 2

-- update trip set info = '01:00~07:30~12:00' where id = 1
-- update trip set info = '01:00~07:30~12:' where id = 1

-- update trip set vxrfareinfo = '1~1730|1894|0|đ||~1730|1731|180000|đ||~1730|1895|189000|đ||~1894|1731|0|đ||~1894|1895|0|đ||~1731|1895|0|đ||' where id = 1

-- update trip set VAppConfig = 0 where id = 1

-- update trip set VAppConfig = 0 where id = 90527

--update trip set HasOfflineContract = 1 where id = 90531

--select * from trip where id = 1789