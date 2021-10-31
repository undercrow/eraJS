import * as assert from "../../assert";
import Variable from "../expr/variable";
export default async function findChara(vm, arg) {
    const target = arg[0];
    assert.cond(target instanceof Variable, "1st argument of FINDCHARA should be a variable");
    const value = await arg[1].reduce(vm);
    const start = arg.length >= 3 ? await arg[2].reduce(vm) : 0n;
    assert.bigint(start, "3rd argument of FINDCHARA should be a nmber");
    const end = arg.length >= 4 ? await arg[3].reduce(vm) : BigInt(vm.characterList.length);
    assert.bigint(end, "4th argument of FINDCHARA should be a number");
    const index = await target.reduceIndex(vm);
    for (let i = start; i < end; ++i) {
        if (target.getCell(vm).get(vm, [Number(i), ...index]) === value) {
            return i;
        }
    }
    return -1n;
}
