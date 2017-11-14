/**
 * Created by hua on 2017/3/3.
 */
import {Component} from "react";
import { PopupTip } from "../myWallet/js/popupTip";
import jhtAjax from "../common/util/JHTAjax";
import {DownloadApp} from "../downloadApp/DownloadApp";
import { Loading,operateMask } from "../common/components/Loading";
import {CLOUDURL} from "../common/util/Enum";
let rows = [];
class Message extends Component{
    constructor(...args) {
        super(...args);
        this.stateObj = {
            tel: "",
            url:"",
            name:""
        };
        this.state = this.stateObj;
        this.inputOnBlur =  this.inputOnBlur.bind(this);
        this.inputOnFocus = this.inputOnFocus.bind(this);
        this.cancelPopupTip  = this.cancelPopupTip.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    componentDidMount(){
        this.getdate();

    }
    //获取焦点
    inputOnFocus(){
        document.getElementById("down").className = "hide";

    }
    //失去焦点
    inputOnBlur(){
        document.getElementById("down").className  =" ";
        let name  = document.getElementById("name").value;
        this.setInfo(name);
    }
    //获取用户信息
    getdate(){
        let that = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
      // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let  obj = {
            dataItems:[]
        };

        let tmp = {
            attributes: {
               userId:userId
            }
        };
        obj.dataItems.push(tmp);

        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_USER_GETUSERINFO",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                operateMask("hide");
                let url = "";
                if(data.resultcode == 0 && data && data.dataitems.length>0){

                    that.setState({
                        name:data.dataitems[0].attributes.nickname,
                        tel:data.dataitems[0].attributes.telephone,
                        url:data.dataitems[0].attributes.photourl

                    })

                }


            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
    }

    //设置用户信息  --修改昵称
    setInfo(name){
        let that = this;
        //1e34989003864373b0fda47f2f9bc50d  开通id
       // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let  obj = {
            dataItems:[]
        };

        let tmp = {
            attributes: {
                userId:userId,
                nickName:name
            }
        };
        obj.dataItems.push(tmp);

        jhtAjax( {
            /* url: XMPPSERVER,*/
            data: {
                serviceId:"JSCSP_USER_UPDATEUSERNICK",
                dataItems:JSON.stringify(obj.dataItems),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                if(data.resultcode == 0 ){
                    that.getdate();

                    that.setState({
                        name:name
                    });

                    rows.push(<PopupTip key = "1" txt="昵称修改成功" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();


                }else{
                    rows.push(<PopupTip key = "1" txt="昵称修改失败" cancelPopupTip={ that.cancelPopupTip }/>)
                    that.updateContent();

                }


            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );
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
    }

    render(){

    let div1style = {"borderBottom":"1px solid #eee","paddingLeft":"0.2rem","backgroundColor":"#fff","height":"1rem","lineHeight":"1rem","position":"relative"}
    let span1style = {"fontSize":"0.28rem","color":"#222","position":"absolute"};
    let span2style = {"fontSize":"0.28rem","color":"#959595","position":"absolute","right":"0.2rem"};
    let div2style = {"marginBottom":"0.3rem","paddingLeft":"0.2rem","backgroundColor":"#fff","height":"1rem","lineHeight":"1rem","position":"relative"};
    let span3style = {"textAlign":"right","top":"0.35rem","fontSize":"0.28rem","color":"#959595","position":"absolute","right":"0.6rem"};
    let spstyle;
    if(this.state.url){
        spstyle  = {"background":" url("+CLOUDURL+"/jsstApp/image.servlet?filePath="+this.state.url+")","position":"absolute","right":"0.2rem","top":"0.2rem","width":"0.6rem","height":"0.6rem","backgroundSize":"cover","borderRadius":"100%"}

   }else{
        spstyle  = {"background":"url(../images/urlphoto.png)","position":"absolute","right":"0.2rem","top":"0.2rem","width":"0.6rem","height":"0.6rem","backgroundSize":"cover","borderRadius":"100%"};
    }
    return(
        <div>
            <div>
                <Loading taskCount = "1"/>

            </div>
            <div id = "down" className=" ">
                <DownloadApp/>
            </div>

            <div id = "pop" className="">
                <div style = {div1style} >
                    <span style = {span1style} >头像</span>
                    <span style = {spstyle}></span>
                </div>
                <div style = {div2style}>
                    <span style = {span1style}>昵称</span>
                    <span style = {{"position":"absolute","width":"0.1rem","right":"0.3rem","top":"0.3rem"}}><img src="../images/right.png" alt="" style ={{"width":"0.2rem"}}/></span>
                    <input style = {span3style} placeholder={this.state.name?this.state.name:"还没设置昵称哦"} id = "name" className="name"   onBlur={this.inputOnBlur } onFocus={this.inputOnFocus } />

                </div>
                <div style = {div1style}>
                    <span style = {span1style}>绑定手机号</span>
                    <span style = {span2style}>{(this.state.tel).substr(0, 3) + '****' + (this.state.tel).substr(7)}</span>
                </div>
                {rows}
            </div>

        </div>

    )
}
}
export {Message}
