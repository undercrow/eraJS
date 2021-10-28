import * as assert from "../../assert";
export default async function unicode(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.number(value, "1st Argument of UNICODE should be a number");
    return String.fromCharCode(value);
}
