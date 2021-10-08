import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class Unicode extends Statement {
	public value: Lazy<Expr>;

	public constructor(raw: string) {
		super();
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assert.number(value, "1st argument of UNICODE must be an integer");
		assert.cond(
			value >= 0 && value <= 0xFFFF,
			"1st argument of UNICODE must be between 0 and 0xFFFF",
		);
		vm.getValue("RESULTS").set(vm, String.fromCharCode(value), [0]);

		return null;
	}
}
