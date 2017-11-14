/**
 * Created by yqx on 2016/12/8.
 */
import {render} from "react-dom";
import {ReceiptCardList} from "./receiptCardList";
import {Loading} from '../common/components/Loading';
import init from "../common/Common"
new init();
render(
    <section>
        {/*<Loading taskCount="1" content=""/>*/}
        <ReceiptCardList/>
    </section>
    ,
    document.querySelector("#receiptCard")
);
