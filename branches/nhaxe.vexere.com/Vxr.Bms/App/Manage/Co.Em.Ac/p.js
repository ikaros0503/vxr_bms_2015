define({
    //#region Private Methods
    _initOptionRoles: function(models) {
        var me = this, v = me.view;
        var roles = models.gtArr({ Type: 2 }, false);
        var optRs = v.find('select.role');
        optRs.empty();
        $.each(roles, function (i, r) {
            $.vCheckAndAppendOptions(optRs, r.Id, r.Name, 'R');
        });
    },
    _loadPerson: function() {
        var me = this;
        me._listPersons = [];
        var ajax = {
            _a: 'fGetPerson',
            _c: {CompId: app.cid, IsPrgStatus: 1},
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
        }
    },

    onVMLoaded: function () {
        var me = this;
        //$.vLoadRightConfig(me.view.find('.role').val(), me.view.find('.account-info'));
        var isLoaded = false;
        $(document).ajaxStop(function () {
            if (!isLoaded) {
                me.view.find('select.agent-id').trigger('change');
                isLoaded = true;
            }
        });
    },

    afterReload: function (models) {
        var me = this;
        me._initOptionRoles(models);
        me.view.find('button.dupInfo').unbind().on('click', function(e) {
            e.preventDefault();
            me._copyInfo(true);
        });
        me._loadPerson();
    },

    //#endregion

    //#region Listeners
    onRoleChange: function(w, x, e) {
        //$.vLoadRightConfig(x.val(), w.find('.account-info'));
        this._copyInfo(false);
    },
    _copyInfo: function(isDup) {
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
                $.each(cInfo, function(_, val) {
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
    gDisInfo: function(data) {
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
    rvcInfo: function(x, v) {
        /// <summary>
        /// Info read value converter
        /// </summary>
        if (vIsEstStr(v)) {
            var roles = v.substring(v.indexOf('~')+1).split('~');
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
            if (roles.length > 1) {
                $.each(roles, function(_, val) {
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
    }
    //#endregion
});
