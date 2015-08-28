CREATE VIEW CustomerTrip_Ticket1
	AS select t.Code, t.SeatCode, t.TripDate, t.TripId, ct.Name, ct.TripName, ct.Phone, c.Note
, t.Status, t.Fare, ct.CustomerId
from Ticket t
left join CustomerTrip ct on ct.CustomerId=t.CustomerId and ct.Code=t.Code
left join Customer c on c.Id=t.CustomerId