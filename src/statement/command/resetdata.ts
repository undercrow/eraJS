import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class ResetData extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public async *run(vm: VM) {
		await vm.reset();

		return null;
	}
}
