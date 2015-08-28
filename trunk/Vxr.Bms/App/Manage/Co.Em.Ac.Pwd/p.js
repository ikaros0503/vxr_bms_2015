define({

    // Check new pass is valid
    _onNewPassChange: function (u, o) {
        
        //var me = this;
        var val = u.val();
        var pr = u.parent();
        var icon = u.next('span.glyphicon');
        if (vIsPwd(val)) {          
            pr.removeClass('has-error');
            var passRe = o.view.find('input.new-password-retype').val();
            if (!pr.hasClass('has-success')) {
                pr.addClass('has-success');
                icon.removeClass('glyphicon-remove');
                if (!icon.hasClass('glyphicon-ok')) {
                    icon.addClass('glyphicon-ok');
                }
            }
            // kiểm tra xem ô nhập lại mật khẩu mới có dữ liệu hay không
            if (passRe.length != 0 && passRe != '') {
                o.view.find('input.new-password-retype').trigger('change');
                o.isError = true;
            } else {
                // tự động focus vào ô nhập lại mật khẩu mới
                o.view.find('input.new-password-retype').trigger('focus');
                o.isError = false;
            }
        } else {
            pr.removeClass('has-success');
            if (!pr.hasClass('has-error')) {
                pr.addClass('has-error');
                icon.removeClass('glyphicon-ok');
                if (!icon.hasClass('glyphicon-remove')) {
                    icon.addClass('glyphicon-remove');
                }
                o.isError = true;
                // tự động focus vào ô nhập mật khẩu mới
                o.view.find('input.new-password').trigger('focus');
                // disable nút đổi mật khẩu nếu nó đang enable
                var submit = o.view.find('button.submit-change-password');
                if (submit.attr('disabled') != 'disabled') {
                    submit.attr('disabled', 'disabled');
                }
            }
        }
    },

    // Check old pass is valid from db
    _onOldPassChange: function (v, o) {
        //var me = this;
        var oldPassword = v.val();

        // lấy thông tin tài khoản đang đăng nhập
        vRqs(
        {
            _a: o.queryAction,
            _c: { Id: app.uid, Password: oldPassword },
            _f: o.queryFields
        },
        function (u, r, l, t) {
            var pr = o.view.find('input.old-password').parent();
            var icon = o.view.find('input.old-password').next('span.glyphicon');
            if (u && l == 1) {
                var dbPassWord = r[0][1];
                pr.removeClass('has-error');
                if (!pr.hasClass('has-success')) {
                    pr.addClass('has-success');
                    icon.removeClass('glyphicon-remove');
                    if (!icon.hasClass('glyphicon-ok')) {
                        icon.addClass('glyphicon-ok');
                    }
                    // tự động focus vào ô nhập mật khẩu mới
                    o.view.find('input.new-password').trigger('focus');
                    o.isError = false;
                }

            } else {
                pr.removeClass('has-success');
                if (!pr.hasClass('has-error')) {
                    pr.addClass('has-error');
                    icon.removeClass('glyphicon-ok');
                    if (!icon.hasClass('glyphicon-remove')) {
                        icon.addClass('glyphicon-remove');
                    }
                    o.isError = true;
                    // tự động focus vào ô nhập mật khẩu cũ
                    o.view.find('input.old-password').trigger('focus');
                    // disable nút đổi mật khẩu nếu nó đang enable
                    var submit = o.view.find('button.submit-change-password');
                    if (submit.attr('disabled') != 'disabled') {
                        submit.attr('disabled', 'disabled');
                    }
                }

            }
        });
    },

    // Check retype pass, is equal with new pass?
    _onRetypePassChange: function (u, o) {
        var p1 = u.val();
        var p2 = o.view.find('input.new-password').val();
        var pr = u.parent();
        var icon = u.next('span.glyphicon');
        //console.log(p1, p2);
        if (p1 == p2) {
            pr.removeClass('has-error');
            if (!pr.hasClass('has-success')) {
                pr.addClass('has-success');
                icon.removeClass('glyphicon-remove');
                if (!icon.hasClass('glyphicon-ok')) {
                    icon.addClass('glyphicon-ok');
                }
                o.isError = false;
                // enable nút đổi mật khẩu
                o.view.find('button.submit-change-password').removeAttr('disabled');
            }
        } else {
            pr.removeClass('has-success');
            if (!pr.hasClass('has-error')) {
                pr.addClass('has-error');
                icon.removeClass('glyphicon-ok');
                if (!icon.hasClass('glyphicon-remove')) {
                    icon.addClass('glyphicon-remove');
                }
                o.isError = true;
                // disable nút đổi mật khẩu nếu nó đang enable
                var btn = o.view.find('button.submit-change-password');
                if (btn.attr('disabled') != 'disabled') {
                    btn.attr('disabled', 'disabled');
                }
            }
            // tự động focus vào ô nhập lại mật khẩu mới
            u.trigger('focus');
        }
    },

    _onClickSubmit: function (o) {
        if (!o.isError) {
            vRqs(
                { _a: o.updateAction, _c: { Id: app.uid }, _d: { Password: o.view.find('input.new-password').val() } },
                function (u, r, l, t) {
                    if (u) {
                        alert('Đổi mật khẩu thành công.'); o.view.find('button.cancel-change-password').trigger('click');
                    } else alert('Đổi mật khẩu thất bại.');
                }
            );
        } else alert('Có lỗi xảy ra, vui lòng thử lại.');
    },


    _init: function (o) {
        o.isError = false;
    },

    _show: function (o) {
        o.view.html($.html(o.xtype));
        $.vCheckPopupRights(o.view);
        o.view.find('.modal.fade').modal('show');
    },

    _bind: function (o) {
        var me = this;
        o.view.find('input.old-password').change(function () { me._onOldPassChange($(this), o); });
        o.view.find('input.new-password').change(function () { me._onNewPassChange($(this), o); });
        o.view.find('input.new-password-retype').change(function () { me._onRetypePassChange($(this), o); });
        o.view.find('button.submit-change-password').click(function () { me._onClickSubmit(o); });
    },

    start: function (o) {
        try {
            var me = this;
            vv.initView(o);
            me._init(o);
            me._show(o);
            me._bind(o);
        } catch (e) {
            console.error(e);
        }
    },

});
