import * as assert from "../../assert";
export default function csvNickname(vm, arg) {
    const num = arg[0].reduce(vm);
    assert.number(num, "1st argument of CSVNICKNAME must be an integer");
    const character = vm.code.data.character.get(num);
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.nickname;
}
