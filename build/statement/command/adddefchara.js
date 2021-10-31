import * as assert from "../../assert";
import Character from "../../character";
import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class AddDefChara extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        const template = vm.templateMap.get(0);
        assert.cond(template != null, "Character template with id 0 does not exist");
        vm.characterList.push(new Character(vm, template));
        return null;
    }
}
