import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R1(E.expr);
export default class PrintSingleFormS extends Statement {
	public postfix: string;
	public arg: Lazy<Expr>;

	public constructor(postfix: string, raw: string) {
		super();
		this.postfix = postfix;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const arg = this.arg.get().reduce(vm);
		assert.string(arg, "1st argument of PRINTSINGLEFORMS must be a string");
		const text = E.form[""].tryParse(arg).reduce(vm);
		assert.string(text, "1st argument of PRINTSINGLEFORMS must be reduced to a string");

		yield* vm.printSingle(text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
