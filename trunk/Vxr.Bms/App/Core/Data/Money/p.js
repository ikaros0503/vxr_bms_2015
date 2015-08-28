function vToMn(n) {
    /// <summary>
    /// To vietnamese money string, ex 90.000,00 auto add 000 if lenght less than 5
    /// </summary>
    /// <param name="n" type="String or Number">The input value, string or number</param>
    n = n == undefined ? this : n;
    return vToUStr(0, ',', '.', n);

    /* Format fare or money by thousand
    if (!n && n != 0) n = '';
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");*/
};

function vToNum(s) {
    /// <summary>
    /// Roll back money to int
    /// </summary>
    s = (s == undefined) ? this : s;
    return Number(s.replace(/[^0-9]+/g, ""));
};

function vToUStr(c, d, t, n) {
    /// <summary>
    /// To vietnamese money text, auto add 000 if less than 5
    /// </summary>
    /// <param name="c">90.000,00 => 00</param>
    /// <param name="d">90.000,00 => ,</param>
    /// <param name="t">90.000,00 => .</param>
    /// <param name="n">this or target number</param>
    n = n == undefined ? this : n;
    if (typeof (n) == 'string') n = parseInt(n);
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d == undefined ? "." : d;
    t = t == undefined ? "," : t;
    var s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

