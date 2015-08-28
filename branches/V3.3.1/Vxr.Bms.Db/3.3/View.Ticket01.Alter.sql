/****** Object: View [dbo].[zgcl_Ticket01] Script Date: 04/08/2015 10:51:58 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW dbo.zgcl_Ticket01
AS
SELECT        dbo.zgcl_Ticket00.Id, dbo.zgcl_Ticket00.Type, dbo.zgcl_Ticket00.Code, dbo.zgcl_Ticket00.Name, dbo.zgcl_Ticket00.Note, dbo.zgcl_Ticket00.Serial, dbo.zgcl_Ticket00.TripDate, dbo.zgcl_Ticket00.TripTime, 
                         dbo.zgcl_Ticket00.TripAlias, dbo.zgcl_Ticket00.FromArea, dbo.zgcl_Ticket00.ToArea, dbo.zgcl_Ticket00.SeatCode, dbo.zgcl_Ticket00.PassCode, dbo.zgcl_Ticket00.RoundTripCode, dbo.zgcl_Ticket00.FromValid, 
                         dbo.zgcl_Ticket00.ToValid, dbo.zgcl_Ticket00.PickupDate, dbo.zgcl_Ticket00.PickupInfo, dbo.zgcl_Ticket00.DropOffInfo, dbo.zgcl_Ticket00.FacilityInfo, dbo.zgcl_Ticket00.DeliveryInfo, 
                         dbo.zgcl_Ticket00.CustomerInfo, dbo.zgcl_Ticket00.Fare, dbo.zgcl_Ticket00.Debt, dbo.zgcl_Ticket00.Refund, dbo.zgcl_Ticket00.Deposit, dbo.zgcl_Ticket00.Discount, dbo.zgcl_Ticket00.Surcharge, 
                         dbo.zgcl_Ticket00.CancelFee, dbo.zgcl_Ticket00.Commission, dbo.zgcl_Ticket00.PaymentInfo, dbo.zgcl_Ticket00.TransactionInfo, dbo.zgcl_Ticket00.NotificationInfo, dbo.zgcl_Ticket00.CallerInfo, 
                         dbo.zgcl_Ticket00.AgentInfo, dbo.zgcl_Ticket00.UserCharge, dbo.zgcl_Ticket00.CreatedUser, dbo.zgcl_Ticket00.IssueDate, dbo.zgcl_Ticket00.IssueInfo, dbo.zgcl_Ticket00.IssuedUser, dbo.zgcl_Ticket00.Status, 
                         dbo.zgcl_Ticket00.Info, dbo.zgcl_Ticket00.Keywords, dbo.zgcl_Ticket00.IsPrgStatus, dbo.zgcl_Ticket00.IsPrgPartComp, dbo.zgcl_Ticket00.IsPrgCreatedDate, dbo.zgcl_Ticket00.IsPrgUpdatedDate, 
                         dbo.zgcl_Ticket00.IsPrgCreatedUserId, dbo.zgcl_Ticket00.IsPrgUpdatedUserId, dbo.zgcl_Ticket00.IsPrgUnsignKeywords, dbo.zgcl_Ticket00.IsPrgLanguageInfo, dbo.zgcl_Ticket00.IsPrgHistoryInfo, 
                         dbo.zgcl_Ticket00.TripId, dbo.zgcl_Ticket00.AgentId, dbo.zgcl_Ticket00.CustomerId, dbo.zgcl_Ticket00.EventId, dbo.zgcl_Ticket00.ChargeDate, dbo.zgcl_Ticket00.CompId, dbo.zgcl_Ticket00.TripIdType, 
                         dbo.zgcl_Ticket00.TripIdCode, dbo.zgcl_Ticket00.TripIdName, dbo.Company.Type AS AgentIdType, dbo.Company.Code AS AgentIdCode, dbo.Company.Name AS AgentIdName, 
                         dbo.Company.FullName AS AgentIdFullName, dbo.zgcl_Ticket00.StageCode, dbo.zgcl_Ticket00.SeatType, dbo.zgcl_Ticket00.CanceledUser, dbo.zgcl_Ticket00.CanceledDate, dbo.zgcl_Ticket00.CanceledAgentId, 
                         dbo.zgcl_Ticket00.CancelInfo, dbo.zgcl_Ticket00.CancelType, dbo.zgcl_Ticket00.TimeCode, dbo.zgcl_Ticket00.ExpiredTime, dbo.zgcl_Ticket00.FromId, dbo.zgcl_Ticket00.ToId, dbo.zgcl_Ticket00.LastMovedDate, 
                         dbo.zgcl_Ticket00.ReturnCode, dbo.zgcl_Ticket00.ReturnDate, dbo.zgcl_Ticket00.SNote, dbo.zgcl_Ticket00.IsConfirmed, dbo.zgcl_Ticket00.ResponsibilityUser, dbo.zgcl_Ticket00.PickOrReturnDate, 
                         dbo.zgcl_Ticket00.BookingCode, dbo.zgcl_Ticket00.DiscountType, dbo.zgcl_Ticket00.FinalPrice, dbo.zgcl_Ticket00.NumOfSend, dbo.zgcl_Ticket00.FirstUserUpdated, dbo.zgcl_Ticket00.PrintStatus, dbo.zgcl_Ticket00.NumOfPrint,
						 dbo.zgcl_Ticket00.FromStop, dbo.zgcl_Ticket00.ToStop
FROM            dbo.zgcl_Ticket00 LEFT OUTER JOIN
                         dbo.Company ON dbo.zgcl_Ticket00.AgentId = dbo.Company.Id
