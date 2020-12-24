import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

export default class InitRand extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		vm.random.state = vm.getValue("RANDDATA").get(vm, []) as number;

		return null;
	}
}
