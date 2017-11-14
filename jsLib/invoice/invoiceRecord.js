
import { Component,createClass} from "react";
import JHTAJAX from "../common/util/JHTAjax";
import { Nothing } from "../common/components/Nothing"
import { operateMask } from "../common/components/Loading";
import { PullDownRefresh } from "../common/jhtScroll/PullDownRefresh";
import { PullUpLoadMore,showNoMoreData } from "../common/jhtScroll/PullUpLoadMore";
import {Record} from "./Record";
let dataTmp = {};
let that = "";
let hasNoMore = true;
let pageIndex = 1;
class InvoiceRecord extends Component{
    constructor(...args) {//构造器
        super(...args);//调用父级的构造器
        this.stateObj = {// 需要有在 构造器里面对 state 重新赋值
            stateObjList:"",
            loading: 0,
            asyco :0,
            tradeStatus:5
        };
        this.state = this.stateObj;
    }
    componentWillMount(){
        this.poperateMask(1);
    }

    poperateMask(pageIndex){
        let userId = window.USERINFO.USER.USER_ID;
        let myDate = new Date();
        let endTime = myDate.getFullYear() + "-" + (myDate.getMonth()+1)+ "-" +myDate.getDate();
        let obj = {
            dataItems:[
            ]
        };
        let attr = {
            attributes:{
                /*userId:userId,
                startTime:"1970-07-01",
                endTime:"9999-07-01",
                pageSize : 10,
                pageIndex : pageIndex,*/
				USER_ID:userId,
				// BEGIN_TIME:"1970-07-01 00:00:00",
                // END_TIME:"9999-07-01 00:00:00",
				PAGE_SIZE : 10,
				PAGE_INDEX : pageIndex,
            }
        };
        obj.dataItems.push(attr);
        JHTAJAX({
            data: {
                serviceId:"ac.invoice.querylinvocie",
                attributes:obj.dataItems[0].attributes
                // serviceId:"JSCSP_ORDER_USERVERSIONRECORDS", //查询账单的serviceId
                // dataItems:obj.dataItems
            },
            dataType : 'json',
            type:'post',

            success : function(data) {
                operateMask("hide");
                if(pageIndex==1){
                    dataTmp = {};
                }
                if (data.dataitems && data.dataitems.length > 0) {
                    hasNoMore=true;
                    if((data.dataitems.length)%10!==0){
                        showNoMoreData();
                    }
                    dataTmp = data.dataitems;
                }else{
                    hasNoMore=false;
                    showNoMoreData();
                }
                this.stateObj.stateObjList = dataTmp;
                this.setState(this.stateObj);
            }.bind(this)
        });
    }
    componentDidMount() {
        that = this;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.liked !== undefined){
            operateMask("show");
            this.poperateMask(nextProps.liked,1);
        }
    }
    refreshData() {
		console.log("refreshing");
		pageIndex=1;  //页码
		that.poperateMask(pageIndex);
	}
    loadMoreData() {
        pageIndex++;  //页码
        that.poperateMask(pageIndex);
    }
    render() {
        let dataServiceList = this.state.stateObjList;
        let remK = (document.documentElement.clientWidth / 750) * 100;
        let topDivHei = parseInt(document.documentElement.clientHeight - 0.97*remK);
        console.log(topDivHei);

        let loadDown = {"height":`${document.documentElement.clientHeight}px`};
        let el = <div className="flowLine" ref="flowLine"></div>;
        if(dataServiceList.length>0){
            el = <div className="flowLine" ref="flowLine"></div>;
        }else{
            el = <div className="hide" ref="flowLine"></div>;
        }
        return (
			<div className="list_div">
				<PullDownRefresh element="top_div" fn={this.refreshData} over="auto"/>
				<div className="top_div" id="top_div" >
                    { el }
                    {
                        dataServiceList.length>0?(
                            dataServiceList.map((dataServiceList, i)=> {
                                return <div key={ `list-${ i }` }>
									<Record dataServiceList={dataServiceList} />
								</div>
                            })
                        ):( <div><Nothing content="亲，没有查询到您的开票记录哦" /><div style={loadDown}></div></div>)
                    }
					<PullUpLoadMore element="top_div" fn={this.loadMoreData} over="auto" />
				</div>
			</div>
        )
    }
}
export { InvoiceRecord };
