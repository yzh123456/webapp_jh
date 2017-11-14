
import { Component,createClass} from "react";
import { MonthPaymentList } from "./monthPaymentList";
class QueryTab extends Component{
	constructor(...args) {//构造器
		super(...args);//调用父级的构造器
		//使用 es6 class 去写组件时，对 状态的数据赋值默认值

		this.state = {// 需要有在 构造器里面对 state 重新赋值
			liked: true
		}
	}
	render(){
		const props = this.props;
		return(
				<section id="bookinglist">
					<MonthPaymentList liked = {this.state.liked } />
			    </section>
		)
	}
}
export { QueryTab };
