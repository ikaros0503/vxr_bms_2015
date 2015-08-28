USE [VXR_BMS_003]
GO

/****** Object:  UserDefinedFunction [dbo].[GetAreaIdFromInfo]    Script Date: 14/06/2015 12:52:52 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER FUNCTION [dbo].[GetAreaIdFromInfo]
(  
    @info AS NVARCHAR(MAX)  
) RETURNS bigint AS BEGIN  
  
    -- some variables  
    DECLARE @str NVARCHAR(MAX),
			@idx int,
            @result BIGINT = 0; 
	SET @str = @info
	SET @idx = CHARINDEX('|', @str)
	IF(@idx > 3) SET @str = SUBSTRING ( @str , 3 , @idx - 3)
	ELSE SET @str = '0'
	set @result = CAST(@str as bigint)
	
    --RETURN @result
	 RETURN @result
	--RETURN CAST(@idx as varchar(max))
END


GO


select dbo.GetAreaIdFromInfo(N'1~1895|16|CKN|Cư Kuin')