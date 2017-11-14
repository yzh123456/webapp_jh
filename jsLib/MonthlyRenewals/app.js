/**
 * Created by hua on 2017/2/27.
 */
import React from "react";
import {render} from "react-dom";
import {MonthlyRouter} from "./router";
import Common from "../common/Common";
new Common();
render(
    <div>
        <MonthlyRouter/>
    </div>,
    document.getElementById("app")

)

