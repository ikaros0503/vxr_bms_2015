/*
 * .................Update...................
 */
define({
    currentPaymentType:null,
    start: function (o) {
        var me = this;
        if (o.m) {
            $.extend(_dict, _dict, o.m);
        }
        me._createUpdateDialogDiv();
                
        var $form = $(o._e);
        vev('body', 'doShowUpdateForm', function (e) { // show update form
            if (e.d) {
                try {
                    me._mapInfo($form);
                    var that = e.d.self;
                    var s = e.d.seat;
                    var tId = that._cTripId;
                    var tIndex = that._cTripIndex;
                    var tName = that._data[tIndex].Name;
                    var tDate = that._getDepartureTime();
                    var tTime = that._cTripTime;
                    var tBus = that._cTripBus;
                    var sc = that._cStageCode;
                    var tdid = that._data[tIndex].Ts[tTime][tBus]['TripDetailId'];
                    var st = app.seatStack;
                    var cs = that._data[tIndex].Ts[tTime][0]['ClosedStatus'];
                    var fi = that._data[tIndex].Ts[tTime][tBus].F;
                    var stopPoints = that._data[tIndex].StopPoints;
                    var offsetMinute = that._sOffsetMinute;
                    var dfId = that._cDefaultFromId;
                    var dtId = that._cDefaultToId;
                    var cTrip = that._data[tIndex];
                    var lmDate = that._getLimitedDate();
                    var lpp = that._data[tIndex].PickedPointsInfo; // pickup points
                    var ltp = that._data[tIndex].TransferPointsInfo; // transfer points
                    var tInfo = that._getCurrentTripInfo(); // current trip info
                    var rp = that._data[tIndex].StopPoints['data'];
                    var blockEnterEvent = false;
                    if (e.d.blockEnterEvent != undefined && e.d.blockEnterEvent) {
                        blockEnterEvent = true;
                    }
                    //Prepare data
                    var fObj = me._initUpdateFormData($form, s, st, tdid, offsetMinute, rp, tId);
                    me.currentPaymentType = typeof (fObj.PaymentType) == 'undefined' ? 0 : parseInt(fObj.PaymentType);
                    if (fObj) {
                        // reset From Route Point & To Route Point
                        app.fromRouteId = 0;
                        app.toRouteId = 0;
                        me._resetForm($form);
                        $form.find('div.message-error').html('');
                        $form.find('div.message-error').hide();
                        me._populateFormData(fObj, $form);
                        me._renderSeatNoDiv(fObj.SeatNo, $form);
                        me._createRoutePoints($form, fObj.RoutePoints, fObj.FromArea, fObj.ToArea, dfId, dtId, tTime, fi);
                        me._resetForm($form.find('#ValidForm')); // reset Valid form
                        vbf('renderHistoryUpdateForm', { seat: s }); // render History
                        me._disableFormFields($form, s, st, cs, tId); // Disable form fields
                        me._bindEventOnUpdateForm($form, st, tId, tName, tDate, tBus, sc, stopPoints, offsetMinute, cTrip, tdid, lmDate, cs, lpp, ltp, tTime, tInfo, blockEnterEvent);
                        $form.modal('show');
                        me._triggerUpdateTab($form);
                        me._triggerUpdateForm($form);
                    }
                } catch (err) {
                    vbf('showErrorForm', { message: err }); // Show error form
                }
            } else {
                console.log('Show update form fail 2.....');
            }
        });
        vev('body', 'doCloseUpdateForm', function (e) { me._closeUpdateDialog($form); }); // close update form
    },

    _createUpdateDialogDiv: function () {
        var self = this;

        vRqs({
            _a: "fGetArea",
            _c: {
                BaseId: self._createBaseIdQueryCondition(app.cid),
                Type: "( $x=5 or $x=3 )",
                IsPrgStatus: 1
            },
            _f: "Id, Type, Code, Name"
        }, function (u, r, l, t) {
            if(u != 1 || l <= 0) return;
            self._listArea =[];
            var fromStop = $('select[name="FromStop"]');
            var toStop = $('select[name="ToStop"]');
            $.each(r, function(x, v) {
                self._listArea.push(v);
                fromStop.append($('<option />').val(v[0]).append(v[3]));
                toStop.append($('<option />').val(v[0]).append(v[3]));
            });
            fromStop.trigger('chosen:updated');
            toStop.trigger('chosen:updated');
        });


        var $updateForm = $._createForm(_dict._uForm[0], _dict._uForm[1], _dict._uForm[2]);
        $updateForm.find('div.alert.alert-danger.message-error').after(
            $('<div class="row" />').css('margin-top', '0')
                .append($('<div class="col-md-12 checkbox-route-point" />'))
        );
        $updateForm.find('.row').last().addClass('action-row').children().first().addClass('list-btn col-xs-12 col-sm-12');

        self._$validForm = $._createForm(_dict._vForm[0], _dict._vForm[1], _dict._vForm[2]);
        self._$validForm.find('.row').last().addClass('action-row').children().first().addClass('list-btn');

        var $updateBody = $('<div />').addClass('modal-body').css('padding-top', 0)
            .append($('<div />').addClass('container-fluid')
                .append($('<div />').addClass('row')
                    .append($('<div />').addClass('col-md-1 col-sm-1 col-xs-1').css('padding-right', 0).addClass('responsive-xs-l')
                        .append($('<ul />').addClass('list-group').attr('id', 'seat-no')
                        )
                    )
                    .append($('<div />').addClass('col-md-11 col-sm-11 col-xs-11 pl0-xs mt10-xs').addClass('responsive-xs-r')
                        .append($('<ul />').addClass('nav nav-tabs').attr('role', 'tab-list')
                            .append($('<li />').addClass('active')
                                .append($('<a />').attr('href', '#general').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'general').text('Thông tin chung'))
                            )
                            .append($('<li />')
                                .append($('<a />').attr('href', '#valid').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'valid').text('Vé mở'))
                            )
                            .append($('<li />')
                                .append($('<a />').attr('href', '#history').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'history').text('Lịch sử'))
                            )
                        )
                        .append($('<div />').addClass('tab-content')
                            .append($('<div />').addClass('tab-pane fade in active').attr('id', 'general') //Update tab
                                .append($updateForm)
                            )
                            .append($('<div />').addClass('tab-pane fade').attr('id', 'valid')
                                .append(self._$validForm)
                            )
                            .append($('<div />').addClass('tab-pane fade').attr('id', 'history')
                                //.append(self._$historyForm)
                            )
                        )
                    )
                )
            );
        // Create a div for dialog and add to container element
        self._$modal = $('<div />').addClass('modal fade').attr('id', 'update-popup')
            .attr('role', 'dialog')
            .attr('aria-hidden', 'true')
            .append(
                $('<div />').addClass('modal-dialog modal-md')
                .append($('<div />').addClass('modal-content')
                    .append($('<div />').addClass('modal-header bg-primary').css('padding-top', "10px").css('padding-bottom', "10px")
                        .append($('<h3 />').addClass('modal-title thin-1').html('Cập nhật thông tin').css('font-size', '18px'))
                    )
                    .append($updateBody)
                )
            )
            .appendTo($('body'));

        var $fromStop = $('select[name="FromStop"]').chosen({ on: true, width: "100%" });
        this._initInputForChosenBox($fromStop);
        var $toStop = $('select[name="ToStop"]').chosen({ on: true, width: "100%" });
        this._initInputForChosenBox($toStop);


        vbf('onUpdateFormCreated'); // create history tab

        
        //Binding event
        //self._bindEventOnValidForm();
        //self._bindEventOnHistoryForm();
    },

    _renderDataForSelectBox: function (f, seat) {
        var me = this;
        var ticket = seat._getCurrentTicket();
        var $fromStop = f.find('select[name="FromStop"]');
        var $toStop = f.find('select[name="ToStop"]');

        if (ticket._fromStop != null && ticket._toStop != null) {
            var fromStop = ticket._fromStop.split('~');
            var toStop = ticket._toStop.split('~');
            var fromId = fromStop[1].split('|')[0];
            var toId = toStop[1].split('|')[0];
            setTimeout(function () {
                $fromStop.val(fromId);
                $fromStop.trigger('chosen:updated');
                $toStop.val(toId);
                $toStop.trigger('chosen:updated');
            }, 1);
        } else {
            setTimeout(function () {
                $fromStop.val('');
                $fromStop.trigger('chosen:updated');
                $toStop.val('');
                $toStop.trigger('chosen:updated');
            }, 1);
        }
    },

    _initInputForChosenBox: function (select) {
        var me = this;
        var chosen;
        // init the chosen plugin
        chosen = select.parent().find('div.chosen-container')
        drop = chosen.find('div.chosen-drop');
        var name = select.attr('name') == "FromStop" ? " đi" : " đến";
        drop.append($('<div />').addClass('chosen-save-button-' + select.attr('name')).attr('style', 'text-align:center').append($('<button />').attr('type', 'button')
                    .addClass('btn').addClass('btn-success').addClass('hidden2').addClass('save-new-area').addClass('btn-sm').append(" Lưu mới")));
        var button = drop.find('div.chosen-save-button-' + select.attr('name') + ' button.save-new-area');
        button.bind("click", function () {
            var newVal = chosen.find('input').val();
            var obj = {};
            obj._a = "InsertArea";
            obj._c = {};
            obj._d = { Type: 5, CompId: app.cid, Name: newVal };
            vRqs(obj, function (u, r, l, t) {
                if (u == 1 && l >= 1) {
                    var option = $("<option>").val(r[0][0]).text(newVal);
                    me._listArea.push([r[0][0], 5, "", newVal])
                    select.find('option[value=""]').remove();
                    select.prepend(option);
                    select.find(option).prop('selected', true);
                    select.prepend($('<option />').val("").text("Chọn điểm" + name))
                    select.trigger("chosen:updated");
                }
            });
        });

        // Bind the keyup event to the search box input
        chosen.find('input').keyup(function (e) {
            if (chosen.find('li.no-results').length > 0) {
                button.removeClass('hidden2');
                if (e.which == 13) {
                    var newVal = chosen.find('input').val();
                    var obj = {};
                    obj._a = "InsertArea";
                    obj._c = {};
                    obj._d = { Type: 5, CompId: app.cid, Name: newVal };
                    vRqs(obj, function (u, r, l, t) {
                        if (u == 1 && l >= 1) {
                            var option = $("<option>").val(r[0][0]).text(newVal);
                            me._listArea.push([r[0][0], 5, "", newVal])
                            select.find('option[value=""]').remove();
                            select.prepend(option);
                            select.find(option).prop('selected', true);
                            select.prepend($('<option />').val("").text("Chọn điểm" + name))
                            select.trigger("chosen:updated");
                        }
                    });
                }
            }
            else {
                button.addClass('hidden2');
            }
        });
    },

    _createBaseIdQueryCondition: function (compId) {
        var query = "(";
        $.each(_dict._fromToBaseId, function (t, k) {
            if (t != _dict._fromToBaseId.length - 1)
                query = query + "$x=" + k + " or Id=" + k + " or ";
            else
                query = query + "$x=" + k + " or Id=" + k;
        });
        query = query + ")";
        return query;
    },

    _listArea: [],

    _createGetAreaObj: function () {
        var me = this;
        
    },

    _mapInfo: function (f) {
        var me = this;
        var obj = me._createGetInfoObj();


        var cb = function (u, r, l, t) {
            if (u != 1 || l <= 0) return;
            app.branchInfo = r;
            var blist = [], alist = [];
            $.each(r, function (_, b) {
                var op = { value: b[0], text: $.trim(b[3]) };
                if (b[1] == 2) {
                    blist.push(op);
                } else if (b[1] == 3) {
                    alist.push(op);
                }
            });
            blist.sort(function (a, b) {
                return a.text.localeCompare(b.text);
            });
            alist.sort(function (a, b) {
                return a.text.localeCompare(b.text);
            });
            $.each(blist, function (_, item) {
                f.find('select[name=BranchName]').append(
                    $('<option />', { value: item.value }).text(item.text)
                );
            });
            var $selectAgent = f.find('select[name=AgentName]');
            // Edited by Duy: fix lỗi bị duplicate đại lý
            // vẫn giữ lại cái đầu tiên
            var $firstOp = $selectAgent.find('option:first-child');
            $selectAgent.empty();
            $selectAgent.append($firstOp);
            $.each(alist, function (_, item) {
                $selectAgent.append($('<option />', { value: item.value }).text(item.text));
            });
            f.find('select[name=AgentName]').chosen({ width: "100%", search_contains: true });
        };
        vdc.gCompany(obj._c, '#', false, null, cb);
    },

    _createGetInfoObj: function () {
        var obj = {};
        obj._a = "fGetCompany";
        obj._c = {
            BaseId: app.cid,
            Type: "($x = 2 OR $x = 3)",
            IsPrgStatus: 1
        };
        obj._f = "Id, Type, Code, Name, AddressInfo, PhoneInfo";
        return obj;
    },

    _updateTicket: function (f, stopPoints, tBus, tId, offsetMinute, tName, tDate, cb, isPrintETicket) {
        var me = this;
        var obj = me._createUpdateTicketObj(f, stopPoints, tBus, tId, offsetMinute, tDate, isPrintETicket);
        if (obj) {
            if (!obj._d) obj._d = [{}];
            var cReq = function (u, r, l, t) {
                if (u != 1) {
                    me._closeUpdateDialog(f);
                    return;
                }
                // save seatStack for send sms
                var stSms = app.seatStack;
                if (typeof cb != "undefined" && typeof cb === "function") {
                    // cập nhật FromArea và ToArea các ghế trong seat stack
                    app.seatToBeUpdatedReturningInfo = app.seatStack;
                    $.each(app.seatStack, function (k, lv) {
                        var tick = lv._getCurrentTicket();
                        tick.fromArea = (obj._d)[0].FromArea;
                        tick.toArea = (obj._d)[0].ToArea;
                    });

                    cb.call(this, (obj._d)[0].Code, (obj._d)[0].FromArea, (obj._d)[0].ToArea);
                } else {
                    var slabel = [];
                    $.each(app.seatStack, function (i, v) {
                        slabel.push(v._label);
                    });

                    app.dataToBeSavedReturningInfo.code = t;
                    if (app.seatToBeUpdatedReturningInfo.length > 0) {
                        vbf('onUpdateInfoOfReturnTickets'); // update old ticket when book ticket
                    }

                    me._closeUpdateDialog(f); // Close dialog
                    vbf('onStoreHistory', { // Store history
                        un: app.un,
                        key: 'update',
                        his: { '_tid': tId, '_tname': tName, '_tdate': tDate, '_s': slabel }
                    });
                    vbf('resetSeatStack'); // Reset seat stack
                    vbf('reloadBookingSheet'); // Reload sheet
                }
                var hasSendSms = false;
                var fd = (obj._d)[0];
                if (!$.isEmptyObject(fd) && fd.HasSendSms == "YES") {
                    hasSendSms = true;
                }
                // auto send sms when update Ticket
                if (_dict._autoSendSmsUpdate != undefined && _dict._autoSendSmsUpdate && hasSendSms) {
                    var phones = [], seatCodes = [], status = 0;
                    if (!$.isEmptyObject(fd)) {
                        status = fd.Status;
                        var cusInfo = fd.CustomerInfo.split('|');
                        var cusPhone = cusInfo[cusInfo.length - 1];
                        if (vIsEstStr(cusPhone)) {
                            phones.push(cusPhone);
                        }
                    }
                    $.each(stSms, function (_, v) {
                        seatCodes.push(v._label);
                    });
                    var message = "";
                    var dataMess = {
                        _tripName: tName,
                        _tripDate: tDate.toFormatString("HH:mm-dd.mm.yyyy"),
                        _nOfSeat: seatCodes.length,
                        _seatCodes: seatCodes.join(","),
                        _status: status == 2 || status == 5 ? "Da thanh toan" : "Chua thanh toan"
                    }
                    switch (parseInt(status)) {
                        case 1:
                            message = vtpl(_dict._smsUpdateTpl, dataMess);
                            break;
                        case 2:
                            message = vtpl(_dict._smsUpdateTpl, dataMess);
                            break;
                        case 3:
                            message = vtpl(_dict._smsCancelTpl, dataMess);
                            break;
                        case 5:
                            message = vtpl(_dict._smsUpdateTpl, dataMess);
                            break;
                        default:
                            break;
                    }
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
            vRqs(obj, cReq); // Submit Request
        }
    },
    _createUpdateTicketObj: function (f, stopPoints, tBus, tId, offsetMinute, tDate, isPrintETicket) {
        var me = this;
        var d = $._convertFormDataToObj(f);
        var status = d.StatusInfo.split(',');
        var customerInfo = d.CustomerInfo.split(',');
        var obj = {};
        obj._a = "UpdateBookTicket";
        obj._c = [];
        obj._d = [];
        var paymentInfo = "";
        if (vIsEstStr(d.PaymentType)) {
            var pt = "", code = "";
            $.each(_dict._pm, function (k, t) {
                if ("" == pt) {
                    if (t[0] == d.PaymentType) {
                        pt = t[1].vi;
                    }
                }
            });
            switch (parseInt(d.PaymentType)) {
                case 1:
                    if (typeof _dict._hasSelectBranchPayment != "undefined" && _dict._hasSelectBranchPayment) {
                        code = $._getBranchInfo(d.BranchName);
                    } else {
                        code = $._getBranchInfo(app.aid);
                    }
                    break;
                case 2:
                    code = d.ChargeCode;
                    break;
                case 3:
                    code = d.PayAddress;
                    break;
                case 4:
                    //code = d.DriverName;
                    code = me._getTeamInfo();
                    break;
                case 5:
                    code = d.TransCode;
                    break;
                case 6:
                    code = $._getBranchInfo(d.AgentName);
                    break;
                case 7:
                case 8:
                case 9:
                    break;
                case 10:
                    code = $._getBranchInfo(d.BranchName);
                    break;
                default:
                    break;
            }
            paymentInfo = $._getPayment(d.PaymentType, pt, code);
        }

        var fromStopSave = null, toStopSave = null;
        var $fromStop = f.find('select[name="FromStop"]');
        var $toStop = f.find('select[name="ToStop"]');
        if ($fromStop.length > 0 && $toStop.length > 0) {
            var fromStop = [1];
            var toStop = [1];
            var pointFromId = f.find('select[name="FromStop"]').find(':selected').val();
            var pointToId = f.find('select[name="ToStop"]').find(':selected').val();
            $.each(me._listArea, function (t, k) {
                if (pointFromId == k[0]) {
                    var fromDetails = [];
                    $.each(k, function (i, v) {
                        fromDetails.push(v);
                    });
                    fromStop.push(fromDetails.join('|'));
                }
                if (pointToId == k[0]) {
                    var toDetails = [];
                    $.each(k, function (i, v) {
                        toDetails.push(v);
                    });
                    toStop.push(toDetails.join('|'));
                }
            });
            fromStopSave = fromStop.join('~');
            toStopSave = toStop.join('~');
        }


        $.each(app.seatStack, function (i, v) {
            var t = v._getCurrentTicket();
            var st = status[i];
            var cInfo = customerInfo[i];
            //tripDate = moment(t._dept).format('YYYY-MM-DD HH:mm');
            var tripDate = moment(t._dept), pickUpDate = moment(t._pdate);
            pickUpDate.add(offsetMinute, "m");

            var dObj = {
                TripAlias: parseInt(tBus),
                Status: st,
                CustomerInfo: cInfo,
                FromArea: fromArea,
                ToArea: toArea
            };
            if (vIsEstStr(fromStopSave) && fromStopSave != "1") {
                dObj.FromStop = fromStopSave;
            }
            if (vIsEstStr(toStopSave) && toStopSave != "1") {
                dObj.ToStop = toStopSave;
            }
            // Auto Cancel Ticket
            if (_dict._autoCancelTickets != undefined && _dict._autoCancelTickets) {
                if (_dict._bookedTicketStatus != undefined && app.status == _dict._bookedTicketStatus) {
                    var expiredTime = moment(tDate);
                    if (app.seatStack.length <= 2) { //from 1 to 2 tickets
                        //Create DateTime to compare with TripDate
                        var compareTime = tDate.getFullYear() + "-" + (tDate.getMonth() + 1) + "-" + tDate.getDate() + " " + _dict._cancelledTime;
                        if (tripDate.isAfter(compareTime)) { // Xe chay sau cancelledTime
                            expiredTime = moment(compareTime).add(_dict._eslapsedTime[1], "m");
                        }
                        else { // Xe chay truoc cancelledTime
                            expiredTime.add(_dict._eslapsedTime[2], "m");
                        }
                    }
                    else if (app.seatStack.length > 2 && app.seatStack.length <= 5) { //from 3 to 5 tickets 
                        expiredTime.add(_dict._eslapsedTime[3], "m");
                    }
                    else if (app.seatStack.length > 5 && app.seatStack.length <= 9) { //from 6 to 9 tickets 
                        expiredTime.add(_dict._eslapsedTime[4], "m");

                    }
                    else if (app.seatStack.length > 9) { //more than 9 tickets
                        expiredTime.add(_dict._eslapsedTime[5], "m");
                    }
                }
                dObj.ExpiredTime = expiredTime.format('YYYY-MM-DD HH:mm');
            }
            tripDate = tripDate.format('YYYY-MM-DD HH:mm');

            obj._c.push({
                Id: t._id,
                TripId: tId,
                SeatCode: v._getSeatInfo(),
                TripDate: tripDate,
                Bus: tBus,

            });

            app.dataToBeSavedReturningInfo.code = v._getSeatInfo();
            app.dataToBeSavedReturningInfo.date = pickUpDate.format('YYYY-MM-DD HH:mm');
            // update FirstUserUpdated 
            var firstUserUpdated = app.un;
            if (!vIsEstStr(t._firstUserUpdated)) {
                dObj.FirstUserUpdated = firstUserUpdated;
            }
            if (t._isBooking()) {
                // FromArea & ToArea
                var fromRouteId = 0, toRouteId = 0;
                var checkRoutePoints = f.find('input[name="RoutePoint"][checked="checked"]');
                if (app.fromRouteId == 0) {
                    fromRouteId = checkRoutePoints.first().attr('data-point-id');
                    app.fromRouteId = fromRouteId;
                } else {
                    fromRouteId = app.fromRouteId;
                }
                var fromInfo = stopPoints.data[stopPoints.idx[fromRouteId]];
                if (app.toRouteId == 0) {
                    toRouteId = checkRoutePoints.last().attr('data-point-id');
                    app.toRouteId = toRouteId;
                } else {
                    toRouteId = app.toRouteId;
                }
                var toInfo = stopPoints.data[stopPoints.idx[toRouteId]];
                var fromArea = "1~" + fromInfo.Id + "|" + fromInfo.Type + "|" + fromInfo.Code + "|" + fromInfo.Name;
                var toArea = "1~" + toInfo.Id + "|" + toInfo.Type + "|" + toInfo.Code + "|" + toInfo.Name;
                dObj.FromArea = fromArea;
                dObj.ToArea = toArea;
            }
            if (vIsEstStr(t._code)) {
                dObj.Code = t._code;
            } else {
                if (typeof d.Code != 'undefined' && vIsEstStr(d.Code)) {
                    dObj.Code = d.Code;
                }
            }
            if (d.PhoneNumbers != undefined || d.FullName != undefined) {
                var sCInfo = cInfo.split('|');
                var nPhone = d.PhoneNumbers != undefined ? d.PhoneNumbers.trim() : sCInfo[4];
                var nName = d.FullName != undefined ? d.FullName : sCInfo[3];
                dObj.CustomerInfo = me._getCustomer(d.CustomerId, nName, nPhone);
            }
            if (typeof d.Debt != "undefined") {
                if (st == 1) {
                    dObj.Debt = d.Debt.toNum() / app.seatStack.length;
                } else {
                    dObj.Debt = 0;
                }
            }

            if (typeof d.PickupInfo != "undefined" || typeof d.TransferInfo != "undefined") {
                if (d.pIndex == "" && (vIsEstStr(d.PickupInfo) || vIsEstStr(d.TransferInfo))) {
                    d.pIndex = 0;
                }
                dObj.PickupInfo = me._getPickupInfo(d.PickupInfo, d.TransferInfo, d.pIndex);
            }

            dObj.PaymentInfo = (me.currentPaymentType>0 &&  (d.PaymentType == null || d.PaymentType == ""))?" ":"";
            if (typeof d.PaymentType != "undefined") {
                if (vIsEstStr(paymentInfo)) {
                    if (t._isBooking()) {
                        dObj.UserCharge = app.un;
                    } else {
                        dObj.ChargeDate = t._chargeDate;
                    }
                    dObj.PaymentInfo = paymentInfo;
                }
            }
            if (typeof d.Note != "undefined") dObj.Note = d.Note;
            if (typeof d.Fare != "undefined") dObj.Fare = d.Fare.toNum();
            if (typeof d.Surcharge != "undefined") dObj.Surcharge = d.Surcharge.toNum();
            if (typeof d.Deposit != "undefined") dObj.Deposit = d.Deposit.toNum();
            if (typeof d.Discount != "undefined") dObj.Discount = d.Discount.toNum();
            if (typeof d.Serial != "undefined") dObj.Serial = d.Serial;
            if (typeof d.RoundTripCode != "undefined") dObj.RoundTripCode = d.RoundTripCode;
            if (typeof d.SNote != 'undefined') dObj.SNote = d.SNote;
            if (typeof d.ResponsibilityUser != 'undefined') dObj.ResponsibilityUser = d.ResponsibilityUser;
            if (typeof d.PickOrReturnDate != 'undefined') dObj.PickOrReturnDate = d.PickOrReturnDate;
            // auto send sms
            var $smsCBox = f.find("input[type='checkbox'][name='HasSendSms']");
            if ($smsCBox.length > 0 && $smsCBox.is(':checked')) {
                dObj.HasSendSms = "YES";
            } else {
                dObj.HasSendSms = "NO";
            }
            // print eticket
            if (isPrintETicket != null && isPrintETicket) {
                dObj.IssuedUser = app.un;
                dObj.PrintStatus = 0;
                dObj.NumOfPrint = t._numOfPrint ? t._numOfPrint + 1 : 1;
            }
            obj._d.push(dObj);
        });
        return obj;
    },
    _createUnblockObj: function (f, tBus, tId, offsetMinute) {
        var me = this;
        var $statusInfo = f.find('input[type="hidden"][name="StatusInfo"]');
        var status = $statusInfo.val();
        var obj = {};
        obj._a = "UpdateBookTicket";
        obj._c = [];
        obj._d = [];
        $.each(app.seatStack, function (i, v) {
            var t = v._getCurrentTicket();
            var st = status[i];
            var pickUpDate = moment(t._pdate);
            var tripDate = moment(t._dept);
            pickUpDate.add(offsetMinute, "m");
            var dObj = {
                PrintStatus: 1
            }
            obj._c.push({
                Id: t._id,
                Status: st,
                TripId: tId,
                SeatCode: v._getSeatInfo(),
                PickupDate: pickUpDate.format('YYYY-MM-DD HH:mm'),
                Bus: tBus
            });

            app.dataToBeSavedReturningInfo.code = v._getSeatInfo();
            app.dataToBeSavedReturningInfo.date = pickUpDate.format('YYYY-MM-DD HH:mm');


            if (vIsEstStr(t._code)) {
                dObj.Code = t._code;
            }
            if (vIsEstStr(t._pmInfo)) {
                dObj.PaymentInfo = t._pmInfo;
            }
            obj._d.push(dObj);
        });
        return obj;
    },
    _validateUpdateForm: function (f, hasRequirePayment) {
        var hasError = false;
        var $errMess = f.find('div.message-error');
        var $payment = f.find('select[name=PaymentType]');
        var $agent = f.find('select[name=AgentName]');
        var $phone = f.find('input:text[name=PhoneNumbers]');
        var $note = f.find('textarea[name=Note]');
        var $pickup = f.find('input[name=PickupInfo]');
        var $transfer = f.find('input[name=TransferInfo]');
        var $fare = f.find('input[name=Fare]');
        var $rp = f.find('div.checkbox-route-point');
        var $totalfare = f.find('input[name=ToTalFare]');
        var cond = null;
        var $fromStop = f.find('select[name="FromStop"]');
        var $toStop = f.find('select[name="ToStop"]');

        if (_dict._reqFieldUpdateForm != undefined) {
            $.each(_dict._reqFieldUpdateForm, function (i, j) {
                switch (j) {
                    case "PhoneNumbers":
                        if (!vIsEstStr($phone.val()) && !vIsEstStr($note.val()) && !vIsEstStr($payment.val())) {
                            hasError = true;
                            $phone.closest('div.col-md-6').addClass('has-error');
                            $errMess.html('Vui lòng nhập số điện thoại !');
                            $errMess.show();
                            return false;
                        } else {
                            $phone.closest('div.col-md-6').removeClass('has-error');
                        }
                        break;
                    case "PickupInfo":
                        break;
                    case "TransferInfo":
                        break;
                    default:
                        break;
                }
            });
        }
        if (!hasError) {
            if (_dict._isValidateFromToStop) {
                //validate fromStop and toStop
                if ($fromStop.length > 0) {
                    if (!vIsEstStr($fromStop.val())) {
                        hasError = true;
                        $fromStop.closest('div.col-md-6').addClass('has-error');
                        $errMess.html('Vui lòng chọn điểm đi !');
                        $errMess.show();
                        return false;
                    } else {
                        $fromStop.closest('div.col-md-6').removeClass('has-error');
                    }
                }
                if ($toStop.length > 0) {
                    if (!vIsEstStr($toStop.val())) {
                        hasError = true;
                        $toStop.closest('div.col-md-6').addClass('has-error');
                        $errMess.html('Vui lòng chọn điểm đến !');
                        $errMess.show();
                        return false;
                    } else {
                        $toStop.closest('div.col-md-6').removeClass('has-error');
                    }
                }
            }
            if (vIsEstStr($phone.val()) && !hasError) { // has phone
                if (!vIsPhone($phone.val())) {
                    hasError = true;
                    $phone.closest('div.col-md-6').addClass('has-error');
                    $errMess.html('Số điện thoại không chính xác, vui lòng kiểm tra lại.');
                    $errMess.show();
                    return false;
                } else {
                    $errMess.html('');
                    $errMess.hide();
                }
            } else {
                if (vIsEstStr($note.val())) { // has note
                    if (vIsEstStr($phone.val())) {
                        if (!vIsPhone($phone.val())) {
                            hasError = true;
                            $phone.closest('div.col-md-6').addClass('has-error');
                            $errMess.html('Số điện thoại không chính xác, vui lòng kiểm tra lại.');
                            $errMess.show();
                            return false;
                        } else {
                            $errMess.html('');
                            $errMess.hide();
                        }
                    }
                }
            }
            if (vIsEstStr($payment.val())) { // has payment
                if (_dict._validUpdateForm != undefined && parseInt($payment.val()) != 9) {
                    if (_dict._validUpdateForm.indexOf('>=') != -1) {
                        cond = parseInt(_dict._validUpdateForm.substring(_dict._validUpdateForm.indexOf('>=') + 1, _dict._validUpdateForm.length));
                        if (!parseInt($fare.val()) >= cond) {
                            hasError = true;
                            $fare.closest('div.col-md-6').addClass('has-error');
                            $errMess.html('Giá vé phải lớn hơn hoặc bằng ' + cond + '.');
                            $errMess.show();
                            return false;
                        } else {
                            $errMess.html('');
                            $errMess.hide();
                        }
                    } else if (_dict._validUpdateForm.indexOf('>') != -1) {
                        cond = parseInt(_dict._validUpdateForm.substring(_dict._validUpdateForm.indexOf('>') + 1, _dict._validUpdateForm.length));
                        if (!parseInt($fare.val()) > cond) {
                            hasError = true;
                            $fare.closest('div.col-md-6').addClass('has-error');
                            $errMess.html('Giá vé phải lớn hơn ' + cond + '.');
                            $errMess.show();
                            return false;
                        } else {
                            var fare = $totalfare.val().toNum() / app.seatStack.length;
                            var idxSeat = '';
                            $.each(app.seatStack, function (k, v) {
                                var tick = v._getCurrentTicket();
                                if (fare < $fare.val().toNum() && tick._fare == 0) {
                                    idxSeat += v._label + ', ';
                                }
                            });
                            if (idxSeat != '') {
                                var text = 'Ghế ' + idxSeat.substring(0, idxSeat.length - 2) + ': Giá vé phải lớn hơn 0.';
                                hasError = true;
                                $errMess.html(text);
                                $errMess.show();
                                return false;
                            } else {
                                $errMess.html('');
                                $errMess.hide();
                            }
                        }
                    } else if (_dict._validUpdateForm.indexOf('=') != -1) {
                        cond = parseInt(_dict._validUpdateForm.substring(_dict._validUpdateForm.indexOf('=') + 1, _dict._validUpdateForm.length));
                        if (!parseInt($fare.val()) == cond) {
                            hasError = true;
                            $fare.closest('div.col-md-6').addClass('has-error');
                            $errMess.html('Giá vé bằng ' + cond + '.');
                            $errMess.show();
                            return false;
                        } else {
                            $errMess.html('');
                            $errMess.hide();
                        }
                    }
                    if (parseInt($payment.val()) == 6) { // paid by agent
                        if (!vIsEstStr($agent.val())) {
                            hasError = true;
                            $agent.closest('div.col-md-6').addClass('has-error');
                            $errMess.html('Vui lòng chọn đại lý thanh toán.');
                            $errMess.show();
                            return false;
                        }
                    }
                }
            }

            // validate print eticket auto save
            if (hasRequirePayment != undefined && hasRequirePayment && !vIsEstStr($payment.val())) {
                hasError = true;
                $payment.closest('div.col-md-6').addClass('has-error');
                $errMess.html('Vui lòng chọn hình thức thanh toán !');
                $errMess.show();
                return false;
            } else {
                $payment.closest('div.col-md-6').removeClass('has-error');
                $errMess.html('');
                $errMess.hide();
            }

            // validate route points
            if ($rp.length > 0 && $rp.is(':visible')) {
                var $pChecked = $rp.find('input[name="RoutePoint"][checked="checked"]');
                if ($pChecked.length != 2) {
                    hasError = true;
                    $errMess.html('Điểm đi, điểm đến không chính xác. Vui lòng kiểm tra lại.');
                    $errMess.show();
                    return false;
                }
            }
            if (app.hasCopyTicket) { // validate when book more ticket
                if (_dict._copyFieldRequired != undefined) {
                    $.each(_dict._copyFieldRequired, function (kd, kf) {
                        switch (kf) {
                            case "PhoneNumbers":
                                if (!vIsEstStr($phone.val())) {
                                    hasError = true;
                                    $phone.closest('div.col-md-6').addClass('has-error');
                                    return false;
                                }
                                break;
                            case "Note":
                                if (!vIsEstStr($note.val())) {
                                    hasError = true;
                                    $note.closest('div.col-md-6').addClass('has-error');
                                    return false;
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            if (app.hasBookReturnTicket) { // validate when book return ticket
                if (_dict._returnFieldRequired != undefined) {
                    $.each(_dict._returnFieldRequired, function (kd, kff) {
                        switch (kff) {
                            case "PhoneNumbers":
                                if (!vIsEstStr($phone.val())) {
                                    hasError = true;
                                    $phone.closest('div.col-md-6').addClass('has-error');
                                    return false;
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        }

        return !hasError;
    },
    _validateUpdateForm2: function (f) {
        var $errMess = f.find('div.message-error');
        var $payment = f.find('select[name=PaymentType]');
        var $agent = f.find('select[name=AgentName]');
        var $phone = f.find('input:text[name=PhoneNumbers]');
        var $note = f.find('textarea[name=Note]');
        var $pickup = f.find('input[name=PickupInfo]');
        var $transfer = f.find('input[name=TransferInfo]');
        var $fare = f.find('input[name=Fare]');
        var $rp = f.find('div.checkbox-route-point');
        var data = {
            "payment": parseInt($payment.val()),
            "agent": $agent.val(),
            "phone": $phone.val(),
            "note": $note.val(),
            "pickup": $pickup.val(),
            "transfer": $transfer.val(),
            "fare": vToNum($fare.val())
        };
        var isValid = false, isCont = false;
        var errorField = '';
        var validateValue = function (c) {
            var result = false;
            try {
                var source = data[c];
                if (c.indexOf('[') >= 0) {
                    if (!isNaN($payment.val()) && source != 9) {
                        source = parseInt(data[c.substring(0, c.indexOf('['))]);
                        if (c.indexOf('[>=') >= 0) {
                            result = source >= parseInt(c.substring(c.indexOf('[>=') + 3).replace(']', ''));
                        } else if (c.indexOf('[<=') >= 0) {
                            result = source <= parseInt(c.substring(c.indexOf('[<=') + 3).replace(']', ''));
                        } else if (c.indexOf('[=') >= 0) {
                            result = source == parseInt(c.substring(c.indexOf('[=') + 2).replace(']', ''));
                        } else if (c.indexOf('[>') >= 0) {
                            result = source > parseInt(c.substring(c.indexOf('[>') + 2).replace(']', ''));
                        } else if (c.indexOf('[<') >= 0) {
                            result = source < parseInt(c.substring(c.indexOf('[<') + 2).replace(']', ''));
                        }
                    }
                } else {
                    result = vIsEstStr(source);
                }
            } catch (ex) { }
            return result;
        };
        var valiCondition = function () {
            if (_dict._updateFormValidatingConditions != 'undefined') {
                for (var i = 0; i < _dict._updateFormValidatingConditions.length; i++) {
                    var conditions = _dict._updateFormValidatingConditions[i].split('&');
                    var localValid = true;
                    for (var j = 0; j < conditions.length; j++) {
                        var c = conditions[j];
                        if (c == 'phone') {
                            localValid = localValid && vIsPhone(data['phone']);
                        } else if (c.indexOf('!') == 0) {
                            var cs = c.replace('!', '').split('->');
                            if (validateValue(cs[0])) {
                                localValid = localValid && validateValue(cs[1]);
                            } else {
                                localValid = localValid && true;
                            }
                        } else {
                            localValid = localValid && validateValue(c);
                        }

                        if (!localValid && errorField == '') {
                            errorField = c;
                            if (c.indexOf('!') >= 0) {
                                var ccs = c.split('->');
                                errorField = ccs[1].indexOf('[') > 0 ? ccs[1].substring(0, ccs[1].indexOf('[')) : ccs[1];
                            } else if (c.indexOf('[') >= 0) errorField = c.substring(0, c.indexOf('['));
                        }
                        if ((vIsEstStr(data['phone']) && !vIsPhone(data['phone']))) {
                            isValid = false;
                            break;
                        }
                        isValid = isValid || localValid;
                        if (isValid) return true;
                    }
                }
            }
            return false;
        };
        isCont = valiCondition();
        var $focusInput;
        if (isCont) {
            $errMess.html('');
            $errMess.hide();
        } else {
            switch (errorField) {
                case 'payment': $focusInput = $payment; break;
                case 'agent': $focusInput = $agent; break;
                case 'phone': $focusInput = $phone; break;
                case 'note': $focusInput = $note; break;
                case 'pickup': $focusInput = $pickup; break;
                case 'transfer': $focusInput = $transfer; break;
                case 'fare': $focusInput = $fare; break;
                default: break;
            }
            if (_dict._updateFormValidatingErrorMessages != null && _dict._updateFormValidatingErrorMessages[errorField] != null) {
                $errMess.html(_dict._updateFormValidatingErrorMessages[errorField]);
            } else {
                $errMess.html(_dict._updateFormValidatingErrorMessage);
            }
            $errMess.show();
            if ($focusInput != null) {
                $focusInput.closest('div.col-md-6').addClass('has-error');
                $focusInput.focus();
            }
        }
        var hasError = false;
        // validate route points
        if ($rp.length > 0 && $rp.is(':visible')) {
            var $pChecked = $rp.find('input[name="RoutePoint"][checked="checked"]');
            if ($pChecked.length != 2) {
                hasError = true;
                $errMess.html('Điểm đi, điểm đến không chính xác. Vui lòng kiểm tra lại.');
                $errMess.show();
            }
        }
        if (app.hasCopyTicket) { // validate when book more ticket
            if (_dict._copyFieldRequired != undefined) {
                $.each(_dict._copyFieldRequired, function (kd, kf) {
                    switch (kf) {
                        case "PhoneNumbers":
                            if (!vIsEstStr(data['phone'])) {
                                hasError = true;
                                $phone.closest('div.col-md-6').addClass('has-error');
                                break;
                            }
                        case "Note":
                            if (!vIsEstStr(data['note'])) {
                                hasError = true;
                                $note.closest('div.col-md-6').addClass('has-error');
                                break;
                            }
                        default:
                            break;
                    }
                });
            }
        }
        if (app.hasBookReturnTicket) { // validate when book return ticket
            if (_dict._returnFieldRequired != undefined) {
                $.each(_dict._returnFieldRequired, function (kd, kff) {
                    switch (kff) {
                        case "PhoneNumbers":
                            if (!vIsEstStr(data['phone'])) {
                                hasError = true;
                                $phone.closest('div.col-md-6').addClass('has-error');
                                break;
                            }
                        default:
                            break;
                    }
                });
            }
        }
        return isValid && !hasError;
    },

    _bindEventOnUpdateForm: function (f, st, tId, tName, tDate, tBus, sc, stopPoints, offsetMinute, cTrip, tdid, lmDate, cs, lpp, ltp, tTime, tInfo, blockEnterEvent) {
        /// <summary>
        /// Bind Event On Update Form
        /// </summary>
        /// <param name="f">Update Form</param>
        /// <param name="st">Selected Seats</param>
        /// <param name="tId">TripId</param>
        /// <param name="tName">TripName</param>
        /// <param name="tDate">TripDate</param>
        /// <param name="tBus">TripBus</param>
        /// <param name="sc">StageCode</param>
        /// <param name="stopPoints">Stop Points</param>
        /// <param name="offsetMinute"></param>
        /// <param name="cTrip">Current Trip</param>
        /// <param name="tdid">TripDetailId</param>
        /// <param name="lmDate">LimitedDate</param>
        /// <param name="cs">ClosedStatus</param>
        /// <param name="lpp">Pickup Points</param>
        /// <param name="ltp">Transfer Points</param>
        /// <param name="tTime">TripTime</param>
        /// <param name="tInfo">TripInfo</param>
        /// <param name="blockEnterEvent">Block Event Enter Key</param>
        var me = this;
        

        if (_dict.showDialCode != null && showDialCode.showDialCode ==true) {
            var defaultCountry = _dict.dialCodes[0].countryCode;
            var countries = [];
            var $phone = f.find('input[name=PhoneNumbers]');
            $phone.intlTelInput("destroy");

            for (var k = 0; k < _dict.dialCodes.length; k++) {
                var item = _dict.dialCodes[k];
                countries.push(item.countryCode);
                if ($phone.val() != null && $phone.val() != "" && $phone.val().indexOf("(+" + item.dialCode + ") ") == 0) {
                    defaultCountry = item.countryCode;
                }
            }

            if ($phone.val() == null || $phone.val() == "") {
                defaultCountry = (_dict.dialCodeByAgents != null && _dict.dialCodeByAgents[app.aid] != null) ? _dict.dialCodeByAgents[app.aid] : "vn";
            } else if ($phone.val().indexOf(" ")>=0) {
                $phone.val($phone.val().substring($phone.val().indexOf(" ") + 1));
            }

            f.find('input[name=PhoneNumbers].form-control').intlTelInput({
                defaultCountry: defaultCountry,
                onlyCountries: countries,
            });

        }
        

        f.find('input[name=TransferInfo]').not(':disabled').blur(function (e) {
            f.find('div.search-result.search-location').remove();
        });
        f.find('input[name=TransferInfo]').not(':disabled').keyup(function (e) {
            if (e.keyCode == 13 || e.keyCode == 9) {
                var selectedItem = f.find('div.search-result tr.location-selected');
                if (selectedItem.length > 0) {
                    f.find('input[name=TransferInfo]').val(selectedItem.attr('data-name'));
                    f.find('input[name=pIndex]').val(selectedItem.attr('data-order'));
                }
                f.find('div.search-result').remove();
            } else if (e.keyCode == 40 || e.keyCode == 38) {
                vbf('onNavigateSuggestTransfer', { keyCode: e.keyCode }); // navigate through suggest pickup result
            } else {
                vbf('onGetSuggestTransfer', { // get suggest pickup points
                    f: f,
                    ltp: ltp,
                    tTime: tTime,
                    key: this.value
                });
            }
        });
        f.find('input[name=PickupInfo]').not(':disabled').blur(function (e) {
            f.find('div.search-result.search-location').remove();
        });
        f.find('input[name=PickupInfo]').not(':disabled').keyup(function (e) {
            if (e.keyCode == 13 || e.keyCode == 9) {
                var selectedItem = f.find('div.search-result tr.location-selected');
                if (selectedItem.length > 0) {
                    f.find('input[name=PickupInfo]').val(selectedItem.attr('data-name'));
                    f.find('input[name=pIndex]').val(selectedItem.attr('data-order'));
                }
                $('div.search-result').remove();
                //if (e.keyCode == 9) f.find('input[name=TransferInfo]').focus();
            } else if (e.keyCode == 40 || e.keyCode == 38) {
                vbf('onNavigateSuggestPickup', { keyCode: e.keyCode }); // navigate through suggest pickup result
            } else {
                vbf('onGetSuggestPickup', { // get suggest pickup points
                    f: f,
                    lpp: lpp,
                    tTime: tTime,
                    key: this.value
                });
            }
        });
        f.find('input[name=PhoneNumbers]').not(':disabled').unbind('keyup').keyup(function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                e.stopPropagation();
                var $li = f.find('div.upform-search-result-phone ul.search-items li.selected');
                var cId = $li.attr('cid');
                var cPhone = $li.attr('cphone');
                var cName = $li.attr('cname');
                if (cId) f.find('input[name=CustomerId]').val($li.attr('cid'));
                if (cPhone) f.find('input:text[name=PhoneNumbers]').val($li.attr('cphone'));
                if (cName) f.find('input[name=FullName]').val($li.attr('cname'));
                if (_dict._hasBTWarning && cId) {
                    vbf('doGetWarningCustomer', { // get warning customer
                        f: f,
                        cName: $li.attr('cname'),
                        cPhone: $li.attr('cphone'),
                        cId: $li.attr('cid'),
                        lmDate: lmDate,
                        tId: tId,
                        tName: tName
                    });
                }
                vbf('onClearSuggestCustomer', { f: f }); // clear suggest customer
                return;
            } else if (vIsNumKey(e)) {
                if (this.value.length >= 6 && this.value.length <= 11) {
                    e.preventDefault();
                    e.stopPropagation();
                    // enable flag don't allow update when press enter key
                    vbf('onGetSuggestCustomer', { // get suggest customer
                        f: f,
                        key: this.value,
                        lmDate: lmDate,
                        tId: tId,
                        tName: tName
                    });
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                    vbf('onClearSuggestCustomer', { f: f }); // clear suggest customer
                }
            } else if (_dict._arrows.indexOf(e.keyCode) == -1) {
                e.preventDefault();
                e.stopPropagation();
                vbf('onClearSuggestCustomer', { f: f }); // clear suggest customer
            } else if (e.keyCode == 27) {
                e.preventDefault();
                e.stopPropagation();
                vbf('onClearSuggestCustomer', { f: f }); // clear suggest customer
            }
        });
        f.find('input[name=PhoneNumbers]').not(':disabled').bind('paste', function (e) {
            this.value = e.originalEvent.clipboardData.getData('Text');
            if (!isNaN(this.value) && (this.value.length == 10 || this.value.length == 11)) {
                e.preventDefault();
                e.stopPropagation();
                vbf('onGetSuggestCustomer', { // get suggest customer
                    f: f,
                    key: this.value,
                    lmDate: lmDate,
                    tId: tId,
                    tName: tName
                });
            } else {
                e.preventDefault();
                e.stopPropagation();
                vbf('onClearSuggestCustomer', { f: f }); // clear suggest customer
            }
            f.find('input[name=PhoneNumbers]').not(':disabled').blur();
        });
        f.find('input[type=text]').not('[readonly]').unbind('keypress', function (e) {
            var sPhoneRe = f.find('div.upform-search-result-phone');
            var sPickupRe = f.find('div.search-result.search-location');
            if (sPhoneRe.length == 0 && sPickupRe.length == 0) { // is not search phone or search pickup
                if (e.keyCode == 13) { // Enter
                    if (!blockEnterEvent) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($(this).prop('name') == 'Fare') return;
                        if (!me._validateUpdateForm(f)) return;
                        if ((cs != null && cs == 1)) return;
                        me._transformUpdateFormValue(f);
                        me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate);
                        $._resetBookReturnInfo();
                    }
                }
            }
        }).on('focus', function () {

        });
        f.find('input[name=Code]').parent().find('.input-group-addon').attr('title', 'Copy to clipboard')
            .clipboard({
                path: 'Base/jquery-clipboard-1.3.2/jquery.clipboard.swf',
                copy: function () {
                    return f.find('input[name=Code]').val();
                }
            });
        f.find('select[name=PaymentType]').unbind('change').on('change', function () {
            var $cls = $(this).closest('.row');
            $cls.find('.mpayment').parent().hide();
            $cls.find('.mpayment').parent().prev().hide();
            if (this.value) {
                var $fe = $cls.find('.mpayment[data-type=' + this.value + ']');
                if (this.value == 1 || this.value == 4) {
                    if (typeof _dict._hasSelectBranchPayment != "undefined" && _dict._hasSelectBranchPayment) {
                        if ($fe.length > 0) {
                            $fe.parent().show();
                            $fe.parent().prev().show();
                        }
                    }
                } else {
                    if ($fe.length > 0) {
                        $fe.parent().show();
                        $fe.parent().prev().show();
                        if (this.value == 6) {
                            $fe.parent().find('a.chosen-single').css('border-color', '#aaa');
                            if (!f.find("select[name=PaymentType]").attr('disabled')) {
                                $fe.parent().find('select[name=AgentName]').children().each(function (idx, value) {
                                    if (idx == 0) {
                                        $(this).attr('selected', true);
                                    } else {
                                        $(this).attr('selected', false);
                                    }
                                });
                            }
                            $fe.parent().find('select[name=AgentName]').trigger('chosen:updated');
                        }
                    }
                }
            }
        });
        f.find('input[name=Fare]').not(['readonly']).unbind('change').on('change', function () {
            var numSeat = parseInt(f.find('input[name=NumSeat]').val());
            var deposit = 0, discount = 0, surcharge = 0;
            if (f.find('input[name=Deposit]').length > 0) {
                deposit = f.find('input[name=Deposit]').val().toNum();
            }
            if (f.find('input[name=Discount]').length > 0) {
                discount = f.find('input[name=Discount]').val().toNum();
            }
            if (f.find('input[name=Surcharge]').length > 0) {
                surcharge = f.find('input[name=Surcharge]').val().toNum();
            }
            var newFare = $(this).val().toNum();
            if (newFare < 10000) {
                newFare = newFare * 1000;
            }
            var newTotalFare = (newFare + surcharge - discount) * numSeat;
            $(this).val(newFare.toMn());
            var debt = newTotalFare - (deposit * numSeat);
            f.find('input[name=Debt]').val(debt.toMn());
            f.find('input[name=ToTalFare]').val(newTotalFare.toMn());
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
        f.find('input[name=Deposit]').not(['readonly']).unbind('change').on('change', function () {
            var deposit = $(this).val().toNum();
            if (deposit < 10000) {
                deposit = deposit * 1000;
            }
            $(this).val(deposit.toMn());
            var discount = 0;
            var surcharge = 0;
            if (f.find('input[name=Discount]').length > 0) {
                discount = f.find('input[name=Discount]').val().toNum();
            }
            if (f.find('input[name=Surcharge]').length > 0) {
                discount = f.find('input[name=Surcharge]').val().toNum();
            }
            var newFare = f.find('input[name=Fare]').val().toNum();
            var numSeat = parseInt(f.find('input[name=NumSeat]').val());
            if (f.find('input[name=Debt]').length > 0) {
                var debt = numSeat * (newFare + surcharge - discount) - numSeat * deposit;
                f.find('input[name=Debt]').val(debt.toMn());
            }
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
        f.find('input[name=Surcharge]').not(['readonly']).unbind('change').on('change', function () {
            var surCharge = $(this).val().toNum();
            if (surCharge < 10000) {
                surCharge = surCharge * 1000;
            }
            $(this).val(surCharge.toMn());
            var numSeat = parseInt(f.find('input[name=NumSeat]').val());
            var newFare = f.find('input[name=Fare]').val().toNum();
            var discount = 0;
            var deposit = 0;
            if (f.find('input[name=Discount]').length > 0) {
                discount = f.find('input[name=Discount]').val().toNum();
            }
            if (f.find('input[name=Deposit]').length > 0) {
                deposit = f.find('input[name=Deposit]').val().toNum();
            }
            var newTotalFare = (newFare + surCharge - discount) * numSeat;
            if (f.find('input[name=Debt]').length > 0) {
                var debt = newTotalFare - deposit * numSeat;
                f.find('input[name=Debt]').val(debt.toMn());
            }
            f.find('input[name=ToTalFare]').val(newTotalFare.toMn());
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
        f.find('input[name=Discount]').not(['readonly']).unbind('change').on('change', function () {
            var discount = $(this).val().toNum();
            if (discount < 10000) {
                discount = discount * 1000;
            }
            $(this).val(discount.toMn());
            var numSeat = parseInt(f.find('input[name=NumSeat]').val());
            var newFare = f.find('input[name=Fare]').val().toNum();
            var surCharge = 0;
            var deposit = 0;
            if (f.find('input[name=Surcharge]').length > 0) {
                surCharge = f.find('input[name=Surcharge]').val().toNum();
            }
            if (f.find('input[name=Deposit]').length > 0) {
                deposit = f.find('input[name=Deposit]').val().toNum();
            }
            var newTotalFare = (newFare + surCharge - discount) * numSeat;
            if (f.find('input[name=Debt]').length > 0) {
                var debt = newTotalFare - deposit * numSeat;
                f.find('input[name=Debt]').val(debt.toMn());
            }
            f.find('input[name=ToTalFare]').val(newTotalFare.toMn());
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
        f.find('input').not('[name=PhoneNumbers]').each(function (_, ip) {
            $(ip).focus(function (e) {
                e.preventDefault();
                e.stopPropagation();
                vbf('onClearSuggestCustomer', { f: f }); // clear suggest customer
            });
        });
        f.unbind('shown.bs.modal').on('shown.bs.modal', function (e) { // auto focus
            try {
                if (vIsEstStr(_dict._focusUpdateForm)) {
                    f.find('input[name=' + _dict._focusUpdateForm + ']').focus();
                } else
                    f.find('input[name=PhoneNumbers]').focus();
            } catch (e) {
                f.find('input[name=PhoneNumbers]').focus();
            }
            vbf('onClearSuggestCustomer', { f: f }); // clear suggest customer
        });
        f.find('button').each(function (idx, b) {
            if ($(b).hasClass('btn-cancel')) {
                $(b).unbind().on('click', function (e) {
                    e.preventDefault();
                    var fares = [];
                    var allIsBooking = true;
                    $.each(st, function (k, v) {
                        var tick = v._getCurrentTicket();
                        if (tick._status != 1) {
                            allIsBooking = false;
                        }
                        fares.push(tick._fare);
                    });
                    var totalFare = 0;
                    $.each(fares, function (_, fare) {
                        totalFare += fare;
                    });
                    me._closeUpdateDialog(f);
                    vbf('doShowCancelForm', {
                        totalFare: totalFare,
                        allIsBooking: allIsBooking,
                        st: st,
                        tId: tId,
                        tName: tName,
                        tDate: tDate,
                        tBus: tBus,
                        sc: sc
                    });
                    app.selectedPhone = "";
                    app.selectedCode = "";
                    app.ctrlOn = false;
                });
            } else if ($(b).hasClass('btn-update')) {
                $(b).unbind().on('click', function (e) {
                    e.preventDefault();
                    var obj = me._createGetSeatStatusObj(f);
                    var cb = function (u, r, l, t) {
                        if (typeof r[0][2] != 'undefined') {
                            if (r[0][2] == 3) {
                                me._closeUpdateDialog(f);
                                vbf('showErrorForm', { message: _dict._err[7] }); // Show error form
                                vbf('reloadBookingSheet'); // Reload sheet
                                vbf('onClearSelectedItem'); // Clear selected items
                            }
                            else {
                                if (!me._validateUpdateForm(f)) return;
                                var createdUsersInput = f.find('input[name=CreatedUser]').val();
                                var createdUsers = createdUsersInput.split(',');
                                var createdUser = createdUsers[0];
                                for (var i = 0; i < createdUsers.length; i++) {
                                    if (createdUsers[i] != app.un) {
                                        createdUser = createdUsers[i];
                                    }
                                }
                                if (createdUser != app.un) {
                                    var oldNum = f.find('input:hidden[name=PhoneNumbers]').val();
                                    var newNum = f.find('input:text[name=PhoneNumbers]').val();
                                    if (oldNum != newNum) {
                                        me._closeUpdateDialog(f);
                                        me._createUpdateConflictDialogDiv(f, createdUser, stopPoints, tBus, tId, offsetMinute, tName, tDate);
                                    } else {
                                        me._transformUpdateFormValue(f);
                                        me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate);
                                        app.selectedPhone = "";
                                        app.selectedCode = "";
                                        app.ctrlOn = false;
                                        $._resetCopyInfo();
                                        $._resetBookReturnInfo();
                                    }
                                }
                                else {
                                    me._transformUpdateFormValue(f);
                                    me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate);
                                    app.selectedPhone = "";
                                    app.selectedCode = "";
                                    app.ctrlOn = false;
                                    $._resetCopyInfo();
                                    $._resetBookReturnInfo();
                                }
                            }
                        }
                        else {
                            me._transformUpdateFormValue(f);
                            me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate);
                            app.selectedPhone = "";
                            app.selectedCode = "";
                            app.ctrlOn = false;
                            $._resetCopyInfo();
                            $._resetBookReturnInfo();
                        }
                    }
                    if (!$.isEmptyObject(obj)) {
                        vRqs(obj, cb);
                    } else {
                        alert("Dữ liệu không chính xác, vui lòng nhấn phím F5. Xin cảm ơn !");
                    }
                });
            } else if ($(b).hasClass('btn-close')) {
                $(b).unbind().on('click', function (e) {
                    e.preventDefault();
                    vbf('onClearSelectedItem'); // Clear selected items
                    vbf('resetSeatStack'); // Reset seat stack
                    app.selectedPhone = "";
                    app.selectedCode = "";
                    app.ctrlOn = false;
                    me._closeUpdateDialog(f);
                });
            } else if ($(b).hasClass('btn-eprint')) {
                $(b).unbind().on('click', function (e) {
                    e.preventDefault();
                    vbf('onPrintETicket', { // print eticket
                        tId: tId,
                        tName: tName,
                        tDate: tDate,
                        cTrip: cTrip,
                        tInfo: tInfo
                    });
                    //TODO: kiểm tra lại có cần thiết phải reset all hay không, tạm thời sử dụng reset SeatStack 
                    //TODO: và clear selected seats
                    vbf('onClearSelectedItem'); // Clear selected items
                    vbf('resetSeatStack'); // Reset seat stack
                    //vbf('resetAll'); // reset all

                    me._closeUpdateDialog(f);
                    app.selectedPhone = "";
                    app.selectedCode = "";
                    app.ctrlOn = false;
                });
            } else if ($(b).hasClass('btn-eprint-save')) {
                $(b).unbind().on('click', function (e) {
                    e.preventDefault();
                    var ticketStatus = [];
                    var printStatus = [];
                    var payment = f.find('select[name="PaymentType"]').val();
                    var state = $(b).attr('state');
                    switch (state) {
                        case 'avai':
                            var cb = function () {
                                var afReload = function () {
                                    vbf('onPrintETicket', { // print eticket
                                        tId: tId,
                                        tName: tName,
                                        tDate: tDate,
                                        cTrip: cTrip,
                                        tInfo: tInfo
                                    });
                                    //TODO: kiểm tra lại có cần thiết phải reset all hay không, tạm thời sử dụng reset SeatStack 
                                    //TODO: và clear selected seats
                                    vbf('onClearSelectedItem'); // Clear selected items
                                    vbf('resetSeatStack'); // Reset seat stack
                                    //vbf('resetAll'); // reset all
                                    me._closeUpdateDialog(f);
                                }
                                vbf('reloadBookingSheet', {}, afReload); // reload booking sheet
                            }
                            if (!me._validateUpdateForm(f, true)) return;

                            $.each(app.seatStack, function (k, v) {
                                var tick = v._getCurrentTicket();
                                ticketStatus.push(tick._status);
                                printStatus.push(tick._printStatus);
                            });
                            ticketStatus = ticketStatus.getUnique();
                            printStatus = printStatus.getUnique();
                            if (printStatus.length > 1) {
                                f.find('div.message-error').html('Đã có ghế xuất vé rồi, vui lòng kiểm tra lại !');
                                f.find('div.message-error').show();
                                return;
                            } else {
                                if (ticketStatus.length > 1) {
                                    f.find('div.message-error').html('Đã có ghế thanh toán rồi, vui lòng kiểm tra lại !');
                                    f.find('div.message-error').show();
                                    return;
                                } else {
                                    if (!vIsEstStr(payment)) {
                                        f.find('div.message-error').html('Vui lòng chọn hình thức thanh toán.');
                                        f.find('div.message-error').show();
                                        return;
                                    }
                                }
                            }
                            me._transformUpdateFormValue(f);
                            me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate, cb, true);
                            app.selectedPhone = "";
                            app.selectedCode = "";
                            app.ctrlOn = false;
                            break;
                        case 'block':
                            f.find('div.message-error').html('Đã xuất vé rồi, vui lòng kiểm tra lại !');
                            f.find('div.message-error').show();
                            break;
                        case 'unblock':
                            var unObj = me._createUnblockObj(f, tBus, tId, offsetMinute);
                            var callB = function (u, r, l, t) {
                                if (u != 1) return;
                                var $printSave = f.find('button.btn-eprint-save');
                                $printSave.prop('disabled', false);
                                $printSave.attr('state', 'avai');
                                $printSave.text('In vé');
                            }
                            vRqs(unObj, callB);
                            break;
                        default:
                            var cbDf = function () {
                                var afReload = function () {
                                    vbf('onPrintETicket', { // print eticket
                                        tId: tId,
                                        tName: tName,
                                        tDate: tDate,
                                        cTrip: cTrip,
                                        tInfo: tInfo
                                    });
                                    //TODO: kiểm tra lại có cần thiết phải reset all hay không, tạm thời sử dụng reset SeatStack 
                                    //TODO: và clear selected seats
                                    vbf('onClearSelectedItem'); // Clear selected items
                                    vbf('resetSeatStack'); // Reset seat stack
                                    //vbf('resetAll'); // reset all
                                    me._closeUpdateDialog(f);
                                }
                                vbf('reloadBookingSheet', {}, afReload); // reload booking sheet
                            }
                            if (!me._validateUpdateForm(f, true)) return;
                            $.each(app.seatStack, function (k, v) {
                                var tick = v._getCurrentTicket();
                                ticketStatus.push(tick._status);
                                printStatus.push(tick._printStatus);
                            });
                            ticketStatus = ticketStatus.getUnique();
                            printStatus = printStatus.getUnique();
                            if (printStatus.length > 1) {
                                f.find('div.message-error').html('Đã có ghế xuất vé rồi, vui lòng kiểm tra lại !');
                                f.find('div.message-error').show();
                                return;
                            } else {
                                if (ticketStatus.length > 1) {
                                    f.find('div.message-error').html('Đã có ghế thanh toán rồi, vui lòng kiểm tra lại !');
                                    f.find('div.message-error').show();
                                    return;
                                } else {
                                    if (!vIsEstStr(payment)) {
                                        f.find('div.message-error').html('Vui lòng chọn hình thức thanh toán.');
                                        f.find('div.message-error').show();
                                        return;
                                    }
                                }
                            }
                            me._transformUpdateFormValue(f);
                            me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate, cbDf, true);
                            app.selectedPhone = "";
                            app.selectedCode = "";
                            app.ctrlOn = false;
                            break;
                    }
                });
            } else if ($(b).hasClass('btn-add-more-ticket')) {
                $(b).unbind().on('click', function (e) {
                    e.preventDefault();
                    app.hasCopyTicket = true;
                    var cb = function (oldCode, fromArea, toArea) {
                        var afReload = function () {
                            //self._getCopyInfo(oldCode, fromArea, toArea, tdid);
                            vbf('onBookMoreTicket', { // book more ticket
                                f: f,
                                oldCode: oldCode,
                                fromArea: fromArea,
                                toArea: toArea,
                                tdid: tdid,
                                tId: tId
                            });
                        }
                        vbf('reloadBookingSheet', {}, afReload); // reload booking sheet
                    }
                    if (!me._validateUpdateForm(f)) {
                        if (app.hasCopyTicket) {
                            $._resetCopyInfo();
                            vbf('onUnbindEventCopying'); // unbind event book more ticket
                        }
                        return;
                    }
                    me._transformUpdateFormValue(f);
                    me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate, cb);
                    app.selectedPhone = "";
                    app.selectedCode = "";
                    app.ctrlOn = false;
                });
            } else if ($(b).hasClass('btn-return')) {
                $(b).unbind().on('click', function (e) {
                    e.preventDefault();
                    app.hasBookReturnTicket = true;
                    var cb = function () {
                        var afReload = function () {
                            vbf('onBookReturnTicket', { f: f, tId: tId }); // book return ticket
                        }
                        vbf('reloadBookingSheet', {}, afReload); // reload booking sheet
                    }
                    if (!me._validateUpdateForm(f)) {
                        if (app.hasBookReturnTicket) {
                            $._resetBookReturnInfo();
                            vbf('onUnbindEventBookReturnTicket'); // unbind event book return ticket
                        }
                        return;
                    }
                    me._transformUpdateFormValue(f);
                    me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate, cb);
                    app.selectedPhone = "";
                    app.selectedCode = "";
                    app.ctrlOn = false;
                    $('html, body').animate({
                        scrollTop: parseInt($("body").offset().top)
                    }, 500);
                });
            }
        });
        f.find('textarea[name="Note"]').unbind().on('keypress', function (e) {
            if (e.keyCode == 13 && !blockEnterEvent) { // Enter
                e.preventDefault();
                e.stopPropagation();
                if (!me._validateUpdateForm(f)) return;
                if ((cs != null && cs == 1)) return;
                me._transformUpdateFormValue(f);
                me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate);
            }
        });
        $(document).unbind('keypress').on('keypress', function (e) {
            var allowEnterUpdate = true;
            var $search = $('#update-popup #UpdateForm').find('ul.search-items,div.search-result');
            if ($search.length > 0) {
                allowEnterUpdate = false;
            }
            if (e.keyCode == 13 && allowEnterUpdate) {
                var $updatePopup = $("#update-popup");
                var $bUp = f.find('button.btn-update');
                if ($updatePopup.hasClass('in') && $bUp.is(':visible')) {
                    $bUp.trigger('click');
                }
            }
        });
    },
    _populateFormData: function (data, form) {
        $.each(data, function (name, val) {
            var $el = $(form).find('[name="' + name + '"]'), type = $el.attr('type');
            switch (type) {
                case 'checkbox':
                    $el.prop('checked', val);
                    break;
                case 'radio':
                    $el.filter('[value="' + val + '"]').prop('checked', val);
                    break;
                case 'label':
                    $el.text(val);
                    break;
                default:
                    $el.val(val);
                    break;
            }
            if (name == 'AgentName') {
                if ($el.length > 0) {
                    setTimeout(function () {
                        $el.val(val);
                        $el.trigger('chosen:updated');
                    }, 500);
                }
            }
        });
    },
    _createGetSeatStatusObj: function (f) {
        /// <summary>
        /// Create get seat status obj
        /// </summary>
        /// <param name="f">Update Form</param>    
        var id = null;
        var obj = {};
        id = f.find('input[name=IdInfo]').val().split(',');
        if (id.length > 0) {
            if (id[0] != null && id[0] != "") {
                obj._a = "fGetTicket";
                obj._c = {
                    Id: id[0],
                };
                obj._f = "Id, TripId, Status, IsPrgHistoryInfo, Code";
            }
        }
        return obj;
    },

    _initUpdateFormData: function (f, seat, st, tdid, sOffsetMinute, rp, tId) {
        /// <summary>
        /// Init data before show update form
        /// </summary>
        /// <param name="f">Update Form</param>
        /// <param name="seat">Obj Seat</param>
        /// <param name="st">Selected Seats</param>
        /// <param name="tdid">TripDetailId</param>
        /// <param name="sOffsetMinute"></param>
        /// <param name="rp">Route Points</param>
        /// <param name="tId">TripId</param>
        var cpi = app.copyInfo;
        var ticket = seat._getCurrentTicket();
        if ($.isEmptyObject(ticket)) return false;
        var fromArea = ticket.fromArea;
        var toArea = ticket.toArea;
        var fromStop = ticket._fromStop;
        var toStop = ticket._toStop;
        // thêm vé khác tuyến không copy FromArea, ToArea
        var curTripId = 0;
        if (vIsEstStr(cpi["CurrentTripId"])) curTripId = cpi["CurrentTripId"];
        if (app.hasCopyTicket) {
            if (curTripId == tId) {
                if (vIsEstStr(cpi["FromArea"])) fromArea = cpi["FromArea"];
                if (vIsEstStr(cpi["ToArea"])) toArea = cpi["ToArea"];
            } else {
                cpi["FromArea"] = fromArea;
                cpi["ToArea"] = toArea;
            }
        }

        this._renderDataForSelectBox(f, seat);

        var idInfo = [];
        var seatNo = [];
        var customerInfo = [];
        var statusInfo = [];
        var totalFare = 0;
        var createUser = [];
        var fare = 0;
        $.each(st, function (i, v) {
            var t = v._getCurrentTicket();
            // edited by Duy: update fare of ticket if copy info has fare copied 
            if (app.hasCopyTicket && cpi["Fare"] != undefined) {
                t._fare = cpi["Fare"].toNum();
            }
            if (fare == 0 || (fare > t._fare && t._fare > 0)) fare = t._fare;
            idInfo.push(t._id);
            seatNo.push(v._label);
            customerInfo.push(t._getCustomerInfo());
            statusInfo.push(t._status);
            createUser.push(t._suser);
            totalFare += (t._fare + t._surCharge - t._discount);
            if (t._status != 1) {
                t._debt = 0;
            }
        });
        var pickUpDate = new Date(ticket._pdate.getTime());
        pickUpDate.addMinutes(sOffsetMinute);
        var routePoints = rp;

        var obj = {
            IdInfo: idInfo.join(),
            PickupDate: pickUpDate.toFormatString('dd-mm-yyyy'),
            PickupTime: pickUpDate.toFormatString('hh:mm'),
            SeatNo: seatNo,
            Code: ticket._code,
            Fare: fare.toMn(),
            Surcharge: ticket._surCharge.toMn(),
            Deposit: ticket._deposit.toMn(),
            Discount: ticket._discount.toMn(),
            Debt: (ticket._debt * app.seatStack.length).toMn(),
            CustomerId: ticket._cid,
            CustomerInfo: customerInfo.join(),
            PhoneNumbers: ticket._cphone,
            FullName: ticket._cname,
            CreatedUser: createUser,
            Note: ticket._note,
            StatusInfo: statusInfo.join(),
            //PickupInfo: ticket._pInfo,
            Serial: ticket._seri,
            Notcome: ticket._status == 4 ? true : false,
            KeepOnTime: ticket._status == 8 ? true : false,
            NumSeat: seatNo.length,
            ToTalFare: totalFare.toMn(),
            RoutePoints: routePoints,
            NumClick: 0,
            FromArea: fromArea,
            ToArea: toArea,
            SNote: ticket._sNote,
            ResponsibilityUser: ticket._responUser,
            PickOrReturnDate: ticket._porDate,
            FromStop: fromStop,
            ToStop: toStop,
            IssuedUser: ticket._issuedUser,
            PrintStatus: ticket._printStatus
        };

        //if ("" == ticket._cphone && "" == ticket._cname) {
        //    obj.FullName = self._savedCustomer.FullName;
        //    obj.PhoneNumbers = self._savedCustomer.PhoneNumbers;
        //}

        //Payment
        if (vIsEstStr($.trim(ticket._pmInfo))) {
            var pmInfo = ticket._getPaymentInfo();
            obj.PaymentType = pmInfo.type;
            switch (pmInfo.type) {
                case 1:
                    obj.BranchName = pmInfo.info._id;
                    break;
                case 2:
                    obj.ChargeCode = $.map(pmInfo.info, function (v) { return v; }).join('|');
                    break;
                case 3:
                    obj.PayAddress = pmInfo.info._addr;
                    break;
                case 4:
                    obj.DriverName = pmInfo.info._dname;
                    break;
                case 5:
                    obj.TransCode = pmInfo.info._tcode;
                    break;
                case 6:
                    obj.AgentName = pmInfo.info._id;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                    break;
                default:
                    break;
            }
        }
        if (!vIsEstStr(obj.BranchName)) {
            var branches = [];
            f.find('select[name=BranchName] > option').each(function () {
                branches.push($(this).val());
            });
            if (branches.length > 0 && branches.indexOf(app.aid) != -1) {
                obj.BranchName = app.aid;
            }
        }
        if (!vIsEstStr(obj.AgentName)) {
            var agents = [];
            f.find('select[name=AgentName] > option').each(function () {
                agents.push($(this).val());
            });
            if (agents.length > 0 && agents.indexOf(app.aid) != -1) {
                obj.AgentName = app.aid;
            }
        }
        if (typeof obj.ChargeCode == "undefined") {
            obj.ChargeCode = _dict._pm[1][4]; //default charge code for bank transfer payment
        }
        if (vIsEstStr(ticket._pInfo)) {
            var pInfo = ticket._getPickupInfo();
            if (!$.isEmptyObject(pInfo)) {
                switch (pInfo.type) {
                    case 'P':
                        obj.PickupInfo = pInfo.text;
                        break;
                    case 'T':
                        obj.TransferInfo = pInfo.text;
                        break;
                }
                obj.pIndex = null;
                if (typeof pInfo.pIndex != "undefined") {
                    obj.pIndex = pInfo.pIndex;
                }
            }
        }
        // nếu đang trong quá trình đặt thêm vé thì ghi đè các thông tin đã copy
        // nếu thêm vé khác chuyến sẽ không copy mã code
        if (app.hasCopyTicket && typeof _dict._copyField != "undefined") {
            $.each(_dict._copyField, function (kl, kn) {
                if (kn != "Code") {
                    obj[kn] = cpi[kn];
                } else {
                    var tripDetailIdOld = cpi["TripDetailId"] ? cpi["TripDetailId"] : 0;
                    if (tripDetailIdOld == tdid) {
                        obj[kn] = cpi[kn];
                    }
                }
            });
        }
        // nếu đang trong quá trình đặt vé khứ hồi thì ghi đè các thông tin cần copy
        if (app.hasBookReturnTicket && typeof _dict._returnField != "undefined") {
            $.each(_dict._returnField, function (kl, kn) {
                obj[kn] = cpi[kn];
            });
        }

        // auto send sms when update ticket
        if (_dict._autoSendSmsUpdate != undefined && _dict._autoSendSmsUpdate) {
            obj.HasSendSms = true;
        }
        return obj;
    },
    _renderSeatNoDiv: function (data, f) {
        var $ul = f.find('ul#seat-no').empty();
        $.each(data, function (_, s) {
            $ul.append($('<li />').addClass('list-group-item').addClass(_dict._vc[Math.floor(Math.random() * _dict._vc.length)]).text(s));
        });
    },
    _normalFormFields: function (f) {
        f.find("input:disabled").prop('disabled', false);
        f.find("select:disabled").prop('disabled', false);
        f.find("textarea:disabled").prop('disabled', false);
        f.find('input[name="RoutePoint"]').prop('disabled', false);
        //self._$validForm.find("input:disabled").prop('disabled', false);
        //self._$validForm.find("select:disabled").prop('disabled', false);
        f.find('ul[role=tab-list] li').removeClass('hidden').removeClass('active');
        f.find('button').removeClass('hidden');
        f.find('div.message-error').html('');
        f.find('div.message-error').hide();
    },
    _disableFormFields: function (f, seat, st, cs, tid) {
        var me = this;
        /// <summary>
        /// Disable Field Before Show Update Form
        /// </summary>
        /// <param name="f">Form</param>
        /// <param name="seat"></param>
        /// <param name="st">Seat Stack: selected seats</param>
        /// <param name="cs">ClosedStatus</param>
        /// <param name="tid">TripId</param>
        me._normalFormFields(f);
        var elm = ['input', 'select', 'textarea'];
        if (st.length > 1) { //Multiple ticket
            $.each(_dict._frule[0], function (_, r) {
                var $f = $('#' + r[0]);
                $.each(r[1], function (__, i) {
                    var $ip = $();
                    var index = 0;
                    while ($ip.length == 0 && index < elm.length) {
                        $ip = $f.find(elm[index] + '[name=' + i + ']');
                        index++;
                    }
                    if ($ip.length > 0) {
                        $ip.prop('disabled', true);
                    }
                });
            });

            $.each(_dict._trule[0], function (__, tr) {
                f.find('a[data-tab=' + tr + ']').closest('li').addClass('hidden');
            });

        }
        var fr = [];
        var ttr = [];
        var br = [];
        var info = {
            _customer: [],
            _pickUp: [],
            _note: [],
            _fare: [],
            _surCharge: [],
            _deposit: [],
            _discount: [],
            _paymentInfo: [],
            _cNames: [],
            _cPhones: []
        };
        var fromAreas = [];
        var toAreas = [];
        var ticketStatus = [];
        var blockFields = [];
        var printStatuses = [];
        // kiểm tra các vé có sự khác biệt không
        // nếu có sẽ không hiện 2 nút Thêm vé và Khứ hồi
        var hasDiff = false;
        $.each(st, function (_, s) {
            var t = s._getCurrentTicket();
            $.each(_dict._frule[1], function (__, r) {
                if (t._status == r[0]) {
                    // quyền được edit thông tin thanh toán cho các vé đã thanh toán
                    if (app.rights.indexOf($.rights.bEdtInfPaidTk.val) == -1) {
                        fr.push(r[1]);
                    }
                }
            });
            $.each(_dict._trule[1], function (__, r) {
                if (t._status == r[0]) {
                    ttr.push(r[1]);
                }
            });
            $.each(_dict._brule[1], function (__, r) {
                if (t._status == r[0]) {
                    br.push(r[1]);
                }
            });
            info._customer.push(t._getCustomerInfo());
            info._cNames.push(t._cname);
            info._cPhones.push(t._cphone);
            var pInfo = t._getPickupInfo();
            var pText = "";
            if (!$.isEmptyObject(pInfo)) {
                pText = pInfo.text;
            }
            info._pickUp.push(pText);
            info._note.push(t._note);
            info._fare.push(t._fare);
            info._surCharge.push(t._surCharge);
            info._deposit.push(t._deposit);
            info._discount.push(t._discount);
            //info._paymentInfo.push(t._getPaymentInfo());
            info._paymentInfo.push(t._pmInfo);
            fromAreas.push(t.fromArea);
            toAreas.push(t.toArea);
            ticketStatus.push(t._status);
            printStatuses.push(t._printStatus);
        });
        fromAreas = fromAreas.getUnique();
        toAreas = toAreas.getUnique();
        if (fromAreas.length > 1 || toAreas.length > 1) {
            blockFields.push("RoutePoint");
        }
        ticketStatus = ticketStatus.getUnique();
        if (ticketStatus.length > 1) {
            blockFields.push("RoutePoint");
        }
        blockFields = blockFields.getUnique();
        $.each(blockFields, function (k, v) {
            switch (v) {
                case "RoutePoint":
                    f.find('input[name="RoutePoint"]').prop('disabled', true);
                    hasDiff = true;
                    break;
                default:
                    break;
            }
        });

        fr = fr.getUnique();
        ttr = ttr.getUnique();
        br = br.getUnique();
        $.each(fr, function (__, gr) {
            $.each(gr, function (___, r) {
                var $f = $('#' + r[0]);
                $.each(r[1], function (____, i) {
                    var $ip = $();
                    var index = 0;
                    while ($ip.length == 0 && index < elm.length) {
                        $ip = $f.find(elm[index] + '[name=' + i + ']');
                        index++;
                    }
                    if ($ip.length > 0) {
                        $ip.prop('disabled', true);
                    }
                });
            });
        });
        $.each(ttr, function (__, tbr) {
            $.each(tbr, function (___, r) {
                f.find('a[data-tab=' + r + ']').closest('li').addClass('hidden');
            });
        });
        $.each(br, function (__, ibr) {
            $.each(ibr, function (___, r) {
                var $form = $('#' + r[0]);
                $.each(r[1], function (____, i) {
                    // Phân quyền tài khoản
                    // Tài khoản có quyền hiển thị lý do Hủy hoàn toàn sẽ được ngoại lệ
                    if (i == 'btn-cancel') {
                        if (app.rights.indexOf($.rights.cReDeFo.val) == -1) {
                            $form.find('button.' + i).addClass('hidden');
                        }
                    } else {
                        $form.find('button.' + i).addClass('hidden');
                    }

                });
            });
        });
        var status = seat._tickets[seat._currentTicketIndex]._status;
        if (cs == 1) {
            if (status == 2 || status == 5 || status == 3) {
                if (typeof _dict._closedTripConf != "undefined") {
                    if (_dict._closedTripConf['UpdateForm'].length > 0) {
                        if (app.rights.indexOf($.rights.bEnBtnAtDpt.val) == -1) {
                            $.each(_dict._closedTripConf['UpdateForm'], function (k, l) {
                                f.find('button.' + l).addClass('hidden');
                            });
                        }
                    }
                }
            }
        }
        // disable các chặng đối với vé đã thanh toán rồi
        if (status != 1) {
            f.find('input[name="RoutePoint"]').prop('disabled', true);
        }
        info._customer = info._customer.getUnique();
        info._pickUp = info._pickUp.getUnique();
        info._note = info._note.getUnique();
        info._fare = info._fare.getUnique();
        info._surCharge = info._surCharge.getUnique();
        info._deposit = info._deposit.getUnique();
        info._discount = info._discount.getUnique();
        info._paymentInfo = info._paymentInfo.getUnique();
        info._cNames = info._cNames.getUnique();
        info._cPhones = info._cPhones.getUnique();
        if (info._cNames.length > 1) {
            f.find('input[name=FullName]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._cPhones.length > 1) {
            f.find('input:text[name=PhoneNumbers]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._pickUp.length > 1) {
            f.find('input[name=PickupInfo]').prop('disabled', true);
            f.find('input[name=TransferInfo]').prop('disabled', true);
            f.find('input[name=pIndex]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._note.length > 1) {
            f.find('textarea[name=Note]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._fare.length > 1) {
            f.find('input[name=Fare]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._surCharge.length > 1) {
            f.find('input[name=Surcharge]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._deposit.length > 1) {
            f.find('input[name=Deposit]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._discount.length > 1) {
            f.find('input[name=Discount]').prop('disabled', true);
            hasDiff = true;
        }
        if (info._paymentInfo.length > 1) {
            f.find('select[name=PaymentType]').prop('disabled', true);
            f.find('input[name=BranchName]').prop('disabled', true);
            f.find('select[name=BranchName]').prop('disabled', true);
            f.find('input[name=ChargeCode]').prop('disabled', true);
            f.find('input[name=PayAddress]').prop('disabled', true);
            f.find('input[name=DriverName]').prop('disabled', true);
            f.find('input[name=TransCode]').prop('disabled', true);
            f.find('input[name=AgentName]').prop('disabled', true);
            hasDiff = true;
        }
        
        if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
            var firstPoint = f.find('div.checkbox-route-point input[name="RoutePoint"]').first();
            if (app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                if (!firstPoint.is(':disabled')) {
                    firstPoint.attr('disabled', true);
                }
            }
        }
        // Updated by Duy (2015-08-04 11:40) 
        // Block print-save button if PrintStatus = 0
        if (_dict._printETicketOnlyOne != undefined && _dict._printETicketOnlyOne) {
            var $printSave = f.find('button.btn-eprint-save');
            if ($printSave.length > 0) {
                printStatuses = printStatuses.getUnique();
                if (printStatuses.length > 1 || printStatuses[0] == 0) {
                    if (app.rights.indexOf($.rights.bUnPr.val) != -1) {
                        $printSave.prop('disabled', false);
                        $printSave.attr('state', 'unblock');
                        $printSave.text('Mở in vé');
                    } else {
                        $printSave.prop('disabled', true);
                        $printSave.attr('state', 'block');
                        $printSave.text('Đã xuất vé');
                    }
                } else {
                    $printSave.prop('disabled', false);
                    $printSave.attr('state', 'avai');
                    $printSave.text('In vé');
                }
            }
        }
        // đang trong thao tác đặt thêm vé, thao tác đặt vé khứ hồi, các vé có sự khác biệt thông tin
        // sẽ không hiện button Thêm vé và button Khứ hồi
        if (app.hasCopyTicket || app.hasBookReturnTicket || hasDiff) {
            f.find('button.btn-add-more-ticket').addClass('hidden');
            f.find('button.btn-return').addClass('hidden');
        }
        if (!me._checkRightOnUpdateForm(tid)) {
            f.find('button.btn-cancel').hide();
        } else {
            f.find('button.btn-cancel').show();
        }
    },
    _triggerUpdateTab: function (f) {
        f.find('ul[role=tab-list] li').not('.hidden').first().find('a').trigger('click');
    },
    _triggerUpdateForm: function (f) {
        f.find('select[name=PaymentType]').trigger('change');
    },
    _createRoutePoints: function (f, rp, fa, ta, df, dt, tm, fi) {
        /// <summary>
        /// Render Route Points
        /// </summary>
        /// <param name="f">Update Form</param>
        /// <param name="rp">Route Points</param>
        /// <param name="fa">From Area</param>
        /// <param name="ta">To Area</param>
        /// <param name="df">Default From Id</param>
        /// <param name="dt">Default To Id</param>
        /// <param name="tm">TripTime</param>
        /// <param name="fi">Fare Info</param>
        var me = this;
        var $crp = f.find('div.checkbox-route-point');
        $crp.empty();
        var fromId = 0;
        var toId = 0;
        if (df != 0) {
            fromId = df;
        }
        if (dt != 0) {
            toId = dt;
        }
        if (vIsEstStr(fa)) {
            var indFrom = fa.indexOf('~');
            fromId = fa.substr(indFrom + 1, fa.length).split('|')[0];
        }
        if (vIsEstStr(ta)) {
            var indTo = ta.indexOf('~');
            toId = ta.substr(indTo + 1, ta.length).split('|')[0];
        }
        var startTime = tm;
        var startHour = parseInt(startTime.split(':')[0]);
        var startMinute = parseInt(startTime.split(':')[1]);
        $.each(rp, function (k, v) {
            var hourFomat = "";
            var minuteFomat = "";
            startHour += parseInt(v.Hour);
            startMinute += parseInt(v.Minute);
            if (startMinute >= 60) {
                startMinute = startMinute % 60;
                startHour += 1;
            }
            if (startHour > 24) {
                startHour = startHour % 24;
            } else if (startHour == 24) {
                startHour = 0;
                hourFomat = "00";
            }
            if (startHour < 10) {
                hourFomat = "0" + startHour;
            } else if (startHour >= 10) {
                hourFomat = startHour;
            }
            if (startMinute < 10) {
                minuteFomat = "0" + startMinute;
            } else {
                minuteFomat = startMinute;
            }
            var time = "";
            if (k == 0) {
                time = tm;
            } else {
                time = hourFomat + ":" + minuteFomat;
            }
            var $routePoint = $('<label class="checkbox-inline" />')
                .append($('<input type="checkbox" name="RoutePoint" data-point-id="' + v.Id + '"/>'))
                .append($('<b />').html(v.Code))
                .append($('<mark class="text-primary"/>').html(time));
            // nếu chỉ có hai điểm đầu cuối thì ẩn checkbox
            if (rp.length == 2) $routePoint.addClass('hidden');
            $crp.append($routePoint);
        });
        if (fromId == 0 && toId == 0) {
            var $rp = $crp.find('input[name="RoutePoint"]');
            $rp.first().attr('checked', true);
            $rp.last().attr('checked', true);
        } else {
            $crp.find('input[name="RoutePoint"][data-point-id="' + fromId + '"]').attr('checked', true);
            $crp.find('input[name="RoutePoint"][data-point-id="' + toId + '"]').attr('checked', true);
        }
        me._bindEventRoutePoints(f, fi);
    },
    _bindEventRoutePoints: function (f, fi) {
        var me = this;
        f.find('input[name="RoutePoint"]').unbind().on('click', function (e) {
            var fromId = 0, toId = 0, fare = 0, totalFare = 0;
            var numSeat = f.find('input[name="NumSeat"]').val();
            var clicked = f.find('input[name="NumClick"]').val();
            if ($(this).is(':checked')) {
                var checked = f.find('input[name="RoutePoint"][checked="checked"]');
                if (checked.length >= 2) {
                    if (clicked != 0) {
                        f.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                        $(this).attr('checked', true);
                        if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
                            checked = f.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                            if (checked.length == 1) {
                                fromId = f.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                                toId = checked.attr('data-point-id');
                                fare = me._getFareQuickBook(fromId, toId, fi);
                            }
                            totalFare = numSeat * fare;
                            f.find('input[name="Fare"]').val(fare.toMn());
                            f.find('input[name="ToTalFare"]').val(totalFare.toMn());
                        } else {
                            f.find('input[name="Fare"]').val(0);
                            f.find('input[name="ToTalFare"]').val(0);
                        }
                    } else {
                        checked = f.find('input[name="RoutePoint"][checked="checked"]');
                        checked.last().removeAttr('checked');
                        $(this).attr('checked', true);
                        checked = f.find('input[name="RoutePoint"][checked="checked"]');
                        if (checked.length == 2) {
                            fromId = checked.first().attr('data-point-id');
                            toId = checked.last().attr('data-point-id');
                            fare = me._getFareQuickBook(fromId, toId, fi);
                        }
                        totalFare = numSeat * fare;
                        f.find('input[name="Fare"]').val(fare.toMn());
                        f.find('input[name="ToTalFare"]').val(totalFare.toMn());
                        f.find('input[name="NumClick"]').val(1);
                    }
                } else if (checked.length <= 1) {
                    if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint && app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                        f.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                        $(this).attr('checked', true);
                        checked = f.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                        if (checked.length == 1) {
                            fromId = f.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                            toId = checked.attr('data-point-id');
                            fare = me._getFareQuickBook(fromId, toId, fi);
                        }
                        totalFare = numSeat * fare;
                        f.find('input[name="Fare"]').val(fare.toMn());
                        f.find('input[name="ToTalFare"]').val(totalFare.toMn());
                    } else {
                        $(this).attr('checked', true);
                        checked = f.find('input[name="RoutePoint"][checked="checked"]');
                        if (checked.length == 2) {
                            fromId = checked.first().attr('data-point-id');
                            toId = checked.last().attr('data-point-id');
                            fare = me._getFareQuickBook(fromId, toId, fi);
                        }
                        totalFare = numSeat * fare;
                        f.find('input[name="Fare"]').val(fare.toMn());
                        f.find('input[name="ToTalFare"]').val(totalFare.toMn());
                    }
                }
            } else {
                $(this).removeAttr('checked');
                f.find('input[name="Fare"]').val(0);
                f.find('input[name="ToTalFare"]').val(0);
                f.find('input[name="NumClick"]').val(1);
            }
        });
    },
    _closeUpdateDialog: function (f) {
        /// <summary>
        /// Close Update Popup
        /// </summary>
        /// <param name="f">Update Form</param>
        if (f) {
            vbf('onClearWarningCustomer', { f: f }); // clear warning customer
            f.modal('hide');
        }
        $('body').find('.updateConflict-popup').remove();
        $('body').find('.modal-backdrop.fade.in').remove();
    },

    _createUpdateConflictDialogDiv: function (f, createdUser, stopPoints, tBus, tId, offsetMinute, tName, tDate) {
        var me = this;
        $('body').find('#updateConflict-popup').remove();
        var $conflictBody = $('<div />').addClass('modal-body')
            .append($('<form />').attr('id', "UpdateConflictForm")
                .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                    .append($('<tr />')
                        .append($('<td style="border:0;" />').addClass('col-md-6')
                            .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
                                .append($('<p />').html("Ghế đã được đặt bởi <strong style='color:red'>" + createdUser + "</strong>. Đặt chồng vé ?"))
                            )
                        )
                    )
                    .append($('<tr />')
                        .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                            .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
                                .click(function () {
                                    me._closeUpdateConflictDialog();
                                    me._transformUpdateFormValue(f);
                                    me._updateTicket(f, stopPoints, tBus, tId, offsetMinute, tName, tDate);
                                    app.selectedPhone = "";
                                    app.selectedCode = "";
                                    app.ctrlOn = false;
                                    $._resetCopyInfo();
                                    $._resetBookReturnInfo();
                                })
                            )
                            .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
                                .click(function () {
                                    me._closeUpdateConflictDialog();
                                })
                            )
                        )
                    )
                )
        );
        //Create a div for dialog and add to container element
        me._$updateConflictModal = $('<div />').addClass('modal fade updateConflict-popup')
            .attr('role', 'dialog')
            .attr('aria-hidden', 'true')
            .append(
                $('<div />').addClass('modal-dialog modal-md')
                .append($('<div />').addClass('modal-content')
                    .append($('<div />').addClass('modal-header').css('background-color', '#c9302c').addClass('bg-primary')
                        .append($('<h2 />').addClass('modal-title thin-1').html('Cảnh báo'))
                    )
                    .append($conflictBody)
                )
            )
        .appendTo($('body'));
        me._$updateConflictModal.modal('show');
    },
    _closeUpdateConflictDialog: function () {
        this._$updateConflictModal.modal('hide');
    },

    _resetForm: function (f) {
        f.find("input[type=hidden]").val("");
        f.find("input[type=text], textarea, select").val("");
        f.find("input[type=checkbox]").prop('checked', false);
        f.find("input[type=radio]").prop('checked', false);
        f.find('div.has-error').removeClass('has-error');
        f.find('div.search-result').remove();
    },
    _getPickupInfo: function (p, t, index) {
        if (typeof p == "undefined") p = "";
        if (typeof t == "undefined") t = "";
        if (typeof index == "undefined") t = "";
        return $.trim(p + '|' + t + "|" + index);
    },
    _getCustomer: function (cid, cname, cphone) {
        return $.trim('1|1|' + cid + '|' + cname + '|' + cphone);
    },
    _getTeamInfo: function () {
        var teamInfoStr = FlatObj.cTrip.TeamInfo;

        var res = "|";
        if (teamInfoStr) {
            var teamInfoArr = teamInfoStr.split('~');
            $.each(teamInfoArr, function (i, v) {
                if (i >= 1) {
                    var teamInfoItem = v.split('|');
                    if (teamInfoItem[0] == 2) { // 2 => Tài xế, 4 => Phụ xe
                        /*var driverName = teamInfoItem[2];
                        var driverPhone = teamInfoItem[3]? "|"+teamInfoItem[3]: ""; */
                        res = teamInfoItem[2] + "|" + teamInfoItem[3];
                    }
                }
            });
        }
        return res;
    },
    _getFareQuickBook: function (fromId, toId, fi) {
        var me = this, fares = me._parseFares(fi), key = fromId + "|" + toId, fare = fares[key];
        if (typeof fare == "undefined") return 0;
        return fare;
    },
    _parseFares: function (fi) {
        var from = "", to = "", fare = 0;
        if (fi != undefined && vIsEstStr(fi) && fi.length > 1) {
            var fInfo = fi.split('~'), len = fInfo.length, fares = [];
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
    _transformUpdateFormValue: function (f) {
        var me = this;
        //Change status of ticket
        var paymentType = f.find('select[name=PaymentType]').not(":disabled").val();
        var notCome = f.find('input[name=Notcome]').not(":disabled").prop('checked');
        var keepOnTime = f.find('input[name=KeepOnTime]').not(":disabled").prop('checked');
        if (notCome) {
            me._changeFormToNotComeStatus(f);
        } else if (keepOnTime) {
            me._changeFormToKeepOnTimeStatus(f);
        } else {
            if (typeof paymentType != "undefined") {
                paymentType = parseInt(paymentType);
                if (isNaN(paymentType)) {
                    me._changeFormToBookingStatus(f);
                } else {
                    switch (paymentType) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 10:
                            me._changeFormToPaidStatus(f);
                            break;
                        case 9:
                            me._changeFormToPassStatus(f);
                            break;
                    }
                }
            }
        }
    },
    _changeFormToPaidStatus: function (f) {
        //Change status to paid
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(2);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },
    _changeFormToNotComeStatus: function (f) {
        //Change status to not come
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(4);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },
    _changeFormToPassStatus: function (f) {
        //Change status to not come
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(5);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },
    _changeFormToKeepOnTimeStatus: function (f) {
        //Change status to keep on time
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(8);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },
    _changeFormToBookingStatus: function (f) {
        //Change status to booking
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(1);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },
    _changeFormToOpenStatus: function (f) {
        //Change status to booking
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(7);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },
    _changeFormToValidStatus: function (f) {
        //Change status to booking
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(6);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },
    _changeFormToCancelledStatus: function (f) {
        // Change status to booking
        var status = [];
        for (var i = 0; i < app.seatStack.length; i++) {
            status.push(3);
        }
        f.find('input[name=StatusInfo]').val(status.join());
    },

    _checkRightOnUpdateForm: function (tid) {
        //3|2|-1: duoc ban het tat ca cac chuyen (mac dinh)
        //3|2|0: K duoc ban tat ca cac chuyen
        //Neu co them chuyen o phia sau: loai tru dieu kien ban dau
        if (app.rights.indexOf("~3|2|") == -1) {
            return true;
        } else {
            var result = app.rights.indexOf("~3|2|0") >= 0 ? false : true;
            var arr = app.rights.split('~');
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].indexOf('3|2|') >= 0) {
                    if (tid == arr[i].split('|')[2]) {
                        return (!result);
                    }
                }
            }
            return result;
        }
    },
});
$(document).ready(function () {
    $._convertFormDataToObj = function (f) {
        /// <summary>
        /// Convert data from form
        /// </summary>
        /// <param name="f">form</param>
        var paramObj = {};
        var isGetBlock = (app.hasCopyTicket || app.hasBookReturnTicket);
        var inForms = f.find('#UpdateForm input,textarea,select');
        $.each(inForms, function (i, e) {
            if (e.name == "PhoneNumbers") {
                var $ccode = f.find("#UpdateForm .intl-tel-input .selected-flag .iti-flag");
                if ($ccode.length > 0) {
                    for (var i = 0; i < _dict.dialCodes; i++) {
                        if ($ccode.hasClass(_dict.dialCodes[i].countryCode)) {
                            paramObj[e.name] = "(+" + _dict.dialCodes[i].dialCode + ") " + e.value;
                        }
                    }
                }
                
            }else if (!$(e).is(':disabled') || isGetBlock) {
                paramObj[e.name] = e.value;
            }
        });

        return paramObj;
    }
    $._bindEventOnCalendarIcon = function () {
        $('#FilterForm').find('.glyphicon-calendar').parent().on('click', function () {
            $(this).prev().datepicker('show');
        });
    }
    $._getBranchInfo = function (bid) {
        var result = "";
        $.each(app.branchInfo, function (_, b) {
            if (result == "") {
                if (bid == b[0]) {
                    result = b.join('|');
                }
            }
        });
        if (result == "") {
            result = [app.aid, app.aite, app.aice, app.aisne, '', ''].join('|');
        }
        return result;
    }
    $._getPayment = function (key, text, code) {
        return $.trim(key + ':' + text + ':' + code);
    }
});
