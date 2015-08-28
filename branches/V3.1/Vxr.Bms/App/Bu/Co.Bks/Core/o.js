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
    _tgF: ["Id", "TripId", "AgentId", "TripDate", "SeatCode", "IssueDate", "PickupDate", "CustomerInfo", "Status", "Fare", "Note", "PickupInfo", "Serial", "PaymentInfo", "IsPrgHistoryInfo", "Code", "PassCode", "FromValid", "ToValid", "IsPrgUpdatedDate", "AgentInfo", "Surcharge", "TripAlias", "CreatedUser", "UserCharge", "StageCode", "Deposit", "Discount", "FromArea", "ToArea", "SeatType", "Debt", "CanceledDate", "CancelInfo", "Type", "ChargeDate", "SNote", "ResponsibilityUser", "PickOrReturnDate", "StaffName","CancelType"],
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
        "Bạn đang thực hiện thao tác đặt vé khứ hồi, vui lòng không thực hiện thao tác khác hoặc bấm ESC để hủy thao tác đặt vé khứ hồi !"
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
            [1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
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
    _focusUpdateForm: "PhoneNumbers",
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
        "IssueDate": { "vi": "Ngày đặt" },
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
        "Code": { "vi": "Mã vé" }

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
    //    displayFields: "phone|4,note,pInfo"
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

    // Move ghế theo khác chuyến
    _hasMoveSeatToOtherTrip: false,

    // auto send sms when update ticket
    _autoSendSmsUpdate: false,
    // update sms template
    _smsUpdateTpl: "Dat ve thanh cong: {_tripName}, chuyen {_tripDate}, {_nOfSeat} ghe {_seatCodes} - {_status}",
    // auto send sms when update ticket
    _autoSendSmsCancel: false,
    // update sms template
    _smsCancelTpl: "Da huy ve: {_tripName}, chuyen {_tripDate}, {_nOfSeat} ghe {_seatCodes}"
};
var _bkDict = $.extend({}, _dict);

