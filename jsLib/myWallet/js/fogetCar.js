/**
 * Created by wq on 2017/2/15.
 */
import {Component} from "react";

let stWrapper = {position:"absolute", bottom:"0", width:"100%"};

let stColoumA = {position:"relative", width:"33%", height:"1rem", border:"1px solid #959595", borderTop:"none", textAlign:"center",  backgroundColor:"white" };
let stColoumB = {position:"relative",width:"33%", height:"1rem", borderBottom:"1px solid #959595", textAlign:"center",  backgroundColor:"white" };
let stColoumC = {position:"relative", width:"33%", height:"1rem", borderLeft:"1px solid #959595", borderRight:"1px solid #959595",textAlign:"center",  backgroundColor:"white" };
let stColoumD = {position:"relative", width:"33%", height:"1rem", border:"none", textAlign:"center", backgroundColor:"#d9d9d9"};
let index = 0,flag = 0;
let  str,newstr;
export class FogetCar extends Component {
    constructor() {
        super();
        this.state = {
            password:""
        }

        this.getNumberClick = this.getNumberClick.bind(this);
        this.cancelNumberClick = this.cancelNumberClick.bind(this)
    }
    //模拟键盘点击事件
    getNumberClick(e){

        index++;
        this.setState({
            password:e.target.innerText
        });

        console.log(e.target.innerText)
        if(this.props.flagnum == 1 ){

            if(index<=6){

                document.getElementById("Btninput").value += e.target.innerText;
                if(document.getElementById("Btninput").value !=="" && document.getElementById("Nextinput").value !== "" && document.getElementById("VerifiCode").value !== ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="#9ADB43"
                    document.getElementById("activeBtn").style.color  ="#fff";
                }
                if(document.getElementById("Btninput").value.length>6){
                    document.getElementById("Btninput").value = document.getElementById("Btninput").value.substr(0, 6);
                }

            }else{
                document.getElementById("Btninput").value += e.target.innerText;
                if(document.getElementById("Btninput").value !=="" && document.getElementById("Nextinput").value !== "" && document.getElementById("VerifiCode").value !== ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="#9ADB43"
                    document.getElementById("activeBtn").style.color  ="#fff";
                }
                if(document.getElementById("Btninput").value.length>6){
                    document.getElementById("Btninput").value = document.getElementById("Btninput").value.substr(0, 6);
                }

                index = 6;
            }

        }
        if(this.props.flagnum == 2){


            if(index<=6){

                document.getElementById("Nextinput").value += e.target.innerText;
                if(document.getElementById("Btninput").value !=="" && document.getElementById("Nextinput").value !== "" && document.getElementById("VerifiCode").value !== ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="#9ADB43"
                    document.getElementById("activeBtn").style.color  ="#fff";
                }
                if(document.getElementById("Nextinput").value.length>6){
                    document.getElementById("Nextinput").value = document.getElementById("Nextinput").value.substr(0, 6);
                }

            }else{
                document.getElementById("Nextinput").value += e.target.innerText;
                if(document.getElementById("Btninput").value !=="" && document.getElementById("Nextinput").value !== "" && document.getElementById("VerifiCode").value !== ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="#9ADB43"
                    document.getElementById("activeBtn").style.color  ="#fff";
                }
                if(document.getElementById("Nextinput").value.length>6){
                    document.getElementById("Nextinput").value = document.getElementById("Nextinput").value.substr(0, 6);
                }

                index = 6;
            }

        }
        if(this.props.flagnum == 3){


            if(index<=6){

                document.getElementById("VerifiCode").value += e.target.innerText;
                if(document.getElementById("Btninput").value !=="" && document.getElementById("Nextinput").value !== "" && document.getElementById("VerifiCode").value !== ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="#9ADB43"
                    document.getElementById("activeBtn").style.color  ="#fff";
                }
                if(document.getElementById("VerifiCode").value.length>4){
                    document.getElementById("VerifiCode").value = document.getElementById("VerifiCode").value.substr(0, 4);
                }
               }else{
                index = 6;
                document.getElementById("VerifiCode").value += e.target.innerText;
                if(document.getElementById("Btninput").value !=="" && document.getElementById("Nextinput").value !== "" && document.getElementById("VerifiCode").value !== ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="#9ADB43"
                    document.getElementById("activeBtn").style.color  ="#fff";
                }
                if(document.getElementById("VerifiCode").value.length>4){
                    document.getElementById("VerifiCode").value = document.getElementById("VerifiCode").value.substr(0, 4);
                }
            }


        }
    }

    //取消
    cancelNumberClick(){


        if(this.props.flagnum == 1){

            if(flag == 1){
                str=  document.getElementById("Btninput").value;
                newstr=str.substring(0,str.length-1);
                document.getElementById("Btninput").value = newstr;
                if(document.getElementById("Btninput").value == ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="rgb(195, 195, 195)"
                    document.getElementById("activeBtn").style.color  ="rgb(149, 149, 149)";
                }
                index-=1;

            }
            if(flag % 2 == 0 || flag % 3 == 0 || flag % 4 == 0 || flag % 5 == 0 || flag % 6 == 0){
                str=  document.getElementById("Btninput").value;
                newstr=str.substring(0,str.length-1);
                document.getElementById("Btninput").value = newstr;
                if(document.getElementById("Btninput").value == ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="rgb(195, 195, 195)"
                    document.getElementById("activeBtn").style.color  ="rgb(149, 149, 149)";
                }
                index-=1;
            }
        }
        if(this.props.flagnum == 2){

            if(flag == 1){
                str=  document.getElementById("Nextinput").value;
                newstr=str.substring(0,str.length-1);
                document.getElementById("Nextinput").value = newstr;
                if(document.getElementById("Nextinput").value == ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="rgb(195, 195, 195)"
                    document.getElementById("activeBtn").style.color  ="rgb(149, 149, 149)";
                }
                index-=1;

            }
            if(flag % 2 == 0 || flag % 3 == 0 || flag % 4 == 0 || flag % 5 == 0 || flag % 6 == 0){
                str=  document.getElementById("Nextinput").value;
                newstr=str.substring(0,str.length-1);
                document.getElementById("Nextinput").value = newstr;
                if(document.getElementById("Nextinput").value == ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="rgb(195, 195, 195)"
                    document.getElementById("activeBtn").style.color  ="rgb(149, 149, 149)";
                }
                index-=1;
            }
        }
        if(this.props.flagnum == 3){

            if(flag == 1){
                str=  document.getElementById("VerifiCode").value;
                newstr=str.substring(0,str.length-1);
                document.getElementById("VerifiCode").value = newstr;
                if(document.getElementById("VerifiCode").value == ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="rgb(195, 195, 195)"
                    document.getElementById("activeBtn").style.color  ="rgb(149, 149, 149)";
                }
                index-=1;

            }
            if(flag % 2 == 0 || flag % 3 == 0 || flag % 4 == 0 || flag % 5 == 0 || flag % 6 == 0){
                str=  document.getElementById("VerifiCode").value;
                newstr=str.substring(0,str.length-1);
                document.getElementById("VerifiCode").value = newstr;
                if(document.getElementById("VerifiCode").value == ""){
                    document.getElementById("activeBtn").style.backgroundColor  ="rgb(195, 195, 195)"
                    document.getElementById("activeBtn").style.color  ="rgb(149, 149, 149)";
                }
                index-=1;
            }
        }

      }

    render() {

        return (
            <div style={stWrapper} >
                <table cellSpacing="0" style={ {width:"100%", border:"0",cursor:"pointer"} } >
                    <tbody>
                    <tr>
                        <td style={stColoumB}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>1</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >&nbsp;</p>
                        </td>
                        <td style={stColoumA}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>2</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >ABC</p>
                        </td>
                        <td style={stColoumB}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>3</p>
                            <p style={ {fontSize:"0.2rem"} } >DEF</p>
                        </td>
                    </tr>
                    <tr>
                        <td style={stColoumB}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>4</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >GHI</p>
                        </td>
                        <td style={stColoumA} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} } onTouchStart = {this.getNumberClick}>5</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >JKL</p>
                        </td>
                        <td style={stColoumB}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>6</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >MNO</p>
                        </td>
                    </tr>
                    <tr>
                        <td style={stColoumB} >
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} } onTouchStart = {this.getNumberClick}>7</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >PQR</p>
                        </td>
                        <td style={stColoumA}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>8</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >TUV</p>
                        </td>
                        <td style={stColoumB}>
                            <p style={ {fontSize:"0.48rem","width":"100%","height":"100%","lineHeight":"0.7rem"} }  onTouchStart = {this.getNumberClick}>9</p>
                            <p style={ {fontSize:"0.2rem","position":"absolute","left":"40%","bottom":"9%"} } >WXYZ</p>
                        </td>
                    </tr>
                    <tr>
                        <td style={stColoumD} >
                        </td>
                        <td style={stColoumC}>
                            <p style={ {fontSize:"24px","width":"100%","height":"100%","lineHeight":"1rem"} }  onTouchStart = {this.getNumberClick}>0</p>
                        </td>
                        <td style={stColoumD} onTouchStart = {this.cancelNumberClick}>
                            <img src="../images/pic_keyboard_del_2x.png" style={ {width:"0.5rem", paddingTop:"0.32rem"} } />
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        )
    }
}