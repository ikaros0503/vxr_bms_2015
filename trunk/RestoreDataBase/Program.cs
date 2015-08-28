using System;
using System.Collections.Generic;
using System.Linq;

namespace RestoreDataBase
{
    class RestoreData
    {
        private static void Main(string[] args)
        {
            // 09-07-2015
            var now = new DateTime(2015, 7, 25);
            var now2 = now.AddDays(1);
            var now3 = now.AddDays(-30);
            var count = 0;
            var tickType = typeof(Ticket);
            var dict = new List<string>
            {
                "Id",
                "Type",
                "Code",
                "Name",
                "Note",
                "Serial",
                "TripDate",
                "TripTime",
                "TripAlias",
                "FromArea",
                "ToArea",
                "SeatCode",
                "PassCode",
                "RoundTripCode",
                "FromValid",
                "ToValid",
                "PickupDate",
                "PickupInfo",
                "DropOffInfo",
                "FacilityInfo",
                "DeliveryInfo",
                "CustomerInfo",
                "Fare",
                "Debt",
                "Refund",
                "Deposit",
                "Discount",
                "Surcharge",
                "CancelFee",
                "Commission",
                "PaymentInfo",
                "TransactionInfo",
                "NotificationInfo",
                "CallerInfo",
                "AgentInfo",
                "UserCharge",
                "CreatedUser",
                "IssueDate",
                "IssueInfo",
                "IssuedUser",
                "Status",
                "Info",
                "Keywords",
                "IsPrgStatus",
                "IsPrgPartComp",
                "IsPrgCreatedDate",
                "IsPrgUpdatedDate",
                "IsPrgCreatedUserId",
                "IsPrgUpdatedUserId",
                "IsPrgUnsignKeywords",
                "IsPrgLanguageInfo",
                "IsPrgHistoryInfo",
                "TripId",
                "AgentId",
                "CustomerId",
                "EventId",
                "CompId",
                "ChargeDate",
                "StageCode",
                "CancelType",
                "CancelInfo",
                "SeatType",
                "CanceledUser",
                "CanceledDate",
                "CanceledAgentId",
                "TimeCode",
                "ExpiredTime",
                "FromId",
                "ToId",
                "LastMovedDate",
                "VexerePaymentInfo",
                "VexerePaymentType",
                "ReturnCode",
                "ReturnDate",
                "SNote",
                "IsConfirmed",
                "ResponsibilityUser",
                "PickOrReturnDate",
                "XMigrate",
                "XMigrateDate",
                "XMigrateKey",
                "IsPrgVersion",
                "DiscountType",
                "FinalPrice",
                "BookingCode",
                "XMigrateType",
                "LastMovedTrip",
                "NumOfSend"
        };
            var total = 0;
            using (var bmsDb = new BMSEntities())
            using (var auditDb = new AuditLogEntities())
            {
                Console.WriteLine("Begin");
                var listIds = new List<int>
                {
                    993097, 983371, 983370, 983369, 983368, 983367, 983366, 983365, 
                    983364, 983364, 983365, 983366, 983367, 983368, 983369, 983370, 
                    983371, 973228, 991413, 991412, 991412, 906463, 983644, 983645, 
                    983646, 983647, 966050, 979865, 979865, 904070, 904071, 904075, 
                    904076, 904077, 904078, 904079, 904080, 906463, 991277, 991278, 
                    966050, 994757, 994755, 966050, 983369, 983368, 983367, 983364, 
                    983365, 983366, 983367, 983368, 983369, 983364, 983365, 983366, 
                    983367, 983368, 983369, 983367, 983368, 983369, 985584, 985584, 
                    985584, 985584, 985585, 985585, 988681, 989078, 989078, 989078, 
                    988681, 988681, 987991, 987991, 987991, 987991, 987991, 989014, 
                    993097, 1011949, 1011950, 1011951, 1011952, 1011953, 1011954, 
                    1011955, 1011956, 1011957, 1011958, 1011959, 1011960, 1011961, 
                    1011962, 1011963, 1011964, 1011965, 1011966, 1011967, 1011968, 
                    1011969, 1011970, 1011971, 1011972, 1011973, 1011974, 1011975, 
                    1011976, 1011977, 1011978, 1011979, 1011980, 1011981, 1011982, 
                    1011983, 1011984, 1011985, 1011986, 1011987, 1011988, 1011989, 
                    1011990,1011991, 1011992, 1011993, 1011994, 1011995, 1011996, 
                    1011997, 1011998, 1011999,1012000, 1012001, 1012002, 1012003, 
                    1012004, 1012005, 1012006, 1011949, 1011950, 1011951, 1011952, 
                    1011953, 1011954, 1011955, 1011956, 1011957, 1011958, 1011959, 
                    1011960, 1011961, 1011962, 1011963, 1011964, 1011965, 1011966, 
                    1011967, 1011968, 1011969, 1011970, 1011971, 1011972, 1011973, 
                    1011974, 1011975, 1011976, 1011977, 1011978, 1011979, 1011980, 
                    1011981, 1011982, 1011983, 1011984, 1011985, 1011986, 1011987, 
                    1011988, 1011989, 1011990, 1011991, 1011992, 1011993, 1011994, 
                    1011995, 1011996, 1011997, 1011998, 1011999, 1012000, 1012001, 
                    1012002, 1012003, 1012004, 1012005, 1012006,
                };

                foreach (var idm in listIds)
                {
                    var auditLogs = auditDb.Audit_Log_2015.Where(y => y.TableName == "Ticket"
                               && y.ActionDate >= now3 && y.ActionDate <= now2 &&
                               (y.RecordIds + ",").Contains(idm + ",") &&
                               y.Username != null && y.Username != "")
                               .OrderBy(y => y.ActionDate).ToList();
                    string ids = "";
                    string idnull = "";
                    string idMiss = "";
                    total = auditLogs.Count;
                    Console.WriteLine("Getlogs Done: " + total);
                    if (total == 0) idMiss += "," + idm;
                    foreach (var audit in auditLogs)
                    {
                        Console.WriteLine("Begin Id: " + audit.RecordIds);
                        count++;
                        Console.WriteLine("---------------------" + count + " / " + total);

                        //if (count > 50) break;
                        var info = audit.Info;
                        var splIds = audit.RecordIds.Split(new[] { "," }, StringSplitOptions.None);
                        if (splIds.Length > 0)
                        {

                            foreach (var tickId in splIds)
                            {
                                var inDict = new Dictionary<string, string>();
                                var items = info.Split(new[] { "#~#" }, StringSplitOptions.None);
                                var newTick = new Ticket();
                                int tickId2 = Convert.ToInt32(tickId);
                                var tickdb = bmsDb.Ticket.Find(tickId2);

                                if (tickdb == null)
                                {
                                    idnull += tickId2 + ", ";
                                    ids = "insert into Ticket (Id) values (" + tickId2 + ");";
                                    bmsDb.Database.ExecuteSqlCommand("SET IDENTITY_INSERT [dbo].[Ticket] ON;" + ids);
                                    newTick = bmsDb.Ticket.Find(tickId2);
                                    if (newTick != null)
                                    {
                                        if (audit.ActionType.Equals("Insert"))
                                        {
                                            foreach (var item in items)
                                            {
                                                var obj = item.Split(new[] { "#:#" }, StringSplitOptions.None);
                                                if (dict.Contains(obj[0])) // prop có trong ticket
                                                {
                                                    inDict.Add(obj[0], obj[1]);
                                                }
                                                var p = tickType.GetProperty(obj[0]);
                                                if (p != null)
                                                {
                                                    try
                                                    {
                                                        p.SetValue(newTick, Convert.ToInt64(obj[1]));
                                                    }
                                                    catch (Exception)
                                                    {
                                                        try
                                                        {
                                                            p.SetValue(newTick, Convert.ToDateTime(obj[1]));
                                                        }
                                                        catch (Exception)
                                                        {
                                                            try
                                                            {
                                                                p.SetValue(newTick, Convert.ToInt32(obj[1]));
                                                            }
                                                            catch (Exception)
                                                            {
                                                                try
                                                                {
                                                                    p.SetValue(newTick, Convert.ToDecimal(obj[1]));
                                                                }
                                                                catch (Exception)
                                                                {
                                                                    p.SetValue(newTick, obj[1]);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            Console.WriteLine("inserted: " + newTick.Id);
                                            bmsDb.SaveChanges();
                                            bmsDb.Database.ExecuteSqlCommand("SET IDENTITY_INSERT [dbo].[Ticket] OFF");
                                        }
                                    }
                                }
                                else if (audit.ActionType.Equals("Update"))
                                {
                                    foreach (var item in items)
                                    {
                                        var obj = item.Split(new[] { "#:#" }, StringSplitOptions.None);
                                        if (dict.Contains(obj[0])) // prop có trong ticket
                                        {
                                            inDict.Add(obj[0], obj[1]);
                                        }
                                        var p = tickType.GetProperty(obj[0]);

                                        if (p != null)
                                        {
                                            try
                                            {
                                                p.SetValue(tickdb, Convert.ToInt64(obj[1]));
                                            }
                                            catch (Exception)
                                            {
                                                try
                                                {
                                                    p.SetValue(tickdb, Convert.ToDateTime(obj[1]));
                                                }
                                                catch (Exception)
                                                {
                                                    try
                                                    {
                                                        p.SetValue(tickdb, Convert.ToInt32(obj[1]));
                                                    }
                                                    catch (Exception)
                                                    {
                                                        try
                                                        {
                                                            p.SetValue(tickdb, Convert.ToDecimal(obj[1]));
                                                        }
                                                        catch (Exception)
                                                        {
                                                            p.SetValue(tickdb, obj[1]);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    Console.WriteLine("updated: " + tickId);
                                    bmsDb.SaveChanges();
                                }
                            }
                        }
                    }
                    Console.WriteLine("Id not found: " + idnull);
                    Console.WriteLine("Id Missed: " + idMiss);
                }
            }
            Console.ReadKey();
        }
    }
}
