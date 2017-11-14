import { Component,createClass} from "react";
import { Nothing } from "../common/components/Nothing";
import  getInvoice  from "./getInvoice";
import { operateMask } from "../common/components/Loading";
import { PullDownRefresh } from "../common/jhtScroll/PullDownRefresh";
import { PullUpLoadMore,showNoMoreData } from "../common/jhtScroll/PullUpLoadMore";
import JHTAJAX from "../common/util/JHTAjax";
import JHT from "./../common/util/JHT";
import  MyToast  from "../common/components/MyToast";
let jht = new JHT();
let that = "";
let hasNoMore = true;
let pageIndex = 1;
let tradeDtatus = window.sessionStorage.getItem("liked")==""?5:window.sessionStorage.getItem("liked");
let dataTmp = {
    undue:[],
    overdue:[]
};
class Invoice extends Component {
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:"",
            loading: 0,
            asyco :0,
            check:"uncheck",
            tradeStatus:5
        };

        this.state = this.stateObj;
    }
    componentWillMount(){
        this.poperateMask(tradeDtatus,1);
    }

    poperateMask(tradeDtatus,pageIndex){
        let userId = window.USERINFO.USER.USER_ID;
        let myDate = new Date();
        let endTime = myDate.getFullYear() + "-" + (myDate.getMonth()+1)+ "-" +myDate.getDate();
        let obj = {
            dataItems:[
            ]
        };
        if(!jht.urlParams().parkId){
            /*let myToast=new MyToast();
            myToast.setToast("车场ID为空，请检查");*/
            setTimeout(function () {
                operateMask("hide");
            },200);
            console.log("车场ID为空，请检查");
            return false;
        }
        let attr = {
            attributes:{
                /*userId:userId,
                startTime:"1970-07-01",
                endTime:"9999-07-01",
                pageSize : 10,
                pageIndex : pageIndex,
                tradeStatus : tradeDtatus==null?5:tradeDtatus*/
                USER_ID:userId,
                PARK_ID:jht.urlParams().parkId,
                PAGE_SIZE : 10,
                PAGE_INDEX : pageIndex,
            }
        };
        obj.dataItems.push(attr);
        //operateMask("show");
        JHTAJAX({
            // url:xmppServer,
            data: {
                // serviceId:"JSCSP_ORDER_USERVERSIONRECORDS",//查询账单的serviceId
                serviceId:"ac.charge.queryinvocieorder",
                // dataItems:obj.dataItems
                attributes:obj.dataItems[0].attributes
            },
            dataType : 'json',
            type:'post',

            success : function(data) {
                operateMask("hide");
                if(pageIndex==1){
                    dataTmp = {
                        undue:[],
                        overdue:[]
                    };
                }
                if (data.dataitems && data.dataitems.length > 0) {
                    hasNoMore=true;
                    if((data.dataitems.length)%10!==0){
                        showNoMoreData();
                    }
                    /*for (var i = 0; i < data.dataitems.length; i++) {
                        if (data.dataitems[i].attributes.tradestatus == -1) {
                            //未使用
                            dataTmp.overdue.push(data.dataitems[i]);
                        } else {
                            //未使用
                            dataTmp.undue.push(data.dataitems[i]);
                        }
                    }*/
                }else{
                    hasNoMore=false;
                    showNoMoreData();
                }
                this.stateObj.stateObjList = data.dataitems;
                this.stateObj.tradeDtatus = tradeDtatus;
                this.setState(this.stateObj);
            }.bind(this)
        });
    }

    componentDidMount() {
        that = this;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.liked !== undefined){
            operateMask("show");
            this.poperateMask(nextProps.liked,1);
        }
    }
    chooseAllClick(){
        if(this.refs.chooseAll && that.stateObj.check == "checked"){
            /*document.querySelectorAll(".list_div .check").forEach((check, i)=> {
                check.className = "check uncheck";
            });*/
            for(let i = 0 ;i <  document.querySelectorAll(".list_div .check").length ;i++){
                document.querySelectorAll(".list_div .check")[i].className = "check uncheck";
            }
            this.chooseStust("uncheck");
            this.refs.chooseAll.style.background = "url(../images/uncheck.png) no-repeat 0.2rem";
            this.refs.chooseAll.style.backgroundSize = "0.45rem";
        }else {
            for(let i = 0 ;i <  document.querySelectorAll(".list_div .check").length ;i++){
                document.querySelectorAll(".list_div .check")[i].className = "check checked";
            }
            /*document.querySelectorAll(".list_div .check").forEach((check, i)=> {

            });*/
            this.chooseStust("checked");
            this.refs.chooseAll.style.background = "url(../images/checked.png) no-repeat 0.2rem";
            this.refs.chooseAll.style.backgroundSize = "0.45rem";
        }

    }
    chooseStust(check = "uncheck"){
        that.stateObj.check = check;
    }

    //点击申领发票获取授权页
    invoiceClick(){
        let attr = {};
        attr.USER_ID = window.USERINFO.USER.USER_ID;
        attr.SOURCE = jht.working() == "APP" ? "app":"web";
        if(that.stateObj.check == "checked" && jht.urlParams().parkId ){
            attr.PARK_ID = jht.urlParams().parkId;
        }else {
            let orderNo = [];
            for(let i = 0 ;i <  document.querySelectorAll(".list_div .checked").length ;i++){
                orderNo.push(document.querySelectorAll(".list_div .checked")[i].id);
            }
            attr.ORDER_NO = orderNo.join(",");
        }
        if(attr.ORDER_NO || attr.PARK_ID){
            getInvoice(attr);
        }else{
            let myToast = new MyToast();
            myToast.setToast("请选择开发票的订单！");
        }

    }

	render() {
        let liked = this.props.liked;
        if(liked==1){
            tradeDtatus = 1;
        }else{
            tradeDtatus = 5;
        }
        let dataServiceList = this.state.stateObjList;
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97*remK);
        console.log(topDivHei);

        let style2 = {"overflow":"auto","overflowX": "hidden", "height":`${topDivHei}px`};
        let loadDown = {"height":`${document.documentElement.clientHeight}px`};
        return (
            <div className="list_div">
                <PullDownRefresh element="top_div" fn={refreshData} over="auto"/>
                <div className="top_div" id="top_div" style={style2}>
                    {
                        dataServiceList.length>0?(
                            dataServiceList.map((dataServiceList, i)=> {
                                return <div key={ `list-${ i }` }>
                                    <CostSuccess chooseStust = { this.chooseStust }  dataServiceList={dataServiceList} liked = {liked} />
                                </div>
                            })
                         ):(<div><Nothing content="亲，您还没有可以开发票的订单哦" /><div style={loadDown}></div></div>)
                    }
                    <PullUpLoadMore element="top_div" fn={loadMoreData} over="auto" />
                </div>
                <div className="getVnvoice" >
                    <div className="chooseAll" onClick={this.chooseAllClick.bind(this)} ref="chooseAll">全选</div>
                    <div className="confirm" onClick={this.invoiceClick.bind(this)} ref="confirm">申领发票</div>
                </div>
            </div>
        )
	}
}
class CostSuccess extends Component{
    billClick(){
        if( this.refs.check && this.refs.check.className.indexOf("checked") > 0 ){
            this.refs.check.className = "check uncheck";
            //this.stateObj.check = "uncheck";
            this.props.chooseStust("uncheck");
            document.querySelector(".chooseAll").style.background = "url(../images/uncheck.png) no-repeat 0.2rem";
            document.querySelector(".chooseAll").style.backgroundSize = "0.45rem";
        }else {
            this.refs.check.className = "check checked";
        }
    }
    /*showName(){  //显示长车场名字   暂时不用
        if(this.refs.parkName && this.refs.parkName != '' &&
            this.refs.parkName.innerText && this.refs.parkName.innerText != ""){
            let myToast = new MyToast();
            myToast.setToast(this.refs.parkName.innerText);
        }
    }*/
    render(){
        let dataServiceList = this.props.dataServiceList;
        let tmp = dataServiceList.attributes;
        let orderType = "";
        let orderTypeBg = "";
        let ordertype = tmp.ordertype||tmp.order_type;
        if(ordertype == "SP"||ordertype == "VNP"||ordertype == "DK"){
            orderType="停车费";
            orderTypeBg = "park_fee";
        }else if(ordertype == "CDP"){
            orderType="月卡费";
            orderTypeBg = "monthly_fee";
        }else if(ordertype == "YD"){
            orderType="订位费";
            orderTypeBg = "location_fee";
        }else if(ordertype == "VISITOR"){
            orderType="访客费";
            orderTypeBg = "visitor_fee";
        }else if(ordertype == "SR"){
            orderType="租位费";
            orderTypeBg = "rental_fee";
        }else{
            orderType="其他费";
            orderTypeBg = "other_fee";
        }
        let orderState = "交易成功";
        //金额显示只保留一位小数，如果为0则显示0  （返回的金额单位为分）
        let ds = (parseFloat(tmp.actualfee || tmp.actual_fee || tmp.total_fee || 0.00 )).toFixed(2);
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
        let accessem = <div id="bill" ref="bill" onClick={this.billClick.bind(this)}>
            <div className="check uncheck" id={tmp.orderno || tmp.order_no} ref="check"></div>
            <div className="sublist">
                <div className={orderTypeBg} ref = "parkFee">
                    {orderType}
                </div>
                <div className="smiddle">
                    <p className="font1" >
                        <span id="parkName" ref="parkName">{jht.getStrSub(tmp.parkname || tmp.park_name)}</span>
                    </p>
                    <p className="font3" id="carNo">{tmp.carno || tmp.car_no}</p>
                    <p className="font2" id="billTime">{tmp.createtime || tmp.create_time}</p>
                </div>
                <div className="sright1">
                    <p className="font1">
                        <span id="price">{`￥ ${ ds }` }</span>
                    </p>
                    <p className="font4">{ orderState }</p>
                </div>
                <div className="orderNo">
                    <span>订单号: </span>
                    <span id="orderNo" ref="orderNo">{tmp.orderno || tmp.order_no}</span>
                </div>
            </div>
        </div>;
        return accessem;
    }
}
function refreshData() {
    console.log("refreshing");
    pageIndex=1;  //页码
    // operateMask("show");
    that.poperateMask(tradeDtatus,pageIndex);
}

function loadMoreData() {
    pageIndex++;  //页码
    that.poperateMask(tradeDtatus,pageIndex);
}

export { Invoice };
