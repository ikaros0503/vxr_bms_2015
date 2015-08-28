define({
    start: function (o) {
        try {
            var me = this;
            me.o = o;
            me._$container = $(o.x);
            var isLoad = false;
            var s = {
                x: "#VCFilterForm button[name=searchVC]"
            }


            vbv('doShowVC', function (e) {
                if (me._$container.length == 0) me._$container = $(o.x);
                if ($('select[name="TimeSlot"]#time').val() != 'All')
                    $('input[name="DepartureDateTo"]').prop('disabled', true);

                me._bindEventOnField();
                me._bindSearchEvents(s, e);
                if (isLoad == false) {
                    me._createVC();
                    isLoad = true;
                }
                me._rlVc(e.d.td);
            });
            vbv('doChangeVCTrip', function(e) {
                me.o._cVCTripId = e.d.value;
            });
        } catch (e) {
            console.log('(E) VSheet', e);
        }
    },
    _createVC: function () {

        this._$vcsheet = $('<div />')
              .addClass('vcancelled-sheet  col-md-12 col-sm-12 col-xs-12')
              .appendTo(this._$container);

        this._$vcnav = $('<div />')
              .addClass('vcanclled-nav  col-md-12 col-sm-12 col-xs-12')
              .append($('<div />').addClass('col-md-12'))
              .appendTo(this._$container).children().first();
    },
    _rlVc: function (td) {
        /// <summary>
        /// Reload cancled tab
        /// </summary>
        /// <param name="td">trip datas</param>
        var me = this, o = me.o;
        //Update post data
        var obj = me._createGetVCSeatObj();
        var completeReloadSheet = function (u, r, l, t) {
            if (u != 1 || l <= 0) {
                me._clearVCSheet();
                me._notFoundCancelledTicket();
                return;
            }
            //Clear ticket from seat
            me._clearVCSheet();

            if (l > 0) {
                //Map ticket to seat matrix
                me._mapVCTicket(r, td);
                o._totalVCItem = parseInt(t);
            }
            //Render UI           
            me._renderVCSheet(td);            
            me._renderVCPagination(td);
        };
        //Submit query
        vRqs(obj, completeReloadSheet);
    },



    _createGetVCSeatObj: function () {
        //Get filter form data
        var fromdate = $('input[name="DepartureDateFrom"]').val().split(' ')[2].split('-')[2] + '-' + $('input[name="DepartureDateFrom"]').val().split(' ')[2].split('-')[1] + '-' + $('input[name="DepartureDateFrom"]').val().split(' ')[2].split('-')[0];
        var todate = $('input[name="DepartureDateTo"]').val().split(' ')[2].split('-')[2] + '-' + $('input[name="DepartureDateTo"]').val().split(' ')[2].split('-')[1] + '-' + $('input[name="DepartureDateTo"]').val().split(' ')[2].split('-')[0];
        var time = $('#time').val();
        
        //console.log(fromdate + ' ' + todate);

        var obj = {}, me = this, o = me.o;
        obj._a = "pGetTicket";
        obj._c = {
            TripId: o._cVCTripId,
            Status: '($x) = 3', //STATUS
        };

        //Edit by An - Neu chon "Tat ca" thi query bang CanceledDate, nguoc lai query bang TripDate voi data lay tu fromdate
        if (time == "All") {
            obj._ft = "TripId = " + o._cVCTripId + " and (Status) = 3" + " and CanceledDate >= '" + fromdate + " 00:00' and CanceledDate <= '" + todate + " 23:59'";
            
        }
        else {
            obj._ft = "TripId = " + o._cVCTripId + " and (Status) = 3" + " and TripDate >= '" + fromdate + " 00:00' and TripDate <= '" + fromdate + " 23:59' and convert(VARCHAR(40),TripDate,121) like '%" + time + "%'"; //STATUS
            obj._c.TripDate = fromdate;
        }
        //obj._f = "Id, TripId, AgentId, TripDate, SeatCode, IssueDate, PickupDate, CustomerInfo, Status, Fare, Note, PickupInfo, Serial, PaymentInfo, IsPrgHistoryInfo, FromValid, ToValid, IsPrgUpdatedDate";
        obj._f = _dict._tgF.join();
        obj._se = 'Id desc',
        obj._si = o._cVCPageIndex;
        obj._mr = _dict._nOP;

        return obj;
    },
    _clearVCSheet: function () {
        this._$vcsheet.empty();
        this._$vcnav.empty();
    },
    _mapVCTicket: function (data, td) {
        var me = this;
        me._vc = [];
        $.each(data, function (i, v) {
            v.shift();
            var t = me._crTkFrRc(v, td);
            if (!$.isEmptyObject(t)) {
                me._vc.push(t);
            }
        });
    },
    _renderVCSheet: function (td) {       
        var me = this;
        var $title = $('<ul/>').addClass('coach vbooking-coach').addClass(_dict._g[td._numCoach - 2]).addClass(_dict._sg[td._numCoach - 2]).addClass(_dict._mg[td._numCoach - 2]).appendTo(me._$vcsheet);
        var $t = _dict._cTplTb;        
        $title.append($t);        
        if (me._vc.length > 0) {
            var stt = 0;
            var numOfC = Math.round(me._vc.length / td._numCoach);
            for (var i = 0; i < me._vc.length; i += numOfC) {               
                var vcc = me._vc.slice(i, i + numOfC);
                for (var j = 0; j < vcc.length; j++) {
                    if (typeof vcc[j] != "undefined") {
                        stt++;
                        var $s = vcc[j]._renderVCTicket(stt);
                        $('.innerTable').append($s);
                    }
                }
            }
        } else {
            me._notFoundCancelledTicket();
        }
    },
   
    _renderVCPagination: function (td) {
        var me = this, o = me.o;
        var p = me._getVCPag(o._cVCPageIndex, _dict._nOP, o._totalVCItem);
        if (p.CountAllPages > 1) {
            var $p = $('<ul />').addClass('pagination pagination-sm pull-right');
            if (p.FrevPage != "") {
                $p.append($('<li />').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', p.FrevPage)));
            } else {
                $p.append($('<li />').addClass('disabled').append($('<a />').html('&laquo;').attr('href', 'javascript:;').attr('data-index', '')));
            }
            if (p.FrevPages.length > 0) {
                for (var i = 0; i < p.FrevPages.length; i++) {
                    $p.append($('<li />').append($('<a />').html(p.FrevPages[i]).attr('href', 'javascript:;').attr('data-index', p.FrevPages[i])));
                }
            }
            $p.append($('<li />').addClass('active').append($('<a />').html(p.CurrentPage).attr('href', 'javascript:;').attr('data-index', p.CurrentPage)));
            if (p.NextPages.length > 0) {
                for (var j = 0; j < p.NextPages.length; j++) {
                    $p.append($('<li />').append($('<a />').html(p.NextPages[j]).attr('href', 'javascript:;').attr('data-index', p.NextPages[j])));
                }
            }
            if (p.NextPage != "") {
                $p.append($('<li />').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', p.NextPage)));
            } else {
                $p.append($('<li />').addClass('disabled').append($('<a />').html('&raquo;').attr('href', 'javascript:;').attr('data-index', '')));
            }

            $p.appendTo(me._$vcnav);

            //Bind event on pagination
            $p.find('a').not('.disabled').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                me._changeVCPageIndex($(this).attr('data-index'));
                me._rlVc(td);
            });

        }
    },
    _getVCPag: function (pIndex, nOfPage, totalItem) {
        var countAllPage = Math.ceil(totalItem / nOfPage);
        var numPrevPages = 5;
        var numNextPages = 5;
        var prevPagesArr = [];
        for (var i = pIndex - numPrevPages; i < pIndex; i++) {
            if (i >= 1) {
                prevPagesArr.push(i);
            }
        }
        var nextPagesArr = [];
        for (var j = pIndex + 1; j < pIndex + numNextPages; j++) {
            if (j <= countAllPage) {
                nextPagesArr.push(j);
            }
        }

        return {
            CurrentPage: pIndex,
            CountAllPages: countAllPage,
            First: (-1 == prevPagesArr.indexOf(1) && 1 != pIndex) ? 1 : '',
            FrevPage: (prevPagesArr.length > 0) ? prevPagesArr[prevPagesArr.length - 1] : '',
            FrevPages: prevPagesArr,
            NextPages: nextPagesArr,
            NextPage: (nextPagesArr.length > 0) ? nextPagesArr[0] : '',
            Last: (-1 == nextPagesArr.indexOf(countAllPage) && countAllPage != pIndex) ? countAllPage : '',
            NumPerPage: nOfPage
        }
    },
    _notFoundCancelledTicket: function () {
        var me = this;
        $('<div />').addClass('alert alert-danger')
                 .html("<strong>Không tồn tại vé đã hủy.</strong>")
             .appendTo(me._$vcsheet);
    },
    _changeVCPageIndex: function (i) {
        this.o._cVCPageIndex = parseInt(i);
    },
    _crTkFrRc: function (record, td) {
        var status = parseInt(record[8]);
        var alias = parseInt(record[22]);
        if (alias == td._cTripBus) { //Alias
            var id = parseInt(record[0]);

            var issue = vPrsDt(record[5]);
            //var pdate = vPrsDt(record[6]);

            var d = new Date(vPrsDt(record[6]));
            //console.log(d.getDate() + '/' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '/' + d.getFullYear());
            //console.log((d.getHours() + ':' + d.getMinutes() + '0'));

            var pdate = d.getDate() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
            var ptime = d.getHours() + ':' + d.getMinutes() + '0';
            var seatCode = record[4].split('|')[0];
            var fare = parseInt(record[9]);
            if (isNaN(fare)) {
                fare = 0;
            }
            var note = record[10];
            var pInfo = record[11];
            var seri = record[12];
            var pmInfo = record[13];
            if (null == pmInfo) {
                pmInfo = "";
            }
            var hInfo = record[14];
            var code = record[15];
            var pcode = record[16];

            var fromValid = vPrsDt(record[17]);
            var toValid = vPrsDt(record[18]);
            var updatedDate = vPrsDt(record[19]);
            var aInfo = record[20];
            var surCharge = parseInt(record[21]);
            if (isNaN(surCharge)) {
                surCharge = 0;
            }
            var deposit = parseInt(record[26]);
            if (isNaN(deposit)) {
                deposit = 0;
            }
            var discount = parseInt(record[27]);
            if (isNaN(discount)) {
                discount = 0;
            }
            var debt = parseInt(record[29]);
            if (isNaN(debt)) {
                debt = 0;
            }
            var suser = record[23];
            var cuser = record[24];
            var stageCode = parseInt(record[25]);
            var tripId = parseInt(record[1]);

            var dept = vPrsDt(record[3]), cid = 0, cname = "", cphone = "";

            var ci = record[7];
            if (ci != null) {
                ci = ci.split('|');
                cid = parseInt(ci[2]);
                cname = ci[3];
                cphone = ci[4];
            }

            var fromArea = record[28];
            var toArea = record[29];

            var seatType = parseInt(record[30]);
            if (isNaN(seatType)) {
                seatType = 1;
            }
            var canceledDate = record[32];
            var cancelInfo = record[33];
            var type = record[34];
            var chargeDate = record[35];
            var sNote = record[36];
            var responUser = record[37];
            var porDate = record[38];

            var re = new T(id, dept, cid, cname, cphone, status, issue, pdate, fare, note, pInfo, seri, pmInfo, hInfo, code, pcode, fromValid, toValid, updatedDate, aInfo, surCharge, suser, cuser, stageCode, tripId, deposit, discount, fromArea, toArea, seatType, debt, canceledDate, cancelInfo, type, chargeDate, sNote, responUser, porDate, seatCode, ptime);
            re.agentId = record[2];
            return re;
        }
        return {};
    },

    _bindSearchEvents: function (s, e) {
        var x = $(s.x); me = this;
        var ev = e;
        if (x.length > 0) {
            vev(s.x, 'click', function (e) {
                me._rlVc(ev.d.td);
            });          
        }

    },


    //Added by An - Bind event on Select Timeslot
    _bindEventOnField: function () {
        var time = $('select[name="TimeSlot"]#time')
        time.change(function (e) {
            if (time.val() == 'All')
                $('input[name="DepartureDateTo"]').prop('disabled', false);
            else 
                $('input[name="DepartureDateTo"]').prop('disabled', true);
        });
    }
})