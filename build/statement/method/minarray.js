import * as assert from "../../assert";
import Variable from "../expr/variable";
export default async function minArray(vm, arg) {
    const target = arg[0];
    assert.cond(target instanceof Variable, "1st argument of MINARRAY should be a variable");
    assert.cond(target.getCell(vm).type === "number", "1st argument of MINARRAY should be a number variable");
    const start = arg.length >= 2 ? await arg[1].reduce(vm) : 0;
    assert.number(start, "2nd argument of MINARRAY should be a number");
    const end = arg.length >= 3 ? await arg[2].reduce(vm) : Infinity;
    assert.number(end, "3rd argument of MINARRAY should be a number");
    let result = 0;
    for (let i = start; i < Math.min(end, target.getCell(vm).length(0)); ++i) {
        result = Math.min(result, target.getCell(vm).get(vm, [i]));
    }
    return result;
}
