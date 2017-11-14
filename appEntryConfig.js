/**
 * Created by yqx on 2016/12/30.
 */
//指定编译源码目录地址
let path = require("path");
let staticRoot = path.resolve(__dirname, "./jsLib");
let appEntry = {
    couponList: staticRoot+'/coupon/app.js',						    //优惠券
    attentionList:staticRoot+'/attentionList/app.js',			        //收藏的车场
    lockCar:staticRoot+'/lockCar/app.js',						        //防盗历史
    userBill: staticRoot + '/userBill/userBill.js',                     //我的账单页面
    queryCost: staticRoot+'/queryCost/app.js',                       //停车账单
    monthPayment: staticRoot+'/monthlyPayment/app.js',               //月卡账单
    ambitusPark: staticRoot+'/ambitusPark/app.js',               //周边车场
    receiptCard: staticRoot+'/receiptCard/app.js',               //领券中心
    search: staticRoot+'/search/app.js',                        //搜索
    map: staticRoot+'/map/app.js',                              //地图
    bindTelphone: staticRoot+'/userInfo/bindTelphone.js',            //绑定手机
    bookingList:staticRoot+'/bookingList/app.js',   //定车位历史
    myWallet:staticRoot+'/myWallet/myWallet.js',  //我的钱包
    MyVehicle:staticRoot+'/MyVehicle/app.js',  //我的车辆
    MonthlyRenewals:staticRoot+'/MonthlyRenewals/app.js',  //月卡续费
    userInfo:staticRoot+'/userInfo/app.js',  //我的信息
    invoiceRecord: staticRoot+'/invoice/appRecord.js',         //电子发票记录
    invoice: staticRoot+'/invoice/app.js'         //电子发票记录

};
let appScanEntry={
    /**
     * 云平台单页面
     */
    carPayment:staticRoot+'/qrcode/carpayment/app.js',//车牌缴费
    successForCar: staticRoot+'/qrcode/successForCar/app.js',  // 车牌缴费完成
    successForBooking: staticRoot+'/qrcode/successForBooking/app.js'// 预定缴费完成
};
let app = {
    appEntry:appEntry,
    appScanEntry:appScanEntry
};
module.exports = app;