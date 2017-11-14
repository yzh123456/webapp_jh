/**
 * Created by WQ on 2016/12/22.
 */
import { Component } from "react";

let st = {"height": "1.6rem", "backgroundColor": "#F0EFF5"};    //用来填充listBox(DIV)的billItem，billItem的高度也为1.6rem左右

export class Blank extends Component {

    render() {
        return (
            <div style={st}> </div>
        )
    }
}
