//Extend dict
define({
    _specialPos: {
        31: {
            "1_2_1": [1, 1, 1], "1_2_2": [1, 1, 2], "1_2_4": [1, 3, 1], "1_2_5": [1, 3, 2],
            "1_3_1": [1, 2, 4], "1_3_2": [1, 2, 5], "1_3_4": [1, 4, 1], "1_3_5": [1, 4, 2],
            "1_4_1": [1, 3, 4], "1_4_2": [1, 3, 5], "1_4_4": [1, 5, 1], "1_4_5": [1, 5, 2],
            "1_5_1": [1, 4, 4], "1_5_2": [1, 4, 5], "1_5_4": [1, 6, 1], "1_5_5": [1, 6, 2],
            "1_6_1": [1, 5, 4], "1_6_2": [1, 5, 5], "1_6_4": [1, 7, 1], "1_6_5": [1, 7, 2],
            "1_7_1": [1, 6, 4], "1_7_2": [1, 6, 5], "1_7_4": [1, 8, 1], "1_7_5": [1, 8, 2],
            "1_8_1": [1, 7, 4], "1_8_2": [1, 7, 5], "1_9_4": [1, 9, 1], "1_9_5": [1, 9, 2],
            "1_10_1": [1, 9, 3], "1_10_2": [1, 9, 4], "1_10_3": [1, 9, 5]
        },
        37: {
            "1_9_3": [1, 9, 5], "1_9_5": [1, 9, 3]

        },
        45: {
            "1_11_3": [1, 11, 5], "1_11_5": [1, 11, 3]

        }
    },

    // block văn phòng, chi nhánh không được phép bán vé một số tuyến đường
    _hasBlockTripByBranch: true,
    _blockTripByBranch: { // Id chi nhánh: các Id tuyến đường cần block
        54: [836, 209, 211, 207],
    },

    // khóa fromPoint khi đặt vé nhanh
    _hasBlockFromPoint: false,

    // mặc định chặng con theo từng tuyến đường
    _hasDefaultStagePerTrip: true,
    _defaultStagePerTrip: {
        // TripId: [DefaultFromId, DefaultToId]
        206: "1685, 1701"
    },


    // hiện nút P ngoài BKS: nhớ thêm các css sau vào file custom.css của nhà xe        div.buttons { width: 51% !important; } div.cinfo {width: 49% !important;}
    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _noBackground: true,
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
            + "<tbody>"
            + "<tr style='height: 22px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._nobackground} {pseat._paid} {pseat._exported}'>{pseat._pmInfo}</p></td></tr>"
            + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
            + "</tbody>"
            + "</table></li>",
    // Có nhiều giá
    _hasMultiFare: true,
    _pNoSeat: true,
    _pStyleUrl: "/Comp/510/print.css?v=1.0.1",
    _tplNumCol: 4,
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [4, { vi: "Tài xế thu" }, 1, "TX"], [7, { vi: "VeXeRe" }, 0, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"], [10, { vi: "Chuyển tiền" }, 1, "CT"]],
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
        [4, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
        [4, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
        [5, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
        //[5, 2, "Phụ thu", "input", "text", "Surcharge", "form-control  vblue fw700", "", {}, [], "đ"],
        // [5, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
        [6, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
        [6, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
        [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
        [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
        [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
        [7, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
        [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
        [7, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
        [7, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
        [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
        [10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
        [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
    ],
    "form-horizontal"
    ],
    _multiSeatOnTicket: true,
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
            206: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Vĩnh Long</div>"
                            + "<div style='float:right;width:65%;'>09 Nguyễn Huệ, P.8, Vĩnh Long</br>070.3825.399</div>"
                        + "</div>"
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
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Vĩnh Long</div>"
                            + "<div style='float:right;width:65%;'>09 Nguyễn Huệ, P.8, Vĩnh Long</br>070.3825.399</div>"
                        + "</div>"
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
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },
            207: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Vĩnh Long</div>"
                            + "<div style='float:right;width:65%;'>09 Nguyễn Huệ, P.8, Vĩnh Long</br>070.3825.399</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
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
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Vĩnh Long</div>"
                            + "<div style='float:right;width:65%;'>09 Nguyễn Huệ, P.8, Vĩnh Long</br>070.3825.399</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
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
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },
            208: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Sa Đéc</div>"
                            + "<div style='float:right;width:65%;'>56A Lê Thánh Tôn, P.2, thị xã Sa Đéc</br>067.3869.222</div>"
                        + "</div>"
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
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Sa Đéc</div>"
                            + "<div style='float:right;width:65%;'>56A Lê Thánh Tôn, P.2, thị xã Sa Đéc</br>067.3869.222</div>"
                        + "</div>"
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
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },
            209: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Sa Đéc</div>"
                            + "<div style='float:right;width:65%;'>56A Lê Thánh Tôn, P.2, thị xã Sa Đéc</br>067.3869.222</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
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
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Sa Đéc</div>"
                            + "<div style='float:right;width:65%;'>56A Lê Thánh Tôn, P.2, thị xã Sa Đéc</br>067.3869.222</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
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
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },
            210: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Trà Ôn</div>"
                            + "<div style='float:right;width:65%;'>số 03 khu 3, thị trấn Trà Ôn (đối diện bến xe buýt)</br>070.3744.020 - 070.3774.022</div>"
                        + "</div>"
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
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Trà Ôn</div>"
                            + "<div style='float:right;width:65%;'>số 03 khu 3, thị trấn Trà Ôn (đối diện bến xe buýt)</br>070.3744.020 - 070.3774.022</div>"
                        + "</div>"
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
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },
            211: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Trà Ôn</div>"
                            + "<div style='float:right;width:65%;'>số 03 khu 3, thị trấn Trà Ôn (đối diện bến xe buýt)</br>070.3744.020 - 070.3774.022</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
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
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                   + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Trà Ôn</div>"
                            + "<div style='float:right;width:65%;'>số 03 khu 3, thị trấn Trà Ôn (đối diện bến xe buýt)</br>070.3744.020 - 070.3774.022</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
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
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },
            835: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Bình Minh</div>"
                            + "<div style='float:right;width:65%;'>435 Thượng Thới, Bình Minh</br>070.3750.299 - 070.3750.277</div>"
                        + "</div>"
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
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                   + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                     + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:76%;float:right;text-align:center;font-size:29px;padding:2px 0 0 0;'>PHÚ VĨNH LONG</p></div>"
                    + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>XE GHẾ CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Hồ Chí Minh</div>"
                            + "<div style='float:right;width:65%;'>572 đường 3/2, P.14, Q.10</br>08.3866.0378</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;'>VP Bình Minh</div>"
                            + "<div style='float:right;width:65%;'>435 Thượng Thới, Bình Minh</br>070.3750.299 - 070.3750.277</div>"
                        + "</div>"
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
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                     + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            }
        }
    },
    _hasPickUpOnPrintBKS: false,
    _showUCharge: true,
    _ptsfTpl_NoSub: "<div class='list tlist' style='font-size:20px;'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered' style='font-size:20px;'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    _ppuTpl: "<div class='list plist' style='font-size:20px;'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered' style='font-size:20px;'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _ippuTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
});

