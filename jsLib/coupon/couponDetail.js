/**
 * Created by yqx on 2016/12/16.
 */
import {Component} from "react";
import {coupon_money} from "./couponList";
import {AppBridge} from "../common/util/AppBridge";
import JHTAJAX from "../common/util/JHTAjax";
import ThirdSDK from "../common/util/ThirdSDK";
import MyToast from "../common/components/MyToast";
import JHT from "../common/util/JHT";
import Common from "../common/Common";
import {operateMask} from "../common/components/Loading";
let couponDetail = {};
class CouponDetail extends Component{
    constructor(props){
        super(props);
        this.myToast = new MyToast();
        this.dateInit = new JHT();
        this.wx = "";
        this.dateInit.dateFmtInit();
        new Common();
        couponDetail = this.props.location.state;
        const qrcode = this.props.location.query;
        couponDetail.cptype = qrcode.couponlistCategory;
        if(window.USERINFO.APP.APP_TYPE != "APP" && couponDetail && couponDetail.attributes && couponDetail.attributes.is_share == "0" && couponDetail.cptype === "noUse" ){

            let promise = new Promise(function(resolve, reject) {
                console.log('Promise');
                this.wx = new ThirdSDK(['onMenuShareAppMessage','onMenuShareWeibo','onMenuShareQQ','onMenuShareTimeline','onMenuShareQZone','showMenuItems','hideAllNonBaseMenuItem'],false);
                resolve();
            }.bind(this));

            promise.then(function() {
                this.wx.setMenu(['hideAllNonBaseMenuItem'],"hideAll");
                console.log('Resolved.');
            }.bind(this));

        }
        operateMask('hide');
        document.title = "优惠券详情";
    }
    shareCoupon(){
        document.body.querySelector("#shareCoup").style.display="none";
        document.body.querySelector(".couponMask").style.visibility ="visible";
        let dataItemsattr = {
            attributes:{
                userId:window.USERINFO.USER.USER_ID,
                receiveId:this.props.location.state.attributes.id
            }
        };
        let dataItems = [];
        dataItems.push(dataItemsattr);
        JHTAJAX({
            data: {
                serviceId:"ac.coupon.sy_buliddrawshare",
                dataItems:dataItems
            },
            timeOut:10000,
            type:'post',
            dataType:'json',
            success:function(data){
                if(data.resultcode == "0" && data.dataitems.length > 0 && data.dataitems[0].attributes.shareurl){
                    let link = data.dataitems[0].attributes.shareurl;
                    this.wx.setMenu(['menuItem:share:appMessage','menuItem:share:qq','menuItem:share:timeline','menuItem:share:QZone','menuItem:share:weiboApp'],"show");
                    this.wx.wxCall({
                        serviceId:['onMenuShareAppMessage','onMenuShareQQ','onMenuShareTimeline','onMenuShareQZone','onMenuShareWeibo'],
                        title: "停车优惠券",
                        desc: "手快有，手慢无哦~",
                        link: link,
                        imgUrl: `${window.location.href.split('/src/')[0]}/src/common/image/logo_app.png`,
                        success:function (data) {
                            this.hideShareMask();
                            this.wx.setMenu(['hideAllNonBaseMenuItem'],"hideAll");
                            //document.body.querySelector(".couponMask").style.visibility ="visible";
                            this.myToast.setToast("分享成功");
                        }.bind(this),
                        cancel:function (data) {
                            this.hideShareMask();
                            //document.body.querySelector(".couponMask").style.visibility ="visible";
                            this.myToast.setToast("取消分享");
                        }.bind(this)
                    });
                }else {
                    this.hideShareMask();
                }
            }.bind(this),
            complete:function(data){
            },
            error:function(error){
                console.log(error);
            }
        });
    }
    /************调用微信扫一扫测试代码************/
    wxTest(){
       // this.wx.setMenu([],"hide");
        /*this.wx.scanQRCode({
            needResult : 1,
            scanType : ["qrCode","barCode"],
            success : function (res) {
                this.myToast.setToast(res.resultStr);
            }.bind(this)
        });*/
    }
    componentDidMount(){
        document.body.scrollIntoView();
        //if(window.USERINFO.APP.APP_TYPE == "JTC" || window.USERINFO.APP.APP_TYPE == "JSH" || window.USERINFO.APP.APP_TYPE == "JSTH" ){
        if(this.dateInit.working() == "APP" ){
            AppBridge.forJS({
                serviceId: "SETAPPTITLE" ,
                params:{  titleContent:"优惠券详情" }
            },function () {
                if(couponDetail && couponDetail.attributes && couponDetail.attributes.is_share == "0" && couponDetail.cptype === "noUse" ){
                    AppBridge.forJS({
                        serviceId: "COUPONDETAIL" ,
                        params:{  coupon:JSON.stringify( couponDetail.attributes || "") }
                    },function (data) {
                        //alert(1234);
                    });
                }
            }.bind(this));
        }
    }
    hideShareMask(){
        document.body.querySelector(".couponMask").style.visibility = "hidden";
    }
    render(){
        couponDetail = this.props.location.state;
        const qrcode = this.props.location.query;
        couponDetail.cptype = qrcode.couponlistCategory;
        let shareCoup = this.dateInit.working() != "APP"?(<div className="couponMask" onClick={this.hideShareMask}>
                    <span className="shareCoup" ></span>
                </div>):"";
        return <section id="couponDetail">
            {
                (this.dateInit.working() != "APP" && couponDetail && couponDetail.attributes && couponDetail.attributes.is_share == "0" && couponDetail.cptype === "noUse" )?shareCoup:""
            }
            <div id="couponDetail" className="couponMsg">
                {
                    (this.dateInit.working() != "APP" && couponDetail && couponDetail.attributes && couponDetail.attributes.is_share == "0" && couponDetail.cptype === "noUse" )?<span id="shareCoup" className="shareCoup" onClick={this.shareCoupon.bind( this )} ></span>:""
                }
                <div className="couponNameDetail ">{ couponDetail.attributes.couponname || "" }</div>
                <div className="couponManyDetail" onClick={this.wxTest.bind(this)} >减免{ coupon_money(couponDetail) || "" }</div>
                <div className="couponNumDetail">{ couponDetail.attributes.coupon_num || "" }</div>
                <div className="couponValitimeDetail">有效期{ (couponDetail.attributes.start_time).substring(0,10) }至{ (couponDetail.attributes.stop_time).substring(0,10) }</div>
            </div>
            <div className="useMsg">
                <p>使用说明：</p>
                <div className="couponUseDetail f28">{ couponDetail.attributes.description || "" }</div>
                <p>使用场所：</p>
                {
                    couponDetail.subitems.map((item ,i)=>{
                        return <div className="couponUsePlace f28" key={ `${ item.attributes.park_code }@${ item.attributes.businesser_code }@${ i }` }>{ item.attributes.park_name || "" }</div>
                    })
                }
            </div>
            {
                qrcode.couponlistCategory == "noUse"?<Qrcode codeContentData = { couponDetail } />:""
            }
            </section>
    }
}
class Qrcode extends Component{
    render(){
        return <setion className="qrcode" >
                <div id="qrcode_Detail" ref="qrcodeDetail" className="qrcode"  >
                </div>
                <div className="refreshTime f28">刷新倒计时
                    <RefreshTime codeContentData = { this.props.codeContentData } />
                </div>
            </setion>

    }
}
class RefreshTime extends Component{
    constructor(props,timeout){
        super(props);
        this.state = {
            refreshTime: 60
        };
        this.timeout = timeout;
    }
    componentDidMount(){
        let codeContentData = this.props.codeContentData;
        makeCode ("qrcode_Detail",codeContentData);
        this.refreshTime();
    }
    componentWillUnmount(){
        clearInterval(this.timeout);
    }
    refreshTime(){
        this.timeout = setInterval(()=>{
            const that = this;
            if(that.state.refreshTime === 0){
                clearInterval(this.timeout);
                this.refreshTime();
                let el = document.querySelector("#qrcode_Detail");
                el.innerHTML = "";
                makeCode ("qrcode_Detail", this.props.codeContentData);
                that.setState({
                    refreshTime : 60
                });
                return;
            }
            //一秒后对 refreshTime 重新赋值，使用 setState 去修改数据的状态
            that.setState({
                refreshTime : that.state.refreshTime -1
            });
        },1000);
    }
    render(){
        return <setion >
                <span>
                        {
                            this.state.refreshTime
                        }
                    </span> 秒
        </setion>

    }
}
//生成二维码
function makeCode (el,codeContentData) {
    var codeContent;
    var bcResult = [];
    codeContentData.subitems.forEach((item,i)=>{
        var obj = `{\"bc\":\"${ item.attributes.businesser_code }\",\"pc\":\"${ item.attributes.park_code }\"}`;
        bcResult.push(JSON.parse(obj));
    });
    codeContent = [{
        "bpc":bcResult,
        "key":"jsc",
        "cno": codeContentData.attributes.coupon_num,
        "cname": codeContentData.attributes.couponname,
        "mode": codeContentData.attributes.mode,
        "mnt": codeContentData.attributes.coupon_money,
        "bt": codeContentData.attributes.start_time,
        "et": codeContentData.attributes.stop_time,
        "ct": new Date().Format("yyyy-MM-dd hh:mm:ss")
    }];
    let WH = 3.6*parseInt(document.getElementsByTagName("html")[0].style.fontSize);
    let len = JSON.stringify(codeContent).length;
    let CorrectLevel = len <= 192 ? QRCode.CorrectLevel.H : QRCode.CorrectLevel.M;

    if (len >= 512 ){
        CorrectLevel = QRCode.CorrectLevel.L;
    }else if (JSON.stringify(codeContent).length > 1024){  //二维码内容长度过长，可能出错
        CorrectLevel = QRCode.CorrectLevel.L;
        alert("二维码内容长度过长，可能出错");
    }
    let qrcode = new QRCode( el , {
        width: WH,
        height: WH,
        colorDark: '#292929',
        colorLight: '#ffffff',
        correctLevel:CorrectLevel
    });
    try {
        qrcode.makeCode(JSON.stringify(codeContent));
    }catch (e){
        alert(e.message || "内容长度过长") ;
    }

}
export { CouponDetail,makeCode };