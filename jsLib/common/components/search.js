import {Component, createClass} from "react";
import {Link} from "react-router";
import JHT from "../util/JHT";
/*import init from "../Common"
new init();*/
let searchName = "";
let inputRecord = (localStorage.getItem("inputRecord") || "").split(",");
inputRecord = inputRecord[0] == "" ? [] : inputRecord;
let that = "";
let find = true;

class Search extends Component {
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList: "",
            name:""
        };
        document.title="搜索";
        this.pathdata2 = {
            // pathname: "/search/mapMain",
            pathname: "/search/"+this.props.location.query.from,
            query: {
                name:this.stateObj.name
            }
        };
        this.jht = new JHT();
        this.searchResult = {
            pathname: "/search/searchDetail",
            query: {
                name:this.stateObj.name,
                lat : this.props.location.query.lat,
                lng : this.props.location.query.lng,
                clientId:this.props.location.query.clientId,
                USER_ID:this.props.location.query.USER_ID,
                APP_TYPE:this.props.location.query.APP_TYPE,
                TEL:this.props.location.query.TEL,
                from:this.props.location.query.from

            }
        };

        this.state = this.stateObj;
    }
    componentDidMount() {
        that = this;
        // let thirdSDK = new ThirdSDK(['getLocation']);
        // thirdSDK.wxCall({
        //     serviceId:['getLocation'],
        //     success : function(res){
        //         window.USERINFO.USER.latitude = res.latitude;
        //         window.USERINFO.USER.longitude = res.longitude;
        //     }
        // });
    }
    clearAll() {
        localStorage.removeItem("inputRecord");
        this.refs.clearAll.innerHTML = "";
        this.refs.clearButton.className = "hide";
        inputRecord = [];
    }
    clickLockInputCarOk() {
        find=false;
        let key = this.refs.searchInput.value;
        this.pathdata2.query.name = key;
        this.searchResult.query.name = key;
        searchName = key;
        // this.placeSearch(1);
        if (this.refs.searchInput.value != '' || this.refs.searchInput.value != null) {
            this.refs.clearButton.className = "clear";
            for (let i = 0; i < inputRecord.length; i++) {
                if (inputRecord[i] == this.refs.searchInput.value)
                    return;
            }
            localStorage.removeItem("inputRecord");
            if (this.refs.searchInput.value != "") {
                inputRecord.push(this.refs.searchInput.value);
            }
            localStorage.setItem("inputRecord", inputRecord.join(","));
        }
        this.refs.searchInput.value = "";
    };
    clickLi(param) {
           let key = param;
            // this.props.handel(key);
            find=false;
            searchName = key;
            this.searchResult.query.name = key;
            // this.placeSearch(1);
    }
    render() {
        let searchFrom;
        let html = true;
        if(this.props.location&&this.props.location.query&&this.props.location.query.fn=="true"){
            html=true;
        }else{
            html = false;
        }
        if(this.props.location&&this.props.location.query&&this.props.location.query.from){
            searchFrom=this.props.location.query.from;
        }

        let dataServiceList = this.state.stateObjList;
        let off = true;
        if (dataServiceList !== "" && dataServiceList.overdue && dataServiceList.overdue.length > 0) {
            dataServiceList = dataServiceList.overdue;
            off = true;
        } else {
            off = false;
        }
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97 * remK);
        let style2 = {"height": `${topDivHei}px`,"overFlow":"auto"};
        let loadDown = {"height": `${document.documentElement.clientHeight}px`};
        let auto = false;
        let inputRecordover = [];
        if (inputRecord.length > 0 && inputRecord[0] != "") {
            auto = true;
            inputRecordover = [];
            if (inputRecord.length > 10) {
                for (let int = inputRecord.length - 1; int >= inputRecord.length - 10; int--) {
                    if (inputRecord[int] != "" && inputRecord[int] != null)
                        inputRecordover.push(inputRecord[int])
                };
            } else {
                for (let int = inputRecord.length - 1; int >= 0; int--) {
                    if (inputRecord[int] != "" && inputRecord[int] != null)
                        inputRecordover.push(inputRecord[int])
                };
            }
        };
        let styleHide = {
            "height": "100%",
            "width": "100%",
            "background": "#f0eff5",
            "position": "fixed",
            "top": "0",
            "left": "0",
            "zIndex": "111"
        };

        let styleFind = {
            "height": "100%",
            "width": "100%",
            "top": "0",
            "left": "0",
            "zIndex": "111",
            "display": "none",
        };
        if(find==false){
            styleFind = {
                "height": "100%",
                "width": "100%",
                "top": "0",
                "left": "0",
                "zIndex": "111"
            };
            styleHide = {
                "display": "none",
                "height": "100%",
                "width": "100%",
                "background": "#f0eff5",
                "position": "fixed",
                "top": "0",
                "left": "0",
                "zIndex": "111"
            };
            find=true;
        }
        return (
            <div id="search">
                <div style={styleHide}>
                    <div className="search_counp">
                        <div className="search_counp_div">
                            <input type="text" placeholder="停车场" ref="searchInput"/>
                            {
                                html==true?(<Link onClick={this.clickLockInputCarOk.bind(this)} to={this.searchResult} ></Link>):(<Link onClick={this.clickLockInputCarOk.bind(this)} to={this.pathdata2} ></Link>)
                            }
                        </div>
                    </div>
                    <div className="search_message">最近搜过</div>
                    <ul ref="clearAll" className="historyCode">
                        {
                            auto == true ? ( inputRecordover.map((dataServiceList, i) => {
                                    return (
                                        <div key={ `list-${ i }` }>
                                            {
                                                html == true ? (<Link to={{pathname: "/search/searchDetail",query: {name:dataServiceList,lat:this.props.location.query.lat,
                                                        lng:this.props.location.query.lng,from:this.props.location.query.from,clientId:this.props.location.query.clientId,USER_ID:this.props.location.query.USER_ID,APP_TYPE:this.props.location.query.APP_TYPE,TEL:this.props.location.query.TEL}}} key={ `list-${ i }` }><span className="overspan"></span><span className="overspansecond">{dataServiceList}</span></Link>
                                                ):(<Link to={{pathname: "/search/"+this.props.location.query.from,query: {name:dataServiceList}}} key={ `list-${ i }` }><span className="overspan"></span><span className="overspansecond">{dataServiceList}</span></Link>)
                                            }
                                        </div>)
                                })
                            ) : (<div></div>)
                        }
                    </ul>
                    <div className="clear" ref="clearButton">
                        <button onClick={this.clearAll.bind(this)}>清空所有记录</button>
                    </div>
                </div>
            </div>
        )
    }
}

function _poptip(mess) {
    let pop = document.getElementById("_poptip");
    pop.html(mess);
    pop.fadeIn(400, function () {
        setTimeout(function () {
            pop.fadeOut('slow');
        }, 1200);
    });
};
export {Search};
