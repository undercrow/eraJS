import * as assert from "../../assert";
import Variable from "../expr/variable";
const LARGE_INT = 2n ** 60n;
export default async function minArray(vm, arg) {
    const target = arg[0];
    assert.cond(target instanceof Variable, "1st argument of MINARRAY should be a variable");
    assert.cond(target.getCell(vm).type === "number", "1st argument of MINARRAY should be a number variable");
    const start = arg.length >= 2 ? await arg[1].reduce(vm) : 0n;
    assert.bigint(start, "2nd argument of MINARRAY should be a number");
    const end = arg.length >= 3 ? await arg[2].reduce(vm) : LARGE_INT;
    assert.bigint(end, "3rd argument of MINARRAY should be a number");
    const varSize = target.getCell(vm).length(0);
    const realEnd = end > varSize ? BigInt(varSize) : end;
    let result = LARGE_INT;
    for (let i = start; i < realEnd; ++i) {
        const value = target.getCell(vm).get(vm, [Number(i)]);
        result = result > value ? value : result;
    }
    return result;
}
