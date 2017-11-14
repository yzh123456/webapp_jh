/**
 * Created by hua on 2017/2/10.
 */
import { Component } from 'react';
let timeout;
class Time extends  Component{
    componentDidMount(){
        this.timefresh();

    }
    componentWillUnmount(){
        clearInterval(timeout);
    }
   timefresh(){
       clearInterval(timeout);
       timeout = setInterval(()=>{
           let m = parseInt(document.getElementById("mm").innerText)*60;
           let s = parseInt(document.getElementById("ss").innerText);
           let url = window.location.href;
           let str = url.substring(url.lastIndexOf('/')+1, url.length);
           let leftTime = m+s;
           if(leftTime <= 1){
               clearInterval(timeout);
               if(s<0){
                   document.getElementById("mm").innerText = 0;
                   document.getElementById("ss").innerText = 0;
               }

               document.getElementById("order").innerText = "订单已过期";
               document.getElementById("order").style.backgroundColor = "#959595";
               document.getElementById("order").className = "ovorder"

           }

           leftTime--;
           document.getElementById("mm").innerText = parseInt(leftTime / 60);
           leftTime %= 60;
           document.getElementById("ss").innerText = leftTime;


       },1000);



   }
    render(){
        return(
            <div>
                <p >缴费时间剩余
                    <span className="time">
                    <span className = "excessTime" id="mm">3 </span>分钟
                     <span id = "ss">00</span>秒
                    </span>
                </p>
            </div>
        )
    }
}
export { Time}
