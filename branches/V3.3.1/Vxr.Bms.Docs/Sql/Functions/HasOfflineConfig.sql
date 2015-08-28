USE [VXR_BMS_003]
GO

/****** Object:  UserDefinedFunction [dbo].[HasOnlineConfig]    Script Date: 15/06/2015 11:30:50 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






ALTER FUNCTION [dbo].[HasOfflineConfig]
(  
	@routeId AS bigint,
    @tripId AS bigint
	
) RETURNS bit AS BEGIN  
  
	declare @rs bit = 0
	declare @id bigint = 0
	declare @rId bigint
	declare @tId bigint
	set @rId = @routeId
	set @tId = @tripId

	set @id = (
		select top 1 Id from Bus_Tickets_Status where (
		(XTypeId = 4) and
		((@rId is null) or (XRouteId = @rId)) and
		((@tId is null) or (XTripId = @tId))) 
	)
	if(@id is not null) set @rs = 1
    RETURN @rs
  
END







GO




select [dbo].[HasOfflineConfig](1, null)
select [dbo].[HasOfflineConfig](1006, null)
select [dbo].[HasOfflineConfig](null, 3)
select [dbo].[HasOfflineConfig](null, 4)