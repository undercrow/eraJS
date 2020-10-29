import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";

export default class Call extends Statement {
	public target: string;
	public argument: Expr[];

	public constructor(target: string, argument: Expr[]) {
		super();
		this.target = target;
		this.argument = argument;
	}

	public *run(_vm: VM) {
		throw new Error("CALL is not implemented yet!");

		return null;
	}
}
