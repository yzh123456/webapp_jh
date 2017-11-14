/**
 * Created by li on 2017/4/17.
 */
import {Component} from "react";
import JHTAJAX from "../../common/util/JHTAjax";
import JHT from "../../common/util/JHT";
import {GETATTENTION} from "../../common/util/Enum";
import ThirdSDK from "../../common/util/ThirdSDK";
import { Loading,operateMask } from "../../common/components/Loading";
let jht;
let that;
let parkId = "";
let successTime = "";
let successTimeForMin = "00";
let successTimeForHou = "00";
let timeout;
let name="";
let clientId = "";
let receiveId = "";
class Success extends Component{
    // react 生命周期中的销毁期
    componentWillUnmount(){
        if(sessionStorage.getItem("orderData")){
            sessionStorage.removeItem("orderData");
        }
    }
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        jht = new JHT();
        this.wx = new ThirdSDK(['onMenuShareAppMessage','onMenuShareWeibo','onMenuShareQQ','onMenuShareTimeline','onMenuShareQZone','showMenuItems','hideAllNonBaseMenuItem'],false);
        clientId = window.USERINFO.USER.clientId ;
        document.title = "缴费成功"; // 动态设置title值
    }
    // 优惠券分享
    // shareCoupon(){
    //     let dataItemsattr = {
    //         attributes:{
    //             userId:window.USERINFO.USER.USER_ID,
    //             receiveId:receiveId
    //         }
    //     };
    //     let dataItems = [];
    //     dataItems.push(dataItemsattr);
    //     JHTAJAX({
    //         data: {
    //             serviceId:"ac.coupon.sy_buliddrawshare",
    //             dataItems:dataItems
    //         },
    //         timeOut:10000,
    //         type:'post',
    //         dataType:'json',
    //         success:function(data){
    //             if(data.resultcode == "0" && data.dataitems.length > 0 && data.dataitems[0].attributes.shareurl){
    //                 let link = data.dataitems[0].attributes.shareurl;
    //                 this.wx.setMenu(['menuItem:share:appMessage','menuItem:share:qq','menuItem:share:timeline','menuItem:share:QZone','menuItem:share:weiboApp'],"show");
    //                 this.wx.wxCall({
    //                     serviceId:['onMenuShareAppMessage','onMenuShareQQ','onMenuShareTimeline','onMenuShareQZone','onMenuShareWeibo'],
    //                     title: "停车优惠券",
    //                     desc: "手快有，手慢无哦~",
    //                     link: link,
    //                     imgUrl: `${window.location.href.split('/src/')[0]}/src/common/image/logo_app.png`,
    //                     success:function (data) {
    //                         this.hideShareMask();
    //                         this.wx.setMenu(['hideAllNonBaseMenuItem'],"hideAll");
    //                         //document.body.querySelector(".couponMask").style.visibility ="visible";
    //                         this.myToast.setToast("分享成功");
    //                     }.bind(this),
    //                     cancel:function (data) {
    //                         this.hideShareMask();
    //                         //document.body.querySelector(".couponMask").style.visibility ="visible";
    //                         this.myToast.setToast("取消分享");
    //                     }.bind(this)
    //                 });
    //             }else {
    //                 this.hideShareMask();
    //             }
    //         }.bind(this),
    //         complete:function(data){
    //         },
    //         error:function(error){
    //             console.log(error);
    //         }
    //     });
    // }
    // 进入室内导航
    payOrder(){
            window.location.href = jht.basePath().jspsnURL + "/other/parkNavigation/index.htm?clientId="+clientId+"&parkingId="+parkId+"&name="+name;
    }
    componentDidMount(){
        that = this;
        mapDetail();
        if(sessionStorage.getItem("tel")!=""&&sessionStorage.getItem("tel")!=null&&sessionStorage.getItem("tel")!=undefined&&sessionStorage.getItem("tel")!="null"&&sessionStorage.getItem("tel")!="undefined"){
            sessionStorage.removeItem("tel");
          getCoupon();
        }
        getAttention();
        this.timefresh();
    }
    // 页面渲染前的操作
    componentWillUnmount(){
        clearInterval(timeout);
    }
    /*
    * 倒计时方法
    * */
    timefresh(){
        clearInterval(timeout);
        if(document.getElementById("mm")){
            timeout = setInterval(()=>{
                let m = parseInt(document.getElementById("mm").innerText)*60;
                let s = parseInt(document.getElementById("ss").innerText);
                let h = parseInt(document.getElementById("hh").innerText)*3600;
                let url = window.location.href;
                let str = url.substring(url.lastIndexOf('/')+1, url.length);
                let leftTime = h+m+s;
                if(leftTime <= 1){
                    clearInterval(timeout);
                    document.getElementById("span").innerText = "您的超时滞留时间已过，请退出重新缴费！";
                    document.getElementById("quickexit").innerText = "";
                }else{
                    leftTime--;
                    document.getElementById("mm").innerText = parseInt(leftTime / 60);
                    document.getElementById("hh").innerText = parseInt(leftTime / 3600);
                    leftTime %= 60;
                    document.getElementById("ss").innerText = leftTime;
                }
            },1000);
        }
    }
    render(){

        let div1style = {"backgroundColor":"#9adb43","zIndex":"111","width":window.innerWidth+"px","height":window.innerHeight+"px","position":"absolute"};
        let successMessage = {"color":"#ff6e0e"};
        let passageway = "";
        let passagewayLeftHtml="";
        let passagewayRightHtml="";

        // 从订单页面获取到的缓存
        if(sessionStorage.getItem("orderData")){
            let data = JSON.parse(sessionStorage.getItem("orderData"));
            if(data&&data.dataItems[0]&&data.dataItems[0].attributes){
                if(data.dataItems[0].attributes.quickExit&&data.dataItems[0].attributes.quickExit!=""){
                    passageway = data.dataItems[0].attributes.quickExit;
                    if(passageway.indexOf("绿色通道")){
                        passagewayLeftHtml=<span style={{"paddingTop":"0.20rem"}}>{ passageway.split("绿色通道")[0] }</span>
                        passagewayRightHtml=<span className="sp2_style">绿色通道</span>
                    }else{
                        passagewayLeftHtml=<span style={{"paddingTop":"0.20rem"}}>{ passageway}</span>
                        passagewayRightHtml=<span></span>
                    }
                }
                if(data.dataItems[0].attributes.parkId&&data.dataItems[0].attributes.parkId!=""){
                    parkId = data.dataItems[0].attributes.parkId;
                }
                if(data.dataItems[0].attributes.free_minute&&data.dataItems[0].attributes.free_minute!=""){
                    successTimeForMin = data.dataItems[0].attributes.free_minute;
                    if(data.dataItems[0].attributes.free_minute>60){
                        successTime = data.dataItems[0].attributes.free_minute;
                        successTimeForHou = parseInt(data.dataItems[0].attributes.free_minute/60);
                        successTimeForMin = parseInt(data.dataItems[0].attributes.free_minute%60);
                    }
                }
            }
        }
        return(
            <div>
                <div id = "success">
                    <div style={div1style}>
                        <p className="bookp1_style"></p>
                        <p className="bookp2_style"></p>
                        <p className="bookp3_style"></p>
                        <div className="div2_style">
                            <p className="book_style">您已缴费</p>
                            <div className="bookp5_style">
                                {successTime!=""?(<span id="span">您的<span style={successMessage}>免费离场</span>时间剩余
                                <span className="sp1_style"> <span className = "excessTime" id="hh">{successTimeForHou} </span>小时<span className = "excessTime" id="mm">{successTimeForMin} </span>分钟<span id = "ss">00</span>秒</span></span>):(<span></span>)}
                                <span id="quickexit">{passagewayLeftHtml}{passagewayRightHtml}</span>
                                <div ref="payOrder" className="search_car hide">
                                    <img style={{"height":"0.50rem","marginRight":"0.30rem"}} src="../images/navigation.png"/>
                                    <span onClick={this.payOrder.bind(this)}>去找车吧</span>
                                </div>
                            </div>
                            <li ref="coupon" className="coupon_park hide">
                                <div className="background_up_img"></div>
                                {/*<i style={qrcode_icon}></i>*/}
                                <div ref="couponType" className="coupon_name">停车优惠券</div>
                                <div className="coupon_num" ref="couponNum">卢卡斯的减肥</div>
                                <div className="coupon_valitime">有效期至 <span ref="drawEndTime"></span></div>
                                <div className="background_down_img"></div>
                                <div className="share">
                                    <span ref="couponName"></span>
                                    {/*<span onClick={this.shareCoupon.bind(this)} style={{"fontWeight":"100","color":"rgb(255, 110, 14)","position":"absolute","right":"0.3rem"}}>立即分享</span>*/}
                                </div>
                                <span ref="discountMode" className="coupon_many">订单</span>
                            </li>
                            <div  ref="erweima" className="attention hide" style={{"textAlign":"center","backgroundColor":"#fff","padding":"0.3rem"}}>
                                <div id="qr" className="erweima">
                                    <img src="" className="attentionPhone" ref="attentionPhone"/>
                                </div>
                            </div>
                        </div>
                        <div ref="erweimaMsg" className="hide" style={{"textAlign":"center","fontSize":"0.30rem","marginTop":"0.20rem","textAlign":"center"}}>
                            <a ref="erweimaMsgUrl" href="" target=""><span style={{"textDecoration":"underline"}}>长按识别二维码！享受更多服务！</span></a>
                        </div>
                     </div>)
                </div>
            </div>
        )
    }
}
export {Success}
/*
 请求车场详情，用于判断是否支持室内导航
 */
function mapDetail(){
    let unionid = window.USERINFO.USER.USER_ID?window.USERINFO.USER.USER_ID:"1" ;
    let obj = {
        dataItems:[
        ]
    };
    /*
    * 不需要计算距离，所有经纬度是写死的
    * */
    let attr = {
        attributes:{
            userid:unionid,
            id:parkId,
            beforelongitude:"0", //当前经度
            beforelatitude:"0",   //当前纬度
        }
    };
    obj.dataItems.push(attr);
    operateMask("show");
    JHTAJAX({
        data: {
            serviceId:"ac.park.sy_getparkinfo",
            dataItems:JSON.stringify(obj.dataItems)
        },
        dataType : 'json',
        type:'post',
        success: function (data) {
            operateMask("hide");
            if (data.resultcode == "0" && data.dataitems != null && data.dataitems.length > 0) {
                localStorage.setItem("resultcode",JSON.stringify(data));
                localStorage.getItem("resultcode");
                if(data.dataitems[0].subitems&&data.dataitems[0].subitems.length>0){
                     for(let i=0;i<data.dataitems[0].subitems.length;i++){
                         if(data.dataitems[0].subitems[i].attributes&&data.dataitems[0].subitems[i].attributes.function_name){
                             if(data.dataitems[0].subitems[i].attributes.function_name=="手机找车"){
                                  that.refs.payOrder.className="search_car";
                             }
                         }
                     }
                }
                if(data.dataitems[0].attributes.name&&data.dataitems[0].attributes.name!=""){
                    name = data.dataitems[0].attributes.name;
                }
            }
        }.bind(this)
    });
}
/*
 请求领取卡券，用于渲染卡券
 */
function getCoupon(){
    let unionid = window.USERINFO.USER.USER_ID?window.USERINFO.USER.USER_ID:"1" ;
    let obj = {
        dataItems:[
        ]
    };
    let attr = {
        attributes:{
            parkid:parkId,
            tel:window.USERINFO.USER.TEL
        }
    };
    obj.dataItems.push(attr);
    operateMask("show");
    JHTAJAX({
        data: {
            serviceId:"ac.coupon.sy_executecoupondraw",
            dataItems:JSON.stringify(obj.dataItems)
        },
        dataType : 'json',
        type:'post',
        success: function (data) {
            operateMask("hide");
            let ds;
            if (data.resultcode == "0" && data.dataitems != null && data.dataitems.length > 0) {
                that.refs.coupon.className="coupon_park";
                if(data.dataitems[0].attributes.amount){
                    /*
                    * 对返回的金额和时间做处理，取小数点后两位
                    * */
                    ds = (parseFloat(data.dataitems[0].attributes.amount)).toFixed(2);
                    ds = ds < 0.01 ? 0 : ds;            // 小于0.01的直接显示0，存在.00保留0位小数，
                    if (ds != 0) {
                        ds = ds.toString();
                        if(ds.indexOf(".00")>-1){
                            ds = ds.substr(0, ds.length - 3);
                        }else if (ds.substr(ds.length - 1,ds.length)=="0"){
                            ds = ds.substr(0, ds.length - 1);
                        }else{
                            ds = ds.substr(0, ds.length);
                        }
                    }
                }
                if(data.dataitems[0].attributes.discount_mode=="0"){// 0金额，1时间，2全免
                    that.refs.discountMode.innerHTML="￥"+ ds;
                }else if(data.dataitems[0].attributes.discount_mode=="1"){
                    that.refs.discountMode.innerHTML=GetTimeShow(ds);
                }else if(data.dataitems[0].attributes.discount_mode=="2"){
                    that.refs.discountMode.innerHTML="全免";
                }
                if(data.dataitems[0].attributes.draw_end_time){ //有效期
                    that.refs.drawEndTime.innerHTML=(data.dataitems[0].attributes.draw_end_time).substring(0,10).replace(/-/g,"-");
                }
                if(data.dataitems[0].attributes.coupon_name){ //卡券名
                    that.refs.couponName.innerHTML=data.dataitems[0].attributes.coupon_name;
                }
                if(data.dataitems[0].attributes.coupon_num){ //卡券编号
                    that.refs.couponNum.innerHTML=data.dataitems[0].attributes.coupon_num;
                }
                if(data.dataitems[0].attributes.receiveid){
                    receiveId = data.dataitems[0].attributes.receiveid;
                }
            }
        }.bind(this)
    });
}
/*
 关注公众号
 对二维码和a标签链接进行处理
 将返回的url放进a标签和根据url去请求二维码图片
 */
function getAttention(){
    let obj ={};
    obj.parkid=parkId;
    $.ajax({
        url:GETATTENTION,
        type:"GET",
        dataType:"json",
        data:obj,
        success:function (data) {
            if(data){
                if(data.attention_remark&&data.attention_remark!=""&&data.attention_remark!=null){
                    that.refs.erweimaMsgUrl.className="";
                    if(data.attention_url&&data.attention_url!=""&&data.attention_url!=null){
                        that.refs.erweimaMsgUrl.attributes.href=data.attention_url;
                    }
                }
                if(data.attention_phone&&data.attention_phone!=""&&data.attention_phone!=null){
                    that.refs.erweima.className="attention";
                    // that.refs.attentionPhone.attributes.src="http://merchant.jslife.com.cn:7105/merchant/image.servlet?filePath="+data.attention_phone;
                    that.refs.attentionPhone.attributes.src=location.href.split("jsaims")[0]+"jsaims/imget?filePath="+data.attention_phone;
                }

            }
        }.bind(this),
    })
}

//时间解析 传入小时数
function GetTimeShow(hs){

    if(0 == hs){
        return "0";
    }
    //获取天数
    var day = parseInt(hs/24);
    //获取小时数
    var hour = parseInt(hs%24);

    if(day == 0 ){
        return hour+"小时";
    }else if(day != 0 && hour != 0){
        return day + "天" +hour+"小时";
    }else if(day != 0 && hour == 0){
        return day + "天";
    }

}