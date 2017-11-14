/**
 * Created by wq on 2017/2/8.
 */
import React from "react";
import {render} from "react-dom";
import {MyWalletRouter} from "./js/mywalletRouter";
import Common from "../common/Common";
new Common();

render(
   <MyWalletRouter />,
    document.getElementById("container")
)
