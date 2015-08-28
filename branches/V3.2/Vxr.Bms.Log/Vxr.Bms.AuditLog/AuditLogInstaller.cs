using System.ComponentModel;
using System.ServiceProcess;

namespace Vxr.Bms.AuditLog
{
    [RunInstaller(true)]
    public partial class AuditLogInstaller : System.Configuration.Install.Installer
    {
        public AuditLogInstaller()
        {
            var serviceProcessInstaller = new ServiceProcessInstaller();
            var serviceInstaller = new ServiceInstaller();

            //# Service Account Information
            serviceProcessInstaller.Account = ServiceAccount.LocalSystem;
            serviceProcessInstaller.Username = null;
            serviceProcessInstaller.Password = null;

            //# Service Information
            serviceInstaller.DisplayName = "Vxr.Bms.AuditLogReceiver";
            serviceInstaller.StartType = ServiceStartMode.Automatic;

            //# This must be identical to the WindowsService.ServiceBase name
            //# set in the constructor of WindowsService.cs
            serviceInstaller.ServiceName = "Vxr.Bms.AuditLogReceiver";

            this.Installers.Add(serviceProcessInstaller);
            this.Installers.Add(serviceInstaller);
        }
    }
}
