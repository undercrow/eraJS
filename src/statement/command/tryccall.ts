import {assertString} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Jump from "./jump";

export default class TryCCall extends Statement {
	public target: Expr;
	public arg: Expr[];
	public catchExpr: Thunk;

	public constructor(target: Expr, arg: Expr[], catchExpr: Thunk) {
		super();
		this.target = target;
		this.arg = arg;
		this.catchExpr = catchExpr;
	}

	public *run(vm: VM, label?: string) {
		let target = this.target.reduce(vm);
		assertString(target, "1st argument of TRYCCALL must be a string");
		target = target.toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* new Jump(this.target, this.arg).run(vm);
		} else {
			return yield* this.catchExpr.run(vm, label);
		}
	}
}
