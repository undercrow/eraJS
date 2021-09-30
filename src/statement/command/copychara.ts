import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class CopyChara extends Statement {
	public expr: Lazy<[Expr, Expr]>;

	public constructor(raw: string) {
		super();
		this.expr = new Lazy(raw, PARSER);
	}

	public *run() {
		throw new Error("COPYCHARA is not implemented yet!");

		return null;
	}
}
