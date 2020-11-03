import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class If extends Statement {
	public ifExpr: Array<[Expr, Thunk]>;
	public elseExpr: Thunk;

	public constructor(ifExpr: If["ifExpr"], elseExpr: If["elseExpr"]) {
		super();
		this.ifExpr = ifExpr;
		this.elseExpr = elseExpr;
	}

	public *run(vm: VM, label?: string) {
		if (label != null) {
			for (const [, thunk] of this.ifExpr) {
				if (thunk.labelMap.has(label)) {
					return yield* thunk.run(vm, label);
				}
			}
			if (this.elseExpr.labelMap.has(label)) {
				return yield* this.elseExpr.run(vm, label);
			}
		}


		for (const ifExpr of this.ifExpr) {
			const cond = ifExpr[0].reduce(vm);
			assertNumber(cond, "Condition should be an integer");
			if (cond !== 0) {
				return yield* ifExpr[1].run(vm);
			}
		}

		return yield* this.elseExpr.run(vm);
	}
}
