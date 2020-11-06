import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class PrintData extends Statement {
	public data: Expr[];

	public constructor(data: Expr[]) {
		super();
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

		return null;
	}
}
