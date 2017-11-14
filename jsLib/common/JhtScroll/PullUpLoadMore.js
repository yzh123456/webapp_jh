/**
 * Created by WQ on 2016/12/22.
 */
import {Component} from "react";

let stPrompt = { "display": "block", "textAlign":"center", "height":"2.0rem"};
let stPromptTxt = { "fontSize": "0.26rem", "padding":"0.7rem 0 0 0", "color":"#959595"};
let stLoading = {"display": "none",  "textAlign":"center", "lineHeight":"1.5rem", "fontSize": "0.26rem", "color":"#959595"};
let stImg = {"width":"0.5rem", "height":"0.5rem","verticalAlign":"middle"};

let eventTargetInitY = 0;   //记录触摸开始时触摸目标的Y坐标，用于判断是上拉还是下拉
let that = "";             //保存PullUpDown组件的this，使得在外部可以访问
let listenEl = "";         //监听触摸拉动事件的元素
let eventTargetY = 0;      //记录触摸元素的Y坐标

export class PullUpLoadMore extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.executeLoading = this.executeLoading.bind(this);
        this.loadMoreFinishAuto = this.loadMoreFinishAuto.bind(this);
        this.listenInertiaScroll = this.listenInertiaScroll.bind(this);

        this.touchStartHandler = this.touchStartHandler.bind(this);
        this.touchMoveHandler = this.touchMoveHandler.bind(this);
        this.touchEndHandler = this.touchEndHandler.bind(this);
    }

    /**
     * 点击加载
     */
    handleClick() {
        console.log("点击加载");
        this.executeLoading();
    }

    /**
     * 执行加载事件
     */
    executeLoading() {
        this.refs.prompt.style.display = "none";
        this.refs.loading.style.display = "block";     //显示正在加载
        typeof this.props.fn === "function" ? this.props.fn():console.log("回调函数类型错误");  //执行事件
        if (this.props.over && this.props.over == "auto") {                                       //结束加载中（不传值auto则不结束，由用户控制结束加载中）
            this.loadMoreFinishAuto();
        }
    }

    /*
     * 结束 加载中( 自动结束)
     */
    loadMoreFinishAuto() {
        let pointer = this;
        setTimeout(function () {
            pointer.refs.loading.style.display = "none";
            pointer.refs.prompt.style.display = "block";
        }, 1500);
    }

    /**
     * 触摸开始事件句柄
     */
    touchStartHandler() {
        eventTargetInitY = event.targetTouches[0].pageY;
        this.refs.stPromptTxt.innerText = "上拉加载";    //若showNoMoreData被调用，则提示内容会一直为“无更多内容”，但切换页签和栏目时需要重置提示
        listenEl.removeEventListener("scroll",this.listenInertiaScroll, false);     //监听惯性滚动没有触发加载时，移除监听事件句柄
    }

    /**
     * 触摸移动事件句柄
     */
    touchMoveHandler() {
        if (this.refs.loading.style.display == "block") {  //如果加载在进行中，则不响应
            return ;
        }
        eventTargetY = event.targetTouches[0].pageY;
        if(eventTargetY < eventTargetInitY) {                  //相对touch位置是上拉，接下来判断是否是上拉加载
            let scrollBarHeight =  parseInt(document.defaultView.getComputedStyle(listenEl,null).height.split("px")[0]);
            if ( listenEl.scrollHeight  <= listenEl.scrollTop + scrollBarHeight + 20) {
                console.log("拖动到底加载");
                this.executeLoading();
            }
        }
    }

    /*
     * 监听触摸结束后滚动条根据惯性滚动
     */
    listenInertiaScroll() {
        let scrollBarHeight =  parseInt(document.defaultView.getComputedStyle(listenEl,null).height.split("px")[0]);
        if ( listenEl.scrollHeight  <= listenEl.scrollTop + scrollBarHeight + 40) {
            console.log("由于惯性滚动到底加载");
            this.executeLoading();
            listenEl.removeEventListener("scroll",this.listenInertiaScroll, false);       //监听惯性滚动导致触发加载时，移除监听事件句柄
        }
    }

    /**
     * 触摸结束事件句柄
     */
    touchEndHandler() {
        let pointer = this;
        setTimeout(function () {         //12ms后再去监听滚动条，给加载中DIV一定时间来完成显示（假如其他方式已经触发加载）
            if (pointer.refs.loading.style.display == "block") {  //如果已经触发加载，则不需要监听滚动条了
                return ;
            }
            if(eventTargetY < eventTargetInitY) {                    //相对touch位置是上拉
                listenEl.addEventListener("scroll", pointer.listenInertiaScroll, false); //监听滚动条
            }
        }, 12);
    }

    componentDidMount() {
        listenEl = document.getElementById(this.props.element);
        that = this;
        //监听触摸开始事件
        listenEl.addEventListener("touchstart", this.touchStartHandler);
        //监听触摸移动事件
        listenEl.addEventListener("touchmove", this.touchMoveHandler);
        //监听触摸结束事件（用于用力拖拉松手时滚动条由于惯性滑动到底部触发加载）
        listenEl.addEventListener("touchend", this.touchEndHandler);
    }

    componentWillUnmount() {
        console.log("上拉加载组件将卸载，解绑原生事件");
        listenEl.removeEventListener("touchstart", this.touchStartHandler);
        listenEl.removeEventListener("touchmove", this.touchMoveHandler);
        listenEl.removeEventListener("touchend", this.touchEndHandler);
    }

    render() {
        let imgPath = window.location.href.split('/src/')[0] + "/src/common/image/pic_refreshing.gif";
        return (
            <div>
                <div ref="prompt" style={stPrompt} onClick={this.handleClick}>
                    <span ref="stPromptTxt" style={stPromptTxt}>上拉加载</span>
                </div>
                <div ref="loading" style={stLoading} > <img src={imgPath} style={stImg} />
                    &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;  <span>正在加载...</span> </div>
            </div>
        )
    }
}



/*
 * 结束 加载中( 由组件引入方控制结束)
 */
export function loadMoreFinish() {
    setTimeout(function () {
        that.refs.prompt.style.display = "block";
        that.refs.loading.style.display = "none";
    }, 100);
}

/*
 * 已无更多数据可加载
 */
export function showNoMoreData() {
    that.refs.stPromptTxt.innerText = "无更多内容";
}

