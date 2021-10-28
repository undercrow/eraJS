import * as assert from "../../assert";
export default async function strLenS(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.string(value, "1st Argument of STRLENS should be a string");
    return value.length;
}
