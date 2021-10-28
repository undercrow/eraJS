import * as assert from "../../assert";
export default async function sign(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.number(value, "1st argument of SIGN must a be number");
    return Math.sign(value);
}
