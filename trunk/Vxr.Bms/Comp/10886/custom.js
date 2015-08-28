//Extend dict
define({
    _pStyleUrl: "/Comp/10886/print.css?v=1.0.1",
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
        //[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
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
	_sTpl: "<li class='seat {seat._notallow} {seat._half}' data-ticket-code='{seat._code}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p><b>{seat._fare}</b></p><p>{seat._suser}{seat._cuser}</p><p class='cinfo' style='width:100%;text-align:left;font-size:15px;'><span class='name'><b>{seat._cname}</b><span class='numT'>{seat._nTicketPerTrip}</span></p><p><span class='phone' style='font-size:15px;'><b>{seat._cphone}<b></p><p style='margin-top: -2px;'>{seat._note}</p></div><div class='clearfix'><div class='buttons' style='width:100%;'>{seat.buttons}<p class='pmInfo' style='float:right;'>{seat._pmInfo}</p></div></div></div></li>",
		//<p>{seat._stageName}&nbsp;{seat._fare}</p>
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
    _pTitleTpl: "<table class='print-title'>" +
                    "<tbody>" +
                        "<tr>" +
                            "<td style='width: 250px !important;'><strong class='title'>{p._title}</strong></td>" +
                            "<td><strong class='rname'>{p._rname}</strong></td>" +
                            "<td style='145px !important;'>Số xe:&nbsp{p._busNum}</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td>" +
                            "<td>Lái xe:&nbsp;{p._driverName}</td>" +
                            "<td>Phục vụ:&nbsp;{p._assistantName}</td>" +
                        "</tr>" +
                    "</tbody>" +
                "</table>",

    // // Trip Info
    // _disallowBkAtrDpt: true,
    // _pSummaryTripInfo: true,
    // _pSummaryTripInfoPageBreak: false,
    // _tripInfo: "<div style='margin-top:0px;float:left;width:100%;position: relative;top: 5px;'>" +
               // "<div style='float:left;width:49.5%;margin-right: 5px;'>" +
                    // "<table style='width:100%;' cellspacing='0'>" +
                        // "<tbody>" +
                           // "<tr style='height:45px;'>" +
                               // "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;padding-top: 5px; line-height:32px; height: 74px;'><span>1-Số khách trên xe:..............................................</span></br><span>2- Số khách đón dọc đường:................................</span></td>" +
                           // "</tr>" +
                        // "</tbody>" +
                    // "</table>" +
                // "</div>" +
               // "<div style='float:left;width:49.5%;'>" +
                    // "<table style='width:100%;' cellspacing='0'>" +
                        // "<tbody>" +
                           // "<tr style='height:45px;'>" +
                               // "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;padding-top: 5px; line-height:22px'><span>3-Số ghế trống:...................................................</span></br><span>4-Xe máy:............................................................</span></br><span>5-Ghế súp:...........................................................</span></td>" +
                           // "</tr>" +
                        // "</tbody>" +
                    // "</table>" +
                // "</div>" +

           // "</div>",

    // print config			
    _pListKey: "normal",
    _pListNoSeat: true, // print element without ticket
    _pListKeySort: 'normal', // alphabet or normal

    // In danh sách
    _pclTpl: "<div class='list'>" +
                "<h3>DANH SÁCH KHÁCH HÀNG</h3>" +
                "<table class='table table-bordered'>" +
                    "<thead>" +
                        "<tr>" +
                            "<th>Số ghế</th>" +
                            "<th>Tên HK</th>" +
                            "<th>Số điện thoại</th>" +
                            "<th>Điểm đón</th>" +
                            "<th width='75px;'>Tiền</th>" +
                            "<th>Ghi chú</th>" +
                            "<th>Nơi đến</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>",
    _ipcLTpl: "<tr style='height:31px;' class='{seat._class}'>" +
                    "<td><span class='{seat._paid}'>{seat._seatCodes}</span></td>" +
                    "<td style='text-transform: lowercase;'>{seat._cname}</td>" +
                    "<td>{seat._cphone}</td>" +
                    "<td style='text-transform: lowercase;'>{seat._pText}</td>" +
                    "<td style='white-space: nowrap;'>{seat._fare}</td>" +
                    "<td style='text-transform: lowercase;'>{seat._note}</td>" +
                    "<td></td>" +
            "</tr>",
    _psmTpl: "",

    // _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        // + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    // _eTicket: {
        // // "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/minhquoc-ve.jpg' style='width: 70px;float:left;' /><p style='width:77%;float:right;text-align:center;'></p>MINH QUỐC</div>"
        // // //+ "<div class='row' style='border:1px solid #000;text-align:center;clear:both;padding:5px 10px;width:70%;margin:0 auto;height:30px;line-height:20px;'>KHÁCH HÀNG LÀ THƯỢNG ĐẾ</div>"
        // // + "<div class='row'><div class='col-xs-12'><p style='margin-top:5px;'>{ticket._phone}<br/>{ticket._address}</p></div></div><hr style='border:1px #000 solid; margin:0'/>"
        // // + "<div class='row'><div class='col-xs-5'>"
        // // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;'>{ticket._fromArea}</span></h5>"
        // // + "<p>{ticket._from}</p>"
        // // + "</div>"
        // // + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2192;</h3></div>"
        // // + "<div class='col-xs-5 text-right'>"
        // // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;'>{ticket._toArea}</span></h5>"
        // // + "<p>{ticket._to}</p>"
        // // + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
        // // + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
        // // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
        // // + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
        // // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
        // // + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
        // // + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
        // // + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div><img style='margin:0 auto;height:44px;width:200px !important;' class='img-responsive;' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

        // // "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/minhquoc-ve.jpg' style='width: 70px;' />HÒA THUẬN ANH EXPRESS</div>"
        // // + "<div class='row'><div class='col-xs-12'><p style='margin-top:5px;'>{ticket._phone}<br/>{ticket._address}</p></div></div><hr style='border:1px #000 solid; margin:0'/>"
        // // + "<div class='row'><div class='col-xs-5'>"
        // // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;'>{ticket._fromArea}</span></h5>"
        // // + "<p>{ticket._from}</p>"
        // // + "</div>"
        // // + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2192;</h3></div>"
        // // + "<div class='col-xs-5 text-right'>"
        // // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;'>{ticket._toArea}</span></h5>"
        // // + "<p>{ticket._to}</p>"
        // // + "</div></div><div class='row'><div class='col-xs-12'>"
        // // + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
        // // + "<div class='row'><div class='col-xs-12'>"
        // // + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
        // // + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
        // // + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
        // // + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p><p>Quý khách vui lòng đến trước 15 phút. Không hoàn vé sau 15h. </p></div><div class='col-xs-9 text-center' style='margin-top:5px;'><img class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div>",

        // "custom": {
            // 18233: {
                // "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px; margin-left: 12px !important;'><img src='http://nhaxe.vexere.com/Images/eticket/minhquoc-ve.jpg' style='width: 27%;float:left;'><p style='margin-left:127px;margin-top:13px;'>Công Ty TNHH</p><p style='font-size:29px;margin-top:-10px;margin-left:99px;'>MINH QUỐC</p></div>"

                    // + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        // + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Vp Đà Nẵng</div>"
                            // + "<div style='float:right;width:70%;'>Bến xe trung tâm Đà Nẵng</br>(0603) 855.855</div>"

                        // + "</div>"
                        // + "<div style='float:left;width:100%;margin-top: 7px;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Vp Kon Tum</div>"
                            // + "<div style='float:right;width:70%;'>647 Nguyễn Huệ, P.Quyết Thắng</br>Tp Kon Tum</br>(0603) 855.855 - (0603) 866.835</div>"
                        // + "</div>"
                    // + "</div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    // + "<div class='row'><div class='col-xs-5' style='height: 32px; line-height: 31px; font-size:21px !important;'>"
                    // + "<p><b>{ticket._from}</b></p>"
                    // + "<h5 style='margin-top:-9px;'><span style='text-transform:uppercase;font-size:11px !important;margin-top:-8px !important;font-weight:bold;'>{ticket._fromArea}</span></h5>"

                    // + "</div>"
                    // + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    // + "<div class='col-xs-5 text-right' style='height: 32px; line-height: 31px; font-size:21px !important;'>"
                    // + "<p><b>{ticket._to}</b></p>"
                    // + "<h5 style='margin-top:-9px;'><span style='text-transform:uppercase;font-size:11px !important;margin-top:-8px !important;font-weight:bold;'>{ticket._toArea}</span></h5>"

                    // + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    // + "<p style='margin-top: 20px;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    // + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-top:20px;'>({ticket._numSeat}) Ghế:</p>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    // //+ "<p>Đặt cọc: {ticket._deposit}</p>"
                    // + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: <span style='style:15px !important;'>{ticket._fare}/vé</span></p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <span style='style:17px !important;'><b>{ticket._total}</b> đ</span></p></div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase; font-size: 16px !important;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"

                    // + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Chi chú: {ticket._note}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                // "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

                    // + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Hồ Chí Minh</div>"
                            // + "<div style='float:right;width:70%;'>274 Đồng Đen, P.10, Q.Tân Bình</br>Tp.Hồ Chí Minh</br>0903.515.330 - 01229.533.733</div>"
                        // + "</div>"
                        // // + "<div style='float:left;width:100%;'>"
                            // // + "<div style='float:left;width:30%;font-weight:bold;'>Cư Kuin</div>"
                            // // + "<div style='float:right;width:70%;'>Chợ Trung Hòa, Cư Kuin, Đắk Lắk</br>(05003).633.733 - (05003).636.733</br>0905.882.082</div>"
                        // // + "</div>"
                    // + "</div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0'/>"
                    // + "<div class='row'><div class='col-xs-5'>"
                    // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    // + "<p>{ticket._from}</p>"
                    // + "</div>"
                    // + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    // + "<div class='col-xs-5 text-right'>"
                    // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    // + "<p>{ticket._to}</p>"
                    // + "</div></div><div class='row'><div class='col-xs-12'>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
                    // + "<div class='row'><div class='col-xs-12'>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>({ticket._numSeat}) Ghế:</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    // + "<p>Đặt cọc: {ticket._deposit}</p>"
                    // + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    // + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            // },
            // 1116: {
                // "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

                    // + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Cư Kuin</div>"
                            // + "<div style='float:right;width:70%;'>Chợ Trung Hòa, Cư Kuin, Đắk Lắk</br>(05003).633.733 - (05003).636.733</br>0905.882.082</div>"
                        // + "</div>"
                        // // + "<div style='float:left;width:100%;'>"
                            // // + "<div style='float:left;width:30%;font-weight:bold;'>Hồ Chí Minh</div>"
                            // // + "<div style='float:right;width:70%;'>274 Đồng Đen, P.10, Q.Tân Bình</br>Tp.Hồ Chí Minh</br>0903.515.330 - 01229.533.733</div>"
                        // // + "</div>"   
                    // + "</div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    // + "<div class='row'><div class='col-xs-5'>"
                    // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    // + "<p>{ticket._from}</p>"
                    // + "</div>"
                    // + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    // + "<div class='col-xs-5 text-right'>"
                    // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    // + "<p>{ticket._to}</p>"
                    // + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                    // + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                    // + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>({ticket._numSeat}) Ghế:</p>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                    // + "<p>Đặt cọc: {ticket._deposit}</p>"
                    // + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    // + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

                // "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

                    // + "<div class='row' style='margin-top:20px;margin-bottom:5px;clear:both;'><div class='col-xs-12'>"
                        // + "<div style='float:left;width:100%;'>"
                            // + "<div style='float:left;width:30%;font-weight:bold;'>Cư Kuin</div>"
                            // + "<div style='float:right;width:70%;'>Chợ Trung Hòa, Cư Kuin, Đắk Lắk</br>(05003).633.733 - (05003).636.733</br>0905.882.082</div>"
                        // + "</div>"
                        // // + "<div style='float:left;width:100%;'>"
                            // // + "<div style='float:left;width:30%;font-weight:bold;'>Hồ Chí Minh</div>"
                            // // + "<div style='float:right;width:70%;'>274 Đồng Đen, P.10, Q.Tân Bình</br>Tp.Hồ Chí Minh</br>0903.515.330 - 01229.533.733</div>"
                        // // + "</div>"   
                    // + "</div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0;clear:both;'/>"
                    // + "<div class='row'><div class='col-xs-5'>"
                    // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase; margin-bottom:5px;font-weight:bold;'>{ticket._fromArea}</span></h5>"
                    // + "<p>{ticket._from}</p>"
                    // + "</div>"
                    // + "<div class='col-xs-2'><h3 style='margin-top:10px;'>&#x2194;</h3></div>"
                    // + "<div class='col-xs-5 text-right'>"
                    // + "<h5 style='margin-bottom:5px;'><span style='text-transform:uppercase;font-weight:bold;'>{ticket._toArea}</span></h5>"
                    // + "<p>{ticket._to}</p>"
                    // + "</div></div><div class='row'><div class='col-xs-12'>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
                    // + "<div class='row'><div class='col-xs-12'>"
                    // + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>({ticket._numSeat}) Ghế:</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                    // + "<p>Đặt cọc: {ticket._deposit}</p>"
                    // + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                    // + "<hr style='border:1px #000 solid; margin:0'/><div class='row' style='padding-bottom:100px;'><div class='col-xs-12'><h5 style='text-transform: uppercase;'><b>{ticket._cname}</b> &nbsp; {ticket._cphone}</h5>"
                    // + "<p style='font-size:14px;'>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p></div><div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
            // }
        // }

    // },

});

//extension members
$.extend(true, $.custom.vbooking.prototype, {
    _printBKS: function () {
        var $printContent = $('<div />').addClass('print-container');
        $printContent.append(this._renderPrintSeatTemplate());
        // reset default value
        FlatObj.RBePrint = false;
        var windowName = 'BookingSheet' + (new Date()).getTime();
        var printWindow = window.open('about:blank', windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
        printWindow.document.write(
            '<html>' +
                '<head>' +
                    '<title>' + windowName + '</title>' +
                    '<link rel="stylesheet" href="' + _dict._pStyleUrlDefault + '" type="text/css" />' +
                    '<link rel="stylesheet" href="' + _dict._pStyleUrl + '" type="text/css" />' +
                '</head>' +
                '<body>' +
                    $printContent.html() +
                '</body>' +
            '</html>'
            );
        printWindow.focus();
        setTimeout(function () {
            printWindow.print();
        }, 2500);
    },

    _renderPrintSeatTemplate: function () {
        var self = this;
        var $body = $('<div />').addClass('row');
        $.each(self._m, function (ic, c) {
            var lSeats = [];
            var $table = $(_dict._pclTpl);
            var $tbody = $table.find('tbody');
            if (typeof c != "undefined") {
                var $printHeader = self._renderBKSTitle();
                if (ic == 1) $($printHeader).find('table.print-title').parent().css('page-break-before', 'always');
                $.each(c, function (ir, r) {
                    if (typeof r != "undefined") {
                        $.each(r, function (is, s) {
                            if (typeof s != "undefined" && s != null) {
                                var t = s._getCurrentTicket(); // get ticket on seat
                                if (_dict._pListKey != undefined) {
                                    switch (_dict._pListKey) {
                                        case "normal":
                                            // print element without ticket
                                            if (_dict._pListNoSeat != undefined && _dict._pListNoSeat) {
                                                var pInfo = null, pText = "", cname = "", cphone = "";
                                                if (!$.isEmptyObject(t)) { // has ticket
                                                    pInfo = t._getPickupInfo();
                                                    if (!$.isEmptyObject(pInfo)) pText = pInfo.text;
                                                    cname = t._cname;
                                                    cphone = t._getDefaultPhoneNumber();
                                                    var ob = {
                                                        _seatLabel: s._label,
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _status: t._status,
                                                        _fare: t._fare,
                                                        _class: "",
                                                        _paid: (t._status == 2 || t._status == 5) ? "da-thanh-toan" : ""
                                                    }
                                                    lSeats.push(ob);
                                                } else {
                                                    lSeats.push({ _seatLabel: s._label });
                                                }
                                            } else {

                                            }
                                            break;
                                        default:
                                            console.log(123);
                                            break;
                                    }
                                }


                            }
                        });
                    }
                });
                var lSortedSeats = vSort('_seatLabel', false, lSeats);
                var index = 1;
                $.each(lSortedSeats, function (i, v) {
                    var data = {}
                    if (!$.isEmptyObject(v)) {
                        data = {
                            "seat": {
                                _index: index,
                                _cname: v._cname,
                                _cphone: v._cphone,
                                _pText: v._pText,
                                _note: v._note,
                                _seatCodes: v._seatLabel,
                                _status: v._status == 1 ? "Đặt chỗ" : (v._status == 2 ? "Đã TT" : ""),
                                _fare: v._status == 2 ? (v._fare ? v._fare.toMn() + " đ" : "") : "",
                                _class: v._class,
                                _paid: v._paid
                            }
                        }
                    } else {
                        data = { "seat": { _seatLabel: v._seatLabel } }
                    }
                    var $tr = $(vtpl(_dict._ipcLTpl, data));
                    $tbody.append($tr);
                });
                index++;
                $body.append($printHeader);
                $body.append($table);
                if (typeof _dict._pSummaryTripInfo != "undefined" && _dict._pSummaryTripInfo) {
                    $body.append(self._renderPrintTripInfo());
                }
            }
        });
        return $body;
    },
});
