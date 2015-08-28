//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
        // _sTpl: "<li class='seat {seat._half}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div><div class='note'>{seat._note}</div></div>"
        //+ "<div class='clearfix'><div class='buttons'>{seat.buttons}</div><div class='cinfo'><p class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span>{seat._pmInfo}</span></p><p class='phone'>{seat._cphone}</p></div></div></div></li>",
        _pSpecialPos: {
            40: {
                "1_2_1": [1, 3, 1], "1_2_3": [1, 3, 3], "1_2_5": [1, 3, 5],
                "1_3_1": [1, 5, 1], "1_3_3": [1, 5, 3], "1_3_5": [1, 5, 5],
                "1_4_1": [1, 7, 1], "1_4_3": [1, 7, 3], "1_4_5": [1, 7, 5],
                "1_5_1": [1, 9, 1], "1_5_3": [1, 9, 3], "1_5_5": [1, 9, 5],
                "1_6_1": [1, 11, 1], "1_6_2": [1, 11, 2], "1_6_3": [1, 11, 3], "1_6_4": [1, 11, 4], "1_6_5": [1, 11, 5],
                "2_1_1": [1, 2, 1], "2_1_3": [1, 2, 3], "2_1_5": [1, 2, 5],
                "2_2_1": [1, 4, 1], "2_2_3": [1, 4, 3], "2_2_5": [1, 4, 5],
                "2_3_1": [1, 6, 1], "2_3_3": [1, 6, 3], "2_3_5": [1, 6, 5],
                "2_4_1": [1, 8, 1], "2_4_3": [1, 8, 3], "2_4_5": [1, 8, 5],
                "2_5_1": [1, 10, 1], "2_5_3": [1, 10, 3], "2_5_5": [1, 10, 5],
                "2_6_1": [1, 12, 1], "2_6_2": [1, 12, 2], "2_6_3": [1, 12, 3], "2_6_4": [1, 12, 4], "2_6_5": [1, 12, 5]
            }
        },
        _pNoSeat: true,
        _pStyleUrl: "/Comp/261/print.css?v=1.0.3",
        _pTplNumCoach: 1,
    });

})(jQuery);