/**
 * Created by WQ on 2016/12/22.
 */
import { Component } from "react";

let st = {"width":"100%","textAlign":"center", "position":"fixed", "top":"33%"};
let stTipText = {"color":"#ADADAD", "fontFamily": "OfficialScript", "fontSize":"0.3rem"};

export class Tip extends Component {

    render() {
        return (
            <div style={st}>
                <img src="./images/hasNo.png" />
                 <p style={stTipText} >亲，没有查询到您的账单记录哦!</p>
            </div>
        )
    }
}
