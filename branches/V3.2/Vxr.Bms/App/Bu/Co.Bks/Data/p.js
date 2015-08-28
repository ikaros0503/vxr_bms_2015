define({
    start: function (o) {
        try {
            this.o = o;
            vdc = this;
            //this.gD(cb);
        } catch (e) {
            console.log('(E) Co.Bks/Data', e);
        }
    },
    gD: function (dt, cb) {
        var me = this;
        var obj = {
            _a: 'loadBms',
            _cid: app.cid,
            _tid: 0
        }
        if (app.rights.match(/~3\|1\|(\d+)/g)) {
            obj._tid = app.rights.match(/~3\|1\|(\d+)/g)[0].split('|')[2];
        }
        if (dt) {
            if (dt.t && !isNaN(dt.t)) obj._tid = dt.t;
            if (dt.d && moment(dt.d, 'DD.MM.YYYY').isValid()) obj._tD = moment(dt.d, 'DD.MM.YYYY').format('YYYY-MM-DD');
            if (dt.h && moment(dt.h, 'HH.mm').isValid()) obj._tT = moment(dt.h, 'HH.mm').format('HH:mm');
        }
        vRqs(obj, function (u, r, l, t) {
            if (u != 1) {
                return;
            }
            me.o.Trips = r[0];
            me.o.Bus_tickets_status = r[1];
            me.o.TripTotalSeatInfo = r[2];
            me.o.Tickets = r[3];
            me.o.Companies = r[4];
            me.o.PhoiTemplates = r[5];

            if (typeof cb === 'function') cb.call(this);
        });
    },


    gPhoiTemplates: function (c, f, rl, opt, cb) {
        var me = this;
        if (rl) {
            var df = '*';
            var obj = {
                _a: 'fGetPhoi_SeatTemplate',
                _c: c,
                _f: f == '#' ? df : f
            };
            vRqu(obj, function (u, r, l, t) {
                me.o.PhoiTemplates = r;
                if (typeof cb === 'function') cb.call(this, u, r, l, t);
            }, opt);
        } else {
            if (typeof cb === 'function') cb.call(this, 1, me.o.PhoiTemplates, me.o.PhoiTemplates ? me.o.PhoiTemplates.length : 0);
        }
    },

    fillPhoiTemplate: function (arr) {
        var me = this;
        for (var i = 0; i < arr.length; i++) {
            var str = arr[3];
            if (str != null && str.indexOf("~") >= 0) {
                str = str.substring(str.indexOf("~") + 1);
            }
            var isFound = false;
            for (var j = 0; j < me.o.PhoiTemplates.length; j++) {
                if (str == me.o.PhoiTemplates[j][4]) {
                    arr.push(me.o.PhoiTemplates[j][5]);
                    isFound = true;
                    break;
                }
            }
            if (!isFound) arr.push('');
        }
        return arr;
    },

    /*
     * Get Trip data
     * Parameters: d: Date, f: Fields ('#': default fields), rl: Is reload or not,  o: ajax option, cb: callback.
     */
    gTripByDate: function (d, f, rl, opt, cb) {
        var me = this;
        if (!d) d = new Date();

        if (rl) {
            var df = 'Id, Name, Info, SeatTemplateInfo, FareInfo, StatusInfo, BaseId, Type, ' +
                'Time, Alias, TeamInfo, VehicleInfo, FromArea, ToArea, Note, RouteInfo, ' +
                'SeatSummaryInfo, TotalSeats, ClosedStatus, PassengerMoney, ProductMoney, ' +
                'FeeMoney, BranchReceiveProduct, RealDepartureTime, PickedPointsInfo, ' +
                'TransferPointsInfo, NewFare, DisplayOrder, Description, TotalBookedSeats,' +
                ' TotalPaidSeats';
            var obj = {
                _a: 'fGetTrip',
                _c: {
                    CompId: app.cid,
                    IsPrgStatus: "(ISNULL($x, -1) != 3)",
                    //Date: "(type = 1 or (type = 2 and Time is not null and $x = N'" + d.toFormatString('yyyy-mm-dd') + "')) order by type,name asc" //self._cTripDate.toFormatString('iso')
                    Date: "(type = 1 or (type = 2 and Time is not null and $x = N'" + d.toFormatString('yyyy-mm-dd') + "')) order by type, DisplayOrder, name asc" //self._cTripDate.toFormatString('iso')
                },
                _f: f == '#' ? df : f
            };
            vRqs(obj, function (u, r, l, t) {
                me.o.Trips = r;
                if (typeof cb === 'function') cb.call(this, u, r, l, t);
            }, opt);
        } else {
            if (typeof cb === 'function') cb.call(this, 1, me.o.Trips, me.o.Trips.length);
        }
    },

    gTripTotalSeatInfo: function (c, f, rl, cb) {
        /// <summary>
        /// Get total seat info
        /// </summary>
        /// <param name="c">conditions</param>
        /// <param name="f">field</param>
        /// <param name="rl">is reload or not</param>
        /// <param name="cb"></param>
        var me = this;
        if (rl) {
            var df = '*';
            var obj = {
                _a: 'sGetTripTotalSeatInfo',
                _c: c,
                _f: f == '#' ? df : f
            };
            vRqs(obj, function (u, r, l, t) {
                me.o.TripTotalSeatInfo = r;
                if (typeof cb === 'function') cb.call(this, u, r, l, t);
            });
        } else {
            if (typeof cb === 'function') cb.call(this, 1, me.o.TripTotalSeatInfo, me.o.TripTotalSeatInfo.length);
        }
    },
    gBusTicketStatus: function (c, f, rl, opt, cb) {
        var me = this;
        if (rl) {
            var df = 'Id, XTypeId, XAgentId, XBranchId, XOperatorId, XCompanyId, XRouteId, XTripId, XDate, XTime, XStatus, Info, TimeLimit';
            var obj = {
                _a: 'fGetBus_Tickets_Status',
                _c: c,
                _f: f == '#' ? df : f
            };
            vRqs(obj, function (u, r, l, t) {
                me.o.Bus_tickets_status = r;
                if (typeof cb === 'function') cb.call(this, u, r, l, t);
            }, opt);
        } else {
            if (typeof cb === 'function') cb.call(this, 1, me.o.Bus_tickets_status, me.o.Bus_tickets_status.length);
        }
    },
    gTicket: function (c, f, rl, opt, cb) {
        var me = this;
        if (rl) {
            var df = '*';
            var obj = {
                //_a: 'fGetTicket',
                _a: 'fGetTicketByStore',
                _c: c,
                _f: f == '#' ? df : f
            };
            vRqu(obj, function (u, r, l, t) {
                //me.o.Tickets = r;
                me.o.Tickets = (r && r.length > 0) ? r : [];
                if (typeof cb === 'function') cb.call(this, u, me.o.Tickets, me.o.Tickets.length);
            }, opt);
        } else {
            if (typeof cb === 'function') cb.call(this, 1, me.o.Tickets, me.o.Tickets ? me.o.Tickets.length : 0);
        }
    },
    gCompany: function (c, f, rl, opt, cb) {
        var me = this;
        if (rl) {
            var df = 'Id, Type, Code, Name, AddressInfo, PhoneInfo';
            var obj = {
                _a: 'fGetCompany',
                _c: c,
                _f: f == '#' ? df : f
            };
            vRqu(obj, function (u, r, l, t) {
                me.o.Companies = r;
                if (typeof cb === 'function') cb.call(this, u, r, l, t);
            }, opt);
        } else {
            if (typeof cb === 'function') cb.call(this, 1, me.o.Companies, me.o.Companies.length);
        }
    }
});