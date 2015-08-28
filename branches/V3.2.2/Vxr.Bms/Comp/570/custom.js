//Extend dict
define({
    _pStyleUrl: "/Comp/570/print.css?v=1.0.52",
    // Tuỳ chỉnh vị trí ghế ngoài BKS
    _specialPos: {
        // 48 : {
        // "1_11_5": [1, 11, 3], "1_11_3": [1, 11, 5], 
        // }
    },
    //Tuỳ chỉnh vị trí ghế trên phơi
    // _pSpecialPos: {
    // 40: {
    // "2_1_1": [1, 2, 1], "2_1_3": [1, 2, 3], "2_1_5": [1, 2, 5],
    // "1_2_1": [1, 3, 1], "1_2_3": [1, 3, 3], "1_2_5": [1, 3, 5]
    // }
    // },
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
            [1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
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
    //_pTplNumCoach: 2,
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
    //header phoi
    //_pTitleTpl: "<table class='print-title'><tbody><tr><td style='width: 250px !important;'><strong class='title'>{p._title}</strong></td><td colspan='2'><strong class='rname'>{p._rname}</strong></td><td style='145px !important;'>Số xe:&nbsp{p._busNum}</td></tr><tr><td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Lái xe:&nbsp;{p._driverName}</td><td>Phục vụ:&nbsp;{p._assistantName}</td></tr></tbody></table>",
    _pTitleTpl: "<table class='print-title'>" +
            "<thead></thead>" +
            "<tbody>" +
                "<tr>" +
                    "<td colspan='2'><strong class='rname'>{p._rname}</strong></td>" +
                    "<td><strong class='title'>{p._title}</strong></td>" +
                "</tr>" +
                "<tr>" +
                    "<td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td>" +
                    "<td>Số xe:&nbsp{p._busNum}</td>" +
                    "<td>Tài xế:&nbsp;{p._driverName}</td>" +
                "</tr>" +
            "</tbody>" +
        "</table>",
	_disallowBkAtrDpt: true,
    _allowGroupByCode: false,
    _specialNumColBySeatTemplateId: {
        95: 4,
        103: 2,
        104: 4,
        105: 4,
    },
    //_pTplNumCoach: 1,

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

	    // Ghế đại diện khi in phơi
    groupSeat: {
        groupFields: "phone",
        displayFields: "phone|3,note,pInfo"
    },

    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
          + "<tbody>"
          + "<tr style='height: 18px'><td><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='pmInfo ppayment {pseat._onlyPaidBackGround}' style='font-size:12px;'>{pseat._stageName} {pseat._nTicketPerTrip}</p></td></tr>"
          + "<tr class='thong'><td><p class='pcname'>{pseat._cname}</p><p class='pcphone'> <b>{pseat._cphone}</b>&nbsp;<b class='ntk-pertrip'></b></p></td></tr>"
          + "<tr><td><p class='pnote' style='clear:both;'> {pseat._note}</p></td></tr>"
          + "</tbody>"
          + "</table></li>",
    _psTpl_SeatGroup:
        '<li class="print-seat" style="overflow:hidden;">' +
            '<table>' +
                '<tbody>' +
                  '<tr style="height: 22px">' +
                    '<td style="width:50%"><p class="pseat-code {data._paid}">{data.seatCode}</p></td>' +
                    '<td></td>' +
                  '</tr>' +
                  '<tr>' +
                    '<td colspan="2" style="text-align: center;font-size: 20px;">...{data.phone}</td>' +
                  '</tr>' +
                  '<tr>' +
                    '<td style="font-size:small;" colspan=2><p style="white-space: nowrap;overflow: hidden;font-size:18px;">{pseat._cname}{pseat._nTicketPerTrip}</p></td>' +
                  '</tr>' +
                '</tbody>' +
            '</table>' +
        '</li>',

    _hasPickUpOnPrintBKS: false,


    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
              + "<tbody>"
             + "<tr style='height: 18px;'><td><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><span class='fare' style='width=65%;float:right;'><b>{pseat._fare}</b></td></tr>"
             + "<tr style='line-height:9px;'><td style='height: 15px;'><p class='ppayment {pseat._paid} {pseat._exported}'>{pseat._stageName}</p></td></tr>"
              + "<tr><td><p class='pcname' style='text-align:left;width:100%;margin-top:-3px;white-space:nowrap'><span style='width=100%'>{pseat._cname}&nbsp;<span class='ntk' style='font-size:13px'>{pseat._nTicketPerTrip}</span></p><p class='sdt' style='font-size:14px;'><b>{pseat._cphone}</b></p><p class='pnote'>{pseat._note}</p></td></tr>"
             + "</tbody>"
              + "</table></li>",

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _epnp: {
        "10": ["0583"],
        "11": ["0583"],
    },
    // block ghế theo biển số xe
    _blockSeatByVehicle: ["1|6|1", "1|7|1", "1|8|1", "1|6|3", "1|7|3", "2|6|1", "2|7|1", "2|8|1", "2|6|3", "2|7|3"],
    _unblockSeatByVehicle:
        {
            "29B-064.41": ["1|6|1", "2|6|1"],
            "29B-063.76": ["1|6|1", "2|6|1"],
            "29B-077.89": ["1|6|1", "2|6|1", "1|6|3"],
            "29B-001.35": ["1|7|1", "1|8|1", "2|7|1", "2|8|1"],
            "29B-101.26": ["1|7|1", "1|8|1", "2|7|1", "2|8|1"],
            "29B-101.32": ["1|7|1", "1|8|1", "2|7|1", "2|8|1"],
            "29B-042.52": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "29B-117.58": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "29B-117.73": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "29B-117.25": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "29B-119.68": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "29B-137.28": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "24B-005.88": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "24B-004.69": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "24B-004.88": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "24B-000.88": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "24B-000.99": ["1|6|1", "1|6|3", "1|7|1", "2|6|1", "2|6|3"],
            "29B-013.15": ["1|6|1", "1|7|1", "1|8|1", "1|6|3", "1|7|3", "2|6|1", "2|7|1", "2|6|3", "2|7|3"],
            "29B-023.99": ["1|6|1", "1|7|1", "1|8|1", "1|6|3", "1|7|3", "2|6|1", "2|7|1", "2|6|3", "2|7|3"],
            "29B-101.21": ["1|6|1", "1|7|1", "1|8|1", "1|6|3", "1|7|3", "2|6|1", "2|7|1", "2|8|1", "2|6|3", "2|7|3"],
            "29B-101.92": ["1|6|1", "1|7|1", "1|8|1", "1|6|3", "1|7|3", "2|6|1", "2|7|1", "2|8|1", "2|6|3", "2|7|3"],
            "29B-024.87": ["1|6|1", "1|7|1", "1|8|1", "1|6|3", "1|7|3", "2|6|1", "2|7|1", "2|8|1", "2|6|3", "2|7|3"],
            "29B-023.99": ["1|6|1", "1|7|1", "1|8|1", "1|6|3", "1|7|3", "2|6|1", "2|7|1", "2|8|1", "2|6|3", "2|7|3"]


        },




    //_pTplNumCoach: 2, //Default 0 is not custom set 

    // Trip Info
    // _pSummaryTripInfo: true,
    // _pSummaryTripInfoPageBreak: false,
    // _tripInfo: "<div style='margin-top:7px;float:left;width:100%;'>" +

               // "<div style='float:right;width:100%;'>" +
                    // "<table style='width:100%;' cellspacing='0'>" +
                        // "<tbody>" +
                           // "<tr style='height:30px;line-height: 30px;'>" +
                               // "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;'>{p._totalPaidPerType} &nbsp;&nbsp;&#x21d2; Tổng:&nbsp;&nbsp;{p._totalPaid} &nbsp;&nbsp;&nbsp;&nbsp;{p._feeTienKhachFormat} &nbsp;&nbsp;{p._anotherFareTienKhachFormat} &nbsp;&nbsp;&nbsp;&nbsp;{p._totalTienKhachFormat}</td>" +
                           // "</tr>" +
                           // "<tr>" +
                                // "<td colspan='2' style='padding:0px 5px;border:1px solid #000;border-top:0;border-bottom:0;'>{p._moneyBranchProduct}</td>" +
                            // "</tr>" +
                            // "<tr>" +
                                // "<td colspan='2' style='padding:3px 5px 5px 5px;border:1px solid #000;border-top:0;'><span style='font-size:14px;'>D.đường:</span> {p._pickedProductFormat}</td>" +
                            // "</tr>" +
                            // "<tr>" +
                                // "<td colspan='2' style='padding:3px 5px 5px 5px;border:1px solid #000;border-top:0;'>{p._totalTienHangFormat}</td>" +
                            // "</tr>" +
                        // "</tbody>" +
                    // "</table>" +
                // "</div>" +
            // "</div>",
	// Trip Info
    _pSummaryTripInfo: true,
    _pSummaryTripInfoPageBreak: false,
    _tripInfo: "<div style='margin-top:70px;float:left;width:100%;'>" +
               "<div style='float:left;width:100%;'>" +
                    "<table style='width:100%;' cellspacing='0'>" +
                        "<tbody>" +
                           "<tr style='height:140px;'>" +
                               "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;font-size:20px;'>{p._totalPaidPerType} <br />&#x21d2; Tổng:&nbsp;&nbsp;{p._totalPaid} <br />&nbsp;&nbsp;&nbsp;&nbsp;{p._feeTienKhachFormat}</br>&nbsp;&nbsp;&nbsp;&nbsp;{p._anotherFareTienKhachFormat}<br />&nbsp;&nbsp;&nbsp;&nbsp;{p._totalTienKhachFormat}</td>" +
                           "</tr>" +
                           "<tr>" +
                                "<td colspan='2' style='padding:0px 5px;border:1px solid #000;border-top:0;border-bottom:0;font-size:20px;'>{p._moneyBranchProduct}</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' style='padding:3px 5px 5px 5px;border:1px solid #000;border-top:0;'><span style='font-size:20px;'>D.đường:</span></br>&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-size:20px;'>{p._pickedProductFormat}</span></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2' style='padding:3px 5px 5px 5px;border:1px solid #000;border-top:0;font-size:20px;'>{p._totalTienHangFormat}</td>" +
                            "</tr>" +
                        "</tbody>" +
                    "</table>" +
                "</div>" +

               "<div style='float:right;width:100%;margin-top:10px;'>" +
                    "<table style='width:100%;' cellspacing='0'>" +
                        "<tbody>" +
                            "<tr style='font-size:20px;'>" +
                                "<td colspan='2' style='width:100%;padding:3px 5px;border-left:1px solid #000;border-top:1px solid #000;border-bottom:0;border-right: 1px solid #000;'>Cầu đường: {p._tollFee}</td>" +
                            "</tr>"+ 
							"<tr style='font-size:20px;'>" +
								"<td colspan='2' style='width:100%;padding:3px 5px;border-right: 1px solid #000;border-top:0;border-left:1px solid #000;'>Rửa xe: {p._washFee}</td>" +
                            "</tr>" +
                            "<tr style='font-size:20px;'>" +
                                "<td style='width:50%;padding:3px 5px;border-left: 1px solid #000;'>Tiền ăn: {p._eatFee}</td>" +
                                "<td style='width:50%;padding:3px 5px;border-right: 1px solid #000;'></td>" +
                            "</tr>" +
                            "<tr style='height:86px;vertical-align:top;font-size:20px;'>" +
                                "<td colspan='2' style='width:100%;padding:3px 5px;border-left: 1px solid #000;border-right: 1px solid #000;'>CPkhác:</br>&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-size:20px;'>{p._anotherFee}</span></td>" +
                            "</tr>" +
							"<tr style='font-size:20px;'>" +
                                "<td colspan='2' style='padding:3px 5px 3px 5px;border:1px solid #000;width:50%;border-right: 1px solid #000;border-top:0;border-bottom:0;'>Tổng chi:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {p._totalFee}</td>" +
                             "</tr>"+
                            "<tr style='font-size:20px;'>" +
                                "<td colspan='2' style='padding:3px 5px 3px 5px;border:1px solid #000;border-bottom:0;border-top:1px solid #000;'>Tiền khách:&nbsp;&nbsp;&nbsp;&nbsp; {p._totalTienKhach}</td>" +
                            "</tr>" +
                            "<tr style='font-size:20px;'>" +
                                "<td colspan='2' style='padding:3px 5px 3px 5px;border:1px solid #000;border-bottom:0;'>Tiền hàng:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {p._totalTienHang}</td>" +
                            "</tr>" +
                            
							 "<tr style='font-size:20px;'>" +   
							   "<td  colspan='2' style='padding:3px 5px 3px 5px;border:1px solid #000;width:50%;border-left:1px solid #000;;'>Còn lại:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {p._totalTotal}</td>" +
                            "</tr>" +
                            "<tr style='height:32px;'>" +
                               "<td colspan='2' style='border:0;padding-top:5px;font-size:16px;'>* Nghiêm cấm tẩy xóa phơi lệnh<br />* Lái xe, phụ xe chấp hành thanh tra, kiểm sát và điều hành</td>" +
                            "</tr>" +
                        "</tbody>" +
                    "</table>" +
                "</div>" +
           "</div>",
});
