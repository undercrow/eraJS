import * as assert from "../../assert";
export default function csvCallname(vm, arg) {
    const num = arg[0].reduce(vm);
    assert.number(num, "1st argument of CSVCALLNAME must be an integer");
    const character = vm.code.data.character.get(num);
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.callname;
}
