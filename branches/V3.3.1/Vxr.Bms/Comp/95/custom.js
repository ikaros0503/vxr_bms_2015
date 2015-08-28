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
                [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
                [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
                [6, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
                [6, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
                [6, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
                [6, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
                [6, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
                [6, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
                [6, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
                [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
                [8, 2, "Code", "input", "text", "Serial", "form-control", "", {}, [], ""],
                [9, 1, "Người đặt", "input", "text", "ResponsibilityUser", "form-control vblue fw700", "", {}, [], ""],
                [9, 2, "Ngày đón/về", "input", "text", "PickOrReturnDate", "form-control vblue fw700", "", {}, [], ""],
                //[10, 1, "sNote", "input", "text", "SNote", "form-control", "", {}, [], ""],
                [10, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
                [11, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
                [11, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
                [11, 1, "", "button", "button", "Khứ hồi", "btn btn-primary pull-left btn-return", "", [], [], "", [1, 2]],
                [11, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
                [11, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
            ],
            "form-horizontal"
    ],
    _pNoSeat: true,
    // _specialPos: {
    // 29: {
    // "1_1_4": [1, 10, 5]
    // }            
    // }, 
    _allowGroupByCode: true,
    _showUCharge: true,
    _noShowAgentInfo: true,
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
          + "<tbody>"
          + "<tr><td><p class='pseat-code'>{pseat._label}</p><p class='pmInfo ppayment'>{pseat._pmInfo}</p></td></tr>"
          + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'><b>{pseat._cphone}</b></p></td></tr>"
          + "<tr><td><p style='clear:both;'>{pseat._fare}</p></td></tr>"
          + "<tr><td><p class='pnote' style='clear:both;'>{pseat._note}</p></td></tr>"
          + "</tbody>"
          + "</table></li>",
    //_pTplNumCoach: 1,
    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: true,
    _pStyleUrl: "/Comp/95/print.css?v=1.0.9",
    _hasPickUpOnPrintBKS: false,
    // bắt buộc nhập thông tin tài xế mới cho phép bấm nút Xuất Bến
    // các thông tin bắt buộc gồm có
    // VehicleNumber: biển số xe
    // DriverName: tên tài xế
    // AssistantName: tên phục vụ
    _driverInfoRequired: true,
    _fieldDriverInfoRequired: ["VehicleNumber", "DriverName"],

    _frule: [
        [["UpdateForm", ["RoundTripCode", "FromArea", "ToArea"]], ["ValidForm", ["PassCode"]]],
        [
            [1, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]],
            [2, [["UpdateForm", ["KeepOnTime", "Fare", "Deposit", "Surcharge", "Discount", "PaymentType", "BranchName", "ChargeCode", "DriverName", "AgentName"]], ["ValidForm", ["PassCode"]]]],
            [3, [["UpdateForm", ["PhoneNumbers", "FullName", "PickupInfo", "TransferInfo", "Fare", "Deposit", "Surcharge", "Discount", "PaymentType", "Serial", "Note", "KeepOnTime", "BranchName", "ChargeCode", "DriverName"]], ["ValidForm", ["PassCode"]]]],
            [5, [["UpdateForm", ["KeepOnTime", "PaymentType", "Fare"]]]],
            [8, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]]
        ]
    ], //Multiple ticket, status of ticket, not same value

    // Vé khứ hồi: copy các thông tin sau
    _returnField: ["FullName", "PickupInfo"],
    _returnFieldRequired: [""],
	
	// Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["Code"],

    // danh sách đón khách
    _puTpl: "<div class='plist'><h4>DANH SÁCH ĐÓN DỌC ĐƯỜNG&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Code</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='6' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='8'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _ipuTpl: "<tr class='{seat._class}' data-code='{seat._code}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-pText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm pIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._code}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._note}</td></tr>",
    //_ppuTpl: "<div class='list plist'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _ppuTpl: "<div class='list plist'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered'><thead><tr><th>Địa chỉ đón</th><th>Số lượng ghế</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='1' style='text-align: right; padding-right: 5px;'><b>Tổng cộng</b></td><td>{t._totalSeat}</td><td colspan='4'></td></tr></tfoot></table></div>",
    _ippuTpl: "<tr><td>{seat._pText}</td><td><b>{seat._numSeat}</b></td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._note}</td></tr>",

    // _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    // _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    // _ptsfTpl: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    // _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",	  

    // in phơi
    //_pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th>Số ghế</th><th>Tên HK</th><th>Code</th><th>Điểm đón</th><th>Số điện thoại</th><th>Đại lý</th><th>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    //_ipcLTpl: "<tr class='{seat._class}'><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._seri}</td><td>{seat._pText}</td><td>{seat._cphone}</td><td>{seat._pmInfoName}</td><td>{seat._note}</td></tr>",
    //_psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",

    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th>Số ghế</th><th>Tên HK</th><th>Code</th><th>Điểm đón</th><th>Số điện thoại</th><th>Đại lý</th><th>Ghi chú</th><th>Người đặt</th><th>Ngày đón/về</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class='{seat._class}'><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._seri}</td><td>{seat._pText}</td><td>{seat._cphone}</td><td>{seat._pmInfoName}</td><td>{seat._note}</td><td>{seat._responUser}</td><td>{seat._porDate}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",
});
//extension members
$.extend(true, $.custom.vbooking.prototype, {
    _renderPrintSeatTemplate: function () {
        var self = this;

        var $table = $(_dict._pclTpl);
        var $tbody = $table.find('tbody');

        var stickets = [];
        var stickets2 = [];
        var nstickets = [];
        var nstickets2 = [];
        var customer = [];

        var paid = 0;
        var total = 0;
        $.each(self._m, function (ic, c) {
            if (typeof c != "undefined") {
                $.each(c, function (ir, r) {
                    if (typeof r != "undefined") {
                        $.each(r, function (is, s) {
                            if (typeof s != "undefined" && s != null) {
                                var t = s._getCurrentTicket();
                                if (!$.isEmptyObject(t)) {
                                    var pInfo = t._getPickupInfo();
                                    var pIndex = 0;
                                    var pText = "";
                                    var pmInfo = t._getPaymentInfo();
                                    if (!$.isEmptyObject(pInfo)) {
                                        pIndex = parseInt(pInfo.pIndex);
                                        pText = pInfo.text;
                                    }
                                    var ticketCode = t._code;
                                    var cname = t._cname;
                                    var cphone = t._getDefaultPhoneNumber();

                                    if (pIndex == 0) {
                                        if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                            var nTextCode = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                            var nKeyCode = customer.indexOf(nTextCode);
                                            if (nKeyCode == -1) {
                                                nKeyCode = customer.push(nTextCode) - 1;
                                            }
                                            if (typeof nstickets[nKeyCode] == "undefined") {
                                                nstickets[nKeyCode] = {
                                                    _pIndex: pIndex,
                                                    _seatCodes: [],
                                                    _seatInfos: [],
                                                    _tids: [],
                                                    _seri: t._seri,
                                                    _cname: cname,
                                                    _cphone: cphone,
                                                    _code: ticketCode,
                                                    _pText: pText,
                                                    _note: t._note,
                                                    _pdate: [],
                                                    _status: t._status,
                                                    _cuser: t._cuser,
                                                    _total: 0,
                                                    _pmInfoCode: pmInfo.info != undefined ? pmInfo.info._code : "",
                                                    _pmInfoName: pmInfo.info != undefined ? pmInfo.info._name : ""
                                                };
                                            }
                                            nstickets[nKeyCode]._seatCodes.push(s._label);
                                            nstickets[nKeyCode]._seatInfos.push(s._getSeatInfo());
                                            nstickets[nKeyCode]._tids.push(t._id);
                                            nstickets[nKeyCode]._pdate.push(t._pdate.toFormatString('iso'));
                                            nstickets[nKeyCode]._total += t._fare;
                                        } else {
                                            if (!vIsEstStr(cphone)) {
                                                nstickets2.push({
                                                    _seatCodes: [s._label],
                                                    _cname: cname,
                                                    _cphone: cphone,
                                                    _code: ticketCode,
                                                    _pText: pText,
                                                    _note: t._note,
                                                    _status: t._status,
                                                    _class: "",
                                                    _seri: t._seri,
                                                    _cuser: t._cuser,
                                                    _suser: t._suser,
                                                    _pmInfoCode: pmInfo.info != undefined ? pmInfo.info._code : "",
                                                    _pmInfoName: pmInfo.info != undefined ? pmInfo.info._name : ""
                                                });
                                            } else {
                                                var ntext = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var nkey = customer.indexOf(ntext);
                                                if (nkey == -1) {
                                                    nkey = customer.push(ntext) - 1;
                                                }

                                                if (typeof nstickets[nkey] == "undefined") {
                                                    nstickets[nkey] = {
                                                        _seatCodes: [],
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _code: ticketCode,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _status: t._status,
                                                        _class: "",
                                                        _seri: t._seri,
                                                        _cuser: t._cuser,
                                                        _suser: t._suser,
                                                        _pmInfoCode: pmInfo.info != undefined ? pmInfo.info._code : "",
                                                        _pmInfoName: pmInfo.info != undefined ? pmInfo.info._name : ""
                                                    };
                                                }
                                                nstickets[nkey]._seatCodes.push(s._label);
                                            }
                                        }
                                    } else {
                                        if (pInfo.type == 'P') {
                                            if (typeof stickets[pIndex] == "undefined") {
                                                stickets[pIndex] = [];
                                            }
                                            if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                                var sTextCode = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var sKeyCode = customer.indexOf(sTextCode);
                                                if (sKeyCode == -1) {
                                                    sKeyCode = customer.push(sTextCode) - 1;
                                                }
                                                if (typeof stickets[pIndex][sKeyCode] == "undefined") {
                                                    stickets[pIndex][sKeyCode] = {
                                                        _pIndex: pIndex,
                                                        _seatCodes: [],
                                                        _seatInfos: [],
                                                        _tids: [],
                                                        _seri: t._seri,
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _code: ticketCode,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _pdate: [],
                                                        _status: t._status,
                                                        _cuser: t._cuser,
                                                        _total: 0,
                                                        _pmInfoCode: pmInfo.info != undefined ? pmInfo.info._code : "",
                                                        _pmInfoName: pmInfo.info != undefined ? pmInfo.info._name : ""
                                                    };
                                                }
                                                stickets[pIndex][sKeyCode]._seatCodes.push(s._label);
                                                stickets[pIndex][sKeyCode]._seatInfos.push(s._getSeatInfo());
                                                stickets[pIndex][sKeyCode]._tids.push(t._id);
                                                stickets[pIndex][sKeyCode]._pdate.push(t._pdate.toFormatString('iso'));
                                                stickets[pIndex][sKeyCode]._total += t._fare;
                                            } else {

                                                var text = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var key = customer.indexOf(text);
                                                if (key == -1) {
                                                    key = customer.push(text) - 1;
                                                }
                                                if (typeof stickets[pIndex][key] == "undefined") {
                                                    stickets[pIndex][key] = {
                                                        _seatCodes: [],
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _code: ticketCode,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _status: t._status,
                                                        _class: "pickup",
                                                        _seri: t._seri,
                                                        _cuser: t._cuser,
                                                        _suser: t._suser,
                                                        _pmInfoCode: pmInfo.info != undefined ? pmInfo.info._code : "",
                                                        _pmInfoName: pmInfo.info != undefined ? pmInfo.info._name : ""
                                                    };
                                                }
                                                stickets[pIndex][key]._seatCodes.push(s._label);
                                            }

                                        } else if (pInfo.type == 'T') {
                                            if (typeof stickets2[pIndex] == "undefined") {
                                                stickets2[pIndex] = [];
                                            }
                                            if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                                var sTextCode2 = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var sKeyCode2 = customer.indexOf(sTextCode2);
                                                if (sKeyCode2 == -1) {
                                                    sKeyCode2 = customer.push(sTextCode2) - 1;
                                                }
                                                if (typeof stickets2[pIndex][sKeyCode2] == "undefined") {
                                                    stickets2[pIndex][sKeyCode2] = {
                                                        _pIndex: pIndex,
                                                        _seatCodes: [],
                                                        _seatInfos: [],
                                                        _tids: [],
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _seri: t._seri,
                                                        _code: ticketCode,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _pdate: [],
                                                        _status: t._status,
                                                        _cuser: t._cuser,
                                                        _total: 0,
                                                        _pmInfoCode: pmInfo.info != undefined ? pmInfo.info._code : "",
                                                        _pmInfoName: pmInfo.info != undefined ? pmInfo.info._name : ""
                                                    };
                                                }
                                                stickets2[pIndex][sKeyCode2]._seatCodes.push(s._label);
                                                stickets2[pIndex][sKeyCode2]._seatInfos.push(s._getSeatInfo());
                                                stickets2[pIndex][sKeyCode2]._tids.push(t._id);
                                                stickets2[pIndex][sKeyCode2]._pdate.push(t._pdate.toFormatString('iso'));
                                                stickets2[pIndex][sKeyCode2]._total += t._fare;
                                            } else {
                                                var text2 = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var key2 = customer.indexOf(text2);
                                                if (key2 == -1) {
                                                    key2 = customer.push(text2) - 1;
                                                }
                                                if (typeof stickets2[pIndex][key2] == "undefined") {
                                                    stickets2[pIndex][key2] = {
                                                        _seatCodes: [],
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _code: ticketCode,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _status: t._status,
                                                        _class: "",
                                                        _seri: t._seri,
                                                        _cuser: t._cuser,
                                                        _suser: t._suser,
                                                        _pmInfoCode: pmInfo.info != undefined ? pmInfo.info._code : "",
                                                        _pmInfoName: pmInfo.info != undefined ? pmInfo.info._name : ""
                                                    };
                                                }
                                                stickets2[pIndex][key2]._seatCodes.push(s._label);
                                            }
                                        }
                                    }

                                    if (t._isPaid() || t._isPass()) {
                                        paid++;
                                    }
                                    total++;
                                }
                            }
                        });
                    }
                });
            }
        });
        var temp = stickets.concat(stickets2);

        if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
            temp[temp.length] = nstickets;
        } else {
            temp[temp.length] = nstickets.concat(nstickets2);
        }

        if (temp.length > 0) {
            var index = 1;
            $.each(temp, function (ix, s) {
                if (typeof s != "undefined" && s != null) {
                    if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
                        Object.keys(s).forEach(function (key) {
                            var value = s[key];
                            var slen = value._seatCodes.length;
                            var data = {
                                "seat": {
                                    _index: index,
                                    _cname: value._cname,
                                    _cphone: value._cphone,
                                    _pText: value._pText,
                                    _note: value._note,
                                    _seatCodes: value._seatCodes.join(", ") + " (" + slen + "v)",
                                    _status: value._status == 1 ? "Đặt chỗ" : "Đã TT",
                                    _class: value._class,
                                    _seri: value._seri,
                                    _cuser: value._cuser,
                                    _suser: value._suser,
                                    _code: value._code,
                                    _pmInfoCode: value._pmInfoCode,
                                    _pmInfoName: value._pmInfoName
                                }
                            }
                            var $tr = $(vtpl(_dict._ipcLTpl, data));
                            $tbody.append($tr);

                            index++;
                        });
                    } else {
                        $.each(s, function (_, sx) {
                            if (typeof sx != "undefined" && sx != null) {
                                var slen = sx._seatCodes.length;
                                var data = {
                                    "seat": {
                                        _index: index,
                                        _cname: sx._cname,
                                        _cphone: sx._cphone,
                                        _pText: sx._pText,
                                        _note: sx._note,
                                        _seatCodes: sx._seatCodes.join(", ") + " (" + slen + "v)",
                                        _status: sx._status == 1 ? "Đặt chỗ" : "Đã TT",
                                        _class: sx._class,
                                        _seri: sx._seri,
                                        _cuser: sx._cuser,
                                        _suser: sx._suser,
                                        _code: sx._code,
                                        _pmInfoCode: sx._pmInfoCode,
                                        _pmInfoName: sx._pmInfoName
                                    }
                                }

                                var $tr = $(vtpl(_dict._ipcLTpl, data));
                                $tbody.append($tr);

                                index++;
                            }
                        });
                    }
                }
            });
        } else {
            $tbody.append($('<tr />').append($('<td />').attr('colspan', '6').text("Chưa có hành khách đặt vé chuyến xe này")));
        }

        var $body = $('<div />').addClass('row');
        $body.append($table);
        //Sumary
        var sm = {
            "s": {
                _stotal: total,
                _spaid: paid
            }
        }
        $body.append(vtpl(_dict._psmTpl, sm));

        return $body;
    },
});
