/*
 * .................Cancel...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doCloseCancelForm', function () {
            me._closeCancelDialog();
        });
        vbv('doShowCancelForm', function (e) { // show cancel form
            me._createCancelDialogDiv();
            var $form = $(o._e);
            if (typeof e.d.allIsBooking != 'undefined' && e.d.allIsBooking) {
                $form.find('.divFeePercentRadio').children().prop('disabled', true);
                $form.find('.divFeePercentRadio div').children().prop('disabled', true);
            } else {
                $form.find('.divFeePercentRadio').children().prop('disabled', false);
                $form.find('.divFeePercentRadio div').children().prop('disabled', false);
            }
            $form.find('input[name="TicketFares"]').val(e.d.totalFare);
            me._bindEventOnCancelForm($form, e.d.tId, e.d.tName, e.d.tDate, e.d.st, e.d.tBus, e.d.sc); // bind event on form
            $form.modal('show');
        });
    },
    _createCancelDialogDiv: function () {
        /// <summary>
        /// Create Cancel Form
        /// </summary>
        var f = null;
        var cancelFeePercentDefault = 0;
        var cancelFeeMoneyDefault = 0;
        if (typeof _dict._cancelFeePercentDefault != "undefined") {
            cancelFeePercentDefault = _dict._cancelFeePercentDefault;
        }
        if (typeof _dict._cancelFeeMoneyDefault != "undefined") {
            cancelFeeMoneyDefault = _dict._cancelFeeMoneyDefault.toMn();
        }
        var $cancelBody = $('<div />').addClass('modal-body').css('padding-top', '10px')
            .append($('<form />').attr('id', "CancelForm")
                .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                    .append($('<tr />')
                        .append($('<td style="border:0;" />').addClass('col-md-6')
                            .append($('<input type="hidden" name="TicketFares" value="" />'))
                            .append($('<lable class="control-label col-md-2 pr0 pl0 lblFeePercentRadio" style="margin: 5px 0 0 0 !important;"/>').html("Phí hủy vé : "))
                                .append($('<div />').addClass('input-group col-md-10 divFeePercentRadio').css('margin-top', '-2px')
                                    .append($('<div class="input-group-addon pl0 " />').css('border', '0').css('background-color', 'transparent')
                                        .append($('<input type="radio" name="FeePercentRadio" checked="checked"/>').css('margin-top', '3px'))
                                    )
                                    .append($('<input type="text" class="form-control input-sm" name="CancelFeePercentInput" value="' + cancelFeePercentDefault + '" style="border-bottom-left-radius: 3px;border-top-left-radius: 3px;" />'))
                                    .append($('<span style="border-bottom-right-radius: 3px;border-top-right-radius: 3px;"/>').addClass("input-group-addon").html("%"))
                                    .append($('<div class="input-group-addon pl0" />').css('border', '0').css('background-color', 'transparent')
                                        .append($('<input type="radio" name="FeeMoneyRadio" />').css('margin', '3px 0 0 25px'))
                                    )
                                    .append($('<input type="text" class="form-control input-sm" name="CancelFeeMoneyInput" value="' + cancelFeeMoneyDefault + '" style="border-bottom-left-radius: 3px;border-top-left-radius: 3px;" />'))
                                    .append($('<span />').addClass("input-group-addon").html("đ"))
                                )
                            .append($('<div style="margin-top:10px;margin-bottom:10px;"/>').addClass('form-group col-md-12 pl0 pr0')
                                .append($('<lable class="control-label col-md-2 pr0 pl0" style="margin: 5px 0 0 0 !important;"/>').html("Lý do hủy vé: "))
                                .append($('<div class="col-md-10 pl0 pr0" />')
                                    .append($('<select class="form-control input-sm cor-black abc" name="CancelReason"/>')
                                        .append($('<option value=""> - - - - - Chọn lý do hủy vé - - - - - </option>'))
                                        .append($('<option value="1">Nhà xe</option>'))
                                        .append($('<option value="2">Khách hàng hủy</option>'))
                                        .append($('<option value="3">Đại lý hủy</option>'))
                                        .append($('<option value="4">Hủy hoàn toàn</option>'))
                                        .append($('<option value="0">Khác</option>'))
                                    )
                                    .change(function (e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        var cancelReasonId = f.find('select[name="CancelReason"]').val();
                                        if (cancelReasonId != '') {
                                            f.find('div.warning-mess').html('').hide();
                                        }
                                    })
                                )
                            )
                            .append($('<div />').addClass('form-group col-md-12 pl0 pr0').css('margin-bottom', '10px')
                                .append($('<lable class="control-label col-md-2 pr0 pl0" />').html("Ghi chú: "))
                                .append($('<div class="col-md-10 pl0 pr0" />')
                                    .append($('<textarea class="col-md-12 form-control input-sm" name="NoteCancel" />'))
                                )
                            )
                            .append($('<div style="margin:10px 0;"/>').addClass('form-group')
                                .append($('<p />').html("Bạn có chắc muốn hủy vé đã chọn ?"))
                            )
                        )
                    )
                    .append($('<tr />')
                        .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                            .append($('<button />', { type: 'button' }).addClass('btn btn-danger btn-cancel').text('Hủy vé').css('float', 'left'))
                            .append($('<button />', { type: 'button' }).addClass('btn btn-default btn-close').text('Đóng').css('float', 'left'))
                        )
                    )
                )
        );

        //Create a div for dialog and add to container element
        f = $('<div />').addClass('modal fade').attr('id', 'cancel-popup')
            .attr('role', 'dialog')
            .attr('aria-hidden', 'true')
            .append(
                $('<div />').addClass('modal-dialog modal-md')
                .append($('<div />').addClass('modal-content')
                    .append($('<div />').addClass('modal-header bg-primary')
                        .append($('<h3 />').addClass('modal-title thin-1').html('Xác nhận'))
                    )
                    .append($('<div class="warning-mess alert alert-danger" role="alert" style="display:none;"/>').css('margin', '10px 10px 0 10px'))
                    .append($cancelBody)
                )
            ).appendTo($('body'));
    },
    _closeCancelDialog: function (f) {
        var me = this;
        if (f) {
            f.modal('hide');
            me._resetCancelForm(f);
        }
    },
    _resetCancelForm: function (f) {
        var cancelFeePercentDefault = 0;
        var cancelFeeMoneyDefault = 0;
        if (typeof _dict._cancelFeePercentDefault != "undefined") {
            cancelFeePercentDefault = _dict._cancelFeePercentDefault;
        }
        if (typeof _dict._cancelFeeMoneyDefault != "undefined") {
            cancelFeeMoneyDefault = _dict._cancelFeeMoneyDefault.toMn();
        }
        f.find('input[name="FeePercentRadio"]').prop('checked', true).button("refresh");
        f.find('input[name="CancelFeePercentInput"]').val(cancelFeePercentDefault);
        //f.find('input[name="CancelFeePercentInput"]').removeAttr('disabled');
        f.find('input[name="CancelFeePercentInput"]').removeClass('cmodal-error-input');
        f.find('input[name="CancelFeePercentInput"]').next().removeClass('cmodal-error-addon');
        f.find('input[name="FeeMoneyRadio"]').prop('checked', false).button("refresh");
        f.find('input[name="CancelFeeMoneyInput"]').val(cancelFeeMoneyDefault);
        //f.find('input[name="CancelFeeMoneyInput"]').removeAttr('disabled');
        //f.find('input[name="CancelFeeMoneyInput"]').prop('disabled', true);
        f.find('input[name="CancelFeeMoneyInput"]').removeClass('cmodal-error-input');
        f.find('input[name="CancelFeeMoneyInput"]').next().removeClass('cmodal-error-addon');
        f.find('select[name="CancelReason"]').val('');
        f.find('textarea[name="NoteCancel"]').val('');
        f.find('div.warning-mess').html('').hide();
    },
    _bindEventOnCancelForm: function (f, tId, tName, tDate, st, tBus, sc) {
        /// <summary>
        /// Bind Event On Cancel Form 
        /// </summary>
        /// <param name="f">Cancel Form</param>
        /// <param name="tId">TripId</param>
        /// <param name="tName">TripName</param>
        /// <param name="tDate">TripDate</param>
        /// <param name="st">Selected Seats</param>
        /// <param name="tBus">TripBus</param>
        /// <param name="sc">StageCode</param>
        var me = this;
        var cancelFeePercentDefault = 0;
        var cancelFeeMoneyDefault = 0;
        if (typeof _dict._cancelFeePercentDefault != "undefined") {
            cancelFeePercentDefault = _dict._cancelFeePercentDefault;
        }
        if (typeof _dict._cancelFeeMoneyDefault != "undefined") {
            cancelFeeMoneyDefault = _dict._cancelFeeMoneyDefault.toMn();
        }
        f.find('input[name="FeePercentRadio"]').unbind().on('change', function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                f.find('div.warning-mess').html('').hide();
                $(this).prop('checked', true).button("refresh");
                f.find('input[name="FeeMoneyRadio"]').prop('checked', false);
                f.find('input[name="CancelFeeMoneyInput"]').val(cancelFeeMoneyDefault);
                //f.find('input[name="CancelFeeMoneyInput"]').prop('disabled', true);
                f.find('input[name="CancelFeeMoneyInput"]').removeClass('cmodal-error-input');
                f.find('input[name="CancelFeeMoneyInput"]').next().removeClass('cmodal-error-addon');
                //f.find('input[name="CancelFeePercentInput"]').removeAttr('disabled');
            } catch (e) {
                console.error(e);
            }
        });
        f.find('input[name="FeeMoneyRadio"]').unbind().on('change', function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                f.find('div.warning-mess').html('').hide();
                $(this).prop('checked', true).button("refresh");
                f.find('input[name="FeePercentRadio"]').prop('checked', false);
                f.find('input[name="CancelFeePercentInput"]').val(cancelFeePercentDefault);
                //f.find('input[name="CancelFeePercentInput"]').prop('disabled', true);
                f.find('input[name="CancelFeePercentInput"]').removeClass('cmodal-error-input');
                f.find('input[name="CancelFeePercentInput"]').next().removeClass('cmodal-error-addon');
                //f.find('input[name="CancelFeeMoneyInput"]').removeAttr('disabled');
            } catch (e) {
                console.error(e);
            }
        });
        f.find('input[name="CancelFeePercentInput"]').unbind().on('change', function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                var feePercent = $(this).val();
                if (isNaN(feePercent)) {
                    f.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                    $(this).addClass('cmodal-error-input');
                    $(this).next().addClass('cmodal-error-addon');
                } else {
                    f.find('div.warning-mess').html('').hide();
                    $(this).removeClass('cmodal-error-input');
                    $(this).next().removeClass('cmodal-error-addon');
                }
            } catch (e) {
                console.error(e);
            }
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
        f.find('input[name="CancelFeeMoneyInput"]').unbind().on('change', function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                var feeMoney = $(this).val();
                if (isNaN(feeMoney)) {
                    f.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                    $(this).addClass('cmodal-error-input');
                    $(this).next().addClass('cmodal-error-addon');
                } else {
                    f.find('div.warning-mess').html('').hide();
                    $(this).removeClass('cmodal-error-input');
                    $(this).next().removeClass('cmodal-error-addon');
                    if (parseInt(feeMoney) < 10000) {
                        feeMoney = feeMoney * 1000;
                    }
                    $(this).val(parseInt(feeMoney).toMn());
                }
            } catch (e) {
                console.error(e);
            }
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
        f.find('[name="CancelFeeMoneyInput"]').on('focus', function () {
            $(this).select();
            f.find('input[name="FeeMoneyRadio"]').prop('checked', true);
            f.find('input[name="FeePercentRadio"]').prop('checked', false);
        });
        f.find('[name="CancelFeePercentInput"]').on('focus', function () {
            $(this).select();
            f.find('input[name="FeeMoneyRadio"]').prop('checked', false);
            f.find('input[name="FeePercentRadio"]').prop('checked', true);
        });
        f.find('button.btn-cancel').unbind().on('click', function () {
            try {
                var cancelFeePercent = 0;
                var cancelFeeMoney = 0;
                var isPercent = false;
                var isMoney = false;
                if (f.find('input[name="FeePercentRadio"]').is(':checked')) {
                    cancelFeePercent = f.find('input[name="CancelFeePercentInput"]').val();
                    if (isNaN(cancelFeePercent)) {
                        f.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                        return;
                    }
                    if (cancelFeePercent > 100) {
                        f.find('div.warning-mess').html('Phí hủy vé không được lớn hơn 100%, vui lòng kiểm tra lại.').show();
                        return;
                    }
                    isPercent = true;
                }
                if (f.find('input[name="FeeMoneyRadio"]').is(':checked')) {
                    cancelFeeMoney = f.find('input[name="CancelFeeMoneyInput"]').val().replace(/\./g, '');
                    if (isNaN(cancelFeeMoney)) {
                        f.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                        return;
                    }
                    var ticketFares = f.find('input[name="TicketFares"]').val();
                    var isError = [];
                    $.each(ticketFares.split(','), function(k, v) {
                        if (parseInt(cancelFeeMoney) > parseInt(v)) {
                            isError.push(v);
                        }
                    });
                    if (isError.length > 0) {
                        f.find('div.warning-mess').html('Phí hủy vé không được lớn hơn tổng giá vé: ' + ticketFares + ' đ.').show();
                        return;
                    }
                    isMoney = true;
                }
                var cancelReasonId = f.find('select[name="CancelReason"]').val();
                var cancelReasonInfo = f.find('textarea[name="NoteCancel"]').val();
                if (typeof _dict._cancelReasonRequired != 'undefined' && _dict._cancelReasonRequired) {
                    if (cancelReasonId != '') {
                        me._cancelTicket(f, isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo, tId, tName, tDate, st, tBus, sc);
                        me._resetCancelForm(f);
                    } else {
                        f.find('div.warning-mess').html('Vui lòng chọn lý do hủy vé.').show();
                    }
                } else {
                    me._cancelTicket(f, isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo, tId, tName, tDate, st, tBus, sc);
                    me._resetCancelForm(f);
                }
            } catch (e) {
                console.error(e);
            }
        });
        f.find('button.btn-close').unbind().on('click', function () {
            vbf('onClearSelectedItem'); // Clear selected item
            vbf('resetSeatStack'); // Reset seat stack
            me._closeCancelDialog(f);
            me._resetCancelForm(f);
        });
    },
    _cancelTicket: function (f, isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo, tId, tName, tDate, st, tBus, sc) {
        /// <summary>
        /// Cancel ticket
        /// </summary>
        /// <param name="f">Cancel form</param>
        /// <param name="isPercent"></param>
        /// <param name="cancelFeePercent"></param>
        /// <param name="isMoney"></param>
        /// <param name="cancelFeeMoney"></param>
        /// <param name="cancelReasonId"></param>
        /// <param name="cancelReasonInfo"></param>
        /// <param name="tId">TripId</param>
        /// <param name="tName">TripName</param>
        /// <param name="tDate">TripDate</param>
        /// <param name="st">Selected Seats</param>
        /// <param name="tBus">TripBus</param>
        /// <param name="sc">StageCode</param>
        var me = this;
        var obj = me._createCancelTicketObj(isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo, st, tId, tBus, sc);
        var cb = function (u, r, l, t) {
            if (u != 1) return;
            var slabel = [];
            $.each(st, function (i, v) {
                slabel.push(v._label);
            });
            // get first seat for send sms
            var stSms = st[0];
            vbf('onStoreHistory', { // store history
                un: app.un,
                key: 'cancel',
                his: { '_tid': tId, '_tname': tName, '_tdate': tDate, '_s': slabel }
            });
            vbf('resetSeatStack'); // Reset seat stack
            vbf('reloadBookingSheet'); // Reload sheet
            me._closeCancelDialog(f); // Close dialog
            // auto send sms when cancel Ticket
            if (_dict._autoSendSmsCancel != undefined && _dict._autoSendSmsCancel) {
                var phones = [];
                var seat = stSms._getCurrentTicket();
                if (!$.isEmptyObject(seat) && vIsEstStr(seat._cphone)) {
                    phones.push(seat._cphone);
                }
                var dataMess = {
                    _tripName: tName,
                    _tripDate: tDate.toFormatString("HH:mm-dd.mm.yyyy"),
                    _nOfSeat: slabel.length,
                    _seatCodes: slabel.join(",")
                }
                var message = vtpl(_dict._smsCancelTpl, dataMess);
                if (phones.length > 0) {
                    var smsObj = {
                        _a: "sendMobifoneSms",
                        _c: {},
                        _d: {
                            phones: phones.join(","),
                            message: message
                        }
                    }
                    vRqs(smsObj); // Submit Request
                }
            }
        };
        vRqs(obj, cb);
    },
    _createCancelTicketObj: function (isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo, st, tId, tBus, sc) {
        var obj = {};
        obj._a = "UpdateBookTicket";
        obj._c = [];
        obj._d = [];
        var numOfCancel = st.length;
        $.each(st, function (i, v) {
            var t = v._getCurrentTicket();
            var cancelFee = 0;
            if (isPercent) {
                cancelFee = t._fare * cancelFeePercent / 100;
            }
            if (isMoney) {
                cancelFee = Math.floor(cancelFeeMoney / numOfCancel);
            }
            obj._c.push({
                Id: t._id,
                TripId: tId,
                SeatCode: v._getSeatInfo(),
                PickupDate: t._pdate.toFormatString('iso'),
                Bus: tBus,
                StageCode: !sc ? 1 : sc //StageCode
            });
            var dObj = {
                TripAlias: parseInt(tBus),
                Status: 3,
                CancelFee: cancelFee,
                CancelType: cancelReasonId,
                CancelInfo: cancelReasonInfo,
                CanceledUser: app.un,
                CanceledAgentId: app.aid
            };
            obj._d.push(dObj);
        });
        return obj;
    },
});