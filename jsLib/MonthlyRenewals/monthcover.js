/**
 * Created by hua on 2017/3/2.
 */
import {Component} from "react";
let arr = [];
let num = [];
let allmoney;
class MonthCover extends Component{
    //选择月份
    month(e){
        let id = e.target.id;
        let str = e.target.innerText;
        if(str == "1年"){
            str = "12";

        }else{
            str = str.substr(0,str.length-2);

        }

       this.props.handel(id,str);

        // /
   // .Substring(0,e.target.innerText.Length-2)
    }
    cover(){

        document.getElementById("cover").className  ="hide";
        //window.location.reload();

    }
    componentDidMount(){
         allmoney = eval("("+this.props.allmoney+")");
        console.log(allmoney)
        for(var item in allmoney){
            num.push(item);
            arr.push(allmoney[item])
        }

    }
    componentWillUnmount(){
        num = [];
        arr = [];
    }
    render(){

        let div1style = {"zIndex":"1","width":"100%","height":"100%","backgroundColor":"#000","opacity":"0.7","position":"fixed","top":"0"};
        let div2style = {"zIndex":"1000","position":"fixed","width":"81%","top":"40%","marginLeft":"0.7rem","marginRight":"0.7rem","marginTop": "-2.6rem","height":"5rem","overflow":"auto"};
        let p1style  = {"backgroundColor":"#fff","color":"#222","fontSize":"0.26rem","zIndex":"100","height":"1rem","lineHeight":"1rem","borderBottom":"1px solid #ccc","textAlign":"center"};
        let p2style  = {"backgroundColor":"#fff","color":"#222","fontSize":"0.26rem","zIndex":"100","height":"1rem","lineHeight":"1rem","textAlign":"center"};
        return(
            <div>
                <div id = "getcover" className = "">
                    <div style = {div1style} onClick =  {this.cover.bind(this)}></div>
                    <div style = {div2style}>
                        {
                            num.map((item,i)=>{
                                return(
                                    <p key = {`p-${i}`} style = {p1style} onClick =  {this.month.bind(this)} id  = {`${arr[i]}`} >{item}个月</p>
                                 )
                            })
                        }


                    </div>

                </div>
            </div>

        )
    }
}
export {MonthCover}
