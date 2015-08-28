CREATE FUNCTION CheckValueInBase2
(  
    @value AS int,  
    @idx AS INT  
) RETURNS BIT AS BEGIN  
  
    -- some variables  
    DECLARE @str VARCHAR(MAX), @val VARCHAR(1),  
            @result bit = 0;  
  
	SET @str = REVERSE (dbo.ConvertToBase(@value, 2));
	SET @val = SUBSTRING ( @str , @idx , 1 )
	if(@val = '1') set @result = 1
    RETURN @result
  
END

  SELECT  
   dbo.CheckValueInBase2(406, 0)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 1)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 2)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 3)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 4)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 5)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 6)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 7)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 8)   -- 110010110  
   ,dbo.CheckValueInBase2(406, 9)   -- 110010110  
     ,dbo.CheckValueInBase2(406, 10)   -- 110010110  