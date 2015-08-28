function vGTrs() {
    /// <summary>
    /// Get trip status array
    /// </summary>
    var r = [];
    $.each(oTrs, function (n, v) { r.push({ Id: v, Name: vGTrds(v) }); });
    return r;
};

function vGTrds(s) {
    /// <summary>
    /// Get trip display status
    /// </summary>
    /// <param name="s">Status num value</param>
    if (s == oTrs.add) {
        return 'Tăng cường';
    }
    if (s == oTrs.cancel) {
        return 'Hủy';
    }
    if (s == oTrs.normal) {
        return 'Kích hoạt';
    }
    if (s == oTrs.waiting) {
        return 'Mặc định';
    }
    //if (s == oTrs.reactive) { return 'Phục hồi'; }
    return 'Không biết';
};
