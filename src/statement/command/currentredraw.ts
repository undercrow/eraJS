import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class CurrentRedraw extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		vm.getValue("RESULT").set(vm, vm.draw ? 0 : 1, [0]);

		return null;
	}
}
