/**
 * Created by yqx on 2017/3/7.
 */
import {AppBridge} from "./util/AppBridge";
import JHT from "./util/JHT";
let jht = new JHT();
export default class  Common {
    constructor(callback = null , position = false , timeOut = 10 ){
        this.setFontSize();
        window.AppBridge = AppBridge;
        window.SYT = jht;
        userVaid(callback , position  , timeOut);
        if(jht.working() == "WX"){
            hideMenu();
        }
    }
    getFontSize(){
        // 设计稿 750px
        let width = document.documentElement.clientWidth;
        let fontSize = (width / 750) * 100;
        document.getElementsByTagName("html")[0].style.fontSize = fontSize + "px";
    }
    setFontSize(){
        window.addEventListener("resize",this.getFontSize());
    }
}
/**
 * 有效的缓存时间内，不进行网页授权
 */
function userVaid(callback = null , position = false , timeOut = 10) {//设置会话有效时间
    let USERINFOS = localStorage.getItem("USERINFO") || ""; //获取缓存数据
    if( USERINFOS != ""){
        USERINFOS =  JSON.parse(USERINFOS);
    }
    if( (
        (jht.urlParams().clientId && jht.urlParams().USER_ID == "")    ||   //用户未绑定，USER_ID为空
        ( USERINFOS && USERINFOS.jspsn_timestamp && USERINFOS.USER &&
        USERINFOS.USER.clientId && USERINFOS.USER.USER_ID == "" &&
        new Date() - (timeOut*60*1000) < parseInt(USERINFOS.jspsn_timestamp ) )  ) &&
        !jht.exclude() && jht.working() != "APP"){  //排除app环境和免验权页面进入绑定手机号码
        //未绑定手机，先进行手机绑定
        window.location.href = `${jht.basePath().jspsnURL}/webapp/src/userInfo/bindTelphone.html${window.location.search}`;
        throw SyntaxError();
    }

    if(jht.urlParams().clientId && jht.urlParams().APP_TYPE && jht.urlParams().APP_TYPE != "" ){
        //重定向网页授权后获取信息
        AppBridge.baseData( (data)=> {
            console.log(data);
            callback && callback(data);
        } , position );
    }else if(USERINFOS && USERINFOS.jspsn_timestamp && USERINFOS.USER &&
        new Date() - (timeOut*60*1000) < parseInt(USERINFOS.jspsn_timestamp)){ //5分钟内,存在缓存
        if(!position && USERINFOS.USER.clientId && USERINFOS.USER.clientId != ''||    //无需用户位置
            (position && USERINFOS.USER.longitude && USERINFOS.USER.longitude != ''&& USERINFOS.USER.latitude != '' )) {  //用户位置已存在
            window.USERINFO = USERINFOS;
            callback && callback(window.USERINFO);
        }else if(position){
            //需要定位的，进行重新定位获取用户信息
            window.USERINFO = USERINFOS;
            AppBridge.baseData( (data)=> {
                console.log(data);
                callback && callback(data);
            } , position );
        }else {
            AppBridge.baseData( (data)=> {
                console.log("error:"+ data);
                callback && callback(data);
            } , position );
        }
        //判断是否退出界面、依据为打开的URL以及重定向获取信息的缓存机制
        if(Object.keys(jht.urlParams()).length < 2 && jht.urlParams().appType  &&
            window.sessionStorage.getItem("popstate") &&
            window.location.href.split("#")[0] == window.sessionStorage.getItem("popstate") ){
            window.sessionStorage.removeItem("popstate");
            AppBridge.closeView();
        }
    }else{
        //重定向网页授权
        let url=window.location.href.split("#")[0];
        if(jht.working() == 'WX' ){
            window.sessionStorage.removeItem("popstate");
            window.sessionStorage.setItem("popstate",url);
            window.location.href = `${jht.basePath().jspsnURL}/userValid.servlet?appType=${jht.urlParams().appType || jht.urlParams().APP_TYPE || "WX_JTC"}&url=${url.split("?")[0]}${jht.urlParams().key?("?key="+jht.urlParams().key):window.location.search.split("#")[0]}` ;
            throw SyntaxError();
        }else {
            AppBridge.baseData( (data)=> {
                console.log("other:"+ data);
                callback && callback(data);
            } , position );
        }
    }
}
function hideMenu(){
    function onBridgeReady(){
        try{
            WeixinJSBridge.call('hideOptionMenu');
        }catch (e){
            //console.error(e); //testcode 异常捕获
        }
    }
    if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    }else{
        onBridgeReady();
    }
}