/**
 * Created by yqx on 2016/12/8.
 */
import {render} from "react-dom";
import {CouponList} from "./router";
import {Loading} from "../common/components/Loading";
import Common from "../common/Common";
new Common(()=> {
    },
    //true  //是否获取包含用户位置的用户信息
);
if((!USERINFO.USER.TEL || USERINFO.USER.TEL == "") &&
    (!USERINFO.USER.USER_ID || USERINFO.USER.USER_ID == "") && USERINFO.USER.APP_TYPE ){
    window.location.href = `${window.location.href.split('/src/')[0]}/src/userInfo/bindTelphone.html${window.location.search}`;
}
render(
    <section>
        <Loading taskCount="1" content=""/>
        <CouponList/>
    </section>
    ,
    document.querySelector("#couponlist")
);

