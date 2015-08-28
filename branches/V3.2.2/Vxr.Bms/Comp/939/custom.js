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
       //In vé tự động chuyển thanh toán
       //[10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint-save", "", [], [], "", [1, 2]],
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
    // hiện nút P ngoài BKS: nhớ thêm các css sau vào file custom.css của nhà xe
    _st: [[0], [2, 3, 5], [2, 3], [2, 3], [3], [2, 3], [], [], [2, 3]],
    //Chọn các hình thức thanh toán. 1 shown; 2 hide
    _pm: [[1, { vi: "Tại văn phòng" }, 1, ""], [2, { vi: "Chuyển khoản" }, 0, "CK"], [3, { vi: "Thu tiền tại nhà" }, 0, "TN"], [4, { vi: "Tài xế thu" }, 1, "TX"], [5, { vi: "123Pay" }, 0, "123Pay"], [6, { vi: "Đại lý" }, 0, "DL"], [7, { vi: "VeXeRe" }, 0, "VXR"], [8, { vi: "Chủ xe thu" }, 0, "CX"], [9, { vi: "Không thu tiền" }, 1, "VIP"]],
    //Cảnh báo trong U
    _hasBTWarning: true,
    //chi nhanh dat cho	
    _noShowAgentInfo: true,
    //nguoi thanh toan trên BKS
    _showUCharge: true,
    //Edit sau xuất bến bao lâu
    _limitedDateBefore: 7,
    _limitedMinuteBefore: 120,
    //Số đện thoại trong U
    _epnp: {
        "10": [
            "059", "068", "073"
        ],
        "11": [
            "0123", "0168"
        ],
    },
    // Có nhiều giá (giá các chặng con)
    _hasMultiFare: true,
    //Mạc định chặng trong U
    _hasDefaultStagePerTrip: true,
    _defaultStagePerTrip: {
        // TripId: [DefaultFromId, DefaultToId]
        1115: "1780, 1673",
        1116: "1673, 1780"
    },
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
    // co the chon thanh toan tai van phong nao
    _hasSelectBranchPayment: false,
    // Đặt thêm vé: copy các thông tin sau
    _copyField: ["FullName", "PhoneNumbers", "PickupInfo", "TransferInfo", "Note", "Fare", "Code", "FromArea", "ToArea", "TripDetailId", "pIndex"],
    _copyFieldRequired: ["PhoneNumbers", "Note", "Code"],
    // Vé khứ hồi: copy các thông tin sau
    _returnField: ["FullName", "PhoneNumbers"],
    _returnFieldRequired: ["PhoneNumbers"],
    // block văn phòng, chi nhánh không được phép bán vé một số tuyến đường
    _hasBlockTripByBranch: true,
    _blockTripByBranch: { // Id chi nhánh: các Id tuyến đường cần block
        54: [836, 209, 211, 207],
    },


    //Hiển thị số tầng
    _pTplNumCoach: 1,
    // Số cột trên phơi
    _pTplNumCol: 8,
    //Style BKS
    _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick' style='font-size: 12px !important;'>{seat._pInfo}</div></div>"
      + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p class='cinfo' style='height:20px !important;'><b><span class='name' style='font-size: 13px !important'>{seat._cname}</span></b><span class='numT'>{seat._nTicketPerTrip}</span><span class='phone' style='font-size: 15px !important;'>&nbsp;&nbsp;{seat._cphone}</span><p><span style='font-size:13px !important;'>{seat._note}</span></p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",
    //Style Phơi
    _psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
       + "<tbody>"
       + "<tr><td height='16px;'><p class='pseat-code {pseat._dathanhtoan}'>{pseat._label}</p><p class='ppickup {pseat._exported}' style='text-align: right; font-size: 16px;'>{pseat._note}</p></td></tr>"
       + "<tr><td><p class='pcname' style='font-size: 18px;'>{pseat._cname}&nbsp;<b class='ntk-pertrip' style='font-size: 15px;'>{pseat._nTicketPerTrip}</b></p><p class='pcphone' style='font-size: 18px !important;'><b>{pseat._cphone}</b></p><p class='pnote' style='clear:both; font-size: 18px;'>{pseat._pInfo}</p></td></tr>"
       + "</tbody>"
       + "</table></li>",
    _onlyPaidBackGround: true, // bo them css vao file print    .no-background {background:none !important;}
    _noBackground: true, // Bỏ thuộc tính này vào thì background trên phơi bị đảo ngược
    //Style ds trung chuyển
    _tsfTpl: "<div class='tlist'><h4>DANH SÁCH TRUNG CHUYỂN&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='10'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list' data-group-index='{t._index}'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _itsfTpl: "<tr class='{seat._class}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-tText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm tIndex' type='text' value='{seat._index}' /></td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    //In ds trung chuyển
    _ptsfTpl_NoSub: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUYỂN<br/><small>{t._tName}&nbsp;chuyến {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Địa chỉ đón</th><th>Mã ghế</th><th>Tên HK</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    //Style Đón dọc đường
    _puTpl: "<div class='plist'><h4>DANH SÁCH ĐÓN DỌC ĐƯỜNG&nbsp;<small>chuyến {t._timeSlots}</small></h4><table class='table table-bordered table-responsive list-ticket'><thead><tr class='bg-primary'><th class='col-md-1 hidden-xs'>STT</th><th class='hidden-xs'>Tên HK</th><th>Số điện thoại</th><th>Địa chỉ đón</th><th>Số ghế</th><th class='hidden-xs'>Tổng tiền</th><th class='hidden-xs'>Trạng thái</th><th class='hidden-xs'>Ghi chú</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='5' style='text-align: right;'>Tổng cộng</td><td><strong class='vred'>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr><tr><td colspan='8'><button class='btn btn-sm btn-success btn-order'>Lưu sắp xếp</button>&nbsp;<button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table></div>",
    _ipuTpl: "<tr class='{seat._class}' data-code='{seat._code}' data-ids='{seat._tids}' data-pdate='{seat._pdate}' data-seatinfos='{seat._seatInfos}' data-pText='{seat._pText}'><td class='col-md-1 hidden-xs'><input class='form-control input-sm pIndex' type='text' value='{seat._index}' /></td><td class='hidden-xs'>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td class='hidden-xs'>{seat._status}</td><td class='hidden-xs'>{seat._note}</td></tr>",
    //In đón dọc đường
    _ppuTpl: "<div class='list plist' style='font-size:20px;'><h4 style='text-align: center;'>DANH SÁCH ĐÓN DỌC ĐƯỜNG</h4><table class='table table-bordered' style='font-size:20px;'><thead><tr><th>STT</th><th>Tên HK</th><th>Số điện thoại</th><th>Địa chỉ đón</th><th>Số ghế</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='5' style='text-align: right; padding-right: 5px;'>Tổng cộng</td><td><strong>{t._total}</strong></td><td colspan='2'>&nbsp;</td></tr></tfoot></table></div>",
    _ippuTpl: "<tr><td>{seat._index}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td><strong>{seat._total}</strong></td><td>{seat._status}</td><td>{seat._note}</td></tr>",
    //header phoi
    _pTitleTpl: "<table class='print-title'><tbody><tr><td style='width: 250px !important;'><strong class='title'>{p._title}</strong></td><td colspan='2'><strong class='rname'>{p._rname}</strong></td><td style='145px !important;'>Số xe:&nbsp{p._busNum}</td></tr><tr><td>Chuyến:&nbsp;<strong class='time'>{p._time}</strong></td><td>Lái xe:&nbsp;{p._driverName}</td><td>Phục vụ:&nbsp;{p._assistantName}</td></tr></tbody></table>",


    //in ghế trống
    _pNoSeat: true,
    //block ghế theo biển số xe
    _blockSeatByVehicle: ["1|7|5"],
    //Mở khoá theo xe
    _unblockSeatByVehicle:
    {
        "51B-117.30": ["1|7|5"],
        "51B-115.57": ["1|7|5"]
    },
    //Gộp giờ đón/Tc
    _hasMergeTransfer: { 22443: true },
    hasTransferTimeConf: ["00:01-23:59"],
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

    //Ds vé hủy dưới BKS
    _lTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='10'><button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table>",
    _cancelListTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>Số ghế</th><th>Tên HK</th><th>Số điện thoại</th><th class='hidden-xs'>Ngày đặt</th><th class='hidden-xs'>Tổng tiền</th><th>Trạng thái</th><th class='hidden-xs'>Đón / trung chuyển</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác vụ</th></tr></thead><tbody></tbody></table>",
    _ilTpl: "<tr class='lseat' data-position='{seat._coach}_{seat._row}_{seat._col}' data-issue='{seat._issue}'><td class='hidden-xs text-center index'>{seat._index}</td><td>{seat._label}</td><td>{seat._cname}&nbsp;<span class='numT'>{seat._nTicketPerTrip}</span></td><td>{seat._cphone}</td><td class='hidden-xs'>{seat._idate}<br/>{seat._suser}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td>{seat._status}<br/>{seat._cuser}<br/>{seat._pmFullInfo}</td><td class='hidden-xs'>{seat._pInfo}</td><td class='hidden-xs'>{seat._note}</td><td class='hidden-xs text-center'>{seat._buttons}</td></tr>",

    //Phơi Ds
    _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 5%;'>STT</th style='width: 15%;'><th>Số ghế</th><th style='width: 25%;'>Địa chỉ cần đón</th><th style='width: 10%;'>Tên HK</th><th style='width: 20%;'>Số điện thoại</th><th style='width: 25%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
    _ipcLTpl: "<tr class=''><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._note}</td></tr>",
    _psmTpl: "<div><p><strong>Trước chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;{s._stotal} ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;{s._spaid} ghế</p><p><strong>Sau chuyến:</strong>&nbsp;Tổng số ghế:&nbsp;...... ghế&nbsp;|&nbsp;Đã thanh toán:&nbsp;...... ghế&nbsp;|&nbsp;Đã hủy:&nbsp;...... ghế</p></div>",



    //Group vé theo Code
    _allowGroupByCode: true,


    //in đón/Tc trên phơi
    _hasPickUpOnPrintBKS: false,
    // Ghế đại diện khi in phơi
    groupSeat: {
        groupFields: "phone->ticketCode",
        displayFields: "phone|4,note,pInfo"
    },
    _psTpl_SeatGroup:
        '<li class="print-seat col-md-4" style="overflow:hidden;">' +
            '<table>' +
                '<tbody>' +
                  '<tr style="height: 22px">' +
                    '<td style="width:100%"><p class="pseat-code {data._paid}">{data.seatCode}</p></td>' +
                    '<td></td>' +
                  '</tr>' +
                   '<tr>' +
                     '<td colspan="2" style="text-align: center;font-size: 20px;">{t._cname}</td>' +
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

    },
    // // Thống kê phơi sơ đồ
    _pSummaryTripInfo: true,
    _pSummaryTripInfoPageBreak: false,
    _tripInfo: "<div style='margin-top:0px;float:left;width:100%;position: relative;top: 5px;'>" +
               "<div style='float:left;width:49.5%;margin-right: 5px;'>" +
                    "<table style='width:100%;' cellspacing='0'>" +
                        "<tbody>" +
                           "<tr style='height:45px;'>" +
                               "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;padding-top: 5px; line-height:32px; height: 74px;'><span>1-Số khách trên xe:..............................................</span></br><span>2- Số khách đón dọc đường:................................</span></td>" +
                           "</tr>" +
                        "</tbody>" +
                    "</table>" +
                "</div>" +
               "<div style='float:left;width:49.5%;'>" +
                    "<table style='width:100%;' cellspacing='0'>" +
                        "<tbody>" +
                           "<tr style='height:45px;'>" +
                               "<td colspan='2' style='border:1px solid #000;vertical-align:top;padding-left:3px;padding-top: 5px; line-height:22px'><span>3-Số ghế trống:...................................................</span></br><span>4-Xe máy:............................................................</span></br><span>5-Ghế súp:...........................................................</span></td>" +
                           "</tr>" +
                        "</tbody>" +
                    "</table>" +
                "</div>" +

           "</div>",
});
