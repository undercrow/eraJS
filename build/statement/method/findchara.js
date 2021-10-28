import * as assert from "../../assert";
import Variable from "../expr/variable";
export default async function findChara(vm, arg) {
    const target = arg[0];
    assert.cond(target instanceof Variable, "1st argument of FINDCHARA should be a variable");
    const value = await arg[1].reduce(vm);
    const start = arg.length >= 3 ? await arg[2].reduce(vm) : 0;
    assert.number(start, "3rd argument of FINDCHARA should be a number");
    const end = arg.length >= 4 ? await arg[3].reduce(vm) : vm.characterList.length;
    assert.number(end, "4th argument of FINDCHARA should be a number");
    const index = await target.reduceIndex(vm);
    for (let i = start; i < end; ++i) {
        if (target.getCell(vm).get(vm, [i, ...index]) === value) {
            return i;
        }
    }
    return -1;
}
