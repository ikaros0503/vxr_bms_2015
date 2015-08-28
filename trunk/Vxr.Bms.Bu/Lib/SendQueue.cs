using System.Configuration;
using System.Text;
using RabbitMQ.Client;
using System;

namespace Vxr.Bms.Bu.Lib
{
    public class SendQueue
    {
        private static readonly string Hn = ConfigurationManager.AppSettings["RbQHost"];
        private static readonly string isQueue = ConfigurationManager.AppSettings["IsQueue"];
        public void Send(string name, string msg)
        {
            try
            {
                if (isQueue == "1")
                {
                    var factory = new ConnectionFactory() { HostName = Hn };
                    using (var connection = factory.CreateConnection())
                    {
                        using (var channel = connection.CreateModel())
                        {
                            channel.QueueDeclare(name, false, false, false, null);
                            var body = Encoding.UTF8.GetBytes(msg);
                            channel.BasicPublish("", name, null, body);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }
        }
    }
}
