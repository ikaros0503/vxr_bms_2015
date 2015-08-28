define({
    //#region Private Methods
    _initOptionRoles: function (models) {
        var me = this, v = me.view;
        var roles = models.gtArr({ Type: 2 }, false);
        var optRs = v.find('select.role');
        optRs.empty();
        $.each(roles, function (i, r) {
            $.vCheckAndAppendOptions(optRs, r.Id, r.Name, 'R');
        });
    },
    _loadPerson: function () {
        var me = this;
        me._listPersons = [];
        var ajax = {
            _a: 'fGetPerson',
            _c: { CompId: app.cid, IsPrgStatus: 1 },
            _f: 'Id, Type, FullName, CompId, AgentId',
        };
        var fCArr = ajax['_f'].split(',');
        vRql(ajax, {
            a: function (u, r, l, t) {
            },
            m: function (i, d) {
                var model = {};
                $.each(fCArr, function (j, v) {
                    v = v.trim();
                    model[v] = d[j];
                });
                me._listPersons.push(model);
            },
            z: function (u, r, l, t) {
            }
        }, me);
    },
    //#endregion

    //#region Callbacks
    getCPersonId: function (x, c) {
        var view = this.view;
        var val = view.find('select.agent-id').val();
        if (val) c['AgentId'] = val;

        return c;
    },

    onBeginSelectionChange: function (view, record) {
        var me = this, v = me.view;
        vv.enableItem(view, 'button.delete', record != null);
        if (record) {
            v.find('select.agent-id').trigger('change');
            v.find('select.person-id').find('option[value=' + record['PersonId'] + ']').prop('selected', true);
            v.find('select.rolegroup').val(parseInt(record.RoleGroups));
            var s = record['Info'].split('~');
            if (s.length > 1) {
                $.each(s, function (_, val) {
                    var r = val.trim().split('|');
                    if (r.length == 3) {
                        if (r[0] == '3') {
                            v.find('select.trip-id').find('option[value=' + r[2] + ']').prop('selected', true);
                        };
                    }
                });
            }
        }
    },

    onVMLoaded: function () {
        var me = this;
        //$.vLoadRightConfig(me.view.find('.role').val(), me.view.find('.account-info'));
        var isLoaded = false;
        $(document).ajaxStop(function () {
            if (!isLoaded) {
                me.view.find('select.agent-id').trigger('change');

                //me.gDeactivate();
                isLoaded = true;
            }
        });
    },
    onBeginReload: function () {
        this.o.queryConditions = (app.cid == app.vid) ?
        {
            //IsPrgStatus: "$x=1 order by IsPrgUpdatedDate desc"
            IsPrgStatus: "$x=1"
        } :
        {
            Type: "($x <> 2 or ($x = 2 and IsPrgStatus != 3))",
            CompId: "$x = " + app.cid + "  order by Type asc",
            //IsPrgStatus: "$x = 1 order by Type asc",
        };
    },
    afterReload: function (models) {
        var me = this;
        me._initOptionRoles(models);
        me.view.find('button.dupInfo').unbind().on('click', function (e) {
            e.preventDefault();
            me._copyInfo(true);
        });
        me._loadPerson();
        this.onTripChange(me.view);
    },
    onTripChange: function (w) {
        //$.vLoadRightConfig(x.val(), w.find('.account-info'));        
        var rId = parseInt(w.find('select.trip-id').val());
        var iF = w.find('input.account-info');
        var rR = [];
        var cInfo = iF.val().split(',');
        var check = false;
        if (cInfo.length > 1) {
            $.each(cInfo, function (_, val) {
                var r = val.trim().split('|');
                if (r.length == 3) {
                    if (!(isNaN(r[0]) || isNaN(r[1]) || isNaN(r[2]))) {
                        if (r[0] == '3') {
                            r[2] = rId;
                            check = true;
                        };
                        rR.push(r.join('|'));
                    };

                }
            });
            if (!check) rR.push("3|1|" + rId);
        } else rR.push("3|1|" + rId);
        iF.val(rR.join(', '));

    },
    //#endregion

    //#region Listeners
    onRoleChange: function (w, x, e) {
        //$.vLoadRightConfig(x.val(), w.find('.account-info'));
        this._copyInfo(false);
        this.onTripChange(w);
    },
    _copyInfo: function (isDup) {
        var me = this, view = me.view;
        var rId = parseInt(view.find('select.role').val());
        var rR = [];
        if (!isNaN(rId)) {
            var roles = me.remoteModels.gtArr({ Id: rId }, false);
            if (roles.length > 0) {
                var r = roles[0].Info.split('~');
                for (var i = 1; i < r.length; i++) {
                    rR.push(r[i].trim());
                };
            }
        }
        var iF = view.find('input.account-info');
        if (!isDup) {
            var cInfo = iF.val().split(',');
            var cR = [];
            if (cInfo.length > 1) {
                $.each(cInfo, function (_, val) {
                    var r = val.trim().split('|');
                    if (r.length == 3) {
                        if (!(isNaN(r[0]) || isNaN(r[1]) || isNaN(r[2]))) {
                            cR.push(r.join('|'));
                        };
                    }
                });
            }
            rR = _.union(cR, rR);
        }
        iF.val(rR.join(', '));
    },
    onAgentChange: function () {
        var me = this, v = me.view;
        var agentId = v.find('.agent-id').val();
        var xTarget = v.find('select.person-id');
        var ps = me._listPersons.gtArr({ AgentId: parseInt(agentId) }, false);
        xTarget.empty();
        if (ps.length > 0) {
            $.each(ps, function (index, value) {
                $.vCheckAndAppendOptions(xTarget, value.Id, value.FullName, 'R');
            });
            xTarget.find('option:first-child').prop('selected', 'selected');
        } else {
            xTarget.empty();
        }
    },
    //#endregion

    //#region Converters
    gDisRole: function (d) {
        var me = this;
        var v = d.record.Role;

        var obj = $('.dialog-config').find('select.role').find('option[value="' + v + '"]');
        if (!obj || obj.length < 1) { return ''; }

        return obj.text();
    },

    gDisAgentId: function (data) {
        return data.record.AgentName;
    },

    gDisPersonId: function (data) {
        return data.record.PersonFullName;
    },
    gDisTripId: function (data) {
        return data.record.Name;
    },
    gDisInfo: function (data) {
        var info = data.record.Info;
        if (info.length > 70) return info.substring(0, 70) + '....';
        return info;
    },

    svcPC: function (x, v, b) {
        /// <summary>
        /// PartComp save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        if (!b) return v;
        return app.cid + '-' + b['AgentId'] + '-' + b['PersonId'];
    },
    rvcInfo: function (x, v) {
        /// <summary>
        /// Info read value converter
        /// </summary>
        if (vIsEstStr(v)) {
            var roles = v.substring(v.indexOf('~') + 1).split('~');
            if (roles.length > 1) {
                return roles.join(", ");
            }
        }
        return "Không có quyền";
    },
    svcInfo: function (x, v) {
        /// <summary>
        /// Info read value converter
        /// </summary>
        var info = [1];
        if (vIsEstStr(v)) {
            var roles = v.split(',');
            if (roles.length > 0) {
                $.each(roles, function (_, val) {
                    var r = val.trim().split('|');
                    if (r.length == 3) {
                        if (!(isNaN(r[0]) || isNaN(r[1]) || isNaN(r[2]))) {
                            info.push(r.join('|'));
                        };
                    }
                });
            }
        }
        return info.join('~');
    },
    gRoleGroup: function (data) {
        var v = data.record.RoleGroups;
        var obj = _.where(this.cf.options, { Id: parseInt(v) });
        if (!obj || obj.length < 1) { return ''; }
        return obj[0].Name;
    },
    gDeactivate: function () {
        var me = this, v = me.view;
        var checkbox = v.find('input[name="IsPrgStatus"]');
        var isChecked = checkbox.prop('checked');
        if (isChecked === true) checkbox.val(3); else checkbox.val(1);
    },

    gIsPrgStatus: function (data) {
        var v = data.record.IsPrgStatus;
        var obj = _.where(this.cf.options, { Id: parseInt(v) });
        if (!obj || obj.length < 1) { return ''; }
        return obj[0].Name;
    },

    svcactive: function () {
        /// <summary>
        /// Info read value converter
        /// </summary>
        var me = this, v = me.view;
        var info = parseInt(v.find('input[name="IsPrgStatus"]').val());
        return info;
    },
    rvcactive: function (x, v) {
        /// <summary>
        /// Info read value converter
        /// </summary>
        var me = this, m = me.view;
        var checkbox = m.find('input[name="IsPrgStatus"]');
        if (vIsEstStr(v)) {
            if (v === 1) { checkbox.prop('checked', false); checkbox.val(1); } else { checkbox.prop('checked', true); checkbox.val(3); }
        }
        return v;
    },
    //#endregion
});
