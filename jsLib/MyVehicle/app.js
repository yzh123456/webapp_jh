/**
 * Created by hua on 2017/2/27.
 */
import React from "react";
import {render} from "react-dom";
import {MyVehicle} from "./MyVehicle";
import Common from "../common/Common";
new Common(
    function () {
        render(
            <div>
                <MyVehicle/>
            </div>,
            document.getElementById("app")

        )
    },true
);

