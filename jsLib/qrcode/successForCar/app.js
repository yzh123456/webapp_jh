import React from "react";
import { render } from "react-dom";
import { Success } from "./successForCar";
import init from "../../common/Common"
new init();
	render(
		<div>
			<Success/>
		</div>,
		document.getElementById("successForCar")
	);


