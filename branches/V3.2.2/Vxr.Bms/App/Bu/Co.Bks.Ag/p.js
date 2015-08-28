define({
    loadAgentUI: function () {
        // $('.ui-layout-west').removeClass('hidden');
        // $('.ui-layout-east').removeClass('hidden');
        $('body').layout({
            applyDemoStyles: true,
            north__showOverflowOnHover: true,
            //north__border: "0px solid #BBB",
            north__spacing_open: 0,
            south__spacing_open: 0,
            west__initClosed: true,
            east__initClosed: true
        }).hide('east');
        $('#agtComps').append('<ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#nhaxe" aria-controls="home" role="tab" data-toggle="tab">Nhà xe</a></li><li role="presentation"><a href="#theotuyen" aria-controls="home" role="tab" data-toggle="tab">Theo tuyến</a></li></ul>');
        
        $('#agtComps').append('<div class="tab-content"><div role="tabpanel" class="tab-pane active" id="nhaxe"><input type="text" name="name" id="compKeyword" class="form-control input-sm" placeholder="Tìm nhà xe"></div><div role="tabpanel" class="tab-pane" id="theotuyen"><input type="text" name="name" id="routeKeyword" class="form-control input-sm" placeholder="Tìm tuyến"></div></div>');
     

        //$('#agtTrips').prepend('<input type="text" name="name" id="routeKeyword" placeholder="Tìm tuyến">');
        $.applyRoute();
        $.applyComp();
        
        $('.ui-layout-north').addClass("hidden-border");    
    },

    start: function (o) {
        try {
            var me = this;
            me.loadAgentUI(app.serviceUrl);
        } catch (e) {
            console.error(e);
        };
    },
});

$(document).ready(function () {

    //$('body').find('.ui-layout-nouth').css('z-index', 4).css('overflow', 'visible');
    $.agtCfg = {
        isApply: true,
        isApplyComp: true,
        isApplyRoute: true,
        isTripChange: false,
        tripRef: "#agtTrips",
        tripTrigger: 'tripChanged',
        tripAjax: {
            _a: 'fGetTripWithContract',
            _c: {
                IsPrgStatus: 1,
                //Type: "$x='1' order by Name desc"
                Type: 10,
                //HasOnlineContract: ' ($x=1 OR  HasOfflineContract=1) '
            },
            _f: 'Id, Name, CompId, CompIdName'
        },
        tripFields: {
            Id: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            Name: {
                title: 'Danh sách tuyến',
                sorting: true,
                display: function (data) {
                    if (data.record.HasOnlineContract) {
                        return '<span style="color: red;" >' + data.record.Name + '</span>';
                    } else {
                        return '<span style="color: blue;" >' + data.record.Name + '</span>';
                    }
                    //return "+ " + data.record.Name + ' <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(' + data.record.CompIdName + ')';
                    //return "<span class='agentRouteCompName'>" + data.record.CompIdName + '</span> <br/> <span class="agentRouteName">' + data.record.Name + '</span>';
                    //return "<span class='agentRouteName'>" + data.record.Name + "</span>" + "<br/>" + "<span class='agentRouteCompName'>" + data.record.CompIdName + "</span>";
                },
            }
        },
        compRef: "#agtComps",
        compTrigger: 'compChanged',
        compAjax: {
            _a: 'fGetCompany',
            _c: {
                IsPrgStatus: 1,
                Type: 1,
                HasOnlineContract: ' ($x=1 OR  HasOfflineContract=1) order by HasOnlineContract desc, Name asc'
            },
            _f: 'Id, Name, HasOnlineContract, HasOfflineContract'
        },
        compFields: {
            Id: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            Name: {
                title: 'Danh sách nhà xe',
                display: function (data) {
                    if (data.record.HasOnlineContract) {
                        return '<span style="color: red;" >' + data.record.Name + '</span>';
                    } else {
                        return '<span style="color: blue;" >' + data.record.Name + '</span>';
                    }
                }
            }
        },

        
    };

    $.agentSearchComp = function (v) {
        $('body').layout().open("west");
        if (v) {
            $.agtCfg.compAjax._c['Name'] = "(($x like N'%" + v + "%') or (Keywords like N'%" + v + "%') or (IsPrgUnsignKeywords like N'%" + v + "%'))";
        } else {
            delete $.agtCfg.compAjax._c['Name'];
        }
        $.loadPanel($.agtCfg.compRef, $.agtCfg.compAjax, $.agtCfg.compFields, $.agtCfg.compTrigger, true);
    };
    $.applyComp = function () {
        if ($.agtCfg.isApplyComp) {
            $('.compListFilterPanel').removeClass('hidden');
            $.loadPanel($.agtCfg.compRef, $.agtCfg.compAjax, $.agtCfg.compFields, $.agtCfg.compTrigger);
            $('#compKeywordIcon').click(function (e) {
                var v = $.trim($('#compKeyword').val());
                $.agentSearchComp(v);
            });
            $('#compKeyword').keyup(function (e) {
                e.preventDefault();
                var v = $.trim($('#compKeyword').val());
                $.agentSearchComp(v);
            });
        }
    };

    $.agentSearchRoute = function (v) {
        if (v) {
            $.agtCfg.tripAjax._c['Name'] = "(($x like N'%" + v + "%') or (Keywords like N'%" + v + "%') or (IsPrgUnsignKeywords like N'%" + v + "%'))";
        } else {
            delete $.agtCfg.tripAjax._c['Name'];
        }
        $.loadPanel($.agtCfg.tripRef, $.agtCfg.tripAjax, $.agtCfg.tripFields, $.agtCfg.tripTrigger, true);
    };

    $.applyRoute = function () {
        if ($.agtCfg.isApplyRoute) {
            $('.compListFilterPanel').removeClass('hidden');
            $.loadPanel($.agtCfg.tripRef, $.agtCfg.tripAjax, $.agtCfg.tripFields, $.agtCfg.tripTrigger);
            $('#routeKeywordIcon').click(function (e) {
                var v = $.trim($('#routeKeyword').val());
                $.agentSearchRoute(v);
            });
            $('#routeKeyword').keypress(function (e) {

                if (e.which == 13) {
                    e.preventDefault();
                }
                var v = $.trim($('#routeKeyword').val());
                if ($.trim(e.key) != '' && e.key.length == 1) {
                    v = v + e.key;
                } else if (e.keyCode == 8) {
                    v = v.substring(0, v.length - 1);

                }
                if (e.which == 32 || e.which == 13 || v.length >= 2) {
                    $.agentSearchRoute(v);

                    //alert(String.fromCharCode(e.which));
                }
            });
        }
    };



    $.loadPanel = function (ref, ajax, fields, trg, isCreated) {
        if (!isCreated) {
            var cf = {
                title: '',
                paging: false,
                sorting: true,
                defaultSorting: 'Name ASC', //Set default sorting
                selecting: true,
                selectingCheckboxes: false,
                actions: { listAction: app.serviceUrl },
                selectionChanged: function () {
                    var $selectedRows = $(ref).jtable('selectedRows');
                    if ($selectedRows.length > 0) {
                        $selectedRows.each(function (idx) {
                            var record = $(this).data('record');
                            $("body").trigger(trg, record);

                        });
                    }
                },
                fields: fields
            };
            $(ref).jtable(cf);
        }

        var arr = [];
        // var fs = ajax._f;
        var fArr = [];
        $.each(ajax._f.split(','), function (i, v) {
            fArr.push($.trim(v));
        });
        var waitingArr = [];
        var waitingObj = {};
        $.each(fArr, function (i, v) {
            waitingObj[v] = '';
        });
        waitingArr.push(waitingObj);
        $(ref).jtable('removeAllRows');
        $(ref).jtable('addLocalRecords', function (lastPostData, params) {
            return {
                Result: 1,
                Records: waitingArr,
                TotalRecordCount: waitingArr.length,
                page: (params.jtStartIndex + params.jtPageSize) / params.jtPageSize,
            };
        });

        vRql(ajax, {
            a: function (u, r, l, t) {
                // $(ref).jtable('removeAllRows');
            },
            m: function (i, d) {
                var obj = {};
                $.each(fArr, function (j, v) {
                    obj[v] = d[j];
                });
                arr.push(obj);
            },
            z: function (u, r, l, t) {
                $(ref).jtable('addLocalRecords', function (lastPostData, params) {
                    return {
                        Result: 1,
                        Records: arr,
                        TotalRecordCount: arr.length,
                        page: (params.jtStartIndex + params.jtPageSize) / params.jtPageSize,
                    };
                });
                $(ref).removeClass('hidden');
                if ((ref) == ($.agtCfg.compRef)) {
                    var rows = $($.agtCfg.compRef).find('tr.jtable-data-row');
                    if (rows.length > 0) $(ref).jtable('selectRows', $(rows[0]));
                    //$("body").trigger(trg);
                }
                if ((ref) == ($.agtCfg.tripRef)) {
                    $(ref).find('.jtable').on('mouseover', function (e) {
                        $.agtCfg.isTripChange = true;
                    });
                    $(ref).find('.jtable').on('mouseleave', function () {
                        $.agtCfg.isTripChange = false;
                    });
                }
            }
        }, this);
    };
    //$("body").on("compChanged", function (e, d) {
    //    if (typeof d != 'undefined' && d != null) {
    //        $.previousCompId = app.cid;
    //        _dict = $.extend({}, _bkDict);
    //        $('body').removeClass('theme' + app.cid);
    //        app.cid = d.Id;
    //        $('body').addClass('theme' + app.cid);
    //        //$.start(app.mds.BksMainModule);
    //        //$('body').trigger('rlBKS');
    //        if (!$.agtCfg.isTripChange) {
    //            if ($.agtCfg.isApplyComp && $.currentRouteId) {
    //                var row = $($.agtCfg.tripRef).jtable('getRowByKey', $.currentRouteId);
    //                $($.agtCfg.tripRef).jtable('deselectRows', row);
    //            }
    //        }
    //        else {

    //        };
    //        $('body').find('#type-report').trigger('change');
    //        //$('body').find('select[name=TripId]').trigger('change');
    //        $('body').find('a.navbar-brand').html(d.Name);
    //    }
    //});
    $("body").on("tripChanged", function (e, d) {
        var selectedRows = $($.agtCfg.tripRef).jtable('selectedRows');
        $.currentRouteId = d.Id;
        app.cid = d.CompId;
        if ($.agtCfg.isApplyComp) {
            var row = $($.agtCfg.compRef).jtable('getRowByKey', app.cid);
            $($.agtCfg.compRef).jtable('selectRows', $(row));
        }
    });
    vbv("tripChangedWithoutReload", function (e, d) {
        
        var selectedRows = $($.agtCfg.tripRef).jtable('selectedRows');
        $.currentRouteId = d.TripId;
        app.cid = d.CompId;
        if ($.agtCfg.isApplyComp) {
            var row = $($.agtCfg.compRef).jtable('getRowByKey', app.cid);
            $($.agtCfg.compRef).jtable('selectRows', $(row));
        }
    });

    vbv("tripNotFound", function (e) {
        var row = $($.agtCfg.compRef).jtable('getRowByKey', $.previousCompId);
        if (row) {
            $($.agtCfg.compRef).jtable('selectRows', row);
        }
    });
});
