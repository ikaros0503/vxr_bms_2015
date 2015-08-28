/*
 * .................Quick Pay...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doQuickPayTicket', function (e) { // quick pay ticket
            if (e.d) {
                me._quickPay(e.d.tId, e.d.tName, e.d.tDate, e.d.tBus, e.d.sOffsetMinute);
            }
        });
    },
    _quickPay: function (tId, tName, tDate, tBus, sOffsetMinute) {
        var me = this;
        var obj = me._createObjQuickPay(tId, tBus, sOffsetMinute);
        if (obj) {
            var cb = function (u, r, l, t) {
                if (u != 1) return;
                var slabel = [];
                $.each(app.seatStack, function (i, v) {
                    slabel.push(v._label);
                });
                vbf('onStoreHistory', { // Store history
                    un: app.un,
                    key: 'update',
                    his: { '_tid': tId, '_tname': tName, '_tdate': tDate, '_s': slabel }
                });
                vbf('resetSeatStack'); // Reset seat stack
                vbf('reloadBookingSheet'); // Reload sheet
            };
            vRqs(obj, cb); // Submit action
        }
    },
    _createObjQuickPay: function (tId, tBus, sOffsetMinute) {
        var obj = {};
        obj._a = "UpdateBookTicket";
        obj._c = [];
        obj._d = [];
        var d = {}
        d.PaymentType = 1; // hình thức thu tiền tại văn phòng
        var paymentInfo = "";
        if (vIsEstStr(d.PaymentType)) {
            var pt = "";
            $.each(_dict._pm, function (k, t) {
                if ("" == pt) {
                    if (t[0] == d.PaymentType) {
                        pt = t[1].vi;
                    }
                }
            });
            var code = "";
            switch (parseInt(d.PaymentType)) {
                case 1:
                    code = $._getBranchInfo(app.aid);
                    break;
                default:
                    break;
            }
            paymentInfo = $._getPayment(d.PaymentType, pt, code);
        }
        $.each(app.seatStack, function (i, v) {
            var t = v._getCurrentTicket();
            var ticketCode = "";
            var pickUpDate = new Date(t._pdate.getTime());
            pickUpDate.addMinutes(sOffsetMinute);
            obj._c.push({
                Id: t._id,
                TripId: tId,
                SeatCode: v._getSeatInfo(),
                PickupDate: pickUpDate.toFormatString('iso'),
                Bus: tBus,
            });
            var dObj = {
                TripAlias: parseInt(tBus),
                Status: 2, // STATUS Paid
            };

            if (vIsEstStr(t._code))
                dObj.Code = t._code;

            if (typeof d.PaymentType != "undefined") {
                dObj.PaymentInfo = paymentInfo;
                if (t._isBooking() && vIsEstStr(paymentInfo)) {
                    dObj.UserCharge = app.un; // Store usercharge
                }
            }
            obj._d.push(dObj);
        });
        return obj;
    },
});
$(document).ready(function () {

});