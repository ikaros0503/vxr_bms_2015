define({
    pager: null, tickets: [], filter: '',
    statusArr: { "1": "Mới", "2": "Đã xác nhận", "3": "Đang giao", "4": "Đã giao", "5": "Đã hủy" },
    sourceArr: { "1": "Website", "2": "CallCenterVXR", "3": "CallCenter" },
    fieldsToGet: [ "Code","Type",  "Status","TripDate","SeatCode", "IssueDate","PickupDate","CustomerInfo","Fare","Note", "PickupInfo", "PaymentInfo",
        "CreatedUser","UserCharge","FromArea",  "ToArea", "CanceledDate","CompName", "CanceledUser","IsConfirmed", 
        "IsPrgCreatedDate", "CancelType", "TripName", "ChargeDate", "Id", "BookingCode", "TransactionStatus", "Source", "AddressInfo","FromAddress"],
    smsTemplate: "Kinh gui QK {customerName}. Ma Ve: {code}. Ghe: {seat}. Xe {compName}. Noi di: {fromAddress}. T/g: {tripTime} {tripDate}. Tran Trong. VeXeRe. Hotline: 19006484",

    start: function (o,data) {
        $('#bksContent').hide();
        $('#report').hide();
        $('#product-content').hide();
        $('#bTickets').hide();
        $('#cod').show();
        $('div.footer').hide();        
        $('#cod').html($("#codTemplate").html());
        console.log("COD is running now");
        console.log(o.data);
        this.init();
    },
    test: function () {
        //vRqs({
        //    _a: 'sendSms',
        //    phone: '0903950444',
        //    content: 'Kinh gui QK NGUYEN TAN SI. Ma Ve: YIABCD, Ghe: A3, Xe Sao Viet, XP: BX Mien Dong luc 17h00 30/05/2015. Tran Trong. VeXeRe. Hotline: 19006484'
        //}, function (u, r, l) {
        //    console.log(u, r, l);
        //});
        vRqs({
            _a: 'sendEmailToCustomer',
            email: "thichdesign@gmail.com",
            code: "GHAGDK",
            tripDateTime: "11:15 28/05/2015",
            compName: "Tiến Oanh",
            tripName: "Sài Gòn - Kon Tum",
            fromArea: "Bến xe miền Đông",
            toArea: "Bến xe Buôn Ma Thuột",
            tripDate: "28/05/2015",
            tripTime: "11:15",
            seat: "A1, B2",
            fare: "100000",
            money: "200000",
            customerName: "Tuan Huynh",
            customerPhone:"01228101037",
            date: moment(new Date()).format("DD-MM-YYYY"),
            template:"EmailTemplate.html"
        }, function (u, r, l) {
            console.log(u, r, l);
        });
    },

    init: function () {
        var self = this;
        
        $("body").append($("#dlgChangeCodStatusTemplate").html());
        $("#dlgChangeCodStatusTemplate").html("");
        $("#cod select[name=district]").html('');

        // $("#cod ul.mnuCodStatus").html("");
        // $("#cod ul.mnuCodStatus").append(app.roleGroups != 6?'<li role="presentation"><a role="menuitem" class="selected" tabindex="-1" data-status="-1">Tất cả</a></li>':"");
        // $("#cod ul.mnuCodStatus").append(app.roleGroups != 6?'<li role="presentation"><a role="menuitem" tabindex="-1" data-status="1">Mới</a></li>':"");
        // $("#cod ul.mnuCodStatus").append('<li role="presentation"><a role="menuitem" tabindex="-1" data-status="2">Đã xác nhận</a></li>');
        // $("#cod ul.mnuCodStatus").append('<li role="presentation"><a role="menuitem" tabindex="-1" data-status="3">Đang giao</a></li>');
        // $("#cod ul.mnuCodStatus").append('<li role="presentation"><a role="menuitem" tabindex="-1" data-status="4">Đã giao</a></li>');
        // $("#cod ul.mnuCodStatus").append(app.roleGroups != 6?'<li role="presentation"><a role="menuitem" tabindex="-1" data-status="5">Đã hủy</a></li>':"");

        // $("#mnuCodStatus").attr("data-status",app.roleGroups != 6?-1:2);
        // $("#cod ul.mnuCodStatus a").first().addClass('selected');
        // $("#mnuCodStatus span.content").text($("#cod ul.mnuCodStatus a.selected").text());

        vRqs({
            _a: 'fGetArea',
            _c: {
                BaseId: 29,
                Type:5
            },
            _f:"Id, Name, URLId"
        }, function (u, r, l) {
            if (u == 1 && r.length > 0) {
               $("#cod select[name=district]").append('<option value="-1">Quận</option>');
               for (var i = 0; i < r.length; i++) {
                   $("#cod select[name=district]").append('<option value="'+r[i][2]+'">'+r[i][1]+'</option>');
               }
           }
        });

        

        var bindEvents = function () {
            $("#cod button.refresh").unbind().on('click', function () {
                self.loadTickets();
            });

            $(".btnChangeCodStatus").unbind().on('click', function () {
                setVisibleToElement($(".dlgChangeCodStatus div.alert"), 0);
                var index = parseInt($(this).attr('data-index'));
                var newStatus = parseInt($(this).attr('data-statusId'));
                
                if (self.tickets[index].bookingCode == null || self.tickets[index].bookingCode == '') return;
                //self.tickets[index].codHistory += '~' + $(this).attr('data-statusId') + '|' + app.un + '|' + moment(new Date()).format('YYYY-MM-DD hh:mm:ss') + '|' + $("#txtCodStatusNote").val();
                vRqs({
                    _a: 'InsertPaymentTransaction',
                    _c: {
                        BookingCode: self.tickets[index].bookingCode,
                    },
                    _d: {
                        Actor: app.un,
                        TransactionStatus: newStatus,
                        Type: 1,
                        BookingCode: self.tickets[index].bookingCode,
                        Note: $("#txtCodStatusNote").val()
                    },
                }, function (u, r, l) {
                    setVisibleToElement($(".dlgChangeCodStatus div.alert"), u != 1);
                    if (u == 1) {
                        $(".dlgChangeCodStatus").modal('hide');
                        if (newStatus == 4) {
                            vRqs({
                                _a: 'sendSms',
                                phone: self.tickets[index].customerPhone,
                                content: vtpl(self.smsTemplate, self.tickets[index])
                            }, function (u, r, l) {
                                console.log(u, r, l);
                            });
                            vRqs({
                                _a: 'sendEmailToCustomer',
                                email: self.tickets[index].customerMail,
                                code: self.tickets[index].code,
                                tripDateTime: self.tickets[index].tripDate +" " + self.tickets[index].tripTime,
                                compName: self.tickets[index].compName,
                                tripName: self.tickets[index].tripName,
                                fromArea: self.tickets[index].fromArea,
                                toArea: self.tickets[index].toArea,
                                tripDate: self.tickets[index].tripDate,
                                tripTime: self.tickets[index].tripTime,
                                seat: self.tickets[index].seat,
                                fare: self.tickets[index].fareFormatted,
                                money: self.tickets[index].moneyFormatted,
                                customerName: self.tickets[index].customerName,
                                customerPhone: self.tickets[index].customerPhone,
                                date: moment(new Date()).format("DD-MM-YYYY"),
                                template: "EmailTemplate.html"
                            }, function (u, r, l) {
                                console.log(u, r, l);
                            });
                            
                        }
                        self.loadTickets();
                    }
                });
            });

            $("#cod input[name=tripDate]").datepicker({ dateFormat: 'dd-mm-yy' });
            $("#cod input[name=fromDate]").datepicker({ dateFormat: 'dd-mm' });
            $("#cod input[name=toDate]").datepicker({ dateFormat: 'dd-mm' });

            $("#cod input[name=fromDate]").datepicker('setDate', new Date());
            $("#cod input[name=toDate]").datepicker('setDate', new Date());

            $("#cod input").on('change', function () {
                self.updateFilter().loadTickets();
            });

            $("#cod select").on('change', function () {
                self.updateFilter().loadTickets();
            });

            $("#cod .mnuCodSource li a").unbind().on('click', function () {
                if (!$(this).hasClass('selected')) {
                    $("#cod .mnuCodSource li a").removeClass("selected");
                    $(this).addClass('selected');
                    $("#mnuCodSource span.content").text($(this).text() == 'Tất cả' ? 'Nguồn' : $(this).text());
                    self.updateFilter().loadTickets();
                }
            });

            $("#cod .mnuCodStatus li a").unbind().on('click', function () {
                if (!$(this).hasClass('selected')) {
                    $("#cod .mnuCodStatus li a").removeClass("selected");
                    $(this).addClass('selected');
                    $("#mnuCodStatus span.content").text($(this).text() == 'Tất cả' ? 'Trạng thái' : $(this).text());
                    self.updateFilter().loadTickets();
                }
            });
            
        };


        $.getScript('App/Core/UI/pager.js', function () {
            self.pager=new Pager(1,10, "#cod div.page", 5, function () {
                self.renderTickets();
            });
            self.pager.render();
            self.updateFilter().loadTickets();
        });

        bindEvents();
    },
    
    updateFilter:function() {
        var self = this; self.filter = '';
        var data = {
            fromDate: formatDatepicker($("#cod input[name=fromDate]"), 'YYYY-MM-DD 00:00:00'),
            toDate: formatDatepicker($("#cod input[name=toDate]"), 'YYYY-MM-DD 23:59:59'),
            tripDateStart: formatDatepicker($("#cod input[name=tripDate]"), 'YYYY-MM-DD 00:00:00'),
            tripDateEnd: formatDatepicker($("#cod input[name=tripDate]"), 'YYYY-MM-DD 23:59:59'),
            bookingCode: $("#cod input[name=code]").val(),
            comp: replaceUnicodeCharacter($("#cod input[name=comp]").val()),
            customer: replaceUnicodeCharacter($("#cod input[name=customer]").val()),
            user: $("#cod input[name=account]").val(),
            statusId: $("#cod #mnuCodStatus").attr('data-status'),
            sourceId: $("#cod .mnuCodSource li a.selected").attr('data-source'),
            districtId: $("#cod select[name=district]").val()
    };
        
        self.filter += data.tripDateStart != "" ? " and TripDate>='{tripDateStart}' and TripDate<='{tripDateEnd}' " : "";
        self.filter += data.fromDate != "" ? " and CreatedTime>='{fromDate}' " : "";
        self.filter += data.toDate != "" ? " and CreatedTime<='{toDate}' " : "";
        self.filter += data.bookingCode != "" ? " and BookingCode like N'%{bookingCode}%' " : "";
        self.filter += data.comp != "" ? " and ([dbo].ConvertToUnsignWithBlank(CompName) like N'%{comp}%' or SeatCode like N'%{comp}%')" : "";
        self.filter += data.customer != "" ? " and [dbo].ConvertToUnsignWithBlank(CustomerInfo) like N'%{customer}%'" : "";
        self.filter += data.user != "" ? " and [dbo].ConvertToUnsignWithBlank(CreatedUser) like N'%{user}%'" : "";
        //self.filter += ' and BookingCode is not null';
        self.filter += ' and PaymentMethod=1 ';
        self.filter += data.statusId != "-1" ? " and TransactionStatus={statusId}" : "";
        self.filter += data.sourceId != "-1" ? " and Source={sourceId}" : "";
        self.filter += data.districtId != null && parseInt(data.districtId) > 0 ? " and DistrictId={districtId}" : '';
        self.filter = vtpl(self.filter, data);
        return self;
    },

    

    loadTickets: function () {
        var self = this;
        
        var getTicketFromRecord = function (record, index) {

            var setDisplay = function (str) {
                return (str != null && str != '') ? '' : 'display:none;';
            };

            var result = {};
            if (record == null) return result;
            
            result.index = index;
            result.totalSeats = 1;
            result.code = record[0];
            result.compName = record[17];
            result.tripName = record[22];
            result.createdUser = record[12];
            result.compName = record[17];
            result.fare = record[8];
            result.statusId = record[26];
            result.bookingCode = record[25];

            var tripDate = parseDateFromTString(record[3]);
            var createdDate = parseDateFromTString(record[20]);
            var updatedDate = parseDateFromTString(record[32]);

            result.tripDate = moment(tripDate).format('YYYY-MM-DD');
            result.createdDate = moment(createdDate).format('YYYY-MM-DD');
            result.updatedDate = moment(updatedDate).format('YYYY-MM-DD');
            result.tripTime = moment(tripDate).format('hh:mm');
            result.createdTime = moment(createdDate).format('hh:mm');
            result.updatedTime = moment(updatedDate).format('hh:mm');

            
            result.fromArea = getSubItem(record[14], '|', 3);
            result.toArea = getSubItem(record[15], '|', 3);
            result.seat = getSubItem(record[4], '|', 0);
            result.customerName = getSubItem(record[7], '|', 3);
            result.customerPhone = getSubItem(record[7], '|', 4);
            result.customerMail = getSubItem(record[7], '|', 6);
            
            result.note = getSubItem(record[28], '|', 5);
            //result.address = getSubItem(getSubItem(record[28], '|', 0), '~', 1);
            //result.address = (record[28] != null ? record[28] : "").replace("|", ", ").replace("|", ", ").replace("%7C", "|");
            result.address = getSubItem(record[28], '|', 0).replace("%7C", "|");
            result.district = getSubItem(record[28], '|', 2);
            result.city = getSubItem(record[28], '|', 1);
            result.addressStr = result.address+", " + result.district+ ", " + result.city;


            result.seats = [result.seat];
            result.fares = [result.fare];
            result.money = result.fare;
            result.moneyFormatted = vToMn(result.money);
            result.fareFormatted = vToMn(result.fare);
            result.customerName = result.customerName == '' ? 'Khách hàng' : result.customerName;
            result.status1Class = (result.statusId == 1 ? 'selected' : '');
            result.status2Class = (result.statusId == 2 ? 'selected' : '');
            result.status3Class = (result.statusId == 3 ? 'selected' : '');
            result.status4Class = (result.statusId == 4 ? 'selected' : '');
            result.status5Class = (result.statusId == 5 ? 'selected' : '');
            result.addressStr = result.address + ', ' + result.district + ', ' + result.city;
            result.codHistory = '';
            result.fromAddress=record[29];
            result.source = self.sourceArr[record[27]];
            result.status = self.statusArr[record[26]];
            result.status2Display = result.statusId == 1?"":"hide";
            result.status3Display = result.statusId == 2 ? "" : "hide";
            result.status4Display = result.statusId == 3 ? "" : "hide";
            result.status5Display = result.statusId == 1 || result.statusId == 3 ? "" : "hide";
            
            result.customerPhoneDisplay = setDisplay(result.customerPhone);
            result.noteDisplay = setDisplay(result.note);

            result.updatedTime = result.createdTime;
            result.updatedDate = result.createdDate;
            result.updatedUser = result.createdUser;
            result.historyStr = '';
            result.history = [];
            
            return result;
        };

        var groupTickets = function (arr) {
            var result = [];
            if (arr != null && arr.length > 1) {
                var current = arr[0];
                var count = 0;
                for (var i = 1; i < arr.length; i++) {
                    if (arr[i].bookingCode == current.bookingCode) {
                        current.seats.push(arr[i].seat);
                        current.seat += ", " + arr[i].seat;
                        current.fares.push(arr[i].fare);
                        current.money += arr[i].fare;
                        current.moneyFormatted = vToMn(current.money);
                        current.fareFormatted = vToMn(current.fare);
                        current.totalSeats++;
                    } else {
                        current.index = count++;
                        result.push(current);
                        current = arr[i];
                    }
                }
                current.index = count++;
                result.push(current);
            } else {
                return arr;
            }
            return result;
        };

        self.setStatus('loading');
        self.tickets = [];

        vRqs({
            _a: 'fGetCodTicket',
            _c: { Status: "$x=1 " + self.filter + " order by Id desc"},
            _f: self.fieldsToGet.join(),
        }, function (u, r, l) {
            if (u == 1) {
                
                for (var i = 0; i < r.length; i++) {
                    self.tickets.push(getTicketFromRecord(r[i], i));
                }
                self.tickets = groupTickets(self.tickets);
                self.pager.updateInfo(self.tickets.length, 1).render();
            }
            self.setStatus(u!=1?'error':self.tickets.length>0?'loaded':'noTicket');
        });
    },

    setStatus: function (status) {
        setVisibleToElement($("#cod div.page"), status == 'loaded');
        setVisibleToElement($("#cod div.loading"), status == 'loading');
        setVisibleToElement($("#cod div.info"), status == 'noTicket' || status=='error');
        setVisibleToElement($("#cod table.data tbody"), status == 'loaded');

        $("#cod div.info p.message").text(status == 'noTicket' ? "Không có vé nào hết ^^" : "Đã có lỗi xảy ra, vui lòng tải lại trang.");
        return this;
    },

    renderTickets: function () {
        var self = this;

        var bindEventToRow = function () {

            $("#cod .mnuCodStatusRow li a").on('click', function () {
                if (!$(this).hasClass('selected')) {
                    var index = parseInt($(this).attr("data-index"));
                    var newStatusId = $(this).attr("data-status");

                    $(".dlgChangeCodStatus div.alert").hide();
                    $("#txtCodStatusNote").val('');

                    $(".btnChangeCodStatus").attr("data-index", index).attr("data-statusId", newStatusId);
                    $(".dlgChangeCodStatus span.from").text(self.statusArr[self.tickets[index].statusId]);
                    $(".dlgChangeCodStatus span.to").text(self.statusArr[newStatusId]);

                    $(".dlgChangeCodStatus").modal();
                }
            });
            $("#cod .btn-update-status").on('click', function () {
                var index = parseInt($(this).attr("data-index"));
                var newStatusId = $(this).attr("data-status");

                $(".dlgChangeCodStatus div.alert").hide();
                $("#txtCodStatusNote").val('');

                $(".btnChangeCodStatus").attr("data-index", index).attr("data-statusId", newStatusId);
                $(".dlgChangeCodStatus span.from").text(self.statusArr[self.tickets[index].statusId]);
                $(".dlgChangeCodStatus span.to").text(self.statusArr[newStatusId]);

                $(".dlgChangeCodStatus").modal();
            });

            var showMore = function(index,bookingCode, button) {
                var $hiddenRow = $("#hiddenRowCod" + index);

                if ($hiddenRow.is(":hidden")) {
                    $hiddenRow.show('slow');
                    setAnimation($(button), 'rotateShow', '0.5s');

                    if (self.tickets[index].history.length == 0) {
                        vRqs({
                            _a: 'fGetPaymentTransaction',
                            _c: { BookingCode: bookingCode },
                            _f: "Actor, CreatedTime, Type, BookingCode, TransactionStatus, Note",
                        }, function (u, r, l) {
                            if (u == 1) {
                                for (var i = 0; i < r.length; i++) {
                                    var obj = {
                                        statusId: r[i][4],
                                        status: self.statusArr[r[i][4]],
                                        date: moment(parseDateFromTString(r[i][1])).format('YYYY-MM-DD'),
                                        time: moment(parseDateFromTString(r[i][1])).format('hh:mm'),
                                        user: r[i][0], note: r[i][5]
                                    };
                                    self.tickets[index].history.push(obj);
                                    self.tickets[index].historyStr += vtpl($("#codHistoryItemTemplate").html(), obj);
                                }
                                $("#cod ul.history" + index).html(self.tickets[index].historyStr);
                            }
                        });
                    }

                } else {
                    $hiddenRow.hide('slow');
                    setAnimation($(button), 'rotateHide', '0.5s');
                }
            };

            $("#cod a.showMore").on("click", function () {
                var index = $(this).attr('data-index');
                var bookingCode = $(this).attr('data-bookingCode');
                showMore(index, bookingCode, this);
            });
            $("#cod td.detail-info").on("click", function () {
                var index = $(this).attr('data-index');
                var bookingCode = $(this).attr('data-bookingCode');
                showMore(index, bookingCode);
            });

        }
        
        $("#cod table.data tbody").html('');

        var start = (self.pager.currentPage - 1) * self.pager.itemsPerPage;
        var end = Math.min(self.pager.currentPage * self.pager.itemsPerPage, self.pager.totalRecords) - 1;
        
        for (var i = start; i <= end; i++) {
            $("#cod table.data tbody").append(vtpl($("#codRowTemplate").html(), self.tickets[i]));
        }

        bindEventToRow();

        return self;
    },

});

