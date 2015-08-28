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
    //mProduct: { val: '', dtr: 'S60000' },                  //Hàng hóa
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
    mCus: { val: '', dtr: 'S30000' },                     //Quản lý khách hàng
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
    rRp61: { val: '4061', dtr: '' },                  //Báo cáo số 61
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
    hbookingbyDate: { val: '1|10063|1', dtr: '' }, // Req_Hide phơi/dữ liệu
    cReDeFo: { val: '1|10067|1', dtr: '' }, // Hủy vé hoàn toàn
    bMoOl: { val: '1|10068|1', dtr: '' }, // Move vé đặt online
    bUpOl: { val: '1|10069|1', dtr: '' } // Update vé đặt online
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