import {assertString} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Goto from "./goto";

export default class TryCGoto extends Statement {
	public target: Expr;
	public catchExpr: Thunk;

	public constructor(target: Expr, catchExpr: Thunk) {
		super();
		this.target = target;
		this.catchExpr = catchExpr;
	}

	public *run(vm: VM, label?: string) {
		let target = this.target.reduce(vm);
		assertString(target, "1st argument of TRYGOTO must be a string");
		target = target.toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* new Goto(this.target).run(vm);
		} else {
			return yield* this.catchExpr.run(vm, label);
		}
	}
}
