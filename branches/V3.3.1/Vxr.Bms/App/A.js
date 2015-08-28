$.idb = true;               //Is debug?
var vdc = {}, app = {};
app.vsn = '3.3.1'; //Module version
app.mvs = 1; //Model version
app.baseUrl = 'http://localhost:2015/bms';
//app.baseUrl = 'http://beta.vexere.com';
//app.baseUrl = 'http://localhost:2015/bms';
//app.baseUrl = '/';
app.serviceUrl = 'Kernel.asmx/P';
app.backupBaseUrl = 'Backup.ashx';
app.reportBaseUrl = 'Report.ashx';
app.status = 1;             //0: Dev mode, 1: Release mode
app.vid = 1;                //Vexere company id
app.vaid = 135;              //vexere agent id
app.cPath = 'Comp';         //Comp path
app.ddfm = 'dd-mm-yy';      //Date display format
app.mvs = 1; //Model version
app.FTimeLimitedRequestTime = 4000;
$(document).ready(function () {
    require([(app.loadFromStatic ? app.staticServer : "") + 'App/App.min.js?v=' + app.ivs]);
});

//De build thu cho may coi :3
