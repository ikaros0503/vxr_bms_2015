define({
    start: function(o) {
        this.o = o;
        this._bindBookEvent();
    },
    _bindBookEvent: function () {
        var me = this;
        vbv('doBookTicket', function (e) {
            me._bookTicket(e.d.seat, e.d.tData);
        });
    },
    _bookTicket: function(seat, tData) {
        var me = this;
        try {
            //Create book ticket obj
            var bookObj = me._createBookTicketObj(seat, tData);
            var completeReload = function (u, r, l, t) {
                // reset action về default sau khi gửi ajax thành công 
                oRq.cAType = 1;

                if (u != 1 || l <= 0) {
                    vbf('showErrorForm', { message: _dict._err[4] });
                    vbf('reloadBookingSheet', {});
                    return;
                }
                //Add seat to seat stack
                $.each(app.seatStack, function (k, v) {
                    var tick = v._getCurrentTicket();
                    if (tick._status != 1) {
                        app.seatStack = [];
                    }
                });
                if (!me._estStStk(seat)) {
                    app.seatStack.push(seat);
                }

                //Reload sheet
                vbf('reloadBookingSheet', {});

                //Store history
                vbf('onStoreHistory', { // Store history
                    un: app.un,
                    key: 'book',
                    his: { '_tid': tData.cTripId, '_tname': tData.data[tData.cTripIndex].Name, '_tdate': me._getDptrTime(tData), '_s': [seat._label] }
                });
                //me._storeHistory(me.options.un, 'book', { '_tid': me._cTripId, '_tname': me._data[me._cTripIndex].Name, '_tdate': me._getDepartureTime(), '_s': [seat._label] });

            };
            //Submit action
            if (oRq.cEl.length > 0) {
                vRqu(bookObj, completeReload);
            }
        } catch (err) {
            vbf('showErrorForm', { message: err });
            //me._showError(err);
        }
    },
    _estStStk: function (seat) {
        /// <summary>
        /// Check existing in seatstack or not
        /// </summary>
        /// <param name="seat"></param>
        var matchSeat = -1;
        var ticket = seat._getCurrentTicket();
        $.each(app.seatStack, function (ist, st) {
            if (-1 == matchSeat) {
                var t = st._getCurrentTicket();
                if (st._coach == seat._coach && st._row == seat._row && st._col == seat._col && t._id == ticket._id) {
                    matchSeat = ist;
                }
            }
        });
        return !(-1 == matchSeat);
    },
    _createBookTicketObj: function (seat, tData) {
        var me = this;
        var dptT = me._getDptrTime(tData);
        var fare = 0;
        var obj = {};
        obj._a = "BookTicket";
        obj._c = [{
            TripId: tData.cTripId,
            SeatCode: seat._getSeatInfo(),
            PickupDate: dptT.toFormatString('iso'),
            Bus: tData.cTripBus,
            //StageCode: !self._cStageCode ? 1 : self._cStageCode //StageCode
            StageCode: tData.cStageCode
        }];
        // FromArea & ToArea
        var fromId = 0;
        var toId = 0;
        if (app.oRights["StageEnable"]) {
            fromId = (typeof tData.cFromId != 'undefined' && tData.cFromId > 0) ? tData.cFromId : tData.cDefaultFromId;
            toId = (typeof tData.cToId != 'undefined' && tData.cToId > 0) ? tData.cToId : tData.cDefaultToId;
        } else {
            fromId = (typeof tData.cDefaultFromId != 'undefined' && tData.cDefaultFromId > 0) ? tData.cDefaultFromId : tData.cFromId;
            toId = (typeof tData.cDefaultToId != 'undefined' && tData.cDefaultToId > 0) ? tData.cDefaultToId : tData.cToId;
        }
        var fromInfo = tData.data[tData.cTripIndex].StopPoints.data[tData.data[tData.cTripIndex].StopPoints.idx[fromId]];
        if (typeof fromInfo != 'undefined') {
            var fromArea = "1~" + fromInfo.Id + "|" + fromInfo.Type + "|" + fromInfo.Code + "|" + fromInfo.Name;
        }
        var toInfo = tData.data[tData.cTripIndex].StopPoints.data[tData.data[tData.cTripIndex].StopPoints.idx[toId]];
        if (typeof toInfo != 'undefined') {
            var toArea = "1~" + toInfo.Id + "|" + toInfo.Type + "|" + toInfo.Code + "|" + toInfo.Name;
        }
        if (typeof _dict._hasMultiFare != "undefined" && !_dict._hasMultiFare) {
            //fare = me._getCurrentFare();
            fare = 0;
            var fInfo = tData.data[tData.cTripIndex].Ts[tData.cTripTime][tData.cTripBus].F.split('~');
            if (fInfo.length > 0) {
                fare = parseInt(fInfo[1].split('|')[2]);
                if (isNaN(fare)) {
                    fare = 0;
                }
            }
        } else {
            // load fare by default FromId, ToId
            fare = me._getCurrentFareById(tData, fromId, toId);
        }
        obj._d = [
        {
            CompId: app.cid,
            TripId: tData.cTripId,
            AgentId: parseInt(app.aid),
            AgentInfo: $.trim(app.aid + "|" + app.aite + "|" + app.aice + '|' + app.aisne),
            TripDate: dptT.toFormatString('iso'),
            SeatCode: seat._getSeatInfo(),
            IssueDate: new Date().addMinutes(app.sOffsetMinute).toFormatString('iso'),
            PickupDate: dptT.toFormatString('iso'),
            TripAlias: parseInt(tData.cTripBus),
            Status: 1,
            Fare: fare,
            CreatedUser: app.un,
            StageCode: tData.cStageCode,
            SeatType: seat._getSeatType(),
            FromArea: fromArea,
            ToArea: toArea,
            FromId: fromId,
            ToId: toId,
            //nguồn gốc vé:
            // 1- BMS, 2-FrontEnd, 3-VMS
            //Type: app.cid == 132 ? 3 : 1
            Type: app.aid == 135 ? 3 : 1
        }];
        return obj;
    },
    _getDptrTime: function(tData) {
        var dt = tData.cTripDate;
        var ts = tData.cTripTime.split(':');
        if (isNaN(parseInt(ts[0])) || isNaN(parseInt(ts[1]))) return {};
        dt.setHours(parseInt(ts[0]));
        dt.setMinutes(parseInt(ts[1]));
        return dt;
    },
    _getCurrentFareById: function (tData, fromId, toId) {
        var me = this;
        var fares = me._parseFares(tData);
        var key = fromId + "|" + toId;
        var fare = fares[key];
        if (typeof fare == "undefined") return 0;
        return fare;

    },
    _parseFares: function (tData) {
        var from = "";
        var to = "";
        var fare = 0;
        var fif = tData.data[tData.cTripIndex].Ts[tData.cTripTime][tData.cTripBus].F;
        if (typeof fif != "undefined" && vIsEstStr(fif) && fif.length > 1) {
            var fInfo = fif.split('~');
            var len = fInfo.length;
            var fares = [];
            for (var i = 1; i < len; i++) {
                from = fInfo[i].split('|')[0];
                to = fInfo[i].split('|')[1];
                fare = parseInt(fInfo[i].split('|')[2]);
                fares[from + "|" + to] = isNaN(fare) ? 0 : fare;
            }
            return fares;
        } else {
            return [];
        }
    },
})