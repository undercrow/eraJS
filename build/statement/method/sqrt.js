import * as assert from "../../assert";
import * as E from "../../error";
export default async function sqrt(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.bigint(value, "1st argument of sqrt must be a number");
    if (value < 0n) {
        throw E.misc("Argument of sqrt must be larger than 0");
    }
    let prev = 0n;
    let result = value;
    for (let i = 0; i < 100; ++i) {
        if (prev === result) {
            break;
        }
        prev = result;
        result = (result + value / result) / 2n;
    }
    // This is heuristic
    if (result * result - 1n === value) {
        return result - 1n;
    }
    else {
        return result;
    }
}
