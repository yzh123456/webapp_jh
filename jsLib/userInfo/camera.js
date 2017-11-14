/**
 * Created by hua on 2017/3/3.
 */
import {Component} from "react";
class Camera extends Component{
    cover(){
        location.reload()
        document.getElementById("cover").className = "hide"
    }
    render(){
        let div1style = {"zIndex":"1","width":"100%","height":"100%","backgroundColor":"#000","opacity":"0.7","position":"fixed","top":"0"};
        let div2style = {"zIndex":"1000","position":"fixed","width":"81%","top":"36%","marginLeft":"0.7rem","marginRight":"0.7rem"}
        let p1style  = {"fontWeight":"600","paddingLeft":"0.2rem","backgroundColor":"#fff","color":"#222","fontSize":"0.26rem","zIndex":"100","height":"1rem","lineHeight":"1rem","borderBottom":"1px solid #ccc"};

        return(
            <div>
                <div id = "cover" className="">
                    <div style = {div1style} onClick = {this.cover.bind(this)}></div>
                    <div style = {div2style}>
                        <p style = {p1style}>拍照</p>
                        <p style = {p1style}>从手机相册获取</p>

                    </div>

                </div>
            </div>

        )
    }

}
export {Camera}