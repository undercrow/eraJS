import { assert, assertNumber } from "../../assert";
export default function getBit(vm, arg) {
    const value = arg[0].reduce(vm);
    assertNumber(value, "1st argument of GETBIT should be a number");
    const index = arg[1].reduce(vm);
    assertNumber(index, "2nd argument of GETBIT should be a number");
    assert(index < 32, "2nd argument of GETBIT should be less than 32");
    // eslint-disable-next-line no-bitwise
    return (value & (1 << index)) !== 0 ? 1 : 0;
}
