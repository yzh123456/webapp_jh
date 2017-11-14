/**
 * Created by yqx on 2016/12/7.
 */
import {Component, Children} from "react";
import {render} from "react-dom";
import {Link} from "react-router";
import JHTAJAX from "../common/util/JHTAjax";
import {Nothing} from "../common/components/Nothing";
import {operateMask} from "../common/components/Loading";
import {PullDownRefresh} from "../common/JhtScroll/PullDownRefresh";
class CouponlistCategory extends Component{
    constructor(props){
        super(props);
        this.stateObj = {
            couponList : "",
            couponlist_category : sessionStorage.getItem("couponlist_category") || "noUse"
        };
        this.state = this.stateObj;
        document.title = "我的优惠券";
    }
    componentWillMount(){
        //const url = 'http://weixin.jslife.com.cn/jspsn/parkApp/queryCoupon.servlet';  oUjGnjl9WS9FBL2pA7faM4SpRXy0  oUjGnjvcWBRLWVei_kdwZAiUBd5g  okhYWw6-Aw2zCtp3ok3k50PYw9MA
        operateMask('show');
        this.refresh();
    }
    refresh(){
        let obj = {
            serviceId:"ac.coupon.sy_getdrawgivequeryinfo",
            dataItems:[],
        };
        //AppBridge.baseData(function (data) {
            //window.USERINFO = data || "";
            let dataItemsattr = {
                attributes:{
                    tel:`${ USERINFO.USER.TEL }`,
                    userid:`${ USERINFO.USER.USER_ID }`
                }
            };
            obj.dataItems.push(dataItemsattr);
            JHTAJAX( {
                data: {
                    serviceId:obj.serviceId,
                    dataItems:obj.dataItems
                },
                timeOut:10000,
                type:'post',
                dataType:'json',
                success:function(data){
                    if (data.dataitems != null && data.dataitems.length > 0) {
                        this.stateObj.couponList = [];
                        this.stateObj.couponList = getCouponListByType(data.dataitems);
                        this.setState(this.stateObj);
                    }
                    operateMask('hide');
                }.bind(this),
                complete:function(data){
                    operateMask('hide');
                },
                error:function(error){
                    console.log(error);
                }
            });
        //}.bind(this),true);
    }
    clickHandler(props){
        /*AppBridge.forJS({
            "a":120,
            "b":""
        },function (data) {
            alert(data);
        });*/
        if(this.stateObj.couponlist_category != props.target.parentElement.type){
            sessionStorage.clear();
            sessionStorage.setItem("couponlist_category",props.target.parentElement.type);
            this.stateObj.couponlist_category = props.target.parentElement.type;
            this.setState(this.stateObj);
        }else{
            return;
        }


    }
    render() {
        let couponList = [];
        if(this.stateObj.couponlist_category == "noUse"){
            couponList = this.stateObj.couponList.noUse;
        }else if(this.stateObj.couponlist_category == "overdue"){
            couponList = this.stateObj.couponList.overdue;
        }else if(this.stateObj.couponlist_category == "used"){
            couponList = this.stateObj.couponList.used;
        }
        return (
            <section style={{"position":"relative"}}>
                <ul id="couponlist_category">
                    <li id="couponlist_category_nouse" type="noUse" onClick={ this.clickHandler.bind(this) } className={ this.stateObj.couponlist_category == "noUse" ?"selected" : "" }>
                        <div className="title f30">未使用(<em>{ (this.stateObj.couponList && this.stateObj.couponList.noUse) ? this.stateObj.couponList.noUse.length : 0 }</em>)</div>
                    </li>
                        <li id="couponlist_category_overtime" type="overdue" onClick={ this.clickHandler.bind(this) } className={ this.stateObj.couponlist_category == "overdue" ?"selected" : "" } >
                        <div className="title f30">已过期(<em>{ (this.stateObj.couponList && this.stateObj.couponList.overdue) ? this.stateObj.couponList.overdue.length : 0 }</em>)</div>
                    </li>
                    <li id="couponlist_category_alluse" type="used" onClick={ this.clickHandler.bind(this) } className={ this.stateObj.couponlist_category == "used" ?"selected" : "" }>
                        <div className="title f30">已使用(<em>{ (this.stateObj.couponList && this.stateObj.couponList.used) ? this.stateObj.couponList.used.length : 0 }</em>)</div>
                    </li>
                </ul>
                <CouponList ref="couponList" refresh={ this.refresh.bind(this) } couponList = { couponList } couponlistCategory = { this.stateObj.couponlist_category } />
            </section>
        )
    }
}
class CouponList extends Component{
    constructor(props,obj){
        super(props);
        this.state = {
            qrcodeShow : false
        };
        this.obj = obj;
    }
    /*componentDidMount(){
        alert(typeof fetch);
    }*/
    clickHandler(){

    }
     /*componentDidUpdate(){
        let jhtScroll = new JhtScroll();
        //jhtScroll.initScroll(document.querySelector("#coupon_list_ul"),"");
        //jhtScroll.initScroll(this.refs.couponList,"");
        jhtScroll.initScroll(this.refs.couponList,"");

        jhtScroll.onScroll("pullDown",function () {
            console.log("下拉");

        });
        jhtScroll.onScroll("pullUp",function () {
            console.log("shang拉");

        });
        jhtScroll.startScroll();
    }*/
/*<PullUpLoadMore  element="coupon_list_ul" fn={ function () {
    console.log(110);
} } />

*/
    render() {
        let couponList = this.props.couponList;
        let content =  "亲，还没有可用的优惠券哦！";
         if(this.props.couponlistCategory == "used" ){
             content =  "亲，还没有使用优惠券的记录哦！";
         }else if(this.props.couponlistCategory == "overdue"){
             content =  "亲，您没有过期的优惠券哦！";
         }
        let el = "";
// <PullDownRefresh element="coupon_list_ul" />
        if( couponList && couponList.length > 0 && this.props.couponlistCategory == "noUse"){
           el =  <ul id="coupon_list_ul" ref="couponList" className="coupon_list_ul">
               <PullDownRefresh  element="body" fn={ this.props.refresh } over="auto" />
               {
                   couponList.map((item ,i)=>{
                       let pathdata = {
                           pathname : `/detail`,
                           query : { couponlistCategory : this.props.couponlistCategory },
                           state: item || {}
                       };
                       let textColor = (item.attributes.coupon_color && item.attributes.coupon_color != "" ) ? { "color": item.attributes.coupon_color }: {};
                       return  <Link to = { pathdata } key={ item.attributes.id }  >
                           <li  className="coupon_park" key={ item.attributes.id }  style={{ "display": "list-item" }}>
                                   <div className="backgroundUpImg"></div>
                                   <i className="qrcode_icon" ></i>
                                   <div className="couponName f32" style={ textColor }>{ couponStatus(item) }</div>
                                   <div className="couponNum f28" style={ textColor } > { item.attributes.coupon_num || "" }</div>
                                   <div className="couponValitime f28" style={ textColor } >有效期至{ (item.attributes.draw_end_time || item.attributes.stop_time).substring(0,10) }</div>
                                    <div className="backgroundDownImg" ></div>
                                   <div className="couponParkname f28" style={ textColor } >{ item.attributes.couponname || "" }</div>
                                   <span className="couponMany" style={ textColor } >{ coupon_money(item) }</span>
                           </li>
                       </Link>
                   })
               }
           </ul>
        }else if( couponList && couponList.length > 0 && this.props.couponlist_category != "noUse" ){
            el = <ul id="coupon_list_ul" ref="couponList" className="coupon_list_ul" >
                <PullDownRefresh element="body" fn={this.refresh} over="auto" />
                {
                    couponList.map((item ,i)=>{
                        let pathdata = {
                            pathname : `/detail`,
                            query : { couponlistCategory : this.props.couponlistCategory },
                            state: item || {}
                        };
                        return  <Link to = { pathdata } key={ item.attributes.id }  >
                            <li  className="coupon_park_gray" key={ item.attributes.id }  style={{ "display": "list-item" }}>
                                <div className="backgroundUpImgGray" ></div>
                                <div className="couponName f32">{ couponStatus(item) }</div>
                                <div className="couponNum f28"> { item.attributes.coupon_num || "" }</div>
                                <div className="couponValitime f28">有效期至{ (item.attributes.draw_end_time || item.attributes.stop_time).substring(0,10) }</div>
                                <div className="backgroundDownImgGray" ></div>
                                <div className="couponParknameGray f28">{ item.attributes.couponname || "" }</div>
                                <span className="couponMany couponManyGray" >{ coupon_money(item) }</span>
                            </li>
                        </Link>
                    })
                }
            </ul>
        }else {
            el = <Nothing ref="couponList" content = { content } />;
        }
        return el
    }
}
/*
处理卡券金额/类型
 */
function coupon_money(data) {
    let coupon_money = "";
    switch (data.attributes.mode) {
        case 0: // 金额
            coupon_money = `¥${(data.attributes.coupon_money?data.attributes.coupon_money:0).toFixed(1)}`;
            break;
        case 1: // 时间
            coupon_money = `${(data.attributes.coupon_money?data.attributes.coupon_money:0).toFixed(0)}小时`;
            break;
        default:
            coupon_money = "全免";
            break;
    }
    return coupon_money;
}
/*
处理卡券类型
 */
function couponStatus(data) {
    var coupon_status = "";
    /*if(data.attributes.coupon_status == 0){
        coupon_status = "未开始";
    }else if(data.attributes.coupon_status == 1){
        coupon_status = "";
    }else if(data.attributes.coupon_status == 2){
        coupon_status = "卡券冻结";
    }else if(data.attributes.coupon_status == 3){
        coupon_status = "卡券终止";
    }else if(data.attributes.coupon_status == 9){
        coupon_status = "策略冻结";
    }
    if(data.attributes.status == 1){
        coupon_status = "已使用";
    }else if(data.attributes.status == 0 && data.attributes.coupon_status == 1 && dateStrToStamp(data.attributes.stop_time)+"000" < new Date().getTime()){
        coupon_status = "已过期";
    }*/
    switch (data.attributes.strategytype) {
        case 'GOODS': // 商品消费优惠券
            coupon_status = "商品消费优惠券";
            break;
        case 'PARK': // 停车优惠券
            coupon_status = "停车优惠券";
            break;
        case 'COMMON': // 通用优惠券
            coupon_status = "通用优惠券";
            break;
        default: // 其他优惠券
            coupon_status = "其他优惠券";
            break;
    }
    return coupon_status;
}
/*
卡券数据分类
 */
function getCouponListByType(data){
    let dataTmp = {
        noUse:[],
        overdue:[],
        used:[]
    };
    if(typeof Array.from === "function")
        data = Array.from(data);
    data.forEach((data)=> {
        if(data.attributes.status == 1 || data.attributes.status == 2 ){
            //已使用
            dataTmp.used.push(data);
        }else if(data.attributes.status == 0 && data.attributes.coupon_status == 1
            && dateStrToStamp(data.attributes.draw_end_time || data.attributes.stop_time)+"000" > new Date().getTime()){
            //未使用;
            dataTmp.noUse.push(data);
        }else if(data.attributes.status == 0 && dateStrToStamp(data.attributes.draw_end_time || data.attributes.stop_time)+"000" < new Date().getTime()
            || data.attributes.coupon_status > 1  ){
            //"已过期";
            dataTmp.overdue.push(data);
        }
    });
    return dataTmp;
}
//日期时间转为时间戳
function dateStrToStamp(dateStr){
    var newstr = dateStr.replace(/-/g,'/');
    var date =  new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}
export { CouponlistCategory,CouponList,coupon_money }