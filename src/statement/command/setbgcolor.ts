import P from "parsimmon";

import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = P.alt<Expr | [Expr, Expr, Expr]>(
	U.arg3R3(X.expr, X.expr, X.expr),
	U.arg1R1(X.expr),
);
export default class SetBgColor extends Statement {
	public arg: Lazy<Expr | [Expr, Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const parsed = this.arg.get();
		let color: string;
		if (Array.isArray(parsed)) {
			const r = await parsed[0].reduce(vm);
			const g = await parsed[1].reduce(vm);
			const b = await parsed[2].reduce(vm);
			assert.bigint(r, "1st argument of SETBGCOLOR must be an integer");
			assert.bigint(g, "2nd argument of SETBGCOLOR must be an integer");
			assert.bigint(b, "3rd argument of SETBGCOLOR must be an integer");
			color =
				r.toString(16).padStart(2, "0") +
				g.toString(16).padStart(2, "0") +
				b.toString(16).padStart(2, "0");
		} else {
			const rgb = await parsed.reduce(vm);
			assert.bigint(rgb, "Argument of SETBGCOLOR must be an integer");
			color = rgb.toString(16).padStart(6, "0");
		}

		vm.printer.background = color;

		return null;
	}
}
