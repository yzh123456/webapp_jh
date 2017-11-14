/**
 * Created by wq on 2017/2/14.
 */
import {Component} from "react";
import {FogetCar} from "./fogetCar";
import {PopupTip} from "./popupTip";
import jhtAjax from "../../common/util/JHTAjax";
import {RSAENCRYPT} from "../../common/util/Enum";
let phone = "";
let rows = [];
let stInputPassword = {width:"87%", height:"40px", margin:"25px 0 0 15px", paddingLeft:"10px", fontSize:"15px", borderRadius:"0", border:"1px solid #959595",  "WebkitTapHighlightColor": "transparent"};
let stInputPasswordAgain = {width:"87%", height:"40px", margin:"20px 0 20px 15px",  paddingLeft:"10px", fontSize:"15px", borderRadius:"0", border:"1px solid #959595",  "WebkitTapHighlightColor": "transparent"};
let stInputVerifiCode = {width:"100%", height:"40px", fontSize:"15px",  paddingLeft:"10px",borderRadius:"0", border:"1px solid #959595",  "WebkitTapHighlightColor": "transparent", display:"block"};
let timeout;
let stGetVerfiCode = {width:"85%", lineHeight:"42px", marginLeft:"15%",fontSize:"15px",backgroundColor:"#f89d33", color:"white",textAlign:"center"};


export class ForgetPassword extends Component {
    constructor(...args) {
        super(...args);
        this.stateObj = {
            poptip: 100,
            tipstate:1

        };
        this.state = this.stateObj;
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);

    }

    Btninput(e){
     this.setState({
         tipstate:1
     })

    }
    Nextinput(e){
        this.setState({
            tipstate:2
        })

    }
    VerifiCode(e){
        this.setState({
            tipstate:3
        })

    }

    Btn(){
        if(document.getElementById("activeBtn").style.backgroundColor == "rgb(195, 195, 195)"){
            return;
        }else{
            if(document.getElementById("VerifiCode").value == ""){
                rows.push(<PopupTip key = "3" txt="验证码为空" cancelPopupTip={ this.cancelPopupTip }/>)
                this.updateContent();


            }else{
                let psd = document.getElementById("Btninput").value
                let VerifiCode = document.getElementById("VerifiCode").value
                this.getnewpsd(psd,VerifiCode);
            }
        }


    }
    //设置新密码
    getnewpsd(psd,VerifiCode){

        let carNo =  window.sessionStorage.getItem("key");
        let that  = this;
        let userId =  USERINFO.USER.USER_ID;
       // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_NO:carNo,
                NEW_JST_CARD_PWD:psd,
                SMS_CODE:VerifiCode
            } };

        jhtAjax({
            url: RSAENCRYPT,
            data: {
                key:psd
            },
            type: 'post',
            dataType: 'text',
            async: false,   /*不传值默认异步调用*/
            success: function (psd) {
                obj.attributes.NEW_JST_CARD_PWD = psd;
                console.log(psd);
            },
            error: function (error) {
                console.log("ajax failure");
            }
        });

        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.jst.resetcardpwd",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    rows.push( <PopupTip key="1"  txt="重置密码成功" cancelPopupTip={ that.cancelPopupTip } /> );
                    that.updateContent();
                    clearInterval(timeout);
                    console.log(that.props.location.query.key)
                    if(that.props.location.query.key == 1){
                        setTimeout(()=>{

                            window.history.go(-2);

                        },3000)

                    }else{
                        setTimeout(()=>{

                            window.history.back();

                        },3000)
                    }


                }else {
                    if(data.message !== ""){
                        rows.push( <PopupTip key="1"  txt={data.message} cancelPopupTip={ that.cancelPopupTip } /> );
                        that.updateContent();
                    }else{
                        rows.push( <PopupTip key="1"  txt="重置密码失败" cancelPopupTip={ that.cancelPopupTip } /> );
                        that.updateContent();
                    }

                }

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }


    //获取验证码
    getpwd(){
        if(document.getElementById("setcode").style.backgroundColor == "#959595"){
            return ;//“下一步”按钮不可点击
        } else {                                         //“下一步”按钮可点击

            if (rows.length != 0) {  //如果“提示框处于显示状态”，则不响应点击
                return;
            }

        let BtninputInner = document.getElementById("Btninput").value;
        let NextinputInner = document.getElementById("Nextinput").value;

        if(BtninputInner == "" && NextinputInner !== ""){
            rows.push(<PopupTip key = "3" txt="请输入新密码" cancelPopupTip={ this.cancelPopupTip }/>)
            this.updateContent();
        }
        if(NextinputInner == "" && BtninputInner !== ""){
            rows.push(<PopupTip key = "3" txt="请再次输入新密码" cancelPopupTip={ this.cancelPopupTip }/>)
            this.updateContent();
        }
        if(BtninputInner == "" && NextinputInner == ""){
            rows.push(<PopupTip key = "3" txt="请输入新密码" cancelPopupTip={ this.cancelPopupTip }/>)
            this.updateContent();
        }
        if(BtninputInner !== "" && NextinputInner !== ""){
            if(BtninputInner.length == 6 && NextinputInner.length == 6){
                if(BtninputInner!==NextinputInner){
                    rows.push(<PopupTip key = "3" txt="两次输入的密码不一致" cancelPopupTip={ this.cancelPopupTip }/>)
                    this.updateContent();
                }else{
                    this.getDate()
                }
            }else if(0<BtninputInner.length<6 || 0<NextinputInner.length<6){

                rows.push(<PopupTip key = "3" txt="新密码不可以少于六位数" cancelPopupTip={ this.cancelPopupTip }/>)
                this.updateContent();
            }
        }
      }

    }
    //验证码接口
    getDate(){
        let that = this;
      //  let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        var obj = {
            serviceId:"JSCSP_SYS_GETVERIFYCODE",
            dataItems:[]

        };
        var tmp = {
            attributes:{

                bizType:"RESETJSTCARDPWD" ,
                sign:userId ,
                userId: userId

            }
        };

        obj.dataItems.push(tmp);
        jhtAjax({

            //  url : 'http://jhtestcms.jslife.net/jspsn/XmppServer.servlet ',
            data: {
                //云服务 serviced
                serviceId:obj.serviceId,
                dataItems:JSON.stringify(obj.dataItems)

            },

            dataType : 'json',
            type:'post',

            success : function(data) {
                console.log(data)

                if(data.resultcode == 0){
                    phone = (data.attributes.telephone).substr(0, 3)+ '****' + (data.attributes.telephone).substr(7);;
                    document.getElementById("code").className = "tip";
                    //document.getElementById("Btn").className = "hide";
                    //document.getElementById("activeBtn").className = "activeBtn"
                    document.getElementById("setcode").style.backgroundColor = "#959595";
                    document.getElementById("numb").innerText = "60";
                    document.getElementById("mm").className = "";
                    rows.push(<PopupTip key="1" txt="验证码已发送" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();
                    that.timefresh();

                }else if(data.resultcode == 101){
                    rows.push(<PopupTip key="2" txt="未注册，请求重新注册" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }else{
                    rows.push(<PopupTip key = "3" txt="获取验证码失败,请稍后重试" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();
                }

            },
            error:function(){
                console.log("ajax faile");

            }
        });

    }
    //倒计时
    timefresh(){
        var seconds = 0;
        clearInterval(timeout);
        timeout = setInterval(()=>{
            seconds += 1;
            document.getElementById('numb').innerHTML = 60-seconds;
            if(seconds == 60){
                clearInterval(timeout);
                document.getElementById('numb').innerHTML = "获取验证码";
                document.getElementById("setcode").style.backgroundColor = "#f89d33";
                document.getElementById("mm").className = "hide";
                //document.getElementById("Btn").className = "Btn";
               // document.getElementById("activeBtn").className = "hide";


            }

        },1000)
    }
    /*
     * 取消弹出提示框
     * */
    cancelPopupTip() {
        rows = [];
        if (this && this.state) {    //该判断是防止子组件“提示弹出框”操作父组件“关联捷顺通卡”时父组件已经被卸载（比如点击浏览器的返回上一页操作）
            this.updateContent();
        }
    }

    updateContent() {
        this.setState({
            poptip: this.props.poptip + 1
        });
    }

    componentWillUnmount() {
        rows = [];    //组件卸载前清空组件模块全局变量rows
        clearInterval(timeout);

    }



    render() {

        let activestyle = {"width":"87%", "height":"40px", "margin":"25px 0 0 15px", "paddingLeft":"10px", "fontSize":"15px", "borderRadius":"0","border":"1px solid #80c02b","WebkitTransition":"border linear .2s,-webkit-box-shadow linear .5s","boxShadow":"0 0 3px #80c02b"}

        let nextstyle = {"width":"87%", "height":"40px", "margin":"20px 0 20px 15px", "paddingLeft":"10px", "fontSize":"15px", "borderRadius":"0","border":"1px solid #80c02b","WebkitTransition":"border linear .2s,-webkit-box-shadow linear .5s","boxShadow":"0 0 3px #80c02b"}
       let codestyle = {"width":"100%", "height":"40px", "fontSize":"15px",  "paddingLeft":"10px","borderRadius":"0",  "display":"block", "border":"1px solid #80c02b","WebkitTransition":"border linear .2s,-webkit-box-shadow linear .5s","boxShadow":"0 0 3px #80c02b"}
        return (
            <div>
                {
                    this.state.tipstate == 1?(<input  readOnly unselectable="on" type="password" placeholder="输入新密码" style={ activestyle } id = "Btninput"   onTouchStart = {this.Btninput.bind(this)} ref = "Btninput"/>):(
                        <input  readOnly unselectable="on" type="password" placeholder="输入新密码" style={ stInputPassword } id = "Btninput"   onTouchStart = {this.Btninput.bind(this)} ref = "Btninput"/>
                    )
                }
                {
                    this.state.tipstate == 2? (<input readOnly unselectable="on" type="password" placeholder="再次输入新密码" style={ nextstyle
                     } id = "Nextinput" onTouchStart = {this.Nextinput.bind(this)} ref = "Nextinput"/>):(
                        <input readOnly unselectable="on" type="password" placeholder="再次输入新密码" style={ stInputPasswordAgain } id = "Nextinput" className="" onTouchStart = {this.Nextinput.bind(this)} ref = "Nextinput"/>
                    )
                }



                <ul style={ { listStyle:"none", width:"90%", margin:"auto"} } >
                    <li style={ {float:"left", width:"55%"} } >
                        {
                            this.state.tipstate == 3?( <input readOnly unselectable="on"  type="text" placeholder="输入验证码" style={ codestyle } onTouchStart = {this.VerifiCode.bind(this)}  id = "VerifiCode" ref = "VerifiCode"/>):(
                                <input readOnly unselectable="on"  type="text" placeholder="输入验证码" style={ stInputVerifiCode } onTouchStart = {this.VerifiCode.bind(this)}  id = "VerifiCode" ref = "VerifiCode" />
                            )
                        }

                    </li>
                    <li style={ {float:"left", width:"45%"} }>
                        <div style={stGetVerfiCode} onTouchStart = {this.getpwd.bind(this)} id = "setcode"><span id = "numb">获取验证码</span><span id = "mm" className="hide">s</span></div>
                    </li>
                    <li className="hide" id = "code">验证码已发送至{phone}的手机，请查收</li>
                    <div style={ {clear:"both"} }></div>
                </ul>

                <div className = "Btn" id = "activeBtn" onTouchStart = {this.Btn.bind(this)}>设置新密码</div>
                <FogetCar flagnum = {this.state.tipstate}/>
                {rows}

            </div>
        )
    }
}


