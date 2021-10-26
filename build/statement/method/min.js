import * as assert from "../../assert";
export default function min(vm, arg) {
    assert.cond(arg.length > 0, "MIN must have at least 1 argument");
    arg.forEach((a, i) => {
        assert.number(a.reduce(vm), `${i + 1}th argument of MIN must be a number`);
    });
    return Math.min(...arg.map((a) => a.reduce(vm)));
}
