import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR0(E.expr);
export default class DelChara extends Statement {
    charaters;
    constructor(raw) {
        super();
        this.charaters = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const indexList = this.charaters.get().map((c) => c.reduce(vm));
        indexList.forEach((index) => assertNumber(index, "Character index should be an integer"));
        indexList.sort();
        indexList.reverse();
        const charaNum = vm.getValue("CHARANUM");
        for (const index of indexList) {
            vm.characterList.splice(index, 1);
            charaNum.set(vm, charaNum.get(vm, []) - 1, []);
        }
        return null;
    }
}
