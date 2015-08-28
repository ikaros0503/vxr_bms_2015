//Extend dict
define({
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
    //_pNoSeat: false,
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
    _epnp: {
        "10": [
            "043"
        ],
    },
    // _blockSeatByVehicle: [
    // {
    // "29B-083.99": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    // "29B-067.13": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    // "29B-066.78": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    // "29B-066.29": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    // "29B-066.90": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    // "29B-065.52": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    // "29B-039.48": ["1|6|3", "2|6|3"],
    // "29B-040.54": ["1|6|3", "2|6|3"]
    // }
    // ],
    // block ghế theo biển số xe
    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _showUCharge: true, //nguoi thanh toan
    _noShowAgentInfo: true, //chi nhanh dat cho
    _hasPickUpOnPrintBKS: false, // ds don doc duong
    //_pTplNumCoach: 1,

    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: true,
    // chang mac dinh trong form U,P
    // _hasDefaultStagePerTrip: true,
    // _defaultStagePerTrip: {
        // // TripId: [DefaultFromId, DefaultToId]
        // 8269: "786, 1673",
        // 8271: "1673, 786"
    // },

    // cấu hình sơ đồ ghế có số numcol đặc biệt
    // SeatTemplateId: num of col
    _specialNumColBySeatTemplateId: {
        218: 4
    },
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
          + "<tbody>"
          + "<tr style='height: 18px'><td><p class='pseat-code{pseat._dathanhtoan}'>{pseat._label}</p><p class='stage'>{pseat._stageName} {pseat._nTicketPerTrip}</p></td></tr>"
          + "<tr class='thong'><td><p class='pcname'>{pseat._cname}</p><p class='pcphone'> <b>{pseat._cphone}</b></p></td></tr>"
      
         // + "<tr><td><p class='pnote' style='clear:both;'> {pseat._note}</p></td></tr>"
          + "</tbody>"
          + "</table></li>",
    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}</p><p>{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

    _pStyleUrl: "/Comp/524/print.css?v=1.0.1",
    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",

    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 4%;'>STT</th style='width: 20%;'><th>Số ghế</th><th style='width: 20%;'>Địa chỉ cần đón</th><th style='width: 10%;'>Tên HK</th><th style='width: 12%;white-space:nowrap;'>Số điện thoại</th><th style='width: 12%;'>Trạng thái</th><th style='width: 20%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class='{seat._class}'><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",

	 // Trip Info
    _pSummaryTripInfo: true,
    _pSummaryTripInfoPageBreak: false,
    _tripInfo: "<div style='margin-top:10px;float:left;width:100%;'>" +
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
                            // "<tr style='height:32px;'>" +
                               // "<td colspan='2' style='border:0;padding-top:5px;font-size:13.5px;'>* Nghiêm cấm tẩy xóa phơi lệnh<br />* Lái xe, phụ xe chấp hành thanh tra, kiểm sát và điều hành</td>" +
                            // "</tr>" +
                        "</tbody>" +
                    "</table>" +
                "</div>" +
           "</div>",
});
