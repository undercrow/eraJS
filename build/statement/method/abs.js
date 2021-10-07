import { assertNumber } from "../../assert";
export default function abs(vm, arg) {
    const value = arg[0].reduce(vm);
    assertNumber(value, "1st argument of ABS must a be number");
    return Math.abs(value);
}
