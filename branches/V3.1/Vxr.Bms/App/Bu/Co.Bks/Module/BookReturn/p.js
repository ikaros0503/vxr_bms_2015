/*
 * .................Book Return Ticket...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doBookReturnTicket', function (e) { // do book return ticket
            me._getReturnInfo(e.d.f, e.d.tId);
        });
        vbv('bindEventBookReturnTicket', function (e) { // bind event when book return ticket
            me._bindEventBookReturnTicket(e.d.tId);
        });
        vbv('doUnbindEventBookReturnTicket', function (e) { // unbind event when book return ticket
            me._unbindEventBookReturnTicket();
        });
        vbv('doUpdateInfoOfReturnTickets', function (e) { // update old ticket when book return ticket
            me._updateInfoOfReturnTickets();
        });
    },
    _getReturnInfo: function (f, tId) {
        var me = this;
        app.copyInfo = {}
        app.cBookReturnTripId = tId;
        var d = $._convertFormDataToObj(f);
        if (typeof _dict._returnField != "undefined") {
            $.each(_dict._returnField, function (ki, kl) {
                app.copyInfo[kl] = d[kl] != null ? d[kl] : "";
            });
        }
        vbf('resetSeatStack'); // Reset seat stack
        vbf('onClearSelectedItem'); // Clear selected items
        vbf('onCloseUpdateForm'); // Close update form
        $._toggleFilterWhenBookReturn();
        me._bindEventBookReturnTicket(tId);
    },
    _validateBookReturn: function (f) {
        var hasError = false;
        var $phone = null;
        if (typeof _dict._returnFieldRequired != "undefined") {
            $.each(_dict._returnFieldRequired, function (kd, kf) {
                switch (kf) {
                    case "PhoneNumbers":
                        $phone = f.find('input:text[name=PhoneNumbers]');
                        break;
                    default:
                        break;
                }
            });
        }
        if ($phone != null) {
            if ($phone.val() == '') {
                $phone.closest('div.col-md-6').addClass('has-error');
                hasError = true;
                f.find('div.message-error').html('Vui lòng nhập số điện thoại.');
                f.find('div.message-error').show();
            } else {
                $phone.closest('div.col-md-6').removeClass('has-error');
                f.find('div.message-error').html('');
                f.find('div.message-error').hide();
            }
        }
        return !hasError;
    },
    _bindEventBookReturnTicket: function (tId) {
        var $tripId = $('#FilterForm').find('select[name=TripId]');
        var $tripDate = $('#FilterForm').find('input[name=DepartureDate]');
        var $tripTime = $('#FilterForm').find('select[name=TimeSlot]');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').not('ul.vbooking-coach li.seat div.fbooking').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-khu-hoi');
        });
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.paid button, ul.vbooking-coach li.seat div.fbooking button').prop('disabled', true);
        if (tId == app.cBookReturnTripId) {
            $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat').unbind('click');
            $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat button').prop('disabled', true);
            $tripDate.prop('disabled', true);
            $('#FilterForm').find('.glyphicon-calendar').parent().unbind('click');
            $tripTime.prop('disabled', true);
            if (app.hasBookReturnTicket) {
                if (!$tripId.hasClass('book-return')) {
                    $tripId.addClass('book-return');
                }
            }
        } else {
            $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.paid, ul.vbooking-coach li.seat div.fbooking').closest('li.seat').unbind('click');
            $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available button').prop('disabled', false);
            $tripId.removeClass('book-return');
            $tripDate.prop('disabled', false);
            $tripTime.prop('disabled', false);
            $._bindEventOnCalendarIcon();
        }
    },
    _unbindEventBookReturnTicket: function () {
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available').removeClass('cursor-khu-hoi');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available').unbind('mouseenter');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available button').prop('disabled', false);
    },
    _updateInfoOfReturnTickets: function () {
        if (app.seatToBeUpdatedReturningInfo.length > 0 && app.seatToBeUpdatedReturningInfo[0]._tickets.length > 0) {
            var _c = [], _d = [];
            for (var i = 0; i < app.seatToBeUpdatedReturningInfo.length; i++) {
                _c.push({
                    Id: app.seatToBeUpdatedReturningInfo[i]._tickets[0]._id,
                    Code: app.seatToBeUpdatedReturningInfo[i]._tickets[0]._code,
                    Bus: 0
                });
                _d.push({
                    ReturnCode: app.dataToBeSavedReturningInfo.code,
                    ReturnDate: app.dataToBeSavedReturningInfo.date
                });
            }
            vRqs({
                _a: 'UpdateBookTicket',
                _c: _c,
                _d: _d,
            }, function (u, r, l, t) { });
        }
        app.seatToBeUpdatedReturningInfo = [];
    },
});
$(document).ready(function () {
    $._resetBookReturnInfo = function () {
        app.copyInfo = {}
        app.hasBookReturnTicket = false;
        app.cBookReturnTripId = null;
        $._toggleFilterWhenBookReturn();
    }
    $._toggleFilterWhenBookReturn = function () {
        var $trip = $('#FilterForm').find('select[name=TripId]');
        var $tripTime = $('#FilterForm').find('select[name=TimeSlot]');
        if (app.hasBookReturnTicket) {
            $trip.addClass('book-return');
            $('#FilterForm').find('.glyphicon-calendar').parent().unbind('click');
            $tripTime.prop('disabled', true);
            $('body').trigger('fDisableDate');
        } else {
            $trip.removeClass('book-return');
            $tripTime.prop('disabled', false);
            $._bindEventOnCalendarIcon();
            $('body').trigger('fEnableDate');
        }
    }
});