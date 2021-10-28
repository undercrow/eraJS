import dayjs from "dayjs";
import * as U from "../../parser/util";
import Statement from "../index";
// 719162 is number of days from 0001-01-01 to 1970-01-01
const UNIX_EPOCH = 719162 * 24 * 60 * 60;
const PARSER = U.arg0R0();
export default class GetMillisecond extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        const time = dayjs(vm.external.getTime());
        vm.getValue("RESULT").set(vm, time.valueOf() - UNIX_EPOCH * 1000, [0]);
        return null;
    }
}
