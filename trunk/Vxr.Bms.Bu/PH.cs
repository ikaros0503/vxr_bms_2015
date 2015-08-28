using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using Vxr.Bms.Api;

namespace Vxr.Bms.Bu
{
    public class PH
    {
        public static APIModels api = new APIModels();
        public static void HData(object obj, string[] h, out object oo)
        {
            var d = ((Dictionary<string, object>)obj).ContainsKey("_d") ?
                ((Dictionary<string, object>)obj)["_d"] as Dictionary<string, object> : null;
            var dt = DateTime.Now.ToString("o").Substring(0, 23);
            var js = new JavaScriptSerializer();
            var dJs = js.Serialize(d).Replace("[", "").Replace("]", "");
            if (d != null)
            {
                if (!api.IsUseApi(HttpContext.Current.Request.Headers["UserName"]))
                    d.Add("IsPrgHistoryInfo",
                        h[5][0] == 'U'
                            ? string.Format("$x = $x + N'~{0}##{1}##{2}##{3}##{4}##{5}##{6}'", h[0], h[1], h[2], h[3], dt,
                                h[4], dJs)
                            : string.Format("{0}##{1}##{2}##{3}##{4}##{5}##{6}", h[0], h[1], h[2], h[3], dt, h[4], dJs));
            }
            oo = obj;
        }
        public static void ListHDatas(object obj, string[] h, out object oo)
        {
            //var ld = ((Dictionary<string, object>)obj)["_d"] as object[];
            var dict = obj as Dictionary<string, object>;
            var randomCode = PE.GenerateTicketCode();
            if (dict != null)
            {
                object temp;
                dict.TryGetValue("_d", out temp);
                if (temp != null)
                {
                    var ld = ((IEnumerable)temp).Cast<Dictionary<string, object>>().ToArray();

                    var dt = DateTime.Now.ToString("o").Substring(0, 23);
                    var bCode = GenerateTransactionCode(randomCode[0]);
                    foreach (var d in ld)
                    {
                        // chỉ tạo mã vé khi action là UpdateTicket
                        //if (dict["_a"] != null && dict["_a"].ToString() == "UpdateBookTicket")
                        //{
                        //    //Chèn mã code vào cho vé nếu chưa tồn tại.
                        //    if (!(d.ContainsKey("Code")))
                        //    {
                        //        if (d.ContainsKey("Status"))
                        //        {
                        //            var ticketStatus = Convert.ToInt32(d["Status"]);
                        //            var code = randomCode[0];
                        //            if (ticketStatus != 3)
                        //            {
                        //                d.Add("Code", code);
                        //                d.Add("BookingCode", bCode);
                        //                d.Add("TimeCode", Int32.Parse(randomCode[1]));
                        //            }
                        //        }
                        //    }
                        //}

                        var dFromArea = String.Empty;
                        var dToArea = String.Empty;
                        if (d.ContainsKey("FromArea"))
                        {
                            dFromArea = d["FromArea"].ToString();
                            d["FromArea"] = d["FromArea"].ToString().Replace("~", "<");
                        }
                        if (d.ContainsKey("ToArea"))
                        {
                            dToArea = d["ToArea"].ToString();
                            d["ToArea"] = d["ToArea"].ToString().Replace("~", "<");
                        }

                        var dFromStop = String.Empty;
                        var dToStop = String.Empty;
                        if (d.ContainsKey("FromStop"))
                        {
                            dFromStop = d["FromStop"].ToString();
                            d["FromStop"] = d["FromStop"].ToString().Replace("~", "<");
                        }

                        if (d.ContainsKey("ToStop"))
                        {
                            dToStop = d["ToStop"].ToString();
                            d["ToStop"] = d["ToStop"].ToString().Replace("~", "<");
                        }
                        
                        var js = new JavaScriptSerializer();
                        var dJs = js.Serialize(d).Replace("[", "").Replace("]", "");
                        if (!api.IsUseApi(HttpContext.Current.Request.Headers["UserName"]))
                        {
                            if (h[5][0] == 'U')
                            {
                                d.Add("IsPrgHistoryInfo",
                                        string.Format("$x = $x + N'~{0}##{1}##{2}##{3}##{4}##{5}##{6}'", h[0], h[1],
                                            h[2],
                                            h[3], dt, h[4], dJs));
                            }
                            else
                                d.Add("IsPrgHistoryInfo",
                                    string.Format("{0}##{1}##{2}##{3}##{4}##{5}##{6}", h[0], h[1], h[2], h[3], dt, h[4],
                                        dJs));
                        }
                        if (d.ContainsKey("FromArea"))
                        {
                            d["FromArea"] = dFromArea;
                        }
                        if (d.ContainsKey("ToArea"))
                        {
                            d["ToArea"] = dToArea;
                        }
                        if (d.ContainsKey("FromStop"))
                        {
                            d["FromStop"] = dFromStop;
                        }
                        if (d.ContainsKey("ToStop"))
                        {
                            d["ToStop"] = dToStop;
                        }
                    }
                }
            }
            oo = obj;
        }
        public static string GenerateTransactionCode(string ticketCodes)
        {

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var randomString = new string(
                Enumerable.Repeat(chars, 6)
                    .Select(s => s[random.Next(s.Length)])
                    .ToArray());
            var transCode = string.Empty;
            var success = false;
            // lặp lại 10 lần nếu có lỗi, quá 10 lần thì trả về lỗi thật
            for (var i = 0; i < 10; i++)
            {
                try
                {
                    var timeCode = (DateTime.UtcNow.Month <= 6 ? 1 : 2) * 100 + (DateTime.UtcNow.Year % 100);
                    var strTemp = ticketCodes + "_" + DateTime.UtcNow.ToFileTimeUtc();
                    var hash = CalculateMd5Hash(strTemp + "_" + randomString);
                    transCode = timeCode.ToString("X2") + hash.Substring(0, 5); // get first 8 characters
                    success = true;
                    break;
                }
                catch
                {
                    // error (most posibility of duplicated code)
                    // => try another random code
                    randomString = new string(
                        Enumerable.Repeat(chars, 6)
                            .Select(s => s[random.Next(s.Length)])
                            .ToArray());
                }
            }

            if (!success)
            {
                transCode = string.Empty;
            }

            return transCode;
        }
        public static string CalculateMd5Hash(string input)
        {
            // step 1, calculate MD5 hash from input
            var md5 = MD5.Create();
            var inputBytes = Encoding.ASCII.GetBytes(input);
            var hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            var sb = new StringBuilder();
            foreach (var t in hash)
            {
                sb.Append(t.ToString("X2"));
            }
            return sb.ToString();
        }
        public static string Encrypt_MD5(string val, string key)
        {
            byte[] arrKey;
            byte[] arrMahoa = UTF8Encoding.UTF8.GetBytes(val);

            System.Configuration.AppSettingsReader settingsReader = new AppSettingsReader();
            //Lấy giá trị key từ file Web.config
            string keyConfig = (string)settingsReader.GetValue(key, typeof(String));

            MD5CryptoServiceProvider serviceMD5 = new MD5CryptoServiceProvider();
            arrKey = serviceMD5.ComputeHash(UTF8Encoding.UTF8.GetBytes(keyConfig));
            serviceMD5.Clear();//Giải phóng tài nguyên
            TripleDESCryptoServiceProvider tdsp = new TripleDESCryptoServiceProvider();

            //Thiết lập 1 key cho thuật toán mã hóa
            tdsp.Key = arrKey;

            //Chọn phương thức mã hóa. Ở đây chúng ta chọn ECB(Electronic code Book ) [1]
            tdsp.Mode = CipherMode.ECB;

            //Thêm phương thức mã hóa IS010126 (random chuỗi kết quả)  [2]
            tdsp.Padding = PaddingMode.ISO10126;

            ICryptoTransform cTransform = tdsp.CreateEncryptor();
            byte[] arrKQ = cTransform.TransformFinalBlock(arrMahoa, 0, arrMahoa.Length);
            tdsp.Clear(); //Giải phóng tài nguyên của TripleDES Encryptor

            //Kết quả mã hóa được trả về 1 giá trị kiểu String
            return Convert.ToBase64String(arrKQ, 0, arrKQ.Length);
        }
        public static string Decrypt_MD5(string strGiaiMa, string key)
        {
            byte[] arrKey;
            byte[] arrMahoa = Convert.FromBase64String(strGiaiMa);
            System.Configuration.AppSettingsReader settingsReader = new AppSettingsReader();
            // Lấy giá trị key từ file Web.config
            string keyConfig = (string)settingsReader.GetValue(key, typeof(String));

            MD5CryptoServiceProvider serviceMD5 = new MD5CryptoServiceProvider();
            arrKey = serviceMD5.ComputeHash(UTF8Encoding.UTF8.GetBytes(keyConfig));
            serviceMD5.Clear(); //Giải phóng tài nguyên
            TripleDESCryptoServiceProvider tdsp = new TripleDESCryptoServiceProvider();

            //Thiết lập 1 key cho thuật toán giải mã
            tdsp.Key = arrKey;

            //Chọn phương thức giải mã. Ở đây chúng ta chọn ECB(Electronic code Book) [1]
            tdsp.Mode = CipherMode.ECB;

            //Thêm phương thức giải mã IS010126 (random chuỗi kết quả) [2]
            tdsp.Padding = PaddingMode.ISO10126;

            ICryptoTransform cTransform = tdsp.CreateDecryptor();
            byte[] arrKQ = cTransform.TransformFinalBlock(arrMahoa, 0, arrMahoa.Length);
            tdsp.Clear(); //Giải phóng tài nguyên của TripleDES Encryptor

            // Kết quả giải mã được trả về 1 giá trị kiểu String
            return UTF8Encoding.UTF8.GetString(arrKQ);
        }

    }
}
