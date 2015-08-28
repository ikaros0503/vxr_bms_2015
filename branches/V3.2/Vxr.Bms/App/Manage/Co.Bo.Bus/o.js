define({
    title: 'Quản lý xe', name: 'Xe',
    grid: true, gTitle: 'Danh sách xe', gId: 'vehicleTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'xe', useSmCls: true, autoClear: true,
    keyFields: ['LicensePlate'],
    queryAction: 'fGetVehicle', updateAction: 'UpVehicle', insertAction: 'InVehicle',
    queryConditions: (app.cid == app.vid) ?
        {
            IsPrgStatus: "$x IN (1,2,4)", Type: "$x=1 order by IsPrgUpdatedDate desc"
        } :
        {
            CompId: app.cid,
            IsPrgStatus: "$x IN (1,2,4)",
            Type: "$x=1 order by IsPrgUpdatedDate desc"
        },
    defaultData: { Type: 1, CompId: app.cid },
    defaultFocusRef: '.vehicle-license',
    items: [
        { x: 'Id' },
        {
            xtype: 'textbox', name: 'LicensePlate', label: "Biển số", ref: 'input.vehicle-license', data: true,
            form: true, fIdx: 1, cls: 'vehicle-license', required: true, requiredCls: 'bdred', rights: '', vtype: 'licensePlate',
            grid: true, gIdx: 1, gQuery: true, xSearch: true, xSearchDefault: true, xSearchAlways: true
        },
        {
            xtype: 'textbox', name: 'TotalSeats', label: "Số chỗ", ref: 'input.total-seats', data: true,
            form: false, fIdx: 5, cls: 'total-seats', rights: '', auto: true, depends: ['SeatTemplateInfo'],
            grid: true, gIdx: 2, gQuery: true,
            svc: 'svcTotalSeats',
        },
        {
            xtype: 'textbox', name: 'ManufactureInfo', label: "Nhà sản xuất", ref: 'input.manufacture-info', data: true,
            form: true, fIdx: 2, cls: 'manufacture-info', rights: '',
            grid: true, gIdx: 5, gQuery: true, depends: ['ManufactureYear'], auto: true,
            gDis: 'gDisMFInfo', rvc: 'rvcMI', svc: 'svcMFI',
        },
        {
            xtype: 'datepicker', name: 'MaintainDate', label: "Hạn bảo trì", ref: '.maintain-date', data: true,
            form: true, fIdx: 7, cls: 'maintain-date', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: true, gIdx: 8, gQuery: true
        },
        {
            xtype: 'combobox', name: 'SeatTemplateInfo', cbb: true, ref: '.seat-template-info', data: true,
            label: "Sơ đồ ghế", form: true, cls: 'seat-template-info', rights: '', options: [], fIdx: 5,
            grid: true, gQuery: true, gHide: true,
            gDis: 'gDisStpl', svc: 'svcStpl', rvc: 'rvcStpl',
            listConfig: { ajax: { _a: 'fGetResource', _c: { CompId: app.cid, Type: 1, IsPrgStatus: 1 }, _f: 'Id, Name, Info' }, valField: 'Id', displayField: 'Name' }
        },
        {
            xtype: 'textbox', name: 'ModelInfo', label: "Hiệu xe", ref: 'input.vehicle-model', data: true,
            form: true, fIdx: 4, cls: 'vehicle-model', rights: '',
            grid: true, gIdx: 4, gQuery: true
        },
        {
            xtype: 'datepicker', name: 'LimitTime', label: "Hạn đăng kiểm", ref: '.limit-time', data: true,
            form: true, fIdx: 6, cls: 'limit-time', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: true, gIdx: 7, gQuery: true
        },
        {
            xtype: 'datepicker', name: 'ManufactureYear', label: "Năm sản xuất", ref: '.manufacture-year', noSave: true, data: true,
            form: true, fIdx: 3, cls: 'manufacture-year', rights: '', type: 'Date', displayFormat: 'dd-mm-yy', baseValSrcField: 'ManufactureInfo', rootField: 'ManufactureInfo',
            grid: true, gIdx: 6, gQuery: false, gDis: 'gDisMFY', rvc: 'rvcMY'
        },
        {
            xtype: 'textbox02', name: 'Note', label: "Ghi chú", ref: 'input.vehicle-note', data: true,
            form: true, fIdx: 9, cls: 'vehicle-note', rights: '', flex: 2,
            grid: true, gIdx: 10, gQuery: true
        },
        {
            xtype: 'textbox02', name: 'VehicleTypeName', label: "Loại xe", ref: 'input.vehicle-type-name', data: true,
            form: true, fIdx: 10, cls: 'vehicle-type-name', rights: '',
            grid: true, gIdx: 3, gQuery: true
        },
        {
            xtype: 'combobox', name: 'IsPrgStatus', label: 'Trạng thái', ref: 'select.vehicle-status', data: true,
            form: true, fIdx: 8, cls: 'vehicle-status', rights: '', cbb: true,
            options: [{ Id: 1, Name: 'Đang sử dụng' }, { Id: 2, Name: 'Đang bảo trì' }, { Id: 3, Name: 'Ngừng hoạt động' }, { Id: 4, Name: 'Đã bán' }],
            grid: true, gIdx: 9, gQuery: true,
            gDis: 'gDisStatus',
        }
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveGuide', label: 'Thêm', ref: 'button.saveVehicle',
            form: true, cls: 'btn-success saveVehicle save', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onBasicSave' }]
        },
        {
            xtype: 'iconbutton', name: 'btnClear', label: 'Clear', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new', iconCls: 'glyphicon-refresh',
            listeners: [{ xClick: 'onBasicClear' }]
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled', iconCls: 'glyphicon-remove-sign',
            messSucc: 'Xóa xe thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onBasicDelete' }]
        },
        {
            name: 'sbf', sbf: true, form: true, xtype: 'vchosen', chosen: { on: true, width: "100%" }, label: "",
            ref: '.search-options', xSearch: true, colspan: 10, clsBtn: 'search-options-btn',
            labelBtn: 'Lọc kết quả', cls: 'search-options', rights: '',
            listeners: [{ ref: '.search-options-btn', xClick: 'onClickSBF', args: { name: 'sbf' } }]
        }
    ]
});