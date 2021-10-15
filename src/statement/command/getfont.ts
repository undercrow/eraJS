import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class GetFont extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run(vm: VM) {
		const result = vm.font.name;
		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
