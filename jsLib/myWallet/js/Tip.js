/**
 * Created by ll on 2016/12/19.
 */
import {Component} from "react";
class Tip extends Component{

    render() {

        let rount = {"textAlign":"center","color":"#fff","backgroundColor":"#000","width":"45%","position": "fixed","top": "60%","left":"25%","height":"0.7rem","lineHeight":"0.7rem","opacity":"0.6","fontSize":"0.26rem","borderRadius":"20px" };
        return(
            <div>
            <p id = "errorTip"  style = {rount} >{this.props.count}</p>
            </div>
        )
    }
};
export { Tip }