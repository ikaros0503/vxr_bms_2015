define({
    title: 'Quản lý Phoi', name: 'phoi',
    grid: true, gTitle: 'Quan ly phoi', gId: 'phoiTableContainer',
    xWidth: '', cols: 3, winCls: 'phoi', useSmCls: true, autoClear: true,
    queryAction: 'fGetPhoiTemplate', updateAction: 'UpdatePhoiTemplate', insertAction: 'InsertPhoiTemplate',
    queryConditions: {
        CompId: app.cid,
        IsPrgStatus: 1
    },
    defaultData: {
        CompId: app.cid,
        IsPrgStatus: 1
    },
    deselectAfterUpdate: true,
    items: [
        { x: 'Id' },
        {
            xtype: 'textbox', name: 'Name', label: "Name", ref: 'input.name', data: true,
            form: true, fIdx: 1, cls: 'name', rights: '',
            grid: true, gIdx: 1, gQuery: true
        },

        {
            xtype: 'combobox', name: 'Orientation', label: 'Orientation', ref: 'select.orientation', data: true,
            form: true, fIdx: 2, cls: 'orientation', rights: '', cbb: true,
            options: [{ Id: 0, Name: 'Portrait' }, { Id: 1, Name: 'Landscape' }],
            grid: true, gIdx: 2, gQuery: true, gDis: 'gDisOrientation',svc:'svcOrientation'
        },
        {
            xtype: 'combobox', name: 'NumberOfPage', label: 'NumberOfPage', ref: 'select.numberOfPage', data: true,
            form: true, fIdx: 3, cls: 'numberOfPage', rights: '', cbb: true,
            options: [{ Id: 1, Name: '1' }, { Id: 2, Name: '2' }],
            grid: true, gIdx: 3, gQuery: true,
        },
        {
            xtype: 'textbox', name: 'Description', label: "Description", ref: 'input.description', data: true,
            form: true, fIdx: 5, cls: 'description', rights: '',
            grid: true, gIdx: 5, gQuery: true
        },
        {
            xtype: 'textarea', name: 'Html', label: "Html", ref: 'textarea.html', data: true,
            form: true, fIdx: 6, cls: 'html', rights: '',
            grid: false, gIdx: 6, gQuery: true
        },
        {
            xtype: 'inputHidden01', name: 'CompId', label: "CompId", ref: 'input.compId', data: true,
            form: false, fIdx: 4, cls: 'compId', rights: '',
            grid: false, gIdx: 3, gQuery: true
        },
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsavePhoi', label: 'Thêm', ref: 'button.savePhoi',
            form: true, cls: 'btn-success savePhoi save', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onPhoiSave' }]
        },
        {
            xtype: 'iconbutton', name: 'btnClear', label: 'Clear', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new', iconCls: 'glyphicon-refresh',
            listeners: [{ xClick: 'onBasicClear' }]
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled', iconCls: 'glyphicon-remove-sign',
            messSucc: 'Xoa phoi thanh cong',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onPhoiDelete' }]
        }
    ]
});

