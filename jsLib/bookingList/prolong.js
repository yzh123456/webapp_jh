import {Component} from "react";
import JHTAJAX from "../common/util/JHTAjax";
import {OpenCar} from "../MonthlyRenewals/opencar";
import {PayOrder} from "../MonthlyRenewals/payorder";
import {PopupTip} from "../myWallet/js/popupTip";
import {Time} from "./time";
import {WXGETPAYURL} from"../common/util/Enum";
import { Loading,operateMask } from "../common/components/Loading";
//引入 react-router 模块，获取 link 组件
let parkId,carPlace,carloaction,userId,parkname,vehicle_no,oldbook_id,id;
let carPlaceInfo,long,lat,count;
let rows = [];
let arr = [];
class ProLong extends Component{
	constructor(...args){
		super(...args);//调用父级的构造器
		this.state = {
			carmoney:"",
			poptip:100,
			car:"",
			totalfee:"",
			numwx:0,
			numjst:0,
			numzfb:0,
			orderno:"",
			parkingname:"",
			itemstate:1   //  1-钱包  2--微信  
		}
	}


	componentWillMount(){

		parkId = this.props.location.query.parkid;
		userId = this.props.location.query.userid;
		parkname = this.props.location.query.parkname;
		vehicle_no = this.props.location.query.vehicle_no;
		oldbook_id = this.props.location.query.oldbook_id;
		id = this.props.location.query.id;
		long = this.props.location.query.longitude;
		lat = this.props.location.query.latitude;
		this.getInfo(parkId);
		this.dataparkInfo(parkId,long,lat,userId);

		this.getloaction(userId,parkId,vehicle_no,carPlace.dataitems[0].attributes.amount,oldbook_id,id);

		if(carPlaceInfo.dataitems[0].attributes.emptyParkPlaceCount <=0){
			count = carPlaceInfo.dataitems[0].attributes.emptyparkplacecount;
		}else{
			count = carPlaceInfo.dataitems[0].attributes.parkplacecount;
		}
		this.getcarinfo();



	}
	//查询卡信息
	getcarinfo(){
		//查询卡通状态
		//1e34989003864373b0fda47f2f9bc50d
		//let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
		let userId = USERINFO.USER.USER_ID;
		let obj = {
			attributes:{
				USER_ID:userId,
			} };


		//发送ajax请求
		let that = this;
		JHTAJAX( {
			/* url: XMPPSERVER,*/
			data: {
				serviceId:"ac.jst.querycardallinfo",
				attributes:JSON.stringify(obj.attributes),
			},
			type: 'post',
			dataType: 'json',
			/*async: false,*/   /*不传值默认异步调用*/
			success: function (data) {
				console.log(data);
				if(data.resultcode  == 0){
					that.setState({
						carmoney:parseFloat(data.attributes.card_balance_vlia/100).toFixed(2),
						car:data.attributes.jst_card_no

					})

				}

			} ,
			error:  function (error) {
				console.log("ajax failure");
			}
		} );
	}
	//预定参数查询
	getInfo(parkId){
		let obj = {
			serviceId:"ac.park.sy_getqueryparksurplus",
			dataItems:[]
		};
		let that = this;
		var tmp = {
			attributes:{
				//unionid:"userid:"+userId,
				parkid:parkId
			}
		};
		obj.dataItems.push(tmp);
		JHTAJAX({
			//url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
			//url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
			data: {
				serviceId:obj.serviceId,
				dataItems:JSON.stringify(obj.dataItems)
			},
			dataType : 'json',
			async:false,
			type:'post',
			success : function(data) {
				console.log(data);
				let fee = "";
				if((/^[+-]?[1-9]?[0-9]*\.[0-9]*$/).test(data.dataitems[0].attributes.amount) == false ){
					fee = data.dataitems[0].attributes.amount;
				}else {
					fee = parseFloat(data.dataitems[0].attributes.amount).toFixed(1);
					if(fee == 0.0){
						fee = 0;
					}else{
						fee = parseFloat(data.dataitems[0].attributes.amount).toFixed(1);
					}

				}
				that.setState({
					totalfee:fee
				})
				carPlace = data;

				console.log("success ajax");

			}.bind(this)
		});
	}
	//车位预订订单接口
	getloaction(userId,parkId,vehicle_no,amount,oldbook_id,id){
		let obj = {
			serviceId:"ac.book.sy_bookparkcarlocation",
			dataItems:[]
		};
		let that = this;
		var tmp = {
			attributes:{
				//unionid:"userid:"+userId,
				parkid:parkId,
				userid:userId,
				vehicle_no:vehicle_no,
				amount:amount,
				isdelay:1,
				oldbook_id:oldbook_id == ""?id:oldbook_id

			}
		};
		obj.dataItems.push(tmp);
		JHTAJAX({
			//url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
		//	url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
			data: {
				serviceId:obj.serviceId,
				dataItems:JSON.stringify(obj.dataItems)
			},
			dataType : 'json',
			async:false,
			type:'post',
			success : function(data) {
				console.log(data);
				operateMask("hide")
				carloaction = data;
				if(data.resultcode == 0){
					that.setState({
						orderno:data.dataitems[0].attributes.orderno,
						parkingname:data.dataitems[0].attributes.parking_lot_name
					})
					if(data.dataitems[0].subitems && data.dataitems[0].subitems.length>0 ){
						for(var i = 0;i<data.dataitems[0].subitems.length;i++){
							arr.push(data.dataitems[0].subitems[i]);
							if(arr[i].attributes.paytype == "WX"){//微信

								that.setState({
									numwx:1
								});


							}else if(arr[i].attributes.paytype == "JST"){//钱包
								that.setState({
									numjst:1
								});

							}

						}
					}
					if( that.state.numjst !== 1 ){
						that.setState({
							itemstate:2
						})
					}

				}else{
					if(data.message !== ""){
						rows.push( <PopupTip key="1"  txt={data.message} cancelPopupTip={ that.cancelPopupTip } /> );
						that.updateContent();
						setTimeout(()=>{
							window.history.back();

						},2000)
					}else{
						setTimeout(()=>{
							window.history.back();

						},2000)
					}


				}

			}.bind(this),
			complete:function(data){
				operateMask('hide');
			},
			error:function(){
				operateMask('hide');
			}
		});

	}
	//加载定车停车场详情
	dataparkInfo(parkId,long,lat,userId){
		//console.log(id,long,lat,userId)
		let obj = {
			serviceId:"ac.park.sy_getparkinfo",
			dataItems:[]
		};
		var tmp = {
			attributes:{
				//unionid:"userid:"+userId,
				id:parkId,
				beforelongitude:long,
				beforelatitude:lat,
				userid:userId


			}
		};
		obj.dataItems.push(tmp);
		JHTAJAX({
			// url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
			// /url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
			data: {
				serviceId:obj.serviceId,
				dataItems:JSON.stringify(obj.dataItems)
			},
			dataType : 'json',
			type:'post',
			async:false,
			success : function(data) {
				console.log(data)
				console.log("success ajax");
				carPlaceInfo = data;
			}.bind(this)
		});
	}
	//我的錢包
	mymoney(){
		this.setState({
			itemstate:1
		})

	}
	//微信
	mywx(){
		this.setState({
			itemstate:2
		})
	}

	//立即缴费
	pay(){
		if(document.getElementById("orderpay").style.backgroundColor != "rgb(154, 219, 67)"){
			return; //不可点击
		}else{//可点击
			if(this.state.itemstate == 1){
				this.getcarinfo();
			//没有绑定卡号  钱包支付
			if(this.state.car == undefined){
				document.getElementById("cancel").className = " ";

			}else{
				//绑定卡号，比较卡的余额 --余额不足
				if(this.state.totalfee > this.state.carmoney){
					document.getElementById("cancel2").className = " ";

				}else{//余额足 --去支付

						this.setState({flag:true})
					}

				}
			}else if(this.state.itemstate == 2){ //微信

				let WX_URL;
				let _this = this;
				let unionid = USERINFO.USER.USER_ID;
				JHTAJAX({

					//url : "http://jhtestcms.jslife.net/jspsn/getPayUrl.servlet?type=WX",
					url:WXGETPAYURL+"?type=WX",
					dataType : 'text',
					async : false,
					type:'post',
					success : function(data) {
						console.log(data)
						WX_URL = data;
						console.log(_this.state.orderno)

						window.location.href = WX_URL+_this.state.orderno;

					}
				});

			}

		}

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

	componentWillUnmount() {
		rows = [];    //组件卸载前清空组件模块全局变量rows

	}
	
	render(){
		let orderstyle = {"fontSize":"0.32rem","borderRadius":"10px","lineHeight":"0.9rem","textAlign":"center","width":"100%","height":"0.9rem","backgroundColor":"#9adb43","color":"#FFF"}

		return(
			<div>
				<div>
					<Loading taskCount = "1"/>

				</div>
				<section id = "confirmcar">
					<div className = "parkFee" style ={{"padding":"0.4rem 0"}}>
						<p  style = {{"marginBottom":"0.2rem"}}>停车费</p>
						<p  style = {{"marginBottom":"0.2rem"}}>
						<span className = "park_fee_tip">￥
						</span>
							{this.state.totalfee}
						</p>
						<Time/>

					</div>
					<div className = "parkTip">
						{parkname}
					</div>
					<div className = " licenseNumber">
						<p>车牌号码
							<span>{vehicle_no}</span>
						</p>
						<p>剩余空车位
							<span>{count}</span>
						</p>
						<div className="clear"></div>
					</div>
					<div className = "applyTip">
						{
							this.state.numjst  == 1?(<p>
								<span ></span>
								<span>我的钱包</span>
								<span>(余额<b>{this.state.carmoney>0?this.state.carmoney:0.00}</b>元)</span>
								<span className={this.state.itemstate ==1?"activeapply":"apply"} onClick = {this.mymoney.bind(this)} ref ="money"></span>
							</p>):(<p style = {{"display":"none"}}>
								<span ></span>
								<span>我的钱包</span>
								<span>(余额<b>{this.state.carmoney>0?this.state.carmoney:0.00}</b>元)</span>
								<span className={this.state.itemstate ==1?"activeapply":"apply"} onClick = {this.mymoney.bind(this)} ref ="money"></span>
							</p>)
						}
						{
							this.state.numwx == 1?(<p>
								<span></span>
								<span>微信支付</span>
								<span onClick = {this.mywx.bind(this)} className={this.state.itemstate ==2  ||  this.state.numjst !== 1 ?"activeapply":"apply"} ref = "wx"></span>
							</p>):(<p style = {{"dispaly":"none"}}>
								<span></span>
								<span>微信支付</span>
								<span onClick = {this.mywx.bind(this)} className={this.state.itemstate ==2?"activeapply":"apply"} ref = "wx"></span>
							</p>)
						}


						<div className="clear"></div>
					</div>
					<div className = "payMent">
						<p id = "orderpay" style = {orderstyle} onClick = {this.pay.bind(this)}>立即缴费</p>
					</div>
					<div className = "delay">
						缴费成功后车位将为您保持<b>{carPlace.dataitems[0].attributes.book_time}</b>分钟,请在<b>{carPlace.dataitems[0].attributes.overdue_time+carPlace.dataitems[0].attributes.book_time}</b>
						分钟内入场.<span>订位成功后不能取消</span>

					</div>
				</section>
				{rows}
				<OpenCar key = "1" carno = {this.state.car}/>
				<PayOrder display = {this.state.flag} orderno = {this.state.orderno} totalmoney = {this.state.totalfee} carno = {this.state.car} parkingname = {this.state.parkingname}  booktime = {carPlace.dataitems[0].attributes.book_time} totaltime = {carPlace.dataitems[0].attributes.overdue_time+carPlace.dataitems[0].attributes.book_time}/>

			</div>

		)
	}
}
export { ProLong }
