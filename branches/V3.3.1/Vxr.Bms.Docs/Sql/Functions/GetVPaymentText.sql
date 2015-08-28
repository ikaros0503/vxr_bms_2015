USE [VXR_BMS_003]
GO

/****** Object:  UserDefinedFunction [dbo].[GetVPaymentText]    Script Date: 14/06/2015 4:21:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE FUNCTION [dbo].[GetVPaymentText]
(  
    @value AS int
) RETURNS varchar(max) AS BEGIN  
  
	declare @vPaymentCfg int
  
	declare @vPaymentOli bit = null
	declare @vPaymentCod bit = null
	declare @vPaymentDly bit = null

	set @vPaymentCfg = @value

    -- some variables  
    DECLARE @str VARCHAR(MAX) = ''
			  
	  if(@vPaymentCfg is not null)
	  begin
		set @vPaymentOli = dbo.CheckValueInBase2(@vPaymentCfg, 1)
		set @vPaymentCod = dbo.CheckValueInBase2(@vPaymentCfg, 2)
		set @vPaymentDly = dbo.CheckValueInBase2(@vPaymentCfg, 3)
	  end
	
	if(@vPaymentOli = 1) set @str = @str + '/OLI'
	if(@vPaymentCod = 1) set @str = @str + '/COD'
	if(@vPaymentDly = 1) set @str = @str + '/ĐLY'

	if(len(@str) > 0) set @str = substring(@str, 2, len(@str))
    RETURN @str
  
END


GO


select [dbo].[GetVPaymentText](7)