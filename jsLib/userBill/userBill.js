/**
 * Created by WQ on 2016/12/13.
 */
import React, {Component, createClass} from "react";
import {render} from "react-dom";
import {BillHead} from "./js/billHead";
import {SwitchPane} from "./js/switchPane";
import {BillItemList} from "./js/billItemList";
import {BillTypeList} from "./js/billTypeList";
import {Loading} from "../common/components/Loading";
import Common from "../common/Common";
new Common();



render(
    <div id="react">

       <Loading taskCount="2" />

        <BillHead />

        <SwitchPane />

        <BillItemList />

        <BillTypeList />

    </div>,
    document.getElementById("virtual_body")
)
