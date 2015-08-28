define({
    loadRoleConfig: function () {
        $('#bksContent').hide();
        $('#bTickets').hide();
        $('#report').hide();
        $('#product-content').hide();
        $('#roleConfig').show();
        $('#roleConfig').roleConfig({});
        $('#roleConfig').roleConfig('load');
        $('[data-toggle="tooltip"]').tooltip();
    },

    start: function (o) {
        var me = this;
        me.loadRoleConfig();
    },
});

(function($) {
    $.widget('custom.roleConfig', {
        options: {
        
        },
        listRole: [],
        listRights: [],
        $lstRoleBox: null,
        $edtRoleBox: null,
        $contentBox: null,
        load: function(opt) {
            this.renderView(opt);
        },
        renderView: function(opt) {
            this.element.html('');
            this.options = opt;
            this.contentBoxRender();
            this.lstRoleBoxReder();
            this.edtRoleBoxRender();
            this.loadRoles();
            this.loadRights();
        },
        ////////////////////////////////////////////////////////
        // Render view
        ////////////////////////////////////////////////////////
        contentBoxRender: function() {
            this.$contentBox = $('<div id="contentRoleBox" style="min-height: 480px"/>').addClass('col-md-12');
            this.element.append(this.$contentBox);
        },
        lstRoleBoxReder: function() {
            var lstHeader = $('<h3 />').html('Quản lý vai trò');
            var tblLstRole = $('<table id="tblLstRole" class="col-md-12 table-responsive table table-qlvt table-striped"/>')
                .append($('<thead />').append($('<tr />').html(
                    '<th class="bg-thead">STT</th>' +
                    '<th class="bg-thead">Tên vai trò</th>' +
                    '<th class="bg-thead">Đối tượng</th>' +
                    '<th class="bg-thead">Ghi chú</th>' +
                    '<th class="bg-thead">Tác vụ</th>')))
                .append($('<tbody />'));
            this.$lstRoleBox = $('<div id="lstRoleBox" />').append(lstHeader).append(tblLstRole);
            this.$contentBox.append(this.$lstRoleBox);
        },
        edtRoleBoxRender: function () {
            var me = this;
            var edtHeader = $('<h4 />').html('Thêm / Tùy chỉnh vai trò');
            var ipNewRole = $('<div />').addClass('col-md-12 pl0 mt10 formEditRole')
                .append($('<div />').addClass('col-md-4 pl0')
                    .append($('<div />').addClass('form-group').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('title', 'Tên vai trò')
                        .append($('<input type="text"/>').addClass('form-control input-sm').addClass('txtNewRole').attr('placeholder', 'Tên vai trò'))))
                .append($('<div />').addClass('col-md-4 pl0')
                    .append($('<div />').addClass('form-group').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('title', 'Đối tượng')
                        .append($('<input type="text"/>').addClass('form-control input-sm').addClass('txtActor').attr('placeholder', 'Đối tượng'))))
                .append($('<div />').addClass('col-md-4 pl0')
                    .append($('<div />').addClass('form-group').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('title', 'Ghi chú')
                        .append($('<input type="text"/>').addClass('form-control input-sm').addClass('txtNote').attr('placeholder', 'Ghi chú'))))
                .append($('<div />').addClass('clearfix'))
                .append($('<h5 />').addClass('col-md-1 pl0 pr0').html("Kế thừa quyền:"))
                .append($('<div id="inheritRights"/>').addClass('col-md-6 pl0'));
            var lstRight = $('<div />').addClass('col-md-12 pl0 pr0 mt10 lstRight')
                .append($('<div />').addClass('tar mr15')
                    .append($('<label />').addClass('checkbox-inline mr0')
                        .append($('<input type="checkbox" id="showAllRight"/>')
                                .on('change', function (e) {
                                    e.preventDefault();
                                    if ($(this).prop('checked')) {
                                        me.$edtRoleBox.find('#pnlAllRights').removeClass('hidden');
                                        me.$edtRoleBox.find('#pnlRights').addClass('hidden');
                                        var abc = me.$edtRoleBox.find('#pnlAllRights').find('a[href="#allRgtCollapse"]');
                                        if (abc.hasClass('collapsed')) {
                                            setTimeout(function() {
                                                abc.trigger('click');
                                            }, 100);
                                        }
                                    } else {
                                        $(this).find('input:checkbox').prop('checked', false);
                                        me.$edtRoleBox.find('#pnlAllRights').addClass('hidden');
                                        me.$edtRoleBox.find('#pnlRights').removeClass('hidden');
                                    }
                                }))
                        .append('Xem đầy đủ các quyền')))
                .append($('<div id="pnlRights" />').addClass('panel-group mt10').attr('role', 'tablist').attr('aria-multiselectable', 'true'))
                .append($('<div id="pnlAllRights" />').addClass('panel-group mt10 hidden').attr('role', 'tablist').attr('aria-multiselectable', 'true'));
            var btns = $('<div />')
                .append($('<button id="saveRole" />').addClass('btn btn-success mb50 mr15')
                    .append($('<i />').addClass('glyphicon glyphicon-ok-circle'))
                    .append(' Lưu')
                    .on('click', function() {
                        var isAdd = me._isAddNewRole();
                        if (isAdd == oCAorU.Add) {
                            me.onAddRole();
                        } else {
                            if (isAdd == oCAorU.Invalid) {
                                me.showAnnounce('Lỗi', 'Thông tin bạn nhập không đúng. Vui lòng nhập lại!', '#c9302c');
                            } else {
                                me.showSaveConfirm(isAdd.split('.')[2], function () {
                                    me.onSaveRole(isAdd);
                                });
                            }
                        }
                    }))
                .append($('<button id="clearRole" />').addClass('btn btn-primary mb50')
                    .append($('<i />').addClass('glyphicon glyphicon-refresh'))
                    .append(' Làm mới')
                    .on('click', function() {
                        me.$edtRoleBox.find('input:text').val('');
                        me.$edtRoleBox.find('input:checkbox').prop('checked', false);
            }));
            me.$edtRoleBox = $('<div id="edtRoleBox" />').append(edtHeader).append(ipNewRole).append(lstRight).append(btns);
            me.$contentBox.append(me.$edtRoleBox);
        },

        ////////////////////////////////////////////////////////
        // Load data and bind event
        ////////////////////////////////////////////////////////
        loadRights: function() {
            var me = this;
            me.listRights = [];
            var obj = {
                _a: "fGetRights",
                _c: {
                    IsPrgStatus: '($x is null or $x != 3)'
                },
                _f: "Id, Type, Code, Name, App, Note, RoleGroup"
            };
            var fs = obj['_f'].split(',');
            vRql(obj, {
                a: function(u, r, l, t) {
                },
                m: function(i, d) {
                    var model = {};
                    $.each(fs, function(j, v) {
                        v = v.trim();
                        model[v] = d[j];
                    });
                    me.listRights.push(model);
                },
                z: function(u, r, l, t) {
                    me.renderLstRightsData();
                    me.renderLstAllRightsData();
                }
            }, me);
        },
        renderLstRightsData: function() {
            var me = this;
            var pnlR = me.$edtRoleBox.find('#pnlRights');
            pnlR.empty();
            var html = '';
            var cols = 8;
            var groups = me.listRights.gtArr({ Type: 0 }, false);
            $.each(groups, function(_, g) {
                html = $('<div />').addClass('panel panel-default')
                    .append($('<div role="tab"/>').addClass('panel-heading').attr('id', 'myheading' + g.Code)
                        .append($('<h4 />').addClass('panel-title')
                            .append($('<a class="collapsed" data-toggle="collapse" data-parent="#pnlRights" aria-expanded="false" />').attr('aria-controls', "mycollapse" + g.Code).attr('href', '#mycollapse' + g.Code).html(g.Name))));
                var lsR = $('<div role="tabpanel"/>').addClass('panel-collapse collapse').attr('id', 'mycollapse' + g.Code).css('height', '0px')
                    .attr('aria-labelledby', 'myheading' + g.Code);
                var tbBd = $('<tbody />').addClass('table mb0')
                    .append($('<tr />')
                        .append($('<td />').attr('colspan', cols - 2))
                        .append($('<td />').append($('<div />').addClass('checkbox').append($('<label />').attr('data-code',g.Code).append($('<i />').addClass('glyphicon glyphicon-ok-circle clc')).append($('<b />').addClass('text-primary').html(' Chọn hết'))
                            .on('click', function () {
                                me.$edtRoleBox.find('#mycollapse' + ($(this).attr('data-code') ? $(this).attr('data-code'):'null')).find('input.Rs:checkbox').prop('checked', true);
                        }))))
                        .append($('<td />').append($('<div />').addClass('checkbox').append($('<label />').attr('data-code',g.Code).append($('<i />').addClass('glyphicon glyphicon-remove-circle clc')).append($('<b />').addClass('text-primary').html(' Bỏ chọn hết'))
                            .on('click', function () {
                                me.$edtRoleBox.find('#mycollapse' + ($(this).attr('data-code') ? $(this).attr('data-code') : 'null')).find('input.Rs:checkbox').prop('checked', false);
                            })))));
                var rs = me.listRights.gtArr({ RoleGroup: g.Code }, false);
                var tr = $('<tr />');
                var c = 1;
                $.each(rs, function(i, r) {
                    tr.append($('<td />')
                        .append($('<div />').addClass('checkbox')
                            .append($('<label />').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('data-original-title', r.Note)
                                .append($('<input type="checkbox" />').val(r.Id).addClass('Rs')).append(r.Name))));
                    if (c == cols || i == rs.length - 1) {
                        tbBd.append(tr);
                        tr = $('<tr />');
                        c = 1;
                    } else {
                        c++;
                    }
                });
                var pnBd = $('<div />').addClass('panel-body')
                    .append($('<table />').addClass('table mb0').append(tbBd));
                lsR.append(pnBd);
                html.append(lsR);
                pnlR.append(html);
                pnlR.removeClass('hidden');
            });
            pnlR.find('[data-toggle="tooltip"]').tooltip();
        },
        renderLstAllRightsData: function () {
            var me = this;
            var pnlAllR = me.$edtRoleBox.find('#pnlAllRights');
            pnlAllR.empty();
            var html = '';
            var cols = 6;
            var groups = me.listRights.gtArr({ Type: 0 }, false);

            html = $('<div />').addClass('panel panel-default')
                   .append($('<div role="tab"/>').addClass('panel-heading').attr('id', 'allRgtHeading')
                       .append($('<h4 />').addClass('panel-title')
                           .append($('<a class="collapsed" data-toggle="collapse" data-parent="#pnlAllRights" aria-expanded="false" />').attr('aria-controls', "allRgtCollapse").attr('href', '#allRgtCollapse').html('Tất cả các quyền'))));
            var lsR = $('<div role="tabpanel"/>').addClass('panel-collapse collapse').attr('id', 'allRgtCollapse').css('height', '0px')
                    .attr('aria-labelledby', 'allRgtHeading');
            var tbBd = $('<tbody />').addClass('table mb0');
            $.each(groups, function(_, g) {
                tbBd.append($('<tr />').addClass('bgl')
                    .append($('<td />').append($('<div />').addClass('mt10').append($('<label />').append($('<i />').addClass('glyphicon glyphicon-chevron-right clc')).append($('<b />').addClass('text-success').html(' ' + g.Name)))))
                    .append($('<td />').attr('colspan', cols - 3))
                    .append($('<td />').append($('<div />').addClass('checkbox').append($('<label />').attr('data-code', g.Code).append($('<i />').addClass('glyphicon glyphicon-ok-circle clc')).append($('<b />').addClass('text-primary').html(' Chọn hết'))
                        .on('click', function() {
                            me.$edtRoleBox.find('#allRgtCollapse').find('input.isAll' + ($(this).attr('data-code') ? $(this).attr('data-code') : 'null') +':checkbox').prop('checked', true);
                        }))))
                    .append($('<td />').append($('<div />').addClass('checkbox').append($('<label />').attr('data-code', g.Code).append($('<i />').addClass('glyphicon glyphicon-remove-circle clc')).append($('<b />').addClass('text-primary').html(' Bỏ chọn hết'))
                        .on('click', function() {
                            me.$edtRoleBox.find('#allRgtCollapse').find('input.isAll' + ($(this).attr('data-code') ? $(this).attr('data-code') : 'null') + ':checkbox').prop('checked', false);
                        })))));
                var rs = me.listRights.gtArr({ RoleGroup: g.Code }, false);
                var tr = $('<tr />');
                var c = 1;
                $.each(rs, function(i, r) {
                    tr.append($('<td />')
                        .append($('<div />').addClass('checkbox')
                            .append($('<label />').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('data-original-title', r.Note)
                                .append($('<input type="checkbox" />').val(r.Id).addClass('ARs isAll' + g.Code)).append(r.Name))));
                    if (c == cols || i == rs.length - 1) {
                        tbBd.append(tr);
                        tr = $('<tr />');
                        c = 1;
                    } else {
                        c++;
                    }
                });
            });
            var pnBd = $('<div />').addClass('panel-body')
                .append($('<table />').addClass('table mb0').append(tbBd));
            lsR.append(pnBd);
            html.append(lsR);
            pnlAllR.append(html);
            pnlAllR.addClass('hidden');
            pnlAllR.find('[data-toggle="tooltip"]').tooltip();
        },
        ////////////////////////////////////////////
        loadRoles: function() {
            var me = this;
            me.listRole = [];
            var obj = {
                _a: "fGetAccount",
                _c: {
                    Type: 2,
                    IsPrgStatus: '($x is null or $x != 3)',
                    CompId: app.cid
                },
                _f: "Id, Type, Name, Username, Note, Info"
            };
            var fs = obj['_f'].split(',');
            vRql(obj, {
                a: function(u, r, l, t) {
                },
                m: function(i, d) {
                    var model = {};
                    $.each(fs, function(j, v) {
                        v = v.trim();
                        model[v] = d[j];
                    });
                    me.listRole.push(model);
                },
                z: function(u, r, l, t) {
                    me.renderLstRolesData();
                }
            }, me);
        },
        renderLstRolesData: function() {
            var me = this;
            var html0 = "", html1 = '';
            var tblRole = me.$lstRoleBox.find('#tblLstRole tbody');
            tblRole.empty();
            var cbIhrRgt = me.$edtRoleBox.find('#inheritRights');
            cbIhrRgt.empty();
            $.each(me.listRole, function(i, role) {
                html0 = $('<tr />')
                    .append($('<td />').html(i+1))
                    .append($('<td />').html(role.Username.substring(namePreLength)))
                    .append($('<td />').html(role.Name))
                    .append($('<td />').html(role.Note))
                    .append($('<td />')
                        .append($('<button />').addClass('btn btn-sm btn-primary mr15 btnEdtRole').attr('data-index', role.Id)
                            .append($('<i />').addClass('glyphicon glyphicon-edit'))
                            .append(' Sửa')
                            .on('click', function() {
                                var id = $(this).attr('data-index');
                                var r = me.listRole.gtArr({ Id: parseInt(id)}, false);
                                if (r.length > 0) {
                                    me.$edtRoleBox.find('.txtNewRole').val(r[0].Username.substring(namePreLength));
                                    me.$edtRoleBox.find('.txtActor').val(r[0].Name);
                                    me.$edtRoleBox.find('.txtNote').val(r[0].Note);
                                    me.$edtRoleBox.find('.formEditRole input:text').addClass('bgy', 1000, 'easeInOutQuint', function() {
                                        setTimeout(function() {
                                            me.$edtRoleBox.find('.formEditRole input:text').removeClass('bgy');
                                        }, 1500);
                                    });
                                    me._autoCheckRights(r[0].Info);
                                }
                    }))
                        .append($('<button />').addClass('btn btn-sm btn-danger btnDelRole').attr('data-index', role.Id)
                            .append($('<i />').addClass('glyphicon glyphicon-trash'))
                            .append(' Xóa')
                            .on('click', function () {
                                var id = $(this).attr('data-index');
                                var r = me.listRole.gtArr({ Id: parseInt(id) }, false);
                                if (r.length > 0) {
                                    me.showDelConfirm(r[0].Username.split('.')[2], function() {
                                        me.onDelRole(r[0].Id);
                                    });
                                };

                })));
                tblRole.append(html0);
                // Kế thừa quyền
                html1 = $('<label />').addClass('checkbox-inline mr15')
                    .append($('<input type="checkbox" />').addClass('cbIhrRgt').val(role.Id))
                    .append(role.Name);
                cbIhrRgt.append(html1);
            });
        },
        _getCheckedRights: function() {
            var me = this;
            var arrR = [];
            var checked;
            var pnlAllR = me.$edtRoleBox.find('#pnlAllRights');
            if (pnlAllR.hasClass('hidden')) {
                checked = me.$edtRoleBox.find('.Rs:checkbox:checked');
            } else {
                checked = me.$edtRoleBox.find('.ARs:checkbox:checked');
            }
            $.each(checked, function(___, c) {
                var id = $(c).val();
                var r = me.listRights.gtArr({ Id: parseInt(id) }, false);
                if (r.length > 0) {
                    var info = [r[0].Type, r[0].Id, r[0].App].join('|');
                    arrR.push(info);
                }
            });
            /// Get inherit rights
            var ihrs = me.$edtRoleBox.find('.cbIhrRgt:checkbox:checked');
            var ihrR = [];
            $.each(ihrs, function(___, v) {
                var rId = $(v).val();
                var role = me.listRole.gtArr({ Id: parseInt(rId) }, false);
                if (role.length > 0) {
                    var infos = role[0].Info.split('~');
                    infos.splice(0, 1);
                    ihrR = _.union(ihrR, infos);
                }
            });
            var allRights = _.union(arrR, ihrR);
            allRights = ['1'].concat(allRights);
            return allRights.join('~');
        },
        _autoCheckRights: function(info) {
            var me = this;
            me._uncheckAllRights();
            var rs = info.split('~');
            for (var i = 1; i < rs.length; i++) {
                var r = rs[i].split('|');
                if (r[0] != 3) {
                    var f = me.$edtRoleBox.find('.Rs[value=' + r[1] + ']');
                    if (f) {
                        f.prop('checked', true);
                    };
                    f = me.$edtRoleBox.find('.ARs[value=' + r[1] + ']');
                    if (f) {
                        f.prop('checked', true);
                    };
                };
            };
        },
        _uncheckAllRights: function() {
            var me = this;
            me.$edtRoleBox.find('.Rs').prop('checked', false);
            me.$edtRoleBox.find('.ARs').prop('checked', false);
        },
        _isAddNewRole: function() {
            /// <summary>
            /// Check add or update role
            /// return: 0: invalid data, 1: add new role, 2: update existing role.
            /// </summary>
            var me = this;
            var role = me.$edtRoleBox.find('.txtNewRole').val().trim();
            if (vIsEstStr(role)) {
                var r = me.listRole.gtArr({ Username: namePrefix + role }, false);
                if (r.length > 0) {
                    return r[0].Username;
                }
                return oCAorU.Add;
            } else {
                return oCAorU.Invalid;
            }
        },
        onDelRole: function(id) {
            var me = this;
            var obj = {
                _a: "UpdateAccount",
                _c: {
                    Id: parseInt(id)
                },
                _d: {
                    IsPrgStatus: 3
                }
            };
            vRqs(obj, function(u, r, l, t, m) {
                if (u > 0) {
                    me.showAnnounce('Thông báo', "Xóa vai trò thành công!", '#008000');
                    me.loadRoles();
                } else {
                    me.showAnnounce('Lỗi', "Đã xảy ra lỗi! Vui lòng thử lại sau!", '#c9302c');
                }
            });
        },
        onSaveRole: function(un) {
            var me = this;
            var rl = me.listRole.gtArr({ Username: un }, false);
            var data = {
                Name: me.$edtRoleBox.find('.txtActor').val().trim(),
                Note: me.$edtRoleBox.find('.txtNote').val().trim(),
                Info: me._getCheckedRights()
            };
            var obj = {
                _a: "UpdateAccount",
                _c: {
                    Id: parseInt(parseInt(rl[0].Id))
                },
                _d: data
            };
            vRqs(obj, function (u, r, l, t, m) {
                if (u > 0) {
                    me.showAnnounce('Thông báo', "Cập nhật vai trò thành công!", '#008000');
                    me.loadRoles();
                    me.clearForm();
                } else {
                    me.showAnnounce('Lỗi', "Đã xảy ra lỗi! Vui lòng thử lại sau!", '#c9302c');
                }
            });
        },
        onAddRole: function () {
            var me = this;
            var data = {
                Type: 2,
                Name: me.$edtRoleBox.find('.txtActor').val().trim(),
                Username: namePrefix + me.$edtRoleBox.find('.txtNewRole').val().trim(),
                Note: me.$edtRoleBox.find('.txtNote').val().trim(),
                Info: me._getCheckedRights(),
                IsPrgStatus: 1,
                CompId: app.cid
            };
            var obj = {
                _a: "InsertAccount",
                _c: {
                },
                _d: data
            };
            vRqs(obj, function (u, r, l, t, m) {
                if (u > 0) {
                    me.showAnnounce('Thông báo', "Thêm vai trò thành công!", '#008000');
                    me.loadRoles();
                    me.clearForm();
                } else {
                    me.showAnnounce('Lỗi', "Đã xảy ra lỗi! Vui lòng thử lại sau!", '#c9302c');
                }
            });
        },
        showDelConfirm: function (name, cb) {
            var me = this;
            var $confirmBody = $('<div />').addClass('modal-body')
                .append($('<form />').attr('id', 'cfDeleteRole')
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
                                    .append($('<p />').html("Bạn muốn xóa vai trò <strong style='color:red'>" + name + "</strong> ?<br/><b>Lưu ý:</b> Vai trò đã xóa <strong>không thể hoàn lại!</strong>"))
                                )
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
                                    .click(function () {
                                        if (typeof cb === 'function') cb.call();
                                        me.$contentBox.find('.confirmDelRole-popup').modal('hide');

                                })
                                )
                                .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
                                    .click(function () {
                                        me.$contentBox.find('.confirmDelRole-popup').modal('hide');
                                })
                                )
                            )
                        )
                    )
            );

            var $cfModal = $('<div />').addClass('modal fade confirmDelRole-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header').css('background-color', '#c9302c').addClass('bg-primary')
                            .append($('<h2 />').addClass('modal-title thin-1').html('Cảnh báo'))
                        )
                        .append($confirmBody)
                    )
                );
            $cfModal.appendTo(me.$contentBox);

            $cfModal.modal('show');
        },
        showSaveConfirm: function (name, cb) {
            var me = this;
            var $confirmBody = $('<div />').addClass('modal-body')
                .append($('<form />').attr('id', 'cfDeleteRole')
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
                                    .append($('<p />').html("Bạn muốn cập nhật vai trò <strong style='color:red'>" + name + "</strong> ?"))
                                )
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-success').text('Đồng ý').css('float', 'left')
                                    .click(function () {
                                        if (typeof cb === 'function') cb.call();
                                        me.$contentBox.find('.confirmSaveRole-popup').modal('hide');

                                    })
                                )
                                .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
                                    .click(function () {
                                        me.$contentBox.find('.confirmSaveRole-popup').modal('hide');
                                    })
                                )
                            )
                        )
                    )
            );

            var $cfModal = $('<div />').addClass('modal fade confirmSaveRole-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header').css('background-color', '#008000').addClass('bg-primary')
                            .append($('<h2 />').addClass('modal-title thin-1').html('Cập nhật vai trò'))
                        )
                        .append($confirmBody)
                    )
                );
            $cfModal.appendTo(me.$contentBox);

            $cfModal.modal('show');
        },
        showAnnounce: function(header, msg, color) {
            var me = this;
            var $anBody = $('<div />').addClass('modal-body')
                .append($('<form />').attr('id', 'announceRole')
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
                                    .append($('<p />').html('<b> ' + msg + '</b>'))
                                )
                            )
                        )
                    )
            );

            var $cfModal = $('<div />').addClass('modal fade confirmSaveRole-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header').css('background-color', color).addClass('bg-primary')
                            .append($('<h2 />').addClass('modal-title thin-1').html(header))
                        )
                        .append($anBody)
                    )
                );
            $cfModal.appendTo(me.$contentBox);

            $cfModal.modal('show');
            setTimeout(function() {
                $cfModal.modal('hide');
            }, 1500);
        },
        clearForm: function() {
            var me = this;
            me._uncheckAllRights();
            me.$contentBox.find('input:text').val('');
            me.$contentBox.find('#inheritRights input:checkbox').prop('checked', false);
        }
});
})(jQuery);