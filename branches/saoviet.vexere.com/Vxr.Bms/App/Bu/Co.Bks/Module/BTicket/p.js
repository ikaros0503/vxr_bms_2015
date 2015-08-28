/*
 * This module allow us to load, display and manage all tickets which were booked on website.
 * Creator: Tuan Huynh
 */
define({
    pager: null, tickets:[],
    start: function (o) {
        /// <summary>Called when module's loaded</summary>
        $('#bksContent').hide();
        $('#report').hide();
        $('#product-content').hide();
        $('#cod').hide();

        $(jHtml.mainContainer).show();
        this.init();
        this.getTickets();
    },
    test: function () {
        vRqs({
            _a: jVar.getTicketFunction,
            _c: {
                Type: ' ($x=2 or $x=3) ',
                IsPrgCreatedDate: " ($x >='2015-02-01' and $x<'2015-05-01' )"
            },
            _f: jVar.fieldsToGet.join(),
        }, function (u, r, l, t) {

        });
    },

    renderTickets: function () {
        var self = this;
        $(jHtml.tableBody).html('');
        if (self.tickets.length == 0) return;
        var from = (self.pager.currentPage - 1) * self.pager.itemsPerPage;
        var to = Math.min(self.pager.currentPage * self.pager.itemsPerPage, self.tickets.length) - 1;
        for (var j = from; j <= to; j++) {
            $(jHtml.tableBody).append(vtpl(jHtml.itemTpl, self.tickets[j]));
        }

        $(jHtml.mnuCommandsItems).unbind().click(function () {
            if ($(this).hasClass("sendEmail")) {
                $("#dlgSendEmail").modal();
            } else if ($(this).hasClass("sendSms")) {
                $("#dlgSendSms").modal();
            } else if ($(this).hasClass("printTicket")) {

            } else if ($(this).hasClass("cancelTicket")) {
                $("#dlgCancelTicketWarning").modal();
            }
        });

        $(".chkConfirm").unbind().click(function () {
            var button = this;
            var id = parseInt($(button).attr("data-id"));
            vRqs({
                _a: jVar.updateTicketFunction,
                _c: { Id: id },
                _d: { IsConfirmed: $(this).is(":checked") == true ? 1 : 0 },
            }, function (uu, rr, ll, tt) {
                if (uu == 1 && rr.length > 0 && rr[0].length > 0 && rr[0][0] == 1) {
                    $("#confirmStatus" + $(button).attr("data-index")).html("");
                } else {
                    $(button).attr("checked", !$(button).is(":checked"));
                    $("#confirmStatus" + $(button).attr("data-index")).html("da co loi");
                }
            });
        });

        $(jHtml.refreshButton).unbind().click(function () {
            self.getTickets();
        });

        $("a.transactionDetail").click(function () {
            $('#dlgPaymentInfo').modal('show');
            $('#transactionId').html($(this).attr('data-transactionId'));
            $('#transactionDate').html($(this).attr('data-transactionDate') + ' ' + $(this).attr('data-transactionTime'));
            $('#transactionStatus').html($(this).attr('data-transactionStatus'));
            $('#transactionNLPaymentType').html($(this).attr('data-transactionNLPaymentType'));
            $('#transactionBankCode').html($(this).attr('data-transactionBankCode'));
            $('#transactionDescription').html($(this).attr('data-transactionDescription'));
            $('#transactionTs').html($(this).attr('data-transactionTs'));
            $('#transactionChecksum').html($(this).attr('data-transactionChecksum'));
        });

        $(jHtml.showMoreButton).unbind().click(function () {
            var index = $(this).attr('data-index');
            var button = this;
            if ($("#hiddenRow" + index).is(":hidden")) {
                $("#hiddenRow" + index).show('slow');

                $(button).css('-webkit-animation', 'rotateShow 0.5s ease-in-out');
                $(button).css('animation', 'rotateShow 0.5s ease-in-out');
                $(jHtml.showMoreButton).css('-webkit-animation-fill-mode', 'forwards');
                $(jHtml.showMoreButton).css('animation-fill-mode', 'forwards');
            } else {
                $("#hiddenRow" + index).hide('slow');
                $(button).css('-webkit-animation', 'rotateHide 0.5s ease-in-out');
                $(button).css('animation', 'rotateHide 0.5s ease-in-out');
                $(jHtml.showMoreButton).css('-webkit-animation-fill-mode', 'forwards');
                $(jHtml.showMoreButton).css('animation-fill-mode', 'forwards');
            }
        });
        $(jHtml.ticketCodeButtons).unbind().click(function () {
            $('a[data-tab=bks]', 'ul.vbooking-list').trigger('click');
            $("body").trigger('updateFilters', {
                compId: $(this).attr('data-compId'),
                tripId: $(this).attr('data-tripId'),
                tripDate: $(this).attr('data-tripDate'),
                tripTime: $(this).attr('data-tripTime')
            });
        });

    },

    init: function () {
        var self = this;

        var initFilter = function () {
            var conString = "";
            var data = {
                type: $(jHtml.mnuSource).attr('data-type'),
                code: $(jHtml.filterCode).val(),
                comp:replaceUnicodeCharacter($(jHtml.filterCompName).val()),
                customer:replaceUnicodeCharacter($(jHtml.filterCustomer).val()),
                account: replaceUnicodeCharacter($(jHtml.filterAccount).val()),
                createdDateStart: formatDatepicker($(jHtml.filterDate), "YYYY-MM-DD 00:00:00"),
                createdDateEnd: formatDatepicker($(jHtml.filterDate), "YYYY-MM-DD 23:59:59"),
                tripDateStart: formatDatepicker($(jHtml.filterTripDate), "YYYY-MM-DD 00:00:00"),
                tripDateEnd: formatDatepicker($(jHtml.filterTripDate), "YYYY-MM-DD 23:59:59"),
                status: $(jHtml.mnuStatus).attr('data-status'),

            };
            conString += data.type == -1 ? " ($x=2 or $x=3) " : " $x={type}";
            conString += data.code != '' ? " and Code like '%{code}%' " : "";
            conString += data.comp != '' ? " and ([dbo].ConvertToUnsignWithBlank(CompName) like N'%{comp}%' or SeatCode like N'%comp%') " : "";
            conString += data.customer != '' ? " and ([dbo].ConvertToUnsignWithBlank(CustomerInfo) like N'%{customer}%' or CustomerInfo like N'%customer%') " : "";
            conString += data.account != '' ? " and [dbo].ConvertToUnsignWithBlank(CreatedUser) like N'%{account}%'" : "";
            conString += data.createdDateStart != '' ? " and IsPrgCreatedDate>='{createdDateStart}' and IsPrgCreatedDate<='{createdDateEnd}'" : "";
            conString += data.tripDateStart != '' ? " and TripDate>='{tripDateStart}' and TripDate<='{tripDateEnd}'" : "";
            
            if (data.status != '-1') {
                if (status <= 3) {
                    conString += ' and Status= {status}';
                }else if (status == 30) {
                    conString += " and Status=3 and CanceledUser='server' ";
                }else if (status == 31) {
                    conString += " and Status=3 and CancelType=4 "; //khi chon ghe
                }else if (status == 32) {
                    conString += ' and Status=3 and CancelType=5 '; // ngan luong
                }else if (status == 33) {
                    conString += ' and Status=3 and CancelType=6 '; //123pay    
                }
            }
            conString = conString + ' order by IsPrgCreatedDate desc ';

            filter.Type =vtpl(conString,data);
        };

        var bindEvents = function() {
            $(jHtml.filterDate).datepicker({ dateFormat: 'dd-mm-yy' });
            $(jHtml.filterDate).datepicker("setDate", new Date());

            $(jHtml.filterToDate).datepicker({ dateFormat: 'dd-mm-yy' });
            $(jHtml.filterToDate).datepicker("setDate", new Date());

            $(jHtml.filterTripDate).datepicker({ dateFormat: 'dd-mm-yy' });

            $(jHtml.filterTripDate).focus(function () {
                $(this).select();
            });
            $(jHtml.allTextFilter).change(function () {
                initFilter();
                self.getTickets();
            });
            $(jHtml.filterTripDate).keypress(function (e) {
                if (e.keyCode == 13) {
                    initFilter();
                    self.getTickets();
                }
            });
            $(jHtml.mnuSourceItems).click(function () {
                $(jHtml.mnuSourceItems).removeClass('selected');
                $(this).addClass('selected');
                var type = $(this).attr('data-type');
                $(jHtml.mnuSource).attr('data-type', type);
                if (type == -1) {
                    $(jHtml.mnuSource).html('Nguồn&nbsp;<span class="caret"></span>');
                } else {
                    $(jHtml.mnuSource).html($(this).text() + '&nbsp;<span class="caret"></span>');
                }
                initFilter();
                self.getTickets();
                //searchLocal();
            });
            $(jHtml.mnuStatusItems).click(function () {
                $(jHtml.mnuStatusItems).removeClass('selected');
                $(this).addClass('selected');
                var status = $(this).attr('data-status');
                $(jHtml.mnuStatus).attr('data-status', status);
                if (status == -1) {
                    $(jHtml.mnuStatus).html('Trạng thái&nbsp;<span class="caret"></span>');
                } else {
                    $(jHtml.mnuStatus).html($(this).text() + '&nbsp;<span class="caret"></span>');
                }
                initFilter();
                self.getTickets();
                //searchLocal();
            });
        };

        $.getScript('App/Core/UI/pager.js', function () {
            self.pager = new Pager(1, 10, "#divPaging", 5, function () {
                self.renderTickets();
            });
        });

        $('body').append(jHtml.modals);
        $(jHtml.mainContainer).html('')
            .append(jHtml.headerTpl)
            .append($(jHtml.tableContainerHtml))
            .append(jHtml.pageNav);

        bindEvents();

        initFilter();
    },

    updateVisible: function (isLoading) {
        $(jHtml.refreshButton).prop('disabled', isLoading=='loading');
        $(jHtml.mainContainer + " input").prop('disabled', isLoading == 'loading');
        $(jHtml.pagingContainer + " a").prop('disabled', isLoading == 'loading');
        $(jHtml.pagingContainer + " select").prop('disabled', isLoading == 'loading');
        $(jHtml.mnuSource).prop('disabled', isLoading == 'loading');
        $(jHtml.mnuStatus).prop('disabled', isLoading == 'loading');
    },

    getItemFromRecord1: function (record, index) {
        var self = this;
        var parseDate = function (date) {
            return date != null ? new Date(parseInt(date.substring(date.indexOf('(') + 1).replace(')/', ''))) : '';
        };
        if (typeof record != 'undefined' && record != null) {
            var tripDate = parseDate(record[3]);

            var createdDate = parseDate(record[22]);
            var transactionDate = parseDate(record[29]);
            var seats = record[4];
            var seatStr = seats.split('|')[0];

            if (seatStr[seatStr.length - 1] == ',') {
                seatStr = seatStr.substr(0, seatStr.length - 1);
            }

            var statusDate = '';
            var paymentType = getSubItem(record[11], ':',1);
            if (record[1] == '2') { //from front end
                paymentType = getSubItem(record[17], ':',1);
            }
            var paymentLoc = '';
            if (paymentType != '' && record[1] != '2') {
                paymentLoc = getSubItem(getSubItem(record[11], ':',2), '|',3);
            }

            var status1 = '', status2 = '', status3 = '', statusClass = '';
            if (record[2] == 1) {
                status1 = "Đặt chỗ";
                statusDate = '';
                statusClass = 'bookedTicket';
            } else if (record[2] == 2) {
                status1 = 'Đã thanh toán';
                status2 = paymentType;
                status3 = paymentLoc;
                statusDate = parseDate(record[26]); //ngay thanh toan
                statusClass = 'paidTicket';
            } else {
                statusDate = parseDate(record[16]); //da huy
                status1 = "Đã hủy";
                statusClass = 'cancelledTicket';
                if (record[20] == "server") {
                    status2 = "Tự động";
                } else if (record[23] == 4) {
                    status2 = "Khi chọn ghế";
                } else if (record[23] == 5) {
                    status2 = "Ngân Lượng";
                } else if (record[23] == 6) {
                    status2 = "123Pay";
                }
            }


            var pickupInfo = getSubItem(record[10], '|',0);
            var cusName = getSubItem(record[7], '|',3);
            var cusPhone = getSubItem(record[7], '|',4);

            var result = {
                "type": record[1],
                "statusClass": statusClass,
                "transactionId": record[25],
                "transactionIdDisplay": record[25] != null ? 'display' : 'none',
                "tripName": record[24],
                "fromArea": getSubItem(record[14], '|',3),
                "toArea": getSubItem(record[15], '|',3),
                "note": record[9],
                "noteDisplay": record[9] != null ? 'display' : 'none',
                "money": record[8] == undefined ? '0' : record[8],
                "fare": record[8] == undefined ? '0' : record[8],
                "tripDate": moment(tripDate).format( jVar.dateDisplayFormat),
                "tripTime": moment(tripDate).format( "hh:mm"),
                "createdDate": moment(createdDate).format(jVar.dateDisplayFormat),
                "createdTime": moment(createdDate).format( "hh:mm"),
                "seat": seatStr,
                "pickupInfo": pickupInfo,
                "pickupInfoDisplay": pickupInfo != '' ? 'display' : 'none',
                "customerDisplay": (cusName != '' || cusPhone != '' || pickupInfo != '') ? 'display' : 'none',
                "customerName": cusName,
                "customerNameSub": cusName != '' ? cusName : 'Khách hàng',
                "customerPhone": cusPhone,
                "customerPhoneDisplay": cusPhone != '' ? 'display' : 'none',
                "statusDate": moment(statusDate).format(jVar.dateDisplayFormat),
                "statusTime": moment(statusDate).format( "hh:mm"),
                "statusDateDisplay": statusDate != null ? 'display' : 'none',
                "chargedUser": record[13],
                "chargedUserDisplay": record[13] != null ? 'display' : 'none',
                "code": record[0],
                "companyName": record[19],
                "paymentType": paymentType,
                "paymentLoc": paymentLoc,
                "createdUser": record[12],
                "source": record[1] == '2' ? "Online" : record[1] == '3' ? "VMS" : "",
                "isConfirmed": (record[21] != null && record[21] == 1) ? jHtml.isConfirmed : jHtml.notConfirmed,
                "index": index,
                "status": status,
                "status1": status1,
                "status2": status2,
                "status2Display": status2 != '' ? 'display' : 'none',
                "status3": status3,
                "status3Display": status3 != '' ? 'display' : 'none',
                "id": record[27],
                "transactionGateway": record[28],
                "transactionDate": moment(transactionDate).format( jVar.dateDisplayFormat),
                "transactionTime": moment(transactionDate).format("hh:mm"),
                "transactionStatus": record[30],
                "transactionNLPaymentType": record[31],
                "transactionBankCode": record[32],
                "transactionDescription": record[33],
                "transactionChecksum": record[34],
                "totalSeats": 1
            };
            result.moneyFormatted = vToMn(result.money);
            result.fareFormatted = vToMn(result.fare);
            result.isConfirmed = vtpl(result.isConfirmed, { code: result.code, id: result.id, index: index });
            return result;
        }
        return {};
    },

    getTickets: function () {

        var groupTickets = function (arr) {
            var result = [];
            var currentTicket = self.getItemFromRecord1(arr[0], 0);
            for (var i = 1; i < arr.length; i++) {
                var item = self.getItemFromRecord1(arr[i], i);
                if (item.code != currentTicket.code) {
                    result.push(currentTicket);
                    currentTicket = item;
                } else {
                    currentTicket.money += item.fare;
                    currentTicket.totalSeats += 1;
                    currentTicket.seat += ', ' + item.seat;
                    currentTicket.moneyFormatted = vToMn(currentTicket.money);
                }
            }
            result.push(currentTicket);
            return result;
        };

        var self = this;
        $(jHtml.tableBody).html(jHtml.loadingAnimation);
        $(jHtml.pagingContainer).html('');
        self.updateVisible('loading');
        self.tickets = [];
        $(jHtml.tableBody).html('');
        vRqs({
            _a: jVar.getTicketFunction,
            _c: filter,
            _f: jVar.fieldsToGet.join(),
        }, function (u, r, l, t) {
            if (u == 1 && r.length>0) {
                self.tickets = groupTickets(r);
            }
            self.pager.updateInfo(self.tickets.length, 1).render();
            self.updateVisible('loaded');
        });
    },
});
