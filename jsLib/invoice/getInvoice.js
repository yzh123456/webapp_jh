import { Component,createClass} from "react";
import  MyToast  from "../common/components/MyToast";
import { operateMask } from "../common/components/Loading";
import JHTAJAX from "../common/util/JHTAjax";
import JHT from "../common/util/JHT";

export default function getInvoice(attr){
    let jht = new JHT();
    operateMask && operateMask("show");
    if(!attr){
        console.log("参数为空！");
        operateMask && operateMask("hide");
        return false;
    }
    JHTAJAX({
        data: {
            serviceId:"ac.invoice.getauthpage",
            attributes:attr
        },
        dataType : 'json',
        type:'post',
        success : function(data) {
            if(data.resultcode == "0" && data.attributes && data.attributes.auth_url){
                if(jht.working() == "APP"){
                    window.AppBridge && AppBridge.forJS({
                        serviceId:"OPENWXINVOICE",
                        params:{
                            authUrl:data.attributes.auth_url.replace(/\\/g,"")  //跳转到授权页
                        }
                    })
                }else {
                    window.location.href = data.attributes.auth_url.replace(/\\/g,""); //跳转到授权页
                }
            }else if(data.message){
                let myToast = new MyToast();
                myToast.setToast(data.message || "开票失败了，请稍候重试");
            }
            operateMask && operateMask("hide");
        },
        complete:function () {
            operateMask && operateMask("hide");
        },
        error:function () {
            operateMask && operateMask("hide");
        }
    });
}

