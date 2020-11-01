import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

type Operator = "<" | "<=" | ">" | ">=";
type Condition =
	| {type: "equal"; values: Array<string | number>}
	| {type: "range"; from: number; to: number}
	| {type: "compare"; op: Operator; value: number};

export default class Case extends Statement {
	public expr: Expr;
	public branch: Array<[Condition, Thunk]>;
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
			switch (cond.type) {
				case "equal": {
					if (cond.values.includes(value)) {
						return yield* expr.run(vm);
					}
					break;
				}
				case "range": {
					assertNumber(value, "CASE ... TO ... should be used for an integer value");
					if (cond.from <= value && value <= cond.to) {
						return yield* expr.run(vm);
					}
					break;
				}
				case "compare": {
					assertNumber(value, "CASE IS ... should be used for an integer value");
					switch (cond.op) {
						case "<": {
							if (value < cond.value) { return yield* expr.run(vm); }
							break;
						}
						case "<=": {
							if (value <= cond.value) { return yield* expr.run(vm); }
							break;
						}
						case ">": {
							if (value > cond.value) { return yield* expr.run(vm); }
							break;
						}
						case ">=": {
							if (value >= cond.value) { return yield* expr.run(vm); }
							break;
						}
					}
				}
			}
		}

		return null;
	}

	public getThunk(): Thunk[] {
		return [...this.branch.map((b) => b[1]), this.def];
	}
}
