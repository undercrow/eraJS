import * as assert from "../../assert";
export default async function sqrt(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.number(value, "1st argument of sqrt must be a number");
    return Math.floor(Math.sqrt(value));
}
