/**
 * Created by yqx on 2016/12/13.         jspsn公用工具函数集
 */
import {EXCLUDEPAGE, TXTTOIMG,BASEPATH} from "./Enum";
import MyToast from "../components/MyToast";
export default class JHT {
    constructor(){
    }
    basePath(){
        return BASEPATH;
    }
    /******  获取URL参数集  *************/
    urlParams () {
        let str = location.search.length > 0 ? location.search.substring(1) : "";
        let items = str.length ? str.split("&") : [];
        let args = {},
            item = null,
            name = null,
            value = null;
        for (let i = 0, len = items.length; i < len; i++) {
            item = items[i].split("=");
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (name.length) {
                args[name] = value;
            }
        };
        return args;
    };
    /**
     *调用客户端进行导航
     * @param el   操作进入导航的DOM节点
     * @param parem
     *origin表示开始地址，可以是经纬度，也可以是具体的地址；
     *name 表示开始地址的标注，显示在搜索栏中的地址；
     *destination示目的地址，可以是经纬度，也可以是具体的地址；
     *mode表示路线的模式，如（driving：自驾）；
     *region表示查找范围，可以是具体的某个县；
     */
    goNavigation(parem){
            let gotohere = `http://api.map.baidu.com/direction?origin=latlng:${parem.slat},${parem.slng}|name:${parem.sname}&destination=latlng:${parem.elat},${parem.elng}|name:${parem.ename}&mode=${parem.mode || 'driving' }&coord_type=${parem.coordType || "gcj02"}&zoom=17&region=${parem.region || "中国"}&output=${parem.output || "html"}&src=JTC`;
            window.open(encodeURI(gotohere)); //启动调用
        //let gotohere =`http://api.map.baidu.com/direction?origin=latlng:lat +","+lng+"|name:"+city+"&destination=latlng:"+ parem.latitude +","+parem.longitude+'|name:'+data.attributes.name+'&mode=driving&region=中国&output=html&src=yourCompanyName|yourAppName`;
    }
    /**
     * 日期格式化初始化
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *  例子：
     *  (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
     *  (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
     */
    dateFmtInit(){
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "H+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }

    /**
     *排除不需要鉴权页面
     * @returns {boolean}
     */
    exclude(excludepage = EXCLUDEPAGE){
        for (let i in excludepage){
            if(window.location.href.indexOf(excludepage[i]) > -1){
               return true;
            }
        }
        return false;
    }

    /**
     * 截取过长字符串
     * @param str  原字符串
     * @param long 保留长度（即中文字数）
     * @returns {string}
     */
    getStrSub(str = "",long=12) {
        let myLen = 1;
        let _str='';
        let i = 0;
        long = 2*(long +1);
        if (str == '') {
            _str == '--';
        }else {
            for (; i < str.length; i++) {
                if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
                    myLen++;
                    if(myLen<long)
                        _str += str.charAt(i);
                } else  {
                    myLen += 2;
                    if(myLen<long)
                        _str += str.charAt(i);
                }
            }
            if (myLen >= long && _str.indexOf('...') == -1) {
                _str += '...';
            }
        }
        return _str;
    }
    /****判断H5运行环境**********************/
    working(app = ""){
        let ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return "WX";
        }else if(ua.match(/AlipayDefined/i) == 'alipaydefined'){  //支付宝环境
            return "ZFB";
        }else if((window.USERINFO &&
            (window.USERINFO.APP.APP_TYPE == "APP_JTC" ||  window.USERINFO.APP.APP_TYPE == "IOS_JTC")) ||
            this.urlParams().APP_TYPE ){
            if(window.USERINFO &&　window.USERINFO.APP && app != ""){
                if( window.USERINFO.APP.APP_TYPE == "APP_JTC" ){
                    return "ANDROID";
                } else if( window.USERINFO.APP.APP_TYPE == "IOS_JTC" ){
                    return "IOS_JTC";
                }
            }
            return "APP";
        }else {
            return "OTHER";
        }
    }

    /**
     * H5调起手机拨号
     */
    telephone(mobileno = ""){
        if(this.working("app") == "ANDROID"){  //安卓捷停车由app调起拨号
            AppBridge.forJS({
                serviceId:"CALLPHONE",
                params:{
                    mobileno: mobileno
                }
            },function(data){
            })
        }else if (this.working("app") == "IOS_JTC") {
            AppBridge.forJS({
                serviceId:"CALLPHONE",
                params:{
                    mobileno: mobileno
                }
            },function(data){
            })
        } else {
            window.location.href = `tel:${mobileno}`;
        }
    }

    /**
     * 根据文字内容生成透明背景图片提示语
     * @param op
     * @returns {string}
     */
    txtImg(op = {}){
        let fontSize = (op.fontSize||16)*2;
        let long = fontSize*(op.text.length);
        return `${TXTTOIMG}?width=${op.width|| long }&height=${op.height||(fontSize*1+5)}&color=${encodeURIComponent(op.color||"#000000")}&font=${encodeURIComponent(op.font||"隶书")}&text=${encodeURIComponent(op.text||"")}&imgY=${op.imgY||fontSize}&imgX=${op.imgX||"0"}&fontSize=${fontSize}`;
    }
    
    myToast(str = "",showTime = 1500){
        if(str){
            let myToast = new MyToast();
            myToast.setToast(str,showTime)
        }
    }
}