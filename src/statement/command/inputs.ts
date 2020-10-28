import type VM from "../../vm";
import Statement from "../index";

export default class InputS extends Statement {
	public def?: string;

	public constructor(def?: string) {
		super();
		this.def = def;
	}

	public *run(_vm: VM) {
		throw new Error("INPUTS is not implemented yet!");

		return null;
	}
}
