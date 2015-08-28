function vIsNumKey(e) {
    /// <summary>
    /// Is Number Key
    /// </summary>
    /// <param name="e">Event</param>
    var cc = (e.which) ? e.which : e.keyCode;
    return ((cc >= 48 && cc <= 57) || (cc >= 96 && cc <= 105));
};

function vIsPhone(s) {
    /// <summary>
    /// Is Real phone, created by Duy - 2014.09.22 => validate phone number is real
    /// </summary>
    /// <param name="s">Input string</param>

    s = this == window ? s : this;
    var strLength = s.trim().length;
    // checking length of input string
    if (strLength == 10) {
        var firstNum1 = s.substr(0, 3);
        if (typeof _dict._pnp["10"] != "undefined" && _dict._pnp["10"].indexOf(firstNum1) != -1) {
            return true;
        } else if (typeof _dict._epnp != "undefined" && typeof _dict._epnp["10"] != "undefined") {
            if (_dict._epnp["10"].indexOf(firstNum1) != -1) {
                return true;
            } else {
                for (var i = 0; i < _dict._epnp["10"].length; i++) {
                    if (_dict._epnp["10"][i].length == 2 && firstNum1.substring(0, 2) == _dict._epnp["10"][i]) {
                        return true;
                    }
                }
            }
        }
        else {
            return false;
        }
    } else if (strLength == 11) {
        var firstNum2 = s.substr(0, 4);
        if (_dict._pnp["11"].indexOf(firstNum2) != -1) {
            return true;
        } else if (typeof _dict._epnp != "undefined" && typeof _dict._epnp["11"] != "undefined" && _dict._epnp["11"].indexOf(firstNum2) != -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

function vIsPNum(s) {
    /// <summary>
    /// Check phone number
    /// </summary>
    /// <param name="s">The input string</param>
    return s.match(/[^0-9.+()\-\s]/g) == null;
};

function vIsPwd(i) {
    /// <summary>
    /// Check password (kiểm tra tính hợp lệ của mật khẩu mới khi đổi mật khẩu)
    /// </summary>
    /// <param name="i"></param>
    var r = true; i = i.trim();
    var c = /\d/; // mật khẩu phải vừa có chữ và số, và phải lớn hơn 6 kí tự
    if (i.length >= 6 && i.length != '') { // kiểm tra chuỗi input có phải toàn là số không
        if (isNaN(i)) { // kiểm tra chuỗi input phải có ít nhất 1 kí tự số
            if (!c.test(i)) r = false;
        } else r = false;
    } else r = false;
    return r;
};

function vIsVehiNum(s) {
    /// <summary>
    /// Check vehicle number (Kiểm tra biển số xe nhập vào có các ký tự đặc biệt không)
    /// </summary>
    /// <param name="str"></param>
    var c1 = /[^a-zA-Z0-9|.|\-|\s|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ]/g;
    var c2 = /[^0-9|.]/g;
    var c3 = /[^\d]/g;
    if (s.toLowerCase().match(c1) == null) {
        // kiểm tra biển số xe có kí tự '-' không
        if (s.toLowerCase().indexOf('-') != -1) {
            var split1 = s.split('-');
            // kiểm tra đuôi biển số có phải là 5 số hay không
            // nếu là 5 số thì sẽ có kí tự '.' và độ dài là 6
            // nếu là 4 số thì sẽ không có kí tự '.' và độ dài là 4
            // VD: 51A-1234 hoặc 51A-123.45
            if (split1[1].length == 6 || split1[1].length == 4) {
                switch (split1[1].length) {
                    case 6:
                        if (split1[1].indexOf('.') != -1) {
                            return split1[1].match(c2) == null;
                        } else return false;
                    case 4:
                        return split1[1].match(c3) == null;
                }
            } else return false;
        } else return false;
    } else return false;
    return false;
};