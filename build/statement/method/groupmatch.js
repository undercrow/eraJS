import { assert } from "../../assert";
export default function groupMatch(vm, arg) {
    assert(arg.length > 0, "1st argument of GROUPMATCH must exist");
    const key = arg[0].reduce(vm);
    const values = arg.slice(1).map((a) => a.reduce(vm));
    return values.reduce((acc, val) => acc + (val === key ? 1 : 0), 0);
}
