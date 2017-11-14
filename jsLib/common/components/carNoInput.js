import {Component, createClass} from "react";
import Translate from "../util/Translate";
import $ from "../jquery-3.1.1.min";
import  {GETCITY,BASEPATH} from "../../common/util/Enum";
let that;
class CarNoInput extends Component {
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:"",
            back:false
        };
        $(function(){
            //pushHistory();
            //removeEventListener("popstate",goback , false);
            window.addEventListener("popstate",goback , false);
            function goback(e) {
                if($("#input_car").css("display") != "none"){
                    that.stateObj.back = true;
                    that.setState(that.stateObj);
                }
            }
            /*function pushHistory() {
                let state = {
                    title: "title",
                    url: "#"
                };
                window.history.pushState(state, "title", "#");
            }*/

        });
        this.state = this.stateObj;
        // this.thirdSDK = new ThirdSDK(['getLocation']);
        this.Translate = new Translate();
    }
    componentDidMount() {
        that = this;
        // this.refs.input8.style.background="-webkit-gradient(linear, 0% 0%, 0% 100%,from(#FAFFFD), to(#90F2B4))";

        let before = this.props.before;
        if(before != ''){
           let vehicleNo = before.replace("-","");
            for ( let i = 0; i < vehicleNo.length; i++) {
                $("#input_car .input" + (i+1)).text(vehicleNo[i]);
            }
        }
        document.querySelector(".input1").addEventListener("touchstart",this.clickInput1);
        document.querySelector(".input2").addEventListener("touchstart",this.clickInput2);
        document.querySelector(".input3").addEventListener("touchstart",this.clickInput3456);
        document.querySelector(".input4").addEventListener("touchstart",this.clickInput3456);
        document.querySelector(".input5").addEventListener("touchstart",this.clickInput3456);
        document.querySelector(".input6").addEventListener("touchstart",this.clickInput3456);
        document.querySelector(".input7").addEventListener("touchstart",this.clickInput78);
        document.querySelector(".input8").addEventListener("touchstart",this.clickInput78);
        document.querySelector("#provinceBox").addEventListener("touchend",this.clickProvinceBox);
        // document.querySelectorAll("#provinceB a").addEventListener("touchstart",this.clickProvinceB);
        for(let i=0;i<document.querySelectorAll("#provinceB a").length;i++){
            document.querySelectorAll("#provinceB a")[i].addEventListener("touchstart",this.clickProvinceB);
        }
        for(let i=0;i<document.querySelectorAll("#provinceA a").length;i++){
            document.querySelectorAll("#provinceA a")[i].addEventListener("touchstart",this.clickProvinceA);
        }
        for(let i=0;i<document.querySelectorAll("#provinceAB a").length;i++){
            document.querySelectorAll("#provinceAB a")[i].addEventListener("touchstart",this.clickProvinceAB);
        }
        this.provinceForShort();
        //http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js
    }
    /**
     * 根据省份名称返回省份车牌
     * @param province
     * @returns {String}
     */
    provinceForShort(){
        let latitude= window.USERINFO.USER.latitude;
        let longitude=window.USERINFO.USER.longitude;
        // this.Translate.gcj02tobd09(longitude,latitude)[0]
        let url = GETCITY+"&location="+this.Translate.gcj02tobd09(longitude,latitude)[1]+","+this.Translate.gcj02tobd09(longitude,latitude)[0];
        let urlXHR=`${BASEPATH.jspsnURL}/httpRequest.servlet`;
        if(window.location.href.indexOf("/jspsn/") > -1) {
        }else {
            urlXHR=`${BASEPATH.cloudURL}/httpRequest.servlet`;
        }
        // url ="http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&ak=fCRtA4ZvM8LpQh9luE8OjD5ipk0CYCih&location=22.549537,114.039255";
        if(longitude!=116&&latitude!=39) {
            $.ajax({
                url: urlXHR,
                //url:"http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&ak=fCRtA4ZvM8LpQh9luE8OjD5ipk0CYCih&location=22.549537,114.039255",
                type: 'get',//提交方式 可以选择post/get 推荐post
                async: false,//同步异步
                data: {url: url},
                dataType: 'xml',//返回数据类型
                success: function (data) {
                    let input1;
                    let province = data.documentElement.querySelector("formatted_address").innerHTML;
                    if (province.indexOf("北京") > -1)
                        input1 = "京";
                    else if (province.indexOf("天津") > -1)
                        input1 = "津";
                    else if (province.indexOf("重庆") > -1)
                        input1 = "渝";
                    else if (province.indexOf("上海") > -1)
                        input1 = "沪";
                    else if (province.indexOf("河北") > -1)
                        input1 = "冀";
                    else if (province.indexOf("山西") > -1)
                        input1 = "晋";
                    else if (province.indexOf("辽宁") > -1)
                        input1 = "辽";
                    else if (province.indexOf("吉林") > -1)
                        input1 = "吉";
                    else if (province.indexOf("黑龙江") > -1)
                        input1 = "黑";
                    else if (province.indexOf("江苏") > -1)
                        input1 = "苏";
                    else if (province.indexOf("浙江") > -1)
                        input1 = "浙";
                    else if (province.indexOf("安徽") > -1)
                        input1 = "皖";
                    else if (province.indexOf("福建") > -1)
                        input1 = "闽";
                    else if (province.indexOf("江西") > -1)
                        input1 = "赣";
                    else if (province.indexOf("山东") > -1)
                        input1 = "鲁";
                    else if (province.indexOf("河南") > -1)
                        input1 = "豫";
                    else if (province.indexOf("湖北") > -1)
                        input1 = "鄂";
                    else if (province.indexOf("湖南") > -1)
                        input1 = "湘";
                    else if (province.indexOf("广东") > -1)
                        input1 = "粤";
                    else if (province.indexOf("海南") > -1)
                        input1 = "琼";
                    else if (province.indexOf("四川") > -1)
                        input1 = "川";
                    else if (province.indexOf("贵州") > -1)
                        input1 = "贵";
                    else if (province.indexOf("云南") > -1)
                        input1 = "云";
                    else if (province.indexOf("陕西") > -1)
                        input1 = "陕";
                    else if (province.indexOf("甘肃") > -1)
                        input1 = "甘";
                    else if (province.indexOf("青海") > -1)
                        input1 = "青";
                    else if (province.indexOf("台湾") > -1)
                        input1 = "台";
                    else if (province.indexOf("内蒙古") > -1)
                        input1 = "蒙";
                    else if (province.indexOf("广西") > -1)
                        input1 = "桂";
                    else if (province.indexOf("宁夏") > -1)
                        input1 = "宁";
                    else if (province.indexOf("新疆") > -1)
                        input1 = "新";
                    else if (province.indexOf("西藏") > -1)
                        input1 = "藏";
                    else if (province.indexOf("香港") > -1)
                        input1 = "港";
                    else if (province.indexOf("澳门") > -1)
                        input1 = "澳";
                    else
                        input1 = '';
                    document.querySelector(".input1").textContent = input1;
                    for (var i = 0; i < $('._provinceBox a').length; i++) {
                        if ($('._provinceBox a')[i].text == input1) {
                            $('._provinceBox a').eq(i).html($('._provinceBox a').eq(0).text());
                            break;
                        }
                    }
                    ;
                    if (input1 != '') {
                        $('._provinceBox a').eq(0).html(input1).css("color", "#92df56");
                    }
                },
                error: function (data) {
                    console.info(data);
                }
            });
        }
}
    clickLockInputCarOk(){
        var arrprop =[];
        var arr = [];
        var els =$("._line ._input");
        for (let i = 0; i<els.length; i++){
            arrprop.push(els.eq(i).html());
        }
        if(this.refs.checkNewCar.className!="checked"){
            if(this.refs.input8.innerText!=""){
                for(let i=0;i<arrprop.length-1;i++){
                    arr.push(arrprop[i]);
                }
            }else{
                arr = arrprop;
            }
        }else{
            arr = arrprop;
        }
        if(arr[1]!=""){
            arr[1] = '-' + arr[1];
        }
        var vehicleNo = arr.join("");
        console.info($("._line .input1"));
        console.info($("._line .input1").html());
        if($("._line .input1").html()!=""&&$("._line .input2").html()!=""&&$("._line .input3").html()!=""&&$("._line .input4").html()!=""&&$("._line .input5").html()!=""&&$("._line .input6").html()!=""&&$("._line .input7").html()!=""){
            this.props.handel(vehicleNo);
        }else{
            _poptip("请输入完整的车牌号！");
        }
    };
    clickInput1(e){
        $(this).addClass("active").siblings("._input").removeClass("active");
        $("._provinceBox").removeClass("hide").siblings("div").addClass("hide");
    }
    clickInput2(e){
        $(this).addClass("active").siblings("._input").removeClass("active");
        $(".provinceA").removeClass("hide").siblings("div").addClass("hide");
    }
    clickInput3456(e){
        $(this).addClass("active").siblings("._input").removeClass("active");
        $(".provinceB").removeClass("hide").siblings("div").addClass("hide");
    }
    clickInput78(e){
        $(this).addClass("active").siblings("._input").removeClass("active");
        $(".provinceAB").removeClass("hide").siblings("div").addClass("hide");
    }
    clickProvinceBox(e){
        if(e.target.id!="btnClear"){
            if(e.target.innerText.length==1){
                $('.input2').addClass("active").siblings("._input").removeClass("active");
                $(this).parents("._provinceBox").addClass("hide");
                $(".provinceA").removeClass("hide");
                $('.input1').html(e.target.innerText);
            }
        }

    }
    clickProvinceB(e){
        if($('.input3').hasClass("active")){
            // $('.input4').focus();
            $('.input4').addClass("active").siblings("._input").removeClass("active");
            $(".provinceB").removeClass("hide");
            $('.input3').html(e.target.innerText);
        }else if($('.input4').hasClass("active")){
            // $('.input5').focus();
            $('.input5').addClass("active").siblings("._input").removeClass("active");
            $(".provinceB").removeClass("hide");
            $('.input4').html(e.target.innerText);
        }else if($('.input5').hasClass("active")){
            $('.input6').addClass("active").siblings("._input").removeClass("active");
            $(".provinceB").removeClass("hide");
            $('.input5').html(e.target.innerText);
        }else if($('.input6').hasClass("active")){
            $('.input7').addClass("active").siblings("._input").removeClass("active");
            $(".provinceAB").removeClass("hide").siblings("div").addClass("hide");;
            $('.input6').html(e.target.innerText);
        }else{
            $("._line ._input").each(function(){
                if($(this).hasClass("active")){
                    $(this).html(e.target.innerText);
                }
            });
        }
    }
    clickProvinceA(e){
        // $('.input3').focus();
        $('.input3').addClass("active").siblings("._input").removeClass("active");
        $(this).parents(".provinceA").addClass("hide");
        $(".provinceB").removeClass("hide");
        $('.input2').html(e.target.innerText);
    }
    clickProvinceAB(e){
        if($("#checkEnergy").hasClass("checked")){
            if($('.input7').hasClass("active")){
                $('.input7').html(e.target.innerText);
                $(".provinceAB").removeClass("hide").siblings("div").addClass("hide");
                $(".input8").addClass("active").siblings("._input").removeClass("active");
            }else if($('.input8').hasClass("active")){
                $('.input8').html(e.target.innerText);
                // $('.input7,.input6,.input5,.input4,.input3,.input2,.input1').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,from(#FAFFFD), to(#90F2B4))");
                $(".provinceAB").removeClass("hide").siblings("div").addClass("hide");
                $(".input8").addClass("active").siblings("._input").removeClass("active");
            }
        }else{
            if($('.input7').hasClass("active")){
                $('.input7').html(e.target.innerText);
                $(".provinceAB").removeClass("hide").siblings("div").addClass("hide");
                $(".input7").addClass("active").siblings("._input").removeClass("active");
            }
        }

    }
    btnClear(){
        for(let i=1;i<$("._line ._input").length+1;i++){
            if($("._line .input"+i).hasClass("active")){
                $("._line .input"+i).removeClass("active").blur();
                $("._line .input"+(i-1)).addClass("active").blur();
                if($("._line .input"+i).html()!==""&&i==8){
                    $("._line .input"+i).html("");
                    $("._line .input"+(i-1)).addClass("active").blur();
                    $("._line .input"+(i-1)).siblings().removeClass("active");
                }else{
                    if($("._line .input"+i).html()==""&&i==8){
                        $("._line .input"+(i-1)).removeClass("active").blur();
                        $("._line .input"+(i-1)).addClass("active").blur();
                    }
                    $("._line .input"+i).html("");
                }
                if(i==4||i==5||i==6||i==7){
                    $(".provinceB").removeClass("hide").siblings().addClass("hide");
                    $("._line .input"+(i-1)).addClass("active").siblings().removeClass("active");
                }else if(i==2){
                    $("._provinceBox").removeClass("hide").siblings().addClass("hide");
                    $("._line .input"+(i-1)).addClass("active").siblings().removeClass("active");
                }else if(i==3){
                    $(".provinceA").removeClass("hide").siblings().addClass("hide");
                    $("._line .input"+(i-1)).addClass("active").siblings().removeClass("active");
                }else if(i==1){
                    $("._provinceBox").removeClass("hide").siblings().addClass("hide");
                    $("._line .input"+(i-1)).addClass("active").siblings().removeClass("active");
                }
                return;
            }
        }
    }
    checkNewCar(){
        if(this.refs.checkNewCar.className=="checked"){
            this.refs.checkNewCar.className="";
            this.refs.line.style.background="#fff";
            if(this.refs.input1.className=="_input input1 new_input active"){
                this.refs.input1.className="_input input1 active";
            }else{
                this.refs.input1.className="_input input1";
            }
            if(this.refs.input2.className=="_input input2 new_input active"){
                this.refs.input2.className="_input input2 active";
            }else{
                this.refs.input2.className="_input input2";
            }
            if(this.refs.input3.className=="_input input3 new_input active"){
                this.refs.input3.className="_input input3 active";
            }else{
                this.refs.input3.className="_input input3";
            }
            if(this.refs.input4.className=="_input input4 new_input active"){
                this.refs.input4.className="_input input4 active";
            }else{
                this.refs.input4.className="_input input4";
            }
            if(this.refs.input5.className=="_input input5 new_input active"){
                this.refs.input5.className="_input input5 active";
            }else{
                this.refs.input5.className="_input input5";
            }
            if(this.refs.input6.className=="_input input6 new_input active"){
                this.refs.input6.className="_input input6 active";
            }else{
                this.refs.input6.className="_input input6";
            }
            if(this.refs.input7.className=="_input input7 new_input active"){
                this.refs.input7.className="_input input7 borderinput active";
            }else{
                this.refs.input7.className="_input input7 borderinput";
            }
            // this.refs.input7.className="_input input7 borderinput";
            if(this.refs.input8.className=="_input input8 new_input borderinput active"){
                this.refs.input7.className="_input input7 borderinput active";
            }
            this.refs.input8.className="_input input8 hide";

        }else{
            this.refs.checkNewCar.className="checked";
            this.refs.line.style.background="-webkit-gradient(linear, 0% 0%, 0% 100%,from(#FAFFFD), to(#90F2B4))";
            if(this.refs.input8.className=="_input input8 active"){
                this.refs.input8.className="_input input8 active";
            }else{
                this.refs.input8.className="_input input8";
            }
            if(this.refs.input1.className=="_input input1 active"){
                this.refs.input1.className="_input input1 new_input active";
            }else{
                this.refs.input1.className="_input input1 new_input";
            }
            if(this.refs.input2.className=="_input input2 active"){
                this.refs.input2.className="_input input2 new_input active";
            }else{
                this.refs.input2.className="_input input2 new_input";
            }
            if(this.refs.input3.className=="_input input3 active"){
                this.refs.input3.className="_input input3 new_input active";
            }else{
                this.refs.input3.className="_input input3 new_input";
            }
            if(this.refs.input4.className=="_input input4 active"){
                this.refs.input4.className="_input input4 new_input active";
            }else{
                this.refs.input4.className="_input input4 new_input";
            }
            if(this.refs.input5.className=="_input input5 active"){
                this.refs.input5.className="_input input5 new_input active";
            }else{
                this.refs.input5.className="_input input5 new_input";
            }
            if(this.refs.input6.className=="_input input6 active"){
                this.refs.input6.className="_input input6 new_input active";
            }else{
                this.refs.input6.className="_input input6 new_input";
            }
            if(this.refs.input7.className=="_input input7 borderinput active"){
                this.refs.input7.className="_input input7 new_input active";
            }else{
                this.refs.input7.className="_input input7 new_input";
            }
            if(this.refs.input8.className=="_input input8 active"){
                this.refs.input8.className="_input input8 new_input borderinput active";
            }else{
                this.refs.input8.className="_input input8 new_input borderinput";
            }
            // this.refs.input8.className="_input input8";
            // this.refs.input1.className="_input input1 new_input";
            // this.refs.input2.className="_input input2 new_input";
            // this.refs.input3.className="_input input3 new_input";
            // this.refs.input4.className="_input input4 new_input";
            // this.refs.input5.className="_input input5 new_input";
            // this.refs.input6.className="_input input6 new_input";
            // this.refs.input7.className="_input input7 new_input";
            // this.refs.input8.className="_input input8 new_input borderinput";
        }


    }
	render() {
        let styleHide={"display":"block","height":"100%","width":"100%","background":"#f0eff5","position":"fixed","top":"0","left": "0"};
        let copemlt = this.props.copemlt;
        let message = this.props.message;
        if(message==""){
            message = "现在添加";
        }
        if(copemlt || this.stateObj.back){
            if(this.stateObj.back) this.stateObj.back = false;
            styleHide={"display":"none","height":"100%","width":"100%","background":"#f0eff5","position":"fixed","top":"0","left": "0"};
        }else {
            pushHistory();
            function pushHistory() {
                let state = {
                    title: "title",
                    url: "#"
                };
                window.history.pushState(state, "title", "#");
            }
        }
        let style1;
        let style3;
        style1={"zIndex":"999","position":"fixed","width":"100%","bottom":"50%","left":"0%","borderRadius":"3px","height":"35%"};
        style3 = {"padding":"15% 3% 5%","clear":"both","color":"#ffffff","height":"20%"};
        let style4 = {"display":"none"};
        return (
            <div id="input_car" style={styleHide}>
                <div id="_poptip" style = {style4}></div>
                <div style={style1}>
                    <div className="_line" ref="line">
                        <div className="_input input1 active" ref="input1" id = "1"></div>
                        <div className="_input input2" ref="input2"  id = "2"></div>
                        <div className="_input input3" ref="input3"  id = "3"></div>
                        <div className="_input input4" ref="input4"  id = "4"></div>
                        <div className="_input input5" ref="input5"  id = "5"></div>
                        <div className="_input input6" ref="input6"  id = "6"></div>
                        <div className="_input input7 borderinput" ref="input7"  id = "7"></div>
                        <div className="_input input8 hide" ref="input8"  id = "8"></div>
                    </div>
                    <div id="newEnergyCar"></div>
                    <div id="newEnergyTree"></div>
                    <div id="newEnergy"><div className="" onClick={this.checkNewCar.bind(this)} id="checkEnergy" ref="checkNewCar"></div>新能源车</div>
                    <div style={style3}>
                       <button id="lock_input_car_ok" className="lock_input_car_ok" onClick={this.clickLockInputCarOk.bind(this)}>{message}</button>
                    </div>
                </div>
                <div className="sjc2" style={style4}>
                    <a id="test"></a>
                </div>
                <div className="show">
                    <div className="addtapa _provinceBox" id = "9">
                        <div id="provinceBox" ref="provinceBox">
                            <a>京</a> <a>粤</a> <a>沪</a> <a>浙</a>
                            <a>苏</a> <a>鲁</a> <a>晋</a> <a>冀</a>
                            <a>豫</a> <a>川</a> <a>渝</a> <a>辽</a>
                            <a>吉</a> <a>黑</a> <a>皖</a> <a>鄂</a>
                            <a>湘</a> <a>赣</a> <a>闽</a> <a>陕</a>
                            <a>甘</a> <a>宁</a> <a>蒙</a> <a>津</a>
                            <a>贵</a> <a>云</a> <a>桂</a> <a>琼</a>
                            <a>青</a> <a>新</a> <a>藏</a> <a>港</a>
                            <a>澳</a><div id="clearparent"><div id="btnClear" className="_btnClear" onTouchEnd={this.btnClear.bind(this)}></div></div>
                            </div>
                        </div>
                    <div className="addtapa provinceA hide" id = "10">
                        <div id="provinceA">
                            <a>A</a> <a>B</a> <a>C</a> <a>D</a>
                            <a>E</a> <a>F</a> <a>G</a> <a>H</a>
                            <a>I</a> <a>J</a> <a>K</a> <a>L</a>
                            <a>M</a> <a>N</a> <a>O</a> <a>P</a>
                            <a>Q</a> <a>R</a> <a>S</a> <a>T</a>
                            <a>U</a> <a>V</a> <a>W</a> <a>X</a>
                            <a>Y</a> <a>Z</a><div id="clearparent"><div className="_btnClear" onTouchStart={this.btnClear.bind(this)}></div></div>
                            </div>
                        </div>
                    <div className="addtapa provinceB hide" id = "11">
                        <div id="provinceB">
                            <a>0</a> <a>1</a> <a>2</a> <a>3</a>
                            <a>4</a> <a>5</a> <a>6</a> <a>7</a>
                            <a>8</a> <a>9</a>
                            <a>A</a> <a>B</a>
                            <a>C</a> <a>D</a> <a>E</a> <a>F</a>
                            <a>G</a> <a>H</a>  <a>J</a>
                            <a>K</a> <a>L</a> <a>M</a> <a>N</a>
                             <a>P</a> <a>Q</a> <a>R</a>
                            <a>S</a> <a>T</a> <a>U</a> <a>V</a>
                            <a>W</a><a>X</a> <a>Y</a> <a>Z</a>
                            <div id="clearparent"><div className="_btnClear" onTouchStart={this.btnClear.bind(this)}></div></div>
                            </div>
                        </div>
                    <div className="addtapa provinceAB hide" id = "12">
                        <div id="provinceAB">
                            <a>0</a> <a>1</a> <a>2</a> <a>3</a>
                            <a>4</a> <a>5</a> <a>6</a> <a>7</a>
                            <a>8</a> <a>9</a>
                            <a>A</a> <a>B</a>
                            <a>C</a> <a>D</a> <a>E</a> <a>F</a>
                            <a>G</a> <a>H</a> <a>J</a>
                            <a>K</a> <a>L</a> <a>M</a> <a>N</a>
                            <a>P</a> <a>Q</a> <a>R</a>
                            <a>S</a> <a>T</a> <a>U</a> <a>V</a>
                            <a>W</a><a>X</a> <a>Y</a> <a>Z</a>
                            <a>港</a><a>澳</a><a>学</a><a>警</a>
                            <div id="clearparent"><div className="_btnClear" onTouchStart={this.btnClear.bind(this)}></div></div>
                            </div>
                        </div>
                    </div>
            </div>
        )
	}
}
 function _poptip(mess) {
    $("#_poptip").html(mess);
    $("#_poptip").fadeIn(400, function() {
        setTimeout(function() {
            $("#_poptip").fadeOut('slow');
        }, 1200);
    });
};
export { CarNoInput };
