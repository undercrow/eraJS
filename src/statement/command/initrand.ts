import * as U from "../../parser/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class InitRand extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		vm.random.state = vm.getValue("RANDDATA").get(vm, []) as number;

		return null;
	}
}
