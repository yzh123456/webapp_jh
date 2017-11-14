import { Component} from "react";
import JHTAJAX from "../common/util/JHTAjax";
import  JHT  from "../common/util/JHT";
import {CARNOPAY,GETINVOICE} from "../common/util/Enum";
import Translate from "../common/util/Translate";
import { Loading,operateMask } from "../common/components/Loading";
import $ from "../common/jquery-3.1.1.min";
let parkId; // 车场ID
let clientId;
let parkClicked;
let that;
let unionid="1";
let mapDetailDataTmp;
let mySwiper;
let link1;
let link2;
let link3;
let link4;
let link5;
let name;
let id;
let distance;
let largely_cease;
mapDetailDataTmp = {
    overdue:[]
};
/*
* 车场详情组件
* */
class MapDetail extends Component{
    constructor(props){
        super(props);
        this.stateObj = {
            stateObjList : ""
        };
        this.translate = new Translate();
        this.jht = new JHT();
        document.title = "停车场详情";
        link1 = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/map/images/icon_focuson-38.png";
        link2 = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/map/images/icon_focuson2-38.png";
        link3 = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/map/images/searchCar.png";
        link4 = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/map/images/getInvoice.png";
        link5 = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/map/images/payOrder.png";
        let link = document.createElement("Link");
        link.href=window.location.href.split("/src/")[0]+"/src/map/css/amap.css";
        link.rel="stylesheet";
        link.type="text/css";
        document.querySelector("head").appendChild(link);
        this.state = this.stateObj;
    }
    componentDidMount(){
        let query={};
        let fromAtt;
        if(window.location.href.indexOf("attentionList.html")>-1){
            fromAtt = JSON.parse(this.props.location.query.data);
            query.id = fromAtt.parkid;
        }else{
            query = this.props.location.query;
        }
        that =this;
        unionid = window.USERINFO.USER.USER_ID?window.USERINFO.USER.USER_ID:"1" ;
        id=query.id;
        largely_cease=query.largely_cease;
        distance=query.distance;
        clientId = window.USERINFO.USER.clientId ;
        that.serchMapDetail();
        }
    serchMapDetail(){
        let obj = {
            dataItems:[
            ]
        };
        let attr = {
            attributes:{
                userid:unionid,
                id:id,
                beforelongitude:window.USERINFO.USER.longitude, //当前经度
                beforelatitude:window.USERINFO.USER.latitude,   //当前纬度
            }
        };
        obj.dataItems.push(attr);
        operateMask("show");
        JHTAJAX({
            data: {
                serviceId:"ac.park.sy_getparkinfo",
                dataItems:JSON.stringify(obj.dataItems)
            },
            dataType : 'json',
            type:'post',
            success: function (data) {
                operateMask("hide");
                mapDetailDataTmp = {
                    overdue:[]
                };
                if (data.resultcode == "0" && data.dataitems != null && data.dataitems.length > 0) {
                    parkClicked = data.dataitems[0].attributes;
                    parkId = parkClicked.id;
                    sessionStorage.setItem("parkId",parkId);
                    if (parkClicked.isattention == 0) {
                        that.refs.clickFollow.attributes.src.nodeValue=link1;
                        that.refs.clickFollowSpan.innerText="收藏";
                    }
                    if (parkClicked.isattention == 1) {
                        that.refs.clickFollowSpan.innerText="已收藏";
                        that.refs.clickFollow.attributes.src.nodeValue=link2;
                    }
                    //清理图片。
                    $('#parkDetailImagesList').empty();
                    if (parkClicked.park_photo) {
                        let images = parkClicked.park_photo.split(',');
                        for (let i = 0; i < images.length; i++) {
                            if (images[i]) {
                                let tp = $("<ul class='slides swiper-slide' style='width:"+$(window).width()+"px"+"'><li><img/></li></ul>");
                                let clientwidth = $(window).width();
                                tp.find('img').attr('src', images[i]).css({"width":clientwidth,"border":"0"});
                                $('#parkDetailImagesList').append(tp);
                            }
                        }
                        $('#parkDetailImagesList').width($(window).width()*images.length);
                    }else{
                        let tp = $("<ul class='slides swiper-slide' style='width:"+$(window).width()+"px"+"'><li><img/></li></ul>");
                        let clientwidth = $(window).width();
                        tp.find('img').attr('src', (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/map/images/bg_img_parking_default.png");
                        $('#parkDetailImagesList').append(tp);
                        $('#parkDetailImagesList').width($(window).width().length);
                    }
                    let count;
                    let danyuan;
                    let largelyCease;
                    if(window.location.href.indexOf("attentionList.html")>-1){
                        if( parseInt(parkClicked.largely_cease)>10000){
                            largelyCease =`${(parseInt(parkClicked.largely_cease) / 10000).toFixed(1)}万`;
                        }else{
                            largelyCease = `${parseInt(parkClicked.largely_cease).toFixed(0)}`;
                        }
                        if(parkClicked.distance>1000){
                            // let str = (parkClicked.distance/1000).toString();
                            count = (parseInt(parkClicked.distance) / 1000).toFixed(1);
                            danyuan = "km";
                        }else{
                            count=parseInt(parkClicked.distance).toFixed(0);
                            danyuan = "m";
                        }
                    }else{
                        if( parseInt(largely_cease)>10000){
                            largelyCease =`${(parseInt(largely_cease) / 10000).toFixed(1)}万`;
                        }else{
                            largelyCease = `${parseInt(largely_cease).toFixed(0)}`;
                        }
                        if(distance>1000){
                            // let str = (distance/1000).toString();
                            count = (parseInt(distance) / 1000).toFixed(1);
                            // count = str.split(".")[0]+"."+str.split(".")[1].substr(0,1);
                            danyuan = "km";
                        }else{
                            count=parseInt(distance).toFixed(0);
                            danyuan = "m";
                        }
                    }
                    $(".tip_count span").html(largelyCease);
                    name = parkClicked.name;
                    $('#parkName').html(this.jht.getStrSub(name));
                    $('#distance').html(count);
                    $('#danyuan').html(danyuan);
                    $('#price').html(parkClicked.park_qh);
                    if(parkClicked.emptyparkplacecount>parkClicked.parkplacecount/2){
                        $('#emptyParkPlaceCount').html(parkClicked.emptyparkplacecount).css("color","#80c02b");
                    }else{
                        if(parkClicked.emptyparkplacecount>10){
                            $('#emptyParkPlaceCount').html(parkClicked.emptyparkplacecount).css("color","#FD7B12");
                        }else if(parkClicked.emptyparkplacecount<=10&&parkClicked.emptyparkplacecount>0){
                            $('#emptyParkPlaceCount').html(parkClicked.emptyparkplacecount).css("color","#ff0000");
                        }else if(parkClicked.emptyparkplacecount==0||parkClicked.emptyparkplacecount<-1){
                            $('#emptyParkPlaceCount').html("0").css("color","#545454");
                        }else if(parkClicked.emptyparkplacecount==-1){
                            $('#emptyParkPlaceCount').html(parkClicked.parkplacecount).css("color","#80c02b");
                        }
                    }
                    $('#parkPlaceCount').html(parkClicked.parkplacecount);
                    if(parkClicked.is_carplace_share&&parkClicked.is_carplace_share==1){
                        $("#go_to_parking").removeClass("hide");
                    }else{
                        $("#go_to_parking").addClass("hide");
                    }
                    $('#address').html(this.jht.getStrSub(parkClicked.address));
                    $('#park_fee_scale').html(parkClicked.park_fee_scale);
                    mySwiper = new Swiper ('.swiper-container',{
                        pagination: '.swiper-pagination',                   //显示焦点按钮
                        paginationClickable: '.swiper-pagination',          //焦点按钮可点击
                    });
                    for (let i = 0; i < data.dataitems.length; i++) {
                        mapDetailDataTmp.overdue.push(data.dataitems[i]);
                    }
                }
                this.stateObj.stateObjList = mapDetailDataTmp;
                this.setState(this.stateObj);
            }.bind(this)
        });
        //查看停车场详情大图
        $(document).on('click', '#parkDetailImagesList ul', function() {
            let tp = $(this).find('img').attr('src');
            $('#showParkDetailImage')
                .find('img').attr('src', tp)
                .parent().show().siblings().hide();
            $('#showParkDetailImage').css({"width":"100%","height":"100%"});
            $('#showParkDetailImage').find("img").css({"position":"fixed","width":"100%","height":"100%"});
        });
        // 缩小图片
        $(document).on('click', '#showParkDetailImage img', function() {
            $('#showParkDetailImage').hide().siblings().show();
        });
    }
    comeMap(data){
        if(data !=""){
            let parkClicked = data.attributes;
            let businesser_code = parkClicked.businesser_code;
            let park_code = parkClicked.park_code;
            let parkName = parkClicked.name;
            if (typeof(businesser_code) == "undefined") {
                poptip('抱歉，该停车场没有商户编号，您不能进行缴费！');
                return;
            } else {
                window.location.href = CARNOPAY+"?APP_TYPE="+window.USERINFO.APP.APP_TYPE+"&USER_ID="+window.USERINFO.USER.USER_ID+"&clientId="+window.USERINFO.USER.clientId+"&TEL="+window.USERINFO.USER.TEL+"&keys="+businesser_code+","+park_code+","+parkClicked.id+"&parkName="+parkName;
                window.event.returnValue = false;
            }
        }

    }
    getInvoice(dataServiceList){
        let USER_ID = window.USERINFO.USER.USER_ID;
        let TEL = window.USERINFO.USER.TEL;
        let clientId = window.USERINFO.USER.clientId;
        let APP_TYPE = window.USERINFO.APP.APP_TYPE;
        let parkId = dataServiceList.attributes.id;
        // http://jhtestcms.jslife.net/jspsn/webapp/src/invoice/html/invoice.html?clientId=oTbyos-UA6Z5WjTP0BJfIq7uvdXI&USER_ID=1e34989003864373b0fda47f2f9bc50d&APP_TYPE=WX_JTC&TEL=13333333333&parkId=0d9aaeeb08a911e7b51a6c3be50c9895
        window.location.href = GETINVOICE+"?clientId="+clientId+"&USER_ID="+USER_ID+"&APP_TYPE="+APP_TYPE+"&TEL="+TEL+"&parkId="+parkId;
    }
    PayBookPark(data){
        let isParkNavigation = true;
        if(data.subitems && data.subitems.length>0){
            for(let i=0;i<data.subitems.length;i++){
                if(data.subitems[i].attributes.function_name=="手机找车"){
                    isParkNavigation = true;
                    break;
                }else {
                    isParkNavigation = false;
                }
            }
        }else{
            isParkNavigation = false;
            poptip('该车场没有开通手机找车功能');
        }
        if(isParkNavigation == false){
            poptip('该车场没有开通手机找车功能');
        }else {
            window.location.href = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/other/parkNavigation/index.htm?clientId="+clientId+"&parkingId="+parkId+"&name="+name;
        }
    }
    //关注
    isFollowPark(dataServiceList){
        if(unionid=="1"){
            poptip("关联手机号，享受更多服务");
        }else{
            that = this;
            if (that.refs.clickFollowSpan.innerText=="收藏") {  //未关注
                let obj = {
                    dataItems:[
                    ]
                };
                let attr = {
                    attributes:{
                        userid:unionid,
                        parkid:dataServiceList.attributes.id
                    }
                };
                obj.dataItems.push(attr);
                //operateMask("show");
                JHTAJAX({
                    // url:xmppServer,
                    data: {
                        serviceId:"ac.park.sy_userattention",
                        dataItems:JSON.stringify(obj.dataItems)
                    },
                    dataType : 'json',
                    type:'post',
                    success: function(data) {
                        if (data.resultcode == "0" && data.dataitems != null && data.dataitems.length > 0) {
                            poptip('收藏成功');
                            // $(e).removeClass('icon_focuson').addClass('icon_focuson2').html('已关注');
                            that.refs.clickFollowSpan.innerText="已收藏";
                            that.refs.clickFollow.attributes.src.nodeValue=link2;
                            //通过首页进入详情页。
                            // if (_index != undefined) {
                            //     let tmp = $('#temp_carousel_parkInfo ul').eq(_index).find('.clickFollow ');
                            //     tmp.removeClass('icon_focuson').addClass('icon_focuson2').html('已关注');
                            // }
                            parkClicked.attentionid = data.dataitems[0].attributes.id;
                            parkClicked.isattention = 1;
                        } else {
                            poptip('收藏失败，请稍后再试');
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        poptip('收藏失败，请稍后再试');
                    }
                });
            }
            //取消关注。
            else if (that.refs.clickFollowSpan.innerText=="已收藏") {
                let obj = {
                    dataItems:[
                    ]
                };
                let attr = {
                    attributes:{
                        id:parkClicked.attentionid
                    }
                };
                obj.dataItems.push(attr);
                //operateMask("show");
                JHTAJAX({
                    data: {
                        serviceId:"ac.park.sy_canceluserattention",
                        dataItems:JSON.stringify(obj.dataItems)
                    },
                    dataType : 'json',
                    type:'post',
                    success: function(data) {
                        if (data.resultcode == "0" && data.dataitems != null && data.dataitems.length > 0) {
                            // $(e).removeClass('icon_focuson2').addClass('icon_focuson').html('未关注');
                            poptip('取消收藏');
                            that.refs.clickFollow.attributes.src.nodeValue=link1;
                            that.refs.clickFollowSpan.innerText="收藏";
                            // if (_index != undefined) {
                            //     let tmp = $('#temp_carousel_parkInfo ul').eq(_index).find('.clickFollow ');
                            //     that.refs.clickFollow.attributes.src="../images/icon_focuson-38.png";
                            // that.refs.clickFollowSpan.innerText="未关注";
                            // }
                            parkClicked.attentionid = null;
                            parkClicked.isattention = 0;
                            // let isattentionName = $(e).parents(".fp_menu").siblings(".pd_details").find("#parkName").html() || "";  //关注列表
                            // $("#temp_carousel_parkInfo ul li h4 label").each(function(){
                            //     if($(this).html().split('.')[1] == isattentionName){
                            //         $(this).parents("li").siblings(".clickFollow").html("未关注").removeClass("icon_focuson2").addClass("icon_focuson");
                            //     }
                            // });
                        }else{
                            poptip('取消失败，请稍后再试！');
                        }
                    }
                });
            }
        }
    }
//填充停车场详情信息
    render(){
        let dataServiceList = this.state.stateObjList;
        if(dataServiceList!="" && dataServiceList.overdue){
            dataServiceList = dataServiceList.overdue;
        }
        let item = true;
        let iconPrice ={"borderRight":"0"};
        let height = document.body.clientHeight-210;
        let pdDetails ={"width":"100%","height":height+"px","overflow":"auto"};
        let emptyParkPlaceCount ={"float":"left"};
        let stylepark_fee_scale = {"display":"inlineBlock"};
        let clickFollow = {"textAlign":"center"};
        if(dataServiceList !="" && dataServiceList[0].subitems && dataServiceList[0].subitems && dataServiceList[0].subitems.length>0){
            item = false;
        }
        let styleshowImage = {"position": "fixed","width": "100%","height": "100%"};
        let style = {"display":"none"};
        let imgPath = (this.jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/map/images/bg_img_parking_default.png";

       let styleback = {"background":imgPath};
        return (
            <div>
                <Loading taskCount="1" />
                <section id ="showParkDetailImage">
                    <img style={ styleshowImage }/>

                </section>
                <section id="parkingdetails">
                    <article className="pd_hdp" style={styleback}>
                        <div id="parkDetailImages" className="tabBox swiper-container">
                            <div className="swiper-wrapper bd" id="parkDetailImagesList"></div>
                            <div className="swiper-pagination pagination"></div>
                        </div>
                    </article>
                    <div id="poptip" style={style}></div>
                    <article className="pd_details" id="detailPark" style={pdDetails}>
                        <div className="park_detail_titil">
                            <h4>
                                <label id="parkName"></label>
                                {/*<span onClick={this.comeMap.bind(this)}>进入车场</span>*/}
                            </h4>
                            <div className="tip_address">
                                <em id="address"></em>
                            </div>
                            <div className="tip_count">
                                <span></span>
                                <em id="tipCount">位车友停过</em>
                            </div>
                        </div>
                        <div className="icon_focuson_parent" onClick={this.isFollowPark.bind(this,dataServiceList[0])}><img ref="clickFollow" src={link1} className="icon_focuson"/><span ref="clickFollowSpan">收藏</span></div>

                        <div className="opened">已开通 </div>
                        <div className="effectparent">
                        {item==false?(dataServiceList[0].subitems.map((dataServiceList, i) => {
                                return <div className="effect" key={ `list-${ i }` }>
                                    <SubitemSuccess dataServiceList={dataServiceList}/>
                                </div>
                            })
                        ):(<div className="effect"></div>)}
                        </div>
                        <nav>
                            <ul>
                                <li className="tip_distance">
                                    距离：
                                    <span id="distance"></span>
                                    <span id="danyuan">m</span>
                                </li>
                                <li className="tip_parkspace">
                                    <div id="emptyParkPlaceCount" style={emptyParkPlaceCount}>0</div>
                                    <div id="parkPlaceCount">0</div>
                                </li>

                                <li className="tip_charge">
                                    收费信息:
                                    <p id="park_fee_scale"></p>
                                </li>
                            </ul>
                        </nav>
                    </article>
                    <article className="fp_menu">
                        <nav>
                            <ul>
                                {/*<li className="tip_li_yd tip_invoice" onClick={this.getInvoice.bind(this,dataServiceList[0])}><img src={link4}/>申领发票</li>*/}
                                <li className="tip_li_yd tip_booking" onClick={this.PayBookPark.bind(this,dataServiceList[0])}><img src={link3}/>一键找车</li>
                                <li className="tip_li_yd amap-info-btn " onClick={this.comeMap.bind(this,dataServiceList[0])} id="detailAttention"><img src={link5}/>缴费</li>
                            </ul>
                        </nav>
                    </article>
                </section>
            </div>
        );
    }
}
// 渲染已经开通的功能
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
//获取车场
function getRegions(region){
    let regionId;
    let url = 'http://h5.indoorun.com:81/h5/getRegions.html';
    let param = '';
    $.ajax({
        url: window.location.href.split('jspsn')[0]+'jspsn/' + "httpRequest.servlet", //地址
        type: 'post', //提交方式 可以选择post/get 推荐post
        async: false, //同步异步
        data:{url:url,param:param},
        dataType: 'json', //返回数据类型
        success: function(data) {
            if (data) {
                for ( let i = 0; i < data.regions.length; i++) {
                    if (data.regions[i].name == region) {
                        regionId = data.regions[i].id;
                        break;
                    }
                }
            }
        }
    });
    return regionId;
}
//弹出提示
let poptip = function(mess) {
    $("#poptip").html(mess);
    $("#poptip").fadeIn(400, function() {
        setTimeout(function() {
            $("#poptip").fadeOut('slow');
        }, 1200);
    });
};
export { MapDetail };