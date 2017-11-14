/**
 * Created by wq on 2017/2/13.
 */

import {Component} from "react";
import {PopupMaskLeft} from "./popupMaskLeft";
import {PopupMaskRight} from "./popupMaskRight";
import {PopupMenu} from "./popupMenu";
import {PopupUnbindJSTCard} from "./popupUnbindJSTCard";
import { Loading,operateMask } from "../../common/components/Loading";

let stImgWalletPocket = {width:"90%", height:"63%", margin:"auto", display:"block", padding:"1.1rem 0.1rem",position:"absolute",left:"0.2rem"};
let stOuter = {float:"left", width:"37%", marginTop:"0.3rem"};
let stTxt = {fontSize:"0.32rem", color:"#222222", marginTop:"-0.2rem"};

let stUpper = {position:"absolute", top:"3.8rem", width:"100%",  textAlign:"center"};
let stAmount = {fontSize:"0.72rem", color:"#ff6e0e", marginTop:"0.3rem"};
let stSplit = {borderRight:"1px dotted #959595", float:"left", width:"50%"};
let stTxtOnline = {padding:"0.1rem 0rem 0.16rem 1rem", fontSize:"0.26rem", color:"#959595"};
let stTxtOnlineAmount = {fontSize:"16px", color:"#222222", paddingLeft:"1rem"};
let stTxtCard = {padding:"0.1rem 0rem 0.16rem 0.4rem", fontSize:"0.26rem", color:"#959595"};
let stTxtCardAmount = {fontSize:"0.32rem", color:"#222222", paddingLeft:"0.8rem"};


export class WalletDetail extends Component {
    constructor() {
        super();

        this.state = {
          clickState: 0   /*钱包详情页面点击状态: 0:未点击   1:点击了线上余额  2:点击了卡上余额  3:点击了卡管理 */
        };
        this.handleUnbindClick = this.handleUnbindClick.bind(this);
        this.cancleClick = this.cancleClick.bind(this);
        this.handleBillClick = this.handleBillClick.bind(this);
        this.handleRechargeClick = this.handleRechargeClick.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleOnlineBalanceClick = this.handleOnlineBalanceClick.bind(this);
        this.handleCardBalanceClick = this.handleCardBalanceClick.bind(this);
        this.displayUnbindMask = this.displayUnbindMask.bind(this);
    }

    componentWillUnmount() {
    }
    componentDidMount(){
        operateMask("hide")
    }
    /*
    * 改变组件状态（弹出菜单中点击 “解绑”）
    **/
    handleUnbindClick() {
        this.setState({
            clickState:4
        })
    }

    /*
     * 卸载弹出层
     **/
    cancleClick() {
        this.setState({
            clickState:0
        })
    }

    /*
     * 展示线上余额弹出层
     * */
    handleOnlineBalanceClick() {
        this.setState({
            clickState:1
        })
    }

    /*
     * 展示卡上余额弹出层
     * */
    handleCardBalanceClick() {
        this.setState({
            clickState:2
        })
    }

    /*
     * 展示卡管理菜单弹出层
     * */
    handleCardClick() {
        this.setState({
            clickState:3
        })
    }

    /*
     * 展示解绑弹出层
     * */
    displayUnbindMask() {
        this.setState({
            clickState:4
        })
    }

    /*
     * 页面跳转
     * */
    handleBillClick() {
        let userId =  USERINFO.USER.USER_ID;
        let carno =  window.sessionStorage.getItem("key");
        location.href = "../../../src/userBill/userBill.html?USER_ID="+userId+"&APP_TYPE=WX_JTC&carno="+carno;
    }
    handleRechargeClick() {
       let carno =  window.sessionStorage.getItem("key");
       location.href = "http://jstnetpay.jieshunpay.cn:50012/jstnetpay/wap/getWAPRequest.do?cardNo="+carno;
    }

    render() {

        let rows = [];

        if(this.state.clickState == 1) {
            rows.push( <PopupMaskLeft key="1" cancelClick={ this.cancleClick } /> );   //点击 “线上余额”
        } else if (this.state.clickState == 2) {
            rows.push( <PopupMaskRight key="2" cancelClick={ this.cancleClick } /> );  //点击“卡上余额”
        } else if (this.state.clickState == 3) {
            rows.push( <PopupMenu key="3" cancelClick={ this.cancleClick } displayUnbindMask={ this.displayUnbindMask } /> );        //点击 “卡管理”
        } else if (this.state.clickState == 4) {
            rows.push( <PopupUnbindJSTCard key="4" cancelClick={ this.cancleClick } /> );            //点击弹出菜单中的“解绑”按钮
        } else {
            rows = [];                                                                      //无点击或取消点击
        }

        return (
            <div>
                <div>
                    <Loading taskCount = "1"/>

                </div>
                {/*底层*/}
                <div style={{textAlign:"center"}} >
                    <img src="../images/pic_wallet_pocket.png" style={stImgWalletPocket} />

                    <div style={{ backgroundColor:"white", height:"2rem",position: "absolute",left:"0",bottom:"0",width:"100%"}} >
                        <div style={stOuter} >
                            <div onTouchStart={ this.handleRechargeClick } >
                                <img src="../images/pic_wallet_recharge_2x.png" style={{width:"0.72rem"}} />
                                <p style={ stTxt } >充值</p>
                            </div>
                        </div>
                        <div style={ {float:"left", width:"25%", marginTop:"0.3rem"} } >
                            <div onTouchStart={ this.handleBillClick } >
                                <img src="../images/pic_wallet_bill_2x.png" style={{width:"0.72rem"}} />
                                <p style={stTxt} >我的账单</p>
                            </div>
                        </div>
                        <div style={stOuter}>
                            <div onClick={ this.handleCardClick } >
                                <img src="../images/pic_card_manage_2x.png" style={{width:"0.72rem"}} />
                                <p style={stTxt} >卡管理</p>
                            </div>
                        </div>
                        <div style={ {clear:"both"} }> </div>
                    </div>
                </div>

               {/*上层*/}
                <div style={stUpper} >
                    <p style={{fontSize:"0.26rem", color:"#959595"}}>账户总额 (元)</p>
                    <p style={stAmount} > {this.props.location.query.amount} </p>

                    <div style={{ marginTop:"1.1rem" }}>
                        <div style={stSplit} onTouchStart={ this.handleOnlineBalanceClick } >
                            <p style={stTxtOnline} > 线上余额 (元) </p>
                            <p style={stTxtOnlineAmount} > {this.props.location.query.amount} </p>
                        </div>
                        <div style={ {float:"left", textAlign:"left"} } onTouchStart={ this.handleCardBalanceClick } >
                            <p style={stTxtCard} > 卡上余额 (元) </p>
                            <p style={stTxtCardAmount} > {this.props.location.query.cardbal} </p>
                        </div>
                    </div>
                    <div style={{position:"absolute", top:"0.8rem", left:"1.2rem", zIndex:"-1" }}>
                        <img src="../images/pic_balance_2x.png" style={{width:"0.2rem", verticalAlign:"top", marginLeft:"0.1rem",marginTop:"1.8rem"}} />
                        <img src="../images/pic_balance_2x.png" style={{width:"0.2rem",  verticalAlign:"top", marginLeft:"2.4rem",marginTop:"1.8rem"} } />
                    </div>
                </div>

                {/*弹出层*/}
                {rows}
            </div>

        )
    }
}

