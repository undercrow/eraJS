import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class Redraw extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.number(value, "Argument of REDRAW must be a number");
		assert.cond(value > 0 && value <= 3, "Argument of REDRAW must be between 0 and 3");

		switch (value) {
			case 0: vm.queue.draw = false; break;
			case 1: vm.queue.draw = true; break;
			case 2: vm.queue.draw = false; yield* vm.queue.flush(); break;
			case 3: vm.queue.draw = true; yield* vm.queue.flush(); break;
		}

		return null;
	}
}
