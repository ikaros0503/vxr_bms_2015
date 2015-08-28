var vdc = {}, app = {};
app.vsn = '2.1.40'; //Module version
app.mvs = 1; //Model version
app.baseUrl = 'http://localhost:2015/bms';  //'http://beta.vexere.com';
app.serviceUrl = 'Kernel.asmx/P';
app.backupBaseUrl = 'Backup.ashx';
app.reportBaseUrl = 'Report.ashx';

$.ajax({
    url: 'Kernel.asmx/PS',
    type: 'POST',
    contentType: 'application/json; charset: utf-8',
    crossDomain: true,
    data: {}
}).done(function (r) {
    var d = r.d;
    if (!d[0]) window.location = "Login.aspx";
    app.module = "bks";
    app.cid = d[0];
    app.aid = d[1];
    app.uid = d[2];
    app.un = d[3];
    app.sTimeZoneOffset = d[4];
    app.sTime = d[5];
    app.cite = d[6];
    app.cice = d[7];
    app.cifne = d[8];
    app.cisne = d[9];
    app.pilne = d[10];
    app.aite = d[11];
    app.aice = d[12];
    app.aisne = d[13];
    app.aifne = d[14];
    app.rights = d[15];
    app.roleGroups = d[16];
    app.compRights = d[17];
    app.xRptJs = parseInt(d[18]);
    app.xBksJs = parseInt(d[19]); // Has custom booking js
    app.xBksCss = parseInt(d[20]); // Has custom booking css
    app.userRole = d[21];
    app.csrf = d[22];
    app.cssBootStrap = 'Base/bootstrap-3.2.0/css/bootstrap.min.css';
    app.onlineTimeLimit = 180;
    app.onlineCompId = [2, 6, 59, 80, 87, 95, 508, 808];
    app.cDate = new Date();
    app.seatStack = [];
    app.ctrlOn = false;
    app.branchInfo = [];
    app.copyInfo = [];
    app.hasCopyTicket = false;
    app.hasBookReturnTicket = false;
    app.cBookReturnTripId = null;
    app.selectedPhone = "";
    app.selectedCode = "";
    app.seatToBeUpdatedReturningInfo = [];
    app.suggestCustomer = [];
    app.totalSuggestCustomer = 0;
    app.fMoving = false;
    app.isBooking = true;
    app.movingStack = [];
    app.cMovingTrip = {};
    app.cMovingSeat = null;
    app.dataToBeSavedReturningInfo = { date: "", code: "" };
});


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

var cValue = getCookie('VexereVersion');
if (cValue == "") {
    setCookie('VexereVersion', app.vsn, 5);
} else {
    if (cValue != app.vsn) {
        alert("Bạn đang sử dụng phần mềm phiên bản cũ. Vui lòng đăng nhập lại để sử dụng phiên bản mới hơn!");
        setCookie('VexereVersion', app.vsn, 5);
        $.ajax({
            url: 'Kernel.asmx/LogOut',
            data: {},
            type: 'post',
            success: function () {
                window.location = "Login.aspx";
            }
        });
    };
}

function AttachScriptAuto(src) {
    var script = document.createElement("SCRIPT");
    script.type = "text/javascript";
    script.async = false;
    script.src = src;
    document.head.appendChild(script);
}

$('<link>').appendTo('head').attr({ type: 'image/x-icon', rel: 'shortcut icon' }).attr('href', "Images/v.ico?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/bootstrap-3.2.0/css/bootstrap.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/bootstrap-3.2.0/css/bootstrap-theme.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/jquery-chosen-1.3.0/chosen.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/intl-tel-input/css/intlTelInput.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/jquery-ui-1.11.3/jquery-ui.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/bootstrap-toggle-master/css/bootstrap-toggle.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/jquery-jtable-2.4.0/lib/themes/metro/blue/jtable.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet', media: 'screen and (max-width: 319px)' }).attr('href', "Styles/responsive/max-width-319.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet', media: 'screen and (max-width: 479px)' }).attr('href', "Styles/responsive/max-width-479.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet', media: 'screen and (max-width: 767px)' }).attr('href', "Styles/responsive/max-width-767.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet', media: 'screen and (max-width: 1023px)' }).attr('href', "Styles/responsive/max-width-1023.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Base/progress-pace-1.0.2/themes/white/pace-theme-flash.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Styles/app/z.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Styles/main/z.min.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Content/css/vbooking.css?v=" + app.vsn);
$('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Content/css/product.css?v=" + app.vsn);

jQuery(document).ready(function () {
    require([(app.loadFromStatic ? app.staticServer : "") + 'App/AppReport.min.js']);
});