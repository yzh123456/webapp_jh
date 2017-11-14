/**
 * Created by Administrator on 2016/12/8.
 */
import {Component} from "react";
let myAlertS =  {
    "width": "80%",
    "minHeight": "2rem",
    "margin": "-1.00rem 10%",
    "position": "fixed",
    "top": "40%",
    "zIndex": "11000",
    "fontSize": "0.32rem",
     "background": "#67d80f",
    "borderRadius": "5px",
    };
let confirmSureS = {
    "width": "50%",
    "height": "0.92rem",
    "lineHeight": "0.92rem",
    "textAlign": "center",
    "background": "#FFF",
    "display": "inline-block",
    "color": "#FFF",
    "margin": "0 2%",
    "fontSize": "0.32rem",
    "border": "none",
    "margin": "0",
    "padding": "0",
    "color": "#9ADB43",
    "borderBottomLeftRadius":"0px",
    "borderBottomRightRadius":"5px",
}
let contentS={
    "lineHeight": "0.40rem",
    "height": "0.80rem",
    "width": "100%",
    "float": "left",
    "fonSize": "1.6em",
    "margin": "0.7rem 0 0.5rem",
    "fontFamily": "OfficialScript",
    "color":"#fff",
    "transform": "rotate(-8deg)",
    "textAlign": "center",
    "fontSize": "0.38rem"
}
let confirmCancelS = {
    "width": "50%",
    "height": "0.92rem",
    "lineHeight": "0.92rem",
    "textAlign": "center",
    "background": "#FFF",
    "display": "inline-block",
    "margin": "0 2%",
    "fontSize": "0.32rem",
    "border": "none",
    "margin": "0",
    "padding": "0",
    "float": "left",
    "color": "#222222",
    "borderRight": "1px solid #9ADB43",
    "borderRadius": "0px 0px 0px 5px",
    "opacity": "1"
}
let maskS = {
    "width":"100%",
    "position": "fixed",
    "height": "100%",
    "backgroundColor": "#000",
    "top": "0",
    "opacity": "0.7"
}
export default class MyAlert extends Component {
    setAlert(confirm = "",cancel = ""){
        if(confirm && typeof confirm === "function"){
            document.getElementById("confirm_sure").onclick = confirm;
        }else{
            document.getElementById("confirm_sure").onclick = this.closeAlert;
        }
        if(cancel && typeof cancel === "function"){
            document.getElementById("confirm_cancel").onclick = cancel;
        }else{
            document.getElementById("confirm_cancel").onclick = this.closeAlert;
        }
        document.getElementById("myAlert").style.display="inline-block";
    }
    setContent(value){
        document.getElementById("content").innerText = value;
    }
    setConfirmTxt(value){
        document.getElementById("confirm_sure").innerText = value;
    }
    setCancelTxt(value){
        document.getElementById("confirm_cancel").innerText = value;
        this.taggleConfirm(2);
        document.getElementById("confirm_cancel").style.display = "inline-block";
    }
    closeAlert(){
        document.getElementById("myAlert").style.display="none";
    }
    taggleConfirm(type = 1){
        if(type==1){
            document.getElementById("confirm_sure").style.width = "100%";
            document.getElementById("confirm_sure").style.borderBottomLeftRadius = "5px";
            document.getElementById("confirm_sure").style.borderBottomRightRadius = "5px";
        }else if(type==2){
            document.getElementById("confirm_sure").style.width = "50%";
            document.getElementById("confirm_sure").style.borderBottomLeftRadius = "0";
        }

    }
    render () {
        if(!this.props.cancel){
            confirmCancelS.display = "none";
            confirmSureS.width = "100%";
            confirmSureS.borderBottomLeftRadius = "5px";
        }
        return  (<div id="myAlert" style={{"display": "none"}}>
                <div  onClick={this.closeAlert} style={maskS}></div>
                <div ref="myAlert"  style={myAlertS}>
                     <p id="content" style={contentS}>{this.props.content ?this.props.content : "您确定要进行该操作吗？"}</p>
                     <button type="button" id="confirm_sure" onClick="" ref="confirmSure" style={confirmSureS}>{this.props.confirm ?this.props.confirm : "确定"}</button>
                     <button type="button" id="confirm_cancel" onClick="" ref="confirmCancel" style={confirmCancelS} >{this.props.cancel ?this.props.cancel : "再想想看"}</button>
                </div>
            </div>);
    }
}


