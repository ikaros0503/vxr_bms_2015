/****** Object: View [dbo].[zgcl_Ticket00] Script Date: 04/08/2015 10:45:03 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW dbo.zgcl_Ticket00
AS
SELECT        dbo.Ticket.Id, dbo.Ticket.Type, dbo.Ticket.Code, dbo.Ticket.Name, dbo.Ticket.Note, dbo.Ticket.Serial, dbo.Ticket.TripDate, dbo.Ticket.TripTime, dbo.Ticket.TripAlias, dbo.Ticket.FromArea, dbo.Ticket.ToArea, 
                         dbo.Ticket.SeatCode, dbo.Ticket.PassCode, dbo.Ticket.RoundTripCode, dbo.Ticket.FromValid, dbo.Ticket.ToValid, dbo.Ticket.PickupDate, dbo.Ticket.PickupInfo, dbo.Ticket.DropOffInfo, dbo.Ticket.FacilityInfo, 
                         dbo.Ticket.DeliveryInfo, dbo.Ticket.CustomerInfo, dbo.Ticket.Fare, dbo.Ticket.Debt, dbo.Ticket.Refund, dbo.Ticket.Deposit, dbo.Ticket.Discount, dbo.Ticket.Surcharge, dbo.Ticket.CancelFee, dbo.Ticket.Commission, 
                         dbo.Ticket.PaymentInfo, dbo.Ticket.TransactionInfo, dbo.Ticket.NotificationInfo, dbo.Ticket.CallerInfo, dbo.Ticket.AgentInfo, dbo.Ticket.UserCharge, dbo.Ticket.CreatedUser, dbo.Ticket.IssueDate, 
                         dbo.Ticket.IssueInfo, dbo.Ticket.IssuedUser, dbo.Ticket.Status, dbo.Ticket.Info, dbo.Ticket.Keywords, dbo.Ticket.IsPrgStatus, dbo.Ticket.IsPrgPartComp, dbo.Ticket.IsPrgCreatedDate, dbo.Ticket.IsPrgUpdatedDate, 
                         dbo.Ticket.IsPrgCreatedUserId, dbo.Ticket.IsPrgUpdatedUserId, dbo.Ticket.IsPrgUnsignKeywords, dbo.Ticket.IsPrgLanguageInfo, dbo.Ticket.IsPrgHistoryInfo, dbo.Ticket.TripId, dbo.Ticket.AgentId, 
                         dbo.Ticket.CustomerId, dbo.Ticket.EventId, dbo.Ticket.ChargeDate, dbo.Ticket.CompId, dbo.Trip.Type AS TripIdType, dbo.Trip.Code AS TripIdCode, dbo.Trip.Name AS TripIdName, dbo.Ticket.StageCode, 
                         dbo.Ticket.SeatType, dbo.Ticket.CanceledUser, dbo.Ticket.CanceledDate, dbo.Ticket.CanceledAgentId, dbo.Ticket.CancelInfo, dbo.Ticket.CancelType, dbo.Ticket.TimeCode, dbo.Ticket.ExpiredTime, 
                         dbo.Ticket.FromId, dbo.Ticket.ToId, dbo.Ticket.LastMovedDate, dbo.Ticket.ReturnCode, dbo.Ticket.ReturnDate, dbo.Ticket.SNote, dbo.Ticket.IsConfirmed, dbo.Ticket.ResponsibilityUser, 
                         dbo.Ticket.PickOrReturnDate, dbo.Ticket.BookingCode, dbo.Ticket.DiscountType, dbo.Ticket.FinalPrice, dbo.Ticket.NumOfSend, dbo.Ticket.FirstUserUpdated, dbo.Ticket.PrintStatus, dbo.Ticket.NumOfPrint, 
						 dbo.Ticket.FromStop, dbo.Ticket.ToStop
FROM            dbo.Ticket LEFT OUTER JOIN
                         dbo.Trip ON dbo.Ticket.TripId = dbo.Trip.Id
