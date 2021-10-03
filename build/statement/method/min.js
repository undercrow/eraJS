import { assert, assertNumber } from "../../assert";
export default function min(vm, arg) {
    assert(arg.length > 0, "MIN must have at least 1 argument");
    arg.forEach((a, i) => {
        assertNumber(a.reduce(vm), `${i + 1}th argument of MIN must be a number`);
    });
    return Math.min(...arg.map((a) => a.reduce(vm)));
}
