CREATE NONCLUSTERED INDEX IDX_Trip  ON Trip (CompId, IsPrgStatus, Type, Date, Time);

CREATE NONCLUSTERED INDEX IDX_Bus_Tickets_Status  ON Bus_Tickets_Status (XDate, XCompanyId, IsPrgStatus, XStatus, XTypeId, XTripId);

CREATE NONCLUSTERED INDEX IDX_Ticket  ON Ticket (TripDate, TripId, Status);

CREATE NONCLUSTERED INDEX IDX_Company  ON Company (BaseId, IsPrgStatus, Type);
