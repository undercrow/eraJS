import type VM from "../../vm";
import type Statement from "../index";

export default class Goto implements Statement {
	public target: string;

	public constructor(target: string) {
		this.target = target;
	}

	public *run(_vm: VM) {
		throw new Error("GOTO is not implemented yet!");

		return null;
	}
}
