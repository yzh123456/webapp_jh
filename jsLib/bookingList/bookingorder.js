/**
 * Created by hua on 2017/2/10.
 */
import {Component} from "react";
import {OpenCar} from "../MonthlyRenewals/opencar";
import {PayOrder} from "../MonthlyRenewals/payorder";
import {PopupTip} from "../myWallet/js/popupTip";
import JHTAJAX from "../common/util/JHTAjax";
import JHT from "../common/util/JHT";
import { Loading,operateMask } from "../common/components/Loading";
import {Time} from "./time";
import {WXGETPAYURL} from"../common/util/Enum"
let obj;
let arr = [],list = [];
let rows = [];
class BookingOrder extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            carmoney:"",
            car:"",
            poptip:100,
            defaultcar:"",
            totalfee:"",
            booktime:"",
            overtime:"",
            orderno:"",
            id:"",
            default:0,
            flag:false,
            numwx:0,
            numjst:0,
            parkingname:"",
            itemstate:1   //  1-钱包  2--微信
        }
        this.jht = new JHT();
        document.title = "订车位";
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    componentWillMount(){
        this.getcarno();
      //  this.getcarinfo();
        obj = eval("(" + ""+this.props.location.query.text+")");
        console.log(obj)
        if(window.location.href.indexOf("attentionList") > -1){
            this.setState({
                id:obj.parkid
            });
            this.getInfo(obj.parkid);
        }else{
            this.setState({
                id:obj.id
            });
            this.getInfo(obj.id);
        }



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
                if(data.resultcode  == 0){
                    if(data.dataitems[0]&&data.dataitems[0].attributes&&data.dataitems[0].attributes.book_time){
                        localStorage.setItem("bookTime",data.dataitems[0].attributes.book_time);
                    }
                    that.setState({
                        totalfee:data.dataitems[0].attributes.amount,
                        booktime:data.dataitems[0].attributes.book_time,
                        overtime:data.dataitems[0].attributes.overdue_time
                    })

                }else{
                    document.getElementById("order").style.backgroundColor = "#959595";
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "1" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();

                    }else{
                        rows.push(<PopupTip key = "1" txt="订单支付失败，请稍后重试" cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                    }
                }

            }.bind(this)
        });
    }

    //车位预订订单接口
    getloaction(parkId,vehicle_no,amount){
        let obj = {
            serviceId:"ac.book.sy_bookparkcarlocation",
            dataItems:[]
        };
        let that = this;
        let jht = new JHT();
        let userId = window.USERINFO.USER.USER_ID ;
        var tmp = {
            attributes:{
                //unionid:"userid:"+userId,
                parkid:parkId,
                userid:userId,
                vehicle_no:vehicle_no,
                amount:amount,
                isdelay:0

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
            type:'post',
            success : function(data) {
                console.log(data)
                //document.getElementById("load_mask").style.visibility = "hidden";
                operateMask("hide");
                if(data.resultcode == 0){
                    that.setState({
                        orderno:data.dataitems[0].attributes.orderno,
                        parkingname:data.dataitems[0].attributes.parking_lot_name
                    })

                    if(data.dataitems[0].subitems && data.dataitems[0].subitems.length>0 ){
                        if(data.dataitems[0].attributes.parking_lot_name){
                            localStorage.setItem("parkingname",data.dataitems[0].attributes.parking_lot_name);
                        }
                        /*for(var i = 0;i<data.dataitems[0].subitems.length;i++){
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

                        }*/
                    }
                   /* if( that.state.numjst !== 1 ){
                        that.setState({
                            itemstate:2
                        })
                    }*/

                }else{
                    if(data.message !== ""){
                        rows.push( <PopupTip key="2"  txt={data.message} cancelPopupTip={ that.cancelPopupTip } /> );
                        that.updateContent();

                      /*  setTimeout(()=>{
                            window.history.back();

                        },2000)*/
                    }else{
                       /* setTimeout(()=>{
                            window.history.back();

                        },2000)*/
                    }


                }

            },
            complete:function(data){
                operateMask('hide');
            },
            error:function(){
                operateMask('hide');
            }
        });

    }
    //查询卡信息
   /* getcarinfo(){
        //查询卡通状态
        //1e34989003864373b0fda47f2f9bc50d
        //let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let jht =new JHT();
       let userId = window.USERINFO.USER.USER_ID ;
        let obj = {
            attributes:{
                USER_ID:userId
            } };


        //发送ajax请求
        let that = this;
        JHTAJAX( {
            /!* url: XMPPSERVER,*!/
            data: {
                serviceId:"ac.jst.querycardallinfo",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /!*async: false,*!/   /!*不传值默认异步调用*!/
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
    }*/
    //车辆信息的查询
    getcarno(){
        let jht =new JHT();
       let userId = window.USERINFO.USER.USER_ID ;
        let that = this;
        let obj = {
            serviceId:"ac.sys.sy_getcarlist",
            attributes:{

                USER_ID:userId
              //  unionid:"USER_ID:019445e1fd4c498086a454eeaab08667",
            }
        };

        JHTAJAX({
            //url:"http://weixin.jslife.com.cn/jspsn/XmppServer.servlet",
            //url:"http://jhtestcms.jslife.net/jspsn/XmppServer.servlet",
            data: {
                serviceId:obj.serviceId,
                attributes:JSON.stringify(obj.attributes)
            },
            dataType : 'json',
            type:'post',
            success : function(data) {

                console.log(data);
                if(data.resultcode == 0 ){

                    if(data.dataitems && data.dataitems.length>0){
                        for (var i = 0; i < data.dataitems.length; i++){
                            list.push(data.dataitems[i])
                            if(list[i].attributes.is_default == 1){
                              that.setState({
                                    defaultcar:data.dataitems[i].attributes.car_no
                                })

                              break;

                            }else{

                                that.setState({
                                 defaultcar:data.dataitems[0].attributes.car_no
                               })


                            }


                        }


                        that.getloaction(that.state.id,that.state.defaultcar,that.state.totalfee);


                    }else{

                        
                        document.getElementById("cancel3").className = " ";
                        operateMask("hide");


                    }


                }

            },
            error:function(){
                console.log("ajax fail")
            }
        });
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
        list = [];    //组件卸载前清空组件模块全局变量rows
        arr = [];
        rows =[];

    }

   /* //我的錢包
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

    }*/
    //立即支付
    pay(){
        if(document.getElementById("order").style.backgroundColor != "rgb(154, 219, 67)"){
            return; //不可点击
        }else{//可点击
           /* if(this.state.itemstate == 1){
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

                   // url : "http://jhtestcms.jslife.net/jspsn/getPayUrl.servlet?type=WX",
                    url:WXGETPAYURL+"?type=WX",
                    dataType : 'text',
                    async : false,
                    type:'post',
                    success : function(data) {
                        console.log(data)
                        WX_URL = data;
                        console.log(_this.state.orderno)
                        //alert(WX_URL+_this.state.orderno)

                       window.location.href = WX_URL+_this.state.orderno;

                    }
                });

            }*/

            let WX_URL;
            let _this = this;
            let unionid = USERINFO.USER.USER_ID;
            JHTAJAX({

                // url : "http://jhtestcms.jslife.net/jspsn/getPayUrl.servlet?type=WX",
                url:WXGETPAYURL+"?type=WX",
                dataType : 'text',
                async : false,
                type:'post',
                success : function(data) {
                    console.log(data)
                    WX_URL = data;
                    console.log(_this.state.orderno)
                    //alert(WX_URL+_this.state.orderno)

                    window.location.href = WX_URL+_this.state.orderno;

                }
            });
        }

    }

    render(){
    let pstyle = {"borderBottom":"1px solid #d9d9d9","fontSize":"0.32rem","paddingLeft":"0.3rem","color":"#80c02b","height":"0.8rem","lineHeight":"0.8rem","backgroundColor":"#ebf7ff"}
    let orderstyle = {"fontSize":"0.32rem","borderRadius":"10px","lineHeight":"0.9rem","textAlign":"center","width":"100%","height":"0.9rem","backgroundColor":"#9adb43","color":"#FFF"}
        obj = eval("("+this.props.location.query.text+")");
        let Height = window.innerHeight;
        let fee = "";
        if((/^[+-]?[1-9]?[0-9]*\.[0-9]*$/).test(this.state.totalfee) == false ){
            fee = this.state.totalfee;
        }else {
            fee = parseFloat(this.state.totalfeet).toFixed(2);
            fee = fee.substring(0,fee.lastIndexOf('.')+2);

            if(fee == 0.0){
                fee = 0;
            }else{
                fee = parseFloat(this.state.totalfee).toFixed(2);
                fee = fee.substring(0,fee.lastIndexOf('.')+2);
            }

        }

        return(
            <div>
                <div>
                    <Loading taskCount = "1"/>

                </div>
            <section id = "confirmcar" style = {{"height":Height+"px"}} className=" ">
                <div className = "parkFee" style ={{"textAlign":"center","padding":"0.4rem 0"}} >
                    <p style = {{"marginBottom":"0.2rem"}}>停车费</p>
                    <p style = {{"marginBottom":"0.2rem"}}>
						<span className = "park_fee_tip">￥
						</span>
                        {fee == 0.0?0:fee}
                    </p>

                        <Time/>


                </div>
                <div className = "parkTip" style = {pstyle}>
                    <p style = {{"textOverflow":"ellipsis","width":"3.6rem","whiteSpace":"nowrap","overflow":"hidden"}}> {obj.name}</p>

                </div>
                <div className = "licenseNumber" style = {{"marginBottom":"0.3rem"}}>
                    <p style = {{"marginBottom":"0.2rem"}}>车牌号码
                        <span>{this.state.defaultcar}</span>
                    </p>

                    <p>空车位
                        <span>{obj.emptyparkplacecount<0?0:obj.emptyparkplacecount}</span>
                    </p>

                    <div className="clear"></div>
                </div>
                <div className = "applyTip">
                    {/*
                     {
                     this.state.numjst == 1?(<p>
                     <span ></span>
                     <span>我的钱包</span>
                     <span>(余额<b>{this.state.carmoney>0?this.state.carmoney:0.00}</b>元)</span>
                     <span className={this.state.itemstate == 1?"activeapply":"apply"} onClick = {this.mymoney.bind(this)} ref ="money"></span>
                     </p>):( <p style = {{"display":"none"}}>
                     <span ></span>
                     <span>我的钱包</span>
                     <span>(余额<b>{this.state.carmoney>0?this.state.carmoney:0.00}</b>元)</span>
                     <span className={this.state.itemstate ==1?"activeapply":"apply"} onClick = {this.mymoney.bind(this)} ref ="money"></span>
                     </p>)
                     }
                     {
                     this.state.numwx == 1?( <p>
                     <span></span>
                     <span>微信支付</span>
                     <span onClick = {this.mywx.bind(this)} className={this.state.itemstate ==2  ||  this.state.numjst !== 1 ?"activeapply":"apply"} ref = "wx"></span>
                     </p>):( <p style = {{"display":"none"}}>
                     <span></span>
                     <span>微信支付</span>
                     <span onClick = {this.mywx.bind(this)} className={this.state.itemstate ==2?"activeapply":"apply"} ref = "wx"></span>
                     </p>)
                     }

                     */}


                    <div className="clear"></div>
                </div>
                <div className = "payMent">
                    <p id = "order" className="order" style = {orderstyle} onClick = {this.pay.bind(this)}>立即缴费</p>
                </div>
                <div className = "delay">
                    缴费成功后车位将为您保持<b>{this.state.booktime}</b>分钟,请在<b>{this.state.booktime + this.state.overtime}</b>
                    分钟内入场.<span>订位成功后不能取消</span>
                </div>
                {rows}


            </section>
                <OpenCar key = "1"  carno = {this.state.car}/>
                <PayOrder display = {this.state.flag} totalmoney = {fee == 0.0?0:fee} carno = {this.state.car} orderno = {this.state.orderno} parkingname = {this.state.parkingname} booktime = {this.state.booktime} totaltime = {this.state.booktime + this.state.overtime}/>

            </div>
        )
    }
}

export {BookingOrder}

