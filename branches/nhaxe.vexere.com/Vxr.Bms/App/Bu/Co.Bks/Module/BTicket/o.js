var paging = {
    total: 1,
    current: 1,
    itemsPerPage: 10,
    totalRecords: 0
};

var tickets = [];
var result = [];

//var filter= {
//    code: "",
//    date: new Date(),
//    compName:"",
//    customerInfo: "",
//    account:"",
//}
var filter = {

};


var jVar = {
    isLoading:false,
    getTicketFunction: 'fGetBTickets',
    //getTicketFunction: 'pGetBTickets',
    updateTicketFunction: 'UpdateTicket',
    sortBy: 'IsPrgCreatedDate desc',
    dateDisplayFormat: 'dd-mm-yyyy',
    timeDisplayFormat: 'hh:mm',
    fieldsToGet: [
        "Code", //1
        "Type",
        "Status",
        "TripDate",
        "SeatCode", //5
        "IssueDate",
        "PickupDate",
        "CustomerInfo",
        "Fare",
        "Note", //10
        "PickupInfo",
        "PaymentInfo",
        "CreatedUser",
        "UserCharge",
        "FromArea", //15
        "ToArea", "" +
        "CanceledDate",
        "VexerePaymentInfo",
        "VexerePaymentType",
        "CompName",//20
        "CanceledUser",
        "IsConfirmed",
        "IsPrgCreatedDate",
        "CancelType",
        "TripName",//25
        "TransactionId",
        "ChargeDate",
        "Id",
        "TransactionGateway",
        "TransactionDate", //30
        "TransactionStatus",
        "TransactionNLPaymentType",
        "TransactionBankCode",
        "TransactionDescription",
        "TransactionChecksum"
    ],
    //fieldsToGet: [
    //    "Code", //1
    //    "Type",
    //    "Status",
    //    "TripDate",
    //    "SeatCodes", //5
    //    "IssueDate",
    //    "PickupDate",
    //    "CustomerInfo",
    //    "TotalFare",
    //    "Note", //10
    //    "PickupInfo",
    //    "PaymentInfo",
    //    "CreatedUser",
    //    "UserCharge",
    //    "FromArea", //15
    //    "ToArea", "" +
    //    "CanceledDate",
    //    "VexerePaymentInfo",
    //    "VexerePaymentType",
    //    "CompName",//20
    //    "CanceledUser",
    //    "IsConfirmed",
    //    "IsPrgCreatedDate",
    //    "CancelType",
    //    "TripName",//25
    //    "TransactionId",
    //    "ChargeDate",
    //    "Id",
    //    "TransactionGateway",
    //    "TransactionDate", //30
    //    "TransactionStatus",
    //    "TransactionNLPaymentType",
    //    "TransactionBankCode",
    //    "TransactionDescription",
    //    "TransactionChecksum"
    //],
    //fieldsToGet: ["Id", "TripId", "AgentId", "TripDate", "SeatCode", "IssueDate", "PickupDate", "CustomerInfo", "Status", "Fare", "Note", "PickupInfo", "Serial", "PaymentInfo", "IsPrgHistoryInfo", "Code", "PassCode", "FromValid", "ToValid", "IsPrgUpdatedDate", "AgentInfo", "Surcharge", "TripAlias", "CreatedUser", "UserCharge", "StageCode", "Deposit", "Discount", "FromArea", "ToArea", "SeatType", "Debt", "CanceledDate", "CancelInfo", "Type", "VexerePaymentInfo", "VexerePaymentType", "CompName", "CanceledUser", "IsConfirmed", "IsPrgCreatedDate", "CompId", "CancelType", "TripName", "TransactionId"],
    conditionString:
        " IsPrgCreatedDate>='{selectedDate}' and IsPrgCreatedDate<'{nextDate}'"
        + " {code} "
        + " {compName} "
        + " {customerInfo} "
        + " {account} "
        + " {status} "
        + " {tripDateStr} "
        + " and {type} "
        
    ,
}

var jHtml = {
    mainContainer: '#bTickets',
    tableContainerHtml: '<div id="divTable" />',
    pageNav: '<div class="col-md-12 col-sm-2" id="divPaging" />',
    pagingContainer: '#divPaging',
    tableBody: '#tblBTicketsBody',
    filterDate: '#txtFromDate',
    filterToDate: '#txtToDate',
    filterTripDate: '#txtTripDate',
    filterCode: '#txtCode',
    filterCompName: '#txtName',
    filterCustomer: '#txtNameOrPhone',
    filterAccount: '#txtAccount',
    allTextFilter: '#bTickets input.filter-textbox',
    confirmedButtons: 'img.btn-confirm',
    refreshButton: "#btnRefresh",
    showMoreButton:"a.showMore",
    ticketCodeButtons: 'a.ticketCode',
    mnuSource: '#mnuSource',
    mnuSourceItems: '.mnuSource li a',
    mnuStatus: '#mnuStatus',
    mnuStatusItems: '.mnuStatus li a',
    mnuCommandsItems: '.commands a',
    //isConfirmed: '<div class="isConfirmed">Đã xác nhận</div>',
    isConfirmed: '<div class="switch"><input id="chkConfirm{index}" data-id="{id}" data-index="{index}" data-code="{code}"  class=" chkConfirm cmn-toggle cmn-toggle-round" type="checkbox" checked><label for="chkConfirm{index}"></label></div><div class="confirmStatus" id="confirmStatus{index}"></div>',
    notConfirmed: '<div class="switch"><input id="chkConfirm{index}" data-id="{id}" data-index="{index}"  data-code="{code}"    class=" chkConfirm cmn-toggle cmn-toggle-round" type="checkbox"><label for="chkConfirm{index}"></label></div><div  class="confirmStatus"  id="confirmStatus{index}"></div>',
    loadingAnimation: '<tr><td colspan="12"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><td></tr>',
    loadingSpinner: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
    noTicketAlert:
        '<blockquote class="oval-thought">' +
            '<p>Không có vé nào hết</p>' +
        '</blockquote>' +
        '<section id="wrapper">' +

            '<div class="smiley-red floatleft">' +
            '<div class="left-eye"></div>'+
            '<div class="right-eye"></div>'+
            '<div class="smile"></div>'+
          '</div>'+
        '</section>'
          ,
    selectPages: '#selPaging',
    allPageButtons: '#divPaging .pagination a',
    firstPageButton: '#divPaging .first',
    previousPageButton: '#divPaging .previous',
    nextPageButton: '#divPaging .next',
    lastPageButton: '#divPaging .last',
    selectItemsPerPage: '#selItemsPerPage',
    selectPagesOption: '<option value="{value}">{value}</option>',
    pageButton: '<li class="pageButton"><a href="javascript:;" data-index="{value}">{value}</a></li>',
    selectedPageButton: '<li class="active pageButton"><a href="javascript:;" data-index="{value}">{value}</a></li>',
    paging:
        '<ul class="pagination pagination-sm mt0 fl" style="display: block;">' +
            '<li class="disabled first">' +
                '<a href="javascript:;" data-index="1"><i class="glyphicon glyphicon-fast-backward"></i></a>' +
            '</li>' +
            '<li class="disabled previous">' +
                '<a href="javascript:;" data-index="{previous}"><i class="glyphicon glyphicon-backward"></i></a>' +
            '</li>' +
            '{allPages}' +
            '<li class="disabled next">' +
                '<a href="javascript:;" data-index="{next}"><i class="glyphicon glyphicon-forward"></i></a>' +
            '</li>' +
            '<li class="disabled last">' +
                '<a href="javascript:;" data-index="{total}"><i class="glyphicon glyphicon-fast-forward"></i></a>' +
            '</li>' +
        '</ul>' +
        '<div class="fl ml20">' +
            '<span style="padding-top: 8px; padding-right: 5px; display: block;" class="fl">Tới trang: </span>' +
                '<select id="selPaging" name="JumpPage" class="form-control fl input-sm" style="width: 60px; display: block;">' +
                    '{selectPageNumbers}'+
                '</select>'+
            '<span style="padding-top: 8px; padding-left: 20px; padding-right: 5px; display: block;" class="fl">Số bản ghi:</span>' +
            '<select id="selItemsPerPage" name="PageSize" class="form-control fl input-sm" style="width: 60px; display: block;">' +
                '<option value="10">10</option>' +
                '<option value="20">20</option>' +
                '<option value="30">30</option>' +
                '<option value="40">40</option>' +
                '<option value="50">50</option>' +
            '</select>' +
        '</div>'
    ,
    headerTpl : '<div class="">' +
		            '<div class="">'+
        	            '<form class="form-inline row" role="form">'+
            	            '<table class="table table-hover alternative">'+
                	            '<thead class="tatcave-filter">' +
	                                '<tr>' +
                                        '<td class="action"><button type="button" class="btn " id="btnRefresh">Làm mới</button></td>' +
                                        '<td class="date">' +
                        	            '<div class="input-group input-group-sm fl">' +
                                            '<input title="Chọn ngày đi" type="text" id="txtTripDate" class="form-control filter-textbox" placeholder="Ngày chạy">' +
                                        '</div>' +
                                    '</td>' +
                                    '<td class="ticketCode">' +
                        	                '<div class="input-group input-group-sm fl">'+
                                                '<input title="Bạn có thể lọc theo mã vé khi gõ vào ô này" style="width: 85%; margin-left:15%"  id="txtCode"  type="text" class="form-control filter-textbox" placeholder="Mã vé">' +
                                            '</div>'+
                                        '</td>' +
                                    
                                    '<td class="date">'+
                        	            '<div class="input-group input-group-sm fl">'+
                                            '<input title="Chọn ngày bắt đầu" type="text" id="txtFromDate" class="form-control filter-textbox" placeholder="Ngày-Giờ đi">' +
                                        '</div>'+
                                    '</td>' +
                                    '<td class="date">' +
                        	            '<div class="input-group input-group-sm fl">' +
                                            '<input title="Chọn ngày kết thúc" type="text" id="txtToDate" class="form-control filter-textbox" placeholder="Ngày-Giờ đi">' +
                                        '</div>' +
                                    '</td>' +
                                    '<td class="name">'+
                        	            '<div class="input-group input-group-sm fl">'+
                                            '<input title="Bạn có thể lọc theo hãng xe hoặc số ghế khi gõ vào ô này" id="txtName" type="text" class="form-control  filter-textbox" placeholder="Hãng xe">' +
                                        '</div>'+
                                    '</td>'+
                                    '<td class="name">'+
                        	            '<div class="input-group input-group-sm fl">'+
                                            '<input  title="Bạn có thể lọc theo tên khách hoặc số điện thoại khi gõ vào ô này" id=txtNameOrPhone type="text" class="form-control  filter-textbox" placeholder="Tên/SĐT">' +
                                        '</div>'+
                                    '</td>'+
                                    '<td class="money" style="vertical-align: middle;"> <span>Tổng tiền</span></td>' +

                                    '<td class="status" style="vertical-align: middle;">' +
                                        '<div class="dropdown">'+
                                            '<button class="btn dropdown-toggle" type="button" id="mnuStatus" data-toggle="dropdown" data-status="-1" aria-expanded="true">'+
                                                'Trạng thái&nbsp;<span class="caret"></span>'+
                                            '</button>'+
                                            '<ul class="dropdown-menu mnuStatus" role="menu" aria-labelledby="mnuStatus">' +
                                                '<li role="presentation"><a role="menuitem"  class="selected"  tabindex="-1" data-status="-1" >Tất cả</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-status="1" >Đặt chỗ</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-status="2" >Đã thanh toán</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-status="3" >Đã hủy</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-status="30" >Đã hủy (Tự động)</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-status="31" >Đã hủy (Khi chọn ghế)</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-status="32" >Đã hủy (Ngân lượng)</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-status="33" >Đã hủy (123Pay)</a></li>' +

                                              '</ul>'+
                                            '</div>' +
                                    '</td>'+
                                    
                                    '<td class="user" >'+
                        	            '<div class="input-group input-group-sm fl">'+
                                          '<input title="Bạn có thể lọc theo nhân viên khi gõ vào ô này" id="txtAccount" type="text" class="form-control  filter-textbox" placeholder="Người đặt">' +
                                        '</div>'+
                                    '</td>'+
                                    '<td class="source" style="vertical-align: middle;">' +
                                        '<div class="dropdown">' +
                                            '<button class="btn dropdown-toggle" type="button" data-type="-1" id="mnuSource" data-toggle="dropdown" aria-expanded="true">' +
                                                'Nguồn&nbsp;<span class="caret"></span>' +
                                            '</button>' +
                                            '<ul class="dropdown-menu mnuSource" role="menu" aria-labelledby="mnuSource">' +
                                                '<li role="presentation"><a class="selected" role="menuitem" tabindex="-1" data-type="-1" >Tất cả</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-type="2" >Online</a></li>' +
                                                '<li role="presentation"><a role="menuitem" tabindex="-1" data-type="3" >VMS</a></li>' +
                                              '</ul>' +
                                        '</div>' +
                                    '</td>' +
                                    '<td class="confirmed" style="vertical-align: middle;">' +
                                        '<span>Xác nhận</span>' +
                                    '</td>' +
                                '</tr>'+
                            '</thead>' +
                            '<tbody id="tblBTicketsBody">' +
                                
                            '</tbody>'+
                        '</table>'+
                    '</form>'+
                '</div>' +
            '</div>',
    itemTpl :
    '<tr >' +
        '<td> ' +
            '<a class=" showMore arrow-wrap" data-index="{index}" >'+
               '<span class="arrow"></span>'+
            '</a>'+
        '</td>'+
        '<td class="date">' +
            '<h5 class="thin p-black">{tripDate}<br><small><i class="glyphicon glyphicon-time p-silver pr5"></i>{tripTime}</small> </h5>' +
        '</td>' +
        '<td>' +
            '<a class="ticketCode" data-compId={compId} data-tripId="{tripId}" data-code="{code}" data-tripDate="{tripDate}" data-seat="{seat}" data-tripTime="{tripTime}" href="#">{code}</a>' +
        '</td>' +
        '<td colspan="2" class="date">' +
            '<h5 class="thin p-black">{createdDate}<br><small><i class="glyphicon glyphicon-time p-silver pr5"></i>{createdTime}</small> </h5>' +
        '</td>'+
        '<td>' +
            '<h5 class="thin">{companyName}<br><small>{seat}</small></h5>' +
        '</td>'+
        '<td>' +
            '<h5 class="thin">{customerPhone}<br><small>{customerName}</small></h5>' +
        '</td>'+
        '<td>' +
            '<span class=""> {moneyFormatted}</span><br />' +
            '<span style="font-size: smaller;color: #777;"> {fareFormatted}x{totalSeats}</span>' +
        '</td>'+
        '<td>' +
            '<div>' +
                '<span  class="{statusClass}">{status1} </span> <br />' +
                '<span style="display:{status2Display}">{status2}</span> <br />' +
                '<span style="display:{status3Display}">{status3}</span>' +
            '</div>' +
        '</td>'+
        '<td>' +
            '<p class="mb0">{createdUser}</p>'+
        '</td>'+
        '<td>' +
            '<p class="mb0">{source}</p>' +
        '</td>' +
        '<td>' +
            '{isConfirmed}' +
        '</td>' +
      '</tr>' +
        '<tr id="hiddenRow{index}" style="display:none;">' +
            '<td></td>' +
            '<td colspan="11">' +
                '<div class="extraInfo">' +
                   '<div class="info-group">' +
                        '<div class="header">' +
                            '<img src="Content/images/bus.png" />' +
                            '<span>{tripName}</span>' +
                        '</div>' +
                        '<ul class="info">' +
                            '<li><img src="Content/images/location.png" />' +
                                '<span>{fromArea}</span> <span>→</span>  ' +
                                '<span>{toArea}</span>' +
                            '</li>' +
                            '<li>' +
                                '<img src="Content/images/time.png" /> ' +
                                '<span  class="important">{tripDate}</span>' +
                                '<span  class="important">&nbsp;({tripTime})</span>' +
                            '</li>' +
                            '<li>' +
                                '<img src="Content/images/company.png" /> ' +
                                '<span>{companyName}</span>' +
                            '</li>' +
                        '</ul>' +
                   '</div>' +
                   '<div class="info-group">' +
                        '<div class="header">' +
                            '<img src="Content/images/ticket.png" />' +
                            '<span>{code}</span>' +
                        '</div>' +
                        '<ul class="info">' +
                            '<li>' +
                                '<img class="bticket-img-seat" src="Content/images/seat.png" /> ' +
                                '<span class="bticket-seatcode-detail">{seat}</span>' +
                            '</li>' +
                            '<li>' +
                                '<img src="Content/images/time.png" /> ' +
                                '<span>{createdDate}</span>' +
                                '<span> {createdTime}</span>' +
                            '</li>' +
                            '<li style="display:{noteDisplay}">' +
                                '<img src="Content/images/note.png" /> ' +
                                '<span>{note}</span>' +
                            '</li>' +
                        '</ul>' +
                   '</div>' +
                   '<div class="info-group" style="display:{customerDisplay}" >' +
                        '<div class="header">' +
                            '<img src="Content/images/user.png" />' +
                            '<span>{customerName}</span>' +
                        '</div>' +
                        '<ul class="info" style="display:{customerPhoneDisplay}" >' +
                            '<li>' +
                                '<img src="Content/images/smartphone.png" /> ' +
                                '<span class="important">{customerPhone}</span>' +
                            '</li>' +
                            '<li style="display:{pickupInfoDisplay}">' +
                                '<img src="Content/images/location.png"   /> ' +
                                '<span>Đón: {pickupInfo}</span>' +
                            '</li>' +
                        '</ul>' +
                   '</div>' +
                   '<div class="info-group">' +
                        '<div class="header">' +
                            '<img src="Content/images/info.png" />' +
                            '<span>{status1}</span>' +
                        '</div>' +
                        '<ul class="info">' +
                            '<li style="display:{status2Display}">' +
                                '<img src="Content/images/way.png" /> ' +
                                '<span>{status2}</span><span style="display:{status3Display}">: {status3}</span>' +
                            '</li>' +
                            '<li  style="display:{statusDateDisplay}">' +
                                '<img src="Content/images/time.png" /> ' +
                                '<span>{statusDate} ({statusTime})</span>' +
                            '</li>' +
                            '<li style="display:{transactionIdDisplay}">' +
                                '<img src="Content/images/money.png" /> ' +
                                '<a id="transactionDetail{index}" data-index={index} class="transactionDetail"' +
                                'data-transactionId="{transactionId}" data-transactionDate="{transactionDate}" data-transactionTime="{transactionTime}" data-transactionStatus="{transactionStatus}" data-transactionNLPaymentType="{transactionNLPaymentType}" data-transactionBankCode="{transactionBankCode}" data-transactionDescription="{transactionDescription}" data-transactionChecksum="{transactionChecksum}" ' +
                                '>{transactionId}</a>' +
                            '</li>' +
                            '<li style="display:{chargedUserDisplay}">' +
                                '<img src="Content/images/account.png" /> ' +
                                '<span>{chargedUser}</span>' +
                            '</li>' +
                        '</ul>' +
                   '</div>' +
                   '<div class="info-group">' +
                        '<div class="header">' +
                            '<img src="Content/images/code.png" />' +
                            '<span>Tác vụ</span>' +
                        '</div>' +
                        '<ul class="info commands" >' +
                            '<li class="left">' +
                                '<img src="Content/images/mail.png" /> ' +
                                '<a class="sendEmail" >Gửi email</a>' +
                            '</li>' +
                            '<li >' +
                                '<img src="Content/images/sms.png" /> ' +
                                '<a class="sendSms" >Gửi sms</a>' +
                            '</li>' +
                        '</ul>' +
                        '<ul class="info commands" >' +
                            '<li class="left">' +
                                '<img src="Content/images/print.png" /> ' +
                                '<a class="printTicket" >In vé</a>' +
                            '</li>' +
                            '<li >' +
                                '<img src="Content/images/cancel.png" /> ' +
                                '<a class="cancelTicket" >Hủy</a>' +
                            '</li>' +
                        '</ul>' +
                   '</div>' +
                '</div>' +
            '</td>' +
        '</tr>'
    ,
    modals:
        '<div class="modals BTickets-modals">' +

            '<div class="modal fade" id="dlgSendEmail">' +
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title">Gửi email</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<form class="form">'+
                                '<p class="name">'+
                                  '<input type="text" name="name" id="txtSubject" />'+
                                  '<label for="name">Subject</label>'+
                                '</p>'+
                                '<p class="email">'+
                                  '<input type="text" name="email" id="txtEmail" />'+
                                  '<label for="email">E-mail</label>'+
                                '</p>'+
                                '<p class="text">'+
                                  '<textarea name="text" placeholder="Your message here"></textarea>'+
                                '</p>'+
                              '</form>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Không gửi nữa</button>' +
                            '<button type="button" class="btn btn-primary" >Gửi liền</button>' +
                        '</div>' +
                    '</div><!-- /.modal-content -->' +
                '</div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->' +

            '<div class="modal fade" id="dlgSendSms">' +
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title">Gửi sms</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<form class="form">' +
                                '<p class="phone">' +
                                  '<input type="text" name="name" id="txtPhoneNumber" />' +
                                  '<label for="name">Subject</label>' +
                                '</p>' +
                                '<p class="text">' +
                                  '<textarea name="text" placeholder="Your message here"></textarea>' +
                                '</p>' +
                              '</form>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Không gửi nữa</button>' +
                            '<button type="button" class="btn btn-primary" >Gửi liền</button>' +
                        '</div>' +
                    '</div><!-- /.modal-content -->' +
                '</div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->' +

            '<div class="modal fade" id="dlgCancelTicketWarning">' +
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title">Xác nhận</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<p>Có thật là muốn xóa vé này không đó?</p>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">không xóa nữa</button>' +
                            '<button type="button" class="btn btn-primary">Xóa ngay</button>' +
                        '</div>' +
                    '</div><!-- /.modal-content -->' +
                '</div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->' +
            
            '<div class="modal fade" id="dlgPaymentInfo">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<h4 class="modal-title">Thông tin giao dịch</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<table class="transactionDetail">' +
                        '<tbody>' +
                            '<tr><td class="key">TransactionId</td><td id="transactionId" class="value"></td></tr>' +
                            '<tr><td class="key">Thời gian</td><td id="transactionDate" class="value "></td></tr>' +
                            '<tr><td class="key">Trạng thái</td><td id="transactionStatus"  class="value "></td></tr>' +
                            '<tr><td class="key">NLPaymentType</td><td id="transactionNLPaymentType"  class="value "></td></tr>' +
                            '<tr><td class="key">BankCode</td><td id="transactionBankCode"  class="value "></td></tr>' +
                            '<tr><td class="key">Mô tả</td><td id="transactionDescription"  class="value " ></td></tr>' +
                            '<tr><td class="key">Ts</td><td id="transactionTs"  class="value "></td></tr>' +
                            '<tr><td class="key">Checksum</td><td id="transactionChecksum"  class="value "></td></tr>' +
                        '</tbody>' +
                    '</table>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>' +
                    '</div>' +
                '</div><!-- /.modal-content -->' +
                '</div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->' +


        '</div>',
};


