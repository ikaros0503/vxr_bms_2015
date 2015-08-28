/*
 * .................Home Page...................
 */
define({
    start: function (o) {
        try {
            var me = this;
            me._init(o);
        } catch (e) {
            console.error(e);
        };
    },
    _init: function (o) {
        var me = this;
        if (app.un && app.cid) {
            $('.navbar-header a.watch-bks').html(app.cisne);
            $('span.hpUn').html('&nbsp;' + app.un);
            $('a.change-password').attr('data-account-id', app.uid);
            $('body').removeClass().addClass('theme' + app.cid);
            $.vApplyAllRights();
            me._bindEventHomeTopMenu();
        } else {
            setTimeout(function() {
                me.init();
            }, 100);
        }

        var w = document.body.clientWidth;
        if (w < 480) {
            $(".footer .copyright").html("VeXeRe.com &copy; 2014");
            $(".footer .hotline").html("<b>0909 621 499</b>");
        } else if (w < 768) {
            $(".footer .copyright").html("Bản quyền VeXeRe.com &copy; 2014");
            $(".footer .hotline").html("Hỗ trợ: <b>0909 621 499</b>");
        } else {
            $(".footer .copyright").html("Bản quyền thuộc về VeXeRe.com &copy; 2014");
            $(".footer .hotline").html("Hỗ trợ kỹ thuật: <b>0909 621 499</b>");
        }
    },
    _bindEventHomeTopMenu: function () {
        $('.navbar-nav .log-out').unbind().on('click', function (e) {
            $.ajax({
                url: 'Kernel.asmx/LogOut',
                data: {},
                type: 'post',
                success: function () {
                    window.location = "Login.aspx";
                }
            });
        });
    }
});
$(document).ready(function () {


});