/**
 * Created by hua on 2017/4/18.
 */
import {Component} from "react";
import {OrderCover} from "./ordercover";
import {Link} from "react-router";
import  JHT  from "../../common/util/JHT";
import jhtAjax from "../../common/util/JHTAjax";
let jht = new JHT();
let name = "";
let cartip =0;
class CarTip extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            car: "",
            show:true,
            tip:0,
            data:this.props.data,
            display:true,
            LocationName:( !jht.urlParams().key && this.props.rescode == 0 && this.props.retcode !== undefined && this.props.data.length>0?this.props.data[0].attributes.park_name:"")  //定位的停车场
        };
        this.state = this.stateObj;
        console.log(this.props);

    }
    //接收车场
    handelcar(caraddress,parkid,businesser_code,park_code){

        console.log(caraddress);
        cartip = 1;
        this.setState({
            LocationName:caraddress,
            display:true
        });

        this.props.getaddress(caraddress,businesser_code,park_code)

        this.props.getparkid(parkid,businesser_code,park_code);


    }
    //切换车场
    getcover(){

        if(document.getElementById("icon").style.transform == "rotate(0deg)"){
            document.getElementById("icon").style.transform = "rotate(180deg)";
            this.setState({
                car:document.getElementById("carAddress").innerText,
                display:false
            })
        }else if(document.getElementById("icon").style.transform == "rotate(180deg)"){
            document.getElementById("icon").style.transform = "rotate(0deg)";
            this.setState({
                car:document.getElementById("carAddress").innerText,
                display:true
            })

        }


    }

    componentDidMount(){

        //查询扫码支付的参数
        if( jht.urlParams().key ){
            this.getkey();
        }else {
            /*if (window.sessionStorage.getItem("parkid") && window.sessionStorage.getItem("parkid") !== "" && document.getElementById("parkid") !== null) {
                this.props.getparkid(window.sessionStorage.getItem("parkid"));
            }*/

            if (jht.urlParams().name && jht.urlParams().name !== "" &&
                jht.urlParams().name !== null && jht.urlParams().name !== undefined) {
                //console.log(jht.urlParams().name)  test code
                name = jht.urlParams().name;
            }

            if (window.location.href.indexOf("parkName") > -1) { //从缴费页面返回
                window.sessionStorage.setItem("parkid",jht.urlParams().keys.split(",")[2]);
                window.sessionStorage.setItem("businesser_code",jht.urlParams().keys.split(",")[0]);
                window.sessionStorage.setItem("park_code",jht.urlParams().keys.split(",")[1]);
                if (cartip == 0) {
                    if (this.props.retcode == "0") {   //成功

                        document.getElementById("carAddress").innerText = jht.getStrSub(this.props.park_name);

                    } else {  //失败
                        if (jht.urlParams().parkName && jht.urlParams().parkName !== "") {
                            document.getElementById("carAddress").innerText = jht.getStrSub(jht.urlParams().parkName);

                        } else {
                            document.getElementById("carAddress").innerText = jht.getStrSub(window.sessionStorage.getItem("carAddress"));
                        }
                    }
                } else {

                    if (this.props.retcode == "0") {
                        document.getElementById("carAddress").innerText = jht.getStrSub(this.props.park_name);

                    } else {
                        if (window.sessionStorage.getItem("carAddress") !== "" && window.sessionStorage.getItem("carAddress") !== null) {
                            document.getElementById("carAddress").innerText = jht.getStrSub(window.sessionStorage.getItem("carAddress"));

                        }
                    }

                }



            } else if (window.location.href.indexOf("name") > -1) {//确定是否是从详情页面返回
                let  park_id = jht.urlParams().park_id;
                let  businesser_code = jht.urlParams().businesser_code;
                let  park_code = jht.urlParams().park_code;
                window.sessionStorage.setItem("parkid",park_id);
                window.sessionStorage.setItem("businesser_code",businesser_code);
                window.sessionStorage.setItem("park_code",park_code);
                if (cartip == 0) {
                    if (this.props.retcode == "0") {   //成功

                        document.getElementById("carAddress").innerText = jht.getStrSub(this.props.park_name);

                    } else {  //失败
                        if (name !== "") {
                            document.getElementById("carAddress").innerText = jht.getStrSub(name);

                        } else {
                            document.getElementById("carAddress").innerText = jht.getStrSub(window.sessionStorage.getItem("carAddress"));
                        }
                    }
                } else {

                    if (this.props.retcode == "0") {
                        document.getElementById("carAddress").innerText = jht.getStrSub(this.props.park_name);

                    } else {
                        if (window.sessionStorage.getItem("carAddress") !== "" && window.sessionStorage.getItem("carAddress") !== null) {
                            document.getElementById("carAddress").innerText = jht.getStrSub(window.sessionStorage.getItem("carAddress"));

                        }
                    }

                }

            }else{  //不是从详情页面返回

                if(this.props.rescode == 0){
                    if(this.props.retcode == "0"){
                        document.getElementById("carAddress").innerText = jht.getStrSub(this.props.park_name);

                    }else{
                        if( window.sessionStorage.getItem("carAddress") && window.sessionStorage.getItem("carAddress")!=="" && document.getElementById("carAddress") !== null){
                            document.getElementById("carAddress").innerText = jht.getStrSub(window.sessionStorage.getItem("carAddress"));

                        }else{
                            document.getElementById("carAddress").innerText = jht.getStrSub(this.props.data[0].attributes.park_name);
                        }
                    }

                }else{
                    if( window.sessionStorage.getItem("carAddress") && window.sessionStorage.getItem("carAddress")!=="" && document.getElementById("carAddress") !== null){
                        document.getElementById("carAddress").innerText = jht.getStrSub(window.sessionStorage.getItem("carAddress"));

                    }else{
                        if(this.props.data.length>0){
                            document.getElementById("carAddress").innerText = jht.getStrSub(this.props.data[0].attributes.name);

                        }else{
                            document.getElementById("carAddress").innerText = "未找到停车场";

                        }

                    }
                }
            }

        }

     }

    //查询扫码支付的参数
    getkey(){

        jhtAjax({
            url: jht.basePath().cloudURL +"/queryParkInfoServlet.servlet",
            data: {
                parkCode:jht.urlParams().key.split(",")[1]
            },
            type: 'post',
            dataType : 'json',
            success: function (data) {
                console.log(data);
                //alert(JSON.stringify(data))
                if(data && data.parkName){
                    document.getElementById("carAddress").innerText =  data.parkName;
                    window.sessionStorage.setItem("parkid",data.id);
                    window.sessionStorage.setItem("businesser_code",jht.urlParams().key.split(",")[0]);
                    window.sessionStorage.setItem("park_code",data.parkCode);
                }

            },
            complete:function(data){
                if(data && data.parkName){
                    document.getElementById("carAddress").innerText =  data.parkName;

                }

            },
            error: function (error) {
                console.log("ajax failure");
            }
        });
    }
    //设置缓存
    carno(){
        if(document.getElementById("carno") !== null){

            if(USERINFO.USER.USER_ID && USERINFO.USER.USER_ID!==""){
                window.sessionStorage.setItem("carno",document.getElementById("carno").innerText)

            }else{
                window.localStorage.setItem("carno",document.getElementById("carno").innerText)

            }
        }


    }
    render(){
        let  p1style = {"backgroundColor":"#8BC341","width":"100%","height":"0.9rem","fontSize":"0.32rem","color":"#f0eff5","position":"relative","left":"0","top":"0"}
        let  sp1style = {"top":"0.3rem","left":"0.3rem","position":"absolute","background":"url(./images/park.png)","width":"0.3rem","height":"0.41rem","backgroundSize":"cover"}
        let  sp2style = {"width":"70%","padding":"0.3rem 0 0 0.76rem","height":"0.6rem"};
        let  sp3style = {"top":"0.4rem","right":"1.2rem","position":"absolute","background":"url(./images/dow.png)  no-repeat","width":"0.4rem","height":"0.2rem","backgroundSize":"cover","transform":"rotate(0deg)"}
        let  sp4style = {"top":"0.3rem","right":"0.3rem","position":"absolute","background":"url(./images/pay_book.png)","width":"0.4rem","height":"0.4rem","backgroundSize":"cover"}
        let fn="true";

        let pathdata = {
            pathname: "/search",
            query: {
                text: "停车场",
                fn:fn,
                from:"carPayment"
            }
        };
        console.log(this.props)
        return(
            <div>
               {
                   this.props.rescode == 0?(
                       <div>
                           {
                               this.props.retcode !== "0"?( <p style = {p1style}>
                                   {
                                       jht.urlParams().key?(<span>
                            <span style = {{"height":"0.6rem","padding":"0.3rem 0px 0px 0.76rem"}}  id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                           </span>):(<span style ={{"display":"block"}}><span style = {sp1style}></span>
                            <span style = {sp2style} onClick = {this.getcover.bind(this)} id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                            <span style = {sp3style} onClick = {this.getcover.bind(this)} id = "icon"></span>
                            <Link to = {pathdata}><span style = {sp4style} onClick = {this.carno.bind(this)}></span></Link></span>)
                                   }


                               </p>):(
                                   <div>
                                       {
                                           jht.urlParams().key?(<p style = {p1style}>

                                               <span style = {sp2style} id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                                           </p>):(<p style = {p1style}>

                                               <span style = {sp2style} id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                                               <Link to = {pathdata}><span style = {sp4style} onClick = {this.carno.bind(this)}></span></Link>
                                           </p>)
                                       }
                                   </div>
                                   )
                           }

                       </div>
                   ):(
                       <div>
                           {
                               this.props.retcode == undefined?( <div>
                                   {
                                       jht.urlParams().key?(<p style = {p1style}>
                                           <span style = {sp2style} onClick = {this.getcover.bind(this)} id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                                       </p>):(<p style = {p1style}>
                                           <span style = {sp1style}></span>
                                           <span style = {sp2style} onClick = {this.getcover.bind(this)} id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                                           <span style = {sp3style} onClick = {this.getcover.bind(this)} id = "icon"></span>
                                           <Link to = {pathdata}><span style = {sp4style} onClick = {this.carno.bind(this)}></span></Link>
                                       </p>)
                                   }
                               </div>
                                   ):( <div>
                                    {
                                       jht.urlParams().key?(<p style = {p1style}>
                                           <span style = {sp2style} onClick = {this.getcover.bind(this)} id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                                       </p>):( <p style = {p1style}>
                                           <span style = {sp1style}></span>
                                           <span style = {sp2style} onClick = {this.getcover.bind(this)} id = "carAddress">{jht.getStrSub(this.state.LocationName)}</span>
                                           <span style = {sp3style} onClick = {this.getcover.bind(this)} id = "icon"></span>
                                           <Link to = {pathdata}><span style = {sp4style} onClick = {this.carno.bind(this)}></span></Link>
                                       </p>)
                                   }
                                 </div>
                                  )
                           }

                       </div>
                   )
               }

                <OrderCover display = {this.state.display} data = {this.state.data} car = {this.state.car} handelcar = {this.handelcar.bind(this)}/>
            </div>

        )
    }
}
export {CarTip}