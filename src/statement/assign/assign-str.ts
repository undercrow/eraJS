import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.sepBy0(",", X.expr);
export default class AssignStr extends Statement {
	public dest: Variable;
	public arg: Lazy<Expr[]>;

	public constructor(dest: Variable, raw: Slice) {
		super(raw);
		this.dest = dest;

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const dest = this.dest.getCell(vm);
		const index = this.dest.reduceIndex(vm);
		const arg = this.arg.get();

		const partialIndex = index.slice(0, -1);
		const lastIndex = index[index.length - 1] ?? 0;

		for (let i = 0; i < arg.length; ++i) {
			const value = arg[i].reduce(vm);
			dest.set(vm, value, [...partialIndex, lastIndex + i]);
		}

		return null;
	}
}
