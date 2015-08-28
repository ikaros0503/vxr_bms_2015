using System;
using System.Text;
using System.Web;
using System.Reflection;
using log4net;
using log4net.Config;

namespace Vxr.Bms.Core
{
    public class L
    {

        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        public void LogContent(string content)
        {
            XmlConfigurator.Configure(); //only once
            var info = new StringBuilder("");
            try
            {
                info.Append(HttpContext.Current.Request.UserHostAddress + " - ")
                    .Append(HttpContext.Current.Request.UserAgent + " - ")
                    .Append(HttpContext.Current.Request.Headers["CompId"] + " - ")
                    .Append(HttpContext.Current.Request.Headers["UserName"] + " \n");
            }
            catch (Exception ex)
            {
                
            }
            Log.InfoFormat("\n" + info.ToString() + content);
        }
    }
}