define({
    title: 'Quản lý thông tin K/H',
    name: 'Thông tin K/H',
    grid: false,
    gTitle: '',
    xWidth: '',
    cols: 4,
    winCls: 'customerProfile',
    useSmCls: true,
    autoClear: true,
    keyFields: [''],

    items: [
        {
            xtype: 'inputHidden01',
            name: 'customerId',
            ref: 'input.customerId',
            form: true,
            cls: 'customerId',
            grid: false,
            fIdx: 0
        },
        {
            xtype: 'textbox03',
            name: 'customerName',
            label: "Họ và tên",
            ref: 'input.customerName',
            data: true,
            vType: 'textbox',
            form: true,
            fIdx: 1,
            cls: 'customerName',
            gWidth: '7%',
            grid: true,
            gIdx: 1,
            gQuery: false,
            noSave: true
        },
        {
            xtype: 'textbox03',
            name: 'customerPhone',
            label: "Số điện thoại",
            ref: 'input.customerPhone',
            data: true,
            vType: 'textbox',
            form: true,
            fIdx: 2,
            cls: 'customerPhone',
            gWidth: '7%',
            grid: true,
            gIdx: 2,
            gQuery: false,
            noSave: true
        },
        {
            xtype: 'textbox03',
            name: 'customerEmail',
            label: "Email",
            ref: 'input.customerEmail',
            data: true,
            vType: 'textbox',
            form: true,
            fIdx: 3,
            cls: 'customerEmail',
            gWidth: '7%',
            grid: true,
            gIdx: 3,
            gQuery: false,
            noSave: true
        },
        {
            xtype: 'textbox03',
            name: 'customerAddress',
            label: "Địa chỉ",
            ref: 'input.customerAddress',
            data: true,
            vType: 'textbox',
            form: true,
            fIdx: 4,
            cls: 'customerAddress',
            gWidth: '7%',
            grid: true,
            gIdx: 4,
            gQuery: false,
            noSave: true
        },
        {
            xtype: 'combobox',
            name: 'Gender',
            label: 'Giới tính',
            ref: 'select.gender',
            data: true,
            form: true,
            fIdx: 5,
            cls: 'customerGender',
            rights: '',
            cbb: true,
            options: [{ Id: 1, Name: 'Nam' }, { Id: 2, Name: 'Nữ' }],
            grid: true,
            gIdx: 5,
            gQuery: false,
            gDis: 'gDisType',
        },
        {
            xtype: 'datepicker',
            name: 'Birthday',
            label: "Ngày sinh",
            ref: '.birthday',
            data: true,
            form: true,
            fIdx: 6,
            cls: 'birthday',
            rights: '',
            type: 'Date',
            displayFormat: 'dd-mm-yy',
            grid: true,
            gIdx: 6,
            gQuery: false
        },
        {
            xtype: 'textbox03',
            name: 'customerNote',
            label: "Ghi chú",
            ref: 'input.customerNote',
            data: true,
            vType: 'textbox',
            form: true,
            fIdx: 7,
            cls: 'customerNote',
            gWidth: '14%',
            grid: true,
            gIdx: 7,
            gQuery: false,
            noSave: true,
            flex: 2,
        },
    ],

    buttons: [
        {
            xtype: 'iconbutton',
            name: 'btnUpdateInfo',
            label: 'Cập nhật',
            ref: 'button.updateInfo',
            form: true,
            cls: 'btn-success updateInfo',
            iconCls: 'glyphicon-save',
            listeners: [{ xClick: 'onUpdateInfo' }],
        },
    ],

    jVar: {
        pageU: {
            total: 1,
            current: 1,
            itemsPerPage: 10,
            totalRecords: 0
        },
        pageP: {
            total: 1,
            current: 1,
            itemsPerPage: 10,
            totalRecords: 0
        },
        pageC: {
            total: 1,
            current: 1,
            itemsPerPage: 10,
            totalRecords: 0
        },
        getCustomerFunction: 'fGetCustomer1',
        getCustomerFields: 'Id, Name, Phone, Email, AddressInfo, Gender, Birthday, Note',
        getCustomerErrorString: 'Không có dữ liệu!',

        getCustomerTicketsFunction: 'pGetCustomerTripTicket',
        getCustomerTicketsFields: 'Id, Code, TripName, TripDate, SeatCode, Fare, Status, IssueDate, CreatedUser, TicketNote',
        getCustomerTicketsSort: 'TripDate desc',

        getTripConditions_U: " CustomerId={id} and compId={compId} and Status!=3 and TripDate>'{date}' ",
        getTripConditions_P: " CustomerId={id} and compId={compId} and Status!=3 and TripDate<='{date}' ",
        getTripConditions_C: " CustomerId={id} and compId={compId} and Status=3 ",

        statusBooked: 'Đặt chỗ',
        statusPaid: 'Đã thanh toán',
        statusCancelled: 'Đã hủy',

        updateErrorName: 'Vui lòng nhập họ tên',
        updateErrorPhone: 'Vui lòng nhập SDT',
        updateError: "Có lỗi xảy ra, vui lòng thử lại sau",
        updateSuccess: "Đã cập nhật thành công",
        updateFunction: "UpdateCustomer",
    },

    jHtml: {
        tableU: '#tbdUTrips',
        tableP: '#tbdPTrips',
        tableC: '#tbdCTrips',
        countU: '#spanUTrips',
        countP: '#spanPTrips',
        countC: '#spanCTrips',
        noTicket_U: '<td colspan="9"><div style="margin:10px" class="alert alert-info" role="alert">Không có chuyến sắp đi</div></td>',
        noTicket_P: '<td colspan="9"><div style="margin:10px" class="alert alert-info" role="alert">Không có chuyến đã đi</div></td>',
        noTicket_C: '<td colspan="9"><div style="margin:10px" class="alert alert-info" role="alert">Chưa hủy chuyến nào</div></td>',
        ticketRow: '<tr><td>{code}</td><td>{route}</td><td>{pickupDate}</td><td>{seat}</td><td>{money}đ</td><td>{issueDate}</td><td>{status}</td><td>{account}</td><td>{note}</td><tr>',
        placeToInsertTable: "div.modal-footer",
        searchBarInput: '#inputSuccess2',
        searchResultMenu: 'div.search-result',
        inputCustomerId: "input.customerId",
        inputCustomerName: "input.customerName",
        inputCustomerPhone: "input.customerPhone",
        inputCustomerEmail: "input.customerEmail",
        inputCustomerAddress: "input.customerAddress",
        selectCustomerGender: "select.customerGender",
        inputCustomerNote: "input.customerNote",
        inputCustomerBirthday: "input.birthday",
        alertMesageContainer: 'div.alert.message',
        alertMesageError: 'alert-danger',
        alertMesageSuccess: 'alert-success',
        classToDisableButton: 'disabled',
        divPage: '#divPage{type}',
        divPageStyle: 'margin-top:10px;margin-bottom:0px',
        selectPage: '#divPage{type} select.page',
        selectItemsPerPage: '#divPage{type} select.itemPerPage',
        paginationAllButtons: '#divPage{type} .pagination a',
        firstPageButton: '#divPage{type} .first',
        previousPageButton: '#divPage{type} .previous',
        nextPageButton: '#divPage{type} .next',
        lastPageButton: '#divPage{type} .last',

        typeAttribute: 'data-type',
        indexAttribute: 'data-index',

        paginationContainer: '<ul class="pagination pagination-sm mt0 fl" style="display: block;margin-bottom:0px;" />',
        paginationButtonFirst: '<li class="first"><a href="javascript:;" data-type="{type}" data-index="{page}"><i class="glyphicon glyphicon-fast-backward"></i></a></li>',
        paginationButtonPrevious: '<li class="previous"><a href="javascript:;" data-type="{type}" data-index="{page}"><i class="glyphicon glyphicon-backward"></i></a></li>',
        paginationButtonNext: '<li class="next"><a href="javascript:;" data-type="{type}" data-index="{page}"><i class="glyphicon glyphicon-forward"></i></a></li>',
        paginationButtonLast: '<li class="last"><a href="javascript:;" data-type="{type}" data-index="{page}"><i class="glyphicon glyphicon-fast-forward"></i></a></li>',

        paginationButtonNumber: '<li class="pageButton"><a href="javascript:;" data-type="{type}" data-index="{page}">{page}</a></li>',
        paginationButtonCurrent: '<li class="active pageButton"><a href="javascript:;" data-type="{type}" data-index="{page}">{page}</a></li>',
        selectPageOption: '<option value="{page}">{page}</option>',
        paginationSelectPage: '<select id="selPaging{type}" name="JumpPage" data-type="{type}"  class="form-control fl input-sm page" style="width: 60px; display: block;" />',
        paginationSelectPageLabel: '<span style="padding-top: 8px; padding-right: 5px; display: block;" class="fl">Tới trang: </span>',
        paginationSelectItemsPerPageLabel: '<span style="padding-top: 8px; padding-left: 20px; padding-right: 5px; display: block;" class="fl">Số bản ghi:</span>',
        paginationGroupSelect: '<div class="fl ml20" />',
        paginationSelectItemsPerPage:
            '<select id="selItemsPerPage"  data-type="{type}"  name="PageSize" class="form-control fl input-sm itemPerPage" style="width: 60px; display: block;">' +
                '<option value="10">10</option>' +
                '<option value="20">20</option>' +
                '<option value="30">30</option>' +
                '<option value="40">40</option>' +
                '<option value="50">50</option>' +
            '</select>',

        tabTpl:
        '<ul class="nav nav-tabs tuyenduong-popup mt20" style="margin-top:10px" role="tablist">' +
            '<li  class="active"><a href=".chuyen-sap-di" data-toggle="tab">Chuyến sắp đi &nbsp; <span id="spanUTrips" class="badge"></span></a></li>'+
            '<li  class=""><a href=".chuyen-di" data-toggle="tab">Chuyến đã đi &nbsp;<span class="badge" id="spanPTrips"></span></a></li>' +
            '<li  class=""><a href=".chuyen-huy" data-toggle="tab">Chuyến đã huỷ &nbsp;<span class="badge" id="spanCTrips"></span></a></li>' +
        '</ul>',
        tableTpl:
        '<div class="tab-content mt10">'+
            '<div class="tab-pane chuyen-sap-di active">'+
                '<div class="table-responsive">'+
                    '<table class="table table-bordered mb0">'+
                        '<thead>'+                                                                                       
                            '<tr>'+
                            '<th class="bg-thead">Mã vé</th>'+
                            '<th class="bg-thead">Tuyến đường</th>'+
                            '<th class="bg-thead">Ngày giờ đi</th>'+
                            '<th class="bg-thead">Số ghế</th>'+
                            '<th class="bg-thead">Tổng tiền</th>'+
                            '<th class="bg-thead">Ngày đặt</th>'+
                            '<th class="bg-thead">Trạng thái</th>'+
                            '<th class="bg-thead">Nhân viên</th>'+
                            '<th class="bg-thead">Ghi chú</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody id="tbdUTrips"></tbody>'+
                    '</table>'+
                '</div>' +
                '<div id="divPageU" />'+
            '</div>'+
                '<div class="tab-pane chuyen-di">'+
                    '<div class="table-responsive">'+
                        '<table class="table table-bordered mb0">'+
                            '<thead>'+
                                '<tr>'+
                                '<th class="bg-thead">Mã vé</th>'+
                                '<th class="bg-thead">Tuyến đường</th>'+
                                '<th class="bg-thead">Ngày giờ đi</th>'+
                                '<th class="bg-thead">Số ghế</th>'+
                                '<th class="bg-thead">Tổng tiền</th>'+
                                '<th class="bg-thead">Ngày đặt</th>'+
                                '<th class="bg-thead">Trạng thái</th>'+
                                '<th class="bg-thead">Nhân viên</th>'+
                                '<th class="bg-thead">Ghi chú</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody id="tbdPTrips"></tbody>' +
                        '</table>'+
                    '</div>' +
                    '<div id="divPageP" />' +
                '</div>'+
                '<div class="tab-pane chuyen-huy">'+
                    '<div class="table-responsive">'+
                        '<table class="table table-bordered mb0">'+
                            '<thead>'+
                                '<tr>'+
                                '<th class="bg-thead">Mã vé</th>'+
                                '<th class="bg-thead">Tuyến đường</th>'+
                                '<th class="bg-thead">Ngày giờ đi</th>'+
                                '<th class="bg-thead">Số ghế</th>'+
                                '<th class="bg-thead">Tổng tiền</th>'+
                                '<th class="bg-thead">Ngày huỷ</th>'+
                                '<th class="bg-thead">Trạng thái</th>'+
                                '<th class="bg-thead">Nhân viên</th>'+
                                '<th class="bg-thead">Ghi chú</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody id="tbdCTrips"></tbody>' +
                        '</table>'+
                    '</div>' +
                    '<div id="divPageC" />' +
                '</div>'+
            '</div>',

    },

});

