function Vm(o) {
    var view = o.view;
    return {
        _me: function () {
            var me = this;
            me.view = view;
            me.o = o;
            me.t = o.t;
            me.bCases = {};
            me.bStops = {};
            $.each(gDx(o), function (k, v) { gDx(o)[v.name] = v; });
            $.each(o.p, function (k, v) { me[k] = v; });
            var x = vGetObj({ gColType: 'No' }, gDx(o));
            if (x) me.xNo = x;
        },

        _close: function () {
            var me = this;
            $.each(o.p, function (k, v) { me[k] = null; });
            view.unbind();
            $.setUrlOnClick(app.bms['BksModule']);
        },

        _reset: function () {
            var me = this;
            me.model = {};
            me.mainModels = [];
            me.baseDetailModels = [];
        },

        _gSelect: function (e) {
            var me = this;
            if (me.onSelectRow) {
                var r = me.onSelectRow.call(me, e);
                if (!r) return;
            }
            if (o.filterOnly) return;
            $.each(e.rs, function (i, m) {
                me._loadItem(m);
                me._onSelectionChange(m);
            });
        },

        _gDeselect: function (e) {
            var me = this;
            if (me.onDeSelectRow) {
                var r = me.onDeSelectRow.call(me, e);
                if (!r) return;
            }
            if (o.filterOnly) return;
            me._unloadItem();
            me._onSelectionChange(null);
        },

        _selectChosen: function (x, k, val) {
            //console.log('_selectChosen', val);
            if (!x.vals) x.vals = {};
            x.vals[$.trim(k)] = val;
        },

        _deselectChosen: function (x, k) {
            if (k == "*") {
                x.vals = {};
                return;
            }
            if (x.vals) delete x.vals[$.trim(k)];
        },

        _reloadChosen: function (x, d) {
            var me = this;
            vv.clearChosen(x.ref);
            $(x.ref).trigger("chosen:updated");
            x.e = {};
            x.a = { deselected: "*" };
            me.onChosenChange(x);

            if (d)
                $.each(d.split(','), function (k, id) {
                    vv.chose(x.ref, parseInt(id));
                    x.e = {};
                    x.a = { selected: id };
                    me.onChosenChange(x);
                });
            $(x.ref).trigger("chosen:updated");

        },

        _resetChosen: function (x) {
            var $el = $(x.ref);
            $('option', $el).each(function (id) {
                vv.unchose(x.ref, id);
                $(x.ref).trigger("chosen:updated");
            });
        },

        _beginForm: function () {
            var me = this;
            if (o.defaultFocusRef) {
                setTimeout(function () { view.find(o.defaultFocusRef).trigger('focus'); }, 5000);
            }
        },

        _bindVal: function (x, a, v, e) {
            var me = this;
            if (a.bVal) {
                if (a.bType == null) a.bType = 't';
                if (a.bType == 't' && me['t']) {
                    if (a.bFx && me['t'][a.bFx]) {
                        me['t'][a.bFx].call(me['t'], v);
                    } else {
                        me['t'][a.bVal] = v;
                    }
                } else {
                    if (a.bFx && me[a.bFx]) {
                        me[a.bFx].call(me, v);
                    } else {
                        me[a.bVal] = v;
                    }
                }
            }
        },

        preventEvent: function (n, v) {
            var me = this;
            me.bStops[n] = v;
        },

        isCase: function (n) {
            var me = this;
            return me.bCases[n] == true;
        },

        _applyCaseAndStop: function (x, a) {
            var me = this;
            me.bCases = {};
            me.bCases[x.name] = true;
            if (me.bStops[x.name]) { me.bStops[x.name] = false; return false; }
            return true;
        },

        _applyXChange: function (x, a) {
            var me = this;
            view.find(a.ref).unbind('change').change(function (e) {
                var el = $(this);
                var v = el.val();
                $.vCacr(a.rights, function () {
                    me._bindVal(x, a, v);
                    if (!me._applyCaseAndStop(x, a)) return;
                    if (typeof (a.xChange) == "function") a.xChange.call(me, view, el, e);
                    else if (me[a.xChange]) me[a.xChange].call(me, view, el, e);
                }, me);
                if (typeof (a.xChange) != "function") me.logEvent(a.xChange, v);
            });
        },

        _applyXClick: function (x, a) {
            var me = this;
            var ref = '';
            if (a.ref) ref = a.ref;
            else ref = x.ref;
            view.find(ref).unbind('click').click(function (e) {
                var itm = $(this);
                view.find(ref).prop('disabled', true);
                $.vCacr(x.rights, function () {
                    // me._bindVal(x, a, v);
                    if (!me._applyCaseAndStop(x, a)) return;
                    var fx = function () { view.find(ref).prop('disabled', false); };
                    if (typeof (a.xClick) == "function") {
                        a.xClick.call(me, itm, a, fx, e.target);
                    }
                    else me[a.xClick].call(me, itm, a, fx, e.target);
                    view.find(ref).prop('disabled', false);
                }, me);
            });
        },

        isExistChosenVal: function (x, v) {
            var r = false;

            var $el = $(x.ref);
            $('option', $el).each(function (id, val) {
                if (val.value == v) r = true;
                return false;
            });

            return r;
        },

        _applyXKey: function (x, a, t) {
            var me = this;
            var ref = '';
            var v = '';
            if (a.ref) ref = a.ref;
            else ref = x.ref;
            if (vv.isChosen(x)) ref = x.zRef;
            var el = view.find(ref);
            el.unbind(t)[t].call(el, function (e) {
                var itm = $(this);
                el.prop('disabled', true);
                $.vCacr(x.rights, function () {
                    if (vv.isChosen(x)) {
                        v = el.find('input').val();
                    } else {
                        v = el.val();
                    }
                    var isKey = false;
                    var arr = a.bKeys ? a.bKeys.split(',') : [];
                    $.each(arr, function (i, k) {
                        if (parseInt($.trim(k)) == e.which) isKey = true;
                    });

                    if (isKey || !a.bKeys) {
                        me._bindVal(x, a, v, e);
                        if (!me._applyCaseAndStop(x, a)) return;
                        if (a.bAppend) {
                            var ar = [];
                            var obj = {};
                            obj[x.valField] = v;
                            obj[x.displayField] = v;
                            ar.push(obj);
                            var b = me.isExistChosenVal(x, v);
                            if (!b) me.loadXCbb(x.name, ar, v, true, true);
                        }

                        var fx = (t == 'keyup') ? a.xKeyup : a.xKeydown;
                        if (typeof (fx) == "function") {
                            fx.call(me, view, itm, e, x, v);
                        }
                        else if (me[fx]) me[fx].call(me, view, itm, e, x, v);
                        el.prop('disabled', false);
                    }


                }, me);
            });
        },

        _applyXDateSelect: function (x) {
            var me = this;
            var cf = {
                dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
                changeMonth: true,
                changeYear: true,
                yearRange: "1950:2020",
                dateFormat: app.ddfm,
            };
            if (x.listeners)
                $.each(x.listeners, function (i, a) {
                    if (a.xDateSelect && me[a.xDateSelect]) {
                        cf['onSelect'] = function (d) {
                            var el = $(this);
                            var v = el.val();
                            me._bindVal(x, a, v);
                            if (!me._applyCaseAndStop(x, a)) return;
                            if (typeof (a.xDateSelect) == "function") a.xDateSelect.call(me, el, d);
                            else me[a.xDateSelect].call(me, el, d);
                            if (typeof (a.xDateSelect) != "function") me.logEvent(a.xDateSelect, v);
                        };
                    }
                    if (a.xDateChange && me[a.xDateChange]) {
                        cf['onSelect'] = function (d) {
                            var el = $(this);
                            var v = el.val();
                            me._bindVal(x, a, v);
                            if (!me._applyCaseAndStop(x, a)) return;
                            if (typeof (a.xDateChange) == "function") a.xDateChange.call(me, view, el, d);
                            else me[a.xDateChange].call(me, view, el, d);
                            if (typeof (a.xDateChange) != "function") me.logEvent(a.xDateChange, v);
                        };
                    }
                });
            view.find(x.ref).datepicker(cf);
        },

        _bindL: function (x) {
            var me = this;
            if (x.vType == 'money') {
                view.find(x.ref).keyup(function () {
                    var obj = $(this);
                    $.vCacr(x.rights, function () {
                        obj.val(vToMn(obj.val().replace(/\./g, '')));
                    });
                });
            }
            if (x.type && x.type.toLowerCase() == 'date') me._applyXDateSelect(x);
            if (x.listeners) {
                $.each(x.listeners, function (i, a) {
                    if (!a.ref) a.ref = x.ref;
                    if (a.xChange) me._applyXChange(x, a);
                    if (a.xClick) me._applyXClick(x, a);
                    if (a.xKeyup) me._applyXKey(x, a, 'keyup');
                    if (a.xKeydown) me._applyXKey(x, a, 'keydown');
                });
            }
        },

        _applyListeners: function (rs) {
            var me = this;
            if (typeof rs != 'undefined' && rs && rs.length > 0) {
                $.each(rs, function (k, x) {
                    me._bindL(x);
                    if (!vv.isChosen(x)) me._initOptions(x);
                });
            } else {
                $.each(gDx(o), function (k, x) {
                    me._bindL(x);
                    if (!vv.isChosen(x)) me._initOptions(x);
                });
                $.each(o.buttons, function (k, x) {
                    me._bindL(x);
                    if (!vv.isChosen(x)) me._initOptions(x);
                });
            }
        },
        //_applyListeners1: function (rs) {
        //    var me = this;
        //    $.each(rs, function (k, x) {
        //        me._bindL(x);
        //        if (!vv.isChosen(x)) me._initOptions(x);
        //    });
        //    $.each(o.buttons, function (k, x) {
        //        me._bindL(x);
        //        if (!vv.isChosen(x)) me._initOptions(x);
        //    });
        //},

        _initOptions: function (x, cb) {
            var me = this;
            //if (!(x.options && x.options.length == 0 && x.listConfig)) return;
            if (!(x.options && x.listConfig) || x.noAjax) return;
            var valField = x.listConfig.valField;
            var displayField = x.listConfig.displayField;
            if (!x.listConfig.ajax || x.listConfig.noload) return;
            if (x.listConfig.ajax.getC) {
                x.listConfig.ajax['_c'] = me[x.listConfig.ajax.getC].call(me, x, x.listConfig.ajax._c);
            }
            me._requestModels(x.listConfig.ajax, function (models) {
                x.options = [];
                view.find(x.ref).empty();

                if (typeof x.allowEmpty != "undefined" && x.allowEmpty) {
                    view.find(x.ref).append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
                }
                //view.find(x.ref).append('<option value="">Chọn</option>');
                $.each(models, function (k, m) {
                    var v = m[valField], d = '';
                    if (displayField.indexOf(',') > 0) {
                        var arrFields = displayField.split(',');
                        $.each(arrFields, function (i, names) { d = d + ' ' + m[names.trim()]; });
                        d = d.trim();
                    } else
                        d = m[displayField];
                    x.options.push(m);
                    view.find(x.ref).append('<option value="' + v + '">' + d + '</option>');
                });
                if (cb) cb.call(me);
                //obj[x.name] = me[x.cpc].call(me, x, baseModel[x.name], formValue, v, baseModel);
                if (x.listConfig.cb) me[x.listConfig.cb].call(me, o, x, models);
            });
        },

        _loadBaseData: function (cb) {
            var me = this;
            if (!o.baseCf) return;
            $('#' + o.gId).mask('Loading..........');
            me.listBase = [];
            me.listArea = [];

            o.baseCf['_f'] = me._getQueryFields();
            var fieldArr = o.baseCf['_f'].split(',');
            // block tuyến đường theo văn phòng
            var extraCon = [];
            if (typeof _dict._hasBlockTripByBranch != "undefined" && _dict._hasBlockTripByBranch && typeof _dict._blockTripByBranch != "undefined") {
                if (typeof _dict._blockTripByBranch[app.aid] != "undefined") {
                    $.each(_dict._blockTripByBranch[app.aid], function (kn, km) {
                        extraCon.push('$x != ' + km);
                    });
                    o.baseCf['_c']['Id'] = extraCon.join(' and ');
                }
            }

            if (me.onBeginLoadBaseData) me.onBeginLoadBaseData.call(me, o, cb);
            var x = vGetObj({ base: true }, gDx(o));

            vRql(o.baseCf, {
                a: function (u, r, l, t) {
                    $.each(gDx(o), function (idx, field) {
                        if (field.base) {
                            view.find(field.ref).empty();

                        }
                    });
                    if (x && typeof x.allowEmpty != "undefined" && x.allowEmpty) {
                        view.find(x.ref).append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
                    }
                },
                m: function (i, d) {
                    var model = {};
                    $.each(fieldArr, function (j, val) {
                        if (val == 'RouteInfo' && o.gId != 'tripTableContainer') {
                            model['arrArea'] = vGas(d[j]);
                        }
                        if (val == 'FareInfo') {
                            model['arrFare'] = vGfs(model['arrArea'], d[j]);
                        }
                        if (val == 'PickedPointsInfo') {
                            model['arrPkPoints'] = vGpps(d[j]);
                        }
                        if (val == 'TransferPointsInfo') {
                            model['arrTfPoints'] = vGpps(d[j]);
                        }
                        //a
                        model[val] = d[j];
                    });
                    me.listBase.push(model);

                    if (x) {
                        //if (firstRecord && typeof fieldCf.nullLabel != 'undefined') {
                        //    $.vCheckAndAppendOptions(view.find(fieldCf.ref), '', fieldCf.nullLabel, 'R');
                        //    firstRecord = false;
                        //}

                        $.vCheckAndAppendOptions(view.find(x.ref), model[x.baseValField], model[x.baseDisplayField], 'R');
                    }
                },
                z: function (u, r, l, t) {
                    if (me.onEndAjaxloadBaseData) me.onEndAjaxloadBaseData.call(me);

                    me._reset();
                    $.each(gDx(o), function (idx, field) {
                        if (field.base) {
                            if (field.name.toLowerCase() != 'pickuptime') {
                                view.find(field.ref).trigger('change');
                            }
                        }
                    });
                    if (cb) {
                        cb.call(me);
                    }
                }
            }, me);
            if (me.onEndloadBaseData) me.onEndloadBaseData.call(me, o, cb);
        },

        _getQueryFields: function () {
            var s = "Id";
            for (var i = 0; i < gDx(o).length; i++) {
                if (gDx(o)[i].gQuery) s += "," + gDx(o)[i].name;
            }
            return s;
        },

        _loadItem: function (record) {
            var me = this;
            me.model = record;
            if (me.onBeginLoadItem) {
                me.onBeginLoadItem.call(me);
            }
            $.each(gDx(o), function (idx, x) {
                if (vv.isChosen(x)) {
                    me._resetChosen(x);
                }
                var d = record[x.name];
                if (x.valField) d = record[x.valField];
                if (x.type && x.type.toLocaleLowerCase() == 'date') {
                    d = vGtDtObj('00:00', d);
                    if (x.displayFormat) {
                        x.displayFormat = app.ddfm;
                    }
                    d = vDtToStr(x.displayFormat, d);
                }
                if (x.gTextToFId) {
                    var isFound = false;
                    var lastIdx = 0;
                    var lastId = '';
                    $(x.ref + " option").each(function () {
                        var val = $(this).val();
                        if ($(this).text().trim().indexOf(d) == 0 && !isFound) {
                            d = val;
                            isFound = true;
                        }
                        if (val != '' && val != null) {
                            lastId = val;
                        }
                        lastIdx++;
                    });
                    if (!isFound) {
                        if (x.autoAppend) {
                            var optionVal = d;
                            var optionText = d;
                            if (x.appendText) optionText += ' - ' + x.appendText;
                            if (x.vType == 'num') {
                                optionVal = parseInt(lastId) + 1;
                                d = optionVal;
                            }
                            $.vCheckAndAppendOptions(view, x.ref, optionVal, optionText);
                        } else {
                            d = '';
                        }
                    }
                }
                //x.model = record;
                if (x.rootField) d = record[x.rootField];
                if (x.rvc) d = me[x.rvc].call(me, x, d);
                if (x.fDisplay) {
                    d = x.fDisplay.call(null, d);
                }
                if (x.combobox && !x.formToGridOnly) {
                    var selectRouteId = $(x.ref + ' option');
                    var id;
                    $.each(selectRouteId, function (i, val) {
                        if (val.text == d) {
                            id = val.value;
                            return;
                        }
                    });
                    $(x.ref + ' option').prop('selected', false).filter('[value="' + id + '"]').prop('selected', true);
                } else if (vv.isChosen(x)) me._reloadChosen(x, d);
                else if (!x.formToGridOnly) view.find(x.ref).val(d);
                else if (me.onLoadingField) me.onLoadingField.call(me, x, record);
            });
            if (me.onItemLoaded) me.onItemLoaded.call(me, record);
            view.find('button.save').html('<i class="glyphicon glyphicon-save"></i> Lưu');
        },

        _getCondition: function (arr) {
            var me = this;
            var c = {};
            if (!arr) return c;
            $.each(arr, function (idx, x) {
                if (!x) {
                    return true;
                }
                var v = view.find(x.ref).val();
                if (x.useOptionTextAsVal) {
                    v = view.find(x.ref + ' option:selected').text();
                }
                if (x.type == 'Date') {
                    v = vDtToStr("iso", vGtDtObj('00:00', v));
                }
                if (x.svb) { //Search value builder
                    v = me[x.svb].call(me, x, v);
                }
                if (vIsEstStr(v) && v.toString().length > 0) {
                    if (x.valField) {
                        c[x.valField] = v;
                    } else if (x.rootField) {
                        c[x.rootField] = v;
                    } else {
                        c[x.name] = v;
                    }
                }
                return true;
            });
            return c;
        },

        _getAjaxConfig: function (c) {
            var me = this;
            var fc = {};
            if (c) $.each(c, function (name, val) { fc[name] = val; });
            if (o.queryConditions) $.each(o.queryConditions, function (name, val) { fc[name] = val; });
            var ajax = { _a: o.queryAction, _c: fc, _f: me._getQueryFields() };
            return ajax;
        },

        _getAjaxConfig2: function (c) {
            var me = this;
            var fc = {};
            if (o.queryConditions) $.each(o.queryConditions, function (name, val) { fc[name] = val; });
            if (c) $.each(c, function (name, val) { fc[name] = val; });
            //console.log('_getAjaxConfig', fc);
            var ajax = { _a: o.queryAction, _c: fc, _f: me._getQueryFields() };
            return ajax;
        },

        _getBaseModel: function () {
            var me = this;
            var x = vGetObj({ base: true }, gDx(o));
            if (!x) return null;
            var selectedBaseId = parseInt(view.find(x.ref).val());
            var baseModel = vGetObj({ Id: selectedBaseId }, me.listBase);
            return baseModel;
        },

        _getDetailModelsFromBase: function (baseModel, remoteRecords, d) {
            var me = this, arr = [];
            if (!baseModel) return [];
            var fd = vGetObj({ xbase: true }, gDx(o));
            var baseValue = baseModel[fd.baseValSrcField];
            var values = [];
            if (fd.xchr) values = me[fd.xchr].call(me, fd, baseValue);
            $.each(values, function (idx, v) {
                var s = {};
                s[fd.name] = v;
                if (vGetObj(s, remoteRecords)) return true;
                var obj = { Id: 'New' + idx };
                $.each(gDx(o), function (i, x) {
                    if (!x.gQuery) return true;
                    if (!(x.dType == 1)) {
                        if (x.cpc) { //Copy converter
                            var formValue = view.find(x.ref).val();
                            if (d && d[x.name]) formValue = d[x.name];
                            obj[x.name] = me[x.cpc].call(me, x, baseModel[x.name], formValue, v, baseModel);
                            if (x.type == 'Date') {
                                var date = vGtDtObj('00:00', obj[x.name]);
                                obj[x.name] = vDtToStr("dd-mm-yyyy", date);
                            }
                        } else obj[x.name] = baseModel[x.name];
                        if (x.isBaseId) obj[x.name] = baseModel.Id;
                    }
                    if (x.name == fd.name) obj[x.name] = v;
                    return true;
                });
                arr.push(obj);
                return true;
            });
            return arr;
        },

        _applyFromBaseOptions: function (type) {
            var me = this;
            var fromBaseFields = vGetArr({ fromBase: true }, true, gDx(o));
            $.each(fromBaseFields, function (idx, x) {
                if (x.cbb) {
                    if (x.fromExcludeCases && x.fromExcludeCases.indexOf(type) < 0) {
                        view.find(x.ref).empty();
                        if (x.xchv) {
                            var arr = me[x.xchv].call(me, me._getBaseModel(), me.mainModels);
                            $.each(arr, function (i, vl) { $.vCheckAndAppendOptions(view.find(x.ref), i, vl, 'R', true); });
                        }
                    } //view.find(obj.ref).append('<option value="">Chọn</option>');
                }
                view.find(x.ref).trigger('change');
            });
        },

        _getD: function (data, isNew) {
            var me = this;
            var d = {};
            var partInfos = {};
            var baseModel = me._getBaseModel();
            var v = '';
            $.each(gDx(o), function (idx, x) {
                if (!x.noSave) {
                    v = me._gfv(x);
                    //if (!$.isEmptyObject(v) && v.toString().length > 0) {
                    if (x.valField) d[x.valField] = v;
                    else if (x.name) d[x.name] = v;
                    //}
                }
                if (x.name) partInfos[x.name] = x;
                if (x.auto) {
                    if (x.depends) {
                        var b = {};
                        $.each(x.depends, function (k, va) {
                            var px = vGetObj({ name: va }, gDx(o));
                            b[va] = me._gfv(px);
                        });
                        if (x.needBase) {
                            b['Base'] = baseModel;
                        }
                        if (x.svc) v = me[x.svc].call(me, x, me._gfv(x), b, isNew);
                    }
                    if (x.name) d[x.name] = v;
                }
                if (x.gQuery && x.copyFromBase) {
                    if (x.name) d[x.name] = baseModel[x.name];
                }
            });
            if (o.defaultData) {
                $.each(o.defaultData, function (k, val) {
                    if (val == '$base') {
                        d[k] = baseModel.Id;
                    } else {
                        d[k] = val;
                    }
                });
            }
            if (data) $.each(data, function (k, val) { d[k] = val; });
            return d;
        },

        _gfv: function (x, s, d) {
            /// <summary>
            /// Get formated value
            /// </summary>
            /// <param name="x">Config object</param>
            /// <param name="s">For search</param>
            /// <param name="d">Data</param>
            var me = this;
            if (!x || !x.ref) {
                return '';
            };
            var vl = view.find(x.ref).val();
            if (x.defaultValue != null && vl == undefined) vl = x.defaultValue;
            if (x.useOptionTextAsVal) vl = view.find(x.ref + ' option:selected').text();
            if (x.type == 'Date' && !s) vl = vDtToStr("iso", vGtDtObj('00:00', vl));
            if (vv.isChosen(x) && x.vals) {
                if (x.svc) vl = me[x.svc].call(me, x, vl, x.vals);
            } else if (x.svc && !x.depends) vl = me[x.svc].call(me, x, vl);

            if (x.vType == 'num' && !x.useOptionTextAsVal) {
                vl = parseInt(vl);
            }
            if (d) {
                vl = d[x.name];
            }
            return vl;
        },

        _selectRowFromForm: function () {
            var me = this;
            me.stopGridSelectionEvent = true;
            var models = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields, true);
            if (models.length == 0) {
                models = me._getMatchedRecords(me.baseDetailModels, o.keyFields, false, o.finalKeyFields, true);
            }
            var totalRows = $('#' + o.gId).jtable('getTotalRow');
            if (totalRows > 0) {
                if (models.length == 1) {
                    var row = $('#' + o.gId).jtable('getRowByKey', models[0].Id);
                    if (row) {
                        $('#' + o.gId).jtable('selectRows', row);
                    }
                } else if (models.length == 0) {
                    var selectedRows = $('#' + o.gId).jtable('selectedRows');
                    if (selectedRows.length > 0) {
                        $('#' + o.gId).jtable('deselectRows', selectedRows);
                    }
                } else if (models.length > 1) {
                    $.each(models, function (i, m) {
                        var row = $('#' + o.gId).jtable('getRowByKey', m.Id);
                        if (row) {
                            me.stopGridSelectionEvent = true;
                            $('#' + o.gId).jtable('selectRows', row);
                        }
                    });
                }
            }
            $.vCheckPopupRights(view);
            view.find('.closedStatus').trigger('change');
            //$('#' + cf.gId).unmask();
            return;
        },

        _ajaxInsert: function (a, d, name, cb) { //d
            d.IsPrgStatus = 1;
            var me = this;
            me.insertData = d;
            vRqs({ _a: a, _f: '*', _d: d }, function (u, r, l, t) {
                if (u && parseInt(r) > 0) {
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: name + ' thành công.' });
                    // reload lại BKS
                    FlatObj.FTripGetTrip = false;
                    $('#bksContent').vbooking('load');
                    if (cb) {
                        cb.call(me, u, r, l, t);
                    }
                } else {
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: name + ' thất bại, vui lòng thử lại sau.' });
                }
            }
            );
        },

        _updateByInsert: function (msg) {
            var me = this;
            var d = me._getD({ StatusInfo: oTrs.normal }, true);
            me._ajaxInsert(o.insertAction, d, msg + ' ' + o.name.toLocaleLowerCase(), function (u, r, l, t) {
                me._reloadMainData("New");
                if (o.afterUpdate) {
                    o.afterUpdate.call(o);
                }
            });
        },

        _ajaxUpdate: function (id, d, isDelete, cb, msgSucc, msgErr) {
            var me = this;
            if (!d) d = me._getD();
            var content = '';
            //var content = isDelete ? 'Hủy thành công.' : 'Cập nhật thành công.';
            //var content2 = isDelete ? 'Cập nhật thất bại, vui lòng thử lại sau.' : 'Hủy thất bại, vui lòng thử lại sau.';
            vRqs(
                { _a: o.updateAction, _c: { Id: id }, _d: d },
                function (u, r, l, t) {
                    if (u && parseInt(r) > 0) {
                        if (msgSucc) {
                            content = msgSucc;
                        } else {
                            content = 'Cập nhật thành công.';
                        }
                        vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: content });
                    } else {
                        if (msgErr) {
                            content = msgErr;
                        } else {
                            content = 'Cập nhật thất bại, vui lòng thử lại sau.';
                        }
                        vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: content });
                    }
                    // reload lại BKS
                    FlatObj.FTripGetTrip = false;
                    $('#bksContent').vbooking("load");
                    me._reloadMainData(id);
                    if (cb) {
                        cb.call(me, u, r, l, t);
                    }
                });
        },

        _onSelectionChange: function (record, type) {
            var me = this;
            if (me.onBeginSelectionChange) {
                me.onBeginSelectionChange.call(me, view, record);
            }
            $.each(gDx(o), function (idx, x) {
                var selector = x.ref;
                var isDisable = false;
                if (record) {
                    if (record.StatusInfo == oTrs.cancel) {
                        isDisable = true;
                    }
                }
                if (vv.isChosen(x)) {
                    view.find(selector).attr('disabled', isDisable).trigger("chosen:updated");
                    if (!record) {
                        me._resetChosen(x);
                    }
                } else if (!x.alwaysDisable) {
                    if (x.alwaysEnable) isDisable = false;
                    else if (x.alwaysDisable) isDisable = true;
                    view.find(selector).prop('disabled', isDisable);
                    //if (view.find(selector).attr('name') != 'AddTime') view.find(selector).prop('disabled', isDisable);
                    //if (view.find(selector).attr('name') == 'AddTime') view.find(selector).next().prop('disabled', isDisable);
                    if (view.find(selector).hasClass('departure')) view.find(selector).next().attr('disabled', isDisable);
                }
                if (!me.stopGridSelectionEvent && record && x.changeOnSelectionChange) {
                    view.find(x.ref).trigger('change');
                }
            });
            if (me.stopGridSelectionEvent) {
                me.stopGridSelectionEvent = false;
                return;
            }
        },

        _getMatchedRecords: function (arr, fields, isSingle, extFields, isForceExtField, data) {
            var me = this, c = {};
            $.each(fields, function (idx, name) {
                var mc = vGetObj({ name: name }, gDx(o));
                var v = me._gfv(mc, true, data);
                if (mc && mc.valField) {
                    c[mc.valField] = v;
                } else {
                    c[name] = v;
                }
            });
            var models = vGetArr(c, true, arr);
            c = {};
            if (isForceExtField || (isSingle && models && models.length >= 1 && extFields)) {
                if (extFields) {
                    $.each(extFields, function (idx, name) {
                        var mc = vGetObj({ field: name }, gDx(o));
                        if (mc) {
                            var v = me._gfv(mc, true, data);
                            if (mc.valField) {
                                c[mc.valField] = v;
                            } else {
                                c[name] = v;
                            }
                            models = vGetArr(c, true, models);
                        } else {
                            return models;
                        }
                    });
                }
            }
            return models;
        },

        _unloadItem: function () {
            var me = this;
            me.model = null;
            //console.log('_unloadItem');
            var div = $('#seat-map');
            if (div) {
                div.empty();
            }
            if (me.onAfterUnloadItem) me.onAfterUnloadItem.call(me);
        },

        _listAction: function (models, params, isBegin, isRemote) {
            var me = this, sIdx = 0;
            if (me.isBeginLoad) {
                params.jtStartIndex = 0;
                me.isBeginLoad = false;
            }
            var isEnd = true;
            if (models && models.length && models.length > 0) {
                isEnd = false;
            }
            var jtStartIndex = parseInt(params.jtStartIndex);
            params.jtStartIndex = (!isBegin) ? jtStartIndex : 0;

            params.jtPageSize = parseInt(params.jtPageSize);
            var rc = models;
            if (typeof me.o.gridSortBy != 'undefined') {
                rc = vSort(me.o.gridSortBy.Name, me.o.gridSortBy.IsDesc, rc);
            }
            if (typeof me.o.gridCondition != 'undefined') {
                rc = vGetArr(me.o.gridCondition, false, rc);
            }
            if (typeof me.o.gridToBottom === 'function') {
                var t = rc.filter(me.o.gridToBottom);
                for (var i = 0; i < rc.length; i++) {
                    if (me.o.gridToBottom.call(me, rc[i], i)) {
                        rc.splice(i, 1);
                        i = 0;
                    }
                }
                rc = rc.concat(t);
            }
            //console.log('jtStartIndex: ', params.jtStartIndex, params.jtPageSize, sIdx, isBegin);
            //console.log(params);

            if (isRemote) return {
                Result: 1,
                TotalRecordCount: isEnd ? params.jtStartIndex + (params.jtPageSize) : params.jtStartIndex + (params.jtPageSize * 2),
                //Records: rc,
                Records: rc,
                page: (params.jtStartIndex + params.jtPageSize) / params.jtPageSize
            }

            return {
                Result: 1,
                TotalRecordCount: models.length,
                //Records: rc,
                Records: rc.slice(params.jtStartIndex, params.jtStartIndex + params.jtPageSize),
                page: (params.jtStartIndex + params.jtPageSize) / params.jtPageSize
            };
        },

        _getBaseDetailModels: function (records, c, d) {
            var me = this;
            var baseModel = me._getBaseModel();
            var models = me._getDetailModelsFromBase(baseModel, records, d);
            me.baseDetailModels = models;
            if (c) {
                models = vGetArr(c, gDx(o), models);
            }
            return models;
        },

        _reloadMainData: function (id, c, type, d, isSilent) {
            var me = this;
            var arr = vGetArr({ domain: true }, true, gDx(o));
            if (!c) {
                c = me._getCondition(arr);
            }
            me._reloadTable(c, function (rs) {
                if (isSilent) return;
                if (!id) {
                    me._selectRowFromForm();
                    return;
                }
                if (id.indexOf) {
                    var models = me._getMatchedRecords(me.mainModels, o.keyFields, true, o.finalKeyFields, true, me.insertData);
                    id = models[0] ? models[0].Id : '';
                }
                var row = $('#' + o.gId).jtable('getRowByKey', id);
                if (row) $('#' + o.gId).jtable('selectRows', row);
                var m = vGetObj({ Id: id }, me.mainModels);
                me._onSelectionChange(m, type);
                me._selectRowFromForm();
            }, function (remoteModels) {
                me.mainModels = remoteModels;
                me._applyFromBaseOptions(type);
                $.vCheckPopupRights(view);
                var arrs = me._getBaseDetailModels(remoteModels, c, d);
                $.each(remoteModels, function (k, obj) { arrs.push(obj); });
                if (me.getFinalExtRow) return me.getFinalExtRow.call(me, arrs);
                return arrs;
            });
        },

        _reload: function (c, cb, getExtRow) {
            var me = this;
            me['wkMasterModels'] = null;
            me.isBegin = true;
            var isCOverride = c ? c._isOverride : null;
            if (isCOverride) delete c._isOverride;
            if (me.onBeginReload) me.onBeginReload.call(me);
            var ajax = isCOverride ? me._getAjaxConfig2(c) : me._getAjaxConfig(c);
            $('#' + o.gId).mask('Loading..........');
            if (o.isRemotePagging) {
                $('#' + o.gId).jtable('addLocalRecords', function (lastPostData, params, cfg) {
                    if (ajax['_c']) {
                        ajax['_c']['pIdx'] = params['jtStartIndex'];
                        ajax['_c']['pSize'] = params['jtPageSize'];
                    }
                    return me._requestModels(ajax, function (models) {
                        if (getExtRow) models = getExtRow.call(me, models);

                        var isBg = me.isBegin;
                        me.isBegin = false;
                        var act = me._listAction(models, params, isBg, true);
                        cfg.Data = act;
                        if (cb) cb.call(me, models);
                        if (me.afterReload) me.afterReload.call(me, models);
                        me.remoteModels = models;
                        $('#' + o.gId).jtable('removeAllRows');
                        $('#' + o.gId).unmask();

                        //console.log(o.isRemotePagging, lastPostData, params, act);
                        //return jQuery.ajax();
                    });

                });
                //$('#' + o.gId).jtable('addLocalRecords', 'http://vexere.com');
            } else {
                me._requestModels(ajax, function (models) {
                    if (getExtRow) models = getExtRow.call(me, models);
                    $('#' + o.gId).jtable('removeAllRows');
                    if (typeof me.o.autoApplyGrid == 'undefined' || me.o.autoApplyGrid == true) {
                        $('#' + o.gId).jtable('addLocalRecords', function (lastPostData, params) {
                            var isBg = me.isBegin;
                            me.isBegin = false;
                            return me._listAction(models, params, isBg);
                        });
                    };
                    if (cb) cb.call(me, models);
                    if (me.afterReload) me.afterReload.call(me, models);
                    me.remoteModels = models;
                    $('#' + o.gId).unmask();
                    //if (o.grid && o.gId) $('#' + o.gId + ' .jtable-page-size-change select').val(2);
                });
            }
        },

        _firstLoadTable: function () {
            var me = this;
            if (me.onBeginFirstLoad) me.onBeginFirstLoad.call();
            if (!o.grid || o.gNoLoad) return;
            me._reloadTable();
        },

        _reloadTable: function (c, cb, getExtRow) {
            var me = this;
            if (o.gRights) me._reload(c, cb, getExtRow);
            else me._reload(c, cb, getExtRow); //TODO: Check Rights
        },

        _requestModels: function (ajax, cb, cbModels) {
            //console.log(ajax);
            var me = this;
            var fieldArr = ajax['_f'].split(',');
            var a = ajax['_a'];
            var models = [];
            var formFields = gDx(o);
            var pi = {};
            return vRql(ajax, {
                a: function (u, r, l, t) {
                    pi = $('#' + o.gId).jtable('getPageInfo');
                    if (o.mainModel && o.mainModel['Act'] == a) {
                        me.allData = r;
                        me.advModels = {};
                    }
                },
                m: function (i, d) {
                    if (cbModels) {
                        var b = cbModels.call(me, i);
                        if (b) {
                            $.each(d, function (k, d2) {
                                me._setMainModels(formFields, d2, fieldArr, models, k, pi);
                            });
                            return;
                        }

                    }
                    if (!o.mainModel || o.mainModel['Act'] != a) me._setMainModels(formFields, d, fieldArr, models, i, pi);
                    else {
                        if (o.mainModel['Idx'] == i) {
                            $.each(d, function (k, d2) {
                                me._setMainModels(formFields, d2, fieldArr, models, k, pi);
                            });
                        } else if (o.mainModel[i]) {
                            me.advModels[i] = [];
                            $.each(d, function (k, d2) {
                                me._setMainModels(formFields, d2, fieldArr, me.advModels[i], k, pi);
                            });
                        }
                    }
                },
                z: function (u, r, l, t) {

                    if (cb) {
                        cb.call(me, models);
                    }
                }
            }, me, view);
        },

        _setMainModels: function (formFields, d, fieldArr, models, i, pi) {
            var me = this, model = {};
            $.each(fieldArr, function (j, v) {
                model[$.trim(v)] = d[j];
                var f = formFields[$.trim(v)];
                if (d[j] == null && f && f.defaultValue) model[$.trim(v)] = f.defaultValue;
                if (f && f.type && f.type.toLowerCase() == 'date') {
                    if (f.displayFormat) f.displayFormat = app.ddfm;
                    var s = vDtToStr(f.displayFormat, vGtDtObj('00:00', d[j]));
                    model[$.trim(v)] = s;
                }
            });
            if (me.xNo) {//getPageInfo

                model[me.xNo.name] = i + 1 + parseInt(pi ? pi.jtStartIndex : 0);
            }
            models.push(model);
        },

        _getOptions: function (selector) {
            var options = $(selector);
            var values = [];
            $.each(options, function () {
                var txt = $(this).text();
                var arr = txt.split('-');
                values.push(arr[0].trim());
            });
            return values;
        },

        _applyCondition: function (fields, name, c, k) {
            var me = this;
            $.each(fields, function (idx, x) { if (x.name == name) c[k] = me._gfv(x); });
        },

        _onBasicUpdate: function (id, afterClick) {
            var me = this;
            var msg = "";
            var failArr = [];
            var isValid = true;
            var pageSize = parseInt($('#' + o.gId + ' .jtable-page-size-change select').val());
            $.each(gDx(o), function (idx, x) {
                var m;
                var v = view.find(x.ref).val();
                if (x.svv && typeof x.svv == 'string') { //svv = save value validator
                    m = me[x.svv].call(me, x, v);
                    if (m) {
                        isValid = false;
                        msg += "\n" + m;
                        failArr.push(x);
                    }
                }
                if (x.vtype == 'money') v = v.toNum();

                if (x.vtype == 'num' && isNaN(v)) {
                    isValid = false;
                    msg += "\n" + x.label + ' phải là số';
                    failArr.push(x);
                }

                if (x.vtype == 'phone' && !vIsPNum(v)) {
                    isValid = false;
                    msg += "\n" + 'Số điện thoại không hợp lệ.';
                    failArr.push(x);
                }
                if (x.vtype == 'licensePlate' && !vIsVehiNum(v)) {
                    isValid = false;
                    msg += "\n" + 'Biển số xe không hợp lệ.';
                    failArr.push(x);
                }
                if (x.required && (v == '' || v.trim().length <= 0)) {
                    isValid = false;
                    msg += "\n Vui lòng nhập " + x.label.toLocaleLowerCase();
                    failArr.push(x);
                }
            });

            if (isValid) {
                var obj, d;
                if (!id) {
                    d = me._getD(null, true);
                    obj = { _a: o.insertAction, _c: {}, _d: d };
                    obj._d.IsPrgStatus = 1;
                    delete obj._d.Id;
                } else {
                    d = me._getD(null, false);
                    obj = { _a: o.updateAction, _c: { Id: me.model.Id }, _d: d };
                }
                vRqs(obj, function (u, r, l, t) {
                    if (u) {
                        if (me.onActionComplete) me.onActionComplete.call(me);
                        vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                        if (me.onUpdateSuccess) me.onUpdateSuccess.call(me, id);
                        else {
                            me._reloadTable(null, function () {
                                if (id && !o.deselectAfterUpdate) {
                                    var rowSelected = $('#' + o.gId).jtable('getRowByKey', id);
                                    if (rowSelected) $('#' + o.gId).jtable('selectRows', rowSelected);
                                }
                                vv.clearFormAndGrid(view);
                                $('#' + o.gId + ' .jtable-page-size-change select').val(pageSize);
                                //$('#' + cf.gId).unmask();
                            }, null);
                        }
                    } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
                });
            } else {
                vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: msg });
                if (failArr.length > 0) view.find(failArr[0].ref).trigger('focus');
            }
            if (afterClick && typeof afterClick === 'function') afterClick.call();
        },

        load: function () {
            var me = this;
            me._me();
            me._reset();
            me._applyListeners();
            me._loadBaseData();
            me._firstLoadTable();
            me._beginForm();
            if (me.onVMLoaded) me.onVMLoaded.call(me);

        },

        bind: function () {
            var me = this;
            view.on('gSelect', function (e) { me._gSelect(e); });
            view.on('gUnSelect', function (e) { me._gDeselect(e); });
        },

        onGetData: function (x) {
            var me = this;
            me._initOptions(x, function () { $(x.ref).trigger("chosen:updated"); });
        },

        onViewReady: function () {
            var me = this;
            if (me.afterViewReady) me.afterViewReady.call(me);
        },

        onChosenChange: function (x) {
            var me = this;
            if (!x.a) return;
            if (x.a.selected) me._selectChosen(x, x.a.selected, vGetObj({ Id: parseInt(x.a.selected) }, x.options));
            if (x.a.deselected) me._deselectChosen(x, x.a.deselected);
        },

        close: function () {
            var me = this;
            me._close();
        },

        onClickSBF: function () {
            try {
                var me = this, x = $.sbf, c = me._getCondition(x.vals);
                me._reloadMainData(me.model ? me.model.Id : null, c, 'sbf');
            } catch (e) {
                console.log('clickSBF', e);
            }
        },

        onChangeSBF: function () {
            var me = this;
            var x = $.sbf;
            if (!x.a) return;
            if (x.a.selected) me._selectChosen(x, x.a.selected, vGetObj({ Id: parseInt(x.a.selected) }, x.options));
            if (x.a.deselected) me._deselectChosen(x, x.a.deselected);
        },

        onSave: function (btn, bcf) {
            var me = this;
            var id = '';
            if (me.model) {
                id = me.model['Id'];
            }
            var fx = function () {
                var rs;
                if (id && !id.indexOf) {
                    var isAllow = true;
                    rs = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields, true);
                    if (rs.length >= 1) {
                        $.each(rs, function (i, m) { if (parseInt(m.Id) != parseInt(id)) isAllow = false; });
                        if (isAllow) me._ajaxUpdate(id);
                        else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Chuyến đã tồn tại, vui lòng chọn Bus khác' });
                    } else me._ajaxUpdate(id);
                } else if (id) {
                    rs = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields);
                    if (rs.length == 1) me._ajaxUpdate(rs[0].Id);
                    else if (rs.length > 1) vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Chuyến đã tồn tại, vui lòng chọn Bus khác' });
                    else me._updateByInsert('Cập nhật');
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Vui lòng chọn ' + o.name });
            };
            if (me.checkAndSave) me.checkAndSave.call(me, fx);
            else fx.call();
        },

        onBasicSave: function (a, b, afterClick) {
            var me = this, id = '';
            if (me.model) {
                id = me.model['Id'];
            }
            if (id && !id.indexOf) me._onBasicUpdate(id, afterClick);
            else me._onBasicUpdate(null, afterClick);
        },

        onBasicDelete: function (btn, a, fx, target, args) {
            var me = this;
            var btnDelete = vGetObj({ name: 'btnRemove' }, o.buttons);
            var idx = 0;
            if (me.remoteModels) $.each(me.remoteModels, function (i, model) { if (model.Id == me.model.Id) idx = i; });
            var d = { IsPrgStatus: 3 };
            // Todo: không hiểu vì sao ai truyền args vô request
            if (args) {
                $.extend(d, args);
            }
            vRqs({ _a: o.updateAction, _c: { Id: me.model.Id }, _d: d }, function (u, r, l, t) {
                if (u) {
                    if (me.onActionComplete) me.onActionComplete.call(me);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Xóa thành công.' });
                    vv.clearFormAndGrid(view);
                    view.find('button.delete').addClass('btn-disabled').attr('disabled', 'disabled');
                    me._reloadTable(null, function (models) { if (idx >= models.length - 1) idx = 0; });
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: btnDelete ? btnDelete.messErro : 'Thao tác thất bại, vui lòng thử lại sau.' });
            });
        },

        onBasicClear: function () {
            var me = this;
            me.model = null;
            view.find('button.delete').addClass('btn-disabled').attr('disabled', 'disabled');
            vv.clearFormAndGrid(view);
            if (o.defaultFocusRef) view.find(o.defaultFocusRef).trigger('focus');
        },

        getOverrideAjaxConfig: function (a, c) {
            /*
             * a: default ajax config
             * c: override conditions
             */
            if (c && c._a) return c;
            var dc = a._c;
            var fc = {};
            if (dc) $.each(dc, function (name, val) { fc[name] = val; });
            if (c) $.each(c, function (name, val) { fc[name] = val; });
            var ajax = { _a: a._a, _c: fc, _f: a._f };
            return ajax;
        },

        _clearCbb: function (n) {
            var x = vGetObj({ name: n }, gDx(o));
            var v = view.find(x.ref);
            if (!x) return;
            v.empty();
            v.append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
        },

        loadXCbb: function (name, models, val, force, isAppend) {
            var me = this;
            if (!me.isCase(name) || force)
                if (models && models.length > 0) {
                    var x = vGetObj({ name: name }, gDx(o));
                    var v = view.find(x.ref); if (!x) return;
                    x.options = models;
                    if (!isAppend) v.empty();
                    $.each(x.options, function (k, model) {
                        $.vCheckAndAppendOptions(v, model[x.valField], model[x.displayField], 'R');
                    });

                    if (vv.isChosen(x)) {
                        me._resetChosen(x);
                        if (val != null) {
                            v.val(val);
                            v.trigger("chosen:updated");
                        }
                    }

                }
        },

        _loadCbb: function (n, c, cb) {
            var me = this;
            var x = vGetObj({ name: n }, gDx(o));
            var v = view.find(x.ref);
            if (!x) return;
            if (x.local) {
                v.empty();
                v.append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
                $.each(x.options, function (k, model) {
                    $.vCheckAndAppendOptions(v, model[x.valField], model[x.displayField], 'R');
                });

                if (vv.isChosen(x)) me._resetChosen(x);
                if (cb) cb.call(me);
                return;
            }
            x.options = [];
            v.empty();
            if (!x.listConfig || !x.listConfig.ajax) return;// o.baseCf['_f'].split(',');
            var fieldArr = x.listConfig.ajax['_f'].split(',');
            //if (me.onBeginLoadBaseData) me.onBeginLoadBaseData.call(me, o, cb);
            //var x = vGetObj({ base: true }, gDx(o));
            var acf = me.getOverrideAjaxConfig(x.listConfig.ajax, c);
            //console.log('_loadCbb', acf);
            vRql(acf, {
                a: function (u, r, l, t) {
                    v.empty();
                    if (x && typeof x.allowEmpty != "undefined" && x.allowEmpty) {
                        v.append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
                    }

                },
                m: function (i, d) {
                    var model = {};
                    $.each(fieldArr, function (j, val) {
                        model[$.trim(val)] = d[j];
                    });
                    $.vCheckAndAppendOptions(v, model[x.listConfig.valField], model[x.listConfig.displayField], 'R');

                },
                z: function (u, r, l, t) {
                    if (vv.isChosen(x)) {
                        me._resetChosen(x);
                    }
                    if (cb) cb.call(me);
                }
            }, me);
            if (me.onEndloadBaseData) me.onEndloadBaseData.call(me, o, cb);
        },

        resetChosenByName: function (n, isEmpty, isAddBeginOptions) {
            var me = this;
            var x = vGetObj({ name: n }, gDx(me.o));
            if (!x) return;
            var v = $(x.ref);
            if (isEmpty) {
                v.empty();
                v.trigger("chosen:updated");
            } else {
                $('option', v).each(function (id) {
                    vv.unchose(x.ref, id);
                    v.trigger("chosen:updated");
                });
            }
            //me._reloadChosen(x);
            if (isAddBeginOptions && x.beginOptions) {
                $.each(x.beginOptions, function (k, model) {
                    //console.log(model[x.valField], model[x.displayField]);
                    $.vCheckAndAppendOptions(v, model[x.valField], model[x.displayField], 'R');
                    v.trigger("chosen:updated");

                });

                me._reloadChosen(x);

            }
        },

        clearGrid: function () {
            $('#' + o.gId).jtable('removeAllRows');
        },

        logEvent: function (n, v) {
            if (o.isDebug) console.log(n, v ? v : '');
        },

        removeChildRows: function () {
            var me = this;
            var ref = '#' + o.gId;
            var id = $(ref).jtable('getDeselectedId');
            if (!me['wkMasterModels']) return;
            if (id) {
                var models = me['wkMasterModels'][id];
                if (models) {
                    me['wkMasterModels'][id] = null;
                    $(ref).jtable('delRecords', id, models);

                }

            }
        },

        removeChildRow: function (id) {
            var me = this;
            if (!me['wkMasterModels']) return;
            var ref = '#' + o.gId;
            if (id) {
                var models = me['wkMasterModels'][id];
                if (models) {
                    me['wkMasterModels'][id] = null;
                    $(ref).jtable('delRecords', id, models);

                }

            }
        },

        addChildRows: function (id, ajax) {
            var me = this;

            var ref = '#' + me.o.gId;
            if (!me['wkMasterModels']) {
                me['wkMasterModels'] = {};
            }
            if (me['wkMasterModels'][id] != null) {
                me.removeChildRow(id);
                return;
            }

            me.logEvent('onSelectRow', ajax);
            me._requestModels(ajax, function (models) {
                me['wkMasterModels'][id] = models;
                $(ref).jtable('insertRecords', id, models, 'vSubRows');

            });
        },

        setHtml: function (ref, tplId, data) {
            var me = this;
            ref = me.getMyRef(ref);
            var html = $.html(tplId, data);
            $(ref).html(html);
        },

        getMyRef: function (ref) {
            if (o.id && ref.indexOf(o.id) < 0) return '#' + o.id + ' ' + ref;
            return ref;
        }
    };
};