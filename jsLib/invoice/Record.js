/**
 * Created by yqx on 2017/5/5.
 */
import { Component} from "react";
import  MyToast  from "../common/components/MyToast";
class Record extends Component{
    constructor(){
        super();
        this.myToast = new MyToast();
    }
    showName(){  //显示车场名字
        if(this.refs.parkName && this.refs.parkName != '' &&
            this.refs.parkName.innerText && this.refs.parkName.innerText != ""){
            this.myToast.setToast(this.refs.parkName.innerText);
        }
    }
    render(){
        let dataServiceList = this.props.dataServiceList;
        let tmp = dataServiceList.attributes;
        let orderType = "";
        let orderTypeBg = "park_fee";
        //金额显示只保留一位小数，如果为0则显示0  （返回的金额单位为分）
        let ds = (parseFloat( tmp.amount || tmp.actualfee ||  0.00)).toFixed(2);
        ds = ds < 0.01 ? 0 : ds;            // 小于0.1的直接显示0，大于等于0.1保留一位小数
        if (ds != 0) {
            ds = ds.toString();
            if(ds.indexOf(".00")>-1){
                ds = ds.substr(0, ds.length - 3);
            }else if (ds.substr(ds.length - 1,ds.length)=="0"){
                ds = ds.substr(0, ds.length - 1);
            }else{
                ds = ds.substr(0, ds.length);
            }
        }
        let accessem = <div id="bill" ref="bill">
            <div  className="sublist">
                <div className={orderTypeBg} ref = "parkFee">
                    {orderType}
                </div>
                <div className="smiddle">
                    <p className="font1" onClick={this.showName.bind(this)}>
                        <span id="parkName" ref="parkName">{tmp.parkname || tmp.park_name}</span>
                    </p>
                    <p className="font3" id="carNo">增值税电子普通发票</p>
                </div>
                <div className="sright1">
                    <p className="font1">
                        <span id="price">{`￥ ${ ds }` }</span>
                    </p>
                </div>
                <div className="orderNo">
                    <span>开票日期:</span>
                    <span id="orderNo"> { ((tmp.invoice_time || tmp.invoice_time)+"").substring(0,10)}</span>
                </div>
            </div>
        </div>;
        return accessem
    }
}
export { Record };