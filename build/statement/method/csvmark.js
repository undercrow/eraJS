import { assert, assertNumber } from "../../assert";
export default function csvMark(vm, arg) {
    const num = arg[0].reduce(vm);
    assertNumber(num, "1st argument of CSVMARK must be an integer");
    const index = arg[1].reduce(vm);
    assertNumber(index, "2nd argument of CSVMARK must be an integer");
    const character = vm.code.data.character.get(num);
    assert(character != null, `Character #${num} does not exist`);
    return character.mark.get(index) ?? 0;
}
