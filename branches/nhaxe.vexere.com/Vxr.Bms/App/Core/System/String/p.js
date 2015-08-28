function vRdm(s) {
    /// <summary>
    /// Remove diacritic marks, lọc dấu
    /// </summary>
    /// <param name="s">The input string</param>
    s = this == window ? s : this;
    s = s.toLowerCase();
    s = s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    s = s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    s = s.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    s = s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    s = s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    s = s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    s = s.replace(/đ/g, "d");
    s = s.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    s = s.replace(/-+-/g, "-"); //thay thế 2- thành 1- 
    s = s.replace(/^\-+|\-+$/g, "");
    //cắt bỏ ký tự - ở đầu và cuối chuỗi  
    return s;
};

function vPrsDt(d) {
    /// <summary>
    /// Parse date from a string
    /// </summary>
    /// <param name="d">Date in string format</param>

    d = this == window ? d : this;
    if (d == null) {
        return new Date();
    }

    if (d.indexOf('Date') >= 0) { //Format: /Date(1320259705710)/
        return new Date(
            parseInt(d.substr(6), 10)
        );
    } else if (d.length == 10) {
        if (d.indexOf('-') == 2) { //Format: 01-01-2011
            return new Date(
                parseInt(d.substr(6, 4), 10),
                parseInt(d.substr(3, 2), 10) - 1,
                parseInt(d.substr(0, 2), 10),
                0, 0, 0
            );
        } else if (d.indexOf('-') == 4) { //Format: 2011-01-01
            return new Date(
                parseInt(d.substr(0, 4), 10),
                parseInt(d.substr(5, 2), 10) - 1,
                parseInt(d.substr(8, 2), 10),
                0, 0, 0
            );
        }
    } else if (d.length == 19) { //Format: 2011-01-01 20:32:42
        return new Date(
            parseInt(d.substr(0, 4), 10),
            parseInt(d.substr(5, 2), 10) - 1,
            parseInt(d.substr(8, 2, 10)),
            parseInt(d.substr(11, 2), 10),
            parseInt(d.substr(14, 2), 10),
            parseInt(d.substr(17, 2), 10)
        );
    } else if (d.length == 16) { //Format: 01-01-2011 20:32
        return new Date(
            parseInt(d.substr(6, 4), 10),
            parseInt(d.substr(3, 2), 10) - 1,
            parseInt(d.substr(0, 2, 10)),
            parseInt(d.substr(11, 2), 10),
            parseInt(d.substr(14, 2), 10),
            0
        );
    } else if (d.length == 23) { //Format: 2011-01-01T20:32:42.000
        return new Date(
            parseInt(d.substr(0, 4), 10),
            parseInt(d.substr(5, 2), 10) - 1,
            parseInt(d.substr(8, 2), 10),
            parseInt(d.substr(11, 2), 10),
            parseInt(d.substr(14, 2), 10),
            parseInt(d.substr(17, 2), 10));
    }
    return null;
};

function vGtDtObj(dt, dd) {///Date(1411405200000)/
    /// <summary>
    /// Get date object from a string
    /// </summary>
    /// <param name="dt">Time (optional)</param>
    /// <param name="dd">Date string</param>

    dd = this == window ? dd : this;
    if (dd == null) dd = "";
    var date = new Date();
    if (dd.indexOf('T') < 0) {
        var dts = $.trim((dd) + " " + (null != dt ? dt : ""));
        if ("" != dts) { date = vPrsDt(dts); }
        return date;
    } else {
        date = new Date(dd);
        return date;
    }
};

function vIsEstStr(s) {
    /// <summary>
    /// Check a string is exist or not
    /// </summary>
    /// <param name="s">String</param>

    s = this == window ? s : this;
    if (typeof s != "undefined" && s != null && s != "") {
        return true;
    }
    return false;
};

function vIsMulPhoneNum(s) {
    /// <summary>
    /// Check multi phone number separated by char '-'
    /// </summary>
    /// <param name="s">String input</param>

    // created by Duy - 2014.09.17

    s = this == window ? s : this;
    if (this.trim().length == 0) return true;
    // checking input string has char '-'
    if (this.indexOf('-') != -1) {
        var phones = this.split('-');
        for (var i = 0; i < phones.length; i++) {
            // if the phone is invalid return false
            if (phones[i] == null) return false;
            // checking the phone is real phone
            if (!vIsPhone(phones[i])) {
                return false;
            }
        }
    } else {
        // isNaN: return true if input string is not number
        if (isNaN(this)) {
            return false;
        } else {
            return vIsPhone(this.trim());
            //return true;
        }
    }
    return true;
};

function vHasSpecChar(s) {
    /// <summary>
    /// Check a string has special char or not
    /// </summary>
    /// <param name="s">Input string</param>
    // created by Duy - 2014.10.30

    s = this == window ? s : this;
    return (s.toLowerCase().match(/[^a-zA-Z0-9|\s|+|.|\-|,|/|(|)|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ]/g) != null) ? true : false;
};

function vHashCode(s) {
    /// <summary>
    /// Hash a string
    /// </summary>
    /// <param name="s">Input string</param>

    s = this == window ? s : this;
    var h = 0, i, len;
    if (s.length == 0) return h;
    for (i = 0, len = s.length; i < len; i++) {
        var chr = s.charCodeAt(i);
        //hash = ((hash << 5) - hash) + chr;
        //hash |= 0; // Convert to 32bit integer
        h += chr;
    }
    return h;
};
