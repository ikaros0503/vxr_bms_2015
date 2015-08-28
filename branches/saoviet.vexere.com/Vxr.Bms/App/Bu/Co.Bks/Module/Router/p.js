define({
    routes: {},
    defaultPath: "/",
    route: function (path, controller) {
        this.routes[path] = { controller: controller };
    },
    router:function() {
        var me = this;
        var url = location.hash.replace("#/", "");
        var u = url.split("/");
        var controller = u[0].indexOf("?") >= 0 ? u[0].substring(0, u[0].indexOf("?")):u[0];
        var rt = me.routes[controller];
        if (rt == null) rt = me.routes[me.defaultPath];
        var action = u[1] != null ? u[1] : "";
        var data = null;
        if (url.indexOf("?") >= 0) {
            data = $.deparam(url.substring(url.indexOf("?") + 1));
        }
        if (action.indexOf("?") >= 0) action = action.substring(0, action.indexOf("?"));
        var r = rt?  rt.controller(action, data):null;
        return r;
    },

    start: function (o) {
        var me = this;
        var showModule = function (module, data) {
            document.title = module[5];
            $.loadModule(module, data);
        };
        vbv('doRouting', function (e) {
            $.each(app.mds, function (k, c) {
                if (c[17] != null && c[17] != '') {
                    me.route(c[17], function (action, data) {
                        showModule(c, data);
                    });
                }
            });
            me.router();
        });
        app.isRouted = true;
    },

});

$.setUrlOnClick = function (module) {
    var baseUrl = app.baseUrl;
    if (baseUrl[baseUrl.length - 1] != '/') baseUrl = baseUrl + '/';
    window.history.pushState('data', module[5], baseUrl + "#/" + (module[17] != null ? module[17] : ""));
    document.title = module[5];
}
$.setUrlByData = function (title, data) {
    var baseUrl = app.baseUrl;
    if (baseUrl[baseUrl.length - 1] != '/') baseUrl = baseUrl + '/';
    window.history.pushState('data', title, baseUrl + "#/?" + $.param(data));
    document.title = title;
}

$.setUrlByString = function (title, str) {
    var baseUrl = app.baseUrl;
    if (baseUrl[baseUrl.length - 1] != '/') baseUrl = baseUrl + '/';
    window.history.pushState('data', title, baseUrl + "#/" + str);
    document.title = title;
}