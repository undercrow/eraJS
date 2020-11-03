import {assertString} from "../../assert";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Jump from "./jump";

export default class TryJump extends Statement {
	public target: Expr;
	public arg: Expr[];

	public constructor(target: Expr, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		let target = this.target.reduce(vm);
		assertString(target, "1st argument of TRYJUMP must be a string");
		target = target.toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* new Jump(this.target, this.arg).run(vm);
		}

		return null;
	}
}
