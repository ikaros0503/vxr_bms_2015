/*
 * .................Move Ticket...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doMaskMovingTicket', function (e) { // mask moving ticket
            if (e.d) {
                me._maskMoveTicket(e.d.tId, e.d.tName, e.d.tDate);
            }
        });
        vbv('doMovingTicket', function (e) { // moving ticket
            if (e.d) {
                me._moveTicket(e.d.seat, e.d.tId, e.d.tName, e.d.tDate, e.d.tBus, e.d.tStage, e.d.fromId, e.d.toId, e.d.stopPoints);
            }
        });
        vbv('doResetMovingStack', function (e) { me._resetMovingStack(); }); // reset moving stack
        vbv('doUnbindEventMoving', function (e) { me._unbindEventMoving(); }); // unbind event moving
    },
    _maskMoveTicket: function (tId, tName, tDate) {
        var me = this;
        //Set is moving
        app.movingStack = [];
        app.fMoving = true;
        //Clone selected ticket to moving stack
        $.each(app.seatStack, function (i, v) {
            var ns = v._clone();
            var t = ns._getCurrentTicket();
            if (t._isNotCome()) {
                t._status = 2;
            } else if (t._isCancelled()) {
                t._status = 1;
                t._pmInfo = null; // Clear payment info
                t._cuser = null; // Clear user charge
                t._canceledDate = null; // Clear cancelledDate
                t._cancelInfo = null; // Clear cancel info
                t._cancelType = null; // Clear cancel type
                t._canceledUser = null; // Clear canceled user
                t._canceledAgentId = null; // Clear canceled agent id
            }
            app.movingStack.push(ns);
        });
        //Store moved trip info
        app.cMovingTrip = {
            _tid: tId,
            _tname: tName,
            _tdate: tDate
        };
        vbf('resetSeatStack'); // Reset seat stack
        me._toggleFilterWhenMoving();
        me._bindEventMoving();
    },
    _moveTicket: function (seat, tId, tName, tDate, tBus, tStage, fromId, toId, stopPoints) {
        var me = this;
        if (app.movingStack.length <= 0) {
            app.fMoving = false;
            app.cMovingSeat = null;
            app.cMovingTrip = null;
            me._unbindEventMoving();
            return false;
        }

        //Get data from filter form
        var mObj = me._createMovedTicketObj(seat, tId, tDate, tBus, app.cMovingTrip._tid, tStage, fromId, toId, stopPoints);
        var cb = function (u, r, l, t) {
            if (u != 1) return;
            // collect data history
            var dt = {
                _ftid: app.cMovingTrip._tid,
                _ftname: app.cMovingTrip._tname,
                _ftdate: app.cMovingTrip._tdate,
                _fs: [app.cMovingSeat._label],
                _ttid: tId,
                _ttname: tName,
                _ttdate: tDate,
                _ts: [seat._label],
            };
            vbf('onStoreHistory', { un: app.un, key: 'move', his: dt }); // Store history
            if (app.movingStack.length <= 0) {
                app.fMoving = false;
                app.movingStack = [];
                app.cMovingSeat = null;
                app.cMovingTrip = null;
                me._unbindEventMoving();
                me._toggleFilterWhenMoving();
            }
            vbf('reloadBookingSheet'); // Reload sheet           
        };
        vRqs(mObj, cb); // Submit action
    },
    _createMovedTicketObj: function (seat, tId, tDate, tBus, fId, tStage, fromId, toId, stopPoints) {
        var movedSeat = app.movingStack.shift();
        app.cMovingSeat = movedSeat;
        var movedTicket = movedSeat._getCurrentTicket();
        var departureDate = tDate;
        var pickupDate = departureDate;
        var tripDate = departureDate;
        var fromArea = "", toArea = "";
        var fromInfo = stopPoints.data[stopPoints.idx[fromId]];
        if (!$.isEmptyObject(fromInfo)) {
            fromArea = "1~" + fromInfo.Id + "|" + fromInfo.Type + "|" + fromInfo.Code + "|" + fromInfo.Name;
        }
        var toInfo = stopPoints.data[stopPoints.idx[toId]];
        if (!$.isEmptyObject(toInfo)) {
            toArea = "1~" + toInfo.Id + "|" + toInfo.Type + "|" + toInfo.Code + "|" + toInfo.Name;
        }
        var obj = {};
        obj._a = "UpdateBookTicket";
        obj._c = [];
        obj._d = [];
        obj._c.push({
            Id: movedTicket._id,
            TripId: fId,
            SeatCode: seat._getSeatInfo(),
            PickupDate: pickupDate.toFormatString('iso'),
            Bus: tBus
        });
        var dObj = {
            TripId: tId,
            SeatCode: seat._getSeatInfo(),
            TripDate: tripDate.toFormatString('iso'),
            PickupDate: pickupDate.toFormatString('iso'),
            TripAlias: tBus,
            Status: parseInt(movedTicket._status),
            PaymentInfo: movedTicket._pmInfo,
            SeatType: seat._getSeatType(),
            Code: movedTicket._code,
            LastMovedDate: movedTicket._dept.toFormatString('iso'),
            LastMovedTrip: app.cMovingTrip ? app.cMovingTrip._tid : 0,
            ChargeDate: new Date(),
            StageCode: tStage,
            FromArea: fromArea,
            ToArea: toArea,
            UserCharge: movedTicket._cuser,
            CanceledUser: movedTicket._canceledUser,
            CanceledDate: movedTicket._canceledDate,
            CancelInfo: movedTicket._cancelInfo,
            CancelType: movedTicket._cancelType,
            CanceledAgentId: movedTicket._canceledAgentId
        };
        obj._d.push(dObj);

        return obj;
    },
    _toggleFilterWhenMoving: function () {
        var $sl = $('#FilterForm').find('select[name=TripId]');
        //Thanh Update
        //if (typeof _dict._hasMoveSeatToOtherTrip != "undefined") {
        //    if (_dict._hasMoveSeatToOtherTrip)
        //        $sl.prop('disabled', false);
        //    else {
        //        if (app.fMoving || app.hasCopyTicket) {
        //            $sl.prop('disabled', true);
        //        } else {
        //            $sl.prop('disabled', false);
        //        }
        //    }
        //}
        //else {
        //    if (app.fMoving || app.hasCopyTicket) {
        //        $sl.prop('disabled', true);
        //    } else {
        //        $sl.prop('disabled', false);
        //    }
        //}

        // Edited by Duy: 2015-07-02
        if (app.fMoving) {
            if (_dict._hasMoveSeatToOtherTrip != undefined && _dict._hasMoveSeatToOtherTrip) {
                $sl.prop('disabled', false);
            } else {
                $sl.prop('disabled', true);
            }
        } else if (app.hasCopyTicket) {
            $sl.prop('disabled', true);
        } else {
            $sl.prop('disabled', false);
        }
    },
    _bindEventMoving: function () {
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat.selected').addClass('dotted-background');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-moving');
        });
    },
    _unbindEventMoving: function () {
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat').removeClass('dotted-background');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available').removeClass('cursor-moving');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available').unbind('mouseenter');
    },
    _resetMovingStack: function () {
        var me = this;
        app.movingStack = [];
        app.fMoving = false;
        me._toggleFilterWhenMoving();
    },
});
$(document).ready(function () {
    $._isInMovingStack = function (seat) {
        var found = false;
        $.each(app.movingStack, function (i, v) {
            if (found == false) {
                var t1 = v._getCurrentTicket();
                var t2 = seat._getCurrentTicket();
                if (v._coach = seat._coach && v._row == seat._row && v._col == seat._col && t1._id == t2._id) {
                    found = true;
                }
            }
        });
        return found;
    }
});