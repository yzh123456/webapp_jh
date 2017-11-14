/**
 * Created by yqx on 2017/2/5.
 */
/******************注册常量**********************/
const CLOUDURL = "http://www.jslife.com.cn";   //生产环境云平台发布地址
const JSPSNURL = "http://weixin.jslife.com.cn";   //生产环境H5服务发布地址

/*const CLOUDURL = "http://syx.jslife.com.cn";   //预上线云平台发布地址
 const JSPSNURL = "http://syxwx.jslife.com.cn";   //预上线H5服务发布地址*/

/*const CLOUDURL = "http://jhtestcloud.jslife.net:18080";   //钟世梁云平台发布地址
 const JSPSNURL = "http://jhtestcloud.jslife.net";   //钟世梁H5服务发布地址*/

/*const CLOUDURL = "http://testcloud-of.jslife.net";   //云平台发布地址 test code
const JSPSNURL = "http://jhtestcms.jslife.net";   //H5服务发布地址 test code*/

let BASEPATH = _basePath();
const XMPPSERVER = `${BASEPATH.jspsnURL}/XmppServer.servlet`;
const RSAENCRYPT = `${BASEPATH.jspsnURL}/RSAEncrypt.servlet`;
const WXGETPAYURL = `${BASEPATH.jspsnURL}/getPayUrl.servlet`;//微信/支付宝支付URL获取
const REDIRECTMENU = `${BASEPATH.jspsnURL}/userValid.servlet`;//绑定手机后微信打开重定向
const CARNOPAY = BASEPATH.cloudURL+"/qrcode/carNo-pay.html";  //车牌缴费页面
const TXTTOIMG = `${BASEPATH.jspsnURL}/txtToImg.servlet`;          //获取其他字体透明图片
const GETCITY = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&ak=fCRtA4ZvM8LpQh9luE8OjD5ipk0CYCih`;
const GETINVOICE = BASEPATH.jspsnURL+"/webapp/src/invoice/html/invoice.html";  //申领发票页面
const EXCLUDEPAGE =
    ["/ambitusPark/","bindTelphone",
    "couponList","map.html","successForCar.html",
    "successForCar.html","carNo-pay.html" ];  //排除页面鉴权
const DOWNLOADAPP = `${CLOUDURL}/jsstApp/jsp/version/downloadApp.html`;//生产环境APP下载引导URL
const GETATTENTION = `${BASEPATH.cloudURL}/pkextend`;// 关注公众号URL获取
export {
    XMPPSERVER,
    DOWNLOADAPP,
    RSAENCRYPT,
    EXCLUDEPAGE,
    WXGETPAYURL,
    REDIRECTMENU,
    CARNOPAY,
    TXTTOIMG,
    CLOUDURL,
    JSPSNURL,
    GETCITY,
    GETATTENTION,
    GETINVOICE,
    BASEPATH
}
/**
 * 根据程序运行服务地址获取根路径
 * @returns {{}}
 */
function _basePath(){
    let path = {};
    if(window.location.href.indexOf("/jspsn/") > -1){
        path.jspsnURL = `${window.location.origin}/jspsn`;
    }else {
        path.jspsnURL = `${JSPSNURL}/jspsn`;
    }
    if(window.location.href.indexOf("/jsaims/") > -1){
        path.cloudURL  = `${window.location.origin}/jsaims`;
    }else {
        if(window.location.href.indexOf("/jsscan/") > -1){
            path.cloudURL  = `${window.location.origin}/jsscan`;
        }else {
            path.cloudURL = `${CLOUDURL}/jsaims`;
        }
    }
    return path;
}