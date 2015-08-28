using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Vxr.Bms.Bu.Dic;
using Vxr.Bms.Core;

namespace Vxr.Bms.Bu
{
    // ReSharper disable InconsistentNaming
    public class P
    {
        public static bool IsDebug = (ConfigurationManager.AppSettings["isDebug"] == "1");
        public static string _cs = ConfigurationManager.AppSettings["cs"];
        //for Account
        public static void Account(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("Type").Pc("PersonId").Pc("Username").Pc("Password").Pc("Keywords").Pc("Role").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("AgentId").Pc("CompIdType").Pc("CompIdCode").Pc("CompIdName").Pc("CompIdFullName").Pc("PersonIdFullName").Pc("AgentIdType").Pc("AgentIdCode").Pc("AgentIdName").Pc("AgentIdFullName").Pc("CompIdUIConfigInfo").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for Company
        public static void Company(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Code").Pc("FullName").Pc("Name").Pc("Birthday").Pc("AddressInfo").Pc("PhoneInfo").Pc("FaxInfo").Pc("EmailInfo").Pc("AgentInfo").Pc("UIConfigInfo").Pc("DepartmentInfo").Pc("BankAccountInfo").Pc("WebsiteInfo").Pc("ImageInfo").Pc("URLInfo").Pc("OwnerInfo").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("BaseId").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")
                .Pc("HasOnlineContract").Pc("HasOfflineContract")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        public static void Discount(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("XCompanyId").Pc("XTripId").Pc("XStatus").Pc("XDate").Pc("ZDate").Pc("XValue")
                .Pc("IsPrgCDate").Pc("IsPrgUDate")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void CompanyCS(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Code").Pc("FullName").Pc("Name").Pc("Birthday").Pc("AddressInfo").Pc("PhoneInfo").Pc("FaxInfo").Pc("EmailInfo").Pc("AgentInfo").Pc("UIConfigInfo").Pc("DepartmentInfo").Pc("BankAccountInfo").Pc("WebsiteInfo").Pc("ImageInfo").Pc("URLInfo").Pc("OwnerInfo").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("BaseId").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }
        //for Contract
        public static void Contract(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("FromCompId").Pc("ToCompId").Pc("FromPersonId").Pc("ToPersonId").Pc("Type").Pc("Code").Pc("Name").Pc("TradeInfo").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for Event
        public static void Event(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("PersonId").Pc("Type").Pc("FromDate").Pc("ToDate").Pc("Time").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for gcDesc
        public static void gcDesc(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("name").Pc("length").Pc("crdate").Pc("xprec").Pc("xscale").Pc("colid").Pc("status").Pc("isnullable").Pc("colorder").Pc("typename").Pc("xtype").Pc("tablename").Pc("tableid").Pc("fkeyid").Pc("ftable").Pc("fcolname").Pc("PrimaryKey").Pc("descript").Pc("isIdentify")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for gcDesc_TO
        public static void gcDesc_TO(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("tablename").Pc("rorder").Pc("objname").Pc("GroupName").Pc("NumChild").Pc("TableChild")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for gcGOBALsysuserGcDescription
        public static void gcGOBALsysuserGcDescription(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("tablename").Pc("objname").Pc("descript")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for gcUserView
        public static void gcUserView(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("name").Pc("length").Pc("xprec").Pc("xscale").Pc("colid").Pc("status").Pc("isnullable").Pc("colorder").Pc("typename").Pc("tblname").Pc("id").Pc("xtype")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for Person
        public static void Person(object obj, out object oo)
        {
            var x = new X(obj);
            X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Code").Pc("Gender").Pc("FullName").Pc("Birthday").Pc("AddressInfo").Pc("PhoneInfo").Pc("FaxInfo").Pc("EmailInfo").Pc("ImageInfo").Pc("LicenseInfo").Pc("WebsiteInfo").Pc("BankAccountInfo").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("CompId").Pc("AgentId").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for ReportDetail
        public static void ReportDetail(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("ReportId").Pc("TableName").Pc("ColName").Pc("FormName").Pc("IsShow").Pc("ColType").Pc("OrderCol").Pc("Parent").Pc("ChildNode").Pc("ColTypeInt").Pc("iNotFillData").Pc("Keep01").Pc("Keep02").Pc("Keep03").Pc("Keep04").Pc("Space01").Pc("Space02").Pc("Space03").Pc("SpaceId").Pc("isPrgAccountId").Pc("isPrgInUse").Pc("isPrgCreateDate").Pc("isPrgWaitingConfirmStatus").Pc("isPrgbAdminDeleted").Pc("isPrgbUserDeleted").Pc("isPrgbShow").Pc("isPrgOrdered").Pc("isPrgVNKoDau").Pc("isPrgSmField").Pc("isPrgPartComp").Pc("isPrgEncriptData").Pc("isPrgDescriptData").Pc("isPrgAccountUpdateId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for Resource
        public static void Resource(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("Type").Pc("Code").Pc("Name").Pc("ImageInfo").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for sysdiagrams
        public static void sysdiagrams(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("name").Pc("principal_id").Pc("diagram_id").Pc("version").Pc("definition")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for TestData
        public static void TestData(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("PK").Pc("Dummy")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        //for Ticket
        public static void Ticket(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TripId").Pc("AgentId").Pc("EventId").Pc("CustomerId").Pc("Type").Pc("Code").Pc("Serial").Pc("PassCode").Pc("RoundTripCode").Pc("TripAlias").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("SeatCode").Pc("IssueDate").Pc("PickupDate").Pc("CallerInfo").Pc("AgentInfo").Pc("CustomerInfo").Pc("UserCharge").Pc("PickupInfo").Pc("DropOffInfo").Pc("PaymentInfo").Pc("TransactionInfo").Pc("NotificationInfo").Pc("DeliveryInfo").Pc("FacilityInfo").Pc("IssueInfo").Pc("Keywords").Pc("Status").Pc("Note").Pc("Fare").Pc("Debt").Pc("Refund").Pc("Deposit").Pc("Discount").Pc("Surcharge").Pc("CancelFee").Pc("Commission").Pc("Info").Pc("CreatedUser").Pc("IssuedUser").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("FromValid").Pc("ToValid").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("CompId").Pc("ChargeDate").Pc("SeatType").Pc("CancelInfo").Pc("CancelType").Pc("CanceledDate").Pc("CanceledAgentId").Pc("CanceledUser")
                .Pc("BookingCode").Pc("DiscountType").Pc("FinalPrice")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void Ticket1(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TripId").Pc("AgentId").Pc("EventId").Pc("CustomerId").Pc("Type").Pc("Code").Pc("Serial").Pc("PassCode").Pc("RoundTripCode").Pc("TripAlias").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("SeatCode").Pc("IssueDate").Pc("PickupDate").Pc("CallerInfo").Pc("AgentInfo").Pc("CustomerInfo").Pc("UserCharge").Pc("PickupInfo").Pc("DropOffInfo").Pc("PaymentInfo").Pc("TransactionInfo").Pc("NotificationInfo").Pc("DeliveryInfo").Pc("FacilityInfo").Pc("IssueInfo").Pc("Keywords").Pc("Status").Pc("Note").Pc("Fare").Pc("Debt").Pc("Refund").Pc("Deposit").Pc("Discount").Pc("Surcharge").Pc("CancelFee").Pc("Commission").Pc("Info").Pc("CreatedUser").Pc("IssuedUser").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("FromValid").Pc("ToValid").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("CompId").Pc("ChargeDate").Pc("SeatType").Pc("CancelInfo").Pc("CancelType").Pc("CanceledDate").Pc("CanceledAgentId").Pc("CanceledUser")
                .Pc("BookingCode").Pc("DiscountType").Pc("FinalPrice")
                ._CR()._CF().L().S1().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        public static void TicketCS(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TripId").Pc("AgentId").Pc("EventId").Pc("CustomerId").Pc("Type").Pc("Code").Pc("Serial").Pc("PassCode").Pc("RoundTripCode").Pc("TripAlias").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("SeatCode").Pc("IssueDate").Pc("PickupDate").Pc("CallerInfo").Pc("AgentInfo").Pc("CustomerInfo").Pc("UserCharge").Pc("PickupInfo").Pc("DropOffInfo").Pc("PaymentInfo").Pc("TransactionInfo").Pc("NotificationInfo").Pc("DeliveryInfo").Pc("FacilityInfo").Pc("IssueInfo").Pc("Keywords").Pc("Status").Pc("Note").Pc("Fare").Pc("Debt").Pc("Refund").Pc("Deposit").Pc("Discount").Pc("Surcharge").Pc("CancelFee").Pc("Commission").Pc("Info").Pc("CreatedUser").Pc("IssuedUser").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("FromValid").Pc("ToValid").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("CompId").Pc("ChargeDate")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }
        public static void Product(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TripId").Pc("AgentId").Pc("EventId").Pc("CustomerId").Pc("Type").Pc("Code").Pc("Serial").Pc("PassCode").Pc("RoundTripCode").Pc("TripAlias").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("SeatCode").Pc("IssueDate").Pc("PickupDate").Pc("CallerInfo").Pc("AgentInfo").Pc("CustomerInfo").Pc("UserCharge").Pc("PickupInfo").Pc("DropOffInfo").Pc("PaymentInfo").Pc("TransactionInfo").Pc("NotificationInfo").Pc("DeliveryInfo").Pc("FacilityInfo").Pc("IssueInfo").Pc("Keywords").Pc("Status").Pc("Note").Pc("Fare").Pc("Debt").Pc("Refund").Pc("Deposit").Pc("Discount").Pc("Surcharge").Pc("CancelFee").Pc("Commission").Pc("Info").Pc("CreatedUser").Pc("IssuedUser").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("FromValid").Pc("ToValid").
                Pc("BaseId").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("AmountInfo").Pc("WidthInfo").Pc("HeightInfo").Pc("ColorInfo").Pc("CategoryInfo").Pc("ValueInfo").Pc("PropertyInfo").Pc("ReceivedUser").Pc("ReceivedAgentInfo").Pc("ReceivedAgentId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        public static void ProductOrder(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("TripId").Pc("AgentId").Pc("EventId").Pc("CustomerId").Pc("Type").Pc("Code").Pc("Serial").Pc("PassCode").Pc("RoundTripCode").Pc("TripAlias").Pc("TripDate").Pc("TripTime").Pc("FromArea").Pc("ToArea").Pc("SeatCode").Pc("IssueDate").Pc("PickupDate").Pc("CallerInfo").Pc("AgentInfo").Pc("CustomerInfo").Pc("UserCharge").Pc("PickupInfo").Pc("DropOffInfo").Pc("PaymentInfo").Pc("TransactionInfo").Pc("NotificationInfo").Pc("DeliveryInfo").Pc("FacilityInfo").Pc("IssueInfo").Pc("Keywords").Pc("Status").Pc("Note").Pc("Fare").Pc("Debt").Pc("Refund").Pc("Deposit").Pc("Discount").Pc("Surcharge").Pc("CancelFee").Pc("Commission").Pc("Info").Pc("CreatedUser").Pc("IssuedUser").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("FromValid").Pc("ToValid").
                Pc("BaseId").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("AmountInfo").Pc("WidthInfo").Pc("HeightInfo").Pc("ColorInfo").Pc("CategoryInfo").Pc("ValueInfo").Pc("PropertyInfo").Pc("ReceivedUser").Pc("ReceivedAgentInfo").Pc("ReceivedAgentId").Pc("CompId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        //for Trip
        public static void Trip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("OwnerId").Pc("BaseId").Pc("VehicleId").Pc("EventId").Pc("Type").Pc("Code").Pc("Name").Pc("Alias").Pc("Date").Pc("Time").Pc("FromArea").Pc("ToArea").Pc("FareInfo").Pc("FacilityInfo").Pc("SeatTemplateInfo").Pc("ExtendedSeatsInfo").Pc("TotalSeats").Pc("TotalExtendedSeats").Pc("SeatSummaryInfo").Pc("PickedPointsInfo").Pc("SeatFacilityInfo").Pc("LicensePlate").Pc("StatusInfo").Pc("TeamInfo").Pc("FeeInfo").Pc("PayInfo").Pc("RevenuesInfo").Pc("RightsInfo").Pc("SeatPolicyInfo").Pc("VehicleInfo").Pc("DepartureTime").Pc("RealDepartureTime").Pc("FinishDate").Pc("OwnerInfo").Pc("TotalFee").Pc("IsVeXeReFull").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("ClosedStatus").Pc("RouteId").Pc("FromId").Pc("ToId").Pc("DisplayOrder").Pc("Description")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void TripWithContractCondition(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("Type").Pc("IsPrgStatus").Pc("HasOnlineContract").Pc("HasOfflineContract")

                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        //For fares
        public static void Fares(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("Type").Pc("Name").Pc("Date").Pc("FareInfo").Pc("IsPrgStatus").Pc("NewFare").Pc("VxrFareInfo")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        public static void TripCS(object obj, out List<object[]> oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("OwnerId").Pc("BaseId").Pc("VehicleId").Pc("EventId").Pc("Type").Pc("Code").Pc("Name").Pc("Alias").Pc("Date").Pc("Time").Pc("FromArea").Pc("ToArea").Pc("FareInfo").Pc("FacilityInfo").Pc("SeatTemplateInfo").Pc("ExtendedSeatsInfo").Pc("TotalSeats").Pc("TotalExtendedSeats").Pc("SeatSummaryInfo").Pc("PickedPointsInfo").Pc("SeatFacilityInfo").Pc("LicensePlate").Pc("StatusInfo").Pc("TeamInfo").Pc("FeeInfo").Pc("PayInfo").Pc("RevenuesInfo").Pc("RightsInfo").Pc("SeatPolicyInfo").Pc("VehicleInfo").Pc("DepartureTime").Pc("RealDepartureTime").Pc("FinishDate").Pc("OwnerInfo").Pc("TotalFee").Pc("IsVeXeReFull").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").Pc("DisplayOrder").Pc("Description")._CR()._CF().L().S().EX().G();
            oo = r._e ? new List<object[]>() : r._d;
        }
        //for Vehicle
        public static void Vehicle(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("OwnerId").Pc("Code").Pc("Name").Pc("LimitTime").Pc("FrameNumber").Pc("MachineNumber").Pc("LicensePlate").Pc("Type").Pc("StatusInfo").Pc("ModelInfo").Pc("DriverInfo").Pc("RouteInfo").Pc("FacilityInfo").Pc("BorrowInfo").Pc("InsuranceInfo").Pc("ManufactureInfo").Pc("AccreditationInfo").Pc("SeatTemplateInfo").Pc("TotalSeats").Pc("Keywords").Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("MaintainDate").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        public static void Rights(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("AccId").Pc("BaseId").Pc("CompId").Pc("AgentId").
                Pc("App").Pc("Code").Pc("Type").Pc("Name").Pc("Selector").Pc("Keywords").Pc("RoleGroup").
                Pc("Note").Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").
                Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").
                Pc("CompIdName").Pc("AgentIdName").Pc("Username").Pc("BaseIdName").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void Customer(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Name").Pc("Note").Pc("Phone").
                Pc("BookingTicket").Pc("TotalBooking").Pc("PaidTicket").Pc("TotalPaid").Pc("CancelTicket").Pc("TotalCancel").
                Pc("NotComeTicket").Pc("TotalNotCome").Pc("PassTicket").Pc("TotalPass").Pc("OpenTicket").
                Pc("TotalOpen").Pc("ValidTicket").Pc("TotalValid").
                Pc("KeepOnTimeTicket").Pc("TotalKeepOnTime").Pc("TotalTicket").Pc("TotalMoney").Pc("LastedTripId").
                Pc("LastedTripDate").Pc("LastedTripTime").Pc("LastedTotalTicket").Pc("TotalProduct").Pc("TotalProductMoney").
                Pc("LastedProductTripId").Pc("LastedProductTripDate").Pc("LastedProductTripTime").Pc("LastedTotalProduct").
                Pc("TotalProductOrder").Pc("Email").Pc("VipInfo").Pc("Gender").
                Pc("FullName").Pc("Birthday").Pc("AddressInfo").Pc("PhoneInfo").
                Pc("FaxInfo").Pc("EmailInfo").Pc("ImageInfo").Pc("IssuedUser").
                Pc("WebsiteInfo").Pc("URLInfo").Pc("BankAccountInfo").Pc("LicenseInfo").
                Pc("FamilyInfo").Pc("UIConfigInfo").Pc("Info").Pc("Keywords").
                Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgHistoryInfo").Pc("IsPrgCreatedDate").
                Pc("IsPrgUpdatedDate").Pc("IsPrgUnsignKeywords").Pc("IsPrgLanguageInfo").Pc("IsPrgCreatedUserId").
                Pc("IsPrgUpdatedUserId").Pc("CompId").Pc("AgentId").Pc("PersonId")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }
        public static void CustomerTrip(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Name").Pc("Phone")
                .Pc("CompId").Pc("TripId").Pc("TripDate").Pc("CustomerId")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        public static void Area(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("Code").Pc("Name").Pc("Note").Pc("URLId").Pc("Landmark").Pc("Longitude").
                Pc("Latitude").Pc("PostalCode").Pc("URLId").Pc("UrlInfo").Pc("Introduction").Pc("ImageInfo").Pc("FacilityInfo").
                Pc("DisplayInfo").Pc("FeaturedInfo").Pc("ContactInfo").Pc("NeighbourInfo").Pc("Info").Pc("Keywords").Pc("IsPrgStatus").
                Pc("IsPrgPartComp").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate").Pc("IsPrgCreatedUserId").Pc("IsPrgUpdatedUserId").
                Pc("IsPrgUnsignKeywords").Pc("IsPrgLanguageInfo").Pc("IsPrgHistoryInfo").Pc("CompId").Pc("PersonId").Pc("AgentId").
                Pc("BaseId").Pc("Ward").Pc("City").
                _CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        public static void AccountFromTable(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("Type").Pc("CompId").Pc("PersonId").Pc("Username").Pc("Role").Pc("Note")
                .Pc("Info").Pc("IsPrgStatus").Pc("IsPrgPartComp").Pc("IsPrgCreatedDate").Pc("IsPrgUpdatedDate")
                .Pc("AgentId").Pc("RoleGroups")
                ._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

        // Log
        public static void Log(object obj, out object oo)
        {
            var x = new X(obj); X.Init(_cs, IsDebug, D._a, D._fd);
            var r = x.R().A().Pc("Id").Pc("CompId").Pc("Type").Pc("IsPrgStatus")._CR()._CF().L().S().EX().G();
            oo = new { Result = r._s, Records = r._d, TotalRecordCount = r._t, Message = r._m };
        }

    }
}
