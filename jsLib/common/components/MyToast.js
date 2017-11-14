/**
 * Created by Administrator on 2016/12/8.
 */
// import {Component} from "react";

export default class MyToast /*extends Component */{
    constructor(){
        //super();
        this.timeout="";
        if(!document.getElementById("myToast")) {
            let toast = document.createElement("div")
            toast.innerHTML =  '<div id="myToast"></div>';
            document.body.appendChild(toast);
        }
    }
    setToast(content = "",showTime=1500){
        document.getElementById("myToast").innerText = content;
        document.getElementById("myToast").style.zIndex = "9999";
        document.getElementById("myToast").style.opacity = "1";

        this.timeout = setTimeout(function(){
            clearTimeout(this.timeout);

            document.getElementById("myToast").style.opacity = "0";
            this.timeout = setTimeout(function() {
                clearTimeout(this.timeout);
                document.getElementById("myToast").style.zIndex = "-1";
            },showTime);
        }.bind(this),showTime);
    }
    /*render () {
        return  <div ref="myToast" id="myToast" ></div>;
    }*/
}

