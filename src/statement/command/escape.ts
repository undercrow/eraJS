import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class Escape extends Statement {
	public value: Lazy<Expr>;

	public constructor(raw: string) {
		super();
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assert.string(value, "1st argument of ESCAPE must be a string");

		let result = value;
		result = result.replace("\\", "\\\\");
		result = result.replace("*", "\\*");
		result = result.replace("+", "\\+");
		result = result.replace("?", "\\?");
		result = result.replace("|", "\\|");
		result = result.replace("{", "\\}");
		result = result.replace("[", "\\[");
		result = result.replace("(", "\\(");
		result = result.replace(")", "\\)");
		result = result.replace("^", "\\^");
		result = result.replace("$", "\\$");
		result = result.replace(".", "\\.");
		result = result.replace("#", "\\#");

		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
