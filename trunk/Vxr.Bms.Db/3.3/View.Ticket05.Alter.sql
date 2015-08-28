/****** Object: View [dbo].[zgcl_Ticket05] Script Date: 04/08/2015 11:01:02 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW dbo.zgcl_Ticket05
AS
SELECT        a.Id, a.Type, a.Code, a.Name, a.Note, a.Serial, a.TripDate, a.TripTime, a.TripAlias, a.FromArea, a.ToArea, a.SeatCode, a.PassCode, a.RoundTripCode, a.FromValid, a.ToValid, a.PickupDate, a.PickupInfo, 
                         a.DropOffInfo, a.FacilityInfo, a.DeliveryInfo, a.CustomerInfo, a.Fare, a.Debt, a.Refund, a.Deposit, a.Discount, a.Surcharge, a.CancelFee, a.Commission, a.PaymentInfo, a.TransactionInfo, a.NotificationInfo, 
                         a.CallerInfo, a.AgentInfo, a.UserCharge, a.CreatedUser, a.IssueDate, a.IssueInfo, a.IssuedUser, a.Status, a.Info, a.Keywords, a.IsPrgStatus, a.IsPrgPartComp, a.IsPrgCreatedDate, a.IsPrgUpdatedDate, 
                         a.IsPrgCreatedUserId, a.IsPrgUpdatedUserId, a.IsPrgUnsignKeywords, a.IsPrgLanguageInfo, a.IsPrgHistoryInfo, a.TripId, a.AgentId, a.CustomerId, a.EventId, a.ChargeDate, a.CompId, a.TripIdType, a.TripIdCode, 
                         a.TripIdName, a.AgentIdType, a.AgentIdCode, a.AgentIdName, a.AgentIdFullName, a.EventIdType, a.EventIdCode, a.EventIdName, a.Type AS CustomerIdType, a.Code AS CustomerIdCode, a.StageCode, 
                         a.SeatType, a.CanceledUser, a.CanceledDate, a.CanceledAgentId, a.CancelInfo, a.CancelType, a.TimeCode, a.ExpiredTime, a.FromId, a.LastMovedDate, a.ToId, a.ReturnCode, a.ReturnDate, a.SNote, 
                         a.IsConfirmed, a.ResponsibilityUser, a.PickOrReturnDate, a.BookingCode, a.DiscountType, a.FinalPrice, a.Name AS PersonName, b.FullName AS StaffName, a.NumOfSend, a.FirstUserUpdated, a.PrintStatus, a.NumOfPrint,
						 a.FromStop, a.ToStop
FROM            dbo.zgcl_Ticket04 AS a LEFT OUTER JOIN
                         dbo.Person AS b ON a.StaffId = b.Id
