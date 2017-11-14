/**
 * Created by hua on 2017/2/24.
 */
import {Component} from "react";
export class BindSuccess extends Component {
    render(){
        return(
            <section id = "Bind" className="Bind">
                <p >√</p>
                <p>关联成功</p>
                <p>您可以在"我的钱包"内进行充值、账单查询等功能</p>
                <p>为了您的用卡安全，卡联成功后</p>
                <p>请修改支付密码</p>
                <div className="" id  = "bind" >修改支付密码</div>
            </section>
        )
    }
}
