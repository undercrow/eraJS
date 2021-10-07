import { assert, assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class CsvAbl extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [numExpr, indexExpr] = this.arg.get();
        const num = numExpr.reduce(vm);
        assertNumber(num, "1st Argument of CSVABL should be an integer");
        const index = indexExpr.reduce(vm);
        assertNumber(index, "2nd Argument of CSVABL should be an integer");
        const character = vm.code.data.character.get(num);
        assert(character != null, `Character #${num} does not exist`);
        const result = character.abilities.get(index) ?? 0;
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
