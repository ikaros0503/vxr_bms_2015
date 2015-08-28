define({

    _reloadProduct: function () {
        $('#product-content').product({ compId: app.cid });
        $('ul.primary-menu-top li').removeClass('active');
        $(this).parent().addClass('active');
        $('#product-content').product("init");
        $('#product-content').show();
        $('#bksContent').hide();
        $('#roleConfig').hide();
        $('#report').hide();
        app.module = "product";
    },

    loadProduct: function (o) {
        var me = this;
        $('#proTemplate').load('App/Template/Shipping.html');
        $.getScript("Comp/" + app.cid + "/product-custom.js?v=1.0.0", function () {
            me._reloadProduct();
        });
    },

    start: function (o) {
        var me = this;
        me.loadProduct(o);
    },
});

(function ($) {
    $.widget("custom.product", {
        options: {
            compId: 0,
        },
        /************************************************************************
        * Khai báo các thuộc tính                                               *
        *************************************************************************/
        _$formNhapHang: null,
        _$formOfficeReceive: null,
        _$proMatrix: null,
        _$headerProduct: null,
        _$headerTableProduct: null,
        _$proList: null,
        _$typeOfView: null,
        _$dataFromView: null,
        _$proObj: null,
        _$proOrderObj: null,
        _$trip: null,
        _$receiveOffice: [],
        _$updateModal: null,
        _$cancelModal: null,
        _$phieuHangHTML: null,
        _$phoiHangHTML: null,
        _$updateFromSearch: null,

        // phân trang
        _$paginationElement: null,
        _$jumpPageElement: null,
        _$pageSizeElement: null,
        _$pageIndex: 1,
        _$pageSize: 10,

        /************************************************************************
        * Khởi tạo các element                                                  *
        *************************************************************************/
        _createFormNhapHang: function () {
            return this._$formNhapHang = $('div.product-container div.nhap-hang');
        },
        _createFormOfficeReceive: function () {
            return this._$formOfficeReceive = $('div.product-container div.nhap-hang select[name="ReceivedAgentId"]');
        },
        _createProMatrix: function () {
            return this._$proMatrix = $('div.product-matrix');
        },
        _createProList: function () {
            return this._$proList = $('.product-list tbody');
        },
        _getTypeOfView: function () {
            return this._$typeOfView = $('#product-content div.btn-filter input[name="TypeOfView"]');
        },
        _createHeaderProduct: function () {
            return this._$headerProduct = this._$proMatrix.find('.row.header-product');
        },
        _createHeaderTableProduct: function () {
            return this._$headerTableProduct = this._$proMatrix.find('table.product-list thead');
        },
        _getPageSize: function () {
            return this._$pageSize = parseInt(this._$pageSizeElement.val());
        },
        _createPaginationElement: function () {
            return this._$paginationElement = this._$proMatrix.find('ul.pagination');
        },
        _createJumpPageElement: function () {
            return this._$jumpPageElement = this._$proMatrix.find('select[name="JumpPage"]');
        },
        _createPageSizeElement: function () {
            return this._$pageSizeElement = this._$proMatrix.find('select[name="PageSize"]');
        },
        _initBaseFunc: function () {
            this._createProList();
            this._createProMatrix();
            this._createPaginationElement();
            this._createJumpPageElement();
            this._createPageSizeElement();
            this._createHeaderProduct();
            this._createHeaderTableProduct();
            this._createFormNhapHang();
            this._createFormOfficeReceive();
            this._getTypeOfView();
            this._getPageSize();
        },
        _submitAction: function (obj, requestSuccess) {
            vRqs(obj, requestSuccess, { async: false });
        },
        _loadPro: function (obj, element, header, typeOfView) {
            var me = this;
            var fromName = '', toName = '';
            var htmlHeader = '';
            var html = '';
            var proItems = [];
            var tripDetail = {}
            var driverList = [];
            var counter = me._getCounter(typeOfView);
            var requestSuccess = function (u, r, l, t) {
                if (u && l > 0) {
                    // khởi tạo phân trang
                    me._renderPagination(t);
                    $.each(r, function (index, value) {
                        var pro = me._convertDbIntoProOrderPaginationObj(value);
                        pro._index = index + 1;
                        var item = $.mapItemToView($.convertProToItem(pro));
                        item['typeOfView'] = typeOfView;
                        if (typeOfView == 'kho-hang-ve' && (pro._statusInfo._code == 4 || pro._statusInfo._code == 6)) {
                            item['disabled'] = "";
                        }
                        proItems.push(item);
                    });
                } else {
                    me._$paginationElement.hide();
                    me._$jumpPageElement.hide();
                    me._$jumpPageElement.prev().hide();
                    me._$pageSizeElement.hide();
                    me._$pageSizeElement.prev().hide();
                }
                $.each(proItems, function (index, value) {
                    html += $.getHtml('product', value);
                });
                if (typeOfView != 'kho-hang-di') {
                    var tripId = me._getTripIdFromView();
                    var tripTime = me._getTripTimeFromView();
                    var dateView = me._getDateFromView();
                    var tripDate = vDtToStr("iso", vGtDtObj('00:00', dateView));
                    var requestTripDetailSuccess = function (u2, r2, l2, t2) {
                        if (u2 == 1 && l2 == 1) {
                            if (vIsEstStr(r2[0][1])) {
                                var teamInfo = r2[0][1].split('~');
                                // get Driver Info: Version ~ Driver ~ Assistant
                                $.each(teamInfo, function (index, value) {
                                    if (value.length > 1) {
                                        var info = value.split('|');
                                        // driver has type = 2
                                        if (info[0] == 2) {
                                            driverList.push(info[2] + ' - ' + (!info[3] ? '' : info[3]));
                                        }
                                    }
                                });
                                tripDetail.driverInfo = driverList.join(', ');
                            } else {
                                tripDetail.driverInfo = '';
                            }
                            if (vIsEstStr(r2[0][2])) {
                                var vehicleInfo = r2[0][2].substr(r2[0][2].indexOf('~'), r2[0][2].length).split('|');
                                tripDetail.vehicleNumber = vehicleInfo[2];
                            } else {
                                tripDetail.vehicleNumber = '';
                            }
                        } else {
                            tripDetail.driverInfo = driverList;
                            tripDetail.vehicleNumber = '';
                        }
                    }
                    me._submitAction($.createGetTripDetailObj(tripId, tripTime, tripDate), requestTripDetailSuccess);
                }
                if (header.toLowerCase() == 'header01') { // kho-hang-di
                    var dataHeader = {}
                    dataHeader.totalRecords = counter.totalRecords;
                    dataHeader.totalPaid = counter.totalBooked;
                    dataHeader.totalBooking = counter.totalBooking;
                    dataHeader.totalNumItems = counter.totalNumItems;
                    htmlHeader = $.getHtml(header, dataHeader);
                    me._$headerProduct.html(htmlHeader);
                    me._$headerTableProduct.html(
                        '<tr>' +
                            '<th class="v-align-m bg-thead">' +
                                '<input type="checkbox" name="CheckAllPro"/>' +
                            '</th>' +
                            '<th class="v-align-m bg-thead">STT</th>' +
                            '<th class="bg-thead bg-thead">Mã hàng</th>' +
                            '<th class="v-align-m bg-thead">VP Nhận</th>' +
                            '<th class="bg-thead bg-thead">Người gửi</th>' +
                            '<th class="bg-thead bg-thead">Người nhận</th>' +
                            '<th class="bg-thead bg-thead">Địa chỉ nhận</th>' +
                            '<th class="v-align-m bg-thead">SL/ĐV</th>' +
                            '<th class="v-align-m bg-thead">Nặng</th>' +
                            '<th class="bg-thead">Ghi chú</th>' +
                            '<th class="bg-thead">Giá tiền</th>' +
                            '<th class="bg-thead">Th.Toán</th>' +
                            '<th class="bg-thead">NV Nhập</th>' +
                            '<th class="v-align-m bg-thead">Chức năng</th>' +
                        '</tr>'
                        );
                    me._bindEventLenXe();
                } else if (header.toLowerCase() == 'header02') { // kho-hang-ve
                    $.each(me._$trip, function (index, value) {
                        if (value[0] == me._getTripIdFromView()) {
                            var indFrom = value[2].indexOf('~');
                            var from = value[2].substr(indFrom, value[2].length).split('|');
                            var indTo = value[3].indexOf('~');
                            var to = value[3].substr(indTo, value[3].length).split('|');
                            fromName = from[3];
                            toName = to[3];
                        }
                    });
                    htmlHeader = $.getHtml(header, {
                        fromAreaName: fromName,
                        toAreaName: toName,
                        tripDate: me._getDateFromView(),
                        tripTime: me._getTripTimeFromView(),
                        vehicleNumber: tripDetail.vehicleNumber,
                        driverInfo: tripDetail.driverInfo,
                        totalRecords: counter.totalRecords,
                        totalBooked: counter.totalBooked,
                        totalBooking: counter.totalBooking,
                        totalNumItems: counter.totalNumItems,
                        totalDelivery: counter.totalDelivery,
                        totalNotDelivery: counter.totalNotDelivery
                    });
                    me._$headerProduct.html(htmlHeader);
                    me._$headerTableProduct.html(
                        '<tr>' +
                            '<th class="v-align-m bg-thead">' +
                                '<input type="checkbox" name="CheckAllPro" />' +
                            '</th>' +
                            '<th class="v-align-m bg-thead">STT</th>' +
                            '<th class="bg-thead bg-thead">Mã hàng</th>' +
                            '<th class="v-align-m bg-thead">VP Nhận</th>' +
                            '<th class="bg-thead bg-thead">Người gửi</th>' +
                            '<th class="bg-thead bg-thead">Người nhận</th>' +
                            '<th class="bg-thead bg-thead">Địa chỉ nhận</th>' +
                            '<th class="v-align-m bg-thead">SL/ĐV</th>' +
                            '<th class="v-align-m bg-thead">Nặng</th>' +
                            '<th class="bg-thead">Ghi chú</th>' +
                            '<th class="bg-thead">Giá tiền</th>' +
                            '<th class="bg-thead">Th.Toán</th>' +
                            '<th class="bg-thead">NV Nhận</th>' +
                            '<th class="v-align-m bg-thead">Chức năng</th>' +
                        '</tr>'
                        );
                    me._bindEventDaGiao();
                } else { // xem-chuyen
                    $.each(me._$trip, function (index, value) {
                        if (value[0] == me._getTripIdFromView()) {
                            var indFrom = value[2].indexOf('~');
                            var from = value[2].substr(indFrom, value[2].length).split('|');
                            var indTo = value[3].indexOf('~');
                            var to = value[3].substr(indTo, value[3].length).split('|');
                            fromName = from[3];
                            toName = to[3];
                        }
                    });
                    htmlHeader = $.getHtml(header, {
                        fromAreaName: fromName,
                        toAreaName: toName,
                        tripDate: me._getDateFromView(),
                        tripTime: me._getTripTimeFromView(),
                        vehicleNumber: tripDetail.vehicleNumber,
                        driverInfo: tripDetail.driverInfo,
                        totalRecords: counter.totalRecords,
                        totalBooked: counter.totalBooked,
                        totalBooking: counter.totalBooking,
                        totalReceived: counter.totalReceived,
                        totalNotReceived: counter.totalNotReceived,
                        totalNumItems: counter.totalNumItems,
                        totalDelivery: counter.totalDelivery,
                        totalNotDelivery: counter.totalNotDelivery
                    });
                    me._$headerProduct.html(htmlHeader);
                    me._$headerTableProduct.html(
                        '<tr>' +
                            '<th class="v-align-m bg-thead">' +
                                '<input type="checkbox" name="CheckAllPro" />' +
                            '</th>' +
                            '<th class="v-align-m bg-thead">STT</th>' +
                            '<th class="bg-thead bg-thead">Mã hàng</th>' +
                            '<th class="v-align-m bg-thead">VP Nhận</th>' +
                            '<th class="bg-thead bg-thead">Người gửi</th>' +
                            '<th class="bg-thead bg-thead">Người nhận</th>' +
                            '<th class="bg-thead bg-thead">Địa chỉ nhận</th>' +
                            '<th class="v-align-m bg-thead">SL/ĐV</th>' +
                            '<th class="v-align-m bg-thead">Nặng</th>' +
                            '<th class="bg-thead">Ghi chú</th>' +
                            '<th class="bg-thead">Giá tiền</th>' +
                            '<th class="bg-thead">Th.Toán</th>' +
                            '<th class="bg-thead">Nhân viên</th>' +
                            '<th class="v-align-m bg-thead">Chức năng</th>' +
                        '</tr>'
                        );
                    me._bindEventDaNhan();
                }
                element.html(html);
                me._bindEventU();
                me._bindEventC();
                me._bindEventP();
                me._bindEventD();
                me._bindEventCheckAll();
            }
            me._submitAction(obj, requestSuccess);
        },
        _submitSavePro: function (form) {
            var me = this;
            var dOrder = me._createProOrderObj(form);
            var requestProOrderSuccess = function (u, r, l, t) {
                if (u == 1) {
                    // Id của ProductOrder được trả về trong r.Records
                    var dProduct = me._createProductObj(r);
                    var requestProSuccess = function (u2, r2, l2, t2) {
                        // Id của Product được trả về trong r2.Records tương ứng với các obj d truyền vào
                    }; //TODO?
                    //me._submitAction($.createInsertProObj(dProduct), requestProSuccess);
                }
                me._clearForm();
                form.find('button.btn-save-pro').button('reset');
                me._reloadProContainer();
            }
            me._submitAction($.createInsertProOrderObj(dOrder), requestProOrderSuccess);
        },
        _getDataFromView: function (form) {
            var data = [];
            var listProChild = [];
            $.each(form.find('div.row'), function (g, h) {
                var that = $(h);
                if (that.hasClass('pro-child')) {
                    var proChild = [];
                    $.each(that.find('input,select'), function (j, k) {
                        if (!$(k).hasClass('noSave')) {
                            if ($(k).attr('name').toLowerCase() == 'receiveraddress' || $(k).attr('name').toLowerCase() == 'statusofpro') {
                                data.push({
                                    Name: $(k).attr('name'),
                                    Value: $(k).val()
                                });
                            } else {
                                proChild.push({
                                    Name: $(k).attr('name'),
                                    Value: $(k).val()
                                });
                            }
                        }
                    });
                    listProChild.push(proChild);
                } else {
                    $.each(that.find('input,select'), function (j, k) {
                        data.push({
                            Name: $(k).attr('name'),
                            Value: $(k).val()
                        });
                    });
                }
            });
            data.push({
                Name: "ListProChild",
                Value: listProChild
            });
            return data;
        },
        _createProOrderObj: function (form) {
            var d = {}
            var me = this;
            me._$dataFromView = me._getDataFromView(form);
            // Lấy thông tin chi nhánh gửi hàng
            var postOfficeId = app.aid;
            var requestPostOfficeSuccess = function (u, r, l, t) {
                if (u == 1 && l == 1) {
                    d.AgentInfo = r[0][0] + '|' + r[0][1] + '|' + r[0][2] + '|' + r[0][3] + '|' + r[0][4] + '|' + r[0][5];
                }
            };
            me._submitAction($.createGetPostOfficeObj(postOfficeId), requestPostOfficeSuccess);
            var data = me._$dataFromView;
            d.CompId = app.cid;
            d.TripId = me._getTripIdFromView();
            d.Type = 1;
            // IsPrgStatus: { 1: Active, 3: Deleted }
            d.IsPrgStatus = 1;
            // Status: { 1: Booking, 2: Paid }
            d.Status = $.findObjByKey(data, 'StatusOfPro');
            if (parseInt(d.Status) == 2) {
                d.UserCharge = app.un;
            }
            // PickupInfo : Version | Type | Id | FullName | PhoneNumbers | FaxNumbers | Emails | Addresses
            d.PickupInfo = '1|1|0|' + $.findObjByKey(data, 'SenderName') + '|' + $.findObjByKey(data, 'SenderPhone') + '|||';
            // DropOffInfo : Version | Type | Id | FullName | PhoneNumbers | FaxNumbers | Emails | Addresses
            d.DropOffInfo = '1|1|0|' + $.findObjByKey(data, 'ReceiverName') + '|' + $.findObjByKey(data, 'ReceiverPhone') + '|||' + $.findObjByKey(data, 'ReceiverAddress');
            // ReceivedAgentInfo: Id | Type | Code | Name | Address | Phone
            var receivedAgentId = $.findObjByKey(data, 'ReceivedAgentId');
            d.ReceivedAgentId = receivedAgentId;
            $.each(me._$receiveOffice, function (index, value) {
                if (value[0] == receivedAgentId) {
                    d.ReceivedAgentInfo = value[0] + '|' + value[1] + '|' + value[2] + '|' + value[3] + '|' + value[4] + '|' + value[5];
                }
            });
            d.CreatedUser = app.un;
            // AmountInfo: Type | Value
            var listProChild = $.findObjByKey(data, 'ListProChild');
            d.AmountInfo = $.findObjByKey(listProChild[0], 'UnitOfPro') + '|' + $.findObjByKey(listProChild[0], 'NumOfPro');
            d.WeightInfo = $.findObjByKey(listProChild[0], 'WeightOfPro');
            d.Note = $.findObjByKey(listProChild[0], 'NoteOfPro');
            d.Fare = parseInt($.findObjByKey(listProChild[0], 'FareOfPro').replace(/\./g, ''));
            return d;
        },
        _createProOrderUpdateObj: function (form) {
            var d = {}
            var me = this;
            me._$dataFromView = me._getDataFromView(form);
            var data = me._$dataFromView;
            // Lấy thông tin chi nhánh gửi hàng
            var postOfficeId = app.aid;
            var requestPostOfficeSuccess = function (u, r, l, t) {
                if (u == 1 && l == 1) {
                    d.AgentInfo = r[0][0] + '|' + r[0][1] + '|' + r[0][2] + '|' + r[0][3] + '|' + r[0][4] + '|' + r[0][5];
                }
            };
            me._submitAction($.createGetPostOfficeObj(postOfficeId), requestPostOfficeSuccess);
            // Status: { 1: Booking, 2: Paid }
            d.Status = $.findObjByKey(data, 'StatusOfPro');
            if (parseInt(d.Status) == 2) {
                d.UserCharge = app.un;
            }
            // PickupInfo : Version | Type | Id | FullName | PhoneNumbers | FaxNumbers | Emails | Addresses
            d.PickupInfo = '1|1|0|' + $.findObjByKey(data, 'SenderName') + '|' + $.findObjByKey(data, 'SenderPhone') + '|||';
            // DropOffInfo : Version | Type | Id | FullName | PhoneNumbers | FaxNumbers | Emails | Addresses
            d.DropOffInfo = '1|1|0|' + $.findObjByKey(data, 'ReceiverName') + '|' + $.findObjByKey(data, 'ReceiverPhone') + '|||' + $.findObjByKey(data, 'ReceiverAddress');
            // ReceivedAgentInfo: Id | Type | Code | Name | Address | Phone
            var receivedAgentId = $.findObjByKey(data, 'ReceivedAgentId');
            d.ReceivedAgentId = receivedAgentId;
            $.each(me._$receiveOffice, function (index, value) {
                if (value[0] == receivedAgentId) {
                    d.ReceivedAgentInfo = value[0] + '|' + value[1] + '|' + value[2] + '|' + value[3] + '|' + value[4] + '|' + value[5];
                }
            });
            // AmountInfo: Type | Value
            var listProChild = $.findObjByKey(data, 'ListProChild');
            d.AmountInfo = $.findObjByKey(listProChild[0], 'UnitOfPro') + '|' + $.findObjByKey(listProChild[0], 'NumOfPro');
            d.WeightInfo = $.findObjByKey(listProChild[0], 'WeightOfPro');
            d.Note = $.findObjByKey(listProChild[0], 'NoteOfPro');
            d.Fare = parseInt($.findObjByKey(listProChild[0], 'FareOfPro').replace(/\./g, ''));
            return d;
        },
        _createLenXeObj: function (statusCode) {
            var me = this;
            var d = {}
            switch (parseInt(statusCode)) {
                case 1:
                    d.Status = 3;
                    break;
                case 2:
                    d.Status = 5;
                    break;
            }
            d.TripTime = me._getTripTimeFromView(),
            d.TripDate = vDtToStr("iso", vGtDtObj('00:00', me._getDateFromView()))
            return d;
        },
        _createDaNhanObj: function (statusCode) {
            var d = {}
            switch (parseInt(statusCode)) {
                case 3:
                    d.Status = 4;
                    break;
                case 5:
                    d.Status = 6;
                    break;
            }
            // tên nhân viên nhận hàng
            d.ReceivedUser = app.un;
            return d;
        },
        _createDaGiaoObj: function (userName) {
            var d = {}
            d.Status = 9;
            d.DeliveryInfo = userName;
            return d;
        },
        _createProductObj: function (proOrderId) {
            var result = [];
            var me = this;
            var data = me._$dataFromView;
            var listPro = $.findObjByKey(data, 'ListProChild');
            $.each(listPro, function (index, value) {
                var d = {}
                d.Type = 1;
                d.OrderId = proOrderId;
                // IsPrgStatus: { 1: Active, 3: Deleted }
                d.IsPrgStatus = 1;
                d.Fare = parseInt($.findObjByKey(value, 'FareOfPro').replace(/\./g, ''));
                d.Note = $.findObjByKey(value, 'NoteOfPro');
                d.SizeInfo = '1|' + $.findObjByKey(value, 'NumOfPro') + '|' + $.findObjByKey(value, 'UnitOfPro');
                d.WeightInfo = $.findObjByKey(value, 'WeightOfPro');
                result.push(d);
            });
            return result;
        },
        _loadFilter: function () {
            var me = this;
            var htmlRoute = '';
            var requestSuccess = function (u, r, l, t) {
                if (u && l > 0) {
                    me._$trip = r;
                    $.each(r, function (index, value) {
                        htmlRoute += '<option value="' + value[0] + '">' + value[1] + '</option>';
                    });
                    $('div.product-toolbar').find('select[name="TripId"]').append(htmlRoute);
                    $('div.product-toolbar').find('select[name="TripId"] option:first-child').attr('selected', 'selected');
                    me._$typeOfView.val('kho-hang-di');
                    $('div.product-toolbar').find('select[name="TripId"]').trigger('change');
                }
            }
            me._submitAction($.createGetAllTripObj(), requestSuccess);
        },
        _reloadProContainer: function (proId, pIndex, pSize, tId, tTime, tDate, tOView) {
            var me = this;
            var typeOfView = tOView != null ? tOView : me._$typeOfView.val();
            if (typeof proId != "undefined" && typeOfView == 'kho-hang-di') {
                me._loadPro($.crGetProOrderDetailObj(proId), me._$proList, 'header01', 'kho-hang-di');
            } else {
                var pageIndex = pIndex != null ? pIndex : me._$pageIndex;
                var pageSize = pSize != null ? pSize : me._$pageSize;
                var tripId = tId != null ? tId : me._getTripIdFromView();
                var tripTime = tTime != null ? tTime : me._getTripTimeFromView();
                var dateView = tDate != null ? tDate : me._getDateFromView();
                var tripDate = vDtToStr("iso", vGtDtObj('00:00', dateView));
                if (typeOfView.toLowerCase() == 'kho-hang-di') {
                    me._loadPro($.createGetProOrderTripObj(tripId, pageIndex, pageSize), me._$proList, 'header01', 'kho-hang-di');
                } else if (typeOfView.toLowerCase() == 'kho-hang-ve') {
                    //me._loadPro($.createGetProOrderReceivedObj(tripId, tripTime, tripDate, pageIndex, pageSize), me._$proList, 'header02', 'kho-hang-ve');
                    me._loadPro($.createGetProOrderReceivedObj(tripId, pageIndex, pageSize), me._$proList, 'header02', 'kho-hang-ve');
                } else {
                    me._loadPro($.createGetProOrderTripDetailObj(tripId, tripTime, tripDate, pageIndex, pageSize), me._$proList, 'header03', 'xem-chuyen');
                }
            }
        },
        _loadOfficeReceive: function () {
            var me = this;
            var html = '';
            me._$receiveOffice = [];
            var requestSuccess = function (u, r, l, t) {
                if (u && l > 0) {
                    $.each(r, function (index, value) {
                        if (value[0] != app.aid) {
                            html += '<option value="' + value[0] + '">' + value[3] + '</option>';
                            me._$receiveOffice.push(value);
                        }
                    });
                }
                me._$formOfficeReceive.html(html);
                me._$formOfficeReceive.find('option:first-child').prop('selected', 'selected');
            }
            me._submitAction($.createGetOfficeObj(), requestSuccess);
        },
        _getOfficeReceive: function () {
            var me = this;
            var result = [];
            var requestSuccess = function (u, r, l, t) {
                if (u && l > 0) {
                    me._$receiveOffice = r;
                    $.each(r, function (index, value) {
                        result.push({
                            Id: value[0],
                            Name: value[3]
                        });
                    });
                }
            }
            me._submitAction($.createGetOfficeObj(), requestSuccess);
            return result;
        },
        _convertDbIntoProOrderObj: function (data) {
            var pro = new Pro();
            pro._id = data[0];
            pro._code = _dictionary._proCode + data[0];
            pro._parseSenderInfo(data[3]);
            pro._parseReceiverInfo(data[4]);
            pro._note = data[5];
            pro._parseAmountInfo(data[8]);
            pro._weight = data[9];
            pro._fare = vToMn(data[11]);
            pro._parseStatusInfo(data[12]);
            pro._parseAgentInfo(data[13]);
            pro._createdUser = data[14];
            pro._agentId = data[15];
            pro._parseCreatedDate(vPrsDt(data[16]));
            pro._tripId = data[17];
            pro._tripTime = data[18];
            pro._tripDate = data[19];
            pro._receivedUser = data[20];
            pro._parseReceivedAgentInfo(data[21]);
            pro._deliveryInfo = data[22];
            return pro;
        },
        _convertDbIntoProOrderPaginationObj: function (data) {
            // gọi hàm phân trang thì phần tử đầu tiên sẽ là vị trí của record trong db
            // nên các field còn lại sẽ tăng lên 1 index
            var pro = new Pro();
            pro._id = data[1];
            pro._code = _dictionary._proCode + data[1];
            pro._parseSenderInfo(data[4]);
            pro._parseReceiverInfo(data[5]);
            pro._note = data[6];
            pro._parseAmountInfo(data[9]);
            pro._weight = data[10];
            pro._fare = vToMn(data[12]);
            pro._parseStatusInfo(data[13]);
            pro._parseAgentInfo(data[14]);
            pro._createdUser = data[15];
            pro._agentId = data[16];
            pro._parseCreatedDate(vPrsDt(data[17]));
            pro._tripId = data[18];
            pro._tripTime = data[19];
            pro._tripDate = data[20];
            pro._receivedUser = data[21];
            pro._parseReceivedAgentInfo(data[22]);
            pro._deliveryInfo = data[23];
            return pro;
        },
        _getCounter: function (typeOfView) {
            var me = this;
            var totalBooked = 0;
            var totalBooking = 0;
            var totalReceived = 0;
            var totalNotReceived = 0;
            var totalDelivery = 0;
            var totalNotDelivery = 0;
            var totalNumItems = 0;
            var totalRecords = 0;
            switch (typeOfView) {
                case "kho-hang-di":
                    var objTrip = $.crGetProOrderTripCounterObj(me._getTripIdFromView());
                    var requestTripSuccess = function (u, r, l, t) {
                        if (u && l > 0) {
                            $.each(r, function (index, value) {
                                var pro = me._convertDbIntoProOrderObj(value);
                                if (pro._statusInfo._code == 1) {
                                    totalBooking++;
                                } else if (pro._statusInfo._code == 2) {
                                    totalBooked++;
                                }
                                totalNumItems += parseInt(pro._num);
                            });
                            totalRecords = t;
                        }
                    };
                    me._submitAction(objTrip, requestTripSuccess);
                    break;
                case "xem-chuyen":
                    var tripId = me._getTripIdFromView();
                    var tripTime = me._getTripTimeFromView();
                    var tripDate = vDtToStr("iso", vGtDtObj('00:00', me._getDateFromView()));
                    var objTripDetail = $.crGetProOrderTripDetailCounterObj(tripId, tripTime, tripDate);
                    var requestTripDetailSuccess = function (u, r, l, t) {
                        if (u && l > 0) {
                            $.each(r, function (index, value) {
                                var pro = me._convertDbIntoProOrderObj(value);
                                if (pro._statusInfo._code == 3) {
                                    totalNotReceived++;
                                    totalBooking++;
                                    totalNotDelivery++;
                                } else if (pro._statusInfo._code == 4) {
                                    totalBooking++;
                                    totalReceived++;
                                    totalNotDelivery++;
                                } else if (pro._statusInfo._code == 5) {
                                    totalBooked++;
                                    totalNotReceived++;
                                    totalNotDelivery++;
                                } else if (pro._statusInfo._code == 6) {
                                    totalBooked++;
                                    totalReceived++;
                                    totalNotDelivery++;
                                } else if (pro._statusInfo._code == 9) {
                                    totalBooked++;
                                    totalDelivery++;
                                }
                                totalNumItems += parseInt(pro._num);
                            });
                            totalRecords = t;
                        }
                    }
                    me._submitAction(objTripDetail, requestTripDetailSuccess);
                    break;
                case "kho-hang-ve":
                    var objTripDetailDelivery = $.crGetProOrderTripDetailDeliveryCounterObj();
                    var requestTripDetailDeliverySuccess = function (u, r, l, t) {
                        if (u && l > 0) {
                            $.each(r, function (index, value) {
                                var pro = me._convertDbIntoProOrderObj(value);
                                if (pro._statusInfo._code == 4) {
                                    totalBooking++;
                                    totalNotDelivery++;
                                } else if (pro._statusInfo._code == 6) {
                                    totalBooked++;
                                    totalNotDelivery++;
                                } else if (pro._statusInfo._code == 9) {
                                    totalBooked++;
                                    totalDelivery++;
                                }
                                totalNumItems += parseInt(pro._num);
                            });
                            totalRecords = t;
                        }
                    }
                    me._submitAction(objTripDetailDelivery, requestTripDetailDeliverySuccess);
                    break;
                default:
                    break;
            }
            return {
                totalBooked: totalBooked,
                totalBooking: totalBooking,
                totalNumItems: totalNumItems,
                totalRecords: totalRecords,
                totalDelivery: totalDelivery,
                totalNotDelivery: totalNotDelivery,
                totalNotReceived: totalNotReceived,
                totalReceived: totalReceived
            }
        },

        /************************************************************************
        * Listener                                                              *
        *************************************************************************/
        _initListener: function () {
            var me = this;
            $('div.product-toolbar select[name="TripId"]').unbind().on('change', function () {
                var htmlTimeSlot = '';
                $.each(me._$trip, function (index, value) {
                    if (value[0] == me._getTripIdFromView()) {
                        var timeInfo = value[4];
                        if (timeInfo.indexOf('~') != -1) {
                            var timeSlot = timeInfo.split('~');
                            for (var i = 0; i < timeSlot.length; i++) {
                                htmlTimeSlot += '<option value="' + timeSlot[i] + '">' + timeSlot[i] + '</option>';
                            }
                        } else if (timeInfo.length == 5) {
                            htmlTimeSlot += '<option value="' + timeInfo + '">' + timeInfo + '</option>';
                        }
                    }
                });
                $('div.product-toolbar').find('select[name="TimeSlot"] option').remove();
                $('div.product-toolbar').find('select[name="TimeSlot"]').append(htmlTimeSlot);
                $('div.product-toolbar').find('select[name="TimeSlot"] option:first-child').attr('selected', 'selected');
                me._reloadProContainer();
            });
            $('div.product-toolbar select[name="TimeSlot"]').unbind().on('change', function () {
                me._reloadProContainer();
            });
            $('div.product-toolbar input[name="DepartureDate"]').datepicker({
                dateFormat: 'dd-mm-yy',
                onSelect: function () {
                    me._reloadProContainer();
                }
            }).datepicker("setDate", new Date());
            $('span.glyphicon-calendar').parent().on('click', function () {
                $(this).prev().datepicker('show');
            });
            $('button.btn-nhap-kho').unbind().on('click', function () {
                if (!$(this).hasClass('open')) {
                    me._loadOfficeReceive();
                    me._$formNhapHang.slideDown('fast');
                    $(this).addClass('open');
                    me._$formNhapHang.find('div.form-group').tooltip();
                } else {
                    me._$formNhapHang.slideUp('fast');
                    $(this).removeClass('open');
                }
            });
            $('div.product-toolbar div.btn-filter a.kho-hang-di').unbind().on('click', function () {
                $('div.product-toolbar div.btn-filter a.btn-typeofview').removeClass('btn-danger').removeClass('btn-default').addClass('btn-default');
                $(this).removeClass('btn-default').addClass('btn-danger');
                me._$typeOfView.val('kho-hang-di');
                $('button.btn-in-phoi-hang').removeClass('hidden');
                $('button.btn-in-phoi-hang').addClass('hidden');
                $('button.btn-nhap-kho').removeClass('hidden');
                me._reloadProContainer();
            });
            $('div.product-toolbar div.btn-filter a.kho-hang-ve').unbind().on('click', function () {
                $('div.product-toolbar div.btn-filter a.btn-typeofview').removeClass('btn-danger').removeClass('btn-default').addClass('btn-default');
                $(this).removeClass('btn-default').addClass('btn-danger');
                me._$typeOfView.val('kho-hang-ve');
                $('button.btn-in-phoi-hang').removeClass('hidden');
                $('button.btn-in-phoi-hang').addClass('hidden');
                $('button.btn-nhap-kho').removeClass('hidden');
                $('button.btn-nhap-kho').addClass('hidden');
                me._reloadProContainer();
            });
            $('div.product-toolbar div.btn-filter a.xem-chuyen').unbind().on('click', function () {
                $('div.product-toolbar div.btn-filter a.btn-typeofview').removeClass('btn-danger').removeClass('btn-default').addClass('btn-default');
                me._$typeOfView.val('xem-chuyen');
                $(this).removeClass('btn-default').addClass('btn-danger');
                $('button.btn-in-phoi-hang').removeClass('hidden');
                $('button.btn-nhap-kho').removeClass('hidden');
                $('button.btn-nhap-kho').addClass('hidden');
                me._reloadProContainer();
            });
            $('button.btn-save-pro').unbind().on('click', function () {
                $(this).button('loading');
                me._submitSavePro($(this).closest('div.nhap-hang'));
            });
            $('button.nhap-hang-dong').unbind().on('click', function () {
                me._$formNhapHang.slideUp('fast');
                $('button.btn-nhap-kho').removeClass('open');
                me._clearForm();
            });
            $('button.btn-in-phoi-hang').unbind().on('click', function () {
                me._initPhoiHang();
            });
            me._$pageSizeElement.unbind().on('change', function () {
                me._$pageSize = me._getPageSize();
                me._reloadProContainer();
            });
            me._autoFormatFare();
        },
        _bindEventU: function () {
            var me = this;
            $('button.btn-update-pro').unbind().on('click', function () {
                me._initUpdateForm($(this).closest('tr'));
            });
        },
        _bindEventC: function () {
            var me = this;
            $('button.btn-cancel-pro').unbind().on('click', function () {
                me._initCancelForm($(this).closest('tr'));
            });
        },
        _bindEventP: function () {
            var me = this;
            $('button.btn-phieu-hang').unbind().on('click', function () {
                me._initPhieuHang($(this).closest('tr'));
            });
        },
        _bindEventD: function () {
            var me = this;
            $('button.btn-deliveried').unbind().on('click', function () {
                var that_element = $(this).closest('tr');
                var proOrderId = that_element.attr('data-id');
                var dObj = {}
                var requestSuccess = function () {
                    me._reloadProContainer();
                }
                if (me._$typeOfView.val() == 'xem-chuyen') {
                    dObj = me._createDaGiaoObj("Tài xế");
                } else if (me._$typeOfView.val() == 'kho-hang-ve') {
                    dObj = me._createDaGiaoObj(un);
                }
                me._submitAction($.createUpdateProOrderObj({ Id: proOrderId }, dObj), requestSuccess);
            });
        },
        _bindEventLenXe: function () {
            var me = this;
            var listProId = [];
            var listSuccess = [];
            $('div.product-matrix button.btn-len-xe').unbind().on('click', function () {
                $.each($('div.product-matrix table.product-list tbody input[name="ProId"]:checked'), function (index, ele) {
                    var proId = $(ele).closest('tr').attr('data-id');
                    listProId.push(proId);
                    if (listProId.length > 0) {
                        var requestSuccess = function () {
                            listSuccess.push(proId);
                        }
                        var statusCode = $(this).closest('tr').find('td.td-status').attr('data-status-code');
                        var dObj = me._createLenXeObj(statusCode);
                        me._submitAction($.createUpdateProOrderObj({ Id: proId }, dObj), requestSuccess);
                    } else {
                        // show thông báo nhắc nhở
                    }
                });
                if (listProId.length == listSuccess.length) {
                    me._reloadProContainer();
                }
            });
        },
        _bindEventDaNhan: function () {
            var me = this;
            var listProId = [];
            var listSuccess = [];
            $('div.product-matrix button.btn-da-nhan').unbind().on('click', function () {
                $.each($('div.product-matrix table.product-list tbody input[name="ProId"]:checked'), function (index, ele) {
                    var proId = $(ele).closest('tr').attr('data-id');
                    listProId.push(proId);
                    var requestSuccess = function () {
                        listSuccess.push(proId);
                    }
                    var statusCode = $(this).closest('tr').find('td.td-status').attr('data-status-code');
                    var dObj = me._createDaNhanObj(statusCode);
                    me._submitAction($.createUpdateProOrderObj({ Id: proId }, dObj), requestSuccess);
                });
                if (listProId.length == listSuccess.length) {
                    me._reloadProContainer();
                }
            });
        },
        _bindEventDaGiao: function () {
            var me = this;
            var listProId = [];
            var listSuccess = [];
            $('div.product-matrix button.btn-da-giao').unbind().on('click', function () {
                $.each($('div.product-matrix table.product-list tbody input[name="ProId"]:checked'), function (index, ele) {
                    var proId = $(ele).closest('tr').attr('data-id');
                    listProId.push(proId);
                    var requestSuccess = function () {
                        listSuccess.push(proId);
                    }
                    var dObj = me._createDaGiaoObj(un);
                    me._submitAction($.createUpdateProOrderObj({ Id: proId }, dObj), requestSuccess);
                });
                if (listProId.length == listSuccess.length) {
                    me._reloadProContainer();
                }
            });
        },
        _autoFormatFare: function () {
            $('input[name="FareOfPro"]').unbind().on('keyup', function () {
                var newFare = vToMn($(this).val().replace(/\./g, ''));
                $(this).val(newFare);
            });
        },
        _bindEventCheckAll: function () {
            var me = this;
            me._$headerTableProduct.find('input[name="CheckAllPro"]').unbind().on('click', function () {
                if ($(this).is(':checked')) {
                    me._$proList.find('input[name="ProId"]').each(function () {
                        this.checked = true;
                    });
                } else {
                    me._$proList.find('input[name="ProId"]').each(function () {
                        this.checked = false;
                    });
                }
            });
        },

        /************************************************************************
        * Public method                                                         *
        *************************************************************************/
        init: function () {
            var me = this;
            me._initBaseFunc();
            me._initListener();
            me._loadFilter();
        },
        reload: function () {
            var me = this;
            me._reloadProContainer();
        },
        load: function (data) {
            var me = this;
            if (vIsEstStr(data.tTime)) {
                $('div.product-toolbar').find('select[name="TimeSlot"]').val(data.tTime);
            }
            if (vIsEstStr(data.tDate)) {
                $('div.product-toolbar').find('input[name="DepartureDate"]').val(data.tDate);
            }
            $('div.product-toolbar').find('select[name="TripId"]').val(data.tId);
            $('div.product-toolbar div.btn-filter a.btn-typeofview').removeClass('btn-danger').removeClass('btn-default').addClass('btn-default');
            switch (data.tOView) {
                case "kho-hang-di":
                    $('div.product-toolbar div.btn-filter a.kho-hang-di').removeClass('btn-default').addClass('btn-danger');
                    $('button.btn-in-phoi-hang').removeClass('hidden');
                    $('button.btn-in-phoi-hang').addClass('hidden');
                    break;
                case "kho-hang-ve":
                    $('div.product-toolbar div.btn-filter a.kho-hang-ve').removeClass('btn-default').addClass('btn-danger');
                    $('button.btn-in-phoi-hang').removeClass('hidden');
                    $('button.btn-in-phoi-hang').addClass('hidden');
                    break;
                case "xem-chuyen":
                    $('div.product-toolbar div.btn-filter a.xem-chuyen').removeClass('btn-default').addClass('btn-danger');
                    $('button.btn-in-phoi-hang').removeClass('hidden');
                    break;
                default:
                    break;
            }
            $(this).removeClass('btn-default').addClass('btn-danger');
            me._reloadProContainer(data.proId, data.pIndex, data.pSize, data.tId, data.tTime, data.tDate, data.tOView);
        },

        /************************************************************************
        * Phân trang                                                            *
        *************************************************************************/
        _getPagination: function (pageIndex, pageSize, totalItem) {
            var countAllPage = Math.ceil(totalItem / pageSize);
            var numPrevPages = 5;
            var numNextPages = 5;
            var prevPagesArr = [];
            for (var i = pageIndex - numPrevPages; i < pageIndex; i++) {
                if (i >= 1) {
                    prevPagesArr.push(i);
                }
            }
            var nextPagesArr = [];
            for (var j = pageIndex + 1; j < pageIndex + numNextPages; j++) {
                if (j <= countAllPage) {
                    nextPagesArr.push(j);
                }
            }
            return {
                CurrentPage: pageIndex,
                CountAllPages: countAllPage,
                First: (-1 != prevPagesArr.indexOf(1) && 1 != pageIndex) ? 1 : '',
                FrevPage: (prevPagesArr.length > 0) ? prevPagesArr[prevPagesArr.length - 1] : '',
                FrevPages: prevPagesArr,
                NextPages: nextPagesArr,
                NextPage: (nextPagesArr.length > 0) ? nextPagesArr[0] : '',
                Last: (-1 != nextPagesArr.indexOf(countAllPage) && countAllPage != pageIndex) ? countAllPage : '',
                NumPerPage: pageSize
            }
        },
        _renderPagination: function (totalRecords) {
            var me = this;
            var html = "";
            var jumpPageHtml = "";
            var pageIndex = me._$pageIndex;
            var pageSize = me._$pageSize;
            var p = me._getPagination(pageIndex, pageSize, totalRecords);
            if (p.CountAllPages > 0) {
                if (p.First != "") {
                    html += '<li><a href="javascript:;" data-index="' + p.First + '"><i class="glyphicon glyphicon-fast-backward"></i></a></li>';
                } else {
                    html += '<li class="disabled"><a href="javascript:;" data-index=""><i class="glyphicon glyphicon-fast-backward"></i></a></li>';
                }
                if (p.FrevPage != "") {
                    html += '<li><a href="javascript:;" data-index="' + p.FrevPage + '"><i class="glyphicon glyphicon-backward"></i></a></li>';
                } else {
                    html += '<li class="disabled"><a href="javascript:;" data-index=""><i class="glyphicon glyphicon-backward"></i></a></li>';
                }
                if (p.FrevPages.length > 0) {
                    for (var i = 0; i < p.FrevPages.length; i++) {
                        html += '<li><a href="javascript:;" data-index="' + p.FrevPages[i] + '">' + p.FrevPages[i] + '</a></li>';
                    }
                }
                html += '<li class="active"><a href="javascript:;" data-index="' + p.CurrentPage + '">' + p.CurrentPage + '</a></li>';
                if (p.NextPages.length > 0) {
                    for (var j = 0; j < p.NextPages.length; j++) {
                        html += '<li><a href="javascript:;" data-index="' + p.NextPages[j] + '">' + p.NextPages[j] + '</a></li>';
                    }
                }
                if (p.NextPage != "") {
                    html += '<li><a href="javascript:;" data-index="' + p.NextPage + '"><i class="glyphicon glyphicon-forward"></i></a></li>';
                } else {
                    html += '<li class="disabled"><a href="javascript:;" data-index=""><i class="glyphicon glyphicon-forward"></i></a></li>';
                }
                if (p.Last != "") {
                    html += '<li><a href="javascript:;" data-index="' + p.Last + '"><i class="glyphicon glyphicon-fast-forward"></i></a></li>';
                } else {
                    html += '<li class="disabled"><a href="javascript:;" data-index=""><i class="glyphicon glyphicon-fast-forward"></i></a></li>';
                }
                me._$paginationElement.html(html);
                //Bind event on pagination
                me._$paginationElement.find('a').not('.disabled').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me._$pageIndex = parseInt($(this).attr('data-index'));
                    me._reloadProContainer();
                });

                for (var k = 1; k <= p.CountAllPages; k++) {
                    jumpPageHtml += '<option value="' + k + '">' + k + '</option>';
                }
                me._$jumpPageElement.html(jumpPageHtml);
                me._$jumpPageElement.val(p.CurrentPage);
                me._$jumpPageElement.unbind().on('change', function () {
                    me._$pageIndex = parseInt($(this).val());
                    me._reloadProContainer();
                });

                me._$paginationElement.show();
                me._$jumpPageElement.show();
                me._$jumpPageElement.prev().show();
                me._$pageSizeElement.show();
                me._$pageSizeElement.prev().show();
            }
        },

        /************************************************************************
        * Get data from view                                                    *
        *************************************************************************/
        _getTripIdFromView: function () {
            return $('div.product-toolbar').find('select[name="TripId"]').val();
        },
        _getTripTimeFromView: function () {
            return $('div.product-toolbar').find('select[name="TimeSlot"]').val();
        },
        _getDateFromView: function () {
            return $('div.product-toolbar').find('input[name="DepartureDate"]').val();
        },
        _clearForm: function () {
            var me = this;
            me._$formNhapHang.find('input').val('');
        },

        /************************************************************************
        * Update Form                                                           *
        *************************************************************************/
        _createDataUpdateForm: function (proOrderId) {
            var me = this;
            var d = {};
            d.receivedOffices = me._getOfficeReceive();
            var requestSuccess = function (u, r, l, t) {
                if (u && l == 1) {
                    var pro = me._convertDbIntoProOrderObj(r[0]);
                    d.proId = proOrderId;
                    d.receivedOfficeId = pro._agentId;
                    d.status = pro._statusInfo._code;
                    d.senderName = pro._senderInfo._name;
                    d.senderPhone = pro._senderInfo._phone;
                    d.receiverName = pro._receiverInfo._name;
                    d.receiverPhone = pro._receiverInfo._phone;
                    d.fareOfPro = pro._fare;
                    d.noteOfPro = pro._note;
                    d.weightOfPro = pro._weight;
                    d.unitOfPro = pro._unitInfo._code;
                    d.numOfPro = pro._num;
                    d.receivedAddress = pro._receiverInfo._address;
                }
            };
            me._submitAction($.createGetProOrderDetailObj(proOrderId), requestSuccess);
            return d;
        },
        _bindEventUpdateForm: function () {
            var me = this;
            me._autoFormatFare();
            me._$updateModal.find('button.btn-update-form-save').unbind().on('click', function () {
                var proId = me._$updateModal.find('input[name="ProId"]').val();
                var dOrderUpdate = me._createProOrderUpdateObj(me._$updateModal);
                var requestSuccess = function (u, r, l, t) {
                    if (u == 1) {
                        me._reloadProContainer();
                        me._$updateModal.modal('hide');
                    }
                };
                me._submitAction($.createUpdateProOrderObj({ Id: proId }, dOrderUpdate), requestSuccess);
            });
        },
        _initUpdateForm: function (element) {
            var me = this;
            var proOrderId = element.attr('data-id');
            var html = $.getHtml('update-product-form', me._createDataUpdateForm(proOrderId));
            $('body div.ui-layout-center div.update-hang-hoa').remove();
            me._$updateModal = $(html).appendTo($('body div.ui-layout-center'));
            me._bindEventUpdateForm();
        },

        /************************************************************************
        * Cancel Form                                                           *
        *************************************************************************/
        _initCancelForm: function (element) {
            var me = this;
            var proOrderId = element.attr('data-id');
            var html = $.getHtml('cancel-product-form', { proOrderId: proOrderId });
            $('body div.ui-layout-center div.cancel-hang-hoa').remove();
            me._$cancelModal = $(html).appendTo($('body div.ui-layout-center'));
            me._bindEventCancelForm();
        },
        _bindEventCancelForm: function () {
            var me = this;
            me._$cancelModal.find('button.btn-cancel').unbind().on('click', function () {
                var proOrderId = $(this).attr('data-id');
                var requestSuccess = function (u, r, l, t) {
                    if (u == 1) {
                        me._reloadProContainer();
                        me._$cancelModal.modal('hide');
                    }
                }
                me._submitAction($.createCancelProOrderObj(proOrderId), requestSuccess);
            });
        },

        /************************************************************************
        * Phiếu hàng                                                            *
        *************************************************************************/
        _initPhieuHang: function (element) {
            var me = this;
            var proOrderId = element.attr('data-id');
            me._$phieuHangHTML = $.getHtml('phieu-hang', me._createDataPhieuHang(proOrderId));
            var printContent = me._$phieuHangHTML;
            var windowUrl = 'about:blank';
            var printWindow = window.open(windowUrl, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            printWindow.document.write('<link rel="stylesheet" href="' + _dictionary._baseUrl + '/' + app.cssBootStrap + '" type="text/css" />');
            printWindow.document.write('<link rel="stylesheet" media="(max-width: 800px)" href="' + _dictionary._baseUrl + _dictionary._pStyleUrl + '" type="text/css" />');
            printWindow.document.write('</head><body onload="window.top.print()" >');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
        },
        _createDataPhieuHang: function (proOrderId) {
            var me = this;
            var d = {}
            var tripDetail = {}
            var driverList = [];
            var fromName = "";
            var toName = "";
            var requestSuccess = function (u, r, l, t) {
                if (u && l == 1) {
                    var pro = me._convertDbIntoProOrderObj(r[0]);
                    d.logoUrl = _dictionary._logoUrl;
                    // Thông tin tuyến đường và tài xế
                    var tripDate = vDtToStr("iso", vGtDtObj('00:00', pro._tripDate));
                    var successRequestTrip = function (u2, r2, l2, t2) {
                        if (u2 == 1 && l2 == 1) {
                            // Lấy thông tin tài xế
                            if (vIsEstStr(r2[0][1])) {
                                var teamInfo = r2[0][1].split('~');
                                // get Driver Info: Version ~ Driver ~ Assistant
                                $.each(teamInfo, function (index, value) {
                                    if (value.length > 1) {
                                        var info = value.split('|');
                                        // driver has type = 2
                                        if (info[0] == 2) {
                                            driverList.push(info[2] + ' - ' + (!info[3] ? '' : info[3]));
                                        }
                                    }
                                });
                                tripDetail.driverInfo = driverList.join(', ');
                            } else {
                                tripDetail.driverInfo = '';
                            }
                            // Lấy thông tin xe
                            if (vIsEstStr(r2[0][2])) {
                                var vehicleInfo = r2[0][2].substr(r2[0][2].indexOf('~'), r2[0][2].length).split('|');
                                tripDetail.vehicleNumber = vehicleInfo[2];
                            } else {
                                tripDetail.vehicleNumber = '';
                            }
                            // Lấy thông tin điểm đi
                            if (vIsEstStr(r2[0][3])) {
                                var indFrom = r2[0][3].indexOf('~');
                                var from = r2[0][3].substr(indFrom, r2[0][3].length).split('|');
                                fromName = from[3];
                                d.fromName = fromName;
                            }
                            // Lấy thông tin điểm đến
                            if (vIsEstStr(r2[0][4])) {
                                var indTo = r2[0][4].indexOf('~');
                                var to = r2[0][4].substr(indTo, r2[0][4].length).split('|');
                                toName = to[3];
                                d.toName = toName;
                            }
                        } else {
                            tripDetail.driverInfo = driverList;
                            tripDetail.vehicleNumber = '';
                        }
                        d.driverInfo = tripDetail.driverInfo;
                        d.vehicleNumber = tripDetail.vehicleNumber;
                    }
                    me._submitAction($.createGetTripDetailObj(pro._tripId, pro._tripTime, tripDate), successRequestTrip);
                    d.tripDate = vDtToStr("dd/mm/yyyy", vGtDtObj('00:00', pro._tripDate));
                    d.tripTime = pro._tripTime;
                    // Thông tin hệ thống
                    d.createdUser = pro._createdUser;
                    // Văn phòng gửi
                    d.postOfficeName = pro._agentInfo._name;
                    d.postOfficePhone = pro._agentInfo._phone;
                    d.postOfficeAddress = pro._agentInfo._address;
                    // Văn phòng nhận
                    d.receivedOfficeName = pro._receivedAgentInfo._name;
                    d.receivedOfficePhone = pro._receivedAgentInfo._phone;
                    d.receivedOfficeAddress = pro._receivedAgentInfo._address;
                    // Ngày giờ gửi
                    d.createdDate = pro._createdDate._date;
                    d.createdTime = pro._createdDate._time;
                    // Thông tin người gửi
                    d.senderName = pro._senderInfo._name;
                    d.senderPhone = pro._senderInfo._phone;
                    // Thông tin người nhận
                    d.receiverName = pro._receiverInfo._name;
                    d.receiverPhone = pro._receiverInfo._phone;
                    d.receivedAddress = pro._receiverInfo._address;
                    // Thông tin đơn hàng
                    //d.proId = proOrderId;
                    d.fareOfPro = pro._fare;
                    d.noteOfPro = pro._note;
                    d.weightOfPro = pro._weight;
                    d.unitOfPro = pro._unitInfo._name;
                    d.numOfPro = pro._num;
                    d.proCode = pro._code;
                    switch (parseInt(pro._statusInfo._code)) {
                        case 1:
                            d.status = "Chưa thanh toán";
                            break;
                        case 2:
                            d.status = "Đã thanh toán";
                            break;
                        case 3:
                            d.status = "Chưa thanh toán";
                            break;
                        case 4:
                            d.status = "Chưa thanh toán";
                            break;
                        case 5:
                            d.status = "Đã thanh toán";
                            break;
                        case 6:
                            d.status = "Đã thanh toán";
                            break;
                        case 7:
                            d.status = "Chưa thanh toán";
                            break;
                        case 8:
                            d.status = "Đã thanh toán";
                            break;
                        case 9:
                            d.status = "Đã thanh toán";
                            break;
                    }
                }
            }
            me._submitAction($.createGetProOrderDetailObj(proOrderId), requestSuccess);
            return d;
        },

        /************************************************************************
        * Phơi hàng                                                             *
        *************************************************************************/
        _initPhoiHang: function () {
            var me = this;
            me._$phoiHangHTML = $.getHtml('phoi-hang', me._createDataPhoiHang());
            var printContent = me._$phoiHangHTML;
            var windowUrl = 'about:blank';
            var printWindow = window.open(windowUrl, 'width=' + screen.width + ', height=' + screen.height + ', scrollbars=1');
            printWindow.document.write('<link rel="stylesheet" href="' + _dictionary._baseUrl + '/' + app.cssBootStrap + '" type="text/css" />');
            printWindow.document.write('<link rel="stylesheet" media="(max-width: 800px)" href="' + _dictionary._baseUrl + _dictionary._pStyleUrl + '" type="text/css" />');
            printWindow.document.write('</head><body onload="window.top.print()" >');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
        },
        _createDataPhoiHang: function () {
            var me = this;
            var d = {};
            var proItems = [];
            var tripId = me._getTripIdFromView();
            var tripTime = me._getTripTimeFromView();
            var tripDate = vDtToStr("iso", vGtDtObj('00:00', me._getDateFromView()));
            var tripDetail = {}
            var driverList = [];
            var fromName = "";
            var toName = "";
            var totalFareBooked = 0;
            var totalFareBooking = 0;
            // Thông tin tuyến đường và tài xế
            var requestSuccess = function (u, r, l, t) {
                if (u && l > 0) {
                    $.each(r, function (index, value) {
                        var pro = me._convertDbIntoProOrderObj(value);
                        pro._index = index + 1;
                        if (pro._statusInfo._code == 3 || pro._statusInfo._code == 4) {
                            totalFareBooking += parseInt(pro._fare.replace(/\./g, ''));
                        } else if (pro._statusInfo._code == 5 || pro._statusInfo._code == 6) {
                            totalFareBooked += parseInt(pro._fare.replace(/\./g, ''));
                        }
                        var item = $.mapItemToView($.convertProToItem(pro));
                        proItems.push(item);
                    });

                    var successRequestTrip = function (u2, r2, l2, t2) {
                        if (u2 == 1 && l2 == 1) {
                            // Lấy thông tin tài xế
                            if (vIsEstStr(r2[0][1])) {
                                var teamInfo = r2[0][1].split('~');
                                // get Driver Info: Version ~ Driver ~ Assistant
                                $.each(teamInfo, function (index, value) {
                                    if (value.length > 1) {
                                        var info = value.split('|');
                                        // driver has type = 2
                                        if (info[0] == 2) {
                                            driverList.push(info[2] + ' - ' + (!info[3] ? '' : info[3]));
                                        }
                                    }
                                });
                                tripDetail.driverInfo = driverList.join(', ');
                            } else {
                                tripDetail.driverInfo = '';
                            }
                            // Lấy thông tin xe
                            if (vIsEstStr(r2[0][2])) {
                                var vehicleInfo = r2[0][2].substr(r2[0][2].indexOf('~'), r2[0][2].length).split('|');
                                tripDetail.vehicleNumber = vehicleInfo[2];
                            } else {
                                tripDetail.vehicleNumber = '';
                            }
                            // Lấy thông tin điểm đi
                            if (vIsEstStr(r2[0][3])) {
                                var indFrom = r2[0][3].indexOf('~');
                                var from = r2[0][3].substr(indFrom, r2[0][3].length).split('|');
                                fromName = from[3];
                                d.fromName = fromName;
                            }
                            // Lấy thông tin điểm đến
                            if (vIsEstStr(r2[0][4])) {
                                var indTo = r2[0][4].indexOf('~');
                                var to = r2[0][4].substr(indTo, r2[0][4].length).split('|');
                                toName = to[3];
                                d.toName = toName;
                            }
                        } else {
                            tripDetail.driverInfo = driverList;
                            tripDetail.vehicleNumber = '';
                        }
                        d.driverInfo = tripDetail.driverInfo;
                        d.vehicleNumber = tripDetail.vehicleNumber;
                    };
                    me._submitAction($.createGetTripDetailObj(tripId, tripTime, tripDate), successRequestTrip);
                }
            };
            me._submitAction($.createGetProOrderTripDetailNoPaginationObj(tripId, tripTime, tripDate), requestSuccess);
            d.logoUrl = _dictionary._logoUrl;
            d.tripTime = tripTime;
            d.tripDate = me._getDateFromView();
            d.totalFareBooked = totalFareBooked != 0 ? vToMn(totalFareBooked) : 0;
            d.totalFareBooking = totalFareBooking != 0 ? vToMn(totalFareBooking) : 0;
            d.listProductOrder = proItems;
            return d;
        },
    });

    /************************************************************************
    * Helper                                                                *
    *************************************************************************/
    $.convertProToItem = function (pro) {
        return new ItemPro(
            pro._id,
            pro._index,
            pro._code,
            pro._agentInfo,
            pro._senderInfo,
            pro._receiverInfo,
            pro._num,
            pro._unitInfo._name,
            pro._weight,
            pro._note,
            pro._fare,
            pro._statusInfo,
            pro._createdUser,
            pro._tripId,
            pro._tripTime,
            pro._tripDate,
            pro._receivedUser,
            pro._receivedAgentInfo,
            pro._deliveryInfo);
    }
    $.mapItemToView = function (item) {
        var result = {}
        result.proId = item._id;
        result.proIndex = item._index;
        result.proCode = item._code;
        result.officeReceivedName = item._officeReceivedName;
        result.postOfficeCode = item._postOfficeCode;
        result.senderName = item._senderName;
        result.senderPhone = item._senderPhone;
        result.receiverName = item._receiverName;
        result.receiverPhone = item._receiverPhone;
        result.receivedAddress = item._receivedAddress;
        result.numOfPro = item._num;
        result.unitOfPro = item._unit;
        result.proWeight = item._weight;
        result.proNote = item._note;
        result.proFare = item._fare;
        result.proStatusName = item._statusName;
        result.proStatusCode = item._statusCode;
        result.createdUser = item._createdUser;
        result.receivedUser = item._receivedUser;
        result.deliveryInfo = item._deliveryInfo;
        switch (parseInt(item._statusCode)) {
            case 4:
                result.disabled = "disabled";
                break;
            case 6:
                result.disabled = "disabled";
                break;
            case 9:
                result.disabled = "disabled";
                break;
            default:
                result.disabled = "";
                break;
        }
        return result;
    }
    // [{Name: '', Value: ''},..........]
    $.findObjByKey = function (array, key) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].Name.toLowerCase() == key.toLowerCase()) {
                return array[i].Value;
            }
        }
        return null;
    },

    /************************************************************************
    * AJAX OBJ                                                              *
    *************************************************************************/
    $.createGetProOrderDetailObj = function (proOrderId) {
        var obj = {};
        obj._a = "fGetProductOrder";
        obj._c = { Id: proOrderId };
        obj._f = _dictionary._qField.join();
        return obj;
    }
    $.createGetProOrderTripObj = function (tripId, pageIndex, pageSize) {
        var obj = {};
        obj._a = "pGetProductOrder";
        obj._c = {};
        obj._f = _dictionary._qField.join();
        obj._si = pageIndex;
        obj._mr = pageSize;
        obj._se = "IsPrgCreatedDate desc";
        obj._ft = "CompId = " + app.cid + " and TripId = " + tripId + " and TripDate is null and TripTime is null and IsPrgStatus = 1 and (Status = 1 or Status = 2) ";
        return obj;
    }
    $.crGetProOrderTripCounterObj = function (tripId) {
        var obj = {};
        obj._a = "fGetProductOrder";
        obj._c = {
            CompId: app.cid,
            TripId: tripId,
            TripDate: "$x is null",
            TripTime: "$x is null",
            IsPrgStatus: 1,
            Status: "($x = 1 or $x = 2)"
        };
        obj._f = _dictionary._qField.join();
        return obj;
    }
    $.createGetProOrderTripDetailObj = function (tripId, tripTime, tripDate, pageIndex, pageSize) {
        var obj = {};
        obj._a = "pGetProductOrder";
        obj._c = {};
        obj._f = _dictionary._qField.join();
        obj._si = pageIndex;
        obj._mr = pageSize;
        obj._se = "IsPrgCreatedDate desc";
        obj._ft = "CompId = " + app.cid + " and TripId = " + tripId + " and TripDate = '" + tripDate + "' and TripTime = '" + tripTime + "' and IsPrgStatus = 1";
        return obj;
    }
    $.crGetProOrderTripDetailCounterObj = function (tripId, tripTime, tripDate) {
        var obj = {};
        obj._a = "fGetProductOrder";
        obj._c = {
            CompId: app.cid,
            TripId: tripId,
            TripTime: tripTime,
            TripDate: tripDate,
            IsPrgStatus: 1,
            Status: "($x = 3 or $x = 4 or $x = 5 or $x = 6 or $x = 9)"
        };
        obj._f = _dictionary._qField.join();
        return obj;
    }
    $.crGetProOrderTripDetailDeliveryCounterObj = function () {
        var obj = {};
        obj._a = "fGetProductOrder";
        obj._c = {
            CompId: app.cid,
            IsPrgStatus: 1,
            Status: "($x = 4 or $x = 6)"
        };
        obj._f = _dictionary._qField.join();
        return obj;
    }
    $.createGetProOrderTripDetailNoPaginationObj = function (tripId, tripTime, tripDate) {
        var obj = {};
        obj._a = "fGetProductOrder";
        obj._c = {
            CompId: app.cid,
            TripId: tripId,
            TripTime: tripTime,
            TripDate: tripDate,
            IsPrgStatus: 1
        };
        obj._f = _dictionary._qField.join();
        return obj;
    }
    $.createGetProOrderReceivedObj = function (tripId, tripTime, tripDate, pageIndex, pageSize) {
        var obj = {};
        obj._a = "pGetProductOrder";
        obj._c = {};
        obj._f = _dictionary._qField.join();
        obj._si = pageIndex;
        obj._mr = pageSize;
        obj._se = "IsPrgCreatedDate desc";
        //obj._ft = "CompId = " + app.cid + " and TripId = " + tripId + " and TripDate = '" + tripDate + "' and TripTime = '" + tripTime + "' and (Status = 4 or Status = 6 or Status = 9) and IsPrgStatus = 1 ";
        obj._ft = "CompId = " + app.cid + " and TripId = " + tripId + " and (Status = 4 or Status = 6) and IsPrgStatus = 1 ";
        return obj;
    }
    $.createGetAllTripObj = function () {
        var obj = {};
        obj._a = "fGetTrip";
        obj._c = {
            CompId: app.cid,
            Type: 1,
            IsPrgStatus: "$x='1' order by name asc"
        };
        obj._f = _dictionary._qFieldTrip.join();
        return obj;
    }
    $.createGetTripObj = function (tripId) {
        var obj = {};
        obj._a = "fGetTrip";
        obj._c = {
            Id: tripId,
            CompId: app.cid,
            Type: 1,
            IsPrgStatus: 1
        };
        obj._f = _dictionary._qFieldTrip.join();
        return obj;
    }
    $.createGetTripDetailObj = function (baseId, tripTime, tripDate) {
        var obj = {};
        obj._a = "fGetTrip";
        obj._c = {
            BaseId: baseId,
            CompId: app.cid,
            Time: tripTime,
            Date: tripDate
        };
        obj._f = _dictionary._qFieldTripDetail.join();
        return obj;
    }
    $.createGetOfficeObj = function () {
        var obj = {};
        obj._a = "fGetCompany";
        obj._c = {
            BaseId: app.cid,
            Type: 2,
            IsPrgStatus: "$x=1 order by Name asc"
        };
        obj._f = _dictionary._qFieldOffice.join();
        return obj;
    }
    $.createGetPostOfficeObj = function (id) {
        var obj = {};
        obj._a = "fGetCompany";
        obj._c = { Id: id };
        obj._f = _dictionary._qFieldOffice.join();
        return obj;
    }
    $.createInsertProOrderObj = function (d) {
        var obj = {};
        obj._a = "InsertProductOrder";
        obj._d = d;
        return obj;
    }
    $.createUpdateProOrderObj = function (c, d) {
        var obj = {};
        obj._a = "UpdateProductOrder";
        obj._c = c;
        obj._d = d;
        return obj;
    }
    $.createInsertProObj = function (d) {
        var obj = {};
        obj._a = "InProducts";
        obj._d = d;
        return obj;
    }
    $.createCancelProOrderObj = function (proOrderId) {
        var obj = {};
        obj._a = "UpdateProductOrder";
        obj._c = { Id: proOrderId }
        obj._d = { IsPrgStatus: 3 }
        return obj;
    }
    $.crGetProOrderDetailObj = function (id) {
        var obj = {};
        obj._a = "pGetProductOrder";
        obj._c = {}
        obj._f = _dictionary._qField.join();
        obj._si = 1;
        obj._mr = 10;
        obj._se = "IsPrgCreatedDate desc";
        obj._ft = " Id = '" + id + "'";
        return obj;
    }

    /************************************************************************
    * Handlebar Helper                                                      *
    *************************************************************************/
    $.getHtml = function (id, data) {
        var source = $("#" + id).html();
        var result = Handlebars.compile(source)(data);
        return result;
    }
    Handlebars.registerHelper('if', function (conditional, options) {
        if (options.hash.value === conditional) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('select', function (value, options) {
        var $el = $('<select />').html(options.fn(this));
        $el.find('[value=' + value + ']').attr({ 'selected': 'selected' });
        return $el.html();
    });
    Handlebars.registerHelper('xIf', function (lvalue, operator, rvalue, options) {

        var operators, result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };

        if (!operators[operator]) {
            throw new Error("'xIf' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
})(jQuery);