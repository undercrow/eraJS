import * as assert from "../../assert";
export default function getBit(vm, arg) {
    const value = arg[0].reduce(vm);
    assert.number(value, "1st argument of GETBIT should be a number");
    const index = arg[1].reduce(vm);
    assert.number(index, "2nd argument of GETBIT should be a number");
    assert.cond(index < 53, "2nd argument of GETBIT should be less than 53");
    // eslint-disable-next-line no-bitwise
    return (value & (1 << index)) !== 0 ? 1 : 0;
}
