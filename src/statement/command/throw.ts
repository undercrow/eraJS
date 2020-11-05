import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Throw extends Statement {
	public value: Expr;

	public constructor(value: Expr) {
		super();
		this.value = value;
	}

	public *run(vm: VM) {
		const value = this.value.reduce(vm);
		assertString(value, "Argument of THROW must be a string");

		return <const>{
			type: "throw",
			value,
		};
	}
}
