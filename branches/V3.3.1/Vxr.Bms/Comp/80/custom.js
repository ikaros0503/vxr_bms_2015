//Extend dict
define({
    _specialPos: {
        11: {
            "1_2_3": [1, 4, 2], "1_3_3": [1, 4, 3], "1_3_1": [1, 2, 3], "1_3_2": [1, 3, 1], "1_4_1": [1, 3, 2],
            "1_4_2": [1, 3, 3], "1_4_3": [1, 4, 1],
        }
    },
    _limitedDateBefore: 7,
    _limitedMinuteBefore: 120,

    // in ve mot lan
    _printETicketOnlyOne: true,

    _hasDefaultStagePerTrip: true,
    _defaultStagePerTrip: {
        // TripId: [DefaultFromId, DefaultToId]
        1115: "1780, 1673",
        1116: "1673, 1780"
    },

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
            [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [7, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
            [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [7, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
            [7, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
            [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            [8, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
            //[6, 1, "Điểm đi", "select", "Chọn điểm đi", "FromStop", "form-control", "", {}, [], ""],
            //[6, 2, "Điểm đến", "select", "Chọn điểm đến", "ToStop", "form-control", "", {}, [], ""],
            [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Khứ hồi", "btn btn-primary pull-left btn-return", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint-save", "", [], [], "", [1, 2]],
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
    _allowGroupByCode: true,
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

    // block ghế theo biển số xe
    _blockSeatByVehicle: ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    _unblockSeatByVehicle:
        {
            "29B-085.84": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-085.39": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-017.86": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-040.54": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-019.87": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-018.67": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-019.40": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-018.69": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            "29B-018.48": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-067.13": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-085.84": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-085.39": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-083.99": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-065.52": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-066.78": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-066.90": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-066.29": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-017.86": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-040.54": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-039.48": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-019.87": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-019.40": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-018.69": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-018.48": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
            //"29B-018.67": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"]
        },

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
    _pStyleUrl: "/Comp/80/print.css?v=1.0.49",
    _pTitleTpl: "<table class='print-title'><tbody><tr><td><strong class='rname'>{p._rname}</strong></td><td colspan='2'>Tài xế:&nbsp;{p._driverName}</td></tr><tr><td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Số xe:&nbsp{p._busNum}</td><td>Phụ xe: {p._assistantName}</td></tr></tbody></table>",
    _hasPickUpOnPrintBKS: false,
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
            + "<tbody>"
           + "<tr style='height: 18px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported} {pseat._onlyPaidBackGround}'><b>{pseat._cphone}</b></p></td></tr>"
            + "<tr><td><p class='pcname {pseat._dathanhtoan}'>{pseat._pmInfo}</p><p style='text-align:right;width:75%;float:right;height:16px;font-size:12.5px;white-space:nowrap;'><span class='cus-full-name'>{pseat._cFullName}</span><span class='cus-name'>{pseat._cname}</span>&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></span></p><p class='pnote'>{pseat._note} {pseat._fare}</p></td></tr>"
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

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _eTicket: {
        "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:77%;float:right;text-align:center;'>DOANH NGHIỆP TƯ NHÂN PHÚ VĨNH LONG</p></div>"
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
            + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div><img style='margin:0 auto;height:44px;width:200px !important;' class='img-responsive;' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

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
            1115: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px; margin-left: 19px !important;'><img src='http://nhaxe.vexere.com/Images/eticket/saoviet-ve.png' style='width: 90%;float:left;' /></div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Vp Hà Nội</div>"
                            + "<div style='float:right;width:70%;'>789 Giải phóng, Q.Hoàng Mai</br>(04) 3668.6358 - (04) 37.638.638</div>"
                            + "<div style='width: 100%; clear: both; height:6px;'></div>"
                            + "<div style='float:right;width:70%;'>07 Phạm Văn Đồng, Q.Cầu Giấy</br>(04) 3792.1266 - (04) 37.687.687</div>"

                        + "</div>"
                        + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Vp Lào Cai</div>"
                            + "<div style='float:right;width:70%;'>333 Phố Mới, Quảng trường Ga, Tp.Lào Cai</br>(0203) 638.638 - (0203).689.689</div>"
                        + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    + "<div class='row'><div class='col-xs-5' style='height: 36px; line-height: 36px; font-size:23px !important;'>"
                    //+ "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p><b>{ticket._from}</b></p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right' style='height: 36px; line-height: 36px; font-size:23px !important;'>"
                   // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    + "<p><b>{ticket._to}</b></p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>({ticket._numSeat}) Ghế:</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    //+ "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style='style:15px !important;'>{ticket._fare}/vé</span></p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style='style:17px !important;'><b>{ticket._total}</b> đ</span></p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase; font-size: 16px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"

                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Chi chú: {ticket._note}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Hồ Chí Minh</div>"
                            + "<div style='float:right;width:70%;'>274 Đồng Đen, P.10, Q.Tân Bình</br>Tp.Hồ Chí Minh</br>0903.515.330 - 01229.533.733</div>"
                        + "</div>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Cư Kuin</div>"
                            // + "<div style='float:right;width:70%;'>Chợ Trung Hòa, Cư Kuin, Đắk Lắk</br>(05003).633.733 - (05003).636.733</br>0905.882.082</div>"
                        // + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-12'>"
                    + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-12'>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>({ticket._numSeat}) Ghế:</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },
            1116: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Cư Kuin</div>"
                            + "<div style='float:right;width:70%;'>Chợ Trung Hòa, Cư Kuin, Đắk Lắk</br>(05003).633.733 - (05003).636.733</br>0905.882.082</div>"
                        + "</div>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Hồ Chí Minh</div>"
                            // + "<div style='float:right;width:70%;'>274 Đồng Đen, P.10, Q.Tân Bình</br>Tp.Hồ Chí Minh</br>0903.515.330 - 01229.533.733</div>"
                        // + "</div>"   
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>({ticket._numSeat}) Ghế:</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Cư Kuin</div>"
                            + "<div style='float:right;width:70%;'>Chợ Trung Hòa, Cư Kuin, Đắk Lắk</br>(05003).633.733 - (05003).636.733</br>0905.882.082</div>"
                        + "</div>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Hồ Chí Minh</div>"
                            // + "<div style='float:right;width:70%;'>274 Đồng Đen, P.10, Q.Tân Bình</br>Tp.Hồ Chí Minh</br>0903.515.330 - 01229.533.733</div>"
                        // + "</div>"   
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-12'>"
                    + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-12'>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>({ticket._numSeat}) Ghế:</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
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
                            "<tr style='height:32px;'>" +
                               "<td colspan='2' style='border:0;padding-top:5px;font-size:13.5px;'>* Nghiêm cấm tẩy xóa phơi lệnh<br />* Lái xe, phụ xe chấp hành thanh tra, kiểm sát và điều hành</td>" +
                            "</tr>" +
                        "</tbody>" +
                    "</table>" +
                "</div>" +
           "</div>",
});
