import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

type Operator = "<" | "<=" | ">" | ">=";
type Condition =
	| {type: "equal"; value: string | number}
	| {type: "range"; from: number; to: number}
	| {type: "compare"; op: Operator; value: number};

export default class Case extends Statement {
	public expr: Expr;
	public branch: Array<[Condition[], Thunk]>;
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
			const satisfied = cond.some((c) => {
				switch (c.type) {
					case "equal": return c.value === value;
					case "range": return c.from <= value && value <= c.to;
					case "compare": {
						assertNumber(value, "CASE IS ... should be used for an integer value");
						switch (c.op) {
							case "<": return value < c.value;
							case "<=": return value <= c.value;
							case ">": return value > c.value;
							case ">=": return value >= c.value;
						}
					}
				}
			});

			if (satisfied) {
				return yield* expr.run(vm);
			}
		}

		return null;
	}

	public getThunk(): Thunk[] {
		return [...this.branch.map((b) => b[1]), this.def];
	}
}
