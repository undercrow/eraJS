import * as U from "../../erb/util";
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
		vm.external.setGlobal(
			"GLOBAL",
			JSON.stringify(vm.getValue<Int1DValue>("GLOBAL").value),
		);
		vm.external.setGlobal(
			"GLOBALS",
			JSON.stringify(vm.getValue<Str1DValue>("GLOBALS").value),
		);

		return null;
	}
}
