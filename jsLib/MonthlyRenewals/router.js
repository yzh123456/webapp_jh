/**
 * Created by hua on 2017/2/28.
 */
import {Component} from "react";
import {Router, Route, hashHistory} from "react-router";
import {Monthly} from "./Monthly";
import {AddCar} from "./addCar";
import {MonthlyOrder} from "./Monthlyorder";
import {AssociateJSTCard} from "../myWallet/js/associateJSTCard";
import {ForgetPassword} from "../myWallet/js/forgetPassword";
export class MonthlyRouter extends Component {
    render(){
        return(
            <Router history={hashHistory}>
                <Route path="/" component={Monthly}/>
                <Route path="/addcar" component={AddCar}/>
                <Route path="/monthlyorder" component={MonthlyOrder}/>
                <Route path="/monthlyorder/bindcar" component={AssociateJSTCard}/>
                <Route path="/monthlyorder/forgetPassword" component={ForgetPassword}/>
                
            </Router>
        )
    }
}
