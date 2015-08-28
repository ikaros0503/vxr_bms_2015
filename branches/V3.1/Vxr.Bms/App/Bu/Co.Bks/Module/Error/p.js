/*
 * .................Error...................
 */
define({
    start: function (o) {
        try {
            var me = this;
            me._createErrorDialogDiv();
            var $form = $(o._e);
            vbv('doCloseErrorForm', function() {
                me._closeErrorDialog();
            });
            vbv('doShowErrorForm', function(e) { // show error form
                if (e.d) {
                    $form.find('.message').html(e.d.message);
                    $form.modal('show');
                    me._bindEventOnErrorForm($form);
                }
            });
        } catch (e) {
            console.log(e);
        }
    },
    _createErrorDialogDiv: function () {
        var me = this;
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
                        .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý'))
                    )
                )
        );

        //Create a div for dialog and add to container element
        me._$emodal = $('<div />').addClass('modal fade').attr('id', 'error-popup')
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
    },
    _bindEventOnErrorForm: function (f) {
        var me = this;
        f.find('button.btn.btn-danger').unbind().on('click', function (e) {
            me._closeErrorDialog(f);
        });
    },
    _closeErrorDialog: function (f) {
        if (f) f.modal('hide');
    }
});
$(document).ready(function () {


});