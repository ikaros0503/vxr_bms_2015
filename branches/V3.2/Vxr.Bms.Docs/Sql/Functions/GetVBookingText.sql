USE [VXR_BMS_003]
GO

/****** Object:  UserDefinedFunction [dbo].[GetVBookingText]    Script Date: 14/06/2015 4:17:24 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER FUNCTION [dbo].[GetVBookingText]
(  
    @value AS int
) RETURNS varchar(max) AS BEGIN  
  
	declare @vBookingCfg int
  	declare @vBookingWeb bit = null
	declare @vBookingDly bit = null
	declare @vBookingWid bit = null
	declare @vBookingAff bit = null

	set @vBookingCfg = @value

    -- some variables  
    DECLARE @str VARCHAR(MAX) = ''
			  
	  if(@vBookingCfg is not null)
	  begin
		set @vBookingWeb = dbo.CheckValueInBase2(@vBookingCfg, 1)
		set @vBookingDly = dbo.CheckValueInBase2(@vBookingCfg, 2)
		set @vBookingWid = dbo.CheckValueInBase2(@vBookingCfg, 3)
		set @vBookingAff = dbo.CheckValueInBase2(@vBookingCfg, 4)
	  end
	
	if(@vBookingWeb = 1) set @str = @str + '/WEB'
	if(@vBookingDly = 1) set @str = @str + '/DLY'
	if(@vBookingWid = 1) set @str = @str + '/WID'
	if(@vBookingAff = 1) set @str = @str + '/AFF'
	if(len(@str) > 0) set @str = substring(@str, 2, len(@str))
    RETURN @str
  
END

GO

select [dbo].[GetVBookingText](3)