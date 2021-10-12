import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class ReturnF extends Statement {
	public expr: Lazy<Expr>;

	public constructor(raw: string) {
		super();
		this.expr = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		return <const>{
			type: "return",
			value: [this.expr.get().reduce(vm)] as Array<string | number>,
		};
	}
}
