define({
    title: 'Quản lý sơ đồ ghế', name: 'Sơ đồ ghế',
    grid: true, gTitle: 'Danh sách sơ đồ ghế', gId: 'seatTplTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'sodoghe', useSmCls: true, autoClear: true,
    keyFields: ['Name'], finalKeyFields: [],
    queryAction: 'fGetResource', updateAction: 'UpResource', insertAction: 'InResource',
    queryConditions: (app.cid == app.vid) ? { IsPrgStatus: 1 } : {
        CompId: '($x = ' + app.cid + ' or $x = 1)',
        IsPrgStatus: 1,
        Type: "$x=1 order by IsPrgUpdatedDate desc"
    },
    defaultData: { Type: 1, IsPrgStatus: 1, CompId: app.cid },
    defaultFocusRef: '.seat-name',
    childId: 'seat-map',
    items: [
        { x: 'Id' },
        {
            xtype: 'textbox', name: 'Name', label: "Tên sơ đồ ghế", ref: 'input.seat-map-name', data: true,
            form: true, fIdx: 1, cls: 'seat-map-name', grid: true, gIdx: 1, gQuery: true, gWidth: '15%',
            required: true, requiredCls: 'bdred', rights: '',
        },
        {
            xtype: 'textbox', name: 'NumFloor', label: "Số tầng", ref: 'input.num-floor', data: true,
            form: true, fIdx: 2, cls: 'num-floor', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: false, gWidth: '15%', noSave: true,
            gDis: 'gDisNumFloor', rvc: 'rvcNumFloor', vtype: 'num'
        },

        {
            xtype: 'textbox', name: 'NumRow', label: "Số hàng", ref: 'input.num-row', data: true,
            form: true, fIdx: 3, cls: 'num-row', required: true, requiredCls: 'bdred', rights: '', gWidth: '15%',
            grid: true, gIdx: 1, gQuery: false, noSave: true,
            gDis: 'gDisNumRow', rvc: 'rvcNumRow'
        },
        {
            xtype: 'textbox', name: 'NumCol', label: "Số cột", ref: 'input.num-col', data: true,
            form: true, fIdx: 4, cls: 'num-col', required: true, requiredCls: 'bdred', rights: '', gWidth: '15%',
            grid: true, gIdx: 1, gQuery: false, noSave: true,
            gDis: 'gDisNumCol', rvc: 'rvcNumCol'
        },
        {
            xtype: 'combobox', name: 'SeatType', label: 'Loại ghế', ref: 'select.seat-type', data: true,
            form: true, fIdx: 5, cls: 'seat-type', rights: '', cbb: true, noSave: true,
            options: [{ Id: 1, Name: 'Ghế ngồi' }, { Id: 2, Name: 'Giường nằm' }, { Id: 3, Name: 'Ghế nằm' }],
            grid: true, gIdx: 1, gQuery: false,
            gDis: 'gDisSeatType', rvc: 'rvcSeatType'
        },
        {
            xtype: 'combobox', name: 'PhoiId', cbb: true, ref: '.phoiId', data: true,
            label: "Phoi", form: true, cls: 'phoiId', rights: '', options: [],
            grid: true, gQuery: true, xSearch: true,
            gDis: 'gDisPhoiId',
            listConfig: { ajax: { _a: 'fGetPhoiTemplate', _c: { CompId: app.cid, IsPrgStatus: 1}, _f: 'Id, Name' }, valField: 'Id', displayField: 'Name' }
        },
        {
            xtype: 'textbox', name: 'Info', label: "Info", ref: 'input.info', data: true,
            form: true, fIdx: 7, cls: 'info', grid: false, gIdx: 1, gQuery: true, flex: 1, disabled:true
        },
        {
            xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.seatnote', data: true,
            form: true, fIdx: 6, cls: 'seatnote', grid: true, gIdx: 1, gQuery: true, flex: 1
        },
        {
            xtype: 'textbox', inputType: 'hidden', name: 'Info', label: "Thông tin", ref: 'input.seat-info', data: true,
            form: true, fIdx: 100, cls: 'seat-info', grid: false, gIdx: 0, gQuery: true
        },
        {
            xtype: 'textbox', inputType: 'hidden', name: 'SummaryInfo', label: "", ref: 'input.summary-info', data: true,
            form: true, fIdx: 100, cls: 'summary-info', grid: false, gIdx: 0, gQuery: true, noSave: false
        },
        {
            xtype: 'textbox', inputType: 'hidden', name: 'ExtendedSummaryInfo', label: "", ref: 'input.extended-summary-info', data: true,
            form: true, fIdx: 100, cls: 'extended-summary-info', grid: false, gIdx: 0, gQuery: true, noSave: false
        },
        {
            xtype: 'textbox', inputType: 'hidden', name: 'CompId', label: "Thông tin", ref: 'input.compId', data: true,
            form: true, fIdx: 100, cls: 'compId', grid: true, gIdx: 110, gQuery: true, noSave: true, gDis: 'gDisCompId'
        }
    ],
    buttons: [
        {
            xtype: 'iconbutton', name: 'btnAdd', label: 'Tạo sơ đồ ghế', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new', iconCls: 'glyphicon-plus-sign',
            listeners: [{ xClick: 'onCreateSeatMap' }]
        },
        {
            xtype: 'iconbutton', name: 'btnSave', label: 'Thêm', ref: 'button.saveSeatTpl', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-success saveSeatTpl save', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onSaveSeat' }]
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled', iconCls: 'glyphicon-remove-sign',
            listeners: [{ xClick: 'onBasicDelete' }]
        }
    ]

});