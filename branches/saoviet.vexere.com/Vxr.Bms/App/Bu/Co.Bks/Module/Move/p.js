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
                me._moveTicket(e.d.seat, e.d.tId, e.d.tName, e.d.tDate, e.d.tBus);
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
    _moveTicket: function (seat, tId, tName, tDate, tBus) {
        var me = this;
        if (app.movingStack.length <= 0) {
            app.fMoving = false;
            app.cMovingSeat = null;
            app.cMovingTrip = null;
            me._unbindEventMoving();
            return false;
        }
        //Get data from filter form
        var mObj = me._createMovedTicketObj(seat, tId, tDate, tBus);
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
    _createMovedTicketObj: function (seat, tId, tDate, tBus) {
        var movedSeat = app.movingStack.shift();
        app.cMovingSeat = movedSeat;
        var movedTicket = movedSeat._getCurrentTicket();
        var departureDate = tDate;
        var pickupDate = departureDate;
        var tripDate = departureDate;
        var obj = {};
        obj._a = "UpdateBookTicket";
        obj._c = [];
        obj._d = [];
        obj._c.push({
            Id: movedTicket._id,
            TripId: tId,
            SeatCode: seat._getSeatInfo(),
            PickupDate: pickupDate.toFormatString('iso'),
            Bus: tBus
        });
        var dObj = {
            SeatCode: seat._getSeatInfo(),
            TripDate: tripDate.toFormatString('iso'),
            PickupDate: pickupDate.toFormatString('iso'),
            TripAlias: tBus,
            Status: parseInt(movedTicket._status),
            PaymentInfo: movedTicket._pmInfo,
            SeatType: seat._getSeatType(),
            Code: movedTicket._code,
            LastMovedDate: movedTicket._dept.toFormatString('iso'),
            ChargeDate: new Date()
        };
        obj._d.push(dObj);
        return obj;
    },
    _toggleFilterWhenMoving: function () {
        var $sl = $('#FilterForm').find('select[name=TripId]');
        if (app.fMoving || app.hasCopyTicket) {
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