import * as assert from "../../assert";
export default async function power(vm, arg) {
    const base = await arg[0].reduce(vm);
    assert.number(base, "1st argument of POWER must be a number");
    const exponent = await arg[1].reduce(vm);
    assert.number(exponent, "2nd argument of POWER must be a number");
    return base ** exponent;
}
