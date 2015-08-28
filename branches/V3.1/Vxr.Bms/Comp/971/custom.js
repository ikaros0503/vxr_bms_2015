//Extend dict
define({
    _pStyleUrl: "/Comp/971/print.css?v=1.0.8",
    _specialPos: {
        40: {
            "1_6_3": [1, 6, 2], "1_6_5": [1, 6, 3], "1_6_2": [1, 6, 4], "1_6_4": [1, 6, 5], "1_7_5": [1, 7, 1], "1_7_1": [1, 7, 5],
            "2_6_2": [2, 6, 4], "2_6_3": [2, 6, 2], "2_6_5": [2, 6, 3], "2_6_4": [2, 6, 5]
        }
    },
    _pSpecialPos: {
        40: {
            "2_1_1": [1, 1, 1], "1_1_1": [1, 1, 2], "2_1_3": [1, 1, 4], "1_1_3": [1, 1, 5], "2_1_5": [1, 1, 7], "1_1_5": [1, 1, 8],
            "2_2_1": [1, 2, 1], "1_2_1": [1, 2, 2], "2_2_3": [1, 2, 4], "1_2_3": [1, 2, 5], "2_2_5": [1, 2, 7], "1_2_5": [1, 2, 8],
            "2_3_1": [1, 3, 1], "1_3_1": [1, 3, 2], "2_3_3": [1, 3, 4], "1_3_3": [1, 3, 5], "2_3_5": [1, 3, 7], "1_3_5": [1, 3, 8],
            "2_4_1": [1, 4, 1], "1_4_1": [1, 4, 2], "2_4_3": [1, 4, 4], "1_4_3": [1, 4, 5], "2_4_5": [1, 4, 7], "1_4_5": [1, 4, 8],
            "2_5_1": [1, 5, 1], "1_5_1": [1, 5, 2], "2_5_3": [1, 5, 4], "1_5_3": [1, 5, 5], "2_5_5": [1, 5, 7], "1_5_5": [1, 5, 8],
            "1_6_1": [1, 6, 1], "1_6_2": [1, 6, 2], "1_6_3": [1, 6, 3], "1_6_4": [1, 6, 4], "1_6_5": [1, 6, 5],
            "2_6_1": [1, 7, 1], "2_6_2": [1, 7, 2], "2_6_3": [1, 7, 3], "2_6_4": [1, 7, 4], "2_6_5": [1, 7, 5]

            //"2_2_1": [1, 2, 2], "1_2_3": [1, 2, 4], "2_2_3": [1, 2, 5], "1_2_5": [1, 2, 7], "2_2_5": [1, 2, 8],
            // "2_3_1": [1, 3, 2], "1_3_3": [1, 3, 4], "2_3_3": [1, 3, 5], "1_3_5": [1, 3, 7], "2_3_5": [1, 3, 8],
            // "2_4_1": [1, 4, 2], "1_4_3": [1, 4, 4], "2_4_3": [1, 4, 5], "1_4_5": [1, 4, 7], "2_4_5": [1, 4, 8],
            // "2_5_1": [1, 5, 2], "1_5_3": [1, 5, 4], "2_5_3": [1, 5, 5], "1_5_5": [1, 5, 7], "2_5_5": [1, 5, 8],
            // "2_6_1": [1, 6, 1], "2_6_2": [1, 6, 2], "2_6_3": [1, 6, 3], "2_6_4": [1, 6, 4], "2_6_5": [1, 6, 5],
            // "1_6_1": [1, 7, 1], "1_6_2": [1, 7, 2], "1_6_3": [1, 7, 3], "1_6_4": [1, 7, 4], "1_6_5": [1, 7, 5],
            // "1_7_1": [1, 8, 1], "1_7_2": [1, 8, 2], "1_7_3": [1, 8, 3], "1_7_4": [1, 8, 4], "1_7_5": [1, 8, 5]
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
        [1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
        [1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
        [1, 1, "", "input", "hidden", "NumClick", "", "", {}, [], ""],
        [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
        [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
        [3, 1, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
        [3, 2, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
        [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
        [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
        [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
        //[5, 2, "Phụ thu", "input", "text", "Surcharge", "form-control vblue fw700", "", {}, [], "đ"],
        [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
       // [6, 2, "Đặt cọc", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "đ"],
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
        //[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
        [10, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
    ],
    "form-horizontal"
    ],
    _pNoSeat: true,
    //_allowGroupByCode: true,
    _epnp: {
        "10": [
            "059"
        ],
    },

    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 1, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _showUCharge: true, //nguoi thanh toan
    _noShowAgentInfo: true, //chi nhanh dat cho
    _hasPickUpOnPrintBKS: false, // ds don doc duong

    _pTplNumCoach: 1,
    _pTplNumCol: 8,

    //block ghế theo biển số xe
    _blockSeatByVehicle: ["1|7|5"],
    //Mở khoá theo xe
    _unblockSeatByVehicle:
    {
        "51B-117.30": ["1|7|5"],
        "51B-115.57": ["1|7|5"]
    },

    _hasMergeTransfer: { 22443: true },
    hasTransferTimeConf: ["00:01-23:59"],

    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: false,

    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
          + "<tbody>"
+ "<tr style='height: 16px'><td><p style='width:65%;'>{pseat._cuser}</p><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='pcname'><b>{pseat._cname}&nbsp;{pseat._nTicketPerTrip}</b></p></td></tr>"
          + "<tr style='height: 17px;'><td style='height: 17px;'><p class='pcphone'> {pseat._cphone}</p></td></tr>"
          + "<tr><td><p class='pnote' style='clear:both;'>{pseat._pInfo}</p></td></tr>"
          + "<tr><td><p class='ghichu' style='clear:both;'>{pseat._note}</p></td></tr>"
          + "</tbody>"
          + "</table></li>",

    //seat, phone, '': disabled => ghế đại diện (seat or phone)
    //_psTpl_Label: "<li class='print-seat'><table><tbody><tr style='height: 22px;'><td><p class='pseat-code'>{pseat._label}</p></td> </tr><tr><td style='text-align: center;font-size: 20px;'>{pseat.textLabel}<td></tr></tbody></table></li>",

    // Ghế đại diện khi in phơi
    // groupSeat: {
    //    groupFields: "phone->ticketCode",
    //   displayFields: "phone|4,note,pInfo"
    //   },
    _psTpl_SeatGroup:
        '<li class="print-seat col-md-4" style="overflow:hidden;">' +
            '<table>' +
                '<tbody>' +
                  '<tr style="height: 22px">' +
                    '<td style="width:100%"><p class="pseat-code {data._paid}">{data.seatCode}</p></td>' +
                    '<td></td>' +
                  '</tr>' +
                  '<tr>' +
                    '<td colspan="2" style="text-align: center;font-size: 20px;">{data.originalSeatCode}</td>' +
                  '</tr>' +
                  '<tr>' +
                    '<td style="font-size:small;" colspan=2><p style="white-space: nowrap;overflow: hidden;"> {data.pInfo}</p></td>' +
                  '</tr>' +
                  '<tr>' +
                    '<td style="font-size:small;" colspan=2><p style="white-space: nowrap;overflow: hidden;"> {data.note}</p></td>' +
                  '</tr>' +
                '</tbody>' +
            '</table>' +
        '</li>',

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",


    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",

    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 4%;'>STT</th style='width: 20%;'><th>Số ghế</th><th style='width: 20%;'>Địa chỉ cần đón</th><th style='width: 10%;'>Tên HK</th><th style='width: 12%;white-space:nowrap;'>Số điện thoại</th><th style='width: 12%;'>Trạng thái</th><th style='width: 20%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class='{seat._class}'><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",
    _multiSeatOnTicket: true,//in nhieu ve gop thanh 1 ve

    //seat, phone, '': disabled
    _psTpl_Label: "<li class='print-seat'><table><tbody><tr style='height: 22px;'><td><p class='pseat-code'>{pseat._label}</p></td> </tr><tr><td style='text-align: center;font-size: 20px;'>{pseat.textLabel}<td></tr></tbody></table></li>",
    _labelValueForTheSameCustomer: 'phone',

    // Print Special Note
    _pSNote: true,
    // vị trí tầng được áp dụng in ghi chú đặc biệt
    _pSNoteCoachEffective: {
        40: 1
    },
    _pSNoteInfo: {
        40: {
            1: "<div style='position:relative;clear:both;'>" +
                    "<table cellpadding='0' cellspacing='0' border='0' width='100%' style='position:absolute;margin-top:5px;'>" +
                        "<tr>" +
                            "<td style='line-height:30px;'><b>Số khách thực tế tại bến:</b>........................................<b>Lái xe 1:</b> ........................................&nbsp;&nbsp;&nbsp;&nbsp;<b>Ký Nhận</b></td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td style='line-height:30px;'><b>Số khách đón dọc đường:</b>........................................<b>Lái xe 2:</b> ........................................</td>" +
                        "</tr>" +
                       "<tr>" +
                            "<td style='line-height:30px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Tổng Cộng:</b>........................................<b>Lái xe 2:</b> ........................................</td>" +
                        "</tr>" +
                                    "</tbody>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>" +
                "</div>",
            2: "",
        }

    }

});
