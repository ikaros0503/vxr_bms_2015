using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Vxr.Bms.Api.Dic;

namespace Vxr.Bms.Api
{
    public class APIModels
    {
        private static string _apiUrl = ConfigurationManager.AppSettings["api_url"];
        private static string _clientId = ConfigurationManager.AppSettings["api_client_id"];
        private static string _clientSecret = ConfigurationManager.AppSettings["api_client_secret"];

        public static bool ApiConfig = (Convert.ToInt32(ConfigurationManager.AppSettings["IsUseApi"]) == 1);
        public static string ApiCompName = ConfigurationManager.AppSettings["ApiCompName"];
        public static string ApiDenyComp = ConfigurationManager.AppSettings["ApiDenyComp"];
        public static bool ApiAllComp = (Convert.ToInt32(ConfigurationManager.AppSettings["ApiAllComp"]) == 1);

        public bool IsUseApi(string username)
        {
            try
            {
                if (!ApiConfig) return false;

                if (!string.IsNullOrEmpty(ApiDenyComp))
                {
                    foreach (var a in ApiDenyComp.Split(','))
                    {
                        var regex = new Regex(@"\." + a);
                        var match = regex.Match(username);
                        if (match.Success) return false;
                    }
                }

                if (ApiAllComp) return true;

                if (!string.IsNullOrEmpty(ApiCompName))
                {
                    foreach (var a in ApiCompName.Split(','))
                    {
                        var regex = new Regex(@"\." + a);
                        var match = regex.Match(username);
                        if (match.Success) return true;
                    }
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public bool Login(string un, string pw)
        {
            try
            {
                WebRequest request = WebRequest.Create(_apiUrl + "/oauth/token");
                request.Method = "post";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("grant_type=password");
                postData.Append("&client_id=" + _clientId);
                postData.Append("&client_secret=" + _clientSecret);
                postData.Append("&username=" + un);
                postData.Append("&password=" + pw);

                byte[] byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();

                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                HttpContext.Current.Session["accessToken"] = tk.access_token;
                HttpContext.Current.Session["refreshToken"] = tk.refresh_token;
                HttpContext.Current.Session["expireTime"] = DateTime.Now.AddSeconds(Convert.ToInt32(tk.expires_in) - 300);

                return true;
            }
            catch (Exception exception)
            {
                return false;
            }

        }

        private void _refreshToken()
        {
            if (HttpContext.Current.Session["refreshToken"] != null)
            {
                WebRequest request = WebRequest.Create(_apiUrl + "/oauth/token");
                request.Method = "post";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("grant_type=refresh_token");
                postData.Append("&client_id=" + _clientId);
                postData.Append("&client_secret=" + _clientSecret);
                postData.Append("&refresh_token=" + HttpContext.Current.Session["refreshToken"]);

                byte[] byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();

                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                HttpContext.Current.Session["accessToken"] = tk.access_token;
                HttpContext.Current.Session["refreshToken"] = tk.refresh_token;
                HttpContext.Current.Session["expireTime"] = DateTime.Now.AddSeconds(Convert.ToInt32(tk.expires_in) - 300);
                return;
            }
            HttpContext.Current.Response.Redirect("Login.aspx");
        }
        private string _getAccessToken()
        {
            if (HttpContext.Current.Session["accessToken"] == null)
            {
                HttpContext.Current.Response.Redirect("Login.aspx");
            }
            else if (_isSessionTimeout())
            {
                _refreshToken();
            }

            return Convert.ToString(HttpContext.Current.Session["accessToken"]);
        }

        private static bool _isSessionTimeout()
        {
            var expireTime = HttpContext.Current.Session["expireTime"];
            if (expireTime == null) return true;
            return DateTime.Compare(DateTime.Now, Convert.ToDateTime(expireTime)) >= 0;
        }
        public object GetUserInfo()
        {
            WebRequest request = WebRequest.Create(_apiUrl + "/user?access_token=" + _getAccessToken());
            request.Method = "get";
            var response = (HttpWebResponse)request.GetResponse();

            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            dynamic tk = JObject.Parse(responseString);
            return tk.data;
        }

        public object GetTicket(object obj)
        {
            try
            {
                var accessToken = _getAccessToken();
                if (accessToken == null) return new { Result = 0 };

                var request = WebRequest.Create(_apiUrl + "/booking/offline");
                request.Method = "post";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("access_token=" + accessToken);

                var ip = (Dictionary<string, object>)obj;
                bool htrip = false, hfare = false, htype = false, hstage = false,
                    hhistory = false, hfrom = false, hto = false, hdate = false, hseattype = false;
                var datas = ((IEnumerable)ip["_d"]).Cast<Dictionary<string, object>>().ToArray();

                var byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                if (tk.data != null && tk.data.message.ToString().Equals("success"))
                {
                    try
                    {
                        //var q = new SendQueue();
                        //var ids = ((JArray)tk.data.tickets).Select(jv => (int)jv).ToArray();
                        //q.Send("UpdateTicket", string.Join("|", ids));
                    }
                    catch (Exception e)
                    {

                    }
                    return new { Result = 1, Records = tk.data.tickets, Message = "" };
                }

                if (tk.error != null && tk.error.message != null)
                {
                    return new { Result = 0, Message = tk.error.message.ToString() };
                }
                return new { Result = 0, Message = "Have error!" };
            }
            catch (WebException e)
            {
                using (var response = e.Response)
                {
                    using (var data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        var text = reader.ReadToEnd();
                        return new { Result = 0, Message = text };
                    }
                }
            }
        }

        public object BookTicket(object obj)
        {
            try
            {
                var accessToken = _getAccessToken();
                if (accessToken == null) return new { Result = 0 };

                var request = WebRequest.Create(_apiUrl + "/booking/offline");
                request.Method = "post";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("access_token=" + accessToken);

                var ip = (Dictionary<string, object>)obj;
                bool htrip = false, hfare = false, htype = false, halias = false, hstage = false,
                    hexpire = false, hpickup = false, hfrom = false, hto = false, hdate = false, hseattype = false;
                var datas = ((IEnumerable)ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
                var seatCodes = "";
                for (var i = 0; i < datas.Length; i++)
                {
                    foreach (var d in datas[i])
                    {
                        switch (d.Key)
                        {
                            case "TripId":
                                if (!htrip)
                                {
                                    postData.Append("&trip=" + d.Value);
                                    htrip = true;
                                }
                                break;
                            case "TripAlias":
                                if (!halias)
                                {
                                    postData.Append("&alias=" + d.Value);
                                    halias = true;
                                }
                                break;
                            case "SeatCode":
                                seatCodes += ("," + d.Value);
                                break;
                            case "Fare":
                                if (!hfare)
                                {
                                    postData.Append("&fare=" + d.Value);
                                    hfare = true;
                                }
                                break;
                            case "Type":
                                if (!htype)
                                {
                                    postData.Append("&type=" + d.Value);
                                    htype = true;
                                }
                                break;
                            case "FromId":
                                if (!hfrom)
                                {
                                    postData.Append("&from=" + d.Value);
                                    hfrom = true;
                                }
                                break;

                            case "ToId":
                                if (!hto)
                                {
                                    postData.Append("&to=" + d.Value);
                                    hto = true;
                                }
                                break;
                            case "SeatType":
                                if (!hseattype)
                                {
                                    postData.Append("&seat_type=" + d.Value);
                                    hseattype = true;
                                }
                                break;
                            case "StageCode":
                                if (!hstage)
                                {
                                    postData.Append("&stage=" + d.Value);
                                    hstage = true;
                                }
                                break;
                            case "ExpiredTime":
                                if (!hexpire)
                                {
                                    postData.Append("&expire_time=" + d.Value);
                                    hexpire = true;
                                }
                                break;
                            case "TripDate":
                                if (!hdate)
                                {
                                    try
                                    {
                                        var dt = Convert.ToDateTime(d.Value.ToString());
                                        postData.Append("&trip_date=" + dt.ToString("HH:mm dd-MM-yyyy"));
                                        hdate = true;
                                    }
                                    catch (Exception) { }
                                }
                                break;
                            case "PickupDate":
                                if (!hpickup)
                                {
                                    try
                                    {
                                        var dt = Convert.ToDateTime(d.Value.ToString());
                                        postData.Append("&pickup_date=" + dt.ToString("HH:mm dd-MM-yyyy"));
                                        hpickup = true;
                                    }
                                    catch (Exception)
                                    {

                                    }
                                }
                                break;
                        }
                    }
                }
                postData.Append("&seats=" + seatCodes.Substring(1));
                var byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                if (tk.data != null && tk.data.message.ToString().Equals("success"))
                {
                    try
                    {
                        //var q = new SendQueue();
                        //var ids = ((JArray)tk.data.tickets).Select(jv => (int)jv).ToArray();
                        //q.Send("UpdateTicket", string.Join("|", ids));
                    }
                    catch (Exception e)
                    {

                    }
                    return new { Result = 1, Records = tk.data.tickets, Message = "" };
                }

                if (tk.error != null && tk.error.message != null)
                {
                    return new { Result = 0, Message = tk.error.message.ToString() };
                }
                return new { Result = 0, Message = "Have error!" };
            }
            catch (WebException e)
            {
                using (var response = e.Response)
                {
                    using (var data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        var text = reader.ReadToEnd();
                        return new { Result = 0, Message = text };
                    }
                }
            }
        }

        public object UpdateTicket(object obj)
        {
            try
            {
                var accessToken = _getAccessToken();
                if (accessToken == null) return new { Result = 0 };

                WebRequest request = WebRequest.Create(_apiUrl + "/booking");
                request.Method = "put";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("access_token=" + accessToken);

                var ip = (Dictionary<string, object>)obj;

                var datas = ((IEnumerable)ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
                var conds = ((IEnumerable)ip["_c"]).Cast<Dictionary<string, object>>().ToArray();
                var allField = D._apiParams["Ticket"];
                for (var i = 0; i < datas.Length; i++)
                {
                    datas[i].Add("Id", conds[i]["Id"]);
                    var ticket = new Dictionary<string, object>();
                    foreach (var d in datas[i])
                    {
                        var vl = d.Value;
                        if (d.Key.Equals("CustomerInfo"))
                        {
                            var cis = d.Value.ToString().Split('|');
                            var n = string.IsNullOrEmpty(cis[3]) ? null : cis[3];
                            var p = string.IsNullOrEmpty(cis[4]) ? null : cis[4];
                            //var f = string.IsNullOrEmpty(cis[5]) ? null : cis[5];
                            //var m = string.IsNullOrEmpty(cis[6]) ? null : cis[6];
                            //var a = string.IsNullOrEmpty(cis[7]) ? null : cis[7];

                            try
                            {
                                vl = (new Dictionary<string, string>
                                {
                                    {"phone", p},
                                    {"name", n},
                                    //{"fax", f},
                                    //{"email", m},
                                    //{"address", a}
                                });
                            }
                            catch (Exception)
                            {
                                vl = (new Dictionary<string, string>
                                {
                                    {"phone", ""},
                                    {"name", ""},
                                    //{"fax", ""},
                                    //{"email", ""},
                                    //{"address", ""}
                                });
                            }
                            
                        }
                        try
                        {
                            ticket.Add(allField[d.Key], vl);
                        }
                        catch (Exception)
                        {

                        }
                    }
                    postData.Append("&tickets=" + JsonConvert.SerializeObject(ticket));
                }

                byte[] byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                if (tk.data != null && tk.data.message.ToString().Equals("success"))
                {
                    try
                    {
                        //var q = new SendQueue();
                        //var ids = ((JArray)tk.data.tickets).Select(jv => (int)jv).ToArray();
                        //q.Send("UpdateTicket", string.Join("|", ids));
                    }
                    catch (Exception e)
                    {

                    }

                    return new { Result = 1, Records = tk.data.tickets, Message = "" };
                }
                return new { Result = 0, Message = "Some error!" };
            }
            catch (WebException e)
            {
                using (var response = e.Response)
                {
                    using (Stream data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        var text = reader.ReadToEnd();
                        return new { Result = 0, Message = text };
                    }
                }
            }
        }

        public object UpdateTrip(object obj)
        {
            try
            {
                var accessToken = _getAccessToken();
                if (accessToken == null) return new object();

                WebRequest request = WebRequest.Create(_apiUrl + "/trip");
                request.Method = "put";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("access_token=" + accessToken);

                var ip = (Dictionary<string, object>)obj;
                var data = ip["_d"] as Dictionary<string, object>;
                var cond = ip["_c"] as Dictionary<string, object>;
                if (data.ContainsKey("Id"))
                {
                    data["Id"] = cond["Id"];
                }
                else
                {
                    data.Add("Id", cond["Id"]);
                }

                foreach (var d in data)
                {
                    switch (d.Key)
                    {
                        case "Id":
                            postData.Append("&id=" + d.Value);
                            break;
                        case "Code":
                            postData.Append("&code=" + d.Value);
                            break;
                        case "CompId":
                            postData.Append("&company=" + d.Value);
                            break;
                        case "FacilityInfo":
                            postData.Append("&facility=" + d.Value);
                            break;
                        case "FromId":
                            postData.Append("&from=" + d.Value);
                            break;
                        case "ToId":
                            postData.Append("&to=" + d.Value);
                            break;
                        case "Info":
                            postData.Append("&info=" + d.Value);
                            break;
                        case "IsPrgStatus":
                            postData.Append("&prg_status=" + d.Value);
                            break;
                        case "Name":
                            postData.Append("&name=" + d.Value);
                            break;
                        case "Note":
                            postData.Append("&note=" + d.Value);
                            break;
                        case "RouteId":
                            postData.Append("&route=" + d.Value);
                            break;
                        case "RouteInfo":
                            postData.Append("&route_info=" + d.Value);
                            break;
                        case "SeatTemplateInfo":
                            postData.Append("&seat_template=" + d.Value);
                            break;
                        case "BranchReceiveProduct":
                            postData.Append("&branch_receive_product=" + d.Value);
                            break;
                        case "TotalStage":
                            postData.Append("&stage=" + d.Value);
                            break;
                        case "Type":
                            postData.Append("&type=" + d.Value);
                            break;
                        case "Alias":
                            postData.Append("&alias=" + d.Value);
                            break;
                        case "BaseId":
                            postData.Append("&base=" + d.Value);
                            break;
                        case "Date":
                            postData.Append("&date=" + d.Value);
                            break;
                        case "FareInfo":
                            postData.Append("&fare=" + d.Value);
                            break;
                        case "StatusInfo":
                            postData.Append("&status_info=" + d.Value);
                            break;
                        case "TeamInfo":
                            postData.Append("&team=" + d.Value);
                            break;
                        case "Time":
                            postData.Append("&time=" + d.Value);
                            break;
                        case "ClosedStatus":
                            postData.Append("&closed_status=" + d.Value);
                            break;
                        case "RealDepatureTime":
                            postData.Append("&departure_time=" + d.Value);
                            break;
                        case "PassengerMoney":
                            postData.Append("&passenger_money=" + d.Value);
                            break;
                        case "VehicleInfo":
                            postData.Append("&vehicle=" + d.Value);
                            break;
                        case "ProductMoney":
                            postData.Append("&product_money=" + d.Value);
                            break;
                        case "FeeMoney":
                            postData.Append("&fee_money=" + d.Value);
                            break;
                    }
                }

                byte[] byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                if (tk.data != null && tk.data.message.ToString().Equals("success"))
                {
                    return new { Result = 1, Records = tk.data.tripId.ToString(), Message = "" };
                }

                if (tk.error != null && tk.error.message != null)
                {
                    return new { Result = 0, Message = tk.error.message.ToString() };
                }
                return new object();
            }
            catch (WebException e)
            {
                using (var response = e.Response)
                {
                    using (Stream data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        var text = reader.ReadToEnd();
                        return new { Result = 0, Message = text };
                    }
                }
            }
        }
        public object InsertTrip(object obj, int type = 1)
        {
            try
            {
                var accessToken = _getAccessToken();
                if (accessToken == null) return new object();
                var url = (type == 2) ? "/trip/child" : "/trip";
                WebRequest request = WebRequest.Create(_apiUrl + url);
                request.Method = "post";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("access_token=" + accessToken);

                var ip = (Dictionary<string, object>)obj;
                var data = ip["_d"] as Dictionary<string, object>;

                foreach (var d in data)
                {
                    switch (d.Key)
                    {
                        case "Code":
                            postData.Append("&code=" + d.Value);
                            break;
                        case "FromArea":
                            if (!data.ContainsKey("FromId"))
                            {
                                try
                                {
                                    var areas = d.Value.ToString().Split('|');
                                    if (areas[0].IndexOf('~') >= 0)
                                    {
                                        var id = areas[0].Split('~');
                                        postData.Append("&from=" + id[1]);
                                    }
                                    else
                                    {
                                        postData.Append("&from=" + areas[0]);
                                    }
                                }
                                catch (Exception)
                                {
                                    
                                }
                            }
                            break;
                        case "ToArea":
                            if (!data.ContainsKey("ToId"))
                            {
                                try
                                {
                                    var areas = d.Value.ToString().Split('|');
                                    if (areas[0].IndexOf('~') >= 0)
                                    {
                                        var id = areas[0].Split('~');
                                        postData.Append("&to=" + id[1]);
                                    }
                                    else
                                    {
                                        postData.Append("&to=" + areas[0]);
                                    }
                                }
                                catch (Exception)
                                {
                                    
                                }
                            }
                            break;
                        case "Date":
                            var dt = Convert.ToDateTime(d.Value.ToString());
                            postData.Append("&date=" + dt.ToString("dd-MM-yyyy"));
                            break;
                        case "Time":
                            postData.Append("&time=" + d.Value);
                            break;
                        case "CompId":
                            postData.Append("&company=" + d.Value);
                            break;
                        case "FacilityInfo":
                            postData.Append("&facility=" + d.Value);
                            break;
                        case "FromId":
                            postData.Append("&from=" + d.Value);
                            break;
                        case "ToId":
                            postData.Append("&to=" + d.Value);
                            break;
                        case "Info":
                            postData.Append("&info=" + d.Value);
                            break;
                        case "IsPrgStatus":
                            postData.Append("&prg_status=" + d.Value);
                            break;
                        case "Name":
                            postData.Append("&name=" + d.Value);
                            break;
                        case "Note":
                            postData.Append("&note=" + d.Value);
                            break;
                        case "RouteId":
                            postData.Append("&route=" + d.Value);
                            break;
                        case "RouteInfo":
                            postData.Append("&route_info=" + d.Value);
                            break;
                        case "SeatTemplateInfo":
                            postData.Append("&seat_template=" + d.Value);
                            break;
                        case "BranchReceiveProduct":
                            postData.Append("&branch_receive_product=" + d.Value);
                            break;
                        case "TotalStage":
                            postData.Append("&stage=" + d.Value);
                            break;
                        case "Type":
                            postData.Append("&type=" + d.Value);
                            break;
                        case "Alias":
                            postData.Append("&alias=" + d.Value);
                            break;
                        case "BaseId":
                            postData.Append("&base=" + d.Value);
                            break;
                        case "FareInfo":
                            postData.Append("&fare=" + d.Value);
                            break;
                        case "StatusInfo":
                            postData.Append("&status_info=" + d.Value);
                            break;
                        case "TeamInfo":
                            postData.Append("&team=" + d.Value);
                            break;
                        case "ClosedStatus":
                            postData.Append("&closed_status=" + d.Value);
                            break;
                        case "RealDepatureTime":
                            postData.Append("&departure_time=" + d.Value);
                            break;
                        case "PassengerMoney":
                            postData.Append("&passenger_money=" + d.Value);
                            break;
                        case "VehicleInfo":
                            postData.Append("&vehicle=" + d.Value);
                            break;
                        case "ProductMoney":
                            postData.Append("&product_money=" + d.Value);
                            break;
                        case "FeeMoney":
                            postData.Append("&fee_money=" + d.Value);
                            break;
                    }
                }

                byte[] byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                if (tk.data != null && tk.data.message.ToString().Equals("success"))
                {
                    return new { Result = 1, Records = tk.data.tripId.ToString(), Message = "" };
                }

                if (tk.error != null && tk.error.message != null)
                {
                    return new { Result = 0, Message = tk.error.message.ToString() };
                }
                return new object();
            }
            catch (WebException e)
            {
                using (var response = e.Response)
                {
                    using (Stream data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        var text = reader.ReadToEnd();
                        return new { Result = 0, Message = text };
                    }
                }
            }
        }

        public object BusTicketStatus(object obj, string method)
        {
            try
            {
                var accessToken = _getAccessToken();
                if (accessToken == null) return new object();

                WebRequest request = WebRequest.Create(_apiUrl + "/route/config");
                if (method != null) request.Method = method;
                else request.Method = "post";
                request.ContentType = "application/x-www-form-urlencoded";
                var postData = new StringBuilder();
                postData.Append("access_token=" + accessToken);

                var ip = (Dictionary<string, object>)obj;
                var datas = ((IEnumerable)ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
                var conds = ((IEnumerable)ip["_c"]).Cast<Dictionary<string, object>>().ToArray();
                for (var i = 0; i < datas.Length; i++)
                {
                    var data = new Dictionary<string, object>();
                    foreach (var c in conds[i])
                    {
                        if (!datas[i].ContainsKey(c.Key)) datas[i].Add(c.Key, c.Value);
                    }
                    foreach (var d in datas[i])
                    {
                        switch (d.Key)
                        {
                            case "XTripId":
                                data.Add("trip_id", d.Value);
                                break;
                            case "Info":
                                data.Add("info", d.Value);
                                break;
                            case "TimeLimit":
                                data.Add("time_limit", d.Value);
                                break;
                            case "XCompanyId":
                                data.Add("company_id", d.Value);
                                break;
                            case "XDate":
                                data.Add("date", d.Value);
                                break;
                            case "XFromId":
                                data.Add("from_id", d.Value);
                                break;
                            case "XStatus":
                                data.Add("status", d.Value);
                                break;
                            case "XTime":
                                data.Add("time", d.Value);
                                break;
                            case "XToId":
                                data.Add("to_id", d.Value);
                                break;
                            case "XTypeId":
                                data.Add("type", d.Value);
                                break;
                            case "IsPrgStatus":
                                data.Add("prg_status", d.Value);
                                break;

                        }
                    }
                    postData.Append("&configs=" + JsonConvert.SerializeObject(data));
                }

                var byteArray = Encoding.UTF8.GetBytes(postData.ToString());

                request.ContentLength = byteArray.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                dynamic tk = JObject.Parse(responseString);

                if (tk.data != null && tk.data.message.ToString().Equals("success"))
                {
                    return new { Result = 1, Records = tk.data.config_id, Message = "" };
                }
                return new { Result = 0, Message = "Some error!" };
            }
            catch (WebException e)
            {
                using (var response = e.Response)
                {
                    using (Stream data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        var text = reader.ReadToEnd();
                        return new { Result = 0, Message = text };
                    }
                }
            }
        }
    }
}
