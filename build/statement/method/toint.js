import * as assert from "../../assert";
export default async function toInt(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.string(value, "1st Argument of TOINT should be a string");
    const result = Number(value);
    return isNaN(result) ? 0 : result;
}
