//Extend dict
(function ($) {
    $.extend(_dict, _dict, 
    {
        _sTpl: "<li class='seat {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div><div class='note'>{seat._note}</div></div>"
       + "<div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span>{seat._pmInfo}</span></p><p class='phone'>{seat._cphone}</p></div></div></div></li>",
        _specialPos: {
            45: {
                "1_4_2": [1, 4, 5], "1_4_4": [1, 8, 1], "1_5_2": [1, 8, 3], "1_5_4": [1, 8, 5],
                "1_6_2": [1, 9, 1], "1_6_4": [2, 8, 1]
            },
            49: {
                "1_3_2": [1, 4, 5], "1_3_4": [1, 8, 1], "1_4_2": [1, 8, 3], "1_4_4": [1, 8, 5],
                "1_5_2": [1, 9, 1], "1_6_2": [1, 9, 2], "1_5_4": [2, 8, 1], "1_6_4": [2, 8, 3],
                "2_6_2": [2, 9, 1], "2_6_4": [2, 9, 3]
            }
        },
        _pNoSeat: true,
        _pStyleUrl: "/Comp/10/print.css?v=1.3.6",
        _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 1, "CK", "0101878725|A.Minh|"], [4, { vi: "Tài xế thu" }, 1, "TX"], [7, { vi: "VeXeRe" }, 1, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"], [10, { vi: "Chuyển tiền" }, 1, "CT"]],
        _uForm: [
        "UpdateForm",
        [
            [1, 1, "", "input", "hidden", "IdInfo", "", "", "", {}, [], ""], //row, col, label, element, type, name, class, default value, attributes, options, icon, merge
            [1, 1, "", "input", "hidden", "CustomerInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "StatusInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "CustomerId", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "NumSeat", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "BranchName", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "pIndex", "", "", {}, [], ""],
			[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
			[1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
            [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
            [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
            [4, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [4, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [5, 1, "Đón dọc đường", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [5, 2, "Trung chuyển", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [6, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
            [6, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            //[6, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [8, 1, "Seri", "input", "text", "Serial", "form-control", "", {}, [], ""],
            //[7, 2, "Vé khứ hồi", "input", "text", "RoundTripCode", "form-control", "", {}, [], ""],
            [8, 2, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            //[8, 2, "Giữ chỗ đến giờ xe chạy", "input", "checkbox", "KeepOnTime", "", "", {}, [], ""],
            //[8, 2, "HK không đến", "input", "checkbox", "Notcome", "", "", {}, [], ""],
            [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
        ], //Id, Elements, Class, GridClass
        _trule: [
           ["valid", "history"],
           [
               [1, ["valid"]],
               [2, ["valid"]],
               [5, ["valid"]]
           ]
        ], //Multiple ticket, status of ticket,
		_hasPickUpOnPrintBKS: false,
        _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
        + "<tbody>"
        + "<tr style='height: 20px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported}'>{pseat._pmInfo}</p></td></tr>"
        + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
        
        + "</tbody>"
        + "</table></li>",
    });
})(jQuery);