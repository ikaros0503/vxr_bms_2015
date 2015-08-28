//Extend dict
define({
    _pSpecialPos: {
        42: {
            "2_1_1": [1, 2, 1], "2_1_3": [1, 2, 3], "2_1_5": [1, 2, 5],
            "1_2_1": [1, 3, 1], "1_2_3": [1, 3, 3], "1_2_5": [1, 3, 5],
            "2_2_1": [1, 4, 1], "2_2_3": [1, 4, 3], "2_2_5": [1, 4, 5],
            "1_3_1": [1, 5, 1], "1_3_3": [1, 5, 3], "1_3_5": [1, 5, 5],
            "2_3_1": [1, 6, 1], "2_3_3": [1, 6, 3], "2_3_5": [1, 6, 5],
            "1_4_1": [1, 7, 1], "1_4_3": [1, 7, 3], "1_4_5": [1, 7, 5],
            "2_4_1": [2, 1, 1], "2_4_3": [2, 1, 3], "2_4_5": [2, 1, 5],
            "1_5_1": [2, 2, 1], "1_5_3": [2, 2, 3], "1_5_5": [2, 2, 5],
            "2_5_1": [2, 3, 1], "2_5_3": [2, 3, 3], "2_5_5": [2, 3, 5],
            "1_6_1": [2, 4, 1], "1_6_3": [2, 4, 3], "1_6_5": [2, 4, 5],

            "2_6_1": [2, 5, 1], "2_6_3": [2, 5, 3], "2_6_5": [2, 5, 5],


            "1_7_1": [2, 6, 1], "1_7_3": [2, 6, 3], "1_7_5": [2, 6, 5],
            // "2_7_1": [2, 6, 1], "2_7_2": [2, 6, 2], "2_7_3": [2, 6, 3], "2_7_4": [2, 6, 4], "2_7_5": [2, 6, 5],
            // "1_8_1": [2, 7, 1], "1_8_2": [2, 7, 2], "1_8_3": [2, 7, 3], "1_8_4": [2, 7, 4], "1_8_5": [2, 7, 5],

        }
    },
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
    // hiện nút P ngoài BKS: nhớ thêm các css sau vào file custom.css của nhà xe        div.buttons { width: 51% !important; } div.cinfo {width: 49% !important;}
    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick' style='font-size: 12px !important;'>{seat._pInfo}</div></div>"
       + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p class='cinfo' style='height:20px !important;'><b><span class='name' style='font-size: 13px !important'>{seat._cname}</span></b><span class='numT'>{seat._nTicketPerTrip}</span><span class='phone' style='font-size: 15px !important;'>&nbsp;&nbsp;{seat._cphone}</span><p><span style='font-size:13px !important;'>{seat._note}</span></p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    // Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["Code"],
    // Vé khứ hồi: copy các thông tin sau
    _returnField: ["FullName", "PhoneNumbers"],
    _returnFieldRequired: ["PhoneNumbers"],
    // dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
    // 5|10092|1: quyền này sẽ mở khóa các button 
    _closedTripConf: {
        "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save", "btn-add-more-ticket", "btn-return"],
        "ValidForm": []
    },
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

    _pStyleUrl: "/Comp/542/print.css?v=1.0.12",
    _pTitleTpl: "<table class='print-title'><tbody><tr><td><strong class='rname'>{p._rname}</strong></td><td colspan='2'>Tài xế:&nbsp;{p._driverName}</td></tr><tr><td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Số xe:&nbsp{p._busNum}</td><td>Phụ xe: {p._assistantName}</td></tr></tbody></table>",
    _hasPickUpOnPrintBKS: false,
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}

    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
              + "<tbody>"
             + "<tr style='height: 18px;'><td><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported} {pseat._onlyPaidBackGround}'><b>{pseat._cphone}</b></p></td></tr>"
              + "<tr><td><p class='pcname' style='text-align:left;width:100%;float:left;height:19px;font-size:18px;line-height:19px;white-space:nowrap'>{pseat._cname}&nbsp;<span>{pseat._nTicketPerTrip}</span></p><p class='pnote'>{pseat._note}</p></td></tr>"
             + "</tbody>"
              + "</table></li>",

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _epnp: {
        "10": ["0583"],
        "11": ["0583"],
    },

    _pTplNumCoach: 1, //Default 0 is not custom set 

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
