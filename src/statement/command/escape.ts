import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class Escape extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
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
