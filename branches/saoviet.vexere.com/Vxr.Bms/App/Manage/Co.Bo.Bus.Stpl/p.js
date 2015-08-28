define({
        //#region Private Methods
        _getSeatTemplateTable: function(numFloor, numRow, numCol, type, arrSeat) {
            //console.log('getSeatTemplateTable');
            var html = "";
            //var cellSize = 50;
            //var tableSize = cellSize * numCol;
            html += '<div class="col-md-12 table-responsive mt10">';
            for (var f = 1; f <= numFloor; f++) {
                if (f == 1) {
                    html += '<div class="col-md-6 text-center pl0">';
                    html += $.html('winTitleTpl01', { title: 'TẦNG DƯỚI' });
                } else {
                    html += '<div class="col-md-6 text-center pr0">';
                    html += $.html('winTitleTpl01', { title: 'TẦNG TRÊN' });
                }

                html += '<table id="table-seat" name="seat-map" class="table phoikhach table-bordered"><tbody>';
                var value;
                for (var i = 1; i <= numRow; i++) {
                    html += '<tr>';
                    for (var j = 1; j <= numCol; j++) {
                        //col = j;
                        //row = String.fromCharCode(i + 64);
                        value = "";
                        if (arrSeat) {
                            value = arrSeat[(f - 1) * numRow * numCol + (i - 1) * numCol + (j - 1)];
                            if (typeof (value) == "undefined") {
                                value = "";
                            }
                        }
                        html += '<td>' +
                            '<input type="text"  class="form-control input-sdg input-sm"' + ' floor=' + f + ' row="' + i + '" col="' + j + '" id="seat-0-' + i + '-' + j + '"' + ' value="' + value + '"' + '>' +
                            '</td>';
                    }
                    html += '</tr>';
                }
                html += '</tbody></table>';
                html += '</div>';
            }
            html += '</div>';
            return html;
        },
        //#endregion

        //#region Callbacks
        onBeginSelectionChange: function(view, record) {
            vv.enableItem(view, 'button.saveSeatTpl', record != null);
            vv.enableItem(view, 'button.delete', record != null);
        },

        onItemLoaded: function(record) {
            var me = this;
            if ($('#seat-map') && record) me.onLoadSeatMap(record.Info);
        },

        onActionComplete: function() {
            var me = this, view = me.view;
            var div = $('#seat-map');
            if (div) {
                div.empty();
                vv.enableItem(view, 'button.saveSeatTpl', false);
            }
        },

        //#endregion

        //#region Listeners

        onCreateSeatMap: function() {
            var me = this, view = me.view;
            var isValid = true;
            var msg = "";
            var failArr = [];
            $.each($.dx, function(idx, field) {
                var v = me.view.find(field.ref).val();
                if (!field.noSave && field.required) {
                    if (v == '' || v.trim().length <= 0) {
                        isValid = false;
                        msg += "\n Vui lòng nhập " + field.label.toLocaleLowerCase();
                        failArr.push(field);
                    }
                }
            });
            if (isValid) {
                var numFloor = $('input.num-floor').val();
                var numRow = $('input.num-row').val();
                var numCol = $('input.num-col').val();
                var seatTypeCode = $('select.seat-type').val();
                var html = "";
                html += me._getSeatTemplateTable(numFloor, numRow, numCol, seatTypeCode);
                $('#seat-map').html(html);
                vv.enableItem(view, 'button.saveSeatTpl', true);
            } else {
                vv.showMessage({
                    element: view.find('.alert.message'),
                    type: 'alert-danger',
                    content: msg
                });
                if (failArr.length > 0) {
                    view.find(failArr[0].ref).trigger('focus');
                }
            }
        },


        onLoadSeatMap: function(info) {
            // genarate seat template from db
            var me = this;
            if (info == null) return "";
            var rows = info.split("~");
            if (rows == null || rows.length == 0) return "";
            var row = rows[0];
            var field = row.split("|");
            var numFloor = parseInt(field[1]);
            var seatType = parseInt(field[3]);
            row = rows[1];
            field = row.split("|");
            var numRow = parseInt(field[1]);
            var numCol = parseInt(field[2]);
            var arrSeat = new Array(numFloor * numRow * numCol);
            var f, r, c, name;
            for (i = numFloor + 1 + 2; i < rows.length; i++) {
                // remove ghe tai xe va ghe cua trong
                row = rows[i];
                field = row.split("|");
                name = field[4];
                f = parseInt(field[5]);
                r = parseInt(field[6]);
                c = parseInt(field[7]);
                arrSeat[(f - 1) * numRow * numCol + (r - 1) * numCol + (c - 1)] = name;
            }
            var html = "";
            html += me._getSeatTemplateTable(numFloor, numRow, numCol, seatType, arrSeat);
            $('#seat-map').html(html);
            return "";
        },

        onSaveSeat: function(id) {
            var me = this, view = me.view;
            var version = 1, carcode = "A1111";
            var numFloor = $('input.num-floor').val();
            var numRow = $('input.num-row').val();
            var numCol = $('input.num-col').val();
            var numSeatTotal = 0;
            var seatType = $('select.seat-type option:selected').text();
            var seatTypeCode = $('select.seat-type').val();
            var tables = view.find('table[name="seat-map"]');
            var seatcode = "";
            var name = "";
            var code = 0;
            var normalSeat = 0;
            var extendedSeat = 0;

            var index = 1, type;
            var seatfloor = "";
            seatcode = '~1|1|4|4|Tài xế|1|1|1|1|1|3||~1|2|8|3|Cửa trong|1|1|5|1|1|3||' + seatcode;
            var numSeatFloor, code, floor, row, col, rowspan = 1, colspan = 1, position = 1;
            for (f = 1; f <= tables.length; f++) {
                var table = tables[f - 1];
                var arrCell = $('input', table);
                numSeatFloor = 0;
                for (r = 0; r < numRow; r++) {
                    for (c = 0; c < numCol; c++) {
                        var cell = arrCell[r * numCol + c];
                        var value = cell.value;
                        if (value != null && value.length > 0) {
                            if (value.charAt(0) == 'L' || value.charAt(0) == 'S') {
                                type = 6;
                                extendedSeat++;
                            } else {
                                type = seatTypeCode;
                                normalSeat++;
                            }
                            numSeatFloor++;
                            code = value;
                            name = value;
                            floor = cell.getAttribute('floor');
                            row = cell.getAttribute('row');
                            col = cell.getAttribute('col');
                            seatcode += "~";
                            seatcode += version + "|" + index + "|" + type + "|" + code + "|" + name + "|" + floor + "|" + row + "|" + col + "|" + rowspan + "|" + colspan + "|" + position + "|" + "|";
                            index++;
                        }
                    }
                }
                numSeatTotal += numSeatFloor;
                name = 'Tầng ' + f;
                code = 'F' + f;
                seatfloor += "~";
                seatfloor += version + "|" + numRow + "|" + numCol + "|" + numSeatFloor + "|" + f + "|" + seatTypeCode + "|" + code + "|" + name + "|" + "|";
            }
            seatcode = seatfloor + seatcode;
            var seatName = $('input.seat-map-name').val();
            var temp = version + "|" + numFloor + "|" + numSeatTotal + "|" + seatTypeCode + "|" + carcode + "|" + seatName + "|" + "|";
            seatcode = temp + seatcode;
            
            $(view).find('input.seat-info').val(seatcode);

            //if (normalSeat < 10) {
            //    summaryInfo = "100" + normalSeat;
            //} else if (normalSeat > 10 < 99) {
            //    summaryInfo = "10" + normalSeat;
            //} else {
            //    summaryInfo = "1" + normalSeat;
            //}

            //if (extendedSeat < 10) {
            //    extendedSummaryInfo = "100" + extendedSeat;
            //} else if (normalSeat > 10 < 99) {
            //    extendedSummaryInfo = "10" + extendedSeat;
            //} else {
            //    extendedSummaryInfo = "1" + extendedSeat;
            //}

            $('input.summary-info').val(normalSeat);
            $('input.extended-summary-info').val(extendedSeat);
            if (me.model && me.model.CompId && me.model.CompId == 1) {
                me.model.CompId = parseInt(app.cid);
                me.model.Id = null;
            };
            me.onBasicSave();
        },

        //#endregion

        //#region Converters
        gDisCompId: function (data) {
            switch (parseInt(data.record.CompId)) {
                case (1):
                    return "Sơ đồ mẫu";
                    break;
                default:
                    return "Của nhà xe";
                    break;
            }
        },

        gDisNumFloor: function(data) {
            return vGvo(data.record.Info, 0, 1);
        },

        gDisNumRow: function(data) {
            return vGvo(data.record.Info, 1, 1);
        },

        gDisNumCol: function(data) {
            return vGvo(data.record.Info, 1, 2);
        },

        gDisSeatType: function(data) {
            var seatCode = parseInt(vGvo(data.record.Info, 0, 3));
            var seatType;
            switch (seatCode) {
            case 1:
                seatType = "Ghế ngồi";
                break;
            case 2:
                seatType = "Giường nằm";
                break;
            case 3:
                seatType = "Ghế ngồi bán nằm";
                break;
            case 4:
                seatType = "Tài xế";
                break;
            case 5:
                seatType = "Ghế dự phòng";
                break;
            case 6:
                seatType = "Ghế/giường luồng";
                break;
            default:
                seatType = "Không rõ";
                break;
            }
            return seatType;
        },

        rvcNumFloor: function(x, d) {
            /// <summary>
            /// NumFloor read converter
            /// </summary>
            /// <param name="x"></param>
            /// <param name="d"></param>
            var info = this.model.Info;
            if (info) return vGvo(info, 0, 1);
            return d;
        },

        rvcNumRow: function(x, d) {
            /// <summary>
            /// NumRow read converter
            /// </summary>
            /// <param name="x"></param>
            /// <param name="d"></param>
            var info = this.model.Info;
            if (info) return vGvo(info, 1, 1);
            return d;
        },

        rvcNumCol: function(x, d) {
            /// <summary>
            ///  NumCol read converter
            /// </summary>
            /// <param name="x"></param>
            /// <param name="d"></param>
            var info = this.model.Info;
            if (info) return vGvo(info, 1, 2);
            return d;
        },

        rvcSeatType: function(x, d) {
            /// <summary>
            /// SeatType read converter
            /// </summary>
            /// <param name="x"></param>
            /// <param name="d"></param>
            var info = this.model.Info;
            if (info) {
                var seatCode = parseInt(vGvo(info, 0, 3));
                var seatType;
                switch (seatCode) {
                case 1:
                    seatType = "Ghế ngồi";
                    break;
                case 2:
                    seatType = "Giường nằm";
                    break;
                case 3:
                    seatType = "Ghế ngồi bán nằm";
                    break;
                case 4:
                    seatType = "Tài xế";
                    break;
                case 5:
                    seatType = "Ghế dự phòng";
                    break;
                case 6:
                    seatType = "Ghế/giường luồng";
                    break;
                default:
                    seatType = "Không rõ";
                    break;
                }
                return seatCode;
            }
            return d;
        }
        //#endregion
    }
);