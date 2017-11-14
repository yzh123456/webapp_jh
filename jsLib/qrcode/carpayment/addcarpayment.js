/**
 * Created by hua on 2017/4/11.
 */
import {Component} from "react";
import {CarNoInput} from "../../common/components/carNoInput";
import jhtAjax from "../../common/util/JHTAjax";
import {Loading,operateMask } from "../../common/components/Loading";
import  JHT  from "../../common/util/JHT";
let jht = new JHT();
import {CarTip} from "./cartip";
import $ from "../../common/jquery-3.1.1.min";
let rows = [];
/*import ThirdSDK from "../../common/util/ThirdSDK";
let thirdSDK = new ThirdSDK(['getLocation'],false);*/
let flag  = 0;
//没有用户或用户没有车辆的时候，执行此组建
class AddCarPayMent extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            poptip: 100,
            parkname:[],
            aa:true

        };
        this.state = this.stateObj;
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);

    }
    //添加车辆
    addcar(){
        document.getElementById("cover").className = "hide";
       this.setState({
            aa:false
        })

    }
    //拿到車牌
    handel(vehicleNo){
        flag = 1;
        if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID !== ""){
            window.sessionStorage.setItem("carno",vehicleNo);
        }else{
            window.localStorage.setItem("carno",vehicleNo);
        }
        this.props.handelcarno(vehicleNo,flag);

        if(vehicleNo !=="" && vehicleNo.length == 9 ){

            document.getElementById("addcontent").className = "";
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
            $("#1").css({background:"#9ADB43"});
            $("#1").siblings("._input").css({background:"#f0eff5"});
            $("#8").css({background:"-webkit-gradient(linear, 0% 0%, 0% 100%,from(#C0C6C2), to(#0CF24C))"})

            this.setState({aa:true});
            //let userId = window.localStorage.getItem("userid");


        }

    }
    //添加车辆

    componentWillUnmount(){
        rows = [];
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
    getparkid(id){
        console.log(id)
    }
    componentWillMount(){
        let that =this;
        if(!jht.urlParams().key){
            if(this.props.data.resultcode == 0){
                this.setState({
                    parkname:this.props.data.dataitems[0].subitems
                })

            }else{
                that.getTip();

            }
        }else{
            return false;
        }



    }
    //没有停车场---获取停车场
    getTip(){
        let that = this;
        //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;

        let obj = {
            dataItems: []
        };
        let sub ={
            attributes:{
                FUNCTION_NAME:"手机缴费"
            }
        };
        let subit = [];
        subit.push(sub);
        let tmp = {
            attributes: {
                USER_ID:userId,
                longitude : this.props.longitude,//longitude,//
                latitude :this.props.latitude,// latitude,//
                beforelongitude :this.props. longitude,//longitude,//
                beforelatitude :this.props.latitude,//latitude,//
                DISTANCE:3000,
                PAGE_SIZE:5,
                PAGE_INDEX:1,
                synch_signal: new Date().getTime() + ''
            },
            subItems:subit
        };

        obj.dataItems.push(tmp);
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.map.sy_getlocationquerypark",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            async: false,   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    if((that.props.data.resultcode !== 0) || (that.props.data.dataitems?(that.props.data.dataitems.length<0?true:false):true)){
                        that.stateObj.parkname = data.dataitems;
                        that.setState(that.stateObj);
                    }
                }else{
                    that.stateObj.parkname = "未找到停车场";
                    that.setState(that.stateObj);
                }

            },
            complete:function(data){

            },
            error:  function (error) {
                operateMask("hide")

            }
        } );

    }
    //根据停车场查订单
    getaddress(caraddress,businesser_code,park_code){
        this.props.address(caraddress,businesser_code,park_code);

    }
    componentDidMount(){
        operateMask("hide");

    }
    render(){

        let  sp5style  = {"top":"2.78rem","right":"2rem","position":"absolute","background":"url(./images/cars_click.png)","width":"0.35rem","height":"0.35rem","backgroundSize":"cover"};
        let  p3style = {"fontSize":"0.28rem","color":"#959595","margin":"0.2rem 0 0.3rem","paddingTop":"1.4rem"};
        let  divstyle ={"backgroundColor":"#9adb43"};
        let div1style ={"backgroundColor":"#fdffda","margin":"0.5rem 0.9rem 0","borderTopLeftRadius":"15px","borderTopRightRadius":"15px"};
        let p5style = {"height":"1.2rem","lineHeight":"1.2rem","textAlign":"center"};
        return(

            <div>

                <div id = "addcontent" className=" ">
                    <div style = {divstyle}>
                        <CarTip data = { this.state.parkname } getparkid  = {this.getparkid.bind(this)} retcode={this.props.data && this.props.data!==""?(this.props.data.dataitems.length>0?this.props.data.dataitems[0].attributes.retcode:undefined):undefined}
                                rescode={this.props.data.resultcode} park_name = {this.props.data && this.props.data!==""?(this.props.data.dataitems.length>0?this.props.data.dataitems[0].attributes.park_name:undefined):undefined} getaddress = {this.getaddress.bind(this)}/>
                        <div style = {div1style}>
                            <p style = {p3style}  onClick  = {this.addcar.bind(this)}>
                               <span style={{"marginLeft":"0.37rem","fontSize":"0.36rem"}}>请输入您的车牌</span>
                                <span style = {sp5style}></span>
                            </p>
                            <p style = {{"fontSize":"0"}}>><img src="./images/line.png" alt="" style = {{"width":"5rem","marginLeft":"0.37rem"}}/></p>
                            <p style = {p5style}>
                            </p>
                        </div>
                    </div>
                    {
                        this.props.data.resultcode == 0?(<div>
                            {
                                this.props.data.dataitems[0].attributes.retcode == "0"?(<p style = {{"height":"0.9rem","lineHeight":"0.9rem","width":"92%","textAlign":"center","color":"#fff","fontSize":"0.34rem","backgroundColor":"#80c02b","borderRadius":"5px","margin":"1.2rem 0.3rem"}}>去缴费</p>
                                ):(<p style = {{"height":"0.9rem","lineHeight":"0.9rem","width":"92%","textAlign":"center","color":"#fff","fontSize":"0.34rem","backgroundColor":"#c3c3c3","borderRadius":"5px","margin":"1.2rem 0.3rem"}}>去缴费</p>
                                )
                            }
                        </div> ):(<p style = {{"height":"0.9rem","lineHeight":"0.9rem","width":"92%","textAlign":"center","color":"#fff","fontSize":"0.34rem","backgroundColor":"#c3c3c3","borderRadius":"5px","margin":"1.2rem 0.3rem"}}>去缴费</p>)
                    }
                </div>
                {rows}
                <CarNoInput  key = "1" message="确定" before="" copemlt= {this.state.aa} handel = { this.handel.bind(this)}/>
            </div>
        )
    }
}
export { AddCarPayMent }