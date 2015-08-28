using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
//using System.Web.Http.Cors;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Vxr.Bms.Bu;
using Vxr.Bms.Bu.Dic;

namespace Vxr.Bms.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*", SupportsCredentials = true)]
    public class BookingController : ApiController
    {
        /// <summary>
        /// Booking main service
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<HttpResponseMessage> Post(HttpRequestMessage request)
        {
            //var serializer = new JavaScriptSerializer();
            //var dtConverter = new DateTimeJavaScriptConverter();
            //serializer.RegisterConverters(new List<JavaScriptConverter>(){ dtConverter });
            try
            {
                //Deserialize param
                var jsonString = await request.Content.ReadAsStringAsync();
                if (!String.IsNullOrEmpty(jsonString))
                {
                    var o = JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonString);
                    object cond;
                    object data;
                    object oo;
                    o.TryGetValue("obj", out oo);

                    var obj = JsonConvert.DeserializeObject<Dictionary<string, object>> (oo.ToString());
                    

                    obj.TryGetValue("_c", out cond);
                    obj.TryGetValue("_d", out data);

                    if (cond != null)
                    {
                        if (cond.GetType().Name.Equals("JArray"))
                        {
                            var jArray = cond as JArray;
                            if (jArray != null) obj["_c"] = jArray.ToObject<Dictionary<string, object>[]>();
                        }
                        else
                        {
                            var jObject = cond as JObject;
                            if (jObject != null) obj["_c"] = jObject.ToObject<Dictionary<string, object>>();
                        }
                    }
                    if (data != null)
                    {
                        if (data.GetType().Name.Equals("JArray"))
                        {
                            var jArray = data as JArray;
                            if (jArray != null) obj["_d"] = jArray.ToObject<Dictionary<string, object>[]>();
                        }
                        else
                        {
                            var jObject = data as JObject;
                            if (jObject != null) obj["_d"] = jObject.ToObject<Dictionary<string, object>>();
                        }
                    }


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
                    return Request.CreateResponse(HttpStatusCode.OK, (pr[1]));
                }

                return Request.CreateResponse(HttpStatusCode.OK, (new
                {
                    Result = 0,
                    Records = "",
                    TotalRecordCount = 0
                }));
            }
            catch (Exception ex)
            {
                //Log error
                //_logger.Error(ex.Message);
                return Request.CreateResponse(HttpStatusCode.OK, (new
                {
                    Result = 0,
                    Records = ex.Message,
                    TotalRecordCount = 0
                }));
            }
        }
    }
}