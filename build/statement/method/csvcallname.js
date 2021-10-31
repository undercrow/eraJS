import * as assert from "../../assert";
export default async function csvCallname(vm, arg) {
    const num = await arg[0].reduce(vm);
    assert.bigint(num, "1st argument of CSVCALLNAME must be an integer");
    const character = vm.code.csv.character.get(Number(num));
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.callname;
}
