import { Component } from "react";
import {
    Router,//路由组建
    Route,//路由路径组建
    hashHistory,  //监听地址变化 主要监听 hash 变化
    IndexRoute //默认组建
} from "react-router";
import {BookingOrder} from "../bookingList/BookingOrder";
import {AttentionList} from "./attentionList";
import {ForgetPassword} from "../myWallet/js/forgetPassword";
import {AssociateJSTCard} from "../myWallet/js/associateJSTCard";
import {MapDetail} from "../map/mapDetail";
class App extends Component{
    render(){
        return(
            <Router history = { hashHistory }>
                <Route path="/" component={ AttentionList }/>
                <Route path="/bookingorder" component={ BookingOrder }/>
                <Route path="/monthlyorder/forgetPassword" component={ ForgetPassword }/>
                <Route path="/mapdetail" component={ MapDetail }/>
                <Route path="/monthlyorder/bindcar" component={ AssociateJSTCard }/>
            </Router>
        )
    }
}
export { App }
