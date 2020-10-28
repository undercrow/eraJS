import type VM from "../../vm";
import Statement from "../index";

export default class Goto extends Statement {
	public target: string;

	public constructor(target: string) {
		super();
		this.target = target;
	}

	public *run(_vm: VM) {
		throw new Error("GOTO is not implemented yet!");

		return null;
	}
}
