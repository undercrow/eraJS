import * as U from "../../parser/util";
import * as color from "../../color";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class ResetBgColor extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run(vm: VM) {
		vm.color.back = color.copy(vm.color.defaultBack);

		return null;
	}
}
