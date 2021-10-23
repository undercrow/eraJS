import P from "parsimmon";

import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";

const PARSER = U.argNR0(P.alt(
	P.string("'").then(C.charSeq(",").map((str) => new Const(str))),
	X.expr,
));
export default class PrintSingleV extends Statement {
	public postfix: string;
	public arg: Lazy<Expr[]>;

	public constructor(postfix: string, raw: Slice) {
		super(raw);

		this.postfix = postfix;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.queue.skipDisp) {
			return null;
		}

		let text = "";
		for (const arg of this.arg.get()) {
			text += arg.reduce(vm).toString();
		}

		yield* vm.queue.printSingle(text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
