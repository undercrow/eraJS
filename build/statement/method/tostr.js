import * as assert from "../../assert";
export default function toStr(vm, arg) {
    const value = arg[0].reduce(vm);
    assert.number(value, "1st Argument of TOSTR should be a number");
    return value.toString();
}
