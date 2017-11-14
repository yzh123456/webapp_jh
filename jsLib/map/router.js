import { Component } from "react";
import {
	Router,//路由组建
	Route,//路由路径组建
	hashHistory,  //监听地址变化 主要监听 hash 变化
	IndexRoute //默认组建
} from "react-router";
import { MapSearchList } from "./mapMain";
import {MapDetail} from "./mapDetail";
import {Search} from "../common/components/search";
import {BookingOrder} from "../bookingList/bookingorder";
import {SearchResult} from "./searchDetail";
import {AssociateJSTCard} from "../myWallet/js/associateJSTCard";
import {ForgetPassword} from "../myWallet/js/forgetPassword";

// import { Home , About , Index , Test} from "./page";
/*
 	设置的自路由，触发的时候是触发的父路由的组件，
 	父路由通过 props.children 获取子路由的组件，
 	通过 children 来显示子路由的界面
 * */
class App extends Component{
	render(){
		// history 是设置 Router s组件的值，hashHistory 是处理路由的函数
		// Route 是定义一组路由，当路由匹配后展示设置的 component 组件
		return (
			<Router history = { hashHistory }>
				<Route path="/" component={ MapSearchList }/>
				<Route path="/search" component={ Search }/>
				<Route path="/" component={ MapDetail }/>
				<Route path="/mapDetail" component={ MapDetail }/>
				<Route path="/search/searchDetail" component={ SearchResult }/>
				<Route path="/search/searchDetail/mapMain" component={ MapSearchList }/>
				<Route path="/search/searchDetail/mapDetail" component={ MapDetail }/>
				<Route path="/search/mapMain" component={ MapSearchList }/>
				<Route path="/bookingorder" component={ BookingOrder }/>
				<Route path="/monthlyorder/forgetPassword" component={ ForgetPassword }/>
				<Route path="/bookingorder/bindcar" component={ AssociateJSTCard }/>
			</Router>
		)
	}
}
export { App };

