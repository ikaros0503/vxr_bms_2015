using System.Reflection;
using log4net;
using log4net.Config;

namespace Vxr.Bms.AuditLog
{
    public class Log4Net
    {

        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        public void LogContent(string content)
        {
            XmlConfigurator.Configure(); //only once
            Log.InfoFormat("\n" + content);
        }
    }
}