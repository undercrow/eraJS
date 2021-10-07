import { assertNumber, assertString } from "../../assert";
export default function varSize(vm, arg) {
    const name = arg[0].reduce(vm);
    assertString(name, "1st Argument of VARSIZE should be a string");
    const depth = arg.length >= 2 ? arg[1].reduce(vm) : 0;
    assertNumber(depth, "2nd argument of VARSIZE must be a number");
    return vm.getValue(name).length(depth);
}
