/**
 * Created by yqx on 2017/3/2.
 */
import {Component} from "react";
import {render} from "react-dom";
import JHTAJAX from "../common/util/JHTAjax";
import MyToast from "../common/components/MyToast";
import MyAlert from "../common/components/MyAlert";
import {DownloadApp} from "../downloadApp/DownloadApp";
import Common from "../common/Common";
import {REDIRECTMENU} from "./../common/util/Enum";
import {Loading, operateMask} from "../common/components/Loading";
class BindTelphone extends Component {
    constructor(props){
        super(props);
        this.timeout="";
        new Common();
        this.countdown=120; //倒计时默认120S
        this.myToast = new MyToast();
    }
    timefresh(){
        let seconds = 0;
        clearInterval(this.timeout);
        if (typeof document.getElementById("getCode").onclick === "function" || typeof document.getElementById("getCode").onclick === "object"){
            document.getElementById("getCode").removeAttribute("onClick");
            document.getElementById('getCode').innerHTML = this.countdown-seconds;
            document.getElementById("getCode").onclick = function () {
                return false;
            };
            document.getElementById("getCode").style.backgroundColor = "#D9D9D9";
        }
        this.timeout = setInterval(()=>{
            seconds += 1;
            document.getElementById('getCode').innerHTML = this.countdown-seconds;
            if(seconds == this.countdown){
                clearInterval(this.timeout);
                document.getElementById("getCode").onclick = this.sendVerifyCode.bind(this);
                document.getElementById('getCode').innerHTML = "获取验证码";
                document.getElementById("getCode").style.backgroundColor = "#f89d33";
            }
        },1000)
    }

    componentDidMount(){
        operateMask('hide');
        document.getElementById("getCode").onclick = this.sendVerifyCode.bind(this);
    }
    /*确认关联手机*/
    bindTelphone(){
        if (!this.validate()){
            return false;
        }else {
            var serviceId = "JSCSP_USER_REGUSERINFO";
            var obj = {};
            try {
                obj.password = Math.random().toString().split("0.")[1].substring(0,6);
            }catch (e){
                obj.password = "123456";
            }
            obj.userType = "APP";
            obj.sign = this.refs.tel.value.trim();
            obj.vertificationCode = this.refs.vertificationCode.value.trim();
            obj.openId = USERINFO.USER.clientId;
            obj.appType = USERINFO.APP.APP_TYPE;
            var xmppdata = {
                dataItems:[
                    { attributes:obj }
                ]
            };
            JHTAJAX({
                data: {
                    serviceId:serviceId,
                    dataItems:xmppdata.dataItems
                },
                dataType: 'json',
                success : function(data) {
                    if(data.resultCode == '0'){
                        this.myToast.setToast("恭喜，注册成功了！");
                        setTimeout(function () {
                            window.localStorage.removeItem("USERINFO");
                            window.location.href = `${REDIRECTMENU}?appType=${USERINFO.APP.APP_TYPE}&url=${document.referrer.split("?")[0]}`;
                            return false;
                        },2000);
                        /*let myAlert=new MyAlert();
                        myAlert.setContent("恭喜，注册成功了！");
                        myAlert.setAlert(function () {
                            window.history.go(-1);
                            if(USERINFO&&USERINFO.APP.APP_TYPE){
                                window.location.href = `${REDIRECTMENU}?appType=${USERINFO.APP.APP_TYPE}&url=${document.referrer.split("?")[0]}`;
                            }
                        });*/
                    }else if(data.resultCode == 2239 ){
                        this.myToast.setToast(`关联失败了！该手机已经被关联过了`);
                    }else {
                        this.myToast.setToast(`关联失败！${data.message}`);
                    }
                }.bind(this),
                error:function(data) {
                    this.myToast.setToast("抱歉！注册到火星去了");
                }
            });
        }

    }
    /*发送验证码*/
    sendVerifyCode(){
        if (!this.validatePhone())
            return;
        var serviceId = "JSCSP_SYS_GETVERIFYCODE";
        var obj = {};
        obj.userId =  /*USERINFO?USERINFO.USER.USER_ID:*/"";
        obj.bizType = "REGISTER";
        obj.sign = this.refs.tel.value.trim();
        var xmppdata = {
            dataItems:[
                { attributes:obj }
            ]
        };
        JHTAJAX({
            data: {
                serviceId:serviceId,
                dataItems:xmppdata.dataItems
            },
            dataType: 'json',
            success : function(data) {
                if(data.resultCode == '0'){
                    this.timefresh();
                    this.myToast.setToast("验证码已发送！");
                }
                else{
                    this.myToast.setToast(`验证码发送失败！${data.message}`);
                }
            }.bind(this),
            error:function() {
                this.myToast.setToast("验证码发送开小差了~");
            }
        });
    }

    validatePhone() {
        if (!this.refs.tel.value.trim()) {

            this.myToast.setToast("请输入您的手机号码！");
            return false;
        }
        if (!this.checkPhone(this.refs.tel.value.trim())) {
            //$("#tips").text("您输入的手机号格式不正确。").show();
            this.myToast.setToast("您输入的手机号格式不正确！");
            return false;
        }
        return true;
    }
    checkPhone(value) {
        return (/^1[3|4|5|7|8]\d{9}$/.test(value));
    }
    /*表单提交数据校验*/
    validate(){
        if(!this.validatePhone()){
            return false;
        }
        if(!this.refs.vertificationCode.value){
            this.myToast.setToast("验证码为空！");
            return false;
        }
        if(!this.checkCode(this.refs.vertificationCode.value)){
            this.myToast.setToast("验证码格式不正确！");
            return false;
        }
        return true;
    }
    checkCode(value) {
        return (/\d{4}$/.test(value));
    }
    render() {
        return(
            <section className="f32" >
                <div className="inputTel">
                    <input type="tel" ref="tel" className="Telphone " placeholder="请输入手机号码"/>
                    <input type="number" ref="vertificationCode" className="Telphone "  placeholder="请输入验证码"/>
                    <span id="getCode"  className="code" >获取验证码</span >
                </div>
                <span className="text f24">验证手机可以享受捷停车更多服务哦</span>
                <button className="bindTelphone f34" onClick={this.bindTelphone.bind(this)}>关联手机</button>
            </section>
        )
    }
}
render(
    <div>
        <Loading taskCount="1"/>
        <BindTelphone />
        <MyAlert confirm="确定" contect="手机号关联成功！"/>
        <DownloadApp/>
    </div>,
    document.querySelector("#bindTelphone")
);