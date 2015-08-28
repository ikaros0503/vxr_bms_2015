//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
        _specialPos: {
           // 40: {
                // "1_6_5": [1, 6, 3], "1_6_4": [1, 6, 2], "1_6_3": [1, 6, 1], "1_6_2": [1, 6, 5], "1_6_1": [1, 6, 4],
				// "2_6_5": [2, 6, 3], "2_6_4": [2, 6, 2], "2_6_3": [2, 6, 1], "2_6_2": [2, 6, 5], "2_6_1": [2, 6, 4],
            // }
			// 43: {
                  // "1_6_5": [1, 6, 3], "1_6_4": [1, 6, 2], "1_6_3": [1, 6, 1], "1_6_2": [1, 7, 1], "1_6_1": [1, 6, 5],
				 // "1_7_5": [1, 6, 4], "1_7_1": [1, 7, 5],
				 // "2_6_5": [2, 6, 3], "2_6_4": [2, 6, 2], "2_6_3": [2, 6, 1], "2_6_2": [2, 6, 5], "2_6_1": [2, 6, 4],
             // }                        
        },
		 _allowGroupByCode: true,
		_hasShowTripNameInRCF: false,
		_noBackground: true,
        _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
                + "<tbody>"
                + "<tr style='height: 22px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._nobackground} {pseat._paid} {pseat._exported}'>{pseat._pmInfo}</p></td></tr>"
                + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
                + "</tbody>"
                + "</table></li>",
        //_pNoSeat: true,
        _pStyleUrl: "/Comp/105/print.css?v=1.0.7",
        //_tplNumCol: 4,
        _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [4, { vi: "Tài xế thu" }, 1, "TX"], [7, { vi: "VeXeRe" }, 0, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"], [10, { vi: "Chuyển tiền" }, 1, "CT"]],
        _uForm: [
        "UpdateForm",
        [
            [1, 1, "", "input", "hidden", "IdInfo", "", "", "", {}, [], ""], //row, col, label, element, type, name, class, default value, attributes, options, icon, merge
            [1, 1, "", "input", "hidden", "CustomerInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "StatusInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "CustomerId", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "NumSeat", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "pIndex", "", "", {}, [], ""],
			[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
			[1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
            [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
            [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
            [4, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [4, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [5, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [5, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [6, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
            [6, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [7, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
            [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [7, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
            [7, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],            
            [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            [8, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
			[10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],	
			[10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            //[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
		"form-horizontal"
	],	
		// Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["PhoneNumbers", "Note", "Code"],
    // Vé khứ hồi: copy các thông tin sau
    _returnField: ["FullName", "PhoneNumbers"],
    _returnFieldRequired: ["PhoneNumbers"],
    // dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
    // 5|10092|1: quyền này sẽ mở khóa các button 
    _closedTripConf: {
        "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save", "btn-add-more-ticket", "btn-return"],
        "ValidForm": []
    },
    // bắt buộc nhập thông tin tài xế mới cho phép bấm nút Xuất Bến
    // các thông tin bắt buộc gồm có
    // VehicleNumber: biển số xe
    // DriverName: tên tài xế
    // AssistantName: tên phục vụ
    _driverInfoRequired: true,
    _fieldDriverInfoRequired: ["VehicleNumber", "DriverName"],

	// block ghế theo biển số xe
    // _blockSeatByVehicle: ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", 
						  // "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", 
						  // "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
    // _unblockSeatByVehicle: 
        // {
            // "85B-001.33": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
			// "85B-001.74": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
			// "85B-001.51": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
			// "85N-0729": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5","2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2"],
			// "85N-0734": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
			// "85N-0720": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
			// "85B-002.79": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
			// "85B-002.97": ["2|1|5", "2|1|1", "2|2|5", "2|2|1", "2|3|5", "2|3|1", "2|4|5", "2|4|1", "2|5|5", "2|5|1", "2|6|5", "2|6|4", "2|6|2", "2|6|1"],
        
		// }
    // ,
	
		
    _hasPickUpOnPrintBKS: false,
		// _showUCharge: true,
		// _ptsfTpl: "<div class='list tlist' style='font-size:20px;'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered' style='font-size:20px;'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
        // _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
		// _ppuTpl: "<div class='list plist' style='font-size:20px;'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered' style='font-size:20px;'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
        // _ippuTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    });

})(jQuery);