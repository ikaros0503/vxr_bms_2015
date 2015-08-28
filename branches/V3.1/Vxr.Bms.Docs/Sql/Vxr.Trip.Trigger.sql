USE [VXR_BMS_004]
GO

/****** Object:  Trigger [dbo].[trg_Ticket_Trip_01]    Script Date: 11/01/2015 1:53:43 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TRIGGER [dbo].[trg_Trip_01] ON [dbo].[Trip]
FOR INSERT, UPDATE
AS
BEGIN
	DECLARE @TripId nvarchar(512);
	DECLARE @TripName nvarchar(512);
	Select @TripId = Id, @TripName = Name from inserted;	
	Update Trip set Keywords = (SELECT dbo.GetNameKeywords(@TripName)), IsPrgUnsignKeywords = dbo.ConvertToUnsign(@TripName) where Id = @TripId;
END
GO


