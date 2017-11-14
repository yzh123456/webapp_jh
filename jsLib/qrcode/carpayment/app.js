/**
 * Created by hua on 2017/4/10.
 */
import React from "react";
import { render} from "react-dom";
import { App} from "./router";
import Common from "../../common/Common";
let op = (window.location.href.indexOf("key=") > -1 ) ? false : true;
new Common(()=>{
    render(
        <div>
            <App/>

        </div>,
        document.getElementById("wrap")

    )
},op);