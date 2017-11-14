import { Component,createClass} from "react";
import JHTAJAX from "../common/util/JHTAjax";
import { Nothing } from "../common/components/Nothing"
import { Link } from "react-router";
import { AppBridge } from "../common/util/AppBridge";
import { operateMask } from "../common/components/Loading";
import { PullDownRefresh } from "../common/jhtScroll/PullDownRefresh";
import { PullUpLoadMore } from "../common/jhtScroll/PullUpLoadMore";
import { showNoMoreData } from "../common/jhtScroll/PullUpLoadMore";
import  JHT  from "../common/util/JHT";
let pageIndex=1;
let hasNoMore = true;
let dataTmp = {};
let that = "";
dataTmp = {
    undue:[],
    overdue:[]
};
let fromAppData={};
class MonthPaymentList extends Component {
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:""
        };
        this.state = this.stateObj;
        this.jht = new JHT();
    }
    getData(pageIndex){
        //let pageIndex = pageIndex;
        AppBridge.baseData( function (datafromapp) {
            let userId = datafromapp.USER.USER_ID ;
            let myDate = new Date();
            let endTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
            let obj = {
                dataItems: []
            };
            let attr = {
                attributes: {
                    userId:userId,
                    startTime: "1970-07-01",
                    endTime: "9999-07-01",
                    pageSize: 10,
                    orderType:"CDP",
                    tradeStatus:5,
                    pageIndex: pageIndex
                }
            };
            obj.dataItems.push(attr);
            JHTAJAX({
                data: {
                    serviceId: "JSCSP_ORDER_USERVERSIONRECORDS",
                    dataItems: obj.dataItems
                },
                dataType: 'json',
                type: 'post',
                success: function (param) {
                    operateMask("hide");
                    if (param.dataitems && param.dataitems.length > 0) {
                        hasNoMore = true;
                        if((param.dataitems.length)%10!==0){
                            showNoMoreData();
                        }
                        let dataList = param;
                        AppBridge.forJS({
                            serviceId: "GETMONTHCARD",
                            params: ""
                        }, function (data) {
                            if(pageIndex==1){
                                dataTmp = {
                                    undue:[],
                                    overdue:[]
                                };
                            }
                            if(this.jht.working() == "WX"){
                                for(let i = 0; i < dataList.dataitems.length; i++){
                                    if(this.jht.urlParams().carNo == dataList.dataitems[i].attributes.carno && this.jht.urlParams().parkName == dataList.dataitems[i].attributes.parkname){
                                        dataTmp.overdue.push(dataList.dataitems[i]);
                                    }
                                }
                            }else if(this.jht.working() == "APP" && data ){
                                for (let i = 0; i < dataList.dataitems.length; i++) {
                                    if(data.carNo == dataList.dataitems[i].attributes.carno&&data.parkName == dataList.dataitems[i].attributes.parkname){
                                        dataTmp.overdue.push(dataList.dataitems[i]);
                                    }
                                }
                            }else{
                                // let carNo = this.jht.urlParams().carNo;
                                // let parkName = this.jht.urlParams().parkName;
                                for (let i = 0; i < dataList.dataitems.length; i++) {
                                    if(this.jht.urlParams().carNo == dataList.dataitems[i].attributes.carno && this.jht.urlParams().parkName == dataList.dataitems[i].attributes.parkname){
                                        dataTmp.overdue.push(dataList.dataitems[i]);
                                    }
                                }
                            }

                            this.stateObj.stateObjList = dataTmp;
                            this.setState(this.stateObj);
                        }.bind(this));
                    }else{
                        hasNoMore = false;
                        showNoMoreData();
                    }
                }.bind(this)
            });
        }.bind(this));
    }
    componentDidMount() {
        that = this;
        operateMask("show");
        this.getData(1);
        //监听滚动条滚动事件
        //$(".list_div").height($(window).height());
        //$(".top_div").height($(window).height()-1);
   /*     document.querySelector(".list_div").addEventListener("scroll", function(e){
            let outerDivHeight =  parseInt(document.defaultView.getComputedStyle(this,null).height.split("px")[0]);
            if (this.scrollHeight == this.scrollTop + outerDivHeight+1) {                  //滚动到底部   this指向 <div id="listBox"...>
                pageIndex++;  //页码
                console.log(pageIndex);
                operateMask("show");
                that.getData(pageIndex);
            }
            // if (this.scrollTop<=0) {                  //滚动到顶部   this指向 <div id="listBox"...>
            //     pageIndex=1;  //页码
            //     operateMask("show");
            //     that.getData(tradeDtatus,pageIndex);
            // }
        });*/
    }
	render() {
        let liked = this.props.liked;
        var auto = true;
        var dataServiceList = this.state.stateObjList;
        if (dataServiceList!=="" && dataServiceList.overdue.length > 0) {
            auto = true;  // 用来判断返回值是否为空

        }else{
            auto = false;
        }
        let style2 = {"overflow":"auto", "height":`${screen.height}px`};
        let loadDown = {"height":`${screen.height}px`};
        let el = <div className="flowLine" ref="flowLine"></div>;
        if(auto){
            el = <div className="flowLine" ref="flowLine"></div>;
        }else{
            el = <div className="hide" ref="flowLine"></div>;
        }
        return (
            <div>  {/* className="list_div" style= { style2 } */}
                <PullDownRefresh element="top_div" fn={refreshData} over="auto"/>
                <div className="top_div" id="top_div" style={ style2 } >
                    { el }
                    {
                         auto==true?(
                             dataServiceList.overdue.map((dataServiceList, i)=> {
                                return <div key={ `list-${ i }` }>
                                    <CostSuccess dataServiceList={dataServiceList} liked = {liked} />
                                </div>
                            })
                         ):(<div><Nothing content="亲，没有查询到月卡续费的记录哦"/><div style={loadDown}></div></div>)
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
            pathname: "/MonthPaymentDetail",
            query: {
                text: tmp.orderno
            }
        };
        let accessem = <div id="bill" ref="bill">
            <Link to={pathdata} className="sublist">
                <div className={ orderTypeBg } ref = "parkFee">
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
                        <span id="price">{`￥${ds}`}</span>
                    </p>
                    <p className="font4">{ orderState }</p>
                </div>
                <div className="orderNo">
                    <span>订单号: </span>
                    <span id="orderNo">{tmp.orderno}</span>
                </div>
            </Link>
        </div>;
        return accessem
    }
}

function refreshData() {
    console.log("refreshing");
    pageIndex=1;  //页码
    // operateMask("show");
    that.getData(pageIndex);
}

function loadMoreData() {
    console.log("loading");
    pageIndex++;  //页码
    console.log(pageIndex);
    // operateMask("show");
    that.getData(pageIndex);
}

export { MonthPaymentList };
