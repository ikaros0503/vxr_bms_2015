function vtpl(s, d) {
    /// <summary>
    /// Get html from tempalte (nano)
    /// </summary>
    /// <param name="s">Template string</param>
    /// <param name="d">Data object</param>
    return s.replace(/\{([\w\.]*)\}/g, function (str, key) {
        var keys = key.split("."), v = d[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
};

function vChIco(x, ref, html) {
    if (x.hasSearchIco) return;
    x.hasSearchIco = true;
    if (ref)
        ref = ref + " ";
    else
        ref = "";
    ref = ref + ".chosen-choices li.search-field input";
    if (!html) html = '<i class="glyphicon glyphicon-search"></i>';
    $(html).insertBefore(ref);
    $(ref).val(x.emptyName);
    //emptyName
    //$(x.ref).trigger("chosen:updated");
};

function vUChIco(x, ref, html) {
    if (!x.hasSearchIco) return;
    x.hasSearchIco = false;
    if (ref)
        ref = ref + " ";
    else
        ref = "";
    ref = ref + "ul.chosen-choices li.search-field";
    //var backHtml = $(ref).html().replace('<i class="glyphicon glyphicon-search"></i>', '');
    //$(backHtml).attr('value', '');
    //$(ref + ' input').attr('value', '');
    $(ref).html('<input type="text" value="" class="default" autocomplete="on" style="width: 100%;">');
    
};
