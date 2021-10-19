import * as assert from "../../assert";
import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R0(X.form[""]);
export default class ReuseLastLine extends Statement {
	public arg: Lazy<Form | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const value = this.arg.get()?.reduce(vm) ?? "";
		assert.string(value, "Argument of REUSELASTLINE must be a string");

		throw E.notImpl("REUSELASTLINE");

		return null;
	}
}
