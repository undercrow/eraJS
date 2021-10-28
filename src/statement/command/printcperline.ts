import * as U from "../../parser/util";
import Slice from "../../slice";
import VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class PrintCPerLine extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		vm.getValue("RESULT").set(vm, vm.printCPerLine, [0]);

		return null;
	}
}
