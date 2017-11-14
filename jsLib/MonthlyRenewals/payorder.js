/**
 * Created by hua on 2017/3/7.
 */
import {Component} from "react";
import {RSAENCRYPT} from "../common/util/Enum";
import jhtAjax from "../common/util/JHTAjax";
import {Success} from"./success";
import {Fail} from"./fail";
let stTdFirst = {width:"12%", height:"0.8rem", border:"1px solid #c6c6c6", textAlign:"center", backgroundColor:"white",  fontSize:"0.28rem","marginLeft":"1rem"};
let stTd = {width:"12%", height:"0.8rem", border:"1px solid #c6c6c6", borderLeft:"none", textAlign:"center", backgroundColor:"white",  fontSize:"0.28rem"};
let stWrapper = {zIndex:"100000",position:"fixed", bottom:"0", width:"100%"};

let stColoumA = { width:"33%", height:"1rem", border:"1px solid #959595", borderTop:"none", textAlign:"center",  backgroundColor:"white" };
let stColoumB = { width:"33%", height:"1rem", borderBottom:"1px solid #959595", textAlign:"center",  backgroundColor:"white" };
let stColoumC = { width:"33%", height:"1rem", borderLeft:"1px solid #959595", borderRight:"1px solid #959595",textAlign:"center",  backgroundColor:"white" };
let stColoumD = { width:"33%", height:"1rem", border:"none", textAlign:"center", backgroundColor:"#d9d9d9"};
let index = 0;
let flag = 0;
let number = 0;
class PayOrder extends Component{
    constructor() {
        super();
        this.state = {
            password:"",
            showstate:false,
            showsfail:false,
            count:4
        }

    }
    //点击键盘
    getNumberClick(e){
        index++;

        if(index<=6){
            if(document.getElementById(index).className = "active"){

                document.getElementById(index).value = e.target.innerText;
                $(index+1).addClass("active").siblings().removeClass(".active");
                $("#2").focus().siblings().blur();
            }
        }
        if(index == 6){

            document.getElementById("fin").style.backgroundColor = "#80c02b"
            //this.getDate(psd);
        }

    }

    //取消
    cancelNumberClick(){
        flag ++;
        if(document.getElementById(index).className = "active" && flag == 1){
            document.getElementById(index).value = "";
            document.getElementById(index--).className = "active"

        }else if(flag % 2 == 0 || flag % 3 == 0 || flag % 4 == 0 || flag % 5 == 0 || flag % 6 == 0){
            document.getElementById(index).value = "";
            document.getElementById(index--).className = "active";
        }


    }
    //完成
    finish(){
        number++;
        if(number>1){
            return;
        }
        if(document.getElementById("fin").style.backgroundColor != "rgb(128, 192, 43)"){
            return;

        }else{
            let psd = document.getElementById("1").value +document.getElementById("2").value+document.getElementById("3").value+document.getElementById("4").value+document.getElementById("5").value+document.getElementById("6").value;
            let carno = this.props.carno;
            this.getDate(psd,carno);

        }

    }
    //验证密码
    getDate(psd,carno){
        let that = this;

        // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_NO:carno,
                JST_CARD_PWD:psd
            } };
        jhtAjax({
            //url: "http://192.168.1.156:8066/rsaTest/TestServlet",
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
                serviceId:"ac.jst.verifyjstcardpwd",
                attributes:obj.attributes,
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    that.getPay(psd,carno);
               

                }else if( data.resultcode == 3114){
                    that.setState({showsfail:true});
                    document.getElementById("psd").innerText = "密码次数过多，请稍后重试";
                    document.getElementById("mes").className = "hide";

                    document.getElementById("nuber").className = "hide";
                }else if(data.resultcode == 2022){
                    that.setState({
                        showsfail:true,
                        count:data.attributes.rest_pwd_count
                    });

                }else{
                    that.setState({showsfail:true});
                    if(data.message !== ""){
                        document.getElementById("psd").innerText = data.message;
                        document.getElementById("nuber").className = "hide";
                    }else{
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
    //支付请求
    getPay(psd,carno){
        let that = this;
        let orderno = this.props.orderno;

        // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
                JST_CARD_PWD:psd,
                JST_CARD_NO:carno,
                ORDER_NO:orderno
            } };
        jhtAjax({
            //url: "http://192.168.1.156:8066/rsaTest/TestServlet",
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
                serviceId:"ac.pay.jstcardpay",
                attributes:obj.attributes,
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    that.setState({showstate:true});
                    document.getElementById("confirmcar").className = "hide";
                    document.getElementById("mes").className = "hide";

                }else if( data.resultcode == 3114){
                    that.setState({showsfail:true});
                    document.getElementById("psd").innerText = "密码次数过多，请稍后重试";
                    document.getElementById("mes").className = "hide";

                    document.getElementById("nuber").className = "hide";
                }else if(data.resultcode == 2022){
                    that.setState({
                        showsfail:true,
                        count:data.attributes.rest_pwd_count
                    });

                }else{
                    that.setState({showsfail:true});
                    document.getElementById("psd").innerText = "支付失败，请稍后重试";
                    document.getElementById("nuber").className = "hide";
                }

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }

    //取消
    cancelpay(){
        document.getElementById("mes").className = "hide";
        location.reload();
    }

    render() {
        let coverstyle = {"width":"100%","height":"100%","position":"fixed","top":"0","zIndex":"100","backgroundColor":"#000","opacity":"0.7"}
        let div1style = {"borderRadius":"10px","width":"68%","height":"40%","position":"fixed","left":"16%","top":"10%","zIndex":"99999","backgroundColor":"#fff"}
        let p1style = {"fontSize":"0.24rem","color":"#959595","textAlign":"center","marginTop":"0.5rem"}
        let p2style = {"fontSize":"0.5rem","color":"#ff6e0e","textAlign":"center","marginTop":"0.3rem"}
        let p3style = {"fontSize":"0.24rem","color":"#000","textAlign":"center","marginTop":"0.4rem"}
        let p4style = {"position":"absolute","left":"0","bottom":"0","fontSize":"0.26rem","width":"100%","height":"0.7rem","lineHeight":"0.7rem","color":"#fff","backgroundColor":"#959595","borderRadius":"10px","textAlign":"center","marginTop":"1rem",}
        let p5style = {"position":"absolute","right":"-1px","top":"0","background":"url(../images/close.png)","width":"0.7rem","height":"0.7rem","backgroundSize":"cover"}
        let divstyle;
        let display = this.props.display;
        let money = this.props.totalmoney;

        if(!display){
            divstyle = {"display":"none"};
        }

        return(
            <div>
                <div style = {divstyle} id = "mes" className="">
                    <div>
                        <div className = "cover" style = {coverstyle}></div>
                        <div style  = {div1style}>
                            <p style = {p5style} onTouchStart = {this.cancelpay.bind(this)}></p>
                            <p style = {p1style}>需付款(元)</p>
                            <p style = {p2style}>{money}</p>
                            <p style = {p3style}>请输入支付密码</p>
                            <p></p>
                            <div style = {{"marginLeft":" -0.6rem"}}>
                                <input style={stTdFirst}  type="password" disabled unselectable="on" className="active" id = "1" />
                                <input style={stTd} type="password" disabled unselectable="on" className = "" id = "2"/>
                                <input style={stTd} type="password" disabled unselectable="on" className = "" id = "3" />
                                <input style={stTd} type="password" disabled unselectable="on" className = "" id = "4"/>
                                <input style={stTd} type="password" disabled unselectable="on" className = "" id = "5"/>
                                <input style={stTd} type="password" disabled unselectable="on" className = "" id = "6"/>
                            </div>
                            <p style = {p4style} onTouchStart = {this.finish.bind(this)} id = "fin">完成</p>
                        </div>
                    </div>
                    <div style={stWrapper} >
                        <table cellSpacing="0" style={ {width:"100%", border:"0"} } >
                            <tbody>
                            <tr>
                                <td style={stColoumB}>
                                    <p style={ {fontSize:"0.48rem"} }  onTouchStart = {this.getNumberClick}>1</p>
                                    <p style={ {fontSize:"0.2rem"} } >&nbsp;</p>
                                </td>
                                <td style={stColoumA}>
                                    <p style={ {fontSize:"0.48rem"} }  onTouchStart = {this.getNumberClick}>2</p>
                                    <p style={ {fontSize:"0.2rem"} } >ABC</p>
                                </td>
                                <td style={stColoumB}>
                                    <p style={ {fontSize:"0.48rem"} }  onTouchStart = {this.getNumberClick}>3</p>
                                    <p style={ {fontSize:"0.2rem"} } >DEF</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={stColoumB}>
                                    <p style={ {fontSize:"0.48rem"} }  onTouchStart = {this.getNumberClick}>4</p>
                                    <p style={ {fontSize:"0.2rem"} } >GHI</p>
                                </td>
                                <td style={stColoumA} >
                                    <p style={ {fontSize:"0.48rem"} } onTouchStart = {this.getNumberClick}>5</p>
                                    <p style={ {fontSize:"0.2rem"} } >JKL</p>
                                </td>
                                <td style={stColoumB}>
                                    <p style={ {fontSize:"0.48rem"} }  onTouchStart = {this.getNumberClick}>6</p>
                                    <p style={ {fontSize:"0.2rem"} } >MNO</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={stColoumB} >
                                    <p style={ {fontSize:"0.48rem"} } onTouchStart = {this.getNumberClick}>7</p>
                                    <p style={ {fontSize:"0.2rem"} } >PQR</p>
                                </td>
                                <td style={stColoumA}>
                                    <p style={ {fontSize:"0.48rem"} }  onTouchStart = {this.getNumberClick}>8</p>
                                    <p style={ {fontSize:"0.2rem"} } >TUV</p>
                                </td>
                                <td style={stColoumB}>
                                    <p style={ {fontSize:"0.48rem"} }  onTouchStart = {this.getNumberClick}>9</p>
                                    <p style={ {fontSize:"0.2rem"} } >WXYZ</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={stColoumD} >
                                </td>
                                <td style={stColoumC}>
                                    <p style={ {fontSize:"24px"} }  onTouchStart = {this.getNumberClick}>0</p>
                                </td>
                                <td style={stColoumD} onTouchStart = {this.cancelNumberClick}>
                                    <img src="../images/pic_keyboard_del_2x.png" style={ {width:"0.5rem", paddingTop:"0.32rem"} } />
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>

                </div>

                {/*<Success show = {this.state.showstate} parkingname = {this.props.parkingname} booktime = {this.props.booktime} totaltime = {this.props.totaltime}/>*/}
                <Fail show = {this.state.showsfail} pwdcount = {this.state.count}/>

            </div>
        )
    }

}
export {PayOrder}