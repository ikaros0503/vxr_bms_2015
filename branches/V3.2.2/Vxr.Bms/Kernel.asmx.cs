using System;
using System.Configuration;
using System.Web;
using System.Web.Script.Services;
using System.Web.Security;
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
    private static readonly int RqLimitTime = Convert.ToInt32(ConfigurationManager.AppSettings["RequestLimitTime"]);
    private static readonly int RqLimitCount = Convert.ToInt32(ConfigurationManager.AppSettings["RequestLimitCount"]);
    //private Dictionary<string, object> EscapeSpecialChar(Dictionary<string, object> obj)
    //{

    //};
    [WebMethod(EnableSession = true)]
    //[ScriptMethod(UseHttpGet = true)]
    [ScriptMethod]
    public int LogOut()
    {
        FormsAuthentication.SignOut();
        Session.Clear();
        //Page.Response.Redirect("Login.aspx");
        return 1;
    }

    [WebMethod(EnableSession = true)]
    //[ScriptMethod(UseHttpGet = true)]
    [ScriptMethod]
    public object P(object obj)
    {
        if (Session["UserId"] == null)
        {
            return new { Result = 0, Message = "Session is expired.", Expired = 2 };
        }
        else
        {
            Session["ReTime"] = Session["ReTime"] ?? DateTime.Now;
            var st = Session["ReTime"] is DateTime ? (DateTime)Session["ReTime"] : new DateTime();
            var t = DateTime.Now - st;

            if (t.Seconds < RqLimitTime)
            {
                if (Convert.ToInt32(Session["Count"]) > RqLimitCount)
                {
                    return new { Result = -10, Message = "Do you want to hack me ?" };
                }
                else
                {
                    Session["Count"] = Session["Count"] == null ? 0 : Convert.ToInt32(Session["Count"]) + 1;
                }
            }
            else
            {
                Session["Count"] = 0;
            }
            //if (Convert.ToInt32(Session["Count"]) == 5)
            //{
            //    Session["Count"] = -1;
            //    return new { Result = 0, Message = "Session is expired.", Expired = 1 };
            //}
        }

        var pr = new object[2];
        pr[0] = obj;
        pr[1] = new { Result = 0, Records = "", TotalRecordCount = 0 };

        var _ip = (Dictionary<string, object>)obj;
        try
        {
            if (HttpContext.Current.Request.Headers["csrf"] != null)
            {
                //string csrf = HttpContext.Current.Request.Headers["csrf"].ToString();
                //if (Session["CSRF"] != null)
                //{
                //    string sessCSRF = Session["CSRF"].ToString();
                //    if (sessCSRF == csrf)
                //    {
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
            //    }
            //}
        }
        catch (Exception ex)
        {
            pr[1] = new { Result = 0, Records = ex, TotalRecordCount = 0 };
        }

        return pr[1];
    }

    [WebMethod(EnableSession = true)]
    //[ScriptMethod(UseHttpGet = true)]
    [ScriptMethod]
    public object PS()
    {
        var s = new[]
        {
            Session["CompId"],
            Session["AgentId"],
            Session["UserId"],
            Convert.ToString(Session["UserName"]).ToLower(),
            TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow).TotalMinutes,
            DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
            Session["CompanyType"],
            Session["CompanyCode"],
            Session["CompanyFullName"],
            Session["CompanyName"],
            Session["PersonIdFullName"],
            Session["AgentIdType"],
            Session["AgentIdCode"],
            Session["AgentIdName"],
            Session["AgentIdFullName"],
            Session["Rights"],
            Session["RoleGroups"],
            Session["CompRights"],
            Session["HasCustomReport"],
            Session["xBksJs"],
            Session["xBksCss"],
            Session["Roles"],
            Session["CSRF"],
            Session["AgentBlockSeats"]
        };
        return s;
    }
    public object[] PE(object[] objs)
    {
        var ret = new object[objs.Length];
        if (HttpContext.Current.Request.Headers["csrf"] != null)
        {
            //string csrf = HttpContext.Current.Request.Headers["csrf"].ToString();
            //if (Session["CSRF"] != null)
            //{
            //    string sessCSRF = Session["CSRF"].ToString();
            //    if (sessCSRF == csrf)
            //    {
            for (int i = 0; i < objs.Length; i++)
            {
                var pr = new object[2];
                pr[0] = objs[i];
                pr[1] = new { Result = 0, Records = "", TotalRecordCount = 0 };
                var _ip = (Dictionary<string, object>)objs[i];
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
                    ret[i] = new { Result = 0, Records = ex, TotalRecordCount = 0 };
                }
            }
            //    }
            //}
        }
        return ret;
    }
}
