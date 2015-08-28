define({
    onVMLoaded: function () {
        $(this.o.jHtml.placeToInsertTable).append(this.o.jHtml.tabTpl);
        $(this.o.jHtml.placeToInsertTable).parent().append(this.o.jHtml.tableTpl);
        $(this.o.jHtml.searchResultMenu).remove();
        $(this.o.jHtml.searchBarInput).val("");
        this.loadCustomer();
    },

    loadCustomer: function () {
        /// <summary>Load customer info base on phone</summary>
        var self = this;
        if (app.cusphone == 'undefined' || app.cusphone == null) return;
        vRqs({
            _a: self.o.jVar.getCustomerFunction,
            _c: { Phone: app.cusphone, CompId:app.cid },
            _f: self.o.jVar.getCustomerFields,
        }, function (u, r, l, t) {
            if (r.length > 0) {
                $(self.o.jHtml.inputCustomerId).val(r[0][0]);
                $(self.o.jHtml.inputCustomerName).val(r[0][1]);
                $(self.o.jHtml.inputCustomerPhone).val(r[0][2]);
                $(self.o.jHtml.inputCustomerEmail).val(r[0][3]);
                $(self.o.jHtml.inputCustomerAddress).val(r[0][4]);
                $(self.o.jHtml.selectCustomerGender).val(r[0][5]);
                $(self.o.jHtml.inputCustomerBirthday).datepicker('setDate',
                    new Date(r[0][6] != null ? new Date(parseInt(r[0][6].substring(r[0][6].indexOf('(') + 1).replace(')/', ''))) : ''));
                $(self.o.jHtml.inputCustomerNote).val(r[0][7]);
                self.getTrips('U');
                self.getTrips('P');
                self.getTrips('C');
            } else {
                self.showError(self.o.jVar.getCustomerErrorString);
            }
        });
    },

    onUpdateInfo: function () {
        var self = this;
        //validate
        var data = {
            Id:$(this.o.jHtml.inputCustomerId).val(),
            Name: $(this.o.jHtml.inputCustomerName).val(),
            Phone: $(this.o.jHtml.inputCustomerPhone).val(),
            Email: $(this.o.jHtml.inputCustomerEmail).val(),
            Gender: $(this.o.jHtml.selectCustomerGender).val(),
            AddressInfo:$(this.o.jHtml.inputCustomerAddress).val(),
            Birthday:this.toDbDateString(new Date($(this.o.jHtml.inputCustomerBirthday).datepicker('getDate'))),
            Note:$(this.o.jHtml.inputCustomerNote).val()
        };

        //validate
        if (this.isNullOrEmpty(data.Id)) {
            return;
        }else if (this.isNullOrEmpty(data.Name)) {
            this.showError(this.o.jVar.updateErrorName);
            $(this.o.jHtml.inputCustomerName).focus();
            return;
        } else if (this.isNullOrEmpty(data.Phone)) {
            this.showError(this.o.jVar.updateErrorPhone);
            $(this.o.jHtml.inputCustomerPhone).focus();
            return;
        }
              
        //update
        vRqs({
            _a: self.o.jVar.updateFunction,
            _c: { Id: data.Id },
            _d: data,
        }, function (u, r, l, t) {
            if (u == 1) {
                self.showSuccess(self.o.jVar.updateSuccess);
            } else {
                self.showError(self.o.jVar.updateError);
            }
        });
    },

    getTrips: function (type) {
        /// <summary>Get customer's trip</summary>
        /// <param name="type" type="string">Type of trips (U, P, or C)</param>
        var self = this, uTrips = [], pTrips=[], cTrips = [];
        vRqs({
            _a: this.o.jVar.getCustomerTicketsFunction,
            _ft: vtpl(
                type == 'U' ? this.o.jVar.getTripConditions_U :
                type == 'P' ? this.o.jVar.getTripConditions_P :
                type == 'C' ? this.o.jVar.getTripConditions_C : '',
                {
                    id: $(this.o.jHtml.inputCustomerId).val(),
                    compId: app.cid,
                    date: self.toDbDateString(new Date())
                }),
            _se: this.o.jVar.getCustomerTicketsSort,
            _f: this.o.jVar.getCustomerTicketsFields,
            _si: type == 'U' ? this.o.jVar.pageU.current : type == 'P' ? this.o.jVar.pageP.current : this.o.jVar.pageC.current,
            _mr: type == 'U' ? this.o.jVar.pageU.itemsPerPage : type == 'P' ? this.o.jVar.pageP.itemsPerPage : this.o.jVar.pageC.itemsPerPage,
        }, function (u, r, l, t) {
            if (type == 'U') {
                $(self.o.jHtml.countU).html(t);
                (r.length > 0) ? self.renderTable(self.o.jHtml.tableU, r) : $(self.o.jHtml.tableU).html(self.o.jHtml.noTicket_U);
                self.o.jVar.pageU.totalRecords = t;
                self.o.jVar.pageU.total = Math.ceil(((t == 0) ? 1 : t) / self.o.jVar.pageU.itemsPerPage);
            } else if (type == 'P') {
                $(self.o.jHtml.countP).html(t);
                (r.length > 0) ? self.renderTable(self.o.jHtml.tableP, r) : $(self.o.jHtml.tableP).html(self.o.jHtml.noTicket_P);
                self.o.jVar.pageP.totalRecords = t;
                self.o.jVar.pageP.total = Math.ceil(((t == 0) ? 1 : t) / self.o.jVar.pageP.itemsPerPage);
            } else if (type == 'C') {
                $(self.o.jHtml.countC).html(t);
                (r.length > 0) ? self.renderTable(self.o.jHtml.tableC, r) : $(self.o.jHtml.tableC).html(self.o.jHtml.noTicket_C);
                self.o.jVar.pageC.totalRecords = t;
                self.o.jVar.pageC.total = Math.ceil(((t == 0) ? 1 : t) / self.o.jVar.pageC.itemsPerPage);
            }
            self.updatePage(type);
        });
    },

    renderTable:function(tbd, arr) {
        if (arr.length <= 0) return;
        $(tbd).html("");
        for (var i = 0; i < arr.length; i++) {
            $(tbd).append(
                vtpl(this.o.jHtml.ticketRow, {
                    code: arr[i][2],
                    route: arr[i][3],
                    pickupDate: this.toDateString(arr[i][4] != null ? new Date(parseInt(arr[i][4].substring(arr[i][4].indexOf('(') + 1).replace(')/', ''))) : ''),
                    seat: arr[i][5] != null ? arr[i][5].split('|')[0] : '',
                    money: vToMn(arr[i][6]),
                    issueDate: this.toDateString(arr[i][8] != null ? new Date(parseInt(arr[i][8].substring(arr[i][8].indexOf('(') + 1).replace(')/', ''))) : ''),
                    status: arr[i][7] == 1 ? this.o.jVar.statusBooked: (arr[i][7] == 2) ? this.o.jVar.statusPaid : this.o.jVar.statusCancelled,
                    account: arr[i][9],
                    note: arr[i][10] == null ? '' : arr[i][10]
                })
            );
        }
    },

    updatePage: function (type) {
        var self = this;
        var $divPage = $(vtpl(this.o.jHtml.divPage, { type: type }))
            .html("")
            .attr("style", this.o.jHtml.divPageStyle);
        
        var total = type == 'U' ? self.o.jVar.pageU.total : type == 'P' ? self.o.jVar.pageP.total : self.o.jVar.pageC.total;
        var current = type == 'U' ? self.o.jVar.pageU.current : type == 'P' ? self.o.jVar.pageP.current : self.o.jVar.pageC.current;
        var itemsPerPage = type == 'U' ? self.o.jVar.pageU.itemsPerPage : type == 'P' ? self.o.jVar.pageP.itemsPerPage : self.o.jVar.pageC.itemsPerPage;

        var $ul = $(this.o.jHtml.paginationContainer)
            .append(vtpl(this.o.jHtml.paginationButtonFirst, { type: type, page: 1 }))
            .append(vtpl(this.o.jHtml.paginationButtonPrevious, { type: type, page: (current - 1) }));
        
        var $sel = $(vtpl(this.o.jHtml.paginationSelectPage, { type: type }));
        for (var index = 1; index <= total; index++) {
            $sel.append(vtpl(this.o.jHtml.selectPageOption, { page: index }));
            $ul.append(vtpl(index == current ? this.o.jHtml.paginationButtonCurrent : this.o.jHtml.paginationButtonNumber, { type: type, page: index }));
        }
        
        $divPage
            .append(
                $ul.append(vtpl(this.o.jHtml.paginationButtonNext, { type: type, page: (current + 1) }))
                    .append(vtpl(this.o.jHtml.paginationButtonLast, { type: type, page: total })))
            .append(
                $(this.o.jHtml.paginationGroupSelect)
                .append(this.o.jHtml.paginationSelectPageLabel)
                .append($sel)
                .append(this.o.jHtml.paginationSelectItemsPerPageLabel)
                .append($(vtpl(this.o.jHtml.paginationSelectItemsPerPage, { type: type })))
            );
        $(vtpl(this.o.jHtml.selectPage, { type: type })).val(current);
        $(vtpl(this.o.jHtml.selectItemsPerPage, { type: type })).val(itemsPerPage);
        
        this.setVisibility(vtpl(self.o.jHtml.firstPageButton, {type:type}), total > 1 && current > 1);
        this.setVisibility(vtpl(self.o.jHtml.previousPageButton, { type: type }), total > 1 && current > 1);
        this.setVisibility(vtpl(self.o.jHtml.nextPageButton, { type: type }), total > 1 && current < total);
        this.setVisibility(vtpl(self.o.jHtml.lastPageButton, { type: type }), total > 1 && current < total);
        this.setVisibility(vtpl(self.o.jHtml.selectPage, { type: type }), total > 1);

        $(vtpl( self.o.jHtml.paginationAllButtons, {type:type})).click(function () {
            if (!$(this).parent().hasClass(self.o.jHtml.classToDisableButton)) {
                var dataType = $(this).attr(self.o.jHtml.typeAttribute);
                if (dataType == "U") {
                    self.o.jVar.pageU.current = parseInt($(this).attr(self.o.jHtml.indexAttribute));
                } else if (dataType == "P") {
                    self.o.jVar.pageP.current = parseInt($(this).attr(self.o.jHtml.indexAttribute));
                } else if (dataType == "C") {
                    self.o.jVar.pageC.current = parseInt($(this).attr(self.o.jHtml.indexAttribute));
                }
                self.getTrips(dataType);
            }
        });
        $(vtpl(this.o.jHtml.selectPage, {type:type})).on("change", function (e) {
            var dataType = $(this).attr(self.o.jHtml.typeAttribute);
            if (dataType == "U") {
                self.o.jVar.pageU.current = parseInt($(this).val());
            } else if (dataType == "P") {
                self.o.jVar.pageP.current = parseInt($(this).val());
            } else if (dataType == "C") {
                self.o.jVar.pageC.current = parseInt($(this).val());
            }
            self.getTrips(dataType);
        });
        $(vtpl(this.o.jHtml.selectItemsPerPage, { type: type })).on("change", function (e) {
            var dataType = $(this).attr(self.o.jHtml.typeAttribute);
            if (dataType == "U") {
                self.o.jVar.pageU.itemsPerPage = parseInt($(this).val());
            } else if (dataType == "P") {
                self.o.jVar.pageP.itemsPerPage = parseInt($(this).val());
            } else if (dataType == "C") {
                self.o.jVar.pageC.itemsPerPage = parseInt($(this).val());
            }
            self.getTrips(dataType);
            
        });
    },

    toDateString: function (date) {
        return (date.getDate() <= 9 ? '0' : '') + date.getDate() + (date.getMonth() <= 8 ? '-0' : '-') + (date.getMonth() + 1) + '-' + date.getFullYear() + (date.getHours() <= 9 ? ' 0' : ' ') + date.getHours() + (date.getMinutes() <= 9 ? ':0' : ':') + date.getMinutes() + (date.getSeconds() <= 9 ? ':0' : ':') + date.getSeconds();
    },

    toDbDateString: function (date) {
        return date.getFullYear() + (date.getMonth() <= 8 ? '-0' : '-') + (date.getMonth() + 1) + (date.getDate() <= 9 ? '-0' : '-') + date.getDate() + (date.getHours() <= 9 ? ' 0' : ' ') + date.getHours() + (date.getMinutes() <= 9 ? ':0' : ':') + date.getMinutes() + (date.getSeconds() <= 9 ? ':0' : ':') + date.getSeconds();;
    },

    showError: function (msg) {
        vv.showMessage({ element: $(this.o.jHtml.alertMesageContainer), type:this.o.jHtml.alertMesageError, content: msg });
    },

    showSuccess: function (msg) {
        vv.showMessage({ element: $(this.o.jHtml.alertMesageContainer), type: this.o.jHtml.alertMesageSuccess, content: msg });
    },

    isNullOrEmpty: function (s) {
        /// <summary>Check string is null or emppty</summary>
        /// <param name="s" type="string">String to be checked</param>
        /// <returns type="boolean">True if string is null, empty or undefined</returns>
        return !(s != 'undefined' && s != null && s.length != 'undefined' && s.length > 0);
    },

    setVisibility: function (button, isVisible) {
        /// <summary>Set button visibility</summary>
        /// <param name="button" type="element">Element to be set</param>
        /// <param name="isVisible" type="boolean">Value of element's visibility</param>
        isVisible ? $(button).removeClass(this.o.jHtml.classToDisableButton) : $(button).addClass(this.o.jHtml.classToDisableButton);
    }
});