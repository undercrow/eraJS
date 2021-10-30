import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg1R0(X.form[""]);
export default class ReuseLastLine extends Statement {
	public arg: Lazy<Form | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const value = await this.arg.get()?.reduce(vm) ?? "";
		assert.string(value, "Argument of REUSELASTLINE must be a string");

		yield* vm.printer.print(value, new Set(["S"]));
		vm.printer.isLineTemp = true;

		return null;
	}
}
