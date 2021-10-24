import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR0(X.expr);
export default class DelChara extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const indexList = this.arg.get().map((c) => c.reduce(vm));
        indexList.forEach((index) => assert.number(index, "Character index should be an integer"));
        indexList.sort();
        indexList.reverse();
        for (const index of indexList) {
            vm.characterList.splice(index, 1);
        }
        return null;
    }
}
