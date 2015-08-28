CREATE VIEW CustomerTrip_Customer
	AS select ct.Name, ct.TripName,  ct.Note, ct.Phone, ct.BookingTicket, ct.TotalBooking, ct.ListSeatBooking, ct.PaidTicket,
ct.ListSeatPaid, ct.CancelTicket, ct.TotalCancel, ct.ListSeatCancel, ct.NotComeTicket, ct.TotalNotCome, ct.ListSeatNotCome,
ct.PassTicket, ct.TotalPass, ct.ListSeatPass, ct.KeepOnTimeTicket, ct.TotalKeepOnTime, ct.ListSeatKeepOnTime, 
c.Note as CustomerNote, c.CompId, ct.TripDate, ct.TripId
from CustomerTrip ct
left join Customer c on c.Id=ct.CustomerId
where ct.IsPrgStatus=1