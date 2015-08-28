using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
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
    public class ReportController : ApiController
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
                    object oo;
                    o.TryGetValue("obj", out oo);

                    var obj = JsonConvert.DeserializeObject<Dictionary<string, object>> (oo.ToString());
                    

                    obj.TryGetValue("_cf", out cond);

                    if (cond != null)
                    {
                        var jObject = cond as JObject;
                        if (jObject != null) obj["_cf"] = jObject.ToObject<Dictionary<string, object>>();
                        object oout;
                        var cf = (Dictionary<string, object>)obj["_cf"];
                        cf.TryGetValue("alterView", out oout);
                        if (oout != null)
                        {
                            var v1 = oout as JArray;
                            if (v1 != null)
                            {
                                var v2 = v1.ToObject<ArrayList>();
                                ((Dictionary<string, object>) obj["_cf"])["alterView"] = v2;
                            }
                        }
                        cf.TryGetValue("mArrArgSumary", out oout);
                        if (oout != null)
                        {
                            var v1 = oout as JArray;
                            if (v1 != null)
                            {
                                var v2 = v1.ToObject<ArrayList>();
                                ((Dictionary<string, object>)obj["_cf"])["mArrArgSumary"] = v2;
                            }
                        }

                        cf.TryGetValue("classCol", out oout);
                        if (oout != null)
                        {
                            var v1 = oout as JArray;
                            if (v1 != null)
                            {
                                var v2 = v1.ToObject<ArrayList>();
                                var v3 = new ArrayList();
                                foreach (var v4 in v2)
                                {
                                    v3.Add((v4 as JArray).ToObject<ArrayList>());
                                }
                                ((Dictionary<string, object>)obj["_cf"])["classCol"] = v3;
                            }
                        }
                    }

                    var pr = new object[2];
                    pr[0] = obj;
                    pr[1] = null;

                    if (obj.ContainsKey("_a"))
                    {
                        var a = obj["_a"] as string;
                        if (a != null && DR._a.ContainsKey(a))
                        {
                            var _a = DR._a[a];
                            var p = new PR();
                            var m = p.GetType().GetMethod(_a[3]);
                            if (m != null)
                                m.Invoke(p, pr);// sử dụng gọi method
                            else // call extension
                            {
                                var pe = new PE();
                                m = pe.GetType().GetMethod(_a[3]);
                                if (m != null)
                                    m.Invoke(p, pr);// sử dụng gọi method
                            }
                        }
                    }

                    var sb = new StringBuilder();
                    if (pr[1] != null)
                    {
                        var objectses = pr[1] as List<object[]>;
                        if (objectses != null) sb.Append(objectses[0][0]);
                    }
                    else
                    {
                        sb.Append("ERROR");
                    }
                    //context.Response.ContentType = "text/plain";
                    //PE.CheckSizeFile(context, sb, 1000000);

                    var path = string.Format("/Files/Reports/BaoCaoDoanhTHuChiTiet-{0}.xls", DateTime.UtcNow.ToBinary());
                    var sw = new StreamWriter(HttpContext.Current.Server.MapPath("~" + path));
                    sw.WriteLine(sb);
                    if (sw.BaseStream.Length < 1000000)
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, (sb + ""));
                    }
                    else
                    {
                        sw.Flush();
                        return Request.CreateResponse(HttpStatusCode.OK, string.Format("<a href='{0}'>Click vào đây để down báo cáo</a>", path));
                    }
                }

                return Request.CreateResponse(HttpStatusCode.OK, "Error");
            }
            catch (Exception ex)
            {
                //Log error
                //_logger.Error(ex.Message);
                return Request.CreateResponse(HttpStatusCode.OK, "Error");
            }
        }
    }
}