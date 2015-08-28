define({
    _reloadBks: function (o) {
        $('#report').hide();
        $('#product-content').hide();
        $('#bksContent').show();
        $('#bTickets').hide();
        $('#roleConfig').hide();
        $('#busManager').hide();
        // load first time
        //FlatObj.LFTime = true;
        // reset giá trị FTripGetTrip về dạng default
        FlatObj.FTripGetTrip = false;
        // load default trip
        FlatObj.LDefTrip = true;
        $('#bksContent').vbooking(window.app);
        $('#bksContent').vbooking("load", o.data);
        
    },

    start: function (o) {
        try {
            var me = this;
            vdc.gD(o.data, function () {
                me._reloadBks(o);
                $(document).keypress(function(e) {
                    if (e.keyCode == 13 && !$("#update-popup input").is(":focus")) {
                        var $updatePopup = $("#update-popup");
                        if ($updatePopup.hasClass('in')) {
                            $('#update-popup .btn-update').trigger('click');
                        }
                    }
                });
                vbv('rlBKS', function (ev) {
                    if (ev.d && ev.d.o)
                        me._reloadBks(ev.d.o);
                    else 
                        me._reloadBks({});
                });
            });
        } catch (e) {
            console.log('(E) Co.Bks/Main', e);
        }

        var updateUI = function () {
            (document.body.clientWidth < 768) ? $("#HomeTopSearch").show() : $("#HomeTopSearch").hide();
        };

        $(window).resize(function () {
            updateUI();
        });
        updateUI();
    },
});

/************************************************************************
* BOOKING DIALOG                                                        *
*************************************************************************/
(function ($) {

    //Reference to base object members
    var base = {
        _create: $.custom.vbooking.prototype._create
    };

    //extension members
    $.extend(true, $.custom.vbooking.prototype, {

        /************************************************************************
        * DEFAULT OPTIONS / EVENTS                                              *
        *************************************************************************/
        options: {

        },
        /************************************************************************
        * PRIVATE FIELDS                                                        *
        *************************************************************************/
        _seatStack: null,
        _selectedPhone: null,
        _selectedCode: "",
        _ctrlOn: false,
        //_savedCustomer: {},
        _fMoving: false, //Flag: has ticket being moved
        _movingStack: null,
        _cMovingSeat: null,
        _cMovingTrip: null,

        _$updateForm: null,
        _$validForm: null,
        _$historyForm: null,

        // copy
        _hasCopyTicket: false,
        _hasBookReturnTicket: false,
        _cBookReturnTripId: null,
        _copyInfo: {},
        _seatToBeUpdatedReturningInfo: [],
        _dataToBeSavedReturningInfo: { date: "", code: "" },


        _$modal: null,
        _$cmodal: null,
        _$emodal: null,
        _$popModal: null,
        _$xuatbenModal: null,
        _$chotphoiModal: null,
        _suggestCustomer: [],
        _totalSuggestCustomer: 0,
        _isBooking: false,


        // Button in Filter Bar
        _$xuatbenButton: null,

        //Notification
        _$connection: null,
        _isFirstTime: true,

        //PHAN QUYEN DUOC DAT VE THEO TUNG CHUYEN
        _allowBookAllSeat: true,
        _allowedSeats: [],

        /************************************************************************
        * CONSTRUCTOR AND INITIALIZATION METHODS                                *
        *************************************************************************/
        _create: function () {
            base._create.apply(this, arguments);

            if (!this.options.serviceUrl) {
                return;
            }
            //Initialization
            this._initializeBookingFields();
            //this._createUpdateDialogDiv();
            //this._createCancelDialogDiv();
            //this._createErrorDialogDiv();
            //this._createQuickBookDiv();
            this._bindEventOnSheet();
        },
        //_createQuickBookDiv: function () {
        //    var self = this;
        //    var $quickBookBody = $('<div class="panel panel-primary" />')
        //        .append($('<div class="panel-heading" />')
        //            .append($('<h3 class="panel-title" />').html("Đặt vé nhanh"))
        //        )
        //        .append($('<div class="panel-body" style="padding:15px !important;" />')
        //            .append($('<div class="alert alert-danger warning-message" role="alert" style="margin-bottom:10px;" />').css('display', 'none'))
        //            .append($('<input type="hidden" name="StatusInfo" value="2" />'))
        //            .append($('<input type="hidden" name="NumClick" value="0" />'))
        //            .append($('<ul id="seat-no" class="list-group" />'))
        //            .append($('<div class="clearfix" />'))
        //            .append($('<div class="row mt10" />')
        //                .append($('<div class="col-md-12" />')
        //                    .append($('<label class="col-md-6 pl0" name="RouteName" type="label" />'))
        //                    .append($('<label class="col-md-6" name="DepartureDate" type="label" />'))
        //                )
        //                .append($('<div class="col-md-12 mt10 checkbox-route-point" />'))
        //                .append($('<div class="col-md-6 mt10" />')
        //                    .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Giá vé"))
        //                    .append($('<div class="input-group" />')
        //                        .append($('<input type="text" name="Fare" class="form-control vblue fw700" value="" />'))
        //                        .append($('<div class="input-group-addon" />').html("đ"))
        //                    )
        //                )
        //                .append($('<div class="col-md-6 mt10" />')
        //                    .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Tổng tiền"))
        //                    .append($('<div class="input-group" />')
        //                        .append($('<input type="text" name="TotalFare" class="form-control vblue fw700" disabled="disabled" value="" />'))
        //                        .append($('<div class="input-group-addon" />').html("đ"))
        //                    )
        //                )
        //                .append($('<div class="clearfix" />'))
        //                .append($('<div class="col-md-6 mt10" />')
        //                    .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Thanh toán"))
        //                    .append($('<div class="input-group col-md-8" />')
        //                        .append($('<select class="form-control" name="PaymentType" />'))
        //                    )
        //                )
        //                .append($('<div class="col-md-6 mt10" />')
        //                    .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Ghi chú"))
        //                    .append($('<div class="input-group col-md-8" />')
        //                        .append($('<input type="text" class="form-control" name="Note" value="" />'))
        //                    )
        //                )
        //                .append($('<div class="col-md-12 mt10" />')
        //                    .append($('<button class="btn btn-default close-qBook" type="button" />').html("Đóng"))
        //                )
        //            )
        //        )
        //    ;

        //    // render button
        //    if (typeof _dict._qBookFormButton != "undefined") {
        //        $.each(_dict._qBookFormButton, function (k, l) {
        //            var $but = $('<button type="button" />').css("margin-right", "5px").addClass(l[1]).html(l[0]);
        //            $quickBookBody.find('button.close-qBook').parent().prepend($but);
        //        });
        //    }

        //    //Create a div for dialog and add to container element
        //    self._$quickBookModal = $('<div />').addClass('modal fade pop-payment vbooking-container').attr('id', 'quick-book-popup')
        //        .attr('role', 'dialog')
        //        .attr('aria-hidden', 'true')
        //        .append(
        //            $('<div />').addClass('modal-dialog modal-md')
        //            .append($('<div />').addClass('modal-content')
        //                .append($quickBookBody)
        //            )
        //        )
        //        .appendTo($('body'));
        //},
        _createXuatBenButton: function () {
            return this._$xuatbenButton = this._$filterForm.find('button.btn-xuat-ben');
        },
        _initializeBookingFields: function () {
            app.seatStack = [];
            this._movingStack = [];
            this._selectedPhone = "";
            this._selectedCode = "";
            //this._notComeStack = [];
        },
        //_createUpdateDialogDiv: function () {
        //    var self = this;
        //    self._$updateForm = self._createForm(_dict._uForm[0], _dict._uForm[1], _dict._uForm[2]);
        //    self._$updateForm.find('.row').last().addClass('action-row').children().first().addClass('list-btn col-xs-12 col-sm-12');

        //    self._$validForm = self._createForm(_dict._vForm[0], _dict._vForm[1], _dict._vForm[2]);
        //    self._$validForm.find('.row').last().addClass('action-row').children().first().addClass('list-btn');

        //    self._$historyForm = self._createHistoryForm();

        //    var $updateBody = $('<div />').addClass('modal-body').css('padding-top', 0)
        //        .append($('<div />').addClass('container-fluid')
        //            .append($('<div />').addClass('row')
        //                .append($('<div />').addClass('col-md-1 col-sm-1 col-xs-1').css('padding-right', 0).addClass('responsive-xs-l')
        //                    .append($('<ul />').addClass('list-group').attr('id', 'seat-no')
        //                    )
        //                )
        //                .append($('<div />').addClass('col-md-11 col-sm-11 col-xs-11 pl0-xs mt10-xs').addClass('responsive-xs-r')
        //                    .append($('<ul />').addClass('nav nav-tabs').attr('role', 'tab-list')
        //                        .append($('<li />').addClass('active')
        //                            .append($('<a />').attr('href', '#general').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'general').text('Thông tin chung'))
        //                        )
        //                        .append($('<li />')
        //                            .append($('<a />').attr('href', '#valid').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'valid').text('Vé mở'))
        //                        )
        //                        .append($('<li />')
        //                            .append($('<a />').attr('href', '#history').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'history').text('Lịch sử'))
        //                        )
        //                    )
        //                    .append($('<div />').addClass('tab-content')
        //                        .append($('<div />').addClass('tab-pane fade in active').attr('id', 'general') //Update tab
        //                            .append(self._$updateForm)
        //                        )
        //                        .append($('<div />').addClass('tab-pane fade').attr('id', 'valid')
        //                            .append(self._$validForm)
        //                        )
        //                        .append($('<div />').addClass('tab-pane fade').attr('id', 'history')
        //                            .append(self._$historyForm)
        //                        )
        //                    )
        //                )
        //            )
        //        );

        //    //Create a div for dialog and add to container element
        //    self._$modal = $('<div />').addClass('modal fade').attr('id', 'update-popup')
        //        .attr('role', 'dialog')
        //        .attr('aria-hidden', 'true')
        //        .append(
        //            $('<div />').addClass('modal-dialog modal-md')
        //            .append($('<div />').addClass('modal-content')
        //                .append($('<div />').addClass('modal-header  bg-primary').css('padding-top', "10px").css('padding-bottom', "10px")
        //                    .append($('<h3 />').addClass('modal-title thin-1').html('Cập nhật thông tin').css('font-size', '18px'))
        //                )
        //                .append($updateBody)
        //            )
        //        )
        //        .appendTo($('body'));

        //    //Binding event
        //    self._bindEventOnUpdateForm();
        //    self._bindEventOnValidForm();
        //    self._bindEventOnHistoryForm();
        //},
        //_createUpdateConflictDialogDiv: function (createdUser) {
        //    var self = this;
        //    $('body').find('#updateConflict-popup').remove();
        //    var $conflictBody = $('<div />').addClass('modal-body')
        //        .append($('<form />').attr('id', "UpdateConflictForm")
        //            .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
        //                .append($('<tr />')
        //                    .append($('<td style="border:0;" />').addClass('col-md-6')
        //                        .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
        //                            .append($('<p />').html("Ghế đã được đặt bởi <strong style='color:red'>" + createdUser + "</strong>. Đặt chồng vé ?"))
        //                        )
        //                    )
        //                )
        //                .append($('<tr />')
        //                    .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
        //                        .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
        //                            .click(function () {
        //                                self._closeUpdateConflictDialog();
        //                                self._transformUpdateFormValue();
        //                                self._updateTicket();
        //                                app.selectedPhone = "";
        //                                app.selectedCode = "";
        //                                app.ctrlOn = false;
        //                                self._resetCopyInfo();
        //                                self._resetBookReturnInfo();
        //                            })
        //                        )
        //                        .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
        //                            .click(function () {
        //                                self._closeUpdateConflictDialog();
        //                            })
        //                        )
        //                    )
        //                )
        //            )
        //    );
        //    //Create a div for dialog and add to container element
        //    self._$updateConflictModal = $('<div />').addClass('modal fade updateConflict-popup')
        //        .attr('role', 'dialog')
        //        .attr('aria-hidden', 'true')
        //        .append(
        //            $('<div />').addClass('modal-dialog modal-md')
        //            .append($('<div />').addClass('modal-content')
        //                .append($('<div />').addClass('modal-header').css('background-color', '#c9302c').addClass('bg-primary')
        //                    .append($('<h2 />').addClass('modal-title thin-1').html('Cảnh báo'))
        //                )
        //                .append($conflictBody)
        //            )
        //        )
        //    .appendTo($('body'));
        //    //.appendTo(this.element);
        //    self._$updateConflictModal.modal('show');
        //},
        //_createCancelDialogDiv: function () {
        //    var self = this;
        //    self._$cmodal = null;
        //    var cancelFeePercentDefault = 0;
        //    var cancelFeeMoneyDefault = 0;
        //    if (typeof _dict._cancelFeePercentDefault != "undefined") {
        //        cancelFeePercentDefault = _dict._cancelFeePercentDefault;
        //    }
        //    if (typeof _dict._cancelFeeMoneyDefault != "undefined") {
        //        cancelFeeMoneyDefault = _dict._cancelFeeMoneyDefault.toMn();
        //    }
        //    var $cancelBody = $('<div />').addClass('modal-body').css('padding-top', '10px')
        //        .append($('<form />').attr('id', "CancelForm")
        //            .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
        //                .append($('<tr />')
        //                    .append($('<td style="border:0;" />').addClass('col-md-6')
        //                        .append($('<input type="hidden" name="TicketFares" value="" />'))
        //                        .append($('<lable class="control-label col-md-2 pr0 pl0 lblFeePercentRadio" style="margin: 5px 0 0 0 !important;"/>').html("Phí hủy vé : "))
        //                            .append($('<div />').addClass('input-group col-md-10 divFeePercentRadio').css('margin-top', '-2px')
        //                                .append($('<div class="input-group-addon pl0 " />').css('border', '0').css('background-color', 'transparent')
        //                                    .append($('<input type="radio" name="FeePercentRadio" checked="checked"/>').css('margin-top', '3px'))
        //                                )
        //                                .append($('<input type="text" class="form-control input-sm" name="CancelFeePercentInput" value="' + cancelFeePercentDefault + '" style="border-bottom-left-radius: 3px;border-top-left-radius: 3px;" />'))
        //                                .append($('<span style="border-bottom-right-radius: 3px;border-top-right-radius: 3px;"/>').addClass("input-group-addon").html("%"))
        //                                .append($('<div class="input-group-addon pl0" />').css('border', '0').css('background-color', 'transparent')
        //                                    .append($('<input type="radio" name="FeeMoneyRadio" />').css('margin', '3px 0 0 25px'))
        //                                )
        //                                .append($('<input type="text" class="form-control input-sm" name="CancelFeeMoneyInput" value="' + cancelFeeMoneyDefault + '" style="border-bottom-left-radius: 3px;border-top-left-radius: 3px;" />'))
        //                                .append($('<span />').addClass("input-group-addon").html("đ"))
        //                            )
        //                        .append($('<div style="margin-top:10px;margin-bottom:10px;"/>').addClass('form-group col-md-12 pl0 pr0')
        //                            .append($('<lable class="control-label col-md-2 pr0 pl0" style="margin: 5px 0 0 0 !important;"/>').html("Lý do hủy vé: "))
        //                            .append($('<div class="col-md-10 pl0 pr0" />')
        //                                .append($('<select class="form-control input-sm cor-black" name="CancelReason"/>')
        //                                    .append($('<option value=""> - - - - - Chọn lý do hủy vé - - - - - </option>'))
        //                                    .append($('<option value="1">Nhà xe hủy</option>'))
        //                                    .append($('<option value="2">Khách hàng hủy</option>'))
        //                                    .append($('<option value="3">Đại lý hủy</option>'))
        //                                    .append($('<option value="0">Khác</option>'))
        //                                )
        //                                .change(function (e) {
        //                                    e.stopPropagation();
        //                                    e.preventDefault();
        //                                    var cancelReasonId = self._$cmodal.find('select[name="CancelReason"]').val();
        //                                    if (cancelReasonId != '') {
        //                                        self._$cmodal.find('div.warning-mess').html('').hide();
        //                                    }
        //                                })
        //                            )
        //                        )
        //                        .append($('<div />').addClass('form-group col-md-12 pl0 pr0').css('margin-bottom', '10px')
        //                            .append($('<lable class="control-label col-md-2 pr0 pl0" />').html("Ghi chú: "))
        //                            .append($('<div class="col-md-10 pl0 pr0" />')
        //                                .append($('<textarea class="col-md-12 form-control input-sm" name="NoteCancel" />'))
        //                            )
        //                        )
        //                        .append($('<div style="margin:10px 0;"/>').addClass('form-group')
        //                            .append($('<p />').html("Bạn có chắc muốn hủy vé đã chọn ?"))
        //                        )
        //                    )
        //                )
        //                .append($('<tr />')
        //                    .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
        //                        .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Hủy vé').css('float', 'left')
        //                            .click(function () {
        //                                var cancelFeePercent = 0;
        //                                var cancelFeeMoney = 0;
        //                                var isPercent = false;
        //                                var isMoney = false;
        //                                if (self._$cmodal.find('input[name="FeePercentRadio"]').is(':checked')) {
        //                                    cancelFeePercent = self._$cmodal.find('input[name="CancelFeePercentInput"]').val();
        //                                    if (isNaN(cancelFeePercent)) {
        //                                        self._$cmodal.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
        //                                        return;
        //                                    }
        //                                    if (cancelFeePercent > 100) {
        //                                        self._$cmodal.find('div.warning-mess').html('Phí hủy vé không được lớn hơn 100%, vui lòng kiểm tra lại.').show();
        //                                        return;
        //                                    }
        //                                    isPercent = true;
        //                                }
        //                                if (self._$cmodal.find('input[name="FeeMoneyRadio"]').is(':checked')) {
        //                                    cancelFeeMoney = self._$cmodal.find('input[name="CancelFeeMoneyInput"]').val().replace(/\./g, '');
        //                                    if (isNaN(cancelFeeMoney)) {
        //                                        self._$cmodal.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
        //                                        return;
        //                                    }
        //                                    var ticketFares = self._$cmodal.find('input[name="TicketFares"]').val();
        //                                    var isError = [];
        //                                    $.each(ticketFares.split(','), function (k, v) {
        //                                        if (parseInt(cancelFeeMoney) > parseInt(v)) {
        //                                            isError.push(v);
        //                                        }
        //                                    });
        //                                    if (isError.length > 0) {
        //                                        self._$cmodal.find('div.warning-mess').html('Phí hủy vé không được lớn hơn tổng giá vé: ' + ticketFares + ' đ.').show();
        //                                        return;
        //                                    }
        //                                    isMoney = true;
        //                                }
        //                                var cancelReasonId = self._$cmodal.find('select[name="CancelReason"]').val();
        //                                var cancelReasonInfo = self._$cmodal.find('textarea[name="NoteCancel"]').val();
        //                                if (typeof _dict._cancelReasonRequired != 'undefined' && _dict._cancelReasonRequired) {
        //                                    if (cancelReasonId != '') {
        //                                        self._cancelTicket(isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo);
        //                                        self._resetCancelForm();
        //                                    } else {
        //                                        self._$cmodal.find('div.warning-mess').html('Vui lòng chọn lý do hủy vé.').show();
        //                                    }
        //                                } else {
        //                                    self._cancelTicket(isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo);
        //                                    self._resetCancelForm();
        //                                }
        //                            })
        //                        )
        //                        .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Đóng').css('float', 'left')
        //                            .click(function () {
        //                                //Clear seat stack
        //                                self._clearSelectedItem();
        //                                self._resetSeatStack();
        //                                self._closeCancelDialog();
        //                                self._resetCancelForm();
        //                            })
        //                        )
        //                    )
        //                )
        //            )
        //    );

        //    //Create a div for dialog and add to container element
        //    self._$cmodal = $('<div />').addClass('modal fade').attr('id', 'cancel-popup')
        //        .attr('role', 'dialog')
        //        .attr('aria-hidden', 'true')
        //        .append(
        //            $('<div />').addClass('modal-dialog modal-md')
        //            .append($('<div />').addClass('modal-content')
        //                .append($('<div />').addClass('modal-header bg-primary')
        //                    .append($('<h3 />').addClass('modal-title thin-1').html('Xác nhận'))
        //                )
        //                .append($('<div class="warning-mess alert alert-danger" role="alert" style="display:none;"/>').css('margin', '10px 10px 0 10px'))
        //                .append($cancelBody)
        //            )
        //        ).appendTo($('body'));
        //    // .appendTo(this.element);
        //    self._bindEventOnCancelForm();
        //},
        _createXuatBenDialogDiv: function () {
            var self = this;
            var $xuatbenBody = $('<div />').addClass('modal-body')
                .append($('<form />').attr('id', "XuatBenForm")
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group')
                                    .append($('<p />').html("Khi bấm nút Xuất Bến, phơi sẽ được chốt và tất cả vé đã thanh toán sẽ không còn thay đổi được nữa. Đồng ý ?"))
                                )
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
                                    .click(function () {
                                        self._closedTrip();
                                        self._closeXuatBenDialog();
                                    })
                                )
                                .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
                                    .click(function () {
                                        self._closeXuatBenDialog();
                                    })
                                )
                            )
                        )
                    )
            );

            //Create a div for dialog and add to container element
            self._$xuatbenModal = $('<div />').addClass('modal fade').attr('id', 'xuatben-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header bg-primary')
                            .append($('<h3 />').addClass('modal-title thin-1').html('Xác nhận'))
                        )
                        .append($xuatbenBody)
                    )
                )
            .appendTo($('body'));
            //.appendTo(this.element);
            self._$xuatbenModal.modal('show');
        },
        _hideXuatBenButton: function () {
            this._$xuatbenButton.removeClass('hidden');
            this._$xuatbenButton.addClass('hidden');
        },
        _showHuyXuatBenButton: function () {
            this._$xuatbenButton.html('<i class="glyphicon glyphicon-remove-circle"></i>&nbsp;Hủy xuất bến');
            this._$xuatbenButton.addClass('closed');
        },
        _showXuatBenButton: function () {
            this._$xuatbenButton.html('<i class="glyphicon glyphicon-log-out"></i>&nbsp;Xuất bến');
            this._$xuatbenButton.removeClass('hidden');
            this._$xuatbenButton.removeClass('closed');
        },
        //_createErrorDialogDiv: function () {
        //    var self = this;

        //    var $errorBody = $('<div style="padding-top:0;" />').addClass('modal-body')
        //        .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
        //            .append($('<tr class="col-md-12 pl0 pr0"/>')
        //                .append($('<td style="border-top:0;" class="col-md-1" />')
        //                    .append($('<img src="Content/images/warning-popup-icon.png" width="80px" />'))
        //                )
        //                .append($('<td  style="border-top:0;vertical-align:middle;" class="col-md-11" />')
        //                    .append($('<h4 style="line-height:22px;"/>').addClass('message'))
        //                )
        //            )
        //            .append($('<tr />')
        //                .append($('<td style="padding-top:10px;" />').addClass('col-md-12')
        //                    .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý')
        //                        .click(function () {
        //                            self._closeErrorDialog();
        //                        })
        //                    )
        //                )
        //            )
        //    );

        //    //Create a div for dialog and add to container element
        //    self._$emodal = $('<div />').addClass('modal fade').attr('id', 'error-popup')
        //        .attr('role', 'dialog')
        //        .attr('aria-hidden', 'true')
        //        .append(
        //            $('<div />').addClass('modal-dialog modal-md')
        //            .append($('<div />').addClass('modal-content')
        //                .append($('<div />').addClass('modal-header bg-primary').css('background-color', '#d9534f')
        //                    .append($('<h3 />').addClass('modal-title thin-1').html('Cảnh báo'))
        //                )
        //                .append($errorBody)
        //            )
        //        )
        //        .appendTo($('body'));
        //    //.appendTo(this.element);
        //},
        _showModal: function () {
            this._$modal.modal('show');
        },
        _showCModal: function () {
            this._$cmodal.modal('show');
        },
        _showEModal: function () {
            this._$emodal.modal('show');
        },
        //_closeUpdateDialog: function () {
        //    vbf('onClearWarningCustomer', { f: f }); // clear warning customer
        //    if (this._$modal) this._$modal.modal('hide');
        //    $('body').find('.updateConflict-popup').remove();
        //    $('body').find('.modal-backdrop.fade.in').remove();
        //},
        //_closeErrorDialog: function () {
        //    if (this._$emodal) this._$emodal.modal('hide');
        //},
        //_closeCancelDialog: function () {
        //    if (this._$cmodal) this._$cmodal.modal('hide');
        //    this._resetCancelForm();
        //},
        _closePopupModal: function () {
            this._$popModal.modal('hide');
        },
        _showSuccessModal: function (header, msg) {
            var $anBody = $('<div />').addClass('modal-body')
                .append($('<form />').attr('id', 'announceRole')
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
                                    .append($('<p />').html('<b> ' + msg + '</b>'))
                                )
                            )
                        )
                    )
            );

            var $cfModal = $('<div />').addClass('modal fade confirmSaveRole-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header').css('background-color', '#008000').addClass('bg-primary')
                            .append($('<h2 />').addClass('modal-title thin-1').html(header))
                        )
                        .append($anBody)
                    )
                );
            $cfModal.appendTo($('body'));

            $cfModal.modal('show');
            setTimeout(function () {
                $cfModal.modal('hide');
            }, 1500);
        },
        _showPopModal: function (message) {
            var self = this;
            var $popupBody = $('<div />').addClass('modal-body').css('padding-top', 0)
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        //.append($('<tr />')
                        //    .append($('<td style="border:0;" />').addClass('col-md-6')
                        //        .append($('<div />').addClass('form-group')
                        //            .append($('<p />').html(message))
                        //        )
                        //    )
                        //)
                        .append($('<tr class="col-md-12 pl0 pr0"/>')
                            .append($('<td style="border-top:0;" class="col-md-1" />')
                                .append($('<img src="Content/images/warning-popup-icon.png" width="80px" />'))
                            )
                            .append($('<td  style="border-top:0;vertical-align:middle;" class="col-md-11" />')
                                .append($('<h4 style="line-height:22px;"/>').addClass('message').html(message))
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Đóng').css('float', 'left')
                                    .click(function () {
                                        self._closePopupModal();
                                    })
                                )
                            )
                        )
                    );

            //Create a div for dialog and add to container element
            self._$popModal = $('<div />').addClass('modal fade').attr('id', 'message-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header bg-primary').css('background-color', '#d9534f')
                            .append($('<h3 />').addClass('modal-title thin-1').html('Thông báo'))
                        )
                        .append($popupBody)
                    )
                ).appendTo(this.element);

            self._$popModal.modal('show');
        },
        _closeXuatBenDialog: function () {
            this._$xuatbenModal.modal('hide');
        },
        //_closeUpdateConflictDialog: function () {
        //    this._$updateConflictModal.modal('hide');
        //    //this._$updateConflictModal.empty();
        //},

        /************************************************************************
        * STACK                                                                 *
        *************************************************************************/
        _getCurrentBKSHash: function () {
            var self = this;
            var d = self._getDepartureTime();
            return self._cTripId + d.getTime() + self._cTripBus;
        },
        _updateSeatStack: function (obj, s) {
            var self = this;
            //Get existing seat stack match with choosen seat
            var index = app.seatStack.indexOf(s);
            if (index != -1) {
                self._removeFromSeatStack(obj, s, index);
            } else {
                self._addToSeatStack(obj, s);
            }
        },
        _addToSeatStack: function (obj, s) {
            //Add seat to stack
            if (app.seatStack.indexOf(s) == -1) {
                app.seatStack.push(s);
                //Change color of seat to selected
                $(obj).addClass(_dict._slc[0]);
            }
        },
        _removeFromSeatStack: function (obj, s, index) {
            //Remove from stack
            app.seatStack.splice(index, 1);
            //Change color of seat
            $(obj).removeClass(_dict._slc[0]);
        },
        //_resetSeatStack: function () {
        //    app.seatStack = [];
        //},
        //_resetMovingStack: function () {
        //    this._movingStack = [];
        //    this._fMoving = false;
        //    this._toggleFilterWhenMoving();
        //},
        _clearSelectedItem: function () {
            var self = this;
            if (self._grid) {
                self._$sheet.find('.seat').removeClass(_dict._slc[0]);
                self._$notComeSheet.find('.seat').removeClass(_dict._slc[0]);
                self._$cancelSheet.find('.seat').removeClass(_dict._slc[0]);
            } else {
                self._$sheet.find('.lseat').removeClass(_dict._slc[0]);
                self._$notComeSheet.find('.lseat').removeClass(_dict._slc[0]);
                self._$cancelSheet.find('.lseat').removeClass(_dict._slc[0]);
            }
        },
        _maskSelectedSeat: function (obj) {
            $(obj).find('table').toggleClass(_dict._slc[0]);
        },
        _existingSeatStack: function (seat) {
            var self = this;
            var matchSeat = -1;
            var ticket = seat._getCurrentTicket();
            $.each(app.seatStack, function (ist, st) {
                if (-1 == matchSeat) {
                    var t = st._getCurrentTicket();
                    if (st._coach == seat._coach && st._row == seat._row && st._col == seat._col && t._id == ticket._id) {
                        matchSeat = ist;
                    }
                }
            });
            return !(-1 == matchSeat);
        },

        /************************************************************************
        * BOOKING                                                               *
        *************************************************************************/
        _fakeBookedSeat: function (sp, s) {
            var me = this;
            var seat = {
                _coach: s._coach,
                _row: s._row,
                _col: s._col,
                _class: 'booking',
                _label: s._label,
                _suser: "B:&nbsp;" + app.un,
                _pmInfo: " - " + app.aice,
                _half: [_dict._g[_dict._tplNumCol - 1], _dict._sg[_dict._tplNumCol - 1], _dict._mg[_dict._tplNumCol - 1]].join(' '),
                buttons: '<button type="button" class="btn btn-sm bg-none circle active" data-type="update">U</button><button type="button" class="btn btn-sm bg-none circle active" data-type="move">M</button>'
            };
            try {
                var trip = vGetArr({ Id: me._cTripId }, false, me._data);
                var fr = trip[0].FromArea.split('~')[1].split('|');
                var to = trip[0].ToArea.split('~')[1].split('|');
                seat._stageName = to[2];
                var fare = trip[0].FareInfo.substring(trip[0].FareInfo.indexOf('~') + 1);
                $.each(fare.split('~'), function (_, v) {
                    if (v.indexOf(fr[0] + '|' + to[0]) >= 0) {
                        seat._fare = vToMn(v.split('|')[2]) + "đ";
                    }
                });
                var data = { seat: seat };
                var $html = $(vtpl(_dict._sTpl, data));
                $html.find('.pick').css('background', 'none');
                $html.addClass('selected');
                var dp = $html.attr('data-position');
                $('.vbooking-sheet').find('button').unbind();
                $('.vbooking-sheet').find('.seat[data-position=' + dp + ']').addClass('paid', 100, 'easeInOutQuint', function () {
                    $(this).replaceWith($html);
                });
                //$(sp).parents().each(function(_, e) {
                //    if ($(e).hasClass('seat')) {
                //        $(e).replaceWith($html);
                //    };
                //});
            } catch (e) {
                console.log(e);
            }
        },
        
        _generateCode: function () {
            return Math.floor((Math.random() * 100000));
        },
        
        _checkRightOnUpdateForm: function () {
            //3|2|-1: duoc ban het tat ca cac chuyen (mac dinh)
            //3|2|0: K duoc ban tat ca cac chuyen
            //Neu co them chuyen o phia sau: loai tru dieu kien ban dau

            if (app.rights.indexOf("~3|2|") == -1) {
                return true;
            } else {
                var result = app.rights.indexOf("~3|2|0") >= 0 ? false : true;
                var arr = app.rights.split('~');
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf('3|2|') >= 0) {
                        if (this._cTripId == arr[i].split('|')[2]) {
                            return (!result);
                        }
                    }
                }
                return result;
            }
        },

        /************************************************************************
        * VALID/OPEN/CANCEL                                                     *
        *************************************************************************/
        _bindEventOnValidForm: function () {
            var self = this;
            var $form = self._$validForm;

            $form.find('input.datepicker').not('[readonly]').datepicker({ dateFormat: 'dd-mm-yy' });
            $form.find('i.glyphicon-calendar').parent().on('click', function () {
                $(this).prev().datepicker('show');
            });
            $form.find('button').each(function (_, b) {
                if ($(b).hasClass('btn-confirm')) {
                    vev(b, 'click', function (e) {
                        e.preventDefault();
                        self._validTicket();
                    });
                } else if ($(b).hasClass('btn-close')) {
                    vev(b, 'click', function (e) {
                        e.preventDefault();
                        vbf('onClearSelectedItem'); // Clear selected items
                        vbf('resetSeatStack'); // Reset seat stack
                        self._closeUpdateDialog();
                    });
                }
            });
            $form.find('input[name=CancelFee]').not(['readonly']).on('keyup', function () {
                var numSeat = parseInt($form.closest('div.modal-body').find('input[name=NumSeat]').val());
                var newCancelFee = $(this).val().replace(/\./g, '');
                newCancelFee = !parseInt(newCancelFee) ? 0 : parseInt(newCancelFee);
                var newTotalCancelFee = newCancelFee * numSeat;
                $(this).val(newCancelFee.toMn());
                $form.find('input[name=ToTalCancelFee]').val(newTotalCancelFee.toMn());
            });
        },
        _validTicket: function () {
            var self = this;
            var obj = self._createValidTicketObj();
            var completeReload = function (u, r, l, t) {
                if (u != 1) return;

                //Reset seat stack
                vbf('resetSeatStack'); // Reset seat stack

                //Reload sheet
                self._reloadSheet();

                //Close dialog
                self._closeUpdateDialog();

            };
            //Submit action
            self._submitAction(obj, completeReload);
        },
        _createValidTicketObj: function () {
            var self = this;
            var d = self._convertFormDataToObj(self._$validForm);
            var tid = 0;
            if (typeof d.PassCode != "undefined" && d.PassCode != null && d.PassCode != "") { //Pass ticket from valid or open ticket before
                tid = self._getTicketIdFromPassCode(d.PassCode);
            }

            var obj = {};
            obj._a = "UpdateBookTicket";
            obj._c = [];
            obj._d = [];
            $.each(app.seatStack, function (i, v) {
                var t = v._getCurrentTicket();
                if (tid != 0) {
                    obj._c.push({
                        Id: t._id,
                        TripId: self._cTripId,
                        SeatCode: v._getSeatInfo(),
                        PickupDate: t._pdate.toFormatString('iso'),
                        Bus: self._cTripBus
                    });
                    obj._c.push({
                        Id: tid,
                        TripId: self._cTripId,
                        SeatCode: v._getSeatInfo(),
                        PickupDate: t._pdate.toFormatString('iso'),
                        Bus: self._cTripBus
                    });

                    var dObj1 = {
                        TripAlias: parseInt(self._cTripBus),
                        Status: 3, //STATUS
                        PassCode: d.PassCode
                    };
                    var dObj2 = {
                        TripId: self._cTripId,
                        SeatCode: v._getSeatInfo(),
                        TripDate: self._getDepartureTime().toFormatString('iso'),
                        PickupDate: t._pdate.toFormatString('iso'),
                        TripAlias: parseInt(self._cTripBus),
                        Status: 2 //STATUS
                    };

                    //History
                    //dObj1.IsPrgHistoryInfo = t._hInfo + '~' + self._getHistory("UpdateBookTicket", dObj1);
                    //dObj2.IsPrgHistoryInfo = t._hInfo + '~' + self._getHistory("UpdateBookTicket", dObj2);

                    obj._d.push(dObj1);
                    obj._d.push(dObj2);

                } else {
                    obj._c.push({
                        Id: t._id,
                        TripId: self._cTripId,
                        SeatCode: v._getSeatInfo(),
                        PickupDate: t._pdate.toFormatString('iso'),
                        Bus: self._cTripBus
                    });
                    var dObj = {};

                    if (d.Status == 7) { //Open
                        dObj.Status = 7;
                        dObj.TripDate = null;
                    } else if (d.Status == 6) {
                        dObj.Status = 6;
                        if (d.FromValid != null && d.FromValid != "") {
                            dObj.FromValid = vPrsDt(d.FromValid);
                        }
                        if (d.ToValid != null && d.ToValid != "") {
                            dObj.ToValid = vPrsDt(d.ToValid);
                        }
                    } else if (d.Status == 3) {
                        dObj.TripAlias = parseInt(self._cTripBus),
                        dObj.Status = d.Status; //STATUS
                        dObj.CancelFee = parseInt(d.CancelFee);
                        if (isNaN(dObj.CancelFee)) {
                            dObj.CancelFee = 0;
                        }
                    }

                    //History
                    //dObj.IsPrgHistoryInfo = t._hInfo + '~' + self._getHistory("UpdateBookTicket", dObj);

                    obj._d.push(dObj);
                }

            });

            return obj;
        },
        _getTicketIdFromPassCode: function (code) {
            return parseInt(code); //temporary code is id
        },

        /************************************************************************
        * HISTORY                                                               *
        *************************************************************************/
        _bindEventOnHistoryForm: function () {
            var self = this;
            var $form = self._$historyForm;
            $form.find('button').each(function (_, b) {
                if ($(b).hasClass('btn-close')) {
                    vev(b, 'click', function (e) {
                        e.preventDefault();
                        vbf('onClearSelectedItem'); // Clear selected items
                        vbf('resetSeatStack'); // Reset seat stack
                        self._closeUpdateDialog();
                    });
                }
            });
        },
        /************************************************************************
        * Notification                                                          *
        *************************************************************************/
        _startNotification: function () {
            var self = this;
            self._$connection = $.connection.notificationHub;
            if (typeof self._$connection != "undefined") {
                self._$connection.client.sendNotification = function (header, msg, person) {
                    self._createWarningDialog(header, msg, person);
                };
            };
            $.connection.hub.start();
        },
        _sendNotification: function (header, msg, cls) {

            //var self = this;
            //$.connection.hub.start().done(function() {
            //self._$connection.server.send(header, msg, cls);
            //console.log(self._$connection.state);
            //});
        },
        _startConnection: function () {
            $.connection.hub.start();
        },
        _isConnected: function () {

        },
        _createWarningDialog: function (header, msg, person) {
            var me = this;
            var ps = '';
            if (vIsEstStr(person)) ps = "Mọi chi tiết vui lòng liên hệ: <b>" + person + "</b>";
            var $warningBody = $('<div />').addClass('modal-body')
                .append($('<form />')
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
                                    .append($('<h3 />').html(msg))
                                    .append($('<br />'))
                                    .append($('<h4 />').html(ps))
                                )
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
                                    .click(function () {
                                        $('body').find('.warning-popup').modal('hide');
                                    })
                                )
                            )
                        )
                    )
            );

            var $warningModal = $('<div />').addClass('modal fade warning-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header').css('background-color', '#c9302c').addClass('bg-danger')
                            .append($('<h2 />').addClass('modal-title thin-1').css('color', 'white').html(header))
                        )
                        .append($warningBody)
                    )
                );
            $warningModal.appendTo($('body'));

            $warningModal.modal('show');
        },
        _parseNotification: function () {
            //alert(1);
        },
    });
})(jQuery);

