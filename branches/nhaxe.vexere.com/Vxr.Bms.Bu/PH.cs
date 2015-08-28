using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;

namespace Vxr.Bms.Bu
{
    public class PH
    {
        public static void HData(object obj, string[] h, out object oo)
        {
            var d = ((Dictionary<string, object>)obj).ContainsKey("_d") ?
                ((Dictionary<string, object>)obj)["_d"] as Dictionary<string, object> : null;
            var dt = DateTime.Now.ToString("o").Substring(0, 23);
            var js = new JavaScriptSerializer();
            var dJs = js.Serialize(d).Replace("[", "").Replace("]", "");
            if (d != null)
                d.Add("IsPrgHistoryInfo",
                    h[5][0] == 'U'
                        ? string.Format("$x = $x + N'~{0}##{1}##{2}##{3}##{4}##{5}##{6}'", h[0], h[1], h[2], h[3], dt,
                            h[4], dJs)
                        : string.Format("{0}##{1}##{2}##{3}##{4}##{5}##{6}", h[0], h[1], h[2], h[3], dt, h[4], dJs));
            oo = obj;
        }
        public static void ListHDatas(object obj, string[] h, out object oo)
        {
            //var ld = ((Dictionary<string, object>)obj)["_d"] as object[];
            var dict = obj as Dictionary<string, object>;
            var randomCode = PE.GenerateTicketCode();
            if (dict != null)
            {
                object temp;
                dict.TryGetValue("_d", out temp);
                if (temp != null)
                {
                    var ld = ((IEnumerable)temp).Cast<Dictionary<string, object>>().ToArray();

                    var dt = DateTime.Now.ToString("o").Substring(0, 23);
                    foreach (var d in ld)
                    {
                        // chỉ tạo mã vé khi action là UpdateTicket
                        if (dict["_a"] != null && dict["_a"].ToString() == "UpdateBookTicket")
                        {
                            //Chèn mã code vào cho vé nếu chưa tồn tại.
                            if (!(d.ContainsKey("Code")))
                            {
                                if (d.ContainsKey("Status"))
                                {
                                    var ticketStatus = Convert.ToInt32(d["Status"]);
                                    if (ticketStatus != 3)
                                    {
                                        d.Add("Code", randomCode[0]);
                                        d.Add("TimeCode", Int32.Parse(randomCode[1]));
                                    }
                                }
                            }
                        }

                        var dFromArea = String.Empty;
                        var dToArea = String.Empty;
                        if (d.ContainsKey("FromArea"))
                        {
                            dFromArea = d["FromArea"].ToString();
                            d["FromArea"] = d["FromArea"].ToString().Replace("~", "<");
                        }
                        if (d.ContainsKey("ToArea"))
                        {
                            dToArea = d["ToArea"].ToString();
                            d["ToArea"] = d["ToArea"].ToString().Replace("~", "<");
                        }
                        var js = new JavaScriptSerializer();
                        var dJs = js.Serialize(d).Replace("[", "").Replace("]", "");
                        if (h[5][0] == 'U')
                            d.Add("IsPrgHistoryInfo",
                                string.Format("$x = $x + N'~{0}##{1}##{2}##{3}##{4}##{5}##{6}'", h[0], h[1], h[2],
                                    h[3], dt, h[4], dJs));
                        else
                            d.Add("IsPrgHistoryInfo",
                                string.Format("{0}##{1}##{2}##{3}##{4}##{5}##{6}", h[0], h[1], h[2], h[3], dt, h[4],
                                    dJs));
                        if (d.ContainsKey("FromArea"))
                        {
                            d["FromArea"] = dFromArea;
                        }
                        if (d.ContainsKey("ToArea"))
                        {
                            d["ToArea"] = dToArea;
                        }
                    }
                }
            }
            oo = obj;
        }
    }
}
