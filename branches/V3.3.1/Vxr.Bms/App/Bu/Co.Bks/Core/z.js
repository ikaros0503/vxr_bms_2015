///#source 1 1 /App/Bu/Co.Bks/Core/o.js
//FlatObj.R =>Rights
//FlatObj.W =>Widget
//FlatObj.SP =>StopPoints Danh sách điểm dừng cho vé chặng
//FlatObj.cRoute = self._data[self._cTripIndex]; //Current Route
//FlatObj.cTrip = FlatObj.cRoute.Ts[FlatObj.W._cTripTime] //Current Trip
//FlatObj.F =>Filter
//FlatObj.HScrolled => has Scroll
//FlatObj.STBPhone => search ticket by phone
//FlatObj.FTripGetTrip => module TripId
//FlatObj.RBePrint => Reload before print
//FlatObj.LDefTrip => load default trip
//FlatObj.LFTime => load first time
var FlatObj = {
    STBPhone: false,
    FTripGetTrip: false,
    RBePrint: false,
    LDefTrip: false,
    LFTime: true
};

var _dict = {
    _lang: "vi",
    _tgF: ["Id", "TripId", "AgentId", "TripDate", "SeatCode", "IssueDate", "PickupDate", "CustomerInfo", "Status", "Fare", "Note", "PickupInfo", "Serial", "PaymentInfo", "IsPrgHistoryInfo", "Code", "PassCode", "FromValid", "ToValid", "IsPrgUpdatedDate", "AgentInfo", "Surcharge", "TripAlias", "CreatedUser", "UserCharge", "StageCode", "Deposit", "Discount", "FromArea", "ToArea", "SeatType", "Debt", "CanceledDate", "CancelInfo", "Type", "ChargeDate", "SNote", "ResponsibilityUser", "PickOrReturnDate", "StaffName", "CancelType", "NumOfSend", "FirstUserUpdated", "ExpiredTime", "PrintStatus", "IssuedUser", "NumOfPrint", "FromStop", "ToStop"],
    _tgF_B: ["Id", "TripId", "AgentId", "TripDate", "SeatCode", "IssueDate", "PickupDate", "CustomerInfo", "Status", "Fare", "Note", "PickupInfo", "Serial", "PaymentInfo", "IsPrgHistoryInfo", "Code", "PassCode", "FromValid", "ToValid", "IsPrgUpdatedDate", "AgentInfo", "Surcharge", "TripAlias", "CreatedUser", "UserCharge", "StageCode", "Deposit", "Discount", "FromArea", "ToArea", "SeatType", "Debt", "CanceledDate", "CancelInfo", "Type", "VexerePaymentInfo", "VexerePaymentType", "CompName", "SNote"],
    _cc: ["available", "booking", "paid", "cancelled", "notcome", "pass", "valid", "open", "keepOt"],
    _slc: ["selected"],
    _g: ["col-md-12", "col-md-6", "col-md-4", "col-md-3", "vcol-md-5", "col-md-2", "", "col-md-spec"],
    _sg: ["col-sm-4", "col-sm-4", "col-sm-4", "col-sm-4", "vcol-sm-5", "col-sm-2"],
    _mg: ["col-xs-12", "col-xs-6", "col-xs-6", "col-xs-6", "vcol-xs-5", "col-xs-2"],
    _chcl: ["coach-l", "coach-r"],
    _ts: [1, 2, 3, 6], //Seater, Sleeper, Semisleeper, Other
    _tks: [1, 2, 3, 4, 5, 8],
    // các trạng thái vé được tìm kiếm khi nhập số điện thoại trong form Update
    _tksUpSearch: [1, 2, 4, 5, 8],
    _mtks: [1, 2, 5, 8],
    _at: [
        [1, "B", 2, 1, "btn btn-sm bg-none circle active", "book"],
        [1, "C", 2, 1, "btn btn-sm bg-none circle active", "cancel"],
        [1, "U", 2, 1, "btn btn-sm bg-none circle active", "update"],
        [1, "M", 2, 1, "btn btn-sm bg-none circle active", "move"],
        [1, "Q", 2, 1, "btn btn-sm bg-none circle active", "quick-pay"],
        [1, "P", 2, 1, "btn btn-sm bg-none circle active", "quick-book"]
    ],
    _st: [[0], [2, 3, 5, 4], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    _lst: [[0], [3], [3], [3], [], [3], [], [], [3]],
    _ft: [],
    _err: [
        "Chỉ được đặt những ghế còn trống !",
        "Chỉ được cập nhật những ghế đã đặt hoặc đã thanh toán !",
        "Chỉ được thanh toán những ghế đã đặt !",
        "Bạn đang thực hiện thao tác đổi vé, vui lòng không thực hiện thao tác khác hoặc bấm ESC để hủy thao tác đổi vé !",
        "Ghế đã được đặt trước, vui lòng chọn ghế khác !",
        "Bạn đang thực hiện thao tác đặt thêm vé, vui lòng không thực hiện thao tác khác hoặc bấm ESC để hủy thao tác đặt thêm vé !",
        "Bạn đang thực hiện thao tác đặt vé khứ hồi, vui lòng không thực hiện thao tác khác hoặc bấm ESC để hủy thao tác đặt vé khứ hồi !",
        "Giá vé không chính xác, vui lòng kiểm tra lại !",
        "Bạn không được quyền thay đổi thông tin các vé đặt online, vui lòng chọn ghế khác !"
    ],
    _pm: [
        [1, { vi: "Tại văn phòng" }, 1, ""],
        [2, { vi: "Chuyển khoản" }, 0, "CK"],
        [3, { vi: "Thu tiền tại nhà" }, 0, "TN"],
        [4, { vi: "Tài xế thu" }, 1, "TX"],
        [5, { vi: "123Pay" }, 0, "123Pay"],
        [6, { vi: "Đại lý" }, 1, "DL"],
        [7, { vi: "VeXeRe" }, 0, "VXR"],
        [8, { vi: "Chủ xe thu" }, 0, "CX"],
        [9, { vi: "Không thu tiền" }, 1, "VIP"]
    ],
    _vxrPm: [
        [1, { vi: "Tại văn phòng" }, 1, ""],
        [2, { vi: "Chuyển khoản" }, 1, "CK"],
        [3, { vi: "Thu tiền tại nhà" }, 1, "TN"],
        [4, { vi: "Tài xế thu" }, 0, "TX"],
        [5, { vi: "123Pay" }, 1, "123Pay"],
        [6, { vi: "Đại lý" }, 1, "DL"],
        [7, { vi: "VeXeRe" }, 1, "VXR"],
        [8, { vi: "Chủ xe thu" }, 0, "CX"],
        [9, { vi: "Không thu tiền" }, 0, "VIP"]
    ],
    _qBookPayment: [
        [1, { vi: "Tại văn phòng" }, 1, ""],
        [2, { vi: "Chuyển khoản" }, 0, "CK"],
        [3, { vi: "Thu tiền tại nhà" }, 0, "TN"],
        [4, { vi: "Tài xế thu" }, 1, "TX"],
        [5, { vi: "123Pay" }, 0, "123Pay"],
        [6, { vi: "Đại lý" }, 0, "DL"],
        [7, { vi: "VeXeRe" }, 0, "VXR"],
        [8, { vi: "Chủ xe thu" }, 0, "CX"],
        [9, { vi: "Không thu tiền" }, 1, "VIP"]
    ],
    _opm: [2, 5],
    _vc: ["vred", "vblue", "vgreen", "vyellow"],
    _nOP: 30,
    _dOW: ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"],
    _uForm: [
        "UpdateForm",
        [
            //row, col, label, element, type, name, class, default value, attributes, options, icon, merge
            [1, 1, "", "input", "hidden", "IdInfo", "", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "CustomerInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "StatusInfo", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "CustomerId", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "NumSeat", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "pIndex", "", "", {}, [], ""],
            //////[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
            [1, 1, "", "input", "hidden", "NumClick", "", "", {}, [], ""],
            [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
            [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
            [4, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
            [4, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
            [5, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
            [5, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
            [6, 1, "Giá", "input", "text", "Fare", "form-control vblue fw700", "", {}, [], "đ"],
            //[6, 2, "Đặt cọc", "input", "text", "Deposit", "form-control vblue fw700", "", {}, [], "đ"],
            //[7, 1, "Phụ thu", "input", "text", "Surcharge", "form-control vblue fw700", "", {}, [], "đ"],
            //[7, 2, "Giảm giá", "input", "text", "Discount", "form-control vblue fw700", "", {}, [], "đ"],
            [6, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control vblue fw700", "", { "readonly": true }, [], "đ"],
            //[8, 2, "Nợ", "input", "text", "Debt", "form-control vblue fw700", "", { "readonly": true }, [], "đ"],
            [9, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
            [9, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
            [9, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
            [9, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
            [9, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
            [9, 2, "Mã giao dịch", "input", "text", "TransCode", "form-control mpayment", "", { "data-type": 5 }, [], ""],
            [9, 2, "Chọn đại lý", "select", "------Chọn đại lý-----", "AgentName", "form-control mpayment", "", { "data-type": 6 }, [], ""],
            //[10, 1, "Seri", "input", "text", "Serial", "form-control", "", {}, [], ""],
            //[8, 2, "Vé khứ hồi", "input", "text", "RoundTripCode", "form-control", "", {}, [], ""],
            [10, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
            [10, 2, "Mã vé", "label", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
            //[11, 1, "Người đặt", "input", "text", "ResponsibilityUser", "form-control vblue fw700", "", {}, [], ""],
            //[11, 2, "Ngày đón/về", "input", "text", "PickOrReturnDate", "form-control vblue fw700", "", {}, [], ""],
            //[11, 1, "Email", "input", "text", "Email", "form-control", "", {}, [], ""],
            //[11, 1, "Ghi chú 2", "textarea", "", "SNote", "form-control", "", {}, [], ""],
            //[9, 2, "Giữ chỗ đến giờ xe chạy", "input", "checkbox", "KeepOnTime", "", "", {}, [], ""],
            //[9, 2, "HK không đến", "input", "checkbox", "Notcome", "", "", {}, [], ""],
            //[10, 1, "Gửi tin nhắn", "input", "checkbox", "HasSendSms", "form-control fw700 bd0 pl0", "", {}, [], ""],
            [12, 1, "", "button", "button", "Hủy vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
            [12, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
            [12, 1, "", "button", "button", "Khứ hồi", "btn btn-primary pull-left btn-return", "", [], [], "", [1, 2]],
            [12, 1, "", "button", "button", "Cập nhật", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
            //[12, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
            [12, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint-save", "", [], [], "", [1, 2]],  //In vé tự động lưu thông tin và thanh toán
            [12, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
        ],
        "form-horizontal"
    ], //Id, Elements, Class, GridClass

    // ràng buộc dữ liệu trong form Update
    _uFormRequiredField: ["PhoneNumbers"],

    // dùng cho các nhà xe muốn khóa button sau khi bấm Xuất bến
    _closedTripConf: {
        "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save", "btn-add-more-ticket", "btn-return"],
        "ValidForm": []
    },
    // không cho phép đặt vé sau khi xuất bến
    _disallowBkAtrDpt: false,

    //focus when show update form
    //_focusUpdateForm: "FullName",
    // cảnh bảo user khác thao tác trên vé của một user khác
    _hasWarningConflictUser: true,

    // bắt buộc nhập thông tin tài xế mới cho phép bấm nút Xuất Bến
    // các thông tin bắt buộc gồm có
    // VehicleNumber: biển số xe
    // DriverName: tên tài xế
    // AssistantName: tên phục vụ
    _driverInfoRequired: true,
    _fieldDriverInfoRequired: ["VehicleNumber", "DriverName"],

    // khóa fromPoint khi đặt vé nhanh
    _hasBlockFromPoint: false,

    // mặc định chặng con theo từng tuyến đường
    //_hasDefaultStagePerTrip: true,
    //_defaultStagePerTrip: {
    //    // TripId: [DefaultFromId, DefaultToId]
    //    1115: "1, 4",
    //    1116: "1, 3",
    //    1826: "2, 5"
    //},

    // Có nhiều giá (giá các chặng con)
    _hasMultiFare: true,

    // phân quyền báo cáo
    // mặc định là có
    _hasReportPermission: true,

    // list button in QuickBook Form
    // [label, class]
    _qBookFormButton: [
        ["Hủy", "btn btn-danger hidden cancel-qBook"],
        ["In vé", "btn btn-warning print-qBook"],
        ["Thanh toán", "btn btn-success pay-qBook"]
    ],

    _vForm: [
        "ValidForm",
        [
            [1, 1, "", "input", "hidden", "IdInfo", "", "", "", {}, [], ""], //row, col, label, element, type, name, class, default value, attributes, options, icon, merge, gridClass
            [2, 1, "Open", "input", "radio", "Status", "", 7, {}, [], "", [], "col-md-4 col-xs-4 text-center"],
            [3, 1, "Valid", "input", "radio", "Status", "", 6, {}, [], "", [], "col-md-4 col-xs-4 text-center"],
            [3, 2, "", "input", "text", "FromValid", "form-control datepicker", "", { "placeholder": "Từ ngày" }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
            [3, 3, "", "input", "text", "ToValid", "form-control datepicker", "", { "placeholder": "Đến ngày" }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
            [4, 1, "Hủy vé", "input", "radio", "Status", "", 3, {}, [], "", [], "col-md-4 col-xs-4 text-center"],
            [4, 2, "Phí", "input", "text", "CancelFee", "form-control", "", { "placeholder": 0 }, [], "đ"],
            [4, 3, "Tổng", "input", "text", "ToTalCancelFee", "form-control", "", { "placeholder": 0, "readonly": true }, [], "đ"],
            [5, 1, "", "p", "", "", "", "Nếu hành khách có vé mở. Vui lòng nhập mã vé vào ô bên dưới", {}, [], "", [1, 3]],
            [6, 1, "Mã vé mở", "input", "text", "PassCode", "form-control", "", {}, [], "", [1, 2]],
            [7, 1, "", "button", "button", "Xác nhận", "btn btn-danger btn-confirm", "", {}, [], "<span class='glyphicon glyphicon-ok'></span>&nbsp;", [1, 3]],
            [7, 1, "", "button", "button", "Đóng", "btn btn-default  btn-close", "", [], [], "", [1, 3]]
        ],
        "form-horizontal"
    ],
    _fForm: [
        "FilterForm",
        [
            [1, 1, "", "select", "", "TripId", "form-control input-sm", "", {}, [], "<i class='glyphicon glyphicon-road'></i>", []],
            [1, 2, "", "input", "text", "DepartureDate", "form-control input-sm datepicker", "", {}, [], "<i class='glyphicon glyphicon-calendar'></i>", []],
            [1, 3, "", "select", "", "TimeSlot", "form-control input-sm", "", {}, [], "<i class='glyphicon glyphicon-time'></i>", []],
            [1, 4, "", "select", "", "Bus", "form-control input-sm", "", {}, [], "<i class='glyphicon glyphicon-th-list'></i>", []],
            [1, 5, "", "input", "", "Keyword", "form-control input-sm", "", { "placeholder": "Tìm số điện thoại..." }, [], "<i class='glyphicon glyphicon-phone'></i>", []],
            [1, 6, "", "button", "button", "<i class='glyphicon glyphicon-print'></i> In phơi", "btn btn-sm btn-primary btn-print", "", {}, [], "", []],
            [1, 7, "", "button", "button", "<i class='glyphicon glyphicon-refresh'></i> Làm mới", "btn btn-sm btn-success btn-print", "", {}, [], "", []]
        ],
        "col-md-10 col-xs-12 form-inline"
    ],
    _ofForm: [
        "VOFilterForm",
        [
            [1, 1, "", "select", "", "TripId", "form-control input-sm", "", {}, [], ""]
        ],
        "col-md-2 form-inline", "form-group"
    ],
    _vfForm: [
        "VVFilterForm",
        [
            [1, 1, "", "select", "", "TripId", "form-control input-sm", "", {}, [], ""]
        ],
        "col-md-2 form-inline", "form-group"
    ],
    _cfForm: [
        "VCFilterForm",
        [
            [1, 1, "", "select", "", "TripId", "form-control input-sm", "", {}, [], ""]
        ],
        "col-md-2 form-inline", "form-group"
    ],
    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: false,

    _frule: [
        [["UpdateForm", ["RoundTripCode", "FromArea", "ToArea"]], ["ValidForm", ["PassCode"]]],
        [
            [1, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]],
            [2, [["UpdateForm", ["KeepOnTime", "Fare", "Deposit", "Surcharge", "Discount", "PaymentType", "BranchName", "ChargeCode", "DriverName", "AgentName"]], ["ValidForm", ["PassCode"]]]],
            [3, [["UpdateForm", ["PhoneNumbers", "FullName", "PickupInfo", "TransferInfo", "Fare", "Deposit", "Surcharge", "Discount", "PaymentType", "Serial", "Note", "KeepOnTime", "BranchName", "ChargeCode", "DriverName"]], ["ValidForm", ["PassCode"]]]],
            [5, [["UpdateForm", ["KeepOnTime", "PaymentType", "Fare"]]]],
            [8, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]]
        ]
    ], //Multiple ticket, status of ticket, not same value
    _trule: [
        ["valid", "history"],
        [
            [1, ["valid"]],
            [2, ["valid"]],
            [3, ["valid"]],
            [5, ["valid"]]
        ]
    ], //Multiple ticket, status of ticket,
    _brule: [
        [],
        [
            //[1, [["UpdateForm", ["btn-eprint", "btn-add-more-ticket"]]]],
            [3, [["UpdateForm", ["btn-cancel", "btn-update", "btn-eprint", "btn-add-more-ticket", "btn-return", "btn-eprint-save"]]]]
        ]
    ], //Multiple ticket, status of ticket,
    _historyKeys: {
        "AgentInfo": { "vi": "VP/CN" },
        "TripDate": { "vi": "Chuyến" },
        "IssueDate": { "vi": "Ngày in vé" },
        "PickupDate": { "vi": "Giờ đón" },
        "Status": { "vi": "Trạng thái" },
        "Fare": { "vi": "Giá" },
        "CreatedUser": { "vi": "Người đặt" },
        "SeatCode": { "vi": "Mã ghế" },
        "CustomerInfo": { "vi": "Hành khách" },
        "PickupInfo": { "vi": "Đón" },
        "Serial": { "vi": "Số seri" },
        "PaymentInfo": { "vi": "Thanh toán" },
        "RoundTripCode": { "vi": "Mã khứ hồi" },
        "Note": { "vi": "Ghi chú" },
        "Surcharge": { "vi": "Phụ thu" },
        "Discount": { "vi": "Giảm giá" },
        "CancelFee": { "vi": "Phí hủy vé" },
        "FromArea": { "vi": "Nơi đi" },
        "ToArea": { "vi": "Nơi đến" },
        //"Deposit": { "vi": "Đặt cọc" },
        "Debt": { "vi": "Nợ" },
        "CancelType": { "vi": "Lý do" },
        "CancelInfo": { "vi": "Ghi chú" },
        "Code": { "vi": "Mã vé" },
        "IssuedUser": { "vi": "NV xuất vé" },
        "NumOfPrint": { "vi": "Số lần xuất vé" },
    },
    _stn: {
        1: { "vi": "Đặt chỗ" },
        2: { "vi": "Đã thanh toán" },
        3: { "vi": "Đã hủy" },
        4: { "vi": "HK không đến" },
        5: { "vi": "Không thu tiền" },
        6: { "vi": "Vé mở" },
        7: { "vi": "Vé mở" },
        8: { "vi": "Giữ chỗ đến giờ xe chạy" }
    },
    _pnp: {
        "10": ["090", "091", "092", "093", "094", "095", "096", "097", "098",
            "099", "070", "067", "083", "020", "022", "025", "026",
            "027", "029", "030", "031", "033", "036", "037", "038", "039",
            "052", "053", "054", "055", "056", "057", "058", "059", "060",
            "061", "062", "063", "064", "066", "067", "068", "070", "072",
            "073", "074", "075", "076", "077", "079"
        ],
        "11": [
            "0120", "0121", "0122", "0123", "0124", "0125", "0126", "0127", "0128", "0129",
            "0162", "0163", "0164", "0165", "0166", "0167", "0168", "0169",
            "0188", "0186", "0199",
            "0210", "0211", "0218", "0219", "0230", "0231", "0240", "0241", "0280",
            "0281", "0320", "0321", "0350", "0351", "0500", "0501", "0510",
            "0511", "0650", "0651", "0710", "0711", "0780", "0781"
        ],
    },
    _arrows: [37, 38, 39, 40],

    // phí hủy vé mặc định
    _cancelFeePercentDefault: 0,
    _cancelFeeMoneyDefault: 0,

    // cấu hình in nhanh hay không
    // in nhanh sẽ không style css được vì sẽ tự động đóng window in vé khi nhấn hủy
    // muốn inspect element phải chuyển sang false
    _hasQuickPrint: false,

    //hủy vé yêu cầu lý do
    _cancelReasonRequired: false,
    // lý do hủy vé
    // sửa lại view của hàm _createCancelDialogDiv trong file Bu/Co.Bks/Main
    _cancelType: [
        "Khác",
        "Nhà xe hủy",
        "Khách hàng hủy",
        "Đại lý hủy"
    ],

    // In danh sách
    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th>Số ghế</th><th>Tên HK</th><th>Code</th><th>Điểm đón</th><th>Số điện thoại</th><th>Trạng thái</th><th>N.Báo</th><th>Đại lý</th><th>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class='{seat._class}'><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._seri}</td><td>{seat._pText}</td><td>{seat._cphone}</td><td>{seat._status}</td><td>{seat._suser}</td><td>{seat._cuser}</td><td>{seat._note}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",

    /* Templates */
    _tplNumRow: 7,
    _tplNumCol: 3,
    // cấu hình sơ đồ ghế có số numcol đặc biệt
    // SeatTemplateId: num of col
    _specialNumColBySeatTemplateId: {
        //37: 4

    },
    _pStyleUrlDefault: "/Content/css/vbooking-print-default.css?v=1.0.1",
    _pStyleUrl: "/Content/css/vbooking-print.css?v=1.0.1",
    //_pStyleUrlDefault: "/bms/Content/css/vbooking-print-default.css?v=1.0.1",
    //_pStyleUrl: "/bms/Content/css/vbooking-print.css?v=1.0.1",
    _pSpecialPos: {},
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
        + "<tbody>"
        + "<tr style='height: 22px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported}'>{pseat._pmInfo}</p></td></tr>"
        + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
        + "</tbody>"
        + "</table></li>",

    //groupSeat: {
    //    groupFields: "phone->ticketCode",
    //    displayFields: "phone|4"
    //},

    _psTpl_SeatGroup:
        '<li class="print-seat col-md-4" style="overflow:hidden;">' +
	        '<table>' +
		        '<tbody>' +
		          '<tr style="height: 22px">' +
			        '<td style="width:20%"><p class="pseat-code">{data.seatCode}</p></td>' +
			        '<td style="font-size: small;width:80%;text-align:right"><p style="white-space: nowrap;overflow: hidden;"> {data.pInfo}</p></td>' +
		          '</tr>' +
		          '<tr>' +
			        '<td colspan="2" style="text-align: center;font-size: 20px;" class="{data._paid}">{data.phone}</td>' +
		          '</tr>' +
		          '<tr>' +
			        '<td style="font-size:small;" colspan=2><p style="white-space: nowrap;overflow: hidden;"> {data.note}</p></td>' +
		          '</tr>' +
		        '</tbody>' +
	        '</table>' +
        '</li>',

    //Print Stage Seat Template
    _pssTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
        + "<tbody>"
        + "<tr style='height: 20px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported}'>{pseat._pmInfo}</p></td></tr>"
        + "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}</p></td></tr>"
        + "<tr><td class='{pseat._hidden}'>Đ/TC:&nbsp;{pseat._pInfo}</td></tr>"
        + "</tbody>"
        + "</table></li>",
    _pTitleTpl: "<table class='print-title'>" +
                "<thead></thead>" +
                "<tbody>" +
                    "<tr>" +
                        "<td><strong class='title'>{p._title}</strong></td>" +
                        "<td colspan='2'><strong class='rname'>{p._rname}</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td>" +
                        "<td>Số xe:&nbsp{p._busNum}</td>" +
                        "<td>Tài xế:&nbsp;{p._driverName}</td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>",
    _pNoSeat: false,
    _pTplNumCoach: 0, //Default 0 is not custom set 
    _pTplNumCol: 0, //Default 0 is not custom set
    _specialPos: {},
    //_sTpl: "<li class='seat {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div><div class='note'>{seat._note}</div></div>"
    //    + "<div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span>{seat._pmInfo}</span></p><p class='phone'>{seat._cphone}</p></div></div></div></li>",
    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span>{seat._pmInfo}</span></p><p class='phone'>{seat._cphone}</p></div></div></div></li>",
    _lksTpl: "<li class='seat'><div class='lock'><div class='clearfix'><div class='seat-code'>{seat._label}</div></div>"
        + "</div></li>",
    //VECHANG
    _svcTpl: "<li class='seat {seat._notallow} seat-chang {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'>"
        + "<div class='chang'><span class='badge so-chang'>{seat._numStagetickets}</span><div class='chang-di'><ul>{seat._stageticketsTooltips}</ul></div></div>"
        + "<div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'><span>{seat._pInfo}</span><span><a href='#' title='{seat._seatStatusTooltips}'></a></span></div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span>{seat._pmInfo}</span></p><p class='phone'>{seat._cphone}</p></div></div></div></li>",
    _lksvcTpl: "<li class='seat {seat._notallow}'><div class='lock'>"
        //+ "<div class='chang'><span class='badge so-chang'>3</span><div class='chang-di' style='display: block;'><ul><li><a href='#'>SG - Phan Thiết</a><p class='nhieu-chang-ng-dat'><small>Bình Ngô 096666777</small></p></li></ul></div></div>"
        + "<div class='chang'><span class='badge so-chang'>{seat._numStagetickets}</span><div class='chang-di'><ul>{seat._stageticketsTooltips}</ul></div></div>"
        + "<div class='clearfix'><div class='seat-code'>{seat._label}</div></div></div></li>",
    _vTpl: "<li class='ext-seat'><div class='voseat'><div class='vocode'>{ticket._code}</div><div class='vinfo'><p class='timeValid'>{ticket._fValid} → {ticket._tValid}</p><p>{ticket._cname}</p><p>{ticket._cphone}</p></div></div></li>",
    _oTpl: "<li class='ext-seat'><div class='voseat'><div class='vocode'>{ticket._code}</div><div class='vinfo'><p class='timeValid'>{ticket._fOpen}</p><p>{ticket._cname}</p><p>{ticket._cphone}</p></div></div></li>",
    _cTpl: "<li class='ext-seat'><div class='voseat vcseat'><div class='vocode'>{ticket._code}</div><div class='vinfo'><p class='timeValid'>{ticket._cDate}</p><p>{ticket._cname}</p><p>{ticket._cphone}</p></div></div></li>",

    // trip._vehicleName: Loại xe
    // trip._vehicleNumber: Biển số xe
    // trip._driverName: Tài xế
    // trip._assistantName: Phụ xe
    // trip._guideName: Hướng dẫn viên
    // trip._note: Ghi chú
    _tInfoTpl: "<div class='bs-callout bs-callout-primary bg-danger clearfix'>" +
        "<div class='col-md-6 col-sm-6 col-xs-12 pl0 pr0'>" +
            "Loại xe:&nbsp;{trip._vehicleName}&nbsp;-&nbsp;Số xe:&nbsp;{trip._vehicleNumber}&nbsp;-&nbsp;Tài:&nbsp;{trip._driverName}&nbsp;-&nbsp;Phụ xe:&nbsp;{trip._assistantName}&nbsp;-&nbsp;<br/><strong class='vred'>Chú ý:&nbsp;{trip._note}</strong>" +
        "</div>" +
        "<div class='col-md-6 col-sm-6 col-xs-12 text-right-md text-right-sm pl0 pr0'>Tổng số vé đã đặt:&nbsp;{trip._total}.&nbsp;Số ghế trống:&nbsp;{trip._numAvail}<br/>Thanh toán:&nbsp;{trip._numPaid}{trip._numPaidPerType}, Đặt chỗ:&nbsp;{trip._numBooking}{trip._numBookingPerAgent}</div></div>",
    _tInfoClosedTpl: "<div class='bs-callout bs-callout-primary bg-danger clearfix'>" +
        "<div class='col-md-6 col-sm-6 col-xs-12 pl0 pr0'>" +
        "Loại xe:&nbsp;{trip._vehicleName}&nbsp;-&nbsp;Số xe:&nbsp;{trip._vehicleNumber}&nbsp;-&nbsp;Tài:&nbsp;{trip._driverName}&nbsp;-&nbsp;Phụ xe:&nbsp;{trip._assistantName}{trip._note}" +
        "<div><img src='http://nhaxe.vexere.com/Content/images/da-xuat-ben.png' style='position:absolute;z-index:10;right:-100px;top:-12px;'/></div>" +
        "</div>" +
        "<div class='col-md-6 col-sm-6 col-xs-12 text-right-md text-right-sm pl0 pr0'>Tổng số vé đã đặt:&nbsp;{trip._total}.&nbsp;Số ghế trống:&nbsp;{trip._numAvail}<br/>Thanh toán:&nbsp;{trip._numPaid}{trip._numPaidPerType}, Đặt chỗ:&nbsp;{trip._numBooking}{trip._numBookingPerAgent}</div></div>",
    _tInfoChotPhoiTpl: "<div class='bs-callout bs-callout-primary bg-danger clearfix'>" +
        "<div class='col-md-6 col-sm-6 col-xs-12 pl0 pr0'>" +
        "Loại xe:&nbsp;{trip._vehicleName}&nbsp;-&nbsp;Số xe:&nbsp;{trip._vehicleNumber}&nbsp;-&nbsp;Tài:&nbsp;{trip._driverName}&nbsp;-&nbsp;Phụ xe:&nbsp;{trip._assistantName}{trip._note}" +
        "<div><img src='http://nhaxe.vexere.com/Content/images/da-chot-phoi.png' style='position:absolute;z-index:10;right:-100px;top:-12px;'/></div>" +
        "</div>" +
        "<div class='col-md-6 col-sm-6 col-xs-12 text-right-md text-right-sm pl0 pr0'>Tổng số vé đã đặt:&nbsp;{trip._total}.&nbsp;Số ghế trống:&nbsp;{trip._numAvail}<br/>Thanh toán:&nbsp;{trip._numPaid}{trip._numPaidPerType}, Đặt chỗ:&nbsp;{trip._numBooking}{trip._numBookingPerAgent}</div></div>",

    _locationItemTpl: "<tr data-index='{pLoc._index}' data-name='{pLoc._name}' data-time='{pLoc._time}' data-order='{pLoc._order}' data-address='{pLoc._address}' data-nearby='{pLoc._nearby}' data-locationId='{pLoc._locationId}'><td>{pLoc._name}</td><td>{pLoc._time}</td></tr>",
    _locationHeaderTpl: "<div class='dropdown-menu search-result search-location'><div class='search-title'>Điểm đón tìm được</div>",
    _locationFooterTpl: "<div class='search-summary'>Tổng số {locCount} điểm</div></div>",


    /* BKS as list */
    _lTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Chặng</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='10'><button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table>",
    _cancelListTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody></table>",
    _ilTpl: "<tr class='lseat' data-position='{seat._coach}_{seat._row}_{seat._col}' data-issue='{seat._issue}'><td class='hidden-xs text-center index'>{seat._index}</td><td>{seat._label}</td><td>{seat._cname}&nbsp;<span class='numT'>{seat._nTicketPerTrip}</span></td><td>{seat._cphone}</td><td>{seat._stageName}</td><td class='hidden-xs'>{seat._idate}<br/>{seat._suser}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td>{seat._status}<br/>{seat._cuser}<br/>{seat._pmFullInfo}</td><td class='hidden-xs'>{seat._pInfo}</td><td class='hidden-xs'>{seat._note}</td><td class='hidden-xs text-center'>{seat._buttons}</td></tr>",
    /* VE CHANG*/
    // có in danh sách vé chặng không?
    //_pStageTicket: false,
    //_pvcTpl: "<div><div class='list plist'><h4>DANH SÁCH VÉ CHẶNG</h4></div><div class='list'><table class='table table-bordered' width='100%'><thead><tr class='bg-primary'><th class=''>STT</th><th>Chặng đường</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody></table></div></div>",
    _pvcTpl: "<div><div class='list plist' style='padding:5px 0 5px 0;clear:both;'><h4>DANH SÁCH VÉ CHẶNG</h4></div><div class='list'><table class='table table-bordered' width='100%'><thead><tr class='bg-primary'><th class=''>STT</th><th>Tên HK</th><th>Số điện thoại</th><th>Mã ghế</th><th>Tổng tiền</th><th>Nhân viên</th><th>Chặng đường</th><th>Đón/TC</th><th>Ghi chú</th></tr></thead><tbody></tbody></table></div></div>",
    //pvcTpl:"<div><div class='list plist'><h4>DANH SÁCH VÉ CHẶNG</h4></div><table class='table table-bordered' width='100%'><thead><tr class='bg-primary'><th class='col-md-1'>STT</th><th>Chặng đường</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody><tr class='' data-ids='14931' data-pdate='2014-11-26T21:00:00.000' data-seatinfos='A1|1|1|5' data-ptext='ND Quang truong'><td class='col-md-1'>1</td><td>ND Quang truong</td><td>A1</td><td></td><td>0919707447</td><td><strong>140.000đ</strong></td><td>Đặt chỗ</td><td></td></tr><tr class='' data-ids='14455' data-pdate='2014-11-26T21:00:00.000' data-seatinfos='A9|1|3|1' data-ptext='sa ra'><td class='col-md-1'>2</td><td>sa ra</td><td>A9</td><td></td><td>01662196056</td><td><strong>140.000đ</strong></td><td>Đặt chỗ</td><td></td></tr></tbody></table></div>",
    //_pvcRTpl: "<tr><td class=''>{_stt}</td><td>{_stageName}</td><td>{seatLabel}</td><td>{_cname}</td><td>{_cphone}</td><td><strong>{_fare}</strong></td><td>{_statusLabel}</td><td>{_note}</td></tr>",
    _pvcRTpl: "<tr><td class=''>{_stt}</td><td>{_cname}</td><td>{_cphone}</td><td>{seatLabel}</td><td>{_fare}</td><td><span class='{_hasPaid}'>{_user}</span></td><td>{_stageName}</td><td>{_pInfo}</td><td>{_note}</td></tr>",
    /* Pick up */
    _pPickupTitleTpl: "<table class='print-title'>" +
                "<thead></thead>" +
                "<tbody>" +
                    "<tr>" +
                        "<td><strong class='title'>{p._title}</strong></td>" +
                        "<td colspan='2'><strong class='rname'>{p._rname}</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td>" +
                        "<td>Số xe:&nbsp{p._busNum}</td>" +
                        "<td>Tài xế:&nbsp;{p._driverName}</td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>",
    _puTpl: "<div class='plist'><h4>DANH SÁCH ĐÓN DỌC ĐƯỜNG&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='8'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _ipuTpl: "<tr class='{seat._class}' data-code='{seat._code}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-pText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm pIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ppuTpl: "<div class='list plist'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='2' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td>{t._totalSeat}</td><td colspan='2'></td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _ippuTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",

    _hasPickUpOnPrintBKS: true,
    _pointType: ['Chọn kiểu', 'Châu lục', 'Quốc gia', 'Tỉnh', 'Thành phố', 'Quận', 'Huyện', 'Đảo', 'Phường', 'Xã', 'Thị trấn', 'Tổ', 'Ấp', 'Thôn', 'Số nhà', 'Điểm dừng chung', 'Điểm dừng riêng'],

    /* Tranfer */
    _hasMergeTranfer: false,
    _pTransferTitleTpl: "<table class='print-title'>" +
                "<thead></thead>" +
                "<tbody>" +
                    "<tr>" +
                        "<td><strong class='title'>{p._title}</strong></td>" +
                        "<td colspan='2'><strong class='rname'>{p._rname}</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td>" +
                        "<td>Số xe:&nbsp{p._busNum}</td>" +
                        "<td>Tài xế:&nbsp;{p._driverName}</td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>",
    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Tài</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Số ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='7' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._driverName}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._numSeat}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    _ptsfTpl: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Tài</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='7' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Tài</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='7' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",

    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._time}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._numSeat}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",

    /* Eticket */
    _multiSeatOnTicket: true,
    _eTicket: {
        "sm": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 text-center'><img class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/tienoanh.jpg' alt=''/></div>"
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
            + "<p>{ticket._note}</p>"
            + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p><p>Vé mua rồi miễn trả. Quý khách vui lòng có mặt trước giờ khởi hành 15 phút. </p></div><div class='col-xs-9 text-center' style='margin-top:5px;'><img class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div>",

        "lg": "<div style='width:330px; margin: 0 auto; padding-left: 20px;'><div class='col-xs-12 text-center'><img class='img-responsive' src=http://nhaxe.vexere.com/Images/eticket/tienoanh.jpg' alt=''/></div>"
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
            + "<p>Đón: {ticket._pick}</p><p>Nhân viên: {ticket._user}</p><p>Vé mua rồi miễn trả. Quý khách vui lòng có mặt trước giờ khởi hành 15 phút. </p></div><div class='col-xs-9 text-center' style='margin-top:5px;'><img class='img-responsive' src='http://nhaxe.vexere.com/Images/eticket/vxr-ve.jpg' alt=''/></div></div></div>",
    },
    _eStyleUrl: "/Base/bootstrap-3.2.0/css/bootstrap.min.css",
    _pBreak: "<br />",

    /* Multiticket */
    _multiBarTpl: "<div class='chang-bottom'><nav class='navbar navbar-inverse navbar-fixed-bottom ghe-chang' role='navigation'></nav><a href='#' class='chang-di-close'><i class='glyphicon glyphicon-remove'></i> Đóng</a><div class='them-chang'><a href='#' class='btn-them-chang'><i class='glyphicon glyphicon-plus'></i></a></div></div>",
    _msTpl: "<li class='seat m-seat col-md-2 col-sm-4 col-xs-12' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='s-route-info'><small><i class='glyphicon glyphicon-record'></i></small>&nbsp;{seat._fromAreaCode}<br><small><i class='glyphicon glyphicon-map-marker'></i></small>&nbsp;{seat._toAreaCode}</div><div class='pick'>{seat._pInfo}</div><div class='note'>{seat._note}</div></div>"
        + "<div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span>{seat._pmInfo}</span></p><p class='phone'>{seat._cphone}</p></div></div></div></li>",

    //Ticket
    _isFBooking: ["_cphone|_note"],

    // có hỗ trợ group theo mã code hay không
    _allowGroupByCode: false,

    //Book ticket warning
    _hasBTWarning: true,
    _wTpl: '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>Lưu ý: hành khách <strong>{m._cname} - <span class="vred">{m._cphone}</span></strong>{m._content}</div>',
    _btwarningTpl: "<li>{t._sText} - <strong><span class='vred'>{t._numS}</span></strong> vé <strong><span class='vred'>{t._sCodes}</span></strong> / {t._total} / {t._tname} / <strong><span class='vred'>{t._time}</span></strong> ngày <strong><span class='vred'>{t._date}</span></strong></li>",

    //Limited date: quyền 12|10065|1 được phép đặt vé trong quá khứ
    _limitedDateBefore: 1,
    _limitedMinuteBefore: 1440, // giới hạn thời gian là 1 ngày sẽ không được đặt vé trong quá khứ

    // block BKS theo giờ: sau một khoảng thời gian sẽ không được chọn giờ
    //_hasBlockBKSByTime: true,
    //_dayBlockBKS: 3, // tính theo ngày
    //_hourBlockBKS: 3, // tính theo giờ
    //_minuteBlockBKS: 20, // tính theo phút và phải nhỏ hơn 60

    // block văn phòng, chi nhánh không được phép bán vé một số tuyến đường
    //_hasBlockTripByBranch: true,
    //_blockTripByBranch: { // Id chi nhánh: các Id tuyến đường cần block
    // 85: [1116, 1826],
    //82: [1115]
    //},

    // Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["PhoneNumbers", "Code"],
    // Vé khứ hồi: copy các thông tin sau
    _returnField: ["FullName", "PhoneNumbers"],
    _returnFieldRequired: ["PhoneNumbers"],

    //Status bar
    _sBar: '<div class="status-bar"><h6><span class="latest-act">Xem lịch sử thao tác</span><a class="btn-log slideout-menu-toggle" href="#"><i class="glyphicon glyphicon-align-justify"></i></a></h6></div>',
    _hLog: '<div class="list-log slideout-menu"><div class="log-content"><table class="table table-hover table-striped"><tbody></tbody></table></div><div class="form-group has-feedback search-log"><label class="control-label" for="hsearch">&nbsp;</label><input type="text" class="form-control input-sm" placeholder="Tìm" id="hsearch"><span class="glyphicon glyphicon-search form-control-feedback"></span> </div></div>',
    _hAct: { 'book': { 'vi': 'Đặt vé' }, 'update': { 'vi': 'Cập nhật vé' }, 'move': { 'vi': 'Đổi vé' }, 'cancel': { 'vi': 'Hủy vé' }, 'print-ticket': { 'vi': 'In vé' } },
    _lhTpl: "<span type='{h._type}' tid='{h._tid}' tdate='{h._tdate}' ttime='{h._ttime}' slabel='{h._s}'>{h._a}&nbsp;<strong class='vred'>{h._s}</strong>&nbsp;({h._tname}&nbsp;-&nbsp;{h._tdate}&nbsp;{h._ttime})&nbsp;lúc&nbsp;<strong>{h._t}&nbsp;ngày&nbsp;{h._d}</strong></span>",
    _mlhTpl: "<span tid='{h._ttid}' tdate='{h._ttdate}' ttime='{h._tttime}' slabel='{h._ts}'>{h._a}&nbsp;<strong class='vred'>{h._fs}&#8594;{h._ts}</strong>&nbsp;({h._ttname}&nbsp;-&nbsp;<strong>{h._ftdate}&nbsp;{h._fttime}&#8594;{h._ttdate}&nbsp;{h._tttime}</strong>)&nbsp;lúc&nbsp;<strong>{h._t}&nbsp;ngày&nbsp;{h._d}</strong></span>",
    _ihTpl: "<tr type='{h._type}' tid='{h._tid}' tdate='{h._tdate}' ttime='{h._ttime}' slabel='{h._s}'><td><h5><a href=''>{h._a}&nbsp;{h._s}<br/><small>{h._tname}&nbsp;chuyến&nbsp;{h._tdate} {h._ttime}</small><br/><small>Lúc {h._t} ngày {h._d}</small></a></h5></td></tr>",
    _mihTpl: "<tr tid='{h._ttid}' tdate='{h._ttdate}' ttime='{h._tttime}' slabel='{h._ts}'><td><h5><a href=''>{h._a}&nbsp;{h._fs}&#8594;{h._ts}<br/><small>{h._ftname}&nbsp;chuyến&nbsp;{h._ftdate} {h._fttime} &#8594; {h._ttdate} {h._tttime}</small><br/><small>Lúc {h._t} ngày {h._d}</small></a></h5></td></tr>",
    _hckKey: "Bl4rxRnk8x",
    _hlL: 100,
    _ckExp: 365,
    _stageTicketshowMButton: false,
    _stageTicketLable: 'VC',
    _fullStageTicketLable: 'VTC',

    //notification
    _hasNotification: false,
    _nBar: '<div class="notice-bar"><h6><span class="notice"></span></h6></div>',

    // Trip Info
    _pSummaryTripInfo: false,
    _pSummaryTripInfoPageBreak: false, // có qua trang hay không
    _tripInfo: "",

    // Pickup Info
    _pSummaryPickupInfo: false,
    _pSummaryPickupInfoPageBreak: false, // có qua trang hay không
    _sumPickupInfo: "",

    // Print Special Note
    _pSNote: false,
    // vị trí tầng được áp dụng in ghi chú đặc biệt
    _pSNoteCoachEffective: {
        //44: 1
    },
    _pSNoteInfo: {
        //44: {
        //    1: "<div style='position:relative;clear:both;'>" +
        //            "<table cellpadding='0' cellspacing='0' border='0' width='100%' style='position:absolute;margin-top:10px;'>" +
        //                "<tr>" +
        //                    "<td style='line-height:30px;'>...........................................................................................................................</td>" +
        //                "</tr>" +
        //                "<tr>" +
        //                    "<td style='line-height:30px;'>...........................................................................................................................</td>" +
        //                "</tr>" +
        //                "<tr>" +
        //                    "<td>" +
        //                        "<table cellpadding='0' cellspacing='0' border='0' width='100%'>" +
        //                            "<thead>" +
        //                                "<tr>" +
        //                                    "<th>NV tổng đài</th>" +
        //                                    "<th>NV OCC</th>" +
        //                                    "<th>Lái xe 1</th>" +
        //                                    "<th>Trưởng bến</th>" +
        //                                "</tr>" +
        //                            "</thead>" +
        //                            "<tbody>" +
        //                                "<tr>" +
        //                                "<td></td>" +
        //                                "<td></td>" +
        //                                "<td></td>" +
        //                                "<td></td>" +
        //                            "</tr>" +
        //                            "</tbody>" +
        //                        "</table>" +
        //                    "</td>" +
        //                "</tr>" +
        //            "</table>" +
        //        "</div>",
        //    2: "",
        //},
        //46: {
        //    1: "<div style='position:relative;clear:both;'>" +
        //            "<table cellpadding='0' cellspacing='0' border='0' style='position:absolute;margin-top:10px;'>" +
        //                "<tr>" +
        //                    "<td style='line-height:30px;'>.............................................................................................................................</td>" +
        //                "</tr>" +
        //                "<tr>" +
        //                    "<td style='line-height:30px;'>.............................................................................................................................</td>" +
        //                "</tr>" +
        //                "<tr>" +
        //                    "<td style='line-height:30px;'>.............................................................................................................................</td>" +
        //                "</tr>" +
        //            "</table>" +
        //        "</div>",
        //    2: "<div style='position:relative;clear:both;'>" +
        //            "<table cellpadding='0' cellspacing='0' border='0' width='100%' style='position:absolute;margin-top:10px;'>" +
        //                "<thead>" +
        //                    "<tr>" +
        //                        "<th>NV tổng đài</th>" +
        //                        "<th>NV OCC</th>" +
        //                        "<th>Lái xe 1</th>" +
        //                        "<th>Trưởng bến</th>" +
        //                    "</tr>" +
        //                "</thead>" +
        //                "<tbody>" +
        //                    "<tr>" +
        //                        "<td></td>" +
        //                        "<td></td>" +
        //                        "<td></td>" +
        //                        "<td></td>" +
        //                    "</tr>" +
        //                "</tbody>" +
        //            "</table>" +
        //        "</div>"
        //}
    },


    // thống kê chuyến
    _tienKhachTitle: "<table class='table table-bordered table-striped list-ticket thong-ke tien-khach'><thead><tr class='bg-primary'><th>Văn phòng</th><th>Số lượng</th><th>Tổng tiền</th></tr></thead><tbody></tbody></table>",
    _tienKhachInput: "<tr><td>{_branchCode}</td><td>{_numTic}</td><td>{_totalFare}</td></tr>",

    _tienHangTitle: "<table class='table table-bordered table-striped list-ticket thong-ke tien-hang'><thead><tr class='bg-primary'><th style='width:94px;'>Văn phòng</th><th colspan='2'>Đã TT <span class='fr'>(SL)</span></th><th colspan='2'>Chưa TT <span class='fr'>(SL)</span></th><th style='width:140x;'>Tổng tiền</th></tr></thead><tbody></tbody></table>",
    _tienHangInput: "<tr class='branch-pro'>" +
        "<td style='line-height:30px;' name='BranchCode' data-branch-code='{_branchCode}'>{_branchCode}</td>" +
        '<td><div class="input-group col-md-12"><input name="BranchPaid" type="text" placeholder="Đã TT" class="form-control input-bd0 input-sm" value="{_moneyBranchProPaid}"><div class="input-group-addon">đ</div></div></td>' +
        '<td style="width:60px;"><input name="NumBranchPaid" type="text" placeholder="SL" class="form-control input-bd0 input-sm" value="{_numBranchProPaid}"></td>' +
        "<td><div class='input-group col-md-12'><input name='BranchNotPaid' type='text' placeholder='Chưa TT' class='form-control input-bd0 input-sm' value='{_moneyBranchProNotPaid}'><div class='input-group-addon'>đ</div></div></td>" +
        '<td style="width:60px;"><input name="NumBranchNotPaid" type="text" placeholder="SL" class="form-control input-bd0 input-sm" value="{_numBranchProNotPaid}"></td>' +
        '<td name="TotalFareBranch" style="line-height:30px;">{_totalMoneyBranchFormat} đ</td>' +
        "</tr>",

    // block ghế theo biển số xe
    //_blockSeatByVehicle: ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    //_unblockSeatByVehicle: 
    //    {
    //        "29B-018.48": ["1|6|1", "1|6|5"],
    //        "29B-085.84": ["1|6|1", "1|6|3", "1|6|5", "2|6|1", "2|6|3", "2|6|5"],
    //        "29B-019.87": ["2|6|1", "2|6|3", "2|6|5"]
    //    }
    //,

    //Available seat on
    _availableSeatOn: true,

    //payment, agent, phone, note, pickup, transfer, fare
    // value1&value2: value1 va value2 phai dc nhap
    // value1[abc]&value2: value1 va value2 phai dc nhap, value1 phai co gia tri abc
    // đối với giá vé: giá trị nhỏ nhất là 0
    // fare[>=600000]: giá vé phải lớn hơn hoặc bằng 600000
    // fare[<=400000]: giá vé phải nhỏ hơn hoặc bằng 400000, có thể bằng 0
    // fare[=300000]: giá vé phải bằng 300000
    // fare[>0]: giá vé phải lớn hơn 0
    // fare[<500000]: giá vé phải nhỏ hơn 500000, có thể bằng 0
    //!payment->fare[>0]: nếu có payment thì fare phải lớn hơn 0 
    //_updateFormValidatingErrorMessage: thông báo khi cập nhật sai
    //_updateFormValidatingErrorMessages: thông báo khi cập nhật sai cho từng field cụ thể, nếu không có thì dùng thông báo chung
    //_updateFormValidatingConditions: ["!payment->fare[>0]", "phone&!payment->fare[>0]", "note&!payment->fare[>0]"],
    _updateFormValidatingConditions: ["phone", "note", "!payment->fare[>0]"],
    _updateFormValidatingErrorMessage: "Thông tin cập nhật chưa đúng, vui lòng kiểm tra lại.",
    _updateFormValidatingErrorMessages: {
        "phone": "Số điện thoại không chính xác, vui lòng kiểm tra lại.",
        "fare": "Giá vé phải lớn hơn 0.",
    },

    // only validate fare
    _reqFieldUpdateForm: ["PhoneNumbers"],
    _validUpdateForm: ">0",

    // gộp danh sách trung chuyển
    //_hasMergeTransfer: { 770: true }, // tuyến đường áp dụng gộp trung chuyển
    //_hasTransferTimeConf: ["00:00-12:59", "13:00-23:59"], // các khoảng thời gian cần gộp

    // in trung chuyển trên phơi
    // nếu có sẽ hiển thị trên phơi theo dữ liệu của biến _disTransferOnPST
    // nếu _disTransferOnPST là default thì sẽ lấy dữ liệu do người dùng nhập vào để hiển thị lên
    _hasTransferOnPST: false,
    _disTransferOnPST: "default",

    // show tai 
    _hasDriverTrip: false,

    _limitedMinuteBeforeRole: 7200,

    // Move vé khác tuyến
    _hasMoveSeatToOtherTrip: false,

    // auto send sms when update ticket
    _autoSendSmsUpdate: false,
    // update sms template
    _smsUpdateTpl: "Dat ve thanh cong: {_tripName}, chuyen {_tripDate}, {_nOfSeat} ghe {_seatCodes} - {_status}",
    // auto send sms when update ticket
    _autoSendSmsCancel: false,
    // update sms template
    _smsCancelTpl: "Da huy ve: {_tripName}, chuyen {_tripDate}, {_nOfSeat} ghe {_seatCodes}",

    // Auto Cancel Ticket
    _autoCancelTickets: false,
    _cancelledTime: '16:00',
    _bookedTicketStatus: 1,
    //eslapsedTime tinh bang phut
    _eslapsedTime: {
        1: -1,
        2: -60,
        3: -1440,
        4: -2880,
        5: -4320,
    },

    // cho phép search vé trước bao nhiêu phút
    // ví dụ: -1440 là cho phép tìm vé quá khứ trước 1 ngày so với giờ hiện tại
    _allowSearchBefore: 0,

    // in vé một lần
    _printETicketOnlyOne: false,

    // baseId
    _fromToBaseId: [39, 45, 72],
};

var _bkDict = $.extend({}, _dict);

//var phoiTemplate = '';
var phoiTemplate =
'<div class="paper">' +
    '<div class="subpage">'
        + '<div class="page" style="width: 650px; height: 950px; position: absolute; text-align: left;"><div class="group" style="width: 650px; height: 45.2380952380952px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="routeName textLabel font-extraLarge" style="width: 433.333333333333px; height: 22.6190476190476px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{phoi.routeName}</div><div class="time textLabel font-medium" style="width: 433.333333333333px; height: 22.6190476190476px; position: absolute; top: 22.6190476190476px; left: 0px; text-align: left; color: rgb(0, 0, 0); font-style: italic; background: transparent;">{phoi.time}</div><div class="busNumber textLabel font-medium" style="width: 216.666666666667px; height: 22.6190476190476px; position: absolute; top: 0px; left: 433.333333333333px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{phoi.busNumber}</div><div class="driverName textLabel font-medium" style="width: 216.666666666667px; height: 22.6190476190476px; position: absolute; top: 22.6190476190476px; left: 433.333333333333px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{phoi.driverName}</div></div><div class="group" style="width: 185.714285714286px; height: 542.857142857143px; position: absolute; top: 45.2380952380952px; left: 0px; text-align: left;"><div class="{seats.seat_1_1_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_1_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_1_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_1.tickectCount}</div></div><div class="{seats.seat_1_1_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_1_1.groupPhone}</div></div><div class="{seats.seat_1_2_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_2_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_2_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_1.tickectCount}</div></div><div class="{seats.seat_1_2_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_2_1.groupPhone}</div></div><div class="{seats.seat_1_3_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_3_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_3_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_1.tickectCount}</div></div><div class="{seats.seat_1_3_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_3_1.groupPhone}</div></div><div class="{seats.seat_1_4_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_4_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_4_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_1.tickectCount}</div></div><div class="{seats.seat_1_4_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_4_1.groupPhone}</div></div><div class="{seats.seat_1_5_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_5_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_5_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_1.tickectCount}</div></div><div class="{seats.seat_1_5_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_5_1.groupPhone}</div></div><div class="{seats.seat_2_1_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_1_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_1_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_1.tickectCount}</div></div><div class="{seats.seat_2_1_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_1_1.groupPhone}</div></div><div class="{seats.seat_2_2_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_2_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_2_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_1.tickectCount}</div></div><div class="{seats.seat_2_2_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_2_1.groupPhone}</div></div><div class="{seats.seat_2_3_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_3_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_3_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_1.tickectCount}</div></div><div class="{seats.seat_2_3_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_3_1.groupPhone}</div></div><div class="{seats.seat_2_4_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_4_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_4_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_1.tickectCount}</div></div><div class="{seats.seat_2_4_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_4_1.groupPhone}</div></div><div class="{seats.seat_2_5_1.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_5_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_5_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_1.tickectCount}</div></div><div class="{seats.seat_2_5_1.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_5_1.groupPhone}</div></div></div><div class="group" style="width: 30.952380952381px; height: 542.857142857143px; position: absolute; top: 45.2380952380952px; left: 402.380952380952px; text-align: left;"></div><div class="group" style="width: 30.952380952381px; height: 542.857142857143px; position: absolute; top: 45.2380952380952px; left: 185.714285714286px; text-align: left;"></div><div class="group" style="width: 185.714285714286px; height: 542.857142857143px; position: absolute; top: 45.2380952380952px; left: 216.666666666667px; text-align: left;"><div class="{seats.seat_1_1_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_1_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_1_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_3.tickectCount}</div></div><div class="{seats.seat_1_1_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_1_3.groupPhone}</div></div><div class="{seats.seat_1_2_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_2_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_2_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_3.tickectCount}</div></div><div class="{seats.seat_1_2_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_2_3.groupPhone}</div></div><div class="{seats.seat_1_3_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_3_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_3_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_3.tickectCount}</div></div><div class="{seats.seat_1_3_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_3_3.groupPhone}</div></div><div class="{seats.seat_1_4_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_4_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_4_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_3.tickectCount}</div></div><div class="{seats.seat_1_4_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_4_3.groupPhone}</div></div><div class="{seats.seat_1_5_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_5_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_5_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_3.tickectCount}</div></div><div class="{seats.seat_1_5_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_5_3.groupPhone}</div></div><div class="{seats.seat_2_1_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_1_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_1_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_3.tickectCount}</div></div><div class="{seats.seat_2_1_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_1_3.groupPhone}</div></div><div class="{seats.seat_2_2_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_2_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_2_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_3.tickectCount}</div></div><div class="{seats.seat_2_2_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_2_3.groupPhone}</div></div><div class="{seats.seat_2_3_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_3_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_3_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_3.tickectCount}</div></div><div class="{seats.seat_2_3_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_3_3.groupPhone}</div></div><div class="{seats.seat_2_4_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_4_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_4_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_3.tickectCount}</div></div><div class="{seats.seat_2_4_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_4_3.groupPhone}</div></div><div class="{seats.seat_2_5_3.seatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 92.8571428571429px; text-align: left;"><div class="label textLabel font-medium" style="width: 18.5714285714286px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_5_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 74.2857142857143px; height: 27.1428571428571px; position: absolute; top: 0px; left: 18.5714285714286px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_5_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 55.7142857142857px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 92.8571428571429px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 37.1428571428571px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 55.7142857142857px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_3.tickectCount}</div></div><div class="{seats.seat_2_5_3.groupSeatDisplay} seatType" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 92.8571428571429px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 92.8571428571429px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_5_3.groupPhone}</div></div></div><div class="group" style="width: 216.666666666667px; height: 542.857142857143px; position: absolute; top: 45.2380952380952px; left: 433.333333333333px; text-align: left;"><div class="{seats.seat_1_1_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_1_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_1_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_1_5.tickectCount}</div></div><div class="{seats.seat_1_1_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_1_5.groupPhone}</div></div><div class="{seats.seat_2_1_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 108.333333333333px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_1_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_1_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_1_5.tickectCount}</div></div><div class="{seats.seat_2_1_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 108.333333333333px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_1_5.groupPhone}</div></div><div class="{seats.seat_1_2_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_2_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_2_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_2_5.tickectCount}</div></div><div class="{seats.seat_1_2_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_2_5.groupPhone}</div></div><div class="{seats.seat_2_2_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 108.333333333333px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_2_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_2_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_2_5.tickectCount}</div></div><div class="{seats.seat_2_2_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 108.571428571429px; left: 108.333333333333px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_2_5.groupPhone}</div></div><div class="{seats.seat_2_3_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 108.333333333333px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_3_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_3_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_3_5.tickectCount}</div></div><div class="{seats.seat_2_3_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 108.333333333333px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_3_5.groupPhone}</div></div><div class="{seats.seat_2_4_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 108.333333333333px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_4_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_4_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_4_5.tickectCount}</div></div><div class="{seats.seat_2_4_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 108.333333333333px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_4_5.groupPhone}</div></div><div class="{seats.seat_2_5_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 108.333333333333px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_5_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_5_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_5_5.tickectCount}</div></div><div class="{seats.seat_2_5_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 108.333333333333px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_5_5.groupPhone}</div></div><div class="{seats.seat_1_3_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_3_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_3_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_3_5.tickectCount}</div></div><div class="{seats.seat_1_3_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 217.142857142857px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_3_5.groupPhone}</div></div><div class="{seats.seat_1_4_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_4_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_4_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_4_5.tickectCount}</div></div><div class="{seats.seat_1_4_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 325.714285714286px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_4_5.groupPhone}</div></div><div class="{seats.seat_1_5_5.seatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 21.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_5_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 86.6666666666667px; height: 27.1428571428571px; position: absolute; top: 0px; left: 21.6666666666667px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_5_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 65px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 54.2857142857143px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 108.333333333333px; height: 27.1428571428571px; position: absolute; top: 81.4285714285714px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 43.3333333333333px; height: 27.1428571428571px; position: absolute; top: 27.1428571428571px; left: 65px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_5_5.tickectCount}</div></div><div class="{seats.seat_1_5_5.groupSeatDisplay} seatType" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 434.285714285714px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 108.333333333333px; height: 108.571428571429px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_5_5.groupPhone}</div></div></div><div class="group" style="width: 650px; height: 361.904761904762px; position: absolute; top: 588.095238095238px; left: 0px; text-align: left;"><div class="{seats.seat_1_6_1.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_6_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_1.tickectCount}</div></div><div class="{seats.seat_1_6_1.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_1.groupPhone}</div></div><div class="{seats.seat_1_6_2.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 130px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_6_2.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_2.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_2.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_2.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_2.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_2.tickectCount}</div></div><div class="{seats.seat_1_6_2.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 130px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_2.groupPhone}</div></div><div class="{seats.seat_1_6_3.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 260px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_6_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_3.tickectCount}</div></div><div class="{seats.seat_1_6_3.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 260px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_3.groupPhone}</div></div><div class="{seats.seat_1_6_4.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 390px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_6_4.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_4.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_4.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_4.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_4.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_4.tickectCount}</div></div><div class="{seats.seat_1_6_4.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 390px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_4.groupPhone}</div></div><div class="{seats.seat_1_6_5.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 520px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_6_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_6_5.tickectCount}</div></div><div class="{seats.seat_1_6_5.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 520px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_6_5.groupPhone}</div></div><div class="{seats.seat_1_7_1.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_7_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_1.tickectCount}</div></div><div class="{seats.seat_1_7_1.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_1.groupPhone}</div></div><div class="{seats.seat_1_7_2.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 130px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_7_2.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_2.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_2.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_2.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_2.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_2.tickectCount}</div></div><div class="{seats.seat_1_7_2.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 130px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_2.groupPhone}</div></div><div class="{seats.seat_1_7_3.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 260px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_7_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_3.tickectCount}</div></div><div class="{seats.seat_1_7_3.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 260px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_3.groupPhone}</div></div><div class="{seats.seat_1_7_4.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 390px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_7_4.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_4.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_4.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_4.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_4.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_4.tickectCount}</div></div><div class="{seats.seat_1_7_4.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 390px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_4.groupPhone}</div></div><div class="{seats.seat_1_7_5.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 520px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_1_7_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_1_7_5.tickectCount}</div></div><div class="{seats.seat_1_7_5.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 120.634920634921px; left: 520px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_1_7_5.groupPhone}</div></div><div class="{seats.seat_2_6_1.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 0px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_6_1.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_1.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_1.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_1.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_1.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_1.tickectCount}</div></div><div class="{seats.seat_2_6_1.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 0px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_1.groupPhone}</div></div><div class="{seats.seat_2_6_2.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 130px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_6_2.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_2.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_2.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_2.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_2.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_2.tickectCount}</div></div><div class="{seats.seat_2_6_2.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 130px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_2.groupPhone}</div></div><div class="{seats.seat_2_6_3.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 260px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_6_3.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_3.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_3.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_3.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_3.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_3.tickectCount}</div></div><div class="{seats.seat_2_6_3.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 260px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_3.groupPhone}</div></div><div class="{seats.seat_2_6_4.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 390px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_6_4.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_4.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_4.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_4.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_4.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_4.tickectCount}</div></div><div class="{seats.seat_2_6_4.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 390px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_4.groupPhone}</div></div><div class="{seats.seat_2_6_5.seatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 520px; text-align: left;"><div class="label textLabel font-medium" style="width: 26px; height: 30.1587301587302px; position: absolute; top: 0px; left: 0px; text-align: left; color: rgb(255, 255, 255); background: black;">{seats.seat_2_6_5.label}</div><div class="customerPhone textLabel font-medium" style="width: 104px; height: 30.1587301587302px; position: absolute; top: 0px; left: 26px; text-align: right; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_5.customerPhone}</div><div class="customerName textLabel font-medium" style="width: 78px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 0px; text-align: left; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_5.customerName}</div><div class="pickupInfo textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 60.3174603174603px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_5.pickupInfo}</div><div class="note textLabel font-medium" style="width: 130px; height: 30.1587301587302px; position: absolute; top: 90.4761904761905px; left: 0px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_5.note}</div><div class="tickectCount textLabel font-medium" style="width: 52px; height: 30.1587301587302px; position: absolute; top: 30.1587301587302px; left: 78px; text-align: center; color: rgb(0, 0, 0); background: transparent;">{seats.seat_2_6_5.tickectCount}</div></div><div class="{seats.seat_2_6_5.groupSeatDisplay} seatType" style="width: 130px; height: 120.634920634921px; position: absolute; top: 241.269841269841px; left: 520px; text-align: left;"><div class="groupPhone textLabel font-large" style="width: 130px; height: 120.634920634921px; position: absolute; top: 0px; left: 0px; text-align: center; color: rgb(0, 0, 0); font-weight: bold; background: transparent;">{seats.seat_2_6_5.groupPhone}</div></div></div></div>' +
'</div>' +
'</div>';



///#source 1 1 /App/Bu/Co.Bks/Core/p.js
/************************************************************************
* CORE vBooking module                                                  *
*************************************************************************/
$.widget("custom.vbooking", {

    /************************************************************************
    * DEFAULT OPTIONS / EVENTS                                              *
    *************************************************************************/
    //#region Options
    options: {
        cid: 0,
        aid: 0,
        uid: 0,
        un: "",
        serviceUrl: null,
        backupBaseUrl: null,
        baseUrl: null,
        sTimeZoneOffset: 0,
        cite: '',
        cice: '',
        cifne: '',
        cisne: '',
        pilne: '',
        aite: '',
        aice: '',
        aisne: '',
        aifne: '',
        rights: '',
    },
    //#endregion
    /************************************************************************
    * PRIVATE FIELDS                                                        *
    *************************************************************************/
    //#region PRIVATE FIELDS 
    _$container: null, //Reference to the main container of all elements that are created by this plug-in (jQuery object)
    _$toolbar: null,
    _$tripInfo: null,
    _$sheet: null,
    _$notComeSheet: null,
    _$cancelSheet: null,

    _numCoach: 1, //Number of coach
    _numRow: 7, //default is 7
    _numCol: 5, //default is 5
    _info: null,
    _data: null,
    _cTripIndex: 0, //Current trip index
    _cTripId: 0, //Current trip id
    //_cFromIndex: 0, //Current From index
    _cFromId: 0, //Current From id
    _cToId: 0, //Current To id
    _cDefaultFromId: 0, //Current From id
    _cDefaultToId: 0, //Current To id
    _cTripDate: null,
    _cTripTime: null,
    _cTripBus: 0,
    _cStageBinary: "",
    _cStageCode: 0,
    _cMaxStageCode: 0,
    _m: null, //Matrix seat
    _nc: null, //Matrix not come ticket
    _c: null, //Matrix cancel ticket
    _cphoneSt: null,
    _cCodeSt: null,

    //Offset time between local and server, plus this value when submit to server
    _sOffsetMinute: 0,
    _grid: true,
    _rBookingOnPast: false,
    //#endregion
    /************************************************************************
    * CONSTRUCTOR AND INITIALIZATION METHODS                                *
    *************************************************************************/
    _create: function () {
        FlatObj.W = this;
        //Initialization
        this._initializeFields();

        //Creating DOM elements
        this._createContainer();
        this._createToolBar();
        this._createSheet();
    },
    _initializeFields: function (args) {
        this._data = []; //Store data
        this._info = []; //Info
        this._m = []; //Default is empty
        this._nc = []; //Notcome is empty
        this._c = []; //Notcome is empty
        this._cphoneSt = {};
        this._cCodeSt = {};
        this._cFromId = 0;
        this._cToId = 0;
        //Default trip Id
        //if (vIsEstStr(this.options.rights)) {
        //    var match = this.options.rights.match(/\~3\|1\|\d+/g);
        //    if (match != null) {
        //        var tripId = parseInt(match[match.length - 1].substring(match[match.length - 1].lastIndexOf('|') + 1));
        //        if (!isNaN(tripId)) {
        //            this._cTripId = tripId;
        //$.each(this._data, function(kl, kv) {
        //    console.log(kv);
        //});
        //} else {
        //console.log('_initializeFields');
        //        }
        //    } else {
        //        this._cTripId = 0;
        //    }

        //    if (/\~5\|2\|1/.test(this.options.rights)) {
        //        this._rBookingOnPast = true;
        //    }
        //}

        //Current trip date
        var d = new Date();
        var timeZoneOffset = d.getTimezoneOffset();
        var sDate = vPrsDt(this.options.sTime);
        var sTimeOffset = Math.floor((sDate - d) / 60000);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        if (args && args.d && moment(args.d, 'DD.MM.YYYY').isValid()) {
            var dt = vPrsDt(args.d);
            if (dt) this._cTripDate = dt;
            else this._cTripDate = d;
        } else {
            this._cTripDate = d;
        }
        this._sOffsetMinute = parseInt(this.options.sTimeZoneOffset) + timeZoneOffset + sTimeOffset;
        app.sOffsetMinute = this._sOffsetMinute;
    },
    _createContainer: function () {
        this._$container = $('.vbooking-container');
    },
    _createToolBar: function () {
        this._$toolbar = $('.vbooking-toolbar');
    },
    _createSheet: function () {
        this._$tripInfo = $('<div />')
            .addClass('vbooking-info col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);

        this._$sheet = $('<div />')
            .addClass('vbooking-sheet col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);

        this._$notComeSheet = $('<div />')
            .addClass('vbooking-ncsheet col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);

        this._$cancelSheet = $('<div />')
            .addClass('vbooking-csheet col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);
    },

    /************************************************************************
    * PUBLIC METHODS                                                        *
    *************************************************************************/
    load: function (args) {
        this._beginEvent();
        this._initializeFields(args);
        this.reload(args);
        this._reloadInfo();
        //this._endEvent();
        return { x: this }
    },
    startNotification: function () {
        //if (_dict._hasNotification) {
        //this._startNotification();
        //}
    },

    reload: function (args) {
        var me = this;
        $('#FilterForm .btn-filter > button').removeClass('active');
        var $btnGrid = $('#FilterForm .btn-filter > button.btn-grid');
        if ($btnGrid.length > 0) {
            if (!$btnGrid.hasClass('active')) {
                $btnGrid.addClass('active');
                me._grid = true;
            }
        }
        if (typeof me.options.rid != 'undefined') me._cTripId = me.options.rid;
        me._reloadTrigger();
        me._reloadData(function () {
            if (me.allowCompEvent || me.allowAgentTripEvent) {
                alert('Không tìm thấy chuyến, vui lòng chọn Company khác');
                $("body").trigger('tripNotFound');
            }
        });
        var afterReloadSheet = function () {
            // reset load first time value back default
            FlatObj.LFTime = false;
        }
        if (typeof me._reloadFilter === 'function') {
            me._reloadFilter(args);
            me._reloadFrame();
            me._reloadAllowedSeats();
            me._isOrderring = false;
            //self._reloadFlatObj();
            me._reloadSheet(afterReloadSheet);
            $('ul.vbooking-list a[data-tab="bks"]').trigger('click');
            // reset load default trip
            FlatObj.LDefTrip = false;
        } else {
            console.error('BKS load fail. Trying again....');
            location.reload();
        }
    },

    _reloadFlatObj: function () {
        var self = this;
        FlatObj.W = this;
        if (!self._data[self._cTripIndex]) {
            //Khi load trip chậm thì sẽ lấy mặc đinh Index = 0 (Khánh)
            self._cTripIndex = 0;
        }
        FlatObj.cRoute = self._data[self._cTripIndex]; //Current Trip
        if (!FlatObj.cRoute) return false;
        FlatObj.cTrip = FlatObj.cRoute.Ts[FlatObj.W._cTripTime][0]; //Current Trip
        FlatObj.SP = self._data[self._cTripIndex].StopPoints; //current StopPoints
        return true;
    },
    destroy: function () {
        this.element.empty();
        $.Widget.prototype.destroy.call(this);
    },

    _reloadTrigger: function () {
        $("body").trigger('applyBooking', this.options);
    },

    _beginEvent: function () {
        var me = this;
        $("#agtTrips").find('.jtable').on('mouseenter', function (e) {
            //console.log("coming...");
        });
        $("body").on("compChanged", function (e, model) {
            if (me.allowCompEvent && typeof model != 'undefined' && model != null) {
                // load first time
                FlatObj.LFTime = true;
                // reset giá trị FTripGetTrip về dạng default
                FlatObj.FTripGetTrip = false;
                // load default trip
                FlatObj.LDefTrip = true;
                me._clearSelectedItem();
                vbf('resetSeatStack'); // Reset seat stack
            }

        });
        $("body").on("tripChanged", function (e, model) {
            //console.log(me.options, e, model);
            if (me.allowAgentTripEvent) {
                //me._clearSheet();
                me._setOption('cid', model.CompId);
                me._setOption('rid', model.Id);
                me.reload();
                $('body').find('select[name=TripId]').trigger('change');
            }

        });
        vbv("fTripReady", function (e) {
            if (e.cb != undefined) {
                me._mapData(e.r, e.cb);
            } else {
                me._mapData(e.r);
            }
            if (me._data[me._cTripIndex]) {
                FlatObj.SP = me._data[me._cTripIndex].StopPoints; //current StopPoints
            }
            FlatObj.cRoute = me._data[me._cTripIndex]; //Current Trip
            // báo hiệu đã chạy hàm fTripGetTrip
            FlatObj.FTripGetTrip = true;

        });
        vbv('doEmptySheets', function (e) {
            $(e.d.value).empty();
        });
        vbv('doHideSheets', function () {
            $(e.d.value).hide();
        });
        vbv('doRenderTripInfo', function () {
            FlatObj.FTripGetTrip = false;
            me._renderTripInfo();
        });
        //vbv('doPrintETicket', function (e) {
        //    me._printETicket();
        //    if (e.cb) e.cb.call();
        //});
        vbv('doShowPopModal', function (e) {
            me._showPopModal(e.d.msg);
        });
        vbv('doShowSuccessModal', function (e) {
            me._showSuccessModal(e.d.hdr, e.d.msg);
        });
        vbv("reloadSheet", function (e) {
            var afReload = function () {
                if (e.cb) e.cb.call(this, e);
            }
            me._reloadSheet(afReload);
        });
        vbv("storeHistory", function (e) {
            me._storeHistory(e.d.un, e.d.key, e.d.his);
        });
        vbv("clearSelectedItem", function (e) {
            me._clearSelectedItem();
        });
        vbv("doGetCurrentTripInfo", function (e) {
            var tripInfo = me._getCurrentTripInfo();
            vbf('CurrentTripInfo', { tripInfo: tripInfo });
        });
        vbv("doResetAll", function (e) {
            me._resetAll();
        });

        vbv("doGetTotalSeats", function () {
            me._getTotalAvaiSeats();
        });

        vbv("doGetMultiTotalSeats", function () {
            me._getMultiTotalAvaiSeats();
        });
    },

    _endEvent: function () {
        this.allowCompEvent = true;
        this.allowAgentTripEvent = true;
    },
    /************************************************************************
    * PRIVATE METHODS                                                       *
    *************************************************************************/
    _setOption: function (key, value) {
        this.options[key] = value;
    },

    _submitAction: function (d, p) {
        vRqs(d, p, { async: false });
    },
    _submitAsyncAction: function (d, p) {
        vRqs(d, p);
    },

    /************************************************************************
    * GENERAL                                                                 *
    *************************************************************************/
    _reloadInfo: function () {
        var self = this;
        //Update post data
        var obj = self._createGetInfoObj();
        var completeReload = function (u, r, l, t) {
            if (u != 1 || l <= 0) {
                return;
            }
            //Map data
            //self._mapInfo(r);
        };
        //Submit query
        //self._submitAction(obj, completeReload);
        vdc.gCompany(obj._c, '#', false, null, completeReload);
    },
    _createGetInfoObj: function () {
        var self = this;
        //Create 
        var obj = {};
        obj._a = "fGetCompany";
        obj._c = {
            BaseId: self.options.cid,
            Type: "($x = 2 OR $x = 3)",
            IsPrgStatus: 1
        };
        obj._f = "Id, Type, Code, Name, AddressInfo, PhoneInfo";

        return obj;
    },
    //_mapInfo: function (data) {
    //    var self = this;
    //    app.branchInfo = data;

    //    var blist = [];
    //    var alist = [];
    //    $.each(data, function (_, b) {
    //        //var $op = $('<option />', { value: b[0] }).text($.trim(b[3]));
    //        var op = { value: b[0], text: $.trim(b[3]) };
    //        if (b[1] == 2) {
    //            blist.push(op);
    //        } else if (b[1] == 3) {
    //            alist.push(op);
    //        }
    //    });

    //    blist.sort(function (a, b) {
    //        return a.text.localeCompare(b.text);
    //    });

    //    alist.sort(function (a, b) {
    //        return a.text.localeCompare(b.text);
    //    });

    //    //self._$updateForm.find('select[name=BranchName]').empty().append(blist).prepend($('<option />', {value: ""}).text('Chọn chi nhánh'));
    //    //self._$updateForm.find('select[name=AgentName]').empty().append(alist).prepend($('<option />', { value: "" }).text('Chọn đại lý xe'));
    //    $.each(blist, function (_, item) {
    //        self._$updateForm.find('select[name=BranchName]').append(
    //            $('<option />', { value: item.value }).text(item.text)
    //        );
    //    });

    //    var $selectAgent = self._$updateForm.find('select[name=AgentName]');
    //    // Edited by Duy: fix lỗi bị duplicate đại lý
    //    // vẫn giữ lại cái đầu tiên
    //    var $firstOp = $selectAgent.find('option:first-child');
    //    $selectAgent.empty();
    //    $selectAgent.append($firstOp);

    //    $.each(alist, function (_, item) {
    //        $selectAgent.append(
    //            $('<option />', { value: item.value }).text(item.text)
    //        );
    //    });
    //    //$selectAgent.children().last().attr("selected", "selected");
    //    self._$updateForm.find('select[name=AgentName]').chosen({ width: "100%", search_contains: true });
    //},

    /************************************************************************
    * FRAME                                                                 *
    *************************************************************************/
    _reloadData: function (cb) {
        var self = this;
        //Update post data
        //var obj = self._createGetFrameObj();
        //var completeReload = function (u, r, l, t) {
        //    if (u != 1 || l <= 0) {
        //        self._clearSheet();
        //        self._notFoundResult();
        //        if (cb != null) {
        //            cb.call(self);
        //        }
        //        return;
        //    }
        //    //Map data
        //    self._mapData(r);
        //    if (self._data[self._cTripIndex]) {
        //        FlatObj.SP = self._data[self._cTripIndex].StopPoints; //current StopPoints
        //    }
        //    FlatObj.cRoute = self._data[self._cTripIndex]; //Current Trip
        //};
        //Submit query
        //self._submitAction(obj, completeReload);

        // kiểm tra xem fTripGetTrip đã chạy chưa
        if (!FlatObj.FTripGetTrip) {
            var e = jQuery.Event("fTripGetTrip");
            e.in = self._cTripDate;
            e.reload = !FlatObj.LFTime;
            if (typeof cb === "function" && FlatObj.RBePrint) {
                e.cb = cb;
            }
            $('body').trigger(e);
        }
    },
    _createGetFrameObj: function () {
        var self = this;
        self._cTripDate.setHours(0);
        self._cTripDate.setMinutes(0);
        self._cTripDate.setSeconds(0);

        var d = "(type = 1 or (type = 2 and Time is not null and $x = N'" + self._cTripDate.toFormatString('iso') + "')) order by type,DisplayOrder,name asc";

        //Create 
        var obj = {};
        obj._a = "fGetTrip";
        obj._c = {
            CompId: self.options.cid,
            IsPrgStatus: "$x != 3",
            Date: d
        };

        obj._f = "Id, Name, Info, SeatTemplateInfo, FareInfo, StatusInfo, BaseId, Type, Time, Alias, TeamInfo, VehicleInfo, FromArea, ToArea, Note, RouteInfo, SeatSummaryInfo, TotalSeats, ClosedStatus, PassengerMoney, ProductMoney, FeeMoney, BranchReceiveProduct, RealDepartureTime, PickedPointsInfo, TransferPointsInfo, NewFare,DisplayOrder, Description, TotalBookedSeats, TotalPaidSeats";

        return obj;
    },
    _parseStopPoints: function (routeInfo) {
        var res = {
            idx: {},
            data: []
        };
        var i = 0;
        $.each(routeInfo, function (_, t) {
            if (i == 0) {
                i++;
                return;
            }

            t = t.split("|");
            res.idx[t[0]] = i - 1;
            res.data.push({
                Id: t[0],
                Type: t[1],
                Code: t[2],
                Name: t[3],
                Address: t[4],
                Distance: t[5],
                Hour: parseInt(t[6]),
                Minute: parseInt(t[7]),
                Order: typeof t[8] == 'undefined' ? 0 : t[8],
            });
            i++;

        });
        return res;

    },
    _mapData: function (data, cb) {
        var self = this;
        self._data = [];
        self._points = [];
        var tIds = [];
        $.each(data, function (_, t) {
            //Parse info
            var bId = parseInt(t[6]);
            var tId = parseInt(t[0]);
            if (!isNaN(bId) && bId != 0) {
                tId = bId;
            }
            // kiểm tra xem có block tuyến đường theo văn phòng hay không
            // nếu có sẽ không khởi tạo giá trị cho self._data của tuyến đó
            if (typeof _dict._hasBlockTripByBranch != "undefined" && _dict._hasBlockTripByBranch && typeof _dict._blockTripByBranch != "undefined") {
                if (typeof _dict._blockTripByBranch[app.aid] != "undefined" && _dict._blockTripByBranch[app.aid].indexOf(tId) != -1) {
                    return;
                }
            }
            var sInfo = parseInt(t[5]);
            //var b = Math.floor(sInfo / 16); //STATUS
            var b = parseInt(t[9]); //bus is Alias
            if (isNaN(b)) {
                b = 0;
            }
            var s = sInfo; //STATUS
            var type = parseInt(t[7]);
            var idx = tIds.indexOf(tId);
            if (idx == -1) {
                //remove vn chars
                idx = tIds.push(tId) - 1;
                self._data[idx] = {
                    Id: tId,
                    Name: t[1],
                    FromArea: t[12],
                    ToArea: t[13],
                    //RouteInfo: t[15],
                    StopPoints: t[15] ? self._parseStopPoints(t[15].split("~")) : self._parseStopPoints([]),
                    FareInfo: t[4],
                    Ts: {},
                    BranchReceiveProduct: t[22],
                    PickedPointsInfo: t[24],
                    TransferPointsInfo: t[25],
                    TripDriver: t[28],
                };
            }

            //Total seat
            var numSeat = 0;
            var tplInfo = t[3] ? t[3].split('~')[1] : null;
            var seatTemplateId = t[3] ? t[3].split('~')[0] : null;
            if (typeof tplInfo != "undefined" && tplInfo != null) {
                numSeat = parseInt(tplInfo.split('|')[2]);
            }
            var totalSeats = t[17];
            var bookedSeats = t[16];
            if (1 == type) {
                //Set up base
                if (t[2] != null) {
                    var tInfo = t[2].split('~');
                    $.each(tInfo, function (__, ts) {
                        //Parse time slot
                        var pTs = ts.split('|')[0];

                        if (typeof self._data[idx].Ts[pTs] == "undefined") {
                            self._data[idx].Ts[pTs] = [];
                        }
                        self._data[idx].Ts[pTs][b] = {
                            T: t[3],
                            SeatTemplateId: seatTemplateId,
                            F: t[4],
                            S: s,
                            N: t[14],
                            NS: numSeat,
                            BS: bookedSeats,
                            TS: totalSeats,
                            ClosedStatus: t[18],
                            RealDepartureTime: t[23],
                            TripDriver: t[28]
                        }; //Template, Fare, Status, Number of seat, Booked Seats, Total Seats
                    });
                }
            } else if (2 == type) {
                //Set up detail
                if (t[8] != null && t[8] != "") {
                    if (typeof self._data[idx].Ts[t[8]] == "undefined") {
                        self._data[idx].Ts[t[8]] = [];
                    }
                    //Overwrite self._data[idx] => idx= current index
                    self._data[idx].Ts[t[8]][b] = {
                        T: t[3],
                        SeatTemplateId: seatTemplateId,
                        F: vIsEstStr(t[26]) ? t[26] : t[4],
                        S: s,
                        NS: numSeat,
                        Dr: t[10],
                        V: t[11],
                        N: t[14],
                        BS: bookedSeats,
                        TS: totalSeats,
                        TeamInfo: t[10],
                        TripDetailId: t[0],
                        ClosedStatus: t[18],
                        PassengerMoney: t[19],
                        ProductMoney: t[20],
                        FeeMoney: t[21],
                        RealDepartureTime: t[23],
                        TripDriver: t[28],
                        TotalPaidSeats: t[30],
                        TotalBookedSeats: t[29]
                    };
                }
            }
        });

        // kiểm tra có sơ đồ ghế mặc định theo giờ hay không
        //var obj = {};
        //obj._a = "fGetTrip";
        //obj._c = {
        //    CompId: self.options.cid,
        //    Type: 7
        //};
        //obj._f = "BaseId, Time, SeatTemplateInfo";

        //var requestSucc = function (u, r, t, t) {
        //    //Normalize data
        //    if (u == 1 || l > 0) {
        //        $.each(r, function (hb, hc) {
        //            $.each(self._data, function (kn, km) {
        //                if (km.Id == hc[0]) {
        //                    self._data[kn].Ts[hc[1]][0].T = hc[2]; // bus Alias = 0
        //                }
        //            });
        //        });
        //    }
        //}

        //self._submitAction(obj, requestSucc);

        vdc.gPhoiTemplates({ IsPrgStatus: 1, CompId: app.cid }, '#', false, null, function (u, r, l) {
            self._phoiTemplates = {};
            for (var i = 0; i < r.length; i++) {
                if (r[i][2] != null && r[i][2] != "") {
                    self._phoiTemplates[r[i][2]] = {
                        id: r[i][0],
                        name: r[i][1],
                        seatTemplateId: r[i][2],
                        seatTemplateName: r[i][3],
                        html: r[i][4],
                        numberOfPage: r[i][5],
                        orientation: r[i][6] == 0 ? "portrait" : "landscape",
                    };
                }
            }
        });

        if (cb != undefined) {
            cb.call();
        }
    },

    _reloadFrame: function () {
        var self = this;
        if (self._data[self._cTripIndex]) {
            try {
                self._mapSeatToMatrix(self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].T);
            } catch (e) {
                console.log('(Error) _reloadFrame: ' + e);
            }
        }

        //self._renderSeatTemplate();
    },
    _mapSeatToMatrix: function (data) {

        var self = this;
        self._m = [];

        //Template
        var tpl = data.split('~');
        //Coach
        self._numCoach = parseInt(tpl[1].split('|')[1]);
        for (var i = 2; i < 4; i++) {
            var f = tpl[i].split('|');
            var nr = parseInt(f[1]);
            var nc = parseInt(f[2]);
            if (self._numRow < nr) {
                self._numRow = nr;
            }
            if (self._numCol < nc) {
                self._numCol = nc;
            }
        }

        //Seat
        for (var j = self._numCoach + 1; j < tpl.length; j++) {
            var record = tpl[j].split('|');
            var s = self._createSeatFromRecord(record);
            if (!$.isEmptyObject(s)) {
                var coach = parseInt(record[5]);
                var row = parseInt(record[6]);
                var col = parseInt(record[7]);
                //Create coach if not existing
                if (typeof self._m[coach - 1] == 'undefined') {
                    self._m[coach - 1] = [];
                }

                //Create row if not existing
                if (typeof self._m[coach - 1][row - 1] == 'undefined') {
                    self._m[coach - 1][row - 1] = [];
                }
                //Add seat to matrix
                self._m[coach - 1][row - 1][col - 1] = s;
            }
        }
        app.sheetMatrix = self._m;

    },

    /************************************************************************
    * SHEET                                                                 *
    *************************************************************************/
    _reloadSheet: function (afterReloadSheet) {

        var me = this;
        // reset FTripGetTrip về default
        FlatObj.FTripGetTrip = false;
        $('button.btn-thong-ke').removeClass('active');
        me._$sheet.removeClass('thong-ke-tb');
        var isHasRoute = me._reloadFlatObj();
        if (!isHasRoute) return false;
        var tripStatus = me._data[me._cTripIndex].Ts[me._cTripTime][0]["S"];
        if (tripStatus != undefined && tripStatus == 3) {
            me._renderCanceledTrip();
            me._$cancelSheet.hide();
        } else {
            me._$cancelSheet.show();
            //Update post data
            var obj = me._createGetSeatObj();
            var completeReloadSheet = function (u, r, l, t) {
                if (u != 1) return;
                //Clear ticket from seat
                me._clearTicket();
                me._clearCancelled();
                me._clearNotCome();
                me._checkAllowedSeats();
                if (l > 0) me._mapTicketToSeat(r); //Map ticket to seat matrix
                //Render UI
                //me._renderTripInfo();
                if (me._isOrderring) {
                    me._renderPickupTicket();
                    if (me._hasMergeTransfer()) {
                        me._reloadMergeTransferTicket();
                    }
                    me._renderTransferTicket();
                } else if (!me._grid) {
                    me._lrenderSeatTemplate();
                    me._lrenderCancelledTicket();
                } else {
                    me._renderSeatTemplate();
                    me._renderCancelledTicket();
                    me._renderNotComeTicket();
                }

                if (typeof afterReloadSheet != "undefined" && typeof afterReloadSheet === "function") {
                    afterReloadSheet.call();
                }

                // remove request in array oRq.cRqs
                if (oRq.iAc) {
                    me._resetAjaxRequest();
                }
                me._renderTripInfo();
            };

            //Submit query
            if (!$.isEmptyObject(obj)) {
                vdc.gTicket(obj._c, obj._f, !FlatObj.LFTime, null, completeReloadSheet);
                //vRqu(obj, completeReloadSheet);
                //self._submitAction(obj, completeReloadSheet);
            } else {
                //Clear ticket from seat
                me._reloadFrame();
            }
        }
        //Update URL
        $.setUrlByData("Quản lý nhà xe", { t: me._cTripId, d: me._cTripDate.toFormatString('dd.mm.yyyy'), h: me._cTripTime.replace(":", ".") });
        return true;
    },
    _getTotalAvaiSeats: function () {
        var me = this;
        var obj = {
            _a: 'fGetBTotalSeats',
            _c: {
                cId: app.cid,
                tripId: me._getCTripId(),
                tripDate: me._getDepartureTime().toFormatString("yyyy-mm-dd hh:mm:ss")
            },
            _f: 'TotalBookedSeats,TotalExpiredSeats'
        }
        var cb = function (u, r, l, t) {
            if (u == 1 && r[0]) {
                vbf('bUpdateAvaiSeats', {
                    value: me,
                    TotalBookedSeats: r[0][0],
                    TotalExpiredSeats: r[0][1]
                });
            }
        }
        vRqs(obj, cb);
    },
    _getMultiTotalAvaiSeats: function () {
        var me = this;
        var obj = {
            _a: 'fGetBMultiTotalSeats',
            _c: {
                cId: app.cid,
                tripId: me._getCTripId(),
                tripDate: me._getDepartureTime().toFormatString("yyyy-mm-dd")
            },
            _f: 'Time,TotalBookedSeats,TotalExpiredSeats'
        }
        var cb = function (u, r, l, t) {
            if (u == 1 && r) {
                vbf('bUpdateAvaiSeats', {
                    value: me,
                    ArrayTotalTimes: r
                });
            }
        }
        vRqs(obj, cb);
    },
    _createGetSeatObj: function () {
        var self = this;

        //Get filter form data
        var departureTime = self._getDepartureTime();
        var obj = {};
        if ($.isEmptyObject(departureTime)) {
            //alert('Không tìm thấy giờ chạy, vui lòng chọn chuyến khác');
            $("body").trigger('timeNotFound');
            return {};
        }
        obj._a = "fGetTicket";
        //obj._c = {
        //    TripId: self._cTripId,
        //    TripDate: departureTime.toFormatString("iso"),
        //    Status: '(($x) IN(1, 2, 3, 4, 5, 8))', //STATUS
        //    //Status: "(($x) IN(2, 3, 4, 5, 8) or (Status <> 1 or (Status = 1 AND (ExpiredTime is null or ExpiredTime >= '" + new Date().toFormatString("iso") + "'))))", //STATUS
        //    //ExpiredTime: "(Status = 1 AND ($x is null or $x >= '" + new Date().toFormatString("iso") + "'))"
        //};
        obj._c = {
            cId: app.cid,
            tripId: self._cTripId,
            tripDate: departureTime.toFormatString("iso"),
            //status: '(($x) IN(1, 2, 3, 4, 5, 8))', 
        };
        //obj._f = "Id, TripId, AgentId, TripDate, SeatCode, IssueDate, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Serial, PaymentInfo, IsPrgHistoryInfo, Code, PassCode, FromValid, ToValid, IsPrgUpdatedDate, AgentInfo";
        obj._f = _dict._tgF.join();

        return obj;
    },
    _clearTicket: function () {
        var self = this;
        self._cphoneSt = [];
        self._cCodeSt = [];
        $.each(self._m, function (i, c) {
            if (typeof c != "undefined") {
                $.each(c, function (j, r) {
                    if (typeof r != "undefined") {
                        $.each(r, function (k, s) {
                            if (typeof s != "undefined" && s != null) {
                                s._tickets = [];
                                //s._changeStatus(1);
                            }
                        });
                    }

                });
            }

        });
    },
    _clearCancelled: function () {
        var self = this;
        self._c = [];
        self._$cancelSheet.empty();
    },
    _clearNotCome: function () {
        var self = this;
        self._nc = [];
        self._$notComeSheet.empty();
    },
    _reloadAllowedSeats: function () {
        var self = this;
        if (app.onlineCompId == null || app.aid == app.vaid) return;
        if (app.onlineCompId.indexOf(parseInt(app.cid)) != -1) {
            self._allowedSeats = [];
            self._allAllowedSeats = [];
            var obj = self._createAllowedSeatObj();
            var complete = function (u, r, l, t) {
                if (u != 1) {
                    self._allowBookAllSeat = true;
                    return;
                }
                if (l >= 1) {
                    self._mapDataAllowedSeat(r);
                }
                else {
                    self._allowBookAllSeat = true;
                }
            }
            vdc.gBusTicketStatus(obj._c, '#', !FlatObj.LFTime, null, complete);
            //this._submitAction(obj, complete);
        }
    },
    _createAllowedSeatObj: function () {
        var self = this;
        var obj = {
            _a: 'fGetBus_Tickets_Status',
            _c: {
                XTypeId: "($x in (2,5))",
                XTripId: self._cTripId,
                XStatus: 1,
                XDate: self._cTripDate.toFormatString('yyyy-mm-dd'),
                IsPrgStatus: "($x is null or $x != 3)"
            },
            _f: 'Id,XTypeId,XAgentId,XBranchId,XOperatorId,XCompanyId,XRouteId,XTripId,XDate,XTime,XStatus,Info,TimeLimit'
        };
        return obj;
    },
    _mapDataAllowedSeat: function (records) {
        var self = this;
        self._allAllowedSeats = [];
        $.each(records, function (_, data) {
            var date = vIsEstStr(data[8]) ? vGtDtObj(data[8]) : null;
            var time = data[9];
            var info = data[11];
            var timeLimit = data[12];
            var tt = '';
            if (!vIsEstStr(time)) {
                tt = '';
            } else {
                //tt = moment(time, 'HH:mm:ss').format('HH:mm');
                tt = vPrsTm(time);
            }
            var item = {
                Date: date,
                Time: tt,
                Info: info,
                TimeLimit: parseInt(data[12])
            };
            self._allAllowedSeats.push(item);
        });
    },
    _checkAllowedSeats: function () {
        var self = this;
        var apply = false;
        var stop = false;
        if (self._allAllowedSeats != undefined && self._allAllowedSeats.length > 0) {
            $.each(self._allAllowedSeats, function (_, v) {
                if (!stop) {
                    if (!$.isEmptyObject(v.Date)) {
                        if (vGetDateOnly(v.Date) == vDtToStr('dd-mm-yyyy', self._cTripDate)) {
                            //console.log('Block seat', 'Same date');
                            if (!vIsEstStr(v.Time) || v.Time == self._cTripTime) {
                                //console.log('Block seat', 'Same time');
                                apply = self._getAllowedSeats(v);
                                if (v.Time == self._cTripTime) stop = true;
                            }
                        }
                    } else {
                        //console.log('Block seat', 'Same date (null)');
                        if (!vIsEstStr(v.Time) || v.Time == self._cTripTime) {
                            //console.log('Block seat', 'Same time');
                            apply = self._getAllowedSeats(v);;
                        }
                    }
                }
            });
        }

        if (apply) {
            var now = new Date();
            now.addMinutes(app.onlineTimeLimit);
            var dptD = self._cTripDate;
            if (dptD < now) {
                self._allowBookAllSeat = true;
                self._allowedSeats = [];
                //console.log('time over');
            }
            return;
        }
        self._allowBookAllSeat = true;
        self._allowedSeats = [];
        return;
    },
    _getAllowedSeats: function (v) {
        var self = this;
        var info = v.Info;
        self._allowBookAllSeat = true;
        self._allowedSeats = [];
        if (vIsEstStr(info) && info.indexOf('~') > 0) {
            var seats = info.split('~');
            var enBms = parseInt(seats[0]);
            var count = parseInt(seats[1]);
            if (enBms == 1) {
                if (count < 1000) {
                    for (var i = 2; i < seats.length; i++) {
                        var p = seats[i].split("|");
                        var coach = parseInt(p[1]);
                        var row = parseInt(p[2]);
                        var column = parseInt(p[3]);
                        if (typeof self._allowedSeats[coach] == 'undefined') {
                            self._allowedSeats[coach] = [];
                        }
                        if (typeof self._allowedSeats[coach][row] == 'undefined') {
                            self._allowedSeats[coach][row] = [];
                        }
                        self._allowedSeats[coach][row][column] = p[0];
                    }
                    self._allowBookAllSeat = false;
                    app.onlineTimeLimit = v.TimeLimit;
                    return true;
                }
            }
        }
        return false;
    },
    _mapTicketToSeat: function (data) {
        var self = this;
        $.each(data, function (i, v) {
            var t = self._createTicketFromRecord(v);
            if (!$.isEmptyObject(t)) {
                //Parse match seat
                var s = v[4].split('|');
                var coach = parseInt(s[1]);
                var row = parseInt(s[2]);
                var col = parseInt(s[3]);
                if (!isNaN(coach) && !isNaN(row) && !isNaN(col)) {
                    if (typeof self._m[coach - 1] != "undefined" && typeof self._m[coach - 1][row - 1] != "undefined" && typeof self._m[coach - 1][row - 1][col - 1] != "undefined") {
                        //Add ticket to seat
                        var seat = self._m[coach - 1][row - 1][col - 1];
                        if (t._isNotCome()) {
                            var ncseat = seat._clone();
                            //ncseat._changeStatus(4);
                            ncseat._tickets = [];
                            ncseat._addTicket(t, self._cStageCode);
                            if (typeof self._nc[coach - 1] == "undefined") {
                                self._nc[coach - 1] = [];
                            }
                            self._nc[coach - 1].push(ncseat);
                        } else if (t._isCancelled()) {
                            if (t._pcode == null || t._pcode == "") {
                                var cseat = seat._clone();
                                //cseat._changeStatus(3);
                                cseat._tickets = [];
                                cseat._addTicket(t, self._cStageCode);
                                if (typeof self._c[coach - 1] == "undefined") {
                                    self._c[coach - 1] = [];
                                }
                                self._c[coach - 1].push(cseat);
                            }

                        } else if (!t._isValid() && !t._isOpen()) {
                            if (seat._isAvailable()) { //Seat is availble
                                seat._addTicket(t, self._cStageCode);
                                //Statistic customer buy multiple seat
                                self._updateCPhoneSt(seat, t);
                                self._updateCCodeSt(seat, t);
                            }
                        }
                    }
                }
            }
        });
    },
    _getCurrentTripInfo: function () {
        if (FlatObj.cTripInfo != null) {
            return FlatObj.cTripInfo;
        }
        var self = this;
        var result = {
            _vehicleNumber: "",
            _driverName: "",
            _assistantName: "",
            _guideName: "",
            _note: ""
        };
        var cTrip = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus];
        if (vIsEstStr(cTrip.T)) {
            if (vIsEstStr(cTrip.V) && !vIsEstStr(cTrip.V.split('~')[1].split('|')[3])) {
                result['_vehicleName'] = cTrip.V.split('~')[1].split('|')[3];
            } else {
                result['_vehicleName'] = cTrip.T.split('~')[1].split('|')[5];
            }
        }
        if (vIsEstStr(cTrip.V)) {
            result['_vehicleNumber'] = cTrip.V.split('~')[1].split('|')[2];
        }
        if (vIsEstStr(cTrip.Dr)) {
            var teamInfo = cTrip.Dr.split('~');
            teamInfo.shift();
            var dr = [];
            var ast = [];
            var guide = [];
            $.each(teamInfo, function (i, v) {
                if (typeof v != "undefined" && v != null) {
                    var info = v.split('|');
                    switch (parseInt(info[0])) {
                        case 2: //Tài xế
                            dr.push(info[2]);
                            break;
                        case 4: //Lơ
                            ast.push(info[2]);
                            break;
                        case 5: //Hướng dẫn viên
                            guide.push(info[2]);
                            break;
                        default:
                            break;
                    }
                }
            });
            result['_driverName'] = dr.length > 0 ? dr.join(", ") : "";
            result['_assistantName'] = ast.length > 0 ? ast.join(", ") : "";
            result['_guideName'] = guide.length > 0 ? guide.join(", ") : "";
        }
        if (vIsEstStr(cTrip.N)) {
            result['_note'] = cTrip.N;
        }

        //Total
        var numPaid = 0, numBooking = 0, numAvail = 0, totalPaid = 0, totalMoney = 0;
        var numPaidPerType = {}, numBookingPerAgent = {}, totalPaidPerType = {}, totalBookingPerAgent = {};
        $.each(self._m, function (_, c) {
            if (typeof c != "undefined") {
                $.each(c, function (__, r) {
                    if (typeof r != "undefined") {
                        $.each(r, function (___, s) {
                            if (typeof s != "undefined" && s != null) {
                                if (s._isAvailable()) {
                                    if (!s._hasTicket()) {
                                        numAvail++;
                                    } else {
                                        $.each(s._tickets, function (i, t) {
                                            if (t._isPaid() || t._isPass()) {
                                                var pInfo = t._getPaymentInfo();
                                                if (!$.isEmptyObject(pInfo)) {
                                                    switch (pInfo.type) {
                                                        case 1:
                                                        case 6:
                                                            if (typeof pInfo.info != "undefined") {
                                                                var b = pInfo.info._code;
                                                                if (typeof numPaidPerType[b] == "undefined") {
                                                                    numPaidPerType[b] = 0;
                                                                    totalPaidPerType[b] = 0;
                                                                }
                                                                numPaidPerType[b]++;
                                                                totalPaidPerType[b] += t._fare;
                                                                totalMoney += t._fare;
                                                                totalPaid += t._fare;
                                                            }
                                                            break;
                                                        case 2:
                                                        case 3:
                                                        case 4:
                                                            //var sName = pInfo.sname;
                                                            //if (typeof numBookingPerAgent[sName] == "undefined") {
                                                            //    numBookingPerAgent[sName] = 0;
                                                            //    totalBookingPerAgent[sName] = 0;
                                                            //}
                                                            //numBookingPerAgent[sName]++;
                                                            //totalBookingPerAgent[sName] += t._fare;
                                                            //totalMoney += t._fare;
                                                            //numBooking++;
                                                            //if (numPaid > 0) {
                                                            //    numPaid--;
                                                            //} else {
                                                            //    numPaid = 0;
                                                            //}
                                                            var sName = pInfo.sname;
                                                            if (typeof numPaidPerType[sName] == "undefined") {
                                                                numPaidPerType[sName] = 0;
                                                                totalPaidPerType[sName] = 0;
                                                            }
                                                            numPaidPerType[sName]++;
                                                            totalPaidPerType[sName] += t._fare;
                                                            totalPaid += t._fare;
                                                            totalMoney += t._fare;
                                                            break;
                                                        case 5:
                                                        case 7:
                                                            var sssName = pInfo.sname;
                                                            if (typeof numPaidPerType[sssName] == "undefined") {
                                                                numPaidPerType[sssName] = 0;
                                                                totalPaidPerType[sssName] = 0;
                                                            }
                                                            numPaidPerType[sssName]++;
                                                            totalPaidPerType[sssName] += t._fare;
                                                            totalPaid += t._fare;
                                                            totalMoney += t._fare;
                                                            break;
                                                        case 8:
                                                        case 9:
                                                            var ssName = pInfo.sname;
                                                            if (typeof numPaidPerType[ssName] == "undefined") {
                                                                numPaidPerType[ssName] = 0;
                                                                totalPaidPerType[ssName] = 0;
                                                            }
                                                            numPaidPerType[ssName]++;
                                                            totalPaidPerType[ssName] += 0;
                                                            totalMoney += 0;
                                                            break;
                                                        case 10:
                                                            if (typeof numPaidPerType[pInfo.sname] == "undefined") {
                                                                numPaidPerType[pInfo.sname] = 0;
                                                                totalPaidPerType[pInfo.sname] = 0;
                                                            }
                                                            numPaidPerType[pInfo.sname]++;
                                                            totalPaidPerType[pInfo.sname] += t._fare;
                                                            totalMoney += t._fare;
                                                            totalPaid += t._fare;
                                                            break;
                                                    }
                                                }
                                                numPaid++;
                                            } else if (t._isBooking()) {
                                                var aInfo = t._getAgentInfo();
                                                if (!$.isEmptyObject(aInfo)) {
                                                    if (typeof numBookingPerAgent[aInfo._code] == "undefined") {
                                                        numBookingPerAgent[aInfo._code] = 0;
                                                        totalBookingPerAgent[aInfo._code] = 0;
                                                    }
                                                    numBookingPerAgent[aInfo._code]++;
                                                    totalBookingPerAgent[aInfo._code] += t._fare;
                                                    totalMoney += t._fare;
                                                }
                                                numBooking++;
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });

        result["_numPaid"] = numPaid;
        result["_numBooking"] = numBooking;
        result["_numAvail"] = numAvail;
        if (numPaid > 0) {
            result["_numPaidPerType"] = [];
            result["_totalPaidPerType"] = [];
            result["_tkNumPaidPerType"] = [];
            $.each(numPaidPerType, function (k, t) {
                if (typeof t != "undefined") {
                    $.each(totalPaidPerType, function (m, n) {
                        if (m == k) {
                            result["_totalPaidPerType"].push(k + ":&nbsp;" + t + "&nbsp;-&nbsp;" + n.toMn() + " đ");
                            result["_tkNumPaidPerType"].push(k + "|" + t + "|" + n);
                        }
                    });
                    result["_numPaidPerType"].push(k + ":&nbsp;" + t);
                }
            });
            result["_numPaidPerType"] = "&nbsp;(" + result["_numPaidPerType"].join() + ")";
            result["_totalPaidPerType"] = result["_totalPaidPerType"].join(", &nbsp;");
            //result["_totalPaidPerType"] = result["_totalPaidPerType"].join("<br />&nbsp;&nbsp;");

        }

        if (numBooking > 0) {
            result["_numBookingPerAgent"] = [];
            result["_totalBookingPerAgent"] = [];
            $.each(numBookingPerAgent, function (k, t) {
                if (typeof t != "undefined") {
                    $.each(totalBookingPerAgent, function (e, f) {
                        if (e == k) {
                            result["_totalBookingPerAgent"].push(k + ":&nbsp;" + t + "&nbsp;-&nbsp;" + f.toMn() + "đ");
                        }
                    });
                    result["_numBookingPerAgent"].push(k + ":&nbsp;" + t);
                }
            });
            result["_numBookingPerAgent"] = "&nbsp;(" + result["_numBookingPerAgent"].join() + ")";
            result["_totalBookingPerAgent"] = result["_totalBookingPerAgent"].join(", ");

        }
        result["_total"] = numPaid + numBooking;
        result["_totalPaid"] = totalPaid;
        result["_numBooking"] = numBooking;
        result["_totalMoney"] = totalMoney != 0 ? totalMoney.toMn() + " đ" : "";

        // thống kê theo chuyến
        result["_mainFareTienKhach"] = totalPaid;
        result["_anotherFareTienKhach"] = 0;
        result["_nameAnotherFareTienKhach"] = "";
        result["_feeTienKhach"] = 0;
        result["_nameFeeTienKhach"] = "";
        // parse thông tin tiền khách
        if (cTrip.PassengerMoney != null) {
            var i = cTrip.PassengerMoney.indexOf('~');
            var passengerMoneys = cTrip.PassengerMoney.substr(i, cTrip.PassengerMoney.length).split('|');
            //result["_mainFareTienKhach"] = passengerMoneys[0].toNum();
            var splitLv1 = passengerMoneys[1].split('##');
            result["_nameAnotherFareTienKhach"] = splitLv1[0] != null ? splitLv1[0] : '';
            result["_anotherFareTienKhach"] = splitLv1[1] != null ? splitLv1[1].toNum() : 0;
            var splitLv2 = passengerMoneys[2].split('##');
            result["_nameFeeTienKhach"] = splitLv2[0] != null ? splitLv2[0] : '';
            result["_feeTienKhach"] = splitLv2[1] != null ? splitLv2[1].toNum() : 0;
        }

        // parse thông tin các văn phòng nhận hàng

        result["_branchReceiveProduct"] = [];
        var branchProduct = self._data[self._cTripIndex].BranchReceiveProduct;
        if (branchProduct != null) {
            var li = branchProduct.indexOf('~');
            var branch = branchProduct.substr(li + 1, branchProduct.length).split('~');
            $.each(branch, function (lu, lo) {
                var los = lo.split('|');
                var di = {
                    _id: los[0],
                    _code: los[2]
                }
                result["_branchReceiveProduct"].push(di);
            });
        }

        // parse thông tin tiền hàng
        result["_numPickedProPaid"] = 0;
        result["_moneyPickedProPaid"] = 0;
        result["_numPickedProNotPaid"] = 0;
        result["_moneyPickedProNotPaid"] = 0;
        result["_branchProduct"] = [];
        result["_totalMoneyBranchNotPaid"] = 0;
        result["_totalMoneyBranchPaid"] = 0;
        result["_totalNumBranchNotPaid"] = 0;
        result["_totalNumBranchPaid"] = 0;
        result["_feeTienHang"] = 0;
        result["_nameFeeTienHang"] = "";
        if (cTrip.ProductMoney != null) {
            var j = cTrip.ProductMoney.indexOf('~');
            var productMoneys = cTrip.ProductMoney.substr(j + 1, cTrip.ProductMoney.length).split('~');
            // tiền hàng văn phòng ở vị trí 0
            // lưu theo nhiều văn phòng
            // BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid,BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid
            if (vIsEstStr(productMoneys[0])) {
                var branchs = productMoneys[0].split(',');
                $.each(branchs, function (o, v) {
                    var branchCode = v.substr(0, v.indexOf(':'));
                    var branchMoney = v.substr(v.indexOf(':') + 1, v.length);
                    var branchMoneys = branchMoney.split('##');
                    var branchMoneyPaids = branchMoneys[0].split('|');
                    var branchMoneyNotPaids = branchMoneys[1].split('|');
                    var d = {
                        _branchCode: branchCode,
                        _numBranchProPaid: branchMoneyPaids[0].toNum(),
                        _moneyBranchProPaid: branchMoneyPaids[1].toNum(),
                        _numBranchProNotPaid: branchMoneyNotPaids[0].toNum(),
                        _moneyBranchProNotPaid: branchMoneyNotPaids[1].toNum()
                    }
                    result["_branchProduct"].push(d);
                    result["_totalMoneyBranchNotPaid"] += branchMoneyNotPaids[1].toNum();
                    result["_totalMoneyBranchPaid"] += branchMoneyPaids[1].toNum();
                    result["_totalNumBranchNotPaid"] += branchMoneyNotPaids[0].toNum();
                    result["_totalNumBranchPaid"] += branchMoneyPaids[0].toNum();
                });
            }

            // tiền hàng dọc đường ở vị trí 1
            var pickedMoneys = productMoneys[1].split('##');
            var pickedMoneyPaids = pickedMoneys[0].split('|');
            var pickedMoneyNotPaids = pickedMoneys[1].split('|');
            result["_numPickedProPaid"] = pickedMoneyPaids[0].toNum();
            result["_moneyPickedProPaid"] = pickedMoneyPaids[1].toNum();
            result["_numPickedProNotPaid"] = pickedMoneyNotPaids[0].toNum();
            result["_moneyPickedProNotPaid"] = pickedMoneyNotPaids[1].toNum();

            // chi phí tiền hàng ở vị trí số 2
            var splitLv3 = productMoneys[2].split('##');
            result["_nameFeeTienHang"] = splitLv3[0] != null ? splitLv3[0] : '';
            result["_feeTienHang"] = splitLv3[1] != null ? splitLv3[1].toNum() : 0;
        }

        // parse thông tin chi phí
        result["_tollFee"] = 0;
        result["_washFee"] = 0;
        result["_eatFee"] = 0;
        result["_anotherFee"] = [];
        if (cTrip.FeeMoney != null) {
            var k = cTrip.FeeMoney.indexOf('~');
            var feeMoneys = cTrip.FeeMoney.substr(k + 1, cTrip.FeeMoney.length).split('~');
            // phí cầu đường ở vị trí số 0
            // phí rửa xe ở vị trí số 1
            // phí ăn ở vị trí số 2
            // các chi phí khác ở vị trí số 3
            result["_tollFee"] = feeMoneys[0].toNum();
            result["_washFee"] = feeMoneys[1].toNum();
            result["_eatFee"] = feeMoneys[2].toNum();
            var anotherFeeStr = feeMoneys[3];
            var anotherFees = anotherFeeStr.split('##');
            $.each(anotherFees, function (sa, sl) {
                var split1 = sl.split('|');
                var df = {
                    _index: split1[0],
                    _name: split1[1] == null ? "" : split1[1],
                    _money: split1[2] == null ? 0 : split1[2]
                }
                result["_anotherFee"].push(df);
            });
        }
        return result;
    },
    _resetAjaxRequest: function () {
        vRqz();
    },

    /************************************************************************
    * RENDER                                                                *
    *************************************************************************/
    _renderSeatTemplate: function () {
        var self = this;

        //var tInfo = self._getCurrentTripInfo();
        var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
        var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
        // parse vehicle info
        var vehicleNumber = "";
        var vehicleInfo = self._data[self._cTripIndex].Ts[self._cTripTime][0].V;
        if (typeof vehicleInfo != "undefined" && vehicleInfo != null) {
            var splitV = vehicleInfo.substr(vehicleInfo.indexOf('~') + 1, vehicleInfo.length).split('|');
            vehicleNumber = splitV[2];
        }

        self._clearSheet(); //Clear sheet
        var numSeat = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].NS;
        //Transform matrix for shown template
        var srule = null;
        if (typeof _dict._specialPos != "undefined" && typeof _dict._specialPos[numSeat] != "undefined") {
            srule = _dict._specialPos[numSeat];
        }

        var sMatrix = self._transformSeatMatrix(srule);
        //Show seat each on coach, each coach have max column (tplNumCol)
        var cIndex = 0;
        var hasBPermit = self._hasBookingPermission();
        var notallow = true;
        $.each(sMatrix, function (ix, cx) {
            if (typeof cx != "undefined") {
                //Create coach                
                var $c = self._createCoach(self._$sheet).addClass(_dict._g[self._numCoach - 1]).addClass('Trip-' + self._cTripId);
                if (self._numCoach > 1) {
                    $c.addClass(_dict._chcl[cIndex % 2]);
                }
                $.each(cx, function (jx, rx) {
                    if (typeof rx != "undefined") {
                        $.each(rx, function (kx, s) {
                            if (typeof s != "undefined" && s != null) {
                                //Current StageCode get from From-To Points
                                var ticket = s._getCurrentTicket();
                                var nTicketPerTrip = 0;
                                if (!$.isEmptyObject(ticket)) {
                                    if (!_dict._allowGroupByCode) {
                                        if (typeof self._cphoneSt[ticket._getDefaultPhoneNumber()] != "undefined") {
                                            nTicketPerTrip = self._cphoneSt[ticket._getDefaultPhoneNumber()].length;
                                        }
                                    } else {
                                        if (typeof self._cCodeSt[ticket._getTicketCode()] != "undefined") {
                                            nTicketPerTrip = self._cCodeSt[ticket._getTicketCode()].length;
                                        }
                                    }
                                }
                                var numOfStages = self._data[self._cTripIndex].StopPoints.data.length;
                                var isStageBooking = self._isStageBooking();
                                if (!self._allowBookAllSeat) {
                                    if (typeof self._allowedSeats[s._coach] != 'undefined' && typeof self._allowedSeats[s._coach][s._row] != 'undefined' && typeof self._allowedSeats[s._coach][s._row][s._col] != 'undefined') {
                                        notallow = false;
                                    }
                                    else {
                                        notallow = true;
                                    }
                                    if (app.cid != app.vid) notallow = !notallow;
                                }
                                else notallow = false;
                                var $seat = s._renderSeat(nTicketPerTrip, hasBPermit, self._cStageCode, numOfStages, self._data[self._cTripIndex].StopPoints, isStageBooking, self._cMaxStageCode, closedStatus, '', tripDetailId, vehicleNumber, notallow, self._cTripId, self._hasBookingPermissionByUsers());
                                if (app.fMoving) {
                                    var isMoving = false;
                                    $.each(app.movingStack, function (ii, v) {
                                        if (!isMoving) {
                                            var t = v._getCurrentTicket();
                                            if (t._id == ticket._id) {
                                                isMoving = true;
                                            }
                                        }
                                    });

                                    if (isMoving) {
                                        $seat.addClass(_dict._slc[0]);
                                    }
                                } else if (self._existingSeatStack(s)) {
                                    $seat.addClass('selected');
                                }

                                //Bind event on seat
                                if (s._isAvailable() && ((ticket._type != 2) || (ticket._type == 2 && app.rights.indexOf($.rights.bEdtOnlTic.val) >= 0))) {
                                    self._bindEventOnSeat($seat, s);
                                }
                                var seatTemplateId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['SeatTemplateId'];
                                if (_dict._specialNumColBySeatTemplateId != undefined && _dict._specialNumColBySeatTemplateId[seatTemplateId] != undefined) {
                                    $seat.addClass(_dict._g[_dict._specialNumColBySeatTemplateId[seatTemplateId] - 1]).addClass(_dict._sg[_dict._specialNumColBySeatTemplateId[seatTemplateId] - 1]).addClass(_dict._mg[_dict._specialNumColBySeatTemplateId[seatTemplateId] - 1]);
                                } else {
                                    $seat.addClass(_dict._g[_dict._tplNumCol - 1]).addClass(_dict._sg[_dict._tplNumCol - 1]).addClass(_dict._mg[_dict._tplNumCol - 1]);
                                }
                                $c.append($seat); //Append to row
                            }
                        });
                    }
                });
                cIndex++;
            }
        });
        self._bindNumStageTicketsTooltips();

        // kiểm tra nếu đang trong quá trình đổi vé, đặt thêm vé, đặt vé khứ hồi thì gán lại sự kiện con trỏ chuột
        if (app.fMoving) {
            self._bindEventMoving();
        } else if (app.hasCopyTicket) {
            vbf('onBindEventCopying'); // bind event when book more ticket
        } else if (app.hasBookReturnTicket) {
            vbf('onBindEventBookReturnTicket', { tId: self._getCTripId() }); // bind event when book return ticket
        }
    },
    _renderTripInfo: function () {
        var self = this;
        // đã chạy fTripGetTrip rồi nhưng nếu là lần đầu tiên load sẽ không load lại
        if (FlatObj.LFTime) {
            FlatObj.FTripGetTrip = true;
        }
        self._reloadData();
        self._$tripInfo.empty();
        FlatObj.cTripInfo = null;
        FlatObj.cTripInfo = self._getCurrentTripInfo(); // client cached to use in the next time
        var tInfo = FlatObj.cTripInfo;
        var data = { "trip": tInfo };
        var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['ClosedStatus'];
        var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['TripDetailId'];
        if (tripDetailId) {
            switch (closedStatus) {
                case 1:
                    //self._showHuyXuatBenButton();
                    self._hideXuatBenButton();
                    self._$tripInfo.html(vtpl(_dict._tInfoClosedTpl, data));
                    //console.log(rDepartTime);
                    break;
                case 2:
                    self._hideXuatBenButton();
                    self._$tripInfo.html(vtpl(_dict._tInfoChotPhoiTpl, data));
                    break;
                default:
                    self._showXuatBenButton();
                    self._$tripInfo.html(vtpl(_dict._tInfoTpl, data));
                    break;
            }
        } else {
            self._showXuatBenButton();
            self._$tripInfo.html(vtpl(_dict._tInfoTpl, data));
        }
        //} else {
        //    self._$tripInfo.html(vtpl(_dict._tInfoTpl, data));
        //}
        //console.log(self);

        // edited by Duy: remove MapAvaiSeat
        //vbf('fMapAvaiSeat', { value: self });
    },
    _clearSheet: function () {
        this._$sheet.empty();
    },
    _createNoSeat: function () {
        return $('<li />')
            .addClass('seat noseat');
    },
    _createSeatFromRecord: function (r) {
        var s = {};
        if (_dict._ts.indexOf(parseInt(r[2])) != -1) {
            s = new S(parseInt(r[5]), parseInt(r[6]), parseInt(r[7]), parseInt(r[0]), "seat", r[3], parseInt(r[2]));
        }
        return s;
    },
    _createTicketFromRecord: function (record) {
        var self = this;
        var status = parseInt(record[8]);
        var alias = parseInt(record[22]);
        if (alias == self._cTripBus) { //Alias
            var id = parseInt(record[0]);

            var issue = vPrsDt(record[5]);

            var pdate = vPrsDt(record[6]);

            var fare = parseInt(record[9]);
            if (isNaN(fare)) {
                fare = 0;
            }
            var note = record[10];
            var pInfo = record[11];
            var seri = record[12];
            var pmInfo = record[13];
            if (null == pmInfo) {
                pmInfo = "";
            }
            var hInfo = record[14];
            var code = record[15];
            var pcode = record[16];

            var fromValid = vPrsDt(record[17]);
            var toValid = vPrsDt(record[18]);
            var updatedDate = vPrsDt(record[19]);
            var aInfo = record[20];
            var surCharge = parseInt(record[21]);
            if (isNaN(surCharge)) {
                surCharge = 0;
            }
            var deposit = parseInt(record[26]);
            if (isNaN(deposit)) {
                deposit = 0;
            }
            var discount = parseInt(record[27]);
            if (isNaN(discount)) {
                discount = 0;
            }
            var debt = parseInt(record[29]);
            if (isNaN(debt)) {
                debt = 0;
            }
            var suser = record[23];
            var cuser = record[24];
            var stageCode = parseInt(record[25]);
            var tripId = parseInt(record[1]);

            var dept = vPrsDt(record[3]), cid = 0, cname = "", cphone = "";

            var ci = record[7];
            if (ci != null) {
                ci = ci.split('|');
                cid = parseInt(ci[2]);
                cname = ci[3];
                cphone = ci[4];
            }

            var fromArea = record[28];
            var toArea = record[29];

            var seatType = parseInt(record[30]);
            if (isNaN(seatType)) {
                seatType = 1;
            }
            var canceledDate = record[32];
            var cancelInfo = record[33];
            var type = record[34];
            var chargeDate = record[35];
            var sNote = record[36];
            var responUser = record[37];
            var porDate = record[38];
            var staffName = record[39];
            var cancelType = record[40];
            var numOfSend = record[41];
            var firstUserUpdated = record[42];
            var expiredTime = record[43];
            var printStatus = record[44];
            var issuedUser = record[45];
            var numOfPrint = record[46];
            var fromStop = record[47];
            var toStop = record[48];

            var re = new T(id, dept, cid, cname, cphone, status, issue, pdate, fare, note, pInfo, seri, pmInfo, hInfo, code, pcode, fromValid, toValid,
            updatedDate, aInfo, surCharge, suser, cuser, stageCode, tripId, deposit, discount, fromArea, toArea, seatType, debt, canceledDate, cancelInfo, type, chargeDate,
            sNote, responUser, porDate, staffName, cancelType, numOfSend, firstUserUpdated, expiredTime, printStatus, issuedUser, numOfPrint, fromStop, toStop);
            re.agentId = record[2];
            return re;
        }
        return {};
    },
    _createCoach: function (container) {
        var $r = $('<ul />').addClass('coach vbooking-coach')
            .appendTo(container);

        return $r;
    },
    _notFoundResult: function () {
        var self = this;

        $('<div />')
            .addClass(_dict._g[self._numCoach - 1])
            .append($('<div />').addClass('alert alert-danger')
                .html("<strong>Không tìm thấy chuyến.</strong>  Vui lòng chọn ngày giờ khác"))
            .appendTo(self._$sheet);
    },
    _renderCancelledTicket: function () {
        var self = this;
        if (self._c.length > 0) {
            self._$cancelSheet.append($('<h4 />').addClass('sheet-title').html('Vé đã hủy'));
            var cIndex = 0;
            var hasBPermit = self._hasBookingPermission();
            $.each(self._c, function (ix, cx) {
                if (typeof cx != "undefined" && cx != null) {
                    var $c = self._createCoach(self._$cancelSheet).addClass(_dict._g[self._numCoach - 1]);
                    if (self._numCoach > 1) {
                        $c.addClass(_dict._chcl[cIndex % 2]);
                    }
                    var chunk = _dict._tplNumCol;
                    $.each(cx, function (_, s) {
                        if (typeof s != "undefined" && s != null) {
                            var ticket = s._getCurrentTicket();
                            // không hiện các vé đặt online
                            if (ticket._type != 2) {
                                if (ticket._cancelType != 4) {
                                    var numOfStages = self._data[self._cTripIndex].StopPoints.data.length;
                                    var isStageBooking = self._isStageBooking();
                                    var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['ClosedStatus'];
                                    var realDepartureTime = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['RealDepartureTime'];
                                    var $seat = s._renderSeat(0, hasBPermit, self._cStageCode, numOfStages, self._data[self._cTripIndex].StopPoints, isStageBooking, self._cMaxStageCode, closedStatus, realDepartureTime, null, null, null, null, self._hasBookingPermissionByUsers())
                                        .addClass(_dict._g[chunk - 1]).addClass(_dict._sg[chunk - 1]).addClass(_dict._mg[chunk - 1]);

                                    if (app.fMoving) {
                                        var isMoving = false;
                                        $.each(app.movingStack, function (ii, v) {
                                            if (!isMoving) {
                                                var t = v._getCurrentTicket();
                                                if (t._id == ticket._id) {
                                                    isMoving = true;
                                                }
                                            }
                                        });

                                        if (isMoving) {
                                            $seat.addClass(_dict._slc[0]);
                                        }
                                    }
                                    //Bind event on seat
                                    self._bindEventOnSeat($seat, s);
                                    $c.append($seat); //Append to row
                                }
                            }
                        }
                    });
                    cIndex++;
                }
            });
        }
        // kiểm tra nếu đang trong quá trình đổi vé, đặt thêm vé, đặt vé khứ hồi thì disable các event trên ghế
        if (app.hasCopyTicket || app.hasBookReturnTicket) {
            $('#bksContent div.vbooking-csheet').find('ul.vbooking-coach li.seat').unbind('click');
            $('#bksContent div.vbooking-csheet').find('ul.vbooking-coach li.seat button').prop('disabled', true);
        }
    },
    _renderNotComeTicket: function () {
        var self = this;
        if (self._nc.length > 0) {
            self._$notComeSheet.append($('<h4 />').addClass('sheet-title').html('Hành khách không đến'));
            var cIndex = 0;
            var hasBPermit = self._hasBookingPermission();
            $.each(self._nc, function (ix, cx) {
                if (typeof cx != "undefined" && cx != null) {
                    var $c = self._createCoach(self._$notComeSheet).addClass(_dict._g[self._numCoach - 1]);
                    if (self._numCoach > 1) {
                        $c.addClass(_dict._chcl[cIndex % 2]);
                    }
                    var chunk = _dict._tplNumCol;
                    $.each(cx, function (_, s) {
                        if (typeof s != "undefined" && s != null) {
                            var numOfStages = self._data[self._cTripIndex].StopPoints.data.length;
                            var isStageBooking = self._isStageBooking();
                            var $seat = s._renderSeat(0, hasBPermit, self._cStageCode, numOfStages, self._data[self._cTripIndex].StopPoints, isStageBooking, self._cMaxStageCode).addClass(_dict._g[chunk - 1]).addClass(_dict._sg[chunk - 1]).addClass(_dict._mg[chunk - 1]);
                            //Bind event on seat
                            self._bindEventOnSeat($seat, s);
                            $c.append($seat);
                        }
                    });
                    cIndex++;
                }
            });
        }
    },
    _renderCanceledTrip: function () {
        var me = this;
        me._$sheet.empty();
        var $canceledTrip = "<div class='cancelled-trip'>Không có chuyến xe nào trong ngày đã chọn. Vui lòng chọn ngày khác để đặt vé.</div>";
        me._$sheet.append($canceledTrip);
    },


    /************************************************************************
    * FORM                                                                  *
    *************************************************************************/
    _createForm: function (id, elements, cl, gl) {
        var self = this;
        var $f = $('<form />').attr('id', id).attr('role', 'form');
        if (typeof cl != "undefined") {
            $f.addClass(cl);
        }
        var els = [];
        var elhs = [];
        var maxRow = 0;
        var maxCol = 0;
        $.each(elements, function (_, el) {
            var row = el[0];
            var col = el[1];

            if (el[4] == "hidden") {
                elhs.push(el);
            } else {
                if (typeof els[row - 1] == "undefined") {
                    els[row - 1] = [];
                }
                if (typeof els[row - 1][col - 1] == "undefined") {
                    els[row - 1][col - 1] = [];
                }
                els[row - 1][col - 1].push(el);
            }
            if (maxRow < row) {
                maxRow = row;
            }
            if (maxCol < col) {
                maxCol = col;
            }
        });

        //Hidden element
        $.each(elhs, function (jx, he) {
            if (typeof he != "undefined") {
                var $hi = self._createFormInput(he[4], he[5], he[7]).addClass(he[6]);
                if (!$.isEmptyObject(he[8])) { //attr
                    $.each(he[8], function (k, v) {
                        $hi.attr(k, v);
                    });
                }
                $f.append($hi);
            }
        });

        //Element
        var $ct = self._createFormContainer();
        $ct.append($('<div class="alert alert-danger message-error" role="alert" style="margin:5px 0 0 0;display:none;" />'));
        $ct.append($('<div class="row" />').css('margin-top', '0')
                .append($('<div class="col-md-12 checkbox-route-point" />'))
            );
        for (var i = 0; i < maxRow; i++) {
            if (typeof els[i] != "undefined") {
                var $r = self._createFormRow();
                for (var j = 0; j < maxCol; j++) {
                    var $c = self._createFormCol();
                    if (typeof els[i][j] != "undefined") {
                        //var gcol = "";
                        var hasGroupCol = false;
                        $.each(els[i][j], function (__, elm) {
                            var $label = self._createFormLabel(elm[2]);
                            if ($label.length > 0) {
                                $label.addClass('col-md-4 col-sm-4 col-xs-12 pl0');
                            }
                            var $ig = self._createFormInputGroup().addClass('col-md-8 col-sm-8 col-xs-12');
                            switch (elm[3]) {
                                case "input":
                                    var $i = self._createFormInput(elm[4], elm[5], elm[7], elm[8]).addClass(elm[6]);
                                    var $addon = self._createFormInputAddon(elm[10]);
                                    switch (elm[4]) {
                                        case 'checkbox':
                                        case 'radio':
                                            $i.append("&nbsp; " + elm[2]);
                                            $ig.addClass('col-md-offset-4 col-sm-offset-4');
                                            break;
                                        default:
                                            $c.append($label);
                                            break;
                                    }
                                    $c.append($ig.append($i).append($addon));
                                    break;
                                case "select":
                                    var options = elm[9];
                                    if (elm[5] == "PaymentType") {
                                        options = [];
                                        $.each(_dict._pm, function (_, v) {
                                            if (v[2] == 1) {
                                                var value = v[0];
                                                var text = v[1][_dict._lang];
                                                options.push({
                                                    Value: value,
                                                    Text: text
                                                });
                                            }

                                        });
                                    }
                                    var $s = self._createFormSelect(elm[5], options, elm[7], elm[4], elm[8]).addClass(elm[6]);
                                    $c.append($label).append($ig.append($s));
                                    break;
                                case "textarea":
                                    var $t = self._createFormTextArea(elm[5], elm[7], elm[8]).addClass(elm[6]);
                                    $c.append($label).append($ig.append($t));
                                    break;
                                case "p":
                                    var $p = self._createFormText(elm[7], elm[8]).addClass(elm[6]);
                                    $c.append($p);
                                    break;
                                case "button":
                                    var $b = self._createFormButton(elm[4], elm[8]).addClass(elm[6]).append(elm[10]).append(elm[5]);
                                    $c.append($b);
                                    break;
                            }

                            if (typeof elm[11] != "undefined" && elm[11].length > 0) {
                                var merge = elm[11][1] - elm[11][0];
                                $c.addClass(_dict._g[maxCol - merge - 1]).addClass(_dict._mg[maxCol - merge - 1]);
                                hasGroupCol = true;
                                j += merge;
                            }
                        });
                        if (!hasGroupCol) {
                            $c.addClass(_dict._g[maxCol - 1]).addClass(_dict._sg[maxCol - 1]).addClass(_dict._mg[maxCol - 1]);
                        }
                    }
                    $r.append($c);
                }
                $ct.append($r);
            }
        }

        return $f.append($ct);
    },
    _createFormContainer: function () {
        return $('<div />').addClass('container-fluid');
    },
    _createFormRow: function (cl) {
        return $('<div />').addClass('row');
    },
    _createFormCol: function () {
        return $('<div />');
    },
    _createFormLabel: function (label) {
        if ("" != label) {
            return $('<label />').addClass("col-sm-4 control-label").text(label);
        }
        return "";
    },
    _createFormInputGroup: function () {
        return $('<div />').addClass('input-group');
    },
    _createFormInput: function (type, name, value, attrs) {
        var $result = $();
        switch (type) {
            case "checkbox":
            case "radio":
                $result = $('<label />').append($('<input />', { type: type, name: name, value: value }));
                break;
            default:
                $result = $('<input />', { type: type, name: name, value: value });
                break;
        }
        if (!$.isEmptyObject($result) && typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $result.attr(k, v);
                });
            }
        }

        return $result;
    },
    _createFormInputAddon: function (i) {
        if ("" != i) {
            return $('<div />').addClass('input-group-addon').append(i);
        }
        return "";
    },
    _createFormSelect: function (name, options, value, text, attrs) {
        var $s = $('<select />', { name: name });
        $s.append($('<option />', { value: "" }).text(text));
        $.each(options, function (_, opt) {
            $s.append($('<option />', { value: opt.Value }).text(opt.Text));
        });
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $s.attr(k, v);
                });
            }
        }
        return $s;
    },
    _createFormTextArea: function (name, text, attrs) {
        var $t = $('<textarea />', { name: name }).val(text);
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $t.attr(k, v);
                });
            }
        }
        return $t;
    },
    _createFormButton: function (type, attrs) {
        var $b = $('<button />', { type: type });
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $b.attr(k, v);
                });
            }
        }
        return $b;
    },
    _createFormText: function (text, attrs) {
        var $p = $('<p />').text(text);
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $p.attr(k, v);
                });
            }
        }
        return $p;
    },
    _resetForm: function (form) {
        form.find("input[type=hidden]").val("");
        form.find("input[type=text], textarea, select").val("");
        form.find("input[type=checkbox]").prop('checked', false);
        form.find("input[type=radio]").prop('checked', false);
        form.find('div.has-error').removeClass('has-error');
        form.find('div.search-result').remove();
    },
    _convertFormDataToObj: function (form) {
        var self = this;
        var paramObj = {};
        var disabled = null;
        if (app.hasCopyTicket || app.hasBookReturnTicket) {
            disabled = $(form).find(':input:disabled').removeAttr('disabled');
        }
        $.each($(form).serializeArray(), function (_, kv) {
            paramObj[kv.name] = kv.value;
        });
        if ((app.hasCopyTicket || app.hasBookReturnTicket) && disabled) {
            disabled.attr('disabled', 'disabled');
        }
        return paramObj;
    },
    _getDepartureTime: function () {
        var self = this;
        var departureTime = self._cTripDate;
        var ts = self._cTripTime.split(':');
        if (isNaN(parseInt(ts[0])) || isNaN(parseInt(ts[1]))) return {};
        departureTime.setHours(parseInt(ts[0]));
        departureTime.setMinutes(parseInt(ts[1]));
        return departureTime;
    },
    _getCustomer: function (cid, cname, cphone) {
        return $.trim('1|1|' + cid + '|' + cname + '|' + cphone);
    },
    _getPayment: function (key, text, code) {
        return $.trim(key + ':' + text + ':' + code);
    },
    _getHistory: function (action, data) {
        var self = this;
        var history = [self.options.cid, self.options.aid, self.options.uid, self.options.un, new Date().addMinutes(self._sOffsetMinute).toFormatString('iso'), action];
        history.push(JSON.stringify(data));

        return history.join('##');
    },
    //_getCurrentFareById: function (fromId, toId) {
    //    var self = this;
    //    //if (app.oRights["StageEnable"]) {
    //    //    var fares = self._parseFares();
    //    //    var key = fromId + "|" + toId;
    //    //    var fare = fares[key];
    //    //    if (typeof fare == "undefined") return 0;
    //    //    return fare;
    //    //} else {
    //    //    return self._getCurrentFare();
    //    //}

    //    var fares = self._parseFares();
    //    var key = fromId + "|" + toId;
    //    var fare = fares[key];
    //    if (typeof fare == "undefined") return 0;
    //    return fare;

    //},
    _getFareQuickBook: function (fromId, toId) {
        var self = this;
        var fares = self._parseFares();
        var key = fromId + "|" + toId;
        var fare = fares[key];
        if (typeof fare == "undefined") return 0;
        return fare;
    },
    _parseFares: function () {
        var self = this;
        var from = "";
        var to = "";
        var fare = 0;
        var fif = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].F;
        if (typeof fif != "undefined" && vIsEstStr(fif) && fif.length > 1) {
            var fInfo = fif.split('~');
            var len = fInfo.length;
            var fares = [];
            for (var i = 1; i < len; i++) {
                from = fInfo[i].split('|')[0];
                to = fInfo[i].split('|')[1];
                fare = parseInt(fInfo[i].split('|')[2]);
                fares[from + "|" + to] = isNaN(fare) ? 0 : fare;
            }
            return fares;
        } else {
            return [];
        }
    },

    _getCurrentFare: function () {
        var self = this;
        var fare = 0;
        var fInfo = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].F.split('~');
        if (fInfo.length > 0) {
            fare = parseInt(fInfo[1].split('|')[2]);
            if (isNaN(fare)) {
                fare = 0;
            }
        }
        return fare;
    },
    _getBranchInfo: function (bid) {
        var result = "";
        $.each(app.branchInfo, function (_, b) {
            if (result == "") {
                if (bid == b[0]) {
                    result = b.join('|');
                }
            }
        });
        if (result == "") {
            result = [app.aid, app.aite, app.aice, app.aisne, '', ''].join('|');
        }
        return result;
    },
    _getAgentInfo: function () {
        var self = this;
        return $.trim(self.options.aid + "|" + self.options.aite + "|" + self.options.aice + '|' + self.options.aisne);
    },
    _getPickupInfo: function (p, t, index) {
        if (typeof p == "undefined") {
            p = "";
        }
        if (typeof t == "undefined") {
            t = "";
        }
        if (typeof index == "undefined") {
            t = "";
        }
        return $.trim(p + '|' + t + "|" + index);
    },
    _createHistoryForm: function () {
        var self = this;
        return $('<div />').addClass('container-fluid')
            .append($('<div />').addClass('row history-row')
                .append($('<div />').addClass('col-sm-12')
                    .append($('<table />').addClass('table table-striped table-hover table-condensed')
                        .append($('<thead>')
                            .append($('<tr />')
                                .append($('<th />').text("NV"))
                                .append($('<th />').text("Tác vụ"))
                                .append($('<th />').text("Ngày"))
                                .append($('<th />').text("Cập nhật"))
                            )
                        )
                        .append($('<tbody />'))
                    )
                )
            )
            .append($('<div />').addClass('row action-row')
                .append($('<div />').addClass('col-md-12 list-btn')
                    .append(self._createFormButton('button').addClass('btn btn-default btn-close').text('Đóng')
                    )
                )
            );
    },
    _getTripById: function (id) {
        var self = this;
        var found = null;
        $.each(self._data, function (_, t) {
            if (found == null) {
                if (id == t.Id) {
                    found = t;
                }
            }
        });
        return found;
    },

    /************************************************************************
    * TABLE                                                                 *
    *************************************************************************/
    _createTable: function () {
        return $('<table />');
    },
    _createTableRow: function () {
        return $('<tr />');
    },
    _createTableCol: function (colspan) {
        var $td = $('<td />');
        if (colspan > 1) {
            $td.attr('colspan', colspan);
        }
        return $td;
    },
    _createTableHead: function () {
        return $('<thead />');
    },
    _createTableBody: function () {
        return $('<tbody />');
    },
    _createTableHeadCol: function (colspan) {
        var $th = $('<th />');
        if (colspan > 1) {
            $th.attr('colspan', colspan);
        }
        return $th;
    },

    /************************************************************************
    * MATRIX                                                                *
    *************************************************************************/
    _transformSeatMatrix: function (srule) {
        var self = this;
        var numCoach = 0;
        var numRow = 0;
        var numCol = 0;
        var result = [];
        self._printStageTickets = [];
        $.each(self._m, function (ix, vc) {
            if (typeof vc != "undefined") {
                $.each(vc, function (ir, vr) {
                    if (typeof vr != "undefined") {
                        $.each(vr, function (icl, s) {

                            if (typeof s != "undefined" && s != null && _dict._ts.indexOf(s._type) != -1) {
                                if (s._tickets && s._tickets.length >= 1) {
                                    var len = s._tickets.length;
                                    for (var i = 0; i < len; i++) {
                                        s._tickets[i]["seatLabel"] = s._label;
                                        self._printStageTickets.push(s._tickets[i]);
                                    }

                                }
                                var hash = s._coach + "_" + s._row + "_" + s._col;
                                if (srule != null && srule.hasOwnProperty(hash)) {
                                    var np = srule[hash];
                                    if (typeof result[np[0] - 1] == "undefined") {
                                        result[np[0] - 1] = [];
                                    }
                                    if (typeof result[np[0] - 1][np[1] - 1] == "undefined") {
                                        result[np[0] - 1][np[1] - 1] = [];
                                    }
                                    result[np[0] - 1][np[1] - 1][np[2] - 1] = s;
                                } else {
                                    if (typeof result[ix] == "undefined") {
                                        result[ix] = [];
                                    }
                                    if (typeof result[ix][ir] == "undefined") {
                                        result[ix][ir] = [];
                                    }
                                    result[ix][ir][icl] = s;
                                }
                            }
                        });
                    }
                });
            }
        });

        return result;
    },

    _responsiveDevice: function () {
        var me = this;
        me.adjustStyle($(window).width());
        $(window).resize(function () {
            me.adjustStyle($(window).width());
        });
    },

    adjustStyle: function (width) {
        width = parseInt(width);
        if (width <= 480) {
            $('.vbooking-sheet .seat').removeClass('col-xs-6').addClass('col-xs-12');
            $('.vbooking-csheet .seat').removeClass('col-xs-6').addClass('col-xs-12');
        } else {
            $('.vbooking-sheet .seat').removeClass('col-xs-12').addClass('col-xs-6');
            $('.vbooking-csheet .seat').removeClass('col-xs-12').addClass('col-xs-6');
        }
    },
    /************************************************************************
    * EVENT                                                                 *
    *************************************************************************/
    _resetAll: function (cb) {
        var self = this;
        $._resetCopyInfo();
        vbf('onUnbindEventCopying'); // unbind event book more ticket
        vbf('resetSeatStack'); // Reset seat stack
        vbf('onResetMovingStack'); // reset moving stack
        vbf('onUnbindEventMoving'); // unbind event moving
        vbf('onClearSelectedItem'); // Clear selected items
        vbf('onCloseUpdateForm'); // Close update form
        //self._closeCancelDialog();
        vbf('onCloseCancelForm');
        //self._closeQuickBookForm();
        vbf('onCloseQBook');
        //self._closeErrorDialog();
        vbf('onCloseErrorForm');
        //self._clearSearchResult();
        vbf('onClearSuggestCustomer', { f: $('#UpdateForm') }); // clear suggest customer
        app.selectedPhone = "";
        app.selectedCode = "";
        app.ctrlOn = false;
        self._closeHistoryLog();
        $._resetBookReturnInfo();
        //self._unbindEventBookReturnTicket();
        vbf('onUnbindEventBookReturnTicket'); // Unbind event when book return ticket
        var afRe = function () {
            if (cb != undefined) cb.call();
        }
        self._reloadSheet(afRe);
    },
    _bindEventOnSeat: function (obj, seat) {
        var me = this;
        if (me._hasBookingPermission()) {
            //Perform action on click whole seat if seat is available
            var tk = seat._getCurrentTicket();
            if (!$.isEmptyObject(tk) && tk._isCancelled()) {
                vev(obj, 'mouseenter', function (e) {
                    $(obj).attr("data-original-title", tk._cancelInfo).attr("data-toggle", "tooltip").attr("data-placement", "top").tooltip('show');
                });
                vev(obj, 'mouseleave', function (e) {
                    $(obj).attr('data-original-title', '').attr('data-toggle', "").attr('data-placement', "").tooltip('hide');
                });
            }
            vev(obj, 'click', function (e) {//click len ghe
                if (seat.disableClickEvent) return;
                e.preventDefault();
                e.stopPropagation();
                if (seat._isAvailable()) {
                    if (!seat._hasTicket()) {
                        if (app.fMoving) {
                            vbf('onMovingTicket', { // moving ticket
                                seat: seat,
                                tId: me._cTripId,
                                tName: me._data[me._cTripIndex].Name,
                                tDate: me._getDepartureTime(),
                                tBus: me._cTripBus,
                                tStage: me._cStageCode,
                                fromId: vIsEstStr(me._cDefaultFromId) ? me._cDefaultFromId : me._cFromId,
                                toId: vIsEstStr(me._cDefaultToId) ? me._cDefaultToId : me._cToId,
                                stopPoints: me._data[me._cTripIndex].StopPoints
                            });
                        }
                    } else {
                        if (!app.fMoving) {
                            if (e.ctrlKey) {
                                me._updateSeatStack(obj, seat); //dua ghe vo stack
                                app.ctrlOn = true;
                            } else {
                                var index = app.seatStack.indexOf(seat);
                                if (index != -1) {
                                    me._removeFromSeatStack(obj, seat, index);
                                } else {
                                    var t = seat._getCurrentTicket();
                                    if (t._type == 2) {
                                        vbf('showErrorForm', { message: _dict._err[8] }); // Show error form
                                    } else {
                                        if (!_dict._allowGroupByCode) {
                                            var cphone = t._getDefaultPhoneNumber ? t._getDefaultPhoneNumber() : "";
                                            if (app.selectedPhone != cphone) {
                                                vbf('resetSeatStack'); // Reset seat stack
                                                vbf('onClearSelectedItem'); // Clear selected items
                                            }
                                            if (vIsEstStr(cphone) && !t._isNotCome() && !t._isCancelled()) {
                                                me._search(cphone);
                                            } else {
                                                me._updateSeatStack(obj, seat);
                                            }
                                            app.selectedPhone = cphone;
                                        }
                                        else {
                                            /**********************************************
                                            * Group by code
                                            **********************************************/
                                            var cCode = t._getTicketCode() ? t._getTicketCode() : "";
                                            if (app.selectedCode != cCode) {
                                                vbf('resetSeatStack'); // Reset seat stack
                                                vbf('onClearSelectedItem'); // Clear selected items
                                            }
                                            if (vIsEstStr(cCode) && !t._isNotCome() && !t._isCancelled()) {
                                                me._search(cCode, true);
                                            } else {
                                                me._updateSeatStack(obj, seat);
                                            }
                                            app.selectedCode = cCode;
                                        }
                                    }
                                }
                                app.ctrlOn = false;
                            }
                        }
                    }
                }
            });
            //Perform event on button
            $.each(obj.find('button'), function (i, b) {
                var type = $(b).attr('data-type');
                switch (type) {
                    case "book":
                        vev(b, 'click', function (e) {
                            //$($(b).parents()[2]).addClass("waiting");
                            if (!app.fMoving) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!_dict._allowGroupByCode) {
                                    if (app.selectedPhone != "") {
                                        vbf('resetSeatStack'); // Reset seat stack
                                        me._clearSelectedItem();
                                        app.selectedPhone = "";
                                        app.ctrlOn = false;
                                    }
                                }
                                else {
                                    if (app.selectedCode != "") {
                                        vbf('resetSeatStack'); // Reset seat stack
                                        me._clearSelectedItem();
                                        app.selectedCode = "";
                                        app.ctrlOn = false;
                                    }
                                }
                                oRq.cEl = $(this);
                                oRq.cLType = 1;
                                oRq.cKey = seat._label;
                                oRq.cAType = 2;
                                oRq.iAc = true;
                                me._fakeBookedSeat(this, seat);
                                //self._bookSeat(obj, seat);
                                vbf('onBookTicket', {
                                    seat: seat,
                                    tData: {
                                        cTripBus: me._cTripBus,
                                        cStageCode: me._cStageCode,
                                        cTripId: me._cTripId,
                                        cFromId: me._cFromId,
                                        cToId: me._cToId,
                                        cDefaultFromId: me._cDefaultFromId,
                                        cDefaultToId: me._cDefaultToId,
                                        cTripIndex: me._cTripIndex,
                                        data: me._data,
                                        cTripTime: me._cTripTime,
                                        cTripDate: me._cTripDate
                                    }
                                });
                            } else {
                                vbf('showErrorForm', { message: _dict._err[3] }); // Show error form
                            }
                        });
                        break;
                    case "move":
                        vev(b, 'click', function (e) {
                            if (app.hasCopyTicket) {
                                e.preventDefault();
                                e.stopPropagation();
                                vbf('showErrorForm', { message: _dict._err[5] }); // Show error form
                                vbf('onClearSelectedItem'); // Clear selected items
                            } else if (app.hasBookReturnTicket) {
                                e.preventDefault();
                                e.stopPropagation();
                                vbf('showErrorForm', { message: _dict._err[6] }); // Show error form
                                vbf('onClearSelectedItem'); // Clear selected items
                            } else {
                                app.isBooking = false;
                                if (!app.fMoving) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var t = seat._getCurrentTicket();
                                    if (!_dict._allowGroupByCode) {  //group by phone
                                        if (app.selectedPhone != t._cphone && !app.ctrlOn) {
                                            vbf('resetSeatStack'); // Reset seat stack
                                            vbf('onClearSelectedItem'); // Clear selected items
                                        }
                                        app.selectedPhone = t._cphone;
                                    } else { //group by code
                                        var tCode = t._code == null ? "" : t._code;
                                        if (app.selectedCode != tCode && !app.ctrlOn) {
                                            vbf('resetSeatStack'); // Reset seat stack
                                            vbf('onClearSelectedItem'); // Clear selected items
                                        }
                                        app.selectedCode = tCode;
                                    }
                                    if (app.seatStack.indexOf(seat) == -1) {
                                        me._addToSeatStack(obj, seat);
                                    }
                                    vbf('onMaskMovingTicket', { // moving ticket
                                        tId: me._cTripId,
                                        tName: me._data[me._cTripIndex].Name,
                                        tDate: me._getDepartureTime()
                                    });
                                } else {
                                    if (!$._isInMovingStack(seat)) vbf('showErrorForm', { message: _dict._err[3] }); // Show error form
                                }
                            }
                        });
                        break;
                    case "update":
                        vev(b, 'click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var ticket = seat._getCurrentTicket();
                            if (!_dict._allowGroupByCode) {  //group by phone
                                if (app.selectedPhone != ticket._cphone && !app.ctrlOn) {
                                    vbf('resetSeatStack'); // Reset seat stack
                                    vbf('onClearSelectedItem'); // Clear selected items
                                }
                                app.selectedPhone = ticket._cphone;
                            }
                            else { //group by code
                                var tCode = ticket._code == null ? "" : ticket._code;
                                if (app.selectedCode != tCode && !app.ctrlOn) {
                                    vbf('resetSeatStack'); // Reset seat stack
                                    vbf('onClearSelectedItem'); // Clear selected items
                                }
                                app.selectedCode = tCode;
                            }
                            var seatStack = app.seatStack, lIds = [];
                            if (seatStack.indexOf(seat) == -1) {
                                me._addToSeatStack(obj, seat);
                            }
                            $.each(seatStack, function (is, vs) {
                                var tic = vs._getCurrentTicket();
                                if (!$.isEmptyObject(tic)) lIds.push(tic._id);
                            });
                            var ogt = { _a: 'fGetInfoTickets', ticketIds: lIds.join(",") }
                            var cb = function (u, r, l, t) {
                                if (u != 1) return;
                                var lNewTic = {};
                                $.each(r[0], function (intk, vntk) {
                                    var nTic = me._createTicketFromRecord(vntk);
                                    if (!$.isEmptyObject(nTic) && $.isEmptyObject(lNewTic[nTic._id])) lNewTic[nTic._id] = nTic;
                                });
                                // edited by Duy: block event enter key when ticket has status = 3
                                var blockEnterEvent = false;
                                $.each(seatStack, function (iss, vss) {
                                    var $seat = $('#bksContent').find('li.seat[data-position="' + vss._coach + '_' + vss._row + '_' + vss._col + '"]');
                                    var $fChild = $seat.find('div.paid, div.booking, div.pass');
                                    var tick = vss._getCurrentTicket();
                                    if (tick._status == 3) blockEnterEvent = true;
                                    var newTick = lNewTic[tick._id];
                                    if (!$.isEmptyObject(newTick)) {
                                        vss._tickets = [];
                                        vss._addTicket(lNewTic[tick._id], me._cStageCode, tick.stageCode);
                                        if ($fChild.length == 1) {
                                            switch (newTick._status) {
                                                case 2:
                                                    $fChild.removeClass();
                                                    $fChild.addClass('paid');
                                                    break;
                                                case 5:
                                                    $fChild.removeClass();
                                                    $fChild.addClass('pass');
                                                    break;
                                                case 1:
                                                    if (vIsEstStr(newTick._code)) {
                                                        $fChild.removeClass();
                                                        $fChild.addClass('fbooking').addClass('booking');
                                                    } else {
                                                        $fChild.removeClass();
                                                        $fChild.addClass('booking');
                                                    }
                                                    break;
                                                case 3:
                                                    blockEnterEvent = true;
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    }
                                });
                                app.isBooking = false;
                                app.seatStack = seatStack;
                                if (!app.fMoving) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    vbf('showUpdateForm', { self: me, obj: obj, seat: seat, blockEnterEvent: blockEnterEvent });
                                } else {
                                    if ($._isInMovingStack(seat)) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        vbf('resetSeatStack'); // Reset seat stack
                                        $.each(app.movingStack, function (iv, v) {
                                            app.seatStack.push(v);
                                            app.seatStack.push(v);
                                        });
                                        vbf('onResetMovingStack'); // reset moving stack
                                        vbf('showUpdateForm', { self: self, obj: obj, seat: seat, blockEnterEvent: blockEnterEvent }); // Show update form
                                    } else {
                                        vbf('showErrorForm', { message: _dict._err[3] }); // Show error form
                                    }
                                }
                            }
                            vRqs(ogt, cb);
                        });
                        break;
                    case "quick-pay":
                        vev(b, 'click', function (e) {
                            var errFare = false;
                            if (app.hasCopyTicket) {
                                vbf('showErrorForm', { message: _dict._err[5] }); // Show error form
                            } else {
                                e.preventDefault();
                                e.stopPropagation();
                                if (app.seatStack.length == 0) {
                                    me._updateSeatStack(obj, seat);
                                }
                                $.each(app.seatStack, function (_, it) {
                                    var tic = it._getCurrentTicket();
                                    if (tic._fare == 0) {
                                        errFare = true;
                                        vbf('showErrorForm', { message: _dict._err[7] }); // Show error form
                                    }
                                });
                                if (!errFare) {
                                    vbf('onQuickPayTicket', { // quick pay ticket
                                        tId: me._cTripId,
                                        tName: me._data[me._cTripIndex].Name,
                                        tDate: me._getDepartureTime(),
                                        tBus: me._cTripBus,
                                        sOffsetMinute: me._sOffsetMinute
                                    });
                                }

                            }
                        });
                        break;
                    case "quick-book":
                        vev(b, 'click', function (e) {
                            if (app.hasCopyTicket) {
                                vbf('showErrorForm', { message: _dict._err[5] }); // Show error form
                            } else {
                                var seatStack = app.seatStack;
                                me._reloadSheet();
                                app.isBooking = false;
                                //self._$updateForm.find('div.alert-message').remove();
                                app.seatStack = seatStack;
                                if (!app.fMoving) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var t = seat._getCurrentTicket();
                                    if (!_dict._allowGroupByCode) {  //group by phone
                                        if (app.selectedPhone != t._cphone && !app.ctrlOn) {
                                            vbf('resetSeatStack'); // Reset seat stack
                                            me._clearSelectedItem();
                                        }
                                    }
                                    else { //group by code
                                        var tCode = t._code == null ? "" : t._code;
                                        if (app.selectedCode != tCode && !app.ctrlOn) {
                                            vbf('resetSeatStack'); // Reset seat stack
                                            me._clearSelectedItem();
                                        }
                                    }
                                    if (app.seatStack.indexOf(seat) == -1) {
                                        me._addToSeatStack(obj, seat);
                                    }
                                    //me._showQuickBookForm(obj, seat);
                                    vbf('onShowQBook', {
                                        tData: {
                                            cTripBus: me._cTripBus,
                                            cStageCode: me._cStageCode,
                                            cTripId: me._cTripId,
                                            cFromId: me._cFromId,
                                            cToId: me._cToId,
                                            cDefaultFromId: me._cDefaultFromId,
                                            cDefaultToId: me._cDefaultToId,
                                            cTripIndex: me._cTripIndex,
                                            data: me._data,
                                            cTripTime: me._cTripTime,
                                            cTripDate: me._cTripDate,
                                            tInfo: me._getCurrentTripInfo(),
                                            cTrip: me._data[me._cTripIndex],
                                            tName: me._data[me._cTripIndex].Name,
                                            tDate: me._getDepartureTime()
                                        }
                                    });
                                } else {
                                    if ($._isInMovingStack(seat)) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        vbf('resetSeatStack', {}, function () {
                                            $.each(app.movingStack, function (iv, v) {
                                                app.seatStack.push(v);
                                            });
                                            vbf('onResetMovingStack'); // reset moving stack
                                        }); // Reset seat stack
                                        vbf('onShowQBook', {
                                            tData: {
                                                cTripBus: me._cTripBus,
                                                cStageCode: me._cStageCode,
                                                cTripId: me._cTripId,
                                                cFromId: me._cFromId,
                                                cToId: me._cToId,
                                                cDefaultFromId: me._cDefaultFromId,
                                                cDefaultToId: me._cDefaultToId,
                                                cTripIndex: me._cTripIndex,
                                                data: me._data,
                                                cTripTime: me._cTripTime,
                                                cTripDate: me._cTripDate
                                            }
                                        });
                                    } else {
                                        //self._showError(_dict._err[3]);
                                        vbf('showErrorForm', { message: _dict._err[3] }); // Show error form
                                    }
                                }
                            }

                            //if (app.hasCopyTicket) {
                            //    self._showError(_dict._err[5]);
                            //} else {
                            //    e.preventDefault();
                            //    e.stopPropagation();
                            //    if (app.seatStack.indexOf(seat) == -1) {
                            //        self._addToSeatStack(obj, seat);
                            //    }
                            //    self._showQuickBookForm(obj, seat);
                            //}
                        });
                        break;
                    default:
                        break;
                }
            });
        }
    },
    _bindEventOnSheet: function () {
        var me = this;
        $(document).keyup(function (e) {
            if (e.keyCode == 27) { //ESC
                me._resetAll();
            }
        });

        $('ul.vbooking-list a').click(function (e) {
            e.preventDefault();
            $('ul.vbooking-list a').closest('li').removeClass('active');
            var dtab = $(this).attr('data-tab');
            $('ul.vbooking-list').closest('div.danhsach').find('button').html($(this).text() + '&nbsp;<span class="caret"></span>');
            $(this).tab('show');
            switch (dtab) {
                case 'bks':
                    $('#bksContent').css("display", '');
                    $('#report').css("display", 'none');//.empty();
                    $('#product-content').css("display", 'none');
                    break;
                case 'vopen':
                    me._reloadVO();
                    break;
                case 'vvalid':
                    me._reloadVV();
                    break;
                case 'vcancelled':
                    //self._reloadVC();
                    vbf('onShowVC', {
                        td: {
                            _cTripBus: me._cTripBus,
                            _numCoach: me._numCoach
                        }
                    });
                    break;
            }
        });

        vev('#FilterForm .btn-filter button.btn-ui', 'click', function () {
            $('#FilterForm .btn-filter button').removeClass('active');
            $('button.btn-thong-ke').removeClass('active');
            $(this).addClass('active');
            if ($(this).hasClass('btn-grid')) {
                me._grid = true;
            } else {
                me._grid = false;
            }
            me._isOrderring = false;
            me._reloadSheet();
        });
    },
    _bindArrowEventList: function (li) {
        var liSelected;
        var ul = li.parent();
        var ulh = ul.height();
        var ulch = ul.prop('scrollHeight');
        var numScroll = 1;
        var numBScroll = Math.round(ulch / ulh) - 1;
        $(window).keydown(function (e) {
            if (e.which === 40) {
                if (liSelected) {
                    li.removeClass('selected');
                    var next = liSelected.next();
                    if (next.length > 0) {
                        liSelected = next.addClass('selected');
                    } else {
                        liSelected = li.eq(0).addClass('selected');
                    }
                } else {
                    liSelected = li.eq(0).addClass('selected');
                }
                if (liSelected.position().top < 0) {
                    ul.animate({ scrollTop: 0 }, 500);
                    numScroll = 1;
                } else if (liSelected.position().top > ulh) {
                    var t = Math.floor(ulh * numScroll) - 35;
                    ul.animate({ scrollTop: t }, 500);
                    numScroll++;
                }

            } else if (e.which === 38) {
                if (liSelected) {
                    li.removeClass('selected');
                    var prev = liSelected.prev();
                    if (prev.length > 0) {
                        liSelected = prev.addClass('selected');
                    } else {
                        liSelected = li.last().addClass('selected');
                    }
                } else {
                    liSelected = li.last().addClass('selected');
                }

                if (liSelected.position().top <= 0) {
                    var b = Math.floor(ulch - ulh * numBScroll) + 35;
                    ul.animate({ scrollTop: b }, 500);
                    numBScroll++;
                } else if (liSelected.position().top > ulh) {
                    ul.animate({ scrollTop: ulch }, 500);
                    numBScroll = Math.round(ulch / ulh) - 1;
                }

            }
            //else if (e.which === 13) {
            //    if (liSelected && liSelected.hasClass('selected')) {
            //        liSelected.trigger('click');
            //    }
            //}
        });
    },
    _updateCPhoneSt: function (seat, ticket) {
        var self = this;
        var cphone = ticket._getDefaultPhoneNumber();
        if (vIsEstStr(cphone)) {
            if (typeof self._cphoneSt[cphone] == "undefined") {
                self._cphoneSt[cphone] = [];
            }
            self._cphoneSt[cphone].push(seat);
        }
    },
    _updateCCodeSt: function (seat, ticket) {
        var self = this;
        var cCode = ticket._getTicketCode();
        if (vIsEstStr(cCode)) {
            if (typeof self._cCodeSt[cCode] == "undefined") {
                self._cCodeSt[cCode] = [];
            }
            self._cCodeSt[cCode].push(seat);
        }
    },
    //Update by Thanh
    _getLimitedDateByUsers: function () {
        var self = this;
        var d = new Date();
        return new Date(d.getTime() - _dict._limitedMinuteBeforeRole * 60000).addMinutes(self._sOffsetMinute);
    },

    _hasBookingPermissionByUsers: function () {
        var self = this;
        var p = true;
        if (self._getDepartureTime().getTime() < self._getLimitedDateByUsers().getTime()) {
            if (app.rights.indexOf($.rights.hbookingbyDate.val) != -1) {
                p = false;
            }
        }
        return p;
    },
    //end
    _getLimitedDate: function () {
        var self = this;
        var d = new Date();
        return new Date(d.getTime() - _dict._limitedMinuteBefore * 60000).addMinutes(self._sOffsetMinute);
    },
    _hasBookingPermission: function () {
        var self = this;
        var p = true;
        if (self._getDepartureTime().getTime() < self._getLimitedDate().getTime()) {
            if (app.rights.indexOf($.rights.bBookPastTk.val) == -1) {
                p = self._rBookingOnPast;
            }
        }
        return p;
    },
    _bindEventMoving: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat.selected').addClass('dotted-background');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-moving');
        });
    },
    _unbindEventMoving: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat').removeClass('dotted-background');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').removeClass('cursor-moving');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').unbind('mouseenter');
    },
    _bindEventCopying: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').not('ul.vbooking-coach li.seat div.fbooking').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-them-ve');
        });
        self._$sheet.find('ul.vbooking-coach li.seat div.paid, ul.vbooking-coach li.seat div.fbooking').closest('li.seat').unbind('click');
        self._$sheet.find('ul.vbooking-coach li.seat div.paid button, ul.vbooking-coach li.seat div.fbooking button').prop('disabled', true);
    },
    _unbindEventCopying: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').removeClass('cursor-them-ve');
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').unbind('mouseenter');
    },
    _bindEventBookReturnTicket: function () {
        var self = this;
        var currentTripId = self._getCTripId();
        var $tripId = self._$filterForm.find('select[name=TripId]');
        var $tripDate = self._$filterForm.find('input[name=DepartureDate]');
        var $tripTime = self._$filterForm.find('select[name=TimeSlot]');
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').not('ul.vbooking-coach li.seat div.fbooking').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-khu-hoi');
        });
        self._$sheet.find('ul.vbooking-coach li.seat div.paid button, ul.vbooking-coach li.seat div.fbooking button').prop('disabled', true);

        if (currentTripId == app.cBookReturnTripId) {
            self._$sheet.find('ul.vbooking-coach li.seat').unbind('click');
            self._$sheet.find('ul.vbooking-coach li.seat button').prop('disabled', true);
            $tripDate.prop('disabled', true);
            self._$filterForm.find('.glyphicon-calendar').parent().unbind('click');
            $tripTime.prop('disabled', true);
            if (app.hasBookReturnTicket) {
                if (!$tripId.hasClass('book-return')) {
                    $tripId.addClass('book-return');
                }
            }
        } else {
            self._$sheet.find('ul.vbooking-coach li.seat div.paid, ul.vbooking-coach li.seat div.fbooking').closest('li.seat').unbind('click');
            self._$sheet.find('ul.vbooking-coach li.seat div.available button').prop('disabled', false);
            $tripId.removeClass('book-return');
            $tripDate.prop('disabled', false);
            $tripTime.prop('disabled', false);
            self._bindEventOnCalendarIcon();
        }
    },
    _unbindEventBookReturnTicket: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat div.available').removeClass('cursor-khu-hoi');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').unbind('mouseenter');
        self._$sheet.find('ul.vbooking-coach li.seat div.available button').prop('disabled', false);
    },

    /************************************************************************
    * ERROR                                                                 *
    *************************************************************************/
    _showError: function (message) {
        var self = this;
        self._$emodal.find('.message').html(message);
        self._showEModal();
    },

    backupBKS: function (button) {
        var self = this;
        var obj = self._createBackUpBKSObj();
        var completeReload = function (u, r, l, t) {
            if (u != 1 || l <= 0) {
                return;
            }
            window.location.href = r;
            button.removeAttr('disabled');
        };
        //Submit query
        self._submitAsyncAction(obj, completeReload);
        //$.ajax({//Todo: replace with rq
        //    url: self.options.backupBaseUrl,
        //    type: 'post',
        //    contentType: 'application/json; charset: utf-8',
        //    data: JSON.stringify({ obj: obj }),
        //    crossDomain: true,
        //    success: function (durl) {
        //        window.location.href = durl;
        //        button.removeAttr('disabled');
        //        return false;
        //    },
        //    error: function (e) {
        //        alert("Không thể Lưu Phơi bây giờ.! Vui lòng thử lại sau.");
        //        button.removeAttr('disabled');
        //        return false;
        //    }
        //});
    },
    _createBackUpBKSObj: function () {
        var self = this;
        var d = new Date();
        var obj = {};
        obj._a = "bBackUpCustomerPerTrip";
        obj._c = {
            CompId: self.options.cid,
            UserId: self.options.uid,
            FromDate: d.toFormatString('iso')
        };

        return obj;
    },
    _bindNumStageTicketsTooltips: function () {
        var me = this;
        $(".so-chang,.chang-di").unbind().hover(function () {
            $(this).closest('.seat').find(".chang-di").css("display", "block");
        }, function () {
            $(this).closest('.seat').find(".chang-di").css("display", "none");

        });

        vev('.stage-ticket-context', 'click', function (e) {
            var fromId = $(this).attr('data-fromId');
            var toId = $(this).attr('data-toId');
            me.selectStage(fromId, toId);
            //console.log(me._changeCFromId);
        });
    },
    _cancelClosedStatus: function () {
        var self = this;
        var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
        var obj = {};
        obj._a = "UpTrip";
        obj._c = {
            Id: tripDetailId
        };
        obj._d = {
            ClosedStatus: 0
        };
        var completeRequest = function (u, r, l, t) {
            if (u == 1) {
                self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'] = 0;
                self._showXuatBenButton();
                self._reloadSheet();
            }
        };
        vRqs(obj, completeRequest);
    },
    _closedTrip: function () {
        var self = this;
        var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
        var tripInfo = self._getCurrentTripInfo();
        if (typeof tripDetailId == "undefined") {
            self._showPopModal("Chuyến chưa đặt vé, vui lòng kiểm tra lại.");
            return;
        }
        if (typeof _dict._driverInfoRequired != "undefined" && _dict._driverInfoRequired) {
            if (typeof _dict._fieldDriverInfoRequired != "undefined" && _dict._fieldDriverInfoRequired.indexOf("VehicleNumber") != -1) {
                if (tripInfo._vehicleNumber == "") {
                    self._showPopModal("Vui lòng điền thông tin xe trước khi xuất bến.");
                    return;
                }
            }
            if (typeof _dict._fieldDriverInfoRequired != "undefined" && _dict._fieldDriverInfoRequired.indexOf("DriverName") != -1) {
                if (tripInfo._driverName == "") {
                    self._showPopModal("Vui lòng điền thông tin tài trước khi xuất bến.");
                    return;
                }
            }
            if (typeof _dict._fieldDriverInfoRequired != "undefined" && _dict._fieldDriverInfoRequired.indexOf("AssistantName") != -1) {
                if (tripInfo._assistantName == "") {
                    self._showPopModal("Vui lòng điền thông tin phục vụ trước khi xuất bến.");
                    return;
                }
            }
        }
        var obj = {};
        obj._a = "UpTrip";
        obj._c = {
            Id: tripDetailId
        };
        obj._d = {
            ClosedStatus: 1,
        };
        var completeRequest = function (u, r, l, t) {
            if (u == 1) {
                //self._showPopModal("Xuất bến thành công.");
                self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'] = 1;
                self._showHuyXuatBenButton();
                self._reloadSheet();
            }
        };
        self._submitAction(obj, completeRequest);
    }
});
