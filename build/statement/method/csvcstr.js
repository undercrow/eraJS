import * as assert from "../../assert";
export default function csvCstr(vm, arg) {
    const num = arg[0].reduce(vm);
    assert.number(num, "1st argument of CSVCSTR must be an integer");
    const index = arg[1].reduce(vm);
    assert.number(index, "2nd argument of CSVCSTR must be an integer");
    const character = vm.code.data.character.get(num);
    assert.cond(character != null, `Character #${num} does not exist`);
    return character.cstr.get(index) ?? "";
}
