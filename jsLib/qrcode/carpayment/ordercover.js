/**
 * Created by hua on 2017/4/11.
 */
import {Component} from "react";
import  JHT  from "../../common/util/JHT";
import  $  from "../../common/jquery-3.1.1.min";
class OrderCover extends Component{
    constructor(...args) {
        super(...args);
        this.state = {
            num:0
        };
        this.jht = new JHT();

    }
    //取消
    cover(){
        document.getElementById("icon").style.transform = "rotate(0deg)";
        document.getElementById("cover").className  = "hide";
       // window.location.reload();

    }
    getIcon(e){

        document.getElementById("icon").style.transform = "rotate(0deg)";
        e.target.className = "active_icon";
        for(let i = 0;i<$(e.target).parent().siblings().length; i++){
            $(e.target).parent().siblings()[i].childNodes[0].className = "icon";
        }
        document.getElementById("carAddress").innerText = e.target.parentNode.lastChild.innerText;
        window.sessionStorage.setItem("carAddress",e.target.parentNode.lastChild.innerText);
        window.sessionStorage.setItem("parkid",e.target.parentNode.lastChild.id);
        window.sessionStorage.setItem("businesser_code",e.target.parentNode.id);
        window.sessionStorage.setItem("park_code",e.target.id);
        this.props.handelcar(e.target.parentNode.lastChild.innerText,e.target.parentNode.lastChild.id,e.target.parentNode.id,e.target.id);
       //  console.log(e.target.parentNode.lastChild.id)  text code
    }

    //获取停车场  给父组件传值
    getAddress(e){
        document.getElementById("icon").style.transform = "rotate(0deg)";
        e.target.parentNode.firstChild.className = "active_icon";
        for(var i = 0;i<$(e.target).parent().siblings().length; i++){
            $(e.target).parent().siblings()[i].childNodes[0].className = "icon";
        }
        document.getElementById("carAddress").innerText = e.target.innerText;
        window.sessionStorage.setItem("carAddress",e.target.innerText);
        window.sessionStorage.setItem("parkid",e.target.id);
        window.sessionStorage.setItem("businesser_code",e.target.parentNode.id)
        window.sessionStorage.setItem("park_code",e.target.parentNode.firstChild.id);
      //  console.log(e.target.id)  text code
        this.props.handelcar(e.target.innerText,e.target.id,e.target.parentNode.id,e.target.parentNode.firstChild.id);

    }

    render(){

        let div1style = {"zIndex":"1","width":"100%","height":window.innerHeight+"px","backgroundColor":"#000","opacity":"0.7","position":"absolute","top":"0.9rem"};
        let div2style = {"zIndex":"1000","position":"absolute","width":"100%","top":"0.9rem","overflow":"hidden"}
        let p1style  = {"position":"relative","backgroundColor":"#fff","color":"#222","fontSize":"0.28rem","zIndex":"100","height":"1rem","lineHeight":"1rem","borderBottom":"1px solid #ccc"};
        let display = this.props.display;
        let divstyle = {};

        if(display){
            divstyle = {"display":"none"};
        }else{
            if(document.getElementById("cover")){
                document.getElementById("cover").className="";
            }
        }
        return(
            <div>
                <div id = "cover" className = "" style = {divstyle}>
                    <div style = {div1style}  onClick =  {this.cover.bind(this)}></div>
                    <div style = {div2style}>
                        {
                            this.props.data !==undefined?(<div>{
                                (this.props.data.length>0) && (typeof (this.props.data) == "object") ?(
                                    this.props.data.map((item,i)=>{
                                            return(
                                                <p style = {p1style} key = {`p-${i}`} id = {item.attributes.businesser_code }>
                                                    <span  className = {item.attributes.park_name == this.props.car || item.attributes.name == this.props.car?"active_icon":"icon"} onClick = {this.getIcon.bind(this)} id ={item.attributes.park_code}></span>
                                                    <span style={{"width":"100%","overflow":"hidden","height":"100%","paddingLeft":"1rem"}}   onClick = {this.getAddress.bind(this)} id = {item.attributes.park_id ||item.attributes.id} >{item.attributes.park_name == undefined?this.jht.getStrSub(item.attributes.name):this.jht.getStrSub(item.attributes.park_name)}</span>
                                                </p>
                                            )

                                        }
                                    )):(<div style ={{"display":"none"}}></div>)
                            }
                            </div>):(<div></div>)
                        }
                    </div>
                </div>
            </div>
        )
    }

}
export { OrderCover }