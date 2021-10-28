import * as assert from "../../assert";
export default async function barStr(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.number(value, "1st argument of BAR must be a number");
    const max = await arg[1].reduce(vm);
    assert.number(max, "2nd argument of BAR must be a number");
    const length = await arg[2].reduce(vm);
    assert.number(length, "3rd argument of BAR must be a number");
    const filled = Math.floor(length * (value / max));
    return "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]";
}
