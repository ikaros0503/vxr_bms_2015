//Extend dict
define({
    _specialPos: {
        41: {
            "1_5_5": [1, 5, 4], "1_6_1": [1, 5, 5],
            "1_6_3": [1, 6, 1], "1_6_5": [1, 6, 2],
            "1_6_2": [1, 6, 3], "1_5_4": [1, 6, 5],
            "2_6_3": [2, 6, 2], "2_6_5": [2, 6, 3],
            "2_6_2": [2, 6, 4], "2_6_4": [2, 6, 5],

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
        [1, 1, "", "input", "hidden", "NumClick", "", "", {}, [], ""],
        [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
        [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
        [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
        [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
        [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
        [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
        [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
        //[5, 2, "Đặt cọc", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "đ"],
        //[6, 1, "Phụ thu", "input", "text", "Surcharge", "form-control  vblue fw700", "", {}, [], "đ"],
        //[6, 2, "Giảm giá", "input", "text", "Discount", "form-control  vblue fw700", "", {}, [], "đ"],
        [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
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
    //_pNoSeat: true,
    //in ghe trong tren phoi
    // _specialPos: {
    // 43: {
    // "2_1_3": [1, 1, 3], "2_1_5": [1, 1, 5]              
    // }            
    // }, 
    //_limitedDateBefore: 7,
    //_limitedMinuteBefore: 120,
    //dat ve ngay qua khu
    //_hasBTWarning: true,
    // dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
    // 5|10092|1: quyền này sẽ mở khóa các button 
    _allowGroupByCode: true,
    _epnp: {
        "10": [
            "041", "042", "043", "044", "045", "046", "047", "048", "049", "040", "020", "019"
        ],
    },

    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _showUCharge: true, //nguoi thanh toan
    _noShowAgentInfo: true, //chi nhanh dat cho
    _hasPickUpOnPrintBKS: false, // ds don doc duong
    _pTplNumCoach: 2,


    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: true,



    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
          + "<tbody>"
          + "<tr style='height: 16px'><td><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='pmInfo ppayment'>{pseat._note}</p></td></tr>"
          + "<tr class='thong'><td style='height: 24px;'><p class='pcname'><b>{pseat._cname}&nbsp;{pseat._nTicketPerTrip}</b></p><p class='pcphone'> <b>{pseat._cphone}</b>&nbsp;<b class='ntk-pertrip'></b></p></td></tr>"
          + "<tr><td><p class='pnote' style='clear:both;'>Đ:&nbsp;{pseat._pInfo}</p></td></tr>"
          + "</tbody>"
          + "</table></li>",
    _psTpl_SeatGroup:
        '<li class="print-seat col-md-4" style="overflow:hidden;">' +
            '<table>' +
                '<tbody>' +
                  '<tr style="height: 22px">' +
                    '<td style="width:50%"><p class="pseat-code {data._paid}">{data.seatCode}</p></td>' +
                    '<td></td>' +
                  '</tr>' +
                  '<tr>' +
                    '<td colspan="2" style="text-align: center;font-size: 20px;">{data.phone}</td>' +
                  '</tr>' +
                  '<tr>' +
                    '<td style="font-size:small;" colspan=2><p style="white-space: nowrap;overflow: hidden;"> {data.note}</p></td>' +
                  '</tr>' +
                '</tbody>' +
            '</table>' +
        '</li>',

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _pStyleUrl: "/Comp/878/print.css?v=1.0.11",
    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",

    // _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 4%;'>STT</th style='width: 20%;'><th>Số ghế</th><th style='width: 20%;'>Địa chỉ cần đón</th><th style='width: 10%;'>Tên HK</th><th style='width: 12%;white-space:nowrap;'>Số điện thoại</th><th style='width: 12%;'>Trạng thái</th><th style='width: 20%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    // _ipcLTpl: "<tr class='{seat._class}'><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    // _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",
    _multiSeatOnTicket: true,//in nhieu ve gop thanh 1 ve

    //seat, phone, '': disabled
    //_psTpl_Label: "<li class='print-seat'><table><tbody><tr style='height: 22px;'><td><p class='pseat-code'>{pseat._label}</p></td> </tr><tr><td style='text-align: center;font-size: 20px;'>{pseat.textLabel}<td></tr></tbody></table></li>",
    //_labelValueForTheSameCustomer: 'phone',

    //BKS list
    _lTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Tên HK</th><th>Số điện thoại</th><th>Nơi đi</th><th>Nơi đến</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='10'><button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table>",
    //_cancelListTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody></table>",
    _ilTpl: "<tr class='lseat' data-position='{seat._coach}_{seat._row}_{seat._col}' data-issue='{seat._issue}'><td class='hidden-xs text-center index'>{seat._index}</td><td>{seat._cname}&nbsp;<span class='numT'>{seat._nTicketPerTrip}</span></td><td>{seat._cphone}</td><td>{seat._fromName}</td><td>{seat._toName}</td></tr>",


    // In danh sách
    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th>STT</th><th>Tên HK</th><th>Số điện thoại</th><th>Nơi đi</th><th>Nơi đến</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class='{seat._class}'><td>{seat._index}</td><td>{seat._cname}&nbsp;<span class='numT'>{seat._nTicketPerTrip}</span></td><td>{seat._cphone}</td><td>{seat._fromName}</td><td>{seat._toName}</td></tr>",
    //_psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",


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
            17001: {
                "sm": "<div style='width:459px; margin: 0 auto; padding-left: 0px;'><div class='col-xs-12 logonx' style='padding: 0 0 10px;font-weight: 700;font-size: 16px;'><p style='font-size:31px;padding:2px 0 0 0;font-family:initial;text-align:center;margin-bottom:0;'>PHIẾU ĐẶT CHỖ</p></div>"
                    // + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>GIƯỜNG NẰM CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"

                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;margin-left: 20px;'>Vp Hà Nội</div>"
                            + "<div style='float:right;width:60%;margin-left: 10px;'>338 Trần Khát Chân, Q.Hai Bà Trưng</br>(0436)889.889 - 0914.077.779</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;margin-left: 20px;'>Vp Quảng Bình</div>"
                            + "<div style='float:right;width:60%;'>19A Lý Thường Kiệt, Đồng Hới</br>(0523)889.889</div>"
                        + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='margin-bottom:5px;font-weight:bold;font-size: 16px;'>{ticket._fromArea}</span></h5>"
                    //+ "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:15px; margin-left: 28px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;'><span style='font-weight:bold; font-size: 16px;'>{ticket._toArea}</span></h5>"
                    //+ "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:0;'><div class='col-xs-12'><h5 style='text-transform: uppercase;font-size: 16px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:16px;'>Đón: {ticket._pick}</p><p style='font-size:15px !important;'>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><p style='border-bottom:1px #000 dashed; line-height :14px;'></p>"

                    + "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vé có giá trị trong ngày.</i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Nếu đổi vé hoặc chuyển ngày thì không mất phí.<i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vp 69 Phạm Hùng xuất bến sớm hơn 1 giờ (giờ in trên vé là giờ xuất phát của Vp Trần Khát Trân).<i></p></div></div></div>",

                "lg": "<div style='width:459px; margin: 0 auto; padding-left: 0px;'><div class='col-xs-12 logonx' style='padding: 0 0 10px;font-weight: 700;font-size: 16px;'><p style='text-align:center;font-size:29px;padding:2px 0 0 0;'>PHIẾU ĐẶT CHỖ</p></div>"
                    // + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>GIƯỜNG NẰM CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"

                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;margin-left: 20px;'>Vp Hà Nội</div>"
                            + "<div style='float:right;width:60%;margin-left: 10px;'>338 Trần Khát Chân, Q.Hai Bà Trưng</br>(0436)889.889 - 0914.077.779</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;margin-left: 20px;'>Vp Quảng Bình</div>"
                            + "<div style='float:right;width:60%;'>19A Lý Thường Kiệt, Đồng Hới</br>(0523)889.889</div>"
                        + "</div>"
                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='margin-bottom:5px;font-weight:bold;font-size: 16px;'>{ticket._fromArea}</span></h5>"
                    //+ "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:15px; margin-left: 28px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;'><span style='font-weight:bold; font-size: 16px;'>{ticket._toArea}</span></h5>"
                    //+ "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
            + "</div></div><div class='row'><div class='col-xs-12'>"
            //+ "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
            + "<div class='row'><div class='col-xs-12'>"
            + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
            + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
            + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:0;'><div class='col-xs-12'><h5 style='text-transform: uppercase;font-size: 16px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:16px;'>Đón: {ticket._pick}</p><p style='font-size:15px !important;'>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><p style='border-bottom:1px #000 dashed; line-height :14px;'></p>"

                    + "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vé có giá trị trong ngày.</i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Nếu đổi vé hoặc chuyển ngày thì không mất phí.<i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vp 69 Phạm Hùng xuất bến sớm hơn 1 giờ (giờ in trên vé là giờ xuất phát của Vp Trần Khát Trân).<i></p></div></div></div>",
					},
            17002: {
                "sm": "<div style='width:459px; margin: 0 auto; padding-left: 0px;'><div class='col-xs-12 logonx' style='padding: 0 0 10px;font-weight: 700;font-size: 16px;'><p style='text-align:center;font-size:29px;padding:2px 0 0 0;margin-bottom:0;'>PHIẾU ĐẶT CHỖ</p></div>"
                    // + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>GIƯỜNG NẰM CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;margin-left: 20px;'>Vp Quảng Bình</div>"
                            + "<div style='float:right;width:60%;'>19A Lý Thường Kiệt, Đồng Hới</br>(0523)889.889</div>"
                        + "</div>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:30%;font-weight:bold;margin-left: 20px;'>Vp Hà Nội</div>"
                            + "<div style='float:right;width:60%;margin-left: 10px;'>338 Trần Khát Chân, Q.Hai Bà Trưng</br>(0436)889.889 - 0914.077.779</div>"
                        + "</div>"

                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='margin-bottom:5px;font-weight:bold;font-size: 16px;'>{ticket._fromArea}</span></h5>"
                    //+ "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:15px; margin-left: 28px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;'><span style='font-weight:bold; font-size: 16px;'>{ticket._toArea}</span></h5>"
                    //+ "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:0;'><div class='col-xs-12'><h5 style='text-transform: uppercase;font-size: 16px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:16px;'>Đón: {ticket._pick}</p><p style='font-size:15px !important;'>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><p style='border-bottom:1px #000 dashed; line-height :14px;'></p>"

                    + "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vé có giá trị trong ngày.</i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Nếu đổi vé hoặc chuyển ngày thì không mất phí.<i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vp 69 Phạm Hùng xuất bến sớm hơn 1 giờ (giờ in trên vé là giờ xuất phát của Vp Trần Khát Trân).<i></p></div></div></div>",

                "lg": "<div style='width:459px; margin: 0 auto; padding-left: 0px;'><div class='col-xs-12 logonx' style='padding: 0 0 10px;font-weight: 700;font-size: 16px;'><p style='text-align:center;font-size:29px;padding:2px 0 0 0;'>PHIẾU ĐẶT CHỖ</p></div>"
                    // + "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:55%;margin:0 auto;height:30px;line-height:20px;font-weight:bold;font-size:17px;'>GIƯỜNG NẰM CAO CẤP</div>"
                    + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                        + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;margin-left: 20px;'>Vp Quảng Bình</div>"
                            + "<div style='float:right;width:60%;'>19A Lý Thường Kiệt, Đồng Hới</br>0523.846 222.</div>"
                        + "</div>"
                       + "<div style='float:left;width:100%;'>"
                            + "<div style='float:left;width:35%;font-weight:bold;margin-left: 20px;'>Vp Quảng Bình</div>"
                            + "<div style='float:right;width:60%;'>19A Lý Thường Kiệt, Đồng Hới</br>(0523)889.889</div>"
                        + "</div>"

                    + "</div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/>"
                    + "<div class='row'><div class='col-xs-5'>"
                    + "<h5 style='margin-bottom:5px;'><span style='margin-bottom:5px;font-weight:bold;font-size: 16px;'>{ticket._fromArea}</span></h5>"
                    //+ "<p>{ticket._from}</p>"
                    + "</div>"
                    + "<div class='col-xs-2'><h3 style='margin-top:15px; margin-left: 28px;'>&#x2194;</h3></div>"
                    + "<div class='col-xs-5 text-right'>"
                    + "<h5 style='margin-bottom:5px;'><span style='font-weight:bold; font-size: 16px;'>{ticket._toArea}</span></h5>"
                    //+ "<p>{ticket._to}</p>"
                    + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                    + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style = 'font-size: 20px;'><b>{ticket._fare}</b></span>/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style = 'font-size: 20px;'><b>{ticket._total}</b></span> đ</p></div></div>"
                    + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:0;'><div class='col-xs-12'><h5 style='text-transform: uppercase;font-size: 16px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    + "<p style='font-size:16px;'>Đón: {ticket._pick}</p><p style='font-size:15px !important;'>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><p style='border-bottom:1px #000 dashed; line-height :14px;'></p>"

                    + "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vé có giá trị trong ngày.</i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Nếu đổi vé hoặc chuyển ngày thì không mất phí.<i></p>" +
                    "<p style='float: left;width: 100%;text-align: left;'><icon style='font-size:23px;line-height:15px;height:17px;vertical-align: bottom; display:inline-block;'>&#8226;</icon>&nbsp;<i>Vp 69 Phạm Hùng xuất bến sớm hơn 1 giờ (giờ in trên vé là giờ xuất phát của Vp Trần Khát Trân).<i></p></div></div></div>",
					}

        }
    },

});
