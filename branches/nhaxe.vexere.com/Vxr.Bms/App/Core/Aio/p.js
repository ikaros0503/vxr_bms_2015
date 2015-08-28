//console.log(toMn.arguments);
$.each(oAio, function (i, a) {
    var o = null;
    switch (i) {
        case 0: o = Number; break;
        case 1: o = String; break;
        case 2: o = Array; break;
        case 3: o = Date; break;
        case 4: o = Object;break;
        default: break;
    }
    if (o) $.each(a, function (j, v) {
        if (o.prototype) o.prototype[j] = v;
    });
});