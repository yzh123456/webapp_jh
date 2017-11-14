/**
 * Created by hua on 2017/4/19.
 */
import {Component} from "react";
import jhtAjax from "../../common/util/JHTAjax";
import { Loading,operateMask } from "../../common/components/Loading";
import { Nothing } from "../../common/components/Nothing";
import  JHT  from "../../common/util/JHT";
let jht = new JHT();
let arr = [];
class VagueCar extends Component{
    constructor(...args){
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            items:[]
        };
        this.state = this.stateObj;

    }
    componentWillMount(){
        this.getDate();

    }
    componentWillUnmount(){
        arr = [];
    }
    //去支付
    topay(item){
        let tel;
        if(window.USERINFO.USER.TEL == null || window.USERINFO.USER.TEL == undefined || window.USERINFO.USER.TEL == "null"|| window.USERINFO.USER.TEL == "undefined" ){
            tel = ""
        }else{
            tel = window.USERINFO.USER.TEL;
        }
        let userid = USERINFO.USER.USER_ID;
        let businesser_code = this.props.location.query.code;
        let  parkcode = this.props.location.query.parkcode;
        let carno = item.attributes.carno;
        let str = encodeURIComponent(businesser_code+","+parkcode+","+carno);

        window.location.href = jht.basePath().cloudURL+"/qrcode/qrcodeorder.html?key="+str+"&USER_ID="+userid+"&APP_TYPE=WX_JTC"+tel+"&clientId="+window.USERINFO.USER.clientId;

    }
    //模糊车牌查询
    getDate(){

        let that = this;
        //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let  obj = {
            dataItems:[]
        };
        let tmp = {
            attributes:{
                userId:userId || window.USERINFO.USER.clientId,//1e34989003864373b0fda47f2f9bc50d
                // unionid:"userId:1e34989003864373b0fda47f2f9bc50d",
                carNo:this.props.location.query.carNo,
                parkId : this.props.location.query.parkId,
                userType : "APP",
                synch_signal: new Date().getTime() + ''
            } };

        obj.dataItems.push(tmp);
        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_BASE_SIMILARVEHICLE",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                operateMask("hide")
                arr  = [];
                if(data.resultcode == 0){
                    if(data.dataitems && data.dataitems.length>0){
                        for (let i = 0; i < data.dataitems.length; i++) {
                            arr.push(data.dataitems[i]);
                        }
                    }
                    that.setState({
                        items:arr
                    });
                    if(that.state.items && that.state.items.length>0){
                        document.getElementById("nocont").className = "hide";
                        document.getElementById("vaguecar").className = "vaguecar";

                    }else{
                        document.getElementById("nocont").className = " ";
                        document.getElementById("vaguecar").className = "hide";
                    }

                }else {
                    document.getElementById("vaguecar").className = "hide";
                    document.getElementById("nocont").className = " ";
                }

            } ,
            complete:function(data){
                operateMask('hide');
            },
            error:  function (error) {
                operateMask("hide");
                console.log("ajax failure");
            }
        } );
    }
    //点击查看大图
    getbigimg(){

        if(document.getElementById("bigimg").style.width == "20%"){
            document.getElementById("bigimg").style.width = "100%";
            document.getElementById("bigimg").style.height = "100%";
            document.getElementById("bigimg").style.zIndex = "100000";
            document.getElementById("bigimg").style.position = "absolute";
        }else if(document.getElementById("bigimg").style.width == "100%"){
            document.getElementById("bigimg").style.width = "20%";
            document.getElementById("bigimg").style.height = "11.8%";
            document.getElementById("bigimg").style.float = "left";
            document.getElementById("bigimg").style.overflow = "hidden";
        }


    }

    render(){
        let listyle = {"height":"1.48rem","lineHeight":"1.48rem","margin":"0.3rem","border":"1px solid #dbdbdb"}
       let p1style = {"fontSize":"0.32rem","color":"#222","textAlign":"center","position":"absolute","left":"35%","top":"-0.2rem"}
        let p2style = {"fontSize":"0.28rem","color":"#959595","textAlign":"center","position":"absolute","left":"28%","top":"0.2rem"}
        let div1style = {"zIndex":"1","width":"100%","height":window.innerHeight+"px","backgroundColor":"#000","opacity":"0.7","position":"absolute","top":"1rem"};
        return(
            <div>
                <div>
                    <Loading taskCount = "1"/>

                </div>
                <div id = "vaguecar" className="vaguecar">
                <p style ={{"margin":"0.3rem 0.3rem 0","fontSize":"0.28rem","color":"#959595"}}>车辆信息以图片信息显示为主</p>
                <ul>
                    {
                        this.state.items.map((item,i)=>{
                            return(
                                <li style ={listyle} key = {`li-${i}`} >
                                    {
                                        item.attributes.enterpicurl == ""?( <div><img src="./images/pic_normal.png" alt="" style ={{"width":"20%","float":"left","height":"73px"}} id ="bigimg"/></div>
                                        ):( <div onClick = {this.getbigimg.bind(this)}><img src={""+item.attributes.enterpicurl+"" } alt="" style ={{"width":"20%","float":"left","height":"73px"}} id ="bigimg"/></div>
                                        )
                                    }
                                    <div style ={{"width":"80%","float":"right","position":"relative","backgroundColor":"#fff","height":"1.48rem"}}  onClick ={this.topay.bind(this,item)}>
                                        <p style ={p1style} ref = "carno">{item.attributes.carno}</p>
                                        <p style ={p2style}>{item.attributes.entertime}</p>
                                    </div>
                                    <div style ={{"clear":"both"}}></div>

                                </li>
                                )

                        })
                    }

                </ul>


                </div>
                <div id = "nocont" className="hide">
                    <Nothing content="亲，没有查询到相似车辆哦"/>
                </div>

            </div>

         )

    }
}
export {VagueCar}