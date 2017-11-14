import { Component ,Children } from "react";
import { BoookingContent } from "./bookingcontent";
class BookingTab extends Component{
	//点击切换
	
	constructor(...args){
		super(...args);//调用父级的构造

		let monthbegin = new Date().getFullYear() + "-" + (new Date().getMonth()+1)+ "-" +"1"+" "+"00"+":"+"00"+":"+"00";
		let year = new Date().getFullYear();
		let month = new Date().getMonth()+1;
		let date;
		if(month == 4 || month == 6 || month == 9 || month == 11){
			date = 30;
		}else if(month == 2 ){
			if((year%4==0) && (year%100!=0||year%400==0)){
				date = 29;
			}else{
				date = 28;
			}
		}else{
			date = 31;
		}
		let monthend = new Date().getFullYear() + "-" + (new Date().getMonth()+1)+ "-" +date+" "+"23"+":"+"59"+":"+"59";

		this.state = {// 需要有在 构造器里面对 state 重新赋值
			liked: 2,
			endTime:monthend,
			beginTime:monthbegin
		}
	}
	//近月内
	ShowParkMonthList(e){

		let  monthbegin= new Date().getFullYear() + "-" + (new Date().getMonth()+1)+ "-" +"1"+" "+"00"+":"+"00"+":"+"00";
		let year = new Date().getFullYear();
		let month = new Date().getMonth()+1;
		let date;
		if(month == 4 || month == 6 || month == 9 || month == 11){
			date = 30;
		}else if(month == 2 ){
			if((year%4==0) && (year%100!=0||year%400==0)){
				date = 29;
			}else{
				date = 28;
			}
		}else{
			date = 31;
		}
		let monthend = new Date().getFullYear() + "-" + (new Date().getMonth()+1)+ "-" +date+" "+"23"+":"+"59"+":"+"59";

		this.setState({
			liked: 2,
			endTime:monthend,
			beginTime:monthbegin
		});


	}
	//全部
	ShowParkAllList(e){
	
	let allend = "9999-07-01 00:00:00";
	let	allbegin = "1970-07-01 00:00:00";
		this.setState({
			liked: 1,
			endTime:allend,
			beginTime:allbegin
		});

	}
	
	
	render(){
		
		let pStyle = {
		"color":"#666"
		}
		let liStyle = {
			
		"display":"none"
		}
	
	
		return(
			
				<section id="bookinglist">
					<article className="fp_sort">
						<ul>
							<li className={this.state.liked==2?"selected":""} onClick={this.ShowParkMonthList.bind(this)} ref = "month">近月内</li>
							<li className={this.state.liked==1?"selected":""} onClick={this.ShowParkAllList.bind(this)} ref = "all">全部</li>
							
						</ul>
					</article>
					
					<BoookingContent liked = {this.state.liked } endTime = { this.state.endTime}  beginTime = { this.state.beginTime}/>
			</section>
		

		)
	}
}


export { BookingTab };
