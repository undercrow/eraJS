import {assertString} from "../../assert";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

export default class ReuseLastLine extends Statement {
	public value?: Form;

	public constructor(value?: Form) {
		super();
		this.value = value;
	}

	public *run(vm: VM) {
		const value = this.value?.reduce(vm) ?? "";
		assertString(value, "Argument of REUSELASTLINE must be a string");

		throw new Error("REUSELASTLINE is not implemented yet!");

		return null;
	}
}
