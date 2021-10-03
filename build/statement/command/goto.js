import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg1R1(U.Identifier);
export default class Goto extends Statement {
    static parse(raw) {
        const target = PARSER.tryParse(raw);
        return new Goto(target);
    }
    target;
    constructor(target) {
        super();
        this.target = target;
    }
    *run(vm) {
        const target = this.target.toUpperCase();
        const context = vm.context();
        if (!context.fn.thunk.labelMap.has(target)) {
            throw new Error(`Label ${target} does not exist`);
        }
        return {
            type: "goto",
            label: target,
        };
    }
}
