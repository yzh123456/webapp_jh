import {AppBridge} from "../common/util/AppBridge";
import {XMPPSERVER} from "../common/util/Enum";
/*var user_id = "";
var long = "";
var lat = "";*/
AppBridge;

/*
export let dataService = {
    //加载收藏的车场历史接口查询
    loadCarPlaceCollectRecord : function(pageIndex,user_id,long,lat){
        let carPlaceList = "";
        
       // alert("user_id:" + datalist.USER.USER_ID+"long:" + datalist.USER.longtitude+"lat:" +datalist.USER.latitude)


        var obj = {
        		serviceId:"ac.park.sy_getuserattention",
        		dataItems:[]

        }
        //unionid:"userid:"+ BASEDATA.USER.USER_ID
        // unionid:"userid:oUjGnjqNG9O7fkjQu5bC1jjQ0DxU"
        //BASEDATA.USER.longtitude  BASEDATA.USER.latitude
        var tmp = {
        	attributes:{
        				pageSize:"10",
        				pageIndex:pageIndex,
                        //beforelongitude:datalist.USER.longtitude,
                         //beforelatitude:datalist.USER.latitude,
                         //unionid :"userid:"+ datalist.USER.USER_ID

        				beforelongitude: long || '113.366856',
        				beforelatitude:lat || '22.521415',
                        unionid :"userid:"+ user_id || 'userid:oUjGnjqNG9O7fkjQu5bC1jjQ0DxU'

        		}
        }

        obj.dataItems.push(tmp);


        $.ajax({
            url:XMPPSERVER,

          //  url : 'http://jhtestcms.jslife.net/jspsn/XmppServer.servlet ',
            cache : false,
            data: {
            	//云服务 serviced
                serviceId:obj.serviceId,
                dataItems:JSON.stringify(obj.dataItems),
                async:true


            },
            async:false,
            dataType : 'json',
            type:'post',

            success : function(data) {
                carPlaceList = data;
                console.log(data)

        },
    });
        return carPlaceList;
    },
}


*/


export let dataCancel = {
    //加载取消车场接口查询
    loadCarPlaceCancel: function(id){
        var carPlaceList = "";
        window.loadMoreStop = false;
        var obj = {	
        		serviceId:"ac.park.sy_canceluserattention",
        		dataItems:[]
        		
        }
        var tmp = {
        	attributes:{
				id:id
        		}
        }
        obj.dataItems.push(tmp);
        window.jspsnQueryOpen = function(){
		return 		sessionStorage.getItem('jspsn_unionid');
		};
		//XmppServer.servlet  http://jhtestcms.jslife.net/jspsn/parkApp/queryParkAttention.servlet
        $.ajax({
        	url:XMPPSERVER,
           // url : 'http://jhtestcms.jslife.net/jspsn/XmppServer.servlet ',
            cache : false,
            data: {
            	//云服务 serviced
                serviceId:obj.serviceId,
                dataItems:JSON.stringify(obj.dataItems)
               
                
            },
            async:false,
            dataType : 'json',
            type:'post',
           
            success : function(data) {
                carPlaceList = data;
              
        },
    });
        return carPlaceList;
    },
}



export let dataAttention = {
    //加载关注车场接口查询
    loadCarPlaceAttention: function(id){
        var carPlaceList = "";
        window.loadMoreStop = false;
        var obj = {	
        		serviceId:"ac.park.sy_userattention",
        		dataItems:[]
        		
        }
        var tmp = {
        	attributes:{
                userid:"oUjGnjqNG9O7fkjQu5bC1jjQ0DxU",
				parkid:id
        		}
        }
        obj.dataItems.push(tmp);
        window.jspsnQueryOpen = function(){
		return 		sessionStorage.getItem('jspsn_unionid');
		};
		//XmppServer.servlet  http://jhtestcms.jslife.net/jspsn/parkApp/queryParkAttention.servlet
        $.ajax({
            url:XMPPSERVER,
         //   url : 'http://jhtestcms.jslife.net/jspsn/XmppServer.servlet ',
            cache : false,
            data: {
            	//云服务 serviced
                serviceId:obj.serviceId,
                dataItems:JSON.stringify(obj.dataItems)
               
                
            },
            async:false,
            dataType : 'json',
            type:'post',
           
            success : function(data) {
                carPlaceList = data;
              
        },
    });
        return carPlaceList;
    },
}







