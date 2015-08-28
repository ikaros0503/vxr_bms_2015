/****** Object: View [dbo].[zgcl_Ticket02] Script Date: 04/08/2015 10:57:39 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW dbo.zgcl_Ticket02
AS
SELECT        dbo.zgcl_Ticket01.Id, dbo.zgcl_Ticket01.Type, dbo.zgcl_Ticket01.Code, dbo.zgcl_Ticket01.Name, dbo.zgcl_Ticket01.Note, dbo.zgcl_Ticket01.Serial, dbo.zgcl_Ticket01.TripDate, dbo.zgcl_Ticket01.TripTime, 
                         dbo.zgcl_Ticket01.TripAlias, dbo.zgcl_Ticket01.FromArea, dbo.zgcl_Ticket01.ToArea, dbo.zgcl_Ticket01.SeatCode, dbo.zgcl_Ticket01.PassCode, dbo.zgcl_Ticket01.RoundTripCode, dbo.zgcl_Ticket01.FromValid, 
                         dbo.zgcl_Ticket01.ToValid, dbo.zgcl_Ticket01.PickupDate, dbo.zgcl_Ticket01.PickupInfo, dbo.zgcl_Ticket01.DropOffInfo, dbo.zgcl_Ticket01.FacilityInfo, dbo.zgcl_Ticket01.DeliveryInfo, 
                         dbo.zgcl_Ticket01.CustomerInfo, dbo.zgcl_Ticket01.Fare, dbo.zgcl_Ticket01.Debt, dbo.zgcl_Ticket01.Refund, dbo.zgcl_Ticket01.Deposit, dbo.zgcl_Ticket01.Discount, dbo.zgcl_Ticket01.Surcharge, 
                         dbo.zgcl_Ticket01.CancelFee, dbo.zgcl_Ticket01.Commission, dbo.zgcl_Ticket01.PaymentInfo, dbo.zgcl_Ticket01.TransactionInfo, dbo.zgcl_Ticket01.NotificationInfo, dbo.zgcl_Ticket01.CallerInfo, 
                         dbo.zgcl_Ticket01.AgentInfo, dbo.zgcl_Ticket01.UserCharge, dbo.zgcl_Ticket01.CreatedUser, dbo.zgcl_Ticket01.IssueDate, dbo.zgcl_Ticket01.IssueInfo, dbo.zgcl_Ticket01.IssuedUser, dbo.zgcl_Ticket01.Status, 
                         dbo.zgcl_Ticket01.Info, dbo.zgcl_Ticket01.Keywords, dbo.zgcl_Ticket01.IsPrgStatus, dbo.zgcl_Ticket01.IsPrgPartComp, dbo.zgcl_Ticket01.IsPrgCreatedDate, dbo.zgcl_Ticket01.IsPrgUpdatedDate, 
                         dbo.zgcl_Ticket01.IsPrgCreatedUserId, dbo.zgcl_Ticket01.IsPrgUpdatedUserId, dbo.zgcl_Ticket01.IsPrgUnsignKeywords, dbo.zgcl_Ticket01.IsPrgLanguageInfo, dbo.zgcl_Ticket01.IsPrgHistoryInfo, 
                         dbo.zgcl_Ticket01.TripId, dbo.zgcl_Ticket01.AgentId, dbo.zgcl_Ticket01.CustomerId, dbo.zgcl_Ticket01.EventId, dbo.zgcl_Ticket01.ChargeDate, dbo.zgcl_Ticket01.CompId, dbo.zgcl_Ticket01.TripIdType, 
                         dbo.zgcl_Ticket01.TripIdCode, dbo.zgcl_Ticket01.TripIdName, dbo.zgcl_Ticket01.AgentIdType, dbo.zgcl_Ticket01.AgentIdCode, dbo.zgcl_Ticket01.AgentIdName, dbo.zgcl_Ticket01.AgentIdFullName, 
                         dbo.Event.Type AS EventIdType, dbo.Event.Code AS EventIdCode, dbo.Event.Name AS EventIdName, dbo.zgcl_Ticket01.StageCode, dbo.zgcl_Ticket01.SeatType, dbo.zgcl_Ticket01.CanceledUser, 
                         dbo.zgcl_Ticket01.CanceledDate, dbo.zgcl_Ticket01.CanceledAgentId, dbo.zgcl_Ticket01.CancelInfo, dbo.zgcl_Ticket01.CancelType, dbo.zgcl_Ticket01.TimeCode, dbo.zgcl_Ticket01.ExpiredTime, 
                         dbo.zgcl_Ticket01.FromId, dbo.zgcl_Ticket01.ToId, dbo.zgcl_Ticket01.LastMovedDate, dbo.zgcl_Ticket01.ReturnCode, dbo.zgcl_Ticket01.ReturnDate, dbo.zgcl_Ticket01.SNote, dbo.zgcl_Ticket01.IsConfirmed, 
                         dbo.zgcl_Ticket01.ResponsibilityUser, dbo.zgcl_Ticket01.PickOrReturnDate, dbo.zgcl_Ticket01.BookingCode, dbo.zgcl_Ticket01.DiscountType, dbo.zgcl_Ticket01.FinalPrice, dbo.zgcl_Ticket01.NumOfSend, 
                         dbo.zgcl_Ticket01.FirstUserUpdated, dbo.zgcl_Ticket01.PrintStatus, dbo.zgcl_Ticket01.NumOfPrint, dbo.zgcl_Ticket01.FromStop, dbo.zgcl_Ticket01.ToStop
FROM            dbo.zgcl_Ticket01 LEFT OUTER JOIN
                         dbo.Event ON dbo.zgcl_Ticket01.EventId = dbo.Event.Id
