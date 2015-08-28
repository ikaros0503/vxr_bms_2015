using System;
using System.Configuration;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace MobifoneSms
{
    public class QueueReader
    {
        private const int MaxQueue = 5;

        public static void Read()
        {
            try
            {
                var factory = new ConnectionFactory() { HostName = "localhost" };
                using (var connection = factory.CreateConnection())
                {
                    using (var channel = connection.CreateModel())
                    {
                        channel.QueueDeclare("MobifoneSms", false, false, false, null);
                        var consumer = new QueueingBasicConsumer(channel);
                        channel.BasicConsume("MobifoneSms", true, consumer);
                        int count = 0;
                        while (true)
                        {
                            try
                            {
                                var ea = (BasicDeliverEventArgs)consumer.Queue.Dequeue();
                                var body = ea.Body;
                                var message = Encoding.UTF8.GetString(body);
                                message = message.Trim();
                                if (message.Length > 0) SendMobifoneSms(message);

                                count++;
                                if (count >= MaxQueue) break;
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine("ERROR: " + ex);
                                break;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR: " + ex);
            }
        }

        public static void SendMobifoneSms(string input)
        {
            try
            {
                var phones = string.Empty;
                var message = string.Empty;
                var ttPhone = ConfigurationManager.AppSettings["ThuanTienPhone"];
                var ttPass = ConfigurationManager.AppSettings["ThuanTienPass"];
                var loginUrl = ConfigurationManager.AppSettings["MobifoneLoginUrl"];
                var usernameElmId = ConfigurationManager.AppSettings["UsernameElementId"];
                var passwordElmId = ConfigurationManager.AppSettings["PasswordElementId"];
                var smsUrl = ConfigurationManager.AppSettings["MobifoneSmsUrl"];
                var phoneElmId = ConfigurationManager.AppSettings["PhoneElementId"];
                var messElmId = ConfigurationManager.AppSettings["MessageElementId"];

                if (input.IndexOf("#|#", StringComparison.Ordinal) != -1)
                {
                    var spl = input.Split(new[] { "#|#" }, StringSplitOptions.None);
                    phones = spl[0];
                    message = spl[1];
                }
                Console.WriteLine("--------------------He thong tu dong gui SMS Mobifone--------------------");
                Console.WriteLine("- SDT: " + phones);
                Console.WriteLine("- Noi dung: " + message);
                var options = new ChromeOptions();
                var service = ChromeDriverService.CreateDefaultService(@"C:\inetpub\wwwroot");
                service.SuppressInitialDiagnosticInformation = true;
                IWebDriver driver = new ChromeDriver(service, options);
                driver.Navigate().GoToUrl(loginUrl);
                var wait2 = new WebDriverWait(driver, TimeSpan.FromSeconds(2));
                wait2.Until(ExpectedConditions.ElementExists(By.Id(usernameElmId)));
                driver.FindElement(By.Id(usernameElmId)).SendKeys(ttPhone);
                driver.FindElement(By.Id(passwordElmId)).SendKeys(ttPass);
                driver.FindElement(By.Id(passwordElmId)).SendKeys(Keys.Enter);
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(2));
                wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("taikhoan-cuatoi")));
                driver.Navigate().GoToUrl(smsUrl);
                var wait3 = new WebDriverWait(driver, TimeSpan.FromSeconds(2));
                wait3.Until(ExpectedConditions.ElementExists(By.Id(phoneElmId)));
                driver.FindElement(By.Id(messElmId)).SendKeys(message);
                driver.FindElement(By.Id(phoneElmId)).SendKeys(phones);
                driver.FindElement(By.Id(phoneElmId)).SendKeys(Keys.Enter);
                driver.Quit();
                Console.WriteLine("-------------------------Gui tin nhan thanh cong-------------------------");
                Console.WriteLine("\n");
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR: " + ex);
            }

        }
    }
}
