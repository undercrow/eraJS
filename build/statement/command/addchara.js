import * as assert from "../../assert";
import Character from "../../character";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR0(X.expr);
export default class AddChara extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        for (const expr of this.arg.get()) {
            const id = await expr.reduce(vm);
            assert.bigint(id, "Character id should be an integer");
            const template = vm.templateMap.get(Number(id));
            assert.cond(template != null, `Character template with id ${id} does not exist`);
            vm.characterList.push(new Character(vm, template));
        }
        return null;
    }
}
