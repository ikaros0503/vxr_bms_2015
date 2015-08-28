define({
    title: 'Quản lý giá vé', name: 'Giá vé', grid: true, gTitle: 'Danh sách giá vé', gId: 'fareTableContainer', //gRights: 0
    xWidth: '', cols: 4, winCls: 'giave', useSmCls: true, autoClear: true, keyFields: [''],
    queryAction: 'fGetFareInfo', updateAction: 'UpTrip',insertAction: 'InTrip',
    queryConditions: (app.cid == app.vid) ?
    {
        IsPrgStatus: 1,
        Type: 1
        //Type: "$x=3 order by IsPrgUpdatedDate desc"
    } :(
    app.rights.indexOf($.rights.mFare_cfOnlFare.val) >= 0?
        {
            CompId: app.cid,
            VxrFareInfo: "(Type = 1 or (Type = 2 and ($x is not null and $x != ''))) order by Name, Date"
        } :{
            CompId: app.cid,
            NewFare: "(Type = 1 or (Type = 2 and ($x is not null and $x != ''))) order by Name, Date"
    }),
    defaultData: { Type: 1, IsPrgStatus: 1, CompId: app.cid },

    items: [
        {
            name: 'Name', base: false, ref: 'select.route', gIdx: 1, fIdx: 1, grid: true, gQuery: true, noSave: true, data: true,
            vType: 'num', valField: 'Id',options: [],
            xtype: 'combobox', label: "Tuyến đường", form: true, cbb: true, domain: false, cls: 'route',
            formToGridOnly: true, listeners: [{ xChange: 'onRouteChange' }],
        },
        
        //{
        //    //Version~Index|Type|Code|Name|Address|DistanceFromPrevStop|HoursFromPrevStop|MinutesFromPrevStop~......
        //    xtype: 'combobox', name: 'FromArea', cbb: true, ref: '.from-area-id', data: true,
        //    label: "Điểm đi", form: true, cls: 'from-area-id', rights: '', options: [], gIdx: 2, fIdx: 4,
        //    baseValField: 'Id', baseDisplayField: 'FromAreaId',
        //    grid: true, gQuery: false, noSave: true, combobox: true,
        //    listeners: [{ xChange: 'onFromAreaChange' }],

        //},
        //{
        //    //Version~Index|Type|Code|Name|Address|DistanceFromPrevStop|HoursFromPrevStop|MinutesFromPrevStop~.....
        //    xtype: 'combobox', name: 'ToArea', cbb: true, ref: '.to-area-id', gIdx: 3, fIdx: 5, data: true,
        //    label: "Điểm đến", form: true, cls: 'to-area-id', rights: '', options: [],
        //    grid: true, gQuery: false, noSave: true, combobox: true,
        //    listeners: [{ xChange: 'onToAreaChange' }],
        //},
        //{
        //    //định dạng fare lưu trữ dưới db: 2~1|2|350000|đ||~1|3|380000|đ||
        //    //2: Version
        //    //1: From Area Id
        //    //2: To Area Id
        //    //350000: price
        //    //đ: Unit
        //    xtype: 'textbox04', name: 'Fare', label: "Giá  (VNĐ)", ref: 'input.fare', data: true, vType: 'money',
        //    form: true, fIdx: 6, cls: 'fare', rights: '', gWidth: '7%', grid: true, gIdx:99, gQuery: false, noSave: true,
        //    gDis: 'gDisFare', rvc: 'rvcFare'
        //},
        {
            name: 'Date', type: 'Date', xSearch: true, xSearchDefault: true, domain: true, xSearchAlways: true, data: true,
            grid: true, gQuery: true, gIdx: 88, fIdx: 2, ref: '.dateStart', gWidth: '5%', required: false, value: '',
            xtype: 'datepickerTpl03', label: "Ngày bắt đầu", glbl: "Ngày áp dụng", form: true, cls: 'dateStart', rights: '',
            gType: 'date', displayFormat: 'dd-mm-yy', noSave: true, gDis: 'gDisDate'
        },
        {
            name: 'DateStop', type: 'Date', data: true, xSearch: true, xSearchDefault: true, domain: true, xSearchAlways: true,
            grid: false, gQuery: false, fIdx: 3, ref: '.dateStop', gWidth: '5%', 
            xtype: 'datepickerTpl03', label: "Ngày kết thúc", form: true, cls: 'dateStop', rights: '', value: '',
            gType: 'date', displayFormat: 'dd-mm-yy', noSave: true
        },
        
        {
            name: 'Discounts', cbb: false, ref: '.discounts', label: "Chiết khấu", form: true, cls: 'discounts', rights: '', data: true,
            options: [], grid: true, gQuery: false, noSave: true, xtype: 'textbox11', gIdx: 5, fIdx: 4, eCls: 'applyDiscount', gDis: 'gDisDiscount'
        },
        {
            xtype: 'inputHidden01', name: 'FareInfo', cbb: false, ref: 'input.fare-info', label: "Gia Ve", data: true,
            form: true, cls: 'fare-info', rights: '', grid: false, gQuery: true,
        },
        {
            xtype: 'inputHidden01', name: 'Info', cbb: false, ref: 'input.info', label: "Time", data: true,
            form: true, cls: 'info', rights: '', grid: false, gQuery: true, noSave: true
        },
        {
            xtype: 'inputHidden01', name: 'Type', cbb: false, ref: 'input.type', data: true,
            form: true, cls: 'type', rights: '', grid: false, gQuery: true, noSave: true
        },
        {
            name: 'Discount', cbb: false, ref: '.discount', label: "Chiết khấu", form: true, cls: 'discount', rights: '', data: true,
            options: [], grid: false, gQuery: true, noSave: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 10,
        },
        {
            name: 'VxrDiscount', cbb: false, ref: '.vxrdiscount', label: "Chiết khấu", form: true, cls: 'vxrdiscount', rights: '', data: true,
            options: [], grid: false, gQuery: true, noSave: true, xtype: 'inputHidden01',  fIdx: 10,
        },
        {
            name: 'RouteInfo', cbb: false, ref: '.route-info', label: "RouteInfo", form: true, cls: 'route-info', rights: '', data: true,
            options: [], grid: false, gQuery: true, noSave: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 10,
            formToGridOnly: true,
        },
        {
            name: 'NewFare', cbb: false, ref: '.new-fare', label: "NewFare", form: true, cls: 'new-fare', rights: '', data: true,
            options: [], grid: false, gQuery: true, noSave: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 10,
            formToGridOnly: true,
        },
        {
            name: 'VxrFareInfo', cbb: false, ref: '.vxr-fare-info', label: "Giá vé Online", form: true, cls: 'vxr-fare-info', rights: '', data: true,
            options: [], grid: false, gQuery: true, noSave: true, xtype: 'inputHidden01', gIdx: 5, fIdx: 10,
            formToGridOnly: true,
        },
        {
            xtype: 'table', id: 'fare-table', form: true, fIdx: 5, rights: '', grid: false, gIdx: 1, gQuery: false,
            cls: 'table mt10 mb0', notInRow: true, formToGridOnly: true, noSave: true,
            theads: [
                { name: 'Nơi đi' }, { name: 'Nơi đến' }, { name: 'Giá' }
            ],
            items: [
                {
                    xtype: 'tbody', grid: false, gQuery: false, form: true, noSave: true,
                    items: [
                        {
                            xtype: 'tr', grid: false, gQuery: false, form: true, noSave: true,
                            items: [
                                {
                                    xtype: 'td', grid: false, gQuery: false, form: true, noSave: true,
                                    items: [
                                        {
                                            //Version~Index|Type|Code|Name|Address|DistanceFromPrevStop|HoursFromPrevStop|MinutesFromPrevStop~......
                                            xtype: 'textbox00', name: 'FromArea', cbb: true, ref: '.from-area-id', data: true,
                                            label: "Điểm đi", form: true, cls: 'from-area-id', rights: '', options: [], gIdx: 2, fIdx: 4,
                                            disabled: 'disabled',
                                            grid: false, gQuery: false, noSave: true, combobox: true,
                                            listeners: [{ xChange: 'onFromAreaChange' }], notInRow: true,
                                        }
                                    ]
                                },
                                {
                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                    items: [
                                        {
                                            //Version~Index|Type|Code|Name|Address|DistanceFromPrevStop|HoursFromPrevStop|MinutesFromPrevStop~.....
                                            xtype: 'textbox00', name: 'ToArea', cbb: true, ref: '.to-area-id', gIdx: 3, fIdx: 5, data: true,
                                            label: "Điểm đến", form: true, cls: 'to-area-id', rights: '', options: [], disabled: 'disabled',
                                            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
                                            listeners: [{ xChange: 'onToAreaChange' }],
                                        }
                                    ]
                                },
                                {
                                    xtype: 'td', grid: false, gQuery: false, form: true,
                                    items: [
                                        {
                                            //định dạng fare lưu trữ dưới db: 2~1|2|350000|đ||~1|3|380000|đ||
                                            //2: Version
                                            //1: From Area Id
                                            //2: To Area Id
                                            //350000: price
                                            //đ: Unit
                                            xtype: 'textbox01', name: 'Fare', label: "Giá  (VNĐ)", ref: 'input.fare', data: true, vType: 'money',
                                            form: true, fIdx: 6, cls: 'fare', rights: '', gWidth: '7%', grid: false, gIdx: 99, gQuery: false, noSave: true,
                                            rvc: 'rvcFare', notInRow: true,
                                        }
                                    ]
                                }
                            ]}
                        ]}
                    ]}
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveFare', label: 'Thêm', ref: 'button.saveFare',
            form: true, cls: 'btn-success saveFare save hidden', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onSaveFare' }], rights: $.rights.mFare_cfFare.dtr
        },
        {
            xtype: 'iconbutton', name: 'btnClear', label: 'Clear', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new', iconCls: 'glyphicon-refresh',
            listeners: [{ xClick: 'onFareClear' }], 
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled hidden', iconCls: 'glyphicon-remove-sign',
            messSucc: 'Xóa giá vé thành công.', rights: $.rights.mFare_cfFare.dtr,
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onDeleteFare' }]
        },
        {
            xtype: 'iconbutton', name: 'btnsaveVxrFare', label: 'Lưu giá Online', ref: 'button.saveVxrFare',
            form: true, cls: 'btn-success saveVxrFare hidden', iconCls: 'glyphicon-globe',
            listeners: [{ xClick: 'onSaveVxrFare' }], rights: $.rights.mFare_cfOnlFare.dtr
        },
        {
            xtype: 'iconbutton', name: 'btnDelVxrFare', label: 'Xóa giá Online', ref: 'button.delVxrFare',
            form: true, cls: 'btn-danger delVxrFare hidden', iconCls: 'glyphicon-globe',
            listeners: [{ xClick: 'onDelVxrFare' }], rights: $.rights.mFare_cfOnlFare.dtr
        }
    ],
    fareRow:
        [
            {
                xtype: 'td', grid: false, gQuery: false, form: true, noSave: true,
                items: [
                    {
                        xtype: 'textbox00', name: 'FromArea', cbb: true, ref: '.from-area-id', data: true,
                        label: "Điểm đi", form: true, cls: 'from-area-id', rights: '', options: [], gIdx: 2, fIdx: 4,
                        grid: false, gQuery: false, noSave: true, combobox: true, disabled: 'disabled',
                        listeners: [{ xChange: 'onFromAreaChange' }], notInRow: true,
                    }
                ]
            },
            {
                xtype: 'td', grid: false, gQuery: false, form: true, noSave: true,
                items: [
                    {
                        xtype: 'textbox00', name: 'ToArea', cbb: true, ref: '.to-area-id', gIdx: 3, fIdx: 5, data: true,
                        label: "Điểm đến", form: true, cls: 'to-area-id', rights: '', options: [], alwaysDisable: true,
                        grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true, disabled: 'disabled',
                        listeners: [{ xChange: 'onToAreaChange' }],
                    }
                ]
            },
            {
                xtype: 'td', grid: false, gQuery: false, form: true, noSave: true,
                items: [
                    {
                        xtype: 'textbox01', name: 'RouteFare', label: "Giá  (VNĐ)", ref: 'input.routeFare', data: true, vType: 'money', alwaysDisable: true,
                        form: true, fIdx: 6, cls: 'routeFare', rights: '', gWidth: '7%', grid: false, gIdx: 99, gQuery: false, noSave: true,
                        notInRow: true,
                    }
                ]
            }
        ]
});