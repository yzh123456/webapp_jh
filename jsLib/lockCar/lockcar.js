import {Component} from "react";
import {AppBridge} from "../common/util/AppBridge";
import {operateMask} from "../common/components/Loading";
import JHTAJAX from "../common/util/JHTAjax";
let user_id;
var datalist;
var flag = true;
class LockCar extends Component{

	constructor(...args){

		super(...args);//调用父级的构造器
		this.stateObj = {
			items: []

		};
		this.state = this.stateObj;


	}
	componentWillMount(){
		this.getData();
	}
	getData(){
		AppBridge.baseData(function(data) {
			user_id = data.USER.USER_ID ;

			//alert(user_id+"***")
			var obj = {
				serviceId:"ac.lock.query",
				attributes:{
					//  unionid :"USER_ID:"+ BASEDATA.USER.USER_ID
					USER_ID:user_id
					//unionid:"USER_ID:3f4cef3995e448d2816b5726db46280e"
				}
			}


			JHTAJAX({
				//url:XMPPSERVER,

				//  url : 'http://jhtestcms.jslife.net/jspsn/XmppServer.servlet ',
				cache : false,
				data: {
					//云服务 serviced
					serviceId:obj.serviceId,
					attributes:JSON.stringify(obj.attributes)
				},

				//async:true,
				dataType : 'json',
				type:'post',

				success : function(data) {

					datalist = data;

					operateMask("hide");
					console.log("ajax success");

					if(data.resultcode == 0 && data.dataitems != null
						&& data.dataitems.length > 0){


						this.stateObj.items = data.dataitems;
						this.setState(this.stateObj);

					}


				}.bind(this),
			});

		}.bind(this));
	}


	render(){

		let errorstyle = {"color":"#b2b2b2","width":"100%","position":"fixed","top":"33%"};
		let nostyle = {"textAlign":"center","margin":"15px 15px 0px","fontSize":"0.3rem","fontFamily":"OfficialScript"}
		if(this.stateObj.items.length > 0){
			flag = true;
		}else{
			flag = false;
		}

		return(
			<div>

				<section id = "LockRecord" >

					{
						flag==true?(<div ref = "success" id = "success" className = "success" >
							<div className = "line" ref  ="line"></div>

							{

								this.stateObj.items.map((item,i)=>{
									//字符串处理
									let booktime = item.attributes.lock_time;

									let lock_time = booktime.substring(0,booktime.length-3).replace(/\-/g,"/");

									let overduetime = item.attributes.unlock_time;

									let unlock_time = overduetime.substring(0,overduetime.length-3).replace(/\-/g,"/");

									if( item.attributes.status == "2"){

										return(
											<article className = "lock_out" key = {`article-${i}`}>
												<div className = "lock_record_lock-out">
												</div>
												<div className = "detail">
													<h2>
														<span>{item.attributes.park_name}</span>


														<span>已解锁</span>
													</h2>
													<p className = "out">

							<span className = "parkAddress">

								{item.attributes.carno}
							</span>
													</p>
													<p className = "lockTime">
														<span></span>
							<span>
					{lock_time}
							</span>
														<span></span>
							<span>
					{unlock_time}
					</span>
													</p>

												</div>

												<div className = "clear"></div>
											</article>
										)
									}

									if(item.attributes.status == "1"){
										return(

											<article className = "lock_in" key = {`article-${i}`}>
												<div className = "lock_record_lock-in">
												</div>
												<div className = "detail">
													<h2>
														<span>{item.attributes.park_name}</span>
														<span>已锁定</span>
													</h2>
													<p className = "out">
														<span></span>
							<span className = "parkAddress">
								{item.attributes.carno}
							</span>
													</p>
													<p className = "lockTime">
														<span></span>
														<span>{lock_time}</span>


													</p>

												</div>

												<div className = "clear"></div>
											</article>
										)

									}


									if(item.attributes.status == "4"){

										return(
											<article className = "lock_unlock" key = {`article-${i}`}>
												<div className = "lock_record_people_unlock">
												</div>
												<div className = "detail">
													<h2>
														<span>{item.attributes.park_name}</span>
														<span>岗亭解锁</span>
													</h2>
													<p className = "out">
														<span></span>
							<span className = "parkAddress">
								{item.attributes.carno}
							</span>
													</p>
													<p className = "lockTime">
														<span></span>
							<span>
							{lock_time}
							</span>
													</p>

												</div>
												<div className = "clear"></div>
												<div className = "border"></div>
												{


													item.subitems.map((item,i)=>{

														//字符串处理
														let booktime = item.attributes.out_time;

														let out_time = booktime.substring(0,booktime.length-3).replace(/\-/g,"/");



														return(
															<ul key = {`ul-${i}`}>


																<li>
																	<span></span>
																	<span>{item.attributes.out_device}</span>

																</li>
																<li>
																	<span></span>
																	{out_time}
																</li>
																<li>
																	<span></span>
																	{item.attributes.out_operator}

																</li>
																<div className = "clear"></div>
															</ul>

														)

													})
												}


											</article>

										)
									}

									if(item.attributes.status == "5"){
										return(
											<article className = "lock_goout" key = {`article-${i}`}>
												<div className = "lock_record_unlock_goout">
												</div>
												<div className = "detail">

													<h2>
														<span>{item.attributes.park_name}</span>
														<span>未解锁出场</span>
													</h2>
													<p className = "out">
														<span></span>
							<span className = "parkAddress">
								{item.attributes.carno}
							</span>
													</p>
													<p className = "lockTime">
														<span></span>
							<span>
							{lock_time}
							</span>
													</p>

												</div>
												<div className = "clear"></div>
												<div className = "border"></div>
												{


													item.subitems.map((item,i)=>{
														//字符串处理
														let booktime = item.attributes.out_time;

														let out_time = booktime.substring(0,booktime.length-3).replace(/\-/g,"/");


														return(
															<ul key = {`ul-${i}`}>


																<li>
																	<span></span>
																	<span>{item.attributes.out_device}</span>



																</li>
																<li>
																	<span></span>
																	{out_time}
																</li>
																<li>
																	<span></span>
																	{item.attributes.out_operator}

																</li>
																<div className = "clear"></div>
															</ul>

														)

													})
												}

											</article>
										)

									}

								})


							}
						</div>):(<div className = "error" ref = "error" style = { errorstyle }>
							<p className = "hasNo"></p>
							<p className = "no" style = { nostyle }>亲，还没有防盗历史哦！</p>
						</div>)
					}

				</section>
			</div>


		)
	}
}

export { LockCar }
