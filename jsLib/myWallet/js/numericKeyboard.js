/**
 * Created by wq on 2017/2/15.
 */
import {Component} from "react";
import jhtAjax from "../../common/util/JHTAjax";
import { RSAENCRYPT } from "../../common/util/Enum";
import {Link} from "react-router";
import {PopupTip} from "../../myWallet/js/popupTip";
let stWrapper = {position:"absolute", bottom:"0", width:"100%"};

let stColoumA = { position:"relative",width:"33%", height:"1rem", border:"1px solid #959595", borderTop:"none", textAlign:"center",  backgroundColor:"white" };
let stColoumB = { position:"relative", width:"33%", height:"1rem", borderBottom:"1px solid #959595", textAlign:"center",  backgroundColor:"white" };
let stColoumC = { position:"relative",width:"33%", height:"1rem", borderLeft:"1px solid #959595", borderRight:"1px solid #959595",textAlign:"center",  backgroundColor:"white" };
let stColoumD = { position:"relative", width:"33%", height:"1rem", border:"none", textAlign:"center", backgroundColor:"#d9d9d9"};

let index = 0;
let flag = 0;
let psd2, psd3;
let rows = [];
export class NumericKeyboard extends Component {
    constructor() {
        super();
        this.state = {
            password:"",
            poptip:100,
            count:4
        }

        this.getNumberClick = this.getNumberClick.bind(this);
        this.cancelNumberClick = this.cancelNumberClick.bind(this);
         this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }
    //模拟键盘点击事件
    getNumberClick(e){

        index++;
        console.log(e.target)


        this.setState({
            password:e.target.innerText
        });
        if( document.getElementById("pssone").className == "pssone"){
            if(index<=6){
                if(document.getElementById(index).className = "active"){

                    document.getElementById(index).value = e.target.innerText;
                    $(index+1).addClass("active").siblings().removeClass(".active");
                    $("#2").focus().siblings().blur();
                }
            }
            if(index == 6){
                let psd = document.getElementById("1").value +document.getElementById("2").value+document.getElementById("3").value+document.getElementById("4").value+document.getElementById("5").value+document.getElementById("6").value
                this.getDate(psd);

            }
            if(index>=6){

                index = 0;

            }


        }else if( document.getElementById("psstwo").className == "pssone"){


            if(index<=6){
                if(document.getElementById(index+6).className = "active"){

                    document.getElementById(index+6).value = e.target.innerText;
                    $(index+7).addClass("active").siblings().removeClass(".active");
                    $("#2").focus().siblings().blur();
                }
            }
            if(index == 6){
                psd2 = document.getElementById("7").value +document.getElementById("8").value+document.getElementById("9").value+document.getElementById("10").value+document.getElementById("11").value+document.getElementById("12").value;
                document.getElementById("pssthree").className = "pssone";
                document.getElementById("psstwo").className = "hide";

            }
            if(index>=6){
                index = 0;
            }

        }else if( document.getElementById("pssthree").className == "pssone"){
            if(index<=6){
                if(document.getElementById(index+12).className = "active"){

                    document.getElementById(index+12).value = e.target.innerText;
                    $(index+13).addClass("active").siblings().removeClass(".active");
                    $("#2").focus().siblings().blur();

                }
            }
            if(index == 6){

                psd3 = document.getElementById("13").value +document.getElementById("14").value+document.getElementById("15").value+document.getElementById("16").value+document.getElementById("17").value+document.getElementById("18").value;
                if(psd2 == psd3){
                    document.getElementById("finshone").className = "hide";
                    document.getElementById("finshtwo").className = "finsh";
                }else{
                    document.getElementById("pssthree").className = "hide";
                    document.getElementById("psstwo").className = "pssone";
                    document.getElementById("pssone").className = "hide";
                    document.getElementById("No").className = "No";
                    document.getElementById("7").value = "";
                    document.getElementById("8").value = ""
                    document.getElementById("9").value = ""
                    document.getElementById("10").value = ""
                    document.getElementById("11").value = ""
                    document.getElementById("12").value = ""
                    document.getElementById("13").value = ""
                    document.getElementById("14").value = ""
                    document.getElementById("15").value = ""
                    document.getElementById("16").value = ""
                    document.getElementById("17").value = ""
                    document.getElementById("18").value = ""


                }


            }
            if(document.getElementById("13").value !=="" && document.getElementById("14").value !=="" && document.getElementById("15").value !=="" && document.getElementById("16").value !=="" && document.getElementById("17").value !=="" && document.getElementById("18").value !==""){
                document.getElementById("finshtwo").style.backgroundColor = "#80c02b";
            }else{
                document.getElementById("finshtwo").style.backgroundColor = "#959595";
            }

        }

       }

    //取消
    cancelNumberClick(){
        flag ++;
        if(document.getElementById("pssone").className == "pssone"){
            if(document.getElementById(index).className = "active" && flag == 1){
                document.getElementById(index).value = "";
                document.getElementById(index--).className = "active"

            }
            if(document.getElementById(index).value!== ""){
                if(flag % 2 == 0 || flag % 3 == 0 || flag % 4 == 0 || flag % 5 == 0 || flag % 6 == 0){
                    document.getElementById(index).value = "";
                    document.getElementById(index--).className = "active";
                }
            }
        }else if( document.getElementById("psstwo").className == "pssone"){
            if(document.getElementById(index+6).className = "active" && flag == 1){
                document.getElementById(index+6).value = "";
                document.getElementById(index+5).className = "active";
                index --;

            }
            if(document.getElementById(index+6).value!== ""){

                if(flag % 2 == 0 || flag % 3 == 0 || flag % 4 == 0 || flag % 5 == 0 || flag % 6 == 0){
                    document.getElementById(index+6).value = "";
                    document.getElementById(index+5).className = "active";
                    index--;

                }
            }
        }else if( document.getElementById("pssthree").className == "pssone"){
            if(document.getElementById(index+12).className = "active" && flag == 1){
                document.getElementById(index+12).value = "";
                document.getElementById(index+11).className = "active";
                index --;
                if(document.getElementById("13").value !=="" && document.getElementById("14").value !=="" && document.getElementById("15").value !=="" && document.getElementById("16").value !=="" && document.getElementById("17").value !=="" && document.getElementById("18").value !==""){
                    document.getElementById("finshtwo").style.backgroundColor = "#80c02b";
                }else{
                    document.getElementById("finshtwo").style.backgroundColor = "#959595";
                }

            } else if(document.getElementById(index+12).value!== ""){
                if(flag>6){
                    flag = 1;
                }
                if(flag == 1 || flag % 2 == 0 || flag % 3 == 0 || flag % 4 == 0 || flag % 5 == 0 || flag % 6 == 0){
                    document.getElementById(index+12).value = "";
                    document.getElementById(index+11).className = "active";
                    index --;
                    if(document.getElementById("13").value !=="" && document.getElementById("14").value !=="" && document.getElementById("15").value !=="" && document.getElementById("16").value !=="" && document.getElementById("17").value !=="" && document.getElementById("18").value !==""){
                        document.getElementById("finshtwo").style.backgroundColor = "#80c02b";
                    }else{
                        document.getElementById("finshtwo").style.backgroundColor = "#959595";
                    }
                }

            }


        }

    }
    //验证密码
    getDate(psd){

        let that = this;
        let carNo =  window.sessionStorage.getItem("key");

       // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_NO:carNo,
                JST_CARD_PWD:psd
            } };
        jhtAjax({
            //url: "http://192.168.1.197:8066/rsaTest/TestServlet",
            url:RSAENCRYPT,
            data: {

                key:psd
            },
            type: 'post',
            dataType: 'text',
            async: false,   /*不传值默认异步调用*/
            success: function (psd) {
                console.log(psd);
                obj.attributes.JST_CARD_PWD=psd;

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
                    index = 0;
                   var url = window.location.href;
                   if(url.substring(url.lastIndexOf('/')+1, url.length) == "modifyPassword"){
                       document.getElementById("psstwo").className = "pssone";
                       document.getElementById("pssone").className = "hide";

                   }
                   if(url.substring(url.lastIndexOf('/')+1, url.length) == "UnbindJsCard"){
                    let pwd = document.getElementById("1").value +document.getElementById("2").value+document.getElementById("3").value+document.getElementById("4").value+document.getElementById("5").value+document.getElementById("6").value;
                      that.UnbindCard(pwd)
                   }


                }else if( data.resultcode == 3114){
                   index = 0;
                   document.getElementById("attentiondata").className = " ";
                   document.getElementById("psd").innerText = "密码次数过多，请稍后重试";
                   document.getElementById("mes").className = "hide";

                   document.getElementById("nuber").className = "hide";
               }else if(data.resultcode == 2022){
                   index = 0;
                   document.getElementById("attentiondata").className = " ";
                   that.setState({
                       count:data.attributes.rest_pwd_count
                   });

               }else{
                   index = 0;
                   if(data.message !== ""){
                       document.getElementById("attentiondata").className = " ";
                       document.getElementById("psd").innerText = data.message;
                       document.getElementById("nuber").className = "hide";
                   }else{
                       document.getElementById("attentiondata").className = " ";
                       document.getElementById("psd").innerText = "密码次数过多，请稍后重试";
                       document.getElementById("nuber").className = "hide";
                   }

               }
            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    
    //解绑
    UnbindCard(psd){
        let carNo =  window.sessionStorage.getItem("key");
        let that = this;
       // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_NO:carNo,
                JST_CARD_PWD:psd,
                BIND_TYPE:0
            } };
        jhtAjax({
           // url: "http://192.168.1.156:8066/rsaTest/TestServlet",
            url:RSAENCRYPT,
            data: {
                key:psd
            },
            type: 'post',
            dataType: 'text',
            async: false,   /*不传值默认异步调用*/
        success: function (psd) {
            obj.attributes.JST_CARD_PWD=psd;
            console.log(psd);
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
                document.getElementById("pssone").className = "hide"

                document.getElementById("Unbind").className = "Unbind";

            }else{
                rows.push(<PopupTip key = "2" txt="解绑失败" cancelPopupTip={ that.cancelPopupTip }/>)
                that.updateContent();

            }

        } ,
        error:  function (error) {
            console.log("ajax failure");
        }
     } );
    }
    //重试
    falseclick(){
        document.getElementById("attentiondata").className = "hide";
        document.getElementById("1").value = "";
        document.getElementById("2").value = "";
        document.getElementById("3").value = "";
        document.getElementById("4").value = "";
        document.getElementById("5").value = "";
        document.getElementById("6").value = "";



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

        let pathdata = {
            pathname : "/walletDetail/forgetPassword",
            query : {
                key:1

            }
        };
        return (
            <div style={stWrapper} >
                <table cellSpacing="0" style={ {width:"100%", border:"0",cursor:"pointer"} } >
                    <tbody>
                    <tr>
                        <td style={stColoumB}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }   onTouchStart= {this.getNumberClick}>1</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >&nbsp;</p>
                        </td>
                        <td style={stColoumA} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }   onTouchStart = {this.getNumberClick}>2</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >ABC</p>
                        </td>
                        <td style={stColoumB} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>3</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >DEF</p>
                        </td>
                    </tr>
                    <tr>
                        <td style={stColoumB} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>4</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >GHI</p>
                        </td>
                        <td style={stColoumA} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>5</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >JKL</p>
                        </td>
                        <td style={stColoumB}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }   onTouchStart = {this.getNumberClick}>6</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >MNO</p>
                        </td>
                    </tr>
                    <tr>
                        <td style={stColoumB} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>7</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >PQR</p>
                        </td>
                        <td style={stColoumA} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>8</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >TUV</p>
                        </td>
                        <td style={stColoumB} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }   onTouchStart = {this.getNumberClick}>9</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >WXYZ</p>
                        </td>
                    </tr>
                    <tr>
                        <td style={stColoumD} >
                        </td>
                        <td style={stColoumC} >
                            <p style={ {fontSize:"24px","width":"100%","height":"100%","lineHeight":"1rem"} }   onTouchStart = {this.getNumberClick}>0</p>
                        </td>
                        <td style={stColoumD} onTouchStart = {this.cancelNumberClick}>
                            <img src="../images/pic_keyboard_del_2x.png" style={ {width:"0.5rem", paddingTop:"0.32rem"} } />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <section className = "hide"  id = "attentiondata" >
            <div className = "cover" style = {{height: window.innerHeight}}></div>
        <div className = "message">
            <p></p>
            <p></p>
            <p style  = {{"fontSize":"0.3rem","textAlign":"center","transform":"rotate(-3deg)"}} id = "psd" className=" ">密码不正确，还可以输入<span id = "nuber">{this.state.count}</span>次</p>
            <div>
            <span onTouchStart  = {this.falseclick.bind(this)}>重试</span>
        <div className="forget" ><Link to  = {pathdata} style = {{"color":"#80c02b"}}>忘记密码</Link></div>
            </div>

            </div>


            </section>

                {rows}
            </div>
        )
    }
}