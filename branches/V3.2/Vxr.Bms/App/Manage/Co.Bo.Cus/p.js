define({
    pager: null,
    settings: {},
    result: {},
    start: function () {
        var me = this;
        me.init();
        me.render();
        me.bindEvents();
        me.getCustomers();
        return me;
    },

    init:function(){
        var me = this;
        var filter = {
            toDate: moment(new Date()).format("YYYY-MM-DD"),
            fromDate: moment(new Date()).day(-7).format("YYYY-MM-DD"),
            names: [],
            phones: [],
            email: [],
            orderField: 'BookingTime',
            orderType: 'desc',
        };
        
        me.settings = {
            filter: filter,
        };

        me.result = { customers: [] };
        me.pager = new Pager();
        me.pager = new Pager(1, 10, "#customerManager div.paging", 5, function () {
            me.render();
        });
        return me;
    },

    render: function () {
        var me = this;
        $(".ui-layout-south").hide();
        var $tbody = $("#tbodyCustomers");
        $tbody.html("");
        $("#customerManager div.title span.subtitle").text(
            moment(me.settings.filter.fromDate).format("DD-MM-YYYY") + " → " + moment(me.settings.filter.toDate).format("DD-MM-YYYY")
            )
        ;
        
        if (me.result.customers.length > 0) {
            for (var i = me.pager.getStartItem() ; i <= me.pager.getEndItem() ; i++) {
                var $row = $(vtpl($("#customerRowItemTemplate").html(), me.result.customers[i]));
                $tbody.append($row);
            }
        }

        me.pager.render();

        $("#customerManager td span.showDetail").on('click', function () {
            app.cusId = $(this).attr("data-id");
            app.cusFromDate = me.settings.filter.fromDate;
            app.cusToDate = me.settings.filter.toDate;
            $("#showCustomerProfile").trigger('click');
        });


        return me;
    },

    updateFilter:function(){
        var me = this;
        var $container = $("#customerManager");
        var timeRange=$container.find("select.timeRange").val();
        if (timeRange == "custom") {
            me.settings.filter.fromDate = formatDatepicker($container.find("input.fromDate"), "YYYY-MM-DD");
            me.settings.filter.toDate = formatDatepicker($container.find("input.toDate"), "YYYY-MM-DD");
        } else if (timeRange=="month") {
            me.settings.filter.toDate = moment(new Date()).format("YYYY-MM-DD");
            me.settings.filter.fromDate = moment(new Date()).month(-1).format("YYYY-MM-DD");
        } else if (timeRange == "week") {
            me.settings.filter.toDate = moment(new Date()).format("YYYY-MM-DD");
            me.settings.filter.fromDate = moment(new Date()).day(-7).format("YYYY-MM-DD");
        }

        me.settings.filter.names = [];
        me.settings.filter.phones = [];
        me.settings.filter.emails = [];

        $container.find(".filterCloud .tagItem").each(function () {
            if ($(this).attr("data-type") == "phone") me.settings.filter.phones.push($(this).attr("data-value"));
            if ($(this).attr("data-type") == "email") me.settings.filter.emails.push($(this).attr("data-value"));
            if ($(this).attr("data-type") == "name") me.settings.filter.names.push($(this).attr("data-value"));
        });

        var $desc = $container.find("div.filter-desc.isselected");
        
        if ($desc.length > 0) {
            me.settings.filter.orderField = $desc.attr("data-field");
            me.settings.filter.orderType = "desc";
        }
        var $asc = $container.find("div.filter-asc.isselected");
        if ($asc.length > 0) {
            me.settings.filter.orderField = $asc.attr("data-field");
            me.settings.filter.orderType = "asc";
        }

        return me;
    },

    getCustomers: function () {
        var me = this;

        var arrayToString = function (arr) {
            if (arr == null || arr.length <= 0) return "";
            var resultStr = "";
            for (var i = 0; i < arr.length; i++) {
                resultStr = resultStr + arr[i] + ",";
            }
            return resultStr;
        };

        me.setStatus("loading");
        me.result.customers = [];

        vRqs({
            _a: 'GetCustomers',
            fromDate: me.settings.filter.fromDate,
            toDate: me.settings.filter.toDate,
            compId: app.cid,
            names: replaceUnicodeCharacter(arrayToString(me.settings.filter.names)),
            phones: arrayToString(me.settings.filter.phones),
            emails: arrayToString(me.settings.filter.emails),
            order: me.settings.filter.orderField + " " + me.settings.filter.orderType,

        }, function (u, r, l) {
            if (u == 1 && r.length > 0) {
                var index = 1;
                for (var i = 0; i < r.length; i++) {
                    var cus = {
                        index:index++,
                        id: r[i][0],
                        name: r[i][1],
                        phone:r[i][2],
                        gender: r[i][3] == 1 ? "male" : "female",
                        email: r[i][4],
                        address: r[i][5],
                        note: r[i][6],
                        bookingTicket: r[i][7],
                        bookingTime: r[i][8],
                        passTicket: r[i][9],
                        passTime: r[i][10],
                        cancelTicket: r[i][11],
                        cancelTime: r[i][12],
                        totalMoney: r[i][13]
                    };                    
                    me.result.customers.push(cus);
                }
                me.pager.updateInfo(me.result.customers.length, 1).render();
                me.setStatus("");
            } else if (u==1 && r.length==0) {
                me.setStatus("noResult");
            }else if (u != 1 ) {
                me.setStatus("error");
            }
        });
        return me;
    },

    bindEvents: function () {
        var me = this;
        var $container = $("#customerManager");
        var addNewTagItem = function () {
            var text = $container.find("input.filterValue").val();
            if (text == "") return;
            var $tag = $(vtpl($("#tagItemTemplate").html(), {
                field: $container.find("select.filterSelect").val(),
                value: $container.find("input.filterValue").val()
            }));
            $container.find(".filterCloud").append($tag);
            $container.find("input.filterValue").val("");
        };

        $container.find("input.fromDate").datepicker({ dateFormat: 'dd-mm-yy' });
        $container.find("input.toDate").datepicker({ dateFormat: 'dd-mm-yy' });
        $container.find("input.fromDate").datepicker('setDate', new Date());
        $container.find("input.toDate").datepicker('setDate', new Date());

        $container.find("button.add").on('click', function () {
            addNewTagItem();
        });

        $container.find("select.filterSelect").on('change', function () {
            $container.find("input.filterValue").removeClass("phone").removeClass("name").removeClass("email");
            $container.find("input.filterValue").addClass($(this).val());

        });

        $container.find("input.filterValue").on('keyup', function (e) {
            if ($(this).val() != "") {
                $container.find("button.add").removeClass("disabled");
                $container.find("button.add").removeAttr("disabled");
            } else {
                $container.find("button.add").addClass("disabled");
                $container.find("button.add").attr("disabled", "disabled");
            }
        });

        $(document).on('click', '.tagItem .close-button', function () {
            var $item = $(this).parent();
            $item.remove();
        });

        $container.find("input.filterValue").on('keypress', function (e) {
            if (e.keyCode == 13) {
                addNewTagItem();
            }
        });

        $container.find("select.timeRange").on('click', function () {
            var time = $(this).val();
            if (time != 'custom') {
                $(this).addClass('full');
                $container.find("input.fromDate").hide();
                $container.find("input.toDate").hide();
            } else {
                $(this).removeClass('full');
                $container.find("input.fromDate").show();
                $container.find("input.toDate").show();
            }
        });

        $container.find("button.searchCustomer").on('click', function () {
            me.updateFilter().getCustomers();
        });

        $container.find("div.filter-asc").on('click', function () {
            $container.find("div.filter-asc").removeClass('isselected');
            $container.find("div.filter-desc").removeClass('isselected');
            $(this).addClass("isselected");
            me.updateFilter().getCustomers();
        });

        $container.find("div.filter-desc").on('click', function () {
            $container.find("div.filter-asc").removeClass('isselected');
            $container.find("div.filter-desc").removeClass('isselected');
            $(this).addClass("isselected");
            me.updateFilter().getCustomers();
        });

        return me;
    },

    setStatus: function (status) {
        var me = this;
        if (status == "loading") {
            $("#tbodyCustomers").html('<tr><td class="information" class="message" colspan="11"><div class="spinner"></div></td></tr>');
            me.pager.setVisible(false);
        } else if (status == "error") {
            $("#tbodyCustomers").html('<tr><td class="information" colspan="11">Đã có lỗi xảy ra, vui lòng thử lại trong giây lát!</td></tr>');
            me.pager.setVisible(false);
        } else if (status == "noResult") {
            $("#tbodyCustomers").html('<tr><td class="information" colspan="11">Không có khách hàng nào thỏa mãn yêu cầu bạn tìm cả</td></tr>');
            me.pager.setVisible(false);
        }
        else {
            me.pager.setVisible(true);
        }
    }

});