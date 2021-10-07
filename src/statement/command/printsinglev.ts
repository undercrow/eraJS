import P from "parsimmon";

import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";

const PARSER = U.argNR0(P.alt(
	P.string("'").then(U.charSeq(",").map((str) => new Const(str))),
	E.expr,
));
export default class PrintSingleV extends Statement {
	public postfix: string;
	public arg: Lazy<Expr[]>;

	public constructor(postfix: string, raw: string) {
		super();
		this.postfix = postfix;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		let text = "";
		for (const arg of this.arg.get()) {
			text += arg.reduce(vm).toString();
		}

		yield* vm.printSingle(text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
