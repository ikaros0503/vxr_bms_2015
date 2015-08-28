///#source 1 1 /App/Include/o.js
/* Code spirit and naming convention
 * 
 * --------------------------------------------------
 * 
 * 1. Visionaries
 *    > Review the vision frequently!
 *    > Fulfill the duties, don't care too many!
 *    > One way, don't stop, except we are done!
 *    
 * 2. Code in App folder only, NEVER code in Base folder which contain external plugins / libraries!
 *    > If need: override or config in App/Core => See example in html/form or html/table
 * 
 * 3. A module have no sub js folder, and only in a package:
 *    > [Group name].[Module name]
 *    > [Group name].[Parent module name].[Child module name]
 * 
 * 4. Opt = Optimze / Optional = ( Data Structures + Algorithms = Programs )
 *    > o.js = Object | Data Structures (Configs, Trees, Dictionaries, Classes, ...)
 *    > p.js = Process | Algorithms (Functions, Events, ...)
 *    > t.js = Target (Module, Program, Report, Customer, ...) | Temporary (variable, status, memory, caching, code before preview, ...)
 *    
 * 5. Only load z files: z.js, z.css, z.html or z.min.js, z.min.css,  z.min.html
 *    > o.js + p.js + t.js = z.js = z.min.js
 *    > Load z file in development or debug mode
 *    > Load z.min file in testing or production mode
 *    > Todo: v.html => z.html?
 *    > Todo: v.css => z.css?
 * 
 * 6. Always use short name for popular case or localy variables or function
 *    > vRqs => Request | vRqr: Request for report
 *    > o, x, d, c => object, field, data, condition
 *    > (u, r, l, t) => Params of ajax callback methods: u = status, r = results / records, l = length of records, t = total of records or orther target data
 * 
 * 7. Always think and apply:
 *    > Performace => user must happy!
 *    > Core or library for reuseable, changable!
 *    > Modular, independent for manageable, overridable, publishable (no need code!)
 *    > Hook, Publish / event for extendable
 *    > Optmize and concise in action, => love code and development thinking
 *    > Smart comment, log, note, ... => speed up team, done make team to a missing info problem!
 *    > As real life, put things to right place, domain, package, private in module folder or public in core folder, config in o.js, ... 
 * 
 * --------------------------------------------------
 * 
*/

app.mdf = "App"; //Module base folder

/* Config for a module: 
 * Idx 0: Priority (small is hight, zero is lowest)
 * Idx 1: Business type (0 = system, 1 = Manage modules, 2 = Business modules, 3 = report modules, 4 = ext modules)
 * Idx 2: UI type (0=sheet, 1 = popup, 2 = like history panel, selector = target html), 
 * Idx 3: Auto load type (0 = no load, 1 = auto, 2 = wait for parent module, 3 = always hide),
 * Idx 4: Cache type (0 = no cache, 1 = auto cache)
 * Idx 5: Name 
 * Idx 6: Parent modules name, child module will load only if the parent module is loaded
 * Idx 7: Paths config (Module folder or service url or object config or array config)
 * Idx 8: Rights (Check rights for load, * or empty is ignore check)
 * Idx 9: Open classes with comma (Click event on these classes will open the module to the targer config)
 * Idx 10: Structure config (0 = use default with o.js > p.js > ..., 1 = z file only, 2 = p file only, 3 = o file only)
 * Idx 11: Is load css (0 = no load, 1 = auto load  v.css)
 * Idx 12: Is load template (0 = noload, string = auto load v.html to the target ref)
 * Idx 13: Is load temporary file (0 = noload, 1 = auto load t.js) Todo: Load and use temp file (Idx 13)
 * Idx 14: Is use min files (0 = no, 1 = true, array or object config)
 * Idx 15: Load orther resources (0 = noload, formated string or array or object config)
 * Idx End (hidden, no config): Status config (after module loaded => object) TODO: Use max or length to create the object
*/

app.bms = { //Base modules
    BksMSeat: [0, 2, 0, 1, 0, 'Seat Model', '', 'Bu/Co.Bks/Model/Seat', '', '', 1, 0, '', 0, 0, ''],
    BksMTicket: [0, 2, 0, 1, 0, 'Ticket Model', '', 'Bu/Co.Bks/Model/Ticket', '', '', 1, 0, '', 0, 0, ''],
    BksCoreModule: [0, 0, 0, 1, 0, 'Core Bks', '', 'Bu/Co.Bks/Core', '', '', 1, 0, '', 0, 1, ''],
    BksShippingCore: [0, 2, 0, 3, 0, 'Core Shipping Module', '', 'Bu/Co.Bks.Shipping/Core', '', '', 1, 0, '', 0, 0, '']
};

app.mds = {
    
    //Business Modules   
    BksFilterModule: [0, 2, 0, 1, 0, 'Bks Filter filter module', '', 'Bu/Co.Bks/Module/Filter', '', '', 2, 0, '', 0, 1, ''],
    FTripModule: [0, 2, 0, 1, 0, 'Bks Filter filter module', '', 'Bu/Co.Bks/Module/Filter/FTrip', '', '', 0, 0, '', 0, 0, ''],
    BksAdvModule: [0, 2, 0, 1, 0, 'Bks Adv / Extend Module', '', 'Bu/Co.Bks/Module/Adv', '', '', 2, 0, '', 0, 0, ''],
    BksMainModule: [0, 2, 0, 1, 0, 'Booking module', '', 'Bu/Co.Bks/Main', '', 'a.watch-bks', 2, 1, '#bksContent', 0, 1, 'xBksCss:[C]/custom.css, xBksJs:[C]/custom.js'],
    BksPrintModule: [0, 2, 0, 1, 0, 'Print Bks Module', '', 'Bu/Co.Bks/Module/Print', '', '', 2, 0, '', 0, 0, ''],
    BksVTicketModule: [0, 2, 0, 1, 0, 'Vexere Ticket Module', '', 'Bu/Co.Bks/Module/VTicket', '', '', 2, 0, '', 0, 0, ''], 
    BksShippingMain: [0, 2, 0, 3, 0, 'Product Main', 'BksShippingCore', 'Bu/Co.Bks.Shipping/Main', 'S60000', 'a.btn-hang-hoa', 0, 1, '#product-content', 0, 0, ''],
    BksForAgent: [0, 4, 0, 1, 0, 'Agent booking modules', 'B_Co_Bks', 'Bu/Co.Bks.Ag', '~2|2|1', '', 2, 1, '', 0, 1, ''], //
    BksReport: [0, 3, 0, 0, 0, 'Report', '', 'Bu/Co.Bks.Report', '', 'a.watch-report', 0, 1, '', 0, 1, 'xRptJs:[C]/report.js'],
    BksWidgetHistory: [0, 4, 2, 1, 0, 'History panel', '', 'Bu/Co.Bks.Wg.History', '', '', 1, 0, '', 0, 0, ''],
    BTickets: [0, 2, 0, 0, 0, 'Manage Booked Tickets', '', 'Bu/Co.Bks/Module/BTicket', '', 'a.watch-tickets', 0, 1, '#bTickets', 0, 1, ''],
    FPrintModule: [0, 2, 0, 1, 0, 'Bks Filter Print Module', '', 'Bu/Co.Bks/Module/Filter/FPrint', '', '', 0, 0, '', 0, 0, ''],
    MTrip2: [0, 2, 0, 0, 0, 'Manage Trips', '', 'Manage/Co.Bo.BusMa', '', 'a.bus-manager', 0, 1, '#busManager', 0, 0, ''],

    //Manage modules
    MCo: [0, 1, 1, 0, 0, 'Manage Companies', '', 'Manage/Co', '', 'a.company', 0, 0, '', 0, 1, ''],
    MAg  : [0, 1, 1, 0, 0, 'Manage Agents', '', 'Manage/Co.Ag'  , '', 'a.agent', 0, 0, '', 0, 1, ''],
    MArea: [0, 1, 1, 0, 0, 'Manage Areas' , '', 'Manage/Co.Area', '', 'a.area' , 0, 0, '', 0, 1, ''],
    MBus: [0, 1, 1, 0, 0, 'Manage Buses', '', 'Manage/Co.Bo.Bus', '', 'a.vehicle', 0, 0, '', 0, 1, ''],
    MStpl: [0, 1, 1, 0, 0, 'Manage SeatTemplates', '', 'Manage/Co.Bo.Bus.Stpl', '', 'a.seat-template', 0, 1, '', 0, 1, ''],
    MCu: [0, 1, 1, 0, 0, 'Manage Customers', '', 'Manage/Co.Bo.Cu', '', 'a.customer', 0, 0, '', 0, 1, ''],
    MEm: [0, 1, 1, 0, 0, 'Manage Employees', '', 'Manage/Co.Bo.Em', '', 'a.person', 0, 0, '', 0, 1, ''],
    MRole: [0, 2, 1, 0, 0, 'Manage Role', '', 'Manage/Co.Em.Ac.Role', '', 'a.role', 0, 1, '', 0, 1, ''],
    MAid: [0, 1, 1, 0, 0, 'Manage Aids or Assistants', '', 'Manage/Co.Bo.Em.Aid', '', 'a.assistant', 0, 0, '', 0, 1, ''],
    MTicConf: [0, 1, 1, 0, 0, 'Manage Selling Tickets', '', 'Manage/Co.Bo.Tic.Conf', '', 'a.tic-conf', 0, 1, '', 0, 0, ''],
    MDrive: [0, 1, 1, 0, 0, 'Manage Drivers', '', 'Manage/Co.Bo.Em.Drive', '', 'a.driver', 0, 0, '', 0, 1, ''],
    MGuide: [0, 1, 1, 0, 0, 'Manage Guides', '', 'Manage/Co.Bo.Em.Guide', '', 'a.guide', 0, 0, '', 0, 1, ''],
    MRoute: [0, 1, 1, 0, 0, 'Manage Routes', '', 'Manage/Co.Bo.Rou', '', 'a.trip', 0, 1, '', 0, 1, ''],
    MFare: [0, 1, 1, 0, 0, 'Manage Fares', '', 'Manage/Co.Bo.Rou.Fare', '', 'a.fare', 0, 1, '', 0, 0, ''],
    MTrip: [0, 1, 1, 0, 0, 'Manage Trips', '', 'Manage/Co.Bo.Rou.Trip', '', 'a.config-route', 0, 1, '', 0, 1, ''],
    MAcc: [0, 1, 1, 0, 0, 'Manage Accounts', '', 'Manage/Co.Em.Ac', '', 'a.account', 0, 0, '', 0, 1, ''],
    MPwd: [0, 0, 1, 0, 0, 'Change Passwords', '', 'Manage/Co.Em.Ac.Pwd', '', 'a.change-password', 0, 1, '', 0, 1, ''],
    PkPoint: [0, 1, 1, 0, 0, 'Pickup Point', '', 'Manage/Co.Bo.PkPoint', '', 'a.pickup-point', 0, 0, '', 0, 0, ''],
    CusPro: [0, 1, 1, 0, 0, 'Customer Profile', '', 'Manage/Co.Bo.CusPf', '', 'a.customer-profile', 0, 0, '', 0, 0, ''],
    TfPoint: [0, 1, 1, 0, 0, 'Transfer Point', '', 'Manage/Co.Bo.TfPoint', '', 'a.transfer-point', 0, 0, '', 0, 0, ''],
    VxrLog: [0, 1, 1, 0, 0, 'Vms Log', '', 'Manage/Co.Vxr.Log', '', 'a.vxr-log', 0, 1, '#vexereLogTemplate', 0, 0, ''],
};

///#source 1 1 /App/Include/p.js
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
    return c[3] == 1;
};

$.getMPath = function (c) {
    return c[7];
};

$.html = function (id, data, isHtml) {
    if (!id) return '';
    var source = $("#" + id).html();
    if (!source) console.log(id, data);
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
    $('#template').load('App/Template/Basic.html');
    $('#templateForm').load('App/Template/Form.html');
    $('#moduleForm').load('App/Template/Module.html');
};

$.getCorFiles = function() {
    var arr = [];
    $.each(app.bms, function (k, c) { if (c[3] == 1) { arr = arr.concat($.getJsFiles(c)); } });
    return arr;
};

$.loadModules = function () {
    require($.getCorFiles(), function () {
        $.each(app.mds, function (k, c) {
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
                path = $.trim(arr[1]) + "?v=" + app.vsn + "&r=" + Math.random();
                if (val) {
                    if (path.indexOf('.css') > 0) vLCss(path);
                    else if (path.indexOf('.js') > 0) rs.push(path);
                }
            }
        } else { path = $.trim(u); if (path.indexOf('.css') > 0) vLCss(path); else if (path.indexOf('.js') > 0) rs.push(path); }
    });
    return rs;
};

$.loadModule = function (c) {
    if (c[6] && app.bms[$.trim(c[6])]) { //Require parent module
        app.bms[c[6]][3] = 1; //Set mod = Autoload for the parent module
        $.loadModule(app.bms[c[6]]); //TODO: must load ready before run next
    }

    if (c[3] == 3) return; //Always disable this module
    var f = app.mdf + '/' + c[7]; //from app.mds
    if (c[8].indexOf('~') == 0) if (app.rights.indexOf(c[8]) < 0) return;
    if (c[11] == 1) vLCss(f + "/v.css?v=" + app.vsn);

    var ref = c[12];// run config
    if (typeof ref == 'string' && ref) $(ref).load(f + "/v.html", function (x) {
        $.start(c); c[12] = 0; //Load template one time only
    }); else $.start(c);
};

$.getJsFiles = function (c) {
    var f = app.mdf + '/' + c[7];
    var min = c[14], type = c[10];
    var arr = [];
    switch (type) {
        case 0:
            var ojs = '', pjs = '', tjs = '';
            if (min) ojs = f + "/o.min.js?v=" + app.vsn; else ojs = f + "/o.js?v=" + app.vsn;
            if (min) pjs = f + "/p.min.js?v=" + app.vsn; else pjs = f + "/p.js?v=" + app.vsn;
            arr.push(ojs); arr.push(pjs);
            if (c[13] == 1) { //t.js config
                if (min) tjs = f + "/t.min.js?v=" + app.vsn;
                else tjs = f + "/t.js?v=" + app.vsn;
                arr.push(tjs);
            }
            break;
        case 1:
            arr.push(min ? f + "/z.min.js?v=" + app.vsn : f + "/z.js?v=" + app.vsn);
            break;
        case 2: //Load p file only
            arr.push(min ? f + "/p.min.js?v=" + app.vsn : f + "/p.js?v=" + app.vsn);
            break;
        case 3: //Load o file only
            arr.push(min ? f + "/o.min.js?v=" + app.vsn : f + "/o.js?v=" + app.vsn);
            break;
        default:
            break;
    }
    return arr;
};

$.start = function (c) {
    var t = c[10], o, p; //T = type
    require($.getJsFiles(c), function (x1, x2) {
        switch (t) {
            case 0: o = x1; p = x2; break;
            case 1: break;
            case 2: p = x1; break;//Load p file only
            case 3: o = x1; break;//Load o file only
            default: break;
        }
        if (!o) o = {}; if (!p) p = {}; o.p = p; o.c = c; //TODO: Need clone?
        require($.getCustomPaths(c), function () {
            jQuery(document).ready(function () { if ($.isManageModule(o.c)) vv.start(o); else if (o.p.start) o.p.start(o); });
        });
    });
};
