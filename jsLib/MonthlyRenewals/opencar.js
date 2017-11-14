/**
 * Created by hua on 2017/3/7.
 */
import {Component} from "react";
import {CarNoInput} from "../common/components/carNoInput";
import {PopupTip} from "../myWallet/js/popupTip";
import {Link} from "react-router";
import jhtAjax from "../common/util/JHTAjax";
let rows = [];
class OpenCar extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            param:"",
            poptip:100,
            aa:true

        };
        this.state = this.stateObj;
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);

    }

    cancel(){
        document.getElementById("cancel").className = "hide";
        document.getElementById("cancel2").className = "hide";
    }
    //去充值
    getmoney(){
        let carno =this.props.carno;
        location.href = "http://jstnetpay.jieshunpay.cn:50012/jstnetpay/wap/getWAPRequest.do?cardNo="+carno;
    }
    //再想想
    getcancel(){
        window.history.back();
    }
    //添加车辆
    addcar(){
        console.log("添加车辆");
        document.getElementById("cancel3").className = "hide";
        document.getElementById("confirmcar").className = "hide";

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
                        window.location.reload();
                    },500)

                }else{
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "4" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                        setTimeout(()=>{

                            window.location.href = document.referrer;
                        },500)
                    }else{
                        setTimeout(()=>{
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
        let carno = this.props.carno;
        if(carno && carno!==""){
            carno =carno.substr(15,carno.length)
        }

        let pstyle = {"transform":"rotate(-5deg)","bottom":"59%","left":"19%","color":"#fff","fontSize":"0.32rem","position":"absolute"}
        return(
            <div>
                <section id = "cancel" className="hide">
                    <div className = "coverlist" style = {{height: window.innerHeight+"px"}}></div>
                    <div className = "messagelist">
                        <p></p>
                        <p style  = {pstyle}>亲，您还没有开通钱包哦！</p>
                        <p></p>
                        <div>
                            <span onClick = {this.cancel.bind(this)}>再想想</span>
                            <span><Link to = "/monthlyorder/bindcar" style = {{"color":"#80c02b"}}>去开通</Link></span>
                        </div>
                    </div>


                </section>

                <section id = "cancel2" className="hide">
                    <div className = "coverlist" style = {{height: window.innerHeight}}></div>
                    <div className = "messagelist">
                        <p></p>
                        <p style  = {pstyle}>你尾号{carno}的捷顺卡余额不足</p>
                        <p></p>
                        <div>
                            <span onClick = {this.cancel.bind(this)}>知道了</span>
                            <span onClick = {this.getmoney.bind(this)}  style = {{"color":"#80c02b"}}>去充值</span>
                        </div>
                    </div>


                </section>

                <section id = "cancel3" className="hide">
                    <div className = "coverlist" style = {{height: window.innerHeight}}></div>
                    <div className = "messagelist">
                        <p></p>
                        <p style  = {pstyle}>您还没有添加车辆哦！</p>
                        <p></p>
                        <div>
                            <span onClick = {this.getcancel.bind(this)}>再想想</span>
                            <span  onClick = {this.addcar.bind(this)}>去添加</span>
                        </div>
                    </div>


                </section>
                <CarNoInput  key = "1" message="" before="" copemlt= {this.state.aa} handel = { this.handel.bind(this)}/>
                {rows}
            </div>

        )
    }

}
export { OpenCar }