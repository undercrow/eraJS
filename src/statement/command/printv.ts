import P from "parsimmon";

import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

export default class PrintV extends Statement {
	public postfix: string;
	public value: Lazy<Expr[]>;

	public constructor(instruction: string, raw: string) {
		super();
		this.postfix = instruction.replace(/^PRINTV/, "");
		this.value = new Lazy(raw, U.argNR0(P.alt(
			P.string("'").then(U.charSeq(",")),
			E.expr,
		)));
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		let text = "";
		for (const value of this.value.get()) {
			text += value.reduce(vm).toString();
		}

		yield* Print.print(vm, text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
