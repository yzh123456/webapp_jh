/**
 * Created by yqx on 2016/12/18.
 */
import { Component } from 'react';
class Qrcode extends Component{
    constructor(props){
        super(props);
        this.state = {
            refreshTime: 60
        };
    }
    componentDidMount(props){
        let codeContentData = this.props.codeContentData;
        makeCode ("qrcode_Detail",codeContentData);
        const that = this;
        this.refreshTime();
    }
    componentWillUnmount(){

    }
    refreshTime(){
        clearInterval(timeout);
        let timeout = setInterval(()=>{
            const that = this;
            if(that.state.refreshTime === 0){
                clearInterval(timeout);
                this.refreshTime();
                let el = this.refs.qrcodeDetail;
                el.innerHTML = "";
                makeCode ("qrcode_Detail", this.props.codeContentData);
                that.setState({
                    refreshTime : 60
                });
                return;
            }
            //一秒后对 name 重新赋值，使用 setState 去修改数据的状态
            that.setState({
                refreshTime : that.state.refreshTime -1
            });
        },1000);
    }
    render(){
        return <setion className="qrcode" >
            <div id="qrcode_Detail" ref="qrcodeDetail" className="qrcode"  >
            </div>
            <div className="refreshTime f28">刷新倒计时
                <span>
                        {
                            this.state.refreshTime
                        }
                    </span> 秒
            </div>
        </setion>

    }
}
//生成二维码
function makeCode (el,codeContentData) {
    var codeContent;
    var bcResult = [];
    codeContentData.subitems.forEach((item,i)=>{
        var obj = `{\"bc\":\"${ item.attributes.businesser_code }\",\"pc\":\"${ item.attributes.park_code }\"}`;
        bcResult.push(JSON.parse(obj));
    });
    codeContent = [{
        "bpc":bcResult,
        "key":"jsc",
        "cno": codeContentData.attributes.coupon_num,
        "cname": codeContentData.attributes.couponname,
        "mode": codeContentData.attributes.mode,
        "mnt": codeContentData.attributes.coupon_money,
        "bt": codeContentData.attributes.start_time,
        "et": codeContentData.attributes.stop_time,
        "ct": new Date().Format("yyyy-MM-dd hh:mm:ss")
    }];

    let qrcode = new QRCode( el , {
        width: 220,
        height: 220,
        colorDark: '#292929',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    qrcode.makeCode(JSON.stringify(codeContent));
}
export { makeCode , Qrcode };