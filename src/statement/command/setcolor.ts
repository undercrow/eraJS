import P from "parsimmon";

import {assertNumber} from "../../assert";
import * as color from "../../color";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";

export default class SetColor extends Statement {
	public value: Lazy<Expr>;

	public constructor(raw: string) {
		super();
		this.value = new Lazy(raw, P.alt(
			U.arg3R3(U.UInt, U.UInt, U.UInt).map(
				([r, g, b]) => new Const(color.toHex({r, g, b})),
			),
			U.arg1R1(E.expr),
		));
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assertNumber(value, "Argument of SETCOLOR must be an integer");

		vm.color.front = color.hex(value);

		return null;
	}
}
