/**
 * Created by WQ on 2016/12/15.
 */
import {dataStoreRecent, dataStoreBefore} from "./store";
import {operateMask} from "../../common/components/Loading";
import {XMPPSERVER as xmppServer} from "../../common/util/Enum";


let tradePage = 1;      //记录查询近半个月记录的页索引  起始值为1，后续每请求一次加1
let hisTradePage = 1;   //记录查询半个月前记录的页索引  起始值为1，后续每请求一次加1

export let dataInteract = {
        reqService : function (time, userId) {

            let obj = {
                    attributes:{                   //List<TXDataObject>中的第一个TXDataObject的attributes属性(数据类型为Java中的Map)
                        USER_ID:userId,
                        START_INDEX:time=="queryTradeRecord" ? tradePage:hisTradePage,
                        QUERY_TYPE:time           //近半个月(queryTradeRecord)     半个月前( queryHisTradeRecord )
                    },
            };

            $.ajax({
                url:xmppServer,   // "http://192.168.1.205:2288/jspsn/XmppServer.servlet"
                data: {
                    serviceId:"ac.jst.querycardtradedetail",
                    attributes:JSON.stringify(obj.attributes),
                    //async:"true"   //换成同步会请求超时
                },
                type : "post",
                dataType:'json',
                async:true,
                success : function (data) {
                    console.log(data);
                    window.sessionStorage.setItem("carno",data.dataItems[0].attributes.CARD_NO)
                    if (time == "queryTradeRecord") {
                        dataStoreRecent.dispatch({   //改变数据状态( 近半个月 )
                            type:"ajax",
                            data:data
                        });
                        tradePage ++;    //查询页索引 +1
                    } else {
                        dataStoreBefore.dispatch({   //改变数据状态( 半个月前 )
                            type:"ajax",
                            data:data
                        });
                        hisTradePage ++;  //查询页索引 +1
                    }

                    operateMask("hide");   //隐藏遮罩层
                },
                error:function () {
                    console.log("ajax failure");

                    operateMask("hide");   //隐藏遮罩层
                }

            });

        },
}

/*
* 重置查询页索引
 */
export function resetTradePage() {
    tradePage = 1;
}

export function resetHisTradePage() {
    hisTradePage = 1;
}