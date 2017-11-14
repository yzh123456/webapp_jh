/**
 * Created by WQ on 2016/12/14.
 */
import { Component } from "react";
import { switchPaneStore, billTypeStore } from "./store";
let itemstate = 0;
export class SwitchPane extends Component {
    constructor() {
        super();


        //订阅账单类型列表选择状态（billTypeState）
/*        billTypeStore.subscribe(()=>{
            //点击账单类型列表项选择后，切换面板默认显示左边（近半个月账单）。本组件负责改变本组件的UI，账单列表组件负责更新自己的列表内容。
            this.refs.switchPaneRecent.style.color = "#80c02b";
            this.refs.switchPaneRecent.style.borderBottom = "2px solid #9adb43";
            this.refs.switchPaneBefore.style.color = "black";
            this.refs.switchPaneBefore.style.borderBottom = "0";
        });*/
    }

    switchPaneClick(event) {
        //如果“账单类型列表”处于显示状态，则不允许切换
        if(document.getElementById("billTypeListDiv").style.display == "inline")
            return;

        //改变自己的UI
        let sourceId = event.target.id;
        if(sourceId == "switchPaneRecent") {
           /* this.setState({
                itemstate:0
            })*/
            itemstate = 0;
            window.sessionStorage.setItem("stateTip",itemstate)
            this.refs.switchPaneRecent.style.color = "#80c02b";
            this.refs.switchPaneRecent.style.borderBottom = "0.05rem solid #9adb43";
            this.refs.switchPaneBefore.style.color = "#666666";
            this.refs.switchPaneBefore.style.borderBottom = "0";
            //改变store中的switchState
            switchPaneStore.dispatch({
                type:"switch",               //调用store的dispatch必须传type参数，type的值可以自定义
                switchChoice:"left"
            });

        } else {
            

           itemstate = 1;
           window.sessionStorage.setItem("stateTip",itemstate);
            this.refs.switchPaneRecent.style.color = "#666666";
            this.refs.switchPaneRecent.style.borderBottom = "0";
            this.refs.switchPaneBefore.style.color = "#80c02b";
            this.refs.switchPaneBefore.style.borderBottom = "0.05rem solid #9adb43";
            //改变store中的switchState
            switchPaneStore.dispatch({
                type:"switch",
                switchChoice:"right"
            });
        }
    }

    render() {
        return(
            <div className="c_switchPane">
                <div id="switchPaneRecent" onClick = {this.switchPaneClick.bind(this)} ref="switchPaneRecent" >近半个月账单</div>
                <div id="switchPaneBefore" onClick = {this.switchPaneClick.bind(this)} ref="switchPaneBefore" >半个月前账单</div>
            </div>
        )
    }

}