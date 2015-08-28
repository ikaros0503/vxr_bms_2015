/*
 * .................Suggest Customer...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doGetSuggestCustomer', function (e) { // do get suggest customer
            if (e.d) {
                me._getSuggestCustomer(e.d.f, e.d.key, e.d.lmDate, e.d.tId, e.d.tName);
            }
        });
        vbv('doClearSuggestCustomer', function (e) { // clear suggest customer
            if (e.d) {
                me._clearSuggestCustomer(e.d.f);
            }
        });
    },
    _getSuggestCustomer: function (f, text, lmDate, tId, tName) {
        var me = this;
        // show form loading 
        var $result = $('<ul />').addClass('search-items');
        $result.append($('<li>Đang tìm kiếm khách hàng, vui lòng đợi trong giây lát.........</li>'));
        f.find('input:text[name=PhoneNumbers]').parent().append(
                  $('<div />').addClass('dropdown-menu upform-search-result-phone')
                      .append($('<div />').addClass('search-title').append('Kết quả tìm kiếm'))
                      .append($result)
                      .append($('<div />').addClass('search-summary').append('Tổng số <span class="vblack"><b>0</b></span> kết quả'))
            );
        if (!app.isGettingSuggest) {
            var obj = me._createSuggestCustomerObj(text);
            var p = function (u, r, l, t) {
                app.isGettingSuggest = false;
                if (u != 1) return;
                //Clear search result
                me._clearSuggestCustomer(f);
                if (l > 0) {
                    me._mapSuggestCustomer(r, t);
                    //Render UI
                    if (app.totalSuggestCustomer > 0) {
                        me._renderSuggestCustomer(f);
                        me._bindEventOnSuggestCustomer(f, lmDate, tId, tName);
                    } else {
                        me._clearSuggestCustomer(f);
                    }
                } else {
                    app.preventUpdate = false;
                }
            };
            app.isGettingSuggest = true;
            vRqs(obj, p); // submit request
        } else {
            app.suggestKey = text;
        }
    },
    _createSuggestCustomerObj: function (text) {
        var obj = {}, me = this;
        app.suggestKey = text;
        obj._a = "fGetCustomer1";
        var phone = "($x like N'%" + text + "%') ORDER BY Phone ASC";
        switch (text.length) {
            case 6:
                phone = "($x like N'%" + text + "%') ORDER BY Phone ASC";
                break;
            default:
                break;
        }
        obj._c = {
            CompId: parseInt(app.cid),
            Phone: phone
        };
        //obj._f = "Id, Name, Note, Phone, BookingTicket, TotalBooking, PaidTicket, TotalPaid, CancelTicket, TotalCancel, NotComeTicket, TotalNotCome ,PassTicket, TotalPass, OpenTicket, TotalOpen, ValidTicket, TotalValid, KeepOnTimeTicket, TotalKeepOnTime";
        obj._f = "Id, Name, Note, Phone, BookingTicket, PaidTicket, CancelTicket";
        return obj;
    },
    _clearSuggestCustomer: function (f) {
        app.suggestCustomer = [];
        app.totalSuggestCustomer = 0;
        if (f) f.find('div.upform-search-result-phone').remove();
    },
    _mapSuggestCustomer: function (d, t) {
        app.suggestCustomer = [];
        $.each(d, function (_, item) {
            if (item[3] && item[3].indexOf(app.suggestKey) >= 0) {
                app.suggestCustomer.push(item);
            }
        });
        app.totalSuggestCustomer = app.suggestCustomer.length;
    },
    _renderSuggestCustomer: function (f) {
        var $result = $('<ul />').addClass('search-items');
        if (app.totalSuggestCustomer > 0) {
            $.each(app.suggestCustomer, function (_, item) {
                if (typeof item[0] != "undefined" && item[0] != null) {
                    var nBooking = parseInt(item[4]);
                    var nPaid = parseInt(item[5]);
                    var nCancel = parseInt(item[6]);
                    var cNote = item[2];
                    if (!vIsEstStr(cNote)) {
                        cNote = "";
                    } else {
                        cNote = '&nbsp;-&nbsp;' + cNote;
                    }
                    var cName = item[1];
                    if (!vIsEstStr(cName)) {
                        cName = "";
                    } else {
                        cName = cName + '&nbsp;-&nbsp;';
                    }
                    $result.append(
                        $('<li />').attr('cid', item[0]).attr('cphone', item[3])
                        .attr('cname', item[1])
                        .html(
                            "<p>" + cName + "<span class='vred'><b>" + item[3] + "</b></span>" + cNote + "</p>" +
                            "<p>Đã đặt <span class='vred'><b>" + nBooking + "</b></span> ghế / Số lần đi <span class='vred'><b>" + nPaid + "</b></span> / Số lần hủy <span class='vred'><b>" + nCancel + "</b></span></p>"
                        )
                    );
                }
            });
            f.find('input:text[name=PhoneNumbers]').parent().append(
                $('<div />').addClass('dropdown-menu upform-search-result-phone')
                .append($('<div />').addClass('search-title').append('Kết quả tìm kiếm'))
                .append($result)
                .append($('<div />').addClass('search-summary').append('Tổng số <span class="vblack"><b>' + app.totalSuggestCustomer + '</b></span> kết quả'))
            );
            // tự động chọn kết quả đầu tiên để hỗ trợ phím tắt tab
            f.find('div.upform-search-result-phone ul.search-items li:first-child').addClass('selected');
        }
        //else {
        //    $result.append($('<li>Không tìm thấy kết quả phù hợp.........</li>'));
        //    f.find('input:text[name=PhoneNumbers]').parent().append(
        //              $('<div />').addClass('dropdown-menu upform-search-result-phone')
        //                  .append($('<div />').addClass('search-title').append('Kết quả tìm kiếm'))
        //                  .append($result)
        //                  .append($('<div />').addClass('search-summary').append('Tổng số <span class="vblack"><b>0</b></span> kết quả'))
        //    );
        //}
    },
    _bindEventOnSuggestCustomer: function (f, lmDate, tId, tName) {
        var me = this;
        if (app.totalSuggestCustomer > 0) {
            var li = f.find('div.upform-search-result-phone li');
            li.unbind('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                f.find('input[name=CustomerId]').val($(this).attr('cid'));
                f.find('input:text[name=PhoneNumbers]').val($(this).attr('cphone'));
                f.find('input[name=FullName]').val($(this).attr('cname'));
                if (_dict._hasBTWarning) {
                    vbf('onGetWarningCustomer', { // get warning customer
                        f: f,
                        cName: $(this).attr('cname'),
                        cPhone: $(this).attr('cphone'),
                        cId: $(this).attr('cid'),
                        lmDate: lmDate,
                        tId: tId,
                        tName: tName
                    });
                    // updated by Duy: hide div warning error
                    f.find('#UpdateForm div.alert.alert-danger.message-error').html('').hide();
                }
                me._clearSuggestCustomer(f);
            }).hover(function (e) {
                li.removeClass('selected');
                $(this).addClass('selected');
            });
            me._bindArrowEventList(li);
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
    },
});
$(document).ready(function () {

});