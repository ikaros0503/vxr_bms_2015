$.idb = true;               //Is debug?
var vdc = {}, app = {};
app.vsn = '2.1.1'; //Module version
app.mvs = 1; //Model version
app.baseUrl = 'http://localhost:2016/bms';
app.serviceUrl = 'Kernel.asmx/P';
app.backupBaseUrl = 'Backup.ashx';
app.reportBaseUrl = 'Report.ashx';
app.status = 1;             //0: Dev mode, 1: Release mode
app.vid = 1;                //Vexere company id
app.cPath = 'Comp';         //Comp path
app.ddfm = 'dd-mm-yy';      //Date display format
app.mvs = 1, //Model version
$(document).ready(function() {
    require([(app.loadFromStatic ? app.staticServer : "") + 'App/App.min.js?v=' + app.ivs]);
});