///#source 1 1 /App/Core/Aio/o.js
/* Aio array contents
 * Idx 0: Number
 * Idx 1: String
 * Idx 2: Array
 * Idx 3: Date
 * Idx 4: Object
*/

var oAio = [
    {
        //Number
        toMn: vToMn,
        
    },
    {
        //String
        toNum: vToNum,
        rdm: vRdm,
        prsDt: vPrsDt,
        gDtObj: vGtDtObj,
        isExist: vIsEstStr,
        isPhone: vIsPhone,
        isMulPhone: vIsMulPhoneNum,
        hasSpecChar: vHasSpecChar,
        hashCode: vHashCode
    },
    {
        //Array
        cln: vCln,
        findById: vFindById,
        sortArr: vSort,
        gtArr: vGetArr,
        numEstIt: vNumEstIt,
        getUnique: vGetUni,
        getSearchCondition: vGetSearchCondt
    },
    {
        //Date
        toFormatString: vDtToStr,
        addMinutes: vAddMinutes,
        gDateOnly: vGetDateOnly,
        addTime: vAddTime,
        parseTime: vPrsTm,
    }
    //{
    //    //Object
    //    cloneObj: vCloneObj,
    //    getObj: vGetObj
    //}
];
///#source 1 1 /App/Core/Aio/p.js
//console.log(toMn.arguments);
$.each(oAio, function (i, a) {
    var o = null;
    switch (i) {
        case 0: o = Number; break;
        case 1: o = String; break;
        case 2: o = Array; break;
        case 3: o = Date; break;
        case 4: o = Object; break;
        default: break;
    }
    if (o) $.each(a, function (j, v) {
        if (o.prototype) o.prototype[j] = v;
    });
});

function vev(eln, en, cb, sc) {
    /// <summary>
    /// Bind Event On Element
    /// </summary>
    /// <param name="el">Element Name</param>
    /// <param name="en">Event Name</param>
    /// <param name="cb">Action function</param>
    /// <param name="sc">Scope</param>
    $(eln).unbind(en).on(en, function (e) {
        try {
            if (cb) cb.call(sc ? sc : this, e);
        } catch (exp) {
            console.error([eln, en], exp);
        }
    });
}

function vfe(eln, en, d, cb) {
    /// <summary>
    /// Fire Event On Element
    /// </summary>
    /// <param name="el">Element Name</param>
    /// <param name="en">Event Name</param>
    /// <param name="d">Data</param>
    /// <param name="cb">Call back</param>
    try {
        var ev = $.Event(en);
        ev.d = d;
        if (cb) ev.cb = cb;
        $(eln).trigger(ev);
    } catch (exp) {
        console.error([eln, en, d], exp);
    }
}

function vbf(en, d, cb) {
    /// <summary>
    /// Fire Event On Body
    /// </summary>
    /// <param name="en">Event Name</param>
    /// <param name="d">Data</param>
    /// <param name="cb">Call back</param>
    vfe('body', en, d, cb);
}

function vbv(en, cb, sc) {
    /// <summary>
    /// Bind Event On Body
    /// </summary>
    /// <param name="en">Event Name</param>
    /// <param name="cb">Call back function</param>
    /// <param name="sc">Scope</param>
    vev('body', en, cb, sc);
}

function vce(eln, enf, ent) {
    /// <summary>
    /// Call Event
    /// </summary>
    /// <param name="eln">Element Name</param>
    /// <param name="enf">From Event's Name</param>
    /// <param name="ent">To Event's Name</param>
    vev(eln, enf, function (e) {
        try {
            var ev = $.Event(ent);
            if (e.d) ev.d = e.d;
            if (e.cb) ev.cb = e.cb;
            $(eln).trigger(ev);
        } catch (exp) {
            console.error([eln, enf], exp);
        }
    });
}

function vbe(enf, ent) {
    /// <summary>
    /// Bind event on body element
    /// </summary>
    /// <param name="enf">From Event's Name</param>
    /// <param name="ent">To Event's Name</param>
    vce('body', enf, ent);
}

function gDx(o) {
    if (!$.dx) $.dx = {};
    if (!$.dx[o.appId]) $.dx[o.appId] = [];
    return $.dx[o.appId];
}

function sDx(o) {
    if (!$.dx) $.dx = {};
    $.dx[o.appId] = [];
    return $.dx[o.appId];
}

/*function sDx(o) {
    return $.dx[o.appId];
}*/
///#source 1 1 /App/Core/aRights/o.js
//$.rights = { // List all Rights :    {val: giá trị trong Info (vd: 1|112|1); dtr: giá trị attr data-right trong tag (vd: S1230)
//    mgmt:               { val: '', dtr: ''},                   //Quản lý
//    mTrip:              { val: '', dtr: '' },                  //Quản lý chuyến
//    mTrip_eiad:         { val: '5|20072|1', dtr: ''},             //Đổi thông tin chuyến sau khi xuất bến
//    mTrip_upPsIf:       { val: '', dtr: 'S341'} ,             //Cập nhật thông tin lơ, tài, xe
//    mTrip_addTrip:      { val: '', dtr: 'S221'},          //Thêm chuyến
//    mTrip_saveTrip:     { val: '', dtr: 'S361'},         //Lưu chuyến
//    mTrip_rmvTrip:      { val: '', dtr: 'S281'},          //Hủy chuyến
//    mArea:              { val: '', dtr: '' },                  //Quản lý địa điểm
//    mArea_showAllArea:  { val: '|12121|', dtr: ''},      //Show tất cả các điểm dừng
//    mComp:              { val: '', dtr: '' },                  //Quản lý công ty
//    mComp_olUp:         { val: '', dtr: 'S450'},             //Chỉ được xem và cập nhật thông tin
//    mComp_edtDel:       { val: '', dtr: 'S430' },           //Có thể cập nhật, thêm, xóa công ty 
//    mAgent:             { val: '', dtr: ''},                 //Quản lý chi nhánh - đại lý
//    mEmpl:              { val: '', dtr: ''},                  //Quản lý nhân viên
//    mAcc:               { val: '', dtr: ''},                   //Quản lý tài khoản
//    mRole:              { val: '', dtr: ''},                  //Quản lý vai trò
//    mRole_add:          { val: '', dtr: ''},              //Thêm vai trò
//    mRole_edrm:         { val: '', dtr: '' },            //Xóa/Sửa vai trò
//    mStpl:              { val: '', dtr: '' },                  //Quản lý sơ đồ ghế
//    mRoute:             { val: '', dtr: '' },                 //Quản lý tuyến đường
//    mTicConf:           { val: '', dtr: '' },               //Quản lý cấu hình vé
//    mTicConf_comp:      { val: '', dtr: 'S101070' },            //Chọn nhà xe cấu hình vé
//    mTicConf_hv:        { val: '5|10101|1', dtr: '' },            //Cấu hình hết vé
//    mTicConf_onl:       { val: '5|10102|1', dtr: '' },           //Cấu hình vé Online
//    mTicConf_ofl:       { val: '5|10106|1', dtr: '' },           //Cấu hình vé Offline
//    mFare:              { val: '', dtr: '' },                   //Quản lý giá vé
//    mVerhicle:          { val: '', dtr: '' },               //Quản lý xe
//    mDrive:             { val: '', dtr: '' },                 //Quản lý tài xế
//    mAssistant:         { val: '', dtr: '' },              //Quản lý phụ xe
//    mGuide:             { val: '', dtr: '' },                  //Quản lý hướng dẫn viên
//    mCus:               { val: '', dtr: '' },                     //Quản lý khách hàng
//    mPickup:            { val: '', dtr: '' },                  //Quản lý điểm đón khách
//    mCusPrf:            { val: '', dtr: '' },                  //Quản lý thông tin khách hàng
//    report:             { val: '', dtr: '' },                  //Báo cáo
//    rAllRpt:            { val: '', dtr: '10070' },                //Xem tất cả báo cáo
//    rRp1:               { val: '', dtr: '10071' },                   //Báo cáo số 1
//    rRp2:               { val: '', dtr: '10072' },                   //Báo cáo số 2
//    rRp3:               { val: '', dtr: '10073' },                   //Báo cáo số 3
//    rRp4:               { val: '', dtr: '10074' },                   //Báo cáo số 4
//    rRp5:               { val: '', dtr: '10075' },                   //Báo cáo số 5
//    rRp6:               { val: '', dtr: '10076' },                   //Báo cáo số 6
//    rRp7:               { val: '', dtr: '10077' },                   //Báo cáo số 7
//    rRp8:               { val: '', dtr: '10078' },                   //Báo cáo số 8
//    rRp9:               { val: '', dtr: '' },                   //Báo cáo số 9
//    rRp10:              { val: '', dtr: '' },                  //Báo cáo số 10
//    rRp11:              { val: '', dtr: '' },                  //Báo cáo số 11
//    rRp12:              { val: '', dtr: '' },                  //Báo cáo số 12
//    rRp13:              { val: '', dtr: '' },                 //Báo cáo số 13
//    booking:            { val: '', dtr: '' },                //Đặt vé
//    bUBlockBks:         { val: '5|20071|1', dtr: '' },              //Unblock BKS theo thời gian
//    bEnStgTic:          { val: '5|10069|1', dtr: '' },              //Cho phép đặt vé chặng
//    bBook:              { val: '', dtr: '' },                 //Đặt vé (B)
//    bUpdate:            { val: '', dtr: '' },                //Cập nhật vé (U)
//    bQBook:             { val: '1|10093|1', dtr: '' },                  //Đặt nhanh vé (P)
//    bQPay:              { val: "5|30006|1", dtr: ''},               // Thanh toán nhanh (Q) 
//    bCancel:            { val: '', dtr: '' },                //Hủy vé (C)
//    bMove:              { val: '', dtr: '' },                  //Di chuyển vé (M)
//    bDpt:               { val: '1|10091|1', dtr: '' },                   //Xuất bến
//    bTK:                { val: '1|10096|1', dtr: '' },                    //Xem thống kê
//    bPPhoi:             { val: '', dtr: '' },                 //In phơi
//    bSPhoi:             { val: '', dtr: '' },                 //Lưu phơi
//    bEdtAtCphoi:        { val: '5|10095|1', dtr: '' },                  //Chỉnh sửa sau khi chốt phơi
//    bEdtOnlTic:         { val: '5|31000|1', dtr: '' },    //Thay đổi vé đặt online
//    bBookPastTk:        { val: '12|10065|1', dtr: '' },            //Đặt vé trong quá khứ
//    bBkAtDpt:           { val: '', dtr: '' },               //Đặt vé sau khi xuất bến
//    bClAtDpt:           { val: '', dtr: '' },             //Hủy vé sau khi xuất bến
//    bClAtPm:            { val: '', dtr: '' },                //Hủy vé sau khi thanh toán
//    bEdtInfPaidTk:      { val: '5|20073|1', dtr: '' },          //Thay đổi thông tin vé đã thanh toán
//    bEnBtnAtDpt:        { val: '5|10092|1', dtr: '' },            //Mở khóa button sau khi xuất bến
//    bAddMoreTk:         { val: '', dtr: '' },           //Đặt thêm vé
//    bPrtTk:             { val: '', dtr: '' },                 //In vé
//    bReturn:            { val: '', dtr: '' },                //Khứ hồi
//    bUBFrtStg:          { val: '5|10099|1', dtr: '' },              //Unbock điểm đầu chặng (FromPoint)
//}

$.rights = { // List all Rights :    {val: giá trị trong Info (vd: 1|112|1); dtr: giá trị attr data-right trong tag (vd: S1230)
    mdAg: { val: '2|2|1', dtr: '' },                // Module đại lý
    mgmt: { val: '', dtr: '' },                   //Quản lý
    mTrip: { val: '', dtr: '' },                  //Quản lý chuyến
    mTrip_eiad: { val: '2|1104|1', dtr: '' },             //Đổi thông tin chuyến sau khi xuất bến
    mTrip_upPsIf: { val: '', dtr: 'S11051' },             //Cập nhật thông tin lơ, tài, xe
    mTrip_addTrip: { val: '', dtr: 'S11031' },          //Thêm chuyến
    mTrip_saveTrip: { val: '', dtr: 'S11011' },         //Lưu chuyến
    mTrip_rmvTrip: { val: '', dtr: 'S11021' },          //Hủy chuyến
    mArea: { val: '', dtr: '' },                  //Quản lý địa điểm
    mArea_showAllArea: { val: '2|1201|1', dtr: 'S12010' },      //Show tất cả các điểm dừng
    mComp: { val: '', dtr: '' },                  //Quản lý công ty
    mComp_olUp: { val: '', dtr: 'S13010' },             //Chỉ được xem và cập nhật thông tin
    mComp_edtDel: { val: '', dtr: 'S13020' },           //Có thể cập nhật, thêm, xóa công ty 
    mAgent: { val: '', dtr: '' },                 //Quản lý chi nhánh - đại lý
    mEmpl: { val: '', dtr: '' },                  //Quản lý nhân viên
    mAcc: { val: '', dtr: '' },                   //Quản lý tài khoản
    mRole: { val: '', dtr: '' },                  //Quản lý vai trò
    mRole_add: { val: '', dtr: '' },              //Thêm vai trò
    mRole_edrm: { val: '', dtr: '' },            //Xóa/Sửa vai trò
    mStpl: { val: '', dtr: '' },                  //Quản lý sơ đồ ghế
    mRoute: { val: '', dtr: '' },                 //Quản lý tuyến đường
    mTicConf: { val: '', dtr: '' },               //Quản lý cấu hình vé
    mTicConf_comp: { val: '', dtr: 'S20010' },            //Chọn nhà xe cấu hình vé
    mTicConf_hv: { val: '2|2002|1', dtr: '' },            //Cấu hình hết vé
    mTicConf_onl: { val: '2|2003|1', dtr: '' },           //Cấu hình vé Online
    mTicConf_ofl: { val: '2|2004|1', dtr: '' },           //Cấu hình vé Offline
    mFare: { val: '', dtr: '' },                   //Quản lý giá vé
    mFare_cfOnlFare: { val: '1|2101|1', dtr: 'S21010' },          // Cấu hình giá vé online
    mFare_cfFare: { val: '1|2102|1', dtr: 'S21020' },          // Cấu hình giá vé cho nhà xe
    mVerhicle: { val: '', dtr: '' },               //Quản lý xe
    mDrive: { val: '', dtr: '' },                 //Quản lý tài xế
    mAssistant: { val: '', dtr: '' },              //Quản lý phụ xe
    mGuide: { val: '', dtr: '' },                  //Quản lý hướng dẫn viên
    mCus: { val: '', dtr: '' },                     //Quản lý khách hàng
    mPickup: { val: '', dtr: '' },                  //Quản lý điểm đón khách
    mCusPrf: { val: '', dtr: '' },                  //Quản lý thông tin khách hàng
    mInitNewBo: { val: '1|2900|1', dtr: 'S29000' },                  // khởi tạo nhà xe mới
    report: { val: '', dtr: '' },                  //Báo cáo
    rAllRpt: { val: '4021', dtr: '' },                //Xem tất cả báo cáo
    rRp1: { val: '4001', dtr: '' },                   //Báo cáo số 1
    rRp2: { val: '4002', dtr: '' },                   //Báo cáo số 2
    rRp3: { val: '4003', dtr: '' },                   //Báo cáo số 3
    rRp4: { val: '4004', dtr: '' },                   //Báo cáo số 4
    rRp5: { val: '4005', dtr: '' },                   //Báo cáo số 5
    rRp6: { val: '4006', dtr: '' },                   //Báo cáo số 6
    rRp7: { val: '4007', dtr: '' },                   //Báo cáo số 7
    rRp8: { val: '4008', dtr: '' },                   //Báo cáo số 8
    rRp9: { val: '4009', dtr: '' },                   //Báo cáo số 9
    rRp10: { val: '4010', dtr: '' },                  //Báo cáo số 10
    rRp11: { val: '4011', dtr: '' },                  //Báo cáo số 11
    rRp12: { val: '4012', dtr: '' },                  //Báo cáo số 12
    rRp13: { val: '4013', dtr: '' },                  //Báo cáo số 13
    rRp14: { val: '4014', dtr: '' },                  //Báo cáo số 14
    rRp61: { val: '4061', dtr: '' },                  //Báo cáo số 14
    booking: { val: '', dtr: '' },                //Đặt vé
    bUBlockBks: { val: '2|5001|1', dtr: '' },              //Unblock BKS theo thời gian
    bEnStgTic: { val: '2|5002|1', dtr: '' },              //Cho phép đặt vé chặng
    bBook: { val: '1|5003|1', dtr: '' },                 //Đặt vé (B)
    bUpdate: { val: '1|5004|1', dtr: '' },                //Cập nhật vé (U)
    bQBook: { val: '2|5005|1', dtr: '' },                  //Đặt nhanh vé (P)
    bCancel: { val: '1|5006|1', dtr: '' },                //Hủy vé (C)
    bMove: { val: '1|5007|1', dtr: '' },                  //Di chuyển vé (M)
    bQPay: { val: '2|5024|1', dtr: '' },                          //Thanh toán nhanh (Q)
    bDpt: { val: '1|5009|1', dtr: '' },                   //Xuất bến
    bTK: { val: '1|5025|1', dtr: '' },                    //Xem thống kê
    bPPhoi: { val: '', dtr: '' },                 //In phơi
    bSPhoi: { val: '', dtr: '' },                 //Lưu phơi
    bEdtAtCphoi: { val: '2|5012|1', dtr: '' },                  //Chỉnh sửa sau khi chốt phơi
    bEdtOnlTic: { val: '2|5013|1', dtr: '' },    //Thay đổi vé đặt online
    bBookPastTk: { val: '2|5014|1', dtr: '' },            //Đặt vé trong quá khứ
    bBkAtDpt: { val: '2|5015|1', dtr: '' },               //Đặt vé sau khi xuất bến
    bClAtDpt: { val: '', dtr: '' },             //Hủy vé sau khi xuất bến
    bClAtPm: { val: '', dtr: '' },                //Hủy vé sau khi thanh toán
    bEdtInfPaidTk: { val: '2|5018|1', dtr: '' },          //Thay đổi thông tin vé đã thanh toán
    bEnBtnAtDpt: { val: '2|5019|1', dtr: '' },            //Mở khóa button sau khi xuất bến
    bAddMoreTk: { val: '1|5020|1', dtr: '' },           //Đặt thêm vé
    bPrtTk: { val: '1|5021|1', dtr: '' },                 //In vé
    bReturn: { val: '1|5022|1', dtr: '' },                //Khứ hồi
    bUBFrtStg: { val: '2|5023|1', dtr: '' },              //Unbock điểm đầu chặng (FromPoint)
    mgTrip: { val: '1|8000|1', dtr: '' },              //Điều hành xe
    codManager: { val: '', dtr: 'S8800' },                  // Xem Cod
    deaccount: { val: '1|1601|1', dtr: 'S16010' },                  // deactive account
    watchRoutes: { val: '1|10066|1', dtr: 'S100660' },
    tripDriver: { val: '1|10064|1', dtr: 'S100640' }, //So tai
    hbookingbyDate: { val: '1|10063|1', dtr: '' } // Req_Hide phơi/dữ liệu
}


var oRc = {
    Stage: '5|10069|1'
    //TODO: Search app.rights.indexOf, move code to here
}
var cachedDemoRights = {};
$.userArrRights = [];
$.compArrRights = [];

$.rightsAction = { //From 0 to 9 only
    0: 'hide',
    1: 'disabled'
};
///#source 1 1 /App/Core/aRights/p.js

$.vCacr = function (id, cb, scope) {
    /// <summary>
    /// Call a function after check rights
    /// </summary>
    /// <param name="id">Id of right to check</param>
    /// <param name="cb">Callback function</param>
    /// <param name="scope"></param>

    if (!id && cb) {
        cb.call(scope);
        return;
    }
    //console.log(id);
    var ok1 = true;
    var ok2 = true;
    for (var i = 0; i < $.userArrRights.length; i++) {
        if ($.userArrRights[i].id == id) {
            ok1 = $.userArrRights[i].status;
            break;
        }
    }

    for (var i = 0; i < $.compArrRights.length; i++) {
        if ($.compArrRights[i].id == id) {
            ok2 = $.compArrRights[i].status;
            break;
        }
    }
    if (ok1 && ok2) {
        cb.call();
    }

};

$.vPrpRgts = function (obj) {
    /// <summary>
    /// Prepare rights for object
    /// </summary>
    /// <param name="obj">Object</param>

    var arr = null;
    var dict = {};
    if (obj) {
        arr = obj.find('.rights');
    } else {
        arr = $('.rights');
    }
    $.each(arr, function (idx, val) {
        var length = val.dataset.rights.length;
        var type = val.dataset.rights.substring(0, 1); //TODO: For dynamic data
        var id = val.dataset.rights.substring(1, length - 1);
        var hideMode = val.dataset.rights.substring(length - 1, length);

        var cls = "R" + id;
        dict[id] = ["." + cls, $.rightsAction[hideMode]];
        $(this).addClass(cls);
        //$('[data-rights="' + val.dataset.rights + '"]').addClass(cls);
    });
    
    return dict;

};

$.vCheckRights = function (win) {
    var dict = $.vPrpRgts(win);
    $.vApplyRights(null, dict);
};

$.vCheckPopupRights = function (dialog) {
    var dict = $.vPrpRgts(dialog.find('.modal.fade'));
    $.vApplyRights(null, dict);
};

$.vApplyRights = function (rights, dict) {
    $.vApplyXRights($.userArrRights, rights, dict);
};

$.vApplyAllRights = function () {
    $.vApplyRights(app.rights);
    $.vApplyCompRights(app.compRights);
};

$.vApplyCompRights = function (rights, dict) {
    $.vApplyXRights($.compArrRights, rights, dict);
};

$.vApplyXRights = function (targetArr, rights, dict) {
    if (!dict) {
        dict = $.vPrpRgts();
    }

    if (rights && targetArr.length < 1) {
        var arr = rights.split('~');
        for (var i = 1; i < arr.length; i++) {
            var v = arr[i].split('|');
            targetArr.push({ type: v[0], id: v[1], status: v[2] == '1' ? true : false });
        }
    }

    for (var i = 0; i < targetArr.length; i++) {
        var r = targetArr[i];
        if (r.type == "1") $.vApplyStaticRights(dict, r.id, r.status);

    }
};

$.vApplyStaticRights = function (dict, id, status) {
    var cf = dict[id];
    if (cf) {
        var fx = cf[1];
        var selector = cf[0];
        if (fx && selector) {
            if (fx == "disabled") {
                //console.log('disabled', status);
                $(selector).prop('disabled', !status);
            } else if (fx == "hide") {

                if (status == "1") {
                    fx = 'show';
                    $(selector).removeClass('hidden');
                    $(selector).removeClass('hidden2');
                }
                else $(selector).addClass('hidden2');

                $(selector)[fx].call($(selector));

                //console.log(id, status, fx, $(selector));
            }
        }
    }
    //alert(1);
};

$.vCheckAndAppendOptions = function (obj, val, text, type, isPass, eAttr) {
    if (!isPass) {
        isPass = $.vCheckRightsBeforeAdd(type, val);

    }
    var eA = '';
    if (eAttr) {
        $.each(eAttr, function(k, v) {
            eA += k + '="' + v + '" ';
        });
    }
    //console.log('$.vCheckAndAppendOptions', val, text);
    if (isPass) obj.append('<option value="' + val + '" ' + eA + '>' + text + '</option>');
};

$.vCheckRightsBeforeAdd = function (type, val) {

    for (var i = 0; i < $.userArrRights.length; i++) {
        var r = $.userArrRights[i];
        //console.log(type, 'vs', r.type, ' > ', val, ' vs ', r.id);
        if (type == r.type) {
            if (val == r.id) {
                //console.log('$.$.vCheckRightsBeforeAdd', r);
                return r.status;
            }
        }
    }
    return true;
};

$.vLoadRightConfig = function (val, targetField) {
    if (cachedDemoRights[val]) {
        targetField.val(cachedDemoRights[val]);
        return;
    }
    vRqs({ _a: 'fGetRights', _c: { Code: val, Type: 1 }, _f: 'Info' }, function (u, r, l, t) {
        if (l != 1) return;
        var info = r[0][0];
        cachedDemoRights[val] = [info];
        targetField.val(cachedDemoRights[val]);
    });
};

///#source 1 1 /App/Core/Data/Ajax/o.js
var oRq = {
    iAc: false, // Is ajax calling, default is false
    cEl: null, //Current focus element
    cKey: null, //Current key
    cAType: 1, // Current action type: 1: default - 2: ajax request
    cLType: null, //Current lock type, 1: disable
    cRqs: [] // Current calling requests chứa các request đang gọi server
};
///#source 1 1 /App/Core/Data/Ajax/p.js
function vRqs(o, p, x) {
    /// <summary>
    /// Ajax request by system
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="function">Callback success function(u = r.Result, r = r.Records, l = r.Records.length, t = TotalRecordCount or Code, e: Message)</param>
    /// <param name="x" type="object">Advanced ajax config, override if exist</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    var c = {
        url: app.serviceUrl,
        type: 'POST',
        contentType: 'application/json; charset: utf-8',
        crossDomain: true,
        data: JSON.stringify({ obj: o }),
        headers: { "CompId": app.cid, "AgentId": app.aid, "UserId": app.uid, "UserName": app.un, "csrf": app.csrf }
    };
    if (x && typeof (x) == 'object') { $.each(x, function (k, v) { c[k] = v; }); }
    return $.ajax(c).done(function (r, s, j) { // data, textStatus, jqXHR
        r = r.hasOwnProperty('d') ? r.d : r;
        if (r.Result == 0 && r.Expired == 1) {
            alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.");
            window.location.href = "Logout.aspx";
            return;
        }
        if (r.Result == -10) {
            alert("Bạn đang truy vấn quá nhiều, vui lòng nghỉ trong giây lát.");
            window.location.href = "Logout.aspx";
            return;
        }
        var t = r.TotalRecordCount ? r.TotalRecordCount : 0;
        if (r.Code != null && r.Code != undefined) t = r.Code;
        if (p && typeof p === 'function') p.call(this, r.Result, r.Records, r.Records ? r.Records.length : 0, t, r.Message);
        if (!r.Result) console.log('> rq: ', r.Result, r.Message);

    }).fail(function (h, u, e) {//jqXHR, textStatus, errorThrown
        console.error(u, e);
    });
};

function vRqr(o, p) {
    /// <summary>
    /// Ajax request for report
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="function">Callback success function(Anything data, String textStatus, jqXHR jqXHR)</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    return $.ajax({
        type: "POST",
        url: app.reportBaseUrl,
        crossDomain: true,
        data: JSON.stringify({ obj: o }),
        success: p,
        error: function () {
            alert("Error!");
        }
    });
};

function vRql(o, p, me) {
    /// <summary>
    /// Request list
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="object">{a: begin callback function(u, r, l, t), m: model callback function (i = index, d = array data of fields), z: end callback function(u, r, l, t)}</param>
    /// <param name="me" type="object">Scope</param>
    /// <returns type="jqXHR">Ajax return object</returns>

    return vRqs(o, function (u, r, l, t) {
        if (p.a) p.a.call(me, u, r, l, t);
        if (p.m && u && l > 0 && r && r.length) for (var i = 0; i < l; i++) p.m.call(me, i, r[i]);
        if (p.z) p.z.call(me, u, r, l, t);
    }
    );
};

function vRqu(d, p) {
    /// <signature>
    /// <summary>Ajax request by user, prevent double request</summary>
    /// <param name="d" type="object">Ajax object.</param>
    /// <param name="p" type="function">Callback success function.</param>
    /// <returns type="jqXHR">Ajax return object or null</returns>
    /// </signature>
    var isStop = false;
    if (oRq.iAc && oRq.cAType == 2) {
        if (oRq.cRqs.indexOf(oRq.cKey) == -1) {
            oRq.cRqs.push(oRq.cKey);
            if (oRq.cEl.length > 0 && oRq.cLType > 0) {
                switch (oRq.cLType) {
                    case 1:
                        $(oRq.cEl).attr('disabled', true);
                        break;
                    default:
                        $(oRq.cEl).attr('disabled', true);
                        break;
                }
            }
        } else isStop = true;
    }
    if (!isStop) return vRqs(d, p);  //Load data from server using AJAX
    return null;
};

function vRqz() {
    /// <summary>
    /// End of vRqu function, enable elements or allow next request
    /// </summary>
    oRq.cRqs.pop(oRq.cKey);
    if (oRq.iAc && oRq.cAType == 2) {
        if (oRq.cEl.length > 0) {
            switch (oRq.cLType) {
                case 1: $(oRq.cEl).removeAttr('disabled'); break;
                default: $(oRq.cEl).removeAttr('disabled'); break;
            }
        }
    }
    oRq.iAc = false;
    oRq.cEl = null;
    oRq.cLType = null;
    oRq.cKey = null;
};

///
/// Extend service for the front-end database 
///

function eRqs(o, p, x) {
    /// <summary>
    /// Ajax request by system (Extend)
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="function">Callback success function(u = r.Result, r = r.Records, l = r.Records.length, t = TotalRecordCount or Code, e: Message)</param>
    /// <param name="x" type="object">Advanced ajax config, override if exist</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    var c = {
        url: app.serviceFrontUrl,
        type: 'POST',
        contentType: 'application/json; charset: utf-8',
        crossDomain: true,
        data: JSON.stringify({ objs: o }),
        headers: { "CompId": app.cid, "AgentId": app.aid, "UserId": app.uid, "UserName": app.un, "csrf": app.csrf }
    };
    //console.log(c);
    if (x && typeof (x) == 'object') { $.each(x, function (k, v) { c[k] = v; }); }
    return $.ajax(c).done(function (r, s, j) { // data, textStatus, jqXHR
        r = r.hasOwnProperty('d') ? r.d : r;
        var t = r.TotalRecordCount ? r.TotalRecordCount : 0;
        if (r.Code != null && r.Code != undefined) t = r.Code;
        if (p && typeof p === 'function') p.call(this, r.Result, r.Records, r.Records ? r.Records.length : 0, t, r.Message);
        if (!r.Result) console.log('> rq: ', r.Result, r.Message);
    }).fail(function (h, u, e) {//jqXHR, textStatus, errorThrown
        console.error(u, e);
    });
};

function eRql(o, p, me) {
    /// <summary>
    /// Request list
    /// </summary>
    /// <param name="o" type="object">Data object</param>
    /// <param name="p" type="object">{a: begin callback function(u, r, l, t), m: model callback function (i = index, d = array data of fields), z: end callback function(u, r, l, t)}</param>
    /// <param name="me" type="object">Scope</param>
    /// <returns type="jqXHR">Ajax return object</returns>
    return eRqs(o, function (u, r, l, t) {
        if (p.a) p.a.call(me, u, r, l, t);
        if (p.m && u && l > 0 && r && r.length) for (var i = 0; i < l; i++) p.m.call(me, i, r[i]);
        if (p.z) p.z.call(me, u, r, l, t);
    }
    );
};


///#source 1 1 /App/Core/Data/Enum/o.js
//Trip status
var oTrs = {
    waiting: 0,
    normal: 1,
    add: 2,
    cancel: 3,
    reactive: 1,
    unknow: 5
};

//Person Type
var oPst = {
    guide: 5,
    driver: 2,
    assistant: 4, //Lo xe
};

//XType cho cấu hình Bus_Tickets_Status
var oTkt = [
    { r: '', v: 'Chọn cấu hình' },
    { r: $.rights.mTicConf_hv.val, v: 'Hết vé' },
    { r: $.rights.mTicConf_onl.val, v: 'Bán vé online' },
    { r: '5|10103|1', v: 'Bán vé online không có sơ đồ ghế' },
    { r: $.rights.mTicConf_ofl.val, v: 'Bán vé offline' },
    { r: '5|10104|1', v: 'Cấu hình vé được bán online' },
    { r: '5|10105|1', v: 'Vé lễ tết' }
];

///#source 1 1 /App/Core/Data/Enum/p.js
function vGTrs() {
    /// <summary>
    /// Get trip status array
    /// </summary>
    var r = [];
    $.each(oTrs, function (n, v) { r.push({ Id: v, Name: vGTrds(v) }); });
    return r;
};

function vGTrds(s) {
    /// <summary>
    /// Get trip display status
    /// </summary>
    /// <param name="s">Status num value</param>
    if (s == oTrs.add) {
        return 'Tăng cường';
    }
    if (s == oTrs.cancel) {
        return 'Hủy';
    }
    if (s == oTrs.normal) {
        return 'Kích hoạt';
    }
    if (s == oTrs.waiting) {
        return 'Mặc định';
    }
    //if (s == oTrs.reactive) { return 'Phục hồi'; }
    return 'Không biết';
};

///#source 1 1 /App/Core/Data/Money/p.js
function vToMn(n) {
    /// <summary>
    /// To vietnamese money string, ex 90.000,00 auto add 000 if lenght less than 5
    /// </summary>
    /// <param name="n" type="String or Number">The input value, string or number</param>
    n = n == undefined ? this : n;
    return vToUStr(0, ',', '.', n);

    /* Format fare or money by thousand
    if (!n && n != 0) n = '';
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");*/
};

function vToNum(s) {
    /// <summary>
    /// Roll back money to int
    /// </summary>
    s = (s == undefined) ? this : s;
    return Number(s.replace(/[^0-9]+/g, ""));
};

function vToUStr(c, d, t, n) {
    /// <summary>
    /// To vietnamese money text, auto add 000 if less than 5
    /// </summary>
    /// <param name="c">90.000,00 => 00</param>
    /// <param name="d">90.000,00 => ,</param>
    /// <param name="t">90.000,00 => .</param>
    /// <param name="n">this or target number</param>
    n = n == undefined ? this : n;
    if (typeof (n) == 'string') n = parseInt(n);
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d == undefined ? "." : d;
    t = t == undefined ? "," : t;
    var s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


///#source 1 1 /App/Core/Data/Parse/p.js
function vGln(n) {
    /// <summary>
    /// Get lastname
    /// </summary>
    /// <param name="n">Full name</param>
    var r = ''; // get only last name
    if (n && n.length > 11) {
        var nameSplit = n.trim().split(' ');
        switch (nameSplit.length) {
            case 0:
                break;
            case 1:
                r = nameSplit[0];
                break;
            case 2:
                r = nameSplit[1];
                break;
            case 3:
                r = nameSplit[2];
                break;
            case 4:
                r = nameSplit[3];
                break;
            case 5:
                r = nameSplit[4];
                break;
        }
    } else r = n;
    return r;
};

function vGai(d) {
    /// <summary>
    /// Get area id
    /// </summary>
    /// <param name="d">Data</param>
    var idx = d.indexOf('~');
    var result = d.substr(idx + 1, d.length).split('|');
    return result[0];
};

function vGsn(s) {
    /// <summary>
    /// Get seat number (lấy thông tin tổng số ghế dựa vào thông tin sơ đồ ghế)
    /// </summary>
    /// <param name="s"></param>
    var s1 = s.split('~');
    var s2 = s1[1].split('|');
    return parseInt(s2[2]);
};

function vGfa(s) {
    /// <summary>
    /// Get fare
    /// </summary>
    /// <param name="d">Fare info</param>
    var r = s.split('|');
    return vToMn(r[2]);
};

function vGpp(s, f) {
    /// <summary>
    /// Get Seat Price Property
    /// </summary>
    /// <param name="s">Fare Info</param>
    /// <param name="f">Field name</param>
    var format = 'Version|Price~[FromRouteStopIndex|ToRouteStopIndex|Price|Unit|ConditionType|ConditionInfo~FromRouteStopIndex|ToRouteStopIndex|Price|Unit|ConditionType|ConditionInfo]';
    var lv1 = format.split('~'); var dataLv1 = s.split('~');
    //console.log(dataLv1);
    if (f == 'Price') {
        var arr = lv1[0].split('|'); var dataArr = dataLv1[0].split('|'); var idx = _.indexOf(arr, f);
        return vToMn(dataArr[idx]);
        //return dataArr[idx];
    }
    return '';
};

function vGtp(s, field) {
    /// <summary>
    /// Get (seat) template property
    /// </summary>
    /// <param name="s"></param>
    /// <param name="field"></param>
    if (!s) return "";
    var format = 'Id~Version|TotalFloors|TotalSeats|Type|Code|Name|Note|CSS';
    var lv1 = format.split('~'); var dataLv1 = s.split('~');
    if (field == 'Id') { if (!dataLv1) return ''; return parseInt(dataLv1[0]); }
    var arr = lv1[1].split('|'); var idx = _.indexOf(arr, field); var dataLv2 = dataLv1[1].split('|');
    return dataLv2[idx];
};

function vGvs(i, t, l, n) {
    /// <summary>
    /// Get vehicle save value
    /// </summary>
    /// <param name="i">Id</param>
    /// <param name="t">Type</param>
    /// <param name="l">License plate</param>
    /// <param name="n">Vehicle type name</param>
    return app.mvs + '~' + i + '|' + t + '|' + l + '|' + n;
};

function vGvp(s, n) {
    /// <summary>
    /// Get vehicle property
    /// </summary>
    /// <param name="s">Vehicle info</param>
    /// <param name="n">Name</param>
    if (!s) return '';
    var arr1 = s.split('~');
    if (arr1 && arr1.length > 1) {
        var arr2 = arr1[1].split('|');
        if (arr2 && arr1.length > 1) {
            if (n == 'LicensePlate') return arr2[2];
            if (n == 'Type') return arr2[1];
            if (n == 'Id') return arr2[0];
        }
    }
    return s;
};

function vGas(s) {
    /// <summary>
    /// Get areas array
    /// </summary>
    /// <param name="s">Area info</param>
    var areas = [];
    if (s && s.length > 0) {
        var n = s.indexOf("~");
        if (n >= 0) {
            s = s.substring(n + 1);
            var routes = s.split('~');
            var id;
            $.each(routes, function(index, value) {
                id = vGdi(value, '|', 0);
                areas.push({ Id: id, Name: vGdi(value, '|', 3) });
            });
        }
    }
    return areas;
};

function vGfs(a, s) {
    /// <summary>
    /// Get fares
    /// </summary>
    /// <param name="a">Areas</param>
    /// <param name="s">Info</param>

    var r = []; //Fares
    if (s && s.length > 0) {
        var m = s.indexOf("~");
        if (m >= 0) {
            s = s.substring(m + 1);
            if (s && s.length > 0) {
                var arr = s.split('~');
                var row, from, to, fare, code;
                $.each(arr, function(i, val) {
                    from = vGdi(val, "|", 0);
                    to = vGdi(val, "|", 1);
                    fare = vGdi(val, "|", 2);
                    code = from + '|' + to;
                    row = {
                        Code: code,
                        FromArea: vGetObj({ Id: from }, a),
                        ToArea: vGetObj({ Id: to }, a),
                        Fare: fare
                    };
                    if (row.FromArea && row.ToArea) {
                        r.push(row);
                    }
                });
            }
        }
    }
    return r;
};

function vGpps(s) {
    if (s == null) return [];
    var m = s.indexOf("~");
    var r = []; //Fares
    if (m >= 0) {
        s = s.substring(m + 1);
        var arr = s.split('~');
        var row, from, to, pickedPoint, code;
        $.each(arr, function (i, val) {
            //from = vGdi(val, "|", 0);
            //to = vGdi(val, "|", 1);
            
            //Address: "Chợ Bến Thành"
            //Index: "2"
            //Nearby: "Chợ Bến Thanh"
            //PickedPoint: "Bến Thành"
            //PointId: 2
            //TimePoint: "40"

            //pickedPoint = vGdi(val, "|", 0);
            //1|Hàng Xanh|20|1|100 Điện Biên Phủ|Ngã tư Hàng Xanh|1||
            row = {
                PointId: vGdi(val, "|", 0),
                PointName: vGdi(val, "|", 1),
                PointTime: vGdi(val, "|", 2),
                PointIndex: vGdi(val, "|", 3),
                PointAddress: vGdi(val, "|", 4),
                PointNearBy: vGdi(val, "|", 5),
                PointLocaltionId: vGdi(val, "|", 6)
            };
            
            r.push(row);
        });
    }
    return r;
};

function vGmi(d, m) {
    /// <summary>
    /// Get manufature info => Định dạng lại thông tin nhà sản xuất để lưu xuống db
    /// </summary>
    /// <param name="d">Date</param>
    /// <param name="m">Manufacture</param>
    var r = ''; m = m.trim();
    if (d.trim() == '' || d.length == 0) {
        if (m != '' || m.length > 0) r = '|' + m;
    } else { // kiểm tra ngày sản xuất có đúng định dạng không xx-xx-xxxx
        switch (d.length) {
            case 10:
                if (m != '' || m.length > 0) r = d + '|' + m; else r = d + '|';
                break;
            case 7:
                if (m != '' || m.length > 0) r = '00-' + d + '|' + m; else r = '00-' + d + '|';
                break;
            case 4:
                if (m != '' || m.length > 0) r = '00-00-' + d + '|' + m; else r = '00-00-' + d + '|';
                break;
        }
    }
    return r;
};

function vGma(s) {
    /// <summary>
    /// Get formated manufacture info array => // định dạng lại thông tin ManufactureInfo
    /// </summary>
    /// <param name="s">Manufacture info</param>
    if (vIsEstStr(s) && s != '') {
        var ym = '', nm = '';
        var ar = s.split('|');
        // vị trí thứ nhất trong mảng là năm sản xuất
        // luôn có định dạng xx-xx-xxxx
        // có thể chỉ tồn tại mỗi năm, các thông số còn lại là 00
        if (ar[0].length == 10) {
            var ys = ar[0].split('-');
            if (ys[0] == '00') {
                if (ys[1] == '00') {
                    ym = ys[2];
                    nm = ar[1].trim();
                } else {
                    ym = ys[1] + '-' + ys[2];
                    nm = ar[1].trim();
                }
            } else {
                ym = ar[0];
                nm = ar[1].trim();
            }
        } else {
            ym = '';
            nm = ar[1].trim();
        }
    } else {
        ym = '';
        nm = '';
    }
    return [ym, nm];
};

function vGtmp(s, t, b) {
    /// <summary>
    /// Get team property
    /// </summary>
    /// <param name="s">Team Info</param>
    /// <param name="t">Person Type</param>
    /// <param name="b">Is Id</param>
    if (!s) return ''; var arr = s.split('~'); var r = '';
    for (var i = 1; i < arr.length; i++) {
        var item = arr[i]; var subArr = item.split('|'); var pType = subArr[0];
        if ((pType + '') == (t + '')) { if (b) r += ', ' + subArr[1]; else r += ', ' + subArr[2]; }
    }
    return r.substring(2);
};

function vGvl(s, p, i) {
    /// <summary>
    /// Get value from string
    /// </summary>
    /// <param name="s">String</param>
    /// <param name="p">Sep</param>
    /// <param name="i">Index</param>
    if (!s) return "";
    var vals = s.split(p);
    if (vals == null || i >= vals.length) return "";
    return vals[i];
};

function vGvo(s, r, i) {
    /// <summary>
    /// Get value from info
    /// </summary>
    /// <param name="s">Info</param>
    /// <param name="r">Row index</param>
    /// <param name="i">Index</param>
    if (s == null) return "";
    var rows = s.split("~");
    if (rows == null || rows.length == 0) return "";
    var row = rows[r];
    var field = row.split("|");
    return field[i];
};

function vGpi(t, i, n, p) {
    /// <summary>
    /// Get person info
    /// </summary>
    /// <param name="t">type</param>
    /// <param name="i">id</param>
    /// <param name="n">name</param>
    /// <param name="p">phone</param>
    if (!n && !p) return '';
    return t + "|" + i + "|" + n + "|" + p;;
};

function vGdi(s, p, i) {
    /// <summary>
    /// Get data from info
    /// </summary>
    /// <param name="s">Value</param>
    /// <param name="p">Separator</param>
    /// <param name="i">Index</param>
    if (!s) return '';
    var arr = s.split(p);
    if (i >= arr.length) {
        return '';
    }
    return arr[i];
};
///#source 1 1 /App/Core/Data/Validate/p.js
function vIsNumKey(e) {
    /// <summary>
    /// Is Number Key
    /// </summary>
    /// <param name="e">Event</param>
    var cc = (e.which) ? e.which : e.keyCode;
    return ((cc >= 48 && cc <= 57) || (cc >= 96 && cc <= 105));
};

function vIsPhone(s) {
    /// <summary>
    /// Is Real phone, created by Duy - 2014.09.22 => validate phone number is real
    /// </summary>
    /// <param name="s">Input string</param>

    s = this == window ? s : this;
    var strLength = s.trim().length;
    // checking length of input string
    if (strLength == 10) {
        var firstNum1 = s.substr(0, 3);
        if (typeof _dict._pnp["10"] != "undefined" && _dict._pnp["10"].indexOf(firstNum1) != -1) {
            return true;
        } else if (typeof _dict._epnp != "undefined" && typeof _dict._epnp["10"] != "undefined") {
            if (_dict._epnp["10"].indexOf(firstNum1) != -1) {
                return true;
            } else {
                for (var i = 0; i < _dict._epnp["10"].length; i++) {
                    if (_dict._epnp["10"][i].length == 2 && firstNum1.substring(0, 2) == _dict._epnp["10"][i]) {
                        return true;
                    }
                }
            }
        }
        else {
            return false;
        }
    } else if (strLength == 11) {
        var firstNum2 = s.substr(0, 4);
        if (_dict._pnp["11"].indexOf(firstNum2) != -1) {
            return true;
        } else if (typeof _dict._epnp != "undefined" && typeof _dict._epnp["11"] != "undefined" && _dict._epnp["11"].indexOf(firstNum2) != -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

function vIsPNum(s) {
    /// <summary>
    /// Check phone number
    /// </summary>
    /// <param name="s">The input string</param>
    return s.match(/[^0-9.+()\-\s]/g) == null;
};

function vIsCurrency(s) {
    /// <summary>
    /// Check currency
    /// </summary>
    /// <param name="s">The input string</param>
    var regex = /^[1-9]\d*(?:\.\d{0,2})?$/;
    return regex.test(s);
};

function vIsPwd(i) {
    /// <summary>
    /// Check password (kiểm tra tính hợp lệ của mật khẩu mới khi đổi mật khẩu)
    /// </summary>
    /// <param name="i"></param>
    var r = true; i = i.trim();
    var c = /\d/; // mật khẩu phải vừa có chữ và số, và phải lớn hơn 6 kí tự
    if (i.length >= 6 && i.length != '') { // kiểm tra chuỗi input có phải toàn là số không
        if (isNaN(i)) { // kiểm tra chuỗi input phải có ít nhất 1 kí tự số
            if (!c.test(i)) r = false;
        } else r = false;
    } else r = false;
    return r;
};

function vIsVehiNum(s) {
    /// <summary>
    /// Check vehicle number (Kiểm tra biển số xe nhập vào có các ký tự đặc biệt không)
    /// </summary>
    /// <param name="str"></param>
    var c1 = /[^a-zA-Z0-9|.|\-|\s|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ]/g;
    var c2 = /[^0-9|.]/g;
    var c3 = /[^\d]/g;
    if (s.toLowerCase().match(c1) == null) {
        // kiểm tra biển số xe có kí tự '-' không
        if (s.toLowerCase().indexOf('-') != -1) {
            var split1 = s.split('-');
            // kiểm tra đuôi biển số có phải là 5 số hay không
            // nếu là 5 số thì sẽ có kí tự '.' và độ dài là 6
            // nếu là 4 số thì sẽ không có kí tự '.' và độ dài là 4
            // VD: 51A-1234 hoặc 51A-123.45
            if (split1[1].length == 6 || split1[1].length == 4) {
                switch (split1[1].length) {
                    case 6:
                        if (split1[1].indexOf('.') != -1) {
                            return split1[1].match(c2) == null;
                        } else return false;
                    case 4:
                        return split1[1].match(c3) == null;
                }
            } else return false;
        } else return false;
    } else return false;
    return false;
};
///#source 1 1 /App/Core/Html/Css/p.js
function vLCss(url) {
    /// <summary>
    /// Load css
    /// </summary>
    /// <param name="url">The css url / href</param>
    $('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', url);
};

function vLJS(url, cb) {
    $.getScript(url)
    .done(function (script, textStatus) {
            cb.call();
        })
    .fail(function (jqxhr, settings, exception) {
       // $("div.log").text("Triggered ajaxError handler.");
    });
};

function setAnimation($element, animationName, time) {
    /// <summary>set animation to element</summary>
    /// <param name="$element" type="string">selector to be set animation</param>
    /// <param name="animationName" type="string">name of animation on css</param>
    /// <param name="time" type="string">time of animation</param>
    $element.css('-webkit-animation', animationName + ' ' + time + ' ease-in-out').css('animation', animationName + ' ' + time + ' ease-in-out');
    $element.css('-webkit-animation-fill-mode', 'forwards').css('animation-fill-mode', 'forwards');
    return $element;
};

function setVisibleToElement($element, isVisible, speed) {
    /// <summary>show or hide element base on condition</summary>
    /// <param name="$element" type="string">selector to be set</param>
    /// <param name="isVisible" type="bool">condition</param>
    /// <param name="speed" type="string">speed of animation</param>
    isVisible ? $element.show(speed) : $element.hide(speed);
    return $element;
}

function setEnableToElement($element, isEnabled) {
    /// <summary>enable or disable element base on condition</summary>
    /// <param name="$element" type="string">selector to be set</param>
    /// <param name="isVisible" type="bool">condition</param>
    isEnabled ? $element.removeClass("disabled") : $element.addClass("disabled");
    return $element;
}
///#source 1 1 /App/Core/Html/form/o.js
$.datepicker.regional.vi = {
    closeText: "\u0110\u00f3ng",
    prevText: "&#x3c;Tr\u01b0\u1edbc",
    nextText: "Ti\u1ebfp&#x3e;",
    currentText: "H\u00f4m nay",
    monthNames: "Th\u00e1ng M\u1ed9t;Th\u00e1ng Hai;Th\u00e1ng Ba;Th\u00e1ng T\u01b0;Th\u00e1ng N\u0103m;Th\u00e1ng S\u00e1u;Th\u00e1ng B\u1ea3y;Th\u00e1ng T\u00e1m;Th\u00e1ng Ch\u00edn;Th\u00e1ng M\u01b0\u1eddi;Th\u00e1ng M\u01b0\u1eddi M\u1ed9t;Th\u00e1ng M\u01b0\u1eddi Hai".split(";"),
    monthNamesShort: "Th\u00e1ng 1;Th\u00e1ng 2;Th\u00e1ng 3;Th\u00e1ng 4;Th\u00e1ng 5;Th\u00e1ng 6;Th\u00e1ng 7;Th\u00e1ng 8;Th\u00e1ng 9;Th\u00e1ng 10;Th\u00e1ng 11;Th\u00e1ng 12".split(";"),
    dayNames: "Ch\u1ee7 Nh\u1eadt;Th\u1ee9 Hai;Th\u1ee9 Ba;Th\u1ee9 T\u01b0;Th\u1ee9 N\u0103m;Th\u1ee9 S\u00e1u;Th\u1ee9 B\u1ea3y".split(";"),
    dayNamesShort: "CN T2 T3 T4 T5 T6 T7".split(" "),
    dayNamesMin: "CN T2 T3 T4 T5 T6 T7".split(" "),
    weekHeader: "Tu", dateFormat: "dd-mm-yy",
    firstDay: 0, isRTL: !1,
    showMonthAfterYear: !1,
    yearSuffix: ""
};
///#source 1 1 /App/Core/Html/form/p.js
$.datepicker.setDefaults($.datepicker.regional.vi);


///#source 1 1 /App/Core/Html/table/p.js
function getMasterCellFormat(v) {
    return "<span class='vMasterRow'>" + v + "</span>";
}

(function ($) {
    $.extend(true, $.hik.jtable.prototype, {
        _ajax: function (options) {
            var self = this;
            var opts = $.extend({}, this.options.ajaxSettings, options);
            if (!opts.url) {
                return;
            }
            if (opts.data == null || opts.data == undefined) {
                opts.data = {};
            } else if (typeof opts.data == 'string') {
                opts.data = self._convertQueryStringToObject(opts.data);
            }

            var qmIndex = opts.url.indexOf('?');
            if (qmIndex > -1) {
                $.extend(opts.data, self._convertQueryStringToObject(opts.url.substring(qmIndex + 1)));
            }

            opts.data = JSON.stringify(opts.data);
            opts.contentType = 'application/json; charset=utf-8';

            //Override success
            opts.success = function (data) {
                data = self._normalizeJSONReturnData(data);
                if (options.success) {
                    options.success(data);
                }
            };

            //Override error
            opts.error = function () {
                if (options.error) {
                    options.error();
                }
            };

            //Override complete
            opts.complete = function () {
                if (options.complete) {
                    options.complete();
                }
            };

            $.ajax(opts);
        },

        _addPagingInfoToUrl: function (url, pageNumber) {
            if (!this.options.paging) {
                return url;
            }
            var jtStartIndex = (pageNumber - 1) * this.options.pageSize;
            var jtPageSize = this.options.pageSize;

            return url == null ? null : (url + (url.indexOf('?') < 0 ? '?' : '&') + 'jtStartIndex=' + jtStartIndex + '&jtPageSize=' + jtPageSize);
        },

        addLocalRecords: function (cb) {
            var me = this;
            me.options.actions.listAction = cb;
            me._reloadTable();
            //this._addRecordsToTable(records);
        },

        removeAllRows: function () {
            this._removeAllRows('reload');
        },

        getTotalRow: function () {
            var totalRowCount = this._$tableRows.length;
            return totalRowCount;
        },

        //TODO: Check?
        _createFieldAndColumnList: function () {
            var self = this;
            // self._columnList = ['Name', 'Date', 'Time', 'SeatTemplateInfo', 'FareInfo', 'Driver', 'Note'];
            var sortableList = [];

            $.each(self.options.fields, function (name, props) {
                //Add field to the field list
                self._fieldList.push(name);

                //Check if this field is the key field
                if (props.key == true) {
                    self._keyField = name;
                }

                //Add field to column list if it is shown in the table
                if (props.list != false && props.type != 'hidden') {
                    //console.log(name);
                    // self._columnList.push(name);
                    sortableList.push({ idx: props.idx, name: name });
                }

            });

            sortableList.sort(function (a, b) {
                var a1 = a.idx, b1 = b.idx;
                if (a1 == b1) return 0;
                return a1 > b1 ? 1 : -1;
            });

            $.each(sortableList, function (name, props) {
                self._columnList.push(props.name);
            });

            // console.log(sortableList);
        },

        //TODO: Remove?
        reloadOverwrite: function (postDate) {
            this._lastPostData = postDate;
            this._currentPageNo = ($('.jtable-goto-page select').val() == '' || $('.jtable-goto-page select').val() == null) ? 1 : parseInt($('.jtable-goto-page select').val());
            this._reloadTable();
        },

        //TODO: Search
        //--------------------------------------------
        //-----Overwrite---------------------
        addLocalRecord1: function (cb) {
            var me = this;
            var lA = me.options.actions.listAction;
            me.options.actions.listAction = cb;
            //this._addRecordsToTable(records);
            var completeReload = function (data) {
                me._hideBusy();
                //Show the error message if server returns error
                // Overwrite if (data.Result != 'OK') {
                if (!data.Result) {
                    me._showError(data.Message);
                    return;
                }

                //Re-generate table rows
                me._removeAllRows('reloading');
                me._addRecordsToTable(data.Records);

                me._onRecordsLoaded(data);
                me._currentPageNo = data.page;
                //me._$gotoPageArea.find('select').val(data.page);
            };

            me._showBusy(me.options.messages.loadingMessage, me.options.loadingAnimationDelay); //Disable table since it's busy
            me._onLoadingRecords();

            //listAction may be a function, check if it is
            //Execute the function
            var funcResult = me.options.actions.listAction(me._lastPostData, me._createJtParamsForLoading());

            //Check if result is a jQuery Deferred object
            if (me._isDeferredObject(funcResult)) {
                funcResult.done(function (data) {
                    completeReload(data);
                }).fail(function () {
                    me._showError(me.options.messages.serverCommunicationError);
                }).always(function () {
                    me._hideBusy();
                });
            } else { //assume it's the data we're loading
                completeReload(funcResult);
            }
            me.options.actions.listAction = lA;
        },

        applyPaging: function (data) {
            this._onRecordsLoaded(data);
        },

        deselectRows: function (rows) {
            if (rows)
                this._deselectRows(rows);
        },

        //Todo: Check
        _createFirstAndPreviousPageButtons: function () {
            var $first = $('<span></span>')
                .addClass('jtable-page-number-first')
                .html('<i class="glyphicon glyphicon-fast-backward"></i>')

                .data('pageNumber', 1)
                .appendTo(this._$pagingListArea);

            var $previous = $('<span></span>')
                .addClass('jtable-page-number-previous')
                .html('<i class="glyphicon glyphicon-backward"></i>')

                .data('pageNumber', this._currentPageNo - 1)
                .appendTo(this._$pagingListArea);

            this._jqueryuiThemeAddClass($first, 'ui-button ui-state-default', 'ui-state-hover');
            this._jqueryuiThemeAddClass($previous, 'ui-button ui-state-default', 'ui-state-hover');

            if (this._currentPageNo <= 1) {
                $first.addClass('jtable-page-number-disabled');
                $previous.addClass('jtable-page-number-disabled');
                this._jqueryuiThemeAddClass($first, 'ui-state-disabled');
                this._jqueryuiThemeAddClass($previous, 'ui-state-disabled');
            }
        },

        //Todo: Check

        _createLastAndNextPageButtons: function (pageCount) {
            var $next = $('<span></span>')
                .addClass('jtable-page-number-next')
                .html('<i class="glyphicon glyphicon-forward"></i>')

                .data('pageNumber', this._currentPageNo + 1)
                .appendTo(this._$pagingListArea);
            var $last = $('<span></span>')
                .addClass('jtable-page-number-last')
                .html('<i class="glyphicon glyphicon-fast-forward"></i>')

                .data('pageNumber', pageCount)
                .appendTo(this._$pagingListArea);

            this._jqueryuiThemeAddClass($next, 'ui-button ui-state-default', 'ui-state-hover');
            this._jqueryuiThemeAddClass($last, 'ui-button ui-state-default', 'ui-state-hover');

            if (this._currentPageNo >= pageCount) {
                $next.addClass('jtable-page-number-disabled');
                $last.addClass('jtable-page-number-disabled');
                this._jqueryuiThemeAddClass($next, 'ui-state-disabled');
                this._jqueryuiThemeAddClass($last, 'ui-state-disabled');
            }
        },

        //Override
        _reloadTable: function (completeCallback) {
            var self = this;

            var completeReload = function (data) {
                self._hideBusy();
                //Show the error message if server returns error
                if (!data.Result) {
                    self._showError(data.Message);
                    return;
                }

                //Re-generate table rows
                self._removeAllRows('reloading');
                self._addRecordsToTable(data.Records);

                self._onRecordsLoaded(data);
                //console.log(data);
                //Call complete callback
                if (completeCallback) {
                    completeCallback(data); //Note: Override
                }
            };

            self._showBusy(self.options.messages.loadingMessage, self.options.loadingAnimationDelay); //Disable table since it's busy
            self._onLoadingRecords();

            //listAction may be a function, check if it is
            if ($.isFunction(self.options.actions.listAction)) {
                //Execute the function
                var funcResult = self.options.actions.listAction(self._lastPostData, self._createJtParamsForLoading());

                //Check if result is a jQuery Deferred object
                if (self._isDeferredObject(funcResult)) {
                    funcResult.done(function (data) {
                        completeReload(data);
                    }).fail(function () {
                        self._showError(self.options.messages.serverCommunicationError);
                    }).always(function () {
                        self._hideBusy();
                    });
                } else { //assume it's the data we're loading
                    completeReload(funcResult);
                }

            } else { //assume listAction as URL string.

                //Generate URL (with query string parameters) to load records
                var loadUrl = self._createRecordLoadUrl();

                //Load data from server using AJAX
                self._ajax({
                    url: loadUrl,
                    data: self._lastPostData,
                    success: function (data) {
                        completeReload(data);
                    },
                    error: function () {
                        self._hideBusy();
                        self._showError(self.options.messages.serverCommunicationError);
                    }
                });

            }
        },

    });
})(jQuery);


///#source 1 1 /App/Core/Html/Template/p.js
function vtpl(s, d) {
    /// <summary>
    /// Get html from tempalte (nano)
    /// </summary>
    /// <param name="s">Template string</param>
    /// <param name="d">Data object</param>
    return s.replace(/\{([\w\.]*)\}/g, function (str, key) {
        var keys = key.split("."), v = d[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
};

function vChIco(x, ref, html) {
    if (x.hasSearchIco) return;
    x.hasSearchIco = true;
    if (ref)
        ref = ref + " ";
    else
        ref = "";
    ref = ref + ".chosen-choices li.search-field input";
    if (!html) html = '<i class="glyphicon glyphicon-search"></i>';
    $(html).insertBefore(ref);
    $(ref).val(x.emptyName);
    //emptyName
    //$(x.ref).trigger("chosen:updated");
};

function vUChIco(x, ref, html) {
    if (!x.hasSearchIco) return;
    x.hasSearchIco = false;
    if (ref)
        ref = ref + " ";
    else
        ref = "";
    ref = ref + "ul.chosen-choices li.search-field";
    //var backHtml = $(ref).html().replace('<i class="glyphicon glyphicon-search"></i>', '');
    //$(backHtml).attr('value', '');
    //$(ref + ' input').attr('value', '');
    $(ref).html('<input type="text" value="" class="default" autocomplete="on" style="width: 100%;">');
    
};

///#source 1 1 /App/Core/Mgmt/o.js
var vv = {

    _table: {
        url: "",
        fields: {},
        multiselect: false,
        paging: true,
        pageSize: 10,
        sorting: true,
        selecting: true,
        selectingCheckboxes: true
    },

    _toolTipCls: ['form-group', 'form-group mb8'],

    _isCbb: function (x) {
        var me = this;
        return ((x.cbb || x.options) && !me.isChosen(x));
    },

    _isRemoteData: function (x) {
        return (x.options.length == 0 && x.listConfig);
    },

    _gSelect: function (o, rs) {
        var arr = []; rs.each(function (idx) { var record = $(this).data('record'); arr.push(record); });
        var e = jQuery.Event("gSelect"); e.rs = arr; o.view.trigger(e);
    },

    _gDeselect: function (o) {
        var me = this;
        var x = jQuery.Event("gUnSelect");
        o.view.trigger(x); if (o.autoClear) me.clearFormAndGrid(o.view);
    },

    _getX: function (x) {
        if (x.x && typeof (x.x) == 'string') {
            var fx = $['x' + $.trim(x.x)];
            if (typeof (fx) == 'function') return fx.call(this, x);
            return x;
        }
        return x;
    },

    _getWinBody: function (o, xx) {
        var me = this;
        var rows = '', cells = '', firstCells = ''; xx.sort(function (a, b) { var a1 = a.fIdx ? a.fIdx : 100, b1 = b.fIdx ? b.fIdx : 100; if (a1 == b1) return 0; return a1 > b1 ? 1 : -1; });
        var l = xx.length, c = 0;
        for (var i = 0; i < xx.length; i++) {
            var x = xx[i];
            x = me._getX(x);
            if (parseInt(app.cid) == 95) {
                if (x.name == "Assistant") {
                    x.form = false;
                    x.grid = false;
                }
                if (x.name == "Guide") {
                    x.form = true;
                    x.grid = true;
                    x.fIdx = 8;
                    x.gIdx = 6;
                }
            }
            if (!_dict._hasDriverTrip) {
                if (x.name == "Description") {
                    x.form = false;
                    x.grid = false;
                    x.noSave = true;
                    x.gQuery = false;
                }
            }
            if (!x.flex) x.flex = 1; if (x.form) c += x.flex; if (x.data) gDx(o).push(x); if (x.grid && o.table && !o.table.hidden) me._applyGridConfigs(o, x);
            me._applyXConfigs(x, o);
            if (x.items && x.xtype) {
                var body = me._getWinBody(o, x.items);
                x.html = body;
                rows += $.html(x.xtype, x);
            } else if (x.xtype && x.form) {
                cells += $.html(x.xtype, x);
                firstCells = cells;
                //console.log('---cels: ', c, o.cols, l - 1);
                if (c == o.cols || i == l - 1) {
                    //console.log('---i: ', l - 1);
                    if (!x.notInRow) cells = me._getFormRow(cells, o.xRowCls); rows += cells; cells = ''; c = 0;
                }
            }
        }
        if (!rows) rows = firstCells;
        //console.log('---', rows);
        return rows;
    },

    _getFormRow: function (val, cls) {
        if (!cls) cls = ''; return '<div class="row ' + cls + '">' + val + '</div>';
    },

    _applyGridConfigs: function (o, x) {
        if (x.grid) {
            if (x.gIdx == undefined) x.gIdx = 100;
            var gdis = x.gDis;
            if (typeof x.gDis == 'string') gdis = o.p[x.gDis];
            o.table['fields'][x.name] = {
                name: x.name, title: (x.glbl ? x.glbl : x.label),
                key: (x.dType == 1), list: !x.gHide, cf: x, type: x.gType,
                displayFormat: x.displayFormat, display: gdis, idx: x.gIdx, width: x.gWidth,
                listClass: x.gCls, sorting: true
            };
        }
    },

    _applyXConfigs: function (x, o) {

        if (!x.form) return;
        if (!x.flex) x.flex = 1;
        x.colCls = "col-md-" + ((12 / o.cols) * x.flex);
        if (o.useSmCls) x.smCls = "col-sm-" + ((12 / o.cols) * x.flex);
        if (x.required && x.requiredCls) x.cls = x.cls + " " + x.requiredCls;
    },

    _applyXSearch: function (o, x) {
        x.options = [];
        $.each(gDx(o), function (idx, f) {
            if (f.xSearch) {
                f['Id'] = idx;
                f['Name'] = f.label;
                if (f.xSearchAlways) f['Disabled'] = f.xSearchAlways;
                x.options.push(f);
            }
        });
    },

    _getWinBtn: function (o, buttons) {
        var me = this; var html = "";
        for (var i = 0; i < buttons.length; i++) {
            var x = buttons[i]; var colCls = "col-md-" + x.colspan;
            x.colCls = colCls;
            if (x.xSearch) { me._applyXSearch(o, x); }
            if (x.sbf) $.sbf = x; else if (x.chosen) me.pushChosen(o, x);
            html += $.html(x.xtype, x);
        }

        return html;
    },

    _getWinHeader: function (data) {
        return $.html('winHeaderTpl01', data);
    },

    _applyChose: function (o, x) {
        //if (x.xtype == 'xchosensingle' && x.allowEmpty) {
        //    var defaultO = {
        //        Id: null,
        //        LicensePlate: "Chọn",
        //        Type: null,
        //        VehicleTypeName: null
        //    }
        //    //x.options = [defaultO].concat(x.options);
        //}
        var cRef = "#" + o.id + " " + x.zRef;
        x.chosen.search_contains = true;
        $(x.ref).chosen(x.chosen).on('change', function (e, a) {
            x.e = e; x.a = a; o.vm.onChosenChange(x);
            if ($.isEmptyObject(x.vals)) {
                if (x.zRef && x.searchIcon) vChIco(x, cRef);
            } else {
                if (x.zRef && x.searchIcon) vUChIco(x, cRef);
            }

        });
        if (x.zRef && x.searchIcon) vChIco(x, cRef);
    },

    //#region load

    initView: function (o) {
        var ref = o.c[2];
        if ((typeof ref == 'string') && ref) {
            o.view = $(ref);
        } else {
            o.view = $('.dialog-config');
        }
        o.view.unbind();
    },

    initArrs: function (o) {
        sDx(o);
    },

    initObjs: function (o) {
        //o['buttons'] = [];
        o['chosen'] = {};
        o['datepicker'] = {};
    },

    initGrid: function (o) {
        var me = this;
        if (!o.grid || o.gHide) return;
        o.table = vCloneObj(me._table); if (o.gFields) o.table.fields = o.gFields; else o.table.fields = {};
        if (o.pageSize) o.table.pageSize = o.pageSize;
        if (o.gHideCb) o.table['selectingCheckboxes'] = false;
        o.view.trigger('gSelect', null);
        o.table.selectionChanged = function () { var rs = $('#' + o.gId).jtable('selectedRows'); if (rs.length > 0) me._gSelect(o, rs); else me._gDeselect(o); };
    },

    initForm: function (o) {
        var me = this;
        var winCls = o.winCls;
        if (!winCls) winCls = "";
        var xWidth = ''; if (o.xWidth) { xWidth = '-' + o.xWidth; };
        var body = me._getWinBody(o, o.items); //Must before sbf
        var childId = o.childId; if (!childId) childId = '';
        o['buttons'] = _.where(o.buttons, { form: true });
        var c = {
            id: o.id,
            winCls: winCls, xWidth: xWidth,
            header: me._getWinHeader({ title: o.title }),
            buttons: me._getWinBtn(o, o['buttons']),
            body: $.html('winMsgTpl01', {}) + body,
            childId: childId,
            gRights: o.gRights,
            gSubtitle: o.gSubTitle,
            gTitle: o.gTitle,
            gId: o.gId,
        };
        var ref = o.c[2];
        if ((typeof ref == 'string') && ref) {
            o.view.html($.html(o.tpl ? o.tpl : 'mainContentTpl', c, true));
        } else {
            o.view.html($.html(o.tpl ? o.tpl : 'winTpl', c, true));
        }

    },

    addViewModel: function (o) {
        o.vm = new Vm(o);
        o.vm.load();
    },

    addGridClass: function (o) {
        $('.jtable-goto-page select').addClass('form-control');
        $('.jtable-page-size-change select').addClass('form-control');
        $('table.jtable').addClass('table').addClass('table-bordered').addClass('mb0').addClass('table-condensed');
        $('.jtable-page-list').find('.jtable-page-number-first').addClass('glyphicon').addClass('glyphicon-fast-backward');
        $('.jtable-goto-page select').addClass('form-control');
        $('.jtable-page-size-change select').addClass('form-control');
    },

    addFormToolTip: function (o) {
        var me = this, el = "." + o.winCls;
        $.each(me._toolTipCls, function (i, v) { $(el + ' .' + v).tooltip(); });
    },

    viewModule: function (o) {

        var ref = o.c[2];
        if ((typeof ref == 'string') && ref) {
            // o.view.show();
            //var html = o.view.html();
            //console.log(html);
            // $(ref).html(html);
            // o.view = $(ref);

        } else {
            var w = o.view.find('.modal.fade');
            w.modal('show');
            o.view.on('hidden.bs.modal', function () {
                o.vm.close();
            });
            o.vm.onViewReady();

            // Since confModal is essentially a nested modal it's enforceFocus method
            // must be no-op'd or the following error results 
            // "Uncaught RangeError: Maximum call stack size exceeded"
            // But then when the nested modal is hidden we reset modal.enforceFocus
            var enforceModalFocusFn = $.fn.modal.Constructor.prototype.enforceFocus;

            $.fn.modal.Constructor.prototype.enforceFocus = function () { };

            w.on('hidden', function () {
                $.fn.modal.Constructor.prototype.enforceFocus = enforceModalFocusFn;
            });

            w.modal({ backdrop: false });
        }
    },

    applyDatePicker: function (o, x) {
        $('span.glyphicon-calendar').parent().on('click', function () {
            $(this).prev().datepicker('show');
        });
    },

    applyChosenSBF: function (o) {
        var me = this;
        var x = $.sbf;
        if (!x) return;
        x.chosen.d = [];
        $.each(gDx(o), function (idx, field) {
            if (field.xSearchDefault) {
                me.chose(x.ref, field.Id);
                x.chosen.d.push(field.Id);
            }
        });
        x.chosen.search_contains = true;
        $(x.ref).chosen(x.chosen).on('change', function (e, a) {
            x.e = e; x.a = a;
            o.vm.onChangeSBF();
        });
        $.each(x.chosen.d, function (i, v) {
            x.e = {}; x.a = { selected: v + "" };
            o.vm.onChangeSBF();
        });
    },

    applyChosen: function (o) {
        var me = this;
        $.each(gDx(o), function (k, x) {
            if (me.isChosen(x) && !x.sbf) {
                me._applyChose(o, x); if (me._isRemoteData(x)) { o.vm.onGetData(x); }
            }
        });
    },

    viewGrid: function (o) {

        $("#" + o.gId).jtable(o.table);
        $("#" + o.gId).jtable('option', 'pageSize', 25);
        $("#" + o.gId).jtable('option', 'ajaxSettings', null);
        if (!o.gNoLoad) $("#" + o.gId).mask('Loading..........');
    },

    rights: function (o) {
        $.vCheckPopupRights(o.view);
    },

    bind: function (o) {
        o.vm.bind();
    },

    //#endregion

    //#region publish

    chose: function (ref, val, isClear) {
        if (isClear) $(ref + ' option').prop('selected', false).filter('[value="' + val + '"]').prop('selected', true);
        else $(ref + ' option').filter('[value="' + val + '"]').prop('selected', true);
    },

    isChosen: function (x) {
        return x.chosen && x.chosen.on && !x.chosen.off;
    },

    pushChosen: function (o, x) {
        var me = this;
        if (!me.isChosen(x)) return;
        o['chosen'][x.name] = x;
    },

    enableItem: function (w, s, v) {
        if (v) w.find(s).removeClass('btn-disabled').removeAttr('disabled');
        else w.find(s).addClass('btn-disabled').attr('disabled', 'disabled');
    },

    //#endregion

    //#region callable
    getBodyHtml: function (o) {
        var me = this;
        return me._getWinBody(o, o.items);
    },

    clearFormAndGrid: function (w) {
        w.find('input').each(function () {
            if (!$(this).hasClass('noCls'))
                $(this).val('');
        });
        w.find('select').each(function () {
            if (!$(this).hasClass('noCls'))
                $(this).val($(this).find('option').first().val());
        });
        w.find('textarea').each(function () {
            if (!$(this).hasClass('noCls'))
                $(this).val('');
        });
        w.find('button.save').html('<i class="glyphicon glyphicon-plus"></i> Thêm');
        $('tr.jtable-data-row.jtable-row-selected').find('input[type="checkbox"]').prop('checked', false);
        $('.jtable-row-selected').removeClass('jtable-row-selected');
    },

    unchose: function (ref, val, isClear) {
        if (isClear) $(ref + ' option').prop('selected', false).filter('[value="' + val + '"]').prop('selected', false);
        else $(ref + ' option').filter('[value="' + val + '"]').prop('selected', false);
    },

    clearChosen: function (ref) {
        $(ref + ' option').prop('selected', false);
    },

    showMessage: function (o) {
        $(o.element).addClass(o.type);
        $(o.element).fadeIn('fast');
        $(o.element).find('span.message-content').html(o.content);
        $(o.element).delay(1000).fadeOut('fast', function () { $(o.element).removeClass(o.type); });
    },

    start: function (o) {
        var me = this;
        if (o.p['start']) {
            o.p.start(o, function () {
                me.run(o);
            });
        } else me.run(o);
    },

    run: function (o) {
        try {
            var me = this;
            me.initView(o);
            me.initArrs(o);
            me.initObjs(o);
            me.initGrid(o);
            me.initForm(o);
            me.addViewModel(o);
            me.addGridClass(o);
            me.addFormToolTip(o);
            me.viewModule(o);
            me.applyDatePicker(o);
            me.applyChosenSBF(o);
            me.applyChosen(o);
            me.viewGrid(o);
            me.rights(o);
            me.bind(o);
        } catch (e) {
            console.error(e);
        }
    }

    //#endregion
};


///#source 1 1 /App/Core/Mgmt/p.js
function Vm(o) {
    var view = o.view;
    return {
        _me: function () {
            var me = this;
            me.view = view;
            me.o = o;
            $.each(gDx(o), function (k, v) { gDx(o)[v.name] = v; });
            $.each(o.p, function (k, v) { me[k] = v; });
            var x = vGetObj({ gColType: 'No' }, gDx(o));
            if (x) me.xNo = x;
        },

        _close: function () {
            var me = this;
            $.each(o.p, function (k, v) { me[k] = null; });
            view.unbind();
            $.setUrlOnClick(app.bms['BksModule']);
        },

        _reset: function () {
            var me = this;
            me.model = {};
            me.mainModels = [];
            me.baseDetailModels = [];
        },

        _gSelect: function (e) {
            var me = this;
            if (o.filterOnly) return;
            $.each(e.rs, function (i, m) {
                me._loadItem(m);
                me._onSelectionChange(m);
            });
        },

        _gDeselect: function (e) {
            var me = this;
            if (o.filterOnly) return;
            me._unloadItem();
            me._onSelectionChange(null);
        },

        _selectChosen: function (x, k, val) {
            if (!x.vals) x.vals = {};
            x.vals[$.trim(k)] = val;
        },

        _deselectChosen: function (x, k) {
            if (k == "*") {
                x.vals = {};
                return;
            }
            if (x.vals) delete x.vals[$.trim(k)];
        },

        _reloadChosen: function (x, d) {
            var me = this;
            vv.clearChosen(x.ref);
            $(x.ref).trigger("chosen:updated");
            x.e = {};
            x.a = { deselected: "*" };
            me.onChosenChange(x);

            if (d)
                $.each(d.split(','), function (k, id) {
                    vv.chose(x.ref, parseInt(id));
                    x.e = {};
                    x.a = { selected: id };
                    me.onChosenChange(x);
                });
            $(x.ref).trigger("chosen:updated");
           
        },

        _resetChosen: function (x) {
            var $el = $(x.ref);
            $('option', $el).each(function (id) {
                vv.unchose(x.ref, id);
                $(x.ref).trigger("chosen:updated");
            });
        },

        _beginForm: function () {
            var me = this;
            if (o.defaultFocusRef) {
                setTimeout(function () { view.find(o.defaultFocusRef).trigger('focus'); }, 5000);
            }
        },

        _applyXChange: function (x, a) {
            var me = this;
            view.find(a.ref).unbind('change').change(function (e) {
                var itm = $(this);
                $.vCacr(a.rights, function () {
                    if (typeof (a.xChange) == "function") a.xChange.call(me, view, itm, e);
                    else me[a.xChange].call(me, view, itm, e);
                }, me);
            });
        },

        _applyXClick: function (x, a) {
            var me = this;
            var ref = '';
            if (a.ref) ref = a.ref;
            else ref = x.ref;
            view.find(ref).unbind('click').click(function (e) {
                var itm = $(this);
                view.find(ref).prop('disabled', true);
                $.vCacr(x.rights, function () {
                    var fx = function () { view.find(ref).prop('disabled', false); };
                    if (typeof (a.xClick) == "function") {
                        a.xClick.call(me, itm, a, fx, e.target);
                    }
                    else me[a.xClick].call(me, itm, a, fx, e.target);
                    view.find(ref).prop('disabled', false);
                }, me);
            });
        },

        _applyXDateSelect: function (x) {
            var me = this;
            var cf = {
                dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
                changeMonth: true,
                changeYear: true,
                yearRange: "1950:2020",
                dateFormat: app.ddfm,
            };
            if (x.listeners)
                $.each(x.listeners, function (i, a) {
                    if (a.xDateSelect && me[a.xDateSelect]) {
                        cf['onSelect'] = function (d) {
                            var itm = this;
                            if (typeof (a.xDateSelect) == "function") a.xDateSelect.call(me, itm, d);
                            else me[a.xDateSelect].call(me, itm, d);
                        };
                    }
                });
            view.find(x.ref).datepicker(cf);
        },

        _bindL: function (x) {
            var me = this;
            if (x.vType == 'money') {
                view.find(x.ref).keyup(function () {
                    var obj = $(this);
                    $.vCacr(x.rights, function () {
                        obj.val(vToMn(obj.val().replace(/\./g, '')));
                    });
                });
            }
            if (x.type && x.type.toLowerCase() == 'date') me._applyXDateSelect(x);
            if (x.listeners) {
                $.each(x.listeners, function (i, a) {
                    if (!a.ref) a.ref = x.ref;
                    if (a.xChange) me._applyXChange(x, a);
                    if (a.xClick) me._applyXClick(x, a);
                });
            }
        },

        _applyListeners: function (rs) {
            var me = this;
            if (typeof rs != 'undefined' && rs.length > 0) {
                $.each(rs, function (k, x) {
                    me._bindL(x);
                    if (!vv.isChosen(x)) me._initOptions(x);
                });
            } else {
                $.each(gDx(o), function (k, x) {
                    me._bindL(x);
                    if (!vv.isChosen(x)) me._initOptions(x);
                });
                $.each(o.buttons, function (k, x) {
                    me._bindL(x);
                    if (!vv.isChosen(x)) me._initOptions(x);
                });
            }
        },
        //_applyListeners1: function (rs) {
        //    var me = this;
        //    $.each(rs, function (k, x) {
        //        me._bindL(x);
        //        if (!vv.isChosen(x)) me._initOptions(x);
        //    });
        //    $.each(o.buttons, function (k, x) {
        //        me._bindL(x);
        //        if (!vv.isChosen(x)) me._initOptions(x);
        //    });
        //},

        _initOptions: function (x, cb) {
            var me = this;
            //if (!(x.options && x.options.length == 0 && x.listConfig)) return;
            if (!(x.options && x.listConfig) || x.noAjax) return;
            var valField = x.listConfig.valField;
            var displayField = x.listConfig.displayField;
            if (!x.listConfig.ajax || x.listConfig.noload) return;
            if (x.listConfig.ajax.getC) {
                x.listConfig.ajax['_c'] = me[x.listConfig.ajax.getC].call(me, x, x.listConfig.ajax._c);
            }
            me._requestModels(x.listConfig.ajax, function (models) {
                x.options = [];
                view.find(x.ref).empty();

                if (typeof x.allowEmpty != "undefined" && x.allowEmpty) {
                    view.find(x.ref).append('<option value="">' + (x.emptyName?x.emptyName: 'Chọn')  + '</option>');
                }
                //view.find(x.ref).append('<option value="">Chọn</option>');
                $.each(models, function (k, m) {
                    var v = m[valField], d = '';
                    if (displayField.indexOf(',') > 0) {
                        var arrFields = displayField.split(',');
                        $.each(arrFields, function (i, names) { d = d + ' ' + m[names.trim()]; });
                        d = d.trim();
                    } else
                        d = m[displayField];
                    x.options.push(m);
                    view.find(x.ref).append('<option value="' + v + '">' + d + '</option>');
                });
                if (cb) cb.call(me);
                //obj[x.name] = me[x.cpc].call(me, x, baseModel[x.name], formValue, v, baseModel);
                if (x.listConfig.cb) me[x.listConfig.cb].call(me, o, x, models);
            });
        },

        _loadBaseData: function (cb) {
            var me = this;
            if (!o.baseCf) return;
            $('#' + o.gId).mask('Loading..........');
            me.listBase = [];
            me.listArea = [];

            o.baseCf['_f'] = me._getQueryFields();
            var fieldArr = o.baseCf['_f'].split(',');
            // block tuyến đường theo văn phòng
            var extraCon = [];
            if (typeof _dict._hasBlockTripByBranch != "undefined" && _dict._hasBlockTripByBranch && typeof _dict._blockTripByBranch != "undefined") {
                if (typeof _dict._blockTripByBranch[app.aid] != "undefined") {
                    $.each(_dict._blockTripByBranch[app.aid], function (kn, km) {
                        extraCon.push('$x != ' + km);
                    });
                    o.baseCf['_c']['Id'] = extraCon.join(' and ');
                }
            }
          
            if (me.onBeginLoadBaseData) me.onBeginLoadBaseData.call(me, o, cb);
            var x = vGetObj({ base: true }, gDx(o));
            
            vRql(o.baseCf, {
                a: function(u, r, l, t) {
                    $.each(gDx(o), function (idx, field) {
                          if (field.base) {
                              view.find(field.ref).empty();
                             
                          }
                     });
                     if (x && typeof x.allowEmpty != "undefined" && x.allowEmpty) {
                         view.find(x.ref).append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
                     }
                },
                m: function (i, d) {
                    var model = {};
                    $.each(fieldArr, function (j, val) {
                        if (val == 'RouteInfo' && o.gId != 'tripTableContainer') {
                            model['arrArea'] = vGas(d[j]);
                        }
                        if (val == 'FareInfo') {
                            model['arrFare'] = vGfs(model['arrArea'], d[j]);
                        }
                        if (val == 'PickedPointsInfo') {
                            model['arrPkPoints'] = vGpps(d[j]);
                        }
                        if (val == 'TransferPointsInfo') {
                            model['arrTfPoints'] = vGpps(d[j]);
                        }
                        //a
                        model[val] = d[j];
                    });
                    me.listBase.push(model);
                  
                    if (x) {
                        //if (firstRecord && typeof fieldCf.nullLabel != 'undefined') {
                        //    $.vCheckAndAppendOptions(view.find(fieldCf.ref), '', fieldCf.nullLabel, 'R');
                        //    firstRecord = false;
                        //}
                       
                        $.vCheckAndAppendOptions(view.find(x.ref), model[x.baseValField], model[x.baseDisplayField], 'R');
                    }
                },
                z: function (u, r, l, t) {
                    if (me.onEndAjaxloadBaseData) me.onEndAjaxloadBaseData.call(me);
                    
                    me._reset();
                    $.each(gDx(o), function (idx, field) {
                        if (field.base) {
                            if (field.name.toLowerCase() != 'pickuptime') {
                                view.find(field.ref).trigger('change');
                            }
                        }
                    });
                    if (cb) {
                        cb.call(me);
                    }
                }
            }, me);
            if (me.onEndloadBaseData) me.onEndloadBaseData.call(me, o, cb);
        },

        _getQueryFields: function () {
            var s = "Id";
            for (var i = 0; i < gDx(o).length; i++) {
                if (gDx(o)[i].gQuery) s += "," + gDx(o)[i].name;
            }
            return s;
        },

        _loadItem: function (record) {
            var me = this;
            me.model = record;
            if (me.onBeginLoadItem) {
                me.onBeginLoadItem.call(me);
            }
            $.each(gDx(o), function (idx, x) {
                if (vv.isChosen(x)) {
                    me._resetChosen(x);
                }
                var d = record[x.name];
                if (x.valField) d = record[x.valField];
                if (x.type && x.type.toLocaleLowerCase() == 'date') {
                    d = vGtDtObj('00:00', d);
                    if (x.displayFormat) {
                        x.displayFormat = app.ddfm;
                    }
                    d = vDtToStr(x.displayFormat, d);
                }
                if (x.gTextToFId) {
                    var isFound = false;
                    var lastIdx = 0;
                    var lastId = '';
                    $(x.ref + " option").each(function () {
                        var val = $(this).val();
                        if ($(this).text().trim().indexOf(d) == 0 && !isFound) {
                            d = val;
                            isFound = true;
                        }
                        if (val != '' && val != null) {
                            lastId = val;
                        }
                        lastIdx++;
                    });
                    if (!isFound) {
                        if (x.autoAppend) {
                            var optionVal = d;
                            var optionText = d;
                            if (x.appendText) optionText += ' - ' + x.appendText;
                            if (x.vType == 'num') {
                                optionVal = parseInt(lastId) + 1;
                                d = optionVal;
                            }
                            $.vCheckAndAppendOptions(view, x.ref, optionVal, optionText);
                        } else {
                            d = '';
                        }
                    }
                }
                //x.model = record;
                if (x.rootField) d = record[x.rootField];
                if (x.rvc) d = me[x.rvc].call(me, x, d);
                if (x.fDisplay) {
                    d = x.fDisplay.call(null, d);
                }
                if (x.combobox && !x.formToGridOnly) {
                    var selectRouteId = $(x.ref + ' option');
                    var id;
                    $.each(selectRouteId, function (i, val) {
                        if (val.text == d) {
                            id = val.value;
                            return;
                        }
                    });
                    $(x.ref + ' option').prop('selected', false).filter('[value="' + id + '"]').prop('selected', true);
                } else if (vv.isChosen(x)) me._reloadChosen(x, d);
                else if (!x.formToGridOnly) view.find(x.ref).val(d);
                else if (me.onLoadingField) me.onLoadingField.call(me, x, record);
            });
            if (me.onItemLoaded) me.onItemLoaded.call(me, record);
            view.find('button.save').html('<i class="glyphicon glyphicon-save"></i> Lưu');
        },

        _getCondition: function (arr) {
            var me = this;
            var c = {};
            if (!arr) return c;
            $.each(arr, function (idx, x) {
                if (!x) {
                    return true;
                }
                var v = view.find(x.ref).val();
                if (x.useOptionTextAsVal) {
                    v = view.find(x.ref + ' option:selected').text();
                }
                if (x.type == 'Date') {
                    v = vDtToStr("iso", vGtDtObj('00:00', v));
                }
                if (x.svb) { //Search value builder
                    v = me[x.svb].call(me, x, v);
                }
                if (vIsEstStr(v) && v.toString().length > 0) {
                    if (x.valField) {
                        c[x.valField] = v;
                    } else if (x.rootField) {
                        c[x.rootField] = v;
                    } else {
                        c[x.name] = v;
                    }
                }
                return true;
            });
            return c;
        },

        _getAjaxConfig: function (c) {
            var me = this;
            var fc = {};
            if (c) $.each(c, function (name, val) { fc[name] = val; });
            if (o.queryConditions) $.each(o.queryConditions, function (name, val) { fc[name] = val; });
            var ajax = { _a: o.queryAction, _c: fc, _f: me._getQueryFields() };
            return ajax;
        },

        _getBaseModel: function () {
            var me = this;
            var x = vGetObj({ base: true }, gDx(o));
            if (!x) return null;
            var selectedBaseId = parseInt(view.find(x.ref).val());
            var baseModel = vGetObj({ Id: selectedBaseId }, me.listBase);
            return baseModel;
        },

        _getDetailModelsFromBase: function (baseModel, remoteRecords, d) {
            var me = this, arr = [];
            if (!baseModel) return [];
            var fd = vGetObj({ xbase: true }, gDx(o));
            var baseValue = baseModel[fd.baseValSrcField];
            var values = [];
            if (fd.xchr) values = me[fd.xchr].call(me, fd, baseValue);
            $.each(values, function (idx, v) {
                var s = {};
                s[fd.name] = v;
                if (vGetObj(s, remoteRecords)) return true;
                var obj = { Id: 'New' + idx };
                $.each(gDx(o), function (i, x) {
                    if (!x.gQuery) return true;
                    if (!(x.dType == 1)) {
                        if (x.cpc) { //Copy converter
                            var formValue = view.find(x.ref).val();
                            if (d && d[x.name]) formValue = d[x.name];
                            obj[x.name] = me[x.cpc].call(me, x, baseModel[x.name], formValue, v, baseModel);
                            if (x.type == 'Date') {
                                var date = vGtDtObj('00:00', obj[x.name]);
                                obj[x.name] = vDtToStr("dd-mm-yyyy", date);
                            }
                        } else obj[x.name] = baseModel[x.name];
                        if (x.isBaseId) obj[x.name] = baseModel.Id;
                    }
                    if (x.name == fd.name) obj[x.name] = v;
                    return true;
                });
                arr.push(obj);
                return true;
            });
            return arr;
        },

        _applyFromBaseOptions: function (type) {
            var me = this;
            var fromBaseFields = vGetArr({ fromBase: true }, true, gDx(o));
            $.each(fromBaseFields, function (idx, x) {
                if (x.cbb) {
                    if (x.fromExcludeCases && x.fromExcludeCases.indexOf(type) < 0) {
                        view.find(x.ref).empty();
                        if (x.xchv) {
                            var arr = me[x.xchv].call(me, me._getBaseModel(), me.mainModels);
                            $.each(arr, function (i, vl) { $.vCheckAndAppendOptions(view.find(x.ref), i, vl, 'R', true); });
                        }
                    } //view.find(obj.ref).append('<option value="">Chọn</option>');
                }
                view.find(x.ref).trigger('change');
            });
        },

        _getD: function (data, isNew) {
            var me = this;
            var d = {};
            var partInfos = {};
            var baseModel = me._getBaseModel();
            var v = '';
            $.each(gDx(o), function (idx, x) {
                if (!x.noSave) {
                    v = me._gfv(x);
                    //if (!$.isEmptyObject(v) && v.toString().length > 0) {
                    if (x.valField) d[x.valField] = v;
                    else if (x.name) d[x.name] = v;
                    //}
                }
                if (x.name) partInfos[x.name] = x;
                if (x.auto) {
                    if (x.depends) {
                        var b = {};
                        $.each(x.depends, function (k, va) {
                            var px = vGetObj({ name: va }, gDx(o));
                            b[va] = me._gfv(px);
                        });
                        if (x.needBase) {
                            b['Base'] = baseModel;
                        }
                        if (x.svc) v = me[x.svc].call(me, x, me._gfv(x), b, isNew);
                    }
                    if (x.name) d[x.name] = v;
                }
                if (x.gQuery && x.copyFromBase) {
                    if (x.name) d[x.name] = baseModel[x.name];
                }
            });
            if (o.defaultData) {
                $.each(o.defaultData, function (k, val) {

                    if (val == '$base') {
                        d[k] = baseModel.Id;
                    } else {
                        d[k] = val;
                    }
                });
            }
            if (data) $.each(data, function (k, val) { d[k] = val; });
            return d;
        },

        _gfv: function (x, s, d) {
            /// <summary>
            /// Get formated value
            /// </summary>
            /// <param name="x">Config object</param>
            /// <param name="s">For search</param>
            /// <param name="d">Data</param>
            var me = this;
            if (!x || !x.ref) {
                return '';
            };
            var vl = view.find(x.ref).val();
            if (x.defaultValue != null && vl == undefined) vl = x.defaultValue;
            if (x.useOptionTextAsVal) vl = view.find(x.ref + ' option:selected').text();
            if (x.type == 'Date' && !s) vl = vDtToStr("iso", vGtDtObj('00:00', vl));
            if (vv.isChosen(x) && x.vals) {
                if (x.svc) vl = me[x.svc].call(me, x, vl, x.vals);
            } else if (x.svc && !x.depends) vl = me[x.svc].call(me, x, vl);

            if (x.vType == 'num' && !x.useOptionTextAsVal) {
                vl = parseInt(vl);
            }
            if (d) {
                vl = d[x.name];
            }
            return vl;
        },

        _selectRowFromForm: function () {
            var me = this;
            me.stopGridSelectionEvent = true;
            var models = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields, true);
            if (models.length == 0) {
                models = me._getMatchedRecords(me.baseDetailModels, o.keyFields, false, o.finalKeyFields, true);
            }
            var totalRows = $('#' + o.gId).jtable('getTotalRow');
            if (totalRows > 0) {
                if (models.length == 1) {
                    var row = $('#' + o.gId).jtable('getRowByKey', models[0].Id);
                    if (row) {
                        $('#' + o.gId).jtable('selectRows', row);
                    }
                } else if (models.length == 0) {
                    var selectedRows = $('#' + o.gId).jtable('selectedRows');
                    if (selectedRows.length > 0) {
                        $('#' + o.gId).jtable('deselectRows', selectedRows);
                    }
                } else if (models.length > 1) {
                    $.each(models, function (i, m) {
                        var row = $('#' + o.gId).jtable('getRowByKey', m.Id);
                        if (row) {
                            me.stopGridSelectionEvent = true;
                            $('#' + o.gId).jtable('selectRows', row);
                        }
                    });
                }
            }
            $.vCheckPopupRights(view);
            view.find('.closedStatus').trigger('change');
            //$('#' + cf.gId).unmask();
            return;
        },

        _ajaxInsert: function (a, d, name, cb) { //d
            d.IsPrgStatus = 1;
            var me = this;
            me.insertData = d;
            vRqs({ _a: a, _f: '*', _d: d }, function (u, r, l, t) {
                if (u && parseInt(r) > 0) {
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: name + ' thành công.' });
                    // reload lại BKS
                    FlatObj.FTripGetTrip = false;
                    $('#bksContent').vbooking('load');
                    if (cb) {
                        cb.call(me, u, r, l, t);
                    }
                } else {
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: name + ' thất bại, vui lòng thử lại sau.' });
                }
            }
            );
        },

        _updateByInsert: function (msg) {
            var me = this;
            var d = me._getD({ StatusInfo: oTrs.normal }, true);
            me._ajaxInsert(o.insertAction, d, msg + ' ' + o.name.toLocaleLowerCase(), function (u, r, l, t) {
                me._reloadMainData("New");
                if (o.afterUpdate) {
                    o.afterUpdate.call(o);
                }
            });
        },

        _ajaxUpdate: function (id, d, isDelete, cb, msgSucc, msgErr) {
            var me = this;
            if (!d) d = me._getD();
            var content = '';
            //var content = isDelete ? 'Hủy thành công.' : 'Cập nhật thành công.';
            //var content2 = isDelete ? 'Cập nhật thất bại, vui lòng thử lại sau.' : 'Hủy thất bại, vui lòng thử lại sau.';
            vRqs(
                { _a: o.updateAction, _c: { Id: id }, _d: d },
                function (u, r, l, t) {
                    if (u && parseInt(r) > 0) {
                        if (msgSucc) {
                            content = msgSucc;
                        } else {
                            content = 'Cập nhật thành công.';
                        }
                        vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: content });
                    } else {
                        if (msgErr) {
                            content = msgErr;
                        } else {
                            content = 'Cập nhật thất bại, vui lòng thử lại sau.';
                        }
                        vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: content });
                    }
                    // reload lại BKS
                    FlatObj.FTripGetTrip = false;
                    $('#bksContent').vbooking("load");
                    me._reloadMainData(id);
                    if (cb) {
                        cb.call(me, u, r, l, t);
                    }
                });
        },

        _onSelectionChange: function (record, type) {
            var me = this;
            if (me.onBeginSelectionChange) {
                me.onBeginSelectionChange.call(me, view, record);
            }
            $.each(gDx(o), function (idx, x) {
                var selector = x.ref;
                var isDisable = false;
                if (record) {
                    if (record.StatusInfo == oTrs.cancel) {
                        isDisable = true;
                    }
                }
                if (vv.isChosen(x)) {
                    view.find(selector).attr('disabled', isDisable).trigger("chosen:updated");
                    if (!record) {
                        me._resetChosen(x);
                    }
                } else if (!x.alwaysDisable) {
                    if (x.alwaysEnable) isDisable = false;
                    else if (x.alwaysDisable) isDisable = true;
                    view.find(selector).prop('disabled', isDisable);
                    //if (view.find(selector).attr('name') != 'AddTime') view.find(selector).prop('disabled', isDisable);
                    //if (view.find(selector).attr('name') == 'AddTime') view.find(selector).next().prop('disabled', isDisable);
                    if (view.find(selector).hasClass('departure')) view.find(selector).next().attr('disabled', isDisable);
                }
                if (!me.stopGridSelectionEvent && record && x.changeOnSelectionChange) {
                    view.find(x.ref).trigger('change');
                }
            });
            if (me.stopGridSelectionEvent) {
                me.stopGridSelectionEvent = false;
                return;
            }
        },

        _getMatchedRecords: function (arr, fields, isSingle, extFields, isForceExtField, data) {
            var me = this, c = {};
            $.each(fields, function (idx, name) {
                var mc = vGetObj({ name: name }, gDx(o));
                var v = me._gfv(mc, true, data);
                if (mc && mc.valField) {
                    c[mc.valField] = v;
                } else {
                    c[name] = v;
                }
            });
            var models = vGetArr(c, true, arr);
            c = {};
            if (isForceExtField || (isSingle && models && models.length >= 1 && extFields)) {
                if (extFields) {
                    $.each(extFields, function(idx, name) {
                        var mc = vGetObj({ field: name }, gDx(o));
                        if (mc) {
                            var v = me._gfv(mc, true, data);
                            if (mc.valField) {
                                c[mc.valField] = v;
                            } else {
                                c[name] = v;
                            }
                            models = vGetArr(c, true, models);
                        } else {
                            return models;
                        }
                    });
                }
            }
            return models;
        },

        _unloadItem: function () {
            var me = this;
            me.model = null;
            //console.log('_unloadItem');
            var div = $('#seat-map');
            if (div) {
                div.empty();
            }
            if (me.onAfterUnloadItem) me.onAfterUnloadItem.call(me);
        },

        _listAction: function (models, params, isBegin) {
            var me = this, sIdx = 0;
            if (me.isBeginLoad) {
                params.jtStartIndex = 0;
                me.isBeginLoad = false;
            }
            if (models && models.length && models.length > 0) sIdx = models.length - 1;
            var jtStartIndex = parseInt(params.jtStartIndex);
            params.jtStartIndex = (!isBegin) ? jtStartIndex : 0;
           
            params.jtPageSize = parseInt(params.jtPageSize);
            var rc = models;
            if (typeof me.o.gridSortBy != 'undefined') {
                rc = vSort(me.o.gridSortBy.Name, me.o.gridSortBy.IsDesc, rc);
            }
            if (typeof me.o.gridCondition != 'undefined') {
                rc = vGetArr(me.o.gridCondition, false, rc);
            }
            if (typeof me.o.gridToBottom === 'function') {
                var t = rc.filter(me.o.gridToBottom);
                for (var i = 0; i < rc.length; i++) {
                    if (me.o.gridToBottom.call(me, rc[i], i)) {
                        rc.splice(i, 1);
                        i = 0;
                    }
                }
                rc = rc.concat(t);
            }
            //console.log('jtStartIndex: ', params.jtStartIndex, params.jtPageSize, sIdx, isBegin);
            var ret = {
                Result: 1,
                TotalRecordCount: models.length,
                //Records: rc,
                Records: rc.slice(params.jtStartIndex, params.jtStartIndex + params.jtPageSize),
                page: (params.jtStartIndex + params.jtPageSize) / params.jtPageSize
            };
            //console.log(ret);
            return ret;
        },

        _getBaseDetailModels: function (records, c, d) {
            var me = this;
            var baseModel = me._getBaseModel();
            var models = me._getDetailModelsFromBase(baseModel, records, d);
            me.baseDetailModels = models;
            if (c) {
                models = vGetArr(c, gDx(o), models);
            }
            return models;
        },

        _reloadMainData: function (id, c, type, d, isSilent) {
            var me = this;
            var arr = vGetArr({ domain: true }, true, gDx(o));
            if (!c) {
                c = me._getCondition(arr);
            }
            me._reloadTable(c, function (rs) {
                if (isSilent)return;
                if (!id) {
                    me._selectRowFromForm();
                    return;
                }
                if (id.indexOf) {
                    var models = me._getMatchedRecords(me.mainModels, o.keyFields, true, o.finalKeyFields, true, me.insertData);
                    id = models[0] ? models[0].Id : '';
                }
                var row = $('#' + o.gId).jtable('getRowByKey', id);
                if (row) $('#' + o.gId).jtable('selectRows', row);
                var m = vGetObj({ Id: id }, me.mainModels);
                me._onSelectionChange(m, type);
                me._selectRowFromForm();
            }, function (remoteModels) {
                me.mainModels = remoteModels;
                me._applyFromBaseOptions(type);
                $.vCheckPopupRights(view);
                var arrs = me._getBaseDetailModels(remoteModels, c, d);
                $.each(remoteModels, function (k, obj) { arrs.push(obj); });
                if (me.getFinalExtRow) return me.getFinalExtRow.call(me, arrs);
                return arrs;
            });
        },

        _reload: function (c, cb, getExtRow) {
            var me = this;
            me.isBegin = true;
            if (me.onBeginReload) me.onBeginReload.call(me);
            var ajax = me._getAjaxConfig(c);
            me._requestModels(ajax, function (models) {
                if (getExtRow) models = getExtRow.call(me, models);
                $('#' + o.gId).jtable('removeAllRows');
                if (typeof me.o.autoApplyGrid == 'undefined' || me.o.autoApplyGrid == true) {
                    $('#' + o.gId).jtable('addLocalRecords', function (lastPostData, params) {
                        var isBg = me.isBegin;
                        me.isBegin = false;
                        return me._listAction(models, params, isBg);

                    });
                };
                if (cb) cb.call(me, models);
                if (me.afterReload) me.afterReload.call(me, models);
                me.remoteModels = models;
                $('#' + o.gId).unmask();
                //if (o.grid && o.gId) $('#' + o.gId + ' .jtable-page-size-change select').val(2);
            });
        },

        _firstLoadTable: function () {
            var me = this;
            if (!o.grid || o.gNoLoad) return;
            me._reloadTable();
        },

        _reloadTable: function (c, cb, getExtRow) {
            var me = this;
            if (o.gRights) me._reload(c, cb, getExtRow);
            else me._reload(c, cb, getExtRow); //TODO: Check Rights
        },

        _requestModels: function (ajax, cb) {
            var me = this;
            var fieldArr = ajax['_f'].split(',');
            var a = ajax['_a'];
            var models = [];
            var formFields = gDx(o);
            vRql(ajax, {
                a: function(u, r, l, t) {
                    if (o.mainModel && o.mainModel['Act'] == a) {
                        me.allData = r;
                        me.advModels = {};
                    }
                },
                m: function (i, d) {
                    if (!o.mainModel || o.mainModel['Act'] != a) me._setMainModels(formFields, d, fieldArr, models, i);
                    else {
                        if (o.mainModel['Idx'] == i) {
                            $.each(d, function(k, d2) {
                                me._setMainModels(formFields, d2, fieldArr, models, k);
                            });
                        } else if (o.mainModel[i]) {
                            me.advModels[i] = [];
                            $.each(d, function (k, d2) {
                                me._setMainModels(formFields, d2, fieldArr, me.advModels[i], k);
                            });
                        }
                    }
                },
                z: function (u, r, l, t) {
                    
                    if (cb) {
                        cb.call(me, models);
                    }
                }
            }, me, view);
        },

        _setMainModels: function (formFields, d, fieldArr, models, i) {
            var me = this, model = {};
            $.each(fieldArr, function (j, v) {
                model[$.trim(v)] = d[j];
                var f = formFields[$.trim(v)];
                if (d[j] == null && f && f.defaultValue) model[$.trim(v)] = f.defaultValue;
                if (f && f.type && f.type.toLowerCase() == 'date') {
                    if (f.displayFormat) f.displayFormat = app.ddfm;
                    var s = vDtToStr(f.displayFormat, vGtDtObj('00:00', d[j]));
                    model[$.trim(v)] = s;
                }
            });
            if (me.xNo) {
                model[me.xNo.name] = i + 1;
            }
            models.push(model);
        },

        _getOptions: function (selector) {
            var options = $(selector);
            var values = [];
            $.each(options, function () {
                var txt = $(this).text();
                var arr = txt.split('-');
                values.push(arr[0].trim());
            });
            return values;
        },

        _applyCondition: function (fields, name, c, k) {
            var me = this;
            $.each(fields, function (idx, x) { if (x.name == name) c[k] = me._gfv(x); });
        },

        _onBasicUpdate: function (id, afterClick) {
            var me = this;
            var msg = "";
            var failArr = [];
            var isValid = true;
            var pageSize = parseInt($('#' + o.gId + ' .jtable-page-size-change select').val());
            $.each(gDx(o), function (idx, x) {
                var m;                
                var v = view.find(x.ref).val();
                if (x.svv && typeof x.svv == 'string') { //svv = save value validator
                    m = me[x.svv].call(me, x, v);
                    if (m) {
                        isValid = false;
                        msg += "\n" + m;
                        failArr.push(x);
                    }
                }
                if (x.vtype == 'money') v = v.toNum();

                if (x.vtype == 'num' && isNaN(v)) {
                    isValid = false;
                    msg += "\n" + x.label + ' phải là số';
                    failArr.push(x);
                }

                if (x.vtype == 'phone' && !vIsPNum(v)) {
                    isValid = false;
                    msg += "\n" + 'Số điện thoại không hợp lệ.';
                    failArr.push(x);
                }
                if (x.vtype == 'licensePlate' && !vIsVehiNum(v)) {
                    isValid = false;
                    msg += "\n" + 'Biển số xe không hợp lệ.';
                    failArr.push(x);
                }
                if (x.required && (v == '' || v.trim().length <= 0)) {
                    isValid = false;
                    msg += "\n Vui lòng nhập " + x.label.toLocaleLowerCase();
                    failArr.push(x);
                }
            });

            if (isValid) {
                var obj, d;
                if (!id) {
                    d = me._getD(null, true);
                    obj = { _a: o.insertAction, _c: {}, _d: d };
                    obj._d.IsPrgStatus = 1;
                    delete obj._d.Id;
                } else {
                    d = me._getD(null, false);
                    obj = { _a: o.updateAction, _c: { Id: me.model.Id }, _d: d };
                }
                vRqs(obj, function (u, r, l, t) {
                    if (u) {
                        if (me.onActionComplete) me.onActionComplete.call(me);
                        vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Thao tác thành công.' });
                        if (me.onUpdateSuccess) me.onUpdateSuccess.call(me, id);
                        else {
                            me._reloadTable(null, function () {
                                if (id && !o.deselectAfterUpdate) {
                                    var rowSelected = $('#' + o.gId).jtable('getRowByKey', id);
                                    if (rowSelected) $('#' + o.gId).jtable('selectRows', rowSelected);
                                }
                                vv.clearFormAndGrid(view);
                                $('#' + o.gId + ' .jtable-page-size-change select').val(pageSize);
                                //$('#' + cf.gId).unmask();
                            }, null);
                        }
                    } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Thao tác thất bại, vui lòng thử lại sau.' });
                });
            } else {
                vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: msg });
                if (failArr.length > 0) view.find(failArr[0].ref).trigger('focus');
            }
            if (afterClick && typeof afterClick === 'function') afterClick.call();
        },

        load: function () {
            var me = this;
            me._me();
            me._reset();
            me._applyListeners();
            me._loadBaseData();
            me._firstLoadTable();
            me._beginForm();
            if (me.onVMLoaded) me.onVMLoaded.call(me);

        },

        bind: function () {
            var me = this;
            view.on('gSelect', function (e) { me._gSelect(e); });
            view.on('gUnSelect', function (e) { me._gDeselect(e); });
        },

        onGetData: function (x) {
            var me = this;
            me._initOptions(x, function () { $(x.ref).trigger("chosen:updated"); });
        },

        onViewReady: function () {
            var me = this;
            if (me.afterViewReady) me.afterViewReady.call(me);
        },

        onChosenChange: function (x) {
            var me = this;
            if (!x.a) return;
            if (x.a.selected) me._selectChosen(x, x.a.selected, vGetObj({ Id: parseInt(x.a.selected) }, x.options));
            if (x.a.deselected) me._deselectChosen(x, x.a.deselected);
        },

        close: function () {
            var me = this;
            me._close();
        },

        onClickSBF: function () {
            try {
                var me = this, x = $.sbf, c = me._getCondition(x.vals);
                me._reloadMainData(me.model ? me.model.Id : null, c, 'sbf');
            } catch (e) {
                console.log('clickSBF', e);
            }
        },

        onChangeSBF: function () {
            var me = this;
            var x = $.sbf;
            if (!x.a) return;
            if (x.a.selected) me._selectChosen(x, x.a.selected, vGetObj({ Id: parseInt(x.a.selected) }, x.options));
            if (x.a.deselected) me._deselectChosen(x, x.a.deselected);
        },

        onSave: function (btn, bcf) {
            var me = this;
            var id = '';
            if (me.model) {
                id = me.model['Id'];
            }
            var fx = function () {
                var rs;
                if (id && !id.indexOf) {
                    var isAllow = true;
                    rs = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields, true);
                    if (rs.length >= 1) {
                        $.each(rs, function (i, m) { if (parseInt(m.Id) != parseInt(id)) isAllow = false; });
                        if (isAllow) me._ajaxUpdate(id);
                        else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Chuyến đã tồn tại, vui lòng chọn Bus khác' });
                    } else me._ajaxUpdate(id);
                } else if (id) {
                    rs = me._getMatchedRecords(me.mainModels, o.keyFields, false, o.finalKeyFields);
                    if (rs.length == 1) me._ajaxUpdate(rs[0].Id);
                    else if (rs.length > 1) vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Chuyến đã tồn tại, vui lòng chọn Bus khác' });
                    else me._updateByInsert('Cập nhật');
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: 'Vui lòng chọn ' + o.name });
            };
            if (me.checkAndSave) me.checkAndSave.call(me, fx);
            else fx.call();
        },

        onBasicSave: function (a, b, afterClick) {
            var me = this, id = '';
            if (me.model) {
                id = me.model['Id'];
            }
            if (id && !id.indexOf) me._onBasicUpdate(id, afterClick);
            else me._onBasicUpdate(null, afterClick);
        },

        onBasicDelete: function (btn, a, fx, target, args) { 
            var me = this;
            var btnDelete = vGetObj({ name: 'btnRemove' }, o.buttons);
            var idx = 0;
            if (me.remoteModels) $.each(me.remoteModels, function (i, model) { if (model.Id == me.model.Id) idx = i; });
            var d = { IsPrgStatus: 3 };
            // Todo: không hiểu vì sao ai truyền args vô request
            if (args) {
                $.extend(d, args);
            }
            vRqs({ _a: o.updateAction, _c: { Id: me.model.Id }, _d: d }, function (u, r, l, t) {
                if (u) {
                    if (me.onActionComplete) me.onActionComplete.call(me);
                    vv.showMessage({ element: view.find('.alert.message'), type: 'alert-success', content: 'Xóa thành công.' });
                    vv.clearFormAndGrid(view);
                    view.find('button.delete').addClass('btn-disabled').attr('disabled', 'disabled');
                    me._reloadTable(null, function (models) { if (idx >= models.length - 1) idx = 0; });
                } else vv.showMessage({ element: view.find('.alert.message'), type: 'alert-danger', content: btnDelete ? btnDelete.messErro : 'Thao tác thất bại, vui lòng thử lại sau.' });
            });
        },

        onBasicClear: function () {
            var me = this;
            me.model = null;
            view.find('button.delete').addClass('btn-disabled').attr('disabled', 'disabled');
            vv.clearFormAndGrid(view);
            if (o.defaultFocusRef) view.find(o.defaultFocusRef).trigger('focus');
        },

        getOverrideAjaxConfig: function (a, c) {
            /*
             * a: default ajax config
             * c: override conditions
             */
            if (c && c._a) return c;
            var dc = a._c;
            var fc = {};
            if (dc) $.each(dc, function (name, val) { fc[name] = val; });
            if (c) $.each(c, function (name, val) { fc[name] = val; });
            var ajax = { _a: a._a, _c: fc, _f: a._f };
            return ajax;
        },

        _loadCbb: function (n, c, cb) {
            var me = this;
            var x = vGetObj({ name: n }, gDx(o));
            var v = view.find(x.ref);
            if (!x) return;
            if (x.local) {
                v.empty();
                v.append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
                $.each(x.options, function (k, model) {
                    $.vCheckAndAppendOptions(v, model[x.valField], model[x.displayField], 'R');
                });
               
                if (vv.isChosen(x)) me._resetChosen(x);
                if (cb) cb.call(me);
                return;
            }
            x.options = [];
            v.empty();
            if (!x.listConfig || !x.listConfig.ajax) return;// o.baseCf['_f'].split(',');
            var fieldArr = x.listConfig.ajax['_f'].split(',');
            //if (me.onBeginLoadBaseData) me.onBeginLoadBaseData.call(me, o, cb);
            //var x = vGetObj({ base: true }, gDx(o));
            var acf = me.getOverrideAjaxConfig(x.listConfig.ajax, c);
            //console.log('_loadCbb', acf);
            vRql(acf, {
                a: function (u, r, l, t) {
                    v.empty();
                    if (x && typeof x.allowEmpty != "undefined" && x.allowEmpty) {
                        v.append('<option value="">' + (x.emptyName ? x.emptyName : 'Chọn') + '</option>');
                    }
                    
                },
                m: function (i, d) {
                    var model = {};
                    $.each(fieldArr, function (j, val) {
                        model[$.trim(val)] = d[j];
                    });
                    $.vCheckAndAppendOptions(v, model[x.listConfig.valField], model[x.listConfig.displayField], 'R');

                },
                z: function (u, r, l, t) {
                    if (vv.isChosen(x)) {
                        me._resetChosen(x);
                    }
                    if (cb) cb.call(me);
                }
            }, me);
            if (me.onEndloadBaseData) me.onEndloadBaseData.call(me, o, cb);
        }

    };
};
///#source 1 1 /App/Core/Mgmt/x.js
$.xId = function (x) {
    return {
        name: 'Id', data: true, dType: 1,
        grid: true, gQuery: true, gHide: true, gIdx: 0,
        form: false, fIdx: 100, gDis: x.gDis
    };
};

$.xNo = function (x) {
    return {
        name: 'No', data: true, dType: 1, gWidth: '80px', label: '# No',
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
///#source 1 1 /App/Core/System/Array/p.js
function vGetUni(a) {
    /// <summary>
    /// Get Unique values in an Array
    /// </summary>
    /// <param name="a">Array</param>

    a = this == window ? a : this;
    var u = {}, b = [];
    for (var i = 0, l = a.length; i < l; ++i) {
        var cr = JSON.stringify(a[i]);
        if (u.hasOwnProperty(cr)) {
            continue;
        }
        b.push(a[i]);
        u[cr] = 1;
    }
    return b;
};

function vCln(v, a) {
    /// <summary>
    /// Delete a Element in array
    /// </summary>
    /// <param name="a">The array</param>
    /// <param name="v">The value want to delete</param>

    a = this == window ? a : this;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == v) {
            a.splice(i, 1);
            i--;
        }
    }
    return this;
};

function vNumEstIt(a) {
    /// <summary>
    /// Get Number Of Existing Item
    /// </summary>
    /// <param name="a">Array to count</param>
    a = this == window ? absolute : this;
    var r = 0;
    for (var i = 0; i < a.length; i++) {
        if (typeof a[i] != "undefined") {
            r++;
        }
    }
    return r;
};

function vFindById(id, a) {
    /// <summary>
    /// Find a element of array by Id
    /// </summary>
    /// <param name="id">Id to find</param>
    /// <param name="a">Array</param>
    var m = null;
    a = this == window ? a : this;
    $.each(a, function (_, o) {
        if (id == o.Id) {
            m = o;
            return false;
        }
        return true;
    });

    return m;
};

function vSort(n, dsc, arr) {
    /// <summary>
    /// Sort an array by Name
    /// </summary>
    /// <param name="n">Name</param>
    /// <param name="dsc">Is decrease or not</param>
    /// <param name="arr"> Array </param>
    arr = this == window ? arr : this;
    function chunkify(t) {
        var tz = [], x = 0, y = -1, nn = 0, i, j;
        try {
            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >= 48 && i <= 57));
                if (m !== nn) {
                    tz[++y] = "";
                    nn = m;
                }
                tz[y] += j;
            }
            return tz;
        } catch (e) {
            return tz;
        };
    };
    if (!dsc) {
        return arr.sort(function (as, bs) {
            if (n) {
                var a1 = as[n], b1 = bs[n];
                if (a1 && b1) {
                    if (isNaN(a1) || isNaN(b1)) {
                        var aa = chunkify(a1);
                        var bb = chunkify(b1);
                        for (var x = 0; aa[x] && bb[x]; x++) {
                            if (aa[x] !== bb[x]) {
                                var c = Number(aa[x]), d = Number(bb[x]);
                                if (c == aa[x] && d == bb[x]) {
                                    return c - d;
                                } else return (aa[x] > bb[x]) ? 1 : -1;
                            }
                        }
                        return aa.length - bb.length;
                    } else {
                        return (parseInt(a1) - parseInt(b1));
                    }
                } else {
                    return a1 ? 1 : -1;
                }
            } else {
                return as < bs ? 1 : -1;
            }

        });
    }
    return arr.sort(function (as, bs) {
        if (n) {
            var a1 = as[n], b1 = bs[n];
            if (isNaN(a1) || isNaN(b1)) {
                var aa = chunkify(a1);
                var bb = chunkify(b1);
                for (var x = 0; aa[x] && bb[x]; x++) {
                    if (aa[x] !== bb[x]) {
                        var c = Number(aa[x]), d = Number(bb[x]);
                        if (c == aa[x] && d == bb[x]) {
                            return d - c;
                        } else return (aa[x] > bb[x]) ? -1 : 1;
                    }
                }
                return bb.length - aa.length;
            } else {
                return (parseInt(b1) - parseInt(a1));
            }
        } else {
            return as < bs ? 1 : -1;
        }

    });
};

function vGetArr(c, fi, a) {
    /// <summary>
    /// Get an array from an array.
    /// </summary>
    /// <param name="c">Conditions</param>
    /// <param name="fi">Fields</param>
    /// <param name="a">Source array</param>
    a = this == window ? a : this;
    if (fi == undefined || !fi) {
        return _.where(a, c);
    } else {
        var rs = [];
        $.each(a, function (idx, obj) {
            var b = true;
            $.each(c, function (kc, vc) {
                var f = fi[kc];
                var vd = obj[kc];
                if (f) {
                    if (f.type == 'Date') {
                        if (vd.indexOf('/Date(') == 0) {
                            vd = vGetDateOnly(vGtDtObj(null, vd));
                        }
                        if (vc.indexOf('T') > 0) {
                            vc = vGetDateOnly(new Date(vc));
                        }
                    }
                    if (f.vType == 'num' && !f.useOptionTextAsVal) {
                        vc = parseInt(vc);
                        vd = parseInt(vd);
                    }
                }
                if (vc != vd) b = false;

            });
            if (b) rs.push(obj);
        });
        return rs;
        /*if (isGetArr) return rs;
        return rs[0];*/
    }

};

function vGetSearchCondt(arr) {
    /// <summary>
    /// Get search search conditions from a array.
    /// </summary>
    /// <param name="arr">Array of condition fields</param>

    arr = this == window ? arr : this;
    if (!arr) return "$x like '%'";
    var s = "(";
    var endIndx = arr.length - 1;
    $.each(arr, function (i, v) {
        s += "$x like '%|" + v + "|%'";
        if (i < endIndx) {
            s += " or ";
        }
    });
    s += ")";
    return s;
};

function vJoin(arr, c) {
    var s = "";
    if (!c) c = "";
    $.each(arr, function(i, v) {
        s = s + c + v;
    });
    return s;
}
///#source 1 1 /App/Core/System/DateTime/p.js
function vSaveDate(v) {
    var arr = v.split('-');
    var d = arr[2] + '-' + arr[1] + '-' + arr[0];
    return d;
}
function vDtToStr(f, d) {
    /// <summary>
    /// Convert Date to format string
    /// </summary>
    /// <param name="f">Format string</param>
    /// <param name="d">Date to convert</param>

    d = this == window ? d : this;
    if (d == null || typeof d == 'undefined') return '';
    function pad(number) {
        var r = String(number);
        if (r.length === 1) {
            r = '0' + r;
        }
        return r;
    }
    var dOw = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ 6", "Thứ 7"];
    var result = "";

    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    switch (f) {
        case "dd-mm-yyyy hh:ii":
            result = pad(day) + "-" + pad(month) + "-" + year + " <b>" + pad(hour) + ":" + pad(minute) + "</b>";
            break;
        case "dd/mm/yyyy":
            result = pad(day) + "/" + pad(month) + "/" + year;
            break;
        case "dd-mm-yyyy":
            result = pad(day) + "-" + pad(month) + "-" + year;
            break;
        case "iso":
            result = year + '-' + pad(month) + '-' + pad(day) + 'T' + pad(hour) + ':' + pad(minute) + ':00.000';
            break;
        case "hh:mm":
            result = pad(hour) + ':' + pad(minute);
            break;
        case "hh.mm":
            result = pad(hour) + '.' + pad(minute);
            break;
        case "dd.mm.yyyy":
            result = pad(day) + "." + pad(month) + "." + year;
            break;
        case "HH:mm - dd.mm.yyyy":
            result = pad(hour) + ":" + pad(minute) + " - " + pad(day) + "." + pad(month) + "." + year;
            break;
        case "HH:mm-dd.mm.yyyy":
            result = pad(hour) + ":" + pad(minute) + " - " + pad(day) + "." + pad(month) + "." + year;
            break;
        case "HH:mm dd.mm.yyyy":
            result = pad(hour) + ":" + pad(minute) + " " + pad(day) + "." + pad(month) + "." + year;
            break;
        case "DD dd-mm-yyyy":
            var dname = dOw[d.getDay()];
            result = dname + " " + pad(day) + "-" + pad(month) + "-" + year;
            break;
        case "yyyy/mm/dd":
            result = year + "/" + pad(month) + "/" + pad(day);
            break;
        case "yyyy-mm-dd":
            result = year + "-" + pad(month) + "-" + pad(day);
            break;
        case "hh:mm:ss":
            result = pad(hour) + ':' + pad(minute) + ':' + pad(second);
            break;
        case 'sql':
            result = pad(month) + "-" + pad(day) + "-" + year + " " + pad(hour) + ":" + pad(minute);
            break;
        case "dd-mm-yy":
            result = pad(day) + "-" + pad(month) + "-" + year;
            break;
        default:
            result = "";
            break;
    }
    return result;
};

function vAddMinutes(m, t) {
    /// <summary>
    /// Add minutes to a time.
    /// </summary>
    /// <param name="m">Num of minutes</param>
    /// <param name="t">Time input</param>

    t = this == window ? t : this;
    var minute = t.getMinutes();
    t.setMinutes(minute + m);
    return t;
};

function vGetDateOnly(o) {
    /// <summary>
    /// Get date only format: dd-mm-yyyy
    /// </summary>
    /// <param name="o">Object to get</param>

    o = this == window ? o : this;
    if (!o) return '';
    var dd = o.getDate();
    var mm = o.getMonth() + 1; //January is 0!
    var yyyy = o.getFullYear();
    if (dd.toString().length == 1) {
        dd = "0" + dd;
    }
    if (mm.toString().length == 1) {
        mm = "0" + mm;
    }
    return dd + '-' + mm + '-' + yyyy;
};

function vAddTime(t, d) {
    /// <summary>
    /// Add time to current date
    /// </summary>
    /// <param name="t">Time</param>
    /// <param name="d">Date to add</param>

    d = this == window ? d : this;
    return d.replace('00:00', t);
};

function vPrsTm(t) {
    /// <summary>
    /// Parse time from date to format:  hh:mm
    /// </summary>
    /// <param name="t">Time</param>

    t = this == window ? t : this;
    if (t) {
        var h = t.Hours;
        var m = t.Minutes;
        var hh = h.toString();
        var mm = m.toString();
        if (h.toString().length == 1) hh = '0' + hh;
        if (m.toString().length == 1) mm = '0' + mm;
        return hh + ':' + mm;
    }
    return '';
};

//function vGtDtStr(f, d) {
//    /// <summary>
//    /// Get date in string format
//    /// </summary>
//    /// <param name="f">String format (Eg: dd-mm-yyyy)</param>
//    /// <param name="d">Date</param>
//    d = d == undefined ? this : d;
//    if (!d || !d.getDate) return '';
//    //console.log(date);
//    function pad(number) { var r = String(number); if (r.length === 1) { r = '0' + r; } return r; }
//    var result = ""; var day = d.getDate(); var month = d.getMonth() + 1; var year = d.getFullYear(); var hour = d.getHours(); var minute = d.getMinutes();
//    switch (f) {
//        case "dd-mm-yyyy hh:ii": result = pad(day) + "-" + pad(month) + "-" + year + " <b>" + pad(hour) + ":" + pad(minute) + "</b>"; break;
//        case "dd-mm-yyyy": result = pad(day) + "-" + pad(month) + "-" + year; break;
//        case "dd-mm-yy": result = pad(day) + "-" + pad(month) + "-" + year; break;
//        case "iso": result = year + '-' + pad(month) + '-' + pad(day) + 'T' + pad(hour) + ':' + pad(minute) + ':00.000'; break;
//        case "hh:mm": result = pad(hour) + ':' + pad(minute); break;
//    }
//    return result;
//};

function vGetNow() {
    /// <summary>
    /// Get date now in string format dd-mm-yyyy
    /// </summary>

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyyy;
    return today;
};


function vGtDptTm(dd, dt) {
    /// <summary>
    /// Get departure time
    /// </summary>
    /// <param name="dd">Date</param>
    /// <param name="dt">Time</param>

    var dts = $.trim((null != dd ? dd : "") + " " + (null != dt ? dt : ""));
    var departureTime = new Date();
    if ("" != dts) {
        departureTime = vPrsDt(dts);
    }
    // console.log(departureTime);
    return departureTime;
};

function parseDateFromTString(str) {
    /// <summary>Get Date</summary>
    /// <param name="str">source</param>
    return str != null ? new Date(parseInt(str.substring(str.indexOf('(') + 1).replace(')/', ''))) : '';
}

function formatDatepicker($datepicker, format) {
    /// <summary>Get Date</summary>
    /// <param name="$datepicker">datepicker element</param>
    /// <param name="format">format</param>
    if ($datepicker.val() == '') return '';
    return moment(new Date($datepicker.datepicker("getDate"))).format(format);
}
///#source 1 1 /App/Core/System/Number/o.js

///#source 1 1 /App/Core/System/Number/p.js

///#source 1 1 /App/Core/System/Object/p.js
function vGetObj(c, arr) {
    /// <summary>
    /// Get object from a array of objects
    /// </summary>
    /// <param name="c">Conditions</param>
    /// <param name="arr">Array input</param>
    
    arr = this == window ? arr : this;
    if (arr) {
        var rs = _.where(arr, c);
        return rs[0];
    }
    return {};
};


function vCloneObj (obj) {
    /// <summary>
    /// Clone a object
    /// </summary>
    /// <param name="obj">Object to clone</param>
    obj = this == window ? obj : this;
    var x = {};
    if (obj) {
        $.each(obj, function(k, v) {
            x[k] = v;
        });
    }
    return x;
};
///#source 1 1 /App/Core/System/String/p.js
function vRdm(s) {
    /// <summary>
    /// Remove diacritic marks, lọc dấu
    /// </summary>
    /// <param name="s">The input string</param>
    s = this == window ? s : this;
    s = s.toLowerCase();
    s = s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    s = s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    s = s.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    s = s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    s = s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    s = s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    s = s.replace(/đ/g, "d");
    s = s.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    s = s.replace(/-+-/g, "-"); //thay thế 2- thành 1- 
    s = s.replace(/^\-+|\-+$/g, "");
    //cắt bỏ ký tự - ở đầu và cuối chuỗi  
    return s;
};

function vPrsDt(d) {
    /// <summary>
    /// Parse date from a string
    /// </summary>
    /// <param name="d">Date in string format</param>
    try {
        d = this == window ? d : this;
        if (d == null) {
            return new Date();
        }

        if (d.indexOf('Date') >= 0) { //Format: /Date(1320259705710)/
            return new Date(
                parseInt(d.substr(6), 10)
            );
        } else if (d.length == 10) {
            if (d.indexOf('-') == 2 || d.indexOf('.')) { //Format: 01-01-2011 or 01.01.2011
                return new Date(
                    parseInt(d.substr(6, 4), 10),
                    parseInt(d.substr(3, 2), 10) - 1,
                    parseInt(d.substr(0, 2), 10),
                    0, 0, 0
                );
            } else if (d.indexOf('-') == 4) { //Format: 2011-01-01
                return new Date(
                    parseInt(d.substr(0, 4), 10),
                    parseInt(d.substr(5, 2), 10) - 1,
                    parseInt(d.substr(8, 2), 10),
                    0, 0, 0
                );
            }
        } else if (d.length == 19) { //Format: 2011-01-01 20:32:42
            return new Date(
                parseInt(d.substr(0, 4), 10),
                parseInt(d.substr(5, 2), 10) - 1,
                parseInt(d.substr(8, 2, 10)),
                parseInt(d.substr(11, 2), 10),
                parseInt(d.substr(14, 2), 10),
                parseInt(d.substr(17, 2), 10)
            );
        } else if (d.length == 16) { //Format: 01-01-2011 20:32
            return new Date(
                parseInt(d.substr(6, 4), 10),
                parseInt(d.substr(3, 2), 10) - 1,
                parseInt(d.substr(0, 2, 10)),
                parseInt(d.substr(11, 2), 10),
                parseInt(d.substr(14, 2), 10),
                0
            );
        } else if (d.length == 23) { //Format: 2011-01-01T20:32:42.000
            return new Date(
                parseInt(d.substr(0, 4), 10),
                parseInt(d.substr(5, 2), 10) - 1,
                parseInt(d.substr(8, 2), 10),
                parseInt(d.substr(11, 2), 10),
                parseInt(d.substr(14, 2), 10),
                parseInt(d.substr(17, 2), 10));
        }
        return null;
    } catch (e) {
        return null;
    }
};

function vGtDtObj(dt, dd) {///Date(1411405200000)/
    /// <summary>
    /// Get date object from a string
    /// </summary>
    /// <param name="dt">Time (optional)</param>
    /// <param name="dd">Date string</param>

    dd = this == window ? dd : this;
    if (dd == null) dd = "";
    var date = new Date();
    if (dd.indexOf('T') < 0) {
        var dts = $.trim((dd) + " " + (null != dt ? dt : ""));
        if ("" != dts) { date = vPrsDt(dts); }
        return date;
    } else {
        date = new Date(dd);
        return date;
    }
};

function vIsEstStr(s) {
    /// <summary>
    /// Check a string is exist or not
    /// </summary>
    /// <param name="s">String</param>

    s = this == window ? s : this;
    if (typeof s != "undefined" && s != null && s != "") {
        return true;
    }
    return false;
};

function vIsMulPhoneNum(s) {
    /// <summary>
    /// Check multi phone number separated by char '-'
    /// </summary>
    /// <param name="s">String input</param>

    // created by Duy - 2014.09.17

    s = this == window ? s : this;
    if (this.trim().length == 0) return true;
    // checking input string has char '-'
    if (this.indexOf('-') != -1) {
        var phones = this.split('-');
        for (var i = 0; i < phones.length; i++) {
            // if the phone is invalid return false
            if (phones[i] == null) return false;
            // checking the phone is real phone
            if (!vIsPhone(phones[i])) {
                return false;
            }
        }
    } else {
        // isNaN: return true if input string is not number
        if (isNaN(this)) {
            return false;
        } else {
            return vIsPhone(this.trim());
            //return true;
        }
    }
    return true;
};

function vHasSpecChar(s) {
    /// <summary>
    /// Check a string has special char or not
    /// </summary>
    /// <param name="s">Input string</param>
    // created by Duy - 2014.10.30

    s = this == window ? s : this;
    return (s.toLowerCase().match(/[^a-zA-Z0-9|\s|+|.|\-|,|/|(|)|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ]/g) != null) ? true : false;
};

function vHashCode(s) {
    /// <summary>
    /// Hash a string
    /// </summary>
    /// <param name="s">Input string</param>

    s = this == window ? s : this;
    var h = 0, i, len;
    if (s.length == 0) return h;
    for (i = 0, len = s.length; i < len; i++) {
        var chr = s.charCodeAt(i);
        //hash = ((hash << 5) - hash) + chr;
        //hash |= 0; // Convert to 32bit integer
        h += chr;
    }
    return h;
};
function replaceUnicodeCharacter (str) {
    /// <summary>Convert Vietnamese string to ascii string</summary>
    /// <param name="str" type="string">string to be converted</param>
    /// <returns type="string">Result string</returns>
    if (str == null || str == '') return '';
    return str.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/^\-+|\-+$/g, "")
    ;
};
function getSubItem(str, chr, index) {
    /// <summary>Get sub string</summary>
    /// <param name="str" type="string">source string</param>
    /// <param name="chr" type="string">splitted char</param>
    /// <param name="index" type="int">index</param>
    /// <returns type="string">Result string</returns>
    if (str == null) return '';
    try {
        return str.split(chr)[index];
    } catch (err) {
        return '';
    }
};


///#source 1 1 /App/Core/UI/pager.js
function Pager(total, itemsPerPage, container, numberOfPageToBeShown, onPageChanged){
    Pager.prototype.totalRecords = total;
    Pager.prototype.totalPage = Math.ceil(total/itemsPerPage);
	Pager.prototype.itemsPerPage=itemsPerPage;
	Pager.prototype.currentPage=1;
	Pager.prototype.container=container;
	Pager.prototype.numberOfPageToBeShown=numberOfPageToBeShown;
	Pager.prototype.onPageChanged = onPageChanged;
	var startButton = (1 - numberOfPageToBeShown / 2) > 0 ? (1 - numberOfPageToBeShown / 2) : 1;
	Pager.prototype.startButton = startButton;
	Pager.prototype.endButton = (startButton + numberOfPageToBeShown <= total) ? (startButton + numberOfPageToBeShown) : total;
}

Pager.prototype.updateInfo = function (totalRecords, currentPage) {
    var self = this;
    self.totalRecords = totalRecords;
    self.totalPage = Math.ceil(totalRecords / self.itemsPerPage);
    self.currentPage = currentPage;
    self.startButton = (1 - self.numberOfPageToBeShown / 2) > 0 ? (1 - self.numberOfPageToBeShown / 2) : 1;
    self.endButton = (self.startButton + self.numberOfPageToBeShown <= self.totalRecords) ? (self.startButton + self.numberOfPageToBeShown) : self.totalRecords;
    if (this.onPageChanged != null) {
        this.onPageChanged();
    }
    return this;
}
Pager.prototype.render= function() {
    var self = this;
    var update = function() {
        $(self.container).html(pageTemplate);
        var $ul = $(self.container + " ul.pages");
        $ul.append(vtpl(pageButton, { type: 'first', disabled: self.currentPage > 1 ? '' : 'disabled', value: 1, icon: 'glyphicon-fast-backward' }));
        $ul.append(vtpl(pageButton, { type: 'previous', disabled: self.currentPage > 1 ? '' : 'disabled', value: self.currentPage - 1, icon: 'glyphicon-backward' }));

        self.startButton = (self.currentPage - Math.floor(self.numberOfPageToBeShown / 2)) > 0 ? (self.currentPage - Math.floor(self.numberOfPageToBeShown / 2)) : 1;
        self.endButton = (self.startButton + self.numberOfPageToBeShown - 1 <= self.totalPage) ? (self.startButton + self.numberOfPageToBeShown - 1) : self.totalPage;
        

        var isLeftCommonButtonRendered = false, isRightCommonButtonRendered = false;
        $(self.container + " .allPages").html('');
        for (var i = 1; i <= self.totalPage; i++) {

            $(self.container + " .allPages").append(vtpl(selectPagesOption, { value: i }));
            var tmp = 0;
            if (i >= self.startButton && i <= self.endButton) {
                $ul.append(vtpl(pageButtonNumber, { value: i, active: i == self.currentPage ? 'active' : '' }));
            } else if (isLeftCommonButtonRendered == false && i < self.startButton) {
                tmp = self.startButton - Math.floor(self.numberOfPageToBeShown / 2);
                $ul.append(vtpl(pageButtonNumber, {
                    value: '...',
                    pageToShow: tmp > 0 ? tmp : 1
                }));
                isLeftCommonButtonRendered = true;
            } else if (isRightCommonButtonRendered == false && i > self.endButton) {
                tmp = self.endButton + Math.floor(self.numberOfPageToBeShown / 2);
                $ul.append(vtpl(pageButtonNumber, {
                    value: '...',
                    pageToShow: tmp < self.totalPage ? tmp : self.totalPage
                }));
                isRightCommonButtonRendered = true;
            }
        }

        $ul.append(vtpl(pageButton, { type: 'next', disabled: self.currentPage < self.totalPage ? '' : 'disabled', value: self.currentPage + 1, icon: 'glyphicon-forward' }));
        $ul.append(vtpl(pageButton, { type: 'last', disabled: self.currentPage < self.totalPage ? '' : 'disabled', value: self.totalPage, icon: 'glyphicon-fast-forward' }));
    };
    update();

    vev(self.container + " ul.pages li a", "click", function() {
        var index = $(this).attr('data-index');
        if ($(this).hasClass('disabled')) {
            return;
        } else if ($(this).attr('data-index') == '...') {
            ////recalculate startButton and endButton
            //var pageToShow = $(this).attr('data-pagetoshow');
            //if (pageToShow > self.currentPage) {
            //    self.endButton = pageToShow;
            //    self.startButton = (pageToShow-self.numberOfPageToBeShown)>0?(pageToShow-self.numberOfPageToBeShown):1;
            //} else {
            //    self.startButton = pageToShow;
            //    self.endButton = (pageToShow + self.numberOfPageToBeShown) > self.totalPage ? (pageToShow + self.numberOfPageToBeShown) : self.totalPage;;
            //}
            //self.render();
        } else if ($(this).attr('data-index') != null) {
            self.currentPage = $(this).attr('data-index');
            self.render();
            if (self.onPageChanged != null) {
                self.onPageChanged();
            }
        }

    });

    $(self.container + " div.pager-info select.allPages").val(self.currentPage);
    var fromRecord = (self.currentPage - 1) * self.itemsPerPage;
    var summaryObj = {
        from: fromRecord + 1,
        to: (fromRecord + self.itemsPerPage > self.totalRecords ? self.totalRecords : (fromRecord + self.itemsPerPage)),
        total: self.totalRecords
    };
    $(self.container + " div.pager-info span.summary").html(vtpl(summary, summaryObj));
    vev(self.container + " div.pager-info select.allPages", "change", function () {
		self.currentPage=$(this).val();
	    self.render();
		if (self.onPageChanged!=null){
			self.onPageChanged();
		}
	});

    $(self.container + " div.pager-info select.itemsPerPage").val(self.itemsPerPage);
    vev(self.container + " div.pager-info select.itemsPerPage", "change", function () {
	    self.currentPage = 1;
	    self.itemsPerPage = $(this).val();
	    self.totalPage = Math.ceil(self.totalRecords / self.itemsPerPage);
	    self.render();
		if (self.onPageChanged!=null){
			self.onPageChanged();
		}
    });
    return this;
}

Pager.prototype.setVisible=function(isVisible){
	isVisible?$(this.container).show():$(this.container).hide();
}

var pageButtonNumber = '<li style="float:left; " class="{active} pageButton"><a href="javascript:;" data-pageToShow="{pageToShow}"  data-index="{value}">{value}</a></li>';
var summary = "{from}-{to} trên tổng số {total} dòng";
var pageButton=
'<li class="{disabled} {type}">' +
    '<a href="javascript:;" data-index="{value}"><i class="glyphicon {icon}"></i></a>' +
'</li>';
var selectPagesOption = '<option value="{value}">{value}</option>';
var pageTemplate =
'<ul class="pages pagination pagination-sm mt0 fl" style="display: block;  padding: 5px;">' +
'</ul>'+
'<div class="pager-info">' +
    '<span style="float:left;margin-top:10px">Tới trang: </span>' +
        '<select class="allPages form-control input-sm" style="max-width:80px;float:left;">' +
        '</select>'+
    '<span style="float:left;margin-top:10px">Số bản ghi:</span>' +
    '<select class="itemsPerPage form-control  input-sm" style="max-width:80px;float:left;">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
    '</select>' +
    '<span style="float:left;margin-top:10px" class="summary"></span>' +
'</div>'
;

