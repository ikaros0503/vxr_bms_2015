$.xId = function (x) {
    return {
        name: 'Id', data: true, dType: 1,
        grid: true, gQuery: true, gHide: true, gIdx: 0,
        form: false, fIdx: 100, gDis: x.gDis
    };
};

$.xNo = function (x) {
    return {
        name: 'No', data: true, gWidth: '80px', label: '# No',
        grid: true, gQuery: false, gHide: false, gIdx: 0, gCls: 'grid-cell-center', gColType: 'No',
        form: false, fIdx: 100, gDis: x.gDis
    };
};

$.xPersons = function (x) {
    /// <summary>
    /// To use: implement gDisPersons in p.js
    /// </summary>
    /// <param name="x"></param>
    return {
        xtype: 'xchosen', noSave: true, data: true, xSearch: true,
        name: x.name, rootField: 'TeamInfo',
        fIdx: x.fIdx, mType: x.type, //enum type
        gHide: false, grid: x.grid, gIdx: x.gIdx, ref: 'select.' + x.name,
        chosen: { on: true, width: "100%" },
        multi: true, label: x.label, noAjax: x.noAjax,
        form: x.form, partInfo: true, disabled: x.disabled,
        cls: x.name, rights: x.rights, options: [], //noAjax: x.noAjax,
        gDis: x.gDis, rvc: x.rvc, svb: x.svb, svc: x.svc,
        listConfig: {
            ajax: { _a: 'fGetPerson', _c: { CompId: app.cid, IsPrgStatus: 1, Type: '$x= ' + x.type, }, _f: 'Id, FullName, Type, PhoneInfo' },
            valField: 'Id',
            displayField: 'FullName'
        },
    };
};

$.xVehicle = function (x) {
    /// <summary>
    /// To use: implement gDisVehicle in p.js
    /// </summary>
    /// <param name="x"></param>
    return {
        xtype: 'xchosensingle', noSave: true, data: true, xSearch: true,
        name: x.name, rootField: 'VehicleInfo', allowEmpty: x.allowEmpty,
        fIdx: x.fIdx, mType: x.type, //enum type
        gHide: false, grid: x.grid, gIdx: x.gIdx, ref: 'select.' + x.name,
        chosen: { on: true, width: "100%" },
        multi: false, label: x.label,
        form: x.form, partInfo: true, disabled: x.disabled,
        cls: x.name, rights: x.rights, options: [], //noAjax: x.noAjax,
        gDis: x.gDis, rvc: x.rvc, svb: x.svb, svc: x.svc,
        listConfig: {
            ajax: {
                _a: 'fGetVehicle',
                _c: { CompId: app.cid, IsPrgStatus: 1, Type: 1 },
                _f: 'Id, Type, LicensePlate, VehicleTypeName'
            },
            valField: 'Id',
            displayField: 'LicensePlate',
        }

    };
};