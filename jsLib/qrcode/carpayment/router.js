/**
 * Created by hua on 2017/4/12.
 */
import { Component } from "react";
import {
    Router,//路由组建
    Route,//路由路径组建
    hashHistory,  //监听地址变化 主要监听 hash 变化
    IndexRoute //默认组建
} from "react-router";
import { CarPayMent } from "./carpayment";
import {Search} from "../../common/components/search";
import {SearchResult} from "../../map/searchDetail";
import {MapDetail} from "../../map/mapDetail";
import {VagueCar} from "./vaguecar";
class App extends Component{
    render(){
        return(
            <Router history = { hashHistory }>
                <Route path="/" component={ CarPayMent }/>
                <Route path="/vaguecar" component={ VagueCar }/>
                <Route path="/search" component={ Search }/>
                <Route path="/search/searchDetail" component={ SearchResult }/>
                <Route path="/search/searchDetail/mapDetail" component={ MapDetail }/>
            </Router>
        )
    }
}
export { App }
