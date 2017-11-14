/**
 * Created by Administrator on 2017/2/16.
 */
import {Component} from "react";

let stOuter = {zIndex:"10000",width:"100%", position:"fixed", bottom:"47%", textAlign:"center", opacity:"1"};
let stTipTxt = {padding:"6px 5px", backgroundColor:"black", display:"inline-block", opacity:"0.8", color:"white", borderRadius:"5px", fontSize:"15px"};

export class PopupTip extends Component {

    componentDidMount() {
        setTimeout(this.props.cancelPopupTip, 3000);
    }

    render() {
        return (
            <div style={stOuter} id = "addtip" className=" ">
                <span style={stTipTxt} > {this.props.txt }  </span>
            </div>
        )
    }

}