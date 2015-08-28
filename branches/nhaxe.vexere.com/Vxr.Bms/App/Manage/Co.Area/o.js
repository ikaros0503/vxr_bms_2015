define({
    title: 'Quản lý địa điểm', name: 'Địa điểm',
    grid: true, gTitle: 'Danh sách địa điểm', gId: 'areaTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'wArea', useSmCls: true, autoClear: true,
    keyFields: ['Type, Code, Name'],
    gridSortBy: {Name: "Type", IsDesc: true},
    queryAction: 'fGetArea', updateAction: 'UpdateArea', insertAction: 'InsertArea',
    queryConditions: (app.cid == app.vid) ?
        {
            IsPrgStatus: 1,
        } :
        ((app.rights.indexOf($.rights.mArea_showAllArea.val) > 0) ?
            {
                IsPrgStatus: 1,
                Type: '($x = 15 or ($x=16 and CompId = ' + app.cid + ' ))'
            }:
            {
                IsPrgStatus: 1,
                Type: 16,
                CompId: app.cid
            }),
    defaultData: (app.rights.indexOf($.rights.mArea_showAllArea.val) > 0) ?
        { IsPrgStatus: 1, }:
        { Type: 16, IsPrgStatus: 1, CompId: app.cid },
    defaultFocusRef: '.name',
    
    items: [
        {
            xtype: 'inputHidden01', name: 'BaseId', ref: 'input.baseId', data: true,
            form: true, cls: 'baseId', rights: '', options: [], gIdx: 1, fIdx: 1,
            grid: false, gQuery: true, noSave: false
        },
        {
            xtype: 'textbox', name: 'CompId', field: 'CompId', ref: '.compId', data: true,
            label: "Nhà xe", form: true, cls: 'compId noCls', eCls: '', rights: '', options: [], gIdx: 0, fIdx: 1,
            grid: true, gQuery: true
        },
        {
            xtype: 'combobox', name: 'City', field: 'City', ref: '.city', data: true,
            label: "Thành phố", form: true, cls: 'city', rights: '', options: [], gIdx: 1, fIdx: 1,
            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true, cbb: true,
            listeners: [{xChange: 'onCityChange'}],
        },
        {
            xtype: 'combobox', name: 'Ward', ref: '.ward', data: true,
            label: "Quận/Huyện", cls: 'ward', rights: '', options: [], form: true, fIdx: 1,
            grid: false, gQuery: false, noSave: true, combobox: true, notInRow: true,
            listeners: [{ xChange: 'onWardChange'}],
        },
        {
            xtype: 'textbox', name: 'Name', label: "Tên", ref: 'input.name', data: true,
            form: true, fIdx: 1, cls: 'name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            name: 'Code', xtype: 'textbox', label: "Mã", grid: true, ref: 'input.code', gQuery: true,
            form: true, gIdx: 0, cls: 'code', data: true, fIdx: 1, gKey: true, gHide: false,
            gNoEdit: true, gNoList: false
        },
        {
            xtype: 'textbox', name: 'URLId', label: "URLId", ref: 'input.urlid', data: true,
            form: true, fIdx: 1, cls: 'urlid', required: false, rights: '',
            grid: true, gIdx: 100, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Type', label: "Loại", ref: 'input.type', data: true,
            form: true, fIdx: 1, cls: 'type', required: false, rights: '',
            grid: true, gIdx: 99, gQuery: true
        },
        //{
        //    xtype: 'combobox', name: 'Type', cbb: true, ref: '.type', value: 4, data: true,fId:4,
        //    label: "Loại", form: true, cls: 'agent-id', rights: '', options: [
        //        { Id: 3, Name: 'Tỉnh' },
        //        { Id: 4, Name: 'Thành' },
        //        { Id: 5, Name: 'Quận' },
        //        { Id: 6, Name: 'Huyện' },
        //        { Id: 7, Name: 'Đảo' },
        //        { Id: 8, Name: 'Phường' },
        //        { Id: 9, Name: 'Xã' },
        //        { Id: 10, Name: 'Thị trấn' },
        //        { Id: 11, Name: 'Tổ' },
        //        { Id: 12, Name: 'Ấp' },
        //        { Id: 13, Name: 'Thôn' },
        //        { Id: 14, Name: 'Số nhà' },
        //        { Id: 15, Name: 'Điểm dừng chung' },
        //        { Id: 16, Name: 'Điểm dừng riêng' },
        //        { Id: 1, Name: 'Châu lục' },
        //        { Id: 2, Name: 'Quốc gia' }
        //    ],
        //    grid: true, gQuery: true,
        //    gDis: 'gDisType'
        //},
        {
            xtype: 'textbox', name: 'Info', label: "Địa chỉ", ref: 'input.address', data: true,
            form: true, fIdx: 2, cls: 'address', rights: '',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.guide-note', data: true,
            form: true, fIdx: 2, cls: 'guide-note', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        //{
        //    xtype: 'textbox', name: 'BaseId', label: "BaseId", ref: 'input.baseid', data: true,
        //    form: true, fIdx: 1, cls: 'baseid', required: false, requiredCls: 'bdred', rights: '',
        //    grid: true, gIdx: 1, gQuery: true
        //}
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveArea', label: 'Thêm', ref: 'button.saveArea',
            form: true, cls: 'btn-success saveArea save', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onAreaSave' }]
        },
        {
            xtype: 'iconbutton', name: 'btnClear', label: 'Clear', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new', iconCls: 'glyphicon-refresh',
            listeners: [{ xClick: 'onAreaClear' }]
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled', iconCls: 'glyphicon-remove-sign',
            messSucc: 'Xóa địa điểm thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onAreaDelete' }]
            
        }
    ]
});
/*define({
    title: 'Quản lý địa điểm', name: 'Địa điểm',
    grid: true, gTitle: 'Danh sách địa điểm', gId: 'areaTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'wArea', useSmCls: true, autoClear: true,
    keyFields: ['Type, Code, Name'],
    queryAction: 'fGetArea', updateAction: 'UpdateArea', insertAction: 'InsertArea',
    queryConditions: (app.cid == app.vid) ?
        {
            IsPrgStatus: 1
        } :
        {
            IsPrgStatus: 1,
        },
    defaultData: { Type: 3, IsPrgStatus: 1, CompId: app.cid },
    defaultFocusRef: '.name',
    items: [
        {
            xtype: 'textbox', name: 'Id', data: true, dType: 1, label: "Mã",
            form: false, fIdx: 100,
            grid: true, gQuery: false, gHide: false, gIdx: 0
        },
        {
            xtype: 'textbox', name: 'Name', label: "Tên", ref: 'input.name', data: true,
            form: true, fIdx: 1, cls: 'name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'combobox', name: 'Type', cbb: true, ref: '.type', value: 4, data: true,
            label: "Loại", form: true, cls: 'agent-id', rights: '', options: [
                { Id: 3, Name: 'Tỉnh' },
                { Id: 4, Name: 'Thành' },
                { Id: 5, Name: 'Quận' },
                { Id: 6, Name: 'Huyện' },
                { Id: 7, Name: 'Đảo' },
                { Id: 8, Name: 'Phường' },
                { Id: 9, Name: 'Xã' },
                { Id: 10, Name: 'Thị trấn' },
                { Id: 11, Name: 'Tổ' },
                { Id: 12, Name: 'Ấp' },
                { Id: 13, Name: 'Thôn' },
                { Id: 14, Name: 'Số nhà' },
                { Id: 15, Name: 'Điểm dừng chung' },
                { Id: 16, Name: 'Điểm dừng riêng' },
                { Id: 1, Name: 'Châu lục' },
                { Id: 2, Name: 'Quốc gia' }
            ],
            grid: true, gQuery: true,
            //gDis: 'gDisType'

        },
        {
            xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.guide-note', data: true,
            form: true, fIdx: 1, cls: 'guide-note', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'BaseId', label: "BaseId", ref: 'input.baseid', data: true,
            form: true, fIdx: 1, cls: 'baseid', required: false, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: true,
            svc: 'svcBaseId'
        }
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveArea', label: 'Lưu', ref: 'button.saveArea',
            form: true, cls: 'btn-success saveArea', iconCls: 'glyphicon-save',
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
            messSucc: 'Xóa nhân viên thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onBasicDelete' }]
            
        }
    ]
});*/
