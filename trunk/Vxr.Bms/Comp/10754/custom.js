//Extend dict
define({
        _pStyleUrl: "/Comp/10754/print.css?v=1.0.1",	  
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
		
		_specialNumColBySeatTemplateId: {
			199: 4,
			193: 3,			
		},
	
        _pNoSeat: true,
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
        
		_multiSeatOnTicket: false,
		_eTicket: {
        "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='' style='' /><p style='width:77%;float:right;text-align:center;'>PHIẾU ĐẶT CHỖ</p></div>"
            + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:70%;margin:0 auto;height:30px;line-height:20px;'>KHÁCH HÀNG LÀ THƯỢNG ĐẾ</div>"
            + "<div class='row'><div class='col-xs-12'><p style='margin-top:5px;'>{ticket._phone}<br/>{ticket._address}</p></div></div><hr style='border:1px #000 solid; margin:0'/>"
            + "<div class='row'><div class='col-xs-5'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;'>{ticket._fromArea}</span></h5>"
            + "<p>{ticket._from}</p>"
            + "</div>"
            + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2192;</h3></div>"
            + "<div class='col-xs-5 text-right'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;'>{ticket._toArea}</span></h5>"
            + "<p>{ticket._to}</p>"
            + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
            + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
            + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
            + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
            + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
            + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
            + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
            + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

        "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/hoa-thuan-anh.png' style='width: 70px;' />HÒA THUẬN ANH EXPRESS</div>"
            + "<div class='row'><div class='col-xs-12'><p style='margin-top:5px;'>{ticket._phone}<br/>{ticket._address}</p></div></div><hr style='border:1px #000 solid; margin:0'/>"
            + "<div class='row'><div class='col-xs-5'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;'>{ticket._fromArea}</span></h5>"
            + "<p>{ticket._from}</p>"
            + "</div>"
            + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2192;</h3></div>"
            + "<div class='col-xs-5 text-right'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;'>{ticket._toArea}</span></h5>"
            + "<p>{ticket._to}</p>"
            + "</div></div><div class='row'><div class='col-xs-12'>"
            + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
            + "<div class='row'><div class='col-xs-12'>"
            + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
            + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
            + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
            + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p><p>Quý khách vui lòng đến trước 15 phút. Không hoàn vé sau 15h. </p></div><div class='col-xs-9 text-center' style='margin-top:5px;'><img class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div>",

        "custom": {
            109296: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/vietlao-ve.jpg' style='width: 100%;float:left;' /><p style='width:100%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHIẾU ĐẶT CHỖ</p></div>"
                    //+ "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>Vp Lào</div>"
                            + "<div style='float:right;width:65%;'>Bến xe Km số 9, Dong Dok, Vientiane</br>(020)9871.7979</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;margin-top:1px;font-size:14px !important;'>Vp Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;font-size:16px !important;'>Số 30 đường D1, P.25 </br> Q.Bình Thạnh, Hồ Chí Minh.</br>(08)62.945.775</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>Website </div>"
                            + "<div style='float:right;width:65%;'>Vanchuyenvietlao.com</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>Hotline</div>"
                            + "<div style='float:right;width:65%;'>0985.421.028</div>"
                        + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;width:162px !important;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;width:130px !important;float:right;'><span style='text-transform:uppercase;font-weight:bold; font-size: 13px;'>{ticket._toArea}</span></h5>"
                    + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;width:180px !important;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;font-size:22px !important;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:35px !important;margin-top:10px !important;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;width:150px !important;'><p style='margin-bottom:0;margin-top:10px !important;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:10px 0px; font-size:35px !important;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 16px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;margin-top:-6px;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase; font-size: 21px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Ghi chú: {ticket._note}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

			},
            109287: {
                 "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/vietlao-ve.jpg' style='width: 100%;float:left;' /><p style='width:100%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHIẾU ĐẶT CHỖ</p></div>"
                    //+ "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;margin-top:1px;font-size:14px !important;'>Vp Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;font-size:16px !important;'>Số 30 đường D1, P.25 </br> Q.Bình Thạnh, Hồ Chí Minh.</br>(08)62.945.775</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>Vp Lào</div>"
                            + "<div style='float:right;width:65%;font-size:16px !important;'>Bến xe Km số 9, Dong Dok, Vientiane</br>(020)9871.7979</div>"
                        + "</div>"
						
						+ "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;14px !important;'>Website </div>"
                            + "<div style='float:right;width:65%;font-size:16px !important;'>Vanchuyenvietlao.com</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;14px !important;'>Hotline</div>"
                            + "<div style='float:right;width:65%;font-size:16px !important;'>0985.421.028</div>"
                        + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;width:162px !important;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;margin-left:23px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;width:112px !important;'><span style='text-transform:uppercase;font-weight:bold; font-size: 13px;'>{ticket._toArea}</span></h5>"
                    + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;width:180px !important;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;font-size:22px !important;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:35px !important;margin-top:10px !important;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;width:150px !important;'><p style='margin-bottom:0;margin-top:10px !important;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:10px 0px; font-size:35px !important;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 16px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;margin-top:-6px;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase; font-size: 21px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Ghi chú: {ticket._note}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                 }
        }
    },
      
            
            
       

});
