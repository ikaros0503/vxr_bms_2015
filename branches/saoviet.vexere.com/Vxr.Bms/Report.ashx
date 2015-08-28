<%@ WebHandler Language="C#" Class="BaoCaoDoanhThuChiTietHandler" %>

/*------------------------------------*/
/* Summary description for  WSgcGobal_StyleSheet */
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using Vxr.Bms.Bu;
using Vxr.Bms.Bu.Dic;

public class BaoCaoDoanhThuChiTietHandler : IHttpHandler, IReadOnlySessionState
{
    public void ProcessRequest(HttpContext context = null)
    {
        var serializer = new JavaScriptSerializer();
        var value = new StreamReader(context.Request.InputStream).ReadToEnd(); ;
        var obj = ((serializer.Deserialize(value, typeof(Dictionary<string, object>))) as Dictionary<string, object>)["obj"];
        var pr = new object[2];
        pr[0] = obj;
        pr[1] = null;
        var _ip = (Dictionary<string, object>)obj;
        try
        {
            if (_ip.ContainsKey("_a"))
            {
                var a = _ip["_a"] as string;
                if (a != null && DR._a.ContainsKey(a))
                {
                    var _a = DR._a[a];
                    var p = new PR();
                    MethodInfo m = p.GetType().GetMethod(_a[3]);
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
        }
        catch (Exception ex)
        {
            pr[1] = null;
            
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
        PE.CheckSizeFile(context, sb, 1000000);

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}