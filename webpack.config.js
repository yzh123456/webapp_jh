/**
 * Created by yqx on 2016/11/21.
 */
var path = require("path");
var webpack = require("webpack");
var node_modules_dir = path.join(__dirname, 'node_modules');
//指定编译源码目录地址
var staticRoot = path.resolve(__dirname, "./jsLib");
//指定编译后输出目录
var outputPath = path.resolve(__dirname, "./output");

var deps = [
  'react/dist/react.min.js',
  'react-dom/dist/react-dom.min.js',
  'react-redux/dist/react-redux.min.js',
  'react-router/dist/react-router.min.js'
];

var config =  {
  devtool : "source-map",
  entry: {
    //入口文件(只配置了demo的入口)
    //userInfo: staticRoot+'/userInfo/userInfo.js',                   //我的资料
    //zoneMessage: staticRoot+'/zone-message/js/app.js' ,             //我的消息
    // couponList: staticRoot+'/coupon/app.js',                     //优惠券列表
    //carPlaceShare: staticRoot+'/carPlaceShare/js/carPlaceShare.js', //车位分享主界面
    //queryCost: staticRoot+'/query-cost/app.js'                   //停车账单
    //   ambitusPark: staticRoot+'/ambitusPark/app.js',               //周边车场
      // monthPayment: staticRoot+'/monthlyPayment/app.js',               //月卡账单
      // receiptCard: staticRoot+'/receiptCard/app.js',               //领券中心
      //  MonthlyRenewals: staticRoot+'/MonthlyRenewals/app.js',               //搜索
      // map: staticRoot+'/map/app.js'               //地图
      // carNoInput: staticRoot+'/carNoInput/app.js',               //搜索
      // bindTelphone: staticRoot+'/userInfo/bindTelphone.js'         //绑定手机
      /**
       * 云平台页面
       */
      carPayment:staticRoot+'/qrcode/carpayment/app.js'//车牌缴费
  },
  output: {
    path: outputPath, //输出目录
    filename: '[name].build.js',
    sourceMapFilename: '[file].map'  //Source Map
  },
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      { test: /\.sass$/, loader: "style!css!sass" },  //预留css处理
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=233&name=images/[name].[hash:6].[ext]' },
    ],
  },
  babel: {
    babelrc: false,
    presets: [
      "es2015",
      "react",
      "stage-2"
    ],
  },
  resolve: {// 现在你require文件的时候可以直接使用require('file')，不用使用require('file.js')
    root: [ staticRoot ],
    extensions: ['', '.js', '.json', '.jsx'],
    alias: {}
  },
  plugins: [
    //插件项
    new webpack.ProvidePlugin({
      'React': 'react',
      'ReactDOM': 'react-dom',
    })
  ]
}

deps.forEach(function (dep) {
  var depPath = path.resolve(node_modules_dir, dep);
  config.resolve.alias[dep.split(path.sep)[0]] = depPath;
  config.module.noParse.push(depPath);
});

module.exports = config;