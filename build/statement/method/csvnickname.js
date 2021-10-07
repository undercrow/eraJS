import { assert, assertNumber } from "../../assert";
export default function csvNickname(vm, arg) {
    const num = arg[0].reduce(vm);
    assertNumber(num, "1st argument of CSVNICKNAME must be an integer");
    const character = vm.code.data.character.get(num);
    assert(character != null, `Character #${num} does not exist`);
    return character.nickname;
}
