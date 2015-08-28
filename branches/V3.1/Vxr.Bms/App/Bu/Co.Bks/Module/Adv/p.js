/************************************************************************
* EXTEND BKS                                                            *
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
        _$vocontainer: null, //Reference to the main container of all elements that are created by this plug-in (jQuery object)
        _$votoolbar: null,
        _$vosheet: null,
        _$vonav: null,

        _$vvcontainer: null, //Reference to the main container of all elements that are created by this plug-in (jQuery object)
        _$vvtoolbar: null,
        _$vvsheet: null,
        _$vvnav: null,

        _$vccontainer: null, //Reference to the main container of all elements that are created by this plug-in (jQuery object)
        _$vctoolbar: null,
        _$vcsheet: null,
        _$vcnav: null,

        _vo: null,
        _vv: null,
        _vc: null,

        _cVOTripId: 0,
        _cVOPageIndex: 1,
        _totalVOItem: 0,

        _cVVTripId: 0,
        _cVVPageIndex: 1,
        _totalVVItem: 0,

        //_cVCTripId: 0,
        //_cVCPageIndex: 1,
        //_totalVCItem: 0,

        //Transfer ticket
        _transfer: [],
        _$transfer: null,

        /************************************************************************
       * CONSTRUCTOR AND INITIALIZATION METHODS                                *
       *************************************************************************/
        _create: function () {
            base._create.apply(this, arguments);
            //Initialization
            this._initializeExtendFields();
            //Creating DOM elements
            this._createExtendContainer();
            this._createExtendToolBar();
            this._createExtendSheet();
        },
        _initializeExtendFields: function () {
            this._vo = []; //Valid is empty
            this._vv = [];
            this._vc = [];
        },
        _createExtendContainer: function () {
            this._$vocontainer = $('.vopen-container');
            this._$vvcontainer = $('.vvalid-container');
            this._$vccontainer = $('.vcancelled-container');
        },
        _createExtendToolBar: function () {
            this._$votoolbar = $('.vopen-toolbar');
            this._$vvtoolbar = $('.vvalid-toolbar');
            this._$vctoolbar = $('.vcancelled-toolbar');
        },
        _createExtendSheet: function () {
            this._$vosheet = $('<div />')
                .addClass('vopen-sheet col-md-12 col-sm-12 col-xs-12')
                .appendTo(this._$vocontainer);
            this._$vvsheet = $('<div />')
               .addClass('vvalid-sheet  col-md-12 col-sm-12 col-xs-12')
               .appendTo(this._$vvcontainer);
            //this._$vcsheet = $('<div />')
            //  .addClass('vcancelled-sheet  col-md-12 col-sm-12 col-xs-12')
            //  .appendTo(this._$vccontainer);

            this._$vonav = $('<div />')
               .addClass('vopen-nav col-md-12 col-sm-12 col-xs-12')
               .append($('<div />').addClass('col-md-12'))
               .appendTo(this._$vocontainer).children().first();
            this._$vvnav = $('<div />')
              .addClass('vvalid-nav col-md-12 col-sm-12 col-xs-12')
              .append($('<div />').addClass('col-md-12'))
              .appendTo(this._$vvcontainer).children().first();
            //this._$vcnav = $('<div />')
            //  .addClass('vcanclled-nav  col-md-12 col-sm-12 col-xs-12')
            //  .append($('<div />').addClass('col-md-12'))
            //  .appendTo(this._$vccontainer).children().first();
        },

        _reloadVO: function () {
            var self = this;
            //Update post data
            var obj = self._createGetVOSeatObj();
            var completeReloadSheet = function (u, r, l, t) {
                if (u != 1 || l <= 0) {
                    self._clearVOSheet();
                    self._notFoundOpenTicket();
                    return;
                }

                //Clear ticket from seat
                self._clearVOSheet();

                if (l > 0) {
                    //Map ticket to seat matrix
                    self._mapVOTicket(r);
                    self._totalVOItem = parseInt(t);
                }

                //Render UI
                self._renderVOSheet();
                self._renderVOPagination();

            };
            //Submit query
            self._submitAction(obj, completeReloadSheet);
        },
        _createGetVOSeatObj: function () {
            var self = this;

            //Get filter form data
            var obj = {};
            obj._a = "pGetTicket";

            obj._c = {
                TripId: self._cVOTripId,
                Status: 7
            };
            obj._ft = "TripId = " + self._cVOTripId + " and Status = 7";
            //obj._f = "Id, TripId, AgentId, TripDate, SeatCode, IssueDate, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Serial, PaymentInfo, IsPrgHistoryInfo, FromValid, ToValid, IsPrgUpdatedDate";
            obj._f = _dict._tgF.join();
            obj._se = 'Id desc',
            obj._si = self._cVOPageIndex;
            obj._mr = _dict._nOP;

            return obj;
        },
        _clearVOSheet: function () {
            this._$vosheet.empty();
            this._$vonav.empty();
        },
        _mapVOTicket: function (data) {
            var self = this;
            self._vo = [];
            $.each(data, function (i, v) {
                v.shift();
                var t = self._createTicketFromRecord(v);
                if (!$.isEmptyObject(t)) {
                    self._vo.push(t);
                }
            });
        },
        _renderVOSheet: function () {
            var self = this;
            if (self._vo.length > 0) {
                var numOfC = Math.round(self._vo.length / self._numCoach);
                for (var i = 0; i < self._vo.length; i += numOfC) {
                    var $c = self._createCoach(self._$vosheet).addClass(_dict._g[self._numCoach - 1]).addClass(_dict._sg[self._numCoach - 1]).addClass(_dict._mg[self._numCoach - 1]);
                    var voc = self._vo.slice(i, i + numOfC);
                    for (var j = 0; j < voc.length; j++) {
                        if (typeof voc[j] != "undefined") {
                            var $s = voc[j]._renderVOTicket().addClass(_dict._g[_dict._tplNumCol - 1]);
                            $c.append($s);
                        }
                    }
                }
            } else {
                self._notFoundOpenTicket();
            }
        },
        _renderVOPagination: function () {
            var self = this;
            var p = self._getPagination(self._cVOPageIndex, _dict._nOP, self._totalVOItem);
            if (p.CountAllPages > 1) {
                var $p = $('<ul />').addClass('pagination pagination-sm pull-right');
                if (p.FrevPage != "") {
                    $p.append($('<li />').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', p.FrevPage)));
                } else {
                    $p.append($('<li />').addClass('disabled').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', '')));
                }
                if (p.FrevPages.length > 0) {
                    for (var i = 0; i < p.FrevPages.length; i++) {
                        $p.append($('<li />').append($('<a />').html(p.FrevPages[i]).attr('href', 'javascript:;').attr('data-index', p.FrevPages[i])));
                    }
                }
                $p.append($('<li />').addClass('active').append($('<a />').html(p.CurrentPage).attr('href', 'javascript:;').attr('data-index', p.CurrentPage)));
                if (p.NextPages.length > 0) {
                    for (var j = 0; j < p.NextPages.length; j++) {
                        $p.append($('<li />').append($('<a />').html(p.NextPages[j]).attr('href', 'javascript:;').attr('data-index', p.NextPages[j])));
                    }
                }
                if (p.NextPage != "") {
                    $p.append($('<li />').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', p.NextPage)));
                } else {
                    $p.append($('<li />').addClass('disabled').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', '')));
                }

                $p.appendTo(self._$vonav);

                //Bind event on pagination
                $p.find('a').not('.disabled').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._changeVOPageIndex($(this).attr('data-index'));
                    self._reloadVO();
                });

            }
        },
        _notFoundOpenTicket: function () {
            var self = this;
            $('<div />').addClass('alert alert-danger')
                    .html("<strong>Không tồn tại vé open.</strong>")
                .appendTo(self._$vosheet);
        },
        _getPagination: function (pIndex, nOfPage, totalItem) {
            var countAllPage = Math.ceil(totalItem / nOfPage);
            var numPrevPages = 5;
            var numNextPages = 5;
            var prevPagesArr = [];
            for (var i = pIndex - numPrevPages; i < pIndex; i++) {
                if (i >= 1) {
                    prevPagesArr.push(i);
                }
            }
            var nextPagesArr = [];
            for (var j = pIndex + 1; j < pIndex + numNextPages; j++) {
                if (j <= countAllPage) {
                    nextPagesArr.push(j);
                }
            }

            return {
                CurrentPage: pIndex,
                CountAllPages: countAllPage,
                First: (-1 == prevPagesArr.indexOf(1) && 1 != pIndex) ? 1 : '',
                FrevPage: (prevPagesArr.length > 0) ? prevPagesArr[prevPagesArr.length - 1] : '',
                FrevPages: prevPagesArr,
                NextPages: nextPagesArr,
                NextPage: (nextPagesArr.length > 0) ? nextPagesArr[0] : '',
                Last: (-1 == nextPagesArr.indexOf(countAllPage) && countAllPage != pIndex) ? countAllPage : '',
                NumPerPage: nOfPage
            }
        },
        _changeVOPageIndex: function (i) {
            this._cVOPageIndex = parseInt(i);
        },

        _reloadVV: function () {
            var self = this;
            //Update post data
            var obj = self._createGetVVSeatObj();
            var completeReloadSheet = function (u, r, l, t) {
                if (u != 1 || l <= 0) {
                    self._clearVVSheet();
                    self._notFoundValidTicket();
                    return;
                }
                //Clear ticket from seat
                self._clearVVSheet();

                if (l > 0) {
                    //Map ticket to seat matrix
                    self._mapVVTicket(r);
                    self._totalVVItem = parseInt(t);
                }
                //Render UI
                self._renderVVSheet();
                self._renderVVPagination();
            };
            //Submit query
            self._submitAction(obj, completeReloadSheet);
        },
        _createGetVVSeatObj: function () {
            var self = this;

            //Get filter form data
            var obj = {};
            obj._a = "pGetTicket";
            obj._c = {
                TripId: self._cVVTripId,
                Status: 6
            };
            obj._ft = "TripId = " + self._cVVTripId + " and Status = 6";
            //obj._f = "Id, TripId, AgentId, TripDate, SeatCode, IssueDate, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Serial, PaymentInfo, IsPrgHistoryInfo, FromValid, ToValid, IsPrgUpdatedDate";
            obj._f = _dict._tgF.join();
            obj._se = 'Id desc',
            obj._si = self._cVVPageIndex;
            obj._mr = _dict._nOP;

            return obj;
        },
        _clearVVSheet: function () {
            this._$vvsheet.empty();
            this._$vvnav.empty();
        },
        _mapVVTicket: function (data) {
            var self = this;
            self._vv = [];
            $.each(data, function (i, v) {
                v.shift();
                var t = self._createTicketFromRecord(v);
                if (!$.isEmptyObject(t)) {
                    self._vv.push(t);
                }
            });
        },
        _renderVVSheet: function () {
            var self = this;
            if (self._vv.length > 0) {
                var numOfC = Math.round(self._vv.length / self._numCoach);
                for (var i = 0; i < self._vv.length; i += numOfC) {
                    var $c = self._createCoach(self._$vvsheet).addClass(_dict._g[self._numCoach - 1]).addClass(_dict._sg[self._numCoach - 1]).addClass(_dict._mg[self._numCoach - 1]);
                    var vvc = self._vv.slice(i, i + numOfC);
                    for (var j = 0; j < vvc.length; j++) {
                        if (typeof vvc[j] != "undefined") {
                            var $s = vvc[j]._renderVVTicket().addClass(_dict._g[_dict._tplNumCol - 1]);
                            $c.append($s);
                        }
                    }
                }
            } else {
                self._notFoundValidTicket();
            }
        },
        _renderVVPagination: function () {
            var self = this;
            var p = self._getPagination(self._cVVPageIndex, _dict._nOP, self._totalVVItem);
            if (p.CountAllPages > 1) {
                var $p = $('<ul />').addClass('pagination pagination-sm pull-right');
                if (p.FrevPage != "") {
                    $p.append($('<li />').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', p.FrevPage)));
                } else {
                    $p.append($('<li />').addClass('disabled').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', '')));
                }
                if (p.FrevPages.length > 0) {
                    for (var i = 0; i < p.FrevPages.length; i++) {
                        $p.append($('<li />').append($('<a />').html(p.FrevPages[i]).attr('href', 'javascript:;').attr('data-index', p.FrevPages[i])));
                    }
                }
                $p.append($('<li />').addClass('active').append($('<a />').html(p.CurrentPage).attr('href', 'javascript:;').attr('data-index', p.CurrentPage)));
                if (p.NextPages.length > 0) {
                    for (var j = 0; j < p.NextPages.length; j++) {
                        $p.append($('<li />').append($('<a />').html(p.NextPages[j]).attr('href', 'javascript:;').attr('data-index', p.NextPages[j])));
                    }
                }
                if (p.NextPage != "") {
                    $p.append($('<li />').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', p.NextPage)));
                } else {
                    $p.append($('<li />').addClass('disabled').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', '')));
                }

                $p.appendTo(self._$vvnav);

                //Bind event on pagination
                $p.find('a').not('.disabled').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._changeVVPageIndex($(this).attr('data-index'));
                    self._reloadVV();
                });

            }
        },
        _notFoundValidTicket: function () {
            var self = this;
            $('<div />').addClass('alert alert-danger')
                    .html("<strong>Không tồn tại vé valid.</strong>")
                .appendTo(self._$vvsheet);
        },
        _changeVVPageIndex: function (i) {
            this._cVVPageIndex = parseInt(i);
        },

        //_reloadVC: function () {
        //    var self = this;
        //    //Update post data
        //    var obj = self._createGetVCSeatObj();
        //    var completeReloadSheet = function (u, r, l, t) {
        //        if (u != 1 || l <= 0) {
        //            self._clearVCSheet();
        //            self._notFoundCancelledTicket();
        //            return;
        //        }
        //        //Clear ticket from seat
        //        self._clearVCSheet();

        //        if (l > 0) {
        //            //Map ticket to seat matrix
        //            self._mapVCTicket(r);
        //            self._totalVCItem = parseInt(t);
        //        }
        //        //Render UI
        //        self._renderVCSheet();
        //        self._renderVCPagination();
        //    };
        //    //Submit query
        //    self._submitAction(obj, completeReloadSheet);
        //},
        //_createGetVCSeatObj: function () {
        //    var self = this;

        //    //Get filter form data
        //    var obj = {};
        //    obj._a = "pGetTicket";
        //    obj._c = {
        //        TripId: self._cVVTripId,
        //        Status: '($x) = 3' //STATUS
        //    };
        //    obj._ft = "TripId = " + self._cVCTripId + " and (Status) = 3"; //STATUS
        //    //obj._f = "Id, TripId, AgentId, TripDate, SeatCode, IssueDate, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Serial, PaymentInfo, IsPrgHistoryInfo, FromValid, ToValid, IsPrgUpdatedDate";
        //    obj._f = _dict._tgF.join();
        //    obj._se = 'Id desc',
        //    obj._si = self._cVCPageIndex;
        //    obj._mr = _dict._nOP;

        //    return obj;
        //},
        //_clearVCSheet: function () {
        //    this._$vcsheet.empty();
        //    this._$vcnav.empty();
        //},
        //_mapVCTicket: function (data) {
        //    var self = this;
        //    self._vc = [];
        //    $.each(data, function (i, v) {
        //        v.shift();
        //        var t = self._createTicketFromRecord(v);
        //        if (!$.isEmptyObject(t)) {
        //            self._vc.push(t);
        //        }
        //    });
        //},
        //_renderVCSheet: function () {
        //    var self = this;
        //    if (self._vc.length > 0) {
        //        var numOfC = Math.round(self._vc.length / self._numCoach);
        //        for (var i = 0; i < self._vc.length; i += numOfC) {
        //            var $c = self._createCoach(self._$vcsheet).addClass(_dict._g[self._numCoach - 1]).addClass(_dict._sg[self._numCoach - 1]).addClass(_dict._mg[self._numCoach - 1]);
        //            var vcc = self._vc.slice(i, i + numOfC);
        //            for (var j = 0; j < vcc.length; j++) {
        //                if (typeof vcc[j] != "undefined") {
        //                    var $s = vcc[j]._renderVCTicket().addClass(_dict._g[_dict._tplNumCol - 1]);
        //                    $c.append($s);
        //                }
        //            }
        //        }
        //    } else {
        //        self._notFoundCancelledTicket();
        //    }
        //},
        //_renderVCPagination: function () {
        //    var self = this;
        //    var p = self._getPagination(self._cVCPageIndex, _dict._nOP, self._totalVCItem);
        //    if (p.CountAllPages > 1) {
        //        var $p = $('<ul />').addClass('pagination pagination-sm pull-right');
        //        if (p.FrevPage != "") {
        //            $p.append($('<li />').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', p.FrevPage)));
        //        } else {
        //            $p.append($('<li />').addClass('disabled').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', '')));
        //        }
        //        if (p.FrevPages.length > 0) {
        //            for (var i = 0; i < p.FrevPages.length; i++) {
        //                $p.append($('<li />').append($('<a />').html(p.FrevPages[i]).attr('href', 'javascript:;').attr('data-index', p.FrevPages[i])));
        //            }
        //        }
        //        $p.append($('<li />').addClass('active').append($('<a />').html(p.CurrentPage).attr('href', 'javascript:;').attr('data-index', p.CurrentPage)));
        //        if (p.NextPages.length > 0) {
        //            for (var j = 0; j < p.NextPages.length; j++) {
        //                $p.append($('<li />').append($('<a />').html(p.NextPages[j]).attr('href', 'javascript:;').attr('data-index', p.NextPages[j])));
        //            }
        //        }
        //        if (p.NextPage != "") {
        //            $p.append($('<li />').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', p.NextPage)));
        //        } else {
        //            $p.append($('<li />').addClass('disabled').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', '')));
        //        }

        //        $p.appendTo(self._$vcnav);

        //        //Bind event on pagination
        //        $p.find('a').not('.disabled').on('click', function (e) {
        //            e.preventDefault();
        //            e.stopPropagation();
        //            self._changeVCPageIndex($(this).attr('data-index'));
        //            self._reloadVC();
        //        });

        //    }
        //},
        //_notFoundCancelledTicket: function () {
        //    var self = this;
        //    $('<div />').addClass('alert alert-danger')
        //             .html("<strong>Không tồn tại vé đã hủy.</strong>")
        //         .appendTo(self._$vcsheet);
        //},
        //_changeVCPageIndex: function (i) {
        //    this._cVCPageIndex = parseInt(i);
        //},

        /************************************************************************
       * RENDER LIST                                                            *
       *************************************************************************/
        _lrenderSeatTemplate: function () {
            var self = this;
            self._clearSheet(); //Clear sheet

            var $table = $(_dict._lTpl);
            var $tbody = $table.find('tbody');

            var index = 1;
            var hasBPermit = self._hasBookingPermission();
            var stopPoints = self._data[self._cTripIndex].StopPoints;
            var t = null;
            var $seat = null;
            $.each(self._m, function (ic, c) {
                if (typeof c != "undefined") {
                    $.each(c, function (ir, r) {
                        if (typeof r != "undefined") {
                            $.each(r, function (is, s) {
                                if (typeof s != "undefined" && s != null) {
                                    if (s._hasTicket()) {
                                        if (app.oRights["StageEnable"]) {
                                            $.each(s._tickets, function (it, tic) {
                                                t = tic;
                                                //var nTicketPerTrip = 0;
                                                if (!$.isEmptyObject(t) && typeof self._cphoneSt[t._getDefaultPhoneNumber()] != "undefined") {
                                                    nTicketPerTrip = self._cphoneSt[t._getDefaultPhoneNumber()].length;
                                                }
                                                var stageName = self._renderStageName(t.stageCode, stopPoints);

                                                $seat = s._renderLSeat(nTicketPerTrip, index, hasBPermit, t, stageName);
                                                self._bindEventOnSeat($seat, s);

                                                $tbody.append($seat);
                                                index++;
                                            });
                                        } else {
                                            t = s._getCurrentTicket();
                                            var nTicketPerTrip = 0;
                                            if (!$.isEmptyObject(t) && typeof self._cphoneSt[t._getDefaultPhoneNumber()] != "undefined") {
                                                nTicketPerTrip = self._cphoneSt[t._getDefaultPhoneNumber()].length;
                                            }

                                            $seat = s._renderLSeat(nTicketPerTrip, index, hasBPermit);
                                            self._bindEventOnSeat($seat, s);

                                            $tbody.append($seat);
                                            index++;
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });

            //Order by issue date
            var $items = $tbody.children(),
            array = $items.get();
            array.sort(function (o1, o2) {
                var o1V = parseInt($(o1).attr('data-issue'));
                var o2V = parseInt($(o2).attr('data-issue'));
                return o2V - o1V;
            });
            index = 1;
            for (var i = 0; i < array.length; i++) {
                $(array[i]).find('.index').text(index);
                index++;
            }
            $tbody.append(array);

            self._$sheet.append($table);

            self._bindEventOnListSeat();
        },
        _bindEventOnListSeat: function () {
            var self = this;
            var sheet = self._$sheet;
            sheet.find('button.btn-print-list').on('click', function (e) {
                e.preventDefault();
                self._printBKS("in-danh-sach");
            });
        },
        _lrenderCancelledTicket: function () {
            var self = this;
            if (self._c.length > 0) {

                self._$cancelSheet.append($('<h4 />').addClass('sheet-title').html('Vé đã hủy'));
                //var cIndex = 0;
                var $table = $(_dict._cancelListTpl);
                var $tbody = $table.find('tbody');
                var index = 1;
                var hasBPermit = self._hasBookingPermission();
                $.each(self._c, function (ix, cx) {
                    if (typeof cx != "undefined" && cx != null) {
                        $.each(cx, function (_, s) {
                            if (typeof s != "undefined" && s != null) {
                                if (s._hasTicket()) {
                                    var t = s._getCurrentTicket();

                                    var nTicketPerTrip = 0;
                                    if (!$.isEmptyObject(t) && typeof self._cphoneSt[t._getDefaultPhoneNumber()] != "undefined") {
                                        nTicketPerTrip = self._cphoneSt[t._getDefaultPhoneNumber()].length;
                                    }
                                    var $seat = s._renderLSeat(nTicketPerTrip, index, hasBPermit);
                                    self._bindEventOnSeat($seat, s);

                                    $tbody.append($seat);
                                    index++;
                                }
                            }
                        });
                    }
                });

                //Order by issue date
                var $items = $tbody.children(),
                array = $items.get();
                array.sort(function (o1, o2) {
                    var o1V = parseInt($(o1).attr('data-issue'));
                    var o2V = parseInt($(o2).attr('data-issue'));
                    return o2V - o1V;
                });
                index = 1;
                for (var i = 0; i < array.length; i++) {
                    $(array[i]).find('.index').text(index);
                    index++;
                }
                $tbody.append(array);

                self._$cancelSheet.append($table);
            }
        },

        /************************************************************************
        * PICKUP LIST                                                            *
        *************************************************************************/
        _renderPickupTicket: function () {
            var self = this;
            self._clearSheet(); //Clear sheet
            self._clearCancelled();

            var stickets = [];
            var nstickets = [];
            var nstickets2 = [];
            var customer = [];
            var total = 0;
            $.each(self._m, function (ic, c) {
                if (typeof c != "undefined") {
                    $.each(c, function (ir, r) {
                        if (typeof r != "undefined") {
                            $.each(r, function (is, s) {
                                if (typeof s != "undefined" && s != null) {
                                    if (s._hasTicket()) {
                                        var t = s._getCurrentTicket();
                                        if (!$.isEmptyObject(t)) {
                                            var pInfo = t._getPickupInfo();
                                            if (!$.isEmptyObject(pInfo) && vIsEstStr(pInfo.text) && pInfo.type == 'P') {
                                                var ticketCode = t._code;
                                                var cname = t._cname;
                                                var cphone = t._getDefaultPhoneNumber();
                                                var pIndex = parseInt(pInfo.pIndex);
                                                var pText = pInfo.text;
                                                if (isNaN(pIndex)) {
                                                    pIndex = 0;
                                                }
                                                if (typeof stickets[pIndex] == "undefined") {
                                                    stickets[pIndex] = [];
                                                }

                                                if (pIndex == 0) {
                                                    if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                                        var nTextCode = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                        var nKeyCode = customer.indexOf(nTextCode);
                                                        if (nKeyCode == -1) {
                                                            nKeyCode = customer.push(nTextCode) - 1;
                                                        }
                                                        if (typeof nstickets[nKeyCode] == "undefined") {
                                                            nstickets[nKeyCode] = {
                                                                _pIndex: pIndex,
                                                                _seatCodes: [],
                                                                _seatInfos: [],
                                                                _tids: [],
                                                                _seri: t._seri,
                                                                _cname: cname,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _pdate: [],
                                                                _status: t._status,
                                                                _cuser: t._cuser,
                                                                _total: 0
                                                            };
                                                        }
                                                        nstickets[nKeyCode]._seatCodes.push(s._label);
                                                        nstickets[nKeyCode]._seatInfos.push(s._getSeatInfo());
                                                        nstickets[nKeyCode]._tids.push(t._id);
                                                        nstickets[nKeyCode]._pdate.push(t._pdate.toFormatString('iso'));
                                                        nstickets[nKeyCode]._total += t._fare;
                                                    } else {
                                                        if (!vIsEstStr(cphone)) {
                                                            nstickets2.push({
                                                                _pIndex: pIndex,
                                                                _seatCodes: [s._label],
                                                                _seatInfos: [s._getSeatInfo()],
                                                                _tids: [t._id],
                                                                _cname: cname,
                                                                _seri: t._seri,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _pdate: [t._pdate.toFormatString('iso')],
                                                                _status: t._status,
                                                                _cuser: t._cuser,
                                                                _total: t._fare
                                                            });
                                                        } else {
                                                            var ntext = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                            var nkey = customer.indexOf(ntext);
                                                            if (nkey == -1) {
                                                                nkey = customer.push(ntext) - 1;
                                                            }

                                                            if (typeof nstickets[nkey] == "undefined") {
                                                                nstickets[nkey] = {
                                                                    _pIndex: pIndex,
                                                                    _seatCodes: [],
                                                                    _seatInfos: [],
                                                                    _tids: [],
                                                                    _seri: t._seri,
                                                                    _cname: cname,
                                                                    _cphone: cphone,
                                                                    _code: ticketCode,
                                                                    _pText: pText,
                                                                    _note: t._note,
                                                                    _pdate: [],
                                                                    _status: t._status,
                                                                    _cuser: t._cuser,
                                                                    _total: 0
                                                                };
                                                            }
                                                            nstickets[nkey]._seatCodes.push(s._label);
                                                            nstickets[nkey]._seatInfos.push(s._getSeatInfo());
                                                            nstickets[nkey]._tids.push(t._id);
                                                            nstickets[nkey]._pdate.push(t._pdate.toFormatString('iso'));
                                                            nstickets[nkey]._total += t._fare;
                                                        }
                                                    }
                                                } else {
                                                    if (typeof stickets[pIndex] == "undefined") {
                                                        stickets[pIndex] = [];
                                                    }
                                                    if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                                        var sTextCode = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                        var sKeyCode = customer.indexOf(sTextCode);
                                                        if (sKeyCode == -1) {
                                                            sKeyCode = customer.push(sTextCode) - 1;
                                                        }
                                                        if (typeof stickets[pIndex][sKeyCode] == "undefined") {
                                                            stickets[pIndex][sKeyCode] = {
                                                                _pIndex: pIndex,
                                                                _seatCodes: [],
                                                                _seatInfos: [],
                                                                _tids: [],
                                                                _cname: cname,
                                                                _seri: t._seri,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _pdate: [],
                                                                _status: t._status,
                                                                _cuser: t._cuser,
                                                                _total: 0
                                                            };
                                                        }
                                                        stickets[pIndex][sKeyCode]._seatCodes.push(s._label);
                                                        stickets[pIndex][sKeyCode]._seatInfos.push(s._getSeatInfo());
                                                        stickets[pIndex][sKeyCode]._tids.push(t._id);
                                                        stickets[pIndex][sKeyCode]._pdate.push(t._pdate.toFormatString('iso'));
                                                        stickets[pIndex][sKeyCode]._total += t._fare;
                                                    } else {
                                                        var text = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                        var key = customer.indexOf(text);
                                                        if (key == -1) {
                                                            key = customer.push(text) - 1;
                                                        }
                                                        if (typeof stickets[pIndex][key] == "undefined") {
                                                            stickets[pIndex][key] = {
                                                                _pIndex: pIndex,
                                                                _seatCodes: [],
                                                                _seatInfos: [],
                                                                _tids: [],
                                                                _cname: cname,
                                                                _seri: t._seri,
                                                                _cphone: cphone,
                                                                _code: ticketCode,
                                                                _pText: pText,
                                                                _note: t._note,
                                                                _pdate: [],
                                                                _status: t._status,
                                                                _cuser: t._cuser,
                                                                _total: 0
                                                            };
                                                        }
                                                        stickets[pIndex][key]._seatCodes.push(s._label);
                                                        stickets[pIndex][key]._seatInfos.push(s._getSeatInfo());
                                                        stickets[pIndex][key]._tids.push(t._id);
                                                        stickets[pIndex][key]._pdate.push(t._pdate.toFormatString('iso'));
                                                        stickets[pIndex][key]._total += t._fare;
                                                    }
                                                }
                                                //Total
                                                total += t._fare;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });

            //Merge not sorted to tail
            if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
                stickets[0] = nstickets;
            } else {
                stickets[0] = nstickets.concat(nstickets2);
            }

            var timeSlots = [self._cTripTime];
            var $pickUp = $(vtpl(_dict._puTpl, { "t": { _timeSlots: timeSlots.join(), _total: total.toMn() + "đ" } }));
            var $pbody = $pickUp.find('tbody');
            if (stickets.length > 0) {
                //var index = 1;
                $.each(stickets, function (ix, sx) {
                    if (sx != undefined) {
                        if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
                            Object.keys(sx).forEach(function (key) {
                                var value = sx[key];
                                var data = {
                                    "seat": {
                                        _index: value._pIndex,
                                        _cname: value._cname,
                                        _code: value._code,
                                        _cphone: value._cphone,
                                        _pText: value._pText,
                                        _seri: value._seri,
                                        _note: value._note,
                                        _seatCodes: value._seatCodes.join(", "),
                                        _seatInfos: value._seatInfos.join(),
                                        _tids: value._tids.join(),
                                        _pdate: value._pdate.join(),
                                        _status: value._status == 1 ? "Đặt chỗ" : "Đã thanh toán",
                                        _total: value._total.toMn() + "đ"
                                    }
                                }
                                if (value._pIndex > 0) {
                                    data["seat"]["_class"] = "sorted";
                                }
                                var $tr = $(vtpl(_dict._ipuTpl, data));

                                $pbody.append($tr);
                            });
                        } else {
                            $.each(sx, function (_, s) {
                                if (s != undefined) {
                                    var data = {
                                        "seat": {
                                            _index: s._pIndex,
                                            _cname: s._cname,
                                            _code: s._code,
                                            _cphone: s._cphone,
                                            _pText: s._pText,
                                            _seri: s._seri,
                                            _note: s._note,
                                            _seatCodes: s._seatCodes.join(", "),
                                            _seatInfos: s._seatInfos.join(),
                                            _tids: s._tids.join(),
                                            _pdate: s._pdate.join(),
                                            _status: s._status == 1 ? "Đặt chỗ" : "Đã thanh toán",
                                            _total: s._total.toMn() + "đ"
                                        }
                                    }
                                    if (s._pIndex > 0) {
                                        data["seat"]["_class"] = "sorted";
                                    }
                                    var $tr = $(vtpl(_dict._ipuTpl, data));

                                    $pbody.append($tr);
                                }
                            });
                        }
                    }
                });
            }
            if (!self._hasBookingPermission()) {
                $pickUp.find('input.pIndex').prop('disabled', true);
                $pickUp.find('button.btn-order').remove();
            }
            self._$sheet.append($pickUp);
            self._bindEventOnPickUpTicket();
        },
        _bindEventOnPickUpTicket: function () {
            var self = this;
            $('input.pIndex', '.plist').focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('.plist button').each(function (_, b) {
                if ($(b).hasClass('btn-order')) {
                    vev(b, 'click', function (e) {
                        e.preventDefault();
                        var $ct = $('.plist tbody'),
                        $items = $ct.children(),
                        array = $items.get();

                        array.sort(function (o1, o2) {
                            var o1V = parseInt($(o1).find('input.pIndex').val());
                            var o2V = parseInt($(o2).find('input.pIndex').val());
                            return o1V - o2V;
                        });

                        var index = 1;
                        for (var i = 0; i < array.length; i++) {
                            var value = parseInt($(array[i]).find('input.pIndex').val());
                            if (isNaN(value)) {
                                value = 0;
                            }
                            if (value == 0) {
                                continue;
                            } else {
                                $(array[i]).find('input.pIndex').val(index);
                                index++;
                            }
                        }

                        $ct.append(array);
                        $ct.find('tr').addClass('sorted');

                        self._orderPickupInfo();

                        return false;
                    });
                } else if ($(b).hasClass('btn-print-list')) {
                    vev(b, 'click', function (e) {
                        e.preventDefault();
                        self._printPickupTicket();
                    });
                }
            });
        },
        _orderPickupInfo: function () {
            var self = this;
            var obj = self._createOrderPickUpObj();
            if (false != obj) {
                var completeReload = function (u, r, l, t) {
                    if (u != 1) return;
                    self._reloadSheet();
                };
                //Submit action
                self._submitAsyncAction(obj, completeReload);
            }
        },
        _createOrderPickUpObj: function () {
            var self = this;
            var obj = false;
            var orders = self._$sheet.find('table.list-ticket input.pIndex');
            if (orders.length > 0) {
                obj = {};
                obj._a = "UpdateBookTicket";
                obj._c = [];
                obj._d = [];

                $.each(orders, function (ir, r) {
                    var $tr = $(r).closest('tr');
                    var sInfos = $tr.attr('data-seatinfos').split(',');
                    var pdate = $tr.attr('data-pdate').split(',');
                    var ids = $tr.attr('data-ids').split(',');
                    var code = $tr.attr('data-code');

                    var nPInfo = $tr.attr('data-pText') + "||" + $(orders[ir]).val();
                    for (var i = 0; i < sInfos.length; i++) {
                        var id = parseInt(ids[i]);
                        obj._c.push({
                            Id: id,
                            TripId: self._cTripId,
                            SeatCode: sInfos[i],
                            PickupDate: pdate[i],
                            Bus: self._cTripBus
                        });

                        var dObj = {
                            PickupInfo: nPInfo,
                            Code: code
                        };

                        obj._d.push(dObj);
                    }
                });
            }

            return obj;
        },
        _hasMergeTransfer: function () {
            var self = this;
            var result = false;
            if (typeof _dict._hasMergeTransfer != "undefined") {
                if (typeof _dict._hasMergeTransfer[self._cTripId] != "undefined") {
                    result = _dict._hasMergeTransfer[self._cTripId];
                }
            }
            return result;
        },
        _reloadMergeTransferTicket: function () {
            var self = this;
            //Update post data
            var obj = self._createGetMergeTransferTicketObj();
            var completeReloadMergeTransfer = function (u, r, l, t) {
                if (u != 1) return;
                if (l > 0) {
                    //Map ticket to seat matrix
                    self._mapMergeTransferTicket(r);
                }
            };
            //Submit query
            self._submitAction(obj, completeReloadMergeTransfer);
        },
        _createGetMergeTransferTicketObj: function () {
            var self = this;

            //Get filter form data
            var departureTime = self._getDepartureTime();

            var obj = {};
            obj._a = "fGetTicket";
            obj._c = {
                TripId: self._cTripId,
                TripDate: "convert(nvarchar(10), $x, 103) = '" + departureTime.toFormatString("dd/mm/yyyy") + "'",
                PickupInfo: "($x is not null and SUBSTRING($x, CHARINDEX('|', $x) + 1, CHARINDEX('|', substring($x, charindex('|', $x) + 1, len($x))) - 1) != '')",
                Status: '(($x) IN(' + _dict._mtks.join() + '))' //STATUS
            };
            obj._f = _dict._tgF.join();

            return obj;
        },
        _mapMergeTransferTicket: function (data) {
            var self = this;
            self._transfer = [];
            $.each(data, function (i, v) {
                var t = self._createTicketFromRecord(v);
                if (!$.isEmptyObject(t)) {

                    var s = v[4].split('|');
                    var label = $.trim(s[0]);
                    var coach = parseInt(s[1]);
                    var row = parseInt(s[2]);
                    var col = parseInt(s[3]);

                    if (!isNaN(coach) && !isNaN(row) && !isNaN(col)) {
                        if (typeof self._transfer[coach - 1] == "undefined") {
                            self._transfer[coach - 1] = [];
                        }
                        if (typeof self._transfer[coach - 1][row - 1] == "undefined") {
                            self._transfer[coach - 1][row - 1] = [];
                        }

                        var seat = self._transfer[coach - 1][row - 1][col - 1];
                        if (typeof seat == "undefined") {
                            seat = new S(coach, row, col, 1, "seat", label, 2);
                            self._transfer[coach - 1][row - 1][col - 1] = seat;
                        }
                        if (seat != null) {
                            seat._addTicket(t);
                        }
                    }
                }
            });
        },
        _getTimeByDept: function (input) {
            var hour = input.getHours();
            var minute = input.getMinutes();
            if (hour.toString().length == 1) {
                hour = "0" + hour;
            }
            if (minute.toString().length == 1) {
                minute = "0" + minute;
            }
            return hour + ":" + minute;
        },
        _getHtmlTransfer: function (input, tbody) {
            if (input.length > 0) {
                $.each(input, function (ix, s) {
                    if (typeof s != "undefined" && s != null) {
                        var data = {
                            "seat": {
                                _index: s._pIndex,
                                _cname: s._cname,
                                _cphone: s._cphone,
                                _pText: s._pText,
                                _note: s._note,
                                _seatCodes: s._seatCodes.join(", "),
                                _seatInfos: s._seatInfos.join(),
                                _tids: s._tids.join(),
                                _pdate: s._pdate.join(),
                                _status: s._status == 1 ? "Đặt chỗ" : "Đã thanh toán",
                                _total: s._total.toMn() + "đ",
                                _time: s._time,
                                _numSeat: s._seatCodes.length,
                                _driverName: s._driverName != "" ? s._driverName : s._time
                            }
                        }
                        tbody.append($(vtpl(_dict._itsfTpl, data)));
                    }
                });
            }
        },
        _isInTimeStage: function (input, timeStage) {
            var time = timeStage.split('-');
            var from = time[0].split(':');
            var fromHour = from[0];
            var fromMinute = from[1];
            var to = time[1].split(':');
            var toHour = to[0];
            var toMinute = to[1];
            var inputTime = input.split(':');
            var inputHour = inputTime[0];
            var inputMinute = inputTime[1];
            if (parseInt(inputHour) < parseInt(fromHour)) {
                return false;
            } else if (parseInt(inputHour) > parseInt(toHour)) {
                return false;
            } else if (parseInt(inputHour) == parseInt(fromHour)) {
                if (parseInt(inputMinute) >= parseInt(fromMinute)) {
                    return true;
                } else {
                    return false;
                }
            } else if (parseInt(inputHour) == parseInt(toHour)) {
                if (parseInt(inputMinute) <= parseInt(toMinute)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        _renderTransferTicket: function () {
            var self = this;
            var result = [];
            var isMerge = false;
            if (typeof _dict._hasTransferTimeConf != "undefined") {
                $.each(_dict._hasTransferTimeConf, function (iT, ti) {
                    if (self._isInTimeStage(self._cTripTime, ti)) {
                        isMerge = true;
                        return true;
                    }
                });
            }
            var transfer = self._m;
            if (self._hasMergeTransfer() && typeof _dict._hasTransferTimeConf != "undefined" && isMerge) { //render merge transfer
                transfer = self._transfer;
            }

            if (transfer.length > 0) {
                var stickets = [];
                var nstickets = [];
                var nstickets2 = [];
                var customer = [];
                var total = 0;
                $.each(transfer, function (ic, c) {
                    if (typeof c != "undefined") {
                        $.each(c, function (ir, r) {
                            if (typeof r != "undefined") {
                                $.each(r, function (is, s) {
                                    if (typeof s != "undefined" && s != null) {
                                        if (s._hasTicket()) {
                                            $.each(s._tickets, function (iTick, tick) {
                                                var driverInfo = {}
                                                var driverName = "";
                                                var t = tick;
                                                if (!$.isEmptyObject(t)) {
                                                    var pInfo = t._getPickupInfo();
                                                    var timeOfDept = self._getTimeByDept(t._dept);
                                                    var tripId = t.tripId;
                                                    if ($.isEmptyObject(driverInfo)) {
                                                        $.each(self._data, function (inTrip, trip) {
                                                            if (trip.Id == tripId) {
                                                                driverInfo = trip;
                                                            }
                                                        });
                                                    }
                                                    if (driverInfo.Ts[timeOfDept] != undefined) {
                                                        var cTrip = driverInfo.Ts[timeOfDept][0];
                                                        if (cTrip.Dr != null) {
                                                            var indDr = cTrip.Dr.indexOf('~');
                                                            var splitDr = cTrip.Dr.substr(indDr, cTrip.Dr.length).split('|');
                                                            driverName = splitDr[2];
                                                        }
                                                    }

                                                    if (!$.isEmptyObject(pInfo) && vIsEstStr(pInfo.text) && pInfo.type == 'T') {
                                                        var ticketCode = t._code;
                                                        var cname = t._cname;
                                                        var cphone = t._getDefaultPhoneNumber();
                                                        var pIndex = parseInt(pInfo.pIndex);
                                                        var pText = pInfo.text;
                                                        if (isNaN(pIndex)) {
                                                            pIndex = 0;
                                                        }
                                                        if (typeof stickets[pIndex] == "undefined") {
                                                            stickets[pIndex] = [];
                                                        }

                                                        if (pIndex == 0) {
                                                            if (typeof _dict._allowGroupByCode != "undefined" && _dict._allowGroupByCode) {
                                                                var nTextCode = (ticketCode + "|" + pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                                var nkey2 = customer.indexOf(nTextCode);
                                                                if (nkey2 == -1) {
                                                                    nkey2 = customer.push(nTextCode) - 1;
                                                                }
                                                                if (typeof nstickets[nkey2] == "undefined") {
                                                                    nstickets[nkey2] = {
                                                                        _pIndex: pIndex,
                                                                        _seatCodes: [],
                                                                        _seatInfos: [],
                                                                        _tids: [],
                                                                        _cname: cname,
                                                                        _cphone: cphone,
                                                                        _code: ticketCode,
                                                                        _pText: pText,
                                                                        _note: t._note,
                                                                        _pdate: [],
                                                                        _status: t._status,
                                                                        _cuser: t._cuser,
                                                                        _total: 0,
                                                                        _time: timeOfDept,
                                                                        _driverName: driverName
                                                                    };
                                                                }
                                                                nstickets[nkey2]._seatCodes.push(s._label);
                                                                nstickets[nkey2]._seatInfos.push(s._getSeatInfo());
                                                                nstickets[nkey2]._tids.push(t._id);
                                                                nstickets[nkey2]._pdate.push(t._pdate.toFormatString('iso'));
                                                                nstickets[nkey2]._total += t._fare;
                                                            } else {
                                                                if (!vIsEstStr(cphone)) {
                                                                    nstickets2.push({
                                                                        _pIndex: pIndex,
                                                                        _seatCodes: [s._label],
                                                                        _seatInfos: [s._getSeatInfo()],
                                                                        _tids: [t._id],
                                                                        _cname: cname,
                                                                        _cphone: cphone,
                                                                        _code: ticketCode,
                                                                        _pText: pText,
                                                                        _note: t._note,
                                                                        _pdate: [t._pdate.toFormatString('iso')],
                                                                        _status: t._status,
                                                                        _cuser: t._cuser,
                                                                        _total: t._fare,
                                                                        _time: timeOfDept,
                                                                        _driverName: driverName
                                                                    });
                                                                } else {
                                                                    var ntext = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                                    var nkey = customer.indexOf(ntext);
                                                                    if (nkey == -1) {
                                                                        nkey = customer.push(ntext) - 1;
                                                                    }

                                                                    if (typeof nstickets[nkey] == "undefined") {
                                                                        nstickets[nkey] = {
                                                                            _pIndex: pIndex,
                                                                            _seatCodes: [],
                                                                            _seatInfos: [],
                                                                            _tids: [],
                                                                            _cname: cname,
                                                                            _cphone: cphone,
                                                                            _code: ticketCode,
                                                                            _pText: pText,
                                                                            _note: t._note,
                                                                            _pdate: [],
                                                                            _status: t._status,
                                                                            _cuser: t._cuser,
                                                                            _total: 0,
                                                                            _time: timeOfDept,
                                                                            _driverName: driverName
                                                                        };
                                                                    }
                                                                    nstickets[nkey]._seatCodes.push(s._label);
                                                                    nstickets[nkey]._seatInfos.push(s._getSeatInfo());
                                                                    nstickets[nkey]._tids.push(t._id);
                                                                    nstickets[nkey]._pdate.push(t._pdate.toFormatString('iso'));
                                                                    nstickets[nkey]._total += t._fare;
                                                                }
                                                            }
                                                        } else {
                                                            if (typeof stickets[pIndex] == "undefined") {
                                                                stickets[pIndex] = [];
                                                            }
                                                            var text = (pText + "|" + cname + "|" + cphone + "|" + t._note + "|" + t._status).hashCode();
                                                            var key = customer.indexOf(text);
                                                            if (key == -1) {
                                                                key = customer.push(text) - 1;
                                                            }
                                                            if (typeof stickets[pIndex][key] == "undefined") {
                                                                stickets[pIndex][key] = {
                                                                    _pIndex: pIndex,
                                                                    _seatCodes: [],
                                                                    _seatInfos: [],
                                                                    _tids: [],
                                                                    _code: ticketCode,
                                                                    _cname: cname,
                                                                    _cphone: cphone,
                                                                    _pText: pText,
                                                                    _note: t._note,
                                                                    _pdate: [],
                                                                    _status: t._status,
                                                                    _cuser: t._cuser,
                                                                    _total: 0,
                                                                    _time: timeOfDept,
                                                                    _driverName: driverName
                                                                };
                                                            }
                                                            stickets[pIndex][key]._seatCodes.push(s._label);
                                                            stickets[pIndex][key]._seatInfos.push(s._getSeatInfo());
                                                            stickets[pIndex][key]._tids.push(t._id);
                                                            stickets[pIndex][key]._pdate.push(t._pdate.toFormatString('iso'));
                                                            stickets[pIndex][key]._total += t._fare;
                                                        }

                                                        //Total
                                                        total += t._fare;
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                //Merge not sorted to tail
                if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
                    stickets[0] = nstickets;
                } else {
                    stickets[0] = nstickets.concat(nstickets2);
                }

                var timeSlots = [];
                if (self._hasMergeTransfer()
                    && typeof _dict._hasTransferTimeConf != "undefined"
                    && isMerge) {
                    $.each(self._data[self._cTripIndex].Ts, function (key, value) {
                        timeSlots.push(key);
                    });
                } else {
                    timeSlots.push(self._cTripTime);
                }
                var transferGroupIndex = 0;
                if (typeof _dict._hasTransferTimeConf != "undefined" && isMerge) {
                    $.each(_dict._hasTransferTimeConf, function (i, j) {
                        var dPerGroup = {};
                        var timePerGroup = [];
                        var itemPerGroup = [];
                        var totalPerGroup = 0;
                        $.each(timeSlots, function (k, l) {
                            if (self._isInTimeStage(l, j)) {
                                timePerGroup.push(l);
                            }
                        });
                        $.each(stickets, function (g, h) {
                            if (typeof h != "undefined") {
                                $.each(h, function (inItem, item) {
                                    if (typeof item != "undefined") {
                                        if (timePerGroup.indexOf(item._time) != -1) {
                                            itemPerGroup.push(item);
                                            totalPerGroup += item._total;
                                        }
                                    }
                                });
                            }
                        });
                        dPerGroup._times = timePerGroup;
                        dPerGroup._items = itemPerGroup;
                        dPerGroup._total = totalPerGroup;
                        dPerGroup._index = transferGroupIndex;
                        result.push(dPerGroup);
                        transferGroupIndex++;
                    });
                } else {
                    var d = {};
                    var timeGroup = timeSlots;
                    var itemGroup = [];
                    var totalGroup = 0;
                    $.each(stickets, function (g, h) {
                        if (typeof h != "undefined") {
                            if (_dict._allowGroupByCode != undefined && _dict._allowGroupByCode) {
                                Object.keys(h).forEach(function (key) {
                                    var item = h[key];
                                    itemGroup.push(item);
                                    totalGroup += item._total;
                                });
                            } else {
                                $.each(h, function (inItem, item) {
                                    if (typeof item != "undefined" && item != null) {
                                        itemGroup.push(item);
                                        totalGroup += item._total;
                                    }
                                });
                            }
                        }
                    });
                    d._times = timeGroup;
                    d._items = itemGroup;
                    d._total = totalGroup;
                    d._index = transferGroupIndex;
                    result.push(d);
                }
                self._$transfer = result;
                $.each(result, function (inOb, ob) {
                    var $transferUp = $(vtpl(_dict._tsfTpl, { "t": { _timeSlots: ob._times.join(', '), _total: ob._total.toMn() + "đ", _index: ob._index } }));
                    var $tbody = $transferUp.find('tbody');
                    self._getHtmlTransfer(ob._items, $tbody);
                    self._$sheet.append($transferUp);

                    if (!self._hasBookingPermission()) {
                        $transferUp.find('input.tIndex').prop('disabled', true);
                        $transferUp.find('button.btn-order').remove();
                    }
                });

                self._bindEventOnTransferTicket();
            }
        },
        _bindEventOnTransferTicket: function () {
            var self = this;
            $('input.tIndex', '.tlist').focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('.tlist button').each(function (_, b) {
                if ($(b).hasClass('btn-order')) {
                    vev(b, 'click', function (e) {
                        e.preventDefault();

                        //var $ct = $('.tlist tbody'),
                        var $ct = $(this).closest('table').find('tbody'),
                        $items = $ct.children(),
                        array = $items.get();

                        array.sort(function (o1, o2) {
                            var o1V = parseInt($(o1).find('input.tIndex').val());
                            var o2V = parseInt($(o2).find('input.tIndex').val());
                            return o1V - o2V;
                        });

                        var index = 1;
                        for (var i = 0; i < array.length; i++) {
                            var value = parseInt($(array[i]).find('input.tIndex').val());
                            if (isNaN(value)) {
                                value = 0;
                            }
                            if (value == 0) {
                                continue;
                            } else {
                                $(array[i]).find('input.tIndex').val(index);
                                index++;
                            }
                        }

                        $ct.append(array);
                        $ct.find('tr').addClass('sorted');
                        self._orderTransferInfo();

                        return false;
                    });
                } else if ($(b).hasClass('btn-print-list')) {
                    vev(b, 'click', function (e) {
                        e.preventDefault();
                        self._printTransferTicket($(this).attr('data-group-index'));
                    });
                }
            });
        },
        _orderTransferInfo: function () {
            var self = this;
            var obj = self._createOrderTransferObj();
            if (false != obj) {
                var completeReload = function (u, r, l, t) {
                    if (u != 1) return;
                    self._reloadSheet();
                };
                //Submit action
                self._submitAsyncAction(obj, completeReload);
            }
        },
        _createOrderTransferObj: function () {
            var self = this;
            var obj = false;
            var orders = self._$sheet.find('table.list-ticket input.tIndex');
            if (orders.length > 0) {
                obj = {};
                obj._a = "UpdateBookTicket";
                obj._c = [];
                obj._d = [];

                $.each(orders, function (ir, r) {
                    var $tr = $(r).closest('tr');
                    var sInfos = $tr.attr('data-seatinfos').split(',');
                    var pdate = $tr.attr('data-pdate').split(',');
                    var ids = $tr.attr('data-ids').split(',');

                    var nPInfo = "|" + $tr.attr('data-tText') + "|" + $(orders[ir]).val();
                    for (var i = 0; i < sInfos.length; i++) {
                        var id = parseInt(ids[i]);
                        obj._c.push({
                            Id: id,
                            TripId: self._cTripId,
                            SeatCode: sInfos[i],
                            PickupDate: pdate[i],
                            Bus: self._cTripBus
                        });

                        var dObj = {
                            PickupInfo: nPInfo
                        };

                        obj._d.push(dObj);
                    }
                });
            }

            return obj;
        },

        /************************************************************************
        * MULTI BAR                                                             *
        *************************************************************************/
        _showMultiticketBar: function (seat) {
            var self = this;
            //console.log(seat);
            self._$multiBar.find('nav').append(seat._renderMultiTicketSeat());
            self._$multiBar.show();
        }
    });
})(jQuery);

