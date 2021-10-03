import { assert, assertNumber } from "../../assert";
export default function max(vm, arg) {
    assert(arg.length > 0, "MAX must have at least 1 argument");
    arg.forEach((a, i) => {
        assertNumber(a.reduce(vm), `${i + 1}th argument of MAX must be a number`);
    });
    return Math.max(...arg.map((a) => a.reduce(vm)));
}
