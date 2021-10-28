import P from "parsimmon";

import * as assert from "../../assert";
import * as color from "../../color";
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
export default class SetColor extends Statement {
	public arg: Lazy<Expr | [Expr, Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const parsed = this.arg.get();
		let value: number;
		if (Array.isArray(parsed)) {
			const r = await parsed[0].reduce(vm);
			const g = await parsed[1].reduce(vm);
			const b = await parsed[2].reduce(vm);
			assert.number(r, "1st argument of SETCOLOR must be an integer");
			assert.number(g, "2nd argument of SETCOLOR must be an integer");
			assert.number(b, "3rd argument of SETCOLOR must be an integer");
			value = color.toHex({r, g, b});
		} else {
			const rgb = await parsed.reduce(vm);
			assert.number(rgb, "Argument of SETCOLOR must be an integer");
			value = rgb;
		}

		vm.color.front = color.hex(value);

		return null;
	}
}
