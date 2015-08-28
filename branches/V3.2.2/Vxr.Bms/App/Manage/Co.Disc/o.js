define({
    title: 'Quản lý Chiết khấu', name: 'Chiết khấu', grid: false,
    xWidth: '', cols: 3, winCls: 'chietkhau', useSmCls: true, autoClear: true, insertAction: 'InsertDiscount',
    defaultData: { Type: 1, IsPrgStatus: 1, BaseId: app.cid },
    defaultFocusRef: '.company-id',
    childId: 'discount-trip',
    items: [
        { x: 'Id' },
        {
            xtype: 'combobox', name: 'comid', cbb: true, ref: '.company-id', data: true,
            label: "Công ty", form: true, cls: 'company-id', rights: '', options: [],
            grid: true, gQuery: true, fIdx: 1, gIdx: 1,
            gDis: 'gComId',
            listConfig: {
                ajax: {
                    _a: 'fGetCompany',
                    _c: {
                        IsPrgStatus: 1, Type: 1,
                        HasOnlineContract: ' ($x=1 OR  HasOfflineContract=1)'
                    },
                    _f: 'Id, Name'
                },
                valField: 'Id', displayField: 'Name'
            }, listeners: [{ xChange: '_loadDiscount' }]
        },
        {
            xtype: 'datepicker', name: 'fromdate', label: "Từ ngày", ref: '.fromdate', data: true,
            form: true, fIdx: 2, cls: 'fromdate', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'datepicker', name: 'todate', label: "Đến ngày", ref: '.todate', data: true,
            form: true, fIdx: 3, cls: 'todate', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'radio-text-box', name: 'discount', label: "Chiết khấu theo %", ref: 'input.discount_ra1', data: true,
            form: true, fIdx: 4, cls1: 'discount_ra1', cls2: 'txt_chietkhau1', rights: '', type: '%', value: '1',
            grid: true, gIdx: 1, gQuery: true, listeners: [{ xChange: 'onRadioSelectionChange' }]
        },
{
    xtype: 'radio-text-box', name: 'discount', ref: 'input.discount_ra2', data: true,
    form: true, fIdx: 5, cls1: 'discount_ra2', cls2: 'txt_chietkhau2', rights: '', label: "Chiết khấu theo số tiền", value: '2',
    grid: false, gIdx: 1, gQuery: true, type: 'VND', listeners: [{ xChange: 'onRadioSelectionChange' }]
},
{
    xtype: 'radio-span', name: 'discount', label: "Tùy chỉnh theo chuyến", ref: 'input.check3-info', data: true,
    form: true, fIdx: 6, cls: 'check3-info', rights: '', value: '3',
    grid: false, gIdx: 1, gQuery: true, listeners: [{ xChange: 'onRadioSelectionChange' }]
},
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnUpdateComp', label: 'Lưu', ref: 'button.updateComp',
            form: true, cls: 'btn-success updateComp hidden2', iconCls: 'glyphicon-save',
            rights: $.rights.mComp_olUp.dtr,
            listeners: [{ xClick: 'onSaveDisTrip' }]
        },       
        {
            xtype: 'iconbutton', name: 'btnClear', label: 'Clear', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new hidden2', iconCls: 'glyphicon-refresh', rights: $.rights.mComp_edtDel.dtr,
            listeners: [{ xClick: 'onClear' }]
        },        
    ]
});