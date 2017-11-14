import {Component} from "react";
import {CouponlistCategory} from "./couponList";
import {CouponDetail} from "./couponDetail";
import {Router, Route, hashHistory} from "react-router";
/*
 	设置的自路由，触发的时候是触发的父路由的组件，
 	父路由通过 props.children 获取子路由的组件，
 	通过 children 来显示子路由的界面
 * */
class CouponList extends Component{
	render(){
		// history 是设置 Router s组件的值，hashHistory 是处理路由的函数
		// Route 是定义一组路由，当路由匹配后展示设置的 component 组件
		return (
            <Router history = { hashHistory }>
				<Route path="/" component={ CouponlistCategory } />
				<Route path="/detail" component={ CouponDetail } />
            </Router>
		);
	}
}
export { CouponList };

