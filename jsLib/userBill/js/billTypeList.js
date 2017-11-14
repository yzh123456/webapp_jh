/**
 * Created by WQ on 2016/12/14.
 */
import { Component } from "react";
import { billTypeStore } from "./store";

let that = "";

export class BillTypeList extends Component {

    constructor() {
        super();
        that = this;
    }

    /*
    *  选择"全部账单"
    */
    chooseBillAll() {
        this.refs.all.style.color = "#80c02b";
        this.refs.recharge.style.color = "black";
        this.refs.consume.style.color = "black";

        //改变store中的billTypeChoice
        billTypeStore.dispatch({
            type:"billtype",
            billTypeChoice:"all"
        });

    }

    /*
     *  选择"充值账单"
     */
    chooseBillRecharge() {
        let Tip = window.sessionStorage.getItem("stateTip");
        if(Tip == 0){

        }
        this.refs.all.style.color = "black";
        this.refs.recharge.style.color = "#80c02b";
        this.refs.consume.style.color = "black";

        //改变store中的billTypeChoice
        billTypeStore.dispatch({
            type:"billtype",
            billTypeChoice:"recharge"
        });

    }

    /*
     *  选择"消费账单"
     */
    chooseBillConsume() {
        this.refs.all.style.color = "black";
        this.refs.recharge.style.color = "black";
        this.refs.consume.style.color = "#80c02b";

        //改变store中的billTypeChoice
        billTypeStore.dispatch({
            type:"billtype",
            billTypeChoice:"consume"
        });

    }

    render() {
        let st = {"display":"none"};
        return (
            <div id="billTypeListDiv"  ref="billListDiv" style={st} >   {/* 如果把该Div的display属性写在CSS里面，则别的组件第一次去获取display属性时为空，写在组件内部则不会 */}
            <ul  className="c_billTypeList" >
                <li id="allBill" className="c_allBill"  	     onClick={this.chooseBillAll.bind(this)}  ref="all" ><span>全部账单</span></li>
                <li id="rechargeBill" className="c_rechargeBill"  onClick={this.chooseBillRecharge.bind(this)}  ref="recharge" ><span>充值账单</span></li>
                <li id="consumeBill" className="c_consumeBill"   onClick={this.chooseBillConsume.bind(this)}  ref="consume" ><span>消费账单</span></li>
            </ul>
            </div>
        )
    }

}

/*
*  显示 账单类型列表组件
 */
export function showBillTypeList() {
    //显示“账单类型列表”
    that.refs.billListDiv.style.display = "inline";
    //显示尖角
    document.getElementById("layerDown").style.display = "inline";
    document.getElementById("layerUp").style.display = "inline";
}

/*
 *  隐藏 账单类型列表组件
 */
export function hideBillTypeList() {
    //隐藏“账单类型列表”
    that.refs.billListDiv.style.display = "none";
    //隐藏尖角
    document.getElementById("layerDown").style.display = "none";
    document.getElementById("layerUp").style.display = "none";
}