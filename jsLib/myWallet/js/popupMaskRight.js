/**
 * Created by wq on 2017/2/13.
 */
import {Component} from "react";

let stMask = {position:"fixed", width:"100%", height:"100%", backgroundColor:"black", zIndex:"2", left:"0px", top:"0px", opacity:"0.4"};
let stImg = {position:"fixed", width:"4rem", left:"1.4rem", top:"6.12rem", zIndex:"10"};

export class PopupMaskRight extends Component {

    render() {
        return (
            <div>
                <div id="onlineBalance" style={stMask} onTouchStart={ this.props.cancelClick } > </div>
                <img src="../images/pic_card_balance_2x.png" style={stImg} />
            </div>
        )
    }
}