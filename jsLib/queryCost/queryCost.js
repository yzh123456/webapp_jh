import { Component,createClass} from "react";
import { Nothing } from "../common/components/Nothing"
import { Link } from "react-router";
import { AppBridge } from "../common/util/AppBridge";
import { operateMask } from "../common/components/Loading";
import { PullDownRefresh } from "../common/jhtScroll/PullDownRefresh";
import { PullUpLoadMore,showNoMoreData } from "../common/jhtScroll/PullUpLoadMore";
import JHTAJAX from "../common/util/JHTAjax";
import init from "../common/Common"
new init();
let that = "";
var hasNoMore = true;
var pageIndex = 1;
var tradeDtatus = window.sessionStorage.getItem("liked")==""?5:window.sessionStorage.getItem("liked");
let dataTmp = {};
dataTmp = {
    undue:[],
    overdue:[]
};
class QueryCost extends Component {
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:"",
            loading: 0,
            asyco :0,
            tradeStatus:5
        };
        this.state = this.stateObj;
    }
    componentWillMount(){
        this.poperateMask(tradeDtatus,1);
    }

    poperateMask(tradeDtatus,pageIndex){
        var pageIndex = pageIndex;
        AppBridge.baseData(function (data) {
            var userId = data.USER.USER_ID;
            let myDate = new Date();
            let endTime = myDate.getFullYear() + "-" + (myDate.getMonth()+1)+ "-" +myDate.getDate();
            let obj = {
                dataItems:[
                ]
            };
            var attr = {
                attributes:{
                    userId:userId,
                    startTime:"1970-07-01",
                    endTime:"9999-07-01",
                    pageSize : 10,
                    pageIndex : pageIndex,
                    tradeStatus : tradeDtatus==null?5:tradeDtatus
                }
            };
            obj.dataItems.push(attr);
            //operateMask("show");
            JHTAJAX({
                // url:xmppServer,
                data: {
                    serviceId:"JSCSP_ORDER_USERVERSIONRECORDS",
                    dataItems:JSON.stringify(obj.dataItems)
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
                        for (var i = 0; i < data.dataitems.length; i++) {
                            if (data.dataitems[i].attributes.tradestatus == -1) {
                                //未使用
                                dataTmp.overdue.push(data.dataitems[i]);
                            } else {
                                //未使用
                                dataTmp.undue.push(data.dataitems[i]);
                            }
                        }
                    }else{
                        hasNoMore=false;
                        showNoMoreData();
                    }
                    this.stateObj.stateObjList = dataTmp;
                    this.stateObj.tradeDtatus = tradeDtatus;
                    this.setState(this.stateObj);
                }.bind(this)
            });
        }.bind(this));
    }

//     poperateMask(tradeDtatus,pageIndex){
//        var pageIndex = pageIndex;
//     AppBridge.baseData(function (data) {
//         var userId = data.USER.USER_ID;
//         let myDate = new Date();
//         let endTime = myDate.getFullYear() + "-" + (myDate.getMonth()+1)+ "-" +myDate.getDate();
//         let obj = {
//             dataItems:[
//             ],
//             asycn:false
//         };
//         var attr = {
//             attributes:{
//                 unionid:"userId:"+userId,
//                 startTime:"1970-07-01",
//                 endTime:"9999-07-01",
//                 pageSize : 10,
//                 pageIndex : pageIndex,
//                 tradeStatus : tradeDtatus==null?5:tradeDtatus
//             }
//         };
//         obj.dataItems.push(attr);
//         //operateMask("show");
//         $.ajax({
//             url:xmppServer,
//             data: {
//                 serviceId:"JSCSP_ORDER_USERVERSIONRECORDS",
//                 dataItems:JSON.stringify(obj.dataItems)
//             },
//             dataType : 'json',
//             type:'post',
//             async:false,
//             success : function(data) {
//                 operateMask("hide");
//                 if(pageIndex==1){
//                     dataTmp = {
//                         undue:[],
//                         overdue:[]
//                     };
//                 }
//                 if (data.dataItems && data.dataItems.length > 0) {
//                     hasNoMore=true;
//                     if((data.dataItems.length)%10!==0){
//                         showNoMoreData();
//                     }
//                     for (var i = 0; i < data.dataItems.length; i++) {
//                         if (data.dataItems[i].attributes.tradeStatus == -1) {
//                             //未使用
//                             dataTmp.overdue.push(data.dataItems[i]);
//                         } else {
//                             //未使用
//                             dataTmp.undue.push(data.dataItems[i]);
//                         }
//                     }
//                 }else{
//                     hasNoMore=false;
//                     showNoMoreData();
//                 }
//                 this.stateObj.stateObjList = dataTmp;
//                 this.stateObj.tradeDtatus = tradeDtatus;
//                 this.setState(this.stateObj);
//             }.bind(this)
//         });
//     }.bind(this));
// }
    componentDidMount() {
        that = this;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.liked !== undefined){
            operateMask("show");
            this.poperateMask(nextProps.liked,1);
        }
    }
	render() {
        let liked = this.props.liked;
        if(liked==1){
            tradeDtatus = 1;
        }else{
            tradeDtatus = 5;
        }
        var dataServiceList = this.state.stateObjList;
        var auto = true;
        var getMore = false;
        if(liked==5){
            if (dataServiceList !=="" &&dataServiceList.undue&& dataServiceList.undue.length > 0) {
                dataServiceList = dataServiceList.undue;
                auto = true;
            }else{
                auto = false;
            }
        }else{
            if (dataServiceList !=="" &&dataServiceList.overdue&& dataServiceList.overdue.length > 0) {
                dataServiceList = dataServiceList.overdue;
                auto = true;
            }else{
                auto = false;
            }
        }
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97*remK);
        console.log(topDivHei);

        let style2 = {"overflow":"auto", "height":`${topDivHei}px`};
        let loadDown = {"height":`${document.documentElement.clientHeight}px`};
        let stBlank = {"height":"0.97rem"};
        let el = <div className="flowLine" ref="flowLine"></div>;
        if(auto){
            el = <div className="flowLine" ref="flowLine"></div>;
        }else{
            el = <div className="hide" ref="flowLine"></div>;
        }
        return (
            <div className="list_div">
                <div style={stBlank}></div>
                <PullDownRefresh element="top_div" fn={refreshData} over="auto"/>
                <div className="top_div" id="top_div" style={style2}>
                    { el }
                    {
                         auto==true?(
                            dataServiceList.map((dataServiceList, i)=> {
                                return <div key={ `list-${ i }` }>
                                    <CostSuccess dataServiceList={dataServiceList} liked = {liked} />
                                </div>
                            })
                         ):(liked==5? <div><Nothing content="亲，没有查询到已支付的记录哦" /><div style={loadDown}></div></div>:<div><Nothing content="亲，没有查询到未支付的记录哦" /><div style={loadDown}></div></div>)
                    }
                    <PullUpLoadMore element="top_div" fn={loadMoreData} over="auto" />
                </div>
            </div>
        )
	}
}
class CostSuccess extends Component{
    render(){

        var dataServiceList = this.props.dataServiceList;
        var tmp = dataServiceList.attributes;
        let auto = true;
        let orderType = "";
        let orderTypeBg = "";
        let aa ="";
        if(tmp.ordertype == "SP"||tmp.ordertype == "VNP"||tmp.ordertype == "DK"){
            orderType="停车费";
            orderTypeBg = "park_fee";
        }else if(tmp.ordertype == "CDP"){
            orderType="月卡费";
            orderTypeBg = "monthly_fee";
        }else if(tmp.ordertype == "YD"){
            orderType="订位费";
            orderTypeBg = "location_fee";
        }else if(tmp.ordertype == "VISITOR"){
            orderType="访客费";
            orderTypeBg = "visitor_fee";
        }else if(tmp.ordertype == "SR"){
            orderType="租位费";
            orderTypeBg = "rental_fee";
        }else{
            orderType="其他费";
            orderTypeBg = "other_fee";
        }
        let orderState = "";
        if (tmp.tradestatus == 0) {
            orderState="交易成功";
        } else if (tmp.tradestatus == -1) {
            orderState="未支付";
        } else if (tmp.tradestatus == 1) {
            orderState="支付失败";
        } else if (tmp.tradestatus == 100) {
            orderState="支付成功";
        } else if (tmp.tradestatus == 300) {
            orderState="已退款";
        } else if (tmp.tradestatus == 400) {
            orderState="通知失败";
        } else if (tmp.tradestatus == 500) {
            orderState="订单关闭";
        } else if (tmp.tradestatus == 600) {
            orderState="无效订单";
        } else if(tmp.tradestatus == 301 ){
            orderState="退款中";
        }else if(tmp.tradestatus == 302){
            orderState="拒绝退款";
        }
        //金额显示只保留一位小数，如果为0则显示0  （返回的金额单位为分）
        var ds = (parseFloat(tmp.actualfee)).toFixed(2);
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
        ds = ds;
        let pathdata = {
            pathname: "/queryCostDetail",
            query: {
                text: tmp.orderno,
                invoice:tmp.invoicestatus
            }
        };
        let accessem = <div id="bill" ref="bill">
            <Link to={pathdata} className="sublist">
                <div className={orderTypeBg} ref = "parkFee">
                    {orderType}
                </div>
                <div className="smiddle">
                    <p className="font1">
                        <span id="parkName">{tmp.parkname}</span>
                    </p>
                    <p className="font3" id="carNo">{tmp.carno}</p>
                    <p className="font2" id="billTime">{tmp.createtime}</p>
                </div>
                <div className="sright1">
                    <p className="font1">
                        <span id="price">{`￥ ${ ds }` }</span>
                    </p>
                    <p className="font4">{ orderState }</p>
                </div>
                <div className="orderNo">
                    <span>订单号: </span>
                    <span id="orderNo">{tmp.orderno}</span>
                </div>
            </Link>
        </div>;
        let erroroem = <div  id="billErroro" ref="billErroro">
            <Link to={pathdata} className="sublist">
                <div className={orderTypeBg} ref = "parkFee">
                    {orderType}
                </div>
                <div className="smiddle">
                    <p className="font1">
                        <span id="parkName">{tmp.parkname}</span>
                    </p>
                    <p className="font3" id="carNo">{tmp.carno}</p>
                    <p className="font2" id="billTime">{tmp.createtime}</p>
                </div>
                <div className="sright1">
                    <p className="font1">
                        <span id="price">{`￥ ${ ds }` }</span>
                    </p>
                    <p className="font4">{ orderState }</p>
                </div>
                <div className="orderNo">
                    <span>订单号: </span>
                    <span id="orderNo">{tmp.orderno}</span>
                </div>
            </Link>
        </div>;
        if (tmp.tradestatus == -1) {
            if(this.props.liked==1){
                aa = erroroem;
            }
        } else {
            if(this.props.liked==5){
                aa = accessem;
            }
        }
        return aa
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

export { QueryCost };
