import P from "parsimmon";

import {assertNumber} from "../../assert";
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
export default class SetBgColor extends Statement {
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
			assertNumber(r, "1st argument of SETBGCOLOR must be an integer");
			assertNumber(g, "2nd argument of SETBGCOLOR must be an integer");
			assertNumber(b, "3rd argument of SETBGCOLOR must be an integer");
			value = color.toHex({r, g, b});
		} else {
			const rgb = parsed.reduce(vm);
			assertNumber(rgb, "Argument of SETBGCOLOR must be an integer");
			value = rgb;
		}

		vm.color.back = color.hex(value);

		return null;
	}
}
