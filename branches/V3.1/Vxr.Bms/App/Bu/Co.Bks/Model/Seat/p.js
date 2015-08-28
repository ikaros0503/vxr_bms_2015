/*Render HTML *************************************************************************/
S.prototype._renderSeat = function (nTicketPerTrip, hasBPermit, cStageCode, numOfStages, stopPoints, isStageBooking, maxStageCode, closedStatus, realDepartureTime, tripDetailId, vehicleNumber, notallow, cTripId, limitedDatebyUser) {
    // console.log(limitedDatebyUser);
    var me = this;
    //Check status of seat map with ticket, expected each seat map with one ticket
    var ticket = me._getCurrentTicket(cStageCode);
    // block seat by vehicle => set status of Seat = 2 (block)
    var seatPos = me._coach + "|" + me._row + "|" + me._col;
    // đối với các vé đã hủy thì không cần xét block hay không block
    if (ticket._status != 3) {
        if (typeof _dict._blockSeatByVehicle != "undefined") {
            $.each(_dict._blockSeatByVehicle, function (iv, ve) {
                if (seatPos == ve) {
                    me._status = 2;
                }
            });
        }
        if (typeof _dict._blockSeatByTrip != "undefined" && typeof _dict._blockSeatByTrip[cTripId] != "undefined") {
            $.each(_dict._blockSeatByTrip[cTripId], function (iv, ve) {
                if (seatPos == ve) {
                    me._status = 2;
                }
            });
        }

        if (typeof _dict._unblockSeatByVehicle != "undefined" && vehicleNumber != "") {
            if (typeof _dict._unblockSeatByVehicle[vehicleNumber] != "undefined") {
                if (_dict._unblockSeatByVehicle[vehicleNumber].indexOf(seatPos) != -1) {
                    me._status = 1;
                }
            }
        }
        if (vIsEstStr(app.agentBlockSeats)) {
            $.each(app.agentBlockSeats.split(","), function (iv, ve) {
                if (me._label == ve.trim()) {
                    me._status = 2;
                }
            });
        }
    }
    var $html = $();
    var fromPoint = null;
    var fromName = "";
    var toPoint = null;
    var toName = "";
    var stageName = "";
    var defaultFromId = 0;
    var defaultToId = 0;
    // load default FromId, ToId
    //  console.log(limitedDatebyUser);
    //if (limitedDatebyUser){
    if (typeof _dict._hasDefaultStagePerTrip != "undefined" && _dict._hasDefaultStagePerTrip) {
        if (typeof _dict._defaultStagePerTrip[cTripId] != "undefined") {
            var defaultStage = _dict._defaultStagePerTrip[cTripId].split(',');
            defaultFromId = parseInt(defaultStage[0]);
            defaultToId = parseInt(defaultStage[1]);
        }
    }
    if (vIsEstStr(ticket.fromArea)) {
        var indFrom = ticket.fromArea.indexOf("~");
        var from = ticket.fromArea.substr(indFrom + 1, ticket.fromArea.length).split("|");
        fromPoint = {
            Id: from[0],
            Type: from[1],
            Code: from[2],
            Name: from[3]
        };
    } else {
        var fromDefault = null;
        if (typeof stopPoints.idx[defaultFromId] != 'undefined') {
            fromDefault = stopPoints.data[stopPoints.idx[defaultFromId]];
            fromPoint = {
                Id: fromDefault.Id,
                Type: fromDefault.Type,
                Code: fromDefault.Code,
                Name: fromDefault.Name
            };
        } else {
            fromDefault = stopPoints.data[0];
            fromPoint = {
                Id: fromDefault.Id,
                Type: fromDefault.Type,
                Code: fromDefault.Code,
                Name: fromDefault.Name
            };
        }
    }
    if (vIsEstStr(ticket.toArea)) {
        var indTo = ticket.toArea.indexOf("~");
        var to = ticket.toArea.substr(indTo + 1, ticket.toArea.length).split("|");
        toPoint = {
            Id: to[0],
            Type: to[1],
            Code: to[2],
            Name: to[3]
        };
    } else {
        var toDefault = null;
        if (typeof stopPoints.idx[defaultToId] != 'undefined') {
            toDefault = stopPoints.data[stopPoints.idx[defaultToId]];
            toPoint = {
                Id: toDefault.Id,
                Type: toDefault.Type,
                Code: toDefault.Code,
                Name: toDefault.Name
            };
        }
        else {
            toDefault = stopPoints.data[stopPoints.data.length - 1];
            toPoint = {
                Id: toDefault.Id,
                Type: toDefault.Type,
                Code: toDefault.Code,
                Name: toDefault.Name
            };
        }
    }

    if (fromPoint) {
        if (fromPoint.Id != stopPoints["data"][0].Id) {
            fromName = fromPoint.Code;
        }
    }
    if (toPoint) {
        toName = toPoint.Code;
    }

    if (vIsEstStr(fromName)) {
        stageName = fromName + " - " + toName;
    } else {
        stageName = toName;
    }
    if (me._isAvailable()) {//this._status == 1 ??
        //Prepare data        
        var ticketFare = ticket._fare;
        if (vIsEstStr(ticket._surCharge)) {
            ticketFare += parseInt(ticket._surCharge);
        }
        if (vIsEstStr(ticket._discount)) {
            ticketFare -= parseInt(ticket._discount);
        }
        var data = {
            "seat": {
                _coach: me._coach,
                _row: me._row,
                _col: me._col,
                _class: "available",
                _label: me._label,
                _pInfo: "",
                _numStagetickets: "",
                _stageticketsTooltips: "",
                _note: ticket._note,
                _cname: vGln(ticket._cname),
                _cphone: "",
                _nTicketPerTrip: nTicketPerTrip > 1 ? " " + nTicketPerTrip + "G" : "",
                _pmInfo: "",
                _suser: "",
                _cuser: "",
                //_fare: vIsEstStr(ticket._fare) ? ticket._fare.toMn() + "đ" : "",
                _fare: vIsEstStr(ticketFare) ? ticketFare.toMn() + "đ" : "",
                _code: "",
                _notallow: ''
            }
        };
        if (limitedDatebyUser) {
            var pickUpType = "";
            var isEmpty = true;
            //_renderStageTicketsInfo

            var tooltip = me._renderStageTicketsInfo_Tooltips(me._tickets, stopPoints);
            if (!$.isEmptyObject(ticket)) {
                data["seat"]["_stageticketsTooltips"] = tooltip;
                data["seat"]["_numStagetickets"] = me._tickets.length;
                data["seat"]["_stageName"] = stageName;
                //CÓ VÉ TRONG CHẶNG, hoặc VÉ BÌNH THƯỜNG=> SHOW DEFAULT STATUS
                //Update DEFAULT INFO
                var pInfo = ticket._getPickupInfo();
                pickUpType = pInfo.type;
                data["seat"]["_class"] = _dict._cc[ticket._status]; //_status of each ticket when user books
                data["seat"]["_pInfo"] = !$.isEmptyObject(pInfo) ? pInfo.text : "";
                data["seat"]["_cphone"] = ticket._getDefaultPhoneNumber();
                data["seat"]["_code"] = ticket._getTicketCode();
                isEmpty = false;
                //Agent Info
                if (vIsEstStr(ticket._suser)) {
                    data["seat"]["_suser"] = "B:&nbsp;" + ticket._suser;
                }
                me._updatePaymentInfo_AgentInfo_ToSeat(data, ticket);
                if (data["seat"]["_pmInfo"].indexOf("VXR") > 0) {
                    data["seat"]["_class"] += " vxr";
                }
                //FBooking
                var fb = true;
                var fbooking = [];
                if (_dict._isFBooking.length > 0) {
                    $.each(_dict._isFBooking, function (id, r) {
                        if (typeof r != "undefined" && r != null) {
                            var f = r.split('|');
                            if (typeof fbooking[id] == "undefined") {
                                fbooking[id] = false;
                            }
                            for (var i = 0; i < f.length; i++) {
                                var v = ticket[f[i]];
                                switch (typeof v) {
                                    case 'string':
                                        fbooking[id] = fbooking[id] || vIsEstStr(v);
                                        break;
                                    case 'object':
                                        fbooking[id] = fbooking[id] || !$.isEmptyObject(v);
                                        break;
                                }
                            }
                        }
                    });
                }
                $.each(fbooking, function (_, f) {
                    fb = fb && f;
                });
                if (fb) {
                    data["seat"]["_class"] += " fbooking";
                }
                if (ticket._isCancelled()) {  //Vé hủy
                    data["seat"]["_cuser"] = "&nbsp;/&nbsp;C:&nbsp;" + ticket._getLastUpdateUser();
                    if (closedStatus == 1) {
                        if (ticket._canceledDate > realDepartureTime)
                            //"Huy sau khi xuat ben;
                            data["seat"]["_class"] = "booking";
                    }
                    if (ticket._cuser != null || vIsEstStr(ticket._cuser)) {
                        data["seat"]["_class"] = "paid";
                        if (data["seat"]["_pmInfo"] == " - VXR") {
                            data["seat"]["_class"] += " vxr";
                        }
                    }
                }

                //Half seat
                //if (vIsEstStr(ticket._fromArea) && vIsEstStr(ticket._toArea)) {
                //    data["seat"]["_half"] = " s-half";
            }

            if (me._tickets.length >= 1) {
                // CÓ VÉ TRONG GHẾ
                var stageCode = ticket.stageCode;
                hasBPermit = false;
                if (!stageCode) {
                    stageCode = 0; //Null, undefined, 0 gán 0; 
                }
                if ((stageCode & cStageCode) == 0) {
                    //VÉ NGOÀI CHẶNG ( Không vé hiện hành, không chạy code DEFAULT phía trên)
                    //Trường hợp có vé KOCHANG: stageCode=1 => không rơi trường hợp này=>nên không cần xét ở đây
                    //WHITE COLOR: Empty Seat, cho phép book, hiện tooltips;
                    data["seat"]["_numStagetickets"] = me._tickets.length;
                    data["seat"]["_stageticketsTooltips"] = tooltip;
                    data["seat"]["_class"] = data["seat"]["_class"].replace("booking", "").replace("fbooking", "");
                    hasBPermit = true;
                } else if ((stageCode == cStageCode) || stageCode == 1) {
                    //VÉ ĐÚNG CHẶNG=> SHOW Tình trạng vé, Nếu toàn chặng cho move, bình thường ko cho move;
                    hasBPermit = true;
                } else if ((stageCode & cStageCode) && (stageCode != cStageCode)) {
                    //VÉ LỆCH CHẶNG //GRAY COLOR; 
                    //Clear Info của VC khi lệch chặng
                    //Cần lấy vé đầu tiên.
                    me.disableClickEvent = true;
                    data["seat"]["_class"] = ""; //Gray Color: Disable all
                    var firstTicket = me._getFirstStageTicketInSeat();
                    data["seat"]["_cphone"] = firstTicket._getDefaultPhoneNumber();
                    var pInfo1 = ticket._getPickupInfo();
                    pickUpType = pInfo.type;
                    data["seat"]["_pInfo"] = !$.isEmptyObject(pInfo1) ? pInfo1.text : "";
                    data["seat"]["_cphone"] = firstTicket._getDefaultPhoneNumber();
                    data["seat"]["_cname"] = vGln(firstTicket._cname);
                    data["seat"]["_note"] = firstTicket._note;
                    me._updatePaymentInfo_AgentInfo_ToSeat(data, firstTicket);
                    //Agent Info
                    if (vIsEstStr(ticket._suser)) {
                        data["seat"]["_suser"] = "B:&nbsp;" + ticket._suser;
                    }
                    /*data["seat"]["_pmInfo"] = "";
                    data["seat"]["_suser"] = "";
                    data["seat"]["_pInfo"] = "";
                    data["seat"]["_nTicketPerTrip"] = "";
                    data["seat"]["_cname"] = "";
                    data["seat"]["_cphone"] = "";
                    data["seat"]["_cuser"] = "";
                    data["seat"]["_note"] = "";
                    data["seat"]["_pmInfo"] = "";
                    data["seat"]["_pmInfo"] = "";
                    data["seat"]["_pmInfo"] = "";*/
                    data["seat"]["_numStagetickets"] = me._tickets.length;
                    if (maxStageCode == stageCode) {
                        data["seat"]["_label"] = _dict._fullStageTicketLable; //VTC
                    } else {
                        data["seat"]["_label"] = _dict._stageTicketLable; //VC
                    }
                    ticket.isStageSeat = true;
                }

            }

            if (me._tickets.length == 1 && !isStageBooking && (ticket.stageCode == cStageCode || cStageCode == 0)) {
                data["seat"]["_numStagetickets"] = "";
            }
            if (hasBPermit) {
                var $b = $('<div />');
                var status = 0;
                if (!$.isEmptyObject(ticket)) {
                    status = ticket._status;
                }
                var st = _dict._st[status];

                if (ticket._type != 2 || (ticket._type == 2 && app.rights.indexOf($.rights.bEdtOnlTic.val) >= 0)) {
                    $.each(_dict._at, function (j, a) {
                        if (st.indexOf(j) != -1) {
                            var isShow = true;
                            if (closedStatus == 2) {
                                isShow = false;
                            } else {
                                if (a[1] == "B" && (app.rights.indexOf($.rights.bBook.val) == -1
                                    || (closedStatus == 1 && _dict._disallowBkAtrDpt && app.rights.indexOf($.rights.bBkAtDpt.val) == -1))) {
                                    isShow = false;
                                }
                                if (a[1] == "U" && app.rights.indexOf($.rights.bUpdate.val) == -1) {
                                    isShow = false;
                                }
                                if (a[1] == "M" && !_dict._stageTicketshowMButton && isStageBooking) {
                                    isShow = false;
                                }
                                if (app.rights.indexOf($.rights.bEnBtnAtDpt.val) == -1) {
                                    if (a[1] == "M" && (status == 2 || status == 5) && closedStatus == 1 && tripDetailId) {
                                        isShow = false;
                                    }
                                }
                                if (a[1] == "M" && app.rights.indexOf($.rights.bMove.val) == -1) {
                                    isShow = false;
                                }
                                if (app.rights.indexOf($.rights.bQBook.val) == -1) {
                                    if (a[1] == "P") {
                                        isShow = false;
                                    }
                                } else {
                                    if (a[1] == "P" && status != 1) {
                                        isShow = false;
                                    }
                                }
                                if (app.rights.indexOf($.rights.bQPay.val) == -1) {
                                    if (a[1] == "Q") {
                                        isShow = false;
                                    }
                                } else {
                                    if (a[1] == "Q" && status != 1) {
                                        isShow = false;
                                    }
                                }
                            }
                            if (!notallow) {
                                if (isShow) {
                                    $b.append($('<button />', { text: a[1], type: 'button' })
                                        .addClass(a[4])
                                        .attr('data-type', a[5]));
                                }
                            }
                        }
                    });
                    if (typeof notallow != 'undefined' && notallow) {
                        data['seat']["_notallow"] = 'notallow';
                    }
                    else {
                        data['seat']["_notallow"] = '';
                    }
                }

                data['seat']["buttons"] = $b.html();
            }

        }
        //Rendering
        if ($.isEmptyObject(ticket) && me._tickets.length <= 0) {
            //console.log("=======Không vé hiện hành và không vé trong ghế");
            $html = $(vtpl(_dict._sTpl, data));//Không tooltips
        } else if ($.isEmptyObject(ticket) && me._tickets.length >= 1) {
            //console.log("=======Không vé hiện hành và có vé trong ghế");
            $html = $(vtpl(_dict._svcTpl, data));//Không tooltips
        } else if (ticket.stageCode >= maxStageCode || ticket.stageCode == 1) {
            //console.log("=======Có vé Toàn chặng hoặc vé bình thường");
            //Có Vé, và là Vé Toàn chặng (TH VECHANG) hoặc  Vé Bình thường (KO CHANG)
            //ticket.stageCode=1,maxStageCode=1 => KOCHANG=> Normal Seat
            //ticket.stageCode=3,maxStageCode=3=>VTC => Normal Seat
            if (limitedDatebyUser) {
                $html = $(vtpl(_dict._sTpl, data));//Không tooltips
            }
        } else {//undefined, default
            //console.log("=======Có vé chặng");
            $html = $(vtpl(_dict._svcTpl, data));
        }

        if (pickUpType == 'T') {
            $html.find('.pick').addClass('transfer');
        }
        if (data["seat"]["_pInfo"] == "") {
            $html.find('.pick').css('background', 'none');
        }
        if (ticket._seri != null && ticket._seri != "") {
            $html.find('.seat-code').addClass('exported');
        }

        //if (notallow) {
        //    $html.addClass('notallow');
        //}


    } else {
        var ldata = {
            "seat": {
                _label: me._label,
            }
        };
        if (ticket.stageCode >= maxStageCode) {//VTC
            $html = $(vtpl(_dict._lksvcTpl, ldata));
        } else { //VC
            $html = $(vtpl(_dict._lksTpl, ldata));
        }
        //}
    }
    return $html;
};

S.prototype._updatePaymentInfo_AgentInfo_ToSeat = function (data, ticket) {
    var pmInfo = ticket._getPaymentInfo();
    var aInfo = ticket._getAgentInfo();
    if (!$.isEmptyObject(pmInfo)) {
        switch (pmInfo.type) {//hình thức thanh toán
            case 1:
            case 6:
                if (typeof pmInfo.info != "undefined") {
                    data["seat"]["_pmInfo"] = pmInfo.info._code;
                    data["seat"]["_pmFullInfo"] = 'CN/ĐL:&nbsp;' + pmInfo.info._name;
                }
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 7:
            case 8:
            case 9:
            case 10:
                data["seat"]["_pmInfo"] = pmInfo.sname;
                data["seat"]["_pmFullInfo"] = 'CN/ĐL:&nbsp;' + pmInfo.name;
                break;
        }

        //user charge
        if (vIsEstStr(ticket._cuser) && !ticket._isCancelled()) {
            data["seat"]["_cuser"] = "&nbsp;/&nbsp;P:&nbsp;" + ticket._cuser;
        }

    } else if (!$.isEmptyObject(aInfo)) {
        data["seat"]["_pmInfo"] = aInfo._code;
        data["seat"]["_pmFullInfo"] = 'CN/ĐL:&nbsp;' + aInfo._name;
    }

    if (typeof data["seat"]["_pmInfo"] != "undefined" && data["seat"]["_pmInfo"].length > 0) {
        data["seat"]["_pmInfo"] = " - " + data["seat"]["_pmInfo"];
    }
};

S.prototype._getFirstStageTicketInSeat = function () {
    var self = this;
    // Tìm vé có stageCode lớn nhất
    //if (self._tickets.length <= 0) {//self._tickets.length <= 0 || self._currentTicketIndex == -1
    if (self._tickets_idxMaxStageCode == -1) { //Không có index của vé hiện hành
        return {};
    }
    var ticket = self._tickets[self._tickets_idxMaxStageCode];

    return ticket ? ticket : {};
};

S.prototype._renderStageTicketsInfo_Tooltips = function (tickets, stopPoints) {
    var s = "";
    if (stopPoints) {
        var l = stopPoints.data.length - 1;
        $.each(tickets, function (i, t) {
            var id = "T" + t._id;
            var stageCode = t.stageCode.toString(2);
            var idx1 = l - stageCode.length;
            var idx2 = stageCode.indexOf("0");
            if (idx2 == -1) idx2 = l;
            else idx2 = idx1 + idx2;
            //Add StageInfo
            t.stage_Idx1 = idx1;
            t.stage_Idx2 = idx2;
            //Prepare tooltips
            var p = t._cphone ? t._cphone : "";
            var n = t._cname ? t._cname : "";
            var pn = "<p class='nhieu-chang-ng-dat'><small>" + n + " " + p + "</small></p>";
            var stageName = "";
            if (stopPoints.data[idx1] != null) {
                t.stage_point1 = stopPoints.data[idx1];
                t.stage_point2 = stopPoints.data[idx2];
                //Tooltips with StageName
                stageName = "<a href='#' data-fromId='" + t.stage_point1.Id + "' data-toId='" + t.stage_point2.Id + "' class='stage-ticket-context'>" + t.stage_point1.Code + " - " + t.stage_point2.Code + "</a>";
            }
            s = s + "<li>" + stageName + pn + "</li>";
        });
    }

    return s;
};

S.prototype._renderPrintStageSeat = function (nTicketPerTrip) {
    var self = this;
    var data = {
        "pseat": {
            _label: self._label,
            _pmInfo: "",
            _cname: "",
            _cphone: "",
            _note: "VÉ CHẶNG",
            _nTicketPerTrip: "", // nTicketPerTrip > 1 ? "(" + nTicketPerTrip + "v)" : "",
            _hidden: "hidden",
            _seri: self._code
        }
    };
    //data["pseat"]["_hidden"] = "hidden";
    var $html = $(vtpl(_dict._pssTpl, data));
    return $html;
},

S.prototype._renderPrintSeat = function (nTicketPerTrip, stopPoints, displayData) {
    var self = this;
    //Prepare data
    var ticket = self._getCurrentTicket();
    var fromPoint = null, fromName = "";
    var toPoint = null, toName = "";
    var stageName = "";
    if (vIsEstStr(ticket.fromArea)) {
        var indFrom = ticket.fromArea.indexOf("~");
        var from = ticket.fromArea.substr(indFrom + 1, ticket.fromArea.length).split("|");
        fromPoint = {
            Id: from[0],
            Type: from[1],
            Code: from[2],
            Name: from[3]
        };
    }
    if (vIsEstStr(ticket.toArea)) {
        var indTo = ticket.toArea.indexOf("~");
        var to = ticket.toArea.substr(indTo + 1, ticket.toArea.length).split("|");
        toPoint = {
            Id: to[0],
            Type: to[1],
            Code: to[2],
            Name: to[3]
        };
    }

    if (fromPoint) {
        if (stopPoints) {
            if (fromPoint.Id != stopPoints["data"][0].Id) fromName = fromPoint.Code;
        } else fromName = fromPoint.Code;
    }
    if (toPoint) toName = toPoint.Code;

    if (vIsEstStr(fromName)) {
        stageName = fromName + " - " + toName;
    } else stageName = toName;

    var data = {
        "pseat": {
            _label: self._label,
            _pmInfo: "",
            _cname: vGln(ticket._cname),
            _cphone: "",
            _note: ticket._note,
            _nTicketPerTrip: nTicketPerTrip > 1 ? "-" + nTicketPerTrip + "G" : "",
            _cFullName: ticket._cname,
            _stageName: stageName
        }
    };
    if (!$.isEmptyObject(ticket)) {
        if (ticket._status != 1) {
            data["pseat"]["_dathanhtoan"] = "da-thanh-toan";
        }

        data["pseat"]["_cphone"] = ticket._getDefaultPhoneNumber();
        data["pseat"]["_fare"] = ticket._fare.toMn() + "đ";
        data["pseat"]["_cuser"] = ticket._cuser;
        data["pseat"]["_suser"] = ticket._suser;
        if (typeof _dict._onlyPaidBackGround != "undefined" && _dict._onlyPaidBackGround) {
            if (ticket._status == 1) {
                data["pseat"]["_onlyPaidBackGround"] = "no-background";
            }
        }
        var pmInfo = ticket._getPaymentInfo();
        var aInfo = ticket._getAgentInfo();
        if (!$.isEmptyObject(pmInfo)) {
            data["pseat"]["_paid"] = "paid";
            switch (pmInfo.type) {
                case 1:
                    if (typeof _dict._showUCharge != "undefined" && _dict._showUCharge) {
                        if (ticket._cuser != "") {
                            var cuserSplit = ticket._cuser.split('.');
                            data["pseat"]["_pmInfo"] = cuserSplit[0];
                        } else {
                            data["pseat"]["_pmInfo"] = "";
                        }
                    } else {
                        if (!$.isEmptyObject(pmInfo.info)) {
                            data["pseat"]["_pmInfo"] = pmInfo.info._code;
                            data["pseat"]["_pmFullInfo"] = pmInfo.info._name;
                        } else {
                            data["pseat"]["_pmInfo"] = aInfo._code;
                            data["pseat"]["_pmFullInfo"] = aInfo._name;
                        }
                    }
                    break;
                case 6:
                    data["pseat"]["_pmInfo"] = pmInfo.info._code;
                    data["pseat"]["_pmFullInfo"] = pmInfo.info._name;
                    break;
                case 2:
                case 3:
                case 4:
                    if (typeof _dict._noBackground != "undefined" && _dict._noBackground) {
                        data["pseat"]["_nobackground"] = "no-background";
                    }
                    data["pseat"]["_pmInfo"] = pmInfo.sname;
                    data["pseat"]["_pmFullInfo"] = pmInfo.name;
                    break;
                case 5:
                case 7:
                case 8:
                case 9:
                case 10:
                    data["pseat"]["_pmInfo"] = pmInfo.sname;
                    data["pseat"]["_pmFullInfo"] = pmInfo.name;
                    break;
            }
        } else if (!$.isEmptyObject(aInfo)) {
            if (typeof _dict._noShowAgentInfo != "undefined" && _dict._noShowAgentInfo) {
                data["pseat"]["_pmInfo"] = "";
                data["pseat"]["_pmFullInfo"] = "";
            } else {
                data["pseat"]["_pmInfo"] = aInfo._code;
                data["pseat"]["_pmFullInfo"] = aInfo._name;
            }
        }

        if (vIsEstStr(ticket._seri)) {
            data["pseat"]["_exported"] = "exported";
        }

        var pInfo = ticket._getPickupInfo();
        if (!$.isEmptyObject(pInfo)) {
            if (!_dict._hasTransferOnPST) {
                if (pInfo.type == 'P') {
                    data["pseat"]["_pInfo"] = pInfo.text;
                }
            } else {
                if (pInfo.type == 'P') {
                    data["pseat"]["_pInfo"] = pInfo.text;
                }
                if (pInfo.type == 'T' && _dict._disTransferOnPST != undefined) {
                    if (_dict._disTransferOnPST == "default") {
                        data["pseat"]["_pInfo"] = pInfo.text;
                    } else {
                        data["pseat"]["_pInfo"] = _dict._disTransferOnPST;
                    }
                }
            }
        } else {
            data["pseat"]["_hidden"] = "hidden";
        }

        // Req for Thuận Tiến
        var ttPayment = "";
        if (ticket._status == 1) {
            ttPayment = "CTiền";
        } else if (ticket._status == 2 && !$.isEmptyObject(pmInfo)) {
            switch (pmInfo.type) {
                case 1:
                    if (vIsEstStr(ticket._staffName)) {
                        var staffName = ticket._staffName.split(" ");
                        ttPayment = staffName[staffName.length - 1];
                    }
                    break;
                case 6:
                    ttPayment = pmInfo.info._code;
                    break;
                default:
                    break;
            }
        } else if (ticket._status == 5) {
            ttPayment = "KoThu";
        }
        data["pseat"]["_ttPayment"] = ttPayment;
    } else {
        data["pseat"]["_hidden"] = "hidden";
    }

    //Render

    var $html = $(vtpl(_dict._psTpl, data));
    if (displayData != null) {
        data["data"] = displayData;
        $html = $(vtpl(_dict._psTpl_SeatGroup, data));
    }
    return $html;
};
S.prototype._renderCustomData = function (data) {
    return $(vtpl(_dict._psTpl_SeatGroup, data));
};

S.prototype._renderLSeat = function (nTicketPerTrip, index, hasBPermit, tic, stageName) {
    var self = this;
    var $html = $();
    var ticket = null;
    if (self._isAvailable()) {

        //Check status of seat map with ticket, expected each seat map with one ticket
        if (typeof tic != "undefined") {
            ticket = tic;
        } else {
            ticket = self._getCurrentTicket();
        }

        //Prepare data
        var data = {
            "seat": {
                _index: index,
                _coach: self._coach,
                _row: self._row,
                _col: self._col,
                _class: "available",
                _pInfo: "",
                _label: self._label,
                _cname: vGln(ticket._cname),
                _nTicketPerTrip: nTicketPerTrip > 1 ? "(" + nTicketPerTrip + "G)" : "",
                _cphone: "",
                _idate: "",
                _total: 0,
                _status: "",
                _pmInfo: "",
                _pmFullInfo: "",
                _suser: "",
                _cuser: "",
                _note: ticket._note,
                _stageName: stageName,
                _fromCode: "",
                _fromName: "",
                _toCode: "",
                _toName: ""
            }
        };

        if (!$.isEmptyObject(ticket)) {
            if (ticket.fromArea != undefined && ticket.fromArea != null) {
                var fromArea = ticket.fromArea.split('|');
                var fromCode = fromArea[2];
                var fromName = fromArea[3];
                data["seat"]["_fromCode"] = fromCode;
                data["seat"]["_fromName"] = fromName;
            }
            if (ticket.toArea != undefined && ticket.toArea != null) {
                var toArea = ticket.toArea.split('|');
                var toCode = toArea[2];
                var toName = toArea[3];
                data["seat"]["_toCode"] = toCode;
                data["seat"]["_toName"] = toName;
            }

            var pInfo = ticket._getPickupInfo();
            if (!$.isEmptyObject(pInfo)) {
                data["seat"]["_pInfo"] = pInfo.text;
            }

            data["seat"]["_cphone"] = ticket._getDefaultPhoneNumber();
            data["seat"]["_idate"] = ticket._issue.toFormatString('dd-mm-yyyy hh:ii');
            //Agent Info
            data["seat"]["_total"] = ticket._fare.toMn() + "đ";
            data["seat"]["_status"] = ticket._getStatusText();

            data["seat"]["_suser"] = ticket._suser;

            if (ticket._isPaid() || ticket._isPass()) {
                var pmInfo = ticket._getPaymentInfo();
                if (!$.isEmptyObject(pmInfo)) {
                    switch (pmInfo.type) {
                        case 1:
                        case 6:
                            if (typeof pmInfo.info != "undefined") {
                                data["seat"]["_pmInfo"] = pmInfo.info._code;
                                data["seat"]["_pmFullInfo"] = 'CN/ĐL:&nbsp;' + pmInfo.info._name;
                            }
                            break;
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                            data["seat"]["_pmInfo"] = pmInfo.sname;
                            data["seat"]["_pmFullInfo"] = pmInfo.name;
                            break;
                    }

                    //user charge
                    if (vIsEstStr(ticket._cuser)) {
                        data["seat"]["_cuser"] = ticket._cuser;
                    }
                }
            } else if (ticket._isCancelled()) {
                data["seat"]["_cuser"] = ticket._getLastUpdateUser();
            }

            data["seat"]["_issue"] = ticket._issue.getTime();
        }
        if (hasBPermit && !app.oRights["StageEnable"]) {
            var $b = $('<div />');
            var status = 0;
            if (!$.isEmptyObject(ticket)) {
                status = ticket._status;
            }
            var st = _dict._lst[status];

            $.each(_dict._at, function (j, a) {
                if (st.indexOf(j) != -1) {
                    $b.append($('<button />', { text: a[1], type: 'button' })
                        .addClass(a[4])
                        .attr('data-type', a[5]));
                }
            });
            data['seat']["_buttons"] = $b.html();
        }

        //Rendering
        $html = $(vtpl(_dict._ilTpl, data));
    }

    return $html;
};

/* Get Seat info (~ Status | Index | Type | Code | Name | FloorIndex | RowIndex | ColIndex | RowSpan | ColSpan | Position | Note | CSS)
  *************************************************************************/
S.prototype._getSeatInfo = function () {
    var self = this;
    return self._label + '|' + self._coach + '|' + self._row + '|' + self._col;
};

S.prototype._getSeatType = function () {
    return this._type;
};

/* Add ticket
 *************************************************************************/
S.prototype._addTicket = function (t, cStageCode, stageCode) {
    var self = this; //Seat
    var index = self._tickets.push(t) - 1;
    var sc = stageCode ? stageCode : self._tickets[index].stageCode;
    if (sc & cStageCode) {
        self._currentTicketIndex = index; // If current StageCode == the StageCode of Ticket=> current Ticket
    }

    if (!isNaN(sc)) { //kiểm tra vé có mã chặng
        self._seatStatus = self._seatStatus | sc; //SeatStatus => all tickets booked
        //Đánh index cho vé có MaxStageCode
        if (index == 0 || sc >= self._tickets[self._tickets_idxMaxStageCode].stageCode)
            self._tickets_idxMaxStageCode = index;
    }


    //self._changeStatus(2); //lock seat
};

S.prototype._getCurrentTicket = function (cStageCode) {
    var self = this;
    //if (self._tickets.length <= 0) {//self._tickets.length <= 0 || self._currentTicketIndex == -1
    if (self._currentTicketIndex == -1) {
        return {};
    }
    var ticket = self._tickets[self._currentTicketIndex];

    if (ticket && ticket.stageCode && cStageCode && cStageCode >= 1) { //cStageCode is not undefine 
        if ((cStageCode & ticket.stageCode) == 0) return {};
    }

    return ticket ? ticket : {};
};

S.prototype._getTicketById = function (id) {
    var self = this;
    var result = {};
    $.each(self._tickets, function (_, t) {
        if ($.isEmptyObject(result)) {
            if (t._id == id) {
                result = t;
            }
        }
    });
    return result;
};

/* Change status
*************************************************************************/
S.prototype._changeStatus = function (status) {
    this._status = status;
};

/* Seat status
*************************************************************************/
S.prototype._isAvailable = function () {
    return this._status == 1;
};

S.prototype._isLock = function () {
    return this._status == 2;
};

S.prototype._hasTicket = function () {
    return this._tickets.length > 0;
};

S.prototype._clone = function () {
    var self = this;
    return $.extend({}, self);
};
