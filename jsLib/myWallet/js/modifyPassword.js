/**
 * Created by wq on 2017/2/15.
 */
import {Component} from "react";
import {NumericKeyboard} from "./numericKeyboard";
import jhtAjax from "../../common/util/JHTAjax";
import {RSAENCRYPT} from "../../common/util/Enum";
import {Link} from "react-router";
import {PopupTip} from "./popupTip";
let rows = [];

let stTip = {width:"100%", textAlign:"center", margin:"auto",  marginTop:"80px", fontSize:"0.28rem","position":" absolute"};
let stTdFirst = {width:"12%", height:"0.8rem", border:"1px solid #c6c6c6", textAlign:"center", backgroundColor:"white",  fontSize:"0.34rem","marginLeft":"1rem",fontWeight:"600",color:"#80c02b"};
let stTd = {width:"12%", height:"0.8rem", border:"1px solid #c6c6c6", borderLeft:"none", textAlign:"center", backgroundColor:"white",  fontSize:"0.34rem",fontWeight:"600",color:"#80c02b"};
let stNote = {width:"73%", margin:"auto", marginTop:"0.16rem", color:"#d9d9d9", fontSize:"0.26rem", color:"#959595",position:"absolute",top:"3.3rem",left:"1rem"};
let finsh = { margin:"0.3rem 0.2rem",width:"94%",height:"0.6rem",lineHeight:"0.6rem",textAlign:"center",backgroundColor:"#959595",fontSize:"0.24rem",color:"#000",position:"absolute",top:"3.5rem"}
export class ModifyPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            poptip: 100,
            passwords:""
        };
        
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);


    }
//修改密码
    finsh(){
        let pwd = document.getElementById("1").value +document.getElementById("2").value+document.getElementById("3").value+document.getElementById("4").value+document.getElementById("5").value+document.getElementById("6").value;
        let newpwd = document.getElementById("13").value +document.getElementById("14").value+document.getElementById("15").value+document.getElementById("16").value+document.getElementById("17").value+document.getElementById("18").value;
        this.finshDte(pwd,newpwd);
    }
    finshDte(pwd,newpwd){
        let carNo =  window.sessionStorage.getItem("key");
        let that = this;
       // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_NO:carNo,
                JST_CARD_PWD:pwd,
                NEW_JST_CARD_PWD:newpwd


            } };
        jhtAjax({
           // url: "http://192.168.1.156:8066/rsaTest/TestServlet",
            url:RSAENCRYPT,
            data: {
                key:pwd
            },
            type: 'post',
            dataType: 'text',
            async: false,   /*不传值默认异步调用*/
            success: function (pwd) {
                obj.attributes.JST_CARD_PWD=pwd;

                console.log(pwd);
            },
            error: function (error) {
                console.log("ajax failure");
            }
        });
        jhtAjax({
          //  url: "http://192.168.1.156:8066/rsaTest/TestServlet",
            url:RSAENCRYPT,
            data: {
                key:newpwd
            },
            type: 'post',
            dataType: 'text',
            async: false,   /*不传值默认异步调用*/
            success: function (newpwd) {;
                obj.attributes.NEW_JST_CARD_PWD=newpwd;
                console.log(newpwd);
            },
            error: function (error) {
                console.log("ajax failure");
            }
        });
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.jst.modcardpwd",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                   document.getElementById("attentiondata2") .className = "attentiondata2";
                }else if(data.resultcode == 2272){
                    rows.push(<PopupTip key = "1" txt="该用户没有绑定对应的捷顺通卡" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();
                    setTimeout(()=>{
                        location.reload();
                    },600)
                }

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    //完成
    finshclick(){

        document.getElementById("attentiondata2") .className = "hide";
        window.history.go(-1);
    }
    //返回
   getback(){
        //window.history.back();
        window.history.go(-2);
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

    }


    render() {
     let carno = window.sessionStorage.getItem("key");
     let car =  carno.substr(carno.length-4,carno.length)
        return (
            <div>
                <div className ="pssone" id = "pssone">
                <div style={stTip} id = "inputWord">请输入当前支付密码</div>
                    <div className="inputBtn" style = {{ "position": "absolute","top":"2rem"}}>
                        <input style={stTdFirst}  type = "password"  disabled unselectable="on" className="input input1 active" id = "1"/>
                        <input style={stTd}  type = "password" disabled unselectable="on" className = "input input2" id = "2"/>
                        <input style={stTd}  type = "password" disabled unselectable="on" className = "input input3" id = "3" />
                        <input style={stTd}  type = "password" disabled unselectable="on" className = "input input4" id = "4"/>
                        <input style={stTd}   type = "password" disabled unselectable="on" className = "input input5" id = "5"/>
                        <input style={stTd}  type = "password"  disabled unselectable="on" className = "input input6" id = "6"/>
                    </div>

                <div style={stNote} id = "NoUnbind" className="">若首次绑卡未设置支付密码，则填入卡背面的初始密码。</div>

                <NumericKeyboard/>
                  </div>
                <div className="hide" id = "psstwo">
                    <div style={stTip} id = "inputWord">设置支付密码，用于支付验证</div>
                    <div className="inputBtn"style = {{ "position": "absolute","top":"2rem"}}>
                        <input style={stTdFirst}  type = "password" disabled unselectable="on" className="input input1 active" id = "7"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input2" id = "8"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input3" id = "9" />
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input4" id = "10"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input5" id = "11"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input6" id = "12"/>
                    </div>
                    <p className="hide" id = "No" style = {{"position":"absolute","top":"3.3rem","left":"2.5rem"}}>两次密码输入不一致</p>

                    <NumericKeyboard/>
                </div>
                <div className="hide" id = "pssthree">
                    <div style={stTip} id = "inputWord">请再次输入支付密码</div>
                    <div className="inputBtn" style = {{ "position": "absolute","top":"2rem"}}>
                        <input style={stTdFirst} type = "password"  disabled unselectable="on" className="input input1 active" id = "13"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input2" id = "14"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input3" id = "15" />
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input4" id = "16"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input5" id = "17"/>
                        <input style={stTd} type = "password" disabled unselectable="on" className = "input input6" id = "18"/>
                    </div>
                    <div className="" style = {finsh} id  = "finshone">完成</div>
                    <div className="hide" id  = "finshtwo" onTouchStart  = {this.finsh.bind(this)} style = {{"position":"absolute","top":"3.5rem"}}>完成</div>

                    <NumericKeyboard/>
                </div>

                <section className = "hide"  id = "attentiondata2" >
                    <div className = "cover" style = {{height: window.innerHeight}}></div>
                    <div className = "message">
                        <p></p>

                        <div className="sure"  onTouchStart = {this.finshclick.bind(this)}>确定</div>

                    </div>


                </section>
                <section id = "Unbind" className="hide">
                    <p><img src="../images/pic_chose.png" alt="" style = {{"width":"1rem"}}/></p>
                    <p>解除绑定成功</p>
                    <p>已解除与尾号{car}的捷顺通卡的绑定</p>
                    <p>若您有其他卡片，请<span><Link to  = "/bindJSTCard" style = {{"color":"#80c02b"}}>点击进行绑定</Link></span></p>
                    <div className="" id  = "finshtwo"  onTouchStart= {this.getback.bind(this)}>完成</div>
                </section>
                {rows}

            </div>
        )
    }
}