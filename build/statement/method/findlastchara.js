import * as assert from "../../assert";
import Variable from "../expr/variable";
export default async function findLastChara(vm, arg) {
    const target = arg[0];
    assert.cond(target instanceof Variable, "1st argument of FINDLASTCHARA should be a variable");
    const value = await arg[1].reduce(vm);
    const start = arg.length >= 3 ? await arg[2].reduce(vm) : 0n;
    assert.bigint(start, "3rd argument of FINDLASTCHARA should be a number");
    const end = arg.length >= 4 ? await arg[3].reduce(vm) : BigInt(vm.characterList.length);
    assert.bigint(end, "4th argument of FINDLASTCHARA should be a number");
    const index = await target.reduceIndex(vm);
    for (let i = end - 1n; i >= start; --i) {
        if (target.getCell(vm).get(vm, [Number(i), ...index]) === value) {
            return i;
        }
    }
    return -1n;
}
