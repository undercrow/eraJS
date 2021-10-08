import P from "parsimmon";

import * as assert from "../../assert";
import * as color from "../../color";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = P.alt<Expr | [Expr, Expr, Expr]>(
	U.arg3R3(E.expr, E.expr, E.expr),
	U.arg1R1(E.expr),
);
export default class SetColor extends Statement {
	public value: Lazy<Expr | [Expr, Expr, Expr]>;

	public constructor(raw: string) {
		super();
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const parsed = this.value.get();
		let value: number;
		if (Array.isArray(parsed)) {
			const r = parsed[0].reduce(vm);
			const g = parsed[1].reduce(vm);
			const b = parsed[2].reduce(vm);
			assert.number(r, "1st argument of SETCOLOR must be an integer");
			assert.number(g, "2nd argument of SETCOLOR must be an integer");
			assert.number(b, "3rd argument of SETCOLOR must be an integer");
			value = color.toHex({r, g, b});
		} else {
			const rgb = parsed.reduce(vm);
			assert.number(rgb, "Argument of SETCOLOR must be an integer");
			value = rgb;
		}

		vm.color.front = color.hex(value);

		return null;
	}
}
