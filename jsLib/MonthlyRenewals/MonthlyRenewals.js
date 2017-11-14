/**
 * Created by hua on 2017/2/27.
 */
import {Component} from "react";
import {Tip} from "./Tip";
import {AddCar} from "./addCar";
import {Link} from "react-router";
import { Loading,operateMask } from "../common/components/Loading";
let datalist = [],carno  = [],len;
let arr = [],arrs = [];
let rows = [];
class MonthlyRenewals extends Component{
    constructor() {
        super();

    }
    //续费记录
    monthlyhistory(e){
        let userId =  USERINFO.USER.USER_ID;
        let carNo = e.target.parentNode.childNodes[2].innerText;
        let parkName = e.target.parentNode.parentNode.childNodes[0].innerText;
      
       location.href = "../../../src/monthlyPayment/html/monthPayment.html?USER_ID="+userId+"&APP_TYPE="+ (USERINFO.APP.APP_TYPE ||"WX_JTC")
           +"&carNo="+carNo+"&parkName="+parkName + "&clientId="+ (USERINFO.USER.clientId) + "&TEL="+ (USERINFO.USER.TEL);
    }
    componentWillUnmount() {
        rows = [];    //重置模块全局变量rows，这样用户重新进入页面或者返回页面使得页面初始化时的rows的值为空
        datalist = [];
        carno  = [];
    }
    componentDidMount(){

        operateMask('hide');

    }
    render(){

        let listyle = {"margin":"0.5rem 3% 0","width":"94%","background":"url(../images/bg.png) no-repeat","position":"relative","height":"3rem","backgroundSize":"contain"};
        let p1style = {"overflow":"hidden","width":"3.6rem", "textOverflow":" ellipsis","whiteSpace":"nowrap","fontSize":"0.32rem","color":"#fff","position":"absolute","left":"0.2rem","top":"0.15rem","right":"0.2rem"}

        let p2style = {"fontSize":"0.28rem","color":"#959595","position":"absolute","left":"0.2rem","top":"1rem"};
        let p3style = {"color":"#ff6e0e","fontSize":"0.32rem","position":"absolute","left":"0.2rem","top":"1.5rem"};

        let p4style = {"fontSize":"0.28rem","borderRadius":"5px","color":"#fff","position":"absolute","right":"0.2rem","top":"1.1rem","backgroundColor":"#f89d33","height":"0.7rem","lineHeight":"0.7rem","width":"1.5rem","textAlign":"center"}
        let sp2style = {"display":"inlineBlock","background":"url(../images/history.png)","backgroundSize":"cover","width":"0.24rem","height":"0.3rem","position":"absolute","left":"0.2rem","bottom":"0.3rem"};
        let sp3style = {"fontSize":"0.26rem","color":"#80c02b","position":"absolute","left":"0.5rem","bottom":"0.3rem"};
        let sp4style = {"fontSize":"0.26rem","color":"#959595","position":"absolute","right":"0.2rem","bottom":"0.3rem"};
        let p5style = {"position":"absolute","bottom":"0.9rem","borderBottom":"1px solid #959595","width":"100%"};
        let spanstyle = {"color":"#959595","fontSize":"0.26rem"};
       
        for(var i =0; i<this.props.data.dataitems.length; i++){

            if(this.props.data.dataitems[i].subitems && this.props.data.dataitems[i].subitems.length>0){
                arr.push(this.props.data.dataitems[i]);
                datalist.push(this.props.data.dataitems[i].subitems);

                len  = this.props.data.dataitems[i].subitems.length;
                carno.push(this.props.data.dataitems[i].attributes.car_no);

            }
        }


        return(
            <div>
                <div>
                    <Loading taskCount = "1"/>

                </div>

                <div>
                    <ul style = {{"height":"11rem","overflow":"auto"}}  >

                        {
                            len>0?(

                                <div>
                                    <div id = "cont">
                                        {
                                            datalist.map((item,i)=>{
                                 let mouthList = [];let moneyList = [];  let monthData = item[0].attributes.month_money;
                                                for(var key in monthData){
                                                    mouthList.push(key);
                                                    moneyList.push(monthData[key])
                                                }

                                                let pathdata = {
                                                    pathname : "/monthlyorder",
                                                    query : {
                                                        carno:arr[i].attributes.car_no,
                                                        allmoney:JSON.stringify( item[0].attributes.month_money),
                                                        enddate:(item[0].attributes.end_date).substring(0, 10),
                                                        monthmoney:moneyList[0],
                                                        areaid:item[0].attributes.area_id,
                                                        carid:item[0].attributes.card_id,
                                                        userid:arr[i].attributes.user_id,
                                                        mouthLong:mouthList[0]

                                                    }

                                                }
                                                let money = moneyList[0];
                           if((/^[+-]?[1-9]?[0-9]*\.[0-9]*$/).test(moneyList[0]) == false ){

                               money = moneyList[0]/mouthList[0];
                                                }else {
                                                    money = parseFloat(moneyList[0]).toFixed(2);
                                                    if(money == 0.0){
                                                        money = 0;
                                                    }else{
                                                        money = parseFloat(moneyList[0]).toFixed(2);
                                                        //money = money.substring(0,money.lastIndexOf('.')+2);
                                                    }

                                                }

                                                return(

                                                    <li style = {listyle}  key = {`li-${i}`}>

                                                        <p style = {p1style}>{item[0].attributes.park_name}</p>
                                                        <p style = {p2style}>有效期至{(item[0].attributes.end_date).substring(0, 10)}</p>
                                                        <p style = {p3style}><span style ={{}}></span>{money || 0}<span style={spanstyle}>元/月</span></p>
                                                        <Link to = {pathdata}><p style = {p4style}>去续费</p></Link>
                                                        <p style = {p5style}></p>
                                                        <p >
                                                            <span style = {sp2style}></span>
                                                            <span style = {sp3style} onClick = {this.monthlyhistory.bind(this)}>续费记录</span>

                                                            <span style = {sp4style}>{arr[i].attributes.car_no}</span>
                                                        </p>

                                                    </li>

                                                )})

                                        }
                                    </div>

                                    <Tip/>

                                </div>



                            ):(
                                <AddCar key = "1"/>
                            )

                        }


                    </ul>
                </div>



            </div>
        )
    }

}
export {MonthlyRenewals }
