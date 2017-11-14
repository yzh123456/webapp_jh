/**
 * Created by hua on 2017/4/10.
 */
import {Component} from "react";
import jhtAjax from "../../common/util/JHTAjax";
import {AddCarPayMent} from "./addcarpayment";
import {AddOrder} from "./addorder";
import {Advet} from "./advet";
import {Loading,operateMask } from "../../common/components/Loading";
import  JHT  from "../../common/util/JHT";
let userId;
let jht = new JHT();
let rows = [];
let list = [];
let arr = [];
let key;
let num = 0;
let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽港澳贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1,2}$/;
class CarPayMent extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            items: [],
            defaultcar:"",
            len:0,
            flag:0,
            businesser_code:"",
            park_code:"",
            tip:0,
            carstate:0     //0：初始化  1：有車輛  判断有无訂單 2 ：無車輛
        };
        this.state = this.stateObj;
        document.title = "车牌缴费";
        this.handelcarno = this.handelcarno.bind(this);
        this.handelcar = this.handelcar.bind(this);
        this.address = this.address.bind(this);

    }

    //输入车牌
    handelcarno(carno,flag){
       // num = 0;
        console.log(carno);
        let that =this;
        this.setState({
            defaultcar:carno
        });
        if(carno && carno!==""){
            this.setState({
                tip:1
            })
        }
        if(jht.urlParams().key && carno) {

                let businesser_code = jht.urlParams().key.split(",")[0];
                let park_code = jht.urlParams().key.split(",")[1];
                key = businesser_code + "," + park_code + "," + carno;
               that.getorder("", key, userId);

        }else{
            this.setState({
                flag:flag
            });
            if(window.location.href.indexOf("name") > -1 && window.location.href.indexOf("businesser_code") > -1 && window.location.href.indexOf("park_code") > -1){
                let  name = jht.urlParams().name;
                let  businesser_code = jht.urlParams().businesser_code;
                let park_code = jht.urlParams().park_code;

               /* if(window.sessionStorage.getItem("businesser_code") && window.sessionStorage.getItem("businesser_code")!==""){
                    businesser_code = window.sessionStorage.getItem("businesser_code");
                }else{
                    businesser_code = jht.urlParams().businesser_code;

                }
                if(window.sessionStorage.getItem("park_code") && window.sessionStorage.getItem("park_code")!==""){
                    park_code = window.sessionStorage.getItem("park_code");
                }else{
                    park_code = jht.urlParams().park_code;

                }*/
                let carno;
                if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                    if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==""){
                        that.setState({
                            defaultcar:window.sessionStorage.getItem("carno")
                        });
                        carno = window.sessionStorage.getItem("carno");
                    }
                }else{
                    that.setState({
                        defaultcar:window.localStorage.getItem("carno")
                    });

                    carno = window.localStorage.getItem("carno");
                }

                key  = businesser_code+","+park_code+","+carno;
                that.getorder(carno, key, userId);

            } else if(window.location.href.indexOf("parkName") > -1 && window.location.href.indexOf("keys") > -1){

                let carno;
                let businesser_code = jht.urlParams().keys.split(",")[0];
                let park_code = jht.urlParams().keys.split(",")[1];
               /* if(window.sessionStorage.getItem("businesser_code") && window.sessionStorage.getItem("businesser_code")!==""){
                    businesser_code = window.sessionStorage.getItem("businesser_code");
                }else{
                    businesser_code = jht.urlParams().keys.split(",")[0];
                }
                if(window.sessionStorage.getItem("park_code") && window.sessionStorage.getItem("park_code")!==""){
                    park_code = window.sessionStorage.getItem("park_code");
                }else{
                    park_code = jht.urlParams().keys.split(",")[1];
                }*/
                if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                    if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==""){
                        that.setState({
                            defaultcar:window.sessionStorage.getItem("carno")
                        });
                        carno = window.sessionStorage.getItem("carno");
                    }
                }else{
                    if(window.localStorage.getItem("carno") && window.localStorage.getItem("carno")!==""){
                        that.setState({
                            defaultcar:window.localStorage.getItem("carno")
                        });

                        carno = window.localStorage.getItem("carno");
                    }

                }

                key  = businesser_code+","+park_code+","+carno;
                that.getorder(carno, key, userId);

            }else{
                if(num == 1){
                    let  businesser_code = this.state.businesser_code;
                    let  park_code =  this.state.park_code;
                    let key = businesser_code +","+park_code+","+carno;
                    that.getorder("", key, userId);
                }else{
                    that.getorder(carno, key, userId);
                }
                return false;
            }

        }
        if(num == 1){
            let  businesser_code = this.state.businesser_code;
            let  park_code =  this.state.park_code;
            let key = businesser_code +","+park_code+","+carno;
            that.getorder("", key, userId);
        }else{
            that.getorder(carno, key, userId);
        }


    }
    //点击获取

    handelcar(carno,flag){
       // num = 0;
        let that =this;
        console.log(carno);
        this.setState({
            defaultcar:carno
        });
        operateMask("show");
        if(carno && carno!==""){
            this.setState({
                tip:1
            })
        }
        if( jht.urlParams().key ) {
                let businesser_code = jht.urlParams().key.split(",")[0];
                let park_code = jht.urlParams().key.split(",")[1];
                key = businesser_code + "," + park_code + "," + carno;
                that.getorder(carno, key, userId);

        }else{
            this.setState({
                flag:flag
            });

            if(window.location.href.indexOf("name") > -1 && window.location.href.indexOf("businesser_code") > -1 && window.location.href.indexOf("park_code") > -1){
                let  name = jht.urlParams().name;
                //let  businesser_code,park_code;
               /* if(window.sessionStorage.getItem("businesser_code") && window.sessionStorage.getItem("businesser_code")!==""){
                    businesser_code = window.sessionStorage.getItem("businesser_code");
                }else{
                    businesser_code= jht.urlParams().businesser_code;
                }
                if(window.sessionStorage.getItem("park_code") && window.sessionStorage.getItem("park_code")!==""){
                    park_code = window.sessionStorage.getItem("park_code");
                }else{
                    park_code= jht.urlParams().park_code;
                }*/
                let  businesser_code = jht.urlParams().businesser_code;
                let park_code = jht.urlParams().park_code;
                let carno;
                if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                    if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==""){
                        that.setState({
                            defaultcar:window.sessionStorage.getItem("carno")
                        });
                        carno = window.sessionStorage.getItem("carno");
                    }
                }else{
                    that.setState({
                        defaultcar:window.localStorage.getItem("carno")
                    });

                    carno = window.localStorage.getItem("carno");
                }

                key  = businesser_code+","+park_code+","+carno;
                that.getorder(carno, key, userId);

            }else if(window.location.href.indexOf("parkName") > -1 && window.location.href.indexOf("keys") > -1){

                let carno;
                let businesser_code = jht.urlParams().keys.split(",")[0];
                let park_code = jht.urlParams().keys.split(",")[1];

                /* if(window.sessionStorage.getItem("businesser_code") && window.sessionStorage.getItem("businesser_code")!==""){
                     businesser_code = window.sessionStorage.getItem("businesser_code");
                 }else{
                     businesser_code = jht.urlParams().keys.split(",")[0];
                 }
                 if(window.sessionStorage.getItem("park_code") && window.sessionStorage.getItem("park_code")!==""){
                     park_code = window.sessionStorage.getItem("park_code");
                 }else{
                     park_code = jht.urlParams().keys.split(",")[1];
                 }*/
                if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                    if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==""){
                        that.setState({
                            defaultcar:window.sessionStorage.getItem("carno")
                        });
                        carno = window.sessionStorage.getItem("carno");
                    }
                }else{
                    if(window.localStorage.getItem("carno") && window.localStorage.getItem("carno")!==""){
                        that.setState({
                            defaultcar:window.localStorage.getItem("carno")
                        });

                        carno = window.localStorage.getItem("carno");
                    }

                }

                key  = businesser_code+","+park_code+","+carno;
                that.getorder(carno, key, userId);
            }else{
                if(num == 1){
                    let  businesser_code = this.state.businesser_code;
                    let  park_code =  this.state.park_code;
                    let key = businesser_code +","+park_code+","+carno;
                    that.getorder("", key, userId);
                }else{
                    that.getorder(carno, key, userId);
                }
                return false;

            }

        }
        if(num == 1){
            let  businesser_code = this.state.businesser_code;
            let  park_code =  this.state.park_code;
            let key = businesser_code +","+park_code+","+carno;
            that.getorder("", key, userId);
        }else{
            that.getorder(carno, key, userId);
        }

    }
    //根据停车场查订单
    address(caraddress,businesser_code,park_code){
        document.getElementById("carAddress").innerText =  caraddress;
        let that =this;
        num = 1;

        if(document.getElementById("carno") !== "" && document.getElementById("carno") !== null){
            this.setState({
                defaultcar:document.getElementById("carno").innerText,
                businesser_code:businesser_code,
                park_code:park_code
            })
            key  = businesser_code+","+park_code+","+document.getElementById("carno").innerText;
            that.getorder(window.localStorage.getItem("carno"),key,userId);

        }else{
            return;

        }


    }
    componentDidMount(){
        userId  =  USERINFO.USER.USER_ID;
        let that = this;

        if(userId && userId !== ""){

            this.getDate(userId);
        }else{
                if( jht.urlParams().key ){
                    if(reg.test(jht.urlParams().key.split(",")[2] )){
                        that.stateObj.defaultcar = jht.urlParams().key.split(",")[2];
                        that.setState(that.stateObj);
                        key = jht.urlParams().key;
                        that.getorder("",key,userId);
                    }else{
                        let  businesser_code = jht.urlParams().key.split(",")[0];
                        let  park_code = jht.urlParams().key.split(",")[1];

                        if(window.localStorage.getItem("carno")){
                            that.stateObj.defaultcar = window.localStorage.getItem("carno");
                            that.setState(that.stateObj);
                            key  = businesser_code+","+park_code+","+that.stateObj.defaultcar;
                            that.getorder("",key,userId);

                        }else{
                            rows =[];
                            rows.push(<AddCarPayMent data = ""  handelcarno = {this.handelcarno}  longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude}  address = {this.address} key ={`data-${Math.random()}`} />)
                            this.setState({
                                carstate:6
                            });

                           /* key  = businesser_code+","+park_code+","+"车-AAAAAA";
                            that.getorder("",key,userId);*/
                        }


                    }

                }else{
                    if(window.localStorage.getItem("carno") && window.localStorage.getItem("carno") !== ""){
                        this.setState({
                            defaultcar:window.localStorage.getItem("carno")
                        });
                        that.getorder(window.localStorage.getItem("carno"),key,userId);
                    }else{

                        rows =[];
                        rows.push(<AddCarPayMent data = ""  handelcarno = {this.handelcarno}  longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude}  address = {this.address} key ={`data-${Math.random()}`} />)
                        this.setState({
                            carstate:7
                        });

                    }
                }
                if(window.location.href.indexOf("name") > -1 && window.location.href.indexOf("businesser_code") > -1 && window.location.href.indexOf("park_code") > -1){
                    let  name = jht.urlParams().name;
                    let  businesser_code = jht.urlParams().businesser_code;
                    let  park_code = jht.urlParams().park_code;
                    let carno;
                    if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                        that.setState({
                            defaultcar:  window.sessionStorage.getItem("carno")
                        });
                        carno = window.sessionStorage.getItem("carno")

                    }else{
                        that.setState({
                            defaultcar: window.localStorage.getItem("carno")
                        });

                        carno = window.localStorage.getItem("carno");
                    }
                    key  = businesser_code+","+park_code+","+carno;
                    that.getorder("",key,userId);
                }
            if(window.location.href.indexOf("parkName") > -1 && window.location.href.indexOf("keys") > -1 ){

                let  name = jht.urlParams().parkName;
                let carno;
                if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                    that.setState({
                        defaultcar: window.sessionStorage.getItem("carno")
                    });
                    carno = window.sessionStorage.getItem("carno");
                }else{
                    that.setState({
                        defaultcar:window.localStorage.getItem("carno")
                    });
                    carno = window.localStorage.getItem("carno");
                }
                key  = jht.urlParams().keys+","+carno;
                that.getorder("",key,userId);


            }


        }

    }
    //查询车辆
    getDate(userId){
        let that = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
        // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e

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
                    that.setState({
                        len:data.dataitems.length
                    });
                    if(data.dataitems && data.dataitems.length>0){   //有车辆
                        //判断车辆只显示6个
                        if(data.dataitems.length>6){

                            arr = data.dataitems.splice(0,6);
                            that.setState({
                                items:arr
                            })
                        }else{
                            that.setState({
                                items:data.dataitems
                            })
                        }
                        for (let i = 0; i < data.dataitems.length; i++){
                            list.push(data.dataitems[i]);
                            if(list[i].attributes.is_default == 1){
                                that.setState({
                                    defaultcar:data.dataitems[i].attributes.car_no
                                });

                                break;

                            }else{

                                that.setState({
                                    defaultcar:data.dataitems[0].attributes.car_no
                                })


                            }


                        }
                        //判断有没有缓存

                        if( jht.urlParams().key ){
                            if(reg.test(jht.urlParams().key.split(",")[2] ) && reg.test(jht.urlParams().key.split(",")[2]) !=="" && reg.test(jht.urlParams().key.split(",")[2]) !==null && reg.test(jht.urlParams().key.split(",")[2] )!==undefined){

                                that.setState({
                                    defaultcar:jht.urlParams().key.split(",")[2]
                                });
                                key = jht.urlParams().key;
                            }else{
                                let  businesser_code = jht.urlParams().key.split(",")[0];
                                let  park_code = jht.urlParams().key.split(",")[1];
                                if(that.state.len>0){
                                    key  = businesser_code+","+park_code+","+that.state.defaultcar

                                }else{
                                    if(window.sessionStorage.getItem("carno")){
                                        key  = businesser_code+","+park_code+","+window.sessionStorage.getItem("carno");
                                    }else{
                                        rows =[];
                                        rows.push(<AddCarPayMent data = ""  handelcarno = {that.handelcarno}  longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude}  address = {that.address} key ={`data-${Math.random()}`} />);
                                        that.setState({
                                            carstate:8
                                        });
                                    }


                                }

                            }

                        }
                        if(window.location.href.indexOf("name") > -1 && window.location.href.indexOf("businesser_code") > -1 && window.location.href.indexOf("park_code") > -1){
                            let  name = jht.urlParams().name;
                            let  businesser_code = jht.urlParams().businesser_code;
                            let  park_code = jht.urlParams().park_code;
                            let carno;
                            if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                                if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==""){
                                    that.setState({
                                        defaultcar:window.sessionStorage.getItem("carno")
                                    });
                                    carno = window.sessionStorage.getItem("carno");
                                }else if(that.state.len>0){
                                    carno =  that.state.defaultcar;
                                }
                            }else{
                                that.setState({
                                    defaultcar:window.localStorage.getItem("carno")
                                });

                                carno = window.localStorage.getItem("carno");
                            }

                            key  = businesser_code+","+park_code+","+carno;

                        }
                        if(window.location.href.indexOf("parkName") > -1 && window.location.href.indexOf("keys") > -1){

                            let carno;
                            if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                                if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==""){
                                    that.setState({
                                        defaultcar:window.sessionStorage.getItem("carno")
                                    });
                                    carno = window.sessionStorage.getItem("carno");
                                }else if(that.state.len>0){
                                    carno =  that.state.defaultcar;
                                }
                            }else{
                                if(window.localStorage.getItem("carno") && window.localStorage.getItem("carno")!==""){
                                    that.setState({
                                        defaultcar:window.localStorage.getItem("carno")
                                    });

                                    carno = window.localStorage.getItem("carno");
                                }

                            }

                            key  = jht.urlParams().keys+","+carno;

                        }


                        //在判断又无订单

                        that.getorder(that.state.defaultcar,key,userId);



                    }else{  // 没有车辆---引导去添加
                        operateMask("hide");
                        if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==null &&  window.sessionStorage.getItem("carno") !== ""){
                            that.setState({
                                defaultcar:window.sessionStorage.getItem("carno")
                            })

                        }
                        if( jht.urlParams().key ){
                            if(reg.test(jht.urlParams().key.split(",")[2] ) && reg.test(jht.urlParams().key.split(",")[2]) !=="" && reg.test(jht.urlParams().key.split(",")[2]) !==null && reg.test(jht.urlParams().key.split(",")[2] )!==undefined){

                                that.setState({
                                    defaultcar:jht.urlParams().key.split(",")[2]
                                });
                                key = jht.urlParams().key;
                            }else{
                                let  businesser_code = jht.urlParams().key.split(",")[0];
                                let  park_code = jht.urlParams().key.split(",")[1];
                                key  = businesser_code+","+park_code+","+that.state.defaultcar

                            }

                        }
                        if(window.location.href.indexOf("name") > -1 && window.location.href.indexOf("businesser_code") > -1 && window.location.href.indexOf("park_code") > -1){
                            let  name = jht.urlParams().name;
                            let  businesser_code = jht.urlParams().businesser_code;
                            let  park_code = jht.urlParams().park_code;
                            let carno;
                            if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                                that.setState({
                                    defaultcar: window.sessionStorage.getItem("carno")
                                });
                                carno = window.sessionStorage.getItem("carno");

                            }else{
                                that.setState({
                                    defaultcar:window.localStorage.getItem("carno")
                                });

                                carno = window.localStorage.getItem("carno");
                            }

                            key  = businesser_code+","+park_code+","+carno;

                        }
                        if(window.location.href.indexOf("parkName") > -1 && window.location.href.indexOf("keys") > -1){

                            let carno;
                            if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                                if(window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno")!==""){
                                    that.setState({
                                        defaultcar:window.sessionStorage.getItem("carno")
                                    });
                                    carno = window.sessionStorage.getItem("carno");
                                }
                            }else{
                                if(window.localStorage.getItem("carno") && window.localStorage.getItem("carno")!==""){
                                    that.setState({
                                        defaultcar:window.localStorage.getItem("carno")
                                    });

                                    carno = window.localStorage.getItem("carno");
                                }

                            }

                            key  = jht.urlParams().keys+","+carno;

                        }
                        if( that.state.defaultcar || window.localStorage.getItem("carno") ){
                            that.getorder(that.state.defaultcar || window.localStorage.getItem("carno") ,key,userId);
                        }else {
                            rows =[];
                            rows.push(<AddCarPayMent data = ""  handelcarno = {that.handelcarno}  longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude}  address = {that.address} key ={`data-${Math.random()}`} />);
                            that.setState({
                                carstate:5
                            });
                        }

                    }

                }
            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        });

    }
    //判断有无订单
    getorder(defaultcar,key,userId){

        operateMask("show");
        let that = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
        // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let  obj = {
            attributes:{
               USER_ID:userId || "",
                QRKEY:(jht.urlParams().key  || (num !== 0 ) || (window.location.href.indexOf("name")> -1  ) || (window.location.href.indexOf("parkName") > -1 )  )? key:decodeURI(defaultcar),
                ORDER_TYPE:jht.urlParams().key || (num !== 0 ) || (window.location.href.indexOf("name")> -1  )  || (window.location.href.indexOf("parkName") > -1)?'VNP':'VCP',
                BEFORE_LONGITUDE:window.USERINFO.USER.longitude || 0,//'113.366856',
                BEFORE_LATITUDE: window.USERINFO.USER.latitude || 0 //latitude// '22.521415'

            } };

        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.order.queryord",
                attributes:obj.attributes,
            },
            type: 'post',
            dataType: 'json',
            timeOut:12000,
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {  //判断有无订单
                operateMask("hide")
                console.log(data);
                /*if( data.resultcode =="0" &&
                    obj.attributes.ORDER_TYPE == "VCP"  &&
                    data.dataitems[0].attributes.retcode != "0" && //查到不订单
                    /!*data.dataitems[0].attributes.retcode != "10" && //无需缴费
                    data.dataitems[0].attributes.retcode != "9" && //已交费
                    data.dataitems[0].attributes.retcode != "11" && //无需缴费
                    data.dataitems[0].attributes.retcode != "12" && //无需缴费
                    data.dataitems[0].attributes.retcode != "13" && //无需缴费
                    data.dataitems[0].attributes.retcode != "5" && //月卡车*!/
                    data.dataitems[0].subitems && data.dataitems[0].subitems.length > 0 &&
                    data.dataitems[0].subitems[0].attributes && data.dataitems[0].subitems[0].attributes.businesser_code &&
                    defaultcar && data.dataitems[0].subitems[0].attributes.park_code
                ){
                        let businesser_code = data.dataitems[0].subitems[0].attributes.businesser_code;
                        let park_code = data.dataitems[0].subitems[0].attributes.park_code;
                        let key = businesser_code + "," + park_code + "," + defaultcar;
                        that.getorder("", key, userId,true);
                       return;
                }*/
                if(data.dataitems && data.dataitems.length>0){
                    if(data.dataitems[0].attributes.retcode && data.dataitems[0].attributes.retcode == "0"){
                        window.sessionStorage.setItem("parkid",data.dataitems[0].attributes.park_id);
                        window.sessionStorage.setItem("businesser_code",data.dataitems[0].attributes.businesser_code);
                        window.sessionStorage.setItem("park_code", data.dataitems[0].attributes.park_code);

                    }

                }

                rows =[];
                if(that.state.len > 0){  //有车辆s
                    rows.push(<AddOrder data  = {data} tip = {that.state.tip} defaultcar = {that.state.defaultcar} longitude = {window.USERINFO.USER.longitude || 0} latitude = {window.USERINFO.USER.latitude || 0}  items = {that.state.items} handelcarno = {that.handelcarno} handelcar = {that.handelcar}  address = {that.address} key ={`item-${Math.random()}`}/>)
                    that.setState({
                        carstate:2
                    })

                }else{  //没有车辆
                    if(that.state.tip == 0 && (jht.urlParams().USER_ID == "") && (window.localStorage.getItem("carno") == undefined || window.localStorage.getItem("carno") ==null)&& (window.sessionStorage.getItem("carno") == undefined || window.sessionStorage.getItem("carno") ==null) && (  window.location.href.indexOf("key") == -1 || (jht.urlParams().key?(reg.test(jht.urlParams().key.split(",").length>1?(jht.urlParams().key.split(",")[2]):(""))== false):(true))) ){
                        rows.push(<AddCarPayMent data = {data}  handelcarno = {that.handelcarno}  longitude = {window.USERINFO.USER.longitude || 0} latitude = {window.USERINFO.USER.latitude || 0}  address = {that.address} key ={`data-${Math.random()}`} />)
                        that.setState({
                            carstate:1
                        })
                    }else if(that.state.tip !== 0 ||
                        ( window.localStorage.getItem("carno") && window.localStorage.getItem("carno") !=null )  ||
                        ( window.sessionStorage.getItem("carno") && window.sessionStorage.getItem("carno") !=null ) ||
                        ( jht.urlParams().key && reg.test(jht.urlParams().key.split(",")[2] )) ){
                        rows.push(<AddOrder data  = {data} tip = {that.state.tip} defaultcar = {  that.state.defaultcar } longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude|| 0}    items = {that.state.items}  handelcarno = {that.handelcarno}  handelcar = {that.handelcar} address = {that.address} key ={`item-${Math.random()}`}/>)
                        that.setState({
                            carstate:3
                        })

                    }else {
                        rows.push(<AddCarPayMent data = {data}  handelcarno = {that.handelcarno}  longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude|| 0}  address = {that.address} key ={`data-${Math.random()}`} />)
                        that.setState({
                            carstate:4
                        })
                    }

               /* if(that.state.len < 0){
                    rows.push(<AddCarPayMent data = {data}  handelcarno = {that.handelcarno}  longitude = {longitude} latitude = {latitude}  address = {that.address} key ={`data-${Math.random()}`} />)
                    that.setState({
                        carstate:6
                    })
                }*/

                }
            } ,
            complete : function(XMLHttpRequest,status){

                if(XMLHttpRequest=='timeout'){
                    rows = [];
                   // ajaxTimeoutTest.abort(); //取消请求
                    if(that.state.len>0){
                        rows.push(<AddOrder data  = {""} tip = {that.state.tip} defaultcar = {  that.state.defaultcar } longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude|| 0}    items = {that.state.items}  handelcarno = {that.handelcarno}  handelcar = {that.handelcar} address = {that.address} key ={`item-${Math.random()}`}/>)
                        that.setState({
                            carstate:6
                        })
                        operateMask("hide");
                    }else{
                        rows.push(<AddCarPayMent data = ""  handelcarno = {that.handelcarno}  longitude = {window.USERINFO.USER.longitude|| 0} latitude = {window.USERINFO.USER.latitude}  address = {that.address} key ={`data-${Math.random()}`} />)
                        this.setState({
                            carstate:7
                        });
                    }

                }

            },
            error:  function (error) {
                operateMask("hide");
                console.log("ajax failure");
            }
        } );

    }
    //消除组建
    componentWillUnmount() {
        rows = [];    //重置模块全局变量rows，这样用户重新进入页面或者返回页面使得页面初始化时的rows的值为空
        list = [];
    }
    render(){
        //alert(1)

        return(
            <div>
                <div>
                    <Loading taskCount = "1"/>
                </div>
                <Advet/>

                {rows}
            </div>
        )
    }

}
export { CarPayMent }