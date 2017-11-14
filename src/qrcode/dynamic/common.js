/**
 * 使用正则表达式，检测value是否满足模式re
 * @param re
 * @param value
 * @returns
 */
function checkExp(re,value)
{
	return re.test(value);
}

/**
 * 检查文本框集合是否有输入
 * @param allInput
 * @returns 未输入值文本框索引 -1：全部有输入
 */
function chkInputText(allInput)
{
    var count=-1;
    for ( var i = 0; i < allInput.length; i++)
    {
	if(allInput[i].value=="" && allInput[i].type=="text")
	{
	    count=i;
	    break;
	}
    }
    return count;
}

/**
 * 转换含有html标签的字符
 * @param html
 * @returns
 */
function escapeHTML(html)
{	
    html = html.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
    return html ;
}

/**
 * 检查输入的值是否是数字
 * @param objs 对象数组
 * @returns {Number} 对象的索引，-1：输入的全是数字
 */
function chkNum(objs)
{
	var count=-1;
	for ( var i = 0; i < objs.length; i++) 
	{
	    if(objs[i].value!="" && /^\d*$/.test(objs[i].value)==false)
	    {	
		count=i;
		break;
	    }
	}
	return count;
}

/**
 * 检查是否输入特殊字符
 * @param str
 * @returns {Boolean}
 */
function chkSpecialChar(str)
{
	var match=/[\<\>\$\-\+\\\|\{\}\[\]\!\%\&\=\*\/\.\,\;\:\@\#\(\)]/g;
	if(match.test(str))
	{
	    return true;
	}
	else
	{
	    return false;
	}
}

/**
 * 检查是否输入js代码
 * @param str
 * @returns true：有输入js代码	false：没有输入js代码
 */
function chkInputJsCode(str)
{
    if(str=="")
    {
	return false;
    }
    else if(str.indexOf("<script>")==-1 && str.indexOf("</script>")==-1 && str.indexOf("<")==-1 && str.indexOf("</")==-1)
    {
	return false;
    }
    else
    {
	return true;
    }
}
/**
 * 验证是否为空
 * @param strValue
 * @returns {Boolean}
 */
function chkEmpty(value)
{
	if(value=="")
		return true;
	else
		return false;
}

/**
 * 验证是否是Email
 * @param strValue
 * @returns
 */
function chkEmail(value)
{
	// Email 必须是 x@a.b.c.d 等格式 或者为空
	if(chkEmpty(value))
		return true;
	var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
	return checkExp(pattern, value);
}

/**
 * 检查是否输入汉语
 * @param str
 * @returns true：有汉字，false：无汉字
 */
function chkCn(str)
{
	if(/[\u4e00-\u9fa5]/.test(str))
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * 检查是否是货币
 * @param value
 * @returns
 */
function chkMoney(value)
{
    	//货币必须是 -12,345,678.9 等格式 或者为空
	if(chkEmpty(value))
	{
	    return true;
	}	    
	return checkExp( /^[+-]?\d+(,\d{3})*(\.\d+)?$/g,value);
}

/**
 * 不允许输入特殊字符
 */
function notInputSpecialChar()
{
	var keyCode=event.keyCode;
	if ((keyCode>=32 && keyCode<46) || (keyCode>57 && keyCode<65) || (keyCode>90 && keyCode<96))
	{
		event.returnValue = false;
	}
	else
	{
		event.returnValue = true;
	}
}

/**
 * 不允许输入除字母和数字以外的字符
 * @param value
 */
function inputGraphemeAndNum(value)
{
	return value.replace(/[\W]/g,'');
}

/**
 * 通过正则表达式只允许输入数字
 * @param value
 */
function inputNumByRE(value)
{
    return value.replace(/[^\d!]/g,'');
}

/**
 * 通过正则表达式只允许输入数字和点符号
 * @param value
 * @returns
 */
function inputNumAndPointByRE(value)
{
    return value.replace(/[^\d,^\.]/g,'');
}

/**
 * 显示弹出框
 * @param objectId 要显示的div层的id值
 * @param titleStr 要显示标题的值
 */
function createDialog(objectId,titleStr)
{
	createSizeDialog(objectId,titleStr,300,300,300,300);
}

/**
 * 显示自定义尺寸的弹出框
 * @param objectId 要显示的div层的id值
 * @param titleStr 要显示标题的值
 * @param widthValue 宽度
 * @param minWidthValue 最小宽度
 * @param heightValue 高度
 * @param minHeightValue 最小高度
 */
function createSizeDialog(objectId,titleStr,widthValue,minWidthValue,heightValue,minHeightValue)
{
    var dialogOptions = 
    {
		modal: true,
		overlay: '.ui-dialog-overlay',
		autoOpen: false,
		draggable: false,
		resizable: true,
		width: widthValue,
		minWidth: minWidthValue,
		height: heightValue,
		minHeight: minHeightValue,	
		position: 'center',
		open: function() 
		{
		    $(objectId).show();
		},
		show: "",
		hide: "",
		title: titleStr,
		stack: true
    };
    $(objectId).dialog(dialogOptions);
    $(objectId).dialog("open");
    $('a.ui-dialog-titlebar-close').hide();		//将右上角的关闭按钮隐藏，否则无法再次出现弹出框
}

/**
 * 显示自定义的固定尺寸的弹出框
 */
function createSettledDialog(objectId,titleStr,widthValue,minWidthValue,maxWidthValue,heightValue,minHeightValue,maxHeightValue)
{
	var dialogOptions = 
    {
		modal: true,
		overlay: '.ui-dialog-overlay',
		autoOpen: false,
		draggable: false,
		resizable: true,
		width: widthValue,
		minWidth: minWidthValue,
		maxWidth: maxWidthValue,
		height: heightValue,
		minHeight: minHeightValue,
		maxHeight: maxHeightValue,
		position: 'center',
		open: function() 
		{
		    $(objectId).show();
		},
		show: "",
		hide: "",
		title: titleStr,
		stack: true
    };
    $(objectId).dialog(dialogOptions);
    $(objectId).dialog("open");
    $('a.ui-dialog-titlebar-close').hide();		//将右上角的关闭按钮隐藏，否则无法再次出现弹出框
}

/**
 * 关闭弹出框
 * @param objectId
 */
function closeDialog(objectId)
{
    $(objectId).dialog("close");
}

/**
 * 创建日期框
 * @param dateObjectId
 */
function createDateBox(dateObjectId,dateFormatStr)
{    
    var dateOptions=
    {
	dateFormat:dateFormatStr,	//日期格式，自己设置
	yearRange:'2000:2100',		//年份范围
	currentText:'今天',		//返回当前日期
	closeText:'确定',		//关闭面板
	prevText:'上一月',		//鼠标移动到左箭头时，显示的内容
	nextText:'下一月',		//鼠标移动到右箭头时，显示的内容
	monthNames:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],		//正常显示时文字，即changeMonth:false时，显示的内容
	monthNamesShort:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
	dayNames:['星期天','星期一','星期二','星期三','星期四','星期五','星期六'],			//鼠标移动到星期时，显示的内容
	dayNamesMin:['日','一','二','三','四','五','六'],				//正常显示时的文字
	showButtonPanel: true,		//是否显示“今天”和“关闭”面板
	changeMonth:true,				//是否显示下拉列表改变月份
	changeYear:true			//是否显示下拉列表改变年份
	//showOn:'button',				//在文本框旁添加按钮，点击时弹出日期框
	//buttonImage:'图片的url',
	//buttonImageOnly:true			//设置“弹出日期框按钮”的图片是否是唯一路径，选择true时，路径错误，则无法显示图片
    };
    $(dateObjectId).datepicker(dateOptions);
}
/**
 * 创建时间框
 * @param dateObjectId
 */
function createTimeBox(dateObjectId,dateFormatStr)
{    
    var dateOptions=
    {
	dateFormat:dateFormatStr,	//日期格式，自己设置
	yearRange:'2000:2100',		//年份范围
	currentText:'今天',		//返回当前日期
	closeText:'确定',		//关闭面板
	prevText:'上一月',		//鼠标移动到左箭头时，显示的内容
	nextText:'下一月',		//鼠标移动到右箭头时，显示的内容
	monthNames:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],		//正常显示时文字，即changeMonth:false时，显示的内容
	monthNamesShort:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
	dayNames:['星期天','星期一','星期二','星期三','星期四','星期五','星期六'],			//鼠标移动到星期时，显示的内容
	dayNamesMin:['日','一','二','三','四','五','六'],				//正常显示时的文字
	showButtonPanel: true,		//是否显示“今天”和“关闭”面板
	changeMonth:true,				//是否显示下拉列表改变月份
	changeYear:true			//是否显示下拉列表改变年份
	//showOn:'button',				//在文本框旁添加按钮，点击时弹出日期框
	//buttonImage:'图片的url',
	//buttonImageOnly:true			//设置“弹出日期框按钮”的图片是否是唯一路径，选择true时，路径错误，则无法显示图片
    };
    $(dateObjectId).datetimepicker(dateOptions);
}

/**
 * 格式化日期
 */
Date.prototype.pattern=function(fmt) 
{        
    var o = 
    {        
        "M+" : this.getMonth()+1, //月份        
        "d+" : this.getDate(), //日        
        "h+" : this.getHours()%12 == 0 ? this.getHours() : this.getHours()%12, //分上午和下午的小时        
        "H+" : this.getHours(), //小时        
        "m+" : this.getMinutes(), //分        
        "s+" : this.getSeconds(), //秒        
        "q+" : Math.floor((this.getMonth()+3)/3), //季度        
        "S" : this.getMilliseconds() //毫秒        
    };        
    var week = 
    {        
        "0" : "\u65e5",        
        "1" : "\u4e00",        
        "2" : "\u4e8c",        
        "3" : "\u4e09",        
        "4" : "\u56db",        
        "5" : "\u4e94",        
        "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt))
    {        
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt))
    {        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }        
    for(var k in o)
    {        
        if(new RegExp("("+ k +")").test(fmt))
        {        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
};
/**
 * 用正则表达式将前后空格用空字符串替代
 * @returns
 */
String.prototype.trim = function()
{
	return this.replace( /(^\s*)|(\s*$)/g,"" );
};

function doSort(currentHref,value,sort,currentPage)
{
    location.href=currentHref+"&sort="+sort+"&value="+value+"&isUrl=true"+"&pageIndex="+currentPage;
}

function change_div(id,num)
{
    for(var i=1;i<=num;i++)
    {
	document.getElementById("div"+i).style.display = "none";
	document.getElementById("li"+i).className = "";
    }
    document.getElementById("div"+id).style.display = "block";
    document.getElementById("li"+id).className = "li_active";
}
/**
 * 展开订单方式
 * @param id
 */
function showRow(id)
{
    if(isIE7 || isIE6)
    {
	if($("#append_"+id).css("display")=="block")
	{
	    $("#append_"+id).css("display","none");
	}
	else
	{
	    $("#append_"+id).css("display","block");
	}
    }
    else
    {
	if($("#append_"+id).css("display")=="table-row")
	{
	    $("#append_"+id).css("display","none");
	}
	else
	{
	    $("#append_"+id).css("display","table-row");
	}
    }
}
jQuery(function($)
{   
    /**
     * 全选操作
     */
    $("#allSelect").click(function()
    {
        var chk=$(":checkbox");
        for ( var i = 0; i < chk.length; i++)
        {
            var chkValue=$("#allSelect").attr("checked");
            chk[i].checked=chkValue;
        }
    });
    
    /**
     * 左菜单中点击之后的链接样式
     */
    $("a[name^='menu_']").click(function()
    {
	$("a[name^='menu_']").css("font-weight","normal");
	$(this).css("font-weight","bold");
    });
    
    $("a[name^='leftMenu_']").click(function()
    {
	$("a[name^='leftMenu_']").css("font-weight","normal");
	$(this).css("font-weight","bold");
    });
    
    $("div.x_div1 table tr.x_tr td span").mouseover(function()
    {
    	$(this).css("font-weight","bold");
    }).mouseout(function()
    {
    	$(this).css("font-weight","normal");
    });
});
var isIE=!!window.ActiveXObject;  
var isIE6=isIE&&!window.XMLHttpRequest;
var isIE8=isIE&&!!document.documentMode;  
var isIE7=isIE&&!isIE6&&!isIE8;