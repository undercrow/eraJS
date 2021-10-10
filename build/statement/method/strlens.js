import * as assert from "../../assert";
export default function strLenS(vm, arg) {
    const value = arg[0].reduce(vm);
    assert.string(value, "1st Argument of STRLENS should be a string");
    return value.length;
}
