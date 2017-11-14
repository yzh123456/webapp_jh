/**
 * Created by YQX on 2016/12/1.
 */
import {XMPPSERVER} from "./Enum";
let lowerCache = {};//缓存输出小写键值

let JHTAJAX = function(options) {
    let url = options.url || XMPPSERVER , //请求的链接
        type = (options.type || "get").toLowerCase(), //请求的方
        data = options.data || null, //请求的数据
        contentType = options.contentType || "", //请求头
        dataType = options.dataType || "", //请求的类型
        async = options.async === undefined && true, //是否异步，默认为true.
        timeOut = options.timeOut, //超时时间。
        before = options.before || function() {}, //发送之前执行的函数
        error = options.error || function() {}, //错误执行的函数
        complete = options.complete || function() {}, //错误执行的函数
        success = options.success || function() {}; //请求成功的回调函数
    let timeout_bool = false, //是否请求超时
        timeout_flag = null, //超时标识
        xhr = null; //xhr对角
    setData();
    before();
    if (dataType === "jsonp") {
        createJsonp();
    } else {
        createXHR();
    }

    //编码数据
    function setData() {
        let name, value;
        if (data) {
            if (typeof data === "string" && data.split("&").length > 1) {
                data = data.split("&");
                for (let i = 0, len = data.length; i < len; i++) {
                    name = data[i].split("=")[0];
                    value = data[i].split("=")[1];
                    data[i] = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                }
                data = data.replace("/%20/g", "+");
            } else if (typeof data === "object") {
                /******************如果是云服务数据请求，则将dataItems或者attributes参数字符串序列化*******************/
                if(data.serviceId && data.serviceId != "" && (data.dataItems || data.attributes) ){
                    if(data.dataItems && typeof data.dataItems === "object") data.dataItems =JSON.stringify(data.dataItems);
                    if(data.attributes && typeof data.attributes === "object") data.attributes = JSON.stringify(data.attributes);
                }
                let arr = [];
                for (let name in data) {
                    if (typeof data[name] !== 'undefined') {
                        let value = data[name].toString();
                        name = encodeURIComponent(name);
                        value = encodeURIComponent(value);
                        arr.push(name + "=" + value);
                    }

                }
                data = arr.join("&").replace("/%20/g", "+");
            }
            //若是使用get方法或JSONP，则手动添加到URL中
            if (type === "get" || dataType === "jsonp") {
                url += url.indexOf("?") > -1 ? (url.indexOf("=")>-1 ? "&"+data : data ): "?" + data;
            }
        }
    }
    // JSONP
    function createJsonp() {

        let script = document.createElement("script"),
            timeName = new Date().getTime() + Math.round(Math.random() * 1000),
            callback = "JSONP_" + timeName;

        window[callback] = function(data) {
            clearTimeout(timeout_flag);
            document.body.removeChild(script);
            let responseData = data;
            try {
                if(dataType === "json")
                    responseData = JSON.parse(responseData);
                if(dataType === "json" && url === XMPPSERVER){
                    responseData = ObjToLower(responseData);
                }

                //responseData = dataType === "json" ? ObjToLower(responseData) : responseData;
            }catch (e){

            }
            success(responseData);
        };
        script.src = url +  (url.indexOf("?") > -1 ? "&" : "?") + "callback=" + callback;
        script.type = "text/javascript";
        document.body.appendChild(script);
        setTime(callback, script);
    }
    //设置请求超时
    function setTime(callback, script) {
        if (timeOut !== undefined) {
            timeout_flag = setTimeout(function() {
                if (dataType === "jsonp") {
                    // delete window[callback];
                    document.body.removeChild(script);

                } else {
                    timeout_bool = true;
                    xhr && xhr.abort();
                }
                console.log("timeout");
                complete("timeout");

            }, timeOut);
        }
    }
    // XHR
    function createXHR() {
        //由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
        //所以创建XHR对象，需要在这里做兼容处理。
        function getXHR() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else {
                //遍历IE中不同版本的ActiveX对象
                let versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
                for (let i = 0; i < versions.length; i++) {
                    try {
                        let version = versions[i] + ".XMLHTTP";
                        return new ActiveXObject(version);
                    } catch (e) {}
                }
            }
        }
        //创建对象。
        xhr = getXHR();
        xhr.open(type, url, async);
        //设置请求头
        if (type === "post" && !contentType) {
            //若是post提交，则设置content-Type 为application/x-www-four-urlencoded
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        } else if (contentType) {
            xhr.setRequestHeader("Content-Type", contentType);
        }
        //添加监听
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (timeOut !== undefined) {
                    //由于执行abort()方法后，有可能触发onreadystatechange事件，
                    //所以设置一个timeout_bool标识，来忽略中止触发的事件。
                    if (timeout_bool) {
                        return;
                    }
                    clearTimeout(timeout_flag);
                }
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    let responseData = xhr.responseText;
                    try {
                        if(dataType === "json")
                        responseData = JSON.parse(responseData);
                        if(dataType === "json" && url === XMPPSERVER) responseData = ObjToLower(responseData);
                        //responseData = dataType === "json" ? ObjToLower(responseData) : responseData;
                    }catch (e){

                    }
                    success(responseData);
                    complete = function () {};
                } else {
                    error(xhr.status, xhr.statusText);
                }
            }
        };
        //发送请求
        xhr.send(type === "get" ? null : data);
        setTime(); //请求超时
    }

    //将对象键值key全部转为小写
    function ObjToLower(obj){
        if (typeof(obj) === "string" || typeof(obj) === "number")
            return obj;

        let l = obj.length;
        if (l) {
            l |= 0;
            let result = [];
            result.length = l;
            for (let i = 0; i < l; i++) {
                let newVal = obj[i];
                result[i] = typeof(newVal) === "string" ? newVal : ObjToLower(newVal);
            }
            return result;
        } else {
            let ret = {};
            for (let key in obj) {

                let keyStr = typeof(key) === "string" ? key : String(key);
                //if(typeof lowerCache === 'undefined') lowerCache = {};
                let newKey = lowerCache[keyStr];
                if (newKey === undefined) {
                    newKey = keyStr.toLowerCase();
                    lowerCache[keyStr] = newKey;
                }

                let newVal = obj[key];
                ret[newKey] = typeof(newVal) === "string" ? newVal : ObjToLower(newVal);
            }
            return ret;
        }
    }
};
export  default  JHTAJAX;