import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
import Print from "./print";

export default class PrintData extends Statement {
	public postfix: string;
	public data: Expr[];

	public constructor(instruction: string, data: Expr[]) {
		super();
		this.postfix = instruction.replace(/^PRINTDATA/, "");
		this.data = data;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const index = Math.floor(Math.random() * this.data.length);
		const value = this.data[index].reduce(vm);
		assertString(value, "Item of PRINTDATA must be a string");

		yield <const>{
			type: "string",
			text: value,
		};

		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
