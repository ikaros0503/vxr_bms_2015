using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

namespace RestoreDataBase
{
    class RestoreData
    {
        private static void Main(string[] args)
        {
            // 09-07-2015
            var now = new DateTime(2015, 7, 25);
            var now2 = now.AddDays(1);
            var count = 0;
            var countDelete = 0;
            var deletedIds = "";
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
        }

    ;
            var total = 0;
            using (var bmsDb = new BMSEntities())
            using (var auditDb = new AuditLogEntities())
            {
                Console.WriteLine("Begin");
                var auditLogs = auditDb.Audit_Log_2015.Where(y => y.TableName == "Ticket"
                               && y.ActionDate >= new DateTime(2015, 7, 24, 20, 33, 48, 277) && y.ActionDate < now2 &&
                               y.Username != null && y.UCompId != 660 && y.UCompId != 971
                               && y.UCompId != 126 && y.Domain != "localhost" &&
                               y.Username != "" && y.ActionType.Equals("Delete"))
                   .OrderBy(y => y.ActionDate).ToList();
                string ids = "";
                string idnull = "";
                total = auditLogs.Count;
                Console.WriteLine("Getlogs Done: " + total);
                foreach (var audit in auditLogs)
                {
                    Console.WriteLine("Begin Id: " + audit.RecordIds);
                    count++;
                    Console.WriteLine("---------------------" + count + " / " + total);
                    //if (count > 50) break;
                    var info = audit.Info;
                    audit.RecordIds = audit.RecordIds.Replace("|", ",");
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
                                //ids = "insert into Ticket (Id) values (" + tickId2 + ");";
                                //bmsDb.Database.ExecuteSqlCommand("SET IDENTITY_INSERT [dbo].[Ticket] ON;" + ids);
                                //newTick = bmsDb.Ticket.Find(tickId2);
                                //if (newTick != null)
                                //{
                                //    if (audit.ActionType.Equals("Insert"))
                                //    {
                                //        foreach (var item in items)
                                //        {
                                //            var obj = item.Split(new[] { "#:#" }, StringSplitOptions.None);
                                //            if (dict.Contains(obj[0])) // prop có trong ticket
                                //            {
                                //                inDict.Add(obj[0], obj[1]);
                                //            }
                                //            var p = tickType.GetProperty(obj[0]);
                                //            if (p != null)
                                //            {
                                //                try
                                //                {
                                //                    p.SetValue(newTick, Convert.ToInt64(obj[1]));
                                //                }
                                //                catch (Exception)
                                //                {
                                //                    try
                                //                    {
                                //                        p.SetValue(newTick, Convert.ToDateTime(obj[1]));
                                //                    }
                                //                    catch (Exception)
                                //                    {
                                //                        try
                                //                        {
                                //                            p.SetValue(newTick, Convert.ToInt32(obj[1]));
                                //                        }
                                //                        catch (Exception)
                                //                        {
                                //                            try
                                //                            {
                                //                                p.SetValue(newTick, Convert.ToDecimal(obj[1]));
                                //                            }
                                //                            catch (Exception)
                                //                            {
                                //                                p.SetValue(newTick, obj[1]);
                                //                            }
                                //                        }
                                //                    }
                                //                }
                                //            }
                                //        }
                                //        Console.WriteLine("inserted: " + newTick.Id);
                                //        bmsDb.SaveChanges();
                                //        bmsDb.Database.ExecuteSqlCommand("SET IDENTITY_INSERT [dbo].[Ticket] OFF");
                                //    }
                                //}
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
                                //bmsDb.SaveChanges();
                            }
                            else if (audit.ActionType.Equals("Delete") && tickdb.Status == 1)
                            {
                                var adLog =
                                    auditDb.Audit_Log_2015.Where(x => (x.RecordIds + ",").Contains(tickdb.Id + ","))
                                        .OrderByDescending(x => x.ActionDate).First();
                                if (adLog.ActionType.Equals("Delete"))
                                {
                                    countDelete++;
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
                                    tickdb.Status = 3;
                                    deletedIds += "," + tickId;
                                    Console.WriteLine("deleted: " + tickId);
                                    //bmsDb.SaveChanges();
                                }
                            }
                        }
                    }
                }
                Console.WriteLine("Id not found: " + idnull);
            }
            Console.WriteLine("Id must delete: " + countDelete);
            Console.WriteLine("DeletedIds (Status = 1): " + deletedIds);
            Console.ReadKey();
        }
    }
}
