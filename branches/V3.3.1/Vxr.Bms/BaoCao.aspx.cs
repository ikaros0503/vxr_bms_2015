using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Vxr.Bms
{
    public partial class BaoCao : System.Web.UI.Page
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