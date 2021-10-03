import { assertString } from "../../assert";
export default function strLenS(vm, arg) {
    const value = arg[0].reduce(vm);
    assertString(value, "1st Argument of STRLENS should be a string");
    return value.length;
}
