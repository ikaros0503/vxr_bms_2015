using System;
using System.Web;
using System.Web.Http;
using System.Web.Script.Services;
using System.Web.Services;
using System.Collections.Generic;
using Vxr.Bms.Bu;
using Vxr.Bms.Bu.Dic;


/// <summary>
/// Summary description for Trip
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.ComponentModel.ToolboxItem(false)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[ScriptService]
public class Kernel : WebService
{
    //private Dictionary<string, object> EscapeSpecialChar(Dictionary<string, object> obj)
    //{
        
    //};
         
    [WebMethod(EnableSession = true)]
    //[ScriptMethod(UseHttpGet = true)]
    [ScriptMethod]
    public object P(object obj)
    {
        var pr = new object[2];
        pr[0] = obj;
        pr[1] = new { Result = 0, Records = "", TotalRecordCount = 0 };

        var _ip = (Dictionary<string, object>)obj;
        try
        {
            if (_ip.ContainsKey("_a"))
            {
                var a = _ip["_a"] as string;
                if (a != null && D._a.ContainsKey(a))
                {
                    var _a = D._a[a];
                    if (!string.IsNullOrEmpty(_a[6]) && _ip.ContainsKey("_d"))
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
                            hpp.Invoke(h, ph);// sử dụng gọi method
                        pr[0] = ph[2];

                    }
                    var p = new P();
                    var m = p.GetType().GetMethod(_a[5]);
                    if (m != null)
                        m.Invoke(p, pr);// sử dụng gọi method
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
        }
        catch (Exception ex)
        {
            pr[1] = new { Result = 0, Records = ex, TotalRecordCount = 0 };
        }
        return pr[1];
    }

    public object[] PE(object[] objs)
    {
        var ret = new object[objs.Length];
        for (int i = 0; i < objs.Length; i++)
        {
            var pr = new object[2];
            pr[0] = objs[i];
            pr[1] = new { Result = 0, Records = "", TotalRecordCount = 0 };
            var _ip = (Dictionary<string, object>) objs[i];
            try
            {
                if (_ip.ContainsKey("_a"))
                {
                    var a = _ip["_a"] as string;
                    if (a != null && D._a.ContainsKey(a))
                    {
                        var _a = D._a[a];
                        if (!string.IsNullOrEmpty(_a[6]) && _ip.ContainsKey("_d"))
                        {
                            //var h = Type.GetType("Vxr.Core.Extend.PH");
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
                            ph[0] = objs[i];
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
                ret[i] = pr[1];
            }
            catch (Exception ex)
            {
                ret[i] = new {Result = 0, Records = ex, TotalRecordCount = 0};
            }
        }
        return ret;
    }
}
