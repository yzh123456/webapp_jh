/**
 * Created by ll on 2016/12/19.
 */
import {Component} from "react";
import JHT from "../util/JHT";
class Nothing extends Component{
    render() {
        let style1 = {'textAlign' : 'center',"margin":"10px 15px 0 15px" , "fontSize":"0.3rem" , "fontFamily": "OfficialScript" };
        let rount = {"color":"#ADADAD","width":"100%","position": "fixed","top": "33%" };
        let jht=new JHT();
        let obj={
            text:this.props.content || "",
            color:"#959595",
            font:"隶书",
            fontSize:'15'
        };
        let fontSize = (obj.fontSize||16);
        let imgPath = (jht.basePath().jspsnURL || window.location.href.split('/webapp/')[0]) + "/webapp/src/common/image/hasNo.png";
        let hasNo = {"backgroundImage": "url("+{imgPath}+")","backgroundRepeat": "noRepeat","backgroundSize": "contain","width": "28%","height": "2.2rem","marginLeft": "36%","top": "33%"};
        return(
                <div style={ rount }>
                    <div className="hasNo"></div>
                    <div style={ style1 }>
                    <img style={{"width":obj.text.length*fontSize+"px"}} alt={obj.text} src={jht.txtImg(obj)}/>
                    </div>
                </div>
        )
    }
};
export { Nothing }