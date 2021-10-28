import * as assert from "../../assert";
export default async function abs(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.number(value, "1st argument of ABS must a be number");
    return Math.abs(value);
}
