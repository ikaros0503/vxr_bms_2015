alter procedure BGetTotalSeats @cId int, @tripId int, @tripDate varchar(max)
as
	--
	DECLARE @startTime DATETIME = GETDATE() 
	DECLARE @endTime DATETIME

	DECLARE @totalBookedSeats int = 0
	DECLARE @totalExpiredSeats int = 0	
	DECLARE @tick table (Id int, Status int, ExpiredTime DATETIME)

	insert into @tick
	select Id,Status,ExpiredTime from Ticket where CompId = @cId and TripId = @tripId and TripDate = @tripDate

	set @totalBookedSeats = (select count(Id) from @tick where Status != 3 and (Status <> 1 or (Status = 1 and (ExpiredTime is null or ExpiredTime > GETDATE()))))
	set @totalExpiredSeats = (select count(Id) from @tick where Status = 1 and ExpiredTime < GETDATE())	

	select @totalBookedSeats as 'TotalBookedSeats', @totalExpiredSeats as 'TotalExpiredSeats'	

	SELECT @endTime = GETDATE()
	SELECT DATEDIFF(ms, @startTime, @endTime) AS [Durations in millisecs]
GO

--update Ticket set ExpiredTime = '2015-07-30 23:00:00:000' where Code = '5T8Q1N'

--execute BGetTotalSeats 80, 1115, '2015-07-30 23:00:00:000'