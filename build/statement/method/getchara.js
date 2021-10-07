import { assertNumber } from "../../assert";
export default function getChara(vm, arg) {
    const id = arg[0].reduce(vm);
    assertNumber(id, "1st argument of GETCHARA should be an integer");
    for (let i = 0; i < vm.characterList.length; ++i) {
        if (vm.getValue("NO").get(vm, [i]) === id) {
            return i;
        }
    }
    return -1;
}
