import P from "parsimmon";

import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";

const PARSER = U.argNR0(P.alt(
	P.string("'").then(U.charSeq(",").map((str) => new Const(str))),
	E.expr,
));
export default class PrintV extends Statement {
	public postfix: string;
	public value: Lazy<Expr[]>;

	public constructor(instruction: string, raw: Slice) {
		super(raw);

		this.postfix = instruction.replace(/^PRINTV/, "");
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		let text = "";
		for (const value of this.value.get()) {
			text += value.reduce(vm).toString();
		}

		yield* vm.print(text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
