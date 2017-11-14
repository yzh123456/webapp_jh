/**
 * Created by hua on 2017/3/7.
 */
import {Component} from "react";
class Success extends Component{
    render(){
        let successstyle = {"width":"2.42rem","height":"2.42rem","background":"url(../images/success.png)","backgroundSize":"cover","marginTop":"0.7rem","marginLeft":"2.3rem"};
        let pstyle  = {"fontSize":"0.4rem","color":"#80c02b","textAlign":"center","marginTop":"0.2rem"}
        let bookp1style = {"background":"url(../images/left.png)","width":"1.59rem","height":"2.09rem","backgroundSize":"cover","position":"absolute","left":"0","top":"0"};
        let bookp2style = {"background":"url(../images/right.png)","width":"1.59rem","height":"2.09rem","backgroundSize":"cover","position":"absolute","right":"0","top":"0"};
        let bookp3style = {"background":"url(../images/iconsuccess.png)","width":"1.83rem","height":"1.83rem","backgroundSize":"cover","position":"absolute","right":"37%","top":"0.5rem","zIndex":"100"};
        let div1style = {"backgroundColor":"#9adb43","width":window.innerWidth+"px","height":window.innerHeight+"px","position":"relative"}
        let div2style = {"textAlign":"center","backgroundColor":"#fff","width":"92%","height":"5rem","borderRadius":"10px","position":"absolute","left":"0.3rem","top":"1.4rem"};
        let bookp4style = {"fontSize":"0.32rem","color":"#000","marginTop":"0.3rem"};
        let bookstyle = {"fontSize":"0.32rem","color":"#000","marginTop":"1.4rem"};
        let bookp5style = {"fontSize":"0.28rem","color":"#000","margin":"0.3rem 0.3rem 0.2rem","borderBottom":"1px solid #eee","padding":"0.3rem"};
        let bookp6style = {"fontSize":"0.26rem","color":"#000","margin":"0.2rem"};
        let sp1style = {"color":"#80c02b"};
        let sp2style = {"color":"#ff6e0e"};
        let sp3style = {"background":"url(../images/atten.png)","width":"0.24rem","height":"0.24rem","backgroundSize":"cover"};
        let show = this.props.show;

       let divstyle = {"display":"none"};
        if(show){
            divstyle = {"display":"block"};
        }

        return(
            <div>
                <div id = "success" style = {divstyle}>
                    {(window.location.pathname == "/jspsn/webapp/src/ambitusPark/html/ambitusPark.html") || (window.location.pathname =="/webapp/src/ambitusPark/html/ambitusPark.html") ||window.location.pathname == "/webapp/src/map/html/map.html" || (window.location.pathname =="/webapp/src/ambitusPark/html/ambitusPark.html") || (window.location.pathname =="/webapp/src/map/html/map.html") || (window.location.pathname == "/jspsn/webapp/src/map/html/map.html") || (window.location.pathname == "/jspsn/webapp/src/bookingList/html/bookingList.html")  || (window.location.pathname == "/webapp/src/bookingList/html/bookingList.html") ?
                        ( <div style={div1style}>
                            <p style={bookp1style}></p>
                            <p style={bookp2style}></p>
                            <p style={bookp3style}></p>
                            <div style={div2style}>
                                <p style={bookstyle}>亲，您的车位已预订成功。</p>
                                {
                                    this.props.parkingname == ""?( <p style={{"display":"none"}}>您的预订号:<span style={sp1style}>798579</span></p>):(<p style={bookp4style}>您的预订号:<span style={sp1style}>{this.props.parkingname}</span></p>)
                                }

                                <p style={bookp5style}>车位将为您保留<span style={sp1style}>{this.props.booktime}</span>分钟，请在<span
                                    style={sp1style}>{this.props.totaltime}</span>分钟内入场。<span style={sp2style}>订车位成功后，不能取消。</span></p>
                                <p style={bookp6style}>
                                    <span style={sp3style}></span>
                                    请在到达停车场后打开手机蓝牙，在订车位记录中打开车位锁。
                                </p>
                            </div>

                        </div>) : (
                        <div>
                            <p style={successstyle}></p>
                            <p style={pstyle}>成功了！</p>
                        </div>
                    )

                    }
                </div>


            </div>
        )
    }

}
export {Success}