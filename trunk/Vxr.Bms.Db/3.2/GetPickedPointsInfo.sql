USE [VXR_BMS_BETA]
GO

/****** Object: SqlProcedure [dbo].[GetPickedPointsInfo] Script Date: 8/7/2015 4:15:44 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE GetPickedPointsInfo
	@tripId int
AS
BEGIN
DECLARE @pickedPointInfo nvarchar(max)
	SELECT @pickedPointInfo = Trip.PickedPointsInfo From Trip WHERE Trip.Id = @tripId
	SELECT @pickedPointInfo
END
