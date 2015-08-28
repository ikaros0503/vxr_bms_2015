using System;
using System.Web.Security;

namespace Vxr.Bms
{
    public partial class Logout : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            Page.Response.Redirect("Login.aspx");
        }
    }
}