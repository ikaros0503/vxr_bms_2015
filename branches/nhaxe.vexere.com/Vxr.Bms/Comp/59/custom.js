//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
		_allowGroupByCode: true,
        _pTplNumCoach: 1,
        _pNoSeat: true,
        _pStyleUrl: "/Comp/59/print.css?v=1.0.4",
        _hasPickUpOnPrintBKS: false,
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
            [6, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
            [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [7, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
            [7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [7, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
            [7, 2, "Chọn đại lý", "select", "Chọn đại lý(agent)", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],            
            [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            [8, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
			[10, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
			[10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
            [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
        ],
        _multiSeatOnTicket: true,
        _eTicket: {
            "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 24px;'><img src='http://nhaxe.vexere.com/Images/eticket/canh-yen.jpg' style='width: 71px;float:left;' /><p style='font-family: initial;height: 47px;line-height: 56px;width:77%;float:right;text-align:center;'>DU LỊCH CẢNH YẾN</p></div>"
                // <p style='width:100%;float:right;text-align:center;font-size:30px;margin:0;'>
				+ "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                    + "<div style='float:left;width:100%;'>"
                        + "<div style='float:left;width:35%;font-weight:bold;'>Hồ Chí Minh</div>"
                        + "<div style='float:right;width:65%;'>03 Hoàng Minh Giám </br>P.9, Q.Phú Nhuận, Tp.HCM</br>08.2244 68 66</div>"
                    + "</div>"
                    + "<div style='float:left;width:100%;'>"
                        + "<div style='float:left;width:35%;font-weight:bold;'>Đơn Dương</div>"
                        + "<div style='float:right;width:65%;'>Đơn Dương, Lâm Đồng</br>0633.847 155</div>"
                    + "</div>"
                + "</div></div><hr style='border:1px #000 solid; margin:0'/>"
                + "<div class='row'><div class='col-xs-5'>"
                + "<h5 style='padding-top:8px;margin-top:0;'><span style='text-transform:uppercase; margin-bottom:5px;'><b>{ticket._fromArea}</b></span></h5>"
                + "</div>"
                + "<div class='col-xs-2'><h3 style='margin-top:0;'>&#x2192;</h3></div>"
                + "<div class='col-xs-5 text-right'>"
                + "<h5 style='padding-top:8px;margin-top:0;'><span style='text-transform:uppercase;'><b>{ticket._toArea}</b></span></h5>"
                + "</div></div><div class='row'><div class='col-xs-5' style='padding-right:0;'>"
                + "<p style='margin-bottom:0;'>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></p>"
                + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._tripHour}</h3></div>"
                + "<div class='col-xs-7 text-right' style='padding-left:0;'><p style='margin-bottom:0;'>Ghế ({ticket._numSeat}):</p>"
                + "<h3 style='margin:2px 0px; margin-bottom:10px;'>{ticket._seatCodes}</h3></div></div>"
                + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;margin-bottom:5px;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
                + "<p style='margin:0 0 5px 0;'>Đón: {ticket._pick}</p><p style='margin:0 0 5px 0;'>Nhân viên: {ticket._user}</p></div>"
                + "<div class='col-xs-12'>"
                    + "<hr style='margin:0 0 3px 0;height:1px;background:#000;'/>"
                    + "<div style='font-size:10px;'>"
                        + "<p style='margin-bottom:3px;'>- Đổi vé, đổi giờ quý khách vui lòng giao dịch trực tiếp tại quầy vé.</p>"
                        + "<p style='margin-bottom:3px;'>- Vé trả, đổi chỉ giải quyết trước 2 giờ xe khởi hành.</p>"
                        + "<p style='margin-bottom:3px;'>- Quý khách trả vé sẽ bị trừ 10% giá vé.</p>"
                        + "<p style='margin-bottom:3px;'>- Ngày lễ, tết không giải quyết đặt vé qua điện thoại, không giải quyết đổi vé, trả vé.</p>"
                        + "<p> (Quý khách vui lòng đến trước 15 phút trước khi xe khởi hành)</p>"
                    + "</div>"
                + "</div>"
                + "<div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",

            "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 logonx' style='padding: 0;font-weight: 700;font-size: 20px;'><p style='width:100%;float:right;text-align:center;font-size:30px;margin:0;'>DU LỊCH CẢNH YẾN</p></div>"
                + "<div class='row' style='margin-top:10px;margin-bottom:5px;'><div class='col-xs-12'>"
                    + "<div style='float:left;width:100%;'>"
                        + "<div style='float:left;width:35%;font-weight:bold;'>Hồ Chí Minh</div>"
                        + "<div style='float:right;width:65%;'>03 Hoàng Minh Giám</br> P.9, Q.Phú Nhuận, Tp.HCM</br>08.2244 68 66</div>"
                    + "</div>"
                    + "<div style='float:left;width:100%;'>"
                        + "<div style='float:left;width:35%;font-weight:bold;'>Đơn Dương</div>"
                        + "<div style='float:right;width:65%;'>Đơn Dương, Lâm Đồng</br>0633.847 155</div>"
                    + "</div>"
                + "</div></div><hr style='border:1px #000 solid; margin:0'/>"
                + "<div class='row'><div class='col-xs-5'>"
                + "<h5 style='padding-top:8px;margin-top:0;'><span style='text-transform:uppercase; margin-bottom:5px;'><b>{ticket._fromArea}</b></span></h5>"
                + "</div>"
                + "<div class='col-xs-2'><h3 style='margin-top:0;'>&#x2192;</h3></div>"
                + "<div class='col-xs-5 text-right'>"
                + "<h5 style='padding-top:8px;margin-top:0;'><span style='text-transform:uppercase;'><b>{ticket._toArea}</b></span></h5>"
                + "</div></div><div class='row'><div class='col-xs-12'>"
                + "<h3 style='margin:2px 0px; margin-bottom:5px;font-size: 18px;'><small>Ngày đi: <span style='text-decoration:underline;'>{ticket._tripDate}</span></small>&nbsp;{ticket._tripHour}</h3></div></div>"
                + "<div class='row'><div class='col-xs-12'>"
                + "<h3 style='margin:2px 0px; margin-bottom:10px; font-size: 18px; line-height: 24px;'><small>Ghế ({ticket._numSeat}):</small>&nbsp;{ticket._seatCodes}</h3></div></div>"
                + "<div class='row'><div class='col-xs-5' style='padding-right:0;'><p>Giá: {ticket._fare}/vé</p></div> <div class='col-xs-7 text-right' style='padding-left:0;'><p>Tổng tiền: <b>{ticket._total}</b> đ</p></div></div>"
                + "<hr style='border:1px #000 solid; margin:0'/><div class='row'><div class='col-xs-12'><h5 style='text-transform: uppercase;margin-bottom:5px;'>{ticket._cname} &nbsp; {ticket._cphone}</h5>"
                + "<p style='margin:0 0 5px 0;'>Đón: {ticket._pick}</p><p style='margin:0 0 5px 0;'>Nhân viên: {ticket._user}</p></div>"
                + "<div class='col-xs-12'>"
                    + "<hr style='margin:0 0 3px 0;height:1px;background:#000;'/>"
                    + "<div style='font-size:10px;'>"
                        + "<p style='margin-bottom:3px;'>- Đổi vé, đổi giờ quý khách vui lòng giao dịch trực tiếp tại quầy vé.</p>"
                        + "<p style='margin-bottom:3px;'>- Vé trả, đổi chỉ giải quyết trước 2 giờ xe khởi hành.</p>"
                        + "<p style='margin-bottom:3px;'>- Quý khách trả vé sẽ bị trừ 10% giá vé.</p>"
                        + "<p style='margin-bottom:3px;'>- Ngày lễ, tết không giải quyết đặt vé qua điện thoại, không giải quyết đổi vé, trả vé.</p>"
                        + "<p> (Quý khách vui lòng đến trước 15 phút trước khi xe khởi hành)</p>"
                    + "</div>"
                + "</div>"
                + "<div class='col-xs-12 text-center'><div style='width:100%;'><img style='margin:0 auto;height:40px;' class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div></div>",
        },
		_epnp: {
            "10": [
                "063", "081", "082", "083", "084", "085", "086", "087", "088", "089"
            ],
        },
    });
	
	
})(jQuery);