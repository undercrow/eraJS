import * as assert from "../../assert";
import * as U from "../../erb/util";
import {savefile, GlobalSave} from "../../savedata";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Str1DValue from "../../value/str-1d";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class LoadGlobal extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	// TODO: Load #DIM GLOBAL variables
	public *run(vm: VM) {
		const file = savefile.global;
		const raw = vm.external.getSavedata(file);

		try {
			assert.nonNull(raw, "");
			const parsed: GlobalSave = JSON.parse(raw);
			const code = vm.getValue<Int0DValue>("GAMEBASE_GAMECODE").get(vm, []);
			const version = vm.getValue<Int0DValue>("GAMEBASE_VERSION").get(vm, []);
			assert.numArray(parsed.data.GLOBAL, "");
			assert.strArray(parsed.data.GLOBALS, "");
			assert.cond(parsed.code === code, "");
			assert.cond(parsed.version === version, "");

			vm.getValue<Int1DValue>("GLOBAL").reset(parsed.data.GLOBAL);
			vm.getValue<Str1DValue>("GLOBALS").reset(parsed.data.GLOBALS);

			vm.getValue("RESULT").set(vm, 1, [0]);
		} catch {
			vm.getValue("RESULT").set(vm, 0, [0]);
		}

		return null;
	}
}
