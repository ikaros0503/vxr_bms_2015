(function ($) {
    H.prototype._renderLatestHistory = function () {
        var self = this;
        var act = "";
        if (typeof _dict._hAct[self._a] != "undefined") {
            act = _dict._hAct[self._a][_dict._lang];
        }
        var d = self._d.toFormatString('dd-mm-yyyy');
        var t = self._d.toFormatString('hh:mm:ss');
        if (self._a != 'move') {
            var data = {
                'h': {
                    _u: self._u,
                    _a: act,
                    _tid: self._dt._tid,
                    _tname: self._dt._tname,
                    _tdate: self._dt._tdate.toFormatString('dd-mm-yyyy'),
                    _ttime: self._dt._tdate.toFormatString('hh:mm'),
                    _d: d,
                    _t: t,
                    _s: self._dt._s.join(', ')
                }
            }
            return vtpl(_dict._lhTpl, data);
        } else {
            var mdata = {
                'h': {
                    _u: self._u,
                    _a: act,
                    _ftid: self._dt._ftid,
                    _ftname: self._dt._ftname,
                    _ftdate: self._dt._ftdate.toFormatString('dd-mm-yyyy'),
                    _fttime: self._dt._ftdate.toFormatString('hh:mm'),
                    _fs: self._dt._fs.join(', '),
                    _ttid: self._dt._ttid,
                    _ttname: self._dt._ttname,
                    _ttdate: self._dt._ttdate.toFormatString('dd-mm-yyyy'),
                    _tttime: self._dt._ttdate.toFormatString('hh:mm'),
                    _ts: self._dt._ts.join(', '),
                    _d: d,
                    _t: t
                }
            }
            return vtpl(_dict._mlhTpl, mdata);
        }
    }
    H.prototype._renderHistory = function () {
        var self = this;
        var act = "";
        if (typeof _dict._hAct[self._a] != "undefined") {
            act = _dict._hAct[self._a][_dict._lang];
        }
        if (self._a != 'move') {
            var data = {
                'h': {
                    _u: self._u,
                    _a: act,
                    _tid: self._dt._tid,
                    _tname: self._dt._tname,
                    _tdate: self._dt._tdate.toFormatString('dd-mm-yyyy'),
                    _ttime: self._dt._tdate.toFormatString('hh:mm'),
                    _d: self._d.toFormatString('dd-mm-yyyy'),
                    _t: self._d.toFormatString('hh:mm:ss'),
                    _s: self._dt._s.join(', ')
                }
            }
            if (self._a == "cancel") {
                data['h']['_type'] = 'isCancelled';
            }
            return vtpl(_dict._ihTpl, data);
        } else {
            var mdata = {
                'h': {
                    _u: self._u,
                    _a: act,
                    _ftid: self._dt._ftid,
                    _ftname: self._dt._ftname,
                    _ftdate: self._dt._ftdate.toFormatString('dd-mm-yyyy'),
                    _fttime: self._dt._ftdate.toFormatString('hh:mm'),
                    _fs: self._dt._fs.join(', '),
                    _ttid: self._dt._ttid,
                    _ttname: self._dt._ttname,
                    _ttdate: self._dt._ttdate.toFormatString('dd-mm-yyyy'),
                    _tttime: self._dt._ttdate.toFormatString('hh:mm'),
                    _ts: self._dt._ts.join(', '),
                    _d: self._d.toFormatString('dd-mm-yyyy'),
                    _t: self._d.toFormatString('hh:mm:ss')
                }
            }
            return vtpl(_dict._mihTpl, mdata);
        }
    }
    H.prototype._getStoreValue = function () {
        //console.log('_getStoreValue');
        var self = this;
        var values = [self._u, self._a, self._d.toFormatString('iso'), JSON.stringify(self._dt)];
        return values.join('|');
    }
})(jQuery);

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
        _$statusBar: null,
        _$historyLog: null,
        _historyStack: [],
        _latestHistory: null,
        _$latestSpan: null,
        _$log: null,

        /************************************************************************
        * CONSTRUCTOR AND INITIALIZATION METHODS                                *
        *************************************************************************/
        _create: function () {
            base._create.apply(this, arguments);
            if (!this.options.serviceUrl) {
                return;
            }
            this._initializeHistoryFields();
            this._createStatusBar();
        },
        _initializeHistoryFields: function () {
            var self = this;
            //self._historyStack = self._getHistoryCookie();
            //Transform
            //var key = self._getStoreKey();
            //$.cookie(key, "tasfsfsf", { path: '/' });
            //$.jStorage.deleteKey(key);

            self._transformCookieToStorage();
            self._historyStack = self._getStoreHistory();
            if (self._historyStack.length > 0) {
                self._latestHistory = self._historyStack[self._historyStack.length - 1];
            }
        },
        _createStatusBar: function () {
            var self = this;
            self._$statusBar = $(_dict._sBar).appendTo($('body'));
            self._$historyLog = $(_dict._hLog).appendTo($('body'));
            self._$latestSpan = self._$statusBar.find('span.latest-act');
            self._$log = self._$historyLog.find('tbody');

            self._bindEventOnStatusBar();

            self._reloadLatestHistory();
            self._reloadHistoryLog();
        },
        _bindEventOnStatusBar: function () {
            var self = this;
            self._$statusBar.find('a.slideout-menu-toggle').on('click', function (event) {
                try {
                    event.preventDefault();
                    // create menu variables
                    var slideoutMenu = self._$historyLog;
                    var slideoutMenuWidth = self._$historyLog.width();

                    // toggle open class
                    slideoutMenu.toggleClass("open");

                    // slide menu
                    if (slideoutMenu.hasClass("open")) {
                        slideoutMenu.animate({
                            right: "0px"
                        });
                    } else {
                        slideoutMenu.animate({
                            right: -slideoutMenuWidth
                        }, 250);
                    }
                } catch (e) {
                    console.error(e);
                }
            });
            self._$historyLog.find('input#hsearch').keyup(function (e) {
                try {
                    if (this.value.length > 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._filterHistoryLog(this.value);
                    } else {
                        self._normalizeHistoryLog();
                    }
                } catch (e) {
                    console.error(e);
                }
            });
            self._$latestSpan.on('click', function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    self._navigateToAction(self._$latestSpan.find('span'));
                } catch (e) {
                    console.error(e);
                }
            });
        },

        /************************************************************************
        * MAIN FUNC                                                             *
        *************************************************************************/
        _storeHistory: function (u, a, dt) {
            var self = this;
            //Add history
            var h = self._createHistory(u, a, dt);
            self._addHistory(h);

            //Set latest
            self._latestHistory = h;

            //Reload
            self._reloadLatestHistory();
            self._reloadHistoryLog();

            //Save in storage
            self._setHistoryStore();
            //self._setHistoryCookie();
        },
        _createHistory: function (u, a, dt) {
            return new H(u, a, new Date(), dt);
        },
        _addHistory: function (h) {
            var self = this;
            if (self._historyStack.length >= _dict._hlL) {
                self._historyStack.shift();
            }
            self._historyStack.push(h);
        },

        //_setHistoryCookie: function() {
        //    var self = this;
        //    var key = self._getCookieKey();
        //    var ck = [];
        //    for (var i = 0; i < self._historyStack.length; i++) {
        //        ck.push(self._historyStack[i]._getStoreValue());
        //    }
        //    $.cookie(key, ck.join('~'), { expires: _dict._ckExp, path: '/' });
        //},
        _setHistoryStore: function () {
            var self = this;
            var key = self._getStoreKey();
            var ck = [];
            for (var i = 0; i < self._historyStack.length; i++) {
                ck.push(self._historyStack[i]._getStoreValue());
            }
            $.jStorage.set(key, ck.join('~'));
        },
        //_getHistoryCookie: function() {
        //    var self = this;
        //    var hs = [];
        //    var key = self._getCookieKey();
        //    var cks = $.cookie(key);
        //    if (vIsEstStr(cks)) {
        //        var ck = cks.split('~');
        //        for (var i = 0; i < ck.length; i++) {
        //            hs.push(self._createHistoryFromString(ck[i]));
        //        }
        //    }
        //    return hs;
        //},
        _getStoreHistory: function () {
            var self = this;
            var hs = [];
            var key = self._getStoreKey();
            var cks = $.jStorage.get(key);
            if (vIsEstStr(cks)) {
                if (self._checkHistoryFormat(cks)) {
                    var ck = cks.split('~');
                    for (var i = 0; i < ck.length; i++) {
                        hs.push(self._createHistoryFromString(ck[i]));
                    }
                } else {
                    $.jStorage.set(key, "");
                }
            }
            return hs;
        },

        //_getCookieKey: function() {
        //    var self = this;
        //    return _dict._hckKey + self.options.un;
        //},
        _getStoreKey: function () {
            var self = this;
            return _dict._hckKey + self.options.un;
        },
        //_getCookieKeyRange: function() {
        //    var self = this;
        //    var result = [];
        //    for (var i = _dict._ckExp; i >= 0; i--) {
        //        var cd = new Date();
        //        cd.setDate(cd.getDate() - i);
        //        result.push(_dict._hckKey + self.options.un + cd.toFormatString('dd-mm-yyyy'));
        //    }

        //    return result;
        //},
        _createHistoryFromString: function (s) {
            var v = s.split('|');
            var dt = JSON.parse(v[3]);
            if (typeof dt['_tdate'] != "undefined") {
                dt['_tdate'] = new Date(dt['_tdate']);
            }
            if (typeof dt['_ftdate'] != "undefined") {
                dt['_ftdate'] = new Date(dt['_ftdate']);
            }
            if (typeof dt['_ttdate'] != "undefined") {
                dt['_ttdate'] = new Date(dt['_ttdate']);
            }
            return new H(v[0], v[1], vPrsDt(v[2]), dt);
        },

        _transformCookieToStorage: function () {
            var self = this;
            var sIndexs = $.jStorage.index();
            var key = self._getStoreKey();
            if ($.cookie(key) != null && sIndexs.indexOf(key) == -1) {
                $.jStorage.set(key, $.cookie(key));
                $.removeCookie(key, { path: '/' });
            }
        },
        _checkHistoryFormat: function (cks) {
            if (/[^\|]*\|[^\|]*\|[^\|]*\|[^\|]*/.test(cks)) {
                return true;
            }
            return false;
        },

        /************************************************************************
        * RENDER                                                                *
        *************************************************************************/
        _reloadHistoryLog: function () {
            var self = this;
            self._clearHistoryLog();

            //var h = self._historyStack.reverse();
            for (var i = self._historyStack.length - 1; i >= 0 ; i--) {
                var $l = self._historyStack[i]._renderHistory();
                self._$log.append($l);
            }

            self._bindEventOnHistoryLog();
        },
        _reloadLatestHistory: function () {
            var self = this;
            if (self._latestHistory != null) {
                var lh = self._latestHistory._renderLatestHistory();
                //if (_dict._hasNotification) {
                //    if (!self._isFirstTime) self._sendNotification(un, lh);
                //    else self._isFirstTime = false;
                //}
                self._$latestSpan.html(lh);
            }
        },
        _clearHistoryLog: function () {
            var self = this;
            self._$log.empty();
        },
        _bindEventOnHistoryLog: function () {
            var self = this;
            self._$log.find('tr').on('click', function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    self._navigateToAction(this);
                } catch (e) {
                    console.error(e);
                }
            });
        },
        _navigateToAction: function (obj) {
            var self = this;
            self._changeCTripId(parseInt($(obj).attr('tid')));
            self._changeCTripDate(vPrsDt($(obj).attr('tdate')));
            self._changeCTripTime($(obj).attr('ttime'));

            var slabel = $(obj).attr('slabel').split(', ');

            //Show BKS
            $('a[data-tab=bks]', 'ul.vbooking-list').trigger('click');
            self._$filterForm.find('input[name=DepartureDate]').val(self._cTripDate.toFormatString('DD dd-mm-yyyy')).trigger('change');
            if ($(obj).attr('type') == "isCancelled") {
                $('html, body').animate({
                    scrollTop: self._$cancelSheet.offset().top
                }, 500);
                self._findCancelledSeat(slabel);
            } else {
                $('html, body').animate({
                    scrollTop: $('body').offset().top
                }, 500);
                self._findSeat(slabel);
            }
            self._closeHistoryLog();
        },
        _closeHistoryLog: function () {
            var self = this;
            self._$historyLog.addClass('open');
            self._$statusBar.find('a.slideout-menu-toggle').trigger('click');
        },
        _findSeat: function (ss) {
            var self = this;
            $.each(self._m, function (_, c) {
                if (typeof c != "undefined" && c != null) {
                    $.each(c, function (__, r) {
                        if (typeof r != "undefined" && r != null) {
                            $.each(r, function (___, s) {
                                if (typeof s != "undefined" && s != null) {
                                    if (s._isAvailable() && s._hasTicket()) {
                                        if (ss.indexOf(s._label) != -1) {
                                            var obj = self._$sheet.find('.seat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                            if (!self._grid) {
                                                obj = self._$sheet.find('.lseat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                            }
                                            self._updateSeatStack(obj, s);
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        },
        _findCancelledSeat: function (ss) {
            var self = this;
            $.each(self._c, function (_, c) {
                if (typeof c != "undefined" && c != null) {
                    $.each(c, function (__, s) {
                        if (typeof s != "undefined" && s != null) {
                            if (ss.indexOf(s._label) != -1) {
                                var obj = self._$cancelSheet.find('.seat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                if (!self._grid) {
                                    obj = self._$cancelSheet.find('.lseat[data-position="' + s._coach + '_' + s._row + '_' + s._col + '"]');
                                }
                                self._updateSeatStack(obj, s);
                            }
                        }
                    });
                }
            });
        },
        _normalizeHistoryLog: function () {
            var self = this;
            self._$log.find('tr').removeClass('hidden');
        },
        _filterHistoryLog: function (text) {
            var self = this;
            text = vRdm(text);
            self._normalizeHistoryLog();
            self._$log.find('tr').each(function (_, i) {
                var ftext = vRdm($(i).text());
                if (ftext.indexOf(text) == -1) {
                    $(i).addClass('hidden');
                }
            });
        },
    });
})(jQuery);

