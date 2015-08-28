define({

    routes: [],

    onBeginSelectionChange: function (view, record) {
        vv.enableItem(view, 'button.delete', record != null);
    },

    onItemLoaded: function (record) {
    },
    onAfterUnloadItem: function () {
    },
    afterReload: function (models) {
    },
    onPhoiDelete: function () {
        this.onBasicDelete();
    },

    onPhoiSave: function () {
        var me = this, o = me.o, view = o.view;
        var hasError = false;
        var msg = '';

        var cf = $(view).find('.html');
        if (cf.val() =="") {
            hasError = true;
            msg += 'Vui long nhap html. \n';
        }
        
        var nf = $(view).find('.name');
        if (!vIsEstStr(nf.val())) {
            hasError = true;
            msg += 'Vui lòng nhập tên. \n';
        };
        
        if (hasError) {
            vv.showMessage({
                element: view.find('.alert.message'),
                type: 'alert-danger',
                content: msg
            });
        } else {
            me.onBasicSave();
        }
    },

    gDisOrientation: function (data) {
        return data.record.Orientation == 0 ? "Portrait" : "Landscape";
    },

    svcOrientation: function (data) {
        return $(this.o.view).find('.orientation').val();
    }

});