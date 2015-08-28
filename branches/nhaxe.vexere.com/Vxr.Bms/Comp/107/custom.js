//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
		_specialPos: {            
			56: {
				"1_2_5": [1, 8, 1], "1_3_5": [1, 8, 3],"1_4_5": [1, 8, 5],"1_5_5": [1, 9, 1], "1_6_5": [1, 9, 3],
                "2_2_5": [2, 8, 1], "2_3_5": [2, 8, 3],"2_4_5": [2, 8, 5],"2_5_5": [2, 9, 1], "2_6_5": [2, 9, 3],
			}           
        },
		// dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
        // 5|10092|1: quyền này sẽ mở khóa các button 
        _closedTripConf: {
            "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save"],
            "ValidForm": []
        },
        
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
            [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
            //[5, 2, "+ Ăn", "input", "text", "Surcharge", "form-control vblue fw700", "30.000", {}, [], "đ"],
            [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [7, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
            [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [7, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
            [7, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
            //[8, 1, "Seri", "input", "text", "Serial", "form-control", "", {}, [], ""],
            [8, 2, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
        ], //Id, Elements, Class, GridClass
        //_trule: [
           //["valid", "history"],
          // [
               //[1, ["valid"]],
               //[2, ["valid"]],
               //[5, ["valid"]]
           //]
        //], //Multiple ticket, status of ticket,  
		//_pNoSeat: true,
		_hasSelectBranchPayment: true,
		_pTplNumCoach: 1,	
		_onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
        _pStyleUrl: "/Comp/107/print.css?v=1.0.21",
		_psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
        + "<tbody>"
        + "<tr style='height: 18px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._onlyPaidBackGround} {pseat._exported}'>{pseat._fare}</p></td></tr>"
        + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
        + "</tbody>"
        + "</table></li>",
		_noShowAgentInfo: true,
        // _historyKeys: {
            // "AgentInfo": { "vi": "VP/CN" },
            // "TripDate": { "vi": "Chuyến" },
            // "IssueDate": { "vi": "Ngày đặt" },
            // "PickupDate": { "vi": "Giờ đón" },
            // "Status": { "vi": "Trạng thái" },
            // "Fare": { "vi": "Giá" },
            // "CreatedUser": { "vi": "Người đặt" },
            // "SeatCode": { "vi": "Mã ghế" },
            // "CustomerInfo": { "vi": "Hành khách" },
            // "PickupInfo": { "vi": "Đón" },
            // "Serial": { "vi": "Số seri" },
            // "PaymentInfo": { "vi": "Thanh toán" },
            // "RoundTripCode": { "vi": "Mã khứ hồi" },
            // "Note": { "vi": "Ghi chú" },
            // "Surcharge": { "vi": "+ Ăn" }
        // },
        // _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
      // + "<tbody>"
      // + "<tr><td><p class='pseat-code'>{pseat._label}</p><p class='pmInfo ppayment'>{pseat._pmInfo}</p></td></tr>"
      // + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'><b>{pseat._cphone}</b></p></td></tr>"
      // + "<tr><td><p class='pnote' style='clear:both;'>{pseat._note}</p></td></tr>"
      // + "<tr><td><p class='ppickup'>TC:&nbsp;<span>{pseat._pInfo}</span></p></td></tr>"
      // + "</tbody>"
      // + "</table></li>",	    
	    _hasPickUpOnPrintBKS: false,
	  //_noShowAgentInfo: true,
	  	_epnp: {
            "10": [
                "076"
            ],
        },
	  // _showUCharge: true,
	  // _ptsfTpl: "<div class='list tlist'><h4>DANH SÁCH TRUNG CHUYỂN</h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
      // _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._note}</td></tr>",
    });
})(jQuery);