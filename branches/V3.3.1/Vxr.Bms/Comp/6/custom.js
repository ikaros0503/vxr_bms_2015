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
        //[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
        [1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
        [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
        [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
        [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
        [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
        [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
        [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
        [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
        [5, 2, "+ Ăn", "input", "text", "Surcharge", "form-control vblue fw700", "30.000", {}, [], "đ"],
        [6, 1, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
        [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
        [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
        [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
        [7, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
        [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
        [7, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
        [7, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
        //[8, 1, "Seri", "input", "text", "Serial", "form-control", "", {}, [], ""],
        [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
        [8, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
        [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
        [10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
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
    // _allowGroupByCode: true,
    _pTplNumCoach: 1,
    _pStyleUrl: "/Comp/6/print.css?v=1.0.31",
    _historyKeys: {
        "AgentInfo": { "vi": "VP/CN" },
        "TripDate": { "vi": "Chuyến" },
        "IssueDate": { "vi": "Ngày đặt" },
        "PickupDate": { "vi": "Giờ đón" },
        "Status": { "vi": "Trạng thái" },
        "Fare": { "vi": "Giá" },
        "CreatedUser": { "vi": "Người đặt" },
        "SeatCode": { "vi": "Mã ghế" },
        "CustomerInfo": { "vi": "Hành khách" },
        "PickupInfo": { "vi": "Đón" },
        "Serial": { "vi": "Số seri" },
        "PaymentInfo": { "vi": "Thanh toán" },
        "RoundTripCode": { "vi": "Mã khứ hồi" },
        "Note": { "vi": "Ghi chú" },
        "Surcharge": { "vi": "+ Ăn" }
    },
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
  + "<tbody>"
  + "<tr><td><p class='pseat-code'>{pseat._label}</p><p class='pmInfo ppayment'>{pseat._pmInfo}</p></td></tr>"
  + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'><b>{pseat._cphone}</b></p></td></tr>"
  + "<tr><td><p class='pnote' style='clear:both;'>{pseat._note}</p></td></tr>"
  + "<tr><td><p class='ppickup'>TC:&nbsp;<span>{pseat._pInfo}</span></p></td></tr>"
  + "</tbody>"
  + "</table></li>",
    _hasPickUpOnPrintBKS: false,
    _noShowAgentInfo: true,
    _showUCharge: true,
    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Số ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='7' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._numSeat}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ptsfTpl_NoSub: "<div class='list tlist ds-trung-chuyen'><h3 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h3><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th></tr></thead><tbody></tbody></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._numSeat}</td><td>{seat._cname}</td><td>{seat._cphone}</td></tr>",
		
	// in trung chuyển trên phơi
    // nếu có sẽ hiển thị trên phơi theo dữ liệu của biến _disTransferOnPST
    _hasTransferOnPST: true,
    _disTransferOnPST: "default",
});
