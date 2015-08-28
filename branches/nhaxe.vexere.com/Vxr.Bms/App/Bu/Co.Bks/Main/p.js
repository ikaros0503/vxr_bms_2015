define({
    _reloadBks: function(o) {
        $('#report').hide();
        $('#product-content').hide();
        $('#bksContent').show();
        $('#bTickets').hide();
        $('#roleConfig').hide();
        // load first time
        FlatObj.LFTime = true;
        // reset giá trị FTripGetTrip về dạng default
        FlatObj.FTripGetTrip = false;
        // load default trip
        FlatObj.LDefTrip = true;
        $('#bksContent').vbooking(window.app);
        $('#bksContent').vbooking("load");
        $('#bksContent').vbooking("startNotification");
    },
    start: function(o) {
        //aRqs();
        var me = this;
        me._reloadBks(o);
        $(document).keypress(function(e) {
            if (e.keyCode == 13 && !$("#update-popup input").is(":focus")) {
                var $updatePopup = $("#update-popup");
                if ($updatePopup.hasClass('in')) {
                    $('#update-popup .btn-update').trigger('click');
                }
            }
        });

        //var obj = {
        //    _a: 'loadBms',
        //    _cid: 80,
        //    _tid: 24088
        //}
        //vRqs(obj, function(u, r, l, t) {
        //    console.log(u, r);
        //});
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
            this._createUpdateDialogDiv();
            this._createCancelDialogDiv();
            this._createErrorDialogDiv();
            this._createQuickBookDiv();
            this._bindEventOnSheet();
        },
        _createQuickBookDiv: function () {
            var self = this;
            var $quickBookBody = $('<div class="panel panel-primary" />')
                .append($('<div class="panel-heading" />')
                    .append($('<h3 class="panel-title" />').html("Đặt vé nhanh"))
                )
                .append($('<div class="panel-body" style="padding:15px !important;" />')
                    .append($('<div class="alert alert-danger warning-message" role="alert" style="margin-bottom:10px;" />').css('display', 'none'))
                    .append($('<input type="hidden" name="StatusInfo" value="2" />'))
                    .append($('<input type="hidden" name="NumClick" value="0" />'))
                    .append($('<ul id="seat-no" class="list-group" />'))
                    .append($('<div class="clearfix" />'))
                    .append($('<div class="row mt10" />')
                        .append($('<div class="col-md-12" />')
                            .append($('<label class="col-md-6 pl0" name="RouteName" type="label" />'))
                            .append($('<label class="col-md-6" name="DepartureDate" type="label" />'))
                        )
                        .append($('<div class="col-md-12 mt10 checkbox-route-point" />'))
                        .append($('<div class="col-md-6 mt10" />')
                            .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Giá vé"))
                            .append($('<div class="input-group" />')
                                .append($('<input type="text" name="Fare" class="form-control vblue fw700" value="" />'))
                                .append($('<div class="input-group-addon" />').html("đ"))
                            )
                        )
                        .append($('<div class="col-md-6 mt10" />')
                            .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Tổng tiền"))
                            .append($('<div class="input-group" />')
                                .append($('<input type="text" name="TotalFare" class="form-control vblue fw700" disabled="disabled" value="" />'))
                                .append($('<div class="input-group-addon" />').html("đ"))
                            )
                        )
                        .append($('<div class="clearfix" />'))
                        .append($('<div class="col-md-6 mt10" />')
                            .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Thanh toán"))
                            .append($('<div class="input-group col-md-8" />')
                                .append($('<select class="form-control" name="PaymentType" />'))
                            )
                        )
                        .append($('<div class="col-md-6 mt10" />')
                            .append($('<label class="control-label col-md-4 pl0" />').css("margin-top", "8px").html("Ghi chú"))
                            .append($('<div class="input-group col-md-8" />')
                                .append($('<input type="text" class="form-control" name="Note" value="" />'))
                            )
                        )
                        .append($('<div class="col-md-12 mt10" />')
                            .append($('<button class="btn btn-default close-qBook" type="button" />').html("Đóng"))
                        )
                    )
                )
            ;

            // render button
            if (typeof _dict._qBookFormButton != "undefined") {
                $.each(_dict._qBookFormButton, function (k, l) {
                    var $but = $('<button type="button" />').css("margin-right", "5px").addClass(l[1]).html(l[0]);
                    $quickBookBody.find('button.close-qBook').parent().prepend($but);
                });
            }

            //Create a div for dialog and add to container element
            self._$quickBookModal = $('<div />').addClass('modal fade pop-payment vbooking-container').attr('id', 'quick-book-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($quickBookBody)
                    )
                )
                .appendTo($('body'));
        },
        _createXuatBenButton: function () {
            return this._$xuatbenButton = this._$filterForm.find('button.btn-xuat-ben');
        },
        _initializeBookingFields: function () {
            this._seatStack = [];
            this._movingStack = [];
            this._selectedPhone = "";
            this._selectedCode = "";
            //this._notComeStack = [];
        },
        _createUpdateDialogDiv: function () {
            var self = this;
            self._$updateForm = self._createForm(_dict._uForm[0], _dict._uForm[1], _dict._uForm[2]);
            self._$updateForm.find('.row').last().addClass('action-row').children().first().addClass('list-btn col-xs-12 col-sm-12');

            self._$validForm = self._createForm(_dict._vForm[0], _dict._vForm[1], _dict._vForm[2]);
            self._$validForm.find('.row').last().addClass('action-row').children().first().addClass('list-btn');

            self._$historyForm = self._createHistoryForm();

            var $updateBody = $('<div />').addClass('modal-body').css('padding-top', 0)
                .append($('<div />').addClass('container-fluid')
                    .append($('<div />').addClass('row')
                        .append($('<div />').addClass('col-md-1 col-sm-1 col-xs-1').css('padding-right', 0).addClass('responsive-xs-l')
                            .append($('<ul />').addClass('list-group').attr('id', 'seat-no')
                            )
                        )
                        .append($('<div />').addClass('col-md-11 col-sm-11 col-xs-11 pl0-xs mt10-xs').addClass('responsive-xs-r')
                            .append($('<ul />').addClass('nav nav-tabs').attr('role', 'tab-list')
                                .append($('<li />').addClass('active')
                                    .append($('<a />').attr('href', '#general').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'general').text('Thông tin chung'))
                                )
                                .append($('<li />')
                                    .append($('<a />').attr('href', '#valid').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'valid').text('Vé mở'))
                                )
                                .append($('<li />')
                                    .append($('<a />').attr('href', '#history').attr('role', 'tab').attr('data-toggle', 'tab').attr('data-tab', 'history').text('Lịch sử'))
                                )
                            )
                            .append($('<div />').addClass('tab-content')
                                .append($('<div />').addClass('tab-pane fade in active').attr('id', 'general') //Update tab
                                    .append(self._$updateForm)
                                )
                                .append($('<div />').addClass('tab-pane fade').attr('id', 'valid')
                                    .append(self._$validForm)
                                )
                                .append($('<div />').addClass('tab-pane fade').attr('id', 'history')
                                    .append(self._$historyForm)
                                )
                            )
                        )
                    )
                );

            //Create a div for dialog and add to container element
            self._$modal = $('<div />').addClass('modal fade').attr('id', 'update-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header  bg-primary').css('padding-top', "10px").css('padding-bottom', "10px")
                            .append($('<h3 />').addClass('modal-title thin-1').html('Cập nhật thông tin').css('font-size', '18px'))
                        )
                        .append($updateBody)
                    )
                )
                .appendTo($('body'));

            //Binding event
            self._bindEventOnUpdateForm();
            self._bindEventOnValidForm();
            self._bindEventOnHistoryForm();
        },
        _createUpdateConflictDialogDiv: function (createdUser) {
            var self = this;
            $('body').find('#updateConflict-popup').remove();
            var $conflictBody = $('<div />').addClass('modal-body')
                .append($('<form />').attr('id', "UpdateConflictForm")
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group').attr('area-hidden', 'true')
                                    .append($('<p />').html("Ghế đã được đặt bởi <strong style='color:red'>" + createdUser + "</strong>. Đặt chồng vé ?"))
                                )
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
                                    .click(function () {
                                        self._closeUpdateConflictDialog();
                                        self._transformUpdateFormValue();
                                        self._updateTicket();
                                        self._selectedPhone = "";
                                        self._selectedCode = "";
                                        self._ctrlOn = false;
                                        self._resetCopyInfo();
                                        self._resetBookReturnInfo();
                                    })
                                )
                                .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
                                    .click(function () {
                                        self._closeUpdateConflictDialog();
                                    })
                                )
                            )
                        )
                    )
            );
            //Create a div for dialog and add to container element
            self._$updateConflictModal = $('<div />').addClass('modal fade updateConflict-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header').css('background-color', '#c9302c').addClass('bg-primary')
                            .append($('<h2 />').addClass('modal-title thin-1').html('Cảnh báo'))
                        )
                        .append($conflictBody)
                    )
                )
            .appendTo($('body'));
            //.appendTo(this.element);
            self._$updateConflictModal.modal('show');
        },
        _createCancelDialogDiv: function () {
            var self = this;
            self._$cmodal = null;
            var cancelFeePercentDefault = 0;
            var cancelFeeMoneyDefault = 0;
            if (typeof _dict._cancelFeePercentDefault != "undefined") {
                cancelFeePercentDefault = _dict._cancelFeePercentDefault;
            }
            if (typeof _dict._cancelFeeMoneyDefault != "undefined") {
                cancelFeeMoneyDefault = _dict._cancelFeeMoneyDefault.toMn();
            }
            var $cancelBody = $('<div />').addClass('modal-body').css('padding-top', '10px')
                .append($('<form />').attr('id', "CancelForm")
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<input type="hidden" name="TicketFares" value="" />'))
                                .append($('<lable class="control-label col-md-2 pr0 pl0 lblFeePercentRadio" style="margin: 5px 0 0 0 !important;"/>').html("Phí hủy vé : "))
                                    .append($('<div />').addClass('input-group col-md-10 divFeePercentRadio').css('margin-top', '-2px')
                                        .append($('<div class="input-group-addon pl0 " />').css('border', '0').css('background-color', 'transparent')
                                            .append($('<input type="radio" name="FeePercentRadio" checked="checked"/>').css('margin-top', '3px'))
                                        )
                                        .append($('<input type="text" class="form-control input-sm" name="CancelFeePercentInput" value="' + cancelFeePercentDefault + '" style="border-bottom-left-radius: 3px;border-top-left-radius: 3px;" />'))
                                        .append($('<span style="border-bottom-right-radius: 3px;border-top-right-radius: 3px;"/>').addClass("input-group-addon").html("%"))
                                        .append($('<div class="input-group-addon pl0" />').css('border', '0').css('background-color', 'transparent')
                                            .append($('<input type="radio" name="FeeMoneyRadio" />').css('margin', '3px 0 0 25px'))
                                        )
                                        .append($('<input type="text" class="form-control input-sm" name="CancelFeeMoneyInput" value="' + cancelFeeMoneyDefault + '" style="border-bottom-left-radius: 3px;border-top-left-radius: 3px;" />'))
                                        .append($('<span />').addClass("input-group-addon").html("đ"))
                                    )
                                .append($('<div style="margin-top:10px;margin-bottom:10px;"/>').addClass('form-group col-md-12 pl0 pr0')
                                    .append($('<lable class="control-label col-md-2 pr0 pl0" style="margin: 5px 0 0 0 !important;"/>').html("Lý do hủy vé: "))
                                    .append($('<div class="col-md-10 pl0 pr0" />')
                                        .append($('<select class="form-control input-sm cor-black" name="CancelReason"/>')
                                            .append($('<option value=""> - - - - - Chọn lý do hủy vé - - - - - </option>'))
                                            .append($('<option value="1">Nhà xe hủy</option>'))
                                            .append($('<option value="2">Khách hàng hủy</option>'))
                                            .append($('<option value="3">Đại lý hủy</option>'))
                                            .append($('<option value="0">Khác</option>'))
                                        )
                                        .change(function (e) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            var cancelReasonId = self._$cmodal.find('select[name="CancelReason"]').val();
                                            if (cancelReasonId != '') {
                                                self._$cmodal.find('div.warning-mess').html('').hide();
                                            }
                                        })
                                    )
                                )
                                .append($('<div />').addClass('form-group col-md-12 pl0 pr0').css('margin-bottom', '10px')
                                    .append($('<lable class="control-label col-md-2 pr0 pl0" />').html("Ghi chú: "))
                                    .append($('<div class="col-md-10 pl0 pr0" />')
                                        .append($('<textarea class="col-md-12 form-control input-sm" name="NoteCancel" />'))
                                    )
                                )
                                .append($('<div style="margin:10px 0;"/>').addClass('form-group')
                                    .append($('<p />').html("Bạn có chắc muốn hủy vé đã chọn ?"))
                                )
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Hủy vé').css('float', 'left')
                                    .click(function () {
                                        var cancelFeePercent = 0;
                                        var cancelFeeMoney = 0;
                                        var isPercent = false;
                                        var isMoney = false;
                                        if (self._$cmodal.find('input[name="FeePercentRadio"]').is(':checked')) {
                                            cancelFeePercent = self._$cmodal.find('input[name="CancelFeePercentInput"]').val();
                                            if (isNaN(cancelFeePercent)) {
                                                self._$cmodal.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                                                return;
                                            }
                                            if (cancelFeePercent > 100) {
                                                self._$cmodal.find('div.warning-mess').html('Phí hủy vé không được lớn hơn 100%, vui lòng kiểm tra lại.').show();
                                                return;
                                            }
                                            isPercent = true;
                                        }
                                        if (self._$cmodal.find('input[name="FeeMoneyRadio"]').is(':checked')) {
                                            cancelFeeMoney = self._$cmodal.find('input[name="CancelFeeMoneyInput"]').val().replace(/\./g, '');
                                            if (isNaN(cancelFeeMoney)) {
                                                self._$cmodal.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                                                return;
                                            }
                                            var ticketFares = self._$cmodal.find('input[name="TicketFares"]').val();
                                            var isError = [];
                                            $.each(ticketFares.split(','), function (k, v) {
                                                if (parseInt(cancelFeeMoney) > parseInt(v)) {
                                                    isError.push(v);
                                                }
                                            });
                                            if (isError.length > 0) {
                                                self._$cmodal.find('div.warning-mess').html('Phí hủy vé không được lớn hơn tổng giá vé: ' + ticketFares + ' đ.').show();
                                                return;
                                            }
                                            isMoney = true;
                                        }
                                        var cancelReasonId = self._$cmodal.find('select[name="CancelReason"]').val();
                                        var cancelReasonInfo = self._$cmodal.find('textarea[name="NoteCancel"]').val();
                                        if (typeof _dict._cancelReasonRequired != 'undefined' && _dict._cancelReasonRequired) {
                                            if (cancelReasonId != '') {
                                                self._cancelTicket(isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo);
                                                self._resetCancelForm();
                                            } else {
                                                self._$cmodal.find('div.warning-mess').html('Vui lòng chọn lý do hủy vé.').show();
                                            }
                                        } else {
                                            self._cancelTicket(isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo);
                                            self._resetCancelForm();
                                        }
                                    })
                                )
                                .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Đóng').css('float', 'left')
                                    .click(function () {
                                        //Clear seat stack
                                        self._clearSelectedItem();
                                        self._resetSeatStack();
                                        self._closeCancelDialog();
                                        self._resetCancelForm();
                                    })
                                )
                            )
                        )
                    )
            );

            //Create a div for dialog and add to container element
            self._$cmodal = $('<div />').addClass('modal fade').attr('id', 'cancel-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header bg-primary')
                            .append($('<h3 />').addClass('modal-title thin-1').html('Xác nhận'))
                        )
                        .append($('<div class="warning-mess alert alert-danger" role="alert" style="display:none;"/>').css('margin', '10px 10px 0 10px'))
                        .append($cancelBody)
                    )
                ).appendTo($('body'));
            // .appendTo(this.element);
            self._bindEventOnCancelForm();
        },
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
        _createChotPhoiDialogDiv: function () {
            var self = this;
            var $chotphoiBody = $('<div />').addClass('modal-body')
                .append($('<form />').attr('id', "ChotPhoiPopup")
                    .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                        .append($('<tr />')
                            .append($('<td style="border:0;" />').addClass('col-md-6')
                                .append($('<div />').addClass('form-group')
                                    .append($('<p />').html("Khi bấm nút Chốt phơi, phơi được chốt sẽ không còn thay đổi thông tin được nữa. Đồng ý ?"))
                                )
                            )
                        )
                        .append($('<tr />')
                            .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                                .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
                                    .click(function () {
                                        self._chotPhoi();
                                        self._closeChotPhoiDialog();
                                    })
                                )
                                .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
                                    .click(function () {
                                        self._closeChotPhoiDialog();
                                    })
                                )
                            )
                        )
                    )
            );

            //Create a div for dialog and add to container element
            self._$chotphoiModal = $('<div />').addClass('modal fade').attr('id', 'chotphoi-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header bg-primary')
                            .append($('<h3 />').addClass('modal-title thin-1').html('Xác nhận'))
                        )
                        .append($chotphoiBody)
                    )
                )
            .appendTo($('body'));
            //.appendTo(this.element);
            self._$chotphoiModal.modal('show');
        },
        _hideXuatBenButton: function () {
            this._$xuatbenButton.removeClass('hidden');
            this._$xuatbenButton.addClass('hidden');
        },
        _showXuatBenButton: function () {
            this._$xuatbenButton.removeClass('hidden');
        },
        _createErrorDialogDiv: function () {
            var self = this;

            var $errorBody = $('<div style="padding-top:0;" />').addClass('modal-body')
                .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                    .append($('<tr class="col-md-12 pl0 pr0"/>')
                        .append($('<td style="border-top:0;" class="col-md-1" />')
                            .append($('<img src="Content/images/warning-popup-icon.png" width="80px" />'))
                        )
                        .append($('<td  style="border-top:0;vertical-align:middle;" class="col-md-11" />')
                            .append($('<h4 style="line-height:22px;"/>').addClass('message'))
                        )
                    )
                    .append($('<tr />')
                        .append($('<td style="padding-top:10px;" />').addClass('col-md-12')
                            .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý')
                                .click(function () {
                                    self._closeErrorDialog();
                                })
                            )
                        )
                    )
            );

            //Create a div for dialog and add to container element
            self._$emodal = $('<div />').addClass('modal fade').attr('id', 'error-popup')
                .attr('role', 'dialog')
                .attr('aria-hidden', 'true')
                .append(
                    $('<div />').addClass('modal-dialog modal-md')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header bg-primary').css('background-color', '#d9534f')
                            .append($('<h3 />').addClass('modal-title thin-1').html('Cảnh báo'))
                        )
                        .append($errorBody)
                    )
                )
                .appendTo($('body'));
            //.appendTo(this.element);
        },
        _showModal: function () {
            this._$modal.modal('show');
        },
        _showCModal: function () {
            this._$cmodal.modal('show');
        },
        _showEModal: function () {
            this._$emodal.modal('show');
        },
        _closeUpdateDialog: function () {
            this._clearCustomerWarning();
            this._$modal.modal('hide');
            $('body').find('.updateConflict-popup').remove();
            $('body').find('.modal-backdrop.fade.in').remove();
        },
        _closeErrorDialog: function () {
            this._$emodal.modal('hide');
        },
        _closeCancelDialog: function () {
            this._$cmodal.modal('hide');
            this._resetCancelForm();
        },
        _closePopupModal: function () {
            this._$popModal.modal('hide');
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
        _closeUpdateConflictDialog: function () {
            this._$updateConflictModal.modal('hide');
            //this._$updateConflictModal.empty();
        },
        _closeChotPhoiDialog: function () {
            this._$chotphoiModal.modal('hide');
        },

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
            var index = self._seatStack.indexOf(s);
            if (index != -1) {
                self._removeFromSeatStack(obj, s, index);
            } else {
                self._addToSeatStack(obj, s);
            }
        },
        _addToSeatStack: function (obj, s) {
            var self = this;
            //Add seat to stack
            if (self._seatStack.indexOf(s) == -1) {
                self._seatStack.push(s);
                //Change color of seat to selected
                $(obj).addClass(_dict._slc[0]);
            }
        },
        _removeFromSeatStack: function (obj, s, index) {
            var self = this;

            //Remove from stack
            self._seatStack.splice(index, 1);
            //Change color of seat
            $(obj).removeClass(_dict._slc[0]);
        },
        _resetSeatStack: function () {
            var self = this;
            self._seatStack = [];
        },
        _resetMovingStack: function () {
            this._movingStack = [];
            this._fMoving = false;
            this._toggleFilterWhenMoving();
        },
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
            $.each(self._seatStack, function (ist, st) {
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
        _bookSeat: function (obj, seat) {
            var self = this;
            try {
                //Create book ticket obj
                var bookObj = self._createBookTicketObj(seat);
                var completeReload = function (u, r, l, t) {
                    // reset action về default sau khi gửi ajax thành công 
                    oRq.cAType = 1;

                    if (u != 1 || l <= 0) {
                        self._showError(_dict._err[4]);
                        self._reloadSheet();
                        return;
                    }
                    //Add seat to seat stack
                    $.each(self._seatStack, function (k, v) {
                        var tick = v._getCurrentTicket();
                        if (tick._status != 1) {
                            self._resetSeatStack();
                        }
                    });
                    if (!self._existingSeatStack(seat)) {
                        self._seatStack.push(seat);
                    }

                    //Reload sheet
                    self._reloadSheet();

                    //Store history
                    self._storeHistory(self.options.un, 'book', { '_tid': self._cTripId, '_tname': self._data[self._cTripIndex].Name, '_tdate': self._getDepartureTime(), '_s': [seat._label] });

                };
                //Submit action
                //self._submitAction(bookObj, completeReload);
                if (oRq.cEl.length > 0) {
                    vRqu(bookObj, completeReload);
                }
                //self._submitAsyncAction(bookObj, completeReload);
            } catch (err) {
                self._showError(err);
            }
        },
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
        _createBookTicketObj: function (seat) {
            var self = this;
            var departureTime = self._getDepartureTime();
            var fare = 0;
            var obj = {};
            obj._a = "BookTicket";
            obj._c = [{
                TripId: self._cTripId,
                SeatCode: seat._getSeatInfo(),
                PickupDate: departureTime.toFormatString('iso'),
                Bus: self._cTripBus,
                //StageCode: !self._cStageCode ? 1 : self._cStageCode //StageCode
                StageCode: self._cStageCode
            }];
            // FromArea & ToArea
            var fromId = 0;
            var toId = 0;
            if (app.oRights["StageEnable"]) {
                fromId = (typeof self._cFromId != 'undefined' && self._cFromId > 0) ? self._cFromId : self._cDefaultFromId;
                toId = (typeof self._cToId != 'undefined' && self._cToId > 0) ? self._cToId : self._cDefaultToId;
            } else {
                fromId = (typeof self._cDefaultFromId != 'undefined' && self._cDefaultFromId > 0) ? self._cDefaultFromId : self._cFromId;
                toId = (typeof self._cDefaultToId != 'undefined' && self._cDefaultToId > 0) ? self._cDefaultToId : self._cToId;
            }
            var fromInfo = self._data[self._cTripIndex].StopPoints.data[self._data[self._cTripIndex].StopPoints.idx[fromId]];
            if (typeof fromInfo != 'undefined') {
                var fromArea = "1~" + fromInfo.Id + "|" + fromInfo.Type + "|" + fromInfo.Code + "|" + fromInfo.Name;
            }
            var toInfo = self._data[self._cTripIndex].StopPoints.data[self._data[self._cTripIndex].StopPoints.idx[toId]];
            if (typeof toInfo != 'undefined') {
                var toArea = "1~" + toInfo.Id + "|" + toInfo.Type + "|" + toInfo.Code + "|" + toInfo.Name;
            }
            if (typeof _dict._hasMultiFare != "undefined" && !_dict._hasMultiFare) {
                fare = self._getCurrentFare();
            } else {
                // load fare by default FromId, ToId
                fare = self._getCurrentFareById(fromId, toId);
            }
            obj._d = [
            {
                CompId: self.options.cid,
                TripId: self._cTripId,
                AgentId: parseInt(self.options.aid),
                AgentInfo: self._getAgentInfo(),
                TripDate: departureTime.toFormatString('iso'),
                SeatCode: seat._getSeatInfo(),
                IssueDate: new Date().addMinutes(self._sOffsetMinute).toFormatString('iso'),
                PickupDate: departureTime.toFormatString('iso'),
                TripAlias: parseInt(self._cTripBus),
                Status: 1,
                Fare: fare,
                CreatedUser: self.options.un,
                StageCode: self._cStageCode,
                SeatType: seat._getSeatType(),
                FromArea: fromArea,
                ToArea: toArea,
                FromId: fromId,
                ToId: toId,
                //nguồn gốc vé:
                // 1- BMS, 2-FrontEnd, 3-VMS
                //Type: app.cid == 132 ? 3 : 1
                Type: app.aid == 135 ? 3 : 1
            }];
            return obj;
        },
        _renderSeatNoQuickBookDiv: function (data) {
            var self = this;
            var $ul = self._$quickBookModal.find('ul#seat-no').empty();
            $.each(data, function (_, s) {
                $ul.append($('<li />').addClass('list-group-item').addClass(_dict._vc[Math.floor(Math.random() * _dict._vc.length)]).text(s));
            });
        },
        _showQuickBookForm: function (obj, seat) {
            var self = this;
            var fObj = self._initQuickBookFormData();
            self._renderSeatNoQuickBookDiv(fObj.SeatNo);
            self._renderRoutePoints(fObj.RoutePoints, fObj.FromPoint, fObj.ToPoint);
            self._renderPaymentQuickBook();
            self._populateFormData(fObj, self._$quickBookModal);
            self._blockFormField();
            self._bindEventOnQuickBookForm();
            self._showQuickBookModal();
        },
        _blockFormField: function () {
            var self = this;
            self._$quickBookModal.find('input[name="Note"]').prop('disabled', false);
            self._$quickBookModal.find('select[name="PaymentType"]').prop('disabled', false);
            self._$quickBookModal.find('input[name="Fare"]').prop('disabled', false);
            self._$quickBookModal.find('input[name="RoutePoint"]').prop('disabled', false);
            var ticketNotes = [];
            var ticketStatus = [];
            var ticketFares = [];
            var fromAreas = [];
            var toAreas = [];
            var blockFields = [];
            $.each(self._seatStack, function (k, v) {
                var tick = v._getCurrentTicket();
                ticketNotes.push(tick._note);
                ticketStatus.push(tick._status);
                ticketFares.push(tick._fare);
                fromAreas.push(tick.fromArea);
                toAreas.push(tick.toArea);
            });

            ticketNotes = ticketNotes.getUnique();
            if (ticketNotes.length > 1) {
                blockFields.push("Note");
            }
            ticketStatus = ticketStatus.getUnique();
            if (ticketStatus.length > 1) {
                blockFields.push("RoutePoint");
                blockFields.push("PaymentType");
            }
            ticketFares = ticketFares.getUnique();
            if (ticketFares.length > 1) {
                blockFields.push("Fare");
            }
            fromAreas = fromAreas.getUnique();
            toAreas = toAreas.getUnique();
            if (fromAreas.length > 1 || toAreas.length > 1) {
                blockFields.push("RoutePoint");
            }
            blockFields = blockFields.getUnique();
            $.each(blockFields, function (k, v) {
                switch (v) {
                    case "Note":
                        self._$quickBookModal.find('input[name="Note"]').prop('disabled', true);
                        break;
                    case "Fare":
                        self._$quickBookModal.find('input[name="Fare"]').prop('disabled', true);
                        break;
                    case "RoutePoint":
                        self._$quickBookModal.find('div.checkbox-route-point input[name="RoutePoint"]').prop('disabled', true);
                        break;
                    case "PaymentType":
                        self._$quickBookModal.find('select[name="PaymentType"]').prop('disabled', true);
                        break;
                    default:
                        break;
                }
            });

            if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
                var firstPoint = self._$quickBookModal.find('div.checkbox-route-point input[name="RoutePoint"]').first();
                if (app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                    if (!firstPoint.is(':disabled')) {
                        firstPoint.attr('disabled', true);
                    }
                }
            }
        },
        _renderRoutePoints: function (routePoints, fromPoint, toPoint) {
            var self = this;
            self._$quickBookModal.find('div.checkbox-route-point').empty();
            var startTime = self._cTripTime;
            var startHour = parseInt(startTime.split(':')[0]);
            var startMinute = parseInt(startTime.split(':')[1]);
            $.each(routePoints, function (k, v) {
                var hourFomat = "";
                var minuteFomat = "";
                startHour += parseInt(v.Hour);
                startMinute += parseInt(v.Minute);
                if (startMinute >= 60) {
                    startMinute = startMinute % 60;
                    startHour += 1;
                }
                if (startHour > 24) {
                    startHour = startHour % 24;
                } else if (startHour == 24) {
                    startHour = 0;
                    hourFomat = "00";
                }
                if (startHour < 10) {
                    hourFomat = "0" + startHour;
                } else if (startHour >= 10) {
                    hourFomat = startHour;
                }
                if (startMinute < 10) {
                    minuteFomat = "0" + startMinute;
                } else {
                    minuteFomat = startMinute;
                }
                var time = "";
                if (k == 0) {
                    time = self._cTripTime;
                } else {
                    time = hourFomat + ":" + minuteFomat;
                }
                var $routePoint = $('<label class="checkbox-inline" />')
                    .append($('<input type="checkbox" name="RoutePoint" data-point-id="' + v.Id + '"/>'))
                    .append($('<b />').html(v.Code))
                    .append($('<mark class="text-primary"/>').html(time));
                if (routePoints.length == 2) {
                    $routePoint.addClass('hidden');
                }
                self._$quickBookModal.find('div.checkbox-route-point').append($routePoint);
            });
            var fromId = 0;
            var toId = 0;
            if (self._cDefaultFromId != 0) {
                fromId = self._cDefaultFromId;
            }
            if (self._cDefaultToId != 0) {
                toId = self._cDefaultToId;
            }
            if (!$.isEmptyObject(fromPoint)) {
                fromId = fromPoint.Id;
            }
            if (!$.isEmptyObject(toPoint)) {
                toId = toPoint.Id;
            }
            if (fromId == 0 && toId == 0) {
                self._$quickBookModal.find('div.checkbox-route-point input[name="RoutePoint"]').first().attr('checked', true);
                self._$quickBookModal.find('div.checkbox-route-point input[name="RoutePoint"]').last().attr('checked', true);
            } else {
                self._$quickBookModal.find('div.checkbox-route-point input[name="RoutePoint"][data-point-id="' + fromId + '"]').attr('checked', true);
                self._$quickBookModal.find('div.checkbox-route-point input[name="RoutePoint"][data-point-id="' + toId + '"]').attr('checked', true);
            }
        },
        _initQuickBookFormData: function () {
            var self = this;
            var seatNo = [];
            var totalFare = 0;
            var stopPoints = self._data[self._cTripIndex].StopPoints['data'];
            var fromPoint = {};
            var toPoint = {};
            var fare = 0;
            var ticketNotes = [];
            var note = "";
            var fromAreas = [];
            var toAreas = [];
            $.each(self._seatStack, function (i, v) {
                var tick = v._getCurrentTicket();
                ticketNotes.push(tick._note);
                fromAreas.push(tick.fromArea);
                toAreas.push(tick.toArea);
                seatNo.push(v._label);
                fare = tick._fare;
                totalFare += tick._fare;
            });
            ticketNotes = ticketNotes.getUnique();
            if (ticketNotes.length == 1) {
                note = ticketNotes[0];
            }
            fromAreas = fromAreas.getUnique();
            if (fromAreas.length == 1) {
                var indFrom = fromAreas[0].indexOf('~');
                var from = fromAreas[0].substr(indFrom + 1, fromAreas[0].length).split('|');
                fromPoint.Id = from[0];
                fromPoint.Type = from[1];
                fromPoint.Code = from[2];
                fromPoint.Name = from[3];
            }
            toAreas = toAreas.getUnique();
            if (toAreas.length == 1) {
                var indTo = toAreas[0].indexOf('~');
                var to = toAreas[0].substr(indTo + 1, toAreas[0].length).split('|');
                toPoint.Id = to[0];
                toPoint.Type = to[1];
                toPoint.Code = to[2];
                toPoint.Name = to[3];
            }
            var obj = {
                SeatNo: seatNo,
                Fare: fare.toMn(),
                TotalFare: totalFare.toMn(),
                DepartureDate: "Ngày khởi hành: " + self._cTripDate.toFormatString('dd/mm/yyyy') + " - " + self._cTripTime,
                RouteName: "Tuyến: " + self._data[self._cTripIndex].Name,
                RoutePoints: stopPoints,
                Note: note,
                FromPoint: fromPoint,
                ToPoint: toPoint
            }
            return obj;
        },
        _showQuickBookModal: function () {
            this._resetQuickBookModal();
            this._$quickBookModal.modal('show');
        },
        _resetQuickBookModal: function () {
            var self = this;
            self._$quickBookModal.find('input[name="StatusInfo"]').val(2);
            self._$quickBookModal.find('input[name="NumClick"]').val(0);
            self._$quickBookModal.find('input[name="Fare"][disabled="disabled"]').prop('disabled', false);
            self._$quickBookModal.find('input[name="Note"][disabled="disabled"]').prop('disabled', false);
            self._$quickBookModal.find('select[name="PaymentType"][disabled="disabled"]').prop('disabled', false);
            self._$quickBookModal.find('div.warning-message').html('');
            self._$quickBookModal.find('div.warning-message').hide();
        },
        _bindEventOnQuickBookForm: function () {
            var self = this;
            self._$quickBookModal.find('button.close-qBook').unbind().on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self._closeQuickBookForm();
            });

            self._$quickBookModal.find('input[name="RoutePoint"]').unbind().on('click', function (e) {
                var fromId = 0;
                var toId = 0;
                var fare = 0;
                var totalFare = 0;
                var clicked = self._$quickBookModal.find('input[name="NumClick"]').val();
                if ($(this).is(':checked')) {
                    var checked = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]');
                    if (checked.length >= 2) {
                        if (clicked != 0) {
                            self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                            $(this).attr('checked', true);
                            if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
                                checked = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                                if (checked.length == 1) {
                                    fromId = self._$quickBookModal.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                                    toId = checked.attr('data-point-id');
                                    fare = self._getFareQuickBook(fromId, toId);
                                }
                                totalFare = self._seatStack.length * fare;
                                self._$quickBookModal.find('input[name="Fare"]').val(fare.toMn());
                                self._$quickBookModal.find('input[name="TotalFare"]').val(totalFare.toMn());
                            } else {
                                self._$quickBookModal.find('input[name="Fare"]').val(0);
                                self._$quickBookModal.find('input[name="TotalFare"]').val(0);
                            }
                        } else {
                            checked = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]');
                            checked.last().removeAttr('checked');
                            $(this).attr('checked', true);
                            checked = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]');
                            if (checked.length == 2) {
                                fromId = checked.first().attr('data-point-id');
                                toId = checked.last().attr('data-point-id');
                                fare = self._getFareQuickBook(fromId, toId);
                            }
                            totalFare = self._seatStack.length * fare;
                            self._$quickBookModal.find('input[name="Fare"]').val(fare.toMn());
                            self._$quickBookModal.find('input[name="TotalFare"]').val(totalFare.toMn());
                            self._$quickBookModal.find('input[name="NumClick"]').val(1);
                        }
                    } else if (checked.length <= 1) {
                        if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint && app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                            self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                            $(this).attr('checked', true);
                            checked = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                            if (checked.length == 1) {
                                fromId = self._$quickBookModal.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                                toId = checked.attr('data-point-id');
                                fare = self._getFareQuickBook(fromId, toId);
                            }
                            totalFare = self._seatStack.length * fare;
                            self._$quickBookModal.find('input[name="Fare"]').val(fare.toMn());
                            self._$quickBookModal.find('input[name="TotalFare"]').val(totalFare.toMn());
                        } else {
                            $(this).attr('checked', true);
                            checked = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]');
                            if (checked.length == 2) {
                                fromId = checked.first().attr('data-point-id');
                                toId = checked.last().attr('data-point-id');
                                fare = self._getFareQuickBook(fromId, toId);
                            }
                            totalFare = self._seatStack.length * fare;
                            self._$quickBookModal.find('input[name="Fare"]').val(fare.toMn());
                            self._$quickBookModal.find('input[name="TotalFare"]').val(totalFare.toMn());
                        }
                    }
                } else {
                    $(this).removeAttr('checked');
                    self._$quickBookModal.find('input[name="Fare"]').val(0);
                    self._$quickBookModal.find('input[name="TotalFare"]').val(0);
                    self._$quickBookModal.find('input[name="NumClick"]').val(1);
                }
            });

            self._$quickBookModal.find('select[name="PaymentType"]').unbind().on('change', function (e) {
                if ($(this).val() == 9) {
                    self._$quickBookModal.find('input[name="StatusInfo"]').val(5);
                } else {
                    self._$quickBookModal.find('input[name="StatusInfo"]').val(2);
                }
            });

            self._$quickBookModal.find('input[name="Fare"]').unbind().on('change', function (e) {
                var numSeat = self._seatStack.length;
                var newFare = $(this).val().toNum();
                if (newFare < 10000) {
                    newFare = newFare * 1000;
                }
                var totalFare = numSeat * newFare;
                $(this).val(newFare.toMn());
                self._$quickBookModal.find('input[name="TotalFare"]').val(totalFare.toMn());
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$quickBookModal.find('button.cancel-qBook').unbind().on('click', function (e) {
                self._closeQuickBookForm();
                self._showCancelForm();
            });

            self._$quickBookModal.find('button.pay-qBook').unbind().on('click', function (e) {
                if (self._validateQuickBookForm()) {
                    return;
                }
                self._payQBook();
            });

            self._$quickBookModal.find('button.print-qBook').unbind().on('click', function (e) {
                var afterSave = function () {
                    var afterReloadSheet = function () {
                        self._printETicket();
                        self._closeQuickBookForm();
                        self._resetSeatStack();
                        self._clearSelectedItem();
                    }
                    self._reloadSheet(afterReloadSheet);
                }
                if (self._validateQuickBookForm()) {
                    return;
                }
                self._payQBook(afterSave);
            });
        },
        _validateQuickBookForm: function () {
            var self = this;
            var hasError = false;
            var checkedRoutePoint = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]');
            if (checkedRoutePoint.length != 2) {
                hasError = true;
                self._$quickBookModal.find('div.warning-message').html('Điểm đi, điểm đến không chính xác, vui lòng kiểm tra lại.');
                self._$quickBookModal.find('div.warning-message').show();
            }
            var fare = self._$quickBookModal.find('input[name="Fare"]').val().toNum();
            var paymentType = self._$quickBookModal.find('select[name="PaymentType"]').val();
            if (paymentType != 9 && fare == 0) {
                hasError = true;
                self._$quickBookModal.find('div.warning-message').html('Giá vé không chính xác, vui lòng kiểm tra lại.');
                self._$quickBookModal.find('div.warning-message').show();
            }
            // kiểm tra xem các ghế trong seat stack có cùng trạng thái đặt chỗ hay không?
            $.each(self._seatStack, function (k, v) {
                var tick = v._getCurrentTicket();
                if (tick._status != 1) {
                    hasError = true;
                    self._$quickBookModal.find('div.warning-message').html('Đã có ghế thanh toán rồi, vui lòng kiểm tra lại.');
                    self._$quickBookModal.find('div.warning-message').show();
                }
            });

            return hasError;
        },
        _closeQuickBookForm: function () {
            var self = this;
            self._$quickBookModal.modal('hide');
            self._resetQuickBookModal();
        },
        _renderPaymentQuickBook: function () {
            var self = this;
            self._$quickBookModal.find('select[name="PaymentType"]').empty();
            $.each(_dict._qBookPayment, function (k, v) {
                var $op = null;
                if (v[2] != 0) {
                    $op = $('<option value="' + v[0] + '" />').html(v[1]['vi']);
                    self._$quickBookModal.find('select[name="PaymentType"]').append($op);
                }
            });
        },
        _payQBook: function (afterSave) {
            var self = this;
            var obj = self._createPayQBookObj();
            if (false != obj) {
                var completeReload = function (u, r, l, t) {

                    if (u != 1) return;

                    if (typeof afterSave != "undefined" && typeof afterSave === "function") {
                        // cập nhật FromArea và ToArea các ghế trong seat stack
                        $.each(self._seatStack, function (k, l) {
                            var tick = l._getCurrentTicket();
                            tick.fromArea = (obj._d)[0].FromArea;
                            tick.toArea = (obj._d)[0].ToArea;
                        });
                        afterSave.call();
                    } else {
                        //Store history
                        var slabel = [];
                        $.each(self._seatStack, function (i, v) {
                            slabel.push(v._label);
                        });
                        self._storeHistory(self.options.un, 'update', { '_tid': self._cTripId, '_tname': self._data[self._cTripIndex].Name, '_tdate': self._getDepartureTime(), '_s': slabel });

                        //Reset seat stack
                        self._resetSeatStack();

                        //Reload sheet
                        self._reloadSheet();

                        //Close dialog
                        self._closeQuickBookForm();
                    }
                };
                //Submit action
                self._submitAsyncAction(obj, completeReload);
            }
        },
        _getDataQuickBookForm: function () {
            var self = this;
            var obj = {}
            var routePoints = self._$quickBookModal.find('input[name="RoutePoint"][checked="checked"]');
            var $fromPoint = routePoints.first();
            // kiểm tra xem điểm đi có bị block không
            // nếu có thì không cập nhật điểm đi
            if ($fromPoint.length > 0 && !$fromPoint.is(':disabled')) {
                var fromId = $fromPoint.attr('data-point-id');
                var fromInfo = self._data[self._cTripIndex].StopPoints.data[self._data[self._cTripIndex].StopPoints.idx[fromId]];
                obj.FromArea = "1~" + fromInfo.Id + "|" + fromInfo.Type + "|" + fromInfo.Code + "|" + fromInfo.Name;
            }
            // kiểm tra xem điểm đến có bị block không
            // nếu có thì không cập nhật điểm đến
            var $toPoint = routePoints.last();
            if ($toPoint.length > 0 && !$toPoint.is(':disabled')) {
                var toId = $toPoint.attr('data-point-id');
                var toInfo = self._data[self._cTripIndex].StopPoints.data[self._data[self._cTripIndex].StopPoints.idx[toId]];
                obj.ToArea = "1~" + toInfo.Id + "|" + toInfo.Type + "|" + toInfo.Code + "|" + toInfo.Name;
            }
            // kiểm tra xem giá vé có bị block không
            // nếu có thì không cập nhật giá vé
            var $fare = self._$quickBookModal.find('input[name="Fare"]');
            if (!$fare.is(':disabled')) {
                obj.Fare = $fare.val();
            }
            obj.PaymentType = self._$quickBookModal.find('select[name="PaymentType"]').val();
            obj.StatusInfo = self._$quickBookModal.find('input[name="StatusInfo"]').val();
            var $note = self._$quickBookModal.find('input[name="Note"]').not(':disabled');
            if ($note.length > 0) {
                obj.Note = $note.val();
            }

            return obj;
        },
        _createPayQBookObj: function () {
            var self = this;
            var d = self._getDataQuickBookForm();

            var obj = {};
            obj._a = "UpdateBookTicket";
            obj._c = [];
            obj._d = [];

            //Payment
            var paymentInfo = "";
            if (vIsEstStr(d.PaymentType)) {
                var pt = "";
                $.each(_dict._qBookPayment, function (k, t) {
                    if ("" == pt) {
                        if (t[0] == d.PaymentType) {
                            pt = t[1].vi;
                        }
                    }
                });
                var code = "";
                switch (parseInt(d.PaymentType)) {
                    case 1:
                        code = self._getBranchInfo(app.aid);
                        break;
                    case 2:
                        code = d.ChargeCode;
                        break;
                    case 3:
                        code = d.PayAddress;
                        break;
                    case 4:
                        //code = d.DriverName;
                        code = self._getTeamInfo();
                        break;
                    case 5:
                        code = d.TransCode;
                        break;
                    case 6:
                        code = self._getBranchInfo(d.AgentName);
                        break;
                    case 7:
                    case 8:
                    case 9:
                        break;
                    case 10:
                        code = self._getBranchInfo(d.BranchName);
                        break;
                    default:
                        break;
                }
                paymentInfo = self._getPayment(d.PaymentType, pt, code);
            }
            $.each(self._seatStack, function (i, v) {
                var t = v._getCurrentTicket();
                var pickUpDate = new Date(t._pdate.getTime());
                pickUpDate.addMinutes(self._sOffsetMinute);
                obj._c.push({
                    Id: t._id,
                    TripId: self._cTripId,
                    SeatCode: v._getSeatInfo(),
                    PickupDate: pickUpDate.toFormatString('iso'),
                    Bus: self._cTripBus
                });
                var dObj = {
                    TripAlias: parseInt(self._cTripBus),
                    Status: d.StatusInfo,
                    FromArea: d.FromArea,
                    ToArea: d.ToArea
                };
                var ticketCode = t._code;
                if (vIsEstStr(ticketCode)) {
                    dObj.Code = ticketCode;
                }
                if (typeof d.Fare != "undefined") {
                    dObj.Fare = d.Fare.toNum();
                }
                if (typeof d.Note != "undefined") {
                    dObj.Note = d.Note;
                }
                if (typeof d.PaymentType != "undefined") {
                    dObj.PaymentInfo = paymentInfo;
                    if (t._isBooking() && vIsEstStr(paymentInfo)) {
                        dObj.UserCharge = self.options.un;
                    }
                }
                obj._d.push(dObj);
            });
            return obj;
        },

        /************************************************************************
        * UPDATE                                                                *
        *************************************************************************/
        _replaceUnicodeCharacter: function (str) {
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
        _bindEventsOnSearchResult: function () {
            var self = this;
            $('div.search-result tr').mousedown(function () {
                if ($("input:text[name=TransferInfo]").is(":focus")) {
                    $("input:text[name=TransferInfo]").val($(this).attr("data-name"));
                } else if ($("input:text[name=PickupInfo]").is(":focus")) {
                    $("input:text[name=PickupInfo]").val($(this).attr("data-name"));
                }
                self._$updateForm.find('div.search-result').remove();
            });

            $('div.search-result tr').hover(function () {
                $('div.search-result').find('tr').removeClass('selected');
                $(this).addClass('selected');
            }, function () {
                $(this).removeClass('selected');
            });

        },
        _renderResultList: function (list) {
            var self = this;
            var $resultList = $('<table />').addClass('search-items');
            if (list != null && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (typeof list[i] != "undefined" && list[i] != null) {
                        var pLocData = list[i];
                        pLocData._trIndex = i;
                        var tripTime = String(self._cTripTime);
                        if (String(self._cTripTime).indexOf(':') >= 0) {
                            var mins = parseInt(tripTime.split(':')[1]) + parseInt(pLocData.pLoc._time);
                            var hours = parseInt(tripTime.split(':')[0]);
                            if (mins >= 60) {
                                hours += (mins - (mins % 60)) / 60;
                                mins = mins % 60;
                            }
                            hours = (hours >= 24) ? (hours - 24) : hours;
                            pLocData.pLoc._time = hours + ':' + ((mins > 9) ? mins.toString() : ('0' + mins));
                        }
                        $resultList.append(vtpl(_dict._locationItemTpl, pLocData));
                    }
                }
            }
            return $resultList;
        },
        navigateThroughSearchResult: function (key, type) {
            var searchResultItem = $('div.search-result tr');

            var selectedSearchResult = $('div.search-result tr.selected');
            var $input = type == 'transfer' ? $('input[name=TransferInfo]') : $('input[name=PickupInfo]');
            if (key == 13 || key == 9) {
                selectedSearchResult = $('div.search-result tr.selected');
                if ($('div.search-result').length == 0) {
                } else if (selectedSearchResult != null) {
                    $input.val(selectedSearchResult.attr('data-name'));
                    $('div.search-result').remove();
                    if (key == 9) {
                        $input.focus();
                    }
                    return true;
                }
            } else if (selectedSearchResult != null && selectedSearchResult.length > 0) {
                selectedSearchResult.removeClass('selected');
                selectedSearchResult = key == 40 ? selectedSearchResult.next() : selectedSearchResult.prev();
            }
            if (selectedSearchResult.length == 0) {
                selectedSearchResult = key == 40 ? searchResultItem.eq(0) : searchResultItem.last();
            }
            selectedSearchResult.addClass('selected');
            return false;
        },
        suggestLocations: function (self, type, value) {
            var strs = (type == 'transfer') ? (self._data[self._cTripIndex].TransferPointsInfo.split('~')) :
                                            (self._data[self._cTripIndex].PickedPointsInfo.split('~'));
            var suggestedLocations = [];
            if (strs != null && strs.length > 1) {
                for (var k = 1; k < strs.length; k++) {
                    var strsSplitted = strs[k].split('|');
                    suggestedLocations.push({
                        "pLoc": {
                            _index: strsSplitted[0],
                            _name: strsSplitted[1], //
                            _time: strsSplitted[2],
                            _order: strsSplitted[3],
                            _address: strsSplitted[4],
                            _nearby: strsSplitted[5],
                            _locationId: strsSplitted[6]
                        }
                    });
                }
            }
            var perfectMatchedTransferLocations = Array();
            var ultraPerfectMatchedTransferLocations = Array();
            var matchedTransferLocations = Array();
            var ultraMatchedTransferLocations = Array();

            if (value.length >= 1) {
                for (var i = 0; i < suggestedLocations.length; i++) {
                    var locData = suggestedLocations[i];
                    var convertedInputText = this._replaceUnicodeCharacter(value);
                    var nameConverted = this._replaceUnicodeCharacter(locData.pLoc._name);

                    if (locData.pLoc._name.toLowerCase().indexOf(value.toLowerCase()) == 0) {
                        ultraPerfectMatchedTransferLocations.push(locData);
                    } else if (locData.pLoc._name.toLowerCase().indexOf(value.toLowerCase()) > 0) {
                        perfectMatchedTransferLocations.push(locData);
                    } else if (nameConverted.indexOf(convertedInputText) == 0) {
                        ultraMatchedTransferLocations.push(locData);
                    } else if (nameConverted.indexOf(convertedInputText) > 0) {
                        matchedTransferLocations.push(locData);
                    }
                }
            }

            self._$updateForm.find('div.search-result').remove();

            var listLocations = ultraPerfectMatchedTransferLocations.concat(perfectMatchedTransferLocations.concat(ultraMatchedTransferLocations.concat(matchedTransferLocations)));

            var $input = (type == 'transfer') ? self._$updateForm.find('input[name=TransferInfo]') : self._$updateForm.find('input[name=PickupInfo]');

            if (listLocations != null && listLocations.length > 0) {
                $input.parent()
                    .append(
                        $(_dict._locationHeaderTpl).append(
                            $('<div class="scrollable" />').append($('<table />').addClass('search-items'))
                            .append(self._renderResultList(listLocations, type))
                        ).append(vtpl(_dict._locationFooterTpl, { locCount: listLocations.length }))
                    );

                self._bindEventsOnSearchResult();
            }
        },
        updateInfoOfReturnTickets: function () {
            var self = this;
            if (self._seatToBeUpdatedReturningInfo.length > 0 && self._seatToBeUpdatedReturningInfo[0]._tickets.length > 0) {
                var _c = [], _d = [];
                for (var i = 0; i < self._seatToBeUpdatedReturningInfo.length; i++) {
                    _c.push({
                        Id: self._seatToBeUpdatedReturningInfo[i]._tickets[0]._id,
                        Code: self._seatToBeUpdatedReturningInfo[i]._tickets[0]._code,
                        Bus: 0
                    });
                    _d.push({
                        ReturnCode: self._dataToBeSavedReturningInfo.code,
                        ReturnDate: self._dataToBeSavedReturningInfo.date
                    });
                }
                vRqs({
                    _a: 'UpdateBookTicket',
                    _c: _c,
                    _d: _d,
                }, function (u, r, l, t) { });
            }
            self._seatToBeUpdatedReturningInfo = [];
        },
        _bindEventOnUpdateForm: function () {
            var self = this;
            var $form = self._$updateForm;

            $form.find('input[name=PickupInfo]').not(':disabled').blur(function (e) {
                self._$updateForm.find('div.search-result').remove();
            });
            $form.find('input[name=TransferInfo]').not(':disabled').blur(function (e) {
                self._$updateForm.find('div.search-result').remove();
            });

            $form.find('input[name=PickupInfo]').not(':disabled').keydown(function (e) {
                if (e.keyCode == 13 || e.keyCode == 9) {
                    if (self.navigateThroughSearchResult(e.keyCode, 'pickup')) {
                        e.preventDefault();
                    }
                }
            });

            $form.find('input[name=TransferInfo]').not(':disabled').keydown(function (e) {
                if (e.keyCode == 13 || e.keyCode == 9) {
                    if (self.navigateThroughSearchResult(e.keyCode, 'transfer')) {
                        e.preventDefault();
                    }
                }
            });

            $form.find('input[name=TransferInfo]').not(':disabled').keyup(function (e) {
                if (e.keyCode == 13 || e.keyCode == 9) {
                    return;
                }
                else if (e.keyCode == 40 || e.keyCode == 38) {
                    self.navigateThroughSearchResult(e.keyCode, 'transfer-location');
                } else {
                    self.suggestLocations(self, "transfer", this.value);
                }
            });

            $form.find('input[name=PickupInfo]').not(':disabled').keyup(function (e) {
                if (e.keyCode == 13 || e.keyCode == 9) {
                    return;
                } else if (e.keyCode == 40 || e.keyCode == 38) {
                    self.navigateThroughSearchResult(e.keyCode, 'pickup-location');
                } else {
                    self.suggestLocations(self, "pickup", this.value);
                }
            });

            $form.find('input[name=PhoneNumbers]').not(':disabled').keyup(function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $li = $form.find('div.upform-search-result-phone ul.search-items li.selected');
                    $form.find('input[name=CustomerId]').val($li.attr('cid'));
                    $form.find('input:text[name=PhoneNumbers]').val($li.attr('cphone'));
                    $form.find('input[name=FullName]').val($li.attr('cname'));
                    if (_dict._hasBTWarning) {
                        self._getCustomerWarning($li.attr('cname'), $li.attr('cphone'), $li.attr('cid'));
                    }
                    self._clearSuggestCustomer();
                    // reset default value
                    app.preventUpdate = false;
                } else if (vIsNumKey(e)) {
                    if (this.value.length >= 6) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._getSuggestCustomer(this.value);
                    } else {
                        e.preventDefault();
                        e.stopPropagation();
                        self._clearSuggestCustomer();
                    }
                } else if (_dict._arrows.indexOf(e.keyCode) == -1) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._clearSuggestCustomer();
                } else if (e.keyCode == 27) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._clearSuggestCustomer();
                }
            });

            $form.find('input[name=PhoneNumbers]').not(':disabled').bind('paste', function (e) {
                this.value = e.originalEvent.clipboardData.getData('Text');
                if (!isNaN(this.value) && (this.value.length == 10 || this.value.length == 11)) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._getSuggestCustomer(this.value);
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                    self._clearSuggestCustomer();
                }
                $form.find('input[name=PhoneNumbers]').not(':disabled').blur();
            });

            $form.find('input[type=text]').not('[readonly]').on('keypress', function (e) {
                if (e.keyCode == 13 && !app.preventUpdate) { //Enter
                    e.preventDefault();
                    e.stopPropagation();
                    if ($(this).prop('name') == 'Fare') {
                        return;
                    }
                    if (!self._validateUpdateForm()) {
                        return;
                    }
                    var status = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
                    if ((status != null && status == 1)) {
                        return;
                    }
                    self._transformUpdateFormValue();
                    self._updateTicket();
                }
            });

            //console.log($form.find('input[name=Code]').parent().find('.input-group-addon')[0]);
            $form.find('input[name=Code]').parent().find('.input-group-addon').attr('title', 'Copy to clipboard')
                .clipboard({
                    path: 'Base/jquery-clipboard-1.3.2/jquery.clipboard.swf',
                    copy: function () {
                        console.log("Copy code to clipboard");
                        return $form.find('input[name=Code]').val();
                    }
                });
            //var $cCode = $form.find('input[name=ChargeCode]');
            $form.find('select[name=PaymentType]').on('change', function () {
                var $cls = $(this).closest('.row');
                $cls.find('.mpayment').parent().hide();
                $cls.find('.mpayment').parent().prev().hide();
                if (this.value) {
                    var $fe = $cls.find('.mpayment[data-type=' + this.value + ']');
                    //if (this.value == 1) {
                    if (this.value == 1 || this.value == 4) {
                        if (typeof _dict._hasSelectBranchPayment != "undefined" && _dict._hasSelectBranchPayment) {
                            if ($fe.length > 0) {
                                $fe.parent().show();
                                $fe.parent().prev().show();
                            }
                        }
                        //} else if (this.value == 4) {
                        //    if ($(this).is(':disabled')) {
                        //        if ($fe.length > 0) {
                        //            $fe.parent().show();
                        //            $fe.parent().prev().show();
                        //        }
                        //    }
                    } else {
                        if ($fe.length > 0) {
                            $fe.parent().show();
                            $fe.parent().prev().show();

                            if (this.value == 6) {
                                $fe.parent().find('a.chosen-single').css('border-color', '#aaa');
                                if (!self._$updateForm.find("select[name=PaymentType]").attr('disabled')) {
                                    $fe.parent().find('select[name=AgentName]').children().each(function (idx, value) {
                                        if (idx == 0) {
                                            $(this).attr('selected', true);
                                        }
                                        else {
                                            $(this).attr('selected', false);
                                        }
                                    });
                                }
                                $fe.parent().find('select[name=AgentName]').trigger('chosen:updated');
                            }
                        }
                    }
                }
            });
            $form.find('button').each(function (_, b) {
                if ($(b).hasClass('btn-cancel')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();

                        var fares = [];
                        var allIsBooking = true;
                        $.each(self._seatStack, function (k, v) {
                            var tick = v._getCurrentTicket();
                            if (tick._status != 1) {
                                allIsBooking = false;
                            }
                            fares.push(tick._fare);
                        });
                        var totalFare = 0;
                        $.each(fares, function (_, fare) {
                            totalFare += fare;
                        });
                        self._closeUpdateDialog();
                        self._showCancelForm(totalFare, allIsBooking);
                        self._selectedPhone = "";
                        self._selectedCode = "";
                        self._ctrlOn = false;
                    });
                } else if ($(b).hasClass('btn-update')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        var obj = self._createGetSeatStatusObj();
                        var completeGetSheetStatus = function (u, r, l, t) {
                            if (typeof r[0][2] != 'undefined') {
                                if (r[0][2] == 3) {
                                    self._closeUpdateDialog();
                                    self._showError(_dict._err[7]);
                                    self._reloadSheet();
                                    self._clearSelectedItem();
                                }
                                else {
                                    if (!self._validateUpdateForm()) {
                                        return;
                                    }
                                    var createdUsersInput = self._$updateForm.find('input[name=CreatedUser]').val();
                                    var createdUsers = createdUsersInput.split(',');
                                    var createdUser = createdUsers[0];
                                    for (var i = 0; i < createdUsers.length; i++) {
                                        if (createdUsers[i] != app.un) {
                                            createdUser = createdUsers[i];
                                        }
                                    }
                                    if (createdUser != app.un) {
                                        var oldNum = self._$updateForm.find('input:hidden[name=PhoneNumbers]').val();
                                        var newNum = self._$updateForm.find('input:text[name=PhoneNumbers]').val();
                                        if (oldNum != newNum) {
                                            self._closeUpdateDialog();
                                            self._createUpdateConflictDialogDiv(createdUser);
                                        }
                                        else {
                                            self._transformUpdateFormValue();
                                            self._updateTicket();
                                            self._selectedPhone = "";
                                            self._selectedCode = "";
                                            self._ctrlOn = false;
                                            self._resetCopyInfo();
                                            self._resetBookReturnInfo();
                                        }
                                    }
                                    else {
                                        self._transformUpdateFormValue();
                                        self._updateTicket();
                                        self._selectedPhone = "";
                                        self._selectedCode = "";
                                        self._ctrlOn = false;
                                        self._resetCopyInfo();
                                        self._resetBookReturnInfo();
                                    }
                                }
                            }
                            else {
                                self._transformUpdateFormValue();
                                self._updateTicket();
                                self._selectedPhone = "";
                                self._selectedCode = "";
                                self._ctrlOn = false;
                                self._resetCopyInfo();
                                self._resetBookReturnInfo();
                            }
                        }
                        if (!$.isEmptyObject(obj)) {
                            self._submitAction(obj, completeGetSheetStatus);
                        } else {
                            console.log("_checkSeatCancled: load error");
                        }
                    });
                } else if ($(b).hasClass('btn-close')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        self._clearSelectedItem();
                        self._resetSeatStack();
                        self._selectedPhone = "";
                        self._selectedCode = "";
                        self._ctrlOn = false;
                        self._closeUpdateDialog();
                    });
                } else if ($(b).hasClass('btn-eprint')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        //self._closeUpdateDialog();
                        self._printETicket();
                        self._resetAll();
                        //self._clearSelectedItem();
                        //self._resetSeatStack();
                        //self._selectedPhone = "";
                        //self._selectedCode = "";
                        //self._ctrlOn = false;
                    });
                } else if ($(b).hasClass('btn-eprint-save')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        var afterSave = function () {
                            var afterReloadSheet = function () {
                                self._printETicket();
                                self._resetAll();
                            }
                            self._reloadSheet(afterReloadSheet);
                        }
                        if (!self._validateUpdateForm()) {
                            return;
                        }
                        var ticketStatus = [];
                        $.each(self._seatStack, function (k, v) {
                            var tick = v._getCurrentTicket();
                            ticketStatus.push(tick._status);
                        });
                        ticketStatus = ticketStatus.getUnique();
                        if (ticketStatus.length > 1) {
                            self._$updateForm.find('div.message-error').html('Đã có ghế thanh toán rồi, vui lòng kiểm tra lại.');
                            self._$updateForm.find('div.message-error').show();
                            return;
                        } else {
                            var payment = self._$updateForm.find('select[name="PaymentType"]').val();
                            if (!vIsEstStr(payment)) {
                                self._$updateForm.find('div.message-error').html('Vui lòng chọn hình thức thanh toán.');
                                self._$updateForm.find('div.message-error').show();
                                return;
                            }
                        }
                        self._transformUpdateFormValue();
                        self._updateTicket(afterSave);
                        self._selectedPhone = "";
                        self._selectedCode = "";
                        self._ctrlOn = false;
                    });
                } else if ($(b).hasClass('btn-add-more-ticket')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        var afterSave = function (oldCode, fromArea, toArea) {
                            var afterReloadSheet = function () {
                                var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['TripDetailId'];
                                self._hasCopyTicket = true;
                                self._getCopyInfo(oldCode, fromArea, toArea, tripDetailId);
                            }
                            self._reloadSheet(afterReloadSheet);
                        }
                        if (!self._validateUpdateForm()) {
                            return;
                        }
                        self._transformUpdateFormValue();
                        self._updateTicket(afterSave);
                        self._selectedPhone = "";
                        self._selectedCode = "";
                        self._ctrlOn = false;
                    });
                } else if ($(b).hasClass('btn-return')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        var afterSave = function () {
                            var afterReloadSheet = function () {
                                self._hasBookReturnTicket = true;
                                self._getReturnInfo();
                            }
                            self._reloadSheet(afterReloadSheet);
                        }
                        if (!self._validateUpdateForm()) {
                            return;
                        }
                        self._transformUpdateFormValue();
                        self._updateTicket(afterSave);

                        self._selectedPhone = "";
                        self._selectedCode = "";
                        self._ctrlOn = false;
                        $('html, body').animate({
                            scrollTop: parseInt($("body").offset().top)
                        }, 500);
                    });
                }
            });
            $form.find('input[name=Fare]').not(['readonly']).on('change', function () {
                var numSeat = parseInt($form.find('input[name=NumSeat]').val());
                var deposit = 0;
                var discount = 0;
                var surcharge = 0;
                if ($form.find('input[name=Deposit]').length > 0) {
                    deposit = $form.find('input[name=Deposit]').val().toNum();
                }
                if ($form.find('input[name=Discount]').length > 0) {
                    discount = $form.find('input[name=Discount]').val().toNum();
                }
                if ($form.find('input[name=Surcharge]').length > 0) {
                    surcharge = $form.find('input[name=Surcharge]').val().toNum();
                }
                var newFare = $(this).val().toNum();
                if (newFare < 10000) {
                    newFare = newFare * 1000;
                }
                var newTotalFare = (newFare + surcharge - discount) * numSeat;
                $(this).val(newFare.toMn());
                var debt = newTotalFare - (deposit * numSeat);
                $form.find('input[name=Debt]').val(debt.toMn());
                $form.find('input[name=ToTalFare]').val(newTotalFare.toMn());
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            $form.find('input[name=Deposit]').not(['readonly']).on('change', function () {
                var deposit = $(this).val().toNum();
                if (deposit < 10000) {
                    deposit = deposit * 1000;
                }
                $(this).val(deposit.toMn());
                var discount = 0;
                var surcharge = 0;
                if ($form.find('input[name=Discount]').length > 0) {
                    discount = $form.find('input[name=Discount]').val().toNum();
                }
                if ($form.find('input[name=Surcharge]').length > 0) {
                    discount = $form.find('input[name=Surcharge]').val().toNum();
                }
                var newFare = $form.find('input[name=Fare]').val().toNum();
                var numSeat = parseInt($form.find('input[name=NumSeat]').val());
                if ($form.find('input[name=Debt]').length > 0) {
                    var debt = numSeat * (newFare + surcharge - discount) - numSeat * deposit;
                    $form.find('input[name=Debt]').val(debt.toMn());
                }
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            $form.find('input[name=Surcharge]').not(['readonly']).on('change', function () {
                var surCharge = $(this).val().toNum();
                if (surCharge < 10000) {
                    surCharge = surCharge * 1000;
                }
                $(this).val(surCharge.toMn());
                var numSeat = parseInt($form.find('input[name=NumSeat]').val());
                var newFare = $form.find('input[name=Fare]').val().toNum();
                var discount = 0;
                var deposit = 0;
                if ($form.find('input[name=Discount]').length > 0) {
                    discount = $form.find('input[name=Discount]').val().toNum();
                }
                if ($form.find('input[name=Deposit]').length > 0) {
                    deposit = $form.find('input[name=Deposit]').val().toNum();
                }
                var newTotalFare = (newFare + surCharge - discount) * numSeat;
                if ($form.find('input[name=Debt]').length > 0) {
                    var debt = newTotalFare - deposit * numSeat;
                    $form.find('input[name=Debt]').val(debt.toMn());
                }
                $form.find('input[name=ToTalFare]').val(newTotalFare.toMn());
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            $form.find('input[name=Discount]').not(['readonly']).on('change', function () {
                var discount = $(this).val().toNum();
                if (discount < 10000) {
                    discount = discount * 1000;
                }
                $(this).val(discount.toMn());
                var numSeat = parseInt($form.find('input[name=NumSeat]').val());
                var newFare = $form.find('input[name=Fare]').val().toNum();
                var surCharge = 0;
                var deposit = 0;
                if ($form.find('input[name=Surcharge]').length > 0) {
                    surCharge = $form.find('input[name=Surcharge]').val().toNum();
                }
                if ($form.find('input[name=Deposit]').length > 0) {
                    deposit = $form.find('input[name=Deposit]').val().toNum();
                }
                var newTotalFare = (newFare + surCharge - discount) * numSeat;
                if ($form.find('input[name=Debt]').length > 0) {
                    var debt = newTotalFare - deposit * numSeat;
                    $form.find('input[name=Debt]').val(debt.toMn());
                }
                $form.find('input[name=ToTalFare]').val(newTotalFare.toMn());
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            $form.find('input').not('[name=PhoneNumbers]').each(function (_, ip) {
                $(ip).focus(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._clearSuggestCustomer();
                });
            });

            self._$modal.on('shown.bs.modal', function (e) {
                $form.find('input[name=PhoneNumbers]').focus();
            });
        },
        _generateCode: function () {
            return Math.floor((Math.random() * 100000));
        },
        _getSuggestCustomer: function (text) {
            var self = this;

            // bật cờ không cho cập nhật khi nhấn nút Enter
            app.preventUpdate = true;

            // show form loading
            var $result = $('<ul />').addClass('search-items');
            $result.append($('<li>Đang tìm kiếm khách hàng, vui lòng đợi trong giây lát.........</li>'));
            self._$updateForm.find('input:text[name=PhoneNumbers]').parent().append(
                      $('<div />').addClass('dropdown-menu upform-search-result-phone')
                          .append($('<div />').addClass('search-title').append('Kết quả tìm kiếm'))
                          .append($result)
                          .append($('<div />').addClass('search-summary').append('Tổng số <span class="vblack"><b>0</b></span> kết quả'))
                );

            var obj = self._createSuggestCustomerObj(text);
            var p = function (u, r, l, t) {
                if (u != 1) return;
                //Clear search result
                self._clearSuggestCustomer();
                if (l > 0) self._mapSuggestCustomer(r, t);
                //Render UI
                self._renderSuggestCustomer();
                self._bindEventOnSuggestCustomer();
            };
            //Submit query
            self._submitAsyncAction(obj, p);
        },
        _createSuggestCustomerObj: function (text) {
            var self = this;
            var obj = {};
            obj._a = "fGetCustomer1";
            var phone = "($x like N'%" + text + "%') ORDER BY Phone ASC";
            switch (text.length) {
                case 6:
                    phone = "($x like N'" + text + "%') ORDER BY Phone ASC";
                    break;
                default:
                    break;
            }
            obj._c = {
                CompId: parseInt(self.options.cid),
                Phone: phone
            };
            //obj._f = "Id, Name, Note, Phone, BookingTicket, TotalBooking, PaidTicket, TotalPaid, CancelTicket, TotalCancel, NotComeTicket, TotalNotCome ,PassTicket, TotalPass, OpenTicket, TotalOpen, ValidTicket, TotalValid, KeepOnTimeTicket, TotalKeepOnTime";
            obj._f = "Id, Name, Note, Phone, BookingTicket, PaidTicket, CancelTicket";
            return obj;
        },
        _clearSuggestCustomer: function () {
            var self = this;
            self._suggestCustomer = [];
            self._totalSuggestCustomer = 0;
            self._$updateForm.find('div.upform-search-result-phone').remove();
        },
        _mapSuggestCustomer: function (data, total) {
            var self = this;
            self._suggestCustomer = data;
            self._totalSuggestCustomer = total;
        },
        _renderSuggestCustomer: function () {
            var self = this;
            var $result = $('<ul />').addClass('search-items');
            if (self._totalSuggestCustomer > 0) {
                $.each(self._suggestCustomer, function (_, item) {
                    if (typeof item[0] != "undefined" && item[0] != null) {
                        //var numBooked = parseInt(item[4] + item[6] + item[12] + item[18]);
                        //var numCancelled = parseInt(item[8] + item[10]);
                        //var totalMoney = parseInt(item[5] + item[7] + item[11] + item[13] + item[19]);
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
                                "<p>Đang đặt <span class='vred'><b>" + nBooking + "</b></span> ghế / Số lần đi <span class='vred'><b>" + nPaid + "</b></span> / Số lần hủy <span class='vred'><b>" + nCancel + "</b></span></p>"
                            )
                        );
                    }
                });
                self._$updateForm.find('input:text[name=PhoneNumbers]').parent().append(
                    $('<div />').addClass('dropdown-menu upform-search-result-phone')
                    .append($('<div />').addClass('search-title').append('Kết quả tìm kiếm'))
                    .append($result)
                    .append($('<div />').addClass('search-summary').append('Tổng số <span class="vblack"><b>' + self._totalSuggestCustomer + '</b></span> kết quả'))
                );
                // tự động chọn kết quả đầu tiên để hỗ trợ phím tắt tab
                self._$updateForm.find('div.upform-search-result-phone ul.search-items li:first-child').addClass('selected');
            } else {
                $result.append($('<li>Không tìm thấy kết quả phù hợp.........</li>'));
                self._$updateForm.find('input:text[name=PhoneNumbers]').parent().append(
                          $('<div />').addClass('dropdown-menu upform-search-result-phone')
                              .append($('<div />').addClass('search-title').append('Kết quả tìm kiếm'))
                              .append($result)
                              .append($('<div />').addClass('search-summary').append('Tổng số <span class="vblack"><b>0</b></span> kết quả'))
                );
            }
        },
        _bindEventOnSuggestCustomer: function () {
            var self = this;
            if (self._totalSuggestCustomer > 0) {
                var li = self._$updateForm.find('div.upform-search-result-phone li');
                li.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._$updateForm.find('input[name=CustomerId]').val($(this).attr('cid'));
                    self._$updateForm.find('input:text[name=PhoneNumbers]').val($(this).attr('cphone'));
                    self._$updateForm.find('input[name=FullName]').val($(this).attr('cname'));
                    self._clearSuggestCustomer();
                    if (_dict._hasBTWarning) {
                        self._getCustomerWarning($(this).attr('cname'), $(this).attr('cphone'), $(this).attr('cid'));
                    }
                }).hover(function (e) {
                    li.removeClass('selected');
                    $(this).addClass('selected');
                });
                self._bindArrowEventList(li);
            }
        },
        _getCustomerWarning: function (cname, cphone, cid) {
            var self = this;
            var obj = self._createCustomerWarningObj(cid);
            var completeCustomerWarning = function (u, r, l, t) {
                if (u != 1) return;
                self._clearCustomerWarning();
                if (l > 0) self._renderCustomerWarning(cname, cphone, r);
            };
            self._submitAsyncAction(obj, completeCustomerWarning);
        },
        _createCustomerWarningObj: function (cid) {
            var self = this;
            var d = self._getLimitedDate();
            var obj = {};
            obj._a = "fGetTicket";
            obj._c = {
                TripId: self._cTripId,
                CustomerId: cid,
                TripDate: "($x >= '" + d.toFormatString('iso') + "')",
                //Status: '(($x) IN(' + _dict._tks.join() + ')) ORDER BY TripDate ASC', 
                Status: '(($x) IN(' + _dict._tksUpSearch.join() + ')) ORDER BY TripDate ASC', // loại bỏ các vé đã hủy - edited by Duy
            };
            obj._f = "TripDate, SeatCode, Fare, Status";
            return obj;
        },
        _clearCustomerWarning: function () {
            var self = this;
            self._$updateForm.find('.customer-w').remove();
        },
        _renderCustomerWarning: function (cname, cphone, data) {
            var self = this;
            var $message = $('<ul />');
            var trip = [];
            var tDates = [];
            $.each(data, function (_, t) {
                var tDate = vPrsDt(t[0]);
                var sLabel = t[1].split('|')[0];
                var fare = parseInt(t[2]);
                var status = parseInt(t[3]);
                var key = tDates.indexOf(tDate.toFormatString('iso'));
                if (key == -1) {
                    key = tDates.push(tDate.toFormatString('iso')) - 1;
                }
                if (typeof trip[key] == "undefined") {
                    trip[key] = {
                        _b: {
                            _numS: 0,
                            _sCodes: [],
                            _total: 0,
                            _tname: self._data[self._cTripIndex].Name,
                            _date: tDate
                        },
                        _c: {
                            _numS: 0,
                            _sCodes: [],
                            _total: 0,
                            _tname: self._data[self._cTripIndex].Name,
                            _date: tDate
                        },
                        _p: {
                            _numS: 0,
                            _sCodes: [],
                            _total: 0,
                            _tname: self._data[self._cTripIndex].Name,
                            _date: tDate
                        },
                    }
                }
                switch (status) {
                    case 1:
                        trip[key]._b._numS++;
                        trip[key]._b._sCodes.push(sLabel);
                        trip[key]._b._total += fare;
                        break;
                    case 2:
                        trip[key]._p._numS++;
                        trip[key]._p._sCodes.push(sLabel);
                        trip[key]._p._total += fare;
                        break;
                    case 5:
                    case 8:
                        //trip[key]._b._numS++;
                        //trip[key]._b._sCodes.push(sLabel);
                        //trip[key]._b._total += fare;
                        //break;
                    case 3:
                    case 4:
                        trip[key]._c._numS++;
                        trip[key]._c._sCodes.push(sLabel);
                        trip[key]._c._total += fare;
                        break;
                }
            });
            $.each(trip, function (_, t) {
                if (typeof t != "undefined" && t != null) {
                    if (t._b._numS > 0) {
                        var tdata = {
                            "t": {
                                _sText: "Đang đặt",
                                _numS: t._b._numS,
                                _sCodes: t._b._sCodes.join(', '),
                                _total: t._b._total.toMn() + "₫",
                                _tname: t._b._tname,
                                _date: t._b._date.toFormatString('dd-mm-yyyy'),
                                _time: t._b._date.toFormatString('hh:mm')
                            }
                        };
                        $message.append(vtpl(_dict._btwarningTpl, tdata));
                    }
                    if (t._c._numS > 0) {
                        var cdata = {
                            "t": {
                                _sText: "Hủy",
                                _numS: t._c._numS,
                                _sCodes: t._c._sCodes.join(', '),
                                _total: t._c._total.toMn() + "₫",
                                _tname: t._c._tname,
                                _date: t._c._date.toFormatString('dd-mm-yyyy'),
                                _time: t._c._date.toFormatString('hh:mm')
                            }
                        };
                        $message.append(vtpl(_dict._btwarningTpl, cdata));
                    }
                    if (t._p._numS > 0) {
                        var pdata = {
                            "t": {
                                _sText: "Đã thanh toán",
                                _numS: t._p._numS,
                                _sCodes: t._p._sCodes.join(', '),
                                _total: t._p._total.toMn() + "₫",
                                _tname: t._p._tname,
                                _date: t._p._date.toFormatString('dd-mm-yyyy'),
                                _time: t._p._date.toFormatString('hh:mm')
                            }
                        };
                        $message.append(vtpl(_dict._btwarningTpl, pdata));
                    }
                }
            });

            if ($message.find('li').length > 0) {
                self._$updateForm.prepend($(vtpl(_dict._wTpl, { 'm': { _cname: cname, _cphone: cphone, _content: $('<div />').append($message).html() } })).addClass('customer-w'));
            }
        },
        _transformUpdateFormValue: function () {
            var self = this;
            var $form = self._$updateForm;

            //Change status of ticket
            var paymentType = $form.find('select[name=PaymentType]').not(":disabled").val();

            var notCome = $form.find('input[name=Notcome]').not(":disabled").prop('checked');
            var keepOnTime = $form.find('input[name=KeepOnTime]').not(":disabled").prop('checked');
            if (notCome) {
                self._changeFormToNotComeStatus();
            } else if (keepOnTime) {
                self._changeFormToKeepOnTimeStatus();
            } else {
                if (typeof paymentType != "undefined") {
                    paymentType = parseInt(paymentType);
                    if (isNaN(paymentType)) {
                        self._changeFormToBookingStatus();
                    } else {
                        switch (paymentType) {
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                            case 10:
                                self._changeFormToPaidStatus();
                                break;
                            case 9:
                                self._changeFormToPassStatus();
                                break;
                        }
                    }
                }
            }
        },
        _changeFormToPaidStatus: function () {
            var self = this;
            //Change status to paid
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(2);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
        },
        _changeFormToNotComeStatus: function () {
            var self = this;
            //Change status to not come
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(4);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
        },
        _changeFormToPassStatus: function () {
            var self = this;
            //Change status to not come
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(5);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
        },
        _changeFormToKeepOnTimeStatus: function () {
            var self = this;
            //Change status to keep on time
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(8);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
        },
        _changeFormToBookingStatus: function () {
            var self = this;
            //Change status to booking
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(1);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
        },
        _changeFormToOpenStatus: function () {
            var self = this;
            //Change status to booking
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(7);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
        },
        _changeFormToValidStatus: function () {
            var self = this;
            //Change status to booking
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(6);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
        },
        _changeFormToCancelledStatus: function () {
            var self = this;
            //Change status to booking
            var status = [];
            for (var i = 0; i < self._seatStack.length; i++) {
                status.push(3);
            }
            self._$updateForm.find('input[name=StatusInfo]').val(status.join());
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
        _showUpdateForm: function (obj, seat) {
            var self = this;
            try {
                //Prepare data
                var fObj = self._initUpdateFormData(seat);

                if (false != fObj) {
                    //Update form
                    self._resetForm(self._$updateForm);
                    self._$updateForm.find('div.message-error').html('');
                    self._$updateForm.find('div.message-error').hide();
                    self._populateFormData(fObj, self._$updateForm);
                    self._renderSeatNoDiv(fObj.SeatNo);
                    self._createRoutePoints(fObj.RoutePoints, fObj.FromArea, fObj.ToArea);

                    //Valid form
                    self._resetForm(self._$validForm);
                    //History form
                    self._renderHistoryTab(seat);
                    //Disable form fields

                    self._disableFormFields(seat);

                    self._showModal();

                    self._triggerUpdateTab();
                    self._triggerUpdateForm();
                }
            } catch (err) {
                self._showError(err);
            }
        },
        _initUpdateFormData: function (seat) {
            var self = this;
            var ticket = seat._getCurrentTicket();
            var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][self._cTripBus]['TripDetailId'];
            if ($.isEmptyObject(ticket)) {
                return false;
            }
            var fare = 0;
            var fromArea = ticket.fromArea;
            var toArea = ticket.toArea;
            if (vIsEstStr(self._copyInfo["FromArea"])) {
                fromArea = self._copyInfo["FromArea"];
            }
            if (vIsEstStr(self._copyInfo["ToArea"])) {
                toArea = self._copyInfo["ToArea"];
            }
            var idInfo = [];
            var seatNo = [];
            var customerInfo = [];
            var statusInfo = [];
            var totalFare = 0;
            var createUser = [];
            $.each(self._seatStack, function (i, v) {
                var t = v._getCurrentTicket();
                if (fare == 0 || (fare > t._fare && t._fare > 0)) fare = t._fare;
                idInfo.push(t._id);
                seatNo.push(v._label);
                customerInfo.push(t._getCustomerInfo());
                statusInfo.push(t._status);
                createUser.push(t._suser);
                totalFare += (fare + t._surCharge - t._discount);
                if (t._status != 1) {
                    t._debt = 0;
                }
            });

            var pickUpDate = new Date(ticket._pdate.getTime());
            pickUpDate.addMinutes(self._sOffsetMinute);
            var routePoints = self._data[self._cTripIndex].StopPoints['data'];
            var obj = {
                IdInfo: idInfo.join(),
                PickupDate: pickUpDate.toFormatString('dd-mm-yyyy'),
                PickupTime: pickUpDate.toFormatString('hh:mm'),
                SeatNo: seatNo,
                Code: ticket._code,
                Fare: fare.toMn(),
                Surcharge: ticket._surCharge.toMn(),
                Deposit: ticket._deposit.toMn(),
                Discount: ticket._discount.toMn(),
                Debt: (ticket._debt * self._seatStack.length).toMn(),
                CustomerId: ticket._cid,
                CustomerInfo: customerInfo.join(),
                PhoneNumbers: ticket._cphone,
                FullName: ticket._cname,
                CreatedUser: createUser,
                Note: ticket._note,
                StatusInfo: statusInfo.join(),
                //PickupInfo: ticket._pInfo,
                Serial: ticket._seri,
                Notcome: ticket._status == 4 ? true : false,
                KeepOnTime: ticket._status == 8 ? true : false,
                NumSeat: seatNo.length,
                ToTalFare: totalFare.toMn(),
                RoutePoints: routePoints,
                NumClick: 0,
                FromArea: fromArea,
                ToArea: toArea,
                SNote: ticket._sNote,
                ResponsibilityUser: ticket._responUser,
                PickOrReturnDate: ticket._porDate
            };

            //if ("" == ticket._cphone && "" == ticket._cname) {
            //    obj.FullName = self._savedCustomer.FullName;
            //    obj.PhoneNumbers = self._savedCustomer.PhoneNumbers;
            //}

            //Payment
            if (vIsEstStr(ticket._pmInfo)) {
                var pmInfo = ticket._getPaymentInfo();
                obj.PaymentType = pmInfo.type;
                switch (pmInfo.type) {
                    case 1:
                        obj.BranchName = pmInfo.info._id;
                        break;
                    case 2:
                        obj.ChargeCode = $.map(pmInfo.info, function (v) { return v; }).join('|');
                        break;
                    case 3:
                        obj.PayAddress = pmInfo.info._addr;
                        break;
                    case 4:
                        obj.DriverName = pmInfo.info._dname;
                        break;
                    case 5:
                        obj.TransCode = pmInfo.info._tcode;
                        break;
                    case 6:
                        obj.AgentName = pmInfo.info._id;
                        break;
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                        break;
                    default:
                        break;
                }
            }
            if (!vIsEstStr(obj.BranchName)) {
                var branches = [];
                self._$updateForm.find('select[name=BranchName] > option').each(function () {
                    branches.push($(this).val());
                });
                if (branches.length > 0 && branches.indexOf(self.options.aid) != -1) {
                    obj.BranchName = self.options.aid;
                }
            }
            if (!vIsEstStr(obj.AgentName)) {
                var agents = [];
                self._$updateForm.find('select[name=AgentName] > option').each(function () {
                    agents.push($(this).val());
                });
                if (agents.length > 0 && agents.indexOf(self.options.aid) != -1) {
                    obj.AgentName = self.options.aid;
                }
            }

            if (typeof obj.ChargeCode == "undefined") {
                obj.ChargeCode = _dict._pm[1][4]; //default charge code for bank transfer payment
            }

            if (vIsEstStr(ticket._pInfo)) {
                var pInfo = ticket._getPickupInfo();
                if (!$.isEmptyObject(pInfo)) {
                    switch (pInfo.type) {
                        case 'P':
                            obj.PickupInfo = pInfo.text;
                            break;
                        case 'T':
                            obj.TransferInfo = pInfo.text;
                            break;
                    }
                    obj.pIndex = null;
                    if (typeof pInfo.pIndex != "undefined") {
                        obj.pIndex = pInfo.pIndex;
                    }
                }
            }

            // nếu đang trong quá trình đặt thêm vé thì ghi đè các thông tin đã copy
            // nếu thêm vé khác chuyến sẽ không copy mã code
            if (self._hasCopyTicket && typeof _dict._copyField != "undefined") {
                $.each(_dict._copyField, function (kl, kn) {
                    if (kn != "Code") {
                        obj[kn] = self._copyInfo[kn];
                    } else {
                        var tripDetailIdOld = self._copyInfo["TripDetailId"] ? self._copyInfo["TripDetailId"] : 0;
                        if (tripDetailIdOld == tripDetailId) {
                            obj[kn] = self._copyInfo[kn];
                        }
                    }
                });
            }
            // nếu đang trong quá trình đặt vé khứ hồi thì ghi đè các thông tin cần copy
            if (self._hasBookReturnTicket && typeof _dict._returnField != "undefined") {
                $.each(_dict._returnField, function (kl, kn) {
                    obj[kn] = self._copyInfo[kn];
                });
            }
            return obj;
        },
        _populateFormData: function (data, form) {
            $.each(data, function (name, val) {
                var $el = $(form).find('[name="' + name + '"]'), type = $el.attr('type');
                switch (type) {
                    case 'checkbox':
                        $el.prop('checked', val);
                        break;
                    case 'radio':
                        $el.filter('[value="' + val + '"]').prop('checked', val);
                        break;
                    case 'label':
                        $el.text(val);
                        break;
                    default:
                        $el.val(val);
                        break;
                }
                //if (name == 'AgentName') {
                //    console.log(123);
                //    var csen = $el.next();
                //    $el.val(val);
                //    $el.trigger("liszt:updated");
                //    //csen.val(val).trigger('chosen:updated');
                //}
            });
        },
        _renderSeatNoDiv: function (data) {
            var self = this;
            var $ul = self._$modal.find('ul#seat-no').empty();
            $.each(data, function (_, s) {
                $ul.append($('<li />').addClass('list-group-item').addClass(_dict._vc[Math.floor(Math.random() * _dict._vc.length)]).text(s));
            });
        },
        _createRoutePoints: function (routePoints, fromArea, toArea) {
            var self = this;
            self._$updateForm.find('div.checkbox-route-point').empty();
            var fromId = 0;
            var toId = 0;
            if (self._cDefaultFromId != 0) {
                fromId = self._cDefaultFromId;
            }
            if (self._cDefaultToId != 0) {
                toId = self._cDefaultToId;
            }
            if (vIsEstStr(fromArea)) {
                var indFrom = fromArea.indexOf('~');
                fromId = fromArea.substr(indFrom + 1, fromArea.length).split('|')[0];
            }
            if (vIsEstStr(toArea)) {
                var indTo = fromArea.indexOf('~');
                toId = toArea.substr(indTo + 1, toArea.length).split('|')[0];
            }
            var startTime = self._cTripTime;
            var startHour = parseInt(startTime.split(':')[0]);
            var startMinute = parseInt(startTime.split(':')[1]);
            $.each(routePoints, function (k, v) {
                var hourFomat = "";
                var minuteFomat = "";
                startHour += parseInt(v.Hour);
                startMinute += parseInt(v.Minute);
                if (startMinute >= 60) {
                    startMinute = startMinute % 60;
                    startHour += 1;
                }
                if (startHour > 24) {
                    startHour = startHour % 24;
                } else if (startHour == 24) {
                    startHour = 0;
                    hourFomat = "00";
                }
                if (startHour < 10) {
                    hourFomat = "0" + startHour;
                } else if (startHour >= 10) {
                    hourFomat = startHour;
                }
                if (startMinute < 10) {
                    minuteFomat = "0" + startMinute;
                } else {
                    minuteFomat = startMinute;
                }
                var time = "";
                if (k == 0) {
                    time = self._cTripTime;
                } else {
                    time = hourFomat + ":" + minuteFomat;
                }
                var $routePoint = $('<label class="checkbox-inline" />')
                    .append($('<input type="checkbox" name="RoutePoint" data-point-id="' + v.Id + '"/>'))
                    .append($('<b />').html(v.Code))
                    .append($('<mark class="text-primary"/>').html(time));
                // nếu chỉ có hai điểm đầu cuối thì ẩn checkbox
                if (routePoints.length == 2) {
                    $routePoint.addClass('hidden');
                }
                self._$updateForm.find('div.checkbox-route-point').append($routePoint);
            });
            if (fromId == 0 && toId == 0) {
                self._$updateForm.find('div.checkbox-route-point input[name="RoutePoint"]').first().attr('checked', true);
                self._$updateForm.find('div.checkbox-route-point input[name="RoutePoint"]').last().attr('checked', true);
            } else {
                self._$updateForm.find('div.checkbox-route-point input[name="RoutePoint"][data-point-id="' + fromId + '"]').attr('checked', true);
                self._$updateForm.find('div.checkbox-route-point input[name="RoutePoint"][data-point-id="' + toId + '"]').attr('checked', true);
            }
            self._bindEventRoutePoints();
        },
        _bindEventRoutePoints: function () {
            var self = this;
            var $form = self._$updateForm;
            $form.find('input[name="RoutePoint"]').unbind().on('click', function (e) {
                var fromId = 0;
                var toId = 0;
                var fare = 0;
                var totalFare = 0;
                var numSeat = $form.find('input[name="NumSeat"]').val();
                var clicked = $form.find('input[name="NumClick"]').val();
                if ($(this).is(':checked')) {
                    var checked = $form.find('input[name="RoutePoint"][checked="checked"]');
                    if (checked.length >= 2) {
                        if (clicked != 0) {
                            $form.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                            $(this).attr('checked', true);
                            if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
                                checked = $form.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                                if (checked.length == 1) {
                                    fromId = $form.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                                    toId = checked.attr('data-point-id');
                                    fare = self._getFareQuickBook(fromId, toId);
                                }
                                totalFare = numSeat * fare;
                                $form.find('input[name="Fare"]').val(fare.toMn());
                                $form.find('input[name="ToTalFare"]').val(totalFare.toMn());
                            } else {
                                $form.find('input[name="Fare"]').val(0);
                                $form.find('input[name="ToTalFare"]').val(0);
                            }
                        } else {
                            checked = $form.find('input[name="RoutePoint"][checked="checked"]');
                            checked.last().removeAttr('checked');
                            $(this).attr('checked', true);
                            checked = $form.find('input[name="RoutePoint"][checked="checked"]');
                            if (checked.length == 2) {
                                fromId = checked.first().attr('data-point-id');
                                toId = checked.last().attr('data-point-id');
                                fare = self._getFareQuickBook(fromId, toId);
                            }
                            totalFare = numSeat * fare;
                            $form.find('input[name="Fare"]').val(fare.toMn());
                            $form.find('input[name="ToTalFare"]').val(totalFare.toMn());
                            $form.find('input[name="NumClick"]').val(1);
                        }
                    } else if (checked.length <= 1) {
                        if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint && app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                            $form.find('input[name="RoutePoint"][checked="checked"]').not(':disabled').removeAttr('checked');
                            $(this).attr('checked', true);
                            checked = $form.find('input[name="RoutePoint"][checked="checked"]').not(':disabled');
                            if (checked.length == 1) {
                                fromId = $form.find('input[name="RoutePoint"][disabled="disabled"]').first().attr('data-point-id');
                                toId = checked.attr('data-point-id');
                                fare = self._getFareQuickBook(fromId, toId);
                            }
                            totalFare = numSeat * fare;
                            $form.find('input[name="Fare"]').val(fare.toMn());
                            $form.find('input[name="ToTalFare"]').val(totalFare.toMn());
                        } else {
                            $(this).attr('checked', true);
                            checked = $form.find('input[name="RoutePoint"][checked="checked"]');
                            if (checked.length == 2) {
                                fromId = checked.first().attr('data-point-id');
                                toId = checked.last().attr('data-point-id');
                                fare = self._getFareQuickBook(fromId, toId);
                            }
                            totalFare = numSeat * fare;
                            $form.find('input[name="Fare"]').val(fare.toMn());
                            $form.find('input[name="ToTalFare"]').val(totalFare.toMn());
                        }
                    }
                } else {
                    $(this).removeAttr('checked');
                    $form.find('input[name="Fare"]').val(0);
                    $form.find('input[name="ToTalFare"]').val(0);
                    $form.find('input[name="NumClick"]').val(1);
                }
            });
        },
        _triggerUpdateTab: function () {
            this._$modal.find('ul[role=tab-list] li').not('.hidden').first().find('a').trigger('click');
        },
        _triggerUpdateForm: function () {
            this._$updateForm.find('select[name=PaymentType]').trigger('change');
        },
        _renderHistoryTab: function (seat) {
            var self = this;
            var t = seat._getCurrentTicket();
            var $c = self._$historyForm.find('tbody').empty();
            if (typeof t._hInfo != "undefined" && t._hInfo != null) {
                var h = t._parseHistoryInfo();
                if (h != null) {
                    for (var i = 0; i < h.length; i++) {
                        if (typeof h[i] != "undefined") {
                            var $r = self._createTableRow();
                            for (var j = 0; j < h[i].length; j++) {
                                $r.append($('<td />').html(h[i][j]));
                            }
                            $c.append($r);
                        }
                    }
                }
            }
        },
        _normalFormFields: function () {
            var self = this;
            self._$updateForm.find("input:disabled").prop('disabled', false);
            self._$updateForm.find("select:disabled").prop('disabled', false);
            self._$updateForm.find("textarea:disabled").prop('disabled', false);
            self._$updateForm.find('input[name="RoutePoint"]').prop('disabled', false);
            self._$validForm.find("input:disabled").prop('disabled', false);
            self._$validForm.find("select:disabled").prop('disabled', false);
            self._$modal.find('ul[role=tab-list] li').removeClass('hidden').removeClass('active');
            self._$modal.find('button').removeClass('hidden');
        },
        _disableFormFields: function (seat) {
            var self = this;
            self._normalFormFields();
            var elm = ['input', 'select', 'textarea'];
            if (self._seatStack.length > 1) { //Multiple ticket
                $.each(_dict._frule[0], function (_, r) {
                    var $form = $('#' + r[0]);
                    $.each(r[1], function (__, i) {
                        var $ip = $();
                        var index = 0;
                        while ($ip.length == 0 && index < elm.length) {
                            $ip = $form.find(elm[index] + '[name=' + i + ']');
                            index++;
                        }
                        if ($ip.length > 0) {
                            $ip.prop('disabled', true);
                        }
                    });
                });

                $.each(_dict._trule[0], function (__, tr) {
                    self._$modal.find('a[data-tab=' + tr + ']').closest('li').addClass('hidden');
                });

            }
            var fr = [];
            var ttr = [];
            var br = [];
            var info = {
                _customer: [],
                _pickUp: [],
                _note: [],
                _fare: [],
                _surCharge: [],
                _deposit: [],
                _discount: [],
                _paymentInfo: []
            };
            var fromAreas = [];
            var toAreas = [];
            var ticketStatus = [];
            var blockFields = [];
            $.each(self._seatStack, function (_, s) {
                var t = s._getCurrentTicket();

                $.each(_dict._frule[1], function (__, r) {
                    if (t._status == r[0]) {
                        // quyền được edit thông tin thanh toán cho các vé đã thanh toán
                        if (app.rights.indexOf($.rights.bEdtInfPaidTk.val) == -1) {
                            fr.push(r[1]);
                        }
                    }
                });
                $.each(_dict._trule[1], function (__, r) {
                    if (t._status == r[0]) {
                        ttr.push(r[1]);
                    }
                });
                $.each(_dict._brule[1], function (__, r) {
                    if (t._status == r[0]) {
                        br.push(r[1]);
                    }
                });

                info._customer.push(t._getCustomerInfo());

                var pInfo = t._getPickupInfo();
                var pText = "";
                if (!$.isEmptyObject(pInfo)) {
                    pText = pInfo.text;
                }
                info._pickUp.push(pText);
                info._note.push(t._note);
                info._fare.push(t._fare);
                info._surCharge.push(t._surCharge);
                info._deposit.push(t._deposit);
                info._discount.push(t._discount);
                //info._paymentInfo.push(t._getPaymentInfo());
                info._paymentInfo.push(t._pmInfo);

                fromAreas.push(t.fromArea);
                toAreas.push(t.toArea);
                ticketStatus.push(t._status);
            });
            fromAreas = fromAreas.getUnique();
            toAreas = toAreas.getUnique();
            if (fromAreas.length > 1 || toAreas.length > 1) {
                blockFields.push("RoutePoint");
            }
            ticketStatus = ticketStatus.getUnique();
            if (ticketStatus.length > 1) {
                blockFields.push("RoutePoint");
            }
            blockFields = blockFields.getUnique();
            $.each(blockFields, function (k, v) {
                switch (v) {
                    case "RoutePoint":
                        self._$updateForm.find('input[name="RoutePoint"]').prop('disabled', true);
                        break;
                    default:
                        break;
                }
            });

            fr = fr.getUnique();
            ttr = ttr.getUnique();
            br = br.getUnique();

            $.each(fr, function (__, gr) {
                $.each(gr, function (___, r) {
                    var $form = $('#' + r[0]);
                    $.each(r[1], function (____, i) {
                        var $ip = $();
                        var index = 0;
                        while ($ip.length == 0 && index < elm.length) {
                            $ip = $form.find(elm[index] + '[name=' + i + ']');
                            index++;
                        }
                        if ($ip.length > 0) {
                            $ip.prop('disabled', true);
                        }
                    });
                });
            });
            $.each(ttr, function (__, tbr) {
                $.each(tbr, function (___, r) {
                    self._$modal.find('a[data-tab=' + r + ']').closest('li').addClass('hidden');
                });
            });

            $.each(br, function (__, ibr) {
                $.each(ibr, function (___, r) {
                    var $form = $('#' + r[0]);
                    $.each(r[1], function (____, i) {
                        $form.find('button.' + i).addClass('hidden');
                    });
                });
            });

            var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
            var status = seat._tickets[seat._currentTicketIndex]._status;
            if (closedStatus == 1) {
                if (status == 2 || status == 5 || status == 3) {
                    if (typeof _dict._closedTripConf != "undefined") {
                        if (_dict._closedTripConf['UpdateForm'].length > 0) {
                            if (app.rights.indexOf($.rights.bEnBtnAtDpt.val) == -1) {
                                $.each(_dict._closedTripConf['UpdateForm'], function (k, l) {
                                    self._$modal.find('button.' + l).addClass('hidden');
                                });
                            }
                        }
                    }
                }
            }

            // disable các chặng đối với vé đã thanh toán rồi
            if (status != 1) {
                self._$updateForm.find('input[name="RoutePoint"]').prop('disabled', true);
            }

            // đang trong thao tác copy sẽ không hiện button Thêm vé và button Khứ hồi
            if (self._hasCopyTicket) {
                self._$modal.find('button.btn-add-more-ticket').addClass('hidden');
                self._$modal.find('button.btn-return').addClass('hidden');
            }
            // đang trong thao tác đặt vé khứ hồi sẽ không hiện button Thêm vé và button Khứ hồi
            if (self._hasBookReturnTicket) {
                self._$modal.find('button.btn-add-more-ticket').addClass('hidden');
                self._$modal.find('button.btn-return').addClass('hidden');
            }

            info._customer = info._customer.getUnique();
            info._pickUp = info._pickUp.getUnique();
            info._note = info._note.getUnique();
            info._fare = info._fare.getUnique();
            info._surCharge = info._surCharge.getUnique();
            info._deposit = info._deposit.getUnique();
            info._discount = info._discount.getUnique();
            info._paymentInfo = info._paymentInfo.getUnique();

            if (info._customer.length > 1) {
                self._$updateForm.find('input:text[name=PhoneNumbers]').prop('disabled', true);
                self._$updateForm.find('input[name=FullName]').prop('disabled', true);
            }

            if (info._pickUp.length > 1) {
                self._$updateForm.find('input[name=PickupInfo]').prop('disabled', true);
                self._$updateForm.find('input[name=TransferInfo]').prop('disabled', true);
                self._$updateForm.find('input[name=pIndex]').prop('disabled', true);
            }

            if (info._note.length > 1) {
                self._$updateForm.find('textarea[name=Note]').prop('disabled', true);
            }

            if (info._fare.length > 1) {
                self._$updateForm.find('input[name=Fare]').prop('disabled', true);
            }
            if (info._surCharge.length > 1) {
                self._$updateForm.find('input[name=Surcharge]').prop('disabled', true);
            }
            if (info._deposit.length > 1) {
                self._$updateForm.find('input[name=Deposit]').prop('disabled', true);
            }
            if (info._discount.length > 1) {
                self._$updateForm.find('input[name=Discount]').prop('disabled', true);
            }
            if (info._paymentInfo.length > 1) {
                self._$updateForm.find('select[name=PaymentType]').prop('disabled', true);
                self._$updateForm.find('input[name=BranchName]').prop('disabled', true);
                self._$updateForm.find('select[name=BranchName]').prop('disabled', true);
                self._$updateForm.find('input[name=ChargeCode]').prop('disabled', true);
                self._$updateForm.find('input[name=PayAddress]').prop('disabled', true);
                self._$updateForm.find('input[name=DriverName]').prop('disabled', true);
                self._$updateForm.find('input[name=TransCode]').prop('disabled', true);
                self._$updateForm.find('input[name=AgentName]').prop('disabled', true);
            }

            if (typeof _dict._hasBlockFromPoint != "undefined" && _dict._hasBlockFromPoint) {
                var firstPoint = self._$updateForm.find('div.checkbox-route-point input[name="RoutePoint"]').first();
                if (app.rights.indexOf($.rights.bUBFrtStg.val) == -1) {
                    if (!firstPoint.is(':disabled')) {
                        firstPoint.attr('disabled', true);
                    }
                }
            }

            if (!self._checkRightOnUpdateForm()) {
                self._$updateForm.find('button.btn-cancel').hide();
            } else {
                self._$updateForm.find('button.btn-cancel').show();
            }
        },
        _validateUpdateForm: function () {
            var self = this;
            var data = {
                "payment": self._$updateForm.find('select[name=PaymentType]').val(),
                "agent": self._$updateForm.find('select[name=AgentName]').val(),
                "phone": self._$updateForm.find('input:text[name=PhoneNumbers]').val(),
                "note": self._$updateForm.find('textarea[name=Note]').val(),
                "pickup": self._$updateForm.find('input[name=PickupInfo]').val(),
                "transfer": self._$updateForm.find('input[name=TransferInfo]').val(),
                "fare": vToNum(self._$updateForm.find('input[name=Fare]').val())
            };
            var isValid = false;
            var errorField = '';

            if (_dict._updateFormValidatingConditions != 'undefined') {
                for (var i = 0; i < _dict._updateFormValidatingConditions.length; i++) {
                    var conditions = _dict._updateFormValidatingConditions[i].split('&');
                    var localValid = true;
                    for (var j = 0; j < conditions.length; j++) {
                        var c = conditions[j];
                        if (c == 'phone') {
                            localValid = localValid && vIsPhone(data['phone']);
                        } else if (c.indexOf('fare') >= 0) {
                            var sourc = data[c.substring(0, c.indexOf('['))];
                            if (sourc < 0) { // giá vé nhỏ hơn 0
                                isValid = false;
                                break;
                            } else {
                                var dest = 0;
                                if (c.indexOf('[>=') >= 0) {
                                    dest = parseInt(c.substring(c.indexOf('[>=') + 3).replace(']', ''));
                                    localValid = localValid && sourc >= dest;
                                } else if (c.indexOf('[<=') >= 0) {
                                    dest = parseInt(c.substring(c.indexOf('[<=') + 3).replace(']', ''));
                                    localValid = localValid && sourc <= dest;
                                } else if (c.indexOf('[=') >= 0) {
                                    dest = parseInt(c.substring(c.indexOf('[=') + 2).replace(']', ''));
                                    localValid = localValid && sourc == dest;
                                } else if (c.indexOf('[>') >= 0) {
                                    dest = parseInt(c.substring(c.indexOf('[>') + 2).replace(']', ''));
                                    localValid = localValid && sourc > dest;
                                } else if (c.indexOf('[<') >= 0) {
                                    dest = parseInt(c.substring(c.indexOf('[<') + 2).replace(']', ''));
                                    localValid = localValid && sourc < dest;
                                }
                            }
                        } else if (c.indexOf('[') >= 0) {
                            localValid = localValid && data[c.substring(0, c.indexOf('['))] == c.substring(c.indexOf('[') + 1).replace(']', '');
                        } else {
                            localValid = localValid && vIsEstStr(data[c]);
                        }
                        if (!localValid && errorField == '') errorField = c;
                        if (c.indexOf('[') >= 0) errorField = c.substring(0, c.indexOf('['));
                    }
                    if ((vIsEstStr(data['phone']) && !vIsPhone(data['phone']))) {
                        isValid = false;
                        break;
                    }
                    isValid = isValid || localValid;
                    if (isValid) break;
                }
            }

            var $focusInput;
            if (isValid) {
                self._$updateForm.find('div.message-error').html('');
                self._$updateForm.find('div.message-error').hide();
            } else {
                switch (errorField) {
                    case 'payment':
                        $focusInput = self._$updateForm.find('select[name=PaymentType]');
                        break;
                    case 'agent':
                        $focusInput = self._$updateForm.find('select[name=AgentName]');
                        break;
                    case 'phone':
                        $focusInput = self._$updateForm.find('input:text[name=PhoneNumbers]');
                        break;
                    case 'note':
                        $focusInput = self._$updateForm.find('textarea[name=Note]');
                        break;
                    case 'pickup':
                        $focusInput = self._$updateForm.find('input[name=PickupInfo]');
                        break;
                    case 'transfer':
                        $focusInput = self._$updateForm.find('input[name=TransferInfo]');
                        break;
                    case 'fare':
                        $focusInput = self._$updateForm.find('input[name=Fare]');
                        break;
                }
                self._$updateForm.find('div.message-error').html(_dict._updateFormValidatingErrorMessage);
                self._$updateForm.find('div.message-error').show();
                if ($focusInput != null) $focusInput.focus();
                $focusInput.closest('div.col-md-6').addClass('has-error');
            }

            return isValid;
        },
        _updateTicket: function (afterSave) {
            var self = this;
            var obj = self._createUpdateTicketObj();
            if (false != obj) {
                var completeReload = function (u, r, l, t) {

                    if (u != 1) {
                        self._closeUpdateDialog();
                        return;
                    }

                    if (typeof afterSave != "undefined" && typeof afterSave === "function") {

                        // cập nhật FromArea và ToArea các ghế trong seat stack
                        self._seatToBeUpdatedReturningInfo = self._seatStack;
                        $.each(self._seatStack, function (k, l) {
                            var tick = l._getCurrentTicket();
                            tick.fromArea = (obj._d)[0].FromArea;
                            tick.toArea = (obj._d)[0].ToArea;
                        });
                        afterSave.call(this, t, (obj._d)[0].FromArea, (obj._d)[0].ToArea);
                    } else {
                        //Store history
                        var slabel = [];

                        $.each(self._seatStack, function (i, v) {
                            slabel.push(v._label);
                        });

                        self._dataToBeSavedReturningInfo.code = t;
                        if (self._seatToBeUpdatedReturningInfo.length > 0) {
                            self.updateInfoOfReturnTickets();
                        }

                        //Close dialog
                        self._closeUpdateDialog();

                        self._storeHistory(self.options.un, 'update', { '_tid': self._cTripId, '_tname': self._data[self._cTripIndex].Name, '_tdate': self._getDepartureTime(), '_s': slabel });

                        //Reset seat stack
                        self._resetSeatStack();

                        //Reload sheet
                        self._reloadSheet();
                    }
                };
                //Submit action
                //self._submitAction(obj, completeReload);
                self._submitAsyncAction(obj, completeReload);
            }
        },
        _createGetSeatStatusObj: function () {
            var self = this;
            var obj = {};
            obj._a = "fGetTicket";
            obj._c = {
                Id: self._$updateForm.find('input[name=IdInfo]').val().split(',')[0],
            };
            obj._f = "Id, TripId, Status, IsPrgHistoryInfo, Code";
            return obj;
        },
        _getTeamInfo: function () {
            var teamInfoStr = FlatObj.cTrip.TeamInfo;
            var res = "|";

            if (teamInfoStr) {
                var teamInfoArr = teamInfoStr.split('~');
                $.each(teamInfoArr, function (i, v) {
                    if (i >= 1) {
                        var teamInfoItem = v.split('|');
                        if (teamInfoItem[0] == 2) {//2=>Tài xế, 4=>phụ xe
                            /*var driverName = teamInfoItem[2];
                            var driverPhone = teamInfoItem[3]? "|"+teamInfoItem[3]: ""; */
                            res = teamInfoItem[2] + "|" + teamInfoItem[3];
                        }
                    }
                });
            }
            return res;

        },
        _createUpdateTicketObj: function () {
            var self = this;
            var d = self._convertFormDataToObj(self._$updateForm);
            var status = d.StatusInfo.split(',');
            var customerInfo = d.CustomerInfo.split(',');
            var obj = {};
            obj._a = "UpdateBookTicket";
            obj._c = [];
            obj._d = [];

            //Payment
            var paymentInfo = "";
            if (vIsEstStr(d.PaymentType)) {
                var pt = "";
                $.each(_dict._pm, function (k, t) {
                    if ("" == pt) {
                        if (t[0] == d.PaymentType) {
                            pt = t[1].vi;
                        }
                    }
                });
                var code = "";
                switch (parseInt(d.PaymentType)) {
                    case 1:
                        if (typeof _dict._hasSelectBranchPayment != "undefined" && _dict._hasSelectBranchPayment) {
                            code = self._getBranchInfo(d.BranchName);
                        } else {
                            code = self._getBranchInfo(app.aid);
                        }
                        break;
                    case 2:
                        code = d.ChargeCode;
                        break;
                    case 3:
                        code = d.PayAddress;
                        break;
                    case 4:
                        //code = d.DriverName;
                        code = self._getTeamInfo();
                        break;
                    case 5:
                        code = d.TransCode;
                        break;
                    case 6:
                        code = self._getBranchInfo(d.AgentName);
                        break;
                    case 7:
                    case 8:
                    case 9:
                        break;
                    case 10:
                        code = self._getBranchInfo(d.BranchName);
                        break;
                    default:
                        break;
                }
                paymentInfo = self._getPayment(d.PaymentType, pt, code);
            }

            $.each(self._seatStack, function (i, v) {
                var t = v._getCurrentTicket();
                //Update
                var st = status[i];
                var cInfo = customerInfo[i];
                var pickUpDate = new Date(t._pdate.getTime());
                pickUpDate.addMinutes(self._sOffsetMinute);

                obj._c.push({
                    Id: t._id,
                    TripId: self._cTripId,
                    SeatCode: v._getSeatInfo(),
                    PickupDate: pickUpDate.toFormatString('iso'),
                    Bus: self._cTripBus
                });

                self._dataToBeSavedReturningInfo.code = v._getSeatInfo();
                self._dataToBeSavedReturningInfo.date = pickUpDate.toFormatString('iso');

                var dObj = {
                    TripAlias: parseInt(self._cTripBus),
                    Status: st,
                    CustomerInfo: cInfo,
                    FromArea: fromArea,
                    ToArea: toArea
                };
                if (t._isBooking()) {
                    // FromArea & ToArea
                    var checkRoutePoints = self._$updateForm.find('input[name="RoutePoint"][checked="checked"]');
                    var fromId = checkRoutePoints.first().attr('data-point-id');
                    var fromInfo = self._data[self._cTripIndex].StopPoints.data[self._data[self._cTripIndex].StopPoints.idx[fromId]];
                    var toId = checkRoutePoints.last().attr('data-point-id');
                    var toInfo = self._data[self._cTripIndex].StopPoints.data[self._data[self._cTripIndex].StopPoints.idx[toId]];
                    var fromArea = "1~" + fromInfo.Id + "|" + fromInfo.Type + "|" + fromInfo.Code + "|" + fromInfo.Name;
                    var toArea = "1~" + toInfo.Id + "|" + toInfo.Type + "|" + toInfo.Code + "|" + toInfo.Name;

                    dObj.FromArea = fromArea;
                    dObj.ToArea = toArea;
                }
                if (vIsEstStr(t._code)) {
                    dObj.Code = t._code;
                } else {
                    if (typeof d.Code != 'undefined' && vIsEstStr(d.Code)) {
                        dObj.Code = d.Code;
                    }
                }
                if (typeof d.PhoneNumbers != "undefined" && typeof d.FullName != "undefined") {
                    dObj.CustomerInfo = self._getCustomer(d.CustomerId, d.FullName, d.PhoneNumbers);
                }
                if (typeof d.Fare != "undefined") {
                    dObj.Fare = d.Fare.toNum();
                }
                if (typeof d.Surcharge != "undefined") {
                    dObj.Surcharge = d.Surcharge.toNum();
                }
                if (typeof d.Deposit != "undefined") {
                    dObj.Deposit = d.Deposit.toNum();
                }
                if (typeof d.Discount != "undefined") {
                    dObj.Discount = d.Discount.toNum();
                }
                if (typeof d.Debt != "undefined") {
                    if (st == 1) {
                        dObj.Debt = d.Debt.toNum() / self._seatStack.length;
                    } else {
                        dObj.Debt = 0;
                    }
                }
                if (typeof d.Note != "undefined") {
                    dObj.Note = d.Note;
                }
                if (typeof d.PickupInfo != "undefined" || typeof d.TransferInfo != "undefined") {
                    dObj.PickupInfo = self._getPickupInfo(d.PickupInfo, d.TransferInfo, d.pIndex);
                }
                if (typeof d.Serial != "undefined") {
                    dObj.Serial = d.Serial;
                }
                if (typeof d.PaymentType != "undefined") {
                    if (t._isBooking() && vIsEstStr(paymentInfo)) {
                        dObj.PaymentInfo = paymentInfo;
                        dObj.UserCharge = self.options.un;
                        // ChargeDate lấy giờ server
                        //dObj.ChargeDate = new Date().addMinutes(self._sOffsetMinute).toFormatString('iso');
                    }
                }

                if (typeof d.RoundTripCode != "undefined") {
                    dObj.RoundTripCode = d.RoundTripCode;
                }
                if (typeof d.SNote != 'undefined') {
                    dObj.SNote = d.SNote;
                }
                if (typeof d.ResponsibilityUser != 'undefined') {
                    dObj.ResponsibilityUser = d.ResponsibilityUser;
                }
                if (typeof d.PickOrReturnDate != 'undefined') {
                    dObj.PickOrReturnDate = d.PickOrReturnDate;
                }
                obj._d.push(dObj);
            });
            //Save last modified customer
            //self._savedCustomer = { Id: d.CustomerId, FullName: d.FullName, PhoneNumbers: d.PhoneNumbers }
            return obj;
        },
        _quickPay: function () {
            var self = this;
            var obj = self._createObjQuickPay();

            if (false != obj) {
                var completeReload = function (u, r, l, t) {
                    if (u != 1) return;
                    //Store history
                    var slabel = [];
                    $.each(self._seatStack, function (i, v) {
                        slabel.push(v._label);
                    });
                    self._storeHistory(self.options.un, 'update', { '_tid': self._cTripId, '_tname': self._data[self._cTripIndex].Name, '_tdate': self._getDepartureTime(), '_s': slabel });

                    //Reset seat stack
                    self._resetSeatStack();

                    //Reload sheet
                    self._reloadSheet();

                };
                //Submit action
                self._submitAsyncAction(obj, completeReload);
            }
        },
        _createObjQuickPay: function () {
            var self = this;
            var obj = {};
            obj._a = "UpdateBookTicket";
            obj._c = [];
            obj._d = [];
            var d = {}
            d.PaymentType = 1; // hình thức thu tiền tại văn phòng
            //Payment
            var paymentInfo = "";
            if (vIsEstStr(d.PaymentType)) {
                var pt = "";
                $.each(_dict._pm, function (k, t) {
                    if ("" == pt) {
                        if (t[0] == d.PaymentType) {
                            pt = t[1].vi;
                        }
                    }
                });
                var code = "";
                switch (parseInt(d.PaymentType)) {
                    case 1:
                        code = self._getBranchInfo(app.aid);
                        break;
                    default:
                        break;
                }
                paymentInfo = self._getPayment(d.PaymentType, pt, code);
            }

            $.each(self._seatStack, function (i, v) {
                var t = v._getCurrentTicket();

                var pickUpDate = new Date(t._pdate.getTime());
                pickUpDate.addMinutes(self._sOffsetMinute);

                obj._c.push({
                    Id: t._id,
                    TripId: self._cTripId,
                    SeatCode: v._getSeatInfo(),
                    PickupDate: pickUpDate.toFormatString('iso'),
                    Bus: self._cTripBus
                });

                var dObj = {
                    TripAlias: parseInt(self._cTripBus),
                    Status: 2, //STATUS Paid
                };

                if (typeof d.PaymentType != "undefined") {
                    dObj.PaymentInfo = paymentInfo;
                    if (t._isBooking() && vIsEstStr(paymentInfo)) {
                        //Store usercharge
                        dObj.UserCharge = self.options.un;
                        //dObj.ChargeDate = new Date().addMinutes(self._sOffsetMinute).toFormatString('iso');
                    }
                }

                obj._d.push(dObj);
            });
            return obj;
        },

        /************************************************************************
        * THỐNG KÊ                                                               *
        *************************************************************************/
        _thongKeTheoChuyen: function () {
            var self = this;
            var tripDate = $.trim(self._cTripDate.toFormatString('dd-mm-yyyy'));
            var tripTime = $.trim(self._cTripTime);
            var tripName = $.trim(self._data[self._cTripIndex].Name);
            self._clearSheet();
            self._$cancelSheet.hide();
            self._$tripInfo.append('<h4 style="font-size: 24px;text-align: center;">Thống kê theo chuyến ' + tripName + ' ngày ' + tripDate + ' lúc ' + tripTime + '</h4>');

            // prepare data
            var tInfo = self._getCurrentTripInfo();
            var anotherFareTienKhach = tInfo._anotherFareTienKhach;
            var nameAnotherFareTienKhach = tInfo._nameAnotherFareTienKhach;
            var mainFareTienKhach = tInfo._mainFareTienKhach;
            var feeTienKhach = tInfo._feeTienKhach;
            var nameFeeTienKhach = tInfo._nameFeeTienKhach;
            var totalFareTienKhach = anotherFareTienKhach + mainFareTienKhach - feeTienKhach;
            var totalNumNotPaid = tInfo._totalNumBranchNotPaid + tInfo._numPickedProNotPaid;
            var totalNumPaid = tInfo._totalNumBranchPaid + tInfo._numPickedProPaid;
            var totalMoneyNotPaid = tInfo._totalMoneyBranchNotPaid + tInfo._moneyPickedProNotPaid;
            var totalMoneyPaid = tInfo._totalMoneyBranchPaid + tInfo._moneyPickedProPaid;
            var totalFareTienHangNotFee = tInfo._totalMoneyBranchNotPaid + tInfo._totalMoneyBranchPaid + tInfo._moneyPickedProNotPaid + tInfo._moneyPickedProPaid;
            var feeTienHang = tInfo._feeTienHang;
            var nameFeeTienHang = tInfo._nameFeeTienHang;
            var totalFareTienHang = totalFareTienHangNotFee - feeTienHang;
            var anotherFees = tInfo._anotherFee;
            var firstAnotherFee = [];
            var moreAnotherFee = [];
            var totalAnotherFee = 0;
            if (anotherFees.length > 0) {
                $.each(anotherFees, function (ni, nk) {
                    if (firstAnotherFee.length == 0) {
                        firstAnotherFee.push(nk);
                    } else {
                        moreAnotherFee.push(nk);
                    }
                    totalAnotherFee += nk._money.toNum();
                });
            } else {
                firstAnotherFee.push({
                    _index: 0,
                    _name: "",
                    _money: ''
                });
            }
            var totalFee = tInfo._tollFee + tInfo._washFee + tInfo._eatFee + totalAnotherFee;
            var totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;

            var htmlTienKhach = $('<div class="col-md-6 col-sm-12 col-xs-12 pl0"/>')
                    .append('<h4>TIỀN KHÁCH</h4>')
                    .append(_dict._tienKhachTitle);

            var htmlTienHang = $('<div class="col-md-6 col-sm-12 col-xs-12 pr0 pl0"/>')
                    .append('<h4>TIỀN HÀNG</h4>')
                    .append(_dict._tienHangTitle);

            var htmlChiPhi = $('<div class="col-md-12 col-sm-12 col-xs-12 clearfix pl0 pr0 thong-ke-tb" />')
                    .append('<h4>CHI PHÍ</h4>')
                    .append(
                '<table class="table table-bordered list-ticket thong-ke chi-phi">' +
          	        '<tbody>' +
                        '<tr>' +
            	            '<td style="width:22%;height:30px;">' +
                                '<div class="form-group col-md-12" style="margin:0;padding:0;">' +
                                    '<label class="col-md-4 col-sm-4 control-label pl0 pr0" style="line-height:30px;" for="inputEmail3">Cầu đường:</label>' +
                                    '<div class="col-md-8 col-sm-7 pl0 pr0 input-group">' +
                                        '<input name="TollFee" placeholder="" class="form-control input-sm" value="' + tInfo._tollFee.toMn() + '">' +
                                        '<div class="input-group-addon">đ</div>' +
                                    '</div>' +
                                '</div>' +
                            '</td>' +
                            '<td style="width:22%;">' +
                                '<div class="form-group col-md-12" style="margin:0;padding:0;">' +
                                    '<label class="col-md-4 col-sm-4 control-label pr0" style="line-height:30px;" for="inputEmail3">Rửa xe:</label>' +
                                    '<div class="col-md-8 col-sm-7 pl0 pr0 input-group">' +
                                        '<input name="WashFee" placeholder="" class="form-control input-sm" value="' + tInfo._washFee.toMn() + '">' +
                                        '<div class="input-group-addon">đ</div>' +
                                    '</div>' +
                                '</div>' +
                            '</td>' +
                            '<td colspan="2">' +
                	            '<div class="form-group">' +
                                    '<label class="col-sm-5 control-label" style="line-height:30px;" for="inputEmail3">Chi phí khác: <span name="TotalAnotherFee" data-total-another-fee="0">' + totalAnotherFee.toMn() + ' đ</span></label>' +
                                '</div>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
            	            '<td style="width:22%;">' +
                                '<div class="form-group col-md-12" style="margin:0;padding:0;">' +
                                    '<label class="col-md-4 col-sm-4 control-label pl0 pr0" style="line-height:30px;" for="inputEmail3">Tiền ăn:</label>' +
                                    '<div class="col-md-8 col-sm-7 pl0 pr0 input-group">' +
                                        '<input name="EatFee" placeholder="" class="form-control input-sm" value="' + tInfo._eatFee.toMn() + '">' +
                                        '<div class="input-group-addon">đ</div>' +
                                    '</div>' +
                                '</div>' +
                            '</td>' +
                            '<td>' +
                            '</td>' +
                            '<td class="another-fee">' +
                	            '<div class="form-group col-md-6 pl0">' +
                                    '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Tên chi phí:</label>' +
                                    '<div class="col-sm-7 pl0 pr0">' +
                                        '<input name="NameAnotherFee" placeholder="" class="form-control input-sm" value="' + firstAnotherFee[0]._name + '">' +
                                    '</div>' +
                                '</div>' +
                                '<div class="form-group col-md-5">' +
                                    '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Số tiền:</label>' +
                                    '<div class="col-sm-7 pl0 pr0 input-group">' +
                                        '<input name="MoneyAnotherFee" placeholder="" class="form-control input-sm" value="' + (firstAnotherFee[0]._money).toNum().toMn() + '">' +
                                        '<div class="input-group-addon">đ</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-md-1 pr0 pl0">' +
                    	            '<button name="AddMoreFee" type="button" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-plus"></i></button>' +
                                '</div>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                	        '<td colspan="4">' +
                                '<h4>TỔNG CHÍ PHÍ: <span name="TotalFee" data-total-fee="' + totalFee + '">' + totalFee.toMn() + ' đ</span></h4>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
            	            '<td colspan="4">' +
                	            '<h3>TỔNG CỘNG: <span name="TotalTotal">' + totalTotal.toMn() + ' đ</span></h3>' +
                                '<button type="button" class="btn btn-md btn-success tk-save-trip"><i class="glyphicon glyphicon-save"></i>&nbsp;LƯU</button>&nbsp;' +
                                '<button type="button" class="btn btn-md btn-primary btn-chot-phoi">CHỐT PHƠI</button>' +
                            '</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>');

            self._$sheet.addClass('thong-ke-tb')
                .append(htmlTienKhach)
                .append(htmlTienHang)
                .append(htmlChiPhi);

            // tiền khách
            var totalTic = 0;
            var totalFare = 0;
            var tBodyTienKhach = self._$sheet.find('table.tien-khach tbody');
            if (typeof tInfo._tkNumPaidPerType != "undefined") {
                $.each(tInfo._tkNumPaidPerType, function (k, v) {
                    var splitV = v.split("|");
                    var branchCode = "";
                    if (splitV[0] == "TX") {
                        branchCode = "Tài xế thu";
                    } else if (splitV[0] == "VXR") {
                        branchCode = "VeXeRe";
                    } else {
                        branchCode = splitV[0];
                    }
                    var data = {
                        _branchCode: branchCode,
                        _numTic: splitV[1] + " vé",
                        _totalFare: parseInt(splitV[2]).toMn() + " đ"
                    }
                    var $tr = $(vtpl(_dict._tienKhachInput, data));
                    tBodyTienKhach.append($tr);
                    totalTic += parseInt(splitV[1]);
                    totalFare += parseInt(splitV[2]);
                });
            }
            tBodyTienKhach.append('<tr><td><h4>Tổng cộng</h4></td><td><h4>' + totalTic + ' vé</h4></td><td name="TotalFareTicket" data-fare="' + totalFare + '"><h4>' + totalFare.toMn() + " đ" + '</h4></td></tr>');
            tBodyTienKhach.append('<tr><td style="line-height:30px;">Doanh thu khác </td><td><input type="text" name="NameAnotherFareTienKhach" placeholder="Tên doanh thu" class="form-control input-bd0 input-sm" value="' + nameAnotherFareTienKhach + '"/></td><td class="col-md-4"><div class="input-group"><input type="text" placeholder="Tổng tiền doanh thu khác" class="form-control input-bd0 input-sm" name="AnotherFareTienKhach" value="' + anotherFareTienKhach.toMn() + '"><div class="input-group-addon">đ</div></div></td></tr>');
            tBodyTienKhach.append('<tr><td style="line-height:30px;">Chi phí văn phòng </td><td><input type="text" name="NameFeeTienKhach" placeholder="Tên chi phí" class="form-control input-bd0 input-sm" value="' + nameFeeTienKhach + '"/></td><td class="col-md-4"><div class="input-group"><input type="text" placeholder="Chi phí văn phòng" class="form-control input-bd0 input-sm" name="FeeTienKhach" value="' + feeTienKhach.toMn() + '"><div class="input-group-addon">đ</div></div></td></tr>');
            tBodyTienKhach.append('<tr><td colspan="2"><h4><b>Tổng</b></h4></td><td><h4 class="totalTienKhach" data-total-tien-khach="' + (totalFare + anotherFareTienKhach - feeTienKhach) + '" style="font-weight:bold;"><b>' + (totalFare + anotherFareTienKhach - feeTienKhach).toMn() + " đ" + '</b></h4></td></tr>');

            // tiền hàng
            var tBodyTienHang = self._$sheet.find('table.tien-hang tbody');
            if (typeof tInfo._branchProduct != "undefined" && tInfo._branchProduct.length > 0) {
                $.each(tInfo._branchProduct, function (v, b) {
                    var dat = {
                        _branchCode: b._branchCode,
                        _numBranchProPaid: b._numBranchProPaid,
                        _moneyBranchProPaid: b._moneyBranchProPaid.toMn(),
                        _numBranchProNotPaid: b._numBranchProNotPaid,
                        _moneyBranchProNotPaid: b._moneyBranchProNotPaid.toMn(),
                        _totalMoneyBranchFormat: (b._moneyBranchProPaid + b._moneyBranchProNotPaid).toMn()
                    }
                    var $tt = $(vtpl(_dict._tienHangInput, dat));
                    tBodyTienHang.append($tt);
                });
            } else {
                if (typeof tInfo._branchReceiveProduct != "undefined") {
                    $.each(tInfo._branchReceiveProduct, function (va, ba) {
                        var dataa = {
                            _branchCode: ba._code,
                            _numBranchProPaid: 0,
                            _moneyBranchProPaid: 0,
                            _numBranchProNotPaid: 0,
                            _moneyBranchProNotPaid: 0,
                            _totalMoneyBranchFormat: 0
                        }
                        var $tta = $(vtpl(_dict._tienHangInput, dataa));
                        tBodyTienHang.append($tta);
                    });
                }
            }

            tBodyTienHang.append('<tr><td style="line-height:30px;">Dọc đường</td>' +
                    '<td><div class="input-group col-md-12"><input name="PickedPaid" type="text" placeholder="Đã TT" class="form-control input-bd0 input-sm" value="' + tInfo._moneyPickedProPaid.toMn() + '"><div class="input-group-addon">đ</div></div></td>' +
                    '<td style="width:60px;"><input name="NumPickedPaid" type="text" placeholder="SL" class="form-control input-bd0 input-sm" value="' + tInfo._numPickedProPaid + '"></td>' +
                    '<td><div class="input-group col-md-12"><input name="PickedNotPaid" type="text" placeholder="Chưa TT" class="form-control input-bd0 input-sm" value="' + tInfo._moneyPickedProNotPaid.toMn() + '"><div class="input-group-addon">đ</div></div></td>' +
                    '<td style="width:60px;"><input name="NumPickedNotPaid" type="text" placeholder="SL" class="form-control input-bd0 input-sm" value="' + tInfo._numPickedProNotPaid + '"></td>' +
                    '<td name="TotalFarePicked" style="line-height:30px;">' + (tInfo._moneyPickedProNotPaid + tInfo._moneyPickedProPaid).toMn() + ' đ</td>' +
                '</tr>');
            tBodyTienHang.append('<tr><td><h4>Tổng cộng</h4></td><td><h4 data-total-paid="' + totalMoneyPaid + '" class="totalPaid">' + totalMoneyPaid.toMn() + ' đ</h4></td><td><h4 class="totalCountPaid">' + totalNumPaid + '</h4></td><td><h4 data-total-not-paid="' + totalMoneyNotPaid + '" class="totalNotPaid">' + totalMoneyNotPaid.toMn() + ' đ</h4></td><td><h4 class="totalCountNotPaid">' + totalNumNotPaid + '</h4></td><td><h4 class="totalTienHangNotFee" data-total-tien-hang-not-fee="' + totalFareTienHangNotFee + '">' + totalFareTienHangNotFee.toMn() + ' đ</h4></td></tr>');
            tBodyTienHang.append('<tr><td style="line-height:30px;">Chi phí hàng</td><td colspan="4"><input name="NameFeeTienHang" type="text" class="form-control input-bd0 input-sm" placeholder="Tên chi phí" value="' + nameFeeTienHang + '"/></td><td><div class="input-group"><input name="FeeTienHang" type="text" class="form-control input-bd0 input-sm" value="' + feeTienHang.toMn() + '"><div class="input-group-addon">đ</div></div></td></tr>');
            tBodyTienHang.append('<tr><td colspan="5" style="line-height:30px;"><h4 style="font-weight:bold;">Tổng</h4></td><td><h4 style="font-weight:bold;" class="totalTienHang" data-total-tien-hang="' + totalFareTienHang + '">' + totalFareTienHang.toMn() + ' đ</h4></td></tr>');

            // chi phí khác
            if (moreAnotherFee.length > 0) {
                $.each(moreAnotherFee, function (fa, fs) {
                    self._$sheet.find('td.another-fee').append('<div class="form-group col-md-6 pl0 mt10">' +
                            '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Tên chi phí:</label>' +
                            '<div class="col-sm-7 pl0 pr0">' +
                            '<input name="NameAnotherFee" placeholder="" class="form-control input-sm" value="' + fs._name + '">' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-5 mt10">' +
                            '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Số tiền:</label>' +
                            '<div class="col-sm-7 pl0 pr0 input-group">' +
                                '<input name="MoneyAnotherFee" placeholder="" class="form-control input-sm" value="' + fs._money.toNum().toMn() + '">' +
                                '<div class="input-group-addon">đ</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-1 pr0 pl0 mt10">' +
                    	    '<button name="RemoveMoreFee" type="button" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-remove"></i></button>' +
                        '</div>');
                });
            }
            var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
            if (closedStatus == 2 && app.rights.indexOf('5|10095|1') == -1) {
                self._$sheet.find('input,button').prop('disabled', 'disabled');
                self._$sheet.find('button.tk-save-trip,button.btn-chot-phoi').addClass('hidden');
            }

            self._bindEventTKTienKhach();
            self._bindEventTKTienHang();
            self._bindEventTKChiPhi();
        },
        _bindEventTKTienKhach: function () {
            var self = this;
            var totalFareTicket = self._$sheet.find('td[name="TotalFareTicket"]').attr('data-fare').toNum();
            var totalTotal = 0;
            var totalFareTienKhach = 0;
            self._$sheet.find('input[name="AnotherFareTienKhach"]').on('change', function () {
                var feeTienKhach = self._$sheet.find('input[name="FeeTienKhach"]').val().replace(/\./g, '').toNum();
                var fare = $(this).val().replace(/\./g, '').toNum();
                if (fare < 10000) {
                    fare = fare * 1000;
                }
                var totalFareTienHang = self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
                var totalFee = self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
                if (fare > 0) {
                    $(this).val(fare.toMn());
                    totalFareTienKhach = fare + totalFareTicket - feeTienKhach;
                } else {
                    $(this).val(0);
                    totalFareTienKhach = totalFareTicket - feeTienKhach;
                }
                totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;
                self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach', totalFareTienKhach);
                self._$sheet.find('h4.totalTienKhach').text(totalFareTienKhach.toMn() + " đ");
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="FeeTienKhach"]').on('change', function () {
                var fee = $(this).val().replace(/\./g, '').toNum();
                var anotherFareTienKhach = self._$sheet.find('input[name="AnotherFareTienKhach"]').val().replace(/\./g, '').toNum();
                if (fee < 10000) {
                    fee = fee * 1000;
                }
                totalFareTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                var totalFareTienHang = self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
                var totalFee = self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
                if (fee > 0) {
                    $(this).val(fee.toMn());
                    totalFareTienKhach = totalFareTicket + anotherFareTienKhach - fee;
                } else {
                    $(this).val(0);
                    totalFareTienKhach = totalFareTicket + anotherFareTienKhach;
                }
                totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;
                self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach', totalFareTienKhach);
                self._$sheet.find('h4.totalTienKhach').text(totalFareTienKhach.toMn() + " đ");
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });
        },
        _bindEventTKTienHang: function () {
            var self = this;
            var branchNotPaid = 0;
            var branchPaid = 0;
            var totalFareBranch = 0;
            var pickedPaid = 0;
            var pickedNotPaid = 0;
            var totalFarePicked = 0;
            var totalNotPaid = 0;
            var totalPaid = 0;
            var feeTienHang = 0;
            var totalTienHangNotFee = 0;
            var totalTienHang = 0;
            var totalTotal = 0;
            self._$sheet.find('input[name="BranchNotPaid"]').on('change', function () {
                var that = $(this);
                var totalFareTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                var totalFee = self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
                branchNotPaid = $(this).val().replace(/\./g, '').toNum();
                branchPaid = that.closest('tr').find('input[name="BranchPaid"]').val().replace(/\./g, '').toNum();
                pickedNotPaid = self._$sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
                totalPaid = self._$sheet.find('h4.totalPaid').attr('data-total-paid').toNum();
                feeTienHang = self._$sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
                if (branchNotPaid < 10000) {
                    branchNotPaid = branchNotPaid * 1000;
                }
                if (branchNotPaid > 0) {
                    $(this).val(branchNotPaid.toMn());
                    totalFareBranch = branchNotPaid + branchPaid;
                } else {
                    $(this).val(0);
                    totalFareBranch = branchPaid;
                }
                var totaNotPaid = 0;
                $.each(self._$sheet.find('input[name="BranchNotPaid"]'), function (l, el) {
                    var fa = $(el).val().replace(/\./g, '').toNum();
                    totaNotPaid += fa;
                });
                totalNotPaid = totaNotPaid + pickedNotPaid;
                totalTienHangNotFee = totalNotPaid + totalPaid;
                totalTienHang = totalTienHangNotFee - feeTienHang;
                totalTotal = totalFareTienKhach + totalTienHang - totalFee;
                that.closest('tr').find('td[name="TotalFareBranch"]').text(totalFareBranch.toMn() + " đ");
                self._$sheet.find('h4.totalNotPaid').text(totalNotPaid.toMn() + " đ");
                self._$sheet.find('h4.totalNotPaid').attr('data-total-not-paid', totalNotPaid);
                self._$sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
                self._$sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
                self._$sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
                self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="BranchPaid"]').on('change', function () {
                var that = $(this);
                var totalFareTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                var totalFee = self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
                branchPaid = $(this).val().replace(/\./g, '').toNum();
                branchNotPaid = that.closest('tr').find('input[name="BranchNotPaid"]').val().replace(/\./g, '').toNum();
                pickedPaid = self._$sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
                totalNotPaid = self._$sheet.find('h4.totalNotPaid').attr('data-total-not-paid').toNum();
                feeTienHang = self._$sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
                if (branchPaid < 10000) {
                    branchPaid = branchPaid * 1000;
                }
                if (branchPaid > 0) {
                    $(this).val(branchPaid.toMn());
                    totalFareBranch = branchNotPaid + branchPaid;
                } else {
                    $(this).val(0);
                    totalFareBranch = branchNotPaid;
                }
                var totaPaid = 0;
                $.each(self._$sheet.find('input[name="BranchPaid"]'), function (l, el) {
                    var fa = $(el).val().replace(/\./g, '').toNum();
                    totaPaid += fa;
                });
                totalPaid = totaPaid + pickedPaid;
                totalTienHangNotFee = totalNotPaid + totalPaid;
                totalTienHang = totalTienHangNotFee - feeTienHang;
                totalTotal = totalFareTienKhach + totalTienHang - totalFee;
                that.closest('tr').find('td[name="TotalFareBranch"]').text(totalFareBranch.toMn() + " đ");
                self._$sheet.find('h4.totalPaid').text(totalPaid.toMn() + " đ");
                self._$sheet.find('h4.totalPaid').attr('data-total-paid', totalPaid);
                self._$sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
                self._$sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
                self._$sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
                self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="PickedPaid"]').on('change', function () {
                var totalFareTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                var totalFee = self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
                pickedPaid = $(this).val().replace(/\./g, '').toNum();
                pickedNotPaid = self._$sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
                totalNotPaid = self._$sheet.find('h4.totalNotPaid').attr('data-total-not-paid').toNum();
                feeTienHang = self._$sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
                if (pickedPaid < 10000) {
                    pickedPaid = pickedPaid * 1000;
                }
                if (pickedPaid > 0) {
                    $(this).val(pickedPaid.toMn());
                    totalFarePicked = pickedNotPaid + pickedPaid;
                } else {
                    $(this).val(0);
                    totalFarePicked = pickedNotPaid;
                }
                var totaPaid = 0;
                $.each(self._$sheet.find('input[name="BranchPaid"]'), function (lk, lj) {
                    var fi = $(lj).val().replace(/\./g, '').toNum();
                    totaPaid += fi;
                });
                totalPaid = pickedPaid + totaPaid;
                totalTienHangNotFee = totalNotPaid + totalPaid;
                totalTienHang = totalTienHangNotFee - feeTienHang;
                totalTotal = totalFareTienKhach + totalTienHang - totalFee;
                self._$sheet.find('td[name="TotalFarePicked"]').text(totalFarePicked.toMn() + " đ");
                self._$sheet.find('h4.totalPaid').text(totalPaid.toMn() + " đ");
                self._$sheet.find('h4.totalPaid').attr('data-total-paid', totalPaid);
                self._$sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
                self._$sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
                self._$sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
                self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="PickedNotPaid"]').on('change', function () {
                var totalFareTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                var totalFee = self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
                pickedNotPaid = $(this).val().replace(/\./g, '').toNum();
                pickedPaid = self._$sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
                totalPaid = self._$sheet.find('h4.totalPaid').attr('data-total-paid').toNum();
                feeTienHang = self._$sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
                if (pickedNotPaid < 10000) {
                    pickedNotPaid = pickedNotPaid * 1000;
                }
                if (pickedNotPaid > 0) {
                    $(this).val(pickedNotPaid.toMn());
                    totalFarePicked = pickedNotPaid + pickedPaid;
                } else {
                    $(this).val(0);
                    totalFarePicked = pickedPaid;
                }
                var totaNotPaid = 0;
                $.each(self._$sheet.find('input[name="BranchNotPaid"]'), function (ki, kl) {
                    var fk = $(kl).val().replace(/\./g, '').toNum();
                    totaNotPaid += fk;
                });
                totalNotPaid = pickedNotPaid + totaNotPaid;
                totalTienHangNotFee = totalNotPaid + totalPaid;
                totalTienHang = totalTienHangNotFee - feeTienHang;
                totalTotal = totalFareTienKhach + totalTienHang - totalFee;
                self._$sheet.find('td[name="TotalFarePicked"]').text(totalFarePicked.toMn() + " đ");
                self._$sheet.find('h4.totalNotPaid').attr('data-total-not-paid', totalNotPaid);
                self._$sheet.find('h4.totalNotPaid').text(totalNotPaid.toMn() + " đ");
                self._$sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
                self._$sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
                self._$sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
                self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="NumBranchNotPaid"]').on('change', function () {
                var totalNumBranchNotPaid = 0;
                $.each(self._$sheet.find('input[name="NumBranchNotPaid"]'), function (kj, kl) {
                    var ft = $(kl).val().toNum();
                    totalNumBranchNotPaid += ft;
                });
                var numPickedNotPaid = self._$sheet.find('input[name="NumPickedNotPaid"]').val().toNum();
                self._$sheet.find('h4.totalCountNotPaid').text(totalNumBranchNotPaid + numPickedNotPaid);
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="NumPickedNotPaid"]').on('change', function () {
                var totalNumBranchNotPaid = 0;
                $.each(self._$sheet.find('input[name="NumBranchNotPaid"]'), function (kj, kl) {
                    var ft = $(kl).val().toNum();
                    totalNumBranchNotPaid += ft;
                });
                var numPickedNotPaid = $(this).val().toNum();
                self._$sheet.find('h4.totalCountNotPaid').text(totalNumBranchNotPaid + numPickedNotPaid);
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="NumBranchPaid"]').on('change', function () {
                var totalNumBranchPaid = 0;
                $.each(self._$sheet.find('input[name="NumBranchPaid"]'), function (kj, kl) {
                    var ft = $(kl).val().toNum();
                    totalNumBranchPaid += ft;
                });
                var numPickedPaid = self._$sheet.find('input[name="NumPickedPaid"]').val().toNum();
                self._$sheet.find('h4.totalCountPaid').text(totalNumBranchPaid + numPickedPaid);
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="NumPickedPaid"]').on('change', function () {
                var totalNumBranchPaid = 0;
                $.each(self._$sheet.find('input[name="NumBranchPaid"]'), function (kj, kl) {
                    var ft = $(kl).val().toNum();
                    totalNumBranchPaid += ft;
                });
                var numPickedPaid = $(this).val().toNum();
                self._$sheet.find('h4.totalCountPaid').text(totalNumBranchPaid + numPickedPaid);
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="FeeTienHang"]').on('change', function () {
                var totalFareTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                var totalFee = self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
                totalTienHangNotFee = self._$sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee').toNum();
                feeTienHang = $(this).val().replace(/\./g, '').toNum();
                if (feeTienHang < 10000) {
                    feeTienHang = feeTienHang * 1000;
                }
                if (feeTienHang > 0) {
                    $(this).val(feeTienHang.toMn());
                    totalTienHang = totalTienHangNotFee - feeTienHang;
                } else {
                    $(this).val(0);
                    totalTienHang = totalTienHangNotFee;
                }
                totalTotal = totalFareTienKhach + totalTienHang - totalFee;
                self._$sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
                self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });
        },
        _bindEventTKChiPhi: function () {
            var self = this;
            var tollFee = 0;
            var washFee = 0;
            var eatFee = 0;
            var totalFee = 0;
            var totalTienKhach = 0;
            var totalTienHang = 0;
            var totalAnotherFee = 0;
            var totalTotal = 0;
            self._$sheet.find('input[name="TollFee"]').on('change', function () {
                tollFee = $(this).val().replace(/\./g, '').toNum();
                if (tollFee < 10000) {
                    tollFee = tollFee * 1000;
                }
                washFee = self._$sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
                eatFee = self._$sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
                totalTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                totalTienHang = self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
                totalAnotherFee = self._$sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee').toNum();
                if (tollFee > 0) {
                    $(this).val(tollFee.toMn());
                } else {
                    $(this).val('');
                }
                totalFee = tollFee + washFee + eatFee + totalAnotherFee;
                totalTotal = totalTienKhach + totalTienHang - totalFee;
                self._$sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
                self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="WashFee"]').on('change', function () {
                washFee = $(this).val().replace(/\./g, '').toNum();
                if (washFee < 10000) {
                    washFee = washFee * 1000;
                }
                tollFee = self._$sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
                eatFee = self._$sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
                totalTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                totalTienHang = self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
                totalAnotherFee = self._$sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee').toNum();
                if (washFee > 0) {
                    $(this).val(washFee.toMn());
                } else {
                    $(this).val('');
                }
                totalFee = tollFee + washFee + eatFee + totalAnotherFee;
                totalTotal = totalTienKhach + totalTienHang - totalFee;
                self._$sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
                self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('input[name="EatFee"]').on('change', function () {
                eatFee = $(this).val().replace(/\./g, '').toNum();
                if (eatFee < 10000) {
                    eatFee = eatFee * 1000;
                }
                tollFee = self._$sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
                washFee = self._$sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
                totalTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                totalTienHang = self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
                totalAnotherFee = self._$sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee').toNum();
                if (eatFee > 0) {
                    $(this).val(eatFee.toMn());
                } else {
                    $(this).val('');
                }
                totalFee = tollFee + washFee + eatFee + totalAnotherFee;
                totalTotal = totalTienKhach + totalTienHang - totalFee;
                self._$sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
                self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('button[name="AddMoreFee"]').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var hasError = true;
                $.each(self._$sheet.find('input[name="NameAnotherFee"]'), function (kb, kc) {
                    if ($(kc).val() == '') {
                        hasError = false;
                        $(kc).closest('div').addClass('has-error');
                    } else {
                        $(kc).closest('div').removeClass('has-error');
                    }
                });
                $.each(self._$sheet.find('input[name="MoneyAnotherFee"]'), function (kbb, kcc) {
                    if ($(kcc).val().replace(/\./g, '').toNum() == 0) {
                        hasError = false;
                        $(kcc).closest('div').addClass('has-error');
                    } else {
                        $(kcc).closest('div').removeClass('has-error');
                    }
                });
                if (hasError) {
                    $(this).closest('td.another-fee').append('<div class="form-group col-md-6 pl0 mt10">' +
                            '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Tên chi phí:</label>' +
                            '<div class="col-sm-7 pl0 pr0">' +
                            '<input name="NameAnotherFee" placeholder="" class="form-control input-sm">' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-5 mt10">' +
                            '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Số tiền:</label>' +
                            '<div class="col-sm-7 pl0 pr0 input-group">' +
                                '<input name="MoneyAnotherFee" placeholder="" class="form-control input-sm" value="0">' +
                                '<div class="input-group-addon">đ</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-1 pr0 pl0 mt10">' +
                    	    '<button name="RemoveMoreFee" type="button" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-remove"></i></button>' +
                        '</div>');
                    self._bindEventAnotherFee();
                }
            });

            self._$sheet.find('button.tk-save-trip').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self._tkSaveTrip();
            });

            self._$sheet.find('button.btn-chot-phoi').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var closedStatus = self._data[self._cTripIndex].Ts[self._cTripTime][0]['ClosedStatus'];
                var tInfo = self._getCurrentTripInfo();
                if (closedStatus != 1) {
                    self._showPopModal("Xe chưa xuất bến, không thể chốt phơi. Vui lòng kiểm tra lại.");
                    return;
                }
                if (tInfo._numBooking > 0) {
                    self._showPopModal("Còn vé đặt chỗ, vui lòng chuyển thanh toán hoặc hủy rồi thực hiện chốt phơi lại.");
                    return;
                }
                var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
                if (typeof tripDetailId == "undefined") {
                    self._showPopModal("Chuyến này chưa được đặt vé. Vui lòng kiểm tra lại.");
                    return;
                }
                self._createChotPhoiDialogDiv();
            });

            self._bindEventAnotherFee();
        },
        _bindEventAnotherFee: function () {
            var self = this;
            self._$sheet.find('input[name="MoneyAnotherFee"]').on('change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var tollFee = self._$sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
                var washFee = self._$sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
                var eatFee = self._$sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
                var totalTienKhach = self._$sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
                var totalTienHang = self._$sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
                var fare = $(this).val().replace(/\./g, '').toNum();
                if (fare < 10000) {
                    fare = fare * 1000;
                }
                if (fare > 0) {
                    $(this).val(fare.toMn());
                } else {
                    $(this).val('');
                }
                var totalAnotherFee = 0;
                $.each(self._$sheet.find('input[name="MoneyAnotherFee"]'), function (kl, kj) {
                    var fk = $(kj).val().replace(/\./g, '').toNum();
                    totalAnotherFee += fk;
                });
                var totalFee = tollFee + washFee + eatFee + totalAnotherFee;
                var totalTotal = totalTienHang + totalTienKhach - totalFee;
                self._$sheet.find('span[name="TotalAnotherFee"]').text(totalAnotherFee.toMn() + " đ");
                self._$sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee', totalAnotherFee);
                self._$sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
                self._$sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
                self._$sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$sheet.find('button[name="RemoveMoreFee"]').on('click', function (e) {
                var that = $(this).closest('div');
                var preEle = that.prev();
                var preElest = preEle.prev();
                that.remove();
                preEle.remove();
                preElest.remove();
            });
        },
        _tkSaveTrip: function () {
            var self = this;
            var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
            var tInfo = self._getCurrentTripInfo();
            var d = {}
            var obj = {
                _a: "UpTrip",
                _c: { Id: tripDetailId }
            }
            var tripRevenue = {
                branchCost: 0,
                alongRoadCost: 0,
                productCost: 0,
                moneyOfPassenger: 0,
                alongRoadMoneyOfPassenger: 0,
                paidProductMoney: 0,
                unpaidProductMoney: 0,
                alongRoadProductMoney: 0,
            };

            // cột PassengerMoney: 1~Main|Another|Fee
            var mainPassengerMoney = tInfo._mainFareTienKhach;
            var anotherFareTienKhach = self._$sheet.find('input[name="AnotherFareTienKhach"]').val().replace(/\./g, '').toNum();
            var nameAnotherFareTienKhach = self._$sheet.find('input[name="NameAnotherFareTienKhach"]').val();
            var feeTienKhach = self._$sheet.find('input[name="FeeTienKhach"]').val().replace(/\./g, '').toNum();
            var nameFeeTienKhach = self._$sheet.find('input[name="NameFeeTienKhach"]').val();
            if (anotherFareTienKhach > 0) {
                if (nameAnotherFareTienKhach == '') {
                    self._showPopModal("Vui lòng nhập tên doanh thu khác.");
                    return;
                }
            } else {
                if (nameAnotherFareTienKhach != '') {
                    self._showPopModal("Doanh thu " + nameAnotherFareTienKhach + " phải lớn hơn 0.");
                    return;
                }
            }
            if (feeTienKhach > 0) {
                if (nameFeeTienKhach == '') {
                    self._showPopModal("Vui lòng nhập tên chi phí văn phòng.");
                    return;
                }
            } else {
                if (nameFeeTienKhach != '') {
                    self._showPopModal("Chi phí " + nameFeeTienKhach + " phải lớn hơn 0.");
                    return;
                }
            }
            d.PassengerMoney = "1~" + mainPassengerMoney + "|" + nameAnotherFareTienKhach + "##" + anotherFareTienKhach + "|" + nameFeeTienKhach + "##" + feeTienKhach;
            // cột ProductMoney: 1~BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid,BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid~NumPickedPaid|MoneyPickedPaid##NumPickedNotPaid|MoneyPickedNotPaid
            var branchProduct = [];
            $.each(self._$sheet.find('table.thong-ke.tien-hang tbody tr.branch-pro'), function (ak, al) {
                var fa = $(al);
                var branchCode = fa.find('td[name="BranchCode"]').attr('data-branch-code');
                var branchNotPaid = fa.find('input[name="BranchNotPaid"]').val().replace(/\./g, '').toNum();
                var numBranchNotPaid = fa.find('input[name="NumBranchNotPaid"]').val();
                var branchPaid = fa.find('input[name="BranchPaid"]').val().replace(/\./g, '').toNum();
                var numBranchPaid = fa.find('input[name="NumBranchPaid"]').val();
                branchProduct.push(branchCode + ':' + numBranchPaid + "|" + branchPaid + "##" + numBranchNotPaid + "|" + branchNotPaid);
            });
            var pickedNotPaid = self._$sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
            var numPickedNotPaid = self._$sheet.find('input[name="NumPickedNotPaid"]').val();
            var pickedPaid = self._$sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
            var numPickedPaid = self._$sheet.find('input[name="NumPickedPaid"]').val();
            // chi phí tiền hàng
            var feeTienHang = self._$sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
            var nameFeeTienHang = self._$sheet.find('input[name="NameFeeTienHang"]').val();
            if (feeTienHang > 0) {
                if (nameFeeTienHang == '') {
                    self._showPopModal("Vui lòng nhập tên chi phí hàng hóa.");
                    return;
                }
            } else {
                if (nameFeeTienHang != '') {
                    self._showPopModal("Chi phí " + nameFeeTienHang + " phải lớn hơn 0.");
                    return;
                }
            }
            d.ProductMoney = "1~" + branchProduct.join(',') +
                "~" + numPickedPaid + "|" + pickedPaid + "##" + numPickedNotPaid + "|" + pickedNotPaid + '~' + nameFeeTienHang + "##" + feeTienHang;
            // cột FeeMoney: 1~TollFee|WashFee|EatFee|AnotherFee
            // AnotherFee: index|NameAnotherFee|MoneyAnotherFee##index|NameAnotherFee|MoneyAnotherFee
            var tollFee = self._$sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
            var washFee = self._$sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
            var eatFee = self._$sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
            var anotherFee = [];
            var ind = 1;
            $.each(self._$sheet.find('input[name="NameAnotherFee"]'), function (ku, km) {
                var fs = $(km);
                var _index = ind;
                var _name = fs.val();
                var _money = fs.closest('div.form-group').next('div').find('input[name="MoneyAnotherFee"]').val().replace(/\./g, '').toNum();
                anotherFee.push(_index + "|" + _name + "|" + _money);
                ind++;
            });
            d.FeeMoney = "1~" + tollFee + "~" + washFee + "~" + eatFee + "~" + anotherFee.join('##');
            obj._d = d;
            var completeRequest = function (u, r, l, t) {
                if (u == 1) self._showPopModal("Lưu thành công.");
            };
            self._submitAction(obj, completeRequest);
        },
        _chotPhoi: function () {
            var self = this;
            var tripDetailId = self._data[self._cTripIndex].Ts[self._cTripTime][0]['TripDetailId'];
            var tInfo = self._getCurrentTripInfo();
            var d = {}
            var obj = {
                _a: "UpTrip",
                _c: { Id: tripDetailId }
            }
            // cột PassengerMoney: 1~Main|Another|Fee
            var mainPassengerMoney = tInfo._mainFareTienKhach;
            var anotherFareTienKhach = self._$sheet.find('input[name="AnotherFareTienKhach"]').val().replace(/\./g, '').toNum();
            var feeTienKhach = self._$sheet.find('input[name="FeeTienKhach"]').val().replace(/\./g, '').toNum();
            d.PassengerMoney = "1~" + mainPassengerMoney + "|" + anotherFareTienKhach + "|" + feeTienKhach;
            // cột ProductMoney: 1~BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid,BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid~NumPickedPaid|MoneyPickedPaid##NumPickedNotPaid|MoneyPickedNotPaid
            var branchProduct = [];
            $.each(self._$sheet.find('table.thong-ke.tien-hang tbody tr.branch-pro'), function (ak, al) {
                var fa = $(al);
                var branchCode = fa.find('td[name="BranchCode"]').attr('data-branch-code');
                var branchNotPaid = fa.find('input[name="BranchNotPaid"]').val().replace(/\./g, '').toNum();
                var numBranchNotPaid = fa.find('input[name="NumBranchNotPaid"]').val();
                var branchPaid = fa.find('input[name="BranchPaid"]').val().replace(/\./g, '').toNum();
                var numBranchPaid = fa.find('input[name="NumBranchPaid"]').val();
                branchProduct.push(branchCode + ':' + numBranchPaid + "|" + branchPaid + "##" + numBranchNotPaid + "|" + branchNotPaid);
            });
            var pickedNotPaid = self._$sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
            var numPickedNotPaid = self._$sheet.find('input[name="NumPickedNotPaid"]').val();
            var pickedPaid = self._$sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
            var numPickedPaid = self._$sheet.find('input[name="NumPickedPaid"]').val();
            // chi phí tiền hàng
            var feeTienHang = self._$sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
            d.ProductMoney = "1~" + branchProduct.join(',') +
                "~" + numPickedPaid + "|" + pickedPaid + "##" + numPickedNotPaid + "|" + pickedNotPaid + '~' + feeTienHang;
            // cột FeeMoney: 1~TollFee|WashFee|EatFee|AnotherFee
            // AnotherFee: index|NameAnotherFee|MoneyAnotherFee##index|NameAnotherFee|MoneyAnotherFee
            var tollFee = self._$sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
            var washFee = self._$sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
            var eatFee = self._$sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
            var anotherFee = [];
            var ind = 1;
            $.each(self._$sheet.find('input[name="NameAnotherFee"]'), function (ku, km) {
                var fs = $(km);
                var _index = ind;
                var _name = fs.val();
                var _money = fs.closest('div.form-group').next('div').find('input[name="MoneyAnotherFee"]').val().replace(/\./g, '').toNum();
                anotherFee.push(_index + "|" + _name + "|" + _money);
                ind++;
            });
            d.FeeMoney = "1~" + tollFee + "~" + washFee + "~" + eatFee + "~" + anotherFee.join('##');
            obj._d = d;
            var p = function (u, r, l, t) { //completeRequestSaveTrip
                if (u == 1) {
                    var objC = {
                        _a: "UpTrip",
                        _c: { Id: tripDetailId },
                        _d: { ClosedStatus: 2 }
                    };
                    var p2 = function (u2, r2, l2, t2) { //completeRequest
                        if (u2 == 1) {
                            self._renderTripInfo();
                            var tripDate = $.trim(self._cTripDate.toFormatString('dd-mm-yyyy'));
                            var tripTime = $.trim(self._cTripTime);
                            var tripName = $.trim(self._data[self._cTripIndex].Name);
                            self._$tripInfo.append('<h4 style="font-size: 24px;text-align: center;">Thống kê theo chuyến ' + tripName + ' ngày ' + tripDate + ' lúc ' + tripTime + '</h4>');
                            if (app.rights.indexOf($.rights.bEdtAtCphoi.val) == -1) {
                                self._$sheet.find('input,button').prop('disabled', 'disabled');
                                self._$sheet.find('button.tk-save-trip,button.btn-chot-phoi').addClass('hidden');
                            }
                        }
                    };
                    self._submitAction(objC, p2);
                }
            }
            self._submitAction(obj, p);
        },

        /************************************************************************
        * THÊM VÉ                                                               *
        *************************************************************************/
        _getCopyInfo: function (oldCode, fromArea, toArea, tripDetailId) {
            var self = this;
            self._copyInfo = {};
            var d = self._convertFormDataToObj(self._$updateForm);
            if (typeof _dict._copyField != "undefined") {
                $.each(_dict._copyField, function (ki, kl) {
                    self._copyInfo[kl] = d[kl] != null ? d[kl] : "";
                });
            }
            self._copyInfo["Code"] = oldCode;
            self._copyInfo["FromArea"] = fromArea;
            self._copyInfo["ToArea"] = toArea;
            self._copyInfo["TripDetailId"] = tripDetailId;
            if (!self._validateThemVe()) {
                self._resetCopyInfo();
                self._unbindEventCopying();
                return;
            }
            self._resetSeatStack();
            self._clearSelectedItem();
            self._closeUpdateDialog();
            self._toggleFilterWhenCopyTicket();
            self._bindEventCopying();
        },
        _validateThemVe: function () {
            var self = this;
            var hasError = false;
            var $phone = null;
            var $note = null;
            var $payment = self._$updateForm.find('input[name=PaymentType]');
            if (typeof _dict._copyFieldRequired != "undefined") {
                $.each(_dict._copyFieldRequired, function (kd, kf) {
                    switch (kf) {
                        case "Note":
                            $note = self._$updateForm.find('textarea[name=Note]');
                            break;
                        case "PhoneNumbers":
                            $phone = self._$updateForm.find('input:text[name=PhoneNumbers]');
                            break;
                        default:
                            break;
                    }
                });
            }
            //var $fare = self._$updateForm.find('input[name=Fare]');
            if ($payment.val() == "" || typeof $payment.val() == "undefined") {
                if ($phone != null && vIsEstStr($phone.val())) {
                    if (!$phone.val().isMulPhone()) {
                        $phone.closest('div.col-md-6').addClass('has-error');
                        hasError = true;
                    } else {
                        $phone.closest('div.col-md-6').removeClass('has-error');
                    }
                } else {
                    if ($note == null) {
                        $phone.closest('div.col-md-6').addClass('has-error');
                        hasError = true;
                    } else {
                        if (!vIsEstStr($note.val())) {
                            $phone.closest('div.col-md-6').addClass('has-error');
                            hasError = true;
                        }
                    }
                }
            }

            //if ($fare.val() <= 0 && vIsEstStr($payment.val()) && $payment.val() != 9) {
            //    $fare.closest('div.col-md-6').addClass('has-error');
            //    hasError = true;
            //} else {
            //    $fare.closest('div.col-md-6').removeClass('has-error');
            //}
            return !hasError;
        },
        _resetCopyInfo: function () {
            var self = this;
            self._copyInfo = {}
            self._hasCopyTicket = false;
            self._toggleFilterWhenCopyTicket();
        },
        _toggleFilterWhenCopyTicket: function () {
            var self = this;
            var $sl = self._$filterForm.find('select[name=TripId]');
            if (self._hasCopyTicket) {
                $sl.prop('disabled', true);
            } else {
                $sl.prop('disabled', false);
            }
        },

        /************************************************************************
        * KHỨ HỒI                                                               *
        *************************************************************************/
        _getReturnInfo: function () {
            var self = this;
            self._copyInfo = {}
            var tripId = self._getCTripId();
            self._cBookReturnTripId = tripId;
            var d = self._convertFormDataToObj(self._$updateForm);
            if (typeof _dict._returnField != "undefined") {
                $.each(_dict._returnField, function (ki, kl) {
                    self._copyInfo[kl] = d[kl] != null ? d[kl] : "";
                });
            }
            if (!self._validateBookReturn()) {
                self._resetBookReturnInfo();
                self._unbindEventBookReturnTicket();
                return;
            }
            self._resetSeatStack();
            self._clearSelectedItem();
            self._closeUpdateDialog();
            self._toggleFilterWhenBookReturn();
            self._bindEventBookReturnTicket();
        },
        _validateBookReturn: function () {
            var self = this;
            var hasError = false;
            var $phone = null;
            if (typeof _dict._returnFieldRequired != "undefined") {
                $.each(_dict._returnFieldRequired, function (kd, kf) {
                    switch (kf) {
                        case "PhoneNumbers":
                            $phone = self._$updateForm.find('input:text[name=PhoneNumbers]');
                            break;
                        default:
                            break;
                    }
                });
            }
            if ($phone != null) {
                if ($phone.val() == '') {
                    $phone.closest('div.col-md-6').addClass('has-error');
                    hasError = true;
                } else {
                    $phone.closest('div.col-md-6').removeClass('has-error');
                }
            }
            return !hasError;
        },
        _resetBookReturnInfo: function () {
            var self = this;
            self._copyInfo = {}
            self._hasBookReturnTicket = false;
            self._cBookReturnTripId = null;
            self._toggleFilterWhenBookReturn();
        },
        _toggleFilterWhenBookReturn: function () {
            var self = this;
            var $trip = self._$filterForm.find('select[name=TripId]');
            var $tripDate = self._$filterForm.find('input[name=DepartureDate]');
            var $tripTime = self._$filterForm.find('select[name=TimeSlot]');
            if (self._hasBookReturnTicket) {
                $trip.addClass('book-return');
                $tripDate.prop('disabled', true);
                self._$filterForm.find('.glyphicon-calendar').parent().unbind('click');
                $tripTime.prop('disabled', true);
            } else {
                $trip.removeClass('book-return');
                $tripDate.prop('disabled', false);
                $tripTime.prop('disabled', false);
                self._bindEventOnCalendarIcon();
            }
        },

        /************************************************************************
        * CANCEL                                                                *
        *************************************************************************/
        _showCancelForm: function (ticketFares, allIsBooking) {
            var self = this;
            if (typeof allIsBooking != 'undefined' && allIsBooking) {
                self._$cmodal.find('.divFeePercentRadio').children().prop('disabled', true);
                self._$cmodal.find('.divFeePercentRadio div').children().prop('disabled', true);
            } else {
                self._$cmodal.find('.divFeePercentRadio').children().prop('disabled', false);
                self._$cmodal.find('.divFeePercentRadio div').children().prop('disabled', false);
            }
            self._$cmodal.find('input[name="TicketFares"]').val(ticketFares);
            self._showCModal();
        },
        _resetCancelForm: function () {
            var self = this;
            var cancelFeePercentDefault = 0;
            var cancelFeeMoneyDefault = 0;
            if (typeof _dict._cancelFeePercentDefault != "undefined") {
                cancelFeePercentDefault = _dict._cancelFeePercentDefault;
            }
            if (typeof _dict._cancelFeeMoneyDefault != "undefined") {
                cancelFeeMoneyDefault = _dict._cancelFeeMoneyDefault.toMn();
            }
            self._$cmodal.find('input[name="FeePercentRadio"]').prop('checked', true).button("refresh");
            self._$cmodal.find('input[name="CancelFeePercentInput"]').val(cancelFeePercentDefault);
            //self._$cmodal.find('input[name="CancelFeePercentInput"]').removeAttr('disabled');
            self._$cmodal.find('input[name="CancelFeePercentInput"]').removeClass('cmodal-error-input');
            self._$cmodal.find('input[name="CancelFeePercentInput"]').next().removeClass('cmodal-error-addon');
            self._$cmodal.find('input[name="FeeMoneyRadio"]').prop('checked', false).button("refresh");
            self._$cmodal.find('input[name="CancelFeeMoneyInput"]').val(cancelFeeMoneyDefault);
            //self._$cmodal.find('input[name="CancelFeeMoneyInput"]').removeAttr('disabled');
            //self._$cmodal.find('input[name="CancelFeeMoneyInput"]').prop('disabled', true);
            self._$cmodal.find('input[name="CancelFeeMoneyInput"]').removeClass('cmodal-error-input');
            self._$cmodal.find('input[name="CancelFeeMoneyInput"]').next().removeClass('cmodal-error-addon');
            self._$cmodal.find('select[name="CancelReason"]').val('');
            self._$cmodal.find('textarea[name="NoteCancel"]').val('');
            self._$cmodal.find('div.warning-mess').html('').hide();
        },
        //_validateCancelForm: function (cancelFeePercent) {
        //    var hasError = false;
        //    if (isNaN(cancelFeePercent)) {
        //        hasError = true;
        //    }
        //    return hasError;
        //},
        _cancelTicket: function (isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo) {
            var self = this;

            var obj = self._createCancelTicketObj(isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo);
            var completeReload = function (u, r, l, t) {

                if (u != 1) return;

                //Store history
                var slabel = [];
                $.each(self._seatStack, function (i, v) {
                    slabel.push(v._label);
                });
                self._storeHistory(self.options.un, 'cancel', { '_tid': self._cTripId, '_tname': self._data[self._cTripIndex].Name, '_tdate': self._getDepartureTime(), '_s': slabel });

                //Reset seat stack
                self._resetSeatStack();

                //Reload sheet
                self._reloadSheet();

                //Close dialog
                self._closeCancelDialog();

            };
            //Submit action
            self._submitAction(obj, completeReload);

        },
        _createCancelTicketObj: function (isPercent, cancelFeePercent, isMoney, cancelFeeMoney, cancelReasonId, cancelReasonInfo) {
            var self = this;

            var obj = {};
            obj._a = "UpdateBookTicket";
            obj._c = [];
            obj._d = [];
            var numOfCancel = self._seatStack.length;
            $.each(self._seatStack, function (i, v) {
                var t = v._getCurrentTicket();
                var cancelFee = 0;
                if (isPercent) {
                    cancelFee = t._fare * cancelFeePercent / 100;
                }
                if (isMoney) {
                    cancelFee = Math.floor(cancelFeeMoney / numOfCancel);
                }
                obj._c.push({
                    Id: t._id,
                    TripId: self._cTripId,
                    SeatCode: v._getSeatInfo(),
                    PickupDate: t._pdate.toFormatString('iso'),
                    Bus: self._cTripBus,
                    StageCode: !self._cStageCode ? 1 : self._cStageCode //StageCode
                });
                var dObj = {
                    TripAlias: parseInt(self._cTripBus),
                    Status: 3, //STATUS
                    CancelFee: cancelFee,
                    CancelType: cancelReasonId,
                    CancelInfo: cancelReasonInfo,
                    CanceledUser: app.un,
                    // không truyền CanceledDate vì sẽ lấy giờ server chèn vào
                    //CanceledDate: new Date().addMinutes(self._sOffsetMinute).toFormatString('iso'),
                    CanceledAgentId: app.aid
                };
                obj._d.push(dObj);
            });
            return obj;
        },
        _bindEventOnCancelForm: function () {
            var self = this;
            var cancelFeePercentDefault = 0;
            var cancelFeeMoneyDefault = 0;
            if (typeof _dict._cancelFeePercentDefault != "undefined") {
                cancelFeePercentDefault = _dict._cancelFeePercentDefault;
            }
            if (typeof _dict._cancelFeeMoneyDefault != "undefined") {
                cancelFeeMoneyDefault = _dict._cancelFeeMoneyDefault.toMn();
            }

            self._$cmodal.find('input[name="FeePercentRadio"]').unbind().on('change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self._$cmodal.find('div.warning-mess').html('').hide();
                $(this).prop('checked', true).button("refresh");
                self._$cmodal.find('input[name="FeeMoneyRadio"]').prop('checked', false);
                self._$cmodal.find('input[name="CancelFeeMoneyInput"]').val(cancelFeeMoneyDefault);
                //self._$cmodal.find('input[name="CancelFeeMoneyInput"]').prop('disabled', true);
                self._$cmodal.find('input[name="CancelFeeMoneyInput"]').removeClass('cmodal-error-input');
                self._$cmodal.find('input[name="CancelFeeMoneyInput"]').next().removeClass('cmodal-error-addon');
                //self._$cmodal.find('input[name="CancelFeePercentInput"]').removeAttr('disabled');
            });

            self._$cmodal.find('input[name="FeeMoneyRadio"]').unbind().on('change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self._$cmodal.find('div.warning-mess').html('').hide();
                $(this).prop('checked', true).button("refresh");
                self._$cmodal.find('input[name="FeePercentRadio"]').prop('checked', false);
                self._$cmodal.find('input[name="CancelFeePercentInput"]').val(cancelFeePercentDefault);
                //self._$cmodal.find('input[name="CancelFeePercentInput"]').prop('disabled', true);
                self._$cmodal.find('input[name="CancelFeePercentInput"]').removeClass('cmodal-error-input');
                self._$cmodal.find('input[name="CancelFeePercentInput"]').next().removeClass('cmodal-error-addon');
                //self._$cmodal.find('input[name="CancelFeeMoneyInput"]').removeAttr('disabled');
            });

            self._$cmodal.find('input[name="CancelFeePercentInput"]').unbind().on('change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var feePercent = $(this).val();
                if (isNaN(feePercent)) {
                    self._$cmodal.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                    $(this).addClass('cmodal-error-input');
                    $(this).next().addClass('cmodal-error-addon');
                } else {
                    self._$cmodal.find('div.warning-mess').html('').hide();
                    $(this).removeClass('cmodal-error-input');
                    $(this).next().removeClass('cmodal-error-addon');
                }
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });

            self._$cmodal.find('input[name="CancelFeeMoneyInput"]').unbind().on('change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var feeMoney = $(this).val();
                if (isNaN(feeMoney)) {
                    self._$cmodal.find('div.warning-mess').html('Phí hủy vé không chính xác, vui lòng kiểm tra lại.').show();
                    $(this).addClass('cmodal-error-input');
                    $(this).next().addClass('cmodal-error-addon');
                } else {
                    self._$cmodal.find('div.warning-mess').html('').hide();
                    $(this).removeClass('cmodal-error-input');
                    $(this).next().removeClass('cmodal-error-addon');
                    if (feeMoney < 10000) {
                        feeMoney = feeMoney * 1000;
                    }
                    $(this).val(feeMoney.toMn());
                }
            }).focus(function () {
                $(this).select();
            }).mouseup(function (e) {
                e.preventDefault();
            });
            self._$cmodal.find('[name="CancelFeeMoneyInput"]').on('focus', function () {
                $(this).select();
                self._$cmodal.find('input[name="FeeMoneyRadio"]').prop('checked', true);
                self._$cmodal.find('input[name="FeePercentRadio"]').prop('checked', false);
            });
            self._$cmodal.find('[name="CancelFeePercentInput"]').on('focus', function () {
                $(this).select();
                self._$cmodal.find('input[name="FeeMoneyRadio"]').prop('checked', false);
                self._$cmodal.find('input[name="FeePercentRadio"]').prop('checked', true);
            });
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
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        self._validTicket();
                    });
                } else if ($(b).hasClass('btn-close')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        self._clearSelectedItem();
                        self._resetSeatStack();
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
                self._resetSeatStack();

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
            $.each(self._seatStack, function (i, v) {
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
        * MOVE                                                                  *
        *************************************************************************/
        _maskMoveTicket: function () {
            var self = this;
            //Set is moving
            self._movingStack = [];
            self._fMoving = true;
            //Clone selected ticket to moving stack
            $.each(self._seatStack, function (i, v) {
                var ns = v._clone();
                var t = ns._getCurrentTicket();
                if (t._isNotCome()) {
                    t._status = 2;
                } else if (t._isCancelled()) {
                    t._status = 1;
                    t._pmInfo = null; // Clear payment info
                }
                self._movingStack.push(ns);
            });

            //Store moved trip info
            self._cMovingTrip = {
                _tid: self._cTripId,
                _tname: self._data[self._cTripIndex].Name,
                _tdate: self._getDepartureTime()
            };

            self._resetSeatStack();
            self._toggleFilterWhenMoving();
            self._bindEventMoving();
        },
        _moveTicket: function (obj, seat) {
            var self = this;
            if (self._movingStack.length <= 0) {
                self._fMoving = false;
                self._cMovingSeat = null;
                self._cMovingTrip = null;
                self._unbindEventMoving();
                return false;
            }

            //Det data from filter form
            var mObj = self._createMovedTicketObj(seat);

            var completeReload = function (u, r, l, t) {
                if (u != 1) return;

                //History
                var dt = {
                    _ftid: self._cMovingTrip._tid,
                    _ftname: self._cMovingTrip._tname,
                    _ftdate: self._cMovingTrip._tdate,
                    _fs: [self._cMovingSeat._label],
                    _ttid: self._cTripId,
                    _ttname: self._data[self._cTripIndex].Name,
                    _ttdate: self._getDepartureTime(),
                    _ts: [seat._label],
                };
                self._storeHistory(self.options.un, 'move', dt);

                if (self._movingStack.length <= 0) {
                    self._fMoving = false;
                    self._movingStack = [];
                    self._cMovingSeat = null;
                    self._cMovingTrip = null;
                    self._unbindEventMoving();
                    self._toggleFilterWhenMoving();
                }

                //Reload sheet
                self._reloadSheet();
            };
            //Submit action
            self._submitAction(mObj, completeReload);
        },
        _createMovedTicketObj: function (seat) {
            var self = this;

            var movedSeat = self._movingStack.shift();
            self._cMovingSeat = movedSeat;

            var movedTicket = movedSeat._getCurrentTicket();
            var departureDate = self._getDepartureTime();
            var pickupDate = departureDate;
            var tripDate = departureDate;

            var obj = {};
            obj._a = "UpdateBookTicket";
            obj._c = [];
            obj._d = [];

            obj._c.push({
                Id: movedTicket._id,
                TripId: self._cTripId,
                SeatCode: seat._getSeatInfo(),
                PickupDate: pickupDate.toFormatString('iso'),
                Bus: self._cTripBus
            });
            var dObj = {
                SeatCode: seat._getSeatInfo(),
                TripDate: tripDate.toFormatString('iso'),
                PickupDate: pickupDate.toFormatString('iso'),
                TripAlias: self._cTripBus,
                Status: parseInt(movedTicket._status),
                PaymentInfo: movedTicket._pmInfo,
                SeatType: seat._getSeatType(),
                Code: movedTicket._code,
                LastMovedDate: movedTicket._dept.toFormatString('iso'),
                ChargeDate: movedTicket._chargeDate
            };

            obj._d.push(dObj);

            return obj;
        },
        _isInMovingStack: function (seat) {
            var self = this;
            var found = false;
            $.each(self._movingStack, function (i, v) {
                if (found == false) {
                    var t1 = v._getCurrentTicket();
                    var t2 = seat._getCurrentTicket();
                    if (v._coach = seat._coach && v._row == seat._row && v._col == seat._col && t1._id == t2._id) {
                        found = true;
                    }
                }
            });

            return found;
        },
        _toggleFilterWhenMoving: function () {
            var self = this;
            var $sl = self._$filterForm.find('select[name=TripId]');
            if (self._fMoving || self._hasCopyTicket) {
                $sl.prop('disabled', true);
            } else {
                $sl.prop('disabled', false);
            }
        },

        /************************************************************************
        * HISTORY                                                               *
        *************************************************************************/
        _bindEventOnHistoryForm: function () {
            var self = this;
            var $form = self._$historyForm;
            $form.find('button').each(function (_, b) {
                if ($(b).hasClass('btn-close')) {
                    $(b).on('click', function (e) {
                        e.preventDefault();
                        self._clearSelectedItem();
                        self._resetSeatStack();
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

