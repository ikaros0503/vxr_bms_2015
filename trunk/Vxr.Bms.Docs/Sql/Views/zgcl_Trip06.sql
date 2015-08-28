USE [VXR_BMS_003]
GO

/****** Object:  View [dbo].[zgcl_Trip06]    Script Date: 16/06/2015 12:09:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO








/*where dbo.Bus_Tickets_Status.XTypeId = 10 or dbo.Bus_Tickets_Status.XTypeId = 11 or dbo.Bus_Tickets_Status.XTypeId = 12 or dbo.Bus_Tickets_Status.XTypeId = 13 or dbo.Bus_Tickets_Status.XTypeId = 14 or dbo.Bus_Tickets_Status.XTypeId = 15*/
ALTER VIEW [dbo].[zgcl_Trip06]
AS
SELECT      dbo.Trip.Id, 
			dbo.Trip.Type, 
			dbo.Trip.Code, 
			dbo.Trip.Name, 
			dbo.Trip.Note, 
            dbo.Trip.Alias, 
			--dbo.Trip.LicensePlate, 
			dbo.Trip.FromArea, 
			dbo.Trip.ToArea, 
			dbo.Trip.Date, 
			dbo.Trip.Time, 
			--dbo.Trip.DepartureTime, 
   --         dbo.Trip.RealDepartureTime, 
			--dbo.Trip.FinishDate, 
			--dbo.Trip.TotalSeats, 
			--dbo.Trip.TotalExtendedSeats, 
			--dbo.Trip.OwnerInfo, 
			dbo.Trip.RouteInfo, 
   --         dbo.Trip.PickedPointsInfo, 
			--dbo.Trip.TeamInfo, 
			--dbo.Trip.VehicleInfo, 
			dbo.Trip.FareInfo, 
			--dbo.Trip.FacilityInfo, 
			--dbo.Trip.SeatFacilityInfo, 
			--dbo.Trip.SeatPolicyInfo, 
   --         dbo.Trip.SeatTemplateInfo, 
			--dbo.Trip.ExtendedSeatsInfo, 
			--dbo.Trip.SeatSummaryInfo, 
			--dbo.Trip.StatusInfo, 
			--dbo.Trip.FeeInfo, 
			--dbo.Trip.TotalFee, 
   --         dbo.Trip.PayInfo, 
			--dbo.Trip.RevenuesInfo, 
			--dbo.Trip.RightsInfo, 
			--dbo.Trip.IsVeXeReFull, 
			dbo.Trip.Info, 
			dbo.Trip.Keywords, 
			dbo.Trip.IsPrgStatus, 
			--dbo.Trip.IsPrgPartComp, 
			--dbo.Trip.IsPrgCreatedDate, 
			--dbo.Trip.IsPrgUpdatedDate, 
			--dbo.Trip.IsPrgCreatedUserId, 
			--dbo.Trip.IsPrgUpdatedUserId, 
			dbo.Trip.IsPrgUnsignKeywords, 
			--dbo.Trip.IsPrgLanguageInfo, 
			--dbo.Trip.IsPrgHistoryInfo, 
			dbo.Trip.CompId, 
			--dbo.Trip.OwnerId, 
			dbo.Trip.BaseId, 
			--dbo.Trip.VehicleId, 
			--dbo.Trip.EventId, 
			--dbo.Trip.AgentId, 
			--dbo.Trip.ExtendedSeatSummaryInfo, 
			--dbo.Trip.ClosedStatus, 
			--dbo.Trip.PassengerMoney, 
			--dbo.Trip.ProductMoney, 
			--dbo.Trip.FeeMoney, 
			--dbo.Trip.BranchReceiveProduct, 
			--dbo.Trip.TotalStage, 
			dbo.Trip.FromId, 
			dbo.Trip.ToId, 
			--dbo.Trip.RouteId, 
			--dbo.Trip.TotalBookedSeats, 
			--dbo.Trip.TotalPaidSeats, 
			--dbo.Trip.TransferPointsInfo, 
			dbo.Trip.NewFare, 
			dbo.Trip.Discount, 
			dbo.Trip.VxrFareInfo, 
			dbo.Trip.VxrDiscount, 
			dbo.Trip.DisplayOrder, 
			dbo.Trip.VBookingConfig, 
			dbo.Trip.VPaymentConfig,
			dbo.Trip.VAppConfig,
			--dbo.Trip.Description, 
			--dbo.Company.Id AS Cid, 
			--dbo.Company.Code as CompIdCode, 
			dbo.Company.Name as CompIdName, 
			dbo.Company.HasOfflineContract, 
			dbo.Company.HasOnlineContract,
			dbo.Company.HasBmsContract

--FROM        dbo.Company INNER JOIN dbo.Trip ON dbo.Company.Id = dbo.Trip.CompId

FROM        dbo.Trip left join dbo.Company ON dbo.Company.Id = dbo.Trip.CompId






GO


