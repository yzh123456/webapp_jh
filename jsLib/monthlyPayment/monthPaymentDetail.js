import { Component} from "react";
import { AppBridge } from "../common/util/AppBridge";
import JHTAJAX from "../common/util/JHTAjax";
import  JHT  from "../common/util/JHT";
import init from "../common/Common"
new init();
let orderNo = "";
class MonthPaymentDetail extends Component{
    constructor(...args){
        super(...args);//调用父级的构造器
        this.state = {
            stat:true
        };
        window.title = "订单明细";
        this.jht = new JHT();
    }
    componentDidMount(){
        AppBridge.forJS({
            serviceId: "SETAPPTITLE" ,
            params:{  titleContent:"订单明细" }
        },function (data) {
            // alert(1234);
        });
        let query = this.props.location.query;
        let el = this.refs;
        let that = this;
        let obj = {
            dataItems:[
            ]
        };
        let attr = {
            attributes:{
                orderNo:query.text
            }
        };
        obj.dataItems.push(attr);
        JHTAJAX({
            data: {
                serviceId:"JSCSP_ORDER_DETAILINFO",
                dataItems:obj.dataItems
            },
            dataType: 'json',
            type:'post',
            success:function(data){
                console.info(data);
                if (data.dataitems != null && data.dataitems.length > 0) {
                    //金额显示只保留一位小数，如果为0则显示0  （返回的金额单位为分）
                    let ds;
                    if(data.dataitems[0].attributes.totalfee){
                        ds = (parseFloat(data.dataitems[0].attributes.totalfee)).toFixed(2);
                        ds = ds < 0.01 ? 0 : ds;            // 小于0.1的直接显示0，大于等于0.1保留一位小数
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
                        el.actualFee.innerText = ds+"元";
                    }else{
                        el.actualFee.innerText = "0元";
                    }

                    if(data.dataitems[0].attributes.parkname){
                        el.businessPark.children[1].innerText = data.dataitems[0].attributes.parkname;
                    }
                    if(data.dataitems[0].attributes.businessername){
                        el.businessName.children[1].innerText = data.dataitems[0].attributes.businessername;
                    }
                    if(data.dataitems[0].attributes.carno){
                        el.carNo.children[1].innerText = data.dataitems[0].attributes.carno;
                    }
                    if(data.dataitems[0].attributes.createtime){
                        el.tradeTime.children[1].innerText = data.dataitems[0].attributes.createtime;
                    }
                    if(query.text){
                        el.orderNo.children[1].innerText = query.text;
                        orderNo = query.text;
                    }
                    if (data.dataitems[0].attributes.tradestatus == 0) {
                        el.tradeStatus.children[1].innerText= '交易成功';
                        el.tradeStatus.id = "0";  // 用来存在dom中,以便在生成二维码时候用
                        el.refund.className="refund";
                        that.setState({stat: true});
                    } else if (data.dataitems[0].attributes.tradestatus == -1) {
                        el.tradeStatus.children[1].innerText= '未支付';
                        el.tradeStatus.id = "-1";
                        el.refund.className="hide";
                    } else if (data.dataitems[0].attributes.tradestatus == 1) {
                        el.tradeStatus.children[1].innerText= '支付失败';
                        el.tradeStatus.id = "1";
                        el.refund.className="hide";
                    } else if (data.dataitems[0].attributes.tradestatus == 100) {
                        el.tradeStatus.children[1].innerText= '支付成功';
                        el.tradeStatus.id = "100";
                        el.refund.className="refund";
                        that.setState({stat: true});
                    } else if (data.dataitems[0].attributes.tradestatus == 300) {
                        el.tradeStatus.children[1].innerText= '已退款';
                        el.tradeStatus.id = "300";
                        el.refund.className="hide";
                    } else if (data.dataitems[0].attributes.tradestatus == 400) {
                        el.tradeStatus.children[1].innerText= '通知失败';
                        el.tradeStatus.id = "400";
                        el.refund.className="hide";
                    } else if (data.dataitems[0].attributes.tradestatus == 500) {
                        el.tradeStatus.children[1].innerText= '关闭';
                        el.tradeStatus.id = "500";
                        el.refund.className="hide";
                    } else if (data.dataitems[0].attributes.tradestatus == 600) {
                        el.tradeStatus.children[1].innerText= '无效订单订单';
                        el.tradeStatus.id = "600";
                        el.refund.className="hide";
                    } else if(data.dataitems[0].attributes.tradestatus == 301 ){
                        el.tradeStatus.children[1].innerText= '退款中';
                        el.tradeStatus.id = "301";
                        el.refund.className="unrefund";
                        that.setState({stat: false});
                    }else if(data.dataitems[0].attributes.tradestatus == 302){
                        el.tradeStatus.children[1].innerText= '拒绝退款';
                        el.tradeStatus.id = "302";
                        el.refund.className="unrefund";
                        that.setState({stat: false});
                    }
                    if (data.dataitems[0].attributes.banktype == 'WX') {
                        el.bankType.children[1].innerText = "微信";
                    } else if (data.dataitems[0].attributes.banktype == 'ZFB') {
                        el.bankType.children[1].innerText = "支付宝";
                    } else if(data.dataitems[0].attributes.banktype == 'CFT'){
                        el.bankType.children[1].innerText = "财付通";
                    } else if(data.dataitems[0].attributes.banktype == 'YL'){
                        el.bankType.children[1].innerText = "银联";
                    } else if(data.dataitems[0].attributes.banktype == 'JST'){
                        el.bankType.children[1].innerText = "捷顺通";
                    }else if(data.dataitems[0].attributes.banktype == 'YHJM'){//积分对接相关
                        el.bankType.children[1].innerText = "优惠减免";
                        el.discountTypeLi.className="show";
                        el.discountAmountLi.className="show";
                    }else{
                        el.bankType.className = "hide";
                    }
                    //商户允许退款且是七天内订单
                    if(data.dataitems[0].attributes.is_refund == "1" && Number(Number(get_unix_time(data.dataitems[0].attributes.createtime))+604800+"000") >= new Date().getTime()){
                        if(data.dataitems[0].attributes.ordertype == "CDP"||data.dataitems[0].attributes.ordertype == "SR"){
                            el.refund.className="refund";
                            that.setState({stat: true});
                            if (null != data.checkremark) {
                                el.payReason.children[1].innerText=data.dataitems[0].attributes.checkremark;
                                el.payReason.className="show";
                            };
                        }else{
                            el.refund.className="unrefund";
                            that.setState({stat: false});
                        }
                    }else if (data.dataitems[0].attributes.is_refund == "1" && Number(Number(get_unix_time(data.dataitems[0].attributes.createtime))+604800+"000") < new Date().getTime()) {
                        if (null != data.dataitems[0].attributes.checkremark) {
                            el.payReason.children[1].innerText=data.dataitems[0].attributes.checkremark;
                            el.payReason.className="show";
                        };
                        $("#refund").unbind("click");
                        el.refund.onClick="#";
                        el.refund.className="unrefund";
                        that.setState({stat: false});
                    }else{
                        el.payReason.children[1].innerText="";
                        el.payReason.className="hide";
                        el.orderNo.className="li_last";
                        el.refund.className="hide";
                    }
                }
            }
        })
    }
    handleRefundClick(event){
        if(this.state.stat==true){
            this.refs.confirm.className="show";
            this.refs.maskNew.className="mask_new show";
        }else{
            return false;
        }
    }
    handleCancelClick(event){
        this.refs.confirm.className="hide";
        this.refs.maskNew.className="mask_new hide";
    }
    handleSureClick(event){
        let that = this;
        AppBridge.baseData(function (data) { //请求native获取usertId
            var userId = data.USER.USER_ID;
            let  flag = true;
            let ref = that.refs;
            let state = that.state;
            that.refs.confirm.className="hide";
            that.refs.maskNew.className="mask_new hide";
            let style = {"height":"4em","line-height":"20px"};
            let query = this.props.location.query;
            let obj = {
                attributes:{
                    ORDER_NO:query.text,
                    USER_ID:userId
                }
            };
            JHTAJAX({
                data: {
                    serviceId:"ac.pay.requestrefundment",
                    attributes:JSON.stringify(obj.attributes)
                },
                dataType : 'json',
                type : 'post',
                success : function(data) {
                    if (data.resultcode == "0") {
                        ref.tradeStatus.children[1].innerText="退款中";
                        ref.confirm.children[1].className="hide";
                    }else{
                        if((data.message).length > 32){
                            ref.poptip.style=style;
                        }
                        ref.poptip.innerText=data.message;
                        ref.poptip.className="show";
                        setTimeout(function () {
                            ref.poptip.className="hide";
                        },1200)
                    }
                    ref.confirm.hidden="true";
                    ref.refund.className="unrefund";
                    state.stat=false;
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    throw XMLHttpRequest.responseText;
                }
            });
        });
    }
    // handleQrcodeClick(event){
    //     // let query = this.props.location.query.test;
    //     let status = this.refs.tradeStatus.id;
    //     this.refs.maskNew.className="mask_new show";
    //     this.refs.qrcodeDetailParent.className="show";
    //     if(this.refs.qrcodeDetail.children[0]){
    //         return
    //     }else {
    //         makeCode("qrcode_Detail",orderNo,status);
    //     }
    //
    // }
    handleMaskClick(event){
        this.refs.qrcodeDetailParent.className="hide";
        this.refs.confirm.className="hide";
        this.refs.maskNew.className="mask_new hide";
    }
    handleParkClick(event){
        this.refs.handleParkClick.innerText=this.refs.businessPark.innerText;
        let that = this;
        this.refs.handleParkClick.className="show";
        setTimeout(function() {
            that.refs.handleParkClick.className="hide";
        }, 1200);
    }
    handleParkClick(event){
        this.refs.handleParkClick.innerText=this.refs.businessPark.innerText;
        let that = this;
        this.refs.handleParkClick.className="show";
        setTimeout(function() {
            that.refs.handleParkClick.className="hide";
        }, 1200);
    }
    tochPhone(){
        this.jht.telephone("4007005305");
    }
    render(){
        let style1 = {"color":"#80c02b"};
        let style2 = {"color":"#ef6623"};
        return (
            <div className="first_class">
                <div id="poptip"className="hide" ref="handleParkClick"></div>
                <div className="money">
                    <span style={ style1 }>支付金额：</span>
                    <span style={ style2 } ref="actualFee"></span>
                </div>
                <div className="ul_parent">
                    <ul className="ul">
                        <li ref="businessPark" onClick={ this.handleParkClick.bind(this) }>
                            <span>停车场</span>
                            <span id="parkGround" className="second_class"></span>
                        </li>
                        <li ref="businessName">
                            <span>商户名称</span>
                            <span className="second_class"></span>
                        </li>
                        <li className="show" ref="carNo">
                            <span>车牌号码</span>
                            <span className="second_class"></span>
                        </li>
                        <li className="" ref="bankType">
                            <span>支付方式</span>
                            <span className="second_class"></span>
                        </li>
                        <li className="show" id="" ref="tradeStatus">
                            <span>交易状态</span>
                            <span className="second_class"></span>
                        </li>
                        <li className="hide" ref="discountTypeLi">
                            <span ref="asdf">优惠方式</span>
                            <span className="second_class"></span>
                        </li>
                        <li className="hide" ref="discountAmountLi">
                            <span>优惠金额</span>
                            <span className="second_class"></span>
                        </li>
                        <li ref="tradeTime">
                            <span>交易时间</span>
                            <span className="second_class"></span>
                        </li>
                        {/*<li ref="qrcode" onClick={ this.handleQrcodeClick.bind(this) }>*/}
                            {/*<span>订单二维码</span>*/}
                            {/*<div className="qrcode"></div>*/}
                        {/*</li>*/}
                        <li className="show" ref="orderNo">
                            <span>订单号</span>
                            <span className="second_class"></span>
                        </li>
                        <li className="li_last hide" ref="payReason">
                            <span>订单审核结果</span>
                            <span className="second_class"></span>
                        </li>
                    </ul>
                </div>
                <div id="refund" className="hide" onClick={this.handleRefundClick.bind(this)} ref="refund">申请退款</div>
                <div className="hide" id="confirm" ref="confirm">
                    <div className="rotate">
                        <p>确定退款<label></label>吗？</p>
                        <div className="line"></div>
                        <button type="button" id="confirm_sure"  onClick={this.handleSureClick.bind(this)} ref="confirmSure">确认退款</button>
                        <button type="button" id="confirm_cancel"  onClick={this.handleCancelClick.bind(this)} ref="confirmCancel">再想想看</button>
                    </div>
                </div>
                <div id="poptip" className="hide" ref="poptip"></div>
                <div className="mask_new hide" ref="maskNew" onClick={ this.handleMaskClick.bind(this) }></div>
                <footer className="footer">
                    <div>若您对上述交易有疑问</div>
                    <div>请致电捷顺客服电话：<a onClick={this.tochPhone.bind(this)} className="footer_span">400-7005305</a></div>
                </footer>
                <div id="qrcode_Detail_Parent" ref="qrcodeDetailParent" className="hide">
                    <div id="qrcode_Detail" ref="qrcodeDetail">
                    </div>
                </div>
            </div>
        );
    }
}

//生成二维码
// function makeCode (el,code,statu) {
//     var codeContent;
//     var bcResult = [];
//     codeContent = [{
//         "orderNo": code,//订单号
//         "status": statu //交易状态
//     }];
//
//     let qrcode = new QRCode( el ,{
//         width: 170,
//         height: 170,
//         colorDark: '#9adb43',
//         colorLight: '#ffffff',
//         correctLevel: QRCode.CorrectLevel.H
//     });
//     qrcode.makeCode(JSON.stringify(codeContent));
// }
export { MonthPaymentDetail };
// export { MonthPaymentDetail,makeCode };