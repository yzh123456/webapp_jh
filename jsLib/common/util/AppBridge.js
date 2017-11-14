/**
 * Created by yqx on 2016/12/7.
 */
import ThirdSDK from "../../common/util/ThirdSDK";
import JHT from "./JHT";
let thirdSDK = new JHT();

export let AppBridge = {
    baseData ( fn , position = false ) {
        let userData = "";
        if( fn && typeof fn === "function" )
            window.JSFN = fn;
        if ( (thirdSDK.urlParams().APP_TYPE && thirdSDK.urlParams().APP_TYPE != "") ||    //重定向数据
            thirdSDK.exclude() ||             //无需绑定手机
            (window.USERINFO && window.USERINFO.USER) ){  //纯缓存
            //基础用户数据
            if(thirdSDK.exclude() || (thirdSDK.urlParams().APP_TYPE && thirdSDK.urlParams().APP_TYPE != "")){
                userData ={
                    "APP" : {
                        "APP_NAME" : "JSCARLIFE",
                        "APP_VERSION" : thirdSDK.urlParams().ver || "V2.0",
                        "APP_TYPE" : thirdSDK.urlParams().APP_TYPE || ""
                    },
                    "USER" : {
                        "USER_ID" : thirdSDK.urlParams().USER_ID || "",
                        "clientId":thirdSDK.urlParams().clientId || "",
                        "TEL":thirdSDK.urlParams().TEL || "",
                        "longitude" : position ? (thirdSDK.urlParams().longitude || 116) : 116,
                        "latitude" : position ?(thirdSDK.urlParams().latitude || 39)  : 39
                    }
                };
            }else if (window.USERINFO && window.USERINFO.USER){
                userData = window.USERINFO;
            }

            if(position && userData.USER.longitude == "116" && userData.USER.latitude == "39"){  //获取包含用户位置的用户信息
                if (thirdSDK.working() === "WX"){
                    let getLocation = new ThirdSDK(['getLocation'],false);
                    getLocation.wxCall({
                        serviceId:['getLocation'],
                        type:'gcj02',
                        success : function(res) {
                            console.log(res.longitude, res.latitude);
                            userData.USER.longitude = res.longitude || 0;
                            userData.USER.latitude = res.latitude || 0;
                            window.forApp("fromIOSBaseDataBack", userData);
                        },
                        error:function(e){
                            userData.USER.longitude = 0;
                            userData.USER.latitude = 0;
                            window.forApp("fromIOSBaseDataBack", userData);
                        }
                    });
                }else if(thirdSDK.working() === "ZFB"){
                    window.forApp("fromIOSBaseDataBack", userData);
                }else if(thirdSDK.working() === "APP"){
                    if ( window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.fromIOSBaseData ) {    //ios客户端调用
                        window.webkit.messageHandlers.fromIOSBaseData.postMessage(  null  );
                    } else if ( typeof(JTC) !== "undefined"  && typeof(JTC.fromAppBaseData) === 'function') {                 //android客户端调用
                        try{
                            userData = JSON.parse(JTC.fromAppBaseData());
                            window.forApp("fromIOSBaseDataBack", userData);
                        }catch(e){
                            alert(e);
                        }
                    }
                }else {
                    window.forApp("fromIOSBaseDataBack", userData);
                }
            }else {
                window.forApp("fromIOSBaseDataBack", userData);
            }

        }
    },
    forJS( parmes = null , fn ){
        let callback = '';
        if( fn && typeof fn === "function" )
            window.JSFN = fn;
        if ( window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.forJS ) {    //ios客户端调用
            window.webkit.messageHandlers.forJS.postMessage(  JSON.stringify(parmes)  );
        } else if (typeof(JTC) !== "undefined" && typeof(JTC.forJS) === 'function' ) {  //android客户端调用
            callback = JTC.forJS( JSON.stringify(parmes) );
            if(  fn && typeof fn === 'function' ){
                window.forApp("fromJSBack", callback);
                return;
            }
        }else{
            //不是在app中打开(wx/zfb)
            //alert(JSON.stringify(parmes));
            if(  fn && typeof fn === 'function' ){
                window.forApp("fromJSBack", callback);
                return false;
            }
            return false;
        }
    },
    fromAppXmpp( parmes = null , fn = "" ){   //通过APP调用XMPP
        let xmppdata =  "";
        if( fn && typeof fn === "function" )
            window.JSFN = fn;
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.fromIOSXmppData) {
            window.webkit.messageHandlers.fromIOSXmppData.postMessage(  JSON.stringify(parmes)  );
        } else if (typeof(JTC) !== "undefined" && typeof(JTC.fromAppXmppData) === 'function') {                //android方式
            xmppdata = JTC.fromAppXmppData( parmes, fn ) || "";
            if( xmppdata !== "" && fn && typeof fn === 'function' ){
                window.forApp("fromIOSXmppDataBack", xmppdata ,fn);
                return;
            }
        }
    },
    closeView(){
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.closeView) {
            window.webkit.messageHandlers.closeView.postMessage(null);
        } else if (typeof(JTC) !== "undefined" && typeof(JTC.closeView) === 'function') {                //android方式
             JTC.closeView();
        }else if(thirdSDK.working() == 'WX'){
            //WeixinJSBridge.call('closeWindow');
            // if(WeixinJSBridge){
            //     WeixinJSBridge.call('closeWindow');
            // }else {
           // alert(100);
                let thirdSDK = new ThirdSDK(['closeWindow'],false);
                thirdSDK.setMenu(null,"close");
            //}
        }else if(thirdSDK.working() == 'ZFB'){
            AlipayJSBridge.call('closeWebview');
        }else if(ua.indexOf("baidu")!=-1){
            BLightApp.closeWindow();
        }else{
            window.close();
        }
    }
};
/**
 * Created by yqx on 2016/12/13.
 *IOS回调、安卓调用
 */
window.forApp = ( command , parmes  )=>{
    let callbackdata = "H5 return data";   //返回app的数据
    //无返回函数回调
    if( command === "fromIOSBaseDataBack" ||  command === "fromIOSXmppDataBack" ){  //获取包含用户位置的用户信息
        try {
            parmes =  (typeof parmes !== "object" && typeof JSON.parse(parmes) === "object" ) ? JSON.parse(parmes):parmes;
        }catch (e){
        }
        window.USERINFO = parmes;
        window.USERINFO.jspsn_timestamp = Date.parse(new Date());
        localStorage.removeItem("USERINFO");
        localStorage.setItem("USERINFO",JSON.stringify(window.USERINFO));
        callback( parmes );
        return;
    }
    callbackdata = callback( parmes  );
    //需要返回app数据时进行返回的函数处理
    /*switch ( command ) {
        case "COUPONDETAIL0000":
            callbackdata = window.couponDetailToAPP || "";
            break;
        default:
            callbackdata = callback( parmes  );
    }*/
    return callbackdata;
};
function callback(data) {
    try {
        data =  (typeof data !== "object" && typeof JSON.parse(data) === "object" ) ? JSON.parse(data):data;
    }catch (e){
    }
    if( window.JSFN && typeof window.JSFN === "function" ){
        window.JSFN(data);
    }else{
        alert("callback error!")
    }
    return data;
}