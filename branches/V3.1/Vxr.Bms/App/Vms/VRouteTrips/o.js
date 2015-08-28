define({
    title: 'Tuyến xe', name: 'Chuyến', id: 'vTripsModule',
    tpl: 'vTripsTpl',
    grid: true, gTitle: 'Danh sách chuyến', gId: 'watchRouteTableContainer', gNoLoad: true,
    useSmCls: true, autoClear: false,
    gHideCb: true,
    //gridSortBy: { Name: "Time", IsDesc: false },
    //gridToBottom: function (item, idx) { return item.StatusInfo == 3; },
    filterOnly: true,
    xWidth: '',
    cols: 12,
    pageSize: 25,
    mainModel: {
        Idx: 0,
        Act: 'fGetVTrips',
        SumIdx: 1,
        2: 'Routes'
    },
    keyFields: [''],
    finalKeyFields: [''],
    queryAction: 'fGetVTrips',
    //updateAction: 'UpTrip',
    //insertAction: 'AddTime',
    //queryConditions: { CompId: app.cid, Time: '($x is not null)', Type: "$x='2' order by Time desc" },
    //queryConditions: { Time: '($x is not null)', Type: "$x='2' order by Time desc" },
    queryConditions: { isGetRoute: 1, compType: 7, yDate: vSaveDate(vGetNow()) },//@yDate ='2015-07-18T00:00:00.000' //isGetRoute: 1
    // defaultData: { CompId: app.cid, Type: 2, BaseId: '$base' },
    //defaultData: { Type: 2, BaseId: '$base' },
    /*checkHasTicket: {
        _a: 'fGetTicket',
        _c: {
            Status: "(($x) IN(1,2,4,5,8))", //STATUS
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
    },*/


    //_f: 'CompId, OwnerId, BaseId, VehicleId, EventId, Type, Code, Alias, FromArea, ToArea, FacilityInfo, SeatTemplateInfo, ExtendedSeatsInfo, TotalSeats, TotalExtendedSeats, SeatSummaryInfo, PickedPointsInfo, SeatFacilityInfo, LicensePlate, StatusInfo, TeamInfo, FeeInfo, PayInfo, RevenuesInfo, RightsInfo, SeatPolicyInfo, VehicleInfo, DepartureTime, RealDepartureTime, FinishDate, OwnerInfo, TotalFee, IsVeXeReFull, Keywords, Note, IsPrgStatus, IsPrgPartComp, IsPrgHistoryInfo, IsPrgCreatedDate, IsPrgUpdatedDate, IsPrgUnsignKeywords'

    /*baseCf: {
        _a: 'fGetVxrContractTrip',
        _c: { IsPrgStatus: 1, Type: 1 },
        //_c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 },
        _f: 'Id, Name'
    },*/
    items: [
        {
            x: 'No', gDis: 'gDisNo'
        },
         {
             name: 'Id', data: true, dType: 1, label: "Id",
             grid: true, gQuery: false, gHide: true, gIdx: 0,
             form: false, fIdx: 100
         },
         {
             name: 'CompId', label: "CompId", cbb: true, options: [], alwaysEnable: true,
             xtype: 'schosen', chosen: { on: true, width: "100%" }, form: true, cls: 'compId', ref: 'select.compId', fIdx: 1,
             allowEmpty: false, emptyName: 'Chọn nhà xe', flex: 2, domain: true,
             zCls: 'zCompId', zRef: '.zCompId', searchIcon: false,
             grid: true, gQuery: true, copyFromBase: false, gHide: true, gWidth: '150px', gIdx: 0, data: true,
             listConfig: {
                 ajax: {
                     _a: 'fGetCompany',
                     _c: { IsPrgStatus: 1, Type: 1 },
                     _f: 'Id, Name'
                 },
                 valField: 'Id',
                 displayField: 'Name',
                 //cb: 'listConfigRouteNameCb'
             },
             listeners: [{ xChange: 'onCompIdChange' }]
         },
         {
             name: 'CompIdName', label: "Nhà xe", gDis: 'gDisComp',
             grid: true, gQuery: true, copyFromBase: false, gHide: false, gWidth: '130px', gIdx: 1, data: true
         },
        {
            name: 'Name', base: false, baseValField: 'Id', baseDisplayField: 'Name', xSearchDefault: true, xSearchAlways: true, data: true,
            copyFromBase: true, gIdx: 2, vType: 'num', valField: 'BaseId', gQuery: true, fIdx: 2, ref: 'select.route', gWidth: '*',
            grid: true, zCls: 'zRouteName', zRef: '.zRouteName', searchIcon: false, local: false, displayField: 'Name',
            xSearch: true, xtype: 'schosen', chosen: { on: true, width: "100%" }, gDis: 'gDisName',
            //xtype: 'cbbTpl10',
            label: "Tuyến đường", form: true, cbb: true, domain: true, cls: 'route', rights: 'S271',
            formToGridOnly: true, defaultTrip: true, alwaysEnable: true, options: [], allowEmpty: false, nullLabel: 'Chọn chuyến',
            listeners: [{ xChange: 'onRouteIdChange' }], emptyName: 'Chọn tuyến', flex: 2,
            listConfig: {
                ajax: {
                    _a: 'fGetVxrContractTrip',
                    _c: { IsPrgStatus: 1, Type: 1 },
                    //_c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 },
                    _f: 'Id, Name'
                },
                noload: true,
                valField: 'Id',
                displayField: 'Name'
                //cb: 'listConfigRouteNameCb'
            }
        },
        {
            name: 'Date', type: 'Date', xSearch: false, xSearchDefault: false, domain: false, xSearchAlways: true, data: true,
            grid: true, gQuery: true, gIdx: 3, fIdx: 3, ref: '.xDate', gWidth: '100px', gCls: 'grid-cell-center', alwaysEnable: true,
            xtype: 'datepicker', label: "Ngày", form: true, cls: 'xDate', rights: 'S301', value: vGetNow(),
            gType: 'date', displayFormat: 'dd-mm-yy', formToGridOnly: true, flex: 2,
            gDis: 'gDisDate', svc: 'svcDate',
            cpc: 'cpcDate',
            listeners: [{ xDateSelect: 'onDateChange' }]
        },
        {
            name: 'Time', gTextToFId: true, useOptionTextAsVal: true, // xtype: 'cbbTpl02'
            fromBase: false, fromExcludeCases: 'SBF', cbb: true, xbase: false, //baseValSrcField: 'Info',
            data: true, gDis: 'gDisTime',
            alwaysEnable: false, noTriggerChange: true,
            gCls: 'grid-cell-center', autoAppend: true, appendText: 'Ext', vType: 'num', xSearch: true,
            xSearchDefault: true, grid: true, gQuery: true, gIdx: 4, gWidth: '80px', fIdx: 4,
            ref: 'select.pickup-time', xtype: 'cbbTpl10', label: "Giờ", cls: 'pickup-time', form: false,
            rights: '', btnRights: '', btnLabel: '-', btnCls: 'btn-danger change-status',
            listeners: [{ xChange: 'onRunTimeChange' }], //{ref: 'button.change-status', click: 'onClickTimeStatusBtn'},
            svb: 'svbTime', svc: 'svcTime', flex: 2, emptyName: 'Giờ chạy',
            xchr: 'xchrTime',
            xchv: 'xchvTime',
        },
        {
            name: 'VBookingConfig', label: "H.Thức Đặt Vé", cbb: true,
            valField: 'Id', displayField: 'Name', options: [
                { Id: 0, Name: 'WEB' },
                { Id: 1, Name: 'DAILY' },
                { Id: 2, Name: 'WID' },
                { Id: 3, Name: 'AFF' }
            ], alwaysEnable: true,
            zCls: 'zVBookingConfig', zRef: '.zVBookingConfig', searchIcon: false,
            xtype: 'schosen', chosen: { on: true, width: "100%" }, form: true, cls: 'vBookingConfig', ref: 'select.vBookingConfig', fIdx: 5,
            allowEmpty: false, emptyName: 'H.Thức Đặt Vé', flex: 2, domain: true, local: true,
            grid: true, gQuery: true, copyFromBase: false, gHide: true, gWidth: '150px', gIdx: 0, data: true,
            listeners: [{ xChange: 'onVBookingConfigChange' }]
        },
        {
            name: 'VPaymentConfig', label: "H.Thức Thanh Toán", cbb: true,
            valField: 'Id', displayField: 'Name', options: [
                { Id: 0, Name: 'OLI' },
                { Id: 1, Name: 'COD' },
                { Id: 2, Name: 'ĐLY' }
            ], alwaysEnable: true,
            zCls: 'zVPaymentConfig', zRef: '.zVPaymentConfig', searchIcon: false,
            xtype: 'schosen', chosen: { on: true, width: "100%" }, form: true, cls: 'vPaymentConfig', ref: 'select.vPaymentConfig', fIdx: 6,
            allowEmpty: false, emptyName: 'H.Thức Thanh Toán', flex: 2, domain: true, local: true,
            grid: true, gQuery: true, copyFromBase: false, gHide: true, gWidth: '150px', gIdx: 0, data: true,
            listeners: [{ xChange: 'onVPaymentConfigChange' }]
        },
        {
            name: 'VAppConfig', label: "Loại N.Xe", cbb: true,
            valField: 'Id', displayField: 'Name', options: [
                { Id: 0, Name: 'BMS.OFF' },
                { Id: 1, Name: 'BMS.ON' },
                { Id: 7, Name: 'HAS BMS' }
               // { Id: 1, Name: 'BMS.ON' }
            ], alwaysEnable: true, value: 7,
            zCls: 'zVAppConfig', zRef: '.zVAppConfig', searchIcon: false,
            xtype: 'schosen', chosen: { on: true, width: "100%" }, form: true, cls: 'vAppConfig', ref: 'select.vAppConfig', fIdx: 7,
            allowEmpty: false, emptyName: 'Loại N.Xe', flex: 2, domain: true, local: true,
            grid: true, gQuery: true, copyFromBase: false, gHide: true, gWidth: '150px', gIdx: 0, data: true,
            listeners: [{ xChange: 'onVAppConfigChange' }]
        },
        {
            name: 'MasterFare', label: "Giá vé", gCls: 'grid-cell-center',
            grid: true, gQuery: true, gWidth: '100px', gIdx: 5, data: true, gDis: 'gDisFare',
        },
        {
            name: 'VxrMasterFare', label: "Giá K/M", gCls: 'grid-cell-center',
            grid: true, gQuery: true, gWidth: '150px', gIdx: 6, data: true, gDis: 'gDisFareKM',
        },
        {
            name: 'VBookingText', label: "H.Thức Đặt Vé", gCls: 'grid-cell-center', gDis: 'gDisVBookingText',
            grid: true, gQuery: true, gWidth: '150px', gIdx: 7, data: true
        },
        {
            name: 'VPaymentText', label: "H.Thức Thanh Toán", gCls: 'grid-cell-center', gDis: 'gDisVPaymentText',
            grid: true, gQuery: true, gWidth: '150px', gIdx: 8, data: true
        },
        {
            name: 'VAppText', label: "Loại N.Xe", gCls: 'grid-cell-center', gDis: 'gDisVAppText',
            grid: true, gQuery: true, gWidth: '130px', gIdx: 9, data: true
        },
        {
            name: 'BaseId', grid: true, gQuery: true, gIdx: 10, gHide: true, isBaseId: true, data: true,
            label: "BaseId", form: false, cls: 'baseid', vType: 'num'
        },
        {
            name: 'Action', grid: true, gQuery: false, gIdx: 14, gWidth: '80px', fIdx: 6, ref: '',
            label: "Thao tác", form: false, cls: '', alwaysEnable: true, rights: '',
            gDis: "gDisAction"
        },
        {
            name: 'Type', grid: true, gQuery: true, gHide: true, gIdx: 100, data: true
        },
         {
             name: 'VxrDiscount', cbb: false, fIdx: 13, ref: '.vxrDiscount', data: true,
             gWidth: '120px', grid: true, gQuery: true, gIdx: 4, gHide: true,
             xtype: 'inputHidden01', label: "Khuyến mãi", form: true, cls: 'vxrDiscount', rights: '',
             //gDis: 'gDisVxrDiscount',
             gCls: 'grid-cell-center'
         }

         /*{
             name: 'Date', type: 'Date', xSearch: true, xSearchDefault: true, domain: true, xSearchAlways: true, data: true,
             grid: true, gQuery: true, gIdx: 2, fIdx: 4, ref: '.departure', gWidth: '5%', gCls: 'grid-cell-center', alwaysEnable: true,
             xtype: 'multidatepicker', label: "Ngày", form: true, cls: 'departure', rights: 'S301', value: vGetNow(),
             gType: 'date', displayFormat: 'dd-mm-yy', formToGridOnly: true, flex: 2, isMulti: true,
             gDis: 'gDisDate', id: 'xDate',
             cpc: 'cpcDate',
             listeners: [{ xDateSelect: 'onDateChange' }]
         },*/
        /*{
            name: 'Time', gTextToFId: true, useOptionTextAsVal: true, // xtype: 'cbbTpl02'
            fromBase: false, fromExcludeCases: 'SBF', cbb: true, xbase: false, //baseValSrcField: 'Info',
            data: true,
            alwaysEnable: false, noTriggerChange: true,
            gCls: 'grid-cell-center', autoAppend: true, appendText: 'Ext', vType: 'num', xSearch: true,
            xSearchDefault: true, grid: true, gQuery: true, gIdx: 3, gWidth: '5%', fIdx: 7,
            ref: 'select.pickup-time', xtype: 'cbbTpl10', label: "Giờ", cls: 'pickup-time', form: false,
            rights: '', btnRights: '', btnLabel: '-', btnCls: 'btn-danger change-status',
            listeners: [{ xChange: 'onRunTimeChange' }], /*{ref: 'button.change-status', click: 'onClickTimeStatusBtn'},#1#
            svb: 'svbTime', svc: 'svcTime', flex: 2, emptyName: 'Giờ chạy',
            xchr: 'xchrTime',
            xchv: 'xchvTime',
        },
        {
            name: 'Alias', defaultValue: 0, gQuery: true, gCls: 'grid-cell-center', grid: false, gIdx: 4, gWidth: '50px', data: true,
            valField: 'Alias', xSearch: true, cbb: true, vType: 'num', xtype: 'cbbTpl03', label: "Bus", form: false,
            fIdx: 100, ref: 'select.bus', cls: 'bus', rights: '', //,auto: true,
            changeOnSelectionChange: true, listeners: [{ xChange: 'onAliasChange' }], cpc: 'cpcAlias'
        },*/
        /*{
            name: 'SeatTemplateInfo', xSearch: true, cbb: true, grid: false, gQuery: true, gIdx: 9, fIdx: 3, ref: '.seat-template', data: true,
            xtype: 'cbbTpl07', label: "Sơ đồ ghế", form: false, cls: 'seat-template', rights: '', options: [],
            gDis: 'gDisStpl', rvc: 'rvcStpl', svb: 'svbStpl', svc: 'svcStpl', allowEmpty: false,
            listConfig: { ajax: { _a: 'fGetResource', _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 }, _f: 'Id, Name, Info' }, valField: 'Id', displayField: 'Name' }

            //name: 'SeatTemplateInfo', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 12, ref: '.seat-template', alwaysDisable: true, copyFromBase: true, data: true,
            //xtype: 'inputHidden01', label: "", form: true, cls: 'seat-template', rights: 'S321', options: [],
            // gDis: 'gDisStpl',
            //rvc: 'svcStpl
            //svb: 'svbStpl',
            // svc: 'svcStpl',
            //listConfig: { ajax: { _a: 'fGetResource', _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 }, _f: 'Id, Name, Info' }, valField: 'Id', displayField: 'Name' }
        },*/
        /*{
            name: 'FareInfo', cbb: false, grid: true, gQuery: true, gIdx: 3, fIdx: 13, ref: '.fare', copyFromBase: true, data: true,
            xtype: 'inputHidden01', label: "Giá vé", form: true, cls: 'fare', rights: '', options: [], gDis: 'gDisFare',
            gCls: 'grid-cell-center'
        },
       
        {
            name: 'VxrFareInfo', cbb: false, grid: true, gQuery: true, gIdx: 5, fIdx: 13, ref: '.vxrFareInfo', copyFromBase: true, data: true,
            xtype: 'inputHidden01', label: "Giá K/M", form: true, cls: 'vxrFareInfo', rights: '', options: [], gDis: 'gDisVxrFareInfo'
            //gCls: 'grid-cell-center'
        },
         {
             name: 'VBookingConfig', cbb: false, grid: true, gQuery: true, gIdx: 6, fIdx: 13, ref: '.vBookingConfig', copyFromBase: true, data: true,
             xtype: 'inputHidden01', label: "H.Thức Đặt Vé", form: true, cls: 'vBookingConfig', rights: '', options: [], gDis: 'gDisVBookingConfig',
             gCls: 'grid-cell-center'
         },
          {
              name: 'VPaymentConfig', cbb: false, grid: true, gQuery: true, gIdx: 7, fIdx: 13, ref: '.vPaymentConfig', copyFromBase: true, data: true,
              xtype: 'inputHidden01', label: "H.Thức Thanh Toán", form: true, cls: 'vPaymentConfig', rights: '', options: [], gDis: 'gDisVPaymentConfig',
              gCls: 'grid-cell-center'
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
        },*/
        //{
        //    name: 'ClosedStatus', cbb: false, grid: false, gQuery: true, gIdx: 3, fIdx: 13, ref: '.closed-status', copyFromBase: true, data: true,
        //    xtype: 'inputHidden01', label: "", form: true, cls: 'closed-status', rights: '', options: [],
        //},
       /* {
            name: 'ClosedStatus', cbb: false, grid: false, gQuery: true, gIdx: 10, fIdx: 9, ref: '.closedStatus', copyFromBase: false, data: true,
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
        },*/
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
        /*{
            x: 'Vehicle', svc: 'svcVhc', rvc: 'rvcVhc', allowEmpty: true,
            label: 'Xe', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbVhc',
            name: 'Vehicle', noAjax: false, cls: 'chosen-container',
            form: false, fIdx: 2, grid: false, gIdx: 5, gDis: 'gDisVehicle'
        },*/
       /* {
            x: 'Persons', svc: 'svcMem', rvc: 'rvcMem',
            label: 'Tài', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbMem',
            name: 'Driver', type: oPst.driver, noAjax: true, disabled: 'disabled',
            form: false, fIdx: 5, grid: false, gIdx: 6, gDis: 'gDisDriver'
        },
        {
            x: 'Persons', svc: 'svcMem', rvc: 'rvcMem',
            label: 'Phục vụ', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbMem',
            name: 'Assistant', type: oPst.assistant, noAjax: true,
            form: false, fIdx: 8, grid: false, gIdx: 7, gDis: 'gDisAid'
        },
        {
            x: 'Persons', svc: 'svcMem', rvc: 'rvcMem',
            label: 'HD viên', rights: $.rights.mTrip_upPsIf.dtr, svb: 'svbMem',
            name: 'Guide', type: oPst.guide, noAjax: true,
            form: false, fIdx: 9, grid: false, gIdx: 8, gDis: 'gDisGuide'
        },
        {
            name: 'VehicleInfo', grid: true, gQuery: true, gHide: true, gIdx: 9, data: true,
            label: "VehicleInfo", depends: ['Vehicle'], auto: true,
            svc: 'svcVhcI'
        },*/
       /* {
            name: 'Note', grid: false, gQuery: true, gIdx: 13, gWidth: '*', fIdx: 6, ref: 'textarea.trip-note', xSearch: true, data: true,
            xtype: 'areaTpl01', label: "Ghi chú", form: false, cls: 'trip-note', alwaysEnable: true, rights: '',
            svb: 'svbNote'
        },
        
        {
            name: 'SeatStatus', grid: false, gQuery: false, gIdx: 8, gWidth: '*', fIdx: 6, ref: '',
            label: "Tình trạng ghế", glbl: "Đ/chỗ--T/toán--Trống", form: false, cls: '', alwaysEnable: true, rights: '',
            gDis: "gDisSeatStatus"
        },
        {
            name: 'TripStatus', grid: false, gQuery: false, gIdx: 10, gWidth: '*', fIdx: 6, ref: '',
            label: "Tình trạng", form: false, cls: '', alwaysEnable: true, rights: '',
            gDis: "gDisTripStatus"
        },
        
        {
            name: 'TeamInfo', grid: true, gQuery: true, gIdx: 5, gHide: true, label: "TeamInfo", data: true,
            form: false, auto: true, depends: ['Driver', 'Guide', 'Assistant'],
            gDis: 'gDisTeam',
            svc: 'svcTI'
        },
        {
            name: 'Info', grid: true, gQuery: true, gHide: true, copyFromBase: true, gIdx: 100, data: true
        },*/
        /*{
            name: 'CompId', grid: true, gQuery: true, gHide: true, gIdx: 100, data: true
        },*/
        /*
        {
            name: 'FromArea', grid: true, gQuery: true, copyFromBase: true, gHide: true, gIdx: 100, data: true
        },
        {
            name: 'ToArea', grid: true, gQuery: true, copyFromBase: true, gHide: true, gIdx: 100, data: true
        }*/


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
        }
    ]
});