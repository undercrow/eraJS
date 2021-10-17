import * as assert from "../../assert";
export default function varSize(vm, arg) {
    const name = arg[0].reduce(vm);
    assert.string(name, "1st Argument of VARSIZE should be a string");
    const depth = arg.length >= 2 ? arg[1].reduce(vm) : 0;
    assert.number(depth, "2nd argument of VARSIZE must be a number");
    return vm.getValue(name).length(depth);
}
