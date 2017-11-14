/**
 * Created by hua on 2017/2/28.
 */
import {Component} from "react";
import {AddMonthly} from "./addMonthly";
import {MonthlyRenewals} from "./MonthlyRenewals";
import {AddCar} from "./AddCar";
import jhtAjax from "../common/util/JHTAjax";
let rows = [];
class Monthly extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            items: [],
            MonthlyState: 0   //社区状态: 0:初始化  1:未开通  2:已开通、有月卡车 3：已开通、无月卡车
        };
        this.state = this.stateObj;

    }
    componentDidMount(){
        this.getDate();

    }
    //验证是否开通社区
    getDate(){
        let _this = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
        //let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let  obj = {
            dataItems:[]
        }
        let tmp = {
            attributes:{
                userId:userId
            } };

        obj.dataItems.push(tmp);
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_APP_MYCOMMUNITY",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    if(data && data.dataitems &&  data.dataitems.length>0){

                        // 判断有无月卡车
                        _this.getcarlist();

                    }else{
                        rows.push(<AddMonthly key = "1"/>)
                        _this.setState({
                            MonthlyState: 1 //没有开通社区
                        });

                    }
                }


            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    //查询车辆信息
    getcarlist(){
        let that = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
        //let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
       let userId =  USERINFO.USER.USER_ID;
        let  obj = {
            attributes:{
                USER_ID:userId
            } };

        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.sys.sy_getcarlist",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    if(data && data.dataitems &&  data.dataitems.length>0 ){
                        //开通社区、有月卡车
                        //月卡列表
                        rows.push(<MonthlyRenewals key = "2" data = {data}/>)
                        that.setState({
                            MonthlyState: 2
                        });


                    }else{
                        //开通社区、无月卡车
                        rows.push(<AddCar key = "3"/>)
                        that.setState({
                            MonthlyState: 3
                        });
                    }

                }
            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    componentWillUnmount() {
        rows = [];    //重置模块全局变量rows，这样用户重新进入页面或者返回页面使得页面初始化时的rows的值为空
    }


    render(){
        
        return(
            <div>
                {rows}
            </div>
        )

    }

}
export{ Monthly}