/*
 * .................Suggest Transfer...................
 */
define({
    start: function (o) {
        var me = this;
        vbv('doGetSuggestTransfer', function (e) { // do get suggest transfer
            if (e.d) {
                me._suggestLocations(e.d.f, e.d.ltp, e.d.key, e.d.tTime);
            }
        });
        vbv('doNavigateSuggestTransfer', function (e) { // navigate through suggest transfer result
            if (e.d) {
                me._navigateSuggestTransferResult(e.d.keyCode);
            }
        });
    },
    _suggestLocations: function (f, ltp, key, tTime) {
        var me = this;
        if (ltp == null) return;
        var strs = ltp.split('~');
        var suggestedLocations = [];
        if (strs != null && strs.length > 1) {
            for (var k = 1; k < strs.length; k++) {
                var strsSplitted = strs[k].split('|');
                suggestedLocations.push({
                    "pLoc": {
                        _index: strsSplitted[0],
                        _name: strsSplitted[1],
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
        if (key.length >= 1) {
            for (var i = 0; i < suggestedLocations.length; i++) {
                var locData = suggestedLocations[i];
                var convertedInputText = me._replaceUnicodeCharacter(key);
                var nameConverted = me._replaceUnicodeCharacter(locData.pLoc._name);

                if (locData.pLoc._name.toLowerCase().indexOf(key.toLowerCase()) == 0) {
                    ultraPerfectMatchedTransferLocations.push(locData);
                } else if (locData.pLoc._name.toLowerCase().indexOf(key.toLowerCase()) > 0) {
                    perfectMatchedTransferLocations.push(locData);
                } else if (nameConverted.indexOf(convertedInputText) == 0) {
                    ultraMatchedTransferLocations.push(locData);
                } else if (nameConverted.indexOf(convertedInputText) > 0) {
                    matchedTransferLocations.push(locData);
                }
            }
        }
        f.find('div.search-result').remove();
        var listLocations = ultraPerfectMatchedTransferLocations.concat(perfectMatchedTransferLocations.concat(ultraMatchedTransferLocations.concat(matchedTransferLocations)));
        var $input = f.find('input[name=TransferInfo]');

        if (listLocations != null && listLocations.length > 0) {
            $input.parent()
                .append(
                    $(_dict._locationHeaderTpl).addClass("r0").append(
                        $('<div class="scrollable" />').append(me._renderResultList(f, listLocations, tTime))
                    ).append(vtpl(_dict._locationFooterTpl, { locCount: listLocations.length }))
                );

            me._bindEventsOnSearchResult(f);
        }
    },
    _bindEventsOnSearchResult: function (f) {
        $('div.search-result tr').mousedown(function () {
            if ($("input:text[name=TransferInfo]").is(":focus")) {
                $("input:text[name=TransferInfo]").val($(this).attr("data-name"));
                $('input[name=pIndex]').val($(this).attr('data-order'));
            }
            f.find('div.search-result').remove();
        });
        $('div.search-result tr').hover(function () {
            $('div.search-result').find('tr').removeClass('location-selected');
            $(this).addClass('location-selected');
        }, function () {
            $(this).removeClass('location-selected');
        });
    },
    _renderResultList: function (f, list, tTime) {
        f.find('div.search-result.search-location table.search-items').remove();
        var $resultList = $('<table />').addClass('search-items');
        if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                if (typeof list[i] != "undefined" && list[i] != null) {
                    var pLocData = list[i];
                    pLocData._trIndex = i;
                    var tripTime = String(tTime);
                    if (String(tTime).indexOf(':') >= 0) {
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
    _navigateSuggestTransferResult: function (key) {
        var lRes = $('#update-popup div.search-result tr');
        var selectedItem = $('#update-popup div.search-result tr.location-selected');
        if (selectedItem.length == 0) {
            if (key == 40) {
                lRes.first().addClass('location-selected');
            } else if (key == 38) {
                lRes.last().addClass('location-selected');
            }
        } else {
            selectedItem.removeClass('location-selected');
            if (key == 40) {
                if (!selectedItem.is(':last-child')) {
                    selectedItem.next().addClass('location-selected');
                } else {
                    lRes.first().addClass('location-selected');
                }
            } else if (key == 38) {
                if (!selectedItem.is(':first-child')) {
                    selectedItem.prev().addClass('location-selected');
                } else {
                    lRes.last().addClass('location-selected');
                }
            }
        }
    },
});
$(document).ready(function () {

});