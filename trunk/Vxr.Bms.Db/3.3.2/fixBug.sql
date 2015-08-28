INSERT INTO [dbo].CustomerTrip
(
Type,
Code,
Name,
TripName,
Note,
Phone,
BookingTicket,
TotalBooking,
ListSeatBooking,
CompId,
TripId,
CustomerId,
TripDate,
PickupInfo,
Gender,
IsPrgStatus
)
(select 
t.Type,
t.Code,
f.Name,
a.TripName,
t.Note,
dbo.GetPhoneInCustomerInfo(t.CustomerInfo) as Phone,
d.BookingTicket ,
e.TotalBooking, 
b.ListSeatBooking, 
t.CompId,
t.TripId,
t.CustomerId,
 t.TripDate,
 t.PickupInfo,
 1 as Gender , 
 1 as IsPrgStatus
from Ticket t
	CROSS APPLY 
   ( 
   SELECT Name as TripName FROM Trip tt 
   WHERE tt.id = t.TripId and tt.Type = 1
   ) a
   CROSS APPLY 
   ( 
   SELECT ListSeat as ListSeatBooking FROM dbo.getListSeatBooking(t.Code )   
   ) b
   CROSS APPLY 
   ( 
   SELECT COUNT(Id) as BookingTicket FROM [dbo].[Ticket]
  where code = t.Code
   ) d
   CROSS APPLY 
   ( 
   SELECT sum(Fare) as TotalBooking FROM [dbo].[Ticket]
  where code = t.Code 
   ) e
   OUTER  APPLY 
   ( 
   SELECT Name FROM Customer tt 
   WHERE tt.id = t.CustomerId 
   ) f
left join CustomerTrip c on t.code = c.Code 
where t.TripDate >= '2015-08-01 00:00:00' and t.Status != 3 and t.CustomerInfo != '1|1|0||' and t.CustomerInfo is not null
and dbo.GetPhoneInCustomerInfo(t.CustomerInfo) != '1'
--and t.TripId = 1115 
and c.Id is null
and t.status = 1
)
go

delete from CustomerTrip 
where Phone in 
(select Phone from CustomerTrip ct
left join Ticket t on t.Code = ct.Code and t.TripDate = ct.TripDate
where ct.Code is not null and t.Id is null
and ct.TripDate >= '2015-08-01 00:00:000' Group by Phone)