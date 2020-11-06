import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class ChkData extends Statement {
	public index: Expr;

	public constructor(index: Expr) {
		super();
		this.index = index;
	}

	public *run(vm: VM) {
		const index = this.index.reduce(vm);
		assertNumber(index, "Argument of CHKDATA must be a number");

		throw new Error("CHKDATA is not implemented yet!");

		return null;
	}
}
