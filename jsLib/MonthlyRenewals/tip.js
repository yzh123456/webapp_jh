/**
 * Created by hua on 2017/2/27.
 */
import {Component} from "react";
import {CarNoInput} from "../common/components/carNoInput";
import jhtAjax from "../common/util/JHTAjax";
import {PopupTip} from "../myWallet/js/popupTip";
let rows = [];
let  arr = [];
class Tip extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            param:"",
            poptip: 100,
            aa:true

        };
        this.state = this.stateObj;

    }

    //添加车辆
    addcar(){
        console.log("添加车辆");
        this.setState({aa:false});

    }
    //拿到车牌
    handel(vehicleNo){
        this.setState({
            param: vehicleNo

        });
        if(vehicleNo !=="" && vehicleNo.length == 9){
           
            document.getElementById("1").innerText = "";
            document.getElementById("2").innerText = "";
            document.getElementById("3").innerText = "";
            document.getElementById("4").innerText = "";
            document.getElementById("5").innerText = "";
            document.getElementById("6").innerText = "";
            document.getElementById("7").innerText = "";
            document.getElementById("8").innerText = "";

            $("#1").addClass("active").siblings("._input").removeClass("active");
            $("#9").removeClass("hide").siblings("div").addClass("hide");
            $("#1").css({background:"#9ADB43"});
            $("#1").siblings("._input").css({background:"#f0eff5"});
            $("#8").css({background:"-webkit-gradient(linear, 0% 0%, 0% 100%,from(#C0C6C2), to(#0CF24C))"})

            this.setState({aa:true});
            console.log(vehicleNo);
            let userId =  USERINFO.USER.USER_ID;
            this.getvehicleNo(vehicleNo,userId)

        }else if(vehicleNo !=="" && vehicleNo.length == 8){

            document.getElementById("1").innerText = "";
            document.getElementById("2").innerText = "";
            document.getElementById("3").innerText = "";
            document.getElementById("4").innerText = "";
            document.getElementById("5").innerText = "";
            document.getElementById("6").innerText = "";
            document.getElementById("7").innerText = "";
            document.getElementById("8").innerText = "";
            document.getElementById("car").className = "";
            $("#1").addClass("active").siblings("._input").removeClass("active");
            $("#9").removeClass("hide").siblings("div").addClass("hide");
            this.setState({aa:true});
            let userId =  USERINFO.USER.USER_ID;
            this.getvehicleNo(vehicleNo,userId);

        }

    }
    //添加车辆
    getvehicleNo(vehicleNo,userId){
        let that = this;
        // let userId = userId;  //3f4cef3995e448d2816b5726db46280e
        let  obj = {
            dataItems:[]
        };

        let tmp = {
            attributes:{
                userId:userId,
                // unionid:"userId:1e34989003864373b0fda47f2f9bc50d",
                carNo:vehicleNo
            } };

        obj.dataItems.push(tmp);
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_BASE_ADDVEHICLE",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    rows.push(<PopupTip key = "4" txt="添加成功" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();
                    setTimeout(()=>{
                        window.location.href = document.referrer;
                    },300)

                }else{
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "4" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                        setTimeout(()=>{
                            window.location.href = document.referrer;
                        },300)
                    }else{
                        setTimeout(()=>{
                            window.location.href = document.referrer;
                        },300)
                    }

                }

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    /*//查询车辆列表
    getData(){
        let that  =this;
        //let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
            } };
        jhtAjax( {
            /!* url: XMPPSERVER,*!/
            data: {
                serviceId:"ac.sys.sy_getcarlist",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /!*async: false,*!/   /!*不传值默认异步调用*!/
            success: function (data) {
                console.log(data);
                arr = [];
                if (data  && data.dataitems && data.dataitems.length > 0) {

                    for (var i = 0; i < data.dataitems.length; i++) {
                        if(data.dataitems[i].attributes.is_monthcardcar == 1){
                            rows.push(<PopupTip key = "1" txt="添加成功" cancelPopupTip={ that.cancelPopupTip }/>)
                            that.updateContent();
                            setInterval(()=>{
                                location.reload();
                            },3000)

                        }else{
                            rows.push(<PopupTip key = "2" txt="该车辆不是月卡车" cancelPopupTip={ that.cancelPopupTip }/>)
                            that.updateContent();
                            setInterval(()=>{
                                location.reload();
                            },3000)
                        }
                        arr.push(data.dataitems[i]);

                    }
                }
                that.stateObj.items = arr;
                that.setState(that.stateObj);

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );

    }*/
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
        arr  = [];
    }

    render(){
        let pstyle = {"borderRadius":"5px","backgroundColor":"#80c02b","width":"91%","height":"0.9rem","lineHeight":"0.9rem","textAlign":"center","fontSize":"0.34rem","color":"#fff","position":"fixed","left":"0.3rem","bottom":"0.3rem"}
        let spanstyle = { "fontSize":"0.4rem","marginRight":"0.1rem"}
        return(
            <div>
                <div id = "car" className=" ">
                    <p onClick = {this.addcar.bind(this)} style = {pstyle} id = "dis" className=""> <span style = {spanstyle}>+</span><span >添加月卡车辆</span></p>
                    {rows}
                </div>

                <CarNoInput  key = "1" message="" before="" copemlt= {this.state.aa} handel = { this.handel.bind(this)}/>
            </div>
        )
    }

}
export{Tip}