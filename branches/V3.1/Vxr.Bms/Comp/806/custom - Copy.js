//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
        _pm: [[1, { vi: "T?i van phòng" }, 1, ""], [4, { vi: "Tài x? thu" }, 1, "TX"], [7, { vi: "VeXeRe" }, 1, "VXR"], [9, { vi: "Không thu ti?n" }, 1, "VIP"]],
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
                [2, 1, "Ngày di", "input", "text", "PickupDate", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-calendar'></i>"],
                [2, 2, "Gi?", "input", "text", "PickupTime", "form-control", "", { "readonly": true }, [], "<i class='glyphicon glyphicon-time'></i>"],
                [3, 1, "Di d?ng", "input", "text", "PhoneNumbers", "form-control vblue fw700", "", {}, [], ""],
                [3, 2, "Tên", "input", "text", "FullName", "form-control vblue fw700", "", {}, [], ""],
                [4, 1, "Ðón khách", "input", "text", "PickupInfo", "form-control", "", {}, [], ""],
                [4, 2, "T/C", "input", "text", "TransferInfo", "form-control", "", {}, [], ""],
                [5, 1, "Giá", "input", "text", "Fare", "form-control  vblue fw700", "", {}, [], "d"],
				[5, 2, "Ð?t c?c", "input", "text", "Deposit", "form-control  vblue fw700", "", {}, [], "d"],
                [6, 1, "T?ng ti?n", "input", "text", "ToTalFare", "form-control  vblue fw700", "", { "readonly": true }, [], "d"],
                [7, 1, "Thanh toán", "select", "Ch?n hình th?c", "PaymentType", "form-control", "", {}, [], ""],
                [7, 2, "Ch?n VP", "select", "Ch?n VP/CN", "BranchName", "form-control mpayment", "", { "data-type": 1 }, [], ""],
                [7, 2, "Tên tài x?", "input", "text", "DriverName", "form-control mpayment", "", { "data-type": 4 }, [], ""],
                [8, 1, "Ghi chú", "textarea", "", "Note", "form-control", "", {}, [], ""],
                [8, 2, "Mã vé", "input", "", "Code", "form-control vblue fw700", "", { "readonly": true }, [], ""],
				[10, 1, "", "button", "button", "H?y vé", "btn btn-danger btn-cancel pull-left", "", {}, [], "<span class='glyphicon glyphicon-remove'></span>&nbsp;", [1, 2]],
                [10, 1, "", "button", "button", "Thêm vé", "btn btn-success pull-left btn-add-more-ticket", "", [], [], "", [1, 2]],
				[10, 1, "", "button", "button", "C?p nh?t", "btn btn-primary btn-update", "", [], [], "", [1, 2]],
                [10, 1, "", "button", "button", "In vé", "btn btn-warning btn-eprint", "", [], [], "", [1, 2]],
                [10, 1, "", "button", "button", "Ðóng", "btn btn-default  btn-close", "", [], [], "", [1, 2]]
            ],
            "form-horizontal"
        ], //Id, Elements, Class, GridClass
        //_pStyleUrl: "/Content/extend/660/print.css?v=1.0.1",
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
        _lTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>S? gh?</th><th>Tên HK</th><th>S? di?n tho?i</th><th class='hidden-xs'>Ngày d?t</th><th class='hidden-xs'>T?ng ti?n</th><th>Tr?ng thái</th><th class='hidden-xs'>Ðón / trung chuy?n</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác v?</th></tr></thead><tbody></tbody><tfoot class='hidden-xs'><tr><td colspan='10'><button class='btn btn-sm btn-warning btn-print-list'><i class='glyphicon glyphicon-print'></i>&nbsp;In danh sách</button></td></tr></tfoot></table>",
        _cancelListTpl: "<table class='table table-bordered table-striped list-ticket'><thead><tr class='bg-primary'><th class='hidden-xs text-center'>STT</th><th>S? gh?</th><th>Tên HK</th><th>S? di?n tho?i</th><th class='hidden-xs'>Ngày d?t</th><th class='hidden-xs'>T?ng ti?n</th><th>Tr?ng thái</th><th class='hidden-xs'>Ðón / trung chuy?n</th><th class='hidden-xs'>Ghi chú</th><th class='hidden-xs text-center'>Tác v?</th></tr></thead><tbody></tbody></table>",
        _ilTpl: "<tr class='lseat' data-position='{seat._coach}_{seat._row}_{seat._col}' data-issue='{seat._issue}'><td class='hidden-xs text-center index'>{seat._index}</td><td>{seat._label}</td><td>{seat._cname}&nbsp;<span class='numT'>{seat._nTicketPerTrip}</span></td><td>{seat._cphone}</td><td class='hidden-xs'>{seat._idate}<br/>{seat._suser}</td><td class='hidden-xs'><strong>{seat._total}</strong></td><td>{seat._status}<br/>{seat._cuser}<br/>{seat._pmFullInfo}</td><td class='hidden-xs'>{seat._pInfo}</td><td class='hidden-xs'>{seat._note}</td><td class='hidden-xs text-center'>{seat._buttons}</td></tr>",

        _multiSeatOnTicket: true,
        _pclTpl: "<div class='list'><h3>DANH SÁCH KHÁCH HÀNG</h3><table class='table table-bordered'><thead><tr><th style='width: 5%;'>STT</th style='width: 15%;'><th>S? gh?</th><th style='width: 25%;'>Ð?a ch? c?n dón</th><th style='width: 10%;'>Tên HK</th><th style='width: 20%;'>S? di?n tho?i</th><th style='width: 25%;'>Ghi chú</th></tr></thead><tbody></tbody></table></div>",
        _ipcLTpl: "<tr class=''><td>{seat._index}</td><td>{seat._seatCodes}</td><td>{seat._pText}</td><td>{seat._cname}</td><td>{seat._cphone}</td><td>{seat._note}</td></tr>",
        _psmTpl: "<div><p><strong>Tru?c chuy?n:</strong>&nbsp;T?ng s? gh?:&nbsp;{s._stotal} gh?&nbsp;|&nbsp;Ðã thanh toán:&nbsp;{s._spaid} gh?</p><p><strong>Sau chuy?n:</strong>&nbsp;T?ng s? gh?:&nbsp;...... gh?&nbsp;|&nbsp;Ðã thanh toán:&nbsp;...... gh?&nbsp;|&nbsp;Ðã h?y:&nbsp;...... gh?</p></div>",
        _hasPickUpOnPrintBKS: false,
        _tplNumCol: 4,
        // block gh? theo bi?n s? xe
        _blockSeatByVehicle: [
            {
                "71B-003.45": ["1|3|4"],
                "71B-002.69": ["1|3|4"],
                "71B-002.14": ["1|3|4"],
                "71B-003.27": ["1|3|4"],
                "71B-002.60": ["1|3|4"],
                "71B-004.28": ["1|3|4"],
                "71B-002.71": ["1|3|4"],
                "51B-119.48": ["1|3|4"],
                "51B-157.92": ["1|3|4"],
                "51B-157.20": ["1|3|4"],
                //"29B-040.54": ["1|6|3", "2|6|3"]
            }
        ],

        // dùng cho các nhà xe mu?n khóa button sau khi b?m Xu?t b?n
        // 5|10092|1: quy?n này s? m? khóa các button 
        _closedTripConf: {
            "UpdateForm": ["btn-cancel", "btn-update", "btn-eprint", "btn-eprint-save", "btn-add-more-ticket", "btn-return"],
            "ValidForm": []
        },
        // In danh sach trung chuyen
        _ptsfTpl: "<div class='list tlist {t._pageBreak}'><h4 style='text-align: center;'>DANH SÁCH TRUNG CHUY?N<br/><small>{t._tName}&nbsp;chuy?n {t._timeSlots}&nbsp;ngày&nbsp;{t._tDate}</small></h4><table class='table table-bordered'><thead><tr><th>STT</th><th>Ð?a ch? dón</th><th>S? gh?</th><th>Tên HK</th><th>S? di?n tho?i</th><th>Ghi chú</th></tr></thead><tbody></tbody><tfoot><tr><td colspan='2' style='text-align: right; padding-right: 5px;'>T?ng c?ng</td><td><strong>{t._totalSeat}</strong></td><td colspan='3'>&nbsp;</td></tr></tfoot></table></div>",
        _iptsfTpl: "<tr><td>{seat._index}</td><td>{seat._pText}</td><td>{seat._seatCodes}</td><td><b style='font-size: 20px;'>{seat._cname}</b></td><td><b style='font-size: 20px;'>{seat._cphone}</b></td><td>{seat._note}</td></tr>",

        _hasBTWarning: true,               
    });

    //extension members
    //extension members
    $.extend(true, $.custom.vbooking.prototype, {
        _renderPrintSeatTemplate: function () {
            var self = this;
            var $table = $(_dict._pclTpl);
            var $tbody = $table.find('tbody');
            var stickets = [];
            var stickets2 = [];
            var nstickets = [];
            var nstickets2 = [];
            var customer = [];

            var paid = 0;
            var total = 0;
            $.each(self._m, function (ic, c) {
                if (typeof c != "undefined") {
                    $.each(c, function (ir, r) {
                        if (typeof r != "undefined") {
                            $.each(r, function (is, s) {
                                if (typeof s != "undefined" && s != null) {
                                    //seats.push(sx);
                                    var t = s._getCurrentTicket();
                                    if (!$.isEmptyObject(t)) {

                                        var pInfo = t._getPickupInfo();
                                        var pIndex = 0;
                                        var pText = "";
                                        if (!$.isEmptyObject(pInfo)) {
                                            pIndex = parseInt(pInfo.pIndex);
                                            pText = pInfo.text;
                                        }
                                        var cname = t._cname;
                                        var cphone = t._getDefaultPhoneNumber();

                                        if (pIndex == 0) {
                                            if (!vIsEstStr(cphone)) {
                                                nstickets2.push({
                                                    _seatCodes: [s._label],
                                                    _cname: cname,
                                                    _cphone: cphone,
                                                    _pText: pText,
                                                    _note: t._note,
                                                    _status: t._status,
                                                    _class: ""
                                                });
                                            } else {
                                                //var ntext = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var ntext = cphone;
                                                var nkey = customer.indexOf(ntext);
                                                if (nkey == -1) {
                                                    nkey = customer.push(ntext) - 1;
                                                }

                                                if (typeof nstickets[nkey] == "undefined") {
                                                    nstickets[nkey] = {
                                                        _seatCodes: [],
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _status: t._status,
                                                        _class: ""
                                                    };
                                                }
                                                nstickets[nkey]._seatCodes.push(s._label);
                                            }
                                        } else {
                                            if (pInfo.type == 'P') {
                                                if (typeof stickets[pIndex] == "undefined") {
                                                    stickets[pIndex] = [];
                                                }
                                                //var text = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var text = cphone;
                                                var key = customer.indexOf(text);
                                                if (key == -1) {
                                                    key = customer.push(text) - 1;
                                                }
                                                if (typeof stickets[pIndex][key] == "undefined") {
                                                    stickets[pIndex][key] = {
                                                        _seatCodes: [],
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _status: t._status,
                                                        _class: "pickup"
                                                    };
                                                }
                                                stickets[pIndex][key]._seatCodes.push(s._label);
                                            } else if (pInfo.type == 'T') {
                                                if (typeof stickets2[pIndex] == "undefined") {
                                                    stickets2[pIndex] = [];
                                                }
                                                var text2 = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                var key2 = customer.indexOf(text2);
                                                if (key2 == -1) {
                                                    key2 = customer.push(text2) - 1;
                                                }
                                                if (typeof stickets2[pIndex][key2] == "undefined") {
                                                    stickets2[pIndex][key2] = {
                                                        _seatCodes: [],
                                                        _cname: cname,
                                                        _cphone: cphone,
                                                        _pText: pText,
                                                        _note: t._note,
                                                        _status: t._status,
                                                        _class: ""
                                                    };
                                                }
                                                stickets2[pIndex][key2]._seatCodes.push(s._label);
                                            }
                                        }

                                        if (t._isPaid() || t._isPass()) {
                                            paid++;
                                        }
                                        total++;
                                    }
                                }
                            });
                        }
                    });
                }
            });

            var temp = stickets.concat(stickets2);
            temp[temp.length] = nstickets.concat(nstickets2);

            if (temp.length > 0) {
                var index = 1;
                $.each(temp, function (ix, s) {
                    if (typeof s != "undefined" && s != null) {
                        $.each(s, function (_, sx) {
                            if (typeof sx != "undefined" && sx != null) {
                                var slen = sx._seatCodes.length;
                                var data = {
                                    "seat": {
                                        _index: index,
                                        _cname: sx._cname,
                                        _cphone: sx._cphone,
                                        _pText: sx._pText,
                                        _note: sx._note,
                                        _seatCodes: sx._seatCodes.join(", ") + " (" + slen + "v)",
                                        _status: sx._status == 1 ? "Ð?t ch?" : "Ðã thanh toán",
                                        _class: sx._class
                                    }
                                }

                                var $tr = $(vtpl(_dict._ipcLTpl, data));
                                $tbody.append($tr);

                                index++;
                            }
                        });
                    }
                });
                // Thêm 5 dòng tr?ng d? di?n khách vãng lai
                var $trSub1 = $('<tr height="31px;"><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                var $trSub2 = $('<tr height="31px;"><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                var $trSub3 = $('<tr height="31px;"><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                var $trSub4 = $('<tr height="31px;"><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                var $trSub5 = $('<tr height="31px;"><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                $tbody.append($trSub1);
                $tbody.append($trSub2);
                $tbody.append($trSub3);
                $tbody.append($trSub4);
                $tbody.append($trSub5);

            } else {
                $tbody.append($('<tr />').append($('<td />').attr('colspan', '6').text("Chua có hành khách d?t vé chuy?n xe này")));
            }

            var $body = $('<div />').addClass('row');
            $body.append($table);
            //Sumary
            var sm = {
                "s": {
                    _stotal: total,
                    _spaid: paid
                }
            }
            $body.append(vtpl(_dict._psmTpl, sm));
            $body.append($('<div><b>T?ng khách vãng lai:</b> ............ gh?</div>'));

            return $body;
        },
    });

})(jQuery);