import React from "react";
import {render} from "react-dom";
import {LockCar} from "./lockcar";
import {Loading} from "../common/components/Loading";
import Common from "../common/Common";
new Common();
render(
	<div>

		<Loading taskCount="1"/>

		<LockCar/>
	</div>,
	document.getElementById("wrap")
	
)