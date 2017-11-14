/**
 * Created by wq on 2017/2/9.
 */
import {Component} from "react";
import {PopupTip} from "./popupTip";
import jhtAjax from "../../common/util/JHTAjax";
import {RSAENCRYPT} from "../../common/util/Enum";
import {Link} from "react-router";

let stInputCardNo = {width:"87%", height:"40px", margin:"15px 0 15px 15px", fontSize:"15px", paddingLeft:"10px", borderRadius:"0", border:"1px solid #959595",  "WebkitTapHighlightColor": "transparent"};
let stInputPassword = {width:"87%", height:"40px", margin:"0 0 10px 15px", fontSize:"15px", paddingLeft:"10px", borderRadius:"0", border:"1px solid #959595",  "WebkitTapHighlightColor": "transparent"};
let stTip = {width:"90%", marginLeft:"15px", fontSize:"13px", color:"#959595"};
let stImgOuter = {width:"180px",height:"115px", verticalAlign:"middle",lineHeight:"80px", textAlign:"center", margin:"0.3rem 1.7rem",background:"url(../images/pic_jstcard_2x.png)",backgroundSize:"cover"};
let stBtn = {width:"90%", padding:"10px 0 8px 0px", fontSize:"17px", margin:"auto",  textAlign:"center", borderRadius:"5px", backgroundColor:"#c3c3c3", color:"#959595"};
let stBtnOk = {width:"90%", padding:"10px 0 8px 0px", fontSize:"17px", margin:"auto",  textAlign:"center", borderRadius:"5px", backgroundColor:"#9adb43", color:"white"};
let stNote = {width:"100%", textAlign:"center", position:"fixed", bottom:"10px", fontSize:"13px", color:"#959595"};

let rows = [];
let Success = [];

export class AssociateJSTCard extends Component {
    constructor() {
        super();
        this.state = {
            click: false,   //按钮是否可点击状态
            poptip: 100       //用于改变状态使得“提示弹出框”显示
        }
        this.handleCardNoInput = this.handleCardNoInput.bind(this);
        this.handePasswordInput = this.handePasswordInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.cancelPopupTip = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    handleCardNoInput() {

        let cardNo = this.refs.cardNoInput.value;

        if (cardNo.length != 0 ) {
            this.refs.cardNoInput.style.fontSize = "17px";
        } else {
            this.refs.cardNoInput.style.fontSize = "15px";
        }

        this.handePasswordInput();
    }

    handePasswordInput() {

        let cardNo = this.refs.cardNoInput.value;
        let password = this.refs.cardPassword.value;

        //输入卡号密码后改变“点击按钮”的样式
        if (cardNo.length != 0 && password.length != 0) {
            this.setState({
                click:true
            });
        } else {
            this.setState({
                click:false
            });
        }
    }
    focus(){
        document.getElementById("tel").className = "hide";
    }


    handleClick() {
        if (this.refs.btn.style.color != "white") {  //“下一步”按钮不可点击
            return ;
        } else {                                         //“下一步”按钮可点击

            if ( rows.length != 0 ) {  //如果“提示框处于显示状态”，则不响应点击
                return ;
            }
            //输入合法性校验
            let cardNo = this.refs.cardNoInput.value.replace(/\s/g, '');
            let password = this.refs.cardPassword.value.replace(/\s/g, '');


            if( isNaN(cardNo) || cardNo.length != 19 ) {              //如果输入的卡号不全是数字或者卡号长度不是19位，则提示卡号输入错误
                rows.push( <PopupTip key="1"  txt="请输入正确的卡号" cancelPopupTip={ this.cancelPopupTip } /> );
                this.updateContent();
            } else if ( isNaN(password) || password.length != 6 ) {  //如果输入的密码不全是数字或者密码长度不是6位，则提示密码输入错误
                rows.push( <PopupTip key="2"  txt="请输入正确的密码" cancelPopupTip={ this.cancelPopupTip } /> );
                this.updateContent();
            } else {

                console.log("校验完毕，输入合法");
                document.getElementById("tel").className = " ";
                this.getPwd(password,cardNo)

            }

        }
    }
    //验证密码
    getPwd(password,cardNo){

        let that = this;

        // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_NO:cardNo,
                JST_CARD_PWD:password
            } };
        jhtAjax({
            //url: "http://192.168.1.197:8066/rsaTest/TestServlet",
            url:RSAENCRYPT,
            data: {

                key:password
            },
            type: 'post',
            dataType: 'text',
            async: false,   /*不传值默认异步调用*/
            success: function (password) {
                console.log(password);
                obj.attributes.JST_CARD_PWD=password;

            },
            error: function (error) {
                console.log("ajax failure");
            }
        });
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.jst.verifyjstcardpwd",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    that.getDate(password,cardNo);

                }else if( data.resultcode == 3114){
                    document.getElementById("attentiond").className = " ";
                    document.getElementById("psd").innerText = "密码次数过多，请稍后重试";
                    document.getElementById("mes").className = "hide";

                    document.getElementById("nuber").className = "hide";
                }else if(data.resultcode == 2022){
                    document.getElementById("attentiond").className = " ";
                    that.setState({
                        count:data.attributes.rest_pwd_count
                    });

                }else{
                    document.getElementById("attentiond").className = " ";
                    document.getElementById("psd").innerText = "密码次数过多，请稍后重试";
                    document.getElementById("nuber").className = "hide";
                }
            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }

    //重试
    falseclick(){
        document.getElementById("attentiond").className = "hide";
        document.getElementById("pwd").value = "";
    }

    //关联捷顺通卡
    getDate(password,cardNo){
        // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_NO:cardNo,
                JST_CARD_PWD:password,
                BIND_TYPE:1
            } };
        let that = this;
        jhtAjax({
            //  url: "http://192.168.1.156:8066/rsaTest/TestServlet",
            url:RSAENCRYPT,
            data: {
                key:password
            },
            type: 'post',
            dataType: 'text',
            async: false,   /*不传值默认异步调用*/
            success: function (password) {
                obj.attributes.JST_CARD_PWD=password;
                console.log(password);
            },
            error: function (error) {
                console.log("ajax failure");
            }
        });
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.jst.bindcard",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    document.getElementById("data").className = "hide";
                    document.getElementById("Bind").className = "Bind";


                }else{
                    if(data.message !== ""){
                        rows.push( <PopupTip key="2"  txt={data.message} cancelPopupTip={ that.cancelPopupTip } /> );
                        that.updateContent();
                    }else{
                        rows.push( <PopupTip key="2"  txt="捷顺通卡关联失败" cancelPopupTip={ that.cancelPopupTip } /> );
                        that.updateContent();
                    }

                }

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
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

    /*
    * 改变状态使得页面更新
    * */
    updateContent() {
        this.setState({
            poptip: this.props.poptip + 1
        });
    }

    componentWillUnmount() {
        rows = [];    //组件卸载前清空组件模块全局变量rows
        Success = [];
    }

    render() {
        return (
            <div>
            <div id = "data" className = "">
                <form action="">
                <input type="number" ref="cardNoInput" placeholder="请输入卡号" style={stInputCardNo} onInput={this.handleCardNoInput} onFocus={this.focus.bind(this)} />    {/*获取焦点时字体大小变为32，颜色为黑色*/}
                <input type="password" ref="cardPassword" placeholder="请输入支付密码" style={stInputPassword} onInput={this.handePasswordInput} id ="pwd" onFocus={this.focus.bind(this)}/>
                </form>
                    <p style={stTip} >如果首次关联卡片，请刮开背部密码刮条，输入密码</p>
                <div style={stImgOuter} >

                </div>
                <div ref="btn" style={ this.state.click == false? stBtn:stBtnOk} onTouchStart={this.handleClick} >下一步</div>
                <div style={stNote} id = "tel" className=" ">
                    如果您对上述情况有疑问 <br />
                    请致电捷顺客服电话 <span><a href="javascript:window.SYT && window.SYT.('4007005305')" style={{color: "#ff6e0e"}}>400-7005305</a></span>
                </div>

                {rows}   {/* 展示提示弹出框 */}

            </div>
                <section id = "Bind" className="hide">
                    <p><img src="../images/pic_chose.png" alt="" style = {{"width":'1rem'}}/></p>
                    <p>关联成功</p>
                    <p>您可以在"我的钱包"内进行充值、账单查询等功能</p>
                    <p>为了您的用卡安全，卡联成功后</p>
                    <p>请修改支付密码</p>
                    <div className="" id  = "bind" ><Link to = "/walletDetail/modifyPassword" style={{"color":"#fff"}}>修改支付密码</Link></div>
                </section>

                <section className = "hide"  id = "attentiond" >
                    <div className = "cover" style = {{height: window.innerHeight}}></div>
                    <div className = "message">
                        <p></p>
                        <p></p>
                        <p style  = {{"fontSize":"0.3rem","textAlign":"center","transform":"rotate(-3deg)"}} id = "psd" className=" ">密码不正确，还可以输入<span id = "nuber">{this.state.count}</span>次</p>
                        <div>
                            <span style = {{"color":"#80c02b"}} onTouchStart  = {this.falseclick.bind(this)}>重试</span>
                        </div>

                    </div>


                </section>
            </div>
        )
    }
}

