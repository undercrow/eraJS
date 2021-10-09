import * as U from "../../erb/util";
import {savefile, GlobalSave} from "../../savedata";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Str1DValue from "../../value/str-1d";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class SaveGlobal extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	// TODO: Save #DIM GLOBAL variables
	public *run(vm: VM) {
		const saveData: GlobalSave = {
			code: vm.getValue<Int0DValue>("GAMEBASE_GAMECODE").get(vm, []),
			version: vm.getValue<Int0DValue>("GAMEBASE_VERSION").get(vm, []),
			data: {
				GLOBAL: vm.getValue<Int1DValue>("GLOBAL").value,
				GLOBALS: vm.getValue<Str1DValue>("GLOBALS").value,
			},
		};

		vm.external.setSavedata(savefile.global, JSON.stringify(saveData));

		return null;
	}
}
