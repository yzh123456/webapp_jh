/**
 * Created by wq on 2017/2/8.
 */
import {Component} from "react";
import {Link} from "react-router";

let stTip = {"width":"100%", "textAlign":"center", "position":"absolute", "top":"1.4rem", "fontSize":"0.55rem", "color":"white"};
let stOuter = {"width":"100%", "textAlign":"center", "position":"absolute", "top":"2.4rem",  "fontSize":"0.5rem", "color":"white"};
let stEnterImg = {"width":"0.2rem", "marginLeft":"0.16rem", "paddingTop":"0.08rem"};

export class WalletDisplay extends Component {
    constructor() {
        super();
    }

    render() {
        let jstCardNo = this.props.data.attributes.jst_card_no;
        let pathdata = {
            pathname : "/walletDetail",
            query : {
                amount:(parseFloat(this.props.data.attributes.card_balance_vlia/100)).toFixed(2),
                cardbal:(parseFloat(this.props.data.attributes.card_bal/100)).toFixed(2)

            }
        }

        return (
            <div>
                <p style={stTip}> { jstCardNo.substr(0,6) + "  *********" + jstCardNo.substr(15,4) } </p>
                <Link to = {pathdata}>
                    <div style={stOuter} >
                       <span style={ {fontSize:"0.28rem","marginRight":" 0.2rem"} }>¥</span><span> { (parseFloat(this.props.data.attributes.card_balance_vlia/100)).toFixed(2) } </span>
                        <img src="../images/pic_wallet_enter_2x.png" style={stEnterImg}/>
                    </div>
                </Link>
            </div>
        )
    }
}

