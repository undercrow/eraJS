import * as U from "../../parser/util";
import type VM from "../../vm";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class DumpRand extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run(vm: VM) {
		vm.getValue("RANDDATA").set(vm, vm.random.state, []);

		return null;
	}
}
