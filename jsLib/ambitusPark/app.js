import React from "react";
import { render } from "react-dom";
import { App } from "./router";
import init from "../common/Common"
new init(
	function () {
        render(
			<div>
				<App/>
			</div>,
            document.getElementById("ambitusPark")
        );
    },true
);



