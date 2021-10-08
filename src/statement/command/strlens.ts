import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class StrLenS extends Statement {
	public value: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.value = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assert.string(value, "Argument of STRLENS must be a string!");
		vm.getValue("RESULT").set(vm, value.length, [0]);

		return null;
	}
}
