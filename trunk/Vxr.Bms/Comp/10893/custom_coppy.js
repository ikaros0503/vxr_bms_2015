//Extend dict
define({
	_pStyleUrl: "/Comp/10893/print.css?v=1.0.1",
    _pSpecialPos: {
        41: {
            "2_7_1": [1, 7, 1], "2_7_2": [1, 7, 2]
        }
    },
    // _limitedDateBefore: 7,
    // _limitedMinuteBefore: 120,

    // _hasDefaultStagePerTrip: true,
    // _defaultStagePerTrip: {
        // // TripId: [DefaultFromId, DefaultToId]
        // 1115: "1780, 1673",
        // 1116: "1673, 1780"
    // },

    // Có nhiều giá (giá các chặng con)
    _hasMultiFare: true,

    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 0, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
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
            [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
            [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [6, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [6, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [6, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [6, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
            [6, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [6, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
            [6, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
            [7, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            [7, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
            [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Khứ hồi", "btn btn-primary pull-left btn-return", "", [], [], "", [1, 2]],

            [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
    ],
    _hasBTWarning: true,
    // dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
    // 5|10092|1: quyền này sẽ mở khóa các button 
    _closedTripConf: {
        "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save"],
        "ValidForm": []
    },
    //_allowGroupByCode: true,
    _epnp: {
        "10": [
            "043"
        ],
    },
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

    

    //payment, agent, phone, note, pickup, transfer, fare
    // value1&value2: value1 va value2 phai dc nhap
    // value1[abc]&value2: value1 va value2 phai dc nhap, value1 phai co gia tri abc
    // đối với giá vé: giá trị nhỏ nhất là 0
    // fare[>=600000]: giá vé phải lớn hơn hoặc bằng 600000
    // fare[<=400000]: giá vé phải nhỏ hơn hoặc bằng 400000, có thể bằng 0
    // fare[=300000]: giá vé phải bằng 300000
    // fare[>0]: giá vé phải lớn hơn 0
    // fare[<500000]: giá vé phải nhỏ hơn 500000, có thể bằng 0
    // !payment->fare[>0]: nếu có payment thì fare phải lớn hơn 0 
    //_updateFormValidatingErrorMessage: thông báo khi cập nhật sai
    //_updateFormValidatingErrorMessages: thông báo khi cập nhật sai cho từng field cụ thể, nếu không có thì dùng thông báo chung
    _updateFormValidatingConditions: ["payment&fare[>=0]", "phone&!payment->fare[>=0]", "note&!payment->fare[>=0]"],
    _updateFormValidatingErrorMessage: "Thông tin cập nhật chưa đúng! Vui lòng kiểm tra lại.",
    _updateFormValidatingErrorMessages: {
        "phone": "Vui lòng nhập số điện thoại.",
        "fare": "Giá vé phải lớn hơn 0.",
    },


    // phan quyen bao cao
    _hasReportPermission: false,
    
    _pTitleTpl: "<table class='print-title'><tbody><tr><td><strong class='rname'>{p._rname}</strong></td><td colspan='2'>Tài xế:&nbsp;{p._driverName}</td></tr><tr><td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Số xe:&nbsp{p._busNum}</td><td>Phụ xe: {p._assistantName}</td></tr></tbody></table>",
    _hasPickUpOnPrintBKS: false,
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
            + "<tbody>"
            + "<tr style='height: 18px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported} {pseat._onlyPaidBackGround}'><span class='fare'><b>{pseat._fare}</b></span></p></td></tr>"
			+ "<tr style='height: 18px;'><td><p class='pmInfo {pseat._dathanhtoan}'>{pseat._pmInfo}&nbsp;<span class='ntk-pertrip'><b>{pseat._nTicketPerTrip}</b></span></p></td></tr>"
            + "<tr><td><p class='stage'>{pseat._stageName}</p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
            + "</tbody>"
            + "</table></li>",
    // _sTpl: "<li class='seat {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
    // + "<div class='agentinfo clearfix'><p>{seat._suser}{seat._cuser}</p><p>{seat._note}&nbsp;{seat._fare}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span>{seat._pmInfo}</span></p><p class='phone'>{seat._cphone}</p></div></div></div></li>",
    // _pstpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
    // + "<tbody>"
    // + "<tr style='height: 18px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported} {pseat._onlypaidbackground}'><b>{pseat._cphone}</b></p></td></tr>"
    // + "<tr><td><p class='pcname {pseat._dathanhtoan}'>{pseat._pminfo}</p><p style='text-align:right;width:75%;float:right;height:16px;font-size:12.5px;'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nticketpertrip}</b></span></p><p class='pnote'>{pseat._stagename} <span style='text-transform: lowercase;'>{pseat._fare} {pseat._note}</span></p></td></tr>"
    // + "</tbody>"
    // + "</table></li>",

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-ticket-code='{seat._code}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",
	//Style ds trung chuyển
    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    //In ds trung chuyển
    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
   
    _eTicket: {
          "custom": {
            156507: {
                "sm": "<div style='width:530px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px; margin-left: 19px !important;margin-top:25px;'><img src='http://nhaxe.vexere.com/Images/eticket/duylong-ve.png' style='width: 20%;float:left;margin-left:36px;' /><p style='font-family: initial;height: 102px;line-height: 102px;width:67%;float:right;margin-left:30px;font-size:42px !important;'>DUY LONG</p></div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12' style='font-size:17px;'>"
                        + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Vp Hải Phòng</div>"
                            + "<div style='float:right;width:70%;'>328 Trần Nguyên Hãn, Lê Chân, Tp.Hải Phòng</div>"
                           
                        + "</div>"
                        + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Vp Lào Cai</div>"
                            + "<div style='float:right;width:70%;'>77 Ngô Văn Sở, Phố Mới, Tp.Lào Cai</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Đặt Vé</div>"
                            + "<div style='float:right;width:70%;'>0965.661.661 - 0962.661.661</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Hotline</div>"
                            + "<div style='float:right;width:70%;'>0986.44.6666 - 0986.880.880</div>"
                        + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;' style='font-size:17px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                   // + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;margin-left:28px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;' style='font-size:17px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                   // + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;font-size:17px;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:30px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;font-size:17px;'>({ticket._numSeat}) Ghế:</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:30px;'>{ticket._seatCodes}</h3></div></div>"
                    //+ "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;font-size:17px;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;font-size:20px;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;font-size:22px;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:20px;'>Đón: {ticket._pick}</p><p style='font-size:20px;'>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;margin-top:10px;'><img style='margin:0 auto;height:50px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                       },
				156508: {
                "sm": "<div style='width:530px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px; margin-left: 19px !important;margin-top:25px;'><img src='http://nhaxe.vexere.com/Images/eticket/duylong-ve.png' style='width: 20%;float:left;margin-left:36px;' /><p style='font-family: initial;height: 102px;line-height: 102px;width:67%;float:right;margin-left:30px;font-size:42px !important;'>DUY LONG</p></div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12' style='font-size:17px;'>"
                        + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Vp Hải Phòng</div>"
                            + "<div style='float:right;width:70%;'>328 Trần Nguyên Hãn, Lê Chân, Tp.Hải Phòng</div>"
                           
                        + "</div>"
                        + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Vp Lào Cai</div>"
                            + "<div style='float:right;width:70%;'>77 Ngô Văn Sở, Phố Mới, Tp.Lào Cai</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Đặt Vé</div>"
                            + "<div style='float:right;width:70%;'>0965.661.661 - 0962.661.661</div>"
                        + "</div>"
						+ "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Hotline</div>"
                            + "<div style='float:right;width:70%;'>0986.44.6666 - 0986.880.880</div>"
                        + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;' style='font-size:17px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                   // + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;margin-left:28px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;' style='font-size:17px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                   // + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;font-size:17px;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:30px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;font-size:17px;'>({ticket._numSeat}) Ghế:</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size:30px;'>{ticket._seatCodes}</h3></div></div>"
                    //+ "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;font-size:17px;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;font-size:20px;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;font-size:22px;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:20px;'>Đón: {ticket._pick}</p><p style='font-size:20px;'>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;margin-top:10px;'><img style='margin:0 auto;height:50px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                       }
        }

    },

    // Trip Info
    _pSummaryTripInfo: true,
    _pSummaryTripInfoPageBreak: false,
    _tripInfo: "<div style='margin-top:7px;float:left;width:100%;'>" +
               "<div style='float:left;width:49.4%;'>" +
                    "<table style='width:100%;' cellspacing='0'>" +
                        "<tbody>" +
                           "<tr style='height:140px;'>" +
                               "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;'>{p._totalPaidPerType} <br />&#x21d2; Tổng:&nbsp;&nbsp;{p._totalPaid} <br />&nbsp;&nbsp;&nbsp;&nbsp;{p._feeTienKhachFormat} &nbsp;&nbsp;{p._anotherFareTienKhachFormat}<br />&nbsp;&nbsp;&nbsp;&nbsp;{p._totalTienKhachFormat}</td>" +
                           "</tr>" +
                           "<tr>" +
                                "<td colspan='2' style='padding:0px 5px;border:1px solid #000;border-top:0;border-bottom:0;'>{p._moneyBranchProduct}</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' style='padding:3px 5px 5px 5px;border:1px solid #000;border-top:0;'><span style='font-size:14px;'>D.đường:</span> {p._pickedProductFormat}</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' style='padding:3px 5px 5px 5px;border:1px solid #000;border-top:0;'>{p._totalTienHangFormat}</td>" +
                            "</tr>" +
							 "<tr style='height:32px;'>" +
                               "<td colspan='2' style='border:0;padding-top:5px;font-size:13.5px;'>* Nghiêm cấm tẩy xóa phơi lệnh<br />* Lái xe, phụ xe chấp hành thanh tra, kiểm sát và điều hành</td>" +
                            "</tr>" +
                        "</tbody>" +
                    "</table>" +
                "</div>" +

               "<div style='float:right;width:50.1%;'>" +
                    "<table style='width:100%;' cellspacing='0'>" +
                        "<tbody>" +
                            "<tr>" +
                                "<td style='width:50%;padding:3px 5px;border-left:1px solid #000;border-top:1px solid #000;'>Cầu đường: {p._tollFee}</td>" +
                                "<td style='width:50%;padding:3px 5px;border-right: 1px solid #000;border-top:1px solid #000;'>Rửa xe: {p._washFee}</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td style='width:50%;padding:3px 5px;border-left: 1px solid #000;'>Tiền ăn: {p._eatFee}</td>" +
                                "<td style='width:50%;padding:3px 5px;border-right: 1px solid #000;'></td>" +
                            "</tr>" +
                            "<tr style='height:86px;vertical-align:top;'>" +
                                "<td colspan='2' style='width:100%;padding:3px 5px;border-left: 1px solid #000;border-right: 1px solid #000;'>CPkhác: &nbsp;{p._anotherFee}</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' style='padding:3px 5px 3px 5px;border:1px solid #000;border-bottom:0;'>TK: {p._totalTienKhach}</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' style='padding:3px 5px 3px 5px;border:1px solid #000;border-bottom:0;'>TH: {p._totalTienHang}</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td style='padding:3px 5px 3px 5px;border:1px solid #000;width:50%;border-right:0;'>CHI: {p._totalFee}</td>" +
                                "<td style='padding:3px 5px 3px 5px;border:1px solid #000;width:50%;border-left:0;'>Còn lại: {p._totalTotal}</td>" +
                            "</tr>" +
                           
                        "</tbody>" +
                    "</table>" +
                "</div>" +
           "</div>",
		   
		 // Print Special Note
        _pSNote: true,
        // vị trí tầng được áp dụng in ghi chú đặc biệt
        _pSNoteCoachEffective: {
            
			41: 1
        },
        _pSNoteInfo: {
            
			41: {
                1: "<div style='position:relative;clear:both;width:690px;margin-top:960px;'>" +
					 "<table cellpadding='0' cellspacing='0' border='0' width='100%' style='position:absolute;'>" +
                     "<tr><th style='border:1px solid #000;width:45px;'>STT</th><th style='border:1px solid #000;border-left:0;width:120px;'>Nơi đi</th><th style='border:1px solid #000;border-left:0;width:120px;'>Nơi đến</th><th style='border:1px solid #000;border-left:0;width:70px;'>SL khách</th><th style='border:1px solid #000;border-left:0;width:80px;'>Giá vé</th><th style='border:1px solid #000;border-left:0;width:100px;'>Thành tiền</th><th style='border:1px solid #000;border-left:0;'>Ghi chú</th></tr>" + 
                     
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-top:0;border-bottom:0;width:45px;'>A01</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0'></th></tr>" + 
					 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B01</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C01</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A02</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B02</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C02</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A03</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B03</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C03</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A04</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B04</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C04</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A05</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B05</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C05</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A06</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B06</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C06</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A07</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B07</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C07</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A08</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B08</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C08</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A09</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B09</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C09</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A10</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B10</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C10</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A11</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B11</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C11</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>A12</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>B12</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>C12</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>1</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>2</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>3</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;border-bottom:0;width:45px;'>4</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 "<tr style='height:20px;'><th style='border:1px solid #000;width:45px;'>5</th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:120px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;border-bottom:0width:100px;'></th><th style='border:1px solid #000;border-left:0;border-bottom:0'></th></tr>" + 
					 
					 
					 "<tr style='height:20px;'><th colspan='3' style='border:1px solid #000;border-top:0;'><b>Tổng cộng:</b><th style='border:1px solid #000;border-left:0;border-top:0;width:70px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;width:80px;'></th><th style='border:1px solid #000;border-left:0;border-top:0;width:100px;border-right:0;'></th><th style='border:1px solid #000;border-left:0;'></th></tr>" + 
                     
					 "</table>" +
					"</div>",
                2: "",
            }
            
        }
});
