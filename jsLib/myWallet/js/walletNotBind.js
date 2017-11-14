/**
 * Created by wq on 2017/2/8.
 */
import {Component} from "react";
import {Link} from "react-router";

let stTip = {"width":"100%", "textAlign":"center", "position":"fixed", "top":"1.4rem", "fontSize":"0.44rem", "color":"white"};
let stBtnOuter = {"width":"100%", "textAlign":"center", "position":"fixed", "top":"150px"};
let stBtn = {"width":"3.6rem", "textAlign":"center", "fontSize":"0.34rem", "border":"3px solid #86c336", "margin":"auto", "padding":"0.14rem 0", "borderRadius":"20px", "color":"white", "boxShadow":"inset 0 0 2px #86c336"};

export class WalletNotBind extends Component {

    componentWillUnmount() {
        console.log("WalletNotBind Component unmount");
    }

    render() {
        return (
            <div>
                <p style={stTip} > 亲，您还没有开通钱包 </p>
                <div style={stBtnOuter} >
                    <Link to="/bindJSTCard"> <div style={stBtn} > 去开通 </div> </Link>
                </div>
            </div>
        )
    }
}

