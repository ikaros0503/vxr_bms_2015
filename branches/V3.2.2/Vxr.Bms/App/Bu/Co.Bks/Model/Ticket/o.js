/*************************************************************************************
* TICKET 
* Ticket status: 1.Booking, 2.Paid, 3.Cancelled, 4.Notcome, 5.Pass, 6.Valid, 7.Open, 8.Keep on time  *
**************************************************************************************/
var T = function (id, dept, cid, cname, cphone, status, issue, pdate, fare, note,
                    pInfo, seri, pmInfo, hInfo, code, pcode, fromValid, toValid, updatedDate, aInfo, surCharge,
                    suser, cuser, stageCode, tripId, deposit, discount, fromArea, toArea, seatType, debt, canceledDate,
                    cancelInfo, type, chargeDate, sNote, responUser, porDate, staffName, cancelType, numOfSend, firstUserUpdated,
                    expiredTime, printStatus, issuedUser, numOfPrint, fromStop, toStop) {
    this._id = id;
    this._dept = dept;
    this._cid = cid;
    this._cname = cname;
    this._cphone = cphone;
    this._status = status;
    this._issue = issue;
    this._pdate = pdate;
    this._fare = fare;
    this._note = note;
    this._pInfo = pInfo;
    this._seri = seri;
    this._pmInfo = pmInfo; //PaymentInfo
    this._hInfo = hInfo; //History
    this._code = code;
    this._pcode = pcode;
    this._fromValid = fromValid;
    this._toValid = toValid;
    this._updatedDate = updatedDate;
    this._aInfo = aInfo;
    this._surCharge = surCharge;
    this._deposit = deposit;
    this._discount = discount;
    this._suser = suser;
    this._cuser = cuser;
    this.stageCode = stageCode;
    this.tripId = tripId;
    this.fromArea = fromArea;
    this.toArea = toArea;
    this._seatType = seatType;
    this._debt = debt;
    this._canceledDate = canceledDate;
    this._cancelInfo = cancelInfo;
    this._type = type;
    this._chargeDate = chargeDate;
    this._sNote = sNote;
    this._responUser = responUser;
    this._porDate = porDate;
    this._staffName = staffName;
    this._cancelType = cancelType;
    this._numOfSend = numOfSend;
    this._firstUserUpdated = firstUserUpdated;
    this._expiredTime = expiredTime;
    this._printStatus = printStatus;
    this._issuedUser = issuedUser;
    this._numOfPrint = numOfPrint;
    this._fromStop = fromStop;
    this._toStop = toStop;
};

