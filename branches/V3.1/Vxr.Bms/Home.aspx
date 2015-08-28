<%@ Page Language="C#" Title="Booking Sheet" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="Vxr.Bms.Home" %>

<!DOCTYPE html>
<%--<html xmlns="http://www.w3.org/1999/xhtml" manifest="./Web.manifest">--%>
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" href="Images/v.ico" type="image/x-icon" />
    <title>Quản lý nhà xe</title>
    <script src="Base/jquery-1.11.1/jquery.min.js"></script>
    <script src="Base/progress-pace-1.0.2/pace.min.js"></script>
    <script src="Base/lib-modernizr-2.6.2/modernizr.min.js" type="text/javascript"></script>
    <script src="Base/jquery-clipboard-1.3.2/jquery.clipboard.js"></script>
    <script src="Base/jquery-chosen-1.3.0/chosen.jquery.min.js" type="text/javascript"></script>
    <script src="Base/jquery-ui-1.11.3/jquery-ui.min.js" type="text/javascript"></script>
    <script src="Base/jquery-layout-1.4.0/jquery.layout.js"></script>
    <script src="Base/lib-underscore-1.7.0/underscore-min.js"></script>
    <script src="Base/bootstrap-3.2.0/js/bootstrap.min.js"></script>
    <script src="Base/jquery-signalr-2.2.0/jquery.signalR-2.2.0.min.js" type="text/javascript"></script>
    <script src="Base/bootstrap-tooltip-3.1.1/tooltip.min.js"></script>
    <script src="Base/moment/moment.min.js"></script>
    <script src="Base/deparam/jquery.ba-bbq.min.js"></script>
    <script src="Base/tpl-handlebars-2.0.0/handlebars.min.js"></script>
    <script src="Base/bootstrap-toggle-master/js/bootstrap-toggle.min.js"></script>
    <script src="Base/jquery-jtable-2.4.0/lib/jquery.jtable.js" type="text/javascript"></script>
    <script src="Base/jquery-jtable-2.4.0/lib/localization/jquery.jtable.vi.js" type="text/javascript"></script>
    <script src="Base/jquery-jtable-2.4.0/lib/extensions/jquery.jtable.aspnetpagemethods.js" type="text/javascript"></script>
    <script src="Base/jquery-loadmask-0.4/jquery.loadmask.min.js" type="text/javascript"></script>
    <script src="Base/jquery-cookie-1.4.1/jquery.cookie.min.js" type="text/javascript"></script>
    <script src="Base/jquery-jstorage-0.4.12/jstorage.min.js" type="text/javascript"></script>
    <script src="Base/loader-requirejs-2.1.16/require.js"></script>
    <script src="App/A.js"></script>
    <%--<script>
        function vRqs(o, p, x) {
            /// <summary>
            /// Ajax request by system
            /// </summary>
            /// <param name="o" type="object">Data object</param>
            /// <param name="p" type="function">Callback success function(u = r.Result, r = r.Records, l = r.Records.length, t = TotalRecordCount or Code, e: Message)</param>
            /// <param name="x" type="object">Advanced ajax config, override if exist</param>
            /// <returns type="jqXHR">Ajax return object</returns>
            var c = {
                url: 'Kernel.asmx/P',
                type: 'POST',
                contentType: 'application/json; charset: utf-8',
                crossDomain: true,
                data: JSON.stringify({ obj: o }),
                //headers: { "CompId": app.cid, "AgentId": app.aid, "UserId": app.uid, "UserName": app.un, "csrf": app.csrf }
            };
            if (x && typeof (x) == 'object') { $.each(x, function (k, v) { c[k] = v; }); }
            return $.ajax(c).done(function (r, s, j) { // data, textStatus, jqXHR
                r = r.hasOwnProperty('d') ? r.d : r;
                if (r.Result == 0 && r.Expired == 1) {
                    alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.");
                    window.location.href = "Logout.aspx";
                    return;
                }
                if (r.Result == -10) {
                    alert("Bạn đang truy vấn quá nhiều, vui lòng nghỉ trong giây lát.");
                    window.location.href = "Logout.aspx";
                    return;
                }
                var t = r.TotalRecordCount ? r.TotalRecordCount : 0;
                if (r.Code != null && r.Code != undefined) t = r.Code;
                if (p && typeof p === 'function') p.call(this, r.Result, r.Records, r.Records ? r.Records.length : 0, t, r.Message);
                if (!r.Result) console.log('> rq: ', r.Result, r.Message);

            }).fail(function (h, u, e) {//jqXHR, textStatus, errorThrown
                console.error(u, e);
            });
        };

        function test() {
            var i = 0;
            while (i < 100) {
                vRqs({
                    _a: '_fGetTrip',
                    _c: { CompId: 80 },
                    _f: "Id"
                });
                i++;
            }

        }
    </script>--%>
</head>
<body>
    <%--<div>
        <button name="ReqAjax" onclick="test()">
            Click
        </button>
    </div>--%>
</body>
</html>
