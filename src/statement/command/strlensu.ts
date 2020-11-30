import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class StrLenSU extends Statement {
	public value: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.value = new Lazy(arg, U.arg1R1(E.expr));
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assertString(value, "Argument of STRLENU must be a string!");
		vm.getValue("RESULT").set(vm, value.length, [0]);

		return null;
	}
}
