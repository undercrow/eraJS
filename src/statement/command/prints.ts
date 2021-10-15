import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R1(E.expr);
export default class PrintS extends Statement {
	public postfix: string;
	public arg: Lazy<Expr>;

	public constructor(instruction: string, raw: Slice) {
		super(raw);

		this.postfix = instruction.replace(/^PRINTS/, "");
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const text = this.arg.get().reduce(vm);
		assert.string(text, "1st argument of PRINTS must be a string");

		yield* vm.print(text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
