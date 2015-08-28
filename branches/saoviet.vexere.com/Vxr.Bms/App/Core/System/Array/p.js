function vGetUni(a) {
    /// <summary>
    /// Get Unique values in an Array
    /// </summary>
    /// <param name="a">Array</param>

    a = this == window ? a : this;
    var u = {}, b = [];
    for (var i = 0, l = a.length; i < l; ++i) {
        var cr = JSON.stringify(a[i]);
        if (u.hasOwnProperty(cr)) {
            continue;
        }
        b.push(a[i]);
        u[cr] = 1;
    }
    return b;
};

function vCln(v, a) {
    /// <summary>
    /// Delete a Element in array
    /// </summary>
    /// <param name="a">The array</param>
    /// <param name="v">The value want to delete</param>

    a = this == window ? a : this;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == v) {
            a.splice(i, 1);
            i--;
        }
    }
    return this;
};

function vNumEstIt(a) {
    /// <summary>
    /// Get Number Of Existing Item
    /// </summary>
    /// <param name="a">Array to count</param>
    a = this == window ? absolute : this;
    var r = 0;
    for (var i = 0; i < a.length; i++) {
        if (typeof a[i] != "undefined") {
            r++;
        }
    }
    return r;
};

function vFindById(id, a) {
    /// <summary>
    /// Find a element of array by Id
    /// </summary>
    /// <param name="id">Id to find</param>
    /// <param name="a">Array</param>
    var m = null;
    a = this == window ? a : this;
    $.each(a, function (_, o) {
        if (id == o.Id) {
            m = o;
            return false;
        }
        return true;
    });

    return m;
};

function vSort(n, dsc, arr) {
    /// <summary>
    /// Sort an array by Name
    /// </summary>
    /// <param name="n">Name</param>
    /// <param name="dsc">Is decrease or not</param>
    /// <param name="arr"> Array </param>
    arr = this == window ? arr : this;
    function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;
        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >= 48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    };
    if (!dsc) {
        return arr.sort(function (as, bs) {
            if (n) {
                var a1 = as[n], b1 = bs[n];
                if (isNaN(a1) || isNaN(b1)) {
                    var aa = chunkify(a1);
                    var bb = chunkify(b1);
                    for (var x = 0; aa[x] && bb[x]; x++) {
                        if (aa[x] !== bb[x]) {
                            var c = Number(aa[x]), d = Number(bb[x]);
                            if (c == aa[x] && d == bb[x]) {
                                return c - d;
                            } else return (aa[x] > bb[x]) ? 1 : -1;
                        }
                    }
                    return aa.length - bb.length;
                } else {
                    return (parseInt(a1) - parseInt(b1));
                }
            } else {
                return as < bs ? 1 : -1;
            }

        });
    }
    return arr.sort(function (as, bs) {
        if (n) {
            var a1 = as[n], b1 = bs[n];
            if (isNaN(a1) || isNaN(b1)) {
                var aa = chunkify(a1);
                var bb = chunkify(b1);
                for (var x = 0; aa[x] && bb[x]; x++) {
                    if (aa[x] !== bb[x]) {
                        var c = Number(aa[x]), d = Number(bb[x]);
                        if (c == aa[x] && d == bb[x]) {
                            return d - c;
                        } else return (aa[x] > bb[x]) ? -1 : 1;
                    }
                }
                return bb.length - aa.length;
            } else {
                return (parseInt(b1) - parseInt(a1));
            }
        } else {
            return as < bs ? 1 : -1;
        }

    });
};

function vGetArr(c, fi, a) {
    /// <summary>
    /// Get an array from an array.
    /// </summary>
    /// <param name="c">Conditions</param>
    /// <param name="fi">Fields</param>
    /// <param name="a">Source array</param>
    a = this == window ? a : this;
    if (fi == undefined || !fi) {
        return _.where(a, c);
    } else {
        var rs = [];
        $.each(a, function (idx, obj) {
            var b = true;
            $.each(c, function (kc, vc) {
                var f = fi[kc];
                var vd = obj[kc];
                if (f) {
                    if (f.type == 'Date') {
                        if (vd.indexOf('/Date(') == 0) {
                            vd = vGetDateOnly(vGtDtObj(null, vd));
                        }
                        if (vc.indexOf('T') > 0) {
                            vc = vGetDateOnly(new Date(vc));
                        }
                    }
                    if (f.vType == 'num' && !f.useOptionTextAsVal) {
                        vc = parseInt(vc);
                        vd = parseInt(vd);
                    }
                }
                if (vc != vd) b = false;

            });
            if (b) rs.push(obj);
        });
        return rs;
        /*if (isGetArr) return rs;
        return rs[0];*/
    }

};

function vGetSearchCondt(arr) {
    /// <summary>
    /// Get search search conditions from a array.
    /// </summary>
    /// <param name="arr">Array of condition fields</param>

    arr = this == window ? arr : this;
    if (!arr) return "$x like '%'";
    var s = "(";
    var endIndx = arr.length - 1;
    $.each(arr, function (i, v) {
        s += "$x like '%|" + v + "|%'";
        if (i < endIndx) {
            s += " or ";
        }
    });
    s += ")";
    return s;
};

