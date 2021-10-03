import { assert, assertNumber } from "../../assert";
import Variable from "../expr/variable";
export default function match(vm, arg) {
    const target = arg[0];
    assert(target instanceof Variable, "1st argument of MATCH should be a variable");
    const value = arg[1].reduce(vm);
    const start = arg.length >= 3 ? arg[2].reduce(vm) : 0;
    assertNumber(start, "3rd argument of MATCH should be a number");
    const end = arg.length >= 4 ? arg[3].reduce(vm) : Infinity;
    assertNumber(end, "4th argument of MATCH should be a number");
    let result = 0;
    for (let i = start; i < Math.min(end, target.getCell(vm).length(0)); ++i) {
        if (target.getCell(vm).get(vm, [i]) === value) {
            result += 1;
        }
    }
    return result;
}
