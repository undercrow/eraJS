import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class GetChara extends Statement {
    value;
    constructor(raw) {
        super();
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const value = this.value.get().reduce(vm);
        assertNumber(value, "1st argument of GETCHARA must be a number");
        for (let i = 0; i < vm.characterList.length; ++i) {
            if (vm.getValue("NO").get(vm, [i]) === value) {
                vm.getValue("RESULT").set(vm, i, [0]);
                return null;
            }
        }
        vm.getValue("RESULT").set(vm, -1, [0]);
        return null;
    }
}
