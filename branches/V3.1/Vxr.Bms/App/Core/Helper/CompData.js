function CompData(type, onCompLoaded, onTripLoaded, onError){
	//Type: 0: all, 1: hasOnline, 2: hasOffline, 3: has Online or Offline
	CompData.prototype.type=type;
	CompData.prototype.comps={};
	CompData.prototype.onCompLoaded=onCompLoaded;
	CompData.prototype.onTripLoaded=onTripLoaded;
	CompData.prototype.onError=onError;
}

CompData.prototype.loadData=function(){

}

CompData.prototype.loadComps=function(){
	var me=this;
	var condition=function(){
		return "$x=1 and IsPrgStatus=1 " + me.type==3?" and (HasOnlineContract=1 or HasOfflineContract=1)"?me.type==2?" and HasOfflineContract=1"
		?me.type==1:" and HasOnlineContract=1":"";
	}
	vRqs({
        _a: 'fGetCompany',
        _c: {Type: condition()},
        _f:"Id, Name, FullName, AddressInfo, PhoneInfo, HasOfflineContract, HasOnlineContract "
    }, function (u, r, l) {
        if (u == 1 && r.length > 0) {
            for (var i = 0; i < r.length; i++) {
                var comp={
                    id:r[i][0],
                    name:r[i][1],
                    fullName:r[i][2],
                    addressInfo:r[i][3],
                    phoneInfo:r[i][4],
                    hasOfflineContract:r[i][5]==1,
                	hasOnineContract:r[i][6]
                };
                me.comps[comp.id]=comp;
            }
            if me.onCompLoaded!+null{
        		me.onCompLoaded.call();
            }
        }else{

        }
    });        
}

CompData.prototype.loadTrips=function(compId, date){
	var me=this;
	
	var getTripInfo(record){
		var result={};
		if (record!=null){
			result.id=record[0];
			record.type=record[1];
			result.name=record[2];
			result.FromArea= record[3];
			result.ToArea=record[4];
			result.date=record.type==1?"":date;
			result.time=record[5];
			result.routeInfo=record[6];
			result.fareInfo=record[7];
			result.seatTemplateInfo=record[8];
			result.statusInfo=record[9];
			result.info=record[10];
			result.baseId=record[11];
		}
		return result;
	};

	if (me.comps[compId]==null) {
		if (me.onError!=null) me.onError.call();
	}else{
		vRqs({
        _a: 'fGetTrip',
        _c: {
        	IsPrgStatus: "$x=1 and CompId=" + compId + " and (Type=1 or (Type=2 and TripDate>='" + moment(date).format("YYYY-MM-DD 00:00:00")
        		+ "'' and TripDate<='"+moment(date).format("YYYY-MM-DD 23:59:59") + "'')) order by Type "
        }, 
        _f:"Id, Type, Name, FromArea, ToArea, Date,Time, RouteInfo, FareInfo, SeatTemplateInfo, StatusInfo, Info, BaseId "
	    }, function (u, r, l) {
	        if (u == 1 && r.length > 0) {
	            for (var i = 0; i < r.length; i++) {
	      			var trip=getTripInfo(r[i]);
            	}     
	        }else{
	        	if (me.onError!=null) me.onError.call();
	        }
	    });        		
	}
	
}