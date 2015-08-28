/****** Object: SqlProcedure [dbo].[GetInfoTickets] Script Date: 04/08/2015 03:02:41 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[GetInfoTickets] @ticketIds nvarchar(max) = N''
As
	select Id,TripId,AgentId,TripDate,SeatCode,IssueDate,PickupDate,CustomerInfo,Status,Fare,Note,
	PickupInfo,Serial,PaymentInfo,IsPrgHistoryInfo,Code,PassCode,FromValid,ToValid,IsPrgUpdatedDate,
	AgentInfo,Surcharge,TripAlias,CreatedUser,UserCharge,StageCode,Deposit,Discount,FromArea,ToArea,
	SeatType,Debt,CanceledDate,CancelInfo,Type,ChargeDate,SNote,ResponsibilityUser,PickOrReturnDate,
	StaffName,CancelType,NumOfSend,FirstUserUpdated,ExpiredTime,PrintStatus,IssuedUser,NumOfPrint,FromStop,ToStop

	from dbo.zgcl_Ticket05 where Id in (select * from dbo.fnSplit(@ticketIds, ','))
