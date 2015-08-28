define({
    title: 'Khởi tạo nhà xe', name: 'Quản lý',
    grid: false, xWidth: '', cols: 4, winCls: 'quanly', useSmCls: true, autoClear: true,

    defaultData: { Type: 1, IsPrgStatus: 1, BaseId: app.cid },
    defaultFocusRef: '.comp-name',
    items: [
        {
            xtype: 'fromTitle099', title: 'Tạo công ty', fIdx: 1, flex: 4, 
            form: true, grid: false, gQuery: false, notInRow: true,
        },
        {
            xtype: 'textbox', name: 'Name', label: "Tên công ty", ref: 'input.comp-name', data: true,
            form: true, fIdx: 2, cls: 'comp-name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gQuery: false
        },
        {
            xtype: 'textbox', name: 'FullName', label: "Tên đầy đủ", ref: 'input.comp-full-name', data: true,
            form: true, fIdx: 3, cls: 'comp-full-name', rights: '',
            grid: true, gIdx: 1, gQuery: false
        },
        {
            xtype: 'textbox', name: 'PhoneInfo', label: "Điện thoại", ref: 'input.comp-phone-info', data: true,
            form: true, fIdx: 4, cls: 'comp-phone-info', rights: '', vtype: 'phone',
            grid: true, gIdx: 1, gQuery: false
        },
         {
             xtype: 'textbox', name: 'AddressInfo', label: "Địa chỉ", ref: 'input.comp-address-info', data: true,
             form: true, fIdx: 5, cls: 'comp-address-info', rights: '',
             grid: true, gIdx: 1, gQuery: false
         },
         {
             xtype: 'iconbutton', name: 'btnsaveCom', label: 'Thêm', ref: 'button.saveComp', gQuery: false, sty: 'margin-left: 15px;',
             form: true, cls: 'btn-success saveComp save', iconCls: 'glyphicon-plus', fIdx: 6, flex: 1, data: true,
             listeners: [{ xClick: 'onSaveComp' }]
             //xtype: 'button099', name1: 'saveComp', fIdx: 6, ref: '.saveComp', gQuery: false,
             //form: true, cls: 'saveComp', name2: 'refreshCom', data: true,
             //iconCls1: 'glyphicon-save', iconCls2: 'glyphicon-refresh', flex: 4,
             //listeners: [{ xClick: 'onSaveComp' }]
         },
          {
              xtype: 'iconbutton', name: 'btnClearCom', label: 'Clear', ref: 'button.refreshCom', gQuery: false,
              form: true, cls: 'btn-primary refreshCom', iconCls: 'glyphicon-refresh', fIdx: 6, flex: 1, data: true,
              listeners: [{ xClick: 'onCompClear' }]
          },
         {
             xtype: 'hr', cls: 'mt10 mb10', fIdx: 7, flex: 4, 
             form: true, grid: false, gIdx: 1, gQuery: false, notInRow: true,
         },
         {
             xtype: 'fromTitle099', title: 'Tạo chi nhánh- đại lý', fIdx: 8, flex: 4, sty: "margin-left: 15px ! important;",
             form: true, grid: false, gQuery: false, notInRow: true,
         },
        {
            xtype: 'textbox', name: 'Name', label: "Tên C.Nhánh - Đ.Lý", ref: 'input.CN-name', data: true,
            form: true, fIdx: 9, cls: 'CN-name', required: true, requiredCls: 'bdred', rights: '',
            grid: true, gIdx: 1, gQuery: false
        },
         {
             xtype: 'textbox', name: 'Code', label: "Mã code", ref: 'input.CN-code-info', data: true,
             form: true, fIdx: 10, cls: 'CN-code-info', rights: '',
             grid: true, gIdx: 1, gQuery: false
         },
         {
             xtype: 'textbox', name: 'PhoneInfo', label: "Điện thoại", ref: 'input.CN-phone-info', data: true,
             form: true, fIdx: 11, cls: 'CN-phone-info', rights: '', vtype: 'phone',
             grid: true, gIdx: 1, gQuery: false
         },
         {
             xtype: 'textbox', name: 'AddressInfo', label: "Địa chỉ", ref: 'CN-input.address-info', data: true,
             form: true, fIdx: 12, cls: 'CN-address-info', rights: '',
             grid: true, gIdx: 1, gQuery: false
         },
         {
             xtype: 'iconbutton', name: 'btnsaveCN', label: 'Thêm', ref: 'button.saveCN', gQuery: false, disabled: 'disabled="disabled"',
             form: true, cls: 'btn-success saveCN save', iconCls: 'glyphicon-plus', fIdx: 13, flex: 1, data: true, sty: 'margin-left: 15px;',
             listeners: [{ xClick: 'onSaveChiNhanh' }]

             //xtype: 'button099', name: 'btnsaveCN', fIdx: 13, ref: '.saveCN',
             //form: true, cls: 'saveCN', eCls2: 'refreshCN', data: true, gQuery: false,
             //iconCls1: 'glyphicon-save', iconCls2: 'glyphicon-refresh', flex: 4,
             //listeners: [{ xClick: 'onSaveChiNhanh' }]
         },
         {
             xtype: 'iconbutton', name: 'btnClearCN', label: 'Clear', ref: 'button.refreshCN', gQuery: false, disabled: 'disabled="disabled"',
             form: true, cls: 'btn-primary refreshCN', iconCls: 'glyphicon-refresh', fIdx: 13, flex: 1, data: true,
             listeners: [{ xClick: 'onCNClear' }]
         },
         {
             xtype: 'hr', cls: 'mt10 mb10', fIdx: 14, flex: 4, 
             form: true, grid: false, gIdx: 1, gQuery: false, notInRow: true,
         },
         {
             xtype: 'fromTitle099', title: 'Tạo nhân viên', fIdx: 15, flex: 4, sty: "margin-left: 15px ! important;",
             form: true, grid: false, gQuery: false, notInRow: true,
         },
         {
             xtype: 'textbox', name: 'FullName', label: "Họ và tên", ref: 'input.nv-full-name', data: true,
             form: true, fIdx: 16, cls: 'nv-full-name', required: true, requiredCls: 'bdred', rights: '',
             grid: true, gIdx: 1, gQuery: false
         },
         {
             xtype: 'textbox', name: 'PhoneInfo', label: "Điện thoại", ref: 'input.nv-phone-info', data: true,
             form: true, fIdx: 17, cls: 'nv-phone-info', rights: '', vtype: 'phone',
             grid: true, gIdx: 1, gQuery: false
         },
         {
             xtype: 'textbox', name: 'EmailInfo', label: "Email", ref: 'input.nv-email-info', data: true,
             form: true, fIdx: 18, cls: 'nv-email-info', rights: '',
             grid: true, gIdx: 1, gQuery: false
         },
         {
             xtype: 'combobox', name: 'AgentId', cbb: true, ref: '.agent-id', data: true, fIdx: 19,
             label: "Chi nhánh", form: true, cls: 'agent-id', rights: '', options: [],
             grid: true, gQuery: false
         },
          {
              xtype: 'iconbutton', name: 'btnsaveNV', label: 'Thêm', ref: 'button.saveNhanVien', gQuery: false, disabled: 'disabled="disabled"',
              form: true, cls: 'btn-success saveNhanVien save', iconCls: 'glyphicon-plus', fIdx: 20, flex: 2, data: true, sty: 'margin-left: 15px;',
              listeners: [{ xClick: 'onSaveNhanVien' }]
          },
         {
             xtype: 'iconbutton', name: 'btnClearNV', label: 'Clear', ref: 'button.refreshNV', gQuery: false, disabled: 'disabled="disabled"',
             form: true, cls: 'btn-primary refreshNV', iconCls: 'glyphicon-refresh', fIdx: 20, flex: 2, data: true,
             listeners: [{ xClick: 'onNVClear' }]
         },
         {
             xtype: 'hr', cls: 'mt10 mb10', fIdx: 21, flex: 4, 
             form: true, grid: false, gQuery: false, notInRow: true,
         },
         {
             xtype: 'fromTitle099', title: 'Tạo tài khoản', fIdx: 22, flex: 4, sty: "margin-left: 15px ! important;",
             form: true, grid: false, gQuery: false, notInRow: true,
         },
         {
             xtype: 'textbox', name: 'Username', label: "Tên tài khoản", ref: 'input.user-name', data: true,
             form: true, cls: 'user-name', requiredCls: 'bdred', required: true, rights: '',
             grid: true, gIdx: 1, gQuery: false, fIdx: 23
         },
        {
            xtype: 'textbox', name: 'Password', label: "Mật khẩu", ref: 'input.password', inputType: 'password', data: true,
            form: true, cls: 'password', requiredCls: 'bdred', required: true, rights: '',
            grid: false, gIdx: 1, gQuery: false, fIdx: 24
        },
        {
            xtype: 'combobox', name: 'AgentId1', cbb: true, ref: '.tk-agent-id', data: true, fIdx: 25,
            label: "Chi nhánh", form: true, cls: 'tk-agent-id', rights: '', options: [],
            grid: true, gQuery: false
        },
        {
            xtype: 'combobox', name: 'PersonId', cbb: true, ref: '.person-id', data: true,
            label: "Nhân viên", form: true, cls: 'person-id', rights: '', options: [],
            grid: false, gQuery: false, gIdx: 1, fIdx: 26
        },

        {
            xtype: 'iconbutton', name: 'btnsavetk', label: 'Thêm', ref: 'button.saveTK', gQuery: false, disabled: 'disabled="disabled"',
            form: true, cls: 'btn-success saveTK save', iconCls: 'glyphicon-plus', fIdx: 27, flex: 2, data: true, sty: 'margin-left: 15px;',
            listeners: [{ xClick: 'onSaveTaiKhoan' }]
        },
         {
             xtype: 'iconbutton', name: 'btnClearNV', label: 'Clear', ref: 'button.refreshTK', gQuery: false, disabled: 'disabled="disabled"',
             form: true, cls: 'btn-primary refreshTK', iconCls: 'glyphicon-refresh', fIdx: 27, flex: 2, data: true,
             listeners: [{ xClick: 'onTKClear' }]
         },

        {
            xtype: 'input_hidden_khoitao', cls: 'congty_id_hidden', data: true, label: 'Hidden',
            form: true, grid: false, gQuery: false, fIdx: 29, flex: 4,
        },
        {
            xtype: 'input_hidden_khoitao', cls: 'ChiNhanh_id_hidden', data: true, label: 'Hidden',
            form: true, grid: false, gQuery: false, fIdx: 30, flex: 4,
        },

    ]
});