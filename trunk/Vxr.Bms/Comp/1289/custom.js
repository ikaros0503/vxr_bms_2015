//Extend dict
define({
	 _pStyleUrl: "/Comp/1289/print.css?v=1.0.1",	 
	 _specialPos: {
			 80: {
     "1_1_1": [1, 1, 1], "2_1_1": [1, 1, 3], "1_1_3": [1, 1, 5], "2_1_3": [1, 2, 1], "1_1_5": [1, 2, 3], "2_1_5": [1, 2, 5],
	 "1_2_1": [1, 3, 1], "2_2_1": [1, 3, 3], "1_2_3": [1, 3, 5], "2_2_3": [1, 4, 1], "1_2_5": [1, 4, 3], "2_2_5": [1, 4, 5],
	 "1_3_1": [1, 5, 1], "2_3_1": [1, 5, 3], "1_3_3": [1, 5, 5], "2_3_3": [1, 6, 1], "1_3_5": [1, 6, 3], "2_3_5": [1, 6, 5],
	 "1_4_1": [1, 7, 1], "2_4_1": [1, 7, 2], "1_4_3": [1, 7, 3], "2_4_3": [1, 7, 4], "1_4_5": [1, 7, 5], "2_4_5": [1, 8, 2],
	 "1_5_1": [1, 8, 4], "2_5_1": [1, 9, 1], "1_5_3": [1, 9, 2], "2_5_3": [1, 9, 3], "1_5_5": [1, 9, 4], "2_5_5": [1, 9, 5],
	 "1_6_1": [1, 10, 1], "2_6_1": [1, 10, 2], "1_6_3": [1, 10, 3], "2_6_3": [1, 10, 4], "1_6_5": [1, 10, 5], "2_6_5": [1, 11, 1],
	 "1_7_1": [1, 11, 2], "1_7_2": [1, 11, 3], "1_7_3": [1, 11, 4], "1_7_4": [1, 11, 5], "1_7_5": [1, 11, 6],
	 "2_7_1": [1, 12, 1], "2_7_2": [1, 12, 2], "2_7_3": [1, 12, 3], "2_7_4": [1, 12, 4], "2_7_5": [1, 12, 5],
	 "1_8_2": [1, 13, 1], "1_8_4": [1, 13, 2], "2_8_2": [1, 13, 3], "2_8_4": [1, 13, 4],
	 "1_9_1": [1, 14, 1], "1_9_2": [1, 14, 2], "1_9_3": [1, 14, 3], "1_9_4": [1, 14, 4], "1_9_5": [1, 14, 5],
	 "1_10_1": [1, 15, 1], "1_10_2": [1, 15, 2], "1_10_3": [1, 15, 3], "1_10_4": [1, 15, 4], "1_10_5": [1, 15, 5],
	 "1_11_1": [1, 16, 1], "1_11_2": [1, 16, 2], "1_11_3": [1, 16, 3], "1_11_4": [1, 16, 4], "1_11_5": [1, 16, 5],
	 "2_9_1": [1, 17, 1], "2_9_2": [1, 17, 2], "2_9_3": [1, 17, 3], "2_9_4": [1, 17, 4], "2_9_5": [1, 17, 5],
	 "2_10_1": [1, 18, 1], "2_10_2": [1, 18, 2], "2_10_3": [1, 18, 3], "2_10_4": [1, 18, 4], "2_10_5": [1, 18, 5],
	 "2_11_1": [1, 19, 1], "2_11_2": [1, 19, 2], "2_11_3": [1, 19, 3], "2_11_4": [1, 19, 4], "2_11_5": [1, 19, 5]
             
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
				[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
       //In vé tự động chuyển thanh toán
       //[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint-save", "", [], [], "", [1, 2]],
				[10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
            ],
            "form-horizontal"
    ],
	 _specialNumColBySeatTemplateId: {
        228: 6
    },
	_tplNumCol: 6,
	_hasDriverTrip: true,
    //_pNoSeat: true,
    // Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["Code"],
    	
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
		
		_multiSeatOnTicket: false,
	
		_eTicket: {
        // "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='' style='' /><p style='width:77%;float:right;text-align:center;'>PHIẾU ĐẶT CHỖ</p></div>"
            // + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:70%;margin:0 auto;height:30px;line-height:20px;'>KHÁCH HÀNG LÀ THƯỢNG ĐẾ</div>"
            // + "<div class='row'><div class='col-xs-12'><p style='margin-top:5px;'>{ticket._phone}<br/>{ticket._address}</p></div></div><hr style='border:1px #000 solid; margin:0'/>"
            // + "<div class='row'><div class='col-xs-5'>"
            // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;'>{ticket._fromArea}</span></h5>"
            // + "<p>{ticket._from}</p>"
            // + "</div>"
            // + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2192;</h3></div>"
            // + "<div class='col-xs-5 text-right'>"
            // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;'>{ticket._toArea}</span></h5>"
            // + "<p>{ticket._to}</p>"
            // + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
            // + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
            // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
            // + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
            // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
            // + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
            // + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
            // + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

        
        "custom": {
           
                
            23918: {
                 "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;'><p style='width:100%;text-align:center;font-size:19px;padding:2px 0 0 0;'>CTY TNHH MTV DVVT</p><p style='width:100%; text-align:center; font-size:33px; line-height:28px;'>TUẤN TÚ</p></div>"
                    //<img src='http://nhaxe.vexere.com/Images/eticket/vietlao-ve.jpg' style='width: 100%;float:left;' />
					//+ "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:35%;font-weight:bold;margin-top:1px;font-size:14px !important;'>Vp Hồ Chí Minh</div>"
                            // + "<div style='float:right;width:65%;font-size:16px !important;'>Số 30 đường D1, P.25 </br> Q.Bình Thạnh, Hồ Chí Minh.</br>(08)62.945.775</div>"
                        // + "</div>"
                        + "<div style='float:left;width:100%;text-align:center;'>"
                            + "<div style='float:left;width:100%;font-weight:bold;font-size:11px !important;'>590 Bình Long - P.Tân Quý - Q.Tân Phú - Tp Hồ Chí Minh</div>"
                            + "<div style='float:right;width:100%;font-size:16px !important;'>(083) 559.06.11 - 0939.7777.55 </br> <span style ='width:100%; text-align:center;'>0909.802.776 - 0914.1111.50</span></div>"
                        + "</div>"
						
						// + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:35%;font-weight:bold;14px !important;'>Website </div>"
                            // + "<div style='float:right;width:65%;font-size:16px !important;'>Vanchuyenvietlao.com</div>"
                        // + "</div>"
						// + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:35%;font-weight:bold;14px !important;'>Hotline</div>"
                            // + "<div style='float:right;width:65%;font-size:16px !important;'>0985.421.028</div>"
                        // + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;width:162px !important;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'><b>{ticket._fromArea}</b></span></h5>"
                    + "<p><b>{ticket._from}</b></p>"
                    + "</div>"
                    + "<div class='col-xs-2' style='margin-left:-28px;'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right' style='float:right;'>"
                    + "<h5 style='margin-bottom:5px;width:141px !important;margin-left:-29px; text-align: right;'><span style='text-transform:uppercase;font-weight:bold; font-size: 13px;'><b>{ticket._toArea}</b></span></h5>"
                    + "<p><b>{ticket._to}</b></p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;width:180px !important;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;font-size:22px !important;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:35px !important;margin-top:10px !important;'><p><span style='font-size:16px !important;'>Tài:</span>{ticket._tripHour}</p></h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;width:150px !important;'><p style='margin-bottom:0;margin-top:10px !important;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:10px 0px; font-size:35px !important;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 16px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;margin-top:-6px;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Ghi chú: {ticket._note}</p><p>Nhân viên: {ticket._user}</p><p style ='text-decoration:underline;'>Lưu ý:</p><p><i>Phiếu xuất rồi xin miễn đỗi hoặc trả.</i></p><p><i>Sau khi xe xuất bến phiếu không còn giá trị.</i></p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
					


					
                 },
		23919: {
                 "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;'><p style='width:100%;text-align:center;font-size:19px;padding:2px 0 0 0;'>CTY TNHH MTV DVVT</p><p style='width:100%; text-align:center; font-size:33px; line-height:28px;'>TUẤN TÚ</p></div>"
                    //<img src='http://nhaxe.vexere.com/Images/eticket/vietlao-ve.jpg' style='width: 100%;float:left;' />
					//+ "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:35%;font-weight:bold;margin-top:1px;font-size:14px !important;'>Vp Hồ Chí Minh</div>"
                            // + "<div style='float:right;width:65%;font-size:16px !important;'>Số 30 đường D1, P.25 </br> Q.Bình Thạnh, Hồ Chí Minh.</br>(08)62.945.775</div>"
                        // + "</div>"
                        + "<div style='float:left;width:100%;text-align:center;'>"
                            + "<div style='float:left;width:100%;font-weight:bold;font-size:11px !important;'>590 Bình Long - P.Tân Quý - Q.Tân Phú - Tp Hồ Chí Minh</div>"
                            + "<div style='float:right;width:100%;font-size:16px !important;'>(083) 559.06.11 - 0939.7777.55 </br> <span style ='width:100%; text-align:center;'>0909.802.776 - 0914.1111.50</span></div>"
                        + "</div>"
						
						// + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:35%;font-weight:bold;14px !important;'>Website </div>"
                            // + "<div style='float:right;width:65%;font-size:16px !important;'>Vanchuyenvietlao.com</div>"
                        // + "</div>"
						// + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:35%;font-weight:bold;14px !important;'>Hotline</div>"
                            // + "<div style='float:right;width:65%;font-size:16px !important;'>0985.421.028</div>"
                        // + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;width:162px !important;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'><b>{ticket._fromArea}</b></span></h5>"
                    + "<p><b>{ticket._from}</b></p>"
                    + "</div>"
                    + "<div class='col-xs-2' style='margin-left:35px;'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right' style='float:right;margin-left:-35px;'>"
                    + "<h5 style='margin-bottom:5px;width:141px !important;margin-left:-29px; text-align: right;'><span style='text-transform:uppercase;font-weight:bold; font-size: 13px;'><b>{ticket._toArea}</b></span></h5>"
                    + "<p><b>{ticket._to}</b></p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;width:180px !important;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;font-size:22px !important;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:35px !important;margin-top:10px !important;'><p><span style='font-size:16px !important;'>Tài:</span>{ticket._tripHour}</p></h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;width:150px !important;'><p style='margin-bottom:0;margin-top:10px !important;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:10px 0px; font-size:35px !important;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 16px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;margin-top:-6px;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Ghi chú: {ticket._note}</p><p>Nhân viên: {ticket._user}</p><p style ='text-decoration:underline;'>Lưu ý:</p><p><i>Phiếu xuất rồi xin miễn đỗi hoặc trả.</i></p><p><i>Sau khi xe xuất bến phiếu không còn giá trị.</i></p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
					


					
                 }
        }
    },


});
