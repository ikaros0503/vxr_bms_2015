//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
        _specialPos: {
            51: {
                "1_2_2": [1, 7, 1], "1_2_4": [1, 7, 2], 
                "1_3_2": [1, 7, 3], "1_3_4": [1, 7, 4],
                "1_4_2": [1, 7, 5], "1_4_4": [1, 7, 6],
                "1_5_2": [1, 7, 7], "1_5_4": [1, 7, 8],
                "1_6_2": [1, 7, 9], "1_6_4": [1, 7, 10],
            }
        },		
		_pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 1, "CK"], [4, { vi: "Tài xế thu" }, 1, "TX"], [7, { vi: "VeXeRe" }, 1, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"], [10, { vi: "Chuyển tiền" }, 1, "CT"]],
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
			//[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
			[1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
            [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
            [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
            [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [4, 1, "Đón dọc đường", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [4, 2, "Trung chuyển", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
            [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [6, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            //[6, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [6, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [6, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [7, 1, "Seri", "input", "text", "Serial", "form-control", "", {}, [], ""],
            //[7, 2, "Vé khứ hồi", "input", "text", "RoundTripCode", "form-control", "", {}, [], ""],
            [7, 2, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            //[8, 2, "Giữ chỗ đến giờ xe chạy", "input", "checkbox", "KeepOnTime", "", "", {}, [], ""],
            //[8, 2, "HK không đến", "input", "checkbox", "Notcome", "", "", {}, [], ""],
            [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
        ], //Id, Elements, Class, GridClass
	    _pStyleUrl: "/Comp/17/print.css?v=1.0.9",
		_pNoSeat: true,
    });
})(jQuery);