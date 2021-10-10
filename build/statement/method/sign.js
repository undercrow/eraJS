import * as assert from "../../assert";
export default function sign(vm, arg) {
    const value = arg[0].reduce(vm);
    assert.number(value, "1st argument of SIGN must a be number");
    return Math.sign(value);
}
