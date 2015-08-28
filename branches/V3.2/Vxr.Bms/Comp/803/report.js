//var r4 = {
//    _v: ['Từ', 'Đến', '', ''],
//    _e: ['From', 'To', 'Office', 'Staff'],
//    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getBranchEmployer,agent~user,,1,agent', 'select,1,,,,,1,user']
//};
//var r6 = {
//    _v: ['Ngày', '', ''],
//    _e: ['Date', 'Trip', 'Departure'],
//    _d: ['input,3,,reloadPickupDateNo,fromdate~route~pickupdate,,1,fromdate', 'select,1,,getRouteTimeNo,route~pickupdate~fromdate,,1,route', 'select,1,,,,,1,pickupdate']
//};


//var r9 = {
//    _v: ['Ngày', '', ''],
//    _e: ['Date', 'Office', 'Staff'],
//    _d: ['input,3,,,,,1,fromdate', 'select,1,,getBranchEmployer,agent~user,,1,agent', 'select,1,,,,,1,user']
//};
var r1 = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Trip', 'Departure'], 
    _d: ['input,3,,reloadPickupDate,fromdate~route~pickupdate,,1,fromdate', 'select,1,,getRouteTime,route~pickupdate,,1,route', 'select,1,,,,,1,pickupdate']
};
var r2 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['FromDate', 'ToDate', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route~fromdate~todate,,1,route']
};
var r3 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['FromDate', 'ToDate', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route~fromdate~todate,,1,route']
};
var r4 = {
    _v: ['Ngày', '', ''],
    _e: ['From', 'Office', 'Staff'],
    _d: ['input,3,,,,,1,fromdate', 'select,1,,getBranchEmployer,agent~user,,1,agent', 'select,1,,,,,1,user']
};
var r5 = {
    _v: ['Từ', 'Đến', '', ''],
    _e: ['From', 'To', 'Trip', 'Office'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRouteN,route,,1,route', 'select,1,,getBranch,agent,,1,agent']
};
var r6 = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Trip', 'Departure'],
    _d: ['input,3,,,,,1,fromdate', 'select,1,,getRouteTimeNo,route~pickupdate~fromdate,,1,route', 'select,1,,,,,1,pickupdate']
};
var r7 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['From', 'To', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route,,1,route']
};
var r8 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['REPORTING OFFICE', 'From', 'To', 'Office'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getBranch,agent,,1,agent']
};
var r9 = {
    _v: ['Từ', 'Đến', '', ''],
    _e: ['From', 'To', 'Trip', 'Office'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRouteN,route,,1,route', 'select,1,,getBranch,agent,,1,agent']
};
var r10 = {
    _v: ['N/Bán', 'N/Đi', '', ''],
    _e: ['Date', 'DepartureDate', 'Trip', 'Departure'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,reloadPickupDateNo,todate~route~pickupdate,,1,todate', 'select,1,,getRouteTimeNo,route~pickupdate~todate,,1,route', 'select,1,,,,,1,pickupdate']
};
var r12 = {
    _v: ['Từ', 'Đến', '', ''],
    _e: ['From', 'To', 'Trip', 'Office'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRouteN,route,,1,route', 'select,1,,getAgent,agent,,1,agent']
};
var r13 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['From', 'To', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route,,1,route']
};


var opt = {
    xWidth: 6,
    // chú ý typereport: '1,2,3,0' không được có khoảng trắng giữa các kí tự '1,2,3,0'
    listReport: [
        //{ id: 10, name: 'Báo cáo thu tiền', index: 10, value: 'rp11', filter: r4, typereport: '0,1,2,3' },
        //{ id: 10, name: 'Doanh thu theo chuyến xe', index: 10, value: 'rp13', filter: r11, typereport: '0,1,2' },
        //{ id: 11, name: 'Doanh thu văn phòng theo ngày', index: 11, value: 'rp12', filter: r9, typereport: '0,1,2' }
        { id: 1, name: 'Khách hàng theo chuyến', index: 1, value: 'rp1', filter: r1, typereport: '0,1,2', rightId: '10071' },
        { id: 2, name: 'Doanh thu nhân viên theo ngày', index: 2, value: 'rp2', filter: r2, typereport: '0,1,2', rightId: '10072' },
        { id: 3, name: 'Doanh thu phòng vé theo ngày', index: 3, value: 'rp3', filter: r3, typereport: '0,1,2', rightId: '10073' },
        { id: 4, name: 'Doanh thu nhân viên trong ngày', index: 4, value: 'rp4', filter: r4, typereport: '0,1,2', rightId: '10074' },
        { id: 5, name: 'Doanh thu nhân viên theo văn phòng', index: 5, value: 'rp5', filter: r5, typereport: '0,1,2,3', rightId: '10075' },
        { id: 6, name: 'Doanh thu theo chuyến xe', index: 6, value: 'rp6', filter: r6, typereport: '0,1,2', rightId: '10076' },
        { id: 7, name: 'Doanh thu theo tuyến', index: 7, value: 'rp7', filter: r7, typereport: '0,1,2', rightId: '10077' },
        { id: 8, name: 'Doanh thu phòng vé theo tuyến', index: 8, value: 'rp8', filter: r8, typereport: '0,1,2', rightId: '10078' },
        { id: 9, name: 'Doanh thu phòng vé theo chuyến xe', index: 9, value: 'rp9', filter: r9, typereport: '0,1,2,3', rightId: '10079' },
        { id: 10, name: 'Doanh thu đại lý theo ngày', index: 10, value: 'rp12', filter: r12, typereport: '0,1,2,3', rightId: '10082' },
        { id: 11, name: 'Doanh thu bán vé online', index: 11, value: 'rp13', filter: r13, typereport: '0,1,2', rightId: '10083' }
        //{ id: 10, name: 'Doanh thu phòng vé theo ngày', index: 10, value: 'rp10', filter: r10, typereport: '1,2,3,0' }
        //{ id: 11, name: 'Doanh thu nhân viên trong ngày', index: 11, value: 'rp11', filter: r4, typereport: '0,1,2', rightId: '10081' }

    ],
    wReport: 1,
    viewNameReport: 1, // 0: Chỉ hiển thị name của report; 1: stt/ name
};

var helps = [
    { id: 1, ex : "Báo cáo danh sách khách hàng theo từng chuyến xe."},
    { id: 2, ex : "Báo cáo doanh thu của từng nhân viên theo ngày."},
    { id: 3, ex : "Báo cáo doanh thu của từng phòng vé theo ngày."},
    { id: 4, ex : "Báo cáo doanh thu của nhân viên trong ngày."},
    { id: 5, ex : "Báo cáo doanh thu của nhân viên theo từng văn phòng."},
    { id: 6, ex : "Báo cáo doanh thu theo từng chuyến xe."},
    { id: 7, ex : "Báo cáo doanh thu theo từng tuyến đường."},
    { id: 8, ex : "Báo cáo doanh thu của phòng vé theo từng tuyến đường."},
    { id: 9, ex : "Báo cáo doanh thu của phòng vé theo từng chuyến xe." },
    { id: 10, ex: "Báo cáo doanh thu đại lý theo ngày." },
    { id: 10, ex: "Báo cáo bán vé online." }
]