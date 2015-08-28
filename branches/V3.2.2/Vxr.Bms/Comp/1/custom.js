//Extend dict
(function ($) {
    $.extend(_dict, _dict,
    {
		_pStyleUrl: "/Content/extend/1/print.css?v=1.0.9",
		_hasPickUpOnPrintBKS: false,		
		_psTpl: "<li class='print-seat'><table class='table no-border table-condensed'>"
				+ "<tbody>"
				+ "<tr style='height: 18px;'><td><p class='pseat-code'>{pseat._label}</p><p class='ppayment {pseat._paid} {pseat._exported}'>{pseat._pmInfo}</p></td></tr>"
				+ "<tr><td><p class='pcname'>{pseat._cname}&nbsp;<b class='ntk-pertrip'>{pseat._nTicketPerTrip}</b></p><p class='pcphone'>{pseat._cphone}</p><p class='pnote'>{pseat._note}&nbsp;{pseat._fare}</p></td></tr>"				
				+ "</tbody>"
				+ "</table></li>",
		_hasBTWarning: true,
		 _tplNumCol: 4,
		_frule: [
        [["UpdateForm", ["Serial", "RoundTripCode", "FromArea", "ToArea"]], ["ValidForm", ["PassCode"]]],
        [
            [1, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]],
            [2, [["UpdateForm", ["KeepOnTime", "Fare", "PaymentType", "BranchName", "ChargeCode", "DriverName"]], ["ValidForm", ["PassCode"]]]],
            [3, [["UpdateForm", ["PhoneNumbers", "FullName", "PickupInfo", "TransferInfo", "Fare", "Surcharge", "PaymentType", "Serial", "Note", "KeepOnTime"]], ["ValidForm", ["PassCode"]]]],
            [5, [["UpdateForm", ["KeepOnTime"]]]],
            [8, [["UpdateForm", ["Notcome"]], ["ValidForm", ["Status", "FromValid", "ToValid", "CancelFee"]]]]
        ]
    ], //Multiple ticket, status of ticket, not same value
    });
})(jQuery);