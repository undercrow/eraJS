import * as assert from "../../assert";
export default async function csvNickname(vm, arg) {
    const num = await arg[0].reduce(vm);
    assert.bigint(num, "1st argument of CSVNICKNAME must be an integer");
    const character = vm.code.csv.character.get(Number(num));
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.nickname;
}
