/**
 * Created by hua on 2017/4/11.
 */
import {Component} from "react";
import {CarNoInput} from "../../common/components/carNoInput";
import jhtAjax from "../../common/util/JHTAjax";
import {CarTip} from "./cartip";
import {Link} from "react-router";
import  JHT  from "../../common/util/JHT";
import $ from "../../common/jquery-3.1.1.min";
let jht = new JHT();
let rows = [];
let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏港澳川宁港澳琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1,2}$/;
let flag = 0;
//用户有车辆的时候生成订单（不管失败或成功）走此组建
class AddOrder extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            car:"",
            aa:true,
            parkid:"",
            businesser_code:"",
            park_code:"",
            parkname:this.props.data !==""?(this.props.data.dataitems.length>0?this.props.data.dataitems[0].subitems:[]):[],
            display:true

        };
        this.state = this.stateObj;
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);

    }


    //添加车牌
    addcar(){

        window.sessionStorage.setItem("carAddress",document.getElementById("carAddress").innerText);
        this.setState({
            aa:false
        });
        document.getElementById("cover").style.display= "none";
    }
    //拿到车牌
    handel(vehicleNo){
        flag = 1;
        if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID !== ""){
            window.sessionStorage.setItem("carno",vehicleNo);
        }else{
            window.localStorage.setItem("carno",vehicleNo);
        }
        this.props.handelcarno(vehicleNo,flag);
        if(vehicleNo !=="" && vehicleNo.length == 9 ){

            document.getElementById("carno").innerText = vehicleNo;
            document.getElementById("1").innerText = "";
            document.getElementById("2").innerText = "";
            document.getElementById("3").innerText = "";
            document.getElementById("4").innerText = "";
            document.getElementById("5").innerText = "";
            document.getElementById("6").innerText = "";
            document.getElementById("7").innerText = "";
            document.getElementById("8").innerText = "";

            $("#1").addClass("active").siblings("._input").removeClass("active");
            $("#9").removeClass("hide").siblings("div").addClass("hide");
            $("#1").css({background:"#9ADB43"});
            $("#1").siblings("._input").css({background:"#f0eff5"});
            $("#8").css({background:"-webkit-gradient(linear, 0% 0%, 0% 100%,from(#C0C6C2), to(#0CF24C))"})

            this.setState({aa:true});
            console.log(vehicleNo);
            //let userId = window.localStorage.getItem("userid");


        }else if(vehicleNo !=="" && vehicleNo.length == 8){
            document.getElementById("carno").innerText = vehicleNo;
            document.getElementById("1").innerText = "";
            document.getElementById("2").innerText = "";
            document.getElementById("3").innerText = "";
            document.getElementById("4").innerText = "";
            document.getElementById("5").innerText = "";
            document.getElementById("6").innerText = "";
            document.getElementById("7").innerText = "";
            document.getElementById("8").innerText = "";

            $("#1").addClass("active").siblings("._input").removeClass("active");
            $("#9").removeClass("hide").siblings("div").addClass("hide");
            $("#1").css({background:"#9ADB43"});
            $("#1").siblings("._input").css({background:"#f0eff5"});
            $("#8").css({background:"-webkit-gradient(linear, 0% 0%, 0% 100%,from(#C0C6C2), to(#0CF24C))"})

            this.setState({aa:true});
            //let userId = window.localStorage.getItem("userid");


        }
    }

    componentWillUnmount(){
        rows = [];
    }
    /*
     * 取消弹出提示框
     * */
    cancelPopupTip() {
        document.getElementById("addtip").className = "hide";
        rows = [];
    }

    //点击车辆显示
    addcarno(e){
        flag =1;
        document.getElementById("carno").innerText = e.target.innerText;
        window.sessionStorage.setItem("carno",e.target.innerText);
        window.sessionStorage.removeItem("carAddress");
        this.props.handelcar( e.target.innerText,flag);

    }
    componentWillMount(){

        if(!jht.urlParams().key){

                if (this.props.data.dataitems && this.props.data.dataitems.length > 0) {
                    if(window.sessionStorage.getItem("tip")!="1") {
                        window.sessionStorage.removeItem("tip");
                        window.sessionStorage.setItem("tip", "1");
                        window.sessionStorage.setItem("parkid", window.sessionStorage.getItem("parkid") || this.props.data.dataitems[0].subitems[0].attributes.park_id);
                        window.sessionStorage.setItem("businesser_code", window.sessionStorage.getItem("businesser_code") || this.props.data.dataitems[0].subitems[0].attributes.businesser_code);
                        window.sessionStorage.setItem("park_code", window.sessionStorage.getItem("park_code") || this.props.data.dataitems[0].subitems[0].attributes.park_code);
                    }/*else {
                        return;
                    }*/
                } else {
                        this.getTip();
                }
        }/*else{
            return;
        }*/

    }
    componentDidMount(){
       /* if(window.location.href.indexOf("key") > -1){
            if(jht.urlParams().key.split(",")[2] && jht.urlParams().key.split(",")[2] !== null){
                document.getElementById("carno").innerText = jht.urlParams().key.split(",")[2]

            }
        }*/
        if((USERINFO.USER.USER_ID == undefined ||  USERINFO.USER.USER_ID == "") && jht.urlParams().key == -1){
            if(window.localStorage.getItem("carno")!==null && window.localStorage.getItem("carno")!==""){
                document.getElementById("carno").innerText = window.localStorage.getItem("carno");
            }

        }


    }
    //没有停车场---获取停车场
    getTip(){
        let that = this;
        //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;

        let obj = {
            dataItems: []
        };
        let sub ={
            attributes:{
                FUNCTION_NAME:"手机缴费"
            }
        };
        let subit = [];
        subit.push(sub);
        let tmp = {
            attributes: {
                USER_ID:userId,
                longitude : this.props.longitude,//longitude,//
                latitude :this.props.latitude,// latitude,//
                beforelongitude :this.props. longitude,//longitude,//
                beforelatitude :this.props.latitude,//latitude,//
                DISTANCE:3000,
                PAGE_SIZE:5,
                PAGE_INDEX:1,
                synch_signal: new Date().getTime() + ''
            },
            subItems:subit
        };

        obj.dataItems.push(tmp);
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.map.sy_getlocationquerypark",
                dataItems:obj.dataItems,
            },
            type: 'post',
            dataType: 'json',
            async: false,   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    if(that.props.data == ""){
                        that.stateObj.parkname = data.dataitems;
                        if(data.dataitems.length>0){
                            window.sessionStorage.setItem("parkid",window.sessionStorage.getItem("parkid") || data.dataitems[0].attributes.id);
                            window.sessionStorage.setItem("businesser_code", window.sessionStorage.getItem("businesser_code") || data.dataitems[0].attributes.businesser_code || "");
                            window.sessionStorage.setItem("park_code",window.sessionStorage.getItem("park_code") || data.dataitems[0].attributes.park_code);
                        }
                        that.setState(that.stateObj);
                    }else if(that.props.data.dataitems.length<=0 || that.props.data.resultcode !== 0){
                        that.stateObj.parkname = data.dataitems;
                        if(data.dataitems.length>0){
                            window.sessionStorage.setItem("parkid",window.sessionStorage.getItem("parkid") || data.dataitems[0].attributes.id);
                            window.sessionStorage.setItem("businesser_code", window.sessionStorage.getItem("businesser_code") || data.dataitems[0].attributes.businesser_code || "");
                            window.sessionStorage.setItem("park_code",window.sessionStorage.getItem("park_code") || data.dataitems[0].attributes.park_code);
                        }
                        that.setState(that.stateObj);
                    }

                }else{
                    that.stateObj.parkname = "未找到停车场";
                    that.setState(that.stateObj);
                }

            },
            complete:function(data){

            },
            error:  function (error) {
                operateMask("hide")

            }
        } );

    }
    //获取车场id
    getparkid(id,businesser_code,park_code){
        if(id !== "" && id !== null){
            this.stateObj.parkid  = id;
            this.setState(this.stateObj)

        }else{
            this.stateObj.parkid  = "";
            this.setState(this.stateObj)
        }
        if(businesser_code !== "" && businesser_code !== null){
            this.stateObj.businesser_code  = businesser_code;
            this.setState(this.stateObj)
        }else{

            this.stateObj.businesser_code  = "";
            this.setState(this.stateObj)
        }
        if(park_code !== "" && park_code !== null){
            this.stateObj.park_code  = park_code;
            this.setState(this.stateObj)
        }else{
            this.stateObj.park_code  = "";
            this.setState(this.stateObj)
        }

    }
    //去支付
    topay(){
        let tel;
        if(window.USERINFO.USER.TEL == null || window.USERINFO.USER.TEL == undefined || window.USERINFO.USER.TEL == "null"|| window.USERINFO.USER.TEL == "undefined" ){
            tel = ""
        }else{
            tel = window.USERINFO.USER.TEL;
        }
        let userid = USERINFO.USER.USER_ID;
        let businesser_code = this.props.data.dataitems[0].attributes.businesser_code;
        let  park_code = this.props.data.dataitems[0].attributes.park_code;
        let strs = businesser_code+","+park_code+","+ document.getElementById("carno").innerText;
        if( jht.urlParams().key){  //扫码进来

            if(reg.test(jht.urlParams().key.split(",")[2] )){
                let str = encodeURIComponent(jht.urlParams().key);

                window.location.href = jht.basePath().cloudURL+"/qrcode/qrcodeorder.html?key="+str+"&USER_ID="+userid+"&APP_TYPE=WX_JTC&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

            }else{
                let  businesser_code = jht.urlParams().key.split(",")[0];
                let  park_code = jht.urlParams().key.split(",")[1];
                let  key  = businesser_code+","+park_code+","+ document.getElementById("carno").innerText;
                window.location.href = jht.basePath().cloudURL+"/qrcode/qrcodeorder.html?key="+encodeURIComponent(key)+"&USER_ID="+userid+"&APP_TYPE=WX_JTC&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

            }

        }else{
            window.location.href = jht.basePath().cloudURL+"/qrcode/qrcodeorder.html?key="+strs+"&USER_ID="+userid+"&APP_TYPE=WX_JTC&TEL="+tel+"&clientId="+window.USERINFO.USER.clientId;

        }
    }
    //根据停车场查订单
    getaddress(caraddress,businesser_code,park_code){
        this.props.address(caraddress,businesser_code,park_code);

    }
    componentWillUnmount(){
        window.sessionStorage.removeItem("tiptoo");
        window.sessionStorage.removeItem("tip");
    }
    render() {

        let p2style = {"fontSize": "0.5rem", "textAlign": "center", "margin": "0.3rem 0", "paddingTop": "0.46rem"};
        let sp5style = {
            "top": "0.5rem",
            "right": "0.6rem",
            "position": "absolute",
            "background": "url(./images/cars_click.png)",
            "width": "0.35rem",
            "height": "0.35rem",
            "backgroundSize": "cover"
        }
        let p3style = {"fontSize": "0.28rem", "color": "#959595", "textAlign": "center", "margin": "0.2rem 0 0.3rem"};
        let p4style = {"fontSize": "0.28rem", "margin": "0.2rem 0.3rem", "color": "#959595"};
        let ulstyle = {"fontSize": "0.28rem", "overflow": "hidden", "marginLeft": "-0.07rem"};
        let listyle = {
            "float": "left",
            "width": "2.1rem",
            "border": "1px solid #dbdbdb",
            "textAlign": "center",
            "lineHeight": "0.9rem",
            "height": "0.9rem",
            "marginBottom": "0.3rem",
            "marginLeft": "0.3rem",
            "backgroundColor": "#fff"
        };
        let divstyle = {"backgroundColor": "#9adb43"};
        let div1style = {
            "backgroundColor": "#fdffda",
            "margin": "0.5rem 0.9rem 0",
            "borderTopLeftRadius": "15px",
            "borderTopRightRadius": "15px",
            "position":"relative",
            "boxShadow":"0 -10px 10px #fdf5f5 inset,0 -5px 20px rgb(94,142,31)"
        };
        let p5style = {
            "lineHeight": "1.2rem",
            "textAlign": "center",
            "fontSize": "0.28rem",
            "color": "#ff6e0e",
            "textDecoration": "underline"
        };

        //时间的处理--转换
        let day,hours,minute,sec,time;
        if(this.props.data.dataitems && this.props.data.dataitems.length>0){
            time = this.props.data.dataitems[0].attributes.service_time;
            if(time == 0){
                hours = 0;
                minute = 0;
                day = 0;
            }
            day = parseInt(time/(3600*24));// 天
            let h_s = parseInt(time%(3600*24));// 小时
            hours = parseInt(h_s/3600);
            let m_s = parseInt(h_s%3600);// 小时
            minute = parseInt(m_s/60);
            sec = time - day*(3600*24)-3600*hours - 60*minute;
            if(sec>0){
                sec = 0;
                minute = minute+1;
                if(hours>=24){
                    hours = hours-24;
                    day = day+1;
                }
            }
           /* if(day<10){
                day = "0"+day;
            }
            if(hours<10){
                hours = "0"+hours;
            }
            if(minute<10){
                minute = "0"+minute;
            }*/

        }


        let pathdata = {
            pathname: "/vaguecar",
            query: {
                carNo: this.props.defaultcar,
                parkId: window.sessionStorage.getItem("parkid"),
                code: window.sessionStorage.getItem("businesser_code"),
                parkcode: window.sessionStorage.getItem("park_code")
            }
        };
//console.log(this.stateObj.parkid+"--"+this.stateObj.businesser_code+"--"+this.stateObj.park_code)---test  code
        console.log(this.props);
        return (

            <div>
                <div id="content" className=" ">
                    <div style = {divstyle}>

                        <CarTip data={this.state.parkname} getparkid={this.getparkid.bind(this)}
                                retcode={this.props.data !== ""?(this.props.data.dataitems.length>0?this.props.data.dataitems[0].attributes.retcode:undefined):undefined}
                                rescode={this.props.data.resultcode} park_name = {this.props.data !== ""?(this.props.data.dataitems.length>0?this.props.data.dataitems[0].attributes.park_name:undefined):undefined} getaddress = {this.getaddress.bind(this)}/>
                        <div style={div1style}>
                            <p style={p2style} onClick={this.addcar.bind(this)}>
                                <span id="carno">{this.props.defaultcar}</span>

                                <span style={sp5style}></span>
                            </p>

                            {
                                (this.props.data.resultcode == 0 && this.props.data.dataitems[0].attributes.retcode == "0") ? (
                                    <div><p style={p3style}>

                                        已停时长: {
                                        day > 0 ? (<span>{day}天</span>) : (
                                            <span style={{"display":"none"}}>{day}天</span>)

                                        }
                                        {
                                            day > 0 || hours > 0? (<span>{hours}时</span>) : (
                                                <span style={{"display":"none"}}>{hours}小时</span>)
                                        }
                                        {
                                            day > 0 || hours>0 || minute > 0 ? (<span>{minute}分</span>) : (
                                                <span style={{"display":"none"}}>{minute}分</span>)
                                        }
                                    </p>
                                        <p style={{"fontSize":"0","lineHeight":"0"}}>><img src="./images/line.png" alt=""
                                                                          style={{"width":"5rem","marginLeft":"0.37rem"}}/>
                                        </p>

                                        <p style={p5style}>
                                            <span style={{"fontSize":"0.6rem","color":"#ff6e0e"}}><span
                                                style={{"fontSize":"0.32rem"}}>￥</span>{this.props.data.dataitems[0].attributes.total_fee}</span>
                                <span
                                    style={{"fontSize":"0.28rem","color":"#959595","marginLeft":"0.2rem"}}>
                                    {
                                        (this.props.data.dataitems[0].attributes.service_fee > this.props.data.dataitems[0].attributes.total_fee) ? (
                                            <span style={{"textDecoration":"line-through"}}>￥{this.props.data.dataitems[0].attributes.service_fee}</span>) : (
                                            <span
                                                style={{"display":"none"}}>￥{this.props.data.dataitems[0].attributes.service_fee}</span>)
                                    }
                                   </span>

                                        </p></div>) : ( <div>

                                    {
                                        this.props.data == ""?(<div>
                                            {
                                                <p style={p3style}>

                                                    系统繁忙，请到人工收费处缴费
                                                </p>
                                            }
                                        </div>):(<div>
                                            {
                                                this.props.data.dataitems.length>0 ?(<div>
                                                    {
                                                        this.props.data.dataitems[0].attributes.retcode == "2"?(<p style={p3style}>

                                                            车辆入场后，可查看停车信息
                                                        </p>):(<div>
                                                                {
                                                                    this.props.data.dataitems[0].attributes.retcode == "1000"?( <p style={p3style}>

                                                                        亲，没有查询到车辆哦！
                                                                    </p>):( <div>
                                                                        {
                                                                            this.props.data.dataitems[0].attributes.retcode == "5"?(<p style={p3style}>

                                                                                亲，您的车辆是月卡，无需缴费
                                                                            </p>):(<div>
                                                                                {
                                                                                    this.props.data.dataitems[0].attributes.retcode == "13"?(<p style={p3style}>

                                                                                        亲，您当前的费用已全额优惠，无需缴费
                                                                                    </p>):(<div>
                                                                                        {
                                                                                            this.props.data.dataitems[0].attributes.retcode == "9"? (<p style={p3style}>

                                                                                                亲，您已缴费
                                                                                            </p>):(<div>
                                                                                                {
                                                                                                    this.props.data.dataitems[0].attributes.retcode == "10"?(<p style={p3style}>

                                                                                                    已停时长: {
                                                                                                    day > 0 ? (<span>{day}天</span>) : (
                                                                                                        <span style={{"display":"none"}}>{day}天</span>)

                                                                                                    }
                                                                                                    {
                                                                                                        day > 0 || hours > 0? (<span>{hours}时</span>) : (
                                                                                                            <span style={{"display":"none"}}>{hours}小时</span>)
                                                                                                    }
                                                                                                    {
                                                                                                        day > 0 || hours>0 || minute > 0 ? (<span>{minute}分</span>) : (
                                                                                                            <span style={{"display":"none"}}>{minute}分</span>)
                                                                                                    }

                                                                                                    </p>):(<div>
                                                                                                        {
                                                                                                            this.props.data.dataitems[0].attributes.retcode == "666"?( <p style={p3style}>

                                                                                                                系统繁忙，请到人工收费处缴费
                                                                                                            </p>): (<p style={p3style}>

                                                                                                                车辆入场后，可查看停车信息
                                                                                                            </p>)
                                                                                                        }

                                                                                                    </div>)


                                                                                                }
                                                                                            </div>)
                                                                                        }
                                                                                    </div>)
                                                                                }
                                                                            </div>)
                                                                        }
                                                                    </div>)
                                                                }
                                                            </div>

                                                        )
                                                    }

                                                </div>):(<p style={p3style}>

                                                    车辆入场后，可查看停车信息
                                                </p>)
                                            }
                                        </div>)



                                    }

                                    <p style={{"fontSize":"0","lineHeight":"0"}}>><img src="./images/line.png" alt=""
                                                                      style={{"width":"5rem","marginLeft":"0.37rem"}}/>
                                    </p>
                                    {
                                        this.props.data == ""?(<div>
                                            <Link to={pathdata}><p style={p5style}>
                                                试试匹配相似车牌?
                                            </p></Link>
                                        </div>):(<div>
                                            {
                                                this.props.data.dataitems.length>0?(<div>
                                                    {
                                                        this.props.data.dataitems[0].attributes.retcode == "10"?(<p style={p5style}>
                                                            {
                                                                this.props.data.dataitems[0].attributes.free_minute && this.props.data.dataitems[0].attributes.free_minute !== ""?(<span>{`进场${this.props.data.dataitems[0].attributes.free_minute}分钟内,无需缴费`}</span>):(<span>免费停车时间段内，无需缴费</span>)
                                                            }
                                                        </p>):(<div>
                                                            <Link to={pathdata}><p style={p5style}>
                                                                试试匹配相似车牌?
                                                            </p></Link>
                                                        </div>)
                                                    }

                                                </div>):(<div>
                                                    <Link to={pathdata}><p style={p5style}>
                                                        试试匹配相似车牌?
                                                    </p></Link>
                                                </div>)
                                            }

                                        </div>)
                                    }
                                    </div>)
                            }


                        </div>

                    </div>
                    {
                        this.props.items.length > 0 ? (  <p style={p4style}>我的车辆：</p>) : (
                            <p style={{"display":"none"}}>我的车辆：</p>)
                    }


                    <ul style={ulstyle}>
                        {
                            this.props.items.map((item, i)=> {
                                return (
                                    <li style={listyle} key={`li-${i}`} onClick={this.addcarno.bind(this)}>
                                        {item.attributes.car_no}
                                    </li>
                                )

                            })
                        }


                    </ul>
                    <div style={{"clear":"both"}}></div>
                    {
                        this.props.data == ""?( <p style={{"height":"0.9rem","lineHeight":"0.9rem","width":"92%","textAlign":"center","color":"#fff","fontSize":"0.34rem","backgroundColor":"#c3c3c3","borderRadius":"5px","margin":"0.3rem","marginTop":"0.5rem"}}>
                            去缴费</p>):(<div>
                            {
                                (this.props.data.dataitems.length > 0) && (this.props.data.dataitems[0].attributes.retcode == "0") ? (
                                    <p style={{"height":"0.9rem","lineHeight":"0.9rem","width":"92%","textAlign":"center","color":"#fff","fontSize":"0.34rem","backgroundColor":"#80c02b","borderRadius":"5px","margin":"0.3rem"}}
                                       onClick={this.topay.bind(this)}>去缴费</p>
                                ) : (
                                    <p style={{"height":"0.9rem","lineHeight":"0.9rem","width":"92%","textAlign":"center","color":"#fff","fontSize":"0.34rem","backgroundColor":"#c3c3c3","borderRadius":"5px","margin":"0.3rem","marginTop":"0.8rem"}}>
                                        去缴费</p>
                                )
                            }
                        </div>)
                    }

                </div>
                {rows}
                <CarNoInput key="1" message="确定" before="" copemlt={this.state.aa} handel={ this.handel.bind(this)}/>

            </div>
        )
    }


}
export{AddOrder}