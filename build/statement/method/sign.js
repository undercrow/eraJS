import { assertNumber } from "../../assert";
export default function sign(vm, arg) {
    const value = arg[0].reduce(vm);
    assertNumber(value, "1st argument of SIGN must a be number");
    return Math.sign(value);
}
