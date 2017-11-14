/**
 * Created by yqx on 2016/12/7.
 */
import {Component, Children} from "react";
import {render} from "react-dom";
import {Link} from "react-router";
import JHTAJAX from "../common/util/JHTAjax";
import { Nothing } from  "../common/components/Nothing"
import * as jht from "../common/util/jht";jht;
import {operateMask} from '../common/components/Loading';
import {PullDownRefresh} from "../common/JhtScroll/PullDownRefresh";
import { PullUpLoadMore,showNoMoreData } from "../common/jhtScroll/PullUpLoadMore";
dataTmp = {
    overdue:[]
};
let dataTmp = {};
let that = "";
let pageIndex =1;
let key = "";
let dataCount = 0;
class ReceiptCardList extends Component{
    constructor(props){
        super(props);
        this.stateObj = {
            stateObjList : ""
        };
        this.state = this.stateObj;
    }
    componentDidMount() {
        that = this;
        this.refresh(pageIndex);
    }
    refresh(pageIndex){
        console.log(that.refs.inputPark);
        key = that.refs.inputPark.value;
        let obj = {
            serviceId:"ac.coupon.sy_getadvercoupon",
            dataItems:[],
        };
        var attr = {
            attributes:{
                KEY:key,
                PAGESIZE : 20,
                PAGEINDEX : pageIndex
            }
        };
        obj.dataItems.push(attr);
        JHTAJAX( {
            data: {
                serviceId:obj.serviceId,
                dataItems:JSON.stringify(obj.dataItems)
            },
            timeOut:10000,
            type:'post',
            dataType:'json',
            success : function(data) {
                operateMask("hide");
                if(pageIndex==1){
                    dataTmp = {
                        overdue:[]
                    };
                }
                if (data.dataitems && data.dataitems.length > 0) {
                    if((data.dataitems.length)%10!==0){
                        showNoMoreData();
                    }
                    for (var i = 0; i < data.dataitems.length; i++) {
                        dataTmp.overdue.push(data.dataitems[i]);
                    }
                }else{
                    showNoMoreData();
                }
                this.stateObj.stateObjList = dataTmp;
                this.setState(this.stateObj);
            }.bind(this),
            error:function(error){
                console.log(error);
            }.bind(this),
        });
    }
    search(){
        this.refresh(1);
    }
    render() {
        var dataServiceList = this.state.stateObjList;
        var auto = true;
        if (dataServiceList !=="" &&dataServiceList.undue&& dataServiceList.undue.length > 0) {
            dataServiceList = dataServiceList.undue;
            auto = true;
        }else{
            auto = false;
        }
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97*remK-45);
        let style2 = {"overflow":"auto", "height":`${topDivHei}px`,"marginTop":"50px"};
        let loadDown = {"height":`${document.documentElement.clientHeight}px`};
        return (
            <div>
                <div className="search_counp">
                    <div  className="search_counp_div">
                        <input type="text" placeholder="请输入停车场、城市名称" ref="inputPark"/>
                        <div className="search_buttom" onClick={this.search.bind(this)}>查询</div>
                    </div>
                </div>
                <PullDownRefresh element="top_ul" fn={refreshData} over="auto"/>
                <div id="top_ul" className="top_ul"  style={style2}>
                    <CostSuccess dataServiceList={dataServiceList}/>
                    {
                        auto==true?(
                            dataServiceList.map((dataServiceList, i)=> {
                                return <ul key={ `list-${ i }` }>
                                    <CostSuccess dataServiceList={dataServiceList}/>
                                </ul>
                            })
                        ):(<div><Nothing content="亲，没有查询到可领取的卡券哦" /><div style={loadDown}></div></div>)
                    }
                    <PullUpLoadMore element="top_ul" fn={loadMoreData} over="auto" />
                </div>
            </div>
        )
    }
}
class CostSuccess extends Component{
    buttonOver(param){
        if(dataCount>0){
            let that = this;
            AppBridge.baseData(function (data) { //请求native获取usertId
                var userId = data.USER.USER_ID;
                let obj = {
                    serviceId: "ac.coupon.sy_executeaoocoupondraw",
                    dataItems: [],
                };
                var attr = {
                    attributes: {
                        USER_ID: userId,
                        COUPON_ID: param
                    }
                };
                obj.dataItems.push(attr);
                JHTAJAX({
                    data: {
                        serviceId: obj.serviceId,
                        dataItems: JSON.stringify(obj.dataItems)
                    },
                    timeOut: 10000,
                    type: 'post',
                    dataType: 'json',
                    success: function (data) {
                        if(data.resultCode==0){
                            dataCount--;
                            if(dataCount==0){
                                that.refs.buttonMessage.className="button button_already";
                                that.refs.counp_message_li.className="counp_message_already";
                                that.refs.num_over.className="num num_already";
                                that.refs.overlap.className="overlap overlap_already";
                                that.refs.num_over.className="apply apply_already";
                                that.refs.activity_time_div.className="div_already";
                                that.refs.counp_name_div.className="div_already";
                                that.refs.buttonMessage.innerText="已领取";
                            }
                        }
                    }
                })
            })
        }

    }

    render(){
        // var dataServiceList = this.props.dataServiceList;
       var dataServiceList = '{"dataItems":{"attributes":{"coupon_type":0,"receive_num":2000,"coupon_num":2001,"limit_receive":1,"limit_share":1,"coupon_name":"停车费","amount":10,"activity_begin_time":"2016-03-24 22:22:22 ","activity_end_time":"2016-03-24 22:22:22"},"objectId":"","operateType":"READ","subitems":[{"attribute":{"park_name":"结束停车场"}},{"attribute":{"park_name":"阿杜少废话"}}]}}';
        dataServiceList = JSON.parse(dataServiceList);
        // var tmp = dataServiceList.attributes;
        var tmp = dataServiceList.dataItems.attributes;
        var couponType="";
        if(tmp.coupon_type==0){
            if(dataServiceList.dataItems.subitems&&dataServiceList.dataItems.subitems.length>0){
                for(let i=0;i<dataServiceList.dataItems.subitems.length;i++){
                    couponType+=dataServiceList.dataItems.subitems[i].attribute.park_name+",";
                }
                couponType=couponType.substring(0,couponType.length-1);
            }else{
                couponType="通用";
            }
        }else{
            couponType="通用";
        }
        let percent = ((tmp.receive_num)/(tmp.coupon_num)*100).toFixed(1);
        if(percent==100.0){
            percent=99.9;
        }
        dataCount = tmp.limit_receive-tmp.limit_share;
        // if(dataCount>0){  // 限领数大于已领数
        //     this.refs.buttonMessage.innerText="领取";
        //     if(percent>50){
        //         this.refs.circle.className="circle";
        //         this.refs.right.className="percent right wth0";
        //         this.refs.buttonMessage.className="button button_over";
        //         this.refs.counp_message_li.className="counp_message_li";
        //         this.refs.num_over.className="num num_over";
        //         this.refs.overlap.className="overlap overlap_over";
        //     }
        // }else{
        //     this.refs.buttonMessage.className="button button_already";
        //     this.refs.counp_message_li.className="counp_message_already";
        //     this.refs.num_over.className="num num_already";
        //     this.refs.overlap.className="overlap overlap_already";
        //     this.refs.num_over.className="apply apply_already";
        //     this.refs.activity_time_div.className="div_already";
        //     this.refs.counp_name_div.className="div_already";
        //     this.refs.buttonMessage.innerText="已领取";
        // }
        let styleLeft = {"-webkit-transform":"rotate("+(13/5)*percent+50+"deg)"};
        var ds = (parseFloat(tmp.amount)).toFixed(2);
        ds = ds < 0.1 ? 0 : ds;            // 小于0.1的直接显示0，大于等于0.1保留一位小数
        if (ds != 0) {
            ds = ds.toString();
            if(ds.indexOf(".0")>-1){
                ds = ds.substr(0, ds.length - 3);
            }else{
                ds = ds.substr(0, ds.length - 1);
            }
        }
        return <li ref="counp_message_li">
                    <div className="counp_message_left">
                        <div className="counp_name">
                            <span>{ tmp.coupon_name }</span>
                            <span className="counp_money">{ `￥${ ds }` }</span>
                            <div ref="counp_name_div"></div>
                        </div>
                        <div className="activity_time">
                            <span>活动时间：</span>
                            <span>{ tmp.activity_begin_time }</span>
                            <span>至</span>
                            <span>{ tmp.activity_end_time }</span>
                            <div ref="activity_time_div"></div>
                        </div>
                        <div className="apply">
                            <span>适用停车场：</span>
                            <span>{ couponType }</span>
                        </div>
                    </div>
                    <div className="counp_message_right">
                        <div className="wrap">
                            <div className="circle clip-auto" ref="circle">
                                <div className="percent left" style={styleLeft}></div>
                                <div className="percent right"></div>
                            </div>
                            <div className="num" ref="num_over">
                                <span className="count">{ `${percent}%` }</span><br/>
                                <div className="button" ref="buttonMessage" data_count={tmp.limit_receive-tmp.limit_share} onClick={this.buttonOver.bind(this,tmp.coupon_id)}>领取</div>
                            </div>
                        </div>
                        <div className="overlap" ref="overlap"></div>
                    </div>
                </li>
    }

}
function refreshData() {
    console.log("refreshing");
    pageIndex=1;  //页码
    that.refresh(pageIndex);
}

function loadMoreData() {
    pageIndex++;  //页码
    that.refresh(pageIndex);
}
export { ReceiptCardList}