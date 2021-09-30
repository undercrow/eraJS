import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR0(E.expr);
export default class PickupChara extends Statement {
	public expr: Lazy<Expr[]>;

	public constructor(raw: string) {
		super();
		this.expr = new Lazy(raw, PARSER);
	}

	public *run() {
		throw new Error("PICKUPCHARA is not implemented yet!");

		return null;
	}
}