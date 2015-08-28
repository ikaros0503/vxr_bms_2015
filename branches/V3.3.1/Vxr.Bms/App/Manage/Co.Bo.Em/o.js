define({
    name: 'Nhân viên', title: 'Quản lý nhân viên',
    grid: true, gTitle: 'Danh sách nhân viên', gId: 'employeeTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'nhanvien', useSmCls: true, autoClear: true,
    keyFields: ['Name, FullName, PhoneInfo, EmailInfo'],
    queryAction: 'fGetPerson', updateAction: 'UpPerson', insertAction: 'InPerson',
    queryConditions: (app.cid == app.vid) ?
        {
            IsPrgStatus: 1, Type: "$x=1 order by IsPrgUpdatedDate desc"
        } :
        {
            CompId: app.cid,
            IsPrgStatus: 1,
            Type: "$x=1 order by IsPrgUpdatedDate desc"
        },
    defaultData: { Type: 1, IsPrgStatus: 1, CompId: app.cid },
    //defaultFocusRef: '.full-name',
    items: [
        { x: 'Id' },
        {
            xtype: 'textbox', name: 'FullName', label: "Họ và tên", ref: 'input.full-name', data: true,
            form: true, fIdx: 1, cls: 'full-name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'PhoneInfo', label: "Điện thoại", ref: 'input.phone-info', data: true,
            form: true, fIdx: 1, cls: 'phone-info', rights: '', vtype: 'phone',
            grid: true, gIdx: 1, gQuery: true, xSearch: true
        },
        {
            xtype: 'textbox', name: 'EmailInfo', label: "Email", ref: 'input.email-info', data: true,
            form: true, fIdx: 1, cls: 'email-info', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'combobox', name: 'AgentId', cbb: true, ref: '.agent-id', data: true,
            label: "Chi nhánh", form: true, cls: 'agent-id', rights: '', options: [],
            grid: true, gQuery: true, xSearch: true,
            gDis: 'gDisAgentId',
            listConfig: { ajax: { _a: 'fGetCompany', _c: { BaseId: app.cid, IsPrgStatus: 1, Type: 2 }, _f: 'Id, Name' }, valField: 'Id', displayField: 'Name' }
        },
        {
            xtype: 'combobox', name: 'Gender', label: 'Giới Tính', ref: 'select.gender', data: true,
            form: true, fIdx: 1, cls: 'gender', rights: '', cbb: true,
            options: [{ Id: 1, Name: 'Nam' }, { Id: 2, Name: 'Nữ' }, { Id: 3, Name: 'Khác' }],
            grid: true, gIdx: 1, gQuery: true,
            gDis: 'gDisGender',
        },
        {
            xtype: 'datepicker', name: 'Birthday', label: "Ngày sinh", ref: '.birthday', data: true,
            form: true, fIdx: 1, cls: 'birthday', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'AddressInfo', label: "Địa chỉ", ref: 'input.address-info', data: true,
            form: true, fIdx: 1, cls: 'address-info', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.guide-note', data: true,
            form: true, fIdx: 1, cls: 'guide-note', rights: '',
            grid: true, gIdx: 1, gQuery: true
        }
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveGuide', label: 'Thêm', ref: 'button.saveGuide',
            form: true, cls: 'btn-success saveGuide save', iconCls: 'glyphicon-plus',
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
            
        },
        {
            name: 'sbf', sbf: true, form: true, xtype: 'vchosen', chosen: { on: true, width: "100%" }, label: "",
            ref: '.search-options', xSearch: true, colspan: 10, clsBtn: 'search-options-btn',
            labelBtn: 'Lọc kết quả', cls: 'search-options', rights: '',
            listeners: [{ ref: '.search-options-btn', xClick: 'onClickSBF', args: { name: 'sbf' } }]
        }
    ]
});