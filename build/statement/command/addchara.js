import * as assert from "../../assert";
import Character from "../../character";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR0(E.expr);
export default class AddChara extends Statement {
    characters;
    constructor(raw) {
        super();
        this.characters = new Lazy(raw, PARSER);
    }
    *run(vm) {
        for (const expr of this.characters.get()) {
            const id = expr.reduce(vm);
            assert.number(id, "Character id should be an integer");
            const template = vm.templateMap.get(id);
            assert.cond(template != null, `Character template with id ${id} does not exist`);
            vm.characterList.push(new Character(vm, template));
            const charaNum = vm.getValue("CHARANUM").get(vm, []);
            vm.getValue("CHARANUM").set(vm, charaNum + 1, []);
        }
        return null;
    }
}
