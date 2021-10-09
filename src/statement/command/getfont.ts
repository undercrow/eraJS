import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class GetFont extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		const result = vm.font.name;
		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
