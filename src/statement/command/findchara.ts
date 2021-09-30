import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg4R2(E.variable, E.expr, E.expr, E.expr);
export default class FindChara extends Statement {
	public expr: Lazy<[Variable, Expr, Expr | undefined, Expr | undefined]>;

	public constructor(raw: string) {
		super();
		this.expr = new Lazy(raw, PARSER);
	}

	public *run() {
		throw new Error("FINDCHARA is not implemented yet!");

		return null;
	}
}
