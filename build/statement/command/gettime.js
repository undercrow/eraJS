import dayjs from "dayjs";
import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class GetTime extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        const now = dayjs();
        vm.getValue("RESULT").set(vm, parseInt(now.format("YYYYMMDDHHmmssSSS")), [0]);
        vm.getValue("RESULTS").set(vm, now.format("YYYY年MM月DD日 HH:mm:ss"), [0]);
        return null;
    }
}
