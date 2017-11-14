import React from "react";
import { render } from "react-dom";
import { App } from "./router";
import { Loading } from "../common/components/Loading";
import init from "../common/Common"
new init();	render(
		<div>
			<Loading taskCount="1" />
			<App/>
		</div>,
		document.getElementById("listCost")
	)


