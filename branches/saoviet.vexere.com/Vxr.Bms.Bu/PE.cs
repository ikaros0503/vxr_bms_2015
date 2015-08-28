using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Vxr.Bms.Bu.Dic;
using Vxr.Bms.Bu.Lib;
using Vxr.Bms.Core;

namespace Vxr.Bms.Bu
{
    // ReSharper disable InconsistentNaming
    public class PE
    {
        public static bool IsDebug = (ConfigurationManager.AppSettings["isDebug"] == "1");
        public static string _sc = P._cs;
        //for Area
        public static void LoadBms(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        public static void GetInfoTickets(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.Pr("ticketIds", SqlDbType.NVarChar);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        public static void GetBookingTicket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TripId").Pc("TripDate").Pc("Status")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void BookTicket(object obj, out object oo)
        {
            var x = new X(obj);
            X.Init(_sc, true, D._a, D._fd); x.R().A().Pc("TripId").Pc("SeatCode").Pc("PickupDate").Pc("Status").Pc("Type");
            var lc = ((IEnumerable)x._ip["_c"]).Cast<Dictionary<string, object>>().ToArray();
            var ld = ((IEnumerable)x._ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
            var cd = new string[lc.Length][][];
            var da = new string[lc.Length][][];
            var sql = new string[lc.Length];
            const int s = 0;
            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[lc[i].Count][];
                foreach (var c in lc[i])
                {
                    if (c.Key.Equals("Bus"))
                    {
                        //s = (int.Parse(c.Value + "")) * 16; //STATUS
                    }
                    else if (c.Key.Equals("StageCode"))
                    {
                        cd[i][j] = new[]
                        {
                            c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs),
                            string.Format("($x is null or (($x & {0}) != 0) )", c.Value + "")
                        };
                        j++;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                        {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                            oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null) }; return;
                        }
                        cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                        j++;
                    }
                }
                cd[i][j] = new[] { "Status", "1", string.Format("($x={0} or $x={1} or $x ={2} or $x={3})", s + 1, s + 2, s + 5, s + 8) };
                j = 0;
                da[i] = new string[ld[i].Count][];
                foreach (var d in ld[i])
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null) }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.I(x._a[3], da[i].ToList());
                sql[i] = string.Format(" DECLARE @ID AS INT SELECT @ID = ID FROM {0} {1} IF (@ID IS NULL) BEGIN {2} END",
                    x._a[3], x.LW(cd[i], cd[i].Length), x._sql);
            }
            var r = x.EX2(sql).G();
            if (r._s == 1)
            {
                var sq = new SendQueue();
                sq.Send("UpdateTicket", string.Join("|", string.Join(" ", r._d.First())));
            }
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpdateBookTicket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd); x.R().A().Pc("Id").Pc("TripId").Pc("SeatCode").Pc("PickupDate").Pc("Status").Pc("Code").Pc("BookingCode")
                ;
            //var ld = (x._ip["_d"] as object[]);
            var lc = ((IEnumerable)x._ip["_c"]).Cast<Dictionary<string, object>>().ToArray();
            var ld = ((IEnumerable)x._ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
            var cd = new string[lc.Length][][];
            var da = new string[lc.Length][][];
            var sql = new string[lc.Length];
            const int s = 0;
            List<int> lstId = new List<int>();
            //var randomCode = GenerateTicketCode();
            var cCode = ""; var bCode = "";

            var currentTime = DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-ddTHH:mm:ss.fff");
            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[lc[i].Count][];
                foreach (var c in lc[i])
                {
                    if (c.Key.Equals("Bus"))
                    {
                        // s = (int.Parse(c.Value + "")) * 16; //STATUS
                    }
                    else if (c.Key.Equals("StageCode"))
                    {
                        cd[i][j] = new[]
                        {
                            c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs),
                            string.Format("($x is null or (($x & {0}) != 0) )", c.Value + "")
                        };
                        j++;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                        {
                            //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                            oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null), Code = "" };
                            return;
                        }
                        if (c.Key.ToLower().Equals("id")) lstId.Add(Convert.ToInt32(c.Value));
                        cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                        j++;
                    }
                }
                cd[i][j] = new[] { "Status", "1", string.Format("($x={0} or $x={1} or $x ={2} or $x={3})", s + 1, s + 2, s + 5, s + 8) };
                j = 0;
                ////Chèn mã code vào cho vé nếu chưa tồn tại.
                //if (!(ld[i].ContainsKey("Code")))
                //{
                //    if (ld[i].ContainsKey("Status"))
                //    {
                //        var ticketStatus = Convert.ToInt32(ld[i]["Status"]);
                //        if (ticketStatus != 3)
                //        {
                //            ld[i].Add("Code", randomCode[0]);
                //            ld[i].Add("TimeCode", Int32.Parse(randomCode[1]));
                //        }
                //    }
                //}
                cCode = ld[i].ContainsKey("Code") ? Convert.ToString(ld[i]["Code"]) : "";
                bCode = ld[i].ContainsKey("BookingCode") ? Convert.ToString(ld[i]["BookingCode"]) : "";
                if (ld[i].ContainsKey("Status"))
                {
                    var status = Convert.ToInt32(ld[i]["Status"]);
                    switch (status)
                    {
                        case 5:
                        case 2:
                            if (ld[i].ContainsKey("PaymentInfo"))
                            {
                                if (!ld[i].ContainsKey("ChargeDate"))
                                {
                                    ld[i].Add("ChargeDate", currentTime);
                                }
                                else
                                {
                                    ld[i].Remove("ChargeDate");
                                }

                            }
                            break;
                        case 3:
                            ld[i].Add("CanceledDate", currentTime);
                            break;
                    }
                }
                da[i] = new string[ld[i].Count][];
                foreach (var d in ld[i])
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null), Code = "" }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.U(x._a[3], cd[i].Length, cd[i], da[i].ToList());
                sql[i] = string.Format(" DECLARE @ID AS INT SELECT @ID = ID FROM {0} {1} IF (@ID IS NULL) BEGIN {2} END",
                    x._a[3], x.LS(cd[i], cd[i].Length), x._sql);
            }
            var r = x.EX2(sql).G();
            if (r._s == 1)
            {
                var sq = new SendQueue();
                sq.Send("UpdateTicket", string.Join("|", lstId));
            }
            oo = new { Result = r._s, Records = r._d, Code = cCode, Message = r._m, BookingCode = bCode };
        }

        public static void CheckExistingTicket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            ((Dictionary<string, object>)x._ip["_c"]).Add("Status", "($x in (1,2,5,8))");
            ((Dictionary<string, object>)x._ip["_c"]).Add("SeatType", "($x != 6)");
            x._ip["_f"] = "SeatCode";
            var r = x.R().A().Pc("TripId").Pc("TripDate").Pc("SeatType").Pc("Status")._CR()._CF().L().S().EX().G();
            var usedSeats = r._t;
            var avaiSeat = 0;
            string allowedSeat = "";
            int totalSeats = 0;
            var c = false;
            int seatOnline = 0;
            //Get info in Bus_ticket_status
            object tripDate0;
            object tripId0;
            ((Dictionary<string, object>)x._ip["_c"]).TryGetValue("TripId", out tripId0);
            ((Dictionary<string, object>)x._ip["_c"]).TryGetValue("TripDate", out tripDate0);
            var date = tripDate0.ToString().Substring(0, 10);
            var time = tripDate0.ToString().Substring(11, 10);
            obj = new Dictionary<string, object> { 
                    { "_a", "fGetBus_Tickets_Status" }, 
                    { "_c", new Dictionary<string, object>
                    {
                        { "XTripId" , tripId0},
                        { "XStatus", 1},
                        { "XTypeId", 2},
                        { "XDate", "($x is null or $x ='" + date + "')" },
                        { "XTime", "($x is null or $x ='" + time + "') order by XDate desc, XTime desc"}
                    } 
                    }, 
                    { "_f", "Info" } 
                };
            oo = new { };
            GetBusTicketsStatus(obj, out oo);
            var rc0 = oo.GetType().GetProperty("Records").GetValue(oo, null);
            var c0 = (IEnumerable<object>)rc0;
            if (c0.Count() > 0)
            {
                foreach (object item in c0)
                {
                    var c01 = (IEnumerable<object>)item;
                    foreach (object it in c01)
                    {
                        try
                        {
                            allowedSeat = it.ToString();
                        }
                        catch (Exception ex)
                        {
                            allowedSeat = "";
                        }
                        break;
                    }

                    break;
                }
            }

            //Check used seats

            if (allowedSeat.Length > 0)
            {
                avaiSeat = Int32.Parse(allowedSeat.Split('~')[1]);
                if (avaiSeat >= 1000) avaiSeat = avaiSeat % 1000;
                if (usedSeats > 0)
                {
                    foreach (var s in r._d)
                    {
                        if (allowedSeat.IndexOf(s[0].ToString()) > 0)
                        {
                            avaiSeat--;
                        }
                    }
                }
            }

            oo = new { Result = avaiSeat, Message = r._m };
        }
        public static void GetTotalSeat(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d };
        }

        public static void GetTime(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("BaseId").Pc("Type").Pc("Date")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d };
        }

        public static void InsertListTip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A();
            var da = (x._ip["_d"] as Dictionary<string, string>);
            if (da != null)
            {
                var ft = DateTime.ParseExact(da["FromDepartureDate"], "dd-MM-yyyy", CultureInfo.InvariantCulture);
                var tt = DateTime.ParseExact(da["ToDepartureDate"], "dd-MM-yyyy", CultureInfo.InvariantCulture);
                var l = (tt - ft).Days;
                var sql = new string[l];
                var dt = ft.AddMinutes(int.Parse(da["Time"].Split(':')[1])).AddHours(int.Parse(da["Time"].Split(':')[0]));
                for (var i = 0; i < l; i++)
                {
                    var t = new List<string[]>();
                    var dictionary = x._ip["_d"] as Dictionary<string, string>;
                    if (dictionary != null)
                        t.AddRange(from d in dictionary let tp = x.L(d.Key, 7, 0, x._fs.Length, x._fs) where !string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)) select new[] { d.Key, tp, d.Value });
                    t.Add(new[] { "DepartureTime", "4", dt.AddDays(i) + "" });
                    t.Add(new[] { "SeatTemplateInfo", "3", da["SeatTemplateInfo"] });
                    x.I(x._a[3], t);
                    sql[i] = x._sql;
                }
                x.DT(sql);
            }
            oo = new { Result = x._r._s, Records = x._r._d, Message = x._r._m };
        }

        static string getFileUrl(string path)
        {
            Uri uri = new Uri(System.Web.HttpContext.Current.Request.Url.AbsoluteUri);
            string domain = uri.GetLeftPart(UriPartial.Authority);
            var str = string.Format("{0}/{1}", domain, (System.Web.HttpContext.Current.Request.ApplicationPath ?? "").TrimStart('/'));
            return string.Format("{0}/{1}", str.TrimEnd('/'), path.TrimStart('/'));
        }
        public static void CheckSizeFile(HttpContext c, StringBuilder sb, long s)
        {
            var path = string.Format("/Files/Reports/BaoCaoDoanhTHuChiTiet-{0}.xls", DateTime.UtcNow.ToBinary());
            //var sw = new StreamWriter(HttpContext.Current.Server.MapPath("~" + path));
            System.IO.File.WriteAllText(HttpContext.Current.Server.MapPath("~" + path), sb.ToString());
            //sw.WriteLine(sb);
            c.Response.ContentType = "text/plain";
            if (sb.Length < s)
            {
                c.Response.Write(sb + "");
                c.Response.Write(string.Format("<a class='linkReport' style='display:none' href='{0}'>Click vào đây để down báo cáo</a>", getFileUrl(path)));
            }
            else
            {
                //sw.Flush();
                c.Response.Write(string.Format("<a href='{0}' class='linkReport largeResult' style='display:none' >Click vào đây để down báo cáo</a>", getFileUrl(path)));
            }
        }

        public static void CheckLogin(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Username").Pc("Password").Pc("IsPrgStatus")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }
        public static void CheckUsername(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Username").Pc("IsPrgStatus")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }

        public static void AddTime(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        //Update
        public static void UpAccount(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Username").Pc("Password").Pc("AgentId").Pc("PersonId").Pc("Role").Pc("Info").Pc("Note").Pc("IsPrgPartComp").Pc("CompId").Pc("IsPrgStatus")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpCompany(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpContract(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpEvent(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpgcDesc(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpgcDesc_TO(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpgcGOBALsysuserGcDescription(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpgcUserView(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpPerson(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpReportDetail(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpResource(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void Upsysdiagrams(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpTestData(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpTicket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpTrip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpVehicle(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        //Insert
        public static void InAccount(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Username").Pc("Password").Pc("AgentId").Pc("PersonId").Pc("Role").Pc("Info").Pc("Note").Pc("IsPrgPartComp").Pc("CompId").Pc("IsPrgStatus")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        public static void InCompany(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InContract(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InEvent(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void IngcDesc(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void IngcDesc_TO(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void IngcGOBALsysuserGcDescription(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void IngcUserView(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InPerson(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InReportDetail(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InResource(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void Insysdiagrams(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InTestData(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InTicket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InTrip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InVehicle(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void fGetCustomer(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Phone").Pc("CompId").Pc("TripId").Pc("TripDate")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void fGetSuggestCustomer(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("CustomerInfo").Pc("CompId").Pc("TripId").Pc("TripDate").Pc("Bus")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void fGetSuggestCustomerInfo(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("CustomerInfo").Pc("CompId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void sGetTripDateInfo(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("TripId").Pc("TripDate")._CR()._CF().L().EXO(
                new[]{string.Format("alter view GetProcedureData as select TripId, " +
                                     "COUNT(CASE WHEN Status = 1 THEN '1' ELSE NULL END) AS BookingTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 1 THEN Total ELSE 0 END) AS TotalBooking, " + //STATUS
                                     "COUNT(CASE WHEN Status = 2 THEN '1' ELSE NULL END) AS PaidTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 2 THEN Total ELSE 0 END) AS TotalPaid, " + //STATUS
                                     "COUNT(CASE WHEN Status = 3 THEN '1' ELSE NULL END) AS CancelTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 3 THEN Total ELSE 0 END) AS TotalCancel, " + //STATUS
                                     "COUNT(CASE WHEN Status = 4 THEN '1' ELSE NULL END) AS NotComeTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 4 THEN Total ELSE 0 END) AS TotalNotCome, " + //STATUS
                                     "COUNT(CASE WHEN Status = 5 THEN '1' ELSE NULL END) AS PassTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 5 THEN Total ELSE 0 END) AS TotalPass, " + //STATUS
                                     "COUNT(CASE WHEN Status = 6 THEN '1' ELSE NULL END) AS OpenTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 6 THEN Total ELSE 0 END) AS TotalOpen, " + //STATUS
                                     "COUNT(CASE WHEN Status = 7 THEN '1' ELSE NULL END) AS ValidTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 7 THEN Total ELSE 0 END) AS TotalValid, " + //STATUS
                                     "COUNT(CASE WHEN Status = 8 THEN '1' ELSE NULL END) AS KeepOnTimeTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 8 THEN Total ELSE 0 END) AS TotalKeepOnTime, " + //STATUS
                                     "COUNT(CASE WHEN (PickupInfo is null or Status = 3) " + //STATUS
                                     "THEN null ELSE '1' END) AS PickupTicket, " +
                                     "COUNT(CASE WHEN (TransferInfo is null or Status = 3) " + //STATUS
                                     "THEN null ELSE '1' END) AS TransferTicket " +
                                     "from(Select Id, TripId, TripDate, Status, " +
                                     "case when charindex('|', PickupInfo) = 0 then case when " +
                                     "substring(PickupInfo, 0, Len(PickupInfo) + 1) = '' then null " +
                                     "else substring(PickupInfo, 0, Len(PickupInfo) + 1) end else case when " +
                                     "substring(PickupInfo, 0, charindex('|', PickupInfo)) = '' then null else " +
                                     "substring(PickupInfo, 0, charindex('|', PickupInfo)) end end as PickupInfo, " +
                                     "case when charindex('|', PickupInfo) = 0 then null else case when " +
                                     "substring(PickupInfo, charindex('|', PickupInfo) + 1, len(PickupInfo) + 1) = '' " +
                                     "then null else substring(PickupInfo, charindex('|', PickupInfo) + 1, len(PickupInfo) + 1) " +
                                     "end end as TransferInfo, case when Fare is null then 0 else Fare end as Fare, " +
                                     "case when Surcharge is null then 0 else Surcharge end as Surcharge, " +
                                     "case when Discount is null then 0 else Discount end as Discount, " +
                                     "(case when Fare is null then 0 else Fare end + case when Surcharge is null " +
                                     "then 0 else Surcharge end - case when Discount is null then 0 else Discount end) as Total " +
                                     "from zgcl_Ticket03 {0}) " +
                                     "as a group by TripId, convert(nvarchar(10), TripDate, 110)", x.LW(x._c, x._cc))}
                ).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void sGetTripInfo(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("TripId").Pc("TripDate")._CR()._CF().L().EXO(
                new[]{string.Format("alter view GetProcedureData as select TripId, TripDate, " +
                                     "COUNT(CASE WHEN Status = 1 THEN '1' ELSE NULL END) AS BookingTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 1 THEN Total ELSE 0 END) AS TotalBooking, " + //STATUS
                                     "COUNT(CASE WHEN Status = 2 THEN '1' ELSE NULL END) AS PaidTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 2 THEN Total ELSE 0 END) AS TotalPaid, " + //STATUS
                                     "COUNT(CASE WHEN Status = 3 THEN '1' ELSE NULL END) AS CancelTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 3 THEN Total ELSE 0 END) AS TotalCancel, " + //STATUS
                                     "COUNT(CASE WHEN Status = 4 THEN '1' ELSE NULL END) AS NotComeTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 4 THEN Total ELSE 0 END) AS TotalNotCome, " + //STATUS
                                     "COUNT(CASE WHEN Status = 5 THEN '1' ELSE NULL END) AS PassTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 5 THEN Total ELSE 0 END) AS TotalPass, " + //STATUS
                                     "COUNT(CASE WHEN Status = 6 THEN '1' ELSE NULL END) AS OpenTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 6 THEN Total ELSE 0 END) AS TotalOpen, " + //STATUS
                                     "COUNT(CASE WHEN Status = 7 THEN '1' ELSE NULL END) AS ValidTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 7 THEN Total ELSE 0 END) AS TotalValid, " + //STATUS
                                     "COUNT(CASE WHEN Status = 8 THEN '1' ELSE NULL END) AS KeepOnTimeTicket, " + //STATUS
                                     "SUM(CASE WHEN Status = 8 THEN Total ELSE 0 END) AS TotalKeepOnTime, " + //STATUS
                                     "COUNT(CASE WHEN (PickupInfo is null or Status = 3) " + //STATUS
                                     "THEN null ELSE '1' END) AS PickupTicket, " +
                                     "COUNT(CASE WHEN (TransferInfo is null or Status = 3) " + //STATUS
                                     "THEN null ELSE '1' END) AS TransferTicket " +
                                     "from(Select Id, TripId, TripDate, Status, " +
                                     "case when charindex('|', PickupInfo) = 0 then case when " +
                                     "substring(PickupInfo, 0, Len(PickupInfo) + 1) = '' then null " +
                                     "else substring(PickupInfo, 0, Len(PickupInfo) + 1) end else case when " +
                                     "substring(PickupInfo, 0, charindex('|', PickupInfo)) = '' then null else " +
                                     "substring(PickupInfo, 0, charindex('|', PickupInfo)) end end as PickupInfo, " +
                                     "case when charindex('|', PickupInfo) = 0 then null else case when " +
                                     "substring(PickupInfo, charindex('|', PickupInfo) + 1, len(PickupInfo) + 1) = '' " +
                                     "then null else substring(PickupInfo, charindex('|', PickupInfo) + 1, len(PickupInfo) + 1) " +
                                     "end end as TransferInfo, case when Fare is null then 0 else Fare end as Fare, " +
                                     "case when Surcharge is null then 0 else Surcharge end as Surcharge, " +
                                     "case when Discount is null then 0 else Discount end as Discount, " +
                                     "(case when Fare is null then 0 else Fare end + case when Surcharge is null " +
                                     "then 0 else Surcharge end - case when Discount is null then 0 else Discount end) as Total " +
                                     "from zgcl_Ticket03 {0}) " +
                                     "as a group by TripId, TripDate", x.LW(x._c, x._cc))}
                ).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void CustomerFull(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Name").Pc("Note").Pc("Phone").
                Pc("BookingTicket").Pc("TotalBooking").Pc("PaidTicket").Pc("TotalPaid").Pc("CancelTicket").Pc("TotalCancel").
                Pc("NotComeTicket").Pc("TotalNotCome").Pc("PassTicket").Pc("TotalPass").Pc("OpenTicket")
                .Pc("CompId").Pc("AgentId").Pc("PersonId").Pc("TicketId").Pc("TripId").Pc("TicketIdAgentId").Pc("EventId")
                .Pc("CustomerId").Pc("TicketIdType").Pc("TicketIdCode").Pc("Serial").Pc("PassCode").Pc("RoundTripCode")
                .Pc("TripAlias").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("SeatCode")
                .Pc("IssueDate").Pc("PickupDate").Pc("CallerInfo").Pc("AgentInfo").Pc("CustomerInfo")
                .Pc("UserCharge").Pc("PickupInfo").Pc("DropOffInfo").Pc("PaymentInfo").Pc("TransactionInfo")
                .Pc("NotificationInfo").Pc("DeliveryInfo").Pc("FacilityInfo").Pc("IssueInfo").Pc("Keywords")
                .Pc("Status").Pc("TicketIdNote").Pc("Fare").Pc("Debt").Pc("Refund").Pc("Deposit").Pc("Discount")
                .Pc("Surcharge").Pc("CancelFee").Pc("Commission").Pc("Info").Pc("CreatedUser").Pc("IssuedUser")
                .Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate")
                .Pc("IsPrgUnsignKeywords").Pc("FromValid").Pc("ToValid").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")
                .Pc("TicketIdCompId").Pc("ChargeDate")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void InProducts(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A().Pc("Id");
            var ld = x._ip["_d"] as object[];
            var da = new string[ld.Length][][];
            var sql = new string[ld.Length];
            for (var i = 0; i < ld.Length; i++)
            {
                var j = 0;
                da[i] = new string[(ld[i] as Dictionary<string, object>).Count][];
                foreach (var d in ld[i] as Dictionary<string, object>)
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null) }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.I(x._a[3], da[i].ToList());
                sql[i] = x._sql;
            }
            var r = x.EXO(sql).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpProducts(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A().Pc("Id");
            var ld = x._ip["_d"] as object[];
            var lc = x._ip["_c"] as object[];
            var da = new string[ld.Length][][];
            var cd = new string[ld.Length][][];
            var sql = new string[ld.Length];
            for (var i = 0; i < ld.Length; i++)
            {
                var j = 0;
                cd[i] = new string[(lc[i] as Dictionary<string, object>).Count][];
                foreach (var c in lc[i] as Dictionary<string, object>)
                {
                    if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                    {
                        //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null) };
                        return;
                    }
                    cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                    j++;
                }
                j = 0;
                da[i] = new string[(ld[i] as Dictionary<string, object>).Count][];
                foreach (var d in ld[i] as Dictionary<string, object>)
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null) }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.U(x._a[3], cd[i].Length, cd[i], da[i].ToList());
                sql[i] = x._sql;
            }
            var r = x.EXO(sql).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void CompanyCS(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Code").Pc("FullName").Pc("Name").Pc("Birthday").Pc("AddressInfo").Pc("PhoneInfo").Pc("FaxInfo").Pc("EmailInfo").Pc("AgentInfo").Pc("UIConfigInfo").Pc("DepartmentInfo").Pc("BankAccountInfo").Pc("WebsiteInfo").Pc("ImageInfo").Pc("URLInfo").Pc("OwnerInfo").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("BaseId").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }
        public static void TicketCS(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TripId").Pc("AgentId").Pc("EventId").Pc("CustomerId").Pc("Type").Pc("Code").Pc("Serial").Pc("PassCode").Pc("RoundTripCode").Pc("TripAlias").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("SeatCode").Pc("IssueDate").Pc("PickupDate").Pc("CallerInfo").Pc("AgentInfo").Pc("CustomerInfo").Pc("UserCharge").Pc("PickupInfo").Pc("DropOffInfo").Pc("PaymentInfo").Pc("TransactionInfo").Pc("NotificationInfo").Pc("DeliveryInfo").Pc("FacilityInfo").Pc("IssueInfo").Pc("Keywords").Pc("Status").Pc("Note").Pc("Fare").Pc("Debt").Pc("Refund").Pc("Deposit").Pc("Discount").Pc("Surcharge").Pc("CancelFee").Pc("Commission").Pc("Info").Pc("CreatedUser").Pc("IssuedUser").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("FromValid").Pc("ToValid").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("CompId").Pc("ChargeDate")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }
        public static void TripCS(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("OwnerId").Pc("BaseId").Pc("VehicleId").Pc("EventId").Pc("Type").Pc("Code").Pc("Name").Pc("Alias").Pc("Date").Pc("Time").Pc("FromArea").Pc("ToArea").Pc("FareInfo").Pc("FacilityInfo").Pc("SeatTemplateInfo").Pc("ExtendedSeatsInfo").Pc("TotalSeats").Pc("TotalExtendedSeats").Pc("SeatSummaryInfo").Pc("PickedPointsInfo").Pc("SeatFacilityInfo").Pc("LicensePlate").Pc("StatusInfo").Pc("TeamInfo").Pc("FeeInfo").Pc("PayInfo").Pc("RevenuesInfo").Pc("RightsInfo").Pc("SeatPolicyInfo").Pc("VehicleInfo").Pc("DepartureTime").Pc("RealDepartureTime").Pc("FinishDate").Pc("OwnerInfo").Pc("TotalFee").Pc("IsVeXeReFull").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }

        public static void CustomerTicket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A().Pc("Phone").Pc("TripDate");
            var lc = (x._ip["_c"] as object[]);
            var cd = new string[lc.Length][][];
            var sql = new string[lc.Length];
            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[(lc[i] as Dictionary<string, object>).Count][];
                foreach (var c in lc[i] as Dictionary<string, object>)
                {
                    if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null) }; return;
                    }
                    cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                    j++;
                }
                sql[i] = x.LW(cd[i], cd[i].Length);
            }
            var r = x.EXO(
                new[]{string.Format("alter view GetProcedureData as SELECT  a.Id, a.Type, a.Code, a.Name, a.Note, a.Phone, a.BookingTicket, a.TotalBooking, a.PaidTicket, a.TotalPaid, a.CancelTicket, a.TotalCancel, a.NotComeTicket, " +
                         "a.TotalNotCome, a.PassTicket, a.TotalPass, a.OpenTicket, a.TotalOpen, a.ValidTicket, a.TotalValid, a.KeepOnTimeTicket, a.TotalKeepOnTime, a.TotalTicket,  " +
                         "a.TotalMoney, a.LastedTripId, a.LastedTripDate, a.LastedTripTime, a.LastedTotalTicket, a.TotalProduct, a.TotalProductMoney, a.LastedProductTripId,  " +
                         "a.LastedProductTripDate, a.LastedProductTripTime, a.LastedTotalProduct, a.TotalProductOrder, a.Email, a.VipInfo, a.Gender, a.FullName, a.Birthday,  " +
                         "a.AddressInfo, a.PhoneInfo, a.FaxInfo, a.EmailInfo, a.ImageInfo, a.WebsiteInfo, a.URLInfo, a.BankAccountInfo, a.LicenseInfo, a.FamilyInfo, a.CompId,  " +
                         "a.AgentId, a.PersonId, b.Id AS TicketId, b.Type AS TicketIdType, b.Code AS TicketIdCode, b.Name AS TicketIdName, b.Note AS TicketIdNote, b.Serial,  " +
                         "b.TripDate, b.TripTime, b.TripAlias, b.FromArea, b.ToArea, b.SeatCode, b.PassCode, b.RoundTripCode, b.FromValid, b.ToValid, b.PickupDate, b.PickupInfo,  " +
                         "b.DropOffInfo, b.FacilityInfo, b.DeliveryInfo, b.CustomerInfo, b.Fare, b.Debt, b.Refund, b.Deposit, b.Discount, b.Surcharge, b.CancelFee, b.Commission,  " +
                         "b.PaymentInfo, b.TransactionInfo, b.NotificationInfo, b.CallerInfo, b.AgentInfo, b.UserCharge, b.CreatedUser, b.IssueDate, b.IssueInfo, b.IssuedUser, b.Status,  " +
                         "b.Info, b.Keywords, b.IsPrgStatus, b.IsPrgPartComp, b.IsPrgCreatedDate, b.IsPrgUpdatedDate, b.IsPrgCreatedUserId, b.IsPrgUpdatedUserId,  " +
                         "b.IsPrgUnsignKeywords, b.IsPrgLanguageInfo, b.IsPrgHistoryInfo, b.TripId, b.AgentId AS TicketIdAgentId, b.CustomerId, b.EventId, b.ChargeDate,  " +
                         "b.CompId AS TicketIdCompId, b.TripIdType, b.TripIdCode, b.TripIdName, b.AgentIdType, b.AgentIdCode, b.AgentIdName, b.AgentIdFullName, b.EventIdType,  " +
                         "b.EventIdCode, b.EventIdName, b.CustomerIdType, b.CustomerIdCode, b.CustomerIdName, b.CustomerIdFullName " +
                        "FROM            (SELECT        Id, Type, Code, Name, Note, Phone, BookingTicket, TotalBooking, PaidTicket, TotalPaid, CancelTicket, TotalCancel, NotComeTicket,  " +
                                                    "TotalNotCome, PassTicket, TotalPass, OpenTicket, TotalOpen, ValidTicket, TotalValid, KeepOnTimeTicket, TotalKeepOnTime, TotalTicket,  " +
                                                    "TotalMoney, LastedTripId, LastedTripDate, LastedTripTime, LastedTotalTicket, TotalProduct, TotalProductMoney, LastedProductTripId,  " +
                                                    "LastedProductTripDate, LastedProductTripTime, LastedTotalProduct, TotalProductOrder, Email, VipInfo, Gender, FullName, Birthday, AddressInfo,  " +
                                                    "PhoneInfo, FaxInfo, EmailInfo, ImageInfo, WebsiteInfo, URLInfo, BankAccountInfo, LicenseInfo, FamilyInfo, UIConfigInfo, Info, Keywords,  " +
                                                    "IsPrgStatus, IsPrgPartComp, IsPrgCreatedDate, IsPrgUpdatedDate, IsPrgCreatedUserId, IsPrgUpdatedUserId, IsPrgUnsignKeywords,  " +
                                                    "IsPrgLanguageInfo, IsPrgHistoryInfo, CompId, AgentId, PersonId " +
                          "FROM            dbo.Customer " +
                          " {0}) AS a LEFT OUTER JOIN " +
                             "(SELECT        Id, Type, Code, Name, Note, Serial, TripDate, TripTime, TripAlias, FromArea, ToArea, SeatCode, PassCode, RoundTripCode, FromValid, ToValid,  " +
                                                         "PickupDate, PickupInfo, DropOffInfo, FacilityInfo, DeliveryInfo, CustomerInfo, Fare, Debt, Refund, Deposit, Discount, Surcharge, CancelFee,  " +
                                                         "Commission, PaymentInfo, TransactionInfo, NotificationInfo, CallerInfo, AgentInfo, UserCharge, CreatedUser, IssueDate, IssueInfo, IssuedUser,  " +
                                                         "Status, Info, Keywords, IsPrgStatus, IsPrgPartComp, IsPrgCreatedDate, IsPrgUpdatedDate, IsPrgCreatedUserId, IsPrgUpdatedUserId,  " +
                                                         "IsPrgUnsignKeywords, IsPrgLanguageInfo, IsPrgHistoryInfo, TripId, AgentId, CustomerId, EventId, ChargeDate, CompId, TripIdType,  " +
                                                         "TripIdCode, TripIdName, AgentIdType, AgentIdCode, AgentIdName, AgentIdFullName, EventIdType, EventIdCode, EventIdName,  " +
                                                         "CustomerIdType, CustomerIdCode, CustomerIdName, CustomerIdFullName " +
                               "FROM            dbo.zgcl_Ticket03 " +
                               " {1} ) AS b ON a.Id = b.CustomerId AND a.CompId = b.CompId", (lc.Length > 0 ? sql[0] : "where Phone IS NOT NULL"), lc.Length > 1 ? sql[1] : "where customerid is not null")}
                ).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void CustomerTicketTrip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A().Pc("Phone").Pc("TripDate").Pc("CompId").Pc("TripId");
            var lc = (x._ip["_c"] as object[]);
            var cd = new string[lc.Length][][];
            var sql = new string[lc.Length];
            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[(lc[i] as Dictionary<string, object>).Count][];
                foreach (var c in lc[i] as Dictionary<string, object>)
                {
                    if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null) }; return;
                    }
                    cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                    j++;
                }
                sql[i] = x.LW(cd[i], cd[i].Length);
            }
            var r = x.EXO(
                new[]{string.Format("alter view GetProcedureData as with a1 as (SELECT        a.Id, a.Type, a.Code, a.Name, a.Note, a.Phone, a.BookingTicket, a.TotalBooking, a.PaidTicket, a.TotalPaid, a.CancelTicket, a.TotalCancel, a.NotComeTicket, " +
                         " a.TotalNotCome, a.PassTicket, a.TotalPass, a.OpenTicket, a.TotalOpen, a.ValidTicket, a.TotalValid, a.KeepOnTimeTicket, a.TotalKeepOnTime, a.TotalTicket,  " +
                         " a.TotalMoney, a.LastedTripId, a.LastedTripDate, a.LastedTripTime, a.LastedTotalTicket, a.TotalProduct, a.TotalProductMoney, a.LastedProductTripId,  " +
                         " a.LastedProductTripDate, a.LastedProductTripTime, a.LastedTotalProduct, a.TotalProductOrder, a.Email, a.VipInfo, a.Gender, a.FullName, a.Birthday,  " +
                         " a.AddressInfo, a.PhoneInfo, a.FaxInfo, a.EmailInfo, a.ImageInfo, a.WebsiteInfo, a.URLInfo, a.BankAccountInfo, a.LicenseInfo, a.FamilyInfo, a.CompId,  " +
                         " a.AgentId, a.PersonId, a.TotalTrip, a.TotalCancelTrip, b.Id AS TicketId, b.Type AS TicketIdType, b.Code AS TicketIdCode, b.Name AS TicketIdName, b.Note AS TicketIdNote, b.Serial,  " +
                         " b.TripDate, b.TripTime, b.TripAlias, b.FromArea, b.ToArea, b.SeatCode, b.PassCode, b.RoundTripCode, b.FromValid, b.ToValid, b.PickupDate, b.PickupInfo,  " +
                         " b.DropOffInfo, b.FacilityInfo, b.DeliveryInfo, b.CustomerInfo, b.Fare, b.Debt, b.Refund, b.Deposit, b.Discount, b.Surcharge, b.CancelFee, b.Commission,  " +
                         " b.PaymentInfo, b.TransactionInfo, b.NotificationInfo, b.CallerInfo, b.AgentInfo, b.UserCharge, b.CreatedUser, b.IssueDate, b.IssueInfo, b.IssuedUser, b.Status,  " +
                         " b.Info, b.Keywords, b.IsPrgStatus, b.IsPrgPartComp, b.IsPrgCreatedDate, b.IsPrgUpdatedDate, b.IsPrgCreatedUserId, b.IsPrgUpdatedUserId,  " +
                         " b.IsPrgUnsignKeywords, b.IsPrgLanguageInfo, b.IsPrgHistoryInfo, b.TripId, b.AgentId AS TicketIdAgentId, b.CustomerId, b.EventId, b.ChargeDate,  " +
                         " b.CompId AS TicketIdCompId, b.TripIdType, b.TripIdCode, b.TripIdName, b.AgentIdType, b.AgentIdCode, b.AgentIdName, b.AgentIdFullName, b.EventIdType,  " +
                         " b.EventIdCode, b.EventIdName, b.CustomerIdType, b.CustomerIdCode, b.CustomerIdName, b.CustomerIdFullName " +
" FROM            (SELECT        Id, Type, Code, Name, Note, Phone, BookingTicket, TotalBooking, PaidTicket, TotalPaid, CancelTicket, TotalCancel, NotComeTicket,  " +
                                                    " TotalNotCome, PassTicket, TotalPass, OpenTicket, TotalOpen, ValidTicket, TotalValid, KeepOnTimeTicket, TotalKeepOnTime, TotalTicket,  " +
                                                    " TotalMoney, LastedTripId, LastedTripDate, LastedTripTime, LastedTotalTicket, TotalProduct, TotalProductMoney, LastedProductTripId,  " +
                                                    " LastedProductTripDate, LastedProductTripTime, LastedTotalProduct, TotalProductOrder, Email, VipInfo, Gender, FullName, Birthday, AddressInfo,  " +
                                                    " PhoneInfo, FaxInfo, EmailInfo, ImageInfo, WebsiteInfo, URLInfo, BankAccountInfo, LicenseInfo, FamilyInfo, UIConfigInfo, Info, Keywords,  " +
                                                    " IsPrgStatus, IsPrgPartComp, IsPrgCreatedDate, IsPrgUpdatedDate, IsPrgCreatedUserId, IsPrgUpdatedUserId, IsPrgUnsignKeywords,  " +
                                                    " IsPrgLanguageInfo, IsPrgHistoryInfo, CompId, AgentId, PersonId, TotalTrip, TotalCancelTrip " +
                          " FROM            dbo.Customer " +
                          " {0} " +
						  " )  " +
						  " AS a LEFT OUTER JOIN " +
                             " (SELECT        Id, Type, Code, Name, Note, Serial, TripDate, TripTime, TripAlias, FromArea, ToArea, SeatCode, PassCode, RoundTripCode, FromValid, ToValid,  " +
                                                         " PickupDate, PickupInfo, DropOffInfo, FacilityInfo, DeliveryInfo, CustomerInfo, Fare, Debt, Refund, Deposit, Discount, Surcharge, CancelFee,  " +
                                                         " Commission, PaymentInfo, TransactionInfo, NotificationInfo, CallerInfo, AgentInfo, UserCharge, CreatedUser, IssueDate, IssueInfo, IssuedUser,  " +
                                                         " Status, Info, Keywords, IsPrgStatus, IsPrgPartComp, IsPrgCreatedDate, IsPrgUpdatedDate, IsPrgCreatedUserId, IsPrgUpdatedUserId,  " +
                                                         " IsPrgUnsignKeywords, IsPrgLanguageInfo, IsPrgHistoryInfo, TripId, AgentId, CustomerId, EventId, ChargeDate, CompId, TripIdType,  " +
                                                         " TripIdCode, TripIdName, AgentIdType, AgentIdCode, AgentIdName, AgentIdFullName, EventIdType, EventIdCode, EventIdName,  " +
                                                         " CustomerIdType, CustomerIdCode, CustomerIdName, CustomerIdFullName " +
                               " FROM            dbo.zgcl_Ticket03 " +
                               " {1} ) AS b ON a.Id = b.CustomerId AND a.CompId = b.CompId) " +
"\n select a.Id, a.Type, a.Code, a.Name, a.Note, a.Phone, a.BookingTicket, a.TotalBooking, a.PaidTicket, a.TotalPaid, a.CancelTicket, a.TotalCancel, a.NotComeTicket,  " +
                         " a.TotalNotCome, a.PassTicket, a.TotalPass, a.OpenTicket, a.TotalOpen, a.ValidTicket, a.TotalValid, a.KeepOnTimeTicket, a.TotalKeepOnTime, a.TotalTicket,  " +
                         " a.TotalMoney, a.LastedTripId, a.LastedTripDate, a.LastedTripTime, a.LastedTotalTicket, a.TotalProduct, a.TotalProductMoney, a.LastedProductTripId,  " +
                         " a.LastedProductTripDate, a.LastedProductTripTime, a.LastedTotalProduct, a.TotalProductOrder, a.Email, a.VipInfo, a.Gender, a.FullName, a.Birthday,  " +
                         " a.AddressInfo, a.PhoneInfo, a.FaxInfo, a.EmailInfo, a.ImageInfo, a.WebsiteInfo, a.URLInfo, a.BankAccountInfo, a.LicenseInfo, a.FamilyInfo, a.CompId,  " +
                         " a.AgentId, a.PersonId, a.TotalTrip, a.TotalCancelTrip,  " +
						 " a.TicketIdCompId, a.TripId, a.TripIdName, a.TripDate,  " +
						 " COUNT(case when a.status != 3 then 1 else null end) AS TotalTicketTrip,  " +
						 " SUM(case when a.status = 3 then 0 else  " +
						 " (case when a.Fare is null then 0 else a.fare end -  " +
						 " case when a.Discount is null then 0 else a.Discount end + " +
						 " case when a.Surcharge is null then 0 else a.Surcharge end) end) AS Total, Stuff " +
                             " ((SELECT        ', ' + SUBSTRING(b.SeatCode, 0, Charindex('|', b.SeatCode)) " +
                                 " FROM            (select * from a1 where a1.Status <> 3) as b " +
                                 " WHERE        b.CompId = a.TicketIdCompId AND b.TripId = a.TripId AND a.Phone = b.Phone AND  " +
                                                          " a.TripDate = b.TripDate  FOR xml Path('')), 1, 2, '')  " +
                         " AS ListSeat, Stuff " +
                             " ((SELECT        ', ' + SUBSTRING(b.SeatCode, 0, Charindex('|', b.SeatCode)) " +
                                 " FROM            (select * from a1 where a1.Status = 3) as b " +
                                 " WHERE        b.CompId = a.TicketIdCompId AND a.TripId = b.TripId AND a.Phone = b.Phone AND  " +
                                                          " a.TripDate = b.TripDate FOR xml Path('')), 1, 2, '')  " +
                         " AS ListCancelSeat " +
" FROM            a1 as a " +
" GROUP BY a.Id, a.Type, a.Code, a.Name, a.Note, a.Phone, a.BookingTicket, a.TotalBooking, a.PaidTicket, a.TotalPaid, a.CancelTicket, a.TotalCancel, a.NotComeTicket,  " +
                         " a.TotalNotCome, a.PassTicket, a.TotalPass, a.OpenTicket, a.TotalOpen, a.ValidTicket, a.TotalValid, a.KeepOnTimeTicket, a.TotalKeepOnTime, a.TotalTicket,  " +
                         " a.TotalMoney, a.LastedTripId, a.LastedTripDate, a.LastedTripTime, a.LastedTotalTicket, a.TotalProduct, a.TotalProductMoney, a.LastedProductTripId,  " +
                         " a.LastedProductTripDate, a.LastedProductTripTime, a.LastedTotalProduct, a.TotalProductOrder, a.Email, a.VipInfo, a.Gender, a.FullName, a.Birthday,  " +
                         " a.AddressInfo, a.PhoneInfo, a.FaxInfo, a.EmailInfo, a.ImageInfo, a.WebsiteInfo, a.URLInfo, a.BankAccountInfo, a.LicenseInfo, a.FamilyInfo, a.CompId,  " +
                         " a.AgentId, a.PersonId, a.TotalTrip, a.TotalCancelTrip, " +
						 " a.TicketIdCompId, a.TripId, a.TripIdName, a.TripDate", (lc.Length > 0 ? sql[0] : "where Phone IS NOT NULL"), lc.Length > 1 ? sql[1] : "where customerid is not null")}
                ).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void CustomerTripDetail(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A().Pc("Phone").Pc("CustomerTripIdTripDate").Pc("CompId").Pc("CustomerTripIdCompId").Pc("CustomerTripIdTripId").Pc("CustomerTripIdCustomerId").Pc("IsPrgStatus");
            var f = (x._ip["_f"] as string);
            //var f = new[] {"*", "*"};
            //if (lf != null)
            //{
            //    f[0] = lf[0] + "";
            //    if(lf.Count > 1) f[1] = lf[1] + "";
            //}
            var lc = (x._ip["_c"] as object[]);
            var cd = new string[lc.Length][][];
            var sql = new string[lc.Length];
            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[(lc[i] as Dictionary<string, object>).Count][];
                foreach (var c in lc[i] as Dictionary<string, object>)
                {
                    if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null) }; return;
                    }
                    cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                    j++;
                }
                sql[i] = x.LW(cd[i], cd[i].Length);
            }
            var store = string.Format("alter view GetProcedureData as select {0} from " +
                                      "(select * from customer {1} ) as x " +
                                    "left join (select * from customertripedit {2} ) as y on x.id = y.customertripidcustomerid ",
                f ?? "*",
                (lc.Length > 0 ? sql[0] : "where Phone IS NOT NULL"),
                lc.Length > 1 ? sql[1] : "where customertripidcustomerid is not null");
            var r = x.EXO(
                new[] { store }
                ).G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        /*public static void SearchTrip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t };
        }*/

        public static void GetTripTotalSeatInfo(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("TripId").Pc("TripDate")._CR()._CF().L().EXO(
                new[]{string.Format("alter view GetProcedureData as select TripId, cast(TripDate as date) as TripDate, CONVERT(VARCHAR(5),TripDate,108) AS OnHour, COUNT(*) AS Totals " +
                                     "from Ticket {0} AND Status IN (1,2,5,8) " +
                                     "GROUP BY TripId, CAST(TripDate as date), CONVERT(VARCHAR(5),TripDate,108)", x.LW(x._c, x._cc))}
                ).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        public static void GetTripSummary(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("CompId").Pc("TripId").Pc("TripDate").Pc("NumberBookTicket")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static string[] GenerateTicketCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var result = new string[2];
            result[0] = new string(
                Enumerable.Repeat(chars, 6)
                    .Select(s => s[random.Next(s.Length)])
                    .ToArray());
            result[1] = ((DateTime.UtcNow.Month <= 6 ? 1 : 2) * 100 + (DateTime.UtcNow.Year % 100)).ToString(CultureInfo.InvariantCulture);
            return result;
            //var success = false;
            //// lặp lại 10 lần nếu có lỗi, quá 10 lần thì trả về lỗi thật
            //for (var i = 0; i < 10; i++)
            //{
            //    try
            //    {
            //        var timeCode = (DateTime.UtcNow.Month <= 6 ? 1 : 2) * 100 + (DateTime.UtcNow.Year % 100);
            //        _reservationRepository.InsertUniqueCodeStore(new UniqueCodeStore
            //        {
            //            Code = result,
            //            TimeCode = timeCode
            //        });

            //        // double check if here should be < or <= ???
            //        if (_reservationRepository.Commit() < 0)
            //        {
            //            // error (most posibility of duplicated code)
            //            // => try another random code
            //            result = new string(
            //                Enumerable.Repeat(chars, 6)
            //                    .Select(s => s[random.Next(s.Length)])
            //                    .ToArray());
            //        }
            //        else
            //        {
            //            success = true;
            //            break;
            //        }
            //    }
            //    catch
            //    {
            //        // error (most posibility of duplicated code)
            //        // => try another random code
            //        result = new string(
            //            Enumerable.Repeat(chars, 6)
            //                .Select(s => s[random.Next(s.Length)])
            //                .ToArray());
            //    }
            //}

            //if (!success)
            //{
            //    result = string.Empty;
            //}

            //return result;
        }

        //for Bus_Tickets_Status
        //public static void Bus_Tickets_Status(object obj, out object oo)
        //{
        //    var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
        //    var r = x.R().A().Pc("Id").Pc("XTypeId").Pc("XAgentId").Pc("XBranchId").Pc("XOperatorId").Pc("XCompanyId").Pc("XRouteId").Pc("XTripId").Pc("XDate").Pc("XTime").Pc("XStatus").Pc("Info").Pc("Note").Pc("Name").Pc("Description").Pc("IsPrgCode").Pc("IsPrgCDate").Pc("IsPrgUDate").Pc("IsPrgStatus").Pc("IsPrgConfig").Pc("IsPrgCAccId").Pc("IsPrgUAccId").Pc("IsPrgCAccInfo").Pc("IsPrgUAccInfo").Pc("IsPrgHistoryInfo").Pc("IsPrgBranchInfo").Pc("IsPrgOperatorInfo").Pc("IsPrgCompanyInfo").Pc("IsPrgLanguageInfo").Pc("XFromId").Pc("XToId").Pc("EFromId").Pc("EToId")._CR()._CF().L().S().EX().G();
        //    oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        //}

        public static void GetLatestBusTicketsStatus(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("XTypeId").Pc("XAgentId").Pc("XBranchId").Pc("XOperatorId").Pc("XCompanyId").Pc("XRouteId").Pc("XTripId").Pc("XDate").Pc("XTime").Pc("XStatus").Pc("Info").Pc("Note").Pc("Name").Pc("Description").Pc("IsPrgCode").Pc("IsPrgCDate").Pc("IsPrgUDate").Pc("IsPrgStatus").Pc("IsPrgConfig").Pc("IsPrgCAccId").Pc("IsPrgUAccId").Pc("IsPrgCAccInfo").Pc("IsPrgUAccInfo").Pc("IsPrgHistoryInfo").Pc("IsPrgBranchInfo").Pc("IsPrgOperatorInfo").Pc("IsPrgCompanyInfo").Pc("IsPrgLanguageInfo").Pc("XFromId").Pc("XToId").Pc("EFromId").Pc("EToId").Pc("TimeLimit")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void GetBusTicketsStatus(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("XTypeId").Pc("XAgentId").Pc("XBranchId").Pc("XOperatorId").Pc("XCompanyId").Pc("XRouteId").Pc("XTripId").Pc("XDate").Pc("XTime").Pc("XStatus").Pc("Info").Pc("Note").Pc("Name").Pc("Description").Pc("IsPrgCode").Pc("IsPrgCDate").Pc("IsPrgUDate").Pc("IsPrgStatus").Pc("IsPrgConfig").Pc("IsPrgCAccId").Pc("IsPrgUAccId").Pc("IsPrgCAccInfo").Pc("IsPrgUAccInfo").Pc("IsPrgHistoryInfo").Pc("IsPrgBranchInfo").Pc("IsPrgOperatorInfo").Pc("IsPrgCompanyInfo").Pc("IsPrgLanguageInfo").Pc("XFromId").Pc("XToId").Pc("EFromId").Pc("EToId").Pc("TimeLimit")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void UpdateBusTicketsStatus(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("XTypeId").Pc("XAgentId").Pc("XBranchId").Pc("XOperatorId").Pc("XCompanyId").Pc("XRouteId").Pc("XTripId").Pc("XDate").Pc("XTime").Pc("XStatus").Pc("Info").Pc("Note").Pc("Name").Pc("Description").Pc("IsPrgCode").Pc("IsPrgCDate").Pc("IsPrgUDate").Pc("IsPrgStatus").Pc("IsPrgConfig").Pc("IsPrgCAccId").Pc("IsPrgUAccId").Pc("IsPrgCAccInfo").Pc("IsPrgUAccInfo").Pc("IsPrgHistoryInfo").Pc("IsPrgBranchInfo").Pc("IsPrgOperatorInfo").Pc("IsPrgCompanyInfo").Pc("IsPrgLanguageInfo").Pc("XFromId").Pc("XToId").Pc("EFromId").Pc("EToId").Pc("TimeLimit")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void Bus_Tickets_Status(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A().Pc("Id").Pc("XTypeId").Pc("XAgentId").Pc("XBranchId").Pc("XOperatorId").Pc("XCompanyId").Pc("XRouteId").Pc("XTripId").Pc("XDate").Pc("XTime").Pc("XStatus").Pc("Info").Pc("Note").Pc("Name").Pc("Description").Pc("IsPrgCode").Pc("IsPrgCDate").Pc("IsPrgUDate").Pc("IsPrgStatus").Pc("IsPrgConfig").Pc("IsPrgCAccId").Pc("IsPrgUAccId").Pc("IsPrgCAccInfo").Pc("IsPrgUAccInfo").Pc("IsPrgHistoryInfo").Pc("IsPrgBranchInfo").Pc("IsPrgOperatorInfo").Pc("IsPrgCompanyInfo").Pc("IsPrgLanguageInfo").Pc("XFromId").Pc("XToId").Pc("EFromId").Pc("EToId").Pc("TimeLimit");
            //var lc = (x._ip["_c"] as object[]);
            //var ld = (x._ip["_d"] as object[]);
            var lc = ((IEnumerable)x._ip["_c"]).Cast<Dictionary<string, object>>().ToArray();
            var ld = ((IEnumerable)x._ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
            var cd = new string[lc.Length][][];
            var da = new string[lc.Length][][];
            var sql = new string[lc.Length];

            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[lc[i].Count][];
                foreach (var c in lc[i])
                {
                    if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                    {
                        //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null), Code = "" };
                        return;
                    }
                    cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                    j++;
                }
                j = 0;
                da[i] = new string[ld[i].Count][];
                foreach (var d in ld[i])
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null), Code = "" }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.U1(x._a[3], cd[i].Length, cd[i], da[i].ToList());
                var updateSql = x._sql;
                x.I(x._a[3], da[i].ToList());
                var insertSql = x._sql;
                sql[i] = string.Format(" DECLARE @ID AS INT SELECT @ID = ID FROM {0} {1} IF (@ID IS NULL) BEGIN {2} END; IF (@ID IS NOT NULL) BEGIN {3} END ",
                    x._a[3], x.LS(cd[i], cd[i].Length), insertSql, updateSql);
            }
            //oo = new { Result = 0, Records = 0, Message = "" };
            var r = x.EX2(sql).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void RemoveBus_Tickets_Status(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A().Pc("Id").Pc("XTypeId").Pc("XAgentId").Pc("XBranchId").Pc("XOperatorId").Pc("XCompanyId").Pc("XRouteId").Pc("XTripId").Pc("XDate").Pc("XTime").Pc("XStatus").Pc("Info").Pc("Note").Pc("Name").Pc("Description").Pc("IsPrgCode").Pc("IsPrgCDate").Pc("IsPrgUDate").Pc("IsPrgStatus").Pc("IsPrgConfig").Pc("IsPrgCAccId").Pc("IsPrgUAccId").Pc("IsPrgCAccInfo").Pc("IsPrgUAccInfo").Pc("IsPrgHistoryInfo").Pc("IsPrgBranchInfo").Pc("IsPrgOperatorInfo").Pc("IsPrgCompanyInfo").Pc("IsPrgLanguageInfo").Pc("XFromId").Pc("XToId").Pc("EFromId").Pc("EToId").Pc("TimeLimit");
            //var lc = (x._ip["_c"] as object[]);
            //var ld = (x._ip["_d"] as object[]);
            var lc = ((IEnumerable)x._ip["_c"]).Cast<Dictionary<string, object>>().ToArray();
            var ld = ((IEnumerable)x._ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
            var cd = new string[lc.Length][][];
            var da = new string[lc.Length][][];
            var sql = new string[lc.Length];

            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[lc[i].Count][];
                foreach (var c in lc[i])
                {
                    if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                    {
                        //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null), Code = "" };
                        return;
                    }
                    cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                    j++;
                }
                j = 0;
                da[i] = new string[ld[i].Count][];
                foreach (var d in ld[i])
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null), Code = "" }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.U1(x._a[3], cd[i].Length, cd[i], da[i].ToList());
                sql[i] = x._sql;
            }
            var r = x.EX2(sql).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void InsertBus_Tickets_Status(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            x.R().A();
            var ld = ((IEnumerable)x._ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
            var da = new string[ld.Length][][];
            var sql = new string[ld.Length];
            for (var i = 0; i < ld.Length; i++)
            {
                var j = 0;
                da[i] = new string[ld[i].Count][];
                foreach (var d in ld[i])
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null) }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.I(x._a[3], da[i].ToList());
                sql[i] = (x._sql);
            }
            var r = x.EX2(sql).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void DeleteBusTicketsStatus(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("XTypeId").Pc("XStatus").Pc("XAgentId").Pc("XTripId").Pc("XCompanyId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        //Payment Transaction
        public static void GetPaymentTransaction(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TransactionId").Pc("Gateway").Pc("Date").Pc("Status")
                .Pc("NLPaymentType").Pc("BankCode").Pc("Description").Pc("Ts").Pc("Checksum").Pc("Actor").Pc("CreatedTime").Pc("Type").Pc("BookingCode").Pc("TransactionStatus")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void PaymentTransaction(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TransactionId").Pc("Gateway").Pc("Date").Pc("Status").Pc("TicketCode")
                .Pc("NLPaymentType").Pc("BankCode").Pc("Description").Pc("Ts").Pc("Checksum").Pc("Actor").Pc("CreatedTime").Pc("Type").Pc("BookingCode").Pc("TransactionStatus")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        //CustomerTrip_Ticket
        public static void GetCustomerTripTicket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Code").Pc("Name").Pc("TripName").Pc("CustomerId")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        //For fare
        public static void UpdateFareInfo(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd); x.R().A().Pc("Id").Pc("Time").Pc("BaseId").Pc("Date").Pc("Type").Pc("CompId");
            //var lc = (x._ip["_c"] as object[]);
            //var ld = (x._ip["_d"] as object[]);
            var lc = ((IEnumerable)x._ip["_c"]).Cast<Dictionary<string, object>>().ToArray();
            var ld = ((IEnumerable)x._ip["_d"]).Cast<Dictionary<string, object>>().ToArray();
            var cd = new string[lc.Length][][];
            var da = new string[lc.Length][][];
            var sql = new string[lc.Length];

            for (var i = 0; i < lc.Length; i++)
            {
                var j = 0;
                cd[i] = new string[lc[i].Count][];
                foreach (var c in lc[i])
                {
                    if (string.IsNullOrEmpty(x.L(c.Key, 0, 0, x._pc, x._p)))
                    {
                        //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10006.G(IsDebug, null), Code = "" };
                        return;
                    }
                    cd[i][j] = new[] { c.Key, x.L(c.Key, 7, 0, x._fs.Length, x._fs), c.Value + "" };
                    j++;
                }
                j = 0;
                da[i] = new string[ld[i].Count][];
                foreach (var d in ld[i])
                {
                    if (string.IsNullOrEmpty(x.L(d.Key, 7, 0, x._fs.Length, x._fs)))
                    {     //Kiem tra neu field _c truyen vao khong dung giong voi tap field _c cua action thi bao loi
                        oo = new { Result = 0, Message = _E.E10007.G(IsDebug, null), Code = "" }; return;
                    }
                    da[i][j] = new[] { d.Key, x.L(d.Key, 7, 0, x._fs.Length, x._fs), d.Value + "" };
                    j++;
                }
                x.U1(x._a[3], cd[i].Length, cd[i], da[i].ToList());
                var updateSql = x._sql;
                x.I(x._a[3], da[i].ToList());
                var insertSql = x._sql;
                sql[i] = string.Format(" DECLARE @ID AS INT SELECT @ID = ID FROM {0} {1} IF (@ID IS NULL) BEGIN {2} END; {3} ",
                    x._a[3], x.LS(cd[i], cd[i].Length), insertSql, updateSql);
            }
            //oo = new { Result = 0, Records = 0, Message = "" };
            var r = x.EX2(sql).G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }



        public static void InsertSMS(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TicketCode").Pc("IsPrgStatus")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        //public static void SendSMS(object obj, out object oo)
        //{
        //    //public void _sentSMSTicket(BookingVM bookingInfo, string toPhoneNumber)
        //    //{
        //    //var smsTicket = _serReservation.GetSMSTicket(ticketCode);
        //    //string name = bookingInfo.BuyerInfo.FullName.Split(' ').Last();
        //    //SMSTicketVM smsTicketVM = new SMSTicketVM();
        //    //smsTicketVM.FirstName = name;
        //    //smsTicketVM.PhoneNumber = bookingInfo.BuyerInfo.PhoneNumber;
        //    //smsTicketVM.RouteName = bookingInfo.BookingDetailsVM.RouteName;
        //    //smsTicketVM.ToTalFare = bookingInfo.BookingDetailsVM.ExpectedTotalFare;
        //    //smsTicketVM.OperatorName = bookingInfo.BookingDetailsVM.OperatorName;
        //    //smsTicketVM.DepartureTime = bookingInfo.BookingDetailsVM.DepartureTime;
        //    //smsTicketVM.DepartureTicketCode = bookingInfo.BookingDetailsVM.TicketCode;

        //    //string smsContent = String.Format(
        //    //    "VeXeRe-19006484 \n K/h: {0} \n Xe: {1}({2}) \n Noi di: {7} \n T/g: {3}-{4} \n Ma: {5} \n Ghe: {6}",
        //    //    smsTicketVM.FirstName,
        //    //    smsTicketVM.OperatorName,
        //    //    smsTicketVM.RouteName,
        //    //    smsTicketVM.DepartureTime.ToString("HH:mm"),
        //    //    smsTicketVM.DepartureTime.ToString("dd/MM/yy"),
        //    //    smsTicketVM.DepartureTicketCode,
        //    //    bookingInfo.BookingDetailsVM.SBookingSeats,
        //    //    bookingInfo.BookingDetailsVM.FromBusStopName
        //    //    );
        //    //SendSMSAsync(toPhoneNumber, StripVietnameseSigns(smsContent),
        //    //    "HK" + smsTicketVM.DepartureTicketCode + "_" + toPhoneNumber); // HK: hành khách
        //}

        public static void TripInfo(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Type").Pc("Id").Pc("Date").Pc("Time").Pc("SeatTemplateInfo").Pc("BaseId").Pc("CompId").Pc("Name").Pc("IsPrgStatus").Pc("Info")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void TicketSummary(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("CompId").Pc("TripDate")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void Log(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Type").Pc("IsPrgCreatedDate").Pc("Name").Pc("Id")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void Delivery(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()
                .Pc("Id").Pc("CustomerId").Pc("RouteId").Pc("CityId").Pc("DistrictId").Pc("AddressInfo").Pc("CustomerPhone")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void Booking(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()
                .Pc("Id").Pc("Code").Pc("TicketCode").Pc("PaymentMethod").Pc("PaymentGateway").Pc("CampaignId").Pc("CouponId").Pc("CouponValue")
                .Pc("Discount").Pc("DiscountType").Pc("FinalPrice").Pc("InvoiceInfo").Pc("Status").Pc("CreatedTime").Pc("Source").Pc("DeliveryId")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }
        public static void Bus_Ticket_Form(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()
                .Pc("Id").Pc("Code").Pc("Amount").Pc("CName").Pc("CPhone").Pc("CEmail").Pc("CNote").Pc("CAddress")
                .Pc("TripName").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("PickupDate").Pc("Fare").Pc("IsPrgCDate").Pc("IsPrgCompanyInfo").Pc("Status")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        public static void CallProcedure(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A()._CR()._CF().L().S().Excuse().G();
            oo = new { Result = r._s, Records = r._d, Message = r._m };
        }

        public static void CallCustomFunction(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var msg = "";
            try
            {
                if (x._ip.ContainsKey("_a"))
                {
                    if (x._ip["_a"].ToString() == "sendSms")
                    {
                        msg = PS.SendSMS(x._ip["phone"].ToString(), x._ip["content"].ToString());
                    }
                    else if (x._ip["_a"].ToString() == "sendEmailToCustomer")
                    {

                        msg = PS._sentETicketBms(
                        new string[]
                        {
                            x._ip["code"].ToString(),
                            x._ip["tripDateTime"].ToString(),
                            x._ip["compName"].ToString(),
                            x._ip["tripName"].ToString(),
                            x._ip["fromArea"].ToString(),
                            x._ip["toArea"].ToString(),
                            x._ip["tripDate"].ToString(),
                            x._ip["tripTime"].ToString(),
                            x._ip["seat"].ToString(),
                            x._ip["fare"].ToString(),
                            x._ip["money"].ToString(),
                            x._ip["customerName"].ToString(),
                            x._ip["customerPhone"].ToString(),
                            x._ip["date"].ToString()
                        }
                        , x._ip["email"].ToString(), x._ip["template"].ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                oo = new { Result = 0, Message = msg };
            }
            oo = new { Result = 1, Message = (msg == "" ? "Success" : msg) };
        }

    }
}
