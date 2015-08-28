define({
    contractInfo: [],
    cancelFee: [],
    trips:[],
    onBeginSelectionChange: function (view, record) {
        vv.enableItem(view, 'button.delete', record != null);
        
        if (record != null && record['ContractInfo'] != null) {
            this.contractInfo = this.parseArray(record['ContractInfo']);
        }
        if (record != null && record['CancelFee'] != null) {
            this.cancelFee = this.parseArray(record['CancelFee']);
        }
        this.renderView(record != null && record['Type'] == 3);
    },

    onVMLoaded: function () {
        
        var self = this;
        $('select.type').on('change', function() {
            self.o.queryConditions.Type = '($x=' + $(this).val() + ') order by IsPrgUpdatedDate desc';
            self.load();
        });

    },
    
    parseArray:function(str) {
        var strs = String(str).split('~');
        var arr = [];
        if (strs.length > 1) {
            for (var i = 1; i < strs.length;i++) {
                var strss = String(strs[i]).split('|');
                var obj = {
                    tripId: strss[0],
                    p: strss[1],
                    m:strss[2],
                };
                arr.push(obj);
            }
        }
        return arr;
    },

    updateArray:function(item, array) {
        if (typeof (array.length) != 'undefined') {
            for (var i = 0; i < array.length; i++) {
                if (item.tripId == array[i].tripId) {
                    array[i] = item;
                    return array;
                }
            }
            array.push(item);
        } else {
            array.push(item);
        }
        return array;
    },

    buildStringFromArray: function (array) {
        if (typeof (array.length) != 'undefined') {
            var str = '1';
            for (var i = 0; i < array.length; i++) {
                str += '~' + array[i].tripId + '|' + array[i].p + '|' + array[i].m;
            }
            return str.replace(/\./g, '');
        }
        return '';
    },
    saveContractToArray:function() {
        var obj = {
            tripId: $("#selContractInfo").val(),
            p: $("#txtContractInfoPercentage").val(),
            m: $("#txtContractInfoMoney").val(),
        };
        if ($("input[type='radio'][name='rdoContractInfo']:checked").val() == 'percentage') {
            obj.m = '';
        } else {
            obj.p = '';
        }
        this.contractInfo = this.updateArray(obj, contractInfo);
        $('input.contractInfo').val(this.buildStringFromArray(contractInfo));
    },
    saveCancelFeeToArray: function () {
        var obj = {
            tripId: String($("#selCancelFee").val()),
            p: $("#txtCancelFeePercentage").val(),
            m: $("#txtCancelFeeMoney").val(),
        };
        if ($("input[type='radio'][name='rdoCancelFee']:checked").val() == 'percentage') {
            obj.m = '';
        } else {
            obj.p = '';
        }
        this.cancelFee = this.updateArray(obj, cancelFee);
        $('input.cancelFee').val(this.buildStringFromArray(cancelFee));
    },
    setViewContactInfo: function (data) {
        if (data.p != '') {
            $("input:radio[name = 'rdoContractInfo'][value='percentage']").attr("checked", true);
            $("#txtContractInfoPercentage").val(data.p);
            $("#txtContractInfoMoney").val('');
            $("#txtContractInfoPercentage").prop('disabled', false);
            $("#txtContractInfoMoney").prop('disabled', true);
            
        } else {
            $("input:radio[name = 'rdoContractInfo'][value='money']").attr("checked", true);
            $("#txtContractInfoPercentage").val('');
            $("#txtContractInfoMoney").val(vToMn(data.m));
            $("#txtContractInfoPercentage").prop('disabled', true);
            $("#txtContractInfoMoney").prop('disabled', false);
        }
    },
    setViewCancelFee: function (data) {
        if (data.p != '') {

            $("input:radio[name = 'rdoCancelFee'][value='percentage']").attr("checked", true);
            $("#txtCancelFeePercentage").val(data.p);
            $("#txtCancelFeeMoney").val('');
            $("#txtCancelFeePercentage").prop('disabled', false);
            $("#txtCancelFeeMoney").prop('disabled', true);
        } else {
            $("input:radio[name = 'rdoCancelFee'][value='money']").attr("checked", true);
            $("#txtCancelFeePercentage").val('');
            $("#txtCancelFeeMoney").val(vToMn(data.m));
            $("#txtCancelFeePercentage").prop('disabled', true);
            $("#txtCancelFeeMoney").prop('disabled', false);
            
        }
    },
    renderView: function (showForm) {
        var self = this;
        $('div.addition').remove();
        if (showForm) {
            $(htmlContractInfo).insertBefore('div.modal-footer');

            
            $('#txtContractInfoPercentage').blur(function () {
                if (self.isStringNullOrEmpty($(this).val())) {
                    $(this).val('0');
                }
                self.saveContractToArray();
            });
            $('#txtContractInfoMoney').blur(function () {
                if (self.isStringNullOrEmpty($(this).val())) {
                    $(this).val('0');
                }
                 self.saveContractToArray(); $(this).val(vToMn($(this).val()));
            });

            $('#txtCancelFeePercentage').blur(function () {
                if (self.isStringNullOrEmpty($(this).val())) {
                    $(this).val('0');
                }
                 self.saveCancelFeeToArray();
            });
            $('#txtCancelFeeMoney').blur(function () {
                if (self.isStringNullOrEmpty($(this).val())) {
                    $(this).val('0');
                }
                 self.saveCancelFeeToArray(); $(this).val(vToMn($(this).val()));
            });


            $("#selContractInfo").on('focus', function () {
                self.saveContractToArray();
            }).change(function () {
                var isMatch = false;
                if (contractInfo != null && typeof (contractInfo.length) != 'undefined') {
                    
                    for (var i = 0; i < contractInfo.length; i++) {
                        if ($(this).val() == contractInfo[i].tripId) {
                            isMatch = true;
                            self.setViewContactInfo(contractInfo[i]);
                        }
                    }
                }
                if (isMatch == false) {
                    $("#txtContractInfoPercentage").val('');
                    $("#txtContractInfoMoney").val('');
                }
                
            });

            $("#selCancelFee").on('focus', function () {
                self.saveCancelFeeToArray();
            }).change(function () {
                var isMatch = false;
                if (cancelFee != null && typeof (cancelFee.length) != 'undefined') {

                    for (var i = 0; i < cancelFee.length; i++) {
                        if ($(this).val() == cancelFee[i].tripId) {
                            isMatch = true;
                            self.setViewCancelFee(cancelFee[i]);
                        }
                    }

                }
                if (isMatch == false) {
                    $("#txtCancelFeePercentage").val('');
                    $("#txtCancelFeeMoney").val('');
                }
            });


            $('input:radio[name = "rdoContractInfo"]').change(function() {
                if ($(this).val() == 'percentage') {
                    $("#txtContractInfoPercentage").attr('disabled', false);
                    $("#txtContractInfoMoney").attr('disabled', true);
                    $("#txtContractInfoPercentage").focus();

                } else {
                    $("#txtContractInfoPercentage").attr('disabled', true);
                    $("#txtContractInfoMoney").attr('disabled', false);
                    $("#txtContractInfoMoney").focus();
                }
            });
            $('input:radio[name = "rdoCancelFee"]').change(function () {
                if ($(this).val() == 'percentage') {
                    $("#txtCancelFeePercentage").attr('disabled', false);
                    $("#txtCancelFeeMoney").attr('disabled', true);
                    $("#txtCancelFeePercentage").focus();
                } else {
                    $("#txtCancelFeePercentage").attr('disabled', true);
                    $("#txtCancelFeeMoney").attr('disabled', false);
                    $("#txtCancelFeeMoney").focus();
                }
            });


            if (trips.length > 0) {
                for (var i = 0; i < trips.length; i++) {
                    $("#selContractInfo").append('<option value=' + trips[i][0] + '>' + trips[i][1] + '</option>');
                    $("#selCancelFee").append('<option value=' + trips[i][0] + '>' + trips[i][1] + '</option>');
                }
                if (contractInfo.length > 0) {
                    $("#selContractInfo").val(contractInfo[0].tripId);
                    self.setViewContactInfo(contractInfo[0]);
                }
                if (cancelFee.length > 0) {
                    $("#selCancelFee").val(cancelFee[0].tripId);
                    self.setViewCancelFee(cancelFee[0]);
                }
                
            } else {
                vRqs({
                    _a: 'fGetTrip',
                    _c: {CompId: app.cid , Type:1},
                    _f: "Id, Name",
                }, function (u, r, l, t) {
                    trips = r;
                    for (var i = 0; i < r.length; i++) {
                        $("#selContractInfo").append('<option value=' + r[i][0] + '>' + r[i][1] + '</option>');
                        $("#selCancelFee").append('<option value=' + r[i][0] + '>' + r[i][1] + '</option>');
                    }
                    if (contractInfo.length > 0) {
                        $("#selContractInfo").val(contractInfo[0].tripId);
                        self.setViewContactInfo(contractInfo[0]);
                    }
                    if (cancelFee.length > 0) {
                        $("#selCancelFee").val(cancelFee[0].tripId);
                        self.setViewCancelFee(cancelFee[0]);
                    }
                });
            }
        }
    },
    onUpdateSuccess: function () {
        //Reload datacenter Company
        vdc.gCompany({ BaseId: app.cid, IsPrgStatus: 1, Type: "($x in (2,3))" }, 'Id, Type, Code, Name, AddressInfo, PhoneInfo', true, null);
    },
    gDisType: function (data) {
        var v = data.record.Type;
        var obj = _.where(this.cf.options, { Id: parseInt(v) });
        if (!obj || obj.length < 1) { return ''; }
        return obj[0].Name;
    },
    rvcAvailableFund: function (x, v) {
        return vToMn(v);
    },
    svcAvailableFund: function (x, v) {
        return vToNum(v);
    },
    isStringNullOrEmpty:function(str) {
        return (typeof(str) != 'undefined' && str != null && typeof(str.length) != 'undefined' && str.length > 0 && str != '');
    },
});
