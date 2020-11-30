import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

export default class InputS extends Statement {
	public def: Lazy<string | undefined>;

	public constructor(raw: string) {
		super();
		this.def = new Lazy(raw, U.arg1R0(U.charSeq()));
	}

	public *run(_vm: VM) {
		throw new Error("INPUTS is not implemented yet!");

		return null;
	}
}
