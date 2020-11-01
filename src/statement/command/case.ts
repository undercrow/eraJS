import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Case extends Statement {
	public expr: Expr;
	public branch: Array<[Expr, Thunk]>;
	public def: Thunk;

	public constructor(expr: Case["expr"], branch: Case["branch"], def: Thunk) {
		super();
		this.expr = expr;
		this.branch = branch;
		this.def = def;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);

		for (const [cond, expr] of this.branch) {
			if (cond.reduce(vm) === value) {
				return yield* expr.run(vm);
			}
		}

		return null;
	}

	public getThunk(): Thunk[] {
		return [...this.branch.map((b) => b[1]), this.def];
	}
}
