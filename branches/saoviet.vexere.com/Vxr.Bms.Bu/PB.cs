using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using Vxr.Bms.Bu.Dic;
using Vxr.Bms.Bu.Lib;
using Vxr.Bms.Core;

namespace Vxr.Bms.Bu
{
    // ReSharper disable InconsistentNaming
    public class PB
    {
        public static bool IsDebug = (ConfigurationManager.AppSettings["isDebug"] == "1");

        public static string _sc = P._cs;
        public void BackUpCustomerPerTrip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_sc, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("CompId").Pc("UserId").Pc("TripId").Pc("FromDate")._CR()._CF().L();
            
            //Parse conditions
            var compId = String.Empty;
            var userId = String.Empty;
            var fromDate = String.Empty;
            foreach (var t in r._c.Where(t => t != null && t.Length > 0))
            {
                switch (t[0])
                {
                    case "CompId":
                        compId = t[2];
                        break;
                    case "UserId":
                        userId = t[2];
                        break;
                    case "TripId":
                        break;
                    case "FromDate":
                        fromDate = t[2];
                        break;
                }
            }

            //Path
            var resultUrl = String.Format("{0}/{1}/{2}/Backup{3}.zip", new object[]
            {
                ConfigurationManager.AppSettings["backupBaseUrl"], 
                ConfigurationManager.AppSettings["backUpRootUrl"], 
                compId, 
                userId
            });
            var backUpPath =  HttpContext.Current.Server.MapPath(
                    String.Format(ConfigurationManager.AppSettings["backUpRootPath"] + "/{0}/{1}", compId, userId));

            if (!Directory.Exists(backUpPath))
            {
                Directory.CreateDirectory(backUpPath);
            }
            else
            {
                //Remove old files
                var dir = new DirectoryInfo(backUpPath);
                foreach(var f in dir.GetFiles())
                {
                    f.Delete();
                }
            }

            //Get list trip has book ticket
            var obj1 = new Dictionary<string, object>
            {
                {"_a", "fGetTripSummary"},
                {
                    "_c", new Dictionary<string, object>
                    {
                        {"CompId", compId},
                        {"TripDate", String.Format("$x >= N'{0}'", fromDate) },
                        {"NumberBookTicket", "$x > 0"}
                    }
                },
                {"_f", "TripId, TripName, TripDate"}
            };

            object robj1;
            PE.GetTripSummary(obj1, out robj1);
            var rcobj1 = robj1.GetType().GetProperty("Records").GetValue(robj1, null) as List<object[]>;
            if (rcobj1 != null && rcobj1.Any())
            {
                //Create excel tool
                var excelUtil = new ExportExcel();
                var fields = new List<string> { "Id", "Tên hành khách", "Số điện thoại", "Số ghế", "Ngày đặt", "Văn phòng đặt", "Giá", "Trạng thái", "Thanh toán", "Ghi chú"};

                foreach (var t in rcobj1)
                {
                    var obj2 = new Dictionary<string, object>
                    {
                        {"_a", "fGetTicket"},
                        {
                            "_c", new Dictionary<string, object>
                            {
                                {"TripId", t[0]},
                                {"TripDate", DateTime.Parse(Convert.ToString(t[2])).ToString("yyyy-MM-dd HH:mm:ss")}
                            }
                        },
                        {"_f", "Id, CustomerInfo, SeatCode, IsPrgCreatedDate, AgentIdName, Fare, Status, PaymentInfo, Note"}
                    };

                    object robj2;
                    P.Ticket(obj2, out robj2);
                    var rcobj2 = robj2.GetType().GetProperty("Records").GetValue(robj2, null) as List<object[]>;
                    if (rcobj2 != null && rcobj2.Any())
                    {
                        var filePath = HttpContext.Current.Server.MapPath(
                        String.Format(ConfigurationManager.AppSettings["backUpRootPath"] + "/{0}/{1}/{2}-{3}.xlsx", new object[] { compId, userId, _generateSlug(Convert.ToString(t[1])), DateTime.Parse(Convert.ToString(t[2])).ToString("ddMMyyyyHHmm") }));
                        var title = String.Format("{0} chuyến {1} ngày {2}",
                            new[] {t[1], DateTime.Parse(Convert.ToString(t[2])).ToString("HH:mm"), DateTime.Parse(Convert.ToString(t[2])).ToString("dd-MM-yyyy")});
                        var rdata = new List<object[]>();
                        foreach (var rc in rcobj2)
                        {
                            if (rc != null && rc.Length > 0)
                            {
                                var rcd = new object[fields.Count];
                                rcd[0] = rc[0];

                                var tmp1 = Convert.ToString(rc[1]).Split('|');
                                rcd[1] = tmp1.Length > 3 ? tmp1[3] : String.Empty;

                                var tmp2 = Convert.ToString(rc[1]).Split('|');
                                rcd[2] = tmp2.Length > 4 ? tmp2[4] : String.Empty;

                                var tmp3 = Convert.ToString(rc[2]).Split('|');
                                rcd[3] = tmp3.Length > 1 ? tmp3[0] : String.Empty;

                                rcd[4] = DateTime.Parse(Convert.ToString(rc[3])).ToString("dd-MM-yyyy HH:mm:ss");
                                rcd[5] = rc[4];
                                rcd[6] = rc[5];

                                //rcd[7] = rc[6];
                                //rcd[8] = rc[7];
                                //rcd[9] = rc[8];
                                //rcd[10] = rc[9];
                                //rcd[11] = rc[10];

                                switch (Convert.ToInt32(rc[6]))
                                {
                                    case 1:
                                        rcd[7] = "Đặt chỗ";
                                        break;
                                    case 2:
                                        rcd[7] = "Đã thanh toán";
                                        break;
                                    case 3:
                                        rcd[7] = "Đã hủy";
                                        break;
                                    case 4:
                                        rcd[7] = "Hành khách không đến";
                                        break;
                                    case 5:
                                        rcd[7] = "Đã thanh toán";
                                        break;
                                    case 6:
                                        rcd[7] = "Vé mở";
                                        break;
                                    case 7:
                                        rcd[7] = "Vé mở";
                                        break;
                                    case 8:
                                        rcd[7] = "Giữ đến giờ xe chạy";
                                        break;
                                }

                                var pText = String.Empty;
                                if (rc[7] != null)
                                {

                                    var paymentInfo = Convert.ToString(rc[7]).Split(':');
                                    if (paymentInfo.Length > 0 && !String.IsNullOrEmpty(paymentInfo[0]))
                                    {
                                        var ptype = Convert.ToInt32(paymentInfo[0]);
                                        if (ptype > 0)
                                        {
                                            switch (ptype)
                                            {
                                                case 1:
                                                case 6:
                                                    if (paymentInfo.Length > 2 && !String.IsNullOrEmpty(paymentInfo[2]))
                                                    {
                                                        var ainfo = paymentInfo[2].Split('|');
                                                        if (ainfo.Length > 3)
                                                        {
                                                            pText = ainfo[3];
                                                        }
                                                    }
                                                    break;
                                                case 2:
                                                case 3:
                                                case 4:
                                                case 5:
                                                case 7:
                                                case 8:
                                                case 9:
                                                case 10:
                                                    if (paymentInfo.Length > 1)
                                                    {
                                                        pText = paymentInfo[1];
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                }
                                rcd[8] = pText;
                                rcd[9] = rc[8];

                                rdata.Add(rcd);
                            }
                            
                        }

                        //Generate file
                        excelUtil.CreateBackUpFile(filePath, fields, rdata, title);
                    }
                }

                //Zip all backup file
                var resultPath = 
                    HttpContext.Current.Server.MapPath(
                   String.Format(ConfigurationManager.AppSettings["backUpRootPath"] + "/{0}/Backup{1}.zip", compId,
                       userId));

                if (File.Exists(resultPath))
                {
                    var fi = new FileInfo(resultPath);
                    fi.Delete();
                }

                ZipFile.CreateFromDirectory(backUpPath, resultPath, CompressionLevel.Fastest, false);
            }

            oo = new { Result = 1, Records = resultUrl, TotalRecordCount = 1 };
        }

        private static string _generateSlug(string phrase)
        {
            var str = phrase.ToLowerInvariant();
            str = _removeAccent(str);
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-_]", "");
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            str = Regex.Replace(str, @"\s", "-"); // hyphens   
            str = str.Trim(new[] {'-'});
            return str;
        }

        private static string _removeAccent(string txt)
        {
            var bytes = Encoding.GetEncoding("Cyrillic").GetBytes(txt);
            return Encoding.ASCII.GetString(bytes);
        }
    }
}
