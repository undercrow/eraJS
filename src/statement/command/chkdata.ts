import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class ChkData extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg1R1(E.expr));
	}

	public *run(vm: VM) {
		const index = this.arg.get().reduce(vm);
		assertNumber(index, "Argument of CHKDATA must be a number");

		throw new Error("CHKDATA is not implemented yet!");

		return null;
	}
}
