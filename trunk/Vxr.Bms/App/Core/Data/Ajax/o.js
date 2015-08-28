var oRq = {
    iAc: false, // Is ajax calling, default is false
    cEl: null, //Current focus element
    cKey: null, //Current key
    cAType: 1, // Current action type: 1: default - 2: ajax request
    cLType: null, //Current lock type, 1: disable
    cRqs: [] // Current calling requests chứa các request đang gọi server
};