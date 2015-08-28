/*
 * This module allow us to load, display and manage all tickets which were booked on website.
 * Creator: Tuan Huynh
 */
define({
    start: function (o) {
        /// <summary>Called when module's loaded</summary>
        $('#bksContent').hide();
        $('#report').hide();
        $('#product-content').hide();

        $(jHtml.mainContainer).show();

        this.initView();
        this.getTickets();
        //this.test();

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

    initView: function () {
        /// <summary>Create view when page's loaded</summary>
        var self = this;
        var $container = $(jHtml.mainContainer);
        $container.hide();
        $container.html('').append(jHtml.headerTpl);

        $container.fadeIn(500);
        $container.append($(jHtml.tableContainerHtml)).append(jHtml.pageNav);
        $('body').append(jHtml.modals);

        //init UI and bind events
        $(jHtml.filterDate).datepicker({ dateFormat: 'dd-mm-yy' });
        $(jHtml.filterDate).datepicker("setDate", new Date());

        $(jHtml.filterToDate).datepicker({ dateFormat: 'dd-mm-yy' });
        $(jHtml.filterToDate).datepicker("setDate", new Date());

        $(jHtml.filterTripDate).datepicker({ dateFormat: 'dd-mm-yy' });

        $(jHtml.filterTripDate).focus(function () {
            $(this).select();
        });

        var initFilter = function () {
            var conString = "";
            var type = $(jHtml.mnuSource).attr('data-type');
            conString += type == -1 ? ' ($x=2 or $x=3) ' : ' $x= ' + type;

            var code = $(jHtml.filterCode).val();
            conString += code != '' ? (" and Code like '%" + code + "%' ") : "";

            var compName = self.replaceUnicodeCharacter($(jHtml.filterCompName).val());
            conString += compName != '' ? (" and ([dbo].ConvertToUnsignWithBlank(CompName) like N'%" + compName + "%' or SeatCode like N'%" + compName + "%')") : "";

            var cusInfo = self.replaceUnicodeCharacter($(jHtml.filterCustomer).val());
            conString += cusInfo != '' ? (" and [dbo].ConvertToUnsignWithBlank(CustomerInfo) like N'%" + cusInfo + "%'") : "";

            var account = self.replaceUnicodeCharacter($(jHtml.filterAccount).val());
            conString += account != '' ? (" and [dbo].ConvertToUnsignWithBlank(CreatedUser) like N'%" + account + "%'") : "";

            var ndate = new Date($(jHtml.filterToDate).datepicker('getDate'));
            ndate.setDate(ndate.getDate() + 1);

            conString += " and IsPrgCreatedDate>='" + self.toDbDateString(new Date($(jHtml.filterDate).datepicker('getDate'))) + "' and IsPrgCreatedDate<'" + self.toDbDateString(ndate) + "'";

            var date = $(jHtml.filterTripDate).datepicker('getDate');
            if (date != null) {
                date = new Date(date);
                var ndate1 = new Date($(jHtml.filterTripDate).datepicker('getDate'));
                ndate1.setDate(ndate1.getDate() + 1);
                conString += " and TripDate>='" + self.toDbDateString(date) + "' and TripDate<'" + self.toDbDateString(ndate1) + "' ";
            }

            var status = $(jHtml.mnuStatus).attr('data-status');
            if (status == -1) {
            } else if (status < 3) {
                conString += ' and Status= ' + status;
            } else if (status == 30) {
                conString += " and Status=3 and CanceledUser='server' ";
            }
            else if (status == 31) {
                conString += " and Status=3 and CancelType=4 "; //khi chon ghe
            }
            else if (status == 32) {
                conString += ' and Status=3 and CancelType=5 '; // ngan luong
            }
            else if (status == 33) {
                conString += ' and Status=3 and CancelType=6 '; //123pay
            } else {
            }
            conString = conString + ' order by IsPrgCreatedDate desc ';
            filter.Type = conString;
        };


        initFilter();

        var searchLocal = function () {
            var result = [];
            if (tickets.length <= 0) return result;
            for (var i = 0; i < tickets.length; i++) {

            }
        };

        $(jHtml.allTextFilter).change(function () {
            initFilter();
            self.getTickets();
            // searchLocal();
        });
        $(jHtml.filterTripDate).keypress(function (e) {
            if (e.keyCode == 13) {
                initFilter();
                self.getTickets();
                //searchLocal();
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
    },

    updateVisible: function () {
        $(jHtml.refreshButton).prop('disabled', jVar.isLoading);
        $(jHtml.mainContainer + " input").prop('disabled', jVar.isLoading);
        $(jHtml.pagingContainer + " a").prop('disabled', jVar.isLoading);
        $(jHtml.pagingContainer + " select").prop('disabled', jVar.isLoading);
        $(jHtml.mnuSource).prop('disabled', jVar.isLoading);
        $(jHtml.mnuStatus).prop('disabled', jVar.isLoading);
    },

    getItemFromRecord: function (record, index) {
        var self = this;
        var parseDate = function (date) {
            return date != null ? new Date(parseInt(date.substring(date.indexOf('(') + 1).replace(')/', ''))) : '';
        };
        if (typeof record != 'undefined' && record != null) {
            var tripDate = parseDate(record[4]);

            var createdDate = parseDate(record[23]);
            var transactionDate = parseDate(record[30]);
            var seats = record[5].split(',');
            var seatStr = '';
            var seatsCount = seats.length;
            for (var i = 0; i < seatsCount; i++) {
                var s = seats[i].split('|');
                if (s.length > 0) {
                    seatStr = seatStr + s[0] + (i != seatsCount - 1 ? ',' : '');
                }
            }
            if (seatStr[seatStr.length - 1] == ',') {
                seatStr = seatStr.substr(0, seatStr.length - 1);
            }

            var statusDate = '';
            var paymentType = self.getSubItem(record[12], 1, ':');
            if (record[2] == '2') { //from front end
                paymentType = self.getSubItem(record[18], 1, ':');
            }
            var paymentLoc = '';
            if (paymentType != '' && record[2] != '2') {
                paymentLoc = self.getSubItem(self.getSubItem(record[12], 2, ':'), 3, '|');
            }

            var status1 = '', status2 = '', status3 = '', statusClass = '';
            if (record[3] == 1) {
                status1 = "Đặt chỗ";
                statusDate = '';
                statusClass = 'bookedTicket';
            } else if (record[3] == 2) {
                status1 = 'Đã thanh toán';
                status2 = paymentType;
                status3 = paymentLoc;
                statusDate = parseDate(record[27]); //ngay thanh toan
                statusClass = 'paidTicket';
            } else {
                statusDate = parseDate(record[17]); //da huy
                status1 = "Đã hủy";
                statusClass = 'cancelledTicket';
                if (record[21] == "server") {
                    status2 = "Tự động";
                } else if (record[24] == 4) {
                    status2 = "Khi chọn ghế";
                } else if (record[24] == 5) {
                    status2 = "Ngân Lượng";
                } else if (record[24] == 6) {
                    status2 = "123Pay";
                }
            }


            var pickupInfo = self.getSubItem(record[11], 0, '|');
            var cusName = self.getSubItem(record[8], 3, '|');
            var cusPhone = self.getSubItem(record[8], 4, '|');

            var result = {
                "statusClass": statusClass,
                "transactionId": record[26],
                "transactionIdDisplay": record[26] != null ? 'display' : 'none',
                "tripName": record[25],
                "fromArea": self.getSubItem(record[15], 3, '|'),
                "toArea": self.getSubItem(record[16], 3, '|'),
                "note": record[10],
                "noteDisplay": record[10] != null ? 'display' : 'none',
                "money": record[9] == undefined ? '0' : record[9],
                "tripDate": self.toDateString(tripDate, jVar.dateDisplayFormat),
                "tripTime": self.toDateString(tripDate, "hh:mm"),
                "createdDate": self.toDateString(createdDate, jVar.dateDisplayFormat),
                "createdTime": self.toDateString(createdDate, "hh:mm"),
                "seat": seatStr,
                "pickupInfo": pickupInfo,
                "pickupInfoDisplay": pickupInfo != '' ? 'display' : 'none',
                "customerDisplay": (cusName != '' || cusPhone != '' || pickupInfo != '') ? 'display' : 'none',
                "customerName": cusName,
                "customerNameSub": cusName != '' ? cusName : 'Khách hàng',
                "customerPhone": cusPhone,
                "customerPhoneDisplay": cusPhone != '' ? 'display' : 'none',
                "statusDate": self.toDateString(statusDate, jVar.dateDisplayFormat),
                "statusTime": self.toDateString(statusDate, "hh:mm"),
                "statusDateDisplay": statusDate != null ? 'display' : 'none',
                "chargedUser": record[14],
                "chargedUserDisplay": record[14] != null ? 'display' : 'none',
                "code": record[1],
                "companyName": record[20],
                "paymentType": paymentType,
                "paymentLoc": paymentLoc,
                "createdUser": record[13],
                "source": record[2] == '2' ? "Online" : record[2] == '3' ? "VMS" : "",
                "isConfirmed": (record[22] != null && record[22] == 1) ? jHtml.isConfirmed : jHtml.notConfirmed,
                "index": index,
                "status": status,
                "status1": status1,
                "status2": status2,
                "status2Display": status2 != '' ? 'display' : 'none',
                "status3": status3,
                "status3Display": status3 != '' ? 'display' : 'none',
                "id": record[28],
                "transactionGateway": record[29],
                "transactionDate": self.toDateString(transactionDate, jVar.dateDisplayFormat),
                "transactionTime": self.toDateString(transactionDate, "hh:mm"),
                "transactionStatus": record[31],
                "transactionNLPaymentType": record[32],
                "transactionBankCode": record[33],
                "transactionDescription": record[34],
                "transactionChecksum": record[35]
            };

            result.isConfirmed = vtpl(result.isConfirmed, { code: result.code, id: result.id, index: index });
            return result;
        }
        return {};
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
            var paymentType = self.getSubItem(record[11], 1, ':');
            if (record[1] == '2') { //from front end
                paymentType = self.getSubItem(record[17], 1, ':');
            }
            var paymentLoc = '';
            if (paymentType != '' && record[1] != '2') {
                paymentLoc = self.getSubItem(self.getSubItem(record[11], 2, ':'), 3, '|');
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


            var pickupInfo = self.getSubItem(record[10], 0, '|');
            var cusName = self.getSubItem(record[7], 3, '|');
            var cusPhone = self.getSubItem(record[7], 4, '|');

            var result = {
                "type": record[1],
                "statusClass": statusClass,
                "transactionId": record[25],
                "transactionIdDisplay": record[25] != null ? 'display' : 'none',
                "tripName": record[24],
                "fromArea": self.getSubItem(record[14], 3, '|'),
                "toArea": self.getSubItem(record[15], 3, '|'),
                "note": record[9],
                "noteDisplay": record[9] != null ? 'display' : 'none',
                "money": record[8] == undefined ? '0' : record[8],
                "fare": record[8] == undefined ? '0' : record[8],
                "tripDate": self.toDateString(tripDate, jVar.dateDisplayFormat),
                "tripTime": self.toDateString(tripDate, "hh:mm"),
                "createdDate": self.toDateString(createdDate, jVar.dateDisplayFormat),
                "createdTime": self.toDateString(createdDate, "hh:mm"),
                "seat": seatStr,
                "pickupInfo": pickupInfo,
                "pickupInfoDisplay": pickupInfo != '' ? 'display' : 'none',
                "customerDisplay": (cusName != '' || cusPhone != '' || pickupInfo != '') ? 'display' : 'none',
                "customerName": cusName,
                "customerNameSub": cusName != '' ? cusName : 'Khách hàng',
                "customerPhone": cusPhone,
                "customerPhoneDisplay": cusPhone != '' ? 'display' : 'none',
                "statusDate": self.toDateString(statusDate, jVar.dateDisplayFormat),
                "statusTime": self.toDateString(statusDate, "hh:mm"),
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
                "transactionDate": self.toDateString(transactionDate, jVar.dateDisplayFormat),
                "transactionTime": self.toDateString(transactionDate, "hh:mm"),
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
        /// <summary>Get all tickets base on filter conditions</summary>
        var self = this;
        $(jHtml.tableBody).html(jHtml.loadingAnimation);
        $(jHtml.pagingContainer).html('');
        jVar.isLoading = true;
        self.updateVisible();
        //tickets = [];

        vRqs({
            _a: jVar.getTicketFunction,
            //_ft: vtpl(jVar.conditionString, filter),
            _c: filter,// vtpl(jVar.conditionString, filter),
            //_se: jVar.sortBy,
            _f: jVar.fieldsToGet.join(),
            //_si: paging.current,
            //_mr: paging.itemsPerPage,
        }, function (u, r, l, t) {
            var $tableBody = $(jHtml.tableBody);
            $tableBody.html('');
            if (r != null && r.length > 0) {
                var currentTicket = self.getItemFromRecord1(r[0], 0);
                tickets = [];
                for (var i = 1; i < r.length; i++) {
                    var item = self.getItemFromRecord1(r[i], i);
                    if (item.code != currentTicket.code) {
                        tickets.push(currentTicket);
                        currentTicket = item;
                    } else {
                        currentTicket.money += item.fare;
                        currentTicket.totalSeats += 1;
                        currentTicket.seat += ', ' + item.seat;
                        currentTicket.moneyFormatted = vToMn(currentTicket.money);
                    }
                }
                tickets.push(currentTicket);
                self.changePage();
            }
            $(jHtml.tableBody).hide();
            $(jHtml.tableBody).fadeIn("slow");
            paging.total = Math.ceil(((tickets.length == 0) ? 1 : tickets.length) / paging.itemsPerPage);
            self.updatePage(tickets.length);

            jVar.isLoading = false;
            self.updateVisible();

        });
    },

    updatePage: function (t) {
        /// <summary>Update pagination bar</summary>
        /// <param name="t" type="int">total records of result</param>
        var self = this;
        $(jHtml.pagingContainer).html('');
        if (t <= 0) {
            $(jHtml.pagingContainer).hide();
            $(jHtml.pagingContainer).html(jHtml.noTicketAlert);
            $(jHtml.pagingContainer).fadeIn("slow");
            return;
        }
        $(jHtml.pagingContainer).hide();
        var $allPages = '';
        var $selectPagesOptions = '';
        for (var index = 1; index <= paging.total; index++) {
            $selectPagesOptions += vtpl(jHtml.selectPagesOption, { value: index });
            if (index == paging.current) {
                $allPages += vtpl(jHtml.selectedPageButton, { value: index });
            } else {
                $allPages += vtpl(jHtml.pageButton, { value: index });
            }
        }
        $(jHtml.pagingContainer).html(vtpl(jHtml.paging, {
            previous: paging.current - 1,
            next: paging.current + 1,
            total: paging.total,
            allPages: $allPages,
            selectPageNumbers: $selectPagesOptions
        }));

        $(jHtml.selectPages).val(paging.current);
        $(jHtml.selectItemsPerPage).val(paging.itemsPerPage);

        self.setElementVisibility(jHtml.firstPageButton, paging.total > 1 && paging.current > 1);
        self.setElementVisibility(jHtml.previousPageButton, paging.total > 1 && paging.current > 1);
        self.setElementVisibility(jHtml.nextPageButton, paging.total > 1 && paging.current < paging.total);
        self.setElementVisibility(jHtml.lastPageButton, paging.total > 1 && paging.current < paging.total);
        self.setElementVisibility(jHtml.selectPages, paging.total > 1);

        $(jHtml.pagingContainer).fadeIn(500);

        $(jHtml.allPageButtons).click(function () {
            if (!$(this).parent().hasClass("disabled")) {
                paging.current = parseInt($(this).attr('data-index'));
                self.changePage();
            }
        });
        $(jHtml.selectPages).on("change", function (e) {
            paging.current = parseInt($(jHtml.selectPages).val());
            self.changePage();
        });
        $(jHtml.selectItemsPerPage).on("change", function (e) {
            paging.current = 1;
            paging.itemsPerPage = parseInt($(jHtml.selectItemsPerPage).val());;
            self.changePage();
        });
    },
    changePage: function () {
        var self = this;
        var $tableBody = $(jHtml.tableBody);
        $tableBody.html('');
        var from = (paging.current - 1) * paging.itemsPerPage;
        var to = (paging.current) * paging.itemsPerPage;
        if (to > tickets.length) to = tickets.length;
        for (var j = from; j < to; j++) {
            var tmp = tickets[j];
            tmp.money = vToMn(tmp.money);
            $tableBody.append(vtpl(jHtml.itemTpl, tmp));
        }
        this.updatePage();

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
            var id = parseInt($(this).attr("data-id"));
            var code = parseInt($(this).attr("data-code"));
            var td = $(button).parent();
            vRqs({
                _a: jVar.updateTicketFunction,
                _c: { Id: id },
                //_c: { Code: code },
                _d: { IsConfirmed: $(this).is(":checked") == true ? 1 : 0 },
            }, function (uu, rr, ll, tt) {
                if (uu == 1 && rr.length > 0 && rr[0].length > 0 && rr[0][0] == 1) {
                    //do nothing
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

    setElementVisibility: function (selector, isVisible) {
        /// <summary>Set visibility of emelemt</summary>
        /// <param name="selector" type="string">jquery's selector string</param>
        /// <param name="isVisible" type="boolean">value to be set</param>
        /// <returns type="selector">Source selector with visibility is updated</returns>
        if (isVisible) {
            $(selector).removeClass("disabled");
        } else {
            $(selector).addClass("disabled");
        }
        return $(selector);
    },

    getSubItem: function (item, index, seperatorChar) {
        /// <summary>Get subitem of a string</summary>
        /// <param name="item" type="string">source item</param>
        /// <param name="index" type="number">index of subitem</param>
        /// <param name="seperatorChar" type="string">seperator char between subitems</param>
        /// <returns type="string">sub item you want to get ^^</returns>
        if (item == undefined) {
            return '';
        } else {
            var cs = item.split(seperatorChar);
            if (cs != null && cs.length >= index) {
                return cs[index];
            }
        }
        return '';
    },

    commaSeparateNumber: function (val) {
        /// <summary>Convert number to number with comma</summary>
        /// <param name="val" type="string">item to be converted</param>
        /// <returns type="string">Result item</returns>
        while (/(\d+)(\d{3})/.test(String(val))) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        return val;
    },

    replaceUnicodeCharacter: function (str) {
        /// <summary>Convert Vietnamese string to ascii string</summary>
        /// <param name="str" type="string">string to be converted</param>
        /// <returns type="string">Result string</returns>
        return str.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/^\-+|\-+$/g, "")
        ;
    },

    toDbDateString: function (date) {
        /// <summary>Convert date object to Database format</summary>
        /// <param name="date" type="date">date to be converted</param>
        /// <returns type="string">String in database format</returns>
        return date.getFullYear() + (date.getMonth() <= 8 ? '-0' : '-') + (date.getMonth() + 1) + (date.getDate() <= 9 ? '-0' : '-') + date.getDate();
    },

    toMDateString: function (date) {
        /// <summary>Convert date object to display format</summary>
        /// <param name="date" type="date">date to be converted</param>
        /// <returns type="string">String in display format</returns>
        return (date.getDate() <= 9 ? '0' : '') + date.getDate() + (date.getMonth() <= 8 ? '-0' : '-') + (date.getMonth() + 1) + '-' + date.getFullYear();
    },

    toDateString: function (date, format) {
        /// <summary>Convert date object to specified format</summary>
        /// <param name="date" type="date">date to be converted</param>
        /// <param name="format" type="string">format for display</param>
        /// <returns type="string">String in specified format</returns>
        try {
            return date.toFormatString(format);
        } catch (e) {
            return '';
        }
    },
});
