import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR1(E.expr, E.expr);
export default class Max extends Statement {
	public arg: Lazy<Expr[]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const arg = this.arg.get().map((a) => a.reduce(vm));
		for (let i = 0; i < arg.length; ++i) {
			assertNumber(arg[i], `${i + 1}th argument of MAX must be an integer`);
		}

		const result = Math.max(...arg as number[]);
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
