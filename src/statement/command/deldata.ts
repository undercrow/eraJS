import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class DelData extends Statement {
	public index: Expr;

	public constructor(index: Expr) {
		super();
		this.index = index;
	}

	public *run(vm: VM) {
		const index = this.index.reduce(vm);
		assertNumber(index, "Argument of DELDATA must be a number");

		throw new Error("DELDATA is not implemented yet!");

		return null;
	}
}
