define({
    title: 'Quản lý chuyến', name: 'Chuyến',
    grid: true, gTitle: 'Danh sách chuyến', gId: 'tripTableContainer', gNoLoad: true,
    gridSortBy: { Name: "Time", IsDesc: false }, gridToBottom: function (item, idx) { return item.StatusInfo == 3; },
    xRowCls: 'mt5',
    xWidth: '',
    cols: 3,
    pageSize: 25,
    keyFields: ['Time'],
    finalKeyFields: ['Alias'],
    queryAction: 'fGetTrip',
    updateAction: 'UpTrip',
    insertAction: 'AddTime',
    queryConditions: { CompId: app.cid, Time: '($x is not null)', Type: "$x='2' order by Time desc" },
    defaultData: { CompId: app.cid, Type: 2, BaseId: '$base' },
    checkHasTicket: {
        _a: 'fGetTicket',
        _c: {
            //Status: "(($x) IN(1,2,4,5,8))", //STATUS
            Status: "(($x) IN(2, 3, 4, 5, 8) or (Status = 1 AND (ExpiredTime is null or ExpiredTime >= '" + new Date().toFormatString("iso") + "')))",
            TripDate: {
                params: '$Date,$Time',
                get: 'getTripDate'
            },
            TripId: '$base',
        },
        _f: 'SeatCode'
    },
    checkDelConditions: {
        _a: 'fGetTicket',
        _c: {
            Status: "(($x) IN(1,2,4,5,8))", //STATUS
            TripDate: { params: '$Date,$Time', get: 'getTripDate' },
            TripId: '$base',
        },
        _f: 'Id',
        existMsg: 'Chuyến đang có {$x} vé, vui lòng hủy / chuyển vé'
    },


    //_f: 'CompId, OwnerId, BaseId, VehicleId, EventId, Type, Code, Alias, FromArea, ToArea, FacilityInfo, SeatTemplateInfo, ExtendedSeatsInfo, TotalSeats, TotalExtendedSeats, SeatSummaryInfo, PickedPointsInfo, SeatFacilityInfo, LicensePlate, StatusInfo, TeamInfo, FeeInfo, PayInfo, RevenuesInfo, RightsInfo, SeatPolicyInfo, VehicleInfo, DepartureTime, RealDepartureTime, FinishDate, OwnerInfo, TotalFee, IsVeXeReFull, Keywords, Note, IsPrgStatus, IsPrgPartComp, IsPrgHistoryInfo, IsPrgCreatedDate, IsPrgUpdatedDate, IsPrgUnsignKeywords'

    baseCf: {
        _a: 'fGetTrip',
        _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 },
        _f: 'Id, Name, StatusInfo, Info, Description',
    },
    items: [
        { x: 'Id' },
        {
            name: 'Name', base: true, baseValField: 'Id', baseDisplayField: 'Name', xSearchDefault: true, xSearchAlways: true, data: true,
            copyFromBase: true, gIdx: 1, vType: 'num', valField: 'BaseId', gQuery: true, fIdx: 1, ref: 'select.route',
            grid: (typeof _dict._hasShowTripNameInRCF != 'undefined' && !_dict._hasShowTripNameInRCF) ? false : true,
            xSearch: true, xtype: 'cbbTpl01', label: "Tuyến", form: true, cbb: true, domain: true, cls: 'route', rights: 'S271',
            formToGridOnly: true, defaultTrip: true, alwaysEnable: true, options: [], allowEmpty: false, nullLabel: 'Chọn chuyến',
            listeners: [{ xChange: 'onBaseIdChange' }]
        },
        {
            name: 'Date', type: 'Date', xSearch: true, xSearchDefault: true, domain: true, xSearchAlways: true, data: true,
            grid: false, gQuery: true, gIdx: 2, fIdx: 4, ref: '.departure', gWidth: '5%', gCls: 'grid-cell-center', alwaysEnable: true,
            xtype: 'datepickerTpl01', label: "Ngày", form: true, cls: 'departure', rights: 'S301', value: vGetNow(),
            gType: 'date', displayFormat: 'dd-mm-yy', formToGridOnly: true,
            gDis: 'gDisDate',
            cpc: 'cpcDate',
            listeners: [{ xDateSelect: 'onDateChange' }]
        },
        {
            name: 'Time', gTextToFId: true, useOptionTextAsVal: true, // xtype: 'cbbTpl02'
            fromBase: true, fromExcludeCases: 'SBF', cbb: true, xbase: true, baseValSrcField: 'Info', data: true,
            alwaysEnable: true, noTriggerChange: true,
            gCls: 'grid-cell-center', autoAppend: true, appendText: 'Ext', vType: 'num', xSearch: true,
            xSearchDefault: true, grid: true, gQuery: true, gIdx: 3, gWidth: '5%', fIdx: 7,
            ref: 'select.pickup-time', xtype: 'cbbTpl01', label: "Giờ", cls: 'pickup-time', form: true,
            rights: '', btnRights: '', btnLabel: '-', btnCls: 'btn-danger change-status',
            listeners: [{ xChange: 'onRunTimeChange' }], /*{ref: 'button.change-status', click: 'onClickTimeStatusBtn'},*/
            svb: 'svbTime', svc: 'svcTime',
            xchr: 'xchrTime',
            xchv: 'xchvTime',
        },
        {
            name: 'Alias', defaultValue: 0, gQuery: true, gCls: 'grid-cell-center', grid: false, gIdx: 4, gWidth: '50px', data: true,
            valField: 'Alias', xSearch: true, cbb: true, vType: 'num', xtype: 'cbbTpl03', label: "Bus", form: false,
            fIdx: 100, ref: 'select.bus', cls: 'bus', rights: '', //,auto: true,
            changeOnSelectionChange: true, listeners: [{ xChange: 'onAliasChange' }], cpc: 'cpcAlias'
        },
        {
            name: 'SeatTemplateInfo', xSearch: true, cbb: true, grid: true, gQuery: true, gIdx: 9, fIdx: 3, ref: '.seat-template', data: true,
            xtype: 'cbbTpl07', label: "Sơ đồ ghế", form: true, cls: 'seat-template', rights: '', options: [],
            gDis: 'gDisStpl', rvc: 'rvcStpl', svb: 'svbStpl', svc: 'svcStpl', allowEmpty: false,
            listConfig: { ajax: { _a: 'fGetResource', _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 }, _f: 'Id, Name, Info' }, valField: 'Id', displayField: 'Name' }

            //name: 'SeatTemplateInfo', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 12, ref: '.seat-template', alwaysDisable: true, copyFromBase: true, data: true,
            //xtype: 'inputHidden01', label: "", form: true, cls: 'seat-template', rights: 'S321', options: [],
            // gDis: 'gDisStpl',
            //rvc: 'svcStpl
            //svb: 'svbStpl',
            // svc: 'svcStpl',
            //listConfig: { ajax: { _a: 'fGetResource', _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 }, _f: 'Id, Name, Info' }, valField: 'Id', displayField: 'Name' }
        },
        {
            //name: 'FareInfo', grid: true, gQuery: true, gIdx: 3, gWidth: '5%', gCls: 'grid-cell-center', fIdx: 3, noSave: true, data: true,
            //ref: '.fare', xtype: 'txtTpl03', label: "Giá", form: true, xSearch: true, cls: 'fare', rights: 'S330',
            //gDis: 'gDisFare',
            ////rvc: 'svcStpl'
            //rvc: 'rvcFI',
            //svb: 'svbFare'
            //svc: 'svcFI'
            name: 'FareInfo', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 13, ref: '.fare', copyFromBase: true, data: true,
            xtype: 'inputHidden01', label: "", form: true, cls: 'fare', rights: '', options: []
        },
        {
            name: 'RouteInfo', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 13, ref: '.route-info', copyFromBase: true, data: true,
            xtype: 'inputHidden01', label: "", form: true, cls: 'route-info', rights: '', options: [],
        },
        {
            name: 'TotalBookedSeats', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 13, ref: '.total-booked-seats', data: true,
            xtype: 'inputHidden01', label: "", form: true, cls: 'total-booked-seats', rights: '', options: [],
        },
        {
            name: 'TotalPaidSeats', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 13, ref: '.total-paid-seats', data: true,
            xtype: 'inputHidden01', label: "", form: true, cls: 'total-paid-seats', rights: '', options: [],
        },
        //{
        //    name: 'ClosedStatus', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 13, ref: '.closed-status', copyFromBase: true, data: true,
        //    xtype: 'inputHidden01', label: "", form: true, cls: 'closed-status', rights: '', options: [],
        //},
        {
            name: 'ClosedStatus', cbb: false, grid: false, gQuery: true, gIdx: 10, fIdx: 19, ref: '.closedStatus', copyFromBase: false, data: true,
            xtype: 'lblXuatben', label: "Xuất bến", form: true, cls: 'closedStatus', rights: '',
            changeOnSelectionChange: true,
            listeners: [{ xChange: 'onClosedStatusChange' }],
            gDis: 'gDisClosedStatus',
            svc: 'svcXB', noSave: true
        },
        {
            name: 'BranchReceiveProduct', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 13, ref: '.branch-receive-product', copyFromBase: true, data: true,
            xtype: 'inputHidden01', label: "", form: true, cls: 'branch-receive-product', rights: '', options: []
        },
        {
            name: 'StatusInfo', xtype: 'inputHidden01', data: true,
            form: true, cls: 'statusinfo', grid: false, gQuery: true, gWidth: '100px', label: "Trạng thái",
            auto: true, fIdx: 10, ref: '.statusinfo', xSearch: true, depends: ['Time', 'BaseId'],
            needBase: true, alwaysDisable: true, options: vGTrs(),
            gDis: 'gDisStatusInfo', cpc: 'cpcSI', svc: 'svcSI'
        },
        //{
        //    name: 'Vehicle', xSearch: true, cbb: true, baseValSrcField: 'VehicleInfo', noSave: true, rootField: 'VehicleInfo', data: true,
        //    grid: true, gQuery: false, gIdx: 5, fIdx: 2, ref: 'select.vehicle', gTextToFId: true, xtype: 'cbbTpl00', label: "Xe",
        //    form: true, gWidth: '120px', cls: 'vehicle', rights: $.rights.mTrip_upPsIf.dtr, options: [], allowEmpty: true, disabled: 'disabled',
        //    listConfig: {
        //        ajax: {
        //            _a: 'fGetVehicle',
        //            _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 },
        //            _f: 'Id, Type, LicensePlate, VehicleTypeName'
        //        },
        //        valField: 'Id',
        //        displayField: 'LicensePlate'
        //    },
        //    changeOnSelectionChange: true,
        //    gDis: 'gDisVehicle', rvc: 'rvcVhc', svb: 'svbVhc', svc: 'svcVhc',
        //    listeners: [{ xChange: 'onVehicleChange' }]
        //},
        //Update xe
        {
            x: 'Vehicle', svc: 'svcVhc', rvc: 'rvcVhc', allowEmpty: true,
            label: 'Xe', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbVhc',
            name: 'Vehicle', noAjax: false, cls: 'chosen-container',
            form: true, fIdx: 2, grid: true, gIdx: 5, gDis: 'gDisVehicle'
        },
        {
            x: 'Persons', svc: 'svcMem', rvc: 'rvcMem',
            label: 'Tài', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbMem',
            name: 'Driver', type: oPst.driver, noAjax: true, disabled: 'disabled',
            form: true, fIdx: 5, grid: true, gIdx: 6, gDis: 'gDisDriver'
        },
        {
            x: 'Persons', svc: 'svcMem', rvc: 'rvcMem',
            label: 'Phục vụ', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbMem',
            name: 'Assistant', type: oPst.assistant, noAjax: true,
            form: true, fIdx: 8, grid: true, gIdx: 3, gDis: 'gDisAid'
        },
        {
            x: 'Persons', svc: 'svcMem', rvc: 'rvcMem',
            label: 'HD viên', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbMem',
            name: 'Guide', type: oPst.guide, noAjax: true,
            form: false, fIdx: 1000, grid: false, gIdx: 8, gDis: 'gDisGuide'
        },
        {
            name: 'VehicleInfo', grid: true, gQuery: true, gHide: true, gIdx: 9, data: true,
            label: "VehicleInfo", depends: ['Vehicle'], auto: true,
            svc: 'svcVhcI'
        },
        {
            name: 'Note', grid: true, gQuery: true, gIdx: 13, gWidth: '*', fIdx: 6, ref: 'textarea.trip-note', xSearch: true, data: true,
            xtype: 'areaTpl01', label: "Ghi chú", form: true, cls: 'trip-note', alwaysEnable: true, rights: '',
            svb: 'svbNote'
        },
        {
            xtype: 'txtTpl01', name: 'Description', label: "Số tài", ref: 'input.trip-driver', data: true, xbase: true, baseValSrcField: 'Description',
            form: true, fIdx: 9, cls: 'trip-driver', rvc: 'rvcDriver', rights: '',
            grid: true,
            gIdx: 8, gQuery: true, gDis: 'gDisDrivertip', cls1: ''
        },
        {
            name: 'Action', grid: true, gQuery: false, gIdx: 14, gWidth: '*', fIdx: 6, ref: '',
            label: "Thao tác", form: false, cls: '', alwaysEnable: true, rights: '',
            gDis: "gDisAction"
        },
        {
            name: 'SeatStatus', grid: true, gQuery: false, gIdx: 8, gWidth: '*', fIdx: 6, ref: '',
            label: "Tình trạng ghế", glbl: "Đ/chỗ--T/toán--Trống", form: false, cls: '', alwaysEnable: true, rights: '',
            gDis: "gDisSeatStatus"
        },
        {
            name: 'TripStatus', grid: true, gQuery: false, gIdx: 10, gWidth: '*', fIdx: 6, ref: '',
            label: "Tình trạng", form: false, cls: '', alwaysEnable: true, rights: '',
            gDis: "gDisTripStatus"
        },
        {
            name: 'BaseId', grid: true, gQuery: true, gIdx: 7, gHide: true, isBaseId: true, data: true,
            label: "BaseId", form: false, cls: 'baseid', vType: 'num'
        },
        {
            name: 'TeamInfo', grid: true, gQuery: true, gIdx: 5, gHide: true, label: "TeamInfo", data: true,
            form: false, auto: true, depends: ['Driver', 'Guide', 'Assistant'],
            gDis: 'gDisTeam',
            svc: 'svcTI'
        },
        {
            name: 'Info', grid: true, gQuery: true, gHide: true, copyFromBase: true, gIdx: 100, data: true
        },
        {
            name: 'CompId', grid: true, gQuery: true, gHide: true, gIdx: 100, data: true
        },
        {
            name: 'Type', grid: true, gQuery: true, gHide: true, gIdx: 100, data: true
        },
        {
            name: 'FromArea', grid: true, gQuery: true, copyFromBase: true, gHide: true, gIdx: 100, data: true
        },
        {
            name: 'ToArea', grid: true, gQuery: true, copyFromBase: true, gHide: true, gIdx: 100, data: true
        }
    ],

    buttons: [
        {
            xtype: 'btnTpl01', label: 'Lưu', cls: 'btnSaveChange', rights: $.rights.mTrip_saveTrip.dtr, ref: 'button.btnSaveChange',
            colspan: 1, name: 'btnSaveChange', form: true,
            listeners: [{ xClick: 'onSave' }]
        },
        //{
        //    xtype: 'btnTpl0', label: "Lưu mới", name: 'AddBus', noSave: true, form: false,
        //    fIdx: 10, ref: 'button.addBus', note: '', cls: 'addBus', rights: 'S221',
        //    listeners: [{ xClick: 'onClickAddBus' }]
        //},
        {
            xtype: 'btnTplDel', label: 'Hủy', cls: 'delete btn-danger', rights: $.rights.mTrip_rmvTrip.dtr, form: true,
            colspan: 1, name: 'btnCancel', isCancell: true, ref: 'button.delete',
            listeners: [{ xClick: 'onClickBtnCancel' }]
        },
        //{
        //    name: 'sbf', sbf: true, form: true, xtype: 'vchosen', chosen: { on: true, width: "100%" }, label: "",
        //    ref: '.search-options', xSearch: true, colspan: 10, clsBtn: 'search-options-btn',
        //    labelBtn: 'Tìm theo form', cls: 'search-options', rights: '',
        //    listeners: [{ ref: '.search-options-btn', xClick: 'onClickSBF', args: { name: 'sbf' } }]
        //},
        //{ xtype: 'btnTplClose', label: 'Đóng' },
        {
            xtype: 'txtAddTimeTpl01', label: "Thêm chuyến", name: 'AddTime', noSave: true, form: true, fIdx: 44, data: true,
            //ref: '.add-time', cls: 'add-time', rights: 'S221', btnRights: 'S221', btnLabel: 'Thêm', btnCls: 'btn-success addTime',
            ref: '.add-time', cls: 'add-time', rights: $.rights.mTrip_addTrip.dtr, btnRights: $.rights.mTrip_addTrip.dtr, btnLabel: '', btnCls: 'btn-success addTime',
            alwaysEnable: true, colspan: 10,
            listeners: [{ ref: 'button.addTime', xClick: 'onClickAddTime', inputRef: 'input.add-time' }]
        },
    ]
});