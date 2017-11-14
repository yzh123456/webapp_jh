/**
 * Created by wq on 2017/2/14.
 */

import {Component} from "react";
import {Link} from "react-router";

let stMask = { position:"fixed", width:"100%", height:"100%", backgroundColor:"black", zIndex:2, left:"0", top:"0",  animation:"opacityChange 0.5s", animationFillMode:"forwards"};
let stMaskDisappear = { position:"fixed", width:"100%", height:"100%", backgroundColor:"black", zIndex:2, left:"0", top:"0",  animation:"opacityFadeOut 0.3s"};
let stBtnDiv = { width:"100%", height:"4.2rem", backgroundColor:"white", position:"fixed", bottom:"0px", zIndex:"3", animation:"heightChange 0.5s", animationFillMode:"forwards"};
let stBtnDivDisappear =  { width:"100%", height:"4.2rem", backgroundColor:"white", position:"fixed", bottom:"0px", zIndex:"3", animation:"heightDecrease 0.3s", animationFillMode:"forwards"};
let stBtn = { width:"90%", padding:"0.16rem 0rem 0.12rem 0rem", fontSize:"0.34rem", margin:"auto", marginTop:"0.2rem", textAlign:"center", borderRadius:"5px", backgroundColor:"#9adb43", color:"white"};
let stBtnCancel = { width:"90%", padding:"0.16rem 0rem 0.12rem 0rem", fontSize:"0.34rem", margin:"auto", marginTop:"0.2rem", textAlign:"center", borderRadius:"5px", backgroundColor:"#c3c3c3", color:"white"};



export class PopupMenu extends Component {
    constructor() {
        super();
        this.state = {
            display: 1   //显示状态  1：显示  0：消失
        }
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    handleCancelClick() {
        this.changeState();   //先淡出然后消失
        setTimeout(this.props.cancelClick, 250);
    }

    changeState() {
        this.setState({
            display: this.state.display==0? 1:0
        })
    }

    render() {
        return (
            <div>
                <div style={ this.state.display==1? stMask:stMaskDisappear } ref="maskDiv" onClick={ this.handleCancelClick } > </div>
                <div style={ this.state.display==1? stBtnDiv:stBtnDivDisappear } >
                    <Link to="/walletDetail/modifyPassword"> <div style={stBtn} >修改支付密码</div>  </Link>
                    <Link to="/walletDetail/forgetPassword"> <div style={stBtn} >忘记支付密码</div>  </Link>
                    <div style={stBtn} onClick={ this.props.displayUnbindMask } >解除关联</div>
                    <div style={stBtnCancel} onClick={ this.handleCancelClick } >取消</div>
                </div>
            </div>
        )
    }
}