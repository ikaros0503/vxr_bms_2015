define({
    start: function (o) {
        try {
            this._bindFTimeEvents();
            this._bindBodyEvent();
        } catch (e) {
            console.error(e);
        }
    },

    _bindFTimeEvents: function () {
        var me = this;
        var item = $("#FilterForm select[name=TimeSlot]");
        if (item.length > 0) {
            $("#FilterForm select[name=TimeSlot]").unbind('change').on('change', function (e) {
                app.cTime = $(this).val();
                vbf('fTimeChange', { value: $(this).val() });
            });

            $("#FilterForm select[name=TimeSlot]").unbind('mouseenter').on('mouseenter', function (e) {
                var deltaTime = null;
                if (app.deltaTimeEnterFTime) {
                    deltaTime = new Date() - app.deltaTimeEnterFTime;
                    app.deltaTimeEnterFTime = new Date();
                } else {
                    app.deltaTimeEnterFTime = new Date();
                }
                if (deltaTime > app.FTimeLimitedRequestTime || deltaTime == null) {
                    vbf('doGetMultiTotalSeats');
                }
            });

        } else {

            setTimeout(function () {
                me._bindFTimeEvents();
            }, 50);
        }
    },
    _bindBodyEvent: function () {
        var me = this;
        vev('body', 'fMapAvaiSeat', function (e) {
            me._mapAvailableSeat(e);
        });

        vbv('bUpdateAvaiSeats', function (e) {
            if (e.d) {
                me._mapAvailableSeat(e, e.d.TotalBookedSeats, e.d.TotalExpiredSeats, e.d.ArrayTotalTimes);
            }
        });

        vev('body', 'fReloadTimeSlot', function (e) {
            me._reloadTimeSlot(e);
        });

        vev('body', 'fSetTime', function (e) {
            $("#FilterForm select[name=TimeSlot]").val(e.d.value);
            app.cTime = e.d.value;
        });
    },
    _ip: null,
    _getBAvailSeat: function (ip, v, arrayTotalTimes) {
        var me = this;
        var ts = ip.Ts[v.value][0];
        if (arrayTotalTimes != null) {
            $.each(arrayTotalTimes, function (idx, val) {
                var time = val[0];
                if (time == v.value) {
                    ts.TotalBookedSeats = val[1];
                }
            });
        }
        var av = ts.NS - (ts.TotalBookedSeats ? ts.TotalBookedSeats : 0);
        if (typeof _dict._blockSeatByVehicle != 'undefined') {
            var seatTempId = ts.SeatTemplateId ? parseInt(ts.SeatTemplateId) : 0;
            if (_dict._denySeatTempId != undefined && _dict._denySeatTempId.indexOf(seatTempId) == -1) {
                av -= _dict._blockSeatByVehicle.length;
            }
            if (typeof _dict._unblockSeatByVehicle != 'undefined') {
                if (vIsEstStr(ts.V)) {
                    try {
                        var vh = ts.V.split('|')[2];
                        if (typeof _dict._unblockSeatByVehicle[vh] != 'undefined') {
                            av += _dict._unblockSeatByVehicle[vh].length;
                        }
                    } catch (e) {

                    }
                }
            }
        }
        if (isNaN(av)) av = 0;
        var ctext = '';
        if (_dict._hasDriverTrip) {
            if (ts.TripDriver != null) {
                var duyet = ts.TripDriver.split('~');
                if (duyet.length > 1) {
                    for (var s = 0; s < duyet.length; s++) {
                        var item = duyet[s].split('|');
                        if (item[0] === v.value) {
                            if (item[1] != '') {
                                ctext += item[1];
                                break;
                            }
                        }
                    }
                } else if (duyet[0] != '') {
                    ctext += duyet[0];
                }
            } else if (ip.TripDriver != null) {
                var duyet = ip.TripDriver.split('~');
                if (duyet.length > 1) {
                    for (var s = 0; s < duyet.length; s++) {
                        var item = duyet[s].split('|');
                        if (item[0] === v.value) {
                            if (item[1] != '') {
                                ctext += item[1];
                                break;
                            }
                        }
                    }
                } else if (duyet[0] != '') {
                    ctext += duyet[0];
                }
            }
        }
        if (ctext != "") {
            if (ts.S == 2) {
                ctext += " - (TC)";
            }
            ctext += " / Ghế trống " + av + " / " + v.value;
        } else {
            ctext += v.value;
            if (ts.S == 2) {
                ctext += " - (TC)";
            }
            ctext += " / Ghế trống " + av;
        }
        $(v).text(ctext);
    },
    _mapAvailableSeat: function (e, totalBookedSeats, totalExpiredSeats, arrayTotalTimes) {
        var me2 = this;
        var me = e.d.value;
        var ots = $('#FilterForm select[name=TimeSlot] option');
        var selectedOp = $('#FilterForm select[name=TimeSlot]').val();
        $.each(ots, function (i, v) {
            if (!v) return;
            if (totalBookedSeats == null) {
                if (me._data[me._cTripIndex] && typeof me._data[me._cTripIndex].Ts[v.value] != "undefined") {
                    if (selectedOp == v.value) {
                        me2._ip = me._data[me._cTripIndex];
                        vbf('doGetTotalSeats');
                        //me2._ip.Ts[v.value][0].TotalBookedSeats = totalBookedSeats;
                        //me2._getBAvailSeat(me2._ip, v);
                    } else {
                        me2._getBAvailSeat(me._data[me._cTripIndex], v, arrayTotalTimes);
                    }
                }
            } else {
                //setTimeout(function () {
                //    if (selectedOp == v.value) {
                //        me2._ip.Ts[v.value][0].TotalBookedSeats = totalBookedSeats;
                //        me2._getBAvailSeat(me2._ip, v);
                //    }
                //}, 1000);
                if (selectedOp == v.value) {
                    me2._ip.Ts[v.value][0].TotalBookedSeats = totalBookedSeats;
                    me2._getBAvailSeat(me2._ip, v);
                }
            }
        });
    },

    _reloadTimeSlot: function (e) {
        var me = e.d.value;
        var $ts = $('#FilterForm select[name=TimeSlot]').empty();
        var d = new Date(); d.setSeconds(0);
        var od = new Date(me._cTripDate.getTime()); od.setSeconds(0);

        //Order time slot
        var timeSlot = {};
        if (me._data[me._cTripIndex]) {
            var keys = Object.keys(me._data[me._cTripIndex].Ts), i, len = keys.length;
            keys.sort();
            for (i = 0; i < len; i++) {
                // block BKS by time
                if (app.rights.indexOf($.rights.bUBlockBks.val) == -1) {
                    if (typeof _dict._hasBlockBKSByTime != "undefined" && _dict._hasBlockBKSByTime
                        && typeof _dict._dayBlockBKS != "undefined" && typeof _dict._hourBlockBKS != "undefined" && typeof _dict._minuteBlockBKS != "undefined") {
                        var dayConf = _dict._dayBlockBKS;
                        var hourConf = _dict._hourBlockBKS;
                        var minuteConf = _dict._minuteBlockBKS;
                        var now = new Date();
                        now.setDate(now.getDate() - dayConf);
                        now.setHours(now.getHours() - hourConf);
                        now.setMinutes(now.getMinutes() - minuteConf);
                        if (keys[i] != null) {
                            var split = keys[i].split(':');
                            var departHour = parseInt(split[0]);
                            var departMinute = parseInt(split[1]);
                            od.setHours(departHour);
                            od.setMinutes(departMinute);
                            if (now <= od) {
                                timeSlot[keys[i]] = me._data[me._cTripIndex].Ts[keys[i]];
                            }
                        }
                    } else {
                        timeSlot[keys[i]] = me._data[me._cTripIndex].Ts[keys[i]];
                    }
                } else {
                    timeSlot[keys[i]] = me._data[me._cTripIndex].Ts[keys[i]];
                }
            }
        }


        var hasSelected = false;
        $.each(timeSlot, function (k, ts) {
            if (ts[0].S != 3) {
                var text = k;
                //if (ts[0].TripDriver != null) { // reload la bi null
                //    var duyet = ts[0].TripDriver.split('~');
                //    if (duyet.length > 1) {
                //        for (var s = 0; s < duyet.length; s++) {
                //            var item = duyet[s].split('|');
                //            if (item[0] == text) {
                //                text = item[1];
                //                break;
                //            }
                //        }
                //    } else {
                //        text = duyet;
                //    }
                //} else
                //    text = k;

                //var tc = "";
                if (ts[0].S == 2) {
                    text += " - (TC)";
                }
                //var bookedSeats = ts[0].BS;
                //var totalSeats = ts[0].TS;
                //var bookedSeatsText = "";
                //if (bookedSeats != null && totalSeats != null) {
                //    bookedSeatsText = " - " + bookedSeats + "/" + totalSeats;
                //}
                //text = k + bookedSeatsText + tc;
                var $op = $('<option />', { text: text, value: k });
                if (!hasSelected) {
                    var tmp = k.split(':');
                    od.setHours(parseInt(tmp[0])); od.setMinutes(parseInt(tmp[1]));
                    if (me._cTripTime != null) {
                        if (k == me._cTripTime) {
                            $op.attr('selected', true);
                            hasSelected = true;
                            app.cTime = me._cTripTime;
                        }
                    } else if (od > d) {
                        $op.attr('selected', true);
                        hasSelected = true;
                        app.cTime = k;
                    }
                }
                $ts.append($op);
            }
        });

        if (!hasSelected) {
            var $fo = $ts.find('option:first-child');
            $fo.attr('selected', true);

            //self._changeCTripTime($fo.val());
            vbf('doChangeCTripTime', { value: $fo.val() });
            app.cTime = $fo.val();
        }

        if ($ts.val() != me._cTripTime) {

            //self._changeCTripTime($ts.val());
            vbf('doChangeCTripTime', { value: $ts.val() });

            app.cTime = $ts.val();
        }
    }
})
