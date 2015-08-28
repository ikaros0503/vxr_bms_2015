USE [VXR_BMS_003]
GO

/****** Object:  UserDefinedFunction [dbo].[GetVAppText]    Script Date: 16/06/2015 7:59:40 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO








ALTER FUNCTION [dbo].[GetVAppText]
(  
    @compHasBmsContract as bit,
	@compHasOfflineContract as bit,
	@compHasOnlineContract as bit,
	@tripVAppConfig as int
) RETURNS varchar(max) AS BEGIN  
  
	declare @str VARCHAR(MAX) = ''
	declare @vcompHasBmsContract bit
	declare @vCompHasOfflineContract bit
	declare @vCompHasOnlineContract bit
	declare @vtripVAppConfig int

	set @vcompHasBmsContract = @compHasBmsContract
	set @vCompHasOfflineContract = @compHasOfflineContract
	set @vCompHasOnlineContract = @compHasOnlineContract
	set @vtripVAppConfig = @tripVAppConfig

    -- some variables  
	--if(@vcompHasBmsContract = 1)
	--begin
	--	if(dbo.CheckValueInBase2(@vtripVAppConfig, 1) !=0 ) set @str = @str + '/BMS.ON'
	--	else if(@vCompHasOfflineContract != 1 ) set @str = @str + '/BMS.OFF' 
	--end
	--else 
	--begin
	--	set @str = @str + '/BMS.OFF' 
	--end
	if(@vcompHasBmsContract = 1 or @vcompHasBmsContract is null)
	begin
		if(@vCompHasOfflineContract = 1 ) set @str = @str + '/BMS.OFF' 
		if(@vCompHasOnlineContract = 1 ) set @str = @str + '/BMS.ON'
	end
	if(len(@str) > 0) set @str = substring(@str, 2, len(@str))

    RETURN @str
  
END



GO


select [dbo].[GetVAppText](1, 1, 1, 0)

select [dbo].[GetVAppText](0, 1, 1, 1)