import {Component, Children} from "react";
import {dataCancel, dataAttention} from "./dataService";
import JHTAJAX from "../common/util/JHTAjax";
import { Loading,operateMask } from "../common/components/Loading";
import { Nothing } from "../common/components/Nothing";
import {PullDownRefresh} from "../common/JhtScroll/PullDownRefresh";
import {PullUpLoadMore} from "../common/JhtScroll/PullUpLoadMore";
import { Link } from 'react-router';
import jht from "../common/util/JHT";
let JHT = new jht();
let index = 0;
let user_id;
let confirmid,delateid,confirm,tar;
let datacar;
let arr = [];
let emptyparkplacecount,parkplacecount;
let  pageIndex=1;
let that = "";
let rows = [];
let latitude,longitude;
class AttentionList extends  Component{
	//初始化
	constructor(...args) {
		super(...args);
		this.stateObj = {
			items: []
		};
		document.title = "收藏的车场";
		this.state = this.stateObj;
		this.pageIndex = 1;

	}
	//收藏点击事件
	iconclick(e){

		index++;

		e.target.className = "find_icon";
		e.target.parentNode.lastChild.className = "att";
		e.target.parentNode.childNodes[1].className  = "hide";
		this.refs.attentiondata.className = "attentiondata";
		tar = e.target;
		confirm = e.target.parentNode.parentNode;

		confirmid = e.target.parentNode.parentNode.id;
		delateid = e.target.parentNode.firstChild.id;

		//this.data(e.target.parentNode.id,e.target.parentNode.firstChild.id)

	}
	//确定按钮
	trueclick(){

		this.refs.attentiondata.className = "hide";
		//调用取消关注的接口

		dataCancel.loadCarPlaceCancel(confirmid);
		//confirm.className = "hide";
		location.reload();

		if(this.stateObj.items.length < 0){
			this.refs.error.className = "error";
			this.refs.success.className = "hide";

		}

	}
	//取消按钮
	falseclick(){

		this.refs.attentiondata.className = "hide";
		tar.className = "new_icon";
		tar.parentNode.lastChild.className = "hide";
		tar.parentNode.childNodes[1].className  = "mesy";
		//关注
		let dataAttentionList =
			dataAttention.loadCarPlaceAttention(delateid);

		//console.log(dataAttentionList)


	}
	//查看详情
	datail(item){

			let parkname = item.attributes.name;
			let parkid = item.attributes.parkid;

			if(JHT.working() == "APP"){

				AppBridge.forJS({

					serviceId:"QRYPARKINGDETAIL",
					params:{
						parkName: parkname,
						parkId : parkid
					}

				},function(data){
					//alert(data)

				})
			}


	}
	//调用地图
	goMap(item){

		let parkname = item.attributes.name;
		let parkid = item.attributes.parkid;
		let empty = item.attributes.emptyparkplacecount;

		if(JHT.working() == "APP"){

			AppBridge.forJS({

				serviceId:"PARKINGPREORDER",
				params:{
					parkName: parkname,
					parkId : parkid,
					emptySites:empty
				}

			},function(data){
				//alert(data)

			})
		}



	}

	getData(pageIndex){

		var pageIndex = pageIndex;

		   //user_id = window.USERINFO.USER.USER_ID;

			// 	alert(user_id+"***"+long+"***"+lat)
			let obj = {
				serviceId:"ac.park.sy_getuserattention",
				dataItems:[]

			};

        	let tmp = {
				attributes:{
					pageSize:10,
					pageIndex:pageIndex,
					beforelongitude:longitude,
					beforelatitude:latitude,
					userid:user_id
					/*beforelongitude: '113.366856',
					beforelatitude:'22.521415',
					userid:'1e34989003864373b0fda47f2f9bc50d'*/

				}
			};

			obj.dataItems.push(tmp);
			JHTAJAX({

				//  url : 'http://jhtestcms.jslife.net/jspsn/XmppServer.servlet ',
				data: {
					//云服务 serviced
					serviceId:obj.serviceId,
					dataItems:obj.dataItems

				},

				dataType : 'json',
				type:'post',

				success : function(data) {
					operateMask("hide");
					//alert(JSON.stringify(data));
					console.log("ajax success");


					if(pageIndex==1){
						arr = [];
					}
					datacar = data;

					if (data  && data.dataitems && data.dataitems.length > 0) {

						for (let i = 0; i < data.dataitems.length; i++) {
							arr.push(data.dataitems[i]);


						}
					}else {
						this.refs.Nocontent.refs.stPromptTxt.innerText = "无更多内容"
					}

					this.stateObj.items = arr;
					this.setState(this.stateObj);

					if(this.stateObj.items.length > 0){

						this.refs.error.className = "hide";

					}else{
						this.refs.error.className = "error";
						this.refs.success.className = "hide";

					}

				}.bind(this),
			});


	}

	componentWillMount(){
		that = this;
        user_id = window.USERINFO.USER.USER_ID ;
        longitude = window.USERINFO.USER.longitude;
        latitude = window.USERINFO.USER.latitude;
        that.getData(1);
        //去除原来方式定位
		/*if(JHT.working() == "APP" && window.USERINFO.USER){

            user_id = window.USERINFO.USER.USER_ID ;
            longitude = window.USERINFO.USER.longitude;
            latitude = window.USERINFO.USER.latitude;
            that.getData(1);
			/!*AppBridge.baseData(function(data) {
				user_id = data.USER.USER_ID ;
				longitude = data.USER.longitude;
				latitude = data.USER.latitude;
				that.getData(1);

			})*!/
		}else if(JHT.working() == "WX"){
			thirdSDK.wxCall({
				serviceId:['getLocation'],
				type:'gcj02',
				success : function(res){
					latitude = res.latitude;
					longitude = res.longitude;
					that.getData(1);

				},
				error:function(res){
					latitude = 0;
					longitude = 0;
					that.getData(1);
				}
			})

		}*/

	}
	componentWillUnmount(){
		rows = [];
	}


	render(){
		let nostyle = {"textAlign":"center","margin":"15px 15px 0px","fontSize":"0.3rem","fontFamily":"OfficialScript"}
		let newstyle = {"position":"absolute","width":"1.6rem","height":"2rem","right":"0","top":"0"}

		return(
			<div>

				<div>
					<Loading taskCount = "1"/>

				</div>

				<section id = "attentionList">


					<div id = "outside"    ref = "outside">
						<PullDownRefresh element="inside" fn={refreshData} over="auto" />  {/*下拉刷新组件*/}
						<ul ref = "success" className = "success"  id = "inside" >


							{
								this.stateObj.items.map((item,i)=>{
									let spanstyle;
									emptyparkplacecount = item.attributes.emptyparkplacecount;
									parkplacecount = item.attributes.parkplacecount ;
									if(emptyparkplacecount<=0){
										emptyparkplacecount = 0;
										spanstyle = {"color":"#545454"};
									}else if(emptyparkplacecount>=parkplacecount/2){
										spanstyle = {"color":"#80c02b"};
										emptyparkplacecount = item.attributes.emptyparkplacecount;
									}else if(emptyparkplacecount<parkplacecount/2){
										spanstyle = {"color":"#FD7B12"};
										emptyparkplacecount = item.attributes.emptyparkplacecount;
									}else if(emptyparkplacecount<10){
										spanstyle = {"color":"#ff0000"};
										emptyparkplacecount = item.attributes.emptyparkplacecount;
									}
									if(parkplacecount<=0){
										parkplacecount = 0;
									}else{
										parkplacecount = item.attributes.parkplacecount;
									}

									let pathdata = {
										pathname: "/bookingorder",
										query: {
											text: JSON.stringify(item.attributes)
										}
									};
									let pathdata1 = {
										pathname: "/mapdetail",
										query: {
											data: JSON.stringify(item.attributes)
										}
									};

									return(
										<div key = {`div-${i}`}>
											{
												JHT.working() !== "APP"?<li className = "to_park_ditail" key = {`lis-${i}`} ref = "ditail" id = {`${ item.attributes.id }`}>

													<div className = "datail"  id = {`${ item.attributes.parkid }`} onClick  ={this.datail.bind(this,item)}>
														<Link to = {pathdata1} style = {{"overflow":"hidden","display":"block"}}>
														<h2 className = "parkTitle" >
															{ item.attributes.name }

														</h2>
													</Link>
														<p className="parkAddress" id="parkAddress" ref = "parkAddress">
															{ item.attributes.address }
														</p>
														<p className = "parkTime" id = {`${ item.attributes.latitude }`}>
															<span className = "parkDat" id = {`${ item.attributes.longitude }`}></span>
								<span className ="parkNumber" style = {spanstyle}>
					{emptyparkplacecount}

								<span  className = "number">{`/${parkplacecount}`}
									</span>
								</span>
								<span className = "parkprice">{`￥${item.attributes.park_qh}`}

									<span className = "hours">/小时
									</span>
								</span>
															{
																JHT.working() !== "APP"?(<span className = "go_Map">
								<span className = "icon" ></span>
								<span><Link to={pathdata} style ={{"color":"#80c02b","fontSize":"0.26rem"}}>订车位</Link></span>
								</span>):(<span
																	className = "go_Map" onClick = {(e)=>{
										e.stopPropagation();
										this.goMap(item);

										}}>
								<span className = "icon" ></span>
								<span style ={{"color":"#80c02b","fontSize":"0.26rem"}}>订车位</span>
								</span>)
															}

														</p>
													</div>
													<div className="new" style={newstyle} >


														<div className = "new_icon"   onClick = { this.iconclick.bind(this)}>

														</div>
														<div className="mesy" ref = "mesy">已收藏</div>
														<div className="hide"  ref = "att">收藏</div>
													</div>
												</li>:(<li className = "to_park_ditail" key = {`li-${i}`} ref = "ditail" id = {`${ item.attributes.id }`}>
													<div className = "datail"  id = {`${ item.attributes.parkid }`} onClick  ={this.datail.bind(this,item)}>

														<h2 className = "parkTitle" >
															{ item.attributes.name }

														</h2>
														<p className="parkAddress" id="parkAddress" ref = "parkAddress">
															{ item.attributes.address }
														</p>
														<p className = "parkTime" id = {`${ item.attributes.latitude }`}>
															<span className = "parkDat" id = {`${ item.attributes.longitude }`}></span>
								<span className ="parkNumber" style = {spanstyle}>
					{emptyparkplacecount}

								<span  className = "number">{`/${parkplacecount}`}
									</span>
								</span>
								<span className = "parkprice">{`￥${item.attributes.park_qh}`}

									<span className = "hours">/小时
									</span>
								</span>
															{
																JHT.working() !== "APP"?(<span className = "go_Map">
								<span className = "icon" ></span>
								<span><Link to={pathdata} style ={{"color":"#80c02b","fontSize":"0.26rem"}}>订车位</Link></span>
								</span>):(<span
																	className = "go_Map" onClick = {(e)=>{
										e.stopPropagation();
										this.goMap(item);

										}}>
								<span className = "icon" ></span>
								<span  style ={{"color":"#80c02b","fontSize":"0.26rem"}}>订车位</span>
								</span>)
															}

														</p>
													</div>
													<div className="new" style={newstyle} >


														<div className = "new_icon"   onClick = { this.iconclick.bind(this)}>

														</div>
														<div className="mesy" ref = "mesy">已收藏</div>
														<div className="hide"  ref = "att">收藏</div>
													</div>


												</li>)
											}

										</div>

									)

								})

							}

							<PullUpLoadMore element="inside" fn={loadMoreData} over="auto" ref = "Nocontent" />  {/*加载更多*/}

						</ul>
					</div>

					<div className = "hide" ref = "error">
						<Nothing  content="亲，还没有收藏的车场哦"/>

					</div>


				</section>

				<section className = "hide"  ref = "attentiondata" >
					<div className = "cover" style = {{height: window.innerHeight}}></div>
					<div className = "message">
						<p></p>
						<div>
							<span onClick  = {this.falseclick.bind(this)}>再想想</span>
							<span  onClick = {this.trueclick.bind(this)}>是的</span>
						</div>
					</div>


				</section>


			</div>
		)
	}
}
function refreshData() {
	console.log("refreshing");
	pageIndex=1;  //页码
	// operateMask("show");
	that.getData(pageIndex);
}

function loadMoreData() {
	console.log("loading");
	pageIndex++;  //页码
	console.log(pageIndex);
	// operateMask("show");
	that.getData(pageIndex);
}

export { AttentionList };

