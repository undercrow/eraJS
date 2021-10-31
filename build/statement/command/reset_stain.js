import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.expr);
export default class ResetStain extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const num = await this.arg.get().reduce(vm);
        assert.bigint(num, "1st Argument of RESET_STAIN should be an integer");
        assert.cond(vm.characterList.length > num, `Character #${num} does not exist`);
        const character = vm.characterList[Number(num)];
        character.getValue("STAIN").reset([0, 0, 2, 1, 8]);
        return null;
    }
}
