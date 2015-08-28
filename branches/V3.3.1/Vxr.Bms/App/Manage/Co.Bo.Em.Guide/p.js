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
    gDisGender: function (data) {
        var v = data.record.Gender;
        var obj = _.where(this.cf.options, { Id: parseInt(v) });
        if (!obj || obj.length < 1) { return ''; }
        return obj[0].Name;
    }
    //#endregion

}
);