/************************************************************************
* PRINT BOOKING SHEET                                                   *
*************************************************************************/
(function ($) {

    //Reference to base object members
    var base = {
        _create: $.custom.vbooking.prototype._create
    };

    //extension members
    $.extend(true, $.custom.vbooking.prototype, {
        options: {
            operatorName: ""
        },

        _create: function () {
            base._create.apply(this, arguments);

            if (!this.options.serviceUrl) {
                return;
            }
        },

        _printByTemplate: function (phoi) {
            var $printContent = $('<div />').addClass('phoi');
            var windowName = 'Print';
            var printWindow = window.open('about:blank', windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            printWindow.document.write(
                '<html>' +
                    '<head>' +
                        '<title>' + windowName + '</title>' +
                        '<link rel="stylesheet" href="/Content/css/print_' + phoi.orientation + '.css" type="text/css" />' +
                    '</head>' +
                    '<body>' +
                        phoi.html +
                    '</body>' +
                '</html>'
                );
            printWindow.focus();
            setTimeout(function () {
                printWindow.print();
            }, 2500);
        },

        getInfoObject: function () {
            var me = this;
            if (me._phoiTemplates == null) return null;
            var phoi = me._phoiTemplates[me._data[me._cTripIndex].Ts[me._cTripTime][me._cTripBus].SeatTemplateId];
            if (phoi == null) return null;
            var tInfo = me._getCurrentTripInfo();
            var e = {};
            e.phoi = {};
            e.seats = {};
            e.phoi.title = $.trim(me.options.cifne);
            e.phoi.routeName = $.trim(me._data[me._cTripIndex].Name);
            e.phoi.tripTime = $.trim(me._cTripTime);
            e.phoi.tripDate = $.trim(me._cTripDate.toFormatString('dd-mm-yyyy'));
            e.phoi.busNumber = tInfo._vehicleNumber;
            e.phoi.driverName = tInfo._driverName;
            e.phoi.assistantName = tInfo._assistantName;

            var closedStatus = me._data[me._cTripIndex].Ts[me._cTripTime][0]['ClosedStatus'];
            var anotherFareTienKhach = tInfo._anotherFareTienKhach;
            var mainFareTienKhach = tInfo._mainFareTienKhach;
            var feeTienKhach = tInfo._feeTienKhach;
            var feeTienHang = tInfo._feeTienHang;
            var totalFareTienKhach = anotherFareTienKhach + mainFareTienKhach - feeTienKhach;
            var totalFareTienHang = tInfo._totalMoneyBranchNotPaid + tInfo._totalMoneyBranchPaid + tInfo._moneyPickedProNotPaid + tInfo._moneyPickedProPaid - feeTienHang;
            var totalAnotherFee = 0;
            if (tInfo._anotherFee.length > 0) {
                $.each(tInfo._anotherFee, function (ni, nk) {
                    totalAnotherFee += nk._money.toNum();
                });
            }
            var totalFee = tInfo._tollFee + tInfo._washFee + tInfo._eatFee + totalAnotherFee;
            var totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;

            var res = [];
            if (tInfo._branchProduct.length > 0) {
                $.each(tInfo._branchProduct, function (ki, kl) {
                    var moneyPaid = ".................";
                    var moneyNotPaid = ".................";
                    if (kl._moneyBranchProPaid > 0) {
                        moneyPaid = kl._moneyBranchProPaid.toMn();
                    }
                    if (kl._moneyBranchProNotPaid > 0) {
                        moneyNotPaid = kl._moneyBranchProNotPaid.toMn();
                    }
                    var fg = kl._branchCode + ": " + "Đã T<sup>2</sup>-" + moneyPaid + "đ, Chưa T<sup>2</sup>-" + moneyNotPaid + "đ";
                    res.push(fg);
                });
            }
            var pickedProductFormat = "";
            var moneyPickedProPaid = "..................................";
            var moneyPickedProNotPaid = "..................................";
            if (tInfo._moneyPickedProPaid > 0) {
                moneyPickedProPaid = "Đã T<sup>2</sup>-" + tInfo._moneyPickedProPaid.toMn() + "đ, ";
            } else {
                moneyPickedProPaid = "Đã T<sup>2</sup>-..................đ, ";
            }
            if (tInfo._moneyPickedProNotPaid > 0) {
                moneyPickedProNotPaid = "Chưa T<sup>2</sup>-" + tInfo._moneyPickedProNotPaid.toMn() + "đ";
            } else {
                moneyPickedProNotPaid = "Chưa T<sup>2</sup>-.................đ";
            }
            pickedProductFormat = moneyPickedProPaid + moneyPickedProNotPaid;

            var anotherFee = [];
            if (tInfo._anotherFee.length > 0) {
                $.each(tInfo._anotherFee, function (kj, km) {
                    if (km._name != '' && km._money > 0) {
                        anotherFee.push(km._name + " - " + (km._money).toNum().toMn() + " đ");
                    }
                });
            }
            var totalFareTienKhachFormat = "";
            var totalFareTienHangFormat = "";
            var totalFeeFormat = "";
            var totalTotalFormat = "";
            if (closedStatus == 2) {
                totalFareTienKhachFormat = totalFareTienKhach.toMn() + " đ";
                totalFareTienHangFormat = totalFareTienHang.toMn() + " đ";
                totalFeeFormat = totalFee.toMn() + " đ";
                totalTotalFormat = totalTotal.toMn() + " đ";
            }

            var feeTienKhachFormat = "";
            var totalTienKhachFormat = "";
            var totalTienHangFormat = "";
            if (feeTienKhach > 0) {
                feeTienKhachFormat = "Chi phí VP:&nbsp;&nbsp;" + feeTienKhach.toMn() + " đ";
                totalTienKhachFormat = "Còn:&nbsp;&nbsp;" + (tInfo._totalPaid + anotherFareTienKhach - feeTienKhach).toMn() + " đ";
            }
            if (feeTienHang > 0) {
                totalTienHangFormat = "CP hàng:&nbsp;" + feeTienHang.toMn() + " đ" + "&nbsp;&nbsp;&#x21d2;&nbsp;&nbsp;Còn:&nbsp;&nbsp;" + totalFareTienHangFormat;
            } else {
                totalTienHangFormat = "&#x21d2;&nbsp;&nbsp;Tổng:&nbsp;&nbsp;" + totalFareTienHangFormat;
            }
            e.phoi.totalPaidPerType = tInfo._totalPaidPerType;
            e.phoi.totalBookingPerAgent = tInfo._totalBookingPerAgent;
            e.phoi.totalPaid = tInfo._totalPaid > 0 ? tInfo._totalPaid.toMn() + " đ" : "";
            e.phoi.totalMoney = tInfo._totalMoney;
            e.phoi.tollFee = tInfo._tollFee != 0 ? tInfo._tollFee.toMn() + " đ" : "..................đ";
            e.phoi.washFee = tInfo._washFee != 0 ? tInfo._washFee.toMn() + " đ" : ".......................đ";
            e.phoi.eatFee = tInfo._eatFee != 0 ? tInfo._eatFee.toMn() + " đ" : "........................đ";
            e.phoi.feeTienHang = tInfo._feeTienHang != 0 ? tInfo._feeTienHang.toMn() + " đ" : ".....................đ";
            e.phoi.moneyBranchProduct = res.join('<br />');
            e.phoi.anotherFee = anotherFee.join('<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
            e.phoi.totalTienKhach = totalFareTienKhachFormat;
            e.phoi.totalTienHang = totalFareTienHangFormat;
            e.phoi.totalFee = totalFeeFormat;
            e.phoi.totalTotal = totalTotalFormat;
            e.phoi.feeTienKhachFormat = feeTienKhachFormat;
            e.phoi.totalTienKhachFormat = totalTienKhachFormat;
            e.phoi.anotherFareTienKhachFormat = anotherFareTienKhach > 0 ? "(DT khác: " + anotherFareTienKhach.toMn() + " đ)" : "";
            e.phoi.totalTienHangFormat = totalTienHangFormat;
            e.phoi.pickedProductFormat = pickedProductFormat;


            var numSeat = me._data[me._cTripIndex].Ts[me._cTripTime][me._cTripBus].NS;
            var uniqueCustomers = [];
            var coaIndex = 1;
            var numCol = 0;

            $.each(me._m, function (_, c) {
                $.each(c, function (__, r) {
                    if (typeof r != "undefined" && r != null) {
                        if (numCol < r.length) {
                            numCol = r.length;
                        }
                    }
                });
            });

            var tplNumCoach = me._m.length;
            if (_dict._pTplNumCoach != 0) { //Default 0 is not custom set
                tplNumCoach = _dict._pTplNumCoach;
            }
            if (_dict._pTplNumCol != 0) { //Default 0 is not custom set
                numCol = _dict._pTplNumCol;
            }

            var getSubItem = function (str, c, index) {
                if (str == null || str == "") return "";
                var strs = str.split(c);
                if (strs.length > index)
                    return strs[index];
                return "";
            };
            var uniqueCustomers = [];
            $.each(me._m, function (ix, cx) {
                if (typeof cx != "undefined" && cx != null) {
                    $.each(cx, function (jx, rx) {
                        if (typeof rx != "undefined" && rx != null) {
                            var numExistingItem = rx.numEstIt();
                            //var $cSeat = null;
                            for (var i = 0; i < numCol; i++) {
                                if (typeof rx[i] != "undefined" && rx[i] != null) {
                                    var id = rx[i]._getSeatId();
                                    var t = rx[i]._getCurrentTicket();
                                    var s = {}
                                    s.floorIndex = rx[i]._coach;
                                    s.label = rx[i]._label;
                                    s.rowIndex = rx[i]._row;
                                    s.columnIndex = rx[i]._col;
                                    s.groupSeatDisplay = "hide";
                                    s.seatDisplay = "";
                                    s.isPaid = "";
                                    if (!$.isEmptyObject(t)) {
                                        s.t = t;
                                        s.customerPhone = t._cphone;
                                        s.createdUser = t._cuser;
                                        s.customerName = t._cname;
                                        s.fare = t._fare.toMn();
                                        s.note = t._note;
                                        s.pickupInfo = getSubItem(t._pInfo, "|", 0);
                                        s.paymentType = getSubItem(t._pmInfo, ":", 1);
                                        s.fromArea = getSubItem(t.fromArea, "|", 3);
                                        s.fromAreaShort = getSubItem(t.fromArea, "|", 2);
                                        s.toArea = getSubItem(t.toArea, "|", 3);
                                        s.toAreaShort = getSubItem(t.toArea, "|", 2);
                                        s.ticketsCount = 1;
                                        s.groupPhone = t._cphone;
                                        s.createdUser = t._cuser != null ? t._cuser : "";
                                        s.chargedUser = t._suser != null ? t._suser : "";
                                        //s.chargeUser = t._suser;

                                        if (!$.isEmptyObject(t) && typeof me._cphoneSt[t._getDefaultPhoneNumber()] != "undefined") {
                                            s.ticketsCount = me._cphoneSt[t._getDefaultPhoneNumber()].length;
                                        }

                                        if (t._status == 2 || t._status == 5) {
                                            s.isPaid = "isPaid";
                                        }

                                        if (typeof (_dict.groupSeat) != 'undefined' && !$.isEmptyObject(t)) {//group
                                            var isMatched = false;
                                            if (uniqueCustomers.length > 0) {
                                                for (var kk = 0; kk < uniqueCustomers.length; kk++) {
                                                    if (me.isTwoSeatPerfectTogether(t, uniqueCustomers[kk], _dict.groupSeat.groupFields)) {
                                                        isMatched = true;
                                                        s.originalSeatCode = uniqueCustomers[kk].seatLabel;
                                                        s.groupSeatDisplay = "";
                                                        s.seatDisplay = "hide";
                                                        var fields = _dict.groupSeat.displayFields.split(',');
                                                        if (fields.length > 0) {
                                                            for (var jj = 0; jj < fields.length; jj++) {
                                                                if (fields[jj].indexOf("phone") >= 0) {
                                                                    if (fields[jj].indexOf("|") >= 0) {
                                                                        s.groupPhone = t._cphone.substring(t._cphone.length - parseInt(fields[jj].split("|")[1]));
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!isMatched) {
                                                uniqueCustomers.push(t);
                                            }
                                        }
                                    }
                                    s.ticketsCountGtZero = s.ticketsCount > 1 ? s.ticketsCount : "";
                                    e.seats[id] = s;
                                }
                            }
                        }
                    });
                }
            });
            return { html: vtpl(phoi.html, e), orientation: phoi.orientation };
        },

        _printBKS: function (keyPrint) {
            var $printContent = $('<div />').addClass('print-container');
            $printContent.append(this._renderBKSTitle());
            if (vIsEstStr(keyPrint) && keyPrint == 'in-danh-sach') {
                $printContent.append(this._inDanhSach());
            } else {
                var phoi = this.getInfoObject();
                if (phoi != null) {
                    this._printByTemplate(phoi);
                    return;
                } else {
                    $printContent.append(this._renderPrintSeatTemplate());
                }
            }
            if (app.oRights["StageEnable"] && _dict._pStageTicket) {

                $printContent.append(this._renderStageTicketsTemplate());
            }
            if (_dict._hasPickUpOnPrintBKS) {

                $printContent.append(this._renderPrintPickupTemplate().addClass('list').css('page-break-before', 'always'));
            }
            if (typeof _dict._pSummaryTripInfo != "undefined" && _dict._pSummaryTripInfo) {
                $printContent.append(this._renderPrintTripInfo());
            }
            // reset default value
            FlatObj.RBePrint = false;
            var windowName = 'BookingSheet' + (new Date()).getTime();
            var printWindow = window.open('about:blank', windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            printWindow.document.write(
                '<html>' +
                    '<head>' +
                        '<title>' + windowName + '</title>' +
                        '<link rel="stylesheet" href="' + _dict._pStyleUrlDefault + '" type="text/css" />' +
                        '<link rel="stylesheet" href="' + _dict._pStyleUrl + '" type="text/css" />' +
                    '</head>' +
                    '<body>' +
                        $printContent.html() +
                    '</body>' +
                '</html>'
                );
            printWindow.focus();
            setTimeout(function () {
                printWindow.print();
            }, 2500);
        },
        _renderBKSTitle: function () {
            var self = this;
            var $title = $('<div />').addClass('row');
            //Prepare data
            var tInfo = self._getCurrentTripInfo();
            var time = $.trim(self._cTripTime);
            var duyet = null;
            if (self._data[self._cTripIndex].Ts[self._cTripTime][0].TripDriver != null) {
                duyet = self._data[self._cTripIndex].Ts[self._cTripTime][0].TripDriver.split('~');
                if (duyet.length > 1) {
                    for (var s = 0; s < duyet.length; s++) {
                        var item = duyet[s].split('|');
                        if (item[0] === $.trim(self._cTripTime)) {
                            if (item[1] != '') {
                                time += ' / ' + item[1];
                                break;
                            }
                        }
                    }
                } else if (duyet[0] != '') {
                    time = ' / ' + duyet[0];
                }
            }
            else if (self._data[self._cTripIndex].TripDriver != null) {
                duyet = self._data[self._cTripIndex].TripDriver.split('~');
                if (duyet.length > 1) {
                    for (var ss = 0; ss < duyet.length; ss++) {
                        var item2 = duyet[ss].split('|');
                        if (item2[0] === $.trim(self._cTripTime)) {
                            if (item2[1] != '') {
                                time += item2[1];
                                break;
                            }
                        }
                    }
                } else if (duyet[0] != '') {
                    time += duyet[0];
                }

            }
            time += ' - &nbsp;ngày&nbsp;' + $.trim(self._cTripDate.toFormatString('dd-mm-yyyy'));
            var data = {
                "p": {
                    _title: $.trim(self.options.cifne),
                    _rname: $.trim(self._data[self._cTripIndex].Name),
                    _time: time,
                    _busNum: tInfo._vehicleNumber,
                    _driverName: tInfo._driverName,
                    _assistantName: tInfo._assistantName,
                    _note: tInfo._note
                }
            };
            $title.append($(vtpl(_dict._pTitleTpl, data)));

            return $title;
        },
        _renderStageName: function (stageCode, stopPoints) {
            var s = "";
            if (stopPoints) {
                var l = stopPoints.data.length - 1;
                var stageCode2 = stageCode.toString(2);
                var idx1 = l - stageCode2.length;
                var idx2 = stageCode2.indexOf("0");
                if (idx2 == -1) idx2 = l;
                else idx2 = idx1 + idx2;
                var stageName = stopPoints.data[idx1].Name + " - " + stopPoints.data[idx2].Name;
                return stageName;
            }
            return s;
        },
        _renderStageNameShort: function (stageCode, stopPoints) {
            var s = "";
            if (stopPoints) {
                var l = stopPoints.data.length - 1;
                var stageCode2 = stageCode.toString(2);
                var idx1 = l - stageCode2.length;
                var idx2 = stageCode2.indexOf("0");
                if (idx2 == -1) idx2 = l;
                else idx2 = idx1 + idx2;
                var stageNameShort = stopPoints.data[idx1].Code + " - " + stopPoints.data[idx2].Code;
                return stageNameShort;
            }
            return s;
        },
        _renderStageTicketsTemplate: function () {
            var self = this;
            var stopPoints = self._data[self._cTripIndex].StopPoints;
            var s = "";
            var $stageHtml = $(vtpl(_dict._pvcTpl, {}));
            var $sbody = $stageHtml.find('tbody');
            var stt = 1;
            var arr = ["Avaliable", "Đặt chỗ", "Đã TT", "Đã hủy", "Passed", "Không đến", "PainNotPrint "];
            $.each(self._printStageTickets, function (i, t) {
                t._pInfo = t._getPickupInfo().text;
                t._stt = stt;
                t._statusLabel = arr[t._status]; //Trạng thái
                t._stageName = self._renderStageName(t.stageCode, stopPoints);
                t._stageNameShort = self._renderStageNameShort(t.stageCode, stopPoints);
                if ((t._fare).toString().indexOf('.') == -1) {
                    t._fare = t._fare != 0 ? t._fare.toMn() + "đ" : "";
                } else {
                    t._fare = t._fare;
                }
                t._hasPaid = t._status == 1 ? "chua-thanh-toan" : "da-thanh-toan";
                t._user = t._cuser != null ? t._cuser : t._suser;
                var $tr = $(vtpl(_dict._pvcRTpl, t));
                $sbody.append($tr);
                stt++;

                //console.log("NOTE",t.note);
            });
            if (typeof _dict._pSummaryTripInfo != "undefined" && _dict._pSummaryTripInfo) {
                $sbody.closest('body').append(self._renderPrintTripInfo());
            }
            //if (s) return "<div class='list plist'><h4>DANH SÁCH VÉ CHẶNG</h4></div>" + s;
            //else return "";
            //console.log("SBODY",$sbody.html());
            return $stageHtml.html();
        },
        _renderPrintSeatTemplate: function () {
            // reload booking seat before print
            //this._reloadSheet();

            var self = this;
            var numSeat = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].NS;

            var $body = $('<div />').addClass('row');

            //Transform matrix for shown template
            var srule = null;
            if (typeof _dict._pSpecialPos != "undefined" && typeof _dict._pSpecialPos[numSeat] != "undefined") {
                srule = _dict._pSpecialPos[numSeat];
            }
            var sMatrix = self._transformSeatMatrix(srule);
            var numCol = 0;
            $.each(sMatrix, function (_, c) {
                $.each(c, function (__, r) {
                    if (typeof r != "undefined" && r != null) {
                        if (numCol < r.length) {
                            numCol = r.length;
                        }
                    }
                });
            });

            var tplNumCoach = sMatrix.length;
            if (_dict._pTplNumCoach != 0) { //Default 0 is not custom set
                tplNumCoach = _dict._pTplNumCoach;
            }
            if (_dict._pTplNumCol != 0) { //Default 0 is not custom set
                numCol = _dict._pTplNumCol;
            }

            var uniqueCustomers = [];
            var coaIndex = 1;
            $.each(sMatrix, function (ix, cx) {
                if (typeof cx != "undefined" && cx != null) {
                    //Create coach
                    var $c = self._createCoach($body).addClass(_dict._g[tplNumCoach - 1]).addClass("SeatTemp" + numSeat);
                    $.each(cx, function (jx, rx) {
                        if (typeof rx != "undefined" && rx != null) {
                            var numExistingItem = rx.numEstIt();
                            var $cSeat = null;
                            for (var i = 0; i < numCol; i++) {
                                if (typeof rx[i] != "undefined" && rx[i] != null) {
                                    var t = rx[i]._getCurrentTicket();
                                    var nTicketPerTrip = 0;
                                    if (!$.isEmptyObject(t) && typeof self._cphoneSt[t._getDefaultPhoneNumber()] != "undefined") {
                                        nTicketPerTrip = self._cphoneSt[t._getDefaultPhoneNumber()].length;
                                    }
                                    var $seat;
                                    if (t.isStageSeat) {
                                        //Show "VÉ CHẶNG" in the Seat Grid PrintPage
                                        $seat = rx[i]._renderPrintStageSeat(nTicketPerTrip);

                                    } else {
                                        $seat = rx[i]._renderPrintSeat(nTicketPerTrip, self._data[self._cTripIndex].StopPoints);

                                        if (typeof (_dict.groupSeat) != 'undefined' && !$.isEmptyObject(t)) {//group
                                            var isMatched = false;
                                            if (uniqueCustomers.length > 0) {
                                                for (var kk = 0; kk < uniqueCustomers.length; kk++) {
                                                    if (self.isTwoSeatPerfectTogether(t, uniqueCustomers[kk], _dict.groupSeat.groupFields)) {
                                                        isMatched = true;
                                                        var display = {
                                                            "data": {
                                                                seatCode: t.seatLabel,
                                                                originalSeatCode: uniqueCustomers[kk].seatLabel,
                                                                nTk: nTicketPerTrip
                                                            }
                                                        };
                                                        var fields = _dict.groupSeat.displayFields.split(',');
                                                        if (fields.length > 0) {
                                                            for (var jj = 0; jj < fields.length; jj++) {
                                                                if (fields[jj].indexOf("phone") >= 0) {
                                                                    if (fields[jj].indexOf("|") >= 0) {
                                                                        display.data.phone = t._cphone.substring(t._cphone.length - parseInt(fields[jj].split("|")[1]));
                                                                    } else {
                                                                        display.data.phone = t._cphone;
                                                                    }
                                                                } else if (fields[jj].indexOf("note") >= 0) {
                                                                    display.data.note = t._note;
                                                                } else if (fields[jj].indexOf("pInfo") >= 0) {
                                                                    display.data.pInfo = t._pInfo.split('|')[0];
                                                                }

                                                                if (t._status == 2 || t._status == 5) {
                                                                    display.data._paid = 'da-thanh-toan';
                                                                } else {
                                                                    display.data._paid = '';
                                                                }
                                                            }
                                                            $seat = rx[i]._renderPrintSeat(nTicketPerTrip, self._data[self._cTripIndex].StopPoints, display.data);
                                                            //$seat = rx[i]._renderCustomData(display);
                                                        }
                                                        break;
                                                    }

                                                }

                                            }
                                            if (!isMatched) {
                                                uniqueCustomers.push(t);
                                            }

                                        }
                                    }
                                    if (!_dict._pNoSeat) {
                                        $seat.addClass(_dict._g[numExistingItem - 1]);
                                    } else {
                                        $seat.addClass(_dict._g[numCol - 1]);
                                    }

                                    if (i == numCol - 1) {
                                        $seat.find('table').addClass("br");
                                    }
                                    if (jx == cx.length - 1) {
                                        $seat.find('table').addClass("bb");
                                    }

                                    $c.append($seat);

                                    //Assign current seat
                                    $cSeat = $seat;

                                } else {
                                    if (_dict._pNoSeat) {
                                        $c.append(self._renderPrintNoSeat().addClass(_dict._g[numCol - 1]));
                                    }
                                }
                            }

                            //Add border to last item
                            if ($cSeat != null) {
                                $cSeat.find('table').addClass('br');
                            }
                        }
                    });
                    // print special note
                    if (_dict._pSNote != undefined && _dict._pSNote) {
                        var dSNoteInfo = {};
                        var $pSNote = null;
                        if (_dict._pSNoteCoachEffective != undefined) {
                            if (_dict._pSNoteCoachEffective[numSeat] != undefined) {
                                if (_dict._pSNoteCoachEffective[numSeat] == coaIndex) {
                                    if (_dict._pSNoteInfo != undefined && _dict._pSNoteInfo[numSeat] != undefined && _dict._pSNoteInfo[numSeat][coaIndex] != undefined) {
                                        $pSNote = $(vtpl(_dict._pSNoteInfo[numSeat][coaIndex], dSNoteInfo));
                                        $c.append($pSNote);
                                    }
                                }
                            } else {
                                if (_dict._pSNoteInfo != undefined && _dict._pSNoteInfo[numSeat] != undefined && _dict._pSNoteInfo[numSeat][coaIndex] != undefined) {
                                    $pSNote = $(vtpl(_dict._pSNoteInfo[numSeat][coaIndex], dSNoteInfo));
                                    $c.append($pSNote);
                                }
                            }
                        }
                    }
                }
                coaIndex++;
            });

            return $body;
        },
        _renderPrintNoSeat: function () {
            return $('<li />').addClass('print-noseat').html('&nbsp;');
        },

        _renderPrintTripInfo: function () {
            var self = this;
            var $html = null;
            if (typeof _dict._pSummaryTripInfoPageBreak != "undefined" && _dict._pSummaryTripInfoPageBreak) {
                $html = $('<div class="row" />').css('page-break-before', 'always');
            } else {
                $html = $('<div class="row" />');
            }
            //Prepare data
            var tInfo = self._getCurrentTripInfo();
            var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
            var anotherFareTienKhach = tInfo._anotherFareTienKhach;
            var mainFareTienKhach = tInfo._mainFareTienKhach;
            var feeTienKhach = tInfo._feeTienKhach;
            var feeTienHang = tInfo._feeTienHang;
            var totalFareTienKhach = anotherFareTienKhach + mainFareTienKhach - feeTienKhach;
            var totalFareTienHang = tInfo._totalMoneyBranchNotPaid + tInfo._totalMoneyBranchPaid + tInfo._moneyPickedProNotPaid + tInfo._moneyPickedProPaid - feeTienHang;
            var totalAnotherFee = 0;
            if (tInfo._anotherFee.length > 0) {
                $.each(tInfo._anotherFee, function (ni, nk) {
                    totalAnotherFee += nk._money.toNum();
                });
            }
            var totalFee = tInfo._tollFee + tInfo._washFee + tInfo._eatFee + totalAnotherFee;
            var totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;

            var res = [];
            if (tInfo._branchProduct.length > 0) {
                $.each(tInfo._branchProduct, function (ki, kl) {
                    var moneyPaid = ".................";
                    var moneyNotPaid = ".................";
                    if (kl._moneyBranchProPaid > 0) {
                        moneyPaid = kl._moneyBranchProPaid.toMn();
                    }
                    if (kl._moneyBranchProNotPaid > 0) {
                        moneyNotPaid = kl._moneyBranchProNotPaid.toMn();
                    }
                    var fg = kl._branchCode + ": " + "Đã T<sup>2</sup>-" + moneyPaid + "đ, Chưa T<sup>2</sup>-" + moneyNotPaid + "đ";
                    res.push(fg);
                });
            }
            var pickedProductFormat = "";
            var moneyPickedProPaid = "..................................";
            var moneyPickedProNotPaid = "..................................";
            if (tInfo._moneyPickedProPaid > 0) {
                moneyPickedProPaid = "Đã T<sup>2</sup>-" + tInfo._moneyPickedProPaid.toMn() + "đ, ";
            } else {
                moneyPickedProPaid = "Đã T<sup>2</sup>-..................đ, ";
            }
            if (tInfo._moneyPickedProNotPaid > 0) {
                moneyPickedProNotPaid = "Chưa T<sup>2</sup>-" + tInfo._moneyPickedProNotPaid.toMn() + "đ";
            } else {
                moneyPickedProNotPaid = "Chưa T<sup>2</sup>-.................đ";
            }
            pickedProductFormat = moneyPickedProPaid + moneyPickedProNotPaid;

            var anotherFee = [];
            if (tInfo._anotherFee.length > 0) {
                $.each(tInfo._anotherFee, function (kj, km) {
                    if (km._name != '' && km._money > 0) {
                        anotherFee.push(km._name + " - " + (km._money).toNum().toMn() + " đ");
                    }
                });
            }
            var totalFareTienKhachFormat = "";
            var totalFareTienHangFormat = "";
            var totalFeeFormat = "";
            var totalTotalFormat = "";
            if (closedStatus == 2) {
                totalFareTienKhachFormat = totalFareTienKhach.toMn() + " đ";
                totalFareTienHangFormat = totalFareTienHang.toMn() + " đ";
                totalFeeFormat = totalFee.toMn() + " đ";
                totalTotalFormat = totalTotal.toMn() + " đ";
            }

            var feeTienKhachFormat = "";
            var totalTienKhachFormat = "";
            var totalTienHangFormat = "";
            if (feeTienKhach > 0) {
                feeTienKhachFormat = "Chi phí VP:&nbsp;&nbsp;" + feeTienKhach.toMn() + " đ";
                totalTienKhachFormat = "Còn:&nbsp;&nbsp;" + (tInfo._totalPaid + anotherFareTienKhach - feeTienKhach).toMn() + " đ";
            }
            if (feeTienHang > 0) {
                totalTienHangFormat = "CP hàng:&nbsp;" + feeTienHang.toMn() + " đ" + "&nbsp;&nbsp;&#x21d2;&nbsp;&nbsp;Còn:&nbsp;&nbsp;" + totalFareTienHangFormat;
            } else {
                totalTienHangFormat = "&#x21d2;&nbsp;&nbsp;Tổng:&nbsp;&nbsp;" + totalFareTienHangFormat;
            }
            var data = {
                "p": {
                    _title: $.trim(self.options.cifne),
                    _rname: $.trim(self._data[self._cTripIndex].Name),
                    _time: $.trim(self._cTripTime) + '&nbsp;ngày&nbsp;' + $.trim(self._cTripDate.toFormatString('dd-mm-yyyy')),
                    _busNum: tInfo._vehicleNumber,
                    _driverName: tInfo._driverName,
                    _assistantName: tInfo._assistantName,
                    _totalPaidPerType: tInfo._totalPaidPerType,
                    _totalBookingPerAgent: tInfo._totalBookingPerAgent,
                    _totalPaid: tInfo._totalPaid > 0 ? tInfo._totalPaid.toMn() + " đ" : "",
                    _totalMoney: tInfo._totalMoney,
                    _tollFee: tInfo._tollFee != 0 ? tInfo._tollFee.toMn() + " đ" : "..................đ",
                    _washFee: tInfo._washFee != 0 ? tInfo._washFee.toMn() + " đ" : ".......................đ",
                    _eatFee: tInfo._eatFee != 0 ? tInfo._eatFee.toMn() + " đ" : "........................đ",
                    _feeTienHang: tInfo._feeTienHang != 0 ? tInfo._feeTienHang.toMn() + " đ" : ".....................đ",
                    _moneyBranchProduct: res.join('<br />'),
                    _anotherFee: anotherFee.join('<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'),
                    _totalTienKhach: totalFareTienKhachFormat,
                    _totalTienHang: totalFareTienHangFormat,
                    _totalFee: totalFeeFormat,
                    _totalTotal: totalTotalFormat,
                    _feeTienKhachFormat: feeTienKhachFormat,
                    _totalTienKhachFormat: totalTienKhachFormat,
                    _anotherFareTienKhachFormat: anotherFareTienKhach > 0 ? "(DT khác: " + anotherFareTienKhach.toMn() + " đ)" : "",
                    _totalTienHangFormat: totalTienHangFormat,
                    _pickedProductFormat: pickedProductFormat
                }
            };
            $html.append($(vtpl(_dict._tripInfo, data)));

            return $html;
        },

        _renderPrintTripInfo: function () {
            var self = this;
            var $html = null;
            if (typeof _dict._pSummaryTripInfoPageBreak != "undefined" && _dict._pSummaryTripInfoPageBreak) {
                $html = $('<div class="row" />').css('page-break-before', 'always');
            } else {
                $html = $('<div class="row" />');
            }
            //Prepare data
            var tInfo = self._getCurrentTripInfo();
            var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
            var anotherFareTienKhach = tInfo._anotherFareTienKhach;
            var mainFareTienKhach = tInfo._mainFareTienKhach;
            var feeTienKhach = tInfo._feeTienKhach;
            var feeTienHang = tInfo._feeTienHang;
            var totalFareTienKhach = anotherFareTienKhach + mainFareTienKhach - feeTienKhach;
            var totalFareTienHang = tInfo._totalMoneyBranchNotPaid + tInfo._totalMoneyBranchPaid + tInfo._moneyPickedProNotPaid + tInfo._moneyPickedProPaid - feeTienHang;
            var totalAnotherFee = 0;
            if (tInfo._anotherFee.length > 0) {
                $.each(tInfo._anotherFee, function (ni, nk) {
                    totalAnotherFee += nk._money.toNum();
                });
            }
            var totalFee = tInfo._tollFee + tInfo._washFee + tInfo._eatFee + totalAnotherFee;
            var totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;

            var res = [];
            if (tInfo._branchProduct.length > 0) {
                $.each(tInfo._branchProduct, function (ki, kl) {
                    var moneyPaid = ".................";
                    var moneyNotPaid = ".................";
                    if (kl._moneyBranchProPaid > 0) {
                        moneyPaid = kl._moneyBranchProPaid.toMn();
                    }
                    if (kl._moneyBranchProNotPaid > 0) {
                        moneyNotPaid = kl._moneyBranchProNotPaid.toMn();
                    }
                    var fg = kl._branchCode + ": " + "Đã T<sup>2</sup>-" + moneyPaid + "đ, Chưa T<sup>2</sup>-" + moneyNotPaid + "đ";
                    res.push(fg);
                });
            }
            var pickedProductFormat = "";
            var moneyPickedProPaid = "..................................";
            var moneyPickedProNotPaid = "..................................";
            if (tInfo._moneyPickedProPaid > 0) {
                moneyPickedProPaid = "Đã T<sup>2</sup>-" + tInfo._moneyPickedProPaid.toMn() + "đ, ";
            } else {
                moneyPickedProPaid = "Đã T<sup>2</sup>-..................đ, ";
            }
            if (tInfo._moneyPickedProNotPaid > 0) {
                moneyPickedProNotPaid = "Chưa T<sup>2</sup>-" + tInfo._moneyPickedProNotPaid.toMn() + "đ";
            } else {
                moneyPickedProNotPaid = "Chưa T<sup>2</sup>-.................đ";
            }
            pickedProductFormat = moneyPickedProPaid + moneyPickedProNotPaid;

            var anotherFee = [];
            if (tInfo._anotherFee.length > 0) {
                $.each(tInfo._anotherFee, function (kj, km) {
                    if (km._name != '' && km._money > 0) {
                        anotherFee.push(km._name + " - " + (km._money).toNum().toMn() + " đ");
                    }
                });
            }
            var totalFareTienKhachFormat = "";
            var totalFareTienHangFormat = "";
            var totalFeeFormat = "";
            var totalTotalFormat = "";
            if (closedStatus == 2) {
                totalFareTienKhachFormat = totalFareTienKhach.toMn() + " đ";
                totalFareTienHangFormat = totalFareTienHang.toMn() + " đ";
                totalFeeFormat = totalFee.toMn() + " đ";
                totalTotalFormat = totalTotal.toMn() + " đ";
            }

            var feeTienKhachFormat = "";
            var totalTienKhachFormat = "";
            var totalTienHangFormat = "";
            if (feeTienKhach > 0) {
                feeTienKhachFormat = "Chi phí VP:&nbsp;&nbsp;" + feeTienKhach.toMn() + " đ";
                totalTienKhachFormat = "Còn:&nbsp;&nbsp;" + (tInfo._totalPaid + anotherFareTienKhach - feeTienKhach).toMn() + " đ";
            }
            if (feeTienHang > 0) {
                totalTienHangFormat = "CP hàng:&nbsp;" + feeTienHang.toMn() + " đ" + "&nbsp;&nbsp;&#x21d2;&nbsp;&nbsp;Còn:&nbsp;&nbsp;" + totalFareTienHangFormat;
            } else {
                totalTienHangFormat = "&#x21d2;&nbsp;&nbsp;Tổng:&nbsp;&nbsp;" + totalFareTienHangFormat;
            }
            var data = {
                "p": {
                    _title: $.trim(self.options.cifne),
                    _rname: $.trim(self._data[self._cTripIndex].Name),
                    _time: $.trim(self._cTripTime) + '&nbsp;ngày&nbsp;' + $.trim(self._cTripDate.toFormatString('dd-mm-yyyy')),
                    _busNum: tInfo._vehicleNumber,
                    _driverName: tInfo._driverName,
                    _assistantName: tInfo._assistantName,
                    _totalPaidPerType: tInfo._totalPaidPerType,
                    _totalBookingPerAgent: tInfo._totalBookingPerAgent,
                    _totalPaid: tInfo._totalPaid > 0 ? tInfo._totalPaid.toMn() + " đ" : "",
                    _totalMoney: tInfo._totalMoney,
                    _tollFee: tInfo._tollFee != 0 ? tInfo._tollFee.toMn() + " đ" : "..................đ",
                    _washFee: tInfo._washFee != 0 ? tInfo._washFee.toMn() + " đ" : ".......................đ",
                    _eatFee: tInfo._eatFee != 0 ? tInfo._eatFee.toMn() + " đ" : "........................đ",
                    _feeTienHang: tInfo._feeTienHang != 0 ? tInfo._feeTienHang.toMn() + " đ" : ".....................đ",
                    _moneyBranchProduct: res.join('<br />'),
                    _anotherFee: anotherFee.join('<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'),
                    _totalTienKhach: totalFareTienKhachFormat,
                    _totalTienHang: totalFareTienHangFormat,
                    _totalFee: totalFeeFormat,
                    _totalTotal: totalTotalFormat,
                    _feeTienKhachFormat: feeTienKhachFormat,
                    _totalTienKhachFormat: totalTienKhachFormat,
                    _anotherFareTienKhachFormat: anotherFareTienKhach > 0 ? "(DT khác: " + anotherFareTienKhach.toMn() + " đ)" : "",
                    _totalTienHangFormat: totalTienHangFormat,
                    _pickedProductFormat: pickedProductFormat
                }
            };
            $html.append($(vtpl(_dict._tripInfo, data)));

            return $html;
        },
        _inDanhSach: function () {
            // reload booking seat before print
            //this._reloadSheet();
            var self = this;
            var fromCode = "";
            var fromName = "";
            var toCode = "";
            var toName = "";
            if (app.oRights["StageEnable"]) {
                return self._renderStageTicketsTemplate();
            } else {
                var $table = $(_dict._pclTpl);
                var $tbody = $table.find('tbody');

                var stickets = [];
                var stickets2 = [];
                var nstickets = [];
                var nstickets2 = [];

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
                                            if (t.fromArea != undefined && t.fromArea != null) {
                                                var fromArea = t.fromArea.split('|');
                                                fromCode = fromArea[2];
                                                fromName = fromArea[3];
                                            }
                                            if (t.toArea != undefined && t.toArea != null) {
                                                var toArea = t.toArea.split('|');
                                                toCode = toArea[2];
                                                toName = toArea[3];
                                            }

                                            if (t.isStageSeat) {
                                                console.log(t);
                                            }
                                            var pInfo = t._getPickupInfo();
                                            var pText = "";
                                            if (!$.isEmptyObject(pInfo)) {
                                                pText = pInfo.text;
                                            }
                                            var cname = t._cname;
                                            var cphone = t._getDefaultPhoneNumber();

                                            nstickets2.push({
                                                _seatCodes: [s._label],
                                                _cname: cname,
                                                _cphone: cphone,
                                                _pText: pText,
                                                _note: t._note,
                                                _status: t._status,
                                                _class: "",
                                                _seri: t._seri,
                                                _cuser: t._cuser,
                                                _suser: t._suser,
                                                _fare: t._fare,
                                                _fromCode: fromCode,
                                                _fromName: fromName,
                                                _toCode: toCode,
                                                _toName: toName
                                            });

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
                                    var data = {
                                        "seat": {
                                            _index: index,
                                            _cname: sx._cname,
                                            _cphone: sx._cphone,
                                            _pText: sx._pText,
                                            _note: sx._note,
                                            _seatCodes: sx._seatCodes.join(", "),
                                            _status: sx._status == 1 ? "Đặt chỗ" : "Đã TT",
                                            _class: sx._class,
                                            _seri: sx._seri,
                                            _cuser: sx._cuser,
                                            _suser: sx._suser,
                                            _fare: sx._fare.toMn() + " đ",
                                            _fromCode: sx._fromCode,
                                            _fromName: sx._fromName,
                                            _toCode: sx._toCode,
                                            _toName: sx._toName
                                        }
                                    }

                                    var $tr = $(vtpl(_dict._ipcLTpl, data));
                                    $tbody.append($tr);
                                    index++;
                                }
                            });
                        }
                    });
                } else {
                    $tbody.append($('<tr />').append($('<td />').attr('colspan', '6').text("Chưa có hành khách đặt vé chuyến xe này")));
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
                return $body;
            }
        },

        /* Pickup */
        _renderPickupBKSTitle: function () {
            var self = this;

            var $title = $('<div />').addClass('row');
            //Prepare data
            var tInfo = self._getCurrentTripInfo();
            var data = {
                "p": {
                    _title: $.trim(self.options.cifne),
                    _rname: $.trim(self._data[self._cTripIndex].Name),
                    _time: $.trim(self._cTripTime) + '&nbsp;ngày&nbsp;' + $.trim(self._cTripDate.toFormatString('dd-mm-yyyy')),
                    _busNum: tInfo._vehicleNumber,
                    _driverName: tInfo._driverName,
                    _assistantName: tInfo._assistantName
                }
            };
            $title.append($(vtpl(_dict._pPickupTitleTpl, data)));

            return $title;
        },
        _printPickupTicket: function () {
            var self = this;
            var $printContent = $('<div />').addClass('print-container')
                .append(self._renderPickupBKSTitle()).append(self._renderPrintPickupTemplate());
            // in thông tin phụ của danh sách đón khách
            if (typeof _dict._pSummaryPickupInfo != "undefined" && _dict._pSummaryPickupInfo) {
                $printContent.append(self._renderPrintPickupInfo());
            }
            //var windowUrl = 'about:blank';
            //var uniqueName = new Date();
            var windowName = 'PickupList' + (new Date()).getTime();
            var printWindow = window.open('about:blank', windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            printWindow.document.write(
                '<html>' +
                    '<head>' +
                        '<title>' + windowName + '</title>' +
                        '<link rel="stylesheet" href="' + _dict._pStyleUrl + '" type="text/css" />' +
                    '</head>' +
                    '<body onload="window.top.print()" >' +
                        $printContent.html() +
                    '</body>' +
                '</html>'
                );

            //var windowName = 'PickupList' + uniqueName.getTime();
            //var printWindow = window.open(windowUrl, windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            //printWindow.document.write('<html><head><title>' + windowName + '</title>');
            //printWindow.document.write('<link rel="stylesheet" href="' + self.options.baseUrl + _dict._pStyleUrl + '" type="text/css" />');
            //printWindow.document.write('</head><body onload="window.top.print()" >');
            //printWindow.document.write($printContent.html());
            //printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
        },
        _renderPrintPickupTemplate: function () {
            var self = this;
            var stickets = [];
            var nstickets = [];
            var nstickets2 = [];
            var customer = [];
            var total = 0;
            var totalSeat = 0;
            $.each(self._m, function (ic, c) {
                if (typeof c != "undefined") {
                    $.each(c, function (ir, r) {
                        if (typeof r != "undefined") {
                            $.each(r, function (is, s) {
                                if (typeof s != "undefined" && s != null) {
                                    if (s._hasTicket()) {
                                        var t = s._getCurrentTicket();
                                        if (!$.isEmptyObject(t)) {
                                            var pInfo = t._getPickupInfo();
                                            if (!$.isEmptyObject(pInfo) && vIsEstStr(pInfo.text) && pInfo.type == 'P') {
                                                var ticketCode = t._code;
                                                var cname = t._cname;
                                                var cphone = t._getDefaultPhoneNumber();
                                                var pIndex = parseInt(pInfo.pIndex);
                                                var pText = pInfo.text;
                                                if (isNaN(pIndex)) {
                                                    pIndex = 0;
                                                }
                                                if (typeof stickets[pIndex] == "undefined") {
                                                    stickets[pIndex] = [];
                                                }

                                                if (pIndex == 0) {
                                                    if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                                        var nTextCode = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                        var nKeyCode = customer.indexOf(nTextCode);
                                                        if (nKeyCode == -1) {
                                                            nKeyCode = customer.push(nTextCode) - 1;
                                                        }

                                                        if (typeof nstickets[nKeyCode] == "undefined") {
                                                            nstickets[nKeyCode] = {
                                                                _pIndex: pIndex,
                                                                _seatCodes: [],
                                                                _seatInfos: [],
                                                                _tids: [],
                                                                _cname: cname,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _pdate: [],
                                                                _status: t._status,
                                                                _cuser: t._cuser,
                                                                _total: 0
                                                            };
                                                        }
                                                        nstickets[nKeyCode]._seatCodes.push(s._label);
                                                        nstickets[nKeyCode]._seatInfos.push(s._getSeatInfo());
                                                        nstickets[nKeyCode]._tids.push(t._id);
                                                        nstickets[nKeyCode]._pdate.push(t._pdate.toFormatString('iso'));
                                                        nstickets[nKeyCode]._total += t._fare;
                                                    } else {
                                                        if (!vIsEstStr(cphone)) {
                                                            nstickets2.push({
                                                                _seatCodes: [s._label],
                                                                _cname: cname,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _status: t._status,
                                                                _total: t._fare
                                                            });
                                                        } else {
                                                            var ntext = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                            var nkey = customer.indexOf(ntext);
                                                            if (nkey == -1) {
                                                                nkey = customer.push(ntext) - 1;
                                                            }

                                                            if (typeof nstickets[nkey] == "undefined") {
                                                                nstickets[nkey] = {
                                                                    _seatCodes: [],
                                                                    _cname: cname,
                                                                    _code: ticketCode,
                                                                    _cphone: cphone,
                                                                    _pText: pText,
                                                                    _note: t._note,
                                                                    _status: t._status,
                                                                    _total: 0
                                                                };
                                                            }
                                                            nstickets[nkey]._seatCodes.push(s._label);
                                                            nstickets[nkey]._total += t._fare;
                                                        }
                                                    }
                                                } else {
                                                    if (typeof stickets[pIndex] == "undefined") {
                                                        stickets[pIndex] = [];
                                                    }
                                                    if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                                        var sTextCode = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                        var sKeyCode = customer.indexOf(sTextCode);
                                                        if (sKeyCode == -1) {
                                                            sKeyCode = customer.push(sTextCode) - 1;
                                                        }
                                                        if (typeof stickets[pIndex][sKeyCode] == "undefined") {
                                                            stickets[pIndex][sKeyCode] = {
                                                                _pIndex: pIndex,
                                                                _seatCodes: [],
                                                                _seatInfos: [],
                                                                _tids: [],
                                                                _cname: cname,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _pdate: [],
                                                                _status: t._status,
                                                                _cuser: t._cuser,
                                                                _total: 0
                                                            };
                                                        }
                                                        stickets[pIndex][sKeyCode]._seatCodes.push(s._label);
                                                        stickets[pIndex][sKeyCode]._seatInfos.push(s._getSeatInfo());
                                                        stickets[pIndex][sKeyCode]._tids.push(t._id);
                                                        stickets[pIndex][sKeyCode]._pdate.push(t._pdate.toFormatString('iso'));
                                                        stickets[pIndex][sKeyCode]._total += t._fare;
                                                    } else {
                                                        var text = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                        var key = customer.indexOf(text);
                                                        if (key == -1) {
                                                            key = customer.push(text) - 1;
                                                        }
                                                        if (typeof stickets[pIndex][key] == "undefined") {
                                                            stickets[pIndex][key] = {
                                                                _seatCodes: [],
                                                                _cname: cname,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _status: t._status,
                                                                _total: 0
                                                            };
                                                        }
                                                        stickets[pIndex][key]._seatCodes.push(s._label);
                                                        stickets[pIndex][key]._total += t._fare;
                                                    }
                                                }

                                                //Total
                                                total += t._fare;
                                                totalSeat++;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });

            //Merge not sorted to tail
            if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
                stickets[stickets.length] = nstickets;
            } else {
                stickets[stickets.length] = nstickets.concat(nstickets2);
            }

            var $pickUp = $(vtpl(_dict._ppuTpl, { 't': { _total: total.toMn() + "đ", _totalSeat: totalSeat } }));
            var $pbody = $pickUp.find('tbody');

            if (stickets.length > 0) {
                var index = 1;
                $.each(stickets, function (ix, sx) {
                    if (typeof sx != "undefined" && sx != null) {
                        if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
                            Object.keys(sx).forEach(function (key) {
                                var value = sx[key];
                                var data = {
                                    "seat": {
                                        _index: index,
                                        _cname: value._cname,
                                        _cphone: value._cphone,
                                        _code: value._code,
                                        _pText: value._pText,
                                        _note: value._note,
                                        _seatCodes: value._seatCodes.join(", "),
                                        _numSeat: value._seatCodes.length,
                                        _status: value._status == 1 ? "Đặt chỗ" : "Đã thanh toán",
                                        _total: value._total.toMn() + "đ"
                                    }
                                }
                                var $tr = $(vtpl(_dict._ippuTpl, data));
                                $pbody.append($tr);
                                index++;
                            });
                        } else {
                            $.each(sx, function (_, s) {
                                if (typeof s != "undefined" && s != null) {
                                    var data = {
                                        "seat": {
                                            _index: index,
                                            _cname: s._cname,
                                            _cphone: s._cphone,
                                            _code: s._code,
                                            _pText: s._pText,
                                            _note: s._note,
                                            _seatCodes: s._seatCodes.join(", "),
                                            _numSeat: s._seatCodes.length,
                                            _status: s._status == 1 ? "Đặt chỗ" : "Đã thanh toán",
                                            _total: s._total.toMn() + "đ"
                                        }
                                    }
                                    var $tr = $(vtpl(_dict._ippuTpl, data));
                                    $pbody.append($tr);
                                    index++;
                                }
                            });
                        }
                    }
                });
            }

            return $pickUp;
        },
        _renderPrintPickupInfo: function () {
            var self = this;
            var $html = null;
            if (_dict._pSummaryPickupInfoPageBreak != undefined && _dict._pSummaryPickupInfoPageBreak) {
                $html = $('<div class="row" />').css('page-break-before', 'always');
            } else {
                $html = $('<div class="row" />');
            }
            //Prepare data
            var tInfo = self._getCurrentTripInfo();
            var data = {
                "p": {
                    _title: $.trim(self.options.cifne),
                    _rname: $.trim(self._data[self._cTripIndex].Name),
                    _time: $.trim(self._cTripTime) + '&nbsp;ngày&nbsp;' + $.trim(self._cTripDate.toFormatString('dd-mm-yyyy')),
                    _busNum: tInfo._vehicleNumber,
                    _driverName: tInfo._driverName,
                    _assistantName: tInfo._assistantName
                }
            };
            $html.append($(vtpl(_dict._sumPickupInfo, data)));

            return $html;
        },

        /* Transfer */
        _renderTransferTitle: function (times) {
            /// <summary>
            /// Render transfer template before print
            /// </summary>
            /// <param name="times">List of times</param>
            var self = this;
            var $title = $('<div />').addClass('row');
            //Prepare data
            var tInfo = self._getCurrentTripInfo();
            var data = {
                "p": {
                    _title: $.trim(self.options.cifne),
                    _rname: $.trim(self._data[self._cTripIndex].Name),
                    _time: $.trim(times.join(', ')) + '&nbsp;ngày&nbsp;' + $.trim(self._cTripDate.toFormatString('dd-mm-yyyy')),
                    _busNum: tInfo._vehicleNumber,
                    _driverName: tInfo._driverName,
                    _assistantName: tInfo._assistantName
                }
            };
            $title.append($(vtpl(_dict._pTransferTitleTpl, data)));
            return $title;
        },
        _printTransferTicket: function (groupIndex) {
            var self = this;
            var groupItems = self._$transfer[groupIndex];
            var $printContent = $('<div />').addClass('print-container')
                .append(this._renderTransferTitle(groupItems._times)).append(this._renderPrintTransferTemplate(groupItems));
            var windowName = 'TransferList' + (new Date()).getTime();
            var printWindow = window.open('about:blank', windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            printWindow.document.write(
                '<html>' +
                    '<head>' +
                        '<title>' + windowName + '</title>' +
                        '<link rel="stylesheet" href="' + _dict._pStyleUrl + '" type="text/css" />' +
                    '</head>' +
                    '<body onload="window.top.print()" >' +
                        $printContent.html() +
                    '</body>' +
                '</html>'
                );
            printWindow.document.close();
            printWindow.focus();
        },
        _renderPrintTransferTemplate: function (groupItems) {
            var self = this;
            //var tName = self._data[self._cTripIndex].Name;
            var totalSeat = 0;
            if (groupItems._items.length > 0) {
                $.each(groupItems._items, function (_, s) {
                    if (typeof s != "undefined" && s != null) {
                        if (s._seatCodes.length > 0) {
                            totalSeat += s._seatCodes.length;
                        }
                    }
                });
            }

            //var $transferUp = $(vtpl(_dict._ptsfTpl, { "t": { _tName: tName, _timeSlots: group._times.join(', '), _tDate: self._cTripDate.toFormatString('dd-mm-yyyy'), _total: group._total.toMn() + "đ", _totalSeat: totalSeat } }));
            var $transferUp = $(vtpl(_dict._ptsfTpl_NoSub, { "t": { _total: groupItems._total.toMn() + "đ", _totalSeat: totalSeat } }));

            var $tbody = $transferUp.find('tbody');
            if (groupItems._items.length > 0) {
                var index = 1;
                $.each(groupItems._items, function (_, s) {
                    if (typeof s != "undefined" && s != null) {
                        var data = {
                            "seat": {
                                _index: index,
                                _cname: s._cname,
                                _cphone: s._cphone,
                                _pText: s._pText,
                                _note: s._note,
                                _seatCodes: s._seatCodes.join(", "),
                                _status: s._status == 1 ? "Đặt chỗ" : "Đã thanh toán",
                                _total: s._total.toMn() + "đ",
                                _time: s._time,
                                _numSeat: s._seatCodes.length,
                                _driverName: s._driverName != "" ? s._driverName : s._time
                            }
                        }
                        var $tr = $(vtpl(_dict._iptsfTpl, data));
                        $tbody.append($tr);
                        index++;
                    }
                });
                return $transferUp;
            }
            return $();
        },

        isNullOrEmptyString: function (str) {
            return !(typeof (str) != 'undefined' && str != null && str != '');
        },

        isTwoSeatPerfectTogether: function (seat1, seat2, conditions) {
            var self = this;
            if (typeof (conditions) != 'undefined' && conditions != null
                ) {
                var cs = conditions.split('->');
                for (var i = 0; i < cs.length; i++) {
                    if (cs[i] == "phone") {
                        if (self.isNullOrEmptyString(seat1._cphone) && self.isNullOrEmptyString(seat2._cphone)) {
                            continue;
                        } else if (!self.isNullOrEmptyString(seat1._cphone) && !self.isNullOrEmptyString(seat2._cphone)) {//both not null
                            return seat1._cphone == seat2._cphone;
                        } else {
                            return false;
                        }
                    } else if (cs[i] == "ticketCode") {
                        if (!self.isNullOrEmptyString(seat1._code) && !self.isNullOrEmptyString(seat2._code)) {
                            return seat1._code == seat2._code;
                        } else {
                            return false;
                        }
                    }
                }
            } else {
                return false;
            }
        },

    });
})(jQuery);