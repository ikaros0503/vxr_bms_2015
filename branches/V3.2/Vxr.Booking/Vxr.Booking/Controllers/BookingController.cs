using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Vxr.Bms.Core;
using Vxr.Bms.Bu;
using Vxr.Bms.Bu.Dic;
using JsonSerializer = ServiceStack.Text.JsonSerializer;

namespace Vxr.Booking.Controllers
{
    public class BookingController : ApiController
    {
        private readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Booking main service
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<HttpResponseMessage> Post(HttpRequestMessage request)
        {
            try
            {
                //Deserialize param
                var jsonString = await request.Content.ReadAsStringAsync();
                if (!String.IsNullOrEmpty(jsonString))
                {
                    var obj = JsonSerializer.DeserializeFromString<Dictionary<string, object>>(jsonString);

                    var pr = new object[2];
                    pr[0] = obj;
                    pr[1] = new
                    {
                        Result = 0,
                        Records = String.Empty,
                        TotalRecordCount = 0
                    };

                    if (obj.ContainsKey("_a"))
                    {
                        var a = obj["_a"] as string;
                        if (a != null && D._a.ContainsKey(a))
                        {
                            var _a = D._a[a];
                            if (_a.Length > 6 && !string.IsNullOrEmpty(_a[6]) && obj.ContainsKey("_d"))
                            {
                                var h = new PH();

                                string[] l =
                                {
                                    HttpContext.Current.Request.Headers["CompId"],
                                    HttpContext.Current.Request.Headers["AgentId"],
                                    HttpContext.Current.Request.Headers["UserId"],
                                    HttpContext.Current.Request.Headers["UserName"],
                                    a, _a[0]
                                };
                                var ph = new object[3];
                                ph[0] = obj;
                                ph[1] = l;
                                ph[2] = new object();
                                var hpp = h.GetType().GetMethod(_a[6]);
                                if (hpp != null)
                                    hpp.Invoke(h, ph); // sử dụng gọi method
                                pr[0] = ph[2];

                            }
                            var p = new P();
                            var m = p.GetType().GetMethod(_a[5]);
                            if (m != null)
                                m.Invoke(p, pr); // sử dụng gọi method
                            else // call extension
                            {
                                var t = new PE();
                                m = t.GetType().GetMethod(_a[5]);
                                if (m != null)
                                    m.Invoke(t, pr); // sử dụng gọi method
                                else
                                {
                                    var b = new PB();
                                    m = b.GetType().GetMethod(_a[5]);
                                    if (m != null)
                                        m.Invoke(b, pr); // sử dụng gọi method
                                }
                            }
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, JsonSerializer.SerializeToString(pr[1]));
                }

                return Request.CreateResponse(HttpStatusCode.OK, JsonSerializer.SerializeToString(new
                {
                    Result = 0,
                    TotalRecordCount = 0
                }));
            }
            catch (Exception ex)
            {
                //Log error
                _logger.Error(ex.Message);
                return Request.CreateResponse(HttpStatusCode.OK, JsonSerializer.SerializeToString(new
                {
                    Result = 0,
                    TotalRecordCount = 0,
                    Message = ex.Message
                }));
            }
        }
    }
}
