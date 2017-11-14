import {Component} from "react";
import {DOWNLOADAPP} from "../common/util/Enum";
export class DownloadApp extends Component {
    closeClickHandle(){
        document.querySelector("#download").style.display = "none";
        sessionStorage.setItem("download","download");
        window.onbeforeunload = function () {
            //用户点击浏览器右上角关闭按钮或是按alt+F4关闭
            if(event.clientX>document.body.clientWidth&&event.clientY<0||event.altKey)
            {
                // alert("点关闭按钮");
                sessionStorage.removeItem("download");
                // window.event.returnValue="确定要退出本页吗?";
            }
            //用户点击任务栏，右键关闭。s或是按alt+F4关闭
            else if(event.clientY > document.body.clientHeight || event.altKey)
            {
                // alert("任务栏右击关闭");
                sessionStorage.removeItem("download");
                // window.event.returnValue="确定要退出本页吗?";
            }
            //其他情况为刷新
            /*else
            {
                // alert("刷新页面");
            }*/
        }
    }
    downloadClickHandle(){
        window.open(DOWNLOADAPP);
    }
    componentDidMount(){
        //sessionStorage.setItem("download",true);
    }
    render(){
        let closeS = {
            "width":"1rem",
            "bottom":"0.8rem",
            "position":"fixed",
            "height":"0.8rem",
            "right":"0",
            "zIndex":"999"
        };
        let appS = {
            "width":"100%",
            "bottom": "0",
            "position": "fixed",
            "zIndex":"998"
        };
        let downloadS = {
            "width":"3.6rem",
            "bottom":"0.16rem",
            "position":"fixed",
            "height":"1rem",
            "marginLeft":"1.95rem"
        };
        if(sessionStorage.getItem("download")){
            return false;
        }
        return (window.location.href.indexOf("/jslifesn/") > -1?(<div></div>):(<div style={{'zIndex':"998"}} id="download">
            <div id="close" style={closeS} onClick={this.closeClickHandle}></div>
            <img style={appS} onClick={this.downloadClickHandle} src={`${window.location.href.split('/src/')[0]}/src/downloadApp/toDownApp.png`}/>
            <div style={downloadS} onClick={this.downloadClickHandle}></div>
        </div>))
    }
}