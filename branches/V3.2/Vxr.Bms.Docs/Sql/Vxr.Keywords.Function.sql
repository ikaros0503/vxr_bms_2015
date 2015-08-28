IF OBJECT_ID (N'dbo.SplitString', N'FN') IS NOT NULL
    DROP FUNCTION dbo.SplitString;
GO

CREATE FUNCTION dbo.SplitString
    ( @string nvarchar(4000)
    , @delim nvarchar(100) )
RETURNS
    @result TABLE 
        ( [Id] int NOT NULL,
		  [Value] nvarchar(4000) NOT NULL
        , [Index] int NOT NULL )
AS
BEGIN
    DECLARE @str nvarchar(4000)
          , @pos int 
          , @prv int = 1, @i int = 0;
    SELECT @pos = CHARINDEX(@delim, @string)
    WHILE @pos > 0
    BEGIN
        SELECT @str = SUBSTRING(@string, @prv, @pos - @prv)
        INSERT INTO @result SELECT @i, @str, @prv

        SELECT @prv = @pos + LEN(@delim)
             , @pos = CHARINDEX(@delim, @string, @pos + 1)

		SET @i = @i + 1
    END

    INSERT INTO @result SELECT @i, SUBSTRING(@string, @prv, 4000), @prv
    RETURN
END

GO
IF OBJECT_ID (N'dbo.GetNameKeywords', N'FN') IS NOT NULL
    DROP FUNCTION dbo.GetNameKeywords;
GO
CREATE FUNCTION dbo.GetNameKeywords (@value nvarchar(MAX))
RETURNS nvarchar(MAX)
WITH EXECUTE AS CALLER
AS
BEGIN
     DECLARE @result nvarchar(MAX) = '';
	 DECLARE @table table ([Id] int NOT NULL, [Value] nvarchar(4000) NOT NULL
        , [Index] int NOT NULL );

     DECLARE @i int = 0;
	 DECLARE  @numrows int;

     INSERT INTO @table select * from dbo.SplitString(@value, ' ');
	 SET @numrows = (SELECT COUNT(*) FROM @table);

	 IF @numrows > 0
    WHILE (@i < @numrows)
    BEGIN

	 SET @result = @result + (SELECT SubString(LTRIM(Value), 1, 1) FROM @table WHERE [Id] = @i)
   
        SET @i = @i + 1
    END
		SET @result = @result + RIGHT(@value, 1);
		SET @result = REPLACE(@result, ' ', '-');
		SET @result = REPLACE(@result, '~', '-');
		SET @result = REPLACE(@result, '?', '-');
		SET @result = REPLACE(@result, '@', '-');
		SET @result = REPLACE(@result, '#', '-');
		SET @result = REPLACE(@result, '$', '-');
		SET @result = REPLACE(@result, '^', '-');
		SET @result = REPLACE(@result, '&', '-');
		SET @result = REPLACE(@result, '/', '-');
 
		SET @result = REPLACE(@result, '(', '');
		SET @result = REPLACE(@result, ')', '');
		SET @result = REPLACE(@result, '[', '');
		SET @result = REPLACE(@result, ']', '');
		SET @result = REPLACE(@result, '{', '');
		SET @result = REPLACE(@result, '}', '');
		SET @result = REPLACE(@result, '<', '');
		SET @result = REPLACE(@result, '>', '');
		SET @result = REPLACE(@result, '|', '');
		SET @result = REPLACE(@result, '"', '');
		SET @result = REPLACE(@result, '%', '');
		SET @result = REPLACE(@result, '^', '');
		SET @result = REPLACE(@result, '*', '');
		SET @result = REPLACE(@result, '!', '');
		SET @result = REPLACE(@result, ',', '');
		SET @result = REPLACE(@result, '.', '');
 
		SET @result = REPLACE(@result, '---', '-');
		SET @result = REPLACE(@result, '--', '-');
 
		SET @result = REPLACE(@result, N'-', '');
		SET @result = REPLACE(@result, N',', '');  
		SET @result = REPLACE(@result, N';', ''); 
		SET @result = REPLACE(@result, N':', ''); 

     RETURN(@result);
END;
GO

Update Trip set Keywords = (SELECT dbo.GetNameKeywords(Name));
Update Company set Keywords = (SELECT dbo.GetNameKeywords(Name));