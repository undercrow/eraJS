import type VM from "../../vm";
import Statement from "../index";

export default class Call extends Statement {
	public target: string;

	public constructor(target: string) {
		super();
		this.target = target;
	}

	public *run(_vm: VM) {
		throw new Error("CALL is not implemented yet!");

		return null;
	}
}
