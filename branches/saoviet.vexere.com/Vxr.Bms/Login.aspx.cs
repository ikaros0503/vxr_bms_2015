using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Configuration;
using System.Web.UI;
using Vxr.Bms.Bu;
using Vxr.Bms.Models;

namespace Vxr.Bms
{
    public partial class Login : System.Web.UI.Page
    {
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
                ViewState["CountCap"] = 1;
                //if (IsValid)
                //{
                //    Console.WriteLine("Tesst");
                //}
                if (Session["bLogin"] != null && (int)Session["bLogin"] == 1)
                {
                    Response.Redirect("Home.aspx");
                }
            }
        }

        protected void LogIn(object sender, EventArgs e)
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


            //int cap = 0;
            //string keyCaptcha = WebConfigurationManager.AppSettings["recaptcha"];
            //cap = Int32.Parse(ViewState["CountCap"].ToString());
            //if (keyCaptcha != "")
            //{
            //if (cap == Int32.Parse(keyCaptcha))
            //{
            //    div_captcha.Style.Clear();
            //    cap++;
            //    ViewState["CountCap"] = cap;
            //}
            //else if (cap > Int32.Parse(keyCaptcha))
            //{                    
            //    div_captcha.Style.Clear();
            //    int result = EnableCaptcha();
            //    if (result != 99)
            //    {
            //        ScriptManager.RegisterStartupScript(this, GetType(), "showCaptchaError", "showCaptchaError(" + result + ");", true);
            //    }
            //    else
            //    {
            //        loginAction();
            //    }
            //}
            //else
            //{
            //    loginAction();
            //    cap++;
            //    ViewState["CountCap"] = cap;
            //}
            //}
        }
        void loginAction()
        {
            try
            {
                var obj = new Dictionary<string, object> { 
            { "_a", "fGetAccount" }, 
            { "_c", new Dictionary<string, object> { { "Username", UserName.Value }, {"Password",Password.Value}, {"IsPrgStatus", 1} } }, 
            //{ "_f", "Id, CompId, AgentId, PersonId, CompIdType, CompIdCode, CompIdFullName, CompIdName, AgentIdType, AgentIdCode, AgentIdName, AgentIdFullName, PersonIdFullName, Role, Info, CompIdUIConfigInfo" } 
            { "_f", "Id, CompId, AgentId, PersonId, CompanyType, CompanyCode, CompanyFullName, CompanyName, AgentType, AgentCode, AgentName, AgentFullName, PersonFullName, Role, Info, CompanyUIConfigInfo, RoleGroups" } 
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
                    Session["Rights"] = oo[0][14];//UIConfigInfo
                    Session["CompRights"] = oo[0][15];
                    Session["RoleGroups"] = oo[0][16];
                    //Session["UserName"] = UserName.Value;
                    Session["bLogin"] = 1;
                    Session["Role"] = "";
                    Session["HasCustomReport"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/report.js")) ? 1 : 0;
                    Session["xBksJs"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/custom.js")) ? 1 : 0;
                    Session["xBksCss"] = File.Exists(Server.MapPath("Comp/" + Session["CompId"] + "/custom.css")) ? 1 : 0;
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
        public int ValidateCaptcha()
        {
            int check = 1;
            try
            {
                if (txt_captcha.Value != string.Empty)
                {
                    CaptchaControl1.ValidateCaptcha(txt_captcha.Value);
                    if (CaptchaControl1.UserValidated)
                    {
                        return check = 99;
                    }
                    else
                    {
                        return check = 2;
                    }
                }
            }
            catch
            {
            }
            return check;
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
        //public int EnableCaptcha()
        //{
        //    int check = 0;
        //    try
        //    {
        //        var response = Request["g-recaptcha-response"];
        //        //secret that was generated in key value pair
        //        const string secret = "6LdmagYTAAAAADIeV6IGNvAFhkg5RgS4uuiXJUPL";
        //        var client = new WebClient();
        //        var reply =
        //            client.DownloadString(
        //                string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", secret, response));
        //        var captchaResponse = JsonConvert.DeserializeObject<RC.CaptchaResponse>(reply);

        //        //when response is false check for the error message
        //        if (!captchaResponse.Success)
        //        {
        //            if (captchaResponse.ErrorCodes.Count <= 0) return check = 99; ;

        //            var error = captchaResponse.ErrorCodes[0].ToLower();
        //            switch (error)
        //            {
        //                case ("missing-input-secret"):
        //                    check = 1;
        //                    break;
        //                case ("invalid-input-secret"):
        //                    check = 2;
        //                    break;

        //                case ("missing-input-response"):
        //                    check = 3;
        //                    break;
        //                case ("invalid-input-response"):
        //                    check = 4;
        //                    break;

        //                default:
        //                    check = 5;
        //                    break;
        //            }
        //        }
        //        else
        //        {
        //            check = 99;
        //        }
        //    }
        //    catch
        //    {
        //        check = 5;
        //    }
        //    return check;
        //}


    }
}