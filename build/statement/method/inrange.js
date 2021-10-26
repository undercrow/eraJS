import * as assert from "../../assert";
export default function inRange(vm, arg) {
    const value = arg[0].reduce(vm);
    assert.number(value, "1st argument of INRANGE should be a number");
    const min = arg[1].reduce(vm);
    assert.number(min, "2nd argument of INRANGE should be a number");
    const max = arg[2].reduce(vm);
    assert.number(max, "3rd argument of INRANGE should be a number");
    return min <= value && value <= max ? 1 : 0;
}
