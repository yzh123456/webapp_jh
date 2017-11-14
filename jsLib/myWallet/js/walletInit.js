/**
 * Created by wq on 2017/2/8.
 */
import {Component} from "react";
import {WalletDisplay} from "./WalletDisplay";
import {WalletNotBind} from "./walletNotBind";
import jhtAjax from "../../common/util/JHTAjax";
import { Loading,operateMask } from "../../common/components/Loading";

let stBGImg = {"height":"4.6rem", "width":"100%", "display":"block", "paddingBottom":"0.35rem", "borderBottom":"1px solid #d9d9d9","position":"relative"};

let stOuter = {"lineHeight":"1rem", "background":"white", "borderBottom":"1px solid #d9d9d9", "fontSize":"0.32rem","padding":"0 0.3rem"};
let stCouponImg = {"width":"0.4rem", "padding":"0 0.15rem 0.15rem 0.15rem",  "paddingTop": "0.3rem"};
let stEnterImg = {"width":"0.2rem", "verticalAlign":"middle", "marginLeft":"4.8rem" };

let rows = [];      //当页面跳转后，WallInit组件和其子组件都会卸载，但是rows变量定义成了该模块的全局变量，还会存在，所以当点击返回按钮返回该组件页面，
                     //会导致rows变量再push一次组件，且组件的key可能相同，导致React报错。 解决办法是把rows定义成WalletInit的局部变量，或者在卸载WalletInit时清空变量。

export class WalletInit extends Component {
    constructor() {
        super();
        this.state = {
            walletState: 0,   //钱包状态: 0:初始化  1:未开通  2:已开通
        };

        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount() {
        //查询卡通状态
       // let userId = "1e34989003864373b0fda47f2f9bc50d";  //3f4cef3995e448d2816b5726db46280e
        let userId =  USERINFO.USER.USER_ID;
        let obj = {
            attributes:{
                USER_ID:userId,
            } };


        //发送ajax请求
        let pointer = this;
        jhtAjax( {
           /* url: XMPPSERVER,*/
            data: {
                serviceId:"ac.jst.querycardallinfo",
                attributes:JSON.stringify(obj.attributes),
            },
            type: 'post',
            dataType: 'json',
            /*async: false,*/   /*不传值默认异步调用*/
            success: function (data) {
                console.log(data);
                operateMask("hide")
                window.sessionStorage.setItem("key",data.attributes.jst_card_no);
                if (data.attributes.jst_card_no == undefined) {   //返回值不包含捷顺通卡号信息，表示用户未绑定捷顺通卡
                    rows.push(<WalletNotBind key="1" />)
                    pointer.setState({
                       walletState: 1,
                    });
                } else {                                           //返回值包含捷顺通卡号信息，表示用户已绑定捷顺通卡
                   /* window.walletData  = data;                   //将钱包数据保存到Window 对象（window表示浏览器中打开的窗口）*/
                    rows.push(<WalletDisplay key="2" data={ data } />)
                    pointer.setState({
                        walletState: 2,
                    });
                }
            } ,
            error:  function (error) {
                console.log("ajax failure");
            }
        } );

    }

    componentWillUnmount() {
        rows = [];    //重置模块全局变量rows，这样用户重新进入页面或者返回页面使得页面初始化时的rows的值为空
    }

    handleClick() {
        let userId =  USERINFO.USER.USER_ID;
        let TEL =  USERINFO.USER.TEL;
        location.href = "../../coupon/html/couponList.html?USER_ID="+userId+"&APP_TYPE=WX_JTC&TEL="+TEL;
       // location.href = "http://jhtestcms.jslife.net/jspsn/src/coupon/html/couponList.html"
    }

    render() {
        return (
            <div>
                <div>
                    <Loading taskCount = "1"/>

                </div>
                <div>
                    <img src="../images/pic_mywallet_background.png" style={stBGImg} />
                </div>

                <div style={stOuter} onTouchStart={this.handleClick} >
                    <img src="../images/pic_coupon_2x.png" style={stCouponImg} />
                    优惠券
                    <img src="../images/pic_enter_2x.png" style={stEnterImg} />
                </div>

                {rows}
            </div>

        )
    }
}
