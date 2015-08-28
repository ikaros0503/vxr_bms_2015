define({
    _escapeSearchString: function (text) {
        return text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/Đ/g, "D").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i");
    },

    //#region Private Methods
    _reloadTrips: function (d, cb) {
        var me = this;
        me._reloadMainData(me.model ? me.model.Id : null, null, null, d);
        if (cb) cb.call(me);
    },

    getTripDate: function (cf, obj) {
        var time = obj.Time;
        var date = obj.Date;
        return vAddTime(time, date);
    },

    _checkBeforeDelete: function (isUndel, cb) {
        var me = this, o = me.o, view = me.view;
        if (isUndel) {
            if (cb) {
                cb.call(me);
                return;
            }
        }
        var ccf = o.checkDelConditions;
        var c = vCloneObj(ccf._c);
        $.each(c, function (k, v) {
            if (v == '$base') c[k] = me._getBaseModel().Id;
            else if (v.indexOf && v.indexOf('$') == 0) {
                var name = v.substring(1);
                me._applyCondition(gDx(o), name, c, k);
            } else if (v.params && v.get) {
                var pFields = v.params.split(',');
                var obj = {};
                $.each(pFields, function (idx, p) {
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
            z: function (u, r, l, t) {
                if (!l) {
                    if (cb) cb.call(me);
                } else {
                    var msg = ccf.existMsg.replace('{$x}', l);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: msg });
                }
            }
        }, me, view);
    },

    _checkInputTime: function (t) {
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

    _checkHasTicket: function (listBlockSeat, cb) {
        var me = this, o = me.o, view = me.view;
        var ccf = o.checkHasTicket;
        var c = vCloneObj(ccf._c);
        $.each(c, function (k, v) {
            if (v == '$base') {
                c[k] = me._getBaseModel().Id;
            } else if (v.indexOf && v.indexOf('$') == 0) {
                var name = v.substring(1);
                me._applyCondition(gDx(o), name, c, k);

            } else if (v.params && v.get) {
                var pFields = v.params.split(',');
                var obj = {};
                $.each(pFields, function (idx, p) {
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
            z: function (u, r, l, t) {
                if (l) {
                    var res = r;
                    var isCont = true;
                    $.each(res, function (ki, kl) {
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
    onItemLoaded: function (r) {
        var v = this.o.view;
        v.find('total-booked-seats').val(r.TotalBookedSeats);
        v.find('total-paid-seats').val(r.TotalPaidSeats);
    },
    onAfterUnloadItem: function () {
        var v = this.o.view;
        v.find('total-booked-seats').val('');
        v.find('total-paid-seats').val('');
    },
    onBeginSelectionChange: function (view, record) {

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

    getFinalExtRow: function (arrs) {
        return vSort('Time', true, arrs);
    },

    afterUpdate: function () {
        // gọi hàm update lại giao diện đặt vé
        if ($('#bksContent').vbooking) {
            FlatObj.FTripGetTrip = false;
            $('#bksContent').vbooking("load");
        }
    },
    onBeginFirstLoad: function () {
        $('input[name=Date]').datepicker('setDate', new Date(moment(app.cDate).format('YYYY-MM-DD')));
    },
    afterReload: function () {
        //vbv('clickdatve', function (e, trip, date, time) {
        vbv('clickdatve', function (e) {
            e.preventDefault();
            $('.dialog-config').find('button.close').trigger('click');
            var o = {
                d: moment(e.d.tripDate, 'DD-MM-YYYY').format('DD.MM.YYYY'),
                t: parseInt(e.d.tripId),
                h: moment(e.d.tripTime, 'HH:mm').format('HH.mm')
            };
            vdc.gD(o, function () {
                vbf('rlBKS', { o: { data: o } });
            });
            //$('select[name=TripId]').val(e.d.tripId).trigger('change');
            //$('input[name=DepartureDate]').datepicker('setDate', vPrsDt(e.d.tripDate));
            //$('select[name=TimeSlot]').val(e.d.tripTime).trigger('change');
            //$('.dialog-config').find('button.close').trigger('click');
        });

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
    },
    _loadPersons: function () {
        var me = this;
        var extCf = {
            _a: 'fGetPerson',
            _c: { CompId: app.cid, IsPrgStatus: 1, Type: '($x in (2,4,5))' },
            _f: 'Id, Type, FullName, PhoneInfo'
        };
        me._listPersons = [];
        var fCArr = extCf['_f'].split(',');
        vRql(extCf, {
            a: function (u, r, l, t) {
            },
            m: function (i, d) {
                var model = {};
                $.each(fCArr, function (j, v) {
                    v = v.trim();
                    model[v] = d[j];
                });
                me._listPersons.push(model);
            },
            z: function (u, r, l, t) {
                me._listPersons = vSort('FullName', false, me._listPersons);
                me._initOptionPerson('Driver', oPst.driver);
                me._initOptionPerson('Assistant', oPst.assistant);
            }
        }, me);
    },
    onBeginLoadBaseData: function () {
        this._loadPersons();
    },
    _updateSubtitle: function () {
        var view = this.o.view;
        var m = view.find('select[name=Name]').val();
        var mText = view.find('select[name=Name] option[value="' + m + '"]').text();
        $('.gSubTitle').html('Tuyến: <b>' + mText + '</b> - Ngày: <b>' + $('input[name=Date]').val() + '</b>');
    },
    _initOptionPerson: function (name, type) {
        var me = this, o = me.o, view = o.view;
        var x = vGetObj({ name: name }, gDx(o));
        if (!x) return;
        x.options = [];
        var f = view.find('select[name=' + name + ']');
        f.empty();
        var lsPs = vGetArr({ Type: type }, false, me._listPersons);
        //view.find(x.ref).append('<option value="">Chọn</option>');

        $.each(lsPs, function (k, m) {
            if (vIsEstStr(m.FullName)) {
                x.options.push(m);
                $.vCheckAndAppendOptions(f, m.Id, m.FullName, 'R');
            }
        });
        f.trigger('chosen:updated');
    },
    reloadTimeCount: 0,

    checkAndSave: function (process) {
        var me = this, view = me.view;
        if (typeof _dict._blockSeatByVehicle != "undefined") {
            var m = view.find('select[name="Vehicle"]').val();
            var mText = view.find('select[name="Vehicle"] option[value="' + m + '"]').text();
            var lsBlock = [];
            if (typeof _dict._unblockSeatByVehicle != "undefined" && _dict._unblockSeatByVehicle[mText]) {
                $.each(_dict._blockSeatByVehicle, function (vi, ve) {
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

    onVMLoaded: function () {
        var me = this;
        var isLoaded = false;


        $(document).ajaxStop(function () {
            if (!isLoaded) {
                me._selectRowFromForm();
                isLoaded = true;

            }
        });
    },

    /* onVMLoaded: function () {
         var me = this;
         var isLoaded = false;
         $(document).ajaxStop(function () {
             if (!isLoaded) {
                 $('body').find('select.Driver').parent().find('ul').prepend($('<div \>').css('padding', '4px 5px').on('click', function () { return false; })
                     .append($('<input type="text" placeholder="Tìm tài xế"/>').css('border-radius', '4px').css('padding', '2px').on('keyup', function () {
                         var key = me._escapeSearchString($(this).val().toLowerCase());
                         var Drivers = $('body').find('select.Driver').parent().find('ul li');
                         $.each(Drivers, function (_, driver) {
                             var name = me._escapeSearchString($(driver).find('label').text().toLowerCase());
 
                             if (name.match(key) || $(driver).hasClass('active')) {
                                 $(driver).css('display', 'block');
                             }
                             else {
                                 $(driver).css('display', 'none');
                             }
                         });
                     })));
                 $('body').find('select.Assistant').parent().find('ul').prepend($('<div \>').css('padding', '4px 5px').on('click', function () { return false; })
                     .append($('<input type="text" placeholder="Tìm phục vụ"/>').css('border-radius', '4px').css('padding', '2px').on('keyup', function () {
                         var key = me._escapeSearchString($(this).val().toLowerCase());
                         var Drivers = $('body').find('select.Assistant').parent().find('ul li');
                         $.each(Drivers, function (_, driver) {
                             var name = me._escapeSearchString($(driver).find('label').text().toLowerCase());
 
                             if (name.match(key) || $(driver).hasClass('active')) {
                                 $(driver).css('display', 'block');
                             }
                             else {
                                 $(driver).css('display', 'none');
                             }
                         });
                     })));
                 $('body').find('select.vehicle').chosen({ width: "100%",  search_contains = true; });
                 me._selectRowFromForm();
                 isLoaded = true;
             }
         });
     },*/
    //#endregion

    //#region Listeners

    onClickAddBus: function (btn, args) {
        var me = this, o = me.o, view = me.view;
        var models = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields, true);
        if (models.length >= 1) {
            vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Chuyến đã tồn tại, vui lòng chọn Bus khác' });
        } else {
            me._updateByInsert('Thêm');
        }
    },

    onClickAddTime: function (btn, args) {
        var me = this, view = me.view, time = view.find(args.inputRef).val(), isValid = me._checkInputTime(time);
        if (isValid) {
            var d = me._getD({ Time: time, StatusInfo: oTrs.add }, true);
            delete d['TotalBookedSeats'];
            delete d['TotalPaidSeats'];
            delete d['TeamInfo'];
            delete d['VehicleInfo'];
            delete d['Note'];
            me._ajaxInsert('AddTime', d, 'Thêm chuyến', function (u, r, l, t) {
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

    onDateChange: function (item, val) {
        var me = this;
        me.noLoadForm = true;

        me._reloadTrips({ Date: val });

    },

    onBaseIdChange: function (w, x, e) {
        this._reloadTrips();
    },

    onRunTimeChange: function (w, x, e) {
        this._selectRowFromForm();
    },

    onAliasChange: function (w, x, e) {
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

    onClosedStatusChange: function (w, x, e) {
        var v = x.val();
        if (v == 1) {
            if (app.rights.indexOf($.rights.mTrip_eiad.val) == -1) {
                $('.form-control.Vehicle').prop('disabled', true).trigger("chosen:updated");
                $('.form-control.Driver').prop('disabled', true).trigger("chosen:updated");
                $('.form-control.Assistant').prop('disabled', true).trigger("chosen:updated");
                $('.mt5 button.multiselect.dropdown-toggle.btn.btn-default').prop('disabled', true).trigger("chosen:updated");
            }
            //$('.row.mt5 strong.lblClosedStatus').text("Đã xuất bến");
        } else {
            //$('.row.mt5 strong.lblClosedStatus').text('');
        }
    },

    getData: function (model) {
        var s = oTrs.cancel;
        if (model.StatusInfo == oTrs.cancel) {
            s = oTrs.reactive;
        }
        return { _d: { StatusInfo: s }, isUndel: s != oTrs.cancel };
    },

    onClickBtnCancel: function (btn, args) {
        var me = this, o = me.o, id = '';
        if (me.model) id = me.model['Id'];
        var d = {};
        if (id) {
            var dd = me.getData(me.model);
            me._checkBeforeDelete(dd.isUndel, function () {
                if (id.indexOf) {
                    d = me._getD({ StatusInfo: oTrs.cancel });
                    me._ajaxInsert(o.insertAction, d, 'Hủy ' + o.name.toLocaleLowerCase(), function (u, r, l, t) {
                        me._reloadMainData("New");
                        if (o.afterUpdate) o.afterUpdate.call(o);
                    });
                } else {
                    var msgSucc = dd.isUndel ? "Phục hồi thành công." : "Hủy thành công.";
                    var msgErr = dd.isUndel ? "Phục hồi thất bại, vui lòng thử lại sau." : "Hủy thất bại, vui lòng kiểm thử lại sau.";
                    d = dd._d;
                    me._ajaxUpdate(id, d, dd.isUndel, function (u, r, l, t) {
                        if (o.afterUpdate) {
                            o.afterUpdate.call(o);
                        }
                    }, msgSucc, msgErr);
                }
            });
        } else vv.showMessage({ element: me.view.find('.alert.message'), type: 'alert-danger', content: 'Vui lòng chọn ' + o.name });
    },

    onVehicleChange: function (w, x, e) {
        $('body').find('select.vehicle').trigger('chosen:updated');
    },
    //#endregion

    //#region Converters
    gDisDate: function (data) {
        return data.record.Date;
    },

    gDisStpl: function (data) {
        var arr = this.cf.options;
        var result = "";
        var id = vGtp(data.record.SeatTemplateInfo, 'Id');
        var obj = _.where(arr, { Id: id });
        if (obj[0]) {
            result = obj[0].Name;
        }
        return result;
    },

    gDisFare: function (data) {
        //getSeatPriceProperty2
        return vGpp(data.record.FareInfo, 'Price');
    },

    gDisClosedStatus: function (data) {
        //console.log(data.record);
        if (!data.record.ClosedStatus)
            return '---';
        else return 'Đã xuất bến';

    },

    gDisVehicle: function (data) {
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

    gDisTeam: function (data) {
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

    gDisStatusInfo: function (data) {
        var s = data.record.StatusInfo;
        return vGTrds(s);
    },
    gDisAction: function (data) {
        var tripId = data.record.BaseId;
        var date = data.record.Date;
        var time = data.record.Time;
        //var html = '<button class="btn btn-success btn-sm" onclick="event.preventDefault(); $(\'body\').trigger(\'clickdatve\',[\'' + tripId + '\',\'' + date + '\',\'' + time + '\'])">Đặt vé</button>';
        var html = '<button class="btn btn-success btn-sm" onclick="event.preventDefault(); vbf(\'clickdatve\',{tripId:\'' + tripId + '\',tripDate:\'' + date + '\',tripTime:\'' + time + '\'})">Đặt vé</button>';
        return html;
    },
    gDisDriver: function (data) {
        return vGtmp(data.record.TeamInfo, oPst.driver);
    },

    gDisAid: function (data) {
        return vGtmp(data.record.TeamInfo, oPst.assistant);
    },

    gDisGuide: function (data) {
        return vGtmp(data.record.TeamInfo, oPst.guide);
    },
    gDisSeatStatus: function (data) {
        var tBkS = data.record.TotalBookedSeats;
        var tPdS = data.record.TotalPaidSeats;
        tBkS = vIsEstStr(tBkS) ? tBkS : 0;
        tPdS = vIsEstStr(tPdS) ? tPdS : 0;
        var fS = parseInt(data.record.SeatTemplateInfo.split('|')[2]) - parseInt(tBkS) - parseInt(tPdS);
        var html = tBkS + ' -- ' + tPdS + ' -- ' + fS;
        return html;
    },
    gDisTripStatus: function (data) {
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
    svcTime: function (x, v) {
        /// <summary>
        /// Time save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        var arr = v.split('-');
        if (arr && arr[0]) { return arr[0].trim(); }
        return '';
    },

    svcStpl: function (x, v) {
        /// <summary>
        /// SeatTemplate save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>

        return v + '~' + vFindById(v, x.options).Info;
    },
    svcDi: function (x, v) {
        /// <summary>
        /// SeatTemplate save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        return v + '~' + vFindById(v, x.options).Info;
    },

    svcFI: function (x, v) {
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

    svcXB: function (x, v) {
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

    svcVhc: function (x, v) {
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

    svcVhcI: function (x, v, b) {
        /// <summary>
        /// VehicldeInfo save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        return b['Vehicle'];
    },

    svcTI: function (x, v, b) {
        /// <summary>
        /// TeamInfo save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        var s = app.mvs, afterS = s;
        $.each(b, function (k, vl) {
            if (vl) { s = s + '~' + vl; }
        });
        if (afterS != s) {
            return s;
        }
        return '';
    },

    svcSI: function (x, v, b) {
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

    svcMem: function (x, v, b) {
        /// <summary>
        /// Person / Member (Driver, Aid, Guide) save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        if (!b || jQuery.isEmptyObject(b)) return '';
        var s = '';
        $.each(b, function (id, vl) {
            if (vl) s += '~' + vGpi(x.mType, id, vl.FullName, vl.PhoneInfo);
        });
        return s.substring(1);
    },
    rvcDriver: function (x, v) {
        var w = this.view;
        var text = '';
        var time = w.find('select.pickup-time option:selected').text().split('-');
        if (v != null) {
            var duyet = v.split('~');
            if (duyet.length > 1) {
                for (var i = 0 ; i < duyet.length; i++) {
                    var item = duyet[i].split('|');
                    if (time == item[0])
                        text = item[1];
                }
            } else
                text = v;
        }
        return text;
    },

    rvcStpl: function (x, v) {
        /// <summary>
        /// SeatTemplate read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        return vGtp(v, 'Id');
    },

    rvcVhc: function (x, v) {
        /// <summary>
        /// Vehicle read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        return vGvp(v, 'Id');
    },

    rvcMem: function (x, v) {
        /// <summary>
        /// Driver, Aid, Guide read converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        return vGtmp(v, x.mType, true);
    },

    rvcFI: function (x, v) {
        /// <summary>
        /// FareInfo read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        return vGfa(v);
    },

    cpcDate: function (x, b, f) {
        /// <summary>
        /// Date copy from base converter
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="b">Base value</param>
        /// <param name="f">Form value</param>
        return f;
    },

    cpcAlias: function (x, b, f) {
        /// <summary>
        /// Alias copy from base converter
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="b">Base value</param>
        /// <param name="f">Form value</param>
        return 0;
    },

    cpcSI: function (x, b, f) {
        /// <summary>
        /// Status Info copy from base converter
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="b">Base value</param>
        /// <param name="f">Form value</param>
        return oTrs.waiting;
    },

    svbMem: function (x, v) {
        /// <summary>
        /// Member (Person, Driver, Aid) search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return vGetSearchCondt(v);
    },

    svbTime: function (x, v) {
        /// <summary>
        /// Time search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        var arr = v.split('-');
        if (arr && arr[0]) {
            return arr[0].trim();
        } return '';
    },

    svbStpl: function (x, v) {
        /// <summary>
        /// SeatTemplate search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "$x like '" + v + "~%'";
    },

    svbFare: function (x, v) {
        /// <summary>
        /// Fare search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "1|" + parseInt(v.replace(/\./g, '')) + "";
    },

    svbVhc: function (x, v) {
        /// <summary>
        /// Vehicle search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "$x like '" + app.mvs + "~" + v + "|%'";
    },

    svbNote: function (x, v) {
        /// <summary>
        /// Note search value builder
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        return "$x like '%" + v + "%'";
    },

    xchrTime: function (x, b) {
        return b.split('~');
    },


    xchvTime: function (b, m) {
        /// <summary>
        /// Get arr from base info
        /// </summary>
        /// <param name="b">Base model</param>
        /// <param name="m">Main model</param>
        var ar = [], ab = {}, am = {};
        // console.log(m);
        if (b && b.Info) {
            $.each(b.Info.split('~'), function (i, time) {
                if (time.indexOf(':') > 0) {
                    ab[time] = true;
                    ar.push(time);
                }
            });
        };
        $.each(m, function (i, r) {
            var time = r.Time;
            if (!ab[time]) {
                if (!am[time]) {
                    am[time] = true; time = time + ' - Tăng cường';
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

    gDisDrivertip: function (data) {
        var arr = data.record.Description;
        var time = data.record.Time;

        if (arr != null) {
            var duyet = arr.split('~');
            if (duyet.length > 1) {
                for (var i = 0 ; i < duyet.length; i++) {
                    var item = duyet[i].split('|');
                    if (time == item[0])
                        text = item[1];
                }
            } else
                text = arr;
            return text;
        }
        return '';
    },
    //#endregion

});