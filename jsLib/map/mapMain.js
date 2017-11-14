import {Component, createClass} from "react";
import {SearchList} from "./mapSearchList";
import JHT from "../common/util/JHT";
import JHTAJAX from "../common/util/JHTAjax";
import {Link} from "react-router";
import Translate from "../common/util/Translate";
import {CARNOPAY} from "../common/util/Enum";
import {Loading, operateMask} from "../common/components/Loading";
let mar = [];//标注数组
var traffic;// 实时交通状况
let iconBookingAuto = true; //开关
var start_xy; //导航起点
var tname; //当前选中的停车场的名称
var parkId; //选中停车场的id
var parkCode;
let unionid = "1";
let that;
let lng; // 定位的精度
let lat; // 定位的纬度
var city; //当前定位坐标的详细地址
var mySwiper;// swiper插件对象
let mapObj;// 地图对象
var markerobj = []; //标注对象
var aroundParking = {}; //周围停车场(mark)。
var locationX, locationY;
/*
* 请求周边车场，渲染mark组件
* */
class PlaceSearchOver extends Component{
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.translate = new Translate();
    }
    //关注
    isFollowPark(data){
        if(unionid=="1"){
            poptip("关联手机号，享受更多服务");
        }else{
            that = this;
            let parkClicked = data.attributes;
            if (parkClicked.isattention == 0) {  //未关注
                let obj = {
                    dataItems:[
                    ]
                };
                var attr = {
                    attributes:{
                        userid:unionid,
                        parkid:parkId
                    }
                };
                obj.dataItems.push(attr);
                //operateMask("show");
                JHTAJAX({
                    data: {
                        serviceId:"ac.park.sy_userattention",
                        dataItems:JSON.stringify(obj.dataItems)
                    },
                    dataType : 'json',
                    type:'post',
                    success: function(data) {
                        if (data.resultcode == "0" && data.dataitems != null && data.dataitems.length > 0) {
                            that.refs.clickFollow.className="tip_li amap-info-btn clickFollow icon_focuson4"
                            that.refs.clickFollow.innerText="已收藏";
                            poptip('收藏成功');
                            //通过首页进入详情页。
                            // if (_index != undefined) {
                            //     var tmp = $('#temp_carousel_parkInfo ul').eq(_index).find('.clickFollow ');
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
            else if (parkClicked.isattention == 1) {
                let obj = {
                    dataItems:[
                    ]
                };
                var attr = {
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
                            that.refs.clickFollow.className="tip_li amap-info-btn clickFollow icon_focuson3"
                            that.refs.clickFollow.innerText="收藏";
                            poptip('取消收藏');
                            parkClicked.attentionid = null;
                            parkClicked.isattention = 0;
                        }else{
                            poptip('取消收藏失败，请稍后再试');
                        }
                    }
                });
            }
        }
    }
    //缴费
    showFeePay(data){
        if(data.attributes.businesser_code){
            let parkClicked = data.attributes;
            let businesser_code = parkClicked.businesser_code;
            let park_code = parkClicked.park_code;
            if (!businesser_code || typeof(businesser_code) == "undefined" || businesser_code == '') {
                return;
            } else {
                // let jspsn_timestamp = new Date().getTime();
                // localStorage.setItem('parkingId',parkClicked.id);
                // localStorage.setItem('name',parkClicked.name);
                // localStorage.setItem('park_code',park_code);
                // localStorage.setItem('businesser_code',businesser_code);
                // localStorage.setItem('queryNearbyPark',"false");
                // localStorage.setItem('jspsn_timestamp',jspsn_timestamp);
                let host = "http://" + window.location.host;
                let title = $("title").html();
                if(title == "捷停车"){
                    window.location.href = CARNOPAY+window.location.search+"&keys="+businesser_code+","+park_code+","+parkClicked.id+"&parkName="+parkClicked.name;
                    window.event.returnValue = false;
                }else{
                    window.location.href = CARNOPAY+window.location.search+"&keys="+businesser_code+","+park_code+","+parkClicked.id+"&parkName="+parkClicked.name;
                    window.event.returnValue = false;
                }
            }
        }
    }

    render(){
        let styleParkInfo = {"display":"none"};
        let carouselParkNameSpan = { "float":"right","color":"rgb(46, 46, 246)","textDecoration":"underline" };
        let numSpan1 = { "width":"34%", "float":"left" };
        let numSpan2 = { "width":"36%", "float":"left","textAlign":"center" };
        let numSpan3 = { "width":"30%", "float":"left","textAlign":"right" };
        let selectPark = { "display":"none"};
        let iconImg = { "width": "15px", "height": "15px"};
        let data = this.props.dataServiceList;
        let which = this.props.count+1;
        tname = data.attributes.name;
        parkId = data.attributes.id;
        parkCode = data.attributes.park_code;
        let sharePlace = "";
        if(data.attributes.IS_CARPLACE_SHARE && data.attributes.IS_CARPLACE_SHARE==1){
            sharePlace = '<span class="share_place">享</span>';
        }else{
            sharePlace ='';
        }
        let count = 0;
        data.attributes.lat = lat;
        data.attributes.lng = lng;
        let fontColor = {"color":"#FD7B12"};
        let emptyparkplacecount = data.attributes.emptyparkplacecount;
        let parkplacecount = data.attributes.parkplacecount;
        if(emptyparkplacecount>parkplacecount/2){
            count = emptyparkplacecount;

        }else{
            if(emptyparkplacecount>10){
                count = emptyparkplacecount;

            }else if(emptyparkplacecount<=10&&emptyparkplacecount>0){
                count = emptyparkplacecount;

            }else if(emptyparkplacecount==0||emptyparkplacecount<-1){
                count=0;

            }else if(emptyparkplacecount==-1){
                count = parkplacecount;

            }
        }
        let distance = "";
        let unit ="";
        if(parseInt(data.attributes.distance) > 1000){
            distance = (parseInt(data.attributes.distance) / 1000).toFixed(1);
            unit = "km";
        }else{
            distance = parseInt(data.attributes.distance).toFixed(0);
            unit = "m";
        }
        let pathdata = {
            pathname: "/mapDetail",
            query: data.attributes
        };
        let pathdataBook = {
            pathname: "/bookingorder",
            query: {
                text: JSON.stringify(data.attributes)
            }
        };
        let iconBooking = {"opacity":"0.3"};
        let iconPrice = {"opacity":"1"};
        if (!data.attributes.businesser_code || typeof(data.attributes.businesser_code) == "undefined" || data.attributes.businesser_code == '') {
            iconPrice = {"opacity":"0.3"};
        }
        iconBookingAuto=false;
        let bookingLink = <li className="tip_li amap-info-btn icon_booking" style={ iconBooking } id="btn_booking">预订</li>;
        if(data.subitems&&data.subitems.length>0){
            for(let i=0;i<data.subitems.length;i++){
                if(data.subitems[i].attributes.function_name=="订车位"){
                    bookingLink = <Link to={pathdataBook} className="tip_li amap-info-btn icon_booking" id="btn_booking">预订</Link>;
                }
            }
        }
        let city="起点";
        let point = this.translate.gcj02tobd09(data.attributes.longitude,data.attributes.latitude);
        let gotohere = 'http://api.map.baidu.com/direction?origin=latlng:'+lat+","+lng+"|name:"+city+"&destination=latlng:"+point[1]+","+point[0]+'|name:'+data.attributes.name+'&mode=driving&region=中国&output=html&src=yourCompanyName|yourAppName';
        sessionStorage.setItem("pathdata",data.attributes);
        let html="";
        if(data.attributes.isattention==0){
            html=<li className="tip_li amap-info-btn clickFollow icon_focuson3" id="isattention" ref="clickFollow" onClick={ this.isFollowPark.bind(this,data) } data-attention>收藏</li>;
        }else if(data.attributes.isattention==1){
            html=<li className="tip_li amap-info-btn clickFollow icon_focuson4" id="isattention" ref="clickFollow" onClick={ this.isFollowPark.bind(this,data) } data-attention>已收藏</li>;
        }
        mySwiper = new Swiper ('.swiper-container',{
            paginationClickable: true,
            longSwipesRatio: 0.3,
            touchRatio:1,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
            iOSEdgeSwipeDetection : true,
            //loop : true,
            onSlideChangeStart: function(swiper){
                reMark(aroundParking,swiper.activeIndex);
            }
        });
        return(
            <ul id="temp_carousel_parkInfo">
                <div className="carousel_everypark">
                    <li>
                        <h4 className="amap-info-park">
                            <label id="carouselParkName">{which+"、"+ data.attributes.name }</label>
                            <Link to={pathdata} style={ carouselParkNameSpan }>详情&gt;&gt;</Link>
                        </h4>
                        <div className="amap-info-num">
							<span style={ numSpan1 }>
								价格:<em id="carouselParkPrice">{ data.attributes.park_qh }</em>元/小时
							</span>
                            <span style={ numSpan2 }>
								车位:<em id="carouselParkBeds" style={fontColor}>{ count }</em>/<em id="carouselParkTotalBeds">{ data.attributes.parkplacecount }</em>
							</span>
                            <span style={ numSpan3 }>
								距离:<em id="carouselParkDistance">{ distance }</em>{ unit }
							</span>
                        </div>
                    </li>
                    <a className="tip_li amap-info-btn icon_arrow" href={gotohere} target="_blank">去这里</a>
                    {/*<a className="tip_li amap-info-btn icon_arrow" href="#" target="_blank">去这里</a>*/}
                    {bookingLink}
                    {html}
                    <li className="tip_li amap-info-btn icon_price" style={ iconPrice } ref = "showFeePay" onClick={ this.showFeePay.bind(this,data) }>缴费</li>
                    <li className="selectPark" style={ selectPark } id={data.attributes.id}><img style={ iconImg } src="../images/seek_car_i_am_here.png" /><label>我在这里</label></li>
                </div>
            </ul>
        )
    }
}
class MapSearchList extends Component{
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.markClicked = "" ;
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:"",
            liked: []
        };
        operateMask("show");
        this.state = this.stateObj;
        document.title = "找车场";
        this.translate = new Translate();
    }
    componentDidMount(){
        let that = this;
        let beforeLocationX;
        let beforeLocationY;
        let cpoint; //地图中心点
        let parkClicked;
        let parkCode;
        let HOSTPATH = window.location.href.split('jspsn')[0]+'jspsn/parkApp/';
        mapObj = new BMap.Map("mapContainer");
        let point = new BMap.Point();
        mapObj.centerAndZoom(point,15);
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                let myIcon = new BMap.Icon("../images/icon_position.png", new BMap.Size(40,60));
                let mk = new BMap.Marker(r.point,{icon:myIcon});
                mk.disableMassClear();
                mapObj.addOverlay(mk);
                // mapObj.panTo(r.point);
                lng=r.point.lng;
                lat=r.point.lat;
                onComplete(r.point);
            }
            else {
                alert('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true});
        mapObj.enableDragging();   //开启拖拽
        //拖拽地图时候加载
        let dragendCount = 0;
       mapObj.addEventListener('dragend', function(e) {
            dragendCount++;
            dragendCompleted(dragendCount);
        });
        let onComplete =  function(data) {
            let p1 = new BMap.Point(data.lng,data.lat);
            let point = new BMap.Point(p1);
            mapObj.centerAndZoom(p1,15);
            let gc = new BMap.Geocoder();
            let pt = data;
            // 获取省市等地址
            gc.getLocation(pt, function(rs){
                let addComp = rs.addressComponents;
                if (addComp['province'] && typeof addComp['province'] === 'string') {
                    city = addComp['province'];
                }
                if (addComp['city'] && typeof addComp['city'] === 'string') {
                    city += addComp['city'];
                }
                if (addComp['district'] && typeof addComp['district'] === 'string') {
                    city += addComp['district'];
                }
                if (addComp['street'] && typeof addComp['street'] === 'string') {
                    city += addComp['street'];
                }
                if (addComp['streetNumber'] && typeof addComp['streetNumber'] === 'string') {
                    city += addComp['streetNumber'];
                }
                placeSearch();
            });
            beforeLocationX = data.lng; //当前位置精度
            beforeLocationY = data.lat; //当前位置纬度
            locationX = data.lng; //查询经度
            locationY = data.lat; //查询纬度
            cpoint = new BMap.Point(beforeLocationX, beforeLocationY); //中心点坐标
            start_xy = cpoint;
            localStorage.setItem("lng",data.lng);
            localStorage.setItem("lat",data.lat);
        };
        let dragendCompleted = function(oldDragendCount){
            let ps = mapObj.getBounds().getCenter();
            locationX = ps.lng; //定位坐标经度值
            locationY = ps.lat; //定位坐标纬度值
            for (let i = 0; i < markerobj.length; i++) {
                mapObj.clearOverlays(markerobj[i]); //批量删除以前的停车场标注
            }
            city = "";
            placeSearch();
            dragendCount = 0;
        };
        // 路况信息
        traffic = new BMap.TrafficLayer();
        document.getElementById("tip_traffic").addEventListener('click',function(){
            if( $("#tip_traffic").hasClass("tip_traffic") ){
                mapObj.removeTileLayer(traffic);
                $("#tip_traffic").removeClass("tip_traffic").addClass("tip_traffic2");
                mapObj.centerAndZoom(new BMap.Point(mapObj.getCenter().lng,mapObj.getCenter().lat),(mapZoom));
                traffic = new BMap.TrafficLayer();
            }else{
                mapObj.addTileLayer(traffic);
                $("#tip_traffic").removeClass("tip_traffic2").addClass("tip_traffic");
                mapObj.centerAndZoom(new BMap.Point(mapObj.getCenter().lng,mapObj.getCenter().lat),(mapZoom));
            }
        });
        //地图，搜索周围停车场

        let placeSearch =  function () {

            let query = this.props.location.query;
            let longitude=locationX; //当前经度
            let latitude = locationY;   //当前纬度
            let name="";
            // if(query){
            //     name = query.name;
            // }
            if(this.props.location.query&&query&&query.longitude!=undefined&&query.latitude!=undefined){
                longitude=query.longitude; //当前经度
                latitude = query.latitude;  //当前纬度
            }
            // let gdlatitude = this.translate.bd09togcj02(longitude,latitude)[1];
            // let gdlongitude = this.translate.bd09togcj02(longitude,latitude)[0];
            let jht =new JHT();
            unionid = window.USERINFO.USER.USER_ID ;
            let obj = {
                dataItems: []
            };
            let attr = {
                attributes: {
                    userId: unionid,
                    synch_signal: new Date().getTime() + '',
                    name:name,
                    beforelatitude: latitude,
                    beforelongitude:longitude,
                    latitude:latitude,
                    longitude: longitude,
                    DISTANCE:3000,
                    // SORT_MODE:0
                }
            };
            obj.dataItems.push(attr);
            JHTAJAX({
                // url: window.XMPPSERVER,
                data: {
                    serviceId: "ac.map.sy_getlocationquerypark",
                    dataItems: JSON.stringify(obj.dataItems)
                },
                dataType: 'json',
                type: 'post',
                success: function (param) {
                    operateMask("hide");
                    let dataTmp = [];
                    if (param.resultcode == "0" && param.dataitems != null && param.dataitems.length > 0) {
                        this.stateObj.stateObjList = param.dataitems;
                        aroundParking = param.dataitems;
                        reMark( param.dataitems ,0);
                        this.setState(this.stateObj);
                    }else{
                        this.stateObj.stateObjList = [];
                        this.setState(this.stateObj);
                    }
                }.bind(this),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    poptip("加载周围停车场失败");
                }
            });
        }.bind(this);
        //自定义地图工具条
        let mapZoom = mapObj.getZoom();
        document.getElementById('tip_zoom1').onclick = function() {   //放大
            mapObj.centerAndZoom(new BMap.Point(mapObj.getCenter().lng,mapObj.getCenter().lat),(mapZoom + 1));
            mapZoom=mapZoom + 1;
        };
        document.getElementById('tip_zoom2').onclick = function() {   //缩小
            mapObj.centerAndZoom(new BMap.Point(mapObj.getCenter().lng,mapObj.getCenter().lat),(mapZoom - 1));
            mapZoom=mapZoom - 1;
        };
        //停车费、剩余车位数图标切换
        $("#tip_layer").click(function(){
            if($(this).hasClass("tip_standard")) {  //停车费，切换至剩余车位
                $(this).removeClass("tip_map tip_standard").addClass("tip_map tip_number");//剩余车位，切换至停车费
            }else {
                $(this).removeClass("tip_map tip_number").addClass("tip_map tip_standard");
            }
            reMark(aroundParking,$("#tip_layer").data("index") || 0);
        });
        // 定位
        $("#amap-geo").click(function(){
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    mapObj.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), mapZoom);
                }
                else {
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})
        })
    }
    qwer() {
        this.setState({
            param: "",
            checked: !this.state.checked
        });
    }
    render(){
        let searchList_li = {"display":"block"};
        let searchList_li_dis = {"float":"right"};
        let dataServiceList = this.state.stateObjList;
        if(dataServiceList!==""&&dataServiceList.length>0){
            dataServiceList = dataServiceList;
        }else{
            dataServiceList=[];
        }
        let fn="true";
        let pathdata = {
            pathname: "/search",
            query: {
                text: "停车场",
                fn:fn,
                from:"mapMain",
                lng:locationX,
                lat:locationY
            }
        }
        return (
            <div>
                <Loading taskCount="1" />
                <Link  to={pathdata} className="keywordbox">
                    <input type="text" id="keyword" placeholder="停车场" onClick={this.qwer.bind(this)}/>
                    {/*<Search message="停车场" copemlt={this.state.checked} handel = { this.handel.bind(this)}/>*/}
                </Link>
                <div id="mapContainer"></div>
                {/*实时交通*/}
                <div id="tip_traffic" className="tip_map tip_traffic2"  value=""></div>
                {/*地图放大/缩小*/}
                <div id="tip_zoom1" className="tip_zoom1" value=""></div>
                <div id="tip_zoom2" className="tip_zoom2" value=""></div>
                {/*停车费*/}
                <div id="tip_layer" className="tip_map tip_standard"></div>
                {/*定位*/}
                <div id="amap-geo" className="tip_map amap-geo" value=""></div>

                <div id="leftTabBox" className="tabBox swiper-container">
                    <div className="swiper-wrapper">
                        {
                            dataServiceList.map((dataServiceList, i)=> {
                                return <div key={ `list-${ i }`}  className='swiper-slide'>
                                    <PlaceSearchOver dataServiceList = { dataServiceList } count={i} />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
/**
 * 加载地图标注点
 * @param parkData
 * @param index
 */
function reMark(parkData,index = 0){
    for (let k in parkData) {
        let emptyparkplacecount = parkData[k].attributes.emptyparkplacecount;
        let parkplacecount = parkData[k].attributes.parkplacecount;
        let lngX = parkData[k].attributes.longitude;
        let latY = parkData[k].attributes.latitude;
        let color = "999999";
        let content = "";
        let emptyBeds = '';
        if (emptyparkplacecount == 0 || emptyparkplacecount < -1) {
            emptyBeds = 0;
        } else if (emptyparkplacecount == -1) {
            emptyBeds = parkData[k].attributes.parkplacecount;
        } else {
            emptyBeds = emptyparkplacecount;
        }
        let beds = parkData[k].attributes.parkplacecount;
        let baimage = "";
        let opts = {
            offset: new BMap.Size(4, 9)   //设置文本偏移量
        };
        let indexLable = false;
        //设置车场图标
        if (index == k) {
            opts = {
                offset: new BMap.Size(8, 9)   //设置文本偏移量
            };
            indexLable = true;
            baimage = "../images/icon_marker_1.png";
            $("#tip_layer").data("index",k);
        } else {
            if (emptyparkplacecount / beds > 0.5) {
                baimage = "../images/icon_marker_5.png";
            } else if (emptyparkplacecount >= 10) {
                baimage = "../images/icon_marker_2.png";
            } else if (emptyparkplacecount > 0) {
                baimage = "../images/icon_marker_3.png";
            } else {
                baimage = "../images/icon_marker_4.png";
            }
        }
        if(!$("#tip_layer").hasClass("tip_standard")){
            if (emptyparkplacecount == 0 || emptyparkplacecount < -1) {
                content = "0";
            } else if (emptyparkplacecount == -1) {
                content = parkplacecount;
            } else {
                content = emptyparkplacecount;
            }
        }else {
            content = "¥" + parkData[k].attributes.park_qh||"";
        }

        let label = new BMap.Label(content, opts);  // 创建文本标注对象
        label.setStyle({
            color: color,
            fontSize: "12px",
            width: "20px",
            textAlign: "center",
            height: "20px",
            lineHeight: "20px",
            borderRadius: "10px",
            fontFamily: "微软雅黑",
            zIndex: 2,
            border: 0
        });

        let ggPoint = new BMap.Point(lngX, latY);
        let myIcon = new BMap.Icon(baimage, new BMap.Size(40, 50));

        //坐标转换完之后的回调函数
       let translateCallback = function (data){
            if(data.status === 0) {
                mar[k] = new BMap.Marker(data.points[0], {icon: myIcon}, label);
                markerobj.push(mar[k]);
                mar[k].setLabel(label);
                mar[k].setTop(indexLable);
                mapObj.addOverlay(mar[k]);
                mar[k].addEventListener("click", function () {
                    mySwiper.slideTo(k, 1000, false);
                    reMark(aroundParking,k);
                   // mapObj.clearOverlays();
                });
            }
        };

        setTimeout(function(){
            let convertor = new BMap.Convertor();
            let pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 3, 5, translateCallback);
        }, 200);
    }
    mapObj.clearOverlays();
}
//坐标转换
function translate(ggPoint,Callback){
    //地图初始化
    var bm = new BMap.Map("allmap");
    bm.centerAndZoom(ggPoint, 15);
    bm.addControl(new BMap.NavigationControl());
    //坐标转换完之后的回调函数
    translateCallback = function (data){
        if(data.status === 0) {
            Callback(data);
        }
    };
    let convertor = new BMap.Convertor();
    convertor.translate(ggPoint, 3, 5, translateCallback);
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
export { MapSearchList };
