import * as U from "../../erb/util";
import Statement from "../index";
import AddChara from "./addchara";
const PARSER = U.arg0R0();
export default class AddDefChara extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        return yield* new AddChara(" 0").run(vm);
    }
}
