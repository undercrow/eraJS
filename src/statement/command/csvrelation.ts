import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class CsvRelation extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(_vm: VM) {
		throw new Error("CSVRELATION is not implemented yet!");

		return null;
	}
}
