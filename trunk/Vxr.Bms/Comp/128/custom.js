//Extend dict
define({
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 0, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
    _uForm: [
        "UpdateForm",
        [
            [1, 1, "", "input", "hidden", "IdInfo", "", "", "", {}, [], ""], //row, col, label, element, type, name, class, default value, attributes, options, icon, merge
            [1, 1, "", "input", "hidden", "CustomerInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "StatusInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "CustomerId", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "NumSeat", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "pIndex", "", "", {}, [], ""],
            //[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
            [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
            [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
            [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
            [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [6, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [6, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [6, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [6, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
            [6, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [6, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
            [6, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
            [7, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
    ],
    _frule: [
        [["UpdateForm", ["Serial", "RoundTripCode", "FromArea", "ToArea"]], ["ValidForm", ["PassCode"]]],
        [
            [1, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]],
            [2, [["UpdateForm", ["KeepOnTime", "Fare", "PaymentType", "BranchName", "ChargeCode", "DriverName"]], ["ValidForm", ["PassCode"]]]],
            [3, [["UpdateForm", ["PhoneNumbers", "FullName", "PickupInfo", "TransferInfo", "Fare", "Surcharge", "PaymentType", "Serial", "Note", "KeepOnTime", "BranchName", "ChargeCode", "DriverName"]], ["ValidForm", ["PassCode"]]]],
            [5, [["UpdateForm", ["KeepOnTime", "PaymentType", "Fare"]]]],
            [8, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]]
        ]
    ], //Multiple ticket, status of ticket, not same value		
    _pTplNumCoach: 1,
    _pStyleUrl: "/Comp/128/print.css?v=1.0.3",
    //_pTitleTpl: "<table class='print-title'><tbody><tr><td><strong class='rname'>{p._rname}</strong></td><td colspan='2'>Tài xế:&nbsp;{p._driverName}</td></tr><tr><td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Số xe:&nbsp{p._busNum}</td><td>Phụ xe: {p._assistantName}</td></tr></tbody></table>",
    _hasPickUpOnPrintBKS: false,
    //_onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
            + "<tbody>"
            + "<tr style='height: 18px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported} {pseat._onlyPaidBackGround}'><b>{pseat._cphone}</b></p></td></tr>"
            + "<tr><td><p class='pcname {pseat._dathanhtoan}'>{pseat._pmInfo}</p><p style='text-align:right;width:75%;float:right;height:16px;font-size:12.5px;white-space:nowrap;'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></span></p><p class='pnote'>{pseat._note}</p></td></tr>"
            + "</tbody>"
            + "</table></li>",
});
