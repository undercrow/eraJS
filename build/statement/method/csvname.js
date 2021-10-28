import * as assert from "../../assert";
export default async function csvName(vm, arg) {
    const num = await arg[0].reduce(vm);
    assert.number(num, "1st argument of CSVNAME must be an integer");
    const character = vm.code.csv.character.get(num);
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.name;
}
