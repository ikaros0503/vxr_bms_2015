//Extend dict
define({
        _pStyleUrl: "/Comp/10859/print.css?v=1.0.1",	  
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
            [3, 1, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
			[3, 2, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],     
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
            [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
        ],
		//block ghế theo biển số xe
		_blockSeatByVehicle: ["1|7|1", "1|7|2", "1|7|3", "1|7|4", "1|7|5", "1|6|3", "2|6|3"],
		//Mở khoá theo xe
		_unblockSeatByVehicle:
    {
        "82B-004.72": ["1|7|1", "1|7|2", "1|7|3", "1|7|4", "1|7|5"],
        "82B-003.21": ["1|6|3", "2|6|3"]
    },
		// _specialNumColBySeatTemplateId: {
			// 199: 4,
			// 193: 3,			
		// },
	
        //_pNoSeat: true,
        //_allowGroupByCode: true,
        		
        _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
        _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 1, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
        _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
        _showUCharge: true, //nguoi thanh toan
        _noShowAgentInfo: true, //chi nhanh dat cho
        _hasPickUpOnPrintBKS: false, // ds don doc duong

        

		// bắt buộc nhập thông tin tài xế mới cho phép bấm nút Xuất Bến
        // các thông tin bắt buộc gồm có
        // VehicleNumber: biển số xe
        // DriverName: tên tài xế
        // AssistantName: tên phục vụ
    	_driverInfoRequired: true,
    	_fieldDriverInfoRequired: ["DriverName"],
		
        _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
			  + "<tbody>"
			  + "<tr class='cuser' style='height: 16px'><td><p class='tt' style='width:65%;float:left;text-align:left;'>{pseat._ttPayment}</p><p class='pseat-code {pseat._dathanhtoan}' style='float:right; text-align:right;'>{pseat._label}</p></p><p class='pcname'>{pseat._cname}&nbsp;{pseat._nTicketPerTrip}</p></td></tr>"
			  + "<tr style='height: 17px;'><td style='height: 17px;'><p class='pcphone'> {pseat._cphone}</p></td></tr>"
			  + "<tr style='height:18px;'><td><p class='pnote' style='clear:both;'><span style='text-transform: uppercase;'>Đ:&nbsp;</span>{pseat._pInfo}</p></td></tr>"
			  + "<tr><td><p class='ghichu' style='clear:both;'>{pseat._note}</p></td></tr>"
			  + "</tbody>"
			  + "</table></li>",		  
		 

        _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-ticket-code='{seat._code}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
            + "<div class='agentinfo clearfix'><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",


        _tsfTpl: "<div class='tlist'>" +
                "<h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4>" +
                "<table class='table table-bordered table-responsive list-ticket'>" +
                    "<thead>" +
                        "<tr class='bg-primary'>" +
                            "<th class='col-md-1 hidden-xs'>STT</th>" +
                            "<th>Số điện thoại</th>" +
                            "<th class='hidden-xs'>Tên HK</th>" +
                            "<th>Địa chỉ đón</th>" +
                            "<th>Số lượng</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                    "<tfoot class='hidden-xs'>" +
                        // "<tr>" +
                            // "<td colspan='4' style='text-align: right;'>Tổng cộng</td>" +
                            // "<td><strong class='vred'>{t._totalSeat}</strong></td>" +
                        // "</tr>" +
                        "<tr>" +
                            "<td colspan='10'>" +
                                "<button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;" +
                                "<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button>" +
                            "</td>" +
                        "</tr>" +
                    "</tfoot>" +
                "</table>" +
            "</div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'>" +
                    "<td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td>" +
                    "<td>{seat._cphone}</td>" +
                    "<td class='hidden-xs'>{seat._cname}</td>" +
                    "<td>{seat._pText}</td>" +
                    "<td>{seat._numSeat}</td>" +
                "</tr>",
		
		_ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Số điện thoại</th><th>Tên HK</th><th>Địa chỉ đón</th><th>Số lượng</th></tr></thead><tbody></tbody><tfoot><tr></tr></tfoot></table></div>",
		//<td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
		//<small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small>
        _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._cphone}</td><td>{seat._cname}</td><td>{seat._pText}</td><td>{seat._numSeat}</td></tr>",

        _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 4%;'>STT</th><th style='width: 6%;'>Số ghế</th><th style='width: 30%;'>Địa chỉ cần đón</th><th style='width: 10%;'>Tên HK</th><th style='width: 16%;white-space:nowrap;'>Số điện thoại</th><th style='width: 12%;'>Trạng thái</th><th style='width: 15%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
        _ipcLTpl: "<tr class='{seat._class}'><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td style='font-size:19px;'>{seat._cphone}</td><td>{seat._status}</td><td>{seat._note}</td></tr>",
        _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",
        
		 groupSeat: {
          groupFields: "phone",
          displayFields: "phone|4,note,pInfo"
       },
       _psTpl_SeatGroup:
           '<li class="print-seat col-md-4" style="overflow:hidden;">' +
               '<table>' +
                '<tbody>' +
                      '<tr style="">' +
                       '<td style="width:100%"><p><span class="pseat-code {data._paid}" style="width:18%; text-align:left;">{data.seatCode}</span><span style="width:79%; text-align:right; float:right">{pseat._fare}</td>' +
                       '<td></td>' +
                   '</tr>' +
				   // '<tr style="">' +
                       // '<td style="width:100%;float:right;text-align:right;"><p>{pseat._fare}</p></td>' +
                       // '<td></td>' +
                   // '</tr>' +
                      '<tr>' +
                        '<td colspan="2" style="text-align: center;font-size: 18px;"><b>{data.originalSeatCode}&nbsp;{pseat._nTicketPerTrip}</b></td>' +
                      '</tr>' +
                     // '<tr>' +
                       // '<td style="font-size:small;" colspan=2><p style="white-space: nowrap;overflow: hidden;font-size:15px;"> {pseat._cname}&nbsp;{pseat._nTicketPerTrip}</p></td>' +
                     // '</tr>' +
                     '<tr>' +
                        '<td style="font-size:small;text-transform: lowercase;" colspan=2><p style="white-space: nowrap;overflow: hidden;"> {data.note}</p></td>' +
                      '</tr>' +
                   '</tbody>' +
               '</table>' +
           '</li>',

		

       

});
