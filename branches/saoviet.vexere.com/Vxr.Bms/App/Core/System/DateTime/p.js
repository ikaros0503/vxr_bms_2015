function vDtToStr(f, d) {
    /// <summary>
    /// Convert Date to format string
    /// </summary>
    /// <param name="f">Format string</param>
    /// <param name="d">Date to convert</param>

    d = this == window ? d : this;
    if (d == null || typeof d == 'undefined') return '';
    function pad(number) {
        var r = String(number);
        if (r.length === 1) {
            r = '0' + r;
        }
        return r;
    }
    var dOW = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ 6", "Thứ 7"];
    var result = "";

    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();

    switch (f) {
        case "dd-mm-yyyy hh:ii":
            result = pad(day) + "-" + pad(month) + "-" + year + " <b>" + pad(hour) + ":" + pad(minute) + "</b>";
            break;
        case "dd/mm/yyyy":
            result = pad(day) + "/" + pad(month) + "/" + year;
            break;
        case "dd-mm-yyyy":
            result = pad(day) + "-" + pad(month) + "-" + year;
            break;
        case "iso":
            result = year + '-' + pad(month) + '-' + pad(day) + 'T' + pad(hour) + ':' + pad(minute) + ':00.000';
            break;
        case "hh:mm":
            result = pad(hour) + ':' + pad(minute);
        case "hh.mm":
            result = pad(hour) + '.' + pad(minute);
            break;
        case "dd.mm.yyyy":
            result = pad(day) + "." + pad(month) + "." + year;
            break;
        case "HH:mm - dd.mm.yyyy":
            result = pad(hour) + ":" + pad(minute) + " - " + pad(day) + "." + pad(month) + "." + year;
            break;
        case "DD dd-mm-yyyy":
            var dname = dOW[d.getDay()];
            result = dname + " " + pad(day) + "-" + pad(month) + "-" + year;
            break;
        case "yyyy/mm/dd":
            result = year + "/" + pad(month) + "/" + pad(day);
            break;
        case "yyyy-mm-dd":
            result = year + "-" + pad(month) + "-" + pad(day);
            break;
        case "hh:mm:ss":
            result = pad(hour) + ':' + pad(minute) + ':' + pad(second);
            break;
        case 'sql':
            result = pad(month) + "-" + pad(day) + "-" + year + " " + pad(hour) + ":" + pad(minute);
            break;
        case "dd-mm-yy":
            result = pad(day) + "-" + pad(month) + "-" + year;
            break;
        default:
            result = "";
            break;
    }
    return result;
};

function vAddMinutes(m, t) {
    /// <summary>
    /// Add minutes to a time.
    /// </summary>
    /// <param name="m">Num of minutes</param>
    /// <param name="t">Time input</param>

    t = this == window ? t : this;
    var minute = t.getMinutes();
    t.setMinutes(minute + m);
    return t;
};

function vGetDateOnly(o) {
    /// <summary>
    /// Get date only format: dd-mm-yyyy
    /// </summary>
    /// <param name="o">Object to get</param>

    o = this == window ? o : this;
    if (!o) return '';
    var dd = o.getDate();
    var mm = o.getMonth() + 1; //January is 0!
    var yyyy = o.getFullYear();
    if (dd.toString().length == 1) {
        dd = "0" + dd;
    }
    if (mm.toString().length == 1) {
        mm = "0" + mm;
    }
    return dd + '-' + mm + '-' + yyyy;
};

function vAddTime(t, d) {
    /// <summary>
    /// Add time to current date
    /// </summary>
    /// <param name="t">Time</param>
    /// <param name="d">Date to add</param>

    d = this == window ? d : this;
    return d.replace('00:00', t);
};

function vPrsTm(t) {
    /// <summary>
    /// Parse time from date to format:  hh:mm
    /// </summary>
    /// <param name="t">Time</param>

    t = this == window ? t : this;
    if (t) {
        var h = t.Hours;
        var m = t.Minutes;
        var hh = h.toString();
        var mm = m.toString();
        if (h.toString().length == 1) hh = '0' + hh;
        if (m.toString().length == 1) mm = '0' + mm;
        return hh + ':' + mm;
    }
    return '';
};

//function vGtDtStr(f, d) {
//    /// <summary>
//    /// Get date in string format
//    /// </summary>
//    /// <param name="f">String format (Eg: dd-mm-yyyy)</param>
//    /// <param name="d">Date</param>
//    d = d == undefined ? this : d;
//    if (!d || !d.getDate) return '';
//    //console.log(date);
//    function pad(number) { var r = String(number); if (r.length === 1) { r = '0' + r; } return r; }
//    var result = ""; var day = d.getDate(); var month = d.getMonth() + 1; var year = d.getFullYear(); var hour = d.getHours(); var minute = d.getMinutes();
//    switch (f) {
//        case "dd-mm-yyyy hh:ii": result = pad(day) + "-" + pad(month) + "-" + year + " <b>" + pad(hour) + ":" + pad(minute) + "</b>"; break;
//        case "dd-mm-yyyy": result = pad(day) + "-" + pad(month) + "-" + year; break;
//        case "dd-mm-yy": result = pad(day) + "-" + pad(month) + "-" + year; break;
//        case "iso": result = year + '-' + pad(month) + '-' + pad(day) + 'T' + pad(hour) + ':' + pad(minute) + ':00.000'; break;
//        case "hh:mm": result = pad(hour) + ':' + pad(minute); break;
//    }
//    return result;
//};

function vGetNow() {
    /// <summary>
    /// Get date now in string format dd-mm-yyyy
    /// </summary>

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyyy;
    return today;
};

function vGtDptTm(dd, dt) {
    /// <summary>
    /// Get departure time
    /// </summary>
    /// <param name="dd">Date</param>
    /// <param name="dt">Time</param>

    var dts = $.trim((null != dd ? dd : "") + " " + (null != dt ? dt : ""));
    var departureTime = new Date();
    if ("" != dts) {
        departureTime = vPrsDt(dts);
    }
    // console.log(departureTime);
    return departureTime;
};

function parseDateFromTString(str) {
    /// <summary>Get Date</summary>
    /// <param name="str">source</param>
    return str != null ? new Date(parseInt(str.substring(str.indexOf('(') + 1).replace(')/', ''))) : '';
}

function formatDatepicker($datepicker, format) {
    /// <summary>Get Date</summary>
    /// <param name="$datepicker">datepicker element</param>
    /// <param name="format">format</param>
    if ($datepicker.val() == '') return '';
    return moment(new Date($datepicker.datepicker("getDate"))).format(format);
}