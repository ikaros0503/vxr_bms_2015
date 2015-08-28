define({
    start: function (o) {
        this.o = o;
        vdc = this;
        //this.gD(cb);
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

            if (typeof cb === 'function') cb.call(this);
        });
    },
    /*
     * Get Trip data
     * Parameters: d: Date, f: Fields ('#': default fields), rl: Is reload or not,  o: ajax option, cb: callback.
     */
    gTripByDate: function(d, f, rl, opt, cb) {
        var me = this;
        if (!d) d = new Date();
       
        if (rl) {
            var df = 'Id, Name, Info, SeatTemplateInfo, FareInfo, StatusInfo, BaseId, Type, Time, Alias, TeamInfo, VehicleInfo, FromArea, ToArea, Note, RouteInfo, SeatSummaryInfo, TotalSeats, ClosedStatus, PassengerMoney, ProductMoney, FeeMoney, BranchReceiveProduct, RealDepartureTime, PickedPointsInfo, TransferPointsInfo, NewFare';
            var obj = {
                _a: 'fGetTrip',
                _c: {
                    CompId: app.cid,
                    IsPrgStatus: "($x is null or $x != 3)",
                    Date: "(type = 1 or (type = 2 and Time is not null and $x = N'" + d.toFormatString('yyyy-mm-dd') + "')) order by type,name asc" //self._cTripDate.toFormatString('iso')
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
            var df ='*';
            var obj = {
                _a: 'fGetTicket',
                _c: c,
                _f: f == '#' ? df : f
            };
            vRqu(obj, function (u, r, l, t) {
                me.o.Tickets = r;
                if (typeof cb === 'function') cb.call(this, u, r, l, t);
            }, opt);
        } else {
            if (typeof cb === 'function') cb.call(this, 1, me.o.Tickets, me.o.Tickets? me.o.Tickets.length: 0);
        }
    },
    gCompany: function (c, f, rl, opt, cb) {
        var me = this;
        if (rl) {
            var df = 'Id, Type, Code, Name, AddressInfo, PhoneInfo';
            var obj = {
                _a: 'fGeCompany',
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

