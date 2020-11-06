import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Bar extends Statement {
	public value: Expr;
	public max: Expr;
	public length: Expr;
	public newline: boolean;
	public constructor(value: Expr, max: Expr, length: Expr, newline: boolean = false) {
		super();
		this.value = value;
		this.max = max;
		this.length = length;
		this.newline = newline;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const value = this.value.reduce(vm);
		assertNumber(value, "1st argument of BAR must be a number");
		const max = this.max.reduce(vm);
		assertNumber(max, "2nd argument of BAR must be a number");
		const length = this.length.reduce(vm);
		assertNumber(length, "3rd argument of BAR must be a number");

		const filled = Math.floor(length * (value / max));
		yield <const>{
			type: "string",
			text: "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]",
		};

		if (this.newline) {
			yield <const>{type: "string", text: "\n"};
		}

		return null;
	}
}
