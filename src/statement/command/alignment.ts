import Lazy from "../../lazy";
import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

export type Align = "LEFT" | "CENTER" | "RIGHT";

const PARSER = U.arg1R1(U.alt("LEFT", "CENTER", "RIGHT"));
export default class Alignment extends Statement {
	public arg: Lazy<Align>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		vm.alignment = this.arg.get();

		return null;
	}
}
