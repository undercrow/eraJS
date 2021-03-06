import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Return extends Statement {
	public expr: Lazy<Expr[]>;

	public constructor(raw: string) {
		super();
		this.expr = new Lazy(raw, U.argNR0(E.expr));
	}

	public *run(vm: VM) {
		return <const>{
			type: "return",
			value: this.expr.get().map((e) => e.reduce(vm)),
		};
	}
}
