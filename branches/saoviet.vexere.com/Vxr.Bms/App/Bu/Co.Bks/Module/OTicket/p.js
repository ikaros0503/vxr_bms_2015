define({
    info: [], comps:{},
    pager: null,
    start:function() {
        $('#bksContent').hide();
        $('#report').hide();
        $('#product-content').hide();
        $('#bTickets').hide();
        $('#cod').hide();
        $('div.footer').hide();
        $('#oTicket').show();
        $('#oTicket').html($("#oTicketTemplate").html());
        this.init();
    },

    init: function () {
        var me = this;
        $(".view-mode").show();
        $(".edit-mode").hide();
        
        me.loadComp();

        var bindEvent = function () {
            $("button.btn-edit").click(function () {
                $(".view-mode").hide();
                $(".edit-mode").show();
            });
            $("button.btn-done").click(function () {
                $(".view-mode").show();
                $(".edit-mode").hide();
            });

        };
        $.getScript('App/Core/UI/pager.js', function () {
            me.pager = new Pager(1, 10, "#oTicket div.page", 5, function () {
                me.renderInfo();
            });
            me.pager.render();
            me.updateFilter().loadInfo();
        });
    },

    loadTrip:function(compId){
        var me=this;
        if (me.comps[compId]!=null){

        }else{
            $("#oTicket select[name=comp]").html("");
            vRqs({
            _a: 'fGetTrip',
            _c: {Type:"($x=1 or $x=2) and IsPrgStatus=1 and CompId=" + compId},
            _f:"Id, Type, Name, FromArea, ToArea, Date,Time, RouteInfo, FareInfo, SeatTemplateInfo, StatusInfo, Info, BaseId  "
            }, function (u, r, l) {
                if (u == 1 && r.length > 0) {
                    for (var i = 0; i < r.length; i++) {
                        
                    } 
                }
            });        
        }
        
                
    },

    loadComp:function(){
        var me=this;
        $("#oTicket select[name=comp]").html("");
         vRqs({
            _a: 'fGetCompany',
            _c: {Type:"$x=1 and (HasOnlineContract=1 or HasOfflineContract=1)"},
            _f:"Id, Name "
        }, function (u, r, l) {
            if (u == 1 && r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    var comp={
                        id:r[i][0],
                        name:r[i][1]
                    };
                    me.comps[comp.id]=comp;
                    $("#oTicket select[name=comp]").append('<option value="'+comp.id+'">'+comp.name+'</option>');
                }   
            }
        });        
    },

    setStatus:function() {
        
    },

    renderInfo:function() {
        var me = this;
        var bindEventToRow=function(){
            $("#oTicket button.btn-edit").click(function(){
                var id=$(this).attr('data-id');
                $("#oTicketRow" + id + " .view-mode").hide();
                $("#oTicketRow" + id + " .edit-mode").show();
            });
            
            $("#oTicket button.btn-done").click(function(){
                var id=$(this).attr('data-id');
                $("#oTicketRow" + id + " .view-mode").show();
                $("#oTicketRow" + id + " .edit-mode").hide();
                //save
            });
            $("#oTicket button.btn-cancel").click(function(){
                var id=$(this).attr('data-id');
                $("#oTicketRow" + id + " .view-mode").show();
                $("#oTicketRow" + id + " .edit-mode").hide();
            });
        };

        if (me.info.length <= 0) return;
        //render
        $("#oTicket table.data tbody").html('');
        var start = (me.pager.currentPage - 1) * me.pager.itemsPerPage;
        var end = Math.min(me.pager.currentPage * me.pager.itemsPerPage, me.pager.totalRecords) - 1;

        for (var i = start; i <= end; i++) {
            $("#oTicket table.data tbody").append(vtpl($("#oTicketRowTemplate").html(), me.info[i]));
        }
        bindEventToRow();
    },

    updateFilter:function() {
        var me = this;
        return me;
    },

    loadInfo: function () {
        var me = this;
        me.setStatus("loading");
        me.info = [];

        var getInfoItemFromRecord = function(record,i) {
            var result = {};
            result.index = i;
            result.id = record[0];
            result.amount=record[1];
            result.customerName = record[2];
            result.customerPhone=record[3];
            result.customerMail=record[4];
            result.note=record[5];
            result.tripName=record[6];
            result.tripDate=record[7];
            result.tripTime=record[8];
            result.fromArea=record[9];
            result.toArea=record[10];
            result.createdDate=record[11];
            result.compName=record[12];
            result.status=record[13];
            return result;
        };

        vRqs({
            _a: 'fGetBus_Ticket_Form',
            _c: {},
            _f:"Id, Amount, CName, CPhone, CEmail, CNote, TripName, TripDate, TripTime, FromArea, ToArea, IsPrgCDate, IsPrgCompanyInfo, Status"
        }, function (u, r, l) {
            if (u == 1 && r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    me.info.push(getInfoItemFromRecord(r[i],i));
                }
                me.pager.updateInfo(me.info.length, 1).render();
                me.setStatus("loaded");
            } else {
                me.setStatus("error");
            }
        });
    },

    

});