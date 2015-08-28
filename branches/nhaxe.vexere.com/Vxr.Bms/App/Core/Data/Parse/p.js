function vGln(n) {
    /// <summary>
    /// Get lastname
    /// </summary>
    /// <param name="n">Full name</param>
    var r = ''; // get only last name
    if (n && n.length > 11) {
        var nameSplit = n.trim().split(' ');
        switch (nameSplit.length) {
            case 0:
                break;
            case 1:
                r = nameSplit[0];
                break;
            case 2:
                r = nameSplit[1];
                break;
            case 3:
                r = nameSplit[2];
                break;
            case 4:
                r = nameSplit[3];
                break;
            case 5:
                r = nameSplit[4];
                break;
        }
    } else r = n;
    return r;
};

function vGai(d) {
    /// <summary>
    /// Get area id
    /// </summary>
    /// <param name="d">Data</param>
    var idx = d.indexOf('~');
    var result = d.substr(idx + 1, d.length).split('|');
    return result[0];
};

function vGsn(s) {
    /// <summary>
    /// Get seat number (lấy thông tin tổng số ghế dựa vào thông tin sơ đồ ghế)
    /// </summary>
    /// <param name="s"></param>
    var s1 = s.split('~');
    var s2 = s1[1].split('|');
    return parseInt(s2[2]);
};

function vGfa(s) {
    /// <summary>
    /// Get fare
    /// </summary>
    /// <param name="d">Fare info</param>
    var r = s.split('|');
    return vToMn(r[2]);
};

function vGpp(s, f) {
    /// <summary>
    /// Get Seat Price Property
    /// </summary>
    /// <param name="s">Fare Info</param>
    /// <param name="f">Field name</param>
    var format = 'Version|Price~[FromRouteStopIndex|ToRouteStopIndex|Price|Unit|ConditionType|ConditionInfo~FromRouteStopIndex|ToRouteStopIndex|Price|Unit|ConditionType|ConditionInfo]';
    var lv1 = format.split('~'); var dataLv1 = s.split('~');
    if (f == 'Price') {
        var arr = lv1[0].split('|'); var dataArr = dataLv1[0].split('|'); var idx = _.indexOf(arr, f);
        return vToMn(dataArr[idx]);
        //return dataArr[idx];
    }
    return '';
};

function vGtp(s, field) {
    /// <summary>
    /// Get (seat) template property
    /// </summary>
    /// <param name="s"></param>
    /// <param name="field"></param>
    if (!s) return "";
    var format = 'Id~Version|TotalFloors|TotalSeats|Type|Code|Name|Note|CSS';
    var lv1 = format.split('~'); var dataLv1 = s.split('~');
    if (field == 'Id') { if (!dataLv1) return ''; return parseInt(dataLv1[0]); }
    var arr = lv1[1].split('|'); var idx = _.indexOf(arr, field); var dataLv2 = dataLv1[1].split('|');
    return dataLv2[idx];
};

function vGvs(i, t, l, n) {
    /// <summary>
    /// Get vehicle save value
    /// </summary>
    /// <param name="i">Id</param>
    /// <param name="t">Type</param>
    /// <param name="l">License plate</param>
    /// <param name="n">Vehicle type name</param>
    return app.mvs + '~' + i + '|' + t + '|' + l + '|' + n;
};

function vGvp(s, n) {
    /// <summary>
    /// Get vehicle property
    /// </summary>
    /// <param name="s">Vehicle info</param>
    /// <param name="n">Name</param>
    if (!s) return '';
    var arr1 = s.split('~');
    if (arr1 && arr1.length > 1) {
        var arr2 = arr1[1].split('|');
        if (arr2 && arr1.length > 1) {
            if (n == 'LicensePlate') return arr2[2];
            if (n == 'Type') return arr2[1];
            if (n == 'Id') return arr2[0];
        }
    }
    return s;
};

function vGas(s) {
    /// <summary>
    /// Get areas array
    /// </summary>
    /// <param name="s">Area info</param>
    var areas = [];
    if (s && s.length > 0) {
        var n = s.indexOf("~");
        if (n >= 0) {
            s = s.substring(n + 1);
            var routes = s.split('~');
            var id;
            $.each(routes, function(index, value) {
                id = vGdi(value, '|', 0);
                areas.push({ Id: id, Name: vGdi(value, '|', 3) });
            });
        }
    }
    return areas;
};

function vGfs(a, s) {
    /// <summary>
    /// Get fares
    /// </summary>
    /// <param name="a">Areas</param>
    /// <param name="s">Info</param>

    var r = []; //Fares
    if (s && s.length > 0) {
        var m = s.indexOf("~");
        if (m >= 0) {
            s = s.substring(m + 1);
            if (s && s.length > 0) {
                var arr = s.split('~');
                var row, from, to, fare, code;
                $.each(arr, function(i, val) {
                    from = vGdi(val, "|", 0);
                    to = vGdi(val, "|", 1);
                    fare = vGdi(val, "|", 2);
                    code = from + '|' + to;
                    row = {
                        Code: code,
                        FromArea: vGetObj({ Id: from }, a),
                        ToArea: vGetObj({ Id: to }, a),
                        Fare: fare
                    };
                    if (row.FromArea && row.ToArea) {
                        r.push(row);
                    }
                });
            }
        }
    }
    return r;
};

function vGpps(s) {
    if (s == null) return [];
    var m = s.indexOf("~");
    var r = []; //Fares
    if (m >= 0) {
        s = s.substring(m + 1);
        var arr = s.split('~');
        var row, from, to, pickedPoint, code;
        $.each(arr, function (i, val) {
            //from = vGdi(val, "|", 0);
            //to = vGdi(val, "|", 1);
            
            //Address: "Chợ Bến Thành"
            //Index: "2"
            //Nearby: "Chợ Bến Thanh"
            //PickedPoint: "Bến Thành"
            //PointId: 2
            //TimePoint: "40"

            //pickedPoint = vGdi(val, "|", 0);
            //1|Hàng Xanh|20|1|100 Điện Biên Phủ|Ngã tư Hàng Xanh|1||
            row = {
                PointId: vGdi(val, "|", 0),
                PointName: vGdi(val, "|", 1),
                PointTime: vGdi(val, "|", 2),
                PointIndex: vGdi(val, "|", 3),
                PointAddress: vGdi(val, "|", 4),
                PointNearBy: vGdi(val, "|", 5),
                PointLocaltionId: vGdi(val, "|", 6)
            };
            
            r.push(row);
        });
    }
    return r;
};

function vGmi(d, m) {
    /// <summary>
    /// Get manufature info => Định dạng lại thông tin nhà sản xuất để lưu xuống db
    /// </summary>
    /// <param name="d">Date</param>
    /// <param name="m">Manufacture</param>
    var r = ''; m = m.trim();
    if (d.trim() == '' || d.length == 0) {
        if (m != '' || m.length > 0) r = '|' + m;
    } else { // kiểm tra ngày sản xuất có đúng định dạng không xx-xx-xxxx
        switch (d.length) {
            case 10:
                if (m != '' || m.length > 0) r = d + '|' + m; else r = d + '|';
                break;
            case 7:
                if (m != '' || m.length > 0) r = '00-' + d + '|' + m; else r = '00-' + d + '|';
                break;
            case 4:
                if (m != '' || m.length > 0) r = '00-00-' + d + '|' + m; else r = '00-00-' + d + '|';
                break;
        }
    }
    return r;
};

function vGma(s) {
    /// <summary>
    /// Get formated manufacture info array => // định dạng lại thông tin ManufactureInfo
    /// </summary>
    /// <param name="s">Manufacture info</param>
    if (vIsEstStr(s) && s != '') {
        var ym = '', nm = '';
        var ar = s.split('|');
        // vị trí thứ nhất trong mảng là năm sản xuất
        // luôn có định dạng xx-xx-xxxx
        // có thể chỉ tồn tại mỗi năm, các thông số còn lại là 00
        if (ar[0].length == 10) {
            var ys = ar[0].split('-');
            if (ys[0] == '00') {
                if (ys[1] == '00') {
                    ym = ys[2];
                    nm = ar[1].trim();
                } else {
                    ym = ys[1] + '-' + ys[2];
                    nm = ar[1].trim();
                }
            } else {
                ym = ar[0];
                nm = ar[1].trim();
            }
        } else {
            ym = '';
            nm = ar[1].trim();
        }
    } else {
        ym = '';
        nm = '';
    }
    return [ym, nm];
};

function vGtmp(s, t, b) {
    /// <summary>
    /// Get team property
    /// </summary>
    /// <param name="s">Team Info</param>
    /// <param name="t">Person Type</param>
    /// <param name="b">Is Id</param>
    if (!s) return ''; var arr = s.split('~'); var r = '';
    for (var i = 1; i < arr.length; i++) {
        var item = arr[i]; var subArr = item.split('|'); var pType = subArr[0];
        if ((pType + '') == (t + '')) { if (b) r += ', ' + subArr[1]; else r += ', ' + subArr[2]; }
    }
    return r.substring(2);
};

function vGvl(s, p, i) {
    /// <summary>
    /// Get value from string
    /// </summary>
    /// <param name="s">String</param>
    /// <param name="p">Sep</param>
    /// <param name="i">Index</param>
    if (!s) return "";
    var vals = s.split(p);
    if (vals == null || i >= vals.length) return "";
    return vals[i];
};

function vGvo(s, r, i) {
    /// <summary>
    /// Get value from info
    /// </summary>
    /// <param name="s">Info</param>
    /// <param name="r">Row index</param>
    /// <param name="i">Index</param>
    if (s == null) return "";
    var rows = s.split("~");
    if (rows == null || rows.length == 0) return "";
    var row = rows[r];
    var field = row.split("|");
    return field[i];
};

function vGpi(t, i, n, p) {
    /// <summary>
    /// Get person info
    /// </summary>
    /// <param name="t">type</param>
    /// <param name="i">id</param>
    /// <param name="n">name</param>
    /// <param name="p">phone</param>
    if (!n && !p) return '';
    return t + "|" + i + "|" + n + "|" + p;;
};

function vGdi(s, p, i) {
    /// <summary>
    /// Get data from info
    /// </summary>
    /// <param name="s">Value</param>
    /// <param name="p">Separator</param>
    /// <param name="i">Index</param>
    if (!s) return '';
    var arr = s.split(p);
    if (i >= arr.length) {
        return '';
    }
    return arr[i];
};