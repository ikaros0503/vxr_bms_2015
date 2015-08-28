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
                //[1, 1, "", "input", "hidden", "PhoneNumbers", "", "", {}, [], ""],
                [1, 1, "", "input", "hidden", "CreatedUser", "", "", {}, [], ""],
                [2, 1, "Ngày đi", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
                [2, 2, "Giờ", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
                [3, 1, "Di động", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
                [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
                [4, 1, "Đón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
                [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
                [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "đ"],
                [5, 2, "Tổng tiền", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "đ"],
                [7, 1, "Thanh toán", "select", "Chọn hình thức", "PaymentType", "form-control", "", {}, [], ""],
                [7, 2, "Chọn VP", "select", "Chọn VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
                [7, 2, "TK nhận", "input", "text", "ChargeCode", "form-control mpayment", "", { "data-type": 2, "placeholder": "Số TK|Tên|Mã GD" }, [], ""],
                [7, 2, "Địa chỉ thu", "input", "text", "PayAddress", "form-control mpayment", "", { "data-type": 3 }, [], ""],
                //[7, 2, "Tên tài xế", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
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
    //_trule: [
    //["valid", "history"],
    // [
    //[1, ["valid"]],
    //[2, ["valid"]],
    //[5, ["valid"]]
    //]
    //], //Multiple ticket, status of ticket, 
    // ràng buộc dữ liệu trong form Update
    _uFormRequiredField: [""],
    _allowGroupByCode: true,
    _pTplNumCoach: 1,
    //_pNoSeat: true,
	
	//focus when show update form
    _focusUpdateForm: "PhoneNumbers",

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


    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: true,
	
	// Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["Code"],

    _pStyleUrl: "/Comp/808/print.css?v=1.0.17",
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
        + "<tbody>"
        + "<tr style='height: 16px;'><td><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='pmInfo'>{pseat._pInfo}</p></td></tr>"
        + "<tr><td><p><span class='pcname'><b style='font-size: 16px;'>{pseat._cphone}</b>&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</span><span class='pcphone {pseat._exported}'>{pseat._stageName}</b></span></p></td></tr>"
        + "<tr><td><p class='pnote'><span><b>{pseat._fare}</b></span>&nbsp;&nbsp;<span>{pseat._note}</span></p></td></tr>"
        + "</tbody>"
         + "</table></li>",
    _noShowAgentInfo: true,

    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-ticket-code='{seat._code}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",


    _hasPickUpOnPrintBKS: false,
    _hasSelectBranchPayment: true,
    _epnp: {
        "11": [
             "0500"
        ],
    },

    // block ghế theo biển số xe
    // _blockSeatByVehicle: ["1|7|3", "1|7|5", "2|7|3", "2|7|5", "2|8|3", "2|8|5", "1|8|5"],
    // _unblockSeatByVehicle: 
    // {
    // "51B-137.31": ["1|7|3", "1|7|5", "2|7|3", "2|7|5", "2|8|3", "2|8|5", "1|8|5"],
    // "79B-011.92": ["1|7|3", "1|7|5", "2|7|3", "2|7|5", "2|8|3", "2|8|5", "1|8|5"],			
    // "79B-014.45": ["1|7|3", "1|7|5", "2|7|3", "2|7|5", "2|8|3", "2|8|5", "1|8|5"],				
    // "79B-010.21": ["1|7|3", "1|7|5", "2|7|3", "2|7|5", "2|8|3", "2|8|5", "1|8|5"],				
    // "79B-011.44": ["1|7|3", "1|7|5", "2|7|3", "2|7|5", "2|8|3", "2|8|5", "1|8|5"],				
    // "79B-015.29": ["1|7|3", "1|7|5", "2|7|3", "2|7|5", "2|8|3", "2|8|5", "1|8|5"],				
    // "79B-007.04": ["2|7|3", "2|7|5"],				
    // "79B-007.27": ["2|7|3", "2|7|5"],
    // "79B-006.71": ["2|7|3", "2|7|5"],
    // "79B-008.10": ["2|7|3", "2|7|5"],
    // "79B-008.85": ["2|7|3", "2|7|5"],				
    // }
    // ,


    // Pickup Info
    // _pSummaryPickupInfo: true,
    // _pSummaryPickupInfoPageBreak: false, // có qua trang hay không
    // _sumPickupInfo: "<div style='clear:both;float:left;margin-top:10px;width:100%;'>" +
                    // "<table width='100%' cellspacing='0' cellpadding='5' border='0'>" +
                        // "<tr>" +
                            // "<td width='50%' style='vertical-align:top;'>" +
                                // "<table width='100%' cellspacing='0' cellpadding='5' border='0'>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Bến bán:</td>" +
                                        // "<td>.....................................................</td>" +
                                    // "</tr>" +
                                    // "<tr>" +
                                        // "<td width='25%'></td>" +
                                        // "<td>.....................................................</td>" +
                                    // "</tr>" +
                                    // "<tr>" +
                                        // "<td width='25%'></td>" +
                                        // "<td>.....................................................</td>" +
                                    // "</tr>" +
                                    // "<tr>" +
                                        // "<td width='25%'></td>" +
                                        // "<td>.....................................................</td>" +
                                    // "</tr>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Khách Đthoại:</td>" +
                                        // "<td>.....................................................</td>" +
                                    // "</tr>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='white-space:nowrap;padding-left:0;'>Khách đường:</td>" +
                                        // "<td>.....................................................</td>" +
                                    // "</tr>" +
                                // "</table>" +
                            // "</td>" +
                            // "<td width='50%' style='vertical-align:top;'>" +
                                // "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    // "<tr style='line-height:28px;'>" +
                                        // "<td width='25%' style='white-space:nowrap;'>Lệnh:</td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                    // "<tr style='line-height:28px;'>" +
                                        // "<td width='25%' style='white-space:nowrap;'>Ăn:</td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                    // "<tr style='line-height:28px;'>" +
                                        // "<td width='25%' style='white-space:nowrap;'>Cầu đường:</td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                    // "<tr style='line-height:28px;'>" +
                                        // "<td width='25%' style='white-space:nowrap;'>Dầu:</td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='height:28px;'></td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='height:28px;'></td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                // "</table>" +
                            // "</td>" +
                        // "</tr>" +
                        // "<tr>" +
                            // "<td>" +
                                // "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='white-space:nowrap;'>Cước hàng:</td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                // "</table>" +
                            // "</td>" +
                            // "<td>" +
                                // "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='white-space:nowrap;'><span style='text-decoration:underline;'><b>Tổng chi:</b></span></td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                // "</table>" +
                            // "</td>" +
                        // "</tr>" +
                        // "<tr>" +
                            // "<td>" +
                                // "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='white-space:nowrap;'><span style='text-decoration:underline;'><b>Tổng thu:</b></span></td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                // "</table>" +
                            // "</td>" +
                            // "<td>" +
                                // "<table width='100%' cellspacing='0' cellpadding='0' border='0'>" +
                                    // "<tr>" +
                                        // "<td width='25%' style='white-space:nowrap;'><span style='text-decoration:underline;'><b>Còn lại:</b></span></td>" +
                                        // "<td>..........................................................</td>" +
                                    // "</tr>" +
                                // "</table>" +
                            // "</td>" +
                        // "</tr>" +
                    // "</table>" +
                // "<div>",
});
