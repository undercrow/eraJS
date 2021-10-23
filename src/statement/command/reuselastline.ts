import * as assert from "../../assert";
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

	public *run(vm: VM): ReturnType<Statement["run"]> {
		const value = this.arg.get()?.reduce(vm) ?? "";
		assert.string(value, "Argument of REUSELASTLINE must be a string");

		if (!vm.queue.isLineEmpty) {
			yield* vm.queue.newline();
		}
		yield* vm.queue.print(value);
		vm.queue.isLineTemp = true;

		return null;
	}
}