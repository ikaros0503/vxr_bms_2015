Pro.prototype._parseSenderInfo = function (data) {
    var sender = data.split('|');
    if (sender.length > 0) {
        this._senderInfo = new SenderInfo(sender[3], sender[4]);
    }
}
Pro.prototype._parseReceiverInfo = function (data) {
    var receiver = data.split('|');
    if (receiver.length > 0) {
        this._receiverInfo = new ReceiverInfo(receiver[3], receiver[4], receiver[7]);
    }
}
Pro.prototype._parseStatusInfo = function (statusCode) {
    switch (statusCode) {
        case 1:
            this._statusInfo = new ProductStatus(statusCode, 'Chưa TT');
            break;
        case 2:
            this._statusInfo = new ProductStatus(statusCode, 'Đã TT');
            break;
        case 3:
            this._statusInfo = new ProductStatus(statusCode, 'Chưa TT');
            break;
        case 4:
            this._statusInfo = new ProductStatus(statusCode, 'Chưa TT');
            break;
        case 5:
            this._statusInfo = new ProductStatus(statusCode, 'Đã TT');
            break;
        case 6:
            this._statusInfo = new ProductStatus(statusCode, 'Đã TT');
            break;
        case 7:
            this._statusInfo = new ProductStatus(statusCode, 'Chưa TT');
            break;
        case 8:
            this._statusInfo = new ProductStatus(statusCode, 'Đã TT');
            break;
        case 9:
            this._statusInfo = new ProductStatus(statusCode, 'Đã TT');
            break;
        default:
            this._statusInfo = new ProductStatus('unknown', 'Không xác định');
            break;
    }
}
Pro.prototype._parseAgentInfo = function (data) {
    var agentInfo = data.split('|');
    if (agentInfo.length > 0) {
        this._agentInfo = new AgentInfo(agentInfo[0], agentInfo[1], agentInfo[2], agentInfo[3], agentInfo[4], agentInfo[5]);
    }
}
Pro.prototype._parseReceivedAgentInfo = function (data) {
    var receivedAgentInfo = data.split('|');
    if (receivedAgentInfo.length > 0) {
        this._receivedAgentInfo = new ReceivedAgentInfo(receivedAgentInfo[0], receivedAgentInfo[1], receivedAgentInfo[2], receivedAgentInfo[3], receivedAgentInfo[4], receivedAgentInfo[5]);
    }
}
Pro.prototype._parseAmountInfo = function (data) {
    var amountInfo = data.split('|');
    if (amountInfo.length > 0) {
        switch (parseInt(amountInfo[0])) {
            case 1:
                this._unitInfo = new ProductUnit(1, 'Thùng');
                break;
            case 2:
                this._unitInfo = new ProductUnit(2, 'Cái');
                break;
            default:
                this._unitInfo = new ProductUnit(0, 'Không biết');
                break;
        }
        this._num = amountInfo[1];
    }
}
Pro.prototype._parseCreatedDate = function (input) {
    var date = input.getDate();
    var month = input.getMonth() + 1;
    var year = input.getFullYear();
    var hour = input.getHours();
    var minute = input.getMinutes();
    if (date.toString().length == 1) {
        date = "0" + date;
    }
    if (month.toString().length == 1) {
        month = "0" + month;
    }
    if (hour.toString().length == 1) {
        hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
        minute = "0" + minute;
    }
    this._createdDate = new CreatedDate(date + "/" + month + "/" + year, hour + ":" + minute);
}

//Date.prototype.toFormatString = function (format) {
//    function pad(number) {
//        var r = String(number);
//        if (r.length === 1) {
//            r = '0' + r;
//        }
//        return r;
//    }

//    var dOW = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ 6", "Thứ 7"];
//    var result = "";

//    var dname = dOW[this.getDay()];
//    var day = this.getDate();
//    var month = this.getMonth() + 1;
//    var year = this.getFullYear();
//    var hour = this.getHours();
//    var minute = this.getMinutes();

//    switch (format) {
//        case "dd-mm-yyyy hh:ii":
//            result = pad(day) + "-" + pad(month) + "-" + year + " <b>" + pad(hour) + ":" + pad(minute) + "</b>";
//            break;
//        case "dd/mm/yyyy":
//            result = pad(day) + "/" + pad(month) + "/" + year;
//            break;
//        case "dd-mm-yyyy":
//            result = pad(day) + "-" + pad(month) + "-" + year;
//            break;
//        case "iso":
//            result = year + '-' + pad(month) + '-' + pad(day) + 'T' + pad(hour) + ':' + pad(minute) + ':00.000';
//            break;
//        case "hh:mm":
//            result = pad(hour) + ':' + pad(minute);
//            break;
//        case "dd.mm.yyyy":
//            result = pad(day) + "." + pad(month) + "." + year;
//            break;
//        case "HH:mm - dd.mm.yyyy":
//            result = pad(hour) + ":" + pad(minute) + " - " + pad(day) + "." + pad(month) + "." + year;
//            break;
//        case "DD dd-mm-yyyy":
//            result = dname + " " + pad(day) + "-" + pad(month) + "-" + year;
//            break;
//    }
//    return result;
//}


//fGetProductOrder
//InsertProductOrder
//UpdateProductOrder
//InProducts
//UpProducts
//fGetProduct