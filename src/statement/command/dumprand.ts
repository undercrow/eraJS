import * as U from "../../parser/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class DumpRand extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		vm.getValue("RANDDATA").set(vm, vm.random.state, []);

		return null;
	}
}
