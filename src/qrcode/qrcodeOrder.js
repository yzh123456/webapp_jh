if(document.referrer == "")
    pushHistory();
window.addEventListener("popstate", function(e) {
   if($("#payError").css("display") != "none" && $("#payError article h4").html() == "超时缴费不支持卡券"){
	   window.location.reload();
   }else if(document.referrer == ""){
	   if(ua.match(/MicroMessenger/i)=="micromessenger") {
		   WeixinJSBridge.call('closeWindow');
	   } else if(ua.indexOf("alipay")!=-1){
		   AlipayJSBridge.call('closeWebview');
	   }else if(ua.indexOf("baidu")!=-1){
		   BLightApp.closeWindow();
	   }else{
		   window.close();
	   }
	}
}, false);  
function pushHistory() {
	var state = {
		title: "title",
		url: "#"
	};
	window.history.pushState(state, "title", "#");
}

//选择优惠券
var couponId = '';
var discountId = '';
var sec=0;
//支付跳转链接
var orderNo="";
var PayUrl = getBasePath() + "/qPayOrder.WXServlet";
var couponUrl = getBasePath() + "/addcoupon";  //缴费成功，优惠券领用地址
var usecouponUrl = getBasePath() + "/usecoupon";  //优惠券使用地址
var park_code = localStorage.getItem('park_code');
var businesser_code = localStorage.getItem('businesser_code');
var parkId = "";
var userId = GetRequest ().USER_ID || "";
var seconds = 120;// 发送验证码按钮120秒失效常量
var count = seconds; // 倒计时秒数
var timeout; // 定时器
var mouny = 0;
var couponStatus = "false"; // 判断是否已经使用了云平台优惠劵
var thirdCouponStatus = "false";// 判断是否已经使用了第三方优惠劵
var smallTicket = "false";// 判断是否已经使用了小票
var integralDeduction = "false";// 判断是否已经使用了积分
var tckNo = "";
var coupontype = "";
var thirdcouponlist = "";
var couponmode = "";
var couponlimit = "";
var dues= "";
var serviceTime = 0;
var serviceFee = 0;
var phone = "";
var off = "false";
var checkBoxed = "true";
var derail = "false";
var orderCountDown ;    //订单倒计时定时器
var couponbox_id = '';  //已选择优惠券id
//积分项目小票号、手机号、车牌号等正则校验
var regCarNo = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[a-zA-Z_0-9_\u4e00-\u9fa5]$|^WJ[\u4e00-\u9fa5]{1}[-]{0,1}[a-zA-Z_0-9]{5}$/;
var regPhone = /^1[3|4|5|7|8]\d{9}$/;
var regPeopleNo = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
var regIntegralNo = /^[a-zA-Z0-9_-]*$/;
var regTitelckNo = /^[a-z,A-Z0-9_-]*$/;
var openid=GetRequest().clientId;        //微信openid
var parkcode=GetRequest().key?GetRequest().key.split(',')[1]:"";  //停车场编号
var soure='WX';
var orderKey = GetRequest().key;//生产订单的key值

//getJspsnURL();  //获取H5发布地址
gotoPay();      //生成订单
integralOff();   //积分使用初始化
ruleSource();    // 规则初始化
//微信环境下，页面鉴权
if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	signature();      //页面鉴权，用于调起微信/支付宝扫一扫
}


//支付成功后领取优惠券
function receiveCoupon(){
	var objAdd = {
		dataItems: []
	};
	var attrAdd = {
		attributes: {
			userId:userId,
			parkid:parkId,
			tel:GetRequest().TEL,
			SOURCE:"JSLIFE",
			synch_signal: new Date().getTime() + ''
		}
	};
	objAdd.dataItems.push(attrAdd);
	$.ajax({
		url : JspsnURL + "XmppServer.servlet",
		cache : false,
		data:{
			serviceId:"ac.coupon.sy_executecoupondraw",
			dataItems:JSON.stringify(objAdd.dataItems)
		},
		dataType : 'json',
		type:'post',
		success : function(data) {
			getAttention(parkId);
			if (data.resultCode == "0" && data.dataItems != null
					&& data.dataItems.length > 0) {
				$("#payok").show();
				$(".share span").text(data.dataItems[0].attributes.coupon_name);
				$(".coupon_valitime span").text(data.dataItems[0].attributes.end_time);
				var mode = data.dataItems[0].attributes.discount_mode;
				if(mode == 0){
					$(".coupon_many").text("￥"+data.dataItems[0].attributes.amount);
				}else if(mode == 1){
					$(".coupon_many").text(GetTime(data.dataItems[0].attributes.amount));
				}else if(mode == 2){
					$(".coupon_many").text("全免");
				}
			}else{
				$(".payok").hide();
				//getAttention();
			}
		}
	});
}
//时间解析 传入小时数
function GetTime(seconds){
	
	if(0 == seconds){
		return "0";
	}
	//获取天数
	var day = parseInt(seconds/24);
	//获取小时数
	var hour = parseInt(seconds%24);

	if(day == 0 ){
		return hour+"小时";
	}else if(day != 0 && hour != 0){
		return day + "天" +hour+"小时";
	}else if(day != 0 && hour == 0){
		return day + "天";
	}

}
//时间解析 传入秒数
function GetTimeShow(seconds){
	
	if(0 == seconds){
		return "0";
	}
	//获取天数
	var day = parseInt(seconds/(3600*24));
	//获取小时数
	var h_s = parseInt(seconds%(3600*24));
	var hour = parseInt(h_s/3600);
	//获取分钟数
	var m_s = parseInt(h_s%3600);
	var min = parseInt(m_s/60);
	//获取秒数
	var sec = seconds - day*(3600*24)- 3600*hour - 60*min;
	
	if(sec>0){
		sec=0;
		min=min+1;
		if(min>=60){
			min=min-60;
			hour=hour+1;
			if(hour>=24){
				hour=hour-24;
				day=day+1;
			}
		}
	}
	if(day == 0 && hour == 0){
		return min+"分";
	}else if(day == 0 && hour != 0){
		return hour+"小时"+min+"分";
	}else{
		return day+"天"+hour+"小时"+min+"分";
	}

}
//立即缴费
function payParkingCharge(){
	$("#btn_payPark").css({"disabled":"true","background-color":"#999"}).attr("onclick","");
    PayUrl = PayUrl + "?orderNo=" + orderNo;
	var orderPage = {
        orderKey:orderKey,
        PayUrl:PayUrl+"&isForcePay=1",
        orderTimeOut:(parseInt($(".pay_normal #mm").text().trim())*60 + parseInt($(".pay_normal #ss").text().trim()) - 10 ) || "165",
		orderUrl:location.href
	};
	window.sessionStorage.removeItem("orderPage");
    window.sessionStorage.setItem("orderPage",JSON.stringify(orderPage));
	//window.location.href=PayUrl;
	//alert(window.location.href)
	window.location.replace(PayUrl);
	// localStorage.setItem("_url",location.href);
	window.event.returnValue = false;
}

//选择优惠券列表  
function loadCouponList(){
	$("#pop").show();
	var result ='';
	var obj = {
		dataItems: []
	};
	var attr = {
		attributes: {
			userid : userId,
			tel:GetRequest().TEL || "",
			park_code:"",
			synch_signal: new Date().getTime() + ''
		}
	};
	obj.dataItems.push(attr);
	$.ajax({
		url: JspsnURL + "XmppServer.servlet",
		cache: false,
		async : true,
		data:{
			serviceId:"ac.coupon.sy_getdrawgivequeryinfo",
			dataItems:JSON.stringify(obj.dataItems)
		},
		type:'post',
		dataType: 'json',
		success: function(data) {
			$("#selectcoupon ul").empty().append('<li style="position:relative;"><label style="width:100%"><title style=\"line-height:0.4rem;\" id="">不使用优惠券</title><div class="border_unred_top"></div><div class="border_unred_botton"></div><div class="border_left"></div>');
			var thirdcouponlist = $("#selectcoupon ul").data("thirdcouponlist");//加载第三方卡券列表
			$("#selectcoupon ul").append(thirdcouponlist);
			if (data && data.dataItems && data.dataItems.length > 0) {
		    	result = data.dataItems;
		    	for(var i=0;i<result.length;i++){
		    		var text = '';
		    		if(result[i].attributes.coupon_status!=1 || new Date(result[i].attributes.stop_time.replace(/-/g,'/')).getTime() < new Date().getTime() || result[i].attributes.status == 1){
		    			continue;
		    		}
		    		for(var k=0;k<result[i].subItems.length;k++){
		    			if(result[i].subItems[k].attributes.park_code != parkcode){
		    				continue;
		    			}
		    			var _text = "";
						if(result[i].attributes.coupon_num != "" || result[i].attributes.coupon_num != null){  // 有券
							text += '<li style="position:relative;"><label>'
								 text+='<title  style="line-height: 0.4rem;" id="'+ result[i].attributes.id +'">'+ result[i].attributes.couponname +'</title>'
								_text ='<div class="border_red_top"></div><div class="border_red_botton"></div>';
						}else{  //无券
							text = '<li style="position:relative;"><label style="width:40%">'
							text+='	<title style=\"line-height:0.92rem;\" id="">不使用优惠券</title>';
							_text ='<div class="border_unred_top"></div><div class="border_unred_botton"></div><div class="border_left"></div>';
						}					
						// 时间+金额
							text+='<div class="border_red_top"></div><div class="border_red_bottom"></div>	<span>有效期至' 
								+ (result[i].attributes.stop_time).substring(0,10).replace(/-/g,"/")
								+'</span></label><div class="num">'
						if(result[i].attributes.mode == 2){ //全免
							text+= '全免'
						}
						if(result[i].attributes.mode == 1){ // 时间
							text+= result[i].attributes.coupon_money + '小时' 
						}
						if(result[i].attributes.mode == 0){ // 金额
							text+= '￥' + result[i].attributes.coupon_money.toFixed(2)
						}
						text+= '</div>'
						text+= _text
						if(result[i].attributes.id == couponbox_id){
							text+= '<div class="radio radio_checked"></div></li>';
						}else{
							text+= '<div class="radio radio_none"></div></li>';
						}
						if($('#selectcoupon ul')==[]){
							$("#selectcoupon ul").append('<li style="position:relative;"><label style="width:100%"><title style=\"line-height:0.4rem;\" id="">不使用优惠券</title><div class="border_unred_top"></div><div class="border_unred_botton"></div><div class="border_left"></div>');
						}
						$('#selectcoupon ul').append(text);
		    		}
		    	}
		    	$("#selectcar").hide();
		    	if($("#selectcoupon li").length < 2){
		    		$(".pay_coupon span").attr("id","couponNull").html("没有可用优惠券").css("color","#999");
		    		$("#payCouponList .pay_coupon").unbind("click");
		    	}else if(couponStatus != "true" && (thirdCouponStatus != "true" && integralDeduction != "true" && smallTicket != "true")){
		    		$(".pay_coupon span").html("有券可用<i id='point'>.</i>").css("color","#9adb43");
		    	}
			}else {
				if($("#selectcoupon li").length < 2){
		    		$(".pay_coupon span").attr("id","couponNull").html("没有可用优惠券").css("color","#999");
		    		$("#payCouponList .pay_coupon").unbind("click");
		    	}
			}
			$("#pop").hide();
            clickHander();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			$("#pop").hide();
			if($("#selectcoupon li").length < 2){
	    		$(".pay_coupon span").attr("id","couponNull").html("没有可用优惠券").css("color","#999");
	    		$("#payCouponList .pay_coupon").unbind("click");
	    	}
		}
	});
}

//使用优惠券
function couponUse(){
	$.ajax({
		url : usecouponUrl,
		cache : false,
		data : {
			unionid : userId,
			couponId : couponId,
			discountId : discountId,
			orderNo : orderNo
		},
		dataType : 'json',
		type:'post',
		success : function(data) {
			//卡券已使用，不作处理
		}
	});
}

//关注公众号
function getAttention(parkId){
	var obj  = {};
	obj.parkid = parkId;
	$.ajax({
		url: getBasePath()+"/pkextend",
		type: "GET",
		dataType: "json",
		data:obj,
		success: function (data) {
			if (data) {
				$(".attention").show();
				$(".quickexit").html(data.quickexit);
				$("#a a").html(data.attention_remark).show();
				if(data.attention_photo != '' && data.attention_photo != null){
					$("#qr").show();
					$(".attentionPhoto").show();
					//test code 获取关注公众号二维码
					//$(".attentionPhoto").attr("src","http://merchant.jslife.com.cn:7105/merchant/image.servlet?filePath="+data.attention_photo);
					$(".attentionPhoto").attr("src",getBasePath()+"/imget?filePath="+data.attention_photo);
				}else{
					$("#qr").hide();
					$(".attentionPhoto").hide();
					$(".attentionPhoto").attr("src","");
				}
				$(".attentionUrl").attr("href",data.attention_url);
				//$("#btn_know").hide();   //我知道了按钮
			}else{
				$(".attention").hide();
				//$("#btn_know").show();
			}

			/*if (data) {             //旧代码保留
				$(".attentionUrl").show();
				$(".quickexit").html(data.QUICKEXIT);
				$(".attentionRemark").html('<u>'+ data.ATTENTION_REMARK +'</u>');
				if(data.ATTENTION_PHOTO != '' && data.ATTENTION_PHOTO != null){
					$(".attentionPhoto").attr("src",url+"imget?filePath="+data.ATTENTION_PHOTO);
				}else{
					$(".attentionPhoto").attr("src","");
					$(".attentionPhoto").hide();
				}
				$(".attentionUrl").attr("href",data.ATTENTION_URL);
				$("#btn_know").hide();
			}else{
				$(".attentionUrl").hide();
				//$("#btn_know").show();
			}*/
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			$(".quickexit").hide();		
		}
	});
}

//超时滞留时间倒计时  
function ShowCountDown(){
	var m = parseInt($("#mm").html())*60;
	var s = parseInt($("#ss").html()||0);
	var leftTime = m+s;
	$("#timeCount,#timeCount label#timeOut").show();
	$("#timeCount label#pip").html("您的<span>免费离场</span>时间剩余:");
	if(leftTime <= 0)
	{
		clearTimeout(orderCountDown);
		$("#timeCount label#pip").html("您的超时滞留时间已过，请退出重新缴费");
		$("#timeCount #timeOut").hide();
		return
	}
	leftTime--;  
   $("#mm").html(parseInt(leftTime / 60));
    leftTime %= 60;
   $("#ss").html(leftTime);
	clearTimeout(orderCountDown);
	orderCountDown = setTimeout('ShowCountDown()',1000);
}

//免费停车时间已结束倒计时 
function ShowCountDown2(minute,free_minute){
	var second = parseInt(minute)*60;
	var minute = "";
	minute = Math.floor(second/60);
	//旧代码暂时保留
	//$("#timeCount").html("您的<span>免费时长</span>时间剩余:<label>"+minute+1+"分"+"0秒</label>");
	$("#timeCount,#timeCount label#timeOut").show();
	$("#timeCount label#pip").html("您的<span>免费停车</span>时间剩余:");
	$(".pay_normal title").html("进场"+ (free_minute || minute) +"分钟内免费");
	/*if(minute<10){    //旧代码暂时保留
		$("#nopayTitle").html("<strong>00:0"+minute+":00</strong>").css({"color":"#9adb43"});
	}else{
		$("#nopayTitle").html("<strong>00:"+minute+":00</strong>").css({"color":"#9adb43"});
	}*/
	minute = Math.floor(second/60)-1;
	var dingshi = window.setInterval(
		function(){
			if(second < 1 && minute < 1){
				clearInterval(dingshi);
				$("#timeCount label#timeOut").hide();
				$("#timeCount label#pip").html("您的免费停车时间已结束，请退出重新缴费");
				//$("#nopayTitle").html("请退出重新缴费").removeAttr("style");
				return false;
			}else{
				second--;
				second = Math.floor(second%60);
				if(second<0){
					second = second+60;
					minute--;
				}
				$("#mm").html(minute);
			    $("#ss").html(second);
			    //旧代码暂时保留
				/*if(minute<10 && second<10){
					$("#mm").html(minute);
				    $("#ss").html(second);
					//$("#timeCount lable").html("<strong>00:0"+minute+":0"+second+"</strong>").css({"color":"#9adb43"});
				}else if(minute<10 && second>=10){
					//$("#timeCount lable").html("<strong>00:0"+minute+":"+second+"</strong>").css({"color":"#9adb43"});
				}else if(minute>=10 && second<10){
					//$("#timeCount lable").html("<strong>00:"+minute+":0"+second+"</strong>").css({"color":"#9adb43"});
				}else{
					//$("#timeCount lable").html("<strong>00:"+minute+":"+second+"</strong>").css({"color":"#9adb43"});
				}*/
				//$(".pay_nofee title").html("免费停车倒计时");
			}
		}, 1000
	); 
}

//订单有效时间倒计时
function setCountDown(){
	var m = parseInt($("#mm").html())*60;
	var s = parseInt($("#ss").html());
	var leftTime = m+s;
	$("#timeCount,#timeCount #timeOut").show();
	$("#timeCount label#pip").html("缴费时间剩余：");
	if(leftTime <= 0)
	{
		$("#timeCount label#pip").html("订单已过期，请退出重新缴费");
		$("#timeCount #timeOut").hide();
		$("#btn_payPark").css({"disabled":"true","background-color":"#999"}).attr("onclick","");
		clearTimeout(orderCountDown);
		return
	}
	leftTime--;
   $("#mm").html(parseInt(leftTime / 60));
    leftTime %= 60;
   $("#ss").html(leftTime);
	
	clearTimeout(orderCountDown);
	orderCountDown = setTimeout('setCountDown()',1000);
}

//查询抵扣规则接口( 我方规则 )
function ounerRule (){
    $.ajax({
		url : getBasePath() + "/queryIntegralRule.servlet",  
		cache : false,
		data : {
			unionid : userId,
			PARK_ID : parkId
		},
		dataType : 'json',
		type:'post',
		timeout:10000,
		success : function(data) {
		    if(data && data.resultCode==0 && data.dataItems && data.dataItems.length>0){
		    	var html = "";
		        for(var i=0;i<data.dataItems.length;i++){
					var integralNum = data.dataItems[i].attributes.INTEGRAL_NUM;
					var deductionNum = "";
					var ruleName = data.dataItems[i].attributes.RULE_NAME;
					var deductionRuleParam = data.dataItems[i].attributes.DEDUCTION_RULE;
					var deductionRule ="";
					if(deductionRuleParam==0){
					   deductionRule="金额";
					   deductionNum=data.dataItems[i].attributes.DEDUCTION_NUM+"元";
					}else if(deductionRuleParam==1){
					   deductionRule="时间";
					   deductionNum=data.dataItems[i].attributes.DEDUCTION_NUM+"小时";
					}
					
					html += '<li><div class="div1" name="'+ruleName+'"><div>'+getStrSub(ruleName,19)+'</div></div>'+
						        '<div class="div2"><div>'+deductionRule+'</div></div>'+
								'<div class="div3" integralNum="'+data.dataItems[i].attributes.INTEGRAL_NUM+'"><div>'+integralNum+'</div></div>'+
								'<div class="div4" deductionNum="'+data.dataItems[i].attributes.DEDUCTION_NUM+'"><div>'+deductionNum+'</div></div>'+
								'</li>';
			    }
		        $(".our_rules ul").append(html);
		    }else{
		    	 $(".our_rules ul").html("");
			     $(".our_rules ul").append("<div>管理方正在完善积分规则，请稍后再试。</div>");
		    }
		},
		error:function(){
			$(".our_rules ul").html("");
		    $(".our_rules ul").append("<div>管理方正在完善积分规则，请稍后再试。</div>");
		}
    });
}

//获取去重复的小票号，返回数组形式
function getArrDff(a,b){
	/*var a = [1,2,3,4,5,6,7];   //test code
	var b = [1,2,5];*/
	var c = [];
	var tmp = a.concat(b);
	var o = {};
	for (var i = 0; i < tmp.length; i ++) (tmp[i] in o) ? o[tmp[i]] ++ : o[tmp[i]] = 1;
	for (x in o) if (o[x] == 1) c.push(x);
	return c
}
//去处取出相同元素（交集元素）
function _unique(arr) {
    var n = []; //一个新的临时数组
	for(var i = 0; i < arr.length; i++) //遍历当前数组
	{
		//如果当前数组的第i已经保存进了临时数组，那么跳过，
		//否则把当前项push到临时数组里面
		if (n.indexOf(arr[i]) == -1)
		    n.push(arr[i]);
	}
	return n;
}
//获取用户输入的小票号
function getTicket(){
	var _tckNo = $(".integral_input5").val().replace(/，/g,",");
	var s = $(".stk");
	var regTitelckNo = /^[a-z,A-Z0-9_-]*$/;
	
	$(".integral_input5").val(_tckNo);//获取用户输入的小票号

	if (regTitelckNo.test(_tckNo)) {  //校验小票号合法性
		var _titelckNo = _unique(_tckNo.split(","));   //小票号去重复
		if(s.length>0){                      //小票号使用判定
			for(var i=0;i<s.length;i++){
				if (_titelckNo.length > 0) {
					for ( var tn in _titelckNo ) {
						if(_titelckNo[tn]==s.eq(i).val()){
							//tckNo = s.eq(i).val(); //test code
							poptip("你输入的小票号包含了已使用的小票号，请检查输入");
							return;
						}
						_titelckNo.push(s.eq(i).val());
					}
				}				
			}
		}
	}
	_titelckNo = _unique(_titelckNo.join(",").split(",")).join(",");
	tckNo = _titelckNo;
	return _titelckNo;
}

//全部抵扣费用确认
function paySuccessComfirm(surplus_minute){
	$.ajax({
		url: getBasePath()+"/paySuccess.servlet",
		type: "POST",
		dataType: "json",
		data:{ORDER_NO :orderNo},
		timeout:10000,
		success: function (data) {
			
			if(data.resultCode == 0){
				clearTimeout(orderCountDown);
				$("#mm").html(surplus_minute);
				$("#ss").html(0);
				ShowCountDown();
				$(".mask-new").hide();
				$('<style>.pay_details_num:before{content:""}</style>').appendTo('head');
				
				$("#parkFeeMsg").html("已缴费");
				
				$("#btn_payPark").hide();
				$(".pay_details").siblings().hide();
				$("#payCouponList,#timeCount,#smallTicket,#discountFeeList").hide();
				$("#scanpage").find("#btn_know").siblings().hide();
				$(".pay_normal title").html("您当前的停车费用已全额优惠");

				$("#scanpage").show();
				$("#btn_know").show();
				// $("#payok").show();  //支付成功页面
				// $("#payok .pay_details_message").text("请直接取车离场");
				// $("#payok .pay_details p:first-of-type").html("限时<span>"+ free_minute +"</span>分钟，超时将重新计费");
			}
			
		}
	});
}

//关闭页面
function closePage(){
	if(navigator.userAgent.indexOf('MicroMessenger')!=-1){
		WeixinJSBridge.call('closeWindow');	
	}else{
		window.close();
		window.history.go(-1);
	}
}

//查询会员积分接口
function checkIntegral() {
	$.ajax({
		url: getBasePath() + "/queryMemberInt.servlet",//地址
		data: {
			MEMBER_NO : $(".integral_input1").val().trim(),  // 会员号
	        PARK_ID : parkId              //停车场ID
		},
		timeout:10000,
		dataType: 'json',//返回数据类型
		success: function (data) {
			if(data && data.resultCode=="0" && data.dataItems && data.dataItems.length>0){
				$("body").unbind("click");
				if($(".pay_integral h4").attr("send_code_direction")=="1"||$(".pay_integral h4").attr("send_code_direction")=="2"){
					phone = data.dataItems[0].attributes.PHONE;
					$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick","");
				}else{
					//如果不使用验证码，监听积分失焦
					loadbody3();//积分查询成功，启动积分输入框失焦监听
				}
				var html = "";
		   		html = '<div class="full">'+'<div class="check_box"></div>'+
               '<span style="float: left;margin-left: 0.6rem;line-height: 0.6rem;">全额抵扣</span>'+
               '</div><span style="float: left;height: 0.6rem;line-height: 0.6rem;margin-left: 0.2rem;font-size:0.26rem;">需要抵扣积分 '+
               '<span class="deduction"></span></span>';
                $(".integral_input3").parent().removeClass("hide");
                $(".integral_deduction").html("");
                $(".integral_deduction").append(html);
                $(".span").remove();
	        	$(".pay_integral").append('<span class="span">总积分<span id="totolIntegralCount"> '+data.dataItems[0].attributes.INTEGRAL_BALANCE+'</span></span>');
	        	if($(".our_rules ul li .div1").length>1){
		        	var tmp = false;
	        		$(".our_rules ul li .div1").each(function(){
						var str = $(this);
						//  根据积分规则名称判断取那条规则进行判断
						if(data.dataItems[0].attributes.LEVEL==$(this).attr("name")){
							var integralNum = str.parents("li").find(".div3").attr("integralNum");
						    var deductionNum = str.parents("li").find(".div4").attr("deductionNum");
							var totolIntegralCount = parseInt($("#totolIntegralCount").html()); //  总积分
							//  提示的积分数
						    if( str.parents("li").find(".div2 div").html() =="金额" ){
								 // 减免金额
								 // 总积分可以抵扣几次
								if(Math.floor(serviceFee/deductionNum)>Math.floor(totolIntegralCount/integralNum)){
									mouny = Math.floor(totolIntegralCount/integralNum)*integralNum;
								}else{
									mouny = Math.floor(serviceFee/deductionNum)*integralNum;
								}
							}else{
								//  减免时间
								if(Math.floor((serviceTime/3600)/deductionNum)>Math.floor($("#totolIntegralCount").html()/integralNum)){
									mouny = Math.floor($("#totolIntegralCount").html()/integralNum)*integralNum;
								}else{
									mouny = Math.floor((serviceTime/3600)/deductionNum)*integralNum;
								}
							}
						    $(".deduction").html(mouny);
							$(".integral_input3").val(mouny);
							$(".integral_input3").focus();
								tmp = true;//存在会员等级规则
								return false;
						}
					});
					if (!tmp) {
						poptip("管理方正在完善积分规则，请稍后再试。");
					}
	        	}else{
	        		poptip("管理方正在完善积分规则，请稍后再试。")
		        		$(".integral_input3").attr("disabled","disabled");
	        	}
				 if($(".pay_integral h4").attr("send_code_direction")=="1"||$(".pay_integral h4").attr("send_code_direction")=="2"){
                    	$(".integral_input2").removeClass("hide");
                    	$(".count_down").removeClass("hide");
                    	clearTimeout(timeout);
    					count = 120;
                    	BtnCount();
                    }
		        	
					// 将会员ID存进标签属性中
					$(".pay_integral h4").attr("level",data.dataItems[0].attributes.LEVEL);
					// DEDUCTION_MODE==1 表示部分抵扣
					if(data.dataItems[0].attributes.DEDUCTION_MODE==1){
						integralCheckBox();
					}else if(data.dataItems[0].attributes.DEDUCTION_MODE==0){
						//我方规则 没有验证码输入框，且全额抵扣
						if($("#scanpage").attr("rule_source")=="0"){
							$(".integral_input3").attr("readonly","readonly");
							if($(".integral_input2").hasClass("hide")){
								$(".integral_input3").focus();
								$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick","");
							}
							}else{
								$(".integral_input3").attr("readonly","readonly");
								integralCheckBox();
						}
					}
				$(".integral_deduction").removeClass("hide");
			}else{
				$(".integral_input3").parent().addClass("hide");
				$(".integral_input3").val("");
				$(".pay_integral span").remove();
				$(".integral_deduction").empty();
				if(data.message) 
				poptip(data.message);
			}
		},

		error:function(){
			poptip("积分查询失败，请稍后再试。");
		}
	});
};

//查询会员优惠
function queryMemberRefrence() {
	$.ajax({
		url: getBasePath() + "/queryMemberRefrence.servlet",//地址
		data: {
			MEMBER_NO : $(".integral_input1").val().trim(),  // 会员号
			DUES : serviceFee,
			PARK_ID : parkId
		},
		async: false,//同步异步
		dataType: 'json',//返回数据类型
		timeout:10000,
		success: function (data) {
			if(data&&data.dataItems&&data.dataItems.length>0){
				$("body").unbind("click");
				if($(".pay_integral h4").attr("send_code_direction")=="1"||$(".pay_integral h4").attr("send_code_direction")=="2"){
					phone = data.dataItems[0].attributes.PHONE;
					$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick","");
				}else{//如果不使用验证码，监听积分失焦
					loadbody3();//积分查询成功，启动积分输入框失焦监听
				}
	   		   var html = '<div class="full">'+'<div class="check_box"></div>'+
               '<span style="float: left;margin-left: 0.6rem;line-height: 0.6rem;">全额抵扣</span>'+
               '</div><span style="float: left;height: 0.6rem;line-height: 0.6rem;margin-left: 0.2rem;font-size:0.26rem;">需要抵扣积分 '+
               '<span class="deduction"></span></span>';
                $(".integral_input3").parent().removeClass("hide");
                $(".integral_deduction").html("");
                $(".integral_deduction").append(html);
                $(".span").remove();
	        	//$(".pay_integral").append('<span class="span">总积分<span id="totolIntegralCount"> '+data.dataItems[0].attributes.INTEGRAL_BALANCE+'</span></span>');
	        	
				 if($(".pay_integral h4").attr("send_code_direction")=="1"||$(".pay_integral h4").attr("send_code_direction")=="2"){
                    	$(".integral_input2").removeClass("hide");
                    	$(".count_down").removeClass("hide");
                    	BtnCount();
                    }
				 $(".integral_input3").val(data.dataItems[0].attributes.DEDUCTION_INTEGRAL);
				 //积分对方规则多传参数：
				 couponmode = data.dataItems[0].attributes.MODE;
				 couponlimit = data.dataItems[0].attributes.CONSUMPTION;
				 coupontype = 2;
				$(".integral_deduction").removeClass("hide");
			}else{
				$(".integral_input3").parent().addClass("hide");
				$(".integral_input3").val("");
				$(".pay_integral span").remove();
				$(".integral_deduction").empty();
				if(data.message) 
				poptip(data.message);
			}
		},
		error:function(){
			poptip("积分查询失败，请稍后再试。");
		}
	});
}

function poptip(mess) {
	$("#poptip").html(mess);
	$("#poptip").fadeIn(400, function() {
		setTimeout(function() {
			$("#poptip").fadeOut('slow');
		}, 1200);
	});
};
//点击积分开关设置事件监听
function integralOff(){
	$(".pay_integral .set_on").click(function(){
		//if(derail=="false"){               //此处条件不明作用，暂注释处理
		var placeholder = $(".integral_input1").attr("placeholder");
		if ($(this).hasClass("set_off")) {
			if ($(".integral_input3").parent().hasClass("hide") && $(".integral_input3").val().trim() == "") {//监听会员模式下页面所有点击事件
				loadbody1();
			}else if ($(".pay_integral h4").attr("send_code_direction")!="1"&&$(".pay_integral h4").attr("send_code_direction")!="2") {
				loadbody3();
			}
			
			$(this).removeClass("set_off");
			$(this).parents(".pay_integral").find("h4").html(placeholder);
			$(".span").removeClass("hide");
			$(".integral_input").removeClass("hide");
			$(".integral_deduction").removeClass("hide");
			$(".integral_input1").parent().removeClass("hide");
			if($("#selectcoupon li").length < 2){
	    		$(".pay_coupon span").attr("id","couponNull").html("没有可用优惠券").css("color","#999");
	    		$("#payCouponList .pay_coupon").unbind("click");
	    	}else{
	    		//改为有券可用
	    		$(".pay_coupon span").html("有券可用<i id='point'>.</i>").css("color","#9adb43");
	    		//$(".pay_coupon span").html("不使用优惠劵").css("color","#999");
	    	}
			
			$(".pay_coupon span").attr("disabled", "disabled");
			off = "true";
			//用于判断点击积分开关时记录支付按钮的状态，在关闭开关按钮时退回支付按钮的显示状态
            if($("#btn_payPark").attr("onclick")!=""){
                sessionStorage.setItem("payStatus","true");
            }else{
                sessionStorage.setItem("payStatus","false");
			}
		} else {
			$("body").unbind("click");
			//if($("#selectcoupon li").length > 1)
			$(this).addClass("set_off");
			$(this).parents(".pay_integral").find("h4").html("不使用积分抵扣");
			if($("#selectcoupon li").length < 2){
	    		$(".pay_coupon span").attr("id","couponNull").html("没有可用优惠券").css("color","#999");
	    		$("#payCouponList .pay_coupon").unbind("click");
	    	}else if(couponStatus != "true" && (thirdCouponStatus != "true" && integralDeduction != "true" && smallTicket != "true")){
	    		$(".pay_coupon span").html("有券可用<i id='point'>.</i>").css("color","#9adb43");
	    	}
			$(".integral_input").addClass("hide");
			$(".integral_deduction").addClass("hide");
			$(".span").addClass("hide");
			$(".pay_coupon span").removeAttr("disabled");
			off = "false";
            if(sessionStorage.getItem("payStatus")=="true"){
                $("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");//归还支付点击事件
            }else{
                $("#btn_payPark").css({"disabled" : "none","background-color" : "#999"}).attr("onclick","");//归还支付点击事件
			}

		}
		//}
		return false;
	});
}

// 点击抵扣规则
function ruleSource(){
	$(".interal_rule").click(function(){
		if($(".integral_rule").siblings().find("li").length < 2){
			poptip("管理方正在完善积分规则，请稍后再试");
			return false;
		}
    	// 我方
    	if($("#scanpage").attr("rule_source")=="0"){
    		$(".our_rules").removeClass("hide");
    		$(".our_rules_other").addClass("hide");
    		$(".zhegai").removeClass("hide");
    	}else{
    	// 对方
    		$(".our_rules_other").removeClass("hide");
    		$(".our_rules").addClass("hide");
    		$(".zhegai").removeClass("hide");
    	}
    	return false;
    });
}


//发送验证码定期器计时任务方法
function BtnCount() {
//	timeout = setTimeout(BtnCount, 1000); // 1s执行一次BtnCount test code
	// 启动按钮
	if (count == 0) {
		$('.count_down').css({"background":"#A79C95","color":"#fff"});
		$('.count_down span').html("0");
		clearTimeout(timeout);// 取消由 setTimeout() 方法设置的 timeout
		count = seconds;
	} else {
		$('.count_down').css({"background":"#A79C95","color":"#fff"});
		$('.count_down span').html("请等待(" + count.toString() + ")");
		count--;
		timeout = setTimeout(BtnCount, 1000);
	}
};

//微信js鉴权，调用扫一扫
function signature(){
	var objWx = {};
	objWx.url=location.href.split("#")[0];
	objWx.appType= GetRequest().APP_TYPE || "WX_JTC";
	//获取捷停车发布地址
	$.ajax({
		url: JspsnURL + "signature.servlet",
		type: "GET",
		dataType: "json",
		data:objWx,
		success: function (data) {					
			var temp =data;
			wx.config({
			    debug: false,
			    appId: data.appId || '', 
			    timestamp: temp.timestamp, 
			    nonceStr: temp.noncestr, 
			    signature: temp.signature,
			    jsApiList: ['scanQRCode','closeWindow'] //朋友圈、微信好友、QQ
			});
		}
	});
}

//  点击全额抵扣单选框
function integralCheckBox(){
	$(".check_box").click(function(){
		if(checkBoxed=="true"){
			var checkBox = $(this);
		    if( $(this).hasClass("check_box_no") ){
			    $(this).removeClass("check_box_no");
			    $(".integral_input3").attr("readonly","readonly");
			    $(".integral_input3").attr("disabled","disabled");
			}else{
				checkBox.addClass("check_box_no");
				$(".integral_input3").removeAttr("readonly","readonly");
				$(".integral_input3").removeAttr("disabled","disabled");
			}
		}
		return false;
	});
}
/**
 * 截取过长字符串并返回
 * @param  {[type]} str  [description]
 * @param  {[type]} size [description]
 * @return {[type]}      [description]
 */
function getStrSub(str,size) {  
    myLen = 1;
    _str='';
    i = 0; 
    if (!str || str == '') {
    	_str == '--';
	}else {
		 for (; i < str.length; i++) {  
             if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            	 myLen++;
            	 if(myLen<size)
            		 _str += str.charAt(i);
             } else  {
            	 myLen += 2;
            	 if(myLen<size)
            		 _str += str.charAt(i);
             }
        } 
        if (myLen >= size && _str.indexOf('...') == -1) {
        	_str += '...';
		}
	}
    return _str;  
}
/**
 * 判断是否是车牌缴费
 * @return {Boolean} [description]
 */
function isCarNo() {
	var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼澳港使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1,2}$/;
	//正则检验是否是车牌缴费
	if (GetRequest().key && GetRequest().key.split(",").length > 2
		&& reg.test(GetRequest().key.split(",")[2].replace(/\-/g,"")) ) {
		return true;
	}else if(window.sessionStorage.getItem("key")
        && reg.test(window.sessionStorage.getItem("key").split(",")[2].replace(/\-/g,""))
        && ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
	}
	return false;
}

//调用摄像头扫码
function scan(str) {
    wx.scanQRCode({
	    needResult:1,  //默认为0，扫描结果由微信处理，1则直接返回扫描结果。
		scanType:["qrCode","barCode"],//可以指定扫二维码还是一位马，默认二者都有，
		success:function(res){
		      var result = res.resultStr;//当needResult为1时，扫码返回的结果
		      result = result.split(",").length > 1?result.split(",")[1]:result.split(",")[0];
		      str.val(result).focus();
		}
	});
}

/**
 * 会员号输入框事件注册
 * @return {[type]} [description]
 */
function loadbody1() {
    $("body").unbind("click").click(function(e) {
    	if ($(".integral_input1").val() != "" && !(e.target.className.indexOf("set_on") > -1)
    			&& !(e.target.className.indexOf("integral_input1") > -1)
    			&& !(e.target.className.indexOf("integral_input2") > -1)
    			//&& $(".input_lable").hasClass("hide") 
    			&& !(e.target.className.indexOf("interal_rule") > -1)
    			 ) {
    		$(".integral_input1").removeData("focus");
    		loadIntegral();
		}
    });
}
//验证会员号查询会员积分
function loadIntegral() {
    if( $(".integral_input1").attr("placeholder").indexOf("会员号") >-1){
		if($.trim($(".integral_input1").val())!=""){
			if (!regIntegralNo.test($(".integral_input1").val())) {
				poptip("会员号无效，请重新输入");
				return;
			}else{
				if($("#scanpage").attr("rule_source")=="0"){
					checkIntegral();
				}else if($("#scanpage").attr("rule_source")=="1"){//对方规则 
					queryMemberRefrence();
				}
				return;
			}
    	}else{
    		poptip("请输入会员号");
    	}
	}else if( $(".integral_input1").attr("placeholder").indexOf("手机号") >-1){
		if($.trim($(".integral_input1").val())!=""){
			if (!regPhone.test($(".integral_input1").val())) {
				poptip("手机号无效，请重新输入");
				return;
			}else{
				if($("#scanpage").attr("rule_source")=="0"){
					checkIntegral();
				}else if($("#scanpage").attr("rule_source")=="1"){//对方规则 
					queryMemberRefrence();
				}
				return;
			}
    	}else{
    		poptip("请输入手机号");
    	}
	}else if( $(".integral_input1").attr("placeholder").indexOf("车牌号") >-1){
		if($.trim($(".integral_input1").val())!=""){
			if (!regCarNo.test($(".integral_input1").val())) {
				poptip("车牌号无效，请重新输入");
				return;
			}else{
				if($("#scanpage").attr("rule_source")=="0"){
					checkIntegral();
				}else if($("#scanpage").attr("rule_source")=="1"){//对方规则 
					queryMemberRefrence();
				}
				return;
			}
    	}else{
    		poptip("请输入车牌号");
    	}
	}else if( $(".integral_input1").attr("placeholder").indexOf("身份证") >-1){
		if($.trim($(".integral_input1").val())!=""){
			if (!regPeopleNo.test($(".integral_input1").val())) {
				poptip("身份证号无效，请重新输入");
				return;
			}else{
				if($("#scanpage").attr("rule_source")=="0"){
					checkIntegral();
				}else if($("#scanpage").attr("rule_source")=="1"){//对方规则 
					queryMemberRefrence();
				}
				return;
			}
    	}else{
    		poptip("请输入身份证号");
    	}
	}
}
/**
 * 积分数输入框事件
 */
function loadbody3() {
    $("body").unbind("click").click(function(e) {
    	if ($(".integral_input3").val() != "" && !(e.target.className.indexOf("set_on") > -1)
    			&& !(e.target.className.indexOf("integral_input3") > -1)
    			&& !$(".integral_input3").css("display").indexOf("none") > -1
    			&& !(e.target.className.indexOf("integral_input1") > -1)
    			&& !(e.target.className.indexOf("full") > -1)
    			&& !(e.target.className.indexOf("integral_input2") > -1 )) {
    		$(".integral_input3").removeData("focus");
    		loadInput3Blur();
		}
    	return false;
    });
}
function loadInput3Blur() {
	if( $(".integral_input2").hasClass("hide") ){
		if($(".integral_input3").val().trim()!=""){
			if($(".our_rules ul li .div1").length>1){
        		$(".our_rules ul li .div1").each(function(){
					var str = $(this);
					if($(".pay_integral h4").attr("level")==$(this).attr("name")){
						var integralNum = str.parents("li").find(".div3").attr("integralNum");
						var deductionNum = str.parents("li").find(".div4").attr("deductionNum");
						if( str.parents("li").find(".div2 div").html() =="金额" ){
							if(Math.floor(parseInt($(".integral_input3").val())/integralNum)>Math.floor($("#totolIntegralCount").html()/integralNum)){
								mouny = Math.floor($("#totolIntegralCount").html()/integralNum)*integralNum;
							}else{
								mouny = Math.floor(parseInt($(".integral_input3").val())/integralNum)*integralNum;
							}
						}else{
					//  减免时间
							if(Math.floor(parseInt($(".integral_input3").val())/integralNum)>Math.floor($("#totolIntegralCount").html()/integralNum)){
								mouny = Math.floor($("#totolIntegralCount").html()/integralNum)*integralNum;
							}else{
								mouny = Math.floor(parseInt($(".integral_input3").val())/integralNum)*integralNum;
								//mouny = Math.floor((serviceTime/3600)/deductionNum)*integralNum;
							}
						}
						$(".integral_input3").val(mouny);
					}
        		})
			}
		}
	}else{
		if($(".integral_input3").val().trim()!=""&&$(".integral_input2").val().trim()!=""){
			if($(".our_rules ul li .div1").length>1){
        		$(".our_rules ul li .div1").each(function(){
					var str = $(this);
					if($(".pay_integral h4").attr("level")==$(this).attr("name")){
						var integralNum = str.parents("li").find(".div3").attr("integralNum");
						var deductionNum = str.parents("li").find(".div4").attr("deductionNum");
						if( str.parents("li").find(".div2 div").html() =="金额" ){
							if(Math.floor(parseInt($(".integral_input3").val())/integralNum)>Math.floor($("#totolIntegralCount").html()/integralNum)){
								mouny = Math.floor($("#totolIntegralCount").html()/integralNum)*integralNum;
							}else{
								mouny = Math.floor(parseInt($(".integral_input3").val())/integralNum)*integralNum;
							};
						}else{
					//  减免时间
							if(Math.floor(parseInt($(".integral_input3").val())/integralNum)>Math.floor($("#totolIntegralCount").html()/integralNum)){
								mouny = Math.floor($("#totolIntegralCount").html()/integralNum)*integralNum;
							}else{
								mouny = Math.floor(parseInt($(".integral_input3").val())/integralNum)*integralNum;
								//mouny = Math.floor((serviceTime/3600)/deductionNum)*integralNum;
							};
						}
						$(".integral_input3").val(mouny);
					}
        		});
			}
		}
	}
	if ($(".integral_input3").val().trim()=="0") {
		poptip("您提交的积分数低于最小抵扣数，无法使用积分！");
		return;
	}else if ($(".integral_input3").val().trim() >= $(".integral_deduction .deduction").html().trim() && $("#scanpage").attr("rule_source")!="1") {
		$(".integral_input3").val($(".integral_deduction .deduction").html().trim());
	}
	//  调用订单接口
	couponId="";
	smallTicket = "false";// 判断是否已经使用了小票
	integralDeduction = "true";// 判断是否已经使用了积分
	couponStatus ="false";
	gotoPay(couponId);
	$("#pop").show();
	//$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");   //test code
}
//  点击遮盖层
$(".zhegai").click(function(){
	$(".our_rules_other").addClass("hide");
	$(".our_rules").addClass("hide");
	$(this).addClass("hide");
	return false;
});

//输入会员号请求积分接口
$(".integral_input1").focus(function() {
	if(/*couponStatus != "true" &&*/ (thirdCouponStatus != "true" && integralDeduction != "true" && smallTicket != "true")){
		$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick","");
	}
	
	$(".integral_input1").data("value",$(this).val().trim());
})
.blur(function(){
	//$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");
	if ($(".integral_input1").data("value") != $(this).val().trim()) {
		//修改会员号，重新查询积分
		loadbody1();
	}
	$(".integral_input1").removeData("value");
	$(".integral_input1").data("focus",true);
});

//积分数输入框失焦事件注册
$(".integral_input3").focus(function() {
	$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick","");
	$(".integral_input3").data("value",$(this).val().trim());
})
.blur(function(){
	//$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");
	if ($(".integral_input3").data("value") != $(this).val().trim() &&  
    		$(".pay_integral h4").attr("send_code_direction")!="1"&&$(".pay_integral h4").attr("send_code_direction")!="2") {
		//修改会员号，重新查询积分
		loadbody3();
	}
	$(".integral_input3").removeData("value");
});

//验证码输入框失焦事件
$(".integral_input2").blur(function(){
	if($(".integral_input2").val().trim()==""){
		poptip("验证码为空，请输入验证码");
		$("body").unbind("click");
		return;
	}
	
	if($(".integral_input3").val().trim()!=""){
		if($(".our_rules ul li .div1").length>1){
    		$(".our_rules ul li .div1").each(function(){
				var str = $(this);
				if($(".pay_integral h4").attr("level")==$(this).attr("name")){
					var integralNum = str.parents("li").find(".div3").attr("integralNum");
					var deductionNum = str.parents("li").find(".div4").attr("deductionNum");
					if( str.parents("li").find(".div2 div").html() =="金额" ){
						if(Math.floor(parseInt($(".integral_input3").val())/integralNum)>Math.floor($("#totolIntegralCount").html()/integralNum)){
							mouny = Math.floor($("#totolIntegralCount").html()/integralNum)*integralNum;
						}else{
							mouny = Math.floor(parseInt($(".integral_input3").val())/integralNum)*integralNum;
						}
					}else{
				//  减免时间
						if(Math.floor(parseInt($(".integral_input3").val())/integralNum)>Math.floor($("#totolIntegralCount").html()/integralNum)){
							mouny = Math.floor($("#totolIntegralCount").html()/integralNum)*integralNum;
						}else{
							mouny = Math.floor(parseInt($(".integral_input3").val())/integralNum)*integralNum;
								//mouny = Math.floor((serviceTime/3600)/deductionNum)*integralNum;
						}
					}
					$(".integral_input3").val(mouny);
				}
    		})
		}
		
		if ($(".integral_input3").val().trim()=="0") {
			poptip("您提交的积分数低于最小抵扣数，无法使用积分！");
			return;
		}else if ($(".integral_input3").val().trim() >= $(".integral_deduction .deduction").html().trim() && $("#scanpage").attr("rule_source")!="1"  ) {
			$(".integral_input3").val($(".integral_deduction .deduction").html().trim());
		}
		//  调用订单接口
		couponId="";
		smallTicket = "false";// 判断是否已经使用了小票
		integralDeduction = "true";// 判断是否已经使用了积分
		couponStatus ="false";
		gotoPay(couponId);
		//$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");
		$("#pop").show();
	}else{
		$("body").unbind("click");
	}
});
$(".integral_input3,.integral_input2").focus(function() {
	$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick","");
});
/**
 * 验证码输入焦点事件
 * @param  {[type]} ){	$("#btn_payPark").css({"disabled" :             "true","background-color" : "#999"}).attr("onclick","");} [description]
 * @return {[type]}                                        [description]
 */
$(".integral_input5").focus(function(){
	$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick","");
});
//输入小票号 
$(".integral_input5").blur(function(){
	setTimeout(function () {   //延时归还点击事件，解决失焦事件冲突
		$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");
	},200);
	
	//判断抵扣规则是否为空
	if($(".our_rules ul li").length<2 && $(".our_rules_other ul li").length>1){
		poptip("管理方正在完善积分规则，请稍后再试");
		return false;
	}
	//判断是否有多张小票
    couponId="";
	var s = $(".stk");
	var titelckNo = this.value;
	if(titelckNo==""){
		poptip("小票号不能为空，请重新输入");
		return false;
	}else{
		var _tckNo = titelckNo.replace(/，/g,",");
		tckNo = _tckNo;
		$(".integral_input5").val(_tckNo);
		if (regTitelckNo.test(_tckNo)) {
			var _titelckNo = $.unique(_tckNo.split(",")).length > 0 ?$.unique(_tckNo.split(",")):_tckNo;
			if(s.length>0){
				for(var i=0;i<s.length;i++){
					
					if (_tckNo.split(",").length > 1) {
						for ( var tn in _titelckNo ) {
							if(_titelckNo[tn]==s.eq(i).val()){
								//tckNo = s.eq(i).val();
								poptip("你输入的小票号包含了已使用的小票号，请检查输入");
								return;
							}
						}
					}
					
					if(titelckNo==s.eq(i).val()){
						//tckNo = s.eq(i).val();
						poptip("此小票你已使用，请重新输入");
						return false;
					}else{
						tckNo = $.unique(_titelckNo).join(",")+","+s.eq(i).val().trim();
					};
				};
			}
			smallTicket = "true";// 判断是否已经使用了小票
			integralDeduction = "false";// 判断是否已经使用了积分
			couponStatus ="false";
			//车牌支付订单提交
			gotoPay(couponId);
			$("#pop").show();
		}else{
			poptip("你输入的小票号无效，请重新输入");
			return false;
		}
	}
});
//输入卡券号
$(".integral_input4").blur(function(){
	setTimeout(function () {   //延时归还点击事件，解决失焦事件冲突
		$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");
	},200);
	//$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");
	if($.trim($(this).val())!=""){
		if (!regIntegralNo.test($(this).val())) {
			poptip("卡券号无效，请重新输入");
			return;
		}else{
			//获得卡券号
			var cpNo = $(".integral_input4").val();
			couponId=cpNo;
			coupontype=1;
			//couponmode 优惠方式（金额：0,时间：1） ?? 
			//车牌支付订单提交
			thirdCouponStatus = "true";
			gotoPay(couponId);
			$("#payCouponList span").html("有券可用<i id='point'>.</i>").css("color","#9adb43").attr("id","");
			//$("#payCouponList span").text("不使用优惠券").attr("id", "").css("color","#999");
			$("#pop").show();
		}
	}else{
		poptip("请输入卡卷号");
	}
});
//扫描条形码
$(".saoma").click(function(){
	var str = $(this).siblings("input");
	scan(str);
});

$("#wx_msgClear").click(function(){
	$("#wx_msg").hide();
});

function clickHander(){
	//点击选择优惠券
	$("#payCouponList .pay_coupon").unbind('click').bind('click',function(){
		if(off == "false"){
			if($("#selectcoupon").is(":visible")){
				$("#selectcoupon").hide();
				return;
			}
			$("#selectcoupon").show();
			$(".mask-new").show();
		}
	});
	$("#selectcoupon li").unbind('click').bind('click', function() {
		/*if(moveEvent == true){
			moveEvent = false;
			return false;
		}*/
		if($("#selectcoupon li").length < 2){
    		$(".pay_coupon span").attr("id","couponNull").html("没有可用优惠券").css("color","#999");
    		$("#payCouponList .pay_coupon").unbind("click");
    		return false;
    	}
		$(".mask-new").hide();
		$(this).siblings().find(".radio_checked").attr("class","radio radio_none")
			.end().find(".radio_none").removeClass("radio_none").addClass("radio_checked");
		couponId = $(this).find("title").attr("id");
		
		//清除小票优惠显示
		tckNo = "";
		$("#smallTicket > .input_lable").remove();
		smallTicket = "false";//还原小票使用状态
		integralDeduction = "false";//还原积分使用状态
		// 判断是否是第三方卡卷
		if($(this).find("#third").html()!=undefined){
			coupontype=1;
			thirdCouponStatus = "true";
			var couponbox_text = $(this).find(".num").html();
			var couponbox_limit = $(this).find(".couponLimit").html();
			couponlimit = $(this).find("#third").attr("CouponLimit");
			couponmode = $(this).find("#third").attr("Couponmode");
			var parkFee_text = $("#parkFeeMsg").text();
				couponbox_id = $(this).find("title").attr("id");
            //  金额：0,时间：1
				if(couponbox_text.indexOf("小时")>-1){
					$("#payCouponList span").text("抵扣时间"+couponbox_text).attr("id",couponbox_id).css("color","#FF6E09");
					$("#discountFeeList").show();
				}else if(couponbox_text.indexOf("￥")>-1){
					$("#payCouponList span").text("抵扣金额"+couponbox_text).attr("id",couponbox_id).css("color","#FF6E09");
					$("#discountFeeList").show();
				}else{
					$("#payCouponList span").html("有券可用<i id='point'>.</i>").css("color","#9adb43").attr("id","");
					//$("#payCouponList span").text("不使用优惠券").attr("id","").css("color","#999");
					$("#discountFeeList").hide();
				}
		}else{
			coupontype = 0;
			couponStatus = "true";
			thirdCouponStatus = "false";
			if(integralDeduction=="true"){
				//  已经使用过了积分
				$("#integralDeduction").addClass("hide");
			}
			else if(cardVolume==false){
			    //  已经使用过了卡卷
				$("#cardVolume").addClass("hide");
				
			}
			else if(smallTicket==false){
			   //  已经使用过了小票
				$("#smallTicket").addClass("hide");
			}
			var couponbox_text = $(this).find(".num").text();
			var parkFee_text = $("#parkFeeMsg").text();
				couponbox_id = $(this).find("title").attr("id");

			if(couponbox_text.indexOf("小时")>-1){
				$("#payCouponList span").text("抵扣时间"+couponbox_text).attr("id",couponbox_id).css("color","#FF6E09");
				$("#discountFeeList").show();
			}else if(couponbox_text.indexOf("￥")>-1){
				$("#payCouponList span").text("抵扣金额"+couponbox_text).attr("id",couponbox_id).css("color","#FF6E09");
				$("#discountFeeList").show();
			}else if(couponbox_text.indexOf("全免")>-1){
				$("#payCouponList span").text("全免").attr("id",couponbox_id).css("color","#FF6E09");
				$("#discountFeeList").show();
			}else{
				$("#payCouponList span").html("有券可用<i id='point'>.</i>").css("color","#9adb43").attr("id","");
				//$("#payCouponList span").text("不使用优惠券").attr("id","").css("color","#999");
				$("#discountFeeList").hide();
			}
		}
		$("#selectcoupon").hide();
		//重新获取订单
		gotoPay(couponId);
		$("#pop").show();
		return false;
	});
	//点击空白关闭遮罩
	$(".mask-new").click(function(){
		if($("#selectcoupon").is(":visible")){
			$("#selectcoupon").hide();
			$(".mask-new").hide();
		}
	});
};
 
/**
 * 生成订单函数
 * @param  {[type]} couponid [description]
 * @return {[type]}          [description]
 */
function gotoPay(couponid){
	$("#pop").show();
	var surplus_minute = '';
	var free_minute = ''; 
	var _memberNo = $(".integral_input1").val().trim();//会员号
	var _level = $(".pay_integral h4").attr("level")?$(".pay_integral h4").attr("level"):"";//会员级别
	var _deductionNum = $(".integral_input3").val().trim()!=0?$(".integral_input3").val().trim():null;//抵扣积分数
	var _vertificationCode = $(".integral_input2").val().trim();//使用积分验证码
	var _ticket_no = getTicket() || "";
	var _coupontype = coupontype;
	var _couponmode =(couponmode==null?"":couponmode);
	var _couponlimit = (couponlimit==null?"":couponlimit);
	var _thirdcouponlist = (thirdcouponlist==null?"":thirdcouponlist);
	var _couponid = (couponid==null?"":couponid);
	var payUrl = getBasePath()+'/mobileurl'; //初始化定义卡号缴费
    if( !orderKey && window.sessionStorage.getItem("key") ){
        orderKey = window.sessionStorage.getItem("key");
    }
	if (isCarNo()) {
        var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼澳港使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1,2}$/;
        if( !GetRequest().key && window.sessionStorage.getItem("key")
            && reg.test(window.sessionStorage.getItem("key").split(",")[2].replace(/\-/g,""))
			&& ua.match(/MicroMessenger/i) == 'micromessenger' ){
        	orderKey = encodeURIComponent(decodeURIComponent(orderKey));
        }
		payUrl = getBasePath()+'/carpayurl'; //车牌缴费URL赋值
	}
	$.ajax({
		url: payUrl,
		cache: false,
		data: {
			key:orderKey,
			unionid:userId,
			openid:GetRequest().openid,
			couponid:_couponid,
			couponId:_couponid,
			phone:phone,
		//  积分
			memberNo:_memberNo,
			level:encodeURI(_level),
			deductionNum:_deductionNum,
			vertificationCode:_vertificationCode,
		//  卡卷
			coupontype:_coupontype,
			couponmode:_couponmode,
			couponlimit:_couponlimit,
			thirdcouponlist:_thirdcouponlist,
		// 小票
			ticket_no:_ticket_no,
			dues:dues
		},
		dataType: 'json',
		success: function(data){
			$("#pop").hide();
			/**
			 * 缓存数据,用于缴费完成
			 */
			window.sessionStorage.removeItem("orderData");
			window.sessionStorage.removeItem("tel");
			window.sessionStorage.setItem("tel",GetRequest().TEL && GetRequest().TEL != "null"?GetRequest().TEL:"");
			window.sessionStorage.setItem("orderData",data?JSON.stringify(data):"");
			$("#btn_payPark").css({"disabled" : "none","background-color" : "#9adb43"}).attr("onclick","payParkingCharge();");
			if (data != null && data.resultCode != null && data.resultCode == "0" 
				&& data.dataItems != null && data.dataItems.length > 0) {
				var tmp = data.dataItems[0].attributes;
				parkId = tmp.parkId;
				dues = tmp.totalFee;
				serviceTime = tmp.serviceTime;
				free_minute = tmp.free_minute || "";
				surplus_minute = tmp.surplus_minute;  //免费离场时间
				serviceTime = tmp.serviceTime;
				serviceFee = tmp.serviceFee;
				if((thirdCouponStatus == "true" || integralDeduction == "true"||smallTicket == "true")
					&&(parseFloat(tmp.serviceFee)>parseFloat(tmp.totalFee))){
					 // 判断是否已经使用了积分或者小票, 设置进入优惠劵的入口的样式
					if(thirdCouponStatus != "true"){
						if($("#selectcoupon li").length < 2){
				    		$(".pay_coupon span").attr("id","couponNull").html("没有可用优惠券").css("color","#999");
				    		$("#payCouponList .pay_coupon").unbind("click");
				    	}else{
				    		//改为有券可用
	    					$(".pay_coupon span").html("有券可用<i id='point'>.</i>").css("color","#9adb43");
				    		//$(".pay_coupon span").html("不使用优惠劵").css("color","#999");
				    	}
					}
					$(".pay_coupon span").attr("id","couponNull");
					$("body").unbind("click");
					if(integralDeduction == "true")
					$("#payCouponList .pay_coupon").unbind("click");
					$(".pay_integral .set_on").unbind("click");
					$(".integral_input3").attr("readonly","readonly");
					$(".integral_input1").attr("readonly","readonly");
					$(".integral_input2").attr("readonly","readonly");
					checkBoxed = "false";
					$(".integral_input3").unbind("focus");
					$(".integral_input3").attr("disabled","disabled");
					$(".integral_input2").attr("disabled","disabled");
				}else if(couponStatus == "true"&&(parseFloat(tmp.serviceFee)>parseFloat(tmp.totalFee))){
					// 判断是否已经使用了优惠劵
					$(".integral_input3").parent().addClass("hide");
					$(".integral_input3").val("");
					$(".pay_integral span").remove();
					$(".integral_deduction").empty();
					$(".integral_input1").val("");
					$(".integral_input2").val("");
					$(".integral_input4").val("");
					$(".integral_input5").val("");
				}
				if (!tmp.serviceTime || tmp.serviceTime =='') {
					var endTime;
					if (tmp.endTime && tmp.endTime != '') { 
						endTime = tmp.endTime ;
					}else{
						endTime = new Date();
					};
					serviceTime = (Date.parse(new Date(endTime)) - Date.parse(new Date(tmp.startTime)))/1000; 
				};
				if(tmp.retcode == 0){
					orderNo = tmp.orderNo;
					parkcode = tmp.parkCode;
					
					//sessionStorage.setItem("parkid",parkId);
					if(tmp.totalFee==0 && tmp.discountFee>0){//卡券直接抵扣完所有停车费时
						if(smallTicket=="true"){
							$(".confirm p span").html("使用该小票，将全额抵扣停车费");
							$(".confirm").show();
							$(".mask-new").show();
						}else if(integralDeduction=="true"){
							$(".confirm p span").html("使用该积分，将全额抵扣停车费");
							$(".confirm").show();
							$("#confirm_cancel").hide();
							$("#confirm_sure").html("我知道了");
							$(".mask-new").show();
						}else{
							if(tmp.discountId != '' && tmp.discountId != null){
								discountId = tmp.discountId;
							}
							if(tmp.couponId != '' && tmp.couponId != null){
								couponId = tmp.couponId;
							}
							$("#parkFeeMsg").text(tmp.totalFee.toFixed(2));
							$("#serviceTime").text(GetTimeShow(serviceTime));
							$("#startTimePark").text((tmp.startTime).substring(0,16));
							if (isCarNo()) {
								$("#cardNoMsg").parent().hide(); //车牌缴费不显示卡号
							}else{
								$("#cardNoMsg").html(tmp.cardNo); 
							}
							if (!tmp.carNo) {
								$("#carNoMsg").parent().hide();
							}else{
								$("#carNoMsg").text(tmp.carNo);
							}
							$("#parkNameMsg").text(tmp.parkName);
							$("#paypage .surplusminute").html(free_minute);
							if(!tmp.couponId){
								$("#btn_know").show();
								$("#btn_payPark").hide();
								$("#payCouponList").hide();
								$(".pay_normal").hide();
								$(".pay_nofee").show().find("title").html("停车费");
								$("#nopayTitle").html("￥0").css({"font-size":"0.68rem","color":"#ff6e0e"});
								$("#nopayMsg").html("<s>￥"+tmp.serviceFee.toFixed(2)+"</s>");
								$("#discountFeeList").show();
								$("#discountFee").text(tmp.discountFee.toFixed(2));
							}else{
								//确认是否使用优惠
								$(".confirm").show();
								$(".mask-new").show();
							}
						}
						
					}else{
						//开始倒计时 防止查看相似车牌后没有重新倒计时
						$("#mm").html("3");
						$("#ss").html("0");
						setCountDown();
						//------------------积分对接相关 begin----------------------------------------------------------------
						if(tmp.is_integral == 1 && tmp.joint_type ==0){//小票  0
							$(".interal_rule").removeClass("hide");
							$('#smallTicket').show();
							$("#scanpage").attr("rule_source",tmp.rule_source);
							if(tmp.rule_source == 0 ){
								//我方规则
								   $(".our_rules ul").html("");
							       $(".our_rules ul").append('<li class="first_li"><div class="div1"><div>规则名称</div></div><div class="div2"><div>抵扣规则</div></div><div class="div3"><div>消费数</div></div><div class="div4"><div>抵扣数</div></div></li>');
									ounerRule();
								}else if( tmp.rule_source && tmp.rule_source == 1 ){
								//  对方规则
									$(".our_rules_other ul").html("");
								    $(".our_rules_other ul").append('<li>'+tmp.rule_remark+'</li>');
								}
							//如果使用了小票  则校验小票号的有效性
							var _tckNo = (tmp.ticket_no == "" || !tmp.ticket_no)?"":tmp.ticket_no.split(",");// tckNo.split(",");
							if(tckNo != ""){
								var arr_tmp = tckNo.split(",");
								var _tmp = getArrDff(arr_tmp,_tckNo);
								$("#smallTicket > .input_lable").remove();
								for(var tn in _tckNo){
									if (_tckNo[tn] != '') {
										var noHtml = "";
										noHtml += "<div class='input_lable'><label class='stk_label'>小票号："
	                                    + "</label><input type='text' class='_integral_input stk' readonly='readonly' value='"
	                                    + _tckNo[tn] + "'></div>";
										$("#smallTicket").append(noHtml);
									}
								}
								
								if (_tmp.length > 0 ) {
									poptip("小票号："+ _tmp.join(",") + "无效,无法享受优惠");
								}else if (_tckNo == "") {
									poptip("小票号："+ tckNo + "无效,无法享受优惠");
								}
							}
							if (smallTicket == "true") {
								$("#payCouponList span").html("有券可用<i id='point'>.</i>").css("color","#9adb43").attr("id","");
								//$("#payCouponList span").text("不使用优惠券").attr("id","").css("color","#999");
							}
							$(".integral_input5").val("");
						}else if(tmp.is_integral == 1 && tmp.joint_type ==1){//积分1
							 // 积分
							if(tmp.rule_source == 0 ){
								//我方规则
								   $(".our_rules ul").html("");
								   $(".our_rules ul").append('<li class="first_li"><div class="div1"><div>会员级别</div></div><div class="div2"><div>抵扣规则</div></div><div class="div3"><div>积分数</div></div><div class="div4"><div>抵扣数</div></div></li>');
									ounerRule();
							}else if( tmp.rule_source && tmp.rule_source == 1 ){
								//  对方规则
									$(".our_rules_other ul").html("");
								    $(".our_rules_other ul").append('<li>'+tmp.rule_remark+'</li>');
							}
							$("#smallTicket").addClass("hide");
							$("#cardVolume").addClass("hide");
							$("#integralDeduction").removeClass("hide");
							$(".interal_rule").removeClass("hide");
							if( tmp.member_mode && tmp.member_mode=="memberno" ){ //  会员号方式
							    $(".integral_input1").attr("placeholder","请输入会员号");
							    var no_title="会员号：";
								$(".integral_input1").siblings().eq(0).html(no_title);
							}else if( tmp.member_mode && tmp.member_mode=="phone" ){
							    $(".integral_input1").attr("placeholder","请输入手机号");
							    var no_title="手机号：";
								$(".integral_input1").siblings().eq(0).html(no_title);
							}else if( tmp.member_mode && tmp.member_mode=="carno" ){
							    $(".integral_input1").attr("placeholder","请输入车牌号");
							    var no_title="车牌号：";
								$(".integral_input1").siblings().eq(0).html(no_title);
							}else if( tmp.member_mode && tmp.member_mode=="cardno" ){
							    $(".integral_input1").attr("placeholder","请输入身份证号");
							    var no_title="身份证：";
								$(".integral_input1").siblings().eq(0).html(no_title);
							}
							$("#scanpage").attr("rule_source",tmp.rule_source);
							// 验证码是否隐藏
							$(".pay_integral h4").attr("send_code_direction",tmp.send_code_direction);
							if( tmp.send_code_direction && tmp.send_code_direction ==0){
							    $(".integral_input2").addClass("hide");
							    $(".count_down").addClass("hide");
							}
							/*if(tmp.send_code_direction ==2 && data.message == "validCode"){   //test code
								poptip("请输入会员手机号接收到的正确验证码"); 
							}*/
						}else if(tmp.is_integral == 1 && tmp.joint_type ==2){//卡券2
							//判断卡券使用方式(0会员号，1卡券号)
							if(tmp.coupon_use_mode == 0 &&data.dataItems&&data.dataItems.length>0
								&&data.dataItems[0].subItems&&data.dataItems[0].subItems.length>0){
								//加载第三方卡券列表
								var busList = data.dataItems[0].subItems;
								var text = "";
								var isUse = "";
								for(var i=0;i<busList.length;i++){
									thirdcouponlist +=JSON.stringify(busList[i].subItems);
									for(var j=0;j<busList[i].subItems.length;j++){
										var _text = "";										
										if(busList[i].subItems[j].attributes.CouponNo != "" || busList[i].subItems[j].attributes.CouponNo != null){  // 有券
											if(busList[i].subItems[j].attributes.CouponNo&&busList[i].subItems[j].attributes.IsUse ==1){
												isUse = '<li style="position:relative;"><label style="width:45%"><title style="line-height:0.4rem;" id="'+ busList[i].subItems[j].attributes.CouponNo +'">停车优惠劵</title><div class="border_unred_top"></div><div class="border_unred_botton"></div><div class="border_left"></div>';
											}
											text = '<li style="position:relative;"><label>';
											text+='	<title style="line-height: 0.4rem;" id="'+ busList[i].subItems[j].attributes.CouponNo +'">停车优惠劵</title>';
											_text ='<div class="border_red_top"></div><div class="border_red_botton"></div>';
										}else{  //无券
											text = '<li style="position:relative;"><label style="width:100%">';
											text+='	<title style=\"line-height:0.92rem;\" id="">不使用优惠券</title>';
											_text ='<div class="border_unred_top"></div><div class="border_unred_botton"></div><div class="border_left"></div>';
										}
										// 时间+金额
										text+='<div class="border_red_top"></div><div class="border_red_bottom"></div>	<span>有效期至'
											+ (busList[i].subItems[j].attributes.EndDate).substring(0,10).replace(/-/g,"/")
											+'</span></label><div id="third" Couponlimit ="'+busList[i].subItems[j].attributes.CouponLimit+'" CouponMode="'+busList[i].subItems[j].attributes.CouponMode+'">第三方卡券</div>';
											// 优惠方式
											if(busList[i].subItems[j].attributes.CouponMode==0){
												text+='<div class="num">￥'+busList[i].subItems[j].attributes.CouponLimit+'</div>';
											}else if(busList[i].subItems[j].attributes.CouponMode==1){
												text+='<div class="num">'+busList[i].subItems[j].attributes.CouponLimit+'小时</div>';
											}
										text+=_text;
									    if(busList[i].subItems[j].attributes.IsUse==1){
											text+= '<div class="radio radio_checked"></div></li>';
										}else{
											text+= '</div><div class="radio radio_none"></div></li>';
										}
									}
								}
								if(isUse == ""){
									$("#selectcoupon ul").empty().append('<li style="position:relative;"><label style="width:100%"><title style=\"line-height:0.4rem;\" id="">不使用优惠券</title><div class="border_unred_top"></div><div class="border_unred_botton"></div><div class="border_left"></div>');
								}else{
									$("#selectcoupon ul").empty().append(isUse);
								}
								$("#selectcoupon ul").data("thirdcouponlist",text);
							}else if(tmp.coupon_use_mode == 1){
								//卡券号
								$('#cardVolume').removeClass("hide");
								if(tmp.couponNo !="" && tmp.message != null){
									poptip(tmp.message);
								}
							}
						}
						//------------------积分对接相关 end----------------------------------------------------------------
						
						if($("#discountFeeList").is(":visible")){
							$("#nopayMsg").html($("#discountFee").html());
						}else{
							$("#nopayMsg").html('');
						}
						if(tmp.discountFee > 0){
							$("#discountFeeList").show();
							$("#discountFee").html(tmp.discountFee);
						}
						$(".pay_normal").show();
						if(tmp.serviceFee > tmp.totalFee){
							$(".pay_normal p").text("¥"+tmp.serviceFee.toFixed(2)).css("text-decoration","line-through");
						}else{
							$(".pay_normal p").empty();
						}
						$(".pay_nofee").hide();
						$(".pay_noenter").hide();
						$("#parkFeeMsg").text(tmp.totalFee.toFixed(2));
						$("#serviceTime").text(GetTimeShow(serviceTime));
						$("#startTimePark").text((tmp.startTime).substring(0,16));
						if (isCarNo()) {
							$("#cardNoMsg").parent().hide(); //车牌缴费不显示卡号
						}else{
							$("#cardNoMsg").html(tmp.cardNo); 
						}
						if (!tmp.carNo) {
							$("#carNoMsg").parent().hide();
						}else{
							$("#carNoMsg").text(tmp.carNo);
						}
						$("#parkNameMsg").text(tmp.parkName);
						$("#discountFee").text(tmp.discountFee.toFixed(2));
						$("#paypage .surplusminute").html(free_minute);
						soure="WX";
						loadCouponList(); //初始化加载
						$("#selectcoupon").hide();
					}
					/*var attentionUrl = tmp.attentionUrl;
					var attentionRemark = tmp.attentionRemark;
					var attentionPhoto = tmp.attentionPhoto;
					var quickExit = tmp.quickExit;
					localStorage.setItem("attentionUrl",attentionUrl);
					localStorage.setItem("attentionRemark",attentionRemark);
					localStorage.setItem("attentionPhoto",attentionPhoto);
					localStorage.setItem("quickExit",quickExit);*/
				}else if(tmp.retcode==9||tmp.retcode==10||/*tmp.retcode==11||tmp.retcode==12||*/tmp.retcode==13){  //11,12暂时不处理
					getAttention(tmp.parkId);
					$("#integralDeduction,#cardVolume,#smallTicket").hide();
					$("#serviceTime").text(GetTimeShow(serviceTime));
					$("#startTimePark").text((tmp.startTime).substring(0,16));
					if (isCarNo()) {
						$("#cardNoMsg").parent().hide(); //车牌缴费不显示卡号
					}else{
						$("#cardNoMsg").html(tmp.cardNo); 
					}
					if (!tmp.carNo) {
						$("#carNoMsg").parent().hide();
					}else{
						$("#carNoMsg").text(tmp.carNo);
					}
					$("#parkNameMsg").text(tmp.parkName);
					
					$("#payCouponList,#timeCount").hide();
					$("#scanpage").find("#btn_know").siblings().hide();

					$('<style>.pay_details_num:before{content:""}</style>').appendTo('head');
					$("#parkFeeMsg").html("无需缴费");
					if(tmp.retcode==9){    //固定车辆，无需缴费
						$("#parkFeeMsg").html("已缴费");
						$("#btn_know").show();
						$("#mm").html(surplus_minute);
						$("#ss").html(0);
						ShowCountDown();
					}else if(tmp.retcode==10){
						$("#nopayMsg").html("进场<em>"+free_minute + "分钟</em>内免费");
						if(free_minute=="" || free_minute=="0"){
							$("#parkFeeMsg").html("无需缴费");
						}else if(free_minute!="" && free_minute!="0" && parseInt(serviceTime/60) <= free_minute){
							ShowCountDown2(free_minute-parseInt(serviceTime/60),free_minute);
						}else{
							ShowCountDown2(free_minute);
						}
					}else if(/*tmp.retcode==11||tmp.retcode==12||*/tmp.retcode==13){   //11,12暂时不处理
						$(".pay_normal p").html("¥"+tmp.serviceFee.toFixed(2)).css("text-decoration","line-through");
						$(".pay_normal title").html("您当前的停车费用已全额优惠");
						$("#btn_know").show();
						$("#discountFeeList").show();
						$("#discountFee").text(tmp.discountFee.toFixed(2));
					}
				}else if(tmp.retcode == 2){
					$("#payError").show().siblings().hide();
					$("#payError article p").hide();
					$(".pay_noenter > p,.pay_noenter > title , #payErrorMsg").hide();
					$("#integralDeduction,#cardVolume,#smallTicket").hide();	
					if (isCarNo()) {//车牌缴费不显示卡号 
						$("#payErrorCarNoMsg").html(tmp.carNo||"-");
						$("#cardNoMsg").parent().hide(); 
						$("#payError article h4").html("车辆未入场");
					}else{
						$("#payErrorCarNoMsg").html(tmp.cardNo);
						$("#payError #payErrorCarNo").html("卡号");
						$("#payError article h4").html("此卡未入场"); 
					}

					$("#payError article p").hide();
					$(".pay_noenter > p,.pay_noenter > title , #payErrorMsg").hide();
				}else /*if(tmp.retcode == 1 || tmp.retcode==4 || tmp.retcode == 5 || tmp.retcode == 6 || tmp.retcode == 9999){*/
					if (tmp.retcode == 5) {    //月卡车
						$("#payError article h4").html("固定车辆，无需缴费");
						$("#payErrorCarNoMsg").html(tmp.carNo||"-");
						$("#payError").show().siblings().hide();
						$("#payError article p").hide();
						$(".pay_noenter > p,.pay_noenter > title , #payErrorMsg").hide();
						getAttention(tmp.parkId);
						return ;
					//}
					//$("#payError").show().siblings().hide();
				}else if(tmp.retcode == 20){         //超时缴费
					pushHistory();
					$("#payError").show().siblings().hide();
					$("#payError article p").hide();
					$(".pay_noenter > p,.pay_noenter > title , #payErrorMsg").hide();
					$("#integralDeduction,#cardVolume,#smallTicket").hide();
					$("#payError article h4").html("超时缴费不支持卡券");	
					if (isCarNo()) {//车牌缴费不显示卡号 
						$("#payErrorCarNoMsg").html(tmp.carNo||"-");
						$("#cardNoMsg").parent().hide(); 
					}else{
						$("#payErrorCarNoMsg").html(tmp.cardNo);
						$("#payError #payErrorCarNo").html("卡号");
					}
					$("#payErrorCode").html(tmp.retcode || data.resultCode).parents().show();
					$("#payError article p").html("缴费后您没有在限定时间内离场，需重新缴费");
					$(".pay_noenter > p,.pay_noenter > title ").hide();
				}else{
					if (isCarNo()) {//车牌缴费不显示卡号 
						$("#payErrorCarNoMsg").html(tmp.carNo || (GetRequest ().key?GetRequest ().key.split(",")[2]:"-"));
						$("#cardNoMsg").parent().hide(); 
					}else{
						$("#payErrorCarNoMsg").html(tmp.cardNo || (GetRequest ().key?GetRequest ().key.split(",")[2]:"10001"));
						$("#payError #payErrorCarNo").html("卡号");
					}
					$("#payErrorCode").html(tmp.retcode || data.resultCode).parents().show();
					$("#payError").show().siblings().hide();
				}
			}else if(data != null && data.resultCode != null && data.resultCode == "2019" && data.dataItems != null){//验证码校验失败
				if(data.message) poptip(data.message);
				$("#btn_payPark").css({"disabled" : "true","background-color" : "#999"}).attr("onclick", "");
			}else {
				if (isCarNo()) {//车牌缴费不显示卡号 
					$("#payErrorCarNoMsg").html(GetRequest ().key?GetRequest().key.split(",")[2]:"-");
					$("#cardNoMsg").parent().hide(); 
				}else{
					$("#payErrorCarNoMsg").html(GetRequest ().key?GetRequest().key.split(",")[2]:"-");
					$("#payError #payErrorCarNo").html("卡号");
				}
				$("#payError #payErrorCode").html( (data&& data.resultCode)?data.resultCode :"10001").parents().show();
				$("#payError").show().siblings().hide();
			}
			//我知道了
			$("#btn_know").bind("touchend click", function(){
				if(tmp.retcode==10){
					closePage();
					return false;
				}
				$(".confirm").hide();
				$(".mask-new").hide();
				$("#paypage").hide();
				$("#scanpage").show();
				$("#btn_payPark").hide();
				$("#btn_foucuswx").show();
				$("#payok .pay_details_message").text("请直接取车离场");
				$("#payok .pay_details p:first-of-type").html("限时<span>"+ free_minute +"</span>分钟，超时将重新计费");
				$("#btn_know").show();
				couponUse();  //卡券使用接口
				//领取优惠券
				receiveCoupon();
				//用于调起微信/支付宝关闭窗口
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){
					wx.ready(function () {
						wx.closeWindow();
					});      
				}
				return false;
			});
			//确认
			$('#confirm_sure').unbind().bind('click',function(){
				$(".confirm").hide();
				$(".mask-new").hide();
				//$("#paypage").hide();
				couponUse();  //卡券使用接口
				paySuccessComfirm(surplus_minute);
				$("#btn_know").show();
				//领取优惠券
				receiveCoupon();
				return false;
			});
			//取消
			$('#confirm_cancel').unbind('click').bind('click',function(){
				$(".mask-new").hide();
				$(".confirm").hide();
				$("#payCouponList span").html("有券可用<i id='point'>.</i>").css("color","#9adb43").attr("id","");
				//$("#payCouponList span").text("不使用优惠券").css("color","#999");
				$("#discountFeeList").hide();
				$(".pay_normal p").html('');
				couponId = '';
				//清除小票优惠显示
				tckNo = "";
				$("#smallTicket > .input_lable").remove();
				$(".integral_input5").val("");
				memberNo = '';
				//重新获取订单
				gotoPay(couponId);
				return false;
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#payError").show().siblings().hide();
		}
	});
}