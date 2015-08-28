define({
    //#region Private Methods

    //#endregion

    //#region Company 
    onSearchComp: function() {
        var me = this, v = me.view;
        var cn = $(v).find('input.comp-name').val();
        var name = [];
        me._crtSrcCnd(cn, name);
        name.push("($x like N'%" + cn + "%')");
        var obj = {
            _a: 'fGetCompany',
            _c: {
                Name: '(' + name.join(' or ') + ')',
                Type: 1,
                IsPrgStatus: "($x is null or $x != 3)"
            },
            _f: "Id, Name, Fullname, AddressInfo, PhoneInfo"
        }
        var cb = function(u, r, l, t) {
            var s = $(v).find('.srcCpnRst');
            s.empty();
            var html = '';
            if (u != 1 || r.length == 0) {
                s.html('Không tìm thấy nhà xe.');
            } else {
                $.each(r, function(i, c) {
                    $(s).append($('<div />').addClass('rcCpnRs').addClass((i%2==0)?'odd':'even').attr('data-id', c[0]).attr('data-name', c[1])
                        .html('<b style="color: red;font-size: 16px;">' + c[1] + "</b> - " + (c[4] != null ? c[4] : '') + ' - ' + (c[3] != null ? c[3] : '') + '<br/>')
                        .on('mouseenter', function() {
                            $(this).addClass('rchover');
                        })
                        .on('mouseleave', function() {
                            $(this).removeClass('rchover');
                        })
                        .on('click', function() {
                            $(v).find('input.comp-name').val($(this).attr('data-name'));
                            $(v).find('.congty_id_hidden').val($(this).attr('data-id'));
                            $(s).empty();
                            me.onCompCmpl();
                        }));
                });
                //s.html(html);
                //$(s).addClass("alert alert-primary");
                //$(s).fadeIn('fast');
                //$(s).html($('<span />').addClass('.message-content').html(html));
                //$(o.element).delay(1000).fadeOut('fast', function () { $(o.element).removeClass(o.type); });
            }
        }
        vRqs(obj, cb);
    },
    onSaveComp: function() {
        var me = this, o = me.o, view = o.view;
        var hasError = false;
        var msg = '';
        var name = $(view).find('.comp-name');
        var idCompany = $(view).find('.congty_id_hidden');
        var fullname = $(view).find('.comp-full-name');
        var address = $(view).find('.comp-address-info');
        var phone = $(view).find('.comp-phone-info');
        if (name.val() == "") {
            hasError = true;
            msg += 'Vui lòng nhập tên công ty. \n';
        }
        if (phone.val() != "") {
            if (!vIsPNum(phone.val())) {
                hasError = true;
                msg += "\n" + 'Số điện thoại không hợp lệ.';
            }
        }
        if (hasError) {
            vv.showMessage({
                element: view.find('.alert.message'),
                type: 'alert-danger',
                content: msg
            });
        } else {
            var obj, data;
            data = { "Name": "" + name.val() + "", "FullName": "" + fullname.val() + "", "PhoneInfo": "" + phone.val() + "", "AddressInfo": "" + address.val() + "" },
                obj = { _a: "InCompany", _c: {}, _d: data };
            obj._d.IsPrgStatus = 1;
            obj._d.BaseId = app.cid;
            obj._d.Type = 1;
            vRqs(obj, function(u, r, l, t) {
                if (u) {
                    if (me.onActionComplete) me.onActionComplete.call(me);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    idCompany.val(r[0]);
                    me.onCompCmpl();
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
            });
        }
    },
    onCompCmpl: function() {
        var me = this, view = me.view;
        $(view).find('.comp-name').removeClass('bdred').attr('disabled', 'disabled');
        $(view).find('.comp-full-name').attr('disabled', 'disabled');
        $(view).find('.comp-address-info').attr('disabled', 'disabled');
        $(view).find('.comp-phone-info').attr('disabled', 'disabled');
        view.find('button.saveComp').addClass('btn-disabled').attr('disabled', 'disabled');
        view.find('button.refreshCom').addClass('btn-disabled').attr('disabled', 'disabled');
        view.find('button.searchCom').addClass('btn-disabled').attr('disabled', 'disabled');
        view.find('button.saveCN').removeClass('btn-disabled').removeAttr('disabled');
        view.find('button.refreshCN').removeClass('btn-disabled').removeAttr('disabled');
        view.find('button.searchAgt').removeClass('btn-disabled').removeAttr('disabled');
        $(view).find('.srcAgtRst').empty();
        $(view).find('.srcCpnRst').empty();
    },
    onCompClear: function() {
        var me = this, o = me.o, view = o.view;
        $(view).find('.comp-name').val('');
        $(view).find('.comp-full-name').val('');
        $(view).find('.comp-phone-info').val('');
        $(view).find('.comp-address-info').val('');
        $(view).find('.srcCpnRst').empty();
    },


    //#endregion

    //#region Chi Nhanh
    onSearchAgt: function () {
        var me = this, v = me.view;
        var cn = $(v).find('input.CN-name').val();
        var bid = $(v).find('.congty_id_hidden').val();
        if (!vIsEstStr(bid)) {
            vv.showMessage({
                element: v.find('.alert.message'),
                type: 'alert-danger',
                content: 'Vui lòng tạo mới hoặc chọn công ty.'
            });
            return;
        };
        var name = [];
        me._crtSrcCnd(cn, name);
        name.push("($x like N'%" + cn + "%')");
        var obj = {
            _a: 'fGetCompany',
            _c: {
                Name: '(' + name.join(' or ') + ')',
                Type: '($x in (2,3))',
                IsPrgStatus: "($x is null or $x != 3)",
                BaseId: bid
            },
            _f: "Id, Name, Fullname, AddressInfo, PhoneInfo"
        }
        var cb = function (u, r, l, t) {
            var s = $(v).find('.srcAgtRst');
            s.empty();
            if (u != 1 || r.length == 0) {
                s.html('Không tìm thấy đại lý/chi nhánh.');
            } else {
                $.each(r, function (j, c) {
                    $(s).append($('<div />').addClass('rcAgtRs').addClass((j%2==0)?'odd':'even').attr('data-id', c[0]).attr('data-name', c[1])
                        .html('<b style="color: red;font-size: 16px;">' + c[1] + "</b> - " + (c[4] != null ? c[4] : '') + ' - ' + (c[3] != null ? c[3] : '') + '<br/>')
                        .on('mouseenter', function () {
                            $(this).addClass('rahover');
                        })
                    .on('mouseleave', function () {
                        $(this).removeClass('rahover');
                    })
                    .on('click', function () {
                        var i = $(this).attr('data-id'), n = $(this).attr('data-name');
                        $(v).find('input.CN-name').val(n);
                        $(v).find('.ChiNhanh_id_hidden').val(i);
                        $(v).find('select.agent-id').append($('<option>', {
                            value: i,
                            text: n
                        }));
                        $(v).find('select.tk-agent-id').append($('<option>', {
                            value: i,
                            text: n
                        }));
                        me.onCNCplt();
                    }));
                });
            }
        }
        vRqs(obj, cb);
    },
    onSaveChiNhanh: function () {
        var me = this, o = me.o, view = o.view;
        var hasError = false;
        var msg = '';
        var idCompany = $(view).find('.congty_id_hidden');
        var idChiNhanh = $(view).find('.ChiNhanh_id_hidden');
        var chinhanh = $(view).find('select.agent-id');
        var chinhanh1 = $(view).find('select.tk-agent-id');
        var name = $(view).find('.CN-name');
        var code = $(view).find('.CN-code-info');
        var address = $(view).find('.CN-address-info');
        var phone = $(view).find('.CN-phone-info');
        if (name.val() == "") {
            hasError = true;
            msg += 'Vui lòng nhập tên Chi nhánh - Đại lý. \n';
        }
        if (phone.val() != "") {
            if (!vIsPNum(phone.val())) {
                hasError = true;
                msg += "\n" + 'Số điện thoại không hợp lệ.';
            }
        }
        if (hasError) {
            vv.showMessage({
                element: view.find('.alert.message'),
                type: 'alert-danger',
                content: msg
            });
        } else {
            var obj, data;
            data = { "Name": "" + name.val() + "", "Code": "" + code.val() + "", "PhoneInfo": "" + phone.val() + "", "AddressInfo": "" + address.val() + "" },
            obj = { _a: "InCompany", _c: {}, _d: data };
            obj._d.AvailableFund = 0;
            obj._d.IsPrgStatus = 1;
            obj._d.BaseId = idCompany.val();
            obj._d.Type = 2;
            vRqs(obj, function (u, r, l, t) {
                if (u) {
                    if (me.onActionComplete) me.onActionComplete.call(me);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    idChiNhanh.val(r[0]);
                    chinhanh.append($('<option>', {
                        value: r[0],
                        text: name.val()
                    }));
                    chinhanh.val(r[0]);
                    chinhanh1.append($('<option>', {
                        value: r[0],
                        text: name.val()
                    }));
                    chinhanh1.val(r[0]);
                    me.onCNCplt();
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
            });
        }
    },
    onCNClear: function () {
        var me = this, o = me.o, view = o.view;
        $(view).find('.CN-name').val('');
        $(view).find('.CN-code-info').val('');
        $(view).find('.CN-phone-info').val('');
        $(view).find('.CN-address-info').val('');
        $(view).find('.srcAgtRst').empty();
    },
    onCNCplt: function () {
        var me = this, view = me.view;
        $(view).find('.CN-name').removeClass('bdred').attr('disabled', 'disabled');
        $(view).find('.CN-code-info').attr('disabled', 'disabled');
        $(view).find('.CN-address-info').attr('disabled', 'disabled');
        $(view).find('.CN-phone-info').attr('disabled', 'disabled');
        view.find('button.saveCN').addClass('btn-disabled').attr('disabled', 'disabled');
        view.find('button.refreshCN').addClass('btn-disabled').attr('disabled', 'disabled');
        view.find('button.searchAgt').addClass('btn-disabled').attr('disabled', 'disabled');
        view.find('button.saveNhanVien').removeClass('btn-disabled').removeAttr('disabled');
        view.find('button.refreshNV').removeClass('btn-disabled').removeAttr('disabled');
        $(view).find('.srcAgtRst').empty();
        $(view).find('.srcCpnRst').empty();
    },
    //#endregion

    //#region Nhan Vien

    onSaveNhanVien: function () {
        var me = this, o = me.o, view = o.view;
        var hasError = false;
        var msg = '';
        var id_company = $(view).find('.congty_id_hidden');
        var name = $(view).find('.nv-full-name');
        var email = $(view).find('.nv-email-info');
        var chinhanh = $(view).find('select.agent-id');
        var phone = $(view).find('.nv-phone-info');
        var nhanvien = $(view).find('.person-id');
        if (name.val() == "") {
            hasError = true;
            msg += 'Vui lòng nhập họ và tên nhân viên. \n';
        }

        if (phone.val() != "") {
            if (!vIsPNum(phone.val())) {
                hasError = true;
                msg += "\n" + 'Số điện thoại không hợp lệ.';
            }
        }
        if (hasError) {
            vv.showMessage({
                element: view.find('.alert.message'),
                type: 'alert-danger',
                content: msg
            });
        } else {
            var obj, data;
            data = { "FullName": "" + name.val() + "", "AgentId": "" + chinhanh.val() + "", "PhoneInfo": "" + phone.val() + "", "EmailInfo": "" + email.val() + "" },
            obj = { _a: "InPerson", _c: {}, _d: data };
            obj._d.Gender = "2";
            obj._d.IsPrgStatus = 1;
            obj._d.CompId = id_company.val();
            obj._d.Type = 1;
            vRqs(obj, function (u, r, l, t) {
                if (u) {
                    if (me.onActionComplete) me.onActionComplete.call(me);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    nhanvien.append($('<option>', {
                        value: r[0],
                        text: name.val()
                    }));
                    nhanvien.val(r[0]);

                    name.removeClass('bdred').attr('disabled', 'disabled');
                    chinhanh.attr('disabled', 'disabled');
                    email.attr('disabled', 'disabled');
                    phone.attr('disabled', 'disabled');
                    view.find('button.saveNhanVien').addClass('btn-disabled').attr('disabled', 'disabled');
                    view.find('button.refreshNV ').addClass('btn-disabled').attr('disabled', 'disabled');
                    view.find('button.saveTK').removeClass('btn-disabled').removeAttr('disabled');
                    view.find('button.refreshTK').removeClass('btn-disabled').removeAttr('disabled');
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
            });
        }
    },
    onNVClear: function () {
        var me = this, o = me.o, view = o.view;
        $(view).find('.nv-full-name').val('');
        $(view).find('.nv-email-info').val('');
        $(view).find('.nv-phone-info').val('');
    },

    //#endregion

    //#region Tai Khoan  

    onSaveTaiKhoan: function () {
        var me = this, o = me.o, view = o.view;
        var hasError = false;
        var msg = '';
        var id_company = $(view).find('.congty_id_hidden');
        var id_ChiNhanh = $(view).find('.ChiNhanh_id_hidden');
        var name = $(view).find('.user-name');
        var password = $(view).find('.password');
        var nhanvien = $(view).find('.person-id');
        var chinhanh = $(view).find('.tk-agent-id');
        if (name.val() == "") {
            hasError = true;
            msg += 'Vui lòng nhập tài khoản. \n';
        }
        if (password.val() == "") {
            hasError = true;
            msg += 'Vui lòng nhập mật khẩu. \n';
        }
        if (hasError) {
            vv.showMessage({
                element: view.find('.alert.message'),
                type: 'alert-danger',
                content: msg
            });
        } else {
            var obj, data;
            data = { "Username": "" + name.val() + "", "AgentId": "" + chinhanh.val() + "", "Password": "" + password.val() + "", "PersonId": "" + nhanvien.val() + "" },
            obj = { _a: "InAccount", _c: {}, _d: data };
            obj._d.IsPrgPartComp = "" + id_company.val() + "-" + id_ChiNhanh.val() + "-" + nhanvien.val() + "";
            obj._d.Role = "";
            obj._d.Info = "1~1|45|0~1|10091|1~1|10096|1~1|10093|1~5|10101|1~5|10102|1~5|10105|1~5|10104|1~5|10106|1~1|10107|1~1|30001|1~12|10065|1~5|10092|1~1|30005|1~1|5000|1~2|5001|1~1|5003|1~1|5004|1~2|5005|1~1|5006|1~1|5007|1~1|5008|1~1|5009|1~1|5010|1~2|5012|1~2|5013|1~2|5014|1~2|5015|1~2|5016|1~2|5017|1~2|5018|1~2|5019|1~1|5020|1~1|5021|1~1|5022|1~2|5023|1~2|5024|1~1|5025|1~1|5026|1~1|5027|1~1|4000|1~1|4001|1~1|4002|1~1|4003|1~1|4004|1~1|4005|1~1|4006|1~1|4007|1~1|4008|1~1|4009|1~1|4010|1~1|4011|1~1|4012|1~1|4013|1~1|4014|1~1|4015|1~1|4016|1~1|4017|1~1|4018|1~1|4019|1~1|4020|1~1|4021|1~1|1000|1~1|1100|1~1|1101|1~1|1102|1~1|1103|1~2|1104|1~1|1105|1~1|1200|1~2|1201|1~1|1300|1~1|1301|1~1|1302|1~1|1400|1~1|1500|1~1|1600|1~1|1700|1~1|1701|1~1|1702|1~1|1800|1~1|1900|1~1|2000|1~1|2001|1~2|2002|1~2|2003|1~2|2004|1~2|2005|1~1|2100|1~1|2101|1~1|2102|1~1|2200|1~1|2300|1~1|2400|1~1|2500|1~1|2600|1~1|2700|1~1|2800|1~4|1|1~1|7000|1";
            obj._d.IsPrgStatus = 1;
            obj._d.CompId = id_company.val();
            obj._d.Type = 1;
            vRqs(obj, function (u, r, l, t) {
                if (u) {
                    if (me.onActionComplete) me.onActionComplete.call(me);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                    name.removeClass('bdred').attr('disabled', 'disabled');
                    chinhanh.attr('disabled', 'disabled');
                    password.removeClass('bdred').attr('disabled', 'disabled');
                    nhanvien.attr('disabled', 'disabled');
                    view.find('button.saveTK').addClass('btn-disabled').attr('disabled', 'disabled');
                    view.find('button.refreshTK').addClass('btn-disabled').attr('disabled', 'disabled');
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
            });
        }
    },
    onTKClear: function () {
        var me = this, o = me.o, view = o.view;
        $(view).find('.user-name').val('');
        $(view).find('.password').val('');
    },
    _crtSrcCnd: function (t, rs) {
        var me = this;
        var a = {
            'e': ['é', 'è', 'ẽ', 'ẹ', 'ẻ', 'ê', 'ế', 'ề', 'ệ', 'ễ', 'ể'],
            'u': ['ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ử', 'ự', 'ử', 'ữ', 'ừ'],
            'i': ['í', 'ì', 'ị', 'ỉ', 'ĩ'],
            'a': ['á', 'à', 'ã', 'ả', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ẫ', 'ậ', 'ầ', 'ẩ'],
            'o': ['ỏ', 'ò', 'ó', 'õ', 'ọ', 'ô', 'ồ', 'ố', 'ổ', 'ộ', 'ỗ', 'ơ', 'ớ', 'ở', 'ờ', 'ợ', 'ỡ']
        }
        $.each(a, function(k, v) {
            if (t.indexOf(k) != -1) {
                $.each(v, function(_, i) {
                    var tt = t.replace(k, i);
                    rs.push("($x like N'%" + tt + "%')");
                    me._crtSrcCnd(tt, rs);
                });
            }
        });
    }
    //#endregion

});