import { assert, assertNumber } from "../../assert";
import Variable from "../expr/variable";
export default function findChara(vm, arg) {
    const target = arg[0];
    assert(target instanceof Variable, "1st argument of FINDCHARA should be a variable");
    const value = arg[1].reduce(vm);
    const start = arg.length >= 3 ? arg[2].reduce(vm) : 0;
    assertNumber(start, "3rd argument of FINDCHARA should be a number");
    const end = arg.length >= 4 ? arg[3].reduce(vm) : vm.characterList.length;
    assertNumber(end, "4th argument of FINDCHARA should be a number");
    const index = target.reduceIndex(vm);
    for (let i = start; i < end; ++i) {
        if (target.getCell(vm).get(vm, [i, ...index]) === value) {
            return i;
        }
    }
    return -1;
}
