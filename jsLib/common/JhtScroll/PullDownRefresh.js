/**
 * Created by WQ on 2016/12/22.
 */
import {Component} from "react";

let stPrompt = {"display": "none", "textAlign": "center", "overflow":"hidden"};
let stPromptTxt = {"fontSize":"0.26rem", "color":"#959595", "position":"relative" };
let stRefresh = {"display": "none", "textAlign": "center", "height":"1.2rem", "fontSize":"0.26rem", "color":"#959595"};
let stImg = {"width":"0.5rem", "height":"0.5rem", "padding":"0.35rem 0 0.35rem 0","verticalAlign":"middle"};

let eventTargetInitY = 0;
let startY = 0;
let refreshFlag = false;   //是否刷新标志
let listenEl = "";         //监听触摸拉动事件的元素
let that = "";             //保存本组件PullDownRefresh的this，使得在组件外部可以访问

export class PullDownRefresh extends Component {
    constructor() {
        super();
        this.refreshFinishAuto = this.refreshFinishAuto.bind(this);

        this.touchStartHandler = this.touchStartHandler.bind(this);
        this.touchMoveHandler = this.touchMoveHandler.bind(this);
        this.touchEndHandler = this.touchEndHandler.bind(this);
    }

    /**
     * 触摸开始事件句柄
     */
    touchStartHandler() {
        eventTargetInitY = event.targetTouches[0].pageY;   //记录触摸开始时触摸目标的Y坐标，用于判断是上拉还是下拉
        startY = eventTargetInitY;                            //初始化下拉刷新的起点Y坐标
    }

    /**
     * 触摸移动事件句柄
     */
    touchMoveHandler() {
        if(this.refs.refreshing.style.display == "block")    //如果刷新在进行中，则不响应
            return;

        let eventTargetY = event.targetTouches[0].pageY;

        if(eventTargetY > eventTargetInitY) {     //相对touch位置是下拉，接下来判断是否是下拉刷新

            if(listenEl.scrollTop > 0) {
                startY = event.targetTouches[0].pageY; //如果不是从scrollTop=0位置开始下拉，需要重置下拉刷新起点Y坐标
            }                                            //由于不是拖动1px就触发一次事件，所以startY稍大于实际的起点Y坐标

            let dist = event.targetTouches[0].pageY - startY ;  //计算下拉刷新拉动距离   稍小于实际下拉距离

            if (listenEl.scrollTop == 0 && dist > 0){   //如果滚动条到顶的状态下下拉了一段距离，则下拉刷新动作检测成功
                event.preventDefault();     //阻止滚动条滚动

                this.refs.prompt.style.display = "block";      //显示下拉刷新提示DIV
                this.refs.prompt.style.height = `${dist/2}px`;
                this.refs.stPromptTxt.style.top= `${dist/2-40}px`;

                if(dist >= 120) {            //下拉刷新动作检测成功后，如果touch结束时下拉距离达到100px，则触发刷新
                    refreshFlag = true;
                    this.refs.stPromptTxt.innerText = "释放立即刷新";
                }else{
                    refreshFlag = false;
                    this.refs.stPromptTxt.innerText = "下拉即可刷新";
                }
            }
        }
    }

    /**
     * 触摸结束事件句柄
     */
    touchEndHandler() {
        this.refs.prompt.style.display = "none";            //隐藏提示

        if(refreshFlag) {
            this.refs.refreshing.style.display = "block";                                              //显示正在刷新
            typeof this.props.fn === "function" ? this.props.fn():console.log("回调函数类型错误");  //执行事件
            if (this.props.over && this.props.over == "auto") {                                        //结束正在刷新（不传值auto则不结束，由用户控制结束加载中）
                this.refreshFinishAuto();
            }
        }

        //此次touch事件结束，重置所有初始化参数
        this.refs.stPromptTxt.innerText = "下拉即可刷新";
        eventTargetInitY = 0;
        startY = 0;
        refreshFlag = false;
    }

    /*
     * 刷新结束 (自动结束)
     */
    refreshFinishAuto() {
        let pointer = this;
        setTimeout(function(){
            pointer.refs.refreshing.style.display = "none";
        },1000);
    }

    componentDidMount() {
        listenEl = document.getElementById(this.props.element);
        that = this;
        //监听触摸开始事件
        listenEl.addEventListener("touchstart",this.touchStartHandler, false);
        //监听触摸移动事件
        listenEl.addEventListener("touchmove", this.touchMoveHandler, false);
        //监听触摸结束事件
        listenEl.addEventListener("touchend", this.touchEndHandler, false);
    }

    /**
     * 组件卸载前解除绑定事件
     */
    componentWillUnmount() {
        console.log("下拉刷新组件将卸载，解绑原生事件");
        listenEl.removeEventListener("touchstart",this.touchStartHandler, false);
        listenEl.removeEventListener("touchmove",this.touchMoveHandler, false);
        listenEl.removeEventListener("touchend",this.touchEndHandler, false);
    }

    render() {
        let imgPath = window.location.href.split('/src/')[0] + "/src/common/image/pic_refreshing.gif";
        return (
            <div>
                <div ref="prompt" style={stPrompt} > <p ref="stPromptTxt" style={stPromptTxt}> 下拉即可刷新 </p> </div>
                <div ref="refreshing" style={stRefresh} > <img src={imgPath} style={stImg} />
                    &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;  <span>正在刷新...</span>
                </div>
            </div>
        )
    }
}



/*
 * 刷新结束 (由组件引入方控制结束)
 */
export function refreshFinish() {
    setTimeout(function(){
        that.refs.refreshing.style.display = "none";
    },100);
}