import { Component } from "react";
import {
	Router,//路由组建
	Route,//路由路径组建
	hashHistory,  //监听地址变化 主要监听 hash 变化
	IndexRoute //默认组建
} from "react-router";
import { BookingTab } from "./bookinglist";
import { ProLong } from "./prolong";
import {ForgetPassword} from "../../jsLib/myWallet/js/forgetPassword";
import {AssociateJSTCard} from "../../jsLib/myWallet/js/associateJSTCard";
class App extends Component{
	render(){
		return(
			<Router history = { hashHistory }>
				<Route path="/" component={ BookingTab }/>
				<Route path="/prolong" component={ ProLong }/>
				<Route path="/monthlyorder/bindcar" component={AssociateJSTCard}/>
				<Route path="/monthlyorder/forgetPassword" component={ForgetPassword}/>
		</Router>
		)
	}
}
export { App }
