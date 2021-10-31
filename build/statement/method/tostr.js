import * as assert from "../../assert";
export default async function toStr(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.bigint(value, "1st Argument of TOSTR should be a number");
    return value.toString();
}
