using System;
using System.Reflection;
using log4net;
using log4net.Config;

namespace Vxr.Bms.Queue
{
    public class Log4Net
    {

        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        public void LogContent(string content)
        {
            try
            {
                GlobalContext.Properties["LogName"] = DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
                XmlConfigurator.Configure(); //only once
                Log.InfoFormat("\n" + content);
            }
            catch (Exception e)
            {
                
            }
        }
    }
}