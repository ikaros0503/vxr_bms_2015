define({
    start: function (o) {
        var me = this;
        me.o = o;
        me._bindEvent();

        $('body').unbind('fTripStart').on('fTripStart', function (e) {
            //console.log(e.pr);
            var listTrips = [];
            var source = $("#" + o._xType).html();
            var data = {}
            // create obj for get Trip
            var obj = $._createGetFrameObj();

            var sRequest = function (u, r, l, t) {
                if (u != 1 || l <= 0) {
                    // Not found
                    return;
                }
                //console.log(123);
                //var ev = jQuery.Event("fTripReady");
                //ev.r = r;
                //$('body').trigger(ev);

                $.each(r, function (kl, kv) {
                    listTrips.push({
                        TripId: kv[0],
                        TripName: kv[1]
                    });
                });

                data._name = o._name;
                data._lTrips = listTrips;
                var $fTrip = Handlebars.compile(source)(data);
                $('#FilterForm').append($fTrip);
                $._bindEventOnFTrip(o);
            };
            // submit request to get Trip
            vRqs(obj, sRequest, { async: false });
        });

        $('body').unbind('fTripGetTrip').on('fTripGetTrip', function (e) {
            //var obj = $._createGetFrameObj(e.in);
            var sRequest = function (u, r, l, t) {
                if (u != 1 || l <= 0) {
                    // Not found
                    return;
                }
                var ev = jQuery.Event("fTripReady");
                ev.r = r;
                if (e.cb != undefined) {
                    ev.cb = e.cb;
                }
                $('body').trigger(ev);
            }

            // submit request to get Trip
            //vRqs(obj, sRequest, { async: false });
            vdc.gTripByDate(e.in, '#', e.reload, { async: false }, sRequest);
        });
    },

    // Private function
    _bindEvent: function () {
        var me = this;
        //$(me.o._e).unbind().on('change', function (ev) {
        if ($('#FilterForm select[name=TripId]').length > 0) {
            vev('#FilterForm select[name=TripId]', 'change', function (ev) {
                var value = this.value;
                var selectedIndex = this.selectedIndex;
                vbf('fTripChange', { value: value, selectedIndex: selectedIndex });
            });
        } else {
            setTimeout(function() {
                me._bindEvent();
            }, 50);
        }
    }
});

$(document).ready(function () {
    $._bindEventOnFTrip = function (o) {

    },
    $._createGetFrameObj = function (date) {
        var tripDate = new Date();
        if (date) {
            tripDate = date;
        }
        tripDate.setHours(0);
        tripDate.setMinutes(0);
        tripDate.setSeconds(0);
        var d = "(type = 1 or (type = 2 and Time is not null and $x = N'" + tripDate.toFormatString('iso') + "')) order by type,name asc";
        //Create 
        var obj = {};
        obj._a = "fGetTrip";
        obj._c = {
            CompId: app.cid,
            IsPrgStatus: "$x != 3",
            Date: d
        };
        obj._f = "Id, Name, Info, SeatTemplateInfo, FareInfo, StatusInfo, BaseId, Type, Time, Alias, TeamInfo, VehicleInfo, FromArea, ToArea, Note, RouteInfo, SeatSummaryInfo, TotalSeats, ClosedStatus, PassengerMoney, ProductMoney, FeeMoney, BranchReceiveProduct, RealDepartureTime, PickedPointsInfo, TransferPointsInfo, NewFare";
        return obj;
    }
});
