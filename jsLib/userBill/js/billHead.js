/**
 * Created by WQ on 2016/12/13.
 */
import {Component} from "react";
import {billTypeStore} from "./store";
import {showBillTypeList, hideBillTypeList} from "./billTypeList";
import {AppBridge} from "../../common/util/AppBridge";
import jht from "../../common/util/JHT";
let JHT = new jht();
let stTriangleImg = {"padding":"0 0 0.015rem 0.07rem", "width":"0.16rem"};
let that = "";

export class BillHead extends Component {
    constructor() {
        super();
        that = this;
        this.state = {
            carno:""
        }
        if(JHT.working() == "APP"){
            document.title = "我的账单";

        }else {
            document.title = "我的钱包";
        }
        //订阅账单类型列表选择状态（billTypeState）
        billTypeStore.subscribe(()=>{
            switch (billTypeStore.getState()){
                case("all"):
                    this.refs.billType.innerText = "全部账单";
                    break;
                case("recharge"): 
                    this.refs.billType.innerText = "充值账单";
                    break;
                case("consume"):
                    this.refs.billType.innerText = "消费账单";
                    break;
                default:
                    this.refs.billType.innerText = "全部账单";
            }

        });
    }

    showBillType(){
        let display = document.getElementById("billTypeListDiv").style.display;

        if(display == "none") {         //显示“账单类型列表”
            showBillTypeList();
            this.refs.showOrHideImg.src = "./images/pic_billtype_fold.png";
        } else {                        //隐藏“账单类型列表”
            hideBillTypeList();
            this.refs.showOrHideImg.src = "./images/pic_billtype_unfold.png";
        }
    }

    /*
    *  向APP发起返回请求
     */
    goBackClick() {
        //
       if(JHT.working() == "APP"){
           AppBridge.closeView();

       }else{
           window.history.back();
       }


    }

    render() {


       // alert(car)
        console.log(this.state.carno)
        return (
            <div className="headDiv" >
                <ul>
                    <li className="headLeft" >
                        <div className="headLeftDiv"  >
                            <img className="goBackImg"  src="./images/pic_go_back.png" onClick={this.goBackClick.bind(this)} />
                        </div>
                    </li>
                    <li className="headMiddle" >
                        <div className="headMiddleDiv">
                            <p>我的账单</p>
                            <p id="jstAccount" className="jstAccount">{ this.state.carno  }</p>
                        </div>
                    </li>
                    <li className="headRight" >
                        <div className="headRightDiv" onClick={this.showBillType.bind(this)}  >
                            <span ref="billType" >全部账单</span>
                            <img ref="showOrHideImg"  id="showOrHideImg"  style={stTriangleImg} src="./images/pic_billtype_unfold.png"  />
                        </div>
                    </li>
                </ul>

            </div>
        )
    }

}

/*
* 隐藏账单类型列表组件和改变向上向下图标
 */
export function hideBillListChangeImg() {
    hideBillTypeList();
    that.refs.showOrHideImg.src = "./images/pic_billtype_unfold.png";
}