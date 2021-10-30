import * as assert from "../../assert";
import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import Slice from "../../slice";
import type VM from "../../vm";
import Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = X.expr;
type Operator = "*=" | "/=" | "%=" | "+=" | "-=" | "&=" | "|=" | "^=";
export default class AssignOpInt extends Statement {
	public dest: Variable;
	public operator: Operator;
	public arg: Lazy<Expr>;

	public constructor(dest: Variable, operator: Operator, raw: Slice) {
		super(raw);
		this.dest = dest;
		this.operator = operator;

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const dest = this.dest.getCell(vm);
		const index = await this.dest.reduceIndex(vm);
		const original = dest.get(vm, index) as bigint;
		const value = await this.arg.get().reduce(vm);
		assert.bigint(value, `Right operand of ${this.operator} should be a number`);

		switch (this.operator) {
			case "*=": dest.set(vm, original * value, index); break;
			case "/=": dest.set(vm, original / value, index); break;
			case "%=": dest.set(vm, original % value, index); break;
			case "+=": dest.set(vm, original + value, index); break;
			case "-=": dest.set(vm, original - value, index); break;
			// eslint-disable-next-line no-bitwise
			case "&=": dest.set(vm, original & value, index); break;
			// eslint-disable-next-line no-bitwise
			case "|=": dest.set(vm, original | value, index); break;
			// eslint-disable-next-line no-bitwise
			case "^=": dest.set(vm, original ^ value, index); break;
		}

		return null;
	}
}
