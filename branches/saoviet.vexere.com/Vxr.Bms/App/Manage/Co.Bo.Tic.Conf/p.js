define({
    onBeginSelectionChange: function(view, record) {
        vv.enableItem(view, 'button.delete', record != null);

    },
    gDisDate: function(data) {
        //console.log(data.record.XDate);
        return (data.record.XDate);
    },
    gDisTime: function(data) {
        if (vIsEstStr(data.record.XTime)) {
            return vPrsTm(data.record.XTime);
        } else return '--:--';
    },
    gDisType: function(data) {
        if (!$.isEmptyObject(data.record.XTypeId)) {
            return oTkt[parseInt(data.record.XTypeId)].v;
        } else return '---';
    },
    gDisFromId: function(d) {
        return d.record.XFromName;
    },
    gDisToId: function(d) {
        return d.record.XToName;
    },
    gDisInfo: function(data) {
        var info = data.record.Info;
        if (!vIsEstStr(info)) return '';
        if (data.record.XTypeId != 2 && data.record.XTypeId != 5) return info;
        if (info == '---') return 'Tùy chỉnh';
        var seats = info.split('~');
        if (parseInt(seats[1]) >= 1000) return 'Tất cả ghế';
        var v = '';
        for (var i = 2; i < seats.length; i++) {
            if (i == 2) v += seats[i].split('|')[0];
            else v += ', ' + seats[i].split('|')[0];
        };
        return v;
    },
    onTimeChange: function(w, x, e) {
    },

    rvcXTime: function(x, v) {
        return vPrsTm(v);
    },
    afterViewReady: function() {
        var me = this, v = me.o.view;
        var extCf = {
            _a: 'fGetCompany',
            _c: {
                Type: "($x IN (1,2))",
                IsPrgStatus: 1
            },
            _f: 'Id, Type, Name, BaseId, BusOperatorId'
        };
        me._listComp = [];
        var fCArr = extCf['_f'].split(',');
        vRql(extCf, {
            a: function(u, r, l, t) {
            },
            m: function(i, d) {
                var model = {};
                $.each(fCArr, function(j, v) {
                    v = v.trim();
                    model[v] = d[j];
                });
                me._listComp.push(model);
            },
            z: function(u, r, l, t) {
                me._listComp = vSort('Name', false, me._listComp);
                me._initOptionComp();
                me._initOptionAgent();
            }
        }, me);

        //var extCf = {
        //    _a: 'CheckExistingTicket',
        //    _c: {
        //        TripId: "2",
        //        TripDate: '2015-03-28 18:15:00.000'
        //    },
        //    _f: ''
        //};
        //var fCArr = extCf['_f'].split(',');
        //vRql(extCf, {
        //    a: function (u, r, l, t) {
        //    },
        //    m: function (i, d) {
        //        console.log(i, d);
        //    },
        //    z: function (u, r, l, t) {
        //    }
        //}, me);
    },
    afterReload: function(models) {
        var me = this, vi = me.o.view;
        $(vi).find('[data-toggle="toggle"]').bootstrapToggle('destroy').bootstrapToggle();
        $(vi).find('.cbEnBms').bootstrapToggle('on');
        //load trip
        me.listTrip = [];
        me.listTime = [];
        me._resetLstPair();
        me._resetOptions();
        me._initOptionType();
        me._renderTreeData(models);
        me._applyGrid();
        var extTf = {
            _a: 'fGetTrip',
            _c: {
                CompId: me.o.queryConditions.XCompanyId,
                IsPrgStatus: "$x != 3",
                Type: '1'
            },
            _f: 'Id, Name, Info, RouteId, RouteInfo, SeatTemplateInfo'
        };
        var fTArr = extTf['_f'].split(',');
        vRql(extTf, {
            a: function(u, r, l, t) {
                //$.each($.dx, function (idx, field) {
                //    if (field.base) {
                //        view.find(field.ref).empty();
                //    }
                //});
            },
            m: function(i, d) {
                var model = {};
                $.each(fTArr, function(j, v) {
                    v = v.trim();
                    model[v] = d[j];
                });
                me.listTrip.push(model);
            },
            z: function(u, r, l, t) {
                me.listTrip = vSort('Name', true, me.listTrip);
                me._initOptionTrip();
                me._renderSeatsData();
                me._bindEvent();
            }
        }, me);
    },
    _applyGrid: function() {
        var me = this, o = me.o;
        var models = [];
        $.each(me._treeData, function(tId, lstType) {
            if (typeof lstType != 'undefined') {
                $.each(lstType, function(tyId, lst) {
                    if (typeof lst != 'undefined') {
                        //lst = vSort('XDate', false, lst);
                        var md = {
                            XTripId: tId,
                            XTypeId: tyId,
                            XTripName: lst[0].XTripName,
                            XDate: lst[0].XDate,
                            XDateStop: lst[0].XDate,
                            Info: lst[0].Info
                        };
                        $.each(lst, function(_, v) {
                            if (md.XDateStop != v.XDate) {
                                var xdst = moment(md.XDateStop, 'DD-MM-YYYY');
                                var xd = moment(v.XDate, 'DD-MM-YYYY');
                                if (xdst.isValid() && xd.isValid() && (xdst.add(1, 'd')).isSame(xd)) {
                                    md.XDateStop = v.XDate;
                                    if (md.Info != v.Info) md.Info = '---';
                                } else {
                                    models.push(md);
                                    md = {
                                        XTripId: tId,
                                        XTypeId: tyId,
                                        XTripName: lst[0].XTripName,
                                        XDate: v.XDate,
                                        XDateStop: v.XDate,
                                        Info: v.Info
                                    };
                                }
                            }
                        });
                        models.push(md);
                    }
                });
            }
        });
        $('#' + o.gId).jtable('removeAllRows');
        $('#' + o.gId).jtable('addLocalRecords', function(lastPostData, params) {
            return me._listAction(models, params);
        });
    },
    _renderTreeData: function(models) {
        var me = this;
        me._treeData = [];
        $.each(models, function(i, v) {
            if (typeof me._treeData != 'undefined' && me._treeData.length > 0 && typeof me._treeData[v.XTripId] != 'undefined') {
                if (typeof me._treeData[v.XTripId][v.XTypeId] != 'undefined') {
                    me._treeData[v.XTripId][v.XTypeId].push(v);
                } else {
                    me._treeData[v.XTripId][v.XTypeId] = [v];
                }
            } else {
                me._treeData[v.XTripId] = [];
                me._treeData[v.XTripId][v.XTypeId] = [v];
            }
        });
    },
    _bindEvent: function() {
        var me = this, o = me.o, v = o.view;
        var isFocus = false;
        $(v).find('select.xLstTime').unbind('change').on('change', function() {
            var t = $(this).val();
            if (t && t.indexOf('0') >= 0) {
                $(v).find('input.eLstTime').parent().removeClass('hidden');
                $(v).find('select.xLstTime').parent().addClass('po-re').addClass('wid75');
            } else { //po-ab wid50
                $(v).find('input.eLstTime').parent().addClass('hidden');
                $(v).find('select.xLstTime').parent().removeClass('po-re').removeClass('wid75');
            }
        });
        $(v).find("input.seatTpl").unbind().on('focus', function(e) {
            isFocus = true;
            $(v).find("div.seatTpl").removeClass('hideSeats');
        }).on('blur', function() {
            isFocus = false;
        });
        $(v).find(".xDate").unbind('change').change(function() {
            me.onDateChange();
        });

        $(v).find(".xDateStop").unbind('change').change(function() {
            me.onDateChange();
        });
        $('.ticketConf').on('click', function (e) {
            e.preventDefault();
            var cnt = $(v).find("div.seatTpl");
            if (!cnt.is(e.target) && cnt.has(e.target).length === 0) {
                if (!isFocus) cnt.addClass('hideSeats');
                else {
                    cnt.removeClass('hideSeats');
                }
            } else {

            };
        });


        //$(v).find('button.pushAreaPair').unbind().on('click', function(e) {
        //    e.preventDefault();
        //    var frId = $(v).find('select.xFromId').val();
        //    var frName = $(v).find('select.xFromId').find('option:selected').text();
        //    var toId = $(v).find('select.xToId').val();
        //    var toName = $(v).find('select.xToId').find('option:selected').text();
        //    if (frId && toId) {
        //        me.listAreaPair.push({ FrId: parseInt(frId), ToId: parseInt(toId), FrName: frName, ToName: toName });
        //        me._updateAreaPairs();
        //        $(v).find('select.xFromId').trigger('change');
        //    }
        //}).on('contextmenu', function(e) {
        //    e.preventDefault();
        //    if (me.listAreaPair.length > 0) {
        //        me.listAreaPair.pop();
        //        me._updateAreaPairs();
        //        $(v).find('select.xFromId').trigger('change');
        //    }
        //    return false;
        //});

        $(v).find('button.sltAllRoute').unbind().on('click', function(e) {
            $(v).find('table.tblRoute').find('input:checkbox').each(function(_, cb) {
                $(cb).prop('checked', true);
                $(cb).parent().addClass('checked');
            });
        }).on('contextmenu', function(e) {
            e.preventDefault();
            $(v).find('table.tblRoute').find('input:checkbox').each(function(_, cb) {
                $(cb).prop('checked', false);
                $(cb).parent().removeClass('checked');
            });
            return false;
        });
        $(v).find('button.pushAllSeat').unbind().on('click', function(e) {
            $(v).find('div.seatTpl').find('div.seatSymbol').addClass('seatChecked');
            me._updateSeatTemplate();
        }).on('contextmenu', function(e) {
            $(v).find('div.seatTpl').find('div.seatSymbol').removeClass('seatChecked');
            me._updateSeatTemplate();
            return false;
        });
    },
    _getAreaPairs: function() {
        var me = this, v = me.view;
        var f = $(v).find('.tblRoute input:checkbox');
        me.listAreaPair = [];
        $.each(f, function(_, cb) {
            if ($(cb).prop('checked')) {
                me.listAreaPair.push({
                    FrId: $(cb).attr('from-id'),
                    ToId: $(cb).attr('to-id')
                });
            }
        });
    },
    _getShortName: function(name) {
        var n = '';
        $.each(name.trim().split(' '), function(_, v) {
            if (v.length > 0) {
                n += v[0].toUpperCase();
            }
        });
        return n;
    },
    _resetOptions: function() {
        var me = this, o = me.o, v = o.view;
        if (o.gId != 'rightsTableContainer') return;
        var cell = $(v).find('.xTrip');
        cell.empty();
        cell = $(v).find('select.eLstTime');
        cell.empty();
        cell = $(v).find('input.xLstTime');
        cell.val('');
        cell = $(v).find('.xType');
        cell.empty();
        cell = $(v).find('.xFromId');
        cell.empty();
        cell = $(v).find('.xToId');
        cell.empty();
    },
    _initSeatTpl: function() {
        var me = this, v = me.o.view;
        var fS = $(v).find('div.seatTpl');
        fS.empty();
        var tId = $(v).find('select.xTrip').val();
        var arr = vGetArr({ Id: parseInt(tId) }, false, me._arrSeats);
        var sMt = [];
        var maxCl = 0;
        $.each(arr[0].ArrSeat, function(_, s) {
            if (typeof sMt[s.r] == 'undefined') {
                sMt[s.r] = [];
                sMt[s.r][s.f] = [];
                sMt[s.r][s.f][s.c] = s.n;
            } else {
                if (typeof sMt[s.r][s.f] == 'undefined') {
                    sMt[s.r][s.f] = [];
                    sMt[s.r][s.f][s.c] = s.n;
                } else {
                    sMt[s.r][s.f][s.c] = s.n;
                }
            }
            if (s.c > maxCl) maxCl = s.c;
        });
        $.each(sMt, function(i, row) {
            if (!$.isEmptyObject(row)) {
                var r = $('<div />').css('display', 'flex').css('height', '40px');
                $.each(row, function(j, floor) {
                    if (!$.isEmptyObject(floor)) {
                        var f = $('<div />');
                        if (j == row.length - 1 && i == sMt.length - 1) f.addClass('lastRow');
                        if (j == row.length - 1) f.addClass('aboveFloor');
                        $.each(floor, function(k, col) {
                            if (vIsEstStr(col))
                                f.append(
                                    $('<div />').attr('r', i).attr('f', j).attr('c', k).
                                    on('click', function(e) {
                                        if ($(this).hasClass('seatChecked')) {
                                            $(this).removeClass('seatChecked');
                                        } else {
                                            $(this).addClass('seatChecked');
                                        };
                                        me._updateSeatTemplate();
                                    }).addClass("seatSymbol ").html(col)
                                );
                        });
                        r.append(f);
                    };
                });
                fS.append(r);
            };
        });
        me._mapSeatInfo();
    },
    _initOptionComp: function(v) {
        var me = this, o = me.o;
        if (!v) v = o.view;
        if (o.gId != 'rightsTableContainer') return;
        var fc = $(v).find('.xCompId');
        fc.empty();
        var lsComp = vGetArr({ Type: 1 }, false, me._listComp);
        lsComp = [{ Id: -1, Type: '', Name: 'Chọn nhà xe', BusOperatorId: '', BaseId: '' }].concat(lsComp);
        $.each(lsComp, function(_, c) {
            $.vCheckAndAppendOptions(fc, c.Id, c.Name, 'R', false, { busoprid: c.BusOperatorId });
        });
        fc.val(me.o.queryConditions.XCompanyId);
        var bOpId = $(v).find('select.xCompId option[value="' + fc.val() + '"]').attr('busoprid');
        $(v).find('input.xOperatorId').val(bOpId);
    },
    _initOptionAgent: function(v) {
        var me = this, o = me.o;
        if (!v) v = o.view;
        if (o.gId != 'rightsTableContainer') return;
        var fc = $(v).find('.xAgentId');
        var bId = $(v).find('.xCompId').val();
        fc.empty();
        var lsAg = vGetArr({ Type: 2, BaseId: parseInt(bId) }, false, me._listComp);
        lsAg = [{ Id: 1, Type: 2, Name: 'Vexere', BusOperatorId: 1, BaseId: 1 }].concat(lsAg);
        lsAg = [{ Id: '', Type: '', Name: 'Chọn đại lý', BusOperatorId: '', BaseId: '' }].concat(lsAg);
        $.each(lsAg, function(_, c) {
            $.vCheckAndAppendOptions(fc, c.Id, c.Name, 'R');
        });
    },
    _initOptionTrip: function(v) {
        var me = this, o = me.o;
        if (!v) v = o.view;
        if (o.gId != 'rightsTableContainer') return;
        var ftrip = $(v).find('.xTrip');
        var lsTrip = vGetArr({}, false, me.listTrip);
        lsTrip = vSort('Name', true, lsTrip);
        lsTrip = [{ Id: -1, Name: 'Chọn chuyến', Info: '' }].concat(lsTrip);
        $.each(lsTrip, function(_, c) {
            $.vCheckAndAppendOptions(ftrip, c.Id, c.Name, 'R');
        });
    },
    _initOptionType: function(v) {
        var me = this, o = me.o;
        if (!v) v = o.view;
        if (o.gId != 'rightsTableContainer') return;
        var ftype = $(v).find('.xType');
        ftype.empty();
        $.each(oTkt, function(i, val) {
            if (i == 0) {
                $.vCheckAndAppendOptions(ftype, i, val.v, 'R');
            } else {
                if (app.rights.indexOf(val.r) != -1) {
                    $.vCheckAndAppendOptions(ftype, i, val.v, 'R');
                }
            }
        });
    },
    _initTblRoute: function(routes) {
        var me = this, view = me.view;
        var tbl = $(view).find('.tblRoute');
        tbl.empty();
        var thead = $('<thead />');
        var tr = $('<tr />').append($('<th />'));
        $.each(routes, function(i, v) {
            var info = v.split('|');
            if (i != 0) tr.append($('<th />').attr('col-idx', info[0]).append($('<label />')
                .on('click', function(e) {
                    var to = $(this).parent().attr('col-idx');
                    $(tbl).find('input[to-id="' + to + '"]').each(function(_, ipt) {
                        $(ipt).prop('checked', true);
                        $(ipt).parent().addClass('checked');
                    });
                }).css('cursor', 'pointer').html(info[3])));
        });
        thead.append(tr);
        var tbody = $('<tbody />');
        $.each(routes, function(i, f) {
            var frinfo = f.split('|');
            if (i != routes.length - 1) {
                tr = $('<tr />').append($('<th />').attr('row-idx', frinfo[0]).append($('<label />')
                .on('click', function(e) {
                    var fr = $(this).parent().attr('row-idx');
                    $(tbl).find('input[from-id="' + fr + '"]').each(function(_, ipt) {
                        $(ipt).prop('checked', true);
                        $(ipt).parent().addClass('checked');
                    });
                }).css('cursor', 'pointer').html(frinfo[3])));
                if (i % 2 == 0) {
                    tr.addClass('even');
                };
                $.each(routes, function(j, t) {
                    var toinfo = t.split('|');
                    if (j != 0) {
                        if (i < j) {
                            tr.append(
                                $('<td />').append(
                                    $('<input type="checkbox" />').attr('from-id', frinfo[0]).attr('to-id', toinfo[0]))
                                .on('click', function() {
                                    if ($(this).hasClass('checked')) {
                                        $(this).removeClass('checked');
                                        $(this).find('input:checkbox').prop('checked', false);
                                    } else {
                                        $(this).addClass('checked');
                                        $(this).find('input:checkbox').prop('checked', true);
                                    };
                                }));
                        } else {
                            tr.append($('<td />').addClass('block'));
                        }
                    }
                });
                tbody.append(tr);
            }
        });
        tbl.append(thead).append(tbody);
        $(view).find('.sltAllRoute').removeClass('hidden');
    },
    _initOptionSeats: function() {
        var me = this, v = me.o.view;
        var fS = $(v).find('select.seats');
        fS.empty();
        var tId = $(v).find('select.xTrip').val();
        var arr = vGetArr({ Id: parseInt(tId) }, false, me._arrSeats);
        $.each(arr[0].ArrSeat, function(_, s) {

            var e = {
                f: s.f,
                r: s.r,
                c: s.c
            }
            $.vCheckAndAppendOptions(fS, s.n, s.n, 'R', false, e);
        });
        me._mapSeatInfo();

        fS.trigger('chosen:updated');
    },
    _mapSeatInfo: function() {
        var me = this, v = me.o.view;
        var info = $(v).find('input.info').val();
        if (!vIsEstStr(info)) return;

        var seats = info.split('~');
        var enBms = $(v).find('.cbEnBms');
        if (seats[0] == '1') enBms.bootstrapToggle('off'); //prop('checked', false).change();
        else enBms.bootstrapToggle('on'); //prop('checked', true);
        $(v).find('div.seatTpl').find('div.seatSymbol').removeClass('seatChecked');
        if (parseInt(seats[1]) < 1000) {
            for (var i = 2; i < seats.length; i++) {
                var sn = seats[i].split('|');
                $(v).find('div.seatTpl').find('div.seatSymbol[f="' + sn[1] + '"][c="' + sn[3] + '"][r="' + sn[2] + '"]').addClass('seatChecked');
            }
        }
        me._updateSeatTemplate();
    },
    _updateSeatTemplate: function() {
        var seat = [];
        var v = this.view;
        $(v).find('div.seatTpl').find('div.seatChecked').each(function(_, vl) {
            seat.push($(vl).text());
        });
        $(v).find('input.seatTpl').val(seat.join(', '));
    },
    _renderSeatsData: function() {
        var me = this, v = me.o.view;
        me._arrSeats = [];
        $.each(me.listTrip, function(_, tr) {
            var seats = tr.SeatTemplateInfo.split('~');
            var st = [];
            for (var i = 1; i < seats.length; i++) {
                var s = seats[i].split('|');
                if (s.length > 11) { //seat, not floor
                    if (s[2] == 1 || s[2] == 2 || s[2] == 3) { //seater, sleeper, semisleeper
                        var item = {
                            n: s[4],
                            f: s[5],
                            r: s[6],
                            c: s[7]
                        }
                        st.push(item);
                    }
                }
            }
            st = vSort('n', false, st);
            me._arrSeats.push({ Id: tr.Id, ArrSeat: st });
        });       
    },
    onCompChange: function() {
        var me = this, v = me.o.view;
        var cId = $(v).find('select.xCompId').val();
        if (cId != '-1') {
            me.o.queryConditions.XCompanyId = cId;
            me._reloadTable();
        }
        var fA = $(v).find('.xAgentId');
        fA.empty();
        var lsAg = vGetArr({ Type: 2, BaseId: parseInt(cId) }, false, me._listComp);
        lsAg = [{ Id: 1, Type: 2, Name: 'Vexere', BusOperatorId: 1, BaseId: 1 }].concat(lsAg);
        lsAg = [{ Id: '', Name: 'Chọn đại lý', BusOperatorId: '', Type: 2}].concat(lsAg);
        $.each(lsAg, function (_, c) {
            $.vCheckAndAppendOptions(fA, c.Id, c.Name, 'R', false);
        });
        var bOpId = $(v).find('select.xCompId option[value="' + cId + '"]').attr('busoprid');
        $(v).find('input.xOperatorId').val(bOpId);
        me._unloadTable();
    },
    onTripChange: function(w, x, e) {
        var me = this, v = me.o.view;
        var ftime = $(v).find('select.xLstTime');
        ftime.empty();
        me.arrRoutes = [];
        var tid = parseInt($(v).find('.xTrip').val());
        if (tid != -1) {
            var trip = vGetArr({ Id: tid }, false, me.listTrip);
            //console.log(trip);
            var t = trip[0].Info.split('~');
            t = t.concat(['Khác']);
            $.each(t, function(i, val) {
                if (i == t.length - 1) {
                    $.vCheckAndAppendOptions(ftime, '0', val, 'R');
                } else {
                    $.vCheckAndAppendOptions(ftime, val, val, 'R');
                }
            });
            var rId = trip[0].RouteId;
            $(v).find('input.xRouteId').val(rId);
            //From point and to point
            var routes = trip[0].RouteInfo.split("~");
            routes = routes.slice(1);
            //me._initOptionSeats();
            me._initSeatTpl();
            me._initTblRoute(routes);
        } else {
            $(v).find('.tblRoute').empty();
            $(v).find('select.seat').empty().trigger('chosen:updated');
            $(v).find('.sltAllRoute').addClass('hidden');
        }
        ftime.trigger('change').trigger('chosen:updated');
        
    },
    onTypeChange: function() {
        //var v = this.o.view;
        //var tId = $(v).find('.xType').val();
        //if (tId == 5) {
        //    $(v).find('.xAgentId').removeClass('hidden');
        //} else {
        //    $(v).find('.xAgentId').addClass('hidden');
        //}
    },
    onDateChange: function() {
        var me = this, view = me.view;
        if (typeof me.model != 'undefined' && !$.isEmptyObject(me.model)) {
            var xd = $(view).find('.xDate').val();
            var xdst = $(view).find('.xDateStop').val();
            var tId = parseInt($(view).find('.xTrip').val());
            var tyId = parseInt($(view).find('.xType').val());
            if (moment(xd, 'DD-MM-YYYY').isValid()) {
                if (moment(xdst, 'DD-MM-YYYY').isValid()) { //có ngày bắt đầu và kết thúc
                    if (moment(xd, 'DD-MM-YYYY').isAfter(moment(xdst, 'DD-MM-YYYY'))) {
                        $(view).find('.xDateStop').datepicker('setDate', vPrsDt(xd));
                    };
                    me._renderData(tId, tyId, xd, xdst);
                } else { // chỉ có ngày bắt đầu, không có kết thúc => lấy 1 ngày
                    me._renderData(tId, tyId, xd, xd);
                }
            } else { // không có ngày bắt đầu
                    me._renderData(tId, tyId, '', '');
            };
        }
    },
    onDateStopChange: function() {
        var me = this, view = me.view;
    },
    onItemLoaded: function (r) {
        var me = this, o = me.o, v = o.view;
        var tId = r.XTripId;
        var tyId = r.XTypeId;
        var xStt = r.XStatus;
        var frDate = r.XDate;
        var toDate = r.XDateStop;
        me._resetLstPair();
        $(v).find('.xTrip').val(tId);
        $(v).find('.xType').val(tyId);
        $(v).find('.status').val(xStt);
        me.onTripChange();
        me._renderData(tId, tyId, frDate, toDate);
        setTimeout(function () {   //required
            if (moment(toDate, 'DD-MM-YYYY').isValid())
                $(v).find('.xDateStop').datepicker('setDate', vPrsDt(toDate));
        }, 0);
    },
    onAfterUnloadItem: function () {
        var me = this, v = me.o.view;
        me._unloadTable();
    },
    _renderData: function (trip, type, fr, to) {
        var me = this, view = me.view;
        var routeTbl = $(view).find('.tblRoute');
        var time = $(view).find('.xLstTime');
        $(view).find('input.eLstTime').val('');
        time.val('');
        $(routeTbl).find('input:checkbox').each(function (_, v) {
            $(v).prop('checked', false);
            $(v).parent().removeClass('checked');
        });
        if (me._treeData[trip]) {
            if (me._treeData[trip][type]) {
                $.each(me._treeData[trip][type], function(_, v) {
                    var frd = moment(fr, 'DD-MM-YYYY');
                    var tod = moment(to, 'DD-MM-YYYY');
                    var cud = moment(v.XDate, 'DD-MM-YYYY');
                    if (v.XDate == fr || (frd.isValid() && tod.isValid() && cud.isValid() && (frd.isBefore(cud) || frd.isSame(cud)) && (tod.isAfter(cud) || tod.isSame(cud)))) {
                        try {
                            $(routeTbl).find('input:checkbox[from-id="' + v.XFromId + '"][to-id="' + v.XToId + '"]').each(function(__, cb) {
                                $(cb).prop('checked', true);
                                $(cb).parent().addClass('checked');
                            });
                            if (!$.isEmptyObject(v.XTime)) {
                                var xTime = vPrsTm(v.XTime);
                                var op = time.find('option[value="' + xTime + '"]');
                                if (op.length > 0) {
                                    op.prop('selected', true);
                                } else {
                                    time.find('option[value="0"]').prop('selected', true);
                                    time.trigger('change');
                                    var t = $(view).find('input.eLstTime').val();
                                    if (vIsEstStr(t)) {
                                        if (t.indexOf(xTime) < 0) t = t + ',' + xTime;
                                    }
                                    else t = xTime;
                                    $(view).find('input.eLstTime').val(t);
                                }
                            }
                            $(view).find('.timeLimit').val(v.TimeLimit);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            }
        }
        time.trigger('chosen:updated');
    },
    _unloadTable: function() {
        var v = this.o.view;
        $(v).find('.xTrip').val(-1);
        $(v).find('.info').val('');
        $(v).find('.xLstTime').val('').trigger('change').trigger('chosen:updated');
        $(v).find('.xType').val('0').trigger('change');
        $(v).find('.xDateStop').datepicker('enable');
        $(v).find('.xToId').empty();
        $(v).find('.xFromId').empty();
        $(v).find('select.seats').empty().trigger('chosen:updated');
        $(v).find('button.pushAreaPair').attr('disabled', false);
        $(v).find('.cbEnBms').bootstrapToggle('on');//prop('checked', false).change();
        $(v).find('.tblRoute').empty();
        $(v).find('div.seatTpl').empty();
        $(v).find('input.seatTpl').val('');
        $(v).find('.sltAllRoute').addClass('hidden');
        setTimeout(function () {   //required
            $(v).find('.xDate').datepicker('setDate', new Date());
        }, 0);
        this._resetLstPair();
    },
    _resetLstPair: function() {
        var me = this;
        me.listAreaPair = [];
        me._bindEvent();
    },
    onRightSave: function() {
        if (this._checkDataValid()) {
            this._onSave();
            $(this.view).find('select.seats').empty().trigger('chosen:updated');
        }
    },
    _checkDataValid: function () {
        var me = this, v = me.o.view;
        var hasError = false;
        var msg = '';
        var tyId = $(v).find('.xType').val();
        if (tyId == '0') {
            hasError = true;
            msg += 'Vui lòng chọn kiểu cấu hình.';
        }

        var aId = $(v).find('.xAgentId').val();
        if (tyId == 5 & (!aId || aId == '')) {
            hasError = true;
            msg += 'Vui lòng chọn đại lý.';
        }
        
        var tid = $(v).find('.xTrip').val();
        if (!tid || tid == -1) {
            hasError = true;
            msg += 'Vui lòng chọn chuyến.';
        } else {
            $(v).find('.xTripId').val(tid);
        }
        var time = $(v).find('select.xLstTime').val();
        if (!$.isEmptyObject(time) && time.length > 1 && me.model && me.model['Id']) {
            hasError = true;
            msg += 'Không thể cập nhật nhiều giờ.';
        }
        if (!$.isEmptyObject(time) && time.length > 0 && time.indexOf('0') >= 0) {
            var etime = $(v).find('input.eLstTime').val();
            if (vIsEstStr(etime)) {
                $.each(etime.split(','), function(_, it) {
                    if (!hasError) {
                        if (!moment(it.trim(), 'HH:mm').isValid()) {
                            hasError = true;
                            msg += 'Thời gian bạn nhập không đúng.';
                        }
                    }
                });
            } else {
                hasError = true;
                msg += 'Vui lòng thêm giờ khác.';
            }
        };
        if (tyId == 5 || tyId == 2) { //cấu hình phân quyền đại lý được bán vé nào
            var seats = $(v).find('div.seatTpl').find('div.seatChecked');
            var info = '';
            var alBms = false;
            var count = 0;
            if ($(v).find('.cbEnBms').prop('checked')) alBms = true;
            else alBms = false;
            //Nếu cho phép nhà xe đặt ghế online thì info sẽ có dạng 2~<>~<>
            if (seats && seats.length > 0) {
                for (var i = 0; i < seats.length; i++) {
                    var f = $(seats[i]).attr('f');
                    var r = $(seats[i]).attr('r');
                    var c = $(seats[i]).attr('c');
                    info += '~' + $(seats[i]).text() + '|' + f + '|' + r + '|' + c;
                }
                if (alBms) {
                    info = '2~' + seats.length + info;
                } else {
                    info = '1~' + seats.length + info;

                }
            } else {
                seats = $(v).find('div.seatTpl').find('div.seatSymbol');
                
                for (var i = 0; i < seats.length; i++) {
                    var f = $(seats[i]).attr('f');
                    var r = $(seats[i]).attr('r');
                    var c = $(seats[i]).attr('c');
                    info += '~' + $(seats[i]).text() + '|' + f + '|' + r + '|' + c;
                }
                count = 1000 + seats.length;
                if (alBms) {
                    info = '2~' + count + info;

                } else {
                    info = '1~' + count + info;

                }
            }
            $(v).find('input.info').val(info);
        }

        var tL = $(v).find('.timeLimit').val();
        if (!vIsEstStr(tL) || isNaN(tL)) {
            $(v).find('.timeLimit').val(0);
        }

        me._getAreaPairs();
        if (!me.listAreaPair || me.listAreaPair.length <= 0) {
            hasError = true;
            msg += 'Vui lòng chọn chặng đường.';
        }
        if (hasError) {
            vv.showMessage({
                element: v.find('.alert.message'),
                type: 'alert-danger',
                content: msg
            });
            return false;
        } else {
            return true;
        }
    },
    _onSave: function () {
        var me = this, v = me.o.view;
        var tId = $(v).find('.xTrip').val();
        var rId = $(v).find('.xRouteId').val();
        var oId = $(v).find('.xOperatorId').val();
        var aId = $(v).find('.xAgentId').val();
        var tyId = $(v).find('.xType').val();
        var xtime = $(v).find('select.xLstTime').val();
        var etime = $(v).find('input.eLstTime').val();
        var info = $(v).find('input.info').val();
        var df = $(v).find('.xDate').val(); // date from
        var dt = $(v).find('.xDateStop').val(); // date to
        var tL = $(v).find('.timeLimit').val();
        var data = [];
        var cond = [];
        if (!$.isEmptyObject(xtime) && xtime.length > 0) {
            var idx = xtime.indexOf('0');
            if (idx >= 0) {
                xtime.splice(idx, 1);
                $.each(etime.split(','), function(_, it) {
                    if (xtime.indexOf(it.trim()) < 0) {
                        xtime.push(it.trim());
                    };
                });
            }
        } else {
            xtime = [''];
        };
        $.each(xtime, function(_, time) {
            $.each(me.listAreaPair, function(_, pair) {
                var d = {
                    XTypeId: tyId,
                    XStatus: 1,
                    XOperatorId: oId,
                    XCompanyId: me.o.queryConditions.XCompanyId,
                    //XAgentId: aId,
                    XRouteId: rId,
                    XTripId: tId,
                    XDate: '',
                    XTime: time,
                    Info: info,
                    XFromId: pair.FrId,
                    XToId: pair.ToId,
                    TimeLimit: tL,
                    IsPrgStatus: 1
                };
                var c = {
                    XTypeId: tyId,
                    XCompanyId: me.o.queryConditions.XCompanyId,
                    //XAgentId: aId,
                    XTripId: tId,
                    XDate: '',
                    XTime: time,
                    XFromId: pair.FrId,
                    XToId: pair.ToId
                };
                if (typeof df != 'undefined' && vIsEstStr(df)) {
                    var dfs = df.split('-');
                    var fDate = new Date(dfs[2], dfs[1] - 1, dfs[0]);
                    if (typeof dt != 'undefined' && vIsEstStr(dt)) {
                        var dts = dt.split('-');
                        var tDate = new Date(dts[2], dts[1] - 1, dts[0]);
                        for (var da = fDate; da <= tDate; da.setDate(da.getDate() + 1)) {
                            d = {
                                XTypeId: tyId,
                                XStatus: 1,
                                XOperatorId: oId,
                                XCompanyId: me.o.queryConditions.XCompanyId,
                                XAgentId: aId,
                                XRouteId: rId,
                                XTripId: tId,
                                XDate: vDtToStr("iso", da),
                                XTime: time,
                                Info: info,
                                XFromId: pair.FrId,
                                XToId: pair.ToId,
                                TimeLimit: tL,
                                IsPrgStatus: 1
                            };
                            c = {
                                XTypeId: tyId,
                                XCompanyId: me.o.queryConditions.XCompanyId,
                                XAgentId: aId,
                                XTripId: tId,
                                XDate: vDtToStr("iso", da),
                                XTime: time,
                                XFromId: pair.FrId,
                                XToId: pair.ToId,
                            };
                            data.push(d);
                            cond.push(c);
                        }
                    } else {
                        d.XDate = vDtToStr("iso", fDate);
                        c.XDate = vDtToStr("iso", fDate);
                        data.push(d);
                        cond.push(c);
                    }
                } else {
                    data.push(d);
                    cond.push(c);
                }
            });
        });
        me._saveData(data, cond, me.o.updateAction);
    },
    _saveData: function (dt, cd, action) {
        var me = this, o = me.o, view = o.view;
        var obj;
        var pageSize = parseInt($('#' + o.gId + ' .jtable-page-size-change select').val());
        obj = { _a: action, _c: cd, _d: dt };
        vRqs(obj, function (u, r, l, t) {
            if (u) {
                if (me.onActionComplete) me.onActionComplete.call(me);
                vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                if (me.onUpdateSuccess) me.onUpdateSuccess.call();
                else {
                    me._reloadTable(null, function () {
                        vv.clearFormAndGrid(view);
                        me._unloadTable();
                        $('#' + o.gId + ' .jtable-page-size-change select').val(pageSize);
                        //$('#' + cf.gId).unmask();
                    }, null);
                }
            } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
        });
    },
    _onDelete: function () {
        var me = this, v = me.o.view;
        var tId = $(v).find('.xTrip').val();
        var aId = $(v).find('.xAgentId').val();
        var tyId = $(v).find('.xType').val();
        var xtime = $(v).find('select.xLstTime').val();
        var etime = $(v).find('input.eLstTime').val();
        var df = $(v).find('.xDate').val(); // date from
        var dt = $(v).find('.xDateStop').val(); // date to
        var data = [];
        var cond = [];
        if (!$.isEmptyObject(xtime) && xtime.length > 0) {
            var idx = xtime.indexOf('0');
            if (idx >= 0) {
                xtime.splice(idx, 1);
                $.each(etime.split(','), function (_, it) {
                    if (xtime.indexOf(it.trim()) < 0) {
                        xtime.push(it.trim());
                    };
                });
            }
        } else {
            xtime = [''];
        };
        $.each(xtime, function (_, time) {
            $.each(me.listAreaPair, function (_, pair) {
                var d = {
                    XStatus: 0,
                    IsPrgStatus: 3
                };
                var c = {
                    XTypeId: tyId,
                    XCompanyId: me.o.queryConditions.XCompanyId,
                    XTripId: tId,
                    XDate: '',
                    XTime: time,
                    XFromId: pair.FrId,
                    XToId: pair.ToId
                };
                if (typeof df != 'undefined' && vIsEstStr(df)) {
                    var dfs = df.split('-');
                    var fDate = new Date(dfs[2], dfs[1] - 1, dfs[0]);
                    if (typeof dt != 'undefined' && vIsEstStr(dt)) {
                        var dts = dt.split('-');
                        var tDate = new Date(dts[2], dts[1] - 1, dts[0]);
                        for (var da = fDate; da <= tDate; da.setDate(da.getDate() + 1)) {
                            c = {
                                XTypeId: tyId,
                                XCompanyId: me.o.queryConditions.XCompanyId,
                                XTripId: tId,
                                XDate: vDtToStr("iso", da),
                                XTime: time,
                                XFromId: pair.FrId,
                                XToId: pair.ToId,
                            };
                            data.push(d);
                            cond.push(c);
                        }
                    } else {
                        c.XDate = vDtToStr("iso", fDate);
                        data.push(d);
                        cond.push(c);
                    }
                } else {
                    data.push(d);
                    cond.push(c);
                }
            });
        });
        me._saveData(data, cond, me.o.removeAction);
    },
    onRightDelete: function() {
        if (this._checkDataValid()) this._onDelete();
    },
    onRightClear: function () {
        this.onBasicClear();
        this._unloadTable();
    },
})