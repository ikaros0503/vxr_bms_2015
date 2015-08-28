<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BaoCao.aspx.cs" Inherits="Vxr.Bms.BaoCao" %>

<%@ Import Namespace="System.Globalization" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <%-- manifest="./Aio.cache"--%>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BMS</title>
    <script src="Base/jquery-1.11.1/jquery.min.js"></script>
    <link rel="shortcut icon" href="Images/v.ico" type="image/x-icon" />
    <link href="Base/bootstrap-3.2.0/css/bootstrap.min.css" rel="stylesheet" />
    <link href="Base/bootstrap-3.2.0/css/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="Base/jquery-chosen-1.3.0/chosen.css" rel="stylesheet" />
    <link href="Base/jquery-ui-1.11.3/jquery-ui.min.css" rel="stylesheet" />
    <link href="Base/bootstrap-toggle-master/css/bootstrap-toggle.min.css" rel="stylesheet" />
    <link href="Base/jquery-jtable-2.4.0/lib/themes/metro/blue/jtable.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 480px)" href="Styles/responsive/max-width-480.min.css?v=1.0.0" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 768px)" href="Styles/responsive/max-width-768.min.css?v=1.0.0" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 960px)" href="Styles/responsive/max-width-960.min.css?v=1.0.0" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 1024px)" href="Styles/responsive/max-width-1024.min.css?v=1.0.0" type="text/css" />
    <link href="Base/progress-pace-1.0.2/themes/white/pace-theme-flash.css" rel="stylesheet" />
    <script src="Base/progress-pace-1.0.2/pace.min.js"></script>
    <script type="text/javascript">
        /*   var appCache = window.applicationCache;
        function handleCacheEvent(e) {
            console.log(e.type);
        }
        function handleCacheError(e) {
            alert('Error: Cache failed to update!');
        };
        // Fired after the first cache of the manifest.
        appCache.addEventListener('cached', handleCacheEvent, false);

        // Checking for an update. Always the first event fired in the sequence.
        appCache.addEventListener('checking', handleCacheEvent, false);

        // An update was found. The browser is fetching resources.
        appCache.addEventListener('downloading', handleCacheEvent, false);

        // The manifest returns 404 or 410, the download failed,
        // or the manifest changed while the download was in progress.
        appCache.addEventListener('error', handleCacheError, false);

        // Fired after the first download of the manifest.
        appCache.addEventListener('noupdate', handleCacheEvent, false);

        // Fired if the manifest file returns a 404 or 410.
        // This results in the application cache being deleted.
        appCache.addEventListener('obsolete', handleCacheEvent, false);

        // Fired for each resource listed in the manifest as it is being fetched.
        appCache.addEventListener('progress', handleCacheEvent, false);

        // Fired when the manifest resources have been newly redownloaded.
        appCache.addEventListener('updateready', handleCacheEvent, false);*/
        var vdc = null;
        var app = {};

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
            app.baseUrl = '<%= ConfigurationManager.AppSettings["baseUrl"] %>';
            app.serviceUrl = '<%= ConfigurationManager.AppSettings["serviceUrl"] %>';
            app.serviceFrontUrl = '<%= ConfigurationManager.AppSettings["serviceFrontUrl"] %>';
            app.backupBaseUrl = '<%= ConfigurationManager.AppSettings["backupBaseUrl"] %>';
            app.reportBaseUrl = '<%= ConfigurationManager.AppSettings["reportBaseUrl"] %>';
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
            app.onlineCompId = ["2", "6", "59", "80", "87", "95", "508", "808"];
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
    </script>
    <script src="App/A.js"></script>
    <script>
        $('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Styles/app/z.min.css?v=" + app.vsn);
        $('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Styles/main/z.min.css?v=" + app.vsn);
        $('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Content/css/vbooking.css?v=" + app.vsn);
        $('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', "Content/css/product.css?v=" + app.vsn);
    </script>
</head>
<body class="theme<%= Session["CompId"] %>">
    <div class="ui-layout-north">
        <nav class="navbar navbar-default bd-radius0" role="navigation">
            <div class="container-fluid">
                <%--<div class="compListFilterPanel hidden">
                    <div class="navbar-form navbar-left form-search" role="search">
                        <div class="form-group has-feedback">
                            <div class="input-group">
                                <input type="text" name="name" id="compKeyword" class="form-control input-sm" placeholder="Tìm nhà xe" />
                                <span class="glyphicon glyphicon-search form-control-feedback cur-pt" id="compKeywordIcon"></span>
                            </div>
                        </div>
                    </div>
                </div>--%>
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand watch-bks" href="javascript:;">
                        <%
                            if ((Session["CompId"].ToString()) == VxrId.ToString(CultureInfo.InvariantCulture)) Response.Write(Session["CompIdName"]);
                            else Response.Write(" QUẢN LÝ NHÀ XE ");
                        %>
                    </a>
                </div>
                <% if (Session["bLogin"] != null && (int)Session["bLogin"] == 1)
                   { 
                %>
                <!-- Collect the nav links, forms, and other content for toggling -->

                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <form id="BSFilterForm">
                        <div class="navbar-form navbar-left form-search" role="search">
                            <div class="form-group has-feedback">
                                <label class="control-label" for="inputSuccess2">&nbsp;</label>
                                <div class="input-group">
                                    <div class="input-group-btn hidden2 rights" data-rights="S30">
                                        <button type="button" class="btn btn-default dropdown-toggle" style="font-size: 11.7px; height: 30px" data-toggle="dropdown" aria-expanded="false">Từ hôm nay<span class="caret " style="margin: 0 0 3px 3px"></span></button>
                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="#" data-value="1">Từ hôm nay</a></li>
                                            <li><a href="#" data-value="2">Mọi ngày</a></li>
                                            <li class="divider"></li>
                                            <li><a href="#" data-value="3" name="btn_ChooseDate">Từ ngày bất kỳ</a><div id="calendar_drown" class="datepicker"></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- /btn-group -->
                                    <input type="text" class="form-control input-sm " placeholder="Tìm SĐT - Mã vé" id="inputSuccess2" name="Keyword" autocomplete="off" />
                                    <span class="glyphicon glyphicon-search form-control-feedback"></span>
                                    <input name="type_filterdate" type="hidden" value="1" />
                                </div>
                            </div>
                        </div>
                    </form>
                    <form id="MenuForm" runat="server">
                        <%--<asp:ScriptManager runat="server" EnablePageMethods="true">
                        <Services>
                            <asp:ServiceReference Path="~/Services/Kernel.asmx" />
                        </Services>
                    </asp:ScriptManager>--%>
                        <ul class="nav navbar-nav navbar-right">

                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-user"></i>&nbsp;<%= Session["UserName"].ToString() %> <span class="caret"></span></a>
                                <ul class="dropdown-menu" role="menu">
                                    <li role="presentation" class="text-right"><a role="menuitem" tabindex="-1" href="javascript:;" class="change-password" data-account-id="<%= Session["UserId"] %>" style="color: black">Đổi mật khẩu</a></li>
                                    <li role="presentation" class="text-right">
                                        <asp:LinkButton OnClick="LoggingOut" Text="Đăng xuất" runat="server" CssClass="" Style="color: black" />
                                    </li>
                                </ul>
                            </li>
                            <%--<li class="routeListFilterPanel hidden">
                                <div class="navbar-form navbar-left form-search" role="search">
                                    <div class="form-group has-feedback">
                                        <div class="input-group">
                                            <input type="text" name="name" id="routeKeyword" placeholder="Tìm tuyến" />
                                            <span class="glyphicon glyphicon-search form-control-feedback cur-pt" id="routeKeywordIcon"></span>
                                        </div>
                                    </div>
                                </div>
                            </li>--%>
                        </ul>

                    </form>
                </div>
                <!-- /.navbar-collapse -->
                <% } %>
            </div>
            <!-- /.container-fluid -->
        </nav>
    </div>
    <div class="ui-layout-center">

        <div id="report">
        </div>

    </div>
    <div class="ui-layout-south">
        <!--begin footer-->
        <div class="clearfix"></div>
        <div class="footer">
            <div class="text-center logo-foot">
                <img alt="VeXeRe" src="http://static.vexere.com/Images/aio/logo-vxr-foot.png" />
            </div>
            <p class="fl">Bản quyền thuộc về VeXeRe.com &copy; 2014</p>
        </div>
        <!--end footer-->
    </div>
    <div class="ui-layout-west hidden" id="agtComps"></div>
    <div class="ui-layout-east hidden" id="agtTrips"></div>
    <div class="dialog-config"></div>
    <div id="template"></div>
    <div id="templateForm"></div>
    <div id="moduleForm"></div>
    <div id="proTemplate"></div>

    <script src="Base/lib-modernizr-2.6.2/modernizr.min.js" type="text/javascript"></script>
    <%--<script src="Base/jquery-1.11.1/jquery.min.js"></script>--%>
    <script src="Base/jquery-clipboard-1.3.2/jquery.clipboard.js"></script>
    <script src="Base/jquery-chosen-1.3.0/chosen.jquery.min.js" type="text/javascript"></script>
    <script src="Base/jquery-ui-1.11.3/jquery-ui.min.js" type="text/javascript"></script>
    <script src="Base/jquery-layout-1.4.0/jquery.layout.js"></script>
    <script src="Base/lib-underscore-1.7.0/underscore-min.js"></script>
    <script src="Base/bootstrap-3.2.0/js/bootstrap.min.js"></script>
    <script src="Base/jquery-signalr-2.2.0/jquery.signalR-2.2.0.min.js" type="text/javascript"></script>
    <script src="Base/bootstrap-tooltip-3.1.1/tooltip.min.js"></script>
    <script src="Base/moment/moment.min.js"></script>
    <script src="Base/tpl-handlebars-2.0.0/handlebars.min.js"></script>
    <script src="Base/bootstrap-toggle-master/js/bootstrap-toggle.min.js"></script>
    <script src="Base/jquery-jtable-2.4.0/lib/jquery.jtable.js" type="text/javascript"></script>
    <script src="Base/jquery-jtable-2.4.0/lib/localization/jquery.jtable.vi.js" type="text/javascript"></script>
    <script src="Base/jquery-jtable-2.4.0/lib/extensions/jquery.jtable.aspnetpagemethods.js" type="text/javascript"></script>
    <script src="Base/jquery-loadmask-0.4/jquery.loadmask.min.js" type="text/javascript"></script>
    <script src="Base/jquery-cookie-1.4.1/jquery.cookie.min.js" type="text/javascript"></script>
    <script src="Base/jquery-jstorage-0.4.12/jstorage.min.js" type="text/javascript"></script>
    <script src="Base/loader-requirejs-2.1.16/require.js"></script>
    <script type="text/javascript">
        require.config({ urlArgs: "v=" + app.vsn });
        require(['App/AppReport.js']);
        function AttachScriptAuto(src) {
            var script = document.createElement("SCRIPT");
            script.type = "text/javascript";
            script.async = false;
            script.src = src;
            document.head.appendChild(script);
        }
        //AttachScriptAuto("Base/progress-pace-1.0.2/pace.min.js");
        //AttachScriptAuto("Base/lib-modernizr-2.6.2/modernizr.min.js");
    </script>
</body>
</html>
