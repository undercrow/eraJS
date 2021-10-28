import * as assert from "../../assert";
export default async function csvMark(vm, arg) {
    const num = await arg[0].reduce(vm);
    assert.number(num, "1st argument of CSVMARK must be an integer");
    const index = await arg[1].reduce(vm);
    assert.number(index, "2nd argument of CSVMARK must be an integer");
    const character = vm.code.csv.character.get(num);
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.mark.get(index) ?? 0;
}
