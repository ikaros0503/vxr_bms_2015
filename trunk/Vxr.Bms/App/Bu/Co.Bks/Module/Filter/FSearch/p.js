define({
    x: null,
    _$filterSearchResult: null,
    currentText: "",
    start: function (o) {

        try {
            this.o = o;
            this.x = $(o.x);
            $(".HomeTopSearch").html($("#HomeTopSearch").html());
            this._bindFilterEvents(o);
            this._bindBodyEvents(o);

        } catch (e) {
            console.error(e);
        }
    },
    _bindBodyEvents: function (o) {
        var me = this;
        vbv('doSetSearchBox', function (e) {
            me.x.val(e.d.value);
        });
    },
    _bindFilterEvents: function (o) {
        var x = this.x, me = this;
        if (x) {

            $("form.BSFilterForm").on("submit", function (e) {
                e.preventDefault();
            });

            vev(o.x, 'keyup', function (e) {
                if ((e.keyCode == 86 && e.ctrlKey) || e.keyCode == 17) return;
                var length = 0;
                var val = $(o.x).val();
                if (val == me.currentText) return;
                me.currentText = val;
                length = val.length;
                if (length < 3) {
                    e.preventDefault();
                    e.stopPropagation();
                    me._clearSearchResult();
                } else if (length == 6) { //search code
                    e.preventDefault();
                    e.stopPropagation();
                    // edited by Duy 2015-08-24 21:00:00
                    // nếu chuỗi không có chữ cái là search theo số điện thoại
                    // nếu chuỗi có chữ cái là search theo mã vé
                    if (!isNaN(val)) {
                        me._searchTicket(this.value);
                    } else {
                        me._searchTicket(this.value, true);
                    }
                } else if (vIsNumKey(e)) {
                    //if (this.value.length >= 6) {
                    if (length == 3 || length >= 6) {
                        e.preventDefault();
                        e.stopPropagation();
                        me._searchTicket(this.value);
                    } else {
                        e.preventDefault();
                        e.stopPropagation();
                        me._clearSearchResult();
                    }
                } else if (_dict._arrows.indexOf(e.keyCode) == -1) {
                    //e.preventDefault();
                    //e.stopPropagation();
                    //me._clearSearchResult();
                }
            });
            vev(o.x, 'paste', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var text = $.trim(e.originalEvent.clipboardData.getData('Text'));
                $(".searchInput").val(text);
                me.x.blur();
                if ((text.length == 6 || text.length == 10 || text.length == 11)) {
                    if (text.length == 6) {
                        me._searchTicket(text, true);
                        return;
                    } else {
                        if (!isNaN(this.value)) {
                            me._searchTicket(text);
                            return;
                        }
                    }
                } else {
                    me._clearSearchResult();
                }

            });

            vev(o.x, 'focus', function () {
                vbf('onSearchBoxFocused');
            });
        } else {
            setTimeout(me._bindFilterEvents, 50);
        }
    },

    _searchTicket: function (text, byCode, cb) {
        var me = this;
        if (app.module.toLowerCase() == "bks") {
            me._clearSearchResult();
            me._renderSearchResult(null, "start");
            var obj = me._createSearchTicketObj(text, byCode);
            var completeSearchTicket = function (u, r, l, t) {
                if (u != 1) return;
                me._clearSearchResult();
                if (r && r.length > 0) {
                    me._searchResult = r;
                    me._totalSearchResult = r.length;
                }
                me._renderSearchResult(byCode);
                //me._bindEventOnSearchResult();
                // reset scrolled property
                FlatObj.HScrolled = false;
                FlatObj.STBPhone = true;
            };
            //Submit query
            vRqs(obj, completeSearchTicket);
        } else {
            var data = {}, items = [], proOrderobj = me._crProOrderObj(text);
            me._clearSearchResult();
            me._renderSearchResult(null, "start");
            var requestSuccess = function (u, r, l, t) {
                if (l > 0) {
                    $.each(r, function (index, value) {
                        var itemConvert = me._convertDbIntoSearchPhone(value, text);
                        items.push(itemConvert);
                    });
                }
                data.listResult = items;
                data.totalItems = items.length;
            };

            vRqs(proOrderobj, requestSuccess);
            var htmlProduct = $.getHtml('search-phone', data);

            //Clear search result
            me._clearSearchResult();

            me._$searchTicketFilter.parent().append(htmlProduct);
            var li = me._$searchTicketFilter.parent().find('li');
            li.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var proId = $(this).attr('data-proid');
                var tId = $(this).attr('data-tripid');
                var tTime = $(this).attr('data-triptime');
                var tDate = $(this).attr('data-tripdate');
                var tOView = $(this).attr('data-typeofview');
                $('#product-content').product("load", {
                    proId: proId,
                    pIndex: 1,
                    pSize: 10,
                    tId: tId,
                    tTime: tTime,
                    tDate: tDate,
                    tOView: tOView
                });
                //Clear search result
                me._clearSearchResult();
                me._$searchTicketFilter.val('');
            }).hover(function (e) {
                li.removeClass('selected');
                $(this).addClass('selected');
            });
        }
    },
    _createSearchTicketObj: function (text, byCode) {
        var me = this;
        var typeDate = $('input[name=type_filterdate]').val();
        var d = me._getLimitedSDate();
        var $form = $('.BSFilterForm');
        var obj = {};
        if (typeof byCode == 'undefined' || !byCode) { //search by phone
            obj._a = "fGetCustomerTrip1";
            var phone = "($x like N'%" + text + "%')";
            switch (text.length) {
                case 3:
                    phone = "($x like '%" + text + "')";
                    break;
                case 4:
                case 5:
                    phone = "($x like '%" + text + "%')";
                    break;
                case 6:
                    phone = "($x like '%" + text + "%')";
                    break;
                default:
                    break;
            }

            var qe = "$x >= '" + d.toFormatString('iso') + "'";

            switch (parseInt(typeDate)) {
                case 1:
                    if (_dict._allowSearchBefore != undefined) {
                        qe = "$x >= '" + (d.addMinutes(_dict._allowSearchBefore)).toFormatString('iso') + "'";
                    } else {
                        qe = "$x >= '" + d.toFormatString('iso') + "'";
                    }
                    break;
                case 2: qe = "$x is not null";
                    break;
                case 3: var date = $form.find('button').html();
                    var foda1 = new Date(vPrsDt(date).getTime());
                    var foda = new Date();
                    foda.setDate(foda1.getDate() - 1);
                    var toda = new Date();
                    toda.setDate(foda.getDate() + 2);
                    qe = "$x > '" + foda.toFormatString('iso') + "' and $x < '" + toda.toFormatString('iso') + "'";
                    break;
            }
            obj._c = {
                CompId: parseInt(app.cid),
                Phone: phone,
                TripDate: qe
            };
            //obj._f = "Id, Name, Note, Phone, BookingTicket, TotalBooking, PaidTicket, TotalPaid, CancelTicket, TotalCancel, NotComeTicket, TotalNotCome, PassTicket, TotalPass, KeepOnTimeTicket, TotalKeepOnTime"
            //+ ", CustomerTripIdTripId, CustomerTripIdTripDate, CustomerTripIdBookingTicket, CustomerTripIdTotalBooking, CustomerTripIdListSeatBooking, CustomerTripIdPaidTicket, CustomerTripIdTotalPaid, CustomerTripIdListSeatPaid, CustomerTripIdCancelTicket, CustomerTripIdTotalCancel, CustomerTripIdListSeatCancel, CustomerTripIdNotComeTicket, CustomerTripIdTotalNotCome, CustomerTripIdListSeatNotCome, CustomerTripIdPassTicket, CustomerTripIdTotalPass, CustomerTripIdListSeatPass, CustomerTripIdKeepOnTimeTicket, CustomerTripIdTotalKeepOnTime, CustomerTripIdListSeatKeepOnTime, CustomerTripIdTripName, CustomerTripIdNote, CustomerTripIdPickupInfo";

            obj._f = "Name, TripName, Note, Phone, BookingTicket, TotalBooking, ListSeatBooking, PaidTicket,"
            + "ListSeatPaid, CancelTicket, TotalCancel, ListSeatCancel, NotComeTicket, TotalNotCome, ListSeatNotCome,"
            + "PassTicket, TotalPass, ListSeatPass, KeepOnTimeTicket, TotalKeepOnTime, ListSeatKeepOnTime, CustomerNote, CompId, TripDate, TripId, TotalPaid ";
        } else { ////search ticket by Code
            obj._a = "fGetCustomerTripTicket1";
            obj._c = {
                Code: $.trim(text).toUpperCase(),
            };
            obj._f = "Id, TripId, AgentId, SeatCode, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Code, TripDate, CustomerNote";
            obj._f = "Code, SeatCode, TripDate, TripId, Name, TripName, Phone, Note, Status, Fare, CustomerId";
        }
        return obj;
    },
    _crProOrderObj: function (phone) {
        var obj = {}
        obj._a = "fGetProductOrder";
        obj._c = {
            PickupInfo: "($x like N'%" + phone + "%' or DropOffInfo like N'%" + phone + "%') order by IsPrgCreatedDate desc",
        }
        obj._f = "Id,TripTime,TripDate,PickupInfo,DropOffInfo,Fare,Status,TripId,AgentInfo,ReceivedAgentInfo";
        return obj;
    },
    _convertDbIntoSearchPhone: function (data, phone) {
        var result = {};
        // parse thông tin người gửi
        var pickupInfo = data[3].split('|');
        if (pickupInfo[3].length > 10) {
            result.senderName = vGln(pickupInfo[3]);
        } else {
            result.senderName = pickupInfo[3];
        }
        result.senderPhone = pickupInfo[4];
        if (pickupInfo[4].indexOf(phone) == 0) {
            result.keySender = "vred";
        } else {
            result.keySender = "";
        }

        // parse thông tin người nhận
        var dropOffInfo = data[4].split('|');
        if (dropOffInfo[3].length > 10) {
            result.receiverName = vGln(dropOffInfo[3]);
        } else {
            result.receiverName = dropOffInfo[3];
        }
        result.receiverPhone = dropOffInfo[4];
        if (dropOffInfo[4].indexOf(phone) == 0) {
            result.keyReceiver = "vred";
        } else {
            result.keyReceiver = "";
        }

        // parse thông tin nơi gửi
        var agentInfo = data[8].split('|');
        result.fromName = agentInfo[2];

        // parse thông tin nơi nhận
        var receivedAgentInfo = data[9].split('|');
        result.toName = receivedAgentInfo[2];

        result.fare = vToMn(data[5]);
        result.proId = data[0];
        result.tripId = data[7];
        result.tripTime = data[1];
        result.tripDate = vPrsDt(data[2]).toFormatString("dd-mm-yyyy");
        if (vIsEstStr(result.tripTime) && vIsEstStr(result.tripDate)) {
            result.tripDepartureDate = "/ " + result.tripTime + " ngày " + result.tripDate;
        }
        switch (parseInt(data[6])) {
            case 1:
                result.status = "Chưa nhận";
                result.typeOfView = "kho-hang-di";
                break;
            case 2:
                result.status = "Chưa nhận";
                result.typeOfView = "kho-hang-di";
                break;
            case 3:
                result.status = "Chưa nhận";
                result.typeOfView = "xem-chuyen";
                break;
            case 4:
                result.status = "Đã nhận";
                result.typeOfView = "xem-chuyen";
                break;
            case 5:
                result.status = "Chưa nhận";
                result.typeOfView = "xem-chuyen";
                break;
            case 6:
                result.status = "Đã nhận";
                result.typeOfView = "xem-chuyen";
                break;
            case 7:
                result.status = "Chưa giao";
                result.typeOfView = "kho-hang-ve";
                break;
            case 8:
                result.status = "Chưa giao";
                result.typeOfView = "kho-hang-ve";
                break;
            case 9:
                result.status = "Đã giao";
                result.typeOfView = "kho-hang-ve";
                break;
            default:
                result.status = "";
                result.typeOfView = "";
                break;
        }
        return result;
    },
    _getLimitedSDate: function () {
        var d = new Date();
        if (typeof _dict._limitedMinuteBefore != 'undefined') {
            return new Date(d.getTime()).addMinutes(app.sOffsetMinute);
        } else {
            return new Date(d.getTime()).addMinutes(app.sOffsetMinute);
        }
    },
    _clearSearchResult: function () {
        var me = this;
        me._searchResult = [];
        me._totalSearchResult = 0;
        //me.x.parent().find('div.search-result').remove();
        me._hasSearchPhone = false;
        $('div.searchContainer div.search-result').remove();
    },

    _renderSearchResult: function (byCode, state) {
        var me = this;
        var $table;
        var $tbody = $("<tbody></tbody>");
        $table = $('<table></table>').addClass('search-items');
        var totalResult = 0;
        if (state == "start") {
            $tbody.html($("#startSearchTemplate").html());
        } else if (me._totalSearchResult > 0) {
            if (typeof byCode == 'undefined' || !byCode) { //phone
                $.each(me._searchResult, function (_, item) {
                    if (typeof item != "undefined" && item != null) {
                        var data = {
                            name: item[0],
                            tripName: item[1],
                            note: item[2],
                            phone: item[3],
                            customerNote: item[21],
                            tripDate: moment(item[23]).format("DD-MM-YYYY"),
                            tripTime: moment(item[23]).format("HH:mm"),
                            tripId: item[24],
                            bookedStr: "",
                            paidStr: "",
                            cancelStr: ""
                        };

                        var booked = parseInt(item[4]) + parseInt(item[7]);
                        var cancelled = parseInt(item[9]);

                        if (booked > 0) {
                            data.status = "Đã đặt";
                            data.totalTickets = booked;
                            data.tickets = vIsEstStr(item[6]) ? (vIsEstStr(item[8]) ? item[6] + ", " + item[8] : item[6]) : (vIsEstStr(item[8]) ? item[8] : "");
                            data.money = (parseInt(item[5]) + parseInt(item[25])).toMn() + "đ";
                            $tbody.append($(vtpl($("#searchResultItemTemplate").html(), data)));
                            totalResult++;
                        }
                        if (cancelled > 0) {
                            data.status = "Đã hủy";
                            data.type = "isCancelled";
                            data.totalTickets = cancelled;
                            data.tickets = item[11];
                            data.money = item[10] != null ? (item[10].toMn() + "đ") : "";
                            $tbody.append($(vtpl($("#searchResultItemTemplate").html(), data)));
                            totalResult++;
                        }
                    }

                });
                if (totalResult == 0) {
                    $tbody.append($(vtpl($("#noResultItemTemplate").html())));
                }
            } else {
                /***************************************
                * search by code
                ***************************************/
                var codeResult = {};
                if (me._searchResult.length > 0) {
                    codeResult = {
                        code: me._searchResult[0][0],
                        tripDate: moment(me._searchResult[0][2]).format("DD-MM-YYYY"),
                        tripTime: moment(me._searchResult[0][2]).format("HH:mm"),
                        tripId: me._searchResult[0][3],
                        seatCodes: getSubItem(me._searchResult[0][1], "|", 0),
                        name: me._searchResult[0][4],
                        tripName: me._searchResult[0][5],
                        phone: me._searchResult[0][6],
                        note: me._searchResult[0][7],
                        status: me._searchResult[0][8],
                        fare: me._searchResult[0][9],
                        customerId: me._searchResult[0][10],
                        totalSeats: me._searchResult.length,
                        type: parseInt(me._searchResult[0][8]) == 3 ? "isCancelled" : ""
                    };
                    if (me._searchResult.length > 1) {
                        for (var kk = 1; kk < me._searchResult.length; kk++) {
                            codeResult.seatCodes = codeResult.seatCodes + ", " + getSubItem(me._searchResult[kk][1], "|", 0);
                        }
                    }
                    $tbody.append(vtpl($("#searchTicketResultItemTemplate").html(), codeResult));
                } else {
                    $tbody.append($(vtpl($("#noResultItemTemplate").html())));
                }


                //var cname = [];
                //var cphone = [];
                //var cnote = "";
                //var ccode = "";
                //var cpickup = "";
                //var tId = null;
                //var tDate = "";
                //var tName = "";
                //var cseats = [];
                //var totalSeat = 0;
                //var status = "";
                //var compId = null;
                //var totalCost = 0;
                //// listResult
                //// order by TripDate
                //// obj: [Code, Name, Phone, SeatCode, TotalCost, TripName, TripDateDay, TripDateHour, Status, PickupInfo, Note, TripId, isCanceled]
                //var listResult = {}
                //var tripDate = "";
                //var tripDateDay = "";
                //var tripDateHour = "";
                //var listTrip = {};
                //$.each(me._searchResult, function (_, item) {

                //    if (typeof item != "undefined" && item != null) {
                //        var listSeatCode = [];
                //        var isCancelled = "";
                //        var keyObj = "";
                //        //General
                //        //Id, TripId, AgentId, SeatCode, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Code, TripDate  
                //        if (vIsEstStr(item[5])) {
                //            var cCustomerInfo = item[5].split("|");
                //            if (vIsEstStr(cCustomerInfo[3]) && cname.indexOf(cCustomerInfo[3]) < 0) cname.push(cCustomerInfo[3]);
                //            if (vIsEstStr(cCustomerInfo[4]) && cphone.indexOf(cCustomerInfo[4]) < 0) cphone.push(cCustomerInfo[4]);
                //        }

                //        ccode = item[10];
                //        cnote = item[12];
                //        cpickup = item[9];
                //        totalCost += parseInt(item[7]);
                //        if (vIsEstStr(cpickup)) {
                //            var getPickup = cpickup.split('|');
                //            if (getPickup[0]) {
                //                cpickup = "&nbsp;/&nbsp;Đón:&nbsp;" + getPickup[0];
                //            }
                //            else if (getPickup[1]) {
                //                cpickup = "&nbsp;/&nbsp;T.C:&nbsp;" + getPickup[1];
                //            }
                //            else cpickup = '';
                //        }
                //        else cpickup = "";

                //        //Detail
                //        compId = item[2];
                //        tId = parseInt(item[1]);
                //        tDate = vPrsDt(item[4]);
                //        var seatcode = item[3].split("|");
                //        cseats.push(seatcode[0]);
                //        totalSeat++;
                //        //Status
                //        var stt = parseInt(item[6]);
                //        //status = " / " + _dict._stn[stt].vi;
                //        status = _dict._stn[stt].vi;
                //        if (stt == 3) isCancelled = "isCancelled";

                //        //Get trip name
                //        if (!listTrip.hasOwnProperty(tId)) {
                //            var cmplete = function (u, r, l, t) {
                //                if (u != 1 || l <= 0) return;
                //                listTrip[tId] = r[0][0];
                //                tName = r[0][0];
                //            };
                //            var obj = {
                //                _a: "fGetTrip",
                //                _c: {
                //                    Id: tId,
                //                },
                //                _f: "Name"
                //            }
                //            vRqs(obj, cmplete);
                //        } else {
                //            tName = listTrip[tId];
                //        }

                //        tripDateHour = vPrsDt(item[11]).toFormatString('hh:mm');
                //        tripDateDay = vPrsDt(item[11]).toFormatString('dd-mm-yyyy');
                //        tripDate = tripDateHour + " " + tripDateDay;
                //        keyObj = tripDate + " " + stt;
                //        listSeatCode.push(seatcode[0]);
                //        if (typeof listResult[keyObj] != "undefined") {
                //            listResult[keyObj].seatCodes = listSeatCode;
                //            listResult[keyObj][4] += parseInt(item[7]);
                //        } else {
                //            listResult[keyObj] = {
                //                code: ccode, name: cname, phone: cphone, seatCodes: listSeatCode, 4: parseInt(item[7]),
                //                tripName: tName, tripDate: tripDateDay, tripTime: tripDateHour, status: status, pickup: cpickup,
                //                note: cnote, tId: tId, type: isCancelled, 
                //            };
                //            ////listResult[keyObj][code] = ccode;
                //            //listResult[keyObj][name] = cname;
                //            //listResult[keyObj][phone] = cphone;
                //            //listResult[keyObj][seatCodes] = listSeatCode;
                //            //listResult[keyObj][4] = parseInt(item[7]);
                //            //listResult[keyObj][tripname] = tName;
                //            //listResult[keyObj][tripDate] = tripDateDay;
                //            //listResult[keyObj][tripTime] = tripDateHour;
                //            //listResult[keyObj][status] = status;
                //            //listResult[keyObj][pickup] = cpickup;
                //            //listResult[keyObj][note] = cnote;
                //            //listResult[keyObj][tId] = tId;
                //            //listResult[keyObj][isCancelled] = isCancelled;
                //        }
                //    }
                //});
                //for (var ind in listResult) {
                //    if (listResult.hasOwnProperty(ind)) {
                //        var ite = listResult[ind];
                //        ite.money = ite[4].toMn(0, ',', '.');
                //        ite.totalSeats = ite.seatCodes.length;
                //        ite.seatCodes = ite.seatCodes.join(",");
                //        //appent result
                //        //$tbody.append(
                //        //    $('<tr style="" />').attr('tid', ite[11]).attr('type', ite[12])
                //        //    .attr('tdate', ite[6])
                //        //    .attr('ttime', ite[7])
                //        //    .attr('code', ite[0])
                //        //    .html("<td>Mã vé:&nbsp<span class='vred'>" + ite[0] + "</span> - " + ite[1].join(",") + "<span style=\"color: gray;font-size: smaller;font-weight: lighter;\">&nbsp;" + (ite[10] == null ? '' : ('(' + ite[10] + ')')) + "&nbsp;</span>" + "(<span class='vred'>" + ite[2].join(" ,") + "</span>) / " + "<span class='vred'>" + ite[3].length + "</span> vé " + ite[3].join(",") + " / " + "<span class='vred'>" + ite[4].toMn(0, ',', '.') + "₫</span> / " + ite[5] + " / " + " ngày <span class='vred'>" + ite[6] + "</span> lúc <span class='vred'>" + ite[7] + "</span> / " + ite[8] + ite[9] + '</td><td><button class="customer-profile customer-profile-item btn btn-sm btn-primary" title="Chỉnh sửa thông tin khách hàng" style="position: absolute;right: 20px;margin:2px;" data-phone="' + cphone + '"><i class="glyphicon glyphicon-edit"></i> Edit</button></td>')
                //        //);
                //        console.log(ite);
                //        $tbody.append(vtpl($("#searchTicketResultItemTemplate").html(), ite));
                //        totalResult++;
                //    }
                //}
                //if (totalResult == 0) {
                //    $tbody.append($(vtpl($("#noResultItemTemplate").html())));
                //}
            }
        } else {
            $tbody.append($(vtpl($("#noResultItemTemplate").html())));
        }
        $table.append($tbody);
        me._$filterSearchResult = $('<div />').addClass('dropdown-menu search-result')
            .append($('<div />').addClass('search-title')
                .append(state == "start" ? "Đang tìm" : totalResult > 0 ? 'Tìm được ' + totalResult + ' kết quả' : "Kết quả")
            )
            .append($table);

        //me.x.parent().append(me._$filterSearchResult);
        //me._clearSearchResult();
        var $isHasSearchResult = $('.searchContainer').find('div.dropdown-menu.search-result');
        if ($isHasSearchResult.length > 0) {
            $isHasSearchResult.remove();
        }
        $('.searchContainer').append(me._$filterSearchResult);
        $("button.customer-profile-item").unbind().click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            app.cusphone = $(this).attr("data-phone");
            if ($(this).attr("data-customerId") != null && $(this).attr("data-customerId") != "")
                app.cusId = $(this).attr("data-customerId");
            $("#showCustomerProfile").trigger('click');
        });

        if (totalResult > 0) {
            me._bindEventOnSearchResult();
        }
    },
    _bindEventOnSearchResult: function () {
        var me = this;
        if (me._totalSearchResult > 0) {
            var tr = $('div.searchContainer table.search-items tr');
            if (tr.length > 0) {
                tr.unbind('click').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var tripIdRecord = parseInt($(this).attr('data-tripId'));
                    var tripDateRecord = $(this).attr('data-tripDate');
                    var tripTimeRecord = $(this).attr('data-tripTime');
                    var phoneRecord = $(this).attr('data-phone');
                    var code = $(this).attr('data-code');
                    var isCanceled = $(this).attr('data-type');

                    me._clearSearchResult();
                    $('.searchInput').val('');
                    $('div.searchContainer div.search-result').remove();

                    vbf('onSearchResultSelected', {
                        tId: tripIdRecord,
                        tDate: tripDateRecord,
                        tTime: tripTimeRecord,
                        phone: phoneRecord,
                        code: code,
                        isCanceled: isCanceled
                    });
                }).hover(function (e) {
                    tr.removeClass('selected');
                    $(this).addClass('selected');
                });
                me._bindArrowEventList(tr);
            }
        }
    },
    _bindArrowEventList: function (li) {
        var liSelected;
        var ul = li.parent();
        var ulh = ul.height();
        var ulch = ul.prop('scrollHeight');
        var numScroll = 1;
        var numBScroll = Math.round(ulch / ulh) - 1;
        $(window).keydown(function (e) {
            if (e.which === 40) {
                if (liSelected) {
                    li.removeClass('selected');
                    var next = liSelected.next();
                    if (next.length > 0) {
                        liSelected = next.addClass('selected');
                    } else {
                        liSelected = li.eq(0).addClass('selected');
                    }
                } else {
                    liSelected = li.eq(0).addClass('selected');
                }
                if (liSelected.position().top < 0) {
                    ul.animate({ scrollTop: 0 }, 500);
                    numScroll = 1;
                } else if (liSelected.position().top > ulh) {
                    var t = Math.floor(ulh * numScroll) - 35;
                    ul.animate({ scrollTop: t }, 500);
                    numScroll++;
                }

            } else if (e.which === 38) {
                if (liSelected) {
                    li.removeClass('selected');
                    var prev = liSelected.prev();
                    if (prev.length > 0) {
                        liSelected = prev.addClass('selected');
                    } else {
                        liSelected = li.last().addClass('selected');
                    }
                } else {
                    liSelected = li.last().addClass('selected');
                }

                if (liSelected.position().top <= 0) {
                    var b = Math.floor(ulch - ulh * numBScroll) + 35;
                    ul.animate({ scrollTop: b }, 500);
                    numBScroll++;
                } else if (liSelected.position().top > ulh) {
                    ul.animate({ scrollTop: ulch }, 500);
                    numBScroll = Math.round(ulch / ulh) - 1;
                }

            }
            //else if (e.which === 13) {
            //    if (liSelected && liSelected.hasClass('selected')) {
            //        liSelected.trigger('click');
            //    }
            //}
        });
    }
})