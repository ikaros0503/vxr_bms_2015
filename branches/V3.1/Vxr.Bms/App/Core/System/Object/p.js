function vGetObj(c, arr) {
    /// <summary>
    /// Get object from a array of objects
    /// </summary>
    /// <param name="c">Conditions</param>
    /// <param name="arr">Array input</param>
    
    arr = this == window ? arr : this;
    if (arr) {
        var rs = _.where(arr, c);
        return rs[0];
    }
    return {};
};


function vCloneObj (obj) {
    /// <summary>
    /// Clone a object
    /// </summary>
    /// <param name="obj">Object to clone</param>
    obj = this == window ? obj : this;
    var x = {};
    if (obj) {
        $.each(obj, function(k, v) {
            x[k] = v;
        });
    }
    return x;
};