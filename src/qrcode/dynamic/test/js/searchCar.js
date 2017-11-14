var regionId , floorId , region ,park_id;
function getInfo() {
	var objWx = {};
	var temp;
	//var _url = getBasePath()+'/jspsn/parkApp/signature.servlet';

	objWx.url=location.href.split("#")[0];
	$.ajax({
		url: getBasePath()+"/parkApp/signature.servlet",
		type: "GET",
		dataType: "json",
		async: false, //同步异步
		data:objWx,
		success: function (data) {
			if (data != null) {
				temp =data;
				sAppId = 'wx2ff4146b4ff05f2d';
				iTimestamp =  temp.timestamp;
				sNonceStr = temp.noncestr;
				sSignature = temp.signature;
			 	wx.config({
			 		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			 		appId: sAppId, // 必填，公众号的唯一标识
			 		timestamp: iTimestamp, // 必填，生成签名的时间戳
			 		nonceStr: sNonceStr, // 必填，生成签名的随机串
			 		signature: sSignature, // 必填，签名，见附录1
			 		jsApiList: ['checkJsApi', 'getNetworkType', 'getLocation', 'startSearchBeacons', 'onSearchBeacons', 'stopSearchBeacons'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			 	});

			 	wx.ready(function() { // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				 	getWxLocation();
				 });
			 	wx.error(function(msg){
			 		alert(msg);
			 	});

			}else{
				alert('数据获取失败!');
			}
		},
		error:function() {
			alert('数据获取失败!signature.error');
		}
	});
};

//客户端检测
var OSType;
(function(){
	var ua = navigator.userAgent;

	if(ua.match(/iPhone|iPod/i) != null){
		OSType = 'iPhone';
	} else if (ua.match(/Android/i) != null){
		OSType = 'Android';
	}
})();

var startSearch = function() {
	wx.startSearchBeacons({
		ticket: "",
		complete: function(argv) {
			// debug.log('aaa:'+ JSON.stringify(argv));
			if (argv) {
				if(argv.errMsg == 'startSearchBeacons:ok'){
					//poptip("startSearch----ok");
					wx.onSearchBeacons({
				 		complete: function(argv) {
				 			if (argv.beacons != null) {
				 				var beacons = argv.beacons;
				 				var value = "";
				 				for (var i = 0; i < beacons.length; i++) {
				 					value += beacons[i].major + "-" + beacons[i].minor + ":" + beacons[i].rssi + ", ";
				 				}
				 				var beaconParas = JSON.stringify(argv.beacons);
								var _url='http://wx.indoorun.com/locate/locating';
				 				var param = 'regionId=' + regionId + '&openId=wx_jieshun_oBt8bt705v9gdG_FFrJPqkR6pgx0' + '&gzId=' + 'ewr2342342' + '&floorId=' + floorId + '&OSType=' + OSType + '&beacons=' + beaconParas;
				 				$.ajax({
									url: getBasePath() + "/httpRequest.servlet", //地址
									type: 'post', //提交方式 可以选择post/get 推荐post
									async: false, //同步异步
									data:{url:_url,param:param},
									dataType: 'json', //返回数据类型
									success: function(ret) {
										//debug.log(ret.code);
										//poptip( ret);
					 					if (ret.code == "success") {
					 						var sFloorld = ret.floorId;
					 						poptip( sFloorld);
					 						 sx = ret.x;   //作为起点
					 						 sy = ret.y;
					 						 park_id = sessionStorage.getItem("selectParkId") || $("#payParking").find("option:first-of-type").attr("parking_id");
					 						 sessionStorage.setItem("park_id",park_id);
					 						window.location.href =  getBasePath() +"/html/dynamic/navitest.htm?unionid=" + window.jspsnQueryOpen() + "&regionId="+regionId+"&floorId="+sFloorld;
					 					}else{
					 						//poptip('000!');
					 					}
				 					},
									error:function() {
										alert('数据获取失败!locating');
										return;
									}
								});
				 			}
				 		}
				 	});
				} else {
					return false;
				}
			}
		}
	});
};
function onComplete(_latitude,_longitude){
    var lng =_longitude ;
    var lat =_latitude ;
    var PARKNAME_URL = getBasePath()+"/parkApp/queryParkByPosition.servlet";
    //alert(window.jspsnQueryOpen());
   // var param = 'unionid=' + $_GetRequest().unionid + '&longitude=' + lng + '&latitude=' + lat + '&beforelongitude=' + lng + '&beforelatitude=' + lat + '&synch_signal=' + new Date().getTime() ;
    //var param = 'unionid=oUjGnjl9WS9FBL2pA7faM4SpRXy0&longitude=114.0616&latitude=22.570597&beforelongitude=114.0616&beforelatitude=22.570597&synch_signal=' + new Date().getTime() ;
    $.ajax({
        url : PARKNAME_URL,
        cache : false,
        data : {
            unionid : window.jspsnQueryOpen() ,
            longitude : lng,
            latitude : lat,
            beforelongitude : lng,
            beforelatitude : lat,
            synch_signal: new Date().getTime() + ''
        },
        dataType : 'json',
        type:'post',
        success : function(data) {
        	loadPark(data);
        	if (data.resultCode == "0" && data.dataItems !="" && data.dataItems.length > 0) {
        		region = data.dataItems[0].attributes.name; //默认取第一个车场


	            /*data=JSON.stringify(data);
	            sessionStorage.setItem("nearPark", data);*/
	            getRegions(region);
	            loadFloor(regionId);
	            //alert(floorId);
	            wx.ready(function() { // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				 	//startSearch();
				 	wx.stopSearchBeacons({
				 		complete: function(res) {
				 			// alert(JSON.stringify(res));
				 			startSearch();
				 		}
				 	});
				 });
	            //data=JSON.parse(data);
	           /* alert(getBasePath() +"/dynamic/navitest.htm?unionid=" + window.jspsnQueryOpen() + "regionId="+getRegions(region)+"&floorId="+loadFloor(getRegions(region)));*/
	           //window.location.href =  getBasePath() +"/html/dynamic/navitest.htm?unionid=" + window.jspsnQueryOpen() + "&regionId="+getRegions(region)+"&floorId="+loadFloor(getRegions(region));
	            
	        }else{   //定位不到车场
	        	//window.location.href =  getBasePath() +"/html/dynamic/navitest.htm?unionid=" + window.jspsnQueryOpen() + "&regionId="+getRegions('525子系统')+"&floorId="+loadFloor(getRegions('525子系统'));
	        	/*window.location.href =  getBasePath() +"/html/dynamic/navitest.htm?unionid=" + window.jspsnQueryOpen() + '&regionId=14537712611408427&floorId=14537712631242004&ticket=wx_jieshun_oBt8bt705v9gdG_FFrJPqkR6pgx0';*/
	        return;
	        }

     	},
        error : function(XMLHttpRequest, textStatus) {
            alert('搜索不到附近的停车场0');
        }
    });
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
                for ( var i = 0; i < data.regions.length; i++) {
                    if (data.regions[i].name == region) {
                        regionId = data.regions[i].id;
                        break;
                    }
                }
            }
        }
    });
}

function loadFloor(regionId){
	//获取所有展商信息
	(function(){
	    var url = 'http://wx.indoorun.com/wx/getRegionInfo';
	    var param = 'regionId=' + regionId || '';
	    //alert(getRegions());
		$.ajax({
			url: getBasePath() + "/httpRequest.servlet", //地址
			type: 'post', //提交方式 可以选择post/get 推荐post
			async: false, //同步异步
			data:{url:url,param:param},
			dataType: 'text', //返回数据类型
			success: function(str) {
		        str = str.replace(/\n/g, '');
		        var data = eval('(' + str + ')');
		        if (data != null) {
		          if (data.code == "success") {
		            floorId = data.data.floorList[0].id;//默认取缔一个楼层
		            //alert(floorId);
		          }
		        }
		     },
		    error:function(str) {
	          alert('楼层信息获取失败!'+str);
	      	}
		});
	})();
};

//获取经纬度方法
function getWxLocation() {
	wx.getLocation({
		success: function(res) {
			 latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
			 longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
			var speed = res.speed; // 速度，以米/每秒计
			var accuracy = res.accuracy; // 位置精度
			//alert('longitude=' + longitude + ', latitude=' + latitude + ', speed=' + speed + ', accuracy=' + accuracy);
			onComplete(latitude,longitude);
		},
		cancel: function(res) {
			alert('用户拒绝授权获取地理位置');
		},
		fail: function(res) {
			alert(JSON.stringify(res)+"getWxLocation");
		}
	});
}
function loadPark(data){
    /*data = sessionStorage.getItem("nearPark");
    data=JSON.parse(data);*/
    //var parkOption = $("#payParking").find("option:first-of-type");
    if (data.resultCode == "0" && data.dataItems !="" && data.dataItems.length > 0) {
        $("#payParking").empty();
        if (data.dataItems.length > 1) {
        	$(".icon_flag").show();
    	};
        //alert(111);
        for(var i=0;i<data.dataItems.length;i++){
        
            var tmp = "";
                tmp = $("<option "
                +" park_code='"+data.dataItems[i].attributes.park_code
                +"' parking_id='"+data.dataItems[i].attributes.id+"' value='"+data.dataItems[i].attributes.name+"'>"+data.dataItems[i].attributes.name+"</option>");
            $("#payParking").append(tmp);
        }
        if($("#payParking").find("option:first-of-type").html() == "" || $("#payParking").find("option:first-of-type").html() == null){
            $("#payParking").find("option:first-of-type").html(data.dataItems[0].attributes.name).val(data.dataItems[0].attributes.name);
        }
        if($("#payParking option").length > 1){
            $("#payParking").addClass("icon_arrowdown").removeAttr("disabled");
        }
    }else{
        $("#payParking").find("option:first-of-type").html('搜索不到附近的停车场');
    }
}

$(function() {

	park_id = sessionStorage.getItem("selectParkId") || $("#payParking").find("option:first-of-type").attr("parking_id");
	var parkingName = sessionStorage.getItem("parkingName");
	if (park_id) {
		$("#payParking").find("option:first-of-type").attr("parking_id",park_id);
		$("#payParking").find("option:first-of-type").html(parkingName || "请选择附近的停车场");
	};

	var end_input = localStorage.getItem("endinput");
	$("#input_locatNo").val(end_input);
	var start_input = localStorage.getItem("startinput");
	$("#input_carNo").val(start_input);
	//切换停车场
	$(".icon_edit").click(function() {
		var endinput = $("input#input_locatNo").val();
		var startinput = $("input#input_carNo").val();
		localStorage.setItem("endinput", endinput);
		localStorage.setItem("startinput", startinput);
		var host = window.location.href.split("html")[0];
		if(location.href.indexOf('from=') > -1){
			var fromUrl = location.href.split("from=")[1].substr(0,3);
		}
		if(fromUrl && fromUrl == "JTC"){
			window.location.href = host + "sy_html/map.html?from=JTC&unionid=" + window.jspsnQueryOpen();
		}else{
			window.location.href = host + "sy_html/map.html?unionid=" + window.jspsnQueryOpen();
		}
	});
	$("#selectCar").hide();
	$("#input_clr").show();
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


	//提交事件
	$("#btn_searchCar").click(function() {
		var endinput = $("input#input_locatNo").val();
		var startinput = $("input#input_carNo").val();
		localStorage.setItem("endinput", endinput);
		localStorage.setItem("startinput", startinput);
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
		carNoList.length = 6;
		if (flag) {
			var reg = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[a-zA-Z_0-9_\u4e00-\u9fa5]$|^WJ[\u4e00-\u9fa5]{1}[-]{0,1}[a-zA-Z_0-9]{5}$/;
			var carNo = $("#input_locatNo").val();
			if (!reg.test(carNo)) {
				poptip("车牌号无效，请重新输入");
				return;
			}
			/*if($.inArray(carNo,carNoList) == -1){
				carNoList.unshift(carNo);	
			}
			carNoList.length = 6;*/
		}
		localStorage.setItem('carNoList', carNoList);
		$("div#pop").show();
		start_point_code = $("input#input_carNo").val();

		region = parkingName || $("#payParking").find("option:first-of-type").html();
		if (region != "") {
			getRegions(region);
		}else{
			poptip("请选择停车场！");
			return false;
		}
		park_id = $("#payParking").find("option:first-of-type").attr("parking_id");
		var parkingName = sessionStorage.getItem("parkingName");
		sessionStorage.setItem("park_id",park_id);
		//alert(sessionStorage.getItem('park_id'));
		sessionStorage.setItem("parkingName",parkingName);
		loadFloor(regionId);
		window.location.href =  getBasePath() +"/html/dynamic/navitest.htm?unionid=" + window.jspsnQueryOpen() + "&regionId="+regionId+"&floorId="+floorId;

	});
	//清除输入
	$("#input_clr").click(function() {
		$("#input_locatNo").val("").focus();
		$(this).hide();
		if (carNoList != "" && carNoList != null) {
			fillRecord();
		}
		$('#selectCar').show();
	});

	//修改附近停车场
	$(".icon_flag").click(function() {
		$("#payParking").focus();
	});

	//清除搜索历史
	$(".btn_clr").click(function() {
		$("#historyBox").empty();
	});
	getInfo();
	$("#pop").hide();
});