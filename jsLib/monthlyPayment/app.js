import React from "react";
import { render } from "react-dom";
import { App } from "./router";
import init from "../common/Common"
new init();
import { Loading } from "../../jsLib/common/components/Loading";
	render(
		<div>
			<Loading taskCount="1" />
			<App/>
		</div>,
		document.getElementById("monthPayment")
	)


