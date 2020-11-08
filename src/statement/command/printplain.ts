import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

export default class PrintS extends Statement {
	public value: Expr;

	public constructor(value: Expr) {
		super();
		this.value = value;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const text = this.value.reduce(vm);
		assertString(text, "1st argument of PRINTPLAIN must be a string");

		yield* Print.print(vm, text);

		return null;
	}
}
