/************************************************************************
* CORE vBooking module                                                  *
*************************************************************************/
$.widget("custom.vbooking", {

    /************************************************************************
    * DEFAULT OPTIONS / EVENTS                                              *
    *************************************************************************/
    //#region Options
    options: {
        cid: 0,
        aid: 0,
        uid: 0,
        un: "",
        serviceUrl: null,
        backupBaseUrl: null,
        baseUrl: null,
        sTimeZoneOffset: 0,
        cite: '',
        cice: '',
        cifne: '',
        cisne: '',
        pilne: '',
        aite: '',
        aice: '',
        aisne: '',
        aifne: '',
        rights: '',

    },
    //#endregion
    /************************************************************************
    * PRIVATE FIELDS                                                        *
    *************************************************************************/
    //#region PRIVATE FIELDS 
    _$container: null, //Reference to the main container of all elements that are created by this plug-in (jQuery object)
    _$toolbar: null,
    _$tripInfo: null,
    _$sheet: null,
    _$notComeSheet: null,
    _$cancelSheet: null,

    _numCoach: 1, //Number of coach
    _numRow: 7, //default is 7
    _numCol: 5, //default is 5
    _info: null,
    _data: null,
    _cTripIndex: 0, //Current trip index
    _cTripId: 0, //Current trip id
    //_cFromIndex: 0, //Current From index
    _cFromId: 0, //Current From id
    _cToId: 0, //Current To id
    _cDefaultFromId: 0, //Current From id
    _cDefaultToId: 0, //Current To id
    _cTripDate: null,
    _cTripTime: null,
    _cTripBus: 0,
    _cStageBinary: "",
    _cStageCode: 0,
    _cMaxStageCode: 0,
    _m: null, //Matrix seat
    _nc: null, //Matrix not come ticket
    _c: null, //Matrix cancel ticket
    _cphoneSt: null,
    _cCodeSt: null,

    //Offset time between local and server, plus this value when submit to server
    _sOffsetMinute: 0,
    _grid: true,
    _rBookingOnPast: false,
    //#endregion
    /************************************************************************
    * CONSTRUCTOR AND INITIALIZATION METHODS                                *
    *************************************************************************/
    _create: function () {
        FlatObj.W = this;
        //Initialization
        this._initializeFields();

        //Creating DOM elements
        this._createContainer();
        this._createToolBar();
        this._createSheet();
    },
    _initializeFields: function () {
        this._data = []; //Store data
        this._info = []; //Info
        this._m = []; //Default is empty
        this._nc = []; //Notcome is empty
        this._c = []; //Notcome is empty
        this._cphoneSt = {};
        this._cCodeSt = {};
        this._cFromId = 0;
        this._cToId = 0;
        //Default trip Id
        //if (vIsEstStr(this.options.rights)) {
        //    var match = this.options.rights.match(/\~3\|1\|\d+/g);
        //    if (match != null) {
        //        var tripId = parseInt(match[match.length - 1].substring(match[match.length - 1].lastIndexOf('|') + 1));
        //        if (!isNaN(tripId)) {
        //            this._cTripId = tripId;
        //$.each(this._data, function(kl, kv) {
        //    console.log(kv);
        //});
        //} else {
        //console.log('_initializeFields');
        //        }
        //    } else {
        //        this._cTripId = 0;
        //    }

        //    if (/\~5\|2\|1/.test(this.options.rights)) {
        //        this._rBookingOnPast = true;
        //    }
        //}

        //Current trip date
        var d = new Date();
        var timeZoneOffset = d.getTimezoneOffset();
        var sDate = vPrsDt(this.options.sTime);
        var sTimeOffset = Math.floor((sDate - d) / 60000);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        this._cTripDate = d;
        $("body").trigger('changeCTripDate', d);
        this._sOffsetMinute = parseInt(this.options.sTimeZoneOffset) + timeZoneOffset + sTimeOffset;
    },
    _createContainer: function () {
        this._$container = $('.vbooking-container');
    },
    _createToolBar: function () {
        this._$toolbar = $('.vbooking-toolbar');
    },
    _createSheet: function () {
        this._$tripInfo = $('<div />')
            .addClass('vbooking-info col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);

        this._$sheet = $('<div />')
            .addClass('vbooking-sheet col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);

        this._$notComeSheet = $('<div />')
            .addClass('vbooking-ncsheet col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);

        this._$cancelSheet = $('<div />')
            .addClass('vbooking-csheet col-md-12 col-sm-12 col-xs-12 clearfix')
            .appendTo(this._$container);
    },

    /************************************************************************
    * PUBLIC METHODS                                                        *
    *************************************************************************/
    load: function () {
        this._beginEvent();
        this._initializeFields();
        this.reload();
        this._reloadInfo();
        this._endEvent();
        return { x: this }
    },
    startNotification: function () {
        //if (_dict._hasNotification) {
        this._startNotification();
        //}
    },

    autoRefresh: function() {
        var me = this;
        $('body').on('click', function() {

        });
    },
    reload: function () {
        var self = this;
        $('.select-layout > button').removeClass('active');
        var $btnGrid = $('.select-layout > button.btn-grid');
        if ($btnGrid.length > 0) {
            if (!$btnGrid.hasClass('active')) {
                $btnGrid.addClass('active');
                self._grid = true;
            }
        }
        if (typeof self.options.rid != 'undefined') self._cTripId = self.options.rid;
        self._reloadTrigger();
        self._reloadData(function () {
            if (self.allowCompEvent || self.allowAgentTripEvent) {
                alert('Không tìm thấy chuyến, vui lòng chọn Company khác');
                $("body").trigger('tripNotFound');
            }
        });
        var afterReloadSheet = function () {
            // reset load first time value back default
            FlatObj.LFTime = false;
        }
        if (typeof self._reloadFilter === 'function') {
            self._reloadFilter();
            self._reloadFrame();
            self._reloadAllowedSeats();
            self._isOrderring = false;
            //self._reloadFlatObj();
            self._reloadSheet(afterReloadSheet);
            $('ul.vbooking-list a[data-tab="bks"]').trigger('click');
            // reset load default trip
            FlatObj.LDefTrip = false;
        } else {
            console.error('BKS load fail. Trying again....');
            location.reload();
        }
    },

    _reloadFlatObj: function () {
        var self = this;
        FlatObj.W = this;
        if (!self._data[self._cTripIndex]) {
            //Khi load trip chậm thì sẽ lấy mặc đinh Index = 0 (Khánh)
            self._cTripIndex = 0;
        }
        FlatObj.cRoute = self._data[self._cTripIndex]; //Current Trip
        if (!FlatObj.cRoute) return false;
        FlatObj.cTrip = FlatObj.cRoute.Ts[FlatObj.W._cTripTime][0]; //Current Trip
        FlatObj.SP = self._data[self._cTripIndex].StopPoints; //current StopPoints
        return true;
    },
    destroy: function () {
        this.element.empty();
        $.Widget.prototype.destroy.call(this);
    },

    _reloadTrigger: function () {
        $("body").trigger('applyBooking', this.options);
    },

    _beginEvent: function () {
        var me = this;
        $("#agtTrips").find('.jtable').on('mouseenter', function (e) {
            //console.log("coming...");
        });
        $("body").on("compChanged", function (e, model) {
            if (me.allowCompEvent && typeof model != 'undefined' && model != null) {
                // load first time
                FlatObj.LFTime = true;
                // reset giá trị FTripGetTrip về dạng default
                FlatObj.FTripGetTrip = false;
                // load default trip
                FlatObj.LDefTrip = true;

                me._clearSelectedItem();
                me._resetSeatStack();
            }

        });
        $("body").on("tripChanged", function (e, model) {
            //console.log(me.options, e, model);
            if (me.allowAgentTripEvent) {
                //me._clearSheet();
                me._setOption('cid', model.CompId);
                me._setOption('rid', model.Id);
                me.reload();
                $('body').find('select[name=TripId]').trigger('change');
            }

        });
        $("body").on("fTripReady", function (e) {
            if (e.cb != undefined) {
                me._mapData(e.r, e.cb);
            } else {
                me._mapData(e.r);
            }
            if (me._data[me._cTripIndex]) {
                FlatObj.SP = me._data[me._cTripIndex].StopPoints; //current StopPoints
            }
            FlatObj.cRoute = me._data[me._cTripIndex]; //Current Trip
            // báo hiệu đã chạy hàm fTripGetTrip
            FlatObj.FTripGetTrip = true;
        });
        $("body").on("fTripChange", function (e) {
            console.log(e);
        });
    },

    _endEvent: function () {
        this.allowCompEvent = true;
        this.allowAgentTripEvent = true;
    },
    /************************************************************************
    * PRIVATE METHODS                                                       *
    *************************************************************************/
    _setOption: function (key, value) {
        this.options[key] = value;
    },

    _submitAction: function (d, p) {
        vRqs(d, p, { async: false });
    },
    _submitAsyncAction: function (d, p) {
        vRqs(d, p);
    },

    /************************************************************************
    * GENERAL                                                                 *
    *************************************************************************/
    _reloadInfo: function () {
        var self = this;
        //Update post data
        var obj = self._createGetInfoObj();
        var completeReload = function (u, r, l, t) {
            if (u != 1 || l <= 0) {
                return;
            }
            //Map data
            self._mapInfo(r);
        };
        //Submit query
        self._submitAction(obj, completeReload);
    },
    _createGetInfoObj: function () {
        var self = this;
        //Create 
        var obj = {};
        obj._a = "fGetCompany";
        obj._c = {
            BaseId: self.options.cid,
            Type: "($x = 2 OR $x = 3)",
            IsPrgStatus: 1
        };
        obj._f = "Id, Type, Code, Name, AddressInfo, PhoneInfo";

        return obj;
    },
    _mapInfo: function (data) {
        var self = this;
        self._info = data;

        var blist = [];
        var alist = [];
        $.each(data, function (_, b) {
            //var $op = $('<option />', { value: b[0] }).text($.trim(b[3]));
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

        //self._$updateForm.find('select[name=BranchName]').empty().append(blist).prepend($('<option />', {value: ""}).text('Chọn chi nhánh'));
        //self._$updateForm.find('select[name=AgentName]').empty().append(alist).prepend($('<option />', { value: "" }).text('Chọn đại lý xe'));
        $.each(blist, function (_, item) {
            self._$updateForm.find('select[name=BranchName]').append(
                $('<option />', { value: item.value }).text(item.text)
            );
        });

        var $selectAgent = self._$updateForm.find('select[name=AgentName]');
        // Edited by Duy: fix lỗi bị duplicate đại lý
        // vẫn giữ lại cái đầu tiên
        var $firstOp = $selectAgent.find('option:first-child');
        $selectAgent.empty();
        $selectAgent.append($firstOp);

        $.each(alist, function (_, item) {
            $selectAgent.append(
                $('<option />', { value: item.value }).text(item.text)
            );
        });
        //$selectAgent.children().last().attr("selected", "selected");
        self._$updateForm.find('select[name=AgentName]').chosen({ width: "100%", search_contains: true });
    },

    /************************************************************************
    * FRAME                                                                 *
    *************************************************************************/
    _reloadData: function (cb) {
        var self = this;
        //Update post data
        var obj = self._createGetFrameObj();
        var completeReload = function (u, r, l, t) {
            if (u != 1 || l <= 0) {
                self._clearSheet();
                self._notFoundResult();
                if (cb != null) {
                    cb.call(self);
                }

                return;
            }

            //Map data
            self._mapData(r);
            if (self._data[self._cTripIndex]) {
                FlatObj.SP = self._data[self._cTripIndex].StopPoints; //current StopPoints
            }
            FlatObj.cRoute = self._data[self._cTripIndex]; //Current Trip

        };
        //Submit query
        //self._submitAction(obj, completeReload);

        // kiểm tra xem fTripGetTrip đã chạy chưa
        if (!FlatObj.FTripGetTrip) {

            var e = jQuery.Event("fTripGetTrip");
            e.in = self._cTripDate;
            if (typeof cb === "function" && FlatObj.RBePrint) {
                e.cb = cb;
            }
            $('body').trigger(e);
        }
    },
    _createGetFrameObj: function () {
        var self = this;
        self._cTripDate.setHours(0);
        self._cTripDate.setMinutes(0);
        self._cTripDate.setSeconds(0);
        var d = "(type = 1 or (type = 2 and Time is not null and $x = N'" + self._cTripDate.toFormatString('iso') + "')) order by type,name asc";

        //Create 
        var obj = {};
        obj._a = "fGetTrip";
        obj._c = {
            CompId: self.options.cid,
            IsPrgStatus: "$x != 3",
            Date: d
        };

        obj._f = "Id, Name, Info, SeatTemplateInfo, FareInfo, StatusInfo, BaseId, Type, Time, Alias, TeamInfo, VehicleInfo, FromArea, ToArea, Note, RouteInfo, SeatSummaryInfo, TotalSeats, ClosedStatus, PassengerMoney, ProductMoney, FeeMoney, BranchReceiveProduct, RealDepartureTime, PickedPointsInfo, TransferPointsInfo, NewFare";

        return obj;
    },
    _parseStopPoints: function (routeInfo) {
        var res = {
            idx: {},
            data: []
        };
        var i = 0;
        $.each(routeInfo, function (_, t) {
            if (i == 0) {
                i++;
                return;
            }

            t = t.split("|");
            res.idx[t[0]] = i - 1;
            res.data.push({
                Id: t[0],
                Type: t[1],
                Code: t[2],
                Name: t[3],
                Address: t[4],
                Distance: t[5],
                Hour: parseInt(t[6]),
                Minute: parseInt(t[7]),
                Order: typeof t[8] == 'undefined' ? 0 : t[8],
            });
            i++;

        });
        return res;

    },
    _mapData: function (data, cb) {
        var self = this;
        self._data = [];
        self._points = [];
        var tIds = [];
        $.each(data, function (_, t) {
            //Parse info
            var bId = parseInt(t[6]);
            var tId = parseInt(t[0]);
            if (!isNaN(bId) && bId != 0) {
                tId = bId;
            }
            // kiểm tra xem có block tuyến đường theo văn phòng hay không
            // nếu có sẽ không khởi tạo giá trị cho self._data của tuyến đó
            if (typeof _dict._hasBlockTripByBranch != "undefined" && _dict._hasBlockTripByBranch && typeof _dict._blockTripByBranch != "undefined") {
                if (typeof _dict._blockTripByBranch[app.aid] != "undefined" && _dict._blockTripByBranch[app.aid].indexOf(tId) != -1) {
                    return;
                }
            }
            var sInfo = parseInt(t[5]);
            //var b = Math.floor(sInfo / 16); //STATUS
            var b = parseInt(t[9]); //bus is Alias
            if (isNaN(b)) {
                b = 0;
            }
            var s = sInfo; //STATUS
            var type = parseInt(t[7]);
            var idx = tIds.indexOf(tId);
            if (idx == -1) {
                //remove vn chars
                idx = tIds.push(tId) - 1;
                self._data[idx] = {
                    Id: tId,
                    Name: t[1],
                    FromArea: t[12],
                    ToArea: t[13],
                    //RouteInfo: t[15],
                    StopPoints: t[15] ? self._parseStopPoints(t[15].split("~")) : self._parseStopPoints([]),
                    FareInfo: t[4],
                    Ts: {},
                    BranchReceiveProduct: t[22],
                    PickedPointsInfo: t[24],
                    TransferPointsInfo: t[25],
                };
            }

            //Total seat
            var numSeat = 0;
            var tplInfo = t[3].split('~')[1];
            var seatTemplateId = t[3].split('~')[0];
            if (typeof tplInfo != "undefined" && tplInfo != null) {
                numSeat = parseInt(tplInfo.split('|')[2]);
            }
            var totalSeats = t[17];
            var bookedSeats = t[16];
            if (1 == type) {
                //Set up base
                if (t[2] != null) {
                    var tInfo = t[2].split('~');
                    $.each(tInfo, function (__, ts) {
                        //Parse time slot
                        var pTs = ts.split('|')[0];

                        if (typeof self._data[idx].Ts[pTs] == "undefined") {
                            self._data[idx].Ts[pTs] = [];
                        }
                        self._data[idx].Ts[pTs][b] = {
                            T: t[3],
                            SeatTemplateId: seatTemplateId,
                            F: t[4],
                            S: s,
                            NS: numSeat,
                            BS: bookedSeats,
                            TS: totalSeats,
                            ClosedStatus: t[18],
                            RealDepartureTime: t[23]
                        }; //Template, Fare, Status, Number of seat, Booked Seats, Total Seats
                    });
                }
            } else if (2 == type) {
                //Set up detail
                if (t[8] != null && t[8] != "") {
                    if (typeof self._data[idx].Ts[t[8]] == "undefined") {
                        self._data[idx].Ts[t[8]] = [];
                    }
                    //Overwrite self._data[idx] => idx= current index
                    self._data[idx].Ts[t[8]][b] = {
                        T: t[3],
                        SeatTemplateId: seatTemplateId,
                        F: vIsEstStr(t[26]) ? t[26] : t[4],
                        S: s,
                        NS: numSeat,
                        Dr: t[10],
                        V: t[11],
                        N: t[14],
                        BS: bookedSeats,
                        TS: totalSeats,
                        TeamInfo: t[10],
                        TripDetailId: t[0],
                        ClosedStatus: t[18],
                        PassengerMoney: t[19],
                        ProductMoney: t[20],
                        FeeMoney: t[21],
                        RealDepartureTime: t[23]
                    };
                }
            }
        });

        // kiểm tra có sơ đồ ghế mặc định theo giờ hay không
        //var obj = {};
        //obj._a = "fGetTrip";
        //obj._c = {
        //    CompId: self.options.cid,
        //    Type: 7
        //};
        //obj._f = "BaseId, Time, SeatTemplateInfo";

        //var requestSucc = function (u, r, t, t) {
        //    //Normalize data
        //    if (u == 1 || l > 0) {
        //        $.each(r, function (hb, hc) {
        //            $.each(self._data, function (kn, km) {
        //                if (km.Id == hc[0]) {
        //                    self._data[kn].Ts[hc[1]][0].T = hc[2]; // bus Alias = 0
        //                }
        //            });
        //        });
        //    }
        //}

        //self._submitAction(obj, requestSucc);
        if (cb != undefined) {
            cb.call();
        }
    },

    _reloadFrame: function () {
        var self = this;
        if (self._data[self._cTripIndex]) {
            self._mapSeatToMatrix(self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].T);
        }

        //self._renderSeatTemplate();
    },
    _mapSeatToMatrix: function (data) {

        var self = this;
        self._m = [];

        //Template
        var tpl = data.split('~');
        //Coach
        self._numCoach = parseInt(tpl[1].split('|')[1]);
        for (var i = 2; i < 4; i++) {
            var f = tpl[i].split('|');
            var nr = parseInt(f[1]);
            var nc = parseInt(f[2]);
            if (self._numRow < nr) {
                self._numRow = nr;
            }
            if (self._numCol < nc) {
                self._numCol = nc;
            }
        }

        //Seat
        for (var j = self._numCoach + 1; j < tpl.length; j++) {
            var record = tpl[j].split('|');
            var s = self._createSeatFromRecord(record);
            if (!$.isEmptyObject(s)) {
                var coach = parseInt(record[5]);
                var row = parseInt(record[6]);
                var col = parseInt(record[7]);
                //Create coach if not existing
                if (typeof self._m[coach - 1] == 'undefined') {
                    self._m[coach - 1] = [];
                }

                //Create row if not existing
                if (typeof self._m[coach - 1][row - 1] == 'undefined') {
                    self._m[coach - 1][row - 1] = [];
                }
                //Add seat to matrix
                self._m[coach - 1][row - 1][col - 1] = s;
            }
        }
        app.sheetMatrix = self._m;

    },

    /************************************************************************
    * SHEET                                                                 *
    *************************************************************************/
    _reloadSheet: function (afterReloadSheet) {

        var self = this;
        // reset FTripGetTrip về default
        FlatObj.FTripGetTrip = false;
        self._$cancelSheet.show();
        $('button.btn-thong-ke').removeClass('active');
        self._$sheet.removeClass('thong-ke-tb');
        var isHasRoute = self._reloadFlatObj();
        if (!isHasRoute) return false;
        //Update post data
        var obj = self._createGetSeatObj();
        var completeReloadSheet = function (u, r, l, t) {
            if (u != 1) return;
            //Clear ticket from seat
            self._clearTicket();
            self._clearCancelled();
            self._clearNotCome();
            self._checkAllowedSeats();
            if (l > 0) self._mapTicketToSeat(r); //Map ticket to seat matrix
            //Render UI
            self._renderTripInfo();
            if (self._isOrderring) {
                self._renderPickupTicket();
                if (self._hasMergeTransfer()) {
                    self._reloadMergeTransferTicket();
                }
                self._renderTransferTicket();
            } else if (!self._grid) {
                self._lrenderSeatTemplate();
                self._lrenderCancelledTicket();
            } else {
                self._renderSeatTemplate();
                self._renderCancelledTicket();
                self._renderNotComeTicket();
            }

            if (typeof afterReloadSheet != "undefined" && typeof afterReloadSheet === "function") {
                afterReloadSheet.call();
            }

            // remove request in array oRq.cRqs
            if (oRq.iAc) {
                self._resetAjaxRequest();
            }
        };

        //Submit query
        if (!$.isEmptyObject(obj)) {
            vRqu(obj, completeReloadSheet);
            //self._submitAction(obj, completeReloadSheet);
        } else {
            //Clear ticket from seat
            self._reloadFrame();
        }
        return true;
    },
    _createGetSeatObj: function () {
        var self = this;

        //Get filter form data
        var departureTime = self._getDepartureTime();
        var obj = {};
        if ($.isEmptyObject(departureTime)) {
            //alert('Không tìm thấy giờ chạy, vui lòng chọn chuyến khác');
            $("body").trigger('timeNotFound');
            return {};
        }
        //obj._a = "GetBookingTicket";
        obj._a = "fGetTicket";
        obj._c = {
            TripId: self._cTripId,
            TripDate: departureTime.toFormatString("iso"),
            //Status: '(($x) = 1 OR ($x) = 2 OR ($x) = 3 OR ($x) = 4 OR ($x) = 5 OR ($x) = 8)' //STATUS
            Status: '(($x) IN(' + _dict._tks.join() + '))' //STATUS
        };
        //obj._f = "Id, TripId, AgentId, TripDate, SeatCode, IssueDate, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Serial, PaymentInfo, IsPrgHistoryInfo, Code, PassCode, FromValid, ToValid, IsPrgUpdatedDate, AgentInfo";
        obj._f = _dict._tgF.join();

        return obj;
    },
    _clearTicket: function () {
        var self = this;
        self._cphoneSt = [];
        self._cCodeSt = [];
        $.each(self._m, function (i, c) {
            if (typeof c != "undefined") {
                $.each(c, function (j, r) {
                    if (typeof r != "undefined") {
                        $.each(r, function (k, s) {
                            if (typeof s != "undefined" && s != null) {
                                s._tickets = [];
                                //s._changeStatus(1);
                            }
                        });
                    }

                });
            }

        });
    },
    _clearCancelled: function () {
        var self = this;
        self._c = [];
        self._$cancelSheet.empty();
    },
    _clearNotCome: function () {
        var self = this;
        self._nc = [];
        self._$notComeSheet.empty();
    },
    _reloadAllowedSeats: function () {
        var self = this;
        self._allowedSeats = [];
        self._allAllowedSeats = [];
        var obj = self._createAllowedSeatObj();
        var complete = function (u, r, l, t) {
            if (u != 1) {
                self._allowBookAllSeat = true;
                return;
            }
            if (l >= 1) {
                self._mapDataAllowedSeat(r);
            }
            else {
                self._allowBookAllSeat = true;
            }
        }
        this._submitAction(obj, complete);
    },
    _createAllowedSeatObj: function () {
        var self = this;
        var obj = {
            _a: 'fGetBus_Tickets_Status',
            _c: {
                XTypeId: "($x in (2,5))",
                XTripId: self._cTripId,
                XStatus: 1,
                IsPrgStatus: "($x is null or $x != 3)"
            },
            _f: 'Id,XTypeId,XAgentId,XBranchId,XOperatorId,XCompanyId,XRouteId,XTripId,XDate,XTime,XStatus,Info,TimeLimit'
        };
        return obj;
    },
    _mapDataAllowedSeat: function (records) {
        var self = this;
        self._allAllowedSeats = [];
        $.each(records, function (_, data) {
            var date = vIsEstStr(data[8]) ? vGtDtObj(data[8]) : null;
            var time = data[9];
            var info = data[11];
            var timeLimit = data[12];
            var tt = '';
            if (!vIsEstStr(time)) {
                tt = '';
            } else {
                //tt = moment(time, 'HH:mm:ss').format('HH:mm');
                tt = vPrsTm(time);
            }
            var item = {
                Date: date,
                Time: tt,
                Info: info,
                TimeLimit: parseInt(data[12])
            };
            self._allAllowedSeats.push(item);
        });
    },
    _checkAllowedSeats: function () {
        var self = this;
        var apply = false;
        var stop = false;

        $.each(self._allAllowedSeats, function (_, v) {
            if (!stop) {
                if (!$.isEmptyObject(v.Date)) {
                    if (vGetDateOnly(v.Date) == vDtToStr('dd-mm-yyyy', self._cTripDate)) {
                        //console.log('Block seat', 'Same date');
                        if (!vIsEstStr(v.Time) || v.Time == self._cTripTime) {
                            //console.log('Block seat', 'Same time');
                            apply = self._getAllowedSeats(v);
                            if (v.Time == self._cTripTime) stop = true;
                        }
                    }
                } else {
                    //console.log('Block seat', 'Same date (null)');
                    if (!vIsEstStr(v.Time) || v.Time == self._cTripTime) {
                        //console.log('Block seat', 'Same time');
                        apply = self._getAllowedSeats(v);;
                    }
                }
            }
        });
        if (apply) {
            var now = new Date();
            now.addMinutes(app.onlineTimeLimit);
            var dptD = self._cTripDate;
            if (dptD < now) {
                self._allowBookAllSeat = true;
                self._allowedSeats = [];
                //console.log('time over');
            }
            return;
        }
        self._allowBookAllSeat = true;
        self._allowedSeats = [];
        return;
    },
    _getAllowedSeats: function (v) {
        var self = this;
        var info = v.Info;
        self._allowBookAllSeat = true;
        self._allowedSeats = [];
        if (vIsEstStr(info) && info.indexOf('~') > 0) {
            var seats = info.split('~');
            var enBms = parseInt(seats[0]);
            var count = parseInt(seats[1]);
            if (enBms == 1) {
                if (count < 1000) {
                    for (var i = 2; i < seats.length; i++) {
                        var p = seats[i].split("|");
                        var coach = parseInt(p[1]);
                        var row = parseInt(p[2]);
                        var column = parseInt(p[3]);
                        if (typeof self._allowedSeats[coach] == 'undefined') {
                            self._allowedSeats[coach] = [];
                        }
                        if (typeof self._allowedSeats[coach][row] == 'undefined') {
                            self._allowedSeats[coach][row] = [];
                        }
                        self._allowedSeats[coach][row][column] = p[0];
                    }
                    self._allowBookAllSeat = false;
                    app.onlineTimeLimit = v.TimeLimit;
                    return true;
                }
            }
        }
        return false;
    },
    _mapTicketToSeat: function (data) {
        var self = this;
        $.each(data, function (i, v) {
            var t = self._createTicketFromRecord(v);
            if (!$.isEmptyObject(t)) {
                //Parse match seat
                var s = v[4].split('|');
                var coach = parseInt(s[1]);
                var row = parseInt(s[2]);
                var col = parseInt(s[3]);
                if (!isNaN(coach) && !isNaN(row) && !isNaN(col)) {
                    if (typeof self._m[coach - 1] != "undefined" && typeof self._m[coach - 1][row - 1] != "undefined" && typeof self._m[coach - 1][row - 1][col - 1] != "undefined") {
                        //Add ticket to seat
                        var seat = self._m[coach - 1][row - 1][col - 1];
                        if (t._isNotCome()) {
                            var ncseat = seat._clone();
                            //ncseat._changeStatus(4);
                            ncseat._tickets = [];
                            ncseat._addTicket(t, self._cStageCode);
                            if (typeof self._nc[coach - 1] == "undefined") {
                                self._nc[coach - 1] = [];
                            }
                            self._nc[coach - 1].push(ncseat);
                        } else if (t._isCancelled()) {
                            if (t._pcode == null || t._pcode == "") {
                                var cseat = seat._clone();
                                //cseat._changeStatus(3);
                                cseat._tickets = [];
                                cseat._addTicket(t, self._cStageCode);
                                if (typeof self._c[coach - 1] == "undefined") {
                                    self._c[coach - 1] = [];
                                }
                                self._c[coach - 1].push(cseat);
                            }

                        } else if (!t._isValid() && !t._isOpen()) {
                            if (seat._isAvailable()) { //Seat is availble
                                seat._addTicket(t, self._cStageCode);
                                //Statistic customer buy multiple seat
                                self._updateCPhoneSt(seat, t);
                                self._updateCCodeSt(seat, t);
                            }
                        }
                    }
                }
            }
        });
    },
    _getCurrentTripInfo: function () {
        if (FlatObj.cTripInfo != null) {
            return FlatObj.cTripInfo;
        }
        var self = this;
        var result = {
            _vehicleNumber: "",
            _driverName: "",
            _assistantName: "",
            _guideName: ""
        };
        var cTrip = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus];
        if (vIsEstStr(cTrip.T)) {
            if (vIsEstStr(cTrip.V) && !vIsEstStr(cTrip.V.split('~')[1].split('|')[3])) {
                result['_vehicleName'] = cTrip.V.split('~')[1].split('|')[3];
            } else {
                result['_vehicleName'] = cTrip.T.split('~')[1].split('|')[5];
            }
        }
        if (vIsEstStr(cTrip.V)) {
            result['_vehicleNumber'] = cTrip.V.split('~')[1].split('|')[2];
        }
        if (vIsEstStr(cTrip.Dr)) {
            var teamInfo = cTrip.Dr.split('~');
            teamInfo.shift();
            var dr = [];
            var ast = [];
            var guide = [];
            $.each(teamInfo, function (i, v) {
                if (typeof v != "undefined" && v != null) {
                    var info = v.split('|');
                    switch (parseInt(info[0])) {
                        case 2: //Tài xế
                            dr.push(info[2]);
                            break;
                        case 4: //Lơ
                            ast.push(info[2]);
                            break;
                        case 5: //Hướng dẫn viên
                            guide.push(info[2]);
                            break;
                        default:
                            break;
                    }
                }
            });
            result['_driverName'] = dr.length > 0 ? dr.join(", ") : "";
            result['_assistantName'] = ast.length > 0 ? ast.join(", ") : "";
            result['_guideName'] = guide.length > 0 ? guide.join(", ") : "";
        }
        if (vIsEstStr(cTrip.N)) {
            result['_note'] = '<br/><strong class="vred">Chú ý:&nbsp;' + cTrip.N + '</strong>';
        }

        //Total
        var numPaid = 0;
        var numBooking = 0;
        var numAvail = 0;
        var numPaidPerType = {};
        var numBookingPerAgent = {};
        var totalPaidPerType = {};
        var totalBookingPerAgent = {};
        var totalPaid = 0;
        var totalMoney = 0;
        $.each(self._m, function (_, c) {
            if (typeof c != "undefined") {
                $.each(c, function (__, r) {
                    if (typeof r != "undefined") {
                        $.each(r, function (___, s) {
                            if (typeof s != "undefined" && s != null) {
                                if (s._isAvailable()) {
                                    if (!s._hasTicket()) {
                                        numAvail++;
                                    } else {
                                        $.each(s._tickets, function (i, t) {
                                            if (t._isPaid() || t._isPass()) {
                                                var pInfo = t._getPaymentInfo();
                                                if (!$.isEmptyObject(pInfo)) {
                                                    switch (pInfo.type) {
                                                        case 1:
                                                        case 6:
                                                            if (typeof pInfo.info != "undefined") {
                                                                var b = pInfo.info._code;
                                                                if (typeof numPaidPerType[b] == "undefined") {
                                                                    numPaidPerType[b] = 0;
                                                                    totalPaidPerType[b] = 0;
                                                                }
                                                                numPaidPerType[b]++;
                                                                totalPaidPerType[b] += t._fare;
                                                                totalMoney += t._fare;
                                                                totalPaid += t._fare;
                                                            }
                                                            break;
                                                        case 2:
                                                        case 3:
                                                        case 4:
                                                            //var sName = pInfo.sname;
                                                            //if (typeof numBookingPerAgent[sName] == "undefined") {
                                                            //    numBookingPerAgent[sName] = 0;
                                                            //    totalBookingPerAgent[sName] = 0;
                                                            //}
                                                            //numBookingPerAgent[sName]++;
                                                            //totalBookingPerAgent[sName] += t._fare;
                                                            //totalMoney += t._fare;
                                                            //numBooking++;
                                                            //if (numPaid > 0) {
                                                            //    numPaid--;
                                                            //} else {
                                                            //    numPaid = 0;
                                                            //}
                                                            var sName = pInfo.sname;
                                                            if (typeof numPaidPerType[sName] == "undefined") {
                                                                numPaidPerType[sName] = 0;
                                                                totalPaidPerType[sName] = 0;
                                                            }
                                                            numPaidPerType[sName]++;
                                                            totalPaidPerType[sName] += t._fare;
                                                            totalPaid += t._fare;
                                                            totalMoney += t._fare;
                                                            break;
                                                        case 5:
                                                        case 7:
                                                            var sssName = pInfo.sname;
                                                            if (typeof numPaidPerType[sssName] == "undefined") {
                                                                numPaidPerType[sssName] = 0;
                                                                totalPaidPerType[sssName] = 0;
                                                            }
                                                            numPaidPerType[sssName]++;
                                                            totalPaidPerType[sssName] += t._fare;
                                                            totalPaid += t._fare;
                                                            totalMoney += t._fare;
                                                            break;
                                                        case 8:
                                                        case 9:
                                                            var ssName = pInfo.sname;
                                                            if (typeof numPaidPerType[ssName] == "undefined") {
                                                                numPaidPerType[ssName] = 0;
                                                                totalPaidPerType[ssName] = 0;
                                                            }
                                                            numPaidPerType[ssName]++;
                                                            totalPaidPerType[ssName] += 0;
                                                            totalMoney += 0;
                                                            break;
                                                        case 10:
                                                            if (typeof numPaidPerType[pInfo.sname] == "undefined") {
                                                                numPaidPerType[pInfo.sname] = 0;
                                                                totalPaidPerType[pInfo.sname] = 0;
                                                            }
                                                            numPaidPerType[pInfo.sname]++;
                                                            totalPaidPerType[pInfo.sname] += t._fare;
                                                            totalMoney += t._fare;
                                                            totalPaid += t._fare;
                                                            break;
                                                    }
                                                }
                                                numPaid++;
                                            } else if (t._isBooking()) {
                                                var aInfo = t._getAgentInfo();
                                                if (!$.isEmptyObject(aInfo)) {
                                                    if (typeof numBookingPerAgent[aInfo._code] == "undefined") {
                                                        numBookingPerAgent[aInfo._code] = 0;
                                                        totalBookingPerAgent[aInfo._code] = 0;
                                                    }
                                                    numBookingPerAgent[aInfo._code]++;
                                                    totalBookingPerAgent[aInfo._code] += t._fare;
                                                    totalMoney += t._fare;
                                                }
                                                numBooking++;
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });

        result["_numPaid"] = numPaid;
        result["_numBooking"] = numBooking;
        result["_numAvail"] = numAvail;
        if (numPaid > 0) {
            result["_numPaidPerType"] = [];
            result["_totalPaidPerType"] = [];
            result["_tkNumPaidPerType"] = [];
            $.each(numPaidPerType, function (k, t) {
                if (typeof t != "undefined") {
                    $.each(totalPaidPerType, function (m, n) {
                        if (m == k) {
                            result["_totalPaidPerType"].push(k + ":&nbsp;" + t + "&nbsp;-&nbsp;" + n.toMn() + " đ");
                            result["_tkNumPaidPerType"].push(k + "|" + t + "|" + n);
                        }
                    });
                    result["_numPaidPerType"].push(k + ":&nbsp;" + t);
                }
            });
            result["_numPaidPerType"] = "&nbsp;(" + result["_numPaidPerType"].join() + ")";
            result["_totalPaidPerType"] = result["_totalPaidPerType"].join(", &nbsp;");
            //result["_totalPaidPerType"] = result["_totalPaidPerType"].join("<br />&nbsp;&nbsp;");

        }

        if (numBooking > 0) {
            result["_numBookingPerAgent"] = [];
            result["_totalBookingPerAgent"] = [];
            $.each(numBookingPerAgent, function (k, t) {
                if (typeof t != "undefined") {
                    $.each(totalBookingPerAgent, function (e, f) {
                        if (e == k) {
                            result["_totalBookingPerAgent"].push(k + ":&nbsp;" + t + "&nbsp;-&nbsp;" + f.toMn() + "đ");
                        }
                    });
                    result["_numBookingPerAgent"].push(k + ":&nbsp;" + t);
                }
            });
            result["_numBookingPerAgent"] = "&nbsp;(" + result["_numBookingPerAgent"].join() + ")";
            result["_totalBookingPerAgent"] = result["_totalBookingPerAgent"].join(", ");

        }
        result["_total"] = numPaid + numBooking;
        result["_totalPaid"] = totalPaid;
        result["_numBooking"] = numBooking;
        result["_totalMoney"] = totalMoney != 0 ? totalMoney.toMn() + " đ" : "";

        // thống kê theo chuyến
        result["_mainFareTienKhach"] = totalPaid;
        result["_anotherFareTienKhach"] = 0;
        result["_nameAnotherFareTienKhach"] = "";
        result["_feeTienKhach"] = 0;
        result["_nameFeeTienKhach"] = "";
        // parse thông tin tiền khách
        if (cTrip.PassengerMoney != null) {
            var i = cTrip.PassengerMoney.indexOf('~');
            var passengerMoneys = cTrip.PassengerMoney.substr(i, cTrip.PassengerMoney.length).split('|');
            //result["_mainFareTienKhach"] = passengerMoneys[0].toNum();
            var splitLv1 = passengerMoneys[1].split('##');
            result["_nameAnotherFareTienKhach"] = splitLv1[0] != null ? splitLv1[0] : '';
            result["_anotherFareTienKhach"] = splitLv1[1] != null ? splitLv1[1].toNum() : 0;
            var splitLv2 = passengerMoneys[2].split('##');
            result["_nameFeeTienKhach"] = splitLv2[0] != null ? splitLv2[0] : '';
            result["_feeTienKhach"] = splitLv2[1] != null ? splitLv2[1].toNum() : 0;
        }

        // parse thông tin các văn phòng nhận hàng

        result["_branchReceiveProduct"] = [];
        var branchProduct = self._data[self._cTripIndex].BranchReceiveProduct;
        if (branchProduct != null) {
            var li = branchProduct.indexOf('~');
            var branch = branchProduct.substr(li + 1, branchProduct.length).split('~');
            $.each(branch, function (lu, lo) {
                var los = lo.split('|');
                var di = {
                    _id: los[0],
                    _code: los[2]
                }
                result["_branchReceiveProduct"].push(di);
            });
        }

        // parse thông tin tiền hàng
        result["_numPickedProPaid"] = 0;
        result["_moneyPickedProPaid"] = 0;
        result["_numPickedProNotPaid"] = 0;
        result["_moneyPickedProNotPaid"] = 0;
        result["_branchProduct"] = [];
        result["_totalMoneyBranchNotPaid"] = 0;
        result["_totalMoneyBranchPaid"] = 0;
        result["_totalNumBranchNotPaid"] = 0;
        result["_totalNumBranchPaid"] = 0;
        result["_feeTienHang"] = 0;
        result["_nameFeeTienHang"] = "";
        if (cTrip.ProductMoney != null) {
            var j = cTrip.ProductMoney.indexOf('~');
            var productMoneys = cTrip.ProductMoney.substr(j + 1, cTrip.ProductMoney.length).split('~');
            // tiền hàng văn phòng ở vị trí 0
            // lưu theo nhiều văn phòng
            // BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid,BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid
            if (vIsEstStr(productMoneys[0])) {
                var branchs = productMoneys[0].split(',');
                $.each(branchs, function (o, v) {
                    var branchCode = v.substr(0, v.indexOf(':'));
                    var branchMoney = v.substr(v.indexOf(':') + 1, v.length);
                    var branchMoneys = branchMoney.split('##');
                    var branchMoneyPaids = branchMoneys[0].split('|');
                    var branchMoneyNotPaids = branchMoneys[1].split('|');
                    var d = {
                        _branchCode: branchCode,
                        _numBranchProPaid: branchMoneyPaids[0].toNum(),
                        _moneyBranchProPaid: branchMoneyPaids[1].toNum(),
                        _numBranchProNotPaid: branchMoneyNotPaids[0].toNum(),
                        _moneyBranchProNotPaid: branchMoneyNotPaids[1].toNum()
                    }
                    result["_branchProduct"].push(d);
                    result["_totalMoneyBranchNotPaid"] += branchMoneyNotPaids[1].toNum();
                    result["_totalMoneyBranchPaid"] += branchMoneyPaids[1].toNum();
                    result["_totalNumBranchNotPaid"] += branchMoneyNotPaids[0].toNum();
                    result["_totalNumBranchPaid"] += branchMoneyPaids[0].toNum();
                });
            }

            // tiền hàng dọc đường ở vị trí 1
            var pickedMoneys = productMoneys[1].split('##');
            var pickedMoneyPaids = pickedMoneys[0].split('|');
            var pickedMoneyNotPaids = pickedMoneys[1].split('|');
            result["_numPickedProPaid"] = pickedMoneyPaids[0].toNum();
            result["_moneyPickedProPaid"] = pickedMoneyPaids[1].toNum();
            result["_numPickedProNotPaid"] = pickedMoneyNotPaids[0].toNum();
            result["_moneyPickedProNotPaid"] = pickedMoneyNotPaids[1].toNum();

            // chi phí tiền hàng ở vị trí số 2
            var splitLv3 = productMoneys[2].split('##');
            result["_nameFeeTienHang"] = splitLv3[0] != null ? splitLv3[0] : '';
            result["_feeTienHang"] = splitLv3[1] != null ? splitLv3[1].toNum() : 0;
        }

        // parse thông tin chi phí
        result["_tollFee"] = 0;
        result["_washFee"] = 0;
        result["_eatFee"] = 0;
        result["_anotherFee"] = [];
        if (cTrip.FeeMoney != null) {
            var k = cTrip.FeeMoney.indexOf('~');
            var feeMoneys = cTrip.FeeMoney.substr(k + 1, cTrip.FeeMoney.length).split('~');
            // phí cầu đường ở vị trí số 0
            // phí rửa xe ở vị trí số 1
            // phí ăn ở vị trí số 2
            // các chi phí khác ở vị trí số 3
            result["_tollFee"] = feeMoneys[0].toNum();
            result["_washFee"] = feeMoneys[1].toNum();
            result["_eatFee"] = feeMoneys[2].toNum();
            var anotherFeeStr = feeMoneys[3];
            var anotherFees = anotherFeeStr.split('##');
            $.each(anotherFees, function (sa, sl) {
                var split1 = sl.split('|');
                var df = {
                    _index: split1[0],
                    _name: split1[1] == null ? "" : split1[1],
                    _money: split1[2] == null ? 0 : split1[2]
                }
                result["_anotherFee"].push(df);
            });
        }
        return result;
    },
    _resetAjaxRequest: function () {
        vRqz();
    },

    /************************************************************************
    * RENDER                                                                *
    *************************************************************************/
    _renderSeatTemplate: function () {
        var self = this;

        //var tInfo = self._getCurrentTripInfo();
        var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
        var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
        // parse vehicle info
        var vehicleNumber = "";
        var vehicleInfo = self._data[self._cTripIndex].Ts[self._cTripTime][0].V;
        if (typeof vehicleInfo != "undefined" && vehicleInfo != null) {
            var splitV = vehicleInfo.substr(vehicleInfo.indexOf('~') + 1, vehicleInfo.length).split('|');
            vehicleNumber = splitV[2];
        }

        self._clearSheet(); //Clear sheet
        var numSeat = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].NS;
        //Transform matrix for shown template
        var srule = null;
        if (typeof _dict._specialPos != "undefined" && typeof _dict._specialPos[numSeat] != "undefined") {
            srule = _dict._specialPos[numSeat];
        }

        var sMatrix = self._transformSeatMatrix(srule);
        //Show seat each on coach, each coach have max column (tplNumCol)
        var cIndex = 0;
        var hasBPermit = self._hasBookingPermission();
        var notallow = true;
        $.each(sMatrix, function (ix, cx) {
            if (typeof cx != "undefined") {
                //Create coach
                var $c = self._createCoach(self._$sheet).addClass(_dict._g[self._numCoach - 1]);
                if (self._numCoach > 1) {
                    $c.addClass(_dict._chcl[cIndex % 2]);
                }
                $.each(cx, function (jx, rx) {
                    if (typeof rx != "undefined") {
                        $.each(rx, function (kx, s) {
                            if (typeof s != "undefined" && s != null) {
                                //Current StageCode get from From-To Points
                                var ticket = s._getCurrentTicket();
                                var nTicketPerTrip = 0;
                                if (!$.isEmptyObject(ticket)) {
                                    if (!_dict._allowGroupByCode) {
                                        if (typeof self._cphoneSt[ticket._getDefaultPhoneNumber()] != "undefined") {
                                            nTicketPerTrip = self._cphoneSt[ticket._getDefaultPhoneNumber()].length;
                                        }
                                    } else {
                                        if (typeof self._cCodeSt[ticket._getTicketCode()] != "undefined") {
                                            nTicketPerTrip = self._cCodeSt[ticket._getTicketCode()].length;
                                        }
                                    }
                                }
                                var numOfStages = self._data[self._cTripIndex].StopPoints.data.length;
                                var isStageBooking = self._isStageBooking();
                                if (!self._allowBookAllSeat) {
                                    if (typeof self._allowedSeats[s._coach] != 'undefined' && typeof self._allowedSeats[s._coach][s._row] != 'undefined' && typeof self._allowedSeats[s._coach][s._row][s._col] != 'undefined') {
                                        notallow = false;
                                    }
                                    else {
                                        notallow = true;
                                    }
                                    if (app.cid != app.vid) notallow = !notallow;
                                }
                                else notallow = false;
                                var $seat = s._renderSeat(nTicketPerTrip, hasBPermit, self._cStageCode, numOfStages, self._data[self._cTripIndex].StopPoints, isStageBooking, self._cMaxStageCode, closedStatus, '', tripDetailId, vehicleNumber, notallow, self._cTripId);
                                if (self._fMoving) {
                                    var isMoving = false;
                                    $.each(self._movingStack, function (ii, v) {
                                        if (!isMoving) {
                                            var t = v._getCurrentTicket();
                                            if (t._id == ticket._id) {
                                                isMoving = true;
                                            }
                                        }
                                    });

                                    if (isMoving) {
                                        $seat.addClass(_dict._slc[0]);
                                    }
                                } else if (self._existingSeatStack(s)) {
                                    $seat.addClass('selected');
                                }

                                //Bind event on seat
                                if (s._isAvailable() && ((ticket._type != 2) || (ticket._type == 2 && app.rights.indexOf($.rights.bEdtOnlTic.val) >= 0))) {
                                    self._bindEventOnSeat($seat, s);
                                }
                                var seatTemplateId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['SeatTemplateId'];
                                if (_dict._specialNumColBySeatTemplateId != undefined && _dict._specialNumColBySeatTemplateId[seatTemplateId] != undefined) {
                                    $seat.addClass(_dict._g[_dict._specialNumColBySeatTemplateId[seatTemplateId] - 1]).addClass(_dict._sg[_dict._specialNumColBySeatTemplateId[seatTemplateId] - 1]).addClass(_dict._mg[_dict._specialNumColBySeatTemplateId[seatTemplateId] - 1]);
                                } else {
                                    $seat.addClass(_dict._g[_dict._tplNumCol - 1]).addClass(_dict._sg[_dict._tplNumCol - 1]).addClass(_dict._mg[_dict._tplNumCol - 1]);
                                }
                                $c.append($seat); //Append to row
                            }
                        });
                    }
                });
                cIndex++;
            }
        });
        self._bindNumStageTicketsTooltips();

        // kiểm tra nếu đang trong quá trình đổi vé, đặt thêm vé, đặt vé khứ hồi thì gán lại sự kiện con trỏ chuột
        if (self._fMoving) {
            self._bindEventMoving();
        } else if (self._hasCopyTicket) {
            self._bindEventCopying();
        } else if (self._hasBookReturnTicket) {
            self._bindEventBookReturnTicket();
        }
    },
    _renderTripInfo: function () {
        var self = this;
        // đã chạy fTripGetTrip rồi nhưng nếu là lần đầu tiên load sẽ không load lại
        if (FlatObj.LFTime) {
            FlatObj.FTripGetTrip = true;
        }
        self._reloadData();
        self._$tripInfo.empty();
        FlatObj.cTripInfo = null;
        FlatObj.cTripInfo = self._getCurrentTripInfo(); // client cached to use in the next time
        var tInfo = FlatObj.cTripInfo;
        var data = { "trip": tInfo };
        var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['ClosedStatus'];
        //var rDepartTime = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['RealDepartureTime'];
        var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['TripDetailId'];
        //console.log(self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]);
        //if (app.rights.indexOf($.rights.bDpt.val) != -1 || app.rights.indexOf("5|10097|1") != -1) {
        if (tripDetailId) {
            switch (closedStatus) {
                case 1:
                    self._hideXuatBenButton();
                    self._$tripInfo.html(vtpl(_dict._tInfoClosedTpl, data));
                    //console.log(rDepartTime);
                    break;
                case 2:
                    self._hideXuatBenButton();
                    self._$tripInfo.html(vtpl(_dict._tInfoChotPhoiTpl, data));
                    break;
                default:
                    self._showXuatBenButton();
                    self._$tripInfo.html(vtpl(_dict._tInfoTpl, data));
                    break;
            }
        } else {
            self._showXuatBenButton();
            self._$tripInfo.html(vtpl(_dict._tInfoTpl, data));
        }
        //} else {
        //    self._$tripInfo.html(vtpl(_dict._tInfoTpl, data));
        //}

    },
    _clearSheet: function () {
        this._$sheet.empty();
    },
    _createNoSeat: function () {
        return $('<li />')
            .addClass('seat noseat');
    },
    _createSeatFromRecord: function (r) {
        var s = {};
        if (_dict._ts.indexOf(parseInt(r[2])) != -1) {
            s = new S(parseInt(r[5]), parseInt(r[6]), parseInt(r[7]), parseInt(r[0]), "seat", r[3], parseInt(r[2]));
        }
        return s;
    },
    _createTicketFromRecord: function (record) {
        var self = this;
        var status = parseInt(record[8]);
        var alias = parseInt(record[22]);
        if (alias == self._cTripBus) { //Alias
            var id = parseInt(record[0]);

            var issue = vPrsDt(record[5]);
            var pdate = vPrsDt(record[6]);

            var fare = parseInt(record[9]);
            if (isNaN(fare)) {
                fare = 0;
            }
            var note = record[10];
            var pInfo = record[11];
            var seri = record[12];
            var pmInfo = record[13];
            if (null == pmInfo) {
                pmInfo = "";
            }
            var hInfo = record[14];
            var code = record[15];
            var pcode = record[16];

            var fromValid = vPrsDt(record[17]);
            var toValid = vPrsDt(record[18]);
            var updatedDate = vPrsDt(record[19]);
            var aInfo = record[20];
            var surCharge = parseInt(record[21]);
            if (isNaN(surCharge)) {
                surCharge = 0;
            }
            var deposit = parseInt(record[26]);
            if (isNaN(deposit)) {
                deposit = 0;
            }
            var discount = parseInt(record[27]);
            if (isNaN(discount)) {
                discount = 0;
            }
            var debt = parseInt(record[29]);
            if (isNaN(debt)) {
                debt = 0;
            }
            var suser = record[23];
            var cuser = record[24];
            var stageCode = parseInt(record[25]);
            var tripId = parseInt(record[1]);

            var dept = vPrsDt(record[3]), cid = 0, cname = "", cphone = "";

            var ci = record[7];
            if (ci != null) {
                ci = ci.split('|');
                cid = parseInt(ci[2]);
                cname = ci[3];
                cphone = ci[4];
            }

            var fromArea = record[28];
            var toArea = record[29];

            var seatType = parseInt(record[30]);
            if (isNaN(seatType)) {
                seatType = 1;
            }
            var canceledDate = record[32];
            var cancelInfo = record[33];
            var type = record[34];
            var chargeDate = record[35];
            var sNote = record[36];
            var responUser = record[37];
            var porDate = record[38];
            
            var re = new T(id, dept, cid, cname, cphone, status, issue, pdate, fare, note, pInfo, seri, pmInfo, hInfo, code, pcode, fromValid, toValid, updatedDate, aInfo, surCharge, suser, cuser, stageCode, tripId, deposit, discount, fromArea, toArea, seatType, debt, canceledDate, cancelInfo, type, chargeDate, sNote);
            re.agentId = record[2];
            return re;
        }
        return {};
    },
    _createCoach: function (container) {
        var $r = $('<ul />').addClass('coach vbooking-coach')
            .appendTo(container);

        return $r;
    },
    _notFoundResult: function () {
        var self = this;

        $('<div />')
            .addClass(_dict._g[self._numCoach - 1])
            .append($('<div />').addClass('alert alert-danger')
                .html("<strong>Không tìm thấy chuyến.</strong>  Vui lòng chọn ngày giờ khác"))
            .appendTo(self._$sheet);
    },
    _renderCancelledTicket: function () {
        var self = this;
        if (self._c.length > 0) {
            self._$cancelSheet.append($('<h4 />').addClass('sheet-title').html('Vé đã hủy'));
            var cIndex = 0;
            var hasBPermit = self._hasBookingPermission();
            $.each(self._c, function (ix, cx) {
                if (typeof cx != "undefined" && cx != null) {
                    var $c = self._createCoach(self._$cancelSheet).addClass(_dict._g[self._numCoach - 1]);
                    if (self._numCoach > 1) {
                        $c.addClass(_dict._chcl[cIndex % 2]);
                    }
                    var chunk = _dict._tplNumCol;
                    $.each(cx, function (_, s) {

                        if (typeof s != "undefined" && s != null) {
                            var ticket = s._getCurrentTicket();
                            // không hiện các vé đặt online
                            if (ticket._type != 2) {
                                var numOfStages = self._data[self._cTripIndex].StopPoints.data.length;
                                var isStageBooking = self._isStageBooking();
                                var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['ClosedStatus'];
                                var realDepartureTime = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['RealDepartureTime'];
                                var $seat = s._renderSeat(0, hasBPermit, self._cStageCode, numOfStages, self._data[self._cTripIndex].StopPoints, isStageBooking, self._cMaxStageCode, closedStatus, realDepartureTime).addClass(_dict._g[chunk - 1]).addClass(_dict._sg[chunk - 1]).addClass(_dict._mg[chunk - 1]);

                                if (self._fMoving) {
                                    var isMoving = false;
                                    $.each(self._movingStack, function (ii, v) {
                                        if (!isMoving) {
                                            var t = v._getCurrentTicket();
                                            if (t._id == ticket._id) {
                                                isMoving = true;
                                            }
                                        }
                                    });

                                    if (isMoving) {
                                        $seat.addClass(_dict._slc[0]);
                                    }
                                }
                                //Bind event on seat
                                self._bindEventOnSeat($seat, s);
                                $c.append($seat); //Append to row
                            }
                        }
                    });
                    cIndex++;
                }
            });
        }
    },
    _renderNotComeTicket: function () {
        var self = this;
        if (self._nc.length > 0) {
            self._$notComeSheet.append($('<h4 />').addClass('sheet-title').html('Hành khách không đến'));
            var cIndex = 0;
            var hasBPermit = self._hasBookingPermission();
            $.each(self._nc, function (ix, cx) {
                if (typeof cx != "undefined" && cx != null) {
                    var $c = self._createCoach(self._$notComeSheet).addClass(_dict._g[self._numCoach - 1]);
                    if (self._numCoach > 1) {
                        $c.addClass(_dict._chcl[cIndex % 2]);
                    }
                    var chunk = _dict._tplNumCol;
                    $.each(cx, function (_, s) {
                        if (typeof s != "undefined" && s != null) {
                            var numOfStages = self._data[self._cTripIndex].StopPoints.data.length;
                            var isStageBooking = self._isStageBooking();
                            var $seat = s._renderSeat(0, hasBPermit, self._cStageCode, numOfStages, self._data[self._cTripIndex].StopPoints, isStageBooking, self._cMaxStageCode).addClass(_dict._g[chunk - 1]).addClass(_dict._sg[chunk - 1]).addClass(_dict._mg[chunk - 1]);
                            //Bind event on seat
                            self._bindEventOnSeat($seat, s);
                            $c.append($seat);
                        }
                    });
                    cIndex++;
                }
            });
        }
    },

    /************************************************************************
    * FORM                                                                  *
    *************************************************************************/
    _createForm: function (id, elements, cl, gl) {
        var self = this;
        var $f = $('<form />').attr('id', id).attr('role', 'form');
        if (typeof cl != "undefined") {
            $f.addClass(cl);
        }
        var els = [];
        var elhs = [];
        var maxRow = 0;
        var maxCol = 0;
        $.each(elements, function (_, el) {
            var row = el[0];
            var col = el[1];

            if (el[4] == "hidden") {
                elhs.push(el);
            } else {
                if (typeof els[row - 1] == "undefined") {
                    els[row - 1] = [];
                }
                if (typeof els[row - 1][col - 1] == "undefined") {
                    els[row - 1][col - 1] = [];
                }
                els[row - 1][col - 1].push(el);
            }
            if (maxRow < row) {
                maxRow = row;
            }
            if (maxCol < col) {
                maxCol = col;
            }
        });

        //Hidden element
        $.each(elhs, function (jx, he) {
            if (typeof he != "undefined") {
                var $hi = self._createFormInput(he[4], he[5], he[7]).addClass(he[6]);
                if (!$.isEmptyObject(he[8])) { //attr
                    $.each(he[8], function (k, v) {
                        $hi.attr(k, v);
                    });
                }
                $f.append($hi);
            }
        });

        //Element
        var $ct = self._createFormContainer();
        $ct.append($('<div class="alert alert-danger message-error" role="alert" style="margin:5px 0 0 0;display:none;" />'));
        $ct.append($('<div class="row" />').css('margin-top', '0')
                .append($('<div class="col-md-12 checkbox-route-point" />'))
            );
        for (var i = 0; i < maxRow; i++) {
            if (typeof els[i] != "undefined") {
                var $r = self._createFormRow();
                for (var j = 0; j < maxCol; j++) {
                    var $c = self._createFormCol();
                    if (typeof els[i][j] != "undefined") {
                        //var gcol = "";
                        var hasGroupCol = false;
                        $.each(els[i][j], function (__, elm) {
                            var $label = self._createFormLabel(elm[2]);
                            if ($label.length > 0) {
                                $label.addClass('col-md-4 col-sm-4 col-xs-12 pl0');
                            }
                            var $ig = self._createFormInputGroup().addClass('col-md-8 col-sm-8 col-xs-12');
                            switch (elm[3]) {
                                case "input":
                                    var $i = self._createFormInput(elm[4], elm[5], elm[7], elm[8]).addClass(elm[6]);
                                    var $addon = self._createFormInputAddon(elm[10]);
                                    switch (elm[4]) {
                                        case 'checkbox':
                                        case 'radio':
                                            $i.append("&nbsp; " + elm[2]);
                                            $ig.addClass('col-md-offset-4 col-sm-offset-4');
                                            break;
                                        default:
                                            $c.append($label);
                                            break;
                                    }
                                    $c.append($ig.append($i).append($addon));
                                    break;
                                case "select":
                                    var options = elm[9];
                                    if (elm[5] == "PaymentType") {
                                        options = [];
                                        $.each(_dict._pm, function (_, v) {
                                            if (v[2] == 1) {
                                                var value = v[0];
                                                var text = v[1][_dict._lang];
                                                options.push({
                                                    Value: value,
                                                    Text: text
                                                });
                                            }

                                        });
                                    }
                                    var $s = self._createFormSelect(elm[5], options, elm[7], elm[4], elm[8]).addClass(elm[6]);
                                    $c.append($label).append($ig.append($s));
                                    break;
                                case "textarea":
                                    var $t = self._createFormTextArea(elm[5], elm[7], elm[8]).addClass(elm[6]);
                                    $c.append($label).append($ig.append($t));
                                    break;
                                case "p":
                                    var $p = self._createFormText(elm[7], elm[8]).addClass(elm[6]);
                                    $c.append($p);
                                    break;
                                case "button":
                                    var $b = self._createFormButton(elm[4], elm[8]).addClass(elm[6]).append(elm[10]).append(elm[5]);
                                    $c.append($b);
                                    break;
                            }

                            if (typeof elm[11] != "undefined" && elm[11].length > 0) {
                                var merge = elm[11][1] - elm[11][0];
                                $c.addClass(_dict._g[maxCol - merge - 1]).addClass(_dict._mg[maxCol - merge - 1]);
                                hasGroupCol = true;
                                j += merge;
                            }
                        });
                        if (!hasGroupCol) {
                            $c.addClass(_dict._g[maxCol - 1]).addClass(_dict._sg[maxCol - 1]).addClass(_dict._mg[maxCol - 1]);
                        }
                    }
                    $r.append($c);
                }
                $ct.append($r);
            }
        }

        return $f.append($ct);
    },
    _createFormContainer: function () {
        return $('<div />').addClass('container-fluid');
    },
    _createFormRow: function (cl) {
        return $('<div />').addClass('row');
    },
    _createFormCol: function () {
        return $('<div />');
    },
    _createFormLabel: function (label) {
        if ("" != label) {
            return $('<label />').addClass("col-sm-4 control-label").text(label);
        }
        return "";
    },
    _createFormInputGroup: function () {
        return $('<div />').addClass('input-group');
    },
    _createFormInput: function (type, name, value, attrs) {
        var $result = $();
        switch (type) {
            case "checkbox":
            case "radio":
                $result = $('<label />').append($('<input />', { type: type, name: name, value: value }));
                break;
            default:
                $result = $('<input />', { type: type, name: name, value: value });
                break;
        }
        if (!$.isEmptyObject($result) && typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $result.attr(k, v);
                });
            }
        }

        return $result;
    },
    _createFormInputAddon: function (i) {
        if ("" != i) {
            return $('<div />').addClass('input-group-addon').append(i);
        }
        return "";
    },
    _createFormSelect: function (name, options, value, text, attrs) {
        var $s = $('<select />', { name: name });
        $s.append($('<option />', { value: "" }).text(text));
        $.each(options, function (_, opt) {
            $s.append($('<option />', { value: opt.Value }).text(opt.Text));
        });
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $s.attr(k, v);
                });
            }
        }
        return $s;
    },
    _createFormTextArea: function (name, text, attrs) {
        var $t = $('<textarea />', { name: name }).val(text);
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $t.attr(k, v);
                });
            }
        }
        return $t;
    },
    _createFormButton: function (type, attrs) {
        var $b = $('<button />', { type: type });
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $b.attr(k, v);
                });
            }
        }
        return $b;
    },
    _createFormText: function (text, attrs) {
        var $p = $('<p />').text(text);
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $p.attr(k, v);
                });
            }
        }
        return $p;
    },
    _resetForm: function (form) {
        form.find("input[type=hidden]").val("");
        form.find("input[type=text], textarea, select").val("");
        form.find("input[type=checkbox]").prop('checked', false);
        form.find("input[type=radio]").prop('checked', false);
        form.find('div.has-error').removeClass('has-error');
        form.find('div.search-result').remove();
    },
    _convertFormDataToObj: function (form) {
        var self = this;
        var paramObj = {};
        var disabled = null;
        if (self._hasCopyTicket || self._hasBookReturnTicket) {
            disabled = $(form).find(':input:disabled').removeAttr('disabled');
        }
        $.each($(form).serializeArray(), function (_, kv) {
            paramObj[kv.name] = kv.value;
        });
        if ((self._hasCopyTicket || self._hasBookReturnTicket) && disabled) {
            disabled.attr('disabled', 'disabled');
        }
        return paramObj;
    },
    _getDepartureTime: function () {
        var self = this;
        var departureTime = self._cTripDate;
        var ts = self._cTripTime.split(':');
        if (isNaN(parseInt(ts[0])) || isNaN(parseInt(ts[1]))) return {};
        departureTime.setHours(parseInt(ts[0]));
        departureTime.setMinutes(parseInt(ts[1]));
        return departureTime;
    },
    _getCustomer: function (cid, cname, cphone) {
        return $.trim('1|1|' + cid + '|' + cname + '|' + cphone);
    },
    _getPayment: function (key, text, code) {
        return $.trim(key + ':' + text + ':' + code);
    },
    _getHistory: function (action, data) {
        var self = this;
        var history = [self.options.cid, self.options.aid, self.options.uid, self.options.un, new Date().addMinutes(self._sOffsetMinute).toFormatString('iso'), action];
        history.push(JSON.stringify(data));

        return history.join('##');
    },
    _getCurrentFareById: function (fromId, toId) {
        var self = this;
        //if (app.oRights["StageEnable"]) {
        //    var fares = self._parseFares();
        //    var key = fromId + "|" + toId;
        //    var fare = fares[key];
        //    if (typeof fare == "undefined") return 0;
        //    return fare;
        //} else {
        //    return self._getCurrentFare();
        //}

        var fares = self._parseFares();
        var key = fromId + "|" + toId;
        var fare = fares[key];
        if (typeof fare == "undefined") return 0;
        return fare;

    },
    _getFareQuickBook: function (fromId, toId) {
        var self = this;
        var fares = self._parseFares();
        var key = fromId + "|" + toId;
        var fare = fares[key];
        if (typeof fare == "undefined") return 0;
        return fare;
    },
    _parseFares: function () {
        var self = this;
        var from = "";
        var to = "";
        var fare = 0;
        var fif = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].F;
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

    _getCurrentFare: function () {
        var self = this;
        var fare = 0;
        var fInfo = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus].F.split('~');
        if (fInfo.length > 0) {
            fare = parseInt(fInfo[1].split('|')[2]);
            if (isNaN(fare)) {
                fare = 0;
            }
        }
        return fare;
    },
    _getBranchInfo: function (bid) {
        var self = this;
        var result = "";
        $.each(self._info, function (_, b) {
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
    _getAgentInfo: function () {
        var self = this;
        return $.trim(self.options.aid + "|" + self.options.aite + "|" + self.options.aice + '|' + self.options.aisne);
    },
    _getPickupInfo: function (p, t, index) {
        if (typeof p == "undefined") {
            p = "";
        }
        if (typeof t == "undefined") {
            t = "";
        }
        if (typeof index == "undefined") {
            t = "";
        }
        return $.trim(p + '|' + t + "|" + index);
    },
    _createHistoryForm: function () {
        var self = this;
        return $('<div />').addClass('container-fluid')
            .append($('<div />').addClass('row history-row')
                .append($('<div />').addClass('col-sm-12')
                    .append($('<table />').addClass('table table-striped table-hover table-condensed')
                        .append($('<thead>')
                            .append($('<tr />')
                                .append($('<th />').text("NV"))
                                .append($('<th />').text("Tác vụ"))
                                .append($('<th />').text("Ngày"))
                                .append($('<th />').text("Cập nhật"))
                            )
                        )
                        .append($('<tbody />'))
                    )
                )
            )
            .append($('<div />').addClass('row action-row')
                .append($('<div />').addClass('col-md-12 list-btn')
                    .append(self._createFormButton('button').addClass('btn btn-default btn-close').text('Đóng')
                    )
                )
            );
    },
    _getTripById: function (id) {
        var self = this;
        var found = null;
        $.each(self._data, function (_, t) {
            if (found == null) {
                if (id == t.Id) {
                    found = t;
                }
            }
        });
        return found;
    },

    /************************************************************************
    * TABLE                                                                 *
    *************************************************************************/
    _createTable: function () {
        return $('<table />');
    },
    _createTableRow: function () {
        return $('<tr />');
    },
    _createTableCol: function (colspan) {
        var $td = $('<td />');
        if (colspan > 1) {
            $td.attr('colspan', colspan);
        }
        return $td;
    },
    _createTableHead: function () {
        return $('<thead />');
    },
    _createTableBody: function () {
        return $('<tbody />');
    },
    _createTableHeadCol: function (colspan) {
        var $th = $('<th />');
        if (colspan > 1) {
            $th.attr('colspan', colspan);
        }
        return $th;
    },

    /************************************************************************
    * MATRIX                                                                *
    *************************************************************************/
    _transformSeatMatrix: function (srule) {
        var self = this;
        var numCoach = 0;
        var numRow = 0;
        var numCol = 0;
        var result = [];
        self._printStageTickets = [];
        $.each(self._m, function (ix, vc) {
            if (typeof vc != "undefined") {
                $.each(vc, function (ir, vr) {
                    if (typeof vr != "undefined") {
                        $.each(vr, function (icl, s) {

                            if (typeof s != "undefined" && s != null && _dict._ts.indexOf(s._type) != -1) {
                                if (s._tickets && s._tickets.length >= 1) {
                                    var len = s._tickets.length;
                                    for (var i = 0; i < len; i++) {
                                        s._tickets[i]["seatLabel"] = s._label;
                                        self._printStageTickets.push(s._tickets[i]);
                                    }

                                }
                                var hash = s._coach + "_" + s._row + "_" + s._col;
                                if (srule != null && srule.hasOwnProperty(hash)) {
                                    var np = srule[hash];
                                    if (typeof result[np[0] - 1] == "undefined") {
                                        result[np[0] - 1] = [];
                                    }
                                    if (typeof result[np[0] - 1][np[1] - 1] == "undefined") {
                                        result[np[0] - 1][np[1] - 1] = [];
                                    }
                                    result[np[0] - 1][np[1] - 1][np[2] - 1] = s;
                                } else {
                                    if (typeof result[ix] == "undefined") {
                                        result[ix] = [];
                                    }
                                    if (typeof result[ix][ir] == "undefined") {
                                        result[ix][ir] = [];
                                    }
                                    result[ix][ir][icl] = s;
                                }
                            }
                        });
                    }
                });
            }
        });

        return result;
    },

    _responsiveDevice: function () {
        var me = this;
        me.adjustStyle($(window).width());
        $(window).resize(function () {
            me.adjustStyle($(window).width());
        });
    },

    adjustStyle: function (width) {
        width = parseInt(width);
        if (width <= 480) {
            $('.vbooking-sheet .seat').removeClass('col-xs-6').addClass('col-xs-12');
            $('.vbooking-csheet .seat').removeClass('col-xs-6').addClass('col-xs-12');
        } else {
            $('.vbooking-sheet .seat').removeClass('col-xs-12').addClass('col-xs-6');
            $('.vbooking-csheet .seat').removeClass('col-xs-12').addClass('col-xs-6');
        }
    },
    /************************************************************************
    * EVENT                                                                 *
    *************************************************************************/
    _resetAll: function (cb) {
        var self = this;
        self._resetSeatStack();
        self._resetMovingStack();
        self._unbindEventMoving();
        self._clearSelectedItem();
        self._closeUpdateDialog();
        self._closeCancelDialog();
        self._closeQuickBookForm();
        self._closeErrorDialog();
        self._clearSearchResult();
        self._clearSuggestCustomer();
        self._selectedPhone = "";
        self._selectedCode = "";
        self._ctrlOn = false;
        self._closeHistoryLog();
        self._resetCopyInfo();
        self._unbindEventCopying();
        self._resetBookReturnInfo();
        self._unbindEventBookReturnTicket();
        var afterReloadSheet = function () {
            if (cb != undefined) {
                cb.call();
            }
        }
        self._reloadSheet(afterReloadSheet);
    },
    _bindEventOnSeat: function (obj, seat) {
        var self = this;
        if (self._hasBookingPermission()) {
            //Perform action on click whole seat if seat is available
            var tk = seat._getCurrentTicket();
            if (!$.isEmptyObject(tk) && tk._canceledDate != null) {
                
                $(obj).on('mouseenter', function (e) {
                    if (tk._status == 3) {
                        $(obj).attr("data-original-title", tk._cancelInfo).attr("data-toggle", "tooltip").attr("data-placement", "top").tooltip('show');
                    }
                });
                $(obj).on('mouseleave', function (e) {
                    if (tk._status == 3) {
                        $(obj).attr('data-original-title', '').attr('data-toggle', "").attr('data-placement', "").tooltip('hide');
                    }
                });
            }
            $(obj).on('click', function (e) {//click len ghe
                if (seat.disableClickEvent) return;
                e.preventDefault();
                e.stopPropagation();
                if (seat._isAvailable()) {
                    if (!seat._hasTicket()) {
                        if (self._fMoving) {
                            self._moveTicket(obj, seat);
                        }
                        //else {
                        //    if (!obj.hasClass('selected')) {
                        //        obj.addClass('selected');
                        //        self._updateSeatStack(obj, seat); //dua ghe vo stack
                        //    } else {
                        //        obj.removeClass('selected');
                        //        var ind = self._seatStack.indexOf(seat);
                        //        self._removeFromSeatStack(obj, seat, ind);
                        //    }
                        //}
                    } else {
                        if (!self._fMoving) {
                            if (e.ctrlKey) {
                                self._updateSeatStack(obj, seat); //dua ghe vo stack
                                self._ctrlOn = true;
                            } else {
                                var index = self._seatStack.indexOf(seat);
                                if (index != -1) {
                                    self._removeFromSeatStack(obj, seat, index);
                                } else {
                                    var t = seat._getCurrentTicket();
                                    if (!_dict._allowGroupByCode) {
                                        var cphone = t._getDefaultPhoneNumber ? t._getDefaultPhoneNumber() : "";
                                        if (self._selectedPhone != cphone) {
                                            self._resetSeatStack();
                                            self._clearSelectedItem();
                                        }
                                        if (vIsEstStr(cphone) && !t._isNotCome() && !t._isCancelled()) {
                                            self._search(cphone);
                                        } else {
                                            self._updateSeatStack(obj, seat);
                                        }
                                        self._selectedPhone = cphone;
                                    }
                                    else {
                                        /**********************************************
                                        * Group by code
                                        **********************************************/
                                        var cCode = t._getTicketCode() ? t._getTicketCode() : "";
                                        if (self._selectedCode != cCode) {
                                            self._resetSeatStack();
                                            self._clearSelectedItem();

                                        }
                                        if (vIsEstStr(cCode) && !t._isNotCome() && !t._isCancelled()) {
                                            self._search(cCode, true);
                                        } else {
                                            self._updateSeatStack(obj, seat);
                                        }
                                        self._selectedCode = cCode;
                                    }
                                }
                                self._ctrlOn = false;
                            }
                        }
                    }
                }
            });
            //Perform event on button
            $.each(obj.find('button'), function (i, b) {
                var type = $(b).attr('data-type');
                switch (type) {
                    case "book":
                        $(b).on('click', function (e) {
                            //$($(b).parents()[2]).addClass("waiting");
                            if (!self._fMoving) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!_dict._allowGroupByCode) {
                                    if (self._selectedPhone != "") {
                                        self._resetSeatStack();
                                        self._clearSelectedItem();
                                        self._selectedPhone = "";
                                        self._ctrlOn = false;
                                    }
                                }
                                else {
                                    if (self._selectedCode != "") {
                                        self._resetSeatStack();
                                        self._clearSelectedItem();
                                        self._selectedCode = "";
                                        self._ctrlOn = false;
                                    }
                                }
                                oRq.cEl = $(this);
                                oRq.cLType = 1;
                                oRq.cKey = seat._label;
                                oRq.cAType = 2;
                                oRq.iAc = true;
                                self._fakeBookedSeat(this, seat);
                                self._bookSeat(obj, seat);
                            } else {
                                //self._showError(_err[3]);
                            }
                        });
                        break;
                    case "move":
                        $(b).on('click', function (e) {
                            
                            if (self._hasCopyTicket) {
                                e.preventDefault();
                                e.stopPropagation();
                                self._clearSelectedItem();
                                self._showError(_dict._err[5]);
                            } else if (self._hasBookReturnTicket) {
                                e.preventDefault();
                                e.stopPropagation();
                                self._clearSelectedItem();
                                self._showError(_dict._err[6]);
                            } else {
                                self._isBooking = false;
                                if (!self._fMoving) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var t = seat._getCurrentTicket();
                                    if (!_dict._allowGroupByCode) {  //group by phone
                                        if (self._selectedPhone != t._cphone && !self._ctrlOn) {
                                            self._resetSeatStack();
                                            self._clearSelectedItem();
                                        }
                                    }
                                    else { //group by code
                                        var tCode = t._code == null ? "" : t._code;
                                        if (self._selectedCode != tCode && !self._ctrlOn) {
                                            self._resetSeatStack();
                                            self._clearSelectedItem();
                                        }
                                    }
                                    if (self._seatStack.indexOf(seat) == -1) {
                                        self._addToSeatStack(obj, seat);
                                    }
                                    self._maskMoveTicket();
                                } else {
                                    if (!self._isInMovingStack(seat)) {
                                        self._showError(_dict._err[3]);
                                    }
                                }
                            }
                        });
                        break;
                    case "update":
                        $(b).on('click', function (e) {

                            var seatStack = self._seatStack;
                            self._reloadSheet();
                            self._isBooking = false;
                            //self._$updateForm.find('div.alert-message').remove();
                            self._seatStack = seatStack;
                            if (!self._fMoving) {
                                e.preventDefault();
                                e.stopPropagation();
                                var t = seat._getCurrentTicket();
                                if (!_dict._allowGroupByCode) {  //group by phone
                                    if (self._selectedPhone != t._cphone && !self._ctrlOn) {
                                        self._resetSeatStack();
                                        self._clearSelectedItem();
                                    }
                                }
                                else { //group by code
                                    var tCode = t._code == null ? "" : t._code;
                                    if (self._selectedCode != tCode && !self._ctrlOn) {
                                        self._resetSeatStack();
                                        self._clearSelectedItem();
                                    }
                                }
                                if (self._seatStack.indexOf(seat) == -1) {
                                    self._addToSeatStack(obj, seat);
                                }
                                self._showUpdateForm(obj, seat);
                            } else {
                                if (self._isInMovingStack(seat)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    self._resetSeatStack();
                                    $.each(self._movingStack, function (iv, v) {
                                        self._seatStack.push(v);
                                    });
                                    self._resetMovingStack();
                                    self._showUpdateForm(obj, seat);
                                } else {
                                    self._showError(_dict._err[3]);
                                }
                            }
                        });
                        break;
                    case "quick-pay":
                        $(b).on('click', function (e) {

                            if (self._hasCopyTicket) {
                                self._showError(_dict._err[5]);
                            } else {
                                e.preventDefault();
                                e.stopPropagation();
                                if (self._seatStack.length == 0) {
                                    self._updateSeatStack(obj, seat);
                                }
                                self._quickPay();
                            }
                        });
                        break;
                    case "quick-book":
                        $(b).on('click', function (e) {
                            if (self._hasCopyTicket) {
                                self._showError(_dict._err[5]);
                            } else {
                                var seatStack = self._seatStack;
                                self._reloadSheet();
                                self._isBooking = false;
                                //self._$updateForm.find('div.alert-message').remove();
                                self._seatStack = seatStack;
                                if (!self._fMoving) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var t = seat._getCurrentTicket();
                                    if (!_dict._allowGroupByCode) {  //group by phone
                                        if (self._selectedPhone != t._cphone && !self._ctrlOn) {
                                            self._resetSeatStack();
                                            self._clearSelectedItem();
                                        }
                                    }
                                    else { //group by code
                                        var tCode = t._code == null ? "" : t._code;
                                        if (self._selectedCode != tCode && !self._ctrlOn) {
                                            self._resetSeatStack();
                                            self._clearSelectedItem();
                                        }
                                    }
                                    if (self._seatStack.indexOf(seat) == -1) {
                                        self._addToSeatStack(obj, seat);
                                    }
                                    self._showQuickBookForm(obj, seat);
                                } else {
                                    if (self._isInMovingStack(seat)) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        self._resetSeatStack();
                                        $.each(self._movingStack, function (iv, v) {
                                            self._seatStack.push(v);
                                        });
                                        self._resetMovingStack();
                                        self._showQuickBookForm(obj, seat);
                                    } else {
                                        self._showError(_dict._err[3]);
                                    }
                                }
                            }

                            //if (self._hasCopyTicket) {
                            //    self._showError(_dict._err[5]);
                            //} else {
                            //    e.preventDefault();
                            //    e.stopPropagation();
                            //    if (self._seatStack.indexOf(seat) == -1) {
                            //        self._addToSeatStack(obj, seat);
                            //    }
                            //    self._showQuickBookForm(obj, seat);
                            //}
                        });
                        break;
                    default:
                        break;
                }
            });
        }
    },
    _bindEventOnSheet: function () {
        var self = this;
        $(document).keyup(function (e) {
            if (e.keyCode == 27) { //ESC
                self._resetAll();
            }
        });

        $('ul.vbooking-list a').click(function (e) {
            e.preventDefault();
            $('ul.vbooking-list a').closest('li').removeClass('active');
            var dtab = $(this).attr('data-tab');
            $('ul.vbooking-list').closest('div.danhsach').find('button').html($(this).text() + '&nbsp;<span class="caret"></span>');
            $(this).tab('show');
            switch (dtab) {
                case 'bks':
                    $('#bksContent').css("display", '');
                    $('#report').css("display", 'none');//.empty();
                    $('#product-content').css("display", 'none');
                    break;
                case 'vopen':
                    self._reloadVO();
                    break;
                case 'vvalid':
                    self._reloadVV();
                    break;
                case 'vcancelled':
                    self._reloadVC();
                    break;
            }
        });

        $('.select-layout > button').on('click', function () {
            $('.select-layout > button').removeClass('active');
            $('button.btn-thong-ke').removeClass('active');
            $(this).addClass('active');
            if ($(this).hasClass('btn-grid')) {
                self._grid = true;
            } else {
                self._grid = false;
            }
            self._isOrderring = false;
            self._reloadSheet();
        });
    },
    _bindArrowEventList: function (li) {
        var liSelected;
        var ul = li.parent();
        var ulh = ul.height();
        var ulch = ul.prop('scrollHeight');
        var numScroll = 1;
        var numBScroll = Math.round(ulch / ulh) - 1;
        $(window).keydown(function (e) {
            if (e.which === 40) {
                if (liSelected) {
                    li.removeClass('selected');
                    var next = liSelected.next();
                    if (next.length > 0) {
                        liSelected = next.addClass('selected');
                    } else {
                        liSelected = li.eq(0).addClass('selected');
                    }
                } else {
                    liSelected = li.eq(0).addClass('selected');
                }
                if (liSelected.position().top < 0) {
                    ul.animate({ scrollTop: 0 }, 500);
                    numScroll = 1;
                } else if (liSelected.position().top > ulh) {
                    var t = Math.floor(ulh * numScroll) - 35;
                    ul.animate({ scrollTop: t }, 500);
                    numScroll++;
                }

            } else if (e.which === 38) {
                if (liSelected) {
                    li.removeClass('selected');
                    var prev = liSelected.prev();
                    if (prev.length > 0) {
                        liSelected = prev.addClass('selected');
                    } else {
                        liSelected = li.last().addClass('selected');
                    }
                } else {
                    liSelected = li.last().addClass('selected');
                }

                if (liSelected.position().top <= 0) {
                    var b = Math.floor(ulch - ulh * numBScroll) + 35;
                    ul.animate({ scrollTop: b }, 500);
                    numBScroll++;
                } else if (liSelected.position().top > ulh) {
                    ul.animate({ scrollTop: ulch }, 500);
                    numBScroll = Math.round(ulch / ulh) - 1;
                }

            }
            //else if (e.which === 13) {
            //    if (liSelected && liSelected.hasClass('selected')) {
            //        liSelected.trigger('click');
            //    }
            //}
        });
    },
    _updateCPhoneSt: function (seat, ticket) {
        var self = this;
        var cphone = ticket._getDefaultPhoneNumber();
        if (vIsEstStr(cphone)) {
            if (typeof self._cphoneSt[cphone] == "undefined") {
                self._cphoneSt[cphone] = [];
            }
            self._cphoneSt[cphone].push(seat);
        }
    },
    _updateCCodeSt: function (seat, ticket) {
        var self = this;
        var cCode = ticket._getTicketCode();
        if (vIsEstStr(cCode)) {
            if (typeof self._cCodeSt[cCode] == "undefined") {
                self._cCodeSt[cCode] = [];
            }
            self._cCodeSt[cCode].push(seat);
        }
    },
    _getLimitedDate: function () {
        var self = this;
        var d = new Date();
        return new Date(d.getTime() - _dict._limitedMinuteBefore * 60000).addMinutes(self._sOffsetMinute);
    },
    _hasBookingPermission: function () {
        var self = this;
        var p = true;
        if (self._getDepartureTime().getTime() < self._getLimitedDate().getTime()) {
            if (app.rights.indexOf($.rights.bBookPastTk.val) == -1) {
                p = self._rBookingOnPast;
            }
        }
        return p;
    },
    _bindEventMoving: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat.selected').addClass('dotted-background');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-moving');
        });
    },
    _unbindEventMoving: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat').removeClass('dotted-background');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').removeClass('cursor-moving');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').unbind('mouseenter');
    },
    _bindEventCopying: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').not('ul.vbooking-coach li.seat div.fbooking').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-them-ve');
        });
        self._$sheet.find('ul.vbooking-coach li.seat div.paid, ul.vbooking-coach li.seat div.fbooking').closest('li.seat').unbind('click');
        self._$sheet.find('ul.vbooking-coach li.seat div.paid button, ul.vbooking-coach li.seat div.fbooking button').prop('disabled', true);
    },
    _unbindEventCopying: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').removeClass('cursor-them-ve');
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').unbind('mouseenter');
    },
    _bindEventBookReturnTicket: function () {
        var self = this;
        var currentTripId = self._getCTripId();
        var $tripId = self._$filterForm.find('select[name=TripId]');
        var $tripDate = self._$filterForm.find('input[name=DepartureDate]');
        var $tripTime = self._$filterForm.find('select[name=TimeSlot]');
        self._$sheet.find('ul.vbooking-coach li.seat div.available, ul.vbooking-coach li.seat div.booking').not('ul.vbooking-coach li.seat div.fbooking').unbind().on('mouseenter', function () {
            $(this).addClass('cursor-khu-hoi');
        });
        self._$sheet.find('ul.vbooking-coach li.seat div.paid button, ul.vbooking-coach li.seat div.fbooking button').prop('disabled', true);

        if (currentTripId == self._cBookReturnTripId) {
            self._$sheet.find('ul.vbooking-coach li.seat').unbind('click');
            self._$sheet.find('ul.vbooking-coach li.seat button').prop('disabled', true);
            $tripDate.prop('disabled', true);
            self._$filterForm.find('.glyphicon-calendar').parent().unbind('click');
            $tripTime.prop('disabled', true);
            if (self._hasBookReturnTicket) {
                if (!$tripId.hasClass('book-return')) {
                    $tripId.addClass('book-return');
                }
            }
        } else {
            self._$sheet.find('ul.vbooking-coach li.seat div.paid, ul.vbooking-coach li.seat div.fbooking').closest('li.seat').unbind('click');
            self._$sheet.find('ul.vbooking-coach li.seat div.available button').prop('disabled', false);
            $tripId.removeClass('book-return');
            $tripDate.prop('disabled', false);
            $tripTime.prop('disabled', false);
            self._bindEventOnCalendarIcon();
        }
    },
    _unbindEventBookReturnTicket: function () {
        var self = this;
        self._$sheet.find('ul.vbooking-coach li.seat div.available').removeClass('cursor-khu-hoi');
        self._$sheet.find('ul.vbooking-coach li.seat div.available').unbind('mouseenter');
        self._$sheet.find('ul.vbooking-coach li.seat div.available button').prop('disabled', false);
    },

    /************************************************************************
    * ERROR                                                                 *
    *************************************************************************/
    _showError: function (message) {
        var self = this;
        self._$emodal.find('.message').html(message);
        self._showEModal();
    },

    backupBKS: function (button) {
        var self = this;
        var obj = self._createBackUpBKSObj();
        var completeReload = function (u, r, l, t) {
            if (u != 1 || l <= 0) {
                return;
            }
            window.location.href = r;
            button.removeAttr('disabled');
        };
        //Submit query
        self._submitAsyncAction(obj, completeReload);
        //$.ajax({//Todo: replace with rq
        //    url: self.options.backupBaseUrl,
        //    type: 'post',
        //    contentType: 'application/json; charset: utf-8',
        //    data: JSON.stringify({ obj: obj }),
        //    crossDomain: true,
        //    success: function (durl) {
        //        window.location.href = durl;
        //        button.removeAttr('disabled');
        //        return false;
        //    },
        //    error: function (e) {
        //        alert("Không thể Lưu Phơi bây giờ.! Vui lòng thử lại sau.");
        //        button.removeAttr('disabled');
        //        return false;
        //    }
        //});
    },
    _createBackUpBKSObj: function () {
        var self = this;
        var d = new Date();
        var obj = {};
        obj._a = "bBackUpCustomerPerTrip";
        obj._c = {
            CompId: self.options.cid,
            UserId: self.options.uid,
            FromDate: d.toFormatString('iso')
        };

        return obj;
    },
    _bindNumStageTicketsTooltips: function () {
        var me = this;
        $(".so-chang,.chang-di").unbind().hover(function () {
            $(this).closest('.seat').find(".chang-di").css("display", "block");
        }, function () {
            $(this).closest('.seat').find(".chang-di").css("display", "none");

        });

        $('.stage-ticket-context').on('click', function (e) {
            var fromId = $(this).attr('data-fromId');
            var toId = $(this).attr('data-toId');
            me.selectStage(fromId, toId);
            //console.log(me._changeCFromId);
        });
    },
    _closedTrip: function () {
        var self = this;
        var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
        var tripInfo = self._getCurrentTripInfo();
        if (typeof tripDetailId == "undefined") {
            self._showPopModal("Chuyến chưa đặt vé, vui lòng kiểm tra lại.");
            return;
        }
        if (typeof _dict._driverInfoRequired != "undefined" && _dict._driverInfoRequired) {
            if (typeof _dict._fieldDriverInfoRequired != "undefined" && _dict._fieldDriverInfoRequired.indexOf("VehicleNumber") != -1) {
                if (tripInfo._vehicleNumber == "") {
                    self._showPopModal("Vui lòng điền thông tin xe trước khi xuất bến.");
                    return;
                }
            }
            if (typeof _dict._fieldDriverInfoRequired != "undefined" && _dict._fieldDriverInfoRequired.indexOf("DriverName") != -1) {
                if (tripInfo._driverName == "") {
                    self._showPopModal("Vui lòng điền thông tin tài trước khi xuất bến.");
                    return;
                }
            }
            if (typeof _dict._fieldDriverInfoRequired != "undefined" && _dict._fieldDriverInfoRequired.indexOf("AssistantName") != -1) {
                if (tripInfo._assistantName == "") {
                    self._showPopModal("Vui lòng điền thông tin phục vụ trước khi xuất bến.");
                    return;
                }
            }
        }

        //Create 
        var obj = {};
        var currentTime = new Date($.now());
        obj._a = "UpTrip";
        obj._c = {
            Id: tripDetailId
        };
        obj._d = {
            ClosedStatus: 1,
            RealDepartureTime: currentTime
        };
        var completeRequest = function (u, r, l, t) {
            if (u == 1) {
                //self._showPopModal("Xuất bến thành công.");
                self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'] = 1;
                self._hideXuatBenButton();
                self._reloadSheet();
            }
        };
        self._submitAction(obj, completeRequest);
    }
});