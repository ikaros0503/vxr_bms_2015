using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Web;
using System.Web.Script.Services;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI;
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Vxr.Bms.Bu;

namespace Vxr.Bms
{
    public partial class Check : Page
    {
        public static string _cs = ConfigurationManager.AppSettings["cs"];
        protected void Page_Load(object sender, EventArgs e)
        {
            var key = Request.QueryString["key"];

            if (key == null || !key.Equals(ConfigurationManager.AppSettings["CheckPageKey"])) return;

            var obj = new Dictionary<string, object>
            {
                {"_a", "fGetTrip"},
                {
                    "_c",
                    new Dictionary<string, object>
                    {
                        {"Id", 1115},
                    }
                },
                {
                    "_f", "Name"
                }
            };
         
            var result = new DataTable();
            
            var time = new Dictionary<string,object>();
            try
            {
                var con = new SqlConnection(_cs);
                var cmd = new SqlCommand("select Id, Username from Account Where Username = N'admin.saoviet'", con);
                var timePerParse = Stopwatch.StartNew();
                cmd.Connection.Open();
                timePerParse.Stop();
                time.Add("connect", timePerParse.ElapsedMilliseconds);
                var adap = new SqlDataAdapter(cmd);
                try
                {
                    timePerParse = Stopwatch.StartNew();
                    adap.Fill(result);
                    timePerParse.Stop();
                    time.Add("query", timePerParse.ElapsedMilliseconds);
                    time.Add("status", "success");
                }
                catch (Exception)
                {
                    time.Add("status", "query_error");
                    timePerParse.Stop();
                }
                finally
                {
                    adap.Dispose();
                    cmd.Dispose();
                    con.Close();
                }
            }
            catch (Exception)
            {
                time.Add("status", "connect_error");
            }
            Response.Write(JsonConvert.SerializeObject(time));
        }
    }
}