using System;
using System.Configuration;
using System.Linq;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Vxr.Bms.Queue
{
    class QueueReader
    {
        private static readonly Log4Net Log = new Log4Net();
        private const int MaxQueue = 5;

        public static void Read()
        {
            try
            {
                var factory = new ConnectionFactory() { HostName = "localhost" };
                using (var connection = factory.CreateConnection())
                {
                    using (var channel = connection.CreateModel())
                    {
                        channel.QueueDeclare("UpdateTicket", false, false, false, null);

                        var consumer = new QueueingBasicConsumer(channel);
                        channel.BasicConsume("UpdateTicket", true, consumer);
                        int count = 0;
                        while (true)
                        {
                            try
                            {
                                var ea = (BasicDeliverEventArgs)consumer.Queue.Dequeue();
                                var body = ea.Body;
                                var message = Encoding.UTF8.GetString(body);
                                message = message.Trim();
                                if (message.Length > 0) UpdateTicket(message);

                                count++;
                                if (count >= MaxQueue) break;
                            }
                            catch (Exception ex)
                            {
                                Log.LogContent(ex.ToString());
                                break;
                            }
                        }
                    }
                    //connection.Close();
                }
            }
            catch (Exception ex)
            {
                Log.LogContent(ex.ToString());
            }
        }

        public static void UpdateTicket(string ids)
        {
            var lstId = ids.Split('|');
            using (var bdb = new BMSEntities())
            {
                foreach (string id in lstId)
                {
                    try
                    {
                        var tk = bdb.Tickets.Find(Convert.ToInt32(id));
                        string cif = tk.CustomerInfo;
                        int compId = Convert.ToInt32(tk.CompId);
                        int lastedTripId = Convert.ToInt32(tk.TripId);
                        if (!string.IsNullOrEmpty(cif) && cif.Length > 10)
                        {
                            var cifs = cif.Split('|');
                            var phone = cifs[4];
                            var cName = cifs[3];
                            int type = 1;
                            long cusId = 0;
                            try
                            {
                                var ctm = bdb.Customers.FirstOrDefault(b => b.CompId == compId && b.Phone == phone);
                                if (ctm != null)
                                {
                                    cusId = ctm.Id;
                                    int check = Convert.ToInt32(ctm.TotalProduct);
                                    if (check > 0) type = 3;
                                }
                                else
                                {
                                    var tc = new Customer()
                                    {
                                        Type = 1,
                                        Phone = cifs[4],
                                        Name = cifs[3],
                                        Gender = 1,
                                        CompId = compId,
                                        IsPrgStatus = 1,
                                        IsPrgCreatedDate = DateTime.Now
                                    };
                                    bdb.Customers.Add(tc);
                                    bdb.SaveChanges();
                                    cusId = tc.Id;
                                }
                            }
                            catch (Exception ex)
                            {
                                Log.LogContent(ex.ToString());
                            }
                            tk.CustomerInfo = "1|1|" + cusId + "|" + cifs[3] + "|" + cifs[4] + "|||";
                            tk.CustomerId = cusId;

                            bdb.SaveChanges();
                        /*************************************************
                        * Update Customer 
                        **************************************************/
                            var cusTks = bdb.Tickets.Where(b => b.CustomerId == cusId);
                            var cusTimes = bdb.Tickets.Where(b => b.CustomerId == cusId).GroupBy(p => p.Code).Select(grp => grp.FirstOrDefault());

                            int bookingTicket = 0;
                            int bookingTime = 0;
                            int totalBooking = 0;

                            int paidTicket = 0;
                            int paidTime = 0;
                            int totalPaid = 0;

                            int cancelTicket = 0;
                            int cancelTime = 0;
                            int totalCancel = 0;

                            int notComeTicket = 0;
                            int notComeTime = 0;
                            int totalNotCome = 0;

                            int passTicket = 0;
                            int passTime = 0;
                            int totalPass = 0;

                            int openTicket = 0;
                            int openTime = 0;
                            int totalOpen = 0;

                            int validTicket = 0;
                            int validTime = 0;
                            int totalValid = 0;

                            int keepOnTimeTicket = 0;
                            int keepOnTimeTime = 0;
                            int totalKeepOnTime = 0;

                            int totalTicket = cusTks.Count();
                            int totalTime = cusTimes.Count();
                            int totalMoney = 0;

                            foreach (Ticket t in cusTimes)
                            {
                                switch (t.Status)
                                {
                                    case 1:
                                        bookingTime++;break;
                                    case 2:
                                        paidTime++;break;
                                    case 3:
                                        cancelTime++; break;
                                    case 4:
                                        notComeTime++; break;
                                    case 5:
                                        passTime++; break;
                                    case 6:
                                        openTime++; break;
                                    case 7:
                                        validTime++; break;
                                    case 8:
                                        keepOnTimeTime++; break;
                                }
                            }

                            foreach (Ticket cTk in cusTks)
                            {
                                totalMoney += Convert.ToInt32(cTk.Fare) > 0 ? Convert.ToInt32(cTk.Fare) : 0;
                                switch (cTk.Status)
                                {
                                    case 1:
                                        bookingTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalBooking += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalBooking += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalBooking -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    case 2:
                                        paidTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalPaid += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalPaid += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalPaid -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    case 3:
                                        cancelTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalCancel += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalCancel += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalCancel -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    case 4:
                                        notComeTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalNotCome += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalNotCome += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalNotCome -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    case 5:
                                        passTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalPass += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalPass += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalPass -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    case 6:
                                        openTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalOpen += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalOpen += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalOpen -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    case 7:
                                        validTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalValid += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalValid += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalValid -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    case 8:
                                        keepOnTimeTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalKeepOnTime += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalKeepOnTime += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalKeepOnTime -= Convert.ToInt32(cTk.Discount);
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            int totalTrip = (from t in bdb.Tickets
                                             where ((t.Status == 2 || t.Status == 5) && t.CustomerId == cusId)
                                             group t.TripId by new { t.TripId, t.TripDate }
                                                 into g
                                                 select g).Count();
                            int totalCancelTrip = (from t in bdb.Tickets
                                                   where (t.Status == 3 && t.CustomerId == cusId)
                                                   group t.TripId by new { t.TripId, t.TripDate }
                                                       into g
                                                       select g).Count();
                            int lastedTotalTicket =
                                bdb.Tickets.Count(b => b.CustomerId == cusId && b.TripId == lastedTripId);

                            var cus = bdb.Customers.Find(cusId);
                            cus.Type = type;
                            cus.Phone = cifs[4];
                            cus.Name = cifs[3];
                            cus.Gender = 1;
                            cus.BookingTicket = bookingTicket;
                            //cus.BookingTime = bookingTime;
                            cus.TotalBooking = totalBooking;
                            cus.PaidTicket = paidTicket;
                            //cus.PaidTime = paidTime;
                            cus.TotalPaid = totalPaid;
                            cus.CancelTicket = cancelTicket;
                            //cus.CancelTime = cancelTime;
                            cus.TotalCancel = totalCancel;
                            cus.NotComeTicket = notComeTicket;
                            //cus.NotComeTime = notComeTime;
                            cus.TotalNotCome = totalNotCome;
                            cus.PassTicket = passTicket;
                            //cus.PassTime = passTime;
                            cus.TotalPass = totalPass;
                            cus.OpenTicket = openTicket;
                            //cus.OpenTime = openTime;
                            cus.TotalOpen = totalOpen;
                            cus.ValidTicket = validTicket;
                            //cus.ValidTime = validTime;
                            cus.TotalValid = totalValid;
                            cus.KeepOnTimeTicket = keepOnTimeTicket;
                            //cus.KeepOnTimeTime = keepOnTimeTime;
                            cus.TotalKeepOnTime = totalKeepOnTime;
                            cus.TotalTicket = totalTicket;
                            //cus.TotalTime = totalTime;
                            cus.TotalMoney = totalMoney;
                            cus.LastedTripId = lastedTripId;
                            cus.LastedTripDate = tk.TripDate;
                            cus.LastedTripTime = tk.TripTime;
                            cus.LastedTotalTicket = lastedTotalTicket;
                            cus.TotalTrip = totalTrip;
                            cus.TotalCancelTrip = totalCancelTrip;
                            cus.CompId = compId;
                            cus.IsPrgStatus = 1;

                            bdb.SaveChanges();
                            /*************************************************
                        * Update CustomerTrip 
                        **************************************************/
                            var oldd = bdb.CustomerTrips.FirstOrDefault(p => p.Code == tk.Code);
                            if (oldd != null)
                            {
                                oldd.Phone = phone;
                                bdb.SaveChanges();
                            }

                            var cusTrip = bdb.CustomerTrips.FirstOrDefault(
                                c => c.CustomerId == cusId && c.TripId == lastedTripId && c.TripDate == tk.TripDate
                                );

                            CustomerTrip cusTripOld;
                            if (tk.LastMovedDate != tk.TripDate)
                                cusTripOld = bdb.CustomerTrips.FirstOrDefault(
                                    c => c.CustomerId == cusId && c.TripId == lastedTripId &&
                                         c.Code == tk.Code && c.TripDate == tk.LastMovedDate
                                    );
                            else
                            {
                                cusTripOld = null;
                            }

                            bookingTicket = 0;
                            totalBooking = 0;
                            var listseatbooking = new StringBuilder("");
                            paidTicket = 0;
                            totalPaid = 0;
                            var listseatPaid = new StringBuilder("");
                            cancelTicket = 0;
                            totalCancel = 0;
                            var listseatCancel = new StringBuilder("");
                            notComeTicket = 0;
                            totalNotCome = 0;
                            var listseatNotCome = new StringBuilder("");
                            passTicket = 0;
                            totalPass = 0;
                            var listseatPass = new StringBuilder("");
                            keepOnTimeTicket = 0;
                            totalKeepOnTime = 0;
                            var listseatKeepOnTime = new StringBuilder("");

                            cusTks = bdb.Tickets.Where(
                                b => b.CustomerId == cusId
                                     && b.TripId == lastedTripId
                                     && b.TripDate == tk.TripDate);

                            foreach (var cTk in cusTks)
                            {
                                totalMoney += Convert.ToInt32(cTk.Fare) > 0 ? Convert.ToInt32(cTk.Fare) : 0;
                                var seatCode = cTk.SeatCode.Split('|')[0];
                                switch (cTk.Status)
                                {
                                    case 1:
                                        bookingTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalBooking += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalBooking += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalBooking -= Convert.ToInt32(cTk.Discount);
                                        }
                                        listseatbooking.Append(", " + seatCode);
                                        break;
                                    case 2:
                                        paidTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalPaid += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalPaid += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalPaid -= Convert.ToInt32(cTk.Discount);
                                        }
                                        listseatPaid.Append(", " + seatCode);
                                        break;
                                    case 3:
                                        cancelTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalCancel += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalCancel += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalCancel -= Convert.ToInt32(cTk.Discount);
                                        }
                                        listseatCancel.Append(", " + seatCode);
                                        break;
                                    case 4:
                                        notComeTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalNotCome += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalNotCome += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalNotCome -= Convert.ToInt32(cTk.Discount);
                                        }
                                        listseatNotCome.Append(", " + seatCode);
                                        break;
                                    case 5:
                                        passTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalPass += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalPass += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalPass -= Convert.ToInt32(cTk.Discount);
                                        }
                                        listseatPass.Append(", " + seatCode);
                                        break;
                                    case 8:
                                        keepOnTimeTicket++;
                                        if (Convert.ToInt32(cTk.Fare) > 0)
                                        {
                                            totalKeepOnTime += Convert.ToInt32(cTk.Fare);
                                        }
                                        if (Convert.ToInt32(cTk.Surcharge) > 0)
                                        {
                                            totalKeepOnTime += Convert.ToInt32(cTk.Surcharge);
                                        }
                                        if (Convert.ToInt32(cTk.Discount) > 0)
                                        {
                                            totalKeepOnTime -= Convert.ToInt32(cTk.Discount);
                                        }
                                        listseatKeepOnTime.Append(", " + seatCode);
                                        break;
                                }
                            }
                            var tripName = bdb.Trips.Find(lastedTripId).Name;
                            if (cusTrip == null)
                            {
                                var ct = new CustomerTrip()
                                {
                                    Type = type,
                                    Code = tk.Code,
                                    Phone = phone,
                                    Name = cifs[3],
                                    TripName = tripName,
                                    Gender = 1,
                                    BookingTicket = bookingTicket,
                                    TotalBooking = totalBooking,
                                    PaidTicket = paidTicket,
                                    TotalPaid = totalPaid,
                                    CancelTicket = cancelTicket,
                                    TotalCancel = totalCancel,
                                    NotComeTicket = notComeTicket,
                                    TotalNotCome = totalNotCome,
                                    PassTicket = passTicket,
                                    TotalPass = totalPass,
                                    KeepOnTimeTicket = keepOnTimeTicket,
                                    TotalKeepOnTime = totalKeepOnTime,
                                    Note = tk.Note,
                                    CompId = compId,
                                    IsPrgStatus = 1,
                                    IsPrgCreatedDate = DateTime.Now,
                                    IsPrgUpdatedDate = DateTime.Now,
                                    TripId = lastedTripId,
                                    TripDate = tk.TripDate,
                                    CustomerId = cusId,
                                    PickupInfo = tk.PickupInfo,
                                    ListSeatBooking = (listseatbooking.Length > 0 ? (listseatbooking.ToString().Substring(2)) : ""),
                                    ListSeatPaid = (listseatPaid.Length > 0 ? (listseatPaid.ToString().Substring(2)) : ""),
                                    ListSeatCancel = (listseatCancel.Length > 0 ? (listseatCancel.ToString().Substring(2)): ""),
                                    ListSeatKeepOnTime = (listseatKeepOnTime.Length > 0 ? (listseatKeepOnTime.ToString().Substring(2)) : ""),
                                    ListSeatNotCome = (listseatNotCome.Length > 0 ? (listseatNotCome.ToString().Substring(2)) : ""),
                                    ListSeatPass = (listseatPass.Length > 0 ? (listseatPass.ToString().Substring(2)) : "")
                                };
                                bdb.CustomerTrips.Add(ct);
                                bdb.SaveChanges();
                            }
                            else
                            {
                                cusTrip.Type = type;
                                cusTrip.Phone = cifs[4];
                                cusTrip.Name = cifs[3];
                                cusTrip.Gender = 1;
                                cusTrip.BookingTicket = bookingTicket;
                                cusTrip.TotalBooking = totalBooking;
                                cusTrip.PaidTicket = paidTicket;
                                cusTrip.TotalPaid = totalPaid;
                                cusTrip.CancelTicket = cancelTicket;
                                cusTrip.TotalCancel = totalCancel;
                                cusTrip.NotComeTicket = notComeTicket;
                                cusTrip.TotalNotCome = totalNotCome;
                                cusTrip.PassTicket = passTicket;
                                cusTrip.TotalPass = totalPass;
                                cusTrip.KeepOnTimeTicket = keepOnTimeTicket;
                                cusTrip.TotalKeepOnTime = totalKeepOnTime;
                                cusTrip.Note = tk.Note;
                                cusTrip.PickupInfo = tk.PickupInfo;
                                cusTrip.TripName = tripName;
                                cusTrip.ListSeatBooking = (listseatbooking.Length > 0
                                    ? (listseatbooking.ToString().Substring(2))
                                    : "");
                                cusTrip.ListSeatPaid = (listseatPaid.Length > 0
                                    ? (listseatPaid.ToString().Substring(2))
                                    : "");
                                cusTrip.ListSeatCancel = (listseatCancel.Length > 0
                                    ? (listseatCancel.ToString().Substring(2))
                                    : "");
                                cusTrip.ListSeatKeepOnTime = (listseatKeepOnTime.Length > 0
                                    ? (listseatKeepOnTime.ToString().Substring(2))
                                    : "");
                                cusTrip.ListSeatNotCome = (listseatNotCome.Length > 0
                                    ? (listseatNotCome.ToString().Substring(2))
                                    : "");
                                cusTrip.ListSeatPass = (listseatPass.Length > 0
                                    ? (listseatPass.ToString().Substring(2))
                                    : "");
                                cusTrip.TripDate = tk.TripDate;
                                cusTrip.IsPrgStatus = 1;
                                cusTrip.IsPrgUpdatedDate = DateTime.Now;
                                bdb.SaveChanges();
                            }
                            ////////////
                            if (cusTripOld != null)
                            {
                                bookingTicket = 0;
                                totalBooking = 0;
                                listseatbooking = new StringBuilder("");
                                paidTicket = 0;
                                totalPaid = 0;
                                listseatPaid = new StringBuilder("");
                                cancelTicket = 0;
                                totalCancel = 0;
                                listseatCancel = new StringBuilder("");
                                notComeTicket = 0;
                                totalNotCome = 0;
                                listseatNotCome = new StringBuilder("");
                                passTicket = 0;
                                totalPass = 0;
                                listseatPass = new StringBuilder("");
                                keepOnTimeTicket = 0;
                                totalKeepOnTime = 0;
                                listseatKeepOnTime = new StringBuilder("");

                                cusTks = bdb.Tickets.Where(
                                    b => b.CustomerId == cusId
                                         && b.TripId == lastedTripId
                                         && b.TripDate == tk.LastMovedDate);

                                var existTicket = false;

                                foreach (Ticket cTk in cusTks)
                                {
                                    existTicket = true;
                                    totalMoney += Convert.ToInt32(cTk.Fare) > 0 ? Convert.ToInt32(cTk.Fare) : 0;
                                    var seatCode = cTk.SeatCode.Split('|')[0];
                                    switch (cTk.Status)
                                    {
                                        case 1:
                                            bookingTicket++;
                                            if (Convert.ToInt32(cTk.Fare) > 0)
                                            {
                                                totalBooking += Convert.ToInt32(cTk.Fare);
                                            }
                                            if (Convert.ToInt32(cTk.Surcharge) > 0)
                                            {
                                                totalBooking += Convert.ToInt32(cTk.Surcharge);
                                            }
                                            if (Convert.ToInt32(cTk.Discount) > 0)
                                            {
                                                totalBooking -= Convert.ToInt32(cTk.Discount);
                                            }
                                            listseatbooking.Append(", " + seatCode);
                                            break;
                                        case 2:
                                            paidTicket++;
                                            if (Convert.ToInt32(cTk.Fare) > 0)
                                            {
                                                totalPaid += Convert.ToInt32(cTk.Fare);
                                            }
                                            if (Convert.ToInt32(cTk.Surcharge) > 0)
                                            {
                                                totalPaid += Convert.ToInt32(cTk.Surcharge);
                                            }
                                            if (Convert.ToInt32(cTk.Discount) > 0)
                                            {
                                                totalPaid -= Convert.ToInt32(cTk.Discount);
                                            }
                                            listseatPaid.Append(", " + seatCode);
                                            break;
                                        case 3:
                                            cancelTicket++;
                                            if (Convert.ToInt32(cTk.Fare) > 0)
                                            {
                                                totalCancel += Convert.ToInt32(cTk.Fare);
                                            }
                                            if (Convert.ToInt32(cTk.Surcharge) > 0)
                                            {
                                                totalCancel += Convert.ToInt32(cTk.Surcharge);
                                            }
                                            if (Convert.ToInt32(cTk.Discount) > 0)
                                            {
                                                totalCancel -= Convert.ToInt32(cTk.Discount);
                                            }
                                            listseatCancel.Append(", " + seatCode);
                                            break;
                                        case 4:
                                            notComeTicket++;
                                            if (Convert.ToInt32(cTk.Fare) > 0)
                                            {
                                                totalNotCome += Convert.ToInt32(cTk.Fare);
                                            }
                                            if (Convert.ToInt32(cTk.Surcharge) > 0)
                                            {
                                                totalNotCome += Convert.ToInt32(cTk.Surcharge);
                                            }
                                            if (Convert.ToInt32(cTk.Discount) > 0)
                                            {
                                                totalNotCome -= Convert.ToInt32(cTk.Discount);
                                            }
                                            listseatNotCome.Append(", " + seatCode);
                                            break;
                                        case 5:
                                            passTicket++;
                                            if (Convert.ToInt32(cTk.Fare) > 0)
                                            {
                                                totalPass += Convert.ToInt32(cTk.Fare);
                                            }
                                            if (Convert.ToInt32(cTk.Surcharge) > 0)
                                            {
                                                totalPass += Convert.ToInt32(cTk.Surcharge);
                                            }
                                            if (Convert.ToInt32(cTk.Discount) > 0)
                                            {
                                                totalPass -= Convert.ToInt32(cTk.Discount);
                                            }
                                            listseatPass.Append(", " + seatCode);
                                            break;
                                        case 8:
                                            keepOnTimeTicket++;
                                            if (Convert.ToInt32(cTk.Fare) > 0)
                                            {
                                                totalKeepOnTime += Convert.ToInt32(cTk.Fare);
                                            }
                                            if (Convert.ToInt32(cTk.Surcharge) > 0)
                                            {
                                                totalKeepOnTime += Convert.ToInt32(cTk.Surcharge);
                                            }
                                            if (Convert.ToInt32(cTk.Discount) > 0)
                                            {
                                                totalKeepOnTime -= Convert.ToInt32(cTk.Discount);
                                            }
                                            listseatKeepOnTime.Append(", " + seatCode);
                                            break;
                                    }
                                }

                                if (existTicket)
                                {
                                    cusTripOld.BookingTicket = bookingTicket;
                                    cusTripOld.TotalBooking = totalBooking;
                                    cusTripOld.PaidTicket = paidTicket;
                                    cusTripOld.TotalPaid = totalPaid;
                                    cusTripOld.CancelTicket = cancelTicket;
                                    cusTripOld.TotalCancel = totalCancel;
                                    cusTripOld.NotComeTicket = notComeTicket;
                                    cusTripOld.TotalNotCome = totalNotCome;
                                    cusTripOld.PassTicket = passTicket;
                                    cusTripOld.TotalPass = totalPass;
                                    cusTripOld.KeepOnTimeTicket = keepOnTimeTicket;
                                    cusTripOld.TotalKeepOnTime = totalKeepOnTime;
                                    cusTripOld.ListSeatBooking = (listseatbooking.Length > 0
                                        ? (listseatbooking.ToString().Substring(2))
                                        : "");
                                    cusTripOld.ListSeatPaid = (listseatPaid.Length > 0
                                        ? (listseatPaid.ToString().Substring(2))
                                        : "");
                                    cusTripOld.ListSeatCancel = (listseatCancel.Length > 0
                                        ? (listseatCancel.ToString().Substring(2))
                                        : "");
                                    cusTripOld.ListSeatKeepOnTime = (listseatKeepOnTime.Length > 0
                                        ? (listseatKeepOnTime.ToString().Substring(2))
                                        : "");
                                    cusTripOld.ListSeatNotCome = (listseatNotCome.Length > 0
                                        ? (listseatNotCome.ToString().Substring(2))
                                        : "");
                                    cusTripOld.ListSeatPass = (listseatPass.Length > 0
                                        ? (listseatPass.ToString().Substring(2))
                                        : "");

                                    cusTripOld.IsPrgStatus = 1;
                                }
                                else
                                {
                                    cusTripOld.IsPrgStatus = 3;
                                }

                                bdb.SaveChanges();
                            }
                        }
                        UpdateTripTable(Convert.ToInt32(tk.TripId), Convert.ToDateTime(tk.TripDate), Convert.ToInt32(tk.TripAlias));
                        if (tk.LastMovedDate != null && tk.LastMovedDate != tk.TripDate) 
                            UpdateTripTable(Convert.ToInt32(tk.TripId), Convert.ToDateTime(tk.LastMovedDate), Convert.ToInt32(tk.TripAlias));
                    }
                    catch (Exception ex)
                    {
                        Log.LogContent(ids + " - \n" + ex.ToString());
                    }
                }
            }


            var driverPath = ConfigurationSettings.AppSettings["DriverPath"];
            var ttPhone = ConfigurationSettings.AppSettings["ThuanTienPhone"];
            var ttPass = ConfigurationSettings.AppSettings["ThuanTienPass"];
            var loginUrl = ConfigurationSettings.AppSettings["MobifoneLoginUrl"];
            var usernameElmId = ConfigurationSettings.AppSettings["UsernameElementId"];
            var passwordElmId = ConfigurationSettings.AppSettings["PasswordElementId"];
            var smsUrl = ConfigurationSettings.AppSettings["MobifoneSmsUrl"];
            var phoneElmId = ConfigurationSettings.AppSettings["PhoneElementId"];
            var messElmId = ConfigurationSettings.AppSettings["MessageElementId"];

            var messagesms = "Chuc mung ban da dat ve thanh cong";
            //var phonesms = "01677676021";

            //var options = new ChromeOptions();
            ////var service = ChromeDriverService.CreateDefaultService(@"" + driverPath);
            //var service = ChromeDriverService.CreateDefaultService(@"C:\inetpub\wwwroot");
            //service.SuppressInitialDiagnosticInformation = true;
            //IWebDriver driver = new ChromeDriver(service, options);
            ////IWebDriver driver = new FirefoxDriver();
            //driver.Navigate().GoToUrl(loginUrl);
            //driver.FindElement(By.Id(usernameElmId)).SendKeys(ttPhone);
            //driver.FindElement(By.Id(passwordElmId)).SendKeys(ttPass);
            //driver.FindElement(By.Id(passwordElmId)).SendKeys(Keys.Enter);
            //var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(2));
            //wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("taikhoan-cuatoi")));
            //driver.Navigate().GoToUrl(smsUrl);
            //var wait2 = new WebDriverWait(driver, TimeSpan.FromSeconds(2));
            //wait2.Until(ExpectedConditions.ElementExists(By.Id(phoneElmId)));
            //driver.FindElement(By.Id(messElmId)).SendKeys(messagesms);
            //driver.FindElement(By.Id(phoneElmId)).SendKeys(phonesms);
            //driver.FindElement(By.Id(phoneElmId)).SendKeys(Keys.Enter);
            //driver.Quit();
        }

        public static void UpdateTripTable(int tId, DateTime tDate, int tAlias)
        {
            Log.LogContent(tId + " " + tDate);
            try
            {
                using (var bdb = new BMSEntities())
                {
                    var trip = bdb.Trips.FirstOrDefault(
                        t => t.Date == tDate.Date
                             && t.Time == tDate.TimeOfDay.ToString().Substring(0, 5)
                             && t.Type == 2
                             && t.BaseId == tId
                        );
                    if (trip == null)
                    {
                        var prTrip = bdb.Trips.FirstOrDefault(t => t.Id == tId);
                        if (prTrip != null)
                        {
                            var newTrip = CloneTrip(prTrip);

                            newTrip.Type = 2;
                            newTrip.Alias = tAlias;
                            newTrip.Date = tDate.Date;
                            newTrip.Time = tDate.TimeOfDay.ToString().Substring(0, 5);
                            newTrip.StatusInfo = 1;
                            newTrip.BaseId = tId;
                            newTrip.TotalBookedSeats = 1;
                            newTrip.TotalPaidSeats = 0;
                            newTrip.IsPrgCreatedDate = DateTime.Now;
                            newTrip.IsPrgUpdatedDate = DateTime.Now;
                            bdb.Trips.Add(newTrip);
                            bdb.SaveChanges();
                        }
                    }
                    else
                    {
                        trip.TotalBookedSeats = bdb.Tickets.Count(t => t.TripId == tId
                                                                       && t.TripDate == tDate
                                                                       && t.Status == 1);
                        trip.TotalPaidSeats = bdb.Tickets.Count(t => t.TripId == tId
                                                                     && t.TripDate == tDate
                                                                     && (t.Status == 2 || t.Status == 5));
                        Log.LogContent(tId + " " + tDate + " " + trip.TotalBookedSeats + "  " + trip.TotalPaidSeats);
                    }
                    bdb.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Log.LogContent(tId + " - " + tDate + " - \n" + ex);
            } 
        }

        private static Trip CloneTrip(Trip ip)
        {
            Trip rt = new Trip();
            rt.Code = ip.Code;
            rt.Name = ip.Name;
            rt.Note = ip.Note;
            rt.Alias = ip.Alias;
            rt.LicensePlate = ip.LicensePlate;
            rt.FromArea = ip.FromArea;
            rt.ToArea = ip.ToArea;
            rt.Date = ip.Date;
            rt.Time = ip.Time;
            rt.DepartureTime = ip.DepartureTime;
            rt.RealDepartureTime = ip.RealDepartureTime;
            rt.FinishDate = ip.FinishDate;
            rt.TotalSeats = ip.TotalSeats;
            rt.TotalExtendedSeats = ip.TotalExtendedSeats;
            rt.OwnerInfo = ip.OwnerInfo;
            rt.RouteInfo = ip.RouteInfo;
            rt.PickedPointsInfo = ip.PickedPointsInfo;
            rt.TeamInfo = ip.TeamInfo;
            rt.VehicleInfo = ip.VehicleInfo;
            rt.FareInfo = ip.FareInfo;
            rt.FacilityInfo = ip.FacilityInfo;
            rt.SeatFacilityInfo = ip.SeatFacilityInfo;
            rt.SeatPolicyInfo = ip.SeatPolicyInfo;
            rt.SeatTemplateInfo = ip.SeatTemplateInfo;
            rt.ExtendedSeatsInfo = ip.ExtendedSeatsInfo;
            rt.SeatSummaryInfo = ip.SeatSummaryInfo;
            rt.StatusInfo = ip.StatusInfo;
            rt.FeeInfo = ip.FeeInfo;
            rt.TotalFee = ip.TotalFee;
            rt.PayInfo = ip.PayInfo;
            rt.RevenuesInfo = ip.RevenuesInfo;
            rt.RightsInfo = ip.RightsInfo;
            rt.IsVeXeReFull = ip.IsVeXeReFull;
            rt.Info = ip.Info;
            rt.Keywords = ip.Keywords;
            rt.IsPrgStatus = ip.IsPrgStatus;
            rt.IsPrgPartComp = ip.IsPrgPartComp;
            rt.IsPrgUnsignKeywords = ip.IsPrgUnsignKeywords;
            rt.IsPrgLanguageInfo = ip.IsPrgLanguageInfo;
            rt.IsPrgHistoryInfo = ip.IsPrgHistoryInfo;
            rt.CompId = ip.CompId;
            rt.OwnerId = ip.OwnerId;
            rt.BaseId = ip.BaseId;
            rt.VehicleId = ip.VehicleId;
            rt.EventId = ip.EventId;
            rt.AgentId = ip.AgentId;
            rt.TotalStage = ip.TotalStage;
            rt.FromId = ip.FromId;
            rt.ToId = ip.ToId;
            rt.RouteId = ip.RouteId;
            rt.TotalBookedSeats = 1;
            rt.TotalPaidSeats = 0;

            return rt;
        }
    }

}
