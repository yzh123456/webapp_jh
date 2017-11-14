import React from "react";
import { render } from "react-dom";
import { App } from "./router";
// import { Loading } from "../../../common/js/components/Loading";
import init from "../common/Common"
// import { Loading } from "../common/components/Loading";
new init(
	function () {
        render(
			<div>
				<App/>
			</div>,
            document.getElementById("homepage")
        );
    },true
);


