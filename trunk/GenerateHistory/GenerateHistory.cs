using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web.Script.Serialization;

namespace GenerateHistory
{
    class GenerateHistory
    {
        static void Main(string[] args)
        {
            // 09-07-2015
            var now = new DateTime(2015, 07, 25);
            var now2 = now.AddDays(2);
            var nowTripDate = new DateTime(2015, 07, 26);
            var count = 0;
            var countTicket = 0;
            var countLog = 0;
            var countLogFound = 0;
            using (var bmsDb = new VXR_BMSEntities())
            using (var auditDb = new AuditLogEntities())
            {
                Console.WriteLine("Begin-------------------------");
                var auditLogs = auditDb.Audit_Log_2015.Where(y => y.TableName == "Ticket"
                    && y.ActionDate >= now && y.ActionDate <= now2
                    && y.ActionType.Equals("Delete")).OrderBy(y => y.ActionDate).ToList();

                foreach (var l in auditLogs)
                {
                    if (l != null)
                    {
                        countLogFound++;
                        Console.WriteLine("------------------------------------------------Progess: " + countLogFound + " / " + auditLogs.Count);
                        var tickets = bmsDb.Ticket.Where(x => x.TripDate >= nowTripDate 
                            && x.CanceledUser != null && x.IsPrgHistoryInfo.IndexOf("CanceledUser") == -1
                            && (l.RecordIds + ",").Contains(x.Id + ",")).ToList();
                        if (tickets.Count > 0)
                        {
                            foreach (var tick in tickets)
                            {
                                if (tick != null)
                                {
                                    countLog++;
                                    countTicket++;
                                    //if (countTicket > 5) break;
                                    Console.WriteLine("------------------------------------------ " + tick.Id + " ------Progess: " + countTicket + " / " + tickets.Count);
                                    var tickLog = auditLogs.Where(
                                            z => z.UCompId == tick.CompId && (z.RecordIds + ",").Contains(tick.Id.ToString() + ",")).ToList();
                                    if (tickLog.Count > 0)
                                    {
                                        foreach (var log in tickLog)
                                        {
                                            var formatActionDate = log.ActionDate.Year + "-" + (log.ActionDate.Month.ToString().Length == 1 ? "0" + log.ActionDate.Month : log.ActionDate.Month + "") + "-" +
                                                                       (log.ActionDate.Day.ToString().Length == 1 ? "0" + log.ActionDate.Day : log.ActionDate.Day + "") + "T" +
                                                                       (log.ActionDate.Hour.ToString().Length == 1 ? "0" + log.ActionDate.Hour : log.ActionDate.Hour + "") + ":" +
                                                                       (log.ActionDate.Minute.ToString().Length == 1 ? "0" + log.ActionDate.Minute : log.ActionDate.Minute + "") + ":" +
                                                                       (log.ActionDate.Second.ToString().Length == 1 ? "0" + log.ActionDate.Second : log.ActionDate.Second + "") + ":" +
                                                                       log.ActionDate.Millisecond;

                                            count++;
                                            Console.WriteLine("Total Must Be Change-------------------------: " + count + " / " + tickLog.Count);
                                            if (log.ActionType == "Insert")
                                            {
                                                var inDict = new Dictionary<string, string>();
                                                var items = log.Info.Split(new[] { "#~#" }, StringSplitOptions.None);
                                                foreach (var item in items)
                                                {
                                                    var obj = item.Split(new[] { "#:#" }, StringSplitOptions.None);
                                                    inDict.Add(obj[0], obj[1]);
                                                }
                                                var bookObj = new
                                                {
                                                    CompId = log.UCompId,
                                                    TripId = inDict.ContainsKey("TripId") ? Convert.ToInt32(inDict["TripId"]) : 0,
                                                    AgentId = log.UAgentId,
                                                    AgentInfo = inDict.ContainsKey("AgentInfo") ? inDict["AgentInfo"] : "",
                                                    TripDate = inDict.ContainsKey("TripDate") ? inDict["TripDate"] : "",
                                                    SeatCode = inDict.ContainsKey("SeatCode") ? inDict["SeatCode"] : "",
                                                    IssueDate = inDict.ContainsKey("IssueDate") ? inDict["IssueDate"] : "",
                                                    PickupDate = inDict.ContainsKey("PickupDate") ? inDict["PickupDate"] : "",
                                                    TripAlias = inDict.ContainsKey("TripAlias") ? Convert.ToInt32(inDict["TripAlias"]) : 0,
                                                    Status = inDict.ContainsKey("Status") ? Convert.ToInt32(inDict["Status"]) : 0,
                                                    Fare = inDict.ContainsKey("Fare") ? Convert.ToInt32(inDict["Fare"]) : 0,
                                                    CreatedUser = inDict.ContainsKey("CreatedUser") ? inDict["CreatedUser"] : "",
                                                    StageCode = inDict.ContainsKey("StageCode") ? Convert.ToInt32(inDict["StageCode"]) : 0,
                                                    SeatType = inDict.ContainsKey("SeatType") ? Convert.ToInt32(inDict["SeatType"]) : 0,
                                                    FromArea = inDict.ContainsKey("FromArea") ? inDict["FromArea"].Replace("~", "\u003c") : "",
                                                    ToArea = inDict.ContainsKey("ToArea") ? inDict["ToArea"].Replace("~", "\u003c") : "",
                                                    FromId = inDict.ContainsKey("FromId") ? Convert.ToInt32(inDict["FromId"]) : 0,
                                                    ToId = inDict.ContainsKey("ToId") ? Convert.ToInt32(inDict["ToId"]) : 0,
                                                    Type = inDict.ContainsKey("Type") ? Convert.ToInt32(inDict["Type"]) : 0,
                                                };

                                                var inHis = log.UCompId + "##" + log.UAgentId + "##" + log.UserId + "##" + log.Username +
                                                        "##" +
                                                        formatActionDate + "##BookTicket##" +
                                                        (new JavaScriptSerializer()).Serialize(bookObj);
                                                tick.IsPrgHistoryInfo = inHis;
                                                //var hisTick = new TicketHistory();
                                                //hisTick.TicketId = (int?)tick.Id;
                                                //hisTick.History = inHis;
                                                //bmsDb.TicketHistory.Add(hisTick);

                                                //bmsDb.SaveChanges();
                                            }
                                            else if (log.ActionType == "Update")
                                            {
                                                var inDict = new Dictionary<string, object>();
                                                var items = log.DiffInfo.Split(new[] { "#~#" }, StringSplitOptions.None);
                                                foreach (var item in items)
                                                {
                                                    var obj = item.Split(new[] { "#:#" }, StringSplitOptions.None);
                                                    inDict.Add(obj[0], obj[1]);
                                                }

                                                //var upObj = log.DiffInfo.Replace("#~#", ",").Replace("#:#", ":");
                                                var upHis = log.UCompId + "##" + log.UAgentId + "##" + log.UserId + "##" +
                                                            log.Username +
                                                            "##" + formatActionDate + "##UpdateBookTicket##" +
                                                (new JavaScriptSerializer()).Serialize(inDict);
                                                tick.IsPrgHistoryInfo += "~" + upHis;
                                                //hisTickDb.History += "~" + upHis;

                                                //bmsDb.SaveChanges();
                                            }
                                            else if (log.ActionType.Equals("Delete"))
                                            {
                                                var inDict = new Dictionary<string, object>();
                                                var items = log.DiffInfo.Split(new[] { "#~#" }, StringSplitOptions.None);
                                                foreach (var item in items)
                                                {
                                                    var obj = item.Split(new[] { "#:#" }, StringSplitOptions.None);
                                                    inDict.Add(obj[0], obj[1]);
                                                }

                                                //var upObj = log.DiffInfo.Replace("#~#", ",").Replace("#:#", ":");
                                                var delHis = log.UCompId + "##" + log.UAgentId + "##" + log.UserId + "##" +
                                                            log.Username + "##" + formatActionDate + "##UpdateBookTicket##" +
                                                (new JavaScriptSerializer()).Serialize(inDict);
                                                tick.IsPrgHistoryInfo += "~" + delHis;
                                                //hisTickDb.History += "~" + upHis;

                                                //bmsDb.SaveChanges();
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
            Console.WriteLine("Total: " + countLog);
            Console.WriteLine("----------------------------End------------------------");
            Console.ReadKey();
        }

        public static dynamic GetDynamicObject(Dictionary<string, object> properties)
        {
            var dynamicObject = new ExpandoObject() as IDictionary<string, Object>;
            foreach (var property in properties)
            {
                dynamicObject.Add(property.Key, property.Value);
            }
            return dynamicObject;
        }
    }
}
