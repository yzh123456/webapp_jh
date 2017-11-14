/**
 * Created by hua on 2017/4/21.
 */
import {Component} from "react";
import  JHT  from "../../common/util/JHT";
let  jht = new JHT();
class Advet extends Component{

    render(){
        let p1style ={"width":"4.1rem","height":"1.62rem","background":"url(./images/bg_car.png)","backgroundSize":"cover"};
        let p2style ={"position":"fixed","bottom":"0.2rem","left":"2.1rem"};
        let sp1style = {"width":"1.35rem","height":"0.3rem","background":"url(./images/bg_wx.png)","float":"left","backgroundSize":"cover","marginRight":"0.5rem"};
        let sp2style = {"width":"0.97rem","height":"0.3rem","background":"url(./images/bg_jh.png)","float":"right","backgroundSize":"cover"};

        return(
            <div>
                <div style ={{"position":"absolute","bottom":"0.7rem","left":"1.6rem","zIndex":"-1"}}>

                        <p style = {p1style}></p>
                        <p style ={p2style}>
                            {
                                jht.working() == 'WX'?(<span>
                                    <span style ={sp1style}></span>
                                    <span style ={sp2style}></span>
                                </span>):(<span>
                                    <span style ={{"width":"0.97rem","height":"0.3rem","background":"url(./images/bg_jh.png)","float":"right","backgroundSize":"cover","marginLeft":"0.9rem"}}></span>
                                </span>)
                            }

                        </p>

                    <p style ={{"clear":"both"}}></p>
                </div>

            </div>

        )
    }

}
export {Advet}