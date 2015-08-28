//Extend dict
define({
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
                    [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700 fs20", "", {}, [], ""],
                    [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
                    [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
                    [4, 2, "T/Chuyển", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
                    [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
                    [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
                    [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
                    [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
                    [7, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
                    [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
                    [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
                    [8, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
                    [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
                    [10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
                    [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
                    [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
                    [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
                ],
                "form-horizontal"
    ], //Id, Elements, Class, GridClass
    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],

    // ràng buộc dữ liệu trong form Update
    _uFormRequiredField: [""],
    _pStyleUrl: "/Comp/660/print.css?v=1.0.46",
    _allowGroupByCode: true,
    _frule: [
   [["UpdateForm", ["Serial", "RoundTripCode", "FromArea", "ToArea"]], ["ValidForm", ["PassCode"]]],
       [
           [1, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]],
           [2, [["UpdateForm", ["KeepOnTime", "Fare", "PaymentType", "BranchName", "ChargeCode", "DriverName"]], ["ValidForm", ["PassCode"]]]],
           [3, [["UpdateForm", ["PhoneNumbers", "FullName", "PickupInfo", "TransferInfo", "Fare", "Surcharge", "PaymentType", "Serial", "Note", "KeepOnTime", "BranchName", "ChargeCode", "DriverName"]], ["ValidForm", ["PassCode"]]]],
           [5, [["UpdateForm", ["KeepOnTime", "PaymentType", "Fare"]]]],
           [8, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]]
       ]
    ], //Multiple ticket, status of ticket, not same value
    // _lTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='10'><button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table>",
    // _cancelListTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody></table>",
    // _ilTpl: "<tr class='lseat' data-position='{seat._coach}_{seat._row}_{seat._col}' data-issue='{seat._issue}'><td class='hidden-xs text-center index'>{seat._index}</td><td>{seat._label}</td><td>{seat._cname}&nbsp;<span class='numT'>{seat._nTicketPerTrip}</span></td><td>{seat._cphone}</td><td class='hidden-xs'>{seat._idate}<br/>{seat._suser}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td>{seat._status}<br/>{seat._cuser}<br/>{seat._pmFullInfo}</td><td class='hidden-xs'>{seat._pInfo}</td><td class='hidden-xs'>{seat._note}</td><td class='hidden-xs text-center'>{seat._buttons}</td></tr>",

    //_multiSeatOnTicket: true,
    _pNoSeat: true,
    // In phoi
    //_pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th>Số ghế</th><th>Địa chỉ cần đón</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='4' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'></td></tr></tfoot></table></div>",
    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th>Số ghế</th><th>Địa chỉ cần đón</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class=''><td>{seat._seatCodes}</td><td><b>{seat._pText}</b></td><td><b style='font-size: 20px;'>{seat._cname}</b></td><td><b style='font-size: 20px;'>{seat._cphone}</b></td><td class='hidden-xs'>{seat._status}</td><td>{seat._note}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",

    _hasPickUpOnPrintBKS: false,
    _tplNumCol: 4,
    _epnp: {
        "10": ["070", "075", "073"],

    },

    //block ghế theo biển số xe
    _blockSeatByVehicle: ["1|1|1", "1|1|2", "1|2|4", "1|3|4", "1|3|5"],
    //Mở khoá theo xe
    // _unblockSeatByVehicle: [
    // {
    // "29B-018.48": ["1|1|1", "1|1|2", "1|2|4", "1|3|4", "1|3|5"]

    // }
    // ],
    
    // In danh sach trung chuyen
    _tsfTpl: "<div class='tlist'>" +
				"<h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4>" +
				"<table class='table table-bordered table-responsive list-ticket'>" +
				"<thead>" +
					"<tr class='bg-primary'>" +
						"<th class='col-md-1 hidden-xs'>STT</th>" +
						"<th>Địa chỉ đón</th>" +
						"<th>Số ghế</th>" +
						"<th class='hidden-xs'>Tên HK</th>" +
						"<th>Số điện thoại</th>" +
						"<th class='hidden-xs'>Ghi chú</th>" +
					"</tr>" +
				"</thead>" +
				"<tbody></tbody>" +
				"<tfoot class='hidden-xs'>" +
					"<tr>" +
						//"<td colspan='5' style='text-align: right;'>Tổng cộng</td>" +
						//"<td><strong class='vred'>{t._total}</strong></td>" +
						//"<td colspan='2'>&nbsp;</td>" +
					"</tr>" +
					"<tr>" +
						"<td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td>" +
					"</tr>" +
				"</tfoot>" +
			"</table>" +
		"</div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'>{seat._note}</td></tr>",

    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='2' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._totalSeat}</strong></td><td colspan='3'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td style='font-size: 22px;'>{seat._pText}</td><td>{seat._seatCodes}</td><td><b style='font-size: 20px;'>{seat._cname}</b></td><td><b style='font-size: 22px;'>{seat._cphone}</b></td><td>{seat._note}</td></tr>",
    
	//Style Đón dọc đường
    _puTpl: "<div class='plist'>" +
				"<h4>DANH SÁCH ĐÓN DỌC ĐƯỜNG&nbsp;<small>chuyến {t._timeSlots}</small></h4>" +
				"<table class='table table-bordered table-responsive list-ticket'>" +
					"<thead>" +
						"<tr class='bg-primary'>" +
							"<th class='col-md-1 hidden-xs'>STT</th>" +
							"<th>Địa chỉ đón</th>" +
							"<th class='hidden-xs'>Tên HK</th>" +
							"<th>Số điện thoại</th>" +							
							"<th>Số ghế</th>" +
							"<th class='hidden-xs'>Ghi chú</th>" +
							"<th class='hidden-xs'>Tổng tiền</th>" +
							"<th class='hidden-xs'>Trạng thái</th>" +							
						"</tr>" +
					"</thead>" +
				"<tbody></tbody>" +
				"<tfoot class='hidden-xs'>" +
					"<tr>" +
						"<td colspan='5' style='text-align: right;'>Tổng cộng</td>" +
						"<td><strong class='vred'>{t._total}</strong></td>" +
						"<td colspan='2'>&nbsp;</td>" +
					"</tr>" +
					"<tr>" +
						"<td colspan='8'>" +
						"<button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button>" +
						"</td>" +
					"</tr>" +
				"</tfoot>" +
			"</table>" +
		"</div>",
    _ipuTpl: "<tr class='{seat._class}' data-code='{seat._code}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-pText='{seat._pText}'>" +
					"<td class='col-md-1 hidden-xs'><input class='form-control input-sm pIndex' type='text' value='{seat._index}' /></td>" +
					"<td>{seat._pText}</td>" +
					"<td class='hidden-xs'>{seat._cname}</td>" +
					"<td>{seat._cphone}</td>" +					
					"<td>{seat._seatCodes}</td>" +
					"<td class='hidden-xs'>{seat._note}</td>" +
					"<td class='hidden-xs'><strong>{seat._total}</strong></td>" +
					"<td class='hidden-xs'>{seat._status}</td>" +					
				"</tr>",
    //In đón dọc đường
    _ppuTpl: "<div class='list plist' style='font-size:20px;'>" +
				"<h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4>" +
				"<table class='table table-bordered' style='font-size:20px;'>" +
					"<thead>" +
						"<tr>" +
							"<th>STT</th>" +
							"<th>Địa chỉ đón</th>" +
							"<th>Tên HK</th>" +
							"<th>Số điện thoại</th>" +							
							"<th>Số ghế</th>" +
							"<th>Ghi chú</th>" +
							//"<th>Tổng tiền</th>" +
							//"<th>Trạng thái</th>" +							
						"</tr>" +
						//"<tr style='height:10px;'></tr>" +
						//"<tr style='height:10px;'></tr>" +
					"</thead>" +
					"<tbody></tbody>" +
					"<tfoot>" +
						// "<tr>" +
							// "<td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td>" +
							// "<td><strong>{t._total}</strong></td>" +
							// "<td colspan='2'>&nbsp;</td>" +
						// "</tr>" +
					"</tfoot>" +
				"</table>" +
			"</div>",
    _ippuTpl: "<tr>" +
				"<td>{seat._index}</td>" +
				"<td><span style='font-size:22px;'><b>{seat._pText}</b></span></td>" +
				"<td>{seat._cname}</td>" +
				"<td><span style='font-size:22px;'><b>{seat._cphone}</b></span></td>" +				
				"<td>{seat._seatCodes}</td>" +
				"<td>{seat._note}</td>" +
				//"<td><strong>{seat._total}</strong></td>" +
				//"<td>{seat._status}</td>" +				
			"</tr>",
			
			
    //Phoi
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
       + "<tbody>"
       + "<tr style='height:17px;'><td><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='ppickup {pseat._exported}'>{pseat._note}</p></td></tr>"
       + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'><b>{pseat._cphone}</b></p><p class='pnote' style='clear:both;'>{pseat._pInfo}</p></td></tr>"
       + "</tbody>"
       + "</table></li>",
  // Đặt thêm vé: copy các thông tin sau
		_copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
		_copyFieldRequired: ["Code"],
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
	
    _hasBTWarning: true,
	
	// in trung chuyển trên phơi
    // nếu có sẽ hiển thị trên phơi theo dữ liệu của biến _disTransferOnPST
    // nếu _disTransferOnPST là default thì sẽ lấy dữ liệu do người dùng nhập vào để hiển thị lên
    _hasTransferOnPST: true,
    _disTransferOnPST: "default",

    _limitedDateBefore: 2,
    _limitedMinuteBefore: 2880,

    // Trip Info
    _pSummaryTripInfo: false,
    _pSummaryTripInfoPageBreak: false,
    // _tripInfo: "<div style='margin-top:-9px;float:left;width:100%;'>" +
               // "<div style='float:left;width:49.4%;'>" +
                    // "<table style='width:100%;' cellspacing='0'>" +
                        // "<tbody>" +
                           // "<tr style='height:55px;'>" +
                               // "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;padding-top:3px;line-height:20px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Lên:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;............................................<br />&nbsp;&nbsp;&nbsp;Tiền Giang:&nbsp;&nbsp;&nbsp;............................................<br />&nbsp;&nbsp;&nbsp;Vãng Lai:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;............................................<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Về:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;............................................<br />&nbsp;&nbsp;&nbsp;Tiền Giang:&nbsp;&nbsp;&nbsp;............................................&nbsp;&nbsp;&nbsp;<br />&nbsp;&nbsp;&nbsp;Vãng Lai:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;............................................</td>" +
                           // "</tr>" +
                        // "</tbody>" +
                    // "</table>" +
                // "</div>" +
               // "<div style='float:right;width:50.1%;'>" +
                    // "<table style='width:100%;' cellspacing='0'>" +
                        // "<tbody>" +
                            // "<tr>" +
                                // "<td colspan='2' style='padding:3px 5px 5px 5px;border:1px solid #000;line-height:20px'>&nbsp;&nbsp;&nbsp;B.X Miền Tây:..............................................<br />&nbsp;&nbsp;&nbsp;Vé mời:...................................................<br />&nbsp;&nbsp;&nbsp;Ghế Súp:.................................................<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Tổng Cộng</b>:............................................<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Chi phí:</b>................................................<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Còn lại:</b>................................................</td>" +
                            // "</tr>" +
                        // "</tbody>" +
                    // "</table>" +
                // "</div>" +
           // "</div>",

});
