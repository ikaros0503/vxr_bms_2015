/*
 * .................UpdateForm History Tab...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doCreateHistoryTab', function (e) {
            var $his = me._createHistoryForm();
            $('#update-popup #history').empty();
            $('#update-popup #history').append($his);
        });
        vbv('doRenderHistoryUpdateForm', function (e) {
            me._renderHistoryTab(e.d.seat);
        });
    },
    _createHistoryForm: function () {
        return $('<div />').addClass('container-fluid')
            .append($('<div />').addClass('row history-row')
                .append($('<div />').addClass('col-sm-12')
                    .append($('<table />').addClass('table table-striped table-hover table-condensed')
                        .append($('<thead>')
                            .append($('<tr />')
                                .append($('<th />').text("NV"))
                                .append($('<th />').text("Tác vụ"))
                                .append($('<th />').text("Ngày"))
                                .append($('<th />').text("Cập nhật"))
                            )
                        )
                        .append($('<tbody />'))
                    )
                )
            )
            .append($('<div />').addClass('row action-row')
                .append($('<div />').addClass('col-md-12 list-btn')
                    .append($._createFormButton('button').addClass('btn btn-default btn-close').text('Đóng'))
                )
            );
    },
    _renderHistoryTab: function (s) {
        var t = s._getCurrentTicket();
        var $c = $('#update-popup #history').find('tbody').empty();
        if (typeof t._hInfo != "undefined" && t._hInfo != null) {
            var h = t._parseHistoryInfo();
            if (h != null) {
                for (var i = 0; i < h.length; i++) {
                    if (typeof h[i] != "undefined") {
                        var $r = $._createTableRow();
                        for (var j = 0; j < h[i].length; j++) {
                            $r.append($('<td />').html(h[i][j]));
                        }
                        $c.append($r);
                    }
                }
            }
        }
    },
});