import * as assert from "../../assert";
import Character from "../../character";
import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class AddDefChara extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run(vm: VM) {
		const template = vm.templateMap.get(0);
		assert.cond(template != null, "Character template with id 0 does not exist");

		vm.characterList.push(new Character(vm, template));

		return null;
	}
}
