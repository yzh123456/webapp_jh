var _point_data;//定位点数据存储
var tmpPoint,tmp_ty=0,tmp_tx=0;  //跨楼导航时，临时存储另外一个楼层的起点终点位置数据

var sFloorId = 0;//跨楼层导航时，起点楼层
var tFloorId = 0;//跨楼层导航时，终点楼层
var park_id = sessionStorage.getItem("park_id") ;
var point_data = {};
var iPointSvgPosX,
    iPointSvgPosY;   //动态点的svg坐标

var startFloorName = $_GetRequest().startFloorName;
var endFloorName = $_GetRequest().endFloorName;
var startPointCode = $_GetRequest().startPointCode;
var endPointCode = $_GetRequest().endPointCode;
var end_point_code = endPointCode || '',
	start_point_code= startPointCode || '';

$(function() {
    //点击找车
    $("#js_footer").click(function(){
        //Map.ManageClick.bluetoothBtn();
        $("#page_info , .mask").show();

    });
    $("#pop_up").click(function(){
          $("#pop_list, #pop_down").show();
          $("#pop_up").hide();
    });

    $("#sFloor_btn").click(function(){  //手动点击切换跨楼导航
        if ( tmpPoint && !Map.StaticGPS.bIsClickStart) {
            $("#sFloor_btn").css({"background-color":"#FFF","color": "#555"});
            $("#tFloor_btn").css({"background-color":"","color": "#FFF"});
            var fId = $(this).data("floorId");
            switchMap(fId);
            Map.StaticGPS.hideTrajectory();
            Map.ManageClick.startPoint([sx,sy]);
            Map.ManageClick.endPoint(tmpPoint);
            showPiont([sx,sy],tmpPoint);
        };
    });
    $("#tFloor_btn").click(function(){  //手动点击切换跨楼导航
        if ( tmpPoint && tmp_tx && tmp_ty && !Map.StaticGPS.bIsClickStart) {
            $("#sFloor_btn").css({"background-color":"","color": "#FFF"});
            $("#tFloor_btn").css({"background-color":"#FFF","color": "#555"});
            var fId = $(this).data("floorId");
            switchMap(fId);
            Map.StaticGPS.hideTrajectory();
            Map.ManageClick.startPoint(tmpPoint);
            Map.ManageClick.endPoint([tmp_tx,tmp_ty]);
            showPiont(tmpPoint,[tmp_tx,tmp_ty]);
        }
    });
    //点击定位点,只查询起点
    $("#pop_list li").live("click",function(){
        var li=this.id;
        _point_data = get_point_data(li);//当前楼层公共设施位置数据

        Map.StaticGPS.hideTrajectory();
        if (floorId != sFloorId ) {
            switchMap(sFloorId);
            var name = aFloors[sFloorId];
            $("#sFloor_btn").data("floorId",sFloorId);
            $("#sFloor_btn").html(name);
            var name = aFloors[_point_data[0].floorId];
            $("#tFloor_btn").data("floorId",_point_data[0].floorId);
            $("#tFloor_btn").html(name);
            $("#sFloor_btn").css({"background-color":"#FFF","color": "#555"});
            $("#tFloor_btn").css({"background-color":"","color": "#FFF"});
            $("#tFloor_btn,#arrow1").show();
            if (sx != -101 && sy != -101) {     //已有起点
                Map.ManageClick.startPoint([sx, sy]);
                $("#mask,#myCar").hide();
            };
            tmpPoint = getLately(sx, sy,point_data.elevator || point_data.stairs);   //作为跨楼层时终点楼层的起点
            tmp_tx=getLately(tmpPoint[0],tmpPoint[1],_point_data)[0];
            tmp_ty=getLately(tmpPoint[0],tmpPoint[1],_point_data)[1];
            Map.ManageClick.endPoint(tmpPoint);
            showPiont([sx, sy],tmpPoint);
            return;
            //_point_data = get_point_data(li);
        }else {  //如果已经有起点   Map.StaticGPS.iStartSvgPosY !=0 && Map.StaticGPS.iStartSvgPosX != 0
            $("#pop_list, #pop_down").hide();
            $("#pop_up").show();
            var name = aFloors[sFloorId];
            $("#sFloor_btn").data("floorId",sFloorId);
            $("#sFloor_btn").html(name);
            $("#end_btn").css("background-image","url(./images/js_img/zhong.png)");
            $("#tFloor_btn,#arrow1").hide();
            Map.ManageClick.startPoint([sx,sy]);
            Map.ManageClick.endPoint(getLately(sx,sy,_point_data));
            showPiont([Map.StaticGPS.iStartSvgPosX, Map.StaticGPS.iStartSvgPosY], getLately(sx,sy,_point_data));
        }
    });
    //点击关闭弹窗
    $(".mask").click(function(){
           $("#page_info, .mask,#myCar").hide();
    });

    $("#input_locatNo").focusin(function() {
            $("#selectCar").show();
            $("#input_clr").hide();
    });
    //添加滑动事件监听
    var oInp = document.getElementById("pop_down");
    var pop_up = document.getElementById("pop_up");
    var pop_list = document.getElementById("pop_list");
    oInp.addEventListener('touchmove',touch, false);
    oInp.addEventListener('touchstart',touch, false);
    pop_up.addEventListener('touchmove',touch_up, false);
    pop_up.addEventListener('touchstart',touch_up, false);
    pop_list.addEventListener('touchmove',touch, false);
    function touch_up (event){
        var event = event || window.event;
        if (event.type=="touchstart" || event.type=="touchmove") {
        	event.preventDefault();
        	$("#pop_list, #pop_down").show();
    		$("#pop_up").hide();
        };   
    }
    function touch (event){
        var event = event || window.event;
        if (event.type=="touchstart" || event.type=="touchmove") {
    	    	event.preventDefault();
                $("#pop_list, #pop_down").hide();
    			$("#pop_up").show();
    	    }; 
    }

    //寻车业务
    $("#selectCar").hide();
    if ($("#input_locatNo").val() != "") {
        $("#input_clr").show();
    };
    //默认输入框聚焦
    //$("#input_locatNo").focus();
    $("#input_locatNo").focusin(function() {
        $("#selectCar").show();
        $("#input_clr").hide();
    });

    var carNoList = new Array();

    //初始化生成搜索记录
    var arr = localStorage.getItem('carNoList');
    if (arr != "" && arr != null) {

    } else {
        arr = ',,,,,,';
    }
    carNoList = arr.split(',');

    function fillRecord() {
        $("#recordBox tr").empty();
        if (carNoList != "" && carNoList != null) {
            for (var i = 0; i < carNoList.length; i++) {
                if ('' !== carNoList[i])
                    $("#recordBox tr").append("<td>" + carNoList[i] + "</td>");
            }
        } else {
            carNoList = '';
        }
    }

    fillRecord(); //初始化时加载
    //搜索记录点击事件
    $('#selectCar td').live("click", function() {
        $('#input_locatNo').val($(this).html()).focus();
        $("#selectCar").hide();
        $("#input_clr").show();
    });
    //输入框聚焦/失焦事件
    $('#input_locatNo').bind('input propertychange', function() {
        if ($(this).val()) {
            $("#input_clr").show();
            $('#selectCar').hide();
        } else {
            if (carNoList != "" && carNoList != null) {
                fillRecord();
            }
            $('#selectCar').show();
        }
    });
        //清除输入
    $("#input_clr").bind("click touched touchstart",function() {
        $("#input_locatNo").val("").focus();
        $(this).hide();
        if (carNoList != "" && carNoList != null) {
            fillRecord();
        }
        $('#selectCar').show();
    });

    //清除搜索历史
    $(".btn_clr").click(function() {
        $("#historyBox").empty();
    });

    //提交事件
    $("#btn_searchCar").click(function() {
        var inputNo = $("#input_locatNo").val().trim().substring(0, 1);
        var flag = true;
        if ($("#carNoBox td").text().indexOf(inputNo) > -1) {
            flag = true;
        } else {
            flag = false;
        }
        end_point_code = $("input#input_locatNo").val();
        if (end_point_code == "" || end_point_code == null) {
            poptip("请输入您要寻找的车牌号/车位号");
            return;
        };
        var carNo = $("#input_locatNo").val();
        var history = $.inArray(carNo, carNoList);
        if (history == -1) {
            carNoList.unshift(carNo);
        }
        carNoList.length = 4;
        if (flag) {
            var reg = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[a-zA-Z_0-9_\u4e00-\u9fa5]$|^WJ[\u4e00-\u9fa5]{1}[-]{0,1}[a-zA-Z_0-9]{5}$/;
            var carNo = $("#input_locatNo").val();
            if (!reg.test(carNo)) {
                poptip("车牌号无效，请重新输入");
                return;
            }
        }

        end_point_code = $("#input_locatNo").val();
        var type='end';
        getPointXY(end_point_code,type);
        $("#page_info, .mask").hide();
    });
});

function initSearchCarPage () {
    //localStorage.removeItem("endinput");
    var businessCode = $_GetRequest().businessCode;
    var parkCode = $_GetRequest().parkCode
    var id = $_GetRequest().id;
    
    
    var end_input = endPointCode || "";
    var start_input = startPointCode || "";
    
    if (endFloorName && startFloorName && businessCode && parkCode) {
    	 $.ajax({  //查询车场id
             url: getBasePath() + "/initSearchCar",//地址
             type: 'post',//提交方式 可以选择post/get 推荐post
             async: false,//同步异步
             data:{businessCode:businessCode,parkCode:parkCode,id:id},
             dataType: 'json',//返回数据类型
             success:function(data) {
                 if(data){
                     park_id = data.park_id;
                     parkingName = data.parkName ;
                     var str = data.parkName + " " + startFloorName ;
                     $("#input_nearbyPark").html(str).show();
                     getRegions(parkingName);
                 }else{
                     
                 }
             }
         }); 
    	
    	return;
	}

    /*if (end_input == "undefined" || end_input == null || end_input) {
        end_input =="";
    }
    if (start_input == "undefined" || start_input == null || start_input) {
        start_input =="";
    }
    $("input#input_locatNo").val(end_input);
     $("input#input_carNo").val(start_input);*/
    
    //判断参数
    if ( parkCode == null || businessCode == null) {
        poptip("此二维码无效！");
    }else {
        //http://localhost:8080/web-comm-main/qrcode/searchCar.html?businessCode=JHT&parkCode=2015062800001&id=220B9516BF31C5D7E050650A0B33301A
        $.ajax({
            url: getBasePath() + "/initSearchCar",//地址
            type: 'post',//提交方式 可以选择post/get 推荐post
            async: false,//同步异步
            data:{businessCode:businessCode,parkCode:parkCode,id:id},
            dataType: 'json',//返回数据类型
            success:function(data) {
                if(data){
                    //var str = data.PARKNAME + " " + data.FLOORNAME + " " + data.AREANAME + " " +data.POINTNAME;
                    var str = data.parkName + " " + data.floorName + " " + data.areaName + " " +data.pointName;
                    $("#input_nearbyPark").html(str).show();
                    start_point_code = data.pointId;
                    park_id = data.parkid;
                    sx = data.xtab;
                    sy = data.ytab;
                    iPointSvgPosX=sx;
                    iPointSvgPosY=sy;
                    parkingName = data.parkName ;
                    getRegions(parkingName);
                }else{
                    $("#input_nearbyPark").show().html("无车场和车位信息！");
                }
            }
        }); 
    }
    
}
//获取车场
function getRegions(region){
    var url = 'http://h5.indoorun.com:81/h5/getRegions.html';
    var param = '';
    $.ajax({
        url: getBasePath() + "/httpRequest.servlet", //地址
        type: 'post', //提交方式 可以选择post/get 推荐post
        async: false, //同步异步
        data:{url:url,param:param},
        dataType: 'json', //返回数据类型
        success: function(data) {
            if (data) {                 
                //var evalData = strToJson(data);
                //var region = $("#input_nearbyPark").html();
                for ( var i = 0; i < data.regions.length; i++) {
                    if (data.regions[i].name == region) {
                        regionId = data.regions[i].id;
                        break;
                    }
                }
                if (regionId && regionId != "") {
                    loadFloor();
                    $("#page_info , .mask").show();
                }else{
                    poptip("楼层加载出错了");
                }
                
            }else{
                poptip("该车场无室内地图");
            }
        }
    });
}
//获取公共设施数据
function getUnits(_oTxt) {
    point_data = {
         elevator : [],
         restroom : [],
         exit : [],
         stairs : [],
         pay : []
    };
    for (var i in _oTxt) {
        if (_oTxt[i].floorId == floorId) {
            switch (oTxt[i].unitTypeId) { //以下处理页面其他点击事件  
                case '1':
                    //1，自动扶梯
                    break;
                case '2':
                    point_data.elevator.push(oTxt[i]);
                    if ($("#elevator").val()==undefined) {
                        var tmp ='<li id="elevator"></li>';
                        $("#pop_list").append(tmp);
                        $("#elevator").css({"background-image":"url(./images/js_img/elevator.png)"});
                    }
                    break;
                case '3':
                    //3，卫生间
                    point_data.restroom.push(oTxt[i]);
                    if ($("#restroom").val()==undefined) {
                        var tmp ='<li id="restroom"></li>';
                        $("#pop_list").append(tmp);
                        $("#restroom").css({"background-image":"url(./images/js_img/restroom.png)"});
                    };
                    break;
                case '4':
                    //4，取款机
                    break;
                case '5':
                    point_data.exit.push(oTxt[i]);
                    //5，出口
                    if ($("#exit").val()==undefined) {
                    var tmp ='<li id="exit"></li>';
                        $("#pop_list").append(tmp);
                        $("#exit").css({"background-image":"url(./images/js_img/exit.png)"});
                    }   
                    break;
                case '6':
                    break;
                case '7':    //7，入口
                    break;
                case '8':         //8，安全出口
                    /*tmpdata.push(oTxt[i]);
                    point_data.exit=tmpdata;
                if ($("#xit").val()==undefined) {
                    var tmp ='<li id="exit"></li>';
                    $("#pop_list").append(tmp);
                    $("#exit").css({"background-image":"url(./images/js_img/exit.png)"}); 
                    } */   
                    break;
                case '9':           //9，楼梯
                    //point_data.stairs=[];
                    point_data.stairs.push(oTxt[i])
                    if ($("#stairs").val()==undefined) {
                        var tmp ='<li id="stairs"></li>';
                        $("#pop_list").append(tmp);
                        $("#stairs").css({"background-image":"url(./images/js_img/stairs.png)"}); 
                    }
                break;  
                case '10':                     // 10，洗车   
                break;
                case '11':                       //11，收费处
                    point_data.pay.push(oTxt[i]);
                    if ($("#pay").val()==undefined) {
                        var tmp ='<li id="pay"></li>';
                        $("#pop_list").append(tmp);
                        $("#pay").css({"background-image":"url(./images/js_img/pay.png)"});
                    }
                break;   
                default:
                break;  
            } 
        };
    }      
};

//捷顺业务导航
function getPointXY(point_code,type){
    //alert(sessionStorage.getItem('park_id'))
    var location1 = '0';
    var user_id = "";
    var param = {
            user_id: user_id,
            start_point_code: point_code,
            park_id: park_id,
            location1: location1
        };
    if (type == 'end' ) {
        location1 = '1';
        param = {
            user_id: user_id,
            park_id: park_id,
            location1: location1,
            end_point_code: point_code
        };
    }else if (type == 'start' && endFloorName && startFloorName && businessCode && parkCode) {
    	location1 = '1';
	}
    //var url='http://wx.jslife.com.cn:7718/jspsn/parkApp/searchCar.servlet';
    //var param='start_point_code='+start_point_code+'&end_point_code='+end_point_code+'&user_id=e8376df5832047c9bd7856206ee69794&location1=1&park_id=3AA9FD927B814D41B075B6FBC3C94DC0';
    $.ajax({
        url: getBasePath() + "/searchCar", //地址
        type: 'post', //提交方式 可以选择post/get 推荐post
        async: true, //同步异步
        timeout: 10000,
        data: param,
        dataType: 'json', //返回数据类型
        complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
            if (status == 'timeout') { //超时,status还有success,error等值的情况
                poptip("服务器超时10s无响应，请重试");
            }
        },
        success: function(data) {
            //poptip(data.message);
            if (data && data.resultCode == 0) {
                var _sx, _sy, tx,ty;
                if (data.dataItems.length>0) {     
                    var seekList = [];
                    if (type == 'start' && !endFloorName && !startFloorName && !endPointCode && !startPointCode) { 
                         //查询起点(公共设施位置导航)
                        switchMap(data.dataItems[0].attributes.START_POINT_KEY);
                        sFloorId = data.dataItems[0].attributes.START_POINT_KEY;
                        sx=data.dataItems[0].attributes.START_POINTX;
                        sy=data.dataItems[0].attributes.START_POINTY;
                        $("#end_btn").css("background-image","url(./images/js_img/zhong.png)");
                        Map.ManageClick.startPoint([sx, sy]);
                    }else if (type == 'start'  && endFloorName && startFloorName && endPointCode && startPointCode ) {
                    	for ( var i = 0; i < data.dataItems.length; i++) {
							if (startFloorName == data.dataItems[0].attributes.START_POINTF_NAME) {
								
								switchMap(data.dataItems[i].attributes.START_POINT_KEY);
		                        sFloorId = data.dataItems[i].attributes.START_POINT_KEY;
		                        sx=data.dataItems[i].attributes.START_POINTX;
		                        sy=data.dataItems[i].attributes.START_POINTY;
		                        $("#end_btn").css("background-image","url(./images/js_img/zhong.png)");
		                        Map.ManageClick.startPoint([sx, sy]);
		                        var oMask_bg = document.querySelector('#mask_bg');
                                var oZheZhao = document.querySelector('#mask');
                                oZheZhao.style.display = 'block';
                                oMask_bg.style.display = 'block';
		                        window.setTimeout("getPointXY(" + endPointCode+ ",'end')", 3200);
		                        return;
							}
						}
                    }else if (type == 'end' && endFloorName && startFloorName && endPointCode && startPointCode ) {
                    	
                    	for ( var i = 0; i < data.dataItems.length; i++) {
							if (endFloorName == data.dataItems[i].attributes.END_POINTF_NAME) {
								tx=data.dataItems[i].attributes.END_POINTX;
                                ty=data.dataItems[i].attributes.END_POINTY;
                                if(data.dataItems[i].attributes.END_POINT_KEY==sFloorId){  //起点唯一，同楼层导航
                                    if (sFloorId != floorId) {
                                        switchMap(sFloorId);
                                    };
                                    //alert(sx+"--"+sy +"--/--"+tx+"--"+ty);sFloorId
                                    Map.ManageClick.startPoint([sx, sy]);// getLately(sx, sy)
                                    Map.ManageClick.endPoint([tx, ty]);
                                    showPiont([sx, sy],[tx, ty]);
                                    $("#tFloor_btn,#arrow1").hide();
                                    return;
                                }else{    //跨楼层导航，通过电梯或者楼梯中转
                                    var name = aFloors[data.dataItems[0].attributes.END_POINT_KEY];
                                    $("#tFloor_btn").data("floorId",data.dataItems[0].attributes.END_POINT_KEY);
                                    $("#tFloor_btn").html(name);
                                    $("#sFloor_btn").css({"background-color":"#FFF","color": "#555"});
                                    $("#tFloor_btn").css({"background-color":"","color": "#FFF"});
                                    $("#tFloor_btn,#arrow1").show();
                                    tmp_tx=tx;
                                    tmp_ty=ty;
                                    if (sx != -101 && sy != -101) {     //已有起点
                                        Map.ManageClick.startPoint([sx, sy]);
                                        $("#mask,#myCar").hide();
                                    };
                                    tmpPoint = getLately(sx, sy,point_data.elevator || point_data.stairs);
                                    Map.ManageClick.endPoint(tmpPoint);
                                    showPiont([sx, sy],tmpPoint);
                                }
                                var oMask_bg = document.querySelector('#mask_bg');
                                var oZheZhao = document.querySelector('#mask');
                                oZheZhao.style.display = 'none';
                                oMask_bg.style.display = 'none';
                                return;
							}
						}
                    }else if (type == 'end' && endFloorName && startFloorName && endPointCode && startPointCode ) {
                        for (var i = 0; i < data.dataItems.length; i++) {
                            seekList[i] = data.dataItems[i].attributes;
                            var name = aFloors[floorId];
                            $("#sFloor_btn").data("floorId",floorId);
                            $("#sFloor_btn").html(name);
                            if(data.dataItems.length == 1){  //起点唯一
                                tx=data.dataItems[0].attributes.END_POINTX;
                                ty=data.dataItems[0].attributes.END_POINTY;
                                if(data.dataItems[0].attributes.END_POINT_KEY==sFloorId){  //起点唯一，同楼层导航
                                    if (sFloorId != floorId) {
                                        switchMap(sFloorId);
                                    };
                                    //alert(sx+"--"+sy +"--/--"+tx+"--"+ty);sFloorId
                                    Map.ManageClick.startPoint([sx, sy]);// getLately(sx, sy)
                                    Map.ManageClick.endPoint([tx, ty]);
                                    showPiont([sx, sy],[tx, ty]);
                                    $("#tFloor_btn,#arrow1").hide();
                                    break;
                                }else{    //跨楼层导航，通过电梯或者楼梯中转
                                    var name = aFloors[data.dataItems[0].attributes.END_POINT_KEY];
                                    $("#tFloor_btn").data("floorId",data.dataItems[0].attributes.END_POINT_KEY);
                                    $("#tFloor_btn").html(name);
                                    $("#sFloor_btn").css({"background-color":"#FFF","color": "#555"});
                                    $("#tFloor_btn").css({"background-color":"","color": "#FFF"});
                                    $("#tFloor_btn,#arrow1").show();
                                    tmp_tx=tx;
                                    tmp_ty=ty;
                                    if (sx != -101 && sy != -101) {     //已有起点
                                        Map.ManageClick.startPoint([sx, sy]);
                                        $("#mask,#myCar").hide();
                                    };
                                    tmpPoint = getLately(sx, sy,point_data.elevator || point_data.stairs);
                                    Map.ManageClick.endPoint(tmpPoint);
                                    showPiont([sx, sy],tmpPoint);
                                }
                                
                            }else{      //  跨楼层导航处理
                                $("#mask,#myCar").show();
                                setCarList(seekList);
                            }
                        };
                    }

                }else{
                    poptip(data.message+":没有你所找的位置");
                    return;
                }
            }
        }
    });
}
function getLately(x,y,_data){
    var k = 0;
    if (_data.length > 0) {
        var d=Number.MAX_VALUE;
        for (var i = _data.length - 1; i >= 0; i--) {
            var _d=Map.MapTools.getDistance(_data[i].boundLeft,_data[i].boundTop,x,y);
            d =  _d < d ? _d : d;
            if (_d <= d) {
                d = _d ;
                k=i;
            };
        };
    }
    return [_data[k].boundLeft,_data[k].boundTop];
}
function showPiont(point1,point2){
    //把终点图片div显示
    var oEnd = document.querySelector('#imgTwo');
    //把起始图片div显示
    var oStart = document.querySelector('#imgOne');
    if (point1 != null) {
        Map.StaticGPS.changePosPoint(oStart, point1);
        $("#imgOne").show();
    };
    if (point2 != null) {
        Map.StaticGPS.changePosPoint(oEnd, point2);
        $("#imgTwo").show();
    };
}

//弹出层，不同楼层同名车位列表
var setCarList = function(_data) {
    $('#carList').empty();
    var id = 0;
    var tempCode = _data[0].END_POINT_ID;
    for (var i = 0; i < _data.length; i++) {
        var temp = _data[i];
        $('div#myCar > h3').html("我的车停在");
        var tp = $("<li id='" + id + "'>" + "<p class='textbox'><span class='icon'></span>" + "<span class='txt' ><label id='floorName'></label>" + "<span class='txt' ><label id='areaName'></label>" + "<span class='font1' id='carName'></span>" + "</span>" + "</p></li>");
        tp.find('#floorName').html(temp.END_POINTF_NAME).removeAttr('id');
        tp.find('#areaName').html(temp.END_POINTA_NAME).removeAttr('id');
        tp.find('#carName').html(temp.END_POINT_NAME);
        $('#carList').append(tp);
        $("li#" + id).data({"id":temp.END_POINT_ID,"tx":temp.END_POINTX,"ty":temp.END_POINTY,"tFloorId":temp.END_POINT_KEY,"tname":temp.END_POINTF_CODE});
        id++;
    }

    //选择准确的起始目标车位。
    $('#carList li').bind(
        'click',
        function() {
            tFloorId = $(this).data("tFloorId") || '';
            var  tx = $(this).data("tx") || 0;
            var  ty = $(this).data("ty") || 0;
            if (tFloorId) {
                $("#mask,#myCar").hide();
                if (tFloorId == floorId) {   //同楼层导航
                    $("#tFloor_btn,#arrow1").hide();
                    Map.ManageClick.startPoint([sx, sy]);
                    Map.ManageClick.endPoint([tx, ty]);
                    showPiont([sx, sy] ,[tx, ty]);
                    return;
                }else{
                    switchMap(sFloorId);
                   var name = aFloors[tFloorId];
                    $("#tFloor_btn").data("floorId",tFloorId);
                    $("#tFloor_btn").html(name);
                    $("#sFloor_btn").css({"background-color":"#FFF","color": "#555"});
                    $("#tFloor_btn").css({"background-color":"","color": "#FFF"});
                    $("#tFloor_btn,#arrow1").show();
                    tmp_tx=tx;
                    tmp_ty=ty;
                    if (sx != -101 && sy != -101) {     //已有起点
                        Map.ManageClick.startPoint([sx, sy]);
                        $("#mask,#myCar").hide();
                    };
                    if (tx != 0 && ty != 0) {     //已有起点
                        Map.ManageClick.startPoint([sx, sy]);
                        $("#mask,#myCar").hide();
                    };
                    tmpPoint = getLately(sx, sy,point_data.elevator || point_data.stairs);
                    Map.ManageClick.endPoint(tmpPoint);
                    showPiont([sx, sy],tmpPoint);
                    return;
                }
            };
        });
};
function get_point_data(li){
    switch (li) { //以下处理页面其他点击事件  
        case 'elevator':  //电梯
            _point_data=point_data.elevator;
            break;
        case 'restroom':   //洗手间
            _point_data=point_data.restroom;
            break;
        case 'exit':      //出口
            _point_data=point_data.exit;
            break;
        case 'stairs':  //楼梯
            _point_data=point_data.stairs;
            break;
        case 'pay':      //收费处
            _point_data=point_data.pay;
            break;
        default:
            break;
    }
    return  _point_data;
}
//切换楼层
function switchMap(fId){
    floorId = fId;
    loadRegion();
    var oDefaultBtn = document.querySelector('#defaultBtn');
    var name = aFloors[fId];
    oDefaultBtn.innerHTML = name;
    Map.ManageClick.bClickBtn = !Map.ManageClick.bClickBtn;
}

