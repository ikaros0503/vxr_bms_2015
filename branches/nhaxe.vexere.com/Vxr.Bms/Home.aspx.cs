using System.Web.Security;
using System.Web.UI;
using System;

namespace Vxr.Bms
{
    public partial class Home : Page
    {
        public static int VxrId = 1;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["bLogin"] == null || (int)Session["bLogin"] != 1)
            {
                Response.Redirect("Login.aspx");
            }
        }

        protected void LoggingOut(object sender, EventArgs e)
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            Page.Response.Redirect("Login.aspx");
        }
    }
}