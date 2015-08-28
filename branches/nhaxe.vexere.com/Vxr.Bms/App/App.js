jQuery(document).ready(function () {
    $.idb = true;               //Is debug?

    app.vsn = '2.1.8';          //App version
    app.status = 0;             //0: Dev mode, 1: Release mode
   
    app.vid = 1;                //Vexere company id
    app.cPath = 'Comp';         //Comp path
    app.ddfm = 'dd-mm-yy';      //Date display format
    app.mvs = 1,                //Model version
    $.ajaxSetup({ cache: false });
   
    $(document).ajaxStart(function () { Pace.restart(); });
    require.config({ urlArgs: "v=" + (new Date()).getTime() });
    var name = app.status ? 'z.min' : 'z';
    require(['App/Include/' + name + '.js?v=' + app.vsn, 'App/Core/' + name + '.js?v=' + app.vsn], function () {
        $.vApplyAllRights();
        $.registerHelpers();
        $.loadTemplates();
        $.loadModules();
    });
    
});