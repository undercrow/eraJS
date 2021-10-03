import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.form[""]);
export default class DrawLineForm extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const value = this.arg.get().reduce(vm);
        yield {
            type: "line",
            value,
        };
        return null;
    }
}
