define({
    //#region Private Methods
    _initFromAndToArea: function (routeId) {
        var me = this, o = me.o, view = me.view;
        if (o.gId != 'fareTableContainer') return;
        if (routeId == 0) {
            me._clearFareForm();
            return;
        }
        var model;
        if (routeId) model = vGetObj({ Id: routeId }, me.remoteModels);
        else {
            model = me.remoteModels[0];
        }
        model.arrArea = vGas(model.RouteInfo);
        if (app.rights.indexOf($.rights.mFare_cfOnlFare.val) >= 0) {
            if (vIsEstStr(model.VxrFareInfo)) {
                model.arrFare = vGfs(model.arrArea, model.VxrFareInfo);
            } else {
                model.arrFare = vGfs(model.arrArea, model.FareInfo);
            }
        } else {
            if (vIsEstStr(model.NewFare)) {
                model.arrFare = vGfs(model.arrArea, model.NewFare);
            } else {
                model.arrFare = vGfs(model.arrArea, model.FareInfo);
            }
        }
        var fareTable = $("#fare-table").find('tbody');
        fareTable.empty();
        for (var i = 0; i < (model.arrArea.length - 1) ; i++) {
            for (var j = i + 1; j < model.arrArea.length; j++) {
                var row = $('<tr />');
                row.html(me._getNewRow());
                row.find('.from-area-id').attr('data-id', model.arrArea[i].Id).val(model.arrArea[i].Name);
                row.find('.to-area-id').attr('data-id', model.arrArea[j].Id).val(model.arrArea[j].Name);
                var code = model.arrArea[i].Id + '|' + model.arrArea[j].Id;
                var fare = vGetObj({ Code: code }, model.arrFare);
                if (fare != null) {
                    row.find('input.routeFare').val(fare.Fare);
                } else {
                    row.find('input.routeFare').val(0);
                }
                fareTable.append(row);
            }
        }
    },

    _mapDataOfFare: function(models) {
        var me = this;
        var record, fareInfo, routeInfo;
        var arrFare, arrRoute, arrArea;
        var id;
        record = models;
        var arrRow = [];
        arrArea = [];
        // split RouteInfo
        routeInfo = record.RouteInfo;
        if (!routeInfo) routeInfo = "";
        var idx = routeInfo.indexOf("~");
        if (idx >= 0) {
            routeInfo = routeInfo.substring(idx + 1);
            arrRoute = routeInfo.split('~');
            $.each(arrRoute, function(index, value) {
                id = vGdi(value, '|', 0);
                arrArea[id] = vGdi(value, '|', 3);
            });
        }
        // split FareInfo
        fareInfo = record.FareInfo;
        idx = fareInfo.indexOf("~");
        if (idx >= 0) {
            fareInfo = fareInfo.substring(idx + 1);
            arrFare = fareInfo.split('~');
            var row, from, to, fare;
            $.each(arrFare, function(index, value) {
                from = vGdi(value, "|", 0);
                to = vGdi(value, "|", 1);
                fare = vGdi(value, "|", 2);
                if (arrArea[from] && arrArea[to]) {
                    row = {
                        Id: record.Id,
                        Name: record.Name,
                        FromArea: arrArea[from],
                        ToArea: arrArea[to],
                        Fare: fare
                    };
                    arrRow.push(row);
                }
            });
        }
        return arrRow;
    },
    _getNewRow: function() {
        var me = this;
        var o = {
            cols: 3,
            items: me.o.fareRow
        };
        vv.initObjs(o);

        var html = vv.getBodyHtml(o);

        return html;
    },
    _initOptionRoute: function(models) {
        var me = this, v = me.view;
        var rF = v.find('select.route');
        rF.empty();
        var t = models.gtArr({ Type: 1 }, false);
        t = [{Id: 0, Name: 'Chọn chuyến'}].concat(t);
        $.each(t, function(_, val) {
            $.vCheckAndAppendOptions(rF, val.Id, val.Name, 'R');
        });
    },
    _clearFareForm: function () {
        var me = this, v = me.view;
        me.model = [];
        $(v).find('#fare-table').find('tbody').empty().append($('<tr >').html(me._getNewRow()));
        $(v).find('.route').val(0);
        $(v).find('.hasDatepicker').val('');
        $(v).find('.discounts').val(0);
        $(v).find('select.route').prop('disabled', false).val(0);
        $(v).find('.dateStop').datepicker('enable');
        me.onBasicClear();
    },
    //#endregion

    //#region Callbacks
    onBeginSelectionChange: function(view, record) {
        vv.enableItem(view, 'button.delete', record != null);
    },

    onItemLoaded: function() {
        var me = this, v = me.view;
        me._initFromAndToArea(me.model['Id']);
        var t = me.remoteModels.gtArr({ Type: 1, Name: me.model['Name'] }, false);
        if (t && t.length > 0) {
            v.find('select.route').val(t[0].Id);
        } else {
            v.find('select.route').val(0);
        }
        setTimeout(function () {   //required
            $(v).find('.dateStop').datepicker('disable');
            $(v).find('input.from-area-id').prop('disabled', 'disabled');
            $(v).find('input.to-area-id').prop('disabled', 'disabled');
            $(v).find('select.route').prop('disabled', 'disabled');
        }, 0);
    },
    onAfterUnloadItem: function () {
        var v = this.view;
        $(v).find('select.route').prop('disabled', false);
        this._clearFareForm();
    },
    onUpdateSuccess: function(id) {
        var me = this;
        me.onRouteChange();
        $('select.route option').prop('selected', false).filter('[value="' + id + '"]').prop('selected', true);
    },

    afterReload: function (models) {
        var me = this, v = me.view;
        me.remoteModels = vSort('Type', false, models);
        me._initOptionRoute(models);
        //console.log(this._getNewRow());
        $(v).find('button.applyDiscount').unbind().on('click', function(e) {
            var dc = parseInt($(v).find('.discounts').val());
            if (!isNaN(dc) && dc < 100) {
                var allFares = $(v).find('#fare-table').find('tbody').find('.routeFare');
                $.each(allFares, function(_, f) {
                    var val = $(f).val();
                    if (!isNaN(val)) {
                        var vl = parseInt(val);
                        val = Math.round((vl * (100 - dc) / 100000)) * 1000;
                    } else val = 0;
                    $(f).val(val);
                });
            } else {
                $(v).find('.discounts').val(0);
            }
        });
    },

    //#endregion

    //#region Listeners

    onRouteChange: function (w, x, e) {
        var me = this, o = me.o;
        var routeId = parseInt($('select.route :selected').val());
        me._initFromAndToArea(routeId);
    },

    onDeleteFare: function () {
        var me = this, v = me.view;
        var routeId = parseInt($(v).find('select.route :selected').val());
        var r = me.remoteModels.gtArr({ Id: routeId }, false);
        var routeName = '', routeInfo = '1', fareInfo = '';
        if (r && r.length > 0) {
            routeName = r[0].Name;
            routeInfo = r[0].RouteInfo;
        }
        var dateStart = $(v).find('input.dateStart').val();
        if (!vIsEstStr(dateStart)) {
            vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Bạn không thể xóa giá ngày thường.' });
            me._clearFareForm();
        } else {
            me._deleteFare(routeId, routeName, routeInfo, fareInfo, 3);
        }
    },
    onFareClear: function() {
        this._clearFareForm();
    },
    onSaveFare: function () {
        var me = this, v = me.view;
        var routeId = parseInt($(v).find('select.route :selected').val());
        var r = me.remoteModels.gtArr({ Id: routeId }, false);
        var routeName = '', routeInfo = '1';
        var time = [];
        if (r && r.length > 0) {
            routeName = r[0].Name;
            routeInfo = r[0].RouteInfo;
            if (vIsEstStr(r[0].Info)) time = r[0].Info.split('~');
        }
        var allRows = $(v).find('#fare-table tbody').find('tr');
        var fareInfo = '1';
        $.each(allRows, function(i, f) {
            var fromid = $(f).find('input.from-area-id').attr('data-id');
            var toid = $(f).find('input.to-area-id').attr('data-id');
            var fare = $(f).find('input.routeFare').val();
            if (!fare || !vIsEstStr(fare) || isNaN(parseInt(fare))) fare = 0;
            fareInfo += '~' + fromid + '|' + toid + '|' + fare + '|đ||';
        });
        $(v).find('input.fare-info').val(fareInfo);
        var dateStart = $(v).find('input.dateStart').val();
        if (!vIsEstStr(dateStart)) {
            me.model = { Id: routeId };
            me.onBasicSave(null, null, function() {
                me._clearFareForm();
                me._reloadTable();
            });
            
        } else {
            me._saveFare(routeId, routeName, routeInfo, fareInfo, time, 1);
        }
    },
    _saveFare: function(rId, rName, rInfo, fareInfo, time, isPrg) {
        var me = this, v = me.view;
        var dF = $(v).find('input.dateStart').val();
        var dT = $(v).find('input.dateStop').val();
        var dC = $(v).find('input.discounts').val();
        if (isNaN(dC)) dC = 0;
        var cd = [];
        var dt = [];
        var valid = true;
        if (moment(dF, 'DD-MM-YYYY').isValid()) {
            var mF = moment(dF, 'DD-MM-YYYY');
            if (vIsEstStr(dT) && moment(dT, 'DD-MM-YYYY').isValid()) { // co ngay ket thuc
                var mT = moment(dT, 'DD-MM-YYYY');
                while (mF.isBefore(mT) || mF.isSame(mT)) {
                    $.each(time, function (_, t) {
                        cd.push({
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            CompId: app.cid,
                            Time: t
                        });
                        dt.push({
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            NewFare: fareInfo,
                            Name: rName,
                            CompId: app.cid,
                            Discount: dC,
                            IsPrgStatus: isPrg,
                            Time: t
                        });
                    });
                    mF = mF.add(1, 'd');
                }
            } else { // khong co ngay ket thuc
                $.each(time, function (_, t) {
                    cd.push(
                        {
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            CompId: app.cid,
                            Time: t
                        }
                    );
                    dt.push(
                        {
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            NewFare: fareInfo,
                            CompId: app.cid,
                            Name: rName,
                            Discount: dC,
                            IsPrgStatus: isPrg,
                            Time: t
                        }
                    );
                });
            }
        } else {
            valid = false;
        };
        if (valid) {
            var obj = {
                _a: 'UpdateFareInfo',
                _c: cd,
                _d: dt
            };
            vRqs(obj, function(u, r, l, t) {
                if (u) {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    me._clearFareForm();
                    me._reloadTable();
                } else {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại.' });
                };
            });
        } else {
            vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thông tin bạn nhập không đúng.' });
        }
    },
    _deleteFare: function (rId, rName, rInfo, fareInfo, isPrg) {
        var me = this, v = me.view;
        var dF = $(v).find('input.dateStart').val();
        var cd = [];
        var dt = [];
        var valid = true;
        if (moment(dF, 'DD-MM-YYYY').isValid()) {
            var mF = moment(dF, 'DD-MM-YYYY');
            cd.push({
                Type: 2,
                BaseId: rId,
                Date: mF.format('YYYY-MM-DD'),
                CompId: app.cid
            });
            dt.push({
                NewFare: fareInfo,
                Discount: 0,
                IsPrgStatus: isPrg,
            });
        } else {
            valid = false;
        };
        if (valid) {
            var obj = {
                _a: 'UpdateFareInfo',
                _c: cd,
                _d: dt
            };
            vRqs(obj, function (u, r, l, t) {
                if (u) {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    me._clearFareForm();
                    me._reloadTable();
                } else {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại.' });
                };
            });
        } else {
            vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thông tin bạn nhập không đúng.' });
        }
    },
    onSaveVxrFare: function () {
        var me = this, v = me.view;
        var routeId = parseInt($(v).find('select.route :selected').val());
        var r = me.remoteModels.gtArr({ Id: routeId }, false);
        var routeName = '', routeInfo = '1';
        var time = [];
        if (r && r.length > 0) {
            routeName = r[0].Name;
            routeInfo = r[0].RouteInfo;
            if (vIsEstStr(r[0].Info)) time = r[0].Info.split('~');
        }
        var allRows = $(v).find('#fare-table tbody').find('tr');
        var fareInfo = '1';
        $.each(allRows, function (i, f) {
            var fromid = $(f).find('input.from-area-id').attr('data-id');
            var toid = $(f).find('input.to-area-id').attr('data-id');
            var fare = $(f).find('input.routeFare').val();
            if (!fare || !vIsEstStr(fare) || isNaN(parseInt(fare))) fare = 0;
            fareInfo += '~' + fromid + '|' + toid + '|' + fare + '|đ||';
        });
        $(v).find('input.fare-info').val(fareInfo);
        var dateStart = $(v).find('input.dateStart').val();
        if (!vIsEstStr(dateStart)) {
            vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Bạn không thể cập nhật giá vé ngày thường.' });
            me._clearFareForm();
        } else {
            me._saveVxrFare(routeId, routeName, routeInfo, fareInfo, time, 1);
        }
    },
    _saveVxrFare: function (rId, rName, rInfo, fareInfo, time, isPrg) {
        var me = this, v = me.view;
        var dF = $(v).find('input.dateStart').val();
        var dT = $(v).find('input.dateStop').val();
        var dC = $(v).find('input.discounts').val();
        if (isNaN(dC)) dC = 0;
        var cd = [];
        var dt = [];
        var valid = true;
        if (moment(dF, 'DD-MM-YYYY').isValid()) {
            var mF = moment(dF, 'DD-MM-YYYY');
            if (vIsEstStr(dT) && moment(dT, 'DD-MM-YYYY').isValid()) { // co ngay ket thuc
                var mT = moment(dT, 'DD-MM-YYYY');
                while (mF.isBefore(mT) || mF.isSame(mT)) {
                    $.each(time, function (_, t) {
                        cd.push({
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            CompId: app.cid,
                            Time: t
                        });
                        dt.push({
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            VxrFareInfo: fareInfo,
                            Name: rName,
                            CompId: app.cid,
                            VxrDiscount: dC,
                            IsPrgStatus: isPrg,
                            Time: t
                        });
                    });
                    mF = mF.add(1, 'd');
                }
            } else { // khong co ngay ket thuc
                $.each(time, function (_, t) {
                    cd.push(
                        {
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            CompId: app.cid,
                            Time: t
                        }
                    );
                    dt.push(
                        {
                            Type: 2,
                            BaseId: rId,
                            Date: mF.format('YYYY-MM-DD'),
                            VxrFareInfo: fareInfo,
                            CompId: app.cid,
                            Name: rName,
                            VxrDiscount: dC,
                            IsPrgStatus: isPrg,
                            Time: t
                        }
                    );
                });
            }
        } else {
            valid = false;
        };
        if (valid) {
            var obj = {
                _a: 'UpdateFareInfo',
                _c: cd,
                _d: dt
            };
            vRqs(obj, function (u, r, l, t) {
                if (u) {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    me._clearFareForm();
                    me._reloadTable();
                } else {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại.' });
                };
            });
        } else {
            vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thông tin bạn nhập không đúng.' });
        }
    },
    onDelVxrFare: function () {
        var me = this, v = me.view;
        var routeId = parseInt($(v).find('select.route :selected').val());
        var r = me.remoteModels.gtArr({ Id: routeId }, false);
        var routeName = '', routeInfo = '1', fareInfo = '';
        if (r && r.length > 0) {
            routeName = r[0].Name;
            routeInfo = r[0].RouteInfo;
        }
        var dateStart = $(v).find('input.dateStart').val();
        if (!vIsEstStr(dateStart)) {
            vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Bạn không thể xóa giá ngày thường.' });
            me._clearFareForm();
        } else {
            me._deleteVxrFare(routeId, routeName, routeInfo, fareInfo, 3);
        }
    },
    _deleteVxrFare: function (rId, rName, rInfo, fareInfo, isPrg) {
        var me = this, v = me.view;
        var dF = $(v).find('input.dateStart').val();
        var cd = [];
        var dt = [];
        var valid = true;
        if (moment(dF, 'DD-MM-YYYY').isValid()) {
            var mF = moment(dF, 'DD-MM-YYYY');
            cd.push({
                Type: 2,
                BaseId: rId,
                Date: mF.format('YYYY-MM-DD'),
                CompId: app.cid
            });
            dt.push({
                VxrFareInfo: fareInfo,
                VxrDiscount: 0,
                IsPrgStatus: isPrg,
            });
        } else {
            valid = false;
        };
        if (valid) {
            var obj = {
                _a: 'UpdateFareInfo',
                _c: cd,
                _d: dt
            };
            vRqs(obj, function (u, r, l, t) {
                if (u) {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    me._clearFareForm();
                    me._reloadTable();
                } else {
                    vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại.' });
                };
            });
        } else {
            vv.showMessage({ element: v.find('.alert.message'), type: 'alert-danger', content: 'Thông tin bạn nhập không đúng.' });
        }
    },
    onFromAreaChange: function (w, x, e) {
        var me = this;
        var routeId = parseInt($('select.route :selected').val());
        var model = vGetObj({ Id: routeId }, me.listBase);
        var toField = vGetObj({ ref: '.to-area-id' }, gDx(me.o));
        var fromId = x.val();
        w.find(toField.ref).empty();
        var render = false;
        for (var i = 0; i < model.arrArea.length; i++) {
            if (render) {
                $.vCheckAndAppendOptions(w.find(toField.ref), model.arrArea[i].Id, model.arrArea[i].Name, 'R');
            }
            if (model.arrArea[i].Id == fromId) {
                render = true;
            }
        }
        var fareField = vGetObj({ ref: 'input.fare' }, gDx(me.o));
        var arrFare = model.arrFare;
        var toId = w.find(toField.ref).val();
        var code = fromId + '|' + toId;
        var fare = vGetObj({ Code: code }, arrFare);
        if (fare != null) {
            w.find(fareField.ref).val(vToMn(fare.Fare));
        } else {
            w.find(fareField.ref).val('');
        }
    },

    onToAreaChange: function (w, x, e) {
        var me = this;
        var routeId = parseInt($('select.route :selected').val());
        var model = vGetObj({ Id: routeId }, me.listBase);

        var fromField = vGetObj({ ref: '.from-area-id' }, gDx(me.o));
        var toField = vGetObj({ ref: '.to-area-id' }, gDx(me.o));
        var fromId = w.find(fromField.ref).val();
        var fareField = vGetObj({ ref: 'input.fare' }, gDx(me.o));

        var arrFare = model.arrFare;
        var toId = w.find(toField.ref).val();
        var code = fromId + '|' + toId;
        var fare = vGetObj({ Code: code }, arrFare);
        if (fare != null) {
            w.find(fareField.ref).val(vToMn(fare.Fare));
        } else {
            w.find(fareField.ref).val('');
        }
    },

    //#endregion

    //#region Converters
    gDisFare: function (data) {
        var v = vToMn(data.record.Fare);
        return v;
    },
    gDisDiscount: function(d) {
        if (app.rights.indexOf($.rights.mFare_cfOnlFare.val) >= 0) {
            return d.record.VxrDiscount;
        }
        return d.record.Discount;
    },
    gDisDate: function(data) {
        var v = data.record.Date;
        if (!vIsEstStr(v)) return 'Giá ngày thường';
        var d = vGtDtObj(v);
        if (d) return vDtToStr('dd-mm-yyyy', d);
        return '';
    },
    rvcFare: function (x, v) {
        /// <summary>
        /// Fare read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        return vToMn(v);
    }
    //#endregion
}
);
