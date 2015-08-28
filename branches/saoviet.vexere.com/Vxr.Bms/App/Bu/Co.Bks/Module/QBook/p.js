define({
    start: function (o) {
        var me = this;
        me._createQuickBookDiv();
        vbv('doShowQBook', function(e) {
            me._showQBook(e.d.tData);
        });
        vbv('doCloseQBook', function() {
            me._closeQuickBookForm();
        });
    },
    _showQBook: function (tData) {
        var me = this;
        var fObj = me._initQuickBookFormData(tData);
        me._renderSeatNoQuickBookDiv(fObj.SeatNo);
        me._renderRoutePoints(tData, fObj.RoutePoints, fObj.FromPoint, fObj.ToPoint);
        me._renderPaymentQuickBook();
        me._populateFormData(fObj, me._$qBkMd);
        me._blockFormField();
        me._bindEventOnQuickBookForm(tData);
        me._showQuickBookModal();
    },
    _showQuickBookModal: function () {
        this._resetQuickBookModal();
        this._$qBkMd.modal('show');
    },
    _bindEventOnQuickBookForm: function (tData) {
        var me = this;
        me._$qBkMd.find('button.close-qBook').unbind().on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            me._closeQuickBookForm();
            vbf('onClearSelectedItem'); // Clear selected items
        });

        me._$qBkMd.find('input[name="RoutePoint"]').unbind().on('click', function (e) {
            var fromId = 0;
            var toId = 0;
            var fare = 0;
            var totalFare = 0;
            var clicked = me._$qBkMd.find('input[name="NumClick"]').val();
            if ($(this).is(':checked')) {
                var checked = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]');
                if (checked.length >= 2) {
                    if (clicked != 0) {
                        me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                        $(this).attr('checked', true);
                        if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
                            checked = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                            if (checked.length == 1) {
                                fromId = me._$qBkMd.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                                toId = checked.attr('data-point-id');
                                fare = me._getFareQuickBook(fromId, toId);
                            }
                            totalFare = app.seatStack.length * fare;
                            me._$qBkMd.find('input[name="Fare"]').val(fare.toMn());
                            me._$qBkMd.find('input[name="TotalFare"]').val(totalFare.toMn());
                        } else {
                            me._$qBkMd.find('input[name="Fare"]').val(0);
                            me._$qBkMd.find('input[name="TotalFare"]').val(0);
                        }
                    } else {
                        checked = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]');
                        checked.last().removeAttr('checked');
                        $(this).attr('checked', true);
                        checked = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]');
                        if (checked.length == 2) {
                            fromId = checked.first().attr('data-point-id');
                            toId = checked.last().attr('data-point-id');
                            fare = me._getFareQBook(tData, fromId, toId);
                        }
                        totalFare = app.seatStack.length * fare;
                        me._$qBkMd.find('input[name="Fare"]').val(fare.toMn());
                        me._$qBkMd.find('input[name="TotalFare"]').val(totalFare.toMn());
                        me._$qBkMd.find('input[name="NumClick"]').val(1);
                    }
                } else if (checked.length <= 1) {
                    if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint && app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                        me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                        $(this).attr('checked', true);
                        checked = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                        if (checked.length == 1) {
                            fromId = me._$qBkMd.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                            toId = checked.attr('data-point-id');
                            fare = me._getFareQuickBook(fromId, toId);
                        }
                        totalFare = app.seatStack.length * fare;
                        me._$qBkMd.find('input[name="Fare"]').val(fare.toMn());
                        me._$qBkMd.find('input[name="TotalFare"]').val(totalFare.toMn());
                    } else {
                        $(this).attr('checked', true);
                        checked = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]');
                        if (checked.length == 2) {
                            fromId = checked.first().attr('data-point-id');
                            toId = checked.last().attr('data-point-id');
                            fare = me._getFareQBook(tData, fromId, toId);
                        }
                        totalFare = app.seatStack.length * fare;
                        me._$qBkMd.find('input[name="Fare"]').val(fare.toMn());
                        me._$qBkMd.find('input[name="TotalFare"]').val(totalFare.toMn());
                    }
                }
            } else {
                $(this).removeAttr('checked');
                me._$qBkMd.find('input[name="Fare"]').val(0);
                me._$qBkMd.find('input[name="TotalFare"]').val(0);
                me._$qBkMd.find('input[name="NumClick"]').val(1);
            }
        });

        me._$qBkMd.find('select[name="PaymentType"]').unbind().on('change', function (e) {
            if ($(this).val() == 9) {
                me._$qBkMd.find('input[name="StatusInfo"]').val(5);
            } else {
                me._$qBkMd.find('input[name="StatusInfo"]').val(2);
            }
        });

        me._$qBkMd.find('input[name="Fare"]').unbind().on('change', function (e) {
            var numSeat = app.seatStack.length;
            var newFare = $(this).val().toNum();
            if (newFare < 10000) {
                newFare = newFare * 1000;
            }
            var totalFare = numSeat * newFare;
            $(this).val(newFare.toMn());
            me._$qBkMd.find('input[name="TotalFare"]').val(totalFare.toMn());
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        //me._$qBkMd.find('button.cancel-qBook').unbind().on('click', function (e) {
        //    me._closeQuickBookForm();
        //    me._showCancelForm();
        //});

        me._$qBkMd.find('button.pay-qBook').unbind().on('click', function (e) {
            if (me._validateQuickBookForm()) {
                return;
            }
            me._payQBook(tData);
        });

        me._$qBkMd.find('button.print-qBook').unbind().on('click', function (e) {
            var afterSave = function () {
                var afterReloadSheet = function () {
                    //me._printETicket();
                    vbf('onPrintETicket', {}, function() {
                        app.seatStack = [];
                    });
                    me._closeQuickBookForm();
                    vbf('onClearSelectedItem');
                }
                vbf('reloadBookingSheet', {}, afterReloadSheet);
            }
            if (me._validateQuickBookForm()) {
                return;
            }
            me._payQBook(tData, afterSave);
        });
    },
    _payQBook: function (tData, afterSave) {
        var me = this;
        var obj = me._createPayQBookObj(tData);
        if (false != obj) {
            var completeReload = function (u, r, l, t) {

                if (u != 1) return;

                if (typeof afterSave != "undefined" && typeof afterSave === "function") {
                    // cập nhật FromArea và ToArea các ghế trong seat stack
                    $.each(app.seatStack, function (k, l) {
                        var tick = l._getCurrentTicket();
                        tick.fromArea = (obj._d)[0].FromArea;
                        tick.toArea = (obj._d)[0].ToArea;
                    });
                    afterSave.call();
                } else {
                    //Store history
                    var slabel = [];
                    $.each(app.seatStack, function (i, v) {
                        slabel.push(v._label);
                    });

                    //// Store history
                    //me._storeHistory(me.options.un, 'update', { '_tid': me._cTripId, '_tname': me._data[me._cTripIndex].Name, '_tdate': me._getDepartureTime(), '_s': slabel });
                    vbf('onStoreHistory', { 
                        un: app.un,
                        key: 'update',
                        his: { '_tid': tData.cTripId, '_tname': tData.data[tData.cTripIndex].Name, '_tdate': me._getDptTime(), '_s': slabel }
                    });
                    //Reset seat stack
                    app.seatStack = [];

                    //Reload sheet
                    //me._reloadSheet();
                    vbf('reloadBookingSheet', {});

                    //Close dialog
                    me._closeQuickBookForm();
                }
            };
            //Submit action
            vRqs(obj, completeReload);
        }
    },
    _getDptTime: function () {
        var dt = app.cDate;
        var ts = app.cTime.split(':');
        if (isNaN(parseInt(ts[0])) || isNaN(parseInt(ts[1]))) return {};
        dt.setHours(parseInt(ts[0]));
        dt.setMinutes(parseInt(ts[1]));
        return dt;
    },
    _createPayQBookObj: function (tData) {
        var me = this;
        var d = me._getDataQuickBookForm(tData);

        var obj = {};
        obj._a = "UpdateBookTicket";
        obj._c = [];
        obj._d = [];

        //Payment
        var paymentInfo = "";
        if (vIsEstStr(d.PaymentType)) {
            var pt = "";
            $.each(_dict._qBookPayment, function (k, t) {
                if ("" == pt) {
                    if (t[0] == d.PaymentType) {
                        pt = t[1].vi;
                    }
                }
            });
            var code = "";
            switch (parseInt(d.PaymentType)) {
                case 1:
                    code = me._getBrIf(app.aid);
                    break;
                case 2:
                    code = d.ChargeCode;
                    break;
                case 3:
                    code = d.PayAddress;
                    break;
                case 4:
                    //code = d.DriverName;
                    code = me._gtTmIf();
                    break;
                case 5:
                    code = d.TransCode;
                    break;
                case 6:
                    code = me._getBrIf(d.AgentName);
                    break;
                case 7:
                case 8:
                case 9:
                    break;
                case 10:
                    code = me._getBrIf(d.BranchName);
                    break;
                default:
                    break;
            }
            paymentInfo = $.trim(d.PaymentType + ':' + pt + ':' + code); //self._getPayment(d.PaymentType, pt, code);
        }
        $.each(app.seatStack, function (i, v) {
            var t = v._getCurrentTicket();
            var pickUpDate = new Date(t._pdate.getTime());
            pickUpDate.addMinutes(app.sOffsetMinute);
            obj._c.push({
                Id: t._id,
                TripId: tData.cTripId,
                SeatCode: v._getSeatInfo(),
                PickupDate: pickUpDate.toFormatString('iso'),
                Bus: tData.cTripBus
            });
            var dObj = {
                TripAlias: parseInt(tData.cTripBus),
                Status: d.StatusInfo,
                FromArea: d.FromArea,
                ToArea: d.ToArea
            };
            var ticketCode = t._code;
            if (vIsEstStr(ticketCode)) {
                dObj.Code = ticketCode;
            }
            if (typeof d.Fare != "undefined") {
                dObj.Fare = d.Fare.toNum();
            }
            if (typeof d.Note != "undefined") {
                dObj.Note = d.Note;
            }
            if (typeof d.PaymentType != "undefined") {
                dObj.PaymentInfo = paymentInfo;
                if (t._isBooking() && vIsEstStr(paymentInfo)) {
                    dObj.UserCharge = app.un;
                }
            }
            obj._d.push(dObj);
        });
        return obj;
    },
    _gtTmIf: function () {
        var teamInfoStr = FlatObj.cTrip.TeamInfo;
        var res = "|";

        if (teamInfoStr) {
            var teamInfoArr = teamInfoStr.split('~');
            $.each(teamInfoArr, function (i, v) {
                if (i >= 1) {
                    var teamInfoItem = v.split('|');
                    if (teamInfoItem[0] == 2) {//2=>Tài xế, 4=>phụ xe
                        /*var driverName = teamInfoItem[2];
                        var driverPhone = teamInfoItem[3]? "|"+teamInfoItem[3]: ""; */
                        res = teamInfoItem[2] + "|" + teamInfoItem[3];
                    }
                }
            });
        }
        return res;

    },
    _getBrIf: function (bid) {
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
    },
    _getDataQuickBookForm: function (tData) {
        var me = this;
        var obj = {}
        var routePoints = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]');
        var $fromPoint = routePoints.first();
        // kiểm tra xem điểm đi có bị block không
        // nếu có thì không cập nhật điểm đi
        if ($fromPoint.length > 0 && !$fromPoint.is(':disabled')) {
            var fromId = $fromPoint.attr('data-point-id');
            var fromInfo = tData.data[tData.cTripIndex].StopPoints.data[tData.data[tData.cTripIndex].StopPoints.idx[fromId]];
            obj.FromArea = "1~" + fromInfo.Id + "|" + fromInfo.Type + "|" + fromInfo.Code + "|" + fromInfo.Name;
        }
        // kiểm tra xem điểm đến có bị block không
        // nếu có thì không cập nhật điểm đến
        var $toPoint = routePoints.last();
        if ($toPoint.length > 0 && !$toPoint.is(':disabled')) {
            var toId = $toPoint.attr('data-point-id');
            var toInfo = tData.data[tData.cTripIndex].StopPoints.data[tData.data[tData.cTripIndex].StopPoints.idx[toId]];
            obj.ToArea = "1~" + toInfo.Id + "|" + toInfo.Type + "|" + toInfo.Code + "|" + toInfo.Name;
        }
        // kiểm tra xem giá vé có bị block không
        // nếu có thì không cập nhật giá vé
        var $fare = me._$qBkMd.find('input[name="Fare"]');
        if (!$fare.is(':disabled')) {
            obj.Fare = $fare.val();
        }
        obj.PaymentType = me._$qBkMd.find('select[name="PaymentType"]').val();
        obj.StatusInfo = me._$qBkMd.find('input[name="StatusInfo"]').val();
        var $note = me._$qBkMd.find('input[name="Note"]').not(':disabled');
        if ($note.length > 0) {
            obj.Note = $note.val();
        }

        return obj;
    },
    _validateQuickBookForm: function () {
        var me = this;
        var hasError = false;
        var checkedRoutePoint = me._$qBkMd.find('input[name="RoutePoint"][checked="checked"]');
        if (checkedRoutePoint.length != 2) {
            hasError = true;
            me._$qBkMd.find('div.warning-message').html('Điểm đi, điểm đến không chính xác, vui lòng kiểm tra lại.');
            me._$qBkMd.find('div.warning-message').show();
        }
        var fare = me._$qBkMd.find('input[name="Fare"]').val().toNum();
        var paymentType = me._$qBkMd.find('select[name="PaymentType"]').val();
        if (paymentType != 9 && fare == 0) {
            hasError = true;
            me._$qBkMd.find('div.warning-message').html('Giá vé không chính xác, vui lòng kiểm tra lại.');
            me._$qBkMd.find('div.warning-message').show();
        }
        // kiểm tra xem các ghế trong seat stack có cùng trạng thái đặt chỗ hay không?
        $.each(app.seatStack, function (k, v) {
            var tick = v._getCurrentTicket();
            if (tick._status != 1) {
                hasError = true;
                me._$qBkMd.find('div.warning-message').html('Đã có ghế thanh toán rồi, vui lòng kiểm tra lại.');
                me._$qBkMd.find('div.warning-message').show();
            }
        });

        return hasError;
    },
    _getFareQBook: function (tData, fromId, toId) {
        var self = this;
        var fares = self._prsFr(tData);
        var key = fromId + "|" + toId;
        var fare = fares[key];
        if (typeof fare == "undefined") return 0;
        return fare;
    },
    _prsFr: function (tData) {
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
    _closeQuickBookForm: function () {
        var me = this;
        me._$qBkMd.modal('hide');
        me._resetQuickBookModal();
    },
    _resetQuickBookModal: function () {
        var me = this;
        me._$qBkMd.find('input[name="StatusInfo"]').val(2);
        me._$qBkMd.find('input[name="NumClick"]').val(0);
        me._$qBkMd.find('input[name="Fare"][disabled="disabled"]').prop('disabled', false);
        me._$qBkMd.find('input[name="Note"][disabled="disabled"]').prop('disabled', false);
        me._$qBkMd.find('select[name="PaymentType"][disabled="disabled"]').prop('disabled', false);
        me._$qBkMd.find('div.warning-message').html('');
        me._$qBkMd.find('div.warning-message').hide();
    },
    _blockFormField: function () {
        var me = this;
        me._$qBkMd.find('input[name="Note"]').prop('disabled', false);
        me._$qBkMd.find('select[name="PaymentType"]').prop('disabled', false);
        me._$qBkMd.find('input[name="Fare"]').prop('disabled', false);
        me._$qBkMd.find('input[name="RoutePoint"]').prop('disabled', false);
        var ticketNotes = [];
        var ticketStatus = [];
        var ticketFares = [];
        var fromAreas = [];
        var toAreas = [];
        var blockFields = [];
        $.each(app.seatStack, function (k, v) {
            var tick = v._getCurrentTicket();
            ticketNotes.push(tick._note);
            ticketStatus.push(tick._status);
            ticketFares.push(tick._fare);
            fromAreas.push(tick.fromArea);
            toAreas.push(tick.toArea);
        });

        ticketNotes = ticketNotes.getUnique();
        if (ticketNotes.length > 1) {
            blockFields.push("Note");
        }
        ticketStatus = ticketStatus.getUnique();
        if (ticketStatus.length > 1) {
            blockFields.push("RoutePoint");
            blockFields.push("PaymentType");
        }
        ticketFares = ticketFares.getUnique();
        if (ticketFares.length > 1) {
            blockFields.push("Fare");
        }
        fromAreas = fromAreas.getUnique();
        toAreas = toAreas.getUnique();
        if (fromAreas.length > 1 || toAreas.length > 1) {
            blockFields.push("RoutePoint");
        }
        blockFields = blockFields.getUnique();
        $.each(blockFields, function (k, v) {
            switch (v) {
                case "Note":
                    me._$qBkMd.find('input[name="Note"]').prop('disabled', true);
                    break;
                case "Fare":
                    me._$qBkMd.find('input[name="Fare"]').prop('disabled', true);
                    break;
                case "RoutePoint":
                    me._$qBkMd.find('div.checkbox-route-point input[name="RoutePoint"]').prop('disabled', true);
                    break;
                case "PaymentType":
                    me._$qBkMd.find('select[name="PaymentType"]').prop('disabled', true);
                    break;
                default:
                    break;
            }
        });

        if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
            var firstPoint = me._$qBkMd.find('div.checkbox-route-point input[name="RoutePoint"]').first();
            if (app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                if (!firstPoint.is(':disabled')) {
                    firstPoint.attr('disabled', true);
                }
            }
        }
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
        });
    },
    _renderPaymentQuickBook: function () {
        var me = this;
        me._$qBkMd.find('select[name="PaymentType"]').empty();
        $.each(_dict._qBookPayment, function (k, v) {
            var $op = null;
            if (v[2] != 0) {
                $op = $('<option value="' + v[0] + '" />').html(v[1]['vi']);
                me._$qBkMd.find('select[name="PaymentType"]').append($op);
            }
        });
    },
    _renderRoutePoints: function (tData, routePoints, fromPoint, toPoint) {
        var me = this;
        me._$qBkMd.find('div.checkbox-route-point').empty();
        var startTime = tData.cTripTime;
        var startHour = parseInt(startTime.split(':')[0]);
        var startMinute = parseInt(startTime.split(':')[1]);
        $.each(routePoints, function (k, v) {
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
                time = me._cTripTime;
            } else {
                time = hourFomat + ":" + minuteFomat;
            }
            var $routePoint = $('<label class="checkbox-inline" />')
                .append($('<input type="checkbox" name="RoutePoint" data-point-id="' + v.Id + '"/>'))
                .append($('<b />').html(v.Code))
                .append($('<mark class="text-primary"/>').html(time));
            if (routePoints.length == 2) {
                $routePoint.addClass('hidden');
            }
            me._$qBkMd.find('div.checkbox-route-point').append($routePoint);
        });
        var fromId = 0;
        var toId = 0;
        if (tData.cDefaultFromId != 0) {
            fromId = tData.cDefaultFromId;
        }
        if (tData.cDefaultToId != 0) {
            toId = tData.cDefaultToId;
        }
        if (!$.isEmptyObject(fromPoint)) {
            fromId = fromPoint.Id;
        }
        if (!$.isEmptyObject(toPoint)) {
            toId = toPoint.Id;
        }
        if (fromId == 0 && toId == 0) {
            me._$qBkMd.find('div.checkbox-route-point input[name="RoutePoint"]').first().attr('checked', true);
            me._$qBkMd.find('div.checkbox-route-point input[name="RoutePoint"]').last().attr('checked', true);
        } else {
            me._$qBkMd.find('div.checkbox-route-point input[name="RoutePoint"][data-point-id="' + fromId + '"]').attr('checked', true);
            me._$qBkMd.find('div.checkbox-route-point input[name="RoutePoint"][data-point-id="' + toId + '"]').attr('checked', true);
        }
    },
    _renderSeatNoQuickBookDiv: function (data) {
        var me = this;
        var $ul = me._$qBkMd.find('ul#seat-no').empty();
        $.each(data, function (_, s) {
            $ul.append($('<li />').addClass('list-group-item').addClass(_dict._vc[Math.floor(Math.random() * _dict._vc.length)]).text(s));
        });
    },
    _initQuickBookFormData: function (tData) {
        var me = this;
        var seatNo = [];
        var totalFare = 0;
        var stopPoints = tData.data[tData.cTripIndex].StopPoints['data'];
        var fromPoint = {};
        var toPoint = {};
        var fare = 0;
        var ticketNotes = [];
        var note = "";
        var fromAreas = [];
        var toAreas = [];
        $.each(app.seatStack, function (i, v) {
            var tick = v._getCurrentTicket();
            ticketNotes.push(tick._note);
            fromAreas.push(tick.fromArea);
            toAreas.push(tick.toArea);
            seatNo.push(v._label);
            fare = tick._fare;
            totalFare += tick._fare;
        });
        ticketNotes = ticketNotes.getUnique();
        if (ticketNotes.length == 1) {
            note = ticketNotes[0];
        }
        fromAreas = fromAreas.getUnique();
        if (fromAreas.length == 1) {
            var indFrom = fromAreas[0].indexOf('~');
            var from = fromAreas[0].substr(indFrom + 1, fromAreas[0].length).split('|');
            fromPoint.Id = from[0];
            fromPoint.Type = from[1];
            fromPoint.Code = from[2];
            fromPoint.Name = from[3];
        }
        toAreas = toAreas.getUnique();
        if (toAreas.length == 1) {
            var indTo = toAreas[0].indexOf('~');
            var to = toAreas[0].substr(indTo + 1, toAreas[0].length).split('|');
            toPoint.Id = to[0];
            toPoint.Type = to[1];
            toPoint.Code = to[2];
            toPoint.Name = to[3];
        }
        var obj = {
            SeatNo: seatNo,
            Fare: fare.toMn(),
            TotalFare: totalFare.toMn(),
            DepartureDate: "Ngày khởi hành: " + tData.cTripDate.toFormatString('dd/mm/yyyy') + " - " + tData.cTripTime,
            RouteName: "Tuyến: " + tData.data[tData.cTripIndex].Name,
            RoutePoints: stopPoints,
            Note: note,
            FromPoint: fromPoint,
            ToPoint: toPoint
        }
        return obj;
    },

    _createQuickBookDiv: function () {
        var me = this;
        var $quickBookBody = $('<div class="panel-primary" />')
            .append($('<div class="panel-heading" />')
                .append($('<h3 class="panel-title" />').html("Đặt vé nhanh"))
            )
            .append($('<div class="panel-body" style="padding:15px !important;" />')
                .append($('<div class="alert alert-danger warning-message" role="alert" style="margin-bottom:10px;" />').css('display', 'none'))
                .append($('<input type="hidden" name="StatusInfo" value="2" />'))
                .append($('<input type="hidden" name="NumClick" value="0" />'))
                .append($('<ul id="seat-no" class="list-group" />'))
                .append($('<div class="clearfix" />'))
                .append($('<div class="row mt10" />')
                    .append($('<div class="col-md-12" />')
                        .append($('<label class="col-md-6 pl0" name="RouteName" type="label" />'))
                        .append($('<label class="col-md-6" name="DepartureDate" type="label" />'))
                    )
                    .append($('<div class="col-md-12 mt10 checkbox-route-point" />'))
                    .append($('<div class="col-md-6 mt10" />')
                        .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Giá vé"))
                        .append($('<div class="input-group" />')
                            .append($('<input type="text" name="Fare" class="form-control vblue fw700" value="" />'))
                            .append($('<div class="input-group-addon" />').html("đ"))
                        )
                    )
                    .append($('<div class="col-md-6 mt10" />')
                        .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Tổng tiền"))
                        .append($('<div class="input-group" />')
                            .append($('<input type="text" name="TotalFare" class="form-control vblue fw700" disabled="disabled" value="" />'))
                            .append($('<div class="input-group-addon" />').html("đ"))
                        )
                    )
                    .append($('<div class="clearfix" />'))
                    .append($('<div class="col-md-6 mt10" />')
                        .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Thanh toán"))
                        .append($('<div class="input-group col-md-8" />')
                            .append($('<select class="form-control" name="PaymentType" />'))
                        )
                    )
                    .append($('<div class="col-md-6 mt10" />')
                        .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Ghi chú"))
                        .append($('<div class="input-group col-md-8" />')
                            .append($('<input type="text" class="form-control" name="Note" value="" />'))
                        )
                    )
                    .append($('<div class="col-md-12 mt10" />')
                        .append($('<button class="btn btn-default close-qBook" type="button" />').html("Đóng"))
                    )
                )
            )
        ;

        // render button
        if (typeof _dict._qBookFormButton != "undefined") {
            $.each(_dict._qBookFormButton, function (k, l) {
                var $but = $('<button type="button" />').css("margin-right", "5px").addClass(l[1]).html(l[0]);
                $quickBookBody.find('button.close-qBook').parent().prepend($but);
            });
        }
        //Create a div for dialog and add to container element
        me._$qBkMd = $('<div />').addClass('modal fade pop-payment').attr('id', 'quick-book-popup')
            .attr('role', 'dialog')
            .attr('aria-hidden', 'true')
            .append(
                $('<div />').addClass('modal-dialog modal-md')
                .append($('<div />').addClass('modal-content')
                    .append($quickBookBody)
                )
            )
            .appendTo($('body'));
        
    },
})