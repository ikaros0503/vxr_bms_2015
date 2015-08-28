
$.vCacr = function (id, cb, scope) {
    /// <summary>
    /// Call a function after check rights
    /// </summary>
    /// <param name="id">Id of right to check</param>
    /// <param name="cb">Callback function</param>
    /// <param name="scope"></param>

    if (!id && cb) {
        cb.call(scope);
        return;
    }
    //console.log(id);
    var ok1 = true;
    var ok2 = true;
    for (var i = 0; i < $.userArrRights.length; i++) {
        if ($.userArrRights[i].id == id) {
            ok1 = $.userArrRights[i].status;
            break;
        }
    }

    for (var i = 0; i < $.compArrRights.length; i++) {
        if ($.compArrRights[i].id == id) {
            ok2 = $.compArrRights[i].status;
            break;
        }
    }
    if (ok1 && ok2) {
        cb.call();
    }

};

$.vPrpRgts = function (obj) {
    /// <summary>
    /// Prepare rights for object
    /// </summary>
    /// <param name="obj">Object</param>

    var arr = null;
    var dict = {};
    if (obj) {
        arr = obj.find('.rights');
    } else {
        arr = $('.rights');
    }
    $.each(arr, function (idx, val) {
        var length = val.dataset.rights.length;
        var type = val.dataset.rights.substring(0, 1); //TODO: For dynamic data
        var id = val.dataset.rights.substring(1, length - 1);
        var hideMode = val.dataset.rights.substring(length - 1, length);

        var cls = "R" + id;
        dict[id] = ["." + cls, $.rightsAction[hideMode]];
        $(this).addClass(cls);
        //$('[data-rights="' + val.dataset.rights + '"]').addClass(cls);
    });
    
    return dict;

};

$.vCheckRights = function (win) {
    var dict = $.vPrpRgts(win);
    $.vApplyRights(null, dict);
};

$.vCheckPopupRights = function (dialog) {
    var dict = $.vPrpRgts(dialog.find('.modal.fade'));
    $.vApplyRights(null, dict);
};

$.vApplyRights = function (rights, dict) {
    $.vApplyXRights($.userArrRights, rights, dict);
};

$.vApplyAllRights = function () {
    $.vApplyRights(app.rights);
    $.vApplyCompRights(app.compRights);
};

$.vApplyCompRights = function (rights, dict) {
    $.vApplyXRights($.compArrRights, rights, dict);
};

$.vApplyXRights = function (targetArr, rights, dict) {
    if (!dict) {
        dict = $.vPrpRgts();
    }

    if (rights && targetArr.length < 1) {
        var arr = rights.split('~');
        for (var i = 1; i < arr.length; i++) {
            var v = arr[i].split('|');
            targetArr.push({ type: v[0], id: v[1], status: v[2] == '1' ? true : false });
        }
    }

    for (var i = 0; i < targetArr.length; i++) {
        var r = targetArr[i];
        if (r.type == "1") $.vApplyStaticRights(dict, r.id, r.status);

    }
};

$.vApplyStaticRights = function (dict, id, status) {
    var cf = dict[id];
    if (cf) {
        var fx = cf[1];
        var selector = cf[0];
        if (fx && selector) {
            if (fx == "disabled") {
                //console.log('disabled', status);
                $(selector).prop('disabled', !status);
            } else if (fx == "hide") {

                if (status == "1") {
                    fx = 'show';
                    $(selector).removeClass('hidden');
                    $(selector).removeClass('hidden2');
                }
                else $(selector).addClass('hidden2');

                $(selector)[fx].call($(selector));

                //console.log(id, status, fx, $(selector));
            }
        }
    }
    //alert(1);
};

$.vCheckAndAppendOptions = function (obj, val, text, type, isPass, eAttr) {
    if (!isPass) {
        isPass = $.vCheckRightsBeforeAdd(type, val);

    }
    var eA = '';
    if (eAttr) {
        $.each(eAttr, function(k, v) {
            eA += k + '="' + v + '" ';
        });
    }
    //console.log('$.vCheckAndAppendOptions', val, text);
    if (isPass) obj.append('<option value="' + val + '" ' + eA + '>' + text + '</option>');
};

$.vCheckRightsBeforeAdd = function (type, val) {

    for (var i = 0; i < $.userArrRights.length; i++) {
        var r = $.userArrRights[i];
        //console.log(type, 'vs', r.type, ' > ', val, ' vs ', r.id);
        if (type == r.type) {
            if (val == r.id) {
                //console.log('$.$.vCheckRightsBeforeAdd', r);
                return r.status;
            }
        }
    }
    return true;
};

$.vLoadRightConfig = function (val, targetField) {
    if (cachedDemoRights[val]) {
        targetField.val(cachedDemoRights[val]);
        return;
    }
    vRqs({ _a: 'fGetRights', _c: { Code: val, Type: 1 }, _f: 'Info' }, function (u, r, l, t) {
        if (l != 1) return;
        var info = r[0][0];
        cachedDemoRights[val] = [info];
        targetField.val(cachedDemoRights[val]);
    });
};
