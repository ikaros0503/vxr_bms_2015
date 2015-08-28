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
    gDisAgentId: function (data) {
        
        var arr = this.cf.options;
        var id = data.record.AgentId;
        var name = $('select.agent-id option[value=' + id + ']').text();
        return name;
        
    },

    gDisGender: function (data) {
        var v = data.record.Gender;
        var obj = _.where(this.cf.options, { Id: parseInt(v) });
        if (!obj || obj.length < 1) { return ''; }
        return obj[0].Name;
    },
    //#endregion
});
