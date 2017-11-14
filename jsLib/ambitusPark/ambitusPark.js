import { Component,createClass} from "react";
import JHTAJAX from "../common/util/JHTAjax";
import { Nothing } from  "../common/components/Nothing"
import {Loading,operateMask} from '../common/components/Loading';
import { PullUpLoadMore,showNoMoreData } from "../common/jhtScroll/PullUpLoadMore";
import { Link } from "react-router";
import JHT from "../common/util/JHT";
import {DownloadApp} from "../downloadApp/DownloadApp";
import Translate from "../common/util/Translate";
import init from "../common/Common"
new init();
let latitude="";
let longitude = "";
let dataTmp = {};
let that = "";
let pageIndex =1;
let key = "";
let sortMode = 0;
let distance = 5500000;
let opened="";
let unionid="1";
// 创建AmbitusPark组件
class AmbitusPark extends Component{
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:"",
            param:"",
            checked: true,
            name:""
        };
        this.state = this.stateObj;
        document.title = "找车场";
        this.jht = new JHT();
        this.translate = new Translate();
        sortMode = sessionStorage.getItem("sortMode")?sessionStorage.getItem("sortMode"):0;
        distance = sessionStorage.getItem("distance")?sessionStorage.getItem("distance"):5500000;
        opened=sessionStorage.getItem("opened")?sessionStorage.getItem("opened"):"";
    }
    componentDidMount(){
        that = this;
        //注册条件选择的点击事件
        document.querySelector(".around1").addEventListener("click",this.around1);
        document.querySelector(".around2").addEventListener("click",this.around2);
        document.querySelector(".around3").addEventListener("click",this.around3);
        that.parkList(pageIndex);
    }
    around1(e){
        operateMask("show");
        distance = e.target.innerText;
        $(e.target).addClass("active").siblings().removeClass("active");
        sessionStorage.setItem("around1",distance);
        that.refs.titil_first_li.children[0].innerHTML=distance;
        that.refs.titil_first_li_img.attributes.src.nodeValue="../images/down.png";
        that.refs.around1.className="around around1 hide";
        that.refs.zhegai.className="_zhegai hide";
        if(distance =="附近(智能范围)"){
            distance=3000;
            that.refs.titil_first_li.children[0].innerHTML="附近";
            sessionStorage.setItem("around1","附近");
            sessionStorage.setItem("distance","3000");
        }else if(distance == "500米"){
            distance=500;
            sessionStorage.setItem("distance","500");
        }
        else if(distance == "1000米"){
            distance=1000;
            sessionStorage.setItem("distance","1000");
        }
        else if(distance == "2000米"){
            distance=2000;
            sessionStorage.setItem("distance","2000");
        }else if(distance == "3000米"){
            distance=3000;
            sessionStorage.setItem("distance","3000");
        }
        pageIndex=1;
        that.parkList(pageIndex);
    }
    around2(e){
        operateMask("show");
        opened = e.target.innerText;
        $(e.target).addClass("active").siblings().removeClass("active");
        sessionStorage.setItem("around2",opened);
        that.refs.around2.className="around around2 hide";
        that.refs.zhegai.className="_zhegai hide";
        that.refs.titil_second_li_img.attributes.src.nodeValue="../images/down.png";
        if(opened =="已开通(全部功能)"){
            opened="";
            that.refs.titil_second_li.children[0].innerHTML="已开通";
            sessionStorage.setItem("around2","已开通");
        }else {
            that.refs.titil_second_li.children[0].innerHTML=opened;
            sessionStorage.setItem("opened",opened);
        }
        pageIndex = 1;
        that.parkList(pageIndex);
    }
    around3(e){
        operateMask("show");
        sortMode = e.target.innerText;
        $(e.target).addClass("active").siblings().removeClass("active");
        sessionStorage.setItem("around3",sortMode);
        that.refs.titil_third_li.children[0].innerHTML=sortMode;
        that.refs.titil_third_li_img.attributes.src.nodeValue="../images/down.png";
        that.refs.around3.className="around around3 hide";
        that.refs.zhegai.className="_zhegai hide";
        if(sortMode =="智能排序"){
            sortMode=0;
            sessionStorage.setItem("sortMode",0);
        }else if(sortMode == "离我最近"){
            sortMode=0;
            sessionStorage.setItem("sortMode",0);
        }
        else if(sortMode == "费用最低"){
            sortMode=1;
            sessionStorage.setItem("sortMode",1);
        }
        else if(sortMode == "空车位多"){
            sortMode=2;
            sessionStorage.setItem("sortMode",2);
        }else if(sortMode == "最多人去"){
            sortMode=3;
            sessionStorage.setItem("sortMode",3);
        }
        pageIndex = 1;
        that.parkList(pageIndex);
    }
    //地图，搜索周围停车场
    parkList (pageIndex) {
        let searchName="";
        if(this.props.location.query&&this.props.location.query.name){
            searchName = this.props.location.query.name;
        }
          if(USERINFO&&USERINFO.USER&&USERINFO.USER.USER_ID){
              unionid =  USERINFO.USER.USER_ID;
          }else if(this.jht.urlParams().USER_ID){
              unionid = this.jht.urlParams().USER_ID || "1";
          }
            let obj = {
                dataItems: []
            };
            let sub ={
                attributes:{
                    FUNCTION_NAME:opened
                }
            };
            let subit = [];
            subit.push(sub);
            latitude= USERINFO.USER.latitude;
            longitude=USERINFO.USER.longitude;
            let attr = {
                attributes: {
                    userid:unionid,
                    synch_signal: new Date().getTime() + '',
                    name:searchName,
                    beforelatitude: latitude,
                    beforelongitude:longitude,
                    latitude:latitude,
                    longitude: longitude,
                    DISTANCE:distance,//500米,1000米,2000米,3000米,
                    SORT_MODE:sortMode,//0:最近  1：费用最低 2:车位最多 3:最多人去
                    PAGE_SIZE:10,
                    PAGE_INDEX:pageIndex
                },
                subItems:subit
            };
            obj.dataItems.push(attr);
            JHTAJAX({
                data: {
                    serviceId: "ac.map.sy_getlocationquerypark",
                    dataItems: JSON.stringify(obj.dataItems)
                },
                dataType: 'json',
                type: 'post',
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
                        for (let i = 0; i < data.dataitems.length; i++) {
                            dataTmp.overdue.push(data.dataitems[i]);
                        }
                    }else{
                        showNoMoreData();
                    }
                    this.stateObj.stateObjList = dataTmp;
                    this.setState(this.stateObj);
                }.bind(this),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    poptip("加载周围停车场失败");
                }
            });
    };
    qwer() {
        this.setState({
            param: "",
            checked: !this.state.checked
        });
    }
    titilFirstLi(){
        if( this.refs.around1.className =="around around1"){
            this.refs.around1.className="around around1 hide";
            this.refs.titil_first_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.zhegai.className="_zhegai hide";
        }else {
            this.refs.around1.className="around around1";
            this.refs.titil_first_li_img.attributes.src.nodeValue="../images/up.png";
            this.refs.titil_second_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.titil_third_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.zhegai.className="_zhegai";
        }
        this.refs.around2.className="around around2 hide";
        this.refs.around3.className="around around3 hide";
    }
    titilSecondLi(){
        if( this.refs.around2.className =="around around2"){
            this.refs.around2.className="around around2 hide";
            this.refs.titil_second_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.zhegai.className="_zhegai hide";
        }else {
            this.refs.around2.className="around around2";
            this.refs.titil_second_li_img.attributes.src.nodeValue="../images/up.png";
            this.refs.titil_first_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.titil_third_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.zhegai.className="_zhegai";
        }
        this.refs.around1.className="around around1 hide";
        this.refs.around3.className="around around3 hide";
    }
    titilThirdLi(){
        if( this.refs.around3.className =="around around3"){
            this.refs.around3.className="around around3 hide";
            this.refs.titil_third_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.zhegai.className="_zhegai hide";
        }else {
            this.refs.around3.className="around around3";
            this.refs.titil_third_li_img.attributes.src.nodeValue="../images/up.png";
            this.refs.titil_second_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.titil_first_li_img.attributes.src.nodeValue="../images/down.png";
            this.refs.zhegai.className="_zhegai";
        }
        this.refs.around1.className="around around1 hide";
        this.refs.around2.className="around around2 hide";
    }
    overMap(){  // 点击地图
        window.location.href = window.location.href.split("webapp")[0] + "webapp/src/map/html/map.html"+window.location.search;
    }
    zheGai(){
        this.refs.zhegai.className="_zhegai hide";
        this.refs.titil_first_li_img.attributes.src.nodeValue="../images/down.png";
        this.refs.titil_second_li_img.attributes.src.nodeValue="../images/down.png";
        this.refs.titil_third_li_img.attributes.src.nodeValue="../images/down.png";
        this.refs.around1.className="around around1 hide";
        this.refs.around2.className="around around1 hide";
        this.refs.around3.className="around around1 hide";
    }
    componentWillUnmount(){
        pageIndex = 1;
        dataTmp = {
            overdue:[]
        };
    }
    render() {
        let active = sessionStorage.getItem("around1")?sessionStorage.getItem("around1"):"附近";
        let opened = sessionStorage.getItem("around2")?sessionStorage.getItem("around2"):"已开通";
        let sortMode = sessionStorage.getItem("around3")?sessionStorage.getItem("around3"):"智能排序";
        if(this.props.location.query&&this.props.location.query.name&&this.refs.keyword){
            this.refs.keyword.value=this.props.location.query.name;
        }
        let dataServiceList = this.state.stateObjList;
        let auto = true;
        if (dataServiceList !=="" &&dataServiceList.overdue&& dataServiceList.overdue.length > 0) {
            dataServiceList = dataServiceList.overdue;
            auto = true;
        }else{
            auto = false;
        }
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97*remK-45);
        let style2 = {"height":`${topDivHei}px`,"marginTop":"115px"};
        let loadDown = {"height":`${document.documentElement.clientHeight}px`};
        let fn="false";
        let pathdata1 = {
            pathname: "/search",
            query: {
                text: "停车场",
                fn:fn,
                from:"ambitusPark"
            }
        }
        return (
            <div>
                <Loading taskCount="1" />
                <DownloadApp/>
                <div className="search_counp">
                    <div  className="search_counp_div">
                        <Link  to={pathdata1}>
                            <input type="text" id="keyword" ref="keyword" placeholder="停车场" onClick={this.qwer.bind(this)}/>
                            {/*<Search message="停车场" copemlt={this.state.checked} handel = { this.handel.bind(this)}/>*/}
                        </Link>
                        <div onClick={this.overMap.bind(this)} className="search_buttom"></div>
                    </div>
                    <div className="titil_div">
                        <ul className="titil_ul">
                            <li className="titil_first_li" ref="titil_first_li" onClick={this.titilFirstLi.bind(this)}>
                                <span>{ active }</span>
                                <img ref="titil_first_li_img" src="../images/down.png" />
                            </li>
                            <li className="titil_second_li" ref="titil_second_li" onClick={this.titilSecondLi.bind(this)}>
                                <span>{opened}</span>
                                <img ref="titil_second_li_img" src="../images/down.png" />
                            </li>
                            <li className="titil_third_li" ref="titil_third_li" onClick={this.titilThirdLi.bind(this)}>
                                <span>{sortMode}</span>
                                <img ref="titil_third_li_img" src="../images/down.png" />
                            </li>
                        </ul>
                    </div>
                </div>

                <ul className="around around1 hide" ref="around1">
                    <li className={active=="附近"?"active":""}>附近(智能范围)</li>
                    <li className={active=="500米"?"active":""}>500米</li>
                    <li className={active=="1000米"?"active":""}>1000米</li>
                    <li className={active=="2000米"?"active":""}>2000米</li>
                    <li className={active=="3000米"?"active":""}>3000米</li>
                </ul>
                <ul className="around around2 hide" ref="around2">
                    <li className={opened=="已开通"?"active":""}>已开通(全部功能)</li>
                    <li className={opened=="手机缴费"?"active":""}>手机缴费</li>
                    <li className={opened=="手机找车"?"active":""}>手机找车</li>
                    <li className={opened=="订车位"?"active":""}>订车位</li>
                    <li className={opened=="车位分享"?"active":""}>租车位</li>
                    <li className={opened=="车辆防盗"?"active":""}>车辆防盗</li>
                    <li className={opened=="自动缴费"?"active":""}>自动缴费</li>
                </ul>
                <ul className="around around3 hide" ref="around3">
                    <li className={sortMode=="智能排序"?"active":""}>智能排序</li>
                    <li className={sortMode=="离我最近"?"active":""}>离我最近</li>
                    <li className={sortMode=="费用最低"?"active":""}>费用最低</li>
                    <li className={sortMode=="空车位多"?"active":""}>空车位多</li>
                    <li className={sortMode=="最多人去"?"active":""}>最多人去</li>
                </ul>
                <div>
                <div id="top_ul" className="top_ul"  style={style2}>
                    <div className="_zhegai hide" ref="zhegai" onClick={this.zheGai.bind(this)}></div>
                    {
                        auto==true?(
                            dataServiceList.map((dataServiceList, i)=> {
                                return <ul key={ `list-${ i }` }>
                                    <CostSuccess dataServiceList={dataServiceList}/>
                                </ul>
                            })
                        ):(<div><Nothing content="亲，没有查询到周边的车场哦" /><div style={loadDown}></div></div>)
                    }
                </div>
                <PullUpLoadMore element="top_ul" fn={loadMoreData} over="auto" />
                </div>
            </div>
        )
    }
}
class CostSuccess extends Component{    // 列表渲染
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
       document.title="周边车场";
        this.jht = new JHT();
        this.translate = new Translate();
    }
    PayBookPark(data){ //室内导航
        let isParkNavigation = true;
        if(data && data.length>0){
            for(let i=0;i<data.length;i++){
                if(data[i].attributes.function_name=="手机找车"){
                    isParkNavigation = true;
                    break;
                }else {
                    isParkNavigation = false;
                }
            }
        }
        if(isParkNavigation == true){
            window.location.href = window.location.href.split("webapp")[0] + "other/parkNavigation/index.htm?clientId="+clientId+"&parkingId="+parkId+"&name="+name;
        }
    }
    render(){
        let auto = true;
        let item = true;
        let dataServiceList = this.props.dataServiceList;
        let tmp = dataServiceList.attributes;
        tmp.lat = latitude;
        tmp.lng = longitude;
        let emptyparkplacecount = tmp.emptyparkplacecount;
        let parkplacecount = tmp.parkplacecount;
        let fontColor = {};
        let content = 0;
        let pathdataMapDetail = {
            pathname: "/mapDetail",
            query: tmp
        };

        let pathdata = {
            pathname: "/bookingorder",
            query: {
                text: JSON.stringify(tmp)
            }
        };
        if(emptyparkplacecount>parkplacecount/2){
            content = emptyparkplacecount;
            fontColor={"color":"#80c02b"};
        }else{
            if(emptyparkplacecount>10){
                content = emptyparkplacecount;
                fontColor={"color":"#FD7B12"};
            }else if(emptyparkplacecount<=10&&emptyparkplacecount>0){
                content = emptyparkplacecount;
                fontColor={"color":"#ff0000"};
            }else if(emptyparkplacecount==0||emptyparkplacecount<-1){
                content=0;
                fontColor={"color":"#545454"};
            }else if(emptyparkplacecount==-1){
                content = parkplacecount;
                fontColor={"color":"#80c02b"};
            }
        }
        let distan = "";
        let largely_cease="";
        if(parseInt(tmp.distance) > 1000){
            distan = `${(parseInt(tmp.distance) / 1000).toFixed(1)}km`;
        }else{
            distan = `${parseInt(tmp.distance).toFixed(0)}m`;
        }
        if( parseInt(tmp.largely_cease)>10000){
            largely_cease =`${(parseInt(tmp.largely_cease) / 10000).toFixed(1)}万`;
        }else{
            largely_cease = `${parseInt(tmp.largely_cease).toFixed(0)}`;
        }
        if(dataServiceList.subitems&&dataServiceList.subitems.length>0){
            item = false;
        }
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97*remK);
        //金额显示只保留一位小数，如果为0则显示0  （返回的金额单位为分）
        let ds = (parseFloat(tmp.actualfee)).toFixed(2);
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
        let iconBooking = {"opacity":"0.3"};
        let bookingLink = <li className="booking"  style={ iconBooking }><img src="../images/booking.png"/><span>订车位</span></li>;
        let isPayBookPark = true;
        if(dataServiceList&&dataServiceList.subitems&&dataServiceList.subitems.length>0){
            for(let i=0;i<dataServiceList.subitems.length;i++){
                if(dataServiceList.subitems[i].attributes.function_name=="订车位"&&unionid!="1"){
                    bookingLink = <Link  to={pathdata} className="booking"><img src="../images/booking.png"/><span>订车位</span></Link>
                }
            }
        }
        let hide = {"display":"none"};
        let city="起点";
        let endPoint = this.translate.gcj02tobd09(tmp.longitude,tmp.latitude);  //终点,高德转百度
        let startPoint = this.translate.gcj02tobd09(window.USERINFO.USER.longitude,window.USERINFO.USER.latitude);  //终点,高德转百度
        let gotohere = 'https://api.map.baidu.com/direction?origin=latlng:'+startPoint[1]+","+startPoint[0]+"|name:"+city+"&destination=latlng:"+endPoint[1]+","+endPoint[0]+'|name:'+tmp.name+'&mode=driving&region=中国&output=html&src=yourCompanyName|yourAppName';
        let _poptip = {"display":"none"};
        ds = ds;
        return <div id="maskOfProgressImage">
            <div id="_poptip" style={_poptip}></div>
            <Link to={pathdataMapDetail} className="main_messege">
                <div className="park_name">{this.jht.getStrSub(tmp.name)}</div>
                <div className="address">{this.jht.getStrSub(tmp.address)}</div>
                <ul className="park_messege">
                    <li className="parking_log">
                        <div className="bit"></div>
                        <em className="first_em" style={fontColor}>{content}</em>/<em>{tmp.parkplacecount}</em>
                    </li>
                    <li className="price">
                        <em>{"￥"+tmp.park_qh}</em>/首小时
                    </li>
                    <li className="distance">
                        <em>{distan}</em>
                    </li>
                </ul>
            </Link>
            <Link to={pathdataMapDetail} className="parked">
                <div className="park_count">{largely_cease}</div>
                <div className="parked_word">位车友停过</div>
            </Link>
            <div className="functions">
                {item==false?( dataServiceList.subitems.map((dataServiceList, i) => {
                        return <div className="effect" key={ `list-${ i }` }>
                            <SubitemSuccess dataServiceList={dataServiceList}/>
                        </div>
                    })
                ):(<div className="effect"></div>)}
            </div>
            <div className="footer_parent">
                <ul className="footer_effect">
                    {bookingLink}
                    <a href={gotohere}  target="_blank" className="go_to_here" >
                        <img src="../images/ambitu.png"/>
                        <span>去这里</span>
                    </a>
                </ul>
            </div>
        </div>
    }
}
class SubitemSuccess extends Component{
    render(){
        let dataServiceList = this.props.dataServiceList;
        let tmp = dataServiceList.attributes;
        let classname="";
        if(tmp.function_name=="手机缴费"){
            classname="mobile_payment";
        }else if(tmp.function_name=="车辆防盗"){
            classname="park_precautions";
        }else if(tmp.function_name=="车位分享"){
            classname="park_share";
        }else if(tmp.function_name=="手机找车"){
            classname="find_car";
        }else if(tmp.function_name=="订车位"){
            classname="booking_car";
        }else if(tmp.function_name=="自动缴费"){
            classname="self_payment";
        }else if(tmp.function_name=="租车位"){
            classname="fca_payment";
        }
        return(
            <div className={classname}>{tmp.function_name}</div>
        )
    }
}
function loadMoreData() {
    pageIndex++;  //页码
    that.parkList(pageIndex);
}
function poptip(mess) {
    $("#_poptip").html(mess);
    $("#_poptip").fadeIn(400, function() {
        setTimeout(function() {
            $("#_poptip").fadeOut('slow');
        }, 1200);
    });
};
export { AmbitusPark };