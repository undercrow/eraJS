import * as assert from "../../assert";
export default async function max(vm, arg) {
    assert.cond(arg.length > 0, "MAX must have at least 1 argument");
    const values = [];
    for (let i = 0; i < arg.length; ++i) {
        const value = await arg[i].reduce(vm);
        assert.number(value, `${i + 1}th argument of MAX should be a number`);
        values.push(value);
    }
    return Math.max(...values);
}
