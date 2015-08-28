using System.ServiceProcess;

namespace Vxr.Bms.Queue
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main()
        {
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[] 
            { 
                new Receiver() 
            };
            ServiceBase.Run(ServicesToRun);
        }
    }
}
