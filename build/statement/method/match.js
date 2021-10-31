import * as assert from "../../assert";
import Variable from "../expr/variable";
const LARGE_INT = 2n ** 60n;
export default async function match(vm, arg) {
    const target = arg[0];
    assert.cond(target instanceof Variable, "1st argument of MATCH should be a variable");
    const value = await arg[1].reduce(vm);
    const start = arg.length >= 3 ? await arg[2].reduce(vm) : 0n;
    assert.bigint(start, "3rd argument of MATCH should be a number");
    const end = arg.length >= 4 ? await arg[3].reduce(vm) : LARGE_INT;
    assert.bigint(end, "4th argument of MATCH should be a number");
    const varSize = target.getCell(vm).length(0);
    const realEnd = end > varSize ? BigInt(varSize) : end;
    let result = 0;
    for (let i = start; i < realEnd; ++i) {
        if (target.getCell(vm).get(vm, [Number(i)]) === value) {
            result += 1;
        }
    }
    return result;
}
