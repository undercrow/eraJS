import { assert, assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class ResetStain extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const numExpr = this.arg.get();
        const num = numExpr.reduce(vm);
        assertNumber(num, "1st Argument of RESET_STAIN should be an integer");
        assert(vm.characterList.length > num, `Character #${num} does not exist`);
        const character = vm.characterList[num];
        character.getValue("STAIN").reset([0, 0, 2, 1, 8]);
        return null;
    }
}
