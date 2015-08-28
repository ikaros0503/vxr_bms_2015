using System.Configuration;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Configuration;
using System.Web.UI;
using Vxr.Bms.Bu;
using Vxr.Bms.Api;
using System.Web.Http;

namespace Vxr.Bms
{
    public partial class Login : System.Web.UI.Page
    {
        public static bool IsUseCaptcha = (ConfigurationManager.AppSettings["IsUseCaptcha"] == "1");
        public static APIModels api = new APIModels();
        public static Dictionary<string, string> Pages = new Dictionary<string, string>()
        {
            {"1", "Report.aspx"},
            {"2", "Report.aspx"},
            {"3", "Report.aspx"},
            {"4", "Home.aspx"}
        };
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

                if (Session["bLogin"] != null && (int)Session["bLogin"] == 1)
                {
                    Response.Redirect("Home.aspx");
                }
            }

        }

        protected void LogIn(object sender, EventArgs e)
        {
            if (IsUseCaptcha)
            {
                int result = ValidateCaptcha();

                if (result != 99)
                {
                    ScriptManager.RegisterStartupScript(this, GetType(), "showCaptchaError", "showCaptchaError(" + result + ");", true);
                }
                else
                {

                    loginAction();
                }
            }
            else
            {
                loginAction();
            }
        }
        void loginAction()
        {
            if (api.IsUseApi(UserName.Value))
            {
                if (api.Login(UserName.Value, Password.Value))
                {
                    dynamic oo = api.GetUserInfo();
                    Session["BaseUrl"] = HttpContext.Current.Request.Url.Host;
                    Session["UserId"] = oo.Id.ToString();
                    Session["UserName"] = UserName.Value;
                    Session["CompId"] = oo.CompId.ToString();
                    Session["AgentId"] = oo.AgentId.ToString();
                    Session["PersonId"] = oo.PersonId.ToString();
                    Session["CompanyType"] = oo.CompanyType.ToString();
                    Session["CompanyCode"] = oo.CompanyCode.ToString();
                    Session["CompanyFullName"] = oo.CompanyFullName.ToString();
                    Session["CompanyName"] = oo.CompanyName.ToString();
                    Session["AgentIdType"] = oo.AgentType.ToString();
                    Session["AgentIdCode"] = oo.AgentCode.ToString();
                    Session["AgentIdName"] = oo.AgentName.ToString();
                    Session["AgentIdFullName"] = oo.AgentFullName.ToString();
                    Session["PersonIdFullName"] = oo.PersonFullName.ToString();
                    Session["Roles"] = oo.Role.ToString();
                    Session["Rights"] = oo.Info.ToString(); //UIConfigInfo
                    Session["CompRights"] = oo.CompanyUIConfigInfo.ToString();
                    Session["RoleGroups"] = oo.RoleGroups.ToString();
                    //Session["UserName"] = UserName.Value;
                    Session["bLogin"] = 1;
                    Session["Role"] = "";
                    Session["HasCustomReport"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/report.js"))
                        ? 1
                        : 0;
                    Session["xBksJs"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/custom.js")) ? 1 : 0;
                    Session["xBksCss"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/custom.css"))
                        ? 1
                        : 0;
                    Session["CSRF"] = GetRandomNumbers(10);

                    if (Pages.ContainsKey(Session["Roles"].ToString()))
                    {
                        Page.Response.Redirect("#");
                    }
                    else
                    {
                        Page.Response.Redirect("#");
                    }
                }
                else
                {
                    //Wrong username or password
                    ScriptManager.RegisterStartupScript(this, GetType(), "showLoginError", "showLoginError();", true);
                }
            }
            else
            {
                try
                {
                    var obj = new Dictionary<string, object>
                    {
                        {"_a", "fGetAccount"},
                        {
                            "_c",
                            new Dictionary<string, object>
                            {
                                {"Username", UserName.Value},
                                {"Password", Password.Value},
                                {"IsPrgStatus", 1}
                            }
                        }, 
                        //{ "_f", "Id, CompId, AgentId, PersonId, CompIdType, CompIdCode, CompIdFullName, CompIdName, AgentIdType, AgentIdCode, AgentIdName, AgentIdFullName, PersonIdFullName, Role, Info, CompIdUIConfigInfo" } 
                        {
                            "_f",
                            "Id, CompId, AgentId, PersonId, CompanyType, CompanyCode, CompanyFullName, CompanyName, AgentType, AgentCode, AgentName, AgentFullName, PersonFullName, Role, Info, CompanyUIConfigInfo, RoleGroups, AgentBlockSeats"
                        }
                    };
                    //var obj = new Kernel.VxrServiceObject
                    //{
                    //    _a = "fGetAccount",
                    //    _c = new Dictionary<string, object> { { "Username", UserName.Value }, { "Password", Password.Value }, { "IsPrgStatus", 1 } },
                    //    _f =
                    //        "Id, CompId, AgentId, PersonId, CompIdType, CompIdCode, CompIdFullName, CompIdName, AgentIdType, AgentIdCode, AgentIdName, AgentIdFullName, PersonIdFullName, Role, Info, CompIdUIConfigInfo"
                    //};
                    List<object[]> oo;
                    PE.CheckLogin(obj, out oo);
                    if (oo.Count > 0)
                    {
                        Session["BaseUrl"] = HttpContext.Current.Request.Url.Host;
                        Session["IPAddress"] = HttpContext.Current.Request.UserHostAddress;
                        Session["UserId"] = oo[0][0];
                        Session["UserName"] = UserName.Value;
                        Session["CompId"] = oo[0][1];
                        Session["AgentId"] = oo[0][2];
                        Session["PersonId"] = oo[0][3];
                        //Session["CompIdType"] = oo[0][4];
                        //Session["CompIdCode"] = oo[0][5];
                        //Session["CompIdFullName"] = oo[0][6];
                        //Session["CompIdName"] = oo[0][7];
                        Session["CompanyType"] = oo[0][4];
                        Session["CompanyCode"] = oo[0][5];
                        Session["CompanyFullName"] = oo[0][6];
                        Session["CompanyName"] = oo[0][7];
                        //Session["AgentIdType"] = oo[0][8];
                        //Session["AgentIdCode"] = oo[0][9];
                        //Session["AgentIdName"] = oo[0][10];
                        //Session["AgentIdFullName"] = oo[0][11];
                        Session["AgentIdType"] = oo[0][8];
                        Session["AgentIdCode"] = oo[0][9];
                        Session["AgentIdName"] = oo[0][10];
                        Session["AgentIdFullName"] = oo[0][11];
                        Session["PersonIdFullName"] = oo[0][12];
                        Session["Roles"] = oo[0][13];
                        Session["Rights"] = oo[0][14]; //UIConfigInfo
                        Session["CompRights"] = oo[0][15];
                        Session["RoleGroups"] = oo[0][16];
                        Session["AgentBlockSeats"] = oo[0][17];
                        //Session["UserName"] = UserName.Value;
                        Session["bLogin"] = 1;
                        Session["Role"] = "";
                        Session["HasCustomReport"] =
                            File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/report.js")) ? 1 : 0;
                        Session["xBksJs"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/custom.js"))
                            ? 1
                            : 0;
                        Session["xBksCss"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/custom.css"))
                            ? 1
                            : 0;
                        Session["CSRF"] = GetRandomNumbers(10);
                        if (Pages.ContainsKey(Session["Roles"].ToString()))
                        {
                            //Page.Response.Redirect(Pages[Session["Roles"].ToString()]);
                            //Session["Role"] = "";
                            Page.Response.Redirect("#");
                        }
                        else
                        {
                            Page.Response.Redirect("#");
                            //Session["Role"] = "Seller";
                        }
                    }
                    else
                    {
                        txt_captcha.Value = "";
                        ScriptManager.RegisterStartupScript(this, GetType(), "showLoginError", "showLoginError();", true);
                        //Wrong username or password
                        ScriptManager.RegisterStartupScript(this, GetType(), "showLoginError", "showLoginError();", true);
                    }
                }
                catch (Exception ex)
                {
                    ScriptManager.RegisterStartupScript(this, GetType(), "showLoginError", "showLoginError();", true);
                }
            }
        }

        bool isUsernameExisted(string username)
        {
            var obj = new Dictionary<string, object> { 
                { "_a", "fGetAccount" }, 
                { "_c", new Dictionary<string, object> { { "Username", username }, {"IsPrgStatus", 1} } }, 
                { "_f", "Id, CompId, AgentId, PersonId " } 
            };

            List<object[]> oo;
            PE.CheckLogin(obj, out oo);
            return (oo != null && oo.Count > 0);
        }

        [HttpPost]
        public int ValidateCaptcha()
        {
            int check = 1;
            try
            {
                if (txt_captcha.Value.Trim() != string.Empty)
                {
                    var a = rpHash(Request.Form["txt_captcha"]);
                    var b = Request.Form["txt_captchaHash"].ToString();
                    if (a == b)
                    {
                        return check = 99;
                    }
                    else
                    {
                        txt_captcha.Value = "";
                        return check = 2;
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return check;
        }
        private string rpHash(string value)
        {
            int hash = 5381;
            value = value.ToUpper();
            for (int i = 0; i < value.Length; i++)
            {
                hash = ((hash << 5) + hash) + value[i];
            }
            return hash.ToString();
        }
        public string GetRandomNumbers(int numChars)
        {
            string[] chars = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S",
                        "T", "U", "V", "W", "X", "Y", "Z","0","1", "2", "3", "4", "5", "6", "7", "8", "9" };

            var rnd = new Random();
            string random = string.Empty;
            for (int i = 0; i < numChars; i++)
            {
                random += chars[rnd.Next(0, 33)];
            }
            return random;
        }


    }
}