import * as assert from "../../assert";
export default async function existCsv(vm, arg) {
    const num = await arg[0].reduce(vm);
    assert.number(num, "1st argument of EXISTCSV should be a number");
    return vm.templateMap.has(num) ? 1 : 0;
}
