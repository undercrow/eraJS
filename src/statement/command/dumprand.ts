import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

export default class DumpRand extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		vm.getValue("RANDDATA").set(vm, vm.random.state, []);

		return null;
	}
}
