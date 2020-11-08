import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

export default class PrintS extends Statement {
	public postfix: string;
	public value: Expr;

	public constructor(instruction: string, value: Expr) {
		super();
		this.postfix = instruction.replace(/^PRINTS/, "");
		this.value = value;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const text = this.value.reduce(vm);
		assertString(text, "1st argument of PRINTS must be a string");

		yield* Print.print(vm, text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
