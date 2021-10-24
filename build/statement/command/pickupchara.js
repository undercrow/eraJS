import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR1(X.expr, X.expr);
export default class PickupChara extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const arg = this.arg.get().map((expr) => expr.reduce(vm));
        let target = -1;
        let assi = -1;
        let master = -1;
        const characterList = [];
        for (let i = 0; i < arg.length; ++i) {
            const index = arg[i];
            assert.number(index, `${i + 1}th argument of PICKUPCHARA should be a number`);
            assert.cond(index >= 0 && index < vm.characterList.length, `${i + 1}th argument of PICKUPCHARA is out of range`);
            if (index === vm.getValue("TARGET").get(vm, [])) {
                target = i;
            }
            if (index === vm.getValue("ASSI").get(vm, [])) {
                assi = i;
            }
            if (index === vm.getValue("MASTER").get(vm, [])) {
                master = i;
            }
            characterList.push(vm.characterList[i]);
        }
        vm.getValue("TARGET").set(vm, target, []);
        vm.getValue("ASSI").set(vm, assi, []);
        vm.getValue("MASTER").set(vm, master, []);
        vm.characterList = characterList;
        return null;
    }
}
