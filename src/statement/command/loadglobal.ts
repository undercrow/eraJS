import * as U from "../../erb/util";
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
		const rawGlobal = vm.external.getGlobal("GLOBAL");
		if (rawGlobal != null) {
			vm.getValue<Int1DValue>("GLOBAL").reset(JSON.parse(rawGlobal));
		}

		const rawGlobalS = vm.external.getGlobal("GLOBALS");
		if (rawGlobalS != null) {
			vm.getValue<Str1DValue>("GLOBALS").reset(JSON.parse(rawGlobalS));
		}

		return null;
	}
}
