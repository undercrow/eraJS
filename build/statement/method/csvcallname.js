import { assert, assertNumber } from "../../assert";
export default function csvCallname(vm, arg) {
    const num = arg[0].reduce(vm);
    assertNumber(num, "1st argument of CSVCALLNAME must be an integer");
    const character = vm.code.data.character.get(num);
    assert(character != null, `Character #${num} does not exist`);
    return character.callname;
}
