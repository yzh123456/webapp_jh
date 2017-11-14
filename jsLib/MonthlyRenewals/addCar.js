/**
 * Created by hua on 2017/2/28.
 */
import {Component} from "react";
import {Nothing} from "../common/components/Nothing";
import {CarNoInput} from "../common/components/carNoInput";
import jhtAjax from "../common/util/JHTAjax";
import {PopupTip} from "../myWallet/js/popupTip";
let rows = [];
let arr = [];
class AddCar extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            param:"",
            items:[],
            poptip: 100,
            aa:true

        };
        this.state = this.stateObj;

    }
    //再想想
    cancel(){
        this.refs.sec.className = "hide";
    }
    //添加车辆
    getcar(){
        console.log("添加车辆");
        this.setState({aa:false});
        document.getElementById("sec").className = "hide";

    }
    //拿到车牌
    handel(vehicleNo){
        this.setState({
            param: vehicleNo

        });
        if(vehicleNo !=="" && vehicleNo.length == 9 ){
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
            //let userId = window.localStorage.getItem("userid");
            this.getvehicleNo(vehicleNo)

        }else if(vehicleNo !=="" && vehicleNo.length == 8){
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
            this.setState({aa:true});
            //let userId = window.localStorage.getItem("userid");
            this.getvehicleNo(vehicleNo);

        }

    }
    //添加车辆
    getvehicleNo(vehicleNo){
        let that = this;
        // let userId = '3f4cef3995e448d2816b5726db46280e';
       let userId =  USERINFO.USER.USER_ID;
        let  obj = {
            dataItems:[]
        }
        let tmp = {
            attributes:{
                userId:userId,//1e34989003864373b0fda47f2f9bc50d
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
                    rows.push(<PopupTip key = "1" txt="添加成功" cancelPopupTip={ that.cancelPopupTip }/>)

                    that.updateContent();
                    setInterval(()=>{
                       window.location.href = document.referrer;
                    },500)

                }else{
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "2" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)

                        that.updateContent();
                        setInterval(()=>{
                            window.location.href = document.referrer;
                        },500)

                    }else{
                        setInterval(()=>{
                            window.location.href = document.referrer;
                        },500)
                    }

                }

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }

   /* //查询车辆列表
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
                            rows.push(<PopupTip key = "3" txt="添加成功" cancelPopupTip={ that.cancelPopupTip }/>)
                            that.updateContent();
                            setInterval(()=>{
                                location.reload();
                            },3000)

                        }else{
                            rows.push(<PopupTip key = "4" txt="该车辆不是月卡车" cancelPopupTip={ that.cancelPopupTip }/>)
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
        inputcar = [];
        arr = [];
    }
    render(){
        let div1style = {"width":"100%","height":"100%","position":"fixed","top":"0","zIndex":"1000","background":"#000","opacity":"0.7"};
        let div2style = {"zIndex":"999999","marginTop":"-2.6rem","marginRight":"0.7rem","marginLeft":"0.7rem","borderRadius":"10px","backgroundColor":"#fff","position":"fixed","top":"50%","width":"81%"}
        let pstyle = {"height":"2.36rem","background":"url(../images/car.png)","width":"6.075rem","backgroundSize":"cover"};
        let ulstyle = {"borderTop":"1px solid #80c02b","display":"flex","justifyContent":"center","alignItems":"center"};
        let li1style = {"borderRight":"1px solid #80c02b","color":"#222","padding":"0.3rem 0","justifyContent":"center","display":"flex","fontSize":"0.34rem","flex":"1"}
        let li2style = {"color":"#80c02b","padding":"0.3rem 0","justifyContent":"center","display":"flex","fontSize":"0.34rem","flex":"1"};
        let p1style = {"borderRadius":"5px","backgroundColor":"#80c02b","width":"91%","height":"0.9rem","lineHeight":"0.9rem","textAlign":"center","fontSize":"0.34rem","color":"#fff","position":"fixed","left":"0.3rem","bottom":"0.3rem"}
        let spanstyle = { "fontSize":"0.4rem","marginRight":"0.1rem"}
        return(
            <div>
                <div id = "cont" className="">
                <Nothing content="亲，没有查询到月卡车辆哦"/>
                    <p  style = {p1style} onClick = {this.getcar.bind(this)} className=""> <span style = {spanstyle}>+</span><span >添加月卡车辆</span></p>
                <section ref = "sec" id ="sec" className=" ">
                    <div style = {div1style}></div>
                    <div style = {div2style}>
                        <p style = {pstyle}></p>
                        <ul style = {ulstyle}>
                            <li style = {li1style} onClick = {this.cancel.bind(this)}>再想想</li>
                            <li style = {li2style} onClick = {this.getcar.bind(this)}>去添加</li>
                        </ul>
                    </div>

                </section>

                </div>
                {rows}
                <CarNoInput  key = "1" message="" before="" copemlt= {this.state.aa} handel = { this.handel.bind(this)}/>

            </div>
        )
    }
}
export { AddCar }
