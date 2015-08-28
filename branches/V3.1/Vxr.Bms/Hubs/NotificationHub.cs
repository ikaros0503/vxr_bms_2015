using System;
using Microsoft.AspNet.SignalR;

namespace Vxr.Bms
{
    public class NotificationHub : Hub
    {
        public void Send(string pass, string header, string msg, string person)
        {
            // Call the broadcastMessage method to update clients.
            if (pass.Equals("vxr2015")) Clients.All.sendNotification(header, msg, person);
        }
        public void SendNotify(string action, string data)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.notifyVms(action, data);
        }
    }
}