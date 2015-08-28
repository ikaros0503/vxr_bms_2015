define({
    //#region Private Methods

    //#endregion

    //#region Callbacks
    onBeginSelectionChange: function (view, record) {
        vv.enableItem(view, 'button.delete', record != null);

    },
    //#endregion

    //#region Listeners

    //#endregion

    //#region Converters
    gDisMFInfo: function (data) {
        if (data.record) {
            var manufactureFormat = vGma(data.record.ManufactureInfo);
            return manufactureFormat[1];
        } else {
            return 'Đang cập nhật';
        }
    },

    gDisStpl: function (data) {
        return data.record.SeatTemplateInfo;
    },

    gDisMFY: function (data) {
        if (data.record) {
            var manufactureFormat = vGma(data.record.ManufactureInfo);
            return manufactureFormat[0];
        } else {
            return 'Đang cập nhật';
        }
    },
    gDisStatus: function (data) {
        var v = data.record.IsPrgStatus;
        var obj = _.where(this.cf.options, { Id: parseInt(v) });
        if (!obj || obj.length < 1) { return ''; }
        return obj[0].Name;
    },

    svcTotalSeats: function (x, v, b) {
        /// <summary>
        /// TotalSeats save converter
        /// </summary>
        /// <param name="x">Config object</param>
        /// <param name="v">Value</param>
        /// <param name="b">Base value</param>
        var s = b.SeatTemplateInfo;
        var r = vGsn(s);
        return r;
    },

    svcMFI: function (x, v, b) {
        /// <summary>
        /// ManufactureInfo save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        /// <param name="b"></param>
        if (!b) return v;
        var view = this.view;
        var val = vGmi(view.find('.manufacture-year').val(), view.find('.manufacture-info').val());
        return val;
    },

    svcStpl: function (x, v) {
        /// <summary>
        /// SeatTemplate save converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        return v + '~' + vFindById(v, x.options).Info;
    },

    rvcMI: function (x, v) {
        /// <summary>
        /// Manufacture Info read converter
        /// </summary>
        /// <param name="x"></param>
        /// <param name="v"></param>
        if (!v) return '';
        var manufactureFormat = vGma(v);
        return manufactureFormat[1];
    },

    rvcStpl: function (x, v) {
        /// <summary>
        /// SeatTemplate read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
         return vGtp(v, 'Id');
    },

    rvcMY: function (x, v) {
        /// <summary>
        /// Manufacture Year read converter
        /// </summary>
        /// <param name="v"></param>
        /// <param name="v"></param>
        if (!v) return '';
        var manufactureFormat = vGma(v);
        return manufactureFormat[0];
    },
    //#endregion
});
