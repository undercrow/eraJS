import type VM from "../../vm";
import type Statement from "../index";

export default class InputS implements Statement {
	public def?: string;

	public constructor(def?: string) {
		this.def = def;
	}

	public *run(_vm: VM) {
		throw new Error("INPUTS is not implemented yet!");

		return null;
	}
}
