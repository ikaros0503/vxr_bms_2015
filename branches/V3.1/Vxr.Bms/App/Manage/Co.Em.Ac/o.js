define({
    title: 'Quản lý tài khoản', name: 'Tài khoản',
    grid: true, gTitle: 'Danh sách tài khoản', gId: 'accTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'taikhoan', useSmCls: true, autoClear: true,
    keyFields: ['Username'],
    queryAction: 'fGetAccount', updateAction: 'UpAccount', insertAction: 'InAccount',
    gridCondition: {Type: 1},
    queryConditions: (app.cid == app.vid) ?
        {
            //IsPrgStatus: "$x=1 order by IsPrgUpdatedDate desc"
            IsPrgStatus: "$x=1"
        } :
        {
            CompId: app.cid,
            IsPrgStatus: "$x = 1 order by Type asc",
        },
    defaultData: { IsPrgStatus: 1, CompId: app.cid, Type: 1 },
    defaultFocusRef: 'input.user-name',
    items: [
        { x: 'Id' },
        {
            xtype: 'inputHidden01', name: 'Type', ref: 'input.type', data: true,
            form: true, cls: 'type', required: false, rights: '',
            grid: false, gQuery: true, noSave: true
        },
        {
            xtype: 'inputHidden01', name: 'Name', ref: 'input.name', data: true,
            form: true, cls: 'name', required: false, rights: '',
            grid: false, gQuery: true, noSave: true
        },
        {
            xtype: 'textbox', name: 'Username', label: "Tên tài khoản", ref: 'input.user-name', data: true,
            form: true, fIdx: 1, cls: 'user-name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Password', label: "Mật khẩu", ref: 'input.password', inputType: 'password', data: true,
            form: true, fIdx: 2, cls: 'password', required: true, requiredCls: 'bdred', rights: '',
            grid: false, gIdx: 2, gQuery: true
        },
        {
            xtype: 'combobox04', name: 'Role', label: 'Vai trò', ref: 'select.role', data: true,
            form: true, fIdx: 5, cls: 'role', rights: '', cbb: true, xSearch: true,
            grid: true, gIdx: 1, gQuery: true, eCls: 'dupInfo', eLabel: 'Duplicate Rights',
            options: [
                //{ Id: 1, Name: 'Quản trị viên' },
                //{ Id: 2, Name: 'Nhà xe' },
                //{ Id: 3, Name: 'Báo cáo viên' },
                //{ Id: 5, Name: 'Trưởng trạm' },
                //{ Id: 4, Name: 'Bán vé' }
            ],
            //gDis: 'gDisRole',
            listeners: [{ xChange: 'onRoleChange' }]
        },
        {
            xtype: 'combobox', name: 'AgentName', label: 'Tên chi nhánh', data: true,
            form: false, fIdx: 5, cls: 'role', rights: '', cbb: true,
            grid: false, gIdx: 1, gQuery: true, noSave: true, 
        },
        {
            xtype: 'combobox', name: 'PersonFullName', label: 'Tên nhân viên', data: true,
            form: false, fIdx: 5, cls: 'role', rights: '', cbb: true,
            grid: false, gIdx: 1, gQuery: true, noSave: true
        },
        {
            xtype: 'combobox', name: 'AgentId', cbb: true, ref: '.agent-id', data: true,
            label: "Chi nhánh", form: true, cls: 'agent-id', rights: '', options: [],
            grid: true, gQuery: true, fIdx: 3, gIdx: 5, xSearch: true, 
            gDis: 'gDisAgentId',
            listConfig: {
                ajax: { _a: 'fGetCompany', _c: { BaseId: app.cid, Type: 2, IsPrgStatus: 1 }, _f: 'Id, Name' },
                valField: 'Id',
                displayField: 'Name'
            },
            listeners: [{xChange: 'onAgentChange'}]
        },
        {
            xtype: 'combobox', name: 'PersonId', cbb: true, ref: '.person-id', data: true,
            label: "Nhân viên", form: true, cls: 'person-id', rights: '', options: [],
            grid: true, gQuery: true, fIdx: 4, gIdx: 6,
            gDis: 'gDisPersonId', xSearch: true,
            //listConfig: {
            //    ajax: { _a: 'fGetPerson', _c: { CompId: app.cid, Type: 1, IsPrgStatus: 1 }, getC: 'getCPersonId', _f: 'Id, FullName' },
            //    valField: 'Id', displayField: 'FullName'
            //}
        },
        {
            xtype: 'textbox', name: 'Info', label: "Quyền", ref: 'input.account-info', data: true,
            form: true, fIdx: 6, cls: 'account-info', rights: '', flex: 1,
            grid: true, gIdx: 3, gQuery: true, rvc: "rvcInfo", svc: "svcInfo", gDis: 'gDisInfo'
        },
        {
            xtype: 'combobox', name: 'TripId', cbb: true, ref: '.trip-id', data: true,
            label: "Tuyến mặc định", form: true, cls: 'trip-id', rights: '', options: [],
            grid: true, gQuery: false, fIdx: 7, gIdx: 6, noSave: true,
            gDis: 'gDisTripId',
            listConfig: {
                ajax: { _a: 'fGetTrip', _c: { CompId: app.cid, Type: 1, IsPrgStatus: 1 }, _f: 'Id, Name' },
                valField: 'Id', displayField: 'Name'
            },
            listeners: [{ xChange: 'onTripChange' }]
        },
        //{
        //    xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.customer-note', data: true,
        //    form: true, fIdx: 7, cls: 'customer-note', rights: '',
        //    grid: true, gIdx: 7, gQuery: true
        //},
        {
            xtype: 'combobox', name: 'RoleGroups', label: 'Nhóm quyền', ref: 'select.rolegroup', data: true,
            form: true, fIdx: 8, cls: 'rolegroup', rights: '', cbb: true,
            options: [{ Id: 4, Name: 'Bán vé' }, { Id: 1, Name: 'Admin' }, { Id: 2, Name: 'Nhà xe' }, { Id: 3, Name: 'Báo cáo viên' }, { Id: 5, Name: 'Trưởng trạm' }, { Id: 6, Name: 'Giao hàng' }],
            grid: true, gIdx: 7, gQuery: true,
            gDis: 'gRoleGroup',
        },
        {
            name: 'IsPrgPartComp', label: "IsPrgPartComp", data: true,
            grid: true, gQuery: true, gIdx: 5, gHide: true,
            form: false, auto: true, depends: ['AgentId', 'PersonId', 'Assistant'],
            svc: 'svcPC'
        }
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveAcc', label: 'Thêm', ref: 'button.saveAcc',
            form: true, cls: 'btn-success saveAcc save', iconCls: 'glyphicon-plus',
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
            messSucc: 'Xóa tài khoản thành công.',
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