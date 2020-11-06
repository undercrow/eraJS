import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

export default class PrintV extends Statement {
	public postfix: string;
	public value: Expr[];

	public constructor(instruction: string, value: Expr[]) {
		super();
		this.postfix = instruction.replace(/^PRINTV/, "");
		this.value = value;
	}

	public *run(vm: VM) {
		let text = "";
		for (const value of this.value) {
			text += value.reduce(vm).toString();
		}

		yield <const>{
			type: "string",
			text,
		};

		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
