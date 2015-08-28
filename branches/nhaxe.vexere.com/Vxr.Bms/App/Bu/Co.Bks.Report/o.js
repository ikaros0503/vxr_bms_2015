var jVar = {
    getAccountFunction: 'fGetAccountFromTable',
    getAccountCondition: {
        Id: app.uid,
        Type: 1,
        IsPrgStatus: 1,
    },
    getAccountFields: 'Id, Username, AgentId, RoleGroups',
    filterDateFormat: 'dd/mm/yy',
    errorMessage_LoadReport: 'Báo cáo loại này hiện tại chưa có',
};
var jHtml = {
    reportTypes: '#type-report',
    content: '',
    fromDate: '#fromdate',
    toDate: '#todate',
    buttonCreateReport: '#create-report',
    buttonPrintReport: "#print-report",
    buttonExcel: "#openExcel",
    contentBox: "#contentrpbox",
    filterBox: '#customizerpbox',
    reportTypesBox: "#typerpbox",
    filterDefaultRouteOption: '<option value="" selected="selected">----Chọn tuyến đường----</option>',
    filterDefaultCompanyOption: '<option value="" selected="selected">----Chọn hãng xe----</option>',
    filterDefaultUserOption: '<option value="" selected="selected">----Chọn tài khoản----</option>',
    filterDefaultTripTimeOption: '<option value="" selected="selected">----Chọn chuyến----</option>',
    filterUserOption: '<option data-agentId="{agentId}" value="{value}" selected="selected">{display}</option>',
    filterDefaultBranhAndAgentOption: '<option value="" selected="selected">----Chọn chi nhánh/đại lí----</option>',
    filterDefaultBranhOption: '<option value="" selected="selected">----Chọn chi nhánh----</option>',
    filterBranhAndAgentOption: '<option value="" selected="selected">----Chọn chi nhánh/đại lí----</option>',
    largeResult: 'largeResult',
    largeResultHtml:
        '<div class="largeResult">' +
            '<span>Dữ liệu nhiều quá rồi, vui lòng xem <a target="_blank" href={link}>file Excel</a> nhé<span> <br />' +
        '</div>',
    loadingSpinner: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
    excelLink: 'a.linkReport',
    reportTypesSelect: '<select id="type-report" class="form-control" style="padding:6px 0px 6px 40px;"/>',
    reportTypeOption: '<option data-index="{index}" value="{value}" id="Option{index}">{text}</option>',
    reportHelpHtml:
                '<div class="form-group explain-report" style="position:absolute;top:0" data-toggle="popover" data-placement="bottom" data-original-title="{title}">' +
                    '<button class="btn btn-info">' +
                        '<i class="glyphicon glyphicon-question-sign"></i>' +
                    '</button>' +
                '</div>',
    filterHtml:
        '<div class="pl0 col-md-2 col-sm-6 col-xs-6">' +
            '<div class="form-group">' +
                '<label style="display:{labelDisplay}" class="col-sm-3 control-label">{label}</label>' +
                '<div class="{class1}">' +
                    '{element}' +
                    '<span style="display:{spanDisplay}" class="input-group-addon btn btn-default">' +
                        '<span class="glyphicon glyphicon-calendar"/>' +
                    '</span>' +
                '</div>' +
            '</div>' +
        '</div>'
        ,
    printHtml:
        '<div>' +
            '<style type="text/css">' +
                'table{width:100%;}' +
                'table td{padding-left: 8px;padding-right: 8px;}' +
                '.table-baocao table.table {background: #fff;margin-top: 10px;}' +
                '.table-baocao .danger-total h3, .table-baocao .success-total h4 {margin: 0 0;}' +
                '.table-baocao td.danger-total {background-color: #FFA5A5 !important;border-top: 2px #EC5B5B solid;font-size: 22px;font-weight: 500;line-height: 1.1;}' +
                '.table-baocao td.success-total {background-color: #dff0d8 !important;font-size: 16px;font-weight: 500;line-height: 1.1;}' +
                '.mw120 {width: 120px !important;}' +
                '.rptTDHeader {background: linear-gradient(to bottom, rgba(242, 245, 246, 1) 0%, rgba(227, 234, 237, 1) 37%, rgba(200, 215, 220, 1) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0) !important;line-height: 1.42857!important;font-weight: bold;}' +
                '.text-right{text-align:right;}' +
            '</style>' +
        '</div>',
    initHtml:
        '<div id="filterrpbox" class="filter panel">' +
            '<div class="col-md-12 col-sm-12 col-xs-12 panel panel-sm">' +
                '<div class="col-md-4 col-sm-6 col-xs-12 pl0 mb5-xs mb5" id="typerpbox"></div>' +
                '<div class="col-md-8 col-sm-6 col-xs-12 pl0 mb5-xs mb5 btn-filter">' +
                    '<div class="col-md-12 col-sm-12 pr0 pl0 text-right">' +
                        '<button class="btn btn-sm btn-primary" type="button" id="create-report">' +
                            '<i class="glyphicon glyphicon-file" ></i> Tạo báo cáo' +
                        '</button>' +
                        ' <button class="btn btn-sm btn-success" type="button" id="print-report">' +
                            '<i class="glyphicon glyphicon-print"></i> In báo cáo' +
                        '</button>' +
                        ' <a class="btn btn-sm btn-info"  type="button" id="openExcel">' +
                            '<i class="glyphicon glyphicon-print"></i> Xuất Excel' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '<div class="col-md-12 col-sm-12 col-xs-12 pr0 pl0" id="customizerpbox">' +
            '</div>' +
        '</div>' +
        '<div id="contentrpbox" style="min-height: 480px" class="table-baocao table-responsive col-md-12"/>',

    buttonBoxHtml: '<div class="pr0 pl0 btn-filter">' +
                    '<div class="col-md-12 col-sm-12 pr0 pl0 text-right">' +
                        '<button class="btn btn-sm btn-primary" type="button" id="create-report">' +
                            '<i class="glyphicon glyphicon-file" ></i> Tạo báo cáo' +
                        '</button>' +
                        ' <button class="btn btn-sm btn-success" type="button" id="print-report">' +
                            '<i class="glyphicon glyphicon-print"></i> In báo cáo' +
                        '</button>' +
                    '</div>' +
                '</div>',
}
var rCustomerByTrip = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Trip', 'Departure'],
    _d: ['input,3,,reloadPickupDate,fromdate~route~pickupdate,,1,fromdate', 'select,1,,getRouteTime,route~pickupdate,,1,route', 'select,1,,,,,1,pickupdate']
};
var rRevenueByTrip = {
    _v: ['Ngày', '', ''],
    _e: ['Date', 'Trip', 'Departure'],
    _d: ['input,3,,,,,1,fromdate', 'select,1,,getRouteTimeNo,route~pickupdate~fromdate,,1,route', 'select,1,,,,,1,pickupdate']
};
var rRevenueByRoute = {
    _v: ['Từ', 'Đến', ''],
    _e: ['From', 'To', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route,,1,route']
};
var rFromToTripOfficeStaff = {
    _v: ['Từ', 'Đến', '', '', ''],
    _e: ['From', 'To', 'Trip', 'Office', 'Staff'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route,,1,route', 'select,1,,getBranchEmployer,agent~user,,1,agent', 'select,1,,getUser,user~agent,,1,user']
};
var rFromToTripOffice = {
    _v: ['Từ', 'Đến', '', ''],
    _e: ['From', 'To', 'Trip', 'Office'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route,,1,route', 'select,1,,getBranchAndAgents,agent,,1,agent']
};
var rVexereRevenue = {
    _v: ['Từ', 'Đến', ''],
    _e: ['From', 'To', 'Trip'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getRoute,route,,1,route']
};
var rVexere = {
    _v: ['Từ', 'Đến', '',''],
    _e: ['From', 'To','Comp','Route'],
    _d: ['input,3,,,,,1,fromdate', 'input,3,,,,,1,todate', 'select,1,,getComp,comp~route,,1,comp', 'select,1,,,route,,1,route']
};
var opt = {
    xWidth: 6,
    // chú ý typereport: '1,2,3,0' không được có khoảng trắng giữa các kí tự '1,2,3,0'
    listReport: [
        { id: 1, name: 'Khách hàng theo chuyến', index: 1, value: 'rpCustomerByTrip', filter: rCustomerByTrip, typereport: '0,1,2', rightId: $.rights.rRp1.val },
        //{ id: 1, name: 'Khách hàng theo chuyến', index: 1, value: 'rpCustomerByTripForSapa', filter: rCustomerByTrip, typereport: '0,1,2', rightId: $.rights.rRp1.val },
        { id: 2, name: 'Doanh thu nhân viên theo Ngày bán vé', index: 2, value: 'rpStaffBySoldDate', filter: rFromToTripOfficeStaff, typereport: '0,1,2,3,4', rightId: $.rights.rRp2.val },
        { id: 3, name: 'Doanh thu nhân viên theo Ngày khởi hành', index: 3, value: 'rpStaffByPickupDate', filter: rFromToTripOfficeStaff, typereport: '0,1,2,3,4', rightId: $.rights.rRp3.val },
        { id: 4, name: 'Doanh thu chi nhánh / đại lý theo Ngày bán vé', index: 4, value: 'rpAgentOrBranchBySoldDate', filter: rFromToTripOffice, typereport: '0,1,2,3', rightId: $.rights.rRp4.val },
        { id: 5, name: 'Doanh thu chi nhánh / đại lý theo Ngày khởi hành', index: 5, value: 'rpAgentOrBranchByPickupDate', filter: rFromToTripOffice, typereport: '0,1,2,3', rightId: $.rights.rRp5.val },
        { id: 6, name: 'Doanh thu theo chuyến xe', index: 6, value: 'rpRevenueByTrip', filter: rRevenueByTrip, typereport: '0,1,2', rightId: $.rights.rRp6.val },
        { id: 7, name: 'Doanh thu theo tuyến', index: 7, value: 'rpRevenueByRoute', filter: rRevenueByRoute, typereport: '0,1,2', rightId: $.rights.rRp7.val },
        { id: 8, name: 'Doanh thu chi nhánh theo tuyến', index: 8, value: 'rpBranchByRoute', filter: rFromToTripOffice, typereport: '0,1,2,3', rightId: $.rights.rRp8.val },
        { id: 9, name: 'Doanh thu Vexere', index: 9, value: 'rpVexereRevenue', filter: rVexereRevenue, typereport: '0,1,2', rightId: $.rights.rRp9.val },
        //{ id: 10, name: 'Vé bán của Vexere', index: 10, value: 'rpVexere', filter: rVexere, typereport: '0,1,2,3', rightId: $.rights.rRp9.val }
        //{ id: 12, name: 'Doanh thu nhân viên theo người đặt', index: 12, value: 'rpRevenueByCreatedUser', filter: rFromToTripOfficeStaff, typereport: '0,1,2,3,4', rightId: $.rights.rRp2.dtr }
    ],
    wReport: 1,
    viewNameReport: 1, // 0: Chỉ hiển thị name của report; 1: stt/ name
};
//account info
var accInfo = {

};
var role = {
    admin: 1,
    office: 2,
    reporter: 3,
    seller: 4,
    officeManager: 5
};
var helps = [
    { id: 1, ex: "Để phòng tránh những trường hợp mất phơi, không in được phơi theo cách thông thường, mảng Báo Cáo này không chỉ giúp nhà xe thống kê nhanh lượng khách hàng đặt vé và doanh thu theo 1 chuyến/tuyến mà còn có thể trở thành 1 Phơi dự bị với đầy đủ thông tin về mã ghế, tên hành khách, số điện thoại, nơi đón và trung chuyển" },
    { id: 2, ex: "Báo Cáo giúp nhân viên co thể kiểm tra doanh thu bán vé trong 1 tuyến ở 1 chi nhánh theo một khoảng thời gian nhất định. Quản lý sẽ kiểm tra doanh số nhân viên tại đại lý/chi nhánh đó. Còn nhà xe sẽ quản lý tổng tất cả Nhân viên ở mọi đại lý/chi nhánh." },
    { id: 3, ex: "Báo Cáo giúp nhân viên có thể kiểm tra doanh thu bán vé của một tuyến với nhiều ngày khởi hành khác nhau ở 1 chi nhánh theo một khoảng thời gian nhất định. Quản lý sẽ kiểm tra doanh số nhân viên tại đại lý/chi nhánh đó. Còn nhà xe sẽ quản lý tổng tất cả Nhân viên ở mọi chi nhánh." },
    { id: 4, ex: "Báo Cáo giúp chi nhánh/đại lý có thể kiểm tra doanh thu bán vé của một tuyến theo một khoảng thời gian bán vé nhất định" },
    { id: 5, ex: "Báo Cáo giúp chi nhánh/đại lý có thể kiểm tra doanh thu bán vé của một tuyến với nhiều ngày khởi hành khác nhau theo một khoảng thời gian nhất định" },
    { id: 6, ex: "Báo Cáo giúp nhà xe có thể kiểm tra ở từng chi nhánh/đại lý khác nhau đã bán được bao nhiêu vé chuyến đó và xem doanh thu của chuyến trong cùng ngày và giờ khởi hành" },
    { id: 7, ex: "Báo Cáo giúp nhà xe có thể kiểm tra tuyến được chọn ở mỗi văn phòng có bao nhiêu chuyến và  doanh thu bán vé tuyến đó trong một khoảng thời gian nhất định." },
    { id: 8, ex: "Báo Cáo giúp nhà xe có thể kiểm tra tuyến ở chi nhánh/đại lý đó có bao nhiêu chuyến và doanh thu bán vé của tuyến đó trong một khoảng thời gian nhất định." },
    { id: 9, ex: "Báo Cáo giúp nhà xe kiểm tra các vé được đặt hoặc thanh toán từ Vexere." },
    //{ id: 12, ex: "Doanh thu tính theo người đặt vé" }
    //{ id: 10, ex: "Báo Cáo bán vé của Vexere." }
];

