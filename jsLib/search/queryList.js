
import { Component,createClass} from "react";
import { Search } from "./search";
class QueryTab extends Component{
	constructor(...args) {//构造器
		super(...args);//调用父级的构造器
		//使用 es6 class 去写组件时，对 状态的数据赋值默认值
		this.state = {// 需要有在 构造器里面对 state 重新赋值
            checked: true,
			param:""
		}
	}
    qwer() {
        this.setState({
            param: "",
            checked: !this.state.checked
        });
	}
    handel(key){
        this.setState({
            param: key,
            checked: !this.state.checked
        });
	}
	render(){
   let before = "粤-B12345";
   let aa = this.state.param;
   console.info(aa);
		return(
			<section id="bookinglist">
				<input className="qwer"  ref="input" onClick={this.qwer.bind(this)}/>
				<Search message="停车场" copemlt={this.state.checked} handel = { this.handel.bind(this)}/>
			</section>
		)
	}
}
export { QueryTab };
