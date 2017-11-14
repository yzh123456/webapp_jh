import { Component,createClass} from "react";
var inputRecord = (localStorage.getItem("inputRecord") || "").split(",");
inputRecord = inputRecord[0]=="" ? []:inputRecord;
var inputRecordover=[];
class Search extends Component {
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:""
        };
        this.state = this.stateObj;
    }
    componentDidMount() {
        let before = this.props.before;
        // document.querySelector(".input1").addEventListener("click",this.clickInput1);
    }
    clearAll(){
        localStorage.removeItem("inputRecord");
        this.refs.clearAll.innerHTML="";
        this.refs.clearButton.className="hide";
        inputRecord=[];
    }
    clickLockInputCarOk(){
        let key = this.refs.searchInput.value;
        this.props.handel(key);
        if (this.refs.searchInput.value != '' || this.refs.searchInput.value != null ) {
            this.refs.clearButton.className="clear";
            for ( var i = 0; i < inputRecord.length; i++) {
                if(inputRecord[i] == this.refs.searchInput.value)
                    return;
            }
            localStorage.removeItem("inputRecord");
            if(this.refs.searchInput.value != ""){
                inputRecord.push(this.refs.searchInput.value);
            }
            localStorage.setItem("inputRecord",inputRecord.join(","));
        }
        this.refs.searchInput.value="";
    };
    clickLi(param){
        let key = param;
        this.props.handel(key);
    }
	render() {
        var auto = false;
        if (inputRecord.length > 0 && inputRecord[0] != "") {
            auto = true;
            $(".historyCode").empty();
            if(inputRecord.length>10){
                for ( var int = inputRecord.length -1; int >= inputRecord.length -10; int--) {
                    if(inputRecord[int] != "" && inputRecord[int] != null)
                        inputRecordover.push(inputRecord[int])
                };
            }else{
                for ( var int = inputRecord.length -1; int >= 0; int--) {
                    if(inputRecord[int] != "" && inputRecord[int] != null)
                        inputRecordover.push(inputRecord[int])
                };
            }
        };
        let styleHide={"height":"100%","width":"100%","background":"#f0eff5","position":"fixed","top":"0","left": "0","zIndex":"111"};
        let message = this.props.message;
        let copemlt = this.props.copemlt;
        if(message==""){
            message = "停车场";
        }
        if(copemlt){
            styleHide={"display":"none","height":"100%","width":"100%","background":"#f0eff5","position":"fixed","top":"0","left": "0","zIndex":"111"};
        }
        return (
         <div style={styleHide} id="search">
            <div className="search_counp">
                <div className="search_counp_div">
                    <input type="text" placeholder={ message } ref="searchInput"/>
                    <div className="search_buttom" onClick={this.clickLockInputCarOk.bind(this)}>查询</div>
                </div>
            </div>
            <div className="search_message">最近搜过</div>
            <ul ref="clearAll" className="historyCode">
                auto==true?({ inputRecordover.map((dataServiceList, i) => {
                    return <div key={ `list-${ i }` }>
                        <li onClick={this.clickLi.bind(this,dataServiceList)}>{dataServiceList}</li>
                    </div>
                 })
                }):(<div></div>)
            </ul>
            <div className="clear" ref="clearButton">
               <button onClick={this.clearAll.bind(this)}>清空所有记录</button>
            </div>
        </div>
        )
	}
}

 function _poptip(mess) {
    $("#_poptip").html(mess);
    $("#_poptip").fadeIn(400, function() {
        setTimeout(function() {
            $("#_poptip").fadeOut('slow');
        }, 1200);
    });
};
export { Search };
