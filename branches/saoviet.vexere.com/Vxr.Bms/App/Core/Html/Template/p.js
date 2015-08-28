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