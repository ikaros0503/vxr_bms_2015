/*
 * .................Print ETicket...................
 */
define({
    start: function (o) {
        var me = this;
        var cTrip = null, tId = null, tName = null, tDate = null;
        vev('body', 'collectDataForPrintETicket', function (e) { // collect data for print eticket
            cTrip = e.d.cTrip;
            tId = e.d.tId;
            tName = e.d.tName;
            tDate = e.d.tDate;
            vbf('onGetCurrentTripInfo');
        });
        vev('body', 'doPrintETicket', function (e) { // do print eticket
            me._creatPrintETicketContainer();
            me._creatPrintETicketBody();
            me._printETicket(e.d.tripInfo, cTrip, tId, tName, tDate);
        });
    },
    _creatPrintETicketContainer: function () {
        this._$printETicketContainer = $('<div />')
            .addClass('print-container');
    },
    _creatPrintETicketBody: function () {
        this._$printETicketBody = $('<div />').addClass('row')
            .appendTo(this._$printETicketContainer);
    },
    _resetETicket: function () {
        this._$printETicketBody.empty();
    },
    _printETicket: function (tIf, cTrip, tId, tName, tDate) {
        var me = this;
        me._resetETicket();
        me._renderETicket(tIf, cTrip, tId, tName, tDate);
        var printContent = $('<div />').append(me._$printETicketContainer).html();
        var windowUrl = 'about:blank';
        var uniqueName = new Date();
        var windowName = 'ETicket' + uniqueName.getTime();
        var printWindow = window.open(windowUrl, windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
        printWindow.document.write('<html><head><title>' + windowName + '</title>');
        printWindow.document.write('<link rel="stylesheet" href="' + app.baseUrl + _dict._eStyleUrl + '" type="text/css" />');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.focus();
        setTimeout(function () {
            printWindow.print();
        }, 500);
        if (typeof _dict._hasQuickPrint != "undefined" && _dict._hasQuickPrint) {
            setTimeout(function () {
                printWindow.close();
            }, 1000);
        }
    },
    _renderETicket: function (tIf, cTrip, tId, tName, tDate) {
        var me = this;
        //Prepare data
        var data = [];
        var tripName = cTrip.Name.split('-');
        var fArea = "", tArea = "";
        var fAreaTicket = "", tAreaTicket = "";
        var fTemp = cTrip.FromArea.split('~');
        if (fTemp.length > 1) fArea = fTemp[1].split('|')[3];
        var tTemp = cTrip.ToArea.split('~');
        if (tTemp.length > 1) tArea = tTemp[1].split('|')[3];

        //Branch info
        var branch = {};
        $.each(app.branchInfo, function (_, b) {
            if ($.isEmptyObject(branch)) {
                if (b[0] == app.aid) {
                    branch = b;
                }
            }
        });
        if (!_dict._multiSeatOnTicket) {
            $.each(app.seatStack, function (_, s) {
                var t = s._getCurrentTicket();
                if (t.fromArea) fAreaTicket = t.fromArea.split('|')[3];
                if (t.toArea) tAreaTicket = t.toArea.split('|')[3];
                if (!$.isEmptyObject(t)) {
                    var pInfo = t._getPickupInfo();
                    var pText = "";
                    if (!$.isEmptyObject(pInfo)) pText = pInfo.text;
                    var from = $.trim(tripName[0]);
                    var to = $.trim(tripName[1]);
                    if (t.stage_point1 != null) {
                        from = t.stage_point1.Name;
                        to = t.stage_point2.Name;
                    }
                    data.push({
                        "ticket": {
                            _phone: $.trim(branch[5]),
                            _address: $.trim(branch[4]),
                            _from: from,
                            _to: to,
                            _fromArea: fAreaTicket != "" ? fAreaTicket : fArea,
                            _toArea: tAreaTicket != "" ? tAreaTicket : tArea,
                            _tripDate: t._pdate.toFormatString('dd/mm/yyyy'),
                            _tripHour: t._pdate.toFormatString('hh:mm'),
                            _numSeat: 1,
                            _seatCodes: [s._label],
                            _fare: t._fare,
                            _total: t._fare,
                            _cname: t._cname,
                            _cphone: t._getDefaultPhoneNumber(),
                            _pick: pText,
                            _user: app.un,
                            _note: t._note,
                            _deposit: t._deposit.toMn() + " đ",
                            _vehicleNumber: tIf._vehicleNumber
                        }
                    });
                }
            });
        } else {
            var customer = [];
            $.each(app.seatStack, function (_, s) {
                var t = s._getCurrentTicket();
                if (t.fromArea) fAreaTicket = t.fromArea.split('|')[3];
                if (t.toArea) tAreaTicket = t.toArea.split('|')[3];
                if (!$.isEmptyObject(t)) {
                    var pInfo = t._getPickupInfo();
                    var pText = "";
                    if (!$.isEmptyObject(pInfo)) pText = pInfo.text;
                    var ctm = (t._cname + t._cphone + pText).hashCode();
                    var key = customer.indexOf(ctm);
                    if (key == -1) {
                        key = customer.push(ctm) - 1;
                    }
                    if (typeof data[key] == "undefined") {
                        data[key] = {
                            "ticket": {
                                _phone: $.trim(branch[5]),
                                _address: $.trim(branch[4]),
                                _from: $.trim(tripName[0]),
                                _to: $.trim(tripName[1]),
                                _fromArea: fAreaTicket != "" ? fAreaTicket : fArea,
                                _toArea: tAreaTicket != "" ? tAreaTicket : tArea,
                                _tripDate: t._pdate.toFormatString('dd/mm/yyyy'),
                                _tripHour: t._pdate.toFormatString('hh:mm'),
                                _numSeat: 0,
                                _seatCodes: [],
                                _fare: t._fare,
                                _total: 0,
                                _cname: t._cname,
                                _cphone: t._getDefaultPhoneNumber(),
                                _pick: pText,
                                _user: app.un,
                                _note: t._note,
                                _deposit: t._deposit.toMn() + " đ",
                                _vehicleNumber: tIf._vehicleNumber
                            }
                        };
                    }
                    data[key]["ticket"]["_seatCodes"].push(s._label);
                    data[key]["ticket"]["_total"] += t._fare;
                    data[key]["ticket"]["_numSeat"]++;
                    if (typeof data[key]["ticket"]["_deposit"] != "undefined" && typeof t._deposit != "undefined" && t._deposit != 0) {
                        data[key]["ticket"]["_fare"] = 0;
                        data[key]["ticket"]["_total"] = 0;
                    }
                }
            });
        }

        //Render data
        $.each(data, function (_, item) {
            vbf('onStoreHistory', { // store history
                un: app.un,
                key: 'print-ticket',
                his: { '_tid': tId, '_tname': tName, '_tdate': tDate, '_s': item["ticket"]["_seatCodes"] }
            });

            item["ticket"]["_seatCodes"] = item["ticket"]["_seatCodes"].join(", ");
            //item["ticket"]["_total"] = item["ticket"]["_fare"] * item["ticket"]["_numSeat"];
            item["ticket"]["_fare"] = item["ticket"]["_fare"].toMn();
            item["ticket"]["_total"] = item["ticket"]["_total"].toMn();
            if (item["ticket"]["_numSeat"] > 4) {
                if (typeof _dict._eTicket["custom"] != 'undefined') {
                    me._$printETicketBody.append(vtpl(_dict._eTicket["custom"][cTrip.Id]["lg"], item));
                } else {
                    me._$printETicketBody.append(vtpl(_dict._eTicket["lg"], item));
                }
            } else {
                if (typeof _dict._eTicket["custom"] != 'undefined') {
                    me._$printETicketBody.append(vtpl(_dict._eTicket["custom"][cTrip.Id]["sm"], item));
                } else {
                    me._$printETicketBody.append(vtpl(_dict._eTicket["sm"], item));
                }
            }

        });
    },
});
$(document).ready(function () {

});