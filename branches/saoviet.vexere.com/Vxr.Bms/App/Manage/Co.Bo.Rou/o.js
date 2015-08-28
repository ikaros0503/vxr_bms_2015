define({
    title: 'Quản lý tuyến đường', name: 'Quản lý tuyến đường',
    grid: true, gTitle: 'Danh sách tuyến đường', gId: 'routeTableContainer', //gRights: 41,
    xWidth: '', cols: 3, winCls: 'tuyenduong', useSmCls: true, autoClear: true,
    keyFields: ['Id'],
    queryAction: 'fGetTrip', updateAction: 'UpTrip', insertAction: 'InTrip',
    //queryConditions: (app.cid == app.vid) ?
    //{
    //    IsPrgStatus: 1, Type: "$x=1 order by IsPrgUpdatedDate desc"
    //} :
    //{
    //    CompId: app.cid, IsPrgStatus: 1,
    //    Type: "$x=1 order by IsPrgUpdatedDate desc"
    //},
    queryConditions: (app.cid == app.vid) ?
        {
            IsPrgStatus: 1,
            Type: 1
            //Type: "$x=3 order by IsPrgUpdatedDate desc" 
        } :
        {
            CompId: app.cid,
            Type: 1,
            IsPrgStatus: 1,
            //Type: "$x=3 order by IsPrgUpdatedDate desc"
        },
    defaultData: { Type: 1, IsPrgStatus: 1, CompId: app.cid}, 
    defaultFocusRef: '.name',
    baseCf: {
        _a: 'fGetTrip',
        _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 },
        _f: 'Id, Name, RouteInfo, FareInfo'
    },

    extCf: {
        _a: 'fGetArea',
        _c: {
            IsPrgStatus: 1,
            Type: '($x in (3,5,15) or ($x=16 and CompId=' + app.cid + '))'
        },
        _f: 'Id, Type, Name, BaseId, CompId, Code'
    },
    items: [
        {
            xtype: 'tabbar', name: 'Tab', grid: false, gQuery: false, form: true, noSave: true,
            items: [
                {
                    xtype: 'tabnav', name: 'BasicInfo', label: 'Thông tin cơ bản', ref: 'basic-info', active: 'active',
                    grid: false, gQuery: false, form: true, notInRow: true /* Khong can dat tab in <div clsss="row"> */,
                },
                {
                    xtype: 'tabnav', name: 'StopArea', label: 'Điểm dừng', ref: 'stop-area',
                    grid: false, gQuery: false, form: true, notInRow: true,
                },
                {
                    xtype: 'tabnav', name: 'Scheduler', label: 'Lịch chạy', ref: 'scheduler',
                    grid: false, gQuery: false, form: true, notInRow: true,
                },
                {
                    xtype: 'tabnav', name: 'Utility', label: 'Tiện ích', ref: 'utility',
                    grid: false, gQuery: false, form: true, notInRow: true,
                }
            ]
        },
        {
            xtype: 'tabcontent', grid: false, gQuery: false, form: true,
            items: [

                {
                    xtype: 'tabpane', name: 'Basic', grid: false, gQuery: false, form: true, cls: 'basic-info', noSave: true,
                    active: 'active',
                    items: [
                        { x: 'Id' },
                        {
                            xtype: 'textbox', name: 'Name', label: "Tên tuyến đường", ref: 'input.name', data: true,
                            form: true, fIdx: 1, cls: 'name', required: true, requiredCls: 'bdred', rights: '',
                            grid: true, gIdx: 1, gQuery: true
                        },
                        {
                            xtype: 'combobox03', name: 'FromArea', label: "Nơi đi", ref: 'select.from-area', data: true,
                            form: true, fIdx: 1, cls: 'from-area', rights: '', cbb: true, options: [], cmCls: 'lstArea',
                            grid: true, gIdx: 3, gQuery: true, svc: 'svcArea', rvc: 'rvcArea', plh: "Chọn",
                            gDis: 'gDisFromArea'
                        },
                        {
                            xtype: 'combobox03', name: 'ToArea', label: "Nơi đến", ref: 'select.to-area', data: true,
                            form: true, fIdx: 1, cls: 'to-area', rights: '', cmCls: 'lstArea', plh: "Chọn",
                            grid: true, gIdx: 4, gQuery: true, cbb: true, options: [], svc: 'svcArea', rvc: 'rvcArea',
                            gDis: 'gDisToArea'
                        },
                        {
                            xtype: 'textbox', name: 'Code', label: "Mã code", ref: 'input.code', data: true,
                            form: true, fIdx: 1, cls: 'code', required: true, requiredCls: 'bdred', rights: '',
                            grid: true, gIdx: 1, gQuery: true
                        },
                        {
                            xtype: 'combobox', name: 'SeatTemplateInfo', cbb: true, ref: '.seat-template-info', data: true, gIdx: 7,
                            label: "Sơ đồ ghế", form: true, cls: 'seat-template-info', rights: '', options: [],
                            grid: true, gQuery: true, gDis: 'gDisStpl', svc: 'svcStpl', rvc: 'rvcStpl',
                            listConfig: {
                                ajax: {
                                    _a: 'fGetResource',
                                    _c: { CompId: app.cid, Type: 1, IsPrgStatus: 1 }, _f: 'Id, Name, Info, SummaryInfo, ExtendedSummaryInfo'
                                }, valField: 'Id', displayField: 'Name'
                            }
                        },
                        {
                            xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.route-note', data: true,
                            form: true, fIdx: 1, cls: 'route-note', rights: '',
                            grid: true, gIdx: 8, gQuery: true
                        },
                        {
                            xtype: 'textbox', name: 'RouteId', label: "RouteId", ref: 'input.routeId', data: true,
                            form: true, fIdx: 4, cls: 'routeId', rights: '',
                            grid: true, gIdx: 80, gQuery: true
                        }
                    ]
                },
                {
                    xtype: 'tabpane2', name: 'StopArea', grid: false, gQuery: false, form: true, cls: 'stop-area', noSave: true,
                    items: [
                        {
                            name: 'RouteInfo', id: 'route-table', ref: 'input.route-info', data: true,
                            form: true, cls: 'route-info', rights: '',
                            options: [], grid: false, gQuery: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 5,
                            formToGridOnly: true, tableContent: true,
                        },
                        {
                            name: 'TotalStage', id: 'total-stage', ref: 'input.total-stage', data: true,
                            form: true, cls: 'total-stage', rights: '',
                            options: [], grid: false, gQuery: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 5,
                            formToGridOnly: true,
                        },
                        {
                            name: 'FromId', id: 'fromId', ref: 'input.fromId', data: true,
                            form: true, cls: 'fromId', rights: '',
                            options: [], grid: false, gQuery: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 5,
                            formToGridOnly: true,
                        },
                        {
                            name: 'ToId', id: 'toId', ref: 'input.toId', data: true,
                            form: true, cls: 'toId', rights: '',
                            options: [], grid: false, gQuery: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 5,
                            formToGridOnly: true,
                        },
                        //{
                        //    name: 'FareInfo', id: 'fare-table', ref: 'input.fare-info', data: true,
                        //    form: true, cls: 'fare-info', rights: '',
                        //    options: [], grid: false, gQuery: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 5,
                        //    formToGridOnly: true
                        //},
                        {
                            xtype: 'table', id: 'route-table', form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                            cls: 'table mt10 mb0', notInRow: true, formToGridOnly: true,
                            theads: [
                                { name: 'Tỉnh/Thành' }, { name: 'Quận/Huyện' }, { name: 'Điểm dừng' }, { name: 'Khoảng cách' }, { name: 'Thời gian' }, { name: '' }
                            ],
                            items: [
                                {
                                    xtype: 'tbody', grid: false, gQuery: false, form: true,
                                    items: [
                                        {
                                            xtype: 'tr', grid: false, gQuery: false, form: true,
                                            items: [
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'combobox01', name: 'City', field: 'City', ref: '.city', data: true,
                                                            label: "Thành phố", form: true, cls: 'city', rights: '', options: [], gIdx: 1, fIdx: 1, flex: 2,
                                                            baseValField: 'Id', baseDisplayField: 'City',
                                                            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true, cbb: true,
                                                            listeners: [{ xChange: 'onCityChange' }],
                                                            //listConfig: {
                                                            //    ajax: {
                                                            //        _a: 'fGetArea',
                                                            //        _c: { Type: 3, IsPrgStatus: 1 },
                                                            //        _f: 'Id, Name'
                                                            //    }, valField: 'Id', displayField: 'Name'
                                                            //}
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'combobox01', name: 'Ward', ref: '.ward', data: true,
                                                            label: "Quận/Huyện", cls: 'ward', rights: '', options: [],
                                                            baseValField: 'Id', baseDisplayField: 'Ward', form: true, fIdx: 2, flex: 2,
                                                            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
                                                            listeners: [{ xChange: 'onWardChange' }],
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'combobox01', name: 'StopArea', ref: '.stop-area', data: true,
                                                            label: "Điểm dừng", cls: 'stop-area', rights: '', options: [],
                                                            baseValField: 'Id', baseDisplayField: 'StopArea', form: true, fIdx: 2, flex: 2,
                                                            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
                                                        }
                                                    ]
                                                },
                                                //{
                                                //    xtype: 'td', grid: false, gQuery: false, form: true,
                                                //    items: [
                                                //        {
                                                //            xtype: 'textbox05', name: 'PointCode', label:'Mã', ref: 'input.point-code', data: true,
                                                //            form: true, fIdx: 3, flex: 1, cls: 'w80 point-code', rights: '', gWidth: '7%', flex: 1,
                                                //            gQuery: false, noSave: true, notInRow: true, val: '---'
                                                //        }
                                                //    ]
                                                //},
                                                //{
                                                //    xtype: 'td', grid: false, gQuery: false, form: true,
                                                //    items: [
                                                //        {
                                                //            xtype: 'textbox05', name: 'Address', label: "Địa chỉ", ref: 'input.address', data: true,
                                                //            form: true, fIdx: 3, flex: 1, cls: 'w80 address', rights: '', gWidth: '7%', flex: 1,
                                                //            gQuery: false, noSave: true, notInRow: true
                                                //        }
                                                //    ]
                                                //},
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'textbox05', name: 'Distance', val: "0", ref: 'input.distance', data: true,
                                                            form: true, fIdx: 3, flex: 1, cls: 'w80 distance', rights: '', gWidth: '7%',
                                                            gQuery: false, noSave: true, notInRow: true
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'div', cls: 'form-inline',
                                                            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                                                            items: [
                                                                {
                                                                    xtype: 'textbox05', name: 'Hour', val: "0:0", ref: 'input.hour', data: true,
                                                                    form: true, fIdx: 4, flex: 0.5, cls: 'w50 hour', rights: '', gWidth: '7%',
                                                                    grid: false, gIdx: 4, gQuery: false, noSave: true, notInRow: true
                                                                }
                                                                //{
                                                                //    xtype: 'textbox05', name: 'Minute', val: "0", ref: 'input.minute', data: true,
                                                                //    form: true, fIdx: 4, flex: 0.5, cls: 'w50 minute', rights: '', gWidth: '7%',
                                                                //    grid: false, gIdx: 4, gQuery: false, noSave: true, notInRow: true
                                                                //}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true, cls: 'wid150',
                                                    items: [
                                                        {
                                                            xtype: 'iconbutton1', name: 'btnAddRouteStop', label: 'Thêm', ref: 'button.addRouteStop', noSave: true, data: true,
                                                            form: true, cls: 'btn-success mt0 addRouteStop add-new', iconCls: 'glyphicon-plus', notInRow: true,
                                                            row: '1',
                                                            listeners: [{ xClick: 'onAddRouteStop' }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }, // tr 1st
                                        {
                                            xtype: 'tr', grid: false, gQuery: false, form: true,
                                            items: [
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'combobox01', name: 'City', ref: '.city', data: true,
                                                            label: "Thành phố", form: true, cls: 'city', rights: '', options: [], gIdx: 1, fIdx: 1, flex: 2,
                                                            baseValField: 'Id', baseDisplayField: 'City',
                                                            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true, cbb: true,
                                                            listeners: [{ xChange: 'onCityChange' }],
                                                            //listConfig: {
                                                            //    ajax: {
                                                            //        _a: 'fGetArea',
                                                            //        _c: {Type:3, IsPrgStatus:1},
                                                            //        _f: 'Id, Name'
                                                            //    }, valField: 'Id', displayField: 'Name'
                                                            //}
                                                        }
                                                    ]
                                                },
                                                 {
                                                     xtype: 'td', grid: false, gQuery: false, form: true,
                                                     items: [
                                                         {
                                                             xtype: 'combobox01', name: 'Ward', ref: '.ward', data: true,
                                                             label: "Quận/Huyện", cls: 'ward', rights: '', options: [],
                                                             baseValField: 'Id', baseDisplayField: 'Ward', form: true, fIdx: 2, flex: 2,
                                                             grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
                                                             listeners: [{ xChange: 'onWardChange' }],
                                                         }
                                                     ]
                                                 },
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'combobox01', name: 'StopArea', ref: '.stop-area', data: true,
                                                            label: "Điểm dừng", cls: 'stop-area', rights: '', options: [],
                                                            baseValField: 'Id', baseDisplayField: 'StopArea', form: true, fIdx: 2, flex: 2,
                                                            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
                                                            //listeners: [{ xChange: 'onCityChange' }],
                                                        }
                                                    ]
                                                },
                                                //{
                                                //    xtype: 'td', grid: false, gQuery: false, form: true,
                                                //    items: [
                                                //        {
                                                //            xtype: 'textbox05', name: 'PointCode', label: 'Mã', ref: 'input.point-code', data: true,
                                                //            form: true, fIdx: 3, flex: 1, cls: 'w80 point-code', rights: '', gWidth: '7%', flex: 1,
                                                //            gQuery: false, noSave: true, notInRow: true, val: '---'
                                                //        }
                                                //    ]
                                                //},
                                                //{
                                                //    xtype: 'td', grid: false, gQuery: false, form: true,
                                                //    items: [
                                                //        {
                                                //            xtype: 'textbox05', name: 'Address', label: "Địa chỉ", ref: 'input.address', data: true,
                                                //            form: true, fIdx: 3, flex: 1, cls: 'w80 address', rights: '', gWidth: '7%', flex: 1,
                                                //            gQuery: false, noSave: true, notInRow: true
                                                //        }
                                                //    ]
                                                //},
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'textbox05', name: 'Distance', val: "0", ref: 'input.distance', data: true,
                                                            form: true, fIdx: 3, cls: 'w80 distance', rights: '', gWidth: '7%', flex: 1,
                                                            gQuery: false, noSave: true, notInRow: true
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                                    items: [
                                                        {
                                                            xtype: 'div', cls: 'form-inline',
                                                            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                                                            items: [
                                                                {
                                                                    xtype: 'textbox05', name: 'Hour', val: "0:0", ref: 'input.hour', data: true,
                                                                    form: true, fIdx: 4, flex: 0.5, cls: 'w50 hour', rights: '', gWidth: '7%',
                                                                    grid: false, gIdx: 4, gQuery: false, noSave: true, notInRow: true
                                                                }
                                                                //{
                                                                //    xtype: 'textbox05', name: 'Minute', val: "0", ref: 'input.minute', data: true,
                                                                //    form: true, fIdx: 4, flex: 0.5, cls: 'w50 minute', rights: '', gWidth: '7%',
                                                                //    grid: false, gIdx: 4, gQuery: false, noSave: true, notInRow: true
                                                                //}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'td', grid: false, gQuery: false, form: true, cls: 'wid150'
                                                }
                                            ]
                                        } // tr 2st
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'tabpane', name: 'Scheduler', grid: false, gQuery: false, form: true, cls: 'scheduler', noSave: true,
                    items: [
                        {
                            xtype: 'div', cls: 'row mt10',
                            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                            items: [
                                {
                                    xtype: 'textbox09', name: 'Info', label: "Giờ chạy", ref: 'input.info', data: true,
                                    form: true, fIdx: 3, flex: 4, cls: 'info', required: true, requiredCls: 'bdred', rights: '',
                                    grid: true, gIdx: 1, gQuery: true, notInRow: true, gDis: "gDisDptTime",

                                },
                                {
                                    xtype: 'textbox07', name: 'GenTime', label: "Tạo giờ", ref: 'input.genTime', data: true,
                                    form: true, fIdx: 1, flex: 2, cls: 'genTime', eCls: 'genTimeStop', required: false, rights: '', noSave: true,
                                    grid: false, gIdx: 1, gQuery: false, notInRow: true, eCls1: 'frequence', eLabel: 'Tần suất', btnLbl: 'Tạo giờ',
                                    iconCls: 'glyphicon-circle-arrow-right', plh0: 'Bắt đầu (hh:mm)', plh1: 'Kết thúc (hh:mm)', plh2: 'phút/chuyến'
                                },
                                {
                                    xtype: 'textbox08', name: 'AddDelTime', label: "Thêm/xóa giờ", ref: 'input.addDelTime', data: true,
                                    form: true, fIdx: 2, flex: 1, cls: 'addDelTime', required: false, rights: '', noSave: true, plh: 'hh:mm',
                                    grid: false, gIdx: 1, gQuery: false, notInRow: true, eCls1: 'addTime', eCls2: 'delTime', btnLbl1: 'Thêm', btnLbl2: 'Xóa',
                                    iconCls1: 'glyphicon-plus', iconCls2: 'glyphicon-remove'
                                },


                        //        {
                        //            xtype: 'div', cls: 'col-md-2 col-sm-2',
                        //            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //            items: [
                        //                {
                        //                    xtype: 'checkbox', label: "Chạy cách khoảng", ref: 'input.run-repeat',
                        //                    form: true, fIdx: 1, rights: '', notInRow: true,
                        //                    grid: false, gQuery: false
                        //                },
                        //            ]
                        //        },
                        //        {
                        //            xtype: 'div', cls: 'col-md-9 col-sm-9',
                        //            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //            items: [
                        //                {
                        //                    xtype: 'div', cls: 'form-inline', role: 'form',
                        //                    form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //                    items: [
                        //                        {
                        //                            xtype: 'div', cls: 'form-group pl10 mt10',
                        //                            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //                            items: [
                        //                                {
                        //                                    xtype: 'label', label: "Giờ từ",
                        //                                    form: true, fIdx: 1, cls: 'exampleInputEmail2', rights: '',
                        //                                    grid: true, gIdx: 1, gQuery: true, notInRow: true
                        //                                },
                        //                                {
                        //                                    xtype: 'input', inputType: 'text', name: 'BeginTime', ref: 'input.begin-time',
                        //                                    form: true, fIdx: 2, cls: 'form-control w80 input-sm', rights: '',
                        //                                    grid: true, gIdx: 1, gQuery: true, notInRow: true
                        //                                }
                        //                            ]
                        //                        },
                        //                        {
                        //                            xtype: 'div', cls: 'form-group pl10 mt10',
                        //                            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //                            items: [
                        //                                {
                        //                                    xtype: 'label', label: "Đến",
                        //                                    form: true, fIdx: 1, cls: 'exampleInputEmail2', rights: '',
                        //                                    grid: true, gIdx: 1, gQuery: true, notInRow: true
                        //                                },
                        //                                {
                        //                                    xtype: 'input', inputType: 'text', name: 'EndTime', ref: 'input.end-time',
                        //                                    form: true, fIdx: 2, cls: 'form-control w80 input-sm', rights: '',
                        //                                    grid: true, gIdx: 1, gQuery: true, notInRow: true
                        //                                }
                        //                            ]
                        //                        },
                        //                        {
                        //                            xtype: 'div', cls: 'form-group pl10 mt10',
                        //                            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //                            items: [
                        //                                {
                        //                                    xtype: 'label', label: "Cách (phút)",
                        //                                    form: true, fIdx: 1, cls: 'exampleInputEmail2', rights: '',
                        //                                    grid: true, gIdx: 1, gQuery: true, notInRow: true
                        //                                },
                        //                                {
                        //                                    xtype: 'input', inputType: 'text', name: 'RestTime', ref: 'input.rest-time',
                        //                                    form: true, fIdx: 2, cls: 'form-control w80 input-sm', rights: '',
                        //                                    grid: true, gIdx: 1, gQuery: true, notInRow: true
                        //                                }
                        //                            ]
                        //                        },
                        //                        {

                        //                            xtype: 'iconbutton', name: 'btnAddTime', ref: 'button.add-time',
                        //                            cls: 'btn-success mt0 btn-sm add-time', iconCls: 'glyphicon-plus',
                        //                            form: true, notInRow: true,
                        //                            listeners: [
                        //                            {
                        //                                xClick: '',// rights: 54
                        //                            }]
                        //                        }
                        //                    ]
                        //                },
                        //            ]
                        //        }
                        //    ]
                        //},
                        //{
                        //    xtype: 'div', cls: 'row mt10',
                        //    form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //    items: [
                        //        {
                        //            xtype: 'div', cls: 'col-md-2 col-sm-2',
                        //            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //            items: [
                        //                {
                        //                    xtype: 'checkbox', label: "Giờ chính xác", ref: 'input.fix-time',
                        //                    form: true, fIdx: 1, rights: '', notInRow: true,
                        //                    grid: false, gQuery: false
                        //                },
                        //            ]
                        //        },
                        //        {
                        //            xtype: 'div', cls: 'col-md-6 col-sm-6',
                        //            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //            items: [
                        //               {
                        //                   xtype: 'input', inputType: 'text', name: 'BeginTime', ref: 'input.begin-time',
                        //                   form: true, fIdx: 2, cls: 'form-control input-sm', rights: '',
                        //                   grid: true, gIdx: 1, gQuery: true, notInRow: true
                        //               }
                        //            ]
                        //        }
                        //    ]
                        //},
                        //{
                        //    xtype: 'div', cls: 'row mt10',
                        //    form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //    items: [
                        //        {
                        //            xtype: 'div', cls: 'col-md-2 col-sm-2',
                        //            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //            items: [
                        //                {
                        //                    xtype: 'checkbox', label: "Lặp lại hằng ngày", ref: 'input.repeat-day',
                        //                    form: true, fIdx: 1, rights: '', notInRow: true,
                        //                    grid: false, gQuery: false
                        //                },
                        //            ]
                        //        },
                        //        {
                        //            xtype: 'div', cls: 'col-md-6 col-sm-6',
                        //            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //            items: [
                        //                {
                        //                    xtype: 'div', cls: 'form-inline',
                        //                    form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        //                    items: [
                        //                       {
                        //                            xtype: 'checkbox', label: "T2", ref: 'input.moday',
                        //                            form: true, fIdx: 1, rights: '', notInRow: true,
                        //                            grid: false, gQuery: false
                        //                       },
                        //                       {
                        //                           xtype: 'checkbox', label: "T3", ref: 'input.tuday',
                        //                           form: true, fIdx: 1, rights: '', notInRow: true,
                        //                           grid: false, gQuery: false, align: 'm120'
                        //                       },
                        //                       {
                        //                           xtype: 'checkbox', label: "T4", ref: 'input.weday',
                        //                           form: true, fIdx: 1, rights: '', notInRow: true,
                        //                           grid: false, gQuery: false, align: 'm120'
                        //                       },
                        //                       {
                        //                           xtype: 'checkbox', label: "T5", ref: 'input.thday',
                        //                           form: true, fIdx: 1, rights: '', notInRow: true,
                        //                           grid: false, gQuery: false, align: 'm120'
                        //                       },
                        //                       {
                        //                           xtype: 'checkbox', label: "T6", ref: 'input.frday',
                        //                           form: true, fIdx: 1, rights: '', notInRow: true,
                        //                           grid: false, gQuery: false, align: 'm120'
                        //                       },
                        //                       {
                        //                           xtype: 'checkbox', label: "T7", ref: 'input.saday',
                        //                           form: true, fIdx: 1, rights: '', notInRow: true,
                        //                           grid: false, gQuery: false, align: 'm120'
                        //                       },
                        //                       {
                        //                           xtype: 'checkbox', label: "CN", ref: 'input.suday',
                        //                           form: true, fIdx: 1, rights: '', notInRow: true,
                        //                           grid: false, gQuery: false, align: 'm120'
                        //                       },
                        //                    ]
                        //                }
                        //            ]
                        //        }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'tabpane', name: 'Utility', grid: false, gQuery: false, form: true, cls: 'utility', noSave: true,

                    items: [
                        {
                            name: 'FacilityInfo', ref: 'input.facility-info', label: "Tiện ích", data: true,
                            form: true, cls: 'facility-info', rights: '',
                            options: [], grid: false, gQuery: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 5,
                            formToGridOnly: true, isUtility: true
                        },
                        {

                            xtype: 'div', cls: 'form-group form-group-sm mt10',
                            form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false, formToGridOnly: true,
                            items: [
							    {
							        xtype: 'div', cls: 'form-inline', id: 'utility-form',
							        form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
							        items: [
                                        {
                                            xtype: 'checkbox', label: "Nước uống", ref: 'input.water', cls: 'water', code: '1', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false
                                        },
                                        {
                                            xtype: 'checkbox', label: "Khăn lạnh", ref: 'input.towel', cls: 'towel', code: '2', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false, align: 'm120'
                                        },
                                        {
                                            xtype: 'checkbox', label: "Toilet", ref: 'input.toilet', cls: 'toilet', code: '3', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false, align: 'm120'
                                        },
                                        {
                                            xtype: 'checkbox', label: "DVD", ref: 'input.dvd', cls: 'dvd', code: '4', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false, align: 'm120'
                                        },
                                        {
                                            xtype: 'checkbox', label: "Điều hòa", ref: 'input.condition', cls: 'condition', code: '5', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false, align: 'm120'
                                        },
                                        {
                                            xtype: 'checkbox', label: "Chăn đắp", ref: 'input.rug', cls: 'rug', code: '6', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false, align: 'm120'
                                        },
                                        {
                                            xtype: 'checkbox', label: "Thức ăn", ref: 'input.food', cls: 'food', code: '7', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false, align: 'm120'
                                        },
                                        {
                                            xtype: 'checkbox', label: "Wifi", ref: 'input.wifi', cls: 'wifi', code: '8', data: true,
                                            form: true, fIdx: 1, rights: '', notInRow: true,
                                            grid: false, gQuery: false, align: 'm120'
                                        }
							        ]
							    }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'hr', cls: 'mt10 mb10',
            form: true, grid: false, gIdx: 1, gQuery: false, notInRow: true,
        }

    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveRoute', label: 'Thêm', ref: 'button.saveRoute',
            form: true, cls: 'btn-success saveRoute add-new save', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onRouteSave' }]
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled', iconCls: 'glyphicon-remove-sign',
            messSucc: 'Xóa tuyến đường thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onBasicDelete' }]

        }
    ],

    routeStopRow: { xtype: 'tr', grid: false, gQuery: false, form: true },

    routeStopItems: [
            {
                xtype: 'td', grid: false, gQuery: false, form: true,
                items: [
                    {
                        xtype: 'combobox01', name: 'City', ref: '.city',
                        label: "Thành phố", form: true, cls: 'city', rights: '', options: [], gIdx: 1, fIdx: 1, flex: 2,
                        baseValField: 'Id', baseDisplayField: 'City',
                        grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true, cbb: true,
                        listeners: [{ xChange: 'onCityChange' }],
                        //listConfig: {
                        //    ajax: {
                        //        _a: 'fGetArea',
                        //        _c: { Type: 3, IsPrgStatus: 1 },
                        //        _f: 'Id, Name'
                        //    }, valField: 'Id', displayField: 'Name'
                        //}
                    }
                ]
            },
            {
                xtype: 'td', grid: false, gQuery: false, form: true,
                items: [
                    {
                        xtype: 'combobox01', name: 'Ward', ref: '.ward', data: true,
                        label: "Quận/Huyện", cls: 'ward', rights: '', options: [],
                        baseValField: 'Id', baseDisplayField: 'Ward', form: true, fIdx: 2, flex: 2,
                        grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
                        listeners: [{ xChange: 'onWardChange' }],
                    }
                ]
            },
            {
                xtype: 'td', grid: false, gQuery: false, form: true,
                items: [
                    {
                        xtype: 'combobox01', name: 'StopArea', ref: '.stop-area',
                        label: "Điểm dừng", cls: 'stop-area', rights: '', options: [],
                        baseValField: 'Id', baseDisplayField: 'StopArea', form: true, fIdx: 2, flex: 2,
                        grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
                    }
                ]
            },
            //{
            //    xtype: 'td', grid: false, gQuery: false, form: true,
            //    items: [
            //        {
            //            xtype: 'textbox05', name: 'PointCode', label: 'Mã', ref: 'input.point-code', data: true,
            //            form: true, fIdx: 3, flex: 1, cls: 'point-code', rights: '', gWidth: '7%', flex: 1,
            //            gQuery: false, noSave: true, notInRow: true, val:''
            //        }
            //    ]
            //},
            //{
            //    xtype: 'td', grid: false, gQuery: false, form: true,
            //    items: [
            //        {
            //            xtype: 'textbox05', name: 'Address', label: "Địa chỉ", ref: 'input.address', data: true,
            //            form: true, fIdx: 3, flex: 1, cls: 'w80 address', rights: '', gWidth: '7%', flex: 1,
            //            gQuery: false, noSave: true, notInRow: true
            //        }
            //    ]
            //},
            {
                xtype: 'td', grid: false, gQuery: false, form: true,
                items: [
                    {
                        xtype: 'textbox05', name: 'Distance', label: "Khoảng Cách", val: "0", ref: 'input.distance',
                        form: true, fIdx: 3, flex: 1, cls: 'w80 distance', rights: '', gWidth: '7%',
                        gQuery: false, noSave: true, notInRow: true
                    }
                ]
            },
            {
                xtype: 'td', grid: false, gQuery: false, form: true,
                items: [
                    {
                        xtype: 'div', cls: 'form-inline',
                        form: true, fIdx: 1, rights: '', grid: false, gIdx: 1, gQuery: false,
                        items: [
                            {
                                xtype: 'textbox05', name: 'Hour', label: "Thời gian", val: "0:0", ref: 'input.hour',
                                form: true, fIdx: 4, flex: 0.5, cls: 'w50 hour', rights: '', gWidth: '7%',
                                grid: true, gIdx: 4, gQuery: false, noSave: true, notInRow: true
                            }
                            //{
                            //    xtype: 'textbox05', name: 'Minute', label: "Khoảng Cách", val: "0", ref: 'input.minute',
                            //    form: true, fIdx: 4, flex: 0.5, cls: 'w50 minute', rights: '', gWidth: '7%',
                            //    grid: true, gIdx: 4, gQuery: false, noSave: true, notInRow: true
                            //}
                        ]
                    }
                ]
            },
            {
                xtype: 'td', grid: false, gQuery: false, form: true,
                items: [
                    {
                        xtype: 'iconbutton1', name: 'btnAddRouteStop', label: 'Thêm', ref: 'button.addRouteStop', noSave: true,
                        form: true, cls: 'btn-success mt0 addRouteStop add-new', iconCls: 'glyphicon-plus', notInRow: true,
                        listeners: [{ xClick: 'onAddRouteStop' }]
                    },
                    {
                        xtype: 'iconbutton1', name: 'btnDelRouteStop', label: 'Xóa', ref: 'button.delRouteStop',
                        form: true, cls: 'btn-danger mt0 delRouteStop delete', iconCls: 'glyphicon-trash', notInRow: true,
                        listeners: [{ xClick: 'onDelRouteStop' }]
                    }
                ]
            }
    ]
});