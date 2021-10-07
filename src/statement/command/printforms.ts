import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R1(E.expr);
export default class PrintFormS extends Statement {
	public postfix: string;
	public value: Lazy<Expr>;

	public constructor(instruction: string, raw: string) {
		super();
		this.postfix = instruction.replace(/^PRINTFORMS/, "");
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const form = this.value.get().reduce(vm);
		assertString(form, "1st argument of PRINTFORMS must be a string");
		const text = E.form[""].tryParse(form).reduce(vm);
		assertString(text, "1st argument of PRINTFORMS must be reduced to a string");

		yield* Print.print(vm, text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
