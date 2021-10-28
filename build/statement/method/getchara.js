import * as assert from "../../assert";
export default async function getChara(vm, arg) {
    const id = await arg[0].reduce(vm);
    assert.number(id, "1st argument of GETCHARA should be an integer");
    for (let i = 0; i < vm.characterList.length; ++i) {
        if (vm.getValue("NO").get(vm, [i]) === id) {
            return i;
        }
    }
    return -1;
}
