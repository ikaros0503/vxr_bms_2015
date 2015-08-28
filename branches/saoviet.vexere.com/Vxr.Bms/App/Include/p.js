

$.getRCF = function (c) {
    return c[16];
};

$.initRCF = function (c, obj) {
    c[16] = obj;
};

$.setRCF = function (c, p, v) {
    c[16][p] = v;
};

$.isManageModule = function (c) {
    return c[1] == 1;
};

$.isAutoLoadModule = function (c) {
    return c[3] == 1 || c[3] == 2;
};

$.getMPath = function (c) {
    return c[7];
};

$.html = function (id, data, isHtml) {
    if (!id) return '';
    var source = $("#" + id).html();
    //if (!source) console.log(id, data);
    var result = Handlebars.compile(source, {
        noEscape: isHtml
    })(data);
    return result;
};

$.registerHelpers = function () {
    Handlebars.registerHelper('list', function (items, options) {
        var out = "";
        for (var i = 0, l = items.length; i < l; i++) {
            out = out + "<option " + (items[i].Disabled ? "disabled" : "") + " value='" + items[i].Id + "'>" + items[i].Name + "</option>";
        } return out;
    });
    /* $.fn.extend({
         hasClasses: function (selectors) {
             var self = this;
             for (var i in selectors) {
                 if ($(self).hasClass(selectors[i]))
                     return true;
             }
             return false;
         }
     });*/
};

$.loadTemplates = function () {
    $.ajaxSetup({ cache: true });
    $('#template').load('App/Template/t.min.html?v=' + app.vsn);

    //$(document).pjax('a', '#pjax-container');
    //$('#template').load('App/Template/Basic.html');
    //$('#templateForm').load('App/Template/Form.html');
    //$('#moduleForm').load('App/Template/Module.html');
    $.ajaxSetup({ cache: false });
};

$.getCorFiles = function () {
    var arr = [];

    app.totalModules = 0;
    //console.log(app.mds);

    $.each(app.bms, function (k, c) {
        if (c[8].indexOf('~') == 0 && app.rights.indexOf(c[8]) < 0) {
            //console.log(c[7]);
        } else {
            if (c[3] == 1 || c[3] == 2) {
                app.totalModules++;
            }
        }


    });
    $.each(app.mds, function (k, c) {

        if (c[8].indexOf('~') == 0 && app.rights.indexOf(c[8]) < 0) {
            //console.log(c[7]);
        } else {
            if (c[3] == 1 || c[3] == 2) {
                app.totalModules++;
            }
        }

    });
    //console.log(app.totalModules);
    app.loadedModules = 0;

    $.each(app.bms, function (k, c) {
        //console.log(c[7], c[3]);
        if (c[3] == 1 || c[3] == 2) {
            arr = arr.concat($.getJsFiles(c));
            //console.log(c[7]);
            $.loadModule(c);
        }
    });
    return arr;
};

$.bindModuleEvent = function (c) {
    var h = (c[3] == 3);
    $.each(c[9].split(','), function (j, ref) {
        ref = $.trim(ref);
        if (h) $(ref).hide();
        else {
            //console.log(c[5]);
            $(ref).show(); $(ref).removeClass('hidden');
            $(ref).parent().removeClass('hidden');
            $(ref).click(function () {
                //console.log(c[7] + " is clicked");
                $.setUrlOnClick(c);
                $.loadModule(c);
            });
        }
    });
}

$.loadModules = function () {
    app.isRouterRun = false;
    require($.getCorFiles(), function () {
        $.each(app.mds, function (k, c) {
            //$.bindModuleEvent(c);

            //var h = (c[3] == 3);
            //$.each(c[9].split(','), function (j, ref) {
            //    ref = $.trim(ref);
            //    if (h) $(ref).hide();
            //    else {
            //        //console.log(c[5]);
            //        $(ref).show(); $(ref).removeClass('hidden');
            //        $(ref).parent().removeClass('hidden');
            //        $(ref).click(function () {
            //            //console.log(c[7] + " is clicked");
            //            $.setUrlOnClick(c);
            //            $.loadModule(c);
            //        });
            //    }
            //});

            //console.log(c[7], c[3]);
            if ($.isAutoLoadModule(c) && c[16] != 'loaded') {
                //console.log(c[7]);
                $.loadModule(c);
            }

            setTimeout(function () { $.bindModuleEvent(c); }, 1000);
        });


    });
};
$.loadModulesRP = function () {
    require($.getCorFiles(), function () {
        $.each(app.rp, function (k, c) {
            var h = (c[3] == 3);
            $.each(c[9].split(','), function (j, ref) {
                ref = $.trim(ref);
                if (h) $(ref).hide();
                else {
                    //console.log(c[5]);
                    $(ref).show(); $(ref).removeClass('hidden');
                    $(ref).parent().removeClass('hidden');
                    $(ref).click(function () {
                        $.loadModule(c);
                    });
                }

            });
            if ($.isAutoLoadModule(c)) $.loadModule(c);

        });
    });
};

$.getCustomPaths = function (c) {
    var rs = [];
    var cf = c[15];
    var path = '';
    if (!cf) return [];
    //var rs = [];
    var ss = [];
    if (cf == 1) { //TODO
    } else if (typeof cf == 'string') {
        ss = cf.split(',');
    }
    $.each(ss, function (i, u) {
        if (u.indexOf('[C]') >= 0) {
            u = $.trim(u.replace('[C]', app.cPath + '/' + app.cid));
            if (u.indexOf(':') > 0) {
                var arr = u.split(':');
                var val = app[$.trim(arr[0])];
                //path = $.trim(arr[1]) + "?v=" + app.vsn + "&r=" + Math.random();
                path = $.trim(arr[1]);
                if (val) {
                    if (path.indexOf('.css') > 0) vLCss(path);
                    else if (path.indexOf('.js') > 0) rs.push(path);
                }
            }
        } else { path = $.trim(u); if (path.indexOf('.css') > 0) vLCss(path); else if (path.indexOf('.js') > 0) rs.push(path); }
    });
    return rs;
};
$.loadModule = function (c, data) {
    //if (c[6] && app.bms[$.trim(c[6])]) { //Require parent module
    //    app.bms[c[6]][3] = 1; //Set mod = Autoload for the parent module
    //    console.log(app.bms[c[6]]);
    //    if (app.bms[c[6]][16] != 'loaded') {
    //        $.loadModule(app.bms[c[6]]); //TODO: must load ready before run next    
    //    }
    //}

    //check if parent is disable
    if (c[6] && app.bms[$.trim(c[6])]) {
        app.bms[c[6]][3] = 1;
        if (app.bms[$.trim(c[6])][16] != 'loaded') {
            $.loadModule(app.bms[c[6]], data);
        }
    }

    var load = function () {
        $.setModuleStatus(c, 'loading');
        var version = c[18] != null && c[18] != '' ? c[18] : app.vsn;
        if (c[3] == 3) return; //Always disable this module
        var f = app.mdf + '/' + c[7]; //from app.mds
        if (c[8].indexOf('~') == 0) if (app.rights.indexOf(c[8]) < 0) return;
        if (c[11] == 1) vLCss(f + "/v.css?v=" + version);

        var ref = c[12];// run config 
        $.ajaxSetup({ cache: true });

        if (typeof ref == 'string' && ref) $(ref).load(f + "/v.html?v=" + version, function (x) {
            $.start(c, data);
            c[12] = 0; //Load template one time only
        }); else $.start(c, data);
        $.ajaxSetup({ cache: false });
        //var t = new Date();
        //console.log(t.getSeconds() + ':' + t.getMilliseconds() + " " + c[5]);
    };

    if (c[3] == 3) {
        require($.getJsFiles(app.bms[c[6]]), function () {
            load();
        });
    } else {
        load();
    }
};

$.getJsFiles = function (c) {
    var f = app.mdf + '/' + c[7];
    var version = (c[18] != null && c[18] != '') ? c[18] : app.vsn;
    var min = c[14], type = c[10];
    var arr = [];
    switch (type) {
        case 0:
            var ojs = '', pjs = '', tjs = '';
            /* if (min) ojs = f + "/o.min.js?v=" + app.vsn; else ojs = f + "/o.js?v=" + app.vsn;
             if (min) pjs = f + "/p.min.js?v=" + app.vsn; else pjs = f + "/p.js?v=" + app.vsn;*/
            if (min) ojs = f + "/o.min.js"; else ojs = f + "/o.js";
            if (min) pjs = f + "/p.min.js"; else pjs = f + "/p.js";
            arr.push(ojs + "?v=" + version); arr.push(pjs + "?v=" + version);
            if (c[13] == 1) { //t.js config
                if (min) tjs = f + "/t.min.js";
                else tjs = f + "/t.js";
                arr.push(tjs + "?v=" + version);
            }
            break;
        case 1:
            arr.push((min ? f + "/z.min.js" : f + "/z.js") + "?v=" + version);
            break;
        case 2: //Load p file only
            arr.push((min ? f + "/p.min.js" : f + "/p.js") + "?v=" + version);
            break;
        case 3: //Load o file only
            arr.push((min ? f + "/o.min.js" : f + "/o.js") + "?v=" + version);
            break;
        default:
            break;
    }
    return arr;
};

$.start = function (c, data) {
    var t = c[10], o, p; //T = type
    require($.getJsFiles(c), function (x1, x2) {
        switch (t) {
            case 0: o = x1; p = x2; break;
            case 1: break;
            case 2: p = x1; break;//Load p file only
            case 3: o = x1; break;//Load o file only
            default: break;
        }
        if (!o) o = {}; if (!p) p = {};
        o.p = p; o.c = c; //TODO: Need clone?
        o.data = data;
        $.ajaxSetup({ cache: true });
        /* $.getScript($.getCustomPaths(c), function () {
                 
             jQuery(document).ready(function () { if ($.isManageModule(o.c)) vv.start(o); else if (o.p.start) o.p.start(o); });
             })
           .done(function (script, textStatus) {
              //console.log(c[5]);
           })
           .fail(function (jqxhr, settings, exception) {
              // $("div.log").text("Triggered ajaxError handler.");
           });
 */
        require($.getCustomPaths(c), function (m) {
            if (m) o.m = m;
            jQuery(document).ready(function () {
                try {
                    if ($.isManageModule(o.c)) vv.start(o);
                    else if (o.p.start) o.p.start(o);
                } catch (e) {
                    console.log('Fail to start module ' + c[5], e);
                }
            });
        });
        $.ajaxSetup({ cache: false });

        // finish 1 module
        app.loadedModules++;

        $.setModuleStatus(c, 'loaded');
        if (app.loadedModules >= app.totalModules && !app.isRouterRun) {
            app.isRouterRun = true;
            $.frRtEvt(); 
        }
    });
};
$.frRtEvt = function() {
    if (app.isRouted) {
        vbf("doRouting");
    } else {
        setTimeout($.frRtEvt, 20);
    }
}
$.setModuleStatus = function (c, status) {
    $.each(app.mds, function (k, cc) {
        if (cc[7] == c[7]) {
            app.mds[k][16] = status;
        }
    });
    $.each(app.bms, function (k, cc) {
        if (cc[7] == c[7]) {
            app.bms[k][16] = status;
        }
    });

};