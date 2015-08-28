using System;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.PhantomJS;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Support.UI;
using SimpleBrowser.WebDriver;

namespace SeleniumTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {

            //var options = new ChromeOptions();
            //var service = ChromeDriverService.CreateDefaultService(@"F:\Download\chromedriver_win32");
            //service.SuppressInitialDiagnosticInformation = true;
            //IWebDriver driver = new ChromeDriver(service, options);
            IWebDriver driver = new ChromeDriver();
            driver.Navigate().GoToUrl("https://www.mobifone.com.vn/portal/vn/users/login.jsp");
            driver.FindElement(By.Id("txtPhoneNo")).SendKeys("0909621499");
            driver.FindElement(By.Id("txtPassWord")).SendKeys("vexere123");
            driver.FindElement(By.Id("txtPassWord")).SendKeys(Keys.Enter);
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(2));
            wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("taikhoan-cuatoi")));
            driver.Navigate().GoToUrl("https://www.mobifone.com.vn/portal/vn/sms/index.jsp");
            var wait2 = new WebDriverWait(driver, TimeSpan.FromSeconds(2));
            wait2.Until(ExpectedConditions.ElementExists(By.Id("phonenumID")));
            driver.FindElement(By.Id("message")).SendKeys("abcdef ghi");
            driver.FindElement(By.Id("phonenumID")).SendKeys("01677676021");
            driver.FindElement(By.Id("phonenumID")).SendKeys(Keys.Enter);
            driver.Quit();
        }
    }
}
