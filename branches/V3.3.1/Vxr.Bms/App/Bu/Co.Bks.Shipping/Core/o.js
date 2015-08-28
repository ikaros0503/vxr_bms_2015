/************************************************************************
* ITEM                                                                  *
*************************************************************************/
var ItemPro = function (id, index, code, agentInfo, senderInfo, receiverInfo, num, unit, weight, note, fare, status, createdUser, tripId, tripTime, tripDate, receivedUser, receivedAgentInfo, deliveryInfo) {
    this._id = id;
    this._index = index;
    this._code = code;
    this._officeReceivedName = receivedAgentInfo._name;
    this._postOfficeCode = agentInfo._code;
    this._senderName = senderInfo._name;
    this._senderPhone = senderInfo._phone;
    this._receiverName = receiverInfo._name;
    this._receiverPhone = receiverInfo._phone;
    this._receivedAddress = receiverInfo._address;
    this._num = num;
    this._unit = unit;
    this._weight = weight;
    this._note = note;
    this._fare = fare;
    this._statusName = status._name;
    this._statusCode = status._code;
    this._createdUser = createdUser;
    this._tripId = tripId;
    this._tripTime = tripTime;
    this._tripDate = tripDate;
    this._receivedUser = receivedUser;
    this._receivedAgentInfo = receivedAgentInfo;
    this._deliveryInfo = deliveryInfo;
};

/************************************************************************
* PRODUCT                                                               *
*************************************************************************/

// SenderInfo: Version | Type | Id | FullName | PhoneNumbers | FaxNumbers | Emails | Addresses
var SenderInfo = function (name, phone) {
    this._name = name;
    this._phone = phone;
};

// ReceiverInfo: Version | Type | Id | FullName | PhoneNumbers | FaxNumbers | Emails | Addresses
var ReceiverInfo = function (name, phone, address) {
    this._name = name;
    this._phone = phone;
    this._address = address;
};

// FromArea: Version ~ Index | Type | Code | Name 
var FromArea = function (name) {
    this._name = name;
};

// ToArea: Version ~ Index | Type | Code | Name 
var ToArea = function (name) {
    this._name = name;
};

// AmountInfo: Type | Value
var AmountInfo = function (type, value) {
    this._type = type;
    this._value = value;
};

// Status: 1-chưa thanh toán
//         2-đã thanh toán
//         3-chưa thanh toán + chưa nhận
//         4-chưa thanh toán + đã nhận
//         5-đã thanh toán + chưa nhận
//         6-đã thanh toán + đã nhận
//         7-chưa thanh toán + chưa giao
//         8-đã thanh toán + chưa giao
//         9-đã thanh toán + đã giao
var ProductStatus = function (code, name) {
    this._code = code;
    this._name = name;
};
// Unit: 1-Thùng, 2-Cái
var ProductUnit = function (code, name) {
    this._code = code;
    this._name = name;
};

// AgentInfo: Id | Type | Code | Name | Address | Phone
var AgentInfo = function (id, type, code, name, address, phone) {
    this._id = id;
    this._type = type;
    this._code = code;
    this._name = name;
    this._address = address;
    this._phone = phone;
};
// ReceivedAgentInfo: Id | Type | Code | Name | Address | Phone
var ReceivedAgentInfo = function (id, type, code, name, address, phone) {
    this._id = id;
    this._type = type;
    this._code = code;
    this._name = name;
    this._address = address;
    this._phone = phone;
};

// CreatedDate: Date & Time
var CreatedDate = function (date, time) {
    this._date = date;
    this._time = time;
};

var Pro = function (id, index, code, agentInfo, senderInfo, receiverInfo, num, unitInfo, weight, note, fare, status, createdUser, agentId, createdDate, receivedUser, deliveryInfo) {
    this._id = id;
    this._index = index;
    this._code = code;
    this._agentInfo = agentInfo;
    this._senderInfo = senderInfo;
    this._receiverInfo = receiverInfo;
    this._num = num;
    this._unitInfo = unitInfo;
    this._weight = weight;
    this._note = note;
    this._fare = fare;
    this._statusInfo = status;
    this._createdUser = createdUser;
    this._agentId = agentId;
    this._createdDate = createdDate;
    this._receivedUser = receivedUser;
    this._deliveryInfo = deliveryInfo;
};

