import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R0(E.form[""]);
export default class ReuseLastLine extends Statement {
	public arg: Lazy<Form | undefined>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const value = this.arg.get()?.reduce(vm) ?? "";
		assert.string(value, "Argument of REUSELASTLINE must be a string");

		throw new Error("REUSELASTLINE is not implemented yet!");

		return null;
	}
}
