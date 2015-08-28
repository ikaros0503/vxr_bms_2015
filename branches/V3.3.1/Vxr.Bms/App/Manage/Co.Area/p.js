define({

    onBeginSelectionChange: function (view, record) {
        vv.enableItem(view, 'button.delete', record != null);

    },
    onItemLoaded: function (record) {
        var me = this, o = me.o, view = o.view;
        var wId = record.BaseId;
        var ward = vGetArr({ Id: wId }, false, me.listArea);
        if (ward.length <= 0) return;
        var cId = ward[0].BaseId;
        me._initOptionCity();
        var cField = $(view).find('.city');
        cField.val(cId);
        var e = { target : cField };
        me.onCityChange('', '', e);
        var wField = $(view).find('.ward');
        wField.val(wId);
    },
    onAfterUnloadItem: function () {
        var me = this;
        me._unloadAreaTable();
    },
    afterReload: function(models) {
        var me = this;
        me.listArea = [];
        var extCf = {
            _a: 'fGetArea',
            _c: { IsPrgStatus: 1, Type: '(($x) IN (1,2,3,4,5,6,7,8,9))' },
            _f: 'Id, Type, Name, BaseId'
        };
        var fieldArr = extCf['_f'].split(',');
        vRql(extCf, {
            a: function (u, r, l, t) {
                //$.each(gDx(me.o), function (idx, field) {
                //    if (field.base) {
                //        view.find(field.ref).empty();
                //    }
                //});
            },
            m: function (i, d) {
                var model = {};
                $.each(fieldArr, function (j, v) {
                    v = v.trim();
                    model[v] = d[j];
                });
                me.listArea.push(model);
            },
            z: function (u, r, l, t) {
                me.listArea = vSort('Name', true, me.listArea);
                me._initOptionCity();
            }
        }, me);

    },
    gDisType: function (data) {
        var arr = this.cf.options;
        var id = data.record.Type;
        var obj = _.where(arr, { Id: id });
        if (obj[0]) return obj[0].Name;
        return '';
    },

    svcBaseId: function (x, v) {
        /// <summary>
        /// BaseId save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        if (!v) return null;
        return v;
    },

    _initOptionCity: function (view) {
        var me = this, o = me.o;
        if (!view) view = o.view;
        if (o.gId != 'areaTableContainer') return;
        var fieldLs = view.find('.city');
        var lsCity = vGetArr({ Type: 3 }, false, me.listArea);
        lsCity = vSort('Name', true, lsCity);
        lsCity = [{ Id: -1, Name: 'Chọn thành phố' }].concat(lsCity);
        $.each(lsCity, function (_, c) {
            $.vCheckAndAppendOptions(fieldLs, c.Id, c.Name, 'R');
        });
    },
    onCityChange: function (w, x, e) {
        var me = this, v = me.o.view;
        var cId = parseInt($(v).find('.city').val());
        var wardf = $(v).find('.ward');
        wardf.empty();
        var lsWard = vGetArr({ BaseId: cId }, false, me.listArea);
        $.each(lsWard, function (_, c) {
            $.vCheckAndAppendOptions(wardf, c.Id, c.Name, 'R');
        });
    },
    onWardChange: function (w, x, e) {
        var me = this;
        var ward = $(e.target);
        var wId = parseInt(ward.val());
    },
    onAreaClear: function() {
        var me = this;
        me._unloadAreaTable();
    },
    onAreaSave: function() {
        var me = this, o = me.o, view = o.view;
        var hasError = false;
        var msg = '';
        var cf = $(view).find('.city');
        if (cf.val() == -1) {
            hasError = true;
            msg += 'Vui lòng chọn thành phố. \n';
        }
        var wf = $(view).find('.ward');
        var nf = $(view).find('.name');
        if (!vIsEstStr(nf.val())) {
            hasError = true;
            msg += 'Vui lòng nhập tên. \n';
        };
        var cof = $(view).find('.code');
        if (!vIsEstStr(cof.val())) {
            hasError = true;
            msg += 'Vui lòng nhập mã địa điểm.';
        }
        //console.log($(view).find('.xtime').val());
        if (hasError) {
            vv.showMessage({
                element: view.find('.alert.message'),
                type: 'alert-danger',
                content: msg
            });
        } else {
            $(view).find('.baseId').val(wf.val());
            me.onBasicSave();
            me._unloadAreaTable();
        }
    },
    onAreaDelete: function() {
        this.onBasicDelete();
        this._unloadAreaTable();
    },
    _unloadAreaTable: function () {
        var me = this, o = me.o, view = o.view;
        var cField = $(view).find('.city');
        cField.val(-1);
        var e = { target: cField };
        me.onCityChange('', '', e);

        $(view).find('.name').val('');
        $(view).find('.code').val('');
        $(view).find('.address').val('');
        $(view).find('.guide-note').val('');
    },

    //#endregion
});