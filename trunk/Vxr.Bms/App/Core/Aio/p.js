//console.log(toMn.arguments);
$.each(oAio, function (i, a) {
    var o = null;
    switch (i) {
        case 0: o = Number; break;
        case 1: o = String; break;
        case 2: o = Array; break;
        case 3: o = Date; break;
        case 4: o = Object; break;
        default: break;
    }
    if (o) $.each(a, function (j, v) {
        if (o.prototype) o.prototype[j] = v;
    });
});

function vev(eln, en, cb, sc) {
    /// <summary>
    /// Bind Event On Element
    /// </summary>
    /// <param name="el">Element Name</param>
    /// <param name="en">Event Name</param>
    /// <param name="cb">Action function</param>
    /// <param name="sc">Scope</param>
    $(eln).unbind(en).on(en, function (e) {
        try {
            if (cb) cb.call(sc ? sc : this, e);
        } catch (exp) {
            console.error([eln, en], exp);
        }
    });
}

function vfe(eln, en, d, cb) {
    /// <summary>
    /// Fire Event On Element
    /// </summary>
    /// <param name="el">Element Name</param>
    /// <param name="en">Event Name</param>
    /// <param name="d">Data</param>
    /// <param name="cb">Call back</param>
    try {
        var ev = $.Event(en);
        ev.d = d;
        if (cb) ev.cb = cb;
        $(eln).trigger(ev);
    } catch (exp) {
        console.error([eln, en, d], exp);
    }
}

function vbf(en, d, cb) {
    /// <summary>
    /// Fire Event On Body
    /// </summary>
    /// <param name="en">Event Name</param>
    /// <param name="d">Data</param>
    /// <param name="cb">Call back</param>
    vfe('body', en, d, cb);
}

function vbv(en, cb, sc) {
    /// <summary>
    /// Bind Event On Body
    /// </summary>
    /// <param name="en">Event Name</param>
    /// <param name="cb">Call back function</param>
    /// <param name="sc">Scope</param>
    vev('body', en, cb, sc);
}

function vce(eln, enf, ent) {
    /// <summary>
    /// Call Event
    /// </summary>
    /// <param name="eln">Element Name</param>
    /// <param name="enf">From Event's Name</param>
    /// <param name="ent">To Event's Name</param>
    vev(eln, enf, function (e) {
        try {
            var ev = $.Event(ent);
            if (e.d) ev.d = e.d;
            if (e.cb) ev.cb = e.cb;
            $(eln).trigger(ev);
        } catch (exp) {
            console.error([eln, enf], exp);
        }
    });
}

function vbe(enf, ent) {
    /// <summary>
    /// Bind event on body element
    /// </summary>
    /// <param name="enf">From Event's Name</param>
    /// <param name="ent">To Event's Name</param>
    vce('body', enf, ent);
}

function gDx(o) {
    if (!$.dx) $.dx = {};
    if (!$.dx[o.appId]) $.dx[o.appId] = [];
    return $.dx[o.appId];
}

function sDx(o) {
    if (!$.dx) $.dx = {};
    $.dx[o.appId] = [];
    return $.dx[o.appId];
}

/*function sDx(o) {
    return $.dx[o.appId];
}*/

function vConsole(content) {
    /// <summary>
    ///Log content
    /// </summary>
    /// <param name="content">content of message</param>
    if (app != null && app.status != null && app.status == 0) {
        console.log(content);
    }
}