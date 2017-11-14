
import { Component,createClass} from "react";
import { QueryCost } from "./invoice";
class QueryTab extends Component{
	constructor(...args) {//构造器
		super(...args);//调用父级的构造器
		//使用 es6 class 去写组件时，对 状态的数据赋值默认值
		let aotu = "";
		if(window.sessionStorage.getItem("liked")!==null){
			if(window.sessionStorage.getItem("liked")==5){
				aotu = 5;
			}else{
				aotu = 1;
			}
		}else{
			 aotu = 5;
		}
		this.state = {// 需要有在 构造器里面对 state 重新赋值
			liked: aotu,
		}
	}
	handleSearchClick1(event){
		this.refs.select1.className="on";
		this.refs.select2.className="";
		this.setState({liked: 5});
		window.sessionStorage.setItem("liked",5);
	}
	handleSearchClick2(event){
		console.log(this);
		this.refs.select2.className="on";
		this.refs.select1.className="";
		this.setState({liked: 1});
		window.sessionStorage.setItem("liked",1);
	}
	render(){
		const props = this.props;
		return(
				<section id="bookinglist">
					<div className='navmenu'>
						<ul id="searchList">
							<li className={this.state.liked==5?"on":""} onClick = {this.handleSearchClick1.bind(this)} ref="select1">已支付</li>
							<li className={this.state.liked==1?"on":""} onClick = {this.handleSearchClick2.bind(this)} ref="select2">未支付</li>
						</ul>
					</div>
					<QueryCost liked = { window.sessionStorage.getItem("liked")!==null?window.sessionStorage.getItem("liked"):this.state.liked } />
			    </section>
		)
	}
}
export { QueryTab };
