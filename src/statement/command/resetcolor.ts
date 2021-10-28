import * as U from "../../parser/util";
import * as color from "../../color";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class ResetColor extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		vm.color.front = color.copy(vm.color.defaultFront);

		return null;
	}
}
