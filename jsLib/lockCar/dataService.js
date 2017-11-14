import {BASEDATA} from "../common/util/AppBridge";
import {XMPPSERVICE} from "../common/util/jht";
export let dataService = {
    //加载锁车位历史记录
    loadLockCarRecord : function(data,pageIndex = 1){
        let carLockHistory = "";
        alert("user_id:" + BASEDATA.USER.USER_ID);

       window.jspsnQueryOpen = function(){
		return 		sessionStorage.getItem('jspsn_unionid');
		};
        //	unionid:"USER_ID:3f4cef3995e448d2816b5726db46280e"
		 var obj = {
        			serviceId:"ac.lock.query",
        			attributes:{
                      //  unionid :"USER_ID:"+ BASEDATA.USER.USER_ID
                        USER_ID :BASEDATA.USER.USER_ID?(BASEDATA.USER.USER_ID):"3f4cef3995e448d2816b5726db46280e"
        			}
   	    }

//http://192.168.1.201:8883/jspsn/parkApp/queryParkAttention.servlet
        $.ajax({
            url:XMPPSERVICE,
          //  url : 'http://jhtestcms.jslife.net/jspsn/XmppServer.servlet',
            cache : false,
            data: {
            	serviceId:obj.serviceId,
            	attributes:JSON.stringify(obj.attributes),
            	async:true
 
            },
            async:false,
            dataType : 'json',
            type:'post',
           
            success : function(data) {
                carLockHistory = data;

              
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
				throw XMLHttpRequest.responseText;
			
			}
    });
        return carLockHistory;
    },
}



