/************************************************************************
* E-TICKET PRINT AND EMAIL                                              *
*************************************************************************/
(function ($) {

    //Reference to base object members
    var base = {
        _create: $.custom.vbooking.prototype._create
    };

    //extension members
    $.extend(true, $.custom.vbooking.prototype, {

        /************************************************************************
        * DEFAULT OPTIONS / EVENTS                                              *
        *************************************************************************/
        options: {
        },
        /************************************************************************
        * PRIVATE FIELDS                                                        *
        *************************************************************************/
        _$printETicketContainer: null,
        _$printETicketBody: null,

        /************************************************************************
       * CONSTRUCTOR AND INITIALIZATION METHODS                                *
       *************************************************************************/
        _create: function () {

            base._create.apply(this, arguments);

            if (!this.options.serviceUrl) {
                return;
            }
            //Initialization
            this._creatPrintETicketContainer();
            this._creatPrintETicketBody();
        },

        _creatPrintETicketContainer: function () {
            this._$printETicketContainer = $('<div />')
                .addClass('print-container');
        },
        _creatPrintETicketBody: function () {
            this._$printETicketBody = $('<div />').addClass('row')
                .appendTo(this._$printETicketContainer);
        },

        _printETicket: function () {
            var self = this;
            //t.stage_point1
            self._resetETicket();
            self._renderETicket();

            //Get the HTML of whole page
            var printContent = $('<div />').append(self._$printETicketContainer).html();
            var windowUrl = 'about:blank';
            var uniqueName = new Date();
            var windowName = 'ETicket' + uniqueName.getTime();
            var printWindow = window.open(windowUrl, windowName, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            printWindow.document.write('<html><head><title>' + windowName + '</title>');
            printWindow.document.write('<link rel="stylesheet" href="' + self.options.baseUrl + _dict._eStyleUrl + '" type="text/css" />');
            //printWindow.document.write('</head><body onload="window.top.print()" >');
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
        _renderETicket: function () {
            var self = this;
            var tripInfo = self._getCurrentTripInfo();

            //Prepare data
            var data = [];

            var cTrip = self._data[self._cTripIndex];
            var tripName = cTrip.Name.split('-');
            var fArea = "";
            var tArea = "";
            var fAreaTicket = "";
            var tAreaTicket = "";
            var fTemp = cTrip.FromArea.split('~');
            if (fTemp.length > 1) {
                fArea = fTemp[1].split('|')[3];
            }
            var tTemp = cTrip.ToArea.split('~');
            if (tTemp.length > 1) {
                tArea = tTemp[1].split('|')[3];
            }

            //Branch info
            var branch = {};
            $.each(self._info, function (_, b) {
                if ($.isEmptyObject(branch)) {
                    if (b[0] == self.options.aid) {
                        branch = b;
                    }
                }
            });
            if (!_dict._multiSeatOnTicket) {
                $.each(self._seatStack, function (_, s) {
                    var t = s._getCurrentTicket();
                    if (t.fromArea) {
                        fAreaTicket = t.fromArea.split('|')[3];
                    }
                    if (t.toArea) {
                        tAreaTicket = t.toArea.split('|')[3];
                    }
                    if (!$.isEmptyObject(t)) {
                        var pInfo = t._getPickupInfo();
                        var pText = "";
                        if (!$.isEmptyObject(pInfo)) {
                            pText = pInfo.text;
                        }
                        var from = $.trim(tripName[0]);
                        var to = $.trim(tripName[1]);
                        if (t.stage_point1 != null) {
                            from = t.stage_point1.Name;
                            to = t.stage_point2.Name;
                        } else {

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
                                _user: self.options.un,
                                _note: t._note,
                                _deposit: t._deposit.toMn() + " đ",
                                _vehicleNumber: tripInfo._vehicleNumber
                            }
                        });
                    }
                });
            } else {
                var customer = [];
                $.each(self._seatStack, function (_, s) {
                    var t = s._getCurrentTicket();
                    if (t.fromArea) {
                        fAreaTicket = t.fromArea.split('|')[3];
                    }
                    if (t.toArea) {
                        tAreaTicket = t.toArea.split('|')[3];
                    }
                    if (!$.isEmptyObject(t)) {
                        var pInfo = t._getPickupInfo();
                        var pText = "";
                        if (!$.isEmptyObject(pInfo)) {
                            pText = pInfo.text;
                        }

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
                                    _user: self.options.un,
                                    _note: t._note,
                                    _deposit: t._deposit.toMn() + " đ",
                                    _vehicleNumber: tripInfo._vehicleNumber
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

                //Store history
                self._storeHistory(self.options.un, 'print-ticket', { '_tid': self._cTripId, '_tname': self._data[self._cTripIndex].Name, '_tdate': self._getDepartureTime(), '_s': item["ticket"]["_seatCodes"] });

                item["ticket"]["_seatCodes"] = item["ticket"]["_seatCodes"].join(", ");
                //item["ticket"]["_total"] = item["ticket"]["_fare"] * item["ticket"]["_numSeat"];
                item["ticket"]["_fare"] = item["ticket"]["_fare"].toMn();
                item["ticket"]["_total"] = item["ticket"]["_total"].toMn();
                if (item["ticket"]["_numSeat"] > 4) {
                    if (typeof _dict._eTicket["custom"] != 'undefined') {
                        self._$printETicketBody.append(vtpl(_dict._eTicket["custom"][cTrip.Id]["lg"], item));
                    } else {
                        self._$printETicketBody.append(vtpl(_dict._eTicket["lg"], item));
                    }
                } else {
                    if (typeof _dict._eTicket["custom"] != 'undefined') {
                        self._$printETicketBody.append(vtpl(_dict._eTicket["custom"][cTrip.Id]["sm"], item));
                    } else {
                        self._$printETicketBody.append(vtpl(_dict._eTicket["sm"], item));
                    }
                }

            });
        },
        _resetETicket: function () {
            this._$printETicketBody.empty();
        }
    });
})(jQuery);

