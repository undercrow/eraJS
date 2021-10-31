import * as assert from "../../assert";
export default async function sign(vm, arg) {
    const value = await arg[0].reduce(vm);
    assert.bigint(value, "1st argument of SIGN must a be number");
    if (value > 0) {
        return 1;
    }
    else if (value < 0) {
        return -1;
    }
    else {
        return 0;
    }
}
