var vv = {

    _table: {
        url: "",
        fields: {},
        multiselect: false,
        paging: true,
        pageSize: 10,
        sorting: true,
        selecting: true,
        selectingCheckboxes: true
    },

    _toolTipCls: ['form-group', 'form-group mb8'],

    _isCbb: function (x) {
        var me = this;
        return ((x.cbb || x.options) && !me.isChosen(x));
    },

    _isRemoteData: function (x) {
        return (x.options.length == 0 && x.listConfig);
    },

    _gSelect: function (o, rs) {
        var arr = []; rs.each(function (idx) { var record = $(this).data('record'); arr.push(record); });
        var e = jQuery.Event("gSelect"); e.rs = arr; o.view.trigger(e);
    },

    _gDeselect: function (o, rs) {
        var me = this;
        var x = jQuery.Event("gUnSelect");
        x.rs = rs;
        o.view.trigger(x); if (o.autoClear) me.clearFormAndGrid(o.view);
    },

    _getX: function (x) {
        if (x.x && typeof (x.x) == 'string') {
            var fx = $['x' + $.trim(x.x)];
            if (typeof (fx) == 'function') return fx.call(this, x);
            return x;
        }
        return x;
    },

    _getWinBody: function (o, xx) {
        var me = this;
        var rows = '', cells = '', firstCells = ''; xx.sort(function (a, b) { var a1 = a.fIdx ? a.fIdx : 100, b1 = b.fIdx ? b.fIdx : 100; if (a1 == b1) return 0; return a1 > b1 ? 1 : -1; });
        var l = xx.length, c = 0;
        var cCells = '';
        var isExtCells = true;
        for (var i = 0; i < xx.length; i++) {
            var x = xx[i];
            x = me._getX(x);
            if (parseInt(app.cid) == 95) {
                if (x.name == "Assistant") {
                    x.form = false;
                    x.grid = false;
                }
                if (x.name == "Guide") {
                    x.form = true;
                    x.grid = true;
                    x.fIdx = 8;
                    x.gIdx = 6;
                }
            }
            if (!_dict._hasDriverTrip) {
                if (x.name == "Description") {
                    x.form = false;
                    x.grid = false;
                }
            }
            //console.log('---c: ', c);
            if (!x.flex) x.flex = 1; if (x.form) c += x.flex; if (x.data) gDx(o).push(x); if (x.grid && o.table && !o.table.hidden) me._applyGridConfigs(o, x);
            me._applyXConfigs(x, o);
            if (x.items && x.xtype) {
                var body = me._getWinBody(o, x.items);
                x.html = body;
                rows += $.html(x.xtype, x);
            } else if (x.xtype && x.form) {
                cells += $.html(x.xtype, x);
                firstCells = cells;
               
                if (c == o.cols || i == l - 1) {
                    if (!x.notInRow) cells = me._getFormRow(cells, o.xRowCls);
                    rows += cells;
                    cells = '';
                    c = 0;
                    isExtCells = false;
                } else {
                    isExtCells = true;
                    cCells = cells;
                }
            }
        }
        if (isExtCells) rows += me._getFormRow(cCells, o.xRowCls);
        if (!rows) rows = firstCells;
        //console.log(rows);
        return rows;
    },

    _getFormRow: function (val, cls) {
        if (!cls) cls = ''; return '<div class="row ' + cls + '">' + val + '</div>';
    },

    _applyGridConfigs: function (o, x) {
        if (x.grid) {
            if (x.gIdx == undefined) x.gIdx = 100;
            var gdis = x.gDis;
            if (typeof x.gDis == 'string') gdis = o.p[x.gDis];
            o.table['fields'][x.name] = {
                name: x.name, title: (x.glbl ? x.glbl : x.label),
                key: (x.dType == 1 || x.key), list: !x.gHide, cf: x, type: x.gType,
                displayFormat: x.displayFormat, display: gdis, idx: x.gIdx, width: x.gWidth,
                listClass: x.gCls, sorting: true
            };
        }
    },

    _applyXConfigs: function (x, o) {

        if (!x.form) return;
        if (!o.id) o.id = '';
        if (x.ref && o.id && x.ref.indexOf(o.id) < 0) {
            x.ref = '#' + o.id + ' ' + x.ref;
        }
        if (x.zRef && o.id && x.zRef.indexOf(o.id) < 0) {
            x.zRef = '#' + o.id + ' ' + x.zRef;
        }
        if (!x.flex) x.flex = 1;
        x.colCls = "col-md-" + ((12 / o.cols) * x.flex);
        if (o.useSmCls) x.smCls = "col-sm-" + ((12 / o.cols) * x.flex);
        if (x.required && x.requiredCls) x.cls = x.cls + " " + x.requiredCls;
    },

    _applyXSearch: function (o, x) {
        x.options = [];
        $.each(gDx(o), function (idx, f) {
            if (f.xSearch) {
                f['Id'] = idx;
                f['Name'] = f.label;
                if (f.xSearchAlways) f['Disabled'] = f.xSearchAlways;
                x.options.push(f);
            }
        });
    },

    _getWinBtn: function (o, buttons) {
        var me = this; var html = "";
        for (var i = 0; i < buttons.length; i++) {
            var x = buttons[i]; var colCls = "col-md-" + x.colspan;
            x.colCls = colCls;
            if (x.xSearch) { me._applyXSearch(o, x); }
            if (x.sbf) $.sbf = x; else if (x.chosen) me.pushChosen(o, x);
            html += $.html(x.xtype, x);
        }

        return html;
    },

    _getWinHeader: function (data) {
        return $.html('winHeaderTpl01', data);
    },

    _applyChose: function (o, x) {
        //if (x.xtype == 'xchosensingle' && x.allowEmpty) {
        //    var defaultO = {
        //        Id: null,
        //        LicensePlate: "Chọn",
        //        Type: null,
        //        VehicleTypeName: null
        //    }
        //    //x.options = [defaultO].concat(x.options);
        //}
        var cRef = x.zRef;
        x.chosen.search_contains = true;
        $(x.ref).chosen(x.chosen).on('change', function (e, a) {
            x.e = e; x.a = a; o.vm.onChosenChange(x);
            if ($.isEmptyObject(x.vals)) {
                if (x.zRef && x.searchIcon) vChIco(x, cRef);
            } else {
                if (x.zRef && x.searchIcon) vUChIco(x, cRef);
            }

        });
        if (x.zRef && x.searchIcon) vChIco(x, cRef);
    },

    //#region load

    initView: function (o) {
        var ref = o.c[2];
        if ((typeof ref == 'string') && ref) {
            o.view = $(ref);
        } else {
            o.view = $('.dialog-config');
        }
        o.view.unbind();
    },

    initArrs: function (o) {
        sDx(o);
    },

    initObjs: function (o) {
        //o['buttons'] = [];
        o['chosen'] = {};
        o['datepicker'] = {};
    },

    initGrid: function (o) {
        var me = this;
        if (!o.grid || o.gHide) return;
        o.table = vCloneObj(me._table); if (o.gFields) o.table.fields = o.gFields; else o.table.fields = {};
        if (o.pageSize) o.table.pageSize = o.pageSize;
        if (o.gHideCb) o.table['selectingCheckboxes'] = false;
        o.view.trigger('gSelect', null);
        o.table.selectionChanged = function (e, d) {
           
            var rs = $('#' + o.gId).jtable('selectedRows');
         
            if (rs.length > 0) me._gSelect(o, rs); else me._gDeselect(o, rs);
        };
    },

    initForm: function (o) {
        var me = this;
        var winCls = o.winCls;
        if (!winCls) winCls = "";
        var xWidth = ''; if (o.xWidth) { xWidth = '-' + o.xWidth; };
        var body = me._getWinBody(o, o.items); //Must before sbf
        var childId = o.childId; if (!childId) childId = '';
        o['buttons'] = _.where(o.buttons, { form: true });
        var c = {
            id: o.id,
            winCls: winCls, xWidth: xWidth,
            header: me._getWinHeader({ title: o.title }),
            buttons: me._getWinBtn(o, o['buttons']),
            body: $.html('winMsgTpl01', {}) + body,
            childId: childId,
            gRights: o.gRights,
            gSubtitle: o.gSubTitle,
            gTitle: o.gTitle,
            gId: o.gId,
        };
        var ref = o.c[2];
        if ((typeof ref == 'string') && ref) {
            o.view.html($.html(o.tpl ? o.tpl : 'mainContentTpl', c, true));
        } else {
            o.view.html($.html(o.tpl ? o.tpl : 'winTpl', c, true));
        }

    },

    addViewModel: function (o) {
        o.vm = new Vm(o);
        o.vm.load();
    },

    addGridClass: function (o) {
        $('.jtable-goto-page select').addClass('form-control');
        $('.jtable-page-size-change select').addClass('form-control');
        $('table.jtable').addClass('table').addClass('table-bordered').addClass('mb0').addClass('table-condensed');
        $('.jtable-page-list').find('.jtable-page-number-first').addClass('glyphicon').addClass('glyphicon-fast-backward');
        $('.jtable-goto-page select').addClass('form-control');
        $('.jtable-page-size-change select').addClass('form-control');
    },

    addFormToolTip: function (o) {
        var me = this, el = "." + o.winCls;
        $.each(me._toolTipCls, function (i, v) { $(el + ' .' + v).tooltip(); });
    },

    viewModule: function (o) {

        var ref = o.c[2];
        if ((typeof ref == 'string') && ref) {
            // o.view.show();
            //var html = o.view.html();
            //console.log(html);
            // $(ref).html(html);
            // o.view = $(ref);

        } else {
            var w = o.view.find('.modal.fade');
            w.modal('show');
            o.view.on('hidden.bs.modal', function () {
                o.vm.close();
            });
            o.vm.onViewReady();

            // Since confModal is essentially a nested modal it's enforceFocus method
            // must be no-op'd or the following error results 
            // "Uncaught RangeError: Maximum call stack size exceeded"
            // But then when the nested modal is hidden we reset modal.enforceFocus
            var enforceModalFocusFn = $.fn.modal.Constructor.prototype.enforceFocus;

            $.fn.modal.Constructor.prototype.enforceFocus = function () { };

            w.on('hidden', function () {
                $.fn.modal.Constructor.prototype.enforceFocus = enforceModalFocusFn;
            });

            w.modal({ backdrop: false });
        }
    },

    applyDatePicker: function (o, x) {
        $('span.glyphicon-calendar').parent().on('click', function () {
            $(this).prev().datepicker('show');
        });
    },

    applyChosenSBF: function (o) {
        var me = this;
        var x = $.sbf;
        if (!x) return;
        x.chosen.d = [];
        $.each(gDx(o), function (idx, field) {
            if (field.xSearchDefault) {
                me.chose(x.ref, field.Id);
                x.chosen.d.push(field.Id);
            }
        });
        x.chosen.search_contains = true;
        $(x.ref).chosen(x.chosen).on('change', function (e, a) {
            x.e = e; x.a = a;
            o.vm.onChangeSBF();
        });
        $.each(x.chosen.d, function (i, v) {
            x.e = {}; x.a = { selected: v + "" };
            o.vm.onChangeSBF();
        });
    },

    applyChosen: function (o) {
        var me = this;
        $.each(gDx(o), function (k, x) {
            if (me.isChosen(x) && !x.sbf) {
                me._applyChose(o, x); if (me._isRemoteData(x)) { o.vm.onGetData(x); }
            }
        });
    },

    viewGrid: function (o) {

        $("#" + o.gId).jtable(o.table);
        $("#" + o.gId).jtable('option', 'pageSize', 25);
        $("#" + o.gId).jtable('option', 'ajaxSettings', null);
        if (!o.gNoLoad) $("#" + o.gId).mask('Loading..........');
    },

    rights: function (o) {
        $.vCheckPopupRights(o.view);
    },

    bind: function (o) {
        o.vm.bind();
    },

    //#endregion

    //#region publish

    chose: function (ref, val, isClear) {
        if (isClear) $(ref + ' option').prop('selected', false).filter('[value="' + val + '"]').prop('selected', true);
        else $(ref + ' option').filter('[value="' + val + '"]').prop('selected', true);
    },

    isChosen: function (x) {
        return x.chosen && x.chosen.on && !x.chosen.off;
    },

    pushChosen: function (o, x) {
        var me = this;
        if (!me.isChosen(x)) return;
        o['chosen'][x.name] = x;
    },

    enableItem: function (w, s, v) {
        if (v) w.find(s).removeClass('btn-disabled').removeAttr('disabled');
        else w.find(s).addClass('btn-disabled').attr('disabled', 'disabled');
    },

    //#endregion

    //#region callable
    getBodyHtml: function (o) {
        var me = this;
        return me._getWinBody(o, o.items);
    },

    clearFormAndGrid: function (w) {
        //console.log('clearFormAndGrid');

        w.find('div.panel-collapse').each(function () {
            $(this).removeClass('in');
        });

        w.find('input').each(function () {
            if (!$(this).hasClass('noCls') && !$(this).hasClass('Rs'))
                $(this).val('');
            if ($(this).hasClass('Rs'))
                $(this).prop('checked', false);
        });
        w.find('select').each(function () {
            if (!$(this).hasClass('noCls'))
                $(this).val($(this).find('option').first().val());
        });
        w.find('textarea').each(function () {
            if (!$(this).hasClass('noCls'))
                $(this).val('');
        });
        w.find('button.save').html('<i class="glyphicon glyphicon-plus"></i> Thêm');
        $('tr.jtable-data-row.jtable-row-selected').find('input[type="checkbox"]').prop('checked', false);
        $('.jtable-row-selected').removeClass('jtable-row-selected');
    },

    unchose: function (ref, val, isClear) {
        if (isClear) $(ref + ' option').prop('selected', false).filter('[value="' + val + '"]').prop('selected', false);
        else $(ref + ' option').filter('[value="' + val + '"]').prop('selected', false);
    },

    clearChosen: function (ref) {
        $(ref + ' option').prop('selected', false);
    },

    showMessage: function (o) {
        $(o.element).addClass(o.type);
        $(o.element).fadeIn('fast');
        $(o.element).find('span.message-content').html(o.content);
        $(o.element).delay(1000).fadeOut('fast', function () { $(o.element).removeClass(o.type); });
    },

    start: function (o) {
        var me = this;
        if (o.p['start']) {
            o.p.start(o, function () {
                me.run(o);
            });
        } else me.run(o);
    },

    run: function (o) {
        try {
            var me = this;
            me.initView(o);
            me.initArrs(o);
            me.initObjs(o);
            me.initGrid(o);
            me.initForm(o);
            me.addViewModel(o);
            me.addGridClass(o);
            me.addFormToolTip(o);
            me.viewModule(o);
            me.applyDatePicker(o);
            me.applyChosenSBF(o);
            me.applyChosen(o);
            me.viewGrid(o);
            me.rights(o);
            me.bind(o);
        } catch (e) {
            console.error(e);
        }
    }

    //#endregion
};

