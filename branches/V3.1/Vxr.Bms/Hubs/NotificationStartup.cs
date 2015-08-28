using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Vxr.Bms.NotificationStartup))]
namespace Vxr.Bms
{
    public class NotificationStartup 
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            //app.MapSignalR();
        }
    }
}
