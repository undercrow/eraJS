import { assert, assertNumber } from "../../assert";
import Variable from "../expr/variable";
export default function sumArray(vm, arg) {
    const target = arg[0];
    assert(target instanceof Variable, "1st argument of SUMARRAY should be a variable");
    assert(target.getCell(vm).type === "number", "1st argument of SUMARRAY should be a number variable");
    const start = arg.length >= 2 ? arg[1].reduce(vm) : 0;
    assertNumber(start, "2nd argument of SUMARRAY should be a number");
    const end = arg.length >= 3 ? arg[2].reduce(vm) : Infinity;
    assertNumber(end, "3rd argument of SUMARRAY should be a number");
    let result = 0;
    for (let i = start; i < Math.min(end, target.getCell(vm).length(0)); ++i) {
        result += target.getCell(vm).get(vm, [i]);
    }
    return result;
}
