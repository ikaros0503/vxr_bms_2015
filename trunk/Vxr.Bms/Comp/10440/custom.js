//Extend dict
define({
    _pStyleUrl: "/Comp/10440/print.css?v=1.0.3",
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
        [1, 1, "", "input", "hidden", "NumClick", "", "", {}, [], ""],
        [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
        [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
        [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
        [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
        [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
        [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
        [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
        //[5, 2, "Phụ thu", "input", "text", "Surcharge", "form-control vblue fw700", "", {}, [], "đ"],
        [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
       // [6, 2, "Đặt cọc", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "đ"],
        [8, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
        [8, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
        [8, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
        [8, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
        [8, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
        [8, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
        [8, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
        [9, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
        [9, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
        [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
        [10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "Khứ hồi", "btn btn-primary pull-left btn-return", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
        //[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
    ],
    "form-horizontal"
    ],

    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 1, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}

    _hasPickUpOnPrintBKS: false, // ds don doc duong

    //Edit sau xuất bến bao lâu
    _limitedDateBefore: 3,
    _limitedMinuteBefore: 4320,

    _pTplNumCoach: 1,
    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: false,

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-ticket-code='{seat._code}' data-position='{seat._coach}_{seat._row}_{seat._col}'>" +
                "<div class='{seat._class}'>" +
                    "<div class='clearfix'>" +
                        "<div class='pick'>{seat._pInfo}</div>" +
                        "<div class='seat-code'>{seat._label}</div>" +
                    "</div>" +
                    "<div class='agentinfo clearfix'>" +
                        "<p>{seat._stageName}&nbsp;{seat._fare}</p>" +
                        "<p>{seat._suser}{seat._cuser}</p>" +
                        "<p>{seat._note}</p>" +
                        "<p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p>" +
                    "</div>" +
                    "<div class='clearfix'>" +
                        "<div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div>" +
                    "</div>" +
                "</div>" +
            "</li>",

    _psTpl: "<li class='print-seat'>" +
            "<table class='table no-border table-condensed'>" +
                "<tbody>" +
                    "<tr style='height: 18px;'>" +
                        "<td>" +
                            "<p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p>" +
                            "<p class='ppayment {pseat._paid} {pseat._exported} {pseat._onlyPaidBackGround}'><b>{pseat._pInfo}</b></p>" +
                        "</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td>" +
                            "<p><span class='pcname'>{pseat._cname}{pseat._nTicketPerTrip}</span><span class='pcphone'>{pseat._cphone}</span></p>" +
                            "<p style='text-align:left;width:75%;float:left;height:16px;font-size:12.5px;white-space:nowrap;'>{pseat._note}</p>" +
                        "</td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>" +

        "</li>",

});
