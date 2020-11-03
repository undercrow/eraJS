import {assertString} from "../../assert";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Goto from "./goto";

export default class TryGoto extends Statement {
	public target: Expr;

	public constructor(target: Expr) {
		super();
		this.target = target;
	}

	public *run(vm: VM) {
		let target = this.target.reduce(vm);
		assertString(target, "1st argument of TRYGOTO must be a string");
		target = target.toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* new Goto(this.target).run(vm);
		}

		return null;
	}
}
