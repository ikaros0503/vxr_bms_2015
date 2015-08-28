using System.Collections.Generic;

namespace Vxr.Bms.Bu.Dic
{
    public class DR
    {
        // 0:method, 1:table key, 2:view key, 3:table, 4:view, 5:main function 
        public static Dictionary<string, string[]> _a = new Dictionary<string, string[]>  { 
		//Account
		//{"pGetAccount"     , new[]{"P", "0", "0" ,"Account", "zgcl_Account02", "Account"}},
		{"pGetAccount"     , new[]{"P", "1" , "Report1", "pGetAccount", "BÁO CÁO CHI TIẾT"}},
		{"pGetAccount1"     , new[]{"P", "1" , "Report1", "pGetAccount1", "BÁO CÁO CHI TIẾT"}},
		{"test1"            , new[]{"E", "1" , "Report2", "test1", "BÁO CÁO CHI TIẾT "}},
		{"test2"            , new[]{"E", "1" , "Report2", "test2", "BÁO CÁO CHI TIẾT "}},
		{"phongVeTheoNgay"  , new[]{"E", "1" , "Report2", "phongVeTheoNgay", "BÁO CÁO PHÒNG VÉ THEO NGÀY "}},
		//{"rp7"  , new[]{"E", "1" , "Report2", "rp", "BÁO CÁO DOANH THU PHONG VÉ THEO NGÀY "}},
        {"rp1"  , new[]{"E", "1" , "Report2", "rp1", "DANH SÁCH KHÁCH HÀNG THEO CHUYẾN BÁN VÉ" }},
        {"rp2"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU CỦA NHÂN VIÊN THEO NGÀY "}},
		{"rp3"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU CỦA PHÒNG VÉ THEO NGÀY "}},
        {"rp4"  , new[]{"E", "1" , "Report2", "rp4", "DOANH THU BÁN VÉ CỦA NHÂN VIÊN TRONG NGÀY "}},
		{"rp5"  , new[]{"E", "1" , "Report2", "rp5", "DOANH THU BÁN VÉ CỦA NHÂN VIÊN THEO VĂN PHÒNG "}},
        {"rp6"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU THEO CHUYẾN"}},
		{"rp7"  , new[]{"E", "1" , "Report2", "rp7", "DOANH THU THEO TUYẾN "}},
		{"rp8"  , new[]{"E", "1" , "Report2", "rp8", "DOANH THU PHÒNG VÉ THEO TUYẾN "}},
		{"rp9"  , new[]{"E", "1" , "Report2", "rp9", "DOANH THU PHÒNG VÉ THEO CHUYẾN XE "}},
        {"rp11"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU CỦA PHÒNG VÉ THEO NGÀY "}},
        {"rp12"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU ĐẠI LÝ THEO NGÀY "}},
        {"rp13"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU BÁN VÉ ONLINE "}},

        //
        {"rpCustomerByTrip"  , new[]{"E", "1" , "Report2", "rp", "DANH SÁCH KHÁCH HÀNG THEO CHUYẾN" }},
        {"rpStaffBySoldDate"  , new[]{"E", "1" , "Report2", "rp", "SỐ TIỀN NHÂN VIÊN THU ĐƯỢC HÀNG NGÀY"}},
        {"rpStaffByPickupDate"  , new[]{"E", "1" , "Report2", "rp", "SỐ TIỀN NHÂN VIÊN THU TÍNH THEO NGÀY KHỞI HÀNH"}},
        {"rpBranchBySoldDate"  , new[]{"E", "1" , "Report2", "rp", "SỐ TIỀN VĂN PHÒNG/ĐẠI LÝ THU ĐƯỢC HÀNG NGÀY"}},
        {"rpBranchByPickupDate"  , new[]{"E", "1" , "Report2", "rp", "SỐ TIỀN VĂN PHÒNG/ĐẠI LÝ THU THEO NGÀY KHỞI HÀNH"}},
        {"rpRevenueByTrip"  , new[]{"E", "1" , "Report2", "rp", "SỐ TIỀN THU TÍNH THEO CHUYẾN"}},
        {"rpRevenueByRoute"  , new[]{"E", "1" , "Report2", "rp", "SỐ TIỀN THU TÍNH THEO TUYẾN"}},
        //{"rpBranchByRoute"  , new[]{"E", "1" , "Report2", "rp8", "SỐ TIỀN VĂN PHÒNG/ĐẠI LÝ THU TÍNH THEO TUYẾN"}},
        {"rpBranchByRoute"  , new[]{"E", "1" , "Report2", "rp", "SỐ TIỀN VĂN PHÒNG/ĐẠI LÝ THU TÍNH THEO TUYẾN"}},
        {"rpVexereRevenue"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU VEXERE "}},
        {"rpVexere"  , new[]{"E", "1" , "Report2", "rp", "VÉ BÁN CỦA VEXERE"}},
        {"rpRevenueByCreatedUser"  , new[]{"E", "1" , "Report2", "rp", "DOANH THU NHÂN VIÊN THEO NGƯỜI ĐẶT"}},
	};
        //[int: 1; float: 2; string: 4; date: 5; bool: 3] [0:type, 1:isnull, 2:key, 3:fkey, 4:length, 5:ftable, 6:fId, 7:Name]
        public static Dictionary<int, string[][]> _fd = new Dictionary<int, string[][]> { 
		{1, new [] {  //Ticket - 52 columns  
			 new []{ "1", "0", "1", "", "4", "", "", "Id" },
			 new []{ "1", "1", "0", "Id", "4", "Trip", "Id", "TripId" },
			 new []{ "1", "1", "0", "Id", "4", "Company", "Id", "AgentId" },
			 new []{ "1", "1", "0", "Id", "4", "Event", "Id", "EventId" },
			 new []{ "1", "1", "0", "Id", "4", "Person", "Id", "CustomerId" },
			 new []{ "1", "1", "0", "", "4", "", "", "Type" },
			 new []{ "4", "1", "0", "", "64", "", "", "Code" },
			 new []{ "4", "1", "0", "", "1024", "", "", "Serial" },
			 new []{ "4", "1", "0", "", "64", "", "", "PassCode" },
			 new []{ "4", "1", "0", "", "64", "", "", "RoundTripCode" },
			 new []{ "1", "1", "0", "", "4", "", "", "TripAlias" },
			 new []{ "5", "1", "0", "", "8", "", "", "TripDate" },
			 new []{ "4", "1", "0", "", "64", "", "", "TripTime" },
			 new []{ "4", "1", "0", "", "256", "", "", "FromArea" },
			 new []{ "4", "1", "0", "", "256", "", "", "ToArea" },
			 new []{ "4", "1", "0", "", "64", "", "", "SeatCode" },
			 new []{ "5", "1", "0", "", "8", "", "", "IssueDate" },
			 new []{ "5", "1", "0", "", "8", "", "", "PickupDate" },
			 new []{ "4", "1", "0", "", "-1", "", "", "CallerInfo" },
			 new []{ "4", "1", "0", "", "1024", "", "", "AgentInfo" },
			 new []{ "4", "1", "0", "", "1024", "", "", "CustomerInfo" },
			 new []{ "4", "1", "0", "", "1024", "", "", "UserCharge" },
			 new []{ "4", "1", "0", "", "-1", "", "", "PickupInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "DropOffInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "PaymentInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "TransactionInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "NotificationInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "DeliveryInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "FacilityInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "IssueInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "Keywords" },
			 new []{ "1", "1", "0", "", "4", "", "", "Status" },
			 new []{ "4", "1", "0", "", "-1", "", "", "Note" },
			 new []{ "4", "1", "0", "", "9", "", "", "Fare" },
			 new []{ "4", "1", "0", "", "9", "", "", "Debt" },
			 new []{ "4", "1", "0", "", "9", "", "", "Refund" },
			 new []{ "4", "1", "0", "", "9", "", "", "Deposit" },
			 new []{ "4", "1", "0", "", "9", "", "", "Discount" },
			 new []{ "4", "1", "0", "", "9", "", "", "Surcharge" },
			 new []{ "4", "1", "0", "", "9", "", "", "CancelFee" },
			 new []{ "4", "1", "0", "", "9", "", "", "Commission" },
			 new []{ "4", "1", "0", "", "-1", "", "", "Info" },
			 new []{ "4", "1", "0", "", "256", "", "", "CreatedUser" },
			 new []{ "4", "1", "0", "", "256", "", "", "IssuedUser" },
			 new []{ "1", "1", "0", "", "4", "", "", "IsPrgStatus" },
			 new []{ "4", "1", "0", "", "-1", "", "", "IsPrgPartComp" },
			 new []{ "4", "1", "0", "", "-1", "", "", "IsPrgHistoryInfo" },
			 new []{ "5", "1", "0", "", "8", "", "", "IsPrgCreatedDate" },
			 new []{ "5", "1", "0", "", "8", "", "", "IsPrgUpdatedDate" },
			 new []{ "4", "1", "0", "", "-1", "", "", "IsPrgUnsignKeywords" },
			 new []{ "5", "1", "0", "", "8", "", "", "FromValid" },
			 new []{ "5", "1", "0", "", "8", "", "", "ToValid" },
			 new []{ "1", "1", "0", "Id", "4", "Company", "Id", "CompId" },
		}},
		{14, new [] {  //Trip - 47 columns  
			 new []{ "1", "0", "1", "", "4", "", "", "Id" },
			 new []{ "1", "1", "0", "Id", "4", "Company", "Id", "CompId" },
			 new []{ "1", "1", "0", "Id", "4", "Person", "Id", "OwnerId" },
			 new []{ "1", "1", "0", "Id", "4", "Trip", "Id", "BaseId" },
			 new []{ "1", "1", "0", "Id", "4", "Vehicle", "Id", "VehicleId" },
			 new []{ "1", "1", "0", "Id", "4", "Event", "Id", "EventId" },
			 new []{ "1", "1", "0", "", "4", "", "", "Type" },
			 new []{ "4", "1", "0", "", "64", "", "", "Code" },
			 new []{ "4", "1", "0", "", "512", "", "", "Name" },
			 new []{ "1", "1", "0", "", "4", "", "", "Alias" },
			 new []{ "5", "1", "0", "", "8", "", "", "Date" },
			 new []{ "4", "1", "0", "", "64", "", "", "Time" },
			 new []{ "4", "1", "0", "", "256", "", "", "FromArea" },
			 new []{ "4", "1", "0", "", "256", "", "", "ToArea" },
			 new []{ "4", "1", "0", "", "-1", "", "", "FareInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "FacilityInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "SeatTemplateInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "ExtendedSeatsInfo" },
			 new []{ "1", "1", "0", "", "4", "", "", "TotalSeats" },
			 new []{ "1", "1", "0", "", "4", "", "", "TotalExtendedSeats" },
			 new []{ "1", "1", "0", "", "4", "", "", "SeatSummaryInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "PickedPointsInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "SeatFacilityInfo" },
			 new []{ "4", "1", "0", "", "128", "", "", "LicensePlate" },
			 new []{ "1", "1", "0", "", "4", "", "", "StatusInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "TeamInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "FeeInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "PayInfo" },
			 new []{ "1", "1", "0", "", "8", "", "", "RevenuesInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "RightsInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "SeatPolicyInfo" },
			 new []{ "4", "1", "0", "", "-1", "", "", "VehicleInfo" },
			 new []{ "5", "1", "0", "", "8", "", "", "DepartureTime" },
			 new []{ "5", "1", "0", "", "8", "", "", "RealDepartureTime" },
			 new []{ "5", "1", "0", "", "8", "", "", "FinishDate" },
			 new []{ "4", "1", "0", "", "-1", "", "", "OwnerInfo" },
			 new []{ "4", "1", "0", "", "9", "", "", "TotalFee" },
			 new []{ "9", "1", "0", "", "1", "", "", "IsVeXeReFull" },
			 new []{ "4", "1", "0", "", "-1", "", "", "Keywords" },
			 new []{ "4", "1", "0", "", "-1", "", "", "Note" },
			 new []{ "4", "1", "0", "", "-1", "", "", "Info" },
			 new []{ "1", "1", "0", "", "4", "", "", "IsPrgStatus" },
			 new []{ "4", "1", "0", "", "-1", "", "", "IsPrgPartComp" },
			 new []{ "4", "1", "0", "", "-1", "", "", "IsPrgHistoryInfo" },
			 new []{ "5", "1", "0", "", "8", "", "", "IsPrgCreatedDate" },
			 new []{ "5", "1", "0", "", "8", "", "", "IsPrgUpdatedDate" },
			 new []{ "4", "1", "0", "", "-1", "", "", "IsPrgUnsignKeywords" },
		}},
		
	};

        public static Dictionary<int, string> _h = new Dictionary<int, string>
        {
            {1, "<table class=\"rptprintBodyTable\" width=\"100%\">"
                        + "<tr>"
                        + "<td colspan=\"2\" style='font-size:12px;'> &nbsp;</td>"
                        + "</tr>"
                        + "<tr>"
                        + "<tr>"
                        //+ "<td width=\"500px\"align=\"center\" ><span style='font-weight:bold;font-size:18px;'> {2} </span>  </br><span style='font-size:12px;'>Điện thoại: <strong>{3}</strong> &nbsp;Địa chỉ: {4}</br></span></td>"
                        + "<td></td>"
                        + "</tr>"
                        + "<tr>"
                        + "<tr>"
                        + "<td align=\"center\" colspan=\"2\" width=\"400px\"><h3 style=\"font-size: 24px;text-align: center;\">{0}<br>"
						+ "<small style=\"font-size: 65%;color: #777;font-weight: normal;line-height: 1;\">{1} </small></h3>"
                        + "</td>"
                        + "</tr>"
                        + "<tr>"
                        + "<td colspan=\"2\" style='font-size:12px;'></td>"
                        + "</tr>"
                        + "</table>"},
        };
        public static Dictionary<int, string> _f = new Dictionary<int, string>
        {
            {1, "<table class=\"rptprintBodyTable\" width=\"100%\">"
                        + " <tr><td class=\"dhu_rpt_tpl_KTSS_Footer4\" style=\"width: 25%;\">"
						+ "<h4 style=\"color: inherit;font-family: inherit;font-weight: 500;line-height: 1.1;font-size: 18px;\">Người lập phiếu<br>"
						+ "<small style=\"font-size: 65%;color: #777;font-weight: normal;line-height: 1;\">(Ký, họ tên)</small></h4></td> "
						+ "<td class=\"dhu_rpt_tpl_KTSS_Footer4\" style=\"width: 25%;\">"
						+ "<h4 style=\"color: inherit;font-family: inherit;font-weight: 500;line-height: 1.1;font-size: 18px;\">Kế toán<br>"
						+ "<small style=\"font-size: 65%;color: #777;font-weight: normal;line-height: 1;\">(Ký, họ tên)</small></h4></td> "
						+ "<td class=\"dhu_rpt_tpl_KTSS_Footer4\" style=\"width: 25%;\">"
						+ "<h4 style=\"color: inherit;font-family: inherit;font-weight: 500;line-height: 1.1;font-size: 18px;\">Thủ quỹ<br>"
						+ "<small style=\"font-size: 65%;color: #777;font-weight: normal;line-height: 1;\">(Ký, họ tên)</small></h4></td> "
						+ "<td class=\"dhu_rpt_tpl_KTSS_Footer4\" style=\"width: 25%;\">"
						+ "<h4 style=\"color: inherit;font-family: inherit;font-weight: 500;line-height: 1.1;font-size: 18px;\">Quản lý<br>"
						+ "<small style=\"font-size: 65%;color: #777;font-weight: normal;line-height: 1;\">(Ký, họ tên)</small></h4></td> "
                        + "  </tr>"
                        + "</table>"}
        };
    }
}
