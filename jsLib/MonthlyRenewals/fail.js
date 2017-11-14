/**
 * Created by hua on 2017/3/8.
 */
import {Component} from "react";
import {Link} from "react-router";
class Fail extends Component{
    //取消
    falseclick(){
       document.getElementById("attentiondata").className  = "hide";
        document.getElementById("1").value = "";
        document.getElementById("2").value = "";
        document.getElementById("3").value = "";
        document.getElementById("4").value = "";
        document.getElementById("5").value = "";
        document.getElementById("6").value = "";
        location.reload()
    }
    render(){
       
        let divstyle;
        let show = this.props.show;

        let pwdcount = this.props.pwdcount;
        if(!show){
            divstyle  = {"display":"none"};
        }


            return(
                <div>
                    <section   id = "attentiondata"  style = {divstyle} className="">
                        <div  className="coverlist"></div>
                        <div  className="messagelist">
                            <p></p>
                            <p></p>
                            <p></p>
                            <p style  = {{"fontSize":"0.3rem","left":"1.2rem","top":"1rem","position":"absolute","color":"#fff","transform": "rotate(-3deg)"}} id = "psd" className=" ">密码不正确，还可以输入<span id = "nuber">{pwdcount}</span>次</p>
                            <div>
                                <span onClick  = {this.falseclick.bind(this)}>重试</span>
                                <div className="forget" style = {{"border":"none","fontSize":"0.34rem","flex":"1","display":"flex","justifyContent":"center","padding":"0.3rem 0"}} ><Link to  = "/monthlyorder/forgetPassword" style = {{"color":"#80c02b"}}>忘记密码</Link></div>
                            </div>

                        </div>


                    </section>
                </div>
            )

    }
}
export {Fail}