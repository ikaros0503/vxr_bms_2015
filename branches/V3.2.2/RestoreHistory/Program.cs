using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;

namespace RestoreHistory
{
    class Program
    {
        static void Main(string[] args)
        {
            // 09-07-2015
            var now = DateTime.Now.AddDays(-5);
            using (var bmsDb = new VXR_BMSEntities())
            using (var auditDb = new AuditLogEntities())
            {
                var auditLogs = auditDb.Audit_Log_2015.Where(y => y.TableName == "Ticket"
                    //&& y.ActionType == "Insert"
                    && y.ActionDate >= now).ToList();

                var tickets = bmsDb.Ticket.Where(x => x.CompId == 971 && x.PickupDate >= now && x.PickupDate <= DateTime.Now && x.IsPrgHistoryInfo.StartsWith("~")).ToList();
                if (tickets.Count > 0)
                {
                    foreach (var tick in tickets)
                    {
                        var result = new List<string>();
                        Console.WriteLine("------------------------------------------ " + tick.Id);
                        var tickLog = auditLogs.Where(
                                z => z.UCompId == tick.CompId && z.RecordIds.Contains(tick.Id.ToString())).ToList();
                        if (tickLog.Count > 0)
                        {
                            Console.WriteLine("Number: " + tickLog.Count);
                            foreach (var log in tickLog)
                            {

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
                                        AgentId = log.UAgentId,
                                        AgentInfo = inDict.ContainsKey("AgentInfo") ? inDict["AgentInfo"] : "",
                                        TripDate = inDict.ContainsKey("TripDate") ? inDict["TripDate"] : "",
                                        SeatCode = inDict.ContainsKey("SeatCode") ? inDict["SeatCode"] : "",
                                        IssueDate = inDict.ContainsKey("IssueDate") ? inDict["IssueDate"] : "",
                                        PickupDate = inDict.ContainsKey("PickupDate") ? inDict["PickupDate"] : "",
                                        TripAlias = inDict.ContainsKey("TripAlias") ? inDict["TripAlias"] : "",
                                        Status = inDict.ContainsKey("Status") ? inDict["Status"] : "",
                                        Fare = inDict.ContainsKey("Fare") ? inDict["Fare"] : "",
                                        CreatedUser = inDict.ContainsKey("CreatedUser") ? inDict["CreatedUser"] : "",
                                        StageCode = inDict.ContainsKey("StageCode") ? inDict["StageCode"] : "",
                                        SeatType = inDict.ContainsKey("SeatType") ? inDict["SeatType"] : "",
                                        FromArea = inDict.ContainsKey("FromArea") ? inDict["FromArea"] : "",
                                        ToArea = inDict.ContainsKey("ToArea") ? inDict["ToArea"] : "",
                                        FromId = inDict.ContainsKey("FromId") ? inDict["FromId"] : "",
                                        ToId = inDict.ContainsKey("ToId") ? inDict["ToId"] : "",
                                        Type = inDict.ContainsKey("Type") ? inDict["Type"] : "",
                                    };
                                    var inHis = log.UCompId + "##" + log.UAgentId + "##" + log.UserId + "##" + log.Username +
                                            "##" +
                                            log.ActionDate + "##BookTicket" +
                                            (new JavaScriptSerializer()).Serialize(bookObj);
                                    result.Add(inHis);
                                }
                                else
                                {
                                    var upObj = log.DiffInfo.Replace("#~#", ",").Replace("#:#", ":");
                                    var upHis = log.UCompId + "##" + log.UAgentId + "##" + log.UserId + "##" + log.Username +
                                            "##" + log.ActionDate + "##UpdateBookTicket" +
                                            (new JavaScriptSerializer()).Serialize(upObj);
                                    result.Add(upHis);
                                }
                            }
                        }
                    }
                }
            }
            Console.WriteLine("----------------------------End------------------------");
            Console.ReadKey();
        }
    }
}
