import * as assert from "../../assert";
export default async function inRange(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.bigint(value, "1st argument of INRANGE should be a number");
    const min = await arg[1].reduce(vm);
    assert.bigint(min, "2nd argument of INRANGE should be a number");
    const max = await arg[2].reduce(vm);
    assert.bigint(max, "3rd argument of INRANGE should be a number");
    return min <= value && value <= max ? 1 : 0;
}
