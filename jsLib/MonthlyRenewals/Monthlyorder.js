/**
 * Created by hua on 2017/3/1.
 */
import {Component} from "react";
import {MonthCover} from "./monthcover";
import {OpenCar} from "./opencar";
import jhtAjax from "../common/util/JHTAjax";
import {PayOrder} from "./payorder";
import {WXGETPAYURL} from"../common/util/Enum";
import { Loading,operateMask } from "../common/components/Loading";
import {PopupTip} from "../myWallet/js/popupTip";
let arr = [];
let arrs  = [];
let  rows = [];
let carno,enddate,monthmoney,month,total;
class MonthlyOrder extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            monthly:this.props.location.query.mouthLong,
            carmoney:"",
            car:"",
            totalfee:"",
            date:"",
            flag:false,
            itemstate:1,    //  1-钱包  2--微信   3--支付宝
            numwx:0,
            numjst:0,
            orderno:"",
            WX_URL:"",
            poptip:100,
            onemoney:""
        };
        this.state = this.stateObj;

    }

    //月份的选择
    chosemonth(){

        document.getElementById("cover").className = " ";

    }
    handel(money,monthlist){
        monthmoney =  this.props.location.query.monthmoney;
        enddate =  this.props.location.query.enddate;
        /*let year = new Date(enddate).getFullYear();
        let monthlist = new Date(enddate).getMonth()+parseInt(month)+1;
        let day  = new Date(enddate).getDate();
        monthlist = (monthlist<10 ? "0"+monthlist:monthlist);
        if(monthlist>12 ){
            year++;
            monthlist -= 12;
            monthlist = (monthlist<10 ? "0"+monthlist:monthlist);

        }
        let  eDate = (year.toString()+'-'+monthlist.toString()+"-"+day.toString());

        console.log( eDate)*/
        this.getTime(enddate,monthlist);

        this.setState({
            monthly:monthlist,
            totalfee:money,
            onemoney:money/monthlist,
            date:this.getTime(enddate,monthlist)
        });



        document.getElementById("confirmcar").className = " ";
        document.getElementById("cover").className = "hide";
        // document.getElementById("getmonth").innerText = month;

    }
    getTime(enddate,monthlist){
        let s=enddate.split("-");
        let yy=parseInt(s[0]);
        var mm=parseInt(s[1]-1);
        var dd=parseInt(s[2]);


        let statuMounth = parseInt(s[1]);
        let statuYear = parseInt(s[0]);
        // var new_year = year;  //取当前的年份
        let new_month = statuMounth++;//取下一个月的第一天，方便计算（最后一天不固定）
        if(statuMounth>12)      //如果当前大于12月，则年份转到下一年
        {
            new_month -=12;    //月份减
            statuYear++;      //年份增
        }
        let new_date = new Date(statuYear,new_month,1);        //取当年当月中的第一天
        let lastDate = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
        let dt=new Date(yy,mm,dd);
        // dt.setMonth(dt.getMonth()+parseInt(monthlist));
        // if( (dt.getYear()*12+dt.getMonth()) > (yy*12+mm +parseInt(monthlist) ) )
        // {
        //     dt=new Date(dt.getYear(),dt.getMonth(),0);
        // }
        mm = mm+parseInt(monthlist);
        if (mm > 11)
        {
            //y = parseInt(y + (m-12) / 12);
            yy = parseInt(yy + mm / 12);
            mm = mm % 12;
        }

        let year = yy;
        let month = mm+1;
        let days = dt.getDate();

        if(dd ==lastDate ){
            let month2 = month;
            let year2 = year;
            // var new_year = year;  //取当前的年份
            let new_month2 = month2++;//取下一个月的第一天，方便计算（最后一天不固定）
            if(month2>12)      //如果当前大于12月，则年份转到下一年
            {
                new_month2 -=12;    //月份减
                year2++;      //年份增
            }
            let new_date2 = new Date(year2,new_month2,1);        //取当年当月中的第一天
            days = (new Date(new_date2.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
        }

        if(month<10){
            month = "0"+month
        }
        if(days<10){
            days = "0"+days
        }

        let eDate = year+"-"+month+"-"+days;
        return eDate;
    }
    componentWillMount(){
        carno =  this.props.location.query.carno;
        enddate =  this.props.location.query.enddate;
        monthmoney =  this.props.location.query.monthmoney;
        let userid =  this.props.location.query.userid;
        let carid =  this.props.location.query.carid;
        let areaid = this.props.location.query.areaid;
        //let stratedate = this.props.location.query.stratedate;


      /*  let year = new Date(enddate).getFullYear();
        let monthlist = new Date(enddate).getMonth()+2;
        let day  = new Date(enddate).getDate();
        monthlist = (monthlist<10 ? "0"+monthlist:monthlist);
        if(monthlist>12 ){
            year++;
            monthlist -= 12;
            monthlist = (monthlist<10 ? "0"+monthlist:monthlist);

        }
        if(JSON.stringify(day).length<2){
           day = "0"+day;
        }
        let  eDate = (year.toString()+'-'+monthlist.toString()+"-"+day.toString());
*/
        this.getTime(enddate,(this.props.location.query.mouthLong));
        let eDate = this.getTime(enddate,(this.props.location.query.mouthLong));
        this.setState({
            date:eDate
        });


        month = this.props.location.query.mouthLong;
        total =this.props.location.query.monthmoney;
        monthmoney = total/month;
        console.log("monthmoney "+monthmoney);
        this.stateObj.totalfee = total;
        this.stateObj.onemoney = monthmoney;
        this.setState(this.stateObj);
        this.getDatelist(userid,areaid,carid,enddate,eDate,month,total);
        this.getcarinfo();



    }
    /*componentWillMount() {

    }*/

    //查询卡信息
    getcarinfo(){
        //查询卡通状态
        //1e34989003864373b0fda47f2f9bc50d
        //let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
         let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId
            } };


        //发送ajax请求
        let that = this;
        jhtAjax( {
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
    //生成订单
    getDatelist(userid,areaid,carid,stratedate,endate,month,all){
        let that = this;
        //let userId = "1e34989003864373b0fda47f2f9bc50d";//开通id
        let userId = userid;  //3f4cef3995e448d2816b5726db46280e
        let  obj = {
            dataItems:[]
        }
        let tmp = {
            attributes:{
                userId:userId,
                areaId:areaid,
                cardId:carid,
                startTime:stratedate,
                endTime:endate,
                month:month == ""?1:month,
                totalPrice:all == ""?total:all
            }
        }
        obj.dataItems.push(tmp);

        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_ORDER_DELAYGENERATE",
                dataItems:JSON.stringify(obj.dataItems)
            },
            type: 'post',
            dataType: 'json',
            timeOut:12000,
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                operateMask("hide");
                if(data.resultcode == 0){
                    that.stateObj.orderno = data.dataitems[0].attributes.orderno;
                   that.setState(that.stateObj)
                    console.log(that.state.orderno)

                  /* if(data.dataitems[0].subitems && data.dataitems[0].subitems.length>0 ){
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
                     */
                    if(data.dataitems.length>0 && data.dataitems[0].attributes.totalfee){
                        that.setState({
                            totalfee:data.dataitems[0].attributes.totalfee
                        });
                    }

                    /*if( that.state.numjst !== 1 ){
                        that.setState({
                            itemstate:2
                        })
                    }*/
                }else{
                    document.getElementById("topay").style.backgroundColor = "#959595";
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "1" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();

                    }else{
                        rows.push(<PopupTip key = "1" txt="订单支付失败，请稍后重试" cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                    }
                }

            } ,
            complete:function(data){
                operateMask('hide');
            },
            error:  function (error) {
                operateMask('hide');
                console.log("ajax failure");
            }
        } );

    }
    //生成微信支付订单
    getlist(userid,areaid,carid,stratedate,endate,month,all,eDate){
        let that = this;
        //let userId = '1e34989003864373b0fda47f2f9bc50d';  //开通id
         let userId = userid;  //3f4cef3995e448d2816b5726db46280e
        let  obj = {
            dataItems:[]
        }
        let tmp = {
            attributes:{
                userId:userId,
                areaId:areaid,
                cardId:carid,
                startTime:stratedate,
                endTime:endate == ""?eDate:endate,
                month:month == ""?1:month,
                totalPrice:all == ""?total:all
            }
        }
        obj.dataItems.push(tmp);

        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_ORDER_DELAYGENERATE",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            timeOut:12000,
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);

                if(data.resultcode == 0){


                    that.setState({
                        orderno:data.dataitems[0].attributes.orderno
                    })
                    console.log(that.state.orderno)


                   /* if(data.dataitems[0].subitems && data.dataitems[0].subitems.length>0 ){
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

                            that.payWX(that.state.orderno);

                        }
                    }

                    if( that.state.numjst !== 1 ){
                        that.setState({
                            itemstate:2
                        })
                    }*/
                    that.payWX(that.state.orderno);

                    if(data.dataitems.length>0 && data.dataitems[0].attributes.totalfee){
                        that.setState({
                            totalfee:data.dataitems[0].attributes.totalfee
                        });
                    }

                }else{
                    document.getElementById("topay").style.backgroundColor = "#959595";
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "1" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();

                    }else{
                        rows.push(<PopupTip key = "1" txt="订单支付失败，请稍后重试" cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                    }
                }
            } ,

            error:  function (error) {
                console.log("ajax failure");

            }
        } );

    }
    //支付
    pay(){
        if( document.getElementById("topay").style.backgroundColor == "rgb(149, 149, 149)"){
            return;
        }
        let userid =  this.props.location.query.userid;
        let carid =  this.props.location.query.carid;
        let areaid = this.props.location.query.areaid;
        //let stratedate = this.props.location.query.stratedate;
        enddate =  this.props.location.query.enddate;
        /*let year = new Date(enddate).getFullYear();
        let monthlist = new Date(enddate).getMonth()+2;
        let day  = new Date(enddate).getDate();
        monthlist = (monthlist<10 ? "0"+monthlist:monthlist);
        if(monthlist>12 ){
            year++;
            monthlist -= 12;
            monthlist = (monthlist<10 ? "0"+monthlist:monthlist);

        }
        let  eDate = (year.toString()+'-'+monthlist.toString()+"-"+day.toString());
   //*/
        this.getTime(enddate,(this.props.location.query.mouthLong));
        let eDate = this.getTime(enddate,(this.props.location.query.mouthLong));
        //我的钱包
        /*if(this.state.itemstate == 1){
            this.getcarinfo();
            //没有绑定卡号
            if(this.state.car == undefined  || this.state.car == "" ){
                document.getElementById("cancel").className = " ";

            }else{
                //绑定卡号，比较卡的余额 --余额不足
                if(parseInt(this.state.totalfee)>parseInt(this.state.carmoney)){
                    document.getElementById("cancel2").className = " ";

                }else{//余额足 --去支付

                    this.setState({flag:true})
                }

            }
        }else if(this.state.itemstate == 2){  //微信支付

            let year = new Date(enddate).getFullYear();
            let monthlist = new Date(enddate).getMonth()+2;
            let day  = new Date(enddate).getDate();
            monthlist = (monthlist<10 ? "0"+monthlist:monthlist);
            if(monthlist>12 ){
                year++;
                monthlist -= 12;
                monthlist = (monthlist<10 ? "0"+monthlist:monthlist);

            }
            let  eDate = (year.toString()+'-'+monthlist.toString()+"-"+day.toString());

            this.getlist(userid,areaid,carid,stratedate,this.state.date,this.state.monthly,this.state.totalfee,eDate);

        }*/
        this.getlist(userid,areaid,carid,enddate,this.state.date,this.state.monthly,this.state.totalfee,eDate)
    }

    payWX(orderno){

        let WX_URL;
        let _this = this;
        let unionid = USERINFO.USER.USER_ID;
        jhtAjax({

           //url : "http://jhtestcms.jslife.net/jspsn/getPayUrl.servlet?type=WX",
            url:WXGETPAYURL+"?type=WX",
            dataType : 'text',
            type:'post',
            asycn:false,
            success : function(data) {
                console.log(data)
               WX_URL = data;

            window.location.href = WX_URL+orderno;

            }
        });



    }

    /*//钱包
    jst() {
        this.setState({
            itemstate: 1
        });
    }

    //微信
    wx(){
        this.setState({
            itemstate:2
        });
    }*/
    /*
     * 取消弹出提示框
     * */
    cancelPopupTip() {
        rows = [];
        document.getElementById("addtip").className = "hide";
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
        let divstyle = {"borderTop":"1px solid #ccc","borderBottom":"1px solid #ccc","marginBottom":"0.2rem"}
        let p1style = {"paddingLeft":"0.2rem","fontSize":"0.28rem","borderBottom":"1px solid #eee","position":"relative","height":"0.8rem","lineHeight":"0.8rem","backgroundColor":"#fff"};
        let p2style = {"paddingLeft":"0.2rem","fontSize":"0.28rem","position":"relative","height":"0.7rem","lineHeight":"0.7rem","backgroundColor":"#fff"};
        let span1style = {"position":"absolute","color":"#222"};
        let span2style = {"position":"absolute","color":"#959595","right":"0.2rem"}
        let span3style = {"width":"0.34rem","height":"0.18rem","background":"url(../images/up.png)","backgroundSize":"cover","position":"absolute","right":"0.2rem","top":"0.3rem"}
        let span4style = {"position":"absolute","color":"#80c02b","right":"0.8rem"}
        let span5style = {"position":"absolute","color":"#ff6e0e","right":"0.2rem"}
        let span6style = {"color":"#959595"}
        let p3style = {"marginLeft":"0.2rem","fontSize":"0.22rem","color":"#959595","marginBottom":"0.2rem"}
        let icon1style = {"top":"0.16rem","width":"0.5rem","height":"0.4rem","background":"url(../images/wollet.png)","backgroundSize":"cover","position":"absolute"};
        let icon4style = { "top":"0.16rem","width":"0.5rem","height":"0.4rem","background":"url(../images/chat.png)","backgroundSize":"cover","position":"absolute"};
        let icon5style = {"top":"0.16rem","width":"0.5rem","height":"0.4rem","background":"url(../images/zhifubao.png)","backgroundSize":"cover","position":"absolute"};
        let p4style = {"width":"100%","lineHeight":"1rem","position":"fixed","bottom":"0","left":"0"}
        let sp1style = {"width":"62%","backgroundColor":"#fff","paddingLeft":"0.2rem","fontSize":"0.28rem","color":"#959595"};
        let sp2style = {"width":"35%","backgroundColor":"#f89d33","fontSize":"0.28rem","color":"#fff","textAlign":"center"};

        carno =  this.props.location.query.carno;
        enddate =  this.props.location.query.enddate;
        monthmoney =  this.props.location.query.monthmoney;

        let allmoney = this.props.location.query.allmoney;

      /*  let mouthList = [];let moneyList = [];
        for(var key in allmoney){
            mouthList.push(key);
            moneyList.push(allmoney[key])
        }
*/

       /* let year = new Date(enddate).getFullYear();
        let monthlist = new Date(enddate).getMonth()+2;
        let day  = new Date(enddate).getDate();
        monthlist = (monthlist<10 ? "0"+monthlist:monthlist);
        if(monthlist>12 ){
            year++;
            monthlist -= 12;
            monthlist = (monthlist<10 ? "0"+monthlist:monthlist);

        }
        let  eDate = (year.toString()+'-'+monthlist.toString()+"-"+day.toString());
*/
        this.getTime(enddate,(this.props.location.query.mouthLong));
        let eDate = this.getTime(enddate,(this.props.location.query.mouthLong));
        let money;
        if(this.state.totalfee){
        if((/^[+-]?[1-9]?[0-9]*\.[0-9]*$/).test(this.state.totalfee) == false ){
            money = this.state.totalfee;
        }else {
            money = parseFloat(this.state.totalfee).toFixed(2);
            //money = money.substring(0,money.lastIndexOf('.')+2);

            if(money == 0.0){
                money = 0;
            }else{
                money = parseFloat(this.state.totalfee).toFixed(2);
               //money = money.substring(0,money.lastIndexOf('.')+2);
            }

            }
        }else{
            money = 0;
        }
        let onemoney;
        if(this.state.onemoney){
            if((/^[+-]?[1-9]?[0-9]*\.[0-9]*$/).test(this.state.onemoney) == false ){ //整数
                onemoney = this.state.onemoney;
                console.log("onemoney "+onemoney)
            }else {
                onemoney = parseFloat(this.state.onemoney).toFixed(2);
                //onemoney = onemoney.substring(0,onemoney.lastIndexOf('.')+2);
                console.log("onemoney2 "+onemoney)
                if(onemoney == 0.0){
                    onemoney = 0;
                }else{
                    onemoney = parseFloat(this.state.onemoney).toFixed(2);
                    //onemoney = onemoney.substring(0,onemoney.lastIndexOf('.')+2);
                }

            }
        }else {
            onemoney = 0;
        }


        return(
            <div>
                <div>
                    <Loading taskCount = "1"/>

                </div>
                <div id = "confirmcar" className=" ">
                    <div style = {divstyle}>
                        <p style = {p1style}>
                            <span style = {span1style}>车牌号码</span>
                            <span style ={span2style}>{carno}</span>
                        </p>
                        <p style = {p2style}>
                            <span style = {span1style}>有效期至</span>
                            <span style ={span2style}>{enddate}</span>
                        </p>
                    </div>
                    <div style = {divstyle}>
                        <p style = {p1style} onClick = {this.chosemonth.bind(this)} >
                            <span style = {span1style} onClick = {this.chosemonth.bind(this)}>续费月数</span>
                            <span style ={span4style} onClick = {this.chosemonth.bind(this)} id = "getmonth"><span id  = "number">{this.state.monthly}</span>个月</span>
                            <span style ={span3style} onClick = {this.chosemonth.bind(this)}></span>
                        </p>
                        <p style = {p2style}>
                            <span style = {span1style}>续后有效期至</span>
                            <span style = {span2style}>{this.state.date  || eDate }</span>
                        </p>
                    </div>
                    <div style = {divstyle}>
                        <p style = {p1style}>
                            <span style = {span1style}>月均单价</span>
                            <span style ={span5style}>￥{ onemoney || money } <span style ={span6style}>/月</span></span>
                        </p>
                        <p style = {p2style}>
                            <span style = {span1style}>需支付</span>
                            <span style ={span5style}>￥{money}</span>
                        </p>
                    </div>
                    {

                   /* <p style={p3style}>选择支付方式</p>
                    <div style = {divstyle}>
                        {

                            this.state.numjst == 1?(<p style = {p1style}>
                                <span style = {icon1style}></span>
                                <span style = {{"position":"absolute","left":"0.8rem"}}>我的钱包(余额 : <span style = {{"color":"#ef6623"}}>{this.state.carmoney>0?this.state.carmoney:0.00}</span>元) </span>
                            <span  onClick = {this.jst.bind(this)} ref = "
                                " className={this.state.itemstate == 1?"check":"icon"}></span>
                            </p>):(<p style = {{"display":"none"}}>
                                <span style = {icon1style}></span>
                                <span style = {{"position":"absolute","left":"0.8rem"}}>我的钱包(余额 : <span style = {{"color":"#ef6623"}}>{this.state.carmoney>0?this.state.carmoney:0.00}</span>元) </span>
                            <span  onClick = {this.jst.bind(this)} ref = "
                                " className={this.state.itemstate == 1?"check":"icon"}></span>
                            </p>)

                        }

                        {
                            this.state.numwx == 1?(<p style = {p1style}>
                                <span style = {icon4style}></span>
                                <span style = {{"position":"absolute","left":"0.8rem"}}>微信支付 </span>
                                <span  onClick = {this.wx.bind(this)} ref = "wx" className={this.state.itemstate == 2  ||  this.state.numjst !== 1 ?"check":"icon"}></span>
                            </p>):(  <p style = {{"display":"none"}}>
                                <span style = {icon4style}></span>
                                <span style = {{"position":"absolute","left":"0.8rem"}}>微信支付 </span>
                                <span  onClick = {this.wx.bind(this)} ref = "wx" className={this.state.itemstate == 2?"check":"icon"}></span>
                            </p>)
                        }


                    </div>*/
                    }
                    <p style = {p4style}>
                    <span style = {sp1style}>
                        应缴总额：
                        <span style = {{"color":"#ef6623"}}>{money}</span>
                        元
                    </span>
                        <span style = {sp2style} onClick = {this.pay.bind(this)} id = "topay">立即支付</span>
                    </p>


                </div>
                <div className = "hide" id = "cover">
                    <MonthCover handel = {this.handel.bind(this)} allmoney = {this.props.location.query.allmoney}/>
                </div>

                <OpenCar key = "1" carno = {this.state.car}/>

                <PayOrder display = {this.state.flag} totalmoney = {money} carno = {this.state.car} orderno = {this.state.orderno}/>
                {rows}
            </div>

        )
    }

}
export {MonthlyOrder}

