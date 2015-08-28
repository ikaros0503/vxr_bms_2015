using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Vxr.Bms.Bu
{
    public class PS
    {
        public static string _ac = ConfigurationManager.AppSettings["FiboSMSAccount"];
        public static string _pa = ConfigurationManager.AppSettings["FiboSMSPassword"];
        public static string _em = ConfigurationManager.AppSettings["EmailCOD"];
        public static string _sac = ConfigurationManager.AppSettings["SMTP_USERNAME"];
        public static string _spa = ConfigurationManager.AppSettings["SMTP_PASSWORD"];
        public static string _ho = ConfigurationManager.AppSettings["HOSTEmail"];
        //for Account
        public static string SendSMS(string toPhoneNumber, string smsContent)
        {
            string result = "";
            try
            {
                ServiceSMS.ServiceSoapClient client = new ServiceSMS.ServiceSoapClient("ServiceSoap");
                client.SendSMS(_ac, _pa, toPhoneNumber, StripVietnameseSigns(smsContent), "HK", 5603);
            }
            catch (Exception ex)
            {
                result = ex.Message.ToString();
            }
            return result;
        }

        public static string _sentETicketBms(string[] h, string toEmail, string filepath)
        {
            string sb = "";
            try
            {
                if (h.Length >= 13)
                {
                    string path = System.Web.HttpContext.Current.Server.MapPath("Files/Template/" + filepath);
                    var emailContent = GetViewAsString(h, path);
                    SendSESMail("Đặt chỗ thành công tại VeXeRe.com - Mã đặt vé " + h[0], emailContent, toEmail, "");
                }
            }
            catch (Exception ex)
            {
                sb = ex.Message;
            }
            return sb;
        }
        public static string GetViewAsString(string[] h, string filePath)
        {
            string st = "";
            string pageSource = File.ReadAllText(filePath);
            StringBuilder temp = new StringBuilder(pageSource);
            string a = h[0].ToString();
            temp.Replace("<%BookingCode%>", a);
            temp.Replace("<%DepartureTime%>", h[1].ToString());
            temp.Replace("<%OperatorName%>", h[2].ToString());
            temp.Replace("<%RouteName%>", h[3].ToString());
            temp.Replace("<%FromStopName%>", h[4].ToString());
            temp.Replace("<%ToStopName%>", h[5].ToString());
            temp.Replace("<%DepartureDate%>", h[6].ToString());
            temp.Replace("<%DepartureTime%>", h[7].ToString());
            temp.Replace("<%BookingSeats%>", h[8].ToString());
            temp.Replace("<%FarePerPeople%>", h[9].ToString());
            temp.Replace("<%ExpectedTotalFare%>", h[10].ToString());
            temp.Replace("<%CustomerFirstName%>", h[11].ToString());
            temp.Replace("<%CustomerPhone%>", h[12].ToString());
            temp.Replace("<%DateTimeNow%>", h[13].ToString());

            return temp.ToString();
            //var assembly = Assembly.GetExecutingAssembly();
            //htmlStream = assembly.GetManifestResourceStream(filePath);
            //var reader = new StreamReader(htmlStream);
            //var body = reader
            //    .ReadToEnd()
            //.Replace("<%BookingCode%>", h[0].ToString())
            // .Replace("<%DepartureTime%>", h[1].ToString())
            // .Replace("<%OperatorName%>", h[2].ToString())
            // .Replace("<%RouteName%>", h[3].ToString())
            // .Replace("<%FromStopName%>", h[4].ToString())
            // .Replace("<%ToStopName%>", h[5].ToString())
            // .Replace("<%DepartureTime%>", h[6].ToString())
            // .Replace("<%DepartureTime%>", h[7].ToString())
            // .Replace("<%BookingSeats%>", h[8].ToString())
            // .Replace("<%FarePerPeople%>", h[9].ToString())
            // .Replace("<%ExpectedTotalFare%>", h[10].ToString())
            // .Replace("<%CustomerFirstName%>", h[11].ToString())
            // .Replace("<%CustomerPhone%>", h[12].ToString())
            // .Replace("<%DateTimeNow%>", h[13].ToString());

            //return body.ToString();
        }
        public static bool SendSESMail(string subject, string body, string email, string replyTo = null,
            HttpPostedFileBase attachment = null)
        {
            bool result = true;
            string FROM = _em;
            // Replace with your "From" address. This address must be verified.
            //const String TO = "nphivu414@gmail.com";  // Replace with a "To" address. If you have not yet requested
            // production access, this address must be verified.
            //const String SUBJECT = "Amazon SES test (SMTP interface accessed using C#)";
            //const String BODY = "This email was sent through the Amazon SES SMTP interface by using C#.";
            // Supply your SMTP credentials below. Note that your SMTP credentials are different from your AWS credentials.
            string SMTP_USERNAME = _sac; // Replace with your SMTP username. 
            string SMTP_PASSWORD = _spa;
            // Replace with your SMTP password.
            // Amazon SES SMTP host name. This example uses the us-west-2 region.
            string HOST = _ho;
            // Port we will connect to on the Amazon SES SMTP endpoint. We are choosing port 587 because we will use
            // STARTTLS to encrypt the connection.
            const int PORT = 587;
            // Create an SMTP client with the specified host name and port.
            using (SmtpClient client = new SmtpClient(HOST, PORT))
            {
                // Create a network credential with your SMTP user name and password.
                client.Credentials = new NetworkCredential(SMTP_USERNAME, SMTP_PASSWORD);
                // Use SSL when accessing Amazon SES. The SMTP session will begin on an unencrypted connection, and then 
                // the client will issue a STARTTLS command to upgrade to an encrypted connection using SSL.
                client.EnableSsl = true;
                // Send the email. 
                try
                {
                    var mail = new MailMessage();
                    mail.From = new MailAddress(FROM);
                    mail.To.Add(email);
                    mail.Subject = subject;
                    mail.Body = body;
                    mail.IsBodyHtml = true;
                    //Console.WriteLine("Attempting to send an email through the Amazon SES SMTP interface...");
                    client.Send(mail);
                    //Console.WriteLine("Email sent!");
                }
                catch (Exception ex)
                {
                    result = false;
                }
            }
            return result;
        }
        public static string StripVietnameseSigns(string str)
        {
            string strFormD = str.Normalize(NormalizationForm.FormD);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < strFormD.Length; i++)
            {
                System.Globalization.UnicodeCategory uc =
                System.Globalization.CharUnicodeInfo.GetUnicodeCategory(strFormD[i]);
                if (uc != System.Globalization.UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(strFormD[i]);
                }
            }
            sb = sb.Replace('Đ', 'D');
            sb = sb.Replace('đ', 'd');
            return (sb.ToString().Normalize(NormalizationForm.FormD));
        }
    }
}
