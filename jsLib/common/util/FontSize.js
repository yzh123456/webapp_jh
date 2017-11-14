/**
 * Created by hua on 2016/12/13.
 */
/*
* 注意：使用此js的时候，秩序将其引进html页面中，进行相应的rem布局
* */
export default class FontSize {
    getFontSize(){
        // 设计稿 750px
        let width = document.documentElement.clientWidth;
        let fontSize = (width / 750) * 100;
        document.getElementsByTagName("html")[0].style.fontSize = fontSize + "px";
        //return fontSize + "px";
    }
    setFontSize(){
        window.addEventListener("resize",this.getFontSize());
    }
}