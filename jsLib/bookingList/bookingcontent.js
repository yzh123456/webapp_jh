import { Component } from "react";
import { Link } from 'react-router';
import { Loading,operateMask } from "../common/components/Loading";
import {PullDownRefresh} from "../common/JhtScroll/PullDownRefresh";
import {PullUpLoadMore,showNoMoreData} from "../common/JhtScroll/PullUpLoadMore";
import jhtAjax from "../common/util/JHTAjax";
import { Nothing } from "../common/components/Nothing";
import {PopupTip}  from "../myWallet/js/popupTip";
import Translate  from "../common/util/Translate";
import ThirdSDK from "../common/util/ThirdSDK";
let pageIndex = 1;
let that = "";
let overdue = [];
let auto = true;
let id,userId;
let carnoId,parkId;
let goMap;
let  hasNoMore = true;
let rows = [];
class BoookingContent extends Component{

	constructor(...args){
		super(...args);//调用父级的构造器
		this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
			stateList:[],
			poptip:100
		};
		this.state = this.stateObj;
		/*let dateInit = new JHT();
		dateInit.dateFmtInit();*/
		this.cancelPopupTip  = this.cancelPopupTip.bind(this);
		this.updateContent = this.updateContent.bind(this);
		this.translate = new Translate();
	}
	refreshData() {
	overdue = [];
	console.log("refreshing");
	pageIndex=1;  //页码
	let beginTime = this.props.beginTime;
	let endTime = this.props.endTime;
	that.getData(beginTime,endTime,pageIndex);
 }

	loadMoreData() {
	console.log("loading");
	pageIndex++;  //页码
	console.log(pageIndex);
	// operateMask("show");
	let beginTime = this.props.beginTime;
	let endTime = this.props.endTime;
	that.getData(beginTime,endTime,pageIndex);
 }
	componentWillMount(){
		let begin = this.props.beginTime;
		let end = this.props.endTime;
		this.getData(begin,end,1);


	}

	getData(beginTime,endTime,pageIndex){
		console.log(beginTime+"--"+endTime+"--"+pageIndex)
		let obj = {
			serviceId:"ac.book.sy_querybookparkcarlocation",
			dataItems:[]
		};
		let that = this;
		let userId =  USERINFO.USER.USER_ID;
		var tmp = {
			attributes:{
				//unionid:"userid:"+userId,
				//1e34989003864373b0fda47f2f9bc50d
				//3f4cef3995e448d2816b5726db46280e
				//oUjGnjl9WS9FBL2pA7faM4SpRXy0
				userid:userId,
				//unionid :'userid:019445e1fd4c498086a454eeaab08667',
				begintime:beginTime == null?monthbegin:beginTime,
				endtime:endTime == null?monthend:endTime,
				//begintime:"1970-1-1 00:00:00",
				//endtime:"9999-12-31 00:00:00",
				pageSize : 10,
				pageIndex : pageIndex
			}
		};
		obj.dataItems.push(tmp);
		//operateMask("show");
		jhtAjax({
			//url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
			//url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
			data: {
				serviceId:obj.serviceId,
				dataItems:JSON.stringify(obj.dataItems)
			},
			dataType : 'json',
			type:'post',

			success : function(data) {
				console.log(data)
				operateMask("hide");
				if(pageIndex == 1){
					overdue = [];
				}
				if(data.resultcode == 0){

					if (data && data.dataitems && data.dataitems.length > 0) {

						if((data.dataitems.length)%10!==0){
							showNoMoreData();
						}

						for (var i = 0; i < data.dataitems.length; i++) {
							overdue.push(data.dataitems[i]);
						}
						/*that.setState({
						 auto:true

						 })
						 */
					}else {

						showNoMoreData();
						/*	that.setState({auto:false})*/
					}

					that.setState({
						stateList:overdue
					});
					if(that.state.stateList && that.state.stateList.length>0){
						document.getElementById("nocont").className = "hide";
						document.getElementById("list").className = "fp_list";

					}else{
						document.getElementById("nocont").className = " ";
						document.getElementById("list").className = "hide";
					}
				}else{
					document.getElementById("nocont").className = " ";
					document.getElementById("list").className = "hide";
				}

			
			},
			complete:function(data){
				operateMask('hide');
			},
			error:function(){
				console.log("ajax fail")

			}
		})


	}

	componentWillReceiveProps(nextProps){
		let beginTime = this.props.beginTime;
		let endTime = this.props.endTime;
		if(nextProps.endTime !== undefined && nextProps.beginTime !== undefined){
			operateMask("show");
			this.getData(nextProps.beginTime,nextProps.endTime,1);
		}
	}

	componentDidMount() {

		that = this;

		let thirdSDK = new ThirdSDK(['getLocation']);
		thirdSDK.wxCall({
			serviceId:['getLocation'],
			type:'gcj02',
			success : function(res){
				window.USERINFO.USER.latitude = res.latitude;
				window.USERINFO.USER.longitude = res.longitude;


			}
		})


	}

	/*
	 * 取消弹出提示框
	 * */
	cancelPopupTip() {
		rows = [];
		if (this && this.state) {    //该判断是防止子组件“提示弹出框”操作父组件“关联捷顺通卡”时父组件已经被卸载（比如点击浏览器的返回上一页操作）
			this.updateContent();
		}
	}


	updateContent() {
		this.setState({
			poptip: this.props.poptip + 1
		});
	}
	componentWillUnmount(){
		overdue = [];
		rows = [];
	}
	//延长预定
	testClick(e) {

		id = e.target.parentNode.id;
		userId = e.target.parentNode.parentNode.parentNode.id;
		//parkId = e.target.parentNode.parentNode.parentNode.firstChild.id


	}
	//开车位锁
	lockClick(e){

		carnoId = e.target.parentNode.id;
		parkId = e.target.parentNode.parentNode.parentNode.firstChild.id;
		userId = e.target.parentNode.parentNode.parentNode.id;
		let address = e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].innerText;

		if(e.target.parentNode.childNodes[0].id !== ""){
			this.getLocK(carnoId,parkId,address);
		}

	}


	getLocK(carnoId,parkId,address){
		let that = this;
		let obj = {
			serviceId:"ac.book.bluetoothcarlock",

			attributes:{
				//unionid:"userid:"+userId,
				CAR_ID:carnoId,
				PARK_ID:parkId,
				BLUETOOTH_PROBE_ADDR:address,
				PROPERTY_CODE:userId,
				STATUS:1
			}
		};

		jhtAjax({
			//url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
			//url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
			data: {
				serviceId:obj.serviceId,
				attributes:JSON.stringify(obj.attributes)
			},
			dataType : 'json',
			type:'post',


			success : function(data) {
				console.log(data)
				if(data.message !== ""){
					rows.push( <PopupTip key="1"  txt={data.message} cancelPopupTip={ that.cancelPopupTip } /> );
					that.updateContent();
				}


			}
		});
	}

	render(){

		//let dataServiceList = overdue;

		let liked = this.props.liked;

		if(liked == null){
			liked = 2;
		}
		let iconstyle;
		let colorstyle;
		let fontstyle = {"fontSize":"16px","color":"#ef6623","top":"0.37rem","position":"absolute","right":"0.37rem"}
		let rem = (document.documentElement.clientWidth / 750) * 100;
		let topHeight = parseInt(document.documentElement.clientHeight - 0.97*rem);
		console.log(topHeight);

		let style2 = {"overflow":"auto", "height":`${topHeight}px`};
		return(
			<div>
				<div>
					<Loading taskCount = "1"/>

				</div>

				<article className="fp_list" id = "list">
					<div className = "line" ref = "line"></div>

							<div id = "outside"    ref = "outside" className="success">

								<PullDownRefresh element="inside" fn={this.refreshData.bind(this)} over="auto" />  {/*下拉刷新组件*/}

								<ul id = "inside" style={style2}>
								{
									this.state.stateList.map((item,i)=>{

										//字符串的切割
										let booktime = item.attributes.booktime;

										let begintime = booktime.substring(2,booktime.length).replace(/\-/g,"/").substring(0,booktime.length-5);


										let overduetime = item.attributes.overduetime;

										let endtime = overduetime.substring(2,overduetime.length).replace(/\-/g,"/").substring(0,overduetime.length-5);

										let pathdata = {
											pathname : "/prolong",
											query : {
												parkname:item.attributes.parkname,
												vehicle_no:item.attributes.vehicle_no,
												parkid:item.attributes.parkid,
												userid:item.attributes.userid,
												oldbook_id:item.attributes.oldbook_id,
												id:item.attributes.id,
												longitude:item.attributes.longitude,
												latitude:item.attributes.latitude

											}
										};
										let city = "起点";

										let startPoint = this.translate.gcj02tobd09(window.USERINFO.USER.longitude,window.USERINFO.USER.latitude);
										let endPoint = this.translate.gcj02tobd09(item.attributes.longitude,item.attributes.latitude);
										// goMap = "http://api.map.baidu.com/direction?origin=latlng:'+lat+','+lng+'|name:'+city+'&destination=latlng:'+item.attributes.latitude+','+item.attributes.longitude+'|name:'+item.attributes.parkaddr+'&mode=driving&region=中国&output=html&src=yourCompanyName|yourAppName"
										//goMap = 'https://api.map.baidu.com/direction?origin=latlng:'+startPoint[1]+','+startPoint[0]+"|&destination=latlng:"+endPoint[1]+","+endPoint[0]+'|name:'+item.attributes.parkaddr+'&mode=driving&region=中国&output=html&src=yourCompanyName|yourAppName'
										goMap = 'https://api.map.baidu.com/direction?origin=latlng:'+startPoint[1]+","+startPoint[0]+"|name:"+city+"&destination=latlng:"+endPoint[1]+","+endPoint[0]+'|name:'+item.attributes.parkaddr+'&mode=driving&region=中国&output=html&src=yourCompanyName|yourAppName';
										//时间的比较
										//alert(goMap)
										let monthend = new Date().getFullYear() + "-" + (new Date().getMonth()+1)+ "-" +new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
										let time1 = monthend.replace(/\-/g,"/");
										let time2 = item.attributes.overduetime.replace(/\-/g,"/");
										if( Date.parse(time1)> Date.parse(time2)){
											iconstyle = {"background":"url(../images/no-used2.png)","width":"0.26rem","height":"1rem","position":"absolute","left":"-0.02rem","top":"0.34rem","backgroundSize":"cover"}
											colorstyle = {"marginRight":" 0.1rem","color":"#959595"}

										}else{
											iconstyle = {"background":"url(../images/no-used1.png)","width":"0.26rem","height":"1rem","position":"absolute","left":"-0.02rem","top":"0.34rem","backgroundSize":"cover"}
											colorstyle = { "marginRight":" 0.1rem","color":"#ef6623"}
										}


										let money;
										if((/^[+-]?[1-9]?[0-9]*\.[0-9]*$/).test(item.attributes.amount) == false ){
											money = item.attributes.amount;
										}else {
											money = parseFloat(item.attributes.amount).toFixed(2);
											money = money.substring(0,money.lastIndexOf('.')+2);
											if(money == 0.0){
												money = 0;
											}else{
												money = parseFloat(item.attributes.amount).toFixed(2);
												money = money.substring(0,money.lastIndexOf('.')+2);
											}

										}

										return (
											<li className="tp_park_list" key = {`li-${i}`} id = {`${ item.attributes.userid}`}>

												<div className = "noused" id = {`${ item.attributes.parkid}`} style = {iconstyle}></div>

												<div className="tp_park_details">
													<h2 className="vehicle_no" id="vehicle_no">
														{item.attributes.parkname}

													</h2>
													<p className = "parkAddress" id="parkAddress" ref = "parkAddress">
														{item.attributes.parkaddr}
													</p>

													<p id="parkName">
														{item.attributes.vehicle_no}
							<span>
							{`预定车位号:${item.attributes.parkcode}`}
							</span>
													</p>
													<p id="bookTime" className="bookTime">
														<label id="overduebeginTime" style = {colorstyle}>
															{ begintime }
														</label>
							<span className = "entrance">请在<label id="overdueTime" style = {colorstyle}>
					{ endtime }
							</label>前入场
							</span>
													</p>

												</div>
												<div className = "border"></div>
												{
													Date.parse(time1) < Date.parse(time2)?(<ul className = "Function" >

														<li  id = {`${ item.attributes.id }`}  onClick={this.testClick.bind(this)}>
															<span style = {{"color":"#fff","fontSize":"0.24rem","width":"0.26rem","height":"1rem","position":"absolute","left":"-0.02rem","top":"0.34rem","backgroundColor":"#20c527","fontSize":"0.8em","lineHeight":"0.35rem","paddingLeft":"0.06rem"}}>未过期</span>
															{
																item.attributes.oldbook_id !==""?(<span style={{"color":"#fff","background":"#80c02b","position":"absolute","left":"2.5rem","top":"0.4rem","fontSize":"0.8em","textAlign":"center","lineHeight":"0.32rem","borderRadius":"5px"}}>延</span>):(<span style={{"color":"#fff","background":"#80c02b","position":"absolute","left":"2.5rem","top":"0.4rem","fontSize":"0.8em","textAlign":"center","lineHeight":"0.32rem","borderRadius":"5px","display":"none"}}>延</span>)
															}

															<span  style = {{"background":" url(../images/daly-history1.png)","backgroundSize": "cover"}}></span>
															<Link to = {pathdata}>延长预定</Link>
														</li>
														{
															item.attributes.probe_bt_address !== ""?(<li  onClick={this.lockClick.bind(this)} id = {`${ item.attributes.vehicle_no }`}>
																<span id = {`${ item.attributes.probe_bt_address }`}></span>
																<Link>	开车位锁</Link>
															</li>):(<li >
																<span style = {{"background":" url(../images/suo_history2.png)","backgroundSize": "cover"}}></span>
																<Link style = {{"color":"#959595"}}>	开车位锁</Link>
															</li>)
														}

														<li>
															<span></span>
															<a  href={goMap} target="_blank">去这里</a>
														</li>
													</ul>):(<ul className = "Function">

														<li>
															<span style={{"color":"#fff","fontSize":"0.24rem","width":"0.26rem","height":"1rem","position":"absolute","left":"-0.02rem","top":"0.34rem","backgroundColor":"#959595","fontSize":"0.8em","lineHeight":"0.35rem","paddingLeft":"0.06rem"}}>已过期</span>
															{
																item.attributes.oldbook_id !==""?(<span style={{"color":"#fff","background":"#959595","position":"absolute","left":"2.5rem","top":"0.4rem","fontSize":"0.8em","textAlign":"center","lineHeight":"0.32rem","borderRadius":"5px"}}>延</span>):(<span style={{"color":"#fff","background":"#959595","position":"absolute","left":"2.5rem","top":"0.4rem","fontSize":"0.8em","textAlign":"center","lineHeight":"0.32rem","display":"none"}}>延</span>)
															}

															<span  style = {{"background":" url(../images/daly-history2.png)","backgroundSize": "cover"}}></span>
															<Link style = {{"color":"#959595"}}>延长预定</Link>
														</li>
														<li >
															<span style = {{"background":" url(../images/suo_history2.png)","backgroundSize": "cover"}}></span>
															<Link style = {{"color":"#959595"}}>	开车位锁</Link>
														</li>
														<li>
															<span style = {{"background":" url(../images/qu_history2.png)","backgroundSize": "cover"}}></span>
															<Link style = {{"color":"#959595"}}>	去这里</Link>
														</li>
													</ul>)



												}
												<div style = {fontstyle} ref = "coupon">
													￥{money}

												</div>

												<div className="clear"></div>
											</li>
										)
									})
								}

							   </ul>
								<PullUpLoadMore element="inside" fn={this.loadMoreData.bind(this)} over="auto"  />  {/*加载更多*/}


						</div>



				</article>

				<div id = "nocont" className="hide">
					<Nothing content="亲，没有查询到订车位的记录哦"/>
				</div>

				{rows}

			</div>
		)
	}
}



export { BoookingContent }
