/**
 * Created by Administrator on 2016/12/8.
 */
import {Component} from "react";
import JHT from "../util/JHT";
//遮罩层初始显示 visibility:visible
let maskDivStyle = {"width":"100%", "height":"100%", "position":"fixed", "left": "0px", "top":"0px",
    "opacity":"0.5", "backgroundColor":"white", "textAlign":"center", "display":"table", "zIndex":"1000000", "visibility":"visible","backgroundColor": "#000000"};
let divStyle = {"display":"table-cell", "verticalAlign":"middle"};
let imgStyle = {"width":"1.0rem", "zIndex":"1000001"};

let taskCount = 0;    //等待完成的任务数
export class Loading extends Component {
    render () {
        //let fontSize = (obj.fontSize||16)*2;
        let obj={
            text:this.props.content || "加载中...",
            color:"#959595"
        };
        let fontSize = (obj.fontSize||15);
        let jht=new JHT();
        let imgPath = (jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/common/image/pic_loading.gif";
        taskCount = this.props.taskCount || 0;
        let style = {'textAlign' : 'center',"margin":"0 15px" , "fontSize":"0.3rem" , "fontFamily": "OfficialScript" };
        return (
            <div id="load_mask"  style={maskDivStyle}>    {/* 传入ajaxCount值，表示并发的ajax请求数目    { this.props.content || "加载中..." }*/}
                <div style={divStyle}>
                    <img src={imgPath} style={imgStyle} />
                    <div style={ style }>
                        <img style={{"width":obj.text.length*fontSize+"px"}} alt={obj.text} src={jht.txtImg(obj)}/>
                    </div>
                </div>
            </div>
        )
    }
}

/*
 *操作遮罩层函数  参数： hide（默认） show    delete
 * 三个参数对应的功能分别为隐藏、显示、删除遮罩层
 */
export function operateMask (param="hide") {
    if (param == "hide") {           //隐藏遮罩层
        taskCount = taskCount - 1;
        if(taskCount <= 0 && document.getElementById("load_mask")) {     //等待的任务数 <=0 则删除遮罩层
            setTimeout(function () {
                document.getElementById("load_mask").style.visibility="hidden";
            },500);
        }
    } else if (param == "show" && document.getElementById("load_mask")) {
        document.getElementById("load_mask").style.visibility="visible";
    } else if(param == "delete") {
        setTimeout(function () {
            let el = document.getElementById("load_mask");   //删除加载层元素
            el.parentNode.removeChild(el);
        },150);
    }

}



