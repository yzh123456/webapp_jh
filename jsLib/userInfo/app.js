/**
 * Created by hua on 2017/3/3.
 */
import React from "react";
import {render} from "react-dom";
import { Message } from "./message";
import Common from "../common/Common";
new Common();
render(
    <div>
        <Message/>
    </div>,
    document.getElementById("app")

)


