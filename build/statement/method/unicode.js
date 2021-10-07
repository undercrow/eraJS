import { assertNumber } from "../../assert";
export default function unicode(vm, arg) {
    const value = arg[0].reduce(vm);
    assertNumber(value, "1st Argument of UNICODE should be a number");
    return String.fromCharCode(value);
}
