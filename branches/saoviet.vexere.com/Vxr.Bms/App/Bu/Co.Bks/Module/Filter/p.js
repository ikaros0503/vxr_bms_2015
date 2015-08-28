/************************************************************************
* FILTER                                                                *
*************************************************************************/
(function ($) {
    //Reference to base object members
    var base = {
        _create: $.custom.vbooking.prototype._create
    };


    //extension members
    $.extend(true, $.custom.vbooking.prototype, {
        /************************************************************************
        * DEFAULT OPTIONS / EVENTS                                              *
        *************************************************************************/
        options: {

        },

        /************************************************************************
        * PRIVATE FIELDS                                                        *
        *************************************************************************/
        _$filterForm: null,
        _$BSfilterForm: null,
        _$voFilterForm: null,
        _$vvFilterForm: null,
        _$vcFilterForm: null,
        _$searchTicketFilter: null,

        _searchResult: [],
        _totalSearchResult: 0,
        _$filterSearchResult: null,

        _hasSearchPhone: false,

        /************************************************************************
        * CONSTRUCTOR AND INITIALIZATION METHODS                                *
        *************************************************************************/
        _create: function () {
            base._create.apply(this, arguments);
            if (!this.options.serviceUrl) {
                return;
            }
            //Create form
            this._createFilterForm();
            this._createBSFilterForm();
            this._createVOFilterForm();
            this._createVVFilterForm();
            this._createVCFilterForm();

            this._createXuatBenButton();
            //this._initEvent();
            var dict = $.vPrpRgts($('ul.vbooking-list'));
            $.vApplyRights(app.rights, dict);
            var dict2 = $.vPrpRgts($('div.vbooking-toolbar.filter'));
            $.vApplyRights(app.rights, dict2);

            var self = this;
            $("body").unbind("updateFilters").on("updateFilters", function (e, model) {
                self.updateFilters(model);
            });
        },

        updateFilters: function (model) {
            var self = this;
            self._cTripTime = model.tripTime;
            $("body").trigger("tripChangedWithoutReload", { CompId: model.compId, TripId: model.tripId, TripTime: model.tripTime });

            $("#FilterForm select[name=TripId]").val(model.tripId);
            var date = model.tripDate.split('-')[2] + "-" + model.tripDate.split('-')[1] + "-" + model.tripDate.split('-')[0];

            //$("#FilterForm input[name=DepartureDate]").datepicker('setDate', new Date(date));
            vfe('body', 'fSetDate', { value: new Date(date) });

            //$("#FilterForm select[name=TimeSlot]").val(model.tripTime);
            vfe('body', 'fSetTime', { value: model.tripTime });

            self._changeCTripId($("#FilterForm select[name=TripId]").val());
            self._changeCTripIndex($("#FilterForm select[name=TripId]").prop('selectedIndex'));
            self._changeCFromId(0);
            self._changeCToId(0);
            self._reloadStopPoints();

            //self._cTripTime = $("#FilterForm select[name=TimeSlot]").val();
            self._changeCTripTime(app.cTime);

            //self._changeCTripDate($("#FilterForm input[name=DepartureDate]").datepicker('getDate'));
            self._changeCTripDate(app.cDate);

            //self.reload();
            self._reloadTimeSlot();
            self._reloadTimeFromAndTo();
            //self._reloadBus();
            self._reloadFrame();
            self._reloadSheet();
            self._generateStageCode();
            self._changeCMaxStageCode(self._cStageCode);
            self._reloadAllowedSeats();
            self._reloadSheet();

            //Clear seat stack
            if (!app.fMoving) {
                vbf('resetSeatStack'); // Reset seat stack
                vbf('onClearSelectedItem'); // Clear selected items
            }

            if (_dict._availableSeatOn) {
                self._reloadAvailableSeat();
            }

            // reload default FromId, ToId
            if (typeof _dict._hasDefaultStagePerTrip != "undefined" && _dict._hasDefaultStagePerTrip) {
                if (typeof _dict._defaultStagePerTrip[$("#FilterForm select[name=TripId]").val()] != "undefined") {
                    var defaultStage = _dict._defaultStagePerTrip[$("#FilterForm select[name=TripId]").val()].split(',');
                    self._cDefaultFromId = parseInt(defaultStage[0]);
                    self._cDefaultToId = parseInt(defaultStage[1]);
                } else {
                    self._cDefaultFromId = self._cFromId;
                    self._cDefaultToId = self._cToId;
                }
            }
        },
        _initEvent: function () {
            var me = this;
            if (!me.eventInited) {
                me.eventInited = true;
                //$("body").on("compChanged", function (e, model) {

                //});
                //$("body").on("tripChanged", function (e, model) {

                //});

            }

        },

        _createFilterForm: function () {
            var self = this;
            //self._$filterForm = self._createForm(_dict._fForm[0], _dict._fForm[1], _dict._fForm[2], _dict._fForm[3]).appendTo(self._$toolbar);
            self._$filterForm = $('#FilterForm');
            self._bindEventOnFilterForm();
        },
        //Update By Thanh
        _createBSFilterForm: function () {
            var self = this;
            //self._$filterForm = self._createForm(_dict._fForm[0], _dict._fForm[1], _dict._fForm[2], _dict._fForm[3]).appendTo(self._$toolbar);
            self._$BSfilterForm = $('#BSFilterForm');
            self._bindEventOnBSFilterForm();
        },
        //End
        _createVOFilterForm: function () {
            var self = this;
            //self._$voFilterForm = self._createForm(_dict._ofForm[0], _dict._ofForm[1], _dict._ofForm[2], _dict._ofForm[3]).appendTo(self._$votoolbar);
            self._$voFilterForm = $('#VOFilterForm');
            self._bindEventOnVOFilterForm();
        },
        _createVVFilterForm: function () {
            var self = this;
            //self._$vvFilterForm = self._createForm(_dict._vfForm[0], _dict._vfForm[1], _dict._vfForm[2], _dict._vfForm[3]).appendTo(self._$vvtoolbar);
            self._$vvFilterForm = $('#VVFilterForm');
            self._bindEventOnVVFilterForm();
        },
        _createVCFilterForm: function () {
            var self = this;
            //self._$vcFilterForm = self._createForm(_dict._cfForm[0], _dict._cfForm[1], _dict._cfForm[2], _dict._cfForm[3]).appendTo(self._$vctoolbar);
            self._$vcFilterForm = $('#VCFilterForm');
            self._bindEventOnVCFilterForm();
        },

        /************************************************************************
        * MAIN FUNC                                                             *
        *************************************************************************/
        _changeCTripId: function (id) {
            this._cTripId = parseInt(id);
            //$('body').find('#bks select[name=TripId]').trigger('change');
        },
        _getCTripId: function () {
            return this._cTripId;
        },
        _changeCTripIndex: function (idx) {
            this._cTripIndex = parseInt(idx);
            //FlatObj.cRoute = this._data[this._cTripIndex];
            //FlatObj.SP = this._data[this._cTripIndex].StopPoints;
        },
        _getCTripIndex: function () {
            return this._cTripIndex;
        },
        _changeCFromId: function (id) {
            this._cFromId = parseInt(id);
        },
        _changeCToId: function (id) {
            this._cToId = parseInt(id);
        },
        _changeCStageCode: function (cd) {
            this._cStageCode = cd;
        },
        _changeCMaxStageCode: function (c) {
            this._cMaxStageCode = c;
        },
        _changeCTripDate: function (d) {
            this._cTripDate = d;
        },
        _changeCTripTime: function (t) {
            this._cTripTime = t;
            //FlatObj.cTrip = FlatObj.cRoute.Ts[FlatObj.W._cTripTime]; //Current Trip
            $("body").trigger('changeCTripTime', t);
        },
        _changeCTripBus: function (b) {
            this._cTripBus = parseInt(b);
        },
        _reloadFilter: function (args) {
            var self = this;
            if (!self._hasBookReturnTicket) {
                if (FlatObj.LDefTrip) {
                    if (args && args.t && !isNaN(args.t)) {
                        self._cTripId = parseInt(args.t);
                    } else {
                        if (vIsEstStr(app.rights)) {
                            var match = app.rights.match(/\~3\|1\|\d+/g);
                            if (match != null) {
                                var tripId = parseInt(match[match.length - 1].substring(match[match.length - 1].lastIndexOf('|') + 1));
                                if (!isNaN(tripId)) {
                                    self._cTripId = tripId;
                                }
                            } else {
                                self._cTripId = 0;
                            }
                        }
                    }
                    if (vIsEstStr(app.rights) && app.rights.indexOf($.rights.bBookPastTk.val) >= 0) {
                        self._rBookingOnPast = true;
                    }
                }
            }

            self._reloadTrip();
            //FlatObj.F
            self._reloadStopPoints();
            // load default FromId, ToId
            if (typeof _dict._hasDefaultStagePerTrip != "undefined" && _dict._hasDefaultStagePerTrip) {
                if (typeof _dict._defaultStagePerTrip[self._cTripId] != "undefined") {
                    var defaultStage = _dict._defaultStagePerTrip[self._cTripId].split(',');
                    self._cDefaultFromId = parseInt(defaultStage[0]);
                    self._cDefaultToId = parseInt(defaultStage[1]);
                } else {
                    self._cDefaultFromId = self._cFromId;
                    self._cDefaultToId = self._cToId;
                }
            }
            self._generateStageCode();
            self._changeCMaxStageCode(self._cStageCode);
            // reset _cTripTime để hỗ trợ chọn giờ gần nhất trên BKS
            if (args && args.h && moment(args.h, 'HH.mm').isValid) self._cTripTime = moment(args.h, 'HH.mm').format('HH:mm');
            else self._cTripTime = null;
            self._reloadTimeSlot();
            self._reloadTimeFromAndTo();
            if (_dict._availableSeatOn) {
                self._reloadAvailableSeat();
            }
            //self._reloadBus();

            self._reloadVOTrip();
            self._reloadVVTrip();
            self._reloadVCTrip();
        },
        _reloadTrip: function () {
            var self = this;
            var $sl = self._$filterForm.find('select[name=TripId]').empty();
            var hasTrip = false;
            $.each(self._data, function (_, v) {
                if (self._cTripId == v.Id) hasTrip = true;
            });
            //if (!hasTrip) self._changeCTripId(self._data[0].Id);
            $.each(self._data, function (i, v) {
                if (typeof _dict._hasBlockTripByBranch != "undefined" && _dict._hasBlockTripByBranch && typeof _dict._blockTripByBranch != "undefined") {
                    if (typeof _dict._blockTripByBranch[app.aid] != "undefined" && _dict._blockTripByBranch[app.aid].indexOf(v.Id) != -1) {
                        return;
                    }
                }
                var $op = $('<option />', { text: v.Name, value: v.Id });
                if (hasTrip && self._cTripId > 0) {//Load Current TripId
                    if (v.Id == self._cTripId) {
                        $op.attr('selected', true);
                        self._changeCTripIndex(i);
                    }
                } else if (i == 0) { //No current TripId=>Default 0
                    $op.attr('selected', true);
                    self._changeCTripIndex(i);
                    self._changeCTripId(v.Id);
                }
                $sl.append($op);
            });

            if ($sl.find('option:selected').length <= 0) {
                $sl.find('option').first().attr('selected', true);
                self._changeCTripTime($sl.val());
                self._changeCTripIndex(0);

            }

            //self._$filterForm.find('input[name="DepartureDate"]').val(self._cTripDate.toFormatString('DD dd-mm-yyyy'));
            vfe('body', 'fSetDate', { value: self._cTripDate });

        },
        _getStopPoints: function () {
            var self = this;
            var stopPoints = self._data[self._cTripIndex].StopPoints;
            return stopPoints;
        },
        _reloadStopPoints: function () {
            //if (app.rights.indexOf('5|10069|1') != -1) {
            var self = this;
            var $cbbFromPoint = self._$filterForm.find('select[name=FromPoint]').empty();
            var $cbbToPoint = self._$filterForm.find('select[name=ToPoint]').empty();
            if (app.oRights.StageEnable) {
                $("#StageModule").removeClass("hidden");
            }
            if (!self._data[self._cTripIndex]) {
                return;
            }
            //filterStopPoints;
            var stopPoints = self._data[self._cTripIndex].StopPoints;
            var i = 0;
            var max = stopPoints.data.length - 1;
            //Default FromId - ToId Status
            if (self._cFromId == 0) {
                if (stopPoints.data[0] != null) self._cFromId = parseInt(stopPoints.data[0].Id);
            }
            if (self._cToId == 0) {
                if (stopPoints.data[max] != null) self._cToId = parseInt(stopPoints.data[max].Id);
            }
            else if (self._cFromId == self._cToId) {
                var j = stopPoints.idx[self._cFromId];
                self._cToId = parseInt(stopPoints.data[j + 1].Id);
            }
            //Load From - To Index
            var fromIndex = stopPoints.idx[self._cFromId];
            var toIndex = stopPoints.idx[self._cToId];
            if (toIndex <= fromIndex) {
                toIndex = fromIndex + 1;
                self._cToId = stopPoints.data[toIndex].Id;
            }

            if (app.oRights.StageEnable) {
                $.each(stopPoints.data, function (idx, v) {
                    //Combobox From
                    if (i < toIndex) {
                        var $opFrom = $('<option />', { text: "_", value: v.Id });
                        if (v.Id == self._cFromId) $opFrom.attr('selected', true);
                        $cbbFromPoint.append($opFrom);
                    }
                    //Combobox To
                    if (i > fromIndex) {
                        var $opTo = $('<option />', { text: "_", value: v.Id });
                        if (v.Id == self._cToId) $opTo.attr('selected', true);
                        $cbbToPoint.append($opTo);
                    }
                    i++;
                });
            }

            //}
        },
        _reloadTimeFromAndTo: function () {
            var self = this;
            var $cbbFromPoint = self._$filterForm.find('select[name=FromPoint]');
            var $cbbToPoint = self._$filterForm.find('select[name=ToPoint]');
            if (app.oRights.StageEnable) {
                $("#StageModule").removeClass("hidden");
            }
            if (!self._data[self._cTripIndex]) {
                return;
            }
            //filterStopPoints;
            var stopPoints = self._data[self._cTripIndex].StopPoints;
            var i = 0;
            var max = stopPoints.data.length - 1;
            //Default FromId - ToId Status
            var fromIndex = stopPoints.idx[self._cFromId];
            var toIndex = stopPoints.idx[self._cToId];
            if (toIndex <= fromIndex) {
                toIndex = fromIndex + 1;
                self._cToId = stopPoints.data[toIndex].Id;
            }
            //var dTime = self._$filterForm.find('select[name=TimeSlot] option:selected').val().split(':');
            var dTime = app.cTime.split(':');
            var dTimeHour = parseInt(dTime[0]);
            var dTimeMinute = parseInt(dTime[1]);
            $.each(stopPoints.data, function (idx, v) {
                dTimeHour += v.Hour;
                dTimeMinute += v.Minute;
                if (dTimeMinute >= 60) {
                    dTimeMinute -= 60;
                    dTimeHour += 1;
                }
                dTimeHour = dTimeHour % 24;
                //Combobox From
                if (i < max) {
                    var $opFrom = $cbbFromPoint.find('option[value="' + v.Id + '"]');
                    $opFrom.html(v.Code + " - " + v.Name + " - " + dTimeHour + ":" + (dTimeMinute < 10 ? '0' : '') + dTimeMinute);
                    //if (v.Id == self._cFromId) $opFrom.attr('selected', true);
                    //$cbbFromPoint.append($opFrom);
                }

                //Combobox To
                if (i > fromIndex) {
                    var $opTo = $cbbToPoint.find('option[value="' + v.Id + '"]');
                    $opTo.html(v.Code + " - " + v.Name + " - " + dTimeHour + ":" + (dTimeMinute < 10 ? '0' : '') + dTimeMinute);
                    //if (v.Id == self._cToId) $opTo.attr('selected', true);
                    //$cbbToPoint.append($opTo);

                }
                i++;

            });
        },
        _reloadTimeSlot: function () {
            var me = this;
            vfe('body', 'fReloadTimeSlot', {
                value: me
            });

            //var self = this;
            //var $ts = self._$filterForm.find('select[name=TimeSlot]').empty();
            //var d = new Date(); d.setSeconds(0);
            //var od = new Date(self._cTripDate.getTime()); od.setSeconds(0);

            ////Order time slot
            //var timeSlot = {};
            //if (self._data[self._cTripIndex]) {
            //    var keys = Object.keys(self._data[self._cTripIndex].Ts), i, len = keys.length;
            //    keys.sort();
            //    for (i = 0; i < len; i++) {
            //        // block BKS by time
            //        if (app.rights.indexOf($.rights.bUBlockBks.val) == -1) {
            //            if (typeof _dict._hasBlockBKSByTime != "undefined" && _dict._hasBlockBKSByTime
            //                && typeof _dict._dayBlockBKS != "undefined" && typeof _dict._hourBlockBKS != "undefined" && typeof _dict._minuteBlockBKS != "undefined") {
            //                var dayConf = _dict._dayBlockBKS;
            //                var hourConf = _dict._hourBlockBKS;
            //                var minuteConf = _dict._minuteBlockBKS;
            //                var now = new Date();
            //                now.setDate(now.getDate() - dayConf);
            //                now.setHours(now.getHours() - hourConf);
            //                now.setMinutes(now.getMinutes() - minuteConf);
            //                if (keys[i] != null) {
            //                    var split = keys[i].split(':');
            //                    var departHour = parseInt(split[0]);
            //                    var departMinute = parseInt(split[1]);
            //                    od.setHours(departHour);
            //                    od.setMinutes(departMinute);
            //                    if (now <= od) {
            //                        timeSlot[keys[i]] = self._data[self._cTripIndex].Ts[keys[i]];
            //                    }
            //                }
            //            } else {
            //                timeSlot[keys[i]] = self._data[self._cTripIndex].Ts[keys[i]];
            //            }
            //        } else {
            //            timeSlot[keys[i]] = self._data[self._cTripIndex].Ts[keys[i]];
            //        }
            //    }
            //}


            //var hasSelected = false;
            //$.each(timeSlot, function (k, ts) {
            //    if (ts[0].S != 3) {
            //        var text = k;
            //        //var tc = "";
            //        if (ts[0].S == 2) {
            //            text += " - Tăng cường";
            //        }
            //        //var bookedSeats = ts[0].BS;
            //        //var totalSeats = ts[0].TS;
            //        //var bookedSeatsText = "";
            //        //if (bookedSeats != null && totalSeats != null) {
            //        //    bookedSeatsText = " - " + bookedSeats + "/" + totalSeats;
            //        //}
            //        //text = k + bookedSeatsText + tc;
            //        var $op = $('<option />', { text: text, value: k });
            //        if (!hasSelected) {
            //            var tmp = k.split(':');
            //            od.setHours(parseInt(tmp[0])); od.setMinutes(parseInt(tmp[1]));
            //            if (self._cTripTime != null) {
            //                if (k == self._cTripTime) {
            //                    $op.attr('selected', true);
            //                    hasSelected = true;
            //                }
            //            } else if (od > d) {
            //                $op.attr('selected', true);
            //                hasSelected = true;
            //            }
            //        }
            //        $ts.append($op);
            //    }
            //});

            //if (!hasSelected) {
            //    var $fo = $ts.find('option:first-child');
            //    $fo.attr('selected', true);
            //    self._changeCTripTime($fo.val());
            //}

            //if ($ts.val() != self._cTripTime) {
            //    self._changeCTripTime($ts.val());
            //}
        },
        _reloadBus: function () {
            var self = this;
            var $b = self._$filterForm.find('select[name=Bus]').empty();
            var i = 0;

            $.each(self._data[self._cTripIndex].Ts[self._cTripTime], function (k, ts) {
                if (typeof ts != "undefined" && ts != null && ts.S != 3) {
                    var $op = $('<option />', { text: "Bus " + k, value: k });
                    if (self._cTripBus != null) {
                        if (k == self._cTripBus) {
                            $op.attr('selected', true);
                        }
                    } else if (i == 0) {
                        $op.attr('selected', true);
                        self._changeCTripBus(k);
                    }
                    $b.append($op);
                    i++;
                }
            });

            if ($b.val() != self._cTripBus) {
                self._changeCTripBus($b.val());
            }
        },
        _search: function (text, byCode) {
            var self = this;
            //Reset seat stack
            vbf('onClearSelectedItem'); // Clear selected items
            vbf('resetSeatStack'); // Reset seat stack
            if (vIsEstStr(text)) {
                var keyword = "";
                if (typeof byCode == "undefined" || !byCode) {
                    keyword = $.trim(text).toLowerCase();
                    if (typeof self._cphoneSt[keyword] != "undefined" && self._cphoneSt[keyword].length > 0) {
                        $.each(self._cphoneSt[keyword], function (_, s) {
                            if (!s.disableClickEvent) {
                                var obj = self._$sheet.find('.seat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                if (!self._grid) {
                                    obj = self._$sheet.find('.lseat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                }
                                self._updateSeatStack(obj, s);
                                if (!FlatObj.HScrolled && FlatObj.STBPhone) {
                                    $('html, body').animate({
                                        scrollTop: obj.offset().top
                                    }, 500);
                                    FlatObj.STBPhone = false;
                                    FlatObj.HScrolled = true;
                                }
                            }
                        });
                        self._selectedPhone = keyword;
                    }
                } else {   //Group by code
                    keyword = $.trim(text).toUpperCase();
                    if (typeof self._cCodeSt[keyword] != "undefined" && self._cCodeSt[keyword].length > 0) {
                        $.each(self._cCodeSt[keyword], function (_, s) {
                            if (!s.disableClickEvent) {
                                var obj = self._$sheet.find('.seat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                if (!self._grid) {
                                    obj = self._$sheet.find('.lseat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                }
                                self._updateSeatStack(obj, s);
                                if (!FlatObj.HScrolled && FlatObj.STBPhone) {
                                    $('html, body').animate({
                                        scrollTop: obj.offset().top
                                    }, 500);
                                    FlatObj.STBPhone = false;
                                    FlatObj.HScrolled = true;
                                }
                            }
                        });
                        self._selectedCode = keyword;
                    }
                }
            }
        },
        _searchCancelled: function (text, byCode) {
            var self = this;
            //Reset seat stack
            vbf('onClearSelectedItem'); // Clear selected items
            vbf('resetSeatStack'); // Reset seat stack
            var keyword = "";
            var found = false;
            if (vIsEstStr(text)) {
                if (typeof byCode == "undefined" || !byCode) { // search by phone number
                    keyword = $.trim(text).toLowerCase();
                    found = false;
                    $.each(self._c, function (_, c) {
                        if (typeof c != "undefined" && c != null) {
                            $.each(c, function (__, s) {
                                if (typeof s != "undefined" && s != null) {
                                    var t = s._getCurrentTicket();
                                    if (!$.isEmptyObject(t)) {
                                        var cphone = t._getDefaultPhoneNumber();
                                        if (cphone == keyword) {
                                            var obj = self._$cancelSheet.find('.seat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                            if (!self._grid) {
                                                obj = self._$cancelSheet.find('.lseat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                            }
                                            self._updateSeatStack(obj, s);
                                            if (!FlatObj.HScrolled && FlatObj.STBPhone) {
                                                $('html, body').animate({
                                                    scrollTop: obj.offset().top
                                                }, 500);
                                                FlatObj.STBPhone = false;
                                                FlatObj.HScrolled = true;
                                            }
                                            found = true;
                                        }
                                    }
                                }
                            });
                        }
                    });
                    if (found) {
                        self._selectedPhone = keyword;
                    }
                } else {  // search by ticket code
                    keyword = $.trim(text).toUpperCase();
                    found = false;
                    $.each(self._c, function (_, c) {
                        if (typeof c != "undefined" && c != null) {
                            $.each(c, function (__, s) {
                                if (typeof s != "undefined" && s != null) {
                                    var t = s._getCurrentTicket();
                                    if (!$.isEmptyObject(t)) {
                                        var cCode = t._getTicketCode();
                                        if (cCode == keyword) {
                                            var obj = self._$cancelSheet.find('.seat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                            if (!self._grid) {
                                                obj = self._$cancelSheet.find('.lseat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                            }
                                            self._updateSeatStack(obj, s);
                                            if (!FlatObj.HScrolled && FlatObj.STBPhone) {
                                                $('html, body').animate({
                                                    scrollTop: obj.offset().top
                                                }, 500);
                                                FlatObj.HScrolled = true;
                                                FlatObj.STBPhone = false;
                                            }
                                            found = true;
                                        }
                                    }
                                }
                            });
                        }
                    });
                    if (found) {
                        self._selectedCode = keyword;
                    }
                }
            }
        },
        _reloadVOTrip: function () {
            var self = this;
            var $sl = self._$voFilterForm.find('select[name=TripId]').empty();
            $.each(self._data, function (i, v) {
                if (i == 0) {
                    $sl.append($('<option />', { text: v.Name, value: v.Id }).attr('selected', true));
                    self._changeCVOTripId(v.Id);
                } else {
                    $sl.append($('<option />', { text: v.Name, value: v.Id }));
                }
            });
        },
        _reloadVVTrip: function () {
            var self = this;
            var $sl2 = self._$vvFilterForm.find('select[name=TripId]').empty();
            $.each(self._data, function (i, v) {
                if (i == 0) {
                    $sl2.append($('<option />', { text: v.Name, value: v.Id }).attr('selected', true));
                    self._changeCVVTripId(v.Id);
                } else {
                    $sl2.append($('<option />', { text: v.Name, value: v.Id }));
                }
            });
        },
        _reloadVCTrip: function () {
            var self = this;
            var $sl = self._$vcFilterForm.find('select[name=TripId]').empty();
            $.each(self._data, function (i, v) {
                if (i == 0) {
                    $sl.append($('<option />', { text: v.Name, value: v.Id }).attr('selected', true));
                    self._changeCVCTripId(v.Id);
                } else {
                    $sl.append($('<option />', { text: v.Name, value: v.Id }));
                }
            });
        },

        _changeCVOTripId: function (id) {
            this._cVOTripId = parseInt(id);
        },
        _changeCVVTripId: function (id) {
            this._cVVTripId = parseInt(id);
        },
        _changeCVCTripId: function (id) {
            //this._cVCTripId = parseInt(id);
            vbf('onChangeVCTrip', {
                value: parseInt(id)
            });
        },

        _isStageBooking: function () {
            var self = this;
            return self._cStageCode < self._cMaxStageCode;
        },

        reloadAll: function () {
            var self = this;
            self._reloadFrame();
            self._generateStageCode();
            //self._changeCMaxStageCode(self._cStageCode); ==>does n't use this function in there
            self._reloadSheet();
            self._reloadStopPoints();
            self._reloadTimeFromAndTo();
            //Clear seat stack
            if (!app.fMoving) {
                vbf('resetSeatStack'); // Reset seat stack
                vbf('onClearSelectedItem'); // Clear selected items
            }
        },

        selectStage: function (fromId, toId) {
            var me = this;
            var $form = me._$filterForm;
            me._changeCFromId(fromId);
            me._changeCToId(toId);
            $form.find('select[name=FromPoint]').val(fromId);
            $form.find('select[name=ToPoint]').val(toId);
            me.reloadAll();
        },
        //Update by Thanh
        _bindEventOnBSFilterForm: function () {
            var self = this;
            var cd = new Date();
            var $form = self._$BSfilterForm;
            $form.find('#calendar_drown').datepicker({
                dateFormat: 'dd-mm-yy',
                defaultDate: cd,
                onSelect: function (date) {
                    $form.find('button').html(date);
                }
            }).hide();
            $form.find('button').on('click', function () {
                $('#calendar_drown').hide();
            });
        },

        //End

        //Filter form
        _bindEventOnFilterForm: function () {
            var me = this;
            var cd = new Date();
            var $form = me._$filterForm;

            $form.find('input.datepicker').not('[readonly]').datepicker({
                dateFormat: 'DD dd-mm-yy',
                defaultDate: cd,
                beforeShowDay: function (date) {
                    if (app.rights.indexOf($.rights.bUBlockBks.val) == -1) {
                        if (typeof _dict._hasBlockBKSByTime != "undefined" && _dict._hasBlockBKSByTime
                            && typeof _dict._dayBlockBKS != "undefined" && typeof _dict._hourBlockBKS != "undefined") {
                            var $return = true;
                            var $returnclass = "available";
                            var now = new Date();
                            var nowHour = now.getHours();
                            var dayConf = _dict._dayBlockBKS;
                            var hourConf = _dict._hourBlockBKS;
                            if (nowHour - hourConf < 0) {
                                dayConf += 1;
                            }
                            now.setDate(now.getDate() - dayConf);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            if (date < now) {
                                $return = false;
                                $returnclass = "unavailable";
                            }
                            return [$return, $returnclass];
                        }
                    }
                    return [true, "available"];
                }
            }).val(cd.toFormatString('DD dd-mm-yyyy'));

            $form.find('input.datepicker').not('[readonly]').on('focus', function () {
                var selector = "#ui-datepicker-div td[data-month=" + me._cTripDate.getMonth() + "][data-year=" + me._cTripDate.getFullYear() + "]";
                $(selector + " a").filter(function() {
                    return $(this).text() == me._cTripDate.getDate();
                }).addClass("ui-state-default ui-state-active");
            });

            me._bindEventOnCalendarIcon();

            $form.find('button').each(function (_, b) {
                if ($(b).hasClass('btn-print')) {
                    $(b).unbind().on('click', function (e) {
                        e.preventDefault();
                        $('body').trigger('fPrintExcuse', me);
                    });
                } else if ($(b).hasClass('btn-refresh')) {
                    $(b).unbind().on('click', function (e) {
                        e.preventDefault();
                        oRq.cEl = $(this);
                        oRq.cLType = 1;
                        oRq.cKey = 'refresh';
                        oRq.cAType = 2;
                        oRq.iAc = true;
                        $('button.btn-thong-ke').removeClass('active');
                        $(this).find('i').addClass('glyphicon-refresh-animate');
                        if (_dict._availableSeatOn) {
                            me._reloadAvailableSeat();
                        }
                        vbf('resetSeatStack'); // Reset seat stack
                        me._clearSelectedItem();

                        me._reloadSheet();
                        $(this).find('i').removeClass('glyphicon-refresh-animate');
                    });
                } else if ($(b).hasClass('btn-pickup')) {
                    $(b).unbind().on('click', function (e) {
                        e.preventDefault();
                        me._isOrderring = true;
                        me._reloadSheet();
                        $('.select-layout > button').removeClass('active');
                        $('button.btn-thong-ke').removeClass('active');
                        //self._renderPickupTicket();
                        //if (self._hasMergeTransfer()) {
                        //    self._reloadMergeTransferTicket();
                        //}
                        //self._renderTransferTicket();
                    });
                } else if ($(b).hasClass('btn-backup')) {
                    $(b).unbind().on('click', function (e) {
                        e.preventDefault();
                        $('button.btn-thong-ke').removeClass('active');
                        me.backupBKS($(b));
                        $(b).attr('disabled', 'disabled');
                    });
                } else if ($(b).hasClass('btn-xuat-ben')) {
                    $(b).unbind().on('click', function (e) {
                        e.preventDefault();
                        $("#FilterForm .btn-refresh").trigger("click");
                        $('button.btn-thong-ke').removeClass('active');
                        me._createXuatBenDialogDiv();
                    });
                } else if ($(b).hasClass('btn-thong-ke')) {
                    $(b).unbind().on('click', function (e) {
                        if (!$(this).hasClass('active')) {
                            e.preventDefault();
                            $(this).addClass('active');
                            $('.select-layout > button').removeClass('active');
                            //me._thongKeTheoChuyen();
                            vfe('body', 'onShowStatistic', {
                                tDate: me._cTripDate,
                                tTime: me._cTripTime,
                                tIndex: me._cTripIndex,
                                tData: me._data[me._cTripIndex]
                            });
                        }
                    });
                }
            });

            vev('body', 'fTripChange', function (e) {
                //Update Status
                var newTripId = e.d.value;
                $("tr.jtable-data-row").removeClass("jtable-row-selected");
                $("tr.jtable-data-row[data-record-key=" + newTripId + "]").addClass("jtable-row-selected");

                me._changeCTripId(newTripId);
                me._changeCTripIndex(e.d.selectedIndex);
                me._changeCFromId(0);
                me._changeCToId(0);
                me._reloadStopPoints();
                // gán _cTripTime = null để chọn lại khung giờ gần nhất với giờ hiện tại


                //self._cTripTime = null;

                me._reloadTimeSlot();
                me._reloadTimeFromAndTo();
                //self._reloadBus();
                me._reloadFrame();
                me._generateStageCode();
                me._changeCMaxStageCode(me._cStageCode);
                me._reloadAllowedSeats();
                me._reloadSheet();

                //Clear seat stack
                if (!me._fMoving) {
                    vbf('resetSeatStack'); // Reset seat stack
                    me._clearSelectedItem();
                }

                if (_dict._availableSeatOn) {
                    me._reloadAvailableSeat();
                }

                // reload default FromId, ToId
                if (typeof _dict._hasDefaultStagePerTrip != "undefined" && _dict._hasDefaultStagePerTrip) {
                    if (typeof _dict._defaultStagePerTrip[newTripId] != "undefined") {
                        var defaultStage = _dict._defaultStagePerTrip[newTripId].split(',');
                        me._cDefaultFromId = parseInt(defaultStage[0]);
                        me._cDefaultToId = parseInt(defaultStage[1]);
                    } else {
                        me._cDefaultFromId = me._cFromId;
                        me._cDefaultToId = me._cToId;
                    }
                }
            });
            $form.find('select[name=FromPoint]').on('change', function () {

                me._changeCFromId(this.value);
                me.reloadAll();

            });
            $form.find('select[name=ToPoint]').on('change', function () {

                me._changeCToId(this.value);
                me.reloadAll();

            });

            vev('body', 'fDateChange', function (ev) {
                // reset lại FTripGetTrip
                FlatObj.FTripGetTrip = false;
                //Không cần reload lại StopPoints...

                me._changeCTripDate(app.cDate);
                //Reset current timeslot and bus
                if (!me._hasSearchPhone) {
                    me._cTripTime = null;
                    me._cTripBus = 0;
                }
                me.reload();

                //Clear seat stack
                if (!me._fMoving) {
                    vbf('resetSeatStack'); // Reset seat stack
                    me._clearSelectedItem();
                }
            });

            vev('body', 'doChangeCTripTime', function (ev) {
                me._changeCTripTime(ev.d.value);
            });

            //End Update
            vev('body', 'fTimeChange', function (ev) {
                //Không cần reload lại StopPoints...
                me._changeCTripTime(ev.d.value);
                //self._reloadBus();
                me._reloadFrame();
                me._reloadSheet();

                //Clear seat stack
                if (!me._fMoving) {
                    vbf('resetSeatStack'); // Reset seat stack
                    me._clearSelectedItem();
                }
                // reload lại filter TimeSlot khi sử dụng block BKS sau một khoảng thời gian
                me._reloadTimeSlot();
                me._reloadTimeFromAndTo();
                if (_dict._availableSeatOn) {
                    me._reloadAvailableSeat();
                }
            });
            $form.find('select[name=Bus]').on('change', function () {
                me._changeCTripBus(this.value);
                me._reloadFrame();
                me._reloadSheet();

                //Clear seat stack
                if (!me._fMoving) {
                    vbf('resetSeatStack'); // Reset seat stack
                    me._clearSelectedItem();
                }
            });

            vbv('doSearchResultSelected', function (e) {
                var d = e.d, tripId = me._cTripId, tripIdRecord = d.tId, tripDateRecord = d.tDate;
                var tripTimeRecord = d.tTime, phoneRecord = d.phone, isCanceled = d.isCanceled;
                if (tripIdRecord != tripId) {
                    me._changeCTripId(tripIdRecord);
                    me._$filterForm.find('select[name=TripId]').val(tripIdRecord);
                    $.each(me._$filterForm.find('select[name=TripId] option'), function (k, v) {
                        if ($(v).attr('value') == tripIdRecord) {
                            me._changeCTripIndex(k);
                        }
                    });
                }
                me._changeCTripDate(vPrsDt(tripDateRecord));

                vfe('body', 'fSetDate', { value: vPrsDt(tripDateRecord) });

                me._changeCTripTime(tripTimeRecord);

                vfe('body', 'fSetTime', { value: tripTimeRecord });

                //Show BKS
                ($('a[data-tab=bks]', 'ul.vbooking-list').trigger('click'));

                //Seat has search
                me._hasSearchPhone = true;
                me._changeCFromId(0);
                me._changeCToId(0);
                me._reloadStopPoints();
                me._reloadTimeSlot();
                me._reloadTimeFromAndTo();
                if (_dict._availableSeatOn) {
                    me._reloadAvailableSeat();
                }
                me._reloadFrame();
                me._generateStageCode();
                me._changeCMaxStageCode(me._cStageCode);


                var afterReloadSheet = function () {
                    vbv('onSetSearchIP', { value: "" });
                    if (isCanceled == "isCancelled") {
                        if (typeof code == 'undefined')
                            me._searchCancelled(phoneRecord, false);
                        else {
                            me._searchCancelled(code, true);
                        }
                    } else {
                        if (typeof code == 'undefined')
                            me._search(phoneRecord, false);
                        else {
                            me._search(code, true);
                        }
                    }
                }
                me._reloadSheet(afterReloadSheet);
                me._reloadAllowedSeats();
                me._reloadData();

                // reload default FromId, ToId
                if (typeof _dict._hasDefaultStagePerTrip != "undefined" && _dict._hasDefaultStagePerTrip) {
                    if (typeof _dict._defaultStagePerTrip[tripIdRecord] != "undefined") {
                        var defaultStage = _dict._defaultStagePerTrip[tripIdRecord].split(',');
                        me._cDefaultFromId = parseInt(defaultStage[0]);
                        me._cDefaultToId = parseInt(defaultStage[1]);
                    } else {
                        me._cDefaultFromId = me._cFromId;
                        me._cDefaultToId = me._cToId;
                    }
                }
                me._reloadVOTrip();
                me._reloadVVTrip();
                me._reloadVCTrip();
            });

            vbv('doSearchBoxFocused', function () {
                if (!me._fMoving) {
                    //Reset seat stack
                    me._clearSelectedItem();
                    vbf('resetSeatStack'); // Reset seat stack
                }
            });
            //me._$searchTicketFilter = $('input[name=Keyword]');
            //me._$searchTicketFilter
            //    .focus(function() {
            //        if (!me._fMoving) {
            //            //Reset seat stack
            //            me._clearSelectedItem();
            //            vbf('resetSeatStack'); // Reset seat stack
            //        }
            //    });
            //.keyup(function (e) {
            //    if (this.value.length == 6) {  //search code
            //        e.preventDefault();
            //        e.stopPropagation();
            //        me._searchTicket(this.value, true);
            //        //if (self._$searchTicketFilter.parent().find('div.search-result').find('ul.search-items').length <= 0) {
            //        //    //Không tìm thấy mã vé thì search số đt
            //        //    self._searchTicket(this.value);
            //        //};
            //    }
            //    else
            //        if (vIsNumKey(e)) {
            //            //if (this.value.length >= 6) {

            //            if (this.value.length == 3 || this.value.length >= 6) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                me._searchTicket(this.value);
            //            } else {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                me._clearSearchResult();
            //            }
            //        } else
            //            if (_dict._arrows.indexOf(e.keyCode) == -1) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                me._clearSearchResult();
            //            }
            //});
            //me._$searchTicketFilter.bind('paste', function (e) {
            //    this.value = e.originalEvent.clipboardData.getData('Text');
            //    if ((this.value.length == 6 || this.value.length == 10 || this.value.length == 11)) {
            //        e.preventDefault();
            //        e.stopPropagation();
            //        if (this.value.length == 6) {
            //            me._searchTicket(this.value, true);
            //        }
            //        else {
            //            if (!isNaN(this.value)) me._searchTicket(this.value);
            //        }
            //    } else {
            //        e.preventDefault();
            //        e.stopPropagation();
            //        me._clearSearchResult();
            //    }
            //    me._$searchTicketFilter.blur();
            //});
        },
        _bindEventOnCalendarIcon: function () {
            var self = this;
            var $form = self._$filterForm;
            $form.find('.glyphicon-calendar').parent().on('click', function () {
                $(this).prev().datepicker('show');
            });
        },
        //_bindEventOnDrowList: function () {
        //    var self = this;
        //    var $form = self._$filterForm;
        //    $form.find('.glyphicon-calendar').parent().on('click', function () {
        //        $(this).prev().datepicker('show');
        //    });
        //},
        _bindEventOnVOFilterForm: function () {
            var self = this;
            var $form = self._$voFilterForm;
            $form.find('select[name=TripId]').on('change', function () {
                self._changeCVOTripId(this.value);
                self._reloadVO();
            });
        },
        _bindEventOnVVFilterForm: function () {
            var self = this;
            var $form = self._$vvFilterForm;
            $form.find('select[name=TripId]').on('change', function () {
                self._changeCVVTripId(this.value);
                self._reloadVV();
            });
        },
        _bindEventOnVCFilterForm: function () {
            var self = this;
            var $form = self._$vcFilterForm;
            $form.find('select[name=TripId]').on('change', function () {
                self._changeCVCTripId(this.value);
                self._reloadVC();
            });
        },

        /************************************************************************
        * SEARCH FUNC                                                             *
        *************************************************************************/
        //_searchTicket: function (text, byCode) {
        //    var self = this;

        //    if (app.module.toLowerCase() == "bks") {
        //        var obj = self._createSearchTicketObj(text, byCode);
        //        var completeSearchTicket = function (u, r, l, t) {
        //            if (u != 1) return;
        //            //Clear search result
        //            self._clearSearchResult();
        //            if (l > 0) {
        //                //Map ticket to seat matrix
        //                self._mapSearchResult(r, t);
        //            } 

        //            //Render UI
        //            self._renderSearchResult(byCode);
        //            self._bindEventOnSearchResult();

        //            // reset scrolled property
        //            FlatObj.HScrolled = false;
        //            FlatObj.STBPhone = true;
        //        };
        //        //Submit query
        //        self._submitAction(obj, completeSearchTicket);
        //    } else {
        //        var data = {};
        //        var items = [];
        //        var proOrderobj = self._crProOrderObj(text);
        //        var requestSuccess = function (u, r, l, t) {
        //            if (l > 0) {
        //                $.each(r, function (index, value) {
        //                    var itemConvert = self._convertDbIntoSearchPhone(value, text);
        //                    items.push(itemConvert);
        //                });
        //            }
        //            data.listResult = items;
        //            data.totalItems = items.length;
        //        };

        //        self._submitAction(proOrderobj, requestSuccess);
        //        var htmlProduct = $.getHtml('search-phone', data);

        //        //Clear search result
        //        self._clearSearchResult();

        //        self._$searchTicketFilter.parent().append(htmlProduct);
        //        var li = self._$searchTicketFilter.parent().find('li');
        //        li.on('click', function (e) {
        //            e.preventDefault();
        //            e.stopPropagation();
        //            var proId = $(this).attr('data-proid');
        //            var tId = $(this).attr('data-tripid');
        //            var tTime = $(this).attr('data-triptime');
        //            var tDate = $(this).attr('data-tripdate');
        //            var tOView = $(this).attr('data-typeofview');
        //            $('#product-content').product("load", {
        //                proId: proId,
        //                pIndex: 1,
        //                pSize: 10,
        //                tId: tId,
        //                tTime: tTime,
        //                tDate: tDate,
        //                tOView: tOView
        //            });
        //            //Clear search result
        //            self._clearSearchResult();
        //            self._$searchTicketFilter.val('');
        //        }).hover(function (e) {
        //            li.removeClass('selected');
        //            $(this).addClass('selected');
        //        });
        //    }
        //},
        //_crProOrderObj: function (phone) {
        //    var obj = {}
        //    obj._a = "fGetProductOrder";
        //    obj._c = {
        //        PickupInfo: "($x like N'%" + phone + "%' or DropOffInfo like N'%" + phone + "%') order by IsPrgCreatedDate desc",
        //    }
        //    obj._f = "Id,TripTime,TripDate,PickupInfo,DropOffInfo,Fare,Status,TripId,AgentInfo,ReceivedAgentInfo";
        //    return obj;
        //},
        //_convertDbIntoSearchPhone: function (data, phone) {
        //    var result = {};
        //    // parse thông tin người gửi
        //    var pickupInfo = data[3].split('|');
        //    if (pickupInfo[3].length > 10) {
        //        result.senderName = vGln(pickupInfo[3]);
        //    } else {
        //        result.senderName = pickupInfo[3];
        //    }
        //    result.senderPhone = pickupInfo[4];
        //    if (pickupInfo[4].indexOf(phone) == 0) {
        //        result.keySender = "vred";
        //    } else {
        //        result.keySender = "";
        //    }

        //    // parse thông tin người nhận
        //    var dropOffInfo = data[4].split('|');
        //    if (dropOffInfo[3].length > 10) {
        //        result.receiverName = vGln(dropOffInfo[3]);
        //    } else {
        //        result.receiverName = dropOffInfo[3];
        //    }
        //    result.receiverPhone = dropOffInfo[4];
        //    if (dropOffInfo[4].indexOf(phone) == 0) {
        //        result.keyReceiver = "vred";
        //    } else {
        //        result.keyReceiver = "";
        //    }

        //    // parse thông tin nơi gửi
        //    var agentInfo = data[8].split('|');
        //    result.fromName = agentInfo[2];

        //    // parse thông tin nơi nhận
        //    var receivedAgentInfo = data[9].split('|');
        //    result.toName = receivedAgentInfo[2];

        //    result.fare = vToMn(data[5]);
        //    result.proId = data[0];
        //    result.tripId = data[7];
        //    result.tripTime = data[1];
        //    result.tripDate = vPrsDt(data[2]).toFormatString("dd-mm-yyyy");
        //    if (vIsEstStr(result.tripTime) && vIsEstStr(result.tripDate)) {
        //        result.tripDepartureDate = "/ " + result.tripTime + " ngày " + result.tripDate;
        //    }
        //    switch (parseInt(data[6])) {
        //        case 1:
        //            result.status = "Chưa nhận";
        //            result.typeOfView = "kho-hang-di";
        //            break;
        //        case 2:
        //            result.status = "Chưa nhận";
        //            result.typeOfView = "kho-hang-di";
        //            break;
        //        case 3:
        //            result.status = "Chưa nhận";
        //            result.typeOfView = "xem-chuyen";
        //            break;
        //        case 4:
        //            result.status = "Đã nhận";
        //            result.typeOfView = "xem-chuyen";
        //            break;
        //        case 5:
        //            result.status = "Chưa nhận";
        //            result.typeOfView = "xem-chuyen";
        //            break;
        //        case 6:
        //            result.status = "Đã nhận";
        //            result.typeOfView = "xem-chuyen";
        //            break;
        //        case 7:
        //            result.status = "Chưa giao";
        //            result.typeOfView = "kho-hang-ve";
        //            break;
        //        case 8:
        //            result.status = "Chưa giao";
        //            result.typeOfView = "kho-hang-ve";
        //            break;
        //        case 9:
        //            result.status = "Đã giao";
        //            result.typeOfView = "kho-hang-ve";
        //            break;
        //        default:
        //            result.status = "";
        //            result.typeOfView = "";
        //            break;
        //    }
        //    return result;
        //},

        //_createSearchTicketObj: function (text, byCode) {
        //    var self = this;
        //    var typeDate = $('input[name=type_filterdate]').val();
        //    var d = self._getLimitedDate();
        //    var $form = self._$BSfilterForm;
        //    var obj = {};
        //    if (typeof byCode == 'undefined' || !byCode) { //search by phone
        //        obj._a = "fGetCustomerTripDetail";
        //        var phone = "($x like N'%" + text + "%')";
        //        switch (text.length) {
        //            case 3:
        //                phone = "($x like N'%" + text + "')";
        //                break;
        //            case 4:
        //            case 5:
        //                phone = "($x like N'%" + text + "%')";
        //                break;
        //            case 6:
        //                phone = "($x like N'" + text + "%')";
        //                break;
        //            default:
        //                break;
        //        }

        //        var qe = "$x >= '" + d.toFormatString('iso') + "'";

        //        switch (parseInt(typeDate)) {
        //            case 1: qe = "$x >= '" + d.toFormatString('iso') + "'";
        //                break;
        //            case 2: qe = "$x is not null";
        //                break;
        //            case 3: var date = $form.find('button').html();
        //                var foda1 = new Date(vPrsDt(date).getTime());
        //                var foda = new Date();
        //                foda.setDate(foda1.getDate() - 1);
        //                var toda = new Date();
        //                toda.setDate(foda.getDate() + 2);
        //                qe = "$x > '" + foda.toFormatString('iso') + "' and $x < '" + toda.toFormatString('iso') + "'";
        //                break;
        //        }
        //        obj._c = [{
        //            CompId: parseInt(self.options.cid),
        //            Phone: phone,
        //            IsPrgStatus: "$x != 3"
        //        }, {
        //            CustomerTripIdTripDate: qe
        //        }];
        //        obj._f = "Id, Name, Note, Phone, BookingTicket, TotalBooking, PaidTicket, TotalPaid, CancelTicket, TotalCancel, NotComeTicket, TotalNotCome, PassTicket, TotalPass, KeepOnTimeTicket, TotalKeepOnTime"
        //        + ", CustomerTripIdTripId, CustomerTripIdTripDate, CustomerTripIdBookingTicket, CustomerTripIdTotalBooking, CustomerTripIdListSeatBooking, CustomerTripIdPaidTicket, CustomerTripIdTotalPaid, CustomerTripIdListSeatPaid, CustomerTripIdCancelTicket, CustomerTripIdTotalCancel, CustomerTripIdListSeatCancel, CustomerTripIdNotComeTicket, CustomerTripIdTotalNotCome, CustomerTripIdListSeatNotCome, CustomerTripIdPassTicket, CustomerTripIdTotalPass, CustomerTripIdListSeatPass, CustomerTripIdKeepOnTimeTicket, CustomerTripIdTotalKeepOnTime, CustomerTripIdListSeatKeepOnTime, CustomerTripIdTripName, CustomerTripIdNote, CustomerTripIdPickupInfo";
        //    } else { ////search ticket by Code
        //        obj._a = "fGetCustomerTripTicket";
        //        obj._c = {
        //            Code: $.trim(text).toUpperCase(),
        //        };
        //        obj._f = "Id, TripId, AgentId, SeatCode, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Code, TripDate, CustomerNote";
        //    }
        //    return obj;
        //},

        //_clearSearchResult: function () {
        //    var self = this;
        //    self._searchResult = [];
        //    self._totalSearchResult = 0;
        //    self._$searchTicketFilter.parent().find('div.search-result').remove();
        //    self._hasSearchPhone = false;
        //},
        //_mapSearchResult: function (data, total, key) {
        //    var self = this;
        //    //console.log(data);
        //    //var result = [];
        //    //$.each(data, function (_, item) {
        //    //    var cname = item[1];
        //    //    var cphone = item[3];
        //    //    var cnote = item[37];
        //    //    var cpickup = item[38];
        //    //    switch (key) {
        //    //        case 'phone':
        //    //            if (result[cphone]) {
        //    //                result[cphone]._cName = item[1];
        //    //                result[cphone]._cPhone = item[3];
        //    //                result[cphone]._cNote = item[37];
        //    //                result[cphone]._cPickup = item[38];
        //    //            } else {
        //    //                result[cphone] = {
        //    //                    _cName: item[1],
        //    //                    _cPhone: item[3],
        //    //                    _cNote: item[37],
        //    //                    _cPickup: item[38],
        //    //                }
        //    //            }
        //    //            break;
        //    //        case 'code':
        //    //            break;
        //    //        default:
        //    //            break;
        //    //    }
        //    //});
        //    self._searchResult = data;
        //    self._totalSearchResult = total;
        //},
        //_renderSearchResult: function (byCode) {
        //    var self = this;
        //    var $result;
        //    var totalResult = 0;
        //    if (self._totalSearchResult > 0) {
        //        $result = $('<ul />').addClass('search-items');
        //        if (typeof byCode == 'undefined' || !byCode) {
        //            /***************************************
        //            * search by phone number
        //            ***************************************/
        //            $.each(self._searchResult, function (_, item) {
        //                if (typeof item != "undefined" && item != null) {
        //                    //General
        //                    var cname = item[1];
        //                    var cphone = item[3];
        //                    var cnote = item[37];
        //                    var cpickup = item[38];
        //                    if (vIsEstStr(cpickup)) {
        //                        var getPickup = cpickup.split('|');
        //                        if (getPickup[0]) {
        //                            cpickup = "&nbsp/Đón:&nbsp" + getPickup[0];
        //                        }
        //                        else if (getPickup[1]) {
        //                            cpickup = "&nbsp/T.C:&nbsp" + getPickup[1];
        //                        }
        //                        else cpickup = '';
        //                    }
        //                    else cpickup = "";
        //                    if (!vIsEstStr(cnote)) {
        //                        cnote = "";
        //                    } else {
        //                        cnote = "&nbsp;/&nbsp;" + cnote;
        //                    }
        //                    var cbooked = parseInt(item[4] + item[6] + item[12] + item[14]);
        //                    var ccancelled = parseInt(item[8] + item[10]);
        //                    var ctotal = parseInt(item[5] + item[7] + item[13] + item[15]);
        //                    //Detail
        //                    var tid = parseInt(item[16]);
        //                    var tdate = vPrsDt(item[17]);
        //                    var tname = item[36];
        //                    var nbooked = parseInt(item[18] + item[21] + item[30] + item[33]);
        //                    var tbooked = parseInt(item[19] + item[22] + item[31] + item[34]);
        //                    var lbooked = [item[20], item[23], item[32], item[35]];

        //                    var ncancelled = parseInt(item[24] + item[27]);
        //                    var tcancelled = parseInt(item[25] + item[28]);
        //                    var lcancelled = [item[26], item[29]];

        //                    if (nbooked > 0) {
        //                        $result.append(
        //                            $('<li style="overflow: hidden;  white-space: nowrap;" />').attr('tid', tid)
        //                            .attr('tdate', tdate.toFormatString('dd-mm-yyyy'))
        //                            .attr('ttime', tdate.toFormatString('hh:mm'))
        //                            .attr('phone', cphone)
        //                            .html(cname + " <span class='vred'>(" + cphone + ")</span><span style=\"color: gray;font-size: smaller;font-weight: lighter;\">&nbsp;" + (item[2] == null ? '' : ('(' + item[2] + ')')) + "&nbsp;</span>" + "- Đặt:&nbsp;<span class='vred'>" + cbooked + "</span> - Hủy:&nbsp;<span class='vred'>" + ccancelled + "</span> / Đã đặt - <span class='vred'>" + nbooked + "</span> vé " + lbooked.filter(function (val) { return val !== null; }).join(', ') + " / <span class='vred'>" + tbooked.toMn() + "₫</span> / " + tname + " / ngày <span class='vred'>" + tdate.toFormatString('dd-mm-yyyy') + "</span> lúc <span class='vred'>" + tdate.toFormatString('hh:mm') + "</span> " + cpickup + cnote + '<button class="customer-profile customer-profile-item btn btn-sm btn-primary" title="Chỉnh sửa thông tin khách hàng" data-phone="' + cphone + '"><i class="glyphicon glyphicon-edit"></i> Edit</button>')
        //                        );
        //                        totalResult++;
        //                    }
        //                    if (ncancelled > 0) {
        //                        $result.append(
        //                            $('<li style="overflow: hidden;  white-space: nowrap;" />').attr('tid', tid).attr('type', 'isCancelled')
        //                            .attr('tdate', tdate.toFormatString('dd-mm-yyyy'))
        //                            .attr('ttime', tdate.toFormatString('hh:mm'))
        //                            .attr('phone', cphone)
        //                            .html(cname + " <span class='vred'>(" + cphone + ")</span><span style=\"color: gray;font-size: smaller;font-weight: lighter;\">&nbsp;" + (item[2] == null ? '' : ('(' + item[2] + ')')) + "&nbsp;</span>" + "- Đặt:&nbsp;<span class='vred'>" + cbooked + "</span> - Hủy:&nbsp;<span class='vred'>" + ccancelled + "</span> / Đã hủy - <span class='vred'>" + ncancelled + "</span> vé " + lcancelled.filter(function (val) { return val !== null; }).join(', ') + " / <span class='vred'>" + tcancelled.toMn() + "₫</span> / " + tname + " / ngày <span class='vred'>" + tdate.toFormatString('dd-mm-yyyy') + "</span> lúc <span class='vred'>" + tdate.toFormatString('hh:mm') + "</span> " + cpickup + cnote + '<button class="customer-profile customer-profile-item btn btn-sm btn-primary" title="Chỉnh sửa thông tin khách hàng" data-phone="' + cphone + '"><i class="glyphicon glyphicon-edit"></i> Edit</button>')
        //                        );
        //                        totalResult++;
        //                    }
        //                    //update by Thanh
        //                    //if (totalResult == 0) {
        //                    //    $result = $('<div />').html('<p class="not-found">Không tìm thấy số điện thoại hoặc mã vé</p>');
        //                    //}
        //                    //end
        //                }
        //            });
        //        } else {
        //            /***************************************
        //            * search by code
        //            ***************************************/
        //            var cname = [];
        //            var cphone = [];
        //            var cnote = "";
        //            var ccode = "";
        //            var cpickup = "";
        //            var tId = null;
        //            var tDate = "";
        //            var tName = "";
        //            var cseats = [];
        //            var totalSeat = 0;
        //            var status = "";
        //            var compId = null;
        //            var totalCost = 0;
        //            // listResult
        //            // order by TripDate
        //            // obj: [Code, Name, Phone, SeatCode, TotalCost, TripName, TripDateDay, TripDateHour, Status, PickupInfo, Note, TripId, isCanceled]
        //            var listResult = {}
        //            var tripDate = "";
        //            var tripDateDay = "";
        //            var tripDateHour = "";
        //            var listTrip = {};
        //            $.each(self._searchResult, function (_, item) {

        //                if (typeof item != "undefined" && item != null) {
        //                    var listSeatCode = [];
        //                    var isCancelled = "";
        //                    var keyObj = "";
        //                    //General
        //                    //Id, TripId, AgentId, SeatCode, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Code, TripDate  
        //                    if (vIsEstStr(item[5])) {
        //                        var cCustomerInfo = item[5].split("|");
        //                        if (vIsEstStr(cCustomerInfo[3]) && cname.indexOf(cCustomerInfo[3]) < 0) cname.push(cCustomerInfo[3]);
        //                        if (vIsEstStr(cCustomerInfo[4]) && cphone.indexOf(cCustomerInfo[4]) < 0) cphone.push(cCustomerInfo[4]);
        //                    }

        //                    ccode = item[10];
        //                    cnote = item[12];
        //                    cpickup = item[9];
        //                    totalCost += parseInt(item[7]);
        //                    if (vIsEstStr(cpickup)) {
        //                        var getPickup = cpickup.split('|');
        //                        if (getPickup[0]) {
        //                            cpickup = "&nbsp/Đón:&nbsp" + getPickup[0];
        //                        }
        //                        else if (getPickup[1]) {
        //                            cpickup = "&nbsp/T.C:&nbsp" + getPickup[1];
        //                        }
        //                        else cpickup = '';
        //                    }
        //                    else cpickup = "";

        //                    //Detail
        //                    compId = item[2];
        //                    tId = parseInt(item[1]);
        //                    tDate = vPrsDt(item[4]);
        //                    var seatcode = item[3].split("|");
        //                    cseats.push(seatcode[0]);
        //                    totalSeat++;
        //                    //Status
        //                    var stt = parseInt(item[6]);
        //                    //status = " / " + _dict._stn[stt].vi;
        //                    status = _dict._stn[stt].vi;
        //                    if (stt == 3)
        //                        isCancelled = "isCancelled";

        //                    //Get trip name
        //                    if (!listTrip.hasOwnProperty(tId)) {
        //                        var cmplete = function (u, r, l, t) {
        //                            if (u != 1 || l <= 0) return;
        //                            listTrip[tId] = r[0][0];
        //                            tName = r[0][0];
        //                        };
        //                        var obj = {
        //                            _a: "fGetTrip",
        //                            _c: {
        //                                Id: tId,
        //                            },
        //                            _f: "Name"
        //                        }
        //                        self._submitAction(obj, cmplete);
        //                    } else {
        //                        tName = listTrip[tId];
        //                    }

        //                    tripDateHour = vPrsDt(item[11]).toFormatString('hh:mm');
        //                    tripDateDay = vPrsDt(item[11]).toFormatString('dd-mm-yyyy');
        //                    tripDate = tripDateHour + " " + tripDateDay;
        //                    keyObj = tripDate + " " + stt;
        //                    listSeatCode.push(seatcode[0]);
        //                    if (typeof listResult[keyObj] != "undefined") {
        //                        listResult[keyObj][3].push(seatcode[0]);
        //                        listResult[keyObj][4] += parseInt(item[7]);
        //                    } else {
        //                        listResult[keyObj] = {};
        //                        listResult[keyObj][0] = ccode;
        //                        listResult[keyObj][1] = cname;
        //                        listResult[keyObj][2] = cphone;
        //                        listResult[keyObj][3] = listSeatCode;
        //                        listResult[keyObj][4] = parseInt(item[7]);
        //                        listResult[keyObj][5] = tName;
        //                        listResult[keyObj][6] = tripDateDay;
        //                        listResult[keyObj][7] = tripDateHour;
        //                        listResult[keyObj][8] = status;
        //                        listResult[keyObj][9] = cpickup;
        //                        listResult[keyObj][10] = cnote;
        //                        listResult[keyObj][11] = tId;
        //                        listResult[keyObj][12] = isCancelled;
        //                    }
        //                }
        //            });

        //            for (var ind in listResult) {
        //                if (listResult.hasOwnProperty(ind)) {
        //                    var ite = listResult[ind];
        //                    //appent result
        //                    $result.append(
        //                        $('<li style="overflow: hidden;  white-space: nowrap;" />').attr('tid', ite[11]).attr('type', ite[12])
        //                        .attr('tdate', ite[6])
        //                        .attr('ttime', ite[7])
        //                        .attr('code', ite[0])
        //                        .html("Mã vé:&nbsp<span class='vred'>" + ite[0] + "</span> - " + ite[1].join(",") + "<span style=\"color: gray;font-size: smaller;font-weight: lighter;\">&nbsp;" + (ite[10] == null ? '' : ('(' + ite[10] + ')')) + "&nbsp;</span>" + "(<span class='vred'>" + ite[2].join(" ,") + "</span>) / " + "<span class='vred'>" + ite[3].length + "</span> vé " + ite[3].join(",") + " / " + "<span class='vred'>" + ite[4].toMn(0, ',', '.') + "₫</span> / " + ite[5] + " / " + " ngày <span class='vred'>" + ite[6] + "</span> lúc <span class='vred'>" + ite[7] + "</span> / " + ite[8] + ite[9] + '<button class="customer-profile customer-profile-item btn btn-sm btn-primary" title="Chỉnh sửa thông tin khách hàng" style="position: absolute;right: 20px;margin:2px;" data-phone="' + cphone + '"><i class="glyphicon glyphicon-edit"></i> Edit</button>')
        //                    );
        //                    totalResult++;

        //                }
        //            }

        //            ////appent result
        //            //$result.append(
        //            //    $('<li />').attr('tid', tId).attr('type', isCancelled)
        //            //    .attr('tdate', tDate.toFormatString('dd-mm-yyyy'))
        //            //    .attr('ttime', tDate.toFormatString('hh:mm'))
        //            //    .attr('code', ccode)
        //            //    .html("Mã vé:&nbsp<span class='vred'>" + ccode + "</span> - " + cname.join(",") + " (<span class='vred'>" + cphone.join(" ,") + "</span>) / " + "<span class='vred'>" + totalSeat + "</span> vé " + cseats.join(",") + " / " + "<span class='vred'>" + totalCost.toMn(0, ',', '.') + "₫</span> / " + tName + " / " + tDate.toFormatString('hh:mm') + ' ngày ' + tDate.toFormatString('dd-mm-yyyy') + status + cpickup + cnote)
        //            //);
        //            //totalResult++;
        //        }
        //    } else {
        //        $result = $('<div />').html('<p class="not-found">Không tìm thấy số điện thoại hoặc mã vé</p>');
        //    }
        //    self._$filterSearchResult = $('<div />').addClass('dropdown-menu search-result')
        //        .append($('<div />').addClass('search-title')
        //            .append('Kết quả tìm kiếm')
        //            .append($('<span />').append('X').on('click', function () {
        //                self._clearSearchResult();
        //                self._$searchTicketFilter.val('');
        //            })
        //            )
        //        )
        //        .append($result)
        //        .append($('<div />').addClass('search-summary').append('Tổng số (' + totalResult + ' phần tử)'));

        //    self._$searchTicketFilter.parent().append(self._$filterSearchResult);

        //    $(".customer-profile-item").unbind().click(function (e) {
        //        e.stopPropagation();
        //        e.preventDefault();
        //        app.cusphone = $(this).attr("data-phone");
        //        $("#showCustomerProfile").trigger('click');
        //    });
        //},
        //_bindEventOnSearchResult: function () {
        //    var self = this;
        //    if (self._totalSearchResult > 0) {
        //        var li = self._$filterSearchResult.find('li');
        //        li.on('click', function (e) {
        //            e.preventDefault();
        //            e.stopPropagation();
        //            var tripIdRecord = parseInt($(this).attr('tid'));
        //            var tripId = self._cTripId;
        //            if (tripIdRecord != tripId) {
        //                self._changeCTripId(tripIdRecord);
        //                self._$filterForm.find('select[name=TripId]').val(tripIdRecord);
        //                $.each(self._$filterForm.find('select[name=TripId] option'), function (k, v) {
        //                    if ($(v).attr('value') == tripIdRecord) {
        //                        self._changeCTripIndex(k);
        //                    }
        //                });
        //            }

        //            var tripDateRecord = $(this).attr('tdate');
        //            self._changeCTripDate(vPrsDt(tripDateRecord));


        //            vfe('body', 'fSetDate', { value: vPrsDt(tripDateRecord) });

        //            var tripTimeRecord = $(this).attr('ttime');
        //            self._changeCTripTime(tripTimeRecord);

        //            //self._$filterForm.find('select[name=TimeSlot]').val(tripTimeRecord);
        //            vfe('body', 'fSetTime', { value: tripTimeRecord });

        //            //Show BKS
        //            ($('a[data-tab=bks]', 'ul.vbooking-list').trigger('click'));

        //            //Seat has search
        //            self._hasSearchPhone = true;
        //            self._changeCFromId(0);
        //            self._changeCToId(0);
        //            self._reloadStopPoints();
        //            self._reloadTimeSlot();
        //            self._reloadTimeFromAndTo();
        //            if (_dict._availableSeatOn) {
        //                self._reloadAvailableSeat();
        //            }
        //            self._reloadFrame();
        //            self._generateStageCode();
        //            self._changeCMaxStageCode(self._cStageCode);

        //            var phoneRecord = $(this).attr('phone');
        //            var code = $(this).attr('code');
        //            var isCanceled = $(this).attr('type');
        //            var afterReloadSheet = function () {
        //                self._$searchTicketFilter.val("").blur();
        //                if (isCanceled == "isCancelled") {
        //                    if (typeof code == 'undefined')
        //                        self._searchCancelled(phoneRecord, false);
        //                    else {
        //                        self._searchCancelled(code, true);
        //                    }
        //                } else {
        //                    if (typeof code == 'undefined')
        //                        self._search(phoneRecord, false);
        //                    else {
        //                        self._search(code, true);
        //                    }
        //                }
        //                self._clearSearchResult();
        //            }
        //            self._reloadSheet(afterReloadSheet);
        //            self._reloadAllowedSeats();
        //            self._reloadData();

        //            // reload default FromId, ToId
        //            if (typeof _dict._hasDefaultStagePerTrip != "undefined" && _dict._hasDefaultStagePerTrip) {
        //                if (typeof _dict._defaultStagePerTrip[tripIdRecord] != "undefined") {
        //                    var defaultStage = _dict._defaultStagePerTrip[tripIdRecord].split(',');
        //                    self._cDefaultFromId = parseInt(defaultStage[0]);
        //                    self._cDefaultToId = parseInt(defaultStage[1]);
        //                } else {
        //                    self._cDefaultFromId = self._cFromId;
        //                    self._cDefaultToId = self._cToId;
        //                }
        //            }

        //            self._reloadVOTrip();
        //            self._reloadVVTrip();
        //            self._reloadVCTrip();
        //        }).hover(function (e) {
        //            li.removeClass('selected');
        //            $(this).addClass('selected');
        //        });

        //        self._bindArrowEventList(li);
        //    }
        //},

        /************************************************************************
        * TRIP INFO                                                             *
        *************************************************************************/
        _reloadTripStatistic: function () {
            var self = this;

            var obj = self._createGetTripStatisticObj();
            var completeGetTripStatistic = function (u, r, l, t) {
                if (u != 1) return;
            };
            //Submit query
            self._submitAction(obj, completeGetTripStatistic);
        },
        _createGetTripStatisticObj: function () {
            var self = this;
            var obj = {};
            obj._a = "sGetTripInfo";
            obj._c = {
                TripId: parseInt(self._cTripId),
                TripDate: "convert(nvarchar(10), $x, 105) = '" + self._cTripDate.toFormatString('dd-mm-yyyy') + "'"
            };
            obj._f = "*";

            return obj;
        },
        _generateStageCode: function () {
            var self = this;
            if (self._data[self._cTripIndex]) {
                self._generateStageCodeByAreaId(self._data[self._cTripIndex].StopPoints, self._cFromId, self._cToId);
            }
        },
        /*_filterStopPoints: function () {
            var self = this;
            var stopPoints = self._getStopPoints();
            var fromIdx = stopPoints.idx[self._cFromId];
            var toIdx = stopPoints.idx[self._cToId];
            var len = stopPoints.length;
            
        },*/

        _generateStageCodeByAreaId: function (stopPoints, cFromId, cToId) {
            var self = this;
            //var f = stopPoints.indexOf(cFromId);
            var keys = Object.keys(stopPoints.idx);
            var len = keys.length - 1;
            var cFromIndex = stopPoints.idx[cFromId.toString()];
            var cToIndex = stopPoints.idx[cToId.toString()];
            self._cStageBinary = self._generateStageCodeByAreaIndex(len, cFromIndex, cToIndex);
            if (self._cStageBinary == "") self._cStageBinary = "1";
            self._cStageCode = parseInt(self._cStageBinary, 2);
            //var $cbbFrom = $('#FilterForm select[name=FromId]');
        },
        _generateStageCodeByAreaIndex: function (areaTotal, fromIndex, toIndex) {
            var res = "";
            if (fromIndex > toIndex) {
                var temp = fromIndex;
                fromIndex = toIndex;
                toIndex = temp;
            }
            fromIndex++;
            for (var i = 1; i <= areaTotal; i++) {
                if (i >= fromIndex && i <= toIndex) res += "1";
                else res += "0";
            }
            return res;
        },


        //Available seat
        _reloadAvailableSeat: function () {
            var self = this;
            var obj = self._createGetTripTotalSeatInfoObj();
            var cb = function (u, r, l, t) {
                if (u != 1) return;
                self._mapAvailableSeat(r);
            };
            //Submit query
            vdc.gTripTotalSeatInfo(obj._c, '*', !FlatObj.IsFirstTime, cb);
            //self._submitAsyncAction(obj, cb);
        },
        _createGetTripTotalSeatInfoObj: function () {
            var self = this;
            var obj = {};
            obj._a = "sGetTripTotalSeatInfo";
            obj._c = {
                TripId: parseInt(self._cTripId),
                TripDate: "convert(nvarchar(10), $x, 105) = '" + self._cTripDate.toFormatString('dd-mm-yyyy') + "'"
            };
            obj._f = "*";

            return obj;
        },
        _mapAvailableSeat: function (d) {
            var self = this;
            vfe('body', 'fMapAvaiSeat', { value: self, data: d });

            //var ots = self._$filterForm.find('select[name=TimeSlot] option');
            //$.each(ots, function (i, v) {
            //    var bv = 0;
            //    $.each(d, function (j, a) {
            //        if (v.value == a[2]) {
            //            bv = a[3];
            //        }
            //    });
            //    if (typeof self._data[self._cTripIndex].Ts[v.value] != "undefined") {
            //        var av = self._data[self._cTripIndex].Ts[v.value][0].NS - bv;
            //        var ctext = v.value;
            //        if (self._data[self._cTripIndex].Ts[v.value][0].S == 2) {
            //            ctext += " - Tăng cường";
            //        }
            //        $(v).text(ctext + " / Ghế trống " + av);
            //    }
            //});
        }

    });

})(jQuery);

$(document).mouseup(function (e) {
    var container = $("div.search-result");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide();
        $("#inputSuccess2").val("");
    }
});

$('div.input-group-btn ul.dropdown-menu li a').click(function (e) {
    var $div = $(this).parent().parent().parent();
    var $btn = $div.find('button');
    var type = $(this).attr('data-value');
    $('input[name=type_filterdate]').val(type);
    if (type == "3") {

        $('#calendar_drown').show();
    } else {
        $btn.html($(this).text() + ' <span class="caret"></span>');
        $div.removeClass('open');
    }
    e.preventDefault();
    return false;
});

