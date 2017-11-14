/**
 * Created by WQ on 2016/12/14.
 */
import { Component } from "react";

export class BillItem extends Component {

    render() {
        let billType = this.props.itemData.TXN_DSP.indexOf("消费") > -1 ?"消费":"充值";
        let colorSt = {"color":"#80c02b"};
        if (this.props.itemData.TXN_DSP.indexOf("消费") > -1) {
            colorSt = {"color":"#fe7302"};
        }

        //金额显示只保留一位小数，如果为0则显示0  （返回的金额单位为分）
        let amount = (parseFloat(this.props.itemData.TXN_AMT) / 100).toFixed(2);

/*        amount = amount < 0.1 ? 0 : amount;            // 小于0.1的直接显示0，大于等于0.1保留一位小数
        if (amount != 0) {
            amount = amount.toString();
            amount = amount.substr(0, amount.length - 1);
        }*/

        return (
            <div className="c_billItem" >
                <div className="c_billTitle"><span>{this.props.itemData.MCHNT_DSP}</span>
                    <div className="c_billPay" ref="billPay" style={colorSt}>￥{ amount }</div>
                </div>

                <div className="c_billType"><span>{billType}</span>
                    <div className="c_billTypeStatus">{this.props.itemData.STATUS}</div>
                </div>

                <div className="c_billTime"><span>{ transformTime(this.props.itemData.ACQ_TXN_DATE, this.props.itemData.ACQ_TXN_TIME) }</span></div>
            </div>
        )

    }
}


function transformTime(date, time) {
    return date.substr(0,4) + "/" + date.substr(4,2) + "/" + date.substr(6,2) + "  " + time.substr(0,2) + ":" + time.substr(2,2) + ":" + time.substr(4,2);
}