import * as assert from "../../assert";
export default async function csvBase(vm, arg) {
    const num = await arg[0].reduce(vm);
    assert.bigint(num, "1st argument of CSVBASE must be an integer");
    const index = await arg[1].reduce(vm);
    assert.bigint(index, "2nd argument of CSVBASE must be an integer");
    const character = vm.code.csv.character.get(Number(num));
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.base.get(Number(index)) ?? 0;
}
