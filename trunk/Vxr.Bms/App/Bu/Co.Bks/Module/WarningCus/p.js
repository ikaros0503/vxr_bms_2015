/*
 * .................Warning Customer...................
 */
define({

    start: function (o) {
        var me = this;
        vbv('doGetWarningCustomer', function (e) {
            if (e.d) {
                me._getCustomerWarning(e.d.f, e.d.cName, e.d.cPhone, e.d.cId, e.d.lmDate, e.d.tId, e.d.tName);
            }
        });
        vbv('doClearWarningCustomer', function (e) {
            if (e.d) {
                me._clearCustomerWarning(e.d.f);
            }
        });
    },

    _getCustomerWarning: function (f, cName, cPhone, cId, lmDate, tId, tName) {
        var me = this;
        vRqs({
            _a: "fGetTicket",
            _c: {
                CustomerId: cId,
                TripDate: "($x >= '" + new Date().toFormatString('iso') + "')",
                Status: "(($x) IN(" + _dict._tksUpSearch.join() + ") AND ($x <> 1 OR ($x = 1 AND (ExpiredTime is null OR (ExpiredTime is not null AND ExpiredTime >= '" + new Date().toFormatString("iso") + "'))))) ORDER BY TripDate ASC", // loại bỏ các vé đã hủy - edited by Duy
            },
            _f: "TripDate, SeatCode, Fare, Status, TripIdName"
        }, function (u, r, l, t) {
            if (u != 1) return;
            me._clearCustomerWarning(f);
            if (l > 0) me._renderCustomerWarning(f, cName, cPhone, r);
        });
    },

    _clearCustomerWarning: function (f) {
        if (f) f.find('.customer-w').remove();
    },

    _renderCustomerWarning: function (f, cName, cPhone, d) {
        var $message = $('<ul />');
        var trip = [];
        var tDates = [];
        $.each(d, function (_, t) {
            var tDate = vPrsDt(t[0]);
            var sLabel = t[1].split('|')[0];
            var fare = parseInt(t[2]);
            var status = parseInt(t[3]);
            var tName = t[4]
            var key = tDates.indexOf(tDate.toFormatString('iso'));
            if (key == -1) {
                key = tDates.push(tDate.toFormatString('iso')) - 1;
            }
            if (typeof trip[key] == "undefined") {
                trip[key] = {
                    _b: {
                        _numS: 0,
                        _sCodes: [],
                        _total: 0,
                        _tname: tName,
                        _date: tDate
                    },
                    _c: {
                        _numS: 0,
                        _sCodes: [],
                        _total: 0,
                        _tname: tName,
                        _date: tDate
                    },
                    _p: {
                        _numS: 0,
                        _sCodes: [],
                        _total: 0,
                        _tname: tName,
                        _date: tDate
                    },
                }
            }
            switch (status) {
                case 1:
                    trip[key]._b._numS++;
                    trip[key]._b._sCodes.push(sLabel);
                    trip[key]._b._total += fare;
                    break;
                case 2:
                    trip[key]._p._numS++;
                    trip[key]._p._sCodes.push(sLabel);
                    trip[key]._p._total += fare;
                    break;
                case 4:
                    trip[key]._c._numS++;
                    trip[key]._c._sCodes.push(sLabel);
                    trip[key]._c._total += fare;
                    break;
            }
        });
        $.each(trip, function (_, t) {
            if (typeof t != "undefined" && t != null) {
                if (t._b._numS > 0) {
                    var tdata = {
                        "t": {
                            _sText: "Đang đặt",
                            _numS: t._b._numS,
                            _sCodes: t._b._sCodes.join(', '),
                            _total: t._b._total.toMn() + "₫",
                            _tname: t._b._tname,
                            _date: t._b._date.toFormatString('dd-mm-yyyy'),
                            _time: t._b._date.toFormatString('hh:mm')
                        }
                    };
                    $message.append(vtpl(_dict._btwarningTpl, tdata));
                }
                if (t._c._numS > 0) {
                    var cdata = {
                        "t": {
                            _sText: "Hủy",
                            _numS: t._c._numS,
                            _sCodes: t._c._sCodes.join(', '),
                            _total: t._c._total.toMn() + "₫",
                            _tname: t._c._tname,
                            _date: t._c._date.toFormatString('dd-mm-yyyy'),
                            _time: t._c._date.toFormatString('hh:mm')
                        }
                    };
                    $message.append(vtpl(_dict._btwarningTpl, cdata));
                }
                if (t._p._numS > 0) {
                    var pdata = {
                        "t": {
                            _sText: "Đã thanh toán",
                            _numS: t._p._numS,
                            _sCodes: t._p._sCodes.join(', '),
                            _total: t._p._total.toMn() + "₫",
                            _tname: t._p._tname,
                            _date: t._p._date.toFormatString('dd-mm-yyyy'),
                            _time: t._p._date.toFormatString('hh:mm')
                        }
                    };
                    $message.append(vtpl(_dict._btwarningTpl, pdata));
                }
            }
        });
        if ($message.find('li').length > 0) {
            f.find('#UpdateForm').prepend($(vtpl(_dict._wTpl, { 'm': { _cname: cName, _cphone: cPhone, _content: $('<div />').append($message).html() } })).addClass('customer-w'));
        }
        // updated by Duy: hide error div when render warning customer successfull
        var $errMess = f.find('div.message-error');
        if ($errMess.length > 0) {
            $errMess.html('');
            $errMess.hide();
        }
        // updated by Duy: remove error class when render warning customer successfull
        var $phoneParent = f.find('input[name="PhoneNumbers"]').closest('div.col-md-6');
        if ($phoneParent.length > 0 && $phoneParent.hasClass('has-error')) {
            $phoneParent.removeClass('has-error');
        }
    },
});