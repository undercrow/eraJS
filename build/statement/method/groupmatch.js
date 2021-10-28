import * as assert from "../../assert";
export default async function groupMatch(vm, arg) {
    assert.cond(arg.length > 0, "1st argument of GROUPMATCH must exist");
    const key = await arg[0].reduce(vm);
    const values = [];
    for (const a of arg.slice(1)) {
        values.push(await a.reduce(vm));
    }
    return values.reduce((acc, val) => acc + (val === key ? 1 : 0), 0);
}
