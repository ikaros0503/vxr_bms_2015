define({
    $lstDisTrip: null,
    listTrip: [],
    onBeginSelectionChange: function (view, record) {
        vv.enableItem(view, 'button.delete', record != null);

    },
    onVMLoaded: function () {
        var me = this;
        var isLoaded = false;
        $(document).ajaxStop(function () {
            if (!isLoaded) {
                me._loadDiscount();
                isLoaded = true;

            }
        });
    },
    lstDisTripReder: function () {
        var lstHeader = $('<h3 class="text-center" />').html('Quản lý chiết khấu theo chuyến');
        var tblLstDisTrip = $('<table id="tblLstDisTrip" class="col-md-12 table-responsive table table-qlvt table-striped"/>')
            .append($('<thead />').append($('<tr />').html(
                '<th class="bg-thead">STT</th>' +
                '<th class="bg-thead" style="width:20%">Chuyến</th>' +
                '<th class="bg-thead" style="width:35%">Chiết khấu theo %</th>' +
                '<th class="bg-thead" style="width:35%">Chiết khấu theo số tiền</th>')))
            .append($('<tbody />'));
        this.$lstDisTrip = $('<div id="lstRoleBox" />').append(lstHeader).append(tblLstDisTrip);

    },
    onComSelectionChange: function () {
        var me = this, o = me.o, view = o.view;
        var radioDiscount = $(view).find('input[name=discount]:radio');
        radioDiscount.each(function () {
            var is_checked = $(this).prop('checked');
            if (is_checked === true) {
                if ($(this).val() === "3") {
                    me._loadDiscount();
                }
            }
        });
    },
    onRadioSelectionChange: function () {
        var me = this, o = me.o, view = o.view;
        var radioDiscount = $(view).find('input[name=discount]:radio');
        radioDiscount.each(function () {
            me.disable_by_rad($(this));
        });
    },
    disable_by_rad: function (rad) {
        var me = this, o = me.o, view = o.view;
        var is_checked = rad.prop('checked');
        if (is_checked === true) {
            if (rad.val() != 3) {
                rad.closest('span').next('input[type=text]').prop("disabled", false);
                $('#discount-trip').css("display", "none");
            } else {
                $('#discount-trip').css("display", "block");
            }
        } else {
            rad.closest('span').next('input[type=text]').prop("disabled", true);
        }
    },
    disable_by_rad_row: function (rad) {
        var me = this, o = me.o, view = o.view;
        var is_checked = rad.prop('checked');
        if (is_checked === true) {
            rad.closest('span').next('input[type=text]').prop("disabled", false);
        } else {
            rad.closest('span').next('input[type=text]').prop("disabled", true);
        }
    },
    _loadDiscount: function (i) {
        var me = this; o = me.o, view = o.view;
        me.listTrip = [];
        var comid = view.find('select.company-id').val();
        var obj = {
            _a: "fGetDiscount",
            compId: comid
        };

        vRql(obj, {
            a: function (u, r, l, t) {
                me.listTrip.push(r[0]);
                me.lstDisTripReder();
                me.renderLstDiscountTripData();
                me._onClickDiscountTrip();
                me._onLoadDiscountTripData();
                var data = me.listTrip[0];
                $('.fromdate').datepicker('setDate', vPrsDt(data[0][6]));
                var todate = new Date(vPrsDt(data[0][7]));
                if (todate.getFullYear() != '1970') $('.todate').datepicker('setDate', todate);
                if (data[0][5] != null) {
                    var sts = parseInt(data[0][5]);
                    switch (sts) {
                        case 1: $('.txt_chietkhau1').prop("disabled", false).val(parseInt(data[0][8]) / 100);
                            $('input:radio[name="discount"][value="1"]').prop('checked', true);
                            $('.txt_chietkhau2').prop("disabled", true).val('');
                            $('input:radio[name="discount"][value="2"]').prop('checked', false);
                            break;
                        case 2: $('.txt_chietkhau2').prop("disabled", false).val(data[0][8]);
                            $('input:radio[name="discount"][value="2"]').prop('checked', true);
                            $('.txt_chietkhau1').prop("disabled", true).val('');
                            $('input:radio[name="discount"][value="1"]').prop('checked', false);
                            break;
                        case 3: $('.txt_chietkhau2').prop("disabled", true).val('');
                            $('input:radio[name="discount"][value="1"]').prop('checked', false);
                            $('.txt_chietkhau1').prop("disabled", true).val('');
                            $('input:radio[name="discount"][value="2"]').prop('checked', false);
                            $('input:radio[name="discount"][value="3"]').prop('checked', true);
                            $('#discount-trip').css("display", "block");
                            break;
                    }
                } else {
                    $('.txt_chietkhau1').prop("disabled", false).val('');
                    $('input:radio[name="discount"][value="1"]').prop('checked', true);
                    $('.txt_chietkhau2').prop("disabled", true).val('');
                }

            },
        });
    },
    renderLstDiscountTripData: function () {
        var me = this; o = me.o, view = o.view;
        var html0 = "";
        var tblRole = this.$lstDisTrip.find('#tblLstDisTrip tbody');
        tblRole.empty();
        $.each(me.listTrip[0], function (i, trip) {
            html0 = $('<tr />').attr('data-tripId', trip[0])
                .append($('<td />').html(i + 1))
                .append($('<td />').html(trip[1]))
                .append($('<td />')
                    .append($('<div />').addClass('input-group').attr('data-original-title', 'Chiết khấu theo %').attr('data-toggle', 'tooltip').attr('data-placement', 'top')
                        .append($('<span />').addClass('input-group-addon')
                        .append($('<input />').addClass('discount1').attr('type', 'radio').attr('name', 'discount' + i).attr('value', trip[0] + ',' + trip[2]).attr('checked', 'checked')
                        ))
                        .append($('<input />').addClass('form-control txt_discount' + i + 1 + ' rights R').attr('type', 'text').attr('placeholder', 'Chiết khấu theo %'))
                        .append($('<span />').addClass('input-group-addon').html('%'))
                        ))
                    .append($('<td />')
                    .append($('<div />').addClass('input-group').attr('data-original-title', 'Chiết khấu theo số tiền').attr('data-toggle', 'tooltip').attr('data-placement', 'top')
                        .append($('<span />').addClass('input-group-addon')
                        .append($('<input />').addClass('discount2').attr('type', 'radio').attr('name', 'discount' + i).attr('value', trip[0] + ',' + trip[2])
                        ))
                        .append($('<input />').addClass('form-control txt_discount' + i + 1 + ' rights R').attr('type', 'text').attr('placeholder', 'Chiết khấu theo số tiền').attr('disabled', 'disabled'))
                        .append($('<span />').addClass('input-group-addon').html('VND'))
                        ));
            tblRole.append(html0);
        });
        $('#discount-trip').html(this.$lstDisTrip.html()).css("display", "none");
    },
    _onClickDiscountTrip: function (i) {
        var me = this; o = me.o, view = o.view;
        $(view).find('#tblLstDisTrip input[type=radio]').on('click', function () {
            var nameradioDiscount = $(this).attr('name');
            var radioDiscount = $(view).find('input[name=' + nameradioDiscount + ']:radio');
            radioDiscount.each(function () {
                me.disable_by_rad_row($(this));
            });
        });
    },
    _onLoadDiscountTripData: function (i) {
        var me = this; o = me.o, view = o.view;
        $.each(me.listTrip[0], function (i, trip) {
            if (trip[9] != 0) {
                var sts = parseInt(trip[9]);
                var value = parseInt(trip[8]) / 100;
                switch (sts) {
                    case 1: $('#tblLstDisTrip').find('tr[data-tripId="' + trip[0] + '"]').find('input:radio[class="discount1"]').prop('checked', true).closest('span').next('input[type=text]').prop("disabled", false).val(value);
                        $('#tblLstDisTrip').find('tr[data-tripId="' + trip[0] + '"]').find('input:radio[class="discount2"]').prop('checked', false).closest('span').next('input[type=text]').prop("disabled", true).val('');
                        break;
                    case 2: $('#tblLstDisTrip').find('tr[data-tripId="' + trip[0] + '"]').find('input:radio[class="discount2"]').prop('checked', true).closest('span').next('input[type=text]').prop("disabled", false).val(trip[8]);
                        $('#tblLstDisTrip').find('tr[data-tripId="' + trip[0] + '"]').find('input:radio[class="discount1"]').prop('checked', false).closest('span').next('input[type=text]').prop("disabled", true).val('');
                        break;
                }
            }
        });

    },
    onSaveDisTrip: function () {
        var me = this, o = me.o, view = o.view;
        var hasError = false;
        var check = false;
        var msg = '';
        var table = $(view).find('#tblLstDisTrip tbody tr input[type=radio]:checked');
        var comid = $(view).find('select.company-id').val();
        var fromdate = me.toDbDateString(new Date($(".fromdate").datepicker("getDate")));
        var todate = me.toDbDateString(new Date($(".todate").datepicker("getDate")));
        var dis1 = $(view).find('.txt_chietkhau1');
        var dis2 = $(view).find('.txt_chietkhau2');
        var discount = null;
        var status = null;
        var prgStatus = null;
        var dat = [];
        var cond = [];
        var idat = [];
        var icond = [];
        var radioDiscount = $(view).find('input[name=discount]:radio:checked').val();
        var regex = /^\d+(?:\.\d{0,2})$/;
        if (fromdate == "") {
            hasError = true;
            msg += 'Vui lòng nhập ngày bắt đầu. \n';
        }

        if (radioDiscount != 3) {
            if (radioDiscount === '1') {
                if (dis1.val() == "") {
                    hasError = true;
                    msg += 'Vui lòng nhập % chiết khấu. \n';
                } else if (!vIsPNum(dis1.val())) {
                    hasError = true;
                    msg += "\n" + '% chiết khấu không hợp lệ.';
                } else {
                    discount = dis1.val() * 100;
                    status = 1;
                }
            } else {
                if (dis2.val() == "") {
                    hasError = true;
                    msg += 'Vui lòng nhập số tiền chiết khấu. \n';
                } else if (!vIsCurrency(dis1.val())) {
                    hasError = true;
                    msg += "\n" + '% chiết khấu không hợp lệ.';
                } else {
                    discount = dis2.val();
                    status = 2;
                }
            }
            if (hasError) {
                vv.showMessage({
                    element: view.find('.alert.message'),
                    type: 'alert-danger',
                    content: msg
                });
            } else {
                var de = 0;
                var ue = 0;
                $.each(me.listTrip[0], function (i, trip) {
                    var value = discount;
                    prgStatus = 0;
                    var tripId = trip[0];
                    var disId = trip[2];
                    var obj, data, c;
                    data = {
                        "XCompanyId": "" + comid + "",
                        "XTypeId": "" + 16 + "",
                        "XTripId": "" + tripId + "",
                        "XStatus": "" + status + "",
                        "XDate": "" + fromdate + "",
                        "ZDate": "" + todate + "",
                        "XValue": "" + value + "",
                        "IsPrgStatus": "" + prgStatus + ""
                    };
                    c = {
                        Id: disId
                    };
                    if (disId != null) {
                        ue += 1;
                        dat.push(data);
                        cond.push(c);
                    }
                    else {
                        de += 1;
                        idat.push(data);
                    }
                });
                if (de > 0) {
                    me._saveData(idat, icond, 'InDiscount');
                }
                if (ue > 0) {
                    me._saveData(dat, cond, 'UpDiscount');
                }
            }
        }
        else {
            status = 3;
            var ck = false;
            var de = 0;
            var ue = 0;
            table.each(function () {
                var disval = $(this).closest('span').next('input[type=text]').val();
                if (disval == "") {
                    hasError = true;
                    msg += 'Vui lòng nhập chiết khấu đã chọn. \n';
                    ck = false;
                    return false;
                } else if (!vIsPNum(disval)) {
                    hasError = true;
                    msg += "\n" + 'Chiết khấu không hợp lệ.';
                    ck = false;
                    return false;
                }
                if (hasError) {
                    vv.showMessage({
                        element: view.find('.alert.message'),
                        type: 'alert-danger',
                        content: msg
                    });
                } else {

                    var is_checked = $(this).prop('checked');
                    var cls = $(this).attr("class");
                    var stringid = $(this).val().split(',');
                    var value = null;
                    if (cls === 'discount1') {
                        prgStatus = 1;
                        value = disval * 100;
                    } else {
                        prgStatus = 2;
                        value = disval;
                    }
                    var tripId = null;
                    var disId = null;
                    if (stringid.length > 0) {
                        tripId = stringid[0];
                        disId = stringid[1];
                    }
                    var obj, data, c;
                    data = {
                        "XCompanyId": "" + comid + "",
                        "XTripId": "" + tripId + "",
                        "XTypeId": "" + 16 + "",
                        "XStatus": "" + status + "",
                        "XDate": "" + fromdate + "",
                        "ZDate": "" + todate + "",
                        "XValue": "" + value + "",
                        "IsPrgStatus": "" + prgStatus + "",

                    };
                    c = { Id: disId };
                    if (disId != null) {
                        ue += 1;
                        dat.push(data);
                        cond.push(c);
                    }
                    else {
                        de += 1;
                        idat.push(data);
                    }
                    ck = true;
                }
            });
            if (ck) {
                if (de > 0) {
                    me._saveData(idat, icond, 'InDiscount');
                }
                if (ue > 0) {
                    me._saveData(dat, cond, 'UpDiscount');
                }
            }
            if (hasError) {
                vv.showMessage({
                    element: view.find('.alert.message'),
                    type: 'alert-danger',
                    content: msg
                });
            }
        }
    },
    //onDeleteDisTrip: function () {
    //    var me = this, o = me.o, view = o.view;
    //    var hasError = false;
    //    var msg = '';
    //    var comid = $(view).find('select.company-id').val();
    //    var data = [];
    //    var cond = [];
    //    $.each(me.listTrip[0], function (i, trip) {
    //        var disId = trip[2];
    //        var tripId = trip[0];
    //        var d, c;
    //        c = {
    //            Id: disId
    //        };

    //        d = {
    //            "XCompanyId": "" + comid + "",
    //            "XTypeId": "" + 16 + "",
    //            "XTripId": "" + tripId + ""
    //        };
    //        cond.push(c);
    //        data.push(d);
    //    });
    //    me._saveData(data, cond, 'RemoveDiscount');
    //},

    _saveData: function (dt, cd, action) {
        var me = this, o = me.o, view = o.view;
        var obj;
        obj = { _a: action, _c: cd, _d: dt };
        vRqs(obj, function (u, r, l, t) {
            if (u) {
                if (me.onActionComplete) me.onActionComplete.call(me);
                vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                me._loadDiscount();
            } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
        });
    },

    onClear: function () {
        var me = this;
        me.model = null;       
        view.find('input').each(function () {
            if (!$(this).hasClass('noCls'))
                $(this).val('');
        });      
        if (o.defaultFocusRef) view.find(o.defaultFocusRef).trigger('focus');
    },

    toDbDateString: function (date) {
        /// <summary>Convert date object to Database format</summary>
        /// <param name="date" type="date">date to be converted</param>
        /// <returns type="string">String in database format</returns>
        return date.getFullYear() + (date.getMonth() <= 8 ? '-0' : '-') + (date.getMonth() + 1) + (date.getDate() <= 9 ? '-0' : '-') + date.getDate();
    },

});