/**
 * Created by WQ on 2016/12/16.
 */
import { createStore } from 'redux';

function switchPaneReducer(switchState="left", action={}) {    //switchState状态保存切换面板的选择，左边:left（默认） 右边:right
   return action.switchChoice;
}
let switchPaneStore = createStore(switchPaneReducer);

function billTypeReducer(billTypeState="all", action={}) {   //billTypeState状态保存订单类型的选择，全部订单:all（默认） 充值订单:recharge  消费订单:consume
    return action.billTypeChoice;
}
let billTypeStore = createStore(billTypeReducer);



function dataStoreRecentReducer(data="", action={}) {
    return action.data;
}
let dataStoreRecent = createStore(dataStoreRecentReducer);  //暂存ajax请求返回数据（近半个月）

function dataStoreBeforeReducer(data="", action={}) {
    return action.data;
}
let dataStoreBefore = createStore(dataStoreBeforeReducer);  //暂存ajax请求返回数据（半个月前）



export { switchPaneStore, billTypeStore, dataStoreRecent, dataStoreBefore };


