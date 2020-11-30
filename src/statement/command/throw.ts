import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Throw extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg1R1(E.expr));
	}

	public *run(vm: VM) {
		const value = this.arg.get().reduce(vm);
		assertString(value, "Argument of THROW must be a string");

		return <const>{
			type: "throw",
			value,
		};
	}
}
