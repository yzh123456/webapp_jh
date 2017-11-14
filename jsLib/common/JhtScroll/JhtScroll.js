/**
 * Created by yqx on 2017/1/6.
 */
import IScroll from "../iscroll-probe";
export class JhtScroll {
    constructor(myScroll){
        //this.myScroll =  myScroll;
    }
    initScroll(el="body",op){
        this.myScroll = new IScroll( el , {
            preventDefault: op.preventDefault || false,                 // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
            mouseWheel: op.mouseWheel || true,                          //是否监听鼠标滚轮事件
            bounceTime: op.bounceTime || 600,                            //弹力动画持续的毫秒数
            probeType: op.probeType || 3,                               // 滚动事件的探测灵敏度，1-3，越高越灵敏，兼容性越好，性能越差
            zoom: op.zoom || false,                                     // 禁止缩放
            bounce: op.bounce || true,                                  // 拖拽超过上下界后出现弹射动画效果，用于实现下拉
            scrollbars: op.scrollbars || false                          // 展示滚动条
        });
    }
    startScroll(){
        this.myScroll.on('scrollStart', function(){console.log("开始")});
    }
    onScroll(op,fn){
        this.myScroll.on('scroll', function(){
            if (op === "pullDown" && this.y > 5) {
                //下拉刷新效果
                if(typeof fn === "function") fn();
                console.log("下拉");
            } else if (op === "pullUp" && this.y < (this.maxScrollY - 5)) {
                //上拉刷新效果
                if(typeof fn === "function") fn();
                console.log("上拉");
            };
        });
    }
    onScrollEnd(fn){
        this.myScroll.on('scrollEnd', function(){
            if(typeof fn === "function") fn();
            console.log("结束")
        });
    }
}