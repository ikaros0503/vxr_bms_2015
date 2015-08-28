/************************************************************************
* ITEM                                                                  *
*************************************************************************/
var I = function (coach, row, col, status, css, label) {
    this._coach = parseInt(coach);
    this._row = parseInt(row);
    this._col = parseInt(col);
    this._status = parseInt(status);
    this._class = css;
    this._label = label;
};
/************************************************************************
* SEAT (each item in matrix is seat)    
* Seat status: 1. Availble, 2. Lock                                     *
*************************************************************************/
var S = function (coach, row, col, status, css, label, type) {
    I.call(this, coach, row, col, status, css, label);
    this._type = parseInt(type); //Type of seat
    this._tickets = [];
    this._tickets_idxMaxStageCode = 0;
    this._currentTicketIndex = -1;
    this._seatStatus = 0;
};