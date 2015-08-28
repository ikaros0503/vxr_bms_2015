using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.UI;
using ServiceStack.Text;

namespace Vxr.Bms.Api.Client
{
    public class SResult
    {
        public int Result { get; set; }
        public List<object[]> Records { get; set; }
        public int TotalRecordCount { get; set; }
        public string Message { get; set; }
    }

    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected async void bt_GetTrip_Click(object sender, EventArgs e)
        {
            using (var client = new HttpClient())
            {
                // New code:
                client.BaseAddress = new Uri("http://localhost:2015/api/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // HTTP POST
                var obj = new Dictionary<string, object>()
                {
                    {"_a", "fGetTrip"},
                    {"_c", new Dictionary<string, object>()
                    {
                        {"CompId", 80},
                        {"Date", "Type = 1 OR (Type = 2 and $x = N'2015-01-30T00:00:00.000')"}
                    }},
                    {"_f", "Id, Name, Date"}
                };

                try
                {
                    var response = await client.PostAsJsonAsync("api/booking", obj);
                    response.EnsureSuccessStatusCode();

                    if (!response.IsSuccessStatusCode) return;
                    var content = response.Content.ReadAsAsync<string>().Result;
                    var robj = JsonSerializer.DeserializeFromString<SResult>(content);



                    //var robj = JsonSerializer.DeserializeFromString<SResult>(response);
                    //response.EnsureSuccessStatusCode();

                    //if (!response.IsSuccessStatusCode) return;
                    //var robj = JsonConvert.DeserializeObject<SResult>(await response.Content.ReadAsAsync<string>());
                    //var robj = JsonSerializer.DeserializeFromString<SResult>(await response.Content.ReadAsAsync<string>());

                    //if (robj == null) return;

                    //var sResult = robj;
                    //{
                    //    var records = sResult.Records;
                    //    var t = new StringBuilder("");
                    //    foreach (var item in records)
                    //    {
                    //        t.AppendLine(Convert.ToString(item[1]));
                    //    }

                    //    txt_Trip.Text = t.ToString();
                    //}
                }
                catch (HttpRequestException ex)
                {
                    Debug.WriteLine(ex);
                }
            }
        }

        protected async void bt_BookTicket_Click(object sender, EventArgs e)
        {
            using (var client = new HttpClient())
            {
                // New code:
                client.BaseAddress = new Uri("http://localhost:2015/api/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // HTTP POST
                var obj = new Dictionary<string, object>()
                {
                    {"_a", "BookTicket"},
                    {"_c", new[]
                    {
                        new Dictionary<string, object>()
                        {
                            {"TripId", 1115},
                            {"SeatCode", "A21|2|1|1"},
                            {"PickupDate", "2015-02-12T21:00:00.000"},
                            {"Bus", 0},
                            {"StageCode", 15}
                        }
                    }},
                    {"_d", new[]
                    {
                        new Dictionary<string, object>()
                        {
                            {"CompId", 80},
                            {"TripId", 1115},
                            {"TripDate", "2015-02-12T21:00:00.000"},
                            {"AgentId", 81},
                            {"AgentInfo", "81|2|BXMĐ|Bến xe Mỹ Đình"},
                            {"CreatedUser", "admin.saoviet"},
                            {"Fare", 250000},
                            {"IssueDate", "2015-02-11T11:27:00.000"},
                            {"SeatType", 2},
                            {"Status", 1},
                            {"TripAlias", 0},
                            {"SeatCode", "A21|2|1|1"},
                            {"PickupDate", "2015-02-12T11:00:00.000"},
                            {"StageCode", 15}
                        }
                    }}
                };

                try
                {
                    var serialize = new JavaScriptSerializer();
                    var response = await client.PostAsJsonAsync("api/booking", obj);
                    response.EnsureSuccessStatusCode();

                    if (!response.IsSuccessStatusCode) return;
                    var robj = serialize.Deserialize<SResult>(await response.Content.ReadAsAsync<string>());
                    if (robj == null) return;
                    if (robj.Records != null)
                    {
                        if (robj.Records is string)
                        {
                            txt_BookTicket.Text = robj.Records.ToString();
                        }
                        else
                        {
                            var r = ((IEnumerable)robj.Records).Cast<object>().ToList();
                            var t = new StringBuilder("");
                            foreach (var item in r)
                            {
                                t.AppendLine(Convert.ToString(item));
                            }
                            txt_BookTicket.Text = t.ToString();
                        }
                    }
                }
                catch (HttpRequestException ex)
                {
                    Debug.WriteLine(ex);
                }
            }
        }

        protected async void btn_Login_Click(object sender, EventArgs e)
        {
            using (var client = new HttpClient())
            {
                // New code:
                client.BaseAddress = new Uri("http://localhost:2015/api/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // HTTP POST
                var obj = new Dictionary<string, string>()
                {
                    {"Username", "admin.saoviet"},
                    {"Password", "adminvxr"}
                };

                try
                {
                    var serialize = new JavaScriptSerializer();
                    var response = await client.PostAsJsonAsync("api/auth/login", obj);
                    response.EnsureSuccessStatusCode();

                    if (!response.IsSuccessStatusCode) return;
                    var robj = serialize.Deserialize<dynamic>(await response.Content.ReadAsAsync<string>());
                    //if (robj == null) return;
                    //if (robj.Records != null)
                    //{
                    //    if (robj.Records is string)
                    //    {
                    //        txt_BookTicket.Text = robj.Records.ToString();
                    //    }
                    //    else
                    //    {
                    //        var r = ((IEnumerable)robj.Records).Cast<object>().ToList();
                    //        var t = new StringBuilder("");
                    //        foreach (var item in r)
                    //        {
                    //            t.AppendLine(Convert.ToString(item));
                    //        }
                    //        txt_BookTicket.Text = t.ToString();
                    //    }
                    //}
                }
                catch (HttpRequestException ex)
                {
                    Debug.WriteLine(ex);
                }
            }
        }

        protected async void bt_GetBusStatus_Click(object sender, EventArgs e)
        {
            using (var client = new HttpClient())
            {
                // New code:
                client.BaseAddress = new Uri("http://localhost:2015/api/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // HTTP POST
                var obj = new Dictionary<string, object>()
                {
                    {"_a", "fGetLatestBusTicketsStatus"},
                    {"_c", new Dictionary<string, object>()
                    {
                        {"XTripId", 3},
                    }},
                    {"_f", "Id, XDate, XTime, XFromId, XToId"}
                };

                try
                {
                    var response = await client.PostAsJsonAsync("api/booking", obj);
                    response.EnsureSuccessStatusCode();

                    if (!response.IsSuccessStatusCode) return;
                    var content = response.Content.ReadAsAsync<string>().Result;
                    var robj = JsonSerializer.DeserializeFromString<SResult>(content);

                    foreach (var item in robj.Records)
                    {
                        if (item[2] != null)
                        {
                            var timeSpan = TimeSpan.Parse(Convert.ToString(item[2]));
                        }
                    }
                }
                catch (HttpRequestException ex)
                {
                    Debug.WriteLine(ex);
                }
            }
        }
    }
}