//Extend dict
define({
    _specialPos: {
        38: {
            "1_6_4": [1, 6, 3], "1_6_3": [1, 6, 2], "1_6_2": [1, 6, 1], "1_6_1": [1, 6, 4],
            "2_6_4": [2, 6, 3], "2_6_3": [2, 6, 2], "2_6_2": [2, 6, 1], "2_6_1": [2, 6, 4]
        },
        48: {
            "1_6_1": [1, 7, 3], "1_6_2": [1, 7, 1], "1_6_3": [1, 6, 1], "1_6_4": [1, 6, 2], "1_6_5": [1, 6, 3],
            "1_7_2": [1, 8, 1], "1_7_3": [1, 8, 3], "1_7_4": [1, 8, 5], "1_7_5": [1, 7, 5],
            "2_6_1": [2, 7, 3], "2_6_2": [2, 7, 1], "2_6_3": [2, 6, 1], "2_6_4": [2, 6, 2], "2_6_5": [2, 6, 3],
            "2_7_2": [2, 8, 1], "2_7_3": [2, 8, 3], "2_7_4": [2, 8, 5], "2_7_5": [2, 7, 5]
        }
        // 46: {
        // "1_6_1": [1, 7, 3], "1_6_2": [1, 7, 1], "1_6_3": [1, 6, 1], "1_6_4": [1, 6, 2], "1_6_5": [1, 6, 3],
        // "1_7_2": [1, 8, 1], "1_7_3": [1, 8, 3], "1_7_4": [1, 8, 5], "1_7_5": [1, 7, 5],
        // "2_6_1": [2, 7, 3], "2_6_2": [2, 7, 1], "2_6_3": [2, 6, 1], "2_6_4": [2, 6, 2], "2_6_5": [2, 6, 3],
        // "2_7_2": [2, 8, 1], "2_7_3": [2, 8, 3], "2_7_4": [2, 8, 5], "2_7_5": [2, 7, 5]
        // }
    },

    // hiện nút P ngoài BKS: nhớ thêm các css sau vào file custom.css của nhà xe        div.buttons { width: 51% !important; } div.cinfo {width: 49% !important;}
    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],

    // Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["PhoneNumbers", "Note", "Code"],
    // Vé khứ hồi: copy các thông tin sau
    _returnField: ["FullName", "PhoneNumbers"],
    _returnFieldRequired: ["PhoneNumbers"],
    // dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
    // 5|10092|1: quyền này sẽ mở khóa các button 
    _closedTripConf: {
        "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save", "btn-add-more-ticket", "btn-return"],
        "ValidForm": []
    },
    // bắt buộc nhập thông tin tài xế mới cho phép bấm nút Xuất Bến
    // các thông tin bắt buộc gồm có
    // VehicleNumber: biển số xe
    // DriverName: tên tài xế
    // AssistantName: tên phục vụ
    _driverInfoRequired: true,
    _fieldDriverInfoRequired: ["VehicleNumber", "DriverName"],

    // phân quyền báo cáo
    _hasReportPermission: false,
    _reportPermissionType: {
        1: ["10070"], // quản trị viên
        2: ["10070"], // nhà xe
        3: ["10073", "10074", "10075", "10076", "10077", "10078", "10079", "10080", "10081"], // báo cáo viên
        4: ["10071", "10072"], // bán vé
        5: ["10071", "10072", "10073"]  // trưởng trạm
    },

    // block ghế theo biển số xe
    _blockSeatByVehicle: ["1|6|1", "2|6|1"],
    _unblockSeatByVehicle:
        {
            "79B-1500": ["1|6|1", "2|6|1"],
            "79B-1081": ["1|6|1", "2|6|1"],
            "79B-0628": ["1|6|1", "2|6|1"],
            "79B-0711": ["1|6|1", "2|6|1"],
            "79B-0950": ["1|6|1", "2|6|1"],
            "79B-1324": ["1|6|1", "2|6|1"]
        }
        ,

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",


    // _sTpl: "<li class='seat {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
    // + "<div class='agentinfo clearfix'><p>{seat._suser}{seat._cuser}</p><p>{seat._pmFullInfo}</p><p>{seat._note}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span>&nbsp;<span class='phone'>{seat._cphone}</span></p></div></div></div></li>",
    _pStyleUrl: "/Comp/582/print.css?v=1.0.29",
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
       + "<tbody>"
       + "<tr><td height='16px;'><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='ppickup {pseat._exported}'>{pseat._fare}</p></td></tr>"
       + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'><b>{pseat._cphone}</b></p><p class='pnote' style='clear:both;'>{pseat._note}</p></td></tr>"
       + "</tbody>"
       + "</table></li>",
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [4, { vi: "Tài xế thu" }, 1, "TX"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
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
        [10, 1, "", "button", "button", "Khứ hồi", "btn btn-primary pull-left btn-return", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
    ],
    "form-horizontal"
    ], //Id, Elements, Class, GridClass
    _allowGroupByCode: true,
    _trule: [
       ["valid", "history"],
       [
           [1, ["valid"]],
           [2, ["valid"]],
           [5, ["valid"]]
       ]
    ], //Multiple ticket, status of ticket,

    _epnp: {
        "10": ["058"]
    },

    _hasPickUpOnPrintBKS: false,

    // Trip Info
    _pSummaryTripInfo: false,
    _pSummaryTripInfoPageBreak: true, // có qua trang hay không
    _tripInfo: "<div style='clear:both;float:left;margin-top:50px;width:100%;'>" +
                    "<table style='width:100%;' cellspacing='0' cellpadding='2' border='0'>" +
                        "<tr>" +
                            "<td width='50%' style='vertical-align:top;'>" +
                                "<table style='width:100%;' cellspacing='0' cellpadding='5' border='1'>" +
                                    "<tr>" +
                                        "<td>" +
                                            "<table style='width:100%;' cellspacing='0' cellpadding='15' border='0'>" +
                                                "<tr style='min-height:100px;'>" +
                                                    "<td></td>" +
                                                    "<td style='vertical-align:top;font-size:20px;'>{p._totalPaidPerType}</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td style='white-space:nowrap;font-size:20px;'>Tổng thanh toán:</td>" +
                                                    "<td style='font-size:20px;'>{p._totalPaid}</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td style='font-size:20px;'>Khách đón:</td>" +
                                                    "<td style='font-size:20px;'>..........................................................</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td style='font-size:20px;'>Đón dọc đường:</td>" +
                                                    "<td style='font-size:20px;'>..........................................................</td>" +
                                                "</tr>" +
                                            "</table>" +
                                        "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td style='white-space:nowrap;padding:10px 10px 5px 10px;font-size:22px;line-height:53px;'><span style=''><b>Tổng tiền khách:</b></span>........................................................</td>" +
                                    "</tr>" +
                                    "</tr>" +
                                    "<tr style='height:90px;'>" +
                                        "<td style='vertical-align:top;padding-left:40px;font-size:20px;line-height:30px;'>{p._moneyBranchProduct}</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td style='white-space:nowrap;padding:10px 10px 5px 10px;font-size:22px;line-height:53px;'><span style=''><b>Tổng tiền hàng:</b></span>..........................................................</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td style='white-space:nowrap;padding:10px 10px 5px 10px;font-size:22px;line-height:53px;'><span style=''><b>Tổng thu:</b></span>....................................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                            "<td width='50%' style='vertical-align:top;'>" +
                                "<table style='width:100%;' cellspacing='0' cellpadding='5' border='1'>" +
                                    "<tr>" +
                                        "<td>" +
                                            "<table style='width:100%;' cellspacing='0' cellpadding='15' border='0'>" +
                                                "<tr>" +
                                                    "<td style='font-size:20px;'>Nhân viên:</td>" +
                                                    "<td style='font-size:20px;'>.................................................................</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td style='font-size:20px;'>Lệnh:</td>" +
                                                    "<td style='font-size:20px;'>.................................................................</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td style='white-space:nowrap;font-size:20px;'>Cầu đường:</td>" +
                                                    "<td style='font-size:20px;'>.................................................................</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td style='font-size:20px;'>Tiền ăn:</td>" +
                                                    "<td style='font-size:20px;'>.................................................................</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td style='font-size:20px;border-bottom:0;'>Rửa xe:</td>" +
                                                    "<td style='font-size:20px;border-bottom:0;'>.................................................................</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td colspan='2' style='font-size:20px;border-bottom:0;'>..........................................................................................</td>" +
                                                "</tr>" +
                                                "<tr>" +
                                                    "<td colspan='2' style='font-size:20px;border-bottom:0;'>..........................................................................................</td>" +
                                                "</tr>" +
                                            "</table>" +
                                        "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td style='white-space:nowrap;width:100%;padding:10px 10px 5px 10px;font-size:22px;line-height:53px;'><b>Tổng chi</b>:....................................................................</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td style='white-space:nowrap;width:100%;padding:10px 10px 5px 10px;font-size:22px;line-height:53px;'><b>Còn lại:</b>......................................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>" +
                "<div>"
    ,

    /* Pick up */
    _puTpl: "<div class='plist'><h4>DANH SÁCH ĐÓN DỌC ĐƯỜNG&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='8'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _ipuTpl: "<tr class='{seat._class}' data-code='{seat._code}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-pText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm pIndex' type='text' value='{seat._index}'/></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ppuTpl: "<div class='list plist'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered'><thead><tr><th>Địa chỉ đón</th><th>Số ghế</th><th>SĐT</th><th>Tổng tiền</th><th>T.thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='1' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td>{t._totalSeat}</td><td colspan='1'></td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _ippuTpl: "<tr><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",

    // Pickup Info
    _pSummaryPickupInfo: true,
    _pSummaryPickupInfoPageBreak: false, // có qua trang hay không
    _sumPickupInfo: "<div style='clear:both;float:left;margin-top:10px;width:100%;'>" +
                    "<table width='100%' cellspacing='0' cellpadding='5' border='0'>" +
                        "<tr>" +
                            "<td width='50%' style='vertical-align:top;'>" +
                                "<table width='100%' cellspacing='0' cellpadding='5' border='0'>" +
                                    "<tr>" +
                                        "<td width='25%' style='white-space:nowrap;'>Bến bán:</td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='25%'></td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='10%'></td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='25%'></td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                            "<td width='50%' style='vertical-align:top;'>" +
                                "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    "<tr style='line-height:28px;'>" +
                                        "<td width='25%' style='white-space:nowrap;'>Nhân viên:</td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                    "<tr style='line-height:28px;'>" +
                                        "<td width='25%' style='white-space:nowrap;'>Lệnh:</td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='25%' style='height:28px;'></td>" +
                                        "<td></td>" +
                                    "</tr>" +
                                    "<tr style='line-height:28px;'>" +
                                        "<td width='25%' style='white-space:nowrap;'>Trống</td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td>" +
                                "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    "<tr>" +
                                        "<td width='25%' style='white-space:nowrap;'>Cước hàng:</td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                            "<td>" +
                                "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    "<tr>" +
                                        "<td width='25%' style='white-space:nowrap;'>T.xế thu:</td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td>" +
                                "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    "<tr>" +
                                        "<td width='25%' style='white-space:nowrap;'><span style='text-decoration:underline;'><b>Thu:</b></span></td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                            "<td>" +
                                "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    "<tr>" +
                                        "<td width='25%' style='white-space:nowrap;'>Đón:</td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td>" +
                                "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    "<tr>" +
                                        "<td width='25%' style='white-space:nowrap;'><span style='text-decoration:underline;'><b>Chi:</b></span></td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                            "<td>" +
                                "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    "<tr>" +
                                        "<td width='25%' style='white-space:nowrap;'><span style='text-decoration:underline;'><b>Còn lại:</b></span></td>" +
                                        "<td>..........................................................</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>" +
                "<div>"

});
