<%@ Page Language="C#" Title="Booking Sheet" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="Vxr.Bms.Home" %>

<%@ Import Namespace="System.Globalization" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <%-- manifest="./Aio.cache"--%>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BMS</title>
    <link rel="shortcut icon" href="Images/v.ico" type="image/x-icon" />
    <link href="Base/bootstrap-3.2.0/css/bootstrap.min.css" rel="stylesheet" />
    <link href="Base/bootstrap-3.2.0/css/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="Base/jquery-chosen-1.3.0/chosen.css" rel="stylesheet" />
    <link href="Base/jquery-ui-1.11.3/jquery-ui.min.css" rel="stylesheet" />
    <link href="Base/bootstrap-toggle-master/css/bootstrap-toggle.min.css" rel="stylesheet" />
    <link href="Styles/app/z.min.css?v=1.0.0" rel="stylesheet" />
    <link href="Styles/main/z.min.css?v=1.0.0" rel="stylesheet" />
    <link href="Content/css/vbooking.css?v=1.0.2" rel="stylesheet" />
    <link href="Content/css/product.css" rel="stylesheet" />

    <link href="Base/jquery-jtable-2.4.0/lib/themes/metro/blue/jtable.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 480px)" href="Styles/responsive/max-width-480.min.css?v=1.0.0" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 768px)" href="Styles/responsive/max-width-768.min.css?v=1.0.0" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 960px)" href="Styles/responsive/max-width-960.min.css?v=1.0.0" type="text/css" />
    <link rel="stylesheet" media="screen and (max-width: 1024px)" href="Styles/responsive/max-width-1024.min.css?v=1.0.0" type="text/css" />
    <link href="Base/progress-pace-1.0.2/themes/white/pace-theme-flash.css" rel="stylesheet" />
    <script src="Base/progress-pace-1.0.2/pace.min.js"></script>
    <script type="text/javascript">
        var app = {
            module: "bks",
            cid: '<%= Session["CompId"] %>',
            baseUrl: '<%= ConfigurationManager.AppSettings["baseUrl"] %>',
            serviceUrl: '<%= ConfigurationManager.AppSettings["serviceUrl"] %>',
            serviceFrontUrl: '<%= ConfigurationManager.AppSettings["serviceFrontUrl"] %>',
            backupBaseUrl: '<%= ConfigurationManager.AppSettings["backupBaseUrl"] %>',
            reportBaseUrl: '<%= ConfigurationManager.AppSettings["reportBaseUrl"] %>',
            aid: '<%= Session["AgentId"] %>',
            uid: '<%= Session["UserId"] %>',
            un: '<%= Convert.ToString(Session["UserName"]).ToLower() %>',
            sTimeZoneOffset: '<%= TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow).TotalMinutes %>',
            sTime: '<%= DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") %>',
            <%--cite: '<%= Session["CompIdType"] %>',
            cice: '<%= Session["CompIdCode"] %>',
            cifne: '<%= Session["CompIdFullName"] %>',
            cisne: '<%= Session["CompIdName"] %>',--%>
            cite: '<%= Session["CompanyType"] %>',
            cice: '<%= Session["CompanyCode"] %>',
            cifne: '<%= Session["CompanyFullName"] %>',
            cisne: '<%= Session["CompanyName"] %>',
            pilne: '<%= Session["PersonIdFullName"] %>',
            aite: '<%= Session["AgentIdType"] %>',
            aice: '<%= Session["AgentIdCode"] %>',
            aisne: '<%= Session["AgentIdName"] %>',
            aifne: '<%= Session["AgentIdFullName"] %>',
            rights: '<%= Session["Rights"] %>',
            compRights: '<%= Session["CompRights"]%>',
            xRptJs: parseInt('<%= Session["HasCustomReport"] %>'),
            xBksJs: parseInt('<%= Session["xBksJs"] %>'), // Has custom booking js
            xBksCss: parseInt('<%= Session["xBksCss"] %>'), // Has custom booking css
            userRole: '<%= Session["Roles"] %>',
            cssBootStrap: 'Base/bootstrap-3.2.0/css/bootstrap.min.css',
            onlineTimeLimit: 180,
            preventUpdate: false
        };

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
                            <li class="rights" data-rights="S50000"><a href="javascript:;" class="watch-bks"><i class="glyphicon glyphicon-ok-circle"></i>&nbsp;Đặt vé</a></li>
                            <li class="rights" data-rights="S70000"><a href="javascript:;" class="watch-tickets"><i class="glyphicon glyphicon-tags"></i>&nbsp;Tất cả vé</a></li>
                            <li class="rights hidden2" data-rights="S60000"><a href="javascript:;" class="btn-hang-hoa"><i class="glyphicon glyphicon-stop"></i>&nbsp;Hàng hóa</a></li>
                            <li class="rights hidden2" data-rights="S40000"><a href="javascript:;" class="watch-report"><i class="glyphicon glyphicon-stats"></i>&nbsp;Báo cáo</a></li>
                            <li class="rights hidden2" data-rights="S11000"><a href="javascript:;" class="config-route"><i class="glyphicon glyphicon-cog"></i>&nbsp;Quản lý chuyến</a></li>
                            <li class="rights hidden2" data-rights="S80000"><a href="javascript:;" class="bus-manager"><i class="glyphicon glyphicon-cog"></i>&nbsp;Điều hành xe</a></li>
                            <li class="dropdown hidden2 rights" data-rights="S10000">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-tasks"></i>&nbsp;Quản lý <span class="caret"></span></a>
                                <ul class="dropdown-menu" role="menu">
                                    <li role="presentation" class="rights hidden2" data-rights="S29000"><a role="menuitem" tabindex="-1" href="javascript:;" class="manage">Khởi tạo nhà xe</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S12000"><a role="menuitem" tabindex="-1" href="javascript:;" class="area">Địa điểm</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S13000"><a role="menuitem" tabindex="-1" href="javascript:;" class="company">Công ty</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S14000"><a role="menuitem" tabindex="-1" href="javascript:;" class="agent">Chi nhánh - đại lý</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S15000"><a role="menuitem" tabindex="-1" href="javascript:;" class="person">Nhân viên</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S16000"><a role="menuitem" tabindex="-1" href="javascript:;" class="account">Tài khoản</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S17000"><a role="menuitem" tabindex="-1" href="javascript:;" class="role">Vai trò</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S18000"><a role="menuitem" tabindex="-1" href="javascript:;" class="seat-template">Sơ đồ ghế</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S19000"><a role="menuitem" tabindex="-1" href="javascript:;" class="trip">Tuyến đường</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S20000"><a role="menuitem" tabindex="-1" href="javascript:;" class="tic-conf">Cấu hình vé</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S21000"><a role="menuitem" tabindex="-1" href="javascript:;" class="fare">Giá vé</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S22000"><a role="menuitem" tabindex="-1" href="javascript:;" class="vehicle">Xe</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S23000"><a role="menuitem" tabindex="-1" href="javascript:;" class="driver">Tài xế</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S24000"><a role="menuitem" tabindex="-1" href="javascript:;" class="assistant">Phụ xe</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S25000"><a role="menuitem" tabindex="-1" href="javascript:;" class="guide">Hướng dẫn viên</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S26000"><a role="menuitem" tabindex="-1" href="javascript:;" class="customer">Khách hàng</a></li>
                                    <li role="presentation" class="rights hidden2" data-rights="S27000"><a role="menuitem" tabindex="-1" href="javascript:;" class="pickup-point">Điểm đón khách</a></li>
                                    <li role="presentation" class="rights hidden2" style="display: none" data-rights="S28000"><a id="showCustomerProfile" href="javascript:;" class="customer-profile">Thông tin K/H</a></li>
                                </ul>
                            </li>
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
        <div id="bksContent" class="tab-content"></div>
        <div id="report"></div>
        <div id="bTickets"></div>
        <div id="roleConfig"></div>
        <div id="product-content" style="display: none"></div>
        <div id="busManager"></div>
    </div>
    <div class="ui-layout-south">
        <!--begin footer-->
        <div class="clearfix"></div>
        <div class="footer">
            <div class="text-center logo-foot">
                <img alt="VeXeRe" src="Images/aio/logo-vxr-foot.png" />
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
    <script src="Base/jquery-1.11.1/jquery.min.js"></script>
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
    <script src="signalr/hubs" type="text/javascript"></script>
    <script src="Base/loader-requirejs-2.1.16/require.js"></script>
    <script src="App/App.js?v=2.1.8"></script>
</body>
</html>
