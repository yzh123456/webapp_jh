/**
 * Created by WQ on 2016/12/14.
 */
import {Component} from "react";
import {BillItem} from "./billItem";
import {switchPaneStore, billTypeStore, dataStoreRecent, dataStoreBefore} from "./store";
import {AppBridge} from "../../common/util/AppBridge";
import {dataInteract, resetTradePage, resetHisTradePage} from "./dataInteract";
import {Nothing} from "../../common/components/Nothing";
import {Blank} from "./blank";
import {hideBillListChangeImg} from "./billHead";
import {PullDownRefresh} from "../../common/jhtScroll/PullDownRefresh";
import {PullUpLoadMore, showNoMoreData} from "../../common/jhtScroll/PullUpLoadMore";
import jht from "../../common/util/JHT";
let JHT = new jht();
let dataRecent = [];  //保存近半个月的数据  List<TXDataObject>
let dataBefore = [];  //保存半个月前的数据

let listenSwitchState = "left";      //保存切换面板选择，默认为 left(左边)          总是保持着当前最新的选择
let listenBillTypeState = "all";     //保存账单类型列表选择，默认为 all(全部账单)   总是保持着当前最新的选择

let remK = (document.documentElement.clientWidth / 750) * 100;
let listBoxHei = document.documentElement.clientHeight - 1.92*remK;

let stBlank = {"width": "100%", "height": "1.92rem"};    /* 空白的DIV（头部高度+切换面板高度=1rem + 0.9rem + 0.01*2rem） + listBox DIV 撑起最外层DIV达到body的高度*/
let stListBox = { "width":"100%", "height":`${listBoxHei}px`, "overflow":"auto"};

let changeTipFlat = false;   //由于刚开始加载时请求半个月内和半个月前的数据各一次，设置标志防止第一次加载半个月前的数据为空时调用 showNoMoreData()

let globalUserId = "";
let globalJSTCardNo = "";

export class BillItemList extends Component {
    constructor() {
        super();
        this.state = {
            choiceState:0,   //通过改变choiceState使得组件重新渲染
        };

        //订阅切换面板点击状态（switchState）
        switchPaneStore.subscribe(()=>{
            listenSwitchState = switchPaneStore.getState();
            this.setState({ choiceState : this.state.choiceState + 1 });

           this.refs.listBox.scrollTop = 0;   //更新列表项框前让列表项框的滚动条回到顶部
        });

        //订阅账单类型列表选择状态（billTypeState）
        billTypeStore.subscribe(()=>{
            listenBillTypeState = billTypeStore.getState();
            /*listenSwitchState = "left";          //重置切换面板的选择为left（左边）*/
            this.setState({ choiceState : this.state.choiceState + 1 });

            this.refs.listBox.scrollTop = 0;   //更新列表项框前让列表项框的滚动条回到顶部
        });

        //订阅ajax返回数据  （近半个月）
        dataStoreRecent.subscribe(()=>{
            let data = dataStoreRecent.getState();   //data是后台返回的ServiceResponseData
            if (data.resultCode == 0) {
                if(data.dataItems.length != 0 ) {   //返回的数据长度不为0时才合并数据和更新组件
                    for (let i=0; i<data.dataItems.length; i++) {
                        if (data.dataItems[i].attributes.TXN_AMT != 0 && data.dataItems[i].attributes.TXN_DSP.indexOf("验证") == -1 ) {       //交易金额为0的不显示、 交易类型含有"验证"的不显示
                            dataRecent.push(data.dataItems[i]);    //本地保存数据
                        }
                    }
                    this.setState({ choiceState : this.state.choiceState + 1 });
                } else {
                    showNoMoreData();      //显示无更多内容
                }
            } else {
                //后台(云服务)查询失败
            }
        });

        //订阅ajax返回数据  （半个月前）
        dataStoreBefore.subscribe(()=>{
            let data = dataStoreBefore.getState(); //ServiceResponseData
            if (data.resultCode == 0) {
                if(data.dataItems.length != 0 ) {
                    for (let i=0; i<data.dataItems.length; i++) {
                        if (data.dataItems[i].attributes.TXN_AMT != 0 &&  data.dataItems[i].attributes.TXN_DSP.indexOf("验证") == -1 ) {       //交易金额为0的不显示、交易类型含有"验证"的不显示
                            dataBefore.push(data.dataItems[i]);   //本地保存数据
                        }
                    }
                    this.setState({ choiceState : this.state.choiceState + 1 });
                } else {
                    if (changeTipFlat == true) {
                        showNoMoreData();      //显示无更多内容
                    } else {
                        changeTipFlat = true;
                    }

                }
            } else {
                //后台(云服务)查询失败
            }
        });

    }


    componentDidMount() {
        let carno = window.sessionStorage.getItem("carno");
        let car  = window.location.href.split("=")[3];
        //获取userId 和 捷顺通卡号
       AppBridge.baseData( function(data){
            globalUserId = data.USER.USER_ID || "";

             dataInteract.reqService("queryTradeRecord", globalUserId);      //发起ajax请求数据  （近半个月：queryTradeRecord  半个月前：queryHisTradeRecord ）
             dataInteract.reqService("queryHisTradeRecord",globalUserId);   // 测试用USER_ID: bdd02427a362486299929225fc49cbb5   3f4cef3995e448d2816b5726db46280e

            //嵌套异步
           if(JHT.working() == "APP"){
               AppBridge.forJS({    //请求获取捷顺通卡号
                   serviceId:"GETJSTCARDNO",
                   params:""
               },function (data) {
                   globalJSTCardNo = JSON.stringify(data) || "";

                   if (globalJSTCardNo != ""){
                      document.getElementById("jstAccount").innerText = globalJSTCardNo.split("\"")[1];
                   }

               });

           }else{

               if(carno=="" || carno==null){

                   document.getElementById("jstAccount").innerText = car;
               }else{

                   document.getElementById("jstAccount").innerText = carno;
               }
           }


        });

        //用户点击或者拖动列表时，隐藏账单类型列表组件和改变向上向下图标
        this.refs.listBox.addEventListener("touchstart",function () {
            hideBillListChangeImg();
        });

    }

    render() {

        let rows = [];
        let data = [];   //展示数据

        //根据切换面板选择状态 和 账单类型选择状态 显示列表
        if(listenBillTypeState == "all" && listenSwitchState == "left" ) {               //显示 全部账单  近半个月
            data = dataRecent;

        }else if (listenBillTypeState == "all" && listenSwitchState == "right" ) {      //显示 全部账单  半个月前
            data = dataBefore;

        }else if (listenBillTypeState == "recharge" && listenSwitchState == "left") {   //显示 充值账单  近半个月
            data = filterData(dataRecent, "充值");

        }else if (listenBillTypeState == "recharge" && listenSwitchState == "right") {  //显示 充值账单   半个月前
            data = filterData(dataBefore, "充值");

        }else if (listenBillTypeState == "consume" && listenSwitchState == "left") {     //显示 消费账单  近半个月
            data = filterData(dataRecent, "消费");

        }else {                                                                             //显示 消费账单 半个月前
            data = filterData(dataBefore, "消费");
        }

        //根据过滤后的数据初始化组件列表
        if (data.length == 0) {
            rows.push(<Nothing key="0" content="亲，没有查询到您的账单记录哦!" />);
            for (let k=0; k<7; k++) {          //因为Nothing是fixed定位，无法撑开listBox，导致上拉加载组件的DIV显示在页面上边，因此用空白组件撑开listBox
                rows.push(<Blank key={k-8} />);
            }
        } else {
            for(let i=0; i<data.length; i++){
                rows.push(<BillItem key={i} itemData={data[i].attributes} />);
            }
            if ( data.length < 6) {   //如果列表项少于6个(5-6个填满)，则填充满listBox这个DIV，让竖向滚动条出来，从而可以监听滚动条滚动到底部
                let count = 6 - data.length;   //如果不足6个则填充到6个
                for (let j=0; j<count; j++) {
                    rows.push(<Blank key={j-6} />);
                }
            }
        }

        return (
            <div>
                <div style={ stBlank }> </div>  {/*空白div用于和列表DIV一起撑开 虚拟body达到整个真是body的高度  */}
                <PullDownRefresh element="listBox" fn={refreshData} over="auto" />              {/*下拉刷新组件*/}
                <div id="listBox" ref="listBox" style={stListBox} >
                    {rows}
                    <PullUpLoadMore element="listBox" fn={loadMoreData} over="auto" />          {/*上拉加载更多组件*/}
                </div>

            </div>
        )
    }
}

/*
* 数据过滤函数  （参数说明:需要过滤的数组, 账单类型）
 */
function filterData(data, type) {
    let result = [];

    for (let i=0; i<data.length; i++) {
        let billType = data[i].attributes.TXN_DSP;   //账单类型

        if (billType.indexOf("消费") > -1 ) {
            billType = "消费";
        }else {
            billType = "充值";
        }

        if (billType == type){
            result.push(data[i]);
        }
    }

    return result;
}

/*
 * 下拉刷新事件触发函数
 */
function refreshData() {
     console.log("executing refreshing ...");
    //发起ajax请求，请求结束后redux触发合并新数据，然后重新渲染
    if (listenSwitchState == "left") {
        dataRecent = [];                                                //清空本地数据
        resetTradePage();                                               //重置查询页索引
        dataInteract.reqService("queryTradeRecord", globalUserId);   //发起ajax请求数据
    } else {
        dataBefore = [];
        resetHisTradePage();
        dataInteract.reqService("queryHisTradeRecord",globalUserId);
    }
}

/*
* 上拉加载事件触发函数
 */
function loadMoreData() {
    console.log("executing loading...");
    //发起ajax请求，请求结束后redux触发合并新数据，然后重新渲染
    if (listenSwitchState == "left"){
        dataInteract.reqService("queryTradeRecord", globalUserId);
    } else {
        dataInteract.reqService("queryHisTradeRecord", globalUserId);
    }
}
