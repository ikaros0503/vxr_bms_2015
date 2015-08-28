//Extend dict
define({
	 _pStyleUrl: "/Comp/1420/print.css?v=1.0.26",
	 _specialPos: {
         47: {
             "1_1_1": [1, 8, 5], 
			 "1_2_1": [1, 1, 1], "1_2_3": [1, 2, 1], "1_2_5": [1, 2, 3], 
			 "1_3_1": [1, 2, 5], "1_3_3": [1, 3, 1], "1_3_5": [1, 3, 3],
			 "1_4_1": [1, 3, 5], "1_4_3": [1, 4, 1], "1_4_5": [1, 4, 3],
			 "1_5_1": [1, 4, 5], "1_5_3": [1, 5, 1], "1_5_5": [1, 5, 3],
			 "1_6_1": [1, 5, 5], "1_6_3": [1, 6, 1], "1_6_5": [1, 6, 3],
			 "1_7_1": [1, 6, 5], "1_7_3": [1, 7, 1], "1_7_5": [1, 7, 3],
			 "1_8_1": [1, 7, 5], "1_8_2": [1, 8, 1], "1_8_3": [1, 8, 2],"1_8_4": [1, 8, 3], "1_8_5": [1, 8, 4]
         }
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
                //[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
                [1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
                [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
                [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
                [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
                [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
                [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
                [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
                [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
               // [5, 2, "Đặt cọc", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "đ"],
                [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
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
				[10, 1, "", "button", "button", "Khứ hồi", "btn btn-primary pull-left btn-return", "", [], [], "", [1, 2]],
				[10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
				//[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
       //In vé tự động chuyển thanh toán
       //[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint-save", "", [], [], "", [1, 2]],
				[10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
            ],
            "form-horizontal"
    ],
	_hasDriverTrip: true,
    //_pNoSeat: true,
    // Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["Code"],
    _allowGroupByCode: true,		
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _showUCharge: true,
    _noShowAgentInfo: true,
	 _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-ticket-code='{seat._code}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p><b>{seat._fare}</b></p><p>{seat._suser}{seat._cuser}</p><p class='cinfo' style='width:100%;text-align:left;font-size:15px;'><span class='name'><b>{seat._cname}</b><span class='numT'>{seat._nTicketPerTrip}</span></p><p><span class='phone' style='font-size:15px;'><b>{seat._cphone}<b></p><p style='margin-top: -2px;'>{seat._note}</p></div><div class='clearfix'><div class='buttons' style='width:100%;'>{seat.buttons}<p class='pmInfo' style='float:right;'>{seat._pmInfo}</p></div></div></div></li>",
		//<p>{seat._stageName}&nbsp;{seat._fare}</p>

    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
          + "<tbody>"
          + "<tr style='height: 18px;'><td><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p></td></tr>"
          + "<tr style='height: 22px;'><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'><b>{pseat._cphone}</b></p></td></tr>"
          + "<tr><td><p class='pnote' style='clear:both;'>{pseat._note}</p></td></tr>"
          + "</tbody>"
          + "</table></li>",
	//header phoi
    _pTitleTpl: "<table class='print-title' style='float:right; width:830px;'><tbody><tr><td style='width: 250px !important;'><strong class='title'>{p._title}</strong></td><td colspan='' style='width:230px;'><strong class='rname'>{p._rname}</strong></td><td style='145px !important;'>Số xe:&nbsp{p._busNum}</td></tr><tr><td style='width:350px;'>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Lái xe:&nbsp;{p._driverName}</td><td>Phục vụ:&nbsp;{p._assistantName}</td></tr></tbody></table>",
	// bắt buộc nhập thông tin tài xế mới cho phép bấm nút Xuất Bến
    // các thông tin bắt buộc gồm có
    // VehicleNumber: biển số xe
    // DriverName: tên tài xế
    // AssistantName: tên phục vụ
    _driverInfoRequired: true,
    _fieldDriverInfoRequired: [""],


    //_pTplNumCoach: 1,
   
    _hasPickUpOnPrintBKS: false,
    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",

    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 4%;'>STT</th style='width: 20%;'><th>Số ghế</th><th style='width: 20%;'>Địa chỉ cần đón</th><th style='width: 10%;'>Tên HK</th><th style='width: 12%;white-space:nowrap;'>Số điện thoại</th><th style='width: 12%;'>Trạng thái</th><th style='width: 20%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class='{seat._class}'><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",

    //
    _updateFormValidatingConditions: ["payment&fare[>=0]", "phone&!payment->fare[>=0]", "note&!payment->fare[>=0]"],
    _updateFormValidatingErrorMessage: "Thông tin cập nhật chưa đúng! Vui lòng kiểm tra lại.",
    _updateFormValidatingErrorMessages: {
        "phone": "Vui lòng nhập số điện thoại.",
        "fare": "Giá vé phải lớn hơn 0.",
    },
			_hasMergeTransfer: { 96158: true, 95967: true },
			_hasTransferTimeConf: ["00:01-23:59"],
		
    _multiSeatOnTicket: true,
	
	 // groupSeat: {
         // groupFields: "phone->ticketCode",
         // displayFields: "phone|4,note,pInfo"
      // },
      // _psTpl_SeatGroup:
          // '<li class="print-seat col-md-4" style="overflow:hidden;">' +
              // '<table>' +
                // '<tbody>' +
                    // // '<tr style="">' +
                      // // '<td style="width:100%"><p class="pseat-code {data._paid}">{data.seatCode}</p></td>' +
                      // // '<td></td>' +
                  // // '</tr>' +
                     // '<tr>' +
                       // '<td colspan="2" style="text-align: center;font-size: 18px;"><b>{data.originalSeatCode}</b></td>' +
                     // '</tr>' +
                    // '<tr>' +
                      // '<td style="font-size:small;" colspan=2><p style="white-space: nowrap;overflow: hidden;font-size:15px;"> {pseat._cname}&nbsp;{pseat._nTicketPerTrip}</p></td>' +
                    // '</tr>' +
                    // '<tr>' +
                       // '<td style="font-size:small;text-transform: lowercase;" colspan=2><p style="white-space: nowrap;overflow: hidden;"> {data.note}</p></td>' +
                     // '</tr>' +
                  // '</tbody>' +
              // '</table>' +
          // '</li>',


});
