define({
    start: function () {
        try {
            var o = {
                x: "#FilterForm input[name=DepartureDate]",
                xp: "#FilterForm a[name=PreDate]",
                np: "#FilterForm a[name=NexDate]"
            };
            this._bindDateEvents(o);
        } catch (e) {
            console.error(e);
        }
    },

    _bindDateEvents: function (o) {
        var x = $(o.x), me = this;
        if (x.length > 0) {
            vev(o.x, 'change', function (e) {
                app.cDate = x.datepicker('getDate');
                vbf('fDateChange');
            });
            //update by Thanh
            vev(o.xp, 'click', function (e) {
                var d1 = x.val().split(' ');
                var dateParts = d1[2].split('-');
                var d = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
                d.setDate(d.getDate() - 1);
                x.datepicker('setDate', new Date(d));
                x.trigger('change');
            });
            vev(o.np, 'click', function (e) {
                var d1 = x.val().split(' ');
                var dateParts = d1[2].split('-');
                var d = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
                d.setDate(d.getDate() + 1);
                x.datepicker('setDate', new Date(d));
                x.trigger('change');
            });
            // Body event
            vbv('fEnableDate', function (e) { x.prop('disabled', false); });
            vbv('fDisableDate', function (e) { x.prop('disabled', true); });
            vbv('fSetDate', function (e) {
                x.datepicker('setDate', e.d.value);
                app.cDate = e.d.value;
            });
        } else {
            setTimeout(function () { me._bindDateEvents(o); }, 50);
        }
    }
})