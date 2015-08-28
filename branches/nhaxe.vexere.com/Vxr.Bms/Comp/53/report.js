var r1 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['From', 'To', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route,,1,route']
    //_d: 0-Type; 1- TypeDate; 2- class; 3-function get listoption(dv select); 4- list id element; 5- referent field, 6-col, 7- id
    //Type: 1- input; 2- select;
    //TypeDate: 1- int; 2- string; 3- date;
};
var r2 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['REPORTING OFFICE', 'From', 'To', 'Office'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getBranch,agent,,1,agent']
};
var r3 = {
    _v: ['Từ', 'Đến', '', ''],
    _e: ['From', 'To', 'Trip', 'Office'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRouteN,route,,1,route', 'select,1,,getBranch,agent,,1,agent']
};
var r4 = {
    _v: ['Từ', 'Đến', '', ''],
    _e: ['From', 'To', 'Office', 'Staff'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getBranchEmployer,agent~user,,1,agent', 'select,1,,,,,1,user']
};
var r5 = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Trip', 'Departure'],
    _d: ['input,3,,reloadPickupDate,fromdate~route~pickupdate,,1,fromdate', 'select,1,,getRouteTime,route~pickupdate,,1,route', 'select,1,,,,,1,pickupdate']
};
var r6 = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Trip', 'Departure'],
    _d: ['input,3,,reloadPickupDateNo,fromdate~route~pickupdate,,1,fromdate', 'select,1,,getRouteTimeNo,route~pickupdate~fromdate,,1,route', 'select,1,,,,,1,pickupdate']
};
var r7 = {
    _v: ['N/Bán', 'N/Đi', '', ''],
    _e: ['Date', 'DepartureDate', 'Trip', 'Departure'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,reloadPickupDateNo,todate~route~pickupdate,,1,todate', 'select,1,,getRouteTimeNo,route~pickupdate~todate,,1,route', 'select,1,,,,,1,pickupdate']
};
var r8 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['FromDate', 'ToDate', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route~fromdate~todate,,1,route']
};
var r9 = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Office', 'Staff'],
    _d: ['input,3,,,,,1,fromdate', 'select,1,,getBranchEmployer,agent~user,,1,agent', 'select,1,,,,,1,user']
};
var r10 = {
    _v: ['Ngày', '', ''],
    _e: ['From', 'Office', 'Staff'],
    _d: ['input,3,,,,,1,fromdate', 'select,1,,getBranchEmployer,agent~user,,1,agent', 'select,1,,,,,1,user']
};
var r11 = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Trip', 'Departure'],
    _d: ['input,3,,,,,1,fromdate', 'select,1,,getRouteTimeNo,route~pickupdate~fromdate,,1,route', 'select,1,,,,,1,pickupdate']
};
var r12 = {
    _v: ['Từ', 'Đến', ''],
    _e: ['FromDate', 'ToDate', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route~fromdate~todate,,1,route']
};
var opt = {
    xWidth: 6,
    // chú ý typereport: '1,2,3,0' không được có khoảng trắng giữa các kí tự '1,2,3,0'
    listReport: [
        { id: 1, name: 'Phòng vé', index: 1, value: 'rp1', filter: r1, typereport: '0,1,2', rights: '5|10070|1~5|10071|1' },
        { id: 2, name: 'Tuyến xe', index: 2, value: 'rp2', filter: r2, typereport: '0,1,2', rights: '5|10070|1~5|10072|1' },
        { id: 3, name: 'Chuyến xe', index: 3, value: 'rp3', filter: r3, typereport: '0,1,2,3', rights: '5|10070|1~5|10073|1' },
        { id: 4, name: 'Khách hàng theo chuyến', index: 4, value: 'rp4', filter: r5, typereport: '0,1,2', rights: '5|10070|1~5|10074|1' },
        { id: 5, name: 'Nhân viên tại văn phòng', index: 5, value: 'rp5', filter: r3, typereport: '0,1,2,3', rights: '5|10070|1~5|10075|1' },
        { id: 6, name: 'Nhân viên theo ngày', index: 6, value: 'rp6', filter: r10, typereport: '0,1,2', rights: '5|10070|1~5|10076|1' },
        { id: 7, name: 'Doanh thu phòng vé theo ngày', index: 7, value: 'rp8', filter: r7, typereport: '1,2,3,0', rights: '5|10070|1~5|10077|1' },
        { id: 8, name: 'Vé bán của phòng vé theo ngày', index: 8, value: 'rp9', filter: r12, typereport: '0,1,2', rights: '5|10070|1~5|10078|1' },
        { id: 9, name: 'Vé bán của nhân viên theo ngày', index: 9, value: 'rp10', filter: r8, typereport: '0,1,2', rights: '5|10070|1~5|10079|1' },
        //{ id: 10, name: 'Báo cáo thu tiền', index: 10, value: 'rp11', filter: r4, typereport: '0,1,2,3' },
        { id: 10, name: 'Doanh thu theo chuyến', index: 10, value: 'rp13', filter: r11, typereport: '0,1,2', rights: '5|10070|1~5|10080|1' }

        //{ id: 11, name: 'Doanh thu văn phòng theo ngày', index: 11, value: 'rp12', filter: r9, typereport: '0,1,2' }
    ],
    wReport: 1,
    viewNameReport: 1, // 0: Chỉ hiển thị name của report; 1: stt/ name
};