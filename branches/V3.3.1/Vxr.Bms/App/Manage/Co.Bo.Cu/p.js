define({
    onBeginSelectionChange: function(view, record) {
        vv.enableItem(view, 'button.delete', record != null);

    },
    onVMLoaded: function () {
        var self = this;
        $(document).on("click", ".jtable-column-header-sortable", function () {
            var isDesc = !$(this).hasClass('jtable-column-header-sorted-asc');
            var field = '';
            if ($(this).text() == 'Đặt chỗ') {
                field = 'BookingTicket';
            } else if ($(this).text() == 'Tổng tiền') {
                field = 'MoneySum';
            } else if ($(this).text() == 'Đã hủy') {
                field = 'CancelTicket';
            }
            else if ($(this).text() == 'Đã đi') {
                field = 'BookedTicket';
            }
            self.o.gridSortBy = { Name: field, IsDesc: isDesc };
            self._reloadTable();
        });

    },
    gDisGender: function (data) {
        var v = data.record.Gender;
        var obj = _.where(this.cf.options, { Id: parseInt(v) });
        if (!obj || obj.length < 1) { return ''; }
        return obj[0].Name;
    },

    gDisTotal: function (data) {
        return vToMn(data.record.MoneySum) + 'đ';
    }

});