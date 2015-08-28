USE [VXR_BMS_004]
GO

/****** Object:  Trigger [dbo].[trg_Ticket_Trip_01]    Script Date: 11/01/2015 1:53:43 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TRIGGER [dbo].[trg_Company_01] ON [dbo].[Company]
FOR INSERT, UPDATE
AS
BEGIN
	DECLARE @CompId nvarchar(512);
	DECLARE @CompName nvarchar(512);
	Select @CompId = Id, @CompName = Name from inserted;	
	Update Company set Keywords = (SELECT dbo.GetNameKeywords(@CompName)), IsPrgUnsignKeywords = dbo.ConvertToUnsign(@CompName) where Id = @CompId;
END
GO


