define({
    title: 'Quản lý điểm đón khách/trung chuyển', name: 'Điểm đón khách', grid: true, xWidth: '', useSmCls: true,
    gTitle: 'Danh sách địa điểm', gId: 'PointsTableContainer', gNoLoad: true, autoClear: true,
    winCls: 'pickedPoints', keyFields: [''], cols: 4,
    queryAction: 'fGetTrip',
    queryConditions: (app.cid == app.vid) ?
        {
            IsPrgStatus: 1,
            Type: "$x=1 order by IsPrgUpdatedDate desc"
        } :
        {
            CompId: app.cid,
            Type: 1,
            IsPrgStatus: 1,
        },
    defaultData: { Type: 1, IsPrgStatus: 1, CompId: app.cid },

    baseCf: {
        _a: 'fGetTrip',
        _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 },
        _f: 'Id, Name, RouteInfo, PickedPointsInfo, TransferPointsInfo'
    },

    items: [
        {
            xtype: 'tabbar', name: 'Tab', grid: false, gQuery: false, form: true, noSave: true,
            items: [
                {
                    xtype: 'tabnav', name: 'PickupPoints', label: 'Điểm đón khách', ref: 'pickup-points', active: 'active',
                    grid: false, gQuery: false, form: true, notInRow: true
                },
                {
                    xtype: 'tabnav', name: 'TransferPoints', label: 'Điểm trung chuyển', ref: 'transfer-points',
                    grid: false, gQuery: false, form: true, notInRow: true,
                }
            ]
        },
        {
            xtype: 'tabcontent', grid: false, gQuery: false, form: true,
            items: [
                    {
                        xtype: 'tabpane', name: 'PickupPoints', grid: false, gQuery: false, form: true, cls: 'pickup-points', noSave: true,
                        active: 'active',
                        items: [
                            {
                                xtype: 'inputHidden01', name: 'pkPointId', ref: 'input.pkPointId', form: true, cls: 'pkPointId', grid: false, fIdx: 0
                            },
							{
							    name: 'Name', base: true, ref: 'select.pkRoute', gIdx: 1, fIdx: 1, grid: false, gQuery: true, noSave: true, data: true,
							    copyFromBase: false, valField: 'Id',
							    xtype: 'combobox', label: "Tuyến đường", form: true, cbb: true, domain: false, cls: 'pkRoute',
							    baseValField: 'Id', baseDisplayField: 'Name', options: [],
							    formToGridOnly: true,
							    listeners: [{ xChange: 'onPkRouteChange' }],
							},
							{
							    xtype: 'textbox03', name: 'PointName', label: "Tên điểm đón", ref: 'input.pkPointName', data: true, vType: 'textbox',
							    form: true, fIdx: 4, cls: 'pkPointName', gWidth: '7%', grid: true, gIdx: 4, gQuery: false, noSave: true
							},
							{
							    xtype: 'textbox03', name: 'PointAddress', label: "Địa chỉ cụ thể", ref: 'input.pkPointAddress', data: true, vType: 'textbox',
							    form: true, fIdx: 5, cls: 'pkPointAddress', gWidth: '7%', grid: true, gIdx: 5, gQuery: false, noSave: true
							},
							{
							    xtype: 'textbox03', name: 'PointNearBy', label: "Điểm gợi ý", ref: 'input.pkPointNearBy', data: true, vType: 'textbox',
							    form: true, fIdx: 6, cls: 'pkPointNearBy', gWidth: '7%', grid: true, gIdx: 6, gQuery: false, noSave: true
							},
							{
							    xtype: 'textbox03', name: 'PointTime', label: "Thời gian đến đón khách (phút)", ref: 'input.pkPointTime', data: true, vType: 'textbox',
							    form: true, fIdx: 7, cls: 'pkPointTime numberOnly', gWidth: '7%', grid: true, gIdx: 7, gQuery: false, noSave: true,
							},
							{
							    xtype: 'textbox03', name: 'PointIndex', label: "Thứ tự điểm đón", ref: 'input.pkPointIndex', data: true,
							    form: true, fIdx: 8, cls: 'pkPointIndex numberOnly', gWidth: '7%', grid: true, gIdx: 8, gQuery: false, noSave: true,
							},
							{
							    xtype: 'inputHidden01', name: 'PickedPointsInfo', cbb: false, ref: 'input.pkPointInfo', label: "Version", data: true,
							    form: true, cls: 'pkPointInfo', grid: false, gQuery: true, copyFromBase: true, fIdx: 10
							}
                        ]
                    },
                    {
                        xtype: 'tabpane', name: 'TransferPoints', grid: false, gQuery: false, form: true, cls: 'transfer-points', noSave: true,
                        items: [
                            {
                                xtype: 'inputHidden01', name: 'tfPointId', ref: 'input.tfPointId', form: true, cls: 'tfPointId', grid: false, fIdx: 0
                            },
							{
							    name: 'Name', base: true, ref: 'select.tfRoute', gIdx: 1, fIdx: 1, grid: false, gQuery: false, noSave: true, data: false,
							    copyFromBase: false, valField: 'Id',
							    xtype: 'combobox', label: "Tuyến đường", form: true, cbb: true, domain: false, cls: 'tfRoute',
							    baseValField: 'Id', baseDisplayField: 'Name', options: [],
							    formToGridOnly: true,
							},
							{
							    xtype: 'textbox03', name: 'PointName', label: "Tên điểm trung chuyển", ref: 'input.tfPointName', data: true, vType: 'textbox',
							    form: true, fIdx: 4, cls: 'tfPointName', gWidth: '7%', grid: false, gIdx: 4, gQuery: false, noSave: true
							},
							{
							    xtype: 'textbox03', name: 'PointAddress', label: "Địa chỉ cụ thể", ref: 'input.tfPointAddress', data: true, vType: 'textbox',
							    form: true, fIdx: 5, cls: 'tfPointAddress', gWidth: '7%', grid: false, gIdx: 5, gQuery: false, noSave: true
							},
							{
							    xtype: 'textbox03', name: 'PointNearBy', label: "Điểm gợi ý", ref: 'input.tfPointNearBy', data: true, vType: 'textbox',
							    form: true, fIdx: 6, cls: 'tfPointNearBy', gWidth: '7%', grid: false, gIdx: 6, gQuery: false, noSave: true
							},
							{
							    xtype: 'textbox03', name: 'PointTime', label: "Thời gian đến đón khách (phút)", ref: 'input.tfPointTime', data: true, vType: 'textbox',
							    form: true, fIdx: 7, cls: 'tfPointTime numberOnly', gWidth: '7%', grid: false, gIdx: 7, gQuery: false, noSave: true,
							},
							{
							    xtype: 'textbox03', name: 'PointIndex', label: "Thứ tự điểm trung chuyển", ref: 'input.tfPointIndex', data: true,
							    form: true, fIdx: 8, cls: 'tfPointIndex numberOnly', gWidth: '7%', grid: false, gIdx: 8, gQuery: false, noSave: true,
							},
							{
							    xtype: 'inputHidden01', name: 'TransferPointsInfo', cbb: false, ref: 'input.tfPointInfo', label: "Version", data: true,
							    form: true, cls: 'tfPointInfo', grid: false, gQuery: true, copyFromBase: true, fIdx: 10
							}
                        ]
                    }
            ]
        },
    ],

    buttons: [
        {
            xtype: 'iconbutton', name: 'btnsavePkPoint', label: 'Thêm', ref: 'button.savePkPoint',
            form: true, cls: 'btn-success savePkPoint save', iconCls: 'glyphicon-plus',
            listeners: [{ xClick: 'onSavePoint' }],
        },
        {
            xtype: 'iconbutton', name: 'btnRemove', label: 'Xóa', ref: 'button.delete', disabled: 'disabled="disabled"',
            form: true, cls: 'btn-danger delete btn-disabled', iconCls: 'glyphicon-remove-sign',
            messSucc: 'Xóa giá vé thành công.',
            messErro: 'Thao tác thất bại, vui lòng thử lại sau.',
            listeners: [{ xClick: 'onDeletePoint' }]
        }
    ],
    jVar: {
        updateFunction: 'UpdateTrip'
    },
    jHtml: {
        tabIndex: "ul.nav-tabs li",
        deleteButtton: 'button.delete',
        selectTf: 'select.tfRoute',
        selectPk: 'select.pkRoute',
        numberOnly: '.numberOnly',
        regexNumberOnly: /^[0-9]+$/,
        divAlert: 'div.alert.message',
        alertDanger: 'alert-danger',
        alertMsg_WrongNumber: 'Thời gian (phút) không chính xác. Vui lòng kiểm tra lại.',
        alertMsg_PointName: 'Vui lòng nhập điểm đón',
        alertMsg_PointTime: 'Vui lòng nhập thời gian',
        alertMsg_PointIndex: 'Vui lòng nhập thứ tự',
        jTableSelectedRow: 'tr.jtable-row-selected',
        inputPkPointName: 'input.pkPointName',
        inputPkPointTime: 'input.pkPointTime',
        inputPkPointIndex: 'input.pkPointIndex',
        inputPkPointNearBy: 'input.pkPointNearBy',
        inputPkPointAddress: 'input.pkPointAddress',
        inputTfPointName: 'input.tfPointName',
        inputTfPointTime: 'input.tfPointTime',
        inputTfPointIndex: 'input.tfPointIndex',
        inputTfPointNearBy: 'input.tfPointNearBy',
        inputTfPointAddress: 'input.tfPointAddress',
        tab: 'a[data-toggle="tab"]',
        tabChangeEvent: 'shown.bs.tab',
        allInputs: 'input',
        classForDisabledButton: "btn-disabled",
        disabledButtonProp: "disabled",
        disabledButtonPropValue: "disabled",
    },

});