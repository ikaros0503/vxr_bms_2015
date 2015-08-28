USE [VXR_BMS_003]
GO

/****** Object:  UserDefinedFunction [dbo].[GetFareFromInfo]    Script Date: 14/06/2015 6:48:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER FUNCTION [dbo].[GetFareFromInfo]
(  
    @info AS NVARCHAR(MAX) ,
	@fromId as bigint,
	@toId as bigint
) RETURNS decimal AS BEGIN  
  
    -- some variables  
    DECLARE @str NVARCHAR(MAX),
			@val varchar(MAX),
			@sPrice varchar(MAX),
			@idx int,
			@fId varchar(MAX),
			@tId varchar(MAX),
            @result decimal; 
	SET @str = @info
	if(@str is not null and len(@str)>3)
	begin
	SET @fId = CAST( @fromId as varchar(MAX)) 
	SET @tId = CAST( @toId as varchar(MAX))
	SET @val = @fId + '|' + @tId


	SET @idx = PATINDEX('%'+@val+'%', @info)

	--IF(@idx > 2) 
	SET @str = SUBSTRING ( @str , @idx + LEN(@val) + 1, LEN(@info))
	SET @idx = CHARINDEX('|', @str)
	SET @str = SUBSTRING ( @str , 1, @idx - 1)
	--ELSE SET @str = '0'

	
	if(@str = '') set @str = '0'
	set @idx = CHARINDEX(':', @str)
	if(@idx>0)
	set @str = SUBSTRING ( @str , 1, @idx - 1)
	--set @str = '0'

    set @result =CAST(@str as decimal)
	end
	
	 RETURN @result
	--RETURN CAST(@idx as varchar(max))
END



GO


-- select dbo.getfarefrominfo('1~765|891|370000:400000:|đ||~765|892|370000:400000:|đ||', 765, 891)