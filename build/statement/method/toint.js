import { assertString } from "../../assert";
export default function toInt(vm, arg) {
    const value = arg[0].reduce(vm);
    assertString(value, "1st Argument of TOINT should be a string");
    const result = Number(value);
    return isNaN(result) ? 0 : result;
}
