import P from "parsimmon";

import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = P.eof;
type Operator = "++" | "--";
export default class AssignPrefix extends Statement {
	public dest: Variable;
	public operator: Operator;
	public arg: Lazy<undefined>;

	public constructor(dest: Variable, operator: Operator, raw: Slice) {
		super(raw);
		this.dest = dest;
		this.operator = operator;

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		this.raw.get();

		const dest = this.dest.getCell(vm);
		const index = await this.dest.reduceIndex(vm);
		const original = dest.get(vm, index) as number;

		switch (this.operator) {
			case "++": dest.set(vm, original + 1, index); break;
			case "--": dest.set(vm, original - 1, index); break;
		}

		return null;
	}
}
