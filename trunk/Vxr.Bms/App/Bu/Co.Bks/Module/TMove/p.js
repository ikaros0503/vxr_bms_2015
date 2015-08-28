/*
 * .................Move ticket...................
 */
define({

    tripData:[],
    seatTemplates: [],

    start: function (o) {
        var me = this;
        vbv('doMoveSeats', function (e) {
            me.render();
            me.loadTrips(true);
            me.loadSeatTemplates();
        });
    },

    loadSeatTemplates: function () {
        var me = this;
        me.seatTemplates = [];
        var $toolbar = $("#moveSeatsToolbar");
        var $seatTemplatesSelect = $toolbar.find('.seatTemplates');
        $seatTemplatesSelect.html();
        vRqs({
            _a: 'fGetResource',
            _c: {
                Type: 1,
                IsPrgStatus: 1,
                CompId: app.cid
            },
            _f: "Id, Name, Info"
        }, function (u, r, l) {
            if (u == 1 && r.length > 0) {
                me.seatTemplates = r;
                console.log(r);
                for (var i = 0; i < r.length; i++) {
                    $seatTemplatesSelect.append('<option value="'+r[i][0]+'">'+r[i][1]+'</option>');
                }
            }
        });
    },

    loadTrips: function (isReloadTrips) {
        var me = this;
        var $toolbar = $("#moveSeatsToolbar");
        var $tripSelect = $toolbar.find('.tripName');
        var $tripTimeSelect = $toolbar.find('.tripTime');
        var $tripDateInput = $toolbar.find('.tripDate');
        $tripTimeSelect.html("");
        var tripId = $tripSelect.val();
        
        vdc.gTripByDate($tripDateInput.val(), '#', false, { async: false }, function (u, r, l) {
            me.tripData = r;
            if (isReloadTrips) {
                tripId = me.tripData[0][0];
                $tripSelect.html("");
            }
            for (var i = 0; i < me.tripData.length; i++) {
                if (isReloadTrips && me.tripData[i][7]==1) {
                    $tripSelect.append($('<option value="' + me.tripData[i][0] + '">' + me.tripData[i][1] + '</option>'));
                }
                if (me.tripData[i][0] == tripId) {
                    var strs = me.tripData[i][2].split('~');
                    for (var j = 0; j < strs.length; j++) {
                        $tripTimeSelect.append('<option value="' + strs[j] + '">' + strs[j] + '</option>');
                    }
                }
            }
        });
    },

    render: function () {
        var me = this;
        var $toolbar = $(me.jHtml.topBar);
        var $templateZone = $(me.jHtml.template);
        if ($("#moveSeatsToolbar").length <= 0) {
            $toolbar.insertAfter(".vbooking-container .vbooking-info .bs-callout");
        }
        if ($("#moveSeatsTemplateZone").length <= 0) {
            $templateZone.insertAfter(".vbooking-container .vbooking-sheet");
        }
        $(".vbooking-container .vbooking-info .bs-callout").addClass("col-md-6");
        $(".vbooking-container .vbooking-sheet").removeClass("col-md-12").addClass("col-md-6");

        var $tripSelect = $toolbar.find('.tripName');
        var $tripTimeSelect = $toolbar.find('.tripTime');
        var $tripDateInput = $toolbar.find('.tripDate');
        var $seatTemplatesSelect = $toolbar.find('.seatTemplates');
        var $types = $('input:radio[name=seatTemplateType]');
        var $btnLoad = $toolbar.find('.btn-loadTemplate');
        var $btnSave = $toolbar.find('.btn-saveMatrix');

        $types.filter('[value=fromTrip]').prop('checked', true);

        $seatTemplatesSelect.attr('disabled', 'disabled');

        $tripDateInput.datepicker({ dateFormat: 'dd-mm-yy' });
        $tripDateInput.datepicker('setDate', new Date());

        $tripSelect.html("");
        $tripTimeSelect.html("");
        $seatTemplatesSelect.html("");
        $(".btn-moveSeats").addClass("disabled");

        $types.on('change', function () {
            var fromTrip = $('input:radio[name=seatTemplateType]').filter('[value=fromTrip]');
            if (fromTrip[0].checked) {
                $tripSelect.removeAttr('disabled');
                $tripDateInput.removeAttr('disabled');
                $tripTimeSelect.removeAttr('disabled');
                $seatTemplatesSelect.attr('disabled', 'disabled');
            } else {
                $tripSelect.attr('disabled', 'disabled');
                $tripDateInput.attr('disabled', 'disabled');
                $tripTimeSelect.attr('disabled', 'disabled');
                $seatTemplatesSelect.removeAttr('disabled');
            }
        });

        $tripSelect.on('change', function () {
            me.loadTrips();
        });

        $tripDateInput.on('change', function () {
            me.loadTrips(); 
        });

        $btnLoad.on('click', function () {
            var isFromTrip = $('input:radio[name=seatTemplateType]').filter('[value=fromTrip]')[0].checked;
            var templateStr = "";
            if (isFromTrip) {
                var tripId=$tripSelect.val();
                var tripTime=$tripTimeSelect.val();
                var type1 = "", type2="";
                for (var i = 0; i < me.tripData.length; i++) {
                    if (me.tripData[i][7] == 1 && tripId == me.tripData[i][0]) {
                        type1 = me.tripData[i][3];
                    } else if (me.tripData[i][7] == 2 && tripId == me.tripData[i][6] && me.tripData[i][8] == tripTime) {
                        type2 = me.tripData[i][3];
                    }
                }
                templateStr = type2 != "" ? type2 : type1;
            } else {
                var seatTemplateId=$seatTemplatesSelect.val();
                for (var i = 0; i < me.seatTemplates.length; i++) {
                    if (me.seatTemplates[i][0] == seatTemplateId) {
                        templateStr = me.seatTemplates[i][2];
                        break;
                    }
                }
            }
            me.renderSeatTemplate(templateStr);
        });
    },

    renderSeatTemplate:function(str){
        var me=this;
        $("#moveSeatsTemplateZone").html(str);
    },

    jHtml: {
        topBar:
            '<div class="col-md-6" id="moveSeatsToolbar">' +
                '<div class="row">' +
                    '<div class="col-md-1 hasRadio"><input type="radio" name="seatTemplateType" value="fromTrip" id="seatTemplateType_fromTrip"><label for="seatTemplateType_fromTrip"><span></span></label></div>' +
                    '<div class="col-md-3"><select class="form-control tripName" name="tripName"></select></div>' +
                    '<div class="col-md-2"><input class="form-control tripDate" name="tripDate" id="moveSeatsDatepicker"></input></div>' +
                    '<div class="col-md-2"><select class="form-control tripTime" name="tripTime"></select></div>' +
                    '<div class="col-md-1 hasRadio"><input type="radio" name="seatTemplateType" value="fromSeatTemplate"  id="seatTemplateType_fromSeatTemplate" ><label for="seatTemplateType_fromSeatTemplate"><span></span></label></div>' +
                    '<div class="col-md-3"><select class="form-control seatTemplates" name="seatTemplates"></select></div>' +
                '</div>' +
                '<div class="row">' +
                    '<button type="button" class="disabled right btn btn-sm btn-success btn-saveMatrix"><i class="glyphicon glyphicon-save"></i>&nbsp;Save</button>' +
                    '<button type="button" class="right btn btn-sm btn-info btn-loadTemplate"><i class="glyphicon glyphicon-ok"></i>&nbsp;Load</button>' +
                '</div>' +
            '</div>',
        template:
            '<div class="col-md-6" id="moveSeatsTemplateZone">' +
                'demo'+
            '</div>'
    }
});