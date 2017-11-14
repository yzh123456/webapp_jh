/**
 * Created by yqx on 2017/3/3.
 */
/******微信JS-SDK,调用***********/
import JHTAJAX from "./JHTAjax";
import JHT from "./JHT";
import {BASEPATH} from "./Enum";
import MyToast from "../components/MyToast";
let wx = require('weixin-js-sdk');

export default class ThirdSDK extends JHT{
    constructor(wxJsList = [],debug = false){
        super();
        this.myToast = new MyToast();
        if (this.working() === "WX"){
            this.sdkInit(wxJsList,debug);
        }else if(this.working() === "ZFB"){

        }
    }
    sdkInit(wxJsList = [],debug = false){
        JHTAJAX({
            url:`${BASEPATH.jspsnURL}/signature.servlet`,
            data: {
                url:location.href.split("#")[0],
                appType:window.USERINFO?USERINFO.APP.APP_TYPE : (this.urlParams().APP_TYPE?this.urlParams().APP_TYPE:"WX_JTC")
            },
            timeOut:10000,
            type:'post',
            dataType:'json',
            async:"false",
            success:function(temp){
                if (temp != null) {
                    let sAppId = temp.appId;
                    let iTimestamp =  temp.timestamp;
                    let sNonceStr = temp.noncestr;
                    let sSignature = temp.signature;
                    wx.config({
                        debug: debug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: sAppId, // 必填，公众号的唯一标识
                        timestamp: iTimestamp, // 必填，生成签名的时间戳
                        nonceStr: sNonceStr, // 必填，生成签名的随机串
                        signature: sSignature, // 必填，签名，见附录1
                        jsApiList: wxJsList
                    });
                    wx.error(function(msg){
                        this.myToast.setToast(msg.errMsg);
                    }.bind(this));
                }else{
                    this.setToast.setToast('微信鉴权失败!');
                }
            }.bind(this),
            complete:function(data){
            },
            error:function(error){
                console.log(error);
            }
        });
    }
    setMenu(items = [],op = "hide"){
        wx.ready(function(){
            if(op == "show"){
                wx.showMenuItems({
                    menuList:items // 要显示的菜单项，所有menu项见附录3
                });
            }else if(op == "showAll"){
                wx.showAllNonBaseMenuItem();
            }else if(op == "hide"){
                wx.hideMenuItems({
                    menuList: [] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            }else if(op == "hideAll"){
                wx.hideAllNonBaseMenuItem();
            }else if(op == "close"){
                wx.closeWindow();
            }
        });
        if(op == "close"){
            wx.closeWindow();
        }
    }
    wxCall( op={}){
        if(!op.serviceId){
            this.myToast.setToast("serverId为空，微信JS-SDK调用失败");
            return false;
        }else if(typeof op.serviceId !== "object"){
            this.myToast.setToast("不合法的serverId，微信JS-SDK调用失败");
            return false;
        }
        if (this.working() === "WX"){
            wx.ready(function(){
                for (let i in op.serviceId){
                    switch (op.serviceId[i]){
                        case "onMenuShareQQ":
                            shareQQ(op);
                            break;
                        case "onMenuShareWeibo":
                            shareWeibo(op);
                            break;
                        case "onMenuShareAppMessage":
                            shareWX(op);
                            break;
                        case "onMenuShareTimeline":
                            shareTimeline(op);
                            break;
                        case "onMenuShareQZone":
                            shareQZone(op);
                            break;
                        case "scanQRCode":
                            scanQRCode(op);
                            break;
                        case "getLocation":
                            getLocation(op);
                            break;
                        default:
                            return false;
                    }
                }

            }.bind(this));
            wx.error(function(msg){
                if (op.error && typeof op.error === "function")
                    op.error(msg);
            });
        }else if(jht.working() === "ZFB"){

        }else if(jht.working() === "APP"){

        }

    }
}
function shareQQ(obj){
    let success = obj.success;
    let cancel = obj.cancel;
    wx.onMenuShareQQ({
        title: obj.title, // 分享标题
        desc: obj.desc, // 分享描述
        link: obj.link, // 分享链接
        imgUrl: obj.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            if (success && typeof success === "function")
                success();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (cancel && typeof cancel === "function")
                cancel();
        }
    });
}
function shareWX(obj){
    let success = obj.success;
    let cancel = obj.cancel;
    let fail = obj.fail;
    let trigger = obj.trigger;
    wx.onMenuShareAppMessage({
        title: obj.title,
        desc:  obj.desc,
        link: obj.link,
        imgUrl: obj.imgUrl,
        trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            // jsLifeKFS.poptip('用户点击发送给朋友');
            if (trigger && typeof trigger === "function")
                trigger(res);
        },
        success: function (res) {
            if (success && typeof success === "function")
                success(res);
            //jsLifeKFS.poptip("已分享给好友");
        },
        cancel: function (res) {
            if (cancel && typeof cancel === "function")
                cancel(res);
        },
        fail: function (res) {
            console.log(JSON.stringify(res));
            if (fail && typeof fail === "function")
                fail(res);
        }
    });
}
function shareWeibo(obj){
    let success = obj.success;
    let cancel = obj.cancel;
    wx.onMenuShareWeibo({
        title: obj.title, // 分享标题
        desc: obj.desc, // 分享描述
        link: obj.link, // 分享链接
        imgUrl: obj.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            if (success && typeof success === "function")
                success();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (cancel && typeof cancel === "function")
                cancel();
        }
    });
}
function shareTimeline(obj){
    let success = obj.success;
    let cancel = obj.cancel;
    wx.onMenuShareTimeline({
        title: obj.title, // 分享标题
        link: obj.link, // 分享链接
        imgUrl:  obj.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            if (success && typeof success === "function")
                success();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (cancel && typeof cancel === "function")
                cancel();
        }
    });
}
function shareQZone(obj){
    let success = obj.success;
    let cancel = obj.cancel;
    wx.onMenuShareQZone({
        title: obj.title, // 分享标题
        desc: obj.desc, // 分享描述
        link: obj.link, // 分享链接
        imgUrl: obj.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            if (success && typeof success === "function")
                success();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (cancel && typeof cancel === "function")
                cancel();
        }
    });
}
function scanQRCode(op){
    let needResult = op.needResult || 1;
    let scanType = op.needResult || ["qrCode","barCode"];
    let success = op.success;
    wx.scanQRCode({
        needResult: needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: scanType, // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            result(res);
            /*var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            if (success && typeof success === "function")
                success(res);*/
        }
    });
    function result(res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        if (success && typeof success === "function")
            success(res);
        else
        return result;
    }
}
function getLocation(op) {
    let type = op.type || 'wgs84';
    let success = op.success;
    wx.getLocation({
        type: type || 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            result(res);
        }
    });
    function result(res) {
        if (success && typeof success === "function")
            success(res);
        else
            return res;
    }
}