//Extend dict
define({
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [4, { vi: "Tài xế thu" }, 1, "TX"], [7, { vi: "VeXeRe" }, 0, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
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
            [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
            [5, 2, "Đặt cọc", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "đ"],
            [6, 1, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
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
    //_pStyleUrl: "/Content/extend/2/print.css?v=1.0.2",
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
    _lTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='10'><button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table>",
    _cancelListTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody></table>",
    _ilTpl: "<tr class='lseat' data-position='{seat._coach}_{seat._row}_{seat._col}' data-issue='{seat._issue}'><td class='hidden-xs text-center index'>{seat._index}</td><td>{seat._label}</td><td>{seat._cname}&nbsp;<span class='numT'>{seat._nTicketPerTrip}</span></td><td>{seat._cphone}</td><td class='hidden-xs'>{seat._idate}<br/>{seat._suser}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td>{seat._status}<br/>{seat._cuser}<br/>{seat._pmFullInfo}</td><td class='hidden-xs'>{seat._pInfo}</td><td class='hidden-xs'>{seat._note}</td><td class='hidden-xs text-center'>{seat._buttons}</td></tr>",

    _multiSeatOnTicket: true,
    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 5%;'>STT</th style='width: 15%;'><th>Số ghế</th><th style='width: 25%;'>Địa chỉ cần đón</th><th style='width: 10%;'>Tên HK</th><th style='width: 20%;'>Số điện thoại</th><th style='width: 25%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class=''><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._note}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",
    _hasPickUpOnPrintBKS: false,

    // dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
    // 5|10092|1: quyền này sẽ mở khóa các button 
    _closedTripConf: {
        "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save", "btn-add-more-ticket", "btn-return"],
        "ValidForm": []
    },

    _hasBTWarning: true,
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
            1: {
                "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 16px;'><img src='http://nhaxe.vexere.com/Images/eticket/tien-oanh.jpg' style='width: 90%;float:left;' /></div>"

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
            2: {
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
                                //seats.push(sx);
                                var t = s._getCurrentTicket();
                                if (!$.isEmptyObject(t)) {

                                    var pInfo = t._getPickupInfo();
                                    var pIndex = 0;
                                    var pText = "";
                                    if (!$.isEmptyObject(pInfo)) {
                                        pIndex = parseInt(pInfo.pIndex);
                                        pText = pInfo.text;
                                    }
                                    var cname = t._cname;
                                    var cphone = t._getDefaultPhoneNumber();

                                    if (pIndex == 0) {
                                        if (!vIsEstStr(cphone)) {
                                            nstickets2.push({
                                                _seatCodes: [s._label],
                                                _cname: cname,
                                                _cphone: cphone,
                                                _pText: pText,
                                                _note: t._note,
                                                _status: t._status,
                                                _class: ""
                                            });
                                        } else {
                                            //var ntext = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                            var ntext = cphone;
                                            var nkey = customer.indexOf(ntext);
                                            if (nkey == -1) {
                                                nkey = customer.push(ntext) - 1;
                                            }

                                            if (typeof nstickets[nkey] == "undefined") {
                                                nstickets[nkey] = {
                                                    _seatCodes: [],
                                                    _cname: cname,
                                                    _cphone: cphone,
                                                    _pText: pText,
                                                    _note: t._note,
                                                    _status: t._status,
                                                    _class: ""
                                                };
                                            }
                                            nstickets[nkey]._seatCodes.push(s._label);
                                        }
                                    } else {
                                        if (pInfo.type == 'P') {
                                            if (typeof stickets[pIndex] == "undefined") {
                                                stickets[pIndex] = [];
                                            }
                                            //var text = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                            var text = cphone;
                                            var key = customer.indexOf(text);
                                            if (key == -1) {
                                                key = customer.push(text) - 1;
                                            }
                                            if (typeof stickets[pIndex][key] == "undefined") {
                                                stickets[pIndex][key] = {
                                                    _seatCodes: [],
                                                    _cname: cname,
                                                    _cphone: cphone,
                                                    _pText: pText,
                                                    _note: t._note,
                                                    _status: t._status,
                                                    _class: "pickup"
                                                };
                                            }
                                            stickets[pIndex][key]._seatCodes.push(s._label);
                                        } else if (pInfo.type == 'T') {
                                            if (typeof stickets2[pIndex] == "undefined") {
                                                stickets2[pIndex] = [];
                                            }
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
                                                    _pText: pText,
                                                    _note: t._note,
                                                    _status: t._status,
                                                    _class: ""
                                                };
                                            }
                                            stickets2[pIndex][key2]._seatCodes.push(s._label);
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
        temp[temp.length] = nstickets.concat(nstickets2);

        if (temp.length > 0) {
            var index = 1;
            $.each(temp, function (ix, s) {
                if (typeof s != "undefined" && s != null) {
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
                                    _status: sx._status == 1 ? "Đặt chỗ" : "Đã thanh toán",
                                    _class: sx._class
                                }
                            }

                            var $tr = $(vtpl(_dict._ipcLTpl, data));
                            $tbody.append($tr);

                            index++;
                        }
                    });
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

