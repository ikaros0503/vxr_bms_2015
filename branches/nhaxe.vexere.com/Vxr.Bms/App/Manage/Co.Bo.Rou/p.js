define(
    {

        //#region Private Methods
        _loadUtility: function(info) {
            var me = this;
            me._unloadUtility();
            if (vIsEstStr(info)) {
                var idx = info.indexOf("~");
                if (idx >= 0) {
                    info = info.substring(idx + 1);
                    var utils = info.split("~");
                    var c, t, selector;
                    for (var i = 0; i < utils.length; i++) {
                        t = parseInt(utils[i]);
                        switch (t) {
                        case 1: //water
                            selector = 'input.water';
                            break;
                        case 2: //towel
                            selector = 'input.towel';
                            break;
                        case 3: //toilet
                            selector = 'input.toilet';
                            break;
                        case 4: //dvd
                            selector = 'input.dvd';
                            break;
                        case 5: //condition
                            selector = 'input.condition';
                            break;
                        case 6: //rug
                            selector = 'input.rug';
                            break;
                        case 7: //food
                            selector = 'input.food';
                            break;
                        case 8: //wifi
                            selector = 'input.wifi';
                            break;
                        default:
                            selector = '';
                        }
                        if (t > 0) {
                            $(selector).prop('checked', true);
                        }
                    }
                }
            }
        },

        _unloadUtility: function() {
            var i = $('#utility-form input');
            $.each(i, function(_, f) {
                $(f).prop('checked', false);
            });
        },

        _unloadRouteTable: function() {
            var me = this;
            var routeTable = document.getElementById("route-table");
            if (routeTable) {
                var rows = routeTable.rows;
                for (var i = rows.length - 2; i > 1; i--) {
                    routeTable.deleteRow(i);
                }
                for (var j = 1; j < rows.length; j++) {
                    cell = $(rows[j]).find('.city').find('option');
                    cell.find(':selected').prop('selected', false);
                    cell.filter('[value="-1"]').prop('selected', true);
                    $(rows[j]).find('input.point-code').val('');
                }
                me.onCityChange();
            }
        },

        _getRouteStopItems: function(o, rowIdx, rs) {
            var me = this;
            var arr = [];
            var x = { items: [] };
            $.each(me.o.routeStopRow, function(k, val) {
                x[k] = val;
            });
            $.each(me.o.routeStopItems, function (k, val) {
                rs.push(val.items[0]);
                if (val.items[0].name == 'btnAddRouteStop' || val.items[0].name == 'btnDelRouteStop') {
                    val.row = rowIdx;
                };
                if (typeof val.items[1] != 'undefined' && val.items[1].name == 'btnDelRouteStop') {
                    val.row = rowIdx;
                    rs.push(val.items[1]);
                };
                x.items.push(val);
            });
            arr.push(x);
            return arr;

        },

        _getNewRow: function(rowIdx, rs) {
            var me = this;
            var o = {
                cols: 12,
                items: me._getRouteStopItems(me.o.routeStopItems, rowIdx, rs)
            };
            vv.initObjs(o);
            //TODO, check $.dx
            // rs['gridCols'] = {}; rs['gQuery'] = []; $.dx = []; rs['fields'] = []; rs['buttons'] = [];
            //var html = vv.getBodyHtml(newcf, newcf.items, rs);
            var html = vv.getBodyHtml(o);

            return html;
        },

        _initOptionCity: function(view) {
            var me = this, o = me.o;
            if (!view) view = o.view;
            if (o.gId != 'routeTableContainer') return;
            var fieldLs = view.find('.city');
            var lsCity = vGetArr({ Type: 3 }, false, me.listArea);
            //console.log(fieldLs);
            lsCity = vSort('Name', true, lsCity);
            lsCity = [{ Id: -1, Name: 'Chọn thành phố' }].concat(lsCity);
            $.each(lsCity, function(_, c) {
                $.vCheckAndAppendOptions(fieldLs, c.Id, c.Name, 'R');
            });
        },
        _initListArea: function(view) {
            var me = this, o = me.o;
            if (!view) view = o.view;
            if (o.gId != 'routeTableContainer') return;
            var fieldLs = view.find('.lstArea');
            var lsCity = vGetArr({ Type: 3 }, false, me.listArea);
            lsCity = vSort('Name', false, lsCity);
            lsCity = [{ Id: 0, Name: 'Chọn' }].concat(lsCity);
            $.each(lsCity, function (i, c) {
                var optGr = $('<optgroup />').attr('label', c.Name);
                var lsState = vGetArr({ BaseId: c.Id }, false, me.listArea);
                $.each(lsState, function (j, s) {
                    var lsStPnt = vGetArr({ BaseId: s.Id }, false, me.listArea);
                    $.each(lsStPnt, function (k, st) {
                        var opt;
                        if (st.Type == 16) opt = $('<option />').val(st.Id).text('(*) ' + st.Name);
                        else opt = $('<option />').val(st.Id).text(st.Name);
                        //fieldLs.append(opt);
                        optGr.append(opt);
                    });

                });
                fieldLs.append(optGr);

            });
            fieldLs.val('');
            fieldLs.chosen({
                width: '100%'
            });
            
        },
        _loadRouteTable: function(tId, info) {
            if (!info) return;
            var me = this;
            me._unloadRouteTable();
            var routeTable = document.getElementById(tId);
            var rows = routeTable.rows;
            var idx = info.indexOf("~");
            if (idx >= 0) {
                info = info.substring(idx + 1);
                var routes = info.split("~");
                // render row
                for (var i = 1; i < routes.length - 1; i++) {
                    me.onAddRouteStop(null, null, null, null, i);
                }
                var cell, row;
                var val, cId, wId;

                for (var i = 0; i < routes.length; i++) {
                    row = rows[i + 1];
                    //city
                    val = parseInt(vGvl(routes[i], "|", 0));
                    var obj = vGetObj({ Id: val }, me.listArea);
                    if (obj) {
                        wId = obj.BaseId;
                        obj = vGetObj({ Id: wId }, me.listArea);
                        if (obj) {
                            cId = obj.BaseId;
                        }
                    }
                    //console.log(routes);
                    cell = $(row).find('.city').find('option');
                    cell.find(':selected').prop('selected', false);
                    cell.filter('[value="' + cId + '"]').prop('selected', true);
                }
                me.onCityChange();
                for (var i = 0; i < routes.length; i++) {
                    row = rows[i + 1];
                    //city
                    val = parseInt(vGvl(routes[i], "|", 0));
                    var obj = vGetObj({ Id: val }, me.listArea);
                    if (obj) {
                        wId = obj.BaseId;
                    }
                    //console.log(routes);
                    cell = $(row).find('.ward').find('option');
                    cell.find(':selected').prop('selected', false);
                    cell.filter('[value="' + wId + '"]').prop('selected', true);
                }
                me.onWardChange();
                for (var i = 0; i < routes.length; i++) {
                    row = rows[i + 1];
                    //name stop area
                    val = parseInt(vGvl(routes[i], "|", 0));
                    cell = $(row).find('.stop-area').find('option');
                    cell.find(':selected').prop('selected', false);
                    cell.filter('[value="' + val + '"]').prop('selected', true);
                    //distance
                    val = parseInt(vGvl(routes[i], "|", 5));
                    cell = $(row).find('input.distance');
                    cell.val(val);
                    //code
                    //val = vGvl(routes[i], "|", 2);
                    //cell = $(row).find('input.point-code');
                    //cell.val(val);
                    //console.log(val, cell);
                    //address
                    //val = (vGvl(routes[i], "|", 4));
                    //cell = $(row).find('input.address');
                    //cell.val(val);
                    // hour
                    val = (vGvl(routes[i], "|", 6)) + ":" + vGvl(routes[i], "|", 7);
                    cell = $(row).find('input.hour');
                    cell.val(val);
                    //minute
                    //val = parseInt(vGvl(routes[i], "|", 7));
                    //cell = $(row).find('input.minute');
                    //cell.val(val);
                }
            }
        },
        //#endregion

        //#region Callbacks
        onBeginSelectionChange: function (view, record) {
            vv.enableItem(view, 'button.delete', record != null);

        },

        onLoadingField: function(x, r) {
            var me = this;
            if (x.tableContent) {
                me._loadRouteTable(x.id, r[x.name]);
            } else if (x.isUtility) {
                me._loadUtility(r[x.name]);
            }
        },

        onAfterUnloadItem: function() {
            var me = this;
            me._unloadRouteTable();
            me._unloadUtility();
            $('select.lstArea').val('').trigger('chosen:updated');
        },

        onEndloadBaseData: function(o, cb) {
            var me = this;
            if (o.extCf) {
                if (o.gId == 'routeTableContainer') {
                    var fieldArr = o.extCf['_f'].split(',');
                    vRql(o.extCf, {
                        a: function(u, r, l, t) {
                            //$.each($.dx, function (idx, field) {
                            //    if (field.base) {
                            //        view.find(field.ref).empty();
                            //    }
                            //});
                        },
                        m: function (i, d) {
                            var model = {};
                            $.each(fieldArr, function(j, v) {
                                v = v.trim();
                                model[v] = d[j];
                            });
                            me.listArea.push(model);
                        },
                        z: function (u, r, l, t) {
                            me.listArea = vSort('Name', true, me.listArea);
                            me._initOptionCity();
                            me._initListArea();
                            if (cb) {
                                cb.call(me);
                            }
                        }
                    }, me);
                }
            }
        },
        afterReload: function() {
            var me = this, v = me.o.view;
            v.find('button.genTime').unbind().on('click', function(e) {
                var srtTime = v.find('input.genTime').val();
                var stpTime = v.find('input.genTimeStop').val();
                var f = parseInt(v.find('input.frequence').val());

                if (moment(srtTime, 'HH:mm').isValid() && moment(stpTime, 'HH:mm').isValid() && !isNaN(f)) {
                    var info = '';
                    var srtT = moment(srtTime, 'HH:mm');
                    var stpT = moment(stpTime, 'HH:mm');
                    while (stpT.isAfter(srtT) || srtT.isSame(stpT)) {
                        info += '' + srtT.format('HH:mm') + '~';
                        srtT.add(f, 'minutes');
                    }
                    info = info.substring(0, info.length - 1);
                    v.find('input.info').val(info);
                } else {
                    alert('Nhập sai thông tin. Vui lòng kiểm tra lại!');
                }
                ;
            });
            v.find('button.addTime').unbind().on('click', function() {
                var time = v.find('input.addDelTime').val();
                if (moment(time, 'HH:mm').isValid()) {
                    var info = v.find('input.info').val();
                    var t = moment(time, 'HH:mm').format('HH:mm');
                    if (info.length == 0) {
                        v.find('input.info').val(t);
                    } else {
                        if (info.indexOf(t) == -1) {
                            info += '~' + t;
                            v.find('input.info').val(info);
                        } else {
                            alert('Giờ đã tồn tại! Không thể thêm!');
                        }
                    }
                } else {
                    alert('Nhập sai thông tin. Vui lòng kiểm tra lại!');
                }
            });
            v.find('button.delTime').unbind().on('click', function () {
                var time = v.find('input.addDelTime').val();
                if (moment(time, 'HH:mm').isValid()) {
                    var info = v.find('input.info').val();
                    var t = moment(time, 'HH:mm').format('HH:mm');
                    info = info.replace(t, '');
                    info = info.replace('~~', '~');
                    if (info[info.length - 1] == '~') info = info.substring(0, info.length - 1);
                    if (info[0] == '~') info = info.substring(1, info.length);
                    v.find('input.info').val(info);
                } else {
                    alert('Nhập sai thông tin. Vui lòng kiểm tra lại!');
                }
            });
        },
        //#endregion

        //#region Listeners
        onItemLoaded: function() {
            var me = this, v = me.o.view;
            v.find('.lstArea').trigger('chosen:updated');
        },
        onCityChange: function(w, x, e) {
            var me = this;
            if (e) {
                var ev = { target: null };
                var crow = $(e.target).parent().parent();
                var cId = parseInt($(crow).find('.city').val());
                var wardf = $(crow).find('.ward');
                wardf.empty();
                ev.target = wardf;
                var lsCity = vGetArr({ BaseId: cId }, false, me.listArea);
                $.each(lsCity, function(_, c) {
                    var lsStop = vGetArr({ BaseId: c.Id, Type: 15 }, false, me.listArea).concat(vGetArr({ BaseId: c.Id, Type: 16, CompId: parseInt(app.cid) }, false, me.listArea));
                    if (lsStop.length > 0) $.vCheckAndAppendOptions(wardf, c.Id, c.Name, 'R');
                });
                me.onWardChange(w, x, ev);
            } else {
                var routeTable = $('#route-table');
                var tdata = routeTable.find('tbody').find('tr');
                $.each(tdata, function(i, row) {
                    var cId = parseInt($(row).find('.city').val());
                    var wardf = $(row).find('.ward');
                    wardf.empty();
                    var lsCity = vGetArr({ BaseId: cId }, false, me.listArea);
                    $.each(lsCity, function(_, c) {
                        var lsStop = vGetArr({ BaseId: c.Id, Type: 15 }, false, me.listArea).concat(vGetArr({ BaseId: c.Id, Type: 16, CompId: parseInt(app.cid) }, false, me.listArea));
                        if (lsStop.length > 0) $.vCheckAndAppendOptions(wardf, c.Id, c.Name, 'R');
                    });
                });
                me.onWardChange();
            }

        },

        onAddRouteStop: function(ct, cf, cb, btn, idx) {
            var me = this;
            var rowCl;
            if (!btn) {
                rowCl = idx;
            } else {
                rowCl = parseInt($(btn).attr('row'));
                if (isNaN(rowCl)) rowCl = 1;
            }
            rowCl++;
            var routeTable = document.getElementById("route-table");
            var row = routeTable.insertRow(rowCl);
            var rs = [];
            row.innerHTML = me._getNewRow(-1, rs);
            if (rs.length > 0) me._applyListeners(rs);
            me._initOptionCity($(row));
            routeTable = $('#route-table');
            var tdata = routeTable.find('tbody').find('tr');
            $.each(tdata, function(i, v) {
                var addB = $(v).find('.addRouteStop');
                var delB = $(v).find('.delRouteStop');
                var oldR = parseInt(addB.attr('row'));
                if (oldR == -1 || isNaN(oldR)) {
                    addB.attr('row', rowCl);
                    delB.attr('row', rowCl);
                } else if (oldR >= rowCl) {
                    addB.attr('row', oldR + 1);
                    delB.attr('row', oldR + 1);
                }
            });
        },

        onDelRouteStop: function(ct, cf, cb, btn, idx) {
            var me = this;
            var rowCl;
            if (!btn) {
                rowCl = idx;
            } else {
                rowCl = parseInt($(btn).attr('row'));
            }
            //console.log('delete row: ' + rowCl);
            var routeTable = document.getElementById("route-table");
            var id = $(routeTable.rows[rowCl]).find('.stop-area').find('option:selected').val();
            routeTable.deleteRow(rowCl);
            routeTable = $('#route-table');
            var tdata = routeTable.find('tbody').find('tr');
            $.each(tdata, function(i, v) {
                var addB = $(v).find('.addRouteStop');
                var delB = $(v).find('.delRouteStop');
                var oldR = parseInt(addB.attr('row'));
                if (oldR >= rowCl) {
                    addB.attr('row', oldR - 1);
                    delB.attr('row', oldR - 1);
                }
            });
            // delete fare info 
            // confirm before delete

            if (me.model) {
                var info = me.model.FareInfo;
                if (vIsEstStr(info)) {
                    try {
                        var index = info.indexOf('~');
                        var newInf;
                        if (index >= 0) {
                            newInf = info.substring(0, index);
                            info = info.substring(index + 1);
                            var a = info.split('~');
                            for (var i = 0; i < a.length; i++) {
                                var ai = a[i].split('|');
                                if (ai[0] != id && ai[1] != id) {
                                    newInf += '~' + a[i];
                                }
                            }
                            //console.log(newInf);
                            $('input.fare-info').val(newInf);
                        }
                    } catch (e) {
                        console.log('Catched', e);
                    }
                }
            }
            ///////////////////
        },

        onWardChange: function(w, x, e) {
            var me = this;
            if (!e) {
                var routeTable = $('#route-table');
                var tdata = routeTable.find('tbody').find('tr');
                $.each(tdata, function(i, row) {
                    var wId = parseInt($(row).find('.ward').val());
                    var stopf = $(row).find('.stop-area');
                    stopf.empty();
                    var lsSa = vGetArr({ BaseId: wId, Type: 15 }, false, me.listArea).concat(vGetArr({ BaseId: wId, Type: 16, CompId: parseInt(app.cid) }, false, me.listArea));
                    $.each(lsSa, function (_, c) {
                        $.vCheckAndAppendOptions(stopf, c.Id, c.Code + " ~ " + c.Name, 'R');
                    });
                });
            } else {
                var row = $(e.target).parent().parent();
                var wId = parseInt($(row).find('.ward').val());
                var stopf = $(row).find('.stop-area');
                stopf.empty();
                var lsSa = vGetArr({ BaseId: wId, Type: 15 }, false, me.listArea).concat(vGetArr({ BaseId: wId, Type: 16, CompId: parseInt(app.cid) }, false, me.listArea));
                $.each(lsSa, function (_, c) {
                    $.vCheckAndAppendOptions(stopf, c.Id, c.Code + " ~ " + c.Name, 'R');
                });
            }

        },

        onRouteSave: function() {
            var me = this;
            //var tab = ($('body').find('div.tuyenduong').find('li.active').find('a').attr('href'));
            var routeTable = document.getElementById('route-table');
            var rows = routeTable.rows;
            var info = '1';
            var hasError = false;
            var msg = '';
            // render row
            var row, time;
            var aId, name, pointCode;
            var totalStage = 0;
            var fromId = 0, toId = 0;
            for (var i = 1; i < rows.length; i++) {
                row = rows[i];
                var route = '';
                //stop area
                var sArea = $(row).find('.stop-area').find('option:selected');
                if (sArea.length > 0) {
                    aId = parseInt(sArea.val());
                    if (i == 1) {
                        fromId = aId;
                    };
                    toId = aId;
                    var stp = vGetObj({ Id: aId }, me.listArea);
                    name = stp.Name;
                    pointCode = stp.Code;
                    //address = $(row).find('input.address').val();
                    time = $(row).find('input.hour').val().split(':');
                    route += aId;
                    route += '|' + stp.Type;
                    route += '|' + pointCode;
                    route += '|' + name;
                    route += '|';
                    route += '|' + $(row).find('input.distance').val();
                    route += '|' + (isNaN(parseInt(time[0])) ? '0' : parseInt(time[0]));
                    route += '|' + (isNaN(parseInt(time[1])) ? '0' : parseInt(time[1]));
                    info += '~' + route;
                    totalStage += 1;
                } else {
                    hasError = true;
                    msg = "Vui lòng cập nhật thông tin điểm dừng!";
                }
            }
            if (!hasError) {
                $('input.route-info').val(info);
                $('input.total-stage').val(totalStage > 1 ? (totalStage - 1) : 0);
                $('input.fromId').val(fromId);
                $('input.toId').val(toId);

                //console.log(info);
                var j = $('#utility-form input');
                var val = '1';
                $.each(j, function(_, f) {
                    if ($(f).prop('checked')) val += '~' + $(f).attr('code');
                });
                $('input.facility-info').val(val);
                me.onBasicSave();
                $('select.lstArea').val('').trigger('chosen:updated');
            } else {
                vv.showMessage({
                    element: me.view.find('.alert.message'),
                    type: 'alert-danger',
                    content: msg
                });
            }
        },
        //#endregion

        //#region Converters
        gDisStpl: function (data) {
            return vGvo(data.record.SeatTemplateInfo, 1, 5);
        },
        gDisDptTime: function(data) {
            var times = data.record.Info.split('~');
            var r = '';
            for (var i = 0; i < times.length; i++) {
                if (i == 5) r += '\n';
                if (i == 0) {
                    r = times[i];
                } else {
                    r += '~' + times[i];
                }
            }
            return r;
        },
        svcStpl: function (x, v) {
            /// <summary>
            /// SeatTemplate save converter
            /// </summary>
            /// <param name="x"></param>
            /// <param name="v"></param>
            return v + '~' + vFindById(v, x.options).Info;
        },
        svcArea: function (x, v) {
            /// <summary>
            /// From Area save converter
            /// </summary>
            /// <param name="x"></param>
            /// <param name="v"></param>

            var me = this;
            var its = vGetArr({ Id: parseInt(v) }, false, me.listArea);
            if (its.length > 0) {
                return ('1~' + [its[0].Id, its[0].Type, its[0].Code, its[0].Name].join('|'));
            }
            return '';
        },

        rvcStpl: function (x, v) {
            /// <summary>
            /// SeatTemplate read converter
            /// </summary>
            /// <param name="v"></param>
            /// <param name="v"></param>
            return vGtp(v, 'Id');
        },
        rvcArea: function (x, v) {
            /// <summary>
            /// From Area read converter
            /// </summary>
            /// <param name="v"></param>
            /// <param name="v"></param>

            if (!vIsEstStr(v)) return '';
            var infos = v.split('~');
            if (infos.length > 1) {
                var Id = parseInt(infos[1].split('|')[0]);
                return Id;
            }
            return '';
        }


        //#endregion
    }
);