define({
    title: 'Quản lý khách hàng', name: 'Khách hàng',
    grid: true, gTitle: 'Danh sách khách hàng', gId: 'customerTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'khachhang', useSmCls: true, autoClear: true,
    gridSortBy: { Name: "BookingTicket", IsDesc: true },
    keyFields: ['Name, FullName, PhoneInfo, EmailInfo'],
    queryAction: 'fGetCustomer1', updateAction: 'UpdateCustomer', insertAction: 'InsertCustomer',
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
    defaultFocusRef: '.name',
    items: [
        { x: 'Id' },
        {
            xtype: 'textbox', name: 'Name', label: "Họ và tên", ref: 'input.name', data: true,
            form: true, fIdx: 1, cls: 'name', rights: '', grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Phone', label: "Số điện thoại", ref: 'input.phone-info', data: true,
            form: true, fIdx: 1, cls: 'phone-info', rights: '', vtype: 'phone', required: true, requiredCls: 'bdred',
            grid: true, gIdx: 2, gQuery: true
        },
        {
            xtype: 'textbox', name: 'EmailInfo', label: "Email", ref: 'input.email-info', data: true,
            form: true, fIdx: 1, cls: 'email-info', rights: '',
            grid: true, gIdx: 5, gQuery: true
        },
        {
            xtype: 'textbox', name: 'AddressInfo', label: "Địa chỉ", ref: 'input.address-info', data: true,
            form: true, fIdx: 1, cls: 'address-info', rights: '',
            grid: true, gIdx: 6, gQuery: true
        },
        {
            xtype: 'combobox', name: 'Gender', label: 'Giới Tính', ref: 'select.gender', data: true,
            form: true, fIdx: 1, cls: 'gender', rights: '', cbb: true, gWidth: '7%',
            options: [{ Id: 1, Name: 'Nam' }, { Id: 2, Name: 'Nữ' }, { Id: 3, Name: 'Khác' }],
            grid: true, gIdx: 4, gQuery: true,
            gDis: 'gDisGender',
        },
        {
            xtype: 'datepicker', name: 'Birthday', label: "Ngày sinh", ref: '.birthday', data: true,
            form: true, fIdx: 1, cls: 'birthday', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: true, gIdx: 3, gQuery: true, gWidth: '8%'
        },
        {
            xtype: 'textbox02', name: 'Note', label: "Ghi chú", ref: 'input.customer-note', data: true,
            form: true, fIdx: 1, cls: 'customer-note', rights: '', flex: 2,
            grid: true, gIdx: 7, gQuery: true
        },
        {
            xtype: 'textbox', name: 'BookingTicket', label: "Đặt chỗ", ref: 'input.booking-ticket', data: true,
            form: false, fIdx: 1, cls: 'booking-ticket', rights: '', gWidth: '7%',
            grid: true, gIdx: 9, gQuery: true
        },
        {
            xtype: 'textbox', name: 'PaidTicket', label: "", ref: 'input.paid-ticket', data: true,
            form: false, fIdx: 1, cls: 'paid-ticket', rights: '',
            grid: false, gIdx: 10, gQuery: true
        },
        {
            xtype: 'textbox', name: 'PassTicket', label: "", ref: 'input.pass-ticket', data: true,
            form: false, fIdx: 1, cls: 'pass-ticket', rights: '',
            grid: false, gIdx: 10, gQuery: true
        },
        {
            xtype: 'textbox', name: 'BookedTicket', label: "Đã đi", ref: 'input.booked', data: true,
            form: false, fIdx: 1, cls: 'booked', rights: '', gWidth: '7%',
            grid: true, gIdx: 10, gQuery: true,
            //gDis: 'gDisBooked',
        },
        {
            xtype: 'textbox', name: 'CancelTicket', label: "Đã hủy", ref: 'input.cancel-ticket', data: true,
            form: false, fIdx: 1, cls: 'cancel-ticket', rights: '', gWidth: '7%',
            grid: true, gIdx: 11, gQuery: true
        },
        {
            xtype: 'textbox', name: 'TotalPaid', label: "", ref: 'input.total-paid', data: true,
            form: false, fIdx: 1, cls: 'total-paid', rights: '',
            grid: false, gIdx: 11, gQuery: true
        },
        {
            xtype: 'textbox', name: 'TotalPass', label: "", ref: 'input.total-pass', data: true,
            form: false, fIdx: 1, cls: 'total-pass', rights: '',
            grid: false, gIdx: 11, gQuery: true
        },
        {
            xtype: 'textbox', name: 'MoneySum', label: "Tổng tiền", ref: 'input.total', data: true,
            form: false, fIdx: 1, cls: 'total', rights: '',
            grid: true, gIdx: 12, gQuery: true,
            gDis: 'gDisTotal'
        }
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveCustomer', label: 'Thêm', ref: 'button.saveCustomer',
            form: true, cls: 'btn-success saveCustomer save', iconCls: 'glyphicon-plus',
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
            messSucc: 'Xóa khách hàng thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onBasicDelete' }]
        }
    ]
});