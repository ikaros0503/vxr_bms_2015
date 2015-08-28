using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Vxr.Bms.AuditLog
{
    public class QueueReader
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
                        channel.QueueDeclare("SaveLog", false, false, false, null);
                        var consumer = new QueueingBasicConsumer(channel);
                        channel.BasicConsume("SaveLog", true, consumer);
                        int count = 0;
                        while (true)
                        {
                            try
                            {
                                var ea = (BasicDeliverEventArgs)consumer.Queue.Dequeue();
                                var body = ea.Body;
                                var message = Encoding.UTF8.GetString(body);
                                message = message.Trim();
                                if (message.Length > 0) SaveLog(message);

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

        public static void SaveLog(string message)
        {
            var newDictItems = new Dictionary<string, string>();
            var diffInfos = new List<string>();
            var info = string.Empty;

            if (message.IndexOf("#|#", StringComparison.Ordinal) != -1)
            {
                var splitMess = message.Split(new[] { "#|#" }, StringSplitOptions.None);

                var newData = splitMess[0];
                info = newData;
                var newItems = newData.Split(new[] { "#~#" }, StringSplitOptions.None);
                newDictItems =
                    newItems.Select(item1 => item1.Split(new[] { "#:#" }, StringSplitOptions.None))
                        .ToDictionary(splItem1 => splItem1[0], splItem1 => splItem1[1]);

                var oldDictItems = new Dictionary<string, string>();
                var oldData = splitMess[1];
                var oldItems = oldData.Split(new[] { "#~#" }, StringSplitOptions.None);
                oldDictItems =
                    oldItems.Select(item2 => item2.Split(new[] { "#:#" }, StringSplitOptions.None))
                        .ToDictionary(splItem2 => splItem2[0], splItem2 => splItem2[1]);

                diffInfos.AddRange(from d in newDictItems
                                   let ob = oldDictItems.FirstOrDefault(x => x.Key == d.Key && x.Value != d.Value)
                                   where ob.Key == d.Key
                                   select d.Key + "#:#" + d.Value);
            }
            else
            {
                info = message;
                var newItems = message.Split(new[] { "#~#" }, StringSplitOptions.None);
                foreach (var item in newItems)
                {
                    var v = item.Split(new[] { "#:#" }, StringSplitOptions.None);
                    if (!newDictItems.ContainsKey(v[0]))
                    {
                        newDictItems.Add(v[0], v[1]);
                    }
                    else
                    {
                        Log.LogContent("Message: " + " - \n" + message);
                        Log.LogContent("ErrorKey: " + " - \n" + v[0] + " , " + v[1]);
                    }
                }
            }

            using (var auditLogDb = new AuditLogEntities())
            {
                try
                {
                    var lg = new Audit_Log_2015();
                    lg.Domain = newDictItems.ContainsKey("Domain") ? (newDictItems["Domain"] ?? "") : "";
                    lg.DB = "VXR_BMS_003";
                    lg.IPAddress = newDictItems.ContainsKey("IPAddress") ? (newDictItems["IPAddress"] ?? "") : "";
                    lg.TableName = newDictItems.ContainsKey("TableName") ? (newDictItems["TableName"] ?? "") : "";
                    lg.AppId = newDictItems.ContainsKey("AppId") ? (!string.IsNullOrWhiteSpace(newDictItems["AppId"]) ? Convert.ToInt32(newDictItems["AppId"]) : (int?)null) : null;
                    lg.ActionName = newDictItems.ContainsKey("ActionName") ? (newDictItems["ActionName"] ?? "") : "";
                    lg.ActionType = newDictItems.ContainsKey("ActionType") ? (newDictItems["ActionType"] ?? "") : "";
                    lg.RecordIds = newDictItems.ContainsKey("RecordIds") ? (newDictItems["RecordIds"] ?? "") : "";
                    lg.RecordType = newDictItems.ContainsKey("RecordType") ? (newDictItems["RecordType"] ?? "") : "";
                    lg.Name = newDictItems.ContainsKey("Name") ? newDictItems["Name"] : "";
                    lg.UserId = newDictItems.ContainsKey("UserId") ? (!string.IsNullOrWhiteSpace(newDictItems["UserId"]) ? Convert.ToInt64(newDictItems["UserId"]) : (long?)null) : null;
                    lg.Username = newDictItems.ContainsKey("Username") ? (newDictItems["Username"] ?? "") : "";
                    lg.SessionInfo = newDictItems.ContainsKey("SessionInfo") ? (newDictItems["SessionInfo"] ?? "") : "";
                    lg.Info = info;
                    lg.DiffInfo = diffInfos.Count > 0 ? string.Join("#~#", diffInfos) : "";
                    lg.UCompId = newDictItems.ContainsKey("UCompId") ? (!string.IsNullOrWhiteSpace(newDictItems["UCompId"]) ? Convert.ToInt64(newDictItems["UCompId"]) : (long?)null) : null;
                    lg.UAgentId = newDictItems.ContainsKey("UAgentId") ? (!string.IsNullOrWhiteSpace(newDictItems["UAgentId"]) ? Convert.ToInt64(newDictItems["UAgentId"]) : (long?)null) : null;
                    lg.Status = 1;
                    lg.ActionDate = DateTime.Now;
                    auditLogDb.Audit_Log_2015.Add(lg);
                    auditLogDb.SaveChanges();
                }
                catch (Exception ex)
                {
                    Log.LogContent("Error: " + " - \n" + ex.ToString());
                }
            }
        }
    }
}
