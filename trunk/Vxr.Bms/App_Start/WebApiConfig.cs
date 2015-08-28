using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Serialization;

namespace Vxr.Bms
{
    public static class WebApiConfig
    {
        public static void MyConfig(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new {controller = "Booking",  id = RouteParameter.Optional }
            );

            // Enforce HTTPS
            //config.Filters.Add(new LocalAccountsApp.Filters.RequireHttpsAttribute());
        }
    }
}
