/**
 * Created by wq on 2017/2/14.
 */

import {Component} from "react";
import {Link} from "react-router";

let stMask = { position:"fixed", width:"100%", height:"100%", backgroundColor:"black", zIndex:"2", left:"0px", top:"0px", opacity:"0.26"};
let stWrapper = { position:"fixed", width:"74%", left:"13%", top:"140px",  zIndex:"3"};
let stTxtTip = { display:"block", padding:"16% 10% 0 10%", fontSize:"15px", textAlign:"center" };
let stBtnDiv = { width:"100%", borderTop:"1px solid #80c02b", backgroundColor:"white", borderBottomLeftRadius:"10px", borderBottomRightRadius:"10px"};
let stBtnLeft = { lineHeight:"0.8rem", width:"50%", float:"left", fontSize:"0.34rem",  borderRight:"1px solid #80c02b", textAlign:"center"};
let stBtnRight = { lineHeight:"0.8rem", width:"49%", float:"left", fontSize:"0.34rem", textAlign:"center", color:"#80c02b"};


export class PopupUnbindJSTCard extends Component {
    constructor() {
        super();
        this.handleSureClick = this.handleSureClick.bind(this);
    }

    /*
    * 点击确定解绑触发事件
    * */
    handleSureClick() {
        console.log("确定解绑");
        this.props.cancelClick();
       // window.sessionStorage.setItem("resultcode",data.resultcode)
       // location.href = "http://localhost:8989/jspsn/src/myWallet/myWallet.html#/walletDetail/modifyPassword";

    }
  
    render() {
        return (
            <div>
                <div style={ stMask }> </div>
                <div style={stWrapper} >
                    <img src="../images/pic_unbind_bowknot_2x.png" style={ {position:"absolute", width:"80px", left:"-20px", top:"-20px"} } />
                    <img src="../images/pic_unbind_jstcard_2x.png" style={ {width:"100%",display:"block"} } />
                    <div style={ {width:"100%", height:"120px", backgroundColor:"white"} } >
                        <div style={stTxtTip} >卡片解绑后您将无法随时管理您的卡片，也无法享受线上用卡优惠。</div>
                    </div>
                    <div style={stBtnDiv} >
                        <div style={stBtnLeft}  onTouchStart={ this.props.cancelClick }>再想想</div>
                        <Link to="/walletDetail/UnbindJsCard"> <div style={stBtnRight}  onClick={ this.handleSureClick }>是的</div></Link>
                        <div style={ {clear:"both"} } ></div>
                    </div>
                </div>

            </div>
        )
    }
}