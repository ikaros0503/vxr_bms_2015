/*
 *Creator: TuanHuynh 
 */

define({

    onBeginSelectionChange: function (view, record) {
        vv.enableItem(view, this.o.jHtml.deleteButtton, record != null);
    },

    onUpdateSuccess: function () {
        this.onPkRouteChange();
        $(this.o.jHtml.deleteButtton).addClass(this.o.classForDisabledButton).attr(this.o.disabledButtonProp, this.o.disabledButtonPropValue);
    },

    onEndAjaxloadBaseData: function () {
        var self = this;
        $(this.o.jHtml.selectTf).html($(this.o.jHtml.selectPk).html());
        $(this.o.jHtml.selectTf).change(function () {
            try {
                self.changeData();    
            }catch(err) {}
        });
    },

    onVMLoaded: function () {
        var self = this;
        $(this.o.jHtml.tab).on(this.o.jHtml.tabChangeEvent, function (e) {//base on bootstrap
            $(self.o.jHtml.allInputs).val('');
            try {
                self.changeData();
            }catch(err){}
            
        });

        $(this.o.jHtml.numberOnly).keydown(function (e) {
            if (($.inArray(e.keyCode, [46, 8, 9]) !== -1) //backspace, delete
                || (e.keyCode == 65 && e.ctrlKey === true) //Ctrl A
                || (e.keyCode >= 35 && e.keyCode <= 39)){ //home, end, left, right
                return;
            }
            var charValue = String.fromCharCode(e.keyCode);
            var valid = self.o.jHtml.regexNumberOnly.test(charValue);

            if (!valid) {
                vv.showMessage({ element: $(self.o.jHtml.divAlert), type: self.o.jHtml.alertDanger, content: self.o.jHtml.alertMsg_WrongNumber });
                e.preventDefault();
            }
        });
    },

    onPkRouteChange: function (w, x, e) {
        try {
            this.changeData(0);    
        }catch(err){}  
    },

    onDeletePoint: function () {
        var me = this;
        var routeId;
        routeId = (me.getTabIndex() == 0) ? parseInt($(this.o.jHtml.selectPk + ' :selected').val()): parseInt($(this.o.jHtml.selectTf + ' :selected').val());
        
        if (me.model == null) me.model = {};
        me.model['Id'] = routeId;
        var model = vGetObj({ Id: routeId }, me.listBase);

        var arr = Array();

        var version = 1;
        var str = ' ';
        $.each(me.getTabIndex() == 0 ? model.arrPkPoints : model.arrTfPoints, function (i, v) {
            if (!(v.PointId == me.model.PointId && v.PointName==me.model.PointName && me.model.PointTime==v.PointTime && v.PointIndex==me.model.PointIndex)) {
                arr.push(v);
            }
        });
        me.getTabIndex() == 0 ? model.arrPkPoints = arr : model.arrTfPoints = arr;
        $.each(arr, function (i, v) {
            str += '~' + me.setString(v.PointId) + '|' + me.setString(v.PointName) + '|' + me.setString( v.PointTime) + '|' + me.setString( v.PointIndex) + '|' + me.setString(v.PointAddress) + '|' + me.setString( v.PointNearBy) + '|' ;
        });
        if (str != null && str != '' && str.indexOf('~') > 0) {
            str = String(version) + str;
        }
        
        var _d = {};
        if (me.getTabIndex() == 0) {
            model.PickedPointsInfo = str;
            _d = { PickedPointsInfo: str }
        } else if (me.getTabIndex() == 1) {
            model.TransferPointsInfo = str;
            _d = { TransferPointsInfo: str }
        }

        vRqs({
            _a: me.o.jVar.updateFunction,
            _c: { CompId: app.cid, Id: model.Id },
            _d: _d,
        }, function (u, r, l, t) {
            $(me.o.jHtml.allInputs).val('');
            me.onUpdateSuccess();
        });

    },

    onSavePoint: function () {
        var me = this;
        var isUpdate = $( this.o.jHtml.jTableSelectedRow).length;
        var routeId, pointName, pointTime, pointIndex, pointNearBy, pointAddress;
        if (me.getTabIndex() == 0) {
            routeId = parseInt($(this.o.jHtml.selectPk + ' :selected').val());
            pointName = $(this.o.jHtml.inputPkPointName).val();
            pointTime = $(this.o.jHtml.inputPkPointTime).val();
            pointIndex = $(this.o.jHtml.inputPkPointIndex).val();
            pointNearBy = $(this.o.jHtml.inputPkPointNearBy).val();
            pointAddress = $(this.o.jHtml.inputPkPointAddress).val();
        }else if (me.getTabIndex() == 1) {
            routeId = parseInt($(this.o.jHtml.selectTf +' :selected').val());
            pointName = $(this.o.jHtml.inputTfPointName).val();
            pointTime = $(this.o.jHtml.inputTfPointTime).val();
            pointIndex = $(this.o.jHtml.inputTfPointIndex).val();
            pointNearBy = $(this.o.jHtml.inputTfPointNearBy).val();
            pointAddress = $(this.o.jHtml.inputTfPointAddress).val();
        }
        
        var errorMsg = '';
        if (pointName == null || pointName == '') {
            $(me.getTabIndex() == 0 ? this.o.jHtml.inputPkPointName : this.o.jHtml.inputTfPointName).focus();
            errorMsg = this.o.jHtml.alertMsg_PointName;
        } else if (pointTime == null || pointTime == '') {
            $(me.getTabIndex() == 0 ? this.o.jHtml.inputPkPointTime : this.o.jHtml.inputTfPointTime).focus();
            errorMsg = this.o.jHtml.alertMsg_PointTime;
        } else if (pointIndex == null || pointIndex == '') {
            $(me.getTabIndex() == 0 ? this.o.jHtml.inputPkPointIndex : this.o.jHtml.inputTfPointIndex).focus();
            errorMsg = this.o.jHtml.alertMsg_PointIndex;
        }
        if (errorMsg != '') {
            vv.showMessage({ element: $( this.o.jHtml.divAlert), type:this.o.jHtml.alertDanger, content: errorMsg });
            return;
        }

        //update
        if (me.model == null) me.model = {};
        me.model['Id'] = routeId;
        var model = vGetObj({ Id: routeId }, me.listBase);

        var pointId = 0;
        if (me.getTabIndex() == 0) {
            if (model.arrPkPoints == undefined || model.arrPkPoints == null) {
                model.arrPkPoints = [];
                pointId = 1;
            } else {
                pointId = model.arrPkPoints.length + 1;
            }
        }else if (me.getTabIndex() == 1){
            if (model.arrTfPoints == undefined || model.arrTfPoints == null) {
                model.arrTfPoints = [];
                pointId = 1;
            } else {
                pointId = model.arrTfPoints.length + 1;
            }
        }
        
        var row = {
            PointName: me.setString(pointName),
            PointTime: me.setString( pointTime),
            PointNearBy: me.setString( pointNearBy),
            PointId: me.setString( pointId),
            PointIndex: me.setString( pointIndex),
            PointAddress: me.setString( pointAddress),
        };
        var mo = this.model;
        if (isUpdate) {
            var arr = Array();
            $.each(me.getTabIndex() == 0 ? model.arrPkPoints : model.arrTfPoints, function (i, v) {
                if ((v.PointIndex == mo.PointIndex && v.PointName == mo.PointName && v.PointTime == mo.PointTime)) {
                    var newValue = mo;
                    newValue.PointName = row.PointName;
                    newValue.PointTime = row.PointTime;
                    newValue.PointNearBy = row.PointNearBy;
                    newValue.PointIndex = row.PointIndex;
                    newValue.PointAddress = row.PointAddress;
                    arr.push(newValue);
                } else {
                    arr.push(v);
                }
            });
            if (me.getTabIndex() == 0) {
                model.arrPkPoints = arr;
            } else if (me.getTabIndex() == 1) {
                model.arrTfPoints = arr;
            }
            
        } else {//insert
            if (me.getTabIndex() == 0) {
                model.arrPkPoints.push(row);
            } else if (me.getTabIndex() == 1) {
                model.arrTfPoints.push(row);
            }
        }

        if (me.getTabIndex() == 0) {
            model.arrPkPoints = me.sortPoints(model.arrPkPoints);
        } else if (me.getTabIndex() == 1) {
            model.arrTfPoints = me.sortPoints(model.arrTfPoints);
        }

        var str = ' ';
        var version = 1;
        $.each(me.getTabIndex() == 0 ? model.arrPkPoints : model.arrTfPoints, function (i, v) {
            str += '~' + v.PointId + '|' + v.PointName + '|' + v.PointTime + '|' + v.PointIndex + '|' + v.PointAddress + '|' + v.PointNearBy + '|' ;
        });
        if (str != null && str != '' && str.indexOf('~') > 0) {
            str = String(version) + str;
        }
        // update
        var _d = {};
        if (me.getTabIndex() == 0) {
            model.PickedPointsInfo = str;
            _d = { PickedPointsInfo: str }
        } else if (me.getTabIndex() == 1) {
            model.TransferPointsInfo = str;
            _d = { TransferPointsInfo: str }
        }
        vRqs({
            _a: me.o.jVar.updateFunction,
            _c: { CompId: app.cid, Id:model.Id},
            _d: _d,
        }, function (u, r, l, t) {
            $(me.o.jHtml.allInputs).val('');
            me.onUpdateSuccess();
        });
    },

    sortPoints: function(array) {
        if (!(array != 'undefined' && array != null && array.length != 'undefined' && array.length > 1)) return array;
        for (var i = 0; i < array.length-1; i++) {
            for (var j = i + 1; j < array.length; j++) {                
                if (parseInt(array[j].PointIndex) < parseInt(array[i].PointIndex)) {
                    var tmp = array[i];
                    array[i] = array[j];
                    array[j] = tmp;
                }
            }
        }
        return array;
    },

    setString:function(str) {
        if (typeof (str) == 'undefined' || str == null) return '';
        return str;
    },

    getTabIndex: function () {
        return $(this.o.jHtml.tabIndex).eq(0).hasClass('active') ? 0 : 1;
    },

    mapPoints: function (model) {
        var str, arr;
        var result = [];
        str = this.getTabIndex() == 0 ? model.PickedPointsInfo : model.TransferPointsInfo;
        if (str == null || str == '') return result;
        if (str.indexOf("~") >= 0) {
            str = str.substring(str.indexOf("~") + 1);
            arr = str.split('~');
            var row;
            $.each(arr, function (index, value) {
                row = {
                    PointId: vGdi(value, "|", 0),
                    PointName: vGdi(value, "|", 1),
                    PointTime: vGdi(value, "|", 2),
                    PointIndex: vGdi(value, "|", 3),
                    PointAddress: vGdi(value, "|", 4),
                    PointNearBy: vGdi(value, "|", 5),
                    PointLocationId: vGdi(value, "|", 6),
                };
                result.push(row);
            });
        }
        return result;
    },

    changeData: function () {
        var self = this;
        var routeId = this.getTabIndex() == 0 ? parseInt($(this.o.jHtml.selectPk + ' :selected').val()) : parseInt($(this.o.jHtml.selectTf + ' :selected').val());

        if (this.model == null || this.model == undefined) this.model = {};
        this.model['Id'] = routeId;
        var baseModel = vGetObj({ Id: routeId }, this.listBase);
        var models;
        if (baseModel) {
            models = this.mapPoints(baseModel);
        }

        var selectedRows = $('#' + this.o.gId).jtable('selectedRows');
        if (selectedRows.length > 0) {
            $('#' + this.o.gId).jtable('deselectRows', selectedRows);
        }
        $('#' + this.o.gId).jtable('removeAllRows');
        $('#' + this.o.gId).jtable('addLocalRecords', function (lastPostData, params) {
            return self._listAction(models, params);
        });
        $('#' + this.o.gId).unmask();
    },
    gDpkPointNearBy: function(data) {
        var v = data.record.PointNearBy;
        if (v == 'undefined') {
            return '';
        };
        return v;
    }
});
