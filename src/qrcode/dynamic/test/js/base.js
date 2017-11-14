function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[1];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
//消息提示公用方法
var poptip = function(mess) {
    $("#poptip").html(mess);
    $("#poptip").fadeIn(400, function() {
        setTimeout(function() {
            $("#poptip").fadeOut('slow');
        }, 1500);
    });
};
//获取参数
function $_GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for ( var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
};
/*;(function(window,document){

	//判断来源，改变title
	if(location.href.indexOf('from=') > -1){
		var fromUrl = location.href.split("from=")[1].substr(0,3);
	}
	if(fromUrl && fromUrl == "JTC"){
		document.getElementsByTagName('title')[0].innerHTML = "捷停车";
		sessionStorage.setItem("appFrom","JTC");
	}
	if("JTC" === sessionStorage.getItem("appFrom")){
		document.getElementsByTagName("title")[0].innerHTML="捷停车";
	}else{
		document.getElementsByTagName('title')[0].innerHTML = "捷生活";
	}
	
	var jspsn_url = location.href;
	
	if(jspsn_url.indexOf('127.0.0.1')>=0 || jspsn_url.indexOf('localhost') >=0 ||jspsn_url.indexOf('10.101.51.11')>=0)
	{
		sessionStorage.setItem('jspsn_unionid', "1");	
	}
	var _id = null;
	if ("null" == _id || null == _id || undefined == _id) {
		_id = $_GetRequest().unionid;
	};
	if ("null" == _id || null == _id || undefined == _id) {
		_id = sessionStorage.getItem('jspsn_unionid');
	};
	if (!_id) {
		var _servlet = jspsn_url.substring(0, jspsn_url.indexOf("html"));
		_servlet += ("parkApp/userValid.servlet?jspsn_url=" + jspsn_url);
		this.location.href = _servlet;
	};
	if ("null" != _id && null != _id && undefined != _id) {
		sessionStorage.setItem('jspsn_unionid', _id);
	};
	
	window.jspsnQueryOpen = function(){
		return sessionStorage.getItem('jspsn_unionid');
	};

	//下拉加载
	window.loadMoreStop = true; //触发开关，防止多次调用
	window.loadMoreData = function(pageIndex,loadfun){
	    $(window).scroll(function(){
	        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); 
	        if ($(document).height() <= totalheight){
	        	if(loadMoreStop == true){  
	            	pageIndex++;  //页码
	            	setTimeout(loadfun, 500);  //0.5S后加载数据
	            	//loadfun();
	            }
	        }
	    }); 
	}

})(window,document);*/
