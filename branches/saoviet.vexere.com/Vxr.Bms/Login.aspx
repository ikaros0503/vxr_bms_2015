<%@ Page Language="C#" Title="Login" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Vxr.Bms.Login" Debug="true" %>

<%@ Register Assembly="MSCaptcha" Namespace="MSCaptcha" TagPrefix="cc1" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BMS</title>
    <link rel="shortcut icon" href="Images/v.ico" type="image/x-icon" />
    <link href="Base/bootstrap-3.2.0/css/bootstrap.min.css" rel="stylesheet" />
    <link href="Base/bootstrap-3.2.0/css/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="Styles/app/z.min.css?v=1.0.0" rel="stylesheet" />
    <%--<script src="Base/CaptchaAPI/api.js" type="text/javascript" gapi_processed="true" charset="UTF-8"></script>--%>
</head>
<body>
    <nav class="navbar navbar-default bd-radius0" role="navigation">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="Home.aspx">QUẢN LÝ NHÀ XE</a>
            </div>
        </div>
        <!-- /.container-fluid -->
    </nav>
    <div class="container" style="min-height: 500px;">
        <div class="row">
            <form id="LoginForm" class="col-sm-6 col-md-4 col-md-offset-4" runat="server">
                <h1 class="text-center">ĐĂNG NHẬP</h1>

                <script>
                    document.cookie = 'VxrVsn=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    function showLoginError() {
                        document.getElementById("divError").className = "alert alert-danger";
                        document.getElementById("ErrorMessage").innerText = "Tên đăng nhập hoặc mật khẩu không đúng.";
                        document.getElementById("UserName").focus();
                        document.getElementById("UserName").select();
                    }
                    function showCaptchaError(type) {
                        document.getElementById("divError").className = "alert alert-danger";

                        switch (type) {
                        case 1: document.getElementById("ErrorMessage").innerText = "Mã bảo vệ không được để trống.";
                            break;
                        case 2: document.getElementById("ErrorMessage").innerText = "Mã bảo vệ không hợp lệ hoặc không đúng.";
                            break;
                        case 3: document.getElementById("ErrorMessage").innerText = "The response parameter is missing.";
                            break;
                        case 4: document.getElementById("ErrorMessage").innerText = "The response parameter is invalid or malformed.";
                            break;
                        case 5: document.getElementById("ErrorMessage").innerText = "Lỗi xảy ra, vui lòng thử lại";
                            break;
                        }
                    }
                </script>
                <div id="divError" class="alert alert-danger hide" role="alert">
                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                    <span class="sr-only">Error:</span>
                    <span id="ErrorMessage">test</span>
                </div>

                <div class="form-group">
                    <label for="UserName" class="sr-only">Tài khoản</label>
                    <input type="text" class="form-control" id="UserName" runat="server" placeholder="Tên đăng nhập" />
                </div>
                <div class="form-group">
                    <label for="Password" class="sr-only">Password</label>
                    <input type="password" class="form-control" id="Password" runat="server" placeholder="Mật khẩu" />
                </div>
                <div class="form-group ">
                    <input type="text" class="form-control col-sm-2 txtcapcha" id="txt_captcha" runat="server" placeholder="Mã bảo vệ" />
                    <cc1:CaptchaControl ID="CaptchaControl1" runat="server" Height="30px" CssClass="capcha"
                        CaptchaLength="3" EnableViewState="False" />
                </div>
                <%--<div class="form-group" style="display:none" runat="server" id="div_captcha">
                    <div class="g-recaptcha" data-sitekey="6LdmagYTAAAAAC87UHNGaKuxsxGMYZ_HQ9tzWI5E"></div>
                </div>--%>
                <asp:Button ID="Submit1" OnClick="LogIn" Text="Đăng nhập" runat="server" CssClass="btn btn-lg btn-primary btn-block" />
            </form>
        </div>
    </div>
    <div class="clearfix"></div>
    <div class="footer">
        <div class="text-center logo-foot">
            <img alt="VeXeRe" src="Images/aio/logo-vxr-foot.png" />
        </div>
        <p class="fl">Bản quyền thuộc về VeXeRe.com &copy; 2014</p>
    </div>
</body>
</html>
