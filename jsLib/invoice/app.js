import React from "react";
import { render } from "react-dom";
import { Loading } from "../common/components/Loading";
import init from "../common/Common";
import { Invoice } from "./invoice";
new init();
render(
		<div>
			<Loading taskCount="1" />
			<Invoice/>
		</div>,
		document.getElementById("invoice")
	);


