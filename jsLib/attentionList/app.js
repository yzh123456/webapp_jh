import React from "react";
import {render} from "react-dom";
import { App } from "./router";
import Common from "../common/Common";
//new Common();
new Common(()=>{
    render(

		<div>
			<App/>

		</div>,
        document.getElementById("wrap")

    );
},true);





