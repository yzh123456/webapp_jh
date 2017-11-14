/**
 * Created by wq on 2017/2/9.
 */
import {Component} from "react";
import {WalletInit} from "./walletInit";
import {AssociateJSTCard} from "./associateJSTCard";
import {WalletDetail} from "./walletDetail";
import {ForgetPassword} from "./forgetPassword";
import {ModifyPassword} from "./modifyPassword";
import {Router, Route, hashHistory} from "react-router";


export class MyWalletRouter extends Component {

    render() {
        return (
            <Router history={hashHistory} >
                <Route path="/" component={WalletInit} />
                <Route path="/bindJSTCard" component={AssociateJSTCard}  />
                <Route path="/walletDetail" component={WalletDetail} />
                <Route path="/walletDetail/modifyPassword" component={ModifyPassword} />
                <Route path="/walletDetail/forgetPassword" component={ForgetPassword} />
                <Route path="/walletDetail/UnbindJsCard" component={ModifyPassword}/>
                <Route path="/walletDetail/forget" component={ForgetPassword}/>


            </Router>
        )
    }
}