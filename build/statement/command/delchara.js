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
    async *run(vm) {
        const arg = this.arg.get();
        const indexList = [];
        for (let i = 0; i < arg.length; ++i) {
            const index = await arg[i].reduce(vm);
            assert.number(index, `${i + 1}th argument of DELCHARA should be a number`);
            indexList.push(index);
        }
        indexList.sort();
        indexList.reverse();
        for (const index of indexList) {
            vm.characterList.splice(index, 1);
        }
        return null;
    }
}
