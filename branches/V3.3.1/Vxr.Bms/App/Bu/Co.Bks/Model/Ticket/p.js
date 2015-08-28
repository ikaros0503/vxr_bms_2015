T.prototype._getCustomerInfo = function () {
    var self = this;
    if (typeof self._cid == "undefined") {
        self._cid = 0;
    }
    if (typeof self._cname == "undefined") {
        self._cname = "";
    }
    if (typeof self._cphone == "undefined") {
        self._cphone = "";
    }
    return '1|1|' + self._cid + '|' + self._cname + '|' + self._cphone;
};

T.prototype._clone = function () {
    var self = this;
    return $.extend({}, self);
};

T.prototype._isBooking = function () {
    return this._status == 1;
};

T.prototype._isNotCome = function () {
    return this._status == 4;
};

T.prototype._isCancelled = function () {
    //if (this._status == 3) {
    //    return true;
    //} else if (this._status == 1) {
    //    if (vIsEstStr(this._expiredTime)) {
    //        this._cancelInfo = "Vé hết hạn";
    //        return vPrsDt(this._expiredTime) < new Date();
    //    }
    //}
    //return false;
    return this._status == 3;
};

T.prototype._isValid = function () {
    return this._status == 6;
};

T.prototype._isOpen = function () {
    return this._status == 7;
};

T.prototype._isPaid = function () {
    return this._status == 2;
};

T.prototype._isPass = function () {
    return this._status == 5;
};

T.prototype._renderVVTicket = function () {
    var self = this;
    //Prepare data
    var data = {
        "ticket": {
            _code: self._code,
            _cname: vGln(self._cname),
            _cphone: self._getDefaultPhoneNumber(),
            _fValid: self._fromValid.toFormatString('dd-mm-yyyy'),
            _tValid: self._toValid.toFormatString('dd-mm-yyyy')
        }
    };

    //Rendering
    var $html = $(vtpl(_dict._vTpl, data));
    return $html;
};

T.prototype._renderVOTicket = function () {
    var self = this;
    //Prepare data
    var data = {
        "ticket": {
            _code: self._code,
            _cname: vGln(self._cname),
            _cphone: self._getDefaultPhoneNumber(),
            _fOpen: self._updatedDate.toFormatString('dd-mm-yyyy')
        }
    };

    //Rendering
    var $html = $(vtpl(_dict._oTpl, data));
    return $html;
};

T.prototype._renderVCTicket = function () {
    var self = this;
    //Prepare data
    var cancelledDate = self._getCanceledDate();
    var data = {
        "ticket": {
            _code: self._code,
            _cname: vGln(self._cname),
            _cphone: self._getDefaultPhoneNumber(),
            _cDate: !$.isEmptyObject(cancelledDate) ? cancelledDate.toFormatString('dd-mm-yyyy hh:ii') : ""
        }
    };

    //Rendering
    var $html = $(vtpl(_dict._cTpl, data));
    return $html;
};

T.prototype._renderPaymentInfo = function () {
    var ifo = this._pmInfo.split(':');
    var t = "";
    $.each(_dict._pm, function (_, p) {
        if (t == "") {
            if (p[0] == ifo[0]) {
                t = p[3];
            }
        }
    });
    var d = "";
    switch (parseInt(ifo[0])) {
        case 1:
        case 6:
            var name = ifo[2].split('|')[2];
            if (typeof name == "undefined") {
                name = "";
            }
            d = name;
            break;
        case 2:
            var ckname = ifo[2].split('|')[1];
            if (typeof ckname == "undefined") {
                ckname = "";
            }
            d = ": " + ckname;
            break;
        case 3:
            d = ifo[2];
            break;
        case 4:
            d = ': ' + ifo[2];
            break;
        case 5:
            d = ifo[2];
            break;
        case 7:
        case 8:
        case 9:
            break;
    }
    return t + d;
};

T.prototype._getDefaultPhoneNumber = function () {
    var self = this;
    if (vIsEstStr(self._cphone)) {
        return $.trim(self._cphone.split('-')[0]);
    }
    return "";
};

T.prototype._getTicketCode = function () {
    var self = this;
    if (vIsEstStr(self._code)) {
        return $.trim(self._code);
    }
    return "";
};

T.prototype._parseHistoryInfo = function () {
    var self = this;
    var result = [];
    try {
        if (vIsEstStr(self._hInfo)) {
            var h = self._hInfo.split('~').reverse();
            for (var i = 0; i < h.length; i++) {
                var ht = h[i].split('##');
                switch (ht[5]) {
                    case "UpdateBookTicket":
                        ht[5] = "Cập nhật";
                        break;
                    case "BookTicket":
                        ht[5] = "Đặt vé";
                        break;
                }
                if (vIsEstStr(ht[6])) {
                    var d = $.parseJSON($.trim(ht[6]));
                    var dt = "";
                    $.each(d, function (k, v) {
                        if (_dict._historyKeys.hasOwnProperty(k) && vIsEstStr(v)) {
                            dt += _dict._historyKeys[k][_dict._lang] + ":&nbsp;" + self._convertHistoryItem(k, v) + "<br />";
                        }
                    });
                    result.push([ht[3], ht[5], vPrsDt(ht[4]).toFormatString('dd-mm-yyyy hh:ii'), dt]);
                }
            }
        }
    } catch (err) {
        //Silent
        console.log(err);
    }
    return result;
};

T.prototype._convertHistoryItem = function (k, v) {
    var self = this;
    var result = "";
    switch (k) {
        case "CancelType":
            result = vIsEstStr(_dict._cancelType[v]) ? _dict._cancelType[v] : "";
            break;
        case "AgentInfo":
            result = self._getAgentFName(v);
            break;
        case "TripDate":
        case "IssueDate":
        case "PickupDate":
            result = vPrsDt(v).toFormatString('dd-mm-yyyy hh:ii');
            break;
        case "Status":
            result = _dict._stn[parseInt(v)][_dict._lang];
            break;
        case "Fare":
        case "Surcharge":
            result = parseInt(v).toMn() + " đ";
            break;
        case "CancelFee":
            result = parseInt(v).toMn() + " đ";
            break;
        case "Deposit":
            result = parseInt(v).toMn() + " đ";
            break;
        case "Debt":
            result = parseInt(v).toMn() + " đ";
            break;
        case "Discount":
            result = parseInt(v).toMn() + " đ";
            break;
        case "SeatCode":
            result = v.split('|')[0];
            break;
        case "PickupInfo":
            var pick = v.split('|');
            if (pick.length > 0) {
                result = "P:&nbsp;" + pick[0] + " - T:&nbsp;" + pick[1] + " - STT:&nbsp;" + pick[2];
            }
            break;
        case "PaymentInfo":
            if (v != null) {
                var ifo = v.split(':');
                if (ifo.length > 0) {
                    $.each(_dict._pm, function (_, p) {
                        if (result == "") {
                            if (p[0] == ifo[0]) {
                                result = p[3];
                            }
                        }
                    });
                    switch (parseInt(ifo[0])) {
                        case 1:
                        case 6:
                            var name = ifo[2].split('|')[3];
                            if (typeof name == "undefined") {
                                name = "";
                            }
                            result = name;
                            break;
                    }
                }
            }
            break;
        case "CustomerInfo":
            var c = v.split('|');
            if (c.length > 0) {
                if (vIsEstStr(c[3]) || vIsEstStr(c[4])) {
                    result = c[3] + "(" + c[4] + ")";
                } else {
                    result = "";
                }
            }
            break;
        case "FromArea": // Version<Id|Type|Code|Name
            var indFrom = v.indexOf("<");
            var splitFrom = v.substr(indFrom, v.length).split("|");
            result = splitFrom[3];
            break;
        case "ToArea": // Version<Id|Type|Code|Name
            var indTo = v.indexOf("<");
            var splitTo = v.substr(indTo, v.length).split("|");
            result = splitTo[3];
            break;
        default:
            result = v;
            break;
    }
    return result;
};

T.prototype._getAgentFName = function (aif) {
    return $.trim(aif.split('|')[3]);
};

T.prototype._getCanceledDate = function () {
    var self = this;
    var result = {};
    try {
        var h = self._hInfo.split('~').reverse();
        // vé đã hủy luôn nằm đầu tiên, nên vị trí trong chuỗi là 0
        var ht = h[0].split('##');
        var d = JSON.parse(ht[6]);
        if (ht[5] == "UpdateBookTicket" && d['Status'] == 3) {
            result = vPrsDt(ht[4]);
        }
    } catch (err) {
        //Silent
    }
    return result;
};

T.prototype._getOpenDate = function () {
    var self = this;
    return self._updatedDate.toFormatString('HH:mm - dd.mm.yyyy');
};

T.prototype._getTimeValid = function () {
    var self = this;
    return self._fromValid.toFormatString('dd.mm.yyyy') + ' &#8594; ' + self._toValid.toFormatString('dd.mm.yyyy');
};

T.prototype._getPaymentInfo = function () {
    var self = this;
    var result = {};
    if (vIsEstStr(self._pmInfo)) {
        var info = self._pmInfo.split(':');
        result['type'] = parseInt(info[0]);
        result['name'] = $.trim(info[1]);
        var sname = "";
        $.each(_dict._pm, function (_, p) {
            if (sname == "") {
                if (p[0] == result['type']) {
                    sname = p[3];
                }
            }
        });
        result['sname'] = sname;
        result['info'] = {};

        switch (result['type']) {
            case 1:
            case 6:
                if (vIsEstStr(info[2])) {
                    var ainfo = info[2].split('|');
                    result['info'] = {
                        _id: parseInt(ainfo[0]),
                        _type: parseInt(ainfo[1]),
                        _code: $.trim(ainfo[2]),
                        _name: $.trim(ainfo[3])
                    };
                }
                break;
            case 2:
                if (vIsEstStr(info[2])) {
                    var ck = info[2].split('|');
                    result['info'] = {
                        _bnumber: ck[0],
                        _name: $.trim(ck[1]),
                        _tcode: $.trim(ck[2])  //transaction code
                    };
                }
                break;
            case 3:
                if (vIsEstStr(info[2])) {
                    var adr = info[2];
                    result['info'] = {
                        _addr: $.trim(adr)
                    };
                }
                break;
            case 4:
                if (vIsEstStr(info[2])) {
                    var drv = info[2];
                    result['info'] = {
                        _dname: $.trim(drv)
                    };
                }
                break;
            case 5:
                if (vIsEstStr(info[2])) {
                    var tcode = info[2];
                    result['info'] = {
                        _tcode: $.trim(tcode) //charge code
                    };
                }
                break;
            case 7:
            case 8:
            case 9:
            case 10:
                break;
        }
    }
    return result;
};

T.prototype._getPickupInfo = function () {
    var self = this;
    var result = {};
    if (null != self._pInfo) {
        var pInfo = self._pInfo.split('|');
        var pIndex = 0; //Default is 0
        if (vIsEstStr(pInfo[2])) {
            pIndex = parseInt(pInfo[2]);
            if (isNaN(pIndex)) {
                pIndex = 0;
            }
        }
        if (null != pInfo[1] && "" != pInfo[1]) {
            result = { 'type': 'T', 'text': pInfo[1], 'pIndex': pIndex };
        } else if (null != pInfo[0] && "" != pInfo[0]) {
            result = { 'type': 'P', 'text': pInfo[0], 'pIndex': pIndex };
        }
    }
    return result;
};

T.prototype._getAgentInfo = function () {
    var self = this;
    if (vIsEstStr(self._aInfo)) {
        var aInfo = self._aInfo.split('|');
        return {
            _id: aInfo[0],
            _type: aInfo[1],
            _code: aInfo[2],
            _name: aInfo[3]
        }
    }
    return {};
};

T.prototype._getStatusText = function () {
    var self = this;
    var result = "";
    switch (self._status) {
        case 1:
            result = "Đặt chỗ";
            break;
        case 2:
            result = "Đã thanh toán";
            break;
        case 3:
            result = "Hủy";
            break;
        case 4:
            result = "Không đến";
            break;
        case 5:
            result = "Đã thanh toán";
            break;
        case 6:
            result = "Vé mở";
            break;
        case 7:
            result = "Vé mở";
            break;
        case 8:
            result = "Đặt chỗ";
            break;
    }
    return result;
};

T.prototype._getLastUpdateUser = function () {
    var self = this;
    var result = "";
    try {
        if (vIsEstStr(self._hInfo)) {
            var h = self._hInfo.split('~').reverse();
            if (h.length > 0) {
                var last = h[0].split('##');
                if (vIsEstStr(last[3])) {
                    result = last[3];
                }
            }
        }
    } catch (err) {
        //Silent
        console.log(err);
    }
    return result;
};