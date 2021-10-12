import * as U from "../../parser/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class FontRegular extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		vm.font.bold = false;
		vm.font.italic = false;
		vm.font.strike = false;
		vm.font.underline = false;

		return null;
	}
}
