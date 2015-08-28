/*
 * .......Booking Sheet.........................
 */
define({
    start: function (o) {
        var me = this;
        vbe('onShowSuccessModal', 'doShowSuccessModal'); /// show success pop modal
        vbe('onShowVC', 'doShowVC'); /// show Cancelled Ticket Tab
        vbe('onChangeVCTrip', 'doChangeVCTrip'); // change cVCTrip
        vbe('onPrintETicket', 'doPrintETicket'); // print Ticket
        vbe('onShowQBook', 'doShowQBook'); //show quick book form
        vbe('onCloseQBook', 'doCloseQBook'); //close quick book form
        vbe('onBookTicket', 'doBookTicket');
        vbe('onShowPopModal', 'doShowPopModal');
        vbe('onShowError', 'doShowError');
        vbe('onRenderTripInfo', 'doRenderTripInfo');
        vbe('onEmptySheets', 'doEmptySheets');//Empty a sheet
        vbe('onHideSheets', 'doHideSheets');//Hide a sheet
        vbe('onShowStatistic', 'doShowStatistic'); //Xem thong ke
        vbe('onSearchResultSelected', 'doSearchResultSelected');
        vbe('onSearchBoxFocused', 'doSearchBoxFocused'); // when focus in search textbox
        vbe('showUpdateForm', 'doShowUpdateForm'); // show Update Form
        vbe('onUpdateFormCreated', 'doCreateHistoryTab'); // create view history tab
        vbe('renderHistoryUpdateForm', 'doRenderHistoryUpdateForm'); // render history
        vbe('showCancelForm', 'doShowCancelForm'); // show Cancel Form
        vbe('onCloseCancelForm', 'doCloseCancelForm'); // close cancel form
        vbe('reloadBookingSheet', 'reloadSheet'); // reload Booking Sheet
        vbe('onStoreHistory', 'storeHistory'); // store history
        vbe('onClearSelectedItem', 'clearSelectedItem'); // clear selected items
        vbe('onSetSearchIP', 'doSetSearchBox'); // Set value of search box.
        vbe('onBookMoreTicket', 'doBookMoreTicket'); // book more ticket
        vbe('onBindEventCopying', 'bindEventCopying'); // bind event when copying ticket
        vbe('onUnbindEventCopying', 'doUnbindEventCopying'); // unbind event book more ticket
        vbe('onBookReturnTicket', 'doBookReturnTicket'); // book return ticket
        vbe('onBindEventBookReturnTicket', 'bindEventBookReturnTicket'); // Bind event when book return ticket
        vbe('onUnbindEventBookReturnTicket', 'doUnbindEventBookReturnTicket'); // Unbind event when book return ticket
        vbe('onUpdateInfoOfReturnTickets', 'doUpdateInfoOfReturnTickets'); // update return info to old tickets when book return ticket
        vbe('showErrorForm', 'doShowErrorForm'); // show error form
        vbe('onCloseErrorForm', 'doCloseErrorForm'); // show error form
        vbe('onPrintETicket', 'collectDataForPrintETicket'); // collect data for print eticket
        vbe('onGetCurrentTripInfo', 'doGetCurrentTripInfo'); // get current trip info
        vbe('CurrentTripInfo', 'doPrintETicket'); // print eticket after collect data
        vbe('resetAll', 'doResetAll'); // Reset all
        vbe('onCloseUpdateForm', 'doCloseUpdateForm'); // Close update form
        vbe('onGetSuggestCustomer', 'doGetSuggestCustomer'); // get suggest customer when input phone numbers on update form
        vbe('onClearSuggestCustomer', 'doClearSuggestCustomer'); // clear suggest customer
        vbe('onGetWarningCustomer', 'doGetWarningCustomer'); // get warning customer
        vbe('onClearWarningCustomer', 'doClearWarningCustomer'); // clear warning customer
        vbe('onGetSuggestPickup', 'doGetSuggestPickup'); // get suggest pickup when input pickup on update form
        vbe('onNavigateSuggestPickup', 'doNavigateSuggestPickup'); // navigate through suggest pickup result
        vbe('onGetSuggestTransfer', 'doGetSuggestTransfer'); // get suggest transfer when input transfer on update form
        vbe('onNavigateSuggestTransfer', 'doNavigateSuggestTransfer'); // navigate through suggest transfer result
        vbe('onMaskMovingTicket', 'doMaskMovingTicket'); // mask moving ticket
        vbe('onMovingTicket', 'doMovingTicket'); // moving ticket
        vbe('onResetMovingStack', 'doResetMovingStack'); // reset moving stack
        vbe('onUnbindEventMoving', 'doUnbindEventMoving'); // unbind event moving
        vbe('onQuickPayTicket', 'doQuickPayTicket'); // quick pay ticket

        vbv('resetSeatStack', function () { app.seatStack = []; }); // reset seat stack
    }
});
$(document).ready(function () {
    $._createForm = function (id, elements, cl, gl) {
        var $f = $('<form />').attr('id', id).attr('role', 'form');
        if (typeof cl != "undefined") {
            $f.addClass(cl);
        }
        var els = [];
        var elhs = [];
        var maxRow = 0;
        var maxCol = 0;
        $.each(elements, function (_, el) {
            var row = el[0];
            var col = el[1];

            if (el[4] == "hidden") {
                elhs.push(el);
            } else {
                if (typeof els[row - 1] == "undefined") {
                    els[row - 1] = [];
                }
                if (typeof els[row - 1][col - 1] == "undefined") {
                    els[row - 1][col - 1] = [];
                }
                els[row - 1][col - 1].push(el);
            }
            if (maxRow < row) {
                maxRow = row;
            }
            if (maxCol < col) {
                maxCol = col;
            }
        });

        //Hidden element
        $.each(elhs, function (jx, he) {
            if (typeof he != "undefined") {
                var $hi = $._createFormInput(he[4], he[5], he[7]).addClass(he[6]);
                if (!$.isEmptyObject(he[8])) { //attr
                    $.each(he[8], function (k, v) {
                        $hi.attr(k, v);
                    });
                }
                $f.append($hi);
            }
        });

        //Element
        var $ct = $._createFormContainer();
        $ct.append($('<div class="alert alert-danger message-error" role="alert" style="margin:5px 0 0 0;display:none;" />'));

        for (var i = 0; i < maxRow; i++) {
            if (typeof els[i] != "undefined") {
                var $r = $._createFormRow();
                for (var j = 0; j < maxCol; j++) {
                    var $c = $._createFormCol();
                    if (typeof els[i][j] != "undefined") {
                        //var gcol = "";
                        var hasGroupCol = false;
                        $.each(els[i][j], function (__, elm) {
                            var $label = $._createFormLabel(elm[2]);
                            if ($label.length > 0) {
                                $label.addClass('col-md-4 col-sm-4 col-xs-12 pl0');
                            }
                            var $ig = $._createFormInputGroup().addClass('col-md-8 col-sm-8 col-xs-12');
                            switch (elm[3]) {
                                case "input":
                                    var $i = $._createFormInput(elm[4], elm[5], elm[7], elm[8]).addClass(elm[6]);
                                    var $addon = $._createFormInputAddon(elm[10]);
                                    switch (elm[4]) {
                                        case 'checkbox':
                                        case 'radio':
                                            $i.append("&nbsp; " + elm[2]);
                                            $ig.addClass('col-md-offset-4 col-sm-offset-4');
                                            break;
                                        default:
                                            $c.append($label);
                                            break;
                                    }
                                    $c.append($ig.append($i).append($addon));
                                    break;
                                case "select":
                                    var options = elm[9];
                                    if (elm[5] == "PaymentType") {
                                        options = [];
                                        if (app.aid == 135 && _dict && _dict._vxrPm) {
                                            $.each(_dict._vxrPm, function (_, v) {
                                                var value = v[0], text = "";
                                                if (v[2] == 1) {
                                                    text = v[1][_dict._lang];
                                                    options.push({
                                                        Value: value,
                                                        Text: text
                                                    });
                                                }
                                            });
                                        } else {
                                            $.each(_dict._pm, function (_, v) {
                                                var value = v[0], text = "";
                                                if (v[2] == 1) {
                                                    text = v[1][_dict._lang];
                                                    options.push({
                                                        Value: value,
                                                        Text: text
                                                    });
                                                }
                                            });
                                        }
                                    }
                                    var $s = $._createFormSelect(elm[5], options, elm[7], elm[4], elm[8]).addClass(elm[6]);
                                    $c.append($label).append($ig.append($s));
                                    break;
                                case "textarea":
                                    var $t = $._createFormTextArea(elm[5], elm[7], elm[8]).addClass(elm[6]);
                                    $c.append($label).append($ig.append($t));
                                    break;
                                case "p":
                                    var $p = $._createFormText(elm[7], elm[8]).addClass(elm[6]);
                                    $c.append($p);
                                    break;
                                case "button":
                                    var $b = $._createFormButton(elm[4], elm[8]).addClass(elm[6]).append(elm[10]).append(elm[5]);
                                    $c.append($b);
                                    break;
                            }
                            if (typeof elm[11] != "undefined" && elm[11].length > 0) {
                                var merge = elm[11][1] - elm[11][0];
                                $c.addClass(_dict._g[maxCol - merge - 1]).addClass(_dict._mg[maxCol - merge - 1]);
                                hasGroupCol = true;
                                j += merge;
                            }
                        });
                        if (!hasGroupCol) {
                            $c.addClass(_dict._g[maxCol - 1]).addClass(_dict._sg[maxCol - 1]).addClass(_dict._mg[maxCol - 1]);
                        }
                    }
                    $r.append($c);
                }
                $ct.append($r);
            }
        }
        return $f.append($ct);
    }
    $._createFormInput = function (type, name, value, attrs) {
        var $result = $();
        switch (type) {
            case "checkbox":
            case "radio":
                $result = $('<label />').append($('<input />', { type: type, name: name, value: value }));
                break;
            default:
                $result = $('<input />', { type: type, name: name, value: value });
                break;
        }
        if (!$.isEmptyObject($result) && typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) {
                $.each(attrs, function (k, v) {
                    $result.attr(k, v);
                });
            }
        }
        return $result;
    }
    $._createFormContainer = function () {
        return $('<div />').addClass('container-fluid');
    }
    $._createFormRow = function (cl) {
        return $('<div />').addClass('row');
    }
    $._createFormCol = function () {
        return $('<div />');
    }
    $._createFormLabel = function (label) {
        if ("" != label) {
            return $('<label />').addClass("col-sm-4 control-label").text(label);
        }
        return "";
    }
    $._createFormInputGroup = function () {
        return $('<div />').addClass('input-group');
    }
    $._createFormInputAddon = function (i) {
        if ("" != i) {
            return $('<div />').addClass('input-group-addon').append(i);
        }
        return "";
    }
    $._createFormSelect = function (name, options, value, text, attrs) {
        var $s = $('<select />', { name: name });
        $s.append($('<option />', { value: "" }).text(text));
        $.each(options, function (_, opt) {
            $s.append($('<option />', { value: opt.Value }).text(opt.Text));
        });
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $s.attr(k, v);
                });
            }
        }
        return $s;
    }
    $._createFormTextArea = function (name, text, attrs) {
        var $t = $('<textarea />', { name: name }).val(text);
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $t.attr(k, v);
                });
            }
        }
        return $t;
    }
    $._createFormButton = function (type, attrs) {
        var $b = $('<button />', { type: type });
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $b.attr(k, v);
                });
            }
        }
        return $b;
    }
    $._createFormText = function (text, attrs) {
        var $p = $('<p />').text(text);
        if (typeof attrs != "undefined" && attrs != null) {
            if (!$.isEmptyObject(attrs)) { //attr
                $.each(attrs, function (k, v) {
                    $p.attr(k, v);
                });
            }
        }
        return $p;
    }

    /************************************************************************
    * TABLE                                                                 *
    *************************************************************************/
    $._createTable = function () {
        return $('<table />');
    }
    $._createTableRow = function () {
        return $('<tr />');
    }
    $._createTableCol = function (colspan) {
        var $td = $('<td />');
        if (colspan > 1) {
            $td.attr('colspan', colspan);
        }
        return $td;
    }
    $._createTableHead = function () {
        return $('<thead />');
    }
    $._createTableBody = function () {
        return $('<tbody />');
    }
    $._createTableHeadCol = function (colspan) {
        var $th = $('<th />');
        if (colspan > 1) {
            $th.attr('colspan', colspan);
        }
        return $th;
    }

});