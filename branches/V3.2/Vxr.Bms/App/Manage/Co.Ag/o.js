define({
    title: 'Quản lý chi nhánh - đại lý', name: 'Chi nhánh - đại lý',
    grid: true, gTitle: 'Danh sách chi nhánh - đại lý', gId: 'compTableContainer',
    xWidth: '', cols: 4, winCls: 'chinhanh-daily', useSmCls: true, autoClear: true,
    keyFields: ['Name, FullName, PhoneInfo, EmailInfo'],
    queryAction: 'fGetCompany', updateAction: 'UpCompany', insertAction: 'InCompany',
    queryConditions: (app.cid == app.vid) ? { IsPrgStatus: 1, Type: "($x=2) order by IsPrgUpdatedDate desc" } : {
        BaseId: app.cid,
        IsPrgStatus: "($x is null or $x != 3)",
        Type: "($x=2 ) order by IsPrgUpdatedDate desc"
    },
    defaultData: {
        BaseId: app.cid
    },
    defaultFocusRef: '',
    deselectAfterUpdate: true,
    items: [
        { x: 'Id' },
        {
            xtype: 'combobox', name: 'Type', label: 'Loại', ref: 'select.type', data: true,
            form: true, fIdx: 1, cls: 'type', rights: '', cbb: true,
            options: [{ Id: 2, Name: 'Chi nhánh' }, { Id: 3, Name: 'Đại lý' }],
            grid: true, gIdx: 1, gQuery: true, gDis: 'gDisType',
        },

        {
            xtype: 'textbox', name: 'Name', label: "Tên C.Nhánh - Đ.Lý", ref: 'input.short-name', data: true,
            form: true, fIdx: 2, cls: 'short-name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 2, gQuery: true
        },
        {
            xtype: 'textbox', name: 'FullName', label: "Tên đầy đủ", ref: 'input.full-name', data: true,
            form: true, fIdx: 3, cls: 'full-name', rights: '',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Code', label: "Mã code", ref: 'input.code-info', data: true,
            form: true, fIdx: 4, cls: 'code-info bdred', rights: '', required: true,
            grid: true, gIdx: 3, gQuery: true
        },
        {
            xtype: 'datepicker', name: 'Birthday', label: "Ngày thành lập", ref: '.birthday', data: true,
            form: true, fIdx: 5, cls: 'birthday', rights: '', type: 'Date', displayFormat: 'dd-mm-yy',
            grid: true, gIdx: 4, gQuery: true
        },
        {
            xtype: 'textbox', name: 'PhoneInfo', label: "Điện thoại", ref: 'input.phone-info', data: true,
            form: true, fIdx: 6, cls: 'phone-info', rights: '', vtype: 'phone',
            grid: true, gIdx: 5, gQuery: true
        },
        {
            xtype: 'textbox', name: 'AddressInfo', label: "Địa chỉ", ref: 'input.address-info', data: true,
            form: true, fIdx: 7, cls: 'address-info', rights: '',
            grid: true, gIdx: 6, gQuery: true
        },

        {
            xtype: 'textbox04', name: 'AvailableFund', label: "Ký quỹ", ref: 'input.available-fund', data: true,
            form: true, fIdx: 8, cls: 'available-fund', rights: '',
            grid: false, gIdx: 1, gQuery: true, rvc: 'rvcAvailableFund', vType: 'money', svc: 'svcAvailableFund',
        },
        {
            xtype: 'textbox02', name: 'Note', label: "Ghi chú", ref: 'input.company-note', data: true,
            form: false, fIdx: 8, cls: 'company-note', rights: '',
            grid: false, gIdx: 8, gQuery: true
        },
        {
            xtype: 'textbox', name: 'EmailInfo', label: "Email", ref: 'input.email-info', data: true,
            form: true, fIdx: 9, cls: 'email-info', rights: '',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'FaxInfo', label: "Số fax", ref: 'input.fax-info', data: true,
            form: true, fIdx: 10, cls: 'fax-info', rights: '',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'Info', label: "Ghế cấm đặt", ref: 'input.info', data: true,
            form: true, fIdx: 11, cls: 'info', rights: '', svc: "svcInfo",
            grid: true, gIdx: 9, gQuery: true
        },
        {
            xtype: 'inputHidden01', name: 'ContractInfo', ref: 'input.contractInfo', data: true,
            form: true, fIdx: 11, cls: 'contractInfo', rights: '', options: [],
            grid: false, gIdx: 1, gQuery: true, noSave: false
        },
        {
            xtype: 'inputHidden01', name: 'CancelFee', ref: 'input.cancelFee', data: true,
            form: true, fIdx: 12, cls: 'cancelFee', rights: '', options: [],
            grid: false, gIdx: 1, gQuery: true, noSave: false
        },
        {
            xtype: 'textbox', name: 'WebsiteInfo', label: "Website", ref: 'input.website', data: true,
            form: false, fIdx: 11, cls: 'website', rights: '',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'textbox', name: 'UIConfigInfo', label: "Cấu hình giao diện", ref: 'input.uiConfigInfo', data: true,
            form: false, fIdx: 13, cls: 'uiConfigInfo', rights: '', flex: 2,
            grid: false, gIdx: 1, gQuery: true
        },
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsaveComp', label: 'Thêm', ref: 'button.saveComp',
            form: true, cls: 'btn-success saveComp save', iconCls: 'glyphicon-plus',
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
            messSucc: 'Xóa chi nhánh - đại lý thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onBasicDelete' }]
        }
    ]
});

var htmlContractInfo =
    '<div class="row addition">' +
        '<div class="col-md-1 col-sm-1 ">' +
            '<div class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Chiết khấu">' +
                '<span style="position:absolute; margin-top:8px">Chiết khấu</span>' +
            '</div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-2 ">' +
            '<div class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Trip">' +
                '<select id="selContractInfo" class="form-control input-sm cor-black type" value="" />' +
            '</div>' +
        '</div>' +
        '<div class="col-md-3 col-sm-3 ">' +
            '<div style="width:35%; float:left" class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Loại">' +
                '<input name="rdoContractInfo" value="percentage" type="radio" style="margin-top: 8px;float:left; width:15%;" />' +
                '<div class="input-group" style="width:85%; float:right">' +
                        '<input id="txtContractInfoPercentage" type="text" class="form-control" placeholder="VNĐ/vé">' +
                        '<div class="input-group-addon">%</div>' +
                '</div>' +
            '</div>' +
            '<div style="width:65%; float:left" class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Loại">' +
                '<input name="rdoContractInfo" value="money" type="radio" style="float:left;margin-top: 8px;width:15%;" />' +
                '<div class="input-group" style="width:85%; float:right">' +
                    '<input id="txtContractInfoMoney" type="text" class="form-control money" placeholder="VNĐ/vé">' +
                    '<div class="input-group-addon">đ</div>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="col-md-1 col-sm-1 ">' +
            '<div class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Phí hủy">' +
                '<span style="position:absolute; margin-top:8px">Phí hủy</span>' +
            '</div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-2 ">' +
            '<div class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Trip">' +
                '<select id="selCancelFee" class="form-control input-sm cor-black type" value="" />' +
            '</div>' +
        '</div>' +
        '<div class="col-md-3 col-sm-3">' +
            '<div style="width:35%; float:left" class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Loại">' +
                '<input name="rdoCancelFee" value="percentage" type="radio" style="margin-top: 8px;float:left; width:15%;" />' +
                '<div class="input-group" style="width:85%; float:right">' +
                        '<input id="txtCancelFeePercentage" type="text" class="form-control" placeholder="VNĐ/vé">' +
                        '<div class="input-group-addon">%</div>' +
                '</div>' +
            '</div>' +
            '<div style="width:65%; float:left" class="form-group mb8 " title="" data-placement="top" data-toggle="tooltip" data-original-title="Loại">' +
                '<input name="rdoCancelFee" value="money" type="radio" style="float:left;margin-top: 8px;width:15%;" />' +
                '<div class="input-group" style="width:85%; float:right">' +
                    '<input id="txtCancelFeeMoney" type="text" class="form-control money" placeholder="VNĐ/vé">' +
                    '<div class="input-group-addon">đ</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>'
;


