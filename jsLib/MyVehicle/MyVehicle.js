/**
 * Created by hua on 2017/2/27.
 */
import {Component} from "react";
import jhtAjax from "../common/util/JHTAjax";
import {PopupTip} from "../myWallet/js/popupTip";
import {CarNoInput} from "../common/components/carNoInput";
import { Loading,operateMask } from "../common/components/Loading";
import { Nothing } from "../common/components/Nothing";
let arr = [];
let rows = [];
let inputcar = [];
// let aa = true;
class MyVehicle extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            items: [],
            poptip: 100,
            param:"",
            month:0,
            aa:true

        };
        this.state = this.stateObj;
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);

    }
    //设为默认
    SetDefault(e){
        let carid = e.target.parentNode.childNodes[0].id;
        let userid = e.target.parentNode.childNodes[1].id;
        this.getdefault(carid,userid);

    }
    //设置默认车辆
    getdefault(carid,userid){
        let that = this;
        let userId = userid;  //3f4cef3995e448d2816b5726db46280e
        let obj = {
            attributes:{
                USER_ID:userId,
                CARNO_ID:carid
            } };
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.base.defaultcarno",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    that.getData()

                    rows.push(<PopupTip key = "2" txt="设置默认车牌成功" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }
            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }
    //删除车辆
    CancelCar(e){
        let carid = e.target.parentNode.childNodes[0].id;
        let userid = e.target.parentNode.childNodes[1].id;
        let id = e.target.id;
       if(id.substr(id.length-1,id.length) == 1){
            rows.push(<PopupTip key = "9" txt="该车辆是月卡车辆，无法删除" cancelPopupTip={ this.cancelPopupTip }/>)
            this.updateContent();

        }else{
            this.Cancel(carid,userid)
        }


    }

    //删除车辆
    Cancel(carid,userid){

        let that = this;
        let userId = userid;  //3f4cef3995e448d2816b5726db46280e
        let  obj = {
            dataItems:[]
        }
        let tmp = {
            attributes:{
                userId:userId,
                carId:carid
            } };

        obj.dataItems.push(tmp);
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_BASE_DELVEHICLE",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0){
                    that.getData()
                    rows.push(<PopupTip key = "3" txt="删除成功" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }else{
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "4" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();

                    }

                }

            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );

    }


    componentWillMount(){
        this.getData();
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
        inputcar = [];
        arr = [];
    }


    //查询车辆列表
    getData(){
        let that  =this;
        //let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
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
                operateMask("hide")
                arr = [];
                if(data.resultcode == 0){
                    if (data  && data.dataitems && data.dataitems.length > 0) {

                        for (var i = 0; i < data.dataitems.length; i++) {
                            arr.push(data.dataitems[i]);

                        }
                    }
                    that.stateObj.items = arr;
                    that.setState(that.stateObj);

                    if(that.state.items && that.state.items.length>0){
                        document.getElementById("nocont").className = "hide";
                        document.getElementById("list").className = "list";

                    }else{
                        document.getElementById("nocont").className = " ";
                        document.getElementById("list").className = "hide";
                    }

                }else{
                    document.getElementById("nocont").className = " ";
                    document.getElementById("list").className = "hide";
                }

            } ,
            error:  function (error) {
                document.getElementById("nocont").className = " ";
                document.getElementById("list").className = "hide";
                console.log("ajax failure");
            }
        } );

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
            document.getElementById("carno").className = "";
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
          //  let userid = this.refs.car_no.id;
            let userid =  USERINFO.USER.USER_ID;
            this.getvehicleNo(vehicleNo,userid)

        }else if(vehicleNo !=="" && vehicleNo.length == 8){
            document.getElementById("carno").className = "";
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
            console.log(vehicleNo);
           // let userid = this.refs.car_no.id;
            let userid =  USERINFO.USER.USER_ID;
            this.getvehicleNo(vehicleNo,userid)

        }

    }

    //添加车辆
    getvehicleNo(vehicleNo,userid){
        let that = this;
        let userId = userid;  //3f4cef3995e448d2816b5726db46280e
        let  obj = {
            dataItems:[]
        }
        let tmp = {
            attributes:{
                userId:userId,
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
                    that.getData()

                    rows.push(<PopupTip key = "5" txt="添加成功" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }else if(data.resultcode == 101){
                    rows.push(<PopupTip key = "6" txt="未注册，请求重新注册" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }else if(data.resultcode == 2270){
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "7" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                    }


                }else if(data.resultcode == 2232){
                    rows.push(<PopupTip key = "8" txt="亲，您已经绑定了本车牌号码的车辆！" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }else{
                    if(data.message !== ""){
                        rows.push(<PopupTip key = "9" txt={data.message} cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                    }else{
                        rows.push(<PopupTip key = "9" txt="添加车辆失败" cancelPopupTip={ that.cancelPopupTip }/>)
                        that.updateContent();
                    }
                }


            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }



    render(){
        let style = {"height":"1.48rem","paddingLeft":"0.2rem","marginTop":"0.4rem","backgroundColor":"#fff","position": "relative","borderBottom":"1px solid #d9d9d9","borderTop":"1px solid #d9d9d9"};
        let sp1default = {"display":"inlineBlock","marginRight":"0.2rem"};
        let sp1style = {"display":"inlineBlock","marginRight":"0.2rem"};
        let sp2default = {"display":"inlineBlock","fontSize":"0.4rem","color":"#80c02b","position": "absolute","top":"37%"};
        let sp2style = {"display":"inlineBlock","fontSize":"0.4rem","color":"#000","position": "absolute","top":"37%"};
        let sp3style = {"fontSize":"0.24rem", "color":"#959595","display":"inlineBlock","position": "absolute","bottom":"32%","right":"24%","border":"1px solid #80c02b","padding":"0.1rem"};
        let sp4style = {"fontSize":"0.24rem", "color":"#959595","display":"inlineBlock","position": "absolute","bottom":"32%","right":"5%","border":"1px solid #80c02b","padding":"0.1rem 0.3rem"};
        let sp5style = {"position":"absolute","top":"0.59rem","right":"3.3rem","color":"#fff","backgroundColor":"#ff6e0e","padding":" 0 0.1rem","lineHeight":"0.3rem","textAlign":"center","fontSize":"0.22rem"};
        let pstyle = {"position":"fixed","bottom":"0","left":"0","fontSize":"0.22rem","textAlign":"center","height":"1rem","lineHeight":"1rem","border":"2px dashed #80c02b","width":"92%","margin":"0 0.3rem"}
        let p4style = {"left":"42%","position":"absolute","top":"42%","background":"url(../images/month.png)","width":"0.26rem","height":"0.26rem","backgroundSize":"cover"};
       //let height =  window.innerHeight -100;
        let p6style = {"borderRadius":"5px","backgroundColor":"#80c02b","width":"91%","height":"0.9rem","lineHeight":"0.9rem","textAlign":"center","fontSize":"0.34rem","color":"#fff","position":"fixed","left":"0.3rem","bottom":"0.3rem"}
        let spanstyle = { "fontSize":"0.4rem","marginRight":"0.1rem"};

        return(
            <div>
                <div>
                    <Loading taskCount = "1"/>

                </div>
                <section  style = {{"top":"0","left":"0","zIndex":"0","backgroundColor":"#f0eff5","position":"relative","width":"100%","height":"100%"}} id = "list" className="list">
                    <div id = "carno" className="">
                        <ul style = {{"height":"9.6rem","overflow":"auto"}}>

                            {
                                this.stateObj.items.map((item,i)=>{


                                    return(
                                        <li style = {style} key = {`li-${i}`}>
                                            {
                                                item.attributes.is_default == 1?  ( <span style = {sp1default} id = {`${ item.attributes.car_id }`}><img src="../images/car.png" style = {{"width":"0.58rem","height":"0.46rem","marginTop": "0.5rem","backgroundSize":"cover"}}/></span>):( <span style = {sp1style} id = {`${ item.attributes.car_id }`}><img src="../images/car_1.png" alt="" style = {{"width":"0.58rem","height":"0.46rem","backgroundSize":"cover","marginTop": "0.5rem"}}/></span>)
                                            }
                                            {
                                                item.attributes.is_default == 1?( <span style = {sp2default} id = {`${ item.attributes.user_id }`} ref = "car_no">{item.attributes.car_no}</span>):( <span style = {sp2style} id = {`${ item.attributes.user_id }`} ref = "car_no">{item.attributes.car_no}</span>)
                                            }


                                            {
                                                item.attributes.is_monthcardcar == 1?(<span style = {p4style}></span>):(<span style = {{"display":"none"}}></span>)
                                            }

                                            <span style = {sp4style} onClick = {this.CancelCar.bind(this)} id = {`${Math.random()}-${item.attributes.is_monthcardcar}`}  >删除</span>


                                            {
                                                item.attributes.is_default == 1?(<span style = {sp5style}>默认</span>):(<span style = { sp3style}  onClick = {this.SetDefault.bind(this)}>设为默认</span>)
                                            }


                                        </li>
                                    )
                                })
                            }

                        </ul>

                    </div>

                </section>
                {rows}
                <div id = "nocont" className="hide">
                    <Nothing content="亲，没有查询到车辆哦"/>
                </div>
                <p onClick = {this.addcar.bind(this)} style = {p6style} > <span style = {spanstyle}>+</span><span >添加车辆</span></p>

                <div id = "inputcar">
                    <CarNoInput  key = "1" message="" before="" copemlt= {this.state.aa} handel = { this.handel.bind(this)}/>
                </div>



            </div>
        )
    }

}
export{ MyVehicle }
