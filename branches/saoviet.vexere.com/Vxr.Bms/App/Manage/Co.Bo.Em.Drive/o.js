define({
    name: 'Tài xế', title: 'Quản lý tài xế',
    grid: true, gTitle: 'Danh sách tài xế', gId: 'driverTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'taixe', useSmCls: true, autoClear: true,
    keyFields: ['Name, FullName, PhoneInfo, EmailInfo'],
    queryAction: 'fGetPerson', updateAction: 'UpPerson', insertAction: 'InPerson',
    queryConditions: (app.cid == app.vid) ?
        {
            IsPrgStatus: 1, Type: "$x=2 order by IsPrgUpdatedDate desc"
        } :
        {
            CompId: app.cid,
            IsPrgStatus: 1,
            Type: "$x=2 order by IsPrgUpdatedDate desc"
        },
    defaultData: { Type: 2, IsPrgStatus: 1, CompId: app.cid },
    defaultFocusRef: '.full-name',
    items: [
        {
            x: 'Id',
        },
        {
            xtype: 'textbox', name: 'FullName', label: "Họ và tên", ref: 'input.full-name', data: true,
            form: true, fIdx: 1, cls: 'full-name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'PhoneInfo', label: "Điện thoại", ref: 'input.phone-info', data: true,
            form: true, fIdx: 2, cls: 'phone-info', rights: '', vtype: 'phone',
            grid: true, gIdx: 1, gQuery: true, xSearch: true, xSearchDefault: true
        },
        {
            xtype: 'textbox', name: 'EmailInfo', label: "Email", ref: 'input.email-info', data: true,
            form: true, fIdx: 3, cls: 'email-info', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox02', name: 'AddressInfo', label: "Địa chỉ", ref: 'input.address-info', data: true,
            form: true, fIdx: 7, cls: 'address-info', rights: '', flex: 2,
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'combobox', name: 'Gender', label: 'Giới tính', ref: 'select.gender', data: true,
            form: true, fIdx: 5, cls: 'gender', rights: '', cbb: true, gWidth: '5%',
            options: [{ Id: 1, Name: 'Nam' }, { Id: 2, Name: 'Nữ' }, { Id: 3, Name: 'Khác' }],
            grid: true, gIdx: 1, gQuery: true,
            gDis: 'gDisGender',
        },
        {
            xtype: 'datepicker', name: 'Birthday', label: "Ngày sinh", ref: '.birthday', data: true,
            form: true, fIdx: 6, cls: 'birthday', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: true, gIdx: 1, gQuery: true, gWidth: '5%',
        },
        {
            xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.guide-note', data: true,
            form: true, fIdx: 4, cls: 'guide-note', rights: '',
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
            messSucc: 'Xóa tài xế thành công.',
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