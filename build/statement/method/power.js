import * as assert from "../../assert";
export default function power(vm, arg) {
    const base = arg[0].reduce(vm);
    assert.number(base, "1st argument of POWER must be a number");
    const exponent = arg[1].reduce(vm);
    assert.number(exponent, "2nd argument of POWER must be a number");
    return base ** exponent;
}
