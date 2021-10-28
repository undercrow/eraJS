import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R2(X.variable, C.Float);
export default class Times extends Statement {
	public arg: Lazy<[Variable, number]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [dest, value] = this.arg.get();

		const original = await dest.reduce(vm);
		assert.number(original, "1st argument of TIMES must be a number");
		const index = await dest.reduceIndex(vm);

		dest.getCell(vm).set(vm, Math.floor(original * value), index);

		return null;
	}
}
