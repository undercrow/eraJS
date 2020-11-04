import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

// TODO: Alignment
export default class PrintButton extends Statement {
	public text: Expr;
	public value: Expr;

	public constructor(text: Expr, value: Expr) {
		super();
		this.text = text;
		this.value = value;
	}

	public *run(vm: VM) {
		const text = this.text.reduce(vm);
		assertString(text, "1st argument of PRINTBUTTON must be a string");
		const value = this.value.reduce(vm);

		yield <const>{
			type: "button",
			text,
			value: typeof value === "string" ? value : value.toString(),
		};

		return null;
	}
}
