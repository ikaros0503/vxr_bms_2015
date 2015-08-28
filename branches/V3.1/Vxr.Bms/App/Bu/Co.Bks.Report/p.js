define({
    loadReport: function () {
        $('#bksContent').hide();
        $('#bTickets').hide();
        $('#cod').hide();
        $('#report').show();
        $('#product-content').hide();
        $('#busManager').hide();
        $('#report').report({});
        $('#report').report('load', opt);
        $('[data-toggle="popover"]').tooltip();
    },
    start: function (o) {
        try {
            var me = this;
            vRqs({
                _a: jVar.getAccountFunction,
                _c: jVar.getAccountCondition,
                _f: jVar.getAccountFields,
            }, function (u, r, l, t) {
                if (r.length > 0) {
                    accInfo.role = r[0][3] != null ? r[0][3] : -1;
                    accInfo.agentId = r[0][2];
                    accInfo.username = r[0][1];
                    accInfo.id = r[0][0];
                    me.loadReport();
                }
            });
        } catch (e) {
            console.error(e);
        }
    },

});

function isAgentAvailable(agentId) {
    try {

        if (accInfo.role == role.officeManager) {
            return agentId == accInfo.agentId;
        }
        else if (accInfo.role == role.seller) {
            return agentId == accInfo.agentId;
        }
        else if (accInfo.role == role.reporter) {
            return true;
        }
        else if (accInfo.role == role.admin) {
            return true;
        }
        else if (accInfo.role == role.office) {
            return true;
        } else if (accInfo.role < 0) {
            return agentId == accInfo.agentId;
        }

    } catch (err) { }

    return false;
}

function isUserAvailable(u) {
    try {
        if (u.username == accInfo.username) {
            return true;
        } else if (accInfo.role.indexOf(role.officeManager) >= 0) {
            return u.agentId == accInfo.agentId;
        }
        else if (accInfo.role.indexOf(role.seller) >= 0) {
            return u.username == accInfo.username;
        }
        else if (accInfo.role.indexOf(role.reporter) >= 0) {
            return u.username.indexOf('admin') < 0;
        }
        else if (accInfo.role.indexOf(role.admin) >= 0) {
            return true;
        }
        else if (accInfo.role.indexOf(role.office) >= 0) {
            return u.username.indexOf('admin') < 0;
        }
    } catch (err) { }
    return false;
}

function getRoute(els) {
    var $el = $('#' + els[0]);
    vRqs({
        _a: 'fGetTrip',
        _c: {
            Type: 1,
            CompId: app.cid,
            IsPrgStatus: 1,
        },
        _f: 'Id, Name',
    }, function (u, r, l, t) {
        $el.append(jHtml.filterDefaultRouteOption);
        for (var i = 0; i < l; i++)
            $el.append('<option value="' + r[i][0] + '">' + r[i][1] + '</option>');
        $el.val($el.find('option:first').val());
        $el.chosen({ width: "100%", search_contains: true });
    });
};

function getStatus(els) {
    var $el = $('#' + els[0]);
    $el.append('<option value="" selected="selected">----Chọn trạng thái----</option>');
    $el.append('<option value="1">Đã đặt</option>');
    $el.append('<option value="3">Đã hủy</option>');
};


function getComp(els) {
    var $el = $('#' + els[0]);
    var $tr = $('#' + els[1]);
    vRqs({
        _a: 'fGetCompany',
        _c: {
            IsPrgStatus: 1,
            HasOnlineContract: '($x=1 or HasOfflineContract=1)',
            Type: '($x=1)',

        },
        _f: 'Id, Name',
    }, function (u, r, l, t) {
        $el.append(jHtml.filterDefaultCompanyOption);
        for (var i = 0; i < l; i++) {
            $el.append('<option value="' + r[i][0] + '">' + r[i][1] + '</option>');
        }
        $el.val($el.find('option:first').val());
        $el.chosen({ width: "100%", search_contains: true });
        $tr.append(jHtml.filterDefaultRouteOption);
        $tr.chosen({ width: "100%", search_contains: true });
        $el.change(function () {
            if (!($(this).val() != null && $(this).val() != '')) {
                $tr.html('');
                $tr.append(jHtml.filterDefaultRouteOption);
                $tr.val($tr.find('option:first').val());
                $tr.data("chosen").destroy().chosen();
                $tr.chosen({ width: "100%", search_contains: true });
                return;
            }
            vRqs({
                _a: 'fGetTrip',
                _c: {
                    Type: 1,
                    CompId: $(this).val(),
                    IsPrgStatus: 1,
                },
                _f: 'Id, Name',
            }, function (uu, rr, ll) {
                $tr.html('');
                $tr.append(jHtml.filterDefaultRouteOption);
                for (var j = 0; j < rr.length; j++)
                    $tr.append('<option value="' + rr[j][0] + '">' + rr[j][1] + '</option>');
                $tr.val($tr.find('option:first').val());
                $tr.data("chosen").destroy().chosen();
                $tr.chosen({ width: "100%", search_contains: true });
            });
        });
    });
};


function getBranchAndAgents(els) {
    var $el = $('#' + els[0]);
    vRqs({
        _a: 'fGetCompany',
        _c: {
            BaseId: app.cid,
            Type: '($x=2 or $x=3)',
            IsPrgStatus: 1,
        },
        _f: 'Id, Name',
    }, function (u, r, l, t) {
        if (accInfo.role != role.officeManager && accInfo.role != role.seller && accInfo.role > 0) {
            $el.append(jHtml.filterDefaultBranhAndAgentOption);
        }
        for (var i = 0; i < l; i++) {
            if (isAgentAvailable(r[i][0])) {
                $el.append('<option value="' + r[i][0] + '">' + r[i][1] + '</option>');
            }
        }
        $el.val($el.find('option:first').val());
        $el.chosen({ width: "100%", search_contains: true });
    });
};

function getUser(els) {
    var $el = $('#' + els[0]);
    var _c = {
        CompId: app.cid,
        Type: 1,
        IsPrgStatus: 1,
    }
    if ($('#' + els[1]).val() != '' && $('#' + els[1]).val() != null) _c.AgentId = $('#' + els[1]).val();
    vRqs({
        _a: 'fGetAccount',
        _c: _c,
        _f: 'Id, Username, AgentId',
    }, function (u, r, l, t) {

        if (accInfo.role != role.seller && accInfo.role > 0) {
            $el.append(jHtml.filterDefaultUserOption);
        }
        for (var i = 0; i < l; i++) {
            var us = { id: r[i][0], username: r[i][1], agentId: r[i][2] };
            if (isUserAvailable(us)) {
                $el.append('<option data-agentId="' + r[i][2] + '" value="' + r[i][0] + '">' + r[i][1] + '</option>');
            }
        }
        $el.val($el.find('option:first').val());
        $el.chosen({ width: "100%", search_contains: true });
    });
};

function getRouteTime(els) {
    var $el = $('#' + els[0]);
    var $t = $('#' + els[1]);
    var date = vDtToStr('iso', vGtDptTm($('#fromdate').val(), "00:00"));
    vRqs({
        _a: 'fGetTrip',
        _c: {
            CompId: "$x = " + app.cid + " and (Type = 1 or (Type = 2 and Time is not null and Date = '" + date + "'))",
            IsPrgStatus: 1,
        },
        _f: 'Id, BaseId, Name, StatusInfo, Info, Time',
    }, function (u, r, l, t) {
        $el.empty();
        var lTrip = [];
        for (var i = 0; i < l; i++)
            if (r[i][1] == null) {
                var t = { Base: r[i], a: [] };
                var t1 = r[i][4].split('~');
                for (var j = 0; j < t1.length; j++)
                    t.a.push({ Time: t1[j], Status: r[i][3] }); //STATUS
                for (var j = 0; j < l; j++) {
                    if (r[j][1] == r[i][0]) {
                        if (r[i][4].indexOf(r[j][5]) >= 0) {
                            for (var k = 0; k < t.a.length; k++)
                                if (t.a[k].Time == r[j][5]) { t.a[k].Status = r[j][3]; break; } //STATUS
                        }
                        else t.a.push({ Time: r[j][5], Status: r[j][3] }); //STATUS
                    }
                }
                lTrip.push(t);
                $el.append('<option value="' + r[i][0] + '">' + r[i][2] + '</option>');
            }
        $el.val($el.find('option:first').val());
        $el.change(function () {
            $t.empty();
            for (var i = 0; i < lTrip.length; i++) {
                if (lTrip[i].Base[0] == $el.val()) {
                    for (var j = 0; j < lTrip[i].a.length; j++) {
                        $t.append('<option value="' + lTrip[i].a[j].Time + '">'
                            + lTrip[i].a[j].Time + (lTrip[i].a[j].Status == 3 ? ' - Hủy' :
                            (lTrip[i].a[j].Status == 2 ? ' - Thêm ' : '')) + '</option>');
                    }
                }
            }
        });
        $el.trigger('change');
    });
};

function getRouteTimeNo(els) {
    var $el = $('#' + els[0]);
    var $t = $('#' + els[1]);
    var $d = $('#' + els[2]);
    if ($d.val() != '') {
        var date = vDtToStr('iso', vGtDptTm($d.val(), "00:00"));
        vRqs({
            _a: 'fGetTrip',
            _c: {
                CompId: "$x = " + app.cid + " and (Type = 1 or (Type = 2 and Time is not null and Date = '" + date + "'))",
                IsPrgStatus: 1,
            },
            _f: 'Id, BaseId, Name, StatusInfo, Info, Time',
        }, function (u, r, l, t) {
            $el.empty();

            $el.append(jHtml.filterDefaultRouteOption);
            var lTrip = [];
            for (var i = 0; i < l; i++)
                if (r[i][1] == null) {
                    var t = { Base: r[i], a: [] };
                    var t1 = r[i][4].split('~');
                    for (var j = 0; j < t1.length; j++)
                        t.a.push({ Time: t1[j], Status: r[i][3] }); //STATUS
                    for (var j = 0; j < l; j++) {
                        if (r[j][1] == r[i][0]) {
                            if (r[i][4].indexOf(r[j][5]) >= 0) {
                                for (var k = 0; k < t.a.length; k++)
                                    if (t.a[k].Time == r[j][5]) {
                                        t.a[k].Status = r[j][3];
                                        break;
                                    } //STATUS
                            } else t.a.push({ Time: r[j][5], Status: r[j][3] }); //STATUS
                        }
                    }
                    lTrip.push(t);
                    $el.append('<option value="' + r[i][0] + '">' + r[i][2] + '</option>');
                }
            $el.val($el.find('option:first').val());
            $el.change(function () {
                $t.empty();
                $t.append(jHtml.filterDefaultTripTimeOption);
                if ($el.val() != '') {
                    for (var i = 0; i < lTrip.length; i++) {
                        if (lTrip[i].Base[0] == $el.val()) {
                            for (var j = 0; j < lTrip[i].a.length; j++) {
                                $t.append('<option value="' + lTrip[i].a[j].Time + '">'
                                    + lTrip[i].a[j].Time + (lTrip[i].a[j].Status == 3 ? ' - Hủy' :
                                    (lTrip[i].a[j].Status == 2 ? ' - Thêm ' : '')) + '</option>');
                            }
                        }
                    }
                }
            });
            $el.trigger('change');
        });
    } else {
        $el.empty();
        $el.append(jHtml.filterDefaultRouteOption);
        $t.empty();
        $t.append(jHtml.filterDefaultTripTimeOption);
    }

};

function getBranchEmployer(els) {
    var $el = $('#' + els[0]);
    var $user = $('#' + els[1]);
    vRqs({
        _a: 'fGetCompany',
        _c: {
            BaseId: app.cid,
            IsPrgStatus: 1,
            Type: 2,
        },
        _f: 'Id, Name',
    }, function (u, r, l, t) {
        $el.empty();

        if (accInfo.role != role.officeManager && accInfo.role != role.seller && accInfo.role > 0) {
            $el.append(jHtml.filterDefaultBranhOption);
        }
        if (u && l > 0) {
            for (var i = 0; i < l; i++) {
                if (isAgentAvailable(r[i][0])) {
                    $el.append('<option value="' + r[i][0] + '">' + r[i][1] + '</option>');
                }
            }
            $el.chosen({ width: "100%", search_contains: true });
        }


        $el.val($el.find('option:first').val());
        $el.trigger('change');
        $el.change(function () {
            var _c = {
                CompId: app.cid,
                Type: 1,
                IsPrgStatus: 1,
                Username: "$x not like N'admin.%'"
            }
            if ($(this).val() != '' && $(this).val() != null) _c.AgentId = $(this).val();
            vRqs({
                _a: 'fGetAccount',
                _c: _c,
                _f: 'Id, Username, AgentId',
            }, function (uu, rr, ll, tt) {
                $user.html("");
                $user.append(jHtml.filterDefaultUserOption);
                for (var ii = 0; ii < ll; ii++) {
                    $user.append('<option data-agentId="' + rr[ii][2] + '" value="' + rr[ii][0] + '">' + rr[ii][1] + '</option>');
                }
                $user.val($user.find('option:first').val());
                $user.data("chosen").destroy().chosen();
                $user.chosen({ width: "100%", search_contains: true });

            });
        });
    });
};

$.getRouteTime = function ($el, $t, date) {
    vRqs(
        { _a: 'fGetTrip', _c: { CompId: "$x = " + app.cid + " and (Type = 1 or (Type = 2 and Time is not null and Date = '" + date + "'))", }, _f: 'Id, BaseId, Name, StatusInfo, Info, Time', },
        function (u, r, l, t) {
            $el.empty();
            var lTrip = [];
            for (var i = 0; i < l; i++)
                if (r[i][1] == null) {
                    var t = { Base: r[i], a: [] };
                    var t1 = r[i][4].split('~');
                    for (var j = 0; j < t1.length; j++)
                        t.a.push({ Time: t1[j], Status: r[i][3] }); //STATUS
                    for (var j = 0; j < l; j++) {
                        if (r[j][1] == r[i][0]) {
                            if (r[i][4].indexOf(r[j][5]) >= 0) {
                                for (var k = 0; k < t.a.length; k++)
                                    if (t.a[k].Time == r[j][5]) {
                                        t.a[k].Status = r[j][3];
                                        break;
                                    } //STATUS
                            } else t.a.push({ Time: r[j][5], Status: r[j][3] }); //STATUS
                        }
                    }
                    lTrip.push(t);
                    $el.append('<option value="' + r[i][0] + '">' + r[i][2] + '</option>');
                }
            $el.val($el.find('option:first').val());
            $el.change(function () {
                $t.empty();
                for (var i = 0; i < lTrip.length; i++) {
                    if (lTrip[i].Base[0] == $el.val()) {
                        for (var j = 0; j < lTrip[i].a.length; j++) {
                            $t.append('<option value="' + lTrip[i].a[j].Time + '">' + lTrip[i].a[j].Time + (lTrip[i].a[j].Status == 3 ? ' - Hủy' : (lTrip[i].a[j].Status == 2 ? ' - Thêm ' : '')) + '</option>');
                        }
                    }
                }
            });
            $el.trigger('change');
        });
}

function reloadPickupDate(els) {
    var $el = $('#' + els[0]);
    var $ell = $('#' + els[1]);
    var $elll = $('#' + els[2]);
    $el.change(function () {
        $ell.unbind('change');
        $.getRouteTime($ell, $elll, vDtToStr('iso', vGtDptTm($el.val(), "00:00")));
    });
};

function rpCustomerByTrip(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var route = $('#' + els[1]).val();
    var routeName = $('#' + els[1]).find('option:selected').text();
    var time = $('#' + els[2]).val();
    var bus = 0;
    var strW = " '" + vDtToStr('iso', vGtDptTm(fromdate.replace(/\//gi, '-'), time)) + "'=TripDate " +
                " and CompId = " + app.cid +
                " and TripId = " + route +
                " and TripAlias = " + bus +
                " and Type != 2 and Type != 3";
    obj._a = 'rpCustomerByTrip';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 8,
        mArrArgSumary: [8, 9, 10],
        reportId: 102,
        strOrderBy: ' order by SeatCode ',
        hdValue: 'Tuyến ' + routeName + '<br />Khởi hành lúc ' + time + ' ngày ' + fromdate,
        classRowSumGobal: 'danger-total text-right',
        classCol: [
            [0, 'text-center'],
            [1, 'text-center'],
            [2, 'text-center'],
            [3, 'text-center'],
            [6, 'text-center'],
            [7, 'text-center'],
            [8, 'text-right'],
            [9, 'text-right'],
            [10, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as " +
        query: ["select SUBSTRING(SeatCode, 0 , CHARINDEX('|', SeatCode)) as SeatCode, " +
                      "SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))), 0, CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))))) as Name, " +
                      "SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))), CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))))) + 1, LEN(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))))), 0, CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))), CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))))) + 1, LEN(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))))))) as Phone, " +
                      "SUBSTRING(PickupInfo, 0, CHARINDEX('|', PickupInfo)) as Pickup, " +
                      "SUBSTRING(SUBSTRING(PickupInfo, CHARINDEX('|', PickupInfo) + 1, LEN(PickupInfo)), 0, CHARINDEX('|', SUBSTRING(PickupInfo, CHARINDEX('|', PickupInfo) + 1, LEN(PickupInfo)))) as Transfer, " +
                      "Fare, Deposit, Surcharge, Discount, CancelFee, " +
                      "SUBSTRING(PaymentInfo, CHARINDEX(':', PaymentInfo) + 1, " +
                      "case when CHARINDEX(':', SUBSTRING(PaymentInfo, CHARINDEX(':', PaymentInfo) + 1, " +
                      "LEN(PaymentInfo))) = 0 then 0 else CHARINDEX(':', SUBSTRING(PaymentInfo, " +
                      "CHARINDEX(':', PaymentInfo) + 1, LEN(PaymentInfo))) - 1 end) as Payment, " +
                      "case when Status = 2 then N'Đã TT' else case when Status = 3 then N'Hủy' " +
                      "else case when Status = 4 then N'Ko đến' else  case when Status = 1 then N'Đặt chỗ' " +
                      "else case when Status = 8 then N'Giữ chỗ' else case when Status = 5 then N'VIP' " +
                      "else CONVERT(NVARCHAR, Status) end " +
                      "end end end end end as Status, " +
                      "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
                      "case when Status = 3 then CancelFee " +
                      "else case when Status = 5 then 0 else " +
                      "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
                      "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
                      "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
                      "end end end as Total " +
                      //"from Report1 where " + strW],
                      "from Report1"],

    };
};

function rpCustomerByTripForSapa(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var route = $('#' + els[1]).val();
    var routeName = $('#' + els[1]).find('option:selected').text();
    var time = $('#' + els[2]).val();
    var bus = 0;
    var strW = " '" + vDtToStr('iso', vGtDptTm(fromdate.replace(/\//gi, '-'), time)) + "'=TripDate " +
                " and CompId = " + app.cid +
                " and TripId = " + route +
                " and TripAlias = " + bus +
                " and Status != 3";
    obj._a = 'rpCustomerByTrip';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 8,
        mArrArgSumary: [8, 9, 10],
        reportId: 109,
        strOrderBy: ' order by SeatCode ',
        hdValue: 'Tuyến ' + routeName + '<br />Khởi hành lúc ' + time + ' ngày ' + fromdate,
        classRowSumGobal: 'danger-total text-right',
        classCol: [
            [0, 'text-center'],
            [1, 'text-center'],
            [2, 'text-center'],
            [3, 'text-center'],
            [6, 'text-center'],
            [7, 'text-center'],
            [8, 'text-right'],
            [9, 'text-right'],
            [10, 'text-right']
        ],
        where: strW,
        query: ["select SUBSTRING(SeatCode, 0 , CHARINDEX('|', SeatCode)) as SeatCode, " +
                      "BranchChargeName, " +
                      "ResponsibilityUser as UserCharge, " +
                      "PickOrReturnDate as PickupDate, " +
                      "CustomerName, CustomerPhone, " +
                      "SUBSTRING(PickupInfo, 0, CHARINDEX('|', PickupInfo)) as Pickup, " +
                      "Fare, Deposit, Surcharge, Discount, CancelFee, " +
                      "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
                      "case when Status = 3 then CancelFee " +
                      "else case when Status = 5 then 0 else " +
                      "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
                      "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
                      "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
                      "end end end as Total " +
                      "from Report1"],
    };
};

function rpStaffByPickupDate(obj, els) {
    var route = $('#' + els[2]).val();
    var routeName = $('#' + els[2]).find('option[value="' + route + '"]').text();
    var fromDate = $('#' + els[0]).val();
    var toDate = $('#' + els[1]).val();
    var branch = $('#' + els[3]).val();
    var branchName = $('#' + els[3]).find('option:selected').text();
    var user = $('#' + els[4]).val();
    var userName = $('#' + els[4]).find('option:selected').text();
    var header = "Từ ngày: " + fromDate + " - 00:00  &#x2192;  " + toDate + " - 23:59";

    if (route != '') {
        header = "Tuyến: " + routeName + "<br />" + header;
    }
    if (branch != '') {
        header += '<br /> Chi nhánh: ' + branchName;
    }
    if (user != '') {
        header += '<br /> Nhân viên: ' + userName;
    }

    var strW = "('" + toFromDateDb(fromDate) + "'<=PickupDate and PickupDate<='" + toToDateDb(toDate) + "') " +
                " and t.CompId = " + app.cid +
                (user != '' ? (" and (UserCharge = N'" + userName + "') ") : " and (UserCharge is not null)") +
                (route != '' ? (' and TripId = ' + route) : ' ') +
                (branch != '' ? (" and a.AgentId=N'" + branch + "'") : '') +
                " and ((Status = 2 and (SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '1' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '9')) or Status = 5 or (Status = 1 and Deposit is not null and Deposit != 0) or (Status = 3 and CancelFee is not null and CancelFee != 0))";

    obj._a = 'rpStaffByPickupDate';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 4,
        mArrArgSumary: [4, 6, 7, 8, 9, 10],
        reportId: 103,
        strOrderBy: ' order by UserCharge,TripIdName, PickupDate ',
        hdValue: header,
        bShowSubSumary: 1,
        classSubRowSumGobal: 'danger-sub-total text-right',
        classRowSumGobal: 'danger-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [3, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [6, 'text-right'],
            [7, 'text-right'],
            [8, 'text-right'],
            [9, 'text-right'],
            [10, 'text-right'],
        ],
        where: strW,
        //alterView: ["alter view Report2 as select t.Id, TripIdName, " +
        query: ["select t.Id, TripIdName, " +
            "SUBSTRING(SeatCode, 0, CHARINDEX('|', SeatCode)) as SeatCode, " +
            "PickupDate, PaymentTypeName, Fare, Deposit, " +
            "case when ChargeDate is null then t.IsPrgCreatedDate else ChargeDate end as SoldDate, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then CreatedUser else UserCharge end as UserCharge, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then Deposit else case when Status = 5 then 0 else Fare end end as Charge, " +
            "case when Status = 3 then (Fare - CancelFee) end as Spend, " +
            "case when CancelFee = 0 then 0 else CancelFee end as CancelFee, " +
            "case when Surcharge = 0 then 0 else Surcharge end as Surcharge, " +
            "case when Discount = 0 then 0 else Discount end as Discount, " +
            "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
            "case when Status = 3 then CancelFee " +
            "else case when Status = 5 then 0 else " +
            "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
            "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
            "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
            "end end end as Total " +
            //"from XIKE_Ticket04 t  left join Account a on a.Username=UserCharge  Where " + strW],
            "from XIKE_Ticket04 t  left join Account a on a.Username=UserCharge"],
        mMaxLevel: 2,

    };
};

function rpStaffBySoldDate(obj, els) {
    var route = $('#' + els[2]).val();
    var routeName = $('#' + els[2]).find('option[value="' + route + '"]').text();
    var fromDate = $('#' + els[0]).val();
    var toDate = $('#' + els[1]).val();
    var branch = $('#' + els[3]).val();
    var branchName = $('#' + els[3]).find('option:selected').text();
    var user = $('#' + els[4]).val();
    var userName = $('#' + els[4]).find('option:selected').text();

    var header = "Từ ngày: " + fromDate + " - 00:00  &#x2192;  " + toDate + " - 23:59";

    if (route != '') {
        header = "Tuyến: " + routeName + "<br />" + header;
    }
    if (branch != '') {
        header += '<br /> Chi nhánh: ' + branchName;
    }
    if (user != '') {
        header += '<br /> Nhân viên: ' + userName;
    }

    //var strW = "('" + toFromDateDb(fromDate) + "'<=SoldDate and SoldDate<='" + toToDateDb(toDate) + "') " +
    //            " and CompId = " + app.cid +
    //            (user != '' ? (" and (UserCharge = N'" + userName + "') ") : " and (UserCharge is not null)") +
    //            (route != '' ? (' and TripId = ' + route) : ' ') +
    //            " and ((Status = 2 and (SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '1' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '9')) or Status = 5 or (Status = 1 and Deposit is not null and Deposit != 0) or (Status = 3 and CancelFee is not null and CancelFee != 0))";

    var strW = " ((ChargeDate is null and '" + toFromDateDb(fromDate) + "'<=IsPrgCreatedDate and IsPrgCreatedDate<='" + toToDateDb(toDate) + "') or " +
                    "('" + toFromDateDb(fromDate) + "'<=ChargeDate and ChargeDate<='" + toToDateDb(toDate) + "')) " +
                " and CompId = " + app.cid +
                (user != '' ? (" and (UserCharge = N'" + userName + "') ") : " and (UserCharge is not null)") +
                (route != '' ? (' and TripId = ' + route) : ' ') +
                (branch != '' ? (" and AgentIdCharge=" + branch + "") : '') +
                " and ((Status = 2 and (SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '1' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '9')) or Status = 5 or (Status = 1 and Deposit is not null and Deposit != 0) or (Status = 3 and CancelFee is not null and CancelFee != 0))";

    obj._a = 'rpStaffBySoldDate';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 5,
        mArrArgSumary: [5, 7, 8, 9, 10, 11],
        reportId: 104,
        strOrderBy: ' order by UserCharge,TripIdName, PickupDate ',
        hdValue: header,
        bShowSubSumary: 1,
        classSubRowSumGobal: 'danger-sub-total text-right',
        classRowSumGobal: 'danger-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [3, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [6, 'text-right'],
            [7, 'text-right'],
            [8, 'text-right'],
            [9, 'text-right'],
            [10, 'text-right'],
            [11, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select Id, TripIdName, " +
        query: ["select Id, TripIdName, " +
            "SUBSTRING(SeatCode, 0, CHARINDEX('|', SeatCode)) as SeatCode, " +
            "PickupDate, PaymentTypeName, Fare, " +
            "case when ChargeDate is null then IsPrgCreatedDate else ChargeDate end as SoldDate, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then CreatedUser else UserCharge end as UserCharge, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then Deposit else case when Status = 5 then 0 else Fare end end as Charge, " +
            "case when Status = 3 then (Fare - CancelFee) end as Spend, " +
            "case when CancelFee = 0 then 0 else CancelFee end as CancelFee, " +
            "case when Surcharge = 0 then 0 else Surcharge end as Surcharge, " +
            "case when Discount = 0 then 0 else Discount end as Discount, " +
            "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
            "case when Status = 3 then CancelFee " +
            "else case when Status = 5 then 0 else " +
            "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
            "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
            "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
            "end end end as Total " +
            //"from XIKE_Ticket04 Where " + strW],
            "from XIKE_Ticket04"],
        mMaxLevel: 2,
    };
};

function rpAgentOrBranchBySoldDate(obj, els) {
    var fromDate = $('#' + els[0]).val();
    var toDate = $('#' + els[1]).val();
    var route = $('#' + els[2]).val();
    var routeName = $('#' + els[2]).find('option:selected').text();
    var branch = $('#' + els[3]).val();
    var branchName = $('#' + els[3]).find('option:selected').text();
    var header = "Từ ngày: " + fromDate + " - 00:00  &#x2192;  " + toDate + " - 23:59";

    if (route != '') {
        header = "Tuyến: " + routeName + "<br />" + header;
    }
    if (branch != '') {
        header = branchName + "<br />" + header;
    }

    var strW = " ((ChargeDate is null and '" + toFromDateDb(fromDate) + "'<=IsPrgCreatedDate and IsPrgCreatedDate<='" + toToDateDb(toDate) + "') or " +
                    "('" + toFromDateDb(fromDate) + "'<=ChargeDate and ChargeDate<='" + toToDateDb(toDate) + "')) " +
                "and CompId = " + app.cid + (route != '' ? (' and TripId = ' + route) : ' ') +
                " and ((Status = 2 and (SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '1')))" +
                (branch != '' ? (" and BranchChargeName = N'" + branchName + "' ") : ' ');
    obj._a = 'rpBranchBySoldDate';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 4,
        mArrArgSumary: [5, 7, 8],
        reportId: 105,
        strOrderBy: ' order by BranchChargeName, UserCharge, TripIdName, PickupDate ',
        hdValue: header,
        classRowSumGobal: 'danger-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [3, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [7, 'text-right'],
            [8, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select BranchChargeName, PickupDate, " +
        query: ["select BranchChargeName, PickupDate, " +
            "Fare, TripIdName, Note,  " +
            "Substring(SeatCode, 0, Charindex('|', SeatCode)) as SeatCode, " +
            "case when ChargeDate is null then IsPrgCreatedDate else ChargeDate end as SoldDate, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then CreatedUser else UserCharge end as UserCharge, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then Deposit else case when Status = 5 then 0 else Fare end end as Charge, " +
            "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
            "case when Status = 3 then CancelFee " +
            "else case when Status = 5 then 0 else " +
            "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
            "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
            "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
            "end end end as Total " +
            "from XIKE_Ticket04 "],
        mMaxLevel: 2,
    };
}

function rpAgentOrBranchByPickupDate(obj, els) {
    var fromDate = $('#' + els[0]).val();
    var toDate = $('#' + els[1]).val();
    var route = $('#' + els[2]).val();
    var routeName = $('#' + els[2]).find('option:selected').text();
    var branch = $('#' + els[3]).val();
    var branchName = $('#' + els[3]).find('option:selected').text();
    var header = "Từ ngày: " + fromDate + " - 00:00  &#x2192;  " + toDate + " - 23:59";
    if (route != '') {
        header = "Tuyến: " + routeName + "<br />" + header;
    }
    if (branch != '') {
        header = branchName + "<br />" + header;
    }
    var strW = " '" + toFromDateDb(fromDate) + "'<=PickupDate " +
                "and PickupDate<='" + toToDateDb(toDate) + "' " +
                "and CompId = " + app.cid + (route != '' ? (' and TripId = ' + route) : ' ') +
                //" and ((Status = 2 and (SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '1')))" +
                " and Status = 2 " +
                (branch != '' ? (" and BranchChargeName = N'" + branchName + "' ") : ' ');
    obj._a = 'rpBranchByPickupDate';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 4,
        mArrArgSumary: [5, 7, 8],
        reportId: 106,
        strOrderBy: ' order by BranchChargeName, UserCharge, TripIdName, PickupDate ',
        hdValue: header,
        bShowSubSumary: 1,
        classSubRowSumGobal: 'danger-sub-total text-right',
        classRowSumGobal: 'danger-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [3, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [7, 'text-right'],
            [8, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select BranchChargeName, PickupDate, " +
        query: ["select BranchChargeName, PickupDate, " +
            "Fare, TripIdName, Note, " +
            "Substring(SeatCode, 0, Charindex('|', SeatCode)) as SeatCode, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then CreatedUser else UserCharge end as UserCharge, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then Deposit else case when Status = 5 then 0 else Fare end end as Charge, " +
            //"case when Status = 3 then (Fare - CancelFee) end as Spend, " +
            //"case when CancelFee = 0 then 0 else CancelFee end as CancelFee, " +
            //"case when Surcharge = 0 then 0 else Surcharge end as Surcharge, " +
            //"case when Discount = 0 then 0 else Discount end as Discount, " +
            "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
            "case when Status = 3 then CancelFee " +
            "else case when Status = 5 then 0 else " +
            "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
            "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
            "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
            "end end end as Total " +
            "from XIKE_Ticket04 "],
        mMaxLevel: 2,
    };
}

function rpRevenueByTrip(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var route = $('#' + els[1]).val();
    var routeName = $('#' + els[1]).find('option:selected').text();
    var time = $('#' + els[2]).val();
    //var bus = 0;
    var header = "";
    if (route != '') {
        if (time != '') {
            header = "Tuyến " + routeName + "<br />Ngày " + fromdate + " lúc " + time;
        } else {
            header = "Tuyến " + routeName + "<br />Ngày " + fromdate;
        }
    } else {
        header = "Ngày " + fromdate;
    }
    var strW = (time == '' ? (" '" + fromdate.replace(/\//gi, '-') +
        "'=convert(nvarchar(10), TripDate, 105) ") :
        (" '" + vDtToStr('iso', vGtDptTm(fromdate.replace(/\//gi, '-'), time)) + "'=TripDate ")) +
        "and CompId = " + app.cid + (route != '' ? (' and TripId = ' + route) : ' ') +
        //" and (Status = 2 or Status = 5 or (Status = 3 and (CancelFee is not null and CancelFee != 0)))";
        " and (Status = 2 or Status = 5 or (Status = 1 and Deposit is not null and Deposit != 0) or (Status = 3 and CancelFee is not null and CancelFee != 0))";
    obj._a = 'rpRevenueByTrip';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 5,
        //mArrArgSumary: [5, 7, 8, 9, 10, 11, 12, 13, 14],
        mArrArgSumary: [5, 7, 8, 9, 10, 11],
        reportId: 107,
        strOrderBy: ' order by BranchChargeName, TripIdName, TripDate, PaymentTypeName',
        hdValue: header,
        bShowSubSumary: 1,
        classSubRowSumGobal: 'danger-sub-total text-right',
        classRowSumGobal: 'danger-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [6, 'text-center'],
            [7, 'text-right'],
            [8, 'text-right'],
            [9, 'text-right'],
            [10, 'text-right'],
            [11, 'text-right'],
            //[12, 'text-right'],
            //[13, 'text-right'],
            //[14, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select " +
        query: ["select " +
            "BranchChargeName, PaymentTypeName, " +
            "case when SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '4' then UserChargeDriverName else " +
            "case when SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '7' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '2' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '6' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '8' then '' else " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then CreatedUser else " +
            "case when Status = 3 and CanCelFee is not null and CancelFee != 0 then CanceledUserName else UserCharge end end end end as UserChargeName, " +
            "TripIdName, TripDate, " +
            "SUBSTRING(SeatCode, 0, CHARINDEX('|', SeatCode)) as SeatCode, " +
            "Fare, Deposit, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then Deposit else case when Status = 5 then 0 else Fare end end as Charge, " +
            "case when CancelFee = 0 then 0 else CancelFee end as CancelFee, " +
            "case when Status = 3 then (Fare - CancelFee) end as Spend, " +
            "case when Surcharge = 0 then 0 else Surcharge end as Surcharge, " +
            "case when Discount = 0 then 0 else Discount end as Discount, " +
            "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
            "case when Status = 3 then CancelFee " +
            "else case when Status = 5 then 0 else " +
            "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
            "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
            "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
            "end end end as Total " +
            "from XIKE_Ticket04 "],
        mMaxLevel: 2
    };
}

// Báo cáo này dành riêng cho nhà xe 5 Rùm
function rpRevenueByTrip5Rum(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var route = $('#' + els[1]).val();
    var routeName = $('#' + els[1]).find('option:selected').text();
    var time = $('#' + els[2]).val();
    //var bus = 0;
    var header = "";
    if (route != '') {
        if (time != '') {
            header = "Tuyến " + routeName + "<br />Ngày " + fromdate + " lúc " + time;
        } else {
            header = "Tuyến " + routeName + "<br />Ngày " + fromdate;
        }
    } else {
        header = "Ngày " + fromdate;
    }
    var strW = (time == '' ? (" '" + fromdate.replace(/\//gi, '-') +
        "'=convert(nvarchar(10), TripDate, 105) ") :
        (" '" + vDtToStr('iso', vGtDptTm(fromdate.replace(/\//gi, '-'), time)) + "'=TripDate ")) +
        "and CompId = " + app.cid + (route != '' ? (' and TripId = ' + route) : ' ') +
        //" and (Status = 2 or Status = 5 or (Status = 3 and (CancelFee is not null and CancelFee != 0)))";
        " and (Status = 2 or Status = 5 or (Status = 1 and Deposit is not null and Deposit != 0) or (Status = 3 and CancelFee is not null and CancelFee != 0))";
    obj._a = 'rpRevenueByTrip';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 6,
        //mArrArgSumary: [5, 7, 8, 9, 10, 11, 12, 13, 14],
        mArrArgSumary: [6, 8, 9, 10, 11],
        reportId: 161,
        strOrderBy: ' order by BranchChargeName, TripIdName, TripDate, PaymentTypeName',
        hdValue: header,
        bShowSubSumary: 1,
        classSubRowSumGobal: 'danger-sub-total text-right',
        classRowSumGobal: 'danger-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [6, 'text-center'],
            [7, 'text-right'],
            [8, 'text-right'],
            [9, 'text-right'],
            [10, 'text-right'],
            [11, 'text-right'],
            //[12, 'text-right'],
            //[13, 'text-right'],
            //[14, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select " +
        query: ["select " +
            "BranchChargeName, PaymentTypeName, " +
            "case when SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '4' then UserChargeDriverName else " +
            "case when SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '7' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '2' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '6' or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '8' then '' else " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then CreatedUser else " +
            "case when Status = 3 and CanCelFee is not null and CancelFee != 0 then CanceledUserName else UserCharge end end end end as UserChargeName, " +
            "TripIdName, TripDate, " +
            "SUBSTRING(SeatCode, 0, CHARINDEX('|', SeatCode)) as SeatCode, " +
            "Fare, Deposit, FareFormatted, " +
            "case when Status = 1 and Deposit is not null and Deposit != 0 then Deposit else case when Status = 5 then 0 else Fare end end as Charge, " +
            "case when CancelFee = 0 then 0 else CancelFee end as CancelFee, " +
            "case when Status = 3 then (Fare - CancelFee) end as Spend, " +
            "case when Surcharge = 0 then 0 else Surcharge end as Surcharge, " +
            "case when Discount = 0 then 0 else Discount end as Discount, " +
            "case when Status = 1 then (case when Deposit is null or Deposit = 0 then 0 else Deposit end) else " +
            "case when Status = 3 then CancelFee " +
            "else case when Status = 5 then 0 else " +
            "((case when Fare = 0 or Fare is null then 0 else Fare end) + " +
            "(case when Surcharge = 0 or Surcharge is null then 0 else Surcharge end) - " +
            "(case when Discount = 0 or Discount is null then 0 else Discount end )) " +
            "end end end as Total " +
            "from XIKE_Ticket04 "],
        mMaxLevel: 2
    };
}

//TODO: câu điều kiện where cần kiểm tra lại
function rpRevenueByRoute(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var todate = $('#' + els[1]).val();
    var route = $('#' + els[2]).val();
    var routeName = $('#' + els[2]).find('option:selected').text();
    var header = 'Từ ngày ' + fromdate + ' 00:00 đến ' + todate + ' 23:59';
    if (route != '') {
        header = 'Tuyến: ' + routeName + '<br />' + header;
    }
    var strW = " '" + toFromDateDb(fromdate) + "'<=TripDate " +
                    "and TripDate<='" + toToDateDb(todate) + "' " +
                    "and CompId = " + app.cid + (route != '' ? (' and TripId = ' + route) : ' ') + " AND Status != 1 AND Status != 8 GROUP BY TripIdName, AgentIdName";
    obj._a = 'rpRevenueByRoute';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 3,
        mArrArgSumary: [3, 4, 5, 6],
        reportId: 108,
        strOrderBy: ' order by TripIdName asc ',
        hdValue: header,
        classRowSumGobal: 'danger-total text-right',
        classSubRowSumGobal: 'danger-sub-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [1, 'text-center'],
            [2, 'text-right'],
            [3, 'text-right'],
            [4, 'text-right'],
            [5, 'text-right'],
            [6, 'text-right'],
            [7, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select TripIdName, AgentIdName," +
        query: ["select TripIdName, AgentIdName," +
            //"COUNT(DISTINCT TRIPID) AS TotalRoute, " +
            //"COUNT(DISTINCT TRIPDATE) AS TotalTrip, " +
            "COUNT(case when Status != 3 then '1' else null end) AS TotalTicket, " +
            "COUNT(case when Status = 3 and (CancelFee is null or CancelFee = 0) then '1' else null end) As TotalCancel, " +
            "COUNT(case when Status = 3 and CancelFee is not null and CancelFee != 0 then '1' else null end) As TotalCancelFee, " +
            "SUM(case when Status = 3 then case when CancelFee is null then 0 " +
            "else CancelFee end else case when Status = 5 then 0 else " +
            "case when (PaymentInfo is null or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) != '9') " +
            "then (case when Fare is null then 0 else Fare end + case when Surcharge is null then 0 " +
            "else Surcharge end - case when Discount is null then 0 else Discount end ) " +
            "else 0 end end end) AS Total " +
            "FROM XIKE_Ticket04 "],
        mMaxLevel: 2
    };

}
function rpBranchByRoute(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var todate = $('#' + els[1]).val();
    var route = $('#' + els[2]).val();
    var branch = $('#' + els[3]).val();
    var branchName = $('#' + els[3]).find('option:selected').text();
    var routeName = $('#' + els[2]).find('option:selected').text();
    var header = 'Từ ngày ' + fromdate + ' 00:00 đến ' + todate + ' 23:59';
    if (route != '') {
        header = "Chuyến: " + routeName + "<br />" + header;
    }
    if (branch != '') {
        header = branchName + "<br />" + header;
    }

    var strW = " '" + toFromDateDb(fromdate) + "'<=TripDate " +
        "and TripDate<='" + toToDateDb(todate) + "' " +
        "and CompId = " + app.cid + (route != '' ? (' and TripId = ' + route) : ' ') +
        (branch != '' ? (" and UserChargeAgentId='" + branch + "' ") : " ") + " AND Status != 1 AND Status != 8 " +
        "GROUP BY TripIdName, AgentIdName";
    ;
    obj._a = 'rpRevenueByRoute';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 3,
        mArrArgSumary: [3, 4, 5, 6],
        reportId: 108,
        strOrderBy: ' order by TripIdName, AgentIdName asc ',
        hdValue: header,
        classRowSumGobal: 'danger-total text-right',
        classSubRowSumGobal: 'danger-sub-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [1, 'text-center'],
            [2, 'text-right'],
            [3, 'text-right'],
            [4, 'text-right'],
            [5, 'text-right'],
            [6, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select TripIdName, AgentIdName," +
        query: ["select TripIdName, AgentIdName," +
            "COUNT(DISTINCT TRIPID) AS TotalRoute, " +
            "COUNT(DISTINCT TRIPDATE) AS TotalTrip, " +
            "COUNT(case when Status != 3 then '1' else null end) AS TotalTicket, " +
            "COUNT(case when Status = 3 and (CancelFee is null or CancelFee = 0) then '1' else null end) As TotalCancel, " +
            "COUNT(case when Status = 3 and CancelFee is not null and CancelFee != 0 then '1' else null end) As TotalCancelFee, " +
            "SUM(case when Status = 3 then case when CancelFee is null then 0 " +
            "else CancelFee end else case when Status = 5 then 0 else " +
            "case when (PaymentInfo is null or SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) != '9') " +
            "then (case when Fare is null then 0 else Fare end + case when Surcharge is null then 0 " +
            "else Surcharge end - case when Discount is null then 0 else Discount end ) " +
            "else 0 end end end) AS Total " +
            "FROM XIKE_Ticket04"],
        mMaxLevel: 2
    };
}
function rpVexereRevenue(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var todate = $('#' + els[1]).val();
    var route = $('#' + els[2]).val();
    var routeName = $('#' + els[2]).find('option:selected').text();
    var header = 'Từ ngày ' + fromdate + ' 00:00 đến ' + todate + ' 23:59';
    if (route != '') {
        header = "Chuyến: " + routeName + "<br />" + header;
    }

    var strW = " '" + toFromDateDb(fromdate) + "'<=TripDate " +
                    "and TripDate<='" + toToDateDb(todate) + "' " +
                    "and CompId = " + app.cid + (route != '' ? (' and TripId = ' + route) : ' ') + " and" +
            " AgentId in (74, 135) and Status != 3";
    obj._a = 'rpVexereRevenue';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 4,
        mArrArgSumary: [4, 5, 6, 7],
        reportId: 110,
        strOrderBy: ' order by PaymentType desc, TripIdName asc, DepartureDate asc ',
        hdValue: header,
        bShowSubSumary: 1,
        classRowSumGobal: 'danger-total text-right',
        classSubRowSumGobal: 'danger-sub-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [1, 'text-right'],
            [2, 'text-right'],
            [3, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [6, 'text-center'],
            [7, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select " +
        query: ["select " +
            "(case when (UserCharge like N'%.vxr' or UserCharge like N'%.vexere' or UserCharge like N'%.lovabus') then N'Vexere' else N'Khác' end) as PaymentType," +
            "TripIdName, CustomerPhone, " +
            "TripDate as DepartureDate," +
            "Code as TicketCode," +
            "SUBSTRING(SeatCode, 0, CHARINDEX('|', SeatCode)) as SeatCode," +
            "Total as TotalMoney " +
            //"from XIKE_Ticket04 where " + strW],
            "from XIKE_Ticket04"],
        mMaxLevel: 2
    };
}
function rpVexere(obj, els) {
    var fromdate = $('#' + els[0]).val();
    var todate = $('#' + els[1]).val();
    var comp = $('#' + els[2]).val();
    var compName = $('#' + els[2]).find('option:selected').text();
    var route = $('#' + els[3]).val();
    var routeName = $('#' + els[3]).find('option:selected').text();

    var header = 'Từ ngày ' + fromdate + ' 00:00 đến ' + todate + ' 23:59';
    header += comp != '' ? ('<br />' + compName) : '';
    header += route != '' ? ('<br />' + routeName) : '';

    var strW = " '" + toFromDateDb(fromdate) + "'<=TripDate " +
        "and TripDate<='" + toToDateDb(todate) + "' " +
        (comp != '' ? (' and t.CompId = ' + comp) : ' ') +
        (route != '' ? (' and t.TripId = ' + route) : ' ') + " and (t.Type=2 or t.Type=3) and Status=2 and (t.IsPrgStatus is null or t.IsPrgStatus != 3)"
    ;

    obj._a = 'rpVexere';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 7,
        mArrArgSumary: [7, 8],
        reportId: 111,
        strOrderBy: ' order by PaymentType desc, TripIdName asc ',
        hdValue: header,
        bShowSubSumary: 1,
        classRowSumGobal: 'danger-total text-right',
        classSubRowSumGobal: 'danger-sub-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [1, 'text-right'],
            [2, 'text-right'],
            [3, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [6, 'text-center'],
            [7, 'text-center'],
            [8, 'text-right'],
            [10, 'text-center'],
            [11, 'text-center']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select " +
        query: ["select " +
            " c.Name as CompName,TripIdName, TripDate as DepartureDate, " +
            "t.IsPrgCreatedDate as IsPrgCreatedDate, t.Note, t.CreatedUser, t.UserCharge," +
            //"case when Status = 1 and Deposit is not null and Deposit != 0 then CreatedUser else UserCharge end as UserCharge, " +
            //" t.Code as TicketCode," +
            //"PaymentInfo,t.Type, " +
            "SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))), 0, CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))))) as CustomerName, " +
            "SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))), CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))))) + 1, LEN(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))))), 0, CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))), CHARINDEX('|', SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))))) + 1, LEN(SUBSTRING(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))), CHARINDEX('|', SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo))))) + 1, LEN(SUBSTRING(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)), CHARINDEX('|', CustomerInfo) + 1, LEN(SUBSTRING(CustomerInfo, CHARINDEX('|', CustomerInfo) + 1, LEN(CustomerInfo)))))))))) as CustomerPhone, " +
            " SUBSTRING(SeatCode, 0, CHARINDEX('|', SeatCode)) as SeatCode, " +
            " case  when t.Type=2 then 'Online' else case when SUBSTRING(PaymentInfo, 0, CHARINDEX(':', PaymentInfo)) = '7' then 'Vexere' else 'Nhaxe' end end as PaymentType, " +
            " Total as TotalMoney " +
            " from XIKE_Ticket04 t left join Company c on c.Id=t.CompId "],
        //" where (t.Type=2 or t.Type=3) and Status=2 and (t.IsPrgStatus is null or t.IsPrgStatus != 3) " +
        //" and " + strW],
        //" and "],
        mMaxLevel: 2
    };
}
function rpRevenueByCreatedUser(obj, els) {
    var route = $('#' + els[2]).val();
    var routeName = $('#' + els[2]).find('option[value="' + route + '"]').text();
    var fromDate = $('#' + els[0]).val();
    var toDate = $('#' + els[1]).val();
    var branch = $('#' + els[3]).val();
    var branchName = $('#' + els[3]).find('option:selected').text();
    var user = $('#' + els[4]).val();
    var userName = $('#' + els[4]).find('option:selected').text();
    var status = $('#' + els[5]).val();

    var header = "Từ ngày: " + fromDate + " - 00:00  &#x2192;  " + toDate + " - 23:59";

    if (route != '') {
        header = "Tuyến: " + routeName + "<br />" + header;
    }
    if (branch != '') {
        header += '<br /> Chi nhánh: ' + branchName;
    }
    if (user != '') {
        header += '<br /> Nhân viên: ' + userName;
    }

    var strW = " ('" + toFromDateDb(fromDate) + "'<=PickupDate and PickupDate<='" + toToDateDb(toDate) + "') " +
        " and CompId = " + app.cid +
        (user != '' ? (" and (CreatedUser = N'" + userName + "') ") : " ") +
        (status != '' ? (" and (Status = " + status + ") ") : " ") +
        (route != '' ? (' and TripId = ' + route) : ' ') +
        '  and AgentId<>135 and Status<>2 ' +
        (branch != '' ? (" and AgentId=" + branch + "") : '');

    obj._a = 'rpRevenueByCreatedUser';
    obj._cf = {
        bShowIndexRow: false,
        mColMergForSubSumRow: 6,
        mArrArgSumary: [6, 10],
        reportId: 112,
        strOrderBy: ' order by CreatedUser,Status, CancelReason, TripIdName ',
        hdValue: header,
        bShowSubSumary: 1,
        classSubRowSumGobal: 'danger-sub-total text-right',
        classRowSumGobal: 'danger-total text-right',
        classListItem: 'success-total text-right',
        classCol: [
            [0, 'text-center'],
            [3, 'text-center'],
            [4, 'text-center'],
            [5, 'text-center'],
            [6, 'text-right'],
            [7, 'text-right'],
            [8, 'text-right'],
            [9, 'text-right'],
            [10, 'text-right'],
            [11, 'text-right']
        ],
        where: strW,
        //alterView: ["alter view Report2 as select " +
        query: ["select " +
            "case when Status =1 then N'Đã đặt' else case when Status=2 then N'Đã thanh toán' else N'Đã hủy' end end as Status," +
            "case when Status=3 then (case when CancelType=1 then N'Nhà xe hủy' else case when CancelType=2 then N'Khách hàng hủy' else case when CancelType=3 then N'Đại lý hủy' else N'Khác' end end end) else '' end as CancelReason,  " +
            "TripIdName, AgentIdName, " +
            "SUBSTRING(SeatCode, 0, CHARINDEX('|', SeatCode)) as SeatCode, " +
            "PickupDate, Fare, IsPrgCreatedDate as CreatedDate, CreatedUser, " +
            "case when CancelInfo !=null then CancelInfo else N'' end as CancelNote " +
            //"from XIKE_Ticket04 Where " + strW],
            "from XIKE_Ticket04"],
        mMaxLevel: 3,
    };
}
function toFromDateDb(date) {
    return vDtToStr('iso', vGtDptTm(date.replace(/\//gi, '-'), '00:00'));
}
function toToDateDb(date) {
    return vDtToStr('iso', vGtDptTm(date.replace(/\//gi, '-'), '23:59'));
}
(function ($) {
    $.widget('custom.report', {
        options: {}, reportObj: {}, filter: {},

        load: function (opt) {
            this.renderView(opt);
        },

        renderView: function (opt) {
            this.options = opt;
            this.element.html(jHtml.initHtml);
            this.renderReportTypes();
            this.reportObj = opt.listReport[parseInt($(jHtml.reportTypes).find('option:selected').attr('data-index'))];
            this.filter = this.reportObj.filter;
            this.initView();
            this.bindEvent();
        },

        renderReportTypes: function () {
            var $box = $('<div />').addClass('pl0');
            var $el = $(jHtml.reportTypesSelect);
            for (var i = 0; i < this.options.listReport.length; i++) {
                if (typeof _dict._hasReportPermission != "undefined" && _dict._hasReportPermission) {
                    if (app.rights.indexOf($.rights.rAllRpt.val) != -1) {
                        $el.append(vtpl(jHtml.reportTypeOption, {
                            index: i,
                            value: this.options.listReport[i].value,
                            text: this.options.viewNameReport == 0 ? this.options.listReport[i].name : ((i + 1) + '. ' + this.options.listReport[i].name)
                        }));
                    } else {
                        if (typeof this.options.listReport[i].rightId != 'undefined'
                            && app.rights.indexOf(this.options.listReport[i].rightId) != -1) {
                            $el.append(vtpl(jHtml.reportTypeOption, {
                                index: i,
                                value: this.options.listReport[i].value,
                                text: this.options.viewNameReport == 0 ? this.options.listReport[i].name : ((i + 1) + '. ' + this.options.listReport[i].name)
                            }));

                        }
                    }
                } else {
                    $el.append(vtpl(jHtml.reportTypeOption, {
                        index: i,
                        value: this.options.listReport[i].value,
                        text: this.options.viewNameReport == 0 ? this.options.listReport[i].name : ((i + 1) + '. ' + this.options.listReport[i].name)
                    }));
                }
            }

            $(jHtml.reportTypesBox).append($box.append($el)).append($box.append(vtpl(jHtml.reportHelpHtml, { title: helps[0].ex })));
        },

        initView: function (fromDate, toDate) {
            for (var i = 0; i < this.filter._v.length; i++) {
                var d = this.filter._d[i].split(',');
                $(jHtml.filterBox).append(vtpl(jHtml.filterHtml, {
                    label: this.filter._v[i] + ': ',
                    labelDisplay: this.filter._v[i] == '' ? 'none' : 'display',
                    class1: d[0] + '-group',
                    element: $('<' + d[0] + ' id="' + d[7] + '"/>').addClass('form-control').clone().wrapAll("<div/>").parent().html(),
                    spanDisplay: d[1] == '3' ? 'display' : 'none'
                }));
            }
            if ($(jHtml.fromDate).length > 0) {
                $(jHtml.fromDate).unbind();
                $(jHtml.fromDate).val(fromDate == null ? vGetNow().replace(/-/gi, '/') : fromDate);
                $(jHtml.fromDate).datepicker({
                    dateFormat: jVar.filterDateFormat,
                });
                $(jHtml.fromDate).next().click(function () {
                    $(this).prev().datepicker('show');
                });
            }
            if ($(jHtml.toDate).length > 0) {
                $(jHtml.toDate).unbind();
                $(jHtml.toDate).val(toDate == null ? vGetNow().replace(/-/gi, '/') : toDate);
                $(jHtml.toDate).datepicker({
                    dateFormat: jVar.filterDateFormat,
                });
                $(jHtml.toDate).next().click(function () {
                    $(this).prev().datepicker('show');
                });
            }

            for (var j = 0; j < this.filter._v.length; j++) {
                var dd = this.filter._d[j].split(',');
                if (typeof window[$.trim(dd[3])] === "function") {
                    (dd[4] == '') ? window[$.trim(dd[3])]() : window[$.trim(dd[3])](dd[4].split('~'));
                }
            }

        },

        bindEvent: function () {
            var me = this;
            $(jHtml.buttonCreateReport).click(function () {
                var obj = {};
                var typeVal = $(jHtml.reportTypes).val();
                if (typeof window[typeVal] === 'function') {
                    if (me.reportObj.typereport == '')
                        window[typeVal](obj);
                    else {
                        var c = me.reportObj.typereport.split(',');
                        var els = [];
                        for (var i = 0; i < c.length; i++) {
                            els.push(me.filter._d[c[parseInt(i)]].split(',')[7]);
                        }
                        window[typeVal](obj, els);
                    }
                    $(jHtml.contentBox).html(jHtml.loadingSpinner);
                    vRqr(obj, function (msg) {
                        $(jHtml.contentBox).html(msg).find('.rptTable').addClass('table table-bordered');
                        var link = $(jHtml.excelLink).attr('href');
                        $(jHtml.buttonExcel).prop('href', link);
                        if ($(jHtml.excelLink).hasClass(jHtml.largeResult)) { // large result
                            $(jHtml.contentBox).html(vtpl(jHtml.largeResultHtml, { link: link }));
                        }
                    });
                } else {
                    alert(jVar.errorMessage_LoadReport);
                }
            });

            $(jHtml.buttonPrintReport).click(function () {
                var windowName = 'BookingSheet' + (new Date()).getTime();
                var printWindow = window.open('about:blank', windowName, 'scrollbars=1');
                printWindow.document.title = windowName;
                printWindow.document.write($(jHtml.printHtml).append($(jHtml.contentBox).html()).html());
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            });

            $(jHtml.reportTypes).change(function () {
                var fromDate = vGetNow().replace(/-/gi, '/');
                var toDate = fromDate;
                if ($(jHtml.fromDate).length > 0) {
                    fromDate = $(jHtml.fromDate).val();
                }
                if ($(jHtml.toDate).length > 0) {
                    toDate = $(jHtml.toDate).val();
                }
                $(jHtml.filterBox).html('');
                $(jHtml.contentBox).html('');
                var idRpt = parseInt($(jHtml.reportTypes).find('option:selected').attr('data-index'));
                $(jHtml.reportTypes).parent().find('.explain-report').attr('data-original-title', helps[idRpt].ex);
                me.reportObj = me.options.listReport[idRpt];
                me.filter = me.reportObj.filter;
                me.initView(fromDate, toDate);
            });
        },
    });
})(jQuery);


