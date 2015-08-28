//Extend dict
define({
        _pStyleUrl: "/Comp/10829/print.css?v=1.0.1",	  
        _tplNumCol: 4,
		_specialNumColBySeatTemplateId: {
			230: 4,
			233: 3,			
		},
      
         _sTpl: "<li class='seat {seat._notallow} {seat._half}' data-ticket-code='{seat._code}' data-position='{seat._coach}_{seat._row}_{seat._col}'><div class='{seat._class}'><div class='clearfix'><div class='seat-code'>{seat._label}</div><div class='pick'>{seat._pInfo}</div></div>"
        + "<div class='agentinfo clearfix'><p>{seat._stageName}&nbsp;{seat._fare}</p><p>{seat._suser}{seat._cuser}</p><p>{seat._note}</p><p class='cinfo'><span class='name'>{seat._cname}<span class='numT'>{seat._nTicketPerTrip}</span><span class='phone'>&nbsp;&nbsp;{seat._cphone}</p></div><div class='clearfix'><div class='buttons'>{seat.buttons}<p class='pmInfo'>{seat._pmInfo}</p></div></div></div></li>",
	     
             _epnp: {
        "10": [
            "010", "015", "016", "069",
			"070", "081", "086", "087",
			"093", "096", "098", "013",
			"080", "083", "084", "031",
			"060", "066", "067", "068",
			"071", "088", "090", "097",
			"018", "039", "038", "023",
			"011", "012", "014", "017",
			"061", "076", "077", "078",
			"079", "085", "089", "092",
			"095", "099", 
        ],
       
    },  
       

});
