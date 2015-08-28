//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
        _pStyleUrl: "/Comp/126/print.css?v=1.0.42",
		// _specialPos: {
            // 40: {
                // "1_6_5": [1, 6, 3], "1_6_4": [1, 6, 2], "1_6_3": [1, 6, 1], "1_6_2": [1, 6, 5], "1_6_1": [1, 6, 4],
                // "2_6_5": [2, 6, 3], "2_6_4": [2, 6, 2], "2_6_3": [2, 6, 1], "2_6_2": [2, 6, 5], "2_6_1": [2, 6, 4]
            // },
			
        // },
		// hiện nút P ngoài BKS: nhớ thêm các css sau vào file custom.css của nhà xe        div.buttons { width: 51% !important; } div.cinfo {width: 49% !important;}
       //_st: [[0], [2, 3, 4], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
		 _allowGroupByCode: false,
		_noBackground: true,
		_sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick' style='font-size:12px !important;'>{seat._pInfo}</div></div>"
            + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p class='cinfo'><span class='name' style='font-size:12px !important;'><b>{seat._cname}</b><span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p><p>{seat._note}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

        _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
                + "<tbody>"
                + "<tr style='height: 22px;'><td><p class='pseat-code {pseat._dathanhtoan}'>&nbsp;&nbsp;{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported}'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</p></td></tr>"
                + "<tr><td><p class='pcphone'>{pseat._cphone}</p><p class='pcname'><span style='text-transform: uppercase'><b>Đ:</b></span>{pseat._pInfo}</p><p class='pnote'>{pseat._note}</p></td></tr>"
				//+ "<tr><td><p class='pcname'>{pseat._cFullName}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
                + "</tbody>"
                + "</table></li>",
        //_pNoSeat: true,
		// In danh sách
		_pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th>Số ghế</th><th>Tên HK</th><th>Điểm đón</th><th>Số điện thoại</th><th>Trạng thái</th><th>Tổng Tiền</th><th>Đặt cọc</th><th>Ghi chú</th><th>Ks Vé</th></tr></thead><tbody></tbody></table></div>",
		_ipcLTpl: "<tr class='{seat._class}'><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._pText}</td><td>{seat._cphone}</td><td>{seat._status}</td><td>{seat._fare}</td><td>{seat._deposit}</td><td>{seat._note}</td><td></td></tr>",
		_psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",
        
        //_tplNumCol: 4,
        _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [4, { vi: "Tài xế thu" }, 1, "TX"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"], [10, { vi: "Chuyển tiền" }, 0, "CT"]],
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
            [6, 2, "Đặt cọc", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "đ"],
			[7, 1, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
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
		_epnp: {
        "10": ["060"],
          },
		_limitedDateBefore: 5,
		_limitedMinuteBefore: 7200,
        _hasPickUpOnPrintBKS: false,
		_showUCharge: true,
		_ptsfTpl_NoSub: "<div class='list tlist' style='font-size:20px;'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered' style='font-size:20px;'><thead><tr><th>STT</th><th>Tên HK</th><th>Số điện thoại</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
        _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
		
		_tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th>Tài</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Số ghế</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='7' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
		_itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._driverName}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._numSeat}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
			
		_puTpl: "<div class='plist'><h4>DANH SÁCH ĐÓN DỌC ĐƯỜNG&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th>Địa chỉ đón</th><th>Số ghế</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='8'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
		_ipuTpl: "<tr class='{seat._class}' data-code='{seat._code}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-pText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm pIndex' type='text' value='{seat._index}' /></td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
		
		_ppuTpl: "<div class='list plist' style='font-size:20px;'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered' style='font-size:20px;'><thead><tr><th>STT</th><th>Tên HK</th><th>Số điện thoại</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
        _ippuTpl: "<tr><td>{seat._index}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
		
		//header phoi
		_pTitleTpl: "<table class='print-title'><tbody><tr><td style='width: 250px !important;'><strong class='title'>{p._title}</strong></td><td colspan='2'><strong class='rname'>{p._rname}</strong></td><td style='145px !important;'>Số xe:&nbsp{p._busNum}</td></tr><tr><td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Lái xe:&nbsp;{p._driverName}</td><td>Phục vụ:&nbsp;{p._assistantName}</td></tr></tbody></table>",
		
		// // Trip Info
         _pSummaryTripInfo: true,
         _pSummaryTripInfoPageBreak: false,
         _tripInfo: "<div style='margin-top:0px;float:left;width:100%;position: relative;top: 6px;'>" +
                    "<div style='float:left;width:49.5%;margin-right: 5px;'>" +
                         "<table style='width:100%;' cellspacing='0'>" +                            
                             "<tbody>" +
                                "<tr style='height:45px;'>" +
                                    "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;padding-top: 5px; line-height:32px; height: 74px;'><span>1-Số khách trên xe:..............................................</span></br><span>2- Số khách đón dọc đường:................................</span></td>" +
                                "</tr>" +                                  
                             "</tbody>" +
                         "</table>" +
                     "</div>" +
					"<div style='float:left;width:49.5%;'>" +
                         "<table style='width:100%;' cellspacing='0'>" +                            
                             "<tbody>" +
                                "<tr style='height:45px;'>" +
                                    "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;padding-top: 5px; line-height:22px'><span>3-Số ghế trống:...................................................</span></br><span>4-Xe máy:............................................................</span></br><span>5-Ghế súp:...........................................................</span></td>" +
                                "</tr>" +                                  
                             "</tbody>" +
                         "</table>" +
                     "</div>" +
                   
                "</div>",
				
		// Pickup Info
        // _pSummaryPickupInfo: true,
        // _pSummaryPickupInfoPageBreak: false, // có qua trang hay không
        // _sumPickupInfo: "<div style='clear:both;float:left;margin-top:10px;width:100%;'>" +
                        // "<table width='100%' cellspacing='0' cellpadding='5' border='0'>" +
                            // "<tr>" +
                                // "<td width='50%' style='vertical-align:top;'>" +
                                    // "<table width='100%' cellspacing='0' cellpadding='5' border='0'>" +
                                        // "<tr>" +
                                            // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Phòng vé:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
                                        // "<tr>" +
                                            // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Vé Công ty:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
                                        // "<tr>" +
                                            // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Vé bến:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
                                        // "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Khách ngoài:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
                                        // "<tr>" +
                                            // "<td></td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
                                        // "<tr>" +
                                           // "<td></td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td style='float:right;'><b>Chi Phí</b></td>" +  
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Đổ dầu:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										 // "<tr>" +
                                           // "<td></td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Làm lệnh:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Phòng vé:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Điều bộ, bảo vệ:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Lệ phí đường:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Cơm:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Rửa xe:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Ca:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Tài, phụ xe:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Chi phí khác:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Ghi chú:</td>" +
                                            // "<td>.....................................................</td>" +
                                        // "</tr>" +
                                    // "</table>" +
                                // "</td>" +
                                // "<td width='50%' style='vertical-align:top;'>" +
                                    // "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                        // "<tr style='line-height:28px;'>" +
                                            // "<td width='25%' style='white-space:nowrap;'>Thu:</td>" +
                                            // "<td>..........................................................</td>" +
                                        // "</tr>" +
                                        // "<tr style='line-height:28px;'>" +
                                            // "<td width='25%' style='white-space:nowrap;'>Hàng:</td>" +
                                            // "<td>..........................................................</td>" +
                                        // "</tr>" +
                                        // "<tr style='line-height:28px;'>" +
                                            // "<td width='25%' style='white-space:nowrap;'>Tổng thu:</td>" +
                                            // "<td>..........................................................</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td>&nbsp;</td>" +
                                            // "<td></td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td></td>" +
                                            // "<td>&nbsp;</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td></td>" +
                                            // "<td>&nbsp;</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td></td>" +
                                            // "<td>&nbsp;</td>" +
                                        // "</tr>" +
										// "<tr>" +
                                           // "<td></td>" +
                                            // "<td>&nbsp;</td>" +
                                        // "</tr>" +
                                        // "<tr style='line-height:28px;'>" +
                                            // "<td width='25%' style='white-space:nowrap;'>Tổng chi:</td>" +
                                            // "<td>..........................................................</td>" +
                                        // "</tr>" +
										// "<tr style='line-height:28px;'>" +
                                            // "<td width='25%' style='white-space:nowrap;'>Còn lại:</td>" +
                                            // "<td>..........................................................</td>" +
                                        // "</tr>" +
                                       
                                    // "</table>" +
                                // "</td>" +
                            // "</tr>" +
                            
                              
                        // "</table>" +
                    // "<div>",	   
	});
	
})(jQuery);