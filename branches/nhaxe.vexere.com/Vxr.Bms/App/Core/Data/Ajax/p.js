function vRqs(o, p, x) {
    /// <summary>
    /// Ajax request by system
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="function">Callback success function(u = r.Result, r = r.Records, l = r.Records.length, t = TotalRecordCount or Code, e: Message)</param>
    /// <param name="x" type="object">Advanced ajax config, override if exist</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    var c = {
        url: app.serviceUrl,
        type: 'POST',
        contentType: 'application/json; charset: utf-8',
        crossDomain: true,
        data: JSON.stringify({ obj: o }),
        headers: {"CompId": app.cid,"AgentId": app.aid,"UserId": app.uid,"UserName": app.un}
    };
    if (x && typeof (x) == 'object') {$.each(x, function (k, v) {c[k] = v;});}
    return $.ajax(c).done(function (r, s, j) { // data, textStatus, jqXHR
        r = r.hasOwnProperty('d') ? r.d : r;
        var t = r.TotalRecordCount ? r.TotalRecordCount : 0;
        if (r.Code != null && r.Code != undefined) t = r.Code;
        if (p && typeof p === 'function') p.call(this, r.Result, r.Records, r.Records ? r.Records.length : 0, t, r.Message);
        if (!r.Result) console.log('> rq: ', r.Result, r.Message);
    }).fail(function (h, u, e) {//jqXHR, textStatus, errorThrown
        console.error(u, e);
    });
};

function vRqr (o, p) {
    /// <summary>
    /// Ajax request for report
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="function">Callback success function(Anything data, String textStatus, jqXHR jqXHR)</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    return $.ajax({
        type: "POST",
        url: app.reportBaseUrl,
        crossDomain: true,
        data: JSON.stringify({ obj: o }),
        success: p,
        error: function () {
            alert("Error!");
        }
    });
};

function vRql(o, p, me) {
    /// <summary>
    /// Request list
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="object">{a: begin callback function(u, r, l, t), m: model callback function (i = index, d = array data of fields), z: end callback function(u, r, l, t)}</param>
    /// <param name="me" type="object">Scope</param>
    /// <returns type="jqXHR">Ajax return object</returns>

    return vRqs(o, function (u, r, l, t) {
        if (p.a) p.a.call(me, u, r, l, t);
        if (p.m && u && l > 0 && r && r.length) for (var i = 0; i < l; i++) p.m.call(me, i, r[i]);
        if (p.z) p.z.call(me, u, r, l, t);
    }
    );
};

function vRqu(d, p) {
    /// <signature>
    /// <summary>Ajax request by user, prevent double request</summary>
    /// <param name="d" type="object">Ajax object.</param>
    /// <param name="p" type="function">Callback success function.</param>
    /// <returns type="jqXHR">Ajax return object or null</returns>
    /// </signature>
    var isStop = false;
    if (oRq.iAc && oRq.cAType == 2) {
        if (oRq.cRqs.indexOf(oRq.cKey) == -1) {
            oRq.cRqs.push(oRq.cKey);
            if (oRq.cEl.length > 0 && oRq.cLType > 0) {
                switch (oRq.cLType) {
                    case 1:
                        $(oRq.cEl).attr('disabled', true);
                        break;
                    default:
                        $(oRq.cEl).attr('disabled', true);
                        break;
                }
            }
        } else isStop = true;
    }
    if (!isStop) return vRqs(d, p);  //Load data from server using AJAX
    return null;
};

function vRqz() {
    /// <summary>
    /// End of vRqu function, enable elements or allow next request
    /// </summary>
    oRq.cRqs.pop(oRq.cKey);
    if (oRq.iAc && oRq.cAType == 2) {
        if (oRq.cEl.length > 0) {
            switch (oRq.cLType) {
                case 1: $(oRq.cEl).removeAttr('disabled'); break;
                default: $(oRq.cEl).removeAttr('disabled'); break;
            }
        }
    }
    oRq.iAc = false;
    oRq.cEl = null;
    oRq.cLType = null;
    oRq.cKey = null;
};

///
/// Extend service for the front-end database 
///

function eRqs(o, p, x) {
    /// <summary>
    /// Ajax request by system (Extend)
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="function">Callback success function(u = r.Result, r = r.Records, l = r.Records.length, t = TotalRecordCount or Code, e: Message)</param>
    /// <param name="x" type="object">Advanced ajax config, override if exist</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    var c = {
        url: app.serviceFrontUrl,
        type: 'POST',
        contentType: 'application/json; charset: utf-8',
        crossDomain: true,
        data: JSON.stringify({ objs: o }),
        headers: { "CompId": app.cid, "AgentId": app.aid, "UserId": app.uid, "UserName": app.un }
    };
    //console.log(c);
    if (x && typeof (x) == 'object') { $.each(x, function (k, v) { c[k] = v; }); }
    return $.ajax(c).done(function (r, s, j) { // data, textStatus, jqXHR
        r = r.hasOwnProperty('d') ? r.d : r;
        var t = r.TotalRecordCount ? r.TotalRecordCount : 0;
        if (r.Code != null && r.Code != undefined) t = r.Code;
        if (p && typeof p === 'function') p.call(this, r.Result, r.Records, r.Records ? r.Records.length : 0, t, r.Message);
        if (!r.Result) console.log('> rq: ', r.Result, r.Message);
    }).fail(function (h, u, e) {//jqXHR, textStatus, errorThrown
        console.error(u, e);
    });
};

function eRql(o, p, me) {
    /// <summary>
    /// Request list
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="object">{a: begin callback function(u, r, l, t), m: model callback function (i = index, d = array data of fields), z: end callback function(u, r, l, t)}</param>
    /// <param name="me" type="object">Scope</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    return eRqs(o, function (u, r, l, t) {
        if (p.a) p.a.call(me, u, r, l, t);
        if (p.m && u && l > 0 && r && r.length) for (var i = 0; i < l; i++) p.m.call(me, i, r[i]);
        if (p.z) p.z.call(me, u, r, l, t);
    }
    );
};

