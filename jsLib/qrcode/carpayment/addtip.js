/**
 * Created by hua on 2017/4/19.
 */
import {Component} from "react";

class AddTip extends Component{
    //取消
    cancel(){
        document.getElementById("cancel").className = "hide";
        //document.getElementById("carAddress").innerText = window.sessionStorage.getItem("carAddress");
    }
    //确定
    sure(){
        document.getElementById("cancel").className = "hide";
        document.getElementById("carAddress").innerText = this.props.name;
        window.sessionStorage.setItem("carAddress",this.props.name)
    }
    render(){
        let divstyle;

        if(this.props.show){
            divstyle = {"display":"none"};
        }
        let pstyle = {"transform":"rotate(-5deg)","bottom":"59%","left":"9%","color":"#fff","fontSize":"0.32rem","position":"absolute"}
        return(
            <div>
                <section id = "cancel" className=" " style ={divstyle}>
                    <div className = "coverlist" style = {{height: window.innerHeight}}></div>
                    <div className = "messagelist">
                        <p></p>
                        <p style  = {pstyle}>您的车辆不在该停车场，确定要切换停车场吗？</p>
                        <p></p>
                        <div>
                            <span onClick = {this.cancel.bind(this)}>再想想</span>
                            <span onClick = {this.sure.bind(this)}>确定</span>
                        </div>
                    </div>
                    </section>


            </div>
        )
    }
    
}
export{AddTip}
