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
