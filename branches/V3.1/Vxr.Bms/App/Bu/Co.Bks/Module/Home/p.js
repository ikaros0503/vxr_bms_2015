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
    },
    _bindEventHomeTopMenu: function () {
        $('#HomeTopMenu #MenuForm .log-out').unbind().on('click', function (e) {
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