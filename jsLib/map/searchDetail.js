import { Component} from "react";
import JHTAJAX from "../common/util/JHTAjax";
import  JHT  from "../common/util/JHT";
import { Link } from "react-router";
import { Nothing } from  "../common/components/Nothing"
import {Loading,operateMask} from '../common/components/Loading';
import {PullDownRefresh} from "../common/JhtScroll/PullDownRefresh";
import { PullUpLoadMore,showNoMoreData } from "../common/jhtScroll/PullUpLoadMore";
var inputRecord = (localStorage.getItem("inputRecord") || "").split(",");
inputRecord = inputRecord[0]=="" ? []:inputRecord;
let pageIndex =1;
 var dataTmp = {
    overdue: []
};
let that;
let searchlat="";
let searchlng="";
let searchDetailAppType;
let searchDetailUserId;
let searchDetailClientId;
let searchDetailTel;
class SearchResult extends Component {
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList: "",
            name:""
        };
        document.title="搜索结果";
        this.jht = new JHT();
    }
    //地图，搜索周围停车场
    placeSearch(pageIndex) {
        console.log(this);
        let jht =new JHT();
        let unionid = window.USERINFO.USER.USER_ID ;
        let obj = {
            dataItems: []
        };
        let sub = {
            attributes: {
                FUNCTION_NAME: ""
            }
        };
        let subit = [];
        subit.push(sub);
        let latitude= window.USERINFO.USER.latitude;
        let longitude=window.USERINFO.USER.longitude;
        let attr = {
            attributes: {
                userid: unionid?unionid:"1",
                synch_signal: new Date().getTime() + '',
                name: this.props.location.query.name,
                beforelatitude: latitude,
                beforelongitude: longitude,
                latitude: latitude,
                longitude: longitude,
                DISTANCE: 5500000,//500米,1000米,2000米,3000米,
                // SORT_MODE: sortMode,//0:最近  1：费用最低 2:车位最多 3:最多人去
                PAGE_SIZE: 10,
                PAGE_INDEX: pageIndex
            }
        };
        obj.dataItems.push(attr);
        operateMask("show");
        JHTAJAX({
            data: {
                serviceId: "ac.map.sy_getlocationquerypark",
                dataItems: JSON.stringify(obj.dataItems)
            },
            dataType: 'json',
            type: 'post',
            success: function (data) {
                operateMask("hide");
                if (pageIndex == 1) {
                    dataTmp = {
                        overdue: []
                    };
                }
                if (data.dataitems && data.dataitems.length > 0) {
                    if ((data.dataitems.length) % 10 !== 0) {
                        showNoMoreData();
                    }
                    for (let i = 0; i < data.dataitems.length; i++) {
                        dataTmp.overdue.push(data.dataitems[i]);
                    }
                } else {
                    showNoMoreData();
                }
                this.stateObj.stateObjList = dataTmp;
                this.setState(this.stateObj);
            }.bind(this),
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _poptip("加载周围停车场失败");
            }
        });
    };
    componentDidMount() {
         searchDetailAppType=this.props.location.query.APP_TYPE;
         searchDetailUserId=this.props.location.query.USER_ID;
         searchDetailClientId=this.props.location.query.clientId;
         searchDetailTel=this.props.location.query.TEL;
        that = this;
       that.placeSearch(pageIndex);
    }
    render() {
        let dataServiceList = this.stateObj.stateObjList;
        let off = true;
        if (dataServiceList !== "" && dataServiceList.overdue && dataServiceList.overdue.length > 0) {
            dataServiceList = dataServiceList.overdue;
            off = true;
        } else {
            off = false;
        }
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97 * remK);
        let style2 = {"height": `${topDivHei}px`,"overFlow":"auto"};
        let loadDown = {"height": `${document.documentElement.clientHeight}px`};
        let styleFind = {
            "height": "100%",
            "width": "100%",
            "top": "0",
            "left": "0",
            "zIndex": "111"
        };
        let style={"display":"none"};
        let styleimg = {"marginRight":"5px"};

        return<div style={styleFind} id="searchResult">
                <Loading taskCount="1" />
                <div id="_poptip" style={style}></div>
                <PullDownRefresh element="top_ul" fn={refreshData} over="auto"/>
                <div id="top_ul" className="top_ul" style={style2}>
                    {
                        off == true ? (
                            dataServiceList.map((dataServiceList, i) => {
                                return <ul key={ `list-${ i }` } >
                                    <CostSuccess dataServiceList={dataServiceList}/>
                                </ul>
                            })
                        ) : (<div><Nothing content="亲，没有查询到周边的车场哦"/>
                            <div style={loadDown}></div>
                        </div>)
                    }
                    <PullUpLoadMore element="top_ul" fn={loadMoreData} over="auto"/>
                </div>
            </div>
    }
}
class CostSuccess extends Component{
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.jht = new JHT();
    }
    carNoPay(data){
        let jspsn_timestamp = new Date().getTime();
        let businesser_code = data.businesser_code;
        if (typeof(businesser_code) == "undefined") {
            _poptip('抱歉，该停车场没有商户编号，您不能进行缴费！');
            return;
        }else {
            localStorage.setItem('parkingId',data.id);
            localStorage.setItem('name',data.name);
            localStorage.setItem('park_code',data.park_code);
            localStorage.setItem('businesser_code',data.businesser_code);
            localStorage.setItem('queryNearbyPark',"false");
            localStorage.setItem('jspsn_timestamp',jspsn_timestamp);
            // window.location.href = CARNOPAY+"?APP_TYPE="+searchDetailAppType+"&USER_ID="+searchDetailUserId+"&clientId="+searchDetailClientId+"&TEL="+searchDetailTel;
            window.history.go(-2);
        }

    }
    carpayment(tmp){
        console.log(this.refs.park_name.innerText)
        let park_name = this.refs.park_name.innerText;
        let userId =  USERINFO.USER.USER_ID;
        let tel;
        if(window.USERINFO.USER.TEL == null || window.USERINFO.USER.TEL == undefined || window.USERINFO.USER.TEL == "null"|| window.USERINFO.USER.TEL == "undefined" ){
            tel = ""
        }else{
            tel = window.USERINFO.USER.TEL;
        }
        /*if(tmp.businesser_code && tmp.businesser_code !== ""){
            if(tmp.park_code && tmp.park_code !== ""){
                window.location.href = window.location.origin+window.location.pathname+"?USER_ID="+userId+"&APP_TYPE=WX_JTC&name="+park_name+"&businesser_code="+tmp.businesser_code+"&park_code="+tmp.park_code+"&park_id="+tmp.id+"&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

            }else{
                window.location.href = window.location.origin+window.location.pathname+"?USER_ID="+userId+"&APP_TYPE=WX_JTC&name="+park_name+"&businesser_code="+tmp.businesser_code+"&park_code="+" "+"&park_id="+tmp.id+"&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

            }
        }else{
            if(tmp.park_code && tmp.park_code !== ""){
                window.location.href = window.location.origin+window.location.pathname+"?USER_ID="+userId+"&APP_TYPE=WX_JTC&name="+park_name+"&businesser_code="+" "+"&park_code="+tmp.park_code+"&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

            }else{
                window.location.href = window.location.origin+window.location.pathname+"?USER_ID="+userId+"&APP_TYPE=WX_JTC&name="+park_name+"&businesser_code="+" "+"&park_code="+" "+"&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

            }
        }*/
        window.location.href = window.location.origin+window.location.pathname+"?USER_ID="+userId+"&APP_TYPE=WX_JTC&name="+park_name+"&businesser_code="+tmp.businesser_code+"&park_code="+tmp.park_code+"&park_id="+tmp.id+"&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

        // window.location.href = window.location.origin+window.location.pathname+"?USER_ID="+userId+"&APP_TYPE=WX_JTC&name="+park_name;
    }
    render() {
        let auto = true;
        let item = true;

        let dataServiceList = this.props.dataServiceList;
        let tmp = dataServiceList.attributes;
        tmp.lat=searchlat;
        tmp.lng=searchlng;
        let pathdata = {
            pathname: "/search/searchDetail/mapDetail",
            query: tmp
        };
        let pathdata1 = {
            pathname: "/search/searchDetail/mapMain",
            query: tmp
        };
       /* let pathdata2 = {
            pathname: "/",
            query: tmp
        };*/

      
        let emptyparkplacecount = tmp.emptyparkplacecount;
        let parkplacecount = tmp.parkplacecount;
        let fontColor ;
        let content = "";
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
        if (dataServiceList.subitems && dataServiceList.subitems.length > 0) {
            item = false;
        }
        let distan = "";
        if(parseInt(tmp.distance) > 1000){
            distan = `${(parseInt(tmp.distance) / 1000).toFixed(1)}km`;
        }else{
            distan = `${parseInt(tmp.distance).toFixed(0)}m`;
        }
        if(dataServiceList.subitems&&dataServiceList.subitems.length>0){
            item = false;
        }
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97 * remK);
        console.log(topDivHei);
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
        let style={"color":"#9adb43"};
        let styleimg = {"marginRight":"5px","marginTop":"1px","height":"15px"};
        let imgPath = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/common/image/detailSearch.png";
        let el;
        if(window.location.href.indexOf("carNoPay")>-1){
            el=<div id="maskOfProgressImage">
                <a  onClick={this.carNoPay.bind(this,tmp)} className="main_messege">
                    <div className="park_name">{this.jht.getStrSub(tmp.name)}</div>
                    <div className="address">{tmp.address}</div>
                    <ul className="park_messege">
                    <span className="parking_log">
                        <div className="bit"></div>
                        <em style={fontColor} className="first_em">{content}</em>/<em>{tmp.parkplacecount}</em>
                    </span>
                        <span className="distance">
                        <em>{distan}</em>
                    </span>
                    </ul>
                </a>
                <div>
                    <div className="countSpace">
                        <em>{"￥"+tmp.park_qh}</em>/首小时
                    </div>
                    <div className="messageLook">
                        <Link to={pathdata} style={style}><img style={styleimg} src={imgPath}/><span>查看详情</span></Link>
                    </div>
                </div>
            </div>
        }else  if(window.location.href.indexOf("carPayment")>-1){
            el=<div id="maskOfProgressImage"  style = {{"fontSize":"13px"}}>
                <div className="main_messege" onClick = {this.carpayment.bind(this,tmp)} >
                    <div className="park_name"  ref = "park_name">{this.jht.getStrSub(tmp.name)}</div>
                    <div className="address">{tmp.address}</div>
                    <ul className="park_messege">
                    <span className="parking_log">
                        <div className="bit"></div>
                        <em style={fontColor} className="first_em">{content}</em>/<em>{tmp.parkplacecount}</em>
                    </span>
                        <span className="distance">
                        <em>{distan}</em>
                    </span>
                    </ul>
                </div>
                <div>
                    <div className="countSpace">
                        <em>{"￥"+tmp.park_qh}</em>/首小时
                    </div>
                    <div className="messageLook">
                        <Link to={pathdata}  style={style}><img style={styleimg} src={imgPath}/><span>查看详情</span></Link>
                    </div>
                </div>

            </div>
        }
        else{
            el=<div id="maskOfProgressImage">
                <Link to = {pathdata1} className="main_messege">
                    <div className="park_name">{this.
                    jht.getStrSub(tmp.name)}</div>
                    <div className="address">{tmp.address}</div>
                    <ul className="park_messege">
                    <span className="parking_log">
                        <div className="bit"></div>
                        <em style={fontColor} className="first_em">{content}</em>/<em>{tmp.parkplacecount}</em>
                    </span>
                        <span className="distance">
                        <em>{distan}</em>
                    </span>
                    </ul>
                </Link>
                <div>
                    <div className="countSpace">
                        <em>{"￥"+tmp.park_qh}</em>/首小时
                    </div>
                    <div className="messageLook">
                        <Link to={pathdata}  style={style}><img style={styleimg} src="../../../src/common/image/detailSearch.png"/><span>查看详情</span></Link>
                    </div>
                </div>
            </div>
        }
        return el
    }
}
function refreshData() {
    console.log("refreshing");
    pageIndex = 1;  //页码
    that.placeSearch(pageIndex);
}
function loadMoreData() {
    pageIndex++;  //页码
    that.placeSearch(pageIndex);
}
function _poptip(mess) {
    let pop = document.getElementById("_poptip");
    pop.html(mess);
    pop.fadeIn(400, function() {
        setTimeout(function() {
            pop.fadeOut('slow');
        }, 1200);
    });
}
export { SearchResult };
