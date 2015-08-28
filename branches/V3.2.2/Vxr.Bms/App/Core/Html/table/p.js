function getMasterCellFormat(v) {
    return "<span class='vMasterRow'>" + v + "</span>";
}

(function ($) {
    $.extend(true, $.hik.jtable.prototype, {
        _ajax: function (options) {
            var self = this;
            var opts = $.extend({}, this.options.ajaxSettings, options);
            if (!opts.url) {
                return;
            }
            if (opts.data == null || opts.data == undefined) {
                opts.data = {};
            } else if (typeof opts.data == 'string') {
                opts.data = self._convertQueryStringToObject(opts.data);
            }

            var qmIndex = opts.url.indexOf('?');
            if (qmIndex > -1) {
                $.extend(opts.data, self._convertQueryStringToObject(opts.url.substring(qmIndex + 1)));
            }

            opts.data = JSON.stringify(opts.data);
            opts.contentType = 'application/json; charset=utf-8';

            //Override success
            opts.success = function (data) {
                data = self._normalizeJSONReturnData(data);
                if (options.success) {
                    options.success(data);
                }
            };

            //Override error
            opts.error = function () {
                if (options.error) {
                    options.error();
                }
            };

            //Override complete
            opts.complete = function () {
                if (options.complete) {
                    options.complete();
                }
            };

            $.ajax(opts);
        },

        _deselectRows: function ($rows) {
            this.options.deselectedId = $rows.attr('data-record-key');
            $rows.removeClass('jtable-row-selected ui-state-highlight');
            if (this.options.selectingCheckboxes) {
                $rows.find('>td.jtable-selecting-column >input').prop('checked', false);
            }

            this._refreshSelectAllCheckboxState();
        },

        _addPagingInfoToUrl: function (url, pageNumber) {
            if (!this.options.paging) {
                return url;
            }
            var jtStartIndex = (pageNumber - 1) * this.options.pageSize;
            var jtPageSize = this.options.pageSize;

            return url == null ? null : (url + (url.indexOf('?') < 0 ? '?' : '&') + 'jtStartIndex=' + jtStartIndex + '&jtPageSize=' + jtPageSize);
        },

        addLocalRecords: function (cb) {
            var me = this;
            me.options.actions.listAction = cb;
            me._reloadTable();
            //this._addRecordsToTable(records);
        },

        removeAllRows: function () {
            var me = this;
            this._removeAllRows('reloading');
            if(!me._selectedRecordIdsBeforeLoad) me._selectedRecordIdsBeforeLoad = [];
            me._onRecordsLoaded({ Result: 1, Records: null, TotalRecordCount: 0, page: 0 });
        },

        getTotalRow: function () {
            var totalRowCount = this._$tableRows.length;
            return totalRowCount;
        },

        //TODO: Check?
        _createFieldAndColumnList: function () {
            var self = this;
            // self._columnList = ['Name', 'Date', 'Time', 'SeatTemplateInfo', 'FareInfo', 'Driver', 'Note'];
            var sortableList = [];

            $.each(self.options.fields, function (name, props) {
                //Add field to the field list
                self._fieldList.push(name);

                //Check if this field is the key field
                if (props.key == true) {
                    self._keyField = name;
                }

                //Add field to column list if it is shown in the table
                if (props.list != false && props.type != 'hidden') {
                    //console.log(name);
                    // self._columnList.push(name);
                    sortableList.push({ idx: props.idx, name: name });
                }

            });

            sortableList.sort(function (a, b) {
                var a1 = a.idx, b1 = b.idx;
                if (a1 == b1) return 0;
                return a1 > b1 ? 1 : -1;
            });

            $.each(sortableList, function (name, props) {
                self._columnList.push(props.name);
            });

            // console.log(sortableList);
        },

        //TODO: Remove?
        reloadOverwrite: function (postDate) {
            this._lastPostData = postDate;
            this._currentPageNo = ($('.jtable-goto-page select').val() == '' || $('.jtable-goto-page select').val() == null) ? 1 : parseInt($('.jtable-goto-page select').val());
            this._reloadTable();
        },

        //TODO: Search
        //--------------------------------------------
        //-----Overwrite---------------------
        addLocalRecord1: function (cb) {
            var me = this;
            var lA = me.options.actions.listAction;
            me.options.actions.listAction = cb;
            //this._addRecordsToTable(records);
            var completeReload = function (data) {
                me._hideBusy();
                //Show the error message if server returns error
                // Overwrite if (data.Result != 'OK') {
                if (!data.Result) {
                    me._showError(data.Message);
                    return;
                }

                //Re-generate table rows
                me._removeAllRows('reloading');
                me._addRecordsToTable(data.Records);

                me._onRecordsLoaded(data);
                me._currentPageNo = data.page;
                //me._$gotoPageArea.find('select').val(data.page);
            };

            me._showBusy(me.options.messages.loadingMessage, me.options.loadingAnimationDelay); //Disable table since it's busy
            me._onLoadingRecords();

            //listAction may be a function, check if it is
            //Execute the function
            var funcResult = me.options.actions.listAction(me._lastPostData, me._createJtParamsForLoading());

            //Check if result is a jQuery Deferred object
            if (me._isDeferredObject(funcResult)) {
                funcResult.done(function (data) {
                    completeReload(data);
                }).fail(function () {
                    me._showError(me.options.messages.serverCommunicationError);
                }).always(function () {
                    me._hideBusy();
                });
            } else { //assume it's the data we're loading
                completeReload(funcResult);
            }
            me.options.actions.listAction = lA;
        },

        applyPaging: function (data) {
            //console.log(data);
            this._onRecordsLoaded(data);
        },

        deselectRows: function (rows) {
            if (rows)
                this._deselectRows(rows);
        },

        //Todo: Check
        _createFirstAndPreviousPageButtons: function () {
            var $first = $('<span></span>')
                .addClass('jtable-page-number-first')
                .html('<i class="glyphicon glyphicon-fast-backward"></i>')

                .data('pageNumber', 1)
                .appendTo(this._$pagingListArea);

            var $previous = $('<span></span>')
                .addClass('jtable-page-number-previous')
                .html('<i class="glyphicon glyphicon-backward"></i>')

                .data('pageNumber', this._currentPageNo - 1)
                .appendTo(this._$pagingListArea);

            this._jqueryuiThemeAddClass($first, 'ui-button ui-state-default', 'ui-state-hover');
            this._jqueryuiThemeAddClass($previous, 'ui-button ui-state-default', 'ui-state-hover');

            if (this._currentPageNo <= 1) {
                $first.addClass('jtable-page-number-disabled');
                $previous.addClass('jtable-page-number-disabled');
                this._jqueryuiThemeAddClass($first, 'ui-state-disabled');
                this._jqueryuiThemeAddClass($previous, 'ui-state-disabled');
            }
        },

        //Todo: Check

        _createLastAndNextPageButtons: function (pageCount) {
            var $next = $('<span></span>')
                .addClass('jtable-page-number-next')
                .html('<i class="glyphicon glyphicon-forward"></i>')

                .data('pageNumber', this._currentPageNo + 1)
                .appendTo(this._$pagingListArea);
            var $last = $('<span></span>')
                .addClass('jtable-page-number-last')
                .html('<i class="glyphicon glyphicon-fast-forward"></i>')

                .data('pageNumber', pageCount)
                .appendTo(this._$pagingListArea);

            this._jqueryuiThemeAddClass($next, 'ui-button ui-state-default', 'ui-state-hover');
            this._jqueryuiThemeAddClass($last, 'ui-button ui-state-default', 'ui-state-hover');

            if (this._currentPageNo >= pageCount) {
                $next.addClass('jtable-page-number-disabled');
                $last.addClass('jtable-page-number-disabled');
                this._jqueryuiThemeAddClass($next, 'ui-state-disabled');
                this._jqueryuiThemeAddClass($last, 'ui-state-disabled');
            }
        },

        //Override
        _reloadTable: function (completeCallback) {
            var self = this;

            var completeReload = function (data) {
                self._hideBusy();
                //Show the error message if server returns error
                if (!data.Result) {
                    self._showError(data.Message);
                    return;
                }
                //console.log(data);
                //Re-generate table rows
                self._removeAllRows('reloading');
                self._addRecordsToTable(data.Records);

                self._onRecordsLoaded(data);
                //console.log(data);
                //Call complete callback
                if (completeCallback) {
                    completeCallback(data); //Note: Override
                }
            };

            self._showBusy(self.options.messages.loadingMessage, self.options.loadingAnimationDelay); //Disable table since it's busy
            self._onLoadingRecords();
            
            //listAction may be a function, check if it is
            if ($.isFunction(self.options.actions.listAction)) {
                //Execute the function
                var cfg = {};
                var funcResult = self.options.actions.listAction(self._lastPostData, self._createJtParamsForLoading(), cfg);

                //Check if result is a jQuery Deferred object
                if (self._isDeferredObject(funcResult)) {
                   
                    funcResult.done(function (data) {
                        if (cfg.Data) data = cfg.Data;
                        completeReload(data);
                    }).fail(function () {
                        self._showError(self.options.messages.serverCommunicationError);
                    }).always(function () {
                        self._hideBusy();
                    });
                } else { //assume it's the data we're loading
                    completeReload(funcResult);
                }

            } else { //assume listAction as URL string.

                //Generate URL (with query string parameters) to load records
                var loadUrl = self._createRecordLoadUrl();

                //Load data from server using AJAX
                self._ajax({
                    url: loadUrl,
                    data: self._lastPostData,
                    success: function (data) {
                        completeReload(data);
                    },
                    error: function () {
                        self._hideBusy();
                        self._showError(self.options.messages.serverCommunicationError);
                    }
                });

            }
        },

        insertRecords: function (id, models, cls, cb) {
            var me = this;
            var allHtml = '';
            //console.log(id);
            $.each(models, function (i, m) {
                if (!m.Id) m.Id = '-' + id;
                var row = me._createRowFromRecord(m);
                //console.log(row.html());
                /*var html = '<tr>';
                $.each(m, function(k, f) {
                    html = html + '<td>' + f + '</td>';
                });
                html = html + '</tr>';*/
                allHtml += '<tr class ="jtable-data-row ' + cls + '" data-record-key = ' + m.Id + '>' + row.html() + '</tr>';

            });
            $('tr[data-record-key=' + id + ']').after(allHtml);
           // me._refreshRowStyles();
            if (cb)cb.call(me);
        },

        showRecords: function(id, models, cb) {
            $.each(models, function (i, m) {
                $('tr[data-record-key=' + m.Id + ']').show();
            });
            if (cb) cb.call(me);
        },

        delRecords: function (id, models, cb) {
           
            $.each(models, function (i, m) {
                //console.log(m.Id);
                $('tr[data-record-key=' + m.Id + ']').remove();
            });
            if (cb) cb.call(me);
        },

        getOptions: function () {
            return this.options;
        },

        getDeselectedId: function() {
            return this.options.deselectedId;
        },

        getPageInfo: function() {
            return this._createJtParamsForLoading();
        },

        _getDisplayTextForRecordField: function (record, fieldName) {
            var field = this.options.fields[fieldName];
            var fieldValue = record[fieldName];

            //if this is a custom field, call display function
            if (field.display) {
                return field.display({ record: record, name: fieldName });
            }

            if (field.type == 'date') {
                return this._getDisplayTextForDateRecordField(field, fieldValue);
            } else if (field.type == 'checkbox') {
                return this._getCheckBoxTextForFieldByValue(fieldName, fieldValue);
            } else if (field.options) { //combobox or radio button list since there are options.
                var options = this._getOptionsForField(fieldName, {
                    record: record,
                    value: fieldValue,
                    source: 'list',
                    dependedValues: this._createDependedValuesUsingRecord(record, field.dependsOn)
                });
                return this._findOptionByValue(options, fieldValue).DisplayText;
            } else { //other types
                return fieldValue;
            }
        },

      /*  _changePage: function (pageNo) {
           
            pageNo = this._normalizeNumber(pageNo, 1, this._calculatePageCount(), 1);
            if (pageNo == this._currentPageNo) {
                this._refreshGotoPageInput();
                return;
            }

            this._currentPageNo = pageNo;
            this._reloadTable();
        }*/

    });
})(jQuery);

