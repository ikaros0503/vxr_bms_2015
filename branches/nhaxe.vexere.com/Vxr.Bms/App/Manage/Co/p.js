define({
    //#region Private Methods

    //#endregion

    //#region Callbacks

    afterReload: function (models) {
        this._loadItem(models[0]);
        this.model = models[0];
    },

    onBeginSelectionChange: function (view, record) {
        vv.enableItem(view, 'button.delete', record != null);

    },
    //#endregion

    //#region Listeners

    onBasicUpdateOnly: function () {
        var me = this;
        if (me.model.Id) me._onBasicUpdate(me.model.Id);
    },

    //#endregion

    //#region Converters

    //#endregion
});