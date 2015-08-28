/****** Object: View [dbo].[zgcl_Ticket03] Script Date: 04/08/2015 10:58:58 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW dbo.zgcl_Ticket03
AS
SELECT        dbo.zgcl_Ticket02.Id, dbo.zgcl_Ticket02.Type, dbo.zgcl_Ticket02.Code, dbo.zgcl_Ticket02.Name, dbo.zgcl_Ticket02.Note, dbo.zgcl_Ticket02.Serial, dbo.zgcl_Ticket02.TripDate, dbo.zgcl_Ticket02.TripTime, 
                         dbo.zgcl_Ticket02.TripAlias, dbo.zgcl_Ticket02.FromArea, dbo.zgcl_Ticket02.ToArea, dbo.zgcl_Ticket02.SeatCode, dbo.zgcl_Ticket02.PassCode, dbo.zgcl_Ticket02.RoundTripCode, dbo.zgcl_Ticket02.FromValid, 
                         dbo.zgcl_Ticket02.ToValid, dbo.zgcl_Ticket02.PickupDate, dbo.zgcl_Ticket02.PickupInfo, dbo.zgcl_Ticket02.DropOffInfo, dbo.zgcl_Ticket02.FacilityInfo, dbo.zgcl_Ticket02.DeliveryInfo, 
                         dbo.zgcl_Ticket02.CustomerInfo, dbo.zgcl_Ticket02.Fare, dbo.zgcl_Ticket02.Debt, dbo.zgcl_Ticket02.Refund, dbo.zgcl_Ticket02.Deposit, dbo.zgcl_Ticket02.Discount, dbo.zgcl_Ticket02.Surcharge, 
                         dbo.zgcl_Ticket02.CancelFee, dbo.zgcl_Ticket02.Commission, dbo.zgcl_Ticket02.PaymentInfo, dbo.zgcl_Ticket02.TransactionInfo, dbo.zgcl_Ticket02.NotificationInfo, dbo.zgcl_Ticket02.CallerInfo, 
                         dbo.zgcl_Ticket02.AgentInfo, dbo.zgcl_Ticket02.UserCharge, dbo.zgcl_Ticket02.CreatedUser, dbo.zgcl_Ticket02.IssueDate, dbo.zgcl_Ticket02.IssueInfo, dbo.zgcl_Ticket02.IssuedUser, dbo.zgcl_Ticket02.Status, 
                         dbo.zgcl_Ticket02.Info, dbo.zgcl_Ticket02.Keywords, dbo.zgcl_Ticket02.IsPrgStatus, dbo.zgcl_Ticket02.IsPrgPartComp, dbo.zgcl_Ticket02.IsPrgCreatedDate, dbo.zgcl_Ticket02.IsPrgUpdatedDate, 
                         dbo.zgcl_Ticket02.IsPrgCreatedUserId, dbo.zgcl_Ticket02.IsPrgUpdatedUserId, dbo.zgcl_Ticket02.IsPrgUnsignKeywords, dbo.zgcl_Ticket02.IsPrgLanguageInfo, dbo.zgcl_Ticket02.IsPrgHistoryInfo, 
                         dbo.zgcl_Ticket02.TripId, dbo.zgcl_Ticket02.AgentId, dbo.zgcl_Ticket02.CustomerId, dbo.zgcl_Ticket02.EventId, dbo.zgcl_Ticket02.ChargeDate, dbo.zgcl_Ticket02.CompId, dbo.zgcl_Ticket02.TripIdType, 
                         dbo.zgcl_Ticket02.TripIdCode, dbo.zgcl_Ticket02.TripIdName, dbo.zgcl_Ticket02.AgentIdType, dbo.zgcl_Ticket02.AgentIdCode, dbo.zgcl_Ticket02.AgentIdName, dbo.zgcl_Ticket02.AgentIdFullName, 
                         dbo.zgcl_Ticket02.EventIdType, dbo.zgcl_Ticket02.EventIdCode, dbo.zgcl_Ticket02.EventIdName, dbo.Person.Type AS CustomerIdType, dbo.Person.Code AS CustomerIdCode, 
                         dbo.Person.Name AS CustomerIdName, dbo.Person.FullName AS CustomerIdFullName, dbo.zgcl_Ticket02.StageCode, dbo.zgcl_Ticket02.SeatType, dbo.zgcl_Ticket02.CanceledUser, 
                         dbo.zgcl_Ticket02.CanceledDate, dbo.zgcl_Ticket02.CanceledAgentId, dbo.zgcl_Ticket02.CancelInfo, dbo.zgcl_Ticket02.CancelType, dbo.zgcl_Ticket02.TimeCode, dbo.zgcl_Ticket02.ExpiredTime, 
                         dbo.zgcl_Ticket02.FromId, dbo.zgcl_Ticket02.LastMovedDate, dbo.zgcl_Ticket02.ToId, dbo.zgcl_Ticket02.ReturnCode, dbo.zgcl_Ticket02.ReturnDate, dbo.zgcl_Ticket02.SNote, dbo.zgcl_Ticket02.IsConfirmed, 
                         dbo.zgcl_Ticket02.ResponsibilityUser, dbo.zgcl_Ticket02.PickOrReturnDate, dbo.zgcl_Ticket02.BookingCode, dbo.zgcl_Ticket02.DiscountType, dbo.zgcl_Ticket02.FinalPrice, dbo.zgcl_Ticket02.NumOfSend, 
                         dbo.zgcl_Ticket02.FirstUserUpdated, dbo.zgcl_Ticket02.PrintStatus, dbo.zgcl_Ticket02.NumOfPrint, dbo.zgcl_Ticket02.FromStop, dbo.zgcl_Ticket02.ToStop
FROM            dbo.zgcl_Ticket02 LEFT OUTER JOIN
                         dbo.Person ON dbo.zgcl_Ticket02.CustomerId = dbo.Person.Id
