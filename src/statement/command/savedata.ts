import {assertNumber, assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class SaveData extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg2R2(E.expr, E.expr));
	}

	public *run(vm: VM) {
		const [indexExpr, commentExpr] = this.arg.get();

		const index = indexExpr.reduce(vm);
		assertNumber(index, "1st argument of SAVEDATA must be a number");
		const comment = commentExpr.reduce(vm);
		assertString(comment, "2nd argument of SAVEDATA must be a string");

		throw new Error("SAVEDATA is not implemented yet!");

		return null;
	}
}
