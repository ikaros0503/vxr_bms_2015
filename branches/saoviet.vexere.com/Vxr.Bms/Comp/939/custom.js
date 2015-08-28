//Extend dict
define({
    _pStyleUrl: "/Comp/939/print.css?v=1.0.1",

    // Tuỳ chỉnh vị trí ghế ngoài BKS
    _specialPos: {
        40: {
            "1_6_5": [1, 6, 3], "1_6_4": [1, 6, 2], "1_6_2": [1, 6, 4], "1_6_3": [1, 6, 5],
            "2_6_5": [2, 6, 3], "2_6_4": [2, 6, 2], "2_6_2": [2, 6, 4], "2_6_3": [2, 6, 5]
        }
    },
    //Tuỳ chỉnh vị trí ghế trên phơi
    _pSpecialPos: {
        40: {
            "2_1_1": [1, 2, 1], "2_1_3": [1, 2, 3], "2_1_5": [1, 2, 5],
            "1_2_1": [1, 3, 1], "1_2_3": [1, 3, 3], "1_2_5": [1, 3, 5]
        }
    },

    //Thông tin form U
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
       [6, 1, "Phụ thu", "input", "text", "Surcharge", "form-control  vblue fw700", "", {}, [], "đ"],
       [6, 2, "Giảm giá", "input", "text", "Discount", "form-control  vblue fw700", "", {}, [], "đ"],
       [7, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
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
    //Block Tab trong U ứng với Status
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
    //Chọn các hình thức thanh toán. 1 shown; 2 hide
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 0, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],

    _hasBTWarning: true, //Cảnh báo trong U

    //Edit sau xuất bến bao lâu
    _limitedDateBefore: 7,
    _limitedMinuteBefore: 120,

    // Có nhiều giá (giá các chặng con)
    _hasMultiFare: true,
    //Mạc định chặng trong U
    _hasDefaultStagePerTrip: true,
    _defaultStagePerTrip: {
        // TripId: [DefaultFromId, DefaultToId]
        1115: "1780, 1673",
        1116: "1673, 1780"
    },
    //Hiển thị số tầng
    _pTplNumCoach: 1,
    // hiện nút P ngoài BKS: nhớ thêm các css sau vào file custom.css của nhà xe
    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick' style='font-size: 12px !important;'>{seat._pInfo}</div></div>"
      + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p class='cinfo' style='height:20px !important;'><b><span class='name' style='font-size: 13px !important'>{seat._cname}</span></b><span class='numT'>{seat._nTicketPerTrip}</span><span class='phone' style='font-size: 15px !important;'>&nbsp;&nbsp;{seat._cphone}</span><p><span style='font-size:13px !important;'>{seat._note}</span></p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",

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


    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
       + "<tbody>"
       + "<tr><td height='16px;'><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='ppickup {pseat._exported}' style='text-align: right; font-size: 16px;'>{pseat._note}</p></td></tr>"
       + "<tr><td><p class='pcname' style='font-size: 18px;'>{pseat._cname}&nbsp;<b class='ntk-pertrip' style='font-size: 15px;'>{pseat._nTicketPerTrip}</b></p><p class='pcphone' style='font-size: 18px !important;'><b>{pseat._cphone}</b></p><p class='pnote' style='clear:both; font-size: 18px;'>{pseat._pInfo}</p></td></tr>"
       + "</tbody>"
       + "</table></li>",
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [4, { vi: "Tài xế thu" }, 1, "TX"], [6, { vi: "Đại lý" }, 1, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],


    //Group vé theo Code
    _allowGroupByCode: true,

    //Tab Valid & history của vé mở Valid
    _trule: [
         //Chọn 2 vé trở lên thì cái này đóng
        ["valid", "history"],
        //Chọn 1 vé với Status nào thì Tab Valid đóng
        [
            [1, ["valid"]],
            [2, ["valid"]],
            [5, ["valid"]]
        ]
    ], //Multiple ticket, status of ticket,       

    _hasPickUpOnPrintBKS: false,
});
