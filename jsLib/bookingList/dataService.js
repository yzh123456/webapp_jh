
export let dataparkInfo = {
    //加载定车停车场详情接口
    loadCarPlacehistoryRecord : function(id,long,lat,userId){
        let carPlaceInfo = "";
        let obj = {
            serviceId:"ac.park.sy_getparkinfo",
            dataItems:[]
        };
        var tmp = {
            attributes:{
                //unionid:"userid:"+userId,
                id:id,
                beforelongitude:long,
                beforelatitude:lat,
                unionid :'userid:'+userId


            }
        };
        obj.dataItems.push(tmp);
        $.ajax({
           // url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
           url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
            data: {
                serviceId:obj.serviceId,
                dataItems:JSON.stringify(obj.dataItems)
            },
            dataType : 'json',
            type:'post',
            async:true,
            success : function(data) {
                console.log(data)
                console.log("success ajax");
                carPlaceInfo = data;
            }
        });

        return carPlaceInfo;
    },
}

export let datapark = {
    //加载预定参数
    loadRecord : function(parkId){

        let carPlace = "";
        let obj = {
            serviceId:"ac.park.sy_getqueryparksurplus",
            dataItems:[]
        };
        var tmp = {
            attributes:{
                //unionid:"userid:"+userId,
                parkid:parkId
            }
        };
        obj.dataItems.push(tmp);
        $.ajax({
            url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
            //url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
            data: {
                serviceId:obj.serviceId,
                dataItems:JSON.stringify(obj.dataItems)
            },
            dataType : 'json',
            type:'post',
            async:true,
            success : function(data) {
                console.log(data)
                console.log("success ajax");
                carPlace = data;
            }
        });

        return carPlace;
    },
}






