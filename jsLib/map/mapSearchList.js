import { Component,createClass} from "react";

import { Nothing } from "../common/components/Nothing"

import { Link } from "react-router";

import { AppBridge } from "../common/util/AppBridge";
import { operateMask } from "../common/components/Loading";
import { PullDownRefresh } from "../common/jhtScroll/PullDownRefresh";

//搜索框，搜索周围停车场
function SecrchByKeyword(flag) {
    if($('#keyword').val().replace(/\s/g,"").length <=0){
        poptip('请先输入停车场名称');
        return false;
    }

    var parkList;
    if (localStorage.getItem("SearchParkName")) {
        parkList = localStorage.getItem("SearchParkName").split(',');
        localStorage.removeItem("SearchParkName");
    } else {
        parkList = [];
    }

    var obj = new Object();
    obj.unionid = unionid;
    obj.longitude = beforeLocationX || "0";
    obj.latitude = beforeLocationY || "0";
    obj.beforelongitude = beforeLocationX || "0";
    obj.beforelatitude = beforeLocationY || "0";
    obj.canton = city;
    obj.name = encodeURI($('#keyword').val());
    obj.synch_signal = new Date().getTime() + '';

    $.ajax({
        url: SEARCH_PARK_POSITION,
        cache: false,
        data: obj,
        type: 'get',
        dataType: 'json',
        success: function(data) {
            if (data.resultCode == "0" && data.dataItems != null && data.dataItems.length > 0) {
                hrefPage('#searchList');
                $("#searchList_ul").empty();
                for (var i = 0; i < data.dataItems.length; i++) {
                    var tmp = data.dataItems[i].attributes;
                    searchListPark[i] = data.dataItems[i];
                    var tp = $("#searchList_li").clone();
                    tp.show();
                    tp.removeAttr('id');
                    tp.find("#searchList_li_name").html(tmp.name).removeAttr('id');
                    parseInt(tmp.distance) > 1000 ?
                        tp.find("#searchList_li_dis").html((parseInt(tmp.distance) / 1000).toFixed(2) + 'km').removeAttr('id') :
                        tp.find("#searchList_li_dis").html(tmp.distance.toFixed(0) + 'm').removeAttr('id');
                    tp.find("#searchList_li_addr").html(tmp.address).removeAttr('id');
                    tp.find("#searchList_li_price").html(tmp.park_qh).removeAttr('id');
                    if(tmp.emptyparkplacecount == 0 || tmp.emptyparkplacecount < -1){
                        tp.find("#searchList_li_beds").html('0').css("color","#ccc").removeAttr('id');
                    }else if(tmp.emptyparkplacecount == -1){
                        tp.find("#searchList_li_beds").html(tmp.parkplacecount).css("color","#ccc").removeAttr('id');
                    }else{
                        tp.find("#searchList_li_beds").html(tmp.emptyparkplacecount);
                    }
                    tp.find("#searchList_li_totalbeds").html(tmp.parkplacecount).removeAttr('id');
                    $("#searchList_ul").append(tp);
                    if (tmp.emptyparkplacecount / tmp.parkplacecount > 0.5) {
                        tp.find(".fp_num_0").removeClass().addClass("fp_num_0 green");
                    } else if (tmp.emptyparkplacecount >= 10) {
                        tp.find(".fp_num_0").removeClass().addClass("fp_num_0 orange");
                    } else if (tmp.emptyparkplacecount > 0) {
                        tp.find(".fp_num_0").removeClass().addClass("fp_num_0 red");
                    } else {
                        tp.find(".fp_num_0").removeClass().addClass("fp_num_0 gray");
                    }
                }
                parkDetailTarget = 2;

                //将搜索记录append到historyCode中去。                
                if (flag == undefined || !flag) {                   
                    if (parkList.length > 0) {
                        var flag = false;
                        for (var k in parkList) {
                            if ($('#keyword').val() == parkList[k]) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            parkList.push($('#keyword').val());
                        }
                    } else {
                        parkList.push($('#keyword').val());
                    }                   
                    localStorage.setItem("SearchParkName", parkList.join(','));             
                }
            } else if (data.resultCode == "0" && data.dataItems.length == 0) {
                poptip('没有搜索到相应的停车场，重新输入');
            } else if (data.resultCode == "1" && (data.message == "beforelongitude不能为空" || data.message == "beforelatitude不能为空")){
                poptip('获取当前位置失败，请重试');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            poptip('查询停车场失败，请重试');  
        }
    });
}
export { SecrchByKeyword };
