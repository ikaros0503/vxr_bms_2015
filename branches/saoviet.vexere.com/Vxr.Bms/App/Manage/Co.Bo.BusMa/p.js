define({
    routesData: {},
    start: function() {
        $('#bksContent').hide();
        $('#report').hide();
        $('#product-content').hide();
        $('#cod').hide();
        $("#busManager").show();
        $("#busManager").html($("#BusManagerTemplate").html());
        this.initView();
        this.loadRoutesAndTrips();
        this.loadDrivers();
        this.loadBus();
        this.loadSeatTemplates(); 
    },
    test:function() {
        vRqs({
            _a: 'fGetBus_Tickets_Status',
            _c: {
                XTripId: 1,
                XTypeId:2,
                XDate: "($x IS NULL OR $x = '2015-05-29')",
                XTime: "($x IS NULL OR $x = '18:15')"
            },
            _f: "Info, XDate, XTime, ID"
        }, function (u, r, l) {
            console.log(r, r, l);
        });
    },
    initView: function() {
        var self = this;
        $(".departure").datepicker({ dateFormat: 'dd-mm-yy' });
        $(".departure").datepicker("setDate", new Date());
        $("#spnDate").html('Ngày ' + (new Date($(".departure").datepicker('getDate'))).toFormatString('dd-mm-yyyy'));
        $(".departure").on('change', function() {
            $("#spnDate").html('Ngày ' + (new Date($(".departure").datepicker('getDate'))).toFormatString('dd-mm-yyyy'));
            self.loadRoutesAndTrips();
        });
    },

    getTicketInfo: function() {
        var self = this;
        var dateStr = self.toDbDateString(new Date($(".departure").datepicker("getDate")));
        var ndate = new Date($(".departure").datepicker("getDate"));
        ndate.setDate(ndate.getDate() + 1);
        var nextDateStr = self.toDbDateString(ndate);
        var parseDate = function(date) {
            return date != null ? new Date(parseInt(date.substring(date.indexOf('(') + 1).replace(')/', ''))) : '';
        };
        vRqs({
            _a: "fGetTicketSummary",
            _c: { CompId: "$x=" + app.cid + " and TripDate>='" + dateStr + "' and TripDate<'" + nextDateStr + "'" },
            _f: "TripDate, TripId, CompId, Booked, Paid, Total",
        }, function(u, r, l) {
            if (u == 1 && r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    var time = moment(parseDate(r[i][0])).format('HH:mm');
                    if (self.routesData[r[i][1]] != null) {
                        self.routesData[r[i][1]].trips[time].booked = r[i][3];
                        self.routesData[r[i][1]].trips[time].paid = r[i][4];
                        self.routesData[r[i][1]].trips[time].empty = parseInt(self.routesData[r[i][1]].trips[time].total)
                            - parseInt(r[i][3]) - parseInt(r[i][4]);
                    }
                    
                }
            }
            self.renderGroups();
        });
    },

    loadRoutesAndTrips: function() {
        var self = this;
        var getDrivers = function(teamInfo) {
            if (!(teamInfo != null && teamInfo != '')) return [];
            var result = [];
            var str = teamInfo.split('~');
            for (var i = 1; i < str.length; i++) {
                var s = str[i].split('|');
                if (s[0] == '2') {
                    result.push({
                        type: 2,
                        id: s[1],
                        name: s[2],
                        phone: s[3]
                    });
                }
            }
            return result;
        };
        var getNamesFromArray = function(arr) {
            var result = '';
            for (var i = 0; i < arr.length; i++) {
                result += arr[i].name + '<br />';
            }
            return result;
        };
        var getIdsFromArray = function(arr) {
            var result = '';
            for (var i = 0; i < arr.length; i++) {
                result += arr[i].id + '-';
            }
            return result;
        };
        var getAssitants = function(teamInfo) {
            if (!(teamInfo != null && teamInfo != '')) return [];
            var result = [];
            var str = teamInfo.split('~');
            for (var i = 1; i < str.length; i++) {
                var s = str[i].split('|');
                if (s[0] == '4') {
                    result.push({
                        type: 4,
                        id: s[1],
                        name: s[2],
                        phone: s[3]
                    });
                }
            }
            return result;
        };

        self.routesData = [];
        var dateStr = self.toDbDateString(new Date($(".departure").datepicker("getDate")));
        vRqs({
            _a: "fGetRoutesAndTrips",
            _c: { CompId: "$x=" + app.cid + " and IsPrgStatus=1 and (Type=1 or (Type=2 and Date='" + dateStr + "')) order by Type, Name" },
            _f: "Id, Type, Name, Date, Time, SeatTemplateInfo, Info, CompId, IsPrgStatus, BaseId,StatusInfo,VehicleInfo, TeamInfo, Note, FromArea, ToArea, RouteInfo, FareInfo,Keywords, TotalStage,BranchReceiveProduct, FromId, ToId, RouteId",
            
        }, function(u, r, l) {
            $("#selectRoutes").html('');

            var getTripInfoFromRecord = function (record, time) {
                
                var drivers = getDrivers(record[12]);
                var assitants = getAssitants(record[12]);
                var tripDetail = {
                    tripId: record[1] == 1 ? record[0] : record[9],
                    time: time,
                    id: record[0],
                    type: record[1],
                    date: record[3],
                    booked: 0,
                    paid: 0,
                    total: parseInt(record[5].split('|')[2]),
                    empty: parseInt(record[5].split('|')[2]),
                    status: '',
                    bus: self.getSubItem(record[11], '|', 2),
                    busId: self.getSubItem(self.getSubItem(record[11], '|', 0), '~', 1),
                    drivers: drivers,
                    assitants: assitants,
                    assitantIds: getIdsFromArray(assitants),
                    driversStr: getNamesFromArray(drivers),
                    driverIds: getIdsFromArray(drivers),
                    seatTemplateId: self.getSubItem(record[5], '~', 0),
                    statusInfo: record[10],
                    isCancelled: record[10] == 3 ? 'isCancelled' : '',
                    note:record[13]
                };
                return tripDetail;
            };

            if (u == 1 && r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    if (r[i][1] == 1) { //type=1
                        var route = {
                            id: r[i][0],
                            name: r[i][2],
                            note: r[i][13],
                            fromArea: r[i][14],
                            toArea: r[i][15],
                            routeInfo: r[i][16],
                            fareInfo: r[i][17],
                            seatTemplateInfo: r[i][5],
                            info: r[i][6],
                            keywords: r[i][18],
                            totalStage: r[i][19],
                            branchReceiveProduct: r[i][20],
                            fromId: r[i][21],
                            toId: r[i][22],
                            routeId: r[i][23],
                            trips: {}
                        };
                        var trips = r[i][6].split('~');
                        for (var j = 0; j < trips.length; j++) {
                            route.trips[trips[j]] = getTripInfoFromRecord(r[i], trips[j]);
                        }
                        self.routesData[r[i][0]] = route;
                    } else { //type=2
                        if (self.routesData[r[i][9]] != null) {
                            self.routesData[r[i][9]].trips[r[i][4]] = getTripInfoFromRecord(r[i], r[i][4]);
                        }
                        
                    }
                }
                self.getTicketInfo();

            } else {
                //error msg
            }
        });
    },

    loadDrivers: function() {
        vRqs({
            _a: "fGetPerson",
            _c: { CompId: "$x=" + app.cid + " and (Type=2 or Type=4)" },
            _f: "Id, FullName, Type, PhoneInfo",
        }, function(u, r, l) {
            if (u == 1 && r.length > 0) {
                $("#selectDrivers").html('');
                $("#selectAssitants").html('');

                for (var i = 0; i < r.length; i++) {
                    if (r[i][2] == 2) {
                        $("#selectDrivers").append('<option data-phone="' + r[i][3] + '" value="' + r[i][0] + '">' + r[i][1] + '</option>');
                    } else {
                        $("#selectAssitants").append('<option data-phone="' + r[i][3] + '"  value="' + r[i][0] + '">' + r[i][1] + '</option>');
                    }
                }
                $("#selectDrivers").chosen({});
                $("#selectAssitants").chosen({});
            }
        });
    },
    loadBus: function() {
        vRqs({
            _a: "fGetVehicle",
            _c: { CompId: "$x=" + app.cid + " and Type=1" },
            _f: "Id, LicensePlate",
        }, function(u, r, l) {
            if (u == 1 && r.length > 0) {
                $("#selectBus").html('');
                $("#selectBus").append('<option value="-1">----</option>');
                for (var i = 0; i < r.length; i++) {
                    $("#selectBus").append('<option value="' + r[i][0] + '">' + r[i][1] + '</option>');
                }
            }
        });
    },
    loadSeatTemplates: function() {
        vRqs({
            _a: "fGetResource",
            _c: { CompId: "$x=" + app.cid + " and IsPrgStatus=1" },
            _f: "Id, Name, Info",
        }, function(u, r, l) {
            if (u == 1 && r.length > 0) {
                $("#selectSeatTemplates").html('');
                
                for (var i = 0; i < r.length; i++) {
                    $("#selectSeatTemplates").append('<option value="' + r[i][0] + '" data-info="' + r[i][2] + '">' + r[i][1] + '</option>');
                }
            }
        });
    },

    renderGroups: function() {
        var self = this;
        $("#divAllTables").html('');
        var renderTable = function(route) {
            if (route == null) return;
            $("#hGroupTitle").text(route.name);
            $('#tbdTableTemplate').html('');
            route.trips = self.sortObject(route.trips);
            for (var time in route.trips) {
                $('#tbdTableTemplate').append(vtpl($("#rowTemplate").html(), route.trips[time]));
            }
            $("#divAllTables").append($("#tableTemplate").html());
        };
        $("#selectRoutes").html('');
        if (self.routesData != null) {
            for (var id in self.routesData) {
                if (parseInt(id) > 0) {
                    renderTable(self.routesData[id]);
                    $("#selectRoutes").append('<option value="' + id + '" >' + self.routesData[id].name + '</option>');
                }
            }
            self.updateSelectTimes();
        } else {
            //err
        }
        $("#btnCancelTrip").attr('disabled', 'disabled');
        $("#btnUpdateTrip").attr('disabled', 'disabled');
        self.bindEvents();
        self.deselectRow();
    },

    getSubItem: function(str, seperator, index) {
        if (str == null) {
            return '';
        } else {
            try {
                return str.split(seperator)[index];
            } catch (e) {
            }
        }
        return '';
    },
    updateSelectTimes: function() {
        var self = this;
        $("#selectTimes").html('');
        $("#selectTimes").append('<option value="-1">---</option>');
        for (var time in self.routesData[$("#selectRoutes").val()].trips) {
            $("#selectTimes").append('<option value="' + time + '">' + time + '</option>');
        }

    },
    selectRow: function (row) {
        var self = this;
        $("tr").removeClass('selectedRow');
        $(row).addClass('selectedRow');
        if ($(row).hasClass('isCancelled')) {
            $("#btnCancelTrip").text('Phục hồi');
            $("#btnCancelTrip").removeClass('btn-danger');
            $("#btnCancelTrip").addClass('btn-primary');
        } else {
            $("#btnCancelTrip").text('Hủy');
            $("#btnCancelTrip").removeClass('btn-primary');
            $("#btnCancelTrip").addClass('btn-danger');
        }

        $("#btnCancelTrip").removeAttr('disabled');


        $("#selectRoutes").val($(row).attr('data-tripId'));
        self.updateSelectTimes();

        $("#txtNote").val($(row).attr('data-note'));

        $("#selectSeatTemplates").val($(row).attr('data-seatTemplateId'));
        if ($("#selectSeatTemplates").val() == null) {
            $("#selectSeatTemplates").val($("#selectSeatTemplates option:first").val());
        }

        $("#selectTimes").val($(row).attr('data-tripTime'));

        if ($(row).attr('data-busId') != '') {
            $("#selectBus").val($(row).attr('data-busId'));
        }

        var tripId = $("#selectRoutes").val();
        var time = $("#selectTimes").val();

        if (parseInt(self.routesData[tripId].trips[time].booked) + parseInt(self.routesData[tripId].trips[time].paid) > 0) {
            $("#selectSeatTemplates").attr('disabled', 'disabled');
        }

        if ($(row).attr('data-driverIds') != '') {
            var str = $(row).attr('data-driverIds').split('-');
            if (str.length > 1) {
                var arr = [];
                for (var i = 0; i < str.length - 1; i++) {
                    arr.push(str[i]);
                }
                $("#selectDrivers").chosen('destroy').val(arr).chosen();
            }
        }

        if ($(row).attr('data-assitantids') != '') {
            var str = $(row).attr('data-assitantids').split('-');
            if (str.length > 1) {
                var arr = [];
                for (var i = 0; i < str.length - 1; i++) {
                    arr.push(str[i]);
                }
                $("#selectAssitants").chosen('destroy').val(arr).chosen();
            }
        }

        if (!$(row).hasClass('isCancelled')) {
            $("#selectDrivers").removeAttr('disabled');
            $("#selectBus").removeAttr('disabled');
            $("#selectDrivers").removeAttr('disabled');
            $("#selectAssitants").removeAttr('disabled');
            $("#selectDrivers").chosen('destroy').chosen();
            $("#selectAssitants").chosen('destroy').chosen();
            $("#selectSeatTemplates").removeAttr('disabled');
            $("#txtNote").removeAttr('disabled');

            $("#btnUpdateTrip").removeAttr('disabled');
        }
        

    },
    deselectRow: function () {
        var self = this;
        $('tr').removeClass('selectedRow');
        $("#btnCancelTrip").text('Hủy');
        $("#btnCancelTrip").removeClass('btn-primary');
        $("#btnCancelTrip").addClass('btn-danger');

        $("#btnCancelTrip").attr('disabled', 'disabled');
        $("#btnUpdateTrip").attr('disabled', 'disabled');

        $("#selectDrivers").attr('disabled', 'disabled');
        $("#selectBus").attr('disabled', 'disabled');
        $("#selectDrivers").chosen('destroy').chosen();
        $("#selectAssitants").chosen('destroy').chosen();

        $("#selectDrivers").attr('disabled', 'disabled');
        $("#selectAssitants").attr('disabled', 'disabled');


        $("#selectSeatTemplates").attr('disabled', 'disabled');
        $("#txtNote").attr('disabled', 'disabled');
        $("#txtNote").val('');

        $("#selectTimes").val('-1');

        $("#selectDrivers").chosen('destroy').val([]).chosen();
        $("#selectAssitants").chosen('destroy').val([]).chosen();
        $("#selectTimes").val('-1');
        $("#selectBus").val('-1');
        $("#selectSeatTemplates").val('-1');
    },

    bindEvents: function() {
        var self = this;

        $("#txtAddTime").unbind().on('keyup', function() {
            var str = $(this).val().split(':');
            try {
                var h = parseInt(str[0]);
                var m = parseInt(str[1]);
                if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                    $("#btnAddTime").removeAttr('disabled');
                    return;
                }
            } catch (e) {
            }
            $("#btnAddTime").attr('disabled', 'disabled');
        });

        $("#btnAddTime").unbind().on('click', function() {
            var str = $("#txtAddTime").val().split(':');
            if (parseInt(str[0]) < 0 || parseInt(str[0]) > 23 || parseInt(str[1]) < 0 || parseInt(str[1]) > 59) {
                alert('Invalid Time');
            } else {
                var time = (parseInt(str[0]) < 10 ? ('0' + parseInt(str[0])) : parseInt(str[0])) + ":" + (parseInt(str[1]) < 10 ? ('0' + parseInt(str[1]).toString()) : parseInt(str[1]));
                var tripId = $("#selectRoutes").val();
                $("#selectTimes option").each(function() {
                    if ($(this).val() == time) {
                        alert('Chuyen nay da co roi');
                        return;
                    }
                });
                //add new
                vRqs({
                    _a: "InsertTrip",
                    _d: {
                        Type: 2,
                        Name: self.routesData[tripId].name,
                        FromArea: self.routesData[tripId].fromArea,
                        ToArea: self.routesData[tripId].toArea,
                        Date: self.toDbDateString(new Date($(".departure").datepicker("getDate"))),
                        Time: time,
                        RouteInfo: self.routesData[tripId].routeInfo,
                        FareInfo: self.routesData[tripId].fareInfo,
                        SeatTemplateInfo: self.routesData[tripId].seatTemplateInfo,
                        Info: self.routesData[tripId].info,
                        Keywords: self.routesData[tripId].keywords,
                        CompId: app.cid,
                        TotalStage: self.routesData[tripId].totalStage,
                        StatusInfo: 1,
                        IsPrgStatus: 1,
                        BaseId: tripId,
                        BranchReceiveProduct: self.routesData[tripId].branchReceiveProduct,
                        FromId: self.routesData[tripId].fromId,
                        ToId: self.routesData[tripId].toId,
                        RouteId: self.routesData[tripId].routeId,
                        TotalBookedSeats: 0,
                        TotalPaidSeats: 0,
                    },
                }, function(u, r, l) {
                    if (u == 1 && r.length > 0) {
                        self.loadRoutesAndTrips();
                    } else {
                        alert('Please try again later');
                    }
                    $("#btnAddTime").attr('disabled', 'disabled');
                    $("#txtAddTime").val('');
                });

            }
        });

        $("#selectRoutes").on('change', function() {
            for (var i = 0; i < self.routesData.length; i++) {
                if ($(this).val() == self.routesData[i].id) {
                    self.updateSelectTimes(self.routesData[i]);
                }
            }
        });
        $("#selectTimes").unbind().on('change', function () {
            var tripId = $("#selectRoutes").val();
            var tripTime = $("#selectTimes").val();

            self.deselectRow();
            if (tripTime != '-1') {
                self.selectRow($("tr[data-tripTime='" + tripTime + "'][data-tripId='" + tripId + "']"));
            }
        });

        var cancelTrip=function() {
            var row = $('tr.selectedRow');
            var tripId = $('#selectRoutes').val();
            var time = $('#selectTimes').val();
            if (parseInt(self.routesData[tripId].trips[time].booked) + parseInt(self.routesData[tripId].trips[time].paid) > 0) {
                alert('Chuyến hiện tại đang có vé, vui lòng hủy hết để hủy chuyến');
                return;
            }
            if ($(row).attr('data-type') == '1') {
                //insert new
                vRqs({
                    _a: "InsertTrip",
                    _d: {
                        Type: 2,
                        Name: self.routesData[tripId].name,
                        FromArea: self.routesData[tripId].fromArea,
                        ToArea: self.routesData[tripId].toArea,
                        Date: self.toDbDateString(new Date($(".departure").datepicker("getDate"))),
                        Time: time,
                        RouteInfo: self.routesData[tripId].routeInfo,
                        FareInfo: self.routesData[tripId].fareInfo,
                        SeatTemplateInfo: self.routesData[tripId].seatTemplateInfo,
                        Info: self.routesData[tripId].info,
                        Keywords: self.routesData[tripId].keywords,
                        CompId: app.cid,
                        TotalStage: self.routesData[tripId].totalStage,
                        StatusInfo: 3,
                        IsPrgStatus: 1,
                        BaseId: tripId,
                        BranchReceiveProduct: self.routesData[tripId].branchReceiveProduct,
                        FromId: self.routesData[tripId].fromId,
                        ToId: self.routesData[tripId].toId,
                        RouteId: self.routesData[tripId].routeId,
                        TotalBookedSeats: 0,
                        TotalPaidSeats: 0,
                    },
                }, function (u, r, l) {
                    if (u == 1 && r.length > 0) {
                        self.loadRoutesAndTrips();
                    } else {
                        alert('Please try again later');
                    }
                    $("#btnAddTime").attr('disabled', 'disabled');
                    $("#txtAddTime").val('');
                });

            } else {
                //update
                vRqs({
                    _a: "UpdateTrip",
                    _c: { Id: $(row).attr('data-id') },
                    _d: {StatusInfo:3},
                }, function (u, r, l) {
                    if (u == 1 && r.length > 0) {
                        self.loadRoutesAndTrips();
                    } else {
                        alert('Please try again later');
                    }
                });
            }
        }

        var updateTrip = function () {
            
            var row = $('tr.selectedRow');
            var tripId = $('#selectRoutes').val();
            var time = $('#selectTimes').val();
            var getBusStr = function() {
                if ($("#selectBus").val() == '-1') {
                    return '';
                } else {
                    return ('1~' + $("#selectBus").val() + '|1|' + $("#selectBus").find('option:selected').text() + '|');
                }
                
            };
            var getSeatTemplateInfoStr = function () {
                return ($("#selectSeatTemplates").val() + '~' + $("#selectSeatTemplates").find('option:selected').attr('data-info'));
            };
            var getTeamInfoStr = function () {
                var result = '1';
                var driverIds = $("#selectDrivers").chosen().val();
                var assitantIds = $("#selectAssitants").chosen().val();
                console.log(driverIds, assitantIds);
                if (driverIds == null && assitantIds == null) {
                    return '';
                }
                if (driverIds!=null) {
                    for (var i = 0; i < driverIds.length; i++) {
                        var opt = $("#selectDrivers").find('option[value=' + driverIds[i] + ']');
                        result += '~2|' + driverIds[i] + '|' + $(opt).text()+'|'+  $(opt).attr('data-phone');
                    }
                }

                if (assitantIds!=null) {
                    for (var i = 0; i < assitantIds.length; i++) {
                        var opt = $("#selectAssitants").find('option[value=' + assitantIds[i] + ']');
                        result += '~4|' + assitantIds[i] + '|' + $(opt).text() + '|' + $(opt).attr('data-phone');
                    }
                }
                return result;
            };

            if ($(row).attr('data-type') == '1') {
                //insert new
                vRqs({
                    _a: "InsertTrip",
                    _d: {
                        Type: 2,
                        Name: self.routesData[tripId].name,
                        FromArea: self.routesData[tripId].fromArea,
                        ToArea: self.routesData[tripId].toArea,
                        Date: self.toDbDateString(new Date($(".departure").datepicker("getDate"))),
                        Time: time,
                        RouteInfo: self.routesData[tripId].routeInfo,
                        FareInfo: self.routesData[tripId].fareInfo,
                        SeatTemplateInfo: getSeatTemplateInfoStr(),
                        Info: self.routesData[tripId].info,
                        Keywords: self.routesData[tripId].keywords,
                        CompId: app.cid,
                        TotalStage: self.routesData[tripId].totalStage,
                        StatusInfo: 1,
                        IsPrgStatus: 1,
                        BaseId: tripId,
                        BranchReceiveProduct: self.routesData[tripId].branchReceiveProduct,
                        FromId: self.routesData[tripId].fromId,
                        ToId: self.routesData[tripId].toId,
                        RouteId: self.routesData[tripId].routeId,
                        TotalBookedSeats: 0,
                        TotalPaidSeats: 0,
                        VehicleInfo: getBusStr(),
                        TeamInfo: getTeamInfoStr(),
                        Note: $("#txtNote").val()
                    },
                }, function (u, r, l) {
                    if (u == 1 && r.length > 0) {
                        self.loadRoutesAndTrips();
                    } else {
                        alert('Please try again later');
                    }
                    $("#btnAddTime").attr('disabled', 'disabled');
                    $("#txtAddTime").val('');
                });

            } else {
                //update
                vRqs({
                    _a: "UpdateTrip",
                    _c: { Id: $(row).attr('data-id') },
                    _d: {
                        SeatTemplateInfo: getSeatTemplateInfoStr(),
                        VehicleInfo: getBusStr(),
                        TeamInfo: getTeamInfoStr(),
                        Note: $("#txtNote").val()
                    },
                }, function (u, r, l) {
                    if (u == 1 && r.length > 0) {
                        self.loadRoutesAndTrips();
                    } else {
                        alert('Please try again later');
                    }
                });
            }
        }

        $("#btnCancelTrip").unbind().on('click', function () {
            if ($(this).text() == "Hủy") {
                cancelTrip();
            } else {
                vRqs({
                    _a: "UpdateTrip",
                    _c: { Id: $('tr.selectedRow').attr('data-id') },
                    _d: { StatusInfo: 1 },
                }, function (u, r, l) {
                    if (u == 1 && r.length > 0) {
                        self.loadRoutesAndTrips();
                    } else {
                        alert('Please try again later');
                    }
                });
            }
            self.deselectRow();
        });
        $("#btnUpdateTrip").unbind().on('click', function () {
            updateTrip();
        });

        $("#busManager tr").unbind().on('click', function () {
            var isSelected = $(this).hasClass('selectedRow');
            self.deselectRow();
            if (!isSelected) {
                self.selectRow(this);
            }
        });
        $("a.btn-book").unbind().on('click', function() {
            var tripId = $(this).attr('data-tripId');
            var tripTime = $(this).attr('data-tripTime');

            $('#bksContent').show();
            $('#report').hide();
            $('#product-content').hide();
            $("#busManager").hide();

            $('select[name=TripId]').val(tripId).trigger('change');
            $('input[name=DepartureDate]').datepicker('setDate', vPrsDt(self.toDatePickerDateString(new Date($(".departure").datepicker("getDate")))));
            $('select[name=TimeSlot]').val(tripTime).trigger('change');
        });
    },

    sortObject: function(o) {
        var sorted = {},
        key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;

    },

    sortTrips: function () {
        var self = this;
        if (self.routesData.length <= 0) return;
        for (var k = 0; k < self.routesData.length; k++) {
            for (var i = 0; i < self.routesData[k].trips.length - 1; i++) {
                for (var j = i + 1; j < self.routesData[k].trips.length; j++) {
                    if (self.routesData[k].trips[j].time < self.routesData[k].trips[i].time) {
                        var tmp = self.routesData[k].trips[i];
                        self.routesData[k].trips[i] = self.routesData[k].trips[j];
                        self.routesData[k].trips[j] = tmp;
                    }
                }
            }
        }
    },

    toDbDateString: function (date) {
        /// <summary>Convert date object to Database format</summary>
        /// <param name="date" type="date">date to be converted</param>
        /// <returns type="string">String in database format</returns>
        return date.getFullYear() + (date.getMonth() <= 8 ? '-0' : '-') + (date.getMonth() + 1) + (date.getDate() <= 9 ? '-0' : '-') + date.getDate();
    },
    toDatePickerDateString: function (date) {
        /// <summary>Convert date object to Database format</summary>
        /// <param name="date" type="date">date to be converted</param>
        /// <returns type="string">String in database format</returns>
        return (date.getDate() <= 9 ? '0' : '') + date.getDate() + (date.getMonth() <= 8 ? '-0' : '-') + (date.getMonth() + 1) +":" + date.getFullYear();
    },
    
});