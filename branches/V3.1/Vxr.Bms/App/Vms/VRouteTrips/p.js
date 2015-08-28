define({
    start: function(o, cb) {
        try {
            if (cb) cb.call(this);
           
        } catch (e) {
            // console.log('(E) WatchRoutes', e);
        };

    },

    _escapeSearchString: function(text) {
        return text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/Đ/g, "D").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i");
    },

    //#region Private Methods

    getTripDate: function(cf, obj) {
        var time = obj.Time;
        var date = obj.Date;
        return vAddTime(time, date);
    },

    _checkBeforeDelete: function(isUndel, cb) {
        var me = this, o = me.o, view = me.view;
        if (isUndel) {
            if (cb) {
                cb.call(me);
                return;
            }
        }
        var ccf = o.checkDelConditions;
        var c = vCloneObj(ccf._c);
        $.each(c, function(k, v) {
            if (v == '$base') c[k] = me._getBaseModel().Id;
            else if (v.indexOf && v.indexOf('$') == 0) {
                var name = v.substring(1);
                me._applyCondition(gDx(o), name, c, k);
            } else if (v.params && v.get) {
                var pFields = v.params.split(',');
                var obj = {};
                $.each(pFields, function(idx, p) {
                    if (p.indexOf('$') == 0) {
                        var names = p.substring(1);
                        me._applyCondition(gDx(o), names, obj, names);
                    }
                });
                var r = me[v.get].call(me, v, obj);
                c[k] = r;
            } else {
                c[k] = v;
            }
        });
        var ajax = { _a: ccf._a, _c: c, _f: ccf._f };
        vRql(ajax, {
            z: function(u, r, l, t) {
                if (!l) {
                    if (cb) cb.call(me);
                } else {
                    var msg = ccf.existMsg.replace('{$x}', l);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: msg });
                }
            }
        }, me, view);
    },

    _checkInputTime: function(t) {
        var me = this, view = me.view;
        var options = me._getOptions('select.pickup-time option');
        if (t.length == 5 && t.indexOf(':') != -1) {
            var t_split = t.split(':');
            if (t_split[0].length == 2 && t_split[1].length == 2) {
                if (parseInt(t_split[0]) >= 0 && parseInt(t_split[0]) <= 24 && parseInt(t_split[1]) >= 0 && parseInt(t_split[1]) <= 60) {
                    if (options.indexOf(t) < 0) {
                        return true;
                    } else {
                        vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Giờ này đã tồn tại, bạn nên chọn Bus khác để tạo chuyến cùng giờ.' });
                    }
                } else {
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thời gian không chính xác, vui lòng kiểm tra lại.' });
                }
            } else {
                vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Vui lòng nhập thời gian theo dạng --:--' });
            }
        } else {
            vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Vui lòng nhập thời gian theo dạng --:--' });
        }
        return false;
    },

    _checkHasTicket: function(listBlockSeat, cb) {
        var me = this, o = me.o, view = me.view;
        var ccf = o.checkHasTicket;
        var c = vCloneObj(ccf._c);
        $.each(c, function(k, v) {
            if (v == '$base') {
                c[k] = me._getBaseModel().Id;
            } else if (v.indexOf && v.indexOf('$') == 0) {
                var name = v.substring(1);
                me._applyCondition(gDx(o), name, c, k);

            } else if (v.params && v.get) {
                var pFields = v.params.split(',');
                var obj = {};
                $.each(pFields, function(idx, p) {
                    if (p.indexOf('$') == 0) {
                        var names = p.substring(1);
                        me._applyCondition(gDx(o), names, obj, names);
                    }

                });
                var r = me[v.get].call(me, v, obj);
                c[k] = r;

            } else {
                c[k] = v;
            }
        });
        var ajax = { _a: ccf._a, _c: c, _f: ccf._f };
        vRql(ajax, {
            z: function(u, r, l, t) {
                if (l) {
                    var res = r;
                    var isCont = true;
                    $.each(res, function(ki, kl) {
                        var kll = kl[0].split('|');
                        var seatPos = kll[1] + "|" + kll[2] + "|" + kll[3];
                        if (listBlockSeat.indexOf(seatPos) != -1) {
                            vv.showMessage(
                            {
                                element: me.view.find('.alert.message'),
                                type: 'alert-danger',
                                content: 'Đã có vé được đặt vào vị trí ghế bị khóa, vui lòng kiểm tra lại.'
                            });
                            isCont = false;
                            return false;
                        }
                    });
                    if (isCont && cb) {
                        cb.call();
                    }
                } else {
                    if (cb) {
                        cb.call();
                    }
                }
            }
        }, me, view);
    },

    //#endregion

    //#region Callbacks
    onItemLoaded: function(r) {
        var v = this.o.view;
        v.find('total-booked-seats').val(r.TotalBookedSeats);
        v.find('total-paid-seats').val(r.TotalPaidSeats);
    },
    onAfterUnloadItem: function() {
        var v = this.o.view;
        v.find('total-booked-seats').val('');
        v.find('total-paid-seats').val('');
    },
    onBeginSelectionChange: function(view, record) {
        return;
        var selector = 'button.delete'; //$(this).removeAttr('disabled');
        var isCancel = true;
        if (record) {
            view.find(selector).removeAttr('disabled');
            if (record.StatusInfo == oTrs.cancel) {
                view.find(selector).removeClass('btn-danger').addClass('btn-success').text('Phục hồi');
                isCancel = false;
            } else {
                view.find(selector).removeClass('btn-success').addClass('btn-danger').text('Hủy');
                isCancel = true;
            }
        } else {
            view.find(selector).removeAttr('disabled');
            view.find(selector).removeClass('btn-success').addClass('btn-danger').text('Hủy');
            isCancel = this.isCancell;
        }
        this.isCancell = isCancel;
    },

    getFinalExtRow: function(arrs) {
        return vSort('Time', true, arrs);
    },

    afterUpdate: function() {
        // gọi hàm update lại giao diện đặt vé
        if ($('#bksContent').vbooking) {
            FlatObj.FTripGetTrip = false;
            $('#bksContent').vbooking("load");
        }
    },

    afterReload: function() {
       

        var me = this;

        //var $form = $('#FilterForm');
        //var $tripId = $form.find('select[name=TripId]').val();
        //var $date = $form.find('input[name=DepartureDate]').val();
        //$date = ($date.split(' ')[$date.split(' ').length - 1]);

        //if (this.reloadTimeCount == 0) {
        //    //this.reloadTimeCount++;
        //    //$('select[name=Name]').val($tripId);
        //    //$('input[name=Date]').datepicker('setDate', (vGtDtObj('00:00', $date)));
        //    //me.onDateChange(null, $date);
        //}
        //else if (this.reloadTimeCount == 1) {
        //    //this.reloadTimeCount++;
        //    //var $timeSlotIndex = $('#FilterForm').find('select[name=TimeSlot]').prop("selectedIndex");
        //    //var $timeSlotCount = $('#FilterForm').find('select[name=TimeSlot] option').size();
        //    //$('select[name=Time]').val(-$timeSlotIndex + $timeSlotCount - 1);
        //    //this._selectRowFromForm();
        //}

        me._updateSubtitle();
        me._updateRouteList();
    },
    _loadPersons: function() {
        var me = this;
        var extCf = {
            _a: 'fGetPerson',
            _c: { CompId: app.cid, IsPrgStatus: 1, Type: '($x in (2,4,5))' },
            _f: 'Id, Type, FullName, PhoneInfo'
        };
        me._listPersons = [];
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
                me._listPersons.push(model);
            },
            z: function(u, r, l, t) {
                me._listPersons = vSort('FullName', false, me._listPersons);
                me._initOptionPerson('Driver', oPst.driver);
                me._initOptionPerson('Assistant', oPst.assistant);
            }
        }, me);
    },
    /*onBeginLoadBaseData: function () {
        this._loadPersons();
    },*/
    _updateSubtitle: function () {
        
        var me = this;
        //var m = view.find('select[name=Name]').val();
        //var mText = view.find('select[name=Name] option[value="' + m + '"]').text();
        var d = me.allData? me.allData[me.o.mainModel.SumIdx][0]: [];
        var data = d? { Comps: d[0], Routes: d[1], Trips: d[2] }: {};
        var html = $.html('vTripsSumInfo', data);
        //console.log('_updateSubtitle', me.allData[me.o.mainModel.SumIdx[0]]);
        $('.gSubTitle').html(html);
    },

    _initOptionPerson: function(name, type) {
        var me = this, o = me.o, view = o.view;
        var x = vGetObj({ name: name }, gDx(o));
        x.options = [];
        var f = view.find('select[name=' + name + ']');
        f.empty();
        var lsPs = vGetArr({ Type: type }, false, me._listPersons);
        //view.find(x.ref).append('<option value="">Chọn</option>');
        $.each(lsPs, function(k, m) {
            if (vIsEstStr(m.FullName)) {
                x.options.push(m);
                $.vCheckAndAppendOptions(f, m.Id, m.FullName, 'R');
            }
        });
        f.trigger('chosen:updated');
    },
    reloadTimeCount: 0,

    checkAndSave: function(process) {
        var me = this, view = me.view;
        if (typeof _dict._blockSeatByVehicle != "undefined") {
            var m = view.find('select[name="Vehicle"]').val();
            var mText = view.find('select[name="Vehicle"] option[value="' + m + '"]').text();
            var lsBlock = [];
            if (typeof _dict._unblockSeatByVehicle != "undefined" && _dict._unblockSeatByVehicle[mText]) {
                $.each(_dict._blockSeatByVehicle, function(vi, ve) {
                    if (_dict._unblockSeatByVehicle[mText].indexOf(ve) == -1) {
                        lsBlock.push(ve);
                    };
                });
            } else {
                lsBlock = _dict._blockSeatByVehicle;
            }
            if (lsBlock.length > 0) {
                me._checkHasTicket(lsBlock, process);
            } else {
                process.call();
            }
        } else {
            process.call();
        }
    },

    //#endregion

    //#region Listeners

    onClickAddBus: function(btn, args) {
        var me = this, o = me.o, view = me.view;
        var models = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields, true);
        if (models.length >= 1) {
            vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Chuyến đã tồn tại, vui lòng chọn Bus khác' });
        } else {
            me._updateByInsert('Thêm');
        }
    },

    onClickAddTime: function(btn, args) {
        return;
        var me = this, view = me.view, time = view.find(args.inputRef).val(), isValid = me._checkInputTime(time);
        if (isValid) {
            var d = me._getD({ Time: time, StatusInfo: oTrs.add }, true);
            delete d['TotalBookedSeats'];
            delete d['TotalPaidSeats'];
            delete d['TeamInfo'];
            delete d['VehicleInfo'];
            delete d['Note'];
            me._ajaxInsert('AddTime', d, 'Thêm chuyến', function(u, r, l, t) {
                view.find('input.departure').trigger('change');
                me._reloadMainData("New");
                if ($('#bksContent').vbooking) {
                    // gọi hàm update lại giao diện đặt vé
                    FlatObj.FTripGetTrip = false;
                    $('#bksContent').vbooking("load");
                }
            });
        }
    },

    onRunTimeChange: function(w, x, e) {
        this._selectRowFromForm();
    },

    onAliasChange: function(w, x, e) {
        var me = this, o = me.o, view = me.view;
        me._selectRowFromForm();
        var models = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields, true);
        if (models.length < 1) {
            models = me._getMatchedRecords(me.baseDetailModels, o.keyFields, false, o.finalKeyFields, true);
        }
        if (models.length >= 1) {
            view.find('button.addBus').prop('disabled', true);
        } else {
            view.find('button.addBus').prop('disabled', false);
        }
    },

    onClosedStatusChange: function(w, x, e) {
        var v = x.val();
        //console.log(typeof(rights));
        if (v == 1) {
            if (app.rights.indexOf($.rights.mTrip_eiad.val) == -1) {
                $('.form-control.vehicle').prop('disabled', true);
                $('.form-control.Driver').prop('disabled', true);
                $('.form-control.Assistant').prop('disabled', true);
                $('.mt5 button.multiselect.dropdown-toggle.btn.btn-default').prop('disabled', true);
            }
            //$('.row.mt5 strong.lblClosedStatus').text("Đã xuất bến");
        } else {
            //$('.row.mt5 strong.lblClosedStatus').text('');
        }
    },

    getData: function(model) {
        return model;
        var s = oTrs.cancel;
        if (model.StatusInfo == oTrs.cancel) {
            s = oTrs.reactive;
        }
        return { _d: { StatusInfo: s }, isUndel: s != oTrs.cancel };
    },

    onClickBtnCancel: function(btn, args) {
        return;
        var me = this, o = me.o, id = '';
        if (me.model) id = me.model['Id'];
        var d = {};
        if (id) {
            var dd = me.getData(me.model);
            me._checkBeforeDelete(dd.isUndel, function() {
                if (id.indexOf) {
                    d = me._getD({ StatusInfo: oTrs.cancel });
                    me._ajaxInsert(o.insertAction, d, 'Hủy ' + o.name.toLocaleLowerCase(), function(u, r, l, t) {
                        me._reloadMainData("New");
                        if (o.afterUpdate) o.afterUpdate.call(o);
                    });
                } else {
                    var msgSucc = dd.isUndel ? "Phục hồi thành công." : "Hủy thành công.";
                    var msgErr = dd.isUndel ? "Phục hồi thất bại, vui lòng thử lại sau." : "Hủy thất bại, vui lòng kiểm thử lại sau.";
                    d = dd._d;
                    me._ajaxUpdate(id, d, dd.isUndel, function(u, r, l, t) {
                        if (o.afterUpdate) {
                            o.afterUpdate.call(o);
                        }
                    }, msgSucc, msgErr);
                }
            });
        } else vv.showMessage({ element: me.view.find('.alert.message'), type: 'alert-danger', content: 'Vui lòng chọn ' + o.name });
    },

    onVehicleChange: function(w, x, e) {
        $('body').find('select.vehicle').trigger('chosen:updated');
    },
    //#endregion

    //#region Converters
    gDisDate: function (data) {
        var v = data.record.Date ? data.record.Date : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },


    gDisFare: function(data) {
       /* var frA = data.record.FromArea;
        var toA = data.record.ToArea;
        var fObj = vGas(frA)[0];
        var tObj = vGas(toA)[0];
        var areas = [fObj, tObj];
        var x = vGfs(areas, data.record.FareInfo)[0];
        var val = x ? x['Fare'] : '';
        //return vGpp(data.record.FareInfo, 'Price');
        return val;*/
        var v = data.record.MasterFare ? data.record.MasterFare : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisComp: function (data) {
        var v = data.record.CompIdName ? data.record.CompIdName : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisName: function (data) {
        if (data.record.Type == 1) return getMasterCellFormat(data.record.Name);
        return data.record.Name;
    },

    gDisTime: function (data) {
        var v = data.record.Time ? data.record.Time : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisFareKM: function (data) {
        var v = (data.record.VxrMasterFare?data.record.VxrMasterFare:'') + (data.record.VxrDiscount?(' (-' +data.record.VxrDiscount+ '%)'): '');
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisVBookingText: function (data) {
        var v = data.record.VBookingText ? data.record.VBookingText : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisVPaymentText: function (data) {
        var v = data.record.VPaymentText ? data.record.VPaymentText : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisVAppText: function (data) {
        var v = data.record.VAppText ? data.record.VAppText : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisNo: function (data) {
        var v = data.record.No ? data.record.No : '';
        if (data.record.Type == 1) return getMasterCellFormat(v);
        return v;
    },

    gDisVxrFareInfo: function(data) {
        if (!data.record.VxrFareInfo) return '';
        var dc = data.record.VxrDiscount;
        var frA = data.record.FromArea;
        var toA = data.record.ToArea;
        var fObj = vGas(frA)[0];
        var tObj = vGas(toA)[0];
        var areas = [fObj, tObj];
        var x = vGfs(areas, data.record.VxrFareInfo)[0];
        var val = x ? x['Fare'] : '';
        //return vGpp(data.record.FareInfo, 'Price');
        return dc ? val + (' (-' + dc + '%)') : val;
    },

    gDisVxrDiscount: function(data) {
        return data.record.VxrDiscount ? data.record.VxrDiscount + '%' : '';
    },

    gDisVBookingConfig: function(data) {
        var v = data.record.VBookingConfig;
        if (!v) return '';
        var r = "";
        var s = v.toString(2);
        if (s.length == 3) s = "0" + s;
        var arr = s.split('');
        if (arr[0] == '1') r = r + "/WEB";
        if (arr[1] == '1') r = r + "/ĐLY";
        if (arr[2] == '1') r = r + "/WID";
        if (arr[3] == '1') r = r + "/AFF";
        return r.substring(1);
    },

    gDisVPaymentConfig: function(data) {
        var v = data.record.VPaymentConfig;
        if (!v) return '';
        var r = "";
        var s = v.toString(2);
        if (s.length == 2) s = "0" + s;
        var arr = s.split('');
        if (arr[0] == '1') r = r + "/OLI";
        if (arr[1] == '1') r = r + "/COD";
        if (arr[2] == '1') r = r + "/ĐLY";
        return r.substring(1);
    },

    gDisClosedStatus: function(data) {
        //console.log(data.record);
        if (!data.record.ClosedStatus)
            return '---';
        else return 'Đã xuất bến';

    },

    gDisVehicle: function(data) {
        if (data.record.VehicleInfo) {
            return vGvp(data.record.VehicleInfo, 'LicensePlate');
        }
        return '';
    },
    //update
    //gDisVehicle: function (data)
    //{
    //    return vGvp(data.record.VehicleInfo, 'LicensePlate');
    //},

    gDisTeam: function(data) {
        var s = "", a = vGtmp(data.record.TeamInfo, oPst.assistant), d = vGtmp(data.record.TeamInfo, oPst.driver), g = vGtmp(data.record.TeamInfo, oPst.guide); //assistant
        if (d) {
            s = ", T: " + d;
        }
        if (a) {
            s = s + ", L: " + a;
        }
        if (g) {
            s = s + ", G: " + g;
        }
        return s.substring(1);
    },

    gDisStatusInfo: function(data) {
        var s = data.record.StatusInfo;
        return vGTrds(s);
    },
    gDisAction: function (data) {

        //var tripId = data.record.BaseId;
        var tripId = data.record.Id;
        var type = data.record.Type;
        var baseId = (type == 1)? data.record.Id: data.record.BaseId;
        var date = data.record.Date;
        var time = data.record.Time;
        var compId = data.record.CompId;
        var d = '{Type: \'Trip\', Id: ' + tripId + ', Date: \'' + date + '\', Time: \'' + time + '\', BaseId: ' + baseId + ', CompId: ' + compId + '}';
        var fx = '$(\'body\').mask(\'Loading...\');  var c = $.getModuleConfig(\'MTicConf\'); $.loadModule(c, '+d+', function () { $(\'body\').unmask(); });';
        var html = '<button class="btn btn-success btn-sm" onclick="event.preventDefault();'+fx+'">Cấu hình</button>';
        return html;
    },
    gDisDriver: function(data) {
        return vGtmp(data.record.TeamInfo, oPst.driver);
    },

    gDisAid: function(data) {
        return vGtmp(data.record.TeamInfo, oPst.assistant);
    },

    gDisGuide: function(data) {
        return vGtmp(data.record.TeamInfo, oPst.guide);
    },
    gDisSeatStatus: function(data) {
        var tBkS = data.record.TotalBookedSeats;
        var tPdS = data.record.TotalPaidSeats;
        tBkS = vIsEstStr(tBkS) ? tBkS : 0;
        tPdS = vIsEstStr(tPdS) ? tPdS : 0;
        var fS = parseInt(data.record.SeatTemplateInfo.split('|')[2]) - parseInt(tBkS) - parseInt(tPdS);
        var html = tBkS + ' -- ' + tPdS + ' -- ' + fS;
        return html;
    },
    gDisTripStatus: function(data) {
        var r = data.record;
        if (r.ClosedStatus == 1) {
            return "Xuất bến";
        }
        if (r.ClosedStatus == 2) {
            return "Chốt phơi";
        }
        switch (r.StatusInfo) {
        case 2:
            return "Tăng cường";
        case 3:
            return "Hủy";
        default:
            return "--";
        };
    },


    svcDate: function(x, v) {
        return vSaveDate(v);
    },

    svcTime: function(x, v) {
        /// <summary>
        /// Time save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        var arr = v.split('-');
        if (arr && arr[0]) {
            return arr[0].trim();
        }
        return '';
    },

    svcStpl: function(x, v) {
        /// <summary>
        /// SeatTemplate save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        return v + '~' + vFindById(v, x.options).Info;
    },

    svcFI: function(x, v) {
        /// <summary>
        /// FareInfo save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        var w = this.view;
        var fromArea = w.find('input.from-area').val();
        var toArea = w.find('input.to-area').val();
        return "1~" + vGai(fromArea) + "|" + vGai(toArea) + "|" + parseInt(v.replace(/\./g, '') + "|đ||");
    },

    svcXB: function(x, v) {
        /// <summary>
        /// Xuat ben (ClosedStatus) save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        if (typeof v == 'undefined' || !v) return 0;
        else {
            return 1;
        }
    },

    svcVhc: function(x, v) {
        /// <summary>
        /// Vehiclde save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        var m = vFindById(v, x.options);
        if (m) {
            var s = vGvs(m.Id, m.Type, m.LicensePlate, m.VehicleTypeName);
            return s;
        }
        return '';
    },

    svcVhcI: function(x, v, b) {
        /// <summary>
        /// VehicldeInfo save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        return b['Vehicle'];
    },

    svcTI: function(x, v, b) {
        /// <summary>
        /// TeamInfo save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        var s = app.mvs, afterS = s;
        $.each(b, function(k, vl) {
            if (vl) {
                s = s + '~' + vl;
            }
        });
        if (afterS != s) {
            return s;
        }
        return '';
    },

    svcSI: function(x, v, b) {
        /// <summary>
        /// StatusInfo save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        if (v == oTrs.cancel) {
            return v;
        }
        if (b) {
            var base = b['Base'];
            var time = b['Time'];
            if (base && base.Info.indexOf(time) >= 0) {
                return oTrs.normal;
            }
        }
        return oTrs.add;
    },

    svcMem: function(x, v, b) {
        /// <summary>
        /// Person / Member (Driver, Aid, Guide) save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        if (!b || jQuery.isEmptyObject(b)) return '';
        var s = '';
        $.each(b, function(id, vl) {
            if (vl) s += '~' + vGpi(x.mType, id, vl.FullName, vl.PhoneInfo);
        });
        return s.substring(1);
    },

    rvcStpl: function(x, v) {
        /// <summary>
        /// SeatTemplate read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        return vGtp(v, 'Id');
    },

    rvcVhc: function(x, v) {
        /// <summary>
        /// Vehicle read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        return vGvp(v, 'Id');
    },

    rvcMem: function(x, v) {
        /// <summary>
        /// Driver, Aid, Guide read converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        return vGtmp(v, x.mType, true);
    },

    rvcFI: function(x, v) {
        /// <summary>
        /// FareInfo read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        return vGfa(v);
    },

    cpcDate: function(x, b, f) {
        /// <summary>
        /// Date copy from base converter
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="b">Base value</param>
        /// <param name="f">Form value</param>
        return f;
    },

    cpcAlias: function(x, b, f) {
        /// <summary>
        /// Alias copy from base converter
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="b">Base value</param>
        /// <param name="f">Form value</param>
        return 0;
    },

    cpcSI: function(x, b, f) {
        /// <summary>
        /// Status Info copy from base converter
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="b">Base value</param>
        /// <param name="f">Form value</param>
        return oTrs.waiting;
    },

    svbMem: function(x, v) {
        /// <summary>
        /// Member (Person, Driver, Aid) search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return vGetSearchCondt(v);
    },

    svbTime: function(x, v) {
        /// <summary>
        /// Time search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        var arr = v.split('-');
        if (arr && arr[0]) {
            return arr[0].trim();
        }
        return '';
    },

    svbStpl: function(x, v) {
        /// <summary>
        /// SeatTemplate search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "$x like '" + v + "~%'";
    },

    svbFare: function(x, v) {
        /// <summary>
        /// Fare search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "1|" + parseInt(v.replace(/\./g, '')) + "";
    },

    svbVhc: function(x, v) {
        /// <summary>
        /// Vehicle search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "$x like '" + app.mvs + "~" + v + "|%'";
    },

    svbNote: function(x, v) {
        /// <summary>
        /// Note search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "$x like '%" + v + "%'";
    },

    xchrTime: function(x, b) {
        return b.split('~');
    },

    xchvTime: function(b, m) {
        /// <summary>
        /// Get arr from base info
        /// </summary>
        /// <param name="b">Base model</param>
        /// <param name="m">Main model</param>
        var ar = [], ab = {}, am = {};
        if (b && b.Info) {
            $.each(b.Info.split('~'), function(i, time) {
                if (time.indexOf(':') > 0) {
                    ab[time] = true;
                    ar.push(time);
                }
            });
        };
        $.each(m, function(i, r) {
            var time = r.Time;
            if (!ab[time]) {
                if (!am[time]) {
                    am[time] = true;
                    time = time + ' - Tăng cường';
                    ar.push(time);
                }
            } else {
                var s = '';
                var status = r.StatusInfo;
                if (status == oTrs.cancel) {
                    s = ' - Hủy';
                }
                var idx = ar.indexOf(time);
                ar[idx] = time + s;
            }
        });
        return vSort(null, true, ar);;
    },

    listConfigRouteNameCb: function(o, x, models) {
        console.log('listConfigRouteNameCb');
        var me = this;

        $('#' + o.gId).mask('Loading..........');
        me.listBase = [];

        $.each(models, function(i, model) {
            me.listBase.push(model);
        });

        this._reloadTrips();

    },

    //Override
    _getAjaxConfig: function(c) {
        var me = this, o = me.o;
        var fc = {};
        if (o.queryConditions) $.each(o.queryConditions, function(name, val) { fc[name] = val; });
        if (c) $.each(c, function(name, val) { fc[name] = val; });
        //console.log('_getAjaxConfig', fc);
        var ajax = { _a: o.queryAction, _c: fc, _f: me._getQueryFields() };
        return ajax;
    },

    _reloadTrips: function(d, cb) {
        var me = this;
        $('#' + me.o.gId).mask('Loading..........');
        var date = me.view.find('.xDate').val();
        var c = d ? d : { yDate: vSaveDate(date ? date : vGetNow()) };
        //me.isBegin = true;
        me._reload(c);
        if (cb) cb.call(me);
    },

    _applyCDate: function(c) {
        var me = this;
        if (!c) c = {};
        var val = me.view.find('.xDate').val();
        if (!val) return c;
        c['yDate'] = vSaveDate(val);
        return c;
    },

    _applyCComp: function(c) {
        var me = this;
        if (!c) c = {};
        var compIds = me.view.find('select.compId').val();
        if (!compIds) return c;
        if (compIds.length == 1) c['compId'] = compIds[0];
        if (compIds.length > 1) c['compIds'] = compIds.join();
        return c;
    },


    _applyCComp2: function(c) {
        var me = this;
        if (!c) c = {};
        var compIds = me.view.find('select.compId').val();
        if (!compIds) return c;
        if (compIds.length == 1) c['CompId'] = compIds[0];
        if (compIds.length > 1) c['CompId'] = '$x in (' + compIds.join() + ')';
        return c;
    },

    _applyCRoute: function(c) {
        var me = this;
        if (!c) c = {};
        var rids = me.view.find('select.route').val();
        if (!rids) return me._applyCComp(c);
        if (rids.length == 1) c['routeId'] = rids[0];
        if (rids.length > 1) c['routeIds'] = rids.join();
        return c;
    },

    _applyCBookingConfig: function(c) {
        var me = this;
        if (!c) c = {};
        var arr = [0, 0, 0, 0];
        var cfgs = me.view.find('select.vBookingConfig').val();
        if (!cfgs) {
            //me.view.find('select.compId').trigger('change');
            return c;
        }
        if (cfgs.length >= 1) {
            $.each(cfgs, function(i, v) {arr[parseInt(v)] = 1;});
            var num = parseInt(vJoin(arr.reverse()), 2);
            c['vBookingConfig'] = num;
        }
        return c;
    },

    _applyCPaymentConfig: function (c) {
        var me = this;
        if (!c) c = {};
        var arr = [0, 0, 0];
        var cfgs = me.view.find('select.vPaymentConfig').val();
        if (!cfgs) {
            //me.view.find('select.compId').trigger('change');
            return c;
        }
        if (cfgs.length >= 1) {
            $.each(cfgs, function (i, v) { arr[parseInt(v)] = 1; });
            var num = parseInt(vJoin(arr.reverse()), 2);
            c['vPaymentConfig'] = num;
        }
        return c;
    },

    _applyCAppConfig: function (c) {
        var me = this;
        if (!c) c = {};
        var arr = [0, 0, 0];
        var cfgs = me.view.find('select.vAppConfig').val();
        if (cfgs == 7) {
            c['compType'] = cfgs;
            return c;
        }
        if (!cfgs) {
            //me.view.find('select.compId').trigger('change');
            return c;
        }
        if (cfgs.length >= 1) {
            $.each(cfgs, function(i, v) { arr[parseInt(v)] = 1; });
            var num = parseInt(vJoin(arr.reverse()), 2);
           
            c['compType'] = num;
        } else {
            /*var routeIds = me.view.find('select.route').val();
            var compIds = me.view.find('select.compId').val();
            var compCfgs = me.view.find('select.vAppConfig').val();
            if ((compIds || routeIds) && !compCfgs) c.compType = null;*/
        }
        return c;
    },

    onCompIdChange: function(w, x, e) {
        //console.log('onCompIdChange', compIds);
        var me = this, c = {};
        c = me._applyCDate(c);
        c = me._applyCComp(c);
        var compIds = x.val();
        var routeIds = me.view.find('select.route').val();
        var compCfgs = me.view.find('select.vAppConfig').val();
        if ((compIds || routeIds) && !compCfgs) c.compType = null;
        me._reloadTrips(c);
        if (compIds) {
            me._stopRouteTrigger = true;
            me._loadCbb('Name', me._applyCComp2(), function() {
                //console.log('routes loaded by compids: ', compIds);
                me._stopRouteTrigger = false;
            });
        } else {

        }
    },

    onRouteIdChange: function (w, x, e) {
        console.log('onRouteIdChange', x.val());
        var me = this, c = {};
        if (me._stopRouteTrigger) {
            me._stopRouteTrigger = false;
            return;
        }
        c = me._applyCComp(c);
        c = me._applyCRoute(c);
        c = me._applyCDate(c);
        var routeIds = x.val();
        var compIds = me.view.find('select.compId').val();
        var compCfgs = me.view.find('select.vAppConfig').val();
        if ((compIds || routeIds) && !compCfgs) c.compType = null;
        me._reloadTrips(c);
    },

    onDateChange: function(item, val) {
        //console.log('onDateChange', val);
        var me = this, c = {};
        c = me._applyCDate(c);
        c = me._applyCComp(c);
        c = me._applyCRoute(c);
        var routeIds = me.view.find('select.route').val();
        var compIds = me.view.find('select.compId').val();
        var compCfgs = me.view.find('select.vAppConfig').val();
        if ((compIds || routeIds) && !compCfgs) c.compType = null;
        me._reloadTrips(c);
    },

    onVBookingConfigChange: function(w, x, e) {
        var me = this, c = {};
        //_applyCBookingConfig
        c = me._applyCBookingConfig(c);
        c = me._applyCDate(c);
        c = me._applyCComp(c);
        c = me._applyCRoute(c);
        var routeIds = me.view.find('select.route').val();
        var compIds = me.view.find('select.compId').val();
        var compCfgs = me.view.find('select.vAppConfig').val();
        if ((compIds || routeIds) && !compCfgs) c.compType = null;
        me._reloadTrips(c);
        //console.log('onVBookingConfigChange');
    },

    onVPaymentConfigChange: function (w, x, e) {
        var me = this, c = {};
        c = me._applyCPaymentConfig(c);
        c = me._applyCDate(c);
        c = me._applyCComp(c);
        c = me._applyCRoute(c);
        var routeIds = me.view.find('select.route').val();
        var compIds = me.view.find('select.compId').val();
        var compCfgs = me.view.find('select.vAppConfig').val();
        if ((compIds || routeIds) && !compCfgs) c.compType = null;
        me._reloadTrips(c);
        //console.log('onVPaymentConfigChange');
    },

    onVAppConfigChange: function() {
        var me = this, c = {};
        c = me._applyCAppConfig(c);
        c = me._applyCDate(c);
        c = me._applyCComp(c);
        c = me._applyCRoute(c);
        var routeIds = me.view.find('select.route').val();
        var compIds = me.view.find('select.compId').val();
        var compCfgs = me.view.find('select.vAppConfig').val();
        if ((compIds || routeIds) && !compCfgs) c.compType = null;
        me._reloadTrips(c);
        //console.log('onVAppConfigChange');
    },

    onVMLoaded: function() {
        var me = this;
        me.onDateChange();
        me.view.find('select.vAppConfig').val(7);
        $(".zRouteName").unbind('keyup').keyup(function (e) {
            if (e.which === 13) {
                var keyWord = $(".zRouteName").find('input').val();
                var arr = keyWord.split('/');
                var date = me.view.find('.xDate').val();
                var c = { compType: null, yDate: vSaveDate(date ? date : vGetNow()) };
                if (arr[0]) c.fromAreaTxt = arr[0];
                if (arr.length > 1 && arr[1]) c.toAreaTxt = arr[1];
               // else c.toAreaTxt = arr[0];
                //c = me._applyCComp(c);
                //c = me._applyCRoute(c);
                //c = me._applyCDate(c);
                c = me._applyCBookingConfig(c);
                c = me._applyCPaymentConfig(c);
                //c = me._applyCAppConfig(c);
                me._stopRouteTrigger = true;
                me._reloadTrips(c);
            }
        });
    },

    _updateRouteList: function () {
        var me = this;
        var compIds = me.view.find('select.compId').val();
        if (compIds) return;
        var rids = me.view.find('select.route').val();
        if (rids) return;
        var x = vGetObj({ name: 'Name' }, gDx(me.o));
        x.local = true;
        x.options = me.advModels[2];
        x.valField = 'Id',
        x.displayField = 'Name',
        me._loadCbb('Name', null, function() {
            x.local = false;
            x.valField = 'BaseId';
            x.displayField = 'Name';
        });
    },

    _stopRouteTrigger: false

    //#endregion

});
