define({
    title: 'Cấu hình bán vé', name: 'Cấu hình bán vé',
    grid: true, gTitle: 'Danh sách phân quyền', gId: 'rightsTableContainer', //gRights: 41,
    xWidth: '', cols: 4, winCls: 'ticketConf', useSmCls: true, autoClear: true,
    keyFields: ['Id'], autoApplyGrid: false, 
    queryAction: 'fGetBus_Tickets_Status', updateAction: 'UpdateBus_Tickets_Status', insertAction: 'InsertBus_Tickets_Status',
    removeAction: 'RemoveBus_Tickets_Status',
    queryConditions:
        {
            XCompanyId: app.cid,
            XStatus: '($x in (1,2,3))',
            IsPrgStatus: '($x is null or $x != 3) order by XDate asc'
        },
    defaultData: {
        XStatus: 1
        //XCompanyId: app.cid,
        //XAgentId: 1
    },
    items: [
        
        {
            xtype: 'combobox00', name: 'XCompanyId', field: 'XCompanyId', ref: '.xCompId', data: true,
            label: "Nhà xe", form: true, cls: 'xCompId noCls', eCls: '', rights: $.rights.mTicConf_comp.dtr, options: [], gIdx: 1, fIdx: 1,
            grid: false, gQuery: false, combobox: true, cbb: true, noSave: false, formToGridOnly: true,
            listeners: [{xChange:'onCompChange'}]
        },
        {
            xtype: 'combobox', name: 'XAgentId', field: 'XAgentId', ref: '.xAgentId', data: true,
            label: "Đại lý", form: true, cls: 'xAgentId hidden', eCls: '', rights: '', options: [], gIdx: 1, fIdx: 2,
            grid: false, gQuery: true, combobox: true, cbb: true, noSave: true, 
        },
        {
            xtype: 'nothing', name: '', ref: '', data: true,
            form: true, cls: '', required: false, rights: '',fIdx: 3,
            grid: false, gIdx: 1, gQuery: false
        },
        {
            xtype: 'nothing', name: '', ref: '', data: true,
            form: true, cls: '', required: false, rights: '', fIdx: 3,
            grid: false, gIdx: 1, gQuery: false
        },
        {
            xtype: 'combobox02', name: 'XTypeId', field: 'XTypeId', ref: '.xType', data: true,
            label: "Cấu hình", form: true, cls: 'xType', eCls: 'status', rights: '', options: [], gIdx: 1, fIdx: 4,
            grid: true, gQuery: true, combobox: true, cbb: true, gDis: 'gDisType'
        },
        {
            xtype: 'combobox', name: 'XTripName', field: 'XTripName', ref: '.xTrip', data: true,
            label: "Chuyến", form: true, cls: 'xTrip', rights: '', options: [], gIdx: 2, fIdx: 5,
            grid: true, gQuery: true, noSave: true, combobox: true, cbb: true,
            listeners:[{xChange: 'onTripChange'}]
        },
        //{
        //    xtype: 'textbox', name: 'XRouteId', label: "Chặng", ref: 'input.routeId', data: true,
        //    form: true, fIdx: 1, cls: 'routeId', required: false, rights: '',
        //    grid: true, gIdx: 1, gQuery: true
        //},
        //{
        //    xtype: 'textbox06', name: 'XTime', label: "Giờ", ref: 'input.xTime', data: true,
        //    form: true, fIdx: 6, cls: 'xTime', eCls: 'eTime', required: false, rights: '', options: [], displayFormat: 'hh:mm',
        //    grid: true, gIdx: 2, gQuery: true, gDis: 'gDisTime',
        //    rvc: 'rvcXTime'
        //},
        {
            xtype: 'echosen00', noSave: true, data: true, xSearch: true,
            name: "LstTime", fIdx: 6, 
            gHide: false, grid: false, ref: 'select.xLstTime',
            chosen: { on: true, width: "100%" },
            multi: true, label: "Giờ", 
            form: true, partInfo: true, gQuery: false,
            cls: 'xLstTime', rights: '', options: [], eCls: 'eLstTime'
        },
        {
            name: 'XDate', type: 'Date', xSearch: true, xSearchDefault: true, domain: true, xSearchAlways: true, data: true,
            grid: true, gQuery: true, gIdx: 3, fIdx: 8, ref: '.xDate', gWidth: '5%', alwaysEnable: true, required: false,
            xtype: 'datepickerTpl03', label: "Ngày bắt đầu", form: true, cls: 'xDate', rights: '', value: vGetNow(),
            gType: 'date', displayFormat: 'dd-mm-yy',
            gDis: 'gDisDate', listener: [{xChange:'onDateChange'}]
        },
        {
            name: 'XDateStop', type: 'Date', data: true, xSearch: true, xSearchDefault: true, domain: true, xSearchAlways: true,
            grid: true, gQuery: false, fIdx: 9, ref: '.xDateStop', gWidth: '5%', gIdx: 7,
            xtype: 'datepickerTpl03', label: "Ngày kết thúc", form: true, cls: 'xDateStop', rights: '', value: '',
            noSave: true, 
        },
        //{
        //    xtype: 'echosen', noSave: true, data: true, xSearch: true,
        //    name: "Seats", //rootField: 'TeamInfo',
        //    fIdx: 10, //mType: x.type, //enum type
        //    gHide: false, grid: false, ref: 'select.seats',
        //    flex: 2, 
        //    chosen: { on: true, width: "100%" },
        //    multi: true, label: "Danh sách ghế", 
        //    form: true, partInfo: true, gQuery: false,
        //    cls: 'seats hidden', rights: '', options: [],
            
        //    //gDis: x.gDis, rvc: x.rvc, svb: x.svb, svc: x.svc,
        //},
        {
            xtype: 'combobox', name: 'XFromId', field: 'XFromId', ref: '.xFromId', data: true,
            label: "Điểm đi", form: false, cls: 'xFromId', rights: '', options: [], gIdx: 5, fIdx: 11,
            grid: false, gQuery: true, combobox: true, cbb: true, gDis: 'gDisFromId',
            listeners: [{ xChange: 'onFromIdChange' }]
        },
        {
            xtype: 'combobox', name: 'XToId', field: 'XToId', ref: '.xToId', data: true,
            label: "Điểm đến", form: false, cls: 'xToId', rights: '', options: [], gIdx: 6, fIdx: 12,
            grid: false, gQuery: true,  combobox: true, cbb: true, gDis: 'gDisToId'
        },
        {
            xtype: 'textbox12', name: 'XAreaPairs', ref: 'input.xAreaPairs', data: true,
            label: "Điểm đi - Điểm đến", form: false, cls: 'xAreaPairs', rights: '', options: [], gIdx: 1, fIdx: 13,
            grid: false, gQuery: false,  eCls: 'pushAreaPair', flex: 2, disabled: 'disabled', alwaysDisable: true, noSave: true
        },
        {
            xtype: 'textbox', name: 'TimeLimit', label: "Thời gian giới hạn (phút)", ref: 'input.timeLimit', data: true,
            form: true, fIdx: 7, cls: 'timeLimit', required: false, rights: '',
            grid: false, gIdx: 3, gQuery: true, vType: 'num', value: 0
        },
        {
            xtype: 'table00', name: 'TableRoute', label: "", ref: '.tblRoute', data: false,
            form: true, fIdx: 10, cls: 'tblRoute table', required: false, rights: '',
            grid: false, gIdx: 3, gQuery: false, flex: 4, elabel: 'Chọn hết tất cả tuyến đường',
            ecls: 'sltAllRoute hidden', btnLbl: 'Chọn hết', iconCls: ''
        },
        {
            xtype: 'inputHidden03', name: 'XTripId', ref: 'input.xTripId', data: true,
            form: true, cls: 'xTripId', required: false, rights: '',
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'inputHidden03', name: 'XFromName', ref: 'input.xfromname', data: true,
            form: true, cls: 'xfromname', required: false, rights: '',
            grid: false, gIdx: 1, gQuery: true, noSave: true
        },
        {
            xtype: 'inputHidden03', name: 'XToName', ref: 'input.xtoname', data: true,
            form: true, cls: 'xtoname', required: false, rights: '',
            grid: false, gIdx: 1, gQuery: true, noSave: true
        },
        {
            xtype: 'inputHidden03', name: 'XRouteId', ref: 'input.xRouteId', data: true,
            form: true, cls: 'xRouteId', required: false, rights: '',
            grid: false, gIdx: 1, gQuery: true
        },
        //{
        //    xtype: 'inputHidden03', name: 'XStatus', ref: 'input.xStatus', data: true,
        //    form: true, cls: 'xStatus', required: false, rights: '',
        //    grid: false, gIdx: 1, gQuery: true
        //},
        {
            xtype: 'inputHidden03', name: 'XOperatorId', ref: 'input.xOperatorId', data: true,
            form: true, cls: 'xOperatorId noCls', required: false, rights: '', noSave: false, formToGridOnly: true,
            grid: false, gIdx: 1, gQuery: true
        },
        {
            xtype: 'inputHidden03', name: 'XTime', ref: 'input.xTime', data: true, label: 'Giờ',
            form: true, cls: 'xTime', required: false, rights: '', noSave: false,
            grid: false, gIdx: 4, gQuery: true, gDis: 'gDisTime', rvc: 'rvcXTime'
        },
        {
            xtype: 'inputHidden03', name: 'Info', label: "Thông tin", ref: 'input.info', data: true,
            form: true, cls: 'info', required: false, rights: '',
            grid: true, gIdx: 17, gQuery: true, gDis: "gDisInfo"
        },
        {
            xtype: 'seatTpl', name: 'SeatTpl', label: "Sơ đồ ghế", ref: '.seatTpl', data: true,
            form: true, fIdx: 10, cls: 'seatTpl', required: false, rights: '',
            grid: false, gIdx: 3, gQuery: false, value: 0, flex: 2,
            eLabel1: "Cho phép nhà xe đặt vé", eCls1: 'cbEnBms', eLabel: 'Chọn tất cả ghế', eCls: 'pushAllSeat',
        }
        
    ],
    buttons: [
        {
            xtype: 'iconbutton', name: 'btnSave', label: 'Thêm', ref: 'button.save',
            form: true, cls: 'btn-success save', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onRightSave' }]
        },
        {
            xtype: 'iconbutton', name: 'btnClear', label: 'Clear', ref: 'button.add-new',
            form: true, cls: 'btn-primary add-new', iconCls: 'glyphicon-refresh',
            listeners: [{ xClick: 'onRightClear' }]
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled', iconCls: 'glyphicon-remove-sign',
            messSucc: 'Xóa quyền thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onRightDelete' }]

        }
    ]
});