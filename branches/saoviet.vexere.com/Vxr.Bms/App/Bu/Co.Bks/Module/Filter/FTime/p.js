define({
    start: function (o) {
        this._bindFTimeEvents();
        this._bindBodyEvent();
    },

    _bindFTimeEvents: function () {
        var me = this;
        var item = $("#FilterForm select[name=TimeSlot]");
        if (item.length > 0) {
            $("#FilterForm select[name=TimeSlot]").unbind().on('change', function (e) {
                app.cTime = $(this).val();
                vbf('fTimeChange', { value: $(this).val() });
            });

        } else {

            setTimeout(function() {
                me._bindFTimeEvents();
            }, 50);
        }
    },
    _bindBodyEvent: function () {
        var me = this;

        vev('body', 'fMapAvaiSeat', function(e) {
            me._mapAvailableSeat(e);
        });

        vev('body', 'fReloadTimeSlot', function(e) {
            me._reloadTimeSlot(e);
        });

        vev('body', 'fSetTime', function(e) {
            $("#FilterForm select[name=TimeSlot]").val(e.d.value);
            app.cTime = e.d.value;
        });
    },

    _mapAvailableSeat: function(e) {
        var me = e.d.value;
        var d = e.d.data;
        var ots = $('#FilterForm select[name=TimeSlot] option');
        $.each(ots, function (i, v) {
            var bv = 0;
            $.each(d, function (j, a) {
                if (v.value == a[2]) {
                    bv = a[3];
                }
            });
            if (typeof me._data[me._cTripIndex].Ts[v.value] != "undefined") {
                var av = me._data[me._cTripIndex].Ts[v.value][0].NS - bv;
                var ctext = v.value;
                if (me._data[me._cTripIndex].Ts[v.value][0].S == 2) {
                    ctext += " - Tăng cường";
                }
                $(v).text(ctext + " / Ghế trống " + av);
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
                //var tc = "";
                if (ts[0].S == 2) {
                    text += " - Tăng cường";
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