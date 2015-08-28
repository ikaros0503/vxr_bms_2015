//Extend dict
define({
    _pStyleUrl: "/Comp/543/print.css?v=1.0.12",
    // _specialPos: {
    // 40: {
    // "1_6_5": [1, 6, 3], "1_6_4": [1, 6, 2], "1_6_3": [1, 6, 1], "1_6_2": [1, 6, 5], "1_6_1": [1, 6, 4],
    // "2_6_5": [2, 6, 3], "2_6_4": [2, 6, 2], "2_6_3": [2, 6, 1], "2_6_2": [2, 6, 5], "2_6_1": [2, 6, 4]
    // },

    // },
    // hiện nút P ngoài BKS: nhớ thêm các css sau vào file custom.css của nhà xe        div.buttons { width: 51% !important; } div.cinfo {width: 49% !important;}
    //_st: [[0], [2, 3, 4], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    //_allowGroupByCode: false,
    _noBackground: true,
    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick' style='font-size:12px !important;'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p class='cinfo'><span class='name' style='font-size:12px !important;'><b>{seat._cname}</b><span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p><p>{seat._note}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
            + "<tbody>"
            + "<tr style='height: 14px;'><td><p class='pseat-code {pseat._dathanhtoan}'>&nbsp;&nbsp;{pseat._label}</p></td></tr>"
            + "<tr><td><p class='pcname' styele='height:18px;'><b>{pseat._cname}</b>&nbsp;{pseat._nTicketPerTrip}</p><p class='pcphone'>{pseat._cphone}</p></td></tr>"
            + "<tr><td><p class='pmInfo' style='text-transform:lowercase;'>{pseat._pInfo}</p></td></tr>"
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
        //[6, 2, "Đặt cọc", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "đ"],
        [6, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
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
    //_pTplNumCoach: 2,
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



    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _hasBTWarning: true,
    _multiSeatOnTicket: false,

    _eTicket: {
        "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/images/eticket/phu-vinh-long.jpg' style='width: 70px;float:left;' /><p style='width:77%;float:right;text-align:center;'>doanh nghiệp tư nhân phú vĩnh long</p></div>"
            + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:70%;margin:0 auto;height:30px;line-height:20px;'>khách hàng là thượng đế</div>"
            + "<div class='row'><div class='col-xs-12'><p style='margin-top:5px;'>{ticket._phone}<br/>{ticket._address}</p></div></div><hr style='border:1px #000 solid; margin:0'/>"
            + "<div class='row'><div class='col-xs-5'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;'>{ticket._fromarea}</span></h5>"
            + "<p>{ticket._from}</p>"
            + "</div>"
            + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2192;</h3></div>"
            + "<div class='col-xs-5 text-right'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;'>{ticket._toarea}</span></h5>"
            + "<p>{ticket._to}</p>"
            + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
            + "<p style='margin-bottom:0;'>ngày đi: <span style='text-decoration:underline;'>{ticket._tripdate}</span></p>"
            + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._triphour}</h3></div>"
            + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>ghế ({ticket._numseat}):</p>"
            + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatcodes}</h3></div></div>"
            + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
            + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
            + "<p>đón: {ticket._pick}</p><p>nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

        "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/images/eticket/hoa-thuan-anh.png' style='width: 70px;' />hòa thuận anh express</div>"
            + "<div class='row'><div class='col-xs-12'><p style='margin-top:5px;'>{ticket._phone}<br/>{ticket._address}</p></div></div><hr style='border:1px #000 solid; margin:0'/>"
            + "<div class='row'><div class='col-xs-5'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;'>{ticket._fromarea}</span></h5>"
            + "<p>{ticket._from}</p>"
            + "</div>"
            + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2192;</h3></div>"
            + "<div class='col-xs-5 text-right'>"
            + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;'>{ticket._toarea}</span></h5>"
            + "<p>{ticket._to}</p>"
            + "</div></div><div class='row'><div class='col-xs-12'>"
            + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>ngày đi: <span style='text-decoration:underline;'>{ticket._tripdate}</span></small>&nbsp;{ticket._triphour}</h3></div></div>"
            + "<div class='row'><div class='col-xs-12'>"
            + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>ghế ({ticket._numseat}):</small>&nbsp;{ticket._seatcodes}</h3></div></div>"
            + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
            + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
            + "<p>đón: {ticket._pick}</p><p>nhân viên: {ticket._user}</p><p>quý khách vui lòng đến trước 15 phút. không hoàn vé sau 15h. </p></div><div class='col-xs-9 text-center' style='margin-top:5px;'><img class='img-responsive' src='http://nhaxe.vexere.com/images/eticket/vxr-ve.jpg' alt=''/></div></div></div>"
,

        "custom": {
            9506: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 31px;text-align:center;font-family:-webkit-body;'>Gia Phúc</div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;style='margin-left:0 !important;margin-right:0 !important;''><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;'>Hồ Chí Minh</div>"
                            + "<div style='float:right;width:70%;'>258A Lê Hồng Phong, P.4, Q5</br>08.6686.1197 - 0583.50.86.86</br></div>"
                        + "</div>"
                         + "<div style='float:left;width:100%;'>"
                             + "<div style='float:left;width:30%;font-weight:bold;'>Cam Ranh</div>"
                             + "<div style='float:right;width:70%;'>2108 Đại Lộ Hùng Vương</br>Tp Cam Ranh</br>0583.956.957 - 0583.955.555</br></div>"
                         + "</div>"
                         + "<div style='float:left;width:100%;'>"
                             + "<div style='float:left;width:30%;font-weight:bold;'>Hotline</div>"
                             + "<div style='float:right;width:70%;'>09777.99.777</br></div>"
                         + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    + "<div class='row' style='margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-5'>"
                   // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p style='font-size:20px;'><b>{ticket._from}</b></p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:0px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                   // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    + "<p style='font-size:20px;'><b>{ticket._to}</b></p>"
                    + "</div></div><div class='row' style='margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size: 45px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>({ticket._numSeat}) Ghế:</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;font-size: 45px;'>{ticket._seatCodes}</h3></div></div>"
                    //+ "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row' style='margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-5' style='padding-right:0;'><p>Giá:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-12'><h5 style='text-transform: uppercase;font-size: 35px;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

                    + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;style='margin-left:0 !important;margin-right:0 !important;''><div class='col-xs-12'>"
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
                    + "<div class='row' style='margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    + "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right' style='padding-right:20px !important;'>"
                    + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    + "<p>{ticket._to}</p>"
                    + "</div></div><div class='row' style='margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-12'>"
                    + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
                    + "<div class='row' style='margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-12'>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>({ticket._numSeat}) Ghế:</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    + "<p>Đặt cọc: {ticket._deposit}</p>"
                    + "<div class='row' style='margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;margin-left:0 !important;margin-right:0 !important;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            },

        },

    },
});

