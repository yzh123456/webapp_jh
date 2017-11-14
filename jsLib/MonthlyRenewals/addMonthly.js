/**
 * Created by hua on 2017/2/28.
 */
import {Component} from "react";
import jhtAjax from "../common/util/JHTAjax";
import {PopupTip} from "../myWallet/js/popupTip";
import {AddCar} from "./addCar";
import {DownloadApp} from "../downloadApp/DownloadApp";
let rows = [];
let timeout;
class AddMonthly extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            poptip: 100,
            flag:1
        };
        this.state = this.stateObj;
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);

    }

    //失去焦点下载页消失
    inputOnBlur(){
        document.getElementById("down").className = " ";
    }
    //获取焦点下载页消失
    inputOnFocus(){
        document.getElementById("down").className = "hide";
    }
    //添加月卡
    addmonthly(){
        this.refs.test.className = "test";
        this.refs.addmonthly.className = "hide";

    }
    //获取验证码
    getCode(){
        if(document.getElementById("getCode").style.backgroundColor == "#959595"){
            return ;//“下一步”按钮不可点击
        } else {                                         //“下一步”按钮可点击

            if (rows.length != 0) {  //如果“提示框处于显示状态”，则不响应点击
                return;
            }
            let tel = document.getElementById("tel").value;
            let code = document.getElementById("code").value;

            if(tel == ""){
                rows.push(<PopupTip key="1" txt="手机号码不能为空" cancelPopupTip={ this.cancelPopupTip }/>)
                this.updateContent();

            }else if(!(/^1[34578]\d{9}$/.test(tel))) {
                rows.push(<PopupTip key="3" txt="手机号码格式不正确" cancelPopupTip={ this.cancelPopupTip }/>)
                this.updateContent();

            }else{
                this.Code(tel);
            }

        }

    }
    Code(tel){
        let _this = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
      //  let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let  obj = {
            dataItems:[]
        }
        let tmp = {
            attributes:{
                userId:userId,
                sign:tel,
                bizType:"OPENSERVICE"

            } };

        obj.dataItems.push(tmp);
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_SYS_GETVERIFYCODE",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    document.getElementById("getCode").style.backgroundColor = "#959595";
                    document.getElementById("number").innerText = "150";
                    document.getElementById("mm").className = "";
                    rows.push(<PopupTip key="5" txt="验证码已发送" cancelPopupTip={ _this.cancelPopupTip }/>)
                    _this.updateContent();
                    _this.timefresh();

                }else if(data.resultcode == 101){
                    rows.push(<PopupTip key="6" txt="未注册，请求重新注册" cancelPopupTip={ _this.cancelPopupTip }/>)
                    _this.updateContent();

                }else {
                    if(data.message !== ""){
                        rows.push(<PopupTip key="6" txt={data.message} cancelPopupTip={ _this.cancelPopupTip }/>)
                        _this.updateContent();
                    }else{
                        rows.push(<PopupTip key="6" txt="获取验证码失败,请稍后重试" cancelPopupTip={ _this.cancelPopupTip }/>)
                        _this.updateContent();
                    }


                }
            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    //倒计时
    timefresh(){
        var seconds = 0;
        clearInterval(timeout);
        timeout = setInterval(()=>{
            seconds += 1;
            document.getElementById('number').innerHTML = 150-seconds;
            if(seconds == 150){
                clearInterval(timeout);
                document.getElementById('number').innerHTML = "获取验证码";
                document.getElementById("getCode").style.backgroundColor = "#f89d33";
                document.getElementById("mm").className = "hide";

            }

        },1000)
    }
    //验证添加月卡
    addDate(){
        let tel = document.getElementById("tel").value;
        let code = document.getElementById("code").value;
        let userId =  USERINFO.USER.USER_ID;
        if(tel == ""){
            rows.push(<PopupTip key="1" txt="手机号码不能为空" cancelPopupTip={ this.cancelPopupTip }/>)
            this.updateContent();

        }else if(code == ""){
            rows.push(<PopupTip key="2" txt="验证码不能为空" cancelPopupTip={ this.cancelPopupTip }/>)
            this.updateContent();

        }else{
            this.add(tel,code,userId);
        }

    }
    add(tel,code,userId){
        let that = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
       // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let  obj = {
            attributes:{
                USER_ID:userId,
                TELEPHONE:tel,
                APPLY_CODE:code

            }
        }


        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.sys.sy_applycommuservice",
                attributes:JSON.stringify(obj.attributes)
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    document.getElementById("success").className = "hide";
                    document.getElementById("tip").className = "";

                }else if(data.resultcode == 2212){
                    rows.push(<PopupTip key="4" txt="暂无个人登记信息，请到管理处登记" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();
                }else{
                    rows.push(<PopupTip key="4" txt="验证码不正确" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }


            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    componentWillUnmount() {
        rows = [];    //组件卸载前清空组件模块全局变量rows

        clearInterval(timeout);

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
    render(){
        let pstyle = {"borderRadius":"5px","margin":"0.3rem","backgroundColor":"#fff","border":"1px dashed #959595","width":"91%","height":"3rem","lineHeight":"3rem","textAlign":"center","fontSize":"0.32rem","color":"#80c02b"}
        let spanstyle = { "fontSize":"0.4rem","marginRight":"0.1rem"};
        let divstyle = {"marginTop":"0.3rem","position":"relative"};
        let inputstyle = {"display": "inherit","paddingLeft":"0.1rem","backgroundColor":"#fff","borderBottom":"1px solid #eee","width":"100%","height":"1rem"};
        let inputstyle3 = {"display": "inherit","paddingLeft":"0.1rem","backgroundColor":"#fff","width":"100%","height":"1rem"}
        let spstyle  = {"position":"absolute","bottom":"0.2rem","right":"0.3rem","backgroundColor":"#f89d33","fontSize":"0.24rem","color":"#fff", "height": "0.6rem","lineHeight":"0.6rem","width": "1.3rem","borderRadius": "5px","textAlign":"center"}
        let pstyle1  = {"fontSize":"0.32rem","borderRadius":"5px","width":"94%","margin":"0.3rem 0.2rem 0 0.2rem","height":"0.9rem","lineHeight":"0.9rem","backgroundColor":"#80c02b","color":"#fff","textAlign":"center"}
        return(
            <div>
                <div id = "down" className=" ">
                    <DownloadApp/>
                </div>

                <div id = "success" className=" ">
              <p ref = "addmonthly" style = {pstyle} onClick = {this.addmonthly.bind(this)}> <span style = {spanstyle}>+</span><span >添加月卡</span></p>
                <div  ref = "test" className="hide">
                    <div style = {divstyle}>
                        <input type="tel" placeholder="请输入手机号码" style={inputstyle} id = "tel"  className="tel" onBlur={this.inputOnBlur.bind(this) } onFocus={this.inputOnFocus.bind(this) } />
                        <input type="number" placeholder="请输入验证码" style={inputstyle3} id = "code"   className="code" onBlur={this.inputOnBlur.bind(this) } onFocus={this.inputOnFocus.bind(this) } />
                        <span style = {spstyle} onClick = {this.getCode.bind(this)} id = "getCode"><span id = "number">获取验证码</span><span id = "mm" className="hide">s</span></span>

                    </div>
                    <p style = {pstyle1} onClick = {this.addDate.bind(this)}>确认</p>


                </div>
                {rows}
                </div>
                <div id = "tip"  className="hide">
                    <AddCar key = "1"/>
                </div>

            </div>

        )
    }

}
export { AddMonthly }