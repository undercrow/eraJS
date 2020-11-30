import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

export default class ReuseLastLine extends Statement {
	public arg: Lazy<Form | undefined>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg1R0(E.form()));
	}

	public *run(vm: VM) {
		const value = this.arg.get()?.reduce(vm) ?? "";
		assertString(value, "Argument of REUSELASTLINE must be a string");

		throw new Error("REUSELASTLINE is not implemented yet!");

		return null;
	}
}
