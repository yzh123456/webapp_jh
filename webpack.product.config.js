/**
 * Created by yqx on 2016/12/30.
 */
/**
 * 生产环境发布方法
 */
'use strict';
let path = require("path");
let webpack = require("webpack");
let appEntry = require("./appEntryConfig");
//import {appEntry} from "./appEntryConfig";
let node_modules_dir = path.join(__dirname, 'node_modules');
//指定编译源码目录地址
let staticRoot = path.resolve(__dirname, "./src");
//指定编译后输出目录
let outputPath = path.resolve(__dirname, "./output");
let deps = [
    'react/dist/react.min.js',
    'react-dom/dist/react-dom.min.js',
    'react-redux/dist/react-redux.min.js',
    'react-router/dist/react-router.min.js'
];

let config =  {
    //devtool : "source-map",
    entry: appEntry.appEntry,
    output: {
        path: outputPath, //输出目录
        filename: '[name].build.js',
       // sourceMapFilename: '[file].map'  //Source Map
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
            { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url-loader?limit=8192&name=images/[name].[hash:6].[ext]' },
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
        modulesDirectories: ['node_modules'] , //(Default Settings)
        alias: {}
    },
    plugins: [
        /*
         * 将打包环境定为生产环境
         */
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        // 去重
        new webpack.optimize.DedupePlugin(),
        /*
         * 将公共模块分离出去
         */
        /*new webpack.optimize.CommonsChunkPlugin({
            name: ['router', 'vendor'],
            minChunks: Infinity
        }),*/
        //插件项
        new webpack.ProvidePlugin({
            'React': 'react',
            'ReactDOM': 'react-dom',
        }),
        /*
         * 压缩
         */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false
            }
        })
    ]
}

deps.forEach(function (dep) {
    let depPath = path.resolve(node_modules_dir, dep);
    config.resolve.alias[dep.split(path.sep)[0]] = depPath;
    config.module.noParse.push(depPath);
});

module.exports = config;