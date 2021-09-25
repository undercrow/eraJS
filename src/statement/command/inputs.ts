import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(U.charSeq());
export default class InputS extends Statement {
	public def: Lazy<string | undefined>;

	public constructor(raw: string) {
		super();
		this.def = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const input: string = yield <const>{type: "input"};
		let value: string;
		if (input !== "") {
			value = input;
		} else {
			value = this.def.get() ?? "";
		}
		vm.getValue("RESULTS").set(vm, value, [0]);

		return null;
	}
}
