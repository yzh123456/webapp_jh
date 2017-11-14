/**
 * Created by yqx on 2017/5/5.
 */
import {render} from "react-dom";
import {Loading} from "../common/components/Loading";
import Common from "../common/Common";
import {InvoiceRecord} from "./invoiceRecord";
new Common();
render(
    <section>
        <Loading taskCount="1" content=""/>
        <InvoiceRecord/>
    </section>
    ,
    document.querySelector("#invoiceRecord")
);