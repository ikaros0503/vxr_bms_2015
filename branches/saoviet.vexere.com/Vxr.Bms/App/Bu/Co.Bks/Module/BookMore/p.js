/*
 * .................Book More Ticket...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doBookMoreTicket', function (e) { // do book more ticket
            me._getCopyInfo(e.d.f, e.d.oldCode, e.d.fromArea, e.d.toArea, e.d.tdid);
        });
        vbv('bindEventCopying', function (e) { // bind event when book more ticket
            me._bindEventCopying();
        });
        vbv('doUnbindEventCopying', function (e) { // unbind event when book more ticket
            me._unbindEventCopying();
        });
    },
    _getCopyInfo: function (f, oldCode, fromArea, toArea, tdId) {
        var me = this;
        app.copyInfo = {};
        var d = $._convertFormDataToObj(f);
        if (typeof _dict._copyField != "undefined") {
            $.each(_dict._copyField, function (ki, kl) {
                app.copyInfo[kl] = d[kl] != null ? d[kl] : "";
            });
        }
        app.copyInfo["Code"] = oldCode;
        app.copyInfo["FromArea"] = fromArea;
        app.copyInfo["ToArea"] = toArea;
        app.copyInfo["TripDetailId"] = tdId;
        /*............move validate into function validateUpdateForm...........*/
        //if (!me._validateThemVe(f)) {
        //    $._resetCopyInfo();
        //    me._unbindEventCopying();
        //    return;
        //}
        vbf('resetSeatStack'); // Reset seat stack
        vbf('onClearSelectedItem'); // Clear selected items
        vbf('onCloseUpdateForm'); // Close update form
        $._toggleFilterWhenCopyTicket();
        me._bindEventCopying();
    },
    _validateThemVe: function (f) {
        var hasError = false;
        var $phone = null;
        var $note = null;
        var $payment = f.find('input[name=PaymentType]');
        if (typeof _dict._copyFieldRequired != "undefined") {
            $.each(_dict._copyFieldRequired, function (kd, kf) {
                switch (kf) {
                    case "Note":
                        $note = f.find('textarea[name=Note]');
                        break;
                    case "PhoneNumbers":
                        $phone = f.find('input:text[name=PhoneNumbers]');
                        break;
                    default:
                        break;
                }
            });
        }
        if ($payment.val() == "" || typeof $payment.val() == "undefined") {
            if ($phone && vIsEstStr($phone.val())) {
                if (!$phone.val().isMulPhone()) {
                    $phone.closest('div.col-md-6').addClass('has-error');
                    hasError = true;
                } else {
                    $phone.closest('div.col-md-6').removeClass('has-error');
                }
            } else {
                if ($note == null) {
                    $phone.closest('div.col-md-6').addClass('has-error');
                    hasError = true;
                } else {
                    if (!vIsEstStr($note.val())) {
                        $phone.closest('div.col-md-6').addClass('has-error');
                        hasError = true;
                    }
                }
            }
        }
        return !hasError;
    },
    _bindEventCopying: function () {
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').not('ul.vbooking-coach li.seat div.fbooking').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-them-ve');
        });
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.paid, ul.vbooking-coach li.seat div.fbooking').closest('li.seat').unbind('click');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.paid button, ul.vbooking-coach li.seat div.fbooking button').prop('disabled', true);
    },
    _unbindEventCopying: function () {
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').removeClass('cursor-them-ve');
        $('#bksContent div.vbooking-sheet').find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').unbind('mouseenter');
    },
});
$(document).ready(function () {
    $._resetCopyInfo = function () {
        app.copyInfo = {}
        app.hasCopyTicket = false;
        $._toggleFilterWhenCopyTicket();
    }
    $._toggleFilterWhenCopyTicket = function () {
        var $sl = $('#FilterForm').find('select[name=TripId]');
        if (app.hasCopyTicket) {
            $sl.prop('disabled', true);
        } else {
            $sl.prop('disabled', false);
        }
    }
});