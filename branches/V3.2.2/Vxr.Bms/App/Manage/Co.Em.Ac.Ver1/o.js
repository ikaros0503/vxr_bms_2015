define({
    title: 'Quản lý tài khoản', name: 'Tài khoản',
    tpl: 'accMng',
	grid: true, gTitle: 'Danh sách tài khoản', gId: 'accTableContainer', //gRights: 41,
	xWidth: '', cols: 4, winCls: 'taikhoan', useSmCls: true, autoClear: true,
	keyFields: ['Username'],
	queryAction: 'fGetAccount', updateAction: 'UpAccount', insertAction: 'InAccount',
	gridCondition: { Type: 1 },
	queryConditions: (app.cid == app.vid) ?
        {
            //IsPrgStatus: "$x=1 order by IsPrgUpdatedDate desc"
            IsPrgStatus: "$x=1"
        } :
        {
            CompId: "$x = " + app.cid + "  order by Type asc"
            //IsPrgStatus: "$x = 1 order by Type asc",
        },
	defaultData: { CompId: app.cid, Type: 1 },
	defaultFocusRef: 'input.user-name',
	items: [
	        {
		        xtype: 'tabbar', name: 'Tab', grid: false, gQuery: false, form: true, noSave: true,
		        items: [
		        {
			        xtype: 'tabnav', name: 'Account', label: 'Tài khoản', ref: 'tab-account', active: 'active',
			        grid: false, gQuery: false, form: true, notInRow: true /* Khong can dat tab in <div clsss="row"> */,
		        },
		        {
			        xtype: 'tabnav', name: 'Rights', label: 'Quyền', ref: 'tab-rights',
			        grid: false, gQuery: false, form: true, notInRow: true,
		        },
		        ]
	        },
	        {
	            xtype: 'tabcontent', grid: false, gQuery: false, form: true,
	            items: [
		        {
		            xtype: 'tabpane', id:'tab-account',name: 'Account', grid: false, gQuery: false, form: true, cls: 'tab-account', noSave: true, ref: 'tab.account',
		            active: 'active',
		            items: [
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
			                    listeners: [{ xChange: 'onAgentChange' }]
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
			                    xtype: 'inputHidden01', name: 'Info', label: "Quyền", ref: 'input.account-info', data: true,
			                    form: true, fIdx: 6, cls: 'account-info', rights: '', flex: 1,
			                    grid: false, gIdx: 3, gQuery: true, rvc: "rvcInfo", svc: "svcInfo", gDis: 'gDisInfo'
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
			                },
		                ]
		            },
                    {
                        xtype: 'tabpane', name: 'Rights', grid: false, gQuery: false, form: true, cls: 'tab-rights', noSave: true,
                        ref: 'tab.rights',
                        items: [
                            {
                                xtype: 'tabbar-vertical', form: true, grid: false,
                                items: [
                                    {
                                        xtype: 'tabnav-vertical', id: 'BKS', title: 'Đặt vé', form: true, grid: false, listener:'',
                                        items: [
                                            {
                                                xtype: 'rights-table', grid:false, form: true,
                                                items: [
                                                    {
                                                        xtype: 'rights-tbody', id:'BKS', form: true, 
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'tabnav-vertical', id: 'RPT', title: 'Báo cáo', form: true, grid: false,
                                        items: [
                                            {
                                                xtype: 'rights-table', grid: false, form: true,
                                                items: [
                                                    {
                                                        xtype: 'rights-tbody', id: 'RPT', form: true
                                                    }
                                                ]
                                            }
                                        ]
                                        
                                    },
                                    {
                                        xtype: 'tabnav-vertical', id: 'MGT', title: 'Quản lý', form: true, grid: false,
                                        items: [
                                            {
                                                xtype: 'rights-table', grid:false, form: true,
                                                items: [
                                                    {
                                                        xtype: 'rights-tbody', id:'MGT', form:true
                                                    }
                                                ]
                                            }
                                        ]
                                       
                                    },
                                    {
                                        xtype: 'tabnav-vertical', id:'null', title: 'Khác', form: true, grid: false,
                                        items: [
                                            {
                                                xtype: 'rights-table', grid: false, form: true,
                                                items: [
                                                    {
                                                        xtype: 'rights-tbody', id:'null', form: true
                                                    }
                                                ]
                                            }
                                        ]
                                        
                                    },
                                ]
                            },
                        ]
                    }
	            ],
	        },
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