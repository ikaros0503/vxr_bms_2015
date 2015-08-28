define({
    title: 'Quản lý công ty', name: 'Công ty',
    grid: true, gTitle: 'Danh sách công ty', gId: 'compTableContainer', gRights: 41,
    xWidth: '', cols: 4, winCls: 'congty', useSmCls: true, autoClear: true,
    keyFields: ['Name, FullName, PhoneInfo, EmailInfo'], finalKeyFields: [],
    queryAction: 'fGetCompany', updateAction: 'UpCompany', insertAction: 'InCompany',
    queryConditions: (app.cid == app.vid) ? { IsPrgStatus: 1, Type: "$x=1 order by IsPrgUpdatedDate desc" } : {
        Id: "( $x=" + app.cid + " OR BaseId=" + app.cid + " )", IsPrgStatus: 1,
        Type: "$x=1 order by IsPrgUpdatedDate desc"  //Type: 1, //Type: "($x=1 OR $x=2)",
    },
    defaultData: { Type: 1, IsPrgStatus: 1, BaseId: app.cid },
    defaultFocusRef: '.short-name',
    items: [
        { x: 'Id' },
        {
            xtype: 'textbox', name: 'Name', label: "Tên công ty", ref: 'input.short-name', data: true,
            form: true, fIdx: 1, cls: 'short-name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'FullName', label: "Tên đầy đủ", ref: 'input.full-name', data: true,
            form: true, fIdx: 1, cls: 'full-name', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'datepicker', name: 'Birthday', label: "Ngày thành lập", ref: '.birthday', data: true,
            form: true, fIdx: 1, cls: 'birthday', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'AddressInfo', label: "Địa chỉ", ref: 'input.address-info', data: true,
            form: true, fIdx: 1, cls: 'address-info', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'PhoneInfo', label: "Điện thoại", ref: 'input.phone-info', data: true,
            form: true, fIdx: 1, cls: 'phone-info', rights: '', vtype: 'phone',
            grid: true, gIdx: 1, gQuery: true,
        },
        {
            xtype: 'textbox', name: 'FaxInfo', label: "Số fax", ref: 'input.fax-info', data: true,
            form: true, fIdx: 1, cls: 'fax-info', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'EmailInfo', label: "Email", ref: 'input.email-info', data: true,
            form: true, fIdx: 1, cls: 'email-info', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'WebsiteInfo', label: "Website", ref: 'input.website', data: true,
            form: true, fIdx: 1, cls: 'website', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Note', label: "Ghi chú", ref: 'input.company-note', data: true,
            form: true, fIdx: 1, cls: 'company-note', rights: '', flex: 4,
            grid: true, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'UIConfigInfo', label: "Cấu hình giao diện", ref: 'input.uiConfigInfo', data: true,
            form: false, fIdx: 1, cls: 'uiConfigInfo', rights: '', flex: 3,
            grid: false, gIdx: 1, gQuery: true
        }
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnUpdateComp', label: 'Lưu', ref: 'button.updateComp',
            form: true, cls: 'btn-primary updateComp hidden2', iconCls: 'glyphicon-save',
            rights: $.rights.mComp_olUp.dtr,
            listeners: [{ xClick: 'onBasicUpdateOnly' }]
        },
        {
            xtype: 'iconbutton', name: 'btnsaveComp', label: 'Lưu', ref: 'button.saveComp',
            form: true, cls: 'btn-success saveComp hidden2', iconCls: 'glyphicon-save', rights: $.rights.mComp_edtDel.dtr,
            listeners: [{ xClick: 'onBasicSave' }]
        },
        {
            xtype: 'iconbutton', name: 'btnClear', label: 'Clear', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new hidden2', iconCls: 'glyphicon-refresh', rights: $.rights.mComp_edtDel.dtr, 
            listeners: [{ xClick: 'onBasicClear' }]
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled hidden2', iconCls: 'glyphicon-remove-sign', rights: $.rights.mComp_edtDel.dtr,
            listeners: [{ xClick: 'onBasicDelete' }]
        }
    ]
});